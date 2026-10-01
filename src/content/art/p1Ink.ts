import { nextId } from '../../render/2d/svg';

// The first painting's pen: flat colours in bold ink. Shared by the things
// drawn by hand after it (the wall pictures, the eye-leaf).

/** The painting's ink. */
export const INK = '#211a1f';

export const n = (v: number): string => (Math.round(v * 100) / 100).toString();

/** A flat fill outlined in ink. */
export function inked(d: string, fill: string, w = 1.6): string {
  return `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${n(w)}" stroke-linejoin="round" stroke-linecap="round"/>`;
}

/** A line in ink (or in `color`). */
export function line(d: string, w: number, color: string = INK, o = 1): string {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${n(w)}" stroke-linejoin="round" stroke-linecap="round"${o !== 1 ? ` opacity="${n(o)}"` : ''}/>`;
}

export function flat(d: string, color: string, o = 1): string {
  return `<path d="${d}" fill="${color}"${o !== 1 ? ` opacity="${n(o)}"` : ''}/>`;
}

/** Markup clipped to the path `d`. */
export function clipped(d: string, body: string): string {
  const id = nextId('p1p');
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${body}</g>`;
}
