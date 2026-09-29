import { app } from '../game/App';
import type { Action } from '../game/systems/InputSystem';
import type { TouchMode } from '../game/state/types';
import { h, ICONS } from './dom';

export interface TouchAvail {
  focus: boolean;
  form: boolean;
  song: boolean;
  actionLabel: string;
  jump: boolean;
}

/**
 * On-screen controls: a two-way pad on the left, jump + action on the right,
 * and contextual focus/form/song buttons. Every pointer is tracked by id with
 * pointer capture, so a sliding or cancelled touch never leaves a key held.
 */
export class TouchControls {
  private root: HTMLElement;
  private pad: HTMLElement;
  private halves: HTMLElement[];
  private btns = new Map<string, HTMLElement>();
  private mode: TouchMode = 'auto';
  private sawTouch = false;
  private visibleCtx = false;
  private avail: TouchAvail = { focus: false, form: false, song: false, actionLabel: '', jump: true };

  constructor(root: HTMLElement) {
    this.root = root;
    this.halves = [h('div', { class: 'half', html: ICONS.left }), h('div', { class: 'half', html: ICONS.right })];
    this.pad = h('div', { class: 'tc-pad', 'aria-label': 'Yön' }, ...this.halves);
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
    const pointers = new Map<number, Action | null>();
    const id = (pid: number): string => `touch:pad:${pid}`;
    const which = (e: PointerEvent): Action | null => {
      const r = this.pad.getBoundingClientRect();
      if (e.clientY < r.top - 60 || e.clientY > r.bottom + 60) return null;
      return e.clientX < r.left + r.width / 2 ? 'left' : 'right';
    };
    const update = (): void => {
      const held = new Set([...pointers.values()]);
      this.halves[0]!.classList.toggle('held', held.has('left'));
      this.halves[1]!.classList.toggle('held', held.has('right'));
    };
    this.pad.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.pad.setPointerCapture(e.pointerId);
      const a = which(e);
      pointers.set(e.pointerId, a);
      if (a) app.input.sourceDown(id(e.pointerId), [a]);
      update();
    });
    this.pad.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return;
      const a = which(e);
      if (a === pointers.get(e.pointerId)) return;
      pointers.set(e.pointerId, a);
      if (a) app.input.sourceDown(id(e.pointerId), [a]);
      else app.input.sourceUp(id(e.pointerId));
      update();
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
    b.style.width = b.style.height = `${size}px`;
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

  layout(): void {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const small = Math.min(W, H) < 420;
    const m = small ? 12 : 22;
    const bottom = `calc(${m + 8}px + env(safe-area-inset-bottom, 0px))`;
    this.pad.style.left = `calc(${m}px + env(safe-area-inset-left, 0px))`;
    this.pad.style.bottom = bottom;
    const place = (key: string, right: number, bot: number): void => {
      const b = this.btns.get(key)!;
      b.style.right = `calc(${right}px + env(safe-area-inset-right, 0px))`;
      b.style.bottom = `calc(${bot}px + env(safe-area-inset-bottom, 0px))`;
    };
    place('jump', m, m + 8);
    place('action', m + 108, m + 30);
    place('focus', m + 14, m + 128);
    place('form', m + 112, m + 140);
    place('song', m + 196, m + 118);
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
