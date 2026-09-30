import { P, pastelMarkup } from './palette';
import {
  cel,
  ellipsePath,
  fillPath,
  glow,
  hashSeed,
  line,
  mixed,
  nextId,
  poly,
  Rng,
  rrect,
  smooth,
  taper,
  type CelOpts,
  type Pt,
} from './svg';
import type { PartArt } from './rigTypes';

// Room props: scenery and interactive objects. Every prop is authored in its
// own logical canvas (0..w × 0..h) and rasterized at scale 1. Light falls
// from the upper left, so hard shadow crescents sit on the lower right.
// Scenery keeps muted values; interactive things carry the saturation.

interface Mat {
  fill: string;
  shade: string;
  light: string;
}
type Pivot = 'bc' | 'c' | 'tc';
type SharpPt = [number, number, number?];

const INK = P.ink;
const n2 = (v: number): number => Math.round(v * 100) / 100;

function mk(key: string, w: number, h: number, pivot: Pivot, draw: (rng: Rng) => string): PartArt {
  const py = pivot === 'bc' ? h : pivot === 'c' ? h / 2 : 0;
  // Hand-picked colours of older props are lifted into the pastel range.
  return { key, w, h, px: w / 2, py, body: pastelMarkup(draw(new Rng(hashSeed(key)))), scale: 1 };
}

/** Cel-shaded shape in a material (light upper-left, 3.5 px ink by default). */
function sh(d: string, m: Mat, o: Partial<CelOpts> = {}): string {
  return cel(d, { fill: m.fill, shade: m.shade, light: m.light, sx: 3, sy: 3, hx: 2, hy: 2, stroke: 3.5, ...o });
}

const circle = (cx: number, cy: number, r: number): string => ellipsePath(cx, cy, r, r);
const open = (pts: readonly Pt[], t = 1): string => smooth(pts, t, false);
const dot = (cx: number, cy: number, r: number, c: string, o = 1): string =>
  `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="${c}"${o !== 1 ? ` opacity="${o}"` : ''}/>`;
const grp = (attr: string, body: string): string => `<g ${attr}>${body}</g>`;
const shadowEl = (cx: number, cy: number, rx: number, ry: number, o = 0.3): string =>
  fillPath(ellipsePath(cx, cy, rx, ry), INK, o);
const polar = (cx: number, cy: number, r: number, a: number): Pt => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const rect = (x: number, y: number, w: number, h: number): string =>
  `M${n2(x)} ${n2(y)}H${n2(x + w)}V${n2(y + h)}H${n2(x)}Z`;
/** Rectangle traced the other way round: a hole inside a clockwise shape. */
const holeRect = (x: number, y: number, w: number, h: number): string =>
  `M${n2(x)} ${n2(y)}V${n2(y + h)}H${n2(x + w)}V${n2(y)}Z`;

function clipTo(d: string, body: string): string {
  const id = nextId('pc');
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${body}</g>`;
}

/** Closed smooth outline along a polyline with one width per point. */
function ribbon(pts: readonly Pt[], widths: readonly number[], tension = 0.85): string {
  const n = pts.length;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(n - 1, i + 1)]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    const w = widths[i]! / 2;
    const p = pts[i]!;
    left.push([p[0] + nx * w, p[1] + ny * w]);
    right.push([p[0] - nx * w, p[1] - ny * w]);
  }
  const tip = pts[n - 1]!;
  const prev = pts[n - 2]!;
  const tl = Math.hypot(tip[0] - prev[0], tip[1] - prev[1]) || 1;
  const we = widths[n - 1]! * 0.5;
  const cap: Pt = [tip[0] + ((tip[0] - prev[0]) / tl) * we, tip[1] + ((tip[1] - prev[1]) / tl) * we];
  const base = pts[0]!;
  const nxt = pts[1]!;
  const bl = Math.hypot(nxt[0] - base[0], nxt[1] - base[1]) || 1;
  const wb = widths[0]! * 0.4;
  const bcap: Pt = [base[0] - ((nxt[0] - base[0]) / bl) * wb, base[1] - ((nxt[1] - base[1]) / bl) * wb];
  return smooth([...left, cap, ...right.reverse(), bcap], tension);
}

/** A polyline shifted sideways (grain, streaks, veins riding a limb). */
function offsetPts(pts: readonly Pt[], d: number): Pt[] {
  const n = pts.length;
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(n - 1, i + 1)]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [p[0] - ((b[1] - a[1]) / len) * d, p[1] + ((b[0] - a[0]) / len) * d];
  });
}

/** Sub-range of a polyline (t0..t1 of its point indices, interpolated). */
function slicePts(pts: readonly Pt[], t0: number, t1: number, n = 6): Pt[] {
  const at = (t: number): Pt => {
    const f = t * (pts.length - 1);
    const i = Math.min(pts.length - 2, Math.floor(f));
    const k = f - i;
    const a = pts[i]!;
    const b = pts[i + 1]!;
    return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  };
  return Array.from({ length: n }, (_, i) => at(lerp(t0, t1, i / (n - 1))));
}

/**
 * Several shapes merged under one ink silhouette: fat ink strokes behind,
 * then the cel fills without contours, so overlaps read as one mass.
 */
function merged(ds: readonly string[], m: Mat, o: Partial<CelOpts> = {}, inkW = 3.5, ink: string = INK): string {
  let s = '';
  for (const d of ds) s += `<path d="${d}" fill="${ink}" stroke="${ink}" stroke-width="${inkW}" stroke-linejoin="round"/>`;
  for (const d of ds) s += sh(d, m, { ...o, stroke: 0 });
  return s;
}

function starD(cx: number, cy: number, r: number, inner = 0.45, n = 5, rot = -Math.PI / 2): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) pts.push(polar(cx, cy, i % 2 ? r * inner : r, rot + (i * Math.PI) / n));
  return poly(pts);
}

/** Crescent: disc (cx,cy,r) minus a disc shifted by (dx,dy)·r of radius k·r. */
function crescentD(cx: number, cy: number, r: number, dx = 0.45, dy = -0.35, k = 0.82): string {
  const ox = cx + r * dx;
  const oy = cy + r * dy;
  const r2 = r * k;
  const d = Math.hypot(ox - cx, oy - cy);
  const tc = Math.atan2(oy - cy, ox - cx);
  const al = Math.acos((r * r + d * d - r2 * r2) / (2 * r * d));
  const be = Math.acos((r2 * r2 + d * d - r * r) / (2 * r2 * d));
  const pts: Pt[] = [];
  const N = 18;
  for (let i = 0; i <= N; i++) pts.push(polar(cx, cy, r, tc + al + (i / N) * (2 * Math.PI - 2 * al)));
  for (let i = 1; i < N; i++) pts.push(polar(ox, oy, r2, tc + Math.PI + be - (i / N) * 2 * be));
  return poly(pts);
}

/** Five-petal (or n-petal) blossom outline. */
function flowerD(cx: number, cy: number, r: number, n = 5, rot = 0, inner = 0.38, sy = 1): string {
  const pts: Pt[] = [];
  const step = (Math.PI * 2) / n;
  for (let i = 0; i < n; i++) {
    const a = rot + i * step;
    for (const [da, rr] of [[-0.5, inner], [-0.3, 0.9], [0, 1], [0.3, 0.9]] as const) {
      const p = polar(0, 0, r * rr, a + da * step);
      pts.push([cx + p[0], cy + p[1] * sy]);
    }
  }
  return smooth(pts, 1);
}

/** Hand-drawn digits / roman letters as stroke paths inside a box. */
const GLYPHS: Record<string, Pt[][]> = {
  '1': [[[0.18, 0.24], [0.62, 0], [0.62, 1]]],
  '4': [[[0.72, 1], [0.72, 0], [0, 0.66], [1, 0.66]]],
  I: [[[0.5, 0], [0.5, 1]]], V: [[[0, 0], [0.5, 1], [1, 0]]], X: [[[0, 0], [1, 1]], [[1, 0], [0, 1]]],
};
function glyphD(ch: string, x: number, y: number, w: number, h: number, rng?: Rng): string {
  const j = (): number => (rng ? rng.range(-0.04, 0.04) : 0);
  return (GLYPHS[ch] ?? []).map((st) => poly(st.map(([u, v]) => [x + (u + j()) * w, y + (v + j()) * h]), false)).join('');
}

// ---------------------------------------------------------------- materials

const WOOD: Mat = { fill: '#a27758', shade: '#7b5840', light: '#c29873' };
const WOOD_PALE: Mat = { fill: '#caa277', shade: '#a07b55', light: '#e3c49b' };
const WOOD_RED: Mat = { fill: '#8e5d45', shade: '#694333', light: '#ae7b5d' };
const WOOD_DARK: Mat = { fill: '#6b4d3b', shade: '#4f382b', light: '#86644d' };
const BARK: Mat = { fill: P.bark, shade: P.barkDark, light: P.barkLight };
const IVORY: Mat = { fill: P.ivory, shade: P.ivoryDark, light: '#f7f0e4' };
const LINEN: Mat = { fill: '#dcd2c2', shade: '#b8aa95', light: '#efe8dd' };
const PILLOW: Mat = { fill: '#f0e8da', shade: '#cdbfa9', light: '#fffaf2' };
const PAINT_BLUE: Mat = { fill: '#5d80b6', shade: '#48658f', light: '#86a6d6' };
const PAINT_OCHRE: Mat = { fill: '#cf9a52', shade: '#a8783a', light: '#e6b976' };
const PAINT_IVORY: Mat = { fill: '#e6dac6', shade: '#c3b49c', light: '#f5eee2' };
const IRON: Mat = { fill: '#4d4756', shade: '#37323f', light: '#6a6475' };
const BRASS: Mat = { fill: P.sun, shade: P.sunDark, light: P.sunLight };
const BONE: Mat = { fill: '#b7ae9d', shade: '#8f8778', light: '#d5ccb8' };
const FOSSIL: Mat = { fill: '#6d6680', shade: '#524c63', light: '#8a839b' };
const HORSE: Mat = { fill: P.horse, shade: P.horseDark, light: P.horseLight };
const CRYSTAL: Record<'teal' | 'blue' | 'orange', Mat> = {
  teal: { fill: P.crystalTeal, shade: P.crystalTealDark, light: P.crystalTealLight },
  blue: { fill: P.crystalBlue, shade: P.crystalBlueDark, light: P.crystalBlueLight },
  orange: { fill: P.crystalOrange, shade: P.crystalOrangeDark, light: P.crystalOrangeLight },
};
const STRIPE = '#8c62c6';

function grain(x0: number, x1: number, ys: readonly number[], color: string, rng: Rng, w = 1.3, o = 0.8): string {
  return ys
    .map((y) => {
      const a = rng.range(x0, lerp(x0, x1, 0.3));
      const b = rng.range(lerp(x0, x1, 0.6), x1);
      return line(open([[a, y], [lerp(a, b, 0.5), y + rng.range(-1.2, 1.2)], [b, y + rng.range(-0.8, 0.8)]]), color, w, o);
    })
    .join('');
}

// ---------------------------------------------------------------- creatures & crystals

type Critter = 'fish' | 'bird' | 'moth';
const CRITTERS: Record<Critter, { parts: { pts: Pt[]; round: boolean }[]; eye: Pt }> = {
  fish: {
    parts: [
      { pts: [[0.5, 0], [0.3, 0.17], [0.02, 0.22], [-0.22, 0.14], [-0.3, 0], [-0.22, -0.14], [0.02, -0.23], [0.3, -0.18]], round: true },
      { pts: [[-0.24, 0], [-0.5, 0.21], [-0.43, 0], [-0.5, -0.21]], round: false },
      { pts: [[0.12, -0.19], [-0.06, -0.33], [-0.12, -0.15]], round: false },
    ],
    eye: [0.3, -0.05],
  },
  bird: {
    parts: [
      { pts: [[0.36, -0.08], [0.24, 0.06], [-0.05, 0.12], [-0.3, 0.06], [-0.36, -0.01], [-0.1, -0.06], [0.14, -0.14], [0.3, -0.18]], round: true },
      { pts: [[0.36, -0.14], [0.52, -0.1], [0.37, -0.04]], round: false },
      { pts: [[0.1, -0.08], [0.02, -0.38], [-0.12, -0.52], [-0.22, -0.32], [-0.14, -0.05]], round: true },
      { pts: [[-0.28, 0.02], [-0.52, 0.12], [-0.5, -0.04], [-0.3, -0.05]], round: false },
    ],
    eye: [0.28, -0.12],
  },
  moth: {
    parts: [
      { pts: [[0, -0.12], [0.34, -0.36], [0.46, -0.1], [0.12, 0.04]], round: true },
      { pts: [[0, -0.12], [-0.34, -0.36], [-0.46, -0.1], [-0.12, 0.04]], round: true },
      { pts: [[0.02, 0.02], [0.3, 0.2], [0.18, 0.34], [0.02, 0.18]], round: true },
      { pts: [[-0.02, 0.02], [-0.3, 0.2], [-0.18, 0.34], [-0.02, 0.18]], round: true },
      { pts: [[0.05, -0.22], [0.06, 0.26], [-0.06, 0.26], [-0.05, -0.22]], round: true },
    ],
    eye: [0, -0.2],
  },
};

/** A dark silhouette of a creature frozen inside a crystal. */
function critter(kind: Critter, cx: number, cy: number, size: number, ang: number, op = 0.62, eye = '#e8f6f3'): string {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const T = ([u, v]: Pt): Pt => [cx + (u * c - v * s) * size, cy + (u * s + v * c) * size];
  const def = CRITTERS[kind];
  let body = '';
  for (const p of def.parts) body += fillPath(p.round ? smooth(p.pts.map(T)) : poly(p.pts.map(T)), INK);
  const e = T(def.eye);
  return grp(`opacity="${op}"`, body) + dot(e[0], e[1], Math.max(0.7, size * 0.035), eye, 0.85);
}

interface Shard {
  x: number;
  y: number;
  len: number;
  w: number;
  /** 0 = pointing up, positive leans clockwise (to the right). */
  ang: number;
  shoulder?: number;
}

/** A faceted crystal shard: lit left face, shaded right face, glint. */
function shard(sd: Shard, m: Mat, stroke = 3, inside = ''): string {
  const ax = Math.sin(sd.ang);
  const ay = -Math.cos(sd.ang);
  const nx = Math.cos(sd.ang);
  const ny = Math.sin(sd.ang);
  const side = nx + ny * 0.3 >= 0 ? 1 : -1;
  const q = (v: number, u: number): Pt => [sd.x + nx * v * side + ax * u, sd.y + ny * v * side + ay * u];
  const hw = sd.w / 2;
  const L = sd.len;
  const k = (sd.shoulder ?? 0.72) * L;
  const outline = poly([q(-hw, -1), q(-hw, k), q(0, L), q(hw, k), q(hw, -1)]);
  const facet = poly([q(0, L), q(hw, k), q(hw, -1), q(hw * 0.2, -1), q(hw * 0.2, k * 0.97)]);
  const over =
    inside +
    line(poly([q(-hw * 0.5, k * 0.25), q(-hw * 0.5, k * 0.88)], false), m.light, Math.max(1, sd.w * 0.09), 0.9) +
    line(poly([q(-hw, k), q(0, L * 0.94), q(hw * 0.2, k * 0.97)], false), m.light, 1, 0.5);
  return cel(outline, { fill: m.fill, shade: m.shade, light: m.light, sx: 0, sy: 0, hx: 1.8, hy: 1.5, stroke, shadeD: facet, over });
}

/** Point along a shard's axis (for placing trapped creatures). */
function shardAt(sd: Shard, t: number, v = 0): Pt {
  return [sd.x + Math.sin(sd.ang) * sd.len * t + Math.cos(sd.ang) * v, sd.y - Math.cos(sd.ang) * sd.len * t + Math.sin(sd.ang) * v];
}

// ================================================================ ROOM 1

function bedPost(x: number, y: number, w: number, h: number, bx: number, by: number, r: number): string {
  return (
    sh(rrect(x, y, w, h, 3), WOOD, { sx: 3, sy: 0, hx: 2, hy: 0 }) +
    sh(rrect(x - 1.5, y - 1, w + 3, 6, 2), WOOD, { sx: 0, sy: 2, hx: 0, hy: 1.5, stroke: 2.6 }) +
    sh(circle(bx, by, r), WOOD, { sx: 2, sy: 2, hx: 1.5, hy: 1.5, stroke: 3 })
  );
}

function bed(): PartArt {
  return mk('prop.bed', 250, 110, 'bc', (rng) => {
    let s = shadowEl(126, 108, 118, 4, 0.35);
    s += fillPath(rect(14, 80, 222, 27), INK, 0.25);
    // Headboard panel (turned slightly towards us) with a painted moon.
    s += sh('M12 66V17Q13 5 27 6Q45 8 50 27V66Z', WOOD, {
      sx: 5, sy: 0,
      over:
        fillPath(crescentD(29, 17, 6.5), P.ivory) +
        line(crescentD(29, 17, 6.5), INK, 1.3) +
        fillPath(starD(41, 24, 2.8), P.ivory) +
        line(open([[16, 34], [18, 50], [16, 64]]), WOOD.shade, 1.3),
    });
    // Mattress: ticking shows at the head end.
    let tick = '';
    for (let x = 22; x < 234; x += 7) tick += line(`M${x} 38V64`, '#cbbfaa', 1.3);
    s += sh(rrect(16, 38, 218, 25, 7), LINEN, { sx: 0, sy: 4, hx: 0, hy: 2, inner: tick });
    s += sh(rrect(10, 60, 230, 22, 4), WOOD, {
      sx: 0, sy: 5, hx: 0, hy: 2.5, over: grain(16, 234, [66, 72, 77], WOOD.shade, rng) + dot(22, 71, 3, WOOD.shade) + dot(228, 71, 3, WOOD.shade),
    });
    s += sh(smooth([[22, 41], [19, 32], [25, 24], [41, 21], [59, 22], [70, 27], [73, 35], [67, 41], [45, 43]]), PILLOW, {
      sx: 3, sy: 4, stroke: 3,
      over: line(open([[33, 27], [40, 31], [49, 30]]), PILLOW.shade, 1.6) + line(open([[62, 28], [66, 33]]), PILLOW.shade, 1.4),
    });
    // Blanket: ivory with violet stripes, turned down at the pillow.
    const blanket = mixed([
      [74, 38, 1], [237, 38, 1], [239, 52], [237, 77, 1], [222, 79.5], [206, 76], [190, 79.5], [174, 76], [158, 79.5],
      [142, 76], [126, 79.5], [110, 76], [94, 79.5], [78, 77, 1], [73, 58],
    ]);
    s += grp('transform="translate(2 4)"', fillPath(blanket, INK, 0.3));
    let stripes = '';
    for (const x of [102, 136, 170, 204]) stripes += fillPath(rect(x, 30, 11, 60), STRIPE) + fillPath(rect(x + 15, 30, 2.5, 60), STRIPE, 0.85);
    s += sh(blanket, IVORY, {
      sx: 3, sy: 4, hx: 0, hy: 2.5, inner: stripes,
      over:
        fillPath(rect(72, 36, 17, 46), '#f5eee2') +
        fillPath(rect(76, 36, 4, 46), STRIPE, 0.9) +
        line('M89 38.5V78', INK, 2) +
        line(open([[124, 46], [127, 60], [124, 72]]), IVORY.shade, 1.5, 0.8) +
        line(open([[192, 44], [195, 58], [192, 70]]), IVORY.shade, 1.5, 0.8),
    });
    s += bedPost(4, 12, 12, 96, 10, 7, 6);
    s += bedPost(234, 29, 12, 79, 240, 24, 5);
    return s;
  });
}

function whaleMark(cx: number, cy: number, sz: number): string {
  const T = (pts: Pt[]): Pt[] => pts.map(([u, v]) => [cx + u * sz, cy + v * sz]);
  const o: CelOpts = { fill: P.ivory, shade: P.ivoryDark, sx: 1.5, sy: 1.5, stroke: 1.6 };
  const body = smooth(T([[0.46, 0.06], [0.36, -0.16], [0.08, -0.25], [-0.2, -0.16], [-0.34, 0.02], [-0.22, 0.18], [0.08, 0.24], [0.34, 0.2]]));
  const tail = smooth(T([[-0.28, 0.04], [-0.42, -0.1], [-0.56, -0.24], [-0.52, -0.04], [-0.62, 0.08], [-0.42, 0.08]]));
  const e = T([[0.24, -0.05]])[0]!;
  return (
    cel(tail, o) +
    cel(body, { ...o, over: dot(e[0], e[1], 1.4, INK) + line(open(T([[0.45, 0.08], [0.3, 0.11], [0.18, 0.08]])), INK, 1) }) +
    line(open(T([[0.1, -0.27], [0.06, -0.4], [-0.02, -0.46]])), P.ivory, 1.6) +
    line(open(T([[0.14, -0.27], [0.2, -0.4], [0.28, -0.44]])), P.ivory, 1.6)
  );
}

function gemMark(cx: number, cy: number, r: number, fish = false): string {
  const g: Pt[] = [[0, -1], [0.55, -0.5], [0.55, 0.5], [0, 1], [-0.55, 0.5], [-0.55, -0.5]].map(([u, v]) => [cx + u! * r, cy + v! * r]);
  return cel(poly(g), {
    ...CRYSTAL.teal,
    sx: 0, sy: 0, hx: 1.2, hy: 1.2, stroke: 1.8,
    shadeD: poly([[cx, cy - r], [cx + 0.55 * r, cy - 0.5 * r], [cx + 0.55 * r, cy + 0.5 * r], [cx, cy + r], [cx + 0.12 * r, cy]]),
    over: (fish ? critter('fish', cx - 0.05 * r, cy + 0.1 * r, r * 0.85, -0.5, 0.55) : '') + line(`M${cx - 0.3 * r} ${cy - 0.4 * r}V${cy + 0.3 * r}`, CRYSTAL.teal.light, 1.2),
  });
}

function toyBlock(x: number, y: number, paint: Mat, symbol: string, rng: Rng): string {
  const S = 58;
  let chips = '';
  for (let i = 0; i < 3; i++) {
    const cx = x + 8 + rng.range(0, S - 16);
    const cy = rng.chance(0.5) ? y + 8 + rng.range(-1, 2) : y + S - 8 + rng.range(-2, 1);
    chips += fillPath(ellipsePath(cx, cy, rng.range(2, 3.5), rng.range(1.2, 2)), WOOD_PALE.fill);
  }
  return (
    sh(rrect(x, y, S, S, 5), WOOD_PALE, {
      sx: 4, sy: 4, hx: 2.5, hy: 2.5, over: grain(x + 4, x + S - 4, [y + 4, y + S - 4.5], WOOD_PALE.shade, rng, 1.1),
    }) +
    sh(rrect(x + 8, y + 8, S - 16, S - 16, 3), paint, { sx: 3, sy: 3, hx: 1.5, hy: 1.5, stroke: 2.2, over: symbol + chips })
  );
}

function blocks(): PartArt {
  return mk('prop.blocks', 130, 122, 'bc', (rng) => {
    let s = shadowEl(65, 121, 62, 3, 0.35);
    s += toyBlock(7, 64, PAINT_BLUE, whaleMark(37, 94, 30), rng);
    s += toyBlock(65, 64, PAINT_OCHRE, sh(starD(94, 94, 14, 0.46), IVORY, { stroke: 1.6, sx: 1.5, sy: 1.5, hx: 0, hy: 0 }), rng);
    s += toyBlock(37, 6, PAINT_IVORY, gemMark(66, 35, 14, true), rng);
    return s;
  });
}

/** Running stitch along a path: short ink dashes (seams of stuffed toys). */
function stitches(d: string, w = 1.1, dash = '2.2 2.2'): string {
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round"/>`;
}

/**
 * The toy whale: a stuffed sperm whale, drawn like the paintings' objects.
 * A boxy head with a narrow felt jaw, a button eye, seams in running
 * stitch, a sewn-on patch, a little fabric label and a felt spout.
 */
function toyWhale(): PartArt {
  return mk('prop.toywhale', 90, 56, 'bc', () => {
    const PLUSH = '#b9c2df';
    const JAW = '#f4ecdc';
    let s = shadowEl(46, 54.5, 36, 2.2, 0.18);
    // Fluke: two soft lobes rising behind the tail stalk.
    s += cel(smooth([[16, 36], [10, 30], [4, 24], [2, 17], [7, 18], [11, 24], [11, 15], [15, 12], [16, 20], [19, 31]]), { fill: PLUSH, stroke: 1.8 });
    // Body: a big square-fronted head tapering to the tail.
    const body = mixed([
      [15, 37], [22, 30], [36, 22], [52, 15], [66, 12], [80, 12], [86, 16, 1], [88, 26], [87, 38, 1], [80, 44], [60, 47], [40, 46], [26, 43],
    ]);
    const inner =
      // Belly: a paler panel, joined by a seam.
      fillPath(smooth([[26, 43], [40, 40], [58, 41], [80, 40], [90, 38], [90, 56], [20, 56]]), '#d4dbee') +
      // The sewn-on patch.
      cel(poly([[31, 25.5], [41.5, 23.5], [43.5, 33], [33, 35]]), { fill: '#f2b6cf', stroke: 0, over: stitches('M32 26.4L41 24.6L42.6 32.4L33.6 34.2Z', 0.9, '1.6 1.6') }) +
      // Skin wrinkles, a sperm whale's.
      line(open([[50, 22], [54, 20], [58, 21.5]]), INK, 1) +
      line(open([[47, 27], [51, 25.2], [55, 26.6]]), INK, 1) +
      line(open([[21, 35.5], [24, 33.2], [27, 34]]), INK, 0.9);
    s += cel(body, { fill: PLUSH, stroke: 2, inner });
    // Seams: head to body, and along the belly.
    s += stitches(open([[60, 13], [57, 24], [58, 35], [61, 45.5]]));
    s += stitches(open([[27, 42], [40, 39.6], [58, 40.4], [80, 39.4], [87, 37.6]]));
    // The narrow jaw under the head, with little felt teeth.
    let teeth = '';
    for (const x of [64, 69, 74, 79]) teeth += cel(`M${x} 44.6L${x + 3.4} 44.6L${x + 1.7} 41.8Z`, { fill: '#ffffff', stroke: 0.8 });
    s += cel(smooth([[60, 45.5], [72, 44], [84, 43.5], [86.5, 45.5], [82, 48.5], [66, 49]]), { fill: JAW, stroke: 1.5 }) + teeth;
    // Button eye with its thread, set far back on the head.
    s += cel(circle(66, 28, 3.4), { fill: INK, stroke: 0 });
    s += line('M64.6 26.6L67.4 29.4M67.4 26.6L64.6 29.4', '#dfe4f2', 0.8);
    // Fabric label in the tail seam.
    s += cel(poly([[19, 38.5], [25.5, 40.5], [23.5, 48], [17, 46]]), { fill: PASTEL_TAG, stroke: 1.2, over: line('M19.2 42.6q1.2-1 2.4 0t2.4 0M18.6 45q1.2-1 2.4 0', '#d9737e', 0.8) });
    // A felt water spout at the front of the head.
    s += line(open([[82, 12], [81, 8], [83, 5]]), INK, 1.4);
    for (const [x, y, r] of [[79, 4.5, 2.6], [84.5, 3, 2.4], [87.4, 6.5, 2.1]] as const) s += cel(circle(x, y, r), { fill: '#bfe4ea', stroke: 1.1 });
    return s;
  });
}

const PASTEL_TAG = '#f7efdc';

function scratch(d: string, w = 2): string {
  return grp('transform="translate(1.1 1.3)"', line(d, '#141120', w + 0.6, 0.9)) + line(d, '#a99dbf', w);
}

function scratchRing(cx: number, cy: number, r: number, rng: Rng, turns = 1.12): string {
  const pts: Pt[] = [];
  const a0 = rng.range(0, Math.PI * 2);
  for (let i = 0; i <= 14; i++) pts.push(polar(cx, cy, r * (1 + rng.range(-0.08, 0.08)), a0 + (i / 14) * turns * Math.PI * 2));
  return open(pts);
}

function marks(): PartArt {
  return mk('prop.marks', 230, 260, 'c', (rng) => {
    const WALL: Mat = { fill: '#2e2840', shade: '#241f33', light: '#3b3450' };
    const patch: Pt[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      patch.push([115 + Math.cos(a) * 106 * rng.range(0.88, 1.03), 130 + Math.sin(a) * 124 * rng.range(0.9, 1.03)]);
    }
    let texture = '';
    for (let i = 0; i < 9; i++) {
      const x = rng.range(24, 206);
      const y = rng.range(20, 240);
      texture += fillPath(ellipsePath(x, y, rng.range(2, 5), rng.range(1.5, 3)), WALL.light, 0.9);
    }
    texture += line(open([[6, 180], [40, 170], [60, 188], [96, 196]]), WALL.shade, 3) + line(open([[150, 12], [168, 40], [200, 52]]), WALL.shade, 2.5);
    let s = sh(smooth(patch), WALL, { sx: 6, sy: 6, hx: 3, hy: 3, stroke: 3, inner: texture });
    for (let i = 0; i < 14; i++) {
      const col = i < 7 ? 0 : 1;
      const row = i % 7;
      const x = (col ? 142 : 86) + rng.range(-3, 3);
      const y = 222 - row * 27 + rng.range(-2, 2) - col * 7;
      s += scratch(`M${n2(x - 26)} ${n2(y + rng.range(-1, 1))}L${n2(x - 13)} ${n2(y)}`, 1.8);
      if (i < 13) {
        s += scratch(scratchRing(x, y, 8.5, rng), 2);
        continue;
      }
      // The fourteenth: gouged deeper, filled, circled twice, numbered.
      s += glow(x, y, 26, P.vein, 0.28);
      s += fillPath(circle(x, y, 9.5), '#c7aef0', 0.9);
      s += scratch(scratchRing(x, y, 9.5, rng, 1.05), 2.4);
      s += scratch(scratchRing(x, y, 15, rng, 1.2), 1.8);
      s += scratch(glyphD('1', x + 22, y - 17, 12, 32, rng), 2.4);
      s += scratch(glyphD('4', x + 36, y - 17, 20, 32, rng), 2.4);
    }
    // Stray gouges, as if counted with fingernails.
    for (let i = 0; i < 4; i++) {
      const x = 36 + i * 5 + rng.range(-1, 1);
      s += scratch(`M${x} ${40 + rng.range(-2, 2)}l${n2(rng.range(3, 6))} ${n2(rng.range(16, 22))}`, 1.4);
    }
    return s;
  });
}

function fourteen(): PartArt {
  return mk('prop.fourteen', 180, 120, 'c', (rng) => {
    const PAINT: Mat = { fill: P.ivory, shade: '#c8b99f', light: '#fbf6ec' };
    const j = (p: Pt): Pt => [p[0] + rng.range(-1.5, 1.5), p[1] + rng.range(-1.5, 1.5)];
    const strokes: [Pt[], number, number][] = [
      [[[33, 33], [46, 22], [60, 12]], 9, 14], [[[60, 11], [59, 40], [58.5, 70], [57, 98]], 16, 13], [[[37, 100], [58, 98.5], [79, 99]], 10, 11],
      [[[131, 11], [113, 37], [96, 61], [84, 75]], 12, 15], [[[83, 75], [110, 73], [136, 72.5], [158, 70]], 14, 9],
      [[[131, 24], [130.5, 60], [129, 104]], 17, 12],
    ];
    const ds: string[] = [];
    let streaks = '';
    for (const [pts0, w0, w1] of strokes) {
      const pts = pts0.map(j);
      ds.push(taper(pts, w0, w1));
      streaks += line(open(offsetPts(pts, w0 * 0.22)), PAINT.shade, 1.1, 0.7) + line(open(slicePts(offsetPts(pts, -w0 * 0.18), 0.1, 0.7)), PAINT.light, 1.2, 0.8);
    }
    // Drips run down from the lower edges of the strokes.
    for (const [x, y, len, w] of [
      [45, 101, 11, 4.5], [70, 101, 18, 4], [101, 76, 14, 4.5], [147, 74, 9, 3.5], [127, 107, 7, 4], [59, 99, 6, 3.5],
    ] as const) {
      ds.push(smooth([[x - w / 2, y - 4], [x + w / 2, y - 4], [x + w * 0.38, y + len * 0.7], [x + w * 0.62, y + len], [x, y + len + w * 0.75], [x - w * 0.62, y + len], [x - w * 0.38, y + len * 0.7]]));
    }
    let s = merged(ds, PAINT, { sx: 2.5, sy: 2.5, hx: 1.5, hy: 1.5 }, 4, P.inkSoft);
    s += streaks;
    // Spatter from the brush.
    for (let i = 0; i < 7; i++) s += dot(rng.range(20, 165), rng.range(8, 112), rng.range(0.8, 2), P.ivory, 0.8);
    return s;
  });
}

function windowProp(): PartArt {
  return mk('prop.window', 170, 200, 'c', (rng) => {
    const FRAME: Mat = { fill: '#8f6a4f', shade: '#6c4f3b', light: '#ad8768' };
    const X0 = 23;
    const Y0 = 21;
    const X1 = 147;
    const Y1 = 171;
    // The view: solid earth behind glass, lit violet.
    let v = fillPath(rect(X0 - 4, Y0 - 4, X1 - X0 + 8, Y1 - Y0 + 8), '#2a2340');
    const bands = ['#3a2f54', '#2f2746', '#4b3c6c', '#352b4e', '#413461', '#2c2442'];
    bands.forEach((c, i) => {
      const y = Y0 + 12 + i * 25;
      const top: Pt[] = [];
      for (let x = X0 - 6; x <= X1 + 6; x += 16) top.push([x, y + Math.sin(x / 23 + i * 1.7) * 4 + (x - 85) * 0.08]);
      v += fillPath(open(top) + `L${X1 + 6} ${Y1 + 6}L${X0 - 6} ${Y1 + 6}Z`, c);
      v += line(open(top), INK, 1.4, 0.55);
    });
    for (let i = 0; i < 12; i++) {
      v += sh(ellipsePath(rng.range(X0, X1), rng.range(Y0, Y1), rng.range(2, 4), rng.range(1.5, 2.5)), { fill: '#54467a', shade: '#3b3157', light: '#6a5b94' }, { stroke: 1.2, sx: 1, sy: 1, hx: 0.5, hy: 0.5 });
    }
    v += glow(85, 92, 92, P.violet, 0.42);
    v += sh(taper([[14, 52], [52, 66], [92, 94], [156, 122]], 15, 8), FOSSIL, { stroke: 2.6, sx: 2, sy: 3, over: line(open([[30, 58], [62, 72], [96, 96]]), FOSSIL.shade, 1.2) });
    v += sh(taper([[66, 76], [80, 58], [98, 42], [112, 30]], 7, 3), FOSSIL, { stroke: 2.2, sx: 1.5, sy: 1.5 });
    const t1: Shard = { x: 44, y: 166, len: 42, w: 19, ang: 0.42 };
    v += shard({ x: 30, y: 168, len: 22, w: 11, ang: -0.3 }, CRYSTAL.teal, 2.2);
    v += shard(t1, CRYSTAL.teal, 2.4, critter('fish', ...shardAt(t1, 0.45), 15, 0.42 - Math.PI / 2 + 0.3, 0.6));
    const b1: Shard = { x: 136, y: 24, len: 38, w: 17, ang: Math.PI + 0.55 };
    v += shard(b1, CRYSTAL.blue, 2.4, critter('fish', ...shardAt(b1, 0.5), 13, 2.4, 0.6));
    v += shard({ x: 118, y: 22, len: 20, w: 10, ang: Math.PI - 0.1 }, CRYSTAL.blue, 2);
    // Glass: shadow of the frame on the panes, glare streaks.
    for (const [px, py] of [[X0, Y0], [89, Y0], [X0, 99], [89, 99]] as const) {
      v += fillPath(`M${px} ${py}H${px + 58}V${py + 6}H${px + 5}V${py + 72}H${px}Z`, INK, 0.35);
      v += line(`M${px + 16} ${py + 60}L${px + 48} ${py + 14}`, '#ffffff', 7, 0.1);
      v += line(`M${px + 30} ${py + 62}L${px + 52} ${py + 31}`, '#ffffff', 2.2, 0.16);
    }
    let s = clipTo(rect(X0, Y0, X1 - X0, Y1 - Y0), v);
    // Frame with four panes.
    const frame =
      rrect(10, 8, 150, 176, 5) + holeRect(X0, Y0, 58, 70) + holeRect(89, Y0, 58, 70) + holeRect(X0, 99, 58, 72) + holeRect(89, 99, 58, 72);
    s += sh(frame, FRAME, {
      sx: 3.5, sy: 3.5, over: grain(14, 156, [13, 179], FRAME.shade, rng, 1.2) + line('M16 30V160M154 36V150', FRAME.shade, 1.2, 0.7),
    });
    s += sh(circle(85, 95, 4.5), BRASS, { stroke: 2, sx: 1.2, sy: 1.2, hx: 1, hy: 1 });
    // Sill with two small brackets.
    for (const x of [26, 144]) s += sh(`M${x - 7} 190H${x + 7}L${x + 3} 199H${x - 3}Z`, FRAME, { stroke: 2.4, sx: 2, sy: 1 });
    s += sh(rrect(2, 180, 166, 12, 3), FRAME, { sx: 0, sy: 4, hx: 0, hy: 2 });
    // Striped valance matching the bed linen.
    let vst = '';
    for (let x = 14; x < 164; x += 22) vst += fillPath(rect(x, 0, 7, 30), STRIPE, 0.9);
    const val: SharpPt[] = [[6, 3, 1], [164, 3, 1]];
    for (let x = 164; x >= 6; x -= 19.75) val.push([x, 22], [x - 9.9, 27.5]);
    val.push([6, 22, 1]);
    s += sh(mixed(val), IVORY, { sx: 2, sy: 3.5, hx: 0, hy: 2, stroke: 3, inner: vst, over: line('M26 6V20M65 6V22M105 6V22M145 6V20', IVORY.shade, 1.3, 0.8) });
    s += sh(rrect(0, 0.5, 170, 5, 2.5), WOOD_DARK, { stroke: 2.4, sx: 0, sy: 1.5, hx: 0, hy: 1 });
    return s;
  });
}

function chest(): PartArt {
  return mk('prop.chest', 160, 86, 'bc', (rng) => {
    let s = shadowEl(80, 84, 76, 3, 0.35);
    for (const x of [14, 130]) s += sh(rrect(x, 74, 16, 12, 2), WOOD_DARK, { stroke: 2.6, sx: 2, sy: 1 });
    const paint =
      fillPath(crescentD(48, 48.5, 8.5), P.ivory, 0.85) +
      fillPath(starD(99, 47, 5, 0.45, 5, -1.3), P.ivory, 0.85) +
      fillPath(starD(115, 51, 3.5, 0.45, 5, -1.8), P.ivory, 0.85) +
      fillPath(starD(88, 53, 3, 0.45, 5, -1.5), P.ivory, 0.85) +
      fillPath(starD(112, 69, 3, 0.45, 5, -1.2), P.ivory, 0.7);
    s += sh(rrect(9, 20, 142, 58, 3), WOOD_RED, {
      sx: 5, sy: 4, inner: paint,
      over: line('M11 39H149M11 58H149', WOOD_RED.shade, 1.6) + grain(12, 148, [28, 47, 67], WOOD_RED.shade, rng, 1.1, 0.6),
    });
    s += sh(rrect(4, 4, 152, 19, 5), WOOD_RED, { sx: 0, sy: 4, hx: 0, hy: 2.5, over: grain(8, 150, [10], WOOD_RED.shade, rng, 1.1, 0.6) });
    for (const x of [20, 132]) {
      s += sh(rect(x, 4, 8, 74), IRON, { stroke: 2.4, sx: 2, sy: 0, hx: 1, hy: 0 });
      for (const y of [12, 31, 50, 69]) s += dot(x + 4, y, 1.6, IRON.light);
    }
    s += sh(rrect(71, 14, 18, 22, 4), BRASS, {
      stroke: 2.4, sx: 2, sy: 2, hx: 1, hy: 1, over: fillPath('M80 21.5a2.6 2.6 0 1 1 -0.01 0M78.6 23.5L77.8 30H82.2L81.4 23.5Z', INK),
    });
    return s;
  });
}

function toyHorse(): PartArt {
  return mk('prop.toyhorse', 80, 70, 'bc', () => {
    const MANE: Mat = { fill: '#efe5d4', shade: '#c9b99f', light: '#fffaf0' };
    let s = shadowEl(40, 68, 34, 2.5, 0.35);
    // Far legs, then the rocker, then near legs.
    const far = { ...HORSE, fill: P.horseDark, shade: '#44246f', light: P.horse };
    s += sh(taper([[30, 40], [27, 52], [24, 61]], 6, 5), far, { stroke: 2.4, sx: 1.5, sy: 0 });
    s += sh(taper([[55, 40], [58, 52], [60, 61]], 6, 5), far, { stroke: 2.4, sx: 1.5, sy: 0 });
    s += sh(taper([[2, 52], [14, 61], [30, 66], [50, 66], [66, 61], [78, 52]], 6.5, 6), WOOD, { stroke: 2.6, sx: 0, sy: 2.5, hx: 0, hy: 1.5 });
    s += sh(taper([[26, 40], [22, 52], [18, 62]], 6.5, 5.5), HORSE, { stroke: 2.4, sx: 1.5, sy: 0 });
    s += sh(taper([[52, 40], [55, 52], [57, 62]], 6.5, 5.5), HORSE, { stroke: 2.4, sx: 1.5, sy: 0 });
    // Yarn tail.
    s += merged([taper([[19, 30], [12, 36], [8, 46], [10, 54]], 5, 3), taper([[19, 31], [15, 40], [15, 49]], 4, 2.5)], MANE, { sx: 1.5, sy: 1 }, 2.4);
    // Body and head.
    s += sh(smooth([[20, 30], [26, 25], [42, 24], [52, 26], [59, 31], [58, 41], [50, 45], [34, 45], [23, 42], [18, 36]]), HORSE, {
      sx: 2.5, sy: 3, stroke: 2.8,
      over: dot(30, 38, 1.6, P.horseLight, 0.8) + dot(36, 41, 1.2, P.horseLight, 0.8) + dot(44, 38, 1.4, P.horseLight, 0.8),
    });
    s += sh(smooth([[50, 32], [53, 20], [58, 11], [63, 5], [68, 6], [74, 10], [79, 17], [78.5, 22.5], [73, 24], [67, 20], [63, 26], [60, 36]]), HORSE, {
      sx: 2, sy: 2.5, stroke: 2.8,
      over: dot(69, 11.5, 1.8, INK) + dot(69.6, 10.9, 0.6, '#fff') + dot(77, 19.5, 0.9, INK) + line(open([[72.5, 23.5], [75.5, 21.5]]), INK, 1),
    });
    s += sh(poly([[62, 7], [63, 0], [67, 5.5]]), HORSE, { stroke: 2, sx: 0.8, sy: 0.8, hx: 0.6, hy: 0.6 });
    // Mane.
    s += merged(
      [taper([[62, 5], [57, 11], [53, 20], [51, 29]], 5.5, 3.5), taper([[60, 8], [56, 14], [55.5, 21]], 4.5, 2.5)],
      MANE,
      { sx: 1.5, sy: 1 },
      2.4,
    );
    // Saddle and handle peg.
    s += sh(smooth([[31, 25.5], [39, 23.5], [47, 25], [48, 31], [40, 33], [31, 31]]), BRASS, { stroke: 2.2, sx: 1.5, sy: 1.5, hx: 1, hy: 1 });
    s += sh(rrect(59, 12, 11, 4, 2), WOOD_PALE, { stroke: 1.8, sx: 0, sy: 1, hx: 0, hy: 0.8 });
    return s;
  });
}

function lamp(): PartArt {
  return mk('prop.lamp', 90, 190, 'tc', () => {
    const ORANGE = CRYSTAL.orange;
    let s = glow(45, 150, 44, '#f2b36a', 0.55);
    // Roots gripping the ceiling.
    s += sh(taper([[45, 3], [30, 1], [16, -1]], 8, 3), BARK, { stroke: 2.6, sx: 0, sy: 2 });
    s += sh(taper([[45, 3], [60, 1], [76, 0]], 8, 3), BARK, { stroke: 2.6, sx: 0, sy: 2 });
    // Two root strands braided into a cord.
    const strand = (ph: number): Pt[] => Array.from({ length: 11 }, (_, i) => [45 + Math.sin(i * 1.15 + ph) * 3.8, 1 + i * 11.8] as Pt);
    s += sh(taper(strand(Math.PI), 6.5, 5), { ...BARK, fill: P.barkDark }, { stroke: 2.4, sx: 1.5, sy: 0 });
    s += sh(taper(strand(0), 7, 5.5), BARK, { stroke: 2.4, sx: 2, sy: 0, over: line(open(strand(0.4).slice(1, 9)), P.violet, 1, 0.55) });
    s += sh(taper([[47, 46], [55, 52], [60, 50]], 3.5, 1.5), BARK, { stroke: 1.8, sx: 1, sy: 1 });
    s += sh(taper([[43, 80], [35, 86], [31, 84]], 3.5, 1.5), BARK, { stroke: 1.8, sx: 1, sy: 1 });
    // Orange crystal bulb hanging point-down, with a trapped moth.
    const main: Shard = { x: 45, y: 118, len: 60, w: 30, ang: Math.PI, shoulder: 0.45 };
    s += shard({ x: 34, y: 124, len: 30, w: 14, ang: Math.PI + 0.45, shoulder: 0.5 }, ORANGE, 2.6);
    s += shard({ x: 57, y: 124, len: 32, w: 14, ang: Math.PI - 0.5, shoulder: 0.5 }, ORANGE, 2.6);
    s += shard(main, ORANGE, 3, glow(45, 142, 18, '#fff1c9', 0.8) + critter('moth', 45, 146, 15, 0.25, 0.5, '#fff4d8'));
    // Root fingers cradling the crystal.
    for (const pts of [
      [[43, 116], [33, 124], [30, 138], [33, 150]], [[47, 116], [58, 125], [60, 138], [57, 149]], [[45, 118], [46, 128], [44, 138]],
    ] as Pt[][]) {
      s += sh(taper(pts, 6, 2.5), BARK, { stroke: 2.2, sx: 1.5, sy: 0.5 });
    }
    s += sh(ellipsePath(45, 116, 9, 5), BARK, { stroke: 2.4, sx: 0, sy: 2 });
    s += glow(45, 146, 20, '#ffe3a1', 0.35);
    return s;
  });
}

interface RootSpec {
  pts: Pt[];
  w0: number;
  w1: number;
}

function rootDoor(opened: boolean): PartArt {
  return mk(opened ? 'prop.rootdoor.open' : 'prop.rootdoor', 120, 250, 'bc', (rng) => {
    const DARK: Mat = { fill: P.barkDark, shade: '#3a2e40', light: P.bark };
    let s = fillPath('M3 252V26Q60 -10 117 26V252Z', '#17131f');
    const wave = (x0: number, amp: number, ph: number, bulge: number): Pt[] =>
      Array.from({ length: 9 }, (_, i) => {
        const y = -6 + i * 32.5;
        const b = bulge * Math.sin((Math.PI * Math.max(0, Math.min(250, y))) / 250);
        return [x0 + Math.sin(i * 0.9 + ph) * amp + b, y] as Pt;
      });
    const root = (r: RootSpec, m: Mat = BARK, vein = false): string => {
      const over =
        line(open(offsetPts(r.pts, r.w0 * 0.18)), m.shade, 1.3, 0.8) +
        (vein ? line(open(slicePts(offsetPts(r.pts, -r.w0 * 0.12), 0.1, 0.85, 8)), P.violet, 1.4, 0.7) : '');
      return sh(taper(r.pts, r.w0, r.w1), m, { sx: 4, sy: 1, hx: 2, hy: 0, stroke: 3.2, over });
    };
    if (!opened) {
      const cross = (y0: number, y1: number, ph: number, w: number): RootSpec => ({
        pts: Array.from({ length: 6 }, (_, i) => [-8 + i * 27, lerp(y0, y1, i / 5) + Math.sin(i * 1.3 + ph) * 7] as Pt), w0: w, w1: w * 0.75,
      });
      const verts = [9, 33, 59, 86, 111].map((x, i) => ({ pts: wave(x + rng.range(-3, 3), 8 + rng.range(0, 4), i * 1.9, 0), w0: rng.range(18, 23), w1: rng.range(14, 18) }));
      const crosses: RootSpec[] = [
        cross(40, 70, 0.3, 14),
        cross(120, 88, 1.8, 13),
        cross(150, 196, 2.9, 14),
        cross(214, 180, 0.9, 12),
        cross(18, 8, 2.2, 12),
        cross(92, 128, 4.1, 11),
        { pts: [[-4, 150], [22, 176], [52, 196], [80, 226], [100, 256]], w0: 13, w1: 10 },
        { pts: [[124, 50], [100, 76], [74, 92], [50, 118], [30, 150]], w0: 12, w1: 9 },
      ];
      s += root(crosses[0]!, DARK) + root(crosses[2]!, DARK);
      s += root(verts[0]!) + root(verts[2]!, BARK, true) + root(verts[4]!);
      s += root(crosses[1]!) + root(crosses[3]!);
      s += root(verts[1]!, BARK, true) + root(verts[3]!);
      s += root(crosses[6]!, BARK, true);
      s += root(crosses[4]!) + root(crosses[5]!) + root(crosses[7]!);
      // The knot that keeps it shut.
      const knot: Pt[] = [];
      for (let i = 0; i < 10; i++) knot.push(polar(60, 128, 17 * rng.range(0.85, 1.1), (i / 10) * Math.PI * 2));
      s += sh(smooth(knot), BARK, { sx: 4, sy: 4, stroke: 3.2, over: line(ellipsePath(55, 122, 5, 3.5), P.barkDark, 1.3) });
      s += glow(60, 129, 16, P.violet, 0.6);
      s += line(circle(60, 129, 6), P.violet, 3) + line(circle(60, 129, 6), P.vein, 1.2);
    } else {
      // Pulled apart: a dark way through, the roots bunched to the sides.
      s += fillPath('M30 252V60Q31 28 60 24Q89 28 90 60V252Z', '#0d0b13');
      s += glow(60, 170, 56, P.violet, 0.16);
      s += line(open([[40, 250], [52, 236], [70, 238], [84, 250]]), '#241d30', 3, 0.8);
      const arcs: RootSpec[] = [
        { pts: [[-6, 60], [14, 30], [40, 14], [62, 10], [86, 16], [108, 32], [126, 58]], w0: 16, w1: 14 },
        { pts: [[-6, 30], [30, 4], [70, 0], [100, 8], [126, 26]], w0: 12, w1: 11 },
      ];
      s += root(arcs[1]!, DARK);
      const left = [6, 18, 29].map((x, i) => ({ pts: wave(x, 3, i * 1.7, -8 + i * 2), w0: 20, w1: 17 }));
      const right = [91, 102, 114].map((x, i) => ({ pts: wave(x, 3, i * 2.3, 8 - i * 2), w0: 20, w1: 17 }));
      s += root(left[0]!) + root(right[2]!) + root(left[2]!, BARK, true) + root(right[0]!, BARK, true) + root(left[1]!) + root(right[1]!);
      s += root(arcs[0]!, BARK, true);
      // Torn rootlets dangling into the opening.
      for (const [x, len] of [[40, 40], [52, 26], [67, 34], [80, 22]] as const) {
        s += sh(taper([[x, 18], [x + rng.range(-3, 3), 18 + len * 0.5], [x + rng.range(-4, 4), 18 + len]], 4, 1.2), BARK, { stroke: 2, sx: 1, sy: 0 });
      }
      for (const [x, y, d] of [[30, 120, 1], [90, 150, -1], [30, 196, 1], [90, 84, -1]] as const) {
        s += sh(taper([[x, y], [x + d * 8, y + 4], [x + d * 13, y + 12]], 6, 2), BARK, { stroke: 2.2, sx: 1, sy: 1 });
      }
    }
    // Where the roots bite into the floor.
    s += sh(taper([[16, 244], [4, 250], [-6, 252]], 10, 5), BARK, { stroke: 2.6, sx: 0, sy: 2 });
    s += sh(taper([[104, 244], [116, 250], [126, 252]], 10, 5), BARK, { stroke: 2.6, sx: 0, sy: 2 });
    return s;
  });
}

function fossil(): PartArt {
  return mk('prop.fossil', 260, 150, 'c', (rng) => {
    const SLAB: Mat = { fill: '#3b3550', shade: '#2e293f', light: '#4a4462' };
    const slab: Pt[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      slab.push([130 + Math.cos(a) * 124 * rng.range(0.92, 1.02), 76 + Math.sin(a) * 68 * rng.range(0.88, 1.02)]);
    }
    let cracks = '';
    for (let i = 0; i < 5; i++) {
      const x = rng.range(20, 240);
      const y = rng.range(20, 130);
      cracks += line(poly([[x, y], [x + rng.range(-10, 10), y + rng.range(6, 12)], [x + rng.range(-14, 14), y + rng.range(14, 22)]], false), SLAB.shade, 1.5);
    }
    let s = sh(smooth(slab), SLAB, { sx: 6, sy: 6, hx: 3, hy: 3, stroke: 3.5, inner: cracks });
    const bone = (d: string, sw = 2.4): string => sh(d, BONE, { sx: 1.5, sy: 1.5, hx: 1, hy: 1, stroke: sw });
    // Spine: vertebrae along a gentle arch, shrinking to the tail.
    const spine: Pt[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      spine.push([168 - t * 150, 66 - Math.sin(t * Math.PI * 0.9) * 14 + t * 6]);
    }
    // Fluke ghost at the tail end.
    s += line(smooth([[20, 66], [8, 52], [2, 46], [10, 62], [4, 80], [12, 76], [20, 70]]), BONE.shade, 1.6, 0.7);
    // Ribs first so the vertebrae sit on top.
    for (let i = 1; i <= 8; i++) {
      const [x, y] = spine[i]!;
      const len = 42 - Math.abs(i - 3.5) * 4;
      s += bone(taper([[x, y + 4], [x - 4, y + len * 0.45], [x - 12, y + len * 0.85], [x - 18, y + len]], 5, 2.2), 2);
    }
    spine.forEach(([x, y], i) => {
      const k = 1 - (i / 16) * 0.6;
      s += bone(taper([[x, y - 5 * k], [x - 2, y - 11 * k]], 4 * k, 2), 1.8);
      s += bone(rrect(x - 4.5 * k, y - 5.5 * k, 9 * k, 11 * k, 3 * k), 2);
    });
    // Flipper bones.
    for (const [a, len] of [[1.9, 22], [2.2, 26], [2.5, 20]] as const) {
      const b = polar(160, 94, len, a);
      s += bone(taper([[160, 94], [lerp(160, b[0], 0.5), lerp(94, b[1], 0.5) + 1], b], 4, 2), 1.8);
    }
    s += bone(taper([[170, 74], [166, 86], [160, 94]], 6, 4.5));
    // Skull and jaw.
    s += bone(smooth([[176, 86], [204, 93], [234, 88], [248, 81], [244, 89], [212, 100], [182, 96]]), 2.6);
    s += sh(smooth([[166, 60], [180, 45], [206, 40], [232, 45], [250, 57], [253, 70], [241, 79], [214, 85], [186, 85], [170, 77]]), BONE, {
      sx: 3, sy: 3, hx: 1.5, hy: 1.5, stroke: 2.8,
      over:
        fillPath(ellipsePath(217, 59, 7.5, 5.5), SLAB.shade) +
        line(ellipsePath(217, 59, 7.5, 5.5), INK, 1.6) +
        fillPath(ellipsePath(195, 50, 4, 2.5), SLAB.shade) +
        line(open([[180, 72], [206, 76], [240, 72]]), BONE.shade, 1.4) +
        line(open([[228, 48], [236, 60], [233, 70]]), BONE.shade, 1.2),
    });
    return s;
  });
}

// ================================================================ ROOMS 2–3

function pebble(x: number, y: number, r: number, rng: Rng, m: Mat, stroke = 2): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 7; i++) {
    const p = polar(0, 0, r * rng.range(0.82, 1.08), (i / 7) * Math.PI * 2 + rng.range(-0.2, 0.2));
    pts.push([x + p[0], y + p[1] * 0.72]);
  }
  return sh(smooth(pts), m, { stroke, sx: r * 0.22, sy: r * 0.3, hx: r * 0.15, hy: r * 0.18 });
}

function coil(): PartArt {
  return mk('prop.coil', 320, 110, 'bc', (rng) => {
    // Body along the ground, then a flat spiral curling in on itself.
    const cx = 234;
    const cy = 55;
    const pts: Pt[] = [[6, 100], [36, 98], [72, 100.5], [110, 97.5], [150, 99.5], [190, 96]];
    const ws: number[] = [9, 15, 21, 26, 30, 33];
    const N = 28;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      pts.push(polar(cx, cy, lerp(38, 7, t), Math.PI / 2 - t * Math.PI * 2 * 1.15));
      ws.push(lerp(35, 13, t));
    }
    const d = ribbon(pts, ws, 0.9);
    let over = '';
    // Bark rings across the body, knots, faint violet veins.
    for (let i = 2; i < pts.length - 2; i += 2) {
      const a = pts[i - 1]!;
      const b = pts[i + 1]!;
      const p = pts[i]!;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const tx = (b[0] - a[0]) / len;
      const ty = (b[1] - a[1]) / len;
      const hw = ws[i]! * 0.42;
      const k = rng.range(1.5, 3.5);
      over += line(open([[p[0] - ty * hw, p[1] + tx * hw], [p[0] + tx * k, p[1] + ty * k], [p[0] + ty * hw, p[1] - tx * hw]]), P.barkDark, 1.4, 0.85);
    }
    over += line(open(offsetPts(pts.slice(3), 6)), P.barkDark, 1.3, 0.7);
    over += line(open(offsetPts(pts.slice(1, 31), -3)), P.violet, 1.8, 0.45);
    over += line(open(offsetPts(pts.slice(9, 18), 8)), P.violet, 1.2, 0.4);
    for (const i of [9, 16, 23]) {
      const p = pts[i]!;
      over += line(ellipsePath(p[0] + rng.range(-3, 3), p[1] + rng.range(-3, 3), 2.8, 4), P.barkDark, 1.3, 0.9);
    }
    let s = shadowEl(168, 107, 152, 5, 0.35);
    for (const [x, y, dx] of [[60, 104, -8], [118, 104, 6], [176, 105, -7], [214, 108, 10], [262, 106, 12]] as const) {
      s += sh(taper([[x, y - 4], [x + dx * 0.6, y + 1], [x + dx, y + 4]], 4, 1.4), BARK, { stroke: 2, sx: 1, sy: 1 });
    }
    s += sh(d, BARK, { sx: 2, sy: 6, hx: 2, hy: 3, stroke: 3.8, over });
    const tip = pts[pts.length - 1]!;
    s += glow(tip[0], tip[1], 12, P.violet, 0.35);
    return s;
  });
}

const FIBERS: Pt[][] = [
  [[60, 246], [84, 206], [100, 160], [104, 110], [110, 70], [118, 40]], [[112, 240], [118, 200], [122, 150], [124, 100], [130, 60], [134, 28]],
  [[168, 244], [164, 200], [160, 150], [158, 100], [156, 60], [152, 26]], [[236, 238], [208, 200], [192, 150], [186, 100], [182, 56]],
];

function fossilRoot(): PartArt {
  return mk('prop.fossilroot', 300, 260, 'bc', (rng) => {
    const trunk = mixed([
      [0, 260, 1], [0, 257], [24, 250], [50, 237], [72, 216], [86, 188], [93, 150], [95, 112], [99, 80], [106, 54], [111, 40, 1],
      [117, 28, 1], [124, 14, 1], [131, 25, 1], [140, 6, 1], [148, 22, 1], [157, 11, 1], [164, 27, 1], [176, 19, 1], [183, 38, 1],
      [194, 58], [197, 96], [199, 138], [206, 178], [224, 212], [252, 236], [280, 249], [300, 256], [300, 260, 1],
    ]);
    const roots = [taper([[80, 226], [48, 244], [16, 252], [-8, 256]], 34, 8), taper([[222, 222], [256, 240], [288, 250], [308, 254]], 30, 8)];
    let texture = '';
    for (const f of FIBERS) texture += line(open(f.map(([x, y]) => [x + rng.range(-2, 2), y] as Pt)), FOSSIL.shade, 2, 0.9);
    for (const f of FIBERS.slice(0, 3)) texture += line(open(offsetPts(f, 9).slice(1, 5)), FOSSIL.light, 1.4, 0.55);
    for (const [x, y, len] of [[118, 58, 18], [178, 150, 16], [104, 196, 22], [160, 222, 18]] as const) {
      texture += line(poly([[x, y], [x + 3, y + len * 0.4], [x - 1, y + len * 0.7], [x + 2, y + len]], false), INK, 1.6, 0.8);
    }
    const shadeD = smooth([[168, 22], [184, 40], [194, 60], [197, 100], [199, 140], [207, 180], [226, 214], [256, 238], [300, 256], [300, 264], [176, 264], [180, 220], [174, 170], [170, 110], [170, 60]]);
    let s = shadowEl(150, 258, 150, 4, 0.35);
    s += merged([...roots, trunk], FOSSIL, { sx: 5, sy: 3, hx: 3, hy: 2, shadeD, inner: texture }, 4);
    // Buttress roots flaring into the ground.
    const GAP: Mat = { fill: '#262131', shade: '#1b1824', light: '#322c40' };
    for (const pts of [
      [[112, 150], [104, 190], [84, 222], [52, 244], [18, 256]], [[182, 146], [192, 188], [212, 220], [244, 242], [280, 255]],
    ] as Pt[][]) {
      s += sh(ribbon(pts, [4, 12, 18, 20, 16]), FOSSIL, { sx: 3, sy: 3, hx: 2, hy: 1, stroke: 3.2, over: line(open(offsetPts(pts, 3).slice(1)), FOSSIL.shade, 1.4, 0.8) });
    }
    s += sh(ellipsePath(158, 118, 9, 13), GAP, { sx: -3, sy: -3, hx: 0, hy: 0, stroke: 3 });
    // Crystal inclusions bursting out of cracked sockets; one holds a bird.
    const inc = (x: number, y: number, ang: number, m: Mat, big: number, trap?: Critter): string => {
      let c = sh(ellipsePath(x, y + 1, big * 0.42, big * 0.22), GAP, { stroke: 2.4, sx: 0, sy: 0, hx: 0, hy: 0 });
      c += shard({ x: x - 5, y, len: big * 0.62, w: big * 0.34, ang: ang - 0.42 }, m, 2.4);
      c += shard({ x: x + 5, y, len: big * 0.7, w: big * 0.34, ang: ang + 0.4 }, m, 2.4);
      const main: Shard = { x, y: y + 2, len: big, w: big * 0.42, ang };
      c += shard(main, m, 2.6, trap ? critter(trap, ...shardAt(main, 0.44), big * 0.36, ang - Math.PI / 2 + 0.4, 0.6) : '');
      return c;
    };
    s += inc(98, 96, -1.15, CRYSTAL.teal, 22);
    s += inc(192, 118, 1.1, CRYSTAL.blue, 22);
    s += inc(116, 150, -0.35, CRYSTAL.teal, 34, 'bird');
    s += shard({ x: 140, y: 18, len: 20, w: 9, ang: 0.2 }, CRYSTAL.blue, 2.2);
    s += shard({ x: 131, y: 24, len: 14, w: 8, ang: -0.5 }, CRYSTAL.teal, 2);
    return s;
  });
}

function crystalCluster(key: string, m: Mat, trap: Critter): PartArt {
  return mk(key, 120, 100, 'bc', (rng) => {
    const j = (sd: Shard): Shard => ({ ...sd, ang: sd.ang + rng.range(-0.06, 0.06), len: sd.len * rng.range(0.94, 1.04) });
    let s = glow(60, 60, 54, m.light, 0.24);
    const main = j({ x: 60, y: 93, len: 82, w: 28, ang: 0.05 });
    const side = [
      j({ x: 24, y: 92, len: 30, w: 14, ang: -0.75 }),
      j({ x: 98, y: 92, len: 28, w: 13, ang: 0.8 }),
      j({ x: 40, y: 92, len: 54, w: 20, ang: -0.36 }),
      j({ x: 82, y: 92, len: 60, w: 21, ang: 0.32 }),
    ];
    for (const sd of side) s += shard(sd, m, 3);
    const [cx, cy] = shardAt(main, 0.46, -1);
    s += shard(main, m, 3.2, critter(trap, cx, cy, 21, trap === 'fish' ? -1.2 : -0.35, 0.62));
    const MOUND: Mat = { fill: '#4a4458', shade: '#383346', light: '#5c566c' };
    const STONE: Mat = { fill: '#7a7490', shade: '#5a546e', light: '#948ea8' };
    s += sh(smooth([[6, 101], [12, 93], [30, 89], [50, 91], [72, 88], [94, 90], [110, 93], [116, 101]]), MOUND, { sx: 0, sy: 3, hx: 0, hy: 2, stroke: 3 });
    for (const [x, y, r] of [[18, 96, 6], [76, 95, 5], [104, 97, 4.5]] as const) {
      s += pebble(x, y, r, rng, STONE, 1.8);
    }
    return s;
  });
}

function poisonPool(): PartArt {
  return mk('prop.pool.poison', 560, 90, 'bc', (rng) => {
    const W = 560;
    const surf = (x: number): number => 8 + 2.6 * Math.sin(x / 34 + 0.6) + 1.6 * Math.sin(x / 13.5 + 2.1);
    const top: Pt[] = [];
    for (let x = 0; x <= W; x += 8) top.push([x, surf(x)]);
    const body = open(top) + `L${W} 90L0 90Z`;
    let air = `M0 -10H${W}`;
    for (let i = top.length - 1; i >= 0; i--) air += `L${n2(top[i]![0])} ${n2(top[i]![1])}`;
    air += 'Z';
    // Poisoned crystals grow from the bottom; a few tips break the surface.
    let crystals = '';
    for (const [x, len, ang, m] of [
      [62, 84, -0.22, CRYSTAL.teal], [84, 46, 0.42, CRYSTAL.teal], [214, 64, 0.2, CRYSTAL.orange], [232, 40, 0.6, CRYSTAL.orange],
      [470, 86, 0.1, CRYSTAL.teal], [446, 52, -0.5, CRYSTAL.blue], [528, 44, 0.35, CRYSTAL.teal],
    ] as const) {
      crystals += shard({ x, y: 92, len, w: len * 0.3, ang }, m, 2.8);
    }
    let s = crystals;
    s += fillPath(body, '#2e6a63', 0.74);
    const deep: Pt[] = [];
    for (let x = 0; x <= W; x += 20) deep.push([x, 50 + Math.sin(x / 40) * 5]);
    s += fillPath(open(deep) + `L${W} 90L0 90Z`, '#1f4a47', 0.5);
    s += glow(150, 42, 70, P.crystalTeal, 0.28) + glow(410, 50, 80, P.crystalTeal, 0.24);
    s += critter('fish', 330, 62, 22, 0.3, 0.35, '#9fe3d8');
    s += critter('fish', 118, 70, 16, -2.6, 0.3, '#9fe3d8');
    s += clipTo(air, crystals);
    // Surface band and ink line.
    const under = top.map(([x, y]) => [x, y + 5] as Pt);
    s += fillPath(open(top) + open(under.slice().reverse()).replace('M', 'L') + 'Z', '#6fc4b1', 0.75);
    for (let x = 12; x < W; x += rng.range(40, 70)) {
      const w = rng.range(14, 30);
      s += line(open(slicePts(under, x / W, Math.min(1, (x + w) / W), 5).map(([a, b]) => [a, b + 3] as Pt)), '#b8f0e2', 2, 0.7);
    }
    s += line(open(top), INK, 3.2);
    s += line(open(top.map(([x, y]) => [x, y + 2.2] as Pt)), '#b8f0e2', 1.4, 0.8);
    for (let i = 0; i < 16; i++) {
      const x = rng.range(10, W - 10);
      const y = surf(x) + rng.range(-1, 3);
      if (i % 2) s += fillPath(ellipsePath(x, y, rng.range(5, 11), rng.range(1.5, 2.5)), '#9ad8b8', 0.55);
      else s += sh(circle(x, y - 1.5, rng.range(2.5, 5)), { fill: '#62b9a6', shade: '#3f8f80', light: '#d6fff2' }, { stroke: 1.6, sx: 1, sy: 1, hx: 1, hy: 1, opacity: 0.9 });
    }
    for (let i = 0; i < 12; i++) {
      const x = rng.range(10, W - 10);
      s += line(circle(x, rng.range(22, 80), rng.range(1.2, 3)), '#b8f0e2', 1.2, rng.range(0.35, 0.7));
    }
    return s;
  });
}

// ------------------------------------------------ the crystal tree

const TREE_BARK: Mat = { fill: '#5d5272', shade: '#443b57', light: '#7a6c90' };
type Limb = [Pt[], number, number];
const TREE_ARMS: Limb[] = [
  [[[256, 902], [232, 876], [204, 858], [166, 848], [128, 843], [100, 838], [84, 826]], 34, 7],
  [[[268, 800], [290, 770], [322, 748], [364, 738], [412, 733], [456, 731], [488, 726], [502, 712]], 30, 6],
  [[[258, 684], [238, 658], [208, 640], [166, 630], [126, 626], [98, 622], [82, 610]], 26, 6],
];
const TREE_ARMS_HIGH: Limb[] = [
  [[[264, 572], [286, 546], [322, 526], [366, 516], [414, 512], [458, 510], [490, 505], [504, 492]], 22, 5],
  [[[258, 462], [236, 436], [204, 418], [162, 408], [124, 404], [98, 400], [84, 388]], 20, 5],
  [[[264, 350], [288, 324], [326, 304], [370, 294], [420, 291], [466, 290], [496, 285], [508, 272]], 18, 5],
  [[[258, 240], [238, 214], [206, 196], [166, 186], [128, 182], [104, 178], [92, 166]], 16, 4],
  [[[264, 132], [288, 104], [326, 84], [372, 74], [424, 71], [474, 70], [506, 68], [520, 60]], 14, 5],
];
const TREE_TWIGS: Limb[] = [
  [[[262, 562], [300, 534], [338, 508], [368, 480]], 12, 3], [[[318, 522], [328, 500], [334, 486]], 5, 2],
  [[[256, 508], [224, 480], [196, 452], [176, 422]], 11, 3], [[[208, 464], [194, 470], [178, 468]], 4, 1.5],
  [[[262, 442], [292, 416], [312, 386]], 9, 2.5], [[[258, 392], [238, 364], [226, 336]], 8, 2.5], [[[242, 370], [252, 352], [256, 340]], 4, 1.5],
];
const TREE_ROOTS: Limb[] = [
  [[[222, 900], [190, 926], [150, 936], [108, 941]], 32, 6], [[[300, 900], [332, 924], [372, 934], [414, 941]], 32, 6],
  [[[238, 916], [220, 934], [200, 942]], 22, 8], [[[284, 914], [300, 932], [318, 942]], 22, 8],
];

const trunkX = (y: number): number => 260 + Math.sin(y / 110 + 0.8) * 9;
const trunkW = (y: number): number =>
  16 + 84 * Math.pow(Math.max(0, y - 30) / 910, 1.15) + Math.pow(Math.max(0, y - 858), 1.5) * 0.1;

function blossom(x: number, y: number, r: number, c: Mat, rng: Rng, heart = '#f0c75e'): string {
  return (
    sh(flowerD(x, y, r, 5, rng.range(0, 1.2)), c, { sx: r * 0.18, sy: r * 0.2, hx: r * 0.1, hy: r * 0.1, stroke: r > 9 ? 2.4 : 2, light: r > 12 ? c.light : '' }) +
    dot(x, y, r * 0.26, heart) +
    line(circle(x, y, r * 0.26), INK, 1.2)
  );
}

function chick(x: number, y: number, s: number): string {
  const CH: Mat = { fill: '#f3dc8a', shade: '#d6b25a', light: '#fff4c8' };
  return (
    sh(smooth([[x - s, y + 0.3 * s], [x - 0.8 * s, y - 0.5 * s], [x, y - 0.8 * s], [x + 0.8 * s, y - 0.4 * s], [x + s, y + 0.3 * s], [x, y + 0.6 * s]]), CH, {
      stroke: 1.8, sx: 1, sy: 1.2, hx: 0.8, hy: 0.8,
    }) +
    sh(circle(x + 0.35 * s, y - 1.05 * s, 0.62 * s), CH, {
      stroke: 1.8, sx: 0.8, sy: 0.8, hx: 0.6, hy: 0.6,
      over: line(open([[x + 0.3 * s, y - 1.15 * s], [x + 0.48 * s, y - 1.05 * s], [x + 0.66 * s, y - 1.15 * s]]), INK, 1),
    }) +
    fillPath(poly([[x + 0.92 * s, y - 1.12 * s], [x + 1.38 * s, y - 0.95 * s], [x + 0.92 * s, y - 0.8 * s]]), '#e3913f') +
    line(open([[x - 0.5 * s, y - 0.1 * s], [x - 0.1 * s, y + 0.15 * s], [x + 0.3 * s, y - 0.05 * s]]), '#c9a04a', 1.1)
  );
}

/** Rounded star with a sleeping face (newborn star). */
function sleepyStar(x: number, y: number, r: number, face = true): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) pts.push(polar(x, y + r * 0.05, i % 2 ? r * 0.68 : r, -Math.PI / 2 + (i * Math.PI) / 5));
  const k = r / 10.5;
  const faceSvg = face
    ? line(open([[x - 4.8 * k, y - 0.3 * k], [x - 3.4 * k, y + 0.8 * k], [x - 2 * k, y - 0.3 * k]]), '#6b4f2a', 1.1) +
      line(open([[x + 2 * k, y - 0.3 * k], [x + 3.4 * k, y + 0.8 * k], [x + 4.8 * k, y - 0.3 * k]]), '#6b4f2a', 1.1) +
      dot(x - 5.2 * k, y + 2.8 * k, 1.4 * k, '#f2a7a0', 0.7) +
      dot(x + 5.2 * k, y + 2.8 * k, 1.4 * k, '#f2a7a0', 0.7) +
      line(open([[x - k, y + 3.7 * k], [x, y + 4.3 * k], [x + k, y + 3.7 * k]]), '#6b4f2a', 0.9)
    : '';
  return sh(smooth(pts, 0.75), { fill: '#fff4cf', shade: '#f1d48f', light: '#ffffff' }, {
    stroke: 1.8, ink: '#8a6a3a', sx: 1.2, sy: 1.4, hx: 0.8, hy: 0.8, over: faceSvg,
  });
}

function crystalTree(bloom: boolean): PartArt {
  return mk(bloom ? 'prop.crystaltree.bloom' : 'prop.crystaltree', 520, 940, 'bc', (rng) => {
    const topY = bloom ? 28 : 246;
    const trunkPts: Pt[] = [];
    const tws: number[] = [];
    for (let i = 0; i <= 26; i++) {
      const y = lerp(934, topY, i / 26);
      trunkPts.push([trunkX(y), y]);
      tws.push(trunkW(y) * (bloom ? 1 : Math.min(1, Math.max(0.32, (y - topY) / 90))));
    }
    const trunkD = ribbon(trunkPts, tws);
    const arms = bloom ? [...TREE_ARMS, ...TREE_ARMS_HIGH] : [...TREE_ARMS, ...TREE_TWIGS];
    const limbs = [...TREE_ROOTS, ...arms];
    // Bark: long twisting grain, small plates.
    let bark = '';
    for (const [f, ph] of [[-0.34, 0], [-0.12, 2], [0.14, 4], [0.33, 1]] as const) {
      const pts = trunkPts.map(([x, y], i) => [x + tws[i]! * f + Math.sin(y / 38 + ph) * 4, y] as Pt);
      bark += line(open(pts), TREE_BARK.shade, 1.7, 0.8);
    }
    for (let i = 0; i < 26; i++) {
      const y = rng.range(topY + 40, 900);
      const x = trunkX(y) + trunkW(y) * rng.range(-0.35, 0.3);
      bark += line(open([[x - 5, y], [x, y - 1.8], [x + 5, y]]), TREE_BARK.shade, 1.4, 0.8);
    }
    for (const [p] of limbs) bark += line(open(slicePts(offsetPts(p, 3), 0.1, 0.9, 6)), TREE_BARK.shade, 1.3, 0.7);
    // Crystal veins climbing the trunk and running out into every arm.
    const vein = (pts: Pt[], w: number): string =>
      line(open(pts), P.crystalTeal, w * 3, 0.18) + line(open(pts), P.crystalTealLight, w, 0.85);
    let veins = vein(trunkPts.slice(0, bloom ? 25 : 22).map(([x, y], i) => [x - tws[i]! * 0.08 + Math.sin(y / 31) * 3.5, y] as Pt), 1.8);
    veins += vein(trunkPts.slice(1, 12).map(([x, y], i) => [x + tws[i + 1]! * 0.26 + Math.sin(y / 23) * 3, y] as Pt), 1.2);
    for (const [p] of arms) if (p.length > 4) veins += vein(slicePts(offsetPts(p, -1), 0.02, 0.86, 8), 1.2);
    const shadeD = ribbon(
      trunkPts.map(([x, y], i) => [x + tws[i]! * 0.32, y] as Pt),
      tws.map((w) => w * 0.38),
    );
    let s = shadowEl(260, 938, 160, 6, 0.3);
    s += merged([...limbs.map(([p, w0, w1]) => taper(p, w0, w1)), trunkD], TREE_BARK, { sx: 5, sy: 4, hx: 3, hy: 2, inner: bark }, 4.2);
    s += clipTo(trunkD, fillPath(shadeD, TREE_BARK.shade, 0.85) + bark);
    s += veins;
    // Crystal growth breaking out of the trunk between the arms.
    for (const [y, side, len, m] of [
      [790, 1, 30, CRYSTAL.blue], [742, -1, 26, CRYSTAL.teal], [652, 1, 24, CRYSTAL.teal], [560, -1, 20, CRYSTAL.blue],
    ] as const) {
      if (!bloom && y < topY + 60) continue;
      const x = trunkX(y) + side * trunkW(y) * 0.42;
      s += shard({ x: x - side * 3, y: y + 4, len: len * 0.6, w: len * 0.34, ang: side * 0.35 }, m, 2.4);
      s += shard({ x, y, len, w: len * 0.4, ang: side * 0.95 }, m, 2.6);
    }
    // The hollow at the heart of the trunk.
    const hx = trunkX(872) + 2;
    s += sh(ellipsePath(hx, 874, 13, 19), { fill: '#221c2e', shade: '#161220', light: '#2f2740' }, { sx: -4, sy: -4, hx: 0, hy: 0, stroke: 3.2 });
    if (bloom) {
      s += glow(hx, 874, 64, '#ffe9a8', 0.6);
      s += sleepyStar(hx, 874, 11, false);
    } else {
      s += glow(hx, 878, 10, P.crystalTeal, 0.35);
    }
    // Crystal growth at the foot; one shard holds a bird that did not get away.
    const baseShard: Shard = { x: 330, y: 936, len: 58, w: 24, ang: 0.42 };
    s += shard({ x: 312, y: 936, len: 34, w: 15, ang: 0.05 }, CRYSTAL.blue, 3);
    s += shard(baseShard, CRYSTAL.teal, 3, critter('bird', ...shardAt(baseShard, 0.45), 20, -0.3, 0.6));
    s += shard({ x: 350, y: 938, len: 26, w: 12, ang: 0.95 }, CRYSTAL.teal, 2.6);
    s += shard({ x: 186, y: 938, len: 32, w: 14, ang: -0.55 }, CRYSTAL.blue, 2.8);
    s += shard({ x: 202, y: 938, len: 20, w: 10, ang: -0.15 }, CRYSTAL.teal, 2.4);
    if (!bloom) {
      // Dormant buds: faceted, closed, tipping every arm and hanging beneath.
      for (const [p, , w1] of arms) {
        const tip = p[p.length - 1]!;
        const prev = p[p.length - 2]!;
        const ang = Math.atan2(tip[0] - prev[0], -(tip[1] - prev[1]));
        s += shard({ x: tip[0], y: tip[1], len: 16 + w1 * 2, w: 9 + w1, ang, shoulder: 0.55 }, rng.chance(0.5) ? CRYSTAL.teal : CRYSTAL.blue, 2.4);
      }
      for (const [x, y, len] of [[150, 858, 22], [192, 864, 16], [344, 752, 20], [428, 744, 24], [142, 640, 22], [186, 646, 15]] as const) {
        s += shard({ x, y, len, w: len * 0.5, ang: Math.PI + rng.range(-0.15, 0.15), shoulder: 0.55 }, rng.chance(0.6) ? CRYSTAL.teal : CRYSTAL.blue, 2.4);
      }
      const tx = trunkX(topY);
      s += shard({ x: tx - 6, y: topY + 26, len: 18, w: 10, ang: -0.6, shoulder: 0.55 }, CRYSTAL.teal, 2.2);
      s += shard({ x: tx + 6, y: topY + 28, len: 16, w: 9, ang: 0.7, shoulder: 0.55 }, CRYSTAL.teal, 2.2);
      s += shard({ x: tx, y: topY + 18, len: 30, w: 14, ang: 0.05, shoulder: 0.55 }, CRYSTAL.blue, 2.6);
      return s;
    }
    // In bloom: blossom clusters on every arm, chicks asleep in a few, a crown.
    const PETALS: Mat[] = [
      { fill: '#f4ecdf', shade: '#d8c8b2', light: '#ffffff' },
      { fill: '#ebb5c6', shade: '#c98c9f', light: '#f9dbe4' },
      { fill: '#c9a8ee', shade: '#a07fcb', light: '#e6d4fb' },
    ];
    const LEAF: Mat = { fill: '#7fb39a', shade: '#5f8f7d', light: '#a6d4bb' };
    const flowers: [number, number, number][] = [];
    const cluster = (x: number, y: number, n: number, r0: number, r1: number, spread: number): void => {
      for (let i = 0; i < n; i++) flowers.push([x + rng.range(-spread, spread), y + rng.range(-spread, spread) * 0.7, rng.range(r0, r1)]);
    };
    for (const [p] of arms) {
      const tip = p[p.length - 1]!;
      cluster(tip[0], tip[1] + 6, 4, 11, 15, 13);
      for (let i = 2; i < p.length - 1; i++) {
        const q = p[i]!;
        flowers.push([q[0] + rng.range(-8, 0), q[1] + 21 + rng.range(0, 6), rng.range(9, 14)]);
        if (rng.chance(0.6)) flowers.push([q[0] + rng.range(4, 14), q[1] + 30 + rng.range(0, 8), rng.range(7, 11)]);
      }
      cluster(p[1]![0], p[1]![1] + 16, 3, 9, 13, 10);
    }
    for (let y = 80; y < 860; y += rng.range(40, 60)) {
      const side = rng.chance(0.5) ? -1 : 1;
      flowers.push([trunkX(y) + side * trunkW(y) * rng.range(0.25, 0.45), y, rng.range(9, 12)]);
    }
    cluster(trunkX(40), 46, 13, 12, 18, 30);
    for (const [x, y, r] of flowers) {
      if (!rng.chance(0.5)) continue;
      const a = rng.range(0, Math.PI * 2);
      const tip = polar(x, y, r * 1.9, a);
      s += sh(smooth([[x, y], polar(x, y, r * 0.95, a - 0.5), tip, polar(x, y, r * 0.95, a + 0.5)]), LEAF, { stroke: 1.8, sx: 1, sy: 1, hx: 0.8, hy: 0.8 });
    }
    s += glow(trunkX(50), 50, 96, '#f9d9e6', 0.35);
    flowers.forEach(([x, y, r], i) => {
      s += blossom(x, y, r, PETALS[i % 3]!, rng);
    });
    for (const [x, y] of [[84, 822], [500, 708], [82, 606], [86, 384], [92, 162], [trunkX(40) + 2, 24]] as const) {
      s += blossom(x, y, 17, PETALS[0]!, rng) + chick(x, y - 3, 7);
    }
    for (let i = 0; i < 20; i++) {
      const x = rng.range(30, 500);
      const y = rng.range(60, 900);
      s += grp(`transform="rotate(${n2(rng.range(0, 180))} ${n2(x)} ${n2(y)})"`, sh(ellipsePath(x, y, 3.8, 2.2), PETALS[i % 3]!, { stroke: 1.4, sx: 0.6, sy: 0.6, hx: 0, hy: 0 }));
    }
    return s;
  });
}

function star(): PartArt {
  return mk('prop.star', 40, 40, 'c', () => glow(20, 20, 20, '#ffe9a8', 0.8) + glow(20, 20, 11, '#ffffff', 0.6) + sleepyStar(20, 20, 10.5));
}

// ================================================================ ROOMS 4–6

const MOSS: Mat = { fill: P.leaf, shade: P.leafDark, light: P.leafLight };
const NIGHT_STONE: Mat = { fill: '#5f5a70', shade: '#46415a', light: '#7a7590' };

/** Elliptical soft glow (a round glow squashed vertically). */
function oglow(cx: number, cy: number, rx: number, ry: number, color: string, op: number): string {
  return grp(`transform="translate(${cx} ${cy}) scale(1 ${n2(ry / rx)}) translate(${-cx} ${-cy})"`, glow(cx, cy, rx, color, op));
}

/** Tiny violet glints (bioluminescent specks). */
function glints(pts: readonly Pt[], r = 1.8): string {
  return pts.map(([x, y]) => glow(x, y, r * 4, P.violet, 0.45) + dot(x, y, r, P.vein)).join('');
}

function grassTuft(x: number, y: number, h: number, rng: Rng, m: Mat = MOSS, n = 4, stroke = 1.8): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * 3;
    const lean = rng.range(-0.5, 0.5) + dx * 0.08;
    const hh = h * rng.range(0.6, 1);
    s += sh(taper([[x + dx, y + 1], [x + dx + lean * hh * 0.4, y - hh * 0.5], [x + dx + lean * hh, y - hh]], 3.2, 0.6), m, { stroke, sx: 0.8, sy: 0, hx: 0.5, hy: 0 });
  }
  return s;
}

function mushroom(x: number, y: number, s: number, cap: Mat): string {
  return (
    sh(rrect(x - 0.18 * s, y - 0.9 * s, 0.36 * s, 0.9 * s, 0.15 * s), IVORY, { stroke: 1.6, sx: 0.8, sy: 0, hx: 0.5, hy: 0 }) +
    sh(`M${x - 0.7 * s} ${y - 0.8 * s}Q${x - 0.6 * s} ${y - 1.5 * s} ${x} ${y - 1.55 * s}Q${x + 0.6 * s} ${y - 1.5 * s} ${x + 0.7 * s} ${y - 0.8 * s}Z`, cap, {
      stroke: 1.6, sx: 0.8, sy: 0.8, hx: 0.6, hy: 0.6,
      over: dot(x - 0.25 * s, y - 1.2 * s, 0.1 * s + 0.4, P.vein) + dot(x + 0.22 * s, y - 1.05 * s, 0.08 * s + 0.4, P.vein),
    })
  );
}

function log(): PartArt {
  return mk('prop.log', 160, 60, 'bc', (rng) => {
    const LOG: Mat = { fill: '#4f4353', shade: '#3a3040', light: '#67586b' };
    const END: Mat = { fill: '#8a7563', shade: '#6b5849', light: '#a38c78' };
    let s = shadowEl(80, 58, 76, 3, 0.4);
    const body = mixed([[16, 26, 1], [144, 26, 1], [144, 58, 1], [24, 58, 1], [17, 54], [9, 51, 1], [15, 46, 1], [5, 40, 1], [14, 35, 1], [8, 30, 1]]);
    let grainL = '';
    for (const y of [33, 40, 47, 53]) {
      const pts: Pt[] = [];
      for (let x = 20; x <= 140; x += 20) pts.push([x + rng.range(-3, 3), y + rng.range(-1.5, 1.5)]);
      grainL += line(open(slicePts(pts, rng.range(0, 0.2), rng.range(0.7, 1), 6)), LOG.shade, 1.5, 0.9);
    }
    grainL += line(ellipsePath(70, 44, 5, 3.5), LOG.shade, 1.6) + fillPath(ellipsePath(70, 44, 2.2, 1.5), '#231d29');
    s += sh(body, LOG, { sx: 0, sy: 6, hx: 0, hy: 2.5, inner: grainL });
    // A broken branch stub.
    s += sh(taper([[104, 46], [111, 52], [117, 55]], 9, 5), LOG, { stroke: 2.6, sx: 1.5, sy: 1.5 });
    s += sh(ellipsePath(118, 55.5, 3, 2.4), END, { stroke: 1.8, sx: 0, sy: 0, hx: 0, hy: 0 });
    // Cut end with growth rings.
    s += sh(ellipsePath(144, 42, 8.5, 16), END, {
      sx: 2, sy: 2, hx: 1, hy: 1, stroke: 3,
      over: line(ellipsePath(144, 42, 5.5, 10.5), END.shade, 1.3) + line(ellipsePath(144, 42, 2.5, 5), END.shade, 1.2) + line('M144 42L150 30', INK, 1.2),
    });
    // Moss blanket hugging the top, dripping down the side.
    const moss = mixed([
      [22, 26, 1], [130, 26, 1], [132, 30], [124, 35], [116, 31], [106, 38], [96, 32], [86, 35], [74, 31], [64, 40], [54, 32], [44, 36],
      [34, 31], [26, 33],
    ]);
    s += sh(moss, MOSS, { sx: 0, sy: 2.5, hx: 0, hy: 1.5, stroke: 2.4, over: dot(60, 29, 1.2, P.leafLight) + dot(98, 29, 1.2, P.leafLight) });
    s += grassTuft(40, 27, 7, rng) + grassTuft(112, 27, 6, rng, MOSS, 3);
    s += mushroom(30, 58, 8, { fill: '#b6a3c9', shade: '#8d7aa3', light: '#d5c7e3' }) + mushroom(40, 58, 5.5, { fill: '#b6a3c9', shade: '#8d7aa3', light: '#d5c7e3' });
    s += glints([[82, 30], [50, 30.5], [121, 29.5]], 1.3);
    return s;
  });
}

/** A ghostly face lying on a surface (squashed by sy): brows, shut eyes, nose, mouth. */
function faceLines(cx: number, cy: number, s: number, sy: number, tilt = 0): string {
  const P2 = (u: number, v: number): Pt => [cx + (u * Math.cos(tilt) - v * Math.sin(tilt)) * s, cy + (u * Math.sin(tilt) + v * Math.cos(tilt)) * s * sy];
  return (
    open([P2(-0.62, -0.62), P2(-0.8, 0), P2(-0.52, 0.62), P2(0, 0.95)]) +
    open([P2(0.62, -0.62), P2(0.8, 0), P2(0.52, 0.62), P2(0, 0.95)]) +
    open([P2(-0.5, -0.2), P2(-0.32, -0.13), P2(-0.14, -0.18)]) +
    open([P2(0.14, -0.18), P2(0.32, -0.13), P2(0.5, -0.2)]) +
    open([P2(0.02, -0.08), P2(-0.05, 0.25), P2(0.08, 0.3)]) +
    open([P2(-0.2, 0.55), P2(0, 0.52), P2(0.2, 0.55)])
  );
}

function memPool(): PartArt {
  return mk('prop.mempool', 200, 60, 'bc', (rng) => {
    const WATER: Mat = { fill: '#a49bd2', shade: '#7b71ab', light: '#ddd6f6' };
    let s = oglow(100, 40, 90, 40, '#b9a3e8', 0.4);
    // Reeds framing the pool, a few carrying violet glints.
    for (const [x, h] of [[12, 34], [20, 44], [28, 30], [176, 38], [186, 46], [194, 28]] as const) {
      s += sh(taper([[x, 56], [x + rng.range(-2, 2), 56 - h * 0.6], [x + rng.range(-5, 5), 56 - h]], 4, 1), MOSS, { stroke: 1.8, sx: 1, sy: 0 });
    }
    s += glints([[20, 14], [186, 12], [30, 26]], 1.6);
    for (const [x, y, r] of [[28, 36, 7], [48, 31, 6], [74, 29, 5.5], [102, 28, 6], [130, 29, 5.5], [154, 31, 6], [173, 36, 7]] as const) {
      s += pebble(x, y, r, rng, NIGHT_STONE, 2.2);
    }
    // The surface: silvery violet, faces overlapping under the sheen.
    const faces =
      line(faceLines(82, 42, 15, 0.42, -0.25), '#f3eeff', 1.3, 0.42) +
      line(faceLines(104, 43, 19, 0.4, 0.1), '#f3eeff', 1.4, 0.35) +
      line(faceLines(124, 41, 13, 0.45, 0.35), '#f3eeff', 1.2, 0.4) +
      line(faceLines(66, 44, 9, 0.45, 0.5), '#f3eeff', 1.1, 0.3);
    s += sh(ellipsePath(100, 42, 80, 13), WATER, {
      sx: 0, sy: -5, hx: 0, hy: 0, stroke: 3, inner: glow(100, 44, 40, '#ffffff', 0.35),
      over: faces + line('M40 46H66M136 38H164M58 51H80', WATER.light, 1.5, 0.8),
    });
    for (const [x, y, r] of [[22, 52, 8], [44, 56, 7], [70, 57, 6.5], [98, 58, 7.5], [126, 57, 6.5], [152, 56, 7], [178, 52, 8]] as const) {
      s += pebble(x, y, r, rng, NIGHT_STONE, 2.4);
    }
    s += grassTuft(58, 56, 8, rng) + grassTuft(140, 56, 9, rng) + grassTuft(112, 59, 6, rng, MOSS, 3);
    return s;
  });
}

/** Leafy cloud of foliage: scalloped, cel shaded, leaf marks inside. */
function foliageD(cx: number, cy: number, r: number, rng: Rng, lobes = 11): string {
  const pts: Pt[] = [];
  for (let i = 0; i < lobes; i++) {
    const a = (i / lobes) * Math.PI * 2 + rng.range(-0.1, 0.1);
    pts.push(polar(cx, cy, r * rng.range(0.95, 1.05), a));
    const v = polar(0, 0, r * 0.88, a + Math.PI / lobes);
    pts.push([cx + v[0], cy + v[1]]);
  }
  return smooth(pts, 1);
}

function foliage(cx: number, cy: number, r: number, m: Mat, rng: Rng, lobes = 11): string {
  let marks = '';
  for (let i = 0; i < Math.round(r / 12); i++) {
    const p = polar(cx, cy, r * rng.range(0.1, 0.7), rng.range(0, Math.PI * 2));
    const w = rng.range(4, 7);
    marks += line(`M${n2(p[0] - w)} ${n2(p[1] - 2)}Q${n2(p[0])} ${n2(p[1] + 3)} ${n2(p[0] + w)} ${n2(p[1] - 2)}`, m.shade, 1.6, 0.9);
  }
  return sh(foliageD(cx, cy, r, rng, lobes), m, { sx: r * 0.14, sy: r * 0.2, hx: 3, hy: 4, stroke: 3.2, inner: marks });
}

function forestTree(): PartArt {
  return mk('prop.tree', 360, 520, 'bc', (rng) => {
    const TB: Mat = { fill: '#b39aa8', shade: '#937c8b', light: '#cdb9c3' };
    const BACK: Mat = { fill: '#97b894', shade: '#7fa27f', light: '#b6cfae' };
    const FRONT: Mat = { fill: '#b4d19b', shade: '#8fb582', light: '#cfe3b8' };
    let s = shadowEl(180, 518, 90, 4, 0.35);
    // One merged back mass, so only its outer silhouette is inked.
    const back = [
      [98, 150, 66], [262, 140, 68], [180, 84, 74], [56, 222, 46], [308, 214, 46], [180, 206, 64], [120, 250, 40], [246, 250, 40],
    ].map(([x, y, r]) => foliageD(x!, y!, r!, rng));
    s += merged(back, BACK, { sx: 12, sy: 16, hx: 3, hy: 4 }, 3.2);
    const trunkPts: Pt[] = [[180, 524], [177, 470], [182, 410], [178, 340], [182, 280], [180, 236]];
    const limbs = [
      taper([[176, 290], [150, 244], [118, 204], [90, 172]], 22, 8),
      taper([[184, 282], [214, 236], [248, 196], [272, 160]], 22, 8),
      taper([[180, 250], [184, 190], [178, 130], [182, 96]], 20, 8),
      taper([[172, 330], [140, 318], [106, 322], [80, 306]], 12, 4),
      taper([[188, 350], [222, 342], [258, 348], [284, 334]], 12, 4),
    ];
    const roots = [taper([[160, 500], [136, 514], [108, 522]], 24, 6), taper([[200, 500], [226, 514], [254, 522]], 24, 6), taper([[176, 508], [172, 522]], 20, 12)];
    const bark =
      line(open([[172, 510], [168, 440], [174, 370], [170, 300]]), TB.shade, 1.8) +
      line(open([[190, 500], [192, 430], [188, 360]]), TB.shade, 1.6) +
      line(ellipsePath(184, 420, 5, 8), TB.shade, 1.6) +
      fillPath(ellipsePath(184, 420, 2.5, 4.5), INK);
    s += merged([...roots, ...limbs, ribbon(trunkPts, [72, 52, 44, 40, 34, 28])], TB, { sx: 7, sy: 2, hx: 3, hy: 1, inner: bark }, 3.6);
    for (const [x, y, r] of [[128, 214, 52], [240, 208, 54], [116, 118, 50], [248, 108, 50], [184, 50, 44], [64, 180, 36], [300, 176, 36]] as const) {
      s += foliage(x, y, r, FRONT, rng);
    }
    s += glints([[96, 120], [150, 186], [238, 88], [270, 214], [60, 186], [206, 40], [118, 244], [300, 150]], 1.9);
    return s;
  });
}

/** Leafy clump rising from a base line: sharp leaf tips, rounded valleys. */
function leafyClump(cx: number, baseY: number, rx: number, ry: number, rng: Rng, n = 9): string {
  const pts: SharpPt[] = [[cx - rx, baseY + 6, 1]];
  for (let i = 0; i <= n; i++) {
    const a = Math.PI + (i / n) * Math.PI;
    pts.push([cx + Math.cos(a) * rx * rng.range(0.95, 1.08), baseY + Math.sin(a) * ry * rng.range(0.92, 1.1), 1]);
    if (i < n) {
      const b = a + Math.PI / n / 2;
      pts.push([cx + Math.cos(b) * rx * 0.8, baseY + Math.sin(b) * ry * 0.78]);
    }
  }
  pts.push([cx + rx, baseY + 6, 1]);
  return mixed(pts);
}

function bush(): PartArt {
  return mk('prop.bush', 200, 90, 'bc', (rng) => {
    const DARK: Mat = { fill: '#a9c89c', shade: '#8db083', light: '#c6ddb7' };
    const DEEP: Mat = { fill: '#8fb48c', shade: '#78a079', light: '#afcca6' };
    let s = '';
    // Sprigs poking out of the silhouette.
    for (const [x, y, ex, ey] of [[62, 58, 52, 24], [134, 58, 148, 22], [104, 50, 100, 16]] as const) {
      const mid: Pt = [lerp(x, ex, 0.5) + 3, lerp(y, ey, 0.5)];
      s += line(open([[x, y], mid, [ex, ey]]), INK, 2.6) + line(open([[x, y], mid, [ex, ey]]), DEEP.fill, 1.2);
      for (const t of [0.55, 0.8, 1]) {
        const p: Pt = [lerp(x, ex, t), lerp(y, ey, t)];
        const side = t === 0.8 ? -1 : 1;
        s += sh(smooth([p, [p[0] + side * 6, p[1] - 5], [p[0] + side * 11, p[1] - 3], [p[0] + side * 6, p[1] + 1]]), DARK, { stroke: 2, sx: 0.8, sy: 1, hx: 0, hy: 1.5 });
      }
    }
    s += sh(leafyClump(150, 90, 42, 42, rng), DEEP, { sx: 4, sy: 6, hx: 0, hy: 3, stroke: 3.2 });
    s += sh(leafyClump(46, 90, 40, 38, rng), DEEP, { sx: 4, sy: 6, hx: 0, hy: 3, stroke: 3.2 });
    s += sh(leafyClump(100, 90, 52, 52, rng, 11), DARK, { sx: 5, sy: 7, hx: 1, hy: 3, stroke: 3.4 });
    s += sh(leafyClump(178, 90, 20, 24, rng, 6), DARK, { sx: 3, sy: 4, hx: 0, hy: 2.5, stroke: 3 });
    s += sh(leafyClump(18, 90, 18, 20, rng, 6), DARK, { sx: 3, sy: 4, hx: 0, hy: 2.5, stroke: 3 });
    s += glints([[88, 52], [150, 62]], 1.4);
    return s;
  });
}

function plate(down: boolean): PartArt {
  return mk(down ? 'prop.plate.down' : 'prop.plate', 120, 24, 'bc', () => {
    const RING: Mat = { fill: '#4f4a5d', shade: '#3a3548', light: '#686279' };
    const TOP: Mat = { fill: '#7c768c', shade: '#625c73', light: '#9791aa' };
    const SIDE: Mat = { fill: '#5f596f', shade: '#48435a', light: '#6f6982' };
    const cy = down ? 15 : 9;
    let s = sh(ellipsePath(60, 17, 57, 6.5), RING, { stroke: 2.6, sx: 0, sy: 2, hx: 0, hy: 1 });
    s += fillPath(ellipsePath(60, 16, 49, 4.6), '#1f1c2a');
    s += sh(`M14 ${cy}A46 6 0 0 0 106 ${cy}V${cy + 7}A46 6 0 0 1 14 ${cy + 7}Z`, SIDE, { stroke: 2.6, sx: 3, sy: 0, hx: 0, hy: 0 });
    const ring = ellipsePath(60, cy, 28, 3.4);
    const spokes = [0, 1, 2, 3, 4, 5]
      .map((i) => {
        const a = (i / 6) * Math.PI * 2 + 0.3;
        const p0 = polar(0, 0, 14, a);
        const p1 = polar(0, 0, 23, a);
        return `M${n2(60 + p0[0])} ${n2(cy + p0[1] * 0.13)}L${n2(60 + p1[0])} ${n2(cy + p1[1] * 0.13)}`;
      })
      .join('');
    const eye = ellipsePath(60, cy, 7, 1.6);
    const glyph = down
      ? line(ring + spokes + eye, P.violet, 4, 0.55) + line(ring + spokes + eye, P.vein, 1.8) + dot(60, cy, 1.4, '#ffffff')
      : line(ring + spokes + eye, P.violetDark, 2.2, 0.9) + line(ring, P.violet, 1, 0.7);
    s += sh(ellipsePath(60, cy, 46, 6), TOP, { stroke: 2.6, sx: 0, sy: -2, hx: 0, hy: 0, over: glyph });
    s += sh('M3 17A57 6.5 0 0 0 117 17L109 16A49 4.6 0 0 1 11 16Z', RING, { stroke: 2.6, sx: 0, sy: 2, hx: 0, hy: 1.5 });
    if (down) s += oglow(60, cy, 52, 14, P.violet, 0.55) + oglow(60, cy, 26, 6, P.vein, 0.5);
    return s;
  });
}

function shrine(): PartArt {
  return mk('prop.shrine', 70, 110, 'bc', (rng) => {
    const ST: Mat = { fill: '#6c667c', shade: '#514b62', light: '#88829a' };
    let s = shadowEl(35, 108, 32, 3, 0.35);
    s += sh(rrect(5, 95, 60, 15, 4), ST, { sx: 0, sy: 4, hx: 0, hy: 2, over: line('M14 101l4 4M50 99l-3 5', ST.shade, 1.3) });
    s += sh('M15 96L18 36H52L55 96Z', ST, {
      sx: 5, sy: 0, hx: 2, hy: 0, over: line('M22 44l2 10l-2 8M47 70l-2 9', INK, 1.4, 0.8),
    });
    // The recalling glyph: a ring of runes around a spiral.
    const cx = 35;
    const cy = 64;
    let spiral = '';
    const sp: Pt[] = [];
    for (let i = 0; i <= 18; i++) sp.push(polar(cx, cy, 1.5 + i * 0.42, i * 0.62));
    spiral = open(sp);
    let runes = '';
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const p = polar(cx, cy, 13.5, a);
      runes += `M${n2(p[0])} ${n2(p[1] - 2)}l${n2(Math.cos(a + 1.6) * 2)} ${n2(Math.sin(a + 1.6) * 2 + 3)}`;
    }
    s += glow(cx, cy, 22, P.violet, 0.4);
    s += line(circle(cx, cy, 11) + spiral + runes, P.violetDark, 3.4, 0.8) + line(circle(cx, cy, 11) + spiral + runes, P.vein, 1.5);
    // Top slab with a cradle for the stone.
    s += sh(rrect(8, 24, 54, 14, 4), ST, { sx: 0, sy: 4, hx: 0, hy: 2 });
    s += sh(ellipsePath(35, 25, 16, 4), { fill: '#3a3548', shade: '#2a2638', light: '#4a4458' }, { stroke: 2.4, sx: 0, sy: -2, hx: 0, hy: 0, inner: oglow(35, 25, 16, 4, P.violet, 0.5) });
    s += sh(mixed([[10, 30, 1], [18, 26], [30, 28], [26, 32], [14, 33, 1]]), MOSS, { stroke: 2, sx: 0.8, sy: 1.2, hx: 0, hy: 0.8 });
    s += sh(mixed([[40, 97, 1], [50, 94], [62, 96], [58, 100], [44, 100, 1]]), MOSS, { stroke: 2, sx: 0.8, sy: 1.2, hx: 0, hy: 0.8 });
    s += grassTuft(8, 108, 7, rng, MOSS, 3, 1.6) + grassTuft(63, 108, 8, rng, MOSS, 3, 1.6);
    return s;
  });
}

function stone(): PartArt {
  return mk('prop.stone', 64, 64, 'bc', (rng) => {
    const ST: Mat = { fill: '#7b7389', shade: '#5a5368', light: '#978fa6' };
    let s = shadowEl(32, 62, 29, 3, 0.4);
    const faceG =
      open([[20, 31], [24.5, 32.5], [29, 31]]) +
      open([[36, 31], [40.5, 32.5], [45, 31]]) +
      open([[32.5, 33], [31, 40], [34, 41]]) +
      open([[27, 47], [32.5, 46.5], [38, 47]]) +
      open([[14, 44], [13, 30], [20, 20], [32, 17], [44, 20], [51, 30], [50, 44], [42, 53]]);
    s += sh(smooth([[6, 60], [3, 46], [7, 28], [18, 13], [33, 8], [48, 12], [58, 25], [61, 43], [58, 60], [32, 62]]), ST, {
      sx: 5, sy: 5, hx: 3, hy: 3,
      over:
        line('M50 34l3 6l-2 6M12 48l4 3', ST.shade, 1.5) +
        glow(32, 36, 22, P.violet, 0.3) +
        line(faceG, P.violet, 3, 0.35) +
        line(faceG, P.vein, 1.2, 0.6) +
        fillPath(mixed([[16, 16, 1], [26, 10], [40, 9], [50, 13], [44, 16], [34, 14], [22, 18, 1]]), MOSS.fill) +
        dot(27, 11.5, 1.1, MOSS.light) +
        dot(40, 11, 1, MOSS.light),
    });
    s += grassTuft(8, 62, 7, rng, MOSS, 3, 1.6) + grassTuft(56, 62, 6, rng, MOSS, 3, 1.6);
    return s;
  });
}

function knot(calm: boolean): PartArt {
  return mk(calm ? 'prop.knot.calm' : 'prop.knot', 110, 90, 'bc', (rng) => {
    let s = shadowEl(55, 88, 50, 3, 0.4);
    const swell = calm ? 0.9 : 1;
    // Roots from the knot into the ground.
    for (const pts of [
      [[36, 70], [20, 80], [2, 88]], [[74, 70], [92, 80], [110, 88]], [[50, 78], [44, 86], [38, 90]], [[64, 78], [70, 86], [78, 90]],
    ] as Pt[][]) {
      s += sh(taper(pts, 16, 6), BARK, { stroke: 3, sx: 2, sy: 2, hx: 1, hy: 1 });
    }
    if (!calm) s += oglow(55, 88, 40, 5, P.violet, 0.5) + sh(ellipsePath(40, 87, 14, 2.6), HORSE, { stroke: 1.8, sx: 0, sy: 1, hx: 0, hy: 0.6 });
    const pts: Pt[] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const bump = i % 3 === 0 ? 1.08 : 0.96;
      pts.push([55 + Math.cos(a) * 36 * bump * swell, 50 + Math.sin(a) * 32 * bump * swell * (Math.sin(a) > 0 ? 0.9 : 1)]);
    }
    const cracks: Pt[][] = [[[36, 34], [44, 42], [42, 52], [50, 60]], [[66, 26], [62, 36], [70, 44]], [[74, 54], [80, 62], [76, 70]]];
    const veinsP: Pt[][] = [
      [[28, 44], [38, 38], [50, 36], [58, 30], [64, 22]], [[34, 62], [46, 66], [60, 64], [72, 70]], [[70, 40], [80, 46], [86, 56]],
      [[50, 36], [48, 26], [52, 20]],
    ];
    let over = line(ellipsePath(38, 60, 3.5, 5), P.barkDark, 1.4) + line(open([[76, 30], [84, 36], [86, 44]]), P.barkDark, 1.4);
    if (!calm) {
      over += glow(55, 48, 36, P.violet, 0.45);
      for (const c of cracks) {
        const d = taper(c, 3, 6);
        over += fillPath(d, P.violet) + line(d, INK, 1.4) + line(open(c), P.vein, 1.3);
      }
      for (const v of veinsP) over += line(open(v), INK, 5) + line(open(v), P.violet, 3.2) + line(open(v), P.vein, 1.1, 0.9);
    } else {
      for (const c of cracks) over += line(open(c), P.barkDark, 1.6);
      for (const v of veinsP) over += line(open(v), '#6f5a80', 2.4, 0.5);
    }
    s += sh(smooth(pts), BARK, { sx: 6, sy: 6, hx: 3, hy: 3, stroke: 3.6, over });
    if (!calm) {
      // Violet fluid bleeding out and dripping down.
      for (const [x, y, len] of [[50, 61, 14], [76, 70, 9], [44, 52, 8]] as const) {
        s += sh(smooth([[x - 2.2, y], [x + 2.2, y], [x + 1.8, y + len * 0.7], [x + 3, y + len], [x, y + len + 4], [x - 3, y + len], [x - 1.8, y + len * 0.7]]), HORSE, {
          stroke: 1.8, sx: 1, sy: 1, hx: 0.8, hy: 0.8,
        });
      }
      s += glints([[62, 22], [30, 50]], 1.5);
    } else {
      // Healed: small flowers and leaves have taken root.
      const LEAF: Mat = { fill: '#6f9f86', shade: '#4f7f69', light: '#94c4a8' };
      const PET: Mat = { fill: '#efe6f8', shade: '#c9b6dc', light: '#ffffff' };
      for (const [x, y, a] of [[40, 22, -2.2], [70, 20, -0.9], [86, 40, -0.3], [26, 42, 3.3]] as const) {
        const tip = polar(x, y, 14, a);
        s += sh(smooth([[x, y], polar(x, y, 7, a - 0.5), tip, polar(x, y, 7, a + 0.5)]), LEAF, { stroke: 1.8, sx: 1, sy: 1, hx: 0.6, hy: 0.6 });
      }
      for (const [x, y, r] of [[46, 18, 6], [60, 16, 7], [78, 26, 5.5], [30, 34, 5], [88, 50, 4.5]] as const) {
        s += blossom(x, y, r, PET, rng, P.sun);
      }
    }
    return s;
  });
}

// ================================================================ ROOMS 9–12

function river(): PartArt {
  return mk('prop.river', 400, 60, 'bc', (rng) => {
    const W = 400;
    const RSTONE: Mat = { fill: '#7d8286', shade: '#62676c', light: '#9aa0a3' };
    const surf = (x: number): number => 10 + 1.6 * Math.sin(x / 26 + 1) + Math.sin(x / 9.5);
    const top: Pt[] = [];
    for (let x = 0; x <= W; x += 8) top.push([x, surf(x)]);
    let s = '';
    for (let i = 0; i < 24; i++) s += pebble(rng.range(6, 394), rng.range(50, 60), rng.range(4, 9), rng, RSTONE, 2);
    s += fillPath(open(top) + `L${W} 60L0 60Z`, '#6f8ba1', 0.55);
    const band: Pt[] = [];
    for (let x = 0; x <= W; x += 20) band.push([x, 30 + Math.sin(x / 50) * 4]);
    s += fillPath(open(band) + `L${W} 52L0 52Z`, '#4e6a82', 0.3);
    // Current lines and pale reflections.
    for (let i = 0; i < 14; i++) {
      const x = rng.range(0, W - 40);
      const y = rng.range(18, 50);
      const w = rng.range(18, 50);
      s += line(open([[x, y], [x + w * 0.5, y + rng.range(-1.5, 1.5)], [x + w, y]]), '#dbe6ec', rng.range(1.2, 2.2), rng.range(0.35, 0.7));
    }
    for (let i = 0; i < 5; i++) {
      const x = rng.range(30, W - 30);
      s += line(ellipsePath(x, surf(x) + 5, rng.range(8, 14), 2), '#e7eff2', 1.2, 0.5);
    }
    s += line(open(top), INK, 2.6, 0.85);
    s += line(open(top.map(([x, y]) => [x, y + 2.2] as Pt)), '#e6eef2', 1.6, 0.85);
    // Foam where the water meets the banks.
    for (const x of [4, 396]) {
      for (let i = 0; i < 3; i++) s += line(`M${x - 5} ${14 + i * 5}q5 -3 10 0`, '#f0f5f7', 1.6, 0.8);
    }
    return s;
  });
}

function reflectPool(): PartArt {
  return mk('prop.reflectpool', 160, 40, 'bc', (rng) => {
    const RSTONE: Mat = { fill: '#85878a', shade: '#66696e', light: '#a3a6a8' };
    const SKY: Mat = { fill: '#c3cdd1', shade: '#9aa7ad', light: '#eef3f3' };
    let s = '';
    for (const [x, y, r] of [[18, 22, 6], [36, 17, 5.5], [58, 14.5, 5], [82, 14, 5.5], [106, 14.5, 5], [126, 17, 5.5], [144, 22, 6]] as const) {
      s += pebble(x, y, r, rng, RSTONE, 2);
    }
    const trees: Pt[] = [[14, 22], [30, 18.5], [40, 20], [52, 17.5], [66, 19], [80, 17], [96, 19], [110, 17.5], [124, 19.5], [140, 20], [146, 24]];
    s += sh(ellipsePath(80, 25, 66, 9), SKY, {
      sx: 0, sy: -3.5, hx: 0, hy: 0, stroke: 2.8,
      inner:
        fillPath(ellipsePath(80, 27, 50, 3.5), '#e9eeee') +
        fillPath(open(trees) + 'L146 16L14 16Z', '#6f7d80', 0.55) +
        glow(104, 26, 10, '#fffbea', 0.8),
      over: line('M30 29H52M96 31H122M62 33H80', '#f7fafa', 1.4, 0.8),
    });
    for (const [x, y, r] of [[14, 32, 7], [34, 35, 6.5], [58, 37, 6], [84, 37.5, 7], [110, 37, 6], [132, 35, 6.5], [150, 31, 6.5]] as const) {
      s += pebble(x, y, r, rng, RSTONE, 2.2);
    }
    const GRASS: Mat = { fill: '#58705f', shade: '#3f5346', light: '#76907c' };
    s += grassTuft(46, 38, 8, rng, GRASS) + grassTuft(122, 38, 9, rng, GRASS) + grassTuft(4, 36, 7, rng, GRASS, 3);
    return s;
  });
}

const SEPIA_ROOT: Mat = { fill: '#3e312d', shade: '#2b2120', light: '#584740' };

function dormBed(): PartArt {
  return mk('prop.dormbed', 190, 80, 'bc', () => {
    const FRAME: Mat = { fill: '#5d4b3f', shade: '#43362d', light: '#7a6452' };
    const MATT: Mat = { fill: '#d6c7a8', shade: '#b3a283', light: '#eadfc6' };
    const BLANKET: Mat = { fill: '#9c8c74', shade: '#7d6f5b', light: '#b5a68c' };
    const root = (pts: Pt[], w0: number, w1: number): string =>
      sh(taper(pts, w0, w1), SEPIA_ROOT, { stroke: 2.6, sx: 1.5, sy: 1.5, hx: 1, hy: 1, over: line(open(offsetPts(pts, w0 * 0.15)), SEPIA_ROOT.shade, 1, 0.8) });
    let s = shadowEl(95, 78, 92, 3, 0.4);
    s += fillPath(rect(8, 34, 174, 44), INK, 0.3);
    // Roots woven under the bed, criss-crossing between the legs.
    s += root([[10, 40], [40, 56], [72, 70], [100, 80]], 7, 5);
    s += root([[180, 40], [150, 58], [118, 70], [92, 80]], 7, 5);
    s += root([[60, 38], [70, 54], [66, 66], [74, 80]], 5, 4);
    s += root([[132, 38], [122, 52], [128, 66], [120, 80]], 5, 4);
    s += root([[20, 38], [48, 48], [90, 50], [132, 46], [172, 38]], 6, 5);
    // Legs and posts.
    for (const x of [1, 181]) {
      s += sh(rrect(x, 3, 8, 77, 2.5), FRAME, { sx: 2.5, sy: 0, hx: 1.5, hy: 0, stroke: 3 });
      s += sh(ellipsePath(x + 4, 3, 5.5, 3.5), FRAME, { stroke: 2.4, sx: 1, sy: 1, hx: 0.8, hy: 0.8 });
    }
    // Side rail, wrapped by a root.
    s += sh(rrect(4, 28, 182, 8, 2), FRAME, { sx: 0, sy: 2.5, hx: 0, hy: 1.5, stroke: 3 });
    // Worn mattress (top exactly at y=10), a flat pillow, a folded blanket.
    let tick = '';
    for (let x = 16; x < 180; x += 8) tick += line(`M${x} 10V30`, '#c4b594', 1.2);
    s += sh(rrect(10, 10, 170, 19, 5), MATT, { sx: 0, sy: 4, hx: 0, hy: 2, inner: tick, over: line(open([[70, 16], [78, 20], [92, 18]]), MATT.shade, 1.3) });
    s += sh(mixed([[14, 11, 1], [18, 5], [30, 3.5], [44, 5], [48, 11, 1]]), MATT, { stroke: 2.4, sx: 1.5, sy: 2, hx: 1, hy: 1 });
    s += sh(mixed([[132, 10, 1], [178, 10, 1], [181, 18], [178, 27, 1], [134, 27, 1], [131, 18]]), BLANKET, {
      stroke: 2.6, sx: 2, sy: 2.5, hx: 0, hy: 1.5, over: line('M134 18.5H179', BLANKET.shade, 1.4),
    });
    // Roots twining around posts and rail.
    for (const x of [1, 181]) {
      for (const y of [44, 58, 70]) s += root([[x - 2, y + 4], [x + 4, y], [x + 10, y - 4]], 4, 3);
    }
    s += root([[4, 32], [30, 36], [52, 30], [80, 36], [108, 30], [136, 36], [160, 30], [186, 34]], 5, 4);
    s += root([[1, 78], [-6, 80]], 8, 4) + root([[189, 78], [196, 80]], 8, 4);
    return s;
  });
}

function station(): PartArt {
  return mk('prop.station', 110, 150, 'bc', () => {
    const FR: Mat = { fill: '#c9b17a', shade: '#9a8458', light: '#e8d6a4' };
    const root = (pts: Pt[], w0: number, w1: number, m: Mat = SEPIA_ROOT): string =>
      sh(taper(pts, w0, w1), m, { stroke: 2.8, sx: 2, sy: 1, hx: 1, hy: 0.5, over: line(open(offsetPts(pts, w0 * 0.15)), m.shade, 1.1, 0.8) });
    let s = shadowEl(55, 148, 46, 3, 0.4);
    // Roots spreading over the floor.
    s += root([[50, 136], [30, 144], [8, 150]], 12, 5) + root([[60, 136], [82, 144], [104, 150]], 12, 5) + root([[54, 140], [50, 150]], 10, 7);
    // A braided stem of three roots.
    const strand = (ph: number, k: number): Pt[] => Array.from({ length: 9 }, (_, i) => [55 + Math.sin(i * 1.05 + ph) * 5 * k, 146 - i * 8.6] as Pt);
    s += root(strand(Math.PI, 1), 9, 7) + root(strand(Math.PI / 3, 0.9), 9, 7) + root(strand(0, 1), 10, 8);
    // Splayed roots forming the lectern's cradle.
    s += root([[55, 80], [40, 76], [26, 72], [18, 64]], 9, 4) + root([[55, 80], [70, 76], [84, 72], [92, 64]], 9, 4);
    s += root([[55, 82], [46, 74], [36, 72]], 6, 3) + root([[55, 82], [64, 74], [74, 72]], 6, 3);
    // The empty frame, glowing from inside.
    s += glow(55, 38, 52, '#f6ecd0', 0.5);
    const frame = rrect(20, 6, 70, 62, 5) + holeRect(30, 16, 50, 42);
    s += sh(rect(30, 16, 50, 42), { fill: '#f4ebd6', shade: '#e2d3b4', light: '#ffffff' }, {
      stroke: 0, sx: -3, sy: -3, inner: glow(55, 37, 30, '#ffffff', 0.9) + glow(55, 37, 40, P.vein, 0.35),
    });
    let beads = '';
    for (let i = 0; i <= 8; i++) beads += dot(28 + i * 6.75, 12, 1.1, FR.light) + dot(28 + i * 6.75, 62, 1.1, FR.shade);
    s += sh(frame, FR, { sx: 3, sy: 3, hx: 2, hy: 2, stroke: 3.2, over: beads });
    for (const [x, y] of [[20, 6], [90, 6], [20, 68], [90, 68]] as const) {
      s += sh(circle(x, y, 4), FR, { stroke: 2, sx: 1, sy: 1, hx: 0.8, hy: 0.8 });
    }
    // Root fingers gripping the lower corners.
    s += root([[22, 74], [18, 66], [22, 58]], 5, 2.5) + root([[88, 74], [92, 66], [88, 58]], 5, 2.5);
    s += glints([[74, 22], [34, 52]], 1.3);
    return s;
  });
}

function romanD(txt: string, cx: number, cy: number, h: number): string {
  const wOf = (ch: string): number => (ch === 'I' ? 0.2 : 0.6) * h;
  const gap = 0.12 * h;
  const total = [...txt].reduce((a, ch) => a + wOf(ch), 0) + gap * (txt.length - 1);
  let x = cx - total / 2;
  let d = '';
  for (const ch of txt) {
    d += glyphD(ch, x, cy - h / 2, wOf(ch), h);
    x += wOf(ch) + gap;
  }
  return d + `M${n2(cx - total / 2 - 1)} ${n2(cy - h / 2)}H${n2(cx + total / 2 + 1)}M${n2(cx - total / 2 - 1)} ${n2(cy + h / 2)}H${n2(cx + total / 2 + 1)}`;
}

function clockHand(cx: number, cy: number, len: number, w: number, ang: number): string {
  const c = Math.cos(ang);
  const sn = Math.sin(ang);
  const T = ([u, v]: Pt): Pt => [cx + u * c - v * sn, cy + u * sn + v * c];
  return poly(([[-0.16 * len, 0], [0.05 * len, -w / 2], [0.62 * len, -w * 0.28], [0.74 * len, -w * 0.62], [len, 0], [0.74 * len, w * 0.62], [0.62 * len, w * 0.28], [0.05 * len, w / 2]] as Pt[]).map(T));
}

function clock(): PartArt {
  return mk('prop.clock', 180, 220, 'c', () => {
    const RIM: Mat = { fill: '#6b5238', shade: '#4f3c29', light: '#8c6f4e' };
    const BRASSY: Mat = { fill: '#b69a62', shade: '#8f7648', light: '#d6bd86' };
    const FACE: Mat = { fill: '#ebe1ca', shade: '#cdbf9f', light: '#f8f2e4' };
    const cx = 90;
    const cy = 134;
    // Root rope: two strands twisted together, looped through a ring.
    const strand = (ph: number): Pt[] => Array.from({ length: 8 }, (_, i) => [cx + Math.sin(i * 1.3 + ph) * 3, -2 + i * 7] as Pt);
    let s = sh(taper(strand(Math.PI), 5.5, 4.5), { ...SEPIA_ROOT, fill: SEPIA_ROOT.shade }, { stroke: 2.4, sx: 1, sy: 0 });
    s += sh(taper(strand(0), 6, 5), SEPIA_ROOT, { stroke: 2.4, sx: 1.2, sy: 0 });
    s += line(circle(cx, 50, 6), INK, 5) + line(circle(cx, 50, 6), BRASSY.fill, 2.6);
    s += shadowEl(cx + 5, cy + 6, 80, 80, 0.25);
    s += sh(circle(cx, cy, 79), RIM, { sx: 5, sy: 5, hx: 3, hy: 3, stroke: 4 });
    s += sh(circle(cx, cy, 71), BRASSY, { sx: -3, sy: -3, hx: 0, hy: 0, stroke: 2.6 });
    let ticks = '';
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const hour = i % 5 === 0;
      const p0 = polar(cx, cy, hour ? 55 : 59, a);
      const p1 = polar(cx, cy, 63, a);
      ticks += line(`M${n2(p0[0])} ${n2(p0[1])}L${n2(p1[0])} ${n2(p1[1])}`, P.inkSoft, hour ? 2.6 : 1.1);
    }
    let marks = '';
    for (let hIdx = 1; hIdx <= 12; hIdx++) {
      if (hIdx % 3 === 0) continue;
      const p = polar(cx, cy, 48, (hIdx / 12) * Math.PI * 2 - Math.PI / 2);
      marks += dot(p[0], p[1], 2.2, P.inkSoft);
    }
    const numerals = romanD('XII', cx, cy - 46, 11) + romanD('III', cx + 45, cy, 11) + romanD('VI', cx, cy + 46, 11) + romanD('IX', cx - 45, cy, 11);
    s += sh(circle(cx, cy, 65), FACE, {
      sx: 5, sy: 5, hx: 0, hy: 0, stroke: 2.6, over: ticks + marks + line(numerals, P.inkSoft, 1.8) + line(circle(cx, cy, 40), '#d8cbad', 1.2),
    });
    // 13:00 — the hour hand on one, the minute hand on twelve.
    const HAND: Mat = { fill: '#2e2622', shade: '#1c1716', light: '#4a3f38' };
    s += sh(clockHand(cx, cy, 56, 6, -Math.PI / 2), HAND, { stroke: 1.6, sx: 1, sy: 1, hx: 0.6, hy: 0.6 });
    s += sh(clockHand(cx, cy, 36, 11, -Math.PI / 2 + Math.PI / 6), HAND, { stroke: 1.6, sx: 1, sy: 1, hx: 0.6, hy: 0.6 });
    s += sh(circle(cx, cy, 5), BRASSY, { stroke: 2, sx: 1, sy: 1, hx: 0.8, hy: 0.8 });
    // Glass: glare and a crack.
    s += line(`M${cx - 50} ${cy - 22}Q${cx - 44} ${cy - 46} ${cx - 22} ${cy - 52}`, '#ffffff', 4, 0.35);
    s += line(poly([[cx + 30, cy - 57], [cx + 24, cy - 40], [cx + 30, cy - 30], [cx + 20, cy - 16]], false), '#ffffff', 1.2, 0.7);
    // A root creeping over the rim from the rope.
    s += sh(taper([polar(cx, cy, 76, -1.62), polar(cx, cy, 79, -1.95), polar(cx, cy, 78, -2.3), polar(cx, cy, 74, -2.6)], 7, 3), SEPIA_ROOT, { stroke: 2.4, sx: 1, sy: 1 });
    s += sh(taper([polar(cx, cy, 78, -2.1), polar(cx, cy, 90, -2.2), polar(cx, cy, 94, -2.4)], 3.5, 1.2), SEPIA_ROOT, { stroke: 1.8, sx: 0.8, sy: 0.8 });
    return s;
  });
}

const STEEL: Mat = { fill: '#5d6475', shade: P.metalDark, light: '#7d8598' };
const BONE_STRUT: Mat = { fill: '#cfc6b2', shade: '#a39a86', light: '#e6dfcf' };

function rivets(pts: readonly Pt[], r = 1.8): string {
  return pts.map(([x, y]) => dot(x, y, r, STEEL.light) + dot(x + r * 0.4, y + r * 0.4, r * 0.55, STEEL.shade)).join('');
}

function console_(): PartArt {
  return mk('prop.console', 90, 110, 'bc', () => {
    let s = shadowEl(45, 108, 40, 3, 0.4);
    // Bone struts for legs.
    for (const x of [18, 66]) {
      s += sh(taper([[x + 3, 92], [x + 2, 102], [x + 4, 109]], 8, 7), BONE_STRUT, { stroke: 2.6, sx: 2, sy: 0, hx: 1, hy: 0 });
      s += sh(circle(x + 4, 108, 4.5), BONE_STRUT, { stroke: 2.2, sx: 1, sy: 1, hx: 0.8, hy: 0.8 });
    }
    // Lever: behind the top panel, knob in violet.
    s += sh(taper([[64, 34], [69, 20], [74, 8]], 5, 4), STEEL, { stroke: 2.6, sx: 1.5, sy: 0, hx: 1, hy: 0 });
    s += sh(circle(74.5, 7.5, 6), HORSE, { stroke: 2.6, sx: 1.5, sy: 1.5, hx: 1.2, hy: 1.2 });
    // Cabinet: front face and sloped top.
    s += sh('M8 42L18 26H80L84 42Z', STEEL, {
      sx: 0, sy: -2, hx: 0, hy: 0, stroke: 3.2,
      over: sh(ellipsePath(64, 34, 8, 3), { fill: '#2a2e38', shade: '#1c1f27', light: '#3a3f4b' }, { stroke: 2, sx: 0, sy: 0, hx: 0, hy: 0 }) + dot(26, 34, 2.2, P.crystalTeal) + dot(35, 34, 2.2, P.vein) + dot(44, 34, 2.2, '#3a3f4b'),
    });
    s += sh(rrect(8, 41, 76, 53, 3), STEEL, {
      sx: 4, sy: 3, hx: 2, hy: 2, stroke: 3.4,
      over: line('M12 80H80M12 84H80M12 88H80', STEEL.shade, 1.6) + rivets([[13, 46], [79, 46], [13, 75], [79, 75]]),
    });
    // Round dial.
    s += sh(circle(46, 60, 14), STEEL, { stroke: 2.6, sx: 1.5, sy: 1.5, hx: 1, hy: 1 });
    let ticks = '';
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI * (0.8 + (i / 8) * 1.4);
      const p0 = polar(46, 61, 7.5, a);
      const p1 = polar(46, 61, 10, a);
      ticks += `M${n2(p0[0])} ${n2(p0[1])}L${n2(p1[0])} ${n2(p1[1])}`;
    }
    s += sh(circle(46, 60, 10.5), { fill: '#dfe3ea', shade: '#b9bfcb', light: '#f5f7fa' }, {
      stroke: 2, sx: 1.5, sy: 1.5, hx: 0, hy: 0,
      over: line(ticks, P.inkSoft, 1.1) + line('M46 61L52 54', P.stamp, 1.8) + dot(46, 61, 1.8, P.inkSoft),
    });
    return s;
  });
}

function gear(): PartArt {
  return mk('prop.gear', 200, 200, 'c', () => {
    const G: Mat = { fill: '#4a4f5c', shade: '#373b46', light: '#5f6573' };
    const cx = 100;
    const cy = 100;
    const teeth = 16;
    const step = (Math.PI * 2) / teeth;
    const pts: Pt[] = [];
    for (let i = 0; i < teeth; i++) {
      const a = i * step;
      pts.push(polar(cx, cy, 83, a - step * 0.27), polar(cx, cy, 95, a - step * 0.15), polar(cx, cy, 95, a + step * 0.15), polar(cx, cy, 83, a + step * 0.27));
    }
    let d = poly(pts);
    // Five cut-outs between parallel-sided spokes, and the axle hole.
    const r1 = 30;
    const r2 = 66;
    const hw = 8;
    for (let i = 0; i < 5; i++) {
      const s1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const s2 = s1 + (Math.PI * 2) / 5;
      const o1 = polar(cx, cy, r2, s2 - Math.asin(hw / r2));
      const o2 = polar(cx, cy, r2, s1 + Math.asin(hw / r2));
      const i1 = polar(cx, cy, r1, s1 + Math.asin(hw / r1));
      const i2 = polar(cx, cy, r1, s2 - Math.asin(hw / r1));
      d += `M${n2(o1[0])} ${n2(o1[1])}A${r2} ${r2} 0 0 0 ${n2(o2[0])} ${n2(o2[1])}L${n2(i1[0])} ${n2(i1[1])}A${r1} ${r1} 0 0 1 ${n2(i2[0])} ${n2(i2[1])}Z`;
    }
    d += circle(cx, cy, 9);
    let s = sh(d, G, {
      sx: 5, sy: 5, hx: 2.5, hy: 2.5, stroke: 4,
      over: line(circle(cx, cy, 76), G.shade, 2) + line(circle(cx, cy, 20), G.shade, 2) + rivets([polar(cx, cy, 15, 0.4), polar(cx, cy, 15, 2.5), polar(cx, cy, 15, 4.6)], 2.4),
    });
    s += line(circle(cx, cy, 9), '#23262e', 3);
    return s;
  });
}

function keyOutline(): PartArt {
  return mk('prop.keyoutline', 60, 140, 'c', () => {
    const d =
      'M35 48.4A21 21 0 1 0 25 48.4L25 126Q25 131 30 131Q35 131 35 126L35 124L49 124L49 116L43 116L43 110L49 110L49 102L35 102Z' + circle(30, 28, 9);
    let s = glow(30, 28, 30, P.vein, 0.28) + glow(38, 110, 26, P.vein, 0.2);
    s += line(d, P.violet, 11, 0.16) + line(d, P.vein, 6.5, 0.3) + line(d, P.vein, 3.4, 0.95) + line(d, '#fbf6ff', 1.3, 0.95);
    for (const [x, y, r] of [[10, 14, 2.4], [52, 40, 1.8], [17, 78, 1.6], [52, 132, 2]] as const) {
      s += line(`M${x - r * 2} ${y}H${x + r * 2}M${x} ${y - r * 2}V${y + r * 2}`, P.vein, 1.1, 0.9) + dot(x, y, r * 0.55, '#ffffff');
    }
    return s;
  });
}

function lock(): PartArt {
  return mk('prop.lock', 70, 90, 'c', () => {
    let s = shadowEl(38, 48, 30, 40, 0.3);
    s += sh(rrect(7, 5, 56, 80, 11), STEEL, {
      sx: 4, sy: 4, hx: 2, hy: 2, stroke: 3.6,
      over:
        line(rrect(13, 11, 44, 68, 7), P.violetDark, 3.4) +
        line(rrect(13, 11, 44, 68, 7), P.violet, 1.8) +
        line(rrect(16.5, 14.5, 37, 61, 5), P.vein, 0.9, 0.6) +
        rivets([[14, 12], [56, 12], [14, 78], [56, 78]], 2.2) +
        line('M24 64l6 -3M44 30l4 4', STEEL.light, 1.1, 0.8),
    });
    s += sh('M35 30.5a7.5 7.5 0 0 1 4.6 13.4L42 58H28L30.4 43.9A7.5 7.5 0 0 1 35 30.5Z', { fill: '#15131f', shade: '#15131f', light: '#2a2640' }, {
      stroke: 2.6, sx: 0, sy: 0, hx: -1.5, hy: -1.5, inner: glow(35, 46, 12, P.violet, 0.5),
    });
    return s;
  });
}

const OFFICE_FRAME: Mat = { fill: '#8c8578', shade: '#6f695e', light: '#a39c8e' };
const OFFICE_DOOR: Mat = { fill: '#aaa396', shade: '#8a8376', light: '#c1baac' };
const OFFICE_METAL: Mat = { fill: '#7a766e', shade: '#5a564f', light: '#a29d93' };
const PAPER: Mat = { fill: P.paper, shade: P.paperDark, light: '#ece4d2' };

function officeDoor(opened: boolean): PartArt {
  return mk(opened ? 'prop.officedoor.open' : 'prop.officedoor', 110, 300, 'bc', (rng) => {
    let s = '';
    if (!opened) {
      s += sh(rect(14, 12, 82, 288), OFFICE_DOOR, {
        sx: 0, sy: 0, hx: 2, hy: 2, stroke: 3, shadeD: rect(84, 12, 12, 288),
        over:
          line('M30 20V290M62 18V292', OFFICE_DOOR.shade, 1.1, 0.6) +
          fillPath(rect(16, 296.5, 78, 2.5), '#f3d98e', 0.8),
      });
      // Hinges, kick plate, nameplate, handle, keyhole.
      for (const y of [40, 150, 256]) s += sh(rect(12, y, 5, 16), OFFICE_METAL, { stroke: 1.8, sx: 1, sy: 0, hx: 0.6, hy: 0 });
      s += sh(rect(20, 268, 70, 26), OFFICE_METAL, { stroke: 2.2, sx: 0, sy: 2, hx: 0, hy: 1, over: rivets([[24, 272], [86, 272], [24, 290], [86, 290]], 1.4) });
      s += sh(rect(36, 92, 38, 11), OFFICE_METAL, { stroke: 2, sx: 1, sy: 1, hx: 0.8, hy: 0.8, over: line('M41 96H69M41 99.5H62', OFFICE_METAL.shade, 1.1) });
      // A stamped notice taped to the door.
      s += grp(
        'transform="rotate(-4 50 136)"',
        sh(rect(36, 116, 30, 40), PAPER, {
          stroke: 1.8, sx: 1.5, sy: 1.5, hx: 0, hy: 0,
          over: line('M40 123H62M40 128H60M40 133H62M40 138H56', '#8e8574', 1) + line(circle(55, 147, 5.5), P.stamp, 1.6) + line('M51.5 147h7', P.stamp, 1.4),
        }) + fillPath(rect(46, 113, 10, 5), '#e6dfc9', 0.8),
      );
      s += sh(circle(82, 162, 4.5), OFFICE_METAL, { stroke: 2, sx: 1, sy: 1, hx: 0.8, hy: 0.8 });
      s += sh(rrect(66, 159.5, 18, 5, 2.5), OFFICE_METAL, { stroke: 2, sx: 0, sy: 1.2, hx: 0, hy: 0.8 });
      s += fillPath('M81 172a1.8 1.8 0 1 1 2 0l0.6 4h-3.2Z', INK);
    } else {
      // A dim room beyond the doorway.
      s += fillPath(rect(14, 12, 82, 288), '#2b2825');
      s += fillPath(rect(14, 250, 82, 50), '#39342f');
      s += line('M14 250H96', '#4a443d', 2);
      s += glow(66, 140, 56, '#d9c9a0', 0.16);
      s += line(rect(52, 96, 30, 40), '#46403a', 2.2) + fillPath(rect(52, 96, 30, 40), '#35302b');
      s += line(open([[40, 236], [66, 230], [92, 236]]), '#4a443d', 2.2);
      s += fillPath(rect(14, 12, 82, 8), INK, 0.35);
      // The door, swung inward on its hinges.
      const leaf = 'M14 12L40 30V284L14 300Z';
      s += sh(leaf, { fill: '#8f887b', shade: '#736d61', light: '#a59e90' }, {
        sx: 0, sy: 0, hx: 1.5, hy: 0, stroke: 3,
        over: fillPath('M18 266L36 258V278L18 290Z', OFFICE_METAL.fill) + line('M18 266L36 258V278L18 290Z', INK, 1.4) + fillPath('M16 30L22 34V44L16 42Z', OFFICE_METAL.fill),
      });
      s += sh('M40 30L44 32V283L40 284Z', OFFICE_DOOR, { stroke: 2, sx: 0, sy: 0, hx: 0, hy: 0 });
      s += sh(rrect(32, 158, 8, 4, 2), OFFICE_METAL, { stroke: 1.8, sx: 0, sy: 1, hx: 0, hy: 0.6 });
    }
    // Frame (jambs and header), drawn over the edges.
    s += merged([rect(2, 0, 12, 300), rect(96, 0, 12, 300), rect(2, 0, 106, 12)], OFFICE_FRAME, { sx: 3, sy: 3, hx: 2, hy: 2 }, 3.4);
    s += line('M8 12V296M102 12V296', OFFICE_FRAME.shade, 1.2, 0.7) + grain(6, 104, [5], OFFICE_FRAME.shade, rng, 1.1, 0.6);
    return s;
  });
}

function bench(): PartArt {
  return mk('prop.bench', 200, 70, 'bc', () => {
    const PLANK: Mat = { fill: '#8f7c66', shade: '#6f604f', light: '#a8957c' };
    let s = shadowEl(100, 68, 96, 3, 0.4);
    // Metal frame: back posts and splayed legs.
    for (const x of [26, 174]) {
      s += sh(rrect(x - 3, 4, 6, 40, 2), OFFICE_METAL, { stroke: 2.4, sx: 1.5, sy: 0, hx: 0.8, hy: 0 });
      s += sh(taper([[x - 4, 44], [x - 9, 67]], 5, 4.5), OFFICE_METAL, { stroke: 2.4, sx: 1.2, sy: 0 });
      s += sh(taper([[x + 4, 44], [x + 9, 67]], 5, 4.5), OFFICE_METAL, { stroke: 2.4, sx: 1.2, sy: 0 });
      s += sh(rrect(x - 13, 65, 26, 4, 2), OFFICE_METAL, { stroke: 2, sx: 0, sy: 1, hx: 0, hy: 0.6 });
    }
    for (const y of [7, 20]) s += sh(rrect(10, y, 180, 10, 3), PLANK, { sx: 0, sy: 2.5, hx: 0, hy: 1.5, stroke: 3 });
    s += sh(rrect(4, 36, 192, 11, 3), PLANK, { sx: 0, sy: 3, hx: 0, hy: 1.5, stroke: 3.2, over: line('M7 41.5H193', PLANK.shade, 1.3) });
    // A folded sheet somebody left behind.
    s += sh('M140 36L146 29L172 31L168 36Z', PAPER, { stroke: 1.8, sx: 0, sy: 1, hx: 0, hy: 0, over: line('M150 32.5L164 33.5', '#8e8574', 1) });
    return s;
  });
}

function coatRack(): PartArt {
  return mk('prop.coatrack', 70, 200, 'bc', () => {
    const WD: Mat = { fill: '#5b4a3e', shade: '#43362d', light: '#76614f' };
    const COAT: Mat = { fill: '#5d564d', shade: '#47413a', light: '#766e62' };
    let s = shadowEl(35, 198, 30, 3, 0.4);
    s += sh(taper([[35, 178], [20, 190], [6, 198]], 7, 5), WD, { stroke: 2.6, sx: 1, sy: 1.5 });
    s += sh(taper([[35, 178], [50, 190], [64, 198]], 7, 5), WD, { stroke: 2.6, sx: 1, sy: 1.5 });
    s += sh(rrect(31, 12, 8, 172, 3), WD, { sx: 3, sy: 0, hx: 1.5, hy: 0, stroke: 3, over: line('M31 60H39M31 120H39', WD.shade, 1.4) });
    s += sh(circle(35, 9, 5.5), WD, { stroke: 2.6, sx: 1.2, sy: 1.2, hx: 1, hy: 1 });
    s += sh(taper([[35, 180], [36, 199]], 8, 6), WD, { stroke: 2.4, sx: 1, sy: 0 });
    // Hooks.
    for (const dir of [-1, 1]) {
      const hook: Pt[] = [[35, 30], [35 + dir * 11, 27], [35 + dir * 17, 20], [35 + dir * 16, 14]];
      s += sh(taper(hook, 4.5, 3), OFFICE_METAL, { stroke: 2.2, sx: 1, sy: 1 }) + sh(circle(hook[3]![0], hook[3]![1], 2.4), OFFICE_METAL, { stroke: 1.6, sx: 0.5, sy: 0.5, hx: 0.4, hy: 0.4 });
    }
    s += sh(taper([[35, 44], [35 + 12, 43], [35 + 15, 37]], 3.5, 2.5), OFFICE_METAL, { stroke: 2, sx: 1, sy: 1 });
    // One coat left hanging, a stamp-red scarf at its collar.
    s += sh(smooth([[14, 22], [24, 26], [28, 40], [30, 76], [34, 126], [30, 142], [16, 144], [2, 140], [4, 112], [5, 70], [6, 38], [9, 26]]), COAT, {
      sx: 4, sy: 2, hx: 2, hy: 1, stroke: 3.2,
      over:
        line(open([[16, 28], [17, 60], [18, 100], [17, 140]]), COAT.shade, 1.4) +
        dot(20, 60, 1.6, INK) +
        dot(20.5, 80, 1.6, INK) +
        dot(21, 100, 1.6, INK) +
        line('M24 104h8', COAT.shade, 1.6) +
        line(open([[8, 40], [6, 80], [9, 118]]), COAT.shade, 1.2, 0.8),
    });
    s += sh(mixed([[10, 24, 1], [16, 20], [22, 24, 1], [18, 36], [14, 36]]), COAT, { stroke: 2.2, sx: 1, sy: 1, hx: 0.6, hy: 0.6 });
    s += sh(taper([[16, 26], [19, 44], [18, 66], [20, 84]], 6, 5), { fill: P.stamp, shade: '#733643', light: '#b06474' }, { stroke: 2.2, sx: 1.5, sy: 0.5, hx: 1, hy: 0.5 });
    return s;
  });
}

function paperSheet(cx: number, cy: number, w: number, h: number, rot: number, extra: (T: (u: number, v: number) => Pt) => string = () => ''): string {
  const c = Math.cos(rot);
  const sn = Math.sin(rot);
  const T = (u: number, v: number): Pt => [cx + u * c - v * sn, cy + (u * sn + v * c) * 0.42];
  const d = poly([T(-w / 2, -h / 2), T(w / 2, -h / 2), T(w / 2, h / 2), T(-w / 2, h / 2)]);
  let lines = '';
  for (let v = -h / 2 + 9; v < h / 2 - 12; v += 7) lines += poly([T(-w / 2 + 7, v), T(w / 2 - 7 - ((v * 7) % 13), v)], false);
  return sh(d, PAPER, { stroke: 1.8, sx: 0, sy: 1.2, hx: 0, hy: 0, over: line(lines, '#8e8574', 1.1, 0.9) + extra(T) });
}

function table(): PartArt {
  return mk('prop.table', 620, 170, 'bc', () => {
    const TOP: Mat = { fill: '#8b7b69', shade: '#6f604f', light: '#a4937e' };
    const EDGE: Mat = { fill: '#6b5d4e', shade: '#54483c', light: '#85745f' };
    let s = shadowEl(310, 164, 280, 6, 0.35);
    // Pedestal legs: one behind, two in front.
    const leg = (x: number, y0: number, m: Mat): string =>
      sh(rrect(x - 8, y0, 16, 162 - y0, 3), m, { sx: 3, sy: 0, hx: 1.5, hy: 0, stroke: 3 }) +
      sh(rrect(x - 26, 160, 52, 7, 3), m, { sx: 0, sy: 2, hx: 0, hy: 1, stroke: 2.8 });
    s += leg(310, 96, { ...OFFICE_METAL, fill: OFFICE_METAL.shade });
    s += leg(150, 108, OFFICE_METAL) + leg(470, 108, OFFICE_METAL);
    s += sh('M8 58A302 46 0 0 0 612 58V72A302 46 0 0 1 8 72Z', EDGE, { sx: 0, sy: 3, hx: 0, hy: 1.5, stroke: 3.4 });
    s += sh(ellipsePath(310, 58, 302, 46), TOP, {
      sx: 0, sy: -4, hx: 0, hy: 3, stroke: 3.4,
      over: line('M60 40Q310 -8 560 40', TOP.light, 2.2, 0.5) + line(ellipsePath(310, 58, 270, 38), TOP.shade, 1.2, 0.5),
    });
    // The three documents at the reading spots, a stack in the middle.
    s += paperSheet(150, 66, 70, 90, -0.12, (T) => {
      let p = '';
      for (const u of [-18, 4]) {
        const a = T(u - 8, -30);
        const b = T(u + 8, -30);
        const c2 = T(u + 8, -6);
        const e = T(u - 8, -6);
        p += fillPath(poly([a, b, c2, e]), '#c9bea6') + line(poly([a, b, c2, e]), '#6e6656', 1);
        const hd = T(u, -20);
        p += fillPath(ellipsePath(hd[0], hd[1], 3.4, 1.6), '#6e6656');
      }
      return p;
    });
    s += paperSheet(300, 54, 66, 86, 0.08);
    s += paperSheet(306, 58, 66, 86, -0.05);
    s += paperSheet(312, 62, 70, 90, 0.1, (T) => {
      const c2 = T(14, 22);
      return line(ellipsePath(c2[0], c2[1], 8, 3.6), P.stamp, 1.8) + line(ellipsePath(c2[0], c2[1], 5, 2.2), P.stamp, 1.1);
    });
    s += paperSheet(470, 64, 68, 88, 0.2, (T) => {
      const a = T(-20, 30);
      const b = T(20, 26);
      return line(`M${n2(a[0])} ${n2(a[1])}q6 -5 10 0t10 -1t10 1t8 -3`, '#3a3550', 1.2) + line(poly([T(-24, 34), b], false), '#8e8574', 0.9);
    });
    // Pen and a rubber stamp.
    s += sh(taper([[512, 76], [546, 70]], 4, 3), { fill: '#3a3550', shade: '#2b2840', light: '#4d4766' }, { stroke: 1.6, sx: 0, sy: 1, hx: 0, hy: 0.6 });
    s += sh(rrect(368, 60, 18, 7, 2), { fill: '#6e4a3a', shade: '#553829', light: '#8a624e' }, { stroke: 2, sx: 0, sy: 1.5, hx: 0, hy: 0.8 });
    s += sh(rrect(372, 48, 10, 13, 3), { fill: P.stamp, shade: '#733643', light: '#b06474' }, { stroke: 2, sx: 1, sy: 0, hx: 0.8, hy: 0 });
    s += sh(circle(377, 46, 5), { fill: P.stamp, shade: '#733643', light: '#b06474' }, { stroke: 2, sx: 1, sy: 1, hx: 0.8, hy: 0.8 });
    return s;
  });
}

function chair(): PartArt {
  return mk('prop.chair', 70, 110, 'bc', () => {
    const UP: Mat = { fill: P.suit, shade: P.suitDark, light: P.suitLight };
    let s = shadowEl(35, 108, 30, 2.5, 0.4);
    // Star base with casters.
    s += sh(taper([[35, 94], [20, 99], [8, 101]], 6, 4), OFFICE_METAL, { stroke: 2.4, sx: 0, sy: 1.5 });
    s += sh(taper([[35, 94], [50, 99], [62, 101]], 6, 4), OFFICE_METAL, { stroke: 2.4, sx: 0, sy: 1.5 });
    for (const x of [9, 35, 61]) s += sh(circle(x, 104.5, 4.5), { fill: '#3a3a44', shade: '#282830', light: '#55555f' }, { stroke: 2, sx: 1, sy: 1, hx: 0.8, hy: 0.8 });
    s += sh(rrect(31, 64, 8, 32, 2), OFFICE_METAL, { sx: 2, sy: 0, hx: 1, hy: 0, stroke: 2.6 });
    // Back support and backrest.
    s += sh(taper([[40, 66], [22, 64], [16, 52]], 6, 5), OFFICE_METAL, { stroke: 2.4, sx: 1, sy: 1 });
    s += sh(mixed([[12, 12], [22, 8], [28, 14], [26, 48], [18, 58], [9, 54], [8, 30]]), UP, { sx: 3, sy: 2, hx: 2, hy: 1.5, stroke: 3, over: line(open([[14, 16], [13, 34], [14, 50]]), UP.shade, 1.4) });
    s += sh(rrect(12, 56, 50, 12, 6), UP, { sx: 0, sy: 3, hx: 0, hy: 2, stroke: 3 });
    // Armrest.
    s += sh(taper([[30, 58], [32, 44], [50, 42]], 4, 4), OFFICE_METAL, { stroke: 2.2, sx: 1, sy: 1 });
    s += sh(rrect(30, 39, 24, 6, 3), { fill: '#3a3a44', shade: '#282830', light: '#55555f' }, { stroke: 2.2, sx: 0, sy: 1.5, hx: 0, hy: 1 });
    return s;
  });
}

// ================================================================ MARKERS

/** Four-point sparkle. */
function sparkle(x: number, y: number, r: number, color: string): string {
  const k = r * 0.22;
  return (
    fillPath(poly([[x, y - r], [x + k, y - k], [x + r, y], [x + k, y + k], [x, y + r], [x - k, y + k], [x - r, y], [x - k, y - k]]), color) +
    dot(x, y, k * 0.9, '#ffffff')
  );
}

/** Pointed petal from a base point outwards (sharp tip). */
function petalD(bx: number, by: number, a: number, len: number, w: number, sy = 1): string {
  const P2 = (u: number, v: number): Pt => [bx + (u * Math.cos(a) - v * Math.sin(a)), by + (u * Math.sin(a) + v * Math.cos(a)) * sy];
  return mixed([[...P2(0, 0), 1], [...P2(len * 0.35, -w / 2)], [...P2(len * 0.8, -w * 0.3)], [...P2(len, 0), 1], [...P2(len * 0.8, w * 0.3)], [...P2(len * 0.35, w / 2)]]);
}

const FLAT_RUNES = [
  'M-3.5 1.5L0 -1.5L3.5 1.5',
  'M-3.5 -1.5L3.5 1.5M-3.5 1.5L3.5 -1.5',
  'M-3 -1.5V1.5M1 -1.5L-2 1.5M3 -1.5V1.5',
  'M-3.5 0H3.5M0 -1.5V1.5',
  'M-3.5 -1.5L0 1.5L3.5 -1.5',
  'M-3.5 1.5V-1.5L3.5 1.5V-1.5',
];
/** A rune lying flat on the ground (drawn squashed). */
function flatRune(x: number, y: number, i: number): string {
  return FLAT_RUNES[i % FLAT_RUNES.length]!.replace(/([ML])(-?[\d.]+) (-?[\d.]+)/g, (_, c: string, a: string, b: string) => `${c}${n2(x + +a)} ${n2(y + +b)}`)
    .replace(/H(-?[\d.]+)/g, (_, a: string) => `H${n2(x + +a)}`)
    .replace(/V(-?[\d.]+)/g, (_, b: string) => `V${n2(y + +b)}`);
}

function anchor(): PartArt {
  return mk('prop.anchor', 40, 40, 'c', (rng) => {
    let s = glow(20, 20, 20, P.violet, 0.5);
    for (const a of [-2.5, -1.2, 0.2, 1.3, 2.4]) {
      const a2 = a + rng.range(-0.15, 0.15);
      s += sh(taper([polar(20, 20, 9, a2), polar(20, 20, 14.5, a2 + 0.12), polar(20, 20, 18.5, a2 + 0.3)], 5.5, 1.6), BARK, { stroke: 1.8, sx: 1, sy: 1, hx: 0.6, hy: 0.6 });
    }
    const pts: Pt[] = [];
    for (let i = 0; i < 11; i++) pts.push(polar(20, 20, 12.5 * rng.range(0.86, 1.08), (i / 11) * Math.PI * 2));
    s += sh(smooth(pts), BARK, {
      stroke: 2.2, sx: 2.5, sy: 2.5, hx: 1.5, hy: 1.5,
      over: line(open([[10, 17], [12, 12.5], [17, 10]]), P.barkDark, 1.1) + line(open([[26, 29], [30, 25]]), P.barkDark, 1.1),
    });
    s += dot(20, 20, 7, '#241638');
    s += glow(20, 20, 10, P.vein, 0.7);
    s += line(circle(20, 20, 5.2), P.violet, 3.2) + line(circle(20, 20, 5.2), P.vein, 1.4) + dot(20, 20, 1.6, '#ffffff');
    return s;
  });
}

function site(): PartArt {
  return mk('prop.site', 100, 28, 'bc', (rng) => {
    const cx = 50;
    const cy = 19;
    const items: { a: number; x: number; y: number; r: number; root: boolean }[] = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + 0.1;
      items.push({ a, x: cx + Math.cos(a) * 43, y: cy + Math.sin(a) * 6.5, r: rng.range(3.2, 4.4), root: i % 3 === 1 });
    }
    const draw = (it: (typeof items)[number]): string =>
      it.root
        ? sh(taper([[it.x - 5, it.y + 1], [it.x, it.y - 1.2], [it.x + 5, it.y + 0.6]], 3.4, 2.4), BARK, { stroke: 1.8, sx: 0.8, sy: 0.8, hx: 0.5, hy: 0.5 })
        : pebble(it.x, it.y, it.r * (Math.sin(it.a) > 0 ? 1.15 : 0.85), rng, NIGHT_STONE, 1.8);
    let s = oglow(cx, cy, 50, 12, P.violet, 0.5);
    for (const it of items) if (Math.sin(it.a) < 0) s += draw(it);
    let runes = ellipsePath(cx, cy, 30, 4.2) + ellipsePath(cx, cy, 9, 1.4);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + 0.3;
      runes += flatRune(cx + Math.cos(a) * 20, cy + Math.sin(a) * 2.6, i);
    }
    s += line(runes, P.violetDark, 3, 0.75) + line(runes, P.vein, 1.3);
    for (const it of items) if (Math.sin(it.a) >= 0) s += draw(it);
    return s;
  });
}

function node(lit: boolean): PartArt {
  return mk(lit ? 'prop.node.lit' : 'prop.node', 60, 72, 'bc', () => {
    const STEM: Mat = { fill: '#3f6b5e', shade: '#2d4d45', light: '#5f8f7d' };
    const PET = CRYSTAL.teal;
    let s = shadowEl(30, 70, 17, 2.5, 0.35);
    s += lit ? glow(30, 30, 30, P.crystalTeal, 0.75) : glow(30, 27, 20, P.crystalTeal, 0.25);
    s += sh(smooth([[29, 70], [18, 65], [7, 63], [13, 58], [24, 60]]), STEM, { stroke: 2, sx: 1, sy: 1.5, hx: 0.6, hy: 0.6 });
    s += sh(smooth([[31, 70], [42, 64], [53, 62], [47, 57], [36, 60]]), STEM, { stroke: 2, sx: 1, sy: 1.5, hx: 0.6, hy: 0.6 });
    s += sh(taper([[30, 71], [29, 60], [31, 50], [30, 42]], 6, 4.5), STEM, { stroke: 2.4, sx: 1.5, sy: 0, hx: 0.8, hy: 0 });
    if (!lit) {
      s += sh(smooth([[30, 47], [19, 38], [17, 24], [23, 11], [30, 4], [37, 11], [43, 24], [41, 38]]), PET, { stroke: 2.6, sx: 2.5, sy: 2, hx: 1.5, hy: 1.5 });
      s += sh(smooth([[30, 47], [20, 39], [18.5, 26], [24, 13], [30.5, 6], [27.5, 22], [29.5, 38]]), PET, { stroke: 2.2, sx: 1.5, sy: 1.5, hx: 1.2, hy: 1.2 });
      s += sh(smooth([[30, 47], [40, 39], [41.5, 27], [37.5, 14], [31, 7], [33, 24], [31, 40]]), { ...PET, fill: P.crystalTealDark }, { stroke: 2.2, sx: 1.5, sy: 1.5, hx: 1, hy: 1, light: PET.fill });
      s += sh(smooth([[30, 50], [21, 47], [17, 41], [26, 43]]), STEM, { stroke: 1.8, sx: 0.8, sy: 0.8 });
      s += sh(smooth([[30, 50], [39, 47], [43, 41], [34, 43]]), STEM, { stroke: 1.8, sx: 0.8, sy: 0.8 });
      s += line('M23 18Q22 26 24 34', PET.light, 1.3, 0.9) + sparkle(24, 12, 3, P.crystalTealLight);
    } else {
      const LIT: Mat = { fill: '#7fdccc', shade: '#3fa596', light: '#e8fffb' };
      for (const [a, len, w] of [[-2.75, 22, 12], [-0.39, 22, 12], [-2.1, 25, 13], [-1.04, 25, 13], [-1.57, 24, 13]] as const) {
        s += sh(petalD(30, 40, a, len, w), LIT, { stroke: 2.2, sx: 1.5, sy: 1.5, hx: 1, hy: 1, over: line(open([polar(30, 40, 4, a), polar(30, 40, len * 0.7, a)]), LIT.shade, 1, 0.8) });
      }
      s += glow(30, 34, 18, '#ffffff', 0.85);
      s += sh(circle(30, 35, 6.5), { fill: '#e8fffb', shade: '#9fe3d8', light: '#ffffff' }, { stroke: 2, sx: 1, sy: 1, hx: 0.8, hy: 0.8 });
      s += sparkle(12, 18, 3.5, P.crystalTealLight) + sparkle(48, 14, 3, P.crystalTealLight) + sparkle(40, 4, 2.5, '#ffffff');
    }
    return s;
  });
}

function memory(): PartArt {
  return mk('prop.memory', 36, 36, 'c', () => {
    const rot = -0.62;
    const T = (u: number, v: number): Pt => [18 + u * Math.cos(rot) - v * Math.sin(rot), 19 + u * Math.sin(rot) + v * Math.cos(rot)];
    let s = glow(18, 18, 18, P.violet, 0.5);
    const leaf = mixed([[...T(-13, 0), 1], [...T(-5, -7.5)], [...T(6, -7)], [...T(13, 0), 1], [...T(6, 7.2)], [...T(-5, 7.8)]]);
    const veins =
      open([T(-12, 0), T(12, 0)]) +
      open([T(-6, 0), T(-3, -4.5)]) +
      open([T(0, 0), T(3, -4.5)]) +
      open([T(6, 0), T(8, -3.5)]) +
      open([T(-5, 0), T(-2, 4.5)]) +
      open([T(1, 0), T(4, 4.5)]);
    s += cel(leaf, {
      fill: '#f4ecdf', shade: P.ivoryDark, light: '#ffffff', sx: 0, sy: 0, hx: 1, hy: 1, stroke: 2,
      shadeD: poly([T(-13, 0), T(13, 0), T(6, 9), T(-5, 9)]),
      over: line(veins, '#a8977e', 0.9, 0.9) + fillPath(poly([T(-13, 0), T(-8, -3.2), T(-8, 0.4)]), P.ivoryDark) + line(poly([T(-8, -3.2), T(-8, 0.4)], false), INK, 0.9),
    });
    s += sparkle(...T(11, -7), 5, P.vein) + sparkle(...T(-9, 7), 2.6, P.vein);
    return s;
  });
}

function lantern(lit: boolean): PartArt {
  return mk(lit ? 'prop.lantern.lit' : 'prop.lantern', 40, 72, 'bc', () => {
    const DIM: Mat = { fill: '#3f6d68', shade: '#2d4f4b', light: '#5e8e88' };
    const LIT: Mat = { fill: '#8ae6d6', shade: '#43b6a4', light: '#f0fffb' };
    const m = lit ? LIT : DIM;
    let s = shadowEl(20, 70, 13, 2.5, 0.35);
    if (lit) s += glow(20, 22, 20, '#7fe6d4', 0.85) + oglow(20, 70, 20, 4, '#7fe6d4', 0.5);
    s += sh(taper([[20, 67], [11, 70], [2, 72]], 5, 2), BARK, { stroke: 2, sx: 0.8, sy: 1 });
    s += sh(taper([[20, 67], [29, 70], [38, 72]], 5, 2), BARK, { stroke: 2, sx: 0.8, sy: 1 });
    s += sh(taper([[20, 72], [19, 60], [21, 48], [20, 36]], 7, 5), BARK, { stroke: 2.4, sx: 1.5, sy: 0, hx: 0.8, hy: 0, over: line('M21 64Q23 54 20 44', P.violet, 1, lit ? 0.8 : 0.4) });
    const crys = poly([[20, 5], [27, 12], [27, 28], [20, 35], [13, 28], [13, 12]]);
    s += cel(crys, {
      ...m,
      sx: 0, sy: 0, hx: 1.2, hy: 1.2, stroke: 2.4, shadeD: poly([[20, 5], [27, 12], [27, 28], [20, 35], [21.5, 20]]),
      over: (lit ? glow(20, 20, 10, '#ffffff', 0.95) : '') + line('M16 13V26', m.light, 1.3, 0.9),
    });
    s += sh(taper([[19, 38], [11, 31], [9.5, 19], [13, 9], [20, 3]], 3.4, 2), BARK, { stroke: 1.8, sx: 0.8, sy: 0, hx: 0.5, hy: 0 });
    s += sh(taper([[21, 38], [29, 31], [30.5, 19], [27, 9], [20, 3]], 3.4, 2), BARK, { stroke: 1.8, sx: 0.8, sy: 0, hx: 0.5, hy: 0 });
    s += sh(circle(20, 3.5, 2.6), BARK, { stroke: 1.6, sx: 0.6, sy: 0.6, hx: 0.5, hy: 0.5 });
    if (lit) s += sparkle(6, 12, 2.6, P.crystalTealLight) + sparkle(35, 20, 2.2, P.crystalTealLight) + sparkle(32, 5, 1.8, '#ffffff');
    return s;
  });
}

function flowerNode(opened: boolean): PartArt {
  return mk(opened ? 'prop.flowernode.open' : 'prop.flowernode', 70, 80, 'bc', () => {
    const STEM: Mat = { fill: '#6d7a45', shade: '#525c33', light: '#8b995c' };
    const OCH: Mat = { fill: P.sun, shade: P.sunDark, light: P.sunLight };
    let s = shadowEl(35, 78, 24, 3, 0.35);
    s += sh(smooth([[34, 78], [20, 71], [4, 69], [12, 60], [26, 64]]), STEM, { stroke: 2.4, sx: 1.5, sy: 2, hx: 1, hy: 1, over: line('M30 74L12 66', STEM.shade, 1.2) });
    s += sh(smooth([[36, 78], [50, 71], [66, 68], [58, 59], [44, 64]]), STEM, { stroke: 2.4, sx: 1.5, sy: 2, hx: 1, hy: 1, over: line('M40 74L58 65', STEM.shade, 1.2) });
    s += sh(taper([[35, 79], [34, 66], [36, 52]], 8, 6), STEM, { stroke: 2.6, sx: 2, sy: 0, hx: 1, hy: 0 });
    if (!opened) {
      s += glow(35, 30, 30, P.sunLight, 0.3);
      const tip = (d: string): string => fillPath(d, P.violet, 0.9);
      s += sh(smooth([[35, 56], [21, 47], [18, 30], [24, 14], [35, 3], [46, 14], [52, 30], [49, 47]]), OCH, {
        stroke: 2.8, sx: 3, sy: 2.5, hx: 1.5, hy: 1.5, inner: tip(ellipsePath(35, 2, 9, 12)),
      });
      s += sh(smooth([[35, 56], [22, 48], [19.5, 32], [25, 16], [35.5, 5], [31, 26], [33.5, 46]]), OCH, {
        stroke: 2.4, sx: 2, sy: 2, hx: 1.2, hy: 1.2, inner: tip(ellipsePath(30, 6, 7, 10)), over: line('M27 22Q25 34 29 46', OCH.shade, 1.2),
      });
      s += sh(smooth([[35, 56], [48, 48], [50.5, 32], [45, 16], [35.5, 6], [39, 26], [36.5, 46]]), { ...OCH, fill: P.sunDark, shade: '#8f6a2c' }, {
        stroke: 2.4, sx: 2, sy: 2, hx: 1.2, hy: 1.2, light: OCH.fill, inner: tip(ellipsePath(41, 7, 7, 10)),
      });
      s += sh(smooth([[35, 58], [25, 55], [20, 48], [30, 50]]), STEM, { stroke: 2, sx: 1, sy: 1 });
      s += sh(smooth([[35, 58], [45, 55], [50, 48], [40, 50]]), STEM, { stroke: 2, sx: 1, sy: 1 });
      s += line('M27 16L25 30M44 18L46 30', P.violet, 1.3, 0.7);
    } else {
      s += glow(35, 30, 34, P.sunLight, 0.5) + glow(35, 30, 16, P.vein, 0.4);
      const cx = 35;
      const cy = 30;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + 0.2;
        s += sh(petalD(cx, cy, a, 27, 14, 0.8), { ...OCH, fill: P.sunDark, shade: '#8f6a2c' }, { stroke: 2.2, sx: 1.5, sy: 1.5, hx: 1, hy: 1, light: OCH.fill });
      }
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 - 0.1;
        s += sh(petalD(cx, cy, a, 22, 13, 0.8), OCH, {
          stroke: 2.2, sx: 1.5, sy: 1.5, hx: 1, hy: 1, inner: fillPath(ellipsePath(cx, cy, 11, 9), P.violet),
          over: line(open([polar(cx, cy, 11, a), [cx + Math.cos(a) * 18, cy + Math.sin(a) * 18 * 0.8]]), OCH.shade, 1.1),
        });
      }
      s += sh(ellipsePath(cx, cy, 8.5, 7.5), { fill: P.violetDark, shade: '#4f2c7a', light: P.violet }, {
        stroke: 2.4, sx: 1.5, sy: 1.5, hx: 1, hy: 1,
        over: [0, 1, 2, 3, 4, 5, 6].map((i) => dot(...polar(cx, cy, i === 0 ? 0 : 4, (i / 6) * Math.PI * 2), 1.3, P.vein)).join(''),
      });
    }
    return s;
  });
}

function current(): PartArt {
  return mk('prop.current', 80, 40, 'bc', (rng) => {
    const WAT: Mat = { fill: '#62a0d4', shade: '#3f72a8', light: '#c6e8fa' };
    const FOAM: Mat = { fill: '#e6f4fb', shade: '#b7d6e8', light: '#ffffff' };
    let s = oglow(40, 28, 40, 16, '#8fd0f2', 0.5);
    for (const [x, y, r] of [[10, 30, 5], [22, 27.5, 5], [36, 26.5, 5], [50, 26.5, 5], [63, 27.5, 5], [73, 30.5, 5]] as const) {
      s += pebble(x, y, r, rng, NIGHT_STONE, 1.8);
    }
    s += sh(smooth([[12, 34], [17, 24], [25, 14], [33, 9], [40, 8], [47, 9], [55, 14], [63, 24], [68, 34]]), WAT, {
      stroke: 2.6, sx: 3.5, sy: 2, hx: 2, hy: 2,
      over: line('M30 30Q31 20 36 13M44 12Q47 20 46 30', WAT.light, 1.6, 0.85) + line('M38 28V18', '#ffffff', 1.2, 0.7) + dot(26, 26, 1.5, WAT.light) + dot(52, 22, 1.2, WAT.light),
    });
    // Water thrown up from the spout.
    for (const [x, y, r] of [[30, 5, 2.2], [40, 2.5, 2], [50, 5.5, 1.8], [23, 11, 1.6], [57, 12, 1.6]] as const) {
      s += sh(smooth([[x, y - r * 1.6], [x + r, y], [x, y + r], [x - r, y]]), WAT, { stroke: 1.4, sx: 0.6, sy: 0.6, hx: 0.5, hy: 0.5 });
    }
    const foam: SharpPt[] = [[8, 36, 1]];
    for (let x = 8; x <= 72; x += 8) foam.push([x + 4, 30.5 + (x % 16 ? 1 : 0)], [x + 8, 33]);
    foam.push([72, 37, 1]);
    s += sh(mixed(foam), FOAM, { stroke: 2, sx: 0, sy: 1.5, hx: 0, hy: 1 });
    for (const [x, y, r] of [[6, 36.5, 6], [20, 38, 6], [34, 39, 5.5], [48, 39, 6], [62, 38, 5.5], [75, 36, 5.5]] as const) {
      s += pebble(x, y, r, rng, NIGHT_STONE, 2);
    }
    return s;
  });
}

// ================================================================ export

export function propParts(): PartArt[] {
  return [
    bed(),
    blocks(),
    toyWhale(),
    marks(),
    fourteen(),
    windowProp(),
    chest(),
    toyHorse(),
    lamp(),
    rootDoor(false),
    rootDoor(true),
    fossil(),
    coil(),
    fossilRoot(),
    crystalCluster('prop.crystals.teal', CRYSTAL.teal, 'fish'),
    crystalCluster('prop.crystals.blue', CRYSTAL.blue, 'bird'),
    crystalCluster('prop.crystals.orange', CRYSTAL.orange, 'fish'),
    poisonPool(),
    crystalTree(false),
    crystalTree(true),
    star(),
    log(),
    memPool(),
    forestTree(),
    bush(),
    plate(false),
    plate(true),
    shrine(),
    stone(),
    knot(false),
    knot(true),
    river(),
    reflectPool(),
    dormBed(),
    station(),
    clock(),
    console_(),
    gear(),
    keyOutline(),
    lock(),
    officeDoor(false),
    officeDoor(true),
    bench(),
    coatRack(),
    table(),
    chair(),
    anchor(),
    site(),
    node(false),
    node(true),
    memory(),
    lantern(false),
    lantern(true),
    flowerNode(false),
    flowerNode(true),
    current(),
  ];
}
