// The story text, read from the JSON files beside this one: the user edits
// those (docs/METINLER.md). Each file is checked as it loads (check.ts): a
// bad entry falls back to a default ("…", or a name's own key) and, while
// developing, says so in the console with its file and key. A key the code
// asks for that a file lacks gets the default too, so the game never
// breaks on its text. `npm run kd -- check` reports the same problems.

import namesJson from './names.json';
import captionsJson from './captions.json';
import dialogueJson from './dialogue.json';
import inspectJson from './inspect.json';
import memoriesJson from './memories.json';
import paintingsJson from './paintings.json';
import documentsJson from './documents.json';
import skyJson from './sky.json';
import {
  checkCaptions,
  checkDialogue,
  checkDocuments,
  checkMemories,
  checkNames,
  checkPaintings,
  checkSky,
  linesOf,
  lookOf,
  MISSING,
  type FaceLook,
  type NameKey,
  type SkyLine,
  type TextLine,
  type TextProblem,
} from './check';

/** Every problem found in the text files as they loaded (empty when all is well). */
export const TEXT_PROBLEMS: TextProblem[] = [];

const DEV = (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;
const warned = new Set<string>();

function warn(p: Pick<TextProblem, 'file' | 'key' | 'message'>): void {
  const line = `[metin] ${p.file} › ${p.key || '(dosya)'}: ${p.message}`;
  if (!DEV || warned.has(line)) return;
  warned.add(line);
  console.warn(line);
}

function keep<T>(r: { value: T; problems: TextProblem[] }): T {
  TEXT_PROBLEMS.push(...r.problems);
  for (const p of r.problems) warn(p);
  return r.value;
}

/** Keys a lookup may ask without meaning a line (promises, test printers, inspectors). */
const NOT_TEXT = new Set(['then', 'toJSON', 'constructor', 'asymmetricMatch', 'nodeType', 'tagName', 'inspect', 'length']);

/**
 * A text table that answers a key it lacks with a default line (and a
 * console warning while developing) instead of `undefined`.
 */
function withDefaults<T extends object>(table: T, file: string, fallback: () => unknown): T {
  return new Proxy(table, {
    get(t, k, recv) {
      if (typeof k !== 'string' || k in t || NOT_TEXT.has(k) || !/^[A-Za-z]/.test(k)) return Reflect.get(t, k, recv);
      warn({ file, key: k, message: 'kod bu anahtarı istiyor ama dosyada yok' });
      return fallback();
    },
  });
}

type Keys<J> = Exclude<keyof J, '$schema'>;

/** Who is called what (names.json). */
export const NAMES: Readonly<Record<NameKey, string>> = keep(checkNames(namesJson));

/** The narration under the picture (captions.json). */
export const CAPTIONS: Readonly<Record<Keys<typeof captionsJson>, string>> = withDefaults(
  keep(checkCaptions(captionsJson)) as Record<Keys<typeof captionsJson>, string>,
  'captions.json',
  () => MISSING,
);

/** Conversations and what Gorti reads when he inspects something (dialogue.json, inspect.json). */
export const DIALOGUE: Record<string, TextLine[]> = withDefaults(
  { ...keep(checkDialogue(inspectJson, NAMES, 'inspect.json')), ...keep(checkDialogue(dialogueJson, NAMES, 'dialogue.json')) },
  'dialogue.json',
  () => [{ text: MISSING }],
);
for (const k of Object.keys(inspectJson)) {
  if (k !== '$schema' && k in dialogueJson) warn({ file: 'dialogue.json', key: k, message: 'inspect.json\'da da var; dialogue.json\'daki geçerli' });
}

/** The memories Gorti finds, and the ones that run backwards in the ward (memories.json). */
export const MEMORY_TEXT = keep(checkMemories(memoriesJson));

/** The paintings' titles and captions (paintings.json). */
export const PAINTING_TEXT = keep(checkPaintings(paintingsJson));

/** The papers on the empty table, r12 (documents.json). */
export const DOCUMENTS = keep(checkDocuments(documentsJson));

/** The Sun's and the Moon's looks and sayings (sky.json). */
export const SKY_TEXT = keep(checkSky(skyJson));

/** How `who` looks on a room's page (each field: the room's, else its chapter's, else the default). */
export function skyLook(who: 'sun' | 'moon', room: string | null, chapter: string | null): FaceLook {
  return lookOf(SKY_TEXT, who, room, chapter);
}

/** What `who` may say on a room's page (never empty). */
export function skyLines(who: 'sun' | 'moon', room: string | null, chapter: string | null): SkyLine[] {
  return linesOf(SKY_TEXT, who, room, chapter);
}
