import * as Phaser from 'phaser';
import { app } from '../App';
import { DEPTH } from '../constants';
import { frameRef, hasFrame } from '../art/TextureFactory';

// Celestial faces: the infant Moon, the ancient Moon and the Sun. Eyes,
// lids and mouths animate slowly; the gaze follows Gorti. No UI frame.

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
}

const LAYOUTS: Record<'baby' | 'old' | 'sun', FaceLayout> = {
  baby: { disk: 'moon.baby', eye: 'moon.baby.eye', lid: 'moon.baby.lid', mouth: 'moon.baby.mouth', eyes: [[-35, -12], [35, -12]], mouthAt: [0, 48], size: 260 },
  old: { disk: 'moon.old', eye: 'moon.old.eye', lid: 'moon.old.lid', mouth: 'moon.old.mouth', laugh: 'moon.old.mouth.laugh', eyes: [[-45, -18], [45, -18]], mouthAt: [0, 60], size: 300 },
  sun: { disk: 'sun.disk', eye: 'sun.eye', lid: 'sun.lid', mouth: 'sun.mouth', laugh: 'sun.mouth.open', eyes: [[-50, -20], [50, -20]], mouthAt: [0, 68], size: 320 },
};

export class Face {
  readonly c: Phaser.GameObjects.Container;
  private eyes: Phaser.GameObjects.Image[] = [];
  private lids: Phaser.GameObjects.Image[] = [];
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

  constructor(private scene: Phaser.Scene, readonly kind: 'baby' | 'old' | 'sun', x: number, y: number, depth: number = DEPTH.backProps) {
    this.layout = LAYOUTS[kind];
    this.c = scene.add.container(x, y).setDepth(depth);
    if (kind === 'sun') {
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r = img(scene, i % 3 === 1 ? 'sun.ray.broken' : 'sun.ray');
        if (!r) continue;
        r.setRotation(a + Math.PI / 2);
        r.setPosition(Math.cos(a) * 150, Math.sin(a) * 150);
        r.setData('a', a);
        this.c.add(r);
        (i % 3 === 1 ? this.brokenRays : this.rays).push(r);
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
    this.lids.forEach((l, i) => {
      const [ex, ey] = this.layout.eyes[i]!;
      const close = Math.max(blink, this.lidDrop);
      l.setAlpha(0.15 + 0.85 * close);
      l.setPosition(ex, ey - 6 + 6 * close);
    });
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
      const len = this.rayLevel * (0.85 + 0.15 * Math.sin(this.t * 2 + i));
      const f = frameRef(this.brokenRays.includes(r) ? 'sun.ray.broken' : 'sun.ray');
      r.setScale(1 / f.scale, (1 / f.scale) * Math.max(0.001, len));
      r.setAlpha(this.rayLevel <= 0.01 ? 0 : 0.9 - cough * 0.4 * (i % 2));
      r.setPosition(Math.cos(a) * 150, Math.sin(a) * 150);
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

  setScale(s: number): void {
    this.c.setData('baseScale', s);
    this.c.setScale(s);
  }

  destroy(): void {
    this.c.destroy(true);
  }
}
