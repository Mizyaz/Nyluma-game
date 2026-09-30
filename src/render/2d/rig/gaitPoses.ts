import type { PoseOut } from './animPoses';
import { ankleFor, frac, hipJoint, lerp, placeLeg, smooth01, type RigProfile } from './poseKit';

// Walking and running with the feet on the ground. Each foot is planted
// for part of the cycle and moves back with the ground exactly as fast as
// the body travels (the walk phase advances 2π per `cycle` px, as Player
// drives it), so it does not slide; the hips sink as far as the legs need
// to reach. Each step goes through the classic poses: contact (heel down,
// toes up), down (the knee takes the weight), passing, up (pushing off the
// ball of the back foot), with the arms swinging against the legs.

export interface Gait {
  /** Share of the cycle a foot is on the ground: walking, running. */
  duty: [number, number];
  /** Swing foot lift, as a share of the leg: walking, running. */
  lift: [number, number];
  /** Hip bob (px) at the low point of a step: walking, running. */
  bob: [number, number];
  /** Torso pitch into the motion: walking, running. */
  lean: [number, number];
  /** Arm swing (rad): walking, running. */
  arm: [number, number];
  /** Elbow bend (rad): walking, running. */
  elbow: [number, number];
  /** Heel strike (toes up, rad) and push-off (heel up, rad). */
  strike: number;
  push: number;
  /** How far (share of the leg) the hips may sink below their stance to keep a foot planted. */
  sink: number;
  /** Where the stance is centred ahead of the hip (share of the leg). */
  ahead: number;
}

/** Per build: a bouncy root body, the heavy Sivaslı body, the scared torch-bearer, the machine, the tired suit. */
export const GAITS: Record<'root' | 'human' | 'coward' | 'mech' | 'suit', Gait> = {
  root: { duty: [0.6, 0.43], lift: [0.17, 0.3], bob: [2, 3.6], lean: [0.05, 0.15], arm: [0.5, 0.85], elbow: [0.35, 1.1], strike: -0.32, push: 0.62, sink: 0.26, ahead: 0.06 },
  human: { duty: [0.62, 0.47], lift: [0.14, 0.22], bob: [1.8, 3], lean: [0.03, 0.09], arm: [0.36, 0.62], elbow: [0.3, 0.8], strike: -0.3, push: 0.55, sink: 0.24, ahead: 0.05 },
  coward: { duty: [0.62, 0.5], lift: [0.12, 0.17], bob: [1.1, 1.6], lean: [0.02, 0.06], arm: [0, 0], elbow: [0, 0], strike: -0.18, push: 0.5, sink: 0.22, ahead: 0.02 },
  mech: { duty: [0.62, 0.52], lift: [0.13, 0.18], bob: [0.7, 1.1], lean: [0.02, 0.05], arm: [0.18, 0.26], elbow: [0.2, 0.3], strike: -0.06, push: 0.22, sink: 0.22, ahead: 0.04 },
  suit: { duty: [0.62, 0.6], lift: [0.08, 0.1], bob: [1, 1.2], lean: [0.02, 0.03], arm: [0.12, 0.14], elbow: [0.1, 0.14], strike: -0.14, push: 0.34, sink: 0.26, ahead: 0.02 },
};

/** A Hermite curve from p0 to p1 with end velocities m0, m1 (per unit u). */
function hermite(p0: number, p1: number, m0: number, m1: number, u: number): number {
  const u2 = u * u;
  const u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1;
}

/** A soft maximum (rounded over about `r` px) so the hips never kink. */
function softMax(a: number, b: number, r = 1.6): number {
  return (a + b + Math.sqrt((a - b) * (a - b) + r * r)) / 2;
}

export interface Foot {
  /** Ankle target (root frame) and the foot's angle in the world. */
  x: number;
  y: number;
  ang: number;
  /** On the ground (planted). */
  down: boolean;
  /** 0..1 through its stance or its swing. */
  u: number;
}

/**
 * One foot through the cycle. `s` is 0 at its heel strike; it is planted
 * until `beta`, then swings forward to land at `front` again.
 */
export function footAt(prof: RigProfile, g: Gait, s: number, beta: number, cycle: number, front: number, lift: number): Foot {
  const back = front - beta * cycle;
  if (s < beta) {
    const v = s / beta;
    // Planted: moves back with the ground. Heel first, rolls flat, then
    // the heel peels up and the foot rocks onto its ball.
    const x = front - s * cycle;
    const ang = v < 0.2 ? g.strike * (1 - smooth01(0, 0.2, v)) : v > 0.58 ? g.push * Math.pow((v - 0.58) / 0.42, 1.6) : 0;
    const [ax, ay] = ankleFor(prof, x, ang);
    return { x: ax, y: ay, ang, down: true, u: v };
  }
  const u = (s - beta) / (1 - beta);
  // Swing: leaves backwards off the toe, sweeps forward and reaches, then
  // pulls back to land moving with the ground (no skid).
  const span = (1 - beta) * cycle;
  const x = hermite(back, front, -span * 0.6, -span * 0.9, u);
  const h = lift * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 1.1);
  // Toes trail pointing down after the push, then flex up for the heel.
  const ang = lerp(g.push * 1.25, g.strike, smooth01(0.18, 0.86, u));
  const [ax, ay] = ankleFor(prof, x, ang, h);
  return { x: ax, y: ay, ang, down: false, u };
}

export interface GaitOut {
  /** 0 walking … 1 running. */
  run: number;
  /** Share of the cycle a foot is planted. */
  beta: number;
  /** 0..1 how low the body is in its step (1 at the low point). */
  low: number;
  /** The same a beat later: what loose, heavy parts (a belly) follow. */
  settle: number;
  feet: { R: Foot; L: Foot };
}

/**
 * Legs, hips, torso lean and arm swing of a walk or run at `phase` (the
 * walk phase: 2π per `cycle` px travelled) and `sp` (0..1 of top speed).
 * The right foot strikes at phase π/2, the left at 3π/2 (the footfall
 * sounds). Leaves the torso and head on top of their current angles.
 */
export function gaitPose(p: PoseOut, prof: RigProfile, g: Gait, cycle: number, phase: number, sp: number, drop: number, arms = true): GaitOut {
  const a = p.angles;
  const run = smooth01(0.3, 0.95, sp);
  const leg = prof.thigh + prof.shin;
  const reach = leg * 0.985;
  const H0 = prof.hip + 1;
  // How much of the cycle a foot can stay planted: the stance travel must
  // fit what the legs reach with the hips sunk as far as allowed.
  const [, yS] = ankleFor(prof, 0, g.strike);
  const [, yP] = ankleFor(prof, 0, g.push);
  const sunk = H0 - drop - g.sink * leg;
  const fr = Math.sqrt(Math.max(0, reach * reach - (sunk + yS) * (sunk + yS)));
  const bk = Math.sqrt(Math.max(0, reach * reach - (sunk + yP) * (sunk + yP)));
  const beta = Math.min(lerp(g.duty[0], g.duty[1], run), (fr + bk - 2) / cycle);
  const ahead = g.ahead * leg * (0.4 + 0.6 * sp);
  const lift = lerp(g.lift[0], g.lift[1], run) * leg * (0.55 + 0.45 * sp);
  const hx = 1.5 * run;
  const sR = frac((phase - Math.PI / 2) / (Math.PI * 2));
  const sL = frac(sR + 0.5);
  // Each stance is centred under (a little ahead of) its own hip joint.
  const centre = (side: 'R' | 'L'): number => hx + (side === 'R' ? prof.hipX : -prof.hipX) + ahead;
  const front = (side: 'R' | 'L'): number => centre(side) + (beta * cycle) / 2;
  const feet = {
    R: footAt(prof, g, sR, beta, cycle, front('R'), lift),
    L: footAt(prof, g, sL, beta, cycle, front('L'), lift),
  };
  // The bob: walking, lowest just after contact (down) and highest before
  // the next (up); running, lowest mid-stance and highest in the air.
  const sig = frac(sR * 2);
  const lowAt = lerp(0.2, beta, run);
  const low = 0.5 + 0.5 * Math.cos(Math.PI * 2 * (sig - lowAt));
  let dy = drop + lerp(g.bob[0], g.bob[1], run) * (0.4 + 0.6 * sp) * low;
  // Sink as far as a planted foot needs.
  p.offsets.hips = { x: hx, y: 0 };
  for (const side of ['R', 'L'] as const) {
    const f = feet[side];
    const [jx] = hipJoint(p, prof, side);
    const dx = f.x - jx;
    const need = f.y + H0 - Math.sqrt(Math.max(0, reach * reach - dx * dx));
    if (f.down) dy = softMax(dy, need);
  }
  p.offsets.hips = { x: hx, y: dy };
  placeLeg(p, prof, 'R', feet.R.x, feet.R.y, feet.R.ang);
  placeLeg(p, prof, 'L', feet.L.x, feet.L.y, feet.L.ang);
  // Pitched into the motion, rocking a little with each push; the head
  // keeps the eyes level and nods a beat after the body's low point.
  const lean = lerp(g.lean[0], g.lean[1], run) * sp;
  a.torso = (a.torso ?? 0) + lean + 0.022 * run * Math.cos(Math.PI * 2 * (sig - lowAt - 0.25));
  a.head = (a.head ?? 0) - lean * 0.55 + 0.035 * (0.4 + 0.6 * sp) * Math.cos(Math.PI * 2 * (sig - lowAt - 0.12));
  if (arms) {
    // Arms against the legs: the right arm is forward as the left foot
    // lands; the forearm follows through a beat later.
    const A = lerp(g.arm[0], g.arm[1], run) * (0.45 + 0.55 * sp);
    const E = lerp(g.elbow[0], g.elbow[1], run);
    const w = Math.PI * 2 * (sR - 0.5 - 0.06);
    const swing = Math.cos(w);
    const fol = 0.5 - 0.5 * Math.cos(w - 0.55);
    a.armR = 0.04 - A * swing;
    a.armL = 0.1 + A * swing;
    a.foreR = -E - 0.45 * A * fol;
    a.foreL = -E - 0.45 * A * (1 - fol);
  }
  const settle = 0.5 + 0.5 * Math.cos(Math.PI * 2 * (sig - lowAt - 0.14));
  return { run, beta, low, settle, feet };
}

/**
 * Standing: the feet planted apart, the weight shifting slowly from one
 * leg to the other, knees giving a little.
 */
export function standPose(p: PoseOut, prof: RigProfile, t: number, drop: number, sway = 1): number {
  const shift = Math.sin(t * 0.83) * sway;
  const settle = 0.5 - 0.5 * Math.cos(t * 1.66);
  p.offsets.hips = { x: (p.offsets.hips?.x ?? 0) + 1.3 * shift, y: drop + 0.5 * settle * sway };
  const [axR, ayR] = ankleFor(prof, prof.hipX + 1.5, 0);
  const [axL, ayL] = ankleFor(prof, -prof.hipX - 0.5, 0);
  placeLeg(p, prof, 'R', axR, ayR, 0);
  placeLeg(p, prof, 'L', axL, ayL, 0);
  return shift;
}
