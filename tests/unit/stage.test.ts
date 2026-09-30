import { describe, expect, it } from 'vitest';
import { bandZ, offAxis, phaserScreen, pinAt, placeScrolled, projectToPlane, restCentre, scrollDepth, viewRect, type CamState } from '../../src/game/stage/depth';

// The diorama must look exactly like the flat game from the middle of the
// view: layers at the depth their scroll factor implies, pinned things where
// Phaser draws them, and a frustum through the camera's view on z = 0.

const D = 900;
const O = { x: 640, y: 360 };

/** A Phaser camera: zoom about the view's centre, scrolled, maybe shaken. */
function cam(zoom: number, scrollX: number, scrollY: number, shakeX = 0, shakeY = 0): CamState {
  return { a: zoom, d: zoom, e: O.x - O.x * zoom + shakeX, f: O.y - O.y * zoom + shakeY, scrollX, scrollY, w: 1280, h: 720 };
}

/** Where a 3D point shows on screen, seen from the resting eye in front of the view's centre. */
function screenOf(c: CamState, x: number, y: number, z: number): [number, number] {
  const [ex, ey] = restCentre(c);
  const [px, py] = projectToPlane(x, y, z, ex, ey, D);
  return phaserScreen(c, px, py);
}

const CAMS = [cam(1.5, 0, 300), cam(1.5, 873, 412, 3, -2), cam(3.8, 180, 480), cam(1, 2200, 0), cam(1.12, 5400, 330)];

describe('diorama geometry', () => {
  it('puts a parallax layer where it scrolls exactly as its scroll factor says', () => {
    for (const s of [0.05, 0.2, 0.45, 0.7, 0.85, 1.35]) {
      for (const c of CAMS) {
        for (const [x, y] of [
          [0, 0],
          [733, 128],
          [2400, 900],
        ] as const) {
          const p = placeScrolled(x, y, s, D, O.x, O.y);
          const [sx, sy] = screenOf(c, p.x, p.y, p.z);
          const [fx, fy] = phaserScreen(c, x, y, s, s);
          expect(sx).toBeCloseTo(fx, 6);
          expect(sy).toBeCloseTo(fy, 6);
        }
      }
    }
  });

  it('keeps a layer the same size on screen as in the flat game', () => {
    const p = placeScrolled(100, 50, 0.2, D, O.x, O.y);
    const q = placeScrolled(300, 50, 0.2, D, O.x, O.y);
    const c = cam(1.5, 400, 300);
    expect(screenOf(c, q.x, q.y, q.z)[0] - screenOf(c, p.x, p.y, p.z)[0]).toBeCloseTo(200 * 1.5, 6);
  });

  it('pins screen-bound things (scroll factor 0, or different across and down) where Phaser draws them', () => {
    for (const [sx, sy] of [
      [0, 0],
      [1.35, 0],
      [1, 0.4],
    ] as const) {
      for (const c of CAMS) {
        const z = -300;
        const [cx, cy] = restCentre(c);
        const p = pinAt(500, 700, sx, sy, z, D, c.scrollX, c.scrollY, cx, cy);
        const [x, y] = screenOf(c, p.x, p.y, z);
        const [fx, fy] = phaserScreen(c, 500, 700, sx, sy);
        expect(x).toBeCloseTo(fx, 6);
        expect(y).toBeCloseTo(fy, 6);
      }
    }
  });

  it('frames the camera view on the actors plane with an off-axis frustum', () => {
    for (const c of CAMS) {
      const r = viewRect(c);
      // Corners of the view show at the corners of the screen.
      expect(phaserScreen(c, r.x0, r.y0)).toEqual([expect.closeTo(0, 6), expect.closeTo(0, 6)]);
      expect(phaserScreen(c, r.x1, r.y1)).toEqual([expect.closeTo(1280, 6), expect.closeTo(720, 6)]);
      // An eye off the centre (above it, behind it): the frustum still passes through the view on z = 0.
      const ex = (r.x0 + r.x1) / 2 - 37;
      const ey = r.y0 + (r.y1 - r.y0) * 0.16;
      const near = 180;
      const f = offAxis(r, ex, ey, D, near);
      expect(ex + (f.left * D) / near).toBeCloseTo(r.x0, 6);
      expect(ex + (f.right * D) / near).toBeCloseTo(r.x1, 6);
      expect(ey - (f.top * D) / near).toBeCloseTo(r.y0, 6);
      expect(ey - (f.bottom * D) / near).toBeCloseTo(r.y1, 6);
    }
  });

  it('keeps the flat game\'s draw order in depth, and far layers behind the box', () => {
    const depths = [-1000, -900, -100, -60, -50, -45, -20, -5, 0, 5, 10, 12, 20, 27, 30, 37, 40, 41, 50, 60, 80, 100];
    for (let i = 1; i < depths.length; i++) expect(bandZ(depths[i]!)).toBeGreaterThanOrEqual(bandZ(depths[i - 1]!));
    // The actors walk on z = 0.
    expect(bandZ(30)).toBe(0);
    expect(scrollDepth(0.7, D)).toBeLessThan(bandZ(-100));
    expect(scrollDepth(1.35, D)).toBeGreaterThan(0);
    expect(scrollDepth(1, D)).toBe(0);
    // A shaken camera shakes every depth alike (the eye stays put).
    const shaken = cam(1.5, 400, 300, 4, -3);
    const still = cam(1.5, 400, 300);
    const p = placeScrolled(90, 80, 0.2, D, O.x, O.y);
    const a = screenOf(shaken, p.x, p.y, p.z);
    const b = screenOf(still, p.x, p.y, p.z);
    expect(a[0] - b[0]).toBeCloseTo(4, 6);
    expect(a[1] - b[1]).toBeCloseTo(-3, 6);
  });
});
