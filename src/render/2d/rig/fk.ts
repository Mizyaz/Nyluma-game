import type { RigDef, RigJoint } from './rigTypes';

export type Angles = Record<string, number>;

export interface Solved {
  joint: RigJoint;
  x: number;
  y: number;
  rot: number;
}

/** Joints sorted parents-first (computed once per rig). */
export function orderJoints(rig: RigDef): RigJoint[] {
  const out: RigJoint[] = [];
  const done = new Set<string>();
  const pending = [...rig.joints];
  let guard = 0;
  while (pending.length && guard++ < 1000) {
    const j = pending.shift()!;
    if (j.parent === null || done.has(j.parent)) {
      out.push(j);
      done.add(j.id);
    } else pending.push(j);
  }
  if (pending.length) throw new Error(`Rig ${rig.id}: unresolved joint parents`);
  return out;
}

/**
 * Forward kinematics. `offsets` optionally displaces a joint in its parent's
 * frame (e.g. hips bob, shoulder shrug).
 */
export function solve(
  ordered: readonly RigJoint[],
  angles: Angles,
  offsets?: Record<string, { x: number; y: number }>,
  out: Map<string, Solved> = new Map(),
): Map<string, Solved> {
  for (const j of ordered) {
    const a = angles[j.id] ?? 0;
    const off = offsets?.[j.id];
    const jx = j.x + (off?.x ?? 0);
    const jy = j.y + (off?.y ?? 0);
    let s = out.get(j.id);
    if (!s) {
      s = { joint: j, x: 0, y: 0, rot: 0 };
      out.set(j.id, s);
    }
    if (j.parent === null) {
      s.x = jx;
      s.y = jy;
      s.rot = a;
    } else {
      const p = out.get(j.parent)!;
      const c = Math.cos(p.rot);
      const sn = Math.sin(p.rot);
      s.x = p.x + jx * c - jy * sn;
      s.y = p.y + jx * sn + jy * c;
      s.rot = p.rot + a;
    }
  }
  return out;
}

/** Draw order for a facing direction: near-side limbs in front. */
export function drawOrder(ordered: readonly RigJoint[], facing: 1 | -1): RigJoint[] {
  const nearSide = facing === 1 ? 'R' : 'L';
  const z = (j: RigJoint): number => j.z + (j.side ? (j.side === nearSide ? 100 : -100) : 0);
  return ordered.filter((j) => j.part).sort((a, b) => z(a) - z(b));
}

export function isNear(j: RigJoint, facing: 1 | -1): boolean {
  if (!j.side) return true;
  return (facing === 1 ? 'R' : 'L') === j.side;
}
