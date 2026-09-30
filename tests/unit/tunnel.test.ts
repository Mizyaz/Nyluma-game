import { describe, expect, it } from 'vitest';
import { Rng } from '../../src/render/2d/svg';
import type { ThemeId } from '../../src/content/data/roomTypes';
import { GEM_HUES, GEM_SWATCHES, nearestGemHue } from '../../src/render/2d/fx/gemArt';
import { frameSlots, sideCounts, ZoomTunnel, type FrameSpec } from '../../src/render/2d/fx/tunnelLayout';
import { huesOf, warpLook } from '../../src/render/2d/fx/warpLook';

const SPEC: FrameSpec = { gems: 12, sides: true, band: 0.83, edge: 0.97, gemLength: 0.52, jitter: 0.14, shapes: 3, sideKinds: 6 };

/** Distance from the axis of a half turn (gems are symmetric). */
const offAxis = (angle: number, axis: number): number => {
  const d = (((angle - axis) % Math.PI) + Math.PI) % Math.PI;
  return Math.min(d, Math.PI - d);
};

describe('gem tunnel frames', () => {
  it('spreads the gems over corners and sides, long sides first', () => {
    expect(sideCounts(12)).toEqual([2, 2, 2, 2]);
    expect(sideCounts(10)).toEqual([2, 1, 2, 1]);
    expect(sideCounts(16)).toEqual([3, 3, 3, 3]);
    expect(sideCounts(4)).toEqual([0, 0, 0, 0]);
    for (const gems of [4, 8, 10, 12, 14, 16]) {
      const slots = frameSlots({ ...SPEC, gems }, new Rng(gems));
      expect(slots.filter((s) => s.kind === 'gem')).toHaveLength(gems);
    }
  });

  it('lays the side pieces first, so they are drawn under the gems', () => {
    const slots = frameSlots(SPEC, new Rng(3));
    expect(slots.slice(0, 4).every((s) => s.kind === 'side')).toBe(true);
    expect(slots.slice(4).every((s) => s.kind === 'gem')).toBe(true);
    expect(frameSlots({ ...SPEC, sides: false }, new Rng(3)).some((s) => s.kind === 'side')).toBe(false);
    // Each side piece faces outward from the middle of its side.
    for (const s of slots.slice(0, 4)) {
      expect(Math.max(Math.abs(s.x), Math.abs(s.y))).toBeCloseTo(SPEC.edge, 1);
      const out = Math.atan2(s.y, s.x);
      const facing = s.angle - Math.PI / 2;
      expect(Math.abs(Math.atan2(Math.sin(out - facing), Math.cos(out - facing)))).toBeLessThan(0.1);
    }
  });

  it('puts the gems on a square, lying along its sides, corners diagonal', () => {
    for (let seed = 1; seed < 20; seed++) {
      const gems = frameSlots(SPEC, new Rng(seed)).filter((s) => s.kind === 'gem');
      for (const g of gems) {
        // On the square of half-size `band`, give or take the hand-placed jitter.
        expect(Math.abs(Math.max(Math.abs(g.x), Math.abs(g.y)) - SPEC.band)).toBeLessThan(0.06);
        expect(Math.abs(g.angle)).toBeLessThanOrEqual(Math.PI / 2 + 1e-9);
        expect(g.length).toBeGreaterThan(SPEC.gemLength * 0.85);
        expect(g.length).toBeLessThan(SPEC.gemLength * 1.15);
        const corner = Math.abs(Math.abs(g.x) - Math.abs(g.y)) < 0.15;
        if (corner) expect(offAxis(g.angle, Math.PI / 4) < 0.2 || offAxis(g.angle, -Math.PI / 4) < 0.2).toBe(true);
        else if (Math.abs(g.y) > Math.abs(g.x)) expect(offAxis(g.angle, 0)).toBeLessThanOrEqual(SPEC.jitter + 1e-9);
        else expect(offAxis(g.angle, Math.PI / 2)).toBeLessThanOrEqual(SPEC.jitter + 1e-9);
      }
    }
  });

  it('is the same frame for the same seed', () => {
    expect(frameSlots(SPEC, new Rng(42))).toEqual(frameSlots(SPEC, new Rng(42)));
    expect(frameSlots(SPEC, new Rng(42))).not.toEqual(frameSlots(SPEC, new Rng(43)));
  });
});

describe('gem tunnel zoom', () => {
  const tunnel = (): ZoomTunnel => new ZoomTunnel({ frames: 4, ratio: 0.66, twist: 0.09, nearCut: 0.45, nearFade: 0.6, farFade: 1.1 });

  it('keeps the frames one level apart while they come nearer and come round', () => {
    const t = tunnel();
    const before = [0, 1, 2, 3].map((k) => t.level(k));
    expect(before).toEqual([0, 1, 2, 3]);
    t.advance(0.1);
    const after = [0, 1, 2, 3].map((k) => t.level(k));
    // Every frame moved 0.4 levels nearer; frame 0 passed the viewer and is back far away.
    expect(after[1]).toBeCloseTo(0.6);
    expect(after[3]).toBeCloseTo(2.6);
    expect(after[0]).toBeCloseTo(3.6);
    const sorted = [...after].sort((a, b) => a - b);
    for (let i = 1; i < 4; i++) expect(sorted[i]! - sorted[i - 1]!).toBeCloseTo(1);
    t.advance(0.9);
    expect([0, 1, 2, 3].map((k) => t.level(k))).toEqual(before.map((u) => expect.closeTo(u, 9)));
  });

  it('shrinks and turns each farther frame by the same step', () => {
    const t = tunnel();
    expect(t.scale(0)).toBe(1);
    expect(t.scale(2) / t.scale(1)).toBeCloseTo(0.66);
    expect(t.turn(3) - t.turn(2)).toBeCloseTo(0.09);
  });

  it('fades frames in at the vanishing point and out before they grow huge', () => {
    const t = tunnel();
    expect(t.fade(0)).toBe(0);
    expect(t.fade(0.45)).toBe(0);
    expect(t.fade(1.5)).toBe(1);
    expect(t.fade(4)).toBe(0);
    expect(t.fade(3.5)).toBeGreaterThan(0);
    expect(t.fade(3.5)).toBeLessThan(1);
    // Receding cuts the nearest frames first.
    expect(t.fade(1.5, 2)).toBe(0);
    expect(t.fade(3.2, 2)).toBeGreaterThan(0);
  });
});

describe('gem tunnel looks', () => {
  const THEMES: ThemeId[] = ['nursery', 'roots', 'chamber', 'surface', 'hill', 'forest', 'ride', 'sun', 'clearing', 'dorm', 'mech', 'office'];

  it('gives every theme a subtle, slow background in painted pastel hues', () => {
    for (const theme of THEMES) {
      const look = warpLook(theme);
      expect(look.alpha).toBeGreaterThan(0);
      expect(look.alpha).toBeLessThanOrEqual(0.2);
      expect(look.speed).toBeLessThanOrEqual(0.15);
      // A modest sprite budget: frames of gems, plus four ribs a frame.
      const frames = Math.round(look.count / (look.perRing ?? 12));
      expect(frames * ((look.perRing ?? 12) + 4)).toBeLessThanOrEqual(64);
      const hues = huesOf(look);
      expect(new Set(hues).size).toBeGreaterThanOrEqual(4);
      for (const h of hues) expect(GEM_HUES).toContain(h);
      expect(look.colors.length).toBeGreaterThan(0);
    }
  });

  it('paints looks without hues in the pastels nearest to their colours', () => {
    expect(nearestGemHue(0x548cd6)).toBe('sky');
    expect(nearestGemHue(0x53bfaf)).toBe('mint');
    expect(nearestGemHue(0xef9a47)).toBe('peach');
    expect(nearestGemHue(0x9459d8)).toBe('lilac');
    expect(nearestGemHue(0x808080)).toBe('lilac');
    expect(huesOf({ count: 48, alpha: 1, speed: 0.3, colors: [0x548cd6, 0x53bfaf, 0xef9a47, 0x9459d8] })).toEqual(['sky', 'mint', 'peach', 'lilac']);
    expect(huesOf({ count: 48, alpha: 1, speed: 0.3, colors: [0x808080] })).toEqual(GEM_HUES);
  });

  it('keeps the gem swatches pastel: light, with a darker rim', () => {
    const lum = (hex: string): number => {
      const n = parseInt(hex.slice(1), 16);
      return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
    };
    for (const hue of GEM_HUES) {
      const sw = GEM_SWATCHES[hue];
      expect(lum(sw.base)).toBeGreaterThan(0.6);
      expect(lum(sw.light)).toBeGreaterThan(lum(sw.base));
      expect(lum(sw.rim)).toBeLessThan(lum(sw.base));
    }
  });
});
