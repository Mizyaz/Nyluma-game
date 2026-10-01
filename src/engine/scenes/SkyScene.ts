import * as Phaser from 'phaser';
import { VIEW_H, VIEW_W } from '../constants';
import { app } from '../App';
import { fitScene } from '../../paper/screen';
import { Face } from '../../gameplay/actors/Celestial';
import { HALO_PX, lightTextures } from '../../render/2d/fx/lightArt';
import type { SkyJson, SkyOut } from '../content/types';

// The Moon (top left) and the Sun (top right), always on screen above the
// room: the chapter says which Moon and how the Sun feels (chapters.json,
// a room's `sky`, the `sky` action). The one that is out (Gorti's kahkaha
// swaps them) grows and shines, the other dims, and the room takes its
// light. Its own scene so the world camera's zoom and the 2.5D stage leave
// it alone; the world scene runs it.

// Big enough to read their faces, clear of the HUD's buttons in the top
// right corner.
const MOON_AT = { x: 92, y: 92, scale: 0.5 };
const SUN_AT = { x: VIEW_W - 262, y: 98, scale: 0.4 };
/** Scale of the one that is out and of the other; the other also dims (never fades out). */
const OUT = { s: 1.22, a: 1 };
const IN = { s: 0.86, a: 1 };
const DIM = 0.42;
/** A breath of air over everything while each one is out (their lamps light the room: SkyLamps). */
const TINT: Record<SkyOut, { color: number; alpha: number }> = {
  none: { color: 0x000000, alpha: 0 },
  sun: { color: 0xffc766, alpha: 0.04 },
  moon: { color: 0x1d2468, alpha: 0.12 },
};

/**
 * The light about each face and the light it pours into the room, as
 * strong as it shines: a halo (its width, scene px) and soft beams toward
 * the room ([angle°, length, width, how fast it sways]).
 */
const GLOW: Record<'baby' | 'old' | 'sun', { color: number; halo: number; beams: readonly (readonly [number, number, number, number])[] }> = {
  sun: { color: 0xffd27a, halo: 440, beams: [[112, 0.8, 0.8, 0.31], [128, 1, 1, 0.23], [144, 0.9, 0.85, 0.37], [161, 0.7, 0.7, 0.27]] },
  baby: { color: 0xdcd2ff, halo: 330, beams: [[22, 0.75, 0.7, 0.25], [37, 1, 0.95, 0.19], [52, 0.9, 0.8, 0.29], [68, 0.7, 0.65, 0.22]] },
  old: { color: 0xb6c8ff, halo: 330, beams: [[22, 0.75, 0.7, 0.25], [37, 1, 0.95, 0.19], [52, 0.9, 0.8, 0.29], [68, 0.7, 0.65, 0.22]] },
};
/** A beam at length 1 and width 1 (scene px). */
const BEAM = { len: 980, wide: 170 };

type Glow = { halo: Phaser.GameObjects.Image; beams: Phaser.GameObjects.Image[] };

type FullSky = Required<SkyJson>;
const NONE: FullSky = { moon: 'none', sun: 'none', out: 'none' };

export class SkyScene extends Phaser.Scene {
  private moon: Face | null = null;
  private sun: Face | null = null;
  private sky: FullSky = { ...NONE };
  private eye = { x: VIEW_W / 2, y: 400 };
  /** Current emphasis (tweened): moon/sun scale factor and alpha. */
  private k = { m: 1, ma: 1, s: 1, sa: 1, md: 0, sd: 0 };
  private tint!: Phaser.GameObjects.Rectangle;
  private glows!: Record<'moon' | 'sun', Glow>;
  private laughT = 0;
  /** The part of the 1280 × 720 layout the screen shows (the faces keep to its corners). */
  private view: () => Phaser.Geom.Rectangle = () => new Phaser.Geom.Rectangle(0, 0, VIEW_W, VIEW_H);

  constructor() {
    super({ key: 'sky' });
  }

  create(data: { sky?: FullSky }): void {
    this.moon = this.sun = null;
    this.sky = { ...NONE };
    this.k = { m: 1, ma: 1, s: 1, sa: 1, md: 0, sd: 0 };
    this.laughT = 0;
    this.view = fitScene(this, 'height');
    this.tint = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x000000, 0).setOrigin(0).setDepth(0);
    lightTextures(this.textures);
    const glow = (): Glow => ({
      halo: this.add.image(0, 0, 'fx.halo').setBlendMode(Phaser.BlendModes.ADD).setDepth(6).setVisible(false),
      beams: [0, 1, 2, 3].map(() => this.add.image(0, 0, 'fx.beam').setOrigin(0, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(5).setVisible(false)),
    });
    this.glows = { moon: glow(), sun: glow() };
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

  /**
   * Where the Sun or the Moon shines from, as a point of the device-pixel
   * screen; how far it is out (0 while the other one is, about 0.4 with
   * neither, 1 out, a little over as it comes out); and its face's own
   * flicker (about 1). Null when it is not in the sky.
   */
  shining(who: 'moon' | 'sun'): { x: number; y: number; out: number; glow: number; kind: 'baby' | 'old' | 'sun' } | null {
    const f = who === 'moon' ? this.moon : this.sun;
    if (!f) return null;
    const v = this.view();
    const s = who === 'moon' ? this.k.m : this.k.s;
    return {
      x: ((f.c.x - v.x) / v.width) * this.scale.width,
      y: ((f.c.y - v.y) / v.height) * this.scale.height,
      out: Math.max(0, s - IN.s) / (OUT.s - IN.s),
      glow: f.glow,
      kind: f.kind,
    };
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
      md: out === 'sun' ? DIM : 0,
      sd: out === 'moon' ? DIM : 0,
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
      this.moon.dim(this.k.md);
      if (out === 'moon' && this.laughT > 0 && Math.random() < 0.04) this.moon.say(500);
    }
    if (this.sun) {
      this.sun.setScale(SUN_AT.scale * this.k.s);
      this.sun.c.setAlpha(this.k.sa);
      this.sun.dim(this.k.sd);
      this.sun.laughing = this.sky.sun === 'laugh' || (out === 'sun' && this.laughT > 0);
    }
    this.shed(this.glows.moon, this.moon, this.k.m);
    this.shed(this.glows.sun, this.sun, this.k.s);
    for (const f of [this.moon, this.sun]) {
      if (!f) continue;
      f.lookAt(this.eye.x, this.eye.y);
      f.update(dtMs);
    }
  }

  /** A face's halo and beams: as strong as it shines, the beams slowly swaying and breathing. */
  private shed(g: Glow, f: Face | null, s: number): void {
    g.halo.setVisible(!!f);
    for (const b of g.beams) b.setVisible(!!f);
    if (!f) return;
    const out = Math.max(0, s - IN.s) / (OUT.s - IN.s);
    const shine = (0.22 + 0.78 * Math.min(1.15, out)) * f.glow;
    const look = GLOW[f.kind];
    const still = app.settings.reducedMotion;
    const t = this.time.now / 1000;
    g.halo
      .setPosition(f.c.x, f.c.y)
      .setTint(look.color)
      .setAlpha(Math.min(1, 0.6 * shine))
      .setScale((look.halo * (0.75 + 0.3 * out)) / HALO_PX);
    g.beams.forEach((b, i) => {
      const [deg, len, wide, rate] = look.beams[i]!;
      const sway = still ? 0 : 0.035 * Math.sin(t * rate + i * 1.9);
      const breathe = still ? 0.8 : 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * rate * 1.3 + i * 2.7));
      b.setPosition(f.c.x, f.c.y)
        .setRotation(Phaser.Math.DegToRad(deg) + sway)
        .setTint(look.color)
        .setDisplaySize(BEAM.len * len * (0.8 + 0.25 * out), BEAM.wide * wide)
        .setAlpha(0.2 * shine * breathe);
    });
  }
}
