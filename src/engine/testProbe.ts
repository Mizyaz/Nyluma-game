import { app } from './App';
import { GORTI_VOICES, SIVASLI_VOICE, playWord, voiceFor } from './audio/voices';
import { scheduleWhaleCall, whaleCallLength, type WhaleCallKind } from './audio/whaleCalls';
import type { WhaleSpecies } from '../content/characters/whales';
import type { WorldScene } from './scenes/WorldScene';
import { Ensemble, composeCue, type MusicCue } from '../music';

// E2E-only read-only state probe (compiled out of production builds).
export function installProbe(): void {
  const w = window as unknown as { __kd: unknown };
  w.__kd = {
    state(): unknown {
      const scenes = app.game.scene.getScenes(true).map((s) => s.scene.key);
      const world = app.game.scene.getScene('world') as WorldScene | null;
      const active = scenes.includes('world') && world && world.player;
      return {
        scenes,
        context: app.input.context,
        room: active ? world.def.id : null,
        player: active
          ? {
              x: world.player.x,
              y: world.player.feetY,
              vx: world.player.body.velocity.x,
              vy: world.player.body.velocity.y,
              onGround: world.player.onGround,
              state: world.player.state,
              form: world.player.form,
              kind: world.player.kind,
              focus: world.player.focus.value,
              facing: world.player.facing,
            }
          : null,
        paused: active ? world.paused : false,
        busy: active ? world.narrative.busy : false,
        flags: app.quest ? [...app.quest.progress.flags] : [],
        checkpoint: app.quest?.progress.checkpoint ?? null,
        memories: app.quest?.profile.memories ?? app.profile.memories,
        dialogueOpen: app.ui.dialogue.isOpen,
        docOpen: app.ui.doc.isOpen,
        endingOpen: app.ui.ending.isOpen,
        heldSources: app.input.sourceCount(),
        extra: active ? { ...world.probeExtra } : {},
        prompts: [...document.querySelectorAll('.prompt span')].map((e) => e.textContent ?? ''),
        fps: Math.round(app.game.loop.actualFps),
        simElapsed: active ? world.elapsed : 0,
        loopDelta: app.game.loop.delta,
        rawDelta: app.game.loop.rawDelta,
        renderer: app.game.renderer.type === 2 ? 'webgl' : 'canvas',
        music: app.audio.musicState(),
        bursts: active ? { count: world.bursts.count, active: world.bursts.active } : null,
        moves: active
          ? {
              count: world.moves.count,
              last: world.moves.last,
              ready: world.moves.ready,
              next: world.moves.pick()?.id ?? null,
              running: world.moves.running,
              birds: world.moves.birdsFlying,
            }
          : null,
        features: active ? world.featureIds : [],
        view: active
          ? (({ x, y, width, height }) => ({ x, y, w: width, h: height }))(world.cameras.main.worldView)
          : null,
      };
    },
    /**
     * Renders `seconds` of a cue's generated music (piano or strings) offline
     * at the default music volume and reports the mix's peak and RMS level.
     */
    async renderMusic(cue: MusicCue, seconds: number, seed = 1): Promise<{ peak: number; rms: number; notes: number }> {
      const { buf, notes } = await renderOffline(cue, seconds, seed);
      let peak = 0;
      let sum = 0;
      for (let ch = 0; ch < buf.numberOfChannels; ch++) {
        for (const v of buf.getChannelData(ch)) {
          peak = Math.max(peak, Math.abs(v));
          sum += v * v;
        }
      }
      return { peak, rms: Math.sqrt(sum / (buf.length * buf.numberOfChannels)), notes };
    },
    /** The same render as a 16-bit WAV file (base64), normalized for listening. */
    async musicWav(cue: MusicCue, seconds: number, seed = 1): Promise<string> {
      const { buf } = await renderOffline(cue, seconds, seed);
      return wavBase64(buf);
    },
    /** Whale calls one after another, as a WAV file (base64). */
    async whaleWav(calls: { species: WhaleSpecies; kind: WhaleCallKind }[]): Promise<string> {
      const rate = 44100;
      const total = calls.reduce((s, c) => s + whaleCallLength(c.species, c.kind) + 0.6, 0.3);
      const ctx = new OfflineAudioContext(2, Math.ceil(rate * total), rate);
      const bus = ctx.createGain();
      bus.gain.value = 0.6 * 0.8;
      bus.connect(ctx.destination);
      let t = 0.2;
      for (const c of calls) {
        scheduleWhaleCall(ctx, bus, t, c.species, c.kind);
        t += whaleCallLength(c.species, c.kind) + 0.6;
      }
      return wavBase64(await ctx.startRendering());
    },
    /**
     * Dialogue lines in the characters' voices, typed at the normal speed, as
     * a WAV file (base64). `voice` picks one of Gorti's voices by name.
     */
    async voiceWav(lines: { who?: string; text: string; whisper?: boolean; voice?: 'child' | 'youth' | 'warrior' | 'sivasli' }[]): Promise<string> {
      const rate = 44100;
      const cps = 45;
      const total = lines.reduce((s, l) => s + l.text.length / cps + 0.7, 0.4);
      const ctx = new OfflineAudioContext(2, Math.ceil(rate * total), rate);
      const noise = ctx.createBuffer(1, rate, rate);
      const nd = noise.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      const bus = ctx.createGain();
      bus.gain.value = 0.6 * 0.8;
      bus.connect(ctx.destination);
      let t = 0.2;
      for (const l of lines) {
        const v = l.voice === 'sivasli' ? SIVASLI_VOICE : l.voice ? GORTI_VOICES[l.voice] : voiceFor(l.who ?? '');
        const words = [...l.text.matchAll(/\S+/g)];
        let lastAt = -1;
        words.forEach((m, i) => {
          const at = t + (m.index ?? 0) / cps;
          if (at - lastAt < 0.055) return;
          lastAt = at;
          playWord({ ctx, bus, noise }, v, m[0], l, i === words.length - 1, at);
        });
        t += l.text.length / cps + 0.7;
      }
      return wavBase64(await ctx.startRendering());
    },
  };
}

/** Plays a cue's generated music into an OfflineAudioContext. */
async function renderOffline(cue: MusicCue, seconds: number, seed: number): Promise<{ buf: AudioBuffer; notes: number }> {
  const rate = 44100;
  const ctx = new OfflineAudioContext(2, Math.ceil(rate * seconds), rate);
  const band = new Ensemble(ctx);
  const bus = ctx.createGain();
  bus.gain.value = 0.6 * 0.55; // default music volume through the music bus
  band.output.connect(bus);
  bus.connect(ctx.destination);
  const composer = composeCue(cue, seed);
  let t = 0.05;
  while (t < seconds) {
    const bar = composer.next();
    band.play(bar, t, seconds);
    t += bar.len;
  }
  return { buf: await ctx.startRendering(), notes: band.struck };
}

/** A 16-bit stereo WAV file (base64) of a render, normalized for listening. */
function wavBase64(buf: AudioBuffer): string {
  const chans = [buf.getChannelData(0), buf.getChannelData(buf.numberOfChannels > 1 ? 1 : 0)];
  let peak = 1e-6;
  for (const d of chans) for (const v of d) peak = Math.max(peak, Math.abs(v));
  const gain = 0.89 / peak;
  const n = buf.length;
  const view = new DataView(new ArrayBuffer(44 + n * 4));
  const text = (o: number, t: string): void => [...t].forEach((c, i) => view.setUint8(o + i, c.charCodeAt(0)));
  text(0, 'RIFF');
  view.setUint32(4, 36 + n * 4, true);
  text(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, buf.sampleRate, true);
  view.setUint32(28, buf.sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  text(36, 'data');
  view.setUint32(40, n * 4, true);
  for (let i = 0; i < n; i++)
    for (let c = 0; c < 2; c++) view.setInt16(44 + i * 4 + c * 2, Math.round(Math.max(-1, Math.min(1, chans[c]![i]! * gain)) * 32767), true);
  const bytes = new Uint8Array(view.buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
