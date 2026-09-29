import type { RoomDef } from './roomTypes';
import type { RoomId } from '../state/types';
import { R01 } from './rooms/r01';
import { R02 } from './rooms/r02';
import { R03 } from './rooms/r03';
import { R04 } from './rooms/r04';
import { R05 } from './rooms/r05';
import { R06 } from './rooms/r06';
import { R07 } from './rooms/r07';
import { R08 } from './rooms/r08';
import { R09 } from './rooms/r09';
import { R10 } from './rooms/r10';
import { R11 } from './rooms/r11';
import { R12 } from './rooms/r12';

export const ROOMS: Record<RoomId, RoomDef> = {
  r01: R01,
  r02: R02,
  r03: R03,
  r04: R04,
  r05: R05,
  r06: R06,
  r07: R07,
  r08: R08,
  r09: R09,
  r10: R10,
  r11: R11,
  r12: R12,
};

export function roomDef(id: RoomId): RoomDef {
  return ROOMS[id];
}

/** Room that follows `id` in the story (scripted transitions use this too). */
export const NEXT_ROOM: Partial<Record<RoomId, RoomId>> = {
  r01: 'r02',
  r02: 'r03',
  r03: 'r04',
  r04: 'r05',
  r05: 'r06',
  r06: 'r07',
  r07: 'r08',
  r08: 'r09',
  r09: 'r10',
  r10: 'r11',
  r11: 'r12',
};
