import * as Phaser from 'phaser';
import type { PaperStage } from '../paper/stage';
import type { PlaneCamera } from '../paper/planes';
import { darkOf, lightOf, lineFor, LINE } from '../render/2d/style';
import { Rng, smooth, type Pt } from '../render/2d/svg';
import { starPts } from './art/doors/doorKit';
import type { FaceArt, WallDoorArt } from './art/doors/wallArt';

// Small paper life about a doorway once it is open and Gorti is near:
// cut-paper fireflies, petals, leaves or confetti that come out of the
// opening into the room, or paper stars on threads hung before the wall.
// Each is a little sheet facing the viewer at its depth (printed with the
// door's art, see doors.ts), lit by the room's lamps like every card. With
// less motion asked for nothing moves: the stars hang still and nothing
// comes out of the opening.

export type LifeKind = NonNullable<WallDoorArt['life']>['kind'];

const r2 = (n: number): number => Math.round(n * 100) / 100;

/** The little sheets a kind of life is cut from (world px, drawn with their paper edge and a shadow). */
export function lifeArt(kind: LifeKind, colors: readonly string[]): FaceArt[] {
  const rng = new Rng(kind.length * 31 + colors.length);
  const out: FaceArt[] = [];
  const sheet = (w: number, h: number, d: string, fill: string, over = ''): FaceArt => {
    // The paper's white edge round the cut, a soft shadow low left, the contour in the fill's dark tone.
    const body =
      `<g transform="translate(-1.2 1.4)"><path d="${d}" fill="#2a2038" opacity="0.18"/></g>` +
      `<path d="${d}" fill="#fffaf2" stroke="#fffaf2" stroke-width="2.2" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="${fill}"/>` +
      over +
      `<path d="${d}" fill="none" stroke="${lineFor(fill)}" stroke-width="${LINE.fine}" stroke-linejoin="round"/>`;
    return { u0: 0, u1: w, h, body };
  };
  colors.forEach((c, i) => {
    if (kind === 'stars') {
      const pts = starPts(9, 9, 7.2, 0.5, rng.range(-0.2, 0.2));
      const d = 'M' + pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z';
      out.push(sheet(18, 18, d, c, `<path d="M9 2.4L10.6 8.2" stroke="${lightOf(c, 0.6)}" stroke-width="1" stroke-linecap="round"/>`));
    } else if (kind === 'fireflies') {
      // A paper body with a lit tail and two wing flaps.
      const body = `M5 7Q7 3 11 4Q14 6 12 9Q9 11 6 10Z`;
      const tail = `<path d="M4.4 9.6Q1.4 9 1.6 6.8Q3.4 5.6 5.4 7.4Z" fill="${c}"/><circle cx="3.2" cy="7.8" r="1.1" fill="${lightOf(c, 0.7)}"/>`;
      const wings = `<path d="M8 4.6Q8.6 1 11.6 1.4Q11.4 4 9.4 5.2Z" fill="#f4f0ff" stroke="${darkOf('#d8d0ee', 0.2)}" stroke-width="0.5"/>`;
      const f = sheet(16, 12, body, '#6d5a7a', tail + wings);
      out.push(f);
    } else if (kind === 'petals' || kind === 'leaves') {
      const long = kind === 'leaves';
      const w = long ? 16 : 13;
      const h = long ? 10 : 11;
      const pts: Pt[] = long
        ? [[1, 5], [5, 1.4], [11, 1.6], [15, 5], [11, 8.6], [5, 8.8]]
        : [[6.5, 1], [11.5, 3.6], [11.6, 8.2], [6.5, 10], [1.4, 8.2], [1.6, 3.6]];
      const d = smooth(pts, 1, true);
      const vein = long ? `<path d="M2 5.1Q8 4.4 14.4 5" stroke="${darkOf(c, 0.25)}" stroke-width="0.6" fill="none"/>` : `<path d="M6.5 2.6Q6 6 6.6 9" stroke="${lightOf(c, 0.5)}" stroke-width="0.7" fill="none"/>`;
      out.push(sheet(w, h, d, c, vein));
    } else {
      // Confetti: little cut squares, strips and rounds.
      const k = i % 3;
      const d = k === 0 ? 'M1 1L8 1.6L7.4 8.4L1.4 7.6Z' : k === 1 ? 'M1 2L11 1L11.4 4L1.2 5Z' : 'M4.5 1A3.5 3.5 0 1 1 4.49 1Z';
      out.push(sheet(k === 1 ? 12.5 : 9.5, k === 1 ? 6 : 9.5, d, c));
    }
  });
  return out;
}

interface Bit {
  img: Phaser.GameObjects.Image;
  t: number;
  life: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  phase: number;
  /** Where a hanging star hangs from (its thread runs up from it). */
  hang?: { x: number; y: number; len: number };
}

/** Where the life is: before which wall and opening. */
export interface LifePlace {
  /** The wall's face toward the room (x), the floor, the opening's depths and height. */
  x: number;
  floor: number;
  z0: number;
  z1: number;
  top: number;
  /** Which way the room is from the wall (-1: to the left, as for the right side wall). */
  into: -1 | 1;
  /** Across the room: life comes out on both sides. */
  both: boolean;
}

/** One door's small life (see the top of this file). */
export class PaperLife {
  private readonly bits: Bit[] = [];
  private readonly cam: PlaneCamera;
  private readonly z: number;
  private due = 0;
  private readonly rng = new Rng(7);
  private threads: Phaser.GameObjects.Graphics | null = null;

  constructor(
    private readonly paper: PaperStage,
    private readonly kind: LifeKind,
    private readonly rate: number,
    /** The printed sheets: a texture and its frames, and their print scale. */
    private readonly tex: { key: string; frames: string[]; scale: number },
    private readonly at: LifePlace,
  ) {
    // Just before the opening's middle depth, toward the viewer.
    this.z = Math.min(at.z1 - 8, (at.z0 + at.z1) / 2 + 24);
    this.cam = paper.planes.free(this.z, 0.4);
    if (kind === 'stars') this.hangStars();
  }

  /** The camera the life is drawn by (doors.ts cuts it at the wall's near jamb). */
  get camera(): PlaneCamera {
    return this.cam;
  }

  private image(frame: string): Phaser.GameObjects.Image {
    const img = this.paper.scene.add.image(0, 0, this.tex.key, frame);
    img.setScale(1 / this.tex.scale);
    img.setDepth(5);
    this.paper.planes.placeOn(img, this.cam);
    return img;
  }

  /** Paper stars on threads, hung from above before the wall beside the opening. */
  private hangStars(): void {
    const g = this.paper.scene.add.graphics();
    g.setDepth(4);
    this.paper.planes.placeOn(g, this.cam);
    this.threads = g;
    const a = this.at;
    const n = Math.min(3, this.tex.frames.length);
    for (let i = 0; i < n; i++) {
      const x = a.x + a.into * (18 + i * 22);
      const y = a.floor - a.top - 24 + (i % 2) * 34 + i * 6;
      const img = this.image(this.tex.frames[i]!);
      this.bits.push({ img, t: 0, life: Infinity, x, y, vx: 0, vy: 0, spin: 0, phase: i * 1.9, hang: { x, y: y - 120, len: 120 } });
    }
  }

  /** `level`: how much life there is (0 none … 1 open and wide awake). */
  update(dt: number, paused: boolean, level: number, reduced: boolean): void {
    if (this.kind === 'stars') {
      this.swing(dt, paused, level, reduced);
      return;
    }
    if (!paused && !reduced && level > 0.05) {
      this.due -= dt * this.rate * level * 1.6;
      if (this.due <= 0 && this.bits.length < 9) {
        this.due = 1;
        this.spawn();
      }
    }
    for (let i = this.bits.length - 1; i >= 0; i--) {
      const b = this.bits[i]!;
      if (!paused) b.t += dt;
      if (b.t >= b.life || reduced) {
        b.img.destroy();
        this.bits.splice(i, 1);
        continue;
      }
      if (!paused) this.fly(b, dt);
      const k = b.t / b.life;
      // Out of the opening, then down (or away) and gone as it falls behind the floor's edge of sight.
      b.img.setPosition(b.x, b.y);
      b.img.setAlpha(Math.min(1, (1 - k) * 4));
      if (this.kind === 'fireflies') b.img.setAlpha(Math.min(1, (1 - k) * 4) * (0.65 + 0.35 * Math.sin(b.t * 9 + b.phase)));
    }
  }

  private spawn(): void {
    const a = this.at;
    const r = this.rng;
    const side = a.both && r.chance(0.5) ? -a.into : a.into;
    // From inside the opening (behind the wall's face: the wall's near jamb hides it until it comes out).
    const x = a.x - side * r.range(12, 40);
    const y = a.floor - r.range(a.top * 0.25, a.top * 0.8);
    const frame = this.tex.frames[r.int(0, this.tex.frames.length - 1)]!;
    const img = this.image(frame);
    const k = this.kind;
    const speed = k === 'fireflies' ? r.range(18, 32) : k === 'confetti' ? r.range(40, 70) : r.range(24, 40);
    this.bits.push({
      img,
      t: 0,
      life: k === 'fireflies' ? r.range(3, 4.4) : r.range(2.4, 3.4),
      x,
      y,
      vx: side * speed,
      vy: k === 'fireflies' ? r.range(-14, -4) : k === 'confetti' ? r.range(-40, -20) : r.range(-6, 4),
      spin: r.range(-2.4, 2.4),
      phase: r.range(0, 6.28),
    });
  }

  private fly(b: Bit, dt: number): void {
    const k = this.kind;
    if (k === 'fireflies') {
      // A loose wander: they bob and turn about.
      b.vx += Math.sin(b.t * 2.1 + b.phase) * 22 * dt;
      b.vy += Math.cos(b.t * 2.7 + b.phase) * 26 * dt;
    } else {
      // Paper falls: a little lift as it rocks, gravity, air.
      b.vy += (k === 'confetti' ? 60 : 22) * dt;
      b.vy = Math.min(b.vy, k === 'confetti' ? 70 : 34);
      b.vx *= 1 - 0.35 * dt;
      b.img.rotation += b.spin * dt;
      b.img.scaleX = (Math.cos(b.t * 4 + b.phase) / this.tex.scale) * 0.9 + 0.1 / this.tex.scale;
    }
    b.x += (b.vx + Math.sin(b.t * 3 + b.phase) * 6) * dt;
    b.y += b.vy * dt;
    // Not below the floor.
    const floor = this.at.floor - 3;
    if (b.y > floor) {
      b.y = floor;
      b.vy = 0;
      b.vx *= 0.5;
      b.spin = 0;
    }
  }

  /** Stars on threads: they sway as Gorti comes (still with less motion). */
  private swing(dt: number, paused: boolean, level: number, reduced: boolean): void {
    const g = this.threads;
    g?.clear();
    for (const b of this.bits) {
      if (!paused && !reduced) b.t += dt;
      const h = b.hang!;
      const amp = reduced ? 0 : 0.05 + 0.13 * level;
      const ang = Math.sin(b.t * 1.6 + b.phase) * amp;
      const x = h.x + Math.sin(ang) * h.len;
      const y = h.y + Math.cos(ang) * h.len;
      b.img.setPosition(x, y);
      b.img.setRotation(ang * 0.8 + (reduced ? 0 : Math.sin(b.t * 2.3 + b.phase) * 0.12 * level));
      g?.lineStyle(1.2, 0x7a6a8c, 0.8).lineBetween(h.x, h.y - 600, x, y - 6);
    }
  }

  destroy(): void {
    for (const b of this.bits) b.img.destroy();
    this.bits.length = 0;
    this.threads?.destroy();
    this.threads = null;
  }
}
