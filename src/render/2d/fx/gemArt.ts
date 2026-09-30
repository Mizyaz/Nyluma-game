import type * as Phaser from 'phaser';
import { mix } from '../palette';
import { Rng } from '../svg';
import { addStaticCanvas, artCanvas } from '../TextureFactory';

// Painterly art for the gem tunnel, painted once per game with canvas 2D
// into one atlas: rounded diamond gems in pastel hues (several shapes each),
// brushed bands and thin ribs for the sides of the frames, and the face at
// the end of the tunnel. The colours are painted in, not tinted, so the art
// looks the same in the WebGL and the Canvas renderer.

/** Pastel hues the gems are painted in. */
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

/** Cream and pale tints of the painted paper between the gems. */
const PAPER = ['#fdf8ef', '#f6eefa', '#eef6f1', '#fdf1dd', '#ecf0fb', '#fbeef3'];

interface GemShape {
  /** Half length and half width of the gem in texture pixels. */
  a: number;
  b: number;
  /** Superellipse exponent: 1 is a sharp diamond, 2 an ellipse. */
  p: number;
}

/** Long lozenge, rhombus and squat cushion, as in the reference painting. */
const SHAPES: readonly GemShape[] = [
  { a: 80, b: 42, p: 1.3 },
  { a: 76, b: 52, p: 1.22 },
  { a: 64, b: 54, p: 1.4 },
];

/** Transparent margin around a gem in its frame (kept small: Canvas pays for every pixel of a rotated frame). */
const GEM_MARGIN = 5;
const gemCell = (s: GemShape): { w: number; h: number } => ({ w: 2 * (s.a + GEM_MARGIN), h: 2 * (s.b + GEM_MARGIN) });
const GEM_COLUMN = Math.max(...SHAPES.map((s) => gemCell(s).w));
/** Atlas width, and the gap between its pieces. */
const ATLAS_W = 2048;
const GAP = 8;
/** Brushed side bands and thin ribs: size and where their edge line runs. */
const BAND_CELL = { w: 320, h: 64, line: 6 };
const RIB_CELL = { w: 320, h: 12, line: 5 };
const EDGE_WIDTH = 2.6;
const FACE_SIZE = 384;

type Ctx = CanvasRenderingContext2D;

/** Short, slightly curved brush strokes: the painterly look. */
class Brush {
  constructor(
    readonly ctx: Ctx,
    readonly rng: Rng,
  ) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  stroke(x: number, y: number, angle: number, len: number, width: number, color: string, alpha: number, bend = 0): void {
    const c = this.ctx;
    const dx = (Math.cos(angle) * len) / 2;
    const dy = (Math.sin(angle) * len) / 2;
    c.globalAlpha = alpha;
    c.strokeStyle = color;
    c.lineWidth = width;
    c.beginPath();
    c.moveTo(x - dx, y - dy);
    c.quadraticCurveTo(x - dy * bend, y + dx * bend, x + dx, y + dy);
    c.stroke();
  }

  /** A dry-brush stroke: a bundle of thin fibres of uneven length. */
  fibres(x: number, y: number, angle: number, len: number, width: number, color: string, alpha: number): void {
    const n = Math.max(2, Math.round(width / 1.6));
    const nx = -Math.sin(angle);
    const ny = Math.cos(angle);
    for (let i = 0; i < n; i++) {
      const o = (i / (n - 1) - 0.5) * width;
      const l = len * this.rng.range(0.55, 1);
      const shift = (len - l) * this.rng.range(-0.5, 0.5);
      this.stroke(x + nx * o + Math.cos(angle) * shift, y + ny * o + Math.sin(angle) * shift, angle, l, this.rng.range(1, 1.9), color, alpha * this.rng.range(0.55, 1), this.rng.range(-0.05, 0.05));
    }
  }

  /** A wobbly line through points (scribbles, swirls, lids). */
  line(pts: readonly [number, number][], width: number, color: string | CanvasGradient, alpha: number, wobble = 0): void {
    const c = this.ctx;
    const j = (): number => (this.rng.next() - 0.5) * 2 * wobble;
    c.globalAlpha = alpha;
    c.strokeStyle = color;
    c.lineWidth = width;
    c.beginPath();
    c.moveTo(pts[0]![0] + j(), pts[0]![1] + j());
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i]![0] + j(), pts[i]![1] + j());
    c.stroke();
  }
}

// ---------------------------------------------------------------- shapes

function superPoint(s: GemShape, t: number, k = 1): [number, number] {
  const c = Math.cos(t);
  const sn = Math.sin(t);
  return [k * s.a * Math.sign(c) * Math.abs(c) ** (2 / s.p), k * s.b * Math.sign(sn) * Math.abs(sn) ** (2 / s.p)];
}

function superPath(ctx: Ctx, s: GemShape, k = 1, ox = 0, oy = 0): void {
  ctx.beginPath();
  for (let i = 0; i < 72; i++) {
    const [x, y] = superPoint(s, (i / 72) * Math.PI * 2, k);
    if (i === 0) ctx.moveTo(x + ox, y + oy);
    else ctx.lineTo(x + ox, y + oy);
  }
  ctx.closePath();
}

/** 0 at the centre of the gem, 1 on its outline. */
function superRadius(s: GemShape, x: number, y: number): number {
  return (Math.abs(x / s.a) ** s.p + Math.abs(y / s.b) ** s.p) ** (1 / s.p);
}

/** Direction along the gem's outline through (x, y). */
function tangent(s: GemShape, x: number, y: number): number {
  const gx = (Math.sign(x) * Math.abs(x) ** (s.p - 1)) / s.a ** s.p;
  const gy = (Math.sign(y) * Math.abs(y) ** (s.p - 1)) / s.b ** s.p;
  return Math.atan2(gy, gx) + Math.PI / 2;
}

// ---------------------------------------------------------------- painters

/** One gem, centred at the origin: dark rim, body, light facet, strokes. */
function paintGem(ctx: Ctx, s: GemShape, sw: Swatch, accent: string, rng: Rng): void {
  const brush = new Brush(ctx, rng);
  const deep = mix(sw.rim, '#4a3f5c', 0.28);
  ctx.globalAlpha = 1;
  ctx.fillStyle = sw.rim;
  superPath(ctx, s);
  ctx.fill();
  ctx.fillStyle = sw.base;
  superPath(ctx, s, 0.8);
  ctx.fill();
  ctx.fillStyle = sw.light;
  superPath(ctx, s, 0.46, -s.a * 0.06, -s.b * 0.08);
  ctx.fill();
  // Facet edges from the inner table to the tips.
  for (let i = 0; i < 4; i++) {
    const t = (i * Math.PI) / 2;
    const [x0, y0] = superPoint(s, t, 0.46);
    const [x1, y1] = superPoint(s, t, 0.92);
    brush.line([[x0 - s.a * 0.06, y0 - s.b * 0.08], [x1, y1]], 3, deep, 0.4, 1);
  }
  // Body strokes along the outline, lit from the upper left.
  const n = Math.round((s.a * s.b) / 11);
  for (let i = 0; i < n; i++) {
    const x = rng.range(-s.a, s.a);
    const y = rng.range(-s.b, s.b);
    const r = superRadius(s, x, y);
    if (r > 0.95) continue;
    const lit = (-x / s.a - y / s.b) * 0.5;
    let col: string;
    if (r > 0.8) col = rng.chance(0.5) ? sw.rim : rng.chance(0.5) ? deep : mix(sw.rim, sw.base, 0.5);
    else if (r > 0.46) col = lit + rng.range(-0.5, 0.5) > 0.1 ? mix(sw.base, sw.light, rng.range(0.2, 0.7)) : mix(sw.base, sw.rim, rng.range(0.1, 0.55));
    else col = rng.chance(0.25) ? mix(sw.light, '#ffffff', 0.6) : mix(sw.light, sw.base, rng.range(0, 0.45));
    if (rng.chance(0.02)) col = accent;
    const ang = tangent(s, x, y) + rng.range(-0.45, 0.45);
    brush.stroke(x, y, ang, rng.range(7, 17), rng.range(2.2, 4.6), col, rng.range(0.45, 0.85), rng.range(-0.3, 0.3));
  }
  // Brushed rim, inside the silhouette.
  for (let i = 0; i < 120; i++) {
    const t = rng.range(0, Math.PI * 2);
    const [x, y] = superPoint(s, t, rng.range(0.84, 0.95));
    brush.stroke(x, y, tangent(s, x, y) + rng.range(-0.15, 0.15), rng.range(6, 12), rng.range(2.5, 4.2), rng.chance(0.55) ? sw.rim : deep, rng.range(0.5, 0.85), rng.range(-0.2, 0.2));
  }
  // Highlights on the upper left facet.
  for (let i = 0; i < 9; i++) {
    const x = -s.a * rng.range(0.1, 0.45);
    const y = -s.b * rng.range(0.15, 0.45);
    brush.stroke(x, y, tangent(s, x, y) + rng.range(-0.3, 0.3), rng.range(6, 13), rng.range(1.8, 3.2), mix(sw.light, '#ffffff', 0.7), rng.range(0.55, 0.85));
  }
  ctx.globalAlpha = 1;
}

/** Fades a scratch canvas to transparent towards its ends (fx) and its top and bottom edges. */
function featherEdges(ctx: Ctx, w: number, h: number, fx: number, top: number, bottom: number): void {
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'destination-in';
  const gx = ctx.createLinearGradient(0, 0, w, 0);
  gx.addColorStop(0, 'rgba(0,0,0,0)');
  gx.addColorStop(fx, 'rgba(0,0,0,1)');
  gx.addColorStop(1 - fx, 'rgba(0,0,0,1)');
  gx.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gx;
  ctx.fillRect(0, 0, w, h);
  const gy = ctx.createLinearGradient(0, 0, 0, h);
  gy.addColorStop(0, 'rgba(0,0,0,0)');
  gy.addColorStop(top, 'rgba(0,0,0,1)');
  gy.addColorStop(1 - bottom, 'rgba(0,0,0,1)');
  gy.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gy;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
}

/** '#rrggbb' with an alpha. */
function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** The painted line where a frame's square ends, with a light rim beside it; both fade out at the ends. */
function edgeLine(brush: Brush, w: number, y: number, color: string): void {
  const fading = (col: string): CanvasGradient => {
    const g = brush.ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, rgba(col, 0));
    g.addColorStop(0.08, rgba(col, 1));
    g.addColorStop(0.92, rgba(col, 1));
    g.addColorStop(1, rgba(col, 0));
    return g;
  };
  brush.line([[0, y], [w * 0.35, y - 0.4], [w * 0.7, y + 0.5], [w, y]], EDGE_WIDTH, fading(color), 0.85, 0.5);
  brush.line([[0, y + 3], [w, y + 3]], 1.4, fading('#ffffff'), 0.6, 0.4);
}

/**
 * A brushed band along one side of a frame, its edge line near the top:
 * dry-brush streaks in paper tints with a little colour, fading toward the
 * inside of the frame.
 */
function paintBand(ctx: Ctx, w: number, h: number, lineY: number, tints: readonly string[], inks: readonly string[], edge: string, rng: Rng): void {
  const brush = new Brush(ctx, rng);
  for (let i = 0; i < 48; i++) {
    const y = lineY + (h - lineY) * (0.1 + 0.75 * rng.next() ** 1.4);
    brush.fibres(rng.range(w * 0.1, w * 0.9), y, rng.range(-0.04, 0.04), rng.range(w * 0.12, w * 0.38), rng.range(4, 11), rng.pick(tints), rng.range(0.55, 0.9));
  }
  for (let i = 0; i < 16; i++) {
    brush.fibres(rng.range(w * 0.12, w * 0.88), lineY + (h - lineY) * rng.range(0.1, 0.7), rng.range(-0.08, 0.08), rng.range(w * 0.06, w * 0.2), rng.range(2.5, 5), rng.pick(inks), rng.range(0.55, 0.85));
  }
  featherEdges(ctx, w, h, 0.1, 0.04, 0.4);
  edgeLine(brush, w, lineY, edge);
  ctx.globalAlpha = 1;
}

/** A rib: just the edge line of a side, with a few light fibres along it. */
function paintRib(ctx: Ctx, w: number, h: number, lineY: number, color: string, rng: Rng): void {
  const brush = new Brush(ctx, rng);
  for (let i = 0; i < 12; i++) {
    brush.fibres(rng.range(w * 0.1, w * 0.9), lineY + rng.range(-1, 2), rng.range(-0.01, 0.01), rng.range(w * 0.1, w * 0.3), 2.5, mix(color, '#ffffff', 0.5), 0.4);
  }
  featherEdges(ctx, w, h, 0.08, 0, 0);
  edgeLine(brush, w, lineY, color);
  ctx.globalAlpha = 1;
}

/** A painted ellipse ring: short strokes along it, jittered across it. */
function ring(brush: Brush, cx: number, cy: number, rx: number, ry: number, tilt: number, width: number, colors: readonly string[], alpha: number): void {
  const n = Math.round((rx + ry) / 2.2);
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + brush.rng.range(-0.05, 0.05);
    const k = 1 + brush.rng.range(-0.5, 0.5) * (width / ry) * 0.5;
    const x = Math.cos(a) * rx * k;
    const y = Math.sin(a) * ry * k;
    const ang = Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx) + tilt;
    brush.stroke(cx + x * ct - y * st, cy + x * st + y * ct, ang, brush.rng.range(8, 16), width * brush.rng.range(0.45, 0.8), brush.rng.pick(colors), alpha * brush.rng.range(0.7, 1), brush.rng.range(-0.15, 0.15));
  }
}

/** Soft painted ground of the face: cream in the middle, fading out at the edge, with coloured rays and scribbles. */
function paintFaceGround(brush: Brush, u: number): void {
  const { ctx, rng } = brush;
  const c = u / 2;
  const ground = ctx.createRadialGradient(c, c, 0, c, c, c);
  ground.addColorStop(0, 'rgba(253,248,240,1)');
  ground.addColorStop(0.62, 'rgba(248,241,247,0.96)');
  ground.addColorStop(0.86, 'rgba(244,236,248,0.55)');
  ground.addColorStop(1, 'rgba(244,236,248,0)');
  ctx.globalAlpha = 1;
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, u, u);
  for (let i = 0; i < 520; i++) {
    const a = rng.range(0, Math.PI * 2);
    const r = Math.sqrt(rng.next()) * u * 0.47;
    brush.stroke(c + Math.cos(a) * r, c + Math.sin(a) * r, a + Math.PI / 2 + rng.range(-0.5, 0.5), rng.range(8, 20), rng.range(2, 5), rng.pick(PAPER), 0.55 * (1 - r / (u * 0.5)), rng.range(-0.3, 0.3));
  }
  const inks = [GEM_SWATCHES.butter.base, GEM_SWATCHES.mint.base, GEM_SWATCHES.sky.base, GEM_SWATCHES.pink.base, GEM_SWATCHES.sage.rim];
  for (let i = 0; i < 50; i++) {
    const a = rng.range(-Math.PI * 0.85, -Math.PI * 0.15);
    const r0 = rng.range(0.1, 0.2) * u;
    const r1 = r0 + rng.range(0.07, 0.17) * u;
    const ox = c + u * 0.02;
    const oy = u * 0.4;
    brush.line([[ox + Math.cos(a) * r0, oy + Math.sin(a) * r0], [ox + Math.cos(a) * r1, oy + Math.sin(a) * r1]], rng.range(1.3, 2.6), rng.pick(inks), rng.range(0.3, 0.6), 1.2);
  }
  for (let i = 0; i < 4; i++) {
    const a = rng.range(0, Math.PI * 2);
    const r = rng.range(0.36, 0.43) * u;
    const pts: [number, number][] = [];
    for (let k = 0; k <= 7; k++) pts.push([c + Math.cos(a + k * 0.06) * (r + Math.sin(k * 1.4) * u * 0.01), c + Math.sin(a + k * 0.06) * (r + Math.sin(k * 1.4) * u * 0.01)]);
    brush.line(pts, rng.range(3, 5), rng.pick([GEM_SWATCHES.lilac.base, GEM_SWATCHES.periwinkle.base, GEM_SWATCHES.sky.base]), 0.45, 0.8);
  }
}

/** The pink swirl above the eye: an elongated spiral of painted rings. */
function paintSwirl(brush: Brush, x: number, y: number, rx: number, ry: number): void {
  const pink = GEM_SWATCHES.pink;
  const rings: readonly (readonly string[])[] = [
    [pink.rim, '#e58fb3', pink.base],
    [pink.base, '#f19cbf', pink.rim],
    [pink.light, pink.base, '#f19cbf'],
    [GEM_SWATCHES.lilac.base, GEM_SWATCHES.periwinkle.base],
    [GEM_SWATCHES.sky.base, GEM_SWATCHES.sky.light],
    ['#f19cbf', pink.base],
    [GEM_SWATCHES.mint.base, GEM_SWATCHES.sage.base],
    [GEM_SWATCHES.periwinkle.rim, GEM_SWATCHES.lilac.rim],
    [pink.base, GEM_SWATCHES.butter.base],
  ];
  rings.forEach((cols, j) => {
    const f = 1 - j * 0.1;
    ring(brush, x + j * rx * 0.02, y + j * ry * 0.01, rx * f, ry * f, -0.07, Math.max(4, 10 - j * 0.7), cols, 0.85);
  });
  // A curl flicking up from the right end.
  const curl: [number, number][] = [];
  for (let i = 0; i <= 18; i++) {
    const a = Math.PI * (0.6 + (i / 18) * 1.7);
    const r = ry * (1.1 - (i / 18) * 0.7);
    curl.push([x + rx * 0.8 + Math.cos(a) * r * 1.2, y - ry * 1.6 + Math.sin(a) * r]);
  }
  brush.line(curl, 4, pink.rim, 0.7, 0.8);
}

/** The eye: almond, plum iris, coral lashes. */
function paintEye(brush: Brush, ex: number, ey: number, ew: number, eh: number): void {
  const { ctx, rng } = brush;
  const almond = (): void => {
    ctx.beginPath();
    ctx.moveTo(ex - ew, ey);
    ctx.quadraticCurveTo(ex, ey - eh * 1.9, ex + ew, ey);
    ctx.quadraticCurveTo(ex, ey + eh * 1.5, ex - ew, ey);
    ctx.closePath();
  };
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fffaf3';
  almond();
  ctx.fill();
  ctx.save();
  almond();
  ctx.clip();
  const ir = eh * 0.85;
  const ix = ex + ew * 0.05;
  const iy = ey - eh * 0.1;
  ctx.fillStyle = '#b98ba3';
  ctx.beginPath();
  ctx.arc(ix, iy, ir, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 30; i++) {
    const a = rng.range(0, Math.PI * 2);
    brush.stroke(ix + Math.cos(a) * ir * 0.6, iy + Math.sin(a) * ir * 0.6, a, ir * 0.7, 1.7, rng.pick(['#8e6581', '#d2a9bd', '#a7c7b3']), 0.7);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#4d3549';
  ctx.beginPath();
  ctx.arc(ix, iy, ir * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ix - ir * 0.3, iy - ir * 0.35, ir * 0.17, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  brush.line([[ex - ew, ey], [ex - ew * 0.5, ey - eh * 1.25], [ex, ey - eh * 1.45], [ex + ew * 0.5, ey - eh * 1.25], [ex + ew, ey]], 4.5, '#9c6a86', 0.9, 0.6);
  brush.line([[ex - ew, ey], [ex - ew * 0.4, ey + eh * 0.85], [ex + ew * 0.4, ey + eh * 0.85], [ex + ew, ey]], 2.4, '#c99ab0', 0.8, 0.5);
  brush.line([[ex - ew * 0.9, ey - eh * 1.6], [ex, ey - eh * 2.35], [ex + ew * 0.9, ey - eh * 1.7]], 2.6, GEM_SWATCHES.lilac.rim, 0.5, 0.8);
  for (let i = 0; i < 7; i++) {
    const k = -0.75 + (i / 6) * 1.5;
    brush.stroke(ex + ew * k - eh * 0.1, ey - eh * 1.45 * (1 - k * k * 0.75) - eh * 0.35, -Math.PI / 2 + k * 0.9 - 0.25, eh * 0.75, 2.4, '#de8b8f', 0.85, 0.3);
  }
}

/** The lips: mint-lime outer lips around a coral mouth. */
function paintLips(brush: Brush, lx: number, ly: number, lw: number, lh: number, tilt: number): void {
  const { ctx, rng } = brush;
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
  const painted = (k: number, fill: string, inks: readonly string[], n: number): void => {
    ctx.globalAlpha = 1;
    ctx.fillStyle = fill;
    lips(k);
    ctx.fill();
    ctx.save();
    lips(k);
    ctx.clip();
    for (let i = 0; i < n; i++) {
      const x = rng.range(-lw * k, lw * k);
      const y = rng.range(-lh * 1.2 * k, lh * 1.2 * k);
      brush.stroke(x, y, rng.range(-0.3, 0.3) + (x / lw) * 0.4 * Math.sign(y), rng.range(6, 14), rng.range(1.8, 3.4), rng.pick(inks), 0.72);
    }
    ctx.restore();
  };
  painted(1, '#c3e3a6', ['#b2d98f', '#d7efbf', '#a6e0c6', '#e3f1a6', '#8fc49b'], 170);
  painted(0.64, '#f2a3ae', ['#e98998', '#f7c0c6', '#f4b3cb', '#d9788d'], 80);
  brush.line([[-lw * 0.62, lh * 0.02], [-lw * 0.2, lh * 0.18], [0, lh * 0.08], [lw * 0.2, lh * 0.18], [lw * 0.62, lh * 0.02]], 2.6, '#c86b82', 0.9, 0.5);
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = '#94bd7f';
  ctx.lineWidth = 3.2;
  lips(1);
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;
}

/**
 * The face at the end of the tunnel: one eye and a pair of lips under a
 * pink swirl, on a soft painted ground that fades out at its edge.
 */
function paintFace(ctx: Ctx, u: number, rng: Rng): void {
  const brush = new Brush(ctx, rng);
  paintFaceGround(brush, u);
  paintSwirl(brush, u * 0.5, u * 0.34, u * 0.3, u * 0.085);
  paintEye(brush, u * 0.44, u * 0.545, u * 0.1, u * 0.046);
  paintLips(brush, u * 0.55, u * 0.74, u * 0.17, u * 0.066, -0.12);
}

// ---------------------------------------------------------------- atlas

/** Accent hues of the brushed bands (one set per kind) and the colour of their edge line. */
const BANDS: readonly { inks: readonly GemHue[]; edge: string }[] = [
  { inks: ['lilac', 'sky', 'pink'], edge: '#a498c4' },
  { inks: ['pink', 'peach', 'butter'], edge: '#b89ab4' },
  { inks: ['mint', 'sky', 'sage'], edge: '#98a9c4' },
  { inks: ['periwinkle', 'lilac', 'mint'], edge: '#9c96c8' },
  { inks: ['butter', 'sage', 'peach'], edge: '#b0a0b8' },
  { inks: ['sky', 'pink', 'mint'], edge: '#a2a0c6' },
];

/** Rib colours: mid-tone lavenders that show on dark rooms and on pale paper alike. */
const RIBS = ['#b3a6d6', '#c7a6c8', '#9fb4d6'];

/** A piece laid along a side of a frame's square. */
export interface SidePiece {
  frame: string;
  /** Painted length in texture pixels. */
  length: number;
  /** Where the edge line runs, from the top of the texture (0..1). */
  lineY: number;
  /** Width of the edge line in texture pixels. */
  lineWidth: number;
}

/**
 * The tunnel's art: one atlas texture with a frame per gem (hue × shape),
 * per side band and rib, and for the face. `GemArt.ensure(scene)` paints it
 * the first time it is needed; later calls return the same instance.
 */
export class GemArt {
  static readonly KEY = 'fx.gemart';
  static readonly SHAPES = SHAPES.length;
  static readonly BANDS = BANDS.length;
  static readonly RIBS = RIBS.length;
  private static instance: GemArt | null = null;

  /** Paints the atlas once per game (texture managers are per game). */
  static ensure(scene: Phaser.Scene): GemArt {
    const art = (GemArt.instance ??= new GemArt());
    if (!scene.textures.exists(GemArt.KEY)) art.paint(scene.textures);
    return art;
  }

  readonly face = 'face';
  readonly faceSize = FACE_SIZE;

  /** Gem frame for a hue and a shape. */
  gem(hue: GemHue, shape: number): string {
    return `g:${hue}:${shape % SHAPES.length}`;
  }

  /** Length of a gem shape's long axis in texture pixels. */
  gemLength(shape: number): number {
    return SHAPES[shape % SHAPES.length]!.a * 2;
  }

  /** A brushed band (full-screen tunnels) or a thin rib along a side. */
  side(kind: number, brushed: boolean): SidePiece {
    const cell = brushed ? BAND_CELL : RIB_CELL;
    const n = brushed ? BANDS.length : RIBS.length;
    return { frame: `${brushed ? 'b' : 'r'}:${kind % n}`, length: cell.w, lineY: cell.line / cell.h, lineWidth: EDGE_WIDTH };
  }

  private paint(textures: Phaser.Textures.TextureManager): void {
    const rng = new Rng(0x9e3779b9);
    const pieces: { name: string; c: HTMLCanvasElement; x: number; y: number }[] = [];
    // Gems in rows by shape on the left, the face beside them, bands and
    // ribs underneath; gaps keep mip-mapped neighbours apart.
    let y = 0;
    SHAPES.forEach((shape, si) => {
      const cell = gemCell(shape);
      GEM_HUES.forEach((hue, hi) => {
        const [c, gctx] = artCanvas(cell.w, cell.h);
        gctx.translate(cell.w / 2, cell.h / 2);
        const accent = GEM_SWATCHES[GEM_HUES[(hi + 3) % GEM_HUES.length]!].base;
        paintGem(gctx, shape, GEM_SWATCHES[hue], accent, rng);
        pieces.push({ name: this.gem(hue, si), c, x: hi * (GEM_COLUMN + GAP), y });
      });
      y += cell.h + GAP;
    });
    const [fc, fctx] = artCanvas(FACE_SIZE, FACE_SIZE);
    paintFace(fctx, FACE_SIZE, rng);
    pieces.push({ name: this.face, c: fc, x: GEM_HUES.length * (GEM_COLUMN + GAP), y: 0 });
    const bandY = Math.max(y, FACE_SIZE + GAP);
    BANDS.forEach(({ inks, edge }, i) => {
      const [c, bctx] = artCanvas(BAND_CELL.w, BAND_CELL.h);
      const tints = [...PAPER.slice(0, 3), '#ffffff', '#e4dcef', ...inks.map((h) => mix(GEM_SWATCHES[h].light, GEM_SWATCHES[h].base, 0.35))];
      paintBand(bctx, BAND_CELL.w, BAND_CELL.h, BAND_CELL.line, tints, inks.map((h) => GEM_SWATCHES[h].base), edge, rng);
      pieces.push({ name: this.side(i, true).frame, c, x: i * (BAND_CELL.w + GAP), y: bandY });
    });
    RIBS.forEach((color, i) => {
      const [c, rctx] = artCanvas(RIB_CELL.w, RIB_CELL.h);
      paintRib(rctx, RIB_CELL.w, RIB_CELL.h, RIB_CELL.line, color, rng);
      pieces.push({ name: this.side(i, false).frame, c, x: i * (RIB_CELL.w + GAP), y: bandY + BAND_CELL.h + GAP });
    });
    // A power of two, so WebGL mip-maps it.
    const bottom = Math.max(...pieces.map((p) => p.y + p.c.height));
    const [atlas, ctx] = artCanvas(ATLAS_W, 2 ** Math.ceil(Math.log2(bottom)));
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

/** The painted pastel hue nearest to a colour (greys become lilac). */
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
