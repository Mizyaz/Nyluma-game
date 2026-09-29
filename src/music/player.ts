import { SCORES } from './cues';
import { Ensemble } from './ensemble';
import { trackUrl, tracksFor } from './library';
import { hashSeed } from './rng';
import type { MusicCue, Track } from './types';

/** What is playing: generated piano or strings, a library recording, or nothing. */
export type MusicSource = 'piano' | 'strings' | 'track' | 'none';

export interface MusicState {
  cue: MusicCue | 'none';
  source: MusicSource;
  /** Library piece playing, if any. */
  track: string | null;
  /** Generated bars written and notes played so far in this cue. */
  bars: number;
  notes: number;
}

interface Session {
  readonly source: MusicSource;
  stop(fade: number): void;
  pause(): void;
  resume(): void;
  info(): { track: string | null; bars: number; notes: number };
}

/** Seconds of music scheduled ahead of the audio clock. */
const AHEAD = 1.2;

/** Default crossfade between cues (seconds). */
export const CROSSFADE = 1.6;

/**
 * Plays music for a cue: a library recording when the library has one for
 * it, otherwise generated music (piano or strings). Cue changes crossfade.
 */
export class MusicPlayer {
  private cue: MusicCue | 'none' = 'none';
  private session: Session | null = null;
  private library: Track[] = [];
  private readonly visits = new Map<MusicCue, number>();

  constructor(
    private readonly ctx: AudioContext,
    private readonly out: AudioNode,
    private readonly base = 'music/',
  ) {}

  get tracks(): readonly Track[] {
    return this.library;
  }

  setLibrary(tracks: Track[]): void {
    this.library = tracks;
    // A cue that just gained a recording switches to it.
    if (this.cue !== 'none' && this.session?.source === 'piano' && tracksFor(tracks, this.cue).length) {
      const cue = this.cue;
      this.cue = 'none';
      this.play(cue);
    }
  }

  /**
   * Switches to `cue`: the old music fades out and the new one fades in over
   * about `fade` seconds (shorter for a scene's quick change of mood).
   */
  play(cue: MusicCue | 'none', fade = CROSSFADE): void {
    if (cue === this.cue) return;
    this.cue = cue;
    this.session?.stop(fade);
    this.session = null;
    if (cue === 'none') return;
    const list = tracksFor(this.library, cue);
    this.session = list.length ? this.trackSession(cue, list, fade) : this.generatedSession(cue, fade);
  }

  /** While the page is hidden. */
  pause(): void {
    this.session?.pause();
  }

  resume(): void {
    this.session?.resume();
  }

  state(): MusicState {
    const s = this.session;
    return { cue: this.cue, source: s?.source ?? 'none', ...(s ? s.info() : { track: null, bars: 0, notes: 0 }) };
  }

  /** Fades in smoothly (no click): 63 % after 0.6 s for the default crossfade, in proportion for others. */
  private fadeIn(gain: GainNode, level: number, fade = CROSSFADE): void {
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.setTargetAtTime(level, t + 0.05, 0.6 * (fade / CROSSFADE));
  }

  /** Composes the cue live and plays it on its instruments. */
  private generatedSession(cue: MusicCue, fade: number): Session {
    const c = this.ctx;
    const score = SCORES[cue];
    // Each visit starts from its own opening and then wanders on.
    const visit = (this.visits.get(cue) ?? 0) + 1;
    this.visits.set(cue, visit);
    const composer = score.compose(hashSeed(`${cue}:${visit}`));
    const band = new Ensemble(c);
    const gain = c.createGain();
    this.fadeIn(gain, 1, fade);
    band.output.connect(gain);
    gain.connect(this.out);
    let next = c.currentTime + 0.2;
    let bars = 0;
    const pump = (): void => {
      // After a long stall, pick up from now instead of cramming missed bars.
      if (next < c.currentTime) next = c.currentTime + 0.05;
      while (next < c.currentTime + AHEAD) {
        const bar = composer.next();
        band.play(bar, next);
        next += bar.len;
        bars++;
      }
    };
    pump();
    let timer: number | null = window.setInterval(pump, 250);
    return {
      source: score.source,
      stop: (fade) => {
        if (timer !== null) window.clearInterval(timer);
        timer = null;
        gain.gain.setTargetAtTime(0.0001, c.currentTime, fade / 4);
        window.setTimeout(
          () => {
            gain.disconnect();
            band.dispose();
          },
          fade * 1000 + 4000,
        );
      },
      pause: () => undefined,
      resume: () => undefined,
      info: () => ({ track: null, bars, notes: band.struck }),
    };
  }

  private trackSession(cue: MusicCue, list: Track[], fade: number): Session {
    const c = this.ctx;
    const gain = c.createGain();
    gain.gain.value = 0.0001;
    gain.connect(this.out);
    const el = new Audio();
    el.preload = 'auto';
    // Online pieces need CORS to pass through the audio graph.
    el.crossOrigin = 'anonymous';
    el.loop = list.length === 1;
    let index = 0;
    let stopped = false;
    let current: Track = list[0]!;
    const source = c.createMediaElementSource(el);
    source.connect(gain);
    const start = (k: number, first = false): void => {
      current = list[k % list.length]!;
      el.src = trackUrl(current, this.base);
      this.fadeIn(gain, current.volume ?? 1, first ? fade : CROSSFADE);
      el.play().catch(fail);
    };
    const session: Session = {
      source: 'track',
      stop: (fade) => {
        stopped = true;
        gain.gain.setTargetAtTime(0.0001, c.currentTime, fade / 4);
        window.setTimeout(() => {
          el.pause();
          el.removeAttribute('src');
          el.load();
          source.disconnect();
          gain.disconnect();
        }, fade * 1000 + 500);
      },
      pause: () => el.pause(),
      resume: () => {
        if (!stopped) el.play().catch(() => undefined);
      },
      info: () => ({ track: current.id, bars: 0, notes: 0 }),
    };
    // A piece that cannot play hands its cue to the generated music.
    function fail(): void {
      if (stopped) return;
      stopped = true;
      failover();
    }
    const failover = (): void => {
      if (this.session !== session) return;
      session.stop(0.3);
      this.session = this.generatedSession(cue, CROSSFADE);
    };
    el.addEventListener('error', fail);
    el.addEventListener('ended', () => {
      if (!stopped && !el.loop) start(++index);
    });
    start(0, true);
    return session;
  }
}
