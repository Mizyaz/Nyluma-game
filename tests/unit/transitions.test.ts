import { describe, expect, it } from 'vitest';
import {
  PERSPECTIVE,
  across,
  bend,
  flat,
  hoverCurl,
  liftCurl,
  litAt,
  place,
  project,
  rollRadius,
  shadeAt,
  turnCurl,
  type Curl,
  type Sheet,
} from '../../src/ui/pageCurl';
import { riseAt, riseDelay, RISE } from '../../src/paper/popUp';
import { CHAPTER_START, opensChapter } from '../../src/engine/state/GameState';
import { roomDef } from '../../src/content/data/rooms';
import { LOOKS, numeral, picture, tornSheet, wash } from '../../src/content/art/chapterArt';

// The page turns between rooms and the chapter pages (WarpScene): the curl's
// geometry and light, the pop-up's spring, when a chapter page is shown, and
// the chapter pages' drawings.

const SHEETS: Sheet[] = [
  { w: 1280, h: 720 },
  { w: 844, h: 390 },
  { w: 390, h: 219 },
];

/** The poses of a whole turn: lifted, held, and turned over. */
function poses(sh: Sheet): Curl[] {
  const held = liftCurl(1, sh);
  return [liftCurl(0.3, sh), liftCurl(0.7, sh), held, hoverCurl(0.4, sh), ...[0, 0.15, 0.3, 0.5, 0.7, 0.9, 1].map((u) => turnCurl(u, sh, held))];
}

describe('page curl', () => {
  it('lies flat before it is picked up', () => {
    for (const sh of SHEETS) {
      for (const c of [flat(sh), liftCurl(0, sh)]) {
        for (const [x, y] of [
          [0, 0],
          [sh.w, 0],
          [sh.w, sh.h],
          [sh.w / 3, sh.h / 2],
        ] as const) {
          const q = place(c, x, y);
          expect(q.x).toBeCloseTo(x, 6);
          expect(q.y).toBeCloseTo(y, 6);
          expect(q.z).toBe(0);
        }
      }
    }
  });

  it('never stretches or tears the paper, however it is rolled', () => {
    for (const sh of SHEETS) {
      for (const c of poses(sh)) {
        expect(c.phi).toBeGreaterThanOrEqual(0);
        expect(c.phi).toBeLessThanOrEqual(Math.PI);
        // Along the paper from the fold, every px of it is a px of curve.
        const len = across(sh) + sh.w;
        let a = bend(c, 0);
        let l = 0;
        for (let d = 0.5; d <= len; d += 0.5) {
          const b = bend(c, d);
          const step = Math.hypot(b.s - a.s, b.z - a.z);
          expect(step).toBeLessThan(0.5 + 1e-6);
          l += step;
          // It only ever rises from the page, and never turns past lying over.
          expect(b.z).toBeGreaterThanOrEqual(a.z - 1e-9);
          expect(b.a).toBeLessThanOrEqual(Math.PI + 1e-9);
          a = b;
        }
        expect(l).toBeCloseTo(len, 0);
      }
    }
  });

  it('is picked up by its lower corner first, over a tight roll', () => {
    for (const sh of SHEETS) {
      for (const u of [0.3, 0.6, 1]) {
        const c = liftCurl(u, sh);
        const foot = place(c, sh.w, sh.h);
        const top = place(c, sh.w, 0);
        expect(foot.z).toBeGreaterThan(top.z);
        // The spine stays down.
        expect(place(c, 0, 0).z).toBe(0);
        expect(place(c, 0, sh.h).z).toBe(0);
      }
      // Rolled over at its foot while it is held: the back is up there.
      expect(place(liftCurl(1, sh), sh.w, sh.h).a).toBeGreaterThan(Math.PI / 2);
      // A finger's worth of roll, not a third of the page.
      expect(rollRadius(sh)).toBeLessThanOrEqual(sh.w * 0.05);
    }
  });

  it('takes the whole page past the spine, out of sight, by the end of the turn', () => {
    for (const sh of SHEETS) {
      const end = turnCurl(1, sh, liftCurl(1, sh));
      const eye = { x: sh.w / 2, y: sh.h / 2 };
      for (let x = 0; x <= sh.w; x += sh.w / 16) {
        for (let y = 0; y <= sh.h; y += sh.h / 8) {
          const q = place(end, x, y);
          expect(project(q, eye, sh.w * PERSPECTIVE).x).toBeLessThan(0);
        }
      }
    }
  });

  it('turns the fold steadily toward the spine and lays the paper over as it goes', () => {
    const sh = SHEETS[0]!;
    const held = liftCurl(1, sh);
    let last = turnCurl(0, sh, held);
    expect(last.f).toBeCloseTo(held.f, 6);
    for (let u = 0.05; u <= 1.0001; u += 0.05) {
      const c = turnCurl(u, sh, held);
      expect(c.f).toBeLessThan(last.f + 1e-9);
      expect(c.phi).toBeGreaterThanOrEqual(last.phi - 1e-9);
      last = c;
    }
    expect(last.phi).toBeGreaterThan(Math.PI - 0.1);
  });

  it('lights the roll from the upper right: the print as printed when flat, the roll bright toward the light and dark underneath', () => {
    for (const dir of [1, -1] as const) {
      const flatLit = litAt(0, true, dir);
      expect(flatLit.dark).toBeCloseTo(0, 6);
      expect(flatLit.pale).toBeCloseTo(0, 6);
      expect(flatLit.sheen).toBeCloseTo(0, 6);
    }
    // Turning over to the left, the back of the roll faces the light near its top…
    expect(litAt(2.64, false, 1).pale).toBeGreaterThan(0.3);
    expect(litAt(2.9, false, 1).sheen).toBeGreaterThan(0.5);
    // …and turns from it at its underside; the print rising to the left is in shade.
    expect(litAt(Math.PI / 2, false, 1).dark).toBeGreaterThan(0.3);
    expect(litAt(1.2, true, 1).dark).toBeGreaterThan(0.3);
  });

  it('shades the chapter page doors as printed when flat, and darker turned from the light', () => {
    const flatDoor = shadeAt(0, 1);
    expect(flatDoor.front).toBeCloseTo(0, 6);
    expect(flatDoor.glint).toBeCloseTo(0, 6);
    // The light comes from the upper right: a door standing toward the left darkens.
    expect(shadeAt(1.2, 1).front).toBeGreaterThan(0.3);
    // Turned over, its back shows.
    expect(shadeAt(2.6, 1).front).toBe(0);
  });
});

describe('pop-up', () => {
  it('stands each card up from flat, a little past standing, and settles', () => {
    expect(riseAt(0)).toBe(0);
    expect(riseAt(-1)).toBe(0);
    let peak = 0;
    for (let u = 0; u <= 1; u += 0.01) peak = Math.max(peak, riseAt(u));
    expect(peak).toBeGreaterThan(1.02);
    expect(peak).toBeLessThan(1.25);
    expect(Math.abs(riseAt(1) - 1)).toBeLessThan(0.01);
    expect(riseAt(2)).toBe(1);
  });

  it('raises the far cards first', () => {
    const far = riseDelay(-300, -300, 200, RISE.spread);
    const mid = riseDelay(0, -300, 200, RISE.spread);
    const near = riseDelay(200, -300, 200, RISE.spread);
    expect(far).toBeCloseTo(0, 6);
    expect(mid).toBeGreaterThan(far);
    expect(near).toBeGreaterThan(mid);
    expect(near).toBeLessThanOrEqual(RISE.spread + 1e-9);
  });
});

describe('chapter pages', () => {
  const none = new Set<string>();
  const startCp = (room: string): string => roomDef(room as never).checkpoints[0]!.id;

  it('turns onto a chapter page when the chapter changes, either way', () => {
    const r2 = CHAPTER_START[2]!;
    const lastOf1 = 'r03';
    expect(roomDef(lastOf1 as never).chapter).toBe(1);
    expect(opensChapter(lastOf1 as never, r2, startCp(r2), new Set([`chapterCard:2`]))).toBe(true);
    expect(opensChapter(r2, lastOf1 as never, startCp(lastOf1), none)).toBe(true);
  });

  it('turns onto it entering a chapter at its start until its page has been shown', () => {
    const r1 = CHAPTER_START[1]!;
    expect(opensChapter(null, r1, startCp(r1), none)).toBe(true);
    expect(opensChapter(null, r1, startCp(r1), new Set(['chapterCard:1']))).toBe(false);
    // Within a chapter, or resumed part-way: a plain page turn.
    expect(opensChapter('r01' as never, 'r02' as never, startCp('r02'), none)).toBe(false);
    const cps = roomDef(r1).checkpoints;
    if (cps.length > 1) expect(opensChapter(null, r1, cps[1]!.id, none)).toBe(false);
  });

  it('draws every chapter page whole', () => {
    for (const ch of Object.keys(LOOKS).map(Number)) {
      const pic = picture(ch);
      expect(pic.art.length).toBeGreaterThan(1000);
      expect(pic.outline.startsWith('M')).toBe(true);
      expect(pic.art).not.toMatch(/NaN|undefined|Infinity/);
      expect(pic.art).toMatch(/data-mv=/);
    }
    for (const [roman, n] of [['I', 3], ['II', 6], ['III', 9], ['IV', 7], ['V', 4], ['VI', 7]] as const) {
      const num = numeral(roman, '#f0b2cf', 3);
      expect(num.strokes).toHaveLength(n);
      for (const s of num.strokes) {
        expect(s.art).not.toMatch(/NaN|undefined/);
        expect(s.spine).not.toMatch(/NaN|undefined/);
        expect(s.w).toBeGreaterThan(0);
      }
      expect(wash(num, '#f0b2cf', 1)).not.toMatch(/NaN|undefined/);
    }
    const t = tornSheet(10, 20, 600, 300, 4, 6);
    expect(t.outer).toMatch(/^M[\d.\s-]+L.*Z$/);
    expect(t.inner).not.toMatch(/NaN/);
  });
});
