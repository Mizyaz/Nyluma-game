import * as Phaser from 'phaser';
import { app } from '../../../engine/App';
import { DEPTH } from '../../../engine/constants';
import { HUE_STEPS } from '../fxArt';
import { planesOf } from '../../../paper/planes';

// Colour bursts. `burst()` sheds crystals in random colours around a point
// (the Rezonans moves). The bombardment comes by itself now and then: the
// view fills with colour clouds and a colour wave (DOM, see ui/ColorStorm),
// and crystals in every colour rain and spray through the room. Colours are
// painted into the textures (`fx.hues`), so they show in both renderers.

const DOTS = Array.from({ length: HUE_STEPS }, (_, i) => `d${i}`);
const SHARDS = Array.from({ length: HUE_STEPS }, (_, i) => `s${i}`);

/**
 * `?bursts=0` turns the bombardment off (reference screenshots), `?bursts=fast`
 * brings one every few seconds (tests); otherwise it comes now and then.
 */
export type BurstMode = 'off' | 'normal' | 'fast';

export function burstMode(param: string | null): BurstMode {
  return param === '0' || param === 'off' ? 'off' : param === 'fast' ? 'fast' : 'normal';
}

export interface BombardHost {
  /** True while a bombardment must wait (cutscene, dialogue, menus…). */
  busy(): boolean;
  /** Called when a bombardment starts (Gorti reacts). */
  onStorm(): void;
}

export class ColorBursts {
  private readonly sparks: Phaser.GameObjects.Particles.ParticleEmitter;
  private readonly rain: Phaser.GameObjects.Particles.ParticleEmitter;
  private readonly reduced: boolean;
  private next: number;
  private storm = 0;
  private stormLeft = 0;
  /** Bombardments since the room started (for tests and tools). */
  count = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly host: BombardHost,
    private readonly mode: BurstMode = 'normal',
  ) {
    this.reduced = app.settings.reducedMotion;
    this.sparks = scene.add.particles(0, 0, 'fx.hues', {
      frame: [...DOTS, ...SHARDS],
      lifespan: { min: 650, max: 1300 },
      speed: { min: 90, max: 360 },
      angle: { min: 0, max: 360 },
      gravityY: 380,
      scale: { start: 0.9, end: 0.15 },
      alpha: { start: 1, end: 0 },
      rotate: { min: -180, max: 180 },
      // Opaque pastel confetti with ink contours: added light would wash
      // out to white on the pastel scenery.
      blendMode: Phaser.BlendModes.NORMAL,
      emitting: false,
    });
    this.sparks.setDepth(DEPTH.fx + 2);
    this.rain = scene.add.particles(0, 0, 'fx.hues', {
      frame: [...SHARDS, ...DOTS],
      lifespan: { min: 1400, max: 2400 },
      speedX: { min: -140, max: 140 },
      speedY: { min: 40, max: 260 },
      gravityY: 240,
      scale: { min: 0.6, max: 1.5 },
      alpha: { start: 1, end: 0 },
      rotate: { min: -180, max: 180 },
      // Opaque pastel confetti with ink contours: added light would wash
      // out to white on the pastel scenery.
      blendMode: Phaser.BlendModes.NORMAL,
      emitting: false,
    });
    this.rain.setDepth(DEPTH.front + 1);
    // The first one comes a little while after arriving.
    this.next = this.mode === 'fast' ? 2 : this.interval() * 0.6;
  }

  /** Seconds until the next bombardment. */
  private interval(): number {
    if (this.mode === 'fast') return 6;
    return this.reduced ? 70 + Math.random() * 50 : 32 + Math.random() * 38;
  }

  /** A handful of crystals in random colours flying out from a point. */
  burst(x: number, y: number, n: number): void {
    // The sparks stay in the actors' plane: from there they fly out where they were sent off.
    const at = planesOf(this.scene)?.toMain(x, y) ?? { x, y };
    this.sparks.emitParticleAt(at.x, at.y, this.reduced ? Math.ceil(n / 2) : n);
  }

  /** Starts a bombardment now. */
  bombard(): void {
    const cam = this.scene.cameras.main;
    const v = cam.worldView;
    this.storm = app.ui.colorStorm.burst(this.reduced) / 1000;
    this.stormLeft = this.storm;
    this.count++;
    this.next = this.interval();
    // A few spray points across the view, then rain from above.
    const points = this.reduced ? 3 : 7;
    for (let i = 0; i < points; i++) {
      this.scene.time.delayedCall(i * 180, () => {
        const x = v.x + v.width * (0.1 + Math.random() * 0.8);
        const y = v.y + v.height * (0.15 + Math.random() * 0.6);
        this.burst(x, y, this.reduced ? 10 : 16);
      });
    }
    const chimes = [1, 1.26, 1.5, 2];
    chimes.forEach((p, i) => this.scene.time.delayedCall(i * 140, () => app.audio.sfx('bloom', { pitch: p * (0.8 + Math.random() * 0.4), vol: 0.8 })));
    this.scene.time.delayedCall(260, () => app.audio.sfx('crystal', { pitch: 1.3 }));
    this.host.onStorm();
  }

  update(dtMs: number): void {
    const dt = dtMs / 1000;
    if (this.stormLeft > 0) {
      this.stormLeft -= dt;
      // Rain over the top edge of the view while the storm lasts.
      const v = this.scene.cameras.main.worldView;
      if (Math.random() < (this.reduced ? 0.25 : 0.7)) this.rain.emitParticleAt(v.x + Math.random() * v.width, v.y - 20, 1);
    }
    if (this.mode === 'off' || this.host.busy()) return;
    this.next -= dt;
    if (this.next <= 0) this.bombard();
  }

  /** Freezes the crystals in the air while the game is paused. */
  setPaused(on: boolean): void {
    for (const e of [this.sparks, this.rain]) {
      if (on) e.pause();
      else e.resume();
    }
  }

  /** The bombardment in progress (0 when none), for tests. */
  get active(): boolean {
    return this.stormLeft > 0;
  }

  destroy(): void {
    this.sparks.destroy();
    this.rain.destroy();
  }
}
