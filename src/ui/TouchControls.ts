import { app } from '../engine/App';
import type { Action } from '../engine/systems/InputSystem';
import type { TouchHand, TouchMode } from '../engine/state/types';
import { TOUCH } from '../tuning';
import { h } from './dom';
import { buttonArt, edgeOf, knobArt, stickArt, stickInks, type ButtonArt } from './touchArt';
import { CHIPS, covers, touchLayout, type ChipKey, type ClearBox, type Disc, type TouchLayout } from './touchLayout';

export interface TouchAvail {
  focus: boolean;
  form: boolean;
  song: boolean;
  /** What the action button does here (the HUD prompt's word, or Rezonans). */
  actionLabel: string;
  /** Something to look at, talk to or break is beside him (else the action button makes the Rezonans move). */
  inspect?: boolean;
  jump: boolean;
}

type ButtonKey = 'jump' | 'action' | ChipKey;

/** The buttons: what they press, their label and their name for screen readers. */
const BUTTONS: Record<ButtonKey, { actions: Action[]; label: string; aria: string }> = {
  jump: { actions: ['jump'], label: 'Zıpla', aria: 'Zıpla' },
  action: { actions: ['action'], label: 'Eylem', aria: 'Eylem' },
  form: { actions: ['form'], label: 'Biçim', aria: 'Biçim değiştir' },
  song: { actions: ['song'], label: 'Şarkı', aria: 'Şarkı söyle' },
  focus: { actions: ['focus'], label: 'Nefes', aria: 'Nefesini tut' },
};

/** The action button's drawing for what it does here. */
function actionArt(label: string, inspect: boolean): ButtonArt {
  if (!inspect) return 'move';
  if (/^konuş/i.test(label)) return 'talk';
  if (/^yık/i.test(label)) return 'break';
  return 'inspect';
}

/** The word on a button's tag: the verb of a longer prompt ("Belgeyi incele" → "İncele"). */
function tagWord(label: string): string {
  const w = label.trim().split(/\s+/).pop() ?? '';
  return w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1);
}

const px = (n: number): string => `${Math.round(n * 10) / 10}px`;

function setDisc(el: HTMLElement, c: Disc): void {
  const s = el.style;
  s.left = px(c.x - c.d / 2);
  s.top = px(c.y - c.d / 2);
  s.width = s.height = px(c.d);
}

/** One of the round buttons: a real button, pressed by as many fingers as like. */
class TouchButton {
  readonly el: HTMLButtonElement;
  private face: HTMLElement;
  private tag: HTMLElement;
  private art: ButtonArt | '' = '';
  private pointers = new Set<number>();
  private lastUp = 0;
  shown = false;

  constructor(
    readonly key: ButtonKey,
    private onPress: () => void,
  ) {
    const b = BUTTONS[key];
    this.face = h('span', { class: 'tc-face' });
    this.tag = h('span', { class: 'tc-tag', 'aria-hidden': 'true', text: b.label });
    this.el = h('button', { type: 'button', class: `tc tc-${key === 'jump' || key === 'action' ? key : 'chip'} hidden`, 'data-key': key, 'aria-label': b.aria }, this.face, this.tag);
    this.draw(key === 'action' ? 'move' : key);
    const id = (pid: number | string): string => `touch:${key}:${pid}`;
    this.el.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      try {
        this.el.setPointerCapture(e.pointerId);
      } catch {
        // Already gone (a cancelled touch): it simply does not press.
      }
      if (this.pointers.has(e.pointerId)) return;
      this.pointers.add(e.pointerId);
      app.input.sourceDown(id(e.pointerId), b.actions);
      this.el.classList.add('held');
      this.onPress();
    });
    const end = (e: PointerEvent): void => {
      if (!this.pointers.delete(e.pointerId)) return;
      app.input.sourceUp(id(e.pointerId));
      this.lastUp = performance.now();
      if (!this.pointers.size) this.el.classList.remove('held');
    };
    this.el.addEventListener('pointerup', end);
    this.el.addEventListener('pointercancel', end);
    this.el.addEventListener('lostpointercapture', end);
    // Pressed without a finger (a screen reader, a switch): a short press.
    this.el.addEventListener('click', () => {
      if (this.pointers.size || performance.now() - this.lastUp < 600) return;
      app.input.sourceDown(id('click'), b.actions);
      this.el.classList.add('held');
      window.setTimeout(() => {
        app.input.sourceUp(id('click'));
        if (!this.pointers.size) this.el.classList.remove('held');
      }, 120);
    });
  }

  /** Redraws the button when what it does changes. */
  draw(art: ButtonArt, label = BUTTONS[this.key].label): void {
    if (art !== this.art) {
      this.art = art;
      this.face.innerHTML = buttonArt(art);
      this.el.dataset.look = art;
      this.el.style.setProperty('--edge', edgeOf(art));
    }
    const word = tagWord(label);
    if (this.tag.textContent !== word) this.tag.textContent = word;
    const aria = this.key === 'action' ? `${BUTTONS.action.aria}: ${label}` : BUTTONS[this.key].aria;
    if (this.el.getAttribute('aria-label') !== aria) this.el.setAttribute('aria-label', aria);
  }

  show(on: boolean): void {
    if (on === this.shown) return;
    this.shown = on;
    this.el.classList.toggle('hidden', !on);
    if (!on) this.release();
  }

  /** Lets go of every finger (hidden, or the page lost focus). */
  release(): void {
    for (const pid of this.pointers) app.input.sourceUp(`touch:${this.key}:${pid}`);
    this.pointers.clear();
    this.el.classList.remove('held');
  }
}

/**
 * The walking stick: a round paper dial under the left thumb. Its knob
 * follows the thumb (within the dial) and springs back when let go; left
 * and right walk past a small dead zone, up and down walk away from and
 * toward the viewer past a firmer one (TOUCH.stick). One finger steers it;
 * others landing on it are ignored.
 */
class TouchStick {
  readonly el: HTMLElement;
  private dial: HTMLElement;
  private knob: HTMLElement;
  private pid: number | null = null;
  private cx = 0;
  private cy = 0;
  private r = 1;
  private dir: { x: -1 | 0 | 1; y: -1 | 0 | 1 } = { x: 0, y: 0 };

  constructor(private onTurn: () => void) {
    this.dial = h('div', { class: 'tc-dial', html: stickArt() });
    this.knob = h('div', { class: 'tc-knob', html: knobArt() });
    this.el = h('div', { class: 'tc-stick', role: 'group', 'aria-label': 'Yön kolu: sürükleyerek yürü' }, this.dial, this.knob);
    for (const [k, v] of Object.entries(stickInks())) this.el.style.setProperty(k, v);
    this.el.style.setProperty('--knob', String(TOUCH.stick.knob));
    this.el.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      if (this.pid !== null) return;
      try {
        this.el.setPointerCapture(e.pointerId);
      } catch {
        return;
      }
      this.pid = e.pointerId;
      // Measured once per touch: the dial never moves under a thumb.
      const b = this.dial.getBoundingClientRect();
      this.cx = b.left + b.width / 2;
      this.cy = b.top + b.height / 2;
      this.r = Math.max(1, b.width / 2);
      this.el.classList.add('held');
      this.steer(e.clientX, e.clientY);
    });
    this.el.addEventListener('pointermove', (e) => {
      if (e.pointerId === this.pid) this.steer(e.clientX, e.clientY);
    });
    const end = (e: PointerEvent): void => {
      if (e.pointerId === this.pid) this.release();
    };
    this.el.addEventListener('pointerup', end);
    this.el.addEventListener('pointercancel', end);
    this.el.addEventListener('lostpointercapture', end);
  }

  private get id(): string {
    return `touch:stick:${this.pid}`;
  }

  private steer(x: number, y: number): void {
    const t = TOUCH.stick;
    const dx = x - this.cx;
    const dy = y - this.cy;
    // The knob goes where the thumb is, as far as the dial lets it.
    const len = Math.hypot(dx, dy);
    const max = t.travel * this.r;
    const k = len > max ? max / len : 1;
    this.knob.style.translate = `${px(dx * k)} ${px(dy * k)}`;
    // Hysteresis: a direction turns on past `on` and off again under `off`.
    const axis = (v: number, cur: -1 | 0 | 1, on: number, off: number): -1 | 0 | 1 => (cur !== 0 && v * cur >= off ? cur : v <= -on ? -1 : v >= on ? 1 : 0);
    const nx = axis(dx / this.r, this.dir.x, t.walkOn, t.walkOff);
    const ny = axis(dy / this.r, this.dir.y, t.depthOn, t.depthOff);
    if (nx === this.dir.x && ny === this.dir.y) return;
    const turned = (nx !== 0 && nx !== this.dir.x) || (ny !== 0 && ny !== this.dir.y);
    this.dir = { x: nx, y: ny };
    const actions: Action[] = [];
    if (nx) actions.push(nx < 0 ? 'left' : 'right');
    if (ny) actions.push(ny < 0 ? 'up' : 'down');
    if (actions.length) app.input.sourceDown(this.id, actions);
    else app.input.sourceUp(this.id);
    this.el.dataset.dir = [nx < 0 ? 'l' : nx > 0 ? 'r' : '', ny < 0 ? 'u' : ny > 0 ? 'd' : ''].join(' ').trim();
    if (turned) this.onTurn();
  }

  /** Lets go: the knob springs back and nothing stays held. */
  release(): void {
    if (this.pid !== null) app.input.sourceUp(this.id);
    this.pid = null;
    this.dir = { x: 0, y: 0 };
    this.el.dataset.dir = '';
    this.el.classList.remove('held');
    this.knob.style.translate = '';
  }

  place(c: Disc & { reach: number }): void {
    setDisc(this.el, c);
    // The touch area reaches past the dial (see .tc-stick::before).
    this.el.style.setProperty('--reach', px(c.reach - c.d / 2));
  }
}

/**
 * The on-screen controls (touch devices only). Left thumb: the walking
 * stick. Right thumb: a big Zıpla button in the corner with the action
 * button (Rezonans, or İncele / Konuş / Yık beside something) and the
 * contextual chips (Biçim, Şarkı, Nefes) on an arc around it. Every
 * pointer is tracked by id with pointer capture, so sliding, cancelled or
 * lost touches never leave a key held. Sizes, places and dead zones come
 * from src/tuning.ts (TOUCH); the layout itself from ./touchLayout.
 */
export class TouchControls {
  private root: HTMLElement;
  private stick: TouchStick;
  private btns: Record<ButtonKey, TouchButton>;
  private mode: TouchMode = 'auto';
  private hand: TouchHand = TOUCH.hand;
  private sawTouch = false;
  private visibleCtx = false;
  private on = false;
  private avail: TouchAvail = { focus: false, form: false, song: false, actionLabel: '', jump: true };
  private lastBuzz = 0;
  /** The last layout (tests and the screenshot tools read it). */
  layoutNow: TouchLayout | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
    this.root.classList.add('off');
    this.stick = new TouchStick(() => this.buzz('turn'));
    const press = (): void => this.buzz('press');
    this.btns = {
      jump: new TouchButton('jump', press),
      action: new TouchButton('action', press),
      form: new TouchButton('form', press),
      song: new TouchButton('song', press),
      focus: new TouchButton('focus', press),
    };
    // Reading order: the stick, then the right thumb's buttons.
    this.root.append(this.stick.el, this.btns.jump.el, this.btns.action.el, ...CHIPS.map((c) => this.btns[c].el));
    // A long press must not open the page's own menus.
    this.root.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener(
      'touchstart',
      () => {
        if (!this.sawTouch) {
          this.sawTouch = true;
          this.refresh();
        }
      },
      { passive: true },
    );
    app.input.onFocusLost(() => this.releaseAll());
    this.layout();
    this.refresh();
  }

  /**
   * Places the controls for this screen (UI.sync calls it on every resize
   * and turn of the phone): measured from the game view, the subtitle
   * column and the safe areas.
   */
  layout(): void {
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (!W || !H) return;
    const portrait = document.getElementById('app')?.classList.contains('portrait') ?? H > W * 0.9;
    const view = document.querySelector('#game canvas')?.getBoundingClientRect();
    const stack = portrait ? null : document.querySelector('#stage .hud-stack')?.getBoundingClientRect();
    // #touch carries the safe-area insets as its padding (styles.css).
    const cs = getComputedStyle(this.root);
    const inset = (v: string): number => parseFloat(v) || 0;
    const l = touchLayout(
      {
        w: W,
        h: H,
        portrait,
        viewBottom: view && view.height ? view.bottom : portrait ? H * 0.4 : 0,
        column: stack && stack.width ? { left: stack.left, right: stack.right } : undefined,
        safe: { l: inset(cs.paddingLeft), r: inset(cs.paddingRight), t: inset(cs.paddingTop), b: inset(cs.paddingBottom) },
      },
      this.hand,
    );
    this.layoutNow = l;
    this.root.style.setProperty('--tk', l.k.toFixed(3));
    this.root.dataset.hand = this.hand;
    this.stick.place(l.stick);
    setDisc(this.btns.jump.el, l.jump);
    setDisc(this.btns.action.el, l.action);
    for (const c of CHIPS) setDisc(this.btns[c].el, l.chips[c]);
  }

  setMode(mode: TouchMode): void {
    this.mode = mode;
    this.refresh();
  }

  /** Which hand jumps: 'right' (the stick on the left) or 'left' (all mirrored). */
  setHand(hand: TouchHand): void {
    if (hand === this.hand) return;
    this.hand = hand;
    this.releaseAll();
    this.layout();
  }

  /** Shown only while gameplay-like contexts are active. */
  setGameplay(on: boolean): void {
    if (on === this.visibleCtx) return;
    this.visibleCtx = on;
    this.refresh();
  }

  setAvail(a: TouchAvail): void {
    const p = this.avail;
    const changed = a.focus !== p.focus || a.form !== p.form || a.song !== p.song || a.actionLabel !== p.actionLabel || !!a.inspect !== !!p.inspect || a.jump !== p.jump;
    this.avail = a;
    if (changed) this.refresh();
  }

  /** On the screen now (touch in use, during play). */
  get showing(): boolean {
    return this.on;
  }

  /**
   * A control lying over one of these (Gorti, a doorway he is at; CSS px)
   * turns see-through, so the picture shows under it; it still answers,
   * and pressed it is whole again.
   */
  keepClear(boxes: readonly ClearBox[]): void {
    const l = this.layoutNow;
    const set = (el: HTMLElement, c: Disc | undefined): void => {
      el.classList.toggle('clear', !!c && this.on && covers(c, boxes));
    };
    set(this.stick.el, l?.stick);
    set(this.btns.jump.el, l?.jump);
    set(this.btns.action.el, l?.action);
    for (const c of CHIPS) set(this.btns[c].el, l?.chips[c]);
  }

  get enabled(): boolean {
    if (this.mode === 'off') return false;
    if (this.mode === 'on') return true;
    return this.sawTouch || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  }

  /** Lets go of every finger on every control. */
  releaseAll(): void {
    this.stick.release();
    for (const b of Object.values(this.btns)) b.release();
  }

  private refresh(): void {
    // Texts and key caps switch to touch wording whenever touch is in use.
    const touchUi = this.enabled;
    if (document.documentElement.classList.contains('touch-ui') !== touchUi) {
      document.documentElement.classList.toggle('touch-ui', touchUi);
      // The subtitle column changes width with it.
      this.layout();
    }
    const on = touchUi && this.visibleCtx;
    if (on !== this.on) {
      this.on = on;
      this.root.classList.toggle('off', !on);
      // Hidden (a dialogue, a scene change): nothing stays pressed under it.
      if (!on) this.releaseAll();
    }
    const a = this.avail;
    this.btns.jump.show(a.jump);
    this.btns.action.show(true);
    this.btns.form.show(a.form);
    this.btns.song.show(a.song);
    this.btns.focus.show(a.focus);
    const label = a.actionLabel || BUTTONS.action.label;
    this.btns.action.draw(a.actionLabel ? actionArt(label, !!a.inspect) : 'move', label);
  }

  /** A light haptic tick (where the device has one), never with reduced motion. */
  private buzz(kind: 'press' | 'turn'): void {
    const ms = TOUCH.haptics[kind];
    if (!ms || app.settings.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const now = performance.now();
    if (now - this.lastBuzz < TOUCH.haptics.minGapMs) return;
    this.lastBuzz = now;
    const nav = navigator as Navigator & { userActivation?: { hasBeenActive: boolean } };
    // Before the first tap the browser refuses (and says so in the console).
    if (typeof nav.vibrate !== 'function' || nav.userActivation?.hasBeenActive === false) return;
    try {
      nav.vibrate(ms);
    } catch {
      // No vibration here.
    }
  }
}
