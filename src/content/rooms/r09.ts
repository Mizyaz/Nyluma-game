import type { RoomDef } from '../data/roomTypes';

// Chapter IV — sparrow clearing by the river.
export const R09: RoomDef = {
  id: 'r09',
  chapter: 4,
  title: 'Serçe Açıklığı',
  width: 3200,
  height: 1100,
  theme: 'clearing',
  music: 'forest',
  player: 'gorti',
  entryForm: 'root',
  checkpoints: [
    { id: 'r09_start', x: 150, y: 900, facing: 1, silent: true },
    { id: 'r09_mid', x: 1800, y: 900 },
    { id: 'r09_pool', x: 2650, y: 900 },
  ],
  solids: [
    { x: 0, y: 900, w: 1300, h: 200, style: 'moss' },
    { x: 1300, y: 960, w: 400, h: 140, style: 'stone' },
    // Stepping stones across the river (wading through its bed works too).
    { x: 1360, y: 880, w: 80, h: 24, style: 'stone', oneWay: true },
    { x: 1530, y: 872, w: 80, h: 24, style: 'stone', oneWay: true },
    { x: 1700, y: 900, w: 1500, h: 200, style: 'moss' },
  ],
  memories: [{ id: 'm7', x: 2300, y: 900 }],
  triggers: [
    { id: 'sparrow', x: 260, y: 700, w: 80, h: 200 },
    { id: 'line', x: 1760, y: 700, w: 100, h: 200 },
  ],
  exits: [],
  props: [
    { key: 'prop.river', x: 1500, y: 962, depth: 14 },
    { key: 'prop.tree', x: 520, y: 902, depth: -40, scale: 1.1 },
    { key: 'prop.tree', x: 1150, y: 902, depth: -40, flipX: true },
    { key: 'prop.tree', x: 2280, y: 902, depth: -40, scale: 1.3 },
    { key: 'prop.tree', x: 3050, y: 902, depth: -40, flipX: true },
    { key: 'prop.reflectpool', x: 2860, y: 902, depth: 3 },
    { key: 'prop.bush', x: 900, y: 902, depth: 25 },
  ],
};
