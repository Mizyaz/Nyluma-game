import type * as Phaser from 'phaser';
import { registerCanvas } from './TextureFactory';

// Small procedural effect textures (particles, glows, rings). Generated once.

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function radial(size: number, stops: [number, string][]): HTMLCanvasElement {
  const [c, x] = canvas(size, size);
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
    const [c, x] = canvas(128, 128);
    x.strokeStyle = '#ffffff';
    x.lineWidth = 6;
    x.beginPath();
    x.arc(64, 64, 58, 0, Math.PI * 2);
    x.stroke();
    reg('fx.ring', c);
  }
  {
    const [c, x] = canvas(32, 32);
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
    const [c, x] = canvas(18, 12);
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
    const [c, x] = canvas(10, 16);
    x.fillStyle = '#ffffff';
    x.beginPath();
    x.moveTo(5, 0);
    x.quadraticCurveTo(10, 10, 5, 16);
    x.quadraticCurveTo(0, 10, 5, 0);
    x.fill();
    reg('fx.drop', c);
  }
  {
    const [c, x] = canvas(64, 4);
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
    const [c, x] = canvas(256, 144);
    const g = x.createRadialGradient(128, 72, 40, 128, 72, 150);
    g.addColorStop(0, 'rgba(25,23,40,0)');
    g.addColorStop(1, 'rgba(25,23,40,1)');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 144);
    reg('fx.vignette', c);
  }
  {
    // 1px white for tinted rectangles (beams, fades).
    const [c, x] = canvas(4, 4);
    x.fillStyle = '#fff';
    x.fillRect(0, 0, 4, 4);
    reg('fx.white', c);
  }
}
