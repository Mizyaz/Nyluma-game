import { app } from '../game/App';
import { h } from './dom';

export interface Line {
  who?: string;
  text: string;
  whisper?: boolean;
  portrait?: string;
}

const CPS: Record<string, number> = { slow: 24, normal: 45, fast: 95, instant: 1e9 };

/** Bottom dialogue box with typewriter text; one to three short boxes per beat. */
export class Dialogue {
  private el: HTMLElement;
  private nameEl: HTMLElement;
  private textEl: HTMLElement;
  private portraitEl: HTMLElement;
  private lines: Line[] = [];
  private idx = 0;
  private shown = 0;
  private full = '';
  private resolve: (() => void) | null = null;
  private open_ = false;
  private downAt = 0;

  constructor(stage: HTMLElement) {
    this.nameEl = h('div', { class: 'name' });
    this.textEl = h('div', { class: 'text' });
    this.portraitEl = h('div', { class: 'portrait hidden' });
    this.el = h(
      'div',
      { class: 'dialogue hidden', role: 'dialog', 'aria-live': 'polite' },
      this.portraitEl,
      h('div', { class: 'body' }, this.nameEl, this.textEl),
      h('div', { class: 'next', html: '<span class="kbd-only">▾ Boşluk / E</span><span class="touch-only">▾ Dokun</span>' }),
    );
    this.el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.downAt = performance.now();
    });
    const up = (e: PointerEvent): void => {
      e.preventDefault();
      const held = this.downAt ? performance.now() - this.downAt : 0;
      this.downAt = 0;
      if (held < 450) this.advance();
    };
    this.el.addEventListener('pointerup', up);
    this.el.addEventListener('pointercancel', () => {
      this.downAt = 0;
    });
    this.el.addEventListener('pointerleave', () => {
      this.downAt = 0;
    });
    stage.append(this.el);
  }

  /** How long the dialogue box has been pressed (hold-to-skip on touch). */
  pointerHeldMs(): number {
    return this.downAt ? performance.now() - this.downAt : 0;
  }

  get isOpen(): boolean {
    return this.open_;
  }

  /** Who is speaking the current line ('' for narration). */
  get speaker(): string {
    return this.open_ ? (this.lines[this.idx]?.who ?? '') : '';
  }

  /** True while the current line is still being typed out. */
  get typing(): boolean {
    return this.open_ && this.shown < this.full.length;
  }

  open(lines: Line[]): Promise<void> {
    if (this.open_) this.finish();
    this.lines = lines.filter((l) => l.text.length > 0);
    this.idx = 0;
    this.open_ = true;
    this.el.classList.remove('hidden');
    app.input.pushContext('dialogue');
    this.showLine();
    return new Promise((res) => {
      this.resolve = res;
    });
  }

  private showLine(): void {
    const l = this.lines[this.idx];
    if (!l) {
      this.finish();
      return;
    }
    this.nameEl.textContent = l.who ?? '';
    this.nameEl.classList.toggle('hidden', !l.who);
    this.textEl.classList.toggle('whisper', !!l.whisper);
    this.full = l.text;
    this.shown = 0;
    this.textEl.textContent = '';
    if (l.portrait) {
      this.portraitEl.innerHTML = '';
      this.portraitEl.append(h('img', { src: l.portrait, alt: '' }));
      this.portraitEl.classList.remove('hidden');
    } else this.portraitEl.classList.add('hidden');
    if (app.settings.textSpeed === 'instant') this.completeLine();
  }

  private completeLine(): void {
    this.shown = this.full.length;
    this.textEl.textContent = this.full;
  }

  advance(): void {
    if (!this.open_) return;
    if (this.shown < this.full.length) {
      this.completeLine();
      return;
    }
    app.audio.sfx('ui', { vol: 0.5 });
    this.idx++;
    if (this.idx >= this.lines.length) this.finish();
    else this.showLine();
  }

  /** Closes immediately (cutscene skip). */
  finish(): void {
    if (!this.open_) return;
    this.open_ = false;
    this.downAt = 0;
    this.el.classList.add('hidden');
    app.input.popContext('dialogue');
    const r = this.resolve;
    this.resolve = null;
    r?.();
  }

  tick(dt: number): void {
    if (!this.open_) return;
    if (this.shown < this.full.length) {
      const cps = CPS[app.settings.textSpeed] ?? 45;
      this.shown = Math.min(this.full.length, this.shown + (cps * dt) / 1000);
      this.textEl.textContent = this.full.slice(0, Math.floor(this.shown));
    }
    if (app.input.context !== 'dialogue') return;
    if (app.input.consume('jump') || app.input.consume('action') || app.input.consume('confirm')) this.advance();
  }
}
