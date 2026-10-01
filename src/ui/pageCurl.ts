// The geometry of a page being turned, with nothing of the DOM in it (so it
// can be tested): a sheet of paper fixed along its spine, its free part
// rolled over as by a finger, and the whole of it lifted over the spine.
// The page is cut into vertical strips; each strip is placed by its
// spine-side edge (x along the book from the spine, z toward the viewer)
// and the angle it stands at.
//
// A pose is the spine's angle `a0`, and a roll: from `sb` (a share of the
// page from the spine) the paper bends evenly through `c` radians, over a
// circle of radius `r` (a share of the page; none: the bend runs to the free
// edge), and lies flat again beyond it. c near π rolls the free part right
// over (it lies on the page, its back up), the way a page is turned.

export interface Pose {
  /** The spine's angle (rad): 0 lying flat, π turned over. */
  a0: number;
  /** Where the bend starts, as a share of the page from the spine (0..1). */
  sb: number;
  /** The bend (rad). */
  c: number;
  /** The bend's radius as a share of the page (none: the bend runs to the free edge). */
  r?: number;
}

export interface StripPlace {
  /** Its spine-side edge: along the book from the spine, and toward the viewer (px). */
  x: number;
  z: number;
  /** The angle it stands at (rad, 0 lying flat). */
  a: number;
}

export const FLAT: Pose = { a0: 0, sb: 1, c: 0 };

/** Where the bend starts and how long it is (px), for a page `len` px long. */
export function bendOf(p: Pose, len: number): { b: number; l: number } {
  const b = Math.min(len, Math.max(0, p.sb * len));
  const rest = len - b;
  const l = p.r === undefined ? rest : Math.min(rest, Math.abs(p.c) * p.r * len);
  return { b, l };
}

/** The angle of the page at `s` px from the spine. */
export function angleAt(p: Pose, s: number, len: number): number {
  const { b, l } = bendOf(p, len);
  if (s <= b || l <= 0) return p.a0;
  return p.a0 + p.c * Math.min(1, (s - b) / l);
}

/** The point of the page `s` px from the spine (x along the book, z toward the viewer). */
export function pointAt(p: Pose, s: number, len: number): { x: number; z: number } {
  const { b, l } = bendOf(p, len);
  const flat = Math.min(s, b);
  let x = flat * Math.cos(p.a0);
  let z = flat * Math.sin(p.a0);
  if (s <= b) return { x, z };
  // The bend: the angle grows evenly with the length (a circle's arc).
  const d = Math.min(s - b, l);
  const k = l > 0 ? p.c / l : 0;
  if (Math.abs(k * d) < 1e-5) {
    x += d * Math.cos(p.a0);
    z += d * Math.sin(p.a0);
  } else {
    const t = p.a0 + k * d;
    x += (Math.sin(t) - Math.sin(p.a0)) / k;
    z -= (Math.cos(t) - Math.cos(p.a0)) / k;
  }
  // Beyond the bend the paper lies flat again, at the bend's last angle.
  const e = s - b - l;
  if (e > 0) {
    const t = p.a0 + p.c;
    x += e * Math.cos(t);
    z += e * Math.sin(t);
  }
  return { x, z };
}

/** Where each of `n` equal strips of a page `len` px long stands. */
export function layStrips(p: Pose, n: number, len: number, out: StripPlace[] = []): StripPlace[] {
  const bounds: number[] = [];
  for (let i = 0; i <= n; i++) bounds.push((i * len) / n);
  return layStripsAt(p, bounds, len, out);
}

/**
 * Where each strip stands, the strips cut at `bounds` (px from the spine,
 * from 0 to `len`): strip i runs from bounds[i] to bounds[i + 1].
 */
export function layStripsAt(p: Pose, bounds: readonly number[], len: number, out: StripPlace[] = []): StripPlace[] {
  const n = bounds.length - 1;
  out.length = n;
  let a = pointAt(p, bounds[0]!, len);
  for (let i = 0; i < n; i++) {
    const b = pointAt(p, bounds[i + 1]!, len);
    // Each strip lies along its chord, so the strips meet edge to edge.
    out[i] = { x: a.x, z: a.z, a: Math.atan2(b.z - a.z, b.x - a.x) };
    a = b;
  }
  return out;
}

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number): number => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (u: number): number => 1 - (1 - u) ** 3;

// ------------------------------------------------------------ the turn

/** How far the free edge is rolled over while the page is held up (rad). */
export const LIFT_CURL = 2.5;
/** Where the roll starts while held (share of the page from the spine). */
export const LIFT_SB = 0.66;
/** The roll's radius while held (share of the page). */
const LIFT_R = 0.09;
/** The roll's radius as it reaches the spine. */
const TURN_R = 0.15;
/** The spine's own lift when the edge is picked up (rad). */
const LIFT_A0 = 0.04;
/** How far over the spine the page is lifted as it leaves (rad). */
const LEAVE_A0 = 1.8;

/** The page picked up by its free edge (u: 0..1 over the lift). */
export function liftPose(u: number): Pose {
  const e = easeOut(clamp01(u));
  return { a0: LIFT_A0 * e, sb: 1 - (1 - LIFT_SB) * Math.min(1, e * 1.3), c: LIFT_CURL * e, r: LIFT_R };
}

/** Held up while the next page is made: the roll breathes (t: seconds held). */
export function hoverPose(t: number): Pose {
  const w = Math.sin(t * 5.2);
  return { a0: LIFT_A0 + 0.008 * w, sb: LIFT_SB - 0.01 * w, c: LIFT_CURL + 0.09 * w, r: LIFT_R };
}

/**
 * The turn (u: 0..1): the roll travels from where it was held to the spine,
 * closing until the paper beyond it lies right over on the page, back up;
 * then what is left of the page is lifted over the spine and away.
 */
export function turnPose(u: number, from: Pose = liftPose(1)): Pose {
  const v = clamp01(u);
  // The roll: slow out of the hold, quick across, slowing at the spine.
  const m = smooth(0, 0.66, v);
  const sb = from.sb * (1 - m);
  const r0 = from.r ?? LIFT_R;
  const r = r0 + (TURN_R - r0) * m;
  // The spine settles, then lifts the last of the page off.
  const a0 = from.a0 * (1 - smooth(0, 0.3, v)) + LEAVE_A0 * smooth(0.48, 1, v) ** 1.3;
  // The roll closes until the paper beyond lies flat, back up (never past it).
  let c = from.c + (Math.PI - 0.04 - from.c) * smooth(0, 0.42, v);
  c = Math.min(c, Math.PI - a0);
  return { a0, sb, c, r };
}

// ------------------------------------------------------------ light

export interface Shade {
  /** How dark the printed side shows (0..1 of the shadow tone). */
  front: number;
  /** How much a sheen lies on the printed side (0..1). */
  glint: number;
  /** How dark the back of the page shows (0..1). */
  back: number;
  /** How much a sheen lies on the back (0..1). */
  backGlint: number;
}

/** The light: from the upper right and from the front (x across the screen, z toward the viewer). */
const LIGHT = { x: 0.6, z: 0.8 };
/** Halfway between the light and the eye (where a sheen shows). */
const HALF = (() => {
  const x = LIGHT.x;
  const z = LIGHT.z + 1;
  const n = Math.hypot(x, z);
  return { x: x / n, z: z / n };
})();
/** The sheen of paper lying flat (nothing is added there). */
const REST_SHEEN = HALF.z ** 60;

/**
 * How a strip standing at angle `a` is lit; `dir` is the way the free edge
 * points (1: right). The light comes from the upper right, as everywhere in
 * the game: paper turned from it darkens (the shade lightly hatched), paper
 * turned toward it pales, and a sheen rides the roll where it faces halfway
 * between the light and the eye. Lying flat, either side shows exactly as
 * printed.
 */
export function shadeAt(a: number, dir: 1 | -1): Shade {
  const fx = -dir * Math.sin(a);
  const fz = Math.cos(a);
  const front = fz >= 0;
  const nx = front ? fx : -fx;
  const nz = front ? fz : -fz;
  const diffuse = Math.max(0, nx * LIGHT.x + nz * LIGHT.z);
  const rest = LIGHT.z;
  const dark = clamp01((rest - diffuse) / rest);
  const lit = clamp01((diffuse - rest) / (1 - rest));
  const spec = clamp01((Math.max(0, nx * HALF.x + nz * HALF.z) ** 60 - REST_SHEEN) / (1 - REST_SHEEN));
  // Stylized as the game's cels: a little shade reads at once, full shade comes soon.
  const shade = 0.9 * dark ** 0.6;
  const sheen = Math.min(1, 0.55 * spec + 0.35 * lit);
  return front ? { front: shade, glint: sheen, back: 0, backGlint: 0 } : { front: 0, glint: 0, back: shade, backGlint: sheen };
}

// ------------------------------------------------------------ projection

/**
 * The screen x (px from the book's left) of a page point, for a book `w` px
 * wide seen with CSS perspective `persp` from its middle. `dir` 1: the spine
 * is the left edge.
 */
export function screenX(x: number, z: number, w: number, persp: number, dir: 1 | -1): number {
  const bx = dir > 0 ? x : w - x;
  const ox = w / 2;
  return ox + ((bx - ox) * persp) / Math.max(1, persp - z);
}

/** The farthest the page reaches across the book on screen (toward the free edge), and its highest point. */
export function reach(p: Pose, len: number, w: number, persp: number, dir: 1 | -1, samples = 24): { edge: number; top: number } {
  let edge = dir > 0 ? -Infinity : Infinity;
  let top = 0;
  for (let i = 0; i <= samples; i++) {
    const q = pointAt(p, (i * len) / samples, len);
    const sx = screenX(q.x, q.z, w, persp, dir);
    edge = dir > 0 ? Math.max(edge, sx) : Math.min(edge, sx);
    top = Math.max(top, q.z);
  }
  return { edge, top };
}
