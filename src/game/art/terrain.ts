import { P } from './palette';
import { Rng, type Pt } from './svg';
import type { SolidDef, SolidStyle } from '../data/roomTypes';

// Canvas painter for collision-aligned terrain. The top edge of every piece
// stays within ±2 px of the collider top so feet read as grounded; sides and
// undersides wobble freely. Decoration is seeded per piece.

export interface StyleColors {
  base: string;
  shade: string;
  light: string;
  top: string;
  topShade: string;
  detail: string;
  accent: string;
}

export type TerrainPalette = Partial<Record<SolidStyle, Partial<StyleColors>>>;

const DEFAULTS: Record<SolidStyle, StyleColors> = {
  soil: { base: '#3a3550', shade: '#2a2640', light: '#4a4463', top: '#4c4466', topShade: '#3d3656', detail: '#2a2640', accent: P.crystalTeal },
  root: { base: P.bark, shade: P.barkDark, light: P.barkLight, top: '#806c83', topShade: P.barkDark, detail: '#4a3c50', accent: P.violet },
  crystal: { base: P.crystalTeal, shade: P.crystalTealDark, light: P.crystalTealLight, top: P.crystalTealLight, topShade: P.crystalTeal, detail: '#2d7b70', accent: '#e8fffb' },
  wood: { base: '#7a5a44', shade: '#5c4232', light: '#98765c', top: '#8d6a50', topShade: '#6b4f3c', detail: '#4d3628', accent: P.crystalOrange },
  stone: { base: '#6a6478', shade: '#4f4a5d', light: '#857f93', top: '#79738a', topShade: '#5f596f', detail: '#443f52', accent: P.crystalBlue },
  moss: { base: '#3a3446', shade: '#2a2536', light: '#4a4358', top: '#3f6b5e', topShade: '#2d4d45', detail: '#28222f', accent: P.crystalBlue },
  floor: { base: '#6e5140', shade: '#533c30', light: '#87654f', top: '#8a6a52', topShade: '#6e5140', detail: '#4a3428', accent: P.ivory },
  metal: { base: P.metal, shade: P.metalDark, light: P.metalLight, top: '#5d6475', topShade: P.metalDark, detail: '#262a33', accent: '#9aa3b8' },
  bed: { base: '#6e5140', shade: '#533c30', light: '#87654f', top: '#8a6a52', topShade: '#6e5140', detail: '#4a3428', accent: P.ivory },
  office: { base: '#8c8578', shade: '#6f695e', light: '#a39c8e', top: '#9d968a', topShade: '#7c766b', detail: '#5d584f', accent: '#c9c1b0' },
  none: { base: '#000', shade: '#000', light: '#000', top: '#000', topShade: '#000', detail: '#000', accent: '#000' },
};

export function colorsFor(style: SolidStyle, pal?: TerrainPalette): StyleColors {
  return { ...DEFAULTS[style], ...(pal?.[style] ?? {}) };
}

export const TERRAIN_MARGIN = 26;

/** Outline in solid-local coordinates (0,0 = collider top-left). */
function outline(w: number, h: number, rng: Rng, thin: boolean): Pt[] {
  const pts: Pt[] = [];
  const step = thin ? 18 : 26;
  const r = Math.min(thin ? h * 0.45 : 12, w / 3, h / 2);
  // top edge (left → right), tight wobble
  const nTop = Math.max(2, Math.round((w - 2 * r) / step));
  pts.push([0, r]);
  pts.push([r * 0.3, r * 0.3]);
  for (let i = 0; i <= nTop; i++) {
    const x = r + ((w - 2 * r) * i) / nTop;
    pts.push([x, rng.range(-1.6, 1.2)]);
  }
  pts.push([w - r * 0.3, r * 0.3]);
  // right edge (top → bottom)
  const nSide = Math.max(1, Math.round((h - 2 * r) / step));
  for (let i = 0; i <= nSide; i++) {
    const y = r + ((h - 2 * r) * i) / nSide;
    pts.push([w + (thin ? 0 : rng.range(-4, 3)), y]);
  }
  pts.push([w - r * 0.3, h - r * 0.3]);
  // bottom (right → left)
  for (let i = nTop; i >= 0; i--) {
    const x = r + ((w - 2 * r) * i) / nTop;
    pts.push([x, h + (thin ? rng.range(-1, 2) : rng.range(-3, 5))]);
  }
  pts.push([r * 0.3, h - r * 0.3]);
  for (let i = nSide; i >= 0; i--) {
    const y = r + ((h - 2 * r) * i) / nSide;
    pts.push([thin ? 0 : rng.range(-3, 4), y]);
  }
  return pts;
}

function tracePath(ctx: CanvasRenderingContext2D, pts: readonly Pt[], dx = 0, dy = 0): void {
  const n = pts.length;
  ctx.beginPath();
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(pts[n - 1]!, pts[0]!);
  ctx.moveTo(start[0] + dx, start[1] + dy);
  for (let i = 0; i < n; i++) {
    const p = pts[i]!;
    const m = mid(p, pts[(i + 1) % n]!);
    ctx.quadraticCurveTo(p[0] + dx, p[1] + dy, m[0] + dx, m[1] + dy);
  }
  ctx.closePath();
}

function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot = 0): void {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
}

function crystalShard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  lean: number,
  c: { fill: string; shade: string; light: string },
  trapped: boolean,
  rng: Rng,
): void {
  const w = h * 0.34;
  const tipX = x + lean * h;
  const tipY = y - h;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.lineTo(x - w / 2 + lean * h * 0.7, y - h * 0.72);
  ctx.lineTo(tipX, tipY);
  ctx.lineTo(x + w / 2 + lean * h * 0.7, y - h * 0.72);
  ctx.lineTo(x + w / 2, y);
  ctx.closePath();
  ctx.fillStyle = c.fill;
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = c.shade;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(x + w / 2 + lean * h * 0.7, y - h * 0.72);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x + lean * h * 0.2, y);
  ctx.closePath();
  ctx.fill();
  if (trapped) {
    // A creature's silhouette locked inside the crystal.
    ctx.fillStyle = 'rgba(25,23,40,0.55)';
    const cx = x + lean * h * 0.4;
    const cy = y - h * 0.4;
    if (rng.chance(0.5)) {
      ellipse(ctx, cx, cy, w * 0.26, w * 0.12, -0.4);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.22, cy + w * 0.08);
      ctx.lineTo(cx - w * 0.38, cy - w * 0.04);
      ctx.lineTo(cx - w * 0.36, cy + w * 0.2);
      ctx.fill();
    } else {
      ellipse(ctx, cx, cy, w * 0.14, w * 0.1, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.05, cy);
      ctx.lineTo(cx - w * 0.3, cy - w * 0.18);
      ctx.lineTo(cx + w * 0.05, cy - w * 0.05);
      ctx.fill();
    }
  }
  ctx.strokeStyle = c.light;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - w / 2 + 2 + lean * h * 0.6, y - h * 0.62);
  ctx.lineTo(tipX - 1, tipY + 4);
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = P.ink;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.lineTo(x - w / 2 + lean * h * 0.7, y - h * 0.72);
  ctx.lineTo(tipX, tipY);
  ctx.lineTo(x + w / 2 + lean * h * 0.7, y - h * 0.72);
  ctx.lineTo(x + w / 2, y);
  ctx.stroke();
}

export const CRYSTAL_COLORS = {
  blue: { fill: P.crystalBlue, shade: P.crystalBlueDark, light: P.crystalBlueLight },
  teal: { fill: P.crystalTeal, shade: P.crystalTealDark, light: P.crystalTealLight },
  orange: { fill: P.crystalOrange, shade: P.crystalOrangeDark, light: P.crystalOrangeLight },
  violet: { fill: P.violet, shade: P.violetDark, light: P.vein },
};

function details(ctx: CanvasRenderingContext2D, style: SolidStyle, w: number, h: number, c: StyleColors, rng: Rng, thin: boolean): void {
  const area = w * Math.min(h, 400);
  switch (style) {
    case 'soil':
    case 'moss': {
      const n = Math.floor(area / 5000);
      for (let i = 0; i < n; i++) {
        const x = rng.range(10, w - 10);
        const y = rng.range(22, Math.min(h, 420) - 6);
        const r = rng.range(3, 8);
        ellipse(ctx, x, y, r, r * rng.range(0.5, 0.8), rng.range(0, 3));
        ctx.fillStyle = c.light;
        ctx.fill();
        ctx.strokeStyle = c.detail;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      // Fossilised root threads.
      const roots = Math.floor(area / 26000) + 1;
      ctx.strokeStyle = c.detail;
      for (let i = 0; i < roots; i++) {
        let x = rng.range(0, w);
        let y = rng.range(26, Math.min(h, 420));
        ctx.lineWidth = rng.range(2, 4);
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let k = 0; k < 4; k++) {
          const nx = x + rng.range(-60, 60);
          const ny = y + rng.range(-10, 30);
          ctx.quadraticCurveTo((x + nx) / 2 + rng.range(-20, 20), (y + ny) / 2, nx, ny);
          x = nx;
          y = ny;
        }
        ctx.stroke();
      }
      // Embedded crystals (sometimes holding trapped creatures).
      const cr = Math.floor(area / 60000);
      for (let i = 0; i < cr; i++) {
        const x = rng.range(24, w - 24);
        const y = rng.range(60, Math.min(h, 400));
        if (y > h - 10) continue;
        const col = rng.pick([CRYSTAL_COLORS.blue, CRYSTAL_COLORS.teal, CRYSTAL_COLORS.teal, CRYSTAL_COLORS.orange]);
        crystalShard(ctx, x, y, rng.range(18, 34), rng.range(-0.3, 0.3), col, rng.chance(0.45), rng);
      }
      break;
    }
    case 'root': {
      ctx.strokeStyle = c.detail;
      ctx.lineWidth = 1.6;
      const lines = Math.max(2, Math.floor(h / 9));
      for (let i = 0; i < lines; i++) {
        const y = ((i + 0.6) / lines) * h + rng.range(-2, 2);
        ctx.beginPath();
        let x = rng.range(4, 30);
        ctx.moveTo(x, y);
        while (x < w - 10) {
          const nx = Math.min(w - 6, x + rng.range(30, 90));
          ctx.quadraticCurveTo((x + nx) / 2, y + rng.range(-3, 3), nx, y + rng.range(-1.5, 1.5));
          x = nx + rng.range(6, 30);
          ctx.moveTo(x, y + rng.range(-1, 1));
        }
        ctx.stroke();
      }
      const knots = Math.floor(w / 140);
      for (let i = 0; i < knots; i++) {
        const x = rng.range(14, w - 14);
        const y = rng.range(h * 0.3, h * 0.75);
        ellipse(ctx, x, y, rng.range(4, 7), rng.range(2.5, 4), 0);
        ctx.strokeStyle = c.detail;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      if (!thin && h > 40) {
        ctx.strokeStyle = c.accent;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(rng.range(10, w / 3), h * 0.5);
        ctx.quadraticCurveTo(w / 2, h * 0.3 + rng.range(-8, 8), w - rng.range(10, w / 3), h * 0.55);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      break;
    }
    case 'crystal': {
      ctx.strokeStyle = c.light;
      ctx.lineWidth = 1.5;
      const facets = Math.max(2, Math.floor(w / 40));
      for (let i = 0; i < facets; i++) {
        const x = (i + 0.5) * (w / facets) + rng.range(-6, 6);
        ctx.beginPath();
        ctx.moveTo(x, 2);
        ctx.lineTo(x + rng.range(-14, 14), h - 2);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(0, 2, w, Math.min(5, h / 3));
      break;
    }
    case 'wood':
    case 'floor':
    case 'bed': {
      ctx.strokeStyle = c.detail;
      ctx.lineWidth = 1.8;
      const plank = style === 'floor' ? 30 : 22;
      if (style === 'floor') {
        for (let y = plank; y < Math.min(h, 200); y += plank) {
          ctx.beginPath();
          ctx.moveTo(0, y + rng.range(-1, 1));
          ctx.lineTo(w, y + rng.range(-1, 1));
          ctx.stroke();
          for (let x = rng.range(20, 160); x < w; x += rng.range(120, 220)) {
            ctx.beginPath();
            ctx.moveTo(x, y - plank + 2);
            ctx.lineTo(x, y - 2);
            ctx.stroke();
          }
        }
      } else {
        for (let x = plank; x < w - 6; x += plank + rng.range(-3, 3)) {
          ctx.beginPath();
          ctx.moveTo(x, 4);
          ctx.lineTo(x + rng.range(-1, 1), h - 4);
          ctx.stroke();
        }
      }
      break;
    }
    case 'stone': {
      ctx.strokeStyle = c.detail;
      ctx.lineWidth = 1.8;
      const cracks = Math.max(1, Math.floor(w / 70));
      for (let i = 0; i < cracks; i++) {
        let x = rng.range(10, w - 10);
        let y = rng.range(6, h * 0.4);
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let k = 0; k < 3; k++) {
          x += rng.range(-10, 10);
          y += rng.range(6, 16);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      break;
    }
    case 'metal': {
      ctx.strokeStyle = c.detail;
      ctx.lineWidth = 2;
      const panel = 80;
      for (let x = panel; x < w; x += panel) {
        ctx.beginPath();
        ctx.moveTo(x, 6);
        ctx.lineTo(x, Math.min(h, 300));
        ctx.stroke();
      }
      ctx.fillStyle = c.accent;
      for (let x = 12; x < w; x += panel / 2) {
        ellipse(ctx, x, 12, 2, 2);
        ctx.fill();
      }
      ctx.strokeStyle = c.light;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(4, 20);
      ctx.lineTo(w - 4, 20);
      ctx.stroke();
      break;
    }
    case 'office': {
      ctx.strokeStyle = c.detail;
      ctx.lineWidth = 1.4;
      for (let x = 60; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 4);
        ctx.lineTo(x - 18, Math.min(h, 120));
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, 26);
      ctx.lineTo(w, 26);
      ctx.stroke();
      break;
    }
    default:
      break;
  }
}

function topDecor(ctx: CanvasRenderingContext2D, style: SolidStyle, w: number, c: StyleColors, rng: Rng): void {
  if (style === 'moss') {
    const n = Math.floor(w / 26);
    for (let i = 0; i < n; i++) {
      const x = rng.range(6, w - 6);
      const hgt = rng.range(4, 11);
      ctx.fillStyle = rng.chance(0.5) ? c.top : c.topShade;
      ctx.beginPath();
      ctx.moveTo(x - 4, 1);
      ctx.quadraticCurveTo(x - 3, -hgt * 0.6, x - 1 + rng.range(-3, 3), -hgt);
      ctx.quadraticCurveTo(x + 1, -hgt * 0.4, x + 4, 1);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = P.ink;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    const fl = Math.floor(w / 220);
    for (let i = 0; i < fl; i++) {
      const x = rng.range(10, w - 10);
      ctx.fillStyle = rng.pick([P.ivory, P.crystalTealLight, P.vein]);
      ellipse(ctx, x, -3, 3, 2.4);
      ctx.fill();
      ctx.strokeStyle = P.ink;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }
  } else if (style === 'soil') {
    const n = Math.floor(w / 160);
    for (let i = 0; i < n; i++) {
      if (!rng.chance(0.5)) continue;
      const x = rng.range(20, w - 20);
      const col = rng.pick([CRYSTAL_COLORS.teal, CRYSTAL_COLORS.blue, CRYSTAL_COLORS.orange]);
      crystalShard(ctx, x, 3, rng.range(10, 18), rng.range(-0.25, 0.25), col, false, rng);
    }
  }
}

/**
 * Paints the part of a solid that falls inside a chunk canvas. `seed`
 * keeps decoration identical across chunks and reloads.
 */
export function paintSolid(
  canvas: HTMLCanvasElement,
  solid: SolidDef,
  chunk: { x: number; y: number },
  pal: TerrainPalette | undefined,
  seed: number,
): void {
  const ctx = canvas.getContext('2d')!;
  const c = colorsFor(solid.style, pal);
  const thin = !!solid.oneWay || solid.h <= 30;
  const rng = new Rng(seed);
  const pts = outline(solid.w, solid.h, rng, thin);
  ctx.save();
  ctx.translate(solid.x - chunk.x, solid.y - chunk.y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  // Base
  tracePath(ctx, pts);
  ctx.fillStyle = c.shade;
  ctx.fill();
  ctx.save();
  tracePath(ctx, pts);
  ctx.clip();
  // Lit region = shape shifted up-left; leaves a hard shadow crescent.
  tracePath(ctx, pts, -7, -9);
  ctx.fillStyle = c.base;
  ctx.fill();
  const drng = new Rng(seed ^ 0x5bd1e995);
  details(ctx, solid.style, solid.w, solid.h, c, drng, thin);
  // Top band
  if (solid.style !== 'crystal' && solid.style !== 'metal') {
    const band = thin ? Math.min(7, solid.h * 0.35) : solid.style === 'moss' ? 16 : 11;
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(solid.w + 10, -10);
    let x = solid.w + 10;
    ctx.lineTo(x, band);
    const brng = new Rng(seed ^ 0x2f6b);
    while (x > -10) {
      const nx = x - brng.range(18, 40);
      ctx.quadraticCurveTo((x + nx) / 2, band + brng.range(-4, 5), nx, band + brng.range(-2, 3));
      x = nx;
    }
    ctx.closePath();
    ctx.fillStyle = c.topShade;
    ctx.fill();
    ctx.translate(0, -3);
    ctx.fillStyle = c.top;
    ctx.fill();
    ctx.translate(0, 3);
  }
  // Rim light along the walkable surface.
  ctx.strokeStyle = c.light;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(8, 3);
  ctx.lineTo(solid.w - 8, 3);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
  // Ink contour
  tracePath(ctx, pts);
  ctx.strokeStyle = P.ink;
  ctx.lineWidth = thin ? 3 : 4;
  ctx.stroke();
  topDecor(ctx, solid.style, solid.w, c, new Rng(seed ^ 0x77));
  ctx.restore();
}
