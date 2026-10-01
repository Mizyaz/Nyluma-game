import { describe, expect, it } from 'vitest';
import { ROOMS } from '../../src/content/data/rooms';
import type { RoomDef, SolidDef } from '../../src/content/data/roomTypes';
import { RIDE_CHASMS } from '../../src/content/rooms/r07';
import { HULL_H, HULL_W, JUMPING } from '../../src/engine/constants';
import { isWhalePlatform } from '../../src/gameplay/whales/whalePlan';

// The story rooms are walked, never jumped: each has one floor line, and
// from where Gorti comes in he reaches every checkpoint, memory, thing to
// look at, story trigger and exit by walking along it. Checked with every
// gate the story opens open (`unless` solids gone, `when` solids there);
// the story opens them by itself as he walks (the campaign run plays that).

const STORY_ROOMS = ['r01', 'r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08', 'r09', 'r10', 'r11', 'r12'];

/** Solids that bear weight or block once the story has opened its gates. */
function opened(r: RoomDef): SolidDef[] {
  return r.solids.filter((s) => !s.unless && !s.whale?.scenery);
}

/** The floor line and the stretch of it Gorti walks from his entry point. */
function walk(r: RoomDef): { y: number; lo: number; hi: number } {
  const solids = opened(r);
  const y = r.checkpoints[0]!.y;
  // Standing anywhere some of his hull rests on the floor line (a gap
  // narrower than the hull, e.g. between stepping stones, is walked over).
  const floorAt = (x: number): boolean =>
    solids.some((s) => s.y === y && s.x < x + HULL_W / 2 && s.x + s.w > x - HULL_W / 2) ||
    // The ride's chasms fill with flower bridges as the horse comes near.
    (r.id === 'r07' && RIDE_CHASMS.some(([a, b]) => x >= a && x <= b));
  const blocked = (x: number): boolean => solids.some((s) => !s.oneWay && s.x < x + HULL_W / 2 && s.x + s.w > x - HULL_W / 2 && s.y < y - 1 && s.y + s.h > y - HULL_H);
  const ok = (x: number): boolean => x >= HULL_W / 2 && x <= r.width - HULL_W / 2 && floorAt(x) && !blocked(x);
  const x0 = r.checkpoints[0]!.x;
  expect(ok(x0), `${r.id}: entry point`).toBe(true);
  let lo = x0;
  let hi = x0;
  while (ok(lo - 2)) lo -= 2;
  while (ok(hi + 2)) hi += 2;
  return { y, lo, hi };
}

describe('story rooms without jumping', () => {
  it('has jumping switched off', () => {
    expect(JUMPING).toBe(false);
  });

  it('reaches every checkpoint, memory, inspectable thing, trigger and exit along one floor', () => {
    for (const id of STORY_ROOMS) {
      const r = ROOMS[id]!;
      const { y, lo, hi } = walk(r);
      const along = (x: number): boolean => x >= lo && x <= hi;
      /** A rectangle the walking hull passes through. */
      const passes = (t: { x: number; y: number; w: number; h: number }): boolean => t.y < y && t.y + t.h > y - HULL_H && t.x < hi + HULL_W / 2 && t.x + t.w > lo - HULL_W / 2;
      for (const c of r.checkpoints) {
        expect(c.y, `${c.id} off the floor`).toBe(y);
        expect(along(c.x), `${c.id} out of walking reach`).toBe(true);
      }
      for (const m of r.memories ?? []) {
        expect(along(m.x), `${id}/${m.id} out of walking reach`).toBe(true);
        // Picked up at the feet; on the ride, at the rider's height.
        if (id === 'r07') expect(Math.abs(y - 150 - (m.y - 34)), `${id}/${m.id} height`).toBeLessThan(70);
        else expect(y > m.y - 90 && y < m.y + 20, `${id}/${m.id} height`).toBe(true);
      }
      for (const it of r.interacts ?? []) {
        expect(along(it.x), `${id}/${it.id} out of walking reach`).toBe(true);
        expect(Math.abs(y - it.y), `${id}/${it.id} height`).toBeLessThan(it.r ?? 70);
      }
      for (const t of r.triggers ?? []) expect(passes(t), `${id}/${t.id} not on the way`).toBe(true);
      for (const e of r.exits) expect(passes(e), `${id}/${e.id} not on the way`).toBe(true);
    }
  });

  it('leaves nothing to climb: no ledges, blocks or platforms over the floor', () => {
    for (const id of STORY_ROOMS) {
      const r = ROOMS[id]!;
      const { y, lo, hi } = walk(r);
      for (const s of r.solids) {
        if (s.whale?.scenery || s.y >= y || s.x > hi + HULL_W / 2 || s.x + s.w < lo - HULL_W / 2) continue;
        // Over the way only walls and ceilings hanging from high up, and
        // gates standing on the floor (a door, a wall the story opens).
        const gate = !!s.unless && s.y + s.h === y;
        expect(gate || s.y <= y - 250, `${id}: a surface at ${s.x},${s.y} over the floor (${y})`).toBe(true);
      }
    }
  });

  it('lets no whale serve as a step: the ones up in the air are scenery, a bridge lies level with the floor', () => {
    for (const id of STORY_ROOMS) {
      const r = ROOMS[id]!;
      const { y } = walk(r);
      for (const s of r.solids) {
        if (!isWhalePlatform(s) || s.whale?.scenery) continue;
        expect(s.y, `${id}/${s.id ?? s.x} bears weight off the floor`).toBe(y);
      }
    }
  });
});
