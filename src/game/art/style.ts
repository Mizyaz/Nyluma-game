import { cel } from './svg';

// The look of the author's drawings (the four paintings in
// src/assets/paintings): thin, even black contours; flat pastel fills with
// no cel shading; a coloured-pencil grain inside every fill (added once at
// rasterization, see TextureFactory). All new and restyled art uses these.

/** Contour colour: near-black, a touch warm. */
export const INK = '#1d1b1e';
/** Contour width of a part's outline, logical px (parts rasterize at 2×). */
export const OUTLINE = 2.2;
/** Width of inner detail lines (stitches, creases, labels). */
export const DETAIL = 1.4;

/** Pastel colours sampled from the paintings. */
export const PASTEL = {
  periwinkle: '#97a3dc',
  periwinkleDeep: '#7d8bcc',
  sand: '#d8c09e',
  sandLight: '#e8d7b8',
  cream: '#f7eddc',
  blush: '#f7dbf2',
  pink: '#f0b2cf',
  pinkDeep: '#dd8db3',
  lilac: '#c3a3dc',
  lilacDeep: '#a07fc4',
  lavender: '#dccdf0',
  mint: '#b6dcc6',
  mintDeep: '#8fc4ad',
  sage: '#b2c2b3',
  teal: '#8fbfb4',
  aqua: '#bfdcd8',
  lime: '#c3dc8c',
  leaf: '#9cc47a',
  butter: '#f3e08e',
  apricot: '#f4b27c',
  coral: '#e98a7a',
  stone: '#c9c7c4',
  stoneDark: '#8f8b8b',
  slate: '#7c8794',
  night: '#3d5248',
  nightDeep: '#2f4038',
  bark: '#a58a78',
  barkDeep: '#7f6657',
} as const;

export interface FlatOpts {
  stroke?: number;
  ink?: string;
  /** Markup clipped inside the shape (patterns, patches, labels). */
  inner?: string;
  /** Markup drawn over the fill inside the shape. */
  over?: string;
  opacity?: number;
}

/** A flat-filled shape with a thin contour, in the paintings' manner. */
export function flat(d: string, fill: string, o: FlatOpts = {}): string {
  return cel(d, { fill, stroke: o.stroke ?? OUTLINE, ink: o.ink ?? INK, inner: o.inner, over: o.over, opacity: o.opacity, sx: 0, sy: 0 });
}
