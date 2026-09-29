import type { PaintingArt } from '../game/data/paintings';
import { h } from './dom';

/** A painting shown large: the artwork, its title and the line under it. */
export function paintingCard(art: PaintingArt, line: string): HTMLElement {
  return h(
    'figure',
    { class: 'painting-card' },
    h('div', { class: 'frame' }, h('img', { src: art.url, alt: art.title })),
    h('figcaption', {}, h('b', { text: art.title }), h('span', { text: art.caption })),
    h('p', { class: 'line', text: line }),
  );
}
