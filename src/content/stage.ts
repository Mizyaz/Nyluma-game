import type { BoxColors, BoxSpec } from '../paper/box';
import type { Framing } from '../paper/lens';
import { DAY, NIGHTMARE, WHIMSICAL, type Mood, type PaperLight } from '../paper/light';
import { CAMERA_ZOOM, DEPTH } from '../engine/constants';
import { themeDef } from '../render/2d/painters/backgrounds';
import { colorsFor } from '../render/2d/painters/terrain';
import { mix } from '../render/2d/palette';
import { P1 } from './art/painting1';
import type { PropDef, RoomDef, SolidDef } from './data/roomTypes';

// How each room stands on the paper stage (src/paper): the box it is built
// in, how the eye looks into it, and where the things without a depth of
// their own stand. Chapter I's box is the first painting's: a pink box with
// pale lilac inner walls, cream paper inside, torn open in front.

export interface RoomStaging {
  box: BoxSpec;
  framing: Framing;
  /** The room's base zoom (wider rooms show more; prints follow it). */
  zoom: number;
  /** Paint the theme's scenery on the back wall. */
  backdrop: boolean;
  /** The room's air and light. */
  mood: Mood;
}

/** The moods by name (`?mood=` picks one for every room, to compare). */
const MOODS: Record<string, Mood> = { whimsical: WHIMSICAL, nightmare: NIGHTMARE, day: DAY };

function moodFor(_room: RoomDef): Mood {
  const forced = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('mood') : null;
  return (forced && MOODS[forced]) || WHIMSICAL;
}

/** The light a prop gives, if it is a light: crystals glow, lamps burn, windows let the night in. */
export function propLight(key: string): Omit<PaperLight, 'x' | 'y' | 'z'> | null {
  // Crystals glow: they light what is near, too low and soft to throw shadows.
  if (key.startsWith('prop.crystaltree')) return { color: 0xc6a8ff, radius: 380, intensity: key.endsWith('bloom') ? 0.95 : 0.7, cast: false };
  if (key.startsWith('prop.crystals.')) {
    const hue = key.slice('prop.crystals.'.length);
    const color = hue === 'teal' ? 0x8ff0dc : hue === 'orange' ? 0xffb27a : 0x9ab8ff;
    return { color, radius: 260, intensity: 0.75, cast: false };
  }
  if (key === 'p1.lamp') return { color: 0xffd59a, radius: 560, intensity: 1, flicker: 0.08 };
  if (key === 'p1.window') return { color: 0xcfdcff, radius: 820, intensity: 0.75 };
  return null;
}

const hexNum = (c: string): number => parseInt(c.replace('#', ''), 16);

const THINGS = new Set<SolidDef['style']>(['root', 'crystal', 'wood', 'bed', 'metal']);

/** Solids that are the room's build (floors, walls) rather than things in it (bridges, ledges). */
export function structural(s: SolidDef): boolean {
  if (s.oneWay || s.latent) return false;
  return s.h > 30 || (s.h >= 24 && !THINGS.has(s.style));
}

/** The room's main floor line (world y): the widest structural top in its lower part. */
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

/** The solids the box's own floor stands for (they are not drawn). */
export function isBoxFloor(s: SolidDef, floor: number): boolean {
  return s.y === floor && structural(s) && !s.hidden;
}

/** Spans of x along the floor line with no floor under them. */
function floorGaps(room: RoomDef, floor: number): [number, number][] {
  const spans = room.solids
    .filter((s) => s.y === floor && structural(s) && s.style !== 'none')
    .map((s) => [s.x, s.x + s.w] as [number, number])
    .sort((a, b) => a[0] - b[0]);
  const gaps: [number, number][] = [];
  let at = 0;
  for (const [a, b] of spans) {
    if (a > at + 4) gaps.push([at, a]);
    at = Math.max(at, b);
  }
  if (at < room.width - 4 && spans.length) gaps.push([at, room.width]);
  return gaps;
}

/**
 * Where a prop stands (z, world px; 0 = the actors' plane, negative =
 * further back): its own depth, else one from the draw band it was given.
 */
export function propZ(p: PropDef): number {
  if (p.z !== undefined) return p.z;
  const d = p.depth ?? DEPTH.props;
  if (d <= DEPTH.backProps) return -140;
  if (d < DEPTH.terrain) return -80;
  if (d < DEPTH.actors) return -36;
  if (d < DEPTH.front) return 0;
  if (d < DEPTH.fg) return 40;
  return 90;
}

const CHAPTER_I: BoxColors = {
  back: hexNum(P1.paper),
  floor: hexNum(P1.paperFloor),
  side: hexNum(mix(P1.paper, P1.wallSide, 0.35)),
  ceiling: hexNum(P1.wallSide),
  edge: hexNum(mix(P1.paper, '#a89d86', 0.18)),
  outer: hexNum(P1.wall),
  lid: hexNum(P1.lid),
  core: 0xfffaf2,
  ink: 0x1d1820,
  outside: hexNum(P1.stone),
  pit: 0x6f6470,
};

/** A box in the colours of the room's own ground. */
function themeColors(room: RoomDef, floor: number): BoxColors {
  const t = themeDef(room.theme);
  const style = room.solids.find((q) => q.y === floor && structural(q) && q.style !== 'none')?.style ?? 'soil';
  const c = colorsFor(style, t.terrain);
  return {
    back: hexNum(mix(c.base, '#ffffff', 0.3)),
    floor: hexNum(mix(c.top, '#ffffff', 0.18)),
    side: hexNum(mix(c.base, c.top, 0.5)),
    ceiling: hexNum(mix(c.base, '#000000', 0.08)),
    edge: hexNum(c.base),
    outer: hexNum(mix(c.base, '#ffffff', 0.18)),
    lid: hexNum(c.top),
    core: hexNum(mix(c.base, '#fffaf2', 0.72)),
    ink: 0x1d1820,
    outside: hexNum(t.sky[1]),
    pit: hexNum(mix(c.base, '#1d1820', 0.55)),
  };
}

const FRAMING: Framing = { span: 480, dist: 900, height: 300, feet: 0.8 };

export function staging(room: RoomDef): RoomStaging {
  const floor = mainFloor(room);
  const chapterI = room.chapter === 1;
  const box: BoxSpec = {
    x0: 0,
    x1: room.width,
    top: Math.min(0, floor - 720),
    floor,
    bottom: floor + 34,
    back: -300,
    front: 170,
    colors: chapterI ? CHAPTER_I : themeColors(room, floor),
    gaps: floorGaps(room, floor),
    tear: { top: 60, bottom: 6, left: 70, right: 70, wander: 22, jag: 7, seed: hash(room.id) },
  };
  return {
    box,
    framing: FRAMING,
    zoom: (room.zoom ?? CAMERA_ZOOM) / CAMERA_ZOOM,
    backdrop: room.id !== 'r01',
    mood: moodFor(room),
  };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) % 1000;
}
