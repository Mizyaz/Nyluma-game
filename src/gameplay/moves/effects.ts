import * as Phaser from 'phaser';
import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { hex, P } from '../../render/2d/palette';
import { Face } from '../actors/Celestial';
import type { CreaturePool } from '../actors/Creatures';
import { Horse } from '../actors/Horse';
import { BLOOM_COLORS, BLOOM_KEY, BLOOM_RES, FLOWER_ORIGIN, STEM_LEN } from './moveArt';
import type { Effect } from './types';

// Reusable pieces of the Rezonans moves. Each effect owns its game objects,
// advances itself in `update` and reports when it is done.

const smooth = (u: number): number => {
  const v = Math.min(1, Math.max(0, u));
  return v * v * (3 - 2 * v);
};

/** Calls steps at given seconds, then ends after `duration`. */
export class Timeline implements Effect {
  readonly kind = 'timeline';
  private t = 0;
  private next = 0;
  private readonly steps: readonly { at: number; run: () => void }[];

  constructor(
    steps: { at: number; run: () => void }[],
    private readonly duration: number,
  ) {
    this.steps = [...steps].sort((a, b) => a.at - b.at);
  }

  update(dtMs: number): boolean {
    this.t += dtMs / 1000;
    while (this.next < this.steps.length && this.steps[this.next]!.at <= this.t) this.steps[this.next++]!.run();
    return this.t < this.duration;
  }

  destroy(): void {
    // Steps not yet reached are dropped (the room is going away).
    this.next = this.steps.length;
  }
}

/** A loose piece flying free (a shed petal, pollen, dirt, the seed). */
interface Bit {
  img: Phaser.GameObjects.Image;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vr: number;
  age: number;
  life: number;
  /** Downward pull (negative: it rises, like pollen). */
  g: number;
  drag: number;
  /** Side-to-side flutter amplitude (petals in the wind). */
  flutter: number;
  base: number;
  /** Stops on the ground at this height (the seed). */
  floor: number | null;
  landed: boolean;
}

/** Local time points of a flower's life (seconds after its delay). */
const LIFE = { grow: 0.05, grown: 0.55, bud: 0.38, open: 0.62, shed: 2.1, wilt: 2.45, seed: 2.7, end: 4 };
const PETALS = 6;

/**
 * A flower's whole life: the soil heaves, a stem pushes up and unfolds its
 * leaves, a bud swells and bursts open in a puff of pollen (a bird or a few
 * fly out of it), and then the petals let go one by one and blow away, the
 * stem bows and sinks back into the ground, and a seed drops beside it.
 */
export class FlowerBloom implements Effect {
  readonly kind = 'bloom';
  private t = 0;
  private opened = false;
  private shedCount = 0;
  private seeded = false;
  private pollenCd = 0;
  private readonly k: number;
  private readonly dir: 1 | -1;
  private readonly col: number;
  private readonly mound: Phaser.GameObjects.Image;
  private readonly stem: Phaser.GameObjects.Image;
  private readonly leafL: Phaser.GameObjects.Image;
  private readonly leafR: Phaser.GameObjects.Image;
  private readonly bud: Phaser.GameObjects.Image;
  private readonly heart: Phaser.GameObjects.Image;
  private readonly petals: (Phaser.GameObjects.Image | null)[] = [];
  private readonly bits: Bit[] = [];
  private readonly reduced: boolean;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly x: number,
    private readonly groundY: number,
    private readonly delay: number,
    color: number,
    size: number,
    private readonly onOpen: (headX: number, headY: number) => void,
  ) {
    this.col = ((color % BLOOM_COLORS.length) + BLOOM_COLORS.length) % BLOOM_COLORS.length;
    this.k = size / BLOOM_RES;
    this.dir = Math.random() < 0.5 ? -1 : 1;
    this.reduced = app.settings.reducedMotion;
    const d = DEPTH.props + 3;
    this.mound = this.piece('mound', d - 1);
    this.stem = this.piece('stem', d);
    this.leafL = this.piece('leafL', d);
    this.leafR = this.piece('leafR', d);
    this.bud = this.piece(`bud${this.col}`, d + 1);
    for (let i = 0; i < PETALS; i++) this.petals.push(this.piece(`petal${this.col}`, d + 1));
    this.heart = this.piece('heart', d + 2);
  }

  private piece(frame: string, depth: number): Phaser.GameObjects.Image {
    const o = FLOWER_ORIGIN[frame] ?? { ox: 0.5, oy: 0.5 };
    return this.scene.add.image(this.x, this.groundY, BLOOM_KEY, frame).setOrigin(o.ox, o.oy).setDepth(depth).setVisible(false);
  }

  private spawn(frame: string, x: number, y: number, o: Partial<Bit> & { scale?: number }): void {
    const img = o.img ?? this.piece(frame, DEPTH.props + 5);
    img.setVisible(true).setPosition(x, y);
    if (o.scale !== undefined) img.setScale(o.scale);
    this.bits.push({ img, x, y, vx: 0, vy: 0, vr: 0, age: 0, life: 1, g: 0, drag: 0, flutter: 0, base: img.rotation, floor: null, landed: false, ...o });
  }

  update(dtMs: number): boolean {
    const dt = dtMs / 1000;
    this.t += dt;
    const t = this.t - this.delay;
    this.updateBits(dt);
    if (t < 0) return true;
    const { k, dir } = this;
    const grow = t < LIFE.grow ? 0 : t < LIFE.grown ? smooth((t - LIFE.grow) / (LIFE.grown - LIFE.grow)) * 1.07 : 1 + 0.07 * Math.exp(-(t - LIFE.grown) * 7) * Math.cos((t - LIFE.grown) * 18);
    const sink = 1 - smooth((t - LIFE.wilt - 0.25) / 0.7);
    const bend = dir * 0.95 * smooth((t - LIFE.wilt) / 0.65);
    const sway = 0.07 * Math.sin(t * 3.1) * Math.exp(-t * 0.5) + bend;
    const len = STEM_LEN * BLOOM_RES * k * grow * sink;
    const topX = this.x + Math.sin(sway) * len;
    const topY = this.groundY - Math.cos(sway) * len;

    // The soil heaves first, and flattens when all is over.
    const heave = smooth(t / 0.12) * (1 + 0.15 * Math.exp(-t * 9)) * (1 - smooth((t - LIFE.end + 0.6) / 0.5));
    this.mound.setVisible(heave > 0.01).setScale(k * heave * 1.1, k * heave * (1 - 0.55 * smooth((t - LIFE.wilt) / 1))).setPosition(this.x, this.groundY + 3);
    if (t < LIFE.grow + 0.02 && !this.reduced && this.bits.length === 0) {
      for (let i = 0; i < 5; i++) {
        this.spawn('seed', this.x + (Math.random() - 0.5) * 12, this.groundY - 2, {
          vx: (Math.random() - 0.5) * 140,
          vy: -90 - Math.random() * 90,
          vr: (Math.random() - 0.5) * 12,
          g: 520,
          life: 0.55,
          scale: k * 0.45,
        });
      }
    }

    this.stem.setVisible(grow > 0.01 && sink > 0.01).setPosition(this.x, this.groundY + 2).setRotation(sway).setScale(k, k * grow * sink);

    // Leaves unfold from against the stem, droop when it wilts.
    const unfold = smooth((t - 0.22) / 0.33);
    const droop = smooth((t - LIFE.wilt) / 0.6);
    const along = (f: number): [number, number] => [this.x + Math.sin(sway) * len * f, this.groundY - Math.cos(sway) * len * f];
    const [lx, ly] = along(0.42);
    const [rx, ry] = along(0.6);
    const leafK = k * (0.3 + 0.7 * unfold) * (1 - 0.35 * droop);
    this.leafL.setVisible(unfold > 0.01 && sink > 0.05).setPosition(lx, ly).setRotation(sway + 1.15 * (1 - unfold) - 0.25 * unfold - 0.85 * droop).setScale(leafK);
    this.leafR.setVisible(unfold > 0.01 && sink > 0.05).setPosition(rx, ry).setRotation(sway - 1.15 * (1 - unfold) + 0.25 * unfold + 0.85 * droop).setScale(leafK);
    this.leafL.setAlpha(1 - smooth((t - LIFE.wilt - 0.5) / 0.4));
    this.leafR.setAlpha(this.leafL.alpha);

    // The bud swells at the top of the stem.
    if (t < LIFE.open) {
      const swell = smooth((t - LIFE.bud) / (LIFE.open - LIFE.bud));
      this.bud.setVisible(t > LIFE.bud).setPosition(topX, topY).setRotation(sway).setScale(k * (0.4 + 0.75 * swell), k * (0.4 + 0.75 * swell + 0.08 * Math.sin(t * 40) * swell));
    } else if (!this.opened) {
      this.opened = true;
      this.bud.setVisible(false);
      app.audio.sfx('bloom', { pitch: 0.9 + Math.random() * 0.4, vol: 0.7 });
      this.onOpen(topX, topY);
      const n = this.reduced ? 3 : 9;
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
        const v = 50 + Math.random() * 70;
        this.spawn('pollen', topX, topY, { vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: -18, drag: 1.6, flutter: 10, life: 1.2 + Math.random() * 0.8, scale: k * (0.8 + Math.random() * 0.6) });
      }
    }

    // Open: petals fan out one after another and breathe; then shed.
    if (t >= LIFE.open) {
      const u = t - LIFE.open;
      for (let i = 0; i < PETALS; i++) {
        const p = this.petals[i];
        if (!p) continue;
        const ui = Math.max(0, u - i * 0.03);
        const pop = ui < 0.22 ? smooth(ui / 0.22) * 1.18 : 1 + 0.18 * Math.exp(-(ui - 0.22) * 8);
        const ang = sway + (i / PETALS) * Math.PI * 2 + 0.35 * (1 - smooth(ui / 0.3)) + 0.05 * Math.sin(t * 4 + i);
        p.setVisible(pop > 0.01).setPosition(topX, topY).setRotation(ang).setScale(k * pop);
      }
      const hp = u < 0.2 ? smooth(u / 0.2) * 1.15 : 1 + 0.15 * Math.exp(-(u - 0.2) * 8);
      const dry = 1 - 0.3 * smooth((t - LIFE.shed) / 1.2);
      this.heart.setVisible(sink > 0.05).setPosition(topX, topY).setRotation(sway).setScale(k * hp * dry).setAlpha(1 - smooth((t - LIFE.seed) / 0.5));
      // A little pollen keeps drifting while it is open.
      this.pollenCd -= dt;
      if (!this.reduced && t < LIFE.shed && this.pollenCd <= 0) {
        this.pollenCd = 0.28;
        this.spawn('pollen', topX + (Math.random() - 0.5) * 10, topY, { vx: (Math.random() - 0.5) * 24, vy: -22 - Math.random() * 20, g: -6, drag: 0.8, flutter: 8, life: 1.4, scale: k * 0.7 });
      }
    }

    // The petals let go one by one and blow away in the wind.
    while (t >= LIFE.shed + this.shedCount * 0.09 && this.shedCount < PETALS) {
      const i = this.shedCount++;
      const p = this.petals[i];
      if (!p) continue;
      this.petals[i] = null;
      const a = p.rotation - Math.PI / 2;
      this.spawn('', p.x, p.y, {
        img: p,
        vx: Math.cos(a) * 45 + dir * (25 + Math.random() * 35),
        vy: Math.sin(a) * 45 - 20,
        vr: (Math.random() - 0.5) * 5,
        g: 55,
        drag: 0.9,
        flutter: 22,
        life: 1.5 + Math.random() * 0.6,
      });
    }

    // The seed drops beside the flower and sinks into the soil.
    if (!this.seeded && t >= LIFE.seed) {
      this.seeded = true;
      this.spawn('seed', topX, topY, { vx: dir * (45 + Math.random() * 35), vy: -150, vr: dir * 6, g: 460, life: 1.6, floor: this.groundY - 2, scale: k });
    }
    return t < LIFE.end || this.bits.length > 0;
  }

  private updateBits(dt: number): void {
    for (let i = this.bits.length - 1; i >= 0; i--) {
      const b = this.bits[i]!;
      b.age += dt;
      if (b.landed) {
        // A seed settled on the ground sinks in.
        const u = smooth((b.age - (b.life - 0.5)) / 0.5);
        b.img.setPosition(b.x, b.y + 4 * u).setAlpha(1 - u);
      } else {
        b.vy += b.g * dt;
        const damp = Math.exp(-b.drag * dt);
        b.vx *= damp;
        b.vy *= damp;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.floor !== null && b.y >= b.floor) {
          b.y = b.floor;
          b.landed = true;
          b.img.setRotation(0.3 * Math.sign(b.vx));
          app.audio.sfx('sprout', { vol: 0.35 });
        }
        const fl = b.flutter * Math.sin(b.age * 6 + b.base * 3);
        b.img.setPosition(b.x + fl, b.y).setRotation(b.img.rotation + b.vr * dt);
        b.img.setAlpha(Math.min(1, (b.life - b.age) / 0.6));
      }
      if (b.age >= b.life) {
        b.img.destroy();
        this.bits.splice(i, 1);
      }
    }
  }

  destroy(): void {
    for (const img of [this.mound, this.stem, this.leafL, this.leafR, this.bud, this.heart]) img.destroy();
    for (const p of this.petals) p?.destroy();
    for (const b of this.bits) b.img.destroy();
    this.bits.length = 0;
  }
}

/** Birds bursting out of a flower head (drawn by a shared pool). */
export function releaseBirds(pool: CreaturePool, x: number, y: number, n: number, facing: 1 | -1): void {
  for (let i = 0; i < n; i++) {
    const side = n > 1 && i % 2 ? -facing : facing;
    pool.spawn(x, y - i * 4, side * (70 + Math.random() * 110), -(150 + Math.random() * 90), 2.2 + Math.random() * 0.6);
  }
  app.audio.sfx('wing', { vol: 0.6 });
  app.audio.sfx('chirp', { pitch: 1 + Math.random() * 0.4, vol: 0.6 });
}

/** Glowing cracks spreading along the ground from a stomp. */
export class GroundCracks implements Effect {
  readonly kind = 'cracks';
  private t = 0;
  private readonly g: Phaser.GameObjects.Graphics;
  private readonly lines: { x: number; y: number }[][] = [];

  constructor(scene: Phaser.Scene, x: number, groundY: number, reach: number) {
    this.g = scene.add.graphics().setDepth(DEPTH.props + 2);
    for (const dir of [-1, 1]) {
      for (let k = 0; k < 2; k++) {
        const pts = [{ x, y: groundY + 3 }];
        let px = x;
        let py = groundY + 3;
        const len = reach * (0.6 + 0.4 * Math.random()) * (k ? 0.6 : 1);
        while (Math.abs(px - x) < len) {
          px += dir * (14 + Math.random() * 18);
          py = groundY + 3 + (Math.random() - 0.5) * 7 + k * 5;
          pts.push({ x: px, y: py });
        }
        this.lines.push(pts);
      }
    }
  }

  update(dtMs: number): boolean {
    this.t += dtMs / 1000;
    const grow = smooth(this.t / 0.35);
    const fade = this.t < 1.2 ? 1 : Math.max(0, 1 - (this.t - 1.2) / 0.8);
    const g = this.g;
    g.clear();
    for (const pts of this.lines) {
      const n = Math.max(2, Math.ceil(pts.length * grow));
      g.lineStyle(5, hex(P.ink), 0.85 * fade);
      g.beginPath();
      g.moveTo(pts[0]!.x, pts[0]!.y);
      for (let i = 1; i < n; i++) g.lineTo(pts[i]!.x, pts[i]!.y);
      g.strokePath();
      g.lineStyle(2, hex(P.vein), fade);
      g.strokePath();
    }
    return this.t < 2;
  }

  destroy(): void {
    this.g.destroy();
  }
}

/** The Moon rises behind Gorti, looks at him, speaks without a sound and sets. */
export class MoonRise implements Effect {
  readonly kind = 'moon';
  private t = 0;
  private readonly face: Face;
  private readonly y0: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private readonly lookX: number,
    private readonly lookY: number,
  ) {
    this.face = new Face(scene, 'old', x, y + 90, DEPTH.backProps + 30);
    this.face.setScale(0.36);
    this.face.c.setAlpha(0);
    this.y0 = y;
    app.audio.sfx('rumble', { vol: 0.35 });
  }

  update(dtMs: number): boolean {
    this.t += dtMs / 1000;
    const t = this.t;
    const up = smooth(t / 1.2);
    const down = t > 3 ? smooth((t - 3) / 1) : 0;
    this.face.c.y = this.y0 + 90 * (1 - up) + 60 * down;
    this.face.c.setAlpha(Math.min(up, 1 - down));
    this.face.lookAt(this.lookX, this.lookY);
    if (t > 1.2 && t - dtMs / 1000 <= 1.2) this.face.say(1400);
    this.face.update(dtMs);
    return t < 4;
  }

  destroy(): void {
    this.face.destroy();
  }
}

/**
 * A purple horse comes out of the ground, rears, gallops away and melts
 * back into the soil.
 */
export class HorseEmerge implements Effect {
  readonly kind = 'horse';
  private t = 0;
  private phase: 'emerge' | 'rear' | 'run' | 'gone' = 'emerge';
  private readonly horse: Horse;
  private ended = false;
  /** Whole run so far: a safety net should a tween never call back. */
  private life = 0;

  constructor(scene: Phaser.Scene, x: number, groundY: number, private readonly facing: 1 | -1) {
    this.horse = new Horse(scene, x, groundY, DEPTH.actors - 3);
    this.horse.setFacing(facing);
    this.horse.emerge(() => {
      this.phase = 'rear';
      this.t = 0;
      this.horse.play('rear');
    });
  }

  update(dtMs: number): boolean {
    const dt = dtMs / 1000;
    this.t += dt;
    this.life += dt;
    if (this.phase === 'rear' && this.t > 0.9) {
      this.phase = 'run';
      this.t = 0;
    } else if (this.phase === 'run') {
      const v = 380 * Math.min(1, this.t * 2);
      this.horse.x += this.facing * v * dt;
      this.horse.gallop(v * dt);
      if (this.t > 1.4 && this.phase === 'run') {
        this.phase = 'gone';
        this.horse.dissolve(() => (this.ended = true));
      }
    } else if (this.phase === 'gone') {
      this.horse.x += this.facing * 380 * dt;
      this.horse.gallop(380 * dt);
    }
    this.horse.update(dtMs);
    return !this.ended && this.life < 8;
  }

  destroy(): void {
    this.horse.destroy();
  }
}
