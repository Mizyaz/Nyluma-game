import { describe, expect, it } from 'vitest';
import { DOORS } from '../../src/content/doorSpecs';
import { ROOMS } from '../../src/content/data/rooms';
import { parseCond } from '../../src/engine/content/cond';

// The doorways only dress the rooms' ways on: each stands at the exit or the
// gate it opens with, reads that exit's or gate's own condition, and draws
// every part it shows.

describe('doorways', () => {
  it('stand at real exits and gates of their rooms and open with them', () => {
    for (const [roomId, specs] of Object.entries(DOORS)) {
      const room = ROOMS[roomId];
      expect(room, `doors for unknown room ${roomId}`).toBeDefined();
      if (!room) continue;
      const ids = new Set<string>();
      for (const d of specs) {
        expect(d.id.startsWith(`${roomId}.`), d.id).toBe(true);
        expect(ids.has(d.id), `${d.id} twice`).toBe(false);
        ids.add(d.id);
        expect(d.x > 0 && d.x < room.width, `${d.id} inside the room`).toBe(true);
        const o = d.open;
        if (o === 'always') continue;
        if ('exit' in o) {
          const exit = room.exits.find((e) => e.id === o.exit);
          expect(exit, `${d.id}: no exit ${o.exit}`).toBeDefined();
          // The door frames the way out: its opening ends at the exit's box.
          if (exit) expect(Math.abs(d.x - (exit.x + exit.w / 2)), `${d.id} far from its exit`).toBeLessThan(150);
        } else if ('solid' in o) {
          const solid = room.solids.find((s) => s.id === o.solid);
          expect(solid, `${d.id}: no solid ${o.solid}`).toBeDefined();
          if (solid) expect(Math.abs(d.x - (solid.x + solid.w / 2)), `${d.id} far from its gate`).toBeLessThan(40);
        } else {
          expect(() => parseCond(o.when), d.id).not.toThrow();
        }
        if (d.hides !== undefined) {
          expect(room.solids.some((s) => s.id === d.hides), `${d.id}: hides no solid ${d.hides}`).toBe(true);
          expect('solid' in o && o.solid === d.hides, `${d.id} hides the gate it opens with`).toBe(true);
        }
      }
    }
  });

  it('draw every part they show, one drawing per key in a room', () => {
    for (const [roomId, specs] of Object.entries(DOORS)) {
      const bodies = new Map<string, string>();
      for (const d of specs) {
        const art = d.art();
        const keys = new Set(art.parts.map((p) => p.key));
        expect(keys.size, `${d.id} has parts with one key`).toBe(art.parts.length);
        for (const p of art.parts) {
          const seen = bodies.get(p.key);
          expect(seen === undefined || seen === p.body, `${roomId}: two drawings for ${p.key}`).toBe(true);
          bodies.set(p.key, p.body);
          expect(p.w > 0 && p.h > 0, `${p.key} has a size`).toBe(true);
        }
        for (const c of [...art.frame, ...art.inside, ...art.front, ...art.pieces]) expect(keys.has(c.key), `${d.id} shows ${c.key}`).toBe(true);
        for (const l of art.leaves) {
          expect(keys.has(l.front), `${d.id} leaf ${l.front}`).toBe(true);
          expect(keys.has(l.back), `${d.id} leaf ${l.back}`).toBe(true);
        }
        // An opening is a closed outline (or none, for a door Gorti walks through).
        expect(art.opening.length === 0 || art.opening.length >= 3, `${d.id} opening`).toBe(true);
        if (art.opening.length === 0) expect(art.inside, `${d.id}: nothing to show inside without an opening`).toEqual([]);
      }
    }
  });
});
