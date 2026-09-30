import { cel } from './svg';

// The look of the author's drawings (the four paintings in
// src/assets/paintings): thin, even black contours; flat pastel fills with
// no cel shading; a coloured-pencil grain inside every fill (added once at
// rasterization, see TextureFactory). All new and restyled art uses these.

/**
 * Line colour: a soft dark plum, not black (black contours read as cheap
 * plastic). Filled shapes are outlined in a darker tone of their own
 * colour instead (see `lineFor`); this is for lines on their own.
 */
export const INK = '#4f4557';
/** Contour width of a part's outline, logical px (parts rasterize at 2×). */
export const OUTLINE = 1.5;
/** Width of inner detail lines (stitches, creases, labels). */
export const DETAIL = 1.0;
/** What a shape's contour darkens toward. */
const LINE_DARK = '#3b3245';

/** A shape's contour: its own colour, darker (coloured line art). */
export function lineFor(fill: string): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(fill)) return INK;
  const a = parseInt(fill.slice(1), 16);
  const b = parseInt(LINE_DARK.slice(1), 16);
  const t = 0.58;
  const ch = (sh: number): number => Math.round(((a >> sh) & 255) * (1 - t) + ((b >> sh) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}

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

// ------------------------------------------------------------ comic inking

/**
 * The characters' comic line weights (logical px; parts rasterize at 2×).
 * Adaptive: the silhouette of a big shape carries the heaviest line, limbs
 * a lighter one, small pieces lighter still, inner drawing (folds, seams)
 * and texture the finest. All of them are drawn opaque, in a dark tone of
 * the colour they bound, never as faint or flat black strokes.
 */
export const LINE = {
  body: 1.95,
  limb: 1.6,
  small: 1.3,
  detail: 0.95,
  fine: 0.68,
} as const;

/** Contour width for a shape whose larger extent is `size` logical px. */
export function lineW(size: number): number {
  return Math.max(0.8, Math.min(LINE.body, 0.85 + 0.42 * Math.log2(Math.max(1, size) / 6)));
}

/** Multiply tones of the cel shadows (a cool violet shade; a warm one for skin). */
export const SHADE = {
  cool: '#cdbfe0',
  deep: '#b3a2cf',
  warm: '#ebc0b6',
  hatch: '#9e8bbd',
  hatchWarm: '#cf9486',
} as const;

function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number): number => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}

/** A highlight tone of a fill: toward warm paper white. */
export function lightOf(fill: string, k = 0.55): string {
  return /^#[0-9a-fA-F]{6}$/.test(fill) ? mixHex(fill, '#fffcf4', k) : fill;
}

/** A darker, cooler tone of a fill (inner lines drawn in the shape's own colour). */
export function darkOf(fill: string, k = 0.35): string {
  return /^#[0-9a-fA-F]{6}$/.test(fill) ? mixHex(fill, '#4a3b5c', k) : fill;
}
