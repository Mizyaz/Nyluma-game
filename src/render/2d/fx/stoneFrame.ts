import type * as Phaser from 'phaser';
import { DEPTH, VIEW_H, VIEW_W } from '../../../engine/constants';
import { paintScreenFrame } from '../../../content/art/painting1';
import { hashSeed, Rng } from '../svg';
import { artCanvas, registerCanvas, unregister } from '../TextureFactory';

/** Raster resolution of the frame (it is thin and soft). */
const RES = 0.5;
/** Thickness of the band at the screen's edges, design px. */
const THICK = 12;
const KEY = 'fx:stoneframe';

/**
 * A thin border of cracked stone round the screen, like the painting's own
 * frame (chapter I). It is drawn in the world scene under the page's HUD and
 * touch controls, and keeps its size on screen whatever the camera's zoom.
 */
export class StoneFrame {
  private readonly img: Phaser.GameObjects.Image;

  constructor(private readonly scene: Phaser.Scene) {
    const [c, ctx] = artCanvas(Math.ceil(VIEW_W * RES), Math.ceil(VIEW_H * RES));
    ctx.scale(RES, RES);
    paintScreenFrame(ctx, VIEW_W, VIEW_H, THICK, new Rng(hashSeed(KEY)));
    registerCanvas(scene.textures, KEY, c, { w: VIEW_W, h: VIEW_H, px: 0, py: 0 }, RES);
    this.img = scene.add.image(VIEW_W / 2, VIEW_H / 2, KEY).setScrollFactor(0).setDepth(DEPTH.overlay).setAlpha(0);
    this.update();
  }

  /** Fades the frame in (or out) over `ms`. */
  show(on: boolean, ms: number): void {
    this.scene.tweens.killTweensOf(this.img);
    if (ms <= 0) this.img.setAlpha(on ? 1 : 0);
    else this.scene.tweens.add({ targets: this.img, alpha: on ? 1 : 0, duration: ms });
  }

  /** Keeps it screen-sized under the camera's zoom (call every frame). */
  update(): void {
    this.img.setScale(1 / (RES * this.scene.cameras.main.zoom));
  }

  destroy(): void {
    this.img.destroy();
    unregister(this.scene.textures, KEY);
  }
}
