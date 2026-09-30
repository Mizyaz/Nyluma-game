// The shape of content files: chapters (src/content/chapters/chapters.json)
// and rooms (src/content/chapters/rooms/*.json). A room file says what is in
// the room and what happens there; `compile.ts` turns it into the runtime's
// RoomDef and a behaviour spec. Positions are world px; the ground is flat.
// Conditions (`when`, `unless`, `open`, `if`) use the language of cond.ts.
// The shapes are written once, as the schema (schema.ts, with the help text
// editors show); the game imports only these types.

import type { SkyJson } from './schema';

export type {
  ActionJson,
  ChapterJson,
  ExitJson,
  GateJson,
  LineJson,
  NpcJson,
  PropJson,
  RoomJson,
  SkyJson,
  StoryJson,
  TriggerJson,
} from './schema';

export type MoonKind = NonNullable<SkyJson['moon']>;
export type SunMood = NonNullable<SkyJson['sun']>;
/** Which one shines: Gorti's kahkaha swaps the Sun and the Moon. */
export type SkyOut = NonNullable<SkyJson['out']>;
