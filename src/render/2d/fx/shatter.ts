import * as Phaser from 'phaser';
import { DEPTH } from '../../../engine/constants';

// Breaking a drawn thing: its picture splits into pieces that fly off, spin
// and fall, with a few inked paper shards between them (comic debris). The
// pieces are cut from the thing's own texture, so whatever breaks, breaks as
// itself.

const INK = 0x231a2b;
const GRAVITY = 1500;

interface Piece {
  obj: Phaser.GameObjects.Image | Phaser.GameObjects.Graphics;
  vx: number;
  vy: number;
  spin: number;
}

/** Breaks `img` (hidden here) into flying pieces; `color` tints the shards. */
export function shatter(scene: Phaser.Scene, img: Phaser.GameObjects.Image, color: number, groundY: number): void {
  const pieces: Piece[] = [];
  const fw = img.frame.realWidth;
  const fh = img.frame.realHeight;
  const sx = img.scaleX;
  const sy = img.scaleY;
  const left = img.x - img.originX * fw * sx;
  const top = img.y - img.originY * fh * sy;
  const cx = img.x;
  const cy = top + (fh * sy) / 2;
  const cols = 3;
  const rows = 3;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const w = fw / cols;
      const h = fh / rows;
      const px = c * w;
      const py = r * h;
      const p = scene.add.image(0, 0, img.texture.key, img.frame.name);
      p.setOrigin((px + w / 2) / fw, (py + h / 2) / fh).setScale(sx, sy).setFlipX(img.flipX);
      p.setCrop(img.flipX ? fw - px - w : px, py, w, h);
      const wx = left + (img.flipX ? fw - px - w / 2 : px + w / 2) * sx;
      const wy = top + (py + h / 2) * sy;
      p.setPosition(wx, wy).setDepth(DEPTH.fx - 1);
      const dx = wx - cx;
      pieces.push({ obj: p, vx: dx * 3.2 + (Math.random() - 0.5) * 260, vy: -380 - Math.random() * 420 + (wy - cy) * 1.5, spin: (Math.random() - 0.5) * 9 });
    }
  }
  for (let i = 0; i < 9; i++) {
    const g = scene.add.graphics().setDepth(DEPTH.fx);
    const n = 3 + Math.floor(Math.random() * 3);
    const rad = 7 + Math.random() * 12;
    const pts: Phaser.Math.Vector2[] = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + Math.random() * 0.7;
      pts.push(new Phaser.Math.Vector2(Math.cos(a) * rad * (0.6 + Math.random() * 0.5), Math.sin(a) * rad * (0.6 + Math.random() * 0.5)));
    }
    g.fillStyle(color, 1).fillPoints(pts, true).lineStyle(2.5, INK, 1).strokePoints(pts, true, true);
    g.setPosition(cx + (Math.random() - 0.5) * fw * sx * 0.6, cy + (Math.random() - 0.5) * fh * sy * 0.6);
    pieces.push({ obj: g, vx: (Math.random() - 0.5) * 900, vy: -500 - Math.random() * 500, spin: (Math.random() - 0.5) * 14 });
  }
  img.setVisible(false);
  let t = 0;
  const step = (_: number, dtMs: number): void => {
    const dt = Math.min(dtMs, 40) / 1000;
    t += dt;
    for (const p of pieces) {
      p.vy += GRAVITY * dt;
      p.obj.x += p.vx * dt;
      p.obj.y += p.vy * dt;
      // Pieces bounce once on the ground and slide to a stop.
      if (p.obj.y > groundY && p.vy > 0) {
        p.obj.y = groundY;
        p.vy *= -0.3;
        p.vx *= 0.55;
        p.spin *= 0.5;
      }
      p.obj.rotation += p.spin * dt;
      if (t > 0.9) p.obj.setAlpha(Math.max(0, 1 - (t - 0.9) / 0.5));
    }
    if (t > 1.4) {
      scene.events.off(Phaser.Scenes.Events.UPDATE, step);
      for (const p of pieces) p.obj.destroy();
    }
  };
  scene.events.on(Phaser.Scenes.Events.UPDATE, step);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.events.off(Phaser.Scenes.Events.UPDATE, step));
}
