import type { RoomDef } from './roomTypes';
import { ROOM_IDS, type RoomId } from '../../engine/state/types';
import { compileRoom, type RoomSpec } from '../../engine/content/compile';
import type { ChapterJson, RoomJson, SkyJson, StoryJson } from '../../engine/content/types';
import storyJson from '../chapters/chapters.json';
import { R01 } from '../rooms/r01';
import { R02 } from '../rooms/r02';
import { R03 } from '../rooms/r03';
import { R04 } from '../rooms/r04';
import { R05 } from '../rooms/r05';
import { R06 } from '../rooms/r06';
import { R07 } from '../rooms/r07';
import { R08 } from '../rooms/r08';
import { R09 } from '../rooms/r09';
import { R10 } from '../rooms/r10';
import { R11 } from '../rooms/r11';
import { R12 } from '../rooms/r12';

// Every room the game knows: the rooms written in TypeScript (content/rooms)
// and the room files (content/chapters/rooms/*.json), which are compiled
// here. The story's order is chapters.json.

export const STORY = storyJson as StoryJson;

/** Rooms written in TypeScript, with their own scripts (content/scripts). */
export const BUILT_IN_ROOMS: Record<string, RoomDef> = {
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

/** The room files, as written. */
export const ROOM_FILES: readonly RoomJson[] = Object.values(
  import.meta.glob<RoomJson>('../chapters/rooms/*.json', { eager: true, import: 'default' }),
);

const specs = new Map<string, RoomSpec>();
export const ROOMS: Record<string, RoomDef> = { ...BUILT_IN_ROOMS };
for (const file of ROOM_FILES) {
  const ch = STORY.chapters.find((c) => c.id === file.chapter);
  if (!ch) continue; // `npm run kd -- check` reports it
  const { def, spec } = compileRoom(file, ch);
  ROOMS[file.id] = def;
  specs.set(file.id, spec);
}

export function roomDef(id: RoomId): RoomDef {
  const d = ROOMS[id];
  if (!d) throw new Error(`no room "${id}"`);
  return d;
}

/** What a room file does (undefined for TypeScript rooms). */
export function roomSpec(id: RoomId): RoomSpec | undefined {
  return specs.get(id);
}

/** The chapter a room belongs to. */
export function chapterOfRoom(id: RoomId): ChapterJson | undefined {
  return STORY.chapters.find((c) => c.rooms.includes(id));
}

/** The Moon and the Sun over a room: the room file's, else its chapter's. */
export function skyOf(id: RoomId): Required<SkyJson> {
  const ch = chapterOfRoom(id)?.sky;
  return specs.get(id)?.sky ?? { moon: 'none', sun: 'none', out: 'none', ...ch };
}

/** Room that follows `id` in the story (scripted transitions use this too). */
export const NEXT_ROOM: Partial<Record<RoomId, RoomId>> = Object.fromEntries(ROOM_IDS.slice(0, -1).map((id, i) => [id, ROOM_IDS[i + 1]!]));
