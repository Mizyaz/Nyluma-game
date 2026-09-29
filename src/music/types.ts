/** Places in the game whose music is generated piano (rooms name these). */
export type PianoCue = 'menu' | 'roots' | 'forest' | 'ride' | 'sun' | 'inner' | 'final';

/** Cues played by the synthesized string ensemble ('tension': dialogue scenes). */
export type StringCue = 'tension';

/** A place or a moment in the game that asks for music. */
export type MusicCue = PianoCue | StringCue;

export const PIANO_CUES: readonly PianoCue[] = ['menu', 'roots', 'forest', 'ride', 'sun', 'inner', 'final'];

export const STRING_CUES: readonly StringCue[] = ['tension'];

export const MUSIC_CUES: readonly MusicCue[] = [...PIANO_CUES, ...STRING_CUES];

/** Instruments the generated music can play on. */
export type InstrumentId = 'piano' | 'low-strings' | 'high-strings';

/**
 * How a note is played. The piano ignores it; the strings bow it:
 * `legato` sustained (long notes swell), `tremolo` rapid bow strokes,
 * `marcato` an accented, biting attack, `ostinato` short driving strokes.
 */
export type Articulation = 'legato' | 'tremolo' | 'marcato' | 'ostinato';

/** One note inside a bar. */
export interface NoteEvent {
  /** Seconds from the start of the bar. */
  t: number;
  midi: number;
  /** 0..1 */
  vel: number;
  /**
   * Seconds from the start of the bar at which the note stops (the damper
   * falls, or the bow leaves the string). Beyond the bar's end it is a tie.
   */
  off: number;
  /** Who plays it: the piano's left or right hand; for strings the low ('L') or high ('R') section. */
  hand: 'L' | 'R';
  /** The instrument that plays it (default 'piano'). */
  inst?: InstrumentId;
  /** How it is played (default: the instrument's natural stroke). */
  art?: Articulation;
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

/** Writes a piece bar by bar. Pure: the same settings and seed give the same bars. */
export interface BarSource {
  next(): Bar;
}

export type SectionKind = 'A' | 'A2' | 'B' | 'A3' | 'interlude';

/** Left-hand accompaniment figures, one entry per eighth note. */
export type LeftHand = 'flow' | 'broken' | 'block' | 'pulse' | 'ostinato';

/** How long the sustain pedal holds notes. */
export type Pedal = 'bar' | 'half';

/** Key, tempo, harmony and loudness: what every cue's character starts from. */
export interface Harmony {
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
  /** 0..1: overall loudness. */
  vel: number;
}

/** Musical character of one piano cue. */
export interface Mood extends Harmony {
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
  /** 0..1: chance of an added ninth in the accompaniment. */
  color: number;
  /** 0..1: chance per bar of a soft high note (music-box sparkle). */
  sparkle: number;
  pedal: Pedal;
}

/** Figures for the low strings' ostinato (see PULSES in stringComposer.ts). */
export type PulseName = 'drive' | 'tresillo' | 'surge' | 'heartbeat';

/** What the string ensemble plays in one section of the form. */
export interface StringTexture {
  /** The low strings' ostinato figure. */
  pulse: PulseName;
  /** The violin line: none, one line, or doubled an octave below. */
  line: 'none' | 'single' | 'octaves';
  /** Register of the line's top voice [low, high] (MIDI). */
  lineRange: readonly [number, number];
  /** Held inner voices (violas, second violins) under the line. */
  pad: 0 | 1 | 2;
  padArt: 'legato' | 'tremolo';
  /** Register of the inner voices [low, high] (MIDI). */
  padRange: readonly [number, number];
  /** Loudness 0..1 at the section's first and last bar: rising is a swell. */
  dyn: readonly [number, number];
  /** 0..1: chance of a marcato hit by the whole ensemble at a phrase end. */
  hits: number;
}

/** Musical character of a cue for the string ensemble. */
export interface StringMood extends Harmony {
  /** Low section (cellos and basses) register [low, high] (MIDI). */
  low: readonly [number, number];
  /** High section (violins and violas) register [low, high] (MIDI). */
  high: readonly [number, number];
  texture: Record<SectionKind, StringTexture>;
  /** 0..1: how often a line note is held over the barline as a suspension, when the next chord allows one. */
  suspend: number;
  /** 0..1: calm (long notes) to busy (shorter notes) in the violin line. */
  motion: number;
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
  /** Cues this piece may play for; "*" = any room cue (a scene cue such as 'tension' must be named). */
  cues: string[];
  /** Optional loudness trim, 0..1.5 (default 1). */
  volume?: number;
}
