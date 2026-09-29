import { app } from '../game/App';
import type { Note } from '../game/state/types';
import { h, NOTE_SVG } from './dom';

const NOTES: { id: Note; label: string; keys: string; action: 'note1' | 'note2' | 'note3' }[] = [
  { id: 'low', label: 'Derin', keys: '← / A', action: 'note1' },
  { id: 'mid', label: 'Orta', keys: '↓ / S', action: 'note2' },
  { id: 'high', label: 'Yüksek', keys: '→ / D', action: 'note3' },
];

const SFX = { low: 'noteLow', mid: 'noteMid', high: 'noteHigh' } as const;

export interface SongOpts {
  title: string;
  assist: boolean;
  /** World feedback for every sung note (demo or player). */
  onNote?: (n: Note, demo: boolean) => void;
}

/**
 * Call-and-response whale song. No rhythm requirement; a wrong note gently
 * resets the attempt. The pattern stays visible and can be replayed.
 */
export class SongPanel {
  private el: HTMLElement;
  private patternEl: HTMLElement;
  private statusEl: HTMLElement;
  private titleEl: HTMLElement;
  private btns = new Map<Note, HTMLButtonElement>();
  private assistBtn: HTMLButtonElement;
  private pattern: Note[] = [];
  private pos = 0;
  private demoTimers: number[] = [];
  private resolve: ((r: 'done' | 'closed') => void) | null = null;
  private opts: SongOpts | null = null;
  private locked = false;

  constructor(stage: HTMLElement) {
    this.titleEl = h('h3');
    this.patternEl = h('div', { class: 'pattern', 'aria-label': 'Şarkı deseni' });
    this.statusEl = h('div', { class: 'status', role: 'status' });
    const notes = h('div', { class: 'notes' });
    for (const n of NOTES) {
      const b = h('button', { class: 'note-btn', type: 'button', 'aria-label': `${n.label} ses` });
      b.innerHTML = `${NOTE_SVG[n.id]}<span>${n.label}</span><small>${n.keys}</small>`;
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.press(n.id);
      });
      b.addEventListener('keydown', (e) => e.preventDefault());
      notes.append(b);
      this.btns.set(n.id, b);
    }
    const replay = h('button', { class: 'btn small center', type: 'button', html: '<b class="key">F</b>Tekrar dinle' });
    replay.addEventListener('click', () => this.demo());
    const close = h('button', { class: 'btn small center', type: 'button', html: '<b class="key">Esc</b>Kapat' });
    close.addEventListener('click', () => this.close('closed'));
    this.assistBtn = h('button', { class: 'btn small center', type: 'button', text: 'Şarkıyı tamamla' });
    this.assistBtn.addEventListener('click', () => this.autoComplete());
    this.el = h(
      'div',
      { class: 'song hidden', role: 'dialog', 'aria-label': 'Balina dili' },
      this.titleEl,
      this.patternEl,
      notes,
      this.statusEl,
      h('div', { class: 'actions' }, replay, this.assistBtn, close),
    );
    stage.append(this.el);
  }

  get isOpen(): boolean {
    return this.resolve !== null;
  }

  open(pattern: Note[], opts: SongOpts): Promise<'done' | 'closed'> {
    this.pattern = pattern;
    this.opts = opts;
    this.pos = 0;
    this.locked = false;
    this.titleEl.textContent = opts.title;
    this.assistBtn.classList.toggle('hidden', !opts.assist);
    this.renderPattern();
    this.statusEl.textContent = 'Dinle…';
    this.el.classList.remove('hidden');
    app.input.pushContext('song');
    this.demo();
    return new Promise((res) => {
      this.resolve = res;
    });
  }

  private renderPattern(): void {
    this.patternEl.innerHTML = '';
    this.pattern.forEach((n, i) => {
      const d = h('div', { class: `note ${i < this.pos ? 'done' : ''}`, html: NOTE_SVG[n] });
      d.dataset.i = String(i);
      this.patternEl.append(d);
    });
  }

  private clearDemo(): void {
    for (const t of this.demoTimers) window.clearTimeout(t);
    this.demoTimers = [];
  }

  private demo(): void {
    this.clearDemo();
    this.pos = 0;
    this.renderPattern();
    this.locked = true;
    this.statusEl.textContent = 'Dinle…';
    const gap = 720;
    this.pattern.forEach((n, i) => {
      this.demoTimers.push(
        window.setTimeout(() => {
          const d = this.patternEl.children[i] as HTMLElement | undefined;
          d?.classList.add('lit');
          app.audio.sfx(SFX[n]);
          this.opts?.onNote?.(n, true);
          this.demoTimers.push(window.setTimeout(() => d?.classList.remove('lit'), 480));
        }, 350 + i * gap),
      );
    });
    this.demoTimers.push(
      window.setTimeout(() => {
        this.locked = false;
        this.statusEl.textContent = 'Şimdi sen söyle.';
      }, 350 + this.pattern.length * gap),
    );
  }

  private press(n: Note): void {
    if (!this.resolve) return;
    if (this.locked) {
      // Singing over the demo simply ends it early.
      this.clearDemo();
      this.locked = false;
      for (const c of this.patternEl.children) c.classList.remove('lit');
    }
    const b = this.btns.get(n)!;
    b.classList.add('flash');
    window.setTimeout(() => b.classList.remove('flash'), 180);
    app.audio.sfx(SFX[n]);
    this.opts?.onNote?.(n, false);
    if (this.pattern[this.pos] === n) {
      this.pos++;
      this.renderPattern();
      if (this.pos >= this.pattern.length) {
        this.locked = true;
        this.statusEl.textContent = 'Şarkı tamamlandı.';
        app.audio.sfx('songOk');
        window.setTimeout(() => this.close('done'), 700);
      } else this.statusEl.textContent = '';
    } else {
      this.pos = 0;
      this.renderPattern();
      app.audio.sfx('songBad');
      this.statusEl.textContent = 'Ses dağıldı. Baştan dene ya da yeniden dinle (F).';
    }
  }

  private autoComplete(): void {
    if (!this.resolve) return;
    this.clearDemo();
    this.pos = this.pattern.length;
    this.renderPattern();
    this.locked = true;
    app.audio.sfx('songOk');
    this.statusEl.textContent = 'Şarkı tamamlandı.';
    window.setTimeout(() => this.close('done'), 600);
  }

  close(r: 'done' | 'closed'): void {
    if (!this.resolve) return;
    this.clearDemo();
    this.el.classList.add('hidden');
    app.input.popContext('song');
    const res = this.resolve;
    this.resolve = null;
    res(r);
  }

  tick(): void {
    if (!this.resolve || app.input.context !== 'song') return;
    if (app.input.consume('note1')) this.press('low');
    if (app.input.consume('note2')) this.press('mid');
    if (app.input.consume('note3')) this.press('high');
    if (app.input.consume('song')) this.demo();
    if (app.input.consume('pause')) this.close('closed');
  }
}
