import { describe, expect, it, vi } from 'vitest';

// The doorways (src/content/doorSpecs.ts, doors.ts): each is cut into a wall
// of the paper box, stands at the exit or the gate it opens with and reads
// that one's own condition; its art covers its opening; and Gorti is steered
// through the opening, never through the wall. Phaser needs a browser, and
// the doors' runtime only touches the game while a room is played.
vi.mock('phaser', () => ({ GameObjects: { Components: { TransformMatrix: class {} } } }));
vi.mock('../../src/engine/App', () => ({ app: { settings: { reducedMotion: false } } }));

import { DOORS, type DoorSpec } from '../../src/content/doorSpecs';
import { ROOMS } from '../../src/content/data/rooms';
import { FRAMING, staging } from '../../src/content/stage';
import { parseCond } from '../../src/engine/content/cond';
import { HULL_H, HULL_W } from '../../src/engine/constants';
import { artOf, doorJobs, packShelves, wallSpecOf } from '../../src/content/doors';
import type { FaceArt, WallDoorArt } from '../../src/content/art/doors/wallArt';
import { depthRange, holeHeight, holeTop, type WallWay } from '../../src/paper/opening';

/** The depths Gorti walks at in a room before the doors steer him (WorldScene: the box's back + 100 to its front − 100). */
const walkable = (box: { back: number; front: number }): { min: number; max: number } => ({ min: Math.min(0, box.back + 100), max: Math.max(0, box.front - 100) });

const all = (): { roomId: string; spec: DoorSpec; art: WallDoorArt }[] =>
  Object.entries(DOORS).flatMap(([roomId, specs]) => specs.map((spec) => ({ roomId, spec, art: artOf(spec.art) })));

/** A room's walls as the way round them sees them. */
function ways(roomId: string): WallWay[] {
  const room = ROOMS[roomId]!;
  return (DOORS[roomId] ?? []).map((s) => {
    const art = artOf(s.art);
    return { kind: s.wall, x: s.wall === 'side' ? room.width : s.x!, half: art.wall.half, hole: art.hole };
  });
}

const clean = (svg: string): boolean => !/NaN|undefined|Infinity/.test(svg);

/** Each side doorway's opening (z0..z1) before the openings were made deeper, to see how much wider they show now. */
const BEFORE: Record<string, [number, number]> = {
  'r01.tunnel': [-250, -70],
  'r02.mouth': [-240, -64],
  'r04.tree': [-236, -74],
  'r05.moon': [-246, -70],
  'r08.stage': [-250, -74],
  'b01.hedge': [-244, -72],
  'b02.hill': [-240, -76],
  'b03.blocks': [-240, -74],
};

/**
 * How wide an opening from z0 to z1 in the right side wall shows, as a share
 * of half the view, with the eye at the room's right end: there the wall's
 * depth 0 meets the screen's edge, and its depth z shows d / (d − z) of half
 * the view right of the middle (the lens: scale f / (d − z), the eye d in
 * front of the actors' plane). Wherever the eye stands, the share it shows
 * grows with this alike.
 */
const shows = (z0: number, z1: number, d = FRAMING.dist): number => d / (d - z1) - d / (d - z0);

describe('doorways', () => {
  it('stand at real exits and gates of their rooms and open with them', () => {
    for (const [roomId, specs] of Object.entries(DOORS)) {
      const room = ROOMS[roomId];
      expect(room, `doors for unknown room ${roomId}`).toBeDefined();
      if (!room) continue;
      const ids = new Set<string>();
      // One doorway per way on: one in the right side wall at most.
      expect(specs.filter((d) => d.wall === 'side').length, roomId).toBeLessThanOrEqual(1);
      for (const d of specs) {
        expect(d.id.startsWith(`${roomId}.`), d.id).toBe(true);
        expect(ids.has(d.id), `${d.id} twice`).toBe(false);
        ids.add(d.id);
        if (d.wall === 'cross') expect(d.x !== undefined && d.x > 0 && d.x < room.width, `${d.id} inside the room`).toBe(true);
        else expect(d.x, `${d.id}: a side wall stands at the room's end`).toBeUndefined();
        const o = d.open;
        if (o === 'always') continue;
        if ('exit' in o) {
          const exit = room.exits.find((e) => e.id === o.exit);
          expect(exit, `${d.id}: no exit ${o.exit}`).toBeDefined();
          // A way out through the right side wall: the exit is at the room's right end.
          if (exit) expect(room.width - (exit.x + exit.w / 2), `${d.id} far from its exit`).toBeLessThan(120);
        } else if ('solid' in o) {
          const solid = room.solids.find((s) => s.id === o.solid);
          expect(solid, `${d.id}: no solid ${o.solid}`).toBeDefined();
          // A gate stands in the wall across the room (or at the right end, for the side wall's).
          if (solid && d.wall === 'cross') expect(Math.abs(d.x! - (solid.x + solid.w / 2)), `${d.id} far from its gate`).toBeLessThan(40);
          if (solid && d.wall === 'side') expect(room.width - (solid.x + solid.w / 2), `${d.id} far from its gate`).toBeLessThan(160);
        } else {
          expect(() => parseCond(o.when), d.id).not.toThrow();
        }
        for (const h of d.hides ?? []) expect(room.solids.some((s) => s.id === h), `${d.id}: hides no solid ${h}`).toBe(true);
        if (d.hides?.length) expect('solid' in o && d.hides.includes(o.solid), `${d.id} hides the gate it opens with`).toBe(true);
      }
    }
  });

  it('are cut into their walls: an opening Gorti fits through, art over it, a leaf flush with the wall when shut', () => {
    for (const { roomId, spec, art } of all()) {
      const box = staging(ROOMS[roomId]!).box;
      const h = art.hole;
      expect(h.z0 > box.back && h.z0 < h.z1 && h.z1 < box.front, `${spec.id} opening within the box`).toBe(true);
      // Wide and tall enough for him (his body is HULL_W × HULL_H; drawn, he is not twice as tall).
      expect(h.z1 - h.z0, spec.id).toBeGreaterThanOrEqual(4 * HULL_W);
      expect(holeHeight(h), spec.id).toBeGreaterThanOrEqual(2 * HULL_H);
      expect(holeTop(h, h.z0 - 1) + holeTop(h, h.z1 + 1), `${spec.id} nothing outside the opening`).toBe(0);
      const covers = (f: FaceArt, what: string): void => {
        expect(f.u0 <= h.z0 && f.u1 >= h.z1 && f.h >= holeHeight(h), `${spec.id} ${what} covers the opening`).toBe(true);
        expect(clean(f.body), `${spec.id} ${what}`).toBe(true);
      };
      covers(art.face, 'face');
      if (spec.wall === 'cross') {
        // A wall across the room, from the back wall to well in front of where he walks.
        expect(art.wall.half ?? 0, spec.id).toBeGreaterThan(0);
        expect(art.wall.end ?? 0, spec.id).toBeGreaterThanOrEqual(walkable(box).max);
        expect(art.passage, `${spec.id}: the room goes on beyond a wall across it`).toBeUndefined();
      } else {
        const p = art.passage!;
        expect(p, `${spec.id}: a passage beyond`).toBeDefined();
        expect(p.length > 0 && p.reveal > 0 && p.reveal < p.length, spec.id).toBe(true);
        const xs = (p.frames ?? []).map((f) => f.x);
        expect(xs.every((x, i) => x > 0 && x < p.length && (i === 0 || x > xs[i - 1]!)), `${spec.id} frames in the passage`).toBe(true);
        for (const f of p.frames ?? []) expect(clean(f.art.body)).toBe(true);
        if (p.art) expect(clean(p.art.body)).toBe(true);
      }
      const leaf = art.leaf;
      if (leaf) {
        expect(leaf.shut, `${spec.id} shut flush`).toBe(0);
        if (leaf.kind === 'swing') expect(leaf.open > 0 && leaf.open <= 120, spec.id).toBe(true);
        else expect(leaf.open > 0 && leaf.open <= 1, spec.id).toBe(true);
        if (leaf.wide !== undefined) expect(leaf.wide, spec.id).toBeGreaterThanOrEqual(leaf.open);
        // Across the room a leaf slides, lifts, sinks or rolls: a swinging one would stand in his way.
        if (spec.wall === 'cross') expect(leaf.kind, spec.id).not.toBe('swing');
        if (leaf.art) covers(leaf.art, 'leaf');
      }
      expect(art.light.radius > 0 && art.light.intensity > 0, spec.id).toBe(true);
      if (art.peek) expect(clean(art.peek.art.body)).toBe(true);
      if (art.life) expect(art.life.rate > 0 && art.life.colors.length > 0, spec.id).toBe(true);
    }
  });

  it('steer Gorti through their openings, gently, and never through a wall', () => {
    for (const [roomId, specs] of Object.entries(DOORS)) {
      const room = ROOMS[roomId]!;
      const base = walkable(staging(room).box);
      const w = ways(roomId);
      let last = depthRange(w, 0, base.min, base.max);
      for (let x = 0; x <= room.width; x++) {
        const r = depthRange(w, x, base.min, base.max);
        expect(r.min, `${roomId} at ${x}`).toBeLessThanOrEqual(r.max);
        expect(r.min >= base.min && r.max <= base.max, `${roomId} at ${x}`).toBe(true);
        // No more than a px of depth for each px he walks.
        expect(Math.abs(r.min - last.min) + Math.abs(r.max - last.max), `${roomId} at ${x}`).toBeLessThanOrEqual(1.2);
        last = r;
      }
      for (const spec of specs) {
        const art = artOf(spec.art);
        const h = art.hole;
        const half = art.wall.half ?? 0;
        // Wherever his body meets the wall, he is within the opening, under its top.
        const xs = spec.wall === 'side' ? [room.width - HULL_W / 2, room.width] : [spec.x! - half - HULL_W / 2, spec.x!, spec.x! + half + HULL_W / 2];
        for (const x of xs) {
          const r = depthRange(w, x, base.min, base.max);
          expect(r.min > h.z0 && r.max < h.z1, `${spec.id} at ${x}: ${r.min}..${r.max}`).toBe(true);
          if (spec.wall === 'cross') for (const z of [r.min, r.max]) expect(holeTop(h, z), `${spec.id} at depth ${z}`).toBeGreaterThanOrEqual(2 * HULL_H);
        }
        // Far from the wall the room is his again.
        const away = spec.wall === 'side' ? room.width - 400 : spec.x! - 400;
        if (away > 0 && w.length === 1) expect(depthRange(w, away, base.min, base.max)).toEqual(base);
      }
    }
  });

  it("show wide even on a narrow screen: from the room's right end, each side doorway at least 1.5 times as wide as before", () => {
    const side = all().filter(({ spec }) => spec.wall === 'side');
    expect(side.map(({ spec }) => spec.id).sort()).toEqual(Object.keys(BEFORE).sort());
    for (const { roomId, spec, art } of side) {
      const h = art.hole;
      const box = staging(ROOMS[roomId]!).box;
      // The near jamb no nearer than the actors' plane (the eye never sees the wall in front of it); the far one short of the back corner, a little paper left there, and nothing drawn behind the back wall.
      expect(h.z1, spec.id).toBeLessThanOrEqual(0);
      expect(h.z0 - box.back, `${spec.id} leaves paper at the back corner`).toBeGreaterThanOrEqual(12);
      expect(art.face.u0, `${spec.id} nothing behind the back wall`).toBeGreaterThanOrEqual(box.back);
      const [a, b] = BEFORE[spec.id]!;
      expect(shows(h.z0, h.z1) / shows(a, b), spec.id).toBeGreaterThanOrEqual(1.5);
    }
  });

  it('have room behind them for what opens into them and what peeks out', () => {
    for (const { spec, art } of all()) {
      const p = art.passage;
      if (!p) continue;
      const h = art.hole;
      // The passage's far wall is drawn all along it.
      if (p.art) expect(p.art.u1 - p.art.u0, spec.id).toBeGreaterThanOrEqual(p.length);
      // A leaf swung into the passage, at its widest, stays short of the passage's end.
      const lf = art.leaf;
      if (lf?.kind === 'swing') expect(p.length, spec.id).toBeGreaterThanOrEqual((h.z1 - h.z0) * Math.sin(((lf.wide ?? lf.open) * Math.PI) / 180) + 20);
      // Someone peeks out of the middle of the opening, coming from deeper in the passage: hidden, out of
      // sight past the near jamb even on a 32:9 screen with the eye at the room's end (half the view
      // (32 / 9) · span / 2 wide at the actors' plane; a point x past the wall at depth z shows only while
      // x < half · ((d − z) / (d − z1) − 1)).
      if (art.peek) {
        const pk = art.peek;
        const w = pk.art.u1 - pk.art.u0;
        const d = FRAMING.dist;
        const half = ((32 / 9) * FRAMING.span) / 2;
        expect(Math.abs(pk.z - (h.z0 + h.z1) / 2), spec.id).toBeLessThanOrEqual(8);
        expect(pk.hidden > pk.shown && pk.hidden + w / 2 <= p.length, spec.id).toBe(true);
        expect(pk.hidden - w / 2, `${spec.id} hides its figure`).toBeGreaterThanOrEqual(half * ((d - pk.z) / (d - h.z1) - 1));
      }
    }
  });

  it('print their pieces at the density they show at, and pack them on one sheet', () => {
    const scaleAt = (z: number): number => 1.5 * (900 / (900 - z));
    for (const { roomId, spec, art } of all()) {
      const jobs = doorJobs(spec, art, scaleAt);
      const keys = jobs.map((j) => j.key);
      expect(new Set(keys).size, spec.id).toBe(keys.length);
      expect(keys).toContain(`${spec.id}.face`);
      if (art.leaf?.art) expect(keys).toContain(`${spec.id}.leaf`);
      if (art.passage?.art) expect(keys).toContain(`${spec.id}.pass`);
      expect(keys.filter((k) => k.includes('.frame')).length).toBeLessThanOrEqual(2);
      for (const j of jobs) expect(j.sx > 0 && j.sy > 0, j.key).toBe(true);
      // A wall's face is seen slanted: printed narrower across than up.
      const face = jobs.find((j) => j.key === `${spec.id}.face`)!;
      expect(face.sx).toBeLessThan(face.sy);
      const box = staging(ROOMS[roomId]!).box;
      const ws = wallSpecOf(spec, art, box, null);
      expect(ws.x).toBe(spec.wall === 'side' ? box.x1 : spec.x);
      for (const c of [ws.color, ws.edge, ws.leaf?.color ?? 0, ws.leaf?.back ?? 0, ws.passage?.floor ?? 0, ws.passage?.wall ?? 0, ws.passage?.end ?? 0]) expect(Number.isInteger(c) && c >= 0 && c <= 0xffffff, spec.id).toBe(true);
    }
    const sizes = [
      { key: 'a', w: 300, h: 900 },
      { key: 'b', w: 1200, h: 700 },
      { key: 'c', w: 900, h: 500 },
      { key: 'd', w: 1500, h: 400 },
      { key: 'e', w: 40, h: 40 },
      { key: 'f', w: 2040, h: 64 },
    ];
    const packed = packShelves(sizes);
    const isPow2 = (n: number): boolean => (n & (n - 1)) === 0;
    expect(isPow2(packed.w) || isPow2(packed.h)).toBe(false);
    const rects = sizes.map((s) => ({ ...s, ...packed.at.get(s.key)! }));
    for (const r of rects) {
      expect(r.x >= 0 && r.y >= 0 && r.x + r.w <= packed.w && r.y + r.h <= packed.h, r.key).toBe(true);
      for (const o of rects) if (o !== r) expect(r.x + r.w <= o.x || o.x + o.w <= r.x || r.y + r.h <= o.y || o.y + o.h <= r.y, `${r.key} ${o.key}`).toBe(true);
    }
  });
});
