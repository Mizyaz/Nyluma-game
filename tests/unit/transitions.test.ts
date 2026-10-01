import { describe, expect, it } from 'vitest';
import { FLAT, liftPose, pointAt, reach, shadeAt, turnPose, type Pose } from '../../src/ui/pageCurl';
import { riseAt, riseDelay, RISE } from '../../src/paper/popUp';
import { CHAPTER_START, opensChapter } from '../../src/engine/state/GameState';
import { roomDef } from '../../src/content/data/rooms';
import { LOOKS, numeral, picture, tornSheet, wash } from '../../src/content/art/chapterArt';

// The page turns between rooms and the chapter pages (WarpScene): the curl's
// geometry, the pop-up's spring, when a chapter page is shown, and the
// chapter pages' drawings.

const LEN = 1000;

/** The length of the page along its curve, sampled. */
function arcLength(p: Pose, n = 400): number {
  let l = 0;
  let a = pointAt(p, 0, LEN);
  for (let i = 1; i <= n; i++) {
    const b = pointAt(p, (i * LEN) / n, LEN);
    l += Math.hypot(b.x - a.x, b.z - a.z);
    a = b;
  }
  return l;
}

describe('page curl', () => {
  it('lies flat before it is picked up', () => {
    for (const s of [0, 250, 1000]) {
      const q = pointAt(liftPose(0), s, LEN);
      expect(q.x).toBeCloseTo(s, 6);
      expect(q.z).toBeCloseTo(0, 6);
    }
    expect(pointAt(FLAT, LEN, LEN).x).toBeCloseTo(LEN, 6);
  });

  it('never stretches or tears the paper, however it is bent', () => {
    const poses = [liftPose(0.5), liftPose(1), ...[0, 0.2, 0.45, 0.7, 0.9, 1].map((u) => turnPose(u))];
    for (const p of poses) {
      expect(arcLength(p)).toBeCloseTo(LEN, 0);
      // The curve is continuous: nearby points stay near.
      for (let s = 0; s < LEN; s += 50) {
        const a = pointAt(p, s, LEN);
        const b = pointAt(p, s + 1, LEN);
        expect(Math.hypot(b.x - a.x, b.z - a.z)).toBeLessThan(1.001);
      }
    }
  });

  it('rolls the free edge over toward the spine and then lifts the page away', () => {
    const w = 1280;
    const persp = w * 1.5;
    // Picked up: the free edge rises off the page.
    expect(reach(liftPose(1), w, w, persp, 1).top).toBeGreaterThan(20);
    // Turned: nothing of it is left over the view (it has gone past the spine).
    expect(reach(turnPose(1), w, w, persp, 1).edge).toBeLessThanOrEqual(1);
    expect(reach(turnPose(1), w, w, persp, -1).edge).toBeGreaterThanOrEqual(w - 1);
    // The roll never passes the paper through itself.
    for (let u = 0; u <= 1; u += 0.05) {
      const p = turnPose(u);
      expect(p.a0 + p.c).toBeLessThanOrEqual(Math.PI + 1e-9);
    }
  });

  it('shows the print as printed when flat, and shades paper turned from the light', () => {
    const flat = shadeAt(0, 1);
    expect(flat.front).toBeCloseTo(0, 6);
    expect(flat.glint).toBeCloseTo(0, 6);
    // The light comes from the upper right: a page standing toward the left darkens.
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
