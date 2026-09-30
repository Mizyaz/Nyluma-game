import * as THREE from 'three';
import { Mesher, mulberry32, type Paint } from './mesh';

// Gorti as a 3D figure, built from the painting: a crate of jagged planks
// round an olive core for a head, the lilac bezel of its screen face in
// front; a broad sage body over a skirt of bark plates; bark arms and legs
// that sprout leaves, on root feet. Model units: X forward, Y up, Z the
// character's right, the ground at y = 0. Each joint's parts are built in
// that joint's own frame (JOINTS).

export interface JointDef {
  id: string;
  parent: string | null;
  /** Position in the parent's frame (model units). */
  at: readonly [number, number, number];
  order?: THREE.EulerOrder;
}

export interface FigureModel {
  id: string;
  joints: JointDef[];
  /** One merged mesh per joint, in the joint's frame. */
  parts: Record<string, THREE.BufferGeometry>;
  /** The glowing face: screen material, no outline. */
  screen?: { joint: string; geo: THREE.BufferGeometry };
  anchors: Record<string, { joint: string; at: readonly [number, number, number] }>;
  /** Model units per px of the 2D rig's joint offsets. */
  offsetScale: Record<string, number>;
  /** Top of the head above the ground. */
  height: number;
}

type P2 = readonly [number, number];
type Section = (t: number, th: number) => readonly [number, number];

const V = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);
/** Limb spines point down; with this `up` a section's a is forward and b the right. */
const FWD = V(1, 0, 0);
const spow = (x: number, e: number): number => Math.sign(x) * Math.abs(x) ** e;
const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
/** Smoothstep from e0 (0) to e1 (1), either order. */
function smooth(e0: number, e1: number, x: number): number {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}
function mixHex(a: number, b: number, k: number): number {
  const ch = (s: number): number => {
    const ca = (a >> s) & 255;
    return Math.round(ca + (((b >> s) & 255) - ca) * k) << s;
  };
  return ch(16) | ch(8) | ch(0);
}
/** Piecewise-linear through knots (x, y) sorted by x. */
function knots(k: readonly P2[], x: number): number {
  const first = k[0]!;
  if (x <= first[0]) return first[1];
  for (let i = 1; i < k.length; i++) {
    const a = k[i - 1]!;
    const b = k[i]!;
    if (x <= b[0]) return a[1] + (b[1] - a[1]) * ((x - a[0]) / (b[0] - a[0] || 1));
  }
  return k[k.length - 1]![1];
}
/** Linear lookup in a table whose xs increase. */
function interp(xs: readonly number[], ys: readonly number[], x: number): number {
  let lo = 0;
  let hi = xs.length - 1;
  if (x <= xs[0]!) return ys[0]!;
  if (x >= xs[hi]!) return ys[hi]!;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (xs[mid]! <= x) lo = mid;
    else hi = mid;
  }
  return ys[lo]! + ((ys[hi]! - ys[lo]!) * (x - xs[lo]!)) / (xs[hi]! - xs[lo]! || 1);
}
const uniq = (a: number[]): number[] => a.sort((p, q) => p - q).filter((v, i, s) => i === 0 || v - s[i - 1]! > 1e-4);
/** A round section, radius r0 at the start to r1 at the end. */
const round = (r0: number, r1: number): Section => (t, th) => {
  const r = r0 + (r1 - r0) * t;
  return [r * Math.cos(th), r * Math.sin(th)] as const;
};

interface RingPt { x: number; z: number; nx: number; nz: number }

/** A point of a superellipse round the Y axis and its outward normal: half widths hx (forward), hz (right), exponent n; φ = 0 at the front, π/2 at the right. */
function ringPt(hx: number, hz: number, n: number, phi: number): RingPt {
  const x = hx * spow(Math.cos(phi), 2 / n);
  const z = hz * spow(Math.sin(phi), 2 / n);
  const gx = (Math.sign(x) * Math.abs(x / hx) ** (n - 1)) / hx;
  const gz = (Math.sign(z) * Math.abs(z / hz) ** (n - 1)) / hz;
  const l = Math.hypot(gx, gz) || 1;
  return { x, z, nx: gx / l, nz: gz / l };
}

/** Arc length along a ring, both ways. */
class Arc {
  private readonly phis: number[] = [];
  private readonly lens: number[] = [];
  constructor(ring: (phi: number) => RingPt, from: number, to: number, steps = 2048) {
    let prev = ring(from);
    let acc = 0;
    for (let i = 0; i <= steps; i++) {
      const phi = from + ((to - from) * i) / steps;
      const p = ring(phi);
      acc += Math.hypot(p.x - prev.x, p.z - prev.z);
      prev = p;
      this.phis.push(phi);
      this.lens.push(acc);
    }
  }
  get length(): number {
    return this.lens[this.lens.length - 1]!;
  }
  sAt(phi: number): number {
    return interp(this.phis, this.lens, phi);
  }
  phiAt(s: number): number {
    return interp(this.lens, this.phis, s);
  }
  /** Angles from φ0 to φ1 at most `step` apart along the ring, the knots kept. */
  samples(phi0: number, phi1: number, step: number, keep: readonly number[] = []): number[] {
    const s0 = this.sAt(phi0);
    const s1 = this.sAt(phi1);
    const k = Math.max(1, Math.ceil(Math.abs(s1 - s0) / step));
    const out = Array.from({ length: k + 1 }, (_, i) => this.phiAt(s0 + ((s1 - s0) * i) / k));
    for (const q of keep) if (q > phi0 && q < phi1) out.push(q);
    return uniq(out);
  }
}

/**
 * A curved slab (a plank, a bark plate): its outer face on `ring` at each
 * angle of `phis`, `thick` deep inward, cut at y0 below and y1 above. Hard
 * edges; u runs along the ring, v up.
 */
function slab(
  m: Mesher,
  phis: readonly number[],
  ring: (phi: number, y: number) => RingPt,
  y0: (phi: number) => number,
  y1: (phi: number) => number,
  thick: number,
  paint: Paint,
  tile = 14,
): void {
  const pos: number[] = [];
  const nrm: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const vert = (x: number, y: number, z: number, n: readonly [number, number, number], u: number, v: number): number => {
    pos.push(x, y, z);
    nrm.push(n[0], n[1], n[2]);
    uv.push(u, v);
    return pos.length / 3 - 1;
  };
  const strip = (first: number, count: number): void => {
    for (let i = 0; i < count - 1; i++) {
      const a = first + 2 * i;
      idx.push(a, a + 2, a + 3, a, a + 3, a + 1);
    }
  };
  const N = phis.length;
  const yb = phis.map((f) => y0(f));
  const yt = phis.map((f) => y1(f));
  const ob = phis.map((f, i) => ring(f, yb[i]!));
  const ot = phis.map((f, i) => ring(f, yt[i]!));
  const arc: number[] = [0];
  for (let i = 1; i < N; i++) arc.push(arc[i - 1]! + Math.hypot(ot[i]!.x - ot[i - 1]!.x, ot[i]!.z - ot[i - 1]!.z));
  const tan = (i: number): [number, number] => {
    const a = ot[Math.max(0, i - 1)]!;
    const b = ot[Math.min(N - 1, i + 1)]!;
    const l = Math.hypot(b.x - a.x, b.z - a.z) || 1;
    return [(b.x - a.x) / l, (b.z - a.z) / l];
  };
  for (const side of [1, -1]) {
    const first = pos.length / 3;
    const d = side > 0 ? 0 : thick;
    for (let i = 0; i < N; i++) {
      const B = ob[i]!;
      const T = ot[i]!;
      const u = arc[i]! / tile;
      vert(B.x - B.nx * d, yb[i]!, B.z - B.nz * d, [B.nx * side, 0, B.nz * side], u, yb[i]! / tile);
      vert(T.x - T.nx * d, yt[i]!, T.z - T.nz * d, [T.nx * side, 0, T.nz * side], u, yt[i]! / tile);
    }
    strip(first, N);
  }
  for (const top of [true, false]) {
    const first = pos.length / 3;
    for (let i = 0; i < N; i++) {
      const P = top ? ot[i]! : ob[i]!;
      const y = top ? yt[i]! : yb[i]!;
      let n: [number, number, number] = [0, -1, 0];
      if (top) {
        const i0 = Math.max(0, i - 1);
        const i1 = Math.min(N - 1, i + 1);
        const k = (yt[i1]! - yt[i0]!) / (arc[i1]! - arc[i0]! || 1);
        const [tx, tz] = tan(i);
        const l = Math.hypot(1, k);
        n = [(-k * tx) / l, 1 / l, (-k * tz) / l];
      }
      const u = arc[i]! / tile;
      vert(P.x, y, P.z, n, u, 0);
      vert(P.x - P.nx * thick, y, P.z - P.nz * thick, n, u, thick / tile);
    }
    strip(first, N);
  }
  for (const i of [0, N - 1]) {
    const [tx, tz] = tan(i);
    const s = i === 0 ? -1 : 1;
    const n = [tx * s, 0, tz * s] as const;
    const B = ob[i]!;
    const T = ot[i]!;
    const a = vert(B.x, yb[i]!, B.z, n, 0, yb[i]! / tile);
    vert(T.x, yt[i]!, T.z, n, 0, yt[i]! / tile);
    vert(T.x - T.nx * thick, yt[i]!, T.z - T.nz * thick, n, thick / tile, yt[i]! / tile);
    vert(B.x - B.nx * thick, yb[i]!, B.z - B.nz * thick, n, thick / tile, yb[i]! / tile);
    idx.push(a, a + 1, a + 2, a, a + 2, a + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  m.add(g, null, paint);
}

/** A spike tapering to a point along `line` (claws, toes, twigs): w across and h deep at its root. */
function spike(m: Mesher, line: THREE.Vector3[], w: number, h: number, paint: Paint): void {
  m.loft(line, (t, th) => {
    const k = (1 - t) ** 0.7 + 0.03;
    return [w * k * Math.cos(th), h * k * Math.sin(th)] as const;
  }, { paint, rings: 10, segs: 12, capStart: true });
}

/** An almond leaf `len` long and `wid` wide growing from `at` toward `dir`. */
function leaf(m: Mesher, at: THREE.Vector3, dir: THREE.Vector3, len: number, wid: number, color: number): void {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(len * 0.42, wid, len, 0);
  s.quadraticCurveTo(len * 0.42, -wid, 0, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(FWD, dir.clone().normalize());
  const mat = new THREE.Matrix4().compose(at, q, V(1, 1, 1)).multiply(new THREE.Matrix4().makeTranslation(0, 0, -0.3));
  m.extrude(s, { depth: 0.6, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.25, bevelSegments: 1 }, mat, { color, kind: 'leaf', uv: 'fit', hull: 0.45 });
}

function elbow(m: Mesher, color: number): void {
  m.add(new THREE.SphereGeometry(4.8, 16, 12), null, { color, kind: 'bark', uv: 'box', tile: 16, hull: 0.8 });
}

// ---- Head --------------------------------------------------------------

/** The crate of the head: planks round a superellipse, 16.5 forward and 20.5 across. */
const CRATE = { hx: 16.5, hz: 20.5, n: 4, thick: 2.5, bottom: 8.5, gap: 0.85 };
const crate = (phi: number): RingPt => ringPt(CRATE.hx, CRATE.hz, CRATE.n, phi);
/** The angle of a point on the crate's front from its z. */
const phiOfZ = (z: number): number => Math.asin(Math.max(-1, Math.min(1, Math.sign(z) * (Math.abs(z) / CRATE.hz) ** 2)));

/** The front planks' jagged tops, (z, y), traced from the painting (the viewer's left first). */
const FRONT_PLANKS: readonly { color: number; top: readonly P2[] }[] = [
  { color: 0x8c7c60, top: [[18.7, 31.6], [17.2, 34.5], [14.7, 33.9], [13.5, 35], [12.4, 37.6], [10.4, 37.1], [9.2, 38.25], [8.3, 38.3], [4.9, 36.4]] },
  { color: 0x977d5d, top: [[3.4, 37.1], [2.2, 37.75], [0.3, 37.4], [-1.7, 37.9], [-3.9, 36.9], [-10.6, 36.1]] },
  { color: 0x8c7b64, top: [[-11.9, 35.4], [-15.6, 35.5], [-19.4, 33.5], [-20.6, 31.1]] },
];
const BACK_PLANKS = [0x8a7a5e, 0x8c7b64, 0x937b5c];

/** The bezel's outline and its window, (sx, sy) traced from the painting; sx runs to the viewer's right (z = -sx). */
const OUTER = [-14.36,29.09,-14.52,28.44,-14.61,24.62,-15.52,19.69,-15.72,17.69,-16.27,15.12,-16.24,13.5,-16.52,11.46,-16.17,11.07,-14.94,10.98,-13.0,10.44,-10.73,8.94,-10.12,8.25,-8.92,5.81,-8.79,4.71,-8.58,4.42,-7.94,4.26,-4.12,4.13,0.0,4.18,5.17,3.99,5.58,4.28,6.58,5.88,7.88,7.56,9.06,8.71,11.25,9.94,14.31,10.94,14.85,11.26,15.16,11.63,15.89,14.56,16.55,20.88,16.61,25.75,16.47,26.3,16.16,26.66,14.88,26.98,11.19,27.3,7.62,27.19,-1.06,27.81,-8.0,28.65,-10.12,28.78,-13.69,29.38,-14.1,29.32];
const HOLE = [-13.54,27.12,-13.74,26.44,-13.76,23.94,-13.97,22.06,-15.23,14.88,-15.29,13.88,-15.17,13.25,-14.66,12.47,-13.88,12.11,-13.12,12.08,-11.19,12.43,-9.25,12.21,-8.7,11.99,-8.23,11.31,-7.95,9.25,-7.74,8.5,-7.42,7.82,-7.05,7.45,-6.69,7.38,-5.06,7.49,-2.19,7.36,-0.44,6.92,0.69,6.81,2.81,6.18,3.56,6.08,4.06,6.14,4.66,6.46,5.09,7.01,5.33,7.69,5.59,9.44,6.11,10.38,6.63,10.92,7.56,11.27,10.12,11.77,13.5,12.67,13.84,12.86,14.12,13.25,14.39,14.19,14.73,16.5,15.2,23.5,15.54,24.75,15.42,25.24,15.06,25.56,11.69,25.93,4.81,25.94,2.75,26.18,-0.38,26.27,-3.94,26.66,-6.19,27.08,-9.38,27.46,-11.69,27.93,-12.87,27.82,-13.26,27.54];

/** Shape points (sx, sy), scaled by k about the window's middle. */
function pts(a: readonly number[], k = 1): THREE.Vector2[] {
  const out: THREE.Vector2[] = [];
  for (let i = 0; i < a.length; i += 2) out.push(new THREE.Vector2(a[i]! * k, 17 + (a[i + 1]! - 17) * k));
  return out;
}

/** Bezel colours by the face before it is turned to the front: lilac caps, dark window walls, greyer outer sides. */
function bezelShade(_p: THREE.Vector3, _n: THREE.Vector3, lp: THREE.Vector3, ln: THREE.Vector3): number {
  if (Math.abs(ln.z) > 0.7) return lp.x < -6 && lp.y < 15 ? 0xc7b1c7 : 0xcbb4ca;
  if (ln.x * lp.x + ln.y * (lp.y - 17) < 0) return 0x6a5f6c;
  return ln.y > 0.2 ? 0x9f93a2 : 0x857982;
}

function head(m: Mesher, rnd: () => number): void {
  // The olive core, its chin jutting forward under the bezel.
  m.loft([V(0, 0.4, 0), V(0, 32.6, 0)], (t, th) => {
    const y = 0.4 + 32.2 * t;
    const s = Math.max(0, 1 - Math.abs((y - 16.5) / 16.1) ** 3) ** (1 / 3);
    const sn = Math.sin(th);
    const fwd = sn > 0 ? 13 * s + 3.5 * smooth(10, 5, y) * smooth(0.4, 3, y) : 13 * s;
    return [16.5 * s * spow(Math.cos(th), 2 / 3), fwd * spow(sn, 2 / 3)] as const;
  }, { paint: { color: (_p, _n, lp) => mixHex(0x6c7c54, 0x6f7e57, clamp01(lp.y / 32)), kind: 'skin', hull: 1.2 }, rings: 24, segs: 32, ease: 0.6 });
  // The planks: three traced across the front, the rest round the back.
  const arc = new Arc(crate, -Math.PI / 2, 1.5 * Math.PI);
  for (const p of FRONT_PLANKS) {
    const k = p.top.map(([z, y]) => [phiOfZ(z), y] as const).sort((a, b) => a[0] - b[0]);
    const phis = arc.samples(k[0]![0], k[k.length - 1]![0], 0.9, k.map((q) => q[0]));
    slab(m, phis, crate, () => CRATE.bottom, (f) => knots(k, f), CRATE.thick, { color: p.color, kind: 'plank', hull: 0.55 }, 16);
  }
  const from = arc.sAt(phiOfZ(18.7)) + CRATE.gap * 1.4;
  const to = arc.length - CRATE.gap;
  const count = Math.max(1, Math.round((to - from + CRATE.gap) / (13 + CRATE.gap)));
  const w = (to - from - (count - 1) * CRATE.gap) / count;
  for (let i = 0; i < count; i++) {
    const s0 = from + i * (w + CRATE.gap);
    const teeth: P2[] = [0, 0.22, 0.5, 0.78, 1].map((u) => [arc.phiAt(s0 + u * w), 34 + 3 * rnd()] as const);
    const phis = arc.samples(teeth[0]![0], teeth[teeth.length - 1]![0], 0.9, teeth.map((q) => q[0]));
    const bottom = CRATE.bottom + 0.4 * rnd();
    slab(m, phis, crate, () => bottom, (f) => knots(teeth, f), CRATE.thick, { color: BACK_PLANKS[i % 3]!, kind: 'plank', hull: 0.55 }, 16);
  }
  // The screen's lilac bezel, over the planks' lower half.
  const face = new THREE.Shape(pts(OUTER));
  face.holes.push(new THREE.Path(pts(HOLE)));
  m.extrude(face, { depth: 2.2, bevelEnabled: true, bevelThickness: 0.6, bevelSize: 0.5, bevelSegments: 2 }, new THREE.Matrix4().makeRotationY(Math.PI / 2).setPosition(16, 0, 0), { color: bezelShade, kind: 'plain', hull: 1.1 });
}

/** The screen in the bezel's window; its uv maps gorti-screen.png. */
function screenGeo(): THREE.BufferGeometry {
  const g = new THREE.ShapeGeometry(new THREE.Shape(pts(HOLE, 1.04)), 6);
  const p = g.getAttribute('position');
  const uv = g.getAttribute('uv');
  for (let i = 0; i < p.count; i++) uv.setXY(i, (16 * p.getX(i) + 255) / 520, (16 * p.getY(i) - 80) / 380);
  g.rotateY(Math.PI / 2);
  g.translate(17.4, 0, 0);
  return g;
}

// ---- Body --------------------------------------------------------------

const TORSO_Z: readonly P2[] = [[-3, 14.6], [0, 15], [8, 15.5], [18, 16], [26, 19], [31, 20], [34, 14], [36.5, 7]];
const TORSO_X: readonly P2[] = [[-3, 11.6], [0, 12], [8, 13], [18, 12.5], [26, 12], [31, 11], [34, 9], [36.5, 6]];

function torso(m: Mesher): void {
  m.loft([V(0, -3, 0), V(0, 36.5, 0)], (t, th) => {
    const y = -3 + 39.5 * t;
    return [knots(TORSO_Z, y) * spow(Math.cos(th), 2 / 2.6), knots(TORSO_X, y) * spow(Math.sin(th), 2 / 2.6)] as const;
  }, { paint: { color: (_p, _n, lp) => mixHex(0xaabb90, 0xacbd92, clamp01(lp.y / 36)), kind: 'skin', hull: 1.3 }, rings: 22, segs: 32, capStart: true, capEnd: true });
  // The neck, up into the olive core.
  m.loft([V(0, 31, 0), V(0, 40, 0)], round(7.6, 7), { paint: { color: 0xa9ba8f, kind: 'skin', hull: 1 }, rings: 4, segs: 20 });
}

/** The bark skirt over the belly and the thighs' tops: a flared ring of plates. */
const SKIRT = { top: 16, bottom: -8, n: 2.4, thick: 1.5, plates: 7 };
function skirtRing(phi: number, y: number): RingPt {
  const k = clamp01((SKIRT.top - y) / (SKIRT.top - SKIRT.bottom));
  return ringPt(15.6 + 1.4 * k, 18.8 + 1.7 * k, SKIRT.n, phi);
}
const SKIRT_COLORS = [0x8c7961, 0x957c5d, 0x8b7b65];

function hips(m: Mesher, rnd: () => number): void {
  m.loft([V(0, -11, 0), V(0, 3, 0)], (t, th) => {
    const s = 0.8 + 0.2 * smooth(0, 0.6, t);
    return [14 * s * spow(Math.cos(th), 2 / 2.5), 11 * s * spow(Math.sin(th), 2 / 2.5)] as const;
  }, { paint: { color: 0x826c50, kind: 'bark', hull: 0.9 }, rings: 8, segs: 28, capStart: true, capEnd: true });
  const step = (2 * Math.PI) / SKIRT.plates;
  for (let i = 0; i < SKIRT.plates; i++) {
    const f0 = -0.25 + i * step;
    const f1 = f0 + step - 0.055;
    const front = Math.cos((f0 + f1) / 2) > 0.3 ? 2 : 0;
    const tops: P2[] = [0, 0.3, 0.55, 0.8, 1].map((u) => [f0 + (f1 - f0) * u, 12.5 + front + 4 * rnd()] as const);
    const lows: P2[] = [[f0, -4 - rnd()], [(f0 + f1) / 2, -9 - 1.5 * rnd()], [f1, -4 - rnd()]];
    const phis = uniq([...Array.from({ length: 13 }, (_, j) => f0 + ((f1 - f0) * j) / 12), ...tops.map((q) => q[0]), (f0 + f1) / 2]);
    slab(m, phis, skirtRing, (f) => knots(lows, f), (f) => knots(tops, f), SKIRT.thick, { color: SKIRT_COLORS[i % 3]!, kind: 'bark', hull: 0.6 }, 14);
  }
}

function upperArm(m: Mesher): void {
  m.loft([V(0, 3, 0), V(0, -21, 0)], (t, th) => {
    const r = 7 - 2.5 * t + 0.5 * Math.sin(Math.PI * t);
    return [r * Math.cos(th), r * Math.sin(th)] as const;
  }, { paint: { color: 0xabbc91, kind: 'skin', hull: 0.9 }, up: FWD, rings: 10, segs: 20, capStart: true, capEnd: true });
}

/** The right forearm: bark in pieces, a tan wrist with a lilac band, three leaf claws on twigs. */
function foreR(m: Mesher): void {
  elbow(m, 0x8d7758);
  m.loft([V(0, 1, 0), V(0, -7.5, 0)], round(5.1, 4.8), { paint: { color: 0x8d7758, kind: 'bark', hull: 0.9 }, up: FWD, rings: 6, segs: 18, capStart: true, capEnd: true });
  m.loft([V(0, -8.2, 0), V(0, -14.5, 0)], round(4.8, 4.2), { paint: { color: 0x86704f, kind: 'bark', hull: 0.9 }, up: FWD, rings: 6, segs: 18, capStart: true, capEnd: true });
  const wristR = (t: number): number => 3.9 - 0.5 * t;
  const wrist = m.loft([V(0, -14.5, 0), V(0, -19.5, 0)], (t, th) => [wristR(t) * Math.cos(th), wristR(t) * Math.sin(th)] as const, { paint: { color: 0xa07a50, kind: 'skin', hull: 0.7 }, up: FWD, rings: 6, segs: 18, capEnd: true });
  m.band(wrist, { paint: { color: 0xc4a6cf, kind: 'plain', hull: 0.45 }, at: (th) => 0.4 + 0.22 * Math.sin(th), width: 0.2, radius: (t) => wristR(t) });
  for (const i of [-1, 0, 1]) {
    spike(m, [V(0.3, -18.5, 0.4 * i), V(0.9, -21.5, 1.4 * i)], 1.4, 1.4, { color: 0x4f3b2a, kind: 'bark', hull: 0.5 });
    spike(m, [V(0.9, -21, 1.4 * i), V(2.9, -26.5, 2.4 * i), V(6.6, -31, 3.3 * i)], 1.9, 1.05, { color: 0x859d5d, kind: 'plain', hull: 0.5 });
  }
}

/** The left forearm: a bark sleeve sprouting almond leaves, a blocky bark hand. */
function foreL(m: Mesher): void {
  elbow(m, 0x908169);
  m.loft([V(0, 1, 0), V(0, -17, 0)], round(5.2, 4.2), { paint: { color: 0x908169, kind: 'bark', hull: 0.9 }, up: FWD, rings: 10, segs: 18, capStart: true, capEnd: true });
  // at (x, y, z) toward (dx, dy, dz); outward is -Z on this arm
  const LEAVES: readonly (readonly [number, number, number, number, number, number])[] = [
    [2.2, -3, -4.2, 0.35, 1, -0.9],
    [-2.4, -6.5, -3.8, -0.4, 1, -0.8],
    [2.4, -10, -3.6, 0.45, 0.9, -1],
    [-2, -13, -3.4, -0.3, 0.9, -1],
  ];
  for (const [x, y, z, dx, dy, dz] of LEAVES) leaf(m, V(x, y, z), V(dx, dy, dz), 7.5, 2.6, 0x6d7b61);
  m.loft([V(0, -16.5, 0), V(0, -21.8, 0)], (_t, th) => [3.6 * spow(Math.cos(th), 0.5), 3.2 * spow(Math.sin(th), 0.5)] as const, { paint: { color: 0x776d5e, kind: 'bark', hull: 0.8 }, up: FWD, rings: 5, segs: 20, capStart: true, capEnd: true });
  for (let k = 0; k < 4; k++) {
    const z = -2.25 + 1.5 * k;
    m.loft([V(0.8, -21, z), V(1.3, -27, z * 1.12)], (t, th) => {
      const r = 0.95 - 0.15 * t;
      return [r * spow(Math.cos(th), 0.5), r * spow(Math.sin(th), 0.5)] as const;
    }, { paint: { color: 0x776d5e, kind: 'bark', hull: 0.5 }, up: FWD, rings: 4, segs: 12, capEnd: true });
  }
}

/** A thigh of ridged bark with a muscle's front bulge, sprouting leaves. side: +1 right, -1 left. */
function thigh(m: Mesher, side: 1 | -1): void {
  const R: readonly P2[] = [[0, 8], [0.35, 9.5], [1, 6.5]];
  m.loft([V(0, 3, 0), V(0, -31, 0)], (t, th) => {
    const r = knots(R, t) * (1 + 0.07 * Math.sin(7 * th + 1.7 + 3 * t + (side > 0 ? 0 : 1.3)));
    const c = Math.cos(th);
    return [r * c + 1.3 * Math.sin(Math.PI * t) * Math.max(0, c), r * Math.sin(th)] as const;
  }, { paint: { color: (_p, _n, _lp, ln) => mixHex(0x9b876a, 0x826c50, 0.8 * clamp01(-ln.x)), kind: 'bark', hull: 1 }, up: FWD, rings: 16, segs: 28, tile: 20, capStart: true });
  leaf(m, V(1.5, -12, side * 8.4), V(0.35, 0.8, side * 0.9), 8, 3, 0x859d5d);
  leaf(m, V(-3, -6, side * 7.4), V(-0.5, 0.7, side * 0.8), 6, 2.3, 0x6d7b61);
}

/** A knee knob and a shin of ridged bark, its calf bulging back, a leaf. */
function shin(m: Mesher, side: 1 | -1): void {
  m.add(new THREE.SphereGeometry(6.6, 18, 12), new THREE.Matrix4().makeTranslation(1.6, 0.3, 0), { color: 0x7a6c58, kind: 'bark', uv: 'box', tile: 16, hull: 0.9 });
  const R: readonly P2[] = [[0, 6.5], [0.25, 7.5], [1, 4.6]];
  m.loft([V(0, 0, 0), V(0, -30, 0)], (t, th) => {
    const r = knots(R, t) * (1 + 0.07 * Math.sin(7 * th + 0.4 + 2.5 * t + side));
    const c = Math.cos(th);
    return [r * c - 1.4 * Math.sin(Math.PI * Math.min(1, t / 0.6)) * Math.max(0, -c), r * Math.sin(th)] as const;
  }, { paint: { color: (_p, _n, _lp, ln) => mixHex(0x968367, 0x7e6b52, 0.8 * clamp01(-ln.x)), kind: 'bark', hull: 1 }, up: FWD, rings: 16, segs: 26, tile: 20 });
  leaf(m, V(2, -16, side * 6.6), V(0.6, 0.7, side * 0.8), 7, 2.6, 0x859d5d);
}

/** A root foot: forked pointed toes and a heel spur; the sole at y = -6. */
function foot(m: Mesher, side: 1 | -1): void {
  const P: Paint = { color: 0x8d7a62, kind: 'bark', hull: 0.6 };
  const s = side;
  m.loft([V(0, 2, 0), V(0, -4.2, 0)], round(4.4, 5.8), { paint: { color: 0x8d7a62, kind: 'bark', hull: 0.9 }, up: FWD, rings: 5, segs: 20, capEnd: true });
  spike(m, [V(1, -3.4, 1.2 * s), V(7, -4.8, 3 * s), V(13, -5.3, 5.2 * s), V(18, -5.6, 6.8 * s)], 2.6, 1.7, P);
  spike(m, [V(12.5, -5.2, 5 * s), V(15, -5.5, 4.2 * s), V(17.5, -5.6, 3.2 * s)], 1.3, 0.9, P);
  spike(m, [V(1.5, -3.4, 0), V(9, -4.9, 0.3 * s), V(16, -5.4, -0.3 * s), V(21.5, -5.6, -0.8 * s)], 2.8, 1.8, P);
  spike(m, [V(1, -3.4, -1.2 * s), V(6.5, -4.8, -3.3 * s), V(11, -5.3, -6 * s), V(14.5, -5.6, -7.6 * s)], 2.4, 1.6, P);
  spike(m, [V(-1, -3.6, 0), V(-5.5, -5, 0.4 * s), V(-9, -5.6, 0.8 * s)], 2.2, 1.5, P);
}

const JOINTS: JointDef[] = [
  { id: 'root', parent: null, at: [0, 0, 0] },
  { id: 'hips', parent: 'root', at: [0, 66, 0] },
  { id: 'torso', parent: 'hips', at: [0, 0, 0] },
  { id: 'head', parent: 'torso', at: [1, 37, 0], order: 'YZX' },
  { id: 'armR', parent: 'torso', at: [0.5, 31, 19] },
  { id: 'foreR', parent: 'armR', at: [0, -20, 0] },
  { id: 'armL', parent: 'torso', at: [0.5, 31, -19] },
  { id: 'foreL', parent: 'armL', at: [0, -20, 0] },
  { id: 'legR', parent: 'hips', at: [0, -1, 8] },
  { id: 'shinR', parent: 'legR', at: [0, -30, 0] },
  { id: 'footR', parent: 'shinR', at: [0, -29, 0] },
  { id: 'legL', parent: 'hips', at: [0, -1, -8] },
  { id: 'shinL', parent: 'legL', at: [0, -30, 0] },
  { id: 'footL', parent: 'shinL', at: [0, -29, 0] },
];

export function buildGorti(): FigureModel {
  const rnd = mulberry32(14);
  const part = (fn: (m: Mesher) => void, seed: number): THREE.BufferGeometry => {
    const m = new Mesher(seed);
    fn(m);
    return m.build();
  };
  return {
    id: 'gorti.root.child',
    joints: JOINTS,
    parts: {
      hips: part((m) => hips(m, rnd), 2),
      torso: part(torso, 3),
      head: part((m) => head(m, rnd), 4),
      armR: part(upperArm, 5),
      foreR: part(foreR, 6),
      armL: part(upperArm, 7),
      foreL: part(foreL, 8),
      legR: part((m) => thigh(m, 1), 9),
      shinR: part((m) => shin(m, 1), 10),
      footR: part((m) => foot(m, 1), 11),
      legL: part((m) => thigh(m, -1), 12),
      shinL: part((m) => shin(m, -1), 13),
      footL: part((m) => foot(m, -1), 14),
    },
    screen: { joint: 'head', geo: screenGeo() },
    anchors: {
      handR: { joint: 'foreR', at: [0, -22, 0] },
      handL: { joint: 'foreL', at: [0, -22, 0] },
      chest: { joint: 'torso', at: [6, 24, 0] },
      eye: { joint: 'head', at: [17, 18, 0] },
      ankleL: { joint: 'shinL', at: [0, -27, 0] },
    },
    offsetScale: { root: 66 / 42, hips: 66 / 42, torso: 1.1, armR: 1.2, armL: 1.2 },
    height: 141,
  };
}
