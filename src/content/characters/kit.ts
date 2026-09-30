import { limb, Rng, smooth, taper, type Pt } from '../../render/2d/svg';
import { DETAIL, flat, INK, OUTLINE } from '../../render/2d/style';
import type { PartArt } from '../../render/2d/rig/rigTypes';

// Drawing kit for the characters in the author's manner (the four
// paintings): thin even ink contours, flat pastel fills, and the paintings'
// collage details: root limbs with bark lines, leaves sprouting from limbs,
// stitched seams, little labels and mechanical segments. Every part is drawn
// in a local frame (its joint at 0,0), then shifted into its part canvas.

export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export const tr = (pts: readonly Pt[], ox: number, oy: number): Pt[] => pts.map(([x, y]) => [x + ox, y + oy]);
export const tp = (p: Pt, ox: number, oy: number): Pt => [p[0] + ox, p[1] + oy];

/** Builds a part whose local frame spans `box`; `draw` receives the offset. */
export function part(key: string, box: Box, draw: (ox: number, oy: number) => string, extra: Partial<PartArt> = {}): PartArt {
  const m = 5;
  const ox = -box.x0 + m;
  const oy = -box.y0 + m;
  return {
    key,
    w: Math.ceil(box.x1 - box.x0 + m * 2),
    h: Math.ceil(box.y1 - box.y0 + m * 2),
    px: ox,
    py: oy,
    body: draw(ox, oy),
    ...extra,
  };
}

/** A thin ink line (inner details: bark, creases, stitches, scribbles). */
export function ink(d: string, w: number = DETAIL, color: string = INK, opacity = 1): string {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${opacity !== 1 ? ` opacity="${opacity}"` : ''}/>`;
}

/** A plain flat fill without contour (patches clipped inside a shape). */
export function fillOnly(d: string, color: string, opacity = 1): string {
  return `<path d="${d}" fill="${color}"${opacity !== 1 ? ` opacity="${opacity}"` : ''}/>`;
}

/** Open smooth polyline path. */
export const path = (pts: readonly Pt[]): string => smooth(pts, 1, false);

/** Point on segment a→b at t, pushed sideways by `side` px. */
function along(a: Pt, b: Pt, t: number, side: number): Pt {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [a[0] + dx * t - (dy / len) * side, a[1] + dy * t + (dx / len) * side];
}

/**
 * Bark lines along a limb from a to b (limb width w): long wavy grooves
 * running with the grain plus a knot or two, as on the root arms and legs
 * of the paintings.
 */
export function barkLines(a: Pt, b: Pt, w: number, seed: number, o: { n?: number; color?: string; knots?: number; width?: number } = {}): string {
  const rng = new Rng(seed);
  const n = o.n ?? 3;
  const color = o.color ?? INK;
  const lw = o.width ?? DETAIL * 0.85;
  let s = '';
  for (let i = 0; i < n; i++) {
    const lane = n === 1 ? 0 : (i / (n - 1) - 0.5) * w * 0.55;
    const t0 = 0.08 + rng.range(0, 0.25);
    const t1 = Math.min(0.95, t0 + rng.range(0.35, 0.6));
    const pts: Pt[] = [];
    const steps = 4;
    for (let k = 0; k <= steps; k++) {
      const t = t0 + ((t1 - t0) * k) / steps;
      pts.push(along(a, b, t, lane + rng.range(-0.9, 0.9)));
    }
    s += ink(path(pts), lw, color);
  }
  for (let k = 0; k < (o.knots ?? 1); k++) {
    const t = rng.range(0.3, 0.75);
    const c = along(a, b, t, rng.range(-w * 0.15, w * 0.15));
    const r = Math.max(1.1, w * 0.12);
    s += ink(`M${c[0] - r} ${c[1]}q${r} ${-r * 1.4} ${r * 2} 0`, lw, color);
  }
  return s;
}

/** A tapered root limb segment with bark lines. */
export function rootSeg(a: Pt, b: Pt, wa: number, wb: number, fill: string, seed: number, o: { bulge?: number; lines?: number; over?: string } = {}): string {
  return flat(limb(a, b, wa, wb, o.bulge ?? 0.4), fill, {
    over: barkLines(a, b, (wa + wb) / 2, seed, { n: o.lines ?? 3 }) + (o.over ?? ''),
  });
}

/**
 * A leaf sprouting at `at`, pointing along `ang` (radians, 0 = +x), length
 * `len`: an almond with a pointed tip, a midrib and a tiny stem.
 */
export function leaf(at: Pt, ang: number, len: number, fill: string, o: { width?: number; stroke?: number; vein?: boolean } = {}): string {
  const wid = (o.width ?? 0.38) * len;
  const c = Math.cos(ang);
  const sn = Math.sin(ang);
  const P = (u: number, v: number): Pt => [at[0] + u * c - v * sn, at[1] + u * sn + v * c];
  const b = P(len * 0.12, 0);
  const t = P(len, 0);
  const l = P(len * 0.5, -wid * 1.05);
  const r = P(len * 0.5, wid * 1.05);
  const f = (p: Pt): string => `${Math.round(p[0] * 100) / 100} ${Math.round(p[1] * 100) / 100}`;
  const d = `M${f(b)}Q${f(l)} ${f(t)}Q${f(r)} ${f(b)}Z`;
  let s = ink(`M${f(at)}L${f(b)}`, DETAIL, INK);
  s += flat(d, fill, { stroke: o.stroke ?? DETAIL * 1.1, over: o.vein === false ? '' : ink(`M${f(b)}L${f(P(len * 0.82, 0))}`, DETAIL * 0.7) });
  return s;
}

/** Stitched seam along a polyline: the seam line and short cross ticks. */
export function stitches(pts: readonly Pt[], every = 4.5, tick = 2.4, color: string = INK, w = DETAIL * 0.85): string {
  let s = ink(path(pts), w * 0.8, color);
  let carry = every / 2;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len === 0) continue;
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    for (let d = carry; d < len; d += every) {
      const t = d / len;
      const x = a[0] + (b[0] - a[0]) * t;
      const y = a[1] + (b[1] - a[1]) * t;
      s += ink(`M${x - nx * tick} ${y - ny * tick}L${x + nx * tick} ${y + ny * tick}`, w, color);
    }
    carry = (carry - len) % every;
    if (carry < 0) carry += every;
  }
  return s;
}

/** Handwriting-like scribble inside a box (the paintings' tiny words). */
export function scribble(x: number, y: number, w: number, h: number, seed: number, color: string = INK, lw = DETAIL * 0.75): string {
  const rng = new Rng(seed);
  const pts: Pt[] = [];
  const n = Math.max(3, Math.round(w / 2.2));
  for (let i = 0; i <= n; i++) pts.push([x + (w * i) / n, y + h * (0.5 + rng.range(-0.5, 0.5))]);
  return ink(`M${pts.map((p) => `${Math.round(p[0] * 100) / 100} ${Math.round(p[1] * 100) / 100}`).join('L')}`, lw, color);
}

/** A little label: a flat tag with a scribbled word, optionally tilted. */
export function label(x: number, y: number, w: number, h: number, fill: string, seed: number, rot = 0): string {
  const r = Math.min(2, h / 3);
  const body =
    flat(`M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`, fill, { stroke: DETAIL * 1.1 }) +
    scribble(x + w * 0.16, y + h * 0.3, w * 0.68, h * 0.4, seed);
  return rot ? `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">${body}</g>` : body;
}

/**
 * A pink maze in the rectangle (the warrior's mechanical arm, the mech
 * form): a meander of right-angled ink runs.
 */
export function maze(x: number, y: number, w: number, h: number, color: string, seed: number, lw = DETAIL): string {
  const rng = new Rng(seed);
  const cols = Math.max(2, Math.round(w / 4.5));
  const rows = Math.max(2, Math.round(h / 4.5));
  const cw = w / cols;
  const ch = h / rows;
  let d = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = x + c * cw;
      const cy = y + r * ch;
      const k = rng.int(0, 3);
      if (k === 0) d += `M${cx} ${cy + ch * 0.5}H${cx + cw * 0.8}`;
      else if (k === 1) d += `M${cx + cw * 0.5} ${cy}V${cy + ch * 0.8}`;
      else if (k === 2) d += `M${cx + cw * 0.15} ${cy + ch * 0.2}H${cx + cw * 0.8}V${cy + ch * 0.85}`;
      else d += `M${cx + cw * 0.2} ${cy + ch * 0.85}V${cy + ch * 0.2}H${cx + cw * 0.85}`;
    }
  }
  return ink(d, lw, color);
}

/**
 * Root claws: pointed, slightly curled fingers or toes fanning out from
 * `base` around direction `ang` (radians, 0 = +x).
 */
export function claws(base: Pt, ang: number, spread: number, lens: readonly number[], w0: number, fill: string, seed: number, curl = 0.35): string {
  const rng = new Rng(seed);
  let s = '';
  const n = lens.length;
  for (let i = 0; i < n; i++) {
    const a = ang + (n === 1 ? 0 : (i / (n - 1) - 0.5) * spread) + rng.range(-0.06, 0.06);
    const L = lens[i]!;
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const bend = a + curl;
    const mid: Pt = [base[0] + c * L * 0.55, base[1] + sn * L * 0.55];
    const tip: Pt = [mid[0] + Math.cos(bend) * L * 0.45, mid[1] + Math.sin(bend) * L * 0.45];
    s += flat(taper([base, mid, tip], w0, 0.5), fill, { stroke: DETAIL * 1.2 });
  }
  return s;
}

/** Flat shape with the standard contour (re-export for brevity). */
export const shape = (d: string, fill: string, over = '', stroke: number = OUTLINE): string => flat(d, fill, { over, stroke });

/**
 * Polygon with rounded corners (hand-made boxes: helmets, armour plates).
 * `r` is the corner radius (per corner when an array).
 */
export function roundPoly(pts: readonly Pt[], r: number | readonly number[]): string {
  const n = pts.length;
  const f = (v: number): string => (Math.round(v * 100) / 100).toString();
  let d = '';
  for (let i = 0; i < n; i++) {
    const p = pts[i]!;
    const a = pts[(i - 1 + n) % n]!;
    const b = pts[(i + 1) % n]!;
    const rr = typeof r === 'number' ? r : (r[i] ?? 0);
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]) || 1;
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1]) || 1;
    const ka = Math.min(rr, la / 2) / la;
    const kb = Math.min(rr, lb / 2) / lb;
    const s: Pt = [p[0] + (a[0] - p[0]) * ka, p[1] + (a[1] - p[1]) * ka];
    const e: Pt = [p[0] + (b[0] - p[0]) * kb, p[1] + (b[1] - p[1]) * kb];
    d += `${i === 0 ? 'M' : 'L'}${f(s[0])} ${f(s[1])}Q${f(p[0])} ${f(p[1])} ${f(e[0])} ${f(e[1])}`;
  }
  return d + 'Z';
}

/** Neon strokes (the child's glowing screen face): halo, colour, core. */
export function neon(d: string, w: number, c: { glow: string; mid: string; core: string }, filled = false): string {
  const halo = `<path d="${d}" fill="${filled ? c.glow : 'none'}" stroke="${c.glow}" stroke-width="${w * 2.6}" stroke-linecap="round" stroke-linejoin="round" opacity="0.32"/>`;
  const mid = `<path d="${d}" fill="${filled ? c.mid : 'none'}" stroke="${c.mid}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const core = filled ? '' : `<path d="${d}" fill="none" stroke="${c.core}" stroke-width="${w * 0.38}" stroke-linecap="round" stroke-linejoin="round"/>`;
  return halo + mid + core;
}
