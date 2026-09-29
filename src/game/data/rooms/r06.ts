import type { RoomDef } from '../roomTypes';

// Chapter II — the forest answers “Yalanlar!”; the knots calm as Gorti passes;
// the purple horse waits at the far end.
export const R06: RoomDef = {
  id: 'r06',
  chapter: 2,
  title: 'Orman Cevap Veriyor',
  width: 3000,
  height: 1100,
  theme: 'forest',
  music: 'forest',
  player: 'gorti',
  entryForm: 'human',
  checkpoints: [
    { id: 'r06_start', x: 200, y: 900, facing: 1, silent: true },
    { id: 'r06_knots', x: 560, y: 900, silent: true },
    { id: 'r06_k1', x: 1150, y: 900 },
    { id: 'r06_k2', x: 1860, y: 740 },
    { id: 'r06_horse', x: 2300, y: 900 },
  ],
  solids: [
    { x: 0, y: 900, w: 3000, h: 200, style: 'moss' },
    { x: 1500, y: 820, w: 120, h: 80, style: 'moss' },
    { x: 1620, y: 740, w: 320, h: 160, style: 'moss' },
    { x: 1940, y: 820, w: 110, h: 80, style: 'moss' },
    { x: 2600, y: 600, w: 160, h: 24, style: 'root', oneWay: true },
  ],
  memories: [{ id: 'm5', x: 2580, y: 900 }],
  triggers: [{ id: 'shout', x: 520, y: 700, w: 80, h: 200 }],
  exits: [],
  props: [
    { key: 'prop.tree', x: 300, y: 902, depth: -40, scale: 1.3 },
    { key: 'prop.tree', x: 1250, y: 902, depth: -40, scale: 1.1, flipX: true },
    { key: 'prop.tree', x: 2250, y: 902, depth: -40, scale: 1.2 },
    { key: 'prop.tree', x: 2650, y: 902, depth: -45, scale: 1.5, flipX: true },
    { key: 'prop.bush', x: 150, y: 902, depth: 25 },
    { key: 'prop.bush', x: 2900, y: 902, depth: 25, flipX: true },
  ],
};
