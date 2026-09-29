import * as Phaser from 'phaser';
import { app } from '../App';
import { frameRef } from '../art/TextureFactory';
import { VIEW_H, VIEW_W } from '../constants';
import { CrystalWarp, type WarpLook } from '../fx/crystalFx';

export interface WarpData {
  /** Called once, at the opaque peak: swap rooms/scenes here. */
  onPeak: () => void;
  /** 1 = chapter change (long, dense); smaller = room change. */
  strength?: number;
  look?: WarpLook;
}

/**
 * Crystal-tunnel transition drawn above every other scene. The tunnel
 * accelerates toward the viewer, a veil closes at the peak (where the caller
 * swaps what is underneath), then the tunnel decelerates and opens up.
 */
export class WarpScene extends Phaser.Scene {
  private data0!: WarpData;
  private warp!: CrystalWarp;
  private veil!: Phaser.GameObjects.Rectangle;
  private core!: Phaser.GameObjects.Image;
  private t = 0;
  private dur = 1.6;
  private peaked = false;

  constructor() {
    super('warp');
  }

  init(data: WarpData): void {
    this.data0 = data;
    this.t = 0;
    this.peaked = false;
  }

  create(): void {
    this.scene.bringToTop();
    const s = Math.max(0.2, Math.min(1, this.data0.strength ?? 1));
    const reduced = app.settings.reducedMotion;
    this.dur = reduced ? 0.9 : 0.9 + 0.9 * s;
    // A filled shape (not a tinted sprite) so the veil is dark in every renderer.
    this.veil = this.add.rectangle(VIEW_W / 2, VIEW_H / 2, VIEW_W * 1.2, VIEW_H * 1.2, 0x0f0d18, 1).setAlpha(0);
    const look: WarpLook = this.data0.look ?? { count: 60, alpha: 1, speed: 0.3, colors: [0x548cd6, 0x53bfaf, 0xef9a47, 0x9459d8] };
    this.warp = new CrystalWarp(this, { ...look, count: reduced ? 20 : Math.round(40 + 70 * s), alpha: 1 }, 5);
    this.warp.cy = VIEW_H / 2;
    const g = frameRef('fx.glow');
    this.core = this.add.image(VIEW_W / 2, VIEW_H / 2, g.atlas, g.frame).setBlendMode(Phaser.BlendModes.ADD).setTint(0xd7b3ff).setAlpha(0).setDepth(6);
    app.audio.sfx('whoosh', { vol: 0.5 + 0.4 * s });
  }

  override update(_time: number, delta: number): void {
    this.t += delta / 1000;
    const u = Math.min(1, this.t / this.dur);
    const reduced = app.settings.reducedMotion;
    const s = this.data0.strength ?? 1;
    // Speed rises to the peak and falls away; the tube opens at the peak.
    const pulse = Math.sin(Math.PI * u);
    this.warp.speed = reduced ? 0.25 : 0.25 + (1.6 + 1.6 * s) * pulse * pulse;
    this.warp.spread = 0.7 + 1.1 * pulse;
    this.warp.update(delta);
    const ease = (v: number): number => v * v * (3 - 2 * v);
    const veil = u < 0.42 ? ease(u / 0.42) : u > 0.6 ? 1 - ease((u - 0.6) / 0.4) : 1;
    this.veil.setAlpha(veil);
    this.core.setAlpha(0.55 * pulse).setScale(1 + 5 * pulse * pulse);
    if (!this.peaked && u >= 0.5) {
      this.peaked = true;
      this.data0.onPeak();
    }
    if (u >= 1) {
      this.warp.destroy();
      this.scene.stop();
    }
  }
}
