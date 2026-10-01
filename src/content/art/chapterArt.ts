import { darkOf, lightOf, lineFor, LINE, PASTEL, SHADE } from '../../render/2d/style';
import { ellipsePath, nextId, Rng, smooth, taper, type Pt } from '../../render/2d/svg';
import { comic, hatchLines, ink, roundPoly } from '../characters/kit';

// The chapter pages of the storybook (ui/ChapterPage.ts): each chapter's
// colours, its numeral painted with a brush, the torn sheet it is printed
// on, the endpaper round it, and a little picture of what the chapter holds.
// Drawn by hand in the game's comic manner: pastel fills, contours in each
// fill's own darker tone, cel shadows low on the left and glints high on the
// right (the light comes from the upper right), light hatching in the shade.
//
// The pictures move a little (`data-mv` on a group names how: ChapterPage
// plays it), so the page is alive while it is read.

const r2 = (n: number): string => (Math.round(n * 100) / 100).toString();

export interface ChapterLook {
  /** The endpaper round the page, and the little things printed on it. */
  ground: string;
  pattern: string;
  /** The numeral's paint. */
  paint: string;
  /** The title's words take these in turn. */
  words: readonly string[];
  /** "BÖLÜM" and the rules. */
  accent: string;
}

/** Each chapter's colours: pastels on the night of its endpaper. */
export const LOOKS: Readonly<Record<number, ChapterLook>> = {
  1: { ground: '#3b2f57', pattern: '#54457a', paint: PASTEL.pink, words: [PASTEL.pink, PASTEL.butter], accent: '#8a5a8c' },
  2: { ground: '#2f4038', pattern: '#43594d', paint: PASTEL.mintDeep, words: [PASTEL.mint, PASTEL.butter, PASTEL.pink], accent: '#4f7a68' },
  3: { ground: '#3a2b52', pattern: '#4f3d6e', paint: PASTEL.lilac, words: [PASTEL.lilac, PASTEL.butter, PASTEL.apricot, PASTEL.butter], accent: '#7a5a9c' },
  4: { ground: '#2b2f52', pattern: '#3f4470', paint: PASTEL.periwinkle, words: [PASTEL.periwinkle, PASTEL.blush], accent: '#5a64a0' },
  5: { ground: '#4a2a3a', pattern: '#633b4f', paint: PASTEL.apricot, words: [PASTEL.apricot, PASTEL.butter], accent: '#9a5a4a' },
  6: { ground: '#363b47', pattern: '#4b5160', paint: PASTEL.sand, words: [PASTEL.sand, PASTEL.aqua], accent: '#7a6a58' },
};

export function lookOf(chapter: number): ChapterLook {
  return LOOKS[chapter] ?? LOOKS[1]!;
}

// ------------------------------------------------------------ the numeral

/** One brush stroke of the numeral: its painted shape, and the path the brush takes along it. */
export interface Stroke {
  art: string;
  /** The brush's way along the stroke (the paint follows it on), and the points it passes. */
  spine: string;
  pts: readonly Pt[];
  /** Its length (user units) and the width that covers the stroke. */
  len: number;
  w: number;
}

/** A brush stroke's outline along `pts`, as wide as `ws` at each point (blunt, slightly ragged ends). */
function brush(pts: readonly Pt[], ws: readonly number[], rng: Rng): string {
  const n = pts.length;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(n - 1, i + 1)]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = ws[i]! / 2;
    const p = pts[i]!;
    // The bristles leave the edge a little uneven.
    const jl = 1 + rng.range(-0.06, 0.06);
    const jr = 1 + rng.range(-0.06, 0.06);
    left.push([p[0] + nx * w * jl, p[1] + ny * w * jl]);
    right.push([p[0] - nx * w * jr, p[1] - ny * w * jr]);
  }
  const end = pts[n - 1]!;
  const pre = pts[n - 2]!;
  const el = Math.hypot(end[0] - pre[0], end[1] - pre[1]) || 1;
  const we = ws[n - 1]! / 2;
  const tip: Pt = [end[0] + ((end[0] - pre[0]) / el) * we * 0.55, end[1] + ((end[1] - pre[1]) / el) * we * 0.55];
  const st = pts[0]!;
  const nx = pts[1]!;
  const sl = Math.hypot(nx[0] - st[0], nx[1] - st[1]) || 1;
  const ws0 = ws[0]! / 2;
  const base: Pt = [st[0] - ((nx[0] - st[0]) / sl) * ws0 * 0.45, st[1] - ((nx[1] - st[1]) / sl) * ws0 * 0.45];
  return smooth([...left, tip, ...right.reverse(), base], 0.8);
}

function polyLen(pts: readonly Pt[]): number {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
  return l;
}

/** Dry-brush streaks along a stroke, in the paint's own tones (clipped inside it). */
function bristles(pts: readonly Pt[], w: number, paint: string, rng: Rng): string {
  let s = '';
  for (const [k, tone, op] of [[-0.28, darkOf(paint, 0.22), 0.55], [0.22, darkOf(paint, 0.15), 0.4], [0.05, lightOf(paint, 0.5), 0.6]] as const) {
    const off: Pt[] = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)]!;
      const b = pts[Math.min(pts.length - 1, i + 1)]!;
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1;
      const j = rng.range(-0.04, 0.04);
      return [p[0] - (dy / l) * w * (k + j), p[1] + (dx / l) * w * (k + j)];
    });
    s += ink(smooth(off, 1, false), Math.max(0.6, w * 0.06), tone, op);
  }
  return s;
}

/** A stroke of the numeral in the comic manner, with the brush's path along it. */
function paintStroke(pts: readonly Pt[], ws: readonly number[], paint: string, rng: Rng): Stroke {
  const d = brush(pts, ws, rng);
  const wMax = Math.max(...ws);
  const art = comic(d, paint, {
    line: LINE.body * 1.15,
    ink: lineFor(paint),
    rim: [wMax * 0.16, -wMax * 0.1],
    glint: [-wMax * 0.07, wMax * 0.08],
    hatch: wMax > 12 ? 2.6 : 0,
    hatchWidth: 0.7,
    over: bristles(pts, wMax, paint, rng),
  });
  return { art, spine: smooth(pts, 1, false), pts, len: polyLen(pts) * 1.08, w: wMax * 1.9 };
}

/** The glyph I (46 wide, 100 high), at x. */
function glyphI(x: number, paint: string, rng: Rng): Stroke[] {
  const j = (): number => rng.range(-1.2, 1.2);
  return [
    paintStroke([[x + 23 + j(), 12], [x + 21.5, 36], [x + 22.5, 64], [x + 23.5 + j(), 88]], [21, 17, 16.5, 20], paint, rng),
    paintStroke([[x + 5, 12 + j()], [x + 22, 10], [x + 41, 9 + j()]], [9.5, 8, 6.5], paint, rng),
    paintStroke([[x + 3, 91 + j()], [x + 23, 89.5], [x + 44, 89 + j()]], [10.5, 9, 7], paint, rng),
  ];
}

/** The glyph V (92 wide, 100 high), at x: a heavy left arm, a light right one. */
function glyphV(x: number, paint: string, rng: Rng): Stroke[] {
  const j = (): number => rng.range(-1.2, 1.2);
  return [
    paintStroke([[x + 12, 12], [x + 25, 42 + j()], [x + 38, 70], [x + 46, 91]], [22, 19, 15, 11], paint, rng),
    paintStroke([[x + 82, 12], [x + 70, 42 + j()], [x + 57, 72], [x + 48, 91]], [11.5, 10, 8.5, 8], paint, rng),
    paintStroke([[x - 2, 11 + j()], [x + 13, 10], [x + 29, 10.5]], [9, 8, 6.5], paint, rng),
    paintStroke([[x + 68, 10.5], [x + 82, 9.5 + j()], [x + 95, 10.5]], [7.5, 6.5, 5.5], paint, rng),
  ];
}

const GLYPHS: Record<string, { w: number; make: (x: number, paint: string, rng: Rng) => Stroke[] }> = {
  I: { w: 46, make: glyphI },
  V: { w: 92, make: glyphV },
};

/** The chapter's numeral as brush strokes (in painting order), and the box they fill. */
export function numeral(roman: string, paint: string, seed: number): { x: number; y: number; w: number; h: number; strokes: Stroke[] } {
  const rng = new Rng(seed);
  const main: Stroke[] = [];
  const serifs: Stroke[] = [];
  let x = 0;
  for (const ch of roman) {
    const g = GLYPHS[ch];
    if (!g) continue;
    // Each glyph's first strokes are its body (one stem, or the two arms), the rest its serifs.
    const st = g.make(x, paint, rng);
    const body = ch === 'V' ? 2 : 1;
    main.push(...st.slice(0, body));
    serifs.push(...st.slice(body));
    x += g.w + 6;
  }
  // The brush paints the bodies first, then comes back for the serifs.
  const strokes = [...main, ...serifs];
  const w = Math.max(1, x - 6);
  return { x: -10, y: -2, w: w + 20, h: 106, strokes };
}

/** A watercolour wash behind the numeral (in its box's units): pale paint, the pigment pooled at its edge. */
export function wash(box: { x: number; y: number; w: number; h: number }, paint: string, seed: number): string {
  const rng = new Rng(seed);
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h * 0.5;
  const rx = box.w / 2 + 4;
  const ry = box.h * 0.5;
  const pts: Pt[] = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rng.range(-0.12, 0.12);
    const k = 1 + rng.range(-0.12, 0.08);
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  const d = smooth(pts, 1, true);
  const id = nextId('wash');
  const tone = lightOf(paint, 0.5);
  return (
    `<radialGradient id="${id}" cx="0.58" cy="0.4" r="0.65"><stop offset="0" stop-color="${lightOf(paint, 0.75)}"/><stop offset="0.75" stop-color="${tone}"/><stop offset="1" stop-color="${lightOf(paint, 0.3)}"/></radialGradient>` +
    `<path d="${d}" fill="url(#${id})" opacity="0.7"/>` +
    `<path d="${d}" fill="none" stroke="${darkOf(paint, 0.05)}" stroke-width="1.4" opacity="0.4"/>` +
    // A few drops flicked off the brush.
    Array.from({ length: 4 }, () => {
      const a = rng.range(0, Math.PI * 2);
      const r = rng.range(1.08, 1.25);
      return `<circle cx="${r2(cx + Math.cos(a) * rx * r)}" cy="${r2(cy + Math.sin(a) * ry * r)}" r="${r2(rng.range(1.5, 3.2))}" fill="${tone}" opacity="0.8"/>`;
    }).join('')
  );
}

/**
 * The little brush that paints the numeral: wet bristles in the paint, a
 * tin ferrule, a painted handle; its tip at (0, 0), the handle up to the
 * right (as a hand holds it).
 */
export function paintbrush(paint: string): string {
  const handle = PASTEL.coral;
  const art =
    comic(taper([[50, 0], [34, 0], [21, 0]], 5.2, 6.4), handle, { line: LINE.small, rim: [0, 1.6], glint: [0, -1], over: ink('M46 -0.6L28 -1', 0.8, lightOf(handle, 0.7)) }) +
    comic(roundPoly([[13, -3.4], [21, -3.6], [21, 3.6], [13, 3.4]], 1.2), PASTEL.stone, { line: LINE.small, rim: [0, 1.4], glint: [0, -1], over: ink('M15 -3.4V3.4M18 -3.6V3.6', 0.6, darkOf(PASTEL.stone, 0.3)) }) +
    comic('M13 -3.6Q5 -4.4 0 0Q5 4.4 13 3.6Z', lightOf(paint, 0.15), { line: LINE.small, ink: lineFor(paint), rim: [0, 1.6], over: ink('M12 -1.6Q6 -1.4 2 0M12 1.4Q7 1.6 3 0.6', 0.6, darkOf(paint, 0.25)) }) +
    comic('M7 -2.8Q3 -2.4 0 0Q3 2.4 7 2.8Z', paint, { line: 0 });
  return `<g transform="rotate(-52) scale(1.3)">${art}</g>`;
}

// ------------------------------------------------------------ the sheet

/**
 * A sheet torn on all four sides, over x, y, w, h (any unit): its fibres'
 * edge (`outer`, the white core shows between it and the surface) and the
 * printed surface's edge (`inner`).
 */
export function tornSheet(x: number, y: number, w: number, h: number, seed: number, jag = 7): { outer: string; inner: string } {
  const rng = new Rng(seed);
  const outer: Pt[] = [];
  const inner: Pt[] = [];
  const edge = (ax: number, ay: number, bx: number, by: number, nx: number, ny: number): void => {
    const len = Math.hypot(bx - ax, by - ay);
    const n = Math.max(4, Math.round(len / 9));
    let bite = 0;
    for (let i = 0; i < n; i++) {
      const u = i / n;
      // Now and then a deeper bite, eased in and out over a few teeth.
      if (bite <= 0 && rng.chance(0.06)) bite = rng.int(2, 4);
      const deep = bite > 0 ? jag * rng.range(0.9, 1.6) : 0;
      bite--;
      const d = rng.range(0, jag) + deep;
      const px = ax + (bx - ax) * u + rng.range(-1.5, 1.5) * (1 - Math.abs(nx));
      const py = ay + (by - ay) * u + rng.range(-1.5, 1.5) * (1 - Math.abs(ny));
      outer.push([px + nx * d, py + ny * d]);
      const core = 1.4 + rng.range(0, 2.6);
      inner.push([px + nx * (d + core), py + ny * (d + core)]);
    }
  };
  edge(x, y, x + w, y, 0, 1);
  edge(x + w, y, x + w, y + h, -1, 0);
  edge(x + w, y + h, x, y + h, 0, -1);
  edge(x, y + h, x, y, 1, 0);
  const d = (pts: Pt[]): string => 'M' + pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z';
  return { outer: d(outer), inner: d(inner) };
}

/** The endpaper's printed pattern: little crystals and stars in a lighter tone (a CSS tile). */
export function endpaperTile(look: ChapterLook, seed: number): string {
  const rng = new Rng(seed);
  const s = 140;
  let body = '';
  for (let i = 0; i < 7; i++) {
    const x = rng.range(8, s - 8);
    const y = rng.range(8, s - 8);
    if (i % 3 === 0) {
      const r = rng.range(3, 5);
      body += `<path d="M${r2(x)} ${r2(y - r)}Q${r2(x)} ${r2(y)} ${r2(x + r)} ${r2(y)}Q${r2(x)} ${r2(y)} ${r2(x)} ${r2(y + r)}Q${r2(x)} ${r2(y)} ${r2(x - r)} ${r2(y)}Q${r2(x)} ${r2(y)} ${r2(x)} ${r2(y - r)}Z" fill="${look.pattern}"/>`;
    } else {
      const a = rng.range(-0.5, 0.5);
      const h = rng.range(7, 11);
      const w = h * 0.45;
      const c = Math.cos(a);
      const sn = Math.sin(a);
      const P = (u: number, v: number): string => `${r2(x + u * c - v * sn)} ${r2(y + u * sn + v * c)}`;
      body += `<path d="M${P(0, -h)}L${P(w, -h * 0.3)}L${P(w * 0.7, h * 0.6)}L${P(0, h)}L${P(-w * 0.7, h * 0.6)}L${P(-w, -h * 0.3)}Z" fill="none" stroke="${look.pattern}" stroke-width="1.3" stroke-linejoin="round"/>`;
      body += `<path d="M${P(0, -h)}L${P(0, h)}" stroke="${look.pattern}" stroke-width="0.8"/>`;
    }
  }
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">${body}</svg>`)}")`;
}

// ------------------------------------------------------------ the pictures

/** The pictures' measure (user units). */
export const PICTURE = { w: 320, h: 240 } as const;

/** A group that moves (ChapterPage plays `mv`): `o` is its turning point in its own box. */
const mv = (name: string, body: string, o = '50% 50%', phase = 0): string =>
  `<g data-mv="${name}" data-ph="${phase}" style="transform-box:fill-box;transform-origin:${o}">${body}</g>`;

/** A four-pointed sparkle. */
function sparkle(x: number, y: number, r: number): string {
  const k = r * 0.22;
  return `M${r2(x)} ${r2(y - r)}Q${r2(x + k)} ${r2(y - k)} ${r2(x + r)} ${r2(y)}Q${r2(x + k)} ${r2(y + k)} ${r2(x)} ${r2(y + r)}Q${r2(x - k)} ${r2(y + k)} ${r2(x - r)} ${r2(y)}Q${r2(x - k)} ${r2(y - k)} ${r2(x)} ${r2(y - r)}Z`;
}

/** Twinkling sparkles at the points given. */
function twinkles(pts: readonly [number, number, number][], fill: string): string {
  return pts.map(([x, y, r], i) => mv('twinkle', `<path d="${sparkle(x, y, r)}" fill="${fill}"/>`, '50% 50%', i * 0.37)).join('');
}

/** A picture: its art, and its torn outline (for the shadow it throws on the page). */
export interface Picture {
  art: string;
  outline: string;
}

/** The picture's card: a torn-edged ground in its own colour, the scene drawn on it. */
function card(fill: string, seed: number, body: string, edge = fill): Picture {
  const t = tornSheet(14, 12, PICTURE.w - 28, PICTURE.h - 24, seed, 4);
  const id = nextId('vc');
  return {
    art:
      // Its fibres, its face (the scene clipped to it), its contour.
      `<path d="${t.outer}" fill="#fffaf1"/>` +
      `<clipPath id="${id}"><path d="${t.inner}"/></clipPath>` +
      `<g clip-path="url(#${id})"><path d="${t.inner}" fill="${fill}"/>${body}</g>` +
      `<path d="${t.inner}" fill="none" stroke="${lineFor(edge)}" stroke-width="${LINE.small}" stroke-linejoin="round"/>`,
    outline: t.outer,
  };
}

/** I · 14. Oda: the door of the fourteenth room, ajar, and Gorti peeking out of its pink light. */
function picture1(): Picture {
  const wall = '#e7dcef';
  const frame = PASTEL.sand;
  const door = PASTEL.lilac;
  const night = '#3b2f57';
  let s = '';
  // The wall, its paper hatched in the corners, the floor.
  s += `<path d="M0 0H320V176H0Z" fill="${wall}"/>`;
  s += hatchLines({ x0: 14, y0: 12, x1: 90, y1: 176 }, 5, SHADE.hatch, 0.6);
  s += `<path d="M0 176H320V240H0Z" fill="#d9c8b0"/>`;
  s += ink('M0 176H320', LINE.detail, lineFor('#d9c8b0'));
  s += ink('M24 200H90M190 214H268M120 228H170', LINE.fine, darkOf('#d9c8b0', 0.3));
  // The doorway: deep night inside, his pink light filling it.
  const gid = nextId('vg');
  s += `<radialGradient id="${gid}" cx="0.62" cy="0.55" r="0.75"><stop offset="0" stop-color="#ff86d6" stop-opacity="0.95"/><stop offset="0.45" stop-color="#d45aa8" stop-opacity="0.55"/><stop offset="1" stop-color="${night}" stop-opacity="0"/></radialGradient>`;
  s += comic('M142 54H232V178H142Z', night, { line: LINE.small, inner: mv('pulse', `<rect x="142" y="54" width="90" height="124" fill="url(#${gid})"/>`) });
  // Gorti's head peeking round the jamb: the tin box, the plum screen, the neon eyes.
  const tin = '#baa97f';
  const head =
    comic(roundPoly([[170, 98], [214, 98], [218, 102], [218, 150], [214, 154], [170, 154], [166, 150], [166, 102]], 5), tin, { line: LINE.small, rim: [2.4, -2.4], glint: [-1, 1.2], hatch: 2.4 }) +
    comic(roundPoly([[173, 105], [211, 105], [211, 146], [173, 146]], 5), '#4c2245', {
      line: LINE.detail,
      ink: '#2c1228',
      inner:
        ink('M180 106V146M188 106V146M196 106V146M204 106V146M174 113H211M174 121H211M174 129H211M174 137H211', 0.6, '#ff9ad6', 0.3) +
        `<ellipse cx="192" cy="126" rx="22" ry="20" fill="#ff5db6" opacity="0.28"/>`,
    }) +
    mv(
      'blink',
      `<rect x="180" y="118" width="8" height="10" rx="2" fill="#ff9ad6"/><rect x="196" y="118" width="7" height="9.5" rx="2" fill="#ff9ad6"/>` +
        `<rect x="182" y="120" width="3" height="5" rx="1" fill="#ffe4f4"/><rect x="198" y="120" width="2.6" height="4.6" rx="1" fill="#ffe4f4"/>`,
      '50% 50%',
    ) +
    // The antenna with its pink bead.
    ink('M206 98L214 80', LINE.detail, darkOf(tin, 0.45)) +
    comic(ellipsePath(215, 78, 3.6, 3.6), '#ff86d6', { line: LINE.fine, glint: [-0.8, 0.8] });
  s += mv('peek', head, '50% 100%');
  // The frame round the doorway, in front of him.
  s += comic('M132 44H242V182H232V54H142V182H132Z', frame, { line: LINE.body, rim: [3, -2], glint: [-1.2, 1.4], hatch: 2.6 });
  s += ink('M137 50H237', LINE.fine, darkOf(frame, 0.35));
  // The door itself, swung open toward us on its hinges, its panels and its number.
  const leaf = 'M142 54L96 40L96 196L142 182Z';
  s += mv(
    'swing',
    comic(leaf, door, {
      line: LINE.body,
      rim: [3, -2],
      glint: [-1.4, 1.2],
      hatch: 2.5,
      over:
        `<path d="M104 56L134 64L134 104L104 100Z" fill="${darkOf(door, 0.12)}" stroke="${lineFor(door)}" stroke-width="${LINE.detail}"/>` +
        `<path d="M104 116L134 118L134 166L104 174Z" fill="${darkOf(door, 0.12)}" stroke="${lineFor(door)}" stroke-width="${LINE.detail}"/>` +
        // The plaque: 14.
        comic('M108 76L128 80L128 94L108 92Z', PASTEL.cream, { line: LINE.detail }) +
        ink('M113 82L115 80.5L115 91.5', 1.5, '#5d4a6a') +
        ink('M124 81.5L119 88.5L126 89M123.5 85V93', 1.5, '#5d4a6a') +
        comic(ellipsePath(135, 122, 3.4, 3.4), PASTEL.butter, { line: LINE.fine, glint: [-0.8, 0.8] }),
    }),
    '100% 50%',
  );
  // Crystals at its foot, a sprout, and sparkles.
  const crystal = (x: number, y: number, h: number, w: number, fill: string, lean: number): string =>
    comic(`M${x} ${y}L${x - w + lean} ${y - h * 0.55}L${x + lean} ${y - h}L${x + w + lean} ${y - h * 0.55}Z`, fill, { line: LINE.small, rim: [w * 0.4, -1], glint: [-w * 0.2, w * 0.2] }) +
    ink(`M${x + lean} ${y - h}L${x} ${y}`, LINE.fine, darkOf(fill, 0.35));
  s += crystal(258, 184, 34, 9, PASTEL.teal, 3) + crystal(274, 186, 24, 7, PASTEL.lilac, -2) + crystal(246, 188, 20, 6, PASTEL.pink, -3);
  s += mv('sway', ink('M70 190Q66 172 72 160', LINE.small, darkOf(PASTEL.leaf, 0.4)) + comic('M72 160Q60 150 52 156Q60 166 72 160Z', PASTEL.leaf, { line: LINE.detail }) + comic('M71 168Q82 158 90 164Q80 172 71 168Z', PASTEL.lime, { line: LINE.detail }), '50% 100%');
  s += twinkles([[262, 140, 6], [286, 160, 4], [60, 120, 4.5]], '#fff8fd');
  return card(wall, 101, s, frame);
}

/** II · Yüzey ve Yalanlar: the surface at night; a raccoon, masked as raccoons are, peeks from behind a stone. */
function picture2(): Picture {
  const sky = '#40566f';
  let s = `<path d="M0 0H320V240H0Z" fill="${sky}"/>`;
  s += hatchLines({ x0: 0, y0: 0, x1: 320, y1: 70 }, 6, '#36485e', 0.7);
  // The baby moon, asleep.
  s += mv('bob', comic('M70 34A30 30 0 1 0 98 82A24 24 0 1 1 70 34Z', PASTEL.butter, { line: LINE.small, rim: [3, -2], glint: [-1, 1.2] }) + ink('M76 64Q80 68 85 65', LINE.detail, darkOf(PASTEL.butter, 0.5)) + `<ellipse cx="72" cy="72" rx="4" ry="2.5" fill="${PASTEL.pink}" opacity="0.7"/>`, '50% 50%');
  s += twinkles([[150, 30, 5], [210, 48, 3.5], [268, 24, 5], [120, 70, 3]], '#fff6c8');
  // Hills.
  s += comic('M-10 168Q60 112 150 140Q220 100 330 132V250H-10Z', PASTEL.sage, { line: LINE.small, rim: [0, -4], hatch: 3 });
  s += comic('M-10 196Q90 150 200 182Q260 166 330 176V250H-10Z', PASTEL.mintDeep, { line: LINE.small, rim: [0, -4] });
  // A little paper mask on a stick, dropped in the grass.
  s += ink('M240 214L268 196', LINE.small, darkOf(PASTEL.bark, 0.2));
  s += comic('M222 210Q228 198 242 204Q256 198 262 210Q256 222 242 216Q228 222 222 210Z', PASTEL.pink, { line: LINE.small, glint: [-1, 1], over: `<ellipse cx="234" cy="209" rx="4" ry="2.6" fill="#4a3550"/><ellipse cx="250" cy="209" rx="4" ry="2.6" fill="#4a3550"/>` });
  // The raccoon, peeking: ears, the grey head, the dark mask band round the eyes.
  const fur = '#a7a3b1';
  const raccoon =
    comic('M118 128L112 104L130 116Z', fur, { line: LINE.small }) +
    comic('M168 128L176 104L158 116Z', fur, { line: LINE.small }) +
    comic('M110 150Q112 112 144 110Q176 112 178 150Q170 166 144 166Q118 166 110 150Z', fur, { line: LINE.body, rim: [3, -2], glint: [-1.2, 1.2], hatch: 2.4 }) +
    comic('M114 136Q126 124 144 132Q162 124 174 136Q166 148 144 142Q122 148 114 136Z', '#4f4a5c', { line: LINE.detail }) +
    comic('M128 152Q144 144 160 152Q152 162 144 162Q136 162 128 152Z', '#efe9f2', { line: LINE.detail }) +
    comic(ellipsePath(144, 150, 4, 3), '#3d3546', { line: 0 }) +
    mv('blink', `<ellipse cx="132" cy="136" rx="3.4" ry="4" fill="#fff9f0"/><ellipse cx="156" cy="136" rx="3.4" ry="4" fill="#fff9f0"/><circle cx="133" cy="135" r="1.6" fill="#2e2734"/><circle cx="157" cy="135" r="1.6" fill="#2e2734"/>`);
  s += mv('peek', raccoon, '50% 100%');
  // The stone he hides behind, and grass that sways.
  s += comic('M84 214Q86 160 140 154Q200 150 208 214Z', PASTEL.stone, { line: LINE.body, rim: [5, -3], glint: [-1.6, 1.6], hatch: 2.6 });
  s += ink('M120 176Q132 170 146 176M170 190Q178 186 186 190', LINE.fine, darkOf(PASTEL.stone, 0.4));
  const blades = (x: number, y: number, ph: number): string =>
    mv('sway', comic(`M${x} ${y}Q${x - 6} ${y - 18} ${x - 2} ${y - 30}Q${x + 2} ${y - 16} ${x + 4} ${y}Z`, PASTEL.leaf, { line: LINE.fine }) + comic(`M${x + 4} ${y}Q${x + 12} ${y - 14} ${x + 16} ${y - 22}Q${x + 10} ${y - 8} ${x + 9} ${y}Z`, PASTEL.lime, { line: LINE.fine }), '50% 100%', ph);
  s += blades(70, 222, 0) + blades(212, 222, 0.6) + blades(290, 214, 1.1);
  return card(sky, 202, s, PASTEL.mintDeep);
}

/** III · Mor At ve Güneş: the purple horse at a gallop under the laughing Sun. */
function picture3(): Picture {
  const sky = '#f6dfb4';
  let s = `<path d="M0 0H320V240H0Z" fill="${sky}"/>`;
  s += hatchLines({ x0: 0, y0: 0, x1: 130, y1: 90 }, 6, darkOf(sky, 0.12), 0.6);
  // The Sun, high on the right, laughing, its rays turning.
  const rays = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const P = (r: number, da: number): string => `${r2(264 + Math.cos(a + da) * r)} ${r2(50 + Math.sin(a + da) * r)}`;
    return `M${P(29, -0.14)}L${P(44, 0)}L${P(29, 0.14)}Z`;
  }).join('');
  s += mv('spin', comic(rays, PASTEL.apricot, { line: LINE.small, glint: [-0.8, 0.8] }), '50% 50%');
  s += comic(ellipsePath(264, 50, 27, 27), PASTEL.butter, {
    line: LINE.body,
    rim: [4, -3],
    glint: [-1.4, 1.6],
    hatch: 2.6,
    over:
      ink('M249 45Q254 39 259 45M269 45Q274 39 279 45', LINE.small, '#7a5a3a') +
      comic('M252 56Q264 74 276 56Z', PASTEL.coral, { line: LINE.detail, over: `<ellipse cx="264" cy="64" rx="5" ry="3" fill="${PASTEL.pink}"/>` }) +
      `<ellipse cx="247" cy="56" rx="4.5" ry="2.8" fill="${PASTEL.pink}" opacity="0.85"/><ellipse cx="281" cy="56" rx="4.5" ry="2.8" fill="${PASTEL.pink}" opacity="0.85"/>`,
  });
  // A small cloud drifting.
  s += mv('drift', comic('M92 58Q94 46 106 48Q112 38 124 44Q136 42 136 54Q144 58 136 64H96Q86 64 92 58Z', '#fffaf2', { line: LINE.small, rim: [2, -2] }), '50% 50%');
  // The ground: far hills, the near meadow, the horse's shadow on it.
  s += comic('M-10 178Q70 150 160 168Q240 150 330 164V250H-10Z', PASTEL.lime, { line: LINE.small, rim: [0, -3], hatch: 3 });
  s += comic('M-10 206Q120 190 330 202V250H-10Z', '#b7c98a', { line: LINE.small });
  s += `<ellipse cx="152" cy="204" rx="52" ry="5" fill="${darkOf('#b7c98a', 0.3)}" opacity="0.6"/>`;
  // Dust kicked up behind.
  s += mv('drift', comic(ellipsePath(60, 190, 12, 7), '#efe3c4', { line: LINE.fine }) + comic(ellipsePath(40, 184, 8, 5), '#efe3c4', { line: LINE.fine }), '50% 50%', 0.6);
  // The horse, lilac, mane and tail in a deeper purple, all four hooves off the ground.
  const coat = PASTEL.lilac;
  const far = darkOf(coat, 0.14);
  const mane = PASTEL.lilacDeep;
  const hoof = (x: number, y: number, a: number): string => {
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const P = (u: number, v: number): Pt => [x + u * c - v * sn, y + u * sn + v * c];
    return comic(roundPoly([P(-4.5, -2), P(4.5, -2), P(5, 4), P(-5, 4)], 1.4), '#6d5a7a', { line: LINE.fine, glint: [-0.5, 0.5] });
  };
  const leg = (pts: Pt[], fill: string, w0: number, w1: number, a: number): string => {
    const e = pts[pts.length - 1]!;
    return comic(taper(pts, w0, w1), fill, { line: LINE.small, rim: [1.6, -1] }) + hoof(e[0], e[1] + 1, a);
  };
  const horse =
    // The far legs (behind the body), a shade darker.
    leg([[182, 146], [194, 162], [186, 180]], far, 11, 6, 0.2) +
    leg([[120, 148], [116, 166], [128, 182]], far, 12, 6, -0.3) +
    // The tail, streaming back.
    mv('swish', comic('M104 124C92 110 74 102 54 106C62 110 64 114 60 119C70 118 78 121 80 127C72 128 68 134 70 141C82 134 94 133 104 137Z', mane, { line: LINE.small, glint: [-1, 1], over: ink('M98 125Q80 112 62 110M97 131Q86 126 76 127M98 134Q88 134 80 138', LINE.fine, darkOf(mane, 0.3)) }), '100% 40%') +
    // The body.
    comic(smooth([[196, 128], [184, 150], [150, 156], [114, 152], [100, 138], [102, 122], [124, 112], [160, 114], [184, 110]], 1, true), coat, {
      line: LINE.body,
      rim: [4, -3],
      glint: [-1.4, 1.4],
      hatch: 2.6,
    }) +
    // The near legs: one reaching forward, one pushing back.
    leg([[186, 144], [208, 156], [230, 154]], coat, 12, 6.5, -1.2) +
    leg([[116, 146], [96, 160], [74, 164]], coat, 13, 6.5, 1.3) +
    // The neck and head.
    comic('M170 118Q182 92 204 76L224 90Q210 104 198 134Z', coat, { line: LINE.body, rim: [3, -2], glint: [-1, 1.2] }) +
    comic(smooth([[204, 76], [214, 68], [232, 76], [248, 92], [250, 104], [240, 108], [226, 102], [214, 94]], 1, true), coat, {
      line: LINE.body,
      rim: [3, -2],
      glint: [-1, 1.2],
      over: `<ellipse cx="244" cy="99" rx="2" ry="1.4" fill="#5a4668"/>` + ink('M236 104Q241 107 246 105', LINE.detail, darkOf(coat, 0.45)) + `<ellipse cx="230" cy="94" rx="4.5" ry="2.6" fill="${PASTEL.pink}" opacity="0.8"/>`,
    }) +
    comic('M210 72L208 56L218 68Z', coat, { line: LINE.small, glint: [-0.6, 0.6] }) +
    // The mane, in tufts flying back along the neck, and the forelock.
    comic('M206 72Q196 76 188 86Q196 86 200 84Q190 94 180 100Q190 100 194 98Q184 108 174 114Q186 116 198 104L220 82Z', mane, { line: LINE.small, glint: [-1, 1] }) +
    comic('M214 70Q222 64 228 72Q220 72 216 78Z', mane, { line: LINE.fine }) +
    mv('blink', `<ellipse cx="226" cy="82" rx="3.4" ry="3.8" fill="#fffaf2"/><circle cx="227" cy="82.5" r="2" fill="#2e2734"/><circle cx="227.8" cy="81.4" r="0.7" fill="#fff"/>`, '50% 50%');
  s += mv('gallop', horse, '50% 100%');
  return card(sky, 303, s, PASTEL.apricot);
}

/** IV · İç Koğuş: a bed in the ward under a window full of stars; someone sleeps; the lamp is warm. */
function picture4(): Picture {
  const wall = PASTEL.lavender;
  let s = `<path d="M0 0H320V240H0Z" fill="${wall}"/>`;
  // Striped wallpaper with little stars, its seam lifting.
  for (let x = 8; x < 320; x += 26) s += `<path d="M${x} 0H${x + 11}V190H${x}Z" fill="${darkOf(wall, 0.06)}"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="${sparkle(21 + ((i * 52) % 300), 24 + ((i * 37) % 150), 3)}" fill="${lightOf(wall, 0.6)}"/>`;
  s += `<path d="M0 190H320V240H0Z" fill="#cdb9a0"/>` + ink('M0 190H320', LINE.detail, lineFor('#cdb9a0'));
  // The window: night, a crescent, stars.
  s += comic('M188 26H284V118H188Z', '#2e3560', {
    line: LINE.small,
    inner: comic('M260 44A14 14 0 1 0 272 66A11 11 0 1 1 260 44Z', PASTEL.butter, { line: LINE.fine }) + twinkles([[206, 46, 4], [232, 70, 3], [214, 98, 3.5], [270, 100, 3]], '#fff6c8'),
  });
  s += comic('M182 20H290V124H182ZM190 28V116H282V28Z', PASTEL.cream, { line: LINE.small, rim: [2, -2] });
  s += ink('M236 28V116M190 72H282', LINE.small, lineFor(PASTEL.cream));
  // The lamp on its table, its glow breathing.
  const gid = nextId('vl');
  s += `<radialGradient id="${gid}"><stop offset="0" stop-color="#fff1b0" stop-opacity="0.9"/><stop offset="1" stop-color="#fff1b0" stop-opacity="0"/></radialGradient>`;
  s += mv('flicker', `<circle cx="54" cy="118" r="52" fill="url(#${gid})"/>`);
  s += comic('M30 196V160H78V196Z', PASTEL.bark, { line: LINE.small, rim: [3, -2], hatch: 2.4 });
  s += ink('M54 156V128', LINE.small, '#6d5a4a');
  s += comic('M36 128L44 100H64L72 128Z', PASTEL.butter, { line: LINE.small, rim: [2, -2], glint: [-1, 1] });
  // The bed: an iron frame, the mattress, a pillow, the blanket over a sleeper.
  const iron = PASTEL.slate;
  s += comic('M92 120H104V214H92ZM292 150H302V214H292Z', iron, { line: LINE.small });
  s += ink('M98 124Q98 112 106 112', LINE.small, lineFor(iron));
  s += comic('M100 172H300V194H100Z', PASTEL.cream, { line: LINE.small, rim: [0, -3] });
  s += comic('M108 150Q110 136 132 138Q150 140 150 156Q146 168 126 168Q108 166 108 150Z', '#f7f1ea', { line: LINE.small, glint: [-1, 1] });
  const blanket =
    comic('M138 176Q150 140 200 146Q250 138 290 160Q298 170 298 182H134Z', PASTEL.pink, {
      line: LINE.body,
      rim: [4, -3],
      glint: [-1.2, 1.4],
      hatch: 2.6,
      over: ink('M170 150Q172 166 168 180M210 146Q214 164 210 180M250 148Q254 166 250 180', LINE.small, darkOf(PASTEL.pink, 0.25)) + `<path d="${sparkle(190, 164, 3)}" fill="${lightOf(PASTEL.pink, 0.7)}"/><path d="${sparkle(232, 160, 3)}" fill="${lightOf(PASTEL.pink, 0.7)}"/>`,
    });
  s += mv('breathe', blanket, '50% 100%');
  s += comic('M96 200H304V212H96Z', iron, { line: LINE.small });
  return card(wall, 404, s, PASTEL.periwinkle);
}

/** V · Hak Aktarımı: the office desk, papers to be signed over, and the stamp coming down on them. */
function picture5(): Picture {
  const wall = '#e8d9c2';
  let s = `<path d="M0 0H320V240H0Z" fill="${wall}"/>`;
  // Raised panels on the wall, their bevels lit from the upper right.
  for (const x of [20, 120, 220]) {
    s += comic(`M${x} 24H${x + 80}V120H${x}Z`, darkOf(wall, 0.05), { line: LINE.detail, rim: [-2, 2], glint: [2, -2] });
  }
  // A clock on the wall, its hand going round.
  s += comic(ellipsePath(160, 72, 22, 22), PASTEL.cream, { line: LINE.small, rim: [2, -2], glint: [-1, 1] });
  s += ink('M160 56V60M160 84V88M144 72H148M172 72H176', LINE.fine, '#6d5a4a');
  s += mv('tick', ink('M160 72L160 58', LINE.small, '#5d4a6a'), '50% 100%');
  // The desk.
  s += comic('M10 150H310V166H10Z', PASTEL.bark, { line: LINE.body, rim: [0, -3], glint: [0, 2] });
  s += comic('M24 166H296V240H24Z', darkOf(PASTEL.bark, 0.12), { line: LINE.small, hatch: 3 });
  s += ink('M40 186H140M180 186H280', LINE.small, darkOf(PASTEL.bark, 0.4));
  // Papers, one already signed over.
  const paper = (pts: Pt[], lines: string): string => comic(roundPoly(pts, 2), '#fffaf1', { line: LINE.small, rim: [2, -1.5], over: lines });
  s += paper([[40, 140], [118, 132], [124, 156], [44, 162]], ink('M50 142L110 136M52 148L100 143', LINE.fine, '#8a7f8c'));
  s += mv('flutter', paper([[150, 146], [250, 140], [256, 160], [152, 164]], ink('M160 148L230 144M162 154L214 151', LINE.fine, '#8a7f8c') + `<path d="M214 150Q222 142 230 150Q222 158 214 150Z" fill="none" stroke="${PASTEL.coral}" stroke-width="2"/>`), '0% 100%');
  // The stamp: its knob, its handle, its rubber foot, thumping down.
  const stamp =
    comic(ellipsePath(222, 64, 13, 12), PASTEL.coral, { line: LINE.small, rim: [2.4, -1.6], glint: [-1, 1] }) +
    comic('M216 74H228L230 108H214Z', PASTEL.bark, { line: LINE.small, rim: [2, -1] }) +
    comic('M200 108H244V120H200Z', '#5a4a5e', { line: LINE.small, glint: [-1, 1] }) +
    comic('M204 120H240V126H204Z', PASTEL.coral, { line: LINE.detail });
  s += mv('thump', stamp, '50% 100%');
  // An inkwell and its pen.
  s += comic('M272 128H296V150H272Z', '#4f5a7a', { line: LINE.small, glint: [-1, 1] });
  s += ink('M286 128L300 96', LINE.small, '#5d4a6a');
  return card(wall, 505, s, PASTEL.apricot);
}

/** VI · Boş Odalar: the paper rooms, open-fronted boxes in a row, empty; a little pink light left in the last. */
function picture6(): Picture {
  const wall = '#dfe0e8';
  const floor = '#cfd0da';
  let s = `<path d="M0 0H320V150H0Z" fill="${wall}"/>`;
  s += hatchLines({ x0: 0, y0: 0, x1: 320, y1: 150 }, 7, darkOf(wall, 0.08), 0.6);
  s += `<path d="M0 150H320V240H0Z" fill="${floor}"/>` + ink('M0 150H320', LINE.detail, lineFor(floor));
  s += ink('M20 170L4 200M90 166L80 214M170 164L170 230M250 166L262 220M310 170L330 196', LINE.fine, darkOf(floor, 0.18));
  const paper = PASTEL.sand;
  // An open-fronted box (one of the game's rooms), lit from the upper right.
  const box = (x0: number, y0: number, w: number, h: number, inner: string): string => {
    const x1 = x0 + w;
    const y1 = y0 + h;
    const d = w * 0.2;
    const bx0 = x0 + d;
    const by0 = y0 + d * 0.7;
    const bx1 = x1 - d * 0.9;
    const by1 = y1 - d * 0.6;
    const lw = Math.max(0.8, LINE.small * (w / 100));
    const q = (pts: Pt[]): string => 'M' + pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z';
    let b = '';
    // Its shadow on the floor, low on the left.
    b += `<path d="${q([[x0 - w * 0.12, y1 + 2], [x1 - w * 0.1, y1 + 2], [x1 - w * 0.2, y1 + h * 0.12], [x0 - w * 0.26, y1 + h * 0.12]])}" fill="${darkOf(floor, 0.25)}" opacity="0.55"/>`;
    // Inside: back wall, the left wall (toward the light, pale), the right (shaded), ceiling and floor.
    b += `<path d="${q([[bx0, by0], [bx1, by0], [bx1, by1], [bx0, by1]])}" fill="${lightOf(paper, 0.3)}"/>`;
    b += `<path d="${q([[x0, y0], [bx0, by0], [bx0, by1], [x0, y1]])}" fill="${lightOf(paper, 0.5)}"/>`;
    b += `<path d="${q([[x1, y0], [bx1, by0], [bx1, by1], [x1, y1]])}" fill="${darkOf(paper, 0.2)}"/>`;
    b += hatchLines({ x0: bx1, y0: y0, x1: x1, y1: y1 }, 3, darkOf(paper, 0.4), 0.5);
    b += `<path d="${q([[x0, y0], [x1, y0], [bx1, by0], [bx0, by0]])}" fill="${darkOf(paper, 0.28)}"/>`;
    b += `<path d="${q([[x0, y1], [x1, y1], [bx1, by1], [bx0, by1]])}" fill="${lightOf(paper, 0.15)}"/>`;
    b += ink(`M${r2(bx0)} ${r2(by0)}H${r2(bx1)}V${r2(by1)}H${r2(bx0)}Z`, lw * 0.6, darkOf(paper, 0.35));
    b += ink(`M${x0} ${y0}L${r2(bx0)} ${r2(by0)}M${x1} ${y0}L${r2(bx1)} ${r2(by0)}M${x0} ${y1}L${r2(bx0)} ${r2(by1)}M${x1} ${y1}L${r2(bx1)} ${r2(by1)}`, lw * 0.6, darkOf(paper, 0.35));
    b += inner;
    // The cut edge of the cardboard round the opening.
    const t = Math.max(2, w * 0.035);
    b += comic(`M${x0 - t} ${y0 - t}H${x1 + t}V${y1 + t}H${x0 - t}Z M${x0} ${y0}V${y1}H${x1}V${y0}Z`, lightOf(paper, 0.55), { line: lw, ink: lineFor(paper), rim: [t * 0.6, -t * 0.4] });
    return b;
  };
  // The first: a chair, and a bare bulb swinging on its wire.
  const chair =
    comic('M58 166V138H63V156H80V166Z', PASTEL.bark, { line: LINE.small, rim: [1.4, -1] }) +
    ink('M60 166V176M78 166V176', LINE.small, darkOf(PASTEL.bark, 0.3)) +
    mv('sway', ink('M66 112V128', LINE.fine, '#6d6474') + comic(ellipsePath(66, 132, 4.2, 5), PASTEL.butter, { line: LINE.fine, glint: [-0.8, 0.8] }), '50% 0%');
  // The last: the pink light he left behind.
  const gid = nextId('ve');
  const light = `<radialGradient id="${gid}"><stop offset="0" stop-color="#ff86d6" stop-opacity="0.95"/><stop offset="0.45" stop-color="#ff86d6" stop-opacity="0.45"/><stop offset="1" stop-color="#ff86d6" stop-opacity="0"/></radialGradient>` +
    mv('pulse', `<circle cx="257" cy="150" r="22" fill="url(#${gid})"/><path d="${sparkle(257, 150, 5)}" fill="#ffe4f4"/>`);
  s += box(228, 126, 60, 45, light);
  s += box(136, 118, 72, 56, '');
  s += box(22, 104, 98, 80, chair);
  // Dust in the air.
  for (let i = 0; i < 7; i++) s += mv('drift', `<circle cx="${30 + i * 42}" cy="${50 + (i % 3) * 18}" r="${1.6 + (i % 2)}" fill="#fffaf2" stroke="#a9a3b4" stroke-width="0.5"/>`, '50% 50%', i * 0.45);
  return card(wall, 606, s, PASTEL.slate);
}

const PICTURES: Record<number, () => Picture> = { 1: picture1, 2: picture2, 3: picture3, 4: picture4, 5: picture5, 6: picture6 };

/** The chapter's little picture (PICTURE.w × PICTURE.h user units). */
export function picture(chapter: number): Picture {
  return (PICTURES[chapter] ?? picture1)();
}

/** A hand-drawn rule under the title: a wavy line, a crystal at its middle. */
export function flourish(w: number, color: string): string {
  const mid = w / 2;
  const wave = (a: number, b: number): string => {
    const n = 6;
    let d = `M${r2(a)} 10`;
    for (let i = 1; i <= n; i++) {
      const x = a + ((b - a) * i) / n;
      const cx = a + ((b - a) * (i - 0.5)) / n;
      d += `Q${r2(cx)} ${i % 2 ? 4 : 16} ${r2(x)} 10`;
    }
    return d;
  };
  return (
    ink(wave(8, mid - 18), 2, color) +
    ink(wave(mid + 18, w - 8), 2, color) +
    comic(`M${mid} 0L${mid + 8} 10L${mid} 20L${mid - 8} 10Z`, lightOf(color, 0.45), { line: LINE.small, ink: color, glint: [-1, 1] })
  );
}
