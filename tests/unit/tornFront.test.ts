import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { buildTornFront, TORN_THEMES, type TornFrontSpec } from '../../src/game/stage/tornFront';

// The torn front of a room's box (stage/tornFront.ts): the hole always
// clears the rectangles it is asked to keep open, and a seed always tears
// the same paper.

const ROOM: TornFrontSpec = {
  x0: 0,
  x1: 2600,
  top: 0,
  bottom: 900,
  z: 140,
  // The walkable band with its headroom, and a close-up spot above it.
  keepOpen: [
    { x: 110, y: 400, w: 2380, h: 390 },
    { x: 1500, y: 250, w: 260, h: 160 },
  ],
  ...TORN_THEMES.chapter1,
  seed: 7,
};

type Tri = [number, number, number, number, number, number];

/** Keep-open points (game px, y down) that some paper covers, as seen from the front. */
function coveredPoints(spec: TornFrontSpec): [number, number][] {
  const tf = buildTornFront(spec);
  // Every triangle of every mesh, bucketed on a coarse grid (x, y up).
  const cell = 64;
  const grid = new Map<string, Tri[]>();
  tf.group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const p = mesh.geometry.getAttribute('position');
    const idx = mesh.geometry.getIndex()!;
    for (let i = 0; i < idx.count; i += 3) {
      const [a, b, c] = [idx.getX(i), idx.getX(i + 1), idx.getX(i + 2)];
      const t: Tri = [p.getX(a), p.getY(a), p.getX(b), p.getY(b), p.getX(c), p.getY(c)];
      for (let gx = Math.floor(Math.min(t[0], t[2], t[4]) / cell); gx <= Math.floor(Math.max(t[0], t[2], t[4]) / cell); gx++) {
        for (let gy = Math.floor(Math.min(t[1], t[3], t[5]) / cell); gy <= Math.floor(Math.max(t[1], t[3], t[5]) / cell); gy++) {
          const key = `${gx},${gy}`;
          grid.set(key, [...(grid.get(key) ?? []), t]);
        }
      }
    }
  });
  tf.dispose();
  const covers = ([ax, ay, bx, by, cx, cy]: Tri, x: number, y: number): boolean => {
    if (Math.abs((bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) < 1e-6) return false;
    const d1 = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
    const d2 = (cx - bx) * (y - by) - (cy - by) * (x - bx);
    const d3 = (ax - cx) * (y - cy) - (ay - cy) * (x - cx);
    return (d1 >= 0 && d2 >= 0 && d3 >= 0) || (d1 <= 0 && d2 <= 0 && d3 <= 0);
  };
  const hits: [number, number][] = [];
  const test = (x: number, y: number): void => {
    const list = grid.get(`${Math.floor(x / cell)},${Math.floor(-y / cell)}`) ?? [];
    if (list.some((t) => covers(t, x, -y))) hits.push([x, y]);
  };
  for (const r of spec.keepOpen) {
    // Densely along the edges, where the paper comes closest, and a grid inside.
    for (let s = 0; s <= 1; s += 2 / (r.w + r.h)) {
      test(r.x + s * r.w, r.y);
      test(r.x + s * r.w, r.y + r.h);
      test(r.x, r.y + s * r.h);
      test(r.x + r.w, r.y + s * r.h);
    }
    for (let x = r.x; x <= r.x + r.w; x += 17) for (let y = r.y; y <= r.y + r.h; y += 17) test(x, y);
  }
  return hits;
}

function positions(spec: TornFrontSpec): number[][] {
  const tf = buildTornFront(spec);
  const out: number[][] = [];
  tf.group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) out.push(Array.from(mesh.geometry.getAttribute('position').array));
  });
  tf.dispose();
  return out;
}

describe('torn front', () => {
  it('never covers a point it is asked to keep open', () => {
    const cases: TornFrontSpec[] = [
      ROOM,
      { ...ROOM, quality: 'low', seed: 3 },
      // A band running past both ends of the box splits the paper in two.
      { ...ROOM, seed: 11, keepOpen: [{ x: -50, y: 380, w: 2700, h: 400 }] },
      { ...ROOM, seed: 12, quality: 'low', keepOpen: [{ x: 0, y: 420, w: 2600, h: 360 }] },
      // A small room, a tall close-up and nothing asked at all.
      { ...ROOM, x1: 1200, bottom: 700, seed: 5, keepOpen: [{ x: 60, y: 300, w: 1080, h: 330 }] },
      { ...ROOM, seed: 9, keepOpen: [{ x: 900, y: 80, w: 300, h: 700 }] },
      { ...ROOM, seed: 21, keepOpen: [] },
    ];
    for (const spec of cases) {
      for (let seed = spec.seed; seed < spec.seed + 3; seed++) expect(coveredPoints({ ...spec, seed })).toEqual([]);
    }
  });

  it('tears the same paper for the same seed, and other paper for another', () => {
    expect(positions(ROOM)).toEqual(positions(ROOM));
    expect(positions({ ...ROOM, seed: 8 })).not.toEqual(positions(ROOM));
  });

  it('stays within z .. z + 40 and lean, and dispose() frees what it made', () => {
    for (const quality of ['high', 'low'] as const) {
      const tf = buildTornFront({ ...ROOM, quality });
      const box = new THREE.Box3().setFromObject(tf.group, true);
      expect(box.min.z).toBeGreaterThanOrEqual(ROOM.z - 1e-3);
      expect(box.max.z).toBeLessThanOrEqual(ROOM.z + 40);
      expect(tf.stats!.vertices).toBeLessThan(quality === 'high' ? 5000 : 1800);
      const resources = new Set<THREE.EventDispatcher<{ dispose: object }>>();
      tf.group.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        for (const r of [mesh.geometry, mat, mat.map, mat.bumpMap, mat.alphaMap]) if (r) resources.add(r);
      });
      const freed = new Set<unknown>();
      for (const r of resources) r.addEventListener('dispose', () => freed.add(r));
      tf.dispose();
      expect(freed.size).toBe(resources.size);
      expect(tf.group.children.length).toBe(0);
    }
  });
});
