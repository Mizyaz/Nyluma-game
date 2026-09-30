import type { Pt } from '../../render/2d/svg';
import type { RigDef, RigJoint } from '../../render/2d/rig/rigTypes';

// The humanoid skeleton every Gorti body and inner form shares, so the
// procedural poses (animPoses: humanoidPose) drive them all: joint ids,
// animation names and the attach points gameplay reads stay the same.

export type LimbSlot = 'torso' | 'head' | 'armR' | 'foreR' | 'armL' | 'foreL' | 'legR' | 'shinR' | 'footR' | 'legL' | 'shinL' | 'footL';

export interface HumanoidDims {
  /** Height of the hips above the feet line. */
  hip: number;
  thigh: number;
  shin: number;
  /** Hips to the neck (the head joint). */
  torso: number;
  shoulderY: number;
  shoulderX: number;
  /** Shoulder to elbow. */
  upper: number;
  hipX: number;
  headX: number;
  /** Elbow to the hand (hand attach points), default 30. */
  hand?: number;
  /** Where the far shoulder sits, as a multiple of shoulderX (default -0.4). */
  farShoulder?: number;
  /** Eye centre in the head frame (both eyes of a three-quarter face). */
  eye?: Pt;
  /** Separate expressive eyebrow (part key, offset above the eye). */
  brow?: { part: string; up: number; dx: number };
  /** Animated face: eye and mouth parts (prefix of their shape set). */
  face?: { eye: string; mouth: string; mouthAt: Pt };
  /** Springy hair clusters on the head. */
  hair?: { part: string; id: string; at: Pt; tip: Pt; z: number; k?: number; c?: number }[];
  /** Part keys where a joint differs from `<prefix>.<limb>`. */
  parts?: Partial<Record<LimbSlot, string>>;
  /** A watch strapped to a shin (part key, side, distance down the shin). */
  watch?: { part: string; side: 'L' | 'R'; at: number };
  /** Extra joints: accessories, skirts, collars. */
  extra?: RigJoint[];
}

export const HUMANOID_ANIMS = [
  'idle', 'walk', 'run', 'rise', 'fall', 'land', 'interact', 'reach', 'song', 'breath', 'transform', 'hurt',
  'collapse', 'push', 'sit', 'kneel', 'shout',
];

export function humanoidRig(id: string, prefix: string, d: HumanoidDims, withWatch = false, glowKey?: string): RigDef {
  const p = (slot: LimbSlot, def: string): string => d.parts?.[slot] ?? `${prefix}.${def}`;
  const j: RigJoint[] = [
    { id: 'root', parent: null, x: 0, y: 0, z: 0 },
    { id: 'hips', parent: 'root', x: 0, y: -d.hip, z: 0 },
    { id: 'torso', parent: 'hips', x: 0, y: 0, part: p('torso', 'torso'), z: 50 },
    { id: 'head', parent: 'torso', x: d.headX, y: -d.torso, part: p('head', 'head'), z: 60 },
    { id: 'armR', parent: 'torso', x: d.shoulderX, y: -d.shoulderY, part: p('armR', 'arm'), side: 'R', z: 70 },
    { id: 'foreR', parent: 'armR', x: 0, y: d.upper, part: p('foreR', 'fore'), side: 'R', z: 71 },
    { id: 'armL', parent: 'torso', x: d.shoulderX * (d.farShoulder ?? -0.4), y: -d.shoulderY - 1, part: p('armL', 'arm'), side: 'L', z: 70 },
    { id: 'foreL', parent: 'armL', x: 0, y: d.upper, part: p('foreL', 'fore'), side: 'L', z: 71 },
    { id: 'legR', parent: 'hips', x: d.hipX, y: -1, part: p('legR', 'thigh'), side: 'R', z: 40 },
    { id: 'shinR', parent: 'legR', x: 0, y: d.thigh, part: p('shinR', 'shin'), side: 'R', z: 41 },
    { id: 'footR', parent: 'shinR', x: 0, y: d.shin, part: p('footR', 'foot'), side: 'R', z: 42 },
    { id: 'legL', parent: 'hips', x: -d.hipX, y: -1, part: p('legL', 'thigh'), side: 'L', z: 40 },
    { id: 'shinL', parent: 'legL', x: 0, y: d.thigh, part: p('shinL', 'shin'), side: 'L', z: 41 },
    { id: 'footL', parent: 'shinL', x: 0, y: d.shin, part: p('footL', 'foot'), side: 'L', z: 42 },
  ];
  const watch = d.watch ?? (withWatch ? { part: 'gorti.watch', side: 'L' as const, at: d.shin - 4 } : null);
  if (watch) j.push({ id: 'watch', parent: `shin${watch.side}`, x: 0, y: watch.at, part: watch.part, side: watch.side, z: 43 });
  if (glowKey && d.eye) j.push({ id: 'eyeGlow', parent: 'head', x: d.eye[0], y: d.eye[1], part: glowKey, z: 65, additive: true });
  if (d.brow && d.eye) {
    j.push({ id: 'browN', parent: 'head', x: d.eye[0] + d.brow.dx, y: d.eye[1] - d.brow.up, part: d.brow.part, z: 66 });
  }
  if (d.face && d.eye) {
    j.push({ id: 'eyeN', parent: 'head', x: d.eye[0], y: d.eye[1], part: `${d.face.eye}.eye`, z: 64 });
    j.push({ id: 'mouth', parent: 'head', x: d.face.mouthAt[0], y: d.face.mouthAt[1], part: `${d.face.mouth}.mouth`, z: 63 });
  }
  for (const hr of d.hair ?? []) {
    // Sways with inertia (see RigView springs).
    j.push({ id: hr.id, parent: 'head', x: hr.at[0], y: hr.at[1], part: hr.part, z: hr.z, spring: { k: hr.k ?? 170, c: hr.c ?? 6.5, lag: 0.7, gain: 0.0045, tip: hr.tip } });
  }
  for (const e of d.extra ?? []) j.push({ ...e });
  const hand = d.hand ?? 30;
  return {
    id,
    joints: j,
    attach: {
      handR: { joint: 'foreR', x: 0, y: hand },
      handL: { joint: 'foreL', x: 0, y: hand },
      chest: { joint: 'torso', x: 2, y: -Math.round(d.shoulderY * 0.7) },
      eye: { joint: 'head', x: d.eye?.[0] ?? 8, y: d.eye?.[1] ?? -20 },
      ankleL: { joint: 'shinL', x: 0, y: d.shin - 4 },
    },
    animations: [...HUMANOID_ANIMS],
  };
}
