import * as Phaser from 'phaser';
import { VIEW_H, VIEW_W } from '../constants';
import { fitScene } from '../../paper/screen';
import { Face } from '../../gameplay/actors/Celestial';
import type { SkyJson, SkyOut } from '../content/types';

// The Moon (top left) and the Sun (top right), always on screen above the
// room: the chapter says which Moon and how the Sun feels (chapters.json,
// a room's `sky`, the `sky` action). The one that is out (Gorti's kahkaha
// swaps them) grows and shines, the other dims, and the room takes its
// light. Its own scene so the world camera's zoom and the 2.5D stage leave
// it alone; the world scene runs it.

// Clear of the HUD's buttons in the top right corner.
const MOON_AT = { x: 80, y: 80, scale: 0.32 };
const SUN_AT = { x: VIEW_W - 205, y: 76, scale: 0.24 };
/** Scale and alpha of the one that is out, and of the other. */
const OUT = { s: 1.45, a: 1 };
const IN = { s: 0.78, a: 0.5 };
/** The room's light while each one is out. */
const TINT: Record<SkyOut, { color: number; alpha: number }> = {
  none: { color: 0x000000, alpha: 0 },
  sun: { color: 0xffc766, alpha: 0.08 },
  moon: { color: 0x1d2468, alpha: 0.3 },
};

type FullSky = Required<SkyJson>;
const NONE: FullSky = { moon: 'none', sun: 'none', out: 'none' };

export class SkyScene extends Phaser.Scene {
  private moon: Face | null = null;
  private sun: Face | null = null;
  private sky: FullSky = { ...NONE };
  private eye = { x: VIEW_W / 2, y: 400 };
  /** Current emphasis (tweened): moon/sun scale factor and alpha. */
  private k = { m: 1, ma: 1, s: 1, sa: 1 };
  private tint!: Phaser.GameObjects.Rectangle;
  private laughT = 0;
  /** The part of the 1280 × 720 layout the screen shows (the faces keep to its corners). */
  private view: () => Phaser.Geom.Rectangle = () => new Phaser.Geom.Rectangle(0, 0, VIEW_W, VIEW_H);

  constructor() {
    super({ key: 'sky' });
  }

  create(data: { sky?: FullSky }): void {
    this.moon = this.sun = null;
    this.sky = { ...NONE };
    this.k = { m: 1, ma: 1, s: 1, sa: 1 };
    this.laughT = 0;
    this.view = fitScene(this, 'height');
    this.tint = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x000000, 0).setOrigin(0).setDepth(0);
    this.set(data.sky ?? NONE, false);
    this.place();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.moon?.destroy();
      this.sun?.destroy();
      this.moon = this.sun = null;
    });
  }

  /** Changes what the sky shows (only what `sky` names). */
  set(sky: SkyJson, animate = true): void {
    const next: FullSky = { ...this.sky, ...sky };
    if (next.moon !== this.sky.moon || !this.moon) {
      this.moon?.destroy();
      this.moon = next.moon === 'none' ? null : new Face(this, next.moon, MOON_AT.x, MOON_AT.y, 10);
    }
    if ((next.sun === 'none') !== (this.sky.sun === 'none') || !this.sun) {
      this.sun?.destroy();
      this.sun = next.sun === 'none' ? null : new Face(this, 'sun', SUN_AT.x, SUN_AT.y, 10);
    }
    const changed = next.out !== this.sky.out;
    this.sky = next;
    this.shine(animate && changed);
    if (animate && changed) this.laughT = next.out === 'none' ? 0 : 1.8;
  }

  get current(): Readonly<FullSky> {
    return this.sky;
  }

  /** Where the faces look (screen px: Gorti). */
  look(x: number, y: number): void {
    this.eye.x = x;
    this.eye.y = y;
  }

  /** Where the faces look, as a point of the device-pixel screen. */
  lookAtScreen(x: number, y: number): void {
    const p = this.cameras.main.getWorldPoint(x, y);
    this.look(p.x, p.y);
  }

  /** The moon in the top left corner of what shows, the sun in the top right; the light over all of it. */
  private place(): void {
    const v = this.view();
    this.tint.setPosition(v.x, v.y).setSize(v.width, v.height);
    this.moon?.c.setPosition(v.x + MOON_AT.x, v.y + MOON_AT.y);
    this.sun?.c.setPosition(v.right - (VIEW_W - SUN_AT.x), v.y + SUN_AT.y);
  }

  /** Short speech movement of a face (a line it says). */
  talk(who: 'moon' | 'sun', ms = 1800): void {
    (who === 'moon' ? this.moon : this.sun)?.say(ms);
  }

  /** Grows the one that is out, dims the other, lights the room. */
  private shine(animate: boolean): void {
    const out = this.sky.out;
    const to = {
      m: out === 'moon' ? OUT.s : out === 'sun' ? IN.s : 1,
      ma: out === 'sun' ? IN.a : 1,
      s: out === 'sun' ? OUT.s : out === 'moon' ? IN.s : 1,
      sa: out === 'moon' ? IN.a : 1,
    };
    const tint = TINT[out];
    this.tweens.killTweensOf([this.k, this.tint]);
    if (!animate) {
      Object.assign(this.k, to);
      this.tint.setFillStyle(tint.color, tint.alpha);
      return;
    }
    this.tweens.add({ targets: this.k, ...to, duration: 700, ease: 'Back.easeOut' });
    // The light turns through the new colour.
    if (tint.alpha > 0) this.tint.fillColor = tint.color;
    this.tweens.add({ targets: this.tint, fillAlpha: tint.alpha, duration: 900, ease: 'Sine.easeInOut' });
  }

  override update(_time: number, dtMs: number): void {
    if (this.laughT > 0) this.laughT -= dtMs / 1000;
    this.place();
    const out = this.sky.out;
    if (this.moon) {
      this.moon.setScale(MOON_AT.scale * this.k.m);
      this.moon.c.setAlpha(this.k.ma);
      if (out === 'moon' && this.laughT > 0 && Math.random() < 0.04) this.moon.say(500);
    }
    if (this.sun) {
      this.sun.setScale(SUN_AT.scale * this.k.s);
      this.sun.c.setAlpha(this.k.sa);
      this.sun.laughing = this.sky.sun === 'laugh' || (out === 'sun' && this.laughT > 0);
    }
    for (const f of [this.moon, this.sun]) {
      if (!f) continue;
      f.lookAt(this.eye.x, this.eye.y);
      f.update(dtMs);
    }
  }
}
