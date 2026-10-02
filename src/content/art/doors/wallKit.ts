import { darkOf, lightOf, lineFor, LINE, SHADE } from '../../../render/2d/style';
import { nextId, Rng, smooth, type Pt } from '../../../render/2d/svg';
import { comic, ink } from '../../characters/kit';
import type { Hole } from '../../../paper/opening';
import { holeTop } from '../../../paper/opening';
import type { FaceArt } from './wallArt';
import { holeOutline, holeRing } from './wallArt';

// Drawing kit for doorways cut into walls (wallArt.ts says what a doorway is
// made of). Everything is drawn as an elevation of the surface it lies on,
// in world px: for a wall's face, x is the depth along it from the face's
// `u0` (the far end on the left) and y runs down from the face's top. The
// lens lays it on the wall in perspective. Light comes from the upper right:
// cel shadows low and left, glints high and right, a little hatching in the
// shade, contours in each fill's own darker tone.

export const r2 = (n: number): number => Math.round(n * 100) / 100;

/** A closed path through points. */
export const closed = (pts: readonly Pt[]): string => 'M' + pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z';

/** A face's point (u, v) as SVG coordinates. */
export const at = (f: Pick<FaceArt, 'u0' | 'h'>, u: number, v: number): Pt => [u - f.u0, f.h - v];

/** An even-odd ring: the outline less the hole (the frame round an opening). */
export function ringPath(outer: readonly Pt[], inner: readonly Pt[]): string {
  return `${closed(outer)} ${closed(inner)}`;
}

/** The band round an opening, `w` wide, starting `gap` out from its edge, in the comic manner (narrowed to `far` of that at the far jamb, see holeRing). */
export function archBand(h: Hole, f: Pick<FaceArt, 'u0' | 'h'>, gap: number, w: number, fill: string, o: { over?: string; hatch?: boolean; far?: number } = {}): string {
  const inner = holeRing(h, f, gap, 36, o.far);
  const outer = holeRing(h, f, gap + w, 36, o.far);
  const d = ringPath(outer, inner.slice().reverse());
  const id = nextId('band');
  // Shaded on the side away from the light (the far, left jamb) and under the crown.
  return (
    `<g><clipPath id="${id}"><path d="${d}" fill-rule="evenodd"/></clipPath>` +
    `<path d="${d}" fill="${fill}" fill-rule="evenodd"/>` +
    `<g clip-path="url(#${id})">` +
    `<path d="${closed(inner)}" fill="none" stroke="${darkOf(fill, 0.16)}" stroke-width="${r2(w * 0.5)}" opacity="0.45" transform="translate(-${r2(w * 0.18)} ${r2(w * 0.14)})"/>` +
    `<path d="${closed(outer)}" fill="none" stroke="${lightOf(fill, 0.55)}" stroke-width="${r2(w * 0.32)}" opacity="0.7" transform="translate(${r2(w * 0.16)} -${r2(w * 0.14)})"/>` +
    (o.over ?? '') +
    `</g>` +
    `<path d="${d}" fill="none" fill-rule="evenodd" stroke="${lineFor(fill)}" stroke-width="${LINE.small}" stroke-linejoin="round"/></g>`
  );
}

/** Little dots along the middle of an arch band. */
export function bandDots(h: Hole, f: Pick<FaceArt, 'u0' | 'h'>, by: number, every: number, r: number, fill: string): string {
  const pts = holeRing(h, f, by, 80);
  let out = '';
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    acc += Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (acc >= every) {
      acc = 0;
      out += `<circle cx="${r2(b[0])}" cy="${r2(b[1])}" r="${r2(r)}" fill="${fill}" stroke="${lineFor(fill)}" stroke-width="${LINE.fine}"/>`;
    }
  }
  return out;
}

/** A paper patch pinned flat on a wall (it lies on the wall, so it is part of its surface). */
export function patch(d: string, fill: string, o: { over?: string; rim?: [number, number] } = {}): string {
  return (
    `<path d="${d}" fill="#fffaf2" stroke="#fffaf2" stroke-width="2.4" stroke-linejoin="round"/>` +
    comic(d, fill, { line: LINE.small, rim: o.rim ?? [1.6, -1.4], glint: [-1, 1], over: o.over })
  );
}

/** Light hatching over a region (multiplied tone), for the shaded parts of a face. */
export function hatch(d: string, color: string = SHADE.hatch, gap = 4, w = 0.7, ang = -0.95): string {
  const id = nextId('ht');
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  let lines = '';
  for (let k = -900; k <= 900; k += gap) lines += `M${r2(-900 * c - s * k)} ${r2(-900 * s + c * k)}L${r2(900 * c - s * k)} ${r2(900 * s + c * k)}`;
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${lines}" clip-path="url(#${id})" stroke="${color}" stroke-width="${w}" opacity="0.55" style="mix-blend-mode:multiply"/>`;
}

/**
 * A tunnel-book frame standing in a passage parallel to its wall: a sheet
 * across the passage (from the opening's far jamb to its near one, up to
 * `h`) with an arch cut out of it `inset` inside the opening, its cut edge
 * decorated by `edge` (drawn over the sheet).
 */
export function frameSheet(hole: Hole, h: number, inset: number, fill: string, o: { edge?: string; seed?: number; over?: string } = {}): FaceArt {
  const f = { u0: hole.z0 - 2, u1: hole.z1 + 2, h };
  const inner: Hole = { z0: hole.z0 + inset, z1: hole.z1 - inset, spring: hole.spring - inset * 0.6, rise: Math.max(4, hole.rise - inset * 0.3), peak: hole.peak };
  const W = f.u1 - f.u0;
  const outer: Pt[] = [[0, 0], [W, 0], [W, h], [0, h]];
  const cut = holeOutline(inner, f, 40);
  const d = `${closed(outer)} ${closed(cut.slice().reverse())}`;
  const id = nextId('fs');
  return {
    ...f,
    body:
      `<g><clipPath id="${id}"><path d="${d}" fill-rule="evenodd"/></clipPath>` +
      `<path d="${d}" fill="${fill}" fill-rule="evenodd"/>` +
      `<g clip-path="url(#${id})">${o.over ?? ''}` +
      // The cut edge: the paper's white core, a shade inside the far side.
      `<path d="${closed(cut)}" fill="none" stroke="#fffaf2" stroke-width="3"/>` +
      `<path d="${closed(cut)}" fill="none" stroke="${darkOf(fill, 0.2)}" stroke-width="5" opacity="0.35" transform="translate(-2.4 1.6)"/></g>` +
      `<path d="${closed(cut)}" fill="none" stroke="${lineFor(fill)}" stroke-width="${LINE.small}"/>` +
      (o.edge ?? '') +
      `</g>`,
  };
}

/** The passage's far wall (it faces the viewer): x from the wall, up to h. */
export function passageWall(length: number, h: number, fill: string, body: string): FaceArt {
  return { u0: 0, u1: length, h, body: `<rect x="0" y="0" width="${r2(length)}" height="${r2(h)}" fill="${fill}"/>${body}` };
}

/**
 * A leaf's art over its opening: its outline (cut to the opening) with
 * `body` clipped inside, and a contour. A `bare` leaf is only its body (a
 * lattice, bars): the passage shows between.
 */
export function leafArt(hole: Hole, fill: string, body: string, o: { line?: string; bare?: boolean } = {}): FaceArt {
  const f = { u0: hole.z0, u1: hole.z1, h: holeTop(hole, (hole.z0 + hole.z1) / 2) + 0.5 };
  const outline = holeOutline(hole, f, 40);
  const d = closed(outline);
  const id = nextId('lf');
  if (o.bare) return { ...f, body: `<g><clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${body}</g></g>` };
  return {
    ...f,
    body:
      `<g><clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${fill}"/>` +
      `<g clip-path="url(#${id})">${body}</g>` +
      `<path d="${d}" fill="none" stroke="${o.line ?? lineFor(fill)}" stroke-width="${LINE.body}" stroke-linejoin="round"/></g>`,
  };
}

/** A small figure card (it faces the viewer): u across from its middle, v up from its foot. */
export function figure(w: number, h: number, body: string): FaceArt {
  return { u0: -w / 2, u1: w / 2, h, body: `<g transform="translate(${r2(w / 2)} ${r2(h)})">${body}</g>` };
}

/** A soft round glow (for lamps painted on a surface: the light itself is the room's). */
export function glowSpot(cx: number, cy: number, r: number, color: string, opacity = 0.8): string {
  const id = nextId('gs');
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${opacity}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="url(#${id})"/>`;
}

/** Wobbly hand-drawn line through points. */
export function wobble(pts: readonly Pt[], amp: number, seed: number): Pt[] {
  const rng = new Rng(seed);
  return pts.map(([x, y]) => [x + rng.range(-amp, amp), y + rng.range(-amp, amp)] as Pt);
}

/** A smooth closed blob through points. */
export const blob = (pts: readonly Pt[]): string => smooth(pts, 1, true);

/** An ink line in a colour's own dark tone. */
export const line = (d: string, color: string, w: number = LINE.fine): string => ink(d, w, lineFor(color));

/** An open path along an opening's edge grown by `by` (from the foot of the far jamb over the top to the near one). */
export function archLine(h: Hole, f: Pick<FaceArt, 'u0' | 'h'>, by: number, n = 48, far = 1): string {
  const pts = holeRing(h, f, by, n, far);
  return 'M' + pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L');
}

/** The part of an arch line above a height (v over the floor): the rainbow over a door. */
export function archTopLine(h: Hole, f: Pick<FaceArt, 'u0' | 'h'>, by: number, above: number, n = 48): string {
  const pts = holeRing(h, f, by, n).filter((p) => f.h - p[1] >= above);
  return pts.length < 2 ? '' : 'M' + pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L');
}

/**
 * A doily round an opening: a paper ring from `gap` to `gap + w` out,
 * its outer edge scalloped every `every` px, little holes punched along it
 * (narrowed to `far` of that at the far jamb, see holeRing).
 */
export function doily(h: Hole, f: Pick<FaceArt, 'u0' | 'h'>, gap: number, w: number, every: number, fill: string, far = 1): string {
  const inner = holeRing(h, f, gap, 60, far);
  const base = holeRing(h, f, gap + w, 90, far);
  // Scallops: bumps outward along the outer edge (away from the opening's middle line).
  const cx = (h.z0 + h.z1) / 2 - f.u0;
  const out: Pt[] = [];
  let acc = 0;
  for (let i = 0; i < base.length; i++) {
    const p = base[i]!;
    if (i > 0) acc += Math.hypot(p[0] - base[i - 1]![0], p[1] - base[i - 1]![1]);
    const k = Math.abs(Math.sin((acc / every) * Math.PI));
    const nx = p[0] - cx;
    const ny = p[1] - (f.h - h.spring);
    const l = Math.hypot(nx, ny) || 1;
    const bump = w * 0.42 * k;
    // Straight jambs bump sideways, the top outward (toward the far side only by `far` of that).
    const onJamb = f.h - p[1] < h.spring;
    const side = nx < 0 ? far : 1;
    out.push(onJamb ? [p[0] + Math.sign(nx) * bump * side, p[1]] : [p[0] + (nx / l) * bump * side, p[1] + (ny / l) * bump]);
  }
  const d = `${closed(out)} ${closed(inner.slice().reverse())}`;
  let holes = '';
  const mid = holeRing(h, f, gap + w * 0.62, 90, far);
  acc = 0;
  for (let i = 1; i < mid.length; i++) {
    acc += Math.hypot(mid[i]![0] - mid[i - 1]![0], mid[i]![1] - mid[i - 1]![1]);
    if (acc >= every) {
      acc = 0;
      holes += `<circle cx="${r2(mid[i]![0])}" cy="${r2(mid[i]![1])}" r="${r2(w * 0.11)}" fill="${darkOf(fill, 0.1)}" opacity="0.7"/>`;
    }
  }
  return (
    `<g><path d="${d}" fill="#2a2038" fill-rule="evenodd" opacity="0.14" transform="translate(-2 2)"/>` +
    `<path d="${d}" fill="${fill}" fill-rule="evenodd"/>${holes}` +
    `<path d="${d}" fill="none" fill-rule="evenodd" stroke="${lineFor(fill)}" stroke-width="${LINE.fine}"/></g>`
  );
}

/** A strip of washi tape (a translucent paper patch with a printed pattern), centred at x, y. */
export function tape(x: number, y: number, w: number, h: number, ang: number, fill: string, dots: string): string {
  const id = nextId('tp');
  return (
    `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(ang)})">` +
    `<clipPath id="${id}"><path d="M${r2(-w / 2)} ${r2(-h / 2)}L${r2(w / 2)} ${r2(-h / 2 + 1)}L${r2(w / 2 - 1)} ${r2(h / 2)}L${r2(-w / 2 + 1)} ${r2(h / 2 - 1)}Z"/></clipPath>` +
    `<g clip-path="url(#${id})"><rect x="${r2(-w / 2)}" y="${r2(-h / 2)}" width="${r2(w)}" height="${r2(h)}" fill="${fill}" opacity="0.88"/>` +
    Array.from({ length: Math.ceil(w / 6) }, (_, i) => `<circle cx="${r2(-w / 2 + 3 + i * 6)}" cy="${r2((i % 2) * 2 - 1)}" r="1.1" fill="${dots}"/>`).join('') +
    `</g></g>`
  );
}

/** A paper star pinned flat (or a star doodle): its paper edge, fill, contour and glint. */
export function pinnedStar(cx: number, cy: number, r: number, fill: string, rot = 0): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.5;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return patch(closed(pts), fill, { rim: [r * 0.18, -r * 0.14] });
}

/**
 * Courses of rounded stones over a face (u0..u1 × 0..h): a stone wall, a
 * cave's wall. `fills` are the stones' paper, `mortar` the wall between.
 */
export function stoneCourses(f: Pick<FaceArt, 'u0' | 'u1' | 'h'>, o: { row: number; len: [number, number]; fills: readonly string[]; mortar: string; seed: number; gap?: number; round?: number }): string {
  const rng = new Rng(o.seed);
  const W = f.u1 - f.u0;
  const gap = o.gap ?? 3;
  let s = `<rect x="0" y="0" width="${r2(W)}" height="${r2(f.h)}" fill="${o.mortar}"/>`;
  let y = f.h;
  let row = 0;
  while (y > -o.row) {
    const hgt = o.row * rng.range(0.85, 1.15);
    let x = -rng.range(0, o.len[1]);
    while (x < W) {
      const w = rng.range(o.len[0], o.len[1]);
      const fill = rng.pick(o.fills);
      const x0 = x + gap / 2;
      const x1 = x + w - gap / 2;
      const y0 = y - hgt + gap / 2;
      const y1 = y - gap / 2;
      const rr = o.round ?? Math.min(10, hgt * 0.3);
      const d = `M${r2(x0 + rr)} ${r2(y0)}L${r2(x1 - rr)} ${r2(y0 + rng.range(-1, 1))}Q${r2(x1)} ${r2(y0)} ${r2(x1)} ${r2(y0 + rr)}L${r2(x1 + rng.range(-1, 1))} ${r2(y1 - rr)}Q${r2(x1)} ${r2(y1)} ${r2(x1 - rr)} ${r2(y1)}L${r2(x0 + rr)} ${r2(y1)}Q${r2(x0)} ${r2(y1)} ${r2(x0)} ${r2(y1 - rr)}L${r2(x0)} ${r2(y0 + rr)}Q${r2(x0)} ${r2(y0)} ${r2(x0 + rr)} ${r2(y0)}Z`;
      // Each stone: shaded along its foot and far side, a glint along its top.
      s += `<path d="${d}" fill="${fill}"/>`;
      s += `<path d="M${r2(x0 + 2)} ${r2(y1 - 2)}L${r2(x1 - rr)} ${r2(y1 - 2)}Q${r2(x1 - 2)} ${r2(y1 - 2)} ${r2(x1 - 2)} ${r2(y1 - rr)}" fill="none" stroke="${darkOf(fill, 0.14)}" stroke-width="${r2(Math.min(5, hgt * 0.16))}" stroke-linecap="round" opacity="0.8"/>`;
      s += `<path d="M${r2(x0 + rr)} ${r2(y0 + 2.2)}L${r2(x1 - rr - 2)} ${r2(y0 + 2.2)}" stroke="${lightOf(fill, 0.45)}" stroke-width="1.6" stroke-linecap="round" opacity="0.9"/>`;
      s += `<path d="${d}" fill="none" stroke="${lineFor(fill)}" stroke-width="${LINE.fine}"/>`;
      if (rng.chance(0.18)) s += `<path d="M${r2(x0 + w * 0.3)} ${r2(y0 + hgt * 0.3)}l${r2(w * 0.12)} ${r2(hgt * 0.2)}l${r2(-w * 0.04)} ${r2(hgt * 0.2)}" fill="none" stroke="${darkOf(fill, 0.3)}" stroke-width="0.8"/>`;
      x += w;
    }
    y -= hgt;
    row++;
  }
  return s;
}

/** A row of tree trunks standing side by side across a face: bark, grooves, roots at their feet; returns the art and the trunks' spans. */
export function trunks(f: Pick<FaceArt, 'u0' | 'u1' | 'h'>, spans: readonly [number, number][], o: { bark: readonly string[]; gap: string; seed: number }): string {
  const rng = new Rng(o.seed);
  const W = f.u1 - f.u0;
  let s = `<rect x="0" y="0" width="${r2(W)}" height="${r2(f.h)}" fill="${o.gap}"/>`;
  spans.forEach(([a, b], i) => {
    const fill = o.bark[i % o.bark.length]!;
    const x0 = a - f.u0;
    const x1 = b - f.u0;
    const flare = (x1 - x0) * 0.16;
    // The trunk: a little wider at its foot, its edges wavering.
    const L: Pt[] = [];
    const R: Pt[] = [];
    for (let k = 0; k <= 8; k++) {
      const y = (f.h * k) / 8;
      const foot = Math.pow(k / 8, 6) * flare;
      L.push([x0 - foot + rng.range(-1.5, 1.5), y]);
      R.push([x1 + foot + rng.range(-1.5, 1.5), y]);
    }
    const d = closed([...L, ...R.reverse()]);
    let over = '';
    // Bark grooves running up it.
    const n = Math.max(2, Math.round((x1 - x0) / 16));
    for (let g = 0; g < n; g++) {
      const gx = x0 + ((g + 0.5) * (x1 - x0)) / n + rng.range(-3, 3);
      let p = `M${r2(gx)} ${r2(f.h + 4)}`;
      let y = f.h;
      while (y > -10) {
        const y2 = y - rng.range(30, 60);
        p += `Q${r2(gx + rng.range(-5, 5))} ${r2((y + y2) / 2)} ${r2(gx + rng.range(-3, 3))} ${r2(y2)}`;
        y = y2;
      }
      over += `<path d="${p}" fill="none" stroke="${darkOf(fill, 0.22)}" stroke-width="${r2(rng.range(0.8, 1.6))}" stroke-linecap="round" opacity="0.8"/>`;
    }
    // A knot here and there.
    if (rng.chance(0.7)) {
      const kx = rng.range(x0 + 10, x1 - 10);
      const ky = rng.range(f.h * 0.15, f.h * 0.6);
      over += `<ellipse cx="${r2(kx)}" cy="${r2(ky)}" rx="4" ry="7" fill="${darkOf(fill, 0.25)}"/><ellipse cx="${r2(kx + 1)}" cy="${r2(ky - 1)}" rx="1.6" ry="3.4" fill="${lightOf(fill, 0.3)}"/>`;
    }
    s += comic(d, fill, { line: LINE.small, rim: [Math.max(2, (x1 - x0) * 0.12), -1], glint: [-1.4, 1.4], hatch: 2.6, hatchWidth: 0.5, over });
  });
  return s;
}

/** A hedge: overlapping rounded leaf clumps over a face, darker in the deep, a few flowers. */
export function hedge(f: Pick<FaceArt, 'u0' | 'u1' | 'h'>, o: { leaf: readonly string[]; deep: string; flowers?: readonly string[]; seed: number; top?: number }): string {
  const rng = new Rng(o.seed);
  const W = f.u1 - f.u0;
  const top = o.top ?? 0;
  let s = `<rect x="0" y="${r2(top)}" width="${r2(W)}" height="${r2(f.h - top)}" fill="${o.deep}"/>`;
  const step = 26;
  for (let y = f.h + 10; y > top - 10; y -= step * 0.7) {
    for (let x = -10 - rng.range(0, step); x < W + 10; x += step * 0.8) {
      const r = rng.range(13, 19);
      const fill = rng.pick(o.leaf);
      const cx = x + rng.range(-4, 4);
      const cy = y + rng.range(-4, 4);
      const pts: Pt[] = [];
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2;
        const rr = r * (k % 2 ? 0.86 : 1.04);
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
      }
      const d = smooth(pts, 1, true);
      s += `<path d="${d}" fill="${fill}" stroke="${lineFor(fill)}" stroke-width="0.7"/>`;
      s += `<path d="M${r2(cx - r * 0.3)} ${r2(cy - r * 0.45)}Q${r2(cx + r * 0.1)} ${r2(cy - r * 0.62)} ${r2(cx + r * 0.45)} ${r2(cy - r * 0.3)}" fill="none" stroke="${lightOf(fill, 0.45)}" stroke-width="1.6" stroke-linecap="round"/>`;
      s += `<path d="M${r2(cx - r * 0.5)} ${r2(cy + r * 0.2)}Q${r2(cx - r * 0.2)} ${r2(cy + r * 0.62)} ${r2(cx + r * 0.3)} ${r2(cy + r * 0.62)}" fill="none" stroke="${darkOf(fill, 0.18)}" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>`;
      if (o.flowers && rng.chance(0.07)) {
        const fc = rng.pick(o.flowers);
        for (let k = 0; k < 5; k++) {
          const a = (k / 5) * Math.PI * 2;
          s += `<circle cx="${r2(cx + Math.cos(a) * 3.2)}" cy="${r2(cy + Math.sin(a) * 3.2)}" r="2.6" fill="${fc}" stroke="${lineFor(fc)}" stroke-width="0.5"/>`;
        }
        s += `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="1.8" fill="#f5dc84"/>`;
      }
    }
  }
  return s;
}

/** A hillside: bands of earth under a turf, tufts and little flowers, a stone or two. */
export function hillside(f: Pick<FaceArt, 'u0' | 'u1' | 'h'>, o: { earth: readonly string[]; turf: string; flowers: readonly string[]; seed: number }): string {
  const rng = new Rng(o.seed);
  const W = f.u1 - f.u0;
  let s = `<rect x="0" y="0" width="${r2(W)}" height="${r2(f.h)}" fill="${o.earth[0]}"/>`;
  // Earth in wavy bands, darker toward the foot.
  const bands = o.earth.length;
  for (let i = 1; i < bands; i++) {
    const y = (f.h * i) / bands + rng.range(-6, 6);
    let d = `M-4 ${r2(y)}`;
    for (let x = 0; x <= W + 40; x += 40) d += `Q${r2(x + 20)} ${r2(y + rng.range(-9, 9))} ${r2(x + 40)} ${r2(y + rng.range(-4, 4))}`;
    d += `L${r2(W + 40)} ${r2(f.h)}L-4 ${r2(f.h)}Z`;
    const c = o.earth[i]!;
    s += `<path d="${d}" fill="${c}" stroke="${lineFor(c)}" stroke-width="0.8"/>`;
  }
  // Pebbles and roots in the earth.
  for (let k = 0; k < Math.round(W / 26); k++) {
    const x = rng.range(0, W);
    const y = rng.range(f.h * 0.35, f.h - 6);
    const r = rng.range(3, 7);
    const c = rng.chance(0.5) ? '#c9c2cf' : '#b8b0c2';
    s += `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(r * 1.4)}" ry="${r2(r)}" fill="${c}" stroke="${lineFor(c)}" stroke-width="0.6"/>`;
  }
  // The turf over it all: the hill's grass goes on up past the frame.
  const turfY = f.h * 0.3;
  let d = `M-4 ${r2(turfY)}`;
  for (let x = 0; x <= W + 30; x += 30) d += `Q${r2(x + 15)} ${r2(turfY + rng.range(-12, 10))} ${r2(x + 30)} ${r2(turfY + rng.range(-5, 5))}`;
  d += `L${r2(W + 30)} -4L-4 -4Z`;
  s += `<path d="${d}" fill="${o.turf}" stroke="${lineFor(o.turf)}" stroke-width="1"/>`;
  for (let k = 0; k < Math.round(W / 9); k++) {
    const x = rng.range(0, W);
    const y = turfY + rng.range(-8, 8);
    s += `<path d="M${r2(x)} ${r2(y + 4)}l${r2(rng.range(-3, 3))} ${r2(-rng.range(6, 12))}" stroke="${darkOf(o.turf, 0.2)}" stroke-width="1.2" stroke-linecap="round"/>`;
  }
  for (let k = 0; k < Math.round(W / 22); k++) {
    const x = rng.range(0, W);
    const y = rng.range(0, turfY - 10);
    s += `<path d="M${r2(x)} ${r2(y)}l${r2(rng.range(-2, 2))} -7" stroke="${lightOf(o.turf, 0.3)}" stroke-width="1" stroke-linecap="round"/>`;
    if (rng.chance(0.3)) {
      const fc = rng.pick(o.flowers);
      s += `<circle cx="${r2(x)}" cy="${r2(y - 8)}" r="2.6" fill="${fc}" stroke="${lineFor(fc)}" stroke-width="0.5"/>`;
    }
  }
  return s;
}

/** A fence of upright planks across a face, their tops pointed, nails and the grain drawn. */
export function planks(f: Pick<FaceArt, 'u0' | 'u1' | 'h'>, o: { fills: readonly string[]; gap: string; width: number; top: number; seed: number }): string {
  const rng = new Rng(o.seed);
  const W = f.u1 - f.u0;
  let s = `<rect x="0" y="0" width="${r2(W)}" height="${r2(f.h)}" fill="${o.gap}"/>`;
  for (let x = -rng.range(0, o.width); x < W; x += o.width) {
    const fill = rng.pick(o.fills);
    const w = o.width - 2;
    const tip = f.h - o.top - rng.range(-6, 6);
    const d = `M${r2(x + 1)} ${r2(f.h + 2)}L${r2(x + 1)} ${r2(tip + 8)}L${r2(x + 1 + w / 2)} ${r2(tip - 4)}L${r2(x + 1 + w)} ${r2(tip + 8)}L${r2(x + 1 + w)} ${r2(f.h + 2)}Z`;
    let grain = '';
    for (let g = 0; g < 3; g++) {
      const gx = x + 4 + g * (w - 6) / 2 + rng.range(-1, 1);
      grain += `<path d="M${r2(gx)} ${r2(f.h)}Q${r2(gx + rng.range(-3, 3))} ${r2((f.h + tip) / 2)} ${r2(gx + rng.range(-1, 1))} ${r2(tip + 14)}" fill="none" stroke="${darkOf(fill, 0.16)}" stroke-width="0.8"/>`;
    }
    for (const ny of [f.h - 40, tip + 40]) grain += `<circle cx="${r2(x + 1 + w / 2)}" cy="${r2(ny)}" r="1.6" fill="${darkOf(fill, 0.4)}"/>`;
    s += comic(d, fill, { line: LINE.small, rim: [Math.max(2, w * 0.18), -0.6], glint: [-1, 1], over: grain });
  }
  // Rails across the back of the planks, seen between them.
  return s;
}

/** A ring of big stones round an opening (voussoirs), `w` deep (only `far` of that at the far jamb), their fills taken in turn. */
export function voussoirs(h: Hole, f: Pick<FaceArt, 'u0' | 'h'>, w: number, fills: readonly string[], n = 30, far = 1): string {
  const ring = holeRing(h, f, 0, n);
  const out = holeRing(h, f, w, n, far);
  let s = '';
  for (let i = 0, k = 0; i < ring.length - 1; i += 2, k++) {
    const j = Math.min(ring.length - 1, i + 2);
    const fill = fills[k % fills.length]!;
    s += comic(closed([ring[i]!, ring[j]!, out[j]!, out[i]!]), fill, { line: LINE.small, rim: [2.4, -1.6], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5 });
  }
  return s;
}

/** Ivy hanging down a wall from (x, y): a wavy stem and little leaves along it. */
export function ivy(x: number, y: number, len: number, fill: string, seed: number): string {
  const rng = new Rng(seed);
  const pts: Pt[] = [];
  for (let k = 0; k <= 6; k++) pts.push([x + Math.sin(k * 1.3 + seed) * 6 + rng.range(-2, 2), y + (len * k) / 6]);
  let s = ink(smooth(pts, 1, false), 1.4, darkOf(fill, 0.3));
  for (let k = 1; k < 13; k++) {
    const p = pts[Math.min(6, Math.floor(k / 2))]!;
    const q = pts[Math.min(6, Math.floor(k / 2) + 1)]!;
    const t = (k % 2) * 0.5;
    const px = p[0] + (q[0] - p[0]) * t;
    const py = p[1] + (q[1] - p[1]) * t;
    const side = k % 2 ? 1 : -1;
    const r = rng.range(4, 6.5);
    s += comic(`M${r2(px)} ${r2(py)}q${r2(side * r)} ${r2(-r * 0.9)} ${r2(side * r * 1.9)} ${r2(r * 0.2)}q${r2(-side * r * 0.9)} ${r2(r * 1.1)} ${r2(-side * r * 1.9)} ${r2(-r * 0.2)}Z`, rng.chance(0.5) ? fill : lightOf(fill, 0.12), { line: LINE.fine, rim: [0.8, -0.5] });
  }
  return s;
}

/** A row of little bulbs along an arch line `by` out from an opening (a marquee): glows, glass, a glint. */
export function bulbs(h: Hole, f: Pick<FaceArt, 'u0' | 'h'>, by: number, every: number, fill: string, far = 1): string {
  const pts = holeRing(h, f, by, 90, far);
  let s = '';
  let acc = every;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    acc += Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (acc < every) continue;
    acc = 0;
    s += glowSpot(b[0], b[1], 9, fill, 0.55);
    s += `<circle cx="${r2(b[0])}" cy="${r2(b[1])}" r="3.6" fill="${fill}" stroke="${lineFor(fill)}" stroke-width="${LINE.fine}"/>`;
    s += `<circle cx="${r2(b[0] + 1)}" cy="${r2(b[1] - 1.2)}" r="1.1" fill="#fffdf4"/>`;
  }
  return s;
}
