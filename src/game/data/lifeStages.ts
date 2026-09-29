import { ROOM_IDS, type RoomId } from '../state/types';

// Gorti grows up through the story, as in the author's paintings: the small
// root child of the 14th Room (painting 1), the youth of "Late to Work"
// (painting 3) and the warrior (painting 4). His own (root) body takes the
// look of the stage he is in; the other forms keep their own bodies.

export type LifeStage = 'child' | 'youth' | 'warrior';

/** From which room on each stage begins (in story order). */
export const LIFE_STAGE_FROM: readonly (readonly [LifeStage, RoomId])[] = [
  ['child', 'r01'],
  ['youth', 'r04'],
  ['warrior', 'r09'],
];

export function lifeStageOf(room: RoomId): LifeStage {
  const at = ROOM_IDS.indexOf(room);
  let stage: LifeStage = 'child';
  for (const [s, from] of LIFE_STAGE_FROM) if (at >= ROOM_IDS.indexOf(from)) stage = s;
  return stage;
}
