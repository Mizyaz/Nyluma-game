import { app } from '../engine/App';
import { NAMES } from '../content/data/dialogue.tr';
import { h } from './dom';

export interface Line {
  who?: string;
  text: string;
  whisper?: boolean;
  portrait?: string;
}

const CPS: Record<string, number> = { slow: 24, normal: 45, fast: 95, instant: 1e9 };

/** Speaker name → its key in NAMES (the name tag takes that speaker's pastel). */
const WHO = new Map<string, string>(Object.entries(NAMES).map(([k, v]) => [v, k]));

/** The speech balloon's tail (UI aims it at the speaker). */
const TAIL = '<svg viewBox="0 0 30 26" preserveAspectRatio="none"><path d="M4 26.5C7 18 7.5 9 5 1c6 8 12 16 20 25.5"/></svg>';

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
  /** Where each word of the current line starts, and how many have appeared. */
  private wordStarts: number[] = [];
  private wordsShown = 0;
  /** Called as each word starts to appear (a voice sound per word). */
  onWord: ((word: string, index: number, line: Line) => void) | null = null;
  /** Lines asked for while a chapter page is up: they wait for it to open. */
  private waiting: { lines: Line[]; resolve: () => void; watch: MutationObserver } | null = null;

  constructor(private readonly stage: HTMLElement) {
    this.nameEl = h('div', { class: 'name' });
    this.textEl = h('div', { class: 'text' });
    this.portraitEl = h('div', { class: 'portrait hidden' });
    this.el = h(
      'div',
      { class: 'dialogue hidden', role: 'dialog', 'aria-live': 'polite' },
      h('span', { class: 'tail', 'aria-hidden': 'true', html: TAIL }),
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

  /** The line on screen (null when closed). */
  get current(): Line | null {
    return this.open_ ? (this.lines[this.idx] ?? null) : null;
  }

  /** True while the current line is still being typed out. */
  get typing(): boolean {
    return this.open_ && this.shown < this.full.length;
  }

  open(lines: Line[]): Promise<void> {
    // While a chapter page is up (WarpScene) the room behind it cannot be
    // seen yet: what is said there waits until the page opens.
    if (this.stage.classList.contains('pt-chapter')) return this.later(lines);
    if (this.open_) this.finish();
    this.lines = lines.filter((l) => l.text.length > 0);
    this.idx = 0;
    this.open_ = true;
    this.el.classList.remove('hidden');
    // Subtitles and toasts share the dialogue's place on screen: they wait.
    document.documentElement.classList.add('dialogue-open');
    app.input.pushContext('dialogue');
    this.showLine();
    return new Promise((res) => {
      this.resolve = res;
    });
  }

  private later(lines: Line[]): Promise<void> {
    this.drop();
    return new Promise((resolve) => {
      const watch = new MutationObserver(() => {
        if (this.stage.classList.contains('pt-chapter')) return;
        const w = this.waiting;
        this.drop(false);
        if (w) void this.open(w.lines).then(w.resolve);
      });
      watch.observe(this.stage, { attributes: true, attributeFilter: ['class'] });
      this.waiting = { lines, resolve, watch };
    });
  }

  /** Forgets lines still waiting for a chapter page to open (`settle`: as if they had been read). */
  private drop(settle = true): void {
    const w = this.waiting;
    if (!w) return;
    this.waiting = null;
    w.watch.disconnect();
    if (settle) w.resolve();
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
    // Balloon for speech (dashed when whispered), narration box without a speaker.
    this.el.dataset.who = WHO.get(l.who ?? '') ?? '';
    this.el.classList.toggle('narration', !l.who);
    this.el.classList.toggle('whisper', !!l.whisper);
    this.full = l.text;
    this.shown = 0;
    this.textEl.textContent = '';
    this.wordStarts = [];
    for (let i = 0; i < l.text.length; i++) if (!/\s/.test(l.text[i]!) && (i === 0 || /\s/.test(l.text[i - 1]!))) this.wordStarts.push(i);
    this.wordsShown = 0;
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
    // Words shown all at once make no sound of their own.
    this.wordsShown = this.wordStarts.length;
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
    this.drop();
    if (!this.open_) return;
    this.open_ = false;
    this.downAt = 0;
    this.el.classList.add('hidden');
    document.documentElement.classList.remove('dialogue-open');
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
      while (this.wordsShown < this.wordStarts.length && this.wordStarts[this.wordsShown]! < this.shown) {
        const at = this.wordStarts[this.wordsShown]!;
        const end = this.full.slice(at).search(/\s/);
        const line = this.lines[this.idx];
        if (line) this.onWord?.(this.full.slice(at, end < 0 ? undefined : at + end), this.wordsShown, line);
        this.wordsShown++;
      }
    }
    if (app.input.context !== 'dialogue') return;
    if (app.input.consume('jump') || app.input.consume('action') || app.input.consume('confirm')) this.advance();
  }
}
