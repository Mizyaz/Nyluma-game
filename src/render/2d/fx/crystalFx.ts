import * as Phaser from 'phaser';
import { app } from '../../../engine/App';
import { frameRef, hasFrame } from '../TextureFactory';
import { Rng } from '../svg';
import { DEPTH, VIEW_H, VIEW_W } from '../../../engine/constants';
import { GemArt, type GemHue } from './gemArt';
import { frameSlots, ZoomTunnel, type FrameSlot, type FrameSpec } from './tunnelLayout';
import { huesOf, type WarpLook } from './warpLook';

export { warpLook, type WarpLook } from './warpLook';

// Crystal effects that give the world depth: a tunnel of painted gem frames
// zooming out of a vanishing point behind each room (and full-screen between
// rooms), and crystals sprouting under Gorti's steps.

const smooth = (v: number): number => {
  const c = Math.min(1, Math.max(0, v));
  return c * c * (3 - 2 * c);
};

interface Piece {
  img: Phaser.GameObjects.Image;
  slot: FrameSlot;
  /** Texture pixels along the long axis (the slot's length maps onto them). */
  span: number;
  /** Width of a rib's painted line in texture pixels: ribs keep a thin line at any size (0 = scale uniformly). */
  line: number;
  /** Opacity relative to the frame's. */
  alpha: number;
}

/** One square frame of the tunnel: its side pieces and gems, moved as a unit. */
class TunnelFrame {
  private readonly pieces: Piece[] = [];
  private hidden = false;

  constructor(
    scene: Phaser.Scene,
    private readonly art: GemArt,
    slots: readonly FrameSlot[],
    hues: readonly GemHue[],
    rng: Rng,
    blend: Phaser.BlendModes,
    private readonly sideAlpha: number,
    private readonly brushed: boolean,
  ) {
    for (const slot of slots) {
      const img = scene.add.image(0, 0, GemArt.KEY, art.gem(hues[0]!, 0)).setScrollFactor(0).setBlendMode(blend);
      this.pieces.push({ img, slot, span: 1, line: 0, alpha: 1 });
    }
    this.renew(slots, hues, rng);
  }

  /**
   * A fresh arrangement (slots of the same kinds, in the same order) for the
   * same sprites, its gems painted in hues picked at random (repeats weigh
   * a hue), no two neighbours alike.
   */
  renew(slots: readonly FrameSlot[], hues: readonly GemHue[], rng: Rng): void {
    let prev: GemHue | null = null;
    this.pieces.forEach((p, i) => {
      const slot = slots[i]!;
      p.slot = slot;
      if (slot.kind === 'side') {
        const piece = this.art.side(slot.variant, this.brushed);
        p.img.setFrame(piece.frame).setOrigin(0.5, piece.lineY);
        p.span = piece.length;
        p.line = this.brushed ? 0 : piece.lineWidth;
        p.alpha = this.sideAlpha;
        return;
      }
      let hue = rng.pick(hues);
      for (let k = 0; k < 4 && hue === prev; k++) hue = rng.pick(hues);
      prev = hue;
      p.img.setFrame(this.art.gem(hue, slot.variant)).setOrigin(0.5, 0.5);
      p.span = this.art.gemLength(slot.variant);
      p.line = 0;
      p.alpha = 1;
    });
  }

  setDepth(depth: number): void {
    for (const p of this.pieces) p.img.setDepth(p.slot.kind === 'gem' ? depth + 0.001 : depth);
  }

  /** Centre, outer half-size and turn of the frame, its opacity, and screen pixels per unit (camera zoom). */
  place(x: number, y: number, size: number, turn: number, alpha: number, zoom: number): void {
    // Exactly 0 skips drawing: nearly invisible frames cost nothing.
    if (alpha < 0.004) {
      if (!this.hidden) for (const p of this.pieces) p.img.setAlpha(0);
      this.hidden = true;
      return;
    }
    this.hidden = false;
    const c = Math.cos(turn);
    const s = Math.sin(turn);
    // A rib's line gets a little thicker as its frame comes nearer.
    const ribPx = Math.min(3.4, 1 + size * zoom * 0.004) / zoom;
    for (const p of this.pieces) {
      const { slot } = p;
      const k = (size * slot.length) / p.span;
      p.img.setPosition(x + size * (slot.x * c - slot.y * s), y + size * (slot.x * s + slot.y * c));
      p.img.setRotation(turn + slot.angle);
      p.img.setScale(k, p.line > 0 ? ribPx / p.line : k);
      p.img.setAlpha(alpha * p.alpha);
    }
  }

  setVisible(v: boolean): void {
    for (const p of this.pieces) p.img.setVisible(v);
  }

  destroy(): void {
    for (const p of this.pieces) p.img.destroy();
    this.pieces.length = 0;
  }
}

/** Size ratio between neighbouring frames, and how much further each smaller one is turned. */
const RATIO = 0.66;
const TWIST = 0.09;
/** Half-size (screen pixels) of the nearest frame at spread 1. */
const OUTER = 490;
/**
 * Levels at the near end where frames are gone: they fade out before they
 * grow huge (they would mostly be off screen, and cost the most to draw).
 */
const NEAR_CUT = 0.45;
/** Slow turn of the whole tunnel (radians per second), the same way the twist turns it. */
const SPIN = -0.035;

/**
 * How much tunnel a renderer affords. Software Canvas pays for every
 * rotated sprite and every pixel it covers: no ribs or bands there, and
 * smaller gems, most of all behind the rooms, where the tunnel runs all the
 * time. WebGL draws all of it almost for free.
 */
interface Detail {
  /** Frames to leave out of the look's (each costs a dozen sprites). */
  fewerFrames: number;
  /** Gem size multiplier. */
  size: number;
  /** Ribs and bands along the sides. */
  sides: boolean;
}

const WEBGL_DETAIL: Detail = { fewerFrames: 0, size: 1, sides: true };
const CANVAS_BRIEF: Detail = { fewerFrames: 0, size: 0.85, sides: false };
const CANVAS_BACKGROUND: Detail = { fewerFrames: 1, size: 0.55, sides: false };

/**
 * The gem tunnel: square frames of painted gems, each turned a little
 * against its neighbours, stream out of a vanishing point toward the viewer
 * and slowly turn: a twisting, spiralling picture-in-a-picture.
 * Screen-space layer; camera zoom is compensated.
 */
export class CrystalWarp {
  private readonly art: GemArt;
  private readonly tunnel: ZoomTunnel;
  private readonly spec: FrameSpec;
  private readonly frames: TunnelFrame[] = [];
  /** Each frame's level at the last update (a jump up means it came round). */
  private readonly levels: number[] = [];
  private readonly hues: readonly GemHue[];
  private readonly rng = new Rng(Math.floor(Math.random() * 2 ** 32));
  private readonly depth: number;
  private readonly calm: boolean;
  private t = Math.random() * 100;
  private turn = Math.random() * Math.PI * 2;
  private visible = true;
  speed: number;
  alpha: number;
  /** Tunnel size multiplier (transitions open it wide). */
  spread = 1;
  cx = VIEW_W / 2;
  cy = VIEW_H * 0.42;
  /** Radius (px) of a clear middle: smaller frames fade away there. */
  core = 0;
  /** Levels the tunnel has pulled back into the distance: the nearest frames fade first. */
  recede = 0;

  /** `additive` blends the gems as light instead of paint. */
  constructor(
    scene: Phaser.Scene,
    look: WarpLook,
    depth: number,
    additive = false,
  ) {
    this.speed = look.speed;
    this.alpha = look.alpha;
    this.depth = depth;
    // Reduced motion: fewer frames, no drift and no spin.
    this.calm = app.settings.reducedMotion;
    this.art = GemArt.ensure(scene);
    this.hues = huesOf(look);
    const detail = scene.game.renderer.type === Phaser.WEBGL ? WEBGL_DETAIL : look.brief ? CANVAS_BRIEF : CANVAS_BACKGROUND;
    const perRing = Math.max(4, Math.round(look.perRing ?? 12));
    const frames = Math.max(3, Math.round(look.count / perRing) - detail.fewerFrames - (this.calm ? 1 : 0));
    this.tunnel = new ZoomTunnel({ frames, ratio: RATIO, twist: TWIST, nearCut: NEAR_CUT, nearFade: 0.6, farFade: 1.1 });
    const sideAlpha = detail.sides ? (look.ribs ?? 0) : 0;
    const brushed = look.brushed ?? false;
    this.spec = {
      gems: perRing,
      sides: sideAlpha > 0,
      band: 0.83,
      edge: 0.97,
      gemLength: 0.52 * (look.size ?? 1) * detail.size,
      jitter: 0.14,
      shapes: GemArt.SHAPES,
      sideKinds: brushed ? GemArt.BANDS : GemArt.RIBS,
    };
    const blend = additive ? Phaser.BlendModes.ADD : Phaser.BlendModes.NORMAL;
    for (let k = 0; k < frames; k++) {
      this.frames.push(new TunnelFrame(scene, this.art, frameSlots(this.spec, this.rng), this.hues, this.rng, blend, sideAlpha, brushed));
      this.levels.push(this.tunnel.level(k));
    }
    this.sortDepths();
  }

  update(dtMs: number): void {
    const dt = Math.min(dtMs, 100) / 1000;
    this.t += dt;
    this.tunnel.advance(this.speed * dt);
    if (!this.calm) this.turn += SPIN * dt;
    if (!this.visible) return;
    // Screen-fixed (drawn in 1280 × 720 units by the screen camera).
    const zoom = 1;
    const outer = (OUTER * this.spread) / zoom;
    // The far end of the tunnel drifts a little.
    const bendX = this.calm ? 0 : (Math.sin(this.t * 0.23) * 90) / zoom;
    const bendY = this.calm ? 0 : (Math.cos(this.t * 0.17) * 40) / zoom;
    const n = this.tunnel.spec.frames;
    let cameRound = false;
    this.frames.forEach((frame, k) => {
      const u = this.tunnel.level(k);
      if (u > this.levels[k]! + n / 2) {
        // Passed the viewer: back at the vanishing point, rearranged and repainted.
        frame.renew(frameSlots(this.spec, this.rng), this.hues, this.rng);
        cameRound = true;
      }
      this.levels[k] = u;
      const size = outer * this.tunnel.scale(u);
      const far = (u / n) ** 2;
      const clear = this.core > 0 ? smooth((size * zoom - this.core * 1.1) / (this.core * 0.5)) : 1;
      frame.place(this.cx + bendX * far, this.cy + bendY * far, size, this.turn + this.tunnel.turn(u), this.alpha * this.tunnel.fade(u, this.recede) * clear, zoom);
    });
    if (cameRound) this.sortDepths();
  }

  /** Nearer (bigger) frames draw over farther ones; only reordered when one comes round. */
  private sortDepths(): void {
    const order = this.frames.map((frame, k) => ({ frame, u: this.tunnel.level(k) })).sort((a, b) => b.u - a.u);
    order.forEach(({ frame }, i) => frame.setDepth(this.depth + (0.5 * i) / order.length));
  }

  setVisible(v: boolean): void {
    this.visible = v;
    for (const f of this.frames) f.setVisible(v);
  }

  destroy(): void {
    for (const f of this.frames) f.destroy();
    this.frames.length = 0;
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
