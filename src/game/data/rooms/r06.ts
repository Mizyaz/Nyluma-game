import type { RoomDef } from '../roomTypes';

// Chapter II — the forest answers “Yalanlar!”; three knots; the purple horse.
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
  objective: 'r06.walk',
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
  anchors: [{ id: 'a1', x: 2600, y: 700, land: { x: 2665, y: 600 } }],
  interacts: [
    { id: 'k1', x: 1000, y: 900, r: 95, prompt: 'Düğümü bağla', when: 'r06.shout', unless: 'r06.k1' },
    { id: 'k2', x: 1780, y: 740, r: 95, prompt: 'Düğümü bağla', when: 'r06.shout', unless: 'r06.k2' },
    { id: 'k3', x: 2450, y: 900, r: 95, prompt: 'Düğümü bağla', when: 'r06.shout', unless: 'r06.k3' },
    { id: 'mount', x: 1760, y: 740, r: 110, prompt: 'Ata bin', when: 'r06.horse', unless: 'r06.done' },
  ],
  memories: [{ id: 'm5', x: 2680, y: 600 }],
  hazards: [
    { kind: 'lash', id: 'l1', x: 800, y: 900, period: 2.8, offset: 0, when: 'r06.shout', unless: 'r06.k1' },
    { kind: 'lash', id: 'l2', x: 1320, y: 900, period: 2.8, offset: 1.4, when: 'r06.shout', unless: 'r06.k2' },
    { kind: 'lash', id: 'l3', x: 2330, y: 900, period: 2.6, offset: 0.7, when: 'r06.shout', unless: 'r06.k2' },
    { kind: 'lash', id: 'l4', x: 2720, y: 900, period: 2.6, offset: 2.0, when: 'r06.shout', unless: 'r06.k3' },
    { kind: 'thorns', id: 't1', x: 2190, y: 900, w: 70, unstable: true, when: 'r06.shout' },
  ],
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
