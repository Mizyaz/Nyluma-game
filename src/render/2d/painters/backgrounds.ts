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

/** A chalk doodle on a stone, in pale, rubbed lines. */
function chalk(ctx: Ctx, at: { x: number; y: number; r: number }, rng: Rng, s: number): void {
  const R = at.r * rng.range(0.45, 0.65);
  ctx.save();
  ctx.translate(at.x + rng.range(-0.4, 0.4) * at.r, at.y + rng.range(-0.15, 0.15) * at.r);
  ctx.rotate(rng.range(-0.25, 0.25));
  ctx.strokeStyle = '#fdfbff';
  ctx.globalAlpha = 0.85;
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
          // Wainscot band and tall arched windows full of night and stars.
          ctx.beginPath();
          ctx.rect(-10, h * 0.78, w + 20, h * 0.3);
          fillInk(ctx, PASTEL.blush, FAR);
          for (let x = rng.range(60, 200); x < w; x += rng.range(280, 400)) {
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
          }
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
          // Wall panels, baseboard and pale windows.
          for (let x = 0; x < w; x += 240) {
            ctx.beginPath();
            ctx.rect(x + 8, h * 0.18, 224, h * 0.6);
            fillInk(ctx, '#ede6cf', FAR);
          }
          ctx.beginPath();
          ctx.rect(-10, h * 0.8, w + 20, 16);
          fillInk(ctx, '#b9c9c3', MID);
          for (let x = rng.range(200, 500); x < w; x += rng.range(700, 900)) {
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
          }
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
