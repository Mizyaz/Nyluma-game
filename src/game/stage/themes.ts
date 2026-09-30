import { mix } from '../art/palette';
import { themeDef } from '../art/backgrounds';
import { colorsFor } from '../art/terrain';
import type { Rect, RoomDef, SolidDef, ThemeId } from '../data/roomTypes';
import { PLANE as R01_PLANE, STAGE_BOX as R01_BOX } from '../data/rooms/r01Stage';
import type { RoomId } from '../state/types';

// How each room is staged as a paper box: the colours of its paper, how
// deep and tall the box is, whether it gets a back wall of its own, and its
// lights. Chapter I is built after the first painting
// (src/assets/paintings/p1-house-of-the-stranger.jpg): a pink box with pale
// lilac inner walls and a pink rim, cream paper on the floor, and two grey
// stage lamps with peach bulbs at the box's ends shining inward. The other
// rooms take their colours from their own palette (art/backgrounds.ts).

/** Direction toward a light: x right, y up, z toward the viewer. */
export type Dir = readonly [number, number, number];

/** A world x: px, or the box's left/right end (a little inside), or its middle. */
export type XRef = number | 'left' | 'right' | 'mid';
/** A world y (px, down): or the box rim, or the room's main floor. */
export type YRef = number | 'rim' | 'floor';

export interface SpotDef {
  /** The lamp: x, y and depth z (world px). */
  at: readonly [XRef, YRef, number];
  /** Where it shines. */
  to: readonly [XRef, YRef, number];
  color: number;
  intensity: number;
  /** Half-angle of the cone (degrees) and the soft share of its edge (0..1). */
  angle: number;
  penumbra: number;
  /** Size of the soft glow drawn at the bulb (px across; 0 for none). */
  glow: number;
  /** Builds the lamp itself (grey hood, peach bulb); off where the room draws its own lamp. */
  body?: boolean;
}

/** A warm light inside a prop (the hanging lamp's crystal). */
export interface LampDef {
  /** The prop's art key. */
  key: string;
  /** The light's place relative to the prop's origin, world px. */
  at: readonly [number, number];
  color: number;
  intensity: number;
  /** Reach (px). */
  distance: number;
  glow: number;
}

export interface LightRig {
  key: { color: number; intensity: number; dir: Dir };
  fill: { color: number; intensity: number; dir: Dir };
  hemi: { sky: number; ground: number; intensity: number };
  ambient: { color: number; intensity: number };
  /** How dark cast shadows are (0 none … 1 black). */
  shadow: number;
  spots: readonly SpotDef[];
  lamps: readonly LampDef[];
}

export interface BoxTheme {
  /** Outside of the box. */
  box: number;
  /** The rim: top edges of the box walls. */
  rim: number;
  /** Inner walls (the slabs' sides and undersides). */
  inner: number;
  /** Tops of the floors (the paper Gorti walks on). */
  floor: number;
  /** Front faces of the floors. */
  front: number;
  /** The paper's pale core, where the box's front is torn. */
  core: number;
  /** The back wall, when the box has one. */
  back: number;
  /** Behind everything (where no layer covers). */
  sky: number;
  /** Depth of the box behind the actors' plane, and in front of it (px). */
  depth: number;
  frontDepth: number;
  /** Height of the box walls above the main floor (px). */
  wallHeight: number;
  /** Builds an opaque back wall (off where the room paints its own). */
  backWall: boolean;
  /**
   * The painted terrain art stands on the fronts of the box's floors and
   * walls (ledges always keep theirs). Off: clean paper, as in the painting.
   */
  terrainArt: boolean;
  /** Structural slabs take the box's paper colours (else their own style's). */
  paperSlabs: boolean;
  lights: LightRig;
}

const hexNum = (c: string): number => parseInt(c.replace('#', ''), 16);

/** The prototype's balance: a card lit straight on gets about π in all, its own colour. */
const NEUTRAL: LightRig = {
  key: { color: 0xfffaf4, intensity: 2.0, dir: [-0.56, 0.42, 0.72] },
  fill: { color: 0xeef0ff, intensity: 0.7, dir: [0.75, 0.15, 0.64] },
  hemi: { sky: 0xf7f5ff, ground: 0xf2ebe2, intensity: 1.25 },
  ambient: { color: 0xfffaf4, intensity: 0.12 },
  shadow: 0.62,
  spots: [],
  lamps: [],
};

/** A stage lamp of the first painting: a grey hood with a peach bulb, shining inward. */
function lamp(at: SpotDef['at'], to: SpotDef['to'], body = true): SpotDef {
  return { at, to, color: 0xffdcc6, intensity: 0.9, angle: 40, penumbra: 0.9, glow: 110, body };
}

/** The two stage lamps at the box's ends. */
const STAGE_LAMPS: readonly SpotDef[] = [lamp(['left', 'rim', 70], ['mid', 'floor', -60]), lamp(['right', 'rim', 70], ['mid', 'floor', -60])];

/** The hanging lamp of the children's room: a warm crystal that sways. */
const NURSERY_LAMP: LampDef = { key: 'prop.lamp', at: [0, 146], color: 0xffb46b, intensity: 2.2, distance: 620, glow: 170 };

const CHAPTER_I: Omit<BoxTheme, 'sky'> = {
  box: 0xf4d3ec,
  rim: 0xeebbe6,
  inner: 0xeadcf4,
  floor: 0xf6ead0,
  front: 0xf5d9ef,
  core: 0xfff8f0,
  back: 0xf3e2f2,
  depth: 240,
  // A thin front: the painting's box shows little of its front, and the
  // 14th Room's charms hang just before it.
  frontDepth: 48,
  wallHeight: 300,
  // The room paints the box's back wall and its torn paper itself.
  backWall: false,
  terrainArt: false,
  paperSlabs: true,
  lights: {
    ...NEUTRAL,
    // A soft key from the upper left, barely warm, so the painting's
    // pastels stay what they are; the peach lamps warm it from the sides.
    key: { color: 0xfffcf7, intensity: 1.7, dir: [-0.5, 0.46, 0.73] },
    fill: { color: 0xf6f5ff, intensity: 0.6, dir: [0.75, 0.2, 0.62] },
    hemi: { sky: 0xfdfcff, ground: 0xfaf7f1, intensity: 1.45 },
    shadow: 0.58,
    spots: STAGE_LAMPS,
    lamps: [NURSERY_LAMP],
  },
};

const NIGHT: Partial<LightRig> = {
  key: { color: 0xeef0ff, intensity: 1.9, dir: [-0.45, 0.5, 0.74] },
  fill: { color: 0xf3eee6, intensity: 0.7, dir: [0.75, 0.15, 0.64] },
  hemi: { sky: 0xeef2ff, ground: 0xe9efe6, intensity: 1.3 },
};

const DAY: Partial<LightRig> = {
  key: { color: 0xfff6e6, intensity: 2.05, dir: [-0.56, 0.5, 0.66] },
  hemi: { sky: 0xf4f6ff, ground: 0xf2ece0, intensity: 1.25 },
};

const INDOOR: Partial<LightRig> = {
  key: { color: 0xfff3e2, intensity: 1.9, dir: [-0.5, 0.45, 0.74] },
};

const FAMILY: Record<ThemeId, { lights: Partial<LightRig>; backWall: boolean; wallHeight: number }> = {
  nursery: { lights: {}, backWall: false, wallHeight: 300 },
  roots: { lights: {}, backWall: false, wallHeight: 300 },
  chamber: { lights: {}, backWall: false, wallHeight: 300 },
  surface: { lights: NIGHT, backWall: false, wallHeight: 120 },
  hill: { lights: NIGHT, backWall: false, wallHeight: 120 },
  forest: { lights: NIGHT, backWall: false, wallHeight: 120 },
  ride: { lights: DAY, backWall: false, wallHeight: 110 },
  sun: { lights: DAY, backWall: false, wallHeight: 110 },
  clearing: { lights: DAY, backWall: false, wallHeight: 120 },
  dorm: { lights: INDOOR, backWall: true, wallHeight: 96 },
  mech: { lights: INDOOR, backWall: true, wallHeight: 96 },
  office: { lights: INDOOR, backWall: false, wallHeight: 120 },
};

/** What a room changes about its box. */
export interface RoomStage {
  /** Stage lamps where the room draws its own (world px; see SpotDef). */
  spots?: readonly SpotDef[];
  /**
   * The box's front: its top (world y) where the box stands taller than the
   * view, and places its tear keeps open besides the game's own (close-ups,
   * a cutscene's subject), on the actors' plane.
   */
  front?: { top?: number; keepOpen?: readonly Rect[] };
  /**
   * Painted box parts the real box front replaces: in 3D, once the box has
   * its front, the rows of the room's layers on this parallax plane above
   * this world y are left out (the flat game keeps them).
   */
  flatOnly?: { scroll: number; above: number };
}

/**
 * Per-room adjustments. Other chapter I rooms get the stage lamps at the
 * box's two ends.
 */
const ROOMS: Partial<Record<RoomId, RoomStage>> = {
  // The 14th Room draws its stage lamps at the box's ends (props p1.lamp at
  // x 80 and 2120, y 330, standing before its front); the stage adds their
  // light, shining in. Its box front reaches up to the lid, and stays open
  // round the close-up on Gorti waking in his bed (data/rooms/r01Stage.ts).
  r01: {
    spots: [lamp([80, 330, R01_BOX.lampZ + 6], [760, 'floor', -20], false), lamp([2120, 330, R01_BOX.lampZ + 6], [1440, 'floor', -20], false)],
    front: { top: R01_BOX.frontTop, keepOpen: [R01_BOX.closeUp] },
    flatOnly: { scroll: R01_PLANE.wall, above: R01_BOX.lidEdge },
  },
  // Cutscene subjects high in the view: the Moon's faces, the Sun.
  r05: { front: { keepOpen: [{ x: 3500, y: 380, w: 280, h: 280 }] } },
  r08: { front: { keepOpen: [{ x: 480, y: 20, w: 320, h: 320 }] } },
};

/** A room's own staging (empty for most). */
export function roomStage(id: RoomId): RoomStage {
  return ROOMS[id] ?? {};
}

/** Styles that are things in the box (branches, crystals, furniture), not the box itself. */
const THINGS = new Set<SolidDef['style']>(['root', 'crystal', 'wood', 'bed', 'metal']);

/** Does a solid carry the box itself (floors, walls, earth ledges), rather than stand in it? */
export function structural(s: SolidDef): boolean {
  if (s.oneWay || s.latent) return false;
  return s.h > 30 || (s.h >= 24 && !THINGS.has(s.style));
}

/** The room's main floor line: the top most of the floor's width stands on. */
export function mainFloor(room: RoomDef): number {
  const weight = new Map<number, number>();
  for (const s of room.solids) {
    if (s.hidden || s.style === 'none' || !structural(s) || s.y < room.height * 0.3) continue;
    weight.set(s.y, (weight.get(s.y) ?? 0) + s.w);
  }
  let best = room.height - 120;
  let bestW = -1;
  for (const [y, w] of weight) {
    if (w > bestW || (w === bestW && y > best)) {
      best = y;
      bestW = w;
    }
  }
  return best;
}

/** The style most of the main floor is made of. */
function floorStyle(room: RoomDef, floorY: number): SolidDef['style'] {
  const s = room.solids.find((q) => q.y === floorY && structural(q) && q.style !== 'none');
  return s?.style ?? 'soil';
}

/** The box theme of a room. */
export function boxTheme(room: RoomDef): BoxTheme {
  const t = themeDef(room.theme);
  const sky = hexNum(t.sky[1]);
  const own = ROOMS[room.id];
  const withSpots = (th: BoxTheme): BoxTheme => (own?.spots ? { ...th, lights: { ...th.lights, spots: own.spots } } : th);
  if (room.chapter === 1) return withSpots({ ...CHAPTER_I, sky });
  const fam = FAMILY[room.theme];
  const c = colorsFor(floorStyle(room, mainFloor(room)), t.terrain);
  // The box in the room's own paper: its ground's colours, lightened.
  return withSpots({
    box: hexNum(mix(c.base, '#ffffff', 0.18)),
    rim: hexNum(c.top),
    inner: hexNum(mix(c.base, c.top, 0.5)),
    floor: hexNum(mix(c.top, '#ffffff', 0.18)),
    front: hexNum(c.base),
    core: hexNum(mix(c.base, '#fffaf2', 0.72)),
    back: hexNum(mix(c.base, '#ffffff', 0.3)),
    sky,
    depth: 220,
    frontDepth: 110,
    wallHeight: fam.wallHeight,
    backWall: fam.backWall,
    terrainArt: true,
    paperSlabs: false,
    lights: { ...NEUTRAL, ...fam.lights },
  });
}

/** A box's measures in world px, resolved for one room. */
export interface BoxFrame {
  x0: number;
  x1: number;
  /** Main floor line and the rim (top of the walls). */
  floor: number;
  rim: number;
  bottom: number;
  back: number;
  front: number;
}

export function boxFrame(room: RoomDef, theme: BoxTheme, back: number = -theme.depth): BoxFrame {
  const floor = mainFloor(room);
  return { x0: 0, x1: room.width, floor, rim: floor - theme.wallHeight, bottom: room.height + 40, back, front: theme.frontDepth };
}

/** Resolves a lamp's x/y references against the box. */
export function resolveX(x: XRef, f: BoxFrame): number {
  if (x === 'left') return f.x0 + 40;
  if (x === 'right') return f.x1 - 40;
  if (x === 'mid') return (f.x0 + f.x1) / 2;
  return x;
}

export function resolveY(y: YRef, f: BoxFrame): number {
  if (y === 'rim') return f.rim;
  if (y === 'floor') return f.floor;
  return y;
}
