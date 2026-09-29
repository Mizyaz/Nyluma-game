import type * as Phaser from 'phaser';
import { addStaticCanvas, artCanvas } from '../art/TextureFactory';

/** Texture with Gorti's flowers: frames `bud{i}` and `open{i}`. */
export const BLOOM_KEY = 'fx.blooms';
/** Pastel petal colours (painted in: they show in both renderers). */
export const BLOOM_COLORS = ['#f4a6c9', '#bfa5f2', '#f8c49c', '#a3d4f5'] as const;
/** Logical cell size; drawn at twice the resolution. */
export const BLOOM_CELL = { w: 96, h: 128, footY: 122 } as const;

const INK = '#191728';
const RES = 2;

function stem(x: CanvasRenderingContext2D): void {
  x.lineCap = 'round';
  x.strokeStyle = INK;
  x.lineWidth = 6;
  x.beginPath();
  x.moveTo(0, 0);
  x.quadraticCurveTo(-7, -38, 3, -72);
  x.stroke();
  x.strokeStyle = '#6f9a5b';
  x.lineWidth = 3;
  x.stroke();
  for (const [lx, ly, rot] of [
    [-5, -30, -0.9],
    [3, -46, 0.8],
  ] as const) {
    x.save();
    x.translate(lx, ly);
    x.rotate(rot);
    x.beginPath();
    x.ellipse(lx < 0 ? -9 : 9, 0, 10, 4.5, 0, 0, Math.PI * 2);
    x.fillStyle = '#86b36b';
    x.fill();
    x.lineWidth = 2.2;
    x.strokeStyle = INK;
    x.stroke();
    x.restore();
  }
}

function petal(x: CanvasRenderingContext2D, color: string, len: number, wid: number): void {
  const g = x.createLinearGradient(0, 0, 0, -len);
  g.addColorStop(0, '#fff7f0');
  g.addColorStop(0.35, color);
  g.addColorStop(1, color);
  x.beginPath();
  x.ellipse(0, -len / 2, wid, len / 2, 0, 0, Math.PI * 2);
  x.fillStyle = g;
  x.fill();
  x.lineWidth = 2.2;
  x.strokeStyle = INK;
  x.stroke();
}

function bud(x: CanvasRenderingContext2D, color: string): void {
  x.save();
  x.translate(3, -72);
  for (const r of [-0.35, 0.35, 0]) {
    x.save();
    x.rotate(r);
    petal(x, color, 26, 7.5);
    x.restore();
  }
  x.restore();
}

function bloom(x: CanvasRenderingContext2D, color: string): void {
  x.save();
  x.translate(3, -74);
  const n = 7;
  for (let i = 0; i < n; i++) {
    x.save();
    x.rotate((i / n) * Math.PI * 2);
    x.translate(0, -5);
    petal(x, color, 22, 8);
    x.restore();
  }
  x.beginPath();
  x.arc(0, 0, 8.5, 0, Math.PI * 2);
  x.fillStyle = '#f6d57a';
  x.fill();
  x.lineWidth = 2.2;
  x.strokeStyle = INK;
  x.stroke();
  x.fillStyle = '#c98a3c';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    x.beginPath();
    x.arc(Math.cos(a) * 4, Math.sin(a) * 4, 1.2, 0, Math.PI * 2);
    x.fill();
  }
  x.restore();
}

/** Draws the flower sheet once per game. */
export function ensureMoveArt(textures: Phaser.Textures.TextureManager): void {
  if (textures.exists(BLOOM_KEY)) return;
  const { w, h, footY } = BLOOM_CELL;
  const n = BLOOM_COLORS.length;
  const [c, x] = artCanvas(w * RES * n * 2, h * RES);
  BLOOM_COLORS.forEach((color, i) => {
    for (const [slot, draw] of [
      [i, bud],
      [n + i, bloom],
    ] as const) {
      x.save();
      x.setTransform(RES, 0, 0, RES, (slot * w + w / 2) * RES, footY * RES);
      stem(x);
      draw(x, color);
      x.restore();
    }
  });
  const t = addStaticCanvas(textures, BLOOM_KEY, c);
  for (let i = 0; i < n; i++) {
    t?.add(`bud${i}`, 0, i * w * RES, 0, w * RES, h * RES);
    t?.add(`open${i}`, 0, (n + i) * w * RES, 0, w * RES, h * RES);
  }
}
