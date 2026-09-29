import { SCALES } from './theory';
import type { Mood, PianoCue, StringCue, StringMood } from './types';

// The character of each cue: key, tempo, harmony and texture. Progressions
// are scale degrees (0 = tonic), one chord per bar.
export const MOODS: Record<PianoCue, Mood> = {
  // Title screen: D major, an unhurried flowing arpeggio.
  menu: {
    bpm: 66,
    beats: 4,
    tonic: 62,
    scale: SCALES.major,
    progressions: [
      [0, 4, 5, 3],
      [0, 5, 3, 4],
      [5, 3, 0, 4],
    ],
    bridge: [
      [3, 0, 4, 5],
      [1, 4, 0, 5],
      [3, 4, 2, 5],
    ],
    lh: 'flow',
    lhBridge: 'broken',
    lhLow: 38,
    melody: [66, 83],
    rest: 0.18,
    motion: 0.35,
    vel: 0.55,
    color: 0.35,
    sparkle: 0.12,
    pedal: 'bar',
  },
  // Chapter I, under the world: A minor waltz, low and sparse.
  roots: {
    bpm: 58,
    beats: 3,
    tonic: 57,
    scale: SCALES.minor,
    progressions: [
      [0, 5, 2, 6],
      [0, 3, 5, 4],
      [0, 6, 5, 6],
    ],
    bridge: [
      [5, 6, 0, 0],
      [3, 4, 0, 0],
      [5, 3, 6, 4],
    ],
    cadence: [6, 0],
    lh: 'flow',
    lhBridge: 'block',
    lhLow: 33,
    melody: [60, 77],
    rest: 0.3,
    motion: 0.25,
    vel: 0.46,
    color: 0.4,
    sparkle: 0.1,
    pedal: 'bar',
  },
  // Forests and clearings: F lydian waltz, bright and airy.
  forest: {
    bpm: 76,
    beats: 3,
    tonic: 65,
    scale: SCALES.lydian,
    // Lydian's major II is the colour; its #iv chord (diminished) is avoided.
    progressions: [
      [0, 1, 0, 4],
      [0, 1, 5, 4],
      [0, 6, 5, 1],
    ],
    bridge: [
      [5, 1, 0, 4],
      [2, 5, 1, 1],
    ],
    lh: 'flow',
    lhBridge: 'broken',
    lhLow: 41,
    melody: [67, 86],
    rest: 0.2,
    motion: 0.45,
    vel: 0.5,
    color: 0.35,
    sparkle: 0.2,
    pedal: 'bar',
  },
  // The ride on the violet horse: D mixolydian, driving eighths.
  ride: {
    bpm: 100,
    beats: 4,
    tonic: 62,
    scale: SCALES.mixolydian,
    progressions: [
      [0, 6, 3, 0],
      [0, 3, 6, 3],
      [0, 6, 5, 6],
    ],
    bridge: [
      [3, 6, 0, 0],
      [5, 6, 3, 0],
    ],
    cadence: [6, 0],
    lh: 'pulse',
    lhBridge: 'flow',
    lhLow: 38,
    melody: [69, 88],
    rest: 0.12,
    motion: 0.7,
    vel: 0.62,
    color: 0.2,
    sparkle: 0,
    pedal: 'half',
  },
  // The Sun: C harmonic minor, low octaves under tense chords.
  sun: {
    bpm: 84,
    beats: 4,
    tonic: 60,
    scale: SCALES.minor,
    raiseLeading: true,
    progressions: [
      [0, 5, 4, 0],
      [0, 3, 4, 4],
      [0, 1, 4, 0],
    ],
    bridge: [
      [5, 3, 4, 4],
      [3, 5, 1, 4],
    ],
    lh: 'ostinato',
    lhBridge: 'pulse',
    lhLow: 36,
    melody: [60, 79],
    rest: 0.25,
    motion: 0.55,
    vel: 0.6,
    color: 0.1,
    sparkle: 0.05,
    pedal: 'half',
  },
  // Inside Gorti: E minor, music-box figures up high.
  inner: {
    bpm: 70,
    beats: 4,
    tonic: 64,
    scale: SCALES.minor,
    progressions: [
      [0, 5, 2, 6],
      [0, 3, 6, 2],
    ],
    bridge: [
      [5, 6, 0, 0],
      [3, 6, 2, 5],
    ],
    cadence: [6, 0],
    lh: 'broken',
    lhBridge: 'flow',
    lhLow: 40,
    melody: [71, 91],
    rest: 0.2,
    motion: 0.5,
    vel: 0.45,
    color: 0.25,
    sparkle: 0.35,
    pedal: 'bar',
  },
  // The empty desk and the ending: A minor, slow chords, few words.
  final: {
    bpm: 54,
    beats: 4,
    tonic: 57,
    scale: SCALES.minor,
    progressions: [
      [5, 6, 0, 0],
      [0, 5, 3, 4],
      [3, 0, 5, 6],
    ],
    bridge: [
      [5, 3, 0, 4],
      [3, 6, 2, 5],
    ],
    cadence: [6, 0],
    lh: 'block',
    lhBridge: 'flow',
    lhLow: 33,
    melody: [64, 81],
    rest: 0.35,
    motion: 0.2,
    vel: 0.42,
    color: 0.5,
    sparkle: 0.1,
    pedal: 'bar',
  },
};

// Cues for the string ensemble.
export const STRING_MOODS: Record<StringCue, StringMood> = {
  // Dialogue scenes: D phrygian (minor with the dark bII a semitone above the
  // tonic), a relentless low-string ostinato under long violin lines that
  // climb and swell, suspensions resolving down, marcato hits.
  tension: {
    bpm: 92,
    beats: 4,
    tonic: 62,
    scale: SCALES.phrygian,
    progressions: [
      [0, 1, 0, 5],
      [0, 6, 5, 1],
      [0, 5, 3, 1],
      [0, 3, 1, 6],
    ],
    // The bridge climbs and ends on v° (its tritone resolves into the tonic).
    bridge: [
      [3, 1, 5, 4],
      [5, 6, 3, 4],
      [2, 3, 1, 4],
    ],
    // bII → i: every voice falls a step into the tonic.
    cadence: [1, 0],
    vel: 0.8,
    low: [36, 62],
    high: [55, 91],
    suspend: 0.6,
    motion: 0.35,
    texture: {
      A: { pulse: 'drive', line: 'single', lineRange: [62, 81], pad: 1, padArt: 'legato', padRange: [57, 74], dyn: [0.64, 0.86], hits: 0.3 },
      A2: { pulse: 'tresillo', line: 'single', lineRange: [65, 86], pad: 2, padArt: 'tremolo', padRange: [57, 76], dyn: [0.68, 0.92], hits: 0.5 },
      B: { pulse: 'surge', line: 'octaves', lineRange: [69, 89], pad: 2, padArt: 'tremolo', padRange: [57, 76], dyn: [0.76, 1], hits: 0.65 },
      A3: { pulse: 'tresillo', line: 'octaves', lineRange: [67, 86], pad: 2, padArt: 'tremolo', padRange: [57, 76], dyn: [0.84, 0.96], hits: 0.5 },
      interlude: { pulse: 'heartbeat', line: 'none', lineRange: [62, 81], pad: 1, padArt: 'tremolo', padRange: [74, 88], dyn: [0.56, 0.46], hits: 0 },
    },
  },
};
