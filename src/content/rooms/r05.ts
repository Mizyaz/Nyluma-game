import type { RoomDef } from '../data/roomTypes';

// Chapter II — weight of a remembered life (the stones already rest on their
// plates, the crystal gate is open), and at the far end, where the hill
// begins, the ancient Moon. One floor from end to end.
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
    { id: 'r05_elevated', x: 1430, y: 1100 },
    { id: 'r05_gate', x: 2650, y: 1100 },
    { id: 'r05_hill', x: 3480, y: 1100 },
  ],
  solids: [
    { x: 0, y: 1100, w: 3900, h: 200, style: 'moss' },
    { x: 2480, y: 0, w: 260, h: 840, style: 'stone' },
    { id: 'gate', x: 2500, y: 840, w: 50, h: 260, style: 'crystal', unless: 'r05.plateB' },
  ],
  memories: [{ id: 'm4', x: 1790, y: 1100 }],
  triggers: [{ id: 'moon', x: 3560, y: 860, w: 120, h: 240 }],
  exits: [{ id: 'east', x: 3860, y: 860, w: 40, h: 240, to: 'r06' }],
  props: [
    { key: 'prop.shrine', x: 560, y: 1102, depth: -8 },
    { key: 'prop.shrine', x: 1330, y: 1102, depth: -8, when: 'r05.plateA' },
    { key: 'prop.tree', x: 800, y: 1102, depth: -40, scale: 1.2 },
    { key: 'prop.tree', x: 3330, y: 1102, depth: -40, flipX: true, scale: 0.9 },
    { key: 'prop.tree', x: 3760, y: 1102, depth: -40, scale: 0.8 },
    { key: 'prop.bush', x: 2950, y: 1102, depth: 25, flipX: true },
    { key: 'prop.bush', x: 2300, y: 1102, depth: 25 },
  ],
};
