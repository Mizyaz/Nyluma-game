import type { RoomDef } from '../data/roomTypes';

// Chapter I — fossil-root chamber. A blue whale passes through the earth as
// if it were water and speaks in the three voices of the whale language
// (deep, middle, high); its song wakes the way on: three whales rise out of
// the soil one above the other, each answering in one of the voices as it
// arrives (a blue whale deep, a bowhead in the middle, a sperm whale high),
// and the roots closing the tunnel mouth at the far end part. The mouth
// keeps a memory. One floor from end to end: the whales only swim.
export const R02: RoomDef = {
  id: 'r02',
  chapter: 1,
  title: 'Fosil Kökler',
  width: 1600,
  height: 1220,
  theme: 'roots',
  music: 'roots',
  player: 'gorti',
  checkpoints: [
    { id: 'r02_start', x: 220, y: 1100, facing: 1, silent: true },
    { id: 'r02_node', x: 640, y: 1100 },
    { id: 'r02_climb', x: 960, y: 1100, silent: true },
    { id: 'r02_upper', x: 1250, y: 1100 },
    { id: 'r02_top', x: 1400, y: 1100, silent: true },
  ],
  solids: [
    { x: 0, y: 1100, w: 1600, h: 120, style: 'soil' },
    { x: 0, y: 0, w: 110, h: 1100, style: 'soil' },
    { x: 110, y: 0, w: 1490, h: 60, style: 'soil' },
    // The far wall over the tunnel mouth, and the roots closing it until
    // the song (both drawn by its doorway, src/content/doors.ts).
    { x: 1480, y: 60, w: 120, h: 790, style: 'soil', hidden: true },
    { id: 'roots', x: 1480, y: 850, w: 50, h: 250, style: 'none', unless: 'r02.song' },
    // The whales the song raises, one above the other toward the tunnel
    // mouth: scenery, floating behind Gorti as he walks on under them.
    {
      id: 'w1',
      x: 880,
      y: 995,
      w: 230,
      h: 24,
      style: 'root',
      oneWay: true,
      when: 'r02.song',
      whale: { species: 'blue', facing: 1, from: [-40, 170], time: 1.6, delay: 0, call: 0.84, scenery: true },
    },
    {
      id: 'w2',
      x: 1080,
      y: 890,
      w: 150,
      h: 24,
      style: 'root',
      oneWay: true,
      when: 'r02.song',
      whale: { species: 'bowhead', facing: 1, from: [-40, 170], time: 1.6, delay: 1.1, call: 1, scenery: true },
    },
    {
      id: 'w3',
      x: 1190,
      y: 785,
      w: 160,
      h: 24,
      style: 'root',
      oneWay: true,
      when: 'r02.song',
      whale: { species: 'sperm', facing: 1, from: [-40, 170], time: 1.6, delay: 2.2, call: 1.2, scenery: true },
    },
  ],
  memories: [{ id: 'm1', x: 1440, y: 1100 }],
  triggers: [{ id: 'whale', x: 560, y: 900, w: 120, h: 200 }],
  exits: [{ id: 'mouth', x: 1570, y: 850, w: 30, h: 250, to: 'r03' }],
  props: [
    // The sleeping root under the whales: it stretches away with the song.
    { key: 'prop.coil', x: 1010, y: 1102, depth: -10, unless: 'r02.song' },
    { key: 'prop.fossilroot', x: 300, y: 1102, depth: -60 },
    { key: 'prop.fossil', x: 420, y: 700, depth: -60, oy: 0.5 },
    { key: 'prop.crystals.teal', x: 1330, y: 1102, depth: -5 },
    { key: 'prop.crystals.blue', x: 160, y: 1102, depth: -5, scale: 0.8 },
    { key: 'prop.crystals.orange', x: 1190, y: 1102, depth: -5, scale: 0.8 },
    { key: 'prop.fossilroot', x: 760, y: 1102, depth: -60, scale: 0.7, flipX: true },
  ],
};
