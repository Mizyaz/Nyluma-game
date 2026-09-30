import type { RoomDef, SolidDef } from '../roomTypes';

/** The crystal tree's trunk (the script's Moon, Sun and star gather around it). */
export const R03_TREE_X = 2150;

/**
 * The way up the tree, grown by the bloom: whales circling the trunk, one
 * turn every two whales, 100 px a step (root jumps ~140). Front whales swim
 * left across the trunk, the far ones swim right behind it, so the line
 * reads as a spiral; they circle in one after the other and answer higher
 * and higher. The last one lies under the canopy exit.
 */
const SPIRAL: readonly { y: number; back: boolean }[] = [
  { y: 1080, back: false },
  { y: 980, back: true },
  { y: 880, back: false },
  { y: 780, back: true },
  { y: 680, back: false },
];
const spiral: SolidDef[] = SPIRAL.map(({ y, back }, i) => ({
  id: `s${i + 1}`,
  x: R03_TREE_X - 80 + (back ? 14 : -14),
  y,
  w: 160,
  h: 24,
  style: 'root',
  oneWay: true,
  when: 'r03.bloom',
  whale: {
    species: back ? 'sperm' : 'blue',
    facing: back ? 1 : -1,
    behind: back,
    from: [back ? -170 : 170, 0],
    time: 1.5,
    // 0.8 s apart: each rising call is heard (two whale voices at a time).
    delay: 0.8 * i,
    call: 0.86 + 0.095 * i,
  },
}));

// Chapter I — the crystal-tree chamber. A blue whale lies across the poisoned
// pool like a bridge (its back carries the wooden-whale memory); past it, at
// the tree, the Moon and the Sun appear in the canopy, and the tree blooms
// into a way up: the whale spiral to the canopy exit.
export const R03: RoomDef = {
  id: 'r03',
  chapter: 1,
  title: 'Kristal Ağacın Odası',
  width: 2600,
  height: 1400,
  theme: 'chamber',
  music: 'roots',
  player: 'gorti',
  killY: 1480,
  checkpoints: [
    { id: 'r03_start', x: 190, y: 1200, facing: 1, silent: true },
    { id: 'r03_pool', x: 540, y: 1200 },
    { id: 'r03_focus', x: 1300, y: 1180 },
    { id: 'r03_tree', x: R03_TREE_X - 350, y: 1180 },
    { id: 'r03_canopy', x: R03_TREE_X, y: 780, silent: true },
  ],
  solids: [
    { x: 0, y: 1200, w: 760, h: 200, style: 'soil' },
    { x: 0, y: 0, w: 120, h: 1200, style: 'soil' },
    { x: 280, y: 0, w: 360, h: 1100, style: 'soil' },
    // The poisoned pool and the whale lying across it: a hop up onto its
    // back from the near bank, a step down onto the far one.
    { x: 760, y: 1280, w: 340, h: 120, style: 'soil' },
    { id: 'bridge', x: 760, y: 1140, w: 340, h: 24, style: 'root', oneWay: true, whale: { species: 'blue', facing: 1 } },
    { x: 1100, y: 1180, w: 1500, h: 220, style: 'soil' },
    ...spiral,
  ],
  memories: [{ id: 'm2', x: 930, y: 1140 }],
  exits: [{ id: 'canopy', x: R03_TREE_X - 90, y: 530, w: 180, h: 150, to: 'r04', when: 'r03.bloom' }],
  props: [
    { key: 'prop.pool.poison', x: 930, y: 1282, depth: 15, scale: 0.61 },
    { key: 'prop.crystaltree', x: R03_TREE_X, y: 1182, depth: -30, unless: 'r03.bloom' },
    { key: 'prop.crystaltree.bloom', x: R03_TREE_X, y: 1182, depth: -30, when: 'r03.bloom' },
    { key: 'prop.crystals.teal', x: 200, y: 1202, depth: -5, scale: 0.8 },
    { key: 'prop.crystals.blue', x: 1450, y: 1182, depth: -5, scale: 0.7 },
    { key: 'prop.crystals.orange', x: 1720, y: 1182, depth: -5, scale: 0.9 },
    { key: 'prop.fossilroot', x: 1560, y: 1182, depth: -60, scale: 0.8 },
  ],
};
