// The geometry of a page being turned, with nothing of the DOM in it (so it
// can be tested). The page lies on the book, its spine along one side.
// Picked up by its free edge, the paper beyond a fold line leaves the page
// over a tight roll, back over toward the spine; beyond the roll it bends up
// again toward the hand that turns it, and goes on straight. As the fold
// travels to the spine the page goes over with it, until the whole of it
// lies over beyond the spine, its back up. The fold is tilted, its foot
// leading, the way a page is turned by a hand at its lower corner.
//
// The page's own frame: x from the spine toward the free edge, y down the
// page, z toward the viewer (px). "Across" runs over the fold toward the free
// edge, "along" down the fold.

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number): number => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** The fold's tilt (rad): its foot leads. */
export const TILT = (10 * Math.PI) / 180;
const CT = Math.cos(TILT);
const ST = Math.sin(TILT);
/** Across the fold (toward the free edge) and along it (down the page), unit. */
export const ACROSS = { x: CT, y: ST } as const;
export const ALONG = { x: -ST, y: CT } as const;

/** A page (px). */
export interface Sheet {
  w: number;
  h: number;
}

/**
 * A pose of the page: its fold (px across from the spine's top corner; the
 * paper beyond it is off the page), how far over the roll takes the paper
 * (rad: 0 lying flat, π/2 standing up, π lying over, back up), the roll's
 * radius (px); and how far the paper beyond the roll then bends back up
 * toward the hand (rad), over a gentler curve of radius `R` (px).
 */
export interface Curl {
  f: number;
  phi: number;
  r: number;
  bow: number;
  R: number;
}

/** How far across the page reaches: from its spine's top corner (0) to its free edge's foot. */
export function across(sh: Sheet): number {
  return sh.w * CT + sh.h * ST;
}

/** Paper some way beyond the fold: how far across from the fold it is, how high, and the angle it lies at (rad). */
export interface Bent {
  s: number;
  z: number;
  a: number;
}

/** How long the roll and the bow beyond it are (px along the paper), and how far over the paper is beyond them (rad). */
export function parts(c: Curl): { roll: number; bow: number; end: number } {
  const phi = Math.min(Math.PI, Math.max(0, c.phi));
  const bow = Math.min(phi, Math.max(0, c.bow));
  return { roll: phi * c.r, bow: bow * c.R, end: phi - bow };
}

/** Where the paper `d` px beyond the fold (measured along the paper) is. */
export function bend(c: Curl, d: number): Bent {
  if (d <= 0) return { s: d, z: 0, a: 0 };
  const phi = Math.min(Math.PI, Math.max(0, c.phi));
  const p = parts(c);
  if (d <= p.roll) {
    const t = d / c.r;
    return { s: c.r * Math.sin(t), z: c.r * (1 - Math.cos(t)), a: t };
  }
  // Over the top of the roll…
  const s1 = c.r * Math.sin(phi);
  const z1 = c.r * (1 - Math.cos(phi));
  const e = d - p.roll;
  if (e <= p.bow) {
    // …bending back up toward the hand…
    const t = phi - e / c.R;
    return { s: s1 + c.R * (Math.sin(phi) - Math.sin(t)), z: z1 + c.R * (Math.cos(t) - Math.cos(phi)), a: t };
  }
  // …and on, straight.
  const s2 = s1 + c.R * (Math.sin(phi) - Math.sin(p.end));
  const z2 = z1 + c.R * (Math.cos(p.end) - Math.cos(phi));
  const g = e - p.bow;
  return { s: s2 + g * Math.cos(p.end), z: z2 + g * Math.sin(p.end), a: p.end };
}

/** Where the page's point (x, y) is now, and the angle the paper lies at there. */
export function place(c: Curl, x: number, y: number): { x: number; y: number; z: number; a: number } {
  const s = x * CT + y * ST;
  if (s <= c.f) return { x, y, z: 0, a: 0 };
  const b = bend(c, s - c.f);
  const ds = c.f + b.s - s;
  return { x: x + ds * CT, y: y + ds * ST, z: b.z, a: b.a };
}

/** The eye is this many page widths in front of the page's middle. */
export const PERSPECTIVE = 2.4;

/** Seen in perspective from `persp` px in front of the page's point `o`: where a point shows on the page's plane. */
export function project(p: { x: number; y: number; z: number }, o: { x: number; y: number }, persp: number): { x: number; y: number } {
  const k = persp / Math.max(1, persp - p.z);
  return { x: o.x + (p.x - o.x) * k, y: o.y + (p.y - o.y) * k };
}

// ------------------------------------------------------------ the turn

/** The roll's radius for a page (px): tight, a finger's worth of paper. */
export function rollRadius(sh: Sheet): number {
  return Math.min(56, Math.max(12, sh.w * 0.04));
}

/** Lying flat: the fold beyond the page. */
export function flat(sh: Sheet): Curl {
  return { f: across(sh) + 1, phi: 0, r: rollRadius(sh), bow: 0, R: 1 };
}

/** Picked up: how much of the page's width is off the page at its foot, and how far over it is rolled there (rad). */
export const LIFT = { depth: 0.17, phi: 2.75 } as const;

/** The free edge picked up, its foot first (u: 0..1 over the lift). */
export function liftCurl(u: number, sh: Sheet): Curl {
  const v = clamp01(u);
  return { f: across(sh) - LIFT.depth * sh.w * (1 - (1 - v) ** 3), phi: LIFT.phi * (1 - (1 - v) ** 2), r: rollRadius(sh), bow: 0, R: 1 };
}

/** Held up while the next page is made: it breathes (t: seconds held). */
export function hoverCurl(t: number, sh: Sheet): Curl {
  const w = Math.sin(t * 5.2);
  const held = liftCurl(1, sh);
  return { ...held, f: held.f - sh.w * 0.005 * w, phi: held.phi + 0.06 * w };
}

/** Where the turn leaves the fold: past the spine, so far that the page's top corner (it trails the foot) is out of sight too. */
export function endFold(sh: Sheet): number {
  return -rollRadius(sh) * 1.3 - (sh.w * ST * ST) / CT - 6;
}

/** The turn's pace (0..1 → 0..1): out of the hold at once, quickly across, slowing at the spine. */
export function turnPace(u: number): number {
  const v = clamp01(u);
  // A cubic Bézier (0.3, 0.1) (0.25, 1), solved for its time.
  const x1 = 0.3;
  const y1 = 0.1;
  const x2 = 0.25;
  const y2 = 1;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  let t = v;
  for (let i = 0; i < 8; i++) {
    const e = ((ax * t + bx) * t + cx) * t - v;
    const d = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break;
    t = clamp01(t - e / d);
  }
  return ((ay * t + by) * t + cy) * t;
}

/**
 * How the page goes over: by the end the roll has laid it over, back up
 * (`over`, rad); on the way the paper beyond the roll is lifted toward the
 * hand until it stands (`stand`, rad: a little short of upright), over a
 * curve `R` page widths across.
 */
export const TURN = { over: Math.PI - 0.06, stand: 1.45, R: 0.18 } as const;

/**
 * The turn (u: 0..1) from the pose it was held in (or from lying flat, when
 * it was never picked up): the fold travels past the spine and the page goes
 * over with it.
 */
export function turnCurl(u: number, sh: Sheet, from: Curl): Curl {
  const q = turnPace(u);
  const f = from.f + (endFold(sh) - from.f) * q;
  // Rolled over at once from lying flat; held up, it is most of the way over already.
  const held = clamp01(from.phi / TURN.over);
  const phi = Math.min(Math.PI, Math.max(0, from.phi + (TURN.over - from.phi) * smooth(0.1 * held, 0.4 + 0.55 * held, q)));
  // Lifted toward the hand as soon as it is pulled (once it has rolled past
  // standing up), and let down again as it reaches the spine.
  const lift = Math.max(0, phi - TURN.stand) * (1 - smooth(0.62, 0.95, q));
  const bow = from.bow + (lift - from.bow) * smooth(0, 0.18, u);
  return { f, phi, r: from.r, bow: Math.max(0, bow), R: TURN.R * sh.w };
}

// ------------------------------------------------------------ light

/** The light, as everywhere in the game: from the upper right, and from the front (x across the screen, y down, z toward the viewer). */
const LIGHT = { x: 0.5, y: -0.42, z: 0.76 } as const;

/** How a side of the paper is lit: shaded (0..1 of the shadow tone), paled toward the light (0..1), and its sheen (0..1). */
export interface Lit {
  dark: number;
  pale: number;
  sheen: number;
}

/**
 * The paper at angle `a` across the fold, its printed side (`front`) or its
 * back toward the viewer, on a page whose free edge points `dir` (1: right).
 * Paper turned from the light darkens and paper turned toward it pales; a
 * sheen rides where it faces halfway between the light and the eye. Lying
 * flat, the print shows exactly as printed.
 */
export function litAt(a: number, front: boolean, dir: 1 | -1): Lit {
  const nx = front ? -Math.sin(a) : Math.sin(a);
  const nz = front ? Math.cos(a) : -Math.cos(a);
  const la = dir * LIGHT.x * CT + LIGHT.y * ST;
  const diffuse = Math.max(0, nx * la + nz * LIGHT.z);
  const dark = clamp01((LIGHT.z - diffuse) / LIGHT.z);
  const pale = clamp01((diffuse - LIGHT.z) / (1 - LIGHT.z));
  const hx = la;
  const hz = LIGHT.z + 1;
  const hn = Math.hypot(hx, hz);
  const rest = (hz / hn) ** 24;
  const spec = Math.max(0, (nx * hx + nz * hz) / hn) ** 24;
  return { dark, pale, sheen: clamp01((spec - rest) / (1 - rest)) };
}

/** Where a shadow falls from paper `z` px up: away from the light, per px of height (on the screen). */
export function shadowDrift(): { x: number; y: number } {
  return { x: -LIGHT.x / LIGHT.z, y: -LIGHT.y / LIGHT.z };
}

// ------------------------------------------------------------ the chapter page's doors

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

/** The light for a panel turning about an upright hinge (x across the screen, z toward the viewer). */
const FLAT_LIGHT = { x: 0.6, z: 0.8 };
/** Halfway between the light and the eye (where a sheen shows). */
const HALF = (() => {
  const x = FLAT_LIGHT.x;
  const z = FLAT_LIGHT.z + 1;
  const n = Math.hypot(x, z);
  return { x: x / n, z: z / n };
})();
/** The sheen of paper lying flat (nothing is added there). */
const REST_SHEEN = HALF.z ** 60;

/**
 * How a panel standing at angle `a` about an upright hinge is lit; `dir` is
 * the way its free edge points (1: right). Paper turned from the light
 * darkens (the shade lightly hatched), paper turned toward it pales, and a
 * sheen rides it where it faces halfway between the light and the eye.
 * Lying flat, either side shows exactly as printed.
 */
export function shadeAt(a: number, dir: 1 | -1): Shade {
  const fx = -dir * Math.sin(a);
  const fz = Math.cos(a);
  const front = fz >= 0;
  const nx = front ? fx : -fx;
  const nz = front ? fz : -fz;
  const diffuse = Math.max(0, nx * FLAT_LIGHT.x + nz * FLAT_LIGHT.z);
  const rest = FLAT_LIGHT.z;
  const dark = clamp01((rest - diffuse) / rest);
  const lit = clamp01((diffuse - rest) / (1 - rest));
  const spec = clamp01((Math.max(0, nx * HALF.x + nz * HALF.z) ** 60 - REST_SHEEN) / (1 - REST_SHEEN));
  // Stylized as the game's cels: a little shade reads at once, full shade comes soon.
  const shade = 0.9 * dark ** 0.6;
  const sheen = Math.min(1, 0.55 * spec + 0.35 * lit);
  return front ? { front: shade, glint: sheen, back: 0, backGlint: 0 } : { front: 0, glint: 0, back: shade, backGlint: sheen };
}
