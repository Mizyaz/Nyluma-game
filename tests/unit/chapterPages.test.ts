import { describe, expect, it } from 'vitest';
import { riseAt, riseDelay, RISE } from '../../src/paper/popUp';
import { CHAPTER_START, opensChapter } from '../../src/engine/state/GameState';
import { roomDef } from '../../src/content/data/rooms';
import { LOOKS, numeral, picture, tornSheet, wash } from '../../src/content/art/chapterArt';

// What the scene changes keep from before: the pop-up's spring, when a
// chapter's title card is shown, and the chapter drawings.

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

  it('opens on a chapter page when the chapter changes, either way', () => {
    const r2 = CHAPTER_START[2]!;
    const lastOf1 = 'r03';
    expect(roomDef(lastOf1 as never).chapter).toBe(1);
    expect(opensChapter(lastOf1 as never, r2, startCp(r2), new Set([`chapterCard:2`]))).toBe(true);
    expect(opensChapter(r2, lastOf1 as never, startCp(lastOf1), none)).toBe(true);
  });

  it('opens on one entering a chapter at its start until its page has been shown', () => {
    const r1 = CHAPTER_START[1]!;
    expect(opensChapter(null, r1, startCp(r1), none)).toBe(true);
    expect(opensChapter(null, r1, startCp(r1), new Set(['chapterCard:1']))).toBe(false);
    // Within a chapter, or resumed part-way: a plain scene change.
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
