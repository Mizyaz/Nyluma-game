import type { RoomDef } from '../roomTypes';

// Chapter II — weight of a remembered life (form puzzles), the ancient Moon.
export const R05: RoomDef = {
  id: 'r05',
  chapter: 2,
  title: 'Hatırlanan Bir Hayatın Ağırlığı',
  width: 3900,
  height: 1300,
  theme: 'hill',
  music: 'forest',
  player: 'gorti',
  objective: 'r05.stone',
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
    { x: 2980, y: 850, w: 250, h: 40, style: 'soil' },
    { x: 3400, y: 640, w: 500, h: 660, style: 'moss' },
    { x: 1700, y: 560, w: 160, h: 24, style: 'root', oneWay: true },
  ],
  anchors: [
    { id: 'a1', x: 1260, y: 880, land: { x: 1385, y: 820 }, when: 'r05.plateA' },
    { id: 'a2', x: 2900, y: 900, land: { x: 3050, y: 850 } },
    { id: 'a3', x: 3350, y: 680, land: { x: 3480, y: 640 } },
    { id: 'a4', x: 1760, y: 650, land: { x: 1785, y: 560 }, when: 'r05.plateA' },
  ],
  sites: [
    { id: 's1', x: 380, y: 1100 },
    { id: 's2', x: 1050, y: 1100 },
    { id: 's3', x: 1520, y: 820, when: 'r05.plateA' },
    { id: 's4', x: 2700, y: 1100 },
  ],
  interacts: [
    { id: 'reset1', x: 560, y: 1100, r: 60, prompt: 'Taşı geri çağır' },
    { id: 'reset2', x: 1330, y: 820, r: 50, prompt: 'Taşı geri çağır', when: 'r05.plateA', unless: 'r05.plateB' },
  ],
  memories: [{ id: 'm4', x: 1790, y: 560 }],
  triggers: [
    { id: 'formTut', x: 330, y: 900, w: 100, h: 200 },
    { id: 'moon', x: 3560, y: 400, w: 120, h: 240 },
  ],
  exits: [{ id: 'east', x: 3860, y: 400, w: 40, h: 240, to: 'r06', when: 'r05.moon' }],
  props: [
    { key: 'prop.shrine', x: 560, y: 1102, depth: -8 },
    { key: 'prop.shrine', x: 1330, y: 822, depth: -8, when: 'r05.plateA' },
    { key: 'prop.tree', x: 800, y: 1102, depth: -40, scale: 1.2 },
    { key: 'prop.tree', x: 3200, y: 1102, depth: -40, flipX: true },
    { key: 'prop.tree', x: 3700, y: 642, depth: -40, scale: 0.8 },
    { key: 'prop.bush', x: 2300, y: 1102, depth: 25 },
  ],
};
