import { app } from '../game/App';
import { h } from './dom';

/** A single document page shown over the game (final chapter). */
export class DocView {
  private el: HTMLElement;
  private body: HTMLElement;
  private resolve: (() => void) | null = null;
  private opened = 0;

  constructor(stage: HTMLElement) {
    this.body = h('div');
    const close = h('button', { class: 'btn small center close', type: 'button', html: '<b class="key">E</b>Bırak' });
    close.addEventListener('click', () => this.close());
    this.el = h('div', { class: 'doc hidden', role: 'dialog', 'aria-label': 'Belge' }, this.body, close);
    stage.append(this.el);
  }

  get isOpen(): boolean {
    return this.resolve !== null;
  }

  open(content: HTMLElement, closeLabel = 'Bırak'): Promise<void> {
    this.body.innerHTML = '';
    this.body.append(content);
    (this.el.querySelector('.close') as HTMLElement).innerHTML = `<b class="key">E</b>${closeLabel}`;
    this.el.classList.remove('hidden');
    this.opened = performance.now();
    app.input.pushContext('puzzle');
    app.audio.sfx('paper');
    return new Promise((res) => {
      this.resolve = res;
    });
  }

  close(): void {
    if (!this.resolve) return;
    this.el.classList.add('hidden');
    app.input.popContext('puzzle');
    app.audio.sfx('paper', { vol: 0.6 });
    const r = this.resolve;
    this.resolve = null;
    r();
  }

  tick(): void {
    if (!this.resolve || app.input.context !== 'puzzle') return;
    if (performance.now() - this.opened < 350) return;
    const i = app.input;
    if (i.consume('action') || i.consume('jump') || i.consume('confirm') || i.consume('pause')) this.close();
  }
}
