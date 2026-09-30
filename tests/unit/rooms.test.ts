import { describe, expect, it } from 'vitest';
import { NEXT_ROOM, ROOMS } from '../../src/content/data/rooms';
import { MEMORIES } from '../../src/content/data/memories';
import { allParts } from '../../src/content/art/manifest';
import { HULL_H, HULL_W, REACH_RANGE } from '../../src/engine/constants';
import type { RoomDef, SolidDef } from '../../src/content/data/roomTypes';
import { ROOM_IDS } from '../../src/engine/state/types';

const rooms = Object.values(ROOMS) as RoomDef[];

function standsOn(solids: SolidDef[], x: number, y: number): boolean {
  return solids.some((s) => Math.abs(s.y - y) <= 2 && x >= s.x - 2 && x <= s.x + s.w + 2);
}

function hullClear(solids: SolidDef[], x: number, y: number): boolean {
  const hx = x - HULL_W / 2;
  const hy = y - HULL_H;
  return !solids.some((s) => !s.oneWay && !s.latent && s.style !== 'none' && hx < s.x + s.w && hx + HULL_W > s.x && hy < s.y && hy + HULL_H > s.y + 1 && s.y < y - 1);
}

describe('room data', () => {
  it('declares all twelve rooms in five chapters', () => {
    expect(rooms.map((r) => r.id)).toEqual([...ROOM_IDS]);
    expect(new Set(rooms.map((r) => r.chapter))).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  it('has unique, prefixed checkpoints that stand on ground with clearance', () => {
    const seen = new Set<string>();
    for (const r of rooms) {
      expect(r.checkpoints.length).toBeGreaterThan(0);
      for (const c of r.checkpoints) {
        expect(c.id.startsWith(r.id + '_')).toBe(true);
        expect(seen.has(c.id)).toBe(false);
        seen.add(c.id);
        expect(standsOn(r.solids, c.x, c.y), `${c.id} not on ground`).toBe(true);
        expect(hullClear(r.solids, c.x, c.y), `${c.id} inside geometry`).toBe(true);
      }
    }
  });

  it('links every room forward, by exit or scripted transition', () => {
    for (let i = 0; i < ROOM_IDS.length - 1; i++) expect(NEXT_ROOM[ROOM_IDS[i]!]).toBe(ROOM_IDS[i + 1]);
    for (const r of rooms) {
      for (const e of r.exits) {
        expect(ROOM_IDS).toContain(e.to);
        expect(e.to).toBe(NEXT_ROOM[r.id]);
        expect(e.x + e.w).toBeLessThanOrEqual(r.width);
      }
    }
    const scripted = ['r06', 'r07', 'r09', 'r10', 'r11', 'r12'];
    for (const r of rooms) if (!r.exits.length) expect(scripted).toContain(r.id);
  });

  it('places the eight optional memories across chapters I–IV exactly once', () => {
    const placed = rooms.flatMap((r) => (r.memories ?? []).map((m) => ({ ...m, room: r.id, chapter: r.chapter })));
    expect(placed.map((p) => p.id).sort()).toEqual(MEMORIES.map((m) => m.id).sort());
    for (const p of placed) {
      expect(p.chapter).toBeLessThanOrEqual(4);
      expect(MEMORIES.find((m) => m.id === p.id)?.room).toBe(p.room);
    }
    for (const m of MEMORIES) expect(m.text.split(/\s+/).length).toBeLessThanOrEqual(60);
  });

  it('lands every root reach on walkable ground within reach range', () => {
    for (const r of rooms) {
      for (const a of r.anchors ?? []) {
        expect(standsOn(r.solids, a.land.x, a.land.y), `${r.id}/${a.id} landing`).toBe(true);
        expect(hullClear(r.solids, a.land.x, a.land.y), `${r.id}/${a.id} landing clearance`).toBe(true);
        // Some standing spot on ground within range of the anchor must exist.
        const reachable = r.solids.some((s) => {
          for (let x = s.x + 10; x <= s.x + s.w - 10; x += 10) {
            const chestY = s.y - 54;
            if (Math.hypot(a.x - x, a.y - chestY) <= REACH_RANGE - 8 && !(Math.abs(a.land.x - x) < 5 && Math.abs(a.land.y - s.y) < 5)) return true;
          }
          return false;
        });
        expect(reachable, `${r.id}/${a.id} unreachable`).toBe(true);
      }
    }
  });

  it('sets no tasks: no song nodes, anchors, form sites or hidden surfaces', () => {
    for (const r of rooms) {
      expect(r.songNodes ?? [], r.id).toEqual([]);
      expect(r.anchors ?? [], r.id).toEqual([]);
      expect(r.sites ?? [], r.id).toEqual([]);
      expect(r.solids.filter((s) => s.latent).map((s) => s.id ?? `${s.x},${s.y}`), r.id).toEqual([]);
    }
  });

  it('references only existing artwork', () => {
    const keys = new Set(allParts().map((p) => p.key));
    const missing: string[] = [];
    for (const r of rooms) for (const p of r.props ?? []) if (!keys.has(p.key)) missing.push(`${r.id}:${p.key}`);
    for (const k of ['prop.anchor', 'prop.node', 'prop.node.lit', 'prop.site', 'prop.memory', 'prop.lantern', 'prop.lantern.lit']) if (!keys.has(k)) missing.push(k);
    expect(missing).toEqual([]);
  });

  it('keeps interaction ids unique per room and latent surfaces crystalline', () => {
    for (const r of rooms) {
      const ids = (r.interacts ?? []).map((i) => i.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const s of r.solids) if (s.latent) expect(s.style).toBe('crystal');
      for (const s of r.solids) {
        expect(s.w).toBeGreaterThan(0);
        expect(s.h).toBeGreaterThan(0);
      }
    }
  });
});
