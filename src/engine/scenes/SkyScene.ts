import * as Phaser from 'phaser';
import { VIEW_W } from '../constants';
import { Face } from '../../gameplay/actors/Celestial';
import type { SkyJson } from '../content/types';

// The Moon (top left) and the Sun (top right), always on screen above the
// room: the chapter says which Moon and how the Sun feels (chapters.json,
// a room's `sky`, the `sky` action). Its own scene so the world camera's
// zoom and the 2.5D stage leave it alone; the world scene runs it.

// Clear of the HUD's buttons in the top right corner.
const MOON_AT = { x: 80, y: 80, scale: 0.32 };
const SUN_AT = { x: VIEW_W - 205, y: 76, scale: 0.24 };

export class SkyScene extends Phaser.Scene {
  private moon: Face | null = null;
  private sun: Face | null = null;
  private sky: Required<SkyJson> = { moon: 'none', sun: 'none' };
  private eye = { x: VIEW_W / 2, y: 400 };

  constructor() {
    super({ key: 'sky' });
  }

  create(data: { sky?: Required<SkyJson> }): void {
    this.moon = this.sun = null;
    this.sky = { moon: 'none', sun: 'none' };
    this.set(data.sky ?? { moon: 'none', sun: 'none' });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.moon?.destroy();
      this.sun?.destroy();
      this.moon = this.sun = null;
    });
  }

  /** Changes what the sky shows (only what `sky` names). */
  set(sky: SkyJson): void {
    const next = { ...this.sky, ...sky };
    if (next.moon !== this.sky.moon || !this.moon) {
      this.moon?.destroy();
      this.moon = next.moon === 'none' ? null : new Face(this, next.moon, MOON_AT.x, MOON_AT.y, 10);
      this.moon?.setScale(MOON_AT.scale);
    }
    if ((next.sun === 'none') !== (this.sky.sun === 'none') || !this.sun) {
      this.sun?.destroy();
      this.sun = next.sun === 'none' ? null : new Face(this, 'sun', SUN_AT.x, SUN_AT.y, 10);
      this.sun?.setScale(SUN_AT.scale);
    }
    if (this.sun) this.sun.laughing = next.sun === 'laugh';
    this.sky = next;
  }

  get current(): Readonly<Required<SkyJson>> {
    return this.sky;
  }

  /** Where the faces look (screen px: Gorti). */
  look(x: number, y: number): void {
    this.eye.x = x;
    this.eye.y = y;
  }

  /** Short speech movement of a face (a line it says). */
  talk(who: 'moon' | 'sun', ms = 1800): void {
    (who === 'moon' ? this.moon : this.sun)?.say(ms);
  }

  override update(_time: number, dtMs: number): void {
    for (const f of [this.moon, this.sun]) {
      if (!f) continue;
      f.lookAt(this.eye.x, this.eye.y);
      f.update(dtMs);
    }
    if (this.sun && this.sky.sun === 'laugh') this.sun.laughing = true;
  }
}
