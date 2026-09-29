import type { RoomDef } from '../roomTypes';

// Chapter II — weight of a remembered life (the stones already rest on their
// plates), the ancient Moon on the hill.
export const R05: RoomDef = {
  id: 'r05',
  chapter: 2,
  title: 'Hatırlanan Bir Hayatın Ağırlığı',
  width: 3900,
  height: 1300,
  theme: 'hill',
  music: 'forest',
  player: 'gorti',
  checkpoints: [
    { id: 'r05_start', x: 150, y: 1100, facing: 1, silent: true },
    { id: 'r05_elevated', x: 1430, y: 820 },
    { id: 'r05_gate', x: 2650, y: 1100 },
    { id: 'r05_hill', x: 3480, y: 640 },
  ],
  solids: [
    { x: 0, y: 1100, w: 3400, h: 200, style: 'moss' },
    { id: 'e1', x: 1300, y: 820, w: 700, h: 40, style: 'root', grow: true, when: 'r05.plateA' },
    { x: 2480, y: 0, w: 260, h: 840, style: 'stone' },
    { id: 'gate', x: 2500, y: 840, w: 50, h: 260, style: 'crystal', unless: 'r05.plateB' },
    // Steps up to the ledge and the hill
    { x: 2790, y: 1030, w: 90, h: 24, style: 'root', oneWay: true },
    { x: 2860, y: 960, w: 90, h: 24, style: 'root', oneWay: true },
    { x: 2930, y: 890, w: 80, h: 24, style: 'root', oneWay: true },
    { x: 2980, y: 850, w: 250, h: 40, style: 'soil' },
    { x: 3240, y: 780, w: 90, h: 24, style: 'root', oneWay: true },
    { x: 3310, y: 710, w: 90, h: 24, style: 'root', oneWay: true },
    { x: 3400, y: 640, w: 500, h: 660, style: 'moss' },
    { x: 1700, y: 560, w: 160, h: 24, style: 'root', oneWay: true },
  ],
  memories: [{ id: 'm4', x: 1790, y: 1100 }],
  triggers: [{ id: 'moon', x: 3560, y: 400, w: 120, h: 240 }],
  exits: [{ id: 'east', x: 3860, y: 400, w: 40, h: 240, to: 'r06' }],
  props: [
    { key: 'prop.shrine', x: 560, y: 1102, depth: -8 },
    { key: 'prop.shrine', x: 1330, y: 822, depth: -8, when: 'r05.plateA' },
    { key: 'prop.tree', x: 800, y: 1102, depth: -40, scale: 1.2 },
    { key: 'prop.tree', x: 3200, y: 1102, depth: -40, flipX: true },
    { key: 'prop.tree', x: 3700, y: 642, depth: -40, scale: 0.8 },
    { key: 'prop.bush', x: 2300, y: 1102, depth: 25 },
  ],
};
