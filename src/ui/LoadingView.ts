import { skyFaceSvg } from '../content/characters/sky';
import { comicTitle } from './Menus';
import { h } from './dom';

// The loading screen: the night of the first painting. The infant Moon and
// the Sun look on from the top corners, the title stands in the middle, and
// a cluster of crystals grows from the ground as the drawings are made, with
// the words and the count on a strip of paper under it.

/** The crystals: middle x, base width, height (in the cluster's 240 × 150 box), colours (face, shade). */
const CRYSTALS: [number, number, number, string, string][] = [
  [58, 34, 72, '#8fb2ec', '#6d8fd0'],
  [94, 40, 112, '#bc9ce6', '#9877cc'],
  [132, 46, 138, '#f3a9cc', '#dc84ae'],
  [170, 38, 98, '#86d6c6', '#5fb7a6'],
  [200, 30, 62, '#f6bd86', '#e39a5c'],
];
const GROUND = 136;
const INK = '#2b2228';

function crystal([x, w, ht, face, shade]: (typeof CRYSTALS)[number]): string {
  const l = x - w / 2;
  const r = x + w / 2;
  const shoulder = GROUND - ht * 0.74;
  const tip = GROUND - ht;
  const outline = `M${l} ${GROUND}L${l} ${shoulder}L${x} ${tip}L${r} ${shoulder}L${r} ${GROUND}Z`;
  // Lit left facet, shaded right one, a glint up the middle.
  let s = `<path d="${outline}" fill="${face}"/>`;
  s += `<path d="M${x} ${tip}L${r} ${shoulder}L${r} ${GROUND}L${x + w * 0.1} ${GROUND}Z" fill="${shade}"/>`;
  s += `<path d="M${l + w * 0.2} ${shoulder + 4}L${l + w * 0.2} ${GROUND - 10}" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`;
  s += `<path d="M${x} ${tip}L${x + w * 0.1} ${GROUND}" stroke="${INK}" stroke-width="2" opacity="0.55"/>`;
  s += `<path d="${outline}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  return s;
}

function cluster(): string {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 150" aria-hidden="true">`;
  CRYSTALS.forEach((c, i) => {
    s += `<g class="cr" style="--i:${i}">${crystal(c)}</g>`;
  });
  // The mound they grow from, and a few sparkles.
  s += `<path d="M14 ${GROUND + 2}Q60 ${GROUND - 12} 120 ${GROUND - 8}Q180 ${GROUND - 12} 226 ${GROUND + 2}Q228 ${GROUND + 12} 120 ${GROUND + 12}Q12 ${GROUND + 12} 14 ${GROUND + 2}Z" fill="#7a6a8e" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  for (const [x, y, r, d] of [
    [34, 50, 10, 0],
    [216, 66, 9, 0.6],
    [152, 14, 11, 1.1],
    [78, 30, 8, 1.6],
  ] as const) {
    s += `<path class="spark" style="animation-delay:${d}s" d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="#fff6c8" stroke="${INK}" stroke-width="1.6"/>`;
  }
  return s + `</svg>`;
}

export class LoadingView {
  readonly el: HTMLElement;
  private readonly crystals: SVGGElement[];
  private readonly label: HTMLElement;
  private readonly count: HTMLElement;

  constructor(parent: HTMLElement) {
    const moon = h('div', { class: 'ld-moon' });
    moon.innerHTML = skyFaceSvg('moon');
    const sun = h('div', { class: 'ld-sun' });
    sun.innerHTML = skyFaceSvg('sun');
    const grow = h('div', { class: 'ld-grow' });
    grow.innerHTML = cluster();
    this.label = h('span', { class: 'ld-lbl' });
    this.count = h('span', { class: 'ld-count' });
    this.el = h(
      'div',
      { class: 'loading', role: 'status', 'aria-live': 'polite' },
      moon,
      sun,
      h('div', { class: 'ld-middle' }, comicTitle('Kristaller Dünyası'), h('div', { class: 'subtitle', text: '14. Oda' }), grow, h('div', { class: 'ld-strip' }, this.label, this.count)),
    );
    this.crystals = [...grow.querySelectorAll<SVGGElement>('.cr')];
    parent.append(this.el);
  }

  /** Shows how far the drawings are (0..1), with a word about it. */
  set(progress: number, label: string): void {
    const p = Math.min(1, Math.max(0, progress));
    // One after another, each crystal grows up from the ground.
    this.crystals.forEach((g, i) => {
      const k = Math.min(1, Math.max(0.06, p * 1.6 - i * 0.15));
      g.style.transform = `scaleY(${k.toFixed(3)})`;
    });
    this.label.textContent = label;
    this.count.textContent = `%${Math.round(p * 100)}`;
  }

  /** Fades away, then leaves. */
  close(): void {
    this.el.classList.add('done');
    window.setTimeout(() => this.el.remove(), 450);
  }
}
