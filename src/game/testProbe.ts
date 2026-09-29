import { app } from './App';
import type { WorldScene } from './scenes/WorldScene';
import { Composer, MOODS, Piano, type MusicCue } from '../music';

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
        view: active
          ? (({ x, y, width, height }) => ({ x, y, w: width, h: height }))(world.cameras.main.worldView)
          : null,
      };
    },
    /**
     * Renders `seconds` of the generated piano for a cue offline at the
     * default music volume and reports the mix's peak and RMS level.
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
      const chans = [buf.getChannelData(0), buf.getChannelData(1)];
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
    },
  };
}

/** Plays a cue's generated piano into an OfflineAudioContext. */
async function renderOffline(cue: MusicCue, seconds: number, seed: number): Promise<{ buf: AudioBuffer; notes: number }> {
  const rate = 44100;
  const ctx = new OfflineAudioContext(2, Math.ceil(rate * seconds), rate);
  const piano = new Piano(ctx);
  const bus = ctx.createGain();
  bus.gain.value = 0.6 * 0.55; // default music volume through the music bus
  piano.output.connect(bus);
  bus.connect(ctx.destination);
  const composer = new Composer(MOODS[cue], seed);
  let t = 0.05;
  while (t < seconds) {
    const bar = composer.next();
    for (const e of bar.notes) if (t + e.t < seconds) piano.note(t + e.t, e.midi, e.vel, t + e.off);
    t += bar.len;
  }
  return { buf: await ctx.startRendering(), notes: piano.struck };
}
