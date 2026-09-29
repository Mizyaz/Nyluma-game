import { app } from '../game/App';
import type { Action } from '../game/systems/InputSystem';
import { h, noClickFocus } from './dom';

export interface Fragment {
  art: string;
  label: string;
}

export interface StationDef {
  title: string;
  sub: string;
  fragments: Fragment[];
}

/**
 * Memory station: three pictorial fragments are shown playing forward; the
 * player reverses their order by selecting and swapping (tap, drag or
 * keyboard). Replay and reset are always available.
 */
export class PuzzlePanel {
  private el: HTMLElement;
  private cardsEl: HTMLElement;
  private titleEl: HTMLElement;
  private subEl: HTMLElement;
  private statusEl: HTMLElement;
  private order: number[] = [];
  private def: StationDef | null = null;
  private sel = -1;
  private cursor = 0;
  private resolve: ((ok: boolean) => void) | null = null;
  private timers: number[] = [];
  /** The forward playback is running (any choice interrupts it). */
  private playing = false;
  private solved = false;
  private dragFrom = -1;
  private offKey: (() => void) | null = null;

  constructor(stage: HTMLElement) {
    this.titleEl = h('h3');
    this.subEl = h('p', { class: 'sub' });
    this.cardsEl = h('div', { class: 'cards' });
    this.statusEl = h('p', { class: 'sub', role: 'status' });
    const replay = h('button', { class: 'btn small center', type: 'button', text: 'Yeniden oynat' });
    noClickFocus(replay);
    replay.addEventListener('click', () => this.playForward());
    const reset = h('button', { class: 'btn small center', type: 'button', text: 'Sıfırla' });
    noClickFocus(reset);
    reset.addEventListener('click', () => {
      this.order = [0, 1, 2];
      this.sel = -1;
      this.render();
      app.audio.sfx('uiBack');
    });
    const close = h('button', { class: 'btn small center', type: 'button', html: '<b class="key">Esc</b>Kapat' });
    noClickFocus(close);
    close.addEventListener('click', () => this.close(false));
    this.el = h(
      'div',
      { class: 'puzzle hidden', role: 'dialog', 'aria-label': 'Anı istasyonu' },
      this.titleEl,
      this.subEl,
      this.cardsEl,
      this.statusEl,
      h('div', { class: 'row', style: 'justify-content:center' }, replay, reset, close),
    );
    stage.append(this.el);
  }

  get isOpen(): boolean {
    return this.resolve !== null;
  }

  open(def: StationDef): Promise<boolean> {
    this.def = def;
    this.order = [0, 1, 2];
    this.sel = -1;
    this.cursor = 0;
    this.solved = false;
    this.titleEl.textContent = def.title;
    this.subEl.textContent = def.sub;
    this.el.classList.remove('hidden');
    app.input.pushContext('puzzle');
    // Keys are handled as they arrive (in order), independent of frame rate.
    this.offKey = app.input.onKey((e, a) => this.onKey(e, a));
    this.render();
    this.playForward();
    return new Promise((res) => {
      this.resolve = res;
    });
  }

  private render(): void {
    if (!this.def) return;
    this.cardsEl.innerHTML = '';
    this.order.forEach((fi, pos) => {
      const f = this.def!.fragments[fi]!;
      const c = h(
        'button',
        { class: `card ${pos === this.sel ? 'sel' : ''}`, type: 'button', 'aria-label': `${pos + 1}. parça: ${f.label}` },
        h('span', { class: 'num', text: String(pos + 1) }),
        h('img', { src: f.art, alt: '' }),
        h('span', { text: f.label }),
      );
      if (pos === this.cursor) c.style.outline = '3px dashed var(--violet)';
      c.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.dragFrom = pos;
      });
      c.addEventListener('pointerup', (e) => {
        e.preventDefault();
        const from = this.dragFrom;
        this.dragFrom = -1;
        if (from >= 0 && from !== pos) this.swap(from, pos);
        else this.pick(pos);
      });
      c.addEventListener('keydown', (e) => e.preventDefault());
      this.cardsEl.append(c);
    });
  }

  private clearTimers(): void {
    for (const t of this.timers) window.clearTimeout(t);
    this.timers = [];
  }

  private playForward(): void {
    this.clearTimers();
    this.playing = true;
    this.statusEl.textContent = 'Anı ileriye akıyor…';
    const cards = (): HTMLElement[] => [...this.cardsEl.children] as HTMLElement[];
    [0, 1, 2].forEach((k) => {
      this.timers.push(
        window.setTimeout(() => {
          const pos = this.order.indexOf(k);
          cards().forEach((c) => c.classList.remove('play'));
          cards()[pos]?.classList.add('play');
          app.audio.sfx('clock');
        }, 300 + k * 700),
      );
    });
    this.timers.push(
      window.setTimeout(() => {
        this.stopPlayback();
      }, 300 + 3 * 700),
    );
  }

  private stopPlayback(): void {
    if (!this.playing) return;
    this.clearTimers();
    this.playing = false;
    for (const c of this.cardsEl.children) c.classList.remove('play');
    this.statusEl.textContent = 'Parçaları ters sıraya diz: anıyı geri sar.';
  }

  private pick(pos: number): void {
    if (!this.resolve || this.solved) return;
    this.stopPlayback();
    this.cursor = pos;
    if (this.sel < 0) {
      this.sel = pos;
      app.audio.sfx('ui');
      this.render();
      return;
    }
    if (this.sel === pos) {
      this.sel = -1;
      this.render();
      return;
    }
    this.swap(this.sel, pos);
  }

  private swap(a: number, b: number): void {
    if (this.solved) return;
    this.stopPlayback();
    const t = this.order[a]!;
    this.order[a] = this.order[b]!;
    this.order[b] = t;
    this.sel = -1;
    app.audio.sfx('paper');
    this.render();
    if (this.order[0] === 2 && this.order[1] === 1 && this.order[2] === 0) {
      this.statusEl.textContent = 'Anı geri sarıldı.';
      app.audio.sfx('songOk');
      this.solved = true;
      this.timers.push(window.setTimeout(() => this.close(true), 900));
    } else this.statusEl.textContent = '';
  }

  close(ok: boolean): void {
    if (!this.resolve) return;
    this.clearTimers();
    this.el.classList.add('hidden');
    this.offKey?.();
    this.offKey = null;
    app.input.popContext('puzzle');
    const r = this.resolve;
    this.resolve = null;
    r(ok);
  }

  private onKey(e: KeyboardEvent, a: Action[]): boolean {
    if (!this.resolve || app.input.context !== 'puzzle') return false;
    if (e.repeat) return true;
    if (a.includes('pause')) this.close(false);
    else if (a.includes('left')) {
      this.cursor = (this.cursor + 2) % 3;
      this.render();
    } else if (a.includes('right')) {
      this.cursor = (this.cursor + 1) % 3;
      this.render();
    } else if (a.includes('action') || a.includes('jump') || a.includes('confirm')) this.pick(this.cursor);
    else return false;
    return true;
  }
}
