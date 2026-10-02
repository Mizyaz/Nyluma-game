// The geometry of a doorway cut into a wall of the paper box (walls.ts draws
// it): the opening's shape, and how the way narrows to it as Gorti nears
// its wall. Kept free of Phaser, so the door art and the tests can use it.

/** How a leaf opens: on a hinge, or slid, lifted, sunk or rolled into the wall. */
export type LeafKind = 'swing' | 'slide' | 'lift' | 'sink' | 'roll';

/**
 * An opening through a wall: between the depths z0 (its far jamb) and z1
 * (its near jamb), `spring` high at the jambs and `spring + rise` at the
 * crown (world px over the floor); `peak` points the arch.
 */
export interface Hole {
  z0: number;
  z1: number;
  spring: number;
  rise: number;
  peak?: number;
}

/** The height of an opening's top over the floor at depth z (0 outside it). */
export function holeTop(h: Hole, z: number): number {
  const half = Math.max(1, (h.z1 - h.z0) / 2);
  const u = (z - (h.z0 + h.z1) / 2) / half;
  if (u < -1 || u > 1) return 0;
  return h.spring + h.rise * Math.sqrt(Math.max(0, 1 - u * u)) + (h.peak ?? 0) * Math.pow(Math.max(0, 1 - Math.abs(u) * 1.45), 2.2);
}

/** The tallest an opening is (world px over the floor). */
export function holeHeight(h: Hole): number {
  return holeTop(h, (h.z0 + h.z1) / 2);
}

/** A wall as the way round it sees it: the room's right side wall (at `x`) or a wall across the room (its middle at `x`, `half` its thickness), and its opening. */
export interface WallWay {
  kind: 'side' | 'cross';
  x: number;
  half?: number;
  hole?: Hole | null;
}

/** How far from its jamb Gorti keeps (world px), and from how far off a wall begins to steer him. */
export const STEER = { margin: 26, side: 300, cross: 230, clear: 30 } as const;

const smooth01 = (t: number): number => {
  const u = Math.max(0, Math.min(1, t));
  return u * u * (3 - 2 * u);
};

/**
 * The depths Gorti may walk at, at x, between `min` and `max`: near a
 * wall's doorway the way narrows to the opening, gently, so that he goes
 * through the doorway and never through the wall. A wall without an
 * opening does not steer (it stands where no one walks).
 */
export function depthRange(walls: readonly WallWay[], x: number, min: number, max: number): { min: number; max: number } {
  let lo = min;
  let hi = max;
  for (const w of walls) {
    const h = w.hole;
    if (!h) continue;
    const a = Math.min(max, Math.max(min, h.z0 + STEER.margin));
    const b = Math.max(min, Math.min(max, h.z1 - STEER.margin));
    const dist = w.kind === 'side' ? Math.max(0, w.x - x) : Math.max(0, Math.abs(x - w.x) - (w.half ?? 8) - STEER.clear);
    const k = smooth01(1 - dist / (w.kind === 'side' ? STEER.side : STEER.cross));
    if (k <= 0) continue;
    lo = Math.max(lo, min + (a - min) * k);
    hi = Math.min(hi, max + (b - max) * k);
  }
  if (lo > hi) lo = hi = (lo + hi) / 2;
  return { min: lo, max: hi };
}
