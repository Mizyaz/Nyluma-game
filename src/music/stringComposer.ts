import { FORM } from './composer';
import { Rng } from './rng';
import { chordPcs, pc, stepPitch } from './theory';
import type { Bar, BarSource, NoteEvent, PulseName, SectionKind, StringMood, StringTexture } from './types';

// Generative composer for the string ensemble. It writes an endless piece in
// the same song form as the piano (A A′ B A″ + interlude, then again with new
// chords and a new theme), for two sections:
//  - low strings (cellos and basses): a relentless ostinato on the chord's
//    root in octaves, its figure set per section (straight eighths, 3+3+2,
//    driving sixteenths, a heartbeat);
//  - high strings (violins and violas): long lines that climb through each
//    four-bar phrase to a peak and fall back, sometimes doubled in octaves,
//    over held or tremolo inner voices. A line note held over the barline
//    into a chord it does not belong to is a suspension: it resolves a step
//    down on a weak beat. Strong beats land on chord tones.
//  - the whole ensemble: marcato hits as the piece (re)starts, where a phrase
//    ends, when the bridge arrives and on the final cadence;
//  - dynamics: each section swells from its first bar to its last.
// It is pure (no audio): the same mood and seed always give the same notes.

/** Low-string figures, one entry per sixteenth: 0 rest, 1 stroke, 2 accent. */
const PULSES: Record<PulseName, { 3: number[]; 4: number[] }> = {
  // Straight eighths, leaning on the strong beats.
  drive: {
    4: [2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0],
    3: [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  },
  // Eighths grouped 3 + 3 + 2.
  tresillo: {
    4: [2, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 2, 0, 1, 0],
    3: [2, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0],
  },
  // Sixteenths, accents grouped 3 + 3 + 3 + 3 + 2 + 2.
  surge: {
    4: [2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1],
    3: [2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1],
  },
  // Two strokes and a silence, like a heartbeat.
  heartbeat: {
    4: [2, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0],
    3: [2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  },
};

/** Line rhythms per bar, in beats; a negative length is a rest. */
const RHYTHMS: { 3: number[][]; 4: number[][] } = {
  4: [[4], [2, 2], [3, 1], [1, 3], [2, 1, 1], [1.5, 0.5, 2], [1, 1, 2], [2.5, 0.5, 1]],
  3: [[3], [2, 1], [1, 2], [1.5, 0.5, 1], [1, 1, 1]],
};

/** The violins' first entry of a cycle: after the pulse has begun. */
const ENTRIES: { 3: number[][]; 4: number[][] } = {
  4: [
    [-2, 2],
    [-2, 1.5, 0.5],
    [-3, 1],
  ],
  3: [
    [-1, 2],
    [-2, 1],
  ],
};

/** A phrase's last bar: a long note, sometimes a breath after it. */
const CLOSES: { 3: number[][]; 4: number[][] } = {
  4: [[4], [4], [3, -1], [2, 2]],
  3: [[3], [3], [2, -1]],
};

/** What follows a suspension resolving on beat 1 or 2 (0-based): the rest of the bar. */
const RESOLUTIONS: { 3: Record<number, number[][]>; 4: Record<number, number[][]> } = {
  4: {
    1: [[3], [1, 2], [2, 1]],
    2: [[2], [1, 1]],
  },
  3: {
    1: [[2], [1, 1]],
    2: [[1]],
  },
};

/** Slowing at a section's last bar (a breath before the next). */
const RITARDANDO = 1.04;

interface Phrase {
  rhythms: number[][];
  /** Contour in scale steps: from `start` up to `peak`, back toward `end`. */
  start: number;
  peak: number;
  end: number;
}

interface Slot {
  beat: number;
  len: number;
  rest: boolean;
}

const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));

export class StringComposer implements BarSource {
  private readonly rng: Rng;
  private formIndex = 0;
  private barInSection = 0;
  private progA: readonly number[];
  private progB: readonly number[];
  /** The line's position as a scale step from `lineTonic`. */
  private step: number;
  private readonly lineTonic: number;
  private phrase: Phrase | null = null;
  private motifA: number[][] | null = null;
  private motifB: number[][] | null = null;
  /** A suspension held over the barline: where and when it resolves. */
  private pending: { step: number; beat: number } | null = null;
  private inner: number[] = [];
  /** Bars written so far. */
  count = 0;

  constructor(
    readonly mood: StringMood,
    seed: number,
  ) {
    this.rng = new Rng(seed);
    this.progA = this.rng.pick(mood.progressions);
    this.progB = this.rng.pick(mood.bridge);
    // Line steps count from the tonic in the octave at or below the high register.
    const lo = mood.high[0];
    this.lineTonic = lo - pc(lo - mood.tonic);
    const [a, b] = this.range(mood.texture.A.lineRange);
    this.step = a + Math.round((b - a) * 0.3);
  }

  /** Writes the next bar. */
  next(): Bar {
    const m = this.mood;
    const sec = FORM[this.formIndex]!;
    const i = this.barInSection;
    const tex = m.texture[sec.kind];
    const beat = (60 / m.bpm) * this.stretch(this.formIndex, i);
    const len = m.beats * beat;
    const degree = this.degreeAt(this.formIndex, i);
    const chord = this.chord(degree);
    // The loudness of this bar: each section swells from its first bar to its last.
    const level = m.vel * (tex.dyn[0] + (tex.dyn[1] - tex.dyn[0]) * (i / Math.max(1, sec.bars - 1)));
    const notes: NoteEvent[] = [];
    const hits = this.hits(sec.kind, i, sec.bars, tex);
    this.pulse(tex, chord, beat, level, hits, notes);
    if (tex.pad > 0) this.inners(tex, chord, len, level, notes);
    if (tex.line !== 'none') this.line(sec.kind, i, tex, degree, chord, beat, len, level, notes);
    else this.pending = null;
    this.hitChords(hits, chord, beat, level, notes);
    notes.sort((x, y) => x.t - y.t);
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

  private degreeAt(f: number, i: number): number {
    const sec = FORM[f]!;
    if (sec.kind === 'interlude') return i % 2 === 0 ? this.progA[0]! : this.progA[3]!;
    if (sec.kind === 'A3' && i >= sec.bars - 2) return (this.mood.cadence ?? [4, 0])[i - (sec.bars - 2)]!;
    return (sec.kind === 'B' ? this.progB : this.progA)[i % 4]!;
  }

  private chord(degree: number): number[] {
    const m = this.mood;
    return chordPcs(m.tonic, m.scale, degree, m.raiseLeading);
  }

  private stretch(f: number, i: number): number {
    return i === FORM[f]!.bars - 1 ? RITARDANDO : 1;
  }

  /** The bar after this one within the cycle (a new cycle picks new chords). */
  private following(): { f: number; i: number } | null {
    if (this.barInSection + 1 < FORM[this.formIndex]!.bars) return { f: this.formIndex, i: this.barInSection + 1 };
    return this.formIndex + 1 < FORM.length ? { f: this.formIndex + 1, i: 0 } : null;
  }

  // ------------------------------------------------------------ low strings

  /** The ostinato: the chord's root, cellos on every stroke, basses an octave below on the eighths. */
  private pulse(tex: StringTexture, chord: number[], beat: number, level: number, hits: number[], out: NoteEvent[]): void {
    const m = this.mood;
    const fig = PULSES[tex.pulse][m.beats];
    const six = beat / 4;
    const root = this.bassRoot(chord[0]!);
    fig.forEach((a, k) => {
      const hit = hits.includes(k);
      if (!a && !hit) return;
      // Détaché: most of the way to the next stroke, never longer than an eighth.
      let gap = 1;
      while (k + gap < fig.length && !fig[k + gap] && gap < 2) gap++;
      const dur = gap * six * (tex.pulse === 'surge' ? 0.72 : 0.82);
      const t = k === 0 ? 0 : k * six + this.rng.range(-0.003, 0.004);
      const vel = Math.min(1, level * (hit ? 1.02 : a === 2 ? 0.95 : 0.74) * this.rng.range(0.95, 1.04));
      const art = hit ? 'marcato' : 'ostinato';
      out.push({ t, midi: root + 12, vel, off: t + (hit ? Math.max(dur, 0.3) : dur), hand: 'L', inst: 'low-strings', art });
      if (k % 2 === 0 || a === 2 || hit) out.push({ t, midi: root, vel: vel * 0.92, off: t + (hit ? Math.max(dur, 0.3) : dur), hand: 'L', inst: 'low-strings', art });
    });
  }

  /** The chord's root in the bass octave (the lowest octave of the low register). */
  private bassRoot(rootPc: number): number {
    const lo = this.mood.low[0];
    return lo + pc(rootPc - lo);
  }

  // ------------------------------------------------------------ high strings

  /** Inner voices: chord tones held through the bar, each moving to the nearest tone of the next chord. */
  private inners(tex: StringTexture, chord: number[], len: number, level: number, out: NoteEvent[]): void {
    const tones: number[] = [];
    for (let x = tex.padRange[0]; x <= tex.padRange[1]; x++) if (chord.includes(pc(x))) tones.push(x);
    if (!tones.length) return;
    let from = this.inner;
    if (from.length !== tex.pad) {
      // Start in the middle of the range, a third or more apart.
      const mid = Math.floor(tones.length / 2);
      from = tex.pad === 1 ? [tones[mid]!] : [tones[Math.min(tones.length - 1, mid + 1)]!, tones[Math.max(0, mid - 1)]!];
    }
    const next: number[] = [];
    for (const p of from) {
      let best: number | null = null;
      for (const x of tones) if (!next.includes(x) && (best === null || Math.abs(x - p) < Math.abs(best - p))) best = x;
      if (best !== null) next.push(best);
    }
    this.inner = next;
    const vel = Math.min(1, level * (tex.padArt === 'tremolo' ? 0.5 : 0.58));
    for (const midi of next) out.push({ t: this.rng.range(0, 0.006), midi, vel, off: len + 0.05, hand: 'R', inst: 'high-strings', art: tex.padArt });
  }

  private line(kind: SectionKind, i: number, tex: StringTexture, degree: number, chord: number[], beat: number, len: number, level: number, out: NoteEvent[]): void {
    const m = this.mood;
    const [lo, hi] = this.range(tex.lineRange);
    const pend = this.pending;
    this.pending = null;
    const inPhrase = i % 4;
    if (inPhrase === 0 || !this.phrase) this.phrase = this.newPhrase(kind, i, lo, hi);
    const ph = this.phrase;
    // After a suspension the bar continues from its resolution.
    const slots = pend ? slotsOf([-pend.beat, ...this.rng.pick(RESOLUTIONS[m.beats][pend.beat]!)]) : slotsOf(ph.rhythms[inPhrase]!);
    // Where the next bar's line may go, for a suspension into it.
    const after = this.following();
    const nextTex = after ? m.texture[FORM[after.f]!.kind] : null;
    const nextDegree = after ? this.degreeAt(after.f, after.i) : 0;
    const nextChord = after && nextTex && nextTex.line !== 'none' ? this.chord(nextDegree) : null;
    const nextRange = nextTex ? this.range(nextTex.lineRange) : null;
    const nextBeat = after ? (60 / m.bpm) * this.stretch(after.f, after.i) : 0;
    let first = true;
    slots.forEach((n, k) => {
      if (n.rest) return;
      const resolution = first && pend !== null;
      first = false;
      const strong = n.beat === 0 || (m.beats === 4 && n.beat === 2);
      const toEnd = n.beat + n.len >= m.beats - 1e-9;
      const p = (inPhrase + n.beat / m.beats) / 4;
      let s: number;
      if (resolution) s = pend.step;
      else {
        // Rising through the first 70 % of the phrase, falling after.
        const slope = p < 0.7 ? 1 : -1;
        s = this.toward(contour(ph, p), lo, hi, slope);
        if (strong || n.len >= 1.5 || toEnd) {
          // A chord tone, but not the note just played nor an inner voice's.
          const avoid = new Set([...this.inner, this.pitch(this.step, degree)]);
          s = this.snap(s, chord, degree, lo, hi, avoid, Math.sign(s - this.step) || slope);
        }
      }
      // A long last note may be held into the next chord as a suspension.
      let tie = 0;
      if (toEnd && !resolution && n.len >= 1 && nextChord && nextRange && this.rng.chance(m.suspend)) {
        const sus = this.suspension(s, degree, chord, nextDegree, nextChord, [Math.max(lo, nextRange[0] + 1), Math.min(hi, nextRange[1])]);
        if (sus !== null) {
          s = sus;
          const at = this.rng.pick([1, 1, 2]);
          this.pending = { step: sus - 1, beat: at };
          tie = at * nextBeat + 0.03;
        }
      }
      this.step = s;
      const midi = this.pitch(s, degree);
      const t = n.beat * beat + (resolution ? 0 : this.rng.range(0, 0.01));
      const restAfter = slots[k + 1]?.rest ?? false;
      const off = tie ? len + tie : toEnd ? len + 0.04 : (n.beat + n.len) * beat + (restAfter ? -0.03 : 0.04);
      // The line leans into its peak.
      const vel = Math.min(1, level * (0.86 + 0.16 * Math.min(1, p / 0.7)) * this.rng.range(0.96, 1.03));
      out.push({ t, midi, vel, off, hand: 'R', inst: 'high-strings', art: 'legato' });
      if (tex.line === 'octaves' && midi - 12 >= m.high[0]) out.push({ t, midi: midi - 12, vel: vel * 0.8, off, hand: 'R', inst: 'high-strings', art: 'legato' });
    });
  }

  private newPhrase(kind: SectionKind, i: number, lo: number, hi: number): Phrase {
    const m = this.mood;
    let rhythms: number[][];
    if (kind === 'B') {
      // The bridge has its own rhythm, restated in its second phrase.
      if (i === 0 || !this.motifB) this.motifB = this.freshRhythms(false);
      rhythms = this.motifB;
    } else {
      // The A sections share one theme rhythm; later phrases vary a bar of it.
      if (!this.motifA) this.motifA = this.freshRhythms(kind === 'A' && i === 0);
      rhythms = this.motifA.map((r) => [...r]);
      if (!(kind === 'A' && i === 0) && this.rng.chance(0.4)) {
        const b = this.rng.pick([1, 2]);
        rhythms[b] = this.rng.weighted(RHYTHMS[m.beats], (r) => (r.length <= 2 ? 1.5 - m.motion : 0.4 + m.motion));
      }
    }
    // Contour: start low in the register, climb to a peak near the top, then
    // fall part of the way back.
    const span = hi - lo;
    const start = lo + Math.floor(this.rng.next() * Math.max(1, Math.round(span * 0.3)));
    const peak = Math.max(Math.min(hi, start + 3), hi - Math.floor(this.rng.next() * Math.max(1, Math.round(span * 0.25))));
    const end = start + Math.round((peak - start) * this.rng.range(0.3, 0.6));
    return { rhythms, start, peak, end };
  }

  /** Four bars of rhythm: long notes, an entry after the pulse, a closing note. */
  private freshRhythms(entry: boolean): number[][] {
    const m = this.mood;
    const r = [0, 1, 2, 3].map(() => this.rng.weighted(RHYTHMS[m.beats], (x) => (x.length <= 2 ? 1.5 - m.motion : 0.4 + m.motion)));
    if (entry) r[0] = this.rng.pick(ENTRIES[m.beats]);
    r[3] = this.rng.pick(CLOSES[m.beats]);
    return r;
  }

  /** One move toward the contour: mostly steps, sometimes a leap; on the contour, a step along its slope or a held pitch. */
  private toward(target: number, lo: number, hi: number, slope: number): number {
    const d = Math.round(target) - this.step;
    let s: number;
    if (d === 0) s = this.step + (this.rng.chance(0.55) ? slope : 0);
    else if (Math.abs(d) >= 3 && this.rng.chance(0.4)) s = this.step + Math.sign(d) * Math.min(Math.abs(d), 4);
    else s = this.step + Math.sign(d) * (Math.abs(d) >= 2 && this.rng.chance(0.35) ? 2 : 1);
    return clamp(s, lo, hi);
  }

  /** The chord tone nearest to `s`, looking first in direction `way`, avoiding `avoid` (MIDI) when it can. */
  private snap(s: number, chord: number[], degree: number, lo: number, hi: number, avoid: ReadonlySet<number>, way: number): number {
    let fallback: number | null = null;
    for (let d = 0; d <= 4; d++) {
      for (const x of way >= 0 ? [s + d, s - d] : [s - d, s + d]) {
        if (x < lo || x > hi) continue;
        const midi = this.pitch(x, degree);
        if (!chord.includes(pc(midi))) continue;
        if (!avoid.has(midi)) return x;
        fallback ??= x;
      }
    }
    return fallback ?? clamp(s, lo, hi);
  }

  /**
   * A chord tone near `s` that the next chord turns into a dissonance
   * resolving one scale step down onto one of its own tones; null if none.
   */
  private suspension(s: number, degree: number, chord: number[], nextDegree: number, next: number[], [lo, hi]: readonly [number, number]): number | null {
    for (const d of [0, 1, -1, 2, -2]) {
      const x = s + d;
      if (x < lo || x > hi) continue;
      const held = this.pitch(x, degree);
      const below = this.pitch(x - 1, nextDegree);
      if (chord.includes(pc(held)) && !next.includes(pc(held)) && next.includes(pc(below)) && held - below <= 2) return x;
    }
    return null;
  }

  // ------------------------------------------------------------ the ensemble

  /** Sixteenths of the bar where the whole ensemble strikes. */
  private hits(kind: SectionKind, i: number, bars: number, tex: StringTexture): number[] {
    if (tex.hits <= 0) return [];
    const grid = this.mood.beats * 4;
    // The piece opens with a blow (a scene starts), the bridge arrives with
    // one, and the cadence lands with one.
    if (i === 0 ? kind === 'A' || kind === 'B' : kind === 'A3' && i === bars - 1) return [0];
    // Otherwise now and then at a phrase's end: on the last beat or just after it.
    if (i % 4 === 3 && this.rng.chance(tex.hits)) return [this.rng.pick([grid - 4, grid - 2])];
    return [];
  }

  /** The high strings' part of a hit: a close triad from a fifth above the bottom of their register. */
  private hitChords(hits: number[], chord: number[], beat: number, level: number, out: NoteEvent[]): void {
    if (!hits.length) return;
    const tones: number[] = [];
    for (let x = this.mood.high[0] + 7; x <= this.mood.high[1] && tones.length < 3; x++) if (chord.includes(pc(x))) tones.push(x);
    const vel = Math.min(1, level * 0.96);
    for (const k of hits) {
      for (const midi of tones) {
        // Players never strike exactly together.
        const t = (k * beat) / 4 + this.rng.range(0, 0.008);
        out.push({ t, midi, vel, off: t + Math.min(0.32, beat * 0.75), hand: 'R', inst: 'high-strings', art: 'marcato' });
      }
    }
  }

  // ------------------------------------------------------------ helpers

  /** A MIDI register as line steps [first step at or above low, last at or below high]. */
  private range([lo, hi]: readonly [number, number]): [number, number] {
    let a = -14;
    while (stepPitch(this.lineTonic, this.mood.scale, a) < lo) a++;
    let b = 40;
    while (stepPitch(this.lineTonic, this.mood.scale, b) > hi) b--;
    return [a, b];
  }

  private pitch(step: number, degree: number): number {
    const m = this.mood;
    const midi = stepPitch(this.lineTonic, m.scale, step);
    // Harmonic minor's raised leading tone over V.
    return m.raiseLeading && degree === 4 && pc(midi - m.tonic) === 10 ? midi + 1 : midi;
  }

  private newCycle(): void {
    this.progA = this.rng.pick(this.mood.progressions);
    this.progB = this.rng.pick(this.mood.bridge);
    this.motifA = null;
    this.motifB = null;
    this.phrase = null;
    this.pending = null;
  }
}

/** Rhythm (beats, negative = rest) as positioned slots. */
function slotsOf(rhythm: readonly number[]): Slot[] {
  let beat = 0;
  return rhythm.map((x) => {
    const slot = { beat, len: Math.abs(x), rest: x < 0 };
    beat += Math.abs(x);
    return slot;
  });
}

/** The phrase's shape at progress p (0..1): an eased climb to the peak, then a fall. */
function contour(ph: Phrase, p: number): number {
  const top = 0.7;
  if (p <= top) {
    const x = p / top;
    return ph.start + (ph.peak - ph.start) * x * x * (3 - 2 * x);
  }
  return ph.peak - (ph.peak - ph.end) * ((p - top) / (1 - top));
}
