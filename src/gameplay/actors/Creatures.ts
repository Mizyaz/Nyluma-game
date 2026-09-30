import * as Phaser from 'phaser';
import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { frameRef, hasFrame } from '../../render/2d/TextureFactory';

// Lightweight visual actors: the whale memory, the sparrow, pooled birds and
// fish, and raccoon onlookers. None of them owns a physics body.

function part(scene: Phaser.Scene, key: string): Phaser.GameObjects.Image | null {
  if (!hasFrame(key)) return null;
  const f = frameRef(key);
  return scene.add.image(0, 0, f.atlas, f.frame).setOrigin(f.px / f.w, f.py / f.h).setScale(1 / f.scale);
}

export class Whale {
  readonly c: Phaser.GameObjects.Container;
  private body: Phaser.GameObjects.Image | null;
  private fin: Phaser.GameObjects.Image | null;
  private fluke: Phaser.GameObjects.Image | null;
  private t = 0;

  constructor(private scene: Phaser.Scene, x: number, y: number, depth: number = DEPTH.backProps) {
    this.c = scene.add.container(x, y).setDepth(depth);
    this.fluke = part(scene, 'whale.fluke');
    this.body = part(scene, 'whale.body');
    this.fin = part(scene, 'whale.fin');
    if (this.fluke) this.fluke.setPosition(-190, -3);
    if (this.fin) this.fin.setPosition(45, 28);
    for (const p of [this.fluke, this.body, this.fin]) if (p) this.c.add(p);
    this.c.setAlpha(0);
  }

  swim(fromX: number, toX: number, y: number, ms: number, onDone?: () => void): void {
    this.c.setPosition(fromX, y).setAlpha(0);
    this.c.setScale(toX >= fromX ? 1 : -1, 1);
    app.audio.sfx('whale');
    this.scene.tweens.add({ targets: this.c, alpha: 0.95, duration: 900 });
    this.scene.tweens.add({
      targets: this.c,
      x: toX,
      duration: ms,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.scene.tweens.add({ targets: this.c, alpha: 0, duration: 900, onComplete: () => onDone?.() });
      },
    });
  }

  update(dtMs: number): void {
    this.t += dtMs / 1000;
    if (this.fluke) this.fluke.setRotation(0.28 * Math.sin(this.t * 1.6));
    if (this.fin) this.fin.setRotation(0.2 * Math.sin(this.t * 1.6 + 1.2));
    if (this.body) this.body.setRotation(0.03 * Math.sin(this.t * 1.6 - 0.8));
    this.c.y += Math.sin(this.t * 0.8) * 0.15;
  }

  destroy(): void {
    this.c.destroy(true);
  }
}

export class Sparrow {
  readonly c: Phaser.GameObjects.Container;
  private wing: Phaser.GameObjects.Image | null;
  private t = 0;
  flying = false;

  constructor(private scene: Phaser.Scene, x: number, y: number, depth: number = DEPTH.actors) {
    this.c = scene.add.container(x, y).setDepth(depth);
    const body = part(scene, 'sparrow.body');
    this.wing = part(scene, 'sparrow.wing');
    if (body) this.c.add(body);
    if (this.wing) {
      this.wing.setPosition(-6, -14);
      this.c.add(this.wing);
    }
    this.c.setScale(1.15);
  }

  flyTo(x: number, y: number, ms: number, onDone?: () => void): void {
    this.flying = true;
    const dir = x >= this.c.x ? 1 : -1;
    this.c.setScale(1.15 * dir, 1.15);
    app.audio.sfx('wing');
    const start = { x: this.c.x, y: this.c.y };
    const prog = { t: 0 };
    this.scene.tweens.add({
      targets: prog,
      t: 1,
      duration: ms,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        const k = prog.t;
        this.c.x = start.x + (x - start.x) * k;
        this.c.y = start.y + (y - start.y) * k - Math.sin(k * Math.PI) * 60;
      },
      onComplete: () => {
        this.flying = false;
        onDone?.();
      },
    });
  }

  update(dtMs: number): void {
    this.t += dtMs / 1000;
    if (!this.wing) return;
    if (this.flying) this.wing.setRotation(0.15 + 0.75 * Math.sin(this.t * 26));
    else {
      this.wing.setRotation(0.1 * Math.sin(this.t * 2));
      this.c.y += Math.sin(this.t * 7) * 0.08;
    }
  }

  destroy(): void {
    this.c.destroy(true);
  }
}

interface Mote {
  c: Phaser.GameObjects.Container;
  flap: Phaser.GameObjects.Image | null;
  vx: number;
  vy: number;
  life: number;
  t: number;
  alive: boolean;
}

/** Pooled birds/fish emerging from flowers; capped for performance. */
export class CreaturePool {
  private items: Mote[] = [];
  private next = 0;

  constructor(
    scene: Phaser.Scene,
    private kind: 'bird' | 'fish',
    size: number,
    depth: number = DEPTH.actors,
  ) {
    const variants = ['a', 'b', 'c'];
    for (let i = 0; i < size; i++) {
      const v = variants[i % 3]!;
      const c = scene.add.container(0, 0).setDepth(depth).setVisible(false);
      const bodyKey = `${kind}.${v}`;
      const flapKey = kind === 'bird' ? `${bodyKey}.wing` : `${bodyKey}.tail`;
      const flap = part(scene, flapKey);
      const body = part(scene, bodyKey);
      if (kind === 'fish' && flap) {
        flap.setPosition(v === 'a' ? -20 : v === 'b' ? -19 : -17, 0);
        c.add(flap);
      }
      if (body) c.add(body);
      if (kind === 'bird' && flap) {
        flap.setPosition(-2, v === 'c' ? -4 : -5);
        c.add(flap);
      }
      this.items.push({ c, flap, vx: 0, vy: 0, life: 0, t: 0, alive: false });
    }
  }

  spawn(x: number, y: number, vx: number, vy: number, life = 2.2): void {
    const m = this.items[this.next]!;
    this.next = (this.next + 1) % this.items.length;
    m.c.setPosition(x, y).setVisible(true).setAlpha(1).setScale(vx >= 0 ? 1 : -1, 1);
    m.vx = vx;
    m.vy = vy;
    m.life = life;
    m.t = 0;
    m.alive = true;
  }

  /** Positions for scripted formations (the Sun encounter's school). */
  place(i: number, x: number, y: number, rot = 0): void {
    const m = this.items[i % this.items.length]!;
    m.alive = false;
    m.c.setVisible(true).setPosition(x, y).setRotation(rot).setAlpha(1);
  }

  hideAll(): void {
    for (const m of this.items) {
      m.alive = false;
      m.c.setVisible(false);
    }
  }

  get size(): number {
    return this.items.length;
  }

  /** How many are flying or swimming on their own right now. */
  get flying(): number {
    return this.items.reduce((n, m) => n + (m.alive ? 1 : 0), 0);
  }

  update(dtMs: number): void {
    const dt = dtMs / 1000;
    for (const m of this.items) {
      if (!m.c.visible) continue;
      m.t += dt;
      if (m.flap) m.flap.setRotation(this.kind === 'bird' ? 0.15 + 0.75 * Math.sin(m.t * 24) : 0.45 * Math.sin(m.t * 14));
      if (!m.alive) continue;
      m.life -= dt;
      if (this.kind === 'bird') {
        m.vy -= 60 * dt;
        m.c.rotation = Math.atan2(m.vy, Math.abs(m.vx)) * 0.4 * Math.sign(m.vx || 1);
      } else {
        m.vy += 520 * dt;
        m.c.rotation = Math.atan2(m.vy, m.vx);
        m.c.setScale(1, 1);
      }
      m.c.x += m.vx * dt;
      m.c.y += m.vy * dt;
      if (m.life < 0.5) m.c.setAlpha(Math.max(0, m.life / 0.5));
      if (m.life <= 0) {
        m.alive = false;
        m.c.setVisible(false);
      }
    }
  }

  destroy(): void {
    for (const m of this.items) m.c.destroy(true);
    this.items = [];
  }
}

export class Raccoons {
  private imgs: Phaser.GameObjects.Image[] = [];
  private t = 0;
  constructor(scene: Phaser.Scene, spots: { x: number; y: number; kind: 'sit' | 'sniff' | 'shadow'; flip?: boolean; scale?: number; depth?: number }[]) {
    for (const s of spots) {
      const im = part(scene, `raccoon.${s.kind}`);
      if (!im) continue;
      im.setPosition(s.x, s.y).setDepth(s.depth ?? (s.kind === 'shadow' ? DEPTH.backProps : DEPTH.props));
      im.setScale(im.scaleX * (s.scale ?? 1) * (s.flip ? -1 : 1), im.scaleY * (s.scale ?? 1));
      this.imgs.push(im);
    }
  }
  update(dtMs: number): void {
    this.t += dtMs / 1000;
    this.imgs.forEach((im, i) => {
      im.setRotation(0.05 * Math.sin(this.t * 1.3 + i * 1.7));
    });
  }
  destroy(): void {
    for (const im of this.imgs) im.destroy();
  }
}
