import type * as Phaser from 'phaser';
import { addStaticCanvas, artCanvas } from '../TextureFactory';

// Light drawn as light: white, to be tinted and added (ADD blend) over what
// is behind. The Sun's and the Moon's halos and beams use them, and the
// glow about Gorti's screen face.

/** The halo texture's size (px). */
export const HALO_PX = 256;

/** White light to tint: a round halo, and a beam that widens and fades away from its source (left). */
export function lightTextures(textures: Phaser.Textures.TextureManager): void {
  if (!textures.exists('fx.halo')) {
    const n = HALO_PX;
    const [c, ctx] = artCanvas(n, n);
    const g = ctx.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.22, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.18)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, n, n);
    addStaticCanvas(textures, 'fx.halo', c);
  }
  if (!textures.exists('fx.beam')) {
    const w = 256;
    const h = 64;
    const [c, ctx] = artCanvas(w, h);
    const img = ctx.createImageData(w, h);
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1);
      // In from behind the face, then away to nothing.
      const along = Math.min(1, u / 0.14) ** 2 * (1 - u) ** 1.6;
      const half = 0.22 + 0.78 * u;
      for (let y = 0; y < h; y++) {
        const v = (y / (h - 1)) * 2 - 1;
        const a = along * Math.exp(-((v / half) ** 2) * 3.2);
        const o = (y * w + x) * 4;
        img.data[o] = img.data[o + 1] = img.data[o + 2] = 255;
        img.data[o + 3] = Math.round(255 * a);
      }
    }
    ctx.putImageData(img, 0, 0);
    addStaticCanvas(textures, 'fx.beam', c);
  }
}
