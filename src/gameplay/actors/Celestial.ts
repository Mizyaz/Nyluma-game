import * as Phaser from 'phaser';
import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { frameRef, hasFrame } from '../../render/2d/TextureFactory';

// Celestial faces: the infant Moon, the ancient Moon and the Sun, as the
// author paints them: each Moon a crescent with a single eye (the ancient
// one crying), the Sun a round sad face in a ring of spiky rays. Eyes, lids
// and mouths animate slowly; the gaze follows Gorti. No UI frame.

function img(scene: Phaser.Scene, key: string): Phaser.GameObjects.Image | null {
  if (!hasFrame(key)) return null;
  const f = frameRef(key);
  return scene.add.image(0, 0, f.atlas, f.frame).setOrigin(f.px / f.w, f.py / f.h).setScale(1 / f.scale);
}

interface FaceLayout {
  disk: string;
  eye: string;
  lid: string;
  mouth: string;
  laugh?: string;
  eyes: [number, number][];
  mouthAt: [number, number];
  size: number;
  /** The painted heavy lids stay over the eyes' tops, and this shut eye shows for a blink; else faint lids only show to blink. */
  shut?: string;
}

const LAYOUTS: Record<'baby' | 'old' | 'sun', FaceLayout> = {
  baby: { disk: 'moon.baby', eye: 'moon.baby.eye', lid: 'moon.baby.lid', mouth: 'moon.baby.mouth', eyes: [[-68, -12]], mouthAt: [-34, 46], size: 260, shut: 'moon.baby.shut' },
  old: { disk: 'moon.old', eye: 'moon.old.eye', lid: 'moon.old.lid', mouth: 'moon.old.mouth', laugh: 'moon.old.mouth.laugh', eyes: [[-88, -26]], mouthAt: [-46, 46], size: 300 },
  sun: { disk: 'sun.disk', eye: 'sun.eye', lid: 'sun.lid', mouth: 'sun.mouth', laugh: 'sun.mouth.open', eyes: [[-46, -18], [46, -18]], mouthAt: [0, 54], size: 320, shut: 'sun.shut' },
};

/** The Sun's ring of spikes: how many, where their bases sit (under the face's edge), which are bent. */
const RAYS = 18;
const RAY_R = 104;
/** Long and short spikes by turns, as drawn. */
const rayLength = (i: number): number => (i % 2 ? 0.74 : 1);
const isBroken = (i: number): boolean => i % 4 === 1;

export class Face {
  readonly c: Phaser.GameObjects.Container;
  private eyes: Phaser.GameObjects.Image[] = [];
  private lids: Phaser.GameObjects.Image[] = [];
  private shuts: Phaser.GameObjects.Image[] = [];
  private mouth: Phaser.GameObjects.Image | null;
  private laugh: Phaser.GameObjects.Image | null = null;
  private layout: FaceLayout;
  private t = Math.random() * 5;
  private blinkIn = 2.5;
  private blinkT = 0;
  talking = 0;
  laughing = false;
  lidDrop = 0;
  gaze = { x: 0, y: 0 };
  private rays: Phaser.GameObjects.Image[] = [];
  private brokenRays: Phaser.GameObjects.Image[] = [];
  coughT = 0;
  rayLevel = 1;
  private dimmed = 0;

  constructor(private scene: Phaser.Scene, readonly kind: 'baby' | 'old' | 'sun', x: number, y: number, depth: number = DEPTH.backProps) {
    this.layout = LAYOUTS[kind];
    this.c = scene.add.container(x, y).setDepth(depth);
    if (kind === 'sun') {
      for (let i = 0; i < RAYS; i++) {
        const a = (i / RAYS) * Math.PI * 2;
        const r = img(scene, isBroken(i) ? 'sun.ray.broken' : 'sun.ray');
        if (!r) continue;
        r.setRotation(a + Math.PI / 2);
        r.setPosition(Math.cos(a) * RAY_R, Math.sin(a) * RAY_R);
        r.setData('a', a);
        r.setData('i', i);
        this.c.add(r);
        (isBroken(i) ? this.brokenRays : this.rays).push(r);
      }
    }
    const disk = img(scene, this.layout.disk);
    if (disk) this.c.add(disk);
    for (const [ex, ey] of this.layout.eyes) {
      const e = img(scene, this.layout.eye);
      const l = img(scene, this.layout.lid);
      if (e) {
        e.setPosition(ex, ey);
        this.c.add(e);
        this.eyes.push(e);
      }
      if (l) {
        l.setPosition(ex, ey);
        this.c.add(l);
        this.lids.push(l);
      }
      const shut = this.layout.shut ? img(scene, this.layout.shut) : null;
      if (shut) {
        shut.setPosition(ex, ey).setAlpha(0);
        this.c.add(shut);
        this.shuts.push(shut);
      }
    }
    this.mouth = img(scene, this.layout.mouth);
    if (this.mouth) {
      this.mouth.setPosition(...this.layout.mouthAt);
      this.c.add(this.mouth);
    }
    if (this.layout.laugh) {
      this.laugh = img(scene, this.layout.laugh);
      if (this.laugh) {
        this.laugh.setPosition(...this.layout.mouthAt).setVisible(false);
        this.c.add(this.laugh);
      }
    }
  }

  lookAt(wx: number, wy: number): void {
    const dx = wx - this.c.x;
    const dy = wy - this.c.y;
    const d = Math.hypot(dx, dy) || 1;
    this.gaze.x += ((dx / d) * 5 - this.gaze.x) * 0.08;
    this.gaze.y += ((dy / d) * 4 - this.gaze.y) * 0.08;
  }

  update(dtMs: number): void {
    const dt = dtMs / 1000;
    this.t += dt;
    this.blinkIn -= dt;
    if (this.blinkIn <= 0) {
      this.blinkT = 0.28;
      this.blinkIn = 3 + Math.random() * 4;
    }
    if (this.blinkT > 0) this.blinkT -= dt;
    const blink = this.blinkT > 0 ? Math.sin((this.blinkT / 0.28) * Math.PI) : 0;
    this.eyes.forEach((e, i) => {
      const [ex, ey] = this.layout.eyes[i]!;
      e.setPosition(ex + this.gaze.x, ey + this.gaze.y);
    });
    const close = Math.max(blink, this.lidDrop);
    // Painted heavy lids stay put; the shut eye shows through a blink.
    for (const s of this.shuts) s.setAlpha(close > 0.5 ? 1 : close * 2);
    if (!this.shuts.length) {
      this.lids.forEach((l, i) => {
        const [ex, ey] = this.layout.eyes[i]!;
        l.setAlpha(0.15 + 0.85 * close);
        l.setPosition(ex, ey - 6 + 6 * close);
      });
    }
    if (this.mouth) {
      const talk = this.talking > 0 ? 0.35 * Math.abs(Math.sin(this.t * 11)) : 0;
      if (this.talking > 0) this.talking -= dt;
      const f = frameRef(this.layout.mouth);
      this.mouth.setScale(1 / f.scale, (1 / f.scale) * (1 + talk));
      this.mouth.setVisible(!this.laughing);
      if (this.laugh) {
        this.laugh.setVisible(this.laughing);
        if (this.laughing) this.laugh.y = this.layout.mouthAt[1] + Math.sin(this.t * 14) * 1.5;
      }
    }
    // Slow breathing drift
    this.c.rotation = 0.015 * Math.sin(this.t * 0.4);
    if (this.kind === 'sun') this.updateRays(dt);
  }

  private updateRays(dt: number): void {
    if (this.coughT > 0) this.coughT -= dt;
    const cough = this.coughT > 0 ? Math.abs(Math.sin(this.coughT * 18)) : 0;
    const s = 1 - cough * 0.06;
    const base = this.c.getData('baseScale') ?? 1;
    this.c.setScale(base * s, base * (1 + cough * 0.04));
    const all = [...this.rays, ...this.brokenRays];
    all.forEach((r, i) => {
      const a = r.getData('a') as number;
      const ring = r.getData('i') as number;
      const len = this.rayLevel * rayLength(ring) * (0.88 + 0.12 * Math.sin(this.t * 2 + ring));
      const f = frameRef(this.brokenRays.includes(r) ? 'sun.ray.broken' : 'sun.ray');
      r.setScale(1 / f.scale, (1 / f.scale) * Math.max(0.001, len));
      r.setAlpha(this.rayLevel <= 0.01 ? 0 : 1 - cough * 0.4 * (i % 2));
      r.setPosition(Math.cos(a) * RAY_R, Math.sin(a) * RAY_R);
    });
  }

  cough(): void {
    this.coughT = 0.9;
    if (this.laugh) {
      this.laughing = true;
      this.scene.time.delayedCall(800, () => (this.laughing = false));
    }
    app.audio.sfx('cough');
  }

  say(ms = 1800): void {
    this.talking = ms / 1000;
  }

  /** Dims the face toward the night's lilac (0: as drawn), for the one that is not out. */
  dim(k: number): void {
    if (k === this.dimmed) return;
    this.dimmed = k;
    const c = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(0xffffff),
      Phaser.Display.Color.ValueToColor(0x9a92b8),
      1,
      k,
    );
    const tint = Phaser.Display.Color.GetColor(c.r, c.g, c.b);
    for (const o of this.c.list) (o as Phaser.GameObjects.Image).setTint?.(tint);
  }

  setScale(s: number): void {
    this.c.setData('baseScale', s);
    this.c.setScale(s);
  }

  destroy(): void {
    this.c.destroy(true);
  }
}
