import * as Phaser from 'phaser';
import { app } from '../App';
import { VIEW_H, VIEW_W } from '../constants';
import { CrystalWarp, type WarpLook } from '../fx/crystalFx';
import { GemArt } from '../fx/gemArt';

export interface WarpData {
  /** Called once, at the opaque peak: swap rooms/scenes here. */
  onPeak: () => void;
  /** 1 = chapter change (long, dense); smaller = room change. */
  strength?: number;
  look?: WarpLook;
}

const DEFAULT_LOOK: WarpLook = { count: 60, alpha: 1, speed: 0.3, colors: [0x548cd6, 0x53bfaf, 0xef9a47, 0x9459d8] };
const PAPER = 0xf2ecf6;
/** Shortest fade: nothing on screen changes faster than this (seconds). */
const MIN_FADE = 0.34;
/** Gems per frame of the full-screen tunnel. */
const PER_FRAME = 16;
/** Levels the tunnel is pulled back into the distance when it starts and ends. */
const RECEDE = 3;
/** On-screen size of the face at the end of the tunnel. */
const FACE_PX = VIEW_H * 0.62;

/** 0 before `a`, 1 after `b`, smooth in between. */
function ramp(t: number, a: number, b: number): number {
  const v = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return v * v * (3 - 2 * v);
}

/**
 * Gem-tunnel transition drawn above every other scene. The tunnel fills the
 * screen and speeds toward the viewer while pastel paper closes behind it
 * (the caller swaps what is underneath at the peak); a painted face looks
 * out of its far end around the peak, then everything slows and opens up.
 */
export class WarpScene extends Phaser.Scene {
  private data0!: WarpData;
  private warp!: CrystalWarp;
  private veil!: Phaser.GameObjects.Rectangle;
  private face!: Phaser.GameObjects.Image;
  private faceScale = 1;
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
    const look = this.data0.look ?? DEFAULT_LOOK;
    // A filled shape (not a tinted sprite) so the paper shows in every renderer.
    this.veil = this.add.rectangle(VIEW_W / 2, VIEW_H / 2, VIEW_W * 1.2, VIEW_H * 1.2, look.paper ?? PAPER, 1).setAlpha(0);
    const art = GemArt.ensure(this);
    this.face = this.add.image(VIEW_W / 2, VIEW_H / 2, GemArt.KEY, art.face).setAlpha(0).setDepth(4);
    this.faceScale = FACE_PX / art.faceSize;
    // Full screen: denser than a room's background tunnel, and faster.
    const frames = reduced ? 5 : 5 + Math.round(2 * s);
    this.warp = new CrystalWarp(this, { ...look, count: frames * PER_FRAME, perRing: PER_FRAME, size: 1.05, ribs: 1, brushed: true, brief: true, alpha: 0 }, 5);
    this.warp.cy = VIEW_H / 2;
    app.audio.sfx('whoosh', { vol: 0.5 + 0.4 * s });
  }

  override update(_time: number, delta: number): void {
    this.t += delta / 1000;
    const d = this.dur;
    const t = this.t;
    const u = Math.min(1, t / d);
    const reduced = app.settings.reducedMotion;
    const s = this.data0.strength ?? 1;
    // Speed rises to the peak and falls away; the tunnel opens at the peak.
    const pulse = Math.sin(Math.PI * u);
    this.warp.speed = reduced ? 0.1 : 0.12 + (0.3 + 0.35 * s) * pulse * pulse;
    this.warp.spread = reduced ? 2.5 : 2.3 + 0.6 * pulse;
    // The tunnel grows out of its vanishing point while the paper comes in,
    // holds through the peak, then pulls back into the distance and goes.
    const fadeIn = ramp(t, 0, Math.max(MIN_FADE, 0.3 * d));
    const fadeOut = ramp(t, 0.6 * d, d);
    this.warp.alpha = fadeIn * (1 - fadeOut);
    this.warp.recede = RECEDE * (1 - ramp(t, 0, Math.max(MIN_FADE, 0.4 * d)) + fadeOut);
    this.veil.setAlpha(ramp(t, 0, 0.42 * d) * (1 - fadeOut));
    // The face looks out of the far end around the peak.
    const fade = Math.max(MIN_FADE, 0.2 * d);
    const faceIn = 0.44 * d - fade;
    const faceOut = 0.56 * d;
    const faceA = ramp(t, faceIn, faceIn + fade) * (1 - ramp(t, faceOut, faceOut + fade));
    const approach = ramp(t, faceIn, faceOut + fade);
    this.face.setAlpha(faceA).setScale(this.faceScale * (reduced ? 1 : 0.85 + 0.25 * approach));
    this.warp.core = FACE_PX * 0.45 * faceA;
    this.warp.update(delta);
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
