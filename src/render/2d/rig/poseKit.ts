import type { PoseOut } from './animPoses';

// Tools the procedural poses share: easing, the rig profiles (bone lengths
// the skeleton builder registers per rig id) and two-bone inverse
// kinematics, which plants feet on the ground and puts hands where they
// belong (on the belly, on the ground in front).
//
// Angle convention (rigTypes): a limb hanging down has angle 0, positive
// angles turn clockwise on screen (y down), so a limb at angle θ points
// along (-sin θ, cos θ). The rig faces right (+x).

export const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
export const easeIn = (x: number): number => x * x;
export const easeOut = (x: number): number => 1 - (1 - x) * (1 - x);
export const easeInOut = (x: number): number => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
export const smooth01 = (e0: number, e1: number, x: number): number => {
  const u = clamp01((x - e0) / (e1 - e0));
  return u * u * (3 - 2 * u);
};
/** Fractional part (0..1) of x. */
export const frac = (x: number): number => x - Math.floor(x);

// ------------------------------------------------------------ profiles

/**
 * What the poses need to know of a rig beyond its id: its bone lengths, its
 * foot, where its belly is, and how its eyes blink.
 */
export interface RigProfile {
  /** Hips above the feet line, thigh and shin lengths, hip joints' x. */
  hip: number;
  thigh: number;
  shin: number;
  hipX: number;
  /** Shoulder joints (torso frame), upper arm and forearm-to-hand lengths. */
  shoulderX: number;
  shoulderY: number;
  farShoulder: number;
  upper: number;
  hand: number;
  /** Hips to the neck. */
  torso: number;
  /** The front of the belly in the torso frame (where hands hold it). */
  belly?: [number, number];
  /** Foot: sole depth below the ankle, heel and ball x (the foot's frame). */
  sole?: number;
  heel?: number;
  ball?: number;
  /** How the eyes blink: lids close ('shut') or the eye squashes to a line. */
  blink?: 'shut' | 'squash';
  /** Distance travelled per walk cycle (two steps), if not the usual (see cycleOf). */
  cycle?: number;
}

const PROFILES = new Map<string, RigProfile>();

/** The youth's build: used for rig ids nobody registered (the title menu's 'gorti.root'). */
const FALLBACK: RigProfile = {
  hip: 50, thigh: 23, shin: 23, hipX: 5, shoulderX: 3, shoulderY: 37, farShoulder: -0.4, upper: 22, hand: 27, torso: 44, belly: [15, -17], sole: 6, heel: -5, ball: 8, blink: 'squash',
};

export function registerRig(id: string, prof: RigProfile): void {
  PROFILES.set(id, prof);
}

/** The registered profile of a rig, if any. */
export function rigProfile(id: string): RigProfile | undefined {
  return PROFILES.get(id);
}

/** The profile a pose works with: the rig's own, or a stand-in build. */
export function profileOf(id: string): RigProfile {
  return PROFILES.get(id) ?? FALLBACK;
}

/**
 * Distance a body travels per walk cycle (two steps). It must be the
 * length Player advances the walk phase by (2π per strideLen px): a root
 * body 124 px scaled by its legs (46 px legs are 1), the suited Gorti 70,
 * the others 92. Then a planted foot moves back exactly with the ground.
 */
export function cycleOf(id: string, prof: RigProfile): number {
  if (prof.cycle) return prof.cycle;
  if (id.startsWith('gorti.root')) return 124 * Math.max(0.75, Math.min(1.4, (prof.thigh + prof.shin) / 46));
  if (id.includes('suit')) return 70;
  return 92;
}

/** Where the belly's front is (torso frame). */
export function bellyOf(prof: RigProfile): [number, number] {
  return prof.belly ?? [prof.shoulderX + prof.shoulderY * 0.32, -prof.shoulderY * 0.4];
}

// ------------------------------------------------------------ inverse kinematics

/**
 * Two-bone IK in the parent's frame: from the joint at (ax, ay) the chain
 * of bones l1, l2 reaches for (tx, ty) (as far as it can). `bend` +1 puts
 * the middle joint in front of the line (a knee), -1 behind it (an elbow).
 * Returns the two local angles and how far the target was (1 = full reach).
 */
export function ik2(ax: number, ay: number, tx: number, ty: number, l1: number, l2: number, bend: 1 | -1): { a1: number; a2: number; reach: number } {
  const dx = tx - ax;
  const dy = ty - ay;
  const dist = Math.hypot(dx, dy);
  const d = Math.min((l1 + l2) * 0.9995, Math.max(Math.abs(l1 - l2) + 0.01, dist));
  const th = Math.atan2(-dx, dy);
  const alpha = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const inner = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2))));
  const beta = Math.PI - inner;
  return bend === 1 ? { a1: th - alpha, a2: beta, reach: dist / (l1 + l2) } : { a1: th + alpha, a2: -beta, reach: dist / (l1 + l2) };
}

/** A point of the foot's frame turned by `ang` (radians, + = toes down). */
function turn(u: number, v: number, ang: number): [number, number] {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return [u * c - v * s, u * s + v * c];
}

/**
 * Where the ankle is when the foot touches the ground (y = 0) at x, turned
 * by `ang`: flat, rocked back on its heel (ang < 0, toes up) or up on its
 * ball (ang > 0, heel up). `lift` raises it off the ground.
 */
export function ankleFor(prof: RigProfile, x: number, ang: number, lift = 0): [number, number] {
  const sole = prof.sole ?? 6;
  const pivot = ang < 0 ? (prof.heel ?? -5) : ang > 0 ? (prof.ball ?? 8) : 0;
  const [px, py] = turn(pivot, sole, ang);
  return [x + pivot - px, -lift - py];
}

/** The hip joint of a leg (root frame), with the pose's hips and leg offsets. */
export function hipJoint(p: PoseOut, prof: RigProfile, side: 'R' | 'L'): [number, number] {
  const h = p.offsets.hips ?? { x: 0, y: 0 };
  const o = p.offsets[`leg${side}`] ?? { x: 0, y: 0 };
  return [h.x + (side === 'R' ? prof.hipX : -prof.hipX) + o.x, -prof.hip + h.y - 1 + o.y];
}

/**
 * Puts a leg's ankle at (x, y) of the root frame (the ground is y = 0) and
 * turns its foot to `ang` in the world (0 = flat). The hips stay unturned.
 * Returns how far the ankle was (1 = the leg straight).
 */
export function placeLeg(p: PoseOut, prof: RigProfile, side: 'R' | 'L', x: number, y: number, ang: number): number {
  const [hx, hy] = hipJoint(p, prof, side);
  const r = ik2(hx, hy, x, y, prof.thigh, prof.shin, 1);
  p.angles[`leg${side}`] = r.a1;
  p.angles[`shin${side}`] = r.a2;
  p.angles[`foot${side}`] = ang - (r.a1 + r.a2);
  return r.reach;
}

/** Plants a foot on the ground at x: flat, on its heel (ang < 0) or on its ball (ang > 0). */
export function plantFoot(p: PoseOut, prof: RigProfile, side: 'R' | 'L', x: number, ang = 0, lift = 0): number {
  const [ax, ay] = ankleFor(prof, x, ang, lift);
  return placeLeg(p, prof, side, ax, ay, ang);
}

/** A shoulder joint in the torso frame. */
export function shoulderJoint(p: PoseOut, prof: RigProfile, side: 'R' | 'L'): [number, number] {
  const o = p.offsets[`arm${side}`] ?? { x: 0, y: 0 };
  return side === 'R' ? [prof.shoulderX + o.x, -prof.shoulderY + o.y] : [prof.shoulderX * prof.farShoulder + o.x, -prof.shoulderY - 1 + o.y];
}

/**
 * Puts a hand at (x, y) of the torso frame (the palm: `palm` of the way
 * from the elbow to the fingertips), the elbow bent behind.
 */
export function placeArm(p: PoseOut, prof: RigProfile, side: 'R' | 'L', x: number, y: number, palm = 0.82): number {
  const [sx, sy] = shoulderJoint(p, prof, side);
  const r = ik2(sx, sy, x, y, prof.upper, prof.hand * palm, -1);
  p.angles[`arm${side}`] = r.a1;
  p.angles[`fore${side}`] = r.a2;
  return r.reach;
}

/** A point of the root frame in the torso's frame (with the pose's hips, torso offset and lean). */
export function toTorso(p: PoseOut, prof: RigProfile, x: number, y: number): [number, number] {
  const h = p.offsets.hips ?? { x: 0, y: 0 };
  const t = p.offsets.torso ?? { x: 0, y: 0 };
  const ox = h.x + t.x;
  const oy = -prof.hip + h.y + t.y;
  const a = -(p.angles.torso ?? 0);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const dx = x - ox;
  const dy = y - oy;
  return [dx * c - dy * s, dx * s + dy * c];
}

/** Blends the angles of `to` into the pose by k (0 keeps the pose). */
export function blendAngles(p: PoseOut, to: Record<string, number>, k: number): void {
  for (const [id, v] of Object.entries(to)) {
    const cur = p.angles[id] ?? 0;
    p.angles[id] = cur + (v - cur) * k;
  }
}
