import * as THREE from 'three';

// The torn front of a room's paper box: one paper wall across the whole
// front of the box, torn open in a single big ragged hole we look into the
// room through. What remains is a strip hanging from the top edge, an apron
// rising from the bottom edge and remnants at the two ends.
//
// The tear is laid out around a horizontal "skeleton" segment through the
// open area. Rays leave the skeleton (straight up and down along it, fanning
// out around its ends), never cross one another, and the tear sits at some
// distance R(t) along each ray, so the paper along ray t runs from R(t) out
// to the edge of the box. That makes every construction step safe:
//   - keepOpen: R(t) is never shorter than the far end of any (expanded)
//     keepOpen rectangle on the ray, so the hole contains them all;
//   - the tear: smooth multi-octave noise over t, small irregular jitter,
//     occasional bigger bites, a few hanging tongues and curling flaps;
//   - the curl: the paper bends toward the camera about a smooth hinge line
//     along each ray; since the bend is a smooth field over (t, distance),
//     the ragged tear only cuts it, and the surface stays smooth.
// The paper is a closed slab (outside face, inside face, the cut at the tear)
// so that it casts clean shadows from any side, with a thin alpha-tested
// ribbon of fibres along the tear at high quality. The pale fibrous band
// where the paper's layers tore unevenly is drawn in the slab's shader from
// each fragment's distance to the tear, so it stays fine at any zoom.
//
// Units: 1 = 1 game px, x right, y up (y = -game y), z toward the camera.
// The flat paper lies between z (inside face, where the box's walls end)
// and z + thickness; curls, flaps and fibres stay below z + 40.
//
// keepOpen is in the front's own plane. Seen from a camera at distance D
// from the actor plane, a point p of that plane shows through the front at
// c + (p - c) * (D - z) / D, c being the camera's centre; so the band to keep
// open is the actor-plane band mapped that way, spanned over the camera's
// range (its extreme positions suffice). The paper's textures are shared by
// every front of a quality and freed with the last one: build a room's
// front before disposing the previous one and they are made only once.

export interface TornFrontSpec {
  /** Box front extents in game px (y down): the front face spans x0..x1 and top..bottom. */
  x0: number;
  x1: number;
  top: number;
  bottom: number;
  /** Where the front face stands, in game px toward the camera from the actor plane (z = 0). */
  z: number;
  /** Game-px rectangles (y down) that must stay fully open: the walkable band plus headroom, close-up areas. */
  keepOpen: { x: number; y: number; w: number; h: number }[];
  /** The box's outside face, its inside face, and the paper's core showing at the tear. */
  outside: string;
  inside: string;
  core: string;
  seed: number;
  /** 'low' for weak phones: fewer vertices, no fibre ribbon. */
  quality?: 'low' | 'high';
  /** Clear space kept around every keepOpen rectangle, px (default 20; fibres reach 8 px into it). */
  margin?: number;
  /** How far past that clear space the tear runs where it is not torn further back, px (default 12). */
  clearance?: number;
  /** Paper thickness, px (default 5.5). */
  thickness?: number;
}

export interface TornFront {
  group: THREE.Group;
  dispose(): void;
  /** What was built, and how long it took. */
  stats?: { vertices: number; triangles: number; ms: number };
}

type TornColours = Pick<TornFrontSpec, 'outside' | 'inside' | 'core'>;

/**
 * Chapter I, sampled from the painting (p1-house-of-the-stranger.jpg): the
 * pink of the box's lid and sides, the lilac of its front, the cream of the
 * torn paper inside it.
 */
export const TORN_THEMES: { chapter1: TornColours } = {
  chapter1: { outside: '#f6caf3', inside: '#f4e3f6', core: '#f3e8d0' },
};

/**
 * A torn-paper set for any box colour: the outside is the colour kept
 * pastel, the inside a paler, cooler turn of it, the core a warm cream with
 * a breath of the box's hue.
 */
export function tornColorsFrom(boxColour: string): TornColours {
  const c = new THREE.Color();
  c.setStyle(boxColour, THREE.SRGBColorSpace);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl, THREE.SRGBColorSpace);
  const h = hsl.h * 360;
  const s = hsl.s;
  const l = hsl.l;
  const hex = (hh: number, ss: number, ll: number): string =>
    `#${new THREE.Color().setHSL(wrap(hh, 360) / 360, clamp(ss, 0, 1), clamp(ll, 0, 1), THREE.SRGBColorSpace).getHexString(THREE.SRGBColorSpace)}`;
  const grey = s < 0.06;
  // Outside: the box colour itself, kept in the pastel range.
  const outS = grey ? s : clamp(s, 0.35, 0.8);
  const outL = clamp(l, 0.78, 0.9);
  // Inside: turned up to 12 degrees toward lilac-blue, a little paler and softer.
  const toward = angleDelta(h, 262);
  const inH = h + clamp(toward, -12, 12);
  const inS = grey ? s : clamp(s * 0.72, 0.25, 0.62);
  const inL = clamp(outL + 0.045, 0.84, 0.94);
  // Core: cream, a breath of the way to the box's hue, never off warm cream.
  const coreH = clamp(42 + angleDelta(42, h) * (grey ? 0 : 0.1), 30, 50);
  return { outside: hex(h, outS, outL), inside: hex(inH, inS, inL), core: hex(coreH, 0.56, 0.885) };
}

// ---------------------------------------------------------------------------
// Tuning

interface Quality {
  /** Spacing of the fine design samples along the tear, px. */
  fine: number;
  /** Simplification tolerance of the tear outline, px. */
  eps: number;
  /** Turn of the outline at a ray above which its stretches are split, rad. */
  turn: number;
  /** Longest stretch of tear between two rays, px; within a flap. */
  maxSeg: number;
  flapSeg: number;
  /** Bend and distance per row of the curl, rad and px; rows per ray. */
  dPhi: number;
  dS: number;
  rowsMin: number;
  rowsMax: number;
  /** Paper grain texture size; with relief (bump); fibre ribbon. */
  grain: number;
  relief: boolean;
  ribbon: boolean;
}

const QUALITY: Record<'low' | 'high', Quality> = {
  high: { fine: 6, eps: 1.5, turn: 0.45, maxSeg: 44, flapSeg: 8, dPhi: 0.42, dS: 55, rowsMin: 2, rowsMax: 7, grain: 64, relief: true, ribbon: true },
  low: { fine: 6, eps: 3.4, turn: 0.9, maxSeg: 90, flapSeg: 16, dPhi: 1.2, dS: 200, rowsMin: 1, rowsMax: 3, grain: 32, relief: false, ribbon: false },
};

/** Everything stays within z .. z + Z_SPAN. */
const Z_SPAN = 40;
/** How far the fibres reach past the tear, px. */
const FIBRE_MAX = 8;
/** Flat paper kept along the box's edges, where the front is glued on, px. */
const ATTACH = 14;
/** Narrower than this along a ray, the paper is gone, px. */
const MIN_PAPER = 3;
/** The narrowest strip of paper the tear leaves along the box's edges, px. */
const STRIP = 22;
/** Most px between two points of the flat paper along the box's edges, and between spokes. */
const EDGE_STEP = 160;
const SPOKE = 220;
/** Texture scale: px per texture repeat. */
const TEX_PX = 256;
/** Tear-distance marks for the shader: the inside face, and the cut at the tear. */
const INSIDE = -1;
const CUT = -2;

// ---------------------------------------------------------------------------
// Small maths

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
/** i mod n for an integer i, fast within (-n, 2n). */
function wi(i: number, n: number): number {
  if (i < 0) return i + n >= 0 ? i + n : wrap(i, n);
  if (i >= n) return i - n < n ? i - n : wrap(i, n);
  return i;
}
function wrap(v: number, n: number): number {
  return ((v % n) + n) % n;
}
function angleDelta(from: number, to: number): number {
  return wrap(to - from + 180, 360) - 180;
}
/** Polynomial smooth minimum: never above min(a, b). */
function smin(a: number, b: number, k: number): number {
  return -smax(-a, -b, k);
}
/** Polynomial smooth maximum: never below max(a, b). */
function smax(a: number, b: number, k: number): number {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.max(a, b) + h * h * k * 0.25;
}

function rngFrom(seed: number): () => number {
  let a = (Math.imul((seed | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ 0x27d4eb2f) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth random curve over a loop of length `period` (Catmull-Rom through random knots), about -1..1. */
function loopNoise(rng: () => number, period: number, wavelength: number): (t: number) => number {
  const n = Math.max(3, Math.round(period / wavelength));
  const v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = rng() * 2 - 1;
  const cell = period / n;
  return (t) => {
    const x = t / cell;
    const i = Math.floor(x);
    const f = x - i;
    const p0 = v[wi(i - 1, n)]!;
    const p1 = v[wi(i, n)]!;
    const p2 = v[wi(i + 1, n)]!;
    const p3 = v[wi(i + 2, n)]!;
    const f2 = f * f;
    return 0.5 * (2 * p1 + (p2 - p0) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f2 + (3 * p1 - p0 - 3 * p2 + p3) * f2 * f);
  };
}

/** Sliding maximum over a loop, radius in samples (van Herk / Gil-Werman, linear time). */
function loopDilate(src: Float64Array, radius: number): Float64Array {
  const n = src.length;
  const out = new Float64Array(n);
  const w = 2 * radius + 1;
  const m = n + 2 * radius;
  const e = new Float64Array(m);
  for (let k = 0; k < m; k++) e[k] = src[wi(k - radius, n)]!;
  // Running maxima from the start and from the end of each block of w.
  const g = new Float64Array(m);
  const h = new Float64Array(m);
  for (let k = 0; k < m; k++) g[k] = k % w === 0 ? e[k]! : Math.max(g[k - 1]!, e[k]!);
  for (let k = m - 1; k >= 0; k--) h[k] = k % w === w - 1 || k === m - 1 ? e[k]! : Math.max(h[k + 1]!, e[k]!);
  for (let i = 0; i < n; i++) out[i] = Math.max(h[i]!, g[i + w - 1]!);
  return out;
}

/** Box blur over a loop, radius in samples; applied `passes` times it approaches a Gaussian. */
function loopBlur(src: Float64Array, radius: number, passes = 2): Float64Array {
  const n = src.length;
  let a = src;
  if (radius < 1) return Float64Array.from(src);
  for (let p = 0; p < passes; p++) {
    const out = new Float64Array(n);
    let sum = 0;
    for (let k = -radius; k <= radius; k++) sum += a[wi(k, n)]!;
    const w = 1 / (2 * radius + 1);
    for (let i = 0; i < n; i++) {
      out[i] = sum * w;
      sum += a[wi(i + radius + 1, n)]! - a[wi(i - radius, n)]!;
    }
    a = out;
  }
  return a;
}

// ---------------------------------------------------------------------------
// The tear, laid out in 2D (game px, y down)

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Rays out of a horizontal skeleton segment: up along it, around its right end, down, around its left end. */
class Stadium {
  readonly per: number;
  constructor(
    readonly sx0: number,
    readonly sx1: number,
    readonly cy: number,
    readonly rho: number,
  ) {
    this.per = 2 * (sx1 - sx0) + 2 * Math.PI * rho;
  }
  /** Origin and direction of ray t, into `o` as [ox, oy, dx, dy]. */
  at(t: number, o: Float64Array): void {
    const len = this.sx1 - this.sx0;
    const half = Math.PI * this.rho;
    let u = wrap(t, this.per);
    if (u < len) return set4(o, this.sx0 + u, this.cy, 0, -1);
    u -= len;
    if (u < half) {
      const a = -Math.PI / 2 + u / this.rho;
      return set4(o, this.sx1, this.cy, Math.cos(a), Math.sin(a));
    }
    u -= half;
    if (u < len) return set4(o, this.sx1 - u, this.cy, 0, 1);
    u -= len;
    const a = Math.PI / 2 + u / this.rho;
    return set4(o, this.sx0, this.cy, Math.cos(a), Math.sin(a));
  }
}

function set4(o: Float64Array, a: number, b: number, c: number, d: number): void {
  o[0] = a;
  o[1] = b;
  o[2] = c;
  o[3] = d;
}

/** Distance along a ray from inside `f` to its edge. */
function exitDistance(ox: number, oy: number, dx: number, dy: number, f: Box): number {
  let t = Infinity;
  if (dx > 1e-9) t = Math.min(t, (f.x1 - ox) / dx);
  else if (dx < -1e-9) t = Math.min(t, (f.x0 - ox) / dx);
  if (dy > 1e-9) t = Math.min(t, (f.y1 - oy) / dy);
  else if (dy < -1e-9) t = Math.min(t, (f.y0 - oy) / dy);
  return Math.max(0, t);
}

/** Where a ray leaves a rectangle it passes through, or -1. */
function farHit(ox: number, oy: number, dx: number, dy: number, r: Box): number {
  let lo = -Infinity;
  let hi = Infinity;
  if (Math.abs(dx) < 1e-9) {
    if (ox < r.x0 || ox > r.x1) return -1;
  } else {
    const a = (r.x0 - ox) / dx;
    const b = (r.x1 - ox) / dx;
    lo = Math.max(lo, Math.min(a, b));
    hi = Math.min(hi, Math.max(a, b));
  }
  if (Math.abs(dy) < 1e-9) {
    if (oy < r.y0 || oy > r.y1) return -1;
  } else {
    const a = (r.y0 - oy) / dy;
    const b = (r.y1 - oy) / dy;
    lo = Math.max(lo, Math.min(a, b));
    hi = Math.min(hi, Math.max(a, b));
  }
  if (hi < Math.max(lo, 0)) return -1;
  return hi;
}

interface Ray {
  /** Fine sample index. */
  j: number;
  ox: number;
  oy: number;
  dx: number;
  dy: number;
  /** Tear, hinge of the curl and box edge, as distances along the ray. */
  R: number;
  rh: number;
  rrect: number;
  /** Bend at the smooth tear, rad, over `dz` px. */
  theta: number;
  dz: number;
  /** Length along the tear, px. */
  arc: number;
  paper: boolean;
  /** In-plane normal of the tear, into the hole (game px, y down). */
  nx: number;
  ny: number;
  /** How far the fibres reach here, px. */
  fib: number;
}

interface Tear {
  f: Box;
  rays: Ray[];
  /** The fine tear outline (game px), for distances to it. */
  tx: Float64Array;
  ty: Float64Array;
  fine: number;
}

function layoutTear(spec: TornFrontSpec, q: Quality): Tear {
  const f: Box = {
    x0: Math.min(spec.x0, spec.x1),
    x1: Math.max(spec.x0, spec.x1),
    y0: Math.min(spec.top, spec.bottom),
    y1: Math.max(spec.top, spec.bottom),
  };
  const fw = f.x1 - f.x0;
  const fh = f.y1 - f.y0;
  const margin = Math.max(0, spec.margin ?? 20);
  const clearance = Math.max(0, spec.clearance ?? 12);
  const rng = rngFrom(spec.seed);

  let rects: Box[] = spec.keepOpen
    .filter((r) => r.w > 0 && r.h > 0)
    .map((r) => ({ x0: r.x - margin, y0: r.y - margin, x1: r.x + r.w + margin, y1: r.y + r.h + margin }));
  if (rects.length === 0) {
    // Nothing asked to stay open: a band through the lower middle of the front.
    rects = [{ x0: f.x0 + fw * 0.2, y0: f.y0 + fh * 0.38, x1: f.x1 - fw * 0.2, y1: f.y0 + fh * 0.78 }];
  }
  const b: Box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const r of rects) {
    b.x0 = Math.min(b.x0, r.x0);
    b.y0 = Math.min(b.y0, r.y0);
    b.x1 = Math.max(b.x1, r.x1);
    b.y1 = Math.max(b.y1, r.y1);
  }
  const hh = Math.max(24, (b.y1 - b.y0) / 2);
  const cy = clamp((b.y0 + b.y1) / 2, f.y0 + 1, f.y1 - 1);
  let sx0 = b.x0 + hh;
  let sx1 = b.x1 - hh;
  if (sx0 > sx1) sx0 = sx1 = (b.x0 + b.x1) / 2;
  sx0 = clamp(sx0, f.x0 + 1, f.x1 - 1);
  sx1 = clamp(sx1, f.x0 + 1, f.x1 - 1);
  const st = new Stadium(sx0, sx1, cy, hh);
  const per = st.per;

  // Fine samples along the loop of rays.
  const nf = Math.max(64, Math.ceil(per / q.fine));
  const dt = per / nf;
  const OX = new Float64Array(nf);
  const OY = new Float64Array(nf);
  const DX = new Float64Array(nf);
  const DY = new Float64Array(nf);
  const RR = new Float64Array(nf);
  const C = new Float64Array(nf);
  const o = new Float64Array(4);
  for (let j = 0; j < nf; j++) {
    st.at(j * dt, o);
    OX[j] = o[0]!;
    OY[j] = o[1]!;
    DX[j] = o[2]!;
    DY[j] = o[3]!;
    RR[j] = exitDistance(o[0]!, o[1]!, o[2]!, o[3]!, f);
    let c = 0;
    for (const r of rects) c = Math.max(c, farHit(o[0]!, o[1]!, o[2]!, o[3]!, r));
    C[j] = c;
  }
  const px = (v: number): number => Math.max(1, Math.round(v / dt));
  // The hard floor (a touch wider than the samples, so the outline between
  // two samples clears the rectangles too) and a smooth envelope over it.
  const Cd = loopDilate(C, 2);
  for (let j = 0; j < nf; j++) Cd[j]! += 0.75;
  const E = loopBlur(loopDilate(C, px(140)), px(55), 2);
  for (let j = 0; j < nf; j++) E[j] = Math.max(E[j]!, Cd[j]!);

  // The tear: the envelope, a little clearance, broad lobes torn further
  // back, a gentle wave (shallower where it would dip toward the envelope),
  // then small irregular jitter and occasional bites.
  const lobeA = loopNoise(rng, per, 820);
  const lobeB = loopNoise(rng, per, 330);
  const wave1 = loopNoise(rng, per, 150);
  const wave2 = loopNoise(rng, per, 66);
  const wave3 = loopNoise(rng, per, 29);
  const R = new Float64Array(nf);
  for (let j = 0; j < nf; j++) {
    const t = j * dt;
    const a = lobeA(t) - 0.1;
    const b = lobeB(t) - 0.15;
    const w = 8 * wave1(t) + 3.4 * wave2(t) + 1.4 * wave3(t);
    R[j] = E[j]! + clearance + 135 * (a > 0 ? a ** 1.5 : 0) + 48 * (b > 0 ? b ** 1.4 : 0) + (w > 0 ? w : w * 0.55);
  }
  /** Adds `fn(offset along the loop)` to `arr` within `reach` of `centre`. */
  const local = (arr: Float64Array, centre: number, reach: number, fn: (u: number) => number): void => {
    const j0 = Math.floor((centre - reach) / dt);
    const j1 = Math.ceil((centre + reach) / dt);
    for (let j = j0; j <= j1; j++) {
      const jj = wi(j, nf);
      let u = jj * dt - centre;
      u -= per * Math.round(u / per);
      if (Math.abs(u) <= reach) arr[jj]! += fn(u);
    }
  };
  // Small irregular jitter: little bumps of random width and height.
  for (let t = rng() * 20; t < per; t += 12 + rng() * 28) {
    const w = 4 + rng() * 10;
    const a = (rng() * 2 - 1) * (0.5 + rng() * 1.3);
    for (let j = Math.ceil((t - w) / dt); j * dt <= t + w; j++) {
      const k = 1 - ((j * dt - t) / w) ** 2;
      R[wi(j, nf)]! += a * k * k;
    }
  }
  // Occasional bigger bites out of the paper.
  for (let t = rng() * 400; t < per; t += 360 + rng() * 600) {
    const w = 20 + rng() * 55;
    // Never much deeper than wide: a bite, not a slit.
    const a = Math.min(18 + rng() * 48, w * 0.85);
    const skew = (rng() * 2 - 1) * 0.5;
    const lump = rng() * 6.3;
    local(R, t, w, (u) => {
      const x = u / w;
      return a * (1 - x * x) ** 2 * (1 + skew * x) * (0.85 + 0.15 * Math.sin(lump + x * 9));
    });
  }
  // Room left before the keepOpen floor, for the tongues and flaps to hang into.
  const slack = new Float64Array(nf);
  for (let j = 0; j < nf; j++) slack[j] = R[j]! - Cd[j]!;
  const minSlack = (centre: number, reach: number): number => {
    let m = Infinity;
    for (let j = Math.floor((centre - reach) / dt); j <= Math.ceil((centre + reach) / dt); j++) m = Math.min(m, slack[wi(j, nf)]!);
    return m;
  };
  const inPaper = (centre: number): boolean => {
    const j = wi(Math.round(centre / dt), nf);
    return R[j]! < RR[j]! - 40;
  };
  const busy: [number, number][] = [];
  const loopGap = (a: number, b: number): number => {
    const d = Math.abs(a - b) % per;
    return d > per / 2 ? per - d : d;
  };
  const free = (a: number, z: number): boolean => busy.every(([p, r]) => loopGap(a, p) > r + z);
  const keep: number[] = [];
  /** The spot near `t` with the most room for a piece `w` wide. */
  const roomiest = (t: number, w: number, search: number): [number, number] => {
    let best = t;
    let room = -Infinity;
    for (let u = t - search; u <= t + search; u += 12) {
      const r = minSlack(u, w);
      if (r > room && inPaper(u) && free(u, w)) {
        room = r;
        best = u;
      }
    }
    return [best, room];
  };
  // Flaps: broad pieces that curl out strongly, showing their inside.
  const flaps: { c: number; w: number; th: number; dz: number }[] = [];
  const flapMark = new Float64Array(nf);
  for (let t0 = 300 + rng() * 600; t0 < per - 150; t0 += 900 + rng() * 900) {
    const w = 40 + rng() * 34;
    const len = 12 + rng() * 18;
    const [t, r] = roomiest(t0, w, 200);
    const room = r - 8;
    if (room < 10) continue;
    const l = Math.min(len, room);
    local(R, t, w, (u) => -l * Math.max(0, 1 - (u / w) ** 2) ** 1.4);
    flaps.push({ c: t, w, th: 2.15 + rng() * 0.6, dz: 34 + rng() * 12 });
    local(flapMark, t, w * 1.3, () => 1);
    busy.push([t, w * 1.6]);
    keep.push(t);
  }
  // Tongues: narrow pieces hanging into the hole, where it was torn back.
  for (let t0 = 120 + rng() * 500; t0 < per - 60; t0 += 480 + rng() * 820) {
    const w = 12 + rng() * 16;
    const len = 40 + rng() * 80;
    const [t, r] = roomiest(t0, w, 170);
    const room = r - 6;
    if (room < 26) continue;
    const l = Math.min(len, room);
    const p = 1.4 + rng() * 0.9;
    const qq = 0.45 + rng() * 0.35;
    const lean = (rng() * 2 - 1) * 0.35;
    local(R, t, w, (u) => {
      const x = u / w - lean * (1 - (u / w) ** 2);
      return -l * Math.max(0, 1 - Math.abs(x) ** p) ** qq;
    });
    busy.push([t, w]);
    keep.push(t);
  }
  // Clamp to the keepOpen floor, softly, so the tear never flattens against
  // it; and keep it off the box's edges, where a sliver of paper would read
  // as a line: it stays STRIP px away, or runs out of the box where the
  // floor leaves no room for that.
  for (let j = 0; j < nf; j++) {
    const floor = Cd[j]! + 1;
    const limit = RR[j]! - STRIP;
    if (floor > limit) R[j] = Math.max(R[j]!, RR[j]!);
    else R[j] = Math.max(floor, Math.min(limit, smax(R[j]!, floor, 8), smin(R[j]!, limit, 10)));
    R[j] = Math.max(6, R[j]!);
  }

  // The curl: how much it bends and over how long, smooth along the tear.
  const bend = loopNoise(rng, per, 430);
  const reachN = loopNoise(rng, per, 520);
  const fibN = loopNoise(rng, per, 90);
  const TH = new Float64Array(nf);
  const DZ = new Float64Array(nf);
  for (let j = 0; j < nf; j++) {
    const t = j * dt;
    TH[j] = 0.74 * (0.95 + 0.6 * bend(t));
    DZ[j] = 52 + 14 * reachN(t);
  }
  for (const fl of flaps) {
    local(TH, fl.c, fl.w * 1.6, (u) => (fl.th - TH[wi(Math.round((fl.c + u) / dt), nf)]!) * Math.cos(((u / (fl.w * 1.6)) * Math.PI) / 2) ** 2);
    local(DZ, fl.c, fl.w * 1.6, (u) => (fl.dz - DZ[wi(Math.round((fl.c + u) / dt), nf)]!) * Math.cos(((u / (fl.w * 1.6)) * Math.PI) / 2) ** 2);
  }
  const Rc = new Float64Array(nf);
  for (let j = 0; j < nf; j++) Rc[j] = Math.min(R[j]!, RR[j]!);
  const Rs = loopBlur(Rc, px(7), 3);

  // The fine outline and its length.
  const TX = new Float64Array(nf);
  const TY = new Float64Array(nf);
  for (let j = 0; j < nf; j++) {
    TX[j] = OX[j]! + DX[j]! * R[j]!;
    TY[j] = OY[j]! + DY[j]! * R[j]!;
  }
  // Length along the outline, twice round so any stretch reads as a difference.
  const S2 = new Float64Array(2 * nf + 1);
  for (let k = 1; k <= 2 * nf; k++) {
    const a = wi(k - 1, nf);
    const b = wi(k, nf);
    const ex = TX[b]! - TX[a]!;
    const ey = TY[b]! - TY[a]!;
    S2[k] = S2[k - 1]! + Math.sqrt(ex * ex + ey * ey);
  }
  const S = S2.subarray(0, nf);
  const paper = (j: number): boolean => R[j]! < RR[j]! - MIN_PAPER;

  // Choose the rays: simplify the outline, keep transitions and features,
  // and never leave more than maxSeg (flapSeg in a flap) between two rays.
  const mark = new Uint8Array(nf);
  for (let j = 0; j < nf; j++) {
    const n = wi(j + 1, nf);
    if (paper(j) !== paper(n)) mark[j] = mark[n] = 1;
  }
  for (const t of keep) {
    // The tip of a tongue or the middle of a flap.
    const c = Math.round(t / dt);
    let best = c;
    for (let j = c - 12; j <= c + 12; j++) if (R[wi(j, nf)]! < R[wi(best, nf)]!) best = j;
    mark[wi(best, nf)] = 1;
  }
  let anchors: number[] = [];
  for (let j = 0; j < nf; j++) if (mark[j]) anchors.push(j);
  if (anchors.length < 2) {
    anchors = [0, nf >> 1];
    mark[0] = mark[nf >> 1] = 1;
  }
  const eps2 = q.eps * q.eps;
  for (let a = 0; a < anchors.length; a++) {
    const i0 = anchors[a]!;
    const i1 = a + 1 < anchors.length ? anchors[a + 1]! : anchors[0]! + nf;
    const stack: [number, number][] = [[i0, i1]];
    while (stack.length) {
      const [s0, s1] = stack.pop()!;
      if (s1 - s0 < 2) continue;
      const ax = TX[wi(s0, nf)]!;
      const ay = TY[wi(s0, nf)]!;
      const bx = TX[wi(s1, nf)]!;
      const by = TY[wi(s1, nf)]!;
      const vx = bx - ax;
      const vy = by - ay;
      const vv = vx * vx + vy * vy || 1e-9;
      let worst = -1;
      let wd = eps2;
      for (let k = s0 + 1; k < s1; k++) {
        const kk = wi(k, nf);
        const u = clamp(((TX[kk]! - ax) * vx + (TY[kk]! - ay) * vy) / vv, 0, 1);
        const d = (TX[kk]! - ax - u * vx) ** 2 + (TY[kk]! - ay - u * vy) ** 2;
        if (d > wd) {
          wd = d;
          worst = k;
        }
      }
      if (worst >= 0) {
        mark[wi(worst, nf)] = 1;
        stack.push([s0, worst], [worst, s1]);
      }
    }
  }
  // Round the bends: where the outline turns sharply, split its stretches.
  for (let pass = 0; pass < 2; pass++) {
    const list: number[] = [];
    for (let j = 0; j < nf; j++) if (mark[j]) list.push(j);
    const L = list.length;
    for (let c = 0; c < L; c++) {
      const a = list[(c + L - 1) % L]!;
      const b = list[c]!;
      const d = list[(c + 1) % L]!;
      const ux = TX[b]! - TX[a]!;
      const uy = TY[b]! - TY[a]!;
      const vx = TX[d]! - TX[b]!;
      const vy = TY[d]! - TY[b]!;
      const turn = Math.abs(Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy));
      if (turn < q.turn) continue;
      const gapAB = wi(b - a + nf, nf);
      const gapBD = wi(d - b + nf, nf);
      if (gapAB >= 3) mark[wi(a + (gapAB >> 1), nf)] = 1;
      if (gapBD >= 3) mark[wi(b + (gapBD >> 1), nf)] = 1;
    }
  }
  const chosen: number[] = [];
  for (let j = 0; j < nf; j++) if (mark[j]) chosen.push(j);
  const rays: number[] = [];
  for (let c = 0; c < chosen.length; c++) {
    const j0 = chosen[c]!;
    const j1 = c + 1 < chosen.length ? chosen[c + 1]! : chosen[0]! + nf;
    rays.push(j0);
    // Split long stretches evenly along the outline.
    const total = S2[j1]! - S2[j0]!;
    let flap = false;
    for (let k = j0; k <= j1 && !flap; k++) flap = flapMark[wi(k, nf)]! > 0;
    const lim = flap ? q.flapSeg : q.maxSeg;
    const parts = Math.ceil(total / lim);
    for (let p = 1, k = j0 + 1; p < parts && k < j1; k++) {
      if (S2[k]! - S2[j0]! >= (total * p) / parts) {
        rays.push(wi(k, nf));
        p++;
      }
    }
  }

  const out: Ray[] = rays.map((j) => {
    const prev = wi(j - 2, nf);
    const next = wi(j + 2, nf);
    let nx = -(TY[next]! - TY[prev]!);
    let ny = TX[next]! - TX[prev]!;
    const nl = Math.sqrt(nx * nx + ny * ny) || 1;
    nx /= nl;
    ny /= nl;
    if (nx * -DX[j]! + ny * -DY[j]! < 0) {
      nx = -nx;
      ny = -ny;
    }
    // Where a strip is too narrow for the whole curl, it curls over what it
    // has, keeping ATTACH px flat along the box's edge.
    const avail = RR[j]! - Rs[j]! - ATTACH;
    const dz0 = DZ[j]!;
    const dz = clamp(avail, 0, dz0);
    const theta = dz0 > 0 ? TH[j]! * (dz / dz0) : 0;
    const R0 = R[j]!;
    const rh = Math.max(R0, Math.min(Rs[j]! + dz, RR[j]! - ATTACH));
    return {
      j,
      ox: OX[j]!,
      oy: OY[j]!,
      dx: DX[j]!,
      dy: DY[j]!,
      R: R0,
      rh,
      rrect: RR[j]!,
      theta,
      dz: Math.max(dz, 1),
      arc: S[j]!,
      paper: paper(j),
      nx,
      ny,
      fib: 5.2 + 2.6 * (0.5 + 0.5 * fibN(j * dt)),
    };
  });
  return { f, rays: out, tx: TX, ty: TY, fine: dt };
}

// ---------------------------------------------------------------------------
// The curl along one ray

/** Bend angle at distance s from the hinge: growing to theta at the smooth tear, gently on past it (tongues). */
function bendAt(s: number, theta: number, dz: number): number {
  const u = s / dz;
  if (u <= 1) return theta * u * u;
  return Math.min(theta * (1 + 1.3 * (u - 1)), theta + 0.5);
}

interface Row {
  /** Distance from the hinge along the paper, px. */
  s: number;
  /** In-plane pull toward the hinge and lift toward the camera, px. */
  x: number;
  z: number;
  /** Bend of the paper here, rad. */
  phi: number;
}

/** Lift above which the curl eases off, and its ceiling. */
function liftCeiling(thick: number): number {
  return Z_SPAN - thick / 2 - FIBRE_MAX - 0.6;
}

/** Most integration steps along one ray, and scratch space for them. */
const CURL_STEPS = 24;
const CURL_S = new Float64Array(CURL_STEPS + 1);
const CURL_X = new Float64Array(CURL_STEPS + 1);
const CURL_Z = new Float64Array(CURL_STEPS + 1);
const CURL_P = new Float64Array(CURL_STEPS + 1);
const CURL_M = new Float64Array(CURL_STEPS + 1);

/** The bent profile of one ray from the hinge (s = 0) to the tear (s = sEdge), sampled in rows. */
function curlRows(sEdge: number, theta: number, dz: number, q: Quality, ceil: number): Row[] {
  if (sEdge <= 0.01) return [{ s: 0, x: 0, z: 0, phi: 0 }];
  const steps = clamp(Math.ceil(sEdge / 4), 6, CURL_STEPS);
  const h = sEdge / steps;
  const ss = CURL_S;
  const xs = CURL_X;
  const zs = CURL_Z;
  const ps = CURL_P;
  const ms = CURL_M;
  ss[0] = xs[0] = zs[0] = ps[0] = ms[0] = 0;
  const knee = ceil * 0.85;
  let x = 0;
  let z = 0;
  let c0 = 1;
  let s0 = 0;
  for (let k = 1; k <= steps; k++) {
    // Trapezoids along the bent paper.
    const p = bendAt(k * h, theta, dz);
    const c1 = Math.cos(p);
    const s1 = Math.sin(p);
    x += (c0 + c1) * 0.5 * h;
    z += (s0 + s1) * 0.5 * h;
    c0 = c1;
    s0 = s1;
    ss[k] = k * h;
    xs[k] = x;
    // Past the knee the lift eases toward the ceiling (long tongues hang).
    let slope = 1;
    if (z > knee) {
      const r = ceil - knee;
      const th = Math.tanh((z - knee) / r);
      zs[k] = knee + r * th;
      slope = 1 - th * th;
    } else zs[k] = z;
    ps[k] = slope === 1 ? p : Math.atan2(s1 * slope, c1);
    // Rows every dPhi of turn or dS of paper, whichever comes first.
    ms[k] = ms[k - 1]! + Math.abs(ps[k]! - ps[k - 1]!) / q.dPhi + h / q.dS;
  }
  const mEdge = ms[steps]!;
  const n = clamp(Math.ceil(mEdge), q.rowsMin, q.rowsMax);
  const rows: Row[] = [];
  let k = 0;
  for (let r = 0; r <= n; r++) {
    const target = (mEdge * r) / n;
    while (k < steps - 1 && ms[k + 1]! < target) k++;
    const span = ms[k + 1]! - ms[k]!;
    const w = r === n ? 1 : span > 1e-9 ? clamp((target - ms[k]!) / span, 0, 1) : 0;
    const lerp = (a: Float64Array): number => a[k]! + (a[k + 1]! - a[k]!) * w;
    rows.push(r === 0 ? { s: 0, x: 0, z: 0, phi: 0 } : { s: lerp(ss), x: lerp(xs), z: lerp(zs), phi: lerp(ps) });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Mesh

interface Built {
  slab: THREE.BufferGeometry;
  ribbon: THREE.BufferGeometry | null;
}

/** Growing vertex and index buffers of the paper slab. */
class Buffers {
  pos = new Float32Array(3 * 4096);
  col = new Float32Array(3 * 4096);
  uv = new Float32Array(2 * 4096);
  torn = new Float32Array(2 * 4096);
  /** Flat (unbent) position of each vertex, local xy, to orient triangles. */
  flat = new Float32Array(2 * 4096);
  idx = new Uint32Array(3 * 8192);
  count = 0;
  tris = 0;
  add(x: number, y: number, z: number, c: THREE.Color, u: number, v: number, s: number, d: number, fx: number, fy: number): number {
    const i = this.count;
    if (i * 3 + 3 > this.pos.length) {
      const grow = <T extends Float32Array>(a: T): T => {
        const b = new Float32Array(a.length * 2) as T;
        b.set(a);
        return b;
      };
      this.pos = grow(this.pos);
      this.col = grow(this.col);
      this.uv = grow(this.uv);
      this.torn = grow(this.torn);
      this.flat = grow(this.flat);
    }
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = z;
    this.col[i * 3] = c.r;
    this.col[i * 3 + 1] = c.g;
    this.col[i * 3 + 2] = c.b;
    this.uv[i * 2] = u;
    this.uv[i * 2 + 1] = v;
    this.torn[i * 2] = s;
    this.torn[i * 2 + 1] = d;
    this.flat[i * 2] = fx;
    this.flat[i * 2 + 1] = fy;
    this.count++;
    return i;
  }
  push(a: number, b: number, c: number): void {
    if (this.tris * 3 + 3 > this.idx.length) {
      const bigger = new Uint32Array(this.idx.length * 2);
      bigger.set(this.idx);
      this.idx = bigger;
    }
    this.idx[this.tris * 3] = a;
    this.idx[this.tris * 3 + 1] = b;
    this.idx[this.tris * 3 + 2] = c;
    this.tris++;
  }
  /** A triangle facing +z (sign 1) or -z (sign -1) in the flat layout. */
  tri(a: number, b: number, c: number, sign: number): void {
    const f = this.flat;
    const area = (f[b * 2]! - f[a * 2]!) * (f[c * 2 + 1]! - f[a * 2 + 1]!) - (f[c * 2]! - f[a * 2]!) * (f[b * 2 + 1]! - f[a * 2 + 1]!);
    if (area * sign >= 0) this.push(a, b, c);
    else this.push(a, c, b);
  }
  geometry(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    const n = this.count;
    const pos = this.pos.slice(0, n * 3);
    const idx = this.idx.subarray(0, this.tris * 3);
    // Smooth normals, each triangle weighted by its area.
    const nrm = new Float32Array(n * 3);
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i]! * 3;
      const b = idx[i + 1]! * 3;
      const c = idx[i + 2]! * 3;
      const ux = pos[b]! - pos[a]!;
      const uy = pos[b + 1]! - pos[a + 1]!;
      const uz = pos[b + 2]! - pos[a + 2]!;
      const vx = pos[c]! - pos[a]!;
      const vy = pos[c + 1]! - pos[a + 1]!;
      const vz = pos[c + 2]! - pos[a + 2]!;
      const nx = uy * vz - uz * vy;
      const ny = uz * vx - ux * vz;
      const nz = ux * vy - uy * vx;
      nrm[a]! += nx;
      nrm[a + 1]! += ny;
      nrm[a + 2]! += nz;
      nrm[b]! += nx;
      nrm[b + 1]! += ny;
      nrm[b + 2]! += nz;
      nrm[c]! += nx;
      nrm[c + 1]! += ny;
      nrm[c + 2]! += nz;
    }
    const box = new THREE.Box3();
    for (let i = 0; i < n * 3; i += 3) {
      const l = Math.sqrt(nrm[i]! * nrm[i]! + nrm[i + 1]! * nrm[i + 1]! + nrm[i + 2]! * nrm[i + 2]!);
      if (l > 0) {
        nrm[i]! /= l;
        nrm[i + 1]! /= l;
        nrm[i + 2]! /= l;
      } else nrm[i + 2] = 1;
      const x = pos[i]!;
      const y = pos[i + 1]!;
      const z = pos[i + 2]!;
      if (x < box.min.x) box.min.x = x;
      if (y < box.min.y) box.min.y = y;
      if (z < box.min.z) box.min.z = z;
      if (x > box.max.x) box.max.x = x;
      if (y > box.max.y) box.max.y = y;
      if (z > box.max.z) box.max.z = z;
    }
    g.boundingBox = box;
    g.boundingSphere = box.getBoundingSphere(new THREE.Sphere());
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    g.setAttribute('color', new THREE.BufferAttribute(this.col.slice(0, n * 3), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(this.uv.slice(0, n * 2), 2));
    g.setAttribute('torn', new THREE.BufferAttribute(this.torn.slice(0, n * 2), 2));
    g.setIndex(new THREE.BufferAttribute(n < 65536 ? Uint16Array.from(idx) : idx.slice(), 1));
    return g;
  }
}

interface Column {
  /** Outside and inside face vertices from the tear (0) to the hinge (last), and where each sits from 0 to 1. */
  out: number[];
  inn: number[];
  lamOut: number[];
  lamIn: number[];
  cutOut: number;
  cutIn: number;
  ribIn: number;
  ribOut: number;
  /** Hinge, local xy. */
  hx: number;
  hy: number;
  /** Out of the tear: the paper's direction there (local). */
  tx: number;
  ty: number;
  tz: number;
}

function buildMeshes(spec: TornFrontSpec, tear: Tear, q: Quality, colours: { outside: THREE.Color; inside: THREE.Color; core: THREE.Color }): Built {
  const thick = clamp(spec.thickness ?? 5.5, 2, 12);
  const z0 = spec.z;
  const ceil = liftCeiling(thick);
  const { f, rays, tx: TX, ty: TY } = tear;
  const nfine = TX.length;
  const B = new Buffers();
  const rib = { pos: [] as number[], nrm: [] as number[], uv: [] as number[], idx: [] as number[] };

  /** Distance from a flat point (game px) to the fine outline near sample j. */
  const reach = Math.ceil(20 / tear.fine) + 1;
  const distToTear = (x: number, y: number, j: number): number => {
    let best = Infinity;
    for (let k = j - reach; k < j + reach; k++) {
      const a = wi(k, nfine);
      const c = wi(k + 1, nfine);
      const ax = TX[a]!;
      const ay = TY[a]!;
      const vx = TX[c]! - ax;
      const vy = TY[c]! - ay;
      const vv = vx * vx + vy * vy || 1e-9;
      const u = clamp(((x - ax) * vx + (y - ay) * vy) / vv, 0, 1);
      const d = (x - ax - u * vx) ** 2 + (y - ay - u * vy) ** 2;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  };

  // Columns: one per ray with paper.
  const cols: (Column | null)[] = rays.map((r) => {
    if (!r.paper) return null;
    const sEdge = Math.max(0, r.rh - r.R);
    const rows = curlRows(sEdge, r.theta, r.dz, q, ceil);
    const out: number[] = [];
    const inn: number[] = [];
    const lamOut: number[] = [];
    const lamIn: number[] = [];
    // The inside face, seldom seen but for flaps, keeps every other row
    // (always the tear and the hinge) where the curl is gentle.
    const last = rows.length - 1;
    const allInside = last <= 2 || r.theta > 1.3;
    // Local in-plane direction of the ray (y up).
    const dlx = r.dx;
    const dly = -r.dy;
    let edge = { px: 0, py: 0, pz: 0, nx: 0, ny: 0, nz: 1, phi: 0 };
    for (let k = rows.length - 1; k >= 0; k--) {
      const row = rows[k]!;
      // Flat (material) position: this far from the hinge toward the tear.
      const fr = r.rh - row.s;
      const fgx = r.ox + r.dx * fr;
      const fgy = r.oy + r.dy * fr;
      // Bent position of the inside face.
      const br = r.rh - row.x;
      const x = r.ox + r.dx * br;
      const y = -(r.oy + r.dy * br);
      const z = z0 + row.z;
      const sn = Math.sin(row.phi);
      const cs = Math.cos(row.phi);
      const nx = dlx * sn;
      const ny = dly * sn;
      const nz = cs;
      const fromTear = sEdge - row.s;
      // Distance to the tear, for the pale band: measured near it, along the
      // paper further in (it only has to rise steadily there).
      const d = fromTear < 0.01 ? 0 : fromTear < 14 ? distToTear(fgx, fgy, r.j) : fromTear;
      const u = fgx / TEX_PX;
      const v = -fgy / TEX_PX;
      const lam = sEdge > 0 ? 1 - row.s / sEdge : 0;
      out.push(B.add(x + nx * thick, y + ny * thick, z + nz * thick, colours.outside, u, v, r.arc, d, fgx, -fgy));
      lamOut.push(lam);
      if (allInside || k === 0 || k === last || k % 2 === 0) {
        inn.push(B.add(x, y, z, colours.inside, u, v, r.arc, INSIDE, fgx, -fgy));
        lamIn.push(lam);
      }
      if (k === rows.length - 1) edge = { px: x, py: y, pz: z, nx, ny, nz, phi: row.phi };
    }
    // Out of the tear, along the paper: the tear's normal, bent like the paper.
    const cph = Math.cos(edge.phi);
    const sph = Math.sin(edge.phi);
    const tx = r.nx * cph;
    const ty = -r.ny * cph;
    const tz = sph;
    const cutOut = B.add(edge.px + edge.nx * thick, edge.py + edge.ny * thick, edge.pz + edge.nz * thick, colours.core, r.arc / TEX_PX, thick / TEX_PX, r.arc, CUT, 0, 0);
    const cutIn = B.add(edge.px, edge.py, edge.pz, colours.core, r.arc / TEX_PX, 0, r.arc, CUT, 0, 0);
    let ribIn = -1;
    let ribOut = -1;
    if (q.ribbon) {
      // Rooted in the pale band on the outside face, reaching out over the
      // cut and a little toward the camera: the band's fringe of fibres.
      const mx = edge.px + edge.nx * (thick - 0.4);
      const my = edge.py + edge.ny * (thick - 0.4);
      const mz = edge.pz + edge.nz * (thick - 0.4);
      let fx = tx + edge.nx * 0.3;
      let fy = ty + edge.ny * 0.3;
      let fz = tz + edge.nz * 0.3;
      const fl = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
      fx *= fl;
      fy *= fl;
      fz *= fl;
      ribIn = rib.pos.length / 3;
      rib.pos.push(mx - tx * 1.6, my - ty * 1.6, mz - tz * 1.6, mx + fx * r.fib, my + fy * r.fib, mz + fz * r.fib);
      rib.nrm.push(edge.nx, edge.ny, edge.nz, edge.nx, edge.ny, edge.nz);
      rib.uv.push(r.arc / TEX_PX, 0, r.arc / TEX_PX, 1);
      ribOut = ribIn + 1;
    }
    return {
      out,
      inn,
      lamOut,
      lamIn,
      cutOut,
      cutIn,
      ribIn,
      ribOut,
      hx: r.ox + r.dx * r.rh,
      hy: -(r.oy + r.dy * r.rh),
      tx,
      ty,
      tz,
    };
  });

  // Faces between neighbouring columns: zip their rows together.
  const zip = (a: number[], la: number[], b: number[], lb: number[], sign: number): void => {
    let i = 0;
    let j = 0;
    while (i < a.length - 1 || j < b.length - 1) {
      if (j >= b.length - 1 || (i < a.length - 1 && la[i + 1]! <= lb[j + 1]!)) {
        B.tri(a[i]!, a[i + 1]!, b[j]!, sign);
        i++;
      } else {
        B.tri(a[i]!, b[j + 1]!, b[j]!, sign);
        j++;
      }
    }
  };
  const cutQuad = (a0: number, a1: number, b0: number, b1: number, ex: number, ey: number, ez: number): void => {
    // a0, b0 outside; a1, b1 inside. Face out of the tear (ex, ey, ez).
    const p = B.pos;
    const nx = (p[b0 * 3 + 1]! - p[a0 * 3 + 1]!) * (p[a1 * 3 + 2]! - p[a0 * 3 + 2]!) - (p[b0 * 3 + 2]! - p[a0 * 3 + 2]!) * (p[a1 * 3 + 1]! - p[a0 * 3 + 1]!);
    const ny = (p[b0 * 3 + 2]! - p[a0 * 3 + 2]!) * (p[a1 * 3]! - p[a0 * 3]!) - (p[b0 * 3]! - p[a0 * 3]!) * (p[a1 * 3 + 2]! - p[a0 * 3 + 2]!);
    const nz = (p[b0 * 3]! - p[a0 * 3]!) * (p[a1 * 3 + 1]! - p[a0 * 3 + 1]!) - (p[b0 * 3 + 1]! - p[a0 * 3 + 1]!) * (p[a1 * 3]! - p[a0 * 3]!);
    if (nx * ex + ny * ey + nz * ez >= 0) {
      B.push(a0, b0, a1);
      B.push(b0, b1, a1);
    } else {
      B.push(a0, a1, b0);
      B.push(b0, a1, b1);
    }
  };

  /** Where the tear leaves the box between ray a (paper) and ray b (none): a point on the box's edge. */
  const crossing = (a: Ray, b: Ray): [number, number] => {
    const ax = a.ox + a.dx * a.R;
    const ay = a.oy + a.dy * a.R;
    const bx = b.ox + b.dx * b.R;
    const by = b.oy + b.dy * b.R;
    const inside = bx > f.x0 && bx < f.x1 && by > f.y0 && by < f.y1;
    if (inside) return [b.ox + b.dx * b.rrect, b.oy + b.dy * b.rrect];
    const t = exitDistance(ax, ay, bx - ax, by - ay, f);
    return [ax + (bx - ax) * Math.min(1, t), ay + (by - ay) * Math.min(1, t)];
  };
  interface Cross {
    x: number;
    y: number;
    out: number;
    inn: number;
    cutOut: number;
    cutIn: number;
  }
  const makeCross = (gx: number, gy: number, r: Ray): Cross => {
    const x = gx;
    const y = -gy;
    const u = gx / TEX_PX;
    const v = -gy / TEX_PX;
    return {
      x,
      y,
      out: B.add(x, y, z0 + thick, colours.outside, u, v, r.arc, 0, x, y),
      inn: B.add(x, y, z0, colours.inside, u, v, r.arc, INSIDE, x, y),
      cutOut: B.add(x, y, z0 + thick, colours.core, r.arc / TEX_PX, thick / TEX_PX, r.arc, CUT, 0, 0),
      cutIn: B.add(x, y, z0, colours.core, r.arc / TEX_PX, 0, r.arc, CUT, 0, 0),
    };
  };

  const n = rays.length;
  const starts = new Map<number, Cross>();
  const ends = new Map<number, Cross>();
  for (let i = 0; i < n; i++) {
    const k = (i + 1) % n;
    const a = cols[i];
    const b = cols[k];
    if (a && b) {
      zip(a.out, a.lamOut, b.out, b.lamOut, 1);
      zip(a.inn, a.lamIn, b.inn, b.lamIn, -1);
      cutQuad(a.cutOut, a.cutIn, b.cutOut, b.cutIn, a.tx + b.tx, a.ty + b.ty, a.tz + b.tz);
      if (q.ribbon) rib.idx.push(a.ribIn, a.ribOut, b.ribOut, a.ribIn, b.ribOut, b.ribIn);
    } else if (a) {
      const [gx, gy] = crossing(rays[i]!, rays[k]!);
      const c = makeCross(gx, gy, rays[i]!);
      zip(a.out, a.lamOut, [c.out], [0], 1);
      zip(a.inn, a.lamIn, [c.inn], [0], -1);
      cutQuad(a.cutOut, a.cutIn, c.cutOut, c.cutIn, a.tx, a.ty, a.tz);
      ends.set(i, c);
    } else if (b) {
      const [gx, gy] = crossing(rays[k]!, rays[i]!);
      const c = makeCross(gx, gy, rays[k]!);
      zip([c.out], [0], b.out, b.lamOut, 1);
      zip([c.inn], [0], b.inn, b.lamIn, -1);
      cutQuad(c.cutOut, c.cutIn, b.cutOut, b.cutIn, b.tx, b.ty, b.tz);
      starts.set(k, c);
    }
  }

  // The flat paper between the hinges and the box's edges.
  const W = f.x1 - f.x0;
  const H = f.y1 - f.y0;
  const perim = W * 2 + H * 2;
  const cornerP = [0, W, W + H, 2 * W + H];
  /** The point of the box's edge at `p` along it, clockwise from the top left corner. */
  const perimPoint = (p: number): [number, number] => {
    const q = wrap(p, perim);
    if (q < W) return [f.x0 + q, f.y0];
    if (q < W + H) return [f.x1, f.y0 + q - W];
    if (q < 2 * W + H) return [f.x1 - (q - W - H), f.y1];
    return [f.x0, f.y1 - (q - 2 * W - H)];
  };
  /**
   * The box's edge from `from` back (counter-clockwise) over `span` px, its
   * corners and points every EDGE_STEP px between, ends excluded: the flat
   * paper's triangles stay short instead of spanning the whole box.
   */
  const edgeBack = (from: number, span: number): [number, number][] => {
    const at: number[] = [];
    for (const c of cornerP) {
      const d = wrap(from - c, perim);
      if (d > 0.5 && d < span - 0.5) at.push(d);
    }
    const steps = Math.ceil(span / EDGE_STEP);
    for (let i = 1; i < steps; i++) {
      const d = (span * i) / steps;
      if (at.every((c) => Math.abs(c - d) > EDGE_STEP * 0.25)) at.push(d);
    }
    return at.sort((a, b) => a - b).map((d) => perimPoint(from - d));
  };
  const perimOf = (gx: number, gy: number): number => {
    const dT = Math.abs(gy - f.y0);
    const dR = Math.abs(gx - f.x1);
    const dB = Math.abs(gy - f.y1);
    const dL = Math.abs(gx - f.x0);
    const m = Math.min(dT, dR, dB, dL);
    if (m === dT) return clamp(gx - f.x0, 0, W);
    if (m === dR) return W + clamp(gy - f.y0, 0, H);
    if (m === dB) return W + H + clamp(f.x1 - gx, 0, W);
    return 2 * W + H + clamp(f.y1 - gy, 0, H);
  };
  const cornerVerts = (gx: number, gy: number): [number, number] => {
    const u = gx / TEX_PX;
    const v = -gy / TEX_PX;
    return [B.add(gx, -gy, z0 + thick, colours.outside, u, v, 0, 99, gx, -gy), B.add(gx, -gy, z0, colours.inside, u, v, 0, INSIDE, gx, -gy)];
  };
  /** Triangulates a flat polygon of the paper, on both faces. */
  const flatFill = (pts: THREE.Vector2[], outIdx: number[], innIdx: number[]): void => {
    for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(pts, []) as [number, number, number][]) {
      B.tri(outIdx[a]!, outIdx[b]!, outIdx[c]!, 1);
      B.tri(innIdx[a]!, innIdx[b]!, innIdx[c]!, -1);
    }
  };
  // The flat paper between the hinges and the box's edge, cut into sectors
  // by spokes along some of the rays (a ray never crosses the hinge line
  // nor another ray), so that each sector triangulates into short triangles.
  interface Anchor {
    x: number;
    y: number;
    out: number;
    inn: number;
    /** Where it lies along the box's edge (edge points only). */
    p: number;
  }
  const edgeAnchor = (gx: number, gy: number): Anchor => {
    const [out, inn] = cornerVerts(gx, gy);
    return { x: gx, y: -gy, out, inn, p: perimOf(gx, gy) };
  };
  const hinge = (i: number): Anchor => {
    const c = cols[i]!;
    return { x: c.hx, y: c.hy, out: c.out[c.out.length - 1]!, inn: c.inn[c.inn.length - 1]!, p: 0 };
  };
  const spokeEnd = (i: number): Anchor => {
    const r = rays[i]!;
    return edgeAnchor(r.ox + r.dx * r.rrect, r.oy + r.dy * r.rrect);
  };
  /** One sector: from `from` on the box's edge along the hinges to `to`, and back along the edge. */
  const sector = (from: Anchor, chain: Anchor[], to: Anchor): void => {
    const poly = [from, ...chain, to];
    for (const [gx, gy] of edgeBack(to.p, wrap(to.p - from.p, perim))) poly.push(edgeAnchor(gx, gy));
    flatFill(
      poly.map((a) => new THREE.Vector2(a.x, a.y)),
      poly.map((a) => a.out),
      poly.map((a) => a.inn),
    );
  };
  /** Rays along a run of paper where a spoke goes: every SPOKE px of the box's edge. */
  const spokes = (run: number[]): Set<number> => {
    const at = new Set<number>();
    let acc = 0;
    let last = -1;
    for (const i of run) {
      const r = rays[i]!;
      const pNow = perimOf(r.ox + r.dx * r.rrect, r.oy + r.dy * r.rrect);
      if (last >= 0) acc += wrap(pNow - last, perim);
      last = pNow;
      if (acc >= SPOKE) {
        at.add(i);
        acc = 0;
      }
    }
    return at;
  };
  if (cols.every((c) => c) && n > 0) {
    // A ring of paper all round the hole: at least three sectors.
    const all = [...Array(n).keys()];
    let at = [...spokes(all)].sort((a, b) => a - b);
    if (at.length < 3) at = [0, Math.floor(n / 3), Math.floor((2 * n) / 3)];
    const ends = at.map(spokeEnd);
    for (let k = 0; k < at.length; k++) {
      const a = at[k]!;
      const b = at[(k + 1) % at.length]!;
      const chain: Anchor[] = [];
      for (let i = a; ; i = (i + 1) % n) {
        chain.push(hinge(i));
        if (i === b) break;
      }
      sector(ends[k]!, chain, ends[(k + 1) % at.length]!);
    }
  } else {
    // Pieces: each run of rays with paper, from where the tear leaves the box
    // to where it comes back.
    for (const [si, s] of starts) {
      const run: number[] = [];
      let e: Cross | undefined;
      for (let i = si, guard = 0; guard <= n; guard++, i = (i + 1) % n) {
        run.push(i);
        e = ends.get(i);
        if (e) break;
      }
      if (!e) continue;
      const at = spokes(run);
      let from: Anchor = { x: s.x, y: s.y, out: s.out, inn: s.inn, p: perimOf(s.x, -s.y) };
      let chain: Anchor[] = [];
      for (const i of run) {
        chain.push(hinge(i));
        if (at.has(i) && i !== run[run.length - 1]) {
          const to = spokeEnd(i);
          sector(from, chain, to);
          from = to;
          chain = [hinge(i)];
        }
      }
      sector(from, chain, { x: e.x, y: e.y, out: e.out, inn: e.inn, p: perimOf(e.x, -e.y) });
    }
  }

  const slab = B.geometry();
  let ribbon: THREE.BufferGeometry | null = null;
  if (q.ribbon && rib.idx.length) {
    ribbon = new THREE.BufferGeometry();
    ribbon.setAttribute('position', new THREE.Float32BufferAttribute(rib.pos, 3));
    ribbon.setAttribute('normal', new THREE.Float32BufferAttribute(rib.nrm, 3));
    ribbon.setAttribute('uv', new THREE.Float32BufferAttribute(rib.uv, 2));
    ribbon.setIndex(rib.idx);
    ribbon.boundingBox = new THREE.Box3().setFromArray(rib.pos);
    ribbon.boundingSphere = ribbon.boundingBox.getBoundingSphere(new THREE.Sphere());
  }
  return { slab, ribbon };
}

// ---------------------------------------------------------------------------
// Textures (plain data, so they build anywhere). They do not depend on the
// seed, so every torn front of a quality shares one set; the last dispose()
// frees it.

interface PaperTextures {
  /** Grain: a colour multiplier, and the relief of the paper at high quality. */
  map: THREE.DataTexture;
  fibres: THREE.DataTexture | null;
  users: number;
}

const shared: { low?: PaperTextures; high?: PaperTextures } = {};

function acquireTextures(quality: 'low' | 'high', q: Quality): PaperTextures {
  let t = shared[quality];
  if (!t) {
    // The grain tiles every 128 px (at high quality a texel per 2 px: soft).
    const map = paperGrain(q.grain, rngFrom(0x7e4a));
    map.repeat.set(TEX_PX / 128, TEX_PX / 128);
    t = { map, fibres: q.ribbon ? fibreTexture(rngFrom(0x51b3)) : null, users: 0 };
    shared[quality] = t;
  }
  t.users++;
  return t;
}

function releaseTextures(quality: 'low' | 'high'): void {
  const t = shared[quality];
  if (!t || --t.users > 0) return;
  t.map.dispose();
  t.fibres?.dispose();
  delete shared[quality];
}

function dataTexture(data: Uint8Array, w: number, h: number): THREE.DataTexture {
  const t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 4;
  t.colorSpace = THREE.NoColorSpace;
  t.needsUpdate = true;
  return t;
}

/** Soft paper: cloudy mottling and short fibres pressed in, as a grey level (1 = plain paper). */
function paperGrain(size: number, rng: () => number): THREE.DataTexture {
  // Value noise summed coarse to fine: each level is the one before, doubled
  // in size (bilinear, wrapping round: weights 1/4 and 3/4 either side), plus
  // fresh noise. The noise comes from an inline mulberry32 stream.
  let cur = new Float32Array(4);
  let cs = 2;
  for (let i = 0; i < 4; i++) cur[i] = rng() * 0.3;
  let hs = (rng() * 4294967296) | 0;
  const amps = [0.3, 0.26, 0.2, 0.14, 0.09, 0.05, 0.03];
  for (let level = 1; cs < size; level++) {
    const ns = cs * 2;
    const amp = amps[Math.min(level, amps.length - 1)]!;
    const rows = new Float32Array(ns * cs);
    for (let y = 0; y < cs; y++) {
      const src = y * cs;
      const dst = y * ns;
      for (let i = 0; i < cs; i++) {
        const c = cur[src + i]!;
        rows[dst + 2 * i] = 0.25 * cur[src + ((i + cs - 1) % cs)]! + 0.75 * c;
        rows[dst + 2 * i + 1] = 0.75 * c + 0.25 * cur[src + ((i + 1) % cs)]!;
      }
    }
    const next = new Float32Array(ns * ns);
    for (let j = 0; j < cs; j++) {
      const up = ((j + cs - 1) % cs) * ns;
      const mid = j * ns;
      const dn = ((j + 1) % cs) * ns;
      const o0 = 2 * j * ns;
      const o1 = o0 + ns;
      for (let x = 0; x < ns; x++) {
        const b = rows[mid + x]!;
        hs = (hs + 0x6d2b79f5) | 0;
        let t = Math.imul(hs ^ (hs >>> 15), 1 | hs);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        const r0 = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        hs = (hs + 0x6d2b79f5) | 0;
        t = Math.imul(hs ^ (hs >>> 15), 1 | hs);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        const r1 = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        next[o0 + x] = 0.25 * rows[up + x]! + 0.75 * b + (r0 - 0.5) * amp;
        next[o1 + x] = 0.75 * b + 0.25 * rows[dn + x]! + (r1 - 0.5) * amp;
      }
    }
    cur = next;
    cs = ns;
  }
  const n = size * size;
  const h = cur;
  // Short fibres pressed into the sheet.
  const fib = new Float32Array(n);
  const count = Math.round(n / 160);
  for (let i = 0; i < count; i++) {
    const cx = rng() * size;
    const cy = rng() * size;
    const a = rng() * Math.PI;
    const len = 2 + rng() * 5;
    const val = (rng() < 0.5 ? -1 : 1) * (0.08 + rng() * 0.16);
    const ca = Math.cos(a) * 0.5;
    const sa = Math.sin(a) * 0.5;
    for (let s = -len; s <= len; s += 1) fib[wrap(Math.round(cy + sa * s), size) * size + wrap(Math.round(cx + ca * s), size)] = val;
  }
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i < n; i++) {
    if (h[i]! < lo) lo = h[i]!;
    if (h[i]! > hi) hi = h[i]!;
  }
  const inv = 1 / (hi - lo || 1);
  const map = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    const v = (h[i]! - lo) * inv;
    const fv = fib[i]!;
    const lum = clamp(1 - 0.07 * v - (fv < 0 ? -0.05 * fv : 0.03 * fv), 0, 1);
    map[i * 4] = map[i * 4 + 1] = (lum * 255 + 0.5) | 0;
    map[i * 4 + 2] = (lum * 0.995 * 255 + 0.5) | 0;
    map[i * 4 + 3] = 255;
  }
  return dataTexture(map, size, size);
}

/**
 * The frayed rim of a tear: paper torn a little ragged past the cut, and
 * fine fibres beyond it. Alpha in every channel (alphaMap reads green); u
 * runs along the tear (TEX_PX px), v across the ribbon, the tear at 1.6 px.
 */
function fibreTexture(rng: () => number): THREE.DataTexture {
  const w = 256;
  const h = 32;
  const a = new Float32Array(w * h);
  // Texels per px along the tear and across the ribbon (about 9.5 px wide).
  const ku = w / TEX_PX;
  const kv = h / 9.5;
  const edgeV = 1.6 * kv;
  // How far the ragged rim reaches past the cut along the tear, px.
  const n1 = loopNoise(rng, w, 90);
  const n2 = loopNoise(rng, w, 34);
  const n3 = loopNoise(rng, w, 11);
  const n4 = loopNoise(rng, w, 4);
  const rim = new Float32Array(w);
  for (let x = 0; x < w; x++) rim[x] = 0.35 + 0.9 * n1(x) + 0.6 * n2(x) + 0.45 * n3(x) + 0.3 * n4(x);
  // Now and then a small torn tooth.
  for (let i = 0; i < 26; i++) {
    const c = rng() * w;
    const half = (0.8 + rng() * 1.8) * ku;
    const tall = 1 + rng() * 2.2;
    for (let x = Math.floor(c - half); x <= Math.ceil(c + half); x++) {
      const k = 1 - Math.abs(x - c) / half;
      if (k > 0) rim[(x + w) % w] = Math.max(rim[(x + w) % w]!, tall * k ** 0.7);
    }
  }
  for (let y = 0; y < h; y++) {
    const past = (y + 0.5) / kv - 1.6;
    for (let x = 0; x < w; x++) a[y * w + x] = clamp((rim[x]! - past) * kv * 0.8 + 0.5, 0, 1);
  }
  // Fibres out of the rim: fine strokes (half a px wide), mostly short,
  // leaning and curving a little, fading toward their tips.
  const step = 0.25;
  for (let i = 0; i < 160; i++) {
    let x = rng() * TEX_PX;
    let y = Math.max(0, rim[Math.floor(x * ku) % w]!) - 0.3;
    const len = 1 + rng() ** 2 * 4.5;
    let ang = (rng() * 2 - 1) * 0.9;
    const curl = (rng() * 2 - 1) * 0.5;
    for (let s = 0; s < len && y < 7.6; s += step) {
      const at = Math.floor(edgeV + y * kv) * w + wi(Math.floor(x * ku) % w, w);
      const v = 0.95 - 0.4 * (s / len);
      if (at >= 0 && at < w * h && v > a[at]!) a[at] = v;
      x += Math.sin(ang) * step;
      y += Math.cos(ang) * step;
      ang += curl * step * 0.4;
    }
  }
  const data = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const b = (clamp(a[i]!, 0, 1) * 255 + 0.5) | 0;
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = b;
    data[i * 4 + 3] = 255;
  }
  const t = dataTexture(data, w, h);
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// ---------------------------------------------------------------------------
// Materials

const PAPER_VERT_PARS = /* glsl */ `
attribute vec2 torn;
varying vec2 vTorn;
varying vec2 vTornXY;
`;

const PAPER_FRAG_PARS = /* glsl */ `
uniform vec3 tornCore;
uniform vec4 tornBand;
uniform vec2 tornGlow;
varying vec2 vTorn;
varying vec2 vTornXY;
float tornHash( float p ) { p = fract( p * 0.1031 ); p *= p + 33.33; p *= p + p; return fract( p ); }
float tornNoise( float x ) { float i = floor( x ); float f = fract( x ); return mix( tornHash( i ), tornHash( i + 1.0 ), f * f * ( 3.0 - 2.0 * f ) ); }
float tornHash2( vec2 p ) { vec3 p3 = fract( vec3( p.xyx ) * 0.1031 ); p3 += dot( p3, p3.yzx + 33.33 ); return fract( ( p3.x + p3.y ) * p3.z ); }
float tornNoise2( vec2 p ) {
	vec2 i = floor( p ); vec2 f = fract( p ); vec2 u = f * f * ( 3.0 - 2.0 * f );
	return mix( mix( tornHash2( i ), tornHash2( i + vec2( 1.0, 0.0 ) ), u.x ), mix( tornHash2( i + vec2( 0.0, 1.0 ) ), tornHash2( i + vec2( 1.0, 1.0 ) ), u.x ), u.y );
}
// The pale fibrous band where the paper's layers tore unevenly: 0..1.
float tornBandMask( float fw ) {
	float d = vTorn.y;
	float s = vTorn.x + tornBand.w;
	// Mostly thin, now and then wider where the layers peeled further.
	float w = tornBand.x + tornBand.y * pow( tornNoise( s * 0.014 ) * 0.7 + tornNoise( s * 0.047 ) * 0.3, 1.8 ) + 1.6 * ( tornNoise( s * 0.16 ) - 0.5 );
	float hair = tornBand.z * ( pow( tornNoise( s * 0.85 ), 6.0 ) + 0.7 * pow( tornNoise( s * 2.1 + 11.0 ), 9.0 ) );
	// Where the layers tore cleanly there is no band at all, hair and all.
	float edge = max( w, 0.0 ) + hair * smoothstep( 0.0, 1.5, w );
	float aa = 0.35 + fw;
	float m = 1.0 - smoothstep( edge - aa, edge + aa, d );
	float layer = mix( 0.7, 1.0, tornNoise( s * 0.5 + d * 0.9 ) );
	return step( 0.0, d ) * m * layer;
}
`;

const PAPER_FRAG_COLOR = /* glsl */ `
#if defined( USE_COLOR )
	float tornFw = fwidth( vTorn.y );
	float tornB = tornBandMask( tornFw );
	float tornCut = step( vTorn.y, -1.5 );
	diffuseColor.rgb *= mix( vColor.rgb, tornCore, tornB ) * ( 1.0 - tornCut * 0.1 * tornNoise( vTorn.x * 0.8 ) );
	// Paper is translucent: its torn fibres and the cut scatter light and glow softly.
	totalEmissiveRadiance += tornCore * ( tornCut * tornGlow.x + tornB * tornGlow.y );
#endif
#ifndef TORN_LOW
	diffuseColor.rgb *= 0.965 + 0.07 * tornNoise2( vTornXY * 0.0045 );
#endif
`;

function paperMaterial(core: THREE.Color, map: THREE.Texture, relief: boolean, low: boolean, seed: number): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0,
    map,
    bumpMap: relief ? map : null,
    bumpScale: 0.9,
  });
  const uniforms = {
    tornCore: { value: core.clone() },
    tornBand: { value: new THREE.Vector4(-1.5, 12.0, 3.6, (seed % 997) * 13.7) },
    tornGlow: { value: new THREE.Vector2(0.4, 0.12) },
  };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${PAPER_VERT_PARS}`)
      .replace('#include <uv_vertex>', '#include <uv_vertex>\n\tvTorn = torn;\n\tvTornXY = position.xy;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${low ? '#define TORN_LOW\n' : ''}${PAPER_FRAG_PARS}`)
      .replace('#include <color_fragment>', PAPER_FRAG_COLOR);
  };
  mat.customProgramCacheKey = () => (low ? 'torn-paper-low' : 'torn-paper');
  // The band (width, swing, hair, seed offset) and glow (cut, band) stay tunable.
  mat.userData.tornUniforms = uniforms;
  return mat;
}

// ---------------------------------------------------------------------------

/** Builds the torn front of a box. The group is in game px (y up, z toward the camera); dispose() frees it all. */
export function buildTornFront(spec: TornFrontSpec): TornFront {
  const t0 = performance.now();
  const quality = spec.quality === 'low' ? 'low' : 'high';
  const q = QUALITY[quality];
  const colours = {
    outside: new THREE.Color().setStyle(spec.outside, THREE.SRGBColorSpace),
    inside: new THREE.Color().setStyle(spec.inside, THREE.SRGBColorSpace),
    core: new THREE.Color().setStyle(spec.core, THREE.SRGBColorSpace),
  };
  const built = buildMeshes(spec, layoutTear(spec, q), q, colours);
  const tex = acquireTextures(quality, q);
  const group = new THREE.Group();
  group.name = 'tornFront';
  const paperMat = paperMaterial(colours.core, tex.map, q.relief, quality === 'low', spec.seed);
  const paper = new THREE.Mesh(built.slab, paperMat);
  paper.name = 'tornFront.paper';
  paper.castShadow = true;
  paper.receiveShadow = true;
  group.add(paper);
  const materials: THREE.Material[] = [paperMat];
  const geometries: THREE.BufferGeometry[] = [built.slab];
  if (built.ribbon && tex.fibres) {
    const fibreMat = new THREE.MeshStandardMaterial({
      color: colours.core.clone().lerp(colours.outside, 0.22),
      // Thin fibres let light through: never dark, even turned away.
      emissive: colours.core.clone().multiplyScalar(0.3),
      roughness: 0.95,
      metalness: 0,
      alphaMap: tex.fibres,
      alphaTest: 0.42,
      side: THREE.DoubleSide,
    });
    // Fibres are strands, not a sheet: light them the same from either side.
    fibreMat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\n\tnormal = normalize( vNormal );');
    };
    fibreMat.customProgramCacheKey = () => 'torn-fibres';
    const ribbon = new THREE.Mesh(built.ribbon, fibreMat);
    ribbon.name = 'tornFront.fibres';
    ribbon.castShadow = false;
    ribbon.receiveShadow = true;
    group.add(ribbon);
    materials.push(fibreMat);
    geometries.push(built.ribbon);
  }
  const vertices = geometries.reduce((s, g) => s + g.getAttribute('position').count, 0);
  const triangles = geometries.reduce((s, g) => s + (g.getIndex()?.count ?? 0) / 3, 0);
  let disposed = false;
  return {
    group,
    stats: { vertices, triangles, ms: performance.now() - t0 },
    dispose() {
      if (disposed) return;
      disposed = true;
      group.removeFromParent();
      group.clear();
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      releaseTextures(quality);
    },
  };
}
