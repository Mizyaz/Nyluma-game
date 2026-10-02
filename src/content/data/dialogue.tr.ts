import type { Line } from '../../ui/Dialogue';
import { CAPTIONS as captions, DIALOGUE as dialogue, NAMES as names } from '../text/text';

// Player-facing narrative text (Turkish). The text itself is in
// src/content/text/*.json, where the user edits it (docs/METINLER.md):
// names.json, captions.json, dialogue.json and inspect.json. These are the
// names the code has always used for it. Anchor lines from the source are
// kept verbatim; everything else is short, solemn and adapted from it.

/** Who is called what. */
export const NAMES = names;

/** The narration under the picture, by key. */
export const CAPTIONS = captions;

/** Conversations and inspections, by key; a `who` is a name from NAMES (none: the narrator). */
export const DIALOGUE: Record<string, Line[]> = dialogue;
