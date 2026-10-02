import { describe, expect, it } from 'vitest';
import { TOUCH } from '../../src/tuning';
import { CHIPS, problems, touchLayout, type Disc, type Hand, type TouchScreen } from '../../src/ui/touchLayout';

// Where the on-screen controls go on phones and tablets of every common
// size, held upright and sideways, for either hand.

const SCREENS: [number, number][] = [
  [390, 844],
  [412, 915],
  [430, 932],
  [375, 667],
  [360, 640],
  [355, 620],
  [320, 568],
  [768, 1024],
  [844, 390],
  [915, 412],
  [740, 340],
  [667, 375],
  [568, 320],
  [1024, 768],
  [1280, 800],
];

type Safe = TouchScreen['safe'];
const NO_INSETS: Safe = { l: 0, r: 0, t: 0, b: 0 };

/** A screen as the page lays itself out (UI.sync and styles.css). */
function screen(w: number, h: number, safe: Safe = NO_INSETS): TouchScreen {
  const portrait = h > w * 0.9;
  const s = Math.min(1.4, Math.max(0.5, Math.min(w / 1280, h / 720)));
  const col = Math.min(0.46 * w, s * 700);
  return {
    w,
    h,
    portrait,
    viewBottom: portrait ? safe.t + 60 + (w * 9) / 16 : 0,
    column: portrait ? undefined : { left: (w - col) / 2, right: (w + col) / 2 },
    safe,
  };
}

const all = (l: ReturnType<typeof touchLayout>): [string, Disc][] => [['stick', l.stick], ['jump', l.jump], ['action', l.action], ...CHIPS.map((c): [string, Disc] => [c, l.chips[c]])];

describe('touch controls layout', () => {
  it('fits every screen, upright and sideways, for either hand, with every button showing', () => {
    for (const [w, h] of SCREENS)
      for (const hand of ['right', 'left'] as Hand[]) {
        const s = screen(w, h);
        const l = touchLayout(s, hand);
        expect(problems(s, l), `${w}×${h}, ${hand} hand`).toEqual([]);
        expect(l.fits).toBe(true);
      }
  });

  it('keeps every target at least 44 px across', () => {
    for (const [w, h] of SCREENS) {
      const l = touchLayout(screen(w, h));
      for (const [name, c] of all(l)) expect(c.d, `${w}×${h} ${name}`).toBeGreaterThanOrEqual(TOUCH.minTarget);
    }
  });

  it('sizes the controls as tuned on the reference phone, and a little smaller sideways', () => {
    const up = touchLayout(screen(390, 844));
    expect(up.k).toBe(1);
    expect(up.stick.d).toBe(TOUCH.stick.size);
    expect(up.jump.d).toBe(TOUCH.jump);
    const side = touchLayout(screen(844, 390));
    expect(side.k).toBeCloseTo(TOUCH.landscape, 5);
  });

  it('puts the stick under the left thumb and Zıpla under the right one; the left hand gets the mirror image', () => {
    for (const [w, h] of SCREENS) {
      const s = screen(w, h);
      const r = touchLayout(s, 'right');
      const l = touchLayout(s, 'left');
      expect(r.stick.x).toBeLessThan(w / 2);
      expect(r.jump.x).toBeGreaterThan(w / 2);
      // Zıpla in the corner, the action button toward the middle.
      expect(r.action.x).toBeLessThan(r.jump.x);
      for (const [name, c] of all(r)) {
        const m = all(l).find(([n]) => n === name)![1];
        expect(m.x, `${w}×${h} ${name}`).toBeCloseTo(w - c.x, 5);
        expect(m.y).toBeCloseTo(c.y, 5);
      }
    }
  });

  it('stays clear of the subtitles: below the game view upright, beside their column sideways', () => {
    for (const [w, h] of SCREENS) {
      const s = screen(w, h);
      const l = touchLayout(s);
      for (const [name, c] of all(l)) {
        const r = name === 'stick' ? l.stick.reach : c.d / 2;
        if (s.portrait) expect(c.y - r, `${w}×${h} ${name}`).toBeGreaterThanOrEqual(s.viewBottom + TOUCH.clearBelowView);
        else expect(c.x + r <= s.column!.left || c.x - r >= s.column!.right, `${w}×${h} ${name}`).toBe(true);
      }
    }
  });

  it('keeps out of notches, rounded corners and the home bar', () => {
    const cases: [number, number, Safe][] = [
      [844, 390, { l: 47, r: 47, t: 0, b: 21 }],
      [390, 844, { l: 0, r: 0, t: 47, b: 34 }],
      [932, 430, { l: 59, r: 59, t: 0, b: 21 }],
    ];
    for (const [w, h, safe] of cases) {
      const s = screen(w, h, safe);
      const l = touchLayout(s);
      expect(problems(s, l), `${w}×${h}`).toEqual([]);
      expect(l.stick.x - l.stick.d / 2).toBeGreaterThanOrEqual(safe.l + TOUCH.side - 0.01);
      expect(l.jump.x + l.jump.d / 2).toBeLessThanOrEqual(w - safe.r - TOUCH.side + 0.01);
      expect(l.jump.y + l.jump.d / 2).toBeLessThanOrEqual(h - safe.b - TOUCH.bottom + 0.01);
    }
  });
});
