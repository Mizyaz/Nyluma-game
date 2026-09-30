import { ROOM_IDS, type RoomId } from '../../engine/state/types';
import type { MoveFamily } from './types';

/**
 * How each family of moves grows through the story: from the named room on,
 * the family has at least that tier. Rooms before the first entry do not
 * have the family yet.
 *
 * - bloom (root Gorti): 1 flower and 1 bird → a fan of flowers and a small
 *   flock → a flower bed and a great flock.
 * - earth (Gorti as the Sivaslı amca): the ground shakes → and the Moon rises
 *   → and a purple horse comes out of the ground (the horse is born in r06).
 * - spark (the other forms): coloured crystals, always the same.
 */
export const MOVE_TIERS: Record<MoveFamily, Partial<Record<RoomId, number>>> = {
  bloom: { r01: 1, r03: 2, r06: 3 },
  earth: { r04: 1, r05: 2, r06: 3 },
  spark: { r01: 1 },
};

export function tierOf(family: MoveFamily, room: RoomId): number {
  const at = ROOM_IDS.indexOf(room);
  let tier = 0;
  for (const [r, t] of Object.entries(MOVE_TIERS[family]) as [RoomId, number][]) {
    if (at >= ROOM_IDS.indexOf(r)) tier = Math.max(tier, t);
  }
  return tier;
}
