import { app } from '../game/App';
import { creditsBlock } from './Menus';
import { portraitUrl } from '../game/art/memoryArt';
import { focusables, h } from './dom';

export interface EndingActions {
  replay: () => void;
  chapters: () => void;
  journal: () => void;
  menu: () => void;
}

/** Ending card: the fixed final line, credits and where to go next. */
export class EndingView {
  private el: HTMLElement;

  constructor(stage: HTMLElement) {
    this.el = h('div', { class: 'ending hidden', role: 'dialog', 'aria-label': 'Son' });
    stage.append(this.el);
  }

  /**
   * The luminous inner portraits fade into flat document images, then the
   * ending card and credits appear.
   */
  show(finalLine: string, a: EndingActions, reduced = false): void {
    this.el.innerHTML = '';
    const row = h('div', { class: 'end-portraits', 'aria-hidden': 'true' });
    for (const k of ['root', 'amca', 'coward', 'mech', 'horse']) row.append(h('img', { src: portraitUrl(k), alt: '' }));
    this.el.append(h('p', { class: 'final-line', text: finalLine }), row);
    this.el.classList.remove('hidden');
    window.setTimeout(() => row.classList.add('printed'), reduced ? 200 : 1600);
    window.setTimeout(() => this.card(finalLine, a, row), reduced ? 900 : 5200);
  }

  private card(finalLine: string, a: EndingActions, row: HTMLElement): void {
    this.el.innerHTML = '';
    const btn = (label: string, fn: () => void): HTMLButtonElement => {
      const b = h('button', { class: 'btn small center', type: 'button', text: label });
      b.addEventListener('click', () => {
        app.audio.sfx('ui');
        fn();
      });
      return b;
    };
    this.el.append(
      h('p', { class: 'final-line', text: finalLine }),
      row,
      h('p', { class: 'subtitle', text: 'Son' }),
      creditsBlock(),
      h(
        'nav',
        { class: 'row', style: 'justify-content:center', 'aria-label': 'Son menüsü' },
        btn('Yeniden oyna', a.replay),
        btn('Bölümler', a.chapters),
        btn('Anılar', a.journal),
        btn('Ana menü', a.menu),
      ),
    );
    if (app.input.context !== 'menu') app.input.pushContext('menu');
    requestAnimationFrame(() => focusables(this.el)[0]?.focus());
  }

  hide(): void {
    this.el.classList.add('hidden');
    this.el.innerHTML = '';
  }

  get isOpen(): boolean {
    return !this.el.classList.contains('hidden');
  }
}
