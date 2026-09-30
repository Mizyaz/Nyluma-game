// Shared palette, moved to the pastel world of the author's paintings (see
// style.ts): chalky, light values, near-black ink. Key names are kept from
// the earlier, darker palette so every caller keeps compiling; each colour
// is the pastel counterpart of what it used to be. "Dark"/"Light" variants
// are now gentle steps used for details and patches, not for shading.
export const P = {
  ink: '#1d1b1e',
  inkSoft: '#4a4549',
  soil: '#c9b596',
  soilDeep: '#b09c80',
  soilLight: '#e3d2b4',
  bark: '#b39aa8',
  barkDark: '#937c8b',
  barkLight: '#d3c2cc',
  gortiBark: '#b9adc9',
  gortiBarkDark: '#9788aa',
  gortiBarkLight: '#d7cfe3',
  violet: '#ae8fdc',
  violetDark: '#8d6fc2',
  vein: '#e4d2f8',
  crystalBlue: '#93b1ea',
  crystalBlueDark: '#7391cf',
  crystalBlueLight: '#c9d9f7',
  crystalTeal: '#8ccfc0',
  crystalTealDark: '#68b0a1',
  crystalTealLight: '#c6ede4',
  crystalOrange: '#f4b580',
  crystalOrangeDark: '#dc9563',
  crystalOrangeLight: '#fad8b8',
  ivory: '#f6ecdb',
  ivoryDark: '#dfcfb4',
  moon: '#c3d3e1',
  moonDark: '#a0b4c6',
  moonLight: '#e1ebf3',
  sun: '#f1be7e',
  sunDark: '#d99b5f',
  sunLight: '#f6e39a',
  bruise: '#cc8fc4',
  paper: '#f3eadb',
  paperDark: '#dccdb1',
  stamp: '#d9737e',
  skin: '#f0c4a6',
  skinDark: '#d8a385',
  skinLight: '#f8dcc8',
  shirt: '#dfdbc8',
  shirtDark: '#bfb8a2',
  trousers: '#ab8e7c',
  trousersDark: '#8d7263',
  shoe: '#6e6166',
  suit: '#8e97aa',
  suitDark: '#737c8f',
  suitLight: '#b0b8c8',
  metal: '#a3abb8',
  metalDark: '#838c9b',
  metalLight: '#c8cdd6',
  bone: '#eee5d2',
  horse: '#b597d9',
  horseDark: '#977abf',
  horseLight: '#d4c1ec',
  leaf: '#a6ca8a',
  leafDark: '#80a96b',
  leafLight: '#cbe3b1',
  water: '#93cbdd',
  poison: '#9fd1b9',
  fire: '#f5c17b',
  fireLight: '#fcebb6',
  sparrow: '#c99d7e',
  sparrowDark: '#a88062',
  sparrowLight: '#e2c29f',
  raccoon: '#aca8b4',
  raccoonDark: '#8c8897',
  raccoonLight: '#d0cdd7',
} as const;

export type PaletteKey = keyof typeof P;

/** Converts '#rrggbb' into a 0xRRGGBB number for Phaser tints/fills. */
export function hex(color: string): number {
  return parseInt(color.slice(1), 16);
}

/** Mixes two '#rrggbb' colors; t=0 → a, t=1 → b. */
export function mix(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
}

// ------------------------------------------------------------ pastel lift

function toHsl(color: string): [number, number, number] {
  const n = parseInt(color.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}

function fromHsl(h: number, s: number, l: number): string {
  const f = (n: number): number => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  const to = (v: number): number => Math.round(Math.max(0, Math.min(1, v)) * 255);
  return '#' + ((1 << 24) | (to(f(0)) << 16) | (to(f(8)) << 8) | to(f(4))).toString(16).slice(1);
}

const pastelCache = new Map<string, string>();

/**
 * The pastel counterpart of any colour, in the paintings' range: values are
 * lifted into chalky lights (mid and dark tones are compressed into
 * 0.5–0.78 lightness, light ones kept), colourfulness (chroma) is kept, hue
 * kept. Near-black stays dark: it is ink (contours, pupils, holes). With
 * `deep`, near-black fills other than the ink itself become the paintings'
 * deep night tones instead (for whole pictures such as the journal's).
 */
export function pastel(color: string, deep = false): string {
  const key = color.toLowerCase();
  const ck = deep ? key + '+' : key;
  const hit = pastelCache.get(ck);
  if (hit) return hit;
  const [h, s, l] = toHsl(key);
  let out = key;
  const chroma = s * (1 - Math.abs(2 * l - 1));
  const withChroma = (l2: number, k: number): string => fromHsl(h, Math.min(0.62, (chroma * k) / Math.max(0.05, 1 - Math.abs(2 * l2 - 1))), l2);
  if (l >= 0.17) {
    const l2 = l >= 0.78 ? l : 0.5 + ((l - 0.17) / (0.78 - 0.17)) * 0.28;
    // Keep the colourfulness (chroma), not the HSL saturation: a dusky
    // purple becomes a soft lilac-grey rather than a loud violet.
    out = withChroma(l2, 1.25);
  } else if (deep && key !== P.ink && key !== '#191728' && key !== '#000000') {
    out = withChroma(0.28 + l * 0.9, 1.6);
  }
  pastelCache.set(ck, out);
  return out;
}

/** `pastel()` applied to every #rrggbb colour of an SVG fragment. */
export function pastelMarkup(svg: string, deep = false): string {
  return svg.replace(/#[0-9a-fA-F]{6}\b/g, (c) => pastel(c, deep));
}
