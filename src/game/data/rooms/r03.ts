import type { RoomDef } from '../roomTypes';

// Chapter I — the crystal-tree chamber.
export const R03: RoomDef = {
  id: 'r03',
  chapter: 1,
  title: 'Kristal Ağacın Odası',
  width: 3000,
  height: 1400,
  theme: 'chamber',
  music: 'roots',
  player: 'gorti',
  objective: 'r03.cross',
  killY: 1480,
  checkpoints: [
    { id: 'r03_start', x: 190, y: 1200, facing: 1, silent: true },
    { id: 'r03_pool', x: 610, y: 1200 },
    { id: 'r03_focus', x: 1500, y: 1180 },
    { id: 'r03_tree', x: 2250, y: 1180 },
    { id: 'r03_canopy', x: 2740, y: 740 },
  ],
  solids: [
    { x: 0, y: 1200, w: 700, h: 200, style: 'soil' },
    { x: 0, y: 0, w: 120, h: 1200, style: 'soil' },
    { x: 280, y: 0, w: 420, h: 1100, style: 'soil' },
    { x: 700, y: 1330, w: 560, h: 70, style: 'soil' },
    { x: 960, y: 1130, w: 130, h: 270, style: 'root' },
    { x: 1350, y: 1180, w: 370, h: 220, style: 'soil' },
    { x: 1720, y: 1340, w: 430, h: 60, style: 'soil' },
    { x: 1720, y: 1260, w: 70, h: 80, style: 'soil' },
    { id: 'lp1', x: 1800, y: 1150, w: 120, h: 24, style: 'crystal', latent: true },
    { id: 'lp2', x: 1970, y: 1130, w: 120, h: 24, style: 'crystal', latent: true },
    { x: 2150, y: 1180, w: 850, h: 220, style: 'soil' },
    // Dormant crystal-tree branches
    { x: 2460, y: 1070, w: 150, h: 24, style: 'root', oneWay: true },
    { x: 2650, y: 960, w: 160, h: 24, style: 'root', oneWay: true },
    { x: 2440, y: 850, w: 160, h: 24, style: 'root', oneWay: true },
    // Branches grown by the bloom
    { id: 'b4', x: 2660, y: 740, w: 160, h: 24, style: 'root', oneWay: true, grow: true, when: 'r03.bloom' },
    { id: 'b5', x: 2450, y: 630, w: 160, h: 24, style: 'root', oneWay: true, grow: true, when: 'r03.bloom' },
    { id: 'b6', x: 2670, y: 520, w: 160, h: 24, style: 'root', oneWay: true, grow: true, when: 'r03.bloom' },
    { id: 'b7', x: 2460, y: 410, w: 160, h: 24, style: 'root', oneWay: true, grow: true, when: 'r03.bloom' },
    { id: 'b8', x: 2680, y: 300, w: 200, h: 24, style: 'root', oneWay: true, grow: true, when: 'r03.bloom' },
  ],
  anchors: [
    { id: 'a1', x: 840, y: 1010, land: { x: 1015, y: 1130 } },
    { id: 'a2', x: 1210, y: 960, land: { x: 1420, y: 1180 } },
  ],
  songNodes: [
    { id: 'moon', x: 2300, y: 1180, pattern: ['high', 'mid', 'low'], unless: 'r03.moon' },
    { id: 'sun', x: 2300, y: 1180, pattern: ['low', 'mid', 'low', 'high'], when: 'r03.moon', unless: 'r03.sun' },
  ],
  interacts: [
    { id: 'star', x: 2520, y: 850, r: 64, prompt: 'Yıldızı topla', when: 'r03.sun', unless: 'r03.star' },
    { id: 'heart', x: 2600, y: 1180, r: 95, prompt: 'Yıldızı ağaca bağla', when: 'r03.star', unless: 'r03.bloom' },
  ],
  memories: [{ id: 'm2', x: 1935, y: 1340 }],
  hazards: [{ kind: 'thorns', id: 't1', x: 430, y: 1200, w: 80, unstable: true }],
  triggers: [
    { id: 'focusTut', x: 1560, y: 1080, w: 120, h: 100 },
    { id: 'pool', x: 700, y: 1270, w: 560, h: 200 },
  ],
  exits: [{ id: 'canopy', x: 2690, y: 150, w: 200, h: 150, to: 'r04', when: 'r03.bloom' }],
  props: [
    { key: 'prop.pool.poison', x: 980, y: 1332, depth: 15 },
    { key: 'prop.crystaltree', x: 2600, y: 1182, depth: -30, unless: 'r03.bloom' },
    { key: 'prop.crystaltree.bloom', x: 2600, y: 1182, depth: -30, when: 'r03.bloom' },
    { key: 'prop.crystals.teal', x: 200, y: 1202, depth: -5, scale: 0.8 },
    { key: 'prop.crystals.blue', x: 1600, y: 1182, depth: -5, scale: 0.7 },
    { key: 'prop.crystals.orange', x: 2200, y: 1182, depth: -5, scale: 0.9 },
    { key: 'prop.fossilroot', x: 1480, y: 1182, depth: -60, scale: 0.8 },
  ],
};
