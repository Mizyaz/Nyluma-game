import type { RoomDef, SolidDef } from '../data/roomTypes';

// Chapter III — the flowering ride: one meadow floor from start to end. The
// chasms along it fill with flower bridges as the horse comes near (the
// script), level with the ground, so the horse only ever gallops.

export const RIDE_GROUND_Y = 800;
export const RIDE_LENGTH = 34000;
export const RIDE_STOP_X = 33200;

/** Chasms; a flower bridge blooms over each one as the horse comes near. */
export const RIDE_CHASMS: [number, number][] = [
  [6400, 6900],
  [12500, 13100],
  [21000, 21600],
  [24000, 24700],
  [29600, 30200],
];

function groundSolids(): SolidDef[] {
  const out: SolidDef[] = [];
  let x = 0;
  for (const [a, b] of RIDE_CHASMS) {
    out.push({ x, y: RIDE_GROUND_Y, w: a - x, h: 200, style: 'moss' });
    x = b;
  }
  out.push({ x, y: RIDE_GROUND_Y, w: RIDE_LENGTH - x, h: 200, style: 'moss' });
  return out;
}

export const R07: RoomDef = {
  id: 'r07',
  chapter: 3,
  title: 'Çiçeklenen Yolculuk',
  width: RIDE_LENGTH,
  height: 1000,
  theme: 'ride',
  music: 'ride',
  player: 'horse',
  entryForm: 'human',
  zoom: 1.12,
  killY: 1060,
  checkpoints: [
    { id: 'r07_start', x: 300, y: RIDE_GROUND_Y, facing: 1, silent: true },
    { id: 'r07_mid1', x: 11500, y: RIDE_GROUND_Y },
    { id: 'r07_mid2', x: 22400, y: RIDE_GROUND_Y },
    { id: 'r07_end', x: 32600, y: RIDE_GROUND_Y, silent: true },
  ],
  solids: groundSolids(),
  // Hanging at the rider's height over the way: the gallop carries him through it.
  memories: [{ id: 'm6', x: 18470, y: RIDE_GROUND_Y - 116 }],
  exits: [],
  props: [],
};
