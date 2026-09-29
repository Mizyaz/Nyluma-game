import type * as Phaser from 'phaser';
import { artCanvas, registerCanvas } from './TextureFactory';

// Small procedural effect textures (particles, glows, rings). Generated once.

function radial(size: number, stops: [number, string][]): HTMLCanvasElement {
  const [c, x] = artCanvas(size, size);
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) g.addColorStop(o, col);
  x.fillStyle = g;
  x.fillRect(0, 0, size, size);
  return c;
}

export function makeFxTextures(tex: Phaser.Textures.TextureManager): void {
  const reg = (key: string, c: HTMLCanvasElement): void => {
    registerCanvas(tex, key, c, { w: c.width, h: c.height, px: c.width / 2, py: c.height / 2 });
  };
  reg('fx.dot', radial(32, [[0, 'rgba(255,255,255,1)'], [0.4, 'rgba(255,255,255,0.6)'], [1, 'rgba(255,255,255,0)']]));
  reg('fx.glow', radial(128, [[0, 'rgba(255,255,255,0.9)'], [0.3, 'rgba(255,255,255,0.35)'], [1, 'rgba(255,255,255,0)']]));
  {
    const [c, x] = artCanvas(128, 128);
    x.strokeStyle = '#ffffff';
    x.lineWidth = 6;
    x.beginPath();
    x.arc(64, 64, 58, 0, Math.PI * 2);
    x.stroke();
    reg('fx.ring', c);
  }
  {
    const [c, x] = artCanvas(32, 32);
    x.fillStyle = '#ffffff';
    x.beginPath();
    x.moveTo(16, 0);
    x.quadraticCurveTo(18, 14, 32, 16);
    x.quadraticCurveTo(18, 18, 16, 32);
    x.quadraticCurveTo(14, 18, 0, 16);
    x.quadraticCurveTo(14, 14, 16, 0);
    x.fill();
    reg('fx.spark', c);
  }
  {
    const [c, x] = artCanvas(18, 12);
    x.fillStyle = '#ffffff';
    x.strokeStyle = '#191728';
    x.lineWidth = 1.5;
    x.beginPath();
    x.ellipse(9, 6, 7.5, 4.2, 0.3, 0, Math.PI * 2);
    x.fill();
    x.stroke();
    reg('fx.petal', c);
  }
  {
    const [c, x] = artCanvas(10, 16);
    x.fillStyle = '#ffffff';
    x.beginPath();
    x.moveTo(5, 0);
    x.quadraticCurveTo(10, 10, 5, 16);
    x.quadraticCurveTo(0, 10, 5, 0);
    x.fill();
    reg('fx.drop', c);
  }
  {
    const [c, x] = artCanvas(64, 4);
    const g = x.createLinearGradient(0, 0, 64, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.8)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
    x.fillRect(0, 1, 64, 2);
    reg('fx.streak', c);
  }
  {
    // Soft vignette used for focus / cutscene framing.
    const [c, x] = artCanvas(256, 144);
    const g = x.createRadialGradient(128, 72, 40, 128, 72, 150);
    g.addColorStop(0, 'rgba(25,23,40,0)');
    g.addColorStop(1, 'rgba(25,23,40,1)');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 144);
    reg('fx.vignette', c);
  }
  {
    // 1px white for tinted rectangles (beams, fades).
    const [c, x] = artCanvas(4, 4);
    x.fillStyle = '#fff';
    x.fillRect(0, 0, 4, 4);
    reg('fx.white', c);
  }
  {
    // Faceted crystal (white, tinted at runtime): warp tube, step sprouts.
    const [c, x] = artCanvas(40, 96);
    const facet = (pts: [number, number][], fill: string): void => {
      x.beginPath();
      x.moveTo(pts[0]![0], pts[0]![1]);
      for (const [px, py] of pts.slice(1)) x.lineTo(px, py);
      x.closePath();
      x.fillStyle = fill;
      x.fill();
    };
    facet([[20, 2], [36, 30], [30, 94], [10, 94], [4, 30]], '#d9d9e8');
    facet([[20, 2], [4, 30], [10, 94], [17, 94], [15, 30]], '#ffffff');
    facet([[20, 2], [36, 30], [30, 94], [25, 94], [27, 32]], '#9d9db4');
    facet([[20, 2], [15, 30], [27, 32]], '#f3f3ff');
    x.strokeStyle = 'rgba(25,23,40,0.85)';
    x.lineWidth = 2.5;
    x.lineJoin = 'round';
    x.beginPath();
    x.moveTo(20, 2);
    x.lineTo(36, 30);
    x.lineTo(30, 94);
    x.lineTo(10, 94);
    x.lineTo(4, 30);
    x.closePath();
    x.stroke();
    registerCanvas(tex, 'fx.crystal', c, { w: 40, h: 96, px: 20, py: 94 });
  }
  {
    // Glowing shard for the additive crystal tube: soft halo around a bright
    // faceted core, no outline (it is drawn with light, not ink).
    const [c, x] = artCanvas(48, 112);
    const body = (): void => {
      x.beginPath();
      x.moveTo(24, 6);
      x.lineTo(35, 40);
      x.lineTo(24, 106);
      x.lineTo(13, 40);
      x.closePath();
    };
    x.save();
    x.shadowColor = 'rgba(255,255,255,0.9)';
    x.shadowBlur = 12;
    x.fillStyle = 'rgba(255,255,255,0.55)';
    body();
    x.fill();
    x.restore();
    const g = x.createLinearGradient(13, 0, 35, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.45, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0.35)');
    x.fillStyle = g;
    body();
    x.fill();
    registerCanvas(tex, 'fx.shard', c, { w: 48, h: 112, px: 24, py: 56 });
  }
  // Soft contact shadow (2.5D grounding).
  {
    const [c, x] = artCanvas(128, 40);
    const g = x.createRadialGradient(64, 20, 0, 64, 20, 64);
    g.addColorStop(0, 'rgba(8,6,14,0.75)');
    g.addColorStop(0.55, 'rgba(8,6,14,0.35)');
    g.addColorStop(1, 'rgba(8,6,14,0)');
    x.setTransform(1, 0, 0, 40 / 128, 0, 0);
    x.fillStyle = g;
    x.fillRect(0, 0, 128, 128);
    reg('fx.shadow', c);
  }
}
