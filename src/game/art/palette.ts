// Shared palette. Saturation lives in characters and interactive objects;
// scenery uses the muted values.
export const P = {
  ink: '#191728',
  inkSoft: '#2b2840',
  soil: '#292638',
  soilDeep: '#1f1c2c',
  soilLight: '#3a3550',
  bark: '#625166',
  barkDark: '#4a3c50',
  barkLight: '#7d6a80',
  gortiBark: '#8a8199',
  gortiBarkDark: '#6b627c',
  gortiBarkLight: '#a79fb5',
  violet: '#9459D8',
  violetDark: '#6d3fa6',
  vein: '#D7B3FF',
  crystalBlue: '#548CD6',
  crystalBlueDark: '#3b679f',
  crystalBlueLight: '#9cc0ee',
  crystalTeal: '#53BFAF',
  crystalTealDark: '#358a7e',
  crystalTealLight: '#9fe3d8',
  crystalOrange: '#DE9960',
  crystalOrangeDark: '#a86c3d',
  crystalOrangeLight: '#f2c69c',
  ivory: '#E8DCCA',
  ivoryDark: '#c2b39d',
  moon: '#C7CCDE',
  moonDark: '#9ea3b8',
  moonLight: '#e6e9f3',
  sun: '#D9AE54',
  sunDark: '#b3873a',
  sunLight: '#f0d38e',
  bruise: '#6e4a8a',
  paper: '#D8CEBA',
  paperDark: '#b8ab92',
  stamp: '#944958',
  skin: '#d9a98a',
  skinDark: '#b8866a',
  skinLight: '#ecc4a6',
  shirt: '#b9b39f',
  shirtDark: '#958f7b',
  trousers: '#6e5240',
  trousersDark: '#553e30',
  shoe: '#3a2f2c',
  suit: '#4a4a58',
  suitDark: '#363644',
  suitLight: '#62627a',
  metal: '#4b5160',
  metalDark: '#333844',
  metalLight: '#727a8c',
  bone: '#d5ccb8',
  horse: '#7b45c0',
  horseDark: '#58308f',
  horseLight: '#a57be0',
  leaf: '#3f6b5e',
  leafDark: '#2d4d45',
  leafLight: '#5f8f7d',
  water: '#3d5f86',
  poison: '#4f8f84',
  fire: '#f0b458',
  fireLight: '#ffe3a1',
  sparrow: '#8a6444',
  sparrowDark: '#654830',
  sparrowLight: '#b48c62',
  raccoon: '#7f7c86',
  raccoonDark: '#5d5a66',
  raccoonLight: '#a9a6b0',
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
