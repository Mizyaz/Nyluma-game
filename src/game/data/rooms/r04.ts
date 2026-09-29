import type { RoomDef } from '../roomTypes';

// Chapter II — first wind on the surface; first human transformation.
export const R04: RoomDef = {
  id: 'r04',
  chapter: 2,
  title: 'İlk Rüzgâr',
  width: 3450,
  height: 1100,
  theme: 'surface',
  music: 'forest',
  player: 'gorti',
  entryForm: 'root',
  checkpoints: [
    { id: 'r04_start', x: 180, y: 900, facing: 1, silent: true },
    { id: 'r04_focus', x: 1100, y: 900 },
    { id: 'r04_pool', x: 1900, y: 640 },
    { id: 'r04_after', x: 2450, y: 640, silent: true },
  ],
  solids: [
    { x: 0, y: 900, w: 1250, h: 200, style: 'moss' },
    { x: 1250, y: 960, w: 400, h: 140, style: 'moss' },
    { x: 1650, y: 640, w: 900, h: 460, style: 'moss' },
    { x: 2550, y: 800, w: 900, h: 300, style: 'moss' },
    { x: 950, y: 640, w: 180, h: 24, style: 'root', oneWay: true },
    // Roots up to the branch (and its memory) from the log
    { x: 880, y: 800, w: 90, h: 24, style: 'root', oneWay: true },
    { x: 1010, y: 715, w: 90, h: 24, style: 'root', oneWay: true },
    { x: 760, y: 868, w: 130, h: 20, style: 'wood', oneWay: true, hidden: true },
    { id: 'lp1', x: 1330, y: 830, w: 110, h: 24, style: 'crystal' },
    { id: 'lp2', x: 1470, y: 730, w: 110, h: 24, style: 'crystal' },
  ],
  memories: [{ id: 'm3', x: 1085, y: 640 }],
  triggers: [
    { id: 'wind', x: 380, y: 700, w: 80, h: 200 },
    { id: 'raccoons', x: 640, y: 700, w: 80, h: 200 },
  ],
  exits: [{ id: 'east', x: 3400, y: 500, w: 50, h: 300, to: 'r05' }],
  props: [
    { key: 'prop.log', x: 825, y: 902, depth: -8 },
    { key: 'prop.mempool', x: 2300, y: 642, depth: -8 },
    { key: 'prop.tree', x: 1040, y: 902, depth: -40, scale: 0.9 },
    { key: 'prop.tree', x: 2050, y: 642, depth: -40, scale: 1.1, flipX: true },
    { key: 'prop.tree', x: 3000, y: 802, depth: -40 },
    { key: 'prop.crystals.blue', x: 1720, y: 642, depth: -5, scale: 0.8 },
    { key: 'prop.bush', x: 420, y: 902, depth: 25 },
    { key: 'prop.bush', x: 2800, y: 802, depth: 25, flipX: true },
  ],
};
