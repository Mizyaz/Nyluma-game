// The geometry of the paper diorama, with no Phaser and no three.js in it
// (unit-tested). World units are the game's pixels, x to the right and y
// down as in the room data; z is depth: 0 is the plane the actors walk on,
// negative is behind it, positive toward the viewer. The eye sits at z = D.
//
// The 3D picture is built so that it matches what Phaser would draw: a
// frustum through the camera's view rectangle on z = 0 (everything Phaser
// still draws lines up there), and parallax layers put at the depth that
// makes them scroll exactly as their scroll factor says when seen from the
// middle of the view.

/** What the stage reads from Phaser's main camera each frame. */
export interface CamState {
  /** Camera matrix: zoom (a, d) and translation (e, f), shake included. */
  a: number;
  d: number;
  e: number;
  f: number;
  scrollX: number;
  scrollY: number;
  /** Viewport size in game pixels (1280 × 720). */
  w: number;
  h: number;
}

export interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** The world rectangle the camera shows on the actor plane (z = 0). */
export function viewRect(c: CamState): Rect {
  return {
    x0: -c.e / c.a + c.scrollX,
    y0: -c.f / c.d + c.scrollY,
    x1: (c.w - c.e) / c.a + c.scrollX,
    y1: (c.h - c.f) / c.d + c.scrollY,
  };
}

/** Where Phaser draws a world point with scroll factors (sx, sy), in screen pixels. */
export function phaserScreen(c: CamState, x: number, y: number, sx = 1, sy = 1): [number, number] {
  return [c.a * (x - sx * c.scrollX) + c.e, c.d * (y - sy * c.scrollY) + c.f];
}

/** Depth of a layer with scroll factor s: s < 1 lies behind the actors, s > 1 in front. */
export function scrollDepth(s: number, D: number): number {
  return D * (1 - 1 / s);
}

/**
 * The resting eye's spot: the middle of the view without the shake (the
 * shake moves the frustum, and with it every depth alike, as Phaser does).
 */
export function restCentre(c: CamState, originX = 0.5, originY = 0.5): [number, number] {
  return [c.scrollX + c.w * originX, c.scrollY + c.h * originY];
}

/** Apparent scale of something at depth z, seen from the eye at distance D. */
export function depthScale(z: number, D: number): number {
  return D / (D - z);
}

/**
 * The static 3D spot of a point on a layer with scroll factor s: at depth
 * -D(1/s - 1), pushed out from the view's origin (ox, oy) by 1/s and scaled
 * by 1/s, so that from the middle of the view it looks exactly as the flat
 * game draws it, however the camera scrolls.
 */
export function placeScrolled(x: number, y: number, s: number, D: number, ox: number, oy: number): { x: number; y: number; z: number; scale: number } {
  return { x: ox + (x - ox) / s, y: oy + (y - oy) / s, z: scrollDepth(s, D), scale: 1 / s };
}

/**
 * The spot at depth z that looks, from the resting eye in front of the view
 * centre (cx, cy), exactly where Phaser draws a point with scroll factors
 * (sx, sy): for things pinned to the screen on an axis (scroll factor 0) or
 * with different factors across and down. Moves with the camera.
 */
export function pinAt(
  x: number,
  y: number,
  sx: number,
  sy: number,
  z: number,
  D: number,
  scrollX: number,
  scrollY: number,
  cx: number,
  cy: number,
): { x: number; y: number; scale: number } {
  const k = depthScale(z, D);
  // The same point for a scroll factor of 1 (on the actor plane).
  const x0 = x + (1 - sx) * scrollX;
  const y0 = y + (1 - sy) * scrollY;
  return { x: cx + (x0 - cx) / k, y: cy + (y0 - cy) / k, scale: 1 / k };
}

/** Where a 3D point lands on the actor plane, seen from the eye (ex, ey, D). */
export function projectToPlane(x: number, y: number, z: number, ex: number, ey: number, D: number): [number, number] {
  const k = depthScale(z, D);
  return [ex + (x - ex) * k, ey + (y - ey) * k];
}

/**
 * An off-axis frustum from the eye (ex, ey) at distance D that passes
 * exactly through the rectangle `r` on z = 0: the planes of a projection
 * matrix at distance `near`, in camera space (x right, y up).
 */
export function offAxis(r: Rect, ex: number, ey: number, D: number, near: number): { left: number; right: number; top: number; bottom: number } {
  const k = near / D;
  return {
    left: (r.x0 - ex) * k,
    right: (r.x1 - ex) * k,
    // World y points down, camera y up.
    top: (ey - r.y0) * k,
    bottom: (ey - r.y1) * k,
  };
}

/**
 * Eye distance that shows `viewH / zoom` world pixels of height over a
 * vertical field of view `fovDeg` (the room's resting framing).
 */
export function eyeDistance(viewH: number, zoom: number, fovDeg: number): number {
  return viewH / zoom / 2 / Math.tan((fovDeg * Math.PI) / 360);
}

/**
 * Depth of a scroll-1 object from its DEPTH band (constants.ts): things
 * hung on the walls behind, furniture a little behind the actors, the
 * actors on z = 0, fore-ground pieces in front. Monotonic, so the depth
 * order of the flat game stays the draw order.
 */
const BANDS: readonly (readonly [number, number])[] = [
  [-1000, -190],
  [-100, -150],
  [-50, -60],
  [-20, -34],
  [0, -10],
  [10, -5],
  [20, -2.5],
  [30, 0],
  [40, 1.5],
  [50, 4],
  [60, 34],
  [80, 64],
  [100, 80],
];

/** The box depth the band table is laid out for. */
export const NOMINAL_BACK = 240;

/**
 * A band depth inside a box whose back stands at `back` (negative): the
 * part behind the actors shrinks with a shallower box, so nothing that the
 * flat game draws in front of the room's own back wall ends up behind it.
 */
export function boxedZ(depth: number, back: number): number {
  const z = bandZ(depth);
  if (z >= 0) return z;
  const k = Math.min(1, -back / NOMINAL_BACK);
  return Math.max(back + 1.5, z * k);
}

export function bandZ(depth: number): number {
  const first = BANDS[0]!;
  if (depth <= first[0]) return first[1];
  for (let i = 1; i < BANDS.length; i++) {
    const [d1, z1] = BANDS[i]!;
    if (depth <= d1) {
      const [d0, z0] = BANDS[i - 1]!;
      return z0 + ((depth - d0) / (d1 - d0)) * (z1 - z0);
    }
  }
  return BANDS[BANDS.length - 1]![1];
}

/**
 * Depth between the parts of a cut-out figure (a rig), in their draw order:
 * enough for the depth buffer to keep that order, so little that a whole
 * figure (some thirty parts) stays thinner than the gap between two
 * figures' bands (a rider over his horse stands 0.15 in front of it). The
 * figure then reads as one cut-out: its near and far limbs line up with the
 * floor alike, it casts one shadow, and another figure or a prop is either
 * in front of all of it or behind all of it, never between its parts.
 */
export const RIG_DZ = 0.004;

/** The most parts a figure has (a humanoid with its face, hair and props has some twenty). */
export const RIG_PARTS = 32;

/** Least depth between two figures, in their draw order: a whole figure's thickness. */
export const RIG_GAP = RIG_DZ * RIG_PARTS;

/**
 * How far a card spanning x0..x1, turned by `yaw` about the upright through
 * `ax` (its depth goes as z - (x - ax) sin yaw), reaches toward the viewer
 * (front) and away from the viewer (back).
 */
export function leanReach(x0: number, x1: number, ax: number, yaw: number): { front: number; back: number } {
  const s = Math.sin(yaw);
  const a = -(x0 - ax) * s;
  const b = -(x1 - ax) * s;
  return { front: Math.max(0, a, b), back: Math.max(0, -a, -b) };
}

/**
 * Depth of a leaning card that stands at band depth `z`: moved back (or, in
 * front of the actors, forward) by its reach, so that its turned edge keeps
 * to its own side of the actors' plane and never cuts through a figure.
 */
export function leanZ(z: number, reach: { front: number; back: number }): number {
  return z <= 0 ? z - reach.front : z + reach.back;
}

/** 2D affine matrix (Phaser's TransformMatrix layout): x' = a x + c y + e, y' = b x + d y + f. */
export interface Affine {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export function affine(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0): Affine {
  return { a, b, c, d, e, f };
}

/** out = m · n (n applied first). `out` may be either input. */
export function mul(m: Affine, n: Affine, out: Affine): Affine {
  const a = m.a * n.a + m.c * n.b;
  const b = m.b * n.a + m.d * n.b;
  const c = m.a * n.c + m.c * n.d;
  const d = m.b * n.c + m.d * n.d;
  const e = m.a * n.e + m.c * n.f + m.e;
  const f = m.b * n.e + m.d * n.f + m.f;
  out.a = a;
  out.b = b;
  out.c = c;
  out.d = d;
  out.e = e;
  out.f = f;
  return out;
}

/** Phaser's applyITRS: translate, rotate, scale. */
export function itrs(x: number, y: number, rot: number, sx: number, sy: number, out: Affine): Affine {
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  out.a = cos * sx;
  out.b = sin * sx;
  out.c = -sin * sy;
  out.d = cos * sy;
  out.e = x;
  out.f = y;
  return out;
}
