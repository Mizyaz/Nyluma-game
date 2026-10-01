import { describe, expect, it } from 'vitest';
import { ROOMS } from '../../src/content/data/rooms';
import type { RoomDef } from '../../src/content/data/roomTypes';
import { allParts } from '../../src/content/art/manifest';
import { WHALE_SIZES, WHALE_SPECIES, whaleLayout } from '../../src/content/characters/whales';
import { assignSpecies, isWhalePlatform, planWhales } from '../../src/gameplay/whales/whalePlan';

const rooms = Object.values(ROOMS) as RoomDef[];

describe('whale platforms', () => {
  it('puts one whale on every drawn wooden or root jump, its back spanning the platform top', () => {
    let count = 0;
    for (const r of rooms) {
      const plan = planWhales(r);
      const jumps = r.solids.flatMap((s, i) => (isWhalePlatform(s) ? [i] : []));
      expect(plan.map((p) => p.index)).toEqual(jumps);
      for (const p of plan) {
        const s = r.solids[p.index]!;
        expect(s.oneWay && (s.style === 'root' || s.style === 'wood')).toBe(true);
        expect(p.y).toBe(s.y);
        expect(p.x).toBeCloseTo(s.x + s.w / 2, 6);
        expect(p.size * p.scale).toBeCloseTo(s.w, 6);
        // Drawn near its size, so the ink lines keep their width.
        expect(p.scale).toBeGreaterThan(0.75);
        expect(p.scale).toBeLessThan(1.3);
      }
      count += plan.length;
    }
    // Only the set pieces keep their whales (the r02 rising whales, the r03
    // bridge and spiral, the r04 wind whale): scenery now, or a bridge level
    // with the floor (walk.test.ts).
    expect(count).toBeGreaterThanOrEqual(10);
    // Furniture tops (hidden solids) and bed/stone/metal jumps stay as they are.
    expect(planWhales(ROOMS.r01)).toEqual([]);
    expect(planWhales(ROOMS.r11)).toEqual([]);
  });

  it('chooses the species by width unless a set piece chooses its whales', () => {
    expect(assignSpecies([80, 90, 150, 160, 220, 240], 1)).toEqual(['bowhead', 'bowhead', 'sperm', 'sperm', 'blue', 'blue']);
    expect(assignSpecies([160], 1)).toEqual(['sperm']);
    for (const r of rooms) {
      for (const p of planWhales(r)) {
        const f = r.solids[p.index]!.whale;
        if (f?.species) expect(p.species).toBe(f.species);
        if (f?.facing) expect(p.facing).toBe(f.facing);
      }
    }
    // The r02 whales answer in the three voices (three species), all swimming
    // toward the tunnel mouth; every species still swims somewhere.
    const lift = planWhales(ROOMS.r02);
    expect(new Set(lift.map((p) => p.species)).size).toBe(3);
    expect(lift.every((p) => p.facing === 1)).toBe(true);
    expect(new Set(rooms.flatMap((r) => planWhales(r).map((p) => p.species)))).toEqual(new Set(WHALE_SPECIES));
    for (const r of rooms) {
      for (const p of planWhales(r)) {
        const w = r.solids[p.index]!.w;
        if (p.species === 'bowhead') expect(w).toBeLessThanOrEqual(170);
        if (p.species === 'blue') expect(w).toBeGreaterThanOrEqual(130);
      }
    }
  });

  it('draws each back as one straight segment that the outline leaves level', () => {
    const parts = new Map(allParts().map((p) => [p.key, p]));
    for (const sp of WHALE_SPECIES) {
      for (const size of WHALE_SIZES[sp]) {
        const lay = whaleLayout(sp, size);
        for (const key of Object.values(lay.keys)) if (key) expect(parts.has(key), key).toBe(true);
        const h = size / 2;
        const back = new RegExp(`C[-\\d.]+ [-\\d.]+ [-\\d.]+ 0 ${-h} 0L${h} 0C[-\\d.]+ 0 `);
        expect(parts.get(lay.keys.body)!.body, `${sp} ${size}`).toMatch(back);
      }
    }
  });
});
