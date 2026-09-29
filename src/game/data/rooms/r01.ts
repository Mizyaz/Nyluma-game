import type { RoomDef } from '../roomTypes';

// Chapter I — the children's room beneath the world.
export const R01: RoomDef = {
  id: 'r01',
  chapter: 1,
  title: '14. Oda',
  width: 2200,
  height: 780,
  theme: 'nursery',
  music: 'roots',
  player: 'gorti',
  objective: 'r01.explore',
  checkpoints: [
    { id: 'r01_start', x: 290, y: 660, facing: 1, silent: true },
    { id: 'r01_door', x: 1600, y: 660 },
  ],
  solids: [
    { x: 0, y: 660, w: 1720, h: 120, style: 'floor' },
    { x: 1720, y: 660, w: 480, h: 120, style: 'soil' },
    { x: 0, y: 0, w: 160, h: 660, style: 'soil' },
    { x: 160, y: 0, w: 1540, h: 130, style: 'soil' },
    { x: 1700, y: 130, w: 70, h: 300, style: 'root' },
    { id: 'door', x: 1705, y: 430, w: 60, h: 230, style: 'none', hidden: true, unless: 'r01.door' },
    { x: 1770, y: 0, w: 430, h: 440, style: 'soil' },
    // Furniture colliders (drawn as props)
    { x: 322, y: 590, w: 216, h: 20, style: 'bed', oneWay: true, hidden: true },
    { x: 742, y: 604, w: 116, h: 56, style: 'wood', hidden: true },
    { x: 772, y: 546, w: 58, h: 58, style: 'wood', hidden: true },
    { x: 1368, y: 580, w: 146, h: 80, style: 'wood', hidden: true },
  ],
  interacts: [
    { id: 'toywhale', x: 620, y: 660, r: 70, prompt: 'İncele' },
    { id: 'marks', x: 1090, y: 660, r: 90, prompt: 'İncele' },
    { id: 'window', x: 1441, y: 580, r: 80, prompt: 'İncele' },
    { id: 'bed', x: 430, y: 590, r: 70, prompt: 'İncele' },
  ],
  exits: [{ id: 'tunnel', x: 2150, y: 440, w: 50, h: 220, to: 'r02' }],
  props: [
    { key: 'prop.fourteen', x: 430, y: 330, depth: -50, oy: 0.5 },
    { key: 'prop.bed', x: 430, y: 662, depth: -20 },
    { key: 'prop.lamp', x: 900, y: 128, oy: 0, depth: -30 },
    { key: 'prop.blocks', x: 800, y: 662, depth: -20 },
    { key: 'prop.toywhale', x: 620, y: 662, depth: 5 },
    { key: 'prop.marks', x: 1090, y: 500, depth: -50, oy: 0.5 },
    { key: 'prop.window', x: 1441, y: 400, depth: -50, oy: 0.5 },
    { key: 'prop.chest', x: 1441, y: 662, depth: -20 },
    { key: 'prop.toyhorse', x: 1250, y: 662, depth: -20, scale: 0.9 },
    { key: 'prop.rootdoor', x: 1735, y: 662, depth: 12, unless: 'r01.door' },
    { key: 'prop.rootdoor.open', x: 1735, y: 662, depth: 12, when: 'r01.door' },
    { key: 'prop.fossil', x: 1980, y: 500, depth: -40, scale: 0.8, oy: 0.5 },
  ],
};
