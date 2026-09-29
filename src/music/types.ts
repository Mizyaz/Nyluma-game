/** A place in the game that asks for music (rooms name one of these). */
export type MusicCue = 'menu' | 'roots' | 'forest' | 'ride' | 'sun' | 'inner' | 'final';

export const MUSIC_CUES: readonly MusicCue[] = ['menu', 'roots', 'forest', 'ride', 'sun', 'inner', 'final'];

/** One piano key press inside a bar. */
export interface NoteEvent {
  /** Seconds from the start of the bar. */
  t: number;
  midi: number;
  /** 0..1 */
  vel: number;
  /** Seconds from the start of the bar at which the string is damped. */
  off: number;
  hand: 'L' | 'R';
}

export interface Bar {
  /** Length in seconds. */
  len: number;
  notes: NoteEvent[];
  /** Which part of the piece this bar belongs to (for tests and tools). */
  section: SectionKind;
  /** Scale degree of the bar's chord (0 = tonic). */
  degree: number;
}

export type SectionKind = 'A' | 'A2' | 'B' | 'A3' | 'interlude';

/** Left-hand accompaniment figures, one entry per eighth note. */
export type LeftHand = 'flow' | 'broken' | 'block' | 'pulse' | 'ostinato';

/** How long the sustain pedal holds notes. */
export type Pedal = 'bar' | 'half';

/** Musical character of one cue. */
export interface Mood {
  bpm: number;
  /** Beats (quarter notes) per bar. */
  beats: 3 | 4;
  /** MIDI note of the key's tonic (any octave). */
  tonic: number;
  scale: readonly number[];
  /** The V chord takes a raised leading tone (harmonic minor). */
  raiseLeading?: boolean;
  /** Four-chord progressions (scale degrees, 0-based) for the main theme… */
  progressions: readonly (readonly number[])[];
  /** …and for the contrasting middle section. */
  bridge: readonly (readonly number[])[];
  /** Closing two chords of the piece's last phrase (default V → I). */
  cadence?: readonly [number, number];
  lh: LeftHand;
  lhBridge: LeftHand;
  /** Lowest MIDI note for left-hand chord roots. */
  lhLow: number;
  /** Melody register [low, high] (MIDI). */
  melody: readonly [number, number];
  /** 0..1: chance of a rest in the melody. */
  rest: number;
  /** 0..1: calm (long notes) to busy (short notes). */
  motion: number;
  /** 0..1: overall loudness. */
  vel: number;
  /** 0..1: chance of an added ninth in the accompaniment. */
  color: number;
  /** 0..1: chance per bar of a soft high note (music-box sparkle). */
  sparkle: number;
  pedal: Pedal;
}

/** A recorded piece from the music library (see music/README.md). */
export interface Track {
  id: string;
  title: string;
  artist: string;
  /** Path inside the library folder (music/), e.g. "tracks/calm.mp3". */
  file?: string;
  /** Or a full https:// address for a piece streamed from an online library. */
  url?: string;
  /** SPDX-style license id, e.g. "CC0-1.0". */
  license: string;
  /** Where the piece and its license were found. */
  source: string;
  /** Cues this piece may play for; "*" = any cue. */
  cues: string[];
  /** Optional loudness trim, 0..1.5 (default 1). */
  volume?: number;
}
