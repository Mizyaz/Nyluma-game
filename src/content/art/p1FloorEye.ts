import type { PartArt } from '../../render/2d/rig/rigTypes';
import { LINE, darkOf } from '../../render/2d/style';
import { ellipsePath, poly, smooth, type Pt } from '../../render/2d/svg';
import { comic, ink } from '../characters/kit';

// The slit eye in the floor. In the first painting, beside the big Gorti's
// hand, the floor of the 14th Room has split open: a lilac crust broken into
// plates round a slit, and out of the slit an eye looks up, under a heavy
// lid, with a red iris. Here it lies on the room's boards.
//
// It is drawn lying down, as the eye sees the floor from above it: the plates
// are squashed into depth and lifted toward the slit, each pushed a little
// apart from the next so that the dark under the crust shows between them;
// the far ones' inner faces come down as the heavy lid, the near ones show
// their thickness, and the cracks run on out into the boards. The eye in the
// slit is turned up toward the viewer a little, so that it reads.
//
// Four cards, one over another at the same depth (r01.ts): the slit's depth
// with the white of the eye, the iris twice (its pupil narrow, and wide when
// Gorti comes near), and the broken floor with the lid on top. The iris
// moves under the floor's card, so the lids cut it wherever it looks
// (scripts/floorEye.ts makes it follow Gorti). All four share one canvas and
// one pivot: the middle of the eye, on the floor.

/** Colours chosen by eye. */
const FE = {
  plates: ['#c7a0cb', '#d2acd5', '#bd96c2', '#d6b3d9', '#c49dc8', '#cfa8d2', '#ba93bf', '#d4b0d7'],
  crack: '#5e3c6b',
  edge: '#6a4576',
  /** The dark under the crust, seen between the plates. */
  under: '#4b2b54',
  lid: '#9a6aa3',
  socket: '#3f2246',
  glow: '#ff9ad6',
  white: '#fdf7fa',
  whiteShade: '#dccbe4',
  iris: '#d64a83',
  irisDeep: '#9e2f5c',
  irisLight: '#ef86ad',
  pupil: '#3b1734',
  boardCrack: '#7e6f60',
} as const;

/** How much the floor is squashed seen from the eye (its depth over its width). */
const K = 0.34;
/** How high the plates are lifted at the slit (world px). */
const LIFT = 8;
/** The slit: a lens this wide and high (half-sizes, world px), its middle lifted. */
const A = 33;
const HH = 12;
const CY = -LIFT;
/** How far the heavy lid comes down over the eye, as a share of its height. */
const LID = 0.42;

/** A point of the slit's edge: across it (u from -1 to 1), on its far (-1) or near (1) side. */
const lens = (u: number, side: 1 | -1, grow = 0): Pt => [u * (A + grow), CY + side * (HH + grow) * (1 - u * u)];

/** The lid's lower edge across the eye. */
const lidEdge = (u: number): Pt => [A * u, CY + HH * (1 - u * u) * (LID * 2 - 1)];

/** The slit's whole edge, `grow` px out. */
const ring = (grow: number): Pt[] => [
  ...Array.from({ length: 25 }, (_, i) => lens(-1 + i / 12, -1, grow)),
  ...Array.from({ length: 23 }, (_, i) => lens(1 - (i + 1) / 12, 1, grow)),
];

/**
 * The cracks round the slit: where each starts on its edge (u, side) and
 * the way it runs out across the floor (degrees on the floor: 0 to the
 * right, 90 toward the viewer), and how far.
 */
const CRACKS: { u: number; side: 1 | -1; deg: number; r: number }[] = [
  { u: 0.5, side: 1, deg: 52, r: 66 },
  { u: -0.15, side: 1, deg: 98, r: 74 },
  { u: -0.7, side: 1, deg: 142, r: 64 },
  { u: -0.96, side: -1, deg: 186, r: 78 },
  { u: -0.42, side: -1, deg: 236, r: 67 },
  { u: 0.12, side: -1, deg: 271, r: 75 },
  { u: 0.62, side: -1, deg: 306, r: 65 },
  { u: 0.97, side: -1, deg: 350, r: 76 },
];

/** How far each plate is pushed out from the slit, and lifted (world px). */
const PUSH = [1.6, 2.4, 1.2, 2.8, 1.8, 1, 2.2, 1.5];
const RAISE = [0.6, 1.8, 0.2, 1.2, 0.4, 2, 0.8, 1.4];

/** A point on the floor, `r` out at `deg`, lifted `h`. */
function floor(deg: number, r: number, h = 0): Pt {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a) * r, Math.sin(a) * r * K - h];
}

/** The lift of a plate at a share t of the way from the slit (0) to its edge (1). */
const liftAt = (t: number): number => LIFT * Math.pow(1 - t, 1.6);

/** A crack from the slit out to the floor's edge, wandering a little. */
function crackLine(i: number): Pt[] {
  const c = CRACKS[i]!;
  const start = lens(c.u, c.side);
  const [ex, ey] = floor(c.deg, c.r);
  const a = (c.deg * Math.PI) / 180;
  const n = 7;
  return Array.from({ length: n + 1 }, (_, j): Pt => {
    const t = j / n;
    // Along the floor from under the slit's edge, lifted as the plates are.
    const x = start[0] + (ex - start[0]) * t;
    const y = start[1] + LIFT + (ey - start[1] - LIFT) * t - liftAt(t);
    const wob = j === 0 || j === n ? 0 : Math.sin(j * 2.3 + i * 1.7) * (1.2 + 2 * t);
    return [x - Math.sin(a) * wob, y + Math.cos(a) * wob * K];
  });
}

/** The slit's edge from one crack's start to the next, going round as the cracks do. */
function rimBetween(i: number, j: number): Pt[] {
  const [a, b] = [CRACKS[i]!, CRACKS[j]!];
  const pts: Pt[] = [];
  const steps = 10;
  if (a.side === b.side) {
    for (let s = 0; s <= steps; s++) pts.push(lens(a.u + ((b.u - a.u) * s) / steps, a.side));
    return pts;
  }
  // Round a corner: along a's side to its end, then back along b's side.
  const end = a.side === 1 ? -1 : 1;
  for (let s = 0; s <= steps; s++) pts.push(lens(a.u + ((end - a.u) * s) / steps, a.side));
  for (let s = 1; s <= steps; s++) pts.push(lens(end + ((b.u - end) * s) / steps, b.side));
  return pts;
}

interface Plate {
  pts: Pt[];
  outer: Pt[];
  near: boolean;
  /** Where it was pushed to. */
  shift: Pt;
  mid: number;
}

/** The plate between crack k and the next: out along one crack, along its broken edge, in along the next, round the slit. */
function plate(k: number): Plate {
  const j = (k + 1) % CRACKS.length;
  const [a, b] = [CRACKS[k]!, CRACKS[j]!];
  const d1 = b.deg + (b.deg < a.deg ? 360 : 0);
  // The broken edge: a few straight bits, not a curve.
  const outer: Pt[] = [];
  const segs = 4;
  for (let i = 0; i <= segs; i++) {
    const s = i / segs;
    const inner = i > 0 && i < segs;
    const deg = a.deg + (d1 - a.deg) * s + (inner ? Math.sin(k * 5.1 + i * 2.7) * 3 : 0);
    const r = a.r + (b.r - a.r) * s + (inner ? 3 + Math.sin(k * 7.1 + i * 3.3) * 5 : 0);
    outer.push(floor(deg, r));
  }
  const pts = [...crackLine(k).slice(0, -1), ...outer.slice(0, -1), ...crackLine(j).reverse().slice(0, -1), ...rimBetween(k, j).reverse().slice(0, -1)];
  const mid = (a.deg + d1) / 2;
  const m = (mid * Math.PI) / 180;
  const shift: Pt = [Math.cos(m) * PUSH[k]!, Math.sin(m) * PUSH[k]! * K - RAISE[k]!];
  // Near plates face the viewer with their outer edge.
  return { pts, outer, near: Math.sin(m) > 0.25, shift, mid };
}

const PLATES = CRACKS.map((_, k) => plate(k));

/** The patch's outline before the plates were pushed apart. */
const OUTLINE: Pt[] = PLATES.flatMap((p) => p.outer.slice(0, -1));

/** A steady wobble in -1..1, the same every time. */
const jitter = (n: number): number => {
  const v = Math.sin(n * 12.9898) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
};

/** A crack running on into the boards from the end of crack i: a few straight bits, bending; every other one forks. */
function boardCrackRuns(i: number): Pt[][] {
  const c = CRACKS[i]!;
  const a0 = (c.deg * Math.PI) / 180;
  const run = (x: number, z: number, from: number, steps: number, seed: number): Pt[] => {
    const pts: Pt[] = [[x, z * K]];
    for (let s = 1; s <= steps; s++) {
      const a = from + jitter(seed + s * 1.37) * 0.5;
      const step = 4 + 3 * Math.abs(jitter(seed * 0.7 + s * 5.3));
      x += Math.cos(a) * step;
      z += Math.sin(a) * step;
      pts.push([x, z * K]);
    }
    return pts;
  };
  const main = run(Math.cos(a0) * c.r, Math.sin(a0) * c.r, a0, 3 + (i % 2), i * 7.1);
  if (i % 2) return [main];
  const [fx, fy] = main[1]!;
  return [main, run(fx, fy / K, a0 + (i % 4 ? -0.75 : 0.75), 2, i * 3.3 + 1)];
}

/** Draws a run thinning out toward its end. */
function boardCrack(i: number): string {
  return boardCrackRuns(i)
    .map((pts, k) => {
      const w = k ? LINE.fine : LINE.detail * 1.1;
      return pts
        .slice(1)
        .map((p, j) => ink(`M${pts[j]![0].toFixed(2)} ${pts[j]![1].toFixed(2)}L${p[0].toFixed(2)} ${p[1].toFixed(2)}`, w * (1 - (0.65 * j) / (pts.length - 1)), FE.boardCrack, 0.85))
        .join('');
    })
    .join('');
}

/** The floor broken round the slit, the heavy lid and its lashes (the top card). */
function brokenFloor(): string {
  let s = '';
  CRACKS.forEach((_, i) => (s += boardCrack(i)));
  // The dark under the crust, round the slit (which the cards beneath fill).
  s += `<path d="${poly(OUTLINE)}${poly(ring(0).slice().reverse())}" fill="${FE.under}" fill-rule="evenodd"/>`;
  PLATES.forEach((p, k) => {
    const color = FE.plates[k]!;
    let g = '';
    // A near plate's thickness, under its outer edge.
    if (p.near) {
      const band = [...p.outer, ...p.outer.slice().reverse().map(([x, y]): Pt => [x, y + 2.8])];
      g += comic(poly(band), darkOf(color, 0.3), { line: LINE.fine, ink: FE.edge });
    }
    const a = CRACKS[k]!;
    const r = (a.r + CRACKS[(k + 1) % CRACKS.length]!.r) / 2;
    const veins = ink(smooth([floor(p.mid - 4, r * 0.4, liftAt(0.32)), floor(p.mid + 3, r * 0.64, liftAt(0.62)), floor(p.mid, r * 0.88)], 0.7, false), LINE.fine, darkOf(color, 0.22), 0.8);
    g += comic(poly(p.pts), color, { line: LINE.small, ink: FE.edge, rim: [3.4, -1.3], glint: [-1, 1], hatch: p.near ? 0 : 2.2, over: veins });
    s += `<g transform="translate(${p.shift[0].toFixed(2)} ${p.shift[1].toFixed(2)})">${g}</g>`;
  });
  // A pink light from the slit on the plates nearest it.
  s += `<defs><radialGradient id="fe-glow"><stop offset="0" stop-color="${FE.glow}" stop-opacity="0.5"/><stop offset="1" stop-color="${FE.glow}" stop-opacity="0"/></radialGradient>`;
  s += `<clipPath id="fe-plates"><path d="${poly(OUTLINE)}${poly(ring(0).slice().reverse())}" clip-rule="evenodd"/></clipPath></defs>`;
  s += `<path d="${ellipsePath(0, CY, A * 1.6, A * 0.8)}" fill="url(#fe-glow)" clip-path="url(#fe-plates)" style="mix-blend-mode:screen"/>`;
  // The heavy lid: the far plates' inner faces, come down over the eye.
  const steps = 18;
  const top = Array.from({ length: steps + 1 }, (_, i) => lens(-1 + (2 * i) / steps, -1, 3));
  const low = Array.from({ length: steps + 1 }, (_, i) => lidEdge(1 - (2 * i) / steps));
  s += comic(poly([...top, ...low]), FE.lid, { line: LINE.small, ink: FE.crack, rim: [2.4, -1.5], glint: [-0.9, 1.1], hatch: 2 });
  // A crease over the lid, and the lashes: cracks flicking out of its corners.
  s += ink(smooth([lens(-0.72, -1, 6.5), lens(0, -1, 7.6), lens(0.7, -1, 6.2)], 0.8, false), LINE.detail, FE.crack, 0.75);
  for (const [u, dx, dy] of [[0.76, 5.5, -6], [0.88, 8, -3.4], [0.97, 8.5, 0.6], [-0.84, -6, -5], [-0.96, -8.5, -1.2]] as const) {
    const [x, y] = lidEdge(u);
    s += ink(`M${x} ${y}q${dx * 0.55} ${dy * 0.15} ${dx} ${dy}`, LINE.detail, FE.crack);
  }
  // The lower lid's rim, thin.
  s += ink(poly(Array.from({ length: 13 }, (_, i) => lens(-0.92 + (1.84 * i) / 12, 1, 0.5)), false), LINE.detail, FE.crack);
  // Bits of the crust lying flat on the boards, their broken edges showing.
  for (const [deg, r, size, turn, c] of [[18, 90, 5.5, 20, 0], [128, 86, 4.6, -35, 3], [202, 97, 6.2, 60, 5], [334, 92, 4.2, -10, 1], [74, 88, 3.8, 45, 6]] as const) {
    const a0 = (deg * Math.PI) / 180;
    const [cx, cz] = [Math.cos(a0) * r, Math.sin(a0) * r];
    const t = (turn * Math.PI) / 180;
    const bit = ([[-1, -0.2], [-0.25, -0.85], [0.95, -0.35], [0.5, 0.7], [-0.55, 0.55]] as const).map(([u, v]): Pt => {
      const [px, pz] = [u * size, v * size * 0.8];
      return [cx + px * Math.cos(t) - pz * Math.sin(t), (cz + px * Math.sin(t) + pz * Math.cos(t)) * K - 1.3];
    });
    const color = FE.plates[c]!;
    s += comic(poly(bit.map(([x, y]): Pt => [x, y + 1.3])), darkOf(color, 0.32), { line: LINE.fine, ink: FE.edge });
    s += comic(poly(bit), color, { line: LINE.fine, ink: FE.edge, glint: [-0.5, 0.6] });
  }
  return s;
}

/** Into the slit: its dark depth, the pink light down in it, and the white of the eye (the bottom card). */
function slitDepth(): string {
  let s = `<path d="${poly(ring(5))}" fill="${FE.socket}"/>`;
  s += `<defs><radialGradient id="fe-deep"><stop offset="0" stop-color="${FE.glow}" stop-opacity="0.55"/><stop offset="1" stop-color="${FE.glow}" stop-opacity="0"/></radialGradient></defs>`;
  s += `<path d="${ellipsePath(0, CY, A + 5, HH + 5)}" fill="url(#fe-deep)"/>`;
  // The white, round as an eye is: shaded under the lid and toward its lower corner.
  const lidShade = poly([
    ...Array.from({ length: 19 }, (_, i) => lidEdge(-1 + i / 9)),
    ...Array.from({ length: 19 }, (_, i): Pt => {
      const [x, y] = lidEdge(1 - i / 9);
      return [x, y + 3 * (1 - Math.pow(x / A, 2))];
    }),
  ]);
  s += comic(poly(ring(-1.3)), FE.white, { line: 0, tone: FE.whiteShade, shade: lidShade, rim: [5, -2] });
  return s;
}

/** The iris, looking straight out, its pupil a slit or wide open (the middle cards). */
function iris(wide: boolean): string {
  const [x, y] = [0, CY + 1.4];
  const [rx, ry] = [10.5, 9.8];
  let s = `<path d="${ellipsePath(x, y, rx, ry)}" fill="${FE.iris}"/>`;
  s += `<path d="${ellipsePath(x + 1, y + 1.1, rx * 0.62, ry * 0.62)}" fill="${FE.irisLight}" opacity="0.55"/>`;
  // Fibres out from the pupil.
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.2;
    const [c, sn] = [Math.cos(a), Math.sin(a)];
    s += ink(`M${x + c * rx * 0.36} ${y + sn * ry * 0.36}L${x + c * rx * 0.86} ${y + sn * ry * 0.86}`, LINE.fine * 0.8, FE.irisDeep, 0.55);
  }
  s += ink(ellipsePath(x, y, rx, ry), LINE.detail, FE.irisDeep);
  const [px, py] = wide ? [5.6, 7.6] : [1.9, 7.8];
  s += `<path d="${ellipsePath(x, y, px, py)}" fill="${FE.pupil}"/>`;
  s += `<path d="${ellipsePath(x + 3.8, y - 4, 2.3, 2)}" fill="#ffffff"/><path d="${ellipsePath(x - 3.2, y + 4.2, 1.1, 1)}" fill="#ffffff" opacity="0.75"/>`;
  return s;
}

/** The shared canvas: the patch with its cracks and bits, padded. */
const BOUNDS = (() => {
  const pts: Pt[] = [...OUTLINE, ...CRACKS.flatMap((_, i) => boardCrackRuns(i).flat()), floor(202, 104), floor(18, 97), lens(0, -1, 9)];
  const pad = 5;
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { x0: Math.floor(Math.min(...xs) - pad), y0: Math.floor(Math.min(...ys) - pad), x1: Math.ceil(Math.max(...xs) + pad), y1: Math.ceil(Math.max(...ys) + pad + 3) };
})();

function part(key: string, body: string): PartArt {
  const { x0, y0, x1, y1 } = BOUNDS;
  return { key, w: x1 - x0, h: y1 - y0, px: -x0, py: -y0, body: `<g transform="translate(${-x0} ${-y0})">${body}</g>` };
}

/** Where its pivot (the middle of the eye, on the floor) is in its card, as origins. */
export const FLOOR_EYE_ORIGIN = { ox: -BOUNDS.x0 / (BOUNDS.x1 - BOUNDS.x0), oy: -BOUNDS.y0 / (BOUNDS.y1 - BOUNDS.y0) };

/** How far the iris can look (world px) before the lids close over it. */
export const FLOOR_EYE_LOOK = { x: 15, up: 3, down: 1.6 };

/** The four cards, bottom to top. */
export function floorEyeParts(): PartArt[] {
  return [part('p1.flooreye.under', slitDepth()), part('p1.flooreye.iris', iris(false)), part('p1.flooreye.iris.wide', iris(true)), part('p1.flooreye', brokenFloor())];
}
