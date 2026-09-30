import { Rng } from '../../render/2d/svg';
import type { WhaleSpecies } from '../../content/characters/whales';

// Whale calls, synthesized (no recordings). Each species sounds like itself:
//  - sperm whale: codas, rhythmic trains of sharp broadband clicks ("click
//    click click … click"). Every click is a few decaying pulses a few ms
//    apart, the echo inside the whale's huge head.
//  - blue whale: long, low moans sweeping slowly down, fundamental 40–90 Hz,
//    with strong harmonics up to ~700 Hz so small speakers still carry it.
//  - bowhead: melodic song, frequency-modulated sweeps between ~100 and
//    600 Hz with harmonics, vibrato and at times a second voice (bowheads
//    sing two sounds at once).
// A short call (0.6–1.5 s) answers a landing; a long one (5–7 s) drifts in
// now and then from far away: quieter, duller, with an echo. Everything is
// scheduled on a BaseAudioContext, so an OfflineAudioContext can render it.

export type WhaleCallKind = 'short' | 'long';

export interface WhaleCallOptions {
  /** Level; 1 is the calls' reference level (in line with the other sfx). */
  vol?: number;
  /** Individual voice, about 0.9–1.1 (pitch, and the size of the clicks). */
  pitch?: number;
  /** 0 close by … 1 far away: quieter, duller, more echo. */
  distance?: number;
  /** Stereo position, -1 (left) … 1 (right). */
  pan?: number;
  /** Picks the variant (coda, phrase); random when omitted. */
  seed?: number;
}

/** Length of a call (seconds, without the far echo), for voice limits. */
export function whaleCallLength(sp: WhaleSpecies, kind: WhaleCallKind): number {
  if (kind === 'short') return sp === 'blue' ? 1.5 : sp === 'bowhead' ? 1.2 : 1.0;
  return sp === 'blue' ? 6.4 : sp === 'bowhead' ? 6.8 : 6.2;
}

interface Res {
  clicks: AudioBuffer[];
  noise: AudioBuffer;
  waves: Map<string, PeriodicWave>;
}

const resources = new WeakMap<BaseAudioContext, Res>();

function res(ctx: BaseAudioContext): Res {
  let r = resources.get(ctx);
  if (!r) {
    r = { clicks: makeClicks(ctx), noise: makeNoise(ctx), waves: new Map() };
    resources.set(ctx, r);
  }
  return r;
}

/**
 * Sperm whale clicks: a sharp broadband burst with a short "tock" ring and
 * a little body, repeated 3–4 times at the inter-pulse interval (the sound
 * bouncing inside the spermaceti organ). Three head sizes.
 */
function makeClicks(ctx: BaseAudioContext): AudioBuffer[] {
  const sr = ctx.sampleRate;
  const rng = new Rng(1409);
  return [3.1, 3.8, 4.5].map((ipiMs, v) => {
    const n = Math.ceil(sr * 0.03);
    const buf = ctx.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    const amps = [1, 0.5, 0.26, 0.12];
    const ringHz = 2900 - v * 350;
    for (let k = 0; k < amps.length; k++) {
      const off = Math.round(k * ipiMs * 0.001 * sr);
      const a = amps[k]!;
      const len = Math.min(n - off, Math.ceil(sr * 0.014));
      for (let j = 0; j < len; j++) {
        const tt = j / sr;
        const burst = (rng.next() * 2 - 1) * Math.exp(-tt / 0.00042);
        const ring = Math.sin(2 * Math.PI * ringHz * tt) * Math.exp(-tt / 0.0011) * 0.55;
        const body = Math.sin(2 * Math.PI * 470 * tt) * Math.exp(-tt / 0.0035) * (k === 0 ? 0.22 : 0.06);
        d[off + j] = d[off + j]! + a * (burst + ring + body);
      }
    }
    let peak = 0;
    for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(d[i]!));
    for (let i = 0; i < n; i++) d[i] = d[i]! / (peak || 1);
    return buf;
  });
}

function makeNoise(ctx: BaseAudioContext): AudioBuffer {
  const n = Math.ceil(ctx.sampleRate * 2);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  const rng = new Rng(77);
  for (let i = 0; i < n; i++) d[i] = rng.next() * 2 - 1;
  return buf;
}

function wave(ctx: BaseAudioContext, name: string, harmonics: readonly number[]): PeriodicWave {
  const r = res(ctx);
  let w = r.waves.get(name);
  if (!w) {
    const imag = new Float32Array([0, ...harmonics]);
    w = ctx.createPeriodicWave(new Float32Array(imag.length), imag);
    r.waves.set(name, w);
  }
  return w;
}

/** Blue whale: the 3rd harmonic strongest, as in recordings; the fundamental is felt more than heard. */
const BLUE_HARM = [0.55, 0.9, 1, 0.74, 0.52, 0.36, 0.24, 0.15, 0.1, 0.06];
/** Bowhead: a reedy, vocal tone. */
const BOW_HARM = [1, 0.55, 0.36, 0.24, 0.14, 0.09, 0.05];

function unhook(nodes: AudioNode[]): void {
  for (const n of nodes) {
    try {
      n.disconnect();
    } catch {
      /* already disconnected */
    }
  }
}

interface Glide {
  /** Seconds from the note's start. */
  at: number;
  f: number;
}

interface VoiceOpts {
  wave: PeriodicWave;
  level: number;
  attack: number;
  release: number;
  /** Vibrato depth (cents) and rate (Hz); it comes in after the attack. */
  vib?: number;
  vibRate?: number;
  /** Pulsing (the blue whale's A call): depth 0..1 and rate (Hz). */
  am?: number;
  amRate?: number;
  detune?: number;
  /** Low-pass on the voice (Hz). */
  lp?: number;
}

/** One tonal unit gliding through `pts` (exponential ramps). Returns its end time. */
function voice(ctx: BaseAudioContext, out: AudioNode, t: number, pts: readonly Glide[], o: VoiceOpts): number {
  const end = t + pts[pts.length - 1]!.at;
  const osc = ctx.createOscillator();
  osc.setPeriodicWave(o.wave);
  osc.frequency.setValueAtTime(pts[0]!.f, t);
  for (let i = 1; i < pts.length; i++) osc.frequency.exponentialRampToValueAtTime(pts[i]!.f, t + pts[i]!.at);
  if (o.detune) osc.detune.value = o.detune;
  const nodes: AudioNode[] = [osc];
  const lfos: OscillatorNode[] = [];
  let head: AudioNode = osc;
  if (o.lp) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = o.lp;
    f.Q.value = 0.4;
    head.connect(f);
    head = f;
    nodes.push(f);
  }
  if (o.am) {
    const am = ctx.createGain();
    am.gain.value = 1 - o.am / 2;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = o.amRate ?? 2;
    const depth = ctx.createGain();
    depth.gain.value = o.am / 2;
    lfo.connect(depth);
    depth.connect(am.gain);
    head.connect(am);
    head = am;
    nodes.push(am, lfo, depth);
    lfos.push(lfo);
  }
  if (o.vib) {
    const lfo = ctx.createOscillator();
    lfo.frequency.value = o.vibRate ?? 5.5;
    const depth = ctx.createGain();
    depth.gain.setValueAtTime(0, t);
    depth.gain.linearRampToValueAtTime(o.vib, t + Math.min(0.35, o.attack + 0.15));
    lfo.connect(depth);
    depth.connect(osc.detune);
    nodes.push(lfo, depth);
    lfos.push(lfo);
  }
  const g = ctx.createGain();
  const hold = Math.max(t + o.attack, end - o.release);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.level, t + o.attack);
  g.gain.setValueAtTime(o.level, hold);
  g.gain.exponentialRampToValueAtTime(0.0001, end);
  head.connect(g);
  g.connect(out);
  nodes.push(g);
  osc.start(t);
  osc.stop(end + 0.05);
  for (const l of lfos) {
    l.start(t);
    l.stop(end + 0.05);
  }
  osc.onended = () => unhook(nodes);
  return end;
}

/** Breath/rumble texture under a moan: band-passed noise following an envelope. */
function breath(ctx: BaseAudioContext, out: AudioNode, t: number, dur: number, f: number, level: number): void {
  const src = ctx.createBufferSource();
  src.buffer = res(ctx).noise;
  src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = f;
  bp.Q.value = 0.9;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(level, t + dur * 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(out);
  src.start(t, 0);
  src.stop(t + dur + 0.05);
  src.onended = () => unhook([src, bp, g]);
}

/** One sperm whale click at time t. */
function click(ctx: BaseAudioContext, out: AudioNode, t: number, level: number, variant: number, rate: number): void {
  const src = ctx.createBufferSource();
  const clicks = res(ctx).clicks;
  src.buffer = clicks[Math.max(0, Math.min(clicks.length - 1, variant))]!;
  src.playbackRate.value = rate;
  const g = ctx.createGain();
  g.gain.value = level;
  src.connect(g);
  g.connect(out);
  src.start(t);
  src.onended = () => unhook([src, g]);
}

/** Inter-click intervals of a few real coda types (seconds). */
const CODAS: readonly (readonly number[])[] = [
  [0.17, 0.17, 0.44], // 3+1: click click click … click
  [0.15, 0.15, 0.15, 0.15], // 5R: five even clicks
  [0.29, 0.29, 0.09, 0.09], // 1+1+3
  [0.16, 0.16, 0.16, 0.38], // 4+1
];

/** Plays a coda; returns its end time. */
function coda(ctx: BaseAudioContext, out: AudioNode, t: number, ici: readonly number[], level: number, variant: number, pitch: number, rng: Rng): number {
  let at = t;
  const stretch = 1 / pitch;
  click(ctx, out, at, level, variant, pitch);
  for (let i = 0; i < ici.length; i++) {
    at += ici[i]! * stretch * rng.range(0.96, 1.04);
    // The last click of a coda is often a touch softer.
    click(ctx, out, at, level * (i === ici.length - 1 ? 0.85 : rng.range(0.88, 1)), variant, pitch);
  }
  return at + 0.03;
}

function sperm(ctx: BaseAudioContext, out: AudioNode, t: number, kind: WhaleCallKind, pitch: number, rng: Rng): number {
  const variant = pitch < 0.97 ? 2 : pitch > 1.03 ? 0 : 1;
  if (kind === 'short') {
    const ici = rng.chance(0.65) ? CODAS[0]! : CODAS[1 + rng.int(0, 2)]!;
    return coda(ctx, out, t, ici, 0.4, variant, pitch, rng) - t;
  }
  // Far off: slow echolocation clicks, then two whales trading codas.
  let at = t;
  for (let i = 0; i < 6; i++) {
    click(ctx, out, at, 0.12 + i * 0.025, variant, pitch);
    at += 0.52 * rng.range(0.95, 1.05);
  }
  at = coda(ctx, out, at + 0.25, CODAS[0]!, 0.34, variant, pitch, rng);
  at = coda(ctx, out, at + 0.45, CODAS[0]!, 0.22, (variant + 1) % 3, pitch * 0.94, rng);
  at = coda(ctx, out, at + 0.5, CODAS[rng.chance(0.5) ? 1 : 2]!, 0.3, variant, pitch, rng);
  return at - t;
}

function blue(ctx: BaseAudioContext, out: AudioNode, t: number, kind: WhaleCallKind, pitch: number): number {
  const w = wave(ctx, 'blue', BLUE_HARM);
  const moan = (at: number, f0: number, f1: number, dur: number, level: number, pulsed: boolean): number => {
    const pts: Glide[] = [
      { at: 0, f: f0 * pitch },
      { at: dur * 0.3, f: f0 * pitch * 0.985 },
      { at: dur, f: f1 * pitch },
    ];
    const common = { wave: w, attack: 0.22, release: Math.min(0.55, dur * 0.4), lp: 820, vib: 7, vibRate: 3.2 };
    voice(ctx, out, at, pts, { ...common, level, am: pulsed ? 0.7 : 0, amRate: 2.1 });
    // A second, slightly detuned voice: the slow beating of a sound that has
    // travelled far through water.
    voice(ctx, out, at, pts, { ...common, level: level * 0.55, detune: 9 });
    breath(ctx, out, at, dur, 170 * pitch, level * 0.22);
    return at + dur;
  };
  if (kind === 'short') return moan(t, 88, 66, 1.45, 0.21, false) - t;
  // Three voices, deep, middle and high, each sliding slowly down.
  let at = moan(t, 52, 45, 2.1, 0.19, true);
  at = moan(at + 0.3, 68, 59, 1.7, 0.16, false);
  at = moan(at + 0.3, 90, 72, 1.8, 0.14, false);
  return at - t;
}

function bowhead(ctx: BaseAudioContext, out: AudioNode, t: number, kind: WhaleCallKind, pitch: number, rng: Rng): number {
  const w = wave(ctx, 'bowhead', BOW_HARM);
  const p = pitch;
  const note = (at: number, pts: readonly [number, number][], level: number, vib = 28): number =>
    voice(ctx, out, at, pts.map(([s, f]) => ({ at: s, f: f * p })), { wave: w, level, attack: 0.06, release: 0.2, vib, vibRate: 6.3, lp: 2600 });
  if (kind === 'short') {
    // A rising "whoop" that bends back down, with a thin second voice.
    const up = rng.chance(0.5);
    const end = up
      ? note(t, [[0, 185], [0.32, 430], [0.72, 405], [1.1, 290]], 0.16)
      : note(t, [[0, 520], [0.3, 360], [0.7, 330], [1.1, 170]], 0.16);
    note(t + 0.08, up ? [[0, 560], [0.9, 470]] : [[0, 610], [0.9, 540]], 0.045, 18);
    return end - t;
  }
  // A song phrase: downsweep, rising call with vibrato, a two-voice unit,
  // two quick whoops and a long fall.
  let at = note(t, [[0, 540], [0.85, 255]], 0.13);
  at = note(at + 0.18, [[0, 150], [0.45, 300], [1.1, 330]], 0.15, 36);
  const two = at + 0.2;
  at = note(two, [[0, 120], [0.6, 175], [1.3, 160]], 0.13);
  note(two, [[0, 480], [0.7, 420], [1.3, 395]], 0.06, 20);
  at = note(at + 0.15, [[0, 220], [0.35, 390]], 0.12);
  at = note(at + 0.08, [[0, 240], [0.35, 410]], 0.12);
  at = note(at + 0.2, [[0, 420], [0.5, 380], [1.4, 118]], 0.14, 30);
  return at - t;
}

/**
 * Schedules one call at time `t` into `out`. Returns its length (seconds,
 * not counting the far echo). All nodes disconnect themselves afterwards.
 */
export function scheduleWhaleCall(ctx: BaseAudioContext, out: AudioNode, t: number, sp: WhaleSpecies, kind: WhaleCallKind, o: WhaleCallOptions = {}): number {
  const rng = new Rng(o.seed ?? Math.floor(Math.random() * 2 ** 31));
  const pitch = Math.max(0.85, Math.min(1.15, o.pitch ?? 1));
  const far = Math.max(0, Math.min(1, o.distance ?? 0));
  const nodes: AudioNode[] = [];
  // Distance: quieter, duller, and an echo.
  const input = ctx.createGain();
  input.gain.value = Math.max(0, o.vol ?? 1) * (1 - 0.6 * far);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 9000 * Math.pow(700 / 9000, far);
  lp.Q.value = 0.5;
  input.connect(lp);
  nodes.push(input, lp);
  let outNode: AudioNode = lp;
  if (typeof ctx.createStereoPanner === 'function') {
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.max(-1, Math.min(1, o.pan ?? 0)) * 0.8;
    lp.connect(pan);
    outNode = pan;
    nodes.push(pan);
  }
  outNode.connect(out);
  let tail = 0.1;
  if (far > 0.05) {
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.21 + 0.14 * far;
    const fb = ctx.createGain();
    fb.gain.value = 0.22 + 0.2 * far;
    const loop = ctx.createBiquadFilter();
    loop.type = 'lowpass';
    loop.frequency.value = 1400;
    const send = ctx.createGain();
    send.gain.value = 0.25 + 0.4 * far;
    lp.connect(send);
    send.connect(delay);
    delay.connect(loop);
    loop.connect(fb);
    fb.connect(delay);
    loop.connect(outNode);
    nodes.push(delay, fb, loop, send);
    tail = 1.8;
  }
  let dur: number;
  if (sp === 'sperm') dur = sperm(ctx, input, t, kind, pitch, rng);
  else if (sp === 'blue') dur = blue(ctx, input, t, kind, pitch);
  else dur = bowhead(ctx, input, t, kind, pitch, rng);
  // A silent keeper outlives the echo, then takes the chain down.
  const keeper = ctx.createConstantSource();
  const mute = ctx.createGain();
  mute.gain.value = 0;
  keeper.connect(mute);
  mute.connect(out);
  keeper.start(t);
  keeper.stop(t + dur + tail);
  keeper.onended = () => unhook([...nodes, keeper, mute]);
  return dur;
}
