// Just enough music theory for the composer: scales, diatonic chords and
// pitch helpers. Pitches are MIDI note numbers (60 = middle C).

export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  /** Minor with a lowered second: the dark bII chord a semitone above the tonic. */
  phrygian: [0, 1, 3, 5, 7, 8, 10],
} as const;

export const midiToHz = (m: number): number => 440 * Math.pow(2, (m - 69) / 12);

/** Pitch class 0..11 (C = 0). */
export const pc = (m: number): number => ((m % 12) + 12) % 12;

/** MIDI pitch of scale step `s` counted from `tonic` (negative steps go down). */
export function stepPitch(tonic: number, scale: readonly number[], s: number): number {
  const n = scale.length;
  const oct = Math.floor(s / n);
  const i = s - oct * n;
  return tonic + oct * 12 + scale[i]!;
}

/**
 * Pitch classes of the diatonic triad (or seventh chord) on `degree`
 * (0 = tonic). With `raiseLeading`, the seventh scale step is raised a
 * semitone wherever it occurs (harmonic minor's major V).
 */
export function chordPcs(tonic: number, scale: readonly number[], degree: number, raiseLeading = false, seventh = false): number[] {
  const n = scale.length;
  const steps = seventh ? [0, 2, 4, 6] : [0, 2, 4];
  return steps.map((s) => {
    const i = (((degree + s) % n) + n) % n;
    let iv = scale[i]!;
    if (raiseLeading && degree === 4 && i === 6 && iv === 10) iv = 11;
    return pc(tonic + iv);
  });
}

/** True when `m` belongs to the scale (or is the raised leading tone over V). */
export function inScale(m: number, tonic: number, scale: readonly number[]): boolean {
  const rel = pc(m - tonic);
  return scale.includes(rel);
}
