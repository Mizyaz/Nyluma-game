import type * as Phaser from 'phaser';
import { addStaticCanvas, artCanvas } from '../art/TextureFactory';
import { INK, OUTLINE, PASTEL } from '../art/style';

// The flowers of Gorti's Rezonans, drawn as separate pieces so they can
// grow, open, shed their petals and wilt: in the author's manner (thin black
// contours, flat pastel fills, a few coloured-pencil strokes).

/** Texture holding every piece (see `pieces()` for the frame names). */
export const BLOOM_KEY = 'fx.blooms';
/** Petal colours (painted in: they show in both renderers). */
export const BLOOM_COLORS = [PASTEL.pink, PASTEL.lilac, PASTEL.apricot, PASTEL.aqua] as const;
/** Pixels per logical unit in the sheet. */
export const BLOOM_RES = 2;
/** Length of the stem, logical px (at size 1). */
export const STEM_LEN = 78;

/** A piece of the sheet: its cell and its pivot (logical px inside the cell). */
interface Piece {
  w: number;
  h: number;
  px: number;
  py: number;
  draw: (x: CanvasRenderingContext2D) => void;
}

const STEM = '#8fbf73';
const LEAF = PASTEL.leaf;
const HEART = PASTEL.butter;
const SOIL = PASTEL.bark;

/** A few short pencil strokes inside the current path. */
function grain(x: CanvasRenderingContext2D, color: string, w: number, h: number, n = 10): void {
  x.save();
  x.clip();
  x.strokeStyle = color;
  x.lineWidth = 1;
  x.globalAlpha = 0.35;
  for (let i = 0; i < n; i++) {
    const sx = (Math.random() - 0.5) * w;
    const sy = (Math.random() - 0.5) * h;
    x.beginPath();
    x.moveTo(sx - 3, sy + 3);
    x.lineTo(sx + 3, sy - 3);
    x.stroke();
  }
  x.restore();
}

function outline(x: CanvasRenderingContext2D, w = OUTLINE): void {
  x.lineWidth = w;
  x.lineJoin = 'round';
  x.lineCap = 'round';
  x.strokeStyle = INK;
  x.stroke();
}

function darker(hex: string, k = 0.78): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * k);
  const g = Math.round(((n >> 8) & 255) * k);
  const b = Math.round((n & 255) * k);
  return `rgb(${r},${g},${b})`;
}

const stem: Piece = {
  w: 16,
  h: STEM_LEN + 4,
  px: 8,
  py: STEM_LEN + 2,
  draw: (x) => {
    x.beginPath();
    x.moveTo(-2.2, 0);
    x.quadraticCurveTo(-4, -STEM_LEN * 0.5, -1.4, -STEM_LEN);
    x.lineTo(1.4, -STEM_LEN);
    x.quadraticCurveTo(-1, -STEM_LEN * 0.5, 2.2, 0);
    x.closePath();
    x.fillStyle = STEM;
    x.fill();
    outline(x, 1.6);
  },
};

function leaf(side: 1 | -1): Piece {
  const path = (x: CanvasRenderingContext2D): void => {
    x.beginPath();
    x.moveTo(0, 0);
    x.quadraticCurveTo(10, -9, 25, -1);
    x.quadraticCurveTo(11, 7, 0, 0);
    x.closePath();
  };
  return {
    w: 30,
    h: 16,
    px: side > 0 ? 2 : 28,
    py: 8,
    draw: (x) => {
      x.save();
      x.scale(side, 1);
      path(x);
      x.fillStyle = LEAF;
      x.fill();
      grain(x, darker(LEAF), 50, 20, 8);
      x.beginPath();
      x.moveTo(0, 0);
      x.quadraticCurveTo(11, -2, 22, -1);
      x.strokeStyle = INK;
      x.lineWidth = 1;
      x.stroke();
      path(x);
      outline(x, 1.6);
      x.restore();
    },
  };
}

function petalPath(x: CanvasRenderingContext2D): void {
  x.beginPath();
  x.moveTo(0, 0);
  x.bezierCurveTo(-9, -8, -8, -24, 0, -26);
  x.bezierCurveTo(8, -24, 9, -8, 0, 0);
  x.closePath();
}

function petal(color: string): Piece {
  return {
    w: 18,
    h: 30,
    px: 9,
    py: 28,
    draw: (x) => {
      petalPath(x);
      x.fillStyle = color;
      x.fill();
      grain(x, darker(color), 20, 30, 9);
      x.beginPath();
      x.moveTo(0, -3);
      x.lineTo(0, -15);
      x.strokeStyle = darker(color, 0.62);
      x.lineWidth = 1;
      x.stroke();
      petalPath(x);
      outline(x, 1.6);
    },
  };
}

function bud(color: string): Piece {
  const path = (x: CanvasRenderingContext2D): void => {
    x.beginPath();
    x.moveTo(0, 0);
    x.bezierCurveTo(-7, -7, -6, -20, 0, -23);
    x.bezierCurveTo(6, -20, 7, -7, 0, 0);
    x.closePath();
  };
  return {
    w: 22,
    h: 30,
    px: 11,
    py: 28,
    draw: (x) => {
      for (const r of [-0.32, 0.32, 0]) {
        x.save();
        x.rotate(r);
        path(x);
        x.fillStyle = r === 0 ? color : darker(color, 0.9);
        x.fill();
        grain(x, darker(color), 16, 26, 6);
        path(x);
        outline(x, 1.5);
        x.restore();
      }
      // The green cup it sits in.
      x.beginPath();
      x.moveTo(-6, -2);
      x.quadraticCurveTo(0, 5, 6, -2);
      x.quadraticCurveTo(0, -6, -6, -2);
      x.fillStyle = STEM;
      x.fill();
      outline(x, 1.4);
    },
  };
}

const heart: Piece = {
  w: 20,
  h: 20,
  px: 10,
  py: 10,
  draw: (x) => {
    x.beginPath();
    x.arc(0, 0, 7.5, 0, Math.PI * 2);
    x.fillStyle = HEART;
    x.fill();
    grain(x, darker(HEART), 16, 16, 7);
    x.beginPath();
    x.arc(0, 0, 7.5, 0, Math.PI * 2);
    outline(x, 1.6);
    x.fillStyle = darker(HEART, 0.6);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      x.beginPath();
      x.arc(Math.cos(a) * 3.8, Math.sin(a) * 3.8, 0.9, 0, Math.PI * 2);
      x.fill();
    }
  },
};

const seed: Piece = {
  w: 12,
  h: 14,
  px: 6,
  py: 7,
  draw: (x) => {
    x.beginPath();
    x.moveTo(0, -5.5);
    x.quadraticCurveTo(4.5, 0, 0, 5.5);
    x.quadraticCurveTo(-4.5, 0, 0, -5.5);
    x.fillStyle = PASTEL.barkDeep;
    x.fill();
    outline(x, 1.3);
  },
};

const pollen: Piece = {
  w: 8,
  h: 8,
  px: 4,
  py: 4,
  draw: (x) => {
    x.beginPath();
    x.arc(0, 0, 2.2, 0, Math.PI * 2);
    x.fillStyle = HEART;
    x.fill();
    outline(x, 1);
  },
};

const mound: Piece = {
  w: 40,
  h: 14,
  px: 20,
  py: 12,
  draw: (x) => {
    const path = (): void => {
      x.beginPath();
      x.moveTo(-17, 0);
      x.quadraticCurveTo(-9, -10, 0, -10);
      x.quadraticCurveTo(9, -10, 17, 0);
      x.closePath();
    };
    path();
    x.fillStyle = SOIL;
    x.fill();
    grain(x, darker(SOIL), 34, 12, 9);
    path();
    outline(x, 1.6);
  },
};

/** Every piece by frame name. */
function pieces(): Record<string, Piece> {
  const out: Record<string, Piece> = { stem, leafL: leaf(-1), leafR: leaf(1), heart, seed, pollen, mound };
  BLOOM_COLORS.forEach((c, i) => {
    out[`petal${i}`] = petal(c);
    out[`bud${i}`] = bud(c);
  });
  return out;
}

/** Pivot of each frame as an origin (0..1), filled when the sheet is painted. */
export const FLOWER_ORIGIN: Record<string, { ox: number; oy: number }> = {};

/** Paints the flower sheet once per game. */
export function ensureMoveArt(textures: Phaser.Textures.TextureManager): void {
  const all = Object.entries(pieces());
  for (const [name, p] of all) FLOWER_ORIGIN[name] = { ox: p.px / p.w, oy: p.py / p.h };
  if (textures.exists(BLOOM_KEY)) return;
  const pad = 4;
  const width = all.reduce((s, [, p]) => s + (p.w + pad) * BLOOM_RES, 0);
  const height = Math.max(...all.map(([, p]) => p.h)) * BLOOM_RES;
  const [c, x] = artCanvas(width, height);
  let cx = 0;
  const cells: [string, number, Piece][] = [];
  for (const [name, p] of all) {
    x.save();
    x.setTransform(BLOOM_RES, 0, 0, BLOOM_RES, cx + p.px * BLOOM_RES, p.py * BLOOM_RES);
    p.draw(x);
    x.restore();
    cells.push([name, cx, p]);
    cx += (p.w + pad) * BLOOM_RES;
  }
  const t = addStaticCanvas(textures, BLOOM_KEY, c);
  for (const [name, x0, p] of cells) t?.add(name, 0, x0, 0, p.w * BLOOM_RES, p.h * BLOOM_RES);
}
