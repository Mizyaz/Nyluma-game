import { ellipsePath } from '../../render/2d/svg';
import { DETAIL, flat, PASTEL } from '../../render/2d/style';
import type { PartArt, RigDef } from '../../render/2d/rig/rigTypes';
import type { RoomId } from '../../engine/state/types';
import { lifeStageOf, type LifeStage } from '../data/lifeStages';
import { childParts, RIG_GORTI_CHILD } from './gortiChild';
import { youthParts, RIG_GORTI_YOUTH } from './gortiYouth';
import { warriorParts, RIG_GORTI_WARRIOR } from './gortiWarrior';
import { RIG_GORTI_HUMAN, RIG_GORTI_HUMAN_SUN, RIG_GORTI_SUIT, sivasliParts } from './sivasli';
import { ink, part } from './kit';

// Gorti Evaskinan, drawn after the author's paintings. His own (root) body
// grows up with the story (lifeStages: the child of painting 1, the youth of
// painting 3, the warrior of painting 4); his human form, the Sivaslı
// amca/dede of painting 2, wears the Moon or the Sun as its head depending
// on the sky of the room; the suited form works in the office.

export { humanoidRig, type HumanoidDims } from './skeleton';
export { brow, eyeParts, mouthParts } from './face';
export { RIG_GORTI_CHILD, RIG_GORTI_YOUTH, RIG_GORTI_WARRIOR, RIG_GORTI_HUMAN, RIG_GORTI_HUMAN_SUN, RIG_GORTI_SUIT };

/** Gorti's own body at each life stage. */
export const ROOT_RIGS: Readonly<Record<LifeStage, RigDef>> = {
  child: RIG_GORTI_CHILD,
  youth: RIG_GORTI_YOUTH,
  warrior: RIG_GORTI_WARRIOR,
};

/** Rooms under the Sun (the ride and the Sun's arena); every other sky has the Moon. */
export const SUN_ROOMS: ReadonlySet<RoomId> = new Set<RoomId>(['r07', 'r08']);

/** Gorti's own body in a room: the rig of his life stage there. */
export function rootRigFor(room: RoomId): RigDef {
  return ROOT_RIGS[lifeStageOf(room)];
}

/** The human form in a room: the Sun head by day, the Moon head otherwise. */
export function humanRigFor(room: RoomId): RigDef {
  return SUN_ROOMS.has(room) ? RIG_GORTI_HUMAN_SUN : RIG_GORTI_HUMAN;
}

/**
 * The root body for callers that know no room (the title menu, a mounted
 * rider): the youth, Gorti of "Late to Work".
 */
export const RIG_GORTI_ROOT: RigDef = RIG_GORTI_YOUTH;

/** The pocket watch the story hands around (r10, r12 read it as a sprite). */
function watch(): PartArt {
  return part('gorti.watch', { x0: -6, y0: -5, x1: 6, y1: 5 }, (ox, oy) =>
    flat(`M${ox - 5.5} ${oy - 2}H${ox + 5.5}V${oy + 2}H${ox - 5.5}Z`, '#5f4f45', { stroke: DETAIL }) +
    flat(ellipsePath(ox + 1, oy, 3.5, 3.5), PASTEL.cream, { stroke: DETAIL * 1.1, over: ink(`M${ox + 1} ${oy}v-2M${ox + 1} ${oy}l1.4 0.7`, 0.8) }),
  );
}

export function gortiParts(): PartArt[] {
  return [...childParts(), ...youthParts(), ...warriorParts(), ...sivasliParts(), watch()];
}
