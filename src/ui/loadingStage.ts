import { barkLines, hatchLines, roundPoly } from '../content/characters/kit';
import { CHILD } from '../content/characters/gortiChild';
import { skyFaceSvg } from '../content/characters/sky';
import { darkOf, lightOf, lineFor, SHADE } from '../render/2d/style';
import { blob, ellipsePath, limb, nextId, rrect, Rng, smooth, taper, type Pt } from '../render/2d/svg';
import { comicTitle } from './Menus';

// The loading screen's pop-up paper theatre, drawn by hand in code in the
// game's comic manner: pastel paper, every contour in its fill's own darker
// tone, cel shadows low on the left with a little hatching, glints high on
// the right (the light comes from the upper right, in front).
//
// The theatre is a stack of flat layers, one per depth, each drawn as it
// shows through the proscenium from an eye P units away. The pointer slides
// the layers against each other, the near ones one way and the far ones the
// other (`data-p`, see LoadingView), so the box shows its depth. A layer's
// cards are hinged at the floor and pop up when the progress reaches them
// (`data-at`); hanging things are let down on their threads; crystals
// sprout one by one, and Gorti glances at each (`data-g`: where it is from
// his screen).
//
// It shares the machine with the game rasterizing its atlases, so it is
// drawn to be cheap to paint: no masks, filters or blend modes (a shape's
// comic shading is cut by one clip, in tones worked out here), shadows are
// soft gradients, repeated marks are single paths, every card is painted
// once, and nothing moves inside an SVG.

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
const Z = { sky: -390, whale: -365, face: -300, far: -265, mid: -175, mound: -80, gorti: 0, shade: 56, lip: 70, lamps: 98, drape: 106, valance: 113, frame: 120, banner: 134, confetti: 150 } as const;
/** How far the pointer slides a layer: units per unit of depth (across, and up and down), from the depth that stays put. */
const SLIDE = { x: 0.08, y: 0.05, z: -60 } as const;
/** Contour widths, units. */
const L = { body: 3.4, small: 2.5, detail: 1.7, fine: 1.15 } as const;
/** The shadows' ink. */
const DUSK = '#12081f';

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
interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
/** A layer of the theatre and its place in the stack (back to front). */
interface Layer {
  key: number;
  html: string;
}
/**
 * How a layer slides with the pointer (lx, ly in -1…1): its point (x, y)
 * moves lx·(a0 + a1·x + a2·y) across and ly·(b0 + b1·x + b2·y) down, in
 * units. Cards stand at one depth and simply move; the floor and the walls
 * run back through the depths, so they shear.
 */
type Slide = readonly [number, number, number, number, number, number];

const r1 = (v: number): string => (Math.round(v * 10) / 10).toString();
const r2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const pt = ([x, y]: Pt): string => `${r1(x)} ${r1(y)}`;
const polyD = (pts: readonly Pt[]): string => `M${pts.map(pt).join('L')}Z`;
const pc = (v: number, of: number): string => `${+((v / of) * 100).toFixed(3)}%`;
/** Inline style laying box `b` in box `rel`. */
const place = (b: Box, rel: Box): string => `left:${pc(b[0] - rel[0], rel[2])};top:${pc(b[1] - rel[1], rel[3])};width:${pc(b[2], rel[2])};height:${pc(b[3], rel[3])}`;
const svg = (b: Box, body: string, attrs = ''): string => `<svg viewBox="${b.map(r1).join(' ')}"${attrs} aria-hidden="true">${body}</svg>`;
/** A plain fill (its opacity goes on the paint, so it needs no layer of its own). */
const fill = (d: string, color: string, o = 1): string => `<path d="${d}" fill="${color}"${o !== 1 ? ` fill-opacity="${o}"` : ''}/>`;
/** A line in one colour (its opacity on the paint). */
const ink = (d: string, w: number, color: string, o = 1): string => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o !== 1 ? ` stroke-opacity="${o}"` : ''}/>`;
/**
 * A small paper shape drawn plainly: its fill and its contour in the fill's
 * own darker tone; `over` adds a glint or a little shading by hand.
 */
const chip = (d: string, color: string, line: number = L.fine, over = '', edge = lineFor(color)): string => `<path d="${d}" fill="${color}" stroke="${edge}" stroke-width="${line}" stroke-linejoin="round"/>${over}`;

// ------------------------------------------------------------ path tools

const ARITY: Readonly<Record<string, number>> = { m: 2, l: 2, t: 2, h: 1, v: 1, c: 6, s: 4, q: 4, a: 7, z: 0 };

/** Path data as commands with their numbers (implicit repeats spelt out). */
function segs(d: string): [string, number[]][] {
  const tok = d.match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) ?? [];
  const out: [string, number[]][] = [];
  let cmd = '';
  for (let i = 0; i < tok.length; ) {
    const t = tok[i]!;
    if (/[a-zA-Z]/.test(t)) {
      cmd = t;
      i++;
      if (ARITY[cmd.toLowerCase()] === 0) out.push([cmd, []]);
      continue;
    }
    const n = ARITY[cmd.toLowerCase()] ?? 0;
    if (!n || i + n > tok.length) break;
    out.push([cmd, tok.slice(i, i + n).map(Number)]);
    i += n;
    // A moveto's further pairs are linetos.
    if (cmd === 'M') cmd = 'L';
    else if (cmd === 'm') cmd = 'l';
  }
  return out;
}

/** Which of a command's numbers are x (1), y (2) or neither (0). */
function axes(cmd: string, n: number): number[] {
  switch (cmd.toLowerCase()) {
    case 'h':
      return [1];
    case 'v':
      return [2];
    case 'a':
      return [0, 0, 0, 0, 0, 1, 2];
    default:
      return Array.from({ length: n }, (_, k) => (k % 2 ? 2 : 1));
  }
}

/** The path `d` moved by (dx, dy): its absolute coordinates shifted (relative ones follow). */
function shiftD(d: string, dx: number, dy: number): string {
  return segs(d)
    .map(([cmd, a], i) => {
      const abs = cmd === cmd.toUpperCase() || (i === 0 && cmd === 'm');
      const ax = axes(cmd, a.length);
      return cmd + a.map((v, k) => r2(abs && ax[k] === 1 ? v + dx : abs && ax[k] === 2 ? v + dy : v)).join(' ');
    })
    .join('');
}

/** A box round a path (through its control points: a little generous). */
function pathBox(d: string): Rect {
  const b: Rect = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  const add = (x: number, y: number): void => {
    b.x0 = Math.min(b.x0, x);
    b.y0 = Math.min(b.y0, y);
    b.x1 = Math.max(b.x1, x);
    b.y1 = Math.max(b.y1, y);
  };
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  for (const [cmd, a] of segs(d)) {
    const rel = cmd !== cmd.toUpperCase();
    const ox = rel ? cx : 0;
    const oy = rel ? cy : 0;
    switch (cmd.toLowerCase()) {
      case 'z':
        cx = sx;
        cy = sy;
        break;
      case 'h':
        cx = a[0]! + ox;
        add(cx, cy);
        break;
      case 'v':
        cy = a[0]! + oy;
        add(cx, cy);
        break;
      case 'a': {
        const [rx = 0, ry = 0] = a;
        add(cx - rx, cy - ry);
        add(cx + rx, cy + ry);
        cx = a[5]! + ox;
        cy = a[6]! + oy;
        add(cx - rx, cy - ry);
        add(cx + rx, cy + ry);
        break;
      }
      default:
        for (let k = 0; k < a.length; k += 2) add(a[k]! + ox, a[k + 1]! + oy);
        cx = a[a.length - 2]! + ox;
        cy = a[a.length - 1]! + oy;
        if (cmd.toLowerCase() === 'm') {
          sx = cx;
          sy = cy;
        }
    }
  }
  return b;
}

/** Two colours multiplied channel by channel (a multiplied shade over a flat fill, worked out once). */
function mul(a: string, b: string): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(a) || !/^#[0-9a-fA-F]{6}$/.test(b)) return a;
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number): number => Math.round((((pa >> s) & 255) * ((pb >> s) & 255)) / 255);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}

// ------------------------------------------------------------ the paper look

interface PaperOpts {
  /** Contour width (0: none) and colour (default: the fill's own dark tone). */
  line?: number;
  ink?: string;
  /** The cel shadow: what the shape moved this far toward the light leaves uncovered. */
  rim?: readonly [number, number];
  /** The glint: what the shape moved this far away from the light leaves uncovered. */
  glint?: readonly [number, number];
  /** Hatching in the shadow: line gap and width, over the shape's box or `hatchBox`. */
  hatch?: number;
  hatchWidth?: number;
  hatchBox?: Rect;
  /** The shadow's tone (multiplied into the fill). */
  tone?: string;
  /** More shadow, drawn by hand. */
  shade?: string;
  /** Patches inside the shape, and the same patches in the shadow's tones (where the rim falls on them). */
  inner?: string;
  innerShade?: string;
  /** Marks over it all, inside the shape. */
  over?: string;
}

/**
 * A shape in the comic manner of the game's kit, cut without masks or
 * blending: inside one clip to the shape go its shadow tone (the fill
 * multiplied by the tone) with the hatching, the fill moved toward the light
 * over them, and the glint as an even-odd band; then the contour.
 */
function paper(d: string, color: string, o: PaperOpts = {}): string {
  const id = nextId('lp');
  const tone = mul(color, o.tone ?? SHADE.cool);
  let s = `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">`;
  if (o.rim) {
    const lit = shiftD(d, o.rim[0], o.rim[1]);
    s += fill(d, tone) + (o.innerShade ?? '');
    if (o.hatch) s += hatchLines(o.hatchBox ?? pathBox(d), o.hatch, mul(color, SHADE.hatch), o.hatchWidth);
    if (o.innerShade) {
      // The lit part is a clip of its own, so the patches are lit there and shaded in the rim.
      const id2 = nextId('lq');
      s += `<clipPath id="${id2}"><path d="${lit}"/></clipPath><g clip-path="url(#${id2})">${fill(d, color)}${o.inner ?? ''}</g>`;
    } else s += fill(lit, color) + (o.inner ?? '');
  } else s += fill(d, color) + (o.inner ?? '');
  if (o.shade) s += fill(o.shade, tone);
  if (o.glint) {
    const b = pathBox(d);
    const m = 4 + Math.abs(o.glint[0]) + Math.abs(o.glint[1]);
    s += `<path d="M${r1(b.x0 - m)} ${r1(b.y0 - m)}H${r1(b.x1 + m)}V${r1(b.y1 + m)}H${r1(b.x0 - m)}Z${shiftD(d, o.glint[0], o.glint[1])}" fill-rule="evenodd" fill="${lightOf(color)}"/>`;
  }
  s += `${o.over ?? ''}</g>`;
  const line = o.line ?? L.small;
  if (line > 0) s += ink(d, line, o.ink ?? lineFor(color));
  return s;
}

/** A limb in the paper manner (as the kit's comicLimb): shaded along its back, a glint down its front. */
function paperLimb(a: Pt, b: Pt, wa: number, wb: number, color: string, o: PaperOpts & { bulge?: number } = {}): string {
  const w = (wa + wb) / 2;
  const { bulge, ...rest } = o;
  return paper(limb(a, b, wa, wb, bulge ?? 0.4), color, { rim: [w * 0.34, -w * 0.12], glint: [-w * 0.1, w * 0.1], hatch: w > 9 ? 2.3 : 0, ...rest });
}

/** A soft shadow: a dark gradient, even in the middle and fading out at the edge (in place of a blurred shape). */
function softShadow(cx: number, cy: number, rx: number, ry: number, a: number, even = 0.4): string {
  const id = nextId('lss');
  const stop = (at: number, o: number): string => `<stop offset="${r2(at)}" stop-color="${DUSK}" stop-opacity="${r2(o)}"/>`;
  return `<radialGradient id="${id}">${stop(0, a)}${stop(even, a * 0.94)}${stop((even + 1) / 2, a * 0.45)}${stop(1, 0)}</radialGradient><ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="url(#${id})"/>`;
}

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
  /** The floor's height in the box (it shows at F at its front). */
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

  /** Where a point of the box at depth z shows (x, y as on the frame's plane). */
  proj(x: number, y: number, z: number): Pt {
    const k = P / (P - z);
    return [this.W / 2 + (x - this.W / 2) * k, this.oy + (y - this.oy) * k];
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

  /** Where a card at depth z ends on the left: a little into the wall, which hides its end. */
  edge(z: number): number {
    const w = this.wall(z);
    return Math.min(w - 2, Math.max(w - 24, (Z.frame - z) * 0.18));
  }

  /** A card's box spanning the box from wall to wall at depth z, from y up `h` units. */
  span(z: number, y: number, h: number): Box {
    const e = this.edge(z);
    return [e, y, this.W - e * 2, h];
  }

  /** Where threads hang from: behind the top beam. */
  get thread(): number {
    return this.top - 30;
  }

  /** The whale's height in the sky. */
  get whaleY(): number {
    return this.top + (this.tall ? 150 : 74);
  }
}

// ------------------------------------------------------------ layers and cards

/** How far a point at depth z slides (across, down) when the pointer is fully over to one side and down. */
const slideOf = (z: number): [number, number] => [-SLIDE.x * (z - SLIDE.z), -SLIDE.y * (z - SLIDE.z)];

/** The slide of a layer at one depth. */
function slideAt(z: number): Slide {
  const [sx, sy] = slideOf(z);
  return [sx, 0, 0, sy, 0, 0];
}

const layer = (key: number, slide: Slide, inner: string, when?: number): Layer => ({
  key,
  html: `<div class="ld-z"${when === undefined ? '' : ` data-at="${when}"`} data-p="${slide.map((v) => +v.toFixed(5)).join(' ')}">${inner}</div>`,
});

/** A depth layer: all in it stands at depth z and comes up at `when` (0…1). */
const piece = (z: number, when: number, inner: string): Layer => layer(z, slideAt(z), inner, when);

/** A layer that is there from the start. */
const fixed = (z: number, inner: string): Layer => layer(z, slideAt(z), inner);

/** A paper card in a layer, hinged at its base. */
const card = (g: Geo, b: Box, inner: string, cls = ''): string => `<div class="ld-card${cls}" style="${place(b, g.box)}">${inner}</div>`;

/** Swings and bobs on its thread, from the top of its card. */
const bob = (inner: string, delay: number): string => `<div class="ld-bob" style="--d:${-delay}s">${inner}</div>`;

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

/**
 * Cut gems (cx, cy, rx, ry, colour): lozenges of four facets lit from the
 * upper right, with a glint. Gems of a colour share their paths.
 */
function gems(list: readonly (readonly [number, number, number, number, string])[]): string {
  const by = new Map<string, string[]>();
  let glint = '';
  let gw = 1;
  for (const [cx, cy, rx, ry, color] of list) {
    const t: Pt = [cx, cy - ry];
    const r: Pt = [cx + rx, cy];
    const b: Pt = [cx, cy + ry];
    const l: Pt = [cx - rx, cy];
    const c: Pt = [cx + rx * 0.14, cy - ry * 0.1];
    const f = by.get(color) ?? by.set(color, ['', '', '', '', '']).get(color)!;
    f[0] += polyD([l, t, c]);
    f[1] += polyD([t, r, c]);
    f[2] += polyD([r, b, c]);
    f[3] += polyD([b, l, c]);
    f[4] += polyD([t, r, b, l]);
    glint += `M${pt([cx + rx * 0.22, cy - ry * 0.6])}L${pt([cx + rx * 0.52, cy - ry * 0.26])}`;
    gw = Math.max(1, rx * 0.12);
  }
  let s = '';
  for (const [color, f] of by) s += fill(f[0]!, lightOf(color, 0.22)) + fill(f[1]!, lightOf(color, 0.6)) + fill(f[2]!, color) + fill(f[3]!, darkOf(color, 0.2)) + ink(f[4]!, L.detail, lineFor(color));
  return glint ? s + ink(glint, gw, '#ffffff', 0.8) : s;
}

/** Sleepy face: shut eyes, a small smile, rosy cheeks (for stars and the like). */
function sleepy(c: Pt, r: number, color: string): string {
  const [x, y] = c;
  const e = r * 0.24;
  const lines = `M${r1(x - e * 1.7)} ${r1(y)}q${r1(e * 0.6)} ${r1(e * 0.6)} ${r1(e * 1.2)} 0M${r1(x + e * 0.5)} ${r1(y)}q${r1(e * 0.6)} ${r1(e * 0.6)} ${r1(e * 1.2)} 0M${r1(x - e * 0.45)} ${r1(y + e * 1.1)}q${r1(e * 0.45)} ${r1(e * 0.5)} ${r1(e * 0.9)} 0`;
  return ink(lines, L.fine, color) + fill(ellipsePath(x - e * 1.9, y + e * 0.9, e * 0.55, e * 0.35) + ellipsePath(x + e * 1.9, y + e * 0.9, e * 0.55, e * 0.35), '#f39ab9', 0.7);
}

/** A crystal standing at (cx, base), leaning `lean` degrees. */
interface Crystal {
  cx: number;
  base: number;
  w: number;
  h: number;
  color: string;
  line?: number;
  lean?: number;
}

/**
 * Crystals: six-sided prisms with pointed tops, their facets lit from the
 * upper right (the left ones in shade, hatched), a glint up the lit face,
 * the contour in their own darker tone. The facets fill each one, so it
 * needs no clip; crystals of a colour share their paths.
 */
function crystals(list: readonly Crystal[]): string {
  const by = new Map<string, { color: string; line: number; glint: number; d: string[] }>();
  for (const k of list) {
    const { cx, base, w, h, color } = k;
    const line = k.line ?? L.small;
    const glint = Math.max(1.2, w * 0.07);
    const turn = ((k.lean ?? 0) * Math.PI) / 180;
    const cos = Math.cos(turn);
    const sin = Math.sin(turn);
    const T = ([x, y]: Pt): Pt => [cx + (x - cx) * cos - (y - base) * sin, base + (x - cx) * sin + (y - base) * cos];
    const poly = (pts: Pt[]): string => polyD(pts.map(T));
    const l = cx - w / 2;
    const r = cx + w / 2;
    const a = l + w * 0.3;
    const b = r - w * 0.26;
    const tip: Pt = [cx + w * 0.05, base - h];
    const sl: Pt = [l, base - h * 0.68];
    const sa: Pt = [a, base - h * 0.62];
    const sb: Pt = [b, base - h * 0.64];
    const sr: Pt = [r, base - h * 0.7];
    const key = `${color} ${line} ${r1(glint)}`;
    const g = by.get(key) ?? by.set(key, { color, line, glint, d: Array.from({ length: 9 }, () => '') }).get(key)!;
    g.d[0] += poly([[l, base], sl, tip, sr, [r, base]]);
    g.d[1] += poly([[l, base], sl, sa, [a, base]]);
    g.d[2] += poly([sl, tip, sa]);
    g.d[3] += poly([sa, tip, sb]);
    g.d[4] += poly([sb, tip, sr]);
    g.d[5] += poly([[b, base], sb, sr, [r, base]]);
    // Hatching in the shaded face.
    for (let y = base - 3; y > sl[1] + 4; y -= 4.2) g.d[6] += `M${pt(T([l, y]))}L${pt(T([a, y - (a - l) * 0.55]))}`;
    g.d[7] += `M${pt(T(sl))}L${pt(T(sa))}L${pt(T(sb))}L${pt(T(sr))}M${pt(T(tip))}L${pt(T(sa))}L${pt(T([a, base]))}M${pt(T(tip))}L${pt(T(sb))}L${pt(T([b, base]))}`;
    g.d[8] += `M${pt(T([r - w * 0.12, sr[1] + h * 0.08]))}L${pt(T([r - w * 0.12, base - h * 0.12]))}`;
  }
  let s = '';
  for (const { color, line, glint, d } of by.values()) {
    const edge = darkOf(color, 0.42);
    s += fill(d[0]!, color) + fill(d[1]!, darkOf(color, 0.2)) + fill(d[2]!, darkOf(color, 0.08)) + fill(d[3]!, lightOf(color, 0.42)) + fill(d[4]!, lightOf(color, 0.68)) + fill(d[5]!, lightOf(color, 0.3));
    if (d[6]) s += ink(d[6], 0.8, edge, 0.8);
    s += ink(d[7]!, L.fine, edge) + ink(d[8]!, glint, '#ffffff', 0.85) + ink(d[0]!, line, lineFor(color));
  }
  return s;
}

/**
 * A crystal that sprouts at `when`, its tip sparkling; Gorti looks at it
 * from `eye`. It stands in its layer in front of its card.
 */
function sprout(g: Geo, cx: number, base: number, w: number, h: number, color: string, when: number, eye: Pt): string {
  const b: Box = [cx - w / 2 - 4, base - h - 4, w + 8, h + 6];
  const at = `${Math.round(cx - eye[0])},${Math.round(base - h * 0.7 - eye[1])}`;
  const spark: Box = [cx + w * 0.05 - 16, base - h - 16, 32, 32];
  return `<div class="ld-cr" data-at="${when}" data-g="${at}" style="${place(b, g.box)}">${svg(b, crystals([{ cx, base, w, h, color }]))}</div><i class="ld-spark" style="${place(spark, g.box)};--sd:${((cx / g.W) * 0.5).toFixed(2)}s">${svg([-10, -10, 20, 20], fill(twinkleD([0, 0], 10), '#fff8d8'))}</i>`;
}

/** A little cluster of crystals on a slope. */
function outcrop(x: number, base: number, s: number, seed: number): Crystal[] {
  const rng = new Rng(seed);
  return ([[-0.55, 0.62, -16], [0.5, 0.7, 14], [0, 1, 2]] as const).map(([dx, k, lean]) => ({ lean: lean + rng.range(-4, 4), cx: x + dx * s * 0.8, base: base + 2, w: s * 0.45 * k, h: s * k, color: rng.pick(GEMS), line: L.detail }));
}

/** A grass tuft: a few tapered blades, cut as one piece. */
function tuft(x: number, y: number, s: number, color: string, seed: number): string {
  const rng = new Rng(seed);
  let d = '';
  for (let i = -2; i <= 2; i++) {
    const a = -Math.PI / 2 + i * 0.34 + rng.range(-0.12, 0.12);
    const len = s * (1 - Math.abs(i) * 0.18) * rng.range(0.85, 1.1);
    const bend = i * 0.18 + 0.12;
    const m: Pt = [x + Math.cos(a) * len * 0.55, y + Math.sin(a) * len * 0.55];
    const t: Pt = [m[0] + Math.cos(a + bend) * len * 0.45, m[1] + Math.sin(a + bend) * len * 0.45];
    d += taper([[x + i * 2, y + 2], m, t], s * 0.16, 0.4);
  }
  return chip(d, color);
}

/** A spotted mushroom. */
function mushroom(x: number, y: number, s: number, cap: string): string {
  let out = chip(`M${r1(x - s * 0.16)} ${r1(y)}Q${r1(x - s * 0.2)} ${r1(y - s * 0.5)} ${r1(x - s * 0.1)} ${r1(y - s * 0.62)}L${r1(x + s * 0.12)} ${r1(y - s * 0.62)}Q${r1(x + s * 0.2)} ${r1(y - s * 0.4)} ${r1(x + s * 0.18)} ${r1(y)}Z`, C.cream, L.detail, ink(`M${r1(x - s * 0.08)} ${r1(y - s * 0.06)}Q${r1(x - s * 0.12)} ${r1(y - s * 0.34)} ${r1(x - s * 0.04)} ${r1(y - s * 0.56)}`, s * 0.07, darkOf(C.cream, 0.16)));
  let dots = '';
  for (const [dx, dy, r] of [[-0.3, -0.78, 0.09], [0.08, -0.9, 0.11], [0.36, -0.72, 0.07]] as const) dots += ellipsePath(x + dx * s, y + dy * s, r * s, r * s * 0.8);
  const lit = ink(`M${r1(x + s * 0.12)} ${r1(y - s * 0.98)}Q${r1(x + s * 0.42)} ${r1(y - s * 0.92)} ${r1(x + s * 0.47)} ${r1(y - s * 0.68)}`, s * 0.06, lightOf(cap, 0.6));
  out += chip(`M${r1(x - s * 0.55)} ${r1(y - s * 0.56)}Q${r1(x - s * 0.5)} ${r1(y - s * 1.08)} ${r1(x)} ${r1(y - s * 1.06)}Q${r1(x + s * 0.52)} ${r1(y - s * 1.04)} ${r1(x + s * 0.55)} ${r1(y - s * 0.58)}Q${r1(x)} ${r1(y - s * 0.46)} ${r1(x - s * 0.55)} ${r1(y - s * 0.56)}Z`, cap, L.detail, fill(dots, '#fffaf2') + lit);
  return out;
}

// ------------------------------------------------------------ the box

/**
 * The theatre's box behind the frame, in perspective: the floor of paper
 * boards (grooves where the cards stand, darker to the back) and the side
 * walls, painted inside as the night. They are there from the start. A wall
 * runs back through the depths, so it is cut into slices laid between the
 * layers it stands among: each hides the ends of the cards behind it.
 */
function room(g: Geo): Layer[] {
  const k = (P - Z.frame) / P;
  const xl = g.W / 2 - (g.W / 2 - BOX_IN) * k;
  const xr = g.W - xl;
  const yc = g.oy + (FRAME_TOP + BOX_IN + 6 - g.oy) * k;
  const zf = Z.frame - 3;
  const zb = FLOOR[1];
  const p = (x: number, y: number, z: number): Pt => g.proj(x, y, z);
  const flat = (b: Box, s: string): string => svg(b, s, ` class="ld-flat" style="${place(b, g.box)}"`);
  const out: Layer[] = [];

  // The floor; as it slides it shears, each line across it at its own depth.
  const yF = p(xl, g.F3, FLOOR[0])[1];
  const yB = p(xl, g.F3, zb)[1];
  const id = nextId('lfl');
  const mid = (yF - p(xl, g.F3, (FLOOR[0] + zb) / 2)[1]) / (yF - yB);
  let s = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${r1(yF)}" x2="0" y2="${r1(yB)}"><stop offset="0" stop-color="${C.board}"/><stop offset="${r2(mid)}" stop-color="#a28aa2"/><stop offset="1" stop-color="#352949"/></linearGradient>`;
  s += fill(polyD([p(xl, g.F3, FLOOR[0]), p(xr, g.F3, FLOOR[0]), p(xr, g.F3, zb), p(xl, g.F3, zb)]), `url(#${id})`);
  let boards = '';
  for (let x = xl + 22; x < xr; x += 44) boards += `M${pt(p(x, g.F3, FLOOR[0]))}L${pt(p(x, g.F3, zb))}`;
  s += ink(boards, 1.2, '#7d6577', 0.55);
  let grooves = '';
  for (const z of [Z.lip, Z.gorti, Z.mound, Z.mid, Z.far]) grooves += `M${pt(p(xl, g.F3, z))}L${pt(p(xr, g.F3, z))}`;
  s += ink(grooves, 1.8, '#5b4560', 0.5);
  const fb: Box = [xl - 2, yB - 2, xr - xl + 4, yF - yB + 4];
  const [fx1, fy1] = slideOf(Z.mound);
  const [fx2, fy2] = slideOf(FLOOR[0]);
  const y1 = g.base(Z.mound);
  const a2 = (fx2 - fx1) / (yF - y1);
  const b2 = (fy2 - fy1) / (yF - y1);
  out.push(layer(-1000, [fx1 - a2 * y1, 0, a2, fy1 - b2 * y1, 0, b2], flat(fb, s)));

  // The walls, in slices: behind the far hills, between them and the near
  // hills, and from there to the front. Each shears as it slides.
  const Yt = p(xl, yc, Z.face)[1];
  const Yb = p(xl, g.F3, Z.face)[1];
  for (const [z1, z2, key] of [[zb, Z.far, Z.far - 1], [Z.far - 3, Z.mid, Z.mid - 1], [Z.mid - 3, zf, Z.mid + 1]] as const) {
    for (const x of [xl, xr]) {
      const poly = [p(x, yc, z2), p(x, g.F3, z2), p(x, g.F3, z1), p(x, yc, z1)];
      const xs = poly.map((q) => q[0]);
      const ys = poly.map((q) => q[1]);
      const b: Box = [Math.min(...xs) - 1, Math.min(...ys) - 1, Math.max(...xs) - Math.min(...xs) + 2, Math.max(...ys) - Math.min(...ys) + 2];
      const gid = nextId('lwl');
      let w = `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${r1(Yt)}" x2="0" y2="${r1(Yb)}"><stop offset="0" stop-color="#2e2454"/><stop offset=".55" stop-color="#3b2a5c"/><stop offset="1" stop-color="#6b5690"/></linearGradient>`;
      w += fill(polyD(poly), `url(#${gid})`);
      // Painted stars, seen edge-on (only where the wall shows in the opening).
      const dots = (step: number, rows: number, s0: number, t0: number, r: number): string => {
        let d = '';
        for (let ds = s0; ds <= zf - zb; ds += step) {
          const z = zf - ds;
          if (z < z1 || z > z2) continue;
          for (let t = t0; t <= g.F3 - yc - 4; t += rows) {
            const [X, Y] = p(x, yc + t, z);
            if (X < g.pw - 2 || X > g.W - g.pw + 2) continue;
            const kk = P / (P - z);
            d += ellipsePath(X, Y, Math.max(0.55, r * kk * 0.35), r * kk);
          }
        }
        return d;
      };
      const yel = dots(61, 47, 0, 0, 1.4);
      const pink = dots(83, 59, 23, 19, 1.1);
      if (yel) w += fill(yel, '#f6e7a6', 0.8);
      if (pink) w += fill(pink, '#f8c6dc', 0.6);
      const Xa = p(x, 0, z1)[0];
      const Xb = p(x, 0, z2)[0];
      const [sa, ta] = slideOf(z1);
      const [sb, tb] = slideOf(z2);
      const a1 = (sb - sa) / (Xb - Xa);
      const b1 = (tb - ta) / (Xb - Xa);
      out.push(layer(key, [sa - a1 * Xa, a1, 0, ta - b1 * Xa, b1, 0], flat(b, w)));
    }
  }
  return out;
}

// ------------------------------------------------------------ the sky

/** The night backdrop: deep plum paper, cut-paper halos round the Moon and the Sun, brush swirls, painted stars, the whale's wire. */
function backdrop(g: Geo, moon: Pt, sun: Pt, rMoon: number, rSun: number): Layer {
  // Its top stays behind the frame's beam.
  const y0 = g.top - 26;
  const b = g.span(Z.sky, y0, g.base(Z.sky) + 2 - y0);
  const [x, y, w, h] = b;
  const rng = new Rng(11);
  const id = nextId('lsk');
  let s = `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#31265a"/><stop offset=".55" stop-color="#3b2a5c"/><stop offset="1" stop-color="#4b2b5d"/></linearGradient>`;
  s += `<linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e5a94" stop-opacity="0"/><stop offset="1" stop-color="#7a6399" stop-opacity=".75"/></linearGradient>`;
  s += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="url(#${id})"/>`;
  // Brush swirls, a little paler than the paper.
  let swirls = '';
  for (let i = 0; i < (g.tall ? 4 : 5); i++) {
    const cx = g.x(0.08 + (i / (g.tall ? 3 : 4)) * 0.84) + rng.range(-20, 20);
    const cy = g.top + (g.base(Z.sky) - g.top) * rng.range(0.36, 0.62);
    const pts: Pt[] = [];
    for (let k = 0; k <= 16; k++) {
      const a = k * 0.62 + i;
      const rr = rng.range(30, 42) * (1 - k / 22);
      pts.push([cx + Math.cos(a) * rr * 1.5, cy + Math.sin(a) * rr * 0.7]);
    }
    swirls += smooth(pts, 1, false);
  }
  s += ink(swirls, 3, '#4c3a72', 0.75);
  // Cut-paper halos round the Moon and the Sun: rings of paper, each a shade lighter.
  const halo = (c: Pt, R: number, cols: readonly string[]): string =>
    cols.map((col, k) => `<path d="${blob(c[0], c[1], R * (1 - k * 0.2), R * (1 - k * 0.2), rng, 16, 0.04)}" fill="${col}" stroke="${darkOf(col, 0.3)}" stroke-width="${L.detail}"/>`).join('');
  s += halo(moon, rMoon * 1.75, ['#3f336b', '#483d79', '#534888']) + halo(sun, rSun * 1.6, ['#4c3168', '#58386d', '#654272']);
  // Painted stars and dots, one path per colour.
  const cols = ['#f6e7a6', '#f8c6dc', '#c9ecea', '#e4d8f6'] as const;
  const stars = cols.map(() => '');
  const dots = cols.map(() => '');
  const n = Math.round((w * h) / 9000);
  for (let i = 0; i < n; i++) {
    const q: Pt = [x + rng.range(20, w - 20), y + rng.range(20, h * 0.8)];
    const c = Math.floor(rng.next() * cols.length);
    if (rng.chance(0.35)) stars[c] += twinkleD(q, rng.range(3.5, 6.5));
    else dots[c] += ellipsePath(q[0], q[1], 1.6, 1.6);
  }
  cols.forEach((c, i) => {
    if (stars[i]) s += fill(stars[i]!, c, 0.9);
    if (dots[i]) s += fill(dots[i]!, c, 0.75);
  });
  // The horizon's glow, low down.
  s += `<rect x="${r1(x)}" y="${r1(y + h * 0.55)}" width="${r1(w)}" height="${r1(h * 0.45)}" fill="url(#${id}h)"/>`;
  // The whale's wire, across.
  s += ink(`M${r1(x)} ${r1(g.whaleY - 26)}L${r1(x + w)} ${r1(g.whaleY - 26)}`, 1.1, C.thread, 0.3);
  return piece(Z.sky, 0.03, card(g, b, svg(b, s)));
}

/** A paper star let down on a thread, swinging. */
function hangStar(g: Geo, z: number, when: number, c: Pt, r: number, color: string, rot: number, face: boolean, delay: number): Layer {
  const t = g.thread;
  const b: Box = [c[0] - r - 6, t, r * 2 + 12, c[1] + r + 6 - t];
  const thread = `M${r1(c[0])} ${r1(t)}L${r1(c[0])} ${r1(c[1] - r * 0.72)}`;
  let art = ink(thread, 1.3, C.thread, 0.9) + fill(ellipsePath(c[0], c[1] - r * 0.74, 1.8, 1.8), C.thread);
  art += paper(starD(c, r, rot), color, { line: L.small, rim: [r * 0.22, -r * 0.14], glint: [-r * 0.09, r * 0.09], hatch: r > 14 ? 4.2 : 0, hatchWidth: 0.85, over: face ? sleepy([c[0], c[1] + r * 0.06], r, darkOf(color, 0.62)) : '' });
  return piece(z, when, card(g, b, bob(svg(b, art), delay), ' ld-drop'));
}

/** The Moon or the Sun, hung on two threads; it blinks now and then. */
function hangFace(g: Geo, kind: 'moon' | 'sun', c: Pt, size: number, when: number, delay: number): Layer {
  const t = g.thread;
  const b: Box = [c[0] - size / 2, t, size, c[1] + size / 2 - t];
  const faceBox: Box = [c[0] - size / 2, c[1] - size / 2, size, size];
  const R = 112 * (size / (kind === 'moon' ? 260 : 364));
  const tie: [number, number][] = kind === 'moon' ? [[-0.42, -0.62], [0.12, -0.98]] : [[-0.5, -0.86], [0.5, -0.86]];
  let threads = '';
  for (const [dx, dy] of tie) threads += `M${r1(c[0] + dx * R)} ${r1(t)}L${r1(c[0] + dx * R)} ${r1(c[1] + dy * R)}`;
  const face = `<div class="ld-face" style="${place(faceBox, b)}">${skyFaceSvg(kind)}<div class="ld-blink ld-${kind}">${skyFaceSvg(kind, 'shut')}</div></div>`;
  return piece(Z.face, when, card(g, b, bob(svg(b, ink(threads, 1.3, C.thread, 0.9)) + face, delay), ' ld-drop'));
}

/** A little paper whale swimming through the sky along its wire, bobbing as it goes. */
function whale(g: Geo): Layer {
  const y = g.whaleY;
  // The whale, drawn facing right about (0, 0).
  const body = 'M-34 2C-34 -12 -20 -18 -2 -18C16 -18 30 -13 32 -2C33 8 22 14 4 14C-12 14 -24 11 -34 2Z';
  let wh = ink('M2 -18L2 -26', 1.2, C.thread);
  wh += paper('M-32 0C-40 -4 -46 -12 -50 -10C-48 -4 -46 0 -46 3C-49 6 -50 12 -47 13C-43 10 -38 5 -32 4Z', '#8f9ed6', { line: L.detail, rim: [2, -1] });
  wh += paper(body, C.peri, { line: L.small, rim: [5, -3], glint: [-1.4, 1.6], hatch: 3.6, hatchWidth: 0.8, over: fill('M-24 6C-10 12 12 13 26 6C22 12 10 14 2 14C-10 14 -20 11 -24 6Z', lightOf(C.peri, 0.5)) + ink('M-12 8C-4 10 6 10 14 8M-8 11C0 12 6 12 12 11', 0.8, darkOf(C.peri, 0.4)) + fill(ellipsePath(20, -4, 1.9, 1.9), darkOf(C.peri, 0.65)) });
  wh += ink('M24 -16q-3 -6 -8 -7M24 -16q2 -7 7 -8M24 -16l0 -8', 1.4, '#d8eef6');
  // It comes out of the left wall and swims into the right one.
  const w0 = g.wall(Z.whale);
  const fish: Box = [w0 - 100, y - 30, 100, 60];
  return piece(Z.whale, 0.24, `<div class="ld-whale" style="${place(fish, g.box)};--run:${Math.round(g.W - w0 * 2 + 100)}"><div class="ld-fish">${svg([-55, -30, 100, 60], wh)}</div></div>`);
}

// ------------------------------------------------------------ the land

/** Far hills, hazy lilac: tiny crystal spires on their backs and a cottage with a lit window. */
function farHills(g: Geo): Layer {
  const base = g.base(Z.far);
  const k = g.tall ? 1.3 : 1;
  const H = (f: number, h: number): Pt => [g.x(f), h * k];
  const b = g.span(Z.far, base - 205 * k, 205 * k);
  const back = ridge([[b[0], 90], H(0, 118), H(0.17, 92), H(0.34, 166), H(0.49, 118), H(0.63, 194), H(0.79, 128), H(0.95, 174), [b[0] + b[2], 110]], base);
  const front = ridge([[b[0], 50], H(0.08, 82), H(0.26, 58), H(0.45, 102), H(0.61, 70), H(0.8, 96), H(1, 62), [b[0] + b[2], 58]], base);
  let s = paper(back, '#7b6da7', { line: L.small, ink: '#5e5088', rim: [12, -5], glint: [-3, 3], hatch: 5.5, hatchWidth: 0.9, tone: '#d3cde0' });
  const spires: Crystal[] = [];
  for (const [f, hh] of [[0.34, 166], [0.63, 194], [0.95, 174]] as const) {
    for (const dx of [-9, 0, 8]) spires.push({ cx: g.x(f) + dx, base: base - hh * k + 7 + Math.abs(dx) * 0.4, w: 6, h: dx ? 14 : 21, color: '#a9c6e2', line: L.fine });
  }
  s += crystals(spires);
  s += paper(front, '#9284be', { line: L.small, ink: '#6d5f99', rim: [12, -5], glint: [-3, 3], hatch: 5.5, hatchWidth: 0.9, tone: '#d6d0e2' });
  // A cottage with a pink lit window on the front ridge, a path winding down.
  const hx = g.x(0.45);
  const hy = base - 102 * k + 4;
  s += ink(`M${r1(hx + 6)} ${r1(hy)}Q${r1(hx + 34)} ${r1(hy + 16)} ${r1(hx + 8)} ${r1(hy + 32)}T${r1(hx + 26)} ${r1(base + 4)}`, 2.2, '#c9bde2', 0.85);
  const wall = polyD([[hx - 10, hy], [hx - 10, hy - 15], [hx + 10, hy - 15], [hx + 10, hy]]);
  s += fill(wall, '#ddd3ea') + fill(polyD([[hx - 10, hy], [hx - 10, hy - 15], [hx - 7, hy - 15], [hx - 7, hy]]), mul('#ddd3ea', SHADE.cool)) + ink(wall, L.fine, lineFor('#ddd3ea'));
  const roof = polyD([[hx - 14, hy - 14], [hx, hy - 28], [hx + 14, hy - 14]]);
  s += fill(roof, '#a083ba') + fill(polyD([[hx, hy - 28], [hx + 14, hy - 14], [hx + 12, hy - 14], [hx - 1, hy - 27]]), lightOf('#a083ba')) + ink(roof, L.fine, lineFor('#a083ba'));
  s += fill(ellipsePath(hx + 1, hy - 8, 11, 11), '#ff9ad6', 0.28) + fill(polyD([[hx - 3, hy - 11], [hx + 4, hy - 11], [hx + 4, hy - 4], [hx - 3, hy - 4]]), '#ffc8e8');
  // The mist lies low over them: far things are hazier.
  return piece(Z.far, 0.28, card(g, b, svg(b, s) + '<i class="ld-haze"></i>'));
}

/** Rolling moonlit hills, teal and periwinkle, with crystal outcrops, tufts and flowers; three crystals sprout on them, fireflies wander over them. */
function midHills(g: Geo, eye: Pt): Layer {
  const base = g.base(Z.mid);
  const k = g.tall ? 1.3 : 1;
  const b = g.span(Z.mid, base - 175 * k, 175 * k);
  const R = ridge([[g.x(0.4), 6], [g.x(0.56), 46 * k], [g.x(0.84), 124 * k], [g.x(1.04), 92 * k], [b[0] + b[2], 70 * k]], base);
  const Lh = ridge([[b[0], 92 * k], [g.x(-0.02), 140 * k], [g.x(0.14), 160 * k], [g.x(0.34), 104 * k], [g.x(0.53), 12]], base);
  const hill = { line: L.body, rim: [16, -6] as const, glint: [-3.5, 3.5] as const, hatch: 5.5, hatchWidth: 1, tone: '#d2d0e0' };
  let s = paper(R, '#a4abdc', hill);
  s += crystals(outcrop(g.x(0.93), base - 104 * k, 34, 3)) + tuft(g.x(0.7), base - 92 * k, 16, '#7f8fc4', 4);
  s += paper(Lh, '#88c1b5', hill);
  s += crystals([...outcrop(g.x(0.03), base - 146 * k, 40, 5), ...outcrop(g.x(0.45), base - 40 * k, 28, 6)]);
  s += tuft(g.x(0.24), base - 136 * k, 18, '#5f9f92', 7) + tuft(g.x(0.09), base - 154 * k, 14, '#5f9f92', 8);
  const rng = new Rng(9);
  const cols = ['#fff4c8', '#ffd0e4', '#e4f6ff'] as const;
  const flowers = cols.map(() => '');
  for (let i = 0; i < 18; i++) {
    const f = rng.range(-0.05, 0.95);
    const left = f < 0.46;
    const top = left ? 160 * k - Math.abs(f - 0.14) * 300 * k : 124 * k - Math.abs(f - 0.84) * 280 * k;
    if (top < 24) continue;
    const y = base - rng.range(8, top - 12);
    flowers[Math.floor(rng.next() * cols.length)] += ellipsePath(g.x(f), y, 2.6, 2.6);
  }
  cols.forEach((c, i) => (s += flowers[i] ? fill(flowers[i]!, c, 0.9) : ''));
  let more = sprout(g, g.x(0.14), base - 156 * k, 26, 54, GEMS[1], 0.4, eye) + sprout(g, g.x(0.84), base - 120 * k, 22, 46, GEMS[2], 0.47, eye) + sprout(g, g.x(0.3), base - 112 * k, 18, 36, GEMS[5], 0.54, eye);
  for (const [f, h, d] of [[0.2, 200, 0], [0.38, 150, 2.6], [0.58, 120, 5.1], [0.76, 190, 1.4], [0.92, 160, 3.8]] as const) more += `<i class="ld-fly" style="left:${pc(g.x(f), g.W)};top:${pc(base - h * k, g.H)};--d:${-d}s"></i>`;
  return piece(Z.mid, 0.36, card(g, b, svg(b, s)) + more);
}

/** The mossy mound the big crystals grow from, and a low ground across. */
function mound(g: Geo, eye: Pt): Layer {
  const base = g.base(Z.mound);
  const cx = g.x(g.tall ? 0.3 : 0.32);
  const mw = g.ow * (g.tall ? 0.56 : 0.44);
  const b = g.span(Z.mound, base - 76, 76);
  const ground = ridge([[b[0], 16], [g.x(0.1), 22], [g.x(0.5), 12], [g.x(0.8), 20], [b[0] + b[2], 14]], base);
  const hump = ridge([[cx - mw * 0.6, 4], [cx - mw * 0.4, 40], [cx - mw * 0.1, 62], [cx + mw * 0.22, 56], [cx + mw * 0.5, 30], [cx + mw * 0.66, 4]], base);
  let s = paper(ground, '#97bd86', { line: L.small, rim: [10, -4], glint: [-2, 2], hatch: 5, hatchWidth: 0.9 });
  s += paper(hump, C.moss, { line: L.body, rim: [14, -6], glint: [-3, 3], hatch: 5, hatchWidth: 1 });
  const rng = new Rng(21);
  let stones = '';
  let lit = '';
  for (let i = 0; i < 6; i++) {
    const x = cx + rng.range(-0.5, 0.55) * mw;
    const y = base - rng.range(4, 18);
    const rx = rng.range(5, 9);
    const ry = rng.range(3.5, 5);
    stones += blob(x, y, rx, ry, rng, 7, 0.15);
    lit += ellipsePath(x + rx * 0.3, y - ry * 0.35, rx * 0.35, ry * 0.3);
  }
  s += chip(stones, C.stone, L.fine, fill(lit, lightOf(C.stone, 0.6)));
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
    sp += sprout(g, x, top, w, h * kh, GEMS[c]!, [0.5, 0.58, 0.66, 0.74, 0.82][i]!, eye);
  });
  return piece(Z.mound, 0.44, card(g, b, svg(b, s)) + sp);
}

// ------------------------------------------------------------ Gorti

/** Root claws fanned out from `base`, cut as one piece. */
function toes(base: Pt, ang: number, spread: number, lens: readonly number[], w0: number, color: string, seed: number, curl: number): string {
  const rng = new Rng(seed);
  const d = lens
    .map((len, i) => {
      const a = ang + (i / (lens.length - 1) - 0.5) * spread + rng.range(-0.06, 0.06);
      const mid: Pt = [base[0] + Math.cos(a) * len * 0.55, base[1] + Math.sin(a) * len * 0.55];
      const tip: Pt = [mid[0] + Math.cos(a + curl) * len * 0.45, mid[1] + Math.sin(a + curl) * len * 0.45];
      return taper([base, mid, tip], w0, 0.5);
    })
    .join('');
  return chip(d, color, L.detail);
}

/** Gorti, drawn standing about his feet (0, 0): root legs and arms, the sage sweater (the head is apart). */
function gortiBody(): string {
  const { root, rootDark, body } = CHILD;
  let s = '';
  for (const sx of [-1, 1]) {
    // Root arms hang beside the sweater, claws for hands.
    const sh: Pt = [sx * 22, -86];
    const el: Pt = [sx * 31, -64];
    const wr: Pt = [sx * 34, -46];
    s += toes(wr, Math.PI / 2 + sx * 0.25, 1.1, [8, 9.5, 8], 3.6, rootDark, 60 + sx, -sx * 0.2);
    s += paperLimb(el, wr, 10, 8.5, root, { line: L.small, over: barkLines(el, wr, 9, 70 + sx, { n: 2, color: darkOf(root, 0.5), width: 0.9 }) });
    s += paperLimb(sh, el, 13, 11, body, { line: L.small, bulge: 0.8, hatch: 3 });
    // Root legs with bark grooves, toes spread on the floor.
    const hip: Pt = [sx * 11, -46];
    const ft: Pt = [sx * 15, -7];
    s += toes([sx * 15, -5], Math.PI / 2 - sx * 1.05, 1.2, [9, 11, 9.5], 4.2, rootDark, 40 + sx, sx * 0.3);
    s += paperLimb(hip, ft, 14, 10.5, root, { line: L.small, over: barkLines(hip, ft, 12, 50 + sx, { n: 2, color: darkOf(root, 0.5), width: 1 }) });
  }
  const torso: Pt[] = [[-21, -38], [-25, -57], [-24, -78], [-18, -93], [-3, -100], [12, -98], [22, -89], [26, -71], [25, -53], [21, -38]];
  const knit = darkOf(body, 0.32);
  const hips = `M-30 -54Q-15 -60 -1 -54T30 -55`;
  const bark = barkLines([-9, -54], [-10, -38], 9, 81, { n: 2, knots: 0, color: darkOf(root, 0.5) }) + barkLines([9, -54], [10, -38], 9, 82, { n: 2, knots: 0, color: darkOf(root, 0.5) });
  const patch = (c: string): string => `<path d="${hips}L30 -30L-30 -30Z" fill="${c}"/>${bark}`;
  const over =
    ink(hips, L.detail, darkOf(body, 0.55)) +
    ink('M-6 -58Q-8 -66 -5 -72M8 -58Q10 -64 13 -68', L.detail, darkOf(root, 0.3)) +
    ink('M-8 -95Q1 -90 10 -94', L.detail, knit) +
    ink('M-14 -78l3 2M-15 -72l3 1.6M14 -84q4 1.6 7 -0.6M15 -77q3.6 1.3 6.5 -0.8', L.fine, knit);
  s += paper(smooth(torso, 0.9), body, { line: L.body, inner: patch(root), innerShade: patch(mul(root, SHADE.cool)), rim: [8, -4], hatch: 3.6, hatchWidth: 0.8, glint: [-1.8, 2], over });
  s += paperLimb([0, -96], [1, -110], 12, 10, root, { line: L.small });
  return s;
}

/** His head: the worn TV box in three-quarter view, the bezel and the dark glowing screen (the face goes on it as HTML). */
function gortiHead(): string {
  const o = CHILD;
  // The side of the box, in shade, hatched, with rivets.
  const sideD = roundPoly([[-58, -183], [-44, -192], [-44, -103], [-58, -110]], 4);
  let side = '';
  for (let y = -186; y < -100; y += 4.2) side += `M-58 ${r1(y + 6)}L-44 ${r1(y)}`;
  const rivets = chip(ellipsePath(-51, -176, 2.4, 2.4) + ellipsePath(-51, -118, 2.4, 2.4), o.bezel, L.fine, fill(ellipsePath(-50.2, -176.8, 0.9, 0.9) + ellipsePath(-50.2, -118.8, 0.9, 0.9), lightOf(o.bezel)));
  let s = paper(sideD, o.boxSide, { line: L.body, over: ink(side, 0.8, darkOf(o.boxSide, 0.3)) + rivets });
  const box = roundPoly([[-46, -186], [-36, -195], [42, -195], [51, -186], [51, -111], [42, -102], [-36, -102], [-46, -111]], 9);
  s += paper(box, o.box, { line: L.body, rim: [5, -5], glint: [-2.2, 2.4], hatch: 4.2, hatchWidth: 0.8, over: ink('M51 -150l3 -2M51 -136l3 1M8 -103q3 -1.5 6 0M-30 -195l2 3', L.fine, darkOf(o.box, 0.35)) });
  s += paper(rrect(-38, -186, 82, 76, 11), o.bezel, { line: L.small, rim: [3, -3], glint: [-1.6, 1.7] });
  let grid = '';
  for (let x = -26; x <= 32; x += 7) grid += `M${x} -180V-116`;
  for (let y = -174; y <= -118; y += 7) grid += `M-32 ${y}H38`;
  const id = nextId('lgs');
  const glass =
    `<radialGradient id="${id}"><stop offset="0" stop-color="${o.glow}" stop-opacity=".5"/><stop offset="1" stop-color="${o.glow}" stop-opacity="0"/></radialGradient>` +
    `<ellipse cx="3" cy="-148" rx="44" ry="40" fill="url(#${id})"/>` +
    ink(grid, 0.7, o.neon, 0.22) +
    fill('M-33 -160L-14 -181L-5 -181L-33 -150Z', '#ffffff', 0.12) +
    fill('M-33 -142L5 -181L9 -181L-33 -137Z', '#ffffff', 0.08);
  s += paper(rrect(-33, -181, 72, 66, 8), o.screen, { line: L.small, ink: '#2c1228', inner: glass });
  return s;
}

/** Gorti on the stage: his spotlight, his soft shadow, his body, his head turning on its neck, his face and the count on his screen. */
function gorti(g: Geo): { layer: Layer; eye: Pt } {
  const gx = g.x(g.tall ? 0.71 : 0.66);
  const base = g.base(Z.gorti);
  const local: Box = [-96, -206, 164, 222];
  const headBox: Box = [-62, -200, 120, 104];
  const screen: Box = [-33, -181, 72, 66];
  const b: Box = [gx + local[0], base + local[1], local[2], local[3]];
  const neck = `transform-origin:${pc(0 - headBox[0], headBox[2])} ${pc(-104 - headBox[1], headBox[3])}`;
  const joy = svg([0, 0, 72, 66], ink('M10 26L19 16L28 26M44 26L53 16L62 26', 4.5, '#ff9ad6'));
  const face = `<div class="ld-screen" style="${place(screen, headBox)}"><div class="ld-snow"></div><div class="ld-eyes"><i></i><i></i></div><div class="ld-joy">${joy}</div><b class="ld-digits">%0</b><div class="ld-scan"></div></div>`;
  const head = `<div class="ld-head" style="${place(headBox, local)};${neck}">${svg(headBox, gortiHead())}${face}</div>`;
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
  // His shadow falls behind him, down and to the left, soft; it stays when he hops.
  const shade = softShadow(-66, -134, 28, 58, 0.42) + softShadow(-38, -44, 20, 50, 0.32) + fill(ellipsePath(0, 1, 44, 7), '#1b1030', 0.32);
  const html = card(g, lb, `<div class="ld-beam">${light}</div>`) + card(g, b, `${svg(local, shade)}<div class="ld-gorti">${svg(local, gortiBody())}${head}</div>`);
  return { layer: piece(Z.gorti, -0.01, html), eye: [gx + 3, base - 160] };
}

// ------------------------------------------------------------ the front

/** The stage's front lip: grass, curling roots, mushrooms, a snail; two last crystals sprout here. */
function lip(g: Geo, eye: Pt): Layer {
  const base = g.base(Z.lip);
  const b = g.span(Z.lip, base - 120, 124);
  const rng = new Rng(31);
  let s = '';
  // Curling roots at both corners.
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? g.pw - 20 : g.x(1) + 20;
    const pts: Pt[] = [[x0, base + 4], [x0 - sx * 40, base - 40], [x0 - sx * 76, base - 72], [x0 - sx * 112, base - 70], [x0 - sx * 122, base - 54], [x0 - sx * 110, base - 44]];
    s += paper(taper(pts, 22, 4), C.root, { line: L.small, rim: [5, -3], glint: [-1.4, 1.4], hatch: 3.6, hatchWidth: 0.8, over: ink(smooth(pts.slice(0, 4), 1, false), L.fine, darkOf(C.root, 0.45)) });
  }
  // A ribbon of grass along the front, low in the middle.
  const grass: Pt[] = [];
  for (let x = b[0]; x <= b[0] + b[2] + 1; x += 13) {
    const f = (x - g.pw) / g.ow;
    const edge = Math.max(0, Math.abs(f - 0.5) - 0.28) * 140;
    grass.push([x, base - 16 - edge - (grass.length % 2 ? 0 : 9) - rng.range(0, 6)]);
  }
  const gD = `M${r1(b[0])} ${r1(base + 8)}${grass.map((q, i) => (i % 2 ? `L${pt(q)}` : `Q${r1(q[0] - 6)} ${r1(q[1] + 8)} ${pt(q)}`)).join('')}L${r1(b[0] + b[2])} ${r1(base + 8)}Z`;
  s += paper(gD, C.grass, { line: L.small, rim: [8, -5], glint: [-2, 2], hatch: 4.5, hatchWidth: 0.85 });
  for (const [f, sz, seed] of [[0.02, 30, 1], [0.12, 22, 2], [0.86, 26, 3], [0.97, 32, 4], [0.4, 14, 5], [0.58, 16, 6]] as const) s += tuft(g.x(f), base - 6, sz, rng.pick([C.grass, '#88b86c', C.grassLight]), seed);
  s += mushroom(g.x(0.07), base - 4, 34, C.pink) + mushroom(g.x(0.115), base - 2, 22, C.apricot) + mushroom(g.x(0.93), base - 4, 28, '#c3a3dc');
  // A snail on its way across.
  const sx = g.x(0.24);
  const sy = base - 8;
  s += paper(`M${r1(sx - 26)} ${r1(sy)}Q${r1(sx - 30)} ${r1(sy - 7)} ${r1(sx - 22)} ${r1(sy - 9)}L${r1(sx + 6)} ${r1(sy - 9)}Q${r1(sx + 12)} ${r1(sy - 4)} ${r1(sx + 8)} ${r1(sy)}Z`, '#d9c3a8', { line: L.detail, rim: [3, -1], glint: [-0.8, 0.8], over: ink(`M${r1(sx - 22)} ${r1(sy - 9)}q-3 -8 -6 -10M${r1(sx - 18)} ${r1(sy - 9)}q0 -8 2 -11`, L.fine, darkOf('#d9c3a8', 0.5)) + fill(ellipsePath(sx - 24, sy - 5, 1.2, 1.2), darkOf('#d9c3a8', 0.7)) });
  const spiral: Pt[] = [];
  for (let i = 0; i <= 22; i++) {
    const a = i * 0.5;
    spiral.push([sx - 2 + Math.cos(a) * (16 - i * 0.62), sy - 16 + Math.sin(a) * (15 - i * 0.6)]);
  }
  s += paper(ellipsePath(sx - 2, sy - 16, 16, 15), C.apricot, { line: L.detail, rim: [4, -2], glint: [-1.2, 1.2], hatch: 3.2, hatchWidth: 0.7, over: ink(smooth(spiral, 1, false), L.fine, darkOf(C.apricot, 0.45)) });
  const sp = sprout(g, g.x(0.5), base - 10, 20, 40, GEMS[5], 0.9, eye) + sprout(g, g.x(g.tall ? 0.9 : 0.82), base - 12, 24, 50, GEMS[0], 0.96, eye);
  return piece(Z.lip, 0.6, card(g, b, svg(b, s)) + sp);
}

/**
 * The proscenium's soft shadow on the stage, down and to the left of it:
 * a band under the beam, round the top right corner and down the right
 * pillar (gradients, in three pieces that meet without overlapping). It
 * comes with the frame.
 */
function frameShadow(g: Geo): Layer {
  const x0 = g.pw;
  const x1 = g.W - g.pw;
  const dark = 'rgba(18,8,31,.4)';
  const none = 'rgba(18,8,31,0)';
  const band = (b: Box, bg: string): string => `<i class="ld-fsh" style="${place(b, g.box)};background:${bg}"></i>`;
  const html =
    band([x0, g.top, x1 - 93 - x0, 46], `linear-gradient(${dark} 0 72%,${none} 98%)`) +
    band([x1 - 93, g.top, 93, 83], `radial-gradient(circle at 0 100%,${none} calc(var(--u) * 38),${dark} calc(var(--u) * 50))`) +
    band([x1 - 55, g.top + 83, 55, g.F - g.top - 83], `linear-gradient(to left,${dark} 0 78%,${none} 100%)`);
  return piece(Z.shade, -0.05, html);
}

/** Footlights along the stage's front: paper cups that light up one by one. */
function lamps(g: Geo): Layer {
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
  return fixed(Z.lamps, out);
}

// ------------------------------------------------------------ the proscenium

/**
 * The painted frame: pillars with crystal lozenges, a beam of stars and
 * moons, a lace edge over the front board. It is cut into strips (the beam,
 * the pillars, the board), each a picture and a layer of its own, so the
 * opening between them is never painted.
 */
function frame(g: Geo): Layer {
  const { W, H, pw, top, F } = g;
  const y0 = FRAME_TOP;
  const x0 = pw;
  const x1 = W - pw;
  const outer = roundPoly([[0, y0 + 10], [W / 2 - 160, y0], [W / 2 + 160, y0], [W, y0 + 10], [W, H], [0, H]], [34, 12, 12, 34, 8, 8]);
  const hole = `M${x0 + 46} ${top}Q${x0} ${top} ${x0} ${top + 46}L${x0} ${F}L${x1} ${F}L${x1} ${top + 46}Q${x1} ${top} ${x1 - 46} ${top}Z`;
  const d = outer + hole;
  // The opening's painted border, as wide bands.
  const border = `<path d="${hole}" fill="none" stroke="${C.butter}" stroke-width="34"/><path d="${hole}" fill="none" stroke="${C.cream}" stroke-width="20"/>` + ink(hole, L.fine, darkOf(C.butter, 0.4));
  const strips: Box[] = [
    [-4, y0 - 6, W + 8, top + 50 - (y0 - 6)],
    [-4, top + 46, x0 + 22, F + 2 - (top + 46)],
    [x1 - 18, top + 46, W - x1 + 22, F + 2 - (top + 46)],
    [-4, F - 20, W + 8, H - F + 24],
  ];
  const deco = strips.map(() => '');
  // The front board: a deeper band with a lace edge and painted gems.
  let board = fill(`M0 ${F + 10}H${W}V${H}H0Z`, C.frameDeep);
  let lace = `M0 ${F + 10}`;
  let laceDots = '';
  for (let x = 0; x < W; x += 26) {
    lace += `Q${x + 13} ${F + 30} ${x + 26} ${F + 10}`;
    laceDots += ellipsePath(x + 13, F + 17, 2.4, 2.4);
  }
  board += chip(`${lace}V${F}H0Z`, C.cream, L.fine, '', darkOf(C.cream, 0.4)) + fill(laceDots, darkOf(C.cream, 0.2));
  const n = Math.round((W - 120) / 90);
  board += gems(Array.from({ length: n + 1 }, (_, i) => [60 + (i * (W - 120)) / n, F + 54, 12, 14, GEMS[i % GEMS.length]!] as const));
  deco[3] = board;
  // Pillars: an inset panel with a column of lozenges and dots; a capital on top.
  for (const [k, px] of [[1, 12], [2, W - pw + 12]] as const) {
    let p = paper(rrect(px, top + 18, pw - 24, F - top - 36, 10), lightOf(C.frame, 0.25), { line: L.detail, rim: [-3, -3], glint: [2, 2] });
    const m = Math.max(3, Math.floor((F - top - 70) / 72));
    const cx = px + (pw - 24) / 2;
    const s = Math.min(14, (pw - 30) / 2.4);
    const step = (F - top - 100) / Math.max(1, m - 1);
    p += gems(Array.from({ length: m }, (_, i) => [cx, top + 52 + i * step, s, s * 1.5, GEMS[(i + (px > W / 2 ? 2 : 0)) % GEMS.length]!] as const));
    let dots = '';
    for (let i = 0; i < m - 1; i++) dots += ellipsePath(cx, top + 52 + i * step + step / 2, 3, 3);
    p += fill(dots, C.butter);
    deco[k] = p;
    deco[0] += paper(rrect(px - 6, top - 6, pw - 12, 20, 6), C.butter, { line: L.detail, rim: [3, -2], glint: [-1, 1], over: ink(`M${px + 6} ${top + 4}q-4 -6 2 -8M${px + pw - 30} ${top + 4}q4 -6 -2 -8`, L.fine, darkOf(C.butter, 0.45)) });
  }
  // The beam: small stars and moons painted along it.
  const rng = new Rng(41);
  let stars = '';
  let moons = '';
  for (let x = 40; x < W - 30; x += 52) {
    const y = y0 + (top - y0) * 0.55 + rng.range(-8, 8);
    if (x % 104 < 52) stars += starD([x, y], 7, rng.range(0, 1));
    else moons += `M${x - 5} ${r1(y - 7)}A8 8 0 1 0 ${x + 5} ${r1(y + 7)}A6 6 0 1 1 ${x - 5} ${r1(y - 7)}Z`;
  }
  deco[0] += fill(stars, C.butter, 0.9) + fill(moons, '#fff1c6', 0.85);
  const art = strips.map((b, i) => {
    const hb: Rect = { x0: b[0], y0: b[1], x1: b[0] + b[2], y1: b[1] + b[3] };
    return svg(b, paper(d, C.frame, { line: L.body, rim: [10, -6], glint: [-3.5, 3.5], hatch: 5.5, hatchWidth: 1, hatchBox: hb, over: border + deco[i] }), ` class="ld-fs" style="${place(b, g.box)}"`);
  });
  return piece(Z.frame, -0.05, card(g, g.box, art.join('')));
}

/** A velvet drape, tied back; `--k` gathers it toward its side as the progress rises. */
function drape(g: Geo, side: -1 | 1): Layer {
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
  let art = paper(d, C.velvet, { line: L.body, rim: [9, -5], glint: [-2.5, 2.5], hatch: 5, hatchWidth: 0.9, shade, over: ink(folds, L.detail, darkOf(C.velvet, 0.36)) });
  // The tie-back cord and its tassel.
  art += chip(`M${r1(m(o - 4))} ${r1(ty - 6)}Q${pt(tie)} ${r1(m(o + dw * 0.44))} ${r1(ty - 2)}L${r1(m(o + dw * 0.44))} ${r1(ty + 8)}Q${r1(tie[0])} ${r1(ty + 12)} ${r1(m(o - 4))} ${r1(ty + 6)}Z`, C.butter, L.detail);
  const tx = m(o + dw * 0.44);
  art += chip(`M${r1(tx - 6)} ${r1(ty + 6)}L${r1(tx + 6)} ${r1(ty + 6)}L${r1(tx + 9)} ${r1(ty + 40)}L${r1(tx - 9)} ${r1(ty + 40)}Z`, C.butter, L.detail, ink(`M${r1(tx - 4)} ${r1(ty + 18)}L${r1(tx - 5)} ${r1(ty + 39)}M${r1(tx)} ${r1(ty + 18)}V${r1(ty + 39)}M${r1(tx + 4)} ${r1(ty + 18)}L${r1(tx + 5)} ${r1(ty + 39)}`, L.fine, darkOf(C.butter, 0.4)));
  art += chip(ellipsePath(tx, ty + 10, 7, 6), lightOf(C.butter, 0.2), L.detail, fill(ellipsePath(tx + 2.4, ty + 8, 2.4, 1.8), '#fffdf0'));
  const b: Box = side < 0 ? [o - 6, top - 4, dw + 20, g.F + 10 - top] : [g.W - o - dw - 14, top - 4, dw + 20, g.F + 10 - top];
  return piece(Z.drape, -0.04, card(g, b, `<div class="ld-drape ld-${side < 0 ? 'l' : 'r'}">${svg(b, art)}</div>`));
}

/** The valance: velvet swags across the top, butter tassels between. */
function valance(g: Geo): Layer {
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
  let art = paper(d, '#dd91b9', { line: L.body, rim: [6, -5], glint: [-2, 2.4], hatch: 4.5, hatchWidth: 0.85, over: ink(folds, L.detail, darkOf('#dd91b9', 0.35)) });
  let tassels = '';
  let cords = '';
  let knots = '';
  let shine = '';
  for (let i = 0; i <= n; i++) {
    const x = x0 + i * sw;
    tassels += `M${r1(x - 5)} ${y + 2}L${r1(x + 5)} ${y + 2}L${r1(x + 8)} ${y + 32}L${r1(x - 8)} ${y + 32}Z`;
    cords += `M${r1(x - 3)} ${y + 14}V${y + 31}M${r1(x + 3)} ${y + 14}V${y + 31}`;
    knots += ellipsePath(x, y + 4, 7, 6);
    shine += ellipsePath(x + 2.4, y + 2, 2.4, 1.8);
  }
  art += chip(tassels, C.butter, L.detail, ink(cords, L.fine, darkOf(C.butter, 0.4))) + chip(knots, lightOf(C.butter, 0.2), L.detail, fill(shine, '#fffdf0'));
  const b: Box = [x0 - 10, y - 14, x1 - x0 + 20, 92];
  return piece(Z.valance, -0.03, card(g, b, `<div class="ld-val">${svg(b, art)}</div>`));
}

/** The title on a paper banner with folded tails, and the room's tag hanging under it. */
function banner(g: Geo): Layer {
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
    art += paper(tail, '#e597bf', { line: L.small, rim: [6, -4], glint: [-1.6, 1.6], hatch: 4.2, hatchWidth: 0.8 });
    art += fill(polyD([[e - s * 2, y + bh], [e - s * 30, y + bh + 22], [e - s * 30, y + bh - 4]]), darkOf('#e597bf', 0.3));
  }
  const band = `M${l} ${y}Q${cx} ${y - sag} ${r} ${y}L${r} ${y + bh}Q${cx} ${y + bh - sag} ${l} ${y + bh}Z`;
  art += paper(band, C.cream, { line: L.body, rim: [10, -5], glint: [-2.5, 2.5], hatch: 5, hatchWidth: 0.85, over: ink(`M${l + 12} ${y + 9}Q${cx} ${y + 1} ${r - 12} ${y + 9}M${l + 12} ${y + bh - 9}Q${cx} ${y + bh - 17} ${r - 12} ${y + bh - 9}`, L.fine, darkOf(C.cream, 0.35)) });
  // The room's tag on a string.
  const tw = g.tall ? 150 : 124;
  const th = g.tall ? 44 : 36;
  const tagY = y + bh + 12;
  art += ink(`M${cx - 18} ${y + bh - 6}L${cx - 6} ${tagY + 6}M${cx + 18} ${y + bh - 6}L${cx + 6} ${tagY + 6}`, 1.4, darkOf(C.cream, 0.5));
  const tagBox: Box = [cx - tw / 2, tagY, tw, th];
  const tagArt = paper(rrect(cx - tw / 2, tagY, tw, th, 6), '#f7e9a8', { line: L.small, rim: [4, -3], glint: [-1.2, 1.2] }) + chip(ellipsePath(cx, tagY + 7, 3, 3), C.cream, L.fine);
  const b: Box = [l - 52, y - 12, bw + 104, bh + th + 50];
  const title = comicTitle('Kristaller Dünyası').outerHTML;
  const html =
    `<div class="ld-title${g.tall ? ' ld-2' : ''}" style="${place([l + 18, y, bw - 36, bh], b)};--tf:${g.tall ? 56 : 46}">${title}</div>` +
    `<div class="ld-tag" style="${place(tagBox, b)}">${svg(tagBox, tagArt)}<span style="font-size:calc(var(--u) * ${g.tall ? 26 : 21})">14. Oda</span></div>`;
  return piece(Z.banner, -0.02, card(g, b, svg(b, art) + html, ' ld-ban'));
}

/** Paper confetti for the ta-da: strips, stars, little gems and dots flung up from the stage, fluttering down. */
function confetti(g: Geo): Layer {
  const rng = new Rng(77);
  const shapes = ['M-10 -5H10V5H-10Z', starD([0, 0], 12, 0), polyD([[0, -12], [7.5, 0], [0, 12], [-7.5, 0]]), ellipsePath(0, 0, 6, 6)];
  let out = '';
  for (let i = 0; i < 36; i++) {
    const a = -Math.PI / 2 + rng.range(-1.45, 1.45);
    const v = rng.range(0.16, 0.52);
    const col = rng.pick(CONFETTI);
    const art = chip(shapes[i % 4]!, col, 1.7, ink('M1.5 -2.5h4', 1.8, '#ffffff', 0.75), darkOf(col, 0.42));
    out += `<i class="ld-cf" style="--x:${r1(Math.cos(a) * v * g.ow)};--y:${r1(Math.sin(a) * v * g.H * 0.78)};--f:${r1(rng.range(0.28, 0.6) * g.H)};--r:${Math.round(rng.range(-1, 1) * 1000)}deg;--d:${rng.range(0, 0.1).toFixed(2)}s">${svg([-14, -14, 28, 28], art)}</i>`;
  }
  return fixed(Z.confetti, `<div class="ld-burst" style="left:50%;top:${pc(g.top + (g.F - g.top) * 0.56, g.H)}">${out}</div>`);
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
  const layers: Layer[] = [
    ...room(g),
    backdrop(g, moon, sun, sz / 2, sz / 2),
    whale(g),
    ...stars.map(([f, dy, r, c, z, face], i) => hangStar(g, z, 0.07 + i * 0.035, [g.x(f), g.top + dy], r, [C.butter, '#f8c4dc', '#b6dcc6', '#c3cdf4', C.apricot, '#d8c6f2'][c]!, i * 0.7, face, i * 0.9 + 0.3)),
    hangFace(g, 'moon', moon, sz, 0.12, 1.1),
    hangFace(g, 'sun', sun, sz * 1.18, 0.19, 2.4),
    farHills(g),
    midHills(g, gt.eye),
    mound(g, gt.eye),
    gt.layer,
    frameShadow(g),
    lip(g, gt.eye),
    lamps(g),
    drape(g, -1),
    drape(g, 1),
    valance(g),
    frame(g),
    banner(g),
    confetti(g),
  ];
  // Back to front: painted in this order, the near layers cover the far ones.
  layers.sort((a, b) => a.key - b.key);
  return { html: `<div class="ld-look">${layers.map((l) => l.html).join('')}</div>`, oy: pc(g.oy, g.H) };
}
