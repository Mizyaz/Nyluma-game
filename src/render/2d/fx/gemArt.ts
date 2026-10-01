import type * as Phaser from 'phaser';
import { mix } from '../palette';
import { Rng } from '../svg';
import { addStaticCanvas, artCanvas } from '../TextureFactory';

// Art for the gem tunnel, drawn once per game with canvas 2D into one atlas
// in the bold ink of the Sun and the Moon: cut gems in pastel hues (several
// shapes each) with flat facets, an ink outline and glints; paper strips
// with inked edges and thin ink ribs for the sides of the frames; and the
// face at the end of the tunnel. Everything is drawn at RES times its size,
// so it stays crisp when the tunnel brings it up close on a sharp screen.
// The colours are drawn in, not tinted, so the art looks the same in the
// WebGL and the Canvas renderer.

/** Pastel hues the gems are drawn in. */
export type GemHue = 'pink' | 'peach' | 'butter' | 'sage' | 'mint' | 'sky' | 'periwinkle' | 'lilac';

export interface Swatch {
  base: string;
  light: string;
  rim: string;
}

export const GEM_SWATCHES: Readonly<Record<GemHue, Swatch>> = {
  pink: { base: '#f4b3cb', light: '#fbdce8', rim: '#d38aa8' },
  peach: { base: '#f6c39a', light: '#fde3ca', rim: '#d69a6c' },
  butter: { base: '#f0df9c', light: '#fbf2cf', rim: '#c8b26e' },
  sage: { base: '#ccd896', light: '#e9efc7', rim: '#9daa66' },
  mint: { base: '#a6e0c6', light: '#d6f4e6', rim: '#72b99b' },
  sky: { base: '#a7cff0', light: '#d7ebfb', rim: '#729fcf' },
  periwinkle: { base: '#b5b6ee', light: '#dddcfa', rim: '#8787c9' },
  lilac: { base: '#d5b2e8', light: '#eddaf6', rim: '#a683c6' },
};

export const GEM_HUES = Object.keys(GEM_SWATCHES) as GemHue[];

/** The ink of every outline. */
const INK = '#2b2228';
/** Texture pixels per art pixel. */
const RES = 2;

interface GemShape {
  /** Half length and half width of the gem, art pixels. */
  a: number;
  b: number;
  /** Superellipse exponent of its outline's corners: 1 is a sharp diamond, 2 an ellipse. */
  p: number;
}

/** Long lozenge, rhombus and squat cushion. */
const SHAPES: readonly GemShape[] = [
  { a: 80, b: 42, p: 1.3 },
  { a: 76, b: 52, p: 1.22 },
  { a: 64, b: 54, p: 1.4 },
];

/** Room around a gem for its ink and its shadow (art pixels). */
const GEM_MARGIN = 8;
const gemCell = (s: GemShape): { w: number; h: number } => ({ w: 2 * (s.a + GEM_MARGIN), h: 2 * (s.b + GEM_MARGIN) });
/** Atlas width, and the gap between its pieces (texture pixels). */
const ATLAS_W = 2048;
const GAP = 8;
/** Paper strips and thin ribs along the sides: size and where their edge line runs (art pixels). */
const BAND_CELL = { w: 320, h: 64, line: 6 };
const RIB_CELL = { w: 320, h: 12, line: 5 };
const EDGE_WIDTH = 3;
const FACE_SIZE = 384;

type Ctx = CanvasRenderingContext2D;
type Pt = [number, number];

// ---------------------------------------------------------------- helpers

function poly(ctx: Ctx, pts: readonly Pt[]): void {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
}

function line(ctx: Ctx, pts: readonly Pt[], width: number, color: string, alpha = 1): void {
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  ctx.globalAlpha = 1;
}

const lerp = (p: Pt, q: Pt, t: number): Pt => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

/** A four-pointed sparkle: white, inked. */
function sparkle(ctx: Ctx, x: number, y: number, r: number, ink: number): void {
  const k = r * 0.22;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + k, y - k, x + r, y);
  ctx.quadraticCurveTo(x + k, y + k, x, y + r);
  ctx.quadraticCurveTo(x - k, y + k, x - r, y);
  ctx.quadraticCurveTo(x - k, y - k, x, y - r);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = ink;
  ctx.stroke();
}

/** Fades a piece to transparent over `f` of its width at both ends. */
function fadeEnds(ctx: Ctx, w: number, h: number, f: number): void {
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'destination-in';
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(f, 'rgba(0,0,0,1)');
  g.addColorStop(1 - f, 'rgba(0,0,0,1)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
}

// ---------------------------------------------------------------- gems

/** The gem's outline: eight corners on its superellipse, tips first along the long axis. */
function outline(s: GemShape): Pt[] {
  const pts: Pt[] = [];
  for (let k = 0; k < 8; k++) {
    const t = (k * Math.PI) / 4;
    const c = Math.cos(t);
    const sn = Math.sin(t);
    pts.push([s.a * Math.sign(c) * Math.abs(c) ** (2 / s.p), s.b * Math.sign(sn) * Math.abs(sn) ** (2 / s.p)]);
  }
  return pts;
}

/** How brightly a facet facing `angle` is lit: a key light from the upper left, a little light back from the lower right. */
function facetLight(angle: number): number {
  const key = 0.5 + 0.5 * Math.cos(angle + (3 * Math.PI) / 4);
  const back = Math.max(0, Math.cos(angle - Math.PI / 4)) ** 4;
  return Math.min(1, key * 0.92 + back * 0.3);
}

/** A facet's colour for its light (0 dark … 1 bright). */
function facetColor(sw: Swatch, deep: string, l: number): string {
  if (l > 0.66) return mix(sw.base, sw.light, (l - 0.66) / 0.34);
  if (l > 0.33) return mix(sw.rim, sw.base, (l - 0.33) / 0.33);
  return mix(deep, sw.rim, l / 0.33);
}

/**
 * One cut gem, centred at the origin (art pixels): a table on top, eight
 * facets around it lit from the upper left, the cuts and the outline in
 * ink, a glint and a sparkle, and a soft shadow under it.
 */
function paintGem(ctx: Ctx, s: GemShape, sw: Swatch, rng: Rng): void {
  const deep = mix(sw.rim, '#4a3f5c', 0.35);
  const outer = outline(s);
  const ox = -s.a * rng.range(0.04, 0.08);
  const oy = -s.b * rng.range(0.06, 0.1);
  const table = outer.map(([x, y]): Pt => [ox + x * 0.5, oy + y * 0.5]);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  // Its shadow on the frame.
  ctx.save();
  ctx.translate(2.5, 3.5);
  poly(ctx, outer);
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;
  // The facets between the table and the outline.
  for (let k = 0; k < 8; k++) {
    const a = outer[k]!;
    const b = outer[(k + 1) % 8]!;
    const mid = lerp(a, b, 0.5);
    poly(ctx, [a, b, table[(k + 1) % 8]!, table[k]!]);
    ctx.fillStyle = facetColor(sw, deep, facetLight(Math.atan2(mid[1] / s.b, mid[0] / s.a)));
    ctx.fill();
    // Flat colour edge to edge: the facet's own line hides the seam.
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // The table: lit across from its upper left.
  const g = ctx.createLinearGradient(ox - s.a * 0.5, oy - s.b * 0.5, ox + s.a * 0.5, oy + s.b * 0.5);
  g.addColorStop(0, mix(sw.light, '#ffffff', 0.45));
  g.addColorStop(1, mix(sw.base, sw.light, 0.25));
  poly(ctx, table);
  ctx.fillStyle = g;
  ctx.fill();
  // The cuts: from each corner to the table, and the table's edge.
  for (let k = 0; k < 8; k++) line(ctx, [outer[k]!, table[k]!], 1.6, INK, 0.6);
  poly(ctx, table);
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.globalAlpha = 1;
  // A glint along the upper left facet, and a sparkle on the table's corner.
  const g0 = lerp(outer[4]!, table[4]!, 0.3);
  const g1 = lerp(outer[5]!, table[5]!, 0.3);
  line(ctx, [lerp(g0, g1, 0.12), lerp(g0, g1, 0.88)], 3, '#ffffff', 0.9);
  const sp = lerp(table[5]!, table[4]!, 0.25);
  sparkle(ctx, sp[0] + s.b * 0.1, sp[1] + s.b * 0.08, s.b * rng.range(0.2, 0.26), 1.3);
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ox + s.a * 0.16, oy - s.b * 0.04, s.b * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  // The outline last, bold.
  poly(ctx, outer);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.stroke();
}

// ---------------------------------------------------------------- sides

/**
 * A paper strip along one side of a frame (art pixels): the frame's edge
 * in bold ink at `lineY`, a light line under it, the paper shading a
 * little darker toward the inside, an inked inner edge, and a row of small
 * gem studs. Its ends fade under the corner gems.
 */
function paintBand(ctx: Ctx, w: number, h: number, lineY: number, paper: string, studs: readonly string[]): void {
  const inner = h - 6;
  const g = ctx.createLinearGradient(0, lineY, 0, inner);
  g.addColorStop(0, mix(paper, '#ffffff', 0.55));
  g.addColorStop(1, mix(paper, '#ffffff', 0.1));
  ctx.fillStyle = g;
  ctx.fillRect(0, lineY, w, inner - lineY);
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'round';
  line(ctx, [[0, lineY + 3.2], [w, lineY + 3.2]], 1.5, '#ffffff', 0.85);
  line(ctx, [[0, inner], [w, inner]], 2, INK, 0.85);
  line(ctx, [[0, lineY], [w, lineY]], EDGE_WIDTH, INK, 1);
  // Studs down the middle of the strip.
  const y = (lineY + inner) / 2 + 1;
  for (let i = 0, x = 22; x < w - 16; x += 36, i++) {
    poly(ctx, [[x - 7, y], [x, y - 6], [x + 7, y], [x, y + 6]]);
    ctx.fillStyle = studs[i % studs.length]!;
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - 2, y - 1.8, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
  fadeEnds(ctx, w, h, 0.06);
}

/** A rib: the frame's edge as an ink line with a light line beside it. */
function paintRib(ctx: Ctx, w: number, h: number, lineY: number): void {
  ctx.lineCap = 'butt';
  line(ctx, [[0, lineY + 2.6], [w, lineY + 2.6]], 1.4, '#ffffff', 0.7);
  line(ctx, [[0, lineY], [w, lineY]], EDGE_WIDTH, INK, 0.9);
  fadeEnds(ctx, w, h, 0.08);
}

// ---------------------------------------------------------------- face

/** The pink swirl above the eye: an inked ribbon winding inward. */
function paintSwirl(ctx: Ctx, x: number, y: number, rx: number, ry: number): void {
  const pts: Pt[] = [];
  for (let i = 0; i <= 160; i++) {
    const t = i / 160;
    const a = -Math.PI / 2 + t * Math.PI * 2 * 2.6;
    const r = 1 - t * 0.86;
    pts.push([x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r]);
  }
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  line(ctx, pts, 15, INK);
  line(ctx, pts, 10, GEM_SWATCHES.pink.base);
  line(ctx, pts.map(([px, py]): Pt => [px - 1.5, py - 2]), 3, GEM_SWATCHES.pink.light, 0.9);
}

/** The eye: an almond with a plum iris under a heavy lid, lashes and a brow. */
function paintEye(ctx: Ctx, ex: number, ey: number, ew: number, eh: number): void {
  const almond = (): void => {
    ctx.beginPath();
    ctx.moveTo(ex - ew, ey);
    ctx.quadraticCurveTo(ex, ey - eh * 1.9, ex + ew, ey);
    ctx.quadraticCurveTo(ex, ey + eh * 1.5, ex - ew, ey);
    ctx.closePath();
  };
  ctx.fillStyle = '#fffaf3';
  almond();
  ctx.fill();
  ctx.save();
  almond();
  ctx.clip();
  const ir = eh * 0.95;
  const ix = ex + ew * 0.05;
  const iy = ey - eh * 0.12;
  ctx.fillStyle = '#9b6f8c';
  ctx.beginPath();
  ctx.arc(ix, iy, ir, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c99ab4';
  ctx.beginPath();
  ctx.arc(ix, iy, ir * 0.72, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a2836';
  ctx.beginPath();
  ctx.arc(ix, iy, ir * 0.44, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ix - ir * 0.32, iy - ir * 0.34, ir * 0.18, 0, Math.PI * 2);
  ctx.fill();
  // The lid's shadow over the top of the eye.
  ctx.fillStyle = 'rgba(43,34,40,0.22)';
  ctx.fillRect(ex - ew, ey - eh * 2, ew * 2, eh * 0.95);
  ctx.restore();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3.5;
  almond();
  ctx.stroke();
  line(ctx, [[ex - ew * 1.05, ey + eh * 0.05], [ex - ew * 0.5, ey - eh * 1.3], [ex, ey - eh * 1.48], [ex + ew * 0.5, ey - eh * 1.3], [ex + ew * 1.05, ey]], 6, INK);
  for (let i = 0; i < 7; i++) {
    const k = -0.75 + (i / 6) * 1.5;
    const bx = ex + ew * k;
    const by = ey - eh * 1.45 * (1 - k * k * 0.72);
    const a = -Math.PI / 2 + k * 0.9 - 0.2;
    line(ctx, [[bx, by], [bx + Math.cos(a) * eh * 0.85, by + Math.sin(a) * eh * 0.85]], 3, INK);
  }
  line(ctx, [[ex - ew * 0.9, ey - eh * 2.3], [ex - ew * 0.2, ey - eh * 2.9], [ex + ew * 0.85, ey - eh * 2.4]], 4.5, INK);
}

/** The lips: mint outer lips around a coral mouth, inked. */
function paintLips(ctx: Ctx, lx: number, ly: number, lw: number, lh: number, tilt: number): void {
  ctx.save();
  ctx.translate(lx, ly);
  ctx.rotate(tilt);
  const lips = (k: number): void => {
    ctx.beginPath();
    ctx.moveTo(-lw * k, 0);
    ctx.bezierCurveTo(-lw * 0.6 * k, -lh * 1.1 * k, -lw * 0.25 * k, -lh * 1.25 * k, 0, -lh * 0.6 * k);
    ctx.bezierCurveTo(lw * 0.25 * k, -lh * 1.25 * k, lw * 0.6 * k, -lh * 1.1 * k, lw * k, 0);
    ctx.bezierCurveTo(lw * 0.6 * k, lh * 1.5 * k, -lw * 0.6 * k, lh * 1.5 * k, -lw * k, 0);
    ctx.closePath();
  };
  ctx.fillStyle = '#c3e3a6';
  lips(1);
  ctx.fill();
  ctx.fillStyle = '#f2a3ae';
  lips(0.64);
  ctx.fill();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.2;
  lips(0.64);
  ctx.stroke();
  line(ctx, [[-lw * 0.62, lh * 0.02], [-lw * 0.2, lh * 0.18], [0, lh * 0.08], [lw * 0.2, lh * 0.18], [lw * 0.62, lh * 0.02]], 3, INK);
  line(ctx, [[-lw * 0.35, -lh * 0.62], [-lw * 0.12, -lh * 0.78]], 3, '#ffffff', 0.85);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  lips(1);
  ctx.stroke();
  ctx.restore();
}

/**
 * The face at the end of the tunnel: one eye and a pair of lips under a
 * pink swirl, on a cream disc with an inked rim and a soft glow around it.
 */
function paintFace(ctx: Ctx, u: number): void {
  const c = u / 2;
  const glow = ctx.createRadialGradient(c, c, u * 0.38, c, c, u * 0.5);
  glow.addColorStop(0, 'rgba(255,246,226,0.85)');
  glow.addColorStop(1, 'rgba(255,246,226,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, u, u);
  const disc = ctx.createRadialGradient(c - u * 0.08, c - u * 0.1, u * 0.05, c, c, u * 0.4);
  disc.addColorStop(0, '#fffaf0');
  disc.addColorStop(1, '#f6ecf6');
  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(c, c, u * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.stroke();
  // Little sparkles around the rim.
  for (const [a, r] of [
    [-2.4, 0.06],
    [-0.5, 0.045],
    [0.9, 0.055],
    [2.6, 0.04],
  ] as const) {
    sparkle(ctx, c + Math.cos(a) * u * 0.44, c + Math.sin(a) * u * 0.44, u * r, 1.6);
  }
  paintSwirl(ctx, u * 0.5, u * 0.33, u * 0.2, u * 0.075);
  paintEye(ctx, u * 0.44, u * 0.56, u * 0.1, u * 0.046);
  paintLips(ctx, u * 0.55, u * 0.74, u * 0.15, u * 0.058, -0.12);
}

// ---------------------------------------------------------------- atlas

/** The paper and stud hues of the strips (one set per kind). */
const BANDS: readonly { paper: GemHue; studs: readonly GemHue[] }[] = [
  { paper: 'lilac', studs: ['sky', 'pink', 'mint'] },
  { paper: 'pink', studs: ['peach', 'butter', 'lilac'] },
  { paper: 'mint', studs: ['sky', 'sage', 'pink'] },
  { paper: 'periwinkle', studs: ['lilac', 'mint', 'butter'] },
  { paper: 'butter', studs: ['sage', 'peach', 'sky'] },
  { paper: 'sky', studs: ['pink', 'mint', 'lilac'] },
];

const RIBS = 3;

/** A piece laid along a side of a frame's square. */
export interface SidePiece {
  frame: string;
  /** Length in texture pixels. */
  length: number;
  /** Where the edge line runs, from the top of the texture (0..1). */
  lineY: number;
  /** Width of the edge line in texture pixels. */
  lineWidth: number;
}

/**
 * The tunnel's art: one atlas texture with a frame per gem (hue × shape),
 * per side strip and rib, and for the face. `GemArt.ensure(scene)` draws it
 * the first time it is needed; later calls return the same instance.
 */
export class GemArt {
  static readonly KEY = 'fx.gemart';
  static readonly SHAPES = SHAPES.length;
  static readonly BANDS = BANDS.length;
  static readonly RIBS = RIBS;
  private static instance: GemArt | null = null;

  /** Draws the atlas once per game (texture managers are per game). */
  static ensure(scene: Phaser.Scene): GemArt {
    const art = (GemArt.instance ??= new GemArt());
    if (!scene.textures.exists(GemArt.KEY)) art.paint(scene.textures);
    return art;
  }

  readonly face = 'face';
  /** The face's size in texture pixels. */
  readonly faceSize = FACE_SIZE * RES;

  /** Gem frame for a hue and a shape. */
  gem(hue: GemHue, shape: number): string {
    return `g:${hue}:${shape % SHAPES.length}`;
  }

  /** Length of a gem shape's long axis in texture pixels. */
  gemLength(shape: number): number {
    return SHAPES[shape % SHAPES.length]!.a * 2 * RES;
  }

  /** A paper strip (full-screen tunnels) or a thin rib along a side. */
  side(kind: number, brushed: boolean): SidePiece {
    const cell = brushed ? BAND_CELL : RIB_CELL;
    const n = brushed ? BANDS.length : RIBS;
    return { frame: `${brushed ? 'b' : 'r'}:${kind % n}`, length: cell.w * RES, lineY: cell.line / cell.h, lineWidth: EDGE_WIDTH * RES };
  }

  private paint(textures: Phaser.Textures.TextureManager): void {
    const rng = new Rng(0x9e3779b9);
    const pieces: { name: string; c: HTMLCanvasElement; x: number; y: number }[] = [];
    /** A canvas RES times the art size, drawn in art pixels. */
    const piece = (name: string, w: number, h: number, draw: (ctx: Ctx) => void): void => {
      const [c, ctx] = artCanvas(Math.ceil(w * RES), Math.ceil(h * RES));
      ctx.scale(RES, RES);
      draw(ctx);
      pieces.push({ name, c, x: 0, y: 0 });
    };
    SHAPES.forEach((shape, si) => {
      const cell = gemCell(shape);
      for (const hue of GEM_HUES) {
        piece(this.gem(hue, si), cell.w, cell.h, (ctx) => {
          ctx.translate(cell.w / 2, cell.h / 2);
          paintGem(ctx, shape, GEM_SWATCHES[hue], rng);
        });
      }
    });
    piece(this.face, FACE_SIZE, FACE_SIZE, (ctx) => paintFace(ctx, FACE_SIZE));
    BANDS.forEach(({ paper, studs }, i) => {
      piece(this.side(i, true).frame, BAND_CELL.w, BAND_CELL.h, (ctx) =>
        paintBand(ctx, BAND_CELL.w, BAND_CELL.h, BAND_CELL.line, GEM_SWATCHES[paper].base, studs.map((h) => GEM_SWATCHES[h].base)),
      );
    });
    for (let i = 0; i < RIBS; i++) piece(this.side(i, false).frame, RIB_CELL.w, RIB_CELL.h, (ctx) => paintRib(ctx, RIB_CELL.w, RIB_CELL.h, RIB_CELL.line));
    // Shelves, tallest pieces first; gaps keep mip-mapped neighbours apart.
    let x = 0;
    let y = 0;
    let shelf = 0;
    for (const p of [...pieces].sort((a, b) => b.c.height - a.c.height)) {
      if (x + p.c.width > ATLAS_W) {
        x = 0;
        y += shelf + GAP;
        shelf = 0;
      }
      p.x = x;
      p.y = y;
      x += p.c.width + GAP;
      shelf = Math.max(shelf, p.c.height);
    }
    // A power of two, so WebGL mip-maps it.
    const [atlas, ctx] = artCanvas(ATLAS_W, 2 ** Math.ceil(Math.log2(y + shelf)));
    for (const p of pieces) ctx.drawImage(p.c, p.x, p.y);
    const tex = addStaticCanvas(textures, GemArt.KEY, atlas);
    for (const p of pieces) tex?.add(p.name, 0, p.x, p.y, p.c.width, p.c.height);
  }
}

/** Hue angle (degrees) and saturation (0..1) of a 0xRRGGBB colour. */
function hueOf(rgb: number): { h: number; s: number } {
  const r = ((rgb >> 16) & 255) / 255;
  const g = ((rgb >> 8) & 255) / 255;
  const b = (rgb & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return { h: 0, s: 0 };
  const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s: d / (1 - Math.abs(max + min - 1) || 1) };
}

/** The drawn pastel hue nearest to a colour (greys become lilac). */
export function nearestGemHue(rgb: number): GemHue {
  const want = hueOf(rgb);
  if (want.s < 0.12) return 'lilac';
  let best: GemHue = 'lilac';
  let bestD = Infinity;
  for (const hue of GEM_HUES) {
    const h = hueOf(parseInt(GEM_SWATCHES[hue].base.slice(1), 16)).h;
    const d = Math.min(Math.abs(h - want.h), 360 - Math.abs(h - want.h));
    if (d < bestD) {
      best = hue;
      bestD = d;
    }
  }
  return best;
}
