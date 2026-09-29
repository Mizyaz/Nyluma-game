import type { Settings } from '../state/types';
import type { MusicId } from '../data/roomTypes';

// Original synthesized soundscape (Web Audio). One audio graph, three buses,
// voice limits, short gain ramps, and nodes disconnected when they end.
// Nothing streams at runtime; no external audio files are needed.

export type Sfx =
  | 'step'
  | 'stepWood'
  | 'stepMetal'
  | 'land'
  | 'jump'
  | 'root'
  | 'rootGrow'
  | 'crystal'
  | 'noteLow'
  | 'noteMid'
  | 'noteHigh'
  | 'songOk'
  | 'songBad'
  | 'wing'
  | 'hoof'
  | 'cough'
  | 'torch'
  | 'click'
  | 'clunk'
  | 'paper'
  | 'stamp'
  | 'ui'
  | 'uiBack'
  | 'hurt'
  | 'pulse'
  | 'focusIn'
  | 'focusOut'
  | 'pickup'
  | 'checkpoint'
  | 'transform'
  | 'splash'
  | 'chirp'
  | 'shout'
  | 'whale'
  | 'lash'
  | 'lashWarn'
  | 'shard'
  | 'door'
  | 'heartbeat'
  | 'rumble'
  | 'sunhit'
  | 'fishes'
  | 'drip'
  | 'clock'
  | 'gear'
  | 'neigh'
  | 'wisp'
  | 'bloom'
  | 'ray';

export type AmbienceId = 'wind' | 'cave' | 'river' | 'room' | 'none';

interface Voice {
  stopAt: number;
}

const NOTE = (n: number): number => 440 * Math.pow(2, (n - 69) / 12);

interface Theme {
  tempo: number; // steps per second (16ths)
  step: (a: AudioSystem, t: number, i: number, out: GainNode) => void;
}

export class AudioSystem {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private ambBus!: GainNode;
  private noise!: AudioBuffer;
  private voices: Voice[] = [];
  private musicVoices: Voice[] = [];
  private theme: MusicId = 'none';
  private themeGain: GainNode | null = null;
  private themeTimer: number | null = null;
  private themeStep = 0;
  private themeNext = 0;
  private ambience: AmbienceId = 'none';
  private ambNodes: { src: AudioScheduledSourceNode[]; gain: GainNode } | null = null;
  private settings: Settings | null = null;
  private ducked = false;
  private hidden = false;
  unlocked = false;

  constructor() {
    document.addEventListener('visibilitychange', () => {
      this.hidden = document.visibilityState === 'hidden';
      this.applyGains();
      if (!this.ctx) return;
      if (this.hidden) void this.ctx.suspend().catch(() => undefined);
      else void this.ctx.resume().catch(() => undefined);
    });
  }

  /** Must be called from a user gesture (Start / Continue). */
  unlock(): void {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.connect(this.ctx.destination);
        this.musicBus = this.ctx.createGain();
        this.sfxBus = this.ctx.createGain();
        this.ambBus = this.ctx.createGain();
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.ratio.value = 3;
        this.musicBus.connect(comp);
        this.sfxBus.connect(comp);
        this.ambBus.connect(comp);
        comp.connect(this.master);
        const len = this.ctx.sampleRate;
        this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noise.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      void this.ctx.resume().catch(() => undefined);
      if (this.ctx.state !== 'running') {
        // Blocked autoplay: retry on the next genuine user gesture.
        const retry = (): void => {
          void this.ctx?.resume().catch(() => undefined);
          window.removeEventListener('pointerdown', retry);
          window.removeEventListener('keydown', retry);
        };
        window.addEventListener('pointerdown', retry, { once: true });
        window.addEventListener('keydown', retry, { once: true });
      }
      this.unlocked = true;
      this.applyGains();
      const pending = this.theme;
      if (pending !== 'none' && !this.themeTimer) {
        this.theme = 'none';
        this.music(pending);
      }
      const amb = this.ambience;
      if (amb !== 'none' && !this.ambNodes) {
        this.ambience = 'none';
        this.setAmbience(amb);
      }
    } catch {
      this.ctx = null;
    }
  }

  applySettings(s: Settings): void {
    this.settings = s;
    this.applyGains();
  }

  duck(on: boolean): void {
    this.ducked = on;
    this.applyGains();
  }

  private applyGains(): void {
    if (!this.ctx || !this.settings) return;
    const t = this.ctx.currentTime;
    const s = this.settings;
    const hide = this.hidden ? 0 : 1;
    this.master.gain.setTargetAtTime(s.master * hide * 0.9, t, 0.05);
    this.musicBus.gain.setTargetAtTime(s.music * (this.ducked ? 0.35 : 1) * 0.55, t, 0.08);
    this.sfxBus.gain.setTargetAtTime(s.sfx * (this.ducked ? 0.3 : 1), t, 0.05);
    this.ambBus.gain.setTargetAtTime(s.sfx * (this.ducked ? 0.3 : 1) * 0.6, t, 0.1);
  }

  private ok(): AudioContext | null {
    const c = this.ctx;
    if (!c || !this.unlocked || c.state !== 'running') return null;
    return c;
  }

  private claim(list: Voice[], max: number, dur: number): boolean {
    const c = this.ctx!;
    const now = c.currentTime;
    for (let i = list.length - 1; i >= 0; i--) if (list[i]!.stopAt < now) list.splice(i, 1);
    if (list.length >= max) return false;
    list.push({ stopAt: now + dur });
    return true;
  }

  // ------------------------------------------------------------ primitives

  osc(type: OscillatorType, f0: number, t: number, dur: number, vol: number, out: AudioNode, o: { f1?: number; attack?: number; glide?: number; detune?: number; vib?: number; vibRate?: number } = {}): void {
    const c = this.ctx!;
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    if (o.f1 !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.f1), t + (o.glide ?? dur));
    if (o.detune) osc.detune.value = o.detune;
    const g = c.createGain();
    const a = o.attack ?? 0.005;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(out);
    let lfo: OscillatorNode | null = null;
    if (o.vib) {
      lfo = c.createOscillator();
      lfo.frequency.value = o.vibRate ?? 5;
      const lg = c.createGain();
      lg.gain.value = f0 * o.vib;
      lfo.connect(lg);
      lg.connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + dur + 0.05);
    }
    osc.start(t);
    osc.stop(t + dur + 0.05);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
      lfo?.disconnect();
    };
  }

  noiseBurst(t: number, dur: number, vol: number, out: AudioNode, filter: { type: BiquadFilterType; f0: number; f1?: number; q?: number }, attack = 0.003): void {
    const c = this.ctx!;
    const src = c.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const f = c.createBiquadFilter();
    f.type = filter.type;
    f.frequency.setValueAtTime(filter.f0, t);
    if (filter.f1) f.frequency.exponentialRampToValueAtTime(filter.f1, t + dur);
    f.Q.value = filter.q ?? 1;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(out);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
    src.onended = () => {
      src.disconnect();
      f.disconnect();
      g.disconnect();
    };
  }

  private chime(t: number, f: number, vol: number, out: AudioNode, dur = 1.4): void {
    this.osc('sine', f, t, dur, vol, out);
    this.osc('sine', f * 2.76, t, dur * 0.6, vol * 0.35, out);
    this.osc('sine', f * 5.4, t, dur * 0.3, vol * 0.12, out);
  }

  // ------------------------------------------------------------ sfx

  sfx(name: Sfx, opt: { vol?: number; pitch?: number } = {}): void {
    const c = this.ok();
    if (!c) return;
    const t = c.currentTime + 0.005;
    const v = opt.vol ?? 1;
    const p = opt.pitch ?? 1;
    const out = this.sfxBus;
    const dur = 1.2;
    if (!this.claim(this.voices, 28, dur)) return;
    switch (name) {
      case 'step':
        this.noiseBurst(t, 0.07, 0.12 * v, out, { type: 'bandpass', f0: 520 * p, q: 1.2 });
        this.osc('sine', 90 * p, t, 0.06, 0.06 * v, out);
        break;
      case 'stepWood':
        this.noiseBurst(t, 0.05, 0.1 * v, out, { type: 'bandpass', f0: 1300 * p, q: 2 });
        this.osc('triangle', 210 * p, t, 0.05, 0.05 * v, out);
        break;
      case 'stepMetal':
        this.osc('square', 880 * p, t, 0.03, 0.02 * v, out);
        this.noiseBurst(t, 0.04, 0.06 * v, out, { type: 'highpass', f0: 2500 });
        break;
      case 'land':
        this.noiseBurst(t, 0.14, 0.18 * v, out, { type: 'lowpass', f0: 380 * p });
        this.osc('sine', 85 * p, t, 0.14, 0.14 * v, out, { f1: 55 });
        break;
      case 'jump':
        this.noiseBurst(t, 0.12, 0.06 * v, out, { type: 'bandpass', f0: 300, f1: 900, q: 1.5 });
        break;
      case 'root':
        this.osc('sawtooth', 95 * p, t, 0.32, 0.05 * v, out, { f1: 150, vib: 0.08, vibRate: 22 });
        this.noiseBurst(t, 0.3, 0.07 * v, out, { type: 'bandpass', f0: 700, f1: 1400, q: 3 });
        break;
      case 'rootGrow':
        this.osc('sawtooth', 70 * p, t, 0.9, 0.05 * v, out, { f1: 140, vib: 0.1, vibRate: 16, attack: 0.1 });
        this.noiseBurst(t, 0.9, 0.06 * v, out, { type: 'bandpass', f0: 400, f1: 1200, q: 2 }, 0.1);
        this.chime(t + 0.5, 587 * p, 0.04 * v, out);
        break;
      case 'crystal':
        this.chime(t, 880 * p, 0.06 * v, out);
        break;
      case 'noteLow':
      case 'noteMid':
      case 'noteHigh': {
        const f = name === 'noteLow' ? 98 : name === 'noteMid' ? 147 : 220;
        this.osc('sine', f * 0.92, t, 0.95, 0.2 * v, out, { f1: f, glide: 0.22, attack: 0.09, vib: 0.006, vibRate: 5 });
        this.osc('triangle', f * 2, t, 0.8, 0.05 * v, out, { f1: f * 1.96, attack: 0.12 });
        this.chime(t + 0.02, f * 4, 0.025 * v, out, 0.8);
        break;
      }
      case 'songOk':
        [587, 740, 880, 1175].forEach((f, i) => this.chime(t + i * 0.12, f, 0.05 * v, out, 1.6));
        break;
      case 'songBad':
        this.osc('sine', 180, t, 0.3, 0.07 * v, out, { f1: 150, vib: 0.03, vibRate: 7 });
        break;
      case 'wing':
        for (let i = 0; i < 3; i++) this.noiseBurst(t + i * 0.06, 0.05, 0.05 * v, out, { type: 'bandpass', f0: 1600 * p, q: 1.5 });
        break;
      case 'hoof':
        this.osc('sine', 75 * p, t, 0.12, 0.2 * v, out, { f1: 50 });
        this.noiseBurst(t, 0.08, 0.1 * v, out, { type: 'lowpass', f0: 500 });
        break;
      case 'cough':
        this.noiseBurst(t, 0.25, 0.14 * v, out, { type: 'lowpass', f0: 700, f1: 300 });
        this.osc('sine', 170, t, 0.25, 0.08 * v, out, { f1: 90 });
        this.noiseBurst(t + 0.32, 0.22, 0.1 * v, out, { type: 'lowpass', f0: 600, f1: 260 });
        break;
      case 'torch':
        this.noiseBurst(t, 0.35, 0.08 * v, out, { type: 'bandpass', f0: 500, f1: 1400, q: 0.8 }, 0.05);
        for (let i = 0; i < 4; i++) this.noiseBurst(t + Math.random() * 0.3, 0.02, 0.05 * v, out, { type: 'highpass', f0: 3000 });
        break;
      case 'click':
        this.osc('square', 1800 * p, t, 0.02, 0.03 * v, out);
        this.osc('sine', 300 * p, t, 0.04, 0.05 * v, out);
        break;
      case 'clunk':
        this.osc('sine', 120 * p, t, 0.18, 0.16 * v, out, { f1: 80 });
        this.noiseBurst(t, 0.1, 0.1 * v, out, { type: 'bandpass', f0: 900, q: 2 });
        break;
      case 'paper':
        for (let i = 0; i < 5; i++) this.noiseBurst(t + i * 0.05 + Math.random() * 0.03, 0.08, 0.04 * v, out, { type: 'bandpass', f0: 2800 + Math.random() * 1500, q: 1 });
        break;
      case 'stamp':
        this.osc('sine', 62, t, 0.4, 0.4 * v, out, { f1: 40 });
        this.noiseBurst(t, 0.09, 0.3 * v, out, { type: 'lowpass', f0: 1500 });
        this.noiseBurst(t + 0.09, 0.5, 0.05 * v, out, { type: 'bandpass', f0: 600, q: 0.7 }, 0.02);
        break;
      case 'ui':
        this.osc('sine', 660 * p, t, 0.06, 0.05 * v, out);
        break;
      case 'uiBack':
        this.osc('sine', 440 * p, t, 0.06, 0.05 * v, out);
        break;
      case 'hurt':
        this.noiseBurst(t, 0.16, 0.14 * v, out, { type: 'lowpass', f0: 900, f1: 300 });
        this.osc('sine', 150, t, 0.18, 0.12 * v, out, { f1: 70 });
        this.chime(t, 330, 0.03 * v, out, 0.5);
        break;
      case 'pulse':
        this.osc('sine', 180, t, 0.25, 0.12 * v, out, { f1: 380, glide: 0.15 });
        this.chime(t + 0.05, 660, 0.04 * v, out, 0.9);
        break;
      case 'focusIn':
        this.noiseBurst(t, 0.45, 0.06 * v, out, { type: 'bandpass', f0: 250, f1: 900, q: 1.2 }, 0.2);
        break;
      case 'focusOut':
        this.noiseBurst(t, 0.4, 0.05 * v, out, { type: 'bandpass', f0: 800, f1: 220, q: 1.2 }, 0.03);
        break;
      case 'pickup':
        [784, 988, 1175, 1568].forEach((f, i) => this.chime(t + i * 0.09, f, 0.045 * v, out, 1.2));
        break;
      case 'checkpoint':
        [523, 659, 784].forEach((f) => this.chime(t, f, 0.035 * v, out, 1.8));
        break;
      case 'transform':
        this.noiseBurst(t, 1.0, 0.08 * v, out, { type: 'bandpass', f0: 200, f1: 2400, q: 1 }, 0.4);
        [392, 523, 698, 932].forEach((f, i) => this.chime(t + 0.3 + i * 0.1, f, 0.04 * v, out, 1.2));
        break;
      case 'splash':
        this.noiseBurst(t, 0.35, 0.12 * v, out, { type: 'lowpass', f0: 1800, f1: 400 });
        break;
      case 'chirp':
        for (let i = 0; i < 3; i++) this.osc('sine', (2300 + Math.random() * 900) * p, t + i * 0.11, 0.08, 0.035 * v, out, { f1: 3600 * p, glide: 0.06 });
        break;
      case 'shout':
        this.osc('sawtooth', 92, t, 1.0, 0.07 * v, out, { f1: 70, attack: 0.05, vib: 0.02, vibRate: 6 });
        this.osc('sawtooth', 138, t, 0.9, 0.04 * v, out, { f1: 110, attack: 0.05 });
        this.noiseBurst(t, 0.9, 0.08 * v, out, { type: 'bandpass', f0: 500, f1: 300, q: 1.5 }, 0.05);
        break;
      case 'whale':
        this.osc('sine', 170, t, 2.6, 0.12 * v, out, { f1: 110, glide: 1.4, attack: 0.5, vib: 0.01, vibRate: 3 });
        this.osc('sine', 340, t + 0.2, 2.2, 0.03 * v, out, { f1: 230, glide: 1.4, attack: 0.5 });
        break;
      case 'lashWarn':
        this.noiseBurst(t, 0.8, 0.07 * v, out, { type: 'lowpass', f0: 180, f1: 320 }, 0.3);
        break;
      case 'lash':
        this.noiseBurst(t, 0.2, 0.12 * v, out, { type: 'bandpass', f0: 2200, f1: 280, q: 2 });
        this.osc('sine', 90, t + 0.05, 0.15, 0.12 * v, out, { f1: 60 });
        break;
      case 'shard':
        this.chime(t, 1320 * p, 0.05 * v, out, 0.6);
        this.noiseBurst(t + 0.02, 0.2, 0.1 * v, out, { type: 'highpass', f0: 1800 });
        break;
      case 'door':
        this.osc('sawtooth', 110, t, 0.7, 0.04 * v, out, { f1: 150, vib: 0.05, vibRate: 11, attack: 0.08 });
        this.noiseBurst(t + 0.5, 0.2, 0.08 * v, out, { type: 'lowpass', f0: 500 });
        break;
      case 'heartbeat':
        this.osc('sine', 58, t, 0.14, 0.12 * v, out, { f1: 45 });
        this.osc('sine', 55, t + 0.22, 0.12, 0.08 * v, out, { f1: 42 });
        break;
      case 'rumble':
        this.noiseBurst(t, 1.6, 0.2 * v, out, { type: 'lowpass', f0: 120, f1: 80 }, 0.3);
        break;
      case 'sunhit':
        this.osc('sine', 70, t, 0.8, 0.25 * v, out, { f1: 45 });
        [440, 554, 659].forEach((f, i) => this.chime(t + i * 0.08, f, 0.04 * v, out, 1.5));
        break;
      case 'fishes':
        for (let i = 0; i < 8; i++) this.osc('sine', 400 + Math.random() * 600, t + Math.random() * 0.4, 0.07, 0.03 * v, out, { f1: 900 + Math.random() * 400 });
        break;
      case 'drip':
        this.osc('sine', 1400 * p, t, 0.08, 0.06 * v, out, { f1: 600, glide: 0.05 });
        break;
      case 'clock':
        this.osc('square', 1500, t, 0.015, 0.02 * v, out);
        this.osc('sine', 700, t, 0.03, 0.03 * v, out);
        break;
      case 'gear':
        for (let i = 0; i < 6; i++) this.osc('square', 900 + i * 40, t + i * 0.05, 0.015, 0.02 * v, out);
        this.osc('sine', 110, t, 0.35, 0.06 * v, out);
        break;
      case 'neigh':
        this.osc('sawtooth', 420, t, 0.9, 0.05 * v, out, { f1: 260, vib: 0.06, vibRate: 12, attack: 0.05 });
        this.noiseBurst(t, 0.8, 0.05 * v, out, { type: 'bandpass', f0: 1200, f1: 600, q: 2 });
        break;
      case 'wisp':
        this.osc('sine', 520, t, 0.5, 0.03 * v, out, { f1: 780, vib: 0.04, vibRate: 9, attack: 0.1 });
        break;
      case 'bloom':
        [659, 880, 1047].forEach((f, i) => this.chime(t + i * 0.05, f * p, 0.03 * v, out, 0.9));
        break;
      case 'ray':
        this.noiseBurst(t, 0.7, 0.05 * v, out, { type: 'bandpass', f0: 1800, f1: 900, q: 4 }, 0.15);
        this.osc('sine', 330, t, 0.7, 0.03 * v, out, { f1: 311, attack: 0.2 });
        break;
      default:
        break;
    }
  }

  // ------------------------------------------------------------ ambience

  setAmbience(id: AmbienceId): void {
    if (id === this.ambience) return;
    this.ambience = id;
    const c = this.ok();
    if (this.ambNodes && this.ctx) {
      const old = this.ambNodes;
      const t = this.ctx.currentTime;
      old.gain.gain.setTargetAtTime(0.0001, t, 0.4);
      window.setTimeout(() => {
        for (const s of old.src) {
          try {
            s.stop();
          } catch {
            /* already stopped */
          }
          s.disconnect();
        }
        old.gain.disconnect();
      }, 2000);
      this.ambNodes = null;
    }
    if (!c || id === 'none') return;
    const g = c.createGain();
    g.gain.value = 0.0001;
    g.connect(this.ambBus);
    const srcs: AudioScheduledSourceNode[] = [];
    const n = c.createBufferSource();
    n.buffer = this.noise;
    n.loop = true;
    const f = c.createBiquadFilter();
    const lfo = c.createOscillator();
    const lg = c.createGain();
    let level = 0.05;
    if (id === 'wind') {
      f.type = 'bandpass';
      f.frequency.value = 500;
      f.Q.value = 0.8;
      lfo.frequency.value = 0.13;
      lg.gain.value = 300;
      level = 0.09;
    } else if (id === 'cave') {
      f.type = 'lowpass';
      f.frequency.value = 220;
      lfo.frequency.value = 0.05;
      lg.gain.value = 60;
      level = 0.06;
    } else if (id === 'river') {
      f.type = 'bandpass';
      f.frequency.value = 1200;
      f.Q.value = 0.5;
      lfo.frequency.value = 0.3;
      lg.gain.value = 200;
      level = 0.05;
    } else {
      f.type = 'lowpass';
      f.frequency.value = 400;
      lfo.frequency.value = 0.07;
      lg.gain.value = 50;
      level = 0.025;
    }
    lfo.connect(lg);
    lg.connect(f.frequency);
    n.connect(f);
    f.connect(g);
    n.start();
    lfo.start();
    srcs.push(n, lfo);
    g.gain.setTargetAtTime(level, c.currentTime, 1.2);
    this.ambNodes = { src: srcs, gain: g };
  }

  // ------------------------------------------------------------ music

  music(id: MusicId): void {
    if (id === this.theme) return;
    this.theme = id;
    const c = this.ok();
    if (this.themeGain && this.ctx) {
      const old = this.themeGain;
      old.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.6);
      window.setTimeout(() => old.disconnect(), 3500);
      this.themeGain = null;
    }
    if (this.themeTimer !== null) {
      window.clearInterval(this.themeTimer);
      this.themeTimer = null;
    }
    if (!c || id === 'none') return;
    const theme = THEMES[id];
    if (!theme) return;
    const g = c.createGain();
    g.gain.value = 0.0001;
    g.gain.setTargetAtTime(1, c.currentTime + 0.1, 1.0);
    g.connect(this.musicBus);
    this.themeGain = g;
    this.themeStep = 0;
    this.themeNext = c.currentTime + 0.15;
    const tick = (): void => {
      const cc = this.ctx;
      if (!cc || this.themeGain !== g) return;
      while (this.themeNext < cc.currentTime + 0.25) {
        if (this.claim(this.musicVoices, 24, 4)) theme.step(this, this.themeNext, this.themeStep, g);
        this.themeStep++;
        this.themeNext += 1 / theme.tempo;
      }
    };
    tick();
    this.themeTimer = window.setInterval(tick, 60);
  }

  currentMusic(): MusicId {
    return this.theme;
  }

  // Helpers used by the themes.
  pad(t: number, notes: number[], dur: number, vol: number, out: AudioNode, type: OscillatorType = 'triangle'): void {
    for (const n of notes) {
      this.osc(type, NOTE(n), t, dur, vol, out, { attack: dur * 0.35, detune: (Math.random() - 0.5) * 8 });
    }
  }

  pluck(t: number, n: number, vol: number, out: AudioNode, dur = 0.9): void {
    this.osc('triangle', NOTE(n), t, dur, vol, out, { attack: 0.004 });
    this.osc('sine', NOTE(n) * 2, t, dur * 0.5, vol * 0.3, out, { attack: 0.004 });
  }

  bell(t: number, n: number, vol: number, out: AudioNode, dur = 2): void {
    this.chime(t, NOTE(n), vol, out, dur);
  }
}

const PENTA_D = [62, 64, 67, 69, 72, 74, 76, 79];
const rnd = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)]!;

const THEMES: Partial<Record<MusicId, Theme>> = {
  menu: {
    tempo: 2,
    step: (a, t, i, out) => {
      if (i % 16 === 0) a.pad(t, [50, 57, 62], 8.5, 0.04, out, 'sine');
      if (i % 16 === 8) a.pad(t, [48, 55, 60], 8.5, 0.035, out, 'sine');
      if (i % 3 === 0 && Math.random() < 0.55) a.bell(t, rnd(PENTA_D) + 12, 0.02, out, 2.4);
    },
  },
  roots: {
    tempo: 2,
    step: (a, t, i, out) => {
      if (i % 16 === 0) a.pad(t, [38, 45], 9, 0.06, out, 'sine');
      if (i % 16 === 8) a.pad(t, [41, 48], 9, 0.045, out, 'sine');
      if (Math.random() < 0.28) a.bell(t, rnd(PENTA_D) + (Math.random() < 0.3 ? 12 : 0), 0.018, out, 2.6);
      if (i % 32 === 20) a.osc('sine', 150, t, 3, 0.02, out, { f1: 105, glide: 2, attack: 0.8 });
    },
  },
  forest: {
    tempo: 3,
    step: (a, t, i, out) => {
      const chords = [
        [50, 57, 62, 65],
        [46, 53, 58, 62],
        [41, 48, 57, 60],
        [48, 55, 60, 64],
      ];
      if (i % 12 === 0) a.pad(t, chords[Math.floor(i / 12) % 4]!, 4.4, 0.028, out);
      if (i % 2 === 0 && Math.random() < 0.5) a.pluck(t, rnd([62, 65, 67, 69, 72, 74]), 0.025, out);
    },
  },
  ride: {
    tempo: 6.6,
    step: (a, t, i, out) => {
      const bar = Math.floor(i / 16) % 4;
      const roots = [50, 46, 53, 48];
      const r = roots[bar]!;
      if (i % 4 === 0) a.osc('sine', NOTE(r - 12), t, 0.35, 0.09, out, { f1: NOTE(r - 12) * 0.98 });
      if (i % 2 === 0) a.pluck(t, r + [12, 19, 24, 19][(i / 2) % 4]!, 0.022, out, 0.35);
      if (i % 16 === 0) a.pad(t, [r, r + 7, r + 12], 2.4, 0.024, out);
      if (i % 8 === 6) a.noiseBurst(t, 0.06, 0.02, out, { type: 'highpass', f0: 5000 });
    },
  },
  sun: {
    tempo: 3,
    step: (a, t, i, out) => {
      if (i % 12 === 0) a.pad(t, [45, 46, 52], 4.6, 0.035, out, 'sawtooth');
      if (i % 6 === 0) a.osc('sine', 55, t, 0.3, 0.1, out, { f1: 42 });
      if (i % 6 === 2) a.osc('sine', 52, t, 0.25, 0.07, out, { f1: 40 });
      if (Math.random() < 0.18) a.bell(t, rnd([69, 70, 76, 77]), 0.012, out, 1.4);
    },
  },
  inner: {
    tempo: 2,
    step: (a, t, i, out) => {
      a.osc('square', 1500, t, 0.012, 0.012, out);
      if (i % 2 === 0) {
        const tune = [74, 72, 69, 67, 69, 72, 76, 74];
        a.osc('triangle', NOTE(tune[(i / 2) % 8]!) * 1.004, t, 1.2, 0.03, out, { attack: 0.004 });
        a.osc('sine', NOTE(tune[(i / 2) % 8]!) * 3.01, t, 0.5, 0.008, out);
      }
      if (i % 16 === 0) a.pad(t, [43, 50, 55], 7.5, 0.03, out, 'sine');
    },
  },
  final: {
    tempo: 1.5,
    step: (a, t, i, out) => {
      if (i % 4 === 0) a.pluck(t, rnd([57, 60, 62, 64, 67]), 0.03, out, 3);
      if (i % 16 === 0) a.pad(t, [45, 52], 10, 0.025, out, 'sine');
    },
  },
};
