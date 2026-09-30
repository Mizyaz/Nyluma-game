import type { PartArt } from '../rigTypes';
import { DETAIL, INK, OUTLINE, PASTEL, flat } from '../style';
import { Rng, ellipsePath, fillPath, line, type Pt } from '../svg';

// Three real whales in the paintings' manner: the sperm whale, the blue
// whale and the bowhead, with their true proportions, drawn as flat pastel
// cutouts with thin even contours and a few naive details (stitches, a
// label, little leaves). Each is a set of parts animated in code (body,
// tail stock, flukes, pectoral fin, jaw, eyelid) plus a species spout.
//
// Anatomy is authored in body units: u runs along the body from the fluke
// insertion (0) to the snout (1), v runs down from the line of the back, and
// L is the body length. Each whale has a flat stretch of back (`back`), the
// line a platform's top follows: it is straight between its two ends and the
// outline leaves it with a level tangent, so a figure standing anywhere on it
// stands on the whale. Parts are placed in "local" pixels whose origin is the
// middle of that flat back; they are drawn at a few back lengths so the ink
// lines keep their width when a whale is scaled to its platform.

export type WhaleSpecies = 'sperm' | 'blue' | 'bowhead';
export const WHALE_SPECIES: readonly WhaleSpecies[] = ['sperm', 'blue', 'bowhead'];

/** Back lengths (logical px) each species is drawn at. */
export const WHALE_SIZES: Readonly<Record<WhaleSpecies, readonly number[]>> = {
  sperm: [96, 150, 210],
  blue: [150, 210],
  bowhead: [96, 150],
};

type UV = readonly [number, number];
type NodeSpec = readonly [number, number, string?];

interface Anatomy {
  /** u range of the flat back (rear, front). */
  back: UV;
  /** Tail stock joint (pivot of the tail part). */
  tail: UV;
  /** Fluke insertion (pivot of the flukes). */
  fluke: UV;
  /** Pectoral fin root. */
  fin: UV;
  eye: UV;
  /** Eye half-width, in L. */
  eyeR: number;
  /** Blowhole (the spout's base). */
  blow: UV;
  /** Jaw hinge, when the jaw is its own part. */
  jaw?: UV;
  /** Rest angle of the jaw (rad, + opens). */
  jawRest: number;
  /** Extents of the whole whale at rest, in body units (fins and flukes included). */
  ext: { u0: number; u1: number; v0: number; v1: number };
  /** Spout height, in L. */
  spout: number;
  /** Where the "14" tag is stitched on, if anywhere. */
  label?: UV;
}

const ANATOMY: Record<WhaleSpecies, Anatomy> = {
  blue: {
    back: [0.28, 0.86],
    tail: [0.13, 0.0555],
    fluke: [0, 0.058],
    fin: [0.738, 0.106],
    eye: [0.769, 0.05],
    eyeR: 0.0105,
    blow: [0.822, 0],
    jawRest: 0,
    ext: { u0: -0.105, u1: 1.01, v0: -0.03, v1: 0.18 },
    spout: 0.2,
  },
  sperm: {
    back: [0.37, 0.975],
    tail: [0.14, 0.079],
    fluke: [0, 0.085],
    fin: [0.64, 0.184],
    eye: [0.69, 0.157],
    eyeR: 0.011,
    blow: [0.962, 0],
    jaw: [0.715, 0.194],
    jawRest: 0.035,
    ext: { u0: -0.14, u1: 1.01, v0: -0.03, v1: 0.26 },
    spout: 0.16,
    label: [0.46, 0.105],
  },
  bowhead: {
    back: [0.23, 0.69],
    tail: [0.12, 0.095],
    fluke: [0, 0.1],
    fin: [0.6, 0.262],
    eye: [0.688, 0.166],
    eyeR: 0.012,
    blow: [0.7, 0],
    jaw: [0.708, 0.19],
    jawRest: 0,
    ext: { u0: -0.14, u1: 1.005, v0: -0.02, v1: 0.37 },
    spout: 0.17,
  },
};

// ------------------------------------------------------------ layout

export interface WhaleLayout {
  species: WhaleSpecies;
  /** Back length the art is drawn at (logical px). */
  size: number;
  /** Body length (snout to fluke insertion). */
  len: number;
  keys: { body: string; tail: string; fluke: string; fin: string; lid: string; jaw: string | null; spout: string };
  /** Part pivots at rest, local px (origin: middle of the flat back). */
  tail: Pt;
  fluke: Pt;
  fin: Pt;
  jaw: Pt | null;
  eye: Pt;
  blow: Pt;
  jawRest: number;
  /** The whale at rest, local px (for culling). */
  bounds: { x0: number; y0: number; x1: number; y1: number };
  /** Deepest point of the body below the back (px). */
  depth: number;
  /** Scale of the species' spout art for this size. */
  spoutScale: number;
  /** The stitched "14" tag on the flank (its own part so it never reads mirrored). */
  label: { at: Pt; scale: number } | null;
}

/** The drawn size nearest to a platform width (by ratio). */
export function whaleSizeFor(species: WhaleSpecies, width: number): number {
  let best = WHALE_SIZES[species][0]!;
  for (const s of WHALE_SIZES[species]) if (Math.abs(Math.log(width / s)) < Math.abs(Math.log(width / best))) best = s;
  return best;
}

function bodyLength(species: WhaleSpecies, size: number): number {
  const a = ANATOMY[species];
  return size / (a.back[1] - a.back[0]);
}

export function whaleLayout(species: WhaleSpecies, size: number): WhaleLayout {
  const a = ANATOMY[species];
  const L = bodyLength(species, size);
  const uc = (a.back[0] + a.back[1]) / 2;
  const at = (p: UV): Pt => [(p[0] - uc) * L, p[1] * L];
  const k = `whale.${species}.${size}`;
  return {
    species,
    size,
    len: L,
    keys: { body: `${k}.body`, tail: `${k}.tail`, fluke: `${k}.fluke`, fin: `${k}.fin`, lid: `${k}.lid`, jaw: a.jaw ? `${k}.jaw` : null, spout: `whale.spout.${species}` },
    tail: at(a.tail),
    fluke: at(a.fluke),
    fin: at(a.fin),
    jaw: a.jaw ? at(a.jaw) : null,
    eye: at(a.eye),
    blow: at(a.blow),
    jawRest: a.jawRest,
    bounds: { x0: (a.ext.u0 - uc) * L, y0: a.ext.v0 * L - a.spout * L, x1: (a.ext.u1 - uc) * L, y1: a.ext.v1 * L },
    depth: a.ext.v1 * L,
    spoutScale: (a.spout * L) / SPOUT_H[species],
    label: a.label ? { at: at(a.label), scale: Math.min(1.3, Math.max(0.6, L / 250)) } : null,
  };
}

// ------------------------------------------------------------ path toolkit

const n2 = (v: number): number => Math.round(v * 100) / 100;

interface Node {
  x: number;
  y: number;
  /** Straight segment to the next node. */
  s: boolean;
  /** Sharp corner. */
  c: boolean;
  /** Level with an adjacent straight segment. */
  g: boolean;
}

/** Maps body units to local px for one whale size. */
class Frame {
  constructor(
    readonly L: number,
    readonly uc: number,
  ) {}
  x(u: number): number {
    return (u - this.uc) * this.L;
  }
  y(v: number): number {
    return v * this.L;
  }
  p(u: number, v: number): Pt {
    return [this.x(u), this.y(v)];
  }
  nodes(spec: readonly NodeSpec[]): Node[] {
    return spec.map(([u, v, fl]) => ({ x: this.x(u), y: this.y(v), s: !!fl?.includes('s'), c: !!fl?.includes('c'), g: !!fl?.includes('g') }));
  }
  pts(spec: readonly UV[]): Pt[] {
    return spec.map(([u, v]) => this.p(u, v));
  }
}

const nodesOf = (pts: readonly Pt[], corners: readonly number[] = []): Node[] =>
  pts.map(([x, y], i) => ({ x, y, s: false, c: corners.includes(i), g: false }));

/**
 * Catmull-Rom tangents. Next to a straight segment a node either continues
 * the line (flag 'g': the flat back stays level into the head and the tail)
 * or takes a one-sided tangent from its curve (open ends where parts tuck
 * under each other); corners have none.
 */
function tangents(ns: readonly Node[], closed: boolean): Pt[] {
  const n = ns.length;
  const at = (i: number): Node | null => (closed ? ns[(i + n) % n]! : i < 0 || i >= n ? null : ns[i]!);
  return ns.map((p, i): Pt => {
    if (p.c) return [0, 0];
    const prev = at(i - 1);
    const next = at(i + 1);
    const len = (a: Node, b: Node): number => Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const inLine = !!prev?.s;
    const outLine = p.s;
    if (prev && next && inLine && outLine) return [0, 0];
    if (prev && next && inLine) {
      if (!p.g) return [next.x - p.x, next.y - p.y];
      const d = len(prev, p);
      const m = len(p, next);
      return [((p.x - prev.x) / d) * m, ((p.y - prev.y) / d) * m];
    }
    if (prev && next && outLine) {
      if (!p.g) return [p.x - prev.x, p.y - prev.y];
      const d = len(p, next);
      const m = len(prev, p);
      return [((next.x - p.x) / d) * m, ((next.y - p.y) / d) * m];
    }
    if (!prev && next) return [next.x - p.x, next.y - p.y];
    if (prev && !next) return [p.x - prev.x, p.y - prev.y];
    return [(next!.x - prev!.x) / 2, (next!.y - prev!.y) / 2];
  });
}

function seg(a: Node, b: Node, ta: Pt, tb: Pt): string {
  if (a.s) return `L${n2(b.x)} ${n2(b.y)}`;
  return `C${n2(a.x + ta[0] / 3)} ${n2(a.y + ta[1] / 3)} ${n2(b.x - tb[0] / 3)} ${n2(b.y - tb[1] / 3)} ${n2(b.x)} ${n2(b.y)}`;
}

function closedPath(ns: readonly Node[]): string {
  const t = tangents(ns, true);
  let d = `M${n2(ns[0]!.x)} ${n2(ns[0]!.y)}`;
  for (let i = 0; i < ns.length; i++) d += seg(ns[i]!, ns[(i + 1) % ns.length]!, t[i]!, t[(i + 1) % ns.length]!);
  return d + 'Z';
}

/** Contour of a closed outline from node i0 to node i1 (same curve as the fill). */
function run(ns: readonly Node[], i0: number, i1: number): string {
  const n = ns.length;
  const t = tangents(ns, true);
  let d = `M${n2(ns[i0 % n]!.x)} ${n2(ns[i0 % n]!.y)}`;
  for (let i = i0; i < i1; i++) d += seg(ns[i % n]!, ns[(i + 1) % n]!, t[i % n]!, t[(i + 1) % n]!);
  return d;
}

function openPath(ns: readonly Node[]): string {
  const t = tangents(ns, false);
  let d = `M${n2(ns[0]!.x)} ${n2(ns[0]!.y)}`;
  for (let i = 0; i < ns.length - 1; i++) d += seg(ns[i]!, ns[i + 1]!, t[i]!, t[i + 1]!);
  return d;
}

const curve = (pts: readonly Pt[]): string => openPath(nodesOf(pts));
const ink = (d: string, w = DETAIL, o = 1): string => line(d, INK, w, o);
const dot = (x: number, y: number, r: number, c: string, o = 1): string =>
  `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(r)}" fill="${c}"${o !== 1 ? ` opacity="${n2(o)}"` : ''}/>`;
const ring = (x: number, y: number, r: number, fill: string, w = DETAIL * 0.8): string =>
  `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(r)}" fill="${fill}" stroke="${INK}" stroke-width="${w}"/>`;

/**
 * A flat pastel cutout. The contour follows `runs` (index ranges of the
 * outline) so the ends where a part tucks under its neighbour stay open and
 * the joint shows no seam; without runs the whole outline is inked.
 */
function cutout(ns: readonly Node[], fill: string, o: { inner?: string; over?: string; runs?: readonly (readonly [number, number])[] } = {}): string {
  const d = closedPath(ns);
  let s = flat(d, fill, { stroke: 0, inner: o.inner, over: o.over });
  if (!o.runs) s += line(d, INK, OUTLINE);
  else for (const [a, b] of o.runs) s += line(run(ns, a, b), INK, OUTLINE);
  return s;
}

/** Piecewise-linear v(u) through points (any order of u). */
function lerpUV(pts: readonly UV[], u: number): number {
  const t = [...pts].sort((a, b) => a[0] - b[0]);
  if (u <= t[0]![0]) return t[0]![1];
  for (let i = 1; i < t.length; i++) {
    const a = t[i - 1]!;
    const b = t[i]!;
    if (u <= b[0]) return a[1] + ((b[1] - a[1]) * (u - a[0])) / (b[0] - a[0] || 1);
  }
  return t[t.length - 1]![1];
}

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function boxOf(ptsList: readonly (readonly Pt[])[], grow: number): Box {
  const b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const pts of ptsList) {
    for (const [x, y] of pts) {
      b.x0 = Math.min(b.x0, x);
      b.y0 = Math.min(b.y0, y);
      b.x1 = Math.max(b.x1, x);
      b.y1 = Math.max(b.y1, y);
    }
  }
  return { x0: b.x0 - grow, y0: b.y0 - grow, x1: b.x1 + grow, y1: b.y1 + grow };
}

const ptsOf = (ns: readonly Node[]): Pt[] => ns.map((n): Pt => [n.x, n.y]);

/** Wraps local-px markup into a part canvas around its pivot. */
function mkPart(key: string, markup: string, box: Box, pivot: Pt, grain = true): PartArt {
  const pad = OUTLINE + 2;
  const x0 = Math.floor(box.x0 - pad);
  const y0 = Math.floor(box.y0 - pad);
  const w = Math.ceil(box.x1 + pad) - x0;
  const h = Math.ceil(box.y1 + pad) - y0;
  return {
    key,
    w,
    h,
    px: pivot[0] - x0,
    py: pivot[1] - y0,
    body: `<g transform="translate(${-x0} ${-y0})">${markup}</g>`,
    // Large parts at the camera's zoom (drawn ~1:1, less to fill each frame).
    scale: Math.max(w, h) > 120 ? 1.5 : 2,
    grain,
  };
}

// ------------------------------------------------------------ naive details

/** Small almond eye looking ahead, with a sleepy upper lid and a crease. */
function eyeArt(cx: number, cy: number, r: number, lidFill: string): string {
  const rx = r * 1.3;
  const ry = r * 0.92;
  const d = ellipsePath(cx, cy, rx, ry);
  const lid = `M${n2(cx - rx - 1)} ${n2(cy - ry - 1)}H${n2(cx + rx + 1)}V${n2(cy - ry * 0.28)}Q${n2(cx)} ${n2(cy + ry * 0.05)} ${n2(cx - rx - 1)} ${n2(cy - ry * 0.3)}Z`;
  return (
    flat(d, PASTEL.cream, {
      stroke: DETAIL,
      inner: dot(cx + r * 0.32, cy + r * 0.12, r * 0.62, INK) + dot(cx + r * 0.5, cy - r * 0.08, r * 0.2, PASTEL.cream) + fillPath(lid, lidFill),
      over: ink(`M${n2(cx - rx)} ${n2(cy - ry * 0.3)}Q${n2(cx)} ${n2(cy + ry * 0.05)} ${n2(cx + rx)} ${n2(cy - ry * 0.28)}`, DETAIL * 0.8),
    }) + ink(curve([[cx - rx * 0.9, cy - ry * 1.55], [cx + r * 0.1, cy - ry * 2.05], [cx + rx * 1.05, cy - ry * 1.5]]), DETAIL * 0.8, 0.85)
  );
}

/** Closed lid for the blink: covers the eye in the skin colour. */
function lidArt(cx: number, cy: number, r: number, fill: string): string {
  const rx = r * 1.3 + 1.2;
  const ry = r * 0.92 + 1.2;
  return (
    flat(ellipsePath(cx, cy, rx, ry), fill, { stroke: DETAIL * 0.8 }) +
    ink(`M${n2(cx - rx * 0.85)} ${n2(cy - ry * 0.05)}Q${n2(cx)} ${n2(cy + ry * 0.75)} ${n2(cx + rx * 0.85)} ${n2(cy - ry * 0.1)}`, DETAIL)
  );
}

/** Short running stitches across a line (the paintings' mended seams). */
function stitches(pts: readonly Pt[], every: number, len: number, w = DETAIL * 0.85): string {
  let d = '';
  let acc = every / 2;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]!;
    const [bx, by] = pts[i]!;
    const sl = Math.hypot(bx - ax, by - ay) || 1;
    const nx = -(by - ay) / sl;
    const ny = (bx - ax) / sl;
    for (; acc < sl; acc += every) {
      const x = ax + ((bx - ax) * acc) / sl;
      const y = ay + ((by - ay) * acc) / sl;
      d += `M${n2(x - nx * len * 0.5 - ((bx - ax) / sl) * len * 0.2)} ${n2(y - ny * len * 0.5 - ((by - ay) / sl) * len * 0.2)}L${n2(x + nx * len * 0.5 + ((bx - ax) / sl) * len * 0.2)} ${n2(y + ny * len * 0.5 + ((by - ay) / sl) * len * 0.2)}`;
    }
    acc -= sl;
  }
  return ink(d, w, 0.9);
}

/** A little "~" wrinkle. */
function wrinkle(x: number, y: number, len: number, amp: number, w = DETAIL * 0.8, o = 0.6, color = INK): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= 4; i++) pts.push([x + (len * i) / 4, y + (i % 2 === 0 ? 0 : i === 1 ? -amp : amp)]);
  return line(curve(pts), color, w, o);
}

/** A small leaf on a stem (the paintings grow them on creatures). */
function leaf(x: number, y: number, len: number, ang: number, fill: string): string {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const at = (u: number, v: number): Pt => [x + c * u - s * v, y + s * u + c * v];
  const [tx, ty] = at(len, 0);
  const [ax, ay] = at(len * 0.45, -len * 0.32);
  const [bx, by] = at(len * 0.5, len * 0.3);
  const d = `M${n2(x)} ${n2(y)}Q${n2(ax)} ${n2(ay)} ${n2(tx)} ${n2(ty)}Q${n2(bx)} ${n2(by)} ${n2(x)} ${n2(y)}Z`;
  const [mx, my] = at(len * 0.8, 0);
  return flat(d, fill, { stroke: DETAIL }) + ink(`M${n2(x)} ${n2(y)}L${n2(mx)} ${n2(my)}`, DETAIL * 0.7, 0.8);
}

/** A stitched butter-yellow label with "14" on it, like the paintings' tags. */
function label14(cx: number, cy: number, w: number, h: number, rot: number): string {
  const x0 = -w / 2;
  const y0 = -h / 2;
  const r = h * 0.28;
  const d = `M${n2(x0 + r)} ${n2(y0)}H${n2(-x0 - r)}Q${n2(-x0)} ${n2(y0)} ${n2(-x0)} ${n2(y0 + r)}V${n2(-y0 - r)}Q${n2(-x0)} ${n2(-y0)} ${n2(-x0 - r)} ${n2(-y0)}H${n2(x0 + r)}Q${n2(x0)} ${n2(-y0)} ${n2(x0)} ${n2(-y0 - r)}V${n2(y0 + r)}Q${n2(x0)} ${n2(y0)} ${n2(x0 + r)} ${n2(y0)}Z`;
  const g = h * 0.62;
  // Hand-lettered 1 and 4.
  const one = `M${n2(-g * 0.62)} ${n2(-g * 0.22)}L${n2(-g * 0.36)} ${n2(-g * 0.5)}V${n2(g * 0.5)}`;
  const four = `M${n2(g * 0.42)} ${n2(g * 0.5)}V${n2(-g * 0.5)}L${n2(-g * 0.05)} ${n2(g * 0.18)}H${n2(g * 0.66)}`;
  const inset = h * 0.2;
  const border: Pt[] = [
    [x0 + inset, y0 + inset],
    [-x0 - inset, y0 + inset],
    [-x0 - inset, -y0 - inset],
    [x0 + inset, -y0 - inset],
    [x0 + inset, y0 + inset],
  ];
  return `<g transform="translate(${n2(cx)} ${n2(cy)}) rotate(${n2((rot * 180) / Math.PI)})">${flat(d, PASTEL.butter, { stroke: DETAIL })}${stitches(border, h * 0.3, h * 0.12, DETAIL * 0.6)}${ink(one + four, DETAIL * 0.95)}</g>`;
}

/**
 * A slender fin outline along an axis from its root: `lead` and `trail` are
 * half-widths (fractions of `wide`) along the fin; the root end is rounded.
 */
function finOutline(root: Pt, ang: number, len: number, wide: number, lead: readonly number[], trail: readonly number[], bend: number): Pt[] {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const at = (a: number, b: number): Pt => [root[0] + c * a - s * b, root[1] + s * a + c * b];
  const n = lead.length;
  const side1: Pt[] = [];
  const side2: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const mid = Math.sin(Math.PI * t) * bend * len;
    side1.push(at(t * len, mid + lead[i]! * wide));
    side2.push(at(t * len, mid - trail[i]! * wide));
  }
  const back = at(-wide * 0.45, 0);
  // Root (rounded) → one edge → tip → other edge back.
  return [back, ...side1.slice(0, n - 1), side1[n - 1]!, ...side2.slice(0, n - 1).reverse()];
}

// ------------------------------------------------------------ colours

const BLUE = {
  fill: PASTEL.periwinkle,
  deep: PASTEL.periwinkleDeep,
  pale: '#b9c1ea',
  throat: '#cdd2f1',
  edge: '#e6e9f8',
  patch: '#aab4e6',
  lid: '#8a97d4',
};

const SPERM = {
  fill: '#b5a3c0',
  deep: '#8d7a9b',
  pale: '#d6cadf',
  lip: PASTEL.cream,
  mouth: '#d596b4',
  lid: '#9f8cad',
};

const BOW = {
  fill: '#8f98a6',
  deep: '#6c7482',
  pale: '#b7bec8',
  chin: PASTEL.cream,
  spot: '#434955',
  band: '#d7dadf',
  baleen: '#5b6170',
  baleenLine: '#a9aebb',
  lid: '#7a8391',
};

// ------------------------------------------------------------ blue whale

function blueWhale(size: number): PartArt[] {
  const sp: WhaleSpecies = 'blue';
  const a = ANATOMY[sp];
  const L = bodyLength(sp, size);
  const F = new Frame(L, (a.back[0] + a.back[1]) / 2);
  const lay = whaleLayout(sp, size);
  const rng = new Rng(9100 + size);

  const body = F.nodes([
    [0.13, 0.024], [0.2, 0.0105], [0.28, 0, 'sg'], [0.86, 0, 'g'], [0.925, 0.0045], [0.966, 0.013], [0.99, 0.022],
    [0.998, 0.031], [1.004, 0.042], [0.996, 0.052], [0.972, 0.064], [0.93, 0.081], [0.86, 0.103], [0.77, 0.124],
    [0.66, 0.138], [0.55, 0.141], [0.44, 0.134], [0.34, 0.119], [0.25, 0.103], [0.18, 0.092], [0.13, 0.087, 's'],
  ]);
  const belly: UV[] = [[1.0, 0.045], [0.972, 0.064], [0.93, 0.081], [0.86, 0.103], [0.77, 0.124], [0.66, 0.138], [0.55, 0.141], [0.44, 0.134], [0.34, 0.119]];
  const throatTop: UV[] = [[0.995, 0.046], [0.93, 0.061], [0.84, 0.074], [0.74, 0.088], [0.64, 0.1], [0.55, 0.11], [0.5, 0.118], [0.47, 0.13]];

  // Pale throat with its long pleats, chin to navel.
  let inner = fillPath(`${curve(F.pts(throatTop))}L${n2(F.x(0.46))} ${n2(F.y(0.2))}L${n2(F.x(1.05))} ${n2(F.y(0.2))}Z`, BLUE.throat);
  for (const f of [0.2, 0.38, 0.56, 0.74, 0.9]) {
    const pts: Pt[] = [];
    const u1 = 0.53 - f * 0.05;
    for (let u = 0.975; u >= u1; u -= 0.035) {
      const top = lerpUV(throatTop, u);
      pts.push(F.p(u, top + (lerpUV(belly, u) - top) * f));
    }
    inner += line(curve(pts), BLUE.deep, DETAIL * 0.8, 0.9);
  }
  // Mottling: pale and deep dapples over the flank.
  for (let i = 0; i < Math.round(L / 9); i++) {
    const u = rng.range(0.16, 0.84);
    const v = rng.range(0.012, Math.max(0.02, lerpUV(throatTop, u) - 0.008));
    const r = rng.range(0.004, 0.011) * L;
    const pale = rng.chance(0.6);
    inner += fillPath(ellipsePath(F.x(u), F.y(v), r * rng.range(1.1, 1.8), r * rng.range(0.6, 0.9)), pale ? BLUE.pale : BLUE.deep, pale ? 0.85 : 0.55);
  }
  // A mended patch with running stitches.
  const pc = F.p(0.47, 0.062);
  const pw = 0.036 * L;
  const ph = 0.021 * L;
  // A soft, slightly lopsided patch, sewn on with running stitches.
  const patch: Pt[] = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const j = 1 + 0.12 * Math.sin(i * 2.3 + 1);
    patch.push([pc[0] + Math.cos(a) * pw * j, pc[1] + Math.sin(a) * ph * j]);
  }
  inner += flat(closedPath(nodesOf(patch)), BLUE.patch, { stroke: DETAIL * 0.7 });
  inner += stitches([...patch, patch[0]!], Math.max(3.4, 0.02 * L), 0.007 * L + 1.2, DETAIL * 0.65);

  const mouth = curve(F.pts([[0.998, 0.037], [0.96, 0.046], [0.9, 0.053], [0.84, 0.058], [0.803, 0.061], [0.788, 0.068]]));
  const e = F.p(...a.eye);
  const over =
    // Splash guard and the paired blowholes in front of the back.
    ink(curve(F.pts([[0.8, 0.0085], [0.822, 0.0045], [0.846, 0.0075]])), DETAIL * 0.9, 0.9) +
    ink(`M${n2(F.x(0.814))} ${n2(F.y(0.0125))}l${n2(0.012 * L)} 0.4M${n2(F.x(0.814))} ${n2(F.y(0.0165))}l${n2(0.012 * L)} 0.4`, DETAIL * 0.8, 0.8) +
    ink(mouth, OUTLINE * 0.85) +
    ink(curve(F.pts([[0.62, 0.012], [0.52, 0.02], [0.4, 0.024]])), DETAIL * 0.7, 0.35) +
    eyeArt(e[0], e[1], a.eyeR * L, BLUE.lid);

  // Tiny falcate dorsal fin far back, and the far flipper below the belly.
  const dorsal = F.nodes([[0.265, 0.006], [0.25, -0.002], [0.232, -0.012], [0.214, -0.022, 'c'], [0.222, -0.009], [0.219, 0.004], [0.212, 0.016]]);
  const farFin = nodesOf(finOutline(F.p(0.745, 0.116), 0.5, 0.1 * L, 0.02 * L, [0.5, 0.55, 0.5, 0.4, 0.25, 0], [0.5, 0.4, 0.33, 0.25, 0.15, 0], 0.04));
  let s = cutout(farFin, BLUE.deep) + cutout(dorsal, BLUE.fill);
  s += cutout(body, BLUE.fill, { inner, over, runs: [[0, body.length - 1]] });
  const bodyBox = boxOf([ptsOf(body), ptsOf(dorsal), ptsOf(farFin)], 0.012 * L);

  // Tail stock (tucks under the body at the front, over the flukes behind).
  const tail = F.nodes([
    [0.165, 0.0165], [0.13, 0.024], [0.08, 0.034], [0.03, 0.042], [0, 0.046, 's'],
    [0, 0.07], [0.05, 0.075], [0.1, 0.081], [0.13, 0.0855], [0.165, 0.0895, 's'],
  ]);
  const tailArt = cutout(tail, BLUE.fill, {
    inner: fillPath(ellipsePath(F.x(0.08), F.y(0.05), 0.012 * L, 0.006 * L), BLUE.pale, 0.8) + fillPath(ellipsePath(F.x(0.035), F.y(0.058), 0.007 * L, 0.004 * L), BLUE.deep, 0.5),
    runs: [[0, 4], [5, 9]],
  });

  const fluke = F.nodes([
    [0.012, 0.046], [-0.01, 0.042], [-0.035, 0.026], [-0.06, 0.006], [-0.082, -0.012], [-0.1, -0.024, 'c'], [-0.093, 0],
    [-0.083, 0.03], [-0.074, 0.058, 'c'], [-0.083, 0.086], [-0.093, 0.116], [-0.1, 0.14, 'c'], [-0.082, 0.128],
    [-0.06, 0.11], [-0.035, 0.09], [-0.01, 0.074], [0.012, 0.07],
  ]);
  const flukeArt = cutout(fluke, BLUE.fill, {
    over:
      ink(curve(F.pts([[0, 0.058], [-0.035, 0.058], [-0.068, 0.058]])), DETAIL * 0.8, 0.55) +
      line(curve(F.pts([[-0.02, 0.043], [-0.05, 0.022], [-0.08, 0.0]])), BLUE.edge, DETAIL, 0.9) +
      ink(`M${n2(F.x(-0.07))} ${n2(F.y(0.1))}l${n2(0.008 * L)} ${n2(-0.006 * L)}M${n2(F.x(-0.078))} ${n2(F.y(0.11))}l${n2(0.007 * L)} ${n2(-0.005 * L)}`, DETAIL * 0.7, 0.6),
    runs: [[0, 16]],
  });

  const finPts = finOutline(F.p(...a.fin), 0.44, 0.135 * L, 0.026 * L, [0.42, 0.55, 0.56, 0.5, 0.42, 0.3, 0.16, 0], [0.42, 0.4, 0.36, 0.31, 0.25, 0.18, 0.1, 0], 0.035);
  const finNodes = nodesOf(finPts);
  const lead = finPts.slice(2, 8);
  const finArt = cutout(finNodes, BLUE.fill, { over: line(curve(lead), BLUE.edge, DETAIL * 1.1, 0.95) });

  return [
    mkPart(lay.keys.body, s, bodyBox, [0, 0]),
    mkPart(lay.keys.tail, tailArt, boxOf([ptsOf(tail)], 0.006 * L), lay.tail),
    mkPart(lay.keys.fluke, flukeArt, boxOf([ptsOf(fluke)], 0.006 * L), lay.fluke),
    mkPart(lay.keys.fin, finArt, boxOf([finPts], 0.006 * L), lay.fin),
    mkPart(lay.keys.lid, lidArt(e[0], e[1], a.eyeR * L, BLUE.lid), boxOf([[e]], a.eyeR * L * 1.6 + 2), lay.eye),
  ];
}

// ------------------------------------------------------------ sperm whale

function spermWhale(size: number): PartArt[] {
  const sp: WhaleSpecies = 'sperm';
  const a = ANATOMY[sp];
  const L = bodyLength(sp, size);
  const F = new Frame(L, (a.back[0] + a.back[1]) / 2);
  const lay = whaleLayout(sp, size);
  const rng = new Rng(7300 + size);

  // Knuckles along the ridge from the low hump down the tail stock.
  const ridge: NodeSpec[] = [];
  const base = (u: number): number => 0.01 + ((0.33 - u) * 0.037) / 0.18;
  for (let u = 0.165; u < 0.32; u += 0.03) {
    ridge.push([u, base(u)]);
    ridge.push([u + 0.015, base(u + 0.015) - 0.0075]);
  }
  const body = F.nodes([
    [0.14, 0.05], ...ridge, [0.328, 0.008], [0.341, -0.004], [0.353, -0.008], [0.364, -0.003], [0.37, 0, 'sg'],
    [0.975, 0, 'g'], [0.991, 0.009], [0.999, 0.035], [1.003, 0.085], [0.999, 0.135], [0.988, 0.164], [0.967, 0.179],
    [0.92, 0.184], [0.85, 0.186], [0.77, 0.19], [0.72, 0.196], [0.68, 0.205], [0.6, 0.215], [0.5, 0.216],
    [0.41, 0.204], [0.32, 0.179], [0.25, 0.152], [0.2, 0.132], [0.14, 0.108, 's'],
  ]);

  // The mouth behind the lower jaw, seen when it hangs open.
  const mouth = F.nodes([[0.715, 0.189], [0.8, 0.187], [0.9, 0.184], [0.952, 0.183], [0.948, 0.203], [0.9, 0.211], [0.8, 0.216], [0.73, 0.216]]);
  // Wrinkled skin behind the head, squid scars on it, a pale belly.
  let inner = fillPath(curve(F.pts([[0.3, 0.26], [0.36, 0.19], [0.46, 0.175], [0.56, 0.185], [0.64, 0.23]])) + 'Z', SPERM.pale, 0.9);
  for (let i = 0; i < Math.round(L / 8); i++) {
    const u = rng.range(0.17, 0.64);
    const vTop = u < 0.33 ? base(u) + 0.02 : 0.03;
    const v = rng.range(vTop, u < 0.3 ? 0.11 : 0.175);
    inner += wrinkle(F.x(u), F.y(v), rng.range(0.02, 0.034) * L, 0.0035 * L + 0.4, DETAIL * 0.75, 0.55);
  }
  for (let i = 0; i < 5; i++) {
    const u = rng.range(0.78, 0.96);
    const v = rng.range(0.05, 0.15);
    inner += ring(F.x(u), F.y(v), rng.range(0.005, 0.009) * L, SPERM.pale, DETAIL * 0.6);
  }
  inner += ink(curve(F.pts([[0.52, 0.085], [0.6, 0.08], [0.66, 0.1], [0.68, 0.13]])), DETAIL * 0.8, 0.5);
  const e = F.p(...a.eye);
  const over =
    // S-shaped blowhole at the front of the head.
    ink(curve(F.pts([[0.948, 0.012], [0.955, 0.006], [0.962, 0.01], [0.969, 0.005]])), DETAIL, 0.95) +
    // Where the boxy head meets the body.
    ink(curve(F.pts([[0.672, 0.03], [0.664, 0.085], [0.672, 0.14]])), DETAIL * 0.8, 0.45) +
    eyeArt(e[0], e[1], a.eyeR * L, SPERM.lid);
  const farFin = nodesOf(finOutline(F.p(0.655, 0.196), 0.75, 0.07 * L, 0.03 * L, [0.5, 0.6, 0.62, 0.5, 0.28, 0], [0.5, 0.45, 0.4, 0.3, 0.16, 0], 0.03));
  let s = cutout(farFin, SPERM.deep) + cutout(mouth, SPERM.mouth, { inner: ink(curve(F.pts([[0.73, 0.206], [0.83, 0.204], [0.93, 0.198]])), DETAIL * 0.7, 0.5) });
  s += cutout(body, SPERM.fill, { inner, over, runs: [[0, body.length - 1]] });
  const bodyBox = boxOf([ptsOf(body), ptsOf(farFin), ptsOf(mouth)], 0.012 * L);

  const tail = F.nodes([
    [0.172, 0.042], [0.14, 0.05], [0.127, 0.0505], [0.114, 0.0565], [0.1, 0.0585], [0.07, 0.064], [0.035, 0.068], [0, 0.071, 's'],
    [0, 0.099], [0.04, 0.104], [0.075, 0.109], [0.105, 0.107], [0.14, 0.108], [0.172, 0.116, 's'],
  ]);
  let tailInner = '';
  for (let i = 0; i < 3; i++) tailInner += wrinkle(F.x(0.03 + i * 0.045), F.y(0.08 + (i % 2) * 0.012), 0.022 * L, 0.003 * L + 0.4, DETAIL * 0.7, 0.5);
  const tailArt = cutout(tail, SPERM.fill, { inner: tailInner, runs: [[0, 7], [8, 13]] });

  const fluke = F.nodes([
    [0.012, 0.072], [-0.012, 0.066], [-0.045, 0.046], [-0.08, 0.021], [-0.112, -0.003], [-0.132, -0.016, 'c'], [-0.119, 0.018],
    [-0.105, 0.052], [-0.093, 0.085, 'c'], [-0.105, 0.118], [-0.119, 0.152], [-0.132, 0.186, 'c'], [-0.112, 0.173],
    [-0.08, 0.149], [-0.045, 0.124], [-0.012, 0.104], [0.012, 0.098],
  ]);
  const flukeArt = cutout(fluke, SPERM.fill, {
    over:
      ink(curve(F.pts([[0, 0.085], [-0.045, 0.085], [-0.088, 0.085]])), DETAIL * 0.8, 0.5) +
      wrinkle(F.x(-0.1), F.y(0.035), 0.02 * L, 0.003 * L, DETAIL * 0.7, 0.45) +
      wrinkle(F.x(-0.1), F.y(0.14), 0.02 * L, 0.003 * L, DETAIL * 0.7, 0.45),
    runs: [[0, 16]],
  });

  const finPts = finOutline(F.p(...a.fin), 0.62, 0.085 * L, 0.036 * L, [0.46, 0.6, 0.66, 0.62, 0.48, 0.26, 0], [0.46, 0.44, 0.42, 0.38, 0.3, 0.16, 0], 0.03);
  const finArt = cutout(nodesOf(finPts), SPERM.fill, { over: wrinkle(finPts[3]![0] - 2, finPts[3]![1] - 3, 0.025 * L, 0.003 * L + 0.3, DETAIL * 0.7, 0.5) });

  // The narrow underslung lower jaw: cream lips, a row of conical teeth.
  const jaw = F.nodes([
    [0.715, 0.187], [0.78, 0.187], [0.86, 0.186], [0.922, 0.188], [0.94, 0.194], [0.933, 0.2], [0.87, 0.206],
    [0.8, 0.212], [0.74, 0.217], [0.706, 0.213], [0.699, 0.2],
  ]);
  let teeth = '';
  for (let u = 0.745; u <= 0.925; u += 0.0155) {
    const x = F.x(u);
    const y = F.y(0.1885);
    const hw = 0.0045 * L + 0.25;
    const th = 0.012 * L + 0.6;
    teeth += flat(`M${n2(x - hw)} ${n2(y + 1)}Q${n2(x - hw * 0.3)} ${n2(y - th * 0.7)} ${n2(x + hw * 0.15)} ${n2(y - th)}Q${n2(x + hw * 0.5)} ${n2(y - th * 0.5)} ${n2(x + hw)} ${n2(y + 1)}Z`, PASTEL.cream, { stroke: DETAIL * 0.7 });
  }
  const jawArt =
    teeth +
    cutout(jaw, SPERM.fill, {
      inner: fillPath(curve(F.pts([[0.7, 0.186], [0.8, 0.186], [0.95, 0.19], [0.95, 0.23], [0.7, 0.23]])) + 'Z', SPERM.lip),
      over: ink(curve(F.pts([[0.72, 0.2], [0.8, 0.2], [0.88, 0.197]])), DETAIL * 0.6, 0.5),
    });
  const jawBox = boxOf([ptsOf(jaw)], 0.016 * L);

  return [
    mkPart(lay.keys.body, s, bodyBox, [0, 0]),
    mkPart(lay.keys.tail, tailArt, boxOf([ptsOf(tail)], 0.008 * L), lay.tail),
    mkPart(lay.keys.fluke, flukeArt, boxOf([ptsOf(fluke)], 0.006 * L), lay.fluke),
    mkPart(lay.keys.fin, finArt, boxOf([finPts], 0.006 * L), lay.fin),
    mkPart(lay.keys.jaw!, jawArt, jawBox, lay.jaw!),
    mkPart(lay.keys.lid, lidArt(e[0], e[1], a.eyeR * L, SPERM.lid), boxOf([[e]], a.eyeR * L * 1.6 + 2), lay.eye),
  ];
}

// ------------------------------------------------------------ bowhead whale

function bowheadWhale(size: number): PartArt[] {
  const sp: WhaleSpecies = 'bowhead';
  const a = ANATOMY[sp];
  const L = bodyLength(sp, size);
  const F = new Frame(L, (a.back[0] + a.back[1]) / 2);
  const lay = whaleLayout(sp, size);
  const rng = new Rng(5500 + size);

  // The bowed mouth line: from the narrow snout up in a high arch and down
  // to the corner of the mouth under the eye.
  const arch: UV[] = [[0.99, 0.262], [0.968, 0.215], [0.935, 0.168], [0.89, 0.132], [0.835, 0.113], [0.785, 0.112], [0.75, 0.127], [0.725, 0.155], [0.708, 0.19]];
  const body = F.nodes([
    [0.12, 0.05], [0.17, 0.026], [0.205, 0.008], [0.23, 0, 'sg'], [0.69, 0, 'g'], [0.735, 0.009], [0.79, 0.032], [0.845, 0.07],
    [0.9, 0.12], [0.945, 0.175], [0.975, 0.225], [0.991, 0.258], [0.978, 0.27], [0.948, 0.234], [0.912, 0.197],
    [0.868, 0.169], [0.82, 0.158], [0.775, 0.16], [0.742, 0.18], [0.72, 0.212], [0.69, 0.265], [0.655, 0.315],
    [0.6, 0.328], [0.5, 0.316], [0.4, 0.292], [0.31, 0.252], [0.23, 0.207], [0.17, 0.17], [0.12, 0.14, 's'],
  ]);
  // Baleen hanging from the upper jaw, seen only as the lower lip drops.
  let baleen = '';
  for (let i = 0; i <= 22; i++) {
    const t = i / 22;
    const u = 0.985 - t * 0.265;
    const v = lerpUV(arch, u);
    baleen += `M${n2(F.x(u))} ${n2(F.y(v))}l${n2(-0.006 * L)} ${n2(0.045 * L)}`;
  }
  const baleenBand = `${curve(F.pts(arch))}L${n2(F.x(0.72))} ${n2(F.y(0.26))}L${n2(F.x(1.0))} ${n2(F.y(0.3))}Z`;
  let inner = fillPath(baleenBand, BOW.baleen) + line(baleen, BOW.baleenLine, DETAIL * 0.7, 0.8);
  // Pale scars on the flank.
  for (let i = 0; i < 4; i++) {
    const u = rng.range(0.3, 0.6);
    const v = rng.range(0.06, 0.2);
    inner += line(curve([F.p(u, v), F.p(u - 0.03, v + rng.range(-0.01, 0.012)), F.p(u - 0.055, v + rng.range(-0.006, 0.02))]), BOW.pale, DETAIL * 0.9, 0.8);
  }
  const e = F.p(...a.eye);
  const over =
    ink(curve(F.pts(arch)), DETAIL, 0.9) +
    // Twin blowholes on the crown; the dip behind it.
    ink(`M${n2(F.x(0.69))} ${n2(F.y(0.007))}q${n2(0.009 * L)} ${n2(-0.004 * L)} ${n2(0.018 * L)} ${n2(0.002 * L)}M${n2(F.x(0.694))} ${n2(F.y(0.013))}q${n2(0.009 * L)} ${n2(-0.004 * L)} ${n2(0.018 * L)} ${n2(0.002 * L)}`, DETAIL * 0.9, 0.9) +
    ink(curve(F.pts([[0.64, 0.012], [0.625, 0.04], [0.628, 0.075]])), DETAIL * 0.8, 0.5) +
    ink(curve(F.pts([[0.47, 0.03], [0.4, 0.04], [0.32, 0.045]])), DETAIL * 0.7, 0.35) +
    eyeArt(e[0], e[1], a.eyeR * L, BOW.lid);
  const farFin = nodesOf(finOutline(F.p(0.615, 0.28), 0.95, 0.08 * L, 0.036 * L, [0.5, 0.62, 0.62, 0.5, 0.28, 0], [0.5, 0.46, 0.4, 0.3, 0.16, 0], 0.03));
  let s = cutout(farFin, BOW.deep);
  s += cutout(body, BOW.fill, { inner, over, runs: [[0, body.length - 1]] });
  const bodyBox = boxOf([ptsOf(body), ptsOf(farFin)], 0.012 * L);

  const tail = F.nodes([
    [0.155, 0.032], [0.12, 0.05], [0.08, 0.065], [0.04, 0.074], [0, 0.08, 's'],
    [0, 0.12], [0.04, 0.124], [0.08, 0.13], [0.12, 0.14], [0.155, 0.158, 's'],
  ]);
  // The pale band of an old bowhead's tail stock, and a sprig of leaves.
  const band = closedPath(F.nodes([[0.078, 0.05, 'c'], [0.064, 0.1], [0.076, 0.15, 'c'], [0.018, 0.15, 'c'], [0.03, 0.105], [0.016, 0.075], [0.026, 0.05, 'c']]));
  const tailArt =
    leaf(F.x(0.1), F.y(0.062), 0.035 * L + 3, -2.2, PASTEL.leaf) +
    leaf(F.x(0.1), F.y(0.062), 0.03 * L + 3, -1.25, PASTEL.mint) +
    cutout(tail, BOW.fill, {
      inner: fillPath(band, BOW.band) + ink(curve(F.pts([[0.078, 0.05], [0.064, 0.1], [0.076, 0.15]])), DETAIL * 0.6, 0.5),
      runs: [[0, 4], [5, 9]],
    });
  const tailBox = boxOf([ptsOf(tail), [F.p(0.1, 0.062 - 0.05)]], 0.012 * L + 4);

  const fluke = F.nodes([
    [0.012, 0.08], [-0.015, 0.078], [-0.05, 0.06], [-0.085, 0.032], [-0.115, 0.004], [-0.137, -0.014, 'c'], [-0.121, 0.022],
    [-0.108, 0.062], [-0.1, 0.1, 'c'], [-0.108, 0.138], [-0.121, 0.178], [-0.137, 0.214, 'c'], [-0.115, 0.196],
    [-0.085, 0.168], [-0.05, 0.14], [-0.015, 0.122], [0.012, 0.12],
  ]);
  const flukeArt = cutout(fluke, BOW.fill, {
    inner: fillPath(`${curve(F.pts([[-0.137, -0.014], [-0.121, 0.022], [-0.108, 0.062], [-0.1, 0.1], [-0.108, 0.138], [-0.121, 0.178], [-0.137, 0.214]]))}L${n2(F.x(-0.16))} ${n2(F.y(0.2))}L${n2(F.x(-0.16))} ${n2(F.y(0))}Z`, BOW.band, 0.9),
    over: ink(curve(F.pts([[0, 0.1], [-0.05, 0.1], [-0.095, 0.1]])), DETAIL * 0.8, 0.5),
    runs: [[0, 16]],
  });

  const finPts = finOutline(F.p(...a.fin), 0.72, 0.1 * L, 0.042 * L, [0.46, 0.6, 0.66, 0.62, 0.48, 0.26, 0], [0.46, 0.44, 0.44, 0.4, 0.32, 0.18, 0], 0.04);
  const finArt = cutout(nodesOf(finPts), BOW.fill, { over: line(curve(finPts.slice(2, 6)), BOW.pale, DETAIL, 0.8) });

  // The huge lower lip with the cream chin and its dark "necklace" spots.
  const jaw = F.nodes([
    [0.708, 0.19], [0.725, 0.155], [0.75, 0.127], [0.785, 0.112], [0.835, 0.113], [0.89, 0.132], [0.935, 0.168],
    [0.968, 0.215], [0.99, 0.26], [0.997, 0.283], [0.986, 0.306], [0.957, 0.325], [0.9, 0.337], [0.82, 0.34],
    [0.72, 0.337], [0.665, 0.33], [0.648, 0.3], [0.655, 0.26], [0.672, 0.225], [0.69, 0.203],
  ]);
  const chin = `${curve(F.pts([[0.84, 0.36], [0.85, 0.3], [0.875, 0.255], [0.91, 0.225], [0.945, 0.2], [0.985, 0.19]]))}L${n2(F.x(1.03))} ${n2(F.y(0.19))}L${n2(F.x(1.03))} ${n2(F.y(0.36))}Z`;
  let spots = '';
  for (let i = 0; i < 16; i++) {
    const u = rng.range(0.86, 0.985);
    const v = rng.range(Math.max(0.2, lerpUV([[0.86, 0.3], [0.9, 0.24], [0.95, 0.21], [0.99, 0.265]], u) + 0.012), 0.33);
    const r = rng.range(0.0025, 0.0055) * L + 0.3;
    spots += fillPath(ellipsePath(F.x(u), F.y(v), r, r * 0.8), BOW.spot, 0.85);
  }
  const jawArt = cutout(jaw, BOW.fill, {
    inner: fillPath(chin, BOW.chin) + spots + ink(curve(F.pts([[0.84, 0.36], [0.85, 0.3], [0.875, 0.255], [0.91, 0.225], [0.945, 0.2], [0.985, 0.19]])), DETAIL * 0.7, 0.55),
    over: ink(curve(F.pts([[0.69, 0.3], [0.72, 0.318], [0.78, 0.326]])), DETAIL * 0.7, 0.45),
  });

  return [
    mkPart(lay.keys.body, s, bodyBox, [0, 0]),
    mkPart(lay.keys.tail, tailArt, tailBox, lay.tail),
    mkPart(lay.keys.fluke, flukeArt, boxOf([ptsOf(fluke)], 0.006 * L), lay.fluke),
    mkPart(lay.keys.fin, finArt, boxOf([finPts], 0.006 * L), lay.fin),
    mkPart(lay.keys.jaw!, jawArt, boxOf([ptsOf(jaw)], 0.008 * L), lay.jaw!),
    mkPart(lay.keys.lid, lidArt(e[0], e[1], a.eyeR * L, BOW.lid), boxOf([[e]], a.eyeR * L * 1.6 + 2), lay.eye),
  ];
}

// ------------------------------------------------------------ spouts, bubbles

/** Height of each spout drawing (logical px, base at the pivot). */
const SPOUT_H: Record<WhaleSpecies, number> = { blue: 96, sperm: 58, bowhead: 64 };
const SPRAY = '#e9f5f3';

/** A puffy plume from the blowhole: `path` is its spine, `w` its widths. */
function plume(spine: readonly Pt[], w: readonly number[], rng: Rng): { d: string; pts: Pt[] } {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < spine.length; i++) {
    const a = spine[Math.max(0, i - 1)]!;
    const b = spine[Math.min(spine.length - 1, i + 1)]!;
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / l;
    const ny = (b[0] - a[0]) / l;
    const p = spine[i]!;
    const j = i > 0 ? 1 + rng.range(-0.12, 0.12) : 1;
    left.push([p[0] + nx * w[i]! * j, p[1] + ny * w[i]! * j]);
    right.push([p[0] - nx * w[i]! * j, p[1] - ny * w[i]! * j]);
  }
  const tip = spine[spine.length - 1]!;
  const prev = spine[spine.length - 2]!;
  const l = Math.hypot(tip[0] - prev[0], tip[1] - prev[1]) || 1;
  const cap: Pt = [tip[0] + ((tip[0] - prev[0]) / l) * w[w.length - 1]! * 0.8, tip[1] + ((tip[1] - prev[1]) / l) * w[w.length - 1]! * 0.8];
  const pts = [...left, cap, ...right.reverse()];
  return { d: closedPath(nodesOf(pts)), pts };
}

function spoutPart(sp: WhaleSpecies): PartArt {
  const rng = new Rng(4400 + sp.length);
  const H = SPOUT_H[sp];
  let s = '';
  const all: Pt[][] = [];
  const drops = (cx: number, cy: number, r: number, n: number): void => {
    for (let i = 0; i < n; i++) {
      const a = rng.range(-Math.PI, 0);
      const d = r * rng.range(0.9, 1.35);
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d * 0.8;
      s += ring(x, y, rng.range(1.1, 2), SPRAY, DETAIL * 0.6);
      all.push([[x, y]]);
    }
  };
  if (sp === 'blue') {
    // Tall, straight column.
    const p = plume([[0, 0], [0.5, -H * 0.3], [1, -H * 0.58], [0, -H * 0.8], [-1, -H * 0.93]], [2.2, 5, 8, 12, 13], rng);
    s += flat(p.d, SPRAY, { stroke: DETAIL, over: ink(curve([[0, -H * 0.2], [0.5, -H * 0.45], [0, -H * 0.7]]), DETAIL * 0.6, 0.35) });
    all.push(p.pts);
    drops(0, -H * 0.86, 14, 6);
  } else if (sp === 'sperm') {
    // Bushy, thrown forward and to the left from the front of the head.
    const p = plume([[0, 0], [H * 0.18, -H * 0.3], [H * 0.36, -H * 0.58], [H * 0.5, -H * 0.8]], [2, 6, 10, 13], rng);
    s += flat(p.d, SPRAY, { stroke: DETAIL });
    all.push(p.pts);
    drops(H * 0.5, -H * 0.84, 13, 6);
  } else {
    // V-shaped: the bowhead's two blowholes.
    for (const side of [-1, 1]) {
      const p = plume([[side * 1.5, 0], [side * H * 0.12, -H * 0.32], [side * H * 0.24, -H * 0.62], [side * H * 0.32, -H * 0.84]], [1.8, 4.5, 7.5, 9], rng);
      s += flat(p.d, SPRAY, { stroke: DETAIL });
      all.push(p.pts);
      drops(side * H * 0.32, -H * 0.9, 9, 4);
    }
  }
  return { ...mkPart(`whale.spout.${sp}`, s, boxOf(all, 3), [0, 0], false), scale: 2 };
}

/** Pastel bubbles and droplets that puff out when a whale is landed on. */
export const WHALE_BUBBLES = 4;
export const WHALE_DROPS = 3;
const BUBBLE_COLORS = [PASTEL.aqua, PASTEL.blush, PASTEL.lavender, PASTEL.butter];
const DROP_COLORS = [PASTEL.aqua, PASTEL.periwinkle, PASTEL.mint];

function bubbleParts(): PartArt[] {
  const out: PartArt[] = [];
  BUBBLE_COLORS.forEach((c, i) => {
    const s = flat(ellipsePath(0, 0, 5, 5), c, { stroke: DETAIL, over: ink('M-2.6 -1.2Q-2.2 -2.8 -0.6 -3.1', DETAIL * 0.8, 0.8) });
    out.push({ ...mkPart(`whale.bubble.${i}`, s, { x0: -5, y0: -5, x1: 5, y1: 5 }, [0, 0], false), scale: 2 });
  });
  DROP_COLORS.forEach((c, i) => {
    const s = flat('M0 -6.5Q1.2 -3 3.4 0.6A3.5 3.5 0 1 1 -3.4 0.6Q-1.2 -3 0 -6.5Z', c, { stroke: DETAIL });
    out.push({ ...mkPart(`whale.drop.${i}`, s, { x0: -4, y0: -7, x1: 4, y1: 5 }, [0, 0], false), scale: 2 });
  });
  return out;
}

// ------------------------------------------------------------ registry

let cache: PartArt[] | null = null;

/** Every whale part, at every drawn size (registered in the art manifest). */
export function whaleParts(): PartArt[] {
  if (cache) return cache;
  const out: PartArt[] = [];
  for (const size of WHALE_SIZES.blue) out.push(...blueWhale(size));
  for (const size of WHALE_SIZES.sperm) out.push(...spermWhale(size));
  for (const size of WHALE_SIZES.bowhead) out.push(...bowheadWhale(size));
  for (const sp of WHALE_SPECIES) out.push(spoutPart(sp));
  out.push(...bubbleParts());
  out.push({ ...mkPart('whale.label', label14(0, 0, 23, 14, -0.06), { x0: -13, y0: -9, x1: 13, y1: 9 }, [0, 0]), scale: 2.5 });
  cache = out;
  return out;
}
