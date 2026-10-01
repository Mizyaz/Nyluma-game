import { barkLines, comic, comicLimb, ink, roundPoly } from '../content/characters/kit';
import { CHILD } from '../content/characters/gortiChild';
import { skyFaceSvg } from '../content/characters/sky';
import { darkOf, lightOf, lineFor } from '../render/2d/style';
import { blob, ellipsePath, nextId, rrect, Rng, smooth, taper, type Pt } from '../render/2d/svg';
import { comicTitle } from './Menus';

// The loading screen's pop-up paper theatre, drawn by hand in code in the
// game's comic manner: pastel paper, every contour in its fill's own darker
// tone, cel shadows low on the left with a little hatching, glints high on
// the right (the light comes from the upper right, in front).
//
// Every piece is a paper card standing at its own depth in a CSS 3D stage.
// A card is drawn where it shows on the screen and scaled up by as much as
// its depth shrinks it (`--c`), so the picture composes in 2D while the
// sway and the pointer turn it with true parallax. Cards are hinged at the
// floor and pop up when the progress reaches them (`data-at`); hanging
// things are let down on their threads; crystals sprout one by one, and
// Gorti glances at each (`data-g`: where it is from his screen).

export type StageKind = 'wide' | 'mid' | 'tall';

/** Theatre sizes in units: wide screens, the usual 16:9, phones held upright. */
export const STAGE_SIZE: Readonly<Record<StageKind, readonly [number, number]>> = { wide: [1240, 660], mid: [1000, 660], tall: [640, 1080] };

/** The eye's distance from the stage, in units. */
const P = 1500;
/** The floor runs from just behind the proscenium (z) to behind the backdrop. */
const FLOOR = [110, -430] as const;
/** The frame's top edge, units, and how far inside its outline the box's walls and ceiling stand. */
const FRAME_TOP = 44;
const BOX_IN = 14;
/** Depths, units toward the viewer. */
const Z = { sky: -390, whale: -365, face: -300, far: -265, mid: -175, mound: -80, gorti: 0, lip: 70, lamps: 98, drape: 106, valance: 113, frame: 120, banner: 134, confetti: 150 } as const;
/** Contour widths, units. */
const L = { body: 3.4, small: 2.5, detail: 1.7, fine: 1.15 } as const;

const C = {
  thread: '#eadcc0',
  moss: '#a9cb8f',
  grass: '#9cc47a',
  grassLight: '#c3dc8c',
  root: '#a58a78',
  stone: '#c9c7c4',
  frame: '#c9abdf',
  frameDeep: '#a387c6',
  cream: '#f7eddc',
  butter: '#f3e08e',
  velvet: '#eca7c8',
  board: '#d8c09e',
  pink: '#f0b2cf',
  peri: '#a3b0e2',
  apricot: '#f4b27c',
} as const;
/** The crystals' pastels. */
const GEMS = ['#9fb6ee', '#c4a4ea', '#f3a9cc', '#89d8c8', '#f6c08c', '#b9ebe4'] as const;
const CONFETTI = ['#f0b2cf', '#f3e08e', '#b6dcc6', '#97a3dc', '#c3a3dc', '#f4b27c', '#bfdcd8'] as const;

type Box = readonly [number, number, number, number];

const r1 = (v: number): string => (Math.round(v * 10) / 10).toString();
const pt = ([x, y]: Pt): string => `${r1(x)} ${r1(y)}`;
const polyD = (pts: readonly Pt[]): string => `M${pts.map(pt).join('L')}Z`;
const pc = (v: number, of: number): string => `${+((v / of) * 100).toFixed(3)}%`;
/** Inline style laying box `b` in box `rel`. */
const place = (b: Box, rel: Box): string => `left:${pc(b[0] - rel[0], rel[2])};top:${pc(b[1] - rel[1], rel[3])};width:${pc(b[2], rel[2])};height:${pc(b[3], rel[3])}`;
const svg = (b: Box, body: string): string => `<svg viewBox="${b.map(r1).join(' ')}" aria-hidden="true">${body}</svg>`;
const fill = (d: string, color: string, o = 1): string => `<path d="${d}" fill="${color}"${o !== 1 ? ` opacity="${o}"` : ''}/>`;
/**
 * A small paper shape drawn plainly (no masks: there are many of them):
 * its fill and its contour in the fill's own darker tone; `over` adds a
 * glint or a little shading by hand.
 */
const chip = (d: string, color: string, line: number = L.fine, over = '', edge = lineFor(color)): string => `<path d="${d}" fill="${color}" stroke="${edge}" stroke-width="${line}" stroke-linejoin="round"/>${over}`;

/** The theatre's frame: its size, the opening, the floor line and the eye. */
class Geo {
  readonly W: number;
  readonly H: number;
  readonly box: Box;
  readonly tall: boolean;
  /** Pillar width, the opening's top, the floor's front line, the eye's height. */
  readonly pw: number;
  readonly top: number;
  readonly F: number;
  readonly oy: number;
  /** The floor's height in the 3D stage (it shows at F at its front). */
  readonly F3: number;

  constructor(kind: StageKind) {
    [this.W, this.H] = STAGE_SIZE[kind];
    this.box = [0, 0, this.W, this.H];
    this.tall = kind === 'tall';
    this.pw = this.tall ? 50 : 92;
    this.top = this.tall ? 216 : 138;
    this.F = this.H - 92;
    this.oy = this.top + (this.F - this.top) * 0.42;
    this.F3 = this.oy + ((this.F - this.oy) * (P - FLOOR[0])) / P;
  }

  /** The opening's width (its left edge is at `pw`). */
  get ow(): number {
    return this.W - 2 * this.pw;
  }

  /** x across the opening (0…1, and beyond). */
  x(f: number): number {
    return this.pw + f * this.ow;
  }

  /** Where a card standing on the floor at depth z has its base. */
  base(z: number): number {
    return this.oy + ((this.F3 - this.oy) * P) / (P - z);
  }

  /** Where the box's left wall (it stands at x = BOX_IN on the frame) shows at depth z. */
  wall(z: number): number {
    const cx = this.W / 2;
    return cx - ((cx - BOX_IN) * (P - Z.frame)) / (P - z);
  }

  /**
   * Where a card at depth z ends on the left: a little past the wall, into
   * it, but never so far that the stage's turn (10° at most) could show its
   * end beyond the frame.
   */
  edge(z: number): number {
    const w = this.wall(z);
    return Math.min(w - 2, Math.max(w - 24, (Z.frame - z) * 0.18));
  }

  /** A card's box spanning the box from wall to wall at depth z, from y up `h` units. */
  span(z: number, y: number, h: number): Box {
    const e = this.edge(z);
    return [e, y, this.W - e * 2, h];
  }

  /** Where threads hang from: behind the top beam (low enough to stay behind it as the stage turns). */
  get thread(): number {
    return this.top - 30;
  }
}

// ------------------------------------------------------------ cards

/** A depth layer: all in it stands at depth z and comes up at `when` (0…1). */
const piece = (z: number, when: number, inner: string): string => `<div class="ld-z" data-at="${when}" style="--z:${z};--c:${+((P - z) / P).toFixed(4)}">${inner}</div>`;

/** A paper card in a layer, hinged at its base. */
const card = (g: Geo, b: Box, inner: string, cls = '', style = ''): string => `<div class="ld-card${cls}" style="${place(b, g.box)}${style}">${inner}</div>`;

/** Swings and bobs on its thread (hanging things and their shadows). */
const bob = (inner: string, delay: number): string => `<div class="ld-bob" style="--d:${-delay}s">${inner}</div>`;

/**
 * The soft shadow a card throws on what stands `gap` units behind it: its
 * shapes (`marks`, drawn dark) blurred, moved down and to the left.
 */
function shadow(g: Geo, b: Box, marks: string, gap: number, wrap = (s: string): string => s, cls = ''): string {
  const m = 20;
  const bb: Box = [b[0] - m, b[1] - m, b[2] + m * 2, b[3] + m * 2];
  const id = nextId('lsh');
  const body = `<filter id="${id}" filterUnits="userSpaceOnUse" x="${r1(bb[0])}" y="${r1(bb[1])}" width="${r1(bb[2])}" height="${r1(bb[3])}"><feGaussianBlur stdDeviation="6"/></filter><g fill="#12081f" stroke="#12081f" opacity=".4" filter="url(#${id})">${marks}</g>`;
  return card(g, bb, wrap(svg(bb, body)), ' ld-sh' + cls, `;--g:${gap}`);
}

// ------------------------------------------------------------ drawing kit

/** A ridge of hills through (x, height) points over `base`, closed below it. */
function ridge(tops: readonly Pt[], base: number): string {
  const pts: Pt[] = tops.map(([x, h]) => [x, base - h]);
  return `${smooth(pts, 0.9, false)}L${r1(pts[pts.length - 1]![0])} ${r1(base + 40)}L${r1(pts[0]![0])} ${r1(base + 40)}Z`;
}

/** A five-pointed paper star. */
function starD(c: Pt, r: number, rot: number, inner = 0.5): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = rot - Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * inner : r;
    pts.push([c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr]);
  }
  return polyD(pts);
}

/** A four-pointed twinkle. */
const twinkleD = ([x, y]: Pt, r: number): string => `M${r1(x)} ${r1(y - r)}Q${r1(x)} ${r1(y)} ${r1(x + r)} ${r1(y)}Q${r1(x)} ${r1(y)} ${r1(x)} ${r1(y + r)}Q${r1(x)} ${r1(y)} ${r1(x - r)} ${r1(y)}Q${r1(x)} ${r1(y)} ${r1(x)} ${r1(y - r)}Z`;

/** A cut gem, a lozenge of four facets lit from the upper right, with a glint. */
function gem(cx: number, cy: number, rx: number, ry: number, color: string): string {
  const t: Pt = [cx, cy - ry];
  const r: Pt = [cx + rx, cy];
  const b: Pt = [cx, cy + ry];
  const l: Pt = [cx - rx, cy];
  const c: Pt = [cx + rx * 0.14, cy - ry * 0.1];
  let s = fill(polyD([l, t, c]), lightOf(color, 0.22)) + fill(polyD([t, r, c]), lightOf(color, 0.6)) + fill(polyD([r, b, c]), color) + fill(polyD([b, l, c]), darkOf(color, 0.2));
  s += ink(polyD([t, r, b, l]), L.detail, lineFor(color));
  return s + ink(`M${pt([cx + rx * 0.22, cy - ry * 0.6])}L${pt([cx + rx * 0.52, cy - ry * 0.26])}`, Math.max(1, rx * 0.12), '#ffffff', 0.8);
}

/** Sleepy face: shut eyes, a small smile, rosy cheeks (for stars and the like). */
function sleepy(c: Pt, r: number, color: string): string {
  const [x, y] = c;
  const e = r * 0.24;
  let s = ink(`M${r1(x - e * 1.7)} ${r1(y)}q${r1(e * 0.6)} ${r1(e * 0.6)} ${r1(e * 1.2)} 0M${r1(x + e * 0.5)} ${r1(y)}q${r1(e * 0.6)} ${r1(e * 0.6)} ${r1(e * 1.2)} 0`, L.fine, color);
  s += ink(`M${r1(x - e * 0.45)} ${r1(y + e * 1.1)}q${r1(e * 0.45)} ${r1(e * 0.5)} ${r1(e * 0.9)} 0`, L.fine, color);
  s += fill(ellipsePath(x - e * 1.9, y + e * 0.9, e * 0.55, e * 0.35), '#f39ab9', 0.7) + fill(ellipsePath(x + e * 1.9, y + e * 0.9, e * 0.55, e * 0.35), '#f39ab9', 0.7);
  return s;
}

/**
 * A crystal standing at (cx, base): a six-sided prism with a pointed top,
 * its facets lit from the upper right (the left ones in shade, hatched), a
 * glint up its lit face, the contour in its own darker tone.
 */
function crystal(cx: number, base: number, w: number, h: number, color: string, line: number = L.small): string {
  const l = cx - w / 2;
  const r = cx + w / 2;
  const a = l + w * 0.3;
  const b = r - w * 0.26;
  const tip: Pt = [cx + w * 0.05, base - h];
  const sl: Pt = [l, base - h * 0.68];
  const sa: Pt = [a, base - h * 0.62];
  const sb: Pt = [b, base - h * 0.64];
  const sr: Pt = [r, base - h * 0.7];
  const face = (pts: Pt[], c: string): string => fill(polyD(pts), c);
  let over = face([[l, base], sl, sa, [a, base]], darkOf(color, 0.2));
  over += face([sl, tip, sa], darkOf(color, 0.08)) + face([sa, tip, sb], lightOf(color, 0.42)) + face([sb, tip, sr], lightOf(color, 0.68));
  over += face([[b, base], sb, sr, [r, base]], lightOf(color, 0.3));
  // Hatching in the shaded face.
  let hatch = '';
  for (let y = base - 3; y > sl[1] + 4; y -= 4.2) hatch += `M${r1(l)} ${r1(y)}L${r1(a)} ${r1(y - (a - l) * 0.55)}`;
  over += ink(hatch, 0.8, darkOf(color, 0.42), 0.8);
  const edge = darkOf(color, 0.42);
  over += ink(`M${pt(sl)}L${pt(sa)}L${pt(sb)}L${pt(sr)}M${pt(tip)}L${pt(sa)}L${r1(a)} ${r1(base)}M${pt(tip)}L${pt(sb)}L${r1(b)} ${r1(base)}`, L.fine, edge);
  over += ink(`M${r1(r - w * 0.12)} ${r1(sr[1] + h * 0.08)}L${r1(r - w * 0.12)} ${r1(base - h * 0.12)}`, Math.max(1.2, w * 0.07), '#ffffff', 0.85);
  return comic(polyD([[l, base], sl, tip, sr, [r, base]]), color, { line, over });
}

/** A crystal that sprouts at `when`, its tip sparkling; Gorti looks at it from `eye`. */
function sprout(host: Box, cx: number, base: number, w: number, h: number, color: string, when: number, eye: Pt): string {
  const b: Box = [cx - w / 2 - 4, base - h - 4, w + 8, h + 6];
  const g = `${Math.round(cx - eye[0])},${Math.round(base - h * 0.7 - eye[1])}`;
  const spark: Box = [cx + w * 0.05 - 16, base - h - 16, 32, 32];
  return `<div class="ld-cr" data-at="${when}" data-g="${g}" style="${place(b, host)}">${svg(b, crystal(cx, base, w, h, color))}</div><i class="ld-spark" style="${place(spark, host)};--sd:${(((cx - host[0]) / host[2]) * 0.5).toFixed(2)}s">${svg([-10, -10, 20, 20], fill(twinkleD([0, 0], 10), '#fff8d8'))}</i>`;
}

/** A little cluster of crystals on a slope (drawn into a card). */
function outcrop(x: number, base: number, s: number, seed: number): string {
  const rng = new Rng(seed);
  let out = '';
  for (const [dx, k, lean] of [[-0.55, 0.62, -16], [0.5, 0.7, 14], [0, 1, 2]] as const) {
    const cx = x + dx * s * 0.8;
    out += `<g transform="rotate(${lean + rng.range(-4, 4)} ${r1(cx)} ${r1(base)})">${crystal(cx, base + 2, s * 0.45 * k, s * k, rng.pick(GEMS), L.detail)}</g>`;
  }
  return out;
}

/** A grass tuft: a few tapered blades. */
function tuft(x: number, y: number, s: number, color: string, seed: number): string {
  const rng = new Rng(seed);
  let out = '';
  for (let i = -2; i <= 2; i++) {
    const a = -Math.PI / 2 + i * 0.34 + rng.range(-0.12, 0.12);
    const len = s * (1 - Math.abs(i) * 0.18) * rng.range(0.85, 1.1);
    const bend = i * 0.18 + 0.12;
    const m: Pt = [x + Math.cos(a) * len * 0.55, y + Math.sin(a) * len * 0.55];
    const t: Pt = [m[0] + Math.cos(a + bend) * len * 0.45, m[1] + Math.sin(a + bend) * len * 0.45];
    out += chip(taper([[x + i * 2, y + 2], m, t], s * 0.16, 0.4), color);
  }
  return out;
}

/** A spotted mushroom. */
function mushroom(x: number, y: number, s: number, cap: string): string {
  let out = chip(`M${r1(x - s * 0.16)} ${r1(y)}Q${r1(x - s * 0.2)} ${r1(y - s * 0.5)} ${r1(x - s * 0.1)} ${r1(y - s * 0.62)}L${r1(x + s * 0.12)} ${r1(y - s * 0.62)}Q${r1(x + s * 0.2)} ${r1(y - s * 0.4)} ${r1(x + s * 0.18)} ${r1(y)}Z`, C.cream, L.detail, ink(`M${r1(x - s * 0.08)} ${r1(y - s * 0.06)}Q${r1(x - s * 0.12)} ${r1(y - s * 0.34)} ${r1(x - s * 0.04)} ${r1(y - s * 0.56)}`, s * 0.07, darkOf(C.cream, 0.16)));
  let dots = '';
  for (const [dx, dy, r] of [[-0.3, -0.78, 0.09], [0.08, -0.9, 0.11], [0.36, -0.72, 0.07]] as const) dots += fill(ellipsePath(x + dx * s, y + dy * s, r * s, r * s * 0.8), '#fffaf2');
  const lit = ink(`M${r1(x + s * 0.12)} ${r1(y - s * 0.98)}Q${r1(x + s * 0.42)} ${r1(y - s * 0.92)} ${r1(x + s * 0.47)} ${r1(y - s * 0.68)}`, s * 0.06, lightOf(cap, 0.6));
  out += chip(`M${r1(x - s * 0.55)} ${r1(y - s * 0.56)}Q${r1(x - s * 0.5)} ${r1(y - s * 1.08)} ${r1(x)} ${r1(y - s * 1.06)}Q${r1(x + s * 0.52)} ${r1(y - s * 1.04)} ${r1(x + s * 0.55)} ${r1(y - s * 0.58)}Q${r1(x)} ${r1(y - s * 0.46)} ${r1(x - s * 0.55)} ${r1(y - s * 0.56)}Z`, cap, L.detail, dots + lit);
  return out;
}

// ------------------------------------------------------------ the sky

/** The night backdrop: deep plum paper, cut-paper halos round the Moon and the Sun, brush swirls, painted stars. */
function backdrop(g: Geo, moon: Pt, sun: Pt, rMoon: number, rSun: number): string {
  // Its top stays behind the frame's beam (and under the box's ceiling) however the stage turns.
  const y0 = g.top - 26;
  const b = g.span(Z.sky, y0, g.base(Z.sky) + 2 - y0);
  const [x, y, w, h] = b;
  const rng = new Rng(11);
  const id = nextId('lsk');
  let s = `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#31265a"/><stop offset=".55" stop-color="#3b2a5c"/><stop offset="1" stop-color="#4b2b5d"/></linearGradient>`;
  s += `<linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e5a94" stop-opacity="0"/><stop offset="1" stop-color="#7a6399" stop-opacity=".75"/></linearGradient>`;
  s += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="url(#${id})"/>`;
  // Brush swirls, a little paler than the paper.
  for (let i = 0; i < (g.tall ? 4 : 5); i++) {
    const cx = g.x(0.08 + (i / (g.tall ? 3 : 4)) * 0.84) + rng.range(-20, 20);
    const cy = g.top + (g.base(Z.sky) - g.top) * rng.range(0.36, 0.62);
    const pts: Pt[] = [];
    for (let k = 0; k <= 16; k++) {
      const a = k * 0.62 + i;
      const rr = rng.range(30, 42) * (1 - k / 22);
      pts.push([cx + Math.cos(a) * rr * 1.5, cy + Math.sin(a) * rr * 0.7]);
    }
    s += ink(smooth(pts, 1, false), 3, '#4c3a72', 0.75);
  }
  // Cut-paper halos round the Moon and the Sun: rings of paper, each a shade lighter.
  const halo = (c: Pt, R: number, cols: readonly string[]): string =>
    cols.map((col, k) => `<path d="${blob(c[0], c[1], R * (1 - k * 0.2), R * (1 - k * 0.2), rng, 16, 0.04)}" fill="${col}" stroke="${darkOf(col, 0.3)}" stroke-width="${L.detail}"/>`).join('');
  s += halo(moon, rMoon * 1.75, ['#3f336b', '#483d79', '#534888']) + halo(sun, rSun * 1.6, ['#4c3168', '#58386d', '#654272']);
  // Painted stars and dots.
  const n = Math.round((w * h) / 9000);
  for (let i = 0; i < n; i++) {
    const p: Pt = [x + rng.range(20, w - 20), y + rng.range(20, h * 0.8)];
    const c = rng.pick(['#f6e7a6', '#f8c6dc', '#c9ecea', '#e4d8f6']);
    s += rng.chance(0.35) ? fill(twinkleD(p, rng.range(3.5, 6.5)), c, 0.9) : fill(ellipsePath(p[0], p[1], 1.6, 1.6), c, 0.75);
  }
  // The horizon's glow, low down.
  s += `<rect x="${r1(x)}" y="${r1(y + h * 0.55)}" width="${r1(w)}" height="${r1(h * 0.45)}" fill="url(#${id}h)"/>`;
  return piece(Z.sky, 0.03, card(g, b, svg(b, s)));
}

/** A paper star let down on a thread, swinging; its shadow falls on the sky. */
function hangStar(g: Geo, z: number, when: number, c: Pt, r: number, color: string, rot: number, face: boolean, delay: number): string {
  const t = g.thread;
  const b: Box = [c[0] - r - 6, t, r * 2 + 12, c[1] + r + 6 - t];
  const thread = `M${r1(c[0])} ${r1(t)}L${r1(c[0])} ${r1(c[1] - r * 0.72)}`;
  const d = starD(c, r, rot);
  let art = ink(thread, 1.3, C.thread, 0.9) + fill(ellipsePath(c[0], c[1] - r * 0.74, 1.8, 1.8), C.thread);
  art += comic(d, color, { line: L.small, rim: [r * 0.22, -r * 0.14], glint: [-r * 0.09, r * 0.09], hatch: r > 14 ? 4.2 : 0, hatchWidth: 0.85, over: face ? sleepy([c[0], c[1] + r * 0.06], r, darkOf(color, 0.62)) : '' });
  const marks = `<path d="${thread}" fill="none" stroke-width="2.2"/><path d="${d}"/>`;
  return piece(z, when, shadow(g, b, marks, z - Z.sky - 6, (s) => bob(s, delay), ' ld-drop') + card(g, b, bob(svg(b, art), delay), ' ld-drop'));
}

/** The Moon or the Sun, hung on two threads; it blinks now and then. */
function hangFace(g: Geo, kind: 'moon' | 'sun', c: Pt, size: number, when: number, delay: number): string {
  const t = g.thread;
  const b: Box = [c[0] - size / 2, t, size, c[1] + size / 2 - t];
  const faceBox: Box = [c[0] - size / 2, c[1] - size / 2, size, size];
  const k = size / (kind === 'moon' ? 260 : 364);
  const R = 112 * k;
  const tie: [number, number][] = kind === 'moon' ? [[-0.42, -0.62], [0.12, -0.98]] : [[-0.5, -0.86], [0.5, -0.86]];
  let threads = '';
  for (const [dx, dy] of tie) threads += `M${r1(c[0] + dx * R)} ${r1(t)}L${r1(c[0] + dx * R)} ${r1(c[1] + dy * R)}`;
  const art = ink(threads, 1.3, C.thread, 0.9);
  const face = `<div class="ld-face" style="${place(faceBox, b)}">${skyFaceSvg(kind)}<div class="ld-blink ld-${kind}">${skyFaceSvg(kind, 'shut')}</div></div>`;
  let marks = `<path d="${threads}" fill="none" stroke-width="2.2"/>`;
  if (kind === 'moon') {
    const id = nextId('lmm');
    marks += `<mask id="${id}"><rect x="${r1(b[0] - 40)}" y="${r1(b[1] - 40)}" width="${r1(b[2] + 80)}" height="${r1(b[3] + 80)}" fill="#fff"/><path d="${ellipsePath(c[0] + 0.6 * R, c[1] - 0.1 * R, R * 0.8, R * 0.8)}" fill="#000"/></mask><path d="${ellipsePath(c[0], c[1], R, R)}" mask="url(#${id})"/>`;
  } else marks += `<path d="${ellipsePath(c[0], c[1], R * 1.25, R * 1.25)}"/>`;
  return piece(Z.face, when, shadow(g, b, marks, Z.face - Z.sky - 6, (s) => bob(s, delay), ' ld-drop') + card(g, b, bob(svg(b, art) + face, delay), ' ld-drop'));
}

/** A little paper whale swimming through the sky along a wire. */
function whale(g: Geo): string {
  const y = g.top + (g.tall ? 150 : 74);
  const b = g.span(Z.whale, y - 40, 80);
  const wire = ink(`M${r1(b[0])} ${r1(y - 26)}L${r1(b[0] + b[2])} ${r1(y - 26)}`, 1.1, C.thread, 0.3);
  // The whale, drawn facing right about (0, 0).
  const body = 'M-34 2C-34 -12 -20 -18 -2 -18C16 -18 30 -13 32 -2C33 8 22 14 4 14C-12 14 -24 11 -34 2Z';
  let wh = ink('M2 -18L2 -26', 1.2, C.thread);
  wh += comic('M-32 0C-40 -4 -46 -12 -50 -10C-48 -4 -46 0 -46 3C-49 6 -50 12 -47 13C-43 10 -38 5 -32 4Z', '#8f9ed6', { line: L.detail, rim: [2, -1] });
  wh += comic(body, C.peri, { line: L.small, rim: [5, -3], glint: [-1.4, 1.6], hatch: 3.6, hatchWidth: 0.8, over: fill('M-24 6C-10 12 12 13 26 6C22 12 10 14 2 14C-10 14 -20 11 -24 6Z', lightOf(C.peri, 0.5)) + ink('M-12 8C-4 10 6 10 14 8M-8 11C0 12 6 12 12 11', 0.8, darkOf(C.peri, 0.4)) + fill(ellipsePath(20, -4, 1.9, 1.9), darkOf(C.peri, 0.65)) });
  wh += ink('M24 -16q-3 -6 -8 -7M24 -16q2 -7 7 -8M24 -16l0 -8', 1.4, '#d8eef6');
  // It comes out of the left wall and swims into the right one.
  const w0 = g.wall(Z.whale) - b[0];
  const fish = `<div class="ld-whale" style="left:${pc(w0 - 100, b[2])};top:${pc(y - b[1] - 30, b[3])};width:${pc(100, b[2])};height:${pc(60, b[3])};--run:${Math.round(b[2] - w0 * 2 + 100)}">${svg([-55, -30, 100, 60], wh)}</div>`;
  return piece(Z.whale, 0.24, card(g, b, svg(b, wire) + fish));
}

// ------------------------------------------------------------ the land

/** Far hills, hazy lilac: tiny crystal spires on their backs and a cottage with a lit window. */
function farHills(g: Geo): string {
  const base = g.base(Z.far);
  const k = g.tall ? 1.3 : 1;
  const H = (f: number, h: number): Pt => [g.x(f), h * k];
  const b = g.span(Z.far, base - 205 * k, 205 * k);
  const back = ridge([[b[0], 90], H(0, 118), H(0.17, 92), H(0.34, 166), H(0.49, 118), H(0.63, 194), H(0.79, 128), H(0.95, 174), [b[0] + b[2], 110]], base);
  const front = ridge([[b[0], 50], H(0.08, 82), H(0.26, 58), H(0.45, 102), H(0.61, 70), H(0.8, 96), H(1, 62), [b[0] + b[2], 58]], base);
  let s = comic(back, '#7b6da7', { line: L.small, ink: '#5e5088', rim: [12, -5], glint: [-3, 3], hatch: 5.5, hatchWidth: 0.9, tone: '#d3cde0' });
  for (const [f, hh] of [[0.34, 166], [0.63, 194], [0.95, 174]] as const) {
    const x = g.x(f);
    for (const dx of [-9, 0, 8]) s += crystal(x + dx, base - hh * k + 7 + Math.abs(dx) * 0.4, 6, dx ? 14 : 21, '#a9c6e2', L.fine);
  }
  s += comic(front, '#9284be', { line: L.small, ink: '#6d5f99', rim: [12, -5], glint: [-3, 3], hatch: 5.5, hatchWidth: 0.9, tone: '#d6d0e2' });
  // A cottage with a pink lit window on the front ridge, a path winding down.
  const hx = g.x(0.45);
  const hy = base - 102 * k + 4;
  s += ink(`M${r1(hx + 6)} ${r1(hy)}Q${r1(hx + 34)} ${r1(hy + 16)} ${r1(hx + 8)} ${r1(hy + 32)}T${r1(hx + 26)} ${r1(base + 4)}`, 2.2, '#c9bde2', 0.85);
  s += comic(polyD([[hx - 10, hy], [hx - 10, hy - 15], [hx + 10, hy - 15], [hx + 10, hy]]), '#ddd3ea', { line: L.fine, rim: [3, 0] });
  s += comic(polyD([[hx - 14, hy - 14], [hx, hy - 28], [hx + 14, hy - 14]]), '#a083ba', { line: L.fine, glint: [-1, 1] });
  s += fill(ellipsePath(hx + 1, hy - 8, 11, 11), '#ff9ad6', 0.28) + fill(polyD([[hx - 3, hy - 11], [hx + 4, hy - 11], [hx + 4, hy - 4], [hx - 3, hy - 4]]), '#ffc8e8');
  // The mist lies low over them: far things are hazier.
  return piece(Z.far, 0.28, shadow(g, b, `<path d="${front}"/>`, 50) + card(g, b, svg(b, s) + '<i class="ld-haze"></i>'));
}

/** Rolling moonlit hills, teal and periwinkle, with crystal outcrops, tufts and flowers; three crystals sprout on them. */
function midHills(g: Geo, eye: Pt): string {
  const base = g.base(Z.mid);
  const k = g.tall ? 1.3 : 1;
  const b = g.span(Z.mid, base - 175 * k, 175 * k);
  const R = ridge([[g.x(0.4), 6], [g.x(0.56), 46 * k], [g.x(0.84), 124 * k], [g.x(1.04), 92 * k], [b[0] + b[2], 70 * k]], base);
  const Lh = ridge([[b[0], 92 * k], [g.x(-0.02), 140 * k], [g.x(0.14), 160 * k], [g.x(0.34), 104 * k], [g.x(0.53), 12]], base);
  const hill = { line: L.body, rim: [16, -6] as [number, number], glint: [-3.5, 3.5] as [number, number], hatch: 5.5, hatchWidth: 1, tone: '#d2d0e0' };
  let s = comic(R, '#a4abdc', hill);
  s += outcrop(g.x(0.93), base - 104 * k, 34, 3) + tuft(g.x(0.7), base - 92 * k, 16, '#7f8fc4', 4);
  s += comic(Lh, '#88c1b5', hill);
  s += outcrop(g.x(0.03), base - 146 * k, 40, 5) + outcrop(g.x(0.45), base - 40 * k, 28, 6);
  s += tuft(g.x(0.24), base - 136 * k, 18, '#5f9f92', 7) + tuft(g.x(0.09), base - 154 * k, 14, '#5f9f92', 8);
  const rng = new Rng(9);
  for (let i = 0; i < 18; i++) {
    const f = rng.range(-0.05, 0.95);
    const left = f < 0.46;
    const top = left ? 160 * k - Math.abs(f - 0.14) * 300 * k : 124 * k - Math.abs(f - 0.84) * 280 * k;
    if (top < 24) continue;
    const y = base - rng.range(8, top - 12);
    s += fill(ellipsePath(g.x(f), y, 2.6, 2.6), rng.pick(['#fff4c8', '#ffd0e4', '#e4f6ff']), 0.9);
  }
  let sp = sprout(b, g.x(0.14), base - 156 * k, 26, 54, GEMS[1], 0.4, eye) + sprout(b, g.x(0.84), base - 120 * k, 22, 46, GEMS[2], 0.47, eye) + sprout(b, g.x(0.3), base - 112 * k, 18, 36, GEMS[5], 0.54, eye);
  // Fireflies wander over the slopes.
  for (const [f, h, d] of [[0.2, 200, 0], [0.38, 150, 2.6], [0.58, 120, 5.1], [0.76, 190, 1.4], [0.92, 160, 3.8]] as const) sp += `<i class="ld-fly" style="left:${pc(g.x(f) - b[0], b[2])};top:${pc(base - h * k - b[1], b[3])};--d:${-d}s"></i>`;
  return piece(Z.mid, 0.36, shadow(g, b, `<path d="${Lh}"/><path d="${R}"/>`, 60) + card(g, b, svg(b, s) + sp));
}

/** The mossy mound the big crystals grow from, and a low ground across. */
function mound(g: Geo, eye: Pt): string {
  const base = g.base(Z.mound);
  const cx = g.x(g.tall ? 0.3 : 0.32);
  const mw = g.ow * (g.tall ? 0.56 : 0.44);
  const b = g.span(Z.mound, base - 76, 76);
  const ground = ridge([[b[0], 16], [g.x(0.1), 22], [g.x(0.5), 12], [g.x(0.8), 20], [b[0] + b[2], 14]], base);
  const hump = ridge([[cx - mw * 0.6, 4], [cx - mw * 0.4, 40], [cx - mw * 0.1, 62], [cx + mw * 0.22, 56], [cx + mw * 0.5, 30], [cx + mw * 0.66, 4]], base);
  let s = comic(ground, '#97bd86', { line: L.small, rim: [10, -4], glint: [-2, 2], hatch: 5, hatchWidth: 0.9 });
  s += comic(hump, C.moss, { line: L.body, rim: [14, -6], glint: [-3, 3], hatch: 5, hatchWidth: 1 });
  const rng = new Rng(21);
  for (let i = 0; i < 6; i++) {
    const x = cx + rng.range(-0.5, 0.55) * mw;
    const y = base - rng.range(4, 18);
    const rx = rng.range(5, 9);
    const ry = rng.range(3.5, 5);
    s += chip(blob(x, y, rx, ry, rng, 7, 0.15), C.stone, L.fine, fill(ellipsePath(x + rx * 0.3, y - ry * 0.35, rx * 0.35, ry * 0.3), lightOf(C.stone, 0.6)));
  }
  s += tuft(cx - mw * 0.48, base - 22, 16, '#86b46e', 22) + tuft(cx + mw * 0.55, base - 16, 14, '#86b46e', 23) + tuft(g.x(0.9), base - 12, 15, '#86b46e', 24);
  const kh = g.tall ? 0.95 : 1;
  const big: [number, number, number, number][] = [
    [-0.32, 34, 82, 0],
    [-0.15, 42, 126, 1],
    [0.02, 50, 156, 2],
    [0.19, 40, 110, 3],
    [0.34, 32, 74, 4],
  ];
  let sp = '';
  big.forEach(([f, w, h, c], i) => {
    const x = cx + f * mw;
    const top = base - 56 + Math.abs(f) * 60;
    sp += sprout(b, x, top, w, h * kh, GEMS[c]!, [0.5, 0.58, 0.66, 0.74, 0.82][i]!, eye);
  });
  return piece(Z.mound, 0.44, shadow(g, b, `<path d="${hump}"/>`, 40) + card(g, b, svg(b, s) + sp));
}

// ------------------------------------------------------------ Gorti

/** Root claws fanned out from `base` (as the kit's claws, drawn plainly: they are small). */
function toes(base: Pt, ang: number, spread: number, lens: readonly number[], w0: number, color: string, seed: number, curl: number): string {
  const rng = new Rng(seed);
  return lens
    .map((len, i) => {
      const a = ang + (i / (lens.length - 1) - 0.5) * spread + rng.range(-0.06, 0.06);
      const mid: Pt = [base[0] + Math.cos(a) * len * 0.55, base[1] + Math.sin(a) * len * 0.55];
      const tip: Pt = [mid[0] + Math.cos(a + curl) * len * 0.45, mid[1] + Math.sin(a + curl) * len * 0.45];
      return chip(taper([base, mid, tip], w0, 0.5), color, L.detail);
    })
    .join('');
}

/** Gorti, drawn standing about his feet (0, 0): root legs and arms, the sage sweater, the TV head. */
function gortiBody(): string {
  const { root, rootDark, body } = CHILD;
  let s = fill(ellipsePath(0, 1, 44, 7), '#1b1030', 0.32);
  for (const sx of [-1, 1]) {
    // Root arms hang beside the sweater, claws for hands.
    const sh: Pt = [sx * 22, -86];
    const el: Pt = [sx * 31, -64];
    const wr: Pt = [sx * 34, -46];
    s += toes(wr, Math.PI / 2 + sx * 0.25, 1.1, [8, 9.5, 8], 3.6, rootDark, 60 + sx, -sx * 0.2);
    s += comicLimb(el, wr, 10, 8.5, root, { line: L.small, over: barkLines(el, wr, 9, 70 + sx, { n: 2, color: darkOf(root, 0.5), width: 0.9 }) });
    s += comicLimb(sh, el, 13, 11, body, { line: L.small, bulge: 0.8, hatch: 3 });
    // Root legs with bark grooves, toes spread on the floor.
    const hip: Pt = [sx * 11, -46];
    const ft: Pt = [sx * 15, -7];
    s += toes([sx * 15, -5], Math.PI / 2 - sx * 1.05, 1.2, [9, 11, 9.5], 4.2, rootDark, 40 + sx, sx * 0.3);
    s += comicLimb(hip, ft, 14, 10.5, root, { line: L.small, over: barkLines(hip, ft, 12, 50 + sx, { n: 2, color: darkOf(root, 0.5), width: 1 }) });
  }
  const torso: Pt[] = [[-21, -38], [-25, -57], [-24, -78], [-18, -93], [-3, -100], [12, -98], [22, -89], [26, -71], [25, -53], [21, -38]];
  const knit = darkOf(body, 0.32);
  const hips = `M-30 -54Q-15 -60 -1 -54T30 -55`;
  const inner = `<path d="${hips}L30 -30L-30 -30Z" fill="${root}"/>` + barkLines([-9, -54], [-10, -38], 9, 81, { n: 2, knots: 0, color: darkOf(root, 0.5) }) + barkLines([9, -54], [10, -38], 9, 82, { n: 2, knots: 0, color: darkOf(root, 0.5) });
  const over =
    ink(hips, L.detail, darkOf(body, 0.55)) +
    ink('M-6 -58Q-8 -66 -5 -72M8 -58Q10 -64 13 -68', L.detail, darkOf(root, 0.3)) +
    ink('M-8 -95Q1 -90 10 -94', L.detail, knit) +
    ink('M-14 -78l3 2M-15 -72l3 1.6M14 -84q4 1.6 7 -0.6M15 -77q3.6 1.3 6.5 -0.8', L.fine, knit);
  s += comic(smooth(torso, 0.9), body, { line: L.body, inner, rim: [8, -4], hatch: 3.6, hatchWidth: 0.8, glint: [-1.8, 2], over });
  s += comicLimb([0, -96], [1, -110], 12, 10, root, { line: L.small });
  return s;
}

/** His head: the worn TV box in three-quarter view, the bezel and the dark glowing screen (the face goes on it as HTML). */
function gortiHead(): string {
  const o = CHILD;
  let s = '';
  // The side of the box, in shade, hatched, with rivets.
  const sideD = roundPoly([[-58, -183], [-44, -192], [-44, -103], [-58, -110]], 4);
  let side = '';
  for (let y = -186; y < -100; y += 4.2) side += `M-58 ${y + 6}L-44 ${y}`;
  side = ink(side, 0.8, darkOf(o.boxSide, 0.3)) + comic(ellipsePath(-51, -176, 2.4, 2.4), o.bezel, { line: L.fine, glint: [-0.6, 0.6] }) + comic(ellipsePath(-51, -118, 2.4, 2.4), o.bezel, { line: L.fine, glint: [-0.6, 0.6] });
  s += comic(sideD, o.boxSide, { line: L.body, over: side });
  const box = roundPoly([[-46, -186], [-36, -195], [42, -195], [51, -186], [51, -111], [42, -102], [-36, -102], [-46, -111]], 9);
  s += comic(box, o.box, { line: L.body, rim: [5, -5], glint: [-2.2, 2.4], hatch: 4.2, hatchWidth: 0.8, over: ink('M51 -150l3 -2M51 -136l3 1M8 -103q3 -1.5 6 0M-30 -195l2 3', L.fine, darkOf(o.box, 0.35)) });
  s += comic(rrect(-38, -186, 82, 76, 11), o.bezel, { line: L.small, rim: [3, -3], glint: [-1.6, 1.7] });
  let grid = '';
  for (let x = -26; x <= 32; x += 7) grid += `M${x} -180V-116`;
  for (let y = -174; y <= -118; y += 7) grid += `M-32 ${y}H38`;
  const id = nextId('lgs');
  const glass =
    `<radialGradient id="${id}"><stop offset="0" stop-color="${o.glow}" stop-opacity=".5"/><stop offset="1" stop-color="${o.glow}" stop-opacity="0"/></radialGradient>` +
    `<ellipse cx="3" cy="-148" rx="44" ry="40" fill="url(#${id})"/>` +
    ink(grid, 0.7, o.neon, 0.22) +
    `<path d="M-33 -160L-14 -181L-5 -181L-33 -150Z" fill="#fff" opacity=".12"/><path d="M-33 -142L5 -181L9 -181L-33 -137Z" fill="#fff" opacity=".08"/>`;
  s += comic(rrect(-33, -181, 72, 66, 8), o.screen, { line: L.small, ink: '#2c1228', inner: glass });
  return s;
}

/** Gorti on the stage: the body card, his head turning on its neck, his face and the count on his screen. */
function gorti(g: Geo): { html: string; eye: Pt } {
  const gx = g.x(g.tall ? 0.71 : 0.66);
  const base = g.base(Z.gorti);
  const local: Box = [-68, -206, 136, 214];
  const headBox: Box = [-62, -200, 120, 104];
  const screen: Box = [-33, -181, 72, 66];
  const b: Box = [gx - 68, base - 206, 136, 214];
  const neck = `transform-origin:${pc(0 - headBox[0], headBox[2])} ${pc(-104 - headBox[1], headBox[3])}`;
  const joy = svg([0, 0, 72, 66], ['M10 26L19 16L28 26', 'M44 26L53 16L62 26'].map((d) => `<path d="${d}" fill="none" stroke="#ff9ad6" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`).join(''));
  const face = `<div class="ld-screen" style="${place(screen, headBox)}"><div class="ld-snow"></div><div class="ld-eyes"><i></i><i></i></div><div class="ld-joy">${joy}</div><b class="ld-digits">%0</b><div class="ld-scan"></div></div>`;
  const head = `<div class="ld-head" style="${place(headBox, local)};${neck}">${svg(headBox, gortiHead())}${face}</div>`;
  const sil = `<path d="${roundPoly([[-58, -192], [51, -195], [51, -102], [-58, -104]], 9)}"/><path d="M-26 -100L26 -100L28 -40L18 0L-18 0L-28 -40Z"/>`;
  // A spotlight from the upper right, its pool of light at his feet.
  const sx = gx + (g.tall ? 110 : 150);
  const lb: Box = [gx - 100, g.top - 40, sx - gx + 130, base - g.top + 64];
  const id = nextId('lsp');
  const light = svg(
    lb,
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c8" stop-opacity="0"/><stop offset="1" stop-color="#fff3c8" stop-opacity=".24"/></linearGradient><radialGradient id="${id}p"><stop offset="0" stop-color="#fff6d6" stop-opacity=".75"/><stop offset="1" stop-color="#fff6d6" stop-opacity="0"/></radialGradient>` +
      fill(polyD([[sx - 14, g.top - 40], [sx + 14, g.top - 40], [gx + 86, base], [gx - 86, base]]), `url(#${id})`) +
      fill(ellipsePath(gx, base - 2, 100, 20), `url(#${id}p)`),
  );
  const html = piece(Z.gorti, -0.01, card(g, lb, `<div class="ld-beam">${light}</div>`) + shadow(g, b, `<g transform="translate(${r1(gx)} ${r1(base)})">${sil}</g>`, 34) + card(g, b, `<div class="ld-gorti">${svg(local, gortiBody())}${head}</div>`));
  return { html, eye: [gx + 3, base - 160] };
}

// ------------------------------------------------------------ the front

/** The stage's front lip: grass, curling roots, mushrooms, a snail; two last crystals sprout here. */
function lip(g: Geo, eye: Pt): string {
  const base = g.base(Z.lip);
  const b = g.span(Z.lip, base - 120, 124);
  const rng = new Rng(31);
  let s = '';
  // Curling roots at both corners.
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? g.pw - 20 : g.x(1) + 20;
    const pts: Pt[] = [[x0, base + 4], [x0 - sx * 40, base - 40], [x0 - sx * 76, base - 72], [x0 - sx * 112, base - 70], [x0 - sx * 122, base - 54], [x0 - sx * 110, base - 44]];
    s += comic(taper(pts, 22, 4), C.root, { line: L.small, rim: [5, -3], glint: [-1.4, 1.4], hatch: 3.6, hatchWidth: 0.8, over: ink(smooth(pts.slice(0, 4), 1, false), L.fine, darkOf(C.root, 0.45)) });
  }
  // A ribbon of grass along the front, low in the middle.
  const grass: Pt[] = [];
  for (let x = b[0]; x <= b[0] + b[2] + 1; x += 13) {
    const f = (x - g.pw) / g.ow;
    const edge = Math.max(0, Math.abs(f - 0.5) - 0.28) * 140;
    grass.push([x, base - 16 - edge - (grass.length % 2 ? 0 : 9) - rng.range(0, 6)]);
  }
  const gD = `M${r1(b[0])} ${r1(base + 8)}${grass.map((p, i) => (i % 2 ? `L${pt(p)}` : `Q${r1(p[0] - 6)} ${r1(p[1] + 8)} ${pt(p)}`)).join('')}L${r1(b[0] + b[2])} ${r1(base + 8)}Z`;
  s += comic(gD, C.grass, { line: L.small, rim: [8, -5], glint: [-2, 2], hatch: 4.5, hatchWidth: 0.85 });
  for (const [f, sz, seed] of [[0.02, 30, 1], [0.12, 22, 2], [0.86, 26, 3], [0.97, 32, 4], [0.4, 14, 5], [0.58, 16, 6]] as const) s += tuft(g.x(f), base - 6, sz, rng.pick([C.grass, '#88b86c', C.grassLight]), seed);
  s += mushroom(g.x(0.07), base - 4, 34, C.pink) + mushroom(g.x(0.115), base - 2, 22, C.apricot) + mushroom(g.x(0.93), base - 4, 28, '#c3a3dc');
  // A snail on its way across.
  const sx = g.x(0.24);
  const sy = base - 8;
  s += comic(`M${sx - 26} ${sy}Q${sx - 30} ${sy - 7} ${sx - 22} ${sy - 9}L${sx + 6} ${sy - 9}Q${sx + 12} ${sy - 4} ${sx + 8} ${sy}Z`, '#d9c3a8', { line: L.detail, rim: [3, -1], glint: [-0.8, 0.8], over: ink(`M${sx - 22} ${sy - 9}q-3 -8 -6 -10M${sx - 18} ${sy - 9}q0 -8 2 -11`, L.fine, darkOf('#d9c3a8', 0.5)) + fill(ellipsePath(sx - 24, sy - 5, 1.2, 1.2), darkOf('#d9c3a8', 0.7)) });
  const spiral: Pt[] = [];
  for (let i = 0; i <= 22; i++) {
    const a = i * 0.5;
    spiral.push([sx - 2 + Math.cos(a) * (16 - i * 0.62), sy - 16 + Math.sin(a) * (15 - i * 0.6)]);
  }
  s += comic(ellipsePath(sx - 2, sy - 16, 16, 15), C.apricot, { line: L.detail, rim: [4, -2], glint: [-1.2, 1.2], hatch: 3.2, hatchWidth: 0.7, over: ink(smooth(spiral, 1, false), L.fine, darkOf(C.apricot, 0.45)) });
  const sp = sprout(b, g.x(0.5), base - 10, 20, 40, GEMS[5], 0.9, eye) + sprout(b, g.x(g.tall ? 0.9 : 0.82), base - 12, 24, 50, GEMS[0], 0.96, eye);
  return piece(Z.lip, 0.6, shadow(g, b, `<path d="${gD}"/>`, 46) + card(g, b, svg(b, s) + sp));
}

/** Footlights along the stage's front: paper cups that light up one by one. */
function lamps(g: Geo): string {
  const n = Math.max(4, Math.round(g.ow / 120));
  const y = g.F - 2;
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = g.x((i + 0.5) / n);
    const b: Box = [x - 40, y - 52, 80, 56];
    const art =
      chip(`M${r1(x - 12)} ${r1(y - 9)}Q${r1(x - 11)} ${r1(y - 23)} ${r1(x)} ${r1(y - 23)}Q${r1(x + 11)} ${r1(y - 23)} ${r1(x + 12)} ${r1(y - 9)}Z`, '#fff6d2', L.detail, ink(`M${r1(x + 3)} ${r1(y - 20)}Q${r1(x + 8)} ${r1(y - 18)} ${r1(x + 9)} ${r1(y - 13)}`, 1.6, '#ffffff'), '#c9a85a') +
      chip(`M${r1(x - 15)} ${r1(y - 10)}L${r1(x + 15)} ${r1(y - 10)}L${r1(x + 11)} ${r1(y + 2)}L${r1(x - 11)} ${r1(y + 2)}Z`, '#8e7f5c', L.detail, fill(`M${r1(x - 15)} ${r1(y - 10)}L${r1(x - 6)} ${r1(y - 10)}L${r1(x - 4)} ${r1(y + 2)}L${r1(x - 11)} ${r1(y + 2)}Z`, darkOf('#8e7f5c', 0.25)) + ink(`M${r1(x - 13)} ${r1(y - 8)}L${r1(x + 13)} ${r1(y - 8)}`, 1.1, lightOf('#8e7f5c', 0.5)));
    out += `<div class="ld-lamp" data-at="${+(0.06 + (i / n) * 0.86).toFixed(3)}" style="${place(b, g.box)};--sd:${((i / n) * 0.45).toFixed(2)}s"><i></i>${svg(b, art)}</div>`;
  }
  return `<div class="ld-z ld-fixed" style="--z:${Z.lamps};--c:${+((P - Z.lamps) / P).toFixed(4)}">${out}</div>`;
}

// ------------------------------------------------------------ the proscenium

/** The painted frame: pillars with crystal lozenges, a beam of stars and moons, a lace edge over the front board. */
function frame(g: Geo): string {
  const { W, H, pw, top, F } = g;
  const y0 = FRAME_TOP;
  const x0 = pw;
  const x1 = W - pw;
  const outer = roundPoly([[0, y0 + 10], [W / 2 - 160, y0], [W / 2 + 160, y0], [W, y0 + 10], [W, H], [0, H]], [34, 12, 12, 34, 8, 8]);
  const hole = `M${x0 + 46} ${top}Q${x0} ${top} ${x0} ${top + 46}L${x0} ${F}L${x1} ${F}L${x1} ${top + 46}Q${x1} ${top} ${x1 - 46} ${top}Z`;
  const d = outer + hole;
  let over = `<path d="${hole}" fill="none" stroke="${C.butter}" stroke-width="34"/><path d="${hole}" fill="none" stroke="${C.cream}" stroke-width="20"/>`;
  over += ink(hole, L.fine, darkOf(C.butter, 0.4));
  // The front board: a deeper band with a lace edge and painted gems.
  over += fill(`M0 ${F + 10}H${W}V${H}H0Z`, C.frameDeep);
  let lace = `M0 ${F + 10}`;
  for (let x = 0; x < W; x += 26) lace += `Q${x + 13} ${F + 30} ${x + 26} ${F + 10}`;
  over += comic(`${lace}V${F}H0Z`, C.cream, { line: L.fine, ink: darkOf(C.cream, 0.4) });
  for (let x = 0; x < W; x += 26) over += fill(ellipsePath(x + 13, F + 17, 2.4, 2.4), darkOf(C.cream, 0.2));
  const gems = Math.round((W - 120) / 90);
  for (let i = 0; i <= gems; i++) {
    const x = 60 + (i * (W - 120)) / gems;
    const c = GEMS[i % GEMS.length]!;
    over += gem(x, F + 54, 12, 14, c);
  }
  // Pillars: an inset panel with a column of lozenges and dots.
  for (const px of [12, W - pw + 12]) {
    over += comic(rrect(px, top + 18, pw - 24, F - top - 36, 10), lightOf(C.frame, 0.25), { line: L.detail, rim: [-3, -3], glint: [2, 2] });
    const n = Math.max(3, Math.floor((F - top - 70) / 72));
    for (let i = 0; i < n; i++) {
      const y = top + 52 + (i * (F - top - 100)) / Math.max(1, n - 1);
      const cx = px + (pw - 24) / 2;
      const s = Math.min(14, (pw - 30) / 2.4);
      over += gem(cx, y, s, s * 1.5, GEMS[(i + (px > W / 2 ? 2 : 0)) % GEMS.length]!);
      if (i < n - 1) over += fill(ellipsePath(cx, y + (F - top - 100) / Math.max(1, n - 1) / 2, 3, 3), C.butter);
    }
    // A capital: a butter band with a curl at each end.
    over += comic(rrect(px - 6, top - 6, pw - 12, 20, 6), C.butter, { line: L.detail, rim: [3, -2], glint: [-1, 1], over: ink(`M${px + 6} ${top + 4}q-4 -6 2 -8M${px + pw - 30} ${top + 4}q4 -6 -2 -8`, L.fine, darkOf(C.butter, 0.45)) });
  }
  // The beam: small stars and moons painted along it.
  const rng = new Rng(41);
  for (let x = 40; x < W - 30; x += 52) {
    const y = y0 + (top - y0) * 0.55 + rng.range(-8, 8);
    over += x % 104 < 52 ? fill(starD([x, y], 7, rng.range(0, 1)), C.butter, 0.9) : fill(`M${x - 5} ${y - 7}A8 8 0 1 0 ${x + 5} ${y + 7}A6 6 0 1 1 ${x - 5} ${y - 7}Z`, '#fff1c6', 0.85);
  }
  const art = comic(d, C.frame, { line: L.body, rim: [10, -6], glint: [-3.5, 3.5], hatch: 5.5, hatchWidth: 1, over });
  return piece(Z.frame, -0.05, shadow(g, g.box, `<path d="${d}"/>`, 64) + card(g, g.box, svg(g.box, art)));
}

/** A velvet drape, tied back; `--k` gathers it toward its side as the progress rises. */
function drape(g: Geo, side: -1 | 1): string {
  const ow = g.ow;
  const dw = ow * (g.tall ? 0.22 : 0.16) + 30;
  const top = g.top - 30;
  const ty = g.top + (g.F - g.top) * 0.55;
  const m = (x: number): number => (side < 0 ? x : g.W - x);
  const o = g.pw - 30;
  const pts: Pt[] = [
    [o, top],
    [o + dw, top],
    [o + dw * 0.9, top + (ty - top) * 0.45],
    [o + dw * 0.42, ty - 10],
    [o + dw * 0.36, ty + 8],
    [o + dw * 0.62, g.F - 50],
    [o + dw * 0.86, g.F + 4],
    [o, g.F + 4],
  ];
  const P2 = pts.map(([x, y]): Pt => [m(x), y]);
  const d = `M${pt(P2[0]!)}L${pt(P2[1]!)}Q${pt(P2[2]!)} ${pt(P2[3]!)}L${pt(P2[4]!)}Q${pt(P2[5]!)} ${pt(P2[6]!)}L${pt(P2[7]!)}Z`;
  // Folds run from the rod to the tie, then fan out to the hem.
  let folds = '';
  let shade = '';
  for (let i = 1; i <= 5; i++) {
    const f = i / 6;
    const a: Pt = [m(o + dw * f), top];
    const t: Pt = [m(o + dw * (0.04 + f * 0.3)), ty];
    const h: Pt = [m(o + dw * f * 0.84), g.F + 4];
    folds += `M${pt(a)}Q${r1(m(o + dw * f * 0.8))} ${r1((top + ty) / 2)} ${pt(t)}Q${r1(m(o + dw * f * 0.5))} ${r1((ty + g.F) / 2)} ${pt(h)}`;
    if (i % 2) shade += `M${pt(a)}L${r1(m(o + dw * (f + 0.06)))} ${top}Q${r1(m(o + dw * (f + 0.06) * 0.8))} ${r1((top + ty) / 2)} ${pt(t)}Q${r1(m(o + dw * (f + 0.06) * 0.5))} ${r1((ty + g.F) / 2)} ${r1(m(o + dw * (f + 0.06) * 0.84))} ${g.F + 4}L${pt(h)}Q${r1(m(o + dw * f * 0.5))} ${r1((ty + g.F) / 2)} ${pt(t)}Q${r1(m(o + dw * f * 0.8))} ${r1((top + ty) / 2)} ${pt(a)}Z`;
  }
  const tie: Pt = [m(o + dw * 0.22), ty];
  let art = comic(d, C.velvet, { line: L.body, rim: [9, -5], glint: [-2.5, 2.5], hatch: 5, hatchWidth: 0.9, shade, over: ink(folds, L.detail, darkOf(C.velvet, 0.36)) });
  // The tie-back cord and its tassel.
  art += chip(`M${r1(m(o - 4))} ${r1(ty - 6)}Q${pt(tie)} ${r1(m(o + dw * 0.44))} ${r1(ty - 2)}L${r1(m(o + dw * 0.44))} ${r1(ty + 8)}Q${r1(tie[0])} ${r1(ty + 12)} ${r1(m(o - 4))} ${r1(ty + 6)}Z`, C.butter, L.detail);
  const tx = m(o + dw * 0.44);
  art += chip(`M${r1(tx - 6)} ${r1(ty + 6)}L${r1(tx + 6)} ${r1(ty + 6)}L${r1(tx + 9)} ${r1(ty + 40)}L${r1(tx - 9)} ${r1(ty + 40)}Z`, C.butter, L.detail, ink(`M${r1(tx - 4)} ${r1(ty + 18)}L${r1(tx - 5)} ${r1(ty + 39)}M${r1(tx)} ${r1(ty + 18)}V${r1(ty + 39)}M${r1(tx + 4)} ${r1(ty + 18)}L${r1(tx + 5)} ${r1(ty + 39)}`, L.fine, darkOf(C.butter, 0.4)));
  art += chip(ellipsePath(tx, ty + 10, 7, 6), lightOf(C.butter, 0.2), L.detail, fill(ellipsePath(tx + 2.4, ty + 8, 2.4, 1.8), '#fffdf0'));
  const b: Box = side < 0 ? [o - 6, top - 4, dw + 20, g.F + 10 - top] : [g.W - o - dw - 14, top - 4, dw + 20, g.F + 10 - top];
  return piece(Z.drape, -0.04, card(g, b, `<div class="ld-drape ld-${side < 0 ? 'l' : 'r'}">${svg(b, art)}</div>`));
}

/** The valance: velvet swags across the top, butter tassels between. */
function valance(g: Geo): string {
  const x0 = g.pw - 20;
  const x1 = g.W - g.pw + 20;
  const n = Math.max(3, Math.round((x1 - x0) / 120));
  const sw = (x1 - x0) / n;
  const y = g.top - 26;
  let d = `M${x0} ${y - 10}H${x1}V${y}`;
  for (let i = n; i > 0; i--) d += `Q${r1(x0 + (i - 0.5) * sw)} ${r1(y + 70)} ${r1(x0 + (i - 1) * sw)} ${y}`;
  d += 'Z';
  let folds = '';
  for (let i = 0; i < n; i++) for (const k of [0.3, 0.55]) folds += `M${r1(x0 + i * sw + sw * 0.12)} ${r1(y + 4 + k * 20)}Q${r1(x0 + (i + 0.5) * sw)} ${r1(y + k * 70)} ${r1(x0 + (i + 1) * sw - sw * 0.12)} ${r1(y + 4 + k * 20)}`;
  let art = comic(d, '#dd91b9', { line: L.body, rim: [6, -5], glint: [-2, 2.4], hatch: 4.5, hatchWidth: 0.85, over: ink(folds, L.detail, darkOf('#dd91b9', 0.35)) });
  for (let i = 0; i <= n; i++) {
    const x = x0 + i * sw;
    art += chip(`M${r1(x - 5)} ${y + 2}L${r1(x + 5)} ${y + 2}L${r1(x + 8)} ${y + 32}L${r1(x - 8)} ${y + 32}Z`, C.butter, L.detail, ink(`M${r1(x - 3)} ${y + 14}V${y + 31}M${r1(x + 3)} ${y + 14}V${y + 31}`, L.fine, darkOf(C.butter, 0.4)));
    art += chip(ellipsePath(x, y + 4, 7, 6), lightOf(C.butter, 0.2), L.detail, fill(ellipsePath(x + 2.4, y + 2, 2.4, 1.8), '#fffdf0'));
  }
  const b: Box = [x0 - 10, y - 14, x1 - x0 + 20, 92];
  return piece(Z.valance, -0.03, card(g, b, `<div class="ld-val">${svg(b, art)}</div>`));
}

/** The title on a paper banner with folded tails, and the room's tag hanging under it. */
function banner(g: Geo): string {
  const bw = g.tall ? g.W * 0.84 : Math.min(g.W * 0.6, 660);
  const bh = g.tall ? 150 : 86;
  const cx = g.W / 2;
  const y = g.tall ? 22 : 14;
  const l = cx - bw / 2;
  const r = cx + bw / 2;
  const sag = 8;
  let art = '';
  for (const s of [-1, 1]) {
    const e = s < 0 ? l : r;
    const tail = polyD([[e - s * 30, y + 22], [e + s * 44, y + 22], [e + s * 30, y + bh / 2 + 12], [e + s * 44, y + bh + 22], [e - s * 30, y + bh + 22]]);
    art += comic(tail, '#e597bf', { line: L.small, rim: [6, -4], glint: [-1.6, 1.6], hatch: 4.2, hatchWidth: 0.8 });
    art += fill(polyD([[e - s * 2, y + bh], [e - s * 30, y + bh + 22], [e - s * 30, y + bh - 4]]), darkOf('#e597bf', 0.3));
  }
  const band = `M${l} ${y}Q${cx} ${y - sag} ${r} ${y}L${r} ${y + bh}Q${cx} ${y + bh - sag} ${l} ${y + bh}Z`;
  art += comic(band, C.cream, { line: L.body, rim: [10, -5], glint: [-2.5, 2.5], hatch: 5, hatchWidth: 0.85, over: ink(`M${l + 12} ${y + 9}Q${cx} ${y + 1} ${r - 12} ${y + 9}M${l + 12} ${y + bh - 9}Q${cx} ${y + bh - 17} ${r - 12} ${y + bh - 9}`, L.fine, darkOf(C.cream, 0.35)) });
  // The room's tag on a string.
  const tw = g.tall ? 150 : 124;
  const th = g.tall ? 44 : 36;
  const tagY = y + bh + 12;
  art += ink(`M${cx - 18} ${y + bh - 6}L${cx - 6} ${tagY + 6}M${cx + 18} ${y + bh - 6}L${cx + 6} ${tagY + 6}`, 1.4, darkOf(C.cream, 0.5));
  const tagBox: Box = [cx - tw / 2, tagY, tw, th];
  const tagArt = comic(rrect(cx - tw / 2, tagY, tw, th, 6), '#f7e9a8', { line: L.small, rim: [4, -3], glint: [-1.2, 1.2] }) + comic(ellipsePath(cx, tagY + 7, 3, 3), C.cream, { line: L.fine });
  const b: Box = [l - 52, y - 12, bw + 104, bh + th + 50];
  const title = comicTitle('Kristaller Dünyası').outerHTML;
  const html =
    `<div class="ld-title${g.tall ? ' ld-2' : ''}" style="${place([l + 18, y, bw - 36, bh], b)};--tf:${g.tall ? 56 : 46}">${title}</div>` +
    `<div class="ld-tag" style="${place(tagBox, b)}">${svg(tagBox, tagArt)}<span style="font-size:calc(var(--u) * ${g.tall ? 26 : 21})">14. Oda</span></div>`;
  return piece(Z.banner, -0.02, card(g, b, svg(b, art) + html, ' ld-ban'));
}

/** Paper confetti for the ta-da: strips, stars, little gems and dots flung up from the stage, fluttering down. */
function confetti(g: Geo): string {
  const rng = new Rng(77);
  const shapes = ['M-10 -5H10V5H-10Z', starD([0, 0], 12, 0), polyD([[0, -12], [7.5, 0], [0, 12], [-7.5, 0]]), ellipsePath(0, 0, 6, 6)];
  let out = '';
  for (let i = 0; i < 44; i++) {
    const a = -Math.PI / 2 + rng.range(-1.45, 1.45);
    const v = rng.range(0.16, 0.52);
    const col = rng.pick(CONFETTI);
    const art = `<path d="${shapes[i % 4]}" fill="${col}" stroke="${darkOf(col, 0.42)}" stroke-width="1.7" stroke-linejoin="round"/><path d="M1.5 -2.5h4" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".75"/>`;
    out += `<i class="ld-cf" style="--x:${r1(Math.cos(a) * v * g.ow)};--y:${r1(Math.sin(a) * v * g.H * 0.78)};--f:${r1(rng.range(0.28, 0.6) * g.H)};--r:${Math.round(rng.range(-1, 1) * 1000)}deg;--d:${rng.range(0, 0.1).toFixed(2)}s">${svg([-14, -14, 28, 28], art)}</i>`;
  }
  return `<div class="ld-z ld-fixed" style="--z:${Z.confetti};--c:${+((P - Z.confetti) / P).toFixed(4)}"><div class="ld-burst" style="left:50%;top:${pc(g.top + (g.F - g.top) * 0.56, g.H)}">${out}</div></div>`;
}

/**
 * The theatre's box behind the frame, in true 3D (no `--c`): the floor of
 * paper boards (grooves where the cards stand, darker to the back), and the
 * side walls and the ceiling, painted night inside. They meet the frame's
 * outer edges, so whatever reaches beyond them stays hidden as the stage
 * turns, and a turn shows a sliver of the inside of the box.
 */
function box(g: Geo): string {
  const k = (P - Z.frame) / P;
  const xl = g.W / 2 - (g.W / 2 - BOX_IN) * k;
  const yc = g.oy + (FRAME_TOP + BOX_IN + 6 - g.oy) * k;
  const w = g.W - xl * 2;
  const D = Z.frame - FLOOR[1];
  const hW = g.F3 - yc;
  // Just behind the frame, so their front edges never cut through it.
  const turn = (b: Box, origin: string, t: string, cls: string, inner = '', z: number = Z.frame - 3): string =>
    `<div class="${cls}" style="${place(b, g.box)};transform-origin:${origin};transform:translateZ(calc(var(--u) * ${z})) ${t}">${inner}</div>`;
  const fd = FLOOR[0] - FLOOR[1];
  const id = nextId('lfl');
  let s = `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.board}"/><stop offset=".5" stop-color="#a28aa2"/><stop offset="1" stop-color="#352949"/></linearGradient><rect x="${r1(xl)}" y="0" width="${r1(w)}" height="${fd}" fill="url(#${id})"/>`;
  let boards = '';
  for (let x = xl + 22; x < xl + w; x += 44) boards += `M${r1(x)} 0V${fd}`;
  s += ink(boards, 1.4, '#7d6577', 0.55);
  let grooves = '';
  for (const z of [Z.lip, Z.gorti, Z.mound, Z.mid, Z.far]) grooves += `M${r1(xl)} ${FLOOR[0] - z}H${r1(xl + w)}`;
  s += ink(grooves, 2, '#5b4560', 0.5);
  return (
    turn([xl, g.F3, w, fd], '50% 0', 'rotateX(-90deg)', 'ld-floor', svg([xl, 0, w, fd], s), FLOOR[0]) +
    turn([xl, yc, D, hW], '0 50%', 'rotateY(90deg)', 'ld-wall') +
    turn([g.W - xl - D, yc, D, hW], '100% 50%', 'rotateY(-90deg)', 'ld-wall') +
    turn([xl, yc, w, D], '50% 0', 'rotateX(-90deg)', 'ld-ceil')
  );
}

// ------------------------------------------------------------ the whole stage

export interface StageArt {
  html: string;
  /** The eye's height (perspective origin), percent of the theatre's height. */
  oy: string;
}

/** Builds the theatre for a screen shape. */
export function buildStage(kind: StageKind): StageArt {
  const g = new Geo(kind);
  const sz = Math.min(g.tall ? 150 : 132, g.ow * 0.2);
  const moon: Pt = [g.x(g.tall ? 0.28 : 0.21), g.top + (g.tall ? 116 : 92)];
  const sun: Pt = [g.x(g.tall ? 0.72 : 0.79), g.top + (g.tall ? 300 : 100)];
  const gt = gorti(g);
  const stars: [number, number, number, number, number, boolean][] = g.tall
    ? [[0.5, 120, 20, 0, -330, true], [0.38, 300, 13, 1, -250, false], [0.62, 360, 16, 3, -320, false], [0.12, 330, 12, 4, -280, false], [0.9, 400, 14, 2, -250, true], [0.3, 470, 11, 5, -335, false]]
    : [[0.36, 44, 17, 0, -330, true], [0.44, 150, 12, 1, -250, false], [0.53, 22, 15, 3, -320, false], [0.6, 128, 11, 4, -280, false], [0.29, 196, 10, 2, -250, false], [0.67, 54, 13, 5, -335, true]];
  let st = '';
  stars.forEach(([f, dy, r, c, z, face], i) => {
    st += hangStar(g, z, 0.07 + i * 0.035, [g.x(f), g.top + dy], r, [C.butter, '#f8c4dc', '#b6dcc6', '#c3cdf4', C.apricot, '#d8c6f2'][c]!, i * 0.7, face, i * 0.9 + 0.3);
  });
  const rig =
    box(g) +
    backdrop(g, moon, sun, sz / 2, sz / 2) +
    whale(g) +
    st +
    hangFace(g, 'moon', moon, sz, 0.12, 1.1) +
    hangFace(g, 'sun', sun, sz * 1.18, 0.19, 2.4) +
    farHills(g) +
    midHills(g, gt.eye) +
    mound(g, gt.eye) +
    gt.html +
    lip(g, gt.eye) +
    lamps(g) +
    drape(g, -1) +
    drape(g, 1) +
    valance(g) +
    frame(g) +
    banner(g) +
    confetti(g);
  return { html: `<div class="ld-rig"><div class="ld-rig2"><div class="ld-look">${rig}</div></div></div>`, oy: pc(g.oy, g.H) };
}
