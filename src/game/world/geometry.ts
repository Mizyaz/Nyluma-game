import type { RoomDef } from '../data/roomTypes';

/** Top of the first surface under (x, fromY); the room's bottom if none. */
export function floorBelow(def: RoomDef, x: number, fromY: number): number {
  let best = def.height;
  for (const s of def.solids) {
    if (x < s.x || x > s.x + s.w || s.y < fromY) continue;
    best = Math.min(best, s.y);
  }
  return best;
}
