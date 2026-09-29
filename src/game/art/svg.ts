import { P } from './palette';

// Small toolkit for authoring cel-shaded SVG artwork in code. Shapes are
// point lists smoothed with Catmull-Rom splines; `cel()` renders a filled
// shape with a hard-edged shadow crescent, a rim highlight and an ink
// contour so the cel look lives in the artwork itself.

export type Pt = [number, number];

export class Rng {
  private s: number;
  constructor(seed: number) {
    this.s = seed >>> 0 || 1;
  }
  next(): number {
    // mulberry32
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a: number, b: number): number {
    return a + (b - a) * this.next();
  }
  int(a: number, b: number): number {
    return Math.floor(this.range(a, b + 1));
  }
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)]!;
  }
  chance(p: number): boolean {
    return this.next() < p;
  }
}

export function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const f = (n: number): string => (Math.round(n * 100) / 100).toString();

/** Closed smooth path through points (Catmull-Rom → cubic Bézier). */
export function smooth(pts: readonly Pt[], tension = 1, closed = true): string {
  const n = pts.length;
  if (n < 3) return poly(pts, closed);
  const get = (i: number): Pt => {
    if (closed) return pts[(i + n) % n]!;
    return pts[Math.max(0, Math.min(n - 1, i))]!;
  };
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const t = tension / 6;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

/** Straight polygon/polyline. */
export function poly(pts: readonly Pt[], closed = true): string {
  if (pts.length === 0) return '';
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 1; i < pts.length; i++) d += `L${f(pts[i]![0])} ${f(pts[i]![1])}`;
  return closed ? d + 'Z' : d;
}

/**
 * Mixed path: points flagged sharp (third element 1) keep a corner, others
 * are smoothed. Useful for faceted crystals with rounded bases.
 */
export function mixed(pts: readonly [number, number, number?][]): string {
  const n = pts.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p = pts[i]!;
    const prev = pts[(i - 1 + n) % n]!;
    const next = pts[(i + 1) % n]!;
    if (p[2]) {
      d += (i === 0 ? 'M' : 'L') + `${f(p[0])} ${f(p[1])}`;
    } else {
      const a: Pt = [(prev[0] + p[0]) / 2, (prev[1] + p[1]) / 2];
      const b: Pt = [(next[0] + p[0]) / 2, (next[1] + p[1]) / 2];
      d += (i === 0 ? 'M' : 'L') + `${f(a[0])} ${f(a[1])}Q${f(p[0])} ${f(p[1])} ${f(b[0])} ${f(b[1])}`;
    }
  }
  return d + 'Z';
}

export function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return `M${f(cx - rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(cx + rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(cx - rx)} ${f(cy)}Z`;
}

export function rrect(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, w / 2, h / 2);
  return `M${f(x + rr)} ${f(y)}H${f(x + w - rr)}Q${f(x + w)} ${f(y)} ${f(x + w)} ${f(y + rr)}V${f(y + h - rr)}Q${f(x + w)} ${f(y + h)} ${f(x + w - rr)} ${f(y + h)}H${f(x + rr)}Q${f(x)} ${f(y + h)} ${f(x)} ${f(y + h - rr)}V${f(y + rr)}Q${f(x)} ${f(y)} ${f(x + rr)} ${f(y)}Z`;
}

/** Tapered limb outline from a to b with widths wa/wb (rounded ends). */
export function limb(a: Pt, b: Pt, wa: number, wb: number, bulge = 0): string {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const ux = dx / len;
  const uy = dy / len;
  const ha = wa / 2;
  const hb = wb / 2;
  const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const hm = (ha + hb) / 2 + bulge;
  const pts: Pt[] = [
    [a[0] + nx * ha, a[1] + ny * ha],
    [mid[0] + nx * hm, mid[1] + ny * hm],
    [b[0] + nx * hb, b[1] + ny * hb],
    [b[0] + ux * hb * 0.9, b[1] + uy * hb * 0.9],
    [b[0] - nx * hb, b[1] - ny * hb],
    [mid[0] - nx * hm, mid[1] - ny * hm],
    [a[0] - nx * ha, a[1] - ny * ha],
    [a[0] - ux * ha * 0.9, a[1] - uy * ha * 0.9],
  ];
  return smooth(pts, 0.9);
}

/**
 * Tapered stroke outline along a polyline (branches, roots, tails, manes).
 * Width interpolates from w0 at the first point to w1 at the last.
 */
export function taper(pts: readonly Pt[], w0: number, w1: number): string {
  const n = pts.length;
  if (n < 2) return '';
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(n - 1, i + 1)]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = (w0 + (w1 - w0) * (i / (n - 1))) / 2;
    const p = pts[i]!;
    left.push([p[0] + nx * w, p[1] + ny * w]);
    right.push([p[0] - nx * w, p[1] - ny * w]);
  }
  const tip = pts[n - 1]!;
  const prev = pts[n - 2]!;
  const tl = Math.hypot(tip[0] - prev[0], tip[1] - prev[1]) || 1;
  const cap: Pt = [tip[0] + ((tip[0] - prev[0]) / tl) * w1 * 0.6, tip[1] + ((tip[1] - prev[1]) / tl) * w1 * 0.6];
  const base = pts[0]!;
  const nxt = pts[1]!;
  const bl = Math.hypot(nxt[0] - base[0], nxt[1] - base[1]) || 1;
  const bcap: Pt = [base[0] - ((nxt[0] - base[0]) / bl) * w0 * 0.4, base[1] - ((nxt[1] - base[1]) / bl) * w0 * 0.4];
  return smooth([...left, cap, ...right.reverse(), bcap], 0.85);
}

/** Organic blob around a centre. */
export function blob(cx: number, cy: number, rx: number, ry: number, rng: Rng, n = 9, jitter = 0.18): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const j = 1 + rng.range(-jitter, jitter);
    pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
  }
  return smooth(pts);
}

let uid = 0;
export function nextId(prefix = 'k'): string {
  uid = (uid + 1) % 1e9;
  return `${prefix}${uid}`;
}

export interface CelOpts {
  fill: string;
  shade?: string;
  light?: string;
  /** Shadow offset (the lit region is the shape shifted by -shadow). */
  sx?: number;
  sy?: number;
  /** Highlight offset. */
  hx?: number;
  hy?: number;
  stroke?: number;
  ink?: string;
  /** Extra markup drawn inside the shape (clipped) before shading. */
  inner?: string;
  /** Extra markup drawn inside the shape after shading (e.g. glowing veins). */
  over?: string;
  /** Explicit, hand-shaped shadow path clipped to the shape. */
  shadeD?: string;
  opacity?: number;
}

/** A cel-shaded filled shape with contour. */
export function cel(d: string, o: CelOpts): string {
  const id = nextId();
  const sx = o.sx ?? 4;
  const sy = o.sy ?? 4;
  const hx = o.hx ?? 3;
  const hy = o.hy ?? 3;
  const ink = o.ink ?? P.ink;
  const sw = o.stroke ?? 4;
  let s = `<g${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}>`;
  s += `<clipPath id="c${id}"><path d="${d}"/></clipPath>`;
  s += `<path d="${d}" fill="${o.fill}"/>`;
  s += `<g clip-path="url(#c${id})">`;
  if (o.inner) s += o.inner;
  if (o.light) {
    s += `<mask id="h${id}"><rect x="-4000" y="-4000" width="8000" height="8000" fill="#fff"/><path d="${d}" fill="#000" transform="translate(${hx},${hy})"/></mask>`;
    s += `<path d="${d}" fill="${o.light}" mask="url(#h${id})"/>`;
  }
  if (o.shade) {
    if (sx !== 0 || sy !== 0) {
      s += `<mask id="m${id}"><rect x="-4000" y="-4000" width="8000" height="8000" fill="#fff"/><path d="${d}" fill="#000" transform="translate(${-sx},${-sy})"/></mask>`;
      s += `<path d="${d}" fill="${o.shade}" mask="url(#m${id})"/>`;
    }
    if (o.shadeD) s += `<path d="${o.shadeD}" fill="${o.shade}"/>`;
  }
  if (o.over) s += o.over;
  s += `</g>`;
  if (sw > 0) s += `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
  s += `</g>`;
  return s;
}

/** Plain ink stroke along a path (details, cracks, veins). */
export function line(d: string, color: string, w: number, opacity = 1): string {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${opacity !== 1 ? ` opacity="${opacity}"` : ''}/>`;
}

export function fillPath(d: string, color: string, opacity = 1): string {
  return `<path d="${d}" fill="${color}"${opacity !== 1 ? ` opacity="${opacity}"` : ''}/>`;
}

/** Soft radial glow (used sparingly for emissive features). */
export function glow(cx: number, cy: number, r: number, color: string, opacity = 0.6): string {
  const id = nextId('g');
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${opacity}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="url(#${id})"/>`;
}

/** Wraps markup into a standalone SVG document rasterized at `scale`. */
export function svgDoc(w: number, h: number, body: string, scale = 2): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(w * scale)}" height="${Math.ceil(h * scale)}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
}

/** Faceted crystal cluster standing at (x, y) with height h. */
export function crystalCluster(
  x: number,
  y: number,
  h: number,
  rng: Rng,
  colors: { fill: string; shade: string; light: string },
  count = 3,
  stroke = 3,
): string {
  let s = '';
  const shards: { dx: number; hh: number; w: number; lean: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1) - 0.5;
    shards.push({
      dx: t * h * 0.55 + rng.range(-3, 3),
      hh: h * (i === Math.floor(count / 2) ? 1 : rng.range(0.5, 0.8)),
      w: h * rng.range(0.2, 0.28),
      lean: t * 0.5 + rng.range(-0.1, 0.1),
    });
  }
  // Draw smaller side shards first.
  shards.sort((a, b) => a.hh - b.hh);
  for (const sh of shards) {
    const bx = x + sh.dx;
    const tipX = bx + sh.lean * sh.hh;
    const tipY = y - sh.hh;
    const hw = sh.w / 2;
    const shoulder = sh.hh * 0.72;
    const pts: Pt[] = [
      [bx - hw, y + 2],
      [bx - hw + sh.lean * shoulder, y - shoulder],
      [tipX, tipY],
      [bx + hw + sh.lean * shoulder, y - shoulder],
      [bx + hw, y + 2],
    ];
    const d = poly(pts);
    const facet = poly([
      [tipX, tipY],
      [bx + hw + sh.lean * shoulder, y - shoulder],
      [bx + hw, y + 2],
      [bx + sh.lean * shoulder * 0.2 + hw * 0.1, y + 2],
    ]);
    s += cel(d, {
      fill: colors.fill,
      shade: colors.shade,
      light: colors.light,
      sx: 0,
      sy: 0,
      hx: 2.5,
      hy: 2,
      shadeD: facet,
      stroke,
    });
  }
  return s;
}
