import type * as Phaser from 'phaser';
import { app } from '../../engine/App';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import { FLOOR_EYE_LOOK } from '../art/p1FloorEye';

// The slit eye in r01's floor (art/p1FloorEye.ts) watches Gorti. Its iris
// follows him across the room, looks up at him when he stands over it and
// out toward the viewer when he steps that way, and now and then darts a
// little, as eyes do. Its pupil, a slit, opens wide as he comes near. It
// never blinks.

/** Within this far (world px) the pupil is wide open; beyond the second, a slit. */
const NEAR = 90;
const FAR = 320;
/** How far off he has to be for it to look all the way to the side. */
const SIDE = 170;

const smooth = (a: number, b: number, v: number): number => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export class FloorEyeWatch {
  private readonly iris: Phaser.GameObjects.Image | null;
  private readonly wide: Phaser.GameObjects.Image | null;
  private readonly home: { x: number; y: number };
  private lx = 0;
  private ly = 0;
  private open = 0;
  /** A quick glance off his face, and when the next one comes (ms). */
  private dart = { x: 0, y: 0 };
  private nextDart = 1800;

  constructor(
    private readonly w: WorldScene,
    private readonly x: number,
  ) {
    this.iris = w.room.propImage('p1.flooreye.iris', x);
    this.wide = w.room.propImage('p1.flooreye.iris.wide', x);
    this.home = { x: this.iris?.x ?? x, y: this.iris?.y ?? 0 };
  }

  update(dtMs: number): void {
    if (!this.iris) return;
    const p = this.w.player;
    const dx = p.x - this.x;
    const near = 1 - smooth(NEAR, FAR, Math.abs(dx));
    // Toward him across the room; up at him when he is over it, out toward
    // the viewer when he steps nearer to them.
    const tx = Math.max(-1, Math.min(1, dx / SIDE)) * FLOOR_EYE_LOOK.x;
    const toward = Math.max(-1, Math.min(1, p.z / 80));
    const ty = -FLOOR_EYE_LOOK.up * near * (1 - Math.max(0, toward)) + FLOOR_EYE_LOOK.down * Math.max(0, toward) * near;
    if (!app.settings.reducedMotion) {
      this.nextDart -= dtMs;
      if (this.nextDart <= 0) {
        const far = 1 - near;
        this.dart = { x: (Math.random() * 2 - 1) * (1 + 2.5 * far), y: (Math.random() * 2 - 1) * 0.8 };
        this.nextDart = 1200 + Math.random() * 2600;
        // Back on him soon after.
        this.w.time.delayedCall(260 + Math.random() * 300, () => (this.dart = { x: 0, y: 0 }));
      }
    }
    const k = 1 - Math.exp((-dtMs / 1000) * 9);
    this.lx += (Math.max(-FLOOR_EYE_LOOK.x, Math.min(FLOOR_EYE_LOOK.x, tx + this.dart.x)) - this.lx) * k;
    this.ly += (ty + this.dart.y - this.ly) * k;
    this.open += (near - this.open) * (1 - Math.exp((-dtMs / 1000) * 4));
    this.iris.setPosition(this.home.x + this.lx, this.home.y + this.ly);
    this.wide?.setPosition(this.home.x + this.lx, this.home.y + this.ly).setAlpha(this.open);
  }
}
