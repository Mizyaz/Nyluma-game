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
  /** Shards per ring of the tube. */
  perRing?: number;
  /** Shard size multiplier. */
  size?: number;
  /** Opacity of the glowing ribs that outline each ring (0 = none). */
  ribs?: number;
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
      return { count: 49, perRing: 7, size: 1.25, ribs: 0.3, alpha: 0.5, speed: 0.07, colors: CRYSTALS };
    case 'surface':
    case 'hill':
    case 'forest':
      return { count: 36, perRing: 6, size: 1.2, ribs: 0.25, alpha: 0.32, speed: 0.05, colors: [hex(P.crystalBlue), hex(P.violet), hex('#d7b3ff')] };
    case 'ride':
      return { count: 49, perRing: 7, size: 1.2, ribs: 0.25, alpha: 0.36, speed: 0.16, colors: [hex(P.crystalOrange), hex('#f3b6c9'), hex(P.crystalTeal)] };
    case 'sun':
      return { count: 36, perRing: 6, size: 1.2, ribs: 0.22, alpha: 0.3, speed: 0.06, colors: [hex(P.crystalOrange), hex('#f0c46a'), hex(P.violet)] };
    case 'clearing':
      return { count: 30, perRing: 6, size: 1.1, ribs: 0.2, alpha: 0.24, speed: 0.045, colors: [hex('#c7ccde'), hex(P.crystalTeal)] };
    case 'dorm':
      return { count: 42, perRing: 7, size: 1.2, ribs: 0.25, alpha: 0.38, speed: 0.06, colors: [hex(P.crystalOrange), hex(P.crystalTeal), hex('#f0b458')] };
    case 'mech':
      return { count: 42, perRing: 7, size: 1.2, ribs: 0.25, alpha: 0.38, speed: 0.07, colors: [hex('#9aa3b8'), hex(P.crystalBlue), hex(P.violet)] };
    case 'office':
      return { count: 24, perRing: 6, size: 1, ribs: 0.15, alpha: 0.16, speed: 0.035, colors: [hex('#c9c1b0'), hex(P.violet)] };
    default:
      return { count: 36, perRing: 6, size: 1.2, ribs: 0.25, alpha: 0.32, speed: 0.06, colors: CRYSTALS };
  }
}

interface Shard {
  img: Phaser.GameObjects.Image;
  ring: number;
  slot: number;
  /** Small per-shard offsets so the rings do not look machined. */
  da: number;
  dr: number;
  len: number;
}

/**
 * The warping tube: rings of glowing shards travel out of a vanishing point
 * toward the viewer, twisting as they come, while the far end of the tube
 * slowly bends. Screen-space layer.
 */
export class CrystalWarp {
  private items: Shard[] = [];
  private ribs: Phaser.GameObjects.Graphics | null = null;
  private t = Math.random() * 100;
  private phase = Math.random();
  private rings = 1;
  private perRing = 1;
  private size: number;
  private ribAlpha: number;
  private colors: number[];
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
    this.size = look.size ?? 1;
    // The ribs are cheap on the GPU but cost more than the rest of a frame in
    // the Canvas fallback renderer, where the shards alone draw the tube.
    this.ribAlpha = scene.game.renderer.type === Phaser.WEBGL ? look.ribs ?? 0 : 0;
    this.colors = look.colors;
    const key = hasFrame('fx.shard') ? 'fx.shard' : 'fx.crystal';
    if (!hasFrame(key)) return;
    const f = frameRef(key);
    this.perRing = look.perRing ?? 7;
    this.rings = Math.max(3, Math.round(look.count / this.perRing));
    if (this.ribAlpha > 0) {
      this.ribs = scene.add.graphics().setScrollFactor(0).setDepth(depth - 0.5);
      if (additive) this.ribs.setBlendMode(Phaser.BlendModes.ADD);
    }
    for (let r = 0; r < this.rings; r++) {
      for (let j = 0; j < this.perRing; j++) {
        const img = scene.add.image(0, 0, f.atlas, f.frame).setScrollFactor(0).setDepth(depth);
        img.setTint(look.colors[(r + j) % look.colors.length]!);
        if (additive) img.setBlendMode(Phaser.BlendModes.ADD);
        this.items.push({ img, ring: r, slot: j, da: (Math.random() - 0.5) * 0.4, dr: 0.85 + Math.random() * 0.3, len: 0.75 + Math.random() * 0.6 });
      }
    }
  }

  update(dtMs: number): void {
    const dt = Math.min(dtMs, 100) / 1000;
    this.t += dt;
    this.phase = (this.phase + this.speed * dt) % 1;
    const bendX = Math.sin(this.t * 0.23) * 150;
    const bendY = Math.cos(this.t * 0.17) * 70;
    const step = (Math.PI * 2) / this.perRing;
    // Depth 1 = the vanishing point, 0 = at the viewer.
    const depthOf = (ring: number): number => 1 - ((this.phase + ring / this.rings) % 1);
    const fadeOf = (z: number): number => Math.min(1, (1 - z) * 4) * Math.min(1, z * 7);
    for (const it of this.items) {
      const z = depthOf(it.ring);
      const persp = 1 / (z * 4 + 0.18);
      const ang = it.slot * step + it.ring * 0.45 + this.t * 0.3 + (1 - z) * 2.4 + it.da;
      const rad = it.dr * 150 * persp * this.spread;
      const far = z * z;
      it.img.setPosition(this.cx + Math.cos(ang) * rad + bendX * far, this.cy + Math.sin(ang) * rad * 0.78 + bendY * far);
      it.img.setRotation(ang + Math.PI / 2);
      const sc = 0.13 * persp * this.size;
      it.img.setScale(sc * 0.8, sc * it.len);
      it.img.setAlpha(this.alpha * fadeOf(z));
    }
    const g = this.ribs;
    if (!g) return;
    g.clear();
    for (let r = 0; r < this.rings; r++) {
      const z = depthOf(r);
      const a = this.alpha * this.ribAlpha * fadeOf(z);
      if (a < 0.01) continue;
      const persp = 1 / (z * 4 + 0.18);
      const rad = 150 * persp * this.spread;
      const far = z * z;
      g.lineStyle(Math.max(1, 2.4 * persp), this.colors[r % this.colors.length]!, a);
      g.strokeEllipse(this.cx + bendX * far, this.cy + bendY * far, rad * 2, rad * 2 * 0.78, rad > 260 ? 80 : 40);
    }
  }

  setVisible(v: boolean): void {
    for (const it of this.items) it.img.setVisible(v);
    this.ribs?.setVisible(v);
  }

  destroy(): void {
    for (const it of this.items) it.img.destroy();
    this.items = [];
    this.ribs?.destroy();
    this.ribs = null;
  }
}

/**
 * Footstep crystals: faceted shards sprout from the surface under each step
 * (at a random depth across the 2.5D top face), flash with a small glow at
 * their base and melt back; a flattened ripple ring spreads on the ground.
 * Landings raise a wider crown. Pooled.
 */
export class StepCrystals {
  private shards: Phaser.GameObjects.Image[] = [];
  private glows: Phaser.GameObjects.Image[] = [];
  private rings: Phaser.GameObjects.Image[] = [];
  private nextShard = 0;
  private nextRing = 0;

  constructor(
    private scene: Phaser.Scene,
    private colors: number[],
    size = 24,
  ) {
    if (!hasFrame('fx.crystal') || !hasFrame('fx.ring')) return;
    const f = frameRef('fx.crystal');
    const r = frameRef('fx.ring');
    const g = hasFrame('fx.glow') ? frameRef('fx.glow') : null;
    for (let i = 0; i < size; i++) {
      this.shards.push(scene.add.image(0, 0, f.atlas, f.frame).setOrigin(0.5, 0.97).setVisible(false));
      if (g) this.glows.push(scene.add.image(0, 0, g.atlas, g.frame).setBlendMode(Phaser.BlendModes.ADD).setVisible(false));
    }
    for (let i = 0; i < 6; i++) {
      this.rings.push(scene.add.image(0, 0, r.atlas, r.frame).setBlendMode(Phaser.BlendModes.ADD).setVisible(false).setDepth(DEPTH.terrain + 3));
    }
  }

  private sprout(x: number, y: number, size: number, lean: number, delay: number): void {
    if (!this.shards.length) return;
    const i = this.nextShard;
    const img = this.shards[i]!;
    const glow = this.glows[i];
    this.nextShard = (i + 1) % this.shards.length;
    this.scene.tweens.killTweensOf(img);
    // Behind the feet when on the far half of the surface, in front otherwise.
    const depthSide = y < 0 ? DEPTH.player - 1 : DEPTH.player + 1;
    const tint = this.colors[Math.floor(Math.random() * this.colors.length)]!;
    img.setPosition(x, y).setRotation(lean).setTint(tint).setDepth(depthSide).setVisible(true).setAlpha(1).setScale(size * 0.8, 0.01);
    this.scene.tweens.add({ targets: img, scaleY: size, duration: 120, delay, ease: 'Back.easeOut' });
    this.scene.tweens.add({
      targets: img,
      scaleY: 0.01,
      alpha: 0,
      duration: 420,
      delay: delay + 300,
      ease: 'Cubic.easeIn',
      onComplete: () => img.setVisible(false),
    });
    if (glow) {
      this.scene.tweens.killTweensOf(glow);
      glow.setPosition(x, y - 22 * size).setTint(tint).setDepth(depthSide + 0.5).setVisible(true).setAlpha(0).setScale(0.9 * size + 0.12);
      this.scene.tweens.add({ targets: glow, alpha: 0.85, duration: 110, delay, yoyo: true, hold: 160, ease: 'Sine.easeOut', onComplete: () => glow.setVisible(false) });
    }
  }

  private ring(x: number, y: number, size: number): void {
    if (!this.rings.length) return;
    const img = this.rings[this.nextRing]!;
    this.nextRing = (this.nextRing + 1) % this.rings.length;
    this.scene.tweens.killTweensOf(img);
    const tint = this.colors[Math.floor(Math.random() * this.colors.length)]!;
    img.setPosition(x, y).setTint(tint).setVisible(true).setAlpha(0.8).setScale(0.08 * size, 0.022 * size);
    this.scene.tweens.add({
      targets: img,
      scaleX: 0.5 * size,
      scaleY: 0.13 * size,
      alpha: 0,
      duration: 560,
      ease: 'Cubic.easeOut',
      onComplete: () => img.setVisible(false),
    });
  }

  step(x: number, y: number): void {
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const dx = (Math.random() - 0.5) * 34;
      const dz = (Math.random() - 0.5) * 12;
      const depthScale = 1 - dz / 40;
      this.sprout(x + dx, y + dz, (0.2 + Math.random() * 0.14) * depthScale, (Math.random() - 0.5) * 0.7, i * 45);
    }
    this.ring(x, y + 1, 1);
  }

  land(x: number, y: number, strength: number): void {
    const n = 5 + Math.round(5 * strength);
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      const dx = side * (10 + Math.random() * 40 * (0.6 + strength));
      const dz = (Math.random() - 0.5) * 14;
      this.sprout(x + dx, y + dz, (0.26 + Math.random() * 0.18) * (0.8 + strength * 0.5), side * (0.25 + Math.random() * 0.45), Math.abs(dx) * 1.2);
    }
    this.ring(x, y + 1, 1.4 + strength);
  }

  destroy(): void {
    for (const s of this.shards) s.destroy();
    for (const g of this.glows) g.destroy();
    for (const r of this.rings) r.destroy();
    this.shards = [];
    this.glows = [];
    this.rings = [];
  }
}
