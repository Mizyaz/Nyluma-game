import type { RoomDef } from '../roomTypes';

// Chapter II — weight of a remembered life (the stones already rest on their
// plates), the ancient Moon on the hill: a short climb up its terraces.
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
    { id: 'r05_hill', x: 3480, y: 905 },
  ],
  solids: [
    { x: 0, y: 1100, w: 2860, h: 200, style: 'moss' },
    { id: 'e1', x: 1300, y: 820, w: 700, h: 40, style: 'root', grow: true, when: 'r05.plateA' },
    { x: 2480, y: 0, w: 260, h: 840, style: 'stone' },
    { id: 'gate', x: 2500, y: 840, w: 50, h: 260, style: 'crystal', unless: 'r05.plateB' },
    // Up the hill to the Moon ("when you climb the hill…", the baby Moon
    // said): two terraces and the hilltop, 65 px each, easy for the heavy
    // human body (it jumps ~95 px).
    { x: 2860, y: 1035, w: 190, h: 265, style: 'moss' },
    { x: 3050, y: 970, w: 190, h: 330, style: 'moss' },
    { x: 3240, y: 905, w: 660, h: 395, style: 'moss' },
  ],
  memories: [{ id: 'm4', x: 1790, y: 1100 }],
  triggers: [{ id: 'moon', x: 3560, y: 665, w: 120, h: 240 }],
  exits: [{ id: 'east', x: 3860, y: 665, w: 40, h: 240, to: 'r06' }],
  props: [
    { key: 'prop.shrine', x: 560, y: 1102, depth: -8 },
    { key: 'prop.shrine', x: 1330, y: 822, depth: -8, when: 'r05.plateA' },
    { key: 'prop.tree', x: 800, y: 1102, depth: -40, scale: 1.2 },
    { key: 'prop.tree', x: 3330, y: 907, depth: -40, flipX: true, scale: 0.9 },
    { key: 'prop.tree', x: 3760, y: 907, depth: -40, scale: 0.8 },
    { key: 'prop.bush', x: 2950, y: 1037, depth: 25, flipX: true },
    { key: 'prop.bush', x: 2300, y: 1102, depth: 25 },
  ],
};
