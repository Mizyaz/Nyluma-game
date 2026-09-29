import * as Phaser from 'phaser';
import { app } from '../App';
import { DEPTH } from '../constants';
import { hex, P } from '../art/palette';
import { Face } from '../entities/Celestial';
import type { CreaturePool } from '../entities/Creatures';
import { Horse } from '../entities/Horse';
import { BLOOM_CELL, BLOOM_COLORS, BLOOM_KEY } from './moveArt';
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

/**
 * A flower that sprouts from the ground, opens and lets a bird (or a few)
 * out, then wilts away.
 */
export class FlowerBloom implements Effect {
  readonly kind = 'bloom';
  private t = 0;
  private opened = false;
  private readonly bud: Phaser.GameObjects.Image;
  private readonly open: Phaser.GameObjects.Image;
  private readonly size: number;

  constructor(
    scene: Phaser.Scene,
    private readonly x: number,
    private readonly groundY: number,
    private readonly delay: number,
    color: number,
    size: number,
    private readonly onOpen: (headX: number, headY: number) => void,
  ) {
    const i = color % BLOOM_COLORS.length;
    const oy = BLOOM_CELL.footY / BLOOM_CELL.h;
    this.size = size * 0.5;
    this.bud = scene.add.image(x, groundY + 2, BLOOM_KEY, `bud${i}`).setOrigin(0.5, oy).setScale(0).setDepth(DEPTH.props + 3);
    this.open = scene.add.image(x, groundY + 2, BLOOM_KEY, `open${i}`).setOrigin(0.5, oy).setScale(this.size).setVisible(false).setDepth(DEPTH.props + 3);
  }

  update(dtMs: number): boolean {
    this.t += dtMs / 1000;
    const t = this.t - this.delay;
    if (t < 0) return true;
    if (t < 0.4) {
      // Sprouting: grows up with a little overshoot.
      const u = t / 0.4;
      const s = this.size * (u < 0.8 ? smooth(u / 0.8) * 1.08 : 1.08 - 0.08 * ((u - 0.8) / 0.2));
      this.bud.setScale(s * 0.9, s);
    } else if (!this.opened) {
      this.opened = true;
      this.bud.setVisible(false);
      this.open.setVisible(true).setScale(this.size * 1.12);
      app.audio.sfx('bloom', { pitch: 0.9 + Math.random() * 0.4, vol: 0.7 });
      const head = 74 * this.size;
      this.onOpen(this.x + 3 * this.size, this.groundY - head);
    } else {
      const o = t - 0.4;
      this.open.setScale(this.size * (1 + 0.12 * Math.exp(-o * 6)));
      this.open.setRotation(0.05 * Math.sin(o * 5) * Math.exp(-o));
      if (o > 1.5) this.open.setAlpha(Math.max(0, 1 - (o - 1.5) / 0.6));
    }
    return t < 2.1;
  }

  destroy(): void {
    this.bud.destroy();
    this.open.destroy();
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
