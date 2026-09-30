import * as THREE from 'three';

// Builds a figure's parts: one vertex-coloured mesh per joint, made of lofted
// tubes (limbs, torso), bands laid round them, extruded shapes (the bezel,
// leaves, bark plates) and any three.js geometry. Every vertex carries the
// texture it wears (`kind`), and `build` bakes the smooth normals the ink
// hull is pushed out along.

/** The textures a vertex can wear (see materials.ts). */
export const KIND = { skin: 0, bark: 1, plank: 2, plain: 3, leaf: 4 } as const;
export type Kind = keyof typeof KIND;

/** Colour of a vertex: sRGB hex, or chosen from its position and normal (model and local frame). */
export type Shade = number | ((p: THREE.Vector3, n: THREE.Vector3, lp: THREE.Vector3, ln: THREE.Vector3) => number);

export interface Paint {
  color: Shade;
  /** Texture worn (default plain). */
  kind?: Kind;
  /** UVs of added geometry: its own (default), projected on the box axes, or its outline fitted to 0..1. */
  uv?: 'keep' | 'box' | 'fit';
  /** Model units per texture tile of projected UVs (default 24). */
  tile?: number;
  /** Random lightness wobble per vertex (0..1). */
  jitter?: number;
  /** Width of the ink outline round it (model units, default 1; 0 for none). */
  hull?: number;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const V = (x = 0, y = 0, z = 0): THREE.Vector3 => new THREE.Vector3(x, y, z);

/**
 * A smooth curve with rotation-minimising frames: the tangent T, and N and B
 * across it (N starts as close to `up` as it can and is carried along
 * without twisting).
 */
export class Spine {
  readonly curve: THREE.CatmullRomCurve3;
  readonly length: number;
  private readonly C: THREE.Vector3[] = [];
  private readonly T: THREE.Vector3[] = [];
  private readonly N: THREE.Vector3[] = [];
  private static readonly SAMPLES = 96;

  constructor(points: readonly THREE.Vector3[], up: THREE.Vector3 = V(0, 0, 1)) {
    const pts = points.length === 2 ? [points[0]!, points[0]!.clone().lerp(points[1]!, 0.5), points[1]!] : [...points];
    this.curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    this.length = this.curve.getLength();
    const n = Spine.SAMPLES;
    for (let i = 0; i <= n; i++) {
      this.C.push(this.curve.getPointAt(i / n));
      this.T.push(this.curve.getTangentAt(i / n).normalize());
    }
    const t0 = this.T[0]!;
    let n0 = up.clone().addScaledVector(t0, -up.dot(t0));
    if (n0.lengthSq() < 1e-8) n0 = Math.abs(t0.x) < 0.9 ? V(1, 0, 0) : V(0, 1, 0);
    n0.addScaledVector(t0, -n0.dot(t0)).normalize();
    this.N.push(n0);
    const axis = V();
    for (let i = 1; i <= n; i++) {
      const a = this.T[i - 1]!;
      const b = this.T[i]!;
      const next = this.N[i - 1]!.clone();
      axis.crossVectors(a, b);
      const s = axis.length();
      if (s > 1e-7) next.applyAxisAngle(axis.divideScalar(s), Math.atan2(s, a.dot(b)));
      next.addScaledVector(b, -next.dot(b)).normalize();
      this.N.push(next);
    }
  }

  /** Centre, tangent, N and B at t (0..1 along the length). */
  frame(t: number, out: { C: THREE.Vector3; T: THREE.Vector3; N: THREE.Vector3; B: THREE.Vector3 }): void {
    const n = Spine.SAMPLES;
    const x = Math.max(0, Math.min(1, t)) * n;
    const i = Math.min(n - 1, Math.floor(x));
    const f = x - i;
    out.C.copy(this.C[i]!).lerp(this.C[i + 1]!, f);
    out.T.copy(this.T[i]!).lerp(this.T[i + 1]!, f).normalize();
    out.N.copy(this.N[i]!).lerp(this.N[i + 1]!, f);
    out.N.addScaledVector(out.T, -out.N.dot(out.T)).normalize();
    out.B.crossVectors(out.T, out.N);
  }
}

/** Where the point at angle θ of the ring at t sits: C + N·a + B·b. */
export type Section = (t: number, th: number) => readonly [number, number];

export interface LoftOpts {
  paint: Paint;
  /** Rings along the spine (default 14). */
  rings?: number;
  /** Vertices round each ring (default 18). */
  segs?: number;
  /** Where the sections' first axis points at the start (default +Z, the figure's right). */
  up?: THREE.Vector3;
  capStart?: boolean;
  capEnd?: boolean;
  /** Model units per texture tile (default 26). */
  tile?: number;
  /** Rings bunch up toward the ends when > 0 (sharp tips, crisp rims). */
  ease?: number;
}

export interface BandOpts {
  paint: Paint;
  /** Where round the spine the band runs (t, 0..1), per angle. */
  at: (th: number) => number;
  /** Band width along the spine (model units). */
  width: number;
  /** Radius of the surface it lies on, at t and θ (the band stands `lift` proud of it). */
  radius: (t: number, th: number) => number;
  lift?: number;
  segs?: number;
}

const F = { C: V(), T: V(), N: V(), B: V() };

export class Mesher {
  private pos: number[] = [];
  private nrm: number[] = [];
  private col: number[] = [];
  private uvs: number[] = [];
  private kind: number[] = [];
  private hw: number[] = [];
  private idx: number[] = [];
  private rand: () => number;
  private readonly c = new THREE.Color();

  constructor(seed = 1) {
    this.rand = mulberry32(seed);
  }

  get vertexCount(): number {
    return this.pos.length / 3;
  }

  private vert(p: THREE.Vector3, n: THREE.Vector3, u: number, v: number, paint: Paint, lp = p, ln = n): number {
    const i = this.pos.length / 3;
    this.pos.push(p.x, p.y, p.z);
    this.nrm.push(n.x, n.y, n.z);
    const hex = typeof paint.color === 'number' ? paint.color : paint.color(p, n, lp, ln);
    this.c.setHex(hex);
    const j = paint.jitter ? 1 + (this.rand() - 0.5) * paint.jitter : 1;
    this.col.push(this.c.r * j, this.c.g * j, this.c.b * j);
    this.uvs.push(u, v);
    this.kind.push(KIND[paint.kind ?? 'plain']);
    this.hw.push(paint.hull ?? 1);
    return i;
  }

  private tri(a: number, b: number, c: number): void {
    const P = this.pos;
    const N = this.nrm;
    const ux = P[b * 3]! - P[a * 3]!;
    const uy = P[b * 3 + 1]! - P[a * 3 + 1]!;
    const uz = P[b * 3 + 2]! - P[a * 3 + 2]!;
    const vx = P[c * 3]! - P[a * 3]!;
    const vy = P[c * 3 + 1]! - P[a * 3 + 1]!;
    const vz = P[c * 3 + 2]! - P[a * 3 + 2]!;
    const fx = uy * vz - uz * vy;
    const fy = uz * vx - ux * vz;
    const fz = ux * vy - uy * vx;
    if (fx * fx + fy * fy + fz * fz < 1e-12) return;
    const nx = N[a * 3]! + N[b * 3]! + N[c * 3]!;
    const ny = N[a * 3 + 1]! + N[b * 3 + 1]! + N[c * 3 + 1]!;
    const nz = N[a * 3 + 2]! + N[b * 3 + 2]! + N[c * 3 + 2]!;
    // Faces turn the way their vertex normals point.
    if (fx * nx + fy * ny + fz * nz < 0) this.idx.push(a, c, b);
    else this.idx.push(a, b, c);
  }

  /** A tube along a spine whose section can be any closed shape (sections may shrink to a point). */
  loft(spine: Spine | readonly THREE.Vector3[], section: Section, o: LoftOpts): Spine {
    const sp = spine instanceof Spine ? spine : new Spine(spine, o.up);
    const R = o.rings ?? 14;
    const S = o.segs ?? 18;
    const tile = o.tile ?? 26;
    const ease = o.ease ?? 0;
    const tAt = (i: number): number => {
      const u = i / R;
      return ease > 0 ? u + ease * (Math.sin(2 * Math.PI * u) / (2 * Math.PI)) * -1 : u;
    };
    const P: THREE.Vector3[][] = [];
    const Cs: THREE.Vector3[] = [];
    const Ts: THREE.Vector3[] = [];
    let circ = 0;
    for (let i = 0; i <= R; i++) {
      const t = tAt(i);
      sp.frame(t, F);
      Cs.push(F.C.clone());
      Ts.push(F.T.clone());
      const ring: THREE.Vector3[] = [];
      for (let j = 0; j < S; j++) {
        const th = (j / S) * Math.PI * 2;
        const [a, b] = section(t, th);
        ring.push(F.C.clone().addScaledVector(F.N, a).addScaledVector(F.B, b));
      }
      for (let j = 0; j < S; j++) circ += ring[j]!.distanceTo(ring[(j + 1) % S]!);
      P.push(ring);
    }
    const reps = Math.max(1, Math.round(circ / (R + 1) / tile));
    const base = this.vertexCount;
    const n = V();
    const dth = V();
    const dt = V();
    for (let i = 0; i <= R; i++) {
      const v = (tAt(i) * sp.length) / tile;
      for (let j = 0; j <= S; j++) {
        const jj = j % S;
        const p = P[i]![jj]!;
        dth.subVectors(P[i]![(jj + 1) % S]!, P[i]![(jj + S - 1) % S]!);
        dt.subVectors(P[Math.min(R, i + 1)]![jj]!, P[Math.max(0, i - 1)]![jj]!);
        n.crossVectors(dth, dt);
        const out = V().subVectors(p, Cs[i]!);
        if (n.lengthSq() < 1e-10 || out.lengthSq() < 1e-8) {
          // A ring shrunk to a point: the tip looks along the spine.
          if (out.lengthSq() < 1e-8) n.copy(Ts[i]!).multiplyScalar(i < R / 2 ? -1 : 1);
          else n.copy(out);
        } else if (n.dot(out) < 0) n.negate();
        n.normalize();
        this.vert(p, n, (j / S) * reps, v, o.paint);
      }
    }
    const W = S + 1;
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < S; j++) {
        const a = base + i * W + j;
        this.tri(a, a + W, a + 1);
        this.tri(a + 1, a + W, a + W + 1);
      }
    }
    const cap = (i: number, dir: number): void => {
      const tn = Ts[i]!.clone().multiplyScalar(dir);
      const c = this.vert(Cs[i]!, tn, 0.5, (tAt(i) * sp.length) / tile, o.paint);
      const first = this.vertexCount;
      for (let j = 0; j < S; j++) this.vert(P[i]![j]!, tn, (j / S) * reps, (tAt(i) * sp.length) / tile, o.paint);
      for (let j = 0; j < S; j++) this.tri(c, first + j, first + ((j + 1) % S));
    };
    if (o.capStart) cap(0, -1);
    if (o.capEnd) cap(R, 1);
    return sp;
  }

  /** A strip laid round a tube (a seam line, a bracelet); its path along the spine may zigzag. */
  band(sp: Spine, o: BandOpts): void {
    const S = o.segs ?? 40;
    const lift = o.lift ?? 0.3;
    const rows = [-0.5, 0, 0.5];
    const base = this.vertexCount;
    const grid: THREE.Vector3[][] = [];
    const cen: THREE.Vector3[][] = [];
    for (const r of rows) {
      const row: THREE.Vector3[] = [];
      const cr: THREE.Vector3[] = [];
      for (let j = 0; j < S; j++) {
        const th = (j / S) * Math.PI * 2;
        const t = o.at(th) + (r * o.width) / sp.length;
        sp.frame(t, F);
        // Rounded across: the middle row stands proudest.
        const rad = o.radius(t, th) + lift * (r === 0 ? 1.4 : 0.55);
        row.push(F.C.clone().addScaledVector(F.N, Math.cos(th) * rad).addScaledVector(F.B, Math.sin(th) * rad));
        cr.push(F.C.clone());
      }
      grid.push(row);
      cen.push(cr);
    }
    for (let r = 0; r < rows.length; r++) {
      for (let j = 0; j <= S; j++) {
        const p = grid[r]![j % S]!;
        const n = V().subVectors(p, cen[r]![j % S]!).normalize();
        this.vert(p, n, j / S, r / 2, o.paint);
      }
    }
    const W = S + 1;
    for (let r = 0; r < rows.length - 1; r++) {
      for (let j = 0; j < S; j++) {
        const a = base + r * W + j;
        this.tri(a, a + W, a + 1);
        this.tri(a + 1, a + W, a + W + 1);
      }
    }
  }

  /** Any geometry, moved by `m`. */
  add(geo: THREE.BufferGeometry, m: THREE.Matrix4 | null, paint: Paint): void {
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    if (!geo.getAttribute('normal')) geo.computeVertexNormals();
    const nor = geo.getAttribute('normal') as THREE.BufferAttribute;
    const uv = geo.getAttribute('uv') as THREE.BufferAttribute | undefined;
    const mat = m ?? new THREE.Matrix4();
    const nm = new THREE.Matrix3().getNormalMatrix(mat);
    let bb: THREE.Box3 | null = null;
    if (paint.uv === 'fit') {
      geo.computeBoundingBox();
      bb = geo.boundingBox!;
    }
    const tile = paint.tile ?? 24;
    const base = this.vertexCount;
    const lp = V();
    const ln = V();
    const p = V();
    const n = V();
    for (let i = 0; i < pos.count; i++) {
      lp.fromBufferAttribute(pos, i);
      ln.fromBufferAttribute(nor, i);
      p.copy(lp).applyMatrix4(mat);
      n.copy(ln).applyMatrix3(nm).normalize();
      let u = 0;
      let v = 0;
      if (bb) {
        u = (lp.x - bb.min.x) / Math.max(1e-6, bb.max.x - bb.min.x);
        v = (lp.y - bb.min.y) / Math.max(1e-6, bb.max.y - bb.min.y);
      } else if (paint.uv === 'box') {
        const ax = Math.abs(n.x);
        const ay = Math.abs(n.y);
        const az = Math.abs(n.z);
        if (ax >= ay && ax >= az) [u, v] = [p.z / tile, p.y / tile];
        else if (ay >= az) [u, v] = [p.x / tile, p.z / tile];
        else [u, v] = [p.x / tile, p.y / tile];
      } else if (uv) {
        u = uv.getX(i);
        v = uv.getY(i);
      }
      this.vert(p, n, u, v, paint, lp, ln);
    }
    const index = geo.getIndex();
    const count = index ? index.count : pos.count;
    for (let i = 0; i < count; i += 3) {
      const a = index ? index.getX(i) : i;
      const b = index ? index.getX(i + 1) : i + 1;
      const c = index ? index.getX(i + 2) : i + 2;
      this.tri(base + a, base + b, base + c);
    }
  }

  /** A flat shape extruded along its +z, then moved by `m`. */
  extrude(shape: THREE.Shape | THREE.Shape[], opts: THREE.ExtrudeGeometryOptions, m: THREE.Matrix4 | null, paint: Paint): void {
    const g = new THREE.ExtrudeGeometry(shape, { curveSegments: 6, ...opts });
    this.add(g, m, paint);
    g.dispose();
  }

  build(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uvs, 2));
    g.setAttribute('aKind', new THREE.Float32BufferAttribute(this.kind, 1));
    g.setAttribute('hullNormal', new THREE.Float32BufferAttribute(hullNormals(this.pos, this.nrm, this.hw), 3));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    return g;
  }
}

/**
 * Normals averaged over every vertex at the same spot, so the hull closes over
 * hard edges and seams, each as long as its vertex's outline is wide.
 */
function hullNormals(pos: readonly number[], nrm: readonly number[], width: readonly number[]): number[] {
  const q = (x: number): number => Math.round(x * 50);
  const sums = new Map<string, [number, number, number]>();
  const keys: string[] = [];
  for (let i = 0; i < pos.length; i += 3) {
    const k = `${q(pos[i]!)},${q(pos[i + 1]!)},${q(pos[i + 2]!)}`;
    keys.push(k);
    const s = sums.get(k) ?? [0, 0, 0];
    s[0] += nrm[i]!;
    s[1] += nrm[i + 1]!;
    s[2] += nrm[i + 2]!;
    sums.set(k, s);
  }
  const out: number[] = [];
  for (let i = 0; i < keys.length; i++) {
    const s = sums.get(keys[i]!)!;
    const l = (Math.hypot(s[0], s[1], s[2]) || 1) / width[i]!;
    out.push(s[0] / l, s[1] / l, s[2] / l);
  }
  return out;
}
