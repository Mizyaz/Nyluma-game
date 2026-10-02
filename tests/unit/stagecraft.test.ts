import { describe, expect, it, vi } from 'vitest';

// The paper theatre's scene changes (src/paper/stagecraft.ts): when the old
// room may be swapped, that it is hidden then, how long it all takes, and
// where the title card's pieces go on screens of every shape. Phaser needs a
// browser; the stage's lamps only keep two of its matrices.
vi.mock('phaser', () => ({ GameObjects: { Components: { TransformMatrix: class {} } } }));

import { FRAMING } from '../../src/content/stage';
import { FLAT_EDGE, HEM } from '../../src/content/art/stagecraftArt';
import {
  bestSplit,
  cardLayout,
  curtainFoot,
  earliestOpen,
  flatDepth,
  flatPlace,
  openLength,
  peakAt,
  pose,
  riseAtTime,
  STAGE_DEPTH,
  STAGE_TIMES as T,
  theatreLens,
  type ChangeKind,
  type Plan,
} from '../../src/paper/stagecraft';

const KINDS: ChangeKind[] = ['room', 'chapter'];

/** Screens (device px) and their actor scales: a laptop, a phone held upright (the game's band), a phone on its side. */
const SCREENS = [
  { name: '1280×720', W: 1280, H: 720, actor: 1.5 },
  { name: '390×844 band', W: 1170, H: 658, actor: 2.4375 },
  { name: '844×390', W: 2532, H: 1170, actor: 2.4375 },
] as const;

/** The plan of a change whose stage opens as early as it may. */
const plan = (kind: ChangeKind, reduced: boolean): Plan => ({ kind, reduced, open: earliestOpen(kind, reduced) });

/** Moments from a to b. */
const moments = (a: number, b: number, n = 60): number[] => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);

/** Whether the flats, posed so, hide the whole picture: their bodies and the solid border of their edges meet or overlap on the screen, top to bottom. */
function flatsHide(W: number, H: number, actor: number, roll: number, meetPx: number | null): boolean {
  const L = theatreLens(W, H, FRAMING, actor);
  const solid = FLAT_EDGE.border;
  const left = flatPlace(L, -1, roll, meetPx, FLAT_EDGE.w);
  const right = flatPlace(L, 1, roll, meetPx, FLAT_EDGE.w);
  // The left flat is solid to its border's far side, the right one from its border's far side.
  const leftReach = L.project(left.xe - 6 + solid, 0, flatDepth(-1)).x;
  const rightReach = L.project(right.xe + 6 - solid, 0, flatDepth(1)).x;
  const top = Math.max(L.project(0, left.y0, flatDepth(-1)).y, L.project(0, right.y0, flatDepth(1)).y);
  const foot = Math.min(L.project(0, left.y1, flatDepth(-1)).y, L.project(0, right.y1, flatDepth(1)).y);
  const leftFrom = L.project(left.x0, 0, flatDepth(-1)).x;
  const rightTo = L.project(right.x1, 0, flatDepth(1)).x;
  return leftReach >= rightReach && leftFrom <= 0 && rightTo >= W && top <= 0 && foot >= H;
}

/** Whether the curtain, down so far, hides the whole picture under its hem's solid braid. */
function curtainHides(W: number, H: number, actor: number, drop: number): boolean {
  const L = theatreLens(W, H, FRAMING, actor);
  const z = STAGE_DEPTH.curtain;
  const braidFoot = curtainFoot(L, drop, HEM.h, HEM.band) - HEM.h + HEM.band;
  return L.project(0, braidFoot, z).y >= H;
}

describe('scene change timeline', () => {
  it('swaps the room only once it is hidden, and keeps it hidden until the stage opens', () => {
    for (const kind of KINDS) {
      const p = plan(kind, false);
      const peak = peakAt(kind, false);
      expect(peak).toBeLessThanOrEqual(p.open);
      for (const t of moments(peak, p.open)) {
        const q = pose(p, t);
        if (kind === 'room') {
          expect(q.flats, `flats at ${t}`).toBeGreaterThanOrEqual(1);
          expect(q.flatsAlpha).toBe(1);
          for (const s of SCREENS) for (const meet of [null, 0, s.W * 0.5, s.W]) expect(flatsHide(s.W, s.H, s.actor, q.flats, meet), `${s.name} at ${t}, meeting at ${meet}`).toBe(true);
        } else {
          expect(q.curtain, `curtain at ${t}`).toBe(1);
          expect(q.curtainAlpha).toBe(1);
          for (const s of SCREENS) expect(curtainHides(s.W, s.H, s.actor, q.curtain), `${s.name} at ${t}`).toBe(true);
        }
      }
    }
  });

  it('starts and ends with the stage open', () => {
    for (const s of SCREENS) {
      expect(flatsHide(s.W, s.H, s.actor, 0, null)).toBe(false);
      const L = theatreLens(s.W, s.H, FRAMING, s.actor);
      // Out in the wings the flats' edges are clear of the picture.
      expect(L.project(flatPlace(L, -1, 0, null, FLAT_EDGE.w).xe - 6 + FLAT_EDGE.w, 0, flatDepth(-1)).x).toBeLessThanOrEqual(0);
      expect(L.project(flatPlace(L, 1, 0, null, FLAT_EDGE.w).xe + 6 - FLAT_EDGE.w, 0, flatDepth(1)).x).toBeGreaterThanOrEqual(s.W);
      // Up in the flies the whole hem is above the picture.
      expect(L.project(0, curtainFoot(L, 0, HEM.h, HEM.band), STAGE_DEPTH.curtain).y).toBeLessThanOrEqual(0);
    }
    for (const kind of KINDS) {
      const p = plan(kind, false);
      const a = pose(p, 0);
      expect(a.flats).toBe(0);
      expect(a.curtain).toBe(0);
      expect(a.card).toBe(0);
      const end = pose(p, p.open + openLength(kind, false));
      expect(end.flats).toBeCloseTo(0, 6);
      expect(end.curtain).toBeCloseTo(0, 6);
      expect(end.card).toBe(0);
      expect(end.picture).toBe(0);
    }
  });

  it('is about as long as the page turns were, and over well within the limit', () => {
    // The page turns: a room in 0.25 + 0.32 + 0.82 s and its pop-up; a chapter held 2.15 s and opened in 0.86 s.
    const room = earliestOpen('room', false) + openLength('room', false);
    expect(room).toBeGreaterThan(1.1);
    expect(room).toBeLessThan(1.6);
    expect(earliestOpen('chapter', false)).toBeCloseTo(2.15, 6);
    expect(openLength('chapter', false)).toBeGreaterThanOrEqual(0.86);
    expect(openLength('chapter', false)).toBeLessThan(1.2);
    for (const kind of KINDS)
      for (const reduced of [false, true]) {
        // Even a room that keeps it waiting a few seconds more.
        expect(earliestOpen(kind, reduced) + openLength(kind, reduced) + 3).toBeLessThan(T.limit);
        expect(riseAtTime(kind, reduced, 1)).toBeGreaterThanOrEqual(1);
      }
  });

  it('only fades with less motion: nothing rolls, drops, swings or stands up', () => {
    for (const kind of KINDS) {
      const p = plan(kind, true);
      expect(peakAt(kind, true)).toBe(T.fadeOut);
      for (const t of moments(0, p.open + T.fadeIn)) {
        const q = pose(p, t);
        expect(q.sway).toBe(0);
        if (kind === 'room') expect(q.flats).toBe(1);
        else {
          expect(q.curtain).toBe(1);
          expect(q.card).toBe(1);
          expect(q.picture).toBe(1);
          expect(q.cardAlpha).toBe(q.curtainAlpha);
        }
      }
      // Fully there when the room is swapped, gone at the end.
      const peak = pose(p, peakAt(kind, true));
      expect(kind === 'room' ? peak.flatsAlpha : peak.curtainAlpha).toBe(1);
      const end = pose(p, p.open + T.fadeIn);
      expect(kind === 'room' ? end.flatsAlpha : end.curtainAlpha).toBe(0);
    }
  });

  it('brings the title card down after the curtain, its picture up after it, and both away before the curtain rises', () => {
    const p = plan('chapter', false);
    expect(pose(p, T.drop).card).toBe(0);
    expect(pose(p, T.drop + T.cardAfter + 0.7).card).toBeCloseTo(1, 6);
    expect(pose(p, T.drop + T.cardAfter + T.pictureAfter).picture).toBeCloseTo(0, 6);
    expect(pose(p, p.open - 0.01).picture).toBeCloseTo(1, 6);
    // It hangs in front of the curtain, no lower than its hem's braid, and goes up ahead of it: never in front of the room.
    for (const s of SCREENS) {
      const L = theatreLens(s.W, s.H, FRAMING, s.actor);
      const lay = cardLayout(s.W, s.H);
      const bottom = lay.card.y + lay.card.h;
      for (const t of moments(T.drop, p.open + openLength('chapter', false), 200)) {
        const q = pose(p, t);
        if (q.card <= 0) continue;
        const cardFoot = bottom - (1 - q.card) * (bottom + 30);
        const braidFoot = L.project(0, curtainFoot(L, q.curtain, HEM.h, HEM.band) - HEM.h + HEM.band, STAGE_DEPTH.curtain).y;
        expect(cardFoot, `${s.name} at ${t}`).toBeLessThanOrEqual(braidFoot);
      }
    }
    expect(pose(p, p.open + 0.45).card).toBe(0);
    // The card only breathes while it hangs: a few px of sway.
    for (const t of moments(T.drop + T.cardAfter + 1, p.open)) expect(Math.abs(pose(p, t).sway)).toBeLessThan(3);
  });
});

describe('title card layout', () => {
  it('fits on every screen: the card in the picture, its words and picture on the card, nothing overlapping', () => {
    const inside = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }): boolean =>
      a.x >= b.x - 1e-6 && a.y >= b.y - 1e-6 && a.x + a.w <= b.x + b.w + 1e-6 && a.y + a.h <= b.y + b.h + 1e-6;
    const apart = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }): boolean =>
      a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y;
    for (const s of [...SCREENS, { name: 'tall', W: 900, H: 1600 }, { name: 'wide', W: 3440, H: 1440 }]) {
      const lay = cardLayout(s.W, s.H);
      expect(inside(lay.card, { x: 0, y: 0, w: s.W, h: s.H }), s.name).toBe(true);
      for (const part of [lay.tag, lay.numeral, lay.title, lay.rule, lay.picture]) expect(inside(part, lay.card), s.name).toBe(true);
      const words = [lay.tag, lay.numeral, lay.title];
      for (let i = 0; i < words.length; i++) for (let j = i + 1; j < words.length; j++) expect(apart(words[i]!, words[j]!), `${s.name} words ${i} ${j}`).toBe(true);
      for (const w of words) expect(apart(w, lay.picture), `${s.name} picture`).toBe(true);
      // The picture keeps its shape (4:3), and is big enough to be seen.
      expect(lay.picture.w / lay.picture.h).toBeCloseTo(4 / 3, 6);
      expect(lay.picture.h).toBeGreaterThan(lay.card.h * 0.4);
      for (const [x, y] of lay.eyelets) expect(inside({ x, y, w: 0, h: 0 }, lay.card)).toBe(true);
    }
  });

  it('splits a title into the lines with the narrowest widest line', () => {
    expect(bestSplit([50], 10, 3)).toEqual({ cuts: [[0, 1]], width: 50 });
    expect(bestSplit([40, 40, 40, 40], 10, 2)).toEqual({ cuts: [[0, 2], [2, 4]], width: 90 });
    expect(bestSplit([100, 20, 20, 20], 10, 2)).toEqual({ cuts: [[0, 1], [1, 4]], width: 100 });
    const three = bestSplit([30, 60, 30, 30, 60], 5, 3);
    expect(three.cuts).toHaveLength(3);
    expect(three.width).toBe(95);
    // One line when asked for one.
    expect(bestSplit([30, 30], 5, 1)).toEqual({ cuts: [[0, 2]], width: 65 });
  });
});
