import type { PartArt } from '../../../render/2d/rig/rigTypes';
import { darkOf, lightOf, LINE, lineFor, SHADE } from '../../../render/2d/style';
import { nextId, poly, rrect, Rng, smooth, type Pt } from '../../../render/2d/svg';
import { comic, ink, part, type Box } from '../../characters/kit';

// Drawing kit for the doorways (src/render/2d/fx/doorway.ts). A doorway is
// drawn in its own frame: the foot of the door, the middle of its
// threshold, at 0,0; x across, y up negative, in world px. Its parts are
// pressed at the depth they stand at, so they are drawn at their size in
// the world. Light comes from the upper right: cel shadows low left,
// glints high right, a little hatching in the shadows, contours in a
// darker tone of their own fill.

const r2 = (n: number): number => Math.round(n * 100) / 100;

/** A part drawn in door coordinates over `box` (the pivot is the door's foot). */
export function doorPart(key: string, box: Box, body: string, extra: Partial<PartArt> = {}): PartArt {
  return part(key, box, (ox, oy) => `<g transform="translate(${r2(ox)} ${r2(oy)})">${body}</g>`, extra);
}

/**
 * A leaf (a door, a flap) drawn from its top left corner, `w` × `h`; the
 * doorway reads its size from the part (see `DoorLeaf`).
 */
export function leafPart(key: string, w: number, h: number, body: string): PartArt {
  return doorPart(key, { x0: 0, y0: 0, x1: w, y1: h }, body);
}

/**
 * An arched opening `w` wide and `h` high standing on the floor: straight
 * jambs, then a top `rise` high (a half ellipse; default a round arch).
 * `peak` lifts the middle into an onion's point; `lean` tips the top.
 * Points run from the foot of the left jamb over the top to the right one.
 */
export function archPts(w: number, h: number, o: { rise?: number; peak?: number; n?: number; lean?: number } = {}): Pt[] {
  const r = w / 2;
  const rise = Math.min(o.rise ?? r, h);
  const spring = -(h - rise);
  const n = o.n ?? 28;
  const pts: Pt[] = [[-r, 0]];
  if (spring < -0.5) pts.push([-r, spring]);
  for (let i = 1; i < n; i++) {
    const t = Math.PI - (i / n) * Math.PI;
    const c = Math.cos(t);
    let y = spring - rise * Math.sin(t);
    if (o.peak) y -= o.peak * Math.pow(Math.max(0, 1 - Math.abs(c) * 1.45), 2.2);
    pts.push([r * c + (o.lean ?? 0) * Math.sin(t), y]);
  }
  if (spring < -0.5) pts.push([r, spring]);
  pts.push([r, 0]);
  return pts;
}

/** Signed area (positive: clockwise on the screen, y down). */
export function area(p: readonly Pt[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i]!;
    const b = p[(i + 1) % p.length]!;
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
}

/** A shape with holes: the outline clockwise, each hole the other way round (cut out with the default fill rule). */
export function holed(outer: readonly Pt[], holes: readonly (readonly Pt[])[], o: { smoothOuter?: boolean; smoothHoles?: boolean } = {}): string {
  const cw = (p: readonly Pt[]): Pt[] => (area(p) > 0 ? [...p] : [...p].reverse());
  const ccw = (p: readonly Pt[]): Pt[] => (area(p) > 0 ? [...p].reverse() : [...p]);
  let d = o.smoothOuter ? smooth(cw(outer)) : poly(cw(outer));
  for (const h of holes) d += o.smoothHoles ? smooth(ccw(h)) : poly(ccw(h));
  return d;
}

/** The outline grown outward by `by` px (along the corners' bisectors; for gentle shapes). */
export function grow(p: readonly Pt[], by: number): Pt[] {
  const s = area(p) > 0 ? 1 : -1;
  return p.map((c, i) => {
    const a = p[(i - 1 + p.length) % p.length]!;
    const b = p[(i + 1) % p.length]!;
    const t1 = norm([c[0] - a[0], c[1] - a[1]]);
    const t2 = norm([b[0] - c[0], b[1] - c[1]]);
    // Outward normals of the two edges (clockwise on screen: (ty, -tx)).
    const n1: Pt = [t1[1] * s, -t1[0] * s];
    const n2: Pt = [t2[1] * s, -t2[0] * s];
    const m = norm([n1[0] + n2[0], n1[1] + n2[1]]);
    const k = 1 / Math.max(0.35, m[0] * n1[0] + m[1] * n1[1]);
    return [c[0] - m[0] * by * k, c[1] - m[1] * by * k];
  });
}

const norm = (v: Pt): Pt => {
  const l = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / l, v[1] / l];
};

/** Points along a polyline every `step` px (the corners kept). */
export function resample(p: readonly Pt[], step: number, closed = true): Pt[] {
  const out: Pt[] = [];
  const n = closed ? p.length : p.length - 1;
  for (let i = 0; i < n; i++) {
    const a = p[i]!;
    const b = p[(i + 1) % p.length]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.max(1, Math.round(len / step));
    for (let j = 0; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k]);
  }
  if (!closed) out.push(p[p.length - 1]!);
  return out;
}

/** A torn (deckled) paper edge: the outline resampled and nudged in and out. */
export function deckle(p: readonly Pt[], amp: number, seed: number, step = 3.2): Pt[] {
  const rng = new Rng(seed);
  const pts = resample(p, step);
  return pts.map((c, i) => {
    const a = pts[(i - 1 + pts.length) % pts.length]!;
    const b = pts[(i + 1) % pts.length]!;
    const t = norm([b[0] - a[0], b[1] - a[1]]);
    const k = rng.range(-amp, amp) * (rng.chance(0.12) ? 1.8 : 1);
    return [c[0] + t[1] * k, c[1] - t[0] * k];
  });
}

/** A point on a closed polyline at fraction u of its length. */
export function along(p: readonly Pt[], u: number): { at: Pt; dir: Pt } {
  const lens: number[] = [];
  let total = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i]!;
    const b = p[(i + 1) % p.length]!;
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    lens.push(l);
    total += l;
  }
  let d = (((u % 1) + 1) % 1) * total;
  for (let i = 0; i < p.length; i++) {
    const l = lens[i]!;
    if (d <= l || i === p.length - 1) {
      const a = p[i]!;
      const b = p[(i + 1) % p.length]!;
      const t = l > 0 ? d / l : 0;
      return { at: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], dir: norm([b[0] - a[0], b[1] - a[1]]) };
    }
    d -= l;
  }
  return { at: p[0]!, dir: [1, 0] };
}

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

/** A soft rounded star path (the corners eased). */
export function softStar(cx: number, cy: number, r: number, inner = 0.5, rot = 0): string {
  return smooth(starPts(cx, cy, r, inner, rot), 0.45);
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

/** A plain fill (no contour). */
export function fillP(d: string, color: string, opacity = 1): string {
  return `<path d="${d}" fill="${color}"${opacity !== 1 ? ` opacity="${opacity}"` : ''}/>`;
}

/** A circle path. */
export function circleP(cx: number, cy: number, r: number): string {
  return `M${r2(cx - r)} ${r2(cy)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(r * 2)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-r * 2)} 0Z`;
}

/** Comic shading for a big flat thing standing in the light (paper, wood, stone). */
export function slab(d: string, fill: string, o: { rim?: number; hatch?: boolean; inner?: string; over?: string; line?: number; top?: string; glint?: number } = {}): string {
  const r = o.rim ?? 5;
  const g = o.glint ?? 1.4;
  return comic(d, fill, {
    line: o.line ?? LINE.body,
    rim: [r, -r * 0.45],
    glint: [-g, g],
    hatch: o.hatch === false ? 0 : 2.6,
    hatchWidth: 0.6,
    inner: o.inner,
    over: o.over,
    top: o.top,
  });
}

/** A smaller piece (a tab, a stone, a crystal): lighter line, shading sized to it. */
export function bit(d: string, fill: string, size: number, o: { inner?: string; over?: string; top?: string; tone?: string } = {}): string {
  const r = Math.max(1, Math.min(4.5, size * 0.16));
  return comic(d, fill, {
    line: size > 24 ? LINE.limb : size > 10 ? LINE.small : LINE.detail,
    rim: [r, -r * 0.45],
    glint: [-Math.max(0.6, r * 0.3), Math.max(0.6, r * 0.3)],
    hatch: size > 30 ? 2.4 : 0,
    hatchWidth: 0.55,
    tone: o.tone,
    inner: o.inner,
    over: o.over,
    top: o.top,
  });
}

/** Hatching laid in a shape (a shadow cast into an opening, under a lintel). */
export function hatchIn(d: string, b: Box, color: string = SHADE.hatch, gap = 2.6, w = 0.6): string {
  const id = nextId('dh');
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})" style="mix-blend-mode:multiply">${hatchStrokes(b, gap, color, w)}</g>`;
}

function hatchStrokes(b: Box, gap: number, color: string, w: number): string {
  let d = '';
  const h = b.y1 - b.y0;
  for (let x = b.x0 - h; x < b.x1; x += gap) d += `M${r2(x)} ${r2(b.y1)}L${r2(x + h * 0.75)} ${r2(b.y0)}`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
}

/** A crayon-ish doodle line (a bit wobbly, rounded). */
export function crayon(pts: readonly Pt[], color: string, w = 1.1, seed = 1): string {
  const rng = new Rng(seed);
  const wob = pts.map(([x, y]) => [x + rng.range(-0.5, 0.5), y + rng.range(-0.5, 0.5)] as Pt);
  return ink(smooth(wob, 1, false), w, color, 0.9);
}

/** Hanging thread from a to b (a slight sag). */
export function thread(a: Pt, b: Pt, color: string, w = 0.6): string {
  const m: Pt = [(a[0] + b[0]) / 2 + 0.6, (a[1] + b[1]) / 2];
  return ink(`M${r2(a[0])} ${r2(a[1])}Q${r2(m[0])} ${r2(m[1])} ${r2(b[0])} ${r2(b[1])}`, w, color);
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

/** Mixes two #rrggbb colours. */
export function mix(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number): number => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}


// ---------------------------------------------------------------- shared pieces of the doorways

/** A band along an arch (from one foot over the top to the other), its outer edge scalloped. */
export function scallopBand(inner: readonly Pt[], outer: readonly Pt[], every: number, bump: number): string {
  const pts = resample(outer, every, false);
  let d = `M${r2(pts[0]![0])} ${r2(pts[0]![1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const l = Math.hypot(tx, ty) || 1;
    // Outward (the band runs clockwise on the screen).
    const c: Pt = [(a[0] + b[0]) / 2 + (ty / l) * bump * 2, (a[1] + b[1]) / 2 - (tx / l) * bump * 2];
    d += `Q${r2(c[0])} ${r2(c[1])} ${r2(b[0])} ${r2(b[1])}`;
  }
  const back = [...inner].reverse();
  for (const p of back) d += `L${r2(p[0])} ${r2(p[1])}`;
  return d + 'Z';
}

/** The sheet of a page: its wall round a hole, its floor below. */
export function page(hole: readonly Pt[], x0: number, x1: number, y0: number, y1: number, wall: string, floor: string, o: { wallOver?: string; floorOver?: string; rim?: number; edge?: string; holes?: Pt[][] } = {}): string {
  let s = '';
  // The floor between this page and the one before it.
  s += fillP(rrect(x0, -0.5, x1 - x0, y1 + 0.5, 0), floor) + (o.floorOver ?? '');
  const outer: Pt[] = [
    [x0, y0],
    [x1, y0],
    [x1, 0],
    [x0, 0],
  ];
  s += comic(holed(outer, [hole, ...(o.holes ?? [])]), wall, {
    line: 0,
    rim: [o.rim ?? 4, -(o.rim ?? 4) * 0.5],
    glint: [-1.2, 1.2],
    hatch: 2.6,
    hatchWidth: 0.55,
    over: o.wallOver,
  });
  // The hole's own edge, inked in the wall's dark tone.
  s += ink(poly(hole, false), LINE.limb, o.edge ?? lineFor(wall));
  return s;
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


export { darkOf, lightOf, lineFor, LINE, SHADE, comic, ink, poly, smooth, Rng };
export type { Pt, Box };

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
 * Blocks lining a hole's edge (stones, bricks, planks), just outside it:
 * the strip of a tunnel page the eye sees beside the opening. The hole's
 * foot (y ≥ `foot`) is left bare.
 */
export function lining(hole: readonly Pt[], o: { every: number; thick: number; fills: readonly string[]; seed: number; foot?: number; gap?: number; round?: number; line?: number }): string {
  const rng = new Rng(o.seed);
  const pts = resample(hole, o.every);
  const cx = hole.reduce((a, p) => a + p[0], 0) / hole.length;
  const cy = hole.reduce((a, p) => a + p[1], 0) / hole.length;
  const out = (p: Pt, k: number): Pt => {
    const dx = p[0] - cx;
    const dy = (p[1] - cy) * 0.55;
    const l = Math.hypot(dx, dy) || 1;
    return [p[0] + (dx / l) * k, p[1] + (dy / l) * k];
  };
  const foot = o.foot ?? -3;
  const gap = o.gap ?? 1.1;
  let s = '';
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]!;
    const b = pts[(i + 1) % pts.length]!;
    if (a[1] > foot || b[1] > foot) continue;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const tx = ((b[0] - a[0]) / len) * gap;
    const ty = ((b[1] - a[1]) / len) * gap;
    const a1: Pt = [a[0] + tx, a[1] + ty];
    const b1: Pt = [b[0] - tx, b[1] - ty];
    const k = o.thick * rng.range(0.8, 1.15);
    const quad: Pt[] = [out(a1, -1.5), out(b1, -1.5), out(b1, k), out(a1, k)];
    const fill = rng.pick(o.fills);
    s += comic(o.round ? smooth(quad, o.round) : poly(quad), fill, { line: o.line ?? LINE.detail, rim: [1.6, -0.8], glint: [-0.6, 0.6] });
  }
  return s;
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
