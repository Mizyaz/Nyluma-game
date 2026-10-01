import type { DoorArt, DoorLeaf, DoorPiece } from '../../../render/2d/fx/doorway';
import { ellipsePath, hashSeed, rrect } from '../../../render/2d/svg';
import { leaf } from '../../characters/kit';
import {
  archPts,
  barkRoot,
  circleP,
  comic,
  crystals,
  darkOf,
  doorPart,
  fillP,
  glowDisc,
  ink,
  leafPart,
  LINE,
  resample,
  Rng,
  shard,
  smooth,
  type Pt,
} from './doorKit';

// The 14th Room's root gate: where the roots that broke into the box have
// grown into an arch, and under it the way on runs into a short tunnel of
// earth and roots that ends at the paper door. The arch is thick: a near
// face Gorti passes behind and a far face he passes before, the two joined
// overhead by ribs of root seen in perspective, so it is deep, and it
// swings against the room as he walks. Thick roots climb from splayed feet
// on either side and cross at the crown, where a cluster of crystals grows
// like a keystone; to the right the roots run on as the tunnel's roof. As
// Gorti comes near, the crystals glow, buds along the roots open one after
// another, the arch draws itself up a little, and a root sprite pops up
// over the crown to look at him; in the tunnel little mushrooms light up.

const C = {
  root: '#c5a7d8',
  root2: '#b89ace',
  root3: '#d6c1e6',
  back: '#ab90c2',
  back2: '#9f84b6',
  back3: '#bba4d0',
  earth: '#c9adb4',
  earthTop: '#b5959f',
  earthLow: '#dbc3c5',
  strata: '#b79aa3',
  pebble: '#e3d6dc',
  crystal: '#a6e3d5',
  crystal2: '#c4efe5',
  crystal3: '#d6ccf4',
  leaf: '#b3d59f',
  bud: '#f0a9c2',
  petal: '#fbd2df',
  heart: '#f6d27a',
  cap: '#f3bfd0',
  stem: '#fbf1e6',
  sprite: '#eec8da',
  spriteBelly: '#f8e2ea',
  sprout: '#a9d394',
  white: '#fffaf6',
  iris: '#7fcab8',
  pupil: '#3a2f44',
  cheek: '#f29db4',
} as const;

const f = (n: number): number => Math.round(n * 100) / 100;

/** The arch's centre line: half its span, where its sides turn over, and its crown. */
const SPAN = 98;
const SPRING = 146;
const RISE = 108;
const PEAK = 16;
const CROWN_Y = -(SPRING + RISE + PEAK);
/** Its far face (behind Gorti) and near face (before him), from its middle. */
const BACK = -52;
const FRONT = 40;
/** The tunnel's wall, behind the far face, and how far it runs (to behind the paper door). */
const WALL = -58;
const WALL_X0 = 88;
const WALL_X1 = 300;
const ROOF = -232;
/** How much the arch draws itself up as Gorti comes. */
const LIFT = 0.016;

/** The centre line, from the foot of the left side over the crown to the foot of the right. */
const CENTRE = resample(archPts(SPAN * 2, SPRING + RISE, { rise: RISE, peak: PEAK, n: 64 }), 4, false);

/** A point at fraction u along the centre line, pushed out (positive) or in by `off`. */
function at(u: number, off = 0): Pt {
  const n = CENTRE.length;
  const fi = Math.max(0, Math.min(n - 1, u * (n - 1)));
  const i0 = Math.floor(fi);
  const i1 = Math.min(n - 1, i0 + 1);
  const t = fi - i0;
  const a = CENTRE[i0]!;
  const b = CENTRE[i1]!;
  const pa = CENTRE[Math.max(0, i0 - 2)]!;
  const pb = CENTRE[Math.min(n - 1, i0 + 3)]!;
  const dx = pb[0] - pa[0];
  const dy = pb[1] - pa[1];
  const l = Math.hypot(dx, dy) || 1;
  return [a[0] + (b[0] - a[0]) * t + (dy / l) * off, a[1] + (b[1] - a[1]) * t - (dx / l) * off];
}

/** A root along the centre line from u0 to u1, wandering by `off(u)`. */
function rootPath(u0: number, u1: number, off: (u: number) => number): Pt[] {
  const steps = Math.max(3, Math.round(Math.abs(u1 - u0) * 70));
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = u0 + ((u1 - u0) * i) / steps;
    pts.push(at(u, off(u)));
  }
  return pts;
}

/** A root that ends in a curl: it runs on round a shrinking circle, clockwise on the screen (`side` 1) or not. */
function curled(pts: readonly Pt[], r: number, turns: number, side: 1 | -1): Pt[] {
  const e = pts[pts.length - 1]!;
  const p = pts[pts.length - 2]!;
  const l = Math.hypot(e[0] - p[0], e[1] - p[1]) || 1;
  const tx = (e[0] - p[0]) / l;
  const ty = (e[1] - p[1]) / l;
  const c: Pt = [e[0] - side * ty * r, e[1] + side * tx * r];
  const a0 = Math.atan2(e[1] - c[1], e[0] - c[0]);
  const out: Pt[] = [...pts];
  for (let i = 1; i <= 8; i++) {
    const a = a0 + side * (i / 8) * turns * Math.PI * 2;
    const rr = r * (1 - (i / 8) * 0.45);
    out.push([c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr]);
  }
  return out;
}

interface Face {
  fills: readonly [string, string, string];
  seed: number;
  /** Thickness (the near face is a little slimmer). */
  k: number;
}

/** A wavy line from p0 to p1: `waves` swings of `amp` px across it. */
function wavy(p0: Pt, p1: Pt, amp: number, waves: number, phase: number, n = 14): Pt[] {
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const l = Math.hypot(dx, dy) || 1;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const o = amp * Math.sin(u * waves * Math.PI * 2 + phase) * Math.min(1, 0.35 + u * 5, 0.35 + (1 - u) * 5);
    pts.push([p0[0] + dx * u + (-dy / l) * o, p0[1] + dy * u + (dx / l) * o]);
  }
  return pts;
}

/** A root winding round a trunk: the runs behind it and the runs before it, drawn apart. */
function vine(u0: number, u1: number, amp: number, turns: number, ph: number, w0: number, w1: number, fill: string, seed: number): { behind: string; before: string } {
  const n = Math.max(8, Math.round(Math.abs(u1 - u0) * 120));
  const runs: { pts: Pt[]; front: boolean; a: number; b: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = u0 + (u1 - u0) * t;
    const th = t * turns * Math.PI * 2 + ph;
    const p = at(u, amp * Math.sin(th));
    const front = Math.cos(th) >= 0;
    const last = runs[runs.length - 1];
    if (!last || last.front !== front) {
      // Each run starts where the last ended, so they meet round the trunk's side.
      const prev = last ? last.pts[last.pts.length - 1]! : null;
      runs.push({ pts: prev ? [prev, p] : [p], front, a: t, b: t });
    } else {
      last.pts.push(p);
      last.b = t;
    }
  }
  let behind = '';
  let before = '';
  runs.forEach((r, i) => {
    if (r.pts.length < 2) return;
    const d = barkRoot(r.pts, w0 + (w1 - w0) * r.a, w0 + (w1 - w0) * r.b, r.front ? fill : darkOf(fill, 0.08), seed + i, { grooves: 1 });
    if (r.front) before += d;
    else behind += d;
  });
  return { behind, before };
}

/** One face of the arch: two root trunks climbing from buttressed feet, crossing at the crown, a root winding round each. */
function face(o: Face & { vines: boolean }): string {
  const rng = new Rng(o.seed);
  const [a, b, c] = o.fills;
  const k = o.k;
  const ph = (): number => rng.range(0, Math.PI * 2);
  let s = '';
  // Feet first: buttress roots spreading on the floor and gripping it.
  for (const side of [-1, 1]) {
    const x = side * SPAN;
    const feet: [Pt[], number, string][] = [
      [[[x + side * 4, -50], [x + side * 18, -22], [x + side * 40, -7], [x + side * 66, 2]], 20, b],
      [[[x - side * 6, -44], [x - side * 16, -17], [x - side * 30, -4], [x - side * 46, 2]], 16, c],
      [[[x + side * 34, -6], [x + side * 56, -10], [x + side * 78, 1]], 7, b],
      [[[x - side * 28, -4], [x - side * 40, -8], [x - side * 56, 1]], 6, a],
    ];
    feet.forEach(([p, w, fill], i) => (s += barkRoot(p, w * k, 3, fill, o.seed + i * 7 + (side > 0 ? 50 : 0), { grooves: i < 2 ? 2 : 1 })));
  }
  // The roots winding round the trunks: their far runs go behind them.
  const vines = o.vines
    ? [vine(0.0, 0.43, 17 * k, 3.2, ph(), 11 * k, 4, c, o.seed + 30), vine(1.0, 0.57, 17 * k, 3.2, ph(), 11 * k, 4, c, o.seed + 40)]
    : [];
  for (const v of vines) s += v.behind;
  // The trunks: each climbs one side and runs on over the crown, the right one over the left.
  const p1 = ph();
  const p2 = ph();
  // Past the crown each lies over the other's shoulder and ends in a curl, so the two cross in an X.
  const over = (t: number): number => {
    const v = Math.max(0, Math.min(1, t));
    return v * v * (3 - 2 * v);
  };
  const trunkL = rootPath(0, 0.68, (u) => 3 * Math.sin(u * 8 + p1) - 5 + 30 * k * over((u - 0.44) / 0.2));
  const trunkR = rootPath(1, 0.32, (u) => 3 * Math.sin(u * 8 + p2) - 5 + 30 * k * over((0.56 - u) / 0.2));
  s += barkRoot(curled(trunkL, 8, 0.6, 1), 34 * k, 5, a, o.seed + 3, { grooves: 4 });
  s += barkRoot(curled(trunkR, 8, 0.6, -1), 34 * k, 5, b, o.seed + 4, { grooves: 4 });
  for (const v of vines) s += v.before;
  // Two roots spring from the inside of the crown and curl.
  const inL = rootPath(0.33, 0.47, (u) => -12 - 3 * Math.sin(u * 20));
  const inR = rootPath(0.67, 0.53, (u) => -12 - 3 * Math.sin(u * 20));
  s += barkRoot(curled(inL, 7, 0.8, 1), 10 * k, 3, c, o.seed + 5, { grooves: 1 });
  s += barkRoot(curled(inR, 7, 0.8, -1), 10 * k, 3, c, o.seed + 6, { grooves: 1 });
  // Leaves sprouting along the outside.
  for (const [u, side] of [[0.14, -1], [0.3, -1], [0.7, 1], [0.86, 1]] as const) {
    const p = at(u, 19 * k);
    s += leaf(p, side < 0 ? -2.7 + rng.range(-0.3, 0.3) : -0.45 + rng.range(-0.3, 0.3), rng.range(10, 14), C.leaf, { stroke: 0.7 });
  }
  return s;
}

/** The near face: slimmer, with the crystal keystone and the roots running on over the tunnel. */
function front(): string {
  let s = '';
  // Roots running on to the right over the tunnel's mouth, ending in curls (drawn first: the arch covers their start).
  const lip1 = wavy([48, ROOF - 20], [212, ROOF - 16], 7, 1.6, 0.4, 18);
  const lip2 = wavy([58, ROOF - 34], [166, ROOF - 42], 5, 1.3, 2.1, 12);
  s += barkRoot(curled(lip2, 7, 0.7, -1), 13, 3, C.root, 812, { grooves: 1 });
  s += barkRoot(curled(lip1, 10, 0.75, -1), 24, 4, C.root2, 811, { grooves: 2 });
  s += leaf([150, ROOF - 44], -1.9, 12, C.leaf, { stroke: 0.7 }) + leaf([196, ROOF - 30], -0.7, 11, C.leaf, { stroke: 0.7 });
  s += face({ fills: [C.root, C.root2, C.root3], seed: 801, k: 0.86, vines: true });
  // The keystone: crystals growing out of the crown.
  s += crystals(0, CROWN_Y + 8, 40, [C.crystal, C.crystal2, C.crystal3, C.crystal], 83, 1.1);
  s += shard(-20, CROWN_Y + 14, 16, 6, -2.5, C.crystal3) + shard(20, CROWN_Y + 14, 16, 6, -0.64, C.crystal2);
  return s;
}

/** The far face: in the arch's own shade, deeper in tone, with a few crystals at its feet. */
function back(): string {
  let s = face({ fills: [C.back, C.back2, C.back3], seed: 901, k: 0.96, vines: false });
  s += crystals(-SPAN - 20, -2, 26, [C.crystal, C.crystal3], 91, 0.9) + crystals(SPAN + 18, -2, 22, [C.crystal2, C.crystal], 92, 0.9);
  s += crystals(0, CROWN_Y + 6, 24, [C.crystal3, C.crystal], 93, 1);
  return s;
}

/** A rib of roots joining the two faces overhead, `w` deep: seen in perspective as the arch's underside. */
function rib(w: number, h: number, seed: number, fills: readonly [string, string, string]): string {
  const rng = new Rng(seed);
  const m = h / 2;
  const r1 = wavy([-4, m - 2], [w + 4, m - 4], h * 0.12, 1.2, rng.range(0, 6), 12);
  const r2 = wavy([-4, m + 5], [w + 4, m + 7], h * 0.18, 2, rng.range(0, 6), 12);
  const r3 = wavy([-4, m - 9], [w + 4, m - 8], h * 0.14, 1.6, rng.range(0, 6), 12);
  let s = barkRoot(r3, h * 0.3, h * 0.26, fills[2], seed + 2, { grooves: 1 });
  s += barkRoot(r2, h * 0.34, h * 0.3, fills[1], seed + 1, { grooves: 1 });
  s += barkRoot(r1, h * 0.46, h * 0.42, fills[0], seed, { grooves: 2 });
  s += leaf([w * 0.45, m + h * 0.2], 1.7, 8, C.leaf, { stroke: 0.6 });
  return s;
}

/** The tunnel the arch opens on: a wall of earth with roots, under a roof of roots, to behind the paper door. */
function tunnel(): string {
  const rng = new Rng(hashSeed('door.roots.tunnel'));
  const top = ROOF - 6;
  const wall: Pt[] = [
    [WALL_X0, 2],
    [WALL_X0, top],
    [WALL_X1 - 6, top],
    [WALL_X1 + 4, top + 30],
    [WALL_X1 - 2, top + 90],
    [WALL_X1 + 2, 2],
  ];
  let inner = `<linearGradient id="rtw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.earthTop}"/><stop offset="0.55" stop-color="${C.earth}"/><stop offset="1" stop-color="${C.earthLow}"/></linearGradient>`;
  inner += `<rect x="${WALL_X0 - 4}" y="${top - 8}" width="${WALL_X1 - WALL_X0 + 12}" height="${-top + 12}" fill="url(#rtw)"/>`;
  // Layers of earth, pebbles, little crystals set in it.
  for (let i = 0; i < 5; i++) {
    const y = -30 - i * 40 + rng.range(-6, 6);
    let d = `M${WALL_X0} ${f(y)}`;
    for (let x = WALL_X0 + 20; x <= WALL_X1; x += 20) d += `Q${f(x - 10)} ${f(y + rng.range(-6, 6))} ${x} ${f(y + rng.range(-3, 3))}`;
    inner += ink(d, 0.8, C.strata, 0.7);
  }
  for (let i = 0; i < 16; i++) {
    inner += comic(ellipsePath(rng.range(WALL_X0 + 8, WALL_X1 - 8), rng.range(top + 20, -10), rng.range(2.5, 5), rng.range(1.6, 3)), C.pebble, { line: LINE.fine, rim: [0.8, -0.4] });
  }
  inner += crystals(206, -96, 18, [C.crystal, C.crystal3], 41, 1.2) + crystals(124, -168, 14, [C.crystal2, C.crystal], 42, 1.2);
  // Root hairs threading the earth.
  for (let i = 0; i < 8; i++) {
    const x = rng.range(WALL_X0 + 10, WALL_X1 - 10);
    const y = rng.range(top + 20, -40);
    inner += ink(`M${f(x)} ${f(y)}q${f(rng.range(-8, 8))} ${f(rng.range(6, 12))} ${f(rng.range(-4, 4))} ${f(rng.range(14, 24))}`, 0.8, darkOf(C.earth, 0.22));
  }
  let s = comic(poly2(wall), C.earth, { line: LINE.small, rim: [10, -4], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5, inner });
  // Two roots wind down the wall as its ribs, branching, and splay at the floor.
  for (const [x, seed] of [[166, 61], [252, 62]] as const) {
    const ph = rng.range(0, 6);
    const pts = wavy([x - 4, top + 2], [x + 2, -12], 5, 1.7, ph, 16);
    s += barkRoot([...pts, [x + 8, -2]], 16, 11, C.back2, seed, { grooves: 2 });
    s += barkRoot(wavy([x + 1, top + 70], [x + 30, top + 128], 3, 1, ph, 8), 7, 2, C.back3, seed + 3, { grooves: 1 });
    s += barkRoot([[x + 4, -16], [x + 18, -5], [x + 30, 2]], 10, 3, C.back, seed + 5, { grooves: 1 });
    s += barkRoot([[x - 2, -14], [x - 16, -4], [x - 26, 2]], 9, 3, C.back3, seed + 6, { grooves: 1 });
  }
  // Toadstools at its foot (their glow is a piece).
  for (const [x, k] of [[120, 1], [134, 0.7], [222, 0.85]] as const) s += toadstool(x, k);
  // The roof: earth packed with roots along the top, turned down at its end beside the door.
  const under: Pt[] = [];
  for (let x = 20; x <= WALL_X1; x += 14) under.push([x, top + 6 + rng.range(-3, 5)]);
  s += comic(smooth([[18, top - 36], [120, top - 42], [WALL_X1 - 30, top - 38], [WALL_X1 + 10, top - 26], [WALL_X1 + 16, top + 6], [WALL_X1 + 10, top + 40], ...under.reverse()], 0.75), C.earthTop, { line: LINE.small, rim: [3, -1.4], hatch: 2.4, hatchWidth: 0.45 });
  const roofRoot = (y: number, amp: number, waves: number, ph: number, down: number): Pt[] => [
    ...wavy([16, y], [WALL_X1 - 18, y + 2], amp, waves, ph, 18),
    [WALL_X1 - 4, y + 8],
    [WALL_X1 + 4, y + 24],
    [WALL_X1 + 2, y + 24 + down],
  ];
  s += barkRoot(roofRoot(top - 30, 4, 2.2, 0.3, 20), 15, 5, C.back3, 71, { grooves: 2 });
  s += barkRoot(roofRoot(top - 14, 5, 1.6, 2.2, 60), 23, 7, C.back, 72, { grooves: 3 });
  s += barkRoot(roofRoot(top + 1, 4, 2.8, 4.1, 34), 14, 4, C.back2, 73, { grooves: 2 });
  s += barkRoot(wavy([60, top - 40], [230, top - 44], 3, 1.4, 1.2, 12), 9, 3, C.back3, 74, { grooves: 1 });
  s += leaf([182, top + 8], 1.9, 10, C.leaf, { stroke: 0.7 }) + leaf([110, top + 10], 1.2, 9, C.leaf, { stroke: 0.7 }) + leaf([248, top - 40], -1.2, 10, C.leaf, { stroke: 0.7 });
  return s;
}

/** A closed path through points (straight sides). */
function poly2(p: readonly Pt[]): string {
  return `M${p.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;
}

function toadstool(x: number, k: number): string {
  let s = comic(rrect(x - 2.6 * k, -13 * k, 5.2 * k, 13 * k, 2), C.stem, { line: LINE.fine });
  s += comic(smooth([[x - 11 * k, -11 * k], [x - 7 * k, -19 * k], [x + 7 * k, -19 * k], [x + 11 * k, -11 * k]]), C.cap, {
    line: LINE.fine,
    rim: [1, -0.5],
    over: fillP(circleP(x - 3.5 * k, -15 * k, 1.5 * k), '#fff6f0') + fillP(circleP(x + 4 * k, -14 * k, 1.1 * k), '#fff6f0'),
  });
  return s;
}

// ---------------------------------------------------------------- what moves

/** A bud on a root (its stem at 0,0). */
function bud(): string {
  return ink('M0 0q1 -4 0 -7', 1, darkOf(C.leaf, 0.3)) + comic(smooth([[0, -5], [-3.6, -9], [0, -16], [3.6, -9]]), C.bud, { line: LINE.fine, rim: [1, -0.5] }) + comic(smooth([[-3.4, -6], [0, -9], [3.4, -6], [0, -4]]), C.leaf, { line: LINE.fine });
}

/** The same bud open: five petals round a golden heart. */
function bloom(): string {
  let s = ink('M0 0q1 -4 0 -7', 1, darkOf(C.leaf, 0.3));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const cx = Math.cos(a) * 5.4;
    const cy = -12 + Math.sin(a) * 5.4;
    const pts: Pt[] = [];
    for (let j = 0; j < 10; j++) {
      const t = (j / 10) * Math.PI * 2;
      const u = Math.cos(t) * 4.6;
      const v = Math.sin(t) * 3.3;
      pts.push([cx + u * Math.cos(a) - v * Math.sin(a), cy + u * Math.sin(a) + v * Math.cos(a)]);
    }
    s += comic(smooth(pts, 0.9), C.petal, { line: LINE.fine, rim: [0.8, -0.4] });
  }
  return s + comic(circleP(0, -12, 3), C.heart, { line: LINE.fine, glint: [-0.4, 0.4] });
}

/** The root sprite that pops up over the crown: a round pink root with a sprout, holding on. */
function sprite(): string {
  let s = '';
  s += leaf([0, -27], -2.05, 14, C.sprout, { stroke: 0.7 }) + leaf([0, -27], -1.05, 12, C.sprout, { stroke: 0.7 });
  s += ink('M0 -27q-1 -4 2 -6', 1, darkOf(C.sprout, 0.3));
  s += comic(ellipsePath(0, -14, 12.5, 13), C.sprite, { line: LINE.small, rim: [2.2, -1], glint: [-0.7, 0.7], over: fillP(ellipsePath(1, -8, 7, 5), C.spriteBelly, 0.8) });
  for (const x of [-7.6, 7.6]) s += fillP(ellipsePath(x, -10, 2.6, 1.6), C.cheek, 0.8);
  s += ink('M-2.4 -6.2q2.4 2.2 4.8 0', 1, darkOf(C.sprite, 0.5));
  // Little hands, holding on to the root.
  for (const x of [-13, 13]) s += comic(circleP(x, -3, 3.4), C.sprite, { line: LINE.fine, over: ink(`M${x - 1.6} -4.6v2.4M${x + 0.2} -5v2.4`, 0.6, darkOf(C.sprite, 0.4)) });
  return s;
}
function spriteEyes(): string {
  return [-4.8, 4.8].map((x) => comic(ellipsePath(x, 0, 3.3, 4), C.white, { line: LINE.detail, ink: darkOf(C.sprite, 0.55) })).join('');
}
function spritePupils(): string {
  return [-4.8, 4.8].map((x) => fillP(circleP(x, 0.4, 2.1), C.iris) + fillP(circleP(x, 0.6, 1.2), C.pupil) + fillP(circleP(x + 0.8, -0.5, 0.6), '#ffffff')).join('');
}

/** The root gate of the 14th Room, and the tunnel it opens on. */
export function rootArch(): DoorArt {
  const deep = FRONT - BACK;
  // The ribs overhead: at the crown, and on either shoulder.
  const shoulder = (sx: number): Pt => {
    let best = CENTRE[0]!;
    for (const p of CENTRE) if (p[1] < -SPRING && Math.abs(p[0] - sx) < Math.abs(best[0] - sx)) best = p;
    return best;
  };
  const sl = shoulder(-62);
  const sr = shoulder(62);
  const ribs: { key: string; x: number; y: number; h: number; seed: number }[] = [
    { key: 'door.roots.rib0', x: 0, y: CROWN_Y + 4 - 22, h: 44, seed: 501 },
    { key: 'door.roots.rib1', x: sl[0], y: sl[1] - 17, h: 34, seed: 502 },
    { key: 'door.roots.rib2', x: sr[0], y: sr[1] - 17, h: 34, seed: 503 },
  ];
  // Buds along the near face, opening one after another as Gorti comes.
  const buds: { p: Pt; at: number }[] = [
    { p: at(0.13, 15), at: 0.05 },
    { p: at(0.27, 17), at: 0.25 },
    { p: at(0.4, 19), at: 0.45 },
    { p: at(0.62, 18), at: 0.35 },
    { p: at(0.77, 16), at: 0.15 },
    { p: at(0.9, 14), at: 0.55 },
  ];
  const lifted = (y: number): number => y * LIFT;
  const blossoms: DoorPiece[] = buds.flatMap(({ p, at: wa }) => [
    { key: 'door.roots.bud', x: p[0], y: p[1], dz: FRONT + 1, wake: { alpha: -1, y: lifted(p[1]) }, wakeAt: wa },
    { key: 'door.roots.bloom', x: p[0], y: p[1], dz: FRONT + 1, open: { alpha: 0, sx: 0.3, sy: 0.3 }, wake: { alpha: 1, sx: 3.4, sy: 3.4, y: lifted(p[1]) }, wakeAt: wa, sway: { angle: 5, ms: 2600, byWake: true } },
  ]);
  // The sprite, hidden behind the crown until it pops up.
  const SX = 30;
  const SY = at(0.57)[1] + 8;
  const pop = -30;
  const leaves: DoorLeaf[] = ribs.map((r) => ({ front: r.key, back: r.key, hinge: 'left', x: r.x, y: r.y, dz: BACK, shutAngle: 90, restAngle: 90, wideAngle: 90, strips: 10, still: true }));
  return {
    parts: [
      doorPart('door.roots.back', { x0: -SPAN - 70, y0: CROWN_Y - 40, x1: SPAN + 70, y1: 6 }, back()),
      doorPart('door.roots.front', { x0: -SPAN - 70, y0: CROWN_Y - 46, x1: 240, y1: 6 }, front()),
      doorPart('door.roots.tunnel', { x0: 14, y0: ROOF - 50, x1: WALL_X1 + 24, y1: 6 }, tunnel()),
      ...ribs.map((r, i) => leafPart(r.key, deep, r.h, rib(deep, r.h, r.seed, i === 0 ? [C.root2, C.back, C.back3] : [C.root3, C.back2, C.back]))),
      doorPart('door.roots.bud', { x0: -6, y0: -18, x1: 6, y1: 2 }, bud()),
      doorPart('door.roots.bloom', { x0: -11, y0: -22, x1: 11, y1: 2 }, bloom()),
      doorPart('door.roots.sprite', { x0: -18, y0: -44, x1: 18, y1: 2 }, sprite()),
      doorPart('door.roots.spriteEyes', { x0: -10, y0: -6, x1: 10, y1: 6 }, spriteEyes()),
      doorPart('door.roots.spritePupils', { x0: -8, y0: -3, x1: 8, y1: 4 }, spritePupils()),
      doorPart('door.roots.glow', { x0: -40, y0: -40, x1: 40, y1: 40 }, glowDisc(0, 0, 38, '#c9fff0', 0.9)),
      doorPart('door.roots.light', { x0: -130, y0: -130, x1: 130, y1: 130 }, glowDisc(0, 0, 128, '#f4dcff', 0.7)),
      doorPart('door.roots.pool', { x0: -150, y0: -20, x1: 150, y1: 20 }, `<g transform="scale(1 0.12)">${glowDisc(0, 0, 148, '#f6e2ff', 0.8)}</g>`),
      doorPart('door.roots.mushGlow', { x0: -24, y0: -24, x1: 24, y1: 24 }, glowDisc(0, 0, 22, '#ffd6e6', 0.9)),
    ],
    opening: [],
    frame: [
      { key: 'door.roots.tunnel', x: 0, y: 0, dz: WALL },
      { key: 'door.roots.back', x: 0, y: 0, dz: BACK },
    ],
    inside: [],
    front: [],
    pieces: [
      // Light under the arch and on the floor before it.
      { key: 'door.roots.light', x: 0, y: -130, dz: BACK + 2, additive: true, open: { alpha: 0.12 }, wake: { alpha: 0.22, sx: 1.1, sy: 1.1 }, sway: { alpha: 0.05, ms: 2800 } },
      { key: 'door.roots.pool', x: 0, y: 2, dz: 6, additive: true, open: { alpha: 0.16 }, wake: { alpha: 0.24 }, sway: { alpha: 0.05, ms: 2800 } },
      // The crystals at the far feet, and the mushrooms in the tunnel.
      { key: 'door.roots.glow', x: -SPAN - 20, y: -12, dz: BACK + 0.5, additive: true, scale: 0.7, open: { alpha: 0.18 }, wake: { alpha: 0.4 }, sway: { alpha: 0.08, ms: 2100 } },
      { key: 'door.roots.glow', x: SPAN + 18, y: -12, dz: BACK + 0.5, additive: true, scale: 0.6, open: { alpha: 0.18 }, wake: { alpha: 0.4 }, sway: { alpha: 0.08, ms: 2500 } },
      { key: 'door.roots.mushGlow', x: 126, y: -16, dz: WALL + 0.5, additive: true, open: { alpha: 0.12 }, wake: { alpha: 0.5 }, wakeAt: 0.3, sway: { alpha: 0.1, ms: 1900 } },
      { key: 'door.roots.mushGlow', x: 222, y: -14, dz: WALL + 0.5, additive: true, scale: 0.8, open: { alpha: 0.12 }, wake: { alpha: 0.5 }, wakeAt: 0.5, sway: { alpha: 0.1, ms: 2300 } },
      // The sprite pops up over the crown, behind the near face.
      { key: 'door.roots.sprite', x: SX, y: SY, dz: FRONT - 2, wake: { y: lifted(SY) }, peek: { y: pop }, sway: { angle: 4, ms: 1700, byWake: true } },
      { key: 'door.roots.spriteEyes', x: SX, y: SY - 17, dz: FRONT - 1.6, wake: { y: lifted(SY) }, peek: { y: pop }, blink: true },
      { key: 'door.roots.spritePupils', x: SX, y: SY - 16.6, dz: FRONT - 1.2, wake: { y: lifted(SY) }, peek: { y: pop }, look: { x: 1.8, y: 0.8 }, blink: true },
      // The near face, which draws itself up a little as Gorti comes.
      { key: 'door.roots.front', x: 0, y: 0, dz: FRONT, wake: { sy: 1 + LIFT } },
      ...blossoms,
      { key: 'door.roots.glow', x: 0, y: CROWN_Y - 6, dz: FRONT + 1.5, additive: true, open: { alpha: 0.22 }, wake: { alpha: 0.5, sx: 1.15, sy: 1.15, y: lifted(CROWN_Y) }, sway: { alpha: 0.1, ms: 1800 } },
    ],
    leaves,
    light: { color: 0xf0dcff, radius: 300, intensity: 0.7, y: 120 },
    glow: { color: 0xf0dcff, pool: 0xf6e6ff },
    sparks: { colors: [0xfbd2df, 0xd6ccf4, 0xc4efe5], frame: 'fx.petal', rate: 0.9, size: 0.38 },
    sounds: { wake: ['bloom', 0.3, 1.15], peek: ['chirp', 0.3, 1.6] },
  };
}
