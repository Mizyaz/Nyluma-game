import { describe, expect, it, vi } from 'vitest';

// The paper engine's geometry and lamps (src/paper). Phaser needs a browser;
// the lighting only keeps two of its matrices, so a stand-in is enough here.
vi.mock('phaser', () => ({ GameObjects: { Components: { TransformMatrix: class {} } } }));

import { Lens, type Framing } from '../../src/paper/lens';
import { Lighting, WHIMSICAL, type Mood } from '../../src/paper/light';

const FRAMING: Framing = { span: 480, dist: 900, height: 230, feet: 0.82 };
const FLOOR = 600;

function lens(w = 2340, h = 1080, zoom = 1): Lens {
  const l = new Lens();
  l.frame(w, h, FRAMING, FLOOR, zoom);
  l.eye.x = 500;
  return l;
}

describe('paper lens', () => {
  it('finds every point again where it showed', () => {
    const l = lens();
    for (const z of [-300, -40, 0, 60, 170]) {
      const s = l.project(123, 456, z);
      const p = l.unproject(s.x, s.y, z);
      expect(p.x).toBeCloseTo(123, 9);
      expect(p.y).toBeCloseTo(456, 9);
    }
  });

  it('keeps a card facing the viewer exactly in shape: one scale, verticals upright', () => {
    const l = lens();
    for (const z of [-250, 0, 120]) {
      const a = l.project(300, 200, z);
      const b = l.project(380, 200, z);
      const c = l.project(300, 290, z);
      expect(b.x - a.x).toBeCloseTo(80 * l.scale(z), 9);
      expect(b.y).toBeCloseTo(a.y, 9);
      expect(c.x).toBeCloseTo(a.x, 9);
      expect(c.y - a.y).toBeCloseTo(90 * l.scale(z), 9);
    }
  });

  it('shows the farther smaller', () => {
    const l = lens();
    expect(l.scale(-300)).toBeLessThan(l.scale(0));
    expect(l.scale(0)).toBeLessThan(l.scale(170));
  });

  it('puts the floor line at the actors’ plane where the framing says, at its span', () => {
    for (const [w, h, zoom] of [
      [2340, 1080, 1],
      [1080, 2340, 1],
      [1280, 720, 1.4],
    ] as const) {
      const l = lens(w, h, zoom);
      expect(l.project(500, FLOOR, 0).y).toBeCloseTo(FRAMING.feet * h, 6);
      expect(l.scale(0)).toBeCloseTo((h / FRAMING.span) * zoom, 9);
      expect(l.eye.y).toBe(FLOOR - FRAMING.height);
      // The eye's own x is the middle of the picture.
      expect(l.project(l.eye.x, 0, -100).x).toBeCloseTo(w / 2, 9);
    }
  });
});

describe('paper lamps', () => {
  const eye = { x: 1000, floor: FLOOR };
  const plain: Mood = { ...WHIMSICAL, key: undefined };

  it('throws a figure’s shadow from the key light, which leads the eye', () => {
    const lit = new Lighting(WHIMSICAL);
    lit.update(1 / 60, eye);
    const out = { x: 0, y: 0, z: 0, k: 0 };
    lit.casterAt(1000, FLOOR - 60, 0, out);
    const key = WHIMSICAL.key!;
    expect(out.k).toBeGreaterThan(0);
    expect(out.x).toBe(eye.x + (key.lead ?? 0));
    expect(out.y).toBe(FLOOR - key.above);
    expect(out.z).toBe(key.z);
  });

  it('takes the strongest lamp above the figure, and never a glow that casts none', () => {
    const lit = new Lighting(plain);
    lit.add({ x: 900, y: 300, z: 100, color: 0xffffff, intensity: 0.3, radius: 900 });
    lit.add({ x: 1100, y: 320, z: 80, color: 0xffffff, intensity: 0.9, radius: 900 });
    // A crystal's glow at the figure's side, very bright, and a lamp below its middle.
    lit.add({ x: 1010, y: 560, z: 0, color: 0xffffff, intensity: 3, radius: 900, cast: false });
    lit.add({ x: 1000, y: 590, z: 40, color: 0xffffff, intensity: 3, radius: 900 });
    lit.update(1 / 60, eye);
    const out = { x: 0, y: 0, z: 0, k: 0 };
    lit.casterAt(1000, FLOOR - 60, 0, out);
    expect(out.x).toBe(1100);
    expect(out.y).toBe(320);
  });

  it('finds no lamp for a figure out of every reach', () => {
    const lit = new Lighting(plain);
    lit.add({ x: 0, y: 0, z: 0, color: 0xffffff, intensity: 1, radius: 200 });
    lit.update(1 / 60, eye);
    const out = { x: 0, y: 0, z: 0, k: 1 };
    lit.casterAt(5000, FLOOR - 60, 0, out);
    expect(out.k).toBe(0);
  });
});
