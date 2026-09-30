import type { RoomDef } from '../data/roomTypes';

// Chapter I — fossil-root chamber. A blue whale passes through the earth as
// if it were water and speaks in the three voices of the whale language
// (deep, middle, high); its song wakes the way up: three whales rise out of
// the soil one above the other, a staircase to the upper tunnel, and each
// answers in one of the voices as it arrives: a blue whale deep, a bowhead
// in the middle, a sperm whale high. The tunnel mouth keeps a memory.
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
    { id: 'r02_upper', x: 1500, y: 680 },
    { id: 'r02_top', x: 1535, y: 680, silent: true },
  ],
  solids: [
    { x: 0, y: 1100, w: 1600, h: 120, style: 'soil' },
    { x: 0, y: 0, w: 110, h: 1100, style: 'soil' },
    { x: 110, y: 0, w: 1490, h: 60, style: 'soil' },
    // The upper tunnel: its floor (the top of the lift) and its lintel.
    { x: 1400, y: 680, w: 200, h: 420, style: 'soil' },
    { x: 1330, y: 60, w: 270, h: 410, style: 'soil' },
    // The whale lift, risen by the song: 105 px a step (root jumps ~140),
    // nose to tail toward the tunnel, backs overlapping so a straight jump
    // up always finds the next whale.
    {
      id: 'w1',
      x: 880,
      y: 995,
      w: 230,
      h: 24,
      style: 'root',
      oneWay: true,
      when: 'r02.song',
      whale: { species: 'blue', facing: 1, from: [-40, 170], time: 1.6, delay: 0, call: 0.84 },
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
      whale: { species: 'bowhead', facing: 1, from: [-40, 170], time: 1.6, delay: 1.1, call: 1 },
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
      whale: { species: 'sperm', facing: 1, from: [-40, 170], time: 1.6, delay: 2.2, call: 1.2 },
    },
  ],
  memories: [{ id: 'm1', x: 1420, y: 680 }],
  triggers: [{ id: 'whale', x: 560, y: 900, w: 120, h: 200 }],
  exits: [{ id: 'up', x: 1560, y: 470, w: 40, h: 210, to: 'r03' }],
  props: [
    // The sleeping root at the foot of the lift: it stretches away with the song.
    { key: 'prop.coil', x: 1010, y: 1102, depth: -10, unless: 'r02.song' },
    { key: 'prop.fossilroot', x: 300, y: 1102, depth: -60 },
    { key: 'prop.fossil', x: 420, y: 700, depth: -60, oy: 0.5 },
    { key: 'prop.crystals.teal', x: 1330, y: 1102, depth: -5 },
    { key: 'prop.crystals.blue', x: 160, y: 1102, depth: -5, scale: 0.8 },
    { key: 'prop.crystals.orange', x: 1585, y: 682, depth: -5, scale: 0.8 },
    { key: 'prop.fossilroot', x: 760, y: 1102, depth: -60, scale: 0.7, flipX: true },
  ],
};
