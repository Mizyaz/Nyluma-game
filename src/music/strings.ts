import type { Instrument } from './instrument';
import { Rng } from './rng';
import { Room } from './room';
import { midiToHz } from './theory';
import type { Articulation } from './types';

// A synthesized bowed-string section (Web Audio), no samples:
//  - each note is played by a few "players": oscillators with a bowed
//    string's spectrum (sawtooth-like, with the harmonics at the bow's nodes
//    weakened) plus a hollower pulse-like one, slightly out of tune with each
//    other, the way a live section never quite agrees;
//  - the bow: a scratchy, bright onset that settles; accents bite, long notes
//    swell and brighten, tremolo shakes the level with fast strokes, some
//    notes scoop up into pitch;
//  - vibrato starts only after a note has settled;
//  - the body: fixed resonances (air, wood, the bridge's brilliance) per
//    section, then an ensemble chorus and orchestral seating across the
//    stereo field;
//  - a room reverb (roomImpulse), shared by the sections of an ensemble.

const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));

/** Tone, register and placement of one string section. */
export interface StringSection {
  /** Players (oscillators) per sustained note, up to 3, and how far apart they are tuned (cents). */
  players: number;
  spread: number;
  /** Bow position as a fraction of the string (sets the spectrum's notches). */
  bow: number;
  /** Note brightness: low-pass at f0 × (tone[0] + tone[1] × velocity), within [toneMin, toneMax] Hz. */
  tone: readonly [number, number];
  toneMin: number;
  toneMax: number;
  /** Body resonances: [Hz, Q, dB]. */
  body: readonly (readonly [number, number, number])[];
  /** High-pass under the section's range and low-pass over its brightest tone (Hz). */
  floor: number;
  ceiling: number;
  /** Vibrato rate (Hz), depth (cents) and how long a note waits for it (s). */
  vibrato: { readonly rate: number; readonly depth: number; readonly delay: number };
  /** Seating: pan = centre + tilt × octaves above E4, within ±width. */
  pan: { readonly centre: number; readonly tilt: number; readonly width: number };
  /** Centre of the bow noise band (Hz). */
  noise: number;
  /** Ensemble chorus level (0 = none) and reverb send. */
  chorus: number;
  reverb: number;
  /** Output level. */
  level: number;
}

/** Cellos and basses: dark and heavy, with a slow vibrato; seated right of centre. */
export const LOW_STRINGS: StringSection = {
  players: 3,
  spread: 7,
  bow: 1 / 7.3,
  tone: [3.2, 9],
  toneMin: 380,
  toneMax: 4200,
  body: [
    [105, 1.3, 3],
    [210, 1.4, 2.5],
    [640, 1.1, -2.5],
    [1500, 1, 2],
  ],
  floor: 34,
  ceiling: 5200,
  vibrato: { rate: 5.1, depth: 10, delay: 0.34 },
  pan: { centre: 0.16, tilt: -0.05, width: 0.35 },
  noise: 1300,
  chorus: 0.16,
  reverb: 0.22,
  level: 0.29,
};

/** Violins and violas: bright and singing, with a quicker vibrato; violins left, violas right. */
export const HIGH_STRINGS: StringSection = {
  players: 3,
  spread: 9,
  bow: 1 / 8.6,
  tone: [2.6, 6.5],
  toneMin: 900,
  toneMax: 9000,
  body: [
    [285, 1.4, 3],
    [520, 1.6, 2],
    [1200, 1.3, -3],
    [2900, 0.9, 4],
  ],
  floor: 120,
  ceiling: 8200,
  vibrato: { rate: 5.7, depth: 15, delay: 0.26 },
  pan: { centre: -0.1, tilt: -0.22, width: 0.5 },
  noise: 2800,
  chorus: 0.26,
  reverb: 0.42,
  level: 0.3,
};

/** How the bow draws each articulation. */
interface Stroke {
  /** Seconds to full level for a soft note (a hard one gets there faster). */
  attack: number;
  /** Onset level (× the note's level), settling to `hold` with time constant `settle`. */
  accent: number;
  settle: number;
  hold: number;
  /** Time constant of the fade once the bow leaves. */
  release: number;
  /** Onset brightness (× the note's cutoff), settling with the level. */
  bite: number;
  /** Bow noise: the onset burst, how fast it comes, and the hiss while bowing (× level; 0 = burst only). */
  scratch: number;
  scratchTime: number;
  hiss: number;
  /** Vibrato depth (× the section's). */
  vibrato: number;
  /** Players used: fewer for short strokes (lighter and cheaper). */
  players: number;
  /** Players start up to this many seconds apart (never in phase); 0 = together, for a firm stroke. */
  slop: number;
  /** How far apart the players are tuned (× the section's spread): tight for short strokes. */
  detune: number;
  /** Long notes grow louder and brighter toward their end. */
  swell: boolean;
  /** Bowed tremolo: strokes per second (0 = none). */
  tremolo: number;
  /** Level trim. */
  gain: number;
}

const STROKES: Record<Articulation, Stroke> = {
  legato: { attack: 0.22, accent: 1, settle: 0.1, hold: 1, release: 0.16, bite: 1.15, scratch: 0.12, scratchTime: 0.03, hiss: 0, vibrato: 1, players: 3, slop: 0.015, detune: 1, swell: true, tremolo: 0, gain: 1 },
  tremolo: { attack: 0.1, accent: 1, settle: 0.1, hold: 1, release: 0.12, bite: 1.3, scratch: 0.1, scratchTime: 0.02, hiss: 0.07, vibrato: 0.35, players: 3, slop: 0.012, detune: 1, swell: true, tremolo: 13.5, gain: 1.2 },
  marcato: { attack: 0.012, accent: 1.4, settle: 0.08, hold: 0.58, release: 0.09, bite: 1.9, scratch: 0.3, scratchTime: 0.006, hiss: 0, vibrato: 0.8, players: 3, slop: 0.003, detune: 0.4, swell: false, tremolo: 0, gain: 0.72 },
  ostinato: { attack: 0.008, accent: 1.3, settle: 0.05, hold: 0.62, release: 0.05, bite: 1.7, scratch: 0.3, scratchTime: 0.005, hiss: 0, vibrato: 0, players: 2, slop: 0, detune: 0.35, swell: false, tremolo: 0, gain: 1 },
};

/** How deep bowed tremolo cuts the level between strokes (0..1): a section, not a soloist. */
const TREMOLO_DEPTH = 0.5;

/** The players' loudness: a leader and softer desk partners (never equal, so their sum never cancels out). */
const WEIGHTS = [1, 0.8, 0.65];

/** Where each player's pitch sits within the section's spread: the leader in tune, the others either side. */
const TUNING = [0, -1, 1];

/** A long note swells when it lasts at least this long (s). */
const SWELL_MIN = 1.2;

/** Notes start up to this late (s): a section never strikes exactly together, and notes struck at once never add up in phase. */
const JITTER = 0.005;

export class Strings implements Instrument {
  /** Everything the section plays passes through here (its own reverb too, if it has one). */
  readonly output: GainNode;
  /** Notes enter here: the body, chorus and reverb send follow. */
  private readonly input: GainNode;
  private readonly waves: readonly PeriodicWave[];
  private readonly noise: AudioBuffer;
  private readonly nodes: AudioNode[] = [];
  private readonly lfos: OscillatorNode[] = [];
  private readonly ownRoom: Room | null;
  private readonly rng = new Rng(0x5712);
  /** Notes played so far (for tests and diagnostics). */
  struck = 0;

  /**
   * `room`: a reverb shared with other instruments; without one the section
   * makes its own.
   */
  constructor(
    private readonly ctx: BaseAudioContext,
    private readonly section: StringSection,
    room?: Room,
  ) {
    const c = ctx;
    const s = section;
    this.output = c.createGain();
    this.input = c.createGain();
    // The body: a high-pass under the range, the resonances, a soft top.
    const chain: BiquadFilterNode[] = [filter(c, 'highpass', s.floor, 0.7)];
    for (const [f, q, db] of s.body) {
      const p = filter(c, 'peaking', f, q);
      p.gain.value = db;
      chain.push(p);
    }
    chain.push(filter(c, 'lowpass', s.ceiling, 0.5));
    this.input.connect(chain[0]!);
    for (let i = 1; i < chain.length; i++) chain[i - 1]!.connect(chain[i]!);
    const body = chain[chain.length - 1]!;
    body.connect(this.output);
    this.nodes.push(this.input, ...chain);
    // Ensemble chorus: two slowly wandering delays, one each side.
    if (s.chorus > 0) {
      for (const [ms, rate, side] of [
        [11, 0.23, -0.75],
        [16, 0.31, 0.75],
      ] as const) {
        const d = c.createDelay(0.05);
        d.delayTime.value = ms / 1000;
        const lfo = c.createOscillator();
        lfo.frequency.value = rate;
        const amount = c.createGain();
        amount.gain.value = 0.0016;
        lfo.connect(amount);
        amount.connect(d.delayTime);
        const p = c.createStereoPanner();
        p.pan.value = side;
        const g = c.createGain();
        g.gain.value = s.chorus;
        body.connect(d);
        d.connect(p);
        p.connect(g);
        g.connect(this.output);
        lfo.start();
        this.lfos.push(lfo);
        this.nodes.push(d, amount, p, g);
      }
    }
    // The room.
    this.ownRoom = room ? null : new Room(c, 1);
    const send = c.createGain();
    send.gain.value = s.reverb;
    body.connect(send);
    send.connect((room ?? this.ownRoom!).input);
    this.ownRoom?.output.connect(this.output);
    this.nodes.push(send);
    this.waves = sectionWaves(c, s.bow);
    this.noise = noiseBuffer(c);
  }

  /** Bows `midi` from `at` until `off` (context seconds) at velocity 0..1. */
  note(at: number, midi: number, vel: number, off: number, art: Articulation = 'legato'): void {
    const c = this.ctx;
    const s = this.section;
    const k = STROKES[art];
    const f0 = midiToHz(midi);
    const v = clamp(vel, 0.05, 1);
    const t = at + this.rng.next() * JITTER;
    const end = Math.max(off, t + 0.04);
    const dur = end - t;
    const stop = end + k.release * 7;
    const n = Math.min(k.players, s.players, this.waves.length);
    // Bowed dynamics span a wide range; the very top of the violins is trimmed.
    const level = (s.level * k.gain * Math.pow(v, 1.5) * (midi > 86 ? 0.85 : 1)) / PLAYERS_RMS[n - 1]!;

    // Level: the bow's attack (slower when soft), an accent that settles or a
    // swell through a long note, then the fade when the bow leaves.
    const g = c.createGain();
    const attack = Math.min(k.attack * (1.15 - 0.75 * v), dur * 0.5);
    const swell = k.swell && dur >= SWELL_MIN;
    g.gain.setValueAtTime(0, t);
    if (k.accent > 1) {
      g.gain.linearRampToValueAtTime(level * k.accent, t + attack);
      g.gain.setTargetAtTime(level * k.hold, t + attack, k.settle);
    } else if (swell) {
      g.gain.linearRampToValueAtTime(level * 0.68, t + attack);
      g.gain.linearRampToValueAtTime(level, t + attack + (dur - attack) * 0.8);
    } else {
      g.gain.linearRampToValueAtTime(level, t + attack);
    }
    g.gain.setTargetAtTime(0, end, k.release);

    // Tone: bright at the bite, settling; brighter still as a swell grows,
    // darker as the string dies away.
    const lp = filter(c, 'lowpass', 1000, 0.7);
    const cut = clamp(f0 * (s.tone[0] + s.tone[1] * v), s.toneMin, s.toneMax);
    lp.frequency.setValueAtTime(Math.min(cut * k.bite, 16000), t);
    lp.frequency.setTargetAtTime(swell ? cut * 0.85 : cut, t + 0.005, Math.max(k.settle, 0.04) * 1.5);
    if (swell) lp.frequency.setTargetAtTime(cut * 1.25, t + dur * 0.35, dur * 0.3);
    lp.frequency.setTargetAtTime(cut * 0.6, end, k.release);

    const pan = c.createStereoPanner();
    pan.pan.value = clamp(s.pan.centre + (s.pan.tilt * (midi - 64)) / 12 + this.rng.range(-0.08, 0.08), -s.pan.width, s.pan.width);
    pan.connect(this.input);

    // Bowed tremolo: the level dips at every change of bow.
    let tail: AudioNode = pan;
    const extra: AudioNode[] = [];
    if (k.tremolo > 0) {
      const trem = c.createGain();
      trem.gain.value = 1 - TREMOLO_DEPTH / 2;
      const lfo = c.createOscillator();
      lfo.frequency.value = k.tremolo * this.rng.range(0.88, 1.12);
      const amount = c.createGain();
      amount.gain.value = TREMOLO_DEPTH / 2;
      lfo.connect(amount);
      amount.connect(trem.gain);
      trem.connect(pan);
      lfo.start(t);
      lfo.stop(stop);
      tail = trem;
      extra.push(trem, lfo, amount);
    }
    lp.connect(g);
    g.connect(tail);

    // The players: one intonation for the note, each player a little apart;
    // loud sustained notes sometimes scoop up into pitch, accents bite from below.
    const tune = this.rng.range(-4, 4);
    const scoop = art === 'marcato' ? -15 : art === 'legato' && v > 0.55 && this.rng.chance(0.35) ? -this.rng.range(20, 45) : 0;
    const players: OscillatorNode[] = [];
    for (let i = 0; i < n; i++) {
      const o = c.createOscillator();
      o.setPeriodicWave(this.waves[i % this.waves.length]!);
      o.frequency.value = f0;
      const cents = tune + (s.spread * TUNING[i]! * this.rng.range(0.7, 1.1) + this.rng.range(-1.5, 1.5)) * k.detune;
      if (scoop) {
        o.detune.setValueAtTime(cents + scoop, t);
        o.detune.linearRampToValueAtTime(cents, t + Math.min(dur * 0.5, art === 'marcato' ? 0.05 : 0.12 + 0.02 * i));
      } else o.detune.value = cents;
      o.connect(lp);
      // The level envelope starts at t, so a player joining late cannot click.
      o.start(t + this.rng.next() * k.slop);
      o.stop(stop);
      players.push(o);
    }

    // Vibrato once the note has settled, deeper when played harder: each
    // player their own rate, depth and moment, so the section shimmers
    // instead of beating in step.
    if (k.vibrato > 0 && dur > s.vibrato.delay + 0.15) {
      const cents = s.vibrato.depth * k.vibrato * (0.7 + 0.5 * v);
      for (const o of players) {
        const lfo = c.createOscillator();
        lfo.frequency.value = s.vibrato.rate * this.rng.range(0.86, 1.14);
        const depth = c.createGain();
        const wait = t + s.vibrato.delay * this.rng.range(0.8, 1.25);
        depth.gain.setValueAtTime(0, t);
        depth.gain.setValueAtTime(0, wait);
        depth.gain.linearRampToValueAtTime(cents * this.rng.range(0.75, 1.2), wait + 0.45);
        lfo.connect(depth);
        depth.connect(o.detune);
        // A random phase: the depth is still zero while it starts.
        lfo.start(t + this.rng.next() * 0.15);
        lfo.stop(stop);
        extra.push(lfo, depth);
      }
    }

    // Bow noise: a burst as the bow grips; tremolo's fast strokes also hiss
    // throughout. Without hiss the noise stops right after the burst (cheap).
    if (k.scratch > 0) {
      const src = c.createBufferSource();
      src.buffer = this.noise;
      src.loop = true;
      const bp = filter(c, 'bandpass', s.noise * this.rng.range(0.85, 1.15), 0.9);
      const ng = c.createGain();
      ng.gain.setValueAtTime(0, t);
      ng.gain.linearRampToValueAtTime(level * k.scratch * (0.4 + 0.6 * v), t + k.scratchTime);
      ng.gain.setTargetAtTime(level * k.hiss, t + k.scratchTime, 0.03);
      if (k.hiss > 0) ng.gain.setTargetAtTime(0, end, k.release * 0.5);
      src.connect(bp);
      bp.connect(ng);
      ng.connect(tail);
      src.start(t, this.rng.next() * 0.9);
      src.stop(k.hiss > 0 ? stop : Math.min(stop, t + k.scratchTime + 0.2));
      extra.push(src, bp, ng);
    }

    players[0]!.onended = () => {
      for (const x of [...players, lp, g, pan, ...extra]) x.disconnect();
    };
    this.struck++;
  }

  dispose(): void {
    for (const l of this.lfos) l.stop();
    this.output.disconnect();
    for (const x of [...this.nodes, ...this.lfos]) x.disconnect();
    this.ownRoom?.dispose();
  }
}

function filter(c: BaseAudioContext, type: BiquadFilterType, freq: number, q: number): BiquadFilterNode {
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}

/** RMS of the first n players' summed weights (uncorrelated), for an even level whatever the count. */
const PLAYERS_RMS = WEIGHTS.map((_, i) => Math.sqrt(WEIGHTS.slice(0, i + 1).reduce((a, w) => a + w * w, 0)));

const waveCache = new WeakMap<BaseAudioContext, Map<number, readonly PeriodicWave[]>>();

/**
 * The players' waves for a section's bow position, made once per context:
 * two bowed spectra and a hollower pulse-like one, at the players' weights.
 */
function sectionWaves(c: BaseAudioContext, bow: number): readonly PeriodicWave[] {
  let byBow = waveCache.get(c);
  if (!byBow) waveCache.set(c, (byBow = new Map()));
  let waves = byBow.get(bow);
  if (!waves) {
    waves = [bowedWave(c, bow, 0.3, 1, WEIGHTS[0]!), bowedWave(c, 0.3, 0, 1, WEIGHTS[1]!), bowedWave(c, bow * 1.35, 0.4, 1.08, WEIGHTS[2]!)];
    byBow.set(bow, waves);
  }
  return waves;
}

/**
 * A bowed string's spectrum: harmonics falling like a sawtooth's, those near
 * multiples of 1/`bow` weakened down to `floor` (a pulse-like wave when 0),
 * scaled so the wave peaks at `weight`.
 */
function bowedWave(c: BaseAudioContext, bow: number, floor: number, tilt: number, weight: number): PeriodicWave {
  const n = 64;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  for (let k = 1; k < n; k++) imag[k] = (floor + (1 - floor) * Math.abs(Math.sin(Math.PI * k * bow))) / Math.pow(k, tilt);
  // The browser would scale every wave to peak 1; scale to the weight instead.
  let peak = 0;
  const points = 1024;
  for (let i = 0; i < points; i++) {
    let x = 0;
    for (let k = 1; k < n; k++) x += imag[k]! * Math.sin((2 * Math.PI * k * i) / points);
    peak = Math.max(peak, Math.abs(x));
  }
  for (let k = 1; k < n; k++) imag[k] = (imag[k]! * weight) / peak;
  return c.createPeriodicWave(real, imag, { disableNormalization: true });
}

const noises = new WeakMap<BaseAudioContext, AudioBuffer>();

/** One second of white noise for the bow, made once per context. */
function noiseBuffer(c: BaseAudioContext): AudioBuffer {
  let b = noises.get(c);
  if (!b) {
    b = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = b.getChannelData(0);
    const rng = new Rng(0xb0e);
    for (let i = 0; i < d.length; i++) d[i] = rng.next() * 2 - 1;
    noises.set(c, b);
  }
  return b;
}
