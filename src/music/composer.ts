import { Rng } from './rng';
import { chordPcs, pc, stepPitch } from './theory';
import type { Bar, BarSource, LeftHand, Mood, NoteEvent, SectionKind } from './types';

// Generative piano composer. It writes an endless piece bar by bar in a
// simple song form, A A' B A'' plus a short interlude, then starts over with
// new motifs:
//  - harmony: a four-chord progression per section, one chord per bar, and a
//    cadence at the end of the form;
//  - left hand: an accompaniment figure on the chord (arpeggio, broken
//    chord, block chord, pulse or ostinato), voice-led from bar to bar;
//  - right hand: a melody built from a two-bar motif that is stated, moved to
//    the next chords, varied and closed, with chord tones on strong beats and
//    steps between them;
//  - expression: phrase-shaped dynamics, a little timing rubato and a short
//    ritardando at section ends.
// It is pure (no audio): the same mood and seed always give the same notes.

/** Marks a rest inside a motif. */
const REST = 1000;

/** One melody note of a motif: rhythm plus the scale-step move from the previous note. */
interface MotifNote {
  beat: number;
  len: number;
  move: number;
}

/** Eighth-note figures; each entry is a left-hand tone index, a chord, or a rest. */
type Figure = (number | number[] | null)[];

const FIGURES: Record<LeftHand, { 3: Figure; 4: Figure }> = {
  flow: { 4: [0, 1, 2, 3, 4, 3, 2, 1], 3: [0, 1, 2, 3, 2, 1] },
  broken: { 4: [0, null, [1, 2], null, 2, null, [1, 3], null], 3: [0, null, [1, 2], null, [1, 3], null] },
  block: { 4: [[0, 1, 2], null, null, null, 3, null, null, null], 3: [[0, 1, 2], null, null, null, 3, null] },
  pulse: { 4: [0, 2, 1, 2, 0, 2, 1, 2], 3: [0, 2, 1, 2, 1, 2] },
  ostinato: { 4: [0, 0, 2, 0, 0, 2, 0, 2], 3: [0, 0, 2, 0, 2, 0] },
};

/** Melody rhythms in beats, with a flag for how "busy" each one is. */
const RHYTHMS: { 3: number[][]; 4: number[][] } = {
  4: [[4], [2, 2], [3, 1], [1, 1, 2], [2, 1, 1], [1.5, 0.5, 2], [1, 1, 1, 1], [0.5, 0.5, 1, 2], [1.5, 0.5, 1, 1]],
  3: [[3], [2, 1], [1, 1, 1], [1, 2], [1.5, 0.5, 1], [0.5, 0.5, 2]],
};

/** The song form: A A′ B A″ and a short interlude, then again with new material. */
export const FORM: readonly { kind: SectionKind; bars: number }[] = [
  { kind: 'A', bars: 8 },
  { kind: 'A2', bars: 8 },
  { kind: 'B', bars: 8 },
  { kind: 'A3', bars: 8 },
  { kind: 'interlude', bars: 2 },
];

export class Composer implements BarSource {
  private readonly rng: Rng;
  private formIndex = 0;
  private barInSection = 0;
  private progA: readonly number[];
  private progB: readonly number[];
  /** Melody position as a scale step from the melody tonic. */
  private step: number;
  private readonly melTonic: number;
  private readonly stepLo: number;
  private readonly stepHi: number;
  private motifA: MotifNote[][] = [];
  private motifB: MotifNote[][] = [];
  private lhRoot: number | null = null;
  private dir = 1;
  /** Bars written so far. */
  count = 0;

  constructor(
    readonly mood: Mood,
    seed: number,
  ) {
    this.rng = new Rng(seed);
    this.progA = this.rng.pick(mood.progressions);
    this.progB = this.rng.pick(mood.bridge);
    // Melody steps are counted from the tonic in the octave below the register.
    const lo = mood.melody[0];
    this.melTonic = lo - pc(lo - mood.tonic);
    this.stepLo = this.stepAtOrAbove(lo);
    this.stepHi = this.stepAtOrBelow(mood.melody[1]);
    this.step = this.stepLo + Math.round((this.stepHi - this.stepLo) * 0.35);
  }

  /** Writes the next bar. */
  next(): Bar {
    const m = this.mood;
    const sec = FORM[this.formIndex]!;
    const i = this.barInSection;
    const beat = 60 / m.bpm;
    const lastOfSection = i === sec.bars - 1;
    const lastOfForm = sec.kind === 'A3' && i >= sec.bars - 2;
    // Harmony
    let degree: number;
    if (sec.kind === 'interlude') degree = i % 2 === 0 ? this.progA[0]! : this.progA[3]!;
    else if (lastOfForm) degree = (m.cadence ?? [4, 0])[i - (sec.bars - 2)]!;
    else degree = (sec.kind === 'B' ? this.progB : this.progA)[i % 4]!;
    const chord = chordPcs(m.tonic, m.scale, degree, m.raiseLeading);
    // A short ritardando closes each section.
    const len = m.beats * beat * (lastOfSection ? 1.08 : 1);
    const stretch = len / (m.beats * beat);
    const notes: NoteEvent[] = [];
    const pedalOff = (t: number): number => {
      if (m.pedal === 'bar') return len + 0.03;
      const half = (m.beats * beat * stretch) / 2;
      return Math.min(len + 0.03, (Math.floor(t / half + 1e-6) + 1) * half + 0.03);
    };
    // Phrase dynamics: swell to the middle of the section, ease at its end.
    const arc = 0.84 + 0.26 * Math.sin(Math.PI * ((i + 0.5) / sec.bars));
    // Left hand
    const fig = FIGURES[sec.kind === 'B' ? m.lhBridge : m.lh][m.beats];
    const tones = this.leftHandTones(chord, degree);
    const eighth = (beat / 2) * stretch;
    fig.forEach((slot, k) => {
      if (slot === null) return;
      const idx = Array.isArray(slot) ? slot : [slot];
      const t = k * eighth + (k === 0 ? 0 : this.rng.range(-0.004, 0.006));
      for (const j of idx) {
        const midi = tones[Math.min(j, tones.length - 1)]!;
        const accent = k === 0 ? 1 : k % 2 === 0 ? 0.86 : 0.74;
        const vel = m.vel * 0.58 * accent * arc * this.rng.range(0.94, 1.04);
        notes.push({ t: Math.max(0, t), midi, vel, off: pedalOff(t), hand: 'L' });
      }
    });
    // Right hand
    if (sec.kind !== 'interlude') this.melody(sec.kind, i, sec.bars, chord, degree, beat * stretch, arc, notes, pedalOff);
    // Sparkle: a soft high chord tone, like a music box.
    if (this.rng.chance(sec.kind === 'interlude' ? Math.max(0.5, m.sparkle) : m.sparkle)) {
      const high = this.chordNotesIn(chord, 84, 96);
      if (high.length) {
        const t = this.rng.pick([1, 2, 3, 5]) * eighth;
        if (t < len - eighth) notes.push({ t, midi: this.rng.pick(high), vel: m.vel * 0.3 * this.rng.range(0.8, 1.1), off: pedalOff(t), hand: 'R' });
      }
    }
    notes.sort((a, b) => a.t - b.t);
    // Advance the form.
    this.count++;
    this.barInSection++;
    if (this.barInSection >= sec.bars) {
      this.barInSection = 0;
      this.formIndex = (this.formIndex + 1) % FORM.length;
      if (this.formIndex === 0) this.newCycle();
    }
    return { len, notes, section: sec.kind, degree };
  }

  // ------------------------------------------------------------ harmony

  /** Left-hand tones: root, fifth, octave, tenth (or ninth), twelfth. */
  private leftHandTones(chord: number[], degree: number): number[] {
    const m = this.mood;
    const rootPc = chord[0]!;
    let root = m.lhLow + pc(rootPc - m.lhLow);
    // Voice leading: stay near the previous root (within the register).
    if (this.lhRoot !== null) {
      const alt = root + 12 <= m.lhLow + 14 ? root + 12 : root - 12;
      if (alt >= m.lhLow - 3 && Math.abs(alt - this.lhRoot) < Math.abs(root - this.lhRoot)) root = alt;
    }
    this.lhRoot = root;
    const third = pc(chord[1]! - rootPc);
    const fifth = pc(chord[2]! - rootPc);
    let upper = root + 12 + third;
    if (this.rng.chance(m.color)) {
      // Added ninth, when the key gives a major ninth (a minor ninth clashes).
      const ninth = pc(this.adjust(stepPitch(m.tonic, m.scale, degree + 1), degree) - rootPc);
      if (ninth === 2) upper = root + 12 + ninth;
    }
    return [root, root + fifth, root + 12, upper, root + 12 + fifth];
  }

  private chordNotesIn(chord: number[], lo: number, hi: number): number[] {
    const out: number[] = [];
    for (let n = lo; n <= hi; n++) if (chord.includes(pc(n))) out.push(n);
    return out;
  }

  /** Raised leading tone over V in harmonic minor. */
  private adjust(midi: number, degree: number): number {
    const m = this.mood;
    if (m.raiseLeading && degree === 4 && pc(midi - m.tonic) === 10) return midi + 1;
    return midi;
  }

  // ------------------------------------------------------------ melody

  private pitch(step: number, degree: number): number {
    return this.adjust(stepPitch(this.melTonic, this.mood.scale, step), degree);
  }

  private isChordTone(step: number, chord: number[], degree: number): boolean {
    return chord.includes(pc(this.pitch(step, degree)));
  }

  /** The chord tone nearest to `from`, leaning in direction `dir`. */
  private nearestChordStep(from: number, chord: number[], degree: number, dir: number): number {
    for (let d = 0; d <= 4; d++) {
      for (const s of dir >= 0 ? [from + d, from - d] : [from - d, from + d]) {
        if (s >= this.stepLo && s <= this.stepHi && this.isChordTone(s, chord, degree)) return s;
      }
    }
    return Math.max(this.stepLo, Math.min(this.stepHi, from));
  }

  /** Keeps the melody in its register, turning back at the edges. */
  private clampStep(s: number): number {
    if (s > this.stepHi) {
      this.dir = -1;
      s = this.stepHi - (s - this.stepHi);
    } else if (s < this.stepLo) {
      this.dir = 1;
      s = this.stepLo + (this.stepLo - s);
    }
    return Math.max(this.stepLo, Math.min(this.stepHi, s));
  }

  private melody(kind: SectionKind, i: number, bars: number, chord: number[], degree: number, beat: number, arc: number, out: NoteEvent[], pedalOff: (t: number) => number): void {
    const m = this.mood;
    const motif = kind === 'B' ? this.motifB : this.motifA;
    let notes: MotifNote[];
    if (i === bars - 1) {
      notes = this.cadenceBar(kind);
    } else if (i < 2 && (kind === 'A' || kind === 'B' || motif.length < 2)) {
      // State a new motif (two bars).
      if (i === 0) this.dir = this.rng.chance(0.65) ? 1 : -1;
      notes = this.freeBar(i === 0);
      motif[i] = notes;
    } else if (i < 4 || (i < 6 && kind !== 'B' && this.rng.chance(0.6))) {
      // Restate the motif on the new chords; the second time with a twist.
      notes = (motif[i % 2] ?? this.freeBar(false)).map((n) => ({ ...n }));
      const last = [...notes].reverse().find((n) => n.move !== REST);
      if (i >= 4 && last && notes.length > 1) last.move += this.rng.pick([-1, 1, 2]);
    } else {
      if (i >= bars - 3) this.dir = -1;
      notes = this.freeBar(false);
    }
    // Realize: moves become pitches, strong beats land on chord tones.
    for (const n of notes) {
      if (n.move === REST) continue;
      const strong = n.beat === 0 || (m.beats === 4 && n.beat === 2);
      let s = this.clampStep(this.step + n.move);
      if (strong || n.len >= 1.5 || i === bars - 1) {
        // Settle on a chord tone in the direction of the move, not back
        // onto the note just played.
        const way = Math.sign(n.move) || this.dir;
        const snapped = this.nearestChordStep(s, chord, degree, way);
        s = snapped === this.step && n.move !== 0 ? this.nearestChordStep(s + way, chord, degree, way) : snapped;
      }
      this.step = s;
      const t = n.beat * beat + (n.beat === 0 ? this.rng.range(0, 0.012) : this.rng.range(-0.01, 0.012));
      const vel = m.vel * 0.8 * arc * (strong ? 1 : 0.9) * (n.len >= 2 ? 1.05 : 1) * this.rng.range(0.93, 1.05);
      out.push({ t: Math.max(0, t), midi: this.pitch(s, degree), vel: Math.min(1, vel), off: Math.max(pedalOff(t), t + n.len * beat), hand: 'R' });
    }
  }

  /** A bar of melody: rhythm from the mood's motion, stepwise moves, an occasional leap. */
  private freeBar(opening: boolean): MotifNote[] {
    const m = this.mood;
    const rhythm = this.rng.weighted(RHYTHMS[m.beats], (r) => (r.length <= 2 ? 1.6 - m.motion : 0.4 + m.motion * 1.2));
    const out: MotifNote[] = [];
    let beat = 0;
    rhythm.forEach((len, k) => {
      const restable = !(opening && k === 0) && len < m.beats;
      if (restable && this.rng.chance(m.rest * (beat === 0 ? 0.4 : 1))) {
        out.push({ beat, len, move: REST });
      } else {
        let move: number;
        if (k === 0 && opening) move = 0;
        else if (this.rng.chance(0.14)) {
          move = this.dir * this.rng.pick([2, 3, 4]);
          this.dir = -this.dir; // a leap turns back by step
        } else move = this.dir * (this.rng.chance(0.78) ? 1 : 2);
        if (this.rng.chance(0.22)) this.dir = -this.dir;
        out.push({ beat, len, move });
      }
      beat += len;
    });
    return out;
  }

  /** Closing bar: settle on a long chord tone (sometimes after a pickup). */
  private cadenceBar(kind: SectionKind): MotifNote[] {
    const b = this.mood.beats;
    this.dir = kind === 'B' ? 1 : -1;
    if (this.rng.chance(0.5)) return [{ beat: 0, len: b, move: -1 }];
    return [
      { beat: 0, len: b - 1, move: -1 },
      { beat: b - 1, len: 1, move: REST },
    ];
  }

  private newCycle(): void {
    this.progA = this.rng.pick(this.mood.progressions);
    this.progB = this.rng.pick(this.mood.bridge);
    this.motifA = [];
    this.motifB = [];
  }

  private stepAtOrAbove(midi: number): number {
    let s = -14;
    while (stepPitch(this.melTonic, this.mood.scale, s) < midi) s++;
    return s;
  }

  private stepAtOrBelow(midi: number): number {
    let s = 30;
    while (stepPitch(this.melTonic, this.mood.scale, s) > midi) s--;
    return s;
  }
}
