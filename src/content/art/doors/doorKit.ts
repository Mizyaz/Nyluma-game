import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { nextId, poly, Rng, smooth, type Pt } from '../../../render/2d/svg';
import { comic, ink } from '../../characters/kit';

// Small pieces the doorways' walls are dressed with (art in wallKit.ts and
// each door's file): stars, twinkles, sleepy faces, roots, crystals, tufts,
// painted glows, crescents. Light comes from the upper right: cel shadows
// low left, glints high right, a little hatching in the shadows, contours
// in a darker tone of their own fill.

const r2 = (n: number): number => Math.round(n * 100) / 100;

/** A five-pointed star (a paper star, a doodle). */
export function starPts(cx: number, cy: number, r: number, inner = 0.48, rot = 0, n = 5): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i * Math.PI) / n - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * inner;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

/** A four-pointed twinkle. */
export function twinkle(cx: number, cy: number, r: number, fill: string, line: number = LINE.fine): string {
  const k = r * 0.22;
  const d = `M${r2(cx)} ${r2(cy - r)}Q${r2(cx + k)} ${r2(cy - k)} ${r2(cx + r)} ${r2(cy)}Q${r2(cx + k)} ${r2(cy + k)} ${r2(cx)} ${r2(cy + r)}Q${r2(cx - k)} ${r2(cy + k)} ${r2(cx - r)} ${r2(cy)}Q${r2(cx - k)} ${r2(cy - k)} ${r2(cx)} ${r2(cy - r)}Z`;
  return `<path d="${d}" fill="${fill}" stroke="${lineFor(fill)}" stroke-width="${line}" stroke-linejoin="round"/>`;
}

/** A dashed ink line (a "cut here" line). */
export function dashed(d: string, color: string, w: number, dash = '4 3'): string {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** A little sleepy or awake face: eyes (closed arcs, or dots with a glint) and a mouth. */
export function face(cx: number, cy: number, s: number, color: string, awake: boolean, o: { cheeks?: string; mouth?: 'smile' | 'o' | 'none' } = {}): string {
  let out = '';
  const ex = s * 0.42;
  if (awake) {
    for (const sx of [-1, 1]) {
      out += `<ellipse cx="${r2(cx + sx * ex)}" cy="${r2(cy)}" rx="${r2(s * 0.15)}" ry="${r2(s * 0.21)}" fill="${color}"/>`;
      out += `<circle cx="${r2(cx + sx * ex + s * 0.05)}" cy="${r2(cy - s * 0.08)}" r="${r2(s * 0.06)}" fill="#fffaf2"/>`;
    }
  } else {
    for (const sx of [-1, 1]) out += ink(`M${r2(cx + sx * ex - s * 0.17)} ${r2(cy - s * 0.02)}Q${r2(cx + sx * ex)} ${r2(cy + s * 0.14)} ${r2(cx + sx * ex + s * 0.17)} ${r2(cy - s * 0.02)}`, Math.max(0.7, s * 0.075), color);
  }
  if (o.cheeks) for (const sx of [-1, 1]) out += `<ellipse cx="${r2(cx + sx * s * 0.68)}" cy="${r2(cy + s * 0.22)}" rx="${r2(s * 0.17)}" ry="${r2(s * 0.1)}" fill="${o.cheeks}" opacity="0.75"/>`;
  const m = o.mouth ?? 'smile';
  if (m === 'smile') out += ink(`M${r2(cx - s * 0.16)} ${r2(cy + s * 0.27)}Q${r2(cx)} ${r2(cy + (awake ? 0.45 : 0.36) * s)} ${r2(cx + s * 0.16)} ${r2(cy + s * 0.27)}`, Math.max(0.65, s * 0.065), color);
  else if (m === 'o') out += `<ellipse cx="${r2(cx)}" cy="${r2(cy + s * 0.33)}" rx="${r2(s * 0.09)}" ry="${r2(s * 0.12)}" fill="${color}"/>`;
  return out;
}

/** A tapered root along points (a thin wrapper so the pages read alike). */
export function smoothTaper(pts: Pt[], w0: number, w1: number): string {
  const left: Pt[] = [];
  const right: Pt[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(pts.length - 1, i + 1)]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / (pts.length - 1))) / 2;
    left.push([p[0] - (dy / l) * w, p[1] + (dx / l) * w]);
    right.push([p[0] + (dy / l) * w, p[1] - (dx / l) * w]);
  });
  return smooth([...left, ...right.reverse()], 0.9);
}

/** Offsets a polyline sideways by `by` px (positive: to its left as drawn on the screen). */
export function offsetLine(pts: readonly Pt[], by: number): Pt[] {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(pts.length - 1, i + 1)]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [p[0] + (dy / l) * by, p[1] - (dx / l) * by];
  });
}

/**
 * A root along a polyline, tapering from w0 to w1, in the comic manner:
 * shaded low left, a glint high right, bark grooves running with it in its
 * own dark tone.
 */
export function barkRoot(pts: readonly Pt[], w0: number, w1: number, fill: string, seed: number, o: { grooves?: number; line?: number } = {}): string {
  const rng = new Rng(seed);
  const d = smoothTaper([...pts], w0, w1);
  let over = '';
  const n = o.grooves ?? (w0 > 9 ? 3 : w0 > 5 ? 2 : 0);
  for (let i = 0; i < n; i++) {
    const lane = n === 1 ? 0 : (i / (n - 1) - 0.5) * 0.5;
    const from = Math.floor(rng.range(0, pts.length * 0.3));
    const to = Math.min(pts.length, from + Math.max(2, Math.ceil(pts.length * rng.range(0.4, 0.7))));
    const seg = pts.slice(from, to);
    if (seg.length < 2) continue;
    const w = w0 + (w1 - w0) * ((from + to) / 2 / Math.max(1, pts.length - 1));
    over += ink(smooth(offsetLine(seg, lane * w + rng.range(-0.5, 0.5)), 1, false), Math.max(0.5, Math.min(0.9, w * 0.08)), darkOf(fill, 0.45));
  }
  const sz = Math.max(w0, w1);
  return comic(d, fill, {
    line: o.line ?? (sz > 14 ? LINE.limb : sz > 7 ? LINE.small : LINE.detail),
    rim: [Math.max(1, sz * 0.22), -Math.max(0.5, sz * 0.09)],
    glint: [-Math.max(0.5, sz * 0.07), Math.max(0.5, sz * 0.07)],
    hatch: sz > 14 ? 2.3 : 0,
    hatchWidth: 0.5,
    over,
  });
}

/** A crystal: a faceted shard standing at (x, 0)-ish, pointing along `ang` (radians, −π/2 = up). */
export function shard(x: number, y: number, len: number, w: number, ang: number, fill: string): string {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const P = (u: number, v: number): Pt => [x + u * c - v * s, y + u * s + v * c];
  const d = poly([P(-2, -w * 0.5), P(len * 0.62, -w * 0.55), P(len, 0), P(len * 0.62, w * 0.5), P(-2, w * 0.48)]);
  const facet = `M${r2(P(0, -w * 0.05)[0])} ${r2(P(0, -w * 0.05)[1])}L${r2(P(len * 0.97, 0)[0])} ${r2(P(len * 0.97, 0)[1])}`;
  return comic(d, fill, { line: len > 20 ? LINE.small : LINE.detail, rim: [Math.max(0.8, w * 0.22), -Math.max(0.4, w * 0.1)], glint: [-0.6, 0.6], over: ink(facet, 0.6, lightOf(fill, 0.55)) });
}

/** A cluster of crystals growing from a point on the ground. */
export function crystals(x: number, y: number, size: number, fills: readonly string[], seed: number, spread = 0.9): string {
  const rng = new Rng(seed);
  const n = 3 + Math.floor(rng.range(0, 3));
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => Math.abs(b - (n - 1) / 2) - Math.abs(a - (n - 1) / 2));
  let s = '';
  for (const i of order) {
    const u = n === 1 ? 0 : i / (n - 1) - 0.5;
    const ang = -Math.PI / 2 + u * spread + rng.range(-0.12, 0.12);
    const len = size * (1 - Math.abs(u) * 0.8) * rng.range(0.85, 1.1);
    s += shard(x + u * size * 0.35, y + 2, len, Math.max(3, len * 0.36), ang, fills[i % fills.length]!);
  }
  return s;
}

/** A tuft of moss or grass (blades fanning up). */
export function tuft(x: number, y: number, size: number, fill: string, seed: number): string {
  const rng = new Rng(seed);
  let d = `M${r2(x - size * 0.6)} ${r2(y)}`;
  const n = 5;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const bx = x - size * 0.6 + u * size * 1.2;
    const tx = bx + (u - 0.5) * size * 0.5 + rng.range(-1, 1);
    const ty = y - size * (0.6 + rng.range(0, 0.5)) * (1 - Math.abs(u - 0.5) * 0.6);
    d += `Q${r2(bx - 1)} ${r2(y - size * 0.3)} ${r2(tx)} ${r2(ty)}Q${r2(bx + 1)} ${r2(y - size * 0.3)} ${r2(bx + (size * 1.2) / n / 2)} ${r2(y)}`;
  }
  d += 'Z';
  return comic(d, fill, { line: LINE.fine, rim: [1, -0.5] });
}

/** A soft disc of light (a radial gradient fading out), for glows painted into the art. */
export function glowDisc(cx: number, cy: number, r: number, color: string, opacity = 1): string {
  const id = nextId('dg');
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${r2(opacity)}"/><stop offset="0.45" stop-color="${color}" stop-opacity="${r2(opacity * 0.55)}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="url(#${id})"/>`;
}

/**
 * A crescent moon of radius `r` round (cx, cy), its belly to the left and
 * its horns to the right (`flip` turns it round); `k` (> 1) thins it.
 */
export function crescent(cx: number, cy: number, r: number, k = 1.3, flip = false): string {
  const top = `${r2(cx)} ${r2(cy - r)}`;
  const bottom = `${r2(cx)} ${r2(cy + r)}`;
  return `M${top}A${r2(r)} ${r2(r)} 0 1 ${flip ? 1 : 0} ${bottom}A${r2(r * k)} ${r2(r * k)} 0 0 ${flip ? 0 : 1} ${top}Z`;
}
