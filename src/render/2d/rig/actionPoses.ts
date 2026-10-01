import type { PoseOut, PoseParams } from './animPoses';
import { bellyOf, clamp01, easeIn, easeInOut, easeOut, frac, lerp, placeArm, plantFoot, smooth01, type RigProfile } from './poseKit';

// Big acting poses: the laugh with both hands on the belly, the roaring
// laugh (kahkaha) and the smash (a break move). Each one runs on its own
// time `t` (seconds since it began), or on `PoseParams.k` (0..1 progress)
// when a script drives it. They are layered on the stance the caller has
// set (its torso and head lean and its crouch), and plant the feet with
// inverse kinematics, so every humanoid rig can do them.

/** Angular rate of the "ha"s of a laugh (rad/s: |sin| peaks about 4.3 times a second). */
export const HA = 13.5;

/** Length of a laugh or a roaring laugh when `k` drives it (seconds, for scripts to time it). */
export const LAUGH_T = 2.4;
export const KAHKAHA_T = 2.8;

/**
 * The smash: its length when it runs on time (seconds), and the progress
 * at which the blow lands (`k`; at `SMASH.impact * SMASH.dur` seconds).
 */
export const SMASH = { dur: 0.9, impact: 0.5 } as const;

/** 0..1 how much of a laugh shows: eased in, and out again when `k` drives it. */
export function laughEnv(t: number, prm: PoseParams): number {
  if (prm.k === undefined) return smooth01(0, 0.35, t);
  const u = clamp01(prm.k);
  return smooth01(0, 0.12, u) * (1 - smooth01(0.86, 1, u));
}

/** Feet planted a stance apart, the hips where the pose put them. */
function standOn(p: PoseOut, prof: RigProfile, near: number, far: number, angN = 0, angF = 0): void {
  plantFoot(p, prof, 'R', prof.hipX + near, angN);
  plantFoot(p, prof, 'L', -prof.hipX + far, angF);
}

/** The "ha" beat of a laugh: 0 between, 1 at each ha (sharp at its start, round at its top). */
export function haPulse(t: number, rate = HA): number {
  return Math.pow(Math.abs(Math.sin(t * rate)), 0.65);
}

/**
 * A hearty laugh holding the round belly with both hands: the torso bounces
 * with every "ha", the head tips back, the shoulders shake.
 */
export function laughPose(p: PoseOut, prof: RigProfile, t: number, prm: PoseParams, holdsTorch: boolean): number {
  const a = p.angles;
  const env = laughEnv(t, prm);
  const pulse = haPulse(t) * env;
  // The laugh rolls on in slower waves.
  const roll = Math.sin(t * HA * 0.23) * env;
  const drop = p.offsets.hips?.y ?? 0;
  p.offsets.hips = { x: 1.6 * env, y: drop + 1.2 * env + 1.9 * pulse };
  standOn(p, prof, 2 * env, -2.5 * env);
  // A hunched stance straightens up to laugh.
  const un = 1 - 0.85 * env;
  a.torso = (a.torso ?? 0) * un + (-0.17 + 0.075 * pulse) * env + 0.035 * roll;
  a.head = (a.head ?? 0) * un + (-0.36 - 0.11 * pulse) * env + 0.07 * roll;
  // The belly jiggles; the shoulders jump with each ha.
  p.offsets.torso = { x: 0.7 * pulse, y: -0.7 * pulse };
  const shake = Math.sin(t * HA * 2) * env;
  p.offsets.armR = { x: 0.5 * shake, y: -1.9 * pulse };
  p.offsets.armL = { x: -0.5 * shake, y: -1.6 * pulse };
  // Both hands on the belly.
  const [bx, by] = bellyOf(prof);
  const before = { armR: a.armR ?? 0, foreR: a.foreR ?? 0, armL: a.armL ?? 0, foreL: a.foreL ?? 0 };
  if (!holdsTorch) placeArm(p, prof, 'R', bx - 1.2, by + 4.5 + 1.1 * pulse);
  placeArm(p, prof, 'L', bx + 1, by - 4.5 + 1.1 * pulse);
  for (const id of holdsTorch ? (['armL', 'foreL'] as const) : (['armR', 'foreR', 'armL', 'foreL'] as const)) a[id] = lerp(before[id], a[id] ?? 0, env);
  p.sy = 1 - 0.026 * pulse;
  p.sx = 1 + 0.02 * pulse;
  return pulse;
}

/**
 * A roaring laugh: leaning far back, one hand slapping the belly on the
 * beat, the other thrown up high. The near arm is the one thrown up (the
 * big heads would hide the far one), the far hand slaps the belly's front.
 */
export function kahkahaPose(p: PoseOut, prof: RigProfile, t: number, prm: PoseParams): number {
  const a = p.angles;
  const env = laughEnv(t, prm);
  const q = t * HA * 0.9;
  const pulse = haPulse(t, HA * 0.9) * env;
  const drop = p.offsets.hips?.y ?? 0;
  p.offsets.hips = { x: 3.4 * env, y: drop + (2.8 + 2.4 * pulse) * env };
  standOn(p, prof, 6 * env, -6.5 * env, 0, 0.1 * env);
  const un = 1 - 0.85 * env;
  a.torso = (a.torso ?? 0) * un + (-0.3 + 0.09 * pulse) * env;
  a.head = (a.head ?? 0) * un + (-0.42 - 0.12 * pulse) * env + 0.05 * Math.sin(q * 0.5) * env;
  p.offsets.torso = { x: 0.9 * pulse, y: -0.9 * pulse };
  const shake = Math.sin(q * 2) * env;
  p.offsets.armR = { x: 0.6 * shake, y: -2.2 * pulse };
  p.offsets.armL = { x: -0.4 * shake, y: -2 * pulse };
  const before = { armR: a.armR ?? 0, foreR: a.foreR ?? 0, armL: a.armL ?? 0, foreL: a.foreL ?? 0 };
  // The near arm thrown up high and forward, waving with the laugh.
  a.armR = -2.1 + 0.13 * Math.sin(q);
  a.foreR = -0.32 + 0.18 * Math.sin(q + 1.1);
  // The far hand: away from the belly slowly, then a quick slap on a ha.
  const s = frac(q / (Math.PI * 2) + 0.1);
  const away = s < 0.7 ? easeOut(s / 0.7) : s < 0.84 ? 1 - easeIn((s - 0.7) / 0.14) : 0;
  const [bx, by] = bellyOf(prof);
  placeArm(p, prof, 'L', bx + 1 + 7 * away, by + 1 - 10 * away);
  for (const id of ['armR', 'foreR', 'armL', 'foreL'] as const) a[id] = lerp(before[id], a[id] ?? 0, env);
  // The slap lands: a little jolt.
  const slap = s >= 0.84 ? Math.exp(-(s - 0.84) * 30) * env : 0;
  p.sy = 1 - 0.03 * pulse - 0.02 * slap;
  p.sx = 1 + 0.024 * pulse + 0.015 * slap;
  return pulse;
}

/** Phases of the smash (by progress k). */
export function smashPhase(u: number): 'wind' | 'strike' | 'impact' | 'recover' {
  if (u < 0.42) return 'wind';
  if (u < SMASH.impact) return 'strike';
  if (u < 0.68) return 'impact';
  return 'recover';
}

/** A back-ease: overshoots its end a little, then settles. */
const easeOutBack = (x: number): number => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

interface SmashKey {
  hx: number;
  hy: number;
  torso: number;
  head: number;
  /** Near foot: ankle x, lift and angle; far foot: x and angle. */
  nx: number;
  nLift: number;
  nAng: number;
  fx: number;
  fAng: number;
  armR: number;
  foreR: number;
  armL: number;
  foreL: number;
}

function mixKey(x: SmashKey, y: SmashKey, k: number): SmashKey {
  const o = { ...x };
  for (const key of Object.keys(x) as (keyof SmashKey)[]) o[key] = lerp(x[key], y[key], k);
  return o;
}

/**
 * The smash, a break move in four beats. Wind-up: the weight rocks back,
 * the near knee comes up, the fist is raised over the front and cocked high
 * behind the head while the other hand aims. A short hold. The blow: the
 * fist swings over the top and down to the ground in front as the body
 * pitches forward into a lunge and the near foot stamps. Impact: squash and
 * a shudder, held. Then the recovery overshoots a little and settles.
 */
export function smashPose(p: PoseOut, prof: RigProfile, t: number, prm: PoseParams): number {
  const a = p.angles;
  const u = prm.k !== undefined ? clamp01(prm.k) : clamp01(t / SMASH.dur);
  const L = prof.thigh + prof.shin;
  const drop = p.offsets.hips?.y ?? 0;
  const rest: SmashKey = {
    hx: 0, hy: drop, torso: a.torso ?? 0, head: a.head ?? 0,
    nx: prof.hipX + 1, nLift: 0, nAng: 0, fx: -prof.hipX - 1, fAng: 0,
    armR: a.armR ?? 0, foreR: a.foreR ?? 0, armL: a.armL ?? 0, foreL: a.foreL ?? 0,
  };
  // Wound up: rocked back on the far leg, the near knee high, the fist
  // cocked behind the head (raised forward and over, so its angle is below
  // -π and the blow swings on over the top), the other hand aiming.
  const wind: SmashKey = {
    hx: -3.5, hy: drop - L * 0.02, torso: -0.2, head: 0.12,
    nx: prof.hipX + 5, nLift: L * 0.44, nAng: 0.4, fx: -prof.hipX - 3, fAng: 0,
    armR: -3.45, foreR: -1.15, armL: -1.3, foreL: -0.3,
  };
  const coil: SmashKey = { ...wind, hx: -4.5, hy: wind.hy + L * 0.04, torso: -0.27, armR: -3.62, foreR: -1.3, nLift: L * 0.47 };
  // Landed: a deep lunge pitched forward, the fist hammered down in front
  // (the arm straight, forward and down), the far arm flung back, the back
  // leg long and up on its ball.
  const hit: SmashKey = {
    hx: L * 0.1, hy: drop + L * 0.3, torso: 0.5, head: -0.2,
    nx: prof.hipX + L * 0.42, nLift: 0, nAng: 0, fx: -prof.hipX - L * 0.32, fAng: 0.45,
    armR: -0.72 - 0.5, foreR: -0.06, armL: 1.4, foreL: -0.45,
  };
  const phase = smashPhase(u);
  const imp = u >= SMASH.impact ? Math.exp(-(u - SMASH.impact) * 12) : 0;
  let k: SmashKey;
  let stretch = 0;
  if (phase === 'wind') {
    // Up to the wound pose, then a slow extra coil (the hold before the blow).
    k = u < 0.32 ? mixKey(rest, wind, easeInOut(u / 0.32)) : mixKey(wind, coil, easeOut((u - 0.32) / 0.1));
  } else if (phase === 'strike') {
    const s = easeIn((u - 0.42) / (SMASH.impact - 0.42));
    k = mixKey(coil, hit, s);
    stretch = Math.sin(s * Math.PI);
  } else if (phase === 'impact') k = hit;
  else k = mixKey(hit, rest, easeOutBack(smooth01(0.68, 1, u)));
  p.offsets.hips = { x: k.hx, y: k.hy + 1.8 * imp };
  a.torso = k.torso + 0.06 * imp;
  a.head = k.head;
  // Feet: the near one lifts and stamps, the back one pushes off its ball.
  plantFoot(p, prof, 'R', k.nx, k.nAng, k.nLift);
  plantFoot(p, prof, 'L', k.fx, k.fAng);
  a.armR = k.armR;
  a.foreR = k.foreR;
  a.armL = k.armL;
  a.foreL = k.foreL;
  // Stretched through the blow, squashed at the impact, a shudder after.
  const coiled = phase === 'wind' ? smooth01(0.2, 0.42, u) : 0;
  p.sx = 1 + 0.1 * imp - 0.03 * coiled - 0.04 * stretch;
  p.sy = 1 - 0.11 * imp + 0.03 * coiled + 0.05 * stretch;
  p.x = 1.1 * Math.sin(t * 90) * imp;
  return imp;
}
