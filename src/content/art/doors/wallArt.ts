import type { Sfx } from '../../../engine/systems/AudioSystem';
import type { Hole, LeafKind } from '../../../paper/opening';
import { holeTop } from '../../../paper/opening';
import type { Pt } from '../../../render/2d/svg';

// What a doorway in a wall is made of (src/paper/walls.ts draws it): the
// opening cut through the wall, the art on the wall's face round it, the
// leaf that shuts it, the passage behind it, and how it lights up and
// moves. Every piece of art is an elevation: drawn flat, as the surface it
// lies on would look seen square on, in world px, and the lens lays it on
// the wall in perspective.
//
// An elevation's own coordinates: x across (for a wall, its depth z from
// `u0`, the far end on the left as the room sees its right wall; for the
// passage's far wall, x from the wall), y down from the top (`h` over the
// floor), so a point of the surface at (u, v) is drawn at (u − u0, h − v).

export interface FaceArt {
  /** The span it covers: u from u0 to u1, v from the floor (0) up to h. */
  u0: number;
  u1: number;
  h: number;
  /** SVG over that span (x = u − u0, y = h − v). */
  body: string;
}

export interface WallDoorArt {
  /** The wall: its paper (default the box's own side wall), the core where it is cut; a cross wall's half thickness and the depth its near end reaches. */
  wall: { color?: string; edge: string; half?: number; end?: number };
  hole: Hole;
  /** The wall's face round the opening (outdoors, the whole wall: a hillside, a hedge, a row of trunks). */
  face: FaceArt;
  /** The leaf: how it opens, its paper and back, its face; where it is shut, at rest open, and with Gorti near (degrees for a hinge, 0..1 otherwise). */
  leaf: { kind: LeafKind; hinge?: 'far' | 'near'; color: string; back: string; art?: FaceArt; shut: number; open: number; wide?: number } | null;
  /** Beyond a side wall: the passage (see WallSpec.passage), its far wall's art, frames standing in it parallel to the wall. */
  passage?: { length: number; reveal: number; floor: string; wall: string; end: string; art?: FaceArt; frames?: { x: number; art: FaceArt }[] };
  /** A paper figure that peeks out of the passage: its art (u: x from its own place), its depth, its x from the wall hidden and shown. */
  peek?: { art: FaceArt; z: number; hidden: number; shown: number };
  /** The lamp in the opening: colour, reach, strength, height over the floor. */
  light: { color: string; radius: number; intensity: number; y: number };
  /** The light's haze in the opening. */
  glow: string;
  sounds?: { wake?: [Sfx, number, number]; peek?: [Sfx, number, number]; open?: [Sfx, number, number][]; shut?: [Sfx, number, number] };
  /** How long it takes to open (ms). */
  openMs?: number;
  /** Small paper life about the doorway once it is open and awake. */
  life?: { kind: 'fireflies' | 'petals' | 'stars' | 'confetti' | 'leaves'; colors: string[]; rate: number };
  /** Flat colours for the Canvas renderer. */
  flat?: { wall?: string; hole?: string; frame?: string };
}

/** The opening's outline in a face's coordinates (from the foot of the far jamb over the top to the near one). */
export function holeOutline(h: Hole, f: Pick<FaceArt, 'u0' | 'h'>, n = 36): Pt[] {
  const pts: Pt[] = [[h.z0 - f.u0, f.h]];
  for (let i = 0; i <= n; i++) {
    const z = h.z0 + 0.002 + ((h.z1 - h.z0 - 0.004) * i) / n;
    pts.push([z - f.u0, f.h - holeTop(h, z)]);
  }
  pts.push([h.z1 - f.u0, f.h]);
  return pts;
}

/**
 * The opening's outline grown by `by` px all round (for frames, bands and
 * linings); at the far jamb only by `by · far` (a doorway near the back
 * corner has little wall beside its far jamb, so what rings it narrows
 * there).
 */
export function holeRing(h: Hole, f: Pick<FaceArt, 'u0' | 'h'>, by: number, n = 36, far = 1): Pt[] {
  const g: Hole = { z0: h.z0 - by * far, z1: h.z1 + by, spring: h.spring + by * 0.6, rise: h.rise + by * 0.4, peak: h.peak };
  return holeOutline(g, f, n);
}
