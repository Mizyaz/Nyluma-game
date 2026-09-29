import * as Phaser from 'phaser';
import { frameRef, hasFrame } from '../art/TextureFactory';
import { hex, P } from '../art/palette';
import type { ThemeId } from '../data/roomTypes';
import { DEPTH, VIEW_H, VIEW_W } from '../constants';

// Crystal effects that give the world depth: a "warping tube" of crystals
// streaming out of a vanishing point behind each room, crystals sprouting
// under Gorti's steps, and the full-screen tunnel used between chapters.

export interface WarpLook {
  count: number;
  alpha: number;
  /** Depth units per second (1 = the whole tube in one second). */
  speed: number;
  colors: number[];
}

const CRYSTALS = [hex(P.crystalBlue), hex(P.crystalTeal), hex(P.crystalOrange), hex(P.violet)];

/** Background tube per theme: stronger underground, a faint stream outdoors. */
export function warpLook(theme: ThemeId): WarpLook {
  switch (theme) {
    case 'nursery':
    case 'roots':
    case 'chamber':
      return { count: 38, alpha: 0.55, speed: 0.07, colors: CRYSTALS };
    case 'surface':
    case 'hill':
    case 'forest':
      return { count: 26, alpha: 0.32, speed: 0.05, colors: [hex(P.crystalBlue), hex(P.violet), hex('#d7b3ff')] };
    case 'ride':
      return { count: 34, alpha: 0.38, speed: 0.16, colors: [hex(P.crystalOrange), hex('#f3b6c9'), hex(P.crystalTeal)] };
    case 'sun':
      return { count: 28, alpha: 0.34, speed: 0.06, colors: [hex(P.crystalOrange), hex('#f0c46a'), hex(P.violet)] };
    case 'clearing':
      return { count: 22, alpha: 0.24, speed: 0.045, colors: [hex('#c7ccde'), hex(P.crystalTeal)] };
    case 'dorm':
      return { count: 30, alpha: 0.4, speed: 0.06, colors: [hex(P.crystalOrange), hex(P.crystalTeal), hex('#f0b458')] };
    case 'mech':
      return { count: 30, alpha: 0.4, speed: 0.07, colors: [hex('#9aa3b8'), hex(P.crystalBlue), hex(P.violet)] };
    case 'office':
      return { count: 18, alpha: 0.16, speed: 0.035, colors: [hex('#c9c1b0'), hex(P.violet)] };
    default:
      return { count: 26, alpha: 0.35, speed: 0.06, colors: CRYSTALS };
  }
}

interface Shard {
  img: Phaser.GameObjects.Image;
  a: number;
  r: number;
  z: number;
  spin: number;
  rot: number;
}

/**
 * The warping tube: shards fly out of a vanishing point along a tunnel that
 * slowly twists and bends, growing as they approach. Screen-space layer.
 */
export class CrystalWarp {
  private items: Shard[] = [];
  private t = Math.random() * 100;
  speed: number;
  alpha: number;
  /** Tube radius multiplier (transitions open it wide). */
  spread = 1;
  cx = VIEW_W / 2;
  cy = VIEW_H * 0.42;

  constructor(
    scene: Phaser.Scene,
    look: WarpLook,
    depth: number,
    additive = true,
  ) {
    this.speed = look.speed;
    this.alpha = look.alpha;
    if (!hasFrame('fx.crystal')) return;
    const f = frameRef('fx.crystal');
    for (let i = 0; i < look.count; i++) {
      const img = scene.add.image(0, 0, f.atlas, f.frame).setOrigin(0.5, 0.6).setScrollFactor(0).setDepth(depth);
      img.setTint(look.colors[i % look.colors.length]!);
      if (additive) img.setBlendMode(Phaser.BlendModes.ADD);
      this.items.push({ img, a: Math.random() * Math.PI * 2, r: 0.55 + Math.random() * 0.8, z: Math.random(), spin: (Math.random() - 0.5) * 3, rot: Math.random() * 6 });
    }
  }

  update(dtMs: number): void {
    const dt = Math.min(dtMs, 100) / 1000;
    this.t += dt;
    const bendX = Math.sin(this.t * 0.23) * 150;
    const bendY = Math.cos(this.t * 0.17) * 70;
    for (const it of this.items) {
      it.z -= this.speed * dt;
      if (it.z <= 0.03) {
        it.z = 1;
        it.a = Math.random() * Math.PI * 2;
        it.r = 0.55 + Math.random() * 0.8;
      }
      const persp = 1 / (it.z * 4 + 0.18);
      const ang = it.a + this.t * 0.3 + (1 - it.z) * 2.4;
      const rad = it.r * 150 * persp * this.spread;
      const far = it.z * it.z;
      it.rot += it.spin * dt;
      it.img.setPosition(this.cx + Math.cos(ang) * rad + bendX * far, this.cy + Math.sin(ang) * rad * 0.78 + bendY * far);
      it.img.setRotation(ang + Math.PI / 2 + it.rot * 0.25);
      const sc = 0.15 * persp;
      it.img.setScale(sc * 0.75, sc);
      const fade = Math.min(1, (1 - it.z) * 4) * Math.min(1, it.z * 7);
      it.img.setAlpha(this.alpha * fade);
    }
  }

  setVisible(v: boolean): void {
    for (const it of this.items) it.img.setVisible(v);
  }

  destroy(): void {
    for (const it of this.items) it.img.destroy();
    this.items = [];
  }
}

/**
 * Footstep crystals: small shards sprout from the surface under each step
 * (at a random depth across the 2.5D top face) and melt back; a flattened
 * ripple ring spreads on the ground. Pooled.
 */
export class StepCrystals {
  private shards: Phaser.GameObjects.Image[] = [];
  private rings: Phaser.GameObjects.Image[] = [];
  private nextShard = 0;
  private nextRing = 0;

  constructor(
    private scene: Phaser.Scene,
    private colors: number[],
    size = 18,
  ) {
    if (!hasFrame('fx.crystal') || !hasFrame('fx.ring')) return;
    const f = frameRef('fx.crystal');
    const r = frameRef('fx.ring');
    for (let i = 0; i < size; i++) {
      this.shards.push(scene.add.image(0, 0, f.atlas, f.frame).setOrigin(0.5, 0.97).setVisible(false));
    }
    for (let i = 0; i < 6; i++) {
      this.rings.push(scene.add.image(0, 0, r.atlas, r.frame).setBlendMode(Phaser.BlendModes.ADD).setVisible(false).setDepth(DEPTH.terrain + 3));
    }
  }

  private sprout(x: number, y: number, size: number, lean: number, delay: number): void {
    if (!this.shards.length) return;
    const img = this.shards[this.nextShard]!;
    this.nextShard = (this.nextShard + 1) % this.shards.length;
    this.scene.tweens.killTweensOf(img);
    // Behind the feet when on the far half of the surface, in front otherwise.
    const depthSide = y < 0 ? DEPTH.player - 1 : DEPTH.player + 1;
    const tint = this.colors[Math.floor(Math.random() * this.colors.length)]!;
    img.setPosition(x, y).setRotation(lean).setTint(tint).setDepth(depthSide).setVisible(true).setAlpha(0.95).setScale(size * 0.8, 0.01);
    this.scene.tweens.add({ targets: img, scaleY: size, duration: 110, delay, ease: 'Back.easeOut' });
    this.scene.tweens.add({
      targets: img,
      scaleY: 0.01,
      alpha: 0,
      duration: 380,
      delay: delay + 240,
      ease: 'Cubic.easeIn',
      onComplete: () => img.setVisible(false),
    });
  }

  private ring(x: number, y: number, size: number): void {
    if (!this.rings.length) return;
    const img = this.rings[this.nextRing]!;
    this.nextRing = (this.nextRing + 1) % this.rings.length;
    this.scene.tweens.killTweensOf(img);
    const tint = this.colors[Math.floor(Math.random() * this.colors.length)]!;
    img.setPosition(x, y).setTint(tint).setVisible(true).setAlpha(0.55).setScale(0.08 * size, 0.022 * size);
    this.scene.tweens.add({
      targets: img,
      scaleX: 0.42 * size,
      scaleY: 0.11 * size,
      alpha: 0,
      duration: 520,
      ease: 'Cubic.easeOut',
      onComplete: () => img.setVisible(false),
    });
  }

  step(x: number, y: number): void {
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const dx = (Math.random() - 0.5) * 30;
      const dz = (Math.random() - 0.5) * 12;
      const depthScale = 1 - dz / 40;
      this.sprout(x + dx, y + dz, (0.12 + Math.random() * 0.1) * depthScale, (Math.random() - 0.5) * 0.7, i * 40);
    }
    this.ring(x, y + 1, 1);
  }

  land(x: number, y: number, strength: number): void {
    const n = 4 + Math.round(4 * strength);
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      const dx = side * (8 + Math.random() * 34 * (0.6 + strength));
      const dz = (Math.random() - 0.5) * 14;
      this.sprout(x + dx, y + dz, (0.16 + Math.random() * 0.14) * (0.8 + strength * 0.5), side * (0.25 + Math.random() * 0.4), Math.abs(dx) * 1.2);
    }
    this.ring(x, y + 1, 1.3 + strength);
  }

  destroy(): void {
    for (const s of this.shards) s.destroy();
    for (const r of this.rings) r.destroy();
    this.shards = [];
    this.rings = [];
  }
}
