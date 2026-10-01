import { app } from '../engine/App';
import type { Action } from '../engine/systems/InputSystem';
import type { TouchMode } from '../engine/state/types';
import { h, ICONS } from './dom';

export interface TouchAvail {
  focus: boolean;
  form: boolean;
  song: boolean;
  actionLabel: string;
  jump: boolean;
}

/**
 * On-screen controls: a pad on the left (its halves walk left and right;
 * sliding the thumb up or down walks away or toward the viewer), jump + action on the right,
 * and contextual focus/form/song buttons. Every pointer is tracked by id with
 * pointer capture, so a sliding or cancelled touch never leaves a key held.
 */
export class TouchControls {
  private root: HTMLElement;
  private pad: HTMLElement;
  private halves: HTMLElement[];
  /** The marks above and below the pad: sliding there walks in depth. */
  private depthMarks: HTMLElement[];
  private btns = new Map<string, HTMLElement>();
  private mode: TouchMode = 'auto';
  private sawTouch = false;
  private visibleCtx = false;
  private avail: TouchAvail = { focus: false, form: false, song: false, actionLabel: '', jump: true };

  constructor(root: HTMLElement) {
    this.root = root;
    this.halves = [h('div', { class: 'half', html: ICONS.left }), h('div', { class: 'half', html: ICONS.right })];
    this.depthMarks = [h('div', { class: 'depth up', html: ICONS.left }), h('div', { class: 'depth down', html: ICONS.left })];
    this.pad = h('div', { class: 'tc-pad', 'aria-label': 'Yön' }, ...this.halves, ...this.depthMarks);
    this.root.append(this.pad);
    this.bindPad();
    this.makeBtn('jump', ['jump'], ICONS.jump, 'Zıpla', 92);
    this.makeBtn('action', ['action'], ICONS.action, 'Eylem', 92);
    this.makeBtn('focus', ['focus'], ICONS.focus, 'Nefes', 66);
    this.makeBtn('form', ['form'], ICONS.form, 'Biçim', 60);
    this.makeBtn('song', ['song'], ICONS.song, 'Şarkı', 60);
    window.addEventListener('touchstart', () => {
      if (!this.sawTouch) {
        this.sawTouch = true;
        this.refresh();
      }
    }, { passive: true });
    window.addEventListener('resize', () => this.layout());
    this.layout();
    this.refresh();
  }

  private bindPad(): void {
    const pointers = new Map<number, Action[]>();
    const id = (pid: number): string => `touch:pad:${pid}`;
    const which = (e: PointerEvent): Action[] => {
      const r = this.pad.getBoundingClientRect();
      if (e.clientY < r.top - 90 || e.clientY > r.bottom + 90) return [];
      const out: Action[] = [];
      // A narrow strip between the halves walks straight in depth.
      const dx = e.clientX - (r.left + r.width / 2);
      if (Math.abs(dx) > r.width * 0.05) out.push(dx < 0 ? 'left' : 'right');
      // Up or down from the pad's middle: away from or toward the viewer.
      const dy = e.clientY - (r.top + r.height / 2);
      if (dy < -r.height * 0.3) out.push('up');
      else if (dy > r.height * 0.3) out.push('down');
      return out;
    };
    const same = (a: readonly Action[], b: readonly Action[] | undefined): boolean => !!b && a.length === b.length && a.every((x, i) => x === b[i]);
    const update = (): void => {
      const held = new Set([...pointers.values()].flat());
      this.halves[0]!.classList.toggle('held', held.has('left'));
      this.halves[1]!.classList.toggle('held', held.has('right'));
      this.depthMarks[0]!.classList.toggle('held', held.has('up'));
      this.depthMarks[1]!.classList.toggle('held', held.has('down'));
    };
    const press = (pid: number, a: Action[]): void => {
      pointers.set(pid, a);
      if (a.length) app.input.sourceDown(id(pid), a);
      else app.input.sourceUp(id(pid));
      update();
    };
    this.pad.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.pad.setPointerCapture(e.pointerId);
      press(e.pointerId, which(e));
    });
    this.pad.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return;
      const a = which(e);
      if (same(a, pointers.get(e.pointerId))) return;
      press(e.pointerId, a);
    });
    const end = (e: PointerEvent): void => {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      app.input.sourceUp(id(e.pointerId));
      update();
    };
    this.pad.addEventListener('pointerup', end);
    this.pad.addEventListener('pointercancel', end);
    this.pad.addEventListener('lostpointercapture', end);
  }

  private makeBtn(key: string, actions: Action[], icon: string, label: string, size: number): void {
    const b = h('div', { class: 'tc', role: 'button', 'aria-label': label, html: icon + `<span>${label}</span>` });
    b.style.width = b.style.height = `calc(${size}px * var(--tk, 1))`;
    b.dataset.key = key;
    const active = new Set<number>();
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      active.add(e.pointerId);
      app.input.sourceDown(`touch:${key}:${e.pointerId}`, actions);
      b.classList.add('held');
    });
    const end = (e: PointerEvent): void => {
      if (!active.has(e.pointerId)) return;
      active.delete(e.pointerId);
      app.input.sourceUp(`touch:${key}:${e.pointerId}`);
      if (!active.size) b.classList.remove('held');
    };
    b.addEventListener('pointerup', end);
    b.addEventListener('pointercancel', end);
    b.addEventListener('lostpointercapture', end);
    this.root.append(b);
    this.btns.set(key, b);
  }

  /**
   * Sizes follow the screen. Held sideways, the buttons fan out to the left
   * of Zıpla; held upright (narrow), they stack in two columns above it so
   * nothing reaches the direction pad.
   */
  layout(): void {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const portrait = H > W * 0.9;
    const k = Math.min(1.15, Math.max(0.8, Math.min(W, H) / 412));
    this.root.style.setProperty('--tk', k.toFixed(3));
    const m = Math.min(W, H) < 420 ? 12 : 22;
    const u = (n: number): number => Math.round(n * k);
    const J = u(92);
    const A = u(92);
    const F = u(66);
    const S = u(60);
    const label = 20;
    const bottom = `calc(${m + 8}px + env(safe-area-inset-bottom, 0px))`;
    this.pad.style.left = `calc(${m}px + env(safe-area-inset-left, 0px))`;
    this.pad.style.bottom = bottom;
    const place = (key: string, right: number, bot: number): void => {
      const b = this.btns.get(key)!;
      b.style.right = `calc(${Math.round(right)}px + env(safe-area-inset-right, 0px))`;
      b.style.bottom = `calc(${Math.round(bot)}px + env(safe-area-inset-bottom, 0px))`;
    };
    place('jump', m, m + 8);
    if (portrait) {
      const row2 = m + 8 + J + label;
      place('action', m, row2);
      place('focus', m + J + 14, m + 8 + (J - F) / 2);
      place('form', m + J + 14, row2 + (A - S) / 2);
      place('song', m + J + 14, row2 + A + label);
    } else {
      place('action', m + J + 16, m + u(30));
      place('focus', m + (J - F) / 2, m + 8 + J + label);
      place('form', m + J + 16 + (A - S) / 2, m + u(30) + A + label);
      place('song', m + J + A + 36, m + u(30) + (A - S) / 2 + u(70));
    }
  }

  setMode(mode: TouchMode): void {
    this.mode = mode;
    this.refresh();
  }

  /** Shown only while gameplay-like contexts are active. */
  setGameplay(on: boolean): void {
    this.visibleCtx = on;
    this.refresh();
  }

  setAvail(a: TouchAvail): void {
    const changed =
      a.focus !== this.avail.focus || a.form !== this.avail.form || a.song !== this.avail.song || a.actionLabel !== this.avail.actionLabel || a.jump !== this.avail.jump;
    this.avail = a;
    if (changed) this.refresh();
  }

  get enabled(): boolean {
    if (this.mode === 'off') return false;
    if (this.mode === 'on') return true;
    return this.sawTouch || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  }

  private refresh(): void {
    // Texts and key caps switch to touch wording whenever touch is in use.
    document.documentElement.classList.toggle('touch-ui', this.enabled);
    const on = this.enabled && this.visibleCtx;
    this.root.classList.toggle('off', !on);
    if (!on) return;
    const show = (k: string, v: boolean): void => {
      this.btns.get(k)?.classList.toggle('hidden', !v);
    };
    show('focus', this.avail.focus);
    show('form', this.avail.form);
    show('song', this.avail.song);
    show('jump', this.avail.jump);
    const act = this.btns.get('action')!.querySelector('span')!;
    act.textContent = this.avail.actionLabel || 'Eylem';
  }
}
