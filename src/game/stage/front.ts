import type * as THREE from 'three';
import { HULL_H, VIEW_H, VIEW_W } from '../constants';
import type { Rect, RoomDef, SolidDef } from '../data/roomTypes';
import type { PlayerKind } from '../state/types';
import { structural, type BoxFrame } from './themes';

// The box's front face: a wall in the box's own colour standing at the
// front of its floors, torn wide open where the game happens. Its builder
// (the torn paper itself) is wired in with setFrontBuilder; this module
// says where the wall stands and where its tear has to stay open, measured
// on the wall's own plane: everywhere Gorti can walk, jump or reach, with
// his height above him; most of what the camera shows while it rests on
// him, all but a strip at the top and at the bottom of the view, so that
// the torn wall frames the picture; the room's things, the places to
// interact with, and its close-ups. Pure data (unit-tested).

/** What the front's builder gets: game px, y down, z toward the viewer. */
export interface FrontSpec {
  /** The wall's extent. */
  x0: number;
  x1: number;
  top: number;
  bottom: number;
  /** Its depth in front of the actors' plane. */
  z: number;
  /** Places on the wall's plane that its tear keeps open. */
  keepOpen: Rect[];
  /** The box's outside, its inside, and the paper's pale core where it is torn. */
  outside: number;
  inside: number;
  core: number;
  seed: number;
  quality: 'low' | 'high';
}

/** A built front: its meshes (1 unit = 1 game px, y up, z toward the viewer) and their cleanup. */
export interface FrontPart {
  group: THREE.Group;
  dispose(): void;
}

export type FrontBuilder = (spec: FrontSpec) => FrontPart;

let builder: FrontBuilder | null = null;

/** Wires in what builds the box's front (without one, the box stays open in front). */
export function setFrontBuilder(b: FrontBuilder | null): void {
  builder = b;
}

export function frontBuilder(): FrontBuilder | null {
  return builder;
}

/** How far above his floor a player can have some part of himself: a jump's height plus his own, with room to spare (px). */
const HEADROOM: Record<PlayerKind, number> = { gorti: 292, horse: 360, coward: 294, mech: 300, suit: 230 };
/** The camera's centre rests this far above his feet, give or take its dead zone (WorldScene). */
const FOLLOW = { above: HULL_H / 2 + 40, play: 40 } as const;
/** His highest jump (ROOT_MOVE: the camera rises with him). */
const APEX = 150;
/** Columns the room is measured in (px). */
const STEP = 16;
/** A jump carries him this far past the end of what he jumps from, still high up. */
const JUMP_X = 110;
/** The view's framing reaches this far past the end of a floor (px). */
const FRAME_X = 60;
/** Clearance below his feet: the floor's edge stays in sight. */
const FOOT = 12;
/** A little room round everything kept open. */
const MARGIN = 8;
/** Shares of the view's height the torn wall keeps as a frame at its top and its bottom. */
export const FRAME_TOP = 0.1;
export const FRAME_BOTTOM = 0.12;

export interface FrontInput {
  room: RoomDef;
  frame: BoxFrame;
  /** Depth of the wall (px in front of the actors' plane). */
  z: number;
  /** The eye's distance, and how far it sits above the view's centre (px). */
  D: number;
  lift: number;
  /** The room's camera zoom at rest. */
  zoom: number;
  /** Top of the wall (world y). */
  top: number;
  /** How far the wall reaches past the box's ends (its side walls). */
  side: number;
  /** More places to keep open, on the actors' plane: the room's things, its close-ups. */
  extra: readonly Rect[];
  /**
   * Share of the resting view the torn wall keeps as a frame at its bottom
   * (FRAME_BOTTOM); 0: the tear runs just below the floors, and the wall
   * covers their fronts (a paper box's plain board).
   */
  frameBottom?: number;
  colors: { outside: number; inside: number; core: number };
  seed: number;
  quality: 'low' | 'high';
}

interface Surface {
  x0: number;
  x1: number;
  y: number;
  /** A floor of the box (the camera frames the view over it), not a shelf or a piece of furniture. */
  floor: boolean;
}

/** `spans` without x0..x1. */
function cut(spans: [number, number][], x0: number, x1: number): [number, number][] {
  const out: [number, number][] = [];
  for (const [a, b] of spans) {
    if (x1 <= a || x0 >= b) out.push([a, b]);
    else {
      if (x0 > a) out.push([a, x0]);
      if (x1 < b) out.push([x1, b]);
    }
  }
  return out;
}

/** A solid that is always there (no gate, not revealed or grown later). */
const fixed = (s: SolidDef): boolean => !s.when && !s.unless && !s.latent && !s.grow;

/**
 * Where he can stand: the tops of solids, less where something else stands
 * on them; hidden walls and ceilings (collision only) are not stood on, the
 * hidden tops of furniture are.
 */
function surfaces(room: RoomDef): Surface[] {
  const walls = room.solids.filter((s) => fixed(s) && !s.oneWay);
  const out: Surface[] = [];
  const add = (x: number, y: number, w: number, floor: boolean, self: SolidDef | null): void => {
    if (y <= 8) return;
    let spans: [number, number][] = [[x, x + w]];
    for (const o of walls) {
      if (o === self || o.y >= y || o.y + o.h < y) continue;
      spans = cut(spans, o.x, o.x + o.w);
    }
    for (const [a, b] of spans) if (b - a >= 4) out.push({ x0: a, x1: b, y, floor });
  };
  for (const s of room.solids) {
    if (s.hidden && !s.oneWay) continue;
    add(s.x, s.y, s.w, structural(s), s);
  }
  for (const b of room.buds ?? []) add(b.bridge.x, b.bridge.y, b.bridge.w, false, null);
  return out;
}

/** The front of a room's box and what its tear keeps open. */
export function frontSpec(i: FrontInput): FrontSpec {
  const { room, frame } = i;
  const x0 = frame.x0 - i.side - 8;
  const x1 = frame.x1 + i.side + 8;
  const top = i.top;
  const bottom = frame.bottom;
  const vw = VIEW_W / i.zoom;
  const vh = VIEW_H / i.zoom;
  // From the eye, a point behind the wall shows on its plane a little
  // nearer the eye: t of the way.
  const t = i.z / i.D;
  const toPlane = (y: number, ey: number): number => y + t * (ey - y);
  const vh1 = vh * (1 - t);
  const shareBottom = i.frameBottom ?? FRAME_BOTTOM;
  const clampCy = (cy: number): number => (room.height <= vh ? room.height / 2 : Math.max(vh / 2, Math.min(room.height - vh / 2, cy)));
  const head = HEADROOM[room.player] ?? HEADROOM.gorti;
  const walls = room.solids.filter((s) => fixed(s) && !s.oneWay);
  /**
   * The underside of whatever is right above a floor at column x: his
   * headroom ends there. With `hidden`, only the box's own invisible walls
   * count (the view keeps what the room draws in sight).
   */
  const ceilingAt = (x: number, y: number, hidden = false): number => {
    let c = -Infinity;
    for (const s of walls) {
      const b = s.y + s.h;
      if ((!hidden || s.hidden) && x >= s.x && x <= s.x + s.w && b <= y && b > c) c = b;
    }
    return c;
  };
  const groundBelow = (x: number, y: number): boolean => room.solids.some((s) => x >= s.x && x <= s.x + s.w && s.y >= y);
  const surfs = surfaces(room);

  // Column by column: the spans the tear keeps open.
  const keep: Rect[] = [];
  let runs: Rect[] = [];
  for (let c = Math.floor(frame.x0 / STEP) * STEP; c < frame.x1; c += STEP) {
    const cx = c + STEP / 2;
    const iv: [number, number][] = [];
    for (const s of surfs) {
      if (cx < s.x0 - JUMP_X || cx > s.x1 + JUMP_X) continue;
      const ceil = ceilingAt(cx, s.y);
      // No room to stand there (inside a wall beside the floor).
      if (s.y - ceil < 40) continue;
      // The camera over this floor: resting on him, up with him at a jump's top, or a little low.
      const rest = clampCy(s.y - FOLLOW.above - FOLLOW.play / 2);
      const eyeHigh = clampCy(s.y - FOLLOW.above - FOLLOW.play - APEX) - i.lift;
      const eyeLow = clampCy(s.y - FOLLOW.above + FOLLOW.play) - i.lift;
      const eye = rest - i.lift;
      let a = toPlane(Math.max(ceil, s.y - head), eyeHigh) - MARGIN;
      let b = toPlane(s.y + FOOT, eyeLow) + MARGIN;
      if (s.floor && cx >= s.x0 - FRAME_X && cx <= s.x1 + FRAME_X) {
        // All the view but a frame at its top and bottom.
        const frameTop = toPlane(rest - vh / 2, eye) + FRAME_TOP * vh1;
        const box = ceilingAt(cx, s.y, true);
        a = Math.min(a, Math.max(Number.isFinite(box) ? toPlane(box, eye) : -Infinity, frameTop));
        if (shareBottom > 0) b = Math.max(b, toPlane(rest + vh / 2, eye) - shareBottom * vh1);
      }
      // Nothing to land on below: the tear goes down with his fall.
      if (!groundBelow(cx, s.y)) b = bottom;
      if (b > a) iv.push([a, b]);
    }
    iv.sort((p, q) => p[0] - q[0]);
    const merged: [number, number][] = [];
    for (const v of iv) {
      const last = merged[merged.length - 1];
      if (last && v[0] <= last[1]) last[1] = Math.max(last[1], v[1]);
      else merged.push([v[0], v[1]]);
    }
    // Columns alike join into one rect.
    const next: Rect[] = [];
    for (const [a, b] of merged) {
      const run = runs.find((r) => r.x + r.w === c && Math.abs(r.y - a) <= 2 && Math.abs(r.y + r.h - b) <= 2);
      if (run) {
        const y1 = Math.max(run.y + run.h, b);
        run.y = Math.min(run.y, a);
        run.h = y1 - run.y;
        run.w += STEP;
        next.push(run);
      } else {
        const r = { x: c, y: a, w: STEP, h: b - a };
        keep.push(r);
        next.push(r);
      }
    }
    runs = next;
  }
  // Wherever the eye goes (across the room, trailing a little; up and down
  // within the camera's bounds), a thing behind the wall shows on its plane
  // somewhere between these.
  const trail = vw * 0.07;
  const eyeX: [number, number] = room.width <= vw ? [room.width / 2 - trail, room.width / 2 + trail] : [vw / 2 - trail, room.width - vw / 2 + trail];
  const eyeY: [number, number] = [clampCy(-Infinity) - i.lift, clampCy(Infinity) - i.lift];
  const spanX = (a: number, b: number): [number, number] => [Math.min(a, a + t * (eyeX[0] - a)) - MARGIN, Math.max(b, b + t * (eyeX[1] - b)) + MARGIN];
  for (const r of keep) {
    const [a, b] = spanX(r.x, r.x + r.w);
    r.x = a;
    r.w = b - a;
  }
  // (A close-up's eye comes down to the thing itself: it stays open where it is, too.)
  const around = (x: number, y: number, w: number, h: number): void => {
    const [a, b] = spanX(x, x + w);
    const top = Math.min(y, toPlane(y, eyeY[0])) - MARGIN;
    const bot = Math.max(y + h, toPlane(y + h, eyeY[1])) + MARGIN;
    keep.push({ x: a, y: top, w: b - a, h: bot - top });
  };
  for (const e of room.exits) around(e.x, e.y, e.w, e.h);
  for (const p of room.interacts ?? []) around(p.x - 40, p.y - 80, 80, 80);
  for (const a of room.anchors ?? []) {
    around(a.x - 40, a.y - 40, 80, 80);
    around(Math.min(a.x, a.land.x) - 30, Math.min(a.y, a.land.y - 100), Math.abs(a.x - a.land.x) + 60, Math.abs(a.land.y - a.y) + 100);
  }
  for (const p of [...(room.memories ?? []), ...(room.sites ?? []), ...(room.songNodes ?? [])]) around(p.x - 40, p.y - 50, 80, 100);
  for (const r of i.extra) around(r.x, r.y, r.w, r.h);
  // Within the wall, in whole pixels (rounded outward).
  const keepOpen: Rect[] = [];
  for (const r of keep) {
    const rx0 = Math.floor(Math.max(x0, r.x));
    const ry0 = Math.floor(Math.max(top, r.y));
    const rx1 = Math.ceil(Math.min(x1, r.x + r.w));
    const ry1 = Math.ceil(Math.min(bottom, r.y + r.h));
    if (rx1 - rx0 >= 1 && ry1 - ry0 >= 1) keepOpen.push({ x: rx0, y: ry0, w: rx1 - rx0, h: ry1 - ry0 });
  }
  return { x0, x1, top, bottom, z: i.z, keepOpen, outside: i.colors.outside, inside: i.colors.inside, core: i.colors.core, seed: i.seed, quality: i.quality };
}
