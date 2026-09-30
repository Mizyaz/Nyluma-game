import { app } from '../App';
import { NAMES } from '../../content/data/dialogue.tr';
import { lifeStageOf, type LifeStage } from '../../content/data/lifeStages';
import type { WorldScene } from '../scenes/WorldScene';
import type { Line } from '../../ui/Dialogue';

// Voices: as the words of a line appear, each makes a short sound in its
// speaker's own voice (synthesized, like a hum of speech). The pitch moves
// from word to word by the word itself, so a line always sounds the same;
// a question lifts at the end, a shout is louder and higher, a whisper is
// breath.

export interface VoiceProfile {
  /** Base pitch, Hz. */
  base: number;
  /** How far words wander from it, semitones (±). */
  spread: number;
  wave: OscillatorType;
  /** The vowel colour: band-pass centre (Hz) and sharpness. */
  formant: number;
  q: number;
  /** Seconds a short word sounds. */
  dur: number;
  /** Level, relative to other sound effects. */
  gain: number;
  /** Pitch bend across a word, semitones (negative falls). */
  bend: number;
  /** Breath mixed in, 0..1 (1 = a whisper). */
  breath: number;
  /** Vibrato: depth (semitones) and rate (Hz). */
  vib?: [number, number];
  /** A bell partial: frequency ratio and level. */
  bell?: [number, number];
  /** Tremolo: rate (Hz) and depth (0..1). */
  trem?: [number, number];
  /** Echo: delay (s) and feedback. */
  echo?: [number, number];
}

export const GORTI_VOICES: Record<LifeStage, VoiceProfile> = {
  // The box-headed child: a small, chirping screen voice.
  child: { base: 520, spread: 4, wave: 'square', formant: 1500, q: 1.3, dur: 0.075, gain: 0.24, bend: -1, breath: 0.08 },
  // The youth: a buzzing robot voice.
  youth: { base: 300, spread: 3, wave: 'square', formant: 950, q: 2, dur: 0.085, gain: 0.24, bend: -0.6, breath: 0.05, vib: [0.6, 27] },
  // The warrior: low and tired.
  warrior: { base: 168, spread: 2.5, wave: 'sawtooth', formant: 720, q: 1.4, dur: 0.1, gain: 0.34, bend: -1.6, breath: 0.16 },
};

/** Gorti as the Sivaslı amca (also in the office suit): warm, old, a little shaky. */
export const SIVASLI_VOICE: VoiceProfile = { base: 138, spread: 3, wave: 'triangle', formant: 540, q: 1.2, dur: 0.12, gain: 0.3, bend: -2, breath: 0.08, vib: [0.35, 5.5] };

/** Everyone else, by the name they speak under. */
const CAST: Record<string, VoiceProfile> = {
  [NAMES.babyMoon]: { base: 880, spread: 5, wave: 'sine', formant: 2100, q: 0.7, dur: 0.12, gain: 0.12, bend: 1, breath: 0, bell: [2.76, 0.35] },
  [NAMES.oldMoon]: { base: 196, spread: 3, wave: 'sine', formant: 820, q: 0.7, dur: 0.26, gain: 0.12, bend: -1, breath: 0.04, bell: [2.4, 0.3], echo: [0.18, 0.3] },
  [NAMES.sun]: { base: 247, spread: 3, wave: 'sawtooth', formant: 1150, q: 3, dur: 0.11, gain: 0.32, bend: -2.5, breath: 0.25 },
  [NAMES.horse]: { base: 330, spread: 5, wave: 'square', formant: 1300, q: 3, dur: 0.09, gain: 0.24, bend: 3, breath: 0.1, vib: [0.8, 14] },
  [NAMES.coward]: { base: 400, spread: 4, wave: 'triangle', formant: 1250, q: 1.5, dur: 0.09, gain: 0.24, bend: -1, breath: 0.1, trem: [18, 0.6] },
  [NAMES.forms]: { base: 262, spread: 6, wave: 'sawtooth', formant: 1600, q: 6, dur: 0.13, gain: 0.26, bend: 0, breath: 0.9 },
  [NAMES.voice]: { base: 440, spread: 2, wave: 'sine', formant: 900, q: 1, dur: 0.16, gain: 0.1, bend: -1, breath: 0.1, echo: [0.25, 0.45] },
  [NAMES.one]: { base: 175, spread: 2, wave: 'triangle', formant: 620, q: 1, dur: 0.09, gain: 0.27, bend: -1, breath: 0.2 },
  [NAMES.two]: { base: 205, spread: 2, wave: 'triangle', formant: 660, q: 1, dur: 0.09, gain: 0.27, bend: -1, breath: 0.2 },
  [NAMES.three]: { base: 235, spread: 2, wave: 'triangle', formant: 700, q: 1, dur: 0.09, gain: 0.27, bend: -1, breath: 0.2 },
};

/** Narration: the faint scratch of a pencil on paper. */
const NARRATOR: VoiceProfile = { base: 900, spread: 1, wave: 'sine', formant: 3200, q: 2, dur: 0.035, gain: 0.07, bend: 0, breath: 1 };

/** The voice a speaker has right now (Gorti's follows his body). */
export function voiceFor(who: string): VoiceProfile {
  if (!who) return NARRATOR;
  if (who === NAMES.gorti) {
    const world = app.game?.scene.getScene('world') as WorldScene | null;
    const p = world?.player;
    const q = app.quest?.progress;
    if (p?.kind === 'suit' || (p ? p.form === 'human' : q?.form === 'human')) return SIVASLI_VOICE;
    return GORTI_VOICES[lifeStageOf(q?.room ?? 'r01')];
  }
  return CAST[who] ?? NARRATOR;
}

/** Stable -1..1 from a word (the same word always goes the same way). */
export function wordTone(word: string): number {
  let h = 2166136261;
  for (let i = 0; i < word.length; i++) h = Math.imul(h ^ word.charCodeAt(i), 16777619);
  return ((h >>> 0) % 2001) / 1000 - 1;
}

/** Rough syllable count: Turkish vowels. */
export function syllables(word: string): number {
  return Math.max(1, (word.toLocaleLowerCase('tr').match(/[aeıioöuü]/g) ?? []).length);
}

/** How one word sounds: pitch, length, level, bend and breath. */
export function wordSound(v: VoiceProfile, word: string, line: Pick<Line, 'text' | 'whisper'>, last: boolean): { f: number; dur: number; gain: number; bend: number; breath: number } {
  const shout = /!\s*$/.test(line.text);
  const ask = last && /\?\s*$/.test(line.text);
  const f = v.base * Math.pow(2, (v.spread * wordTone(word) + (shout ? 2 : 0)) / 12);
  const dur = v.dur * (0.75 + 0.18 * Math.min(4, syllables(word)));
  const gain = v.gain * (shout ? 1.35 : 1) * (line.whisper ? 0.6 : 1);
  return { f, dur, gain, bend: ask ? 4 : v.bend, breath: line.whisper ? Math.max(0.85, v.breath) : v.breath };
}

/** Where a word is played: a context, the bus it goes to, a noise buffer. */
export interface VoiceOut {
  ctx: BaseAudioContext;
  bus: AudioNode;
  noise: AudioBuffer;
}

/** Plays one word now (or at `at`, context time). */
export function playWord(out: VoiceOut, v: VoiceProfile, word: string, line: Pick<Line, 'text' | 'whisper'>, last: boolean, at?: number): void {
  const { ctx, bus, noise } = out;
  const s = wordSound(v, word, line, last);
  const t = at ?? ctx.currentTime + 0.004;
  const end = t + s.dur;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(s.gain, t + 0.009);
  env.gain.exponentialRampToValueAtTime(0.0001, end);
  let tail: AudioNode = env;
  const nodes: AudioNode[] = [env];
  const sources: AudioScheduledSourceNode[] = [];
  if (v.trem) {
    const trem = ctx.createGain();
    trem.gain.value = 1 - v.trem[1] / 2;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = v.trem[0];
    const depth = ctx.createGain();
    depth.gain.value = v.trem[1] / 2;
    lfo.connect(depth).connect(trem.gain);
    env.connect(trem);
    tail = trem;
    nodes.push(trem, depth);
    sources.push(lfo);
  }
  if (v.echo) {
    const dry = ctx.createGain();
    const delay = ctx.createDelay(1);
    delay.delayTime.value = v.echo[0];
    const fb = ctx.createGain();
    fb.gain.value = v.echo[1];
    tail.connect(dry);
    tail.connect(delay);
    delay.connect(fb).connect(delay);
    delay.connect(dry);
    tail = dry;
    nodes.push(dry, delay, fb);
  }
  tail.connect(bus);
  if (s.breath < 1) {
    // The voiced part: an oscillator through the vowel's band, with some of
    // it dry so it keeps its body.
    const osc = ctx.createOscillator();
    osc.type = v.wave;
    osc.frequency.setValueAtTime(s.f, t);
    osc.frequency.exponentialRampToValueAtTime(s.f * Math.pow(2, s.bend / 12), end);
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = v.formant;
    band.Q.value = v.q;
    const voiced = ctx.createGain();
    voiced.gain.value = 1 - s.breath;
    const dry = ctx.createGain();
    dry.gain.value = 0.35;
    osc.connect(band).connect(voiced);
    osc.connect(dry).connect(voiced);
    voiced.connect(env);
    nodes.push(band, voiced, dry);
    sources.push(osc);
    if (v.vib) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = v.vib[1];
      const depth = ctx.createGain();
      depth.gain.value = s.f * (Math.pow(2, v.vib[0] / 12) - 1);
      lfo.connect(depth).connect(osc.frequency);
      nodes.push(depth);
      sources.push(lfo);
    }
    if (v.bell) {
      const b = ctx.createOscillator();
      b.frequency.value = s.f * v.bell[0];
      const bg = ctx.createGain();
      bg.gain.setValueAtTime(v.bell[1], t);
      bg.gain.exponentialRampToValueAtTime(0.0001, t + s.dur * 0.6);
      b.connect(bg).connect(env);
      nodes.push(bg);
      sources.push(b);
    }
  }
  if (s.breath > 0) {
    const n = ctx.createBufferSource();
    n.buffer = noise;
    n.loop = true;
    const nb = ctx.createBiquadFilter();
    nb.type = 'bandpass';
    nb.frequency.value = v.formant * 1.4;
    nb.Q.value = 1.1;
    const ng = ctx.createGain();
    ng.gain.value = s.breath * 0.9;
    n.connect(nb).connect(ng).connect(env);
    nodes.push(nb, ng);
    sources.push(n);
  }
  const stopAt = end + (v.echo ? v.echo[0] * 4 : 0.02);
  for (const src of sources) {
    src.start(t);
    src.stop(stopAt);
  }
  sources[0]?.addEventListener('ended', () => {
    for (const nd of [...sources, ...nodes]) nd.disconnect();
  });
}

/** Gives every word of the dialogue a voice. */
export function installVoices(dialogue: { onWord: ((word: string, index: number, line: Line) => void) | null }): void {
  let lastAt = 0;
  dialogue.onWord = (word, index, line) => {
    // Very fast text: at most one sound every 55 ms, so it never buzzes.
    const now = performance.now();
    if (now - lastAt < 55) return;
    lastAt = now;
    const out = app.audio?.sfxOut();
    if (!out) return;
    const words = line.text.trim().split(/\s+/).length;
    playWord(out, voiceFor(line.who ?? ''), word, line, index === words - 1);
  };
}
