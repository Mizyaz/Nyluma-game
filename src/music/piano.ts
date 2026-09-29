import { Rng } from './rng';
import { midiToHz } from './theory';

// A small synthesized piano (Web Audio), no samples:
//  - each key sounds two slightly detuned "strings" whose tone comes from a
//    hammer-shaped harmonic spectrum;
//  - a low-pass filter closes after the strike, so notes start bright and
//    mellow as they ring, brighter when played harder;
//  - the level falls in two stages (a quick drop, then a long pitch-dependent
//    decay) and the damper stops the string when the pedal lifts;
//  - a short filtered noise burst gives the hammer's knock;
//  - keys spread across the stereo field by pitch;
//  - a generated room reverb (convolution) adds space.

const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));

export interface PianoOptions {
  /** Reverb level 0..1 (default 0.32). */
  reverb?: number;
}

export class Piano {
  /** Everything the piano plays passes through here. */
  readonly output: GainNode;
  private readonly bus: GainNode;
  private readonly wave: PeriodicWave;
  private readonly knock: AudioBuffer;
  private readonly nodes: AudioNode[] = [];
  private readonly rng = new Rng(0x51a7);
  /** Keys struck so far (for tests and diagnostics). */
  struck = 0;

  constructor(
    private readonly ctx: BaseAudioContext,
    opts: PianoOptions = {},
  ) {
    const c = ctx;
    this.output = c.createGain();
    this.bus = c.createGain();
    // Gentle top-end roll-off keeps the synthesized tone warm.
    const warm = c.createBiquadFilter();
    warm.type = 'lowpass';
    warm.frequency.value = 7800;
    warm.Q.value = 0.5;
    const dry = c.createGain();
    dry.gain.value = 0.86;
    const wet = c.createGain();
    wet.gain.value = opts.reverb ?? 0.32;
    const verb = c.createConvolver();
    verb.buffer = roomImpulse(c, 2.6);
    this.bus.connect(warm);
    warm.connect(dry);
    warm.connect(verb);
    verb.connect(wet);
    dry.connect(this.output);
    wet.connect(this.output);
    this.nodes.push(this.bus, warm, dry, wet, verb);
    this.wave = pianoWave(c);
    this.knock = knockBuffer(c);
  }

  /**
   * Strikes a key at time `t` (context seconds) with velocity 0..1; the damper
   * falls at `off`.
   */
  note(t: number, midi: number, vel: number, off: number): void {
    const c = this.ctx;
    const f0 = midiToHz(midi);
    const v = clamp(vel, 0.05, 1);
    // Loudness: soft keys much softer; the lowest notes trimmed a little.
    const reg = midi < 45 ? 0.72 + (midi - 33) * 0.023 : midi > 88 ? 0.85 : 1;
    const peak = 0.7 * Math.pow(v, 1.5) * reg;
    // Ring time falls with pitch: ~10 s in the bass, under 2 s up high.
    const t60 = clamp(10.5 * Math.pow(2, -(midi - 33) / 19), 1.3, 10.5);
    const rel = Math.max(off, t + 0.06);
    const damp = midi < 48 ? 0.16 : 0.1;
    const end = rel + damp * 7;

    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.004);
    g.gain.setTargetAtTime(peak * 0.42, t + 0.004, 0.16 + 0.12 * (1 - v));
    if (rel > t + 0.34) g.gain.setTargetAtTime(0.00001, t + 0.34, t60 / 6.9);
    g.gain.setTargetAtTime(0, rel, damp);

    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 0.6;
    const bright = clamp(Math.max(f0 * (2.4 + 9 * v), 650 + 2600 * v), 200, 12000);
    const mellow = clamp(Math.max(f0 * 1.7, 420), 200, 7000);
    lp.frequency.setValueAtTime(bright, t);
    lp.frequency.setTargetAtTime(mellow, t + 0.01, 0.3 + 0.5 * (1 - v));

    const pan = c.createStereoPanner();
    pan.pan.value = clamp((midi - 62) / 52, -0.45, 0.45);

    const cents = 0.5 + this.rng.next() * 0.9;
    const strings: OscillatorNode[] = [];
    for (const d of [-cents, cents]) {
      const o = c.createOscillator();
      o.setPeriodicWave(this.wave);
      o.frequency.value = f0;
      o.detune.value = d;
      o.connect(lp);
      o.start(t);
      o.stop(end);
      strings.push(o);
    }
    lp.connect(g);
    g.connect(pan);
    pan.connect(this.bus);

    // Hammer knock.
    const k = c.createBufferSource();
    k.buffer = this.knock;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = clamp(f0 * 5, 900, 5200);
    bp.Q.value = 0.9;
    const kg = c.createGain();
    kg.gain.setValueAtTime(peak * 0.5 * v, t);
    kg.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
    k.connect(bp);
    bp.connect(kg);
    kg.connect(pan);
    k.start(t);
    k.stop(t + 0.045);

    strings[0]!.onended = () => {
      for (const n of [...strings, lp, g, pan, k, bp, kg]) n.disconnect();
    };
    this.struck++;
  }

  dispose(): void {
    this.output.disconnect();
    for (const n of this.nodes) n.disconnect();
  }
}

/** Harmonic spectrum of a string struck about 1/7.5 of the way along. */
function pianoWave(c: BaseAudioContext): PeriodicWave {
  const n = 28;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  for (let k = 1; k < n; k++) {
    const hammer = Math.abs(Math.sin((Math.PI * k) / 7.5));
    imag[k] = (hammer * 0.85 + 0.15) / Math.pow(k, 1.35);
  }
  return c.createPeriodicWave(real, imag);
}

/** 50 ms of noise for the hammer's knock. */
function knockBuffer(c: BaseAudioContext): AudioBuffer {
  const len = Math.floor(c.sampleRate * 0.05);
  const b = c.createBuffer(1, len, c.sampleRate);
  const d = b.getChannelData(0);
  const rng = new Rng(0xbeef);
  for (let i = 0; i < len; i++) d[i] = rng.next() * 2 - 1;
  return b;
}

/**
 * A room's echo as an impulse response: a few early reflections, then a dense
 * tail that decays over `seconds` and darkens as it fades.
 */
export function roomImpulse(c: BaseAudioContext, seconds: number): AudioBuffer {
  const rate = c.sampleRate;
  const len = Math.floor(rate * seconds);
  const b = c.createBuffer(2, len, rate);
  const pre = 0.014;
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch);
    const rng = new Rng(ch === 0 ? 0x1234 : 0x9876);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / rate - pre;
      if (t < 0) continue;
      const env = Math.exp(-t / 0.42);
      const a = 0.07 + 0.55 * Math.exp(-t / 0.5);
      lp += a * (rng.next() * 2 - 1 - lp);
      d[i] = lp * env;
    }
    for (let r = 0; r < 6; r++) {
      const i = Math.floor((pre + 0.006 + r * 0.011 + rng.next() * 0.006) * rate);
      if (i < len) d[i] = d[i]! + (0.55 - r * 0.07) * (rng.next() < 0.5 ? -1 : 1);
    }
  }
  return b;
}
