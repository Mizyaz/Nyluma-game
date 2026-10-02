import { app } from '../engine/App';
import { h } from './dom';
import type { Who } from '../gameplay/actors/Celestial';

// Touching the Sun and the Moon (DOM over the game view; the sky scene
// tells it each frame where they show and acts on what it reports).
//
// - A tap (finger or mouse) on a face lights it up at once: the sky makes
//   it glow, react and chime.
// - Held for three seconds while play is free, a ring fills about it (the
//   manner of the "Geçmek için basılı tut" control), then it says a line
//   in a speech balloon beside it; Gorti may answer in his own. Let go
//   early and nothing is said.
// - During a dialogue, a cutscene or the pause menu a tap still lights it
//   up (through the menu's veil too), but holding it offers no line.
//
// The hit areas are circles on the faces only, clipped to the game view;
// the HUD, the dialogue, documents and menus lie above them and the touch
// controls (#touch) above everything, so none of them lose a touch. The
// HUD's buttons step aside along the top while a face shows under them
// (r08's big Sun). Pointer capture holds a press to its face; a cancelled,
// lost or dragged-off pointer ends it, so no hold can stick.

/** Where a face shows on the canvas (device px) and whether holding it may make it speak. */
export interface SkyTarget {
  x: number;
  y: number;
  r: number;
  talk: boolean;
}

export interface SkyTouchHandler {
  /** A tap or the start of a hold: it lights up. */
  poke(who: Who): void;
  /** Held long enough: it speaks. */
  speak(who: Who): void;
}

type Speaker = Who | 'gorti';

/** How long a face is held before it speaks, and when its ring shows (ms). */
const HOLD_MS = 3000;
const RING_AFTER = 220;
/** The smallest hit circle (CSS px radius), and how far beyond the face it reaches. */
const MIN_R = 24;
const REACH = 1.08;
/** How far a held pointer may wander off its face (share of the radius, at least `DRIFT_PX`). */
const DRIFT = 1.35;
const DRIFT_PX = 36;
/** Letters a second as a line is lettered in. */
const CPS = 34;
/** The ring: how far outside the hit circle it runs (CSS px), in a box this much bigger each side. */
const RING_GAP = 7;
const RING_PAD = 16;
/** Room the HUD's buttons keep from a face (CSS px, and a share of its radius for the Sun's rays and the hats), and how quickly they step aside. */
const DODGE_GAP = 10;
const DODGE_REACH = 0.22;
const DODGE_RATE = 7;

/** Balloon tails, as the dialogue's: from the balloon's left side (a face's), and from its bottom (Gorti's). */
const TAIL_SIDE = '<svg viewBox="0 0 26 30" preserveAspectRatio="none" aria-hidden="true"><path d="M26.5 4C18 7 9 7.5 1 5C9 11 17 17 26.5 25"/></svg>';
const TAIL_DOWN = '<svg viewBox="0 0 30 26" preserveAspectRatio="none" aria-hidden="true"><path d="M4 -.5C7 8 7.5 17 5 25C11 17 17 9 25 -.5"/></svg>';
const RING = '<svg class="sky-ring" aria-hidden="true"><circle class="ink"/><circle class="track"/><circle class="fill" pathLength="1"/></svg>';

interface Balloon {
  el: HTMLElement;
  /** The letters so far, and the rest of the line, laid out but not yet seen (so no word jumps a line as it is lettered). */
  shown: HTMLElement;
  rest: HTMLElement;
  /** The whole line at once, for screen readers. */
  spoken: HTMLElement;
  full: string;
  /** Its size, the whole line set (CSS px). */
  w: number;
  h: number;
  t: number;
  life: number;
  /** How many letters show. */
  count: number;
  /** Where each word starts, and how many have sounded. */
  starts: number[];
  words: number;
  onWord: ((word: string, last: boolean) => void) | null;
  on: boolean;
  /** Where its speaker was last seen (kept while its face is out of sight for a moment). */
  at: { x: number; y: number; r: number } | null;
  lost: number;
  /** Where it was placed (game-view CSS px). */
  rect: Placed | null;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A balloon's place, and the side its tail leaves from. */
type Side = 'l' | 'r' | 'b';
type Placed = Rect & { side: Side };

const overlap = (a: Rect, b: Rect): number => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

export class SkyTouch {
  readonly el: HTMLElement;
  /** The game view: the hit circles are clipped to it. */
  private readonly area: HTMLElement;
  private readonly hits: Record<Who, HTMLElement>;
  private readonly rings: Record<Who, SVGSVGElement>;
  private readonly fills: Record<Who, SVGCircleElement>;
  private readonly balloons: Record<Speaker, Balloon>;
  private handler: SkyTouchHandler | null = null;
  private targets: Record<Who, SkyTarget | null> = { sun: null, moon: null };
  /** Each circle as last placed (game-view CSS px). */
  private circles: Record<Who, { x: number; y: number; r: number } | null> = { sun: null, moon: null };
  private gorti: { x: number; y: number } | null = null;
  private hold: { who: Who; id: number; t0: number; x0: number; y0: number; ring: boolean } | null = null;
  /** The game view in the stage (CSS px), the stage on the page, and the canvas (device px). */
  private box = { gx: 0, gy: 0, gw: 1, gh: 1, sx: 0, sy: 0, cw: 1, ch: 1 };
  private last = performance.now();
  private free = false;
  /** The HUD's buttons: where they sit of their own (game-view CSS px; measured once per layout), and how far aside they are. */
  private readonly buttons: HTMLElement | null;
  private btn: Rect | null = null;
  private btnRetry = 0;
  private dodge = 0;

  constructor(stage: HTMLElement, hud: HTMLElement) {
    this.area = h('div', { class: 'sky-hits' });
    const hit = (who: Who): HTMLElement => {
      const el = h('div', { class: 'sky-hit hidden', 'data-who': who, 'aria-hidden': 'true', html: RING });
      this.area.append(el);
      this.bindHit(el, who);
      return el;
    };
    this.hits = { moon: hit('moon'), sun: hit('sun') };
    this.rings = {
      moon: this.hits.moon.querySelector<SVGSVGElement>('svg')!,
      sun: this.hits.sun.querySelector<SVGSVGElement>('svg')!,
    };
    this.fills = {
      moon: this.hits.moon.querySelector<SVGCircleElement>('circle.fill')!,
      sun: this.hits.sun.querySelector<SVGCircleElement>('circle.fill')!,
    };
    const balloon = (who: Speaker): Balloon => {
      const shown = h('span');
      const rest = h('span', { class: 'rest' });
      const spoken = h('span', { class: 'sr-only' });
      const el = h(
        'div',
        { class: 'sky-say', 'data-who': who, 'aria-live': 'polite' },
        spoken,
        h('span', { class: 'sky-say-text', 'aria-hidden': 'true' }, shown, rest),
        h('span', { class: 'tail side', html: TAIL_SIDE }),
        who === 'gorti' ? h('span', { class: 'tail down', html: TAIL_DOWN }) : null,
      );
      return { el, shown, rest, spoken, full: '', w: 0, h: 0, t: 0, life: 0, count: 0, starts: [], words: 0, onWord: null, on: false, at: null, lost: 0, rect: null };
    };
    this.balloons = { moon: balloon('moon'), sun: balloon('sun'), gorti: balloon('gorti') };
    this.el = h('div', { class: 'sky-touch' }, this.area, this.balloons.moon.el, this.balloons.sun.el, this.balloons.gorti.el);
    // Under the HUD: its buttons always take their own touches.
    hud.before(this.el);
    this.buttons = hud.querySelector<HTMLElement>('.hud-right');
    // Over a menu's veil (the pause menu): a tap on the bare veil over a face still lights it up.
    stage.addEventListener('pointerdown', (e) => {
      const t = e.target as HTMLElement | null;
      if (!t?.classList.contains('screen') || !this.handler) return;
      const who = this.hitAt(e.clientX, e.clientY);
      if (who) this.handler.poke(who);
    });
    window.addEventListener('blur', () => this.letGo());
    document.addEventListener('visibilitychange', () => this.letGo());
  }

  /** The sky scene takes the faces' touches (one at a time). */
  attach(handler: SkyTouchHandler): void {
    this.handler = handler;
  }

  /** The sky has gone: nothing to touch, nothing said. */
  detach(): void {
    this.handler = null;
    this.letGo();
    this.targets = { sun: null, moon: null };
    for (const who of ['sun', 'moon'] as const) {
      this.hits[who].classList.add('hidden');
      this.circles[who] = null;
    }
    for (const b of Object.values(this.balloons)) this.hush(b, true);
    this.dodge = 0;
    this.buttons?.style.removeProperty('--dodge');
  }

  /** Measures the game view (the UI calls it whenever the layout changes). */
  layout(): void {
    const stage = this.el.parentElement;
    const canvas = document.querySelector<HTMLCanvasElement>('#game canvas');
    if (!stage || !canvas) return;
    const s = stage.getBoundingClientRect();
    const r = canvas.getBoundingClientRect();
    this.box = { gx: r.left - s.left, gy: r.top - s.top, gw: Math.max(1, r.width), gh: Math.max(1, r.height), sx: s.left, sy: s.top, cw: Math.max(1, canvas.width), ch: Math.max(1, canvas.height) };
    const a = this.area.style;
    a.left = `${this.box.gx}px`;
    a.top = `${this.box.gy}px`;
    a.width = `${this.box.gw}px`;
    a.height = `${this.box.gh}px`;
    this.btn = null;
  }

  /**
   * Once a frame from the sky: where each face shows (canvas device px; null
   * when it cannot be touched), where Gorti's head is, and whether play is
   * free (balloons go when it is not).
   */
  frame(targets: Record<Who, SkyTarget | null>, gorti: { x: number; y: number } | null, free: boolean): void {
    const now = performance.now();
    const dt = Math.min(100, Math.max(0, now - this.last));
    this.last = now;
    this.targets = targets;
    this.free = free;
    const b = this.box;
    const kx = b.gw / b.cw;
    const ky = b.gh / b.ch;
    this.gorti = gorti ? { x: gorti.x * kx, y: gorti.y * ky } : null;
    for (const who of ['sun', 'moon'] as const) {
      const t = targets[who];
      const el = this.hits[who];
      if (!t) {
        if (this.circles[who]) {
          el.classList.add('hidden');
          this.circles[who] = null;
        }
        if (this.hold?.who === who) this.letGo();
        continue;
      }
      const x = t.x * kx;
      const y = t.y * ky;
      // Generous but on the face only, and never down among the controls.
      let r = Math.max(MIN_R, t.r * kx * REACH);
      r = Math.max(MIN_R, Math.min(r, b.gh * 0.62 - y));
      const c = this.circles[who];
      if (!c || Math.abs(c.x - x) > 0.4 || Math.abs(c.y - y) > 0.4 || Math.abs(c.r - r) > 0.4) {
        el.style.width = el.style.height = `${(2 * r).toFixed(1)}px`;
        el.style.translate = `${(x - r).toFixed(1)}px ${(y - r).toFixed(1)}px`;
        if (!c || Math.abs(c.r - r) > 0.4) this.sizeRing(who, r);
        this.circles[who] = { x, y, r };
      }
      if (!c) el.classList.remove('hidden');
    }
    this.holding();
    this.dodgeButtons(dt);
    for (const who of ['sun', 'moon', 'gorti'] as const) this.balloonFrame(who, dt);
  }

  /** Where the HUD's buttons sit of their own (game-view CSS px), null while the HUD is hidden. */
  private buttonsAt(dt: number): Rect | null {
    if (this.btn || !this.buttons) return this.btn;
    // Measured once it shows (a hidden HUD is tried again now and then).
    if ((this.btnRetry -= dt) > 0) return null;
    this.btnRetry = 500;
    const r = this.buttons.getBoundingClientRect();
    if (r.width <= 0) return null;
    const b = this.box;
    this.btn = { x: r.left - b.sx - b.gx - this.dodge, y: r.top - b.sy - b.gy, w: r.width, h: r.height };
    return this.btn;
  }

  /** The buttons step aside along the top, to the nearest clear place, while a face shows under them. */
  private dodgeButtons(dt: number): void {
    const b = this.buttonsAt(dt);
    let want = 0;
    if (b) {
      const faces = [this.circles.sun, this.circles.moon].filter((c): c is { x: number; y: number; r: number } => !!c).map((c) => ({ ...c, r: c.r * (1 + DODGE_REACH) }));
      const clear = (dx: number): boolean =>
        faces.every((c) => {
          const nx = Math.max(b.x + dx - DODGE_GAP, Math.min(c.x, b.x + dx + b.w + DODGE_GAP));
          const ny = Math.max(b.y - DODGE_GAP, Math.min(c.y, b.y + b.h + DODGE_GAP));
          return Math.hypot(c.x - nx, c.y - ny) > c.r;
        });
      if (!clear(0)) {
        const m = 6;
        const fits = (dx: number): boolean => b.x + dx >= m && b.x + dx + b.w <= this.box.gw - m;
        // Just clear of either side of a face (a pixel more, so that the place found counts as clear).
        const tries = faces.flatMap((c) => [c.x - c.r - DODGE_GAP - 1 - (b.x + b.w), c.x + c.r + DODGE_GAP + 1 - b.x]).filter((dx) => fits(dx) && clear(dx));
        want = tries.reduce((best, dx) => (Math.abs(dx) < Math.abs(best) ? dx : best), tries[0] ?? 0);
      }
    }
    const k = app.settings.reducedMotion ? 1 : 1 - Math.exp(-(dt / 1000) * DODGE_RATE);
    const next = Math.abs(want - this.dodge) < 0.5 ? want : this.dodge + (want - this.dodge) * k;
    if (next === this.dodge || !this.buttons) return;
    this.dodge = next;
    this.buttons.style.setProperty('--dodge', `${next.toFixed(1)}px`);
  }

  /** The ring about a face of radius `r` (CSS px), drawn in px. */
  private sizeRing(who: Who, r: number): void {
    const svg = this.rings[who];
    const size = 2 * (r + RING_PAD);
    svg.setAttribute('viewBox', `0 0 ${size.toFixed(1)} ${size.toFixed(1)}`);
    svg.style.width = svg.style.height = `${size.toFixed(1)}px`;
    svg.style.left = svg.style.top = `${-RING_PAD}px`;
    for (const c of svg.querySelectorAll('circle')) {
      c.setAttribute('cx', (size / 2).toFixed(1));
      c.setAttribute('cy', (size / 2).toFixed(1));
      c.setAttribute('r', (r + RING_GAP).toFixed(1));
    }
  }

  /** Says a line in a balloon by the speaker for `ms`; `onWord` sounds each word as it is lettered. */
  say(who: Speaker, text: string, ms: number, onWord: ((word: string, last: boolean) => void) | null = null): void {
    const b = this.balloons[who];
    b.full = text;
    b.t = 0;
    b.life = ms;
    b.words = 0;
    b.onWord = onWord;
    b.lost = 0;
    b.starts = [];
    for (const m of text.matchAll(/\S+/g)) b.starts.push(m.index ?? 0);
    // The whole line is set from the start, as a letterer would, and lettered in.
    b.count = app.settings.reducedMotion ? text.length : 0;
    b.shown.textContent = text.slice(0, b.count);
    b.rest.textContent = text.slice(b.count);
    b.spoken.textContent = text;
    b.w = b.el.offsetWidth;
    b.h = b.el.offsetHeight;
    b.on = true;
    b.at = null;
    b.el.classList.remove('out');
    b.el.classList.add('show');
  }

  private bindHit(el: HTMLElement, who: Who): void {
    el.addEventListener('pointerdown', (e) => {
      if (!this.handler || !this.targets[who]) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      if (this.hold) this.letGo();
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* the pointer is already gone */
      }
      this.hold = { who, id: e.pointerId, t0: performance.now(), x0: e.clientX, y0: e.clientY, ring: false };
      this.fills[who].style.strokeDasharray = '0 1';
      el.classList.add('pressed');
      this.handler.poke(who);
    });
    el.addEventListener('pointermove', (e) => {
      const hd = this.hold;
      const c = this.circles[who];
      if (!hd || hd.id !== e.pointerId || !c) return;
      if (Math.hypot(e.clientX - hd.x0, e.clientY - hd.y0) > Math.max(c.r * DRIFT, DRIFT_PX)) this.letGo();
    });
    const end = (e: PointerEvent): void => {
      if (this.hold?.id === e.pointerId) this.letGo();
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /** The held face's ring fills while it may speak; full, it speaks. */
  private holding(): void {
    const hd = this.hold;
    if (!hd) return;
    const t = this.targets[hd.who];
    const el = this.hits[hd.who];
    const held = performance.now() - hd.t0;
    if (!t?.talk) {
      // Nothing is offered now (a dialogue, a cutscene, a menu): the ring goes.
      if (hd.ring) {
        hd.ring = false;
        el.classList.remove('holding');
      }
      return;
    }
    if (held < RING_AFTER) return;
    if (!hd.ring) {
      hd.ring = true;
      el.classList.add('holding');
    }
    const p = Math.min(1, (held - RING_AFTER) / (HOLD_MS - RING_AFTER));
    this.fills[hd.who].style.strokeDasharray = `${p.toFixed(3)} 1`;
    if (held >= HOLD_MS) {
      const who = hd.who;
      this.letGo(true);
      this.handler?.speak(who);
    }
  }

  /** Ends a press (released, cancelled, dragged off, or spoken). */
  private letGo(spoke = false): void {
    const hd = this.hold;
    if (!hd) return;
    this.hold = null;
    const el = this.hits[hd.who];
    el.classList.remove('pressed', 'holding');
    // Spoken, the full ring swells away; let go early, the part filled fades.
    if (spoke) {
      el.classList.remove('spoke');
      void el.offsetWidth;
      el.classList.add('spoke');
    }
    try {
      if (el.hasPointerCapture(hd.id)) el.releasePointerCapture(hd.id);
    } catch {
      /* already released */
    }
  }

  /** The face under a point of the page, if any. */
  private hitAt(cx: number, cy: number): Who | null {
    const x = cx - this.box.sx - this.box.gx;
    const y = cy - this.box.sy - this.box.gy;
    for (const who of ['sun', 'moon'] as const) {
      const c = this.circles[who];
      if (c && Math.hypot(x - c.x, y - c.y) <= c.r) return who;
    }
    return null;
  }

  /** Letters a balloon in, keeps it by its speaker, and lets it go in time. */
  private balloonFrame(who: Speaker, dt: number): void {
    const b = this.balloons[who];
    if (!b.on) return;
    b.t += dt;
    if (b.t >= b.life || !this.free) {
      this.hush(b);
      return;
    }
    if (b.count < b.full.length) {
      const count = Math.min(b.full.length, Math.floor((b.t / 1000) * CPS));
      if (count !== b.count) {
        b.count = count;
        b.shown.textContent = b.full.slice(0, count);
        b.rest.textContent = b.full.slice(count);
      }
    }
    while (b.words < b.starts.length && b.starts[b.words]! <= b.count) {
      const at = b.starts[b.words]!;
      const word = b.full.slice(at).match(/^\S+/)?.[0] ?? '';
      b.words++;
      b.onWord?.(word, b.words === b.starts.length);
    }
    // By its speaker: beside a face, toward the middle; above Gorti's head.
    let at: { x: number; y: number; r: number } | null = null;
    if (who === 'gorti') at = this.gorti ? { ...this.gorti, r: 0 } : null;
    else at = this.circles[who];
    if (at) {
      b.at = at;
      b.lost = 0;
    } else if ((b.lost += dt) > 350 || !b.at) {
      this.hush(b);
      return;
    }
    this.placeBalloon(b, who, b.at!);
  }

  private placeBalloon(b: Balloon, who: Speaker, at: { x: number; y: number; r: number }): void {
    const { gx, gy, gw, gh } = this.box;
    const m = 6;
    const fit = (side: Side, x: number, y: number): Placed => ({
      side,
      x: Math.max(m, Math.min(gw - b.w - m, x)),
      y: Math.max(m, Math.min(gh - b.h - m, y)),
      w: b.w,
      h: b.h,
    });
    let p: Placed;
    if (who === 'gorti') {
      // Over his head; beside it when a face's balloon is there already.
      const tries = [fit('b', at.x - b.w * 0.35, at.y - b.h - 16), fit('l', at.x + 30, at.y - b.h * 0.5), fit('r', at.x - 30 - b.w, at.y - b.h * 0.5)];
      // The side it has already, unless another is clearer (no hopping about as he walks).
      const was = b.rect?.side ?? 'b';
      tries.sort((u, v) => Number(v.side === was) - Number(u.side === was));
      const others = [this.balloons.moon.rect, this.balloons.sun.rect].filter((r): r is Placed => !!r);
      const clash = (r: Rect): number => others.reduce((s, o) => s + overlap(r, { x: o.x - 6, y: o.y - 6, w: o.w + 12, h: o.h + 12 }), 0);
      p = tries.reduce((best, r) => (clash(r) < clash(best) ? r : best));
    } else {
      const right = at.x < gw / 2;
      p = fit(right ? 'l' : 'r', right ? at.x + at.r * 0.78 + 14 : at.x - at.r * 0.78 - 14 - b.w, at.y - b.h * 0.42);
    }
    b.rect = p;
    // The tail points at the speaker from the balloon's near side.
    const tail = p.side === 'b' ? Math.max(14, Math.min(b.w - 14, at.x - p.x)) : Math.max(12, Math.min(b.h - 12, at.y - p.y));
    b.el.dataset.side = p.side;
    b.el.style.setProperty('--tail', `${tail.toFixed(0)}px`);
    b.el.style.translate = `${(gx + p.x).toFixed(1)}px ${(gy + p.y).toFixed(1)}px`;
  }

  private hush(b: Balloon, now = false): void {
    if (!b.on && !now) return;
    b.on = false;
    b.onWord = null;
    b.rect = null;
    b.el.classList.remove('show');
    if (!now) b.el.classList.add('out');
    else b.el.classList.remove('out');
  }
}
