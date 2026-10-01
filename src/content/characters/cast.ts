import type { RigDef } from '../../render/2d/rig/rigTypes';
import type { PoseFn } from '../../render/2d/rig/RigView';
import { humanoidPose } from '../../render/2d/rig/animPoses';
import { NAMES } from '../data/dialogue.tr';
import { RIG_COWARD, RIG_MECH } from './forms';
import { RIG_GORTI_CHILD } from './gortiChild';
import { RIG_GORTI_WARRIOR } from './gortiWarrior';
import { RIG_GORTI_YOUTH } from './gortiYouth';
import { RIG_GORTI_HUMAN, RIG_GORTI_HUMAN_BALD, RIG_GORTI_HUMAN_SUN, RIG_GORTI_SUIT } from './sivasli';

// Who can stand in a room and talk (a room file's `npcs[].who`, and the
// `who` of its lines). Speakers without a body (the Sun, the Moons, the
// narrator) can still talk in lines by their NAMES key.

export interface CastMember {
  /** The name on the dialogue balloon. */
  name: string;
  rig: RigDef;
  pose: PoseFn;
}

const humanoid: PoseFn = (anim, t, prm, rigId) => humanoidPose(rigId, anim, t, prm);

export const CAST: Record<string, CastMember> = {
  coward: { name: NAMES.coward, rig: RIG_COWARD, pose: humanoid },
  mech: { name: 'Mekanik Form', rig: RIG_MECH, pose: humanoid },
  suit: { name: 'Takım Elbiseli', rig: RIG_GORTI_SUIT, pose: humanoid },
  moonMan: { name: 'Ay Başlı', rig: RIG_GORTI_HUMAN, pose: humanoid },
  sunMan: { name: 'Güneş Başlı', rig: RIG_GORTI_HUMAN_SUN, pose: humanoid },
  baldMan: { name: 'Sivaslı Amca', rig: RIG_GORTI_HUMAN_BALD, pose: humanoid },
  child: { name: 'Küçük Gorti', rig: RIG_GORTI_CHILD, pose: humanoid },
  youth: { name: 'Genç Gorti', rig: RIG_GORTI_YOUTH, pose: humanoid },
  warrior: { name: 'Savaşçı Gorti', rig: RIG_GORTI_WARRIOR, pose: humanoid },
};

/** Every name a line's `who` can take: the cast and the voices without a body. */
export const SPEAKERS: readonly string[] = [...Object.keys(CAST), ...Object.keys(NAMES)];

/** The balloon name for a line's `who` (a cast or NAMES key); undefined is the narrator. */
export function speakerName(who: string | undefined): string | undefined {
  if (!who) return undefined;
  return CAST[who]?.name ?? (NAMES as Record<string, string>)[who] ?? who;
}
