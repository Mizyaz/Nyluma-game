import { describe, expect, it } from 'vitest';
import { MOVE_TIERS, tierOf } from '../../src/gameplay/moves/tiers';
import type { MoveFamily } from '../../src/gameplay/moves/types';
import { ROOM_IDS } from '../../src/engine/state/types';

const FAMILIES = Object.keys(MOVE_TIERS) as MoveFamily[];

describe('Rezonans move tiers', () => {
  it('only names real rooms and tiers from 1 to 3', () => {
    for (const f of FAMILIES) {
      for (const [room, tier] of Object.entries(MOVE_TIERS[f])) {
        expect(ROOM_IDS as readonly string[]).toContain(room);
        expect(tier).toBeGreaterThanOrEqual(1);
        expect(tier).toBeLessThanOrEqual(3);
      }
    }
  });

  it('never loses a tier as the story goes on', () => {
    for (const f of FAMILIES) {
      let prev = 0;
      for (const r of ROOM_IDS) {
        const t = tierOf(f, r);
        expect(t, `${f} in ${r}`).toBeGreaterThanOrEqual(prev);
        prev = t;
      }
    }
  });

  it('grows the flower move from one flower to a flock by chapter II', () => {
    expect(ROOM_IDS.map((r) => tierOf('bloom', r))).toEqual([1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3]);
  });

  it('opens the stomp with the human body and adds the horse once it is born', () => {
    expect(tierOf('earth', 'r03')).toBe(0);
    expect(tierOf('earth', 'r04')).toBe(1);
    expect(tierOf('earth', 'r05')).toBe(2);
    expect(tierOf('earth', 'r06')).toBe(3);
    expect(tierOf('earth', 'r12')).toBe(3);
  });

  it('keeps the crystal spark for every other form everywhere', () => {
    for (const r of ROOM_IDS) expect(tierOf('spark', r)).toBe(1);
  });
});
