// The loading theatre's big still pictures, painted on canvases rather than
// left to the page as SVG. Where a browser draws pages with a software GPU
// (machines without a graphics card, some virtual ones), vector art drawn
// through it costs several times what a software canvas costs, and the
// theatre paints while the game draws its own pictures on the same
// processors. So LoadingView has these pictures painted here, in a worker,
// and shows them as bitmaps; it keeps the SVG for any it cannot get.
//
// This reads the small part of SVG the theatre is drawn in (loadingStage.ts):
// paths, ellipses, circles and rectangles; fills and strokes with their
// opacities and line styles; groups with transforms and clip paths; linear
// and radial gradients; opacity, which an element with both a fill and a
// stroke takes as a whole, as SVG does.

type Ctx = OffscreenCanvasRenderingContext2D;
type Box = readonly [number, number, number, number];

/** An element of a picture. */
interface El {
  name: string;
  at: Record<string, string>;
  kids: El[];
}

/** What an element hands down to its children. */
interface Look {
  fill: string;
  fillOpacity: number;
  fillRule: CanvasFillRule;
  stroke: string;
  strokeOpacity: number;
  width: number;
  cap: CanvasLineCap;
  join: CanvasLineJoin;
  miter: number;
}

const START: Look = { fill: '#000', fillOpacity: 1, fillRule: 'nonzero', stroke: 'none', strokeOpacity: 1, width: 1, cap: 'butt', join: 'miter', miter: 4 };

/** Elements that are referred to, never drawn where they stand. */
const UNDRAWN = new Set(['clipPath', 'linearGradient', 'radialGradient', 'stop', 'defs', 'title', 'desc']);

const TAG = /<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g;
const ATTR = /([\w:-]+)\s*=\s*"([^"]*)"/g;
const ENTITY = /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi;
const NAMED: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

const unescape = (_: string, e: string): string => (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : NAMED[e.toLowerCase()]!);

/** The elements of a picture's markup: its root (the first), and those with an id. */
function parse(markup: string): [El | undefined, Map<string, El>] {
  const top: El = { name: '', at: {}, kids: [] };
  const ids = new Map<string, El>();
  const open = [top];
  for (const [, end, name, attrs, self] of markup.matchAll(TAG)) {
    if (end) {
      if (open.length > 1) open.pop();
      continue;
    }
    const el: El = { name: name!, at: {}, kids: [] };
    for (const [, k, v] of attrs!.matchAll(ATTR)) el.at[k!] = v!.includes('&') ? v!.replace(ENTITY, unescape) : v!;
    if (el.at.id) ids.set(el.at.id, el);
    open[open.length - 1]!.kids.push(el);
    if (!self) open.push(el);
  }
  return [top.kids[0], ids];
}

/** An element's attributes with its style declarations over them. */
function props(el: El): Record<string, string> {
  const style = el.at.style;
  if (!style) return el.at;
  const p = { ...el.at };
  for (const decl of style.split(';')) {
    const i = decl.indexOf(':');
    if (i > 0) p[decl.slice(0, i).trim()] = decl.slice(i + 1).trim();
  }
  return p;
}

function inherit(up: Look, p: Record<string, string>): Look {
  const l = { ...up };
  if (p.fill !== undefined) l.fill = p.fill;
  if (p.stroke !== undefined) l.stroke = p.stroke;
  if (p['fill-opacity'] !== undefined) l.fillOpacity = num(p['fill-opacity'], 1);
  if (p['stroke-opacity'] !== undefined) l.strokeOpacity = num(p['stroke-opacity'], 1);
  if (p['fill-rule'] !== undefined) l.fillRule = p['fill-rule'] === 'evenodd' ? 'evenodd' : 'nonzero';
  if (p['stroke-width'] !== undefined) l.width = num(p['stroke-width'], 1);
  if (p['stroke-linecap'] !== undefined) l.cap = p['stroke-linecap'] as CanvasLineCap;
  if (p['stroke-linejoin'] !== undefined) l.join = (p['stroke-linejoin'] === 'round' || p['stroke-linejoin'] === 'bevel' ? p['stroke-linejoin'] : 'miter') as CanvasLineJoin;
  if (p['stroke-miterlimit'] !== undefined) l.miter = num(p['stroke-miterlimit'], 4);
  return l;
}

/** A number, or a fraction for a percentage. */
function num(v: string | undefined, or = 0): number {
  if (v === undefined) return or;
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return or;
  return v.trim().endsWith('%') ? n / 100 : n;
}

function matrixOf(t: string): DOMMatrix {
  let m = new DOMMatrix();
  for (const [, fn, args] of t.matchAll(/([a-zA-Z]+)\s*\(([^)]*)\)/g)) {
    const [a = 0, b, c] = args!.trim().split(/[\s,]+/).map(Number);
    if (fn === 'translate') m = m.translate(a, b ?? 0);
    else if (fn === 'scale') m = m.scale(a, b ?? a);
    else if (fn === 'rotate') m = b === undefined ? m.rotate(a) : m.translate(b, c ?? 0).rotate(a).translate(-b, -(c ?? 0));
    else if (fn === 'skewX') m = m.skewX(a);
    else if (fn === 'skewY') m = m.skewY(a);
    else if (fn === 'matrix') m = m.multiply(new DOMMatrix(args!.trim().split(/[\s,]+/).map(Number)));
  }
  return m;
}

/** The id an attribute such as `url(#id)` points at. */
const refOf = (v: string | undefined): string | null => (v && /^url\(\s*#([^)\s]+)\s*\)$/.exec(v)?.[1]) || null;

function shapeOf(el: El, p: Record<string, string>): Path2D | null {
  if (el.name === 'path') return p.d ? new Path2D(p.d) : null;
  if (el.name === 'ellipse' || el.name === 'circle') {
    const rx = num(el.name === 'circle' ? p.r : p.rx);
    const ry = num(el.name === 'circle' ? p.r : p.ry);
    if (!(rx > 0 && ry > 0)) return null;
    const s = new Path2D();
    s.ellipse(num(p.cx), num(p.cy), rx, ry, 0, 0, Math.PI * 2);
    return s;
  }
  if (el.name === 'rect') {
    const w = num(p.width);
    const h = num(p.height);
    if (!(w > 0 && h > 0)) return null;
    const s = new Path2D();
    s.rect(num(p.x), num(p.y), w, h);
    return s;
  }
  return null;
}

const ARITY: Record<string, number> = { m: 2, l: 2, t: 2, h: 1, v: 1, c: 6, s: 4, q: 4, a: 7, z: 0 };

/**
 * The box of a path's points, its curves' control points included: exact
 * for the straight-sided shapes the theatre shades with box-sized gradients.
 */
function pathBox(d: string): Box {
  const tok = d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) ?? [];
  let [x, y, sx, sy, x0, y0, x1, y1] = [0, 0, 0, 0, Infinity, Infinity, -Infinity, -Infinity];
  const add = (px: number, py: number): void => {
    x0 = Math.min(x0, px);
    y0 = Math.min(y0, py);
    x1 = Math.max(x1, px);
    y1 = Math.max(y1, py);
  };
  let cmd = '';
  for (let i = 0; i < tok.length; ) {
    if (/[a-zA-Z]/.test(tok[i]!)) cmd = tok[i++]!;
    const c = cmd.toLowerCase();
    const n = ARITY[c];
    if (n === undefined) break;
    if (n === 0) {
      [x, y] = [sx, sy];
      if (i < tok.length && !/[a-zA-Z]/.test(tok[i]!)) break;
      continue;
    }
    const v = tok.slice(i, i + n).map(Number);
    if (v.length < n) break;
    i += n;
    const rel = cmd !== cmd.toUpperCase();
    const ox = rel ? x : 0;
    const oy = rel ? y : 0;
    if (c === 'h') x = ox + v[0]!;
    else if (c === 'v') y = oy + v[0]!;
    else {
      for (let k = c === 'a' ? 5 : 0; k < n; k += 2) add(ox + v[k]!, oy + v[k + 1]!);
      [x, y] = [ox + v[n - 2]!, oy + v[n - 1]!];
    }
    add(x, y);
    if (c === 'm') {
      [sx, sy] = [x, y];
      cmd = rel ? 'l' : 'L';
    }
  }
  return x1 >= x0 ? [x0, y0, x1 - x0, y1 - y0] : [0, 0, 0, 0];
}

function boxOf(el: El, p: Record<string, string>): Box {
  if (el.name === 'path') return pathBox(p.d ?? '');
  if (el.name === 'rect') return [num(p.x), num(p.y), num(p.width), num(p.height)];
  const rx = num(el.name === 'circle' ? p.r : p.rx);
  const ry = num(el.name === 'circle' ? p.r : p.ry);
  return [num(p.cx) - rx, num(p.cy) - ry, rx * 2, ry * 2];
}

/** A colour with an opacity put to it (the canvas reads any CSS colour). */
function tint(ctx: Ctx, color: string, a: number): string {
  if (a >= 1) return color;
  ctx.fillStyle = '#000';
  ctx.fillStyle = color;
  const c = String(ctx.fillStyle);
  if (c[0] === '#') {
    const n = parseInt(c.slice(1, 7), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  }
  const [r = 0, g = 0, b = 0, o = 1] = (c.match(/[\d.]+/g) ?? []).map(Number);
  return `rgba(${r},${g},${b},${o * a})`;
}

/**
 * Fills or strokes a shape with a gradient. A box-sized gradient is drawn
 * in its box's own units (the shape brought there), so it stretches with the
 * box as SVG's does.
 */
function withGradient(ctx: Ctx, grad: El, shape: Path2D, box: Box, rule: CanvasFillRule | null): void {
  const p = props(grad);
  let m = p.gradientUnits === 'userSpaceOnUse' ? new DOMMatrix() : new DOMMatrix([box[2] || 1, 0, 0, box[3] || 1, box[0], box[1]]);
  if (p.gradientTransform) m = m.multiply(matrixOf(p.gradientTransform));
  const at = (k: string, or: string): number => num(p[k] ?? or);
  const g =
    grad.name === 'linearGradient'
      ? ctx.createLinearGradient(at('x1', '0'), at('y1', '0'), at('x2', '100%'), at('y2', '0'))
      : ctx.createRadialGradient(at('fx', p.cx ?? '50%'), at('fy', p.cy ?? '50%'), at('fr', '0'), at('cx', '50%'), at('cy', '50%'), Math.max(0, at('r', '50%')));
  let last = 0;
  for (const s of grad.kids) {
    if (s.name !== 'stop') continue;
    const sp = props(s);
    last = Math.max(last, Math.min(1, Math.max(0, num(sp.offset))));
    g.addColorStop(last, tint(ctx, sp['stop-color'] ?? '#000', num(sp['stop-opacity'], 1)));
  }
  ctx.save();
  ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
  const local = new Path2D();
  local.addPath(shape, m.inverse());
  if (rule) {
    ctx.fillStyle = g;
    ctx.fill(local, rule);
  } else {
    ctx.strokeStyle = g;
    ctx.stroke(local);
  }
  ctx.restore();
}

/** Fills and strokes a shape. */
function paintShape(ctx: Ctx, el: El, p: Record<string, string>, look: Look, ids: Map<string, El>): void {
  const shape = shapeOf(el, p);
  if (!shape) return;
  const alpha = ctx.globalAlpha;
  for (const stroke of [false, true]) {
    const paint = stroke ? look.stroke : look.fill;
    if (paint === 'none' || paint === 'transparent' || (stroke && !(look.width > 0))) continue;
    ctx.globalAlpha = alpha * (stroke ? look.strokeOpacity : look.fillOpacity);
    if (stroke) {
      ctx.lineWidth = look.width;
      ctx.lineCap = look.cap;
      ctx.lineJoin = look.join;
      ctx.miterLimit = look.miter;
    }
    const ref = refOf(paint);
    const grad = ref ? ids.get(ref) : undefined;
    if (ref) {
      if (grad?.name === 'linearGradient' || grad?.name === 'radialGradient') withGradient(ctx, grad, shape, boxOf(el, p), stroke ? null : look.fillRule);
    } else if (stroke) {
      ctx.strokeStyle = paint;
      ctx.stroke(shape);
    } else {
      ctx.fillStyle = paint;
      ctx.fill(shape, look.fillRule);
    }
  }
  ctx.globalAlpha = alpha;
}

/** The region a clipPath keeps: its shapes together. */
function clipOf(c: El): [Path2D, CanvasFillRule] {
  const all = new Path2D();
  let rule: CanvasFillRule = 'nonzero';
  for (const k of c.kids) {
    const p = props(k);
    const s = shapeOf(k, p);
    if (!s) continue;
    if (p['clip-rule'] === 'evenodd') rule = 'evenodd';
    all.addPath(s, p.transform ? matrixOf(p.transform) : undefined);
  }
  return [all, rule];
}

/** Whether an element drawn with an opacity needs a layer: parts of it may overlap. */
function overlaps(el: El, look: Look): boolean {
  if (el.name === 'g') return el.kids.filter((k) => !UNDRAWN.has(k.name)).length > 1;
  return look.fill !== 'none' && look.stroke !== 'none' && look.width > 0;
}

function draw(ctx: Ctx, el: El, up: Look, ids: Map<string, El>): void {
  if (UNDRAWN.has(el.name)) return;
  const p = props(el);
  if (p.display === 'none' || p.visibility === 'hidden') return;
  const look = inherit(up, p);
  const opacity = num(p.opacity, 1);
  if (!(opacity > 0)) return;
  ctx.save();
  if (p.transform) {
    const m = matrixOf(p.transform);
    ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
  }
  const clip = refOf(p['clip-path']);
  const cp = clip ? ids.get(clip) : undefined;
  if (cp) ctx.clip(...clipOf(cp));
  const body = (c: Ctx): void => {
    if (el.name === 'g' || el.name === 'svg') for (const k of el.kids) draw(c, k, look, ids);
    else paintShape(c, el, p, look, ids);
  };
  if (opacity < 1 && overlaps(el, look)) {
    // Drawn whole on a layer of its own, then laid on with its opacity.
    const layer = new OffscreenCanvas(ctx.canvas.width, ctx.canvas.height);
    const lc = layer.getContext('2d', { willReadFrequently: true });
    if (lc) {
      lc.setTransform(ctx.getTransform());
      body(lc);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha *= opacity;
      ctx.drawImage(layer, 0, 0);
    }
  } else {
    ctx.globalAlpha *= opacity;
    body(ctx);
  }
  ctx.restore();
}

/** The largest side of a painted picture, px. */
const MAX_SIDE = 4096;

/**
 * Paints a picture (an `<svg>` with a viewBox) at `scale` px per unit on a
 * software canvas; null when it cannot.
 */
export function paintPicture(markup: string, scale: number): ImageBitmap | null {
  const [root, ids] = parse(markup);
  if (root?.name !== 'svg') return null;
  const [vx = 0, vy = 0, vw = 0, vh = 0] = (root.at.viewBox ?? '').trim().split(/[\s,]+/).map(Number);
  if (!(vw > 0 && vh > 0 && scale > 0)) return null;
  const k = Math.min(scale, MAX_SIDE / vw, MAX_SIDE / vh);
  const w = Math.max(1, Math.round(vw * k));
  const h = Math.max(1, Math.round(vh * k));
  const canvas = new OffscreenCanvas(w, h);
  // Read back often: so it stays a software canvas, painted right here.
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.setTransform(w / vw, 0, 0, h / vh, (-vx * w) / vw, (-vy * h) / vh);
  const look = inherit(START, props(root));
  for (const kid of root.kids) draw(ctx, kid, look, ids);
  return canvas.transferToImageBitmap();
}

