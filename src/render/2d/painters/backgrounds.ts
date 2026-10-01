import { P, mix } from '../palette';
import { P1, paintBoxForeground, painting1Layers } from '../../../content/art/painting1';
import { Rng } from '../svg';
import { INK, PASTEL, lineFor } from '../style';
import { applyGrain } from '../TextureFactory';
import type { TerrainPalette } from './terrain';
import type { ThemeId } from '../../../content/data/roomTypes';

// Parallax layer painters, in the manner of the author's paintings: flat
// pastel colour fields and simple shapes with thin near-black contours,
// small naive details (stars, rain squiggles under clouds, leaf veins,
// stone cracks) and the coloured-pencil grain over everything. Far layers
// keep their contours faint so the outlined foreground reads first.

export interface LayerInfo {
  /** Height of the layer canvas and the band where the "horizon" sits. */
  h: number;
  w: number;
  horizon: number;
}

export interface LayerSpec {
  scroll: number;
  /** Depth in the 3D diorama, px (see PropDef.z); default: from `scroll`. */
  z?: number;
  /** Raster resolution (0.5 for far, soft layers). */
  res: number;
  draw: (ctx: CanvasRenderingContext2D, info: LayerInfo, rng: Rng) => void;
  /** Where the canvas lies in the layer's own coordinates (default: the room's parallax extent). */
  area?: { x: number; y: number; w: number; h: number };
  /** Draw depth (default: the sky band, behind the background tunnel). */
  depth?: number;
}

export type Ambient = 'dust' | 'sparkle' | 'wind' | 'petals' | 'embers' | 'drips' | 'none';

export interface ThemeDef {
  sky: [string, string];
  layers: LayerSpec[];
  terrain: TerrainPalette;
  ambient: Ambient;
  /** Horizon position as a fraction of the view height (surface themes). */
  horizon: number;
}

type Ctx = CanvasRenderingContext2D;
type Pt = [number, number];

/** Contour strength per depth: far layers faint and thin, near ones full. */
interface Pen {
  a: number;
  w: number;
}
const FAR: Pen = { a: 0.42, w: 1.5 };
const MID: Pen = { a: 0.7, w: 1.7 };
const NEAR: Pen = { a: 0.9, w: 1.9 };

function ink(ctx: Ctx, pen: Pen, w = pen.w): void {
  ctx.globalAlpha = pen.a;
  ctx.strokeStyle = INK;
  ctx.lineWidth = w;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function fillInk(ctx: Ctx, fill: string, pen: Pen | null): void {
  ctx.fillStyle = fill;
  ctx.fill();
  if (pen) ink(ctx, pen);
}

/** Smooth closed/open path through points (quadratic midpoints). */
function trace(ctx: Ctx, pts: readonly Pt[], closed = true): void {
  const n = pts.length;
  ctx.beginPath();
  if (n < 3) {
    ctx.moveTo(pts[0]![0], pts[0]![1]);
    for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
    if (closed) ctx.closePath();
    return;
  }
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (closed) {
    const s = mid(pts[n - 1]!, pts[0]!);
    ctx.moveTo(s[0], s[1]);
    for (let i = 0; i < n; i++) {
      const m = mid(pts[i]!, pts[(i + 1) % n]!);
      ctx.quadraticCurveTo(pts[i]![0], pts[i]![1], m[0], m[1]);
    }
    ctx.closePath();
  } else {
    ctx.moveTo(pts[0]![0], pts[0]![1]);
    for (let i = 1; i < n - 1; i++) {
      const m = mid(pts[i]!, pts[i + 1]!);
      ctx.quadraticCurveTo(pts[i]![0], pts[i]![1], m[0], m[1]);
    }
    ctx.lineTo(pts[n - 1]![0], pts[n - 1]![1]);
  }
}

function field(ctx: Ctx, w: number, h: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(-2, -2, w + 4, h + 4);
}

/** Flat hill band: one colour, a thin contour along its top only. */
function hills(ctx: Ctx, w: number, h: number, baseY: number, amp: number, color: string, rng: Rng, pen: Pen | null, freq = 1): void {
  const k1 = rng.range(0, 6);
  const k2 = rng.range(0, 6);
  const top: Pt[] = [];
  for (let x = -40; x <= w + 40; x += 30) {
    const y = baseY - amp * (0.55 + 0.45 * Math.sin((x / 520) * freq + k1)) - amp * 0.35 * Math.sin((x / 190) * freq + k2) * Math.sin(x / 900 + k1);
    top.push([x, y]);
  }
  trace(ctx, top, false);
  ctx.lineTo(w + 40, h + 10);
  ctx.lineTo(-40, h + 10);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (pen) {
    trace(ctx, top, false);
    ink(ctx, pen);
  }
}

/** Five-point star with a thin contour (the paintings' little stars). */
function star(ctx: Ctx, x: number, y: number, r: number, fill: string, pen: Pen, rot = 0): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = rot - Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.46 : r;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  fillInk(ctx, fill, { a: pen.a, w: Math.min(pen.w, r * 0.22) });
}

const STAR_COLORS = [PASTEL.mint, PASTEL.butter, PASTEL.pink, PASTEL.lilac, PASTEL.aqua, PASTEL.cream];

function starField(ctx: Ctx, w: number, h: number, rng: Rng, per: number, pen: Pen, big = 1): void {
  const n = Math.floor((w * h) / per);
  for (let i = 0; i < n; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, h);
    if (rng.chance(0.3)) {
      // A tiny dot star.
      ctx.beginPath();
      ctx.arc(x, y, rng.range(1.2, 2.2), 0, Math.PI * 2);
      ctx.fillStyle = rng.pick(STAR_COLORS);
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;
    } else star(ctx, x, y, rng.range(5, 10) * big, rng.pick(STAR_COLORS), pen, rng.range(-0.4, 0.4));
  }
}

/** A bumpy cloud with little 'm' marks inside and rain squiggles below. */
function cloud(ctx: Ctx, x: number, y: number, cw: number, rng: Rng, fill: string, rain: string | null, pen: Pen): void {
  const bumps = Math.max(3, Math.round(cw / 46));
  const ch = cw * 0.3;
  const pts: Pt[] = [];
  for (let i = 0; i <= bumps; i++) {
    const t = i / bumps;
    pts.push([x + t * cw, y + ch * 0.5 - (i === 0 || i === bumps ? 0 : ch * rng.range(0.45, 0.8))]);
  }
  ctx.beginPath();
  ctx.moveTo(pts[0]![0], pts[0]![1]);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const r = (b[0] - a[0]) * 0.62;
    ctx.bezierCurveTo(a[0], a[1] - r * 1.1, b[0], b[1] - r * 1.1, b[0], b[1]);
  }
  ctx.bezierCurveTo(x + cw + ch * 0.4, y + ch * 0.9, x + cw * 0.6, y + ch * 1.1, x + cw * 0.5, y + ch * 0.95);
  ctx.bezierCurveTo(x + cw * 0.3, y + ch * 1.15, x - ch * 0.4, y + ch * 0.95, x, y + ch * 0.5);
  ctx.closePath();
  fillInk(ctx, fill, pen);
  // 'm' marks.
  ctx.beginPath();
  const marks = Math.round(cw / 38);
  for (let i = 0; i < marks; i++) {
    const mx = x + rng.range(0.12, 0.85) * cw;
    const my = y + rng.range(0, 0.55) * ch;
    const s = rng.range(5, 8);
    ctx.moveTo(mx, my + s * 0.4);
    ctx.quadraticCurveTo(mx + s * 0.5, my - s * 0.4, mx + s, my + s * 0.1);
    ctx.quadraticCurveTo(mx + s * 1.5, my - s * 0.4, mx + s * 2, my + s * 0.4);
  }
  ink(ctx, { a: pen.a * 0.85, w: pen.w * 0.8 });
  if (!rain) return;
  // Rain: short wavy squiggles in a colour, each with a thin contour.
  const drops = Math.round(cw / 22);
  for (let i = 0; i < drops; i++) {
    const rx = x + ((i + 0.5) / drops) * cw + rng.range(-5, 5);
    const ry = y + ch * 1.15 + rng.range(0, 14);
    const len = rng.range(14, 24);
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    for (let k = 1; k <= 4; k++) ctx.quadraticCurveTo(rx + (k % 2 ? 3.5 : -3.5), ry + (len * (k - 0.5)) / 4, rx, ry + (len * k) / 4);
    ctx.globalAlpha = pen.a;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4.2;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = rain;
    ctx.lineWidth = 2.4;
    ctx.stroke();
  }
}

/** Leaf with a mid vein and side veins (the paintings' little leaves). */
function leaf(ctx: Ctx, x: number, y: number, len: number, ang: number, fill: string, pen: Pen): void {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const P2 = (u: number, v: number): Pt => [x + u * c - v * s, y + u * s + v * c];
  const wd = len * 0.36;
  const a = P2(0, 0);
  const b = P2(len, 0);
  const l1 = P2(len * 0.35, -wd);
  const l2 = P2(len * 0.8, -wd * 0.7);
  const r1 = P2(len * 0.35, wd);
  const r2 = P2(len * 0.8, wd * 0.7);
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.bezierCurveTo(l1[0], l1[1], l2[0], l2[1], b[0], b[1]);
  ctx.bezierCurveTo(r2[0], r2[1], r1[0], r1[1], a[0], a[1]);
  ctx.closePath();
  fillInk(ctx, fill, pen);
  ctx.beginPath();
  const m0 = P2(len * 0.1, 0);
  const m1 = P2(len * 0.85, 0);
  ctx.moveTo(m0[0], m0[1]);
  ctx.lineTo(m1[0], m1[1]);
  for (const t of [0.35, 0.55, 0.72]) {
    const p = P2(len * t, 0);
    const q = P2(len * (t + 0.12), -wd * 0.45);
    const r = P2(len * (t + 0.12), wd * 0.45);
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(r[0], r[1]);
  }
  ink(ctx, { a: pen.a * 0.8, w: pen.w * 0.7 });
}

/** A naive tree: a mauve trunk with a couple of arms, one bumpy crown. */
function tree(ctx: Ctx, x: number, baseY: number, hgt: number, trunk: string, crown: string, rng: Rng, pen: Pen): void {
  const tw = hgt * 0.055;
  const top = baseY - hgt * 0.62;
  ctx.beginPath();
  ctx.moveTo(x - tw * 1.6, baseY + 4);
  ctx.quadraticCurveTo(x - tw * 0.8, baseY - hgt * 0.1, x - tw * 0.7, baseY - hgt * 0.3);
  ctx.lineTo(x - tw * 0.55, top);
  ctx.lineTo(x + tw * 0.55, top);
  ctx.lineTo(x + tw * 0.7, baseY - hgt * 0.3);
  ctx.quadraticCurveTo(x + tw * 0.8, baseY - hgt * 0.1, x + tw * 1.6, baseY + 4);
  ctx.closePath();
  fillInk(ctx, trunk, pen);
  // Crown: a bumpy blob, a few leaf-vein strokes inside.
  const cx = x + rng.range(-0.04, 0.04) * hgt;
  const cy = baseY - hgt * 0.74;
  const rx = hgt * rng.range(0.24, 0.3);
  const ry = hgt * rng.range(0.2, 0.25);
  const n = 11;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = i % 2 ? 0.86 : 1.06 + rng.range(-0.04, 0.06);
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  trace(ctx, pts);
  fillInk(ctx, crown, pen);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const vx = cx + rng.range(-0.6, 0.6) * rx;
    const vy = cy + rng.range(-0.5, 0.5) * ry;
    const l = rx * rng.range(0.16, 0.26);
    ctx.moveTo(vx - l, vy + l * 0.35);
    ctx.quadraticCurveTo(vx, vy - l * 0.3, vx + l, vy + l * 0.35);
  }
  ink(ctx, { a: pen.a * 0.7, w: pen.w * 0.75 });
}

/** A pine as three stacked flat triangles on a stub. */
function pine(ctx: Ctx, x: number, baseY: number, hgt: number, fill: string, pen: Pen | null): void {
  ctx.beginPath();
  const tiers = 3;
  ctx.moveTo(x, baseY - hgt);
  for (let i = 1; i <= tiers; i++) {
    const t = i / tiers;
    ctx.lineTo(x + hgt * 0.24 * t, baseY - hgt + hgt * 0.86 * t);
    if (i < tiers) ctx.lineTo(x + hgt * 0.09 * t, baseY - hgt + hgt * 0.86 * t);
  }
  ctx.lineTo(x + hgt * 0.04, baseY - hgt * 0.14);
  ctx.lineTo(x + hgt * 0.04, baseY + 4);
  ctx.lineTo(x - hgt * 0.04, baseY + 4);
  ctx.lineTo(x - hgt * 0.04, baseY - hgt * 0.14);
  for (let i = tiers; i >= 1; i--) {
    const t = i / tiers;
    if (i < tiers) ctx.lineTo(x - hgt * 0.09 * t, baseY - hgt + hgt * 0.86 * t);
    ctx.lineTo(x - hgt * 0.24 * t, baseY - hgt + hgt * 0.86 * t);
  }
  ctx.closePath();
  fillInk(ctx, fill, pen);
}

/**
 * A stone wall like the paintings' borders: irregular grey slabs parted by
 * black crack lines. Rows of slabs with rounded corners.
 */
/**
 * A wall of rounded stones in the naive manner, finished: each stone lit from
 * the top left (a pale lip, a shaded rim below), speckled, often cracked,
 * now and then chipped, in dark mortar. A cave's wall also lives: moss on
 * some tops, a fossil print, a crystal sprouting from a crack, a drip
 * under it. And here and there a chalk doodle someone left: stars, moons,
 * suns, spirals, tallies, a flower, a little square-headed Gorti.
 */
function stoneWall(ctx: Ctx, w: number, h: number, rng: Rng, fills: readonly string[], pen: Pen, size = 1, cave = true): void {
  const rowH = 78 * size;
  ctx.fillStyle = mix(fills[0]!, INK, 0.3);
  ctx.fillRect(0, 0, w, h);
  // What hangs below a stone or sprouts from its foot goes over the next row: drawn last.
  const after: (() => void)[] = [];
  let y = -rng.range(10, 40);
  while (y < h + 10) {
    const rh = rowH * rng.range(0.75, 1.2);
    let x = -rng.range(0, 60);
    while (x < w + 10) {
      const sw = rowH * rng.range(1.1, 2.1);
      const g = 3.2 * size;
      const j = (): number => rng.range(-5, 5) * size;
      const pts: Pt[] = [
        [x + g, y + g + j() * 0.5],
        [x + sw * 0.5 + j(), y + g + j() * 0.6],
        [x + sw - g, y + g + j() * 0.5],
        [x + sw - g + j() * 0.6, y + rh * 0.5],
        [x + sw - g, y + rh - g + j() * 0.5],
        [x + sw * 0.5 + j(), y + rh - g + j() * 0.6],
        [x + g, y + rh - g + j() * 0.5],
        [x + g + j() * 0.6, y + rh * 0.5],
      ];
      stone(ctx, pts, { x: x + sw / 2, y: y + rh / 2, r: Math.min(sw, rh) / 2 }, rng.pick(fills), rng, pen, size, cave, after);
      x += sw;
    }
    y += rh;
  }
  for (const f of after) f();
}

/** One stone of the wall (`at`: its middle and half its smaller side). */
function stone(ctx: Ctx, pts: readonly Pt[], at: { x: number; y: number; r: number }, fill: string, rng: Rng, pen: Pen, s: number, cave: boolean, after: (() => void)[]): void {
  const base = mix(fill, rng.next() < 0.5 ? '#ffffff' : INK, rng.range(0, 0.06));
  const deep = mix(base, INK, 0.5);
  ctx.save();
  trace(ctx, pts);
  ctx.fillStyle = mix(base, INK, 0.24);
  ctx.fill();
  ctx.clip();
  // The lit face, nudged up and left: a shaded rim stays below and right.
  ctx.translate(-3 * s, -3.4 * s);
  trace(ctx, pts);
  ctx.fillStyle = base;
  ctx.fill();
  ctx.translate(3 * s, 3.4 * s);
  // A pale lip along the top edge.
  ctx.beginPath();
  ctx.moveTo(pts[7]![0] + 2 * s, pts[7]![1]);
  for (const k of [0, 1, 2]) ctx.lineTo(pts[k]![0], pts[k]![1] + 2 * s);
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = mix(base, '#ffffff', 0.55);
  ctx.lineWidth = 3 * s;
  ctx.lineCap = 'round';
  ctx.stroke();
  // Pores and grit.
  const n = rng.int(3, 8);
  for (let i = 0; i < n; i++) {
    ctx.globalAlpha = rng.range(0.3, 0.6);
    ctx.fillStyle = i % 3 ? deep : mix(base, '#ffffff', 0.55);
    ctx.beginPath();
    ctx.arc(at.x + rng.range(-1.3, 1.3) * at.r, at.y + rng.range(-0.8, 0.8) * at.r, rng.range(0.7, 1.7) * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const roll = rng.next();
  if (cave && roll < 0.07) fossil(ctx, at, deep, rng, s);
  else if (roll < 0.15) chalk(ctx, at, rng, s);
  ctx.restore();
  trace(ctx, pts);
  ink(ctx, pen);
  // A crack from an edge, inward; sometimes a drip under it, or a crystal from it.
  if (rng.next() < 0.45) {
    const k = rng.int(0, 7);
    const from = pts[k]!;
    const end = crack(ctx, from, Math.atan2(at.y - from[1], at.x - from[0]) + rng.range(-0.5, 0.5), at.r * rng.range(0.6, 1.1), rng, pen, s);
    if (k >= 4 && k <= 6) {
      const r = rng.next();
      if (cave && r < 0.22) after.push(() => crystalSprout(ctx, from[0], from[1], rng.range(0.7, 1.1) * s, rng.pick(CRYSTAL_FILLS), pen));
      else if (r < 0.5) {
        const len = rng.range(24, 70) * s;
        const dx = from[0];
        after.push(() => drip(ctx, dx, from[1], len, deep, s));
      }
    } else if (cave && rng.next() < 0.08) after.push(() => crystalSprout(ctx, end[0], end[1], rng.range(0.5, 0.8) * s, rng.pick(CRYSTAL_FILLS), pen));
  }
  // A chipped corner.
  if (rng.next() < 0.14) {
    const c = pts[rng.pick([0, 2, 4, 6])]!;
    const d = rng.range(5, 9) * s;
    const sx = c[0] < at.x ? 1 : -1;
    const sy = c[1] < at.y ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(c[0] - sx * 2, c[1] - sy * 2);
    ctx.lineTo(c[0] + sx * d, c[1] - sy * 1);
    ctx.lineTo(c[0] + sx * d * 0.45, c[1] + sy * d * 0.5);
    ctx.lineTo(c[0] - sx * 1, c[1] + sy * d);
    ctx.closePath();
    ctx.fillStyle = mix(base, INK, 0.22);
    ctx.fill();
    ink(ctx, { a: pen.a * 0.8, w: pen.w * 0.8 });
  }
  // A clump of moss on the top edge, a few strands hanging off it.
  if (cave && rng.next() < 0.18) after.push(() => moss(ctx, pts, rng, pen, s));
}

/** Moss on a stone's top edge: a clump, fullest in its middle, with strands hanging. */
function moss(ctx: Ctx, pts: readonly Pt[], rng: Rng, pen: Pen, s: number): void {
  const a = pts[rng.pick([7, 0, 1])]!;
  const b = pts[[0, 1, 2][[7, 0, 1].indexOf(pts.indexOf(a))]!]!;
  const t0 = rng.range(0.2, 0.8);
  const cx = a[0] + (b[0] - a[0]) * t0;
  const cy = a[1] + (b[1] - a[1]) * t0;
  const span = Math.hypot(b[0] - a[0], b[1] - a[1]) * rng.range(0.35, 0.6);
  const greens = ['#a9ec7e', '#8ddc62', '#bff59a'];
  const n = rng.int(7, 11);
  // Fine green strands first, so the clump covers their tops.
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const x = cx + rng.range(-0.35, 0.35) * span;
    const len = rng.range(6, 14) * s;
    ctx.moveTo(x, cy);
    ctx.quadraticCurveTo(x + rng.range(-3, 3) * s, cy + len * 0.6, x + rng.range(-1.5, 1.5) * s, cy + len);
  }
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = '#6fae5c';
  ctx.lineWidth = 1.1 * s;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.globalAlpha = 1;
  for (let i = 0; i < n; i++) {
    const u = rng.range(-1, 1);
    const r = (6.5 - 3.8 * Math.abs(u)) * s * rng.range(0.85, 1.15);
    ctx.beginPath();
    ctx.arc(cx + u * span * 0.5, cy + rng.range(-1.5, 2.5) * s - r * 0.35, r, 0, Math.PI * 2);
    fillInk(ctx, rng.pick(greens), { a: pen.a * 0.8, w: pen.w * 0.8 });
  }
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.arc(cx + rng.range(-0.5, 0.5) * span, cy + rng.range(-5, 1) * s, rng.range(0.8, 1.3) * s, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 ? '#eaffd8' : '#5f9a52';
    ctx.fill();
  }
}

/** A thin crack, zigzagging, with a twig off it; where it ends. */
function crack(ctx: Ctx, from: Pt, ang: number, len: number, rng: Rng, pen: Pen, s: number): Pt {
  const n = rng.int(3, 4);
  let [x, y] = from;
  let a = ang;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 0; i < n; i++) {
    a += rng.range(-0.55, 0.55);
    x += (Math.cos(a) * len) / n;
    y += (Math.sin(a) * len) / n;
    ctx.lineTo(x, y);
    if (i === 1 && rng.next() < 0.6) {
      const b = a + (rng.next() < 0.5 ? 0.9 : -0.9);
      ctx.lineTo(x + Math.cos(b) * len * 0.22, y + Math.sin(b) * len * 0.22);
      ctx.moveTo(x, y);
    }
  }
  ink(ctx, { a: Math.min(1, pen.a * 1.8), w: 1.4 * s });
  return [x, y];
}

/** A stain run down from a stone's foot, fading. */
function drip(ctx: Ctx, x: number, y: number, len: number, color: string, s: number): void {
  const g = ctx.createLinearGradient(0, y, 0, y + len);
  g.addColorStop(0, color);
  g.addColorStop(1, color + '00');
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = g;
  ctx.lineWidth = 3.4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 1.5 * s, y + len * 0.5, x - 0.5 * s, y + len);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Two or three small crystals growing out of the wall at a point, down and out. */
function crystalSprout(ctx: Ctx, x: number, y: number, s: number, fill: string, pen: Pen): void {
  const shards: [number, number, number][] = [[-0.5, 1, 15], [0.25, 0.75, 11], [-1.2, 0.6, 9]];
  for (const [a0, k, len] of shards) {
    const a = Math.PI / 2 + a0;
    const L = len * k * s * 1.6;
    const wd = 3.6 * s * (0.7 + k * 0.4);
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    const nx = -uy;
    const ny = ux;
    const pts: Pt[] = [
      [x + nx * wd * 0.6, y + ny * wd * 0.6],
      [x + ux * L * 0.7 + nx * wd, y + uy * L * 0.7 + ny * wd],
      [x + ux * L, y + uy * L],
      [x + ux * L * 0.7 - nx * wd, y + uy * L * 0.7 - ny * wd],
      [x - nx * wd * 0.6, y - ny * wd * 0.6],
    ];
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    fillInk(ctx, fill, { a: Math.min(1, pen.a * 1.5), w: 1.2 * s });
    ctx.beginPath();
    ctx.moveTo(x + ux * L * 0.15 + nx * wd * 0.25, y + uy * L * 0.15 + ny * wd * 0.25);
    ctx.lineTo(x + ux * L * 0.8 + nx * wd * 0.3, y + uy * L * 0.8 + ny * wd * 0.3);
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.1 * s;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

/** A fossil pressed in the stone: an ammonite, a shell, a leaf or a little fish's bones. */
function fossil(ctx: Ctx, at: { x: number; y: number; r: number }, color: string, rng: Rng, s: number): void {
  const R = at.r * rng.range(0.5, 0.7);
  const { x, y } = at;
  ctx.save();
  ctx.translate(x + rng.range(-0.3, 0.3) * at.r, y);
  ctx.rotate(rng.range(-0.6, 0.6));
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 1.5 * s;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const kind = rng.int(0, 3);
  if (kind === 0) {
    // Ammonite: a spiral, ribbed.
    const turns = 2.4;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * Math.PI * 2;
      const r = R * (0.08 + (0.92 * i) / steps);
      const px = Math.cos(t) * r;
      const py = Math.sin(t) * r;
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    }
    for (let i = 14; i <= steps; i += 3) {
      const t = (i / steps) * turns * Math.PI * 2;
      const r1 = R * (0.08 + (0.92 * i) / steps);
      const r0 = R * (0.08 + (0.92 * Math.max(0, i - steps / turns)) / steps);
      ctx.moveTo(Math.cos(t) * r0, Math.sin(t) * r0);
      ctx.lineTo(Math.cos(t) * r1, Math.sin(t) * r1);
    }
  } else if (kind === 1) {
    // A shell: a fan of ribs over a hinge.
    for (let i = 0; i <= 6; i++) {
      const a = Math.PI * (1.15 + (0.7 * i) / 6);
      ctx.moveTo(0, R * 0.55);
      ctx.lineTo(Math.cos(a) * R, R * 0.55 + Math.sin(a) * R);
    }
    ctx.moveTo(Math.cos(Math.PI * 1.15) * R, R * 0.55 + Math.sin(Math.PI * 1.15) * R);
    for (let i = 1; i <= 12; i++) {
      const a = Math.PI * (1.15 + (0.7 * i) / 12);
      const rr = R * (i % 2 ? 1.06 : 1);
      ctx.lineTo(Math.cos(a) * rr, R * 0.55 + Math.sin(a) * rr);
    }
    ctx.moveTo(-R * 0.22, R * 0.55);
    ctx.lineTo(R * 0.22, R * 0.55);
  } else if (kind === 2) {
    // A leaf's print: its outline, the midrib, the veins.
    ctx.moveTo(-R, 0);
    ctx.quadraticCurveTo(0, -R * 0.75, R, 0);
    ctx.quadraticCurveTo(0, R * 0.75, -R, 0);
    ctx.moveTo(-R * 1.25, R * 0.08);
    ctx.lineTo(R * 0.95, 0);
    for (let i = 1; i <= 4; i++) {
      const vx = -R + (i / 5) * 2 * R;
      ctx.moveTo(vx, 0);
      ctx.lineTo(vx + R * 0.28, -R * 0.36 * Math.sin((i / 5) * Math.PI));
      ctx.moveTo(vx, 0);
      ctx.lineTo(vx + R * 0.28, R * 0.36 * Math.sin((i / 5) * Math.PI));
    }
  } else {
    // A little fish: head, spine, ribs, tail.
    ctx.moveTo(-R * 0.55, 0);
    ctx.arc(-R * 0.75, 0, R * 0.2, 0, Math.PI * 2);
    ctx.moveTo(-R * 0.55, 0);
    ctx.lineTo(R * 0.7, 0);
    for (let i = 1; i <= 6; i++) {
      const rx = -R * 0.45 + (i / 7) * R * 1.1;
      const rr = R * 0.32 * Math.sin((i / 7) * Math.PI + 0.3);
      ctx.moveTo(rx - R * 0.06, -rr);
      ctx.quadraticCurveTo(rx + R * 0.05, 0, rx - R * 0.06, rr);
    }
    ctx.moveTo(R * 0.7, 0);
    ctx.lineTo(R, -R * 0.25);
    ctx.moveTo(R * 0.7, 0);
    ctx.lineTo(R, R * 0.25);
  }
  ctx.stroke();
  ctx.restore();
}

/** A chalk doodle on a stone, in pale, rubbed lines (or in crayon on paper: `color`, `alpha`, no wander). */
function chalk(ctx: Ctx, at: { x: number; y: number; r: number }, rng: Rng, s: number, color = '#fdfbff', alpha = 0.85, wander = 1): void {
  const R = at.r * rng.range(0.45, 0.65);
  ctx.save();
  ctx.translate(at.x + rng.range(-0.4, 0.4) * at.r * wander, at.y + rng.range(-0.15, 0.15) * at.r * wander);
  ctx.rotate(rng.range(-0.25, 0.25));
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 2.1 * s;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const kind = rng.int(0, 6);
  if (kind === 0) {
    // A star.
    for (let i = 0; i <= 5; i++) {
      const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
      if (i) ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
      else ctx.moveTo(Math.cos(a) * R, Math.sin(a) * R);
    }
  } else if (kind === 1) {
    // A spiral.
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * Math.PI * 5;
      const r = (R * i) / 40;
      if (i) ctx.lineTo(Math.cos(t) * r, Math.sin(t) * r);
      else ctx.moveTo(0, 0);
    }
  } else if (kind === 2) {
    // A sun.
    ctx.arc(0, 0, R * 0.42, 0, Math.PI * 2);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.moveTo(Math.cos(a) * R * 0.6, Math.sin(a) * R * 0.6);
      ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
    }
  } else if (kind === 3) {
    // A crescent moon with a sleepy eye.
    ctx.arc(0, 0, R * 0.8, Math.PI * 0.35, Math.PI * 1.65);
    ctx.quadraticCurveTo(-R * 0.1, 0, Math.cos(Math.PI * 0.35) * R * 0.8, Math.sin(Math.PI * 0.35) * R * 0.8);
    ctx.moveTo(-R * 0.48, -R * 0.08);
    ctx.quadraticCurveTo(-R * 0.36, R * 0.04, -R * 0.24, -R * 0.08);
  } else if (kind === 4) {
    // Tallies: four and one across.
    for (let i = 0; i < 4; i++) {
      ctx.moveTo(-R * 0.6 + i * R * 0.36, -R * 0.6);
      ctx.lineTo(-R * 0.66 + i * R * 0.36, R * 0.6);
    }
    ctx.moveTo(-R * 0.85, R * 0.4);
    ctx.lineTo(R * 0.75, -R * 0.35);
  } else if (kind === 5) {
    // A flower.
    ctx.arc(0, -R * 0.35, R * 0.16, 0, Math.PI * 2);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const px = Math.cos(a) * R * 0.38;
      const py = -R * 0.35 + Math.sin(a) * R * 0.38;
      ctx.moveTo(px + R * 0.17, py);
      ctx.arc(px, py, R * 0.17, 0, Math.PI * 2);
    }
    ctx.moveTo(0, -R * 0.15);
    ctx.quadraticCurveTo(R * 0.1, R * 0.4, 0, R);
  } else {
    // Gorti, as a child draws him: a square head with two square eyes, a stick body.
    ctx.rect(-R * 0.4, -R, R * 0.8, R * 0.7);
    ctx.rect(-R * 0.22, -R * 0.78, R * 0.12, R * 0.14);
    ctx.rect(R * 0.1, -R * 0.78, R * 0.12, R * 0.14);
    ctx.moveTo(0, -R * 0.3);
    ctx.lineTo(0, R * 0.45);
    ctx.moveTo(-R * 0.45, -R * 0.05);
    ctx.lineTo(R * 0.45, -R * 0.12);
    ctx.moveTo(0, R * 0.45);
    ctx.lineTo(-R * 0.3, R);
    ctx.moveTo(0, R * 0.45);
    ctx.lineTo(R * 0.3, R);
  }
  ctx.stroke();
  ctx.restore();
}

/** A rounded rectangle path (`ctx.roundRect` is missing from older Safari). */
function rrect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Crayons the children draw with (dormitory wall). */
const CRAYONS = ['#d9587a', '#5b86d1', '#58a86a', '#e8913f', '#9468cc'] as const;

/** A soft four-pointed star (wallpaper motif). */
function twinkle(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + r * 0.18, y - r * 0.18, x + r, y);
  ctx.quadraticCurveTo(x + r * 0.18, y + r * 0.18, x, y + r);
  ctx.quadraticCurveTo(x - r * 0.18, y + r * 0.18, x - r, y);
  ctx.quadraticCurveTo(x - r * 0.18, y - r * 0.18, x, y - r);
  ctx.fill();
}

/**
 * Faded wallpaper above `bottom`: staggered little stars and three-dot
 * sprigs, a shade off the wall, with its seams showing and lifting here and
 * there to the paler paper under it.
 */
function wallpaper(ctx: Ctx, w: number, bottom: number, rng: Rng, base: string): void {
  const star = mix(base, PASTEL.periwinkleDeep, 0.34);
  const sprig = mix(base, PASTEL.pinkDeep, 0.3);
  const step = 56;
  // Broad stripes a shade deeper, a pinstripe between them.
  ctx.fillStyle = mix(base, PASTEL.lilac, 0.22);
  for (let x = 0; x < w; x += step) ctx.fillRect(x, 0, 20, bottom);
  ctx.beginPath();
  for (let x = 38; x < w; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, bottom);
  }
  ink(ctx, { a: 0.07, w: 1 });
  for (let row = 0, y = 18; y < bottom - 12; row++, y += 46) {
    for (let x = 0; x < w + step; x += step) {
      ctx.fillStyle = star;
      twinkle(ctx, x + 10 + rng.range(-1.5, 1.5), y + rng.range(-1.5, 1.5), rng.range(5.4, 6.8));
      const sy = y + 23;
      if (sy > bottom - 12) continue;
      ctx.fillStyle = sprig;
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(x + 38 + Math.cos(a) * 3.8, sy + Math.sin(a) * 3.8, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  // The seams: faint lines, and where the paper lifts, a curled flap.
  for (let x = rng.range(60, 160); x < w; x += rng.range(170, 210)) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + rng.range(-1.5, 1.5), bottom);
    ink(ctx, { a: 0.16, w: 1.1 });
    if (rng.chance(0.35)) peel(ctx, x, rng.chance(0.5) ? rng.range(bottom * 0.3, bottom * 0.5) : bottom - rng.range(40, 70), rng, base);
  }
}

/** Wallpaper lifting from a seam at (x, y): the bare backing, and the flap curled over with its pale back out. */
function peel(ctx: Ctx, x: number, y: number, rng: Rng, base: string): void {
  const dir = rng.chance(0.5) ? 1 : -1;
  const fw = rng.range(16, 28) * dir;
  const fh = rng.range(24, 40);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + fw, y + fh * 0.12);
  ctx.lineTo(x, y + fh);
  ctx.closePath();
  fillInk(ctx, mix(base, '#cdbba4', 0.55), { a: 0.2, w: 1 });
  // The flap's shadow, then the flap.
  ctx.beginPath();
  ctx.moveTo(x + fw, y + fh * 0.12);
  ctx.quadraticCurveTo(x + fw * 1.35, y + fh * 0.55, x + fw * 0.55, y + fh * 0.95);
  ctx.lineTo(x, y + fh);
  ctx.closePath();
  ctx.fillStyle = 'rgba(60, 40, 70, 0.12)';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + fw, y + fh * 0.12);
  ctx.quadraticCurveTo(x + fw * 1.25, y + fh * 0.5, x + fw * 0.5, y + fh * 0.86);
  ctx.lineTo(x, y + fh);
  ctx.closePath();
  fillInk(ctx, mix(base, '#ffffff', 0.55), FAR);
}

/** A damp stain: a soft blot with a darker tide line. */
function stain(ctx: Ctx, x: number, y: number, r: number, rng: Rng, color: string): void {
  const g = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
  g.addColorStop(0, color + '1c');
  g.addColorStop(0.75, color + '14');
  g.addColorStop(1, color + '00');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  const pts: Pt[] = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const rr = r * rng.range(0.62, 0.82);
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8]);
  }
  trace(ctx, pts);
  ctx.globalAlpha = 0.14;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Boarded wainscot from `top` down: grooved boards in slightly varied tones, a rounded rail with its shadow, a skirting, scuffs and nails. */
function wainscot(ctx: Ctx, w: number, top: number, bottom: number, fill: string, rng: Rng): void {
  ctx.beginPath();
  ctx.rect(-10, top, w + 20, bottom - top + 10);
  fillInk(ctx, fill, FAR);
  const bw = 34;
  for (let x = -bw / 2; x < w; x += bw) {
    ctx.fillStyle = mix(fill, rng.chance(0.5) ? '#ffffff' : '#b48aa0', rng.range(0.04, 0.12));
    ctx.fillRect(x + 1, top + 12, bw - 2, bottom - top - 12);
    // The groove: a dark line and a lit edge beside it.
    ctx.beginPath();
    ctx.moveTo(x, top + 12);
    ctx.lineTo(x, bottom);
    ink(ctx, { a: 0.26, w: 1.3 });
    ctx.beginPath();
    ctx.moveTo(x + 2, top + 12);
    ctx.lineTo(x + 2, bottom);
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (rng.chance(0.3)) {
      for (const ny of [top + 26, bottom - 34]) {
        ctx.beginPath();
        ctx.arc(x + bw / 2, ny, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(70, 50, 70, 0.45)';
        ctx.fill();
      }
    }
  }
  // The rail's shadow on the boards, then the rail.
  ctx.fillStyle = 'rgba(70, 40, 70, 0.12)';
  ctx.fillRect(-10, top + 10, w + 20, 7);
  ctx.beginPath();
  ctx.rect(-10, top - 5, w + 20, 15);
  fillInk(ctx, mix(fill, '#ffffff', 0.4), FAR);
  ctx.beginPath();
  ctx.moveTo(-10, top - 1);
  ctx.lineTo(w + 10, top - 1);
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.globalAlpha = 1;
  // The skirting.
  ctx.beginPath();
  ctx.rect(-10, bottom - 24, w + 20, 34);
  fillInk(ctx, mix(fill, '#6b4d68', 0.22), FAR);
  // Scuffs where feet and beds have knocked it.
  for (let x = rng.range(20, 120); x < w; x += rng.range(90, 220)) {
    const y = bottom - rng.range(26, 60);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + rng.range(10, 22), y + rng.range(-3, 3));
    ink(ctx, { a: 0.22, w: rng.range(1.2, 2.4) });
  }
}

/** A child's crayon drawing pinned or taped to the wall, a little crooked, with its shadow. */
function pinnedDrawing(ctx: Ctx, x: number, y: number, rng: Rng): void {
  const pw = rng.range(62, 84);
  const ph = pw * rng.range(0.72, 0.95);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rng.range(-0.13, 0.13));
  ctx.fillStyle = 'rgba(50, 30, 60, 0.12)';
  ctx.fillRect(-pw / 2 + 3, 3, pw, ph);
  ctx.beginPath();
  ctx.rect(-pw / 2, 0, pw, ph);
  fillInk(ctx, '#fbf6ea', FAR);
  // A dog-eared corner.
  ctx.beginPath();
  ctx.moveTo(pw / 2, ph - 10);
  ctx.lineTo(pw / 2 - 10, ph);
  ctx.lineTo(pw / 2 - 9, ph - 9);
  ctx.closePath();
  fillInk(ctx, '#e9dfcc', { a: 0.3, w: 1 });
  chalk(ctx, { x: 0, y: ph * 0.55, r: Math.min(pw, ph) * 0.62 }, rng, 0.95, rng.pick(CRAYONS), 0.92, 0);
  if (rng.chance(0.5)) {
    ctx.beginPath();
    ctx.arc(0, 5, 3.4, 0, Math.PI * 2);
    fillInk(ctx, rng.pick([PASTEL.coral, PASTEL.periwinkle, PASTEL.butter]), FAR);
  } else {
    for (const sx of [-1, 1]) {
      ctx.save();
      ctx.translate(sx * (pw / 2 - 4), 2);
      ctx.rotate(sx * 0.6);
      ctx.fillStyle = 'rgba(255, 248, 214, 0.75)';
      ctx.fillRect(-9, -4, 18, 8);
      ctx.restore();
    }
  }
  ctx.restore();
}

/** A board of coat hooks, a striped scarf hanging from one. */
function hooks(ctx: Ctx, x: number, y: number, n: number, rng: Rng): void {
  const bw = n * 34 + 14;
  ctx.fillStyle = 'rgba(50, 30, 60, 0.12)';
  ctx.fillRect(x + 3, y + 4, bw, 14);
  ctx.beginPath();
  ctx.rect(x, y, bw, 14);
  fillInk(ctx, '#d2ae96', FAR);
  const scarfAt = rng.int(0, n - 1);
  for (let i = 0; i < n; i++) {
    const hx = x + 17 + i * 34;
    ctx.beginPath();
    ctx.arc(hx, y + 7, 3.2, 0, Math.PI * 2);
    fillInk(ctx, '#9b8ca6', FAR);
    ctx.beginPath();
    ctx.moveTo(hx, y + 9);
    ctx.quadraticCurveTo(hx + 2, y + 24, hx + 9, y + 21);
    ink(ctx, { a: 0.75, w: 2.4 });
    if (i !== scarfAt) continue;
    // The scarf: over the hook, both ends hanging, striped, with a fringe.
    const len = rng.range(70, 100);
    const color = rng.pick([PASTEL.pink, PASTEL.mint, PASTEL.butter]);
    for (const [dx, l] of [[-6, len], [7, len * 0.82]] as const) {
      ctx.beginPath();
      ctx.moveTo(hx + dx - 6, y + 18);
      ctx.quadraticCurveTo(hx + dx - 3, y + 18 + l * 0.5, hx + dx - 7, y + 18 + l);
      ctx.lineTo(hx + dx + 7, y + 18 + l);
      ctx.quadraticCurveTo(hx + dx + 10, y + 18 + l * 0.5, hx + dx + 6, y + 18);
      ctx.closePath();
      fillInk(ctx, color, FAR);
      ctx.save();
      ctx.clip();
      for (let k = 1; k < 5; k++) {
        ctx.fillStyle = mix(color, '#ffffff', 0.55);
        ctx.fillRect(hx + dx - 14, y + 18 + (l * k) / 5, 28, 5);
      }
      ctx.restore();
      ctx.beginPath();
      for (let f = -6; f <= 6; f += 3) {
        ctx.moveTo(hx + dx + f, y + 18 + l);
        ctx.lineTo(hx + dx + f + rng.range(-1, 1), y + 18 + l + 6);
      }
      ink(ctx, { a: 0.5, w: 1.2 });
    }
  }
}

/** Pencil height marks up the wall, each with a little star: someone has been growing here. */
function heightMarks(ctx: Ctx, x: number, bottom: number, rng: Rng): void {
  let y = bottom - rng.range(30, 50);
  for (let i = 0; i < rng.int(4, 6); i++) {
    ctx.beginPath();
    ctx.moveTo(x - 14, y);
    ctx.lineTo(x + 14, y + rng.range(-1, 1));
    ink(ctx, { a: 0.62, w: 1.8 });
    ctx.fillStyle = rng.pick(CRAYONS);
    twinkle(ctx, x + 22, y - 1, 4.6);
    y -= rng.range(16, 26);
  }
}

/** Under a window from `x` (110 wide, sill at `sill`): its sill, a rod above and two tied-back curtains. */
function curtains(ctx: Ctx, x: number, top: number, sill: number, rng: Rng): void {
  ctx.fillStyle = 'rgba(50, 30, 60, 0.12)';
  ctx.fillRect(x - 10, sill + 10, 134, 6);
  ctx.beginPath();
  ctx.rect(x - 12, sill, 134, 11);
  fillInk(ctx, PASTEL.cream, FAR);
  const ry = top - 14;
  ctx.beginPath();
  ctx.moveTo(x - 24, ry);
  ctx.lineTo(x + 134, ry);
  ink(ctx, { a: 0.6, w: 3 });
  for (const kx of [x - 26, x + 136]) {
    ctx.beginPath();
    ctx.arc(kx, ry, 4.5, 0, Math.PI * 2);
    fillInk(ctx, PASTEL.butter, FAR);
  }
  const color = rng.pick([PASTEL.lilac, PASTEL.pink, PASTEL.periwinkle]);
  for (const side of [-1, 1]) {
    const edge = side < 0 ? x - 18 : x + 128;
    const inner = side < 0 ? x + 16 : x + 94;
    const tie = top + (sill - top) * 0.55;
    ctx.beginPath();
    ctx.moveTo(edge, ry);
    ctx.lineTo(inner, ry);
    ctx.quadraticCurveTo(inner - side * 4, tie - 30, edge + side * 14, tie);
    ctx.quadraticCurveTo(inner - side * 2, tie + 34, inner + side * 6, sill + 4);
    ctx.lineTo(edge, sill + 4);
    ctx.closePath();
    fillInk(ctx, color, FAR);
    // Folds and the tie.
    ctx.beginPath();
    for (let f = 1; f < 3; f++) {
      const fx = edge + ((inner - edge) * f) / 3;
      ctx.moveTo(fx, ry + 4);
      ctx.quadraticCurveTo(fx - side * 6, tie - 20, edge + side * 14 + side * 3, tie);
    }
    ink(ctx, { a: 0.24, w: 1.2 });
    ctx.beginPath();
    ctx.ellipse(edge + side * 12, tie, 5, 8, 0, 0, Math.PI * 2);
    fillInk(ctx, mix(color, '#6b4d68', 0.3), FAR);
  }
}

/**
 * The dormitory wall, finished between its windows (at `windows`, 110
 * wide, from `top` to `sill`): children's drawings pinned up, coat hooks
 * with a scarf, height marks, cracks in the plaster and damp stains.
 */
function dormDetails(ctx: Ctx, w: number, h: number, windows: readonly number[], top: number, sill: number, rng: Rng): void {
  const rail = h * 0.78;
  for (let i = 0; i < Math.max(2, w / 600); i++) stain(ctx, rng.range(0, w), rng.range(h * 0.05, h * 0.3), rng.range(50, 110), rng, '#8a6a7a');
  const gaps: [number, number][] = [];
  let from = 0;
  for (const wx of [...windows].sort((a, b) => a - b)) {
    gaps.push([from + 30, wx - 30]);
    from = wx + 140;
  }
  gaps.push([from + 30, w - 30]);
  let k = rng.int(0, 2);
  for (const [a, b] of gaps) {
    if (b - a < 90) continue;
    const mid = (a + b) / 2;
    const kind = k++ % 3;
    if (kind === 0) {
      // Two or three drawings, at children's height.
      const n = b - a > 260 ? 3 : 2;
      for (let i = 0; i < n; i++) pinnedDrawing(ctx, mid + (i - (n - 1) / 2) * 92 + rng.range(-8, 8), rail - rng.range(100, 150), rng);
    } else if (kind === 1) {
      hooks(ctx, mid - 75, rail - rng.range(118, 132), 4, rng);
    } else {
      heightMarks(ctx, mid - 50, rail, rng);
      pinnedDrawing(ctx, mid + 44, rail - rng.range(110, 150), rng);
    }
    if (rng.chance(0.5)) crack(ctx, [rng.chance(0.5) ? a : b, rng.range(top, sill)], rng.range(0.6, 2.4), rng.range(40, 80), rng, FAR, 1);
  }
}

/** The office's wood (frames, the board, the skirting) and the red of its seals and marks. */
const OFFICE = { wood: '#a07a5c', woodDark: '#7d5c47', gilt: '#c9a65e', paper: '#fbf7ea', red: '#c4504c', cork: '#d6ab7c' } as const;

/** A thing's soft shadow on the wall, down and to the right. */
function wallShadow(ctx: Ctx, x: number, y: number, sw: number, sh: number, r = 0): void {
  ctx.fillStyle = 'rgba(70, 50, 40, 0.14)';
  ctx.beginPath();
  if (r) rrect(ctx, x + 4, y + 5, sw, sh, r);
  else ctx.rect(x + 4, y + 5, sw, sh);
  ctx.fill();
}

/** Scribbled lines of writing across a sheet: `n` rows from (x, y), up to `lw` long. */
function writing(ctx: Ctx, x: number, y: number, lw: number, n: number, gap: number, rng: Rng, center = false): void {
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const l = lw * rng.range(0.55, 1);
    const x0 = center ? x + (lw - l) / 2 : x;
    ctx.moveTo(x0, y + i * gap);
    ctx.lineTo(x0 + l, y + i * gap + rng.range(-0.4, 0.4));
  }
  ink(ctx, { a: 0.42, w: 1 });
}

/** A framed certificate: title, lines, a signature and a red seal with its ribbons. */
function certificate(ctx: Ctx, x: number, y: number, rng: Rng): void {
  const fw = 62;
  const fh = 80;
  wallShadow(ctx, x, y, fw, fh);
  ctx.beginPath();
  ctx.rect(x, y, fw, fh);
  fillInk(ctx, rng.chance(0.5) ? OFFICE.gilt : OFFICE.woodDark, FAR);
  ctx.beginPath();
  ctx.rect(x + 6, y + 6, fw - 12, fh - 12);
  fillInk(ctx, OFFICE.paper, { a: 0.3, w: 1 });
  ctx.beginPath();
  ctx.moveTo(x + 16, y + 17);
  ctx.lineTo(x + fw - 16, y + 17);
  ink(ctx, { a: 0.6, w: 2.2 });
  writing(ctx, x + 13, y + 27, fw - 26, 4, 6, rng, true);
  // The signature.
  ctx.beginPath();
  ctx.moveTo(x + 12, y + fh - 15);
  for (let i = 1; i <= 4; i++) ctx.quadraticCurveTo(x + 12 + i * 4 - 2, y + fh - 15 - rng.range(3, 6) * (i % 2 ? 1 : -0.4), x + 12 + i * 4, y + fh - 15);
  ink(ctx, { a: 0.55, w: 1.1 });
  // The seal.
  const sx = x + fw - 18;
  const sy = y + fh - 18;
  ctx.fillStyle = mix(OFFICE.red, '#7a2430', 0.25);
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sx + d * 2, sy + 3);
    ctx.lineTo(sx + d * 7, sy + 13);
    ctx.lineTo(sx + d * 4, sy + 11);
    ctx.lineTo(sx + d * 3, sy + 14);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(sx, sy, 6.5, 0, Math.PI * 2);
  fillInk(ctx, OFFICE.red, { a: 0.5, w: 1 });
  ctx.fillStyle = mix(OFFICE.red, '#ffffff', 0.35);
  twinkle(ctx, sx, sy, 3.6);
}

/** Where a frame hung for years: the paint behind it kept its colour, a line of dust, the nail left in. */
function ghostFrame(ctx: Ctx, x: number, y: number, fw: number, fh: number): void {
  ctx.fillStyle = 'rgba(255, 252, 238, 0.4)';
  ctx.fillRect(x, y, fw, fh);
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = '#6b5a44';
  ctx.lineWidth = 1.4;
  ctx.strokeRect(x, y, fw, fh);
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(x + fw / 2, y - 8, 2.2, 0, Math.PI * 2);
  fillInk(ctx, '#7b6d63', FAR);
  ctx.beginPath();
  ctx.moveTo(x + fw / 2, y - 8);
  ctx.lineTo(x + fw / 2 + 4, y - 3);
  ink(ctx, { a: 0.2, w: 1.6 });
}

/** A round office clock, stopped (its hands at the time `rng` picks). */
function wallClock(ctx: Ctx, x: number, y: number, r: number, rng: Rng): void {
  ctx.fillStyle = 'rgba(70, 50, 40, 0.14)';
  ctx.beginPath();
  ctx.arc(x + 4, y + 5, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  fillInk(ctx, '#6f8480', FAR);
  ctx.beginPath();
  ctx.arc(x, y, r - 5, 0, Math.PI * 2);
  fillInk(ctx, OFFICE.paper, { a: 0.35, w: 1 });
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r0 = i % 3 ? r - 10 : r - 14;
    ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0);
    ctx.lineTo(x + Math.cos(a) * (r - 7), y + Math.sin(a) * (r - 7));
  }
  ink(ctx, { a: 0.7, w: 1.6 });
  const hour = rng.range(0, Math.PI * 2);
  const minute = rng.range(0, Math.PI * 2);
  for (const [a, l, lw] of [[hour, r * 0.48, 3], [minute, r * 0.72, 2]] as const) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.sin(a) * l, y - Math.cos(a) * l);
    ink(ctx, { a: 0.85, w: lw });
  }
  ctx.beginPath();
  ctx.arc(x, y, 2.6, 0, Math.PI * 2);
  fillInk(ctx, OFFICE.red, null);
  // The glass's gleam.
  ctx.beginPath();
  ctx.arc(x, y, r - 9, Math.PI * 1.1, Math.PI * 1.45);
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** A cork board in a wooden frame, notes pinned all over it and one small photo. */
function noticeBoard(ctx: Ctx, x: number, y: number, bw: number, bh: number, rng: Rng): void {
  wallShadow(ctx, x, y, bw, bh, 3);
  ctx.beginPath();
  rrect(ctx, x, y, bw, bh, 3);
  fillInk(ctx, OFFICE.wood, FAR);
  ctx.beginPath();
  ctx.rect(x + 7, y + 7, bw - 14, bh - 14);
  fillInk(ctx, OFFICE.cork, { a: 0.3, w: 1 });
  for (let i = 0; i < (bw * bh) / 70; i++) {
    ctx.fillStyle = rng.chance(0.5) ? 'rgba(120, 80, 40, 0.28)' : 'rgba(255, 240, 210, 0.35)';
    ctx.fillRect(x + 8 + rng.range(0, bw - 17), y + 8 + rng.range(0, bh - 17), 1.6, 1.6);
  }
  const notes = rng.int(4, 6);
  for (let i = 0; i < notes; i++) {
    const nw = rng.range(26, 38);
    const nh = nw * rng.range(0.8, 1.2);
    const nx = x + 12 + ((bw - 24 - nw) * (i + 0.5)) / notes + rng.range(-6, 6);
    const ny = y + 12 + rng.range(0, bh - 24 - nh);
    ctx.save();
    ctx.translate(nx + nw / 2, ny);
    ctx.rotate(rng.range(-0.14, 0.14));
    ctx.fillStyle = 'rgba(70, 40, 20, 0.18)';
    ctx.fillRect(-nw / 2 + 2, 2, nw, nh);
    const photo = i === 1;
    ctx.beginPath();
    ctx.rect(-nw / 2, 0, nw, nh);
    fillInk(ctx, photo ? '#ffffff' : rng.pick([PASTEL.butter, OFFICE.paper, PASTEL.pink, PASTEL.mint]), { a: 0.32, w: 1 });
    if (photo) {
      ctx.beginPath();
      ctx.rect(-nw / 2 + 3, 3, nw - 6, nh - 11);
      fillInk(ctx, PASTEL.aqua, null);
      chalk(ctx, { x: 0, y: 3 + (nh - 11) / 2, r: Math.min(nw, nh) * 0.5 }, rng, 0.6, INK, 0.75, 0);
    } else {
      writing(ctx, -nw / 2 + 4, 9, nw - 8, Math.floor(nh / 7), 5, rng);
    }
    ctx.beginPath();
    ctx.arc(0, 3, 2.6, 0, Math.PI * 2);
    fillInk(ctx, rng.pick([OFFICE.red, PASTEL.periwinkleDeep, PASTEL.leaf]), { a: 0.4, w: 0.8 });
    ctx.restore();
  }
}

/** A wall calendar: a little picture, the month's red band, its days, most of them crossed out. */
function wallCalendar(ctx: Ctx, x: number, y: number, rng: Rng): void {
  const cw = 76;
  const ch = 108;
  wallShadow(ctx, x, y, cw, ch);
  ctx.beginPath();
  ctx.rect(x, y, cw, ch);
  fillInk(ctx, OFFICE.paper, FAR);
  // The picture: a hill under a sun.
  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 5, y + 6, cw - 10, 36);
  ctx.clip();
  ctx.fillStyle = PASTEL.aqua;
  ctx.fillRect(x + 5, y + 6, cw - 10, 36);
  ctx.beginPath();
  ctx.arc(x + cw - 22, y + 18, 6, 0, Math.PI * 2);
  fillInk(ctx, PASTEL.butter, { a: 0.4, w: 1 });
  ctx.beginPath();
  ctx.ellipse(x + 24, y + 48, 40, 20, 0, 0, Math.PI * 2);
  fillInk(ctx, PASTEL.mint, { a: 0.4, w: 1 });
  ctx.restore();
  ctx.beginPath();
  ctx.rect(x + 5, y + 6, cw - 10, 36);
  ink(ctx, { a: 0.4, w: 1 });
  // The rings, the month and its days.
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(x + 12 + i * 13, y, 2.2, 0, Math.PI * 2);
    ink(ctx, { a: 0.7, w: 1.4 });
  }
  ctx.fillStyle = OFFICE.red;
  ctx.fillRect(x + 5, y + 46, cw - 10, 9);
  const crossed = rng.int(14, 26);
  const cell = (cw - 10) / 7;
  for (let d = 0; d < 30; d++) {
    const cx = x + 5 + (d % 7) * cell + cell / 2;
    const cy = y + 62 + Math.floor(d / 7) * 9.5;
    if (d < crossed) {
      ctx.beginPath();
      ctx.moveTo(cx - 2.6, cy - 2.6);
      ctx.lineTo(cx + 2.6, cy + 2.6);
      ctx.moveTo(cx + 2.6, cy - 2.6);
      ctx.lineTo(cx - 2.6, cy + 2.6);
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = OFFICE.red;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = 'rgba(60, 50, 50, 0.45)';
      ctx.fillRect(cx - 1, cy - 1, 2, 2);
    }
  }
  // The day it stops at, ringed.
  const last = crossed;
  ctx.beginPath();
  ctx.ellipse(x + 5 + (last % 7) * cell + cell / 2, y + 62 + Math.floor(last / 7) * 9.5, 5, 4.4, 0, 0, Math.PI * 2);
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = OFFICE.red;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** A taped-up chart whose bars, and the red line over them, go down. */
function chartPoster(ctx: Ctx, x: number, y: number, rng: Rng): void {
  const pw = 94;
  const ph = 116;
  ctx.save();
  ctx.translate(x + pw / 2, y);
  ctx.rotate(rng.range(-0.04, 0.04));
  ctx.translate(-pw / 2, 0);
  wallShadow(ctx, 0, 0, pw, ph);
  ctx.beginPath();
  ctx.rect(0, 0, pw, ph);
  fillInk(ctx, OFFICE.paper, FAR);
  ctx.beginPath();
  ctx.moveTo(14, 13);
  ctx.lineTo(pw - 22, 13);
  ink(ctx, { a: 0.6, w: 2.2 });
  // The axes.
  const ox = 14;
  const oy = ph - 18;
  ctx.beginPath();
  ctx.moveTo(ox, 26);
  ctx.lineTo(ox, oy);
  ctx.lineTo(pw - 10, oy);
  ink(ctx, { a: 0.7, w: 1.4 });
  const bars = 5;
  const top: Pt[] = [];
  let v = rng.range(0.8, 0.95);
  for (let i = 0; i < bars; i++) {
    const bh = (oy - 32) * v;
    const bx = ox + 7 + i * 14;
    ctx.beginPath();
    ctx.rect(bx, oy - bh, 9, bh);
    fillInk(ctx, i % 2 ? PASTEL.periwinkle : PASTEL.lilac, { a: 0.4, w: 1 });
    top.push([bx + 4.5, oy - bh - 6]);
    v *= rng.range(0.62, 0.85);
  }
  ctx.beginPath();
  ctx.moveTo(top[0]![0], top[0]![1]);
  for (const p of top.slice(1)) ctx.lineTo(p[0], p[1]);
  ctx.strokeStyle = OFFICE.red;
  ctx.lineWidth = 2;
  ctx.stroke();
  const [ex, ey] = top[top.length - 1]!;
  ctx.beginPath();
  ctx.moveTo(ex - 5, ey - 3);
  ctx.lineTo(ex + 1, ey + 2);
  ctx.lineTo(ex - 6, ey + 3);
  ctx.stroke();
  for (const tx of [4, pw - 4]) {
    ctx.save();
    ctx.translate(tx, 2);
    ctx.rotate(tx < pw / 2 ? -0.7 : 0.7);
    ctx.fillStyle = 'rgba(255, 248, 214, 0.75)';
    ctx.fillRect(-9, -4, 18, 8);
    ctx.restore();
  }
  ctx.restore();
}

/** A wall lamp: a brass plate and arm, a pleated shade, its warm light on the wall. */
function sconce(ctx: Ctx, x: number, y: number): void {
  const glow = ctx.createRadialGradient(x, y - 6, 4, x, y - 6, 70);
  glow.addColorStop(0, 'rgba(255, 226, 160, 0.4)');
  glow.addColorStop(1, 'rgba(255, 226, 160, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y - 6, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x, y + 24, 6, 10, 0, 0, Math.PI * 2);
  fillInk(ctx, OFFICE.gilt, FAR);
  ctx.beginPath();
  ctx.moveTo(x, y + 20);
  ctx.quadraticCurveTo(x + 2, y + 6, x, y);
  ink(ctx, { a: 0.75, w: 2.6 });
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 20);
  ctx.lineTo(x + 10, y - 20);
  ctx.lineTo(x + 16, y);
  ctx.lineTo(x - 16, y);
  ctx.closePath();
  fillInk(ctx, '#f6e7c4', FAR);
  ctx.beginPath();
  for (let i = -2; i <= 2; i++) {
    ctx.moveTo(x + i * 4, y - 19);
    ctx.lineTo(x + i * 6, y - 1);
  }
  ink(ctx, { a: 0.18, w: 1 });
}

/** An air grille with its slats and screws. */
function vent(ctx: Ctx, x: number, y: number): void {
  ctx.beginPath();
  ctx.rect(x, y, 56, 24);
  fillInk(ctx, '#d9d2b8', FAR);
  ctx.beginPath();
  for (let i = 1; i < 6; i++) {
    ctx.moveTo(x + 6, y + i * 4);
    ctx.lineTo(x + 50, y + i * 4);
  }
  ink(ctx, { a: 0.5, w: 1.3 });
  for (const [sx, sy] of [[x + 3, y + 3], [x + 53, y + 3], [x + 3, y + 21], [x + 53, y + 21]] as const) {
    ctx.fillStyle = 'rgba(60, 50, 40, 0.5)';
    ctx.fillRect(sx - 1, sy - 1, 2, 2);
  }
}

/** A socket low on the wall. */
function outlet(ctx: Ctx, x: number, y: number): void {
  ctx.beginPath();
  rrect(ctx, x - 9, y - 13, 18, 26, 3);
  fillInk(ctx, '#f6f1e2', FAR);
  ctx.fillStyle = 'rgba(50, 40, 40, 0.7)';
  for (const sy of [-6, 4]) {
    ctx.fillRect(x - 4, y + sy, 1.6, 4);
    ctx.fillRect(x + 2.4, y + sy, 1.6, 4);
  }
}

/** A window's slatted blind, let down a little way, and its pull cord. */
function blind(ctx: Ctx, x: number, y: number, bw: number, drop: number): void {
  ctx.beginPath();
  ctx.rect(x - 4, y - 6, bw + 8, 8);
  fillInk(ctx, '#d9d2b8', FAR);
  for (let sy = y + 2; sy < y + drop; sy += 7) {
    ctx.beginPath();
    ctx.rect(x, sy, bw, 5);
    fillInk(ctx, '#f1ecdc', { a: 0.3, w: 1 });
  }
  ctx.beginPath();
  ctx.moveTo(x + bw - 10, y + 2);
  ctx.lineTo(x + bw - 10, y + drop + 34);
  ink(ctx, { a: 0.5, w: 1 });
  ctx.beginPath();
  ctx.arc(x + bw - 10, y + drop + 37, 3, 0, Math.PI * 2);
  fillInk(ctx, OFFICE.gilt, FAR);
}

/**
 * The office's wall itself: old paint in soft blotches, a cornice under the
 * ceiling, raised panels with their bevels, a sage rail and the boarded wall
 * under it down to a wooden skirting.
 */
function officeWall(ctx: Ctx, w: number, h: number, rng: Rng): void {
  for (let i = 0; i < w / 160; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, h * 0.8);
    const r = rng.range(60, 140);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const c = rng.chance(0.5) ? '255, 250, 235' : '150, 130, 95';
    g.addColorStop(0, `rgba(${c}, 0.12)`);
    g.addColorStop(1, `rgba(${c}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // The cornice.
  ctx.beginPath();
  ctx.rect(-10, -10, w + 20, 32);
  fillInk(ctx, '#efe8d3', FAR);
  ctx.fillStyle = 'rgba(70, 50, 40, 0.12)';
  ctx.fillRect(-10, 22, w + 20, 6);
  ctx.beginPath();
  ctx.moveTo(-10, 10);
  ctx.lineTo(w + 10, 10);
  ink(ctx, { a: 0.25, w: 1.2 });
  // The panels: raised, lit from above.
  for (let x = 0; x < w; x += 240) {
    const px = x + 8;
    const py = h * 0.18;
    const pw = 224;
    const ph = h * 0.6;
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    fillInk(ctx, '#ede6cf', FAR);
    ctx.beginPath();
    ctx.moveTo(px + 10, py + ph - 10);
    ctx.lineTo(px + 10, py + 10);
    ctx.lineTo(px + pw - 10, py + 10);
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = '#fffdf4';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px + pw - 10, py + 10);
    ctx.lineTo(px + pw - 10, py + ph - 10);
    ctx.lineTo(px + 10, py + ph - 10);
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = '#5a4630';
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // The rail, the boards under it and the skirting.
  const rail = h * 0.8;
  const lower = mix('#e5ddc3', '#b9c9c3', 0.55);
  ctx.beginPath();
  ctx.rect(-10, rail + 14, w + 20, h - rail);
  fillInk(ctx, lower, FAR);
  for (let x = 14; x < w; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, rail + 16);
    ctx.lineTo(x, h - 24);
    ink(ctx, { a: 0.2, w: 1.1 });
  }
  ctx.fillStyle = 'rgba(60, 60, 50, 0.12)';
  ctx.fillRect(-10, rail + 16, w + 20, 6);
  ctx.beginPath();
  ctx.rect(-10, rail, w + 20, 16);
  fillInk(ctx, '#b9c9c3', MID);
  ctx.beginPath();
  ctx.moveTo(-10, rail + 4);
  ctx.lineTo(w + 10, rail + 4);
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.rect(-10, h - 26, w + 20, 36);
  fillInk(ctx, OFFICE.wood, FAR);
  ctx.beginPath();
  ctx.moveTo(-10, h - 20);
  ctx.lineTo(w + 10, h - 20);
  ink(ctx, { a: 0.3, w: 1.2 });
}

/** A cast-iron radiator standing under a window (centred on `x`, on the skirting at `bottom`), its pipe into the floor. */
function radiator(ctx: Ctx, x: number, bottom: number): void {
  const rw = 118;
  const rh = 70;
  const x0 = x - rw / 2;
  const y0 = bottom - rh;
  ctx.fillStyle = 'rgba(60, 60, 50, 0.16)';
  ctx.fillRect(x0 + 4, y0 + 6, rw, rh - 4);
  const fins = 9;
  const fw = rw / fins;
  for (let i = 0; i < fins; i++) {
    ctx.beginPath();
    rrect(ctx, x0 + i * fw + 1, y0, fw - 2, rh - 6, 4);
    fillInk(ctx, '#e3e6dc', FAR);
    ctx.beginPath();
    ctx.moveTo(x0 + i * fw + 4, y0 + 6);
    ctx.lineTo(x0 + i * fw + 4, y0 + rh - 14);
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  for (const yy of [y0 + 10, y0 + rh - 16]) {
    ctx.beginPath();
    ctx.rect(x0 - 2, yy, rw + 4, 5);
    fillInk(ctx, '#cfd3c7', { a: 0.4, w: 1 });
  }
  // The valve and the pipe.
  ctx.beginPath();
  ctx.rect(x0 + rw + 2, bottom - 26, 7, 26);
  fillInk(ctx, '#cfd3c7', FAR);
  ctx.beginPath();
  ctx.arc(x0 + rw + 5.5, bottom - 30, 5, 0, Math.PI * 2);
  fillInk(ctx, OFFICE.red, FAR);
}

/**
 * The office wall, panel by panel between its windows (each window fills
 * a panel; `panels` are their left edges): framed certificates (one gone), a
 * stopped clock over a notice board, a calendar crossed off day by day by a
 * chart going down, wall lamps on either side of the marks of pictures
 * taken away. Each sits in the middle of its panel, low enough to show in
 * the eye's frame. Grilles up high, damp from above.
 */
function officeDetails(ctx: Ctx, w: number, h: number, windows: readonly number[], rng: Rng): void {
  for (let i = 0; i < Math.max(2, w / 700); i++) stain(ctx, rng.range(0, w), rng.range(30, h * 0.16), rng.range(40, 90), rng, '#8a7350');
  const hasWindow = (px: number): boolean => windows.some((wx) => wx > px && wx < px + 240);
  for (let x = rng.range(80, 300); x < w; x += rng.range(500, 800)) if (!windows.some((wx) => x > wx - 70 && x < wx + 220)) vent(ctx, x, h * 0.13);
  for (let x = rng.range(100, 300); x < w; x += rng.range(380, 620)) if (!windows.some((wx) => x > wx - 30 && x < wx + 180)) outlet(ctx, x, h * 0.88);
  let k = rng.int(0, 3);
  for (let px = 0; px < w - 120; px += 240) {
    if (hasWindow(px) || rng.chance(0.2)) continue;
    const mid = px + 120;
    const y = h * 0.52;
    ctx.save();
    ctx.translate(mid, y);
    ctx.scale(1.1, 1.1);
    switch (k++ % 4) {
      case 0: {
        const gone = rng.int(0, 2);
        for (let i = 0; i < 3; i++) {
          const cx = -99 + i * 68;
          if (i === gone) ghostFrame(ctx, cx, 0, 62, 80);
          else certificate(ctx, cx, 0, rng);
        }
        break;
      }
      case 1:
        wallClock(ctx, 0, -40, 26, rng);
        noticeBoard(ctx, -84, -2, 168, 110, rng);
        break;
      case 2:
        wallCalendar(ctx, -88, -4, rng);
        chartPoster(ctx, -4, -8, rng);
        break;
      default:
        ghostFrame(ctx, -40, -14, 80, 62);
        ghostFrame(ctx, -24, 66, 48, 38);
    }
    ctx.restore();
    if (k % 4 === 0) {
      // Lamps on the stiles either side of the panel the pictures left.
      sconce(ctx, px + 4, y + 10);
      sconce(ctx, px + 236, y + 10);
    }
  }
}

/** Mauve roots hanging from the top: tapered, outlined, a few rootlets. */
function roots(ctx: Ctx, w: number, h: number, rng: Rng, fill: string, pen: Pen, per: number, len: [number, number], wid: [number, number]): void {
  const n = Math.max(1, Math.floor(w / per));
  for (let i = 0; i < n; i++) {
    let x = rng.range(0, w);
    let y = -20;
    const L = rng.range(len[0], len[1]) * h;
    const w0 = rng.range(wid[0], wid[1]);
    const steps = 6;
    const spine: Pt[] = [[x, y]];
    for (let k = 1; k <= steps; k++) {
      x += rng.range(-26, 26);
      y += L / steps;
      spine.push([x, y]);
    }
    const left: Pt[] = [];
    const right: Pt[] = [];
    spine.forEach((p, k) => {
      const a = spine[Math.max(0, k - 1)]!;
      const b = spine[Math.min(steps, k + 1)]!;
      const dl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = -(b[1] - a[1]) / dl;
      const ny = (b[0] - a[0]) / dl;
      const ww = (w0 * (1 - (k / steps) * 0.9)) / 2;
      left.push([p[0] + nx * ww, p[1] + ny * ww]);
      right.push([p[0] - nx * ww, p[1] - ny * ww]);
    });
    trace(ctx, [...left, spine[steps]!, ...right.reverse()]);
    fillInk(ctx, fill, pen);
    // Rootlets and a couple of bark marks.
    ctx.beginPath();
    for (let k = 1; k < steps - 1; k++) {
      if (!rng.chance(0.55)) continue;
      const p = spine[k]!;
      const d = rng.chance(0.5) ? 1 : -1;
      ctx.moveTo(p[0] + d * w0 * 0.3, p[1]);
      ctx.quadraticCurveTo(p[0] + d * w0 * 0.9, p[1] + 10, p[0] + d * w0 * 1.1, p[1] + rng.range(20, 34));
    }
    for (let k = 1; k < steps; k += 2) {
      const p = spine[k]!;
      ctx.moveTo(p[0] - w0 * 0.12, p[1] - 6);
      ctx.lineTo(p[0] + w0 * 0.1, p[1] + 4);
    }
    ink(ctx, { a: pen.a * 0.8, w: pen.w * 0.8 });
  }
}

const CRYSTAL_FILLS = [P.crystalTeal, P.crystalBlue, P.crystalOrange, PASTEL.pink, PASTEL.lilac];

/** Small pastel crystal clusters with a contour and one facet line each. */
function crystals(ctx: Ctx, w: number, h: number, n: number, rng: Rng, pen: Pen, yMin = 20): void {
  for (let i = 0; i < n; i++) {
    const x = rng.range(0, w);
    const y = rng.range(yMin, h);
    const fill = rng.pick(CRYSTAL_FILLS);
    const count = rng.int(1, 3);
    for (let k = 0; k < count; k++) {
      const hh = rng.range(14, 38) * (k === 0 ? 1 : 0.7);
      const cx = x + (k - (count - 1) / 2) * hh * 0.4;
      const lean = rng.range(-0.35, 0.35);
      const hw = hh * 0.17;
      ctx.beginPath();
      ctx.moveTo(cx - hw, y);
      ctx.lineTo(cx - hw + lean * hh * 0.7, y - hh * 0.72);
      ctx.lineTo(cx + lean * hh, y - hh);
      ctx.lineTo(cx + hw + lean * hh * 0.7, y - hh * 0.72);
      ctx.lineTo(cx + hw, y);
      ctx.closePath();
      fillInk(ctx, fill, pen);
      ctx.beginPath();
      ctx.moveTo(cx + lean * hh, y - hh);
      ctx.lineTo(cx + hw * 0.15, y);
      ink(ctx, { a: pen.a * 0.7, w: pen.w * 0.7 });
    }
  }
}

/** The fossil whale in the chamber wall, as a thin line drawing. */
function fossilWhale(ctx: Ctx, x: number, y: number, s: number, pen: Pen, fill: string): void {
  ctx.beginPath();
  ctx.ellipse(x + 150 * s, y + 6 * s, 200 * s, 52 * s, -0.04, 0, Math.PI * 2);
  fillInk(ctx, fill, { a: pen.a * 0.6, w: pen.w });
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 160 * s, y - 50 * s, x + 340 * s, y);
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    const px = x + 340 * s * t;
    const py = y - Math.sin(t * Math.PI) * 26 * s;
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px + 10 * s, py + 20 * s, px - 4 * s, py + 38 * s * Math.sin(t * Math.PI + 0.3));
  }
  ctx.moveTo(x - 64 * s, y + 4 * s);
  ctx.ellipse(x - 30 * s, y + 4 * s, 34 * s, 16 * s, -0.1, Math.PI, Math.PI * 3);
  ink(ctx, pen);
}

/** Sprout in a dirt hole (the paintings' little ground plants). */
function sprout(ctx: Ctx, x: number, y: number, s: number, rng: Rng, pen: Pen, hole: string, green: string): void {
  ctx.beginPath();
  ctx.ellipse(x, y, 16 * s, 6 * s, 0, 0, Math.PI * 2);
  fillInk(ctx, hole, pen);
  const n = rng.int(2, 3);
  for (let i = 0; i < n; i++) leaf(ctx, x + (i - (n - 1) / 2) * 7 * s, y - 2 * s, rng.range(20, 30) * s, -Math.PI / 2 + (i - (n - 1) / 2) * 0.55 + rng.range(-0.1, 0.1), green, pen);
}

function grain(ctx: Ctx, w: number, h: number, strength = 1): void {
  applyGrain(ctx, -2, -2, w + 4, h + 4, { strength });
}

// ------------------------------------------------------------------ themes

const underground = (wall: string, stones: readonly string[], root: string, glowFill: string): LayerSpec[] => [
  {
    scroll: 0.15,
    res: 0.5,
    draw: (ctx, { w, h }, rng) => {
      field(ctx, w, h, wall);
      stoneWall(ctx, w, h, rng, stones, FAR, 1.4);
      fossilWhale(ctx, w * rng.range(0.2, 0.6), h * rng.range(0.3, 0.6), 0.9, FAR, glowFill);
      grain(ctx, w, h);
    },
  },
  {
    scroll: 0.4,
    res: 0.5,
    draw: (ctx, { w, h }, rng) => {
      roots(ctx, w, h, rng, mix(root, wall, 0.35), MID, 150, [0.25, 0.6], [16, 34]);
      crystals(ctx, w, h, Math.floor(w / 110), rng, MID, h * 0.25);
      grain(ctx, w, h);
    },
  },
  {
    scroll: 0.7,
    res: 1,
    draw: (ctx, { w, h }, rng) => {
      roots(ctx, w, h * 0.7, rng, root, NEAR, 420, [0.4, 0.8], [22, 40]);
      grain(ctx, w, h);
    },
  },
];

const nightSurface = (farHill: string, midHill: string, trunk: string, crown: string): LayerSpec[] => [
  {
    scroll: 0.05,
    res: 0.5,
    draw: (ctx, { w, h, horizon }, rng) => {
      field(ctx, w, h, PASTEL.night);
      starField(ctx, w, horizon - 60, rng, 26000, FAR);
      hills(ctx, w, h, horizon + 40, 120, farHill, rng, FAR, 0.6);
      grain(ctx, w, h, 0.35);
    },
  },
  {
    scroll: 0.3,
    res: 0.5,
    draw: (ctx, { w, h, horizon }, rng) => {
      for (let x = rng.range(0, 80); x < w; x += rng.range(70, 160)) pine(ctx, x, horizon + 124 + rng.range(-16, 16), rng.range(70, 130), mix(midHill, crown, 0.3), MID);
      hills(ctx, w, h, horizon + 110, 70, midHill, rng, MID, 1.2);
      grain(ctx, w, h, 0.7);
    },
  },
  {
    scroll: 0.6,
    res: 1,
    draw: (ctx, { w, h, horizon }, rng) => {
      for (let x = rng.range(0, 200); x < w; x += rng.range(240, 420)) tree(ctx, x, horizon + 300, rng.range(260, 400), trunk, crown, rng, NEAR);
      hills(ctx, w, h, horizon + 318, 34, mix(midHill, crown, 0.45), rng, NEAR, 2);
      grain(ctx, w, h);
    },
  },
];

/** Daylight sky in the manner of the warrior painting: periwinkle, clouds, rain. */
function daySky(ctx: Ctx, w: number, h: number, horizon: number, rng: Rng, sky: string, bands: readonly string[], clouds: number): void {
  field(ctx, w, h, sky);
  // Flat horizon bands, each with a soft wavy top edge.
  bands.forEach((c, i) => {
    const y0 = horizon - 40 - (bands.length - i) * 34;
    const top: Pt[] = [];
    for (let x = -40; x <= w + 40; x += 60) top.push([x, y0 + Math.sin(x / 170 + i * 2) * 8]);
    trace(ctx, top, false);
    ctx.lineTo(w + 40, h + 10);
    ctx.lineTo(-40, h + 10);
    ctx.closePath();
    ctx.fillStyle = c;
    ctx.fill();
  });
  const n = Math.max(1, Math.round((w / 1000) * clouds));
  for (let i = 0; i < n; i++) {
    const cw = rng.range(150, 260);
    cloud(ctx, rng.range(-40, w), rng.range(horizon * 0.08, horizon * 0.42), cw, rng, '#c3d0d6', rng.chance(0.6) ? '#d9829c' : null, FAR);
  }
}

const THEMES: Record<ThemeId, ThemeDef> = {
  nursery: {
    // The house of the stranger, as the first painting shows it: a pink box
    // in a pale world of cracked stone (see painting1.ts).
    sky: [P1.stone, P1.stone],
    layers: painting1Layers(),
    terrain: {
      // The box's floor: the torn paper on top, the lilac front below it.
      paper: { base: P1.wall, top: P1.paperFloor, detail: lineFor(P1.wall), accent: P1.lid },
      soil: { base: '#d8c3a6', top: '#e8d8bd', detail: '#9c8670', accent: P.crystalTeal },
      stone: { base: '#c9c7c4', top: '#dedcd9', detail: '#8f8b8b' },
    },
    ambient: 'dust',
    horizon: 0.6,
  },
  roots: {
    sky: ['#c3bec6', '#bdb8c1'],
    layers: underground('#bdb8c1', ['#c6c1c9', '#bfbac3', '#cbc7ce', '#b8b3bd'], '#b39aa8', '#d9d2dc'),
    terrain: {},
    ambient: 'dust',
    horizon: 0.6,
  },
  chamber: {
    sky: ['#b7ccc6', '#afc5bf'],
    layers: underground('#afc5bf', ['#b9cdc8', '#b2c8c2', '#bfd2cc', '#a9c0ba'], '#a996a8', '#d5e3df'),
    terrain: { soil: { base: '#c7bfd0', top: '#dcd5e4', detail: '#8e84a0', accent: P.crystalTeal } },
    ambient: 'sparkle',
    horizon: 0.6,
  },
  surface: {
    sky: [PASTEL.night, PASTEL.night],
    layers: nightSurface('#4c6356', '#5f7868', '#a88f9c', '#9fb89a'),
    terrain: { moss: { base: '#cdb89a', top: '#a9cf8f', detail: '#8d7a62' } },
    ambient: 'wind',
    horizon: 0.55,
  },
  hill: {
    sky: [PASTEL.night, PASTEL.night],
    layers: nightSurface('#4e6559', '#627b6c', '#b095a3', '#a3bb9d'),
    terrain: { moss: { base: '#d0bb9c', top: '#b0d392', detail: '#8f7c64' } },
    ambient: 'wind',
    horizon: 0.5,
  },
  forest: {
    sky: [PASTEL.night, PASTEL.night],
    layers: nightSurface('#4a6254', '#5b7465', '#a58c99', '#94b391'),
    terrain: { moss: { base: '#c9b597', top: '#9fcb8f', detail: '#8a775f' } },
    ambient: 'petals',
    horizon: 0.5,
  },
  ride: {
    sky: [PASTEL.periwinkle, '#f1c9b0'],
    layers: [
      {
        scroll: 0.03,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          daySky(ctx, w, h, horizon, rng, PASTEL.periwinkle, ['#c9b8e0', '#f0c6cf', '#f6d3b2'], 2.2);
          hills(ctx, w, h, horizon + 30, 140, '#b7a6cf', rng, FAR, 0.5);
          grain(ctx, w, h);
        },
      },
      {
        scroll: 0.12,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          for (let x = rng.range(0, 80); x < w; x += rng.range(80, 170)) pine(ctx, x, horizon + 122 + rng.range(-12, 12), rng.range(60, 110), '#98b596', MID);
          hills(ctx, w, h, horizon + 110, 80, '#a9c4a0', rng, MID, 1);
          grain(ctx, w, h);
        },
      },
      {
        scroll: 0.35,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          for (let x = rng.range(0, 200); x < w; x += rng.range(260, 460)) tree(ctx, x, horizon + 260, rng.range(220, 320), '#b39aa8', '#b6d09a', rng, NEAR);
          hills(ctx, w, h, horizon + 270, 30, PASTEL.sand, rng, NEAR, 2);
          grain(ctx, w, h);
        },
      },
    ],
    terrain: { moss: { base: PASTEL.sand, top: '#b8d696', detail: '#94806a' } },
    ambient: 'petals',
    horizon: 0.5,
  },
  sun: {
    sky: [PASTEL.periwinkle, PASTEL.periwinkle],
    layers: [
      {
        scroll: 0.1,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          daySky(ctx, w, h, horizon, rng, PASTEL.periwinkle, [], 2.6);
          hills(ctx, w, h, horizon + 170, 60, PASTEL.sandLight, rng, FAR, 0.7);
          grain(ctx, w, h);
        },
      },
      {
        scroll: 0.35,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          // A low canopy that frames the arena at the sides; the centre stays
          // open for the Sun and dips lowest where it will sink.
          const base = h * 0.84;
          for (let x = -60; x < w + 60; x += rng.range(90, 150)) {
            const side = Math.abs(x - w / 2) / (w / 2);
            const hgt = 90 + 260 * Math.pow(side, 1.6) + rng.range(-20, 20);
            tree(ctx, x, base + 20, hgt, '#b39aa8', rng.pick(['#b8d39a', '#a8c9a0', '#c3dc8c']), rng, MID);
          }
          hills(ctx, w, h, base + 10, 22, PASTEL.sand, rng, MID, 2);
          for (let x = rng.range(40, 140); x < w; x += rng.range(160, 300)) sprout(ctx, x, base + 34 + rng.range(0, 20), 1, rng, MID, '#a5876c', '#b6d6a0');
          grain(ctx, w, h);
        },
      },
    ],
    terrain: { moss: { base: PASTEL.sand, top: '#bfd99b', detail: '#94806a' } },
    ambient: 'embers',
    horizon: 0.45,
  },
  clearing: {
    sky: ['#a9c9d6', '#a9c9d6'],
    layers: [
      {
        scroll: 0.06,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          daySky(ctx, w, h, horizon, rng, '#a9c9d6', ['#c8dcd6'], 1.6);
          hills(ctx, w, h, horizon + 60, 100, '#b3c7b6', rng, FAR, 0.6);
          grain(ctx, w, h);
        },
      },
      {
        scroll: 0.25,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          hills(ctx, w, h, horizon + 150, 40, '#a7c09f', rng, MID, 1);
          // River band with wave squiggles.
          ctx.beginPath();
          ctx.rect(-10, horizon + 150, w + 20, 60);
          fillInk(ctx, PASTEL.aqua, MID);
          ctx.beginPath();
          for (let x = rng.range(0, 40); x < w; x += rng.range(40, 90)) {
            const y = horizon + 162 + rng.range(0, 36);
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + 6, y - 5, x + 12, y);
            ctx.quadraticCurveTo(x + 18, y + 5, x + 24, y);
          }
          ink(ctx, { a: MID.a * 0.7, w: 1.4 });
          for (let x = rng.range(0, 80); x < w; x += rng.range(70, 150)) pine(ctx, x, horizon + 152, rng.range(60, 110), '#8fb193', MID);
          grain(ctx, w, h);
        },
      },
      {
        scroll: 0.55,
        res: 1,
        draw: (ctx, { w, h, horizon }, rng) => {
          for (let x = rng.range(0, 200); x < w; x += rng.range(240, 420)) tree(ctx, x, horizon + 330, rng.range(280, 400), '#b39aa8', '#a9c99a', rng, NEAR);
          hills(ctx, w, h, horizon + 330, 30, '#bcd3a8', rng, NEAR, 2);
          grain(ctx, w, h);
        },
      },
    ],
    terrain: { moss: { base: '#d3c3a4', top: '#afd29a', detail: '#8f7e66' } },
    ambient: 'dust',
    horizon: 0.45,
  },
  dorm: {
    sky: ['#efe3e6', '#ecdfe2'],
    layers: [
      {
        scroll: 0.2,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          field(ctx, w, h, '#ecdfe2');
          // Faded wallpaper, boarded wainscot and tall arched windows full of night and stars.
          wallpaper(ctx, w, h * 0.78, new Rng(1410), '#ecdfe2');
          wainscot(ctx, w, h * 0.78, h, PASTEL.blush, new Rng(1411));
          const windows: number[] = [];
          for (let x = rng.range(60, 200); x < w; x += rng.range(280, 400)) {
            windows.push(x);
            ctx.beginPath();
            ctx.moveTo(x, h * 0.74);
            ctx.lineTo(x, h * 0.3);
            ctx.arc(x + 55, h * 0.3, 55, Math.PI, 0);
            ctx.lineTo(x + 110, h * 0.74);
            ctx.closePath();
            fillInk(ctx, PASTEL.periwinkleDeep, FAR);
            ctx.save();
            ctx.clip();
            starField(ctx, w, h, new Rng(Math.floor(x)), 9000, FAR, 0.8);
            ctx.restore();
            ctx.beginPath();
            ctx.moveTo(x + 55, h * 0.3 - 55);
            ctx.lineTo(x + 55, h * 0.74);
            ctx.moveTo(x, h * 0.5);
            ctx.lineTo(x + 110, h * 0.5);
            ink(ctx, { a: FAR.a, w: 3 });
            curtains(ctx, x, h * 0.3 - 55, h * 0.74, rng);
          }
          dormDetails(ctx, w, h, windows, h * 0.3, h * 0.74, rng);
          grain(ctx, w, h);
        },
      },
      {
        scroll: 0.45,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          // Suspended clock faces.
          for (let x = rng.range(100, 300); x < w; x += rng.range(320, 540)) {
            const y = rng.range(h * 0.12, h * 0.45);
            const r = rng.range(26, 56);
            ctx.beginPath();
            ctx.moveTo(x, -10);
            ctx.lineTo(x, y - r);
            ink(ctx, MID);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            fillInk(ctx, PASTEL.cream, MID);
            ctx.beginPath();
            for (let k = 0; k < 12; k++) {
              const a = (k / 12) * Math.PI * 2;
              ctx.moveTo(x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78);
              ctx.lineTo(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9);
            }
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - r * 0.66);
            ctx.moveTo(x, y);
            ctx.lineTo(x + r * 0.45, y + r * 0.2);
            ink(ctx, MID);
          }
          grain(ctx, w, h);
        },
      },
    ],
    terrain: { floor: { base: '#dcb99a', top: '#ead3bc', detail: '#9e7f66', accent: P.ivory } },
    ambient: 'drips',
    horizon: 0.6,
  },
  mech: {
    sky: ['#bdbcc4', '#b8b7bf'],
    layers: [
      {
        scroll: 0.2,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          field(ctx, w, h, '#b8b7bf');
          stoneWall(ctx, w, h, rng, ['#bebdc5', '#b5b4bc', '#c4c3ca'], FAR, 1.6, false);
          for (let i = 0; i < w / 220; i++) {
            const x = rng.range(0, w);
            const y = rng.range(0, h);
            const r = rng.range(30, 90);
            ctx.beginPath();
            const teeth = 10;
            for (let k = 0; k < teeth * 2; k++) {
              const a = (k / (teeth * 2)) * Math.PI * 2;
              const rr = k % 2 ? r : r * 1.18;
              ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
            }
            ctx.closePath();
            fillInk(ctx, rng.pick([PASTEL.lavender, PASTEL.stone, PASTEL.aqua]), FAR);
            ctx.beginPath();
            ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
            fillInk(ctx, '#b8b7bf', FAR);
          }
          grain(ctx, w, h);
        },
      },
      {
        scroll: 0.5,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          roots(ctx, w, h, rng, '#a3abb8', MID, 260, [0.3, 0.6], [14, 26]);
          grain(ctx, w, h);
        },
      },
    ],
    terrain: { metal: { base: '#aeb5c1', top: '#c8cdd6', detail: '#7f8897', accent: PASTEL.butter } },
    ambient: 'dust',
    horizon: 0.6,
  },
  office: {
    sky: ['#e9e2c9', '#e5ddc3'],
    layers: [
      {
        scroll: 0.85,
        res: 1,
        draw: (ctx, { w, h }, rng) => {
          field(ctx, w, h, '#e5ddc3');
          officeWall(ctx, w, h, new Rng(1420));
          // Pale windows, their blinds let down a little.
          const windows: number[] = [];
          for (let x0 = rng.range(200, 500); x0 < w; x0 += rng.range(700, 900)) {
            // Each in the middle of a panel.
            const x = Math.round((x0 - 45) / 240) * 240 + 45;
            if (x + 150 > w || windows.includes(x)) continue;
            windows.push(x);
            radiator(ctx, x + 75, h - 26);
            ctx.beginPath();
            ctx.rect(x, h * 0.25, 150, 200);
            fillInk(ctx, PASTEL.aqua, MID);
            cloud(ctx, x + 18, h * 0.25 + 26, 70, rng, '#e8eef0', null, MID);
            ctx.beginPath();
            ctx.moveTo(x + 75, h * 0.25);
            ctx.lineTo(x + 75, h * 0.25 + 200);
            ctx.moveTo(x, h * 0.25 + 100);
            ctx.lineTo(x + 150, h * 0.25 + 100);
            ink(ctx, MID, 2.4);
            ctx.fillStyle = 'rgba(70, 50, 40, 0.14)';
            ctx.fillRect(x - 8, h * 0.25 + 211, 166, 5);
            ctx.beginPath();
            ctx.rect(x - 10, h * 0.25 + 200, 170, 11);
            fillInk(ctx, '#f1ecdc', FAR);
            blind(ctx, x, h * 0.25, 150, 46 + (windows.length % 3) * 22);
          }
          officeDetails(ctx, w, h, windows, rng);
          grain(ctx, w, h);
        },
      },
    ],
    terrain: {},
    ambient: 'dust',
    horizon: 0.6,
  },
};

/**
 * Foreground strip (2.5D): soft silhouettes that pass in front of the world
 * faster than it, along the bottom edge of the view. Outdoors, grass blades;
 * underground and indoors, crystals on pebbles. Painted flat in a muted tone
 * of the room with a faint contour, slightly out of focus, as if close to
 * the lens.
 */
export function paintForeground(ctx: CanvasRenderingContext2D, w: number, h: number, theme: ThemeId, rng: Rng): void {
  if (theme === 'nursery') {
    paintBoxForeground(ctx, w, h, rng);
    return;
  }
  const outdoor = theme === 'surface' || theme === 'hill' || theme === 'forest' || theme === 'clearing' || theme === 'ride' || theme === 'sun';
  const night = theme === 'surface' || theme === 'hill' || theme === 'forest';
  const green = night ? '#6f8c78' : '#9dbd90';
  const dark = theme === 'dorm' ? '#b89aa2' : theme === 'office' ? '#b5b09c' : theme === 'mech' ? '#8f8e9a' : '#8f8599';
  const pen: Pen = { a: 0.6, w: 2.2 };
  ctx.save();
  ctx.filter = 'blur(1.6px)';
  let x = rng.range(-40, 120);
  while (x < w) {
    const hgt = rng.range(0.35, 0.95) * h;
    if (outdoor) {
      const n = 3 + Math.floor(rng.range(0, 4));
      for (let i = 0; i < n; i++) {
        const bx = x + rng.range(-34, 34);
        const bh = hgt * rng.range(0.5, 1);
        const lean = rng.range(-0.4, 0.4);
        ctx.beginPath();
        ctx.moveTo(bx - 7, h + 4);
        ctx.quadraticCurveTo(bx + lean * bh * 0.4 - 6, h - bh * 0.6, bx + lean * bh, h - bh);
        ctx.quadraticCurveTo(bx + lean * bh * 0.4 + 6, h - bh * 0.55, bx + 7, h + 4);
        ctx.closePath();
        fillInk(ctx, green, pen);
      }
    } else {
      ctx.beginPath();
      ctx.ellipse(x, h + 6, rng.range(40, 90), rng.range(14, 30), 0, Math.PI, 0);
      fillInk(ctx, dark, pen);
      const n = 2 + Math.floor(rng.range(0, 3));
      for (let i = 0; i < n; i++) {
        const cx = x + rng.range(-40, 40);
        const ch = hgt * rng.range(0.4, 1);
        const cw = ch * rng.range(0.22, 0.34);
        const lean = rng.range(-0.3, 0.3);
        ctx.beginPath();
        ctx.moveTo(cx - cw / 2, h + 4);
        ctx.lineTo(cx - cw / 2 + lean * ch * 0.7, h - ch * 0.75);
        ctx.lineTo(cx + lean * ch, h - ch);
        ctx.lineTo(cx + cw / 2 + lean * ch * 0.7, h - ch * 0.75);
        ctx.lineTo(cx + cw / 2, h + 4);
        ctx.closePath();
        fillInk(ctx, mix(dark, rng.pick(CRYSTAL_FILLS), 0.35), pen);
      }
    }
    x += rng.range(220, 520);
  }
  ctx.restore();
  applyGrain(ctx, -2, -2, w + 4, h + 4);
}

export function themeDef(id: ThemeId): ThemeDef {
  return THEMES[id];
}

export { P };
