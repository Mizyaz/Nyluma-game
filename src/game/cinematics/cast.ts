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

/**
 * Close-up framing of each body's head: the scale, and where the middle of
 * the head is seen from the eye (logical px, the head facing right), so
 * that every head fills the portrait window alike.
 */
const CLOSE_UP: Record<string, { scale: number; dx: number; dy: number }> = {
  'gorti.root.child': { scale: 3.3, dx: 5, dy: 1 },
  'gorti.root.youth': { scale: 3.4, dx: 1.5, dy: -1 },
  'gorti.root.warrior': { scale: 4.3, dx: 2, dy: 5 },
  'gorti.human': { scale: 3.6, dx: 1, dy: 2 },
  'gorti.human.sun': { scale: 4, dx: 3, dy: 0 },
  'gorti.suit': { scale: 3.6, dx: 1, dy: 2 },
  coward: { scale: 3.5, dx: 5, dy: 1 },
  mech: { scale: 4.2, dx: 5, dy: -1 },
};

function closeUp(s: Parameters<PortraitFactory>[0], rig: ReturnType<typeof rigFor>, w: Parameters<PortraitFactory>[1]): RigPortrait {
  const k = CLOSE_UP[rig.id] ?? { scale: 3.4, dx: 3, dy: 3 };
  return new RigPortrait(s, rig, w, { scale: k.scale, focus: 'eye', dx: k.dx * k.scale, dy: k.dy * k.scale });
}

/** How to draw each cast member up close. */
export const CAST: Record<CastId, PortraitFactory> = {
  gorti: (s, w) => closeUp(s, gortiRig(), w),
  coward: (s, w) => closeUp(s, RIG_COWARD, w),
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
