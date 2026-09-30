import { VIEW_H, VIEW_W } from '../../constants';

// The 14th Room as the first painting shows it: a pink box in a cracked
// stone world. The room opens on a wide shot of the whole box, framed the
// way the painting frames it; everything that scrolls at another speed than
// the world (the stone world, the moon and the sun, the back wall, the
// charms below) is placed so that it stands where the painting puts it in
// that shot. Shared by the room data, its art and its script.

/** Room width (unchanged from the original room). */
export const ROOM_W = 2200;

/**
 * The establishing shot: the whole box from lamp to lamp. The view is as
 * wide as the room and reaches above it, so the box sits in it the way it
 * sits in the painting: its lid starts 29% down, its bottom is 81% down,
 * with the sky above and the charms and the stone below.
 */
export const WIDE = { zoom: VIEW_W / ROOM_W, x: ROOM_W / 2, y: 395.75 } as const;

/** Top of the wide view (world px); the camera bounds open up to here. */
export const WIDE_TOP = WIDE.y - VIEW_H / 2 / WIDE.zoom;

/** Camera scroll in the wide shot (Phaser: scroll = centre − half the view). */
const WIDE_SCROLL = { x: WIDE.x - VIEW_W / 2, y: WIDE.y - VIEW_H / 2 } as const;

/** Scroll factors of the room's planes, far to near. */
export const PLANE = {
  /** The cracked stone world. */
  stone: 0.25,
  /** Moon, stars, the sad sun and its star creature. */
  sky: 0.4,
  /** The box's back wall and what stands on it or hangs on it. */
  wall: 0.95,
  /** The charms hanging below the box, in front of it. */
  charms: 1.08,
} as const;

/**
 * Where something with scroll factor `s` has to be placed so that it shows
 * at (x, y) in the wide shot.
 */
export function inWide(s: number, x: number, y: number): { x: number; y: number } {
  return { x: x - (1 - s) * WIDE_SCROLL.x, y: y - (1 - s) * WIDE_SCROLL.y };
}

/** The box as the wide shot shows it (world px). */
export const BOX = {
  /** The pink lid: its back edge (where the cube house stands) and front edge. */
  lidBack: 140,
  lidBackLeft: 430,
  lidBackRight: 1770,
  lidFront: 380,
  /** The back wall between the two lilac side walls, down to its foot. */
  wallLeft: 150,
  wallRight: 2050,
  wallFoot: 600,
  floor: 660,
  /** The bottom edge of the box's front (the floor's own), where the charms hang. */
  bottom: 780,
} as const;
