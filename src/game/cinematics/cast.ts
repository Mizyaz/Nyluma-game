import { RIG_COWARD } from '../art/characters/forms';
import { RIG_HORSE } from '../art/characters/horse';
import { rigFor } from '../entities/Player';
import { app } from '../App';
import type { WorldScene } from '../scenes/WorldScene';
import type { CastId } from './castNames';
import { ArtPortrait, FacePortrait, RigPortrait, type PortraitFactory } from './portraits';

/** Gorti in whatever body he has right now. */
function gortiRig(): ReturnType<typeof rigFor> {
  const world = app.game.scene.getScene('world') as WorldScene | null;
  const p = world?.player;
  return p ? rigFor(p.kind, p.form) : rigFor('gorti', 'root');
}

/** How to draw each cast member up close. */
export const CAST: Record<CastId, PortraitFactory> = {
  gorti: (s, w) => {
    const rig = gortiRig();
    // Close-ups of equal size whatever the body: the root head is the largest.
    const scale = rig.id.startsWith('gorti.root') ? 3.2 : rig.id === 'mech' ? 3.6 : rig.id === 'coward' ? 3.0 : 4.2;
    return new RigPortrait(s, rig, w, { scale, focus: 'eye', dx: 10 * scale, dy: 3 * scale });
  },
  coward: (s, w) => new RigPortrait(s, RIG_COWARD, w, { scale: 3.0, focus: 'eye', dx: 30, dy: 9 }),
  horse: (s, w) => new RigPortrait(s, RIG_HORSE, w, { scale: 1.5, focus: 'muzzle', dx: -70, dy: -10, horse: true }),
  babyMoon: (s, w) => new FacePortrait(s, 'baby', w),
  oldMoon: (s, w) => new FacePortrait(s, 'old', w),
  sun: (s, w) => new FacePortrait(s, 'sun', w),
  forms: (s, w) => new ArtPortrait(s, 'form.shadow', w, { fill: 1.5, focusY: 0.26 }),
  voice: (s, w) => new ArtPortrait(s, 'prop.clock', w, { fill: 0.78 }),
  one: (s, w) => new ArtPortrait(s, 'attendee.sit', w, { fill: 1.6, focusY: 0.28 }),
  two: (s, w) => new ArtPortrait(s, 'attendee.sit', w, { fill: 1.6, focusY: 0.28 }),
  three: (s, w) => new ArtPortrait(s, 'attendee.sit', w, { fill: 1.6, focusY: 0.28 }),
};
