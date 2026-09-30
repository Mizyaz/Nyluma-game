import type { RoomDef } from '../roomTypes';

// Chapter II — first wind on the surface; first human transformation. The
// first wind carries a whale over Gorti's head to the foot of the cliff,
// where it waits as the one step up to the memory pool on the cliff top.
// The raccoons keep their memory on their log.
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
    { id: 'r04_pool', x: 1900, y: 760 },
    { id: 'r04_after', x: 2450, y: 760, silent: true },
  ],
  solids: [
    { x: 0, y: 900, w: 1380, h: 200, style: 'moss' },
    // A hollow at the foot of the cliff (the whale floats over it) and the
    // cliff top with the memory pool: 140 px up, two 70 px jumps via the
    // whale, so the heavier human body can come back up too (it jumps ~95).
    { x: 1380, y: 960, w: 270, h: 140, style: 'moss' },
    { x: 1650, y: 760, w: 900, h: 340, style: 'moss' },
    { x: 2550, y: 800, w: 900, h: 300, style: 'moss' },
    // The raccoons' log (its top is the seat of their memory).
    { x: 760, y: 868, w: 130, h: 20, style: 'wood', oneWay: true, hidden: true },
    // Carried in on the first wind: it glides past overhead and settles
    // over the hollow, nose to the cliff.
    {
      id: 'windWhale',
      x: 1410,
      y: 830,
      w: 190,
      h: 24,
      style: 'root',
      oneWay: true,
      when: 'r04.wind',
      whale: { species: 'sperm', facing: 1, from: [-1000, -140], time: 4.6, ease: 'inOut', call: 1 },
    },
  ],
  memories: [{ id: 'm3', x: 826, y: 868 }],
  triggers: [
    { id: 'wind', x: 380, y: 700, w: 80, h: 200 },
    { id: 'raccoons', x: 640, y: 700, w: 80, h: 200 },
  ],
  exits: [{ id: 'east', x: 3400, y: 500, w: 50, h: 300, to: 'r05' }],
  props: [
    { key: 'prop.log', x: 825, y: 902, depth: -8 },
    { key: 'prop.mempool', x: 2300, y: 762, depth: -8 },
    { key: 'prop.tree', x: 1040, y: 902, depth: -40, scale: 0.9 },
    { key: 'prop.tree', x: 2050, y: 762, depth: -40, scale: 1.1, flipX: true },
    { key: 'prop.tree', x: 3000, y: 802, depth: -40 },
    { key: 'prop.crystals.blue', x: 1720, y: 762, depth: -5, scale: 0.8 },
    { key: 'prop.bush', x: 420, y: 902, depth: 25 },
    { key: 'prop.bush', x: 2800, y: 802, depth: 25, flipX: true },
  ],
};
