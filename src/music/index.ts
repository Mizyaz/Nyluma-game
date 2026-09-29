// Music module: generated music (a piano, a bowed-string ensemble) and a
// licensed recording library. Independent of the game engine: give it an
// AudioContext and an output node. See src/music/README.md.
export { Composer } from './composer';
export { SCORES, composeCue, type CueScore } from './cues';
export { Ensemble } from './ensemble';
export type { Instrument } from './instrument';
export { ALLOWED_LICENSES, checkLibrary, loadLibrary, trackUrl, tracksFor } from './library';
export { MOODS, STRING_MOODS } from './moods';
export { Piano } from './piano';
export { CROSSFADE, MusicPlayer, type MusicSource, type MusicState } from './player';
export { Room, roomImpulse } from './room';
export { StringComposer } from './stringComposer';
export { HIGH_STRINGS, LOW_STRINGS, Strings, type StringSection } from './strings';
export {
  MUSIC_CUES,
  PIANO_CUES,
  STRING_CUES,
  type Articulation,
  type Bar,
  type BarSource,
  type InstrumentId,
  type Mood,
  type MusicCue,
  type NoteEvent,
  type StringMood,
  type Track,
} from './types';
