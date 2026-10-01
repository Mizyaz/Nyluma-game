import { h } from './dom';
import { FLAT, bendOf, hoverPose, layStripsAt, liftPose, pointAt, reach, screenX, shadeAt, turnPose, type Pose, type StripPlace } from './pageCurl';

// A page of the storybook turning over, in real 3D: the frame just shown is
// cut into vertical strips of paper, and CSS places each strip in
// perspective along the curve of the page (pageCurl.ts), with its printed
// face, its back (paper, the print showing faintly through, hatched in its
// shadow), a glint along the curl and the paper's thickness at the free
// edge. Every motion is a Web Animation on transform and opacity only, so
// the browser's compositor runs it smoothly even while the next room is
// being built on the main thread.

const r2 = (n: number): string => (Math.round(n * 100) / 100).toString();
const deg = (a: number): string => r2((a * 180) / Math.PI);

/**
 * Plays the transition's animations. Normally they run on the document's
 * timeline; with `window.__kdManualClock` set (the frame-by-frame harness)
 * they are paused and follow `tick` instead, so stepped frames show them
 * exactly where the game is.
 */
export class Clock {
  readonly manual: boolean;
  private now = 0;
  private list: { a: Animation; at: number }[] = [];
  private timers: { at: number; fn: () => void }[] = [];

  constructor() {
    this.manual = !!(window as unknown as { __kdManualClock?: boolean }).__kdManualClock;
  }

  /** Seconds since the transition began (the controller's time). */
  get t(): number {
    return this.now;
  }

  play(el: Element, frames: Keyframe[], o: { duration: number; delay?: number; iterations?: number; easing?: string; fill?: FillMode }): Animation {
    const a = el.animate(frames, { duration: Math.max(1, o.duration), delay: o.delay ?? 0, iterations: o.iterations ?? 1, easing: o.easing ?? 'linear', fill: o.fill ?? 'both' });
    this.list.push({ a, at: this.now });
    if (this.manual) {
      a.pause();
      a.currentTime = 0;
    }
    return a;
  }

  /** Calls `fn` once the controller's time has gone `s` seconds on from now. */
  after(s: number, fn: () => void): void {
    this.timers.push({ at: this.now + s, fn });
  }

  tick(t: number): void {
    this.now = t;
    if (this.timers.length) {
      const due = this.timers.filter((e) => e.at <= t);
      if (due.length) {
        this.timers = this.timers.filter((e) => e.at > t);
        for (const e of due) e.fn();
      }
    }
    if (!this.manual) return;
    for (const e of this.list) {
      if (e.a.playState === 'idle') continue;
      e.a.currentTime = Math.max(0, (t - e.at) * 1000);
    }
  }

  /** Where an animation is in its own time (ms). */
  timeOf(a: Animation | null): number {
    if (!a) return 0;
    const c = a.currentTime;
    return typeof c === 'number' ? c : 0;
  }

  forget(a: Animation): void {
    a.cancel();
    this.list = this.list.filter((e) => e.a !== a);
  }

  clear(): void {
    for (const e of this.list) e.a.cancel();
    this.list = [];
    this.timers = [];
  }
}

/** A rectangle in the transition layer (CSS px). */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface StripEl {
  el: HTMLElement;
  sh: HTMLElement;
  gl: HTMLElement;
  bsh: HTMLElement;
  bgl: HTMLElement;
}

/** The shadows' own width (CSS px): they are drawn this wide and scaled. */
const SHADOW_W = 200;

/** Strips in a page: about one every 26 CSS px, within bounds. */
function stripCount(w: number): number {
  return Math.max(16, Math.min(44, Math.round(w / 26)));
}

/** Perspective of the book, as a multiple of its width (smaller: stronger). */
const PERSPECTIVE = 1.5;

/** The phases' keyframe counts (more: smoother curves between samples). */
const SAMPLES = { lift: 18, hover: 20, turn: 44 } as const;
/** One breath of the held curl (s). */
const HOVER_S = 2 * Math.PI / 5.2;

export class Leaf {
  readonly el: HTMLElement;
  private readonly leaf: HTMLElement;
  private readonly strips: StripEl[] = [];
  private readonly edge: HTMLElement;
  private readonly shadow: HTMLElement;
  /** The roll's outline, inked where it turns away out of sight. */
  private readonly ink: HTMLElement;
  /** The shadow the rolled-over part throws on the page beneath, beyond its free edge. */
  private readonly tipShadow: HTMLElement;
  private readonly n: number;
  /** Where the strips are cut, px from the spine (n + 1 of them, 0 to the page's width). */
  private readonly bounds: number[] = [];
  private readonly persp: number;
  private hover: Animation | null = null;
  private live: Animation[] = [];
  private tmp: StripPlace[] = [];

  /**
   * A page over `rect` printed with `source` (null: plain paper); `dir`: the
   * way its free edge points (1: right, the page turns over to the left).
   * `flat`: it will only fade (one piece, nothing to bend).
   */
  constructor(
    private readonly clock: Clock,
    parent: HTMLElement,
    readonly rect: Rect,
    source: HTMLCanvasElement | null,
    readonly dir: 1 | -1,
    flat = false,
  ) {
    const { w, h: ht } = rect;
    this.n = flat ? 1 : stripCount(w);
    this.persp = w * PERSPECTIVE;
    this.el = h('div', { class: 'pt-book' });
    this.el.style.cssText = `left:${r2(rect.x)}px;top:${r2(rect.y)}px;width:${r2(w)}px;height:${r2(ht)}px;perspective:${r2(this.persp)}px`;
    this.shadow = h('i', { class: dir > 0 ? 'pt-gs' : 'pt-gs flip' });
    this.tipShadow = h('i', { class: dir > 0 ? 'pt-gs flip' : 'pt-gs' });
    // It hangs from the spine and turns with the page (see run).
    this.tipShadow.style.cssText = dir > 0 ? 'transform-origin:0 0 0' : `left:${r2(w - SHADOW_W)}px;transform-origin:100% 0 0`;
    this.leaf = h('div', { class: 'pt-leaf' });
    this.ink = h('i', { class: 'pt-ink' });
    this.el.append(this.shadow, this.leaf, this.ink);
    // On the page itself, just over it (the 3D order puts it under what lies on top).
    this.leaf.append(this.tipShadow);
    // Cut at whole pixels of the print, so the page shows it exactly while it lies flat.
    const sw = source ? source.width : Math.max(1, Math.round(w));
    const kx = w / sw;
    const cuts: number[] = [];
    for (let i = 0; i <= this.n; i++) cuts.push(Math.round((i * sw) / this.n));
    for (const c of cuts) this.bounds.push(c * kx);
    const ghost = source ? shrink(source, 0.25) : null;
    for (let i = 0; i < this.n; i++) {
      // Columns of the print under strip i (one more toward the free edge: no seams).
      const x0 = dir > 0 ? cuts[i]! : Math.max(0, sw - cuts[i + 1]! - 1);
      const x1 = dir > 0 ? Math.min(sw, cuts[i + 1]! + 1) : sw - cuts[i]!;
      const strip = h('div', { class: 'pt-strip' });
      strip.style.cssText = `left:${r2(x0 * kx)}px;width:${r2((x1 - x0) * kx)}px;height:${r2(ht)}px;transform-origin:${dir > 0 ? '0' : '100%'} 50% 0`;
      const front = h('div', { class: 'pt-face pt-front' });
      if (source) front.append(slice(source, x0, x1));
      else front.classList.add('pt-plain');
      const sh = h('i', { class: 'pt-sh' });
      const gl = h('i', { class: 'pt-gl' });
      front.append(sh, gl);
      const back = h('div', { class: 'pt-face pt-back' });
      if (ghost) {
        const g = ghost.width / sw;
        const g0 = Math.floor(x0 * g);
        const gc = slice(ghost, g0, Math.min(ghost.width, Math.max(g0 + 1, Math.ceil(x1 * g))));
        gc.className = 'pt-ghost';
        back.append(gc);
      }
      const bsh = h('i', { class: 'pt-sh' });
      const bgl = h('i', { class: 'pt-gl' });
      back.append(bsh, bgl);
      // The paper's cut edge along the free side, seen once the page is over.
      if (i === this.n - 1) back.append(h('i', { class: dir > 0 ? 'pt-rim' : 'pt-rim r' }));
      strip.append(front, back);
      this.leaf.append(strip);
      this.strips.push({ el: strip, sh, gl, bsh, bgl });
    }
    // The paper's thickness along the free edge.
    this.edge = h('i', { class: 'pt-edge' });
    this.edge.style.height = `${r2(ht)}px`;
    this.edge.style.width = `${r2(this.thickness)}px`;
    this.leaf.append(this.edge);
    this.place(FLAT);
    parent.append(this.el);
  }

  private lay(p: Pose): StripPlace[] {
    return layStripsAt(p, this.bounds, this.rect.w, this.tmp);
  }

  /** Pose → each strip's transform (for keyframes). */
  private transforms(p: Pose): string[] {
    const places = this.lay(p);
    const out: string[] = [];
    for (let i = 0; i < this.n; i++) {
      const s = places[i]!;
      // From where the strip's spine-side edge lies flat to where the pose puts it.
      const dx = s.x - this.bounds[i]!;
      out.push(`translate3d(${r2(this.dir * dx)}px,0px,${r2(s.z)}px) rotateY(${deg(-this.dir * s.a)}deg)`);
    }
    return out;
  }

  /** The thickness edge at the free end, standing across the paper. */
  private edgeTransform(p: Pose): string {
    const places = this.lay(p);
    const last = places[this.n - 1]!;
    // The tip: the last strip's far end.
    const seg = this.rect.w - this.bounds[this.n - 1]!;
    const tx = last.x + Math.cos(last.a) * seg;
    const tz = last.z + Math.sin(last.a) * seg;
    // Across the paper (along its normal), centred on the tip: the element
    // lies at the book's left edge and turns about its own middle.
    const bx = this.dir > 0 ? tx : this.rect.w - tx;
    return `translate3d(${r2(bx - this.thickness / 2)}px,0px,${r2(tz)}px) rotateY(${deg(-this.dir * (last.a + Math.PI / 2))}deg)`;
  }

  private get thickness(): number {
    return Math.max(3, this.rect.w / 300);
  }

  /** Shows a pose at once (no animation). */
  place(p: Pose): void {
    const t = this.transforms(p);
    this.strips.forEach((s, i) => {
      s.el.style.transform = t[i]!;
    });
    this.edge.style.transform = this.edgeTransform(p);
  }

  /** Animates a run of poses: transforms, light, the paper's edge and the shadows it throws. */
  private run(pose: (u: number) => Pose, samples: number, ms: number, o: { delay?: number; iterations?: number } = {}): Animation[] {
    const frames: Keyframe[][] = this.strips.map(() => []);
    const shades: Keyframe[][] = this.strips.map(() => []);
    const glints: Keyframe[][] = this.strips.map(() => []);
    const backs: Keyframe[][] = this.strips.map(() => []);
    const backGlints: Keyframe[][] = this.strips.map(() => []);
    const edge: Keyframe[] = [];
    const ground: Keyframe[] = [];
    const outline: Keyframe[] = [];
    const tip: Keyframe[] = [];
    const w = this.rect.w;
    const dir = this.dir;
    for (let k = 0; k <= samples; k++) {
      const u = k / samples;
      const p = pose(u);
      const t = this.transforms(p);
      const places = this.tmp;
      // A sheen only on the roll itself: paper is matte, its flat parts never flash.
      const bend = bendOf(p, w);
      for (let i = 0; i < this.n; i++) {
        frames[i]!.push({ transform: t[i]!, offset: u });
        const s = shadeAt(places[i]!.a, dir);
        const mid = (this.bounds[i]! + this.bounds[i + 1]!) / 2;
        const onRoll = bend.l > 0 && mid > bend.b - 4 && mid < bend.b + bend.l + 4 ? 1 : 0.2;
        shades[i]!.push({ opacity: r2(s.front), offset: u });
        glints[i]!.push({ opacity: r2(s.glint * onRoll), offset: u });
        backs[i]!.push({ opacity: r2(s.back), offset: u });
        backGlints[i]!.push({ opacity: r2(s.backGlint * onRoll), offset: u });
      }
      edge.push({ transform: this.edgeTransform(p), offset: u });
      // On the page beneath, just beyond the page's reach: softer and wider the higher it rises.
      const r = reach(p, w, w, this.persp, dir);
      const lift = Math.min(1, r.top / (w * 0.25));
      const width = 16 + w * 0.03 + r.top * 0.5;
      const x = dir > 0 ? Math.min(w, r.edge) : Math.max(0, r.edge) - width;
      // Lifted away over the spine, it no longer shades the page beneath.
      const gone = Math.min(1, Math.max(0, (p.a0 - 1) / 0.7));
      const a = p.a0 > 2.9 ? 0 : (0.9 - 0.3 * lift) * Math.min(1, r.top / 8) * (1 - gone);
      ground.push({ transform: `translate3d(${r2(x)}px,0px,0px) scaleX(${r2(width / SHADOW_W)})`, opacity: r2(Math.max(0, a)), offset: u });
      // The roll's outline, in the paper's own darker tone, as tall as it shows (nearer, taller).
      const inked = r.top > 2 ? Math.min(1, (r.top - 2) / 10) * (1 - gone) : 0;
      const tall = this.persp / Math.max(1, this.persp - r.top * 0.5);
      outline.push({ transform: `translate3d(${r2(r.edge - 1)}px,0px,0px) scaleY(${tall.toFixed(3)})`, opacity: r2(inked), offset: u });
      // The rolled-over part's free edge, over the page: its shadow falls on
      // the part still lying there, toward the spine (the light is from the
      // upper right), softer the higher the edge. Laid in the page's own
      // frame: from the spine, tilted with it.
      const q = pointAt(p, w, w);
      const ca = Math.cos(p.a0);
      const sa = Math.sin(p.a0);
      const above = q.z * ca - q.x * sa;
      // Where the edge shows over the page (in perspective), a little toward the spine.
      const sx = screenX(q.x, q.z, w, this.persp, dir);
      const along = dir > 0 ? sx : w - sx;
      const tw = 12 + above * 0.9;
      const se = along - above * 0.04;
      const flatTo = bend.b;
      const ta = above > 2 && se > 0 && along < flatTo + 8 ? Math.min(0.75, above / 36) : 0;
      tip.push({ transform: `rotateY(${deg(-dir * p.a0)}deg) translate3d(${r2(dir * (se - tw))}px,0px,1px) scaleX(${r2(Math.max(0.01, tw / SHADOW_W))})`, opacity: r2(ta), offset: u });
    }
    const anims: Animation[] = [];
    const opt = { duration: ms, delay: o.delay ?? 0, iterations: o.iterations ?? 1, fill: (o.iterations ? 'none' : 'both') as FillMode };
    this.strips.forEach((s, i) => {
      anims.push(this.clock.play(s.el, frames[i]!, opt));
      anims.push(this.clock.play(s.sh, shades[i]!, opt));
      anims.push(this.clock.play(s.gl, glints[i]!, opt));
      anims.push(this.clock.play(s.bsh, backs[i]!, opt));
      anims.push(this.clock.play(s.bgl, backGlints[i]!, opt));
    });
    anims.push(this.clock.play(this.edge, edge, opt));
    anims.push(this.clock.play(this.shadow, ground, opt));
    anims.push(this.clock.play(this.ink, outline, opt));
    anims.push(this.clock.play(this.tipShadow, tip, opt));
    return anims;
  }

  /** The free edge is picked up and curls over; then it is held, breathing, until `turn`. */
  lift(ms: number): void {
    this.live.push(...this.run(liftPose, SAMPLES.lift, ms));
    const loop = this.run((u) => hoverPose(u * HOVER_S), SAMPLES.hover, HOVER_S * 1000, { delay: ms, iterations: Infinity });
    this.hover = loop[0] ?? null;
    this.live.push(...loop);
  }

  /** The held pose right now (where the breathing curl is). */
  private heldPose(): Pose {
    if (!this.hover) return liftPose(1);
    const t = this.clock.timeOf(this.hover);
    const lift = Number(this.hover.effect?.getTiming().delay ?? 0);
    if (t < lift) return liftPose(Math.max(0, t) / Math.max(1, lift));
    return hoverPose(((t - lift) / 1000) % HOVER_S);
  }

  /** Turns the page over and away. */
  turn(ms: number): void {
    const from = this.heldPose();
    for (const a of this.live) this.clock.forget(a);
    this.live = this.run((u) => turnPose(u, from), SAMPLES.turn, ms);
    this.hover = null;
  }

  /** Reduced motion: the page only fades away. */
  fade(ms: number, delay = 0): void {
    this.live.push(this.clock.play(this.el, [{ opacity: 1 }, { opacity: 0 }], { duration: ms, delay, easing: 'ease-in-out' }));
  }

  destroy(): void {
    for (const a of this.live) this.clock.forget(a);
    this.live = [];
    this.el.remove();
  }
}

/** A copy of columns [x0, x1) of a canvas. */
function slice(src: HTMLCanvasElement, x0: number, x1: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, x1 - x0);
  c.height = src.height;
  c.getContext('2d')?.drawImage(src, x0, 0, c.width, src.height, 0, 0, c.width, src.height);
  return c;
}

/** A smaller copy of a canvas. */
function shrink(src: HTMLCanvasElement, k: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(src.width * k));
  c.height = Math.max(1, Math.round(src.height * k));
  c.getContext('2d')?.drawImage(src, 0, 0, c.width, c.height);
  return c;
}
