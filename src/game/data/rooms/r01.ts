import type { RoomDef } from '../roomTypes';
import { BOX, PLANE, inWide } from './r01Stage';

// Chapter I — the 14th Room, as the first painting shows it: a pink box
// papered inside with a torn cream sheet, in a pale world of cracked stone.
// The back wall, the stone world and the sky are the nursery theme's planes
// (art/painting1.ts). Planes that scroll at other speeds than the world are
// placed for the opening's wide shot (r01Stage.ts): the cube house and the
// arms on the lid, the lamps at the box's two ends, the charms under it.
// Things on the back wall sit where Gorti finds them when he stands below.

/** A thing on the back wall, over world x `x` while Gorti stands under it. */
const onWall = (x: number, y: number): { x: number; y: number; scroll: number } => {
  // The camera looks 90 px ahead of him; the wall moves at 0.95 of the room.
  const scrollX = Math.min(1133, Math.max(-213, x + 90 - 640));
  return { x: x - (1 - PLANE.wall) * scrollX, y: y - (1 - PLANE.wall) * 180, scroll: PLANE.wall };
};

const wall = (x: number, y: number): { x: number; y: number; scroll: number } => ({ ...inWide(PLANE.wall, x, y), scroll: PLANE.wall });
// In front of the box, but drawn under the floor: while Gorti plays, the
// view ends at the box's bottom edge and their strings stay out of sight.
const charm = (x: number): { x: number; y: number; scroll: number; oy: number; depth: number } => ({
  ...inWide(PLANE.charms, x, BOX.bottom),
  scroll: PLANE.charms,
  oy: 0,
  depth: -5,
});

export const R01: RoomDef = {
  id: 'r01',
  chapter: 1,
  title: '14. Oda',
  width: 2200,
  height: 780,
  theme: 'nursery',
  music: 'roots',
  player: 'gorti',
  checkpoints: [
    { id: 'r01_start', x: 290, y: 660, facing: 1, silent: true },
    { id: 'r01_door', x: 1600, y: 660 },
  ],
  solids: [
    // The box's floor: the torn paper spilling over its front edge, the
    // lilac front of the box below, down to the edge the charms hang from.
    { x: 0, y: 660, w: 2200, h: 120, style: 'paper' },
    // The box keeps the room in; its walls and lid are painted on the back wall.
    { x: 0, y: 0, w: 160, h: 660, style: 'soil', hidden: true },
    { x: 160, y: 0, w: 1540, h: 130, style: 'soil', hidden: true },
    { x: 1700, y: 130, w: 70, h: 300, style: 'root', hidden: true },
    { x: 1770, y: 0, w: 430, h: 440, style: 'soil', hidden: true },
    // Tops of the bed and the gift (drawn as props): Gorti walks in front of
    // them and can still hop onto them.
    { x: 322, y: 590, w: 216, h: 20, style: 'bed', oneWay: true, hidden: true },
    { x: 842, y: 590, w: 128, h: 20, style: 'wood', oneWay: true, hidden: true },
  ],
  interacts: [
    { id: 'toywhale', x: 620, y: 660, r: 70, prompt: 'İncele' },
    { id: 'tree', x: 760, y: 660, r: 55, prompt: 'İncele' },
    { id: 'gift', x: 900, y: 640, r: 65, prompt: 'İncele' },
    { id: 'marks', x: 1090, y: 660, r: 90, prompt: 'İncele' },
    { id: 'starfolk', x: 1010, y: 660, r: 45, prompt: 'İncele' },
    { id: 'picture', x: 1245, y: 660, r: 60, prompt: 'İncele' },
    { id: 'window', x: 1441, y: 630, r: 90, prompt: 'İncele' },
    { id: 'bed', x: 430, y: 590, r: 70, prompt: 'İncele' },
  ],
  exits: [{ id: 'tunnel', x: 2150, y: 440, w: 50, h: 220, to: 'r02' }],
  props: [
    // On the lid: the cube house on its back edge, the two arms reaching down.
    { key: 'p1.arm', ...wall(640, BOX.lidBack + 56), ox: 0.311, oy: 0.987, depth: -146 },
    { key: 'p1.arm', ...wall(1560, BOX.lidBack + 56), ox: 0.689, oy: 0.987, flipX: true, depth: -146 },
    { key: 'p1.cube', ...wall(1100, BOX.lidBack + 36), scale: 1.15, depth: -144 },
    // The stage lamps at the box's two ends, pointing in.
    { key: 'p1.lamp', x: 80, y: 330, ox: 0.5, oy: 0.5, depth: -100 },
    { key: 'p1.lamp', x: 2120, y: 330, ox: 0.5, oy: 0.5, flipX: true, depth: -100 },
    // On the back wall: the fourteen notches, the green creature's
    // portrait, and the window (the painting's blue crystal sign).
    { key: 'p1.marks', ...onWall(1085, 470), oy: 0.5, depth: -120 },
    { key: 'p1.picture', ...onWall(1245, 470), oy: 0.5, depth: -120 },
    { key: 'p1.window', ...onWall(1441, 465), oy: 0.566, depth: -120 },
    // Inside the box, along the floor.
    { key: 'p1.rootling', x: 185, y: 662, depth: -30 },
    { key: 'p1.bed', x: 430, y: 662, depth: -20 },
    { key: 'p1.whale', x: 620, y: 662, depth: 5 },
    { key: 'p1.tree', x: 760, y: 662, depth: -40 },
    { key: 'p1.gift', x: 900, y: 662, depth: -20 },
    { key: 'p1.starfolk', x: 1010, y: 662, depth: -15 },
    { key: 'p1.shade', x: 1165, y: 662, depth: -10 },
    { key: 'p1.bang', x: 1206, y: 580, depth: -9 },
    { key: 'p1.flower', x: 1468, y: 662, depth: -15 },
    // The roots have already parted: the way on is always open.
    { key: 'p1.rootdoor', x: 1735, y: 662, depth: 12 },
    // Charms hanging from the bottom of the box, in front of it.
    { key: 'p1.charm.tag', ...charm(150) },
    { key: 'p1.charm.banner', ...charm(360), ox: 40 / 214 },
    { key: 'p1.charm.branch', ...charm(610), ox: 30 / 172 },
    { key: 'p1.charm.pinktag', ...charm(930) },
    { key: 'p1.charm.leaf', ...charm(1250) },
    { key: 'p1.charm.lizard', ...charm(1540), ox: 150 / 170 },
    { key: 'p1.charm.imp', ...charm(1790) },
    { key: 'p1.charm.box', ...charm(2040) },
  ],
};
