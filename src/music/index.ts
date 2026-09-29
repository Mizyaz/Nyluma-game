// Music module: generated piano music and a licensed recording library.
// Independent of the game engine: give it an AudioContext and an output node.
// See src/music/README.md.
export { Composer } from './composer';
export { ALLOWED_LICENSES, checkLibrary, loadLibrary, trackUrl, tracksFor } from './library';
export { MOODS } from './moods';
export { Piano, roomImpulse } from './piano';
export { MusicPlayer, type MusicSource, type MusicState } from './player';
export { MUSIC_CUES, type Bar, type Mood, type MusicCue, type NoteEvent, type Track } from './types';
