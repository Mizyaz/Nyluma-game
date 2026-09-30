import { describe, expect, it } from 'vitest';
import { PAINTING_LINE, PAINTING_ORDER, PAINTING_PLACEMENTS, PAINTINGS, paintingsIn } from '../../src/content/data/paintings';
import { ROOMS } from '../../src/content/data/rooms';
import type { RoomDef } from '../../src/content/data/roomTypes';
import { ROOM_IDS, type RoomId } from '../../src/engine/state/types';
import { floorBelow } from '../../src/engine/world/geometry';

const rooms = ROOM_IDS.map((id) => ROOMS[id] as RoomDef);
/** Frame and wire around the canvas, world px (generous). */
const FRAME = 24;

describe('paintings', () => {
  it('shows what Gorti sees in front of every painting', () => {
    expect(PAINTING_LINE).toBe('Gorti geleceğine ve geçmişine bakış attı.');
  });

  it('has the four artworks in the order of his life, each titled and captioned', () => {
    expect(PAINTING_ORDER).toEqual(['stranger', 'moon', 'youth', 'warrior']);
    for (const id of PAINTING_ORDER) {
      const a = PAINTINGS[id];
      expect(a.id).toBe(id);
      expect(a.key).toBe(`painting.${id}`);
      expect(a.url).toMatch(/\.jpg$/);
      expect(a.title.length).toBeGreaterThan(0);
      expect(a.caption.length).toBeGreaterThan(0);
    }
  });

  it('hangs one painting in each of the first four chapters, in order, and all four in the last', () => {
    const chapters = [...new Set(rooms.map((r) => r.chapter))].sort((a, b) => a - b);
    const last = chapters[chapters.length - 1]!;
    for (const ch of chapters) {
      const shown = rooms.filter((r) => r.chapter === ch).flatMap((r) => paintingsIn(r.id).map((p) => p.art));
      if (ch === last) expect(shown).toEqual(PAINTING_ORDER);
      else expect(shown).toEqual([PAINTING_ORDER[ch - 1]]);
    }
  });

  it('places every painting inside its room, walls clear of the floor, easels on the ground', () => {
    for (const [id, list] of Object.entries(PAINTING_PLACEMENTS) as [RoomId, NonNullable<(typeof PAINTING_PLACEMENTS)[RoomId]>][]) {
      const def = ROOMS[id] as RoomDef;
      for (const p of list) {
        const where = `${p.art} in ${id}`;
        expect(p.x - p.width / 2 - FRAME, where).toBeGreaterThan(0);
        expect(p.x + p.width / 2 + FRAME, where).toBeLessThan(def.width);
        if (p.mount === 'wall') {
          const floor = floorBelow(def, p.x, p.y);
          expect(floor, `${where}: no floor below`).toBeLessThan(def.height);
          expect(p.y + p.width / 2 + FRAME, `${where}: touches the floor`).toBeLessThan(floor);
          expect(p.y - p.width / 2 - FRAME, where).toBeGreaterThan(0);
        } else {
          for (const dx of [-p.width / 2, 0, p.width / 2]) {
            const onGround = def.solids.some((s) => Math.abs(s.y - p.y) <= 2 && p.x + dx >= s.x && p.x + dx <= s.x + s.w);
            expect(onGround, `${where}: easel leg at ${dx} not on ground`).toBe(true);
          }
        }
      }
    }
  });
});
