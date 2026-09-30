import { P, mix } from '../palette';
import { Rng, type Pt } from '../svg';
import { DETAIL, INK, OUTLINE, PASTEL } from '../style';
import { applyGrain } from '../TextureFactory';
import type { SolidDef, SolidStyle } from '../../../content/data/roomTypes';

// Canvas painter for collision-aligned terrain, in the manner of the
// paintings: flat pastel fills, one thin near-black contour, naive details
// (pebbles, root threads, planks, little sprouts) and the coloured-pencil
// grain. The top edge of every piece stays within ±2 px of the collider top
// so feet read as grounded; sides and undersides wobble freely. Decoration
// is seeded per piece.

export interface StyleColors {
  /** Main fill. */
  base: string;
  /** Kept for palette overrides; the flat look does not shade. */
  shade: string;
  /** Pebbles and other small light patches. */
  light: string;
  /** Top band (grass, planks' upper face, moss). */
  top: string;
  topShade: string;
  /** Inner detail lines. */
  detail: string;
  /** Embedded crystals and small highlights. */
  accent: string;
}

export type TerrainPalette = Partial<Record<SolidStyle, Partial<StyleColors>>>;

function mk(base: string, top: string, detail: string, accent: string, light?: string): StyleColors {
  return { base, shade: base, light: light ?? mix(base, '#ffffff', 0.32), top, topShade: top, detail, accent };
}

const DEFAULTS: Record<SolidStyle, StyleColors> = {
  soil: mk('#cdb9a0', '#e2d3bb', '#98836d', P.crystalTeal),
  root: mk(P.bark, P.barkLight, P.barkDark, P.violet),
  crystal: mk(P.crystalTeal, P.crystalTealLight, '#5f9d90', '#ffffff'),
  wood: mk('#d9b48f', '#e8cdb0', '#a07e62', P.crystalOrange),
  stone: mk('#c6c3c7', '#dcdadd', '#8e8a90', P.crystalBlue),
  moss: mk(PASTEL.sand, '#a9cf8f', '#8d7a62', P.crystalBlue),
  floor: mk('#dcb99a', '#ead3bc', '#9e7f66', P.ivory),
  metal: mk('#aeb5c1', '#c8cdd6', '#7f8897', PASTEL.butter),
  bed: mk('#dcb99a', '#ead3bc', '#9e7f66', P.ivory),
  office: mk('#cfc9b4', '#e2ddca', '#9d977f', '#e9e2c9'),
  paper: mk('#f6e2f4', '#f5eedf', '#c9a9c4', '#f5caf3'),
  none: mk('#000000', '#000000', '#000000', '#000000', '#000000'),
};

export function colorsFor(style: SolidStyle, pal?: TerrainPalette): StyleColors {
  const over = pal?.[style] ?? {};
  const c = { ...DEFAULTS[style], ...over };
  // A palette that only names a new base gets matching light patches.
  if (over.base && !over.light) c.light = mix(over.base, '#ffffff', 0.32);
  return c;
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

function inkLine(ctx: CanvasRenderingContext2D, w: number, a = 1, color: string = INK): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.globalAlpha = a;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** A little creature doodle (fish or bird) locked inside a crystal. */
function critter(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, fish: boolean): void {
  ctx.beginPath();
  if (fish) {
    ctx.ellipse(cx, cy, s * 0.5, s * 0.24, -0.3, 0, Math.PI * 2);
    ctx.moveTo(cx - s * 0.45, cy + s * 0.12);
    ctx.lineTo(cx - s * 0.8, cy - s * 0.05);
    ctx.lineTo(cx - s * 0.72, cy + s * 0.35);
    ctx.closePath();
  } else {
    ctx.moveTo(cx - s * 0.6, cy);
    ctx.quadraticCurveTo(cx - s * 0.3, cy - s * 0.5, cx, cy);
    ctx.quadraticCurveTo(cx + s * 0.3, cy - s * 0.5, cx + s * 0.6, cy);
  }
  inkLine(ctx, 1.1, 0.75);
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
  const shape = (): void => {
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x - w / 2 + lean * h * 0.7, y - h * 0.72);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(x + w / 2 + lean * h * 0.7, y - h * 0.72);
    ctx.lineTo(x + w / 2, y);
    ctx.closePath();
  };
  shape();
  ctx.fillStyle = c.fill;
  ctx.fill();
  if (trapped) critter(ctx, x + lean * h * 0.4, y - h * 0.42, w * 0.9, rng.chance(0.5));
  // One facet line, then the contour.
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(x + lean * h * 0.15 + w * 0.08, y);
  inkLine(ctx, DETAIL * 0.8, 0.8);
  shape();
  ctx.lineJoin = 'round';
  inkLine(ctx, DETAIL + 0.3);
}

export const CRYSTAL_COLORS = {
  blue: { fill: P.crystalBlue, shade: P.crystalBlueDark, light: P.crystalBlueLight },
  teal: { fill: P.crystalTeal, shade: P.crystalTealDark, light: P.crystalTealLight },
  orange: { fill: P.crystalOrange, shade: P.crystalOrangeDark, light: P.crystalOrangeLight },
  violet: { fill: P.violet, shade: P.violetDark, light: P.vein },
  pink: { fill: PASTEL.pink, shade: PASTEL.pinkDeep, light: PASTEL.blush },
};

function details(ctx: CanvasRenderingContext2D, style: SolidStyle, w: number, h: number, c: StyleColors, rng: Rng, thin: boolean): void {
  const area = w * Math.min(h, 400);
  switch (style) {
    case 'soil':
    case 'moss': {
      // Pebbles: small light ovals with a thin contour.
      const n = Math.floor(area / 7000);
      for (let i = 0; i < n; i++) {
        const x = rng.range(10, w - 10);
        const y = rng.range(26, Math.min(h, 420) - 6);
        const r = rng.range(3, 7);
        ellipse(ctx, x, y, r, r * rng.range(0.55, 0.8), rng.range(0, 3));
        ctx.fillStyle = rng.chance(0.25) ? mix(c.light, rng.pick([PASTEL.pink, PASTEL.lilac, PASTEL.mint]), 0.45) : c.light;
        ctx.fill();
        inkLine(ctx, 1.1, 0.85);
      }
      // Fossilised root threads.
      const roots = Math.floor(area / 30000) + 1;
      for (let i = 0; i < roots; i++) {
        let x = rng.range(0, w);
        let y = rng.range(30, Math.min(h, 420));
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let k = 0; k < 4; k++) {
          const nx = x + rng.range(-60, 60);
          const ny = y + rng.range(-10, 30);
          ctx.quadraticCurveTo((x + nx) / 2 + rng.range(-20, 20), (y + ny) / 2, nx, ny);
          x = nx;
          y = ny;
        }
        inkLine(ctx, 1.2, 0.8, c.detail);
      }
      // Embedded crystals (sometimes holding trapped creatures).
      const cr = Math.floor(area / 60000);
      for (let i = 0; i < cr; i++) {
        const x = rng.range(24, w - 24);
        const y = rng.range(60, Math.min(h, 400));
        if (y > h - 10) continue;
        const col = rng.pick([CRYSTAL_COLORS.blue, CRYSTAL_COLORS.teal, CRYSTAL_COLORS.pink, CRYSTAL_COLORS.orange]);
        crystalShard(ctx, x, y, rng.range(18, 34), rng.range(-0.3, 0.3), col, rng.chance(0.45), rng);
      }
      break;
    }
    case 'root': {
      const lines = Math.max(2, Math.floor(h / 9));
      ctx.beginPath();
      for (let i = 0; i < lines; i++) {
        const y = ((i + 0.6) / lines) * h + rng.range(-2, 2);
        let x = rng.range(4, 30);
        ctx.moveTo(x, y);
        while (x < w - 10) {
          const nx = Math.min(w - 6, x + rng.range(30, 90));
          ctx.quadraticCurveTo((x + nx) / 2, y + rng.range(-3, 3), nx, y + rng.range(-1.5, 1.5));
          x = nx + rng.range(6, 30);
          ctx.moveTo(x, y + rng.range(-1, 1));
        }
      }
      inkLine(ctx, 1.1, 0.8, c.detail);
      const knots = Math.floor(w / 140);
      for (let i = 0; i < knots; i++) {
        const x = rng.range(14, w - 14);
        const y = rng.range(h * 0.3, h * 0.75);
        ellipse(ctx, x, y, rng.range(4, 7), rng.range(2.5, 4), 0);
        inkLine(ctx, 1.1, 0.85);
      }
      break;
    }
    case 'crystal': {
      ctx.beginPath();
      const facets = Math.max(2, Math.floor(w / 40));
      for (let i = 0; i < facets; i++) {
        const x = (i + 0.5) * (w / facets) + rng.range(-6, 6);
        ctx.moveTo(x, 2);
        ctx.lineTo(x + rng.range(-14, 14), h - 2);
      }
      inkLine(ctx, 1.1, 0.55);
      break;
    }
    case 'wood':
    case 'floor':
    case 'bed': {
      const plank = style === 'floor' ? 30 : 22;
      ctx.beginPath();
      if (style === 'floor') {
        for (let y = plank; y < Math.min(h, 200); y += plank) {
          ctx.moveTo(0, y + rng.range(-1, 1));
          ctx.lineTo(w, y + rng.range(-1, 1));
          for (let x = rng.range(20, 160); x < w; x += rng.range(120, 220)) {
            ctx.moveTo(x, y - plank + 2);
            ctx.lineTo(x, y - 2);
          }
        }
      } else {
        for (let x = plank; x < w - 6; x += plank + rng.range(-3, 3)) {
          ctx.moveTo(x, 4);
          ctx.lineTo(x + rng.range(-1, 1), h - 4);
        }
      }
      inkLine(ctx, 1.2, 0.8);
      // Nail heads.
      ctx.fillStyle = INK;
      for (let x = rng.range(8, 30); x < w - 6; x += rng.range(60, 110)) {
        ellipse(ctx, x, style === 'floor' ? 8 : Math.min(h * 0.5, 10), 1.3, 1.3);
        ctx.fill();
      }
      break;
    }
    case 'stone': {
      ctx.beginPath();
      const cracks = Math.max(1, Math.floor(w / 70));
      for (let i = 0; i < cracks; i++) {
        let x = rng.range(10, w - 10);
        let y = rng.range(6, h * 0.4);
        ctx.moveTo(x, y);
        for (let k = 0; k < 3; k++) {
          x += rng.range(-10, 10);
          y += rng.range(6, 16);
          ctx.lineTo(x, y);
        }
      }
      inkLine(ctx, 1.3, 0.9);
      break;
    }
    case 'metal': {
      ctx.beginPath();
      const panel = 80;
      for (let x = panel; x < w; x += panel) {
        ctx.moveTo(x, 6);
        ctx.lineTo(x, Math.min(h, 300));
      }
      ctx.moveTo(4, 20);
      ctx.lineTo(w - 4, 20);
      inkLine(ctx, 1.3, 0.85);
      for (let x = 12; x < w; x += panel / 2) {
        ellipse(ctx, x, 12, 2.4, 2.4);
        ctx.fillStyle = c.accent;
        ctx.fill();
        inkLine(ctx, 1, 0.9);
      }
      break;
    }
    case 'office': {
      ctx.beginPath();
      for (let x = 60; x < w; x += 60) {
        ctx.moveTo(x, 4);
        ctx.lineTo(x - 18, Math.min(h, 120));
      }
      ctx.moveTo(0, 26);
      ctx.lineTo(w, 26);
      inkLine(ctx, 1.1, 0.7);
      break;
    }
    case 'paper': {
      // A paper box's front: plain, a few soft creases in its own colour.
      ctx.beginPath();
      for (let x = rng.range(60, 200); x < w - 20; x += rng.range(160, 320)) {
        ctx.moveTo(x, rng.range(22, 34));
        ctx.quadraticCurveTo(x + rng.range(-10, 10), Math.min(h, 400) * 0.5, x + rng.range(-16, 16), Math.min(h, 400) - rng.range(8, 20));
      }
      inkLine(ctx, 1.2, 0.35, c.detail);
      break;
    }
    default:
      break;
  }
  void thin;
}

/** A leaf with a vein, rooted at (x, y) (the paintings' sprouts). */
function sproutLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, ang: number, fill: string): void {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const at = (u: number, v: number): Pt => [x + u * c - v * s, y + u * s + v * c];
  const wd = len * 0.34;
  const b = at(len, 0);
  const l1 = at(len * 0.35, -wd);
  const l2 = at(len * 0.8, -wd * 0.6);
  const r1 = at(len * 0.35, wd);
  const r2 = at(len * 0.8, wd * 0.6);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(l1[0], l1[1], l2[0], l2[1], b[0], b[1]);
  ctx.bezierCurveTo(r2[0], r2[1], r1[0], r1[1], x, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  inkLine(ctx, 1.2);
  const m = at(len * 0.8, 0);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(m[0], m[1]);
  inkLine(ctx, 0.9, 0.8);
}

function topDecor(ctx: CanvasRenderingContext2D, style: SolidStyle, w: number, c: StyleColors, rng: Rng): void {
  if (style === 'moss') {
    // Grass blades: small outlined spikes in the band's colour.
    const n = Math.floor(w / 30);
    for (let i = 0; i < n; i++) {
      const x = rng.range(6, w - 6);
      const hgt = rng.range(5, 11);
      ctx.fillStyle = rng.chance(0.5) ? c.top : mix(c.top, PASTEL.lime, 0.4);
      ctx.beginPath();
      ctx.moveTo(x - 3.5, 1);
      ctx.quadraticCurveTo(x - 2.5, -hgt * 0.6, x - 1 + rng.range(-3, 3), -hgt);
      ctx.quadraticCurveTo(x + 1, -hgt * 0.4, x + 3.5, 1);
      ctx.closePath();
      ctx.fill();
      inkLine(ctx, 1.1);
    }
    // Little sprouts with veined leaves, and a few flowers.
    const sp = Math.floor(w / 260);
    for (let i = 0; i < sp; i++) {
      const x = rng.range(20, w - 20);
      const k = rng.int(2, 3);
      for (let j = 0; j < k; j++) sproutLeaf(ctx, x + (j - (k - 1) / 2) * 5, 0, rng.range(11, 17), -Math.PI / 2 + (j - (k - 1) / 2) * 0.7 + rng.range(-0.15, 0.15), mix(c.top, PASTEL.leaf, 0.5));
    }
    const fl = Math.floor(w / 220);
    for (let i = 0; i < fl; i++) {
      const x = rng.range(10, w - 10);
      const col = rng.pick([PASTEL.pink, PASTEL.butter, PASTEL.lilac, P.ivory]);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        ellipse(ctx, x + Math.cos(a) * 3, -5 + Math.sin(a) * 3, 2.4, 2.4);
        ctx.fillStyle = col;
        ctx.fill();
        inkLine(ctx, 0.9);
      }
      ellipse(ctx, x, -5, 1.6, 1.6);
      ctx.fillStyle = PASTEL.apricot;
      ctx.fill();
    }
  } else if (style === 'soil') {
    const n = Math.floor(w / 160);
    for (let i = 0; i < n; i++) {
      if (!rng.chance(0.5)) continue;
      const x = rng.range(20, w - 20);
      const col = rng.pick([CRYSTAL_COLORS.teal, CRYSTAL_COLORS.blue, CRYSTAL_COLORS.pink, CRYSTAL_COLORS.orange]);
      crystalShard(ctx, x, 3, rng.range(10, 18), rng.range(-0.25, 0.25), col, false, rng);
    }
  }
}

/**
 * 2.5D surface: the walkable top is a receding band that straddles the
 * collider line, so feet stand in the middle of the surface rather than on
 * a flat edge. Drawn like the naive perspective of the pink box in the
 * first painting: one flat colour, a thin contour at the far edge and the
 * front lip, a few pencil marks converging on the vanishing point.
 */
function topFace(ctx: CanvasRenderingContext2D, w: number, style: SolidStyle, c: StyleColors, thin: boolean, rng: Rng): void {
  const depth = thin ? 9 : 20;
  const back = -depth * 0.55;
  const front = depth * 0.45;
  const inset = Math.min(depth * 0.85, w * 0.08);
  const face = (): void => {
    ctx.beginPath();
    ctx.moveTo(inset, back);
    ctx.lineTo(w - inset, back);
    ctx.lineTo(w + 0.5, front);
    let x = w;
    while (x > 18) {
      const nx = x - rng.range(22, 46);
      ctx.lineTo(Math.max(0, nx), front + rng.range(-0.8, 0.8));
      x = nx;
    }
    ctx.lineTo(-0.5, front);
    ctx.closePath();
  };
  const top = style === 'crystal' ? c.light : mix(c.top, '#ffffff', 0.18);
  face();
  ctx.fillStyle = top;
  ctx.fill();
  ctx.save();
  face();
  ctx.clip();
  ctx.beginPath();
  const n = Math.max(2, Math.round(w / 40));
  for (let i = 0; i < n; i++) {
    const fx = rng.range(6, w - 6);
    const lean = ((fx - w / 2) / Math.max(1, w)) * 6;
    ctx.moveTo(fx, front - 1);
    ctx.lineTo(fx - lean - rng.range(-2, 2), back + rng.range(1, depth * 0.4));
  }
  inkLine(ctx, 1, 0.35, c.detail);
  ctx.restore();
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(0, front);
  ctx.lineTo(inset, back);
  ctx.lineTo(w - inset, back);
  ctx.lineTo(w, front);
  inkLine(ctx, thin ? 1.2 : 1.5);
  ctx.beginPath();
  ctx.moveTo(-0.5, front);
  ctx.lineTo(w + 0.5, front);
  inkLine(ctx, thin ? 1.7 : OUTLINE);
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
  // One flat fill.
  tracePath(ctx, pts);
  ctx.fillStyle = c.base;
  ctx.fill();
  ctx.save();
  tracePath(ctx, pts);
  ctx.clip();
  const drng = new Rng(seed ^ 0x5bd1e995);
  details(ctx, solid.style, solid.w, solid.h, c, drng, thin);
  // Top band (grass, the planks' upper face…) with a wavy lower edge.
  if (solid.style !== 'crystal' && solid.style !== 'metal') {
    // A paper floor's torn sheet spills well over its front edge.
    const band = thin ? Math.min(7, solid.h * 0.35) : solid.style === 'moss' ? 16 : solid.style === 'paper' ? 52 : 11;
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(solid.w + 10, -10);
    let x = solid.w + 10;
    ctx.lineTo(x, band);
    const brng = new Rng(seed ^ 0x2f6b);
    const edge: Pt[] = [[x, band]];
    const tear = solid.style === 'paper' ? 2.4 : 1;
    while (x > -10) {
      const nx = x - brng.range(18, 40) * tear;
      const cy = band + brng.range(-4, 5) * tear;
      const ny = band + brng.range(-2, 3) * tear;
      ctx.quadraticCurveTo((x + nx) / 2, cy, nx, ny);
      edge.push([(x + nx) / 2, cy], [nx, ny]);
      x = nx;
    }
    ctx.closePath();
    ctx.fillStyle = c.top;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(edge[0]![0], edge[0]![1]);
    for (let i = 1; i + 1 < edge.length; i += 2) ctx.quadraticCurveTo(edge[i]![0], edge[i]![1], edge[i + 1]![0], edge[i + 1]![1]);
    inkLine(ctx, thin ? 1 : 1.3, 0.85);
  }
  ctx.restore();
  // Thin, even ink contour.
  tracePath(ctx, pts);
  inkLine(ctx, thin ? 1.8 : OUTLINE);
  topFace(ctx, solid.w, solid.style, c, thin, new Rng(seed ^ 0x3c1));
  topDecor(ctx, solid.style, solid.w, c, new Rng(seed ^ 0x77));
  // Coloured-pencil grain, anchored to the world so chunks line up.
  ctx.translate(-solid.x, -solid.y);
  applyGrain(ctx, solid.x - TERRAIN_MARGIN - 20, solid.y - TERRAIN_MARGIN - 20, solid.w + TERRAIN_MARGIN * 2 + 40, solid.h + TERRAIN_MARGIN * 2 + 40);
  ctx.restore();
}
