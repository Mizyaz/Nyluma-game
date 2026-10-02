import type { RoomDef } from '../../content/data/roomTypes';

/** Top of the first surface under (x, fromY); the room's bottom if none. */
export function floorBelow(def: RoomDef, x: number, fromY: number): number {
  let best = def.height;
  for (const s of def.solids) {
    if (x < s.x || x > s.x + s.w || s.y < fromY) continue;
    best = Math.min(best, s.y);
  }
  return best;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * A gate is a wall the story opens (`unless`) standing on the floor. It
 * stops Gorti at every height: its body reaches up to the room's top, so no
 * jump clears it and no jump lands on it. Returns the body's top (world y),
 * or the solid's own top when it is not a gate.
 */
export function bodyTop(s: RoomDef['solids'][number], floor: number): number {
  const gate = !!s.unless && !s.oneWay && !s.whale && s.y + s.h >= floor - 1;
  return gate ? Math.min(0, s.y) : s.y;
}

/**
 * What a figure in the air meets on its way: its hull stretched down to the
 * ground below it (as if it walked under its jump). On the ground, or with
 * nothing below, the hull itself.
 */
export function sweptHull(hull: Box, ground: number | null): Box {
  const bottom = hull.y + hull.h;
  return ground !== null && ground > bottom ? { x: hull.x, y: hull.y, w: hull.w, h: ground - hull.y } : hull;
}

export function overlaps(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
