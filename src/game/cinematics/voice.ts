import type { Line } from '../../ui/Dialogue';

/** How a line sounds (drives the speaker's face). */
export type Voice = 'say' | 'shout' | 'whisper';

/** Whispered lines are marked; a line ending in '!' is shouted. */
export function voiceOf(line: Line | null): Voice {
  if (!line) return 'say';
  if (line.whisper) return 'whisper';
  return /!\s*$/.test(line.text) ? 'shout' : 'say';
}
