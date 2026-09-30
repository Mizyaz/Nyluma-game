import * as Phaser from 'phaser';
import { app } from '../App';
import { GemArt, GEM_HUES } from './gemArt';

// A small living mouth of the gem tunnel, set into a wall where a room's
// way on begins: square frames of pastel gems stream out of its depth and
// turn, inside an arch, with a soft light spilling out. The same tunnel
// carries Gorti to the next room.

const RINGS = 6;
/** Frame radius at full size, as a share of the arch's half-width. */
const RADIUS = 1.25;

interface Ring {
  box: Phaser.GameObjects.Container;
  phase: number;
}

export class GemPortal {
  private readonly root: Phaser.GameObjects.Container;
  private readonly rings: Ring[] = [];
  private readonly glow: Phaser.GameObjects.Graphics;
  private readonly mask: Phaser.GameObjects.Graphics;
  private t = Math.random() * 10;
  private readonly calm: boolean;

  /** An arch `w` wide and `h` tall whose floor centre is at (x, floorY). */
  constructor(
    scene: Phaser.Scene,
    x: number,
    floorY: number,
    private readonly w: number,
    h: number,
    depth: number,
  ) {
    this.calm = app.settings.reducedMotion;
    const art = GemArt.ensure(scene);
    const cy = floorY - h * 0.5;
    // The depth of the tunnel: soft lilac, lighter toward its heart.
    this.glow = scene.add.graphics().setDepth(depth);
    const arch = (g: Phaser.GameObjects.Graphics, inset: number): void => {
      const ww = w - inset * 2;
      g.fillRoundedRect(x - ww / 2, floorY - h + inset, ww, h - inset, { tl: ww / 2, tr: ww / 2, bl: 0, br: 0 });
    };
    for (const [inset, color, a] of [
      [0, 0x6f5f8f, 1],
      [10, 0x8a78ab, 1],
      [24, 0xb3a3d1, 0.9],
      [40, 0xe3d8f2, 0.8],
    ] as const) {
      this.glow.fillStyle(color, a);
      arch(this.glow, inset);
    }
    this.root = scene.add.container(x, cy).setDepth(depth + 1);
    for (let i = 0; i < RINGS; i++) {
      const box = scene.add.container(0, 0);
      const hue = GEM_HUES[(i * 3) % GEM_HUES.length]!;
      const hue2 = GEM_HUES[(i * 3 + 4) % GEM_HUES.length]!;
      // A square frame: gems on the corners (turned) and along the sides.
      for (let k = 0; k < 8; k++) {
        const corner = k % 2 === 0;
        const a = (k / 8) * Math.PI * 2 + Math.PI / 4;
        const r = corner ? 1.41 : 1;
        const shape = (i + k) % GemArt.SHAPES;
        const img = scene.add.image(Math.cos(a) * r * 50, Math.sin(a) * r * 50, GemArt.KEY, art.gem(corner ? hue : hue2, shape));
        img.setRotation(a + Math.PI / 2).setScale(46 / art.gemLength(shape));
        box.add(img);
      }
      this.root.add(box);
      this.rings.push({ box, phase: i / RINGS });
    }
    this.mask = scene.make.graphics({}, false);
    this.mask.fillStyle(0xffffff, 1);
    arch(this.mask, 6);
    this.root.setMask(this.mask.createGeometryMask());
    this.update(0);
  }

  update(dtMs: number): void {
    this.t += (dtMs / 1000) * (this.calm ? 0.25 : 1);
    const half = (this.w / 2) * RADIUS;
    for (const r of this.rings) {
      // Each frame grows out of the depth, turns, and fades at the rim.
      const u = (this.t * 0.16 + r.phase) % 1;
      const size = Math.pow(u, 1.6) * half;
      const fade = Math.min(1, u * 5) * (1 - Math.max(0, (u - 0.8) / 0.2));
      r.box.setScale(size / 50).setRotation(this.t * 0.25 + u * 1.2).setAlpha(0.95 * fade);
      r.box.setDepth(u);
    }
    this.root.sort('depth');
  }

  destroy(): void {
    this.root.destroy(true);
    this.glow.destroy();
    this.mask.destroy();
  }
}
