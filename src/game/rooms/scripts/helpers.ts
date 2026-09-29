import * as Phaser from 'phaser';
import { DEPTH } from '../../constants';
import { hex, P } from '../../art/palette';
import { frameRef, hasFrame } from '../../art/TextureFactory';
import type { WorldScene } from '../../scenes/WorldScene';

/** Adds an art frame as a plain image (props, markers) with sane origin/scale. */
export function addArt(w: WorldScene, key: string, x: number, y: number, depth: number = DEPTH.props, ox?: number, oy?: number): Phaser.GameObjects.Image | null {
  if (!hasFrame(key)) return null;
  const f = frameRef(key);
  return w.add
    .image(x, y, f.atlas, f.frame)
    .setOrigin(ox ?? f.px / f.w, oy ?? f.py / f.h)
    .setScale(1 / f.scale)
    .setDepth(depth);
}

export function addGlow(w: WorldScene, x: number, y: number, color: string, scale: number, alpha: number, depth: number = DEPTH.fx): Phaser.GameObjects.Image {
  const f = frameRef('fx.glow');
  return w.add.image(x, y, f.atlas, f.frame).setBlendMode(Phaser.BlendModes.ADD).setTint(hex(color)).setScale(scale).setAlpha(alpha).setDepth(depth);
}

/** A ring gauge drawn around a point (knot stabilisation, holds). */
export class RingGauge {
  private g: Phaser.GameObjects.Graphics;
  constructor(w: WorldScene, private color = 0xd7b3ff) {
    this.g = w.add.graphics().setDepth(DEPTH.fx);
  }
  draw(x: number, y: number, r: number, frac: number, visible: boolean): void {
    const g = this.g;
    g.clear();
    if (!visible) return;
    g.lineStyle(7, 0x191728, 0.85);
    g.strokeCircle(x, y, r);
    g.lineStyle(4, this.color, 0.95);
    g.beginPath();
    g.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0.001, frac), false);
    g.strokePath();
  }
  destroy(): void {
    this.g.destroy();
  }
}

/** Violet flower growth used when the world answers Gorti. */
export function bloomAt(w: WorldScene, x: number, y: number, n = 6): void {
  for (let i = 0; i < n; i++) {
    const key = hasFrame('fx.petal') ? 'fx.petal' : 'fx.dot';
    const f = frameRef(key);
    const im = w.add.image(x + (Math.random() - 0.5) * 60, y - Math.random() * 10, f.atlas, f.frame).setDepth(DEPTH.props + 1);
    im.setTint(Phaser.Math.RND.pick([hex(P.ivory), hex(P.vein), hex('#f3b6c9'), hex(P.crystalTealLight)]));
    im.setScale(0);
    w.tweens.add({ targets: im, scale: 0.9 + Math.random() * 0.5, duration: 400 + Math.random() * 300, ease: 'Back.easeOut' });
  }
}
