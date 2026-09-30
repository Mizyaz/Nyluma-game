import { DEPTH } from '../constants';
import { hashSeed } from '../art/svg';
import { whaleLayout, whaleSizeFor, type WhaleSpecies } from '../art/characters/whales';
import type { RoomDef, SolidDef } from '../data/roomTypes';

// Where the whales go: every drawn wooden or root jump-through platform
// becomes a whale whose flat back is the platform's top. Pure data (no
// Phaser) so it can be checked in unit tests. A room's set pieces (a lift, a
// spiral, a bridge) may pick a whale's species and facing themselves
// (SolidDef.whale); everything else follows the platform's width and room.

/** The "wooden jumps": drawn root/wood one-way platforms (furniture tops stay furniture). */
export function isWhalePlatform(s: SolidDef): boolean {
  return !!s.oneWay && !s.hidden && (s.style === 'root' || s.style === 'wood');
}

const BY_RANK: readonly WhaleSpecies[] = ['bowhead', 'sperm', 'blue'];

/**
 * Species by width, varied within a room: a room's whale platforms are
 * ranked by width (equal widths in an order hashed from the room, so they
 * mix) and split in thirds: short ones bowheads, middling ones sperm whales,
 * long ones blue whales. A wide platform never gets the rotund bowhead (it
 * would hang too deep) nor a short one the slender blue whale. With one or
 * two platforms the width alone decides.
 */
export function assignSpecies(widths: readonly number[], seed: number): WhaleSpecies[] {
  const n = widths.length;
  const alone = (w: number): WhaleSpecies => (w < 120 ? 'bowhead' : w < 190 ? 'sperm' : 'blue');
  if (n <= 2) return widths.map(alone);
  const order = widths.map((w, i) => ({ w, i, h: hashSeed(`${seed}:${i}`) })).sort((a, b) => a.w - b.w || a.h - b.h);
  const out: WhaleSpecies[] = new Array<WhaleSpecies>(n);
  order.forEach((o, rank) => {
    let sp = BY_RANK[Math.min(2, Math.floor((3 * rank) / n))]!;
    if (sp === 'bowhead' && o.w > 170) sp = 'sperm';
    if (sp === 'blue' && o.w < 130) sp = 'sperm';
    out[o.i] = sp;
  });
  return out;
}

export interface WhalePlace {
  /** Index of the platform in the room's solids. */
  index: number;
  species: WhaleSpecies;
  /** Drawn size used (back length of the art). */
  size: number;
  /** Platform width / drawn size. */
  scale: number;
  /** +1: head to the right. */
  facing: 1 | -1;
  /** Middle of the back = middle of the platform's top. */
  x: number;
  y: number;
  depth: number;
  seed: number;
}

/** Open room beside a platform, at the height of the whale's body. */
function freeSide(room: RoomDef, p: SolidDef, dir: -1 | 1, top: number, bottom: number): number {
  let free = dir < 0 ? p.x : room.width - (p.x + p.w);
  for (const s of room.solids) {
    if (s === p || s.oneWay || s.hidden || s.style === 'none') continue;
    if (s.y >= bottom || s.y + s.h <= top) continue;
    if (dir < 0 && s.x + s.w <= p.x + 1) free = Math.min(free, p.x - (s.x + s.w));
    if (dir > 0 && s.x >= p.x + p.w - 1) free = Math.min(free, s.x - (p.x + p.w));
  }
  return free;
}

/** Open room below a platform's top, over a horizontal span (to the terrain beneath). */
function freeBelow(room: RoomDef, p: SolidDef, x0: number, x1: number): number {
  let free = room.height - p.y;
  for (const s of room.solids) {
    if (s === p || s.oneWay || s.hidden || s.style === 'none') continue;
    // Floors and ledges under it; walls beside it are the side's business.
    if (s.x >= x1 || s.x + s.w <= x0 || s.y < p.y) continue;
    free = Math.min(free, Math.max(0, s.y - p.y));
  }
  return free;
}

const SHALLOW_FIRST: readonly WhaleSpecies[] = ['blue', 'sperm', 'bowhead'];
const allowed = (sp: WhaleSpecies, w: number): boolean => !(sp === 'bowhead' && w > 170) && !(sp === 'blue' && w < 130);

interface Candidate extends WhalePlace {
  /** Hangs clear of the terrain below. */
  clear: boolean;
  /** Room on both sides: the facing is free to follow a neighbour. */
  free: boolean;
}

/** One whale of a species on a platform: size, scale, facing, and how it fits. */
function placeOn(room: RoomDef, s: SolidDef, index: number, sp: WhaleSpecies): Candidate {
  const size = whaleSizeFor(sp, s.w);
  const scale = s.w / size;
  const lay = whaleLayout(sp, size);
  const seed = hashSeed(`${room.id}:whale:${index}`);
  // The tail reaches furthest past the platform: it goes to the roomier
  // side (into a wall only when there is no other way, where the wall hides
  // it and the whale seems to swim out of the earth).
  const tail = (-lay.bounds.x0 - size / 2) * scale;
  const top = s.y + 4;
  const hang = lay.depth * scale;
  const left = freeSide(room, s, -1, top, s.y + hang * 0.7);
  const right = freeSide(room, s, 1, top, s.y + hang * 0.7);
  const free = left >= tail && right >= tail;
  let facing: 1 | -1;
  if (s.whale?.facing) facing = s.whale.facing;
  else if (free) facing = seed & 1 ? 1 : -1;
  else facing = left >= right ? 1 : -1;
  const cx = s.x + s.w / 2;
  const x0 = cx + (facing > 0 ? lay.bounds.x0 : -lay.bounds.x1) * scale;
  const x1 = cx + (facing > 0 ? lay.bounds.x1 : -lay.bounds.x0) * scale;
  return {
    index,
    species: sp,
    size,
    scale,
    facing,
    x: cx,
    y: s.y,
    // Behind the terrain; a lower whale in front of a higher one, so every
    // back reads over the belly hanging above it. A whale on the far side of
    // something it circles (a tree trunk) goes behind the room's props too.
    depth: (s.whale?.behind ? DEPTH.terrain - 40 : DEPTH.terrain - 4) + s.y / Math.max(1, room.height),
    seed,
    // The whole whale hangs clear of the ground (fins included).
    clear: hang <= freeBelow(room, s, x0, x1),
    // A formation's facing is set by its path: it leads, never follows.
    free: free && !s.whale?.facing,
  };
}

export function planWhales(room: RoomDef): WhalePlace[] {
  const idx: number[] = [];
  room.solids.forEach((s, i) => {
    if (isWhalePlatform(s)) idx.push(i);
  });
  // Species by width for the whales whose room does not choose one.
  const open = idx.filter((i) => !room.solids[i]!.whale?.species);
  const species = assignSpecies(
    open.map((i) => room.solids[i]!.w),
    hashSeed(room.id),
  );
  const wanted = new Map(open.map((i, k) => [i, species[k]!]));
  const cands = idx.map((i): Candidate => {
    const s = room.solids[i]!;
    const chosen = s.whale?.species;
    if (chosen) return placeOn(room, s, i, chosen);
    // The species its width asks for, unless it would hang into the terrain
    // below: then the next shallower one that fits (blue whales hang least).
    const want = wanted.get(i)!;
    const order = [want, ...SHALLOW_FIRST.filter((sp) => sp !== want)].filter((sp) => allowed(sp, s.w));
    let best: Candidate | null = null;
    for (const sp of order) {
      const c = placeOn(room, s, i, sp);
      if (c.clear) {
        best = c;
        break;
      }
      if (!best || whaleLayout(sp, c.size).depth * c.scale < whaleLayout(best.species, best.size).depth * best.scale) best = c;
    }
    return best!;
  });
  // Close neighbours at about the same height swim the same way (nose to
  // tail, not tails crossed): a whale free to face either way follows the
  // nearest one, whales held by walls first.
  const near = (a: Candidate, b: Candidate): number => {
    const sa = room.solids[a.index]!;
    const sb = room.solids[b.index]!;
    const gap = Math.max(sb.x - (sa.x + sa.w), sa.x - (sb.x + sb.w));
    return Math.abs(sa.y - sb.y) <= 90 && gap <= 260 ? gap : Infinity;
  };
  for (const c of [...cands.filter((c) => !c.free), ...cands.filter((c) => c.free)]) {
    if (!c.free) continue;
    let lead: Candidate | null = null;
    let d = Infinity;
    for (const o of cands) {
      if (o === c) continue;
      const g = near(c, o);
      if (g < d && (!o.free || o.index < c.index)) {
        d = g;
        lead = o;
      }
    }
    if (lead) c.facing = lead.facing;
  }
  return cands.map(({ clear: _c, free: _f, ...place }) => place);
}
