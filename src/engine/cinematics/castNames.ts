import { NAMES } from '../../content/data/dialogue.tr';

/** Who can appear in a face-animated dialogue scene. */
export const CAST_IDS = ['gorti', 'babyMoon', 'oldMoon', 'sun', 'horse', 'coward', 'forms', 'voice', 'one', 'two', 'three'] as const;

export type CastId = (typeof CAST_IDS)[number];

/** The name each cast member speaks under in the dialogue lines. */
export const CAST_NAMES: Record<CastId, string> = {
  gorti: NAMES.gorti,
  babyMoon: NAMES.babyMoon,
  oldMoon: NAMES.oldMoon,
  sun: NAMES.sun,
  horse: NAMES.horse,
  coward: NAMES.coward,
  forms: NAMES.forms,
  voice: NAMES.voice,
  one: NAMES.one,
  two: NAMES.two,
  three: NAMES.three,
};
