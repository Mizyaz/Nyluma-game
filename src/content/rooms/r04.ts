import type { RoomDef } from '../data/roomTypes';

// Chapter II — first wind on the surface; first human transformation. One
// meadow floor from end to end. The first wind carries a whale over Gorti's
// head; it settles in the air ahead and floats there while he walks on under
// it to the memory pool. The raccoons keep their memory by their log.
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
    { id: 'r04_pool', x: 1900, y: 900 },
    { id: 'r04_after', x: 2450, y: 900, silent: true },
  ],
  solids: [
    { x: 0, y: 900, w: 3450, h: 200, style: 'moss' },
    // Carried in on the first wind: it glides past overhead and settles in
    // the air ahead, nose to the east (scenery: it bears no weight).
    {
      id: 'windWhale',
      x: 1410,
      y: 700,
      w: 190,
      h: 24,
      style: 'root',
      oneWay: true,
      when: 'r04.wind',
      whale: { species: 'sperm', facing: 1, from: [-1000, -140], time: 4.6, ease: 'inOut', call: 1, scenery: true },
    },
  ],
  memories: [{ id: 'm3', x: 920, y: 900 }],
  triggers: [
    { id: 'wind', x: 380, y: 700, w: 80, h: 200 },
    { id: 'raccoons', x: 640, y: 700, w: 80, h: 200 },
  ],
  exits: [{ id: 'east', x: 3400, y: 600, w: 50, h: 300, to: 'r05' }],
  props: [
    { key: 'prop.log', x: 825, y: 902, depth: -8 },
    { key: 'prop.mempool', x: 2300, y: 902, depth: -8 },
    { key: 'prop.tree', x: 1040, y: 902, depth: -40, scale: 0.9 },
    { key: 'prop.tree', x: 2050, y: 902, depth: -40, scale: 1.1, flipX: true },
    { key: 'prop.tree', x: 3000, y: 902, depth: -40 },
    { key: 'prop.crystals.blue', x: 1720, y: 902, depth: -5, scale: 0.8 },
    { key: 'prop.bush', x: 420, y: 902, depth: 25 },
    { key: 'prop.bush', x: 2800, y: 902, depth: 25, flipX: true },
  ],
};
