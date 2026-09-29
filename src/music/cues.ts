import { Composer } from './composer';
import { MOODS, STRING_MOODS } from './moods';
import { StringComposer } from './stringComposer';
import type { BarSource, MusicCue, PianoCue, StringCue } from './types';

/** What makes a cue's music when no library recording plays it. */
export interface CueScore {
  /** The kind of sound, as MusicPlayer.state() reports it. */
  readonly source: 'piano' | 'strings';
  /** A composer for the cue, starting from `seed`. */
  compose(seed: number): BarSource;
}

const piano = (cue: PianoCue): CueScore => ({ source: 'piano', compose: (seed) => new Composer(MOODS[cue], seed) });
const strings = (cue: StringCue): CueScore => ({ source: 'strings', compose: (seed) => new StringComposer(STRING_MOODS[cue], seed) });

/** Every cue's generated music (a cue missing here does not compile). */
export const SCORES: Record<MusicCue, CueScore> = {
  menu: piano('menu'),
  roots: piano('roots'),
  forest: piano('forest'),
  ride: piano('ride'),
  sun: piano('sun'),
  inner: piano('inner'),
  final: piano('final'),
  tension: strings('tension'),
};

/** A composer for `cue`, starting from `seed`. */
export function composeCue(cue: MusicCue, seed: number): BarSource {
  return SCORES[cue].compose(seed);
}
