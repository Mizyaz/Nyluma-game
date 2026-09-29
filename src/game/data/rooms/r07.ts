import type { RoomDef, SolidDef } from '../roomTypes';

// Chapter III — the flowering ride. The route is authored as intervals so
// its rhythm (teach → isolate → combine) is easy to read and tune.

export const RIDE_GROUND_Y = 800;
export const RIDE_LENGTH = 34000;
export const RIDE_STOP_X = 33200;

/** Gaps the horse must jump. */
export const RIDE_GAPS: [number, number][] = [
  [4400, 4600],
  [5300, 5520],
  [10200, 10420],
  [14600, 14820],
  [16800, 17020],
  [19800, 20020],
  [26000, 26220],
  [28400, 28620],
];

/** Chasms; a flower bridge blooms over each one as the horse comes near. */
export const RIDE_CHASMS: [number, number][] = [
  [6400, 6900],
  [12500, 13100],
  [21000, 21600],
  [24000, 24700],
  [29600, 30200],
];

/** Raised mound whose far edge launches the optional memory arc. */
export const RIDE_MOUND: [number, number] = [17600, 18300];
export const RIDE_MOUND_Y = 700;

function groundSolids(): SolidDef[] {
  const cuts = [...RIDE_GAPS, ...RIDE_CHASMS].sort((a, b) => a[0] - b[0]);
  const out: SolidDef[] = [];
  let x = 0;
  for (const [a, b] of cuts) {
    out.push({ x, y: RIDE_GROUND_Y, w: a - x, h: 200, style: 'moss' });
    x = b;
  }
  out.push({ x, y: RIDE_GROUND_Y, w: RIDE_LENGTH - x, h: 200, style: 'moss' });
  out.push({ x: RIDE_MOUND[0], y: RIDE_MOUND_Y, w: RIDE_MOUND[1] - RIDE_MOUND[0], h: 100, style: 'moss' });
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
  memories: [{ id: 'm6', x: 18470, y: 545 }],
  exits: [],
  props: [],
};
