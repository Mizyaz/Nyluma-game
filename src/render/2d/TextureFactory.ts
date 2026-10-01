import type * as Phaser from 'phaser';
import type { PartArt } from './rig/rigTypes';

// Rasterizes authored SVG artwork once at load time and packs it into
// power-of-two atlas pages (2048², mip-mapped in WebGL). Nothing is
// re-parsed per frame. Every opaque part gets the paintings' coloured-pencil
// grain inside its own alpha (see `applyGrain`).

// ------------------------------------------------------------------ grain

/** Side of the tileable grain canvas, in logical px (1 texel = 1 px). */
export const GRAIN_TILE = 256;

let grainTile: HTMLCanvasElement | null = null;

/**
 * The coloured-pencil texture of the paintings, painted once: short hatch
 * strokes in a few directions (mostly one diagonal, as a right hand colours
 * in), light ones where the paper shows through and darker ones where the
 * pencil pressed harder, with uneven coverage. Tileable in both directions.
 */
export function grainCanvas(): HTMLCanvasElement {
  if (grainTile) return grainTile;
  const S = GRAIN_TILE;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d')!;
  // Deterministic PRNG (mulberry32) so every boot paints the same paper.
  let seed = 0x5eed1e5 >>> 0;
  const rnd = (): number => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // Low-frequency coverage (integer periods over the tile keep it seamless).
  const cover = (x: number, y: number): number => {
    const u = (x / S) * Math.PI * 2;
    const v = (y / S) * Math.PI * 2;
    return 0.55 + 0.25 * Math.sin(2 * u + v + 1.3) + 0.2 * Math.sin(3 * v - u + 0.4) * Math.cos(u + 2 * v);
  };
  // Strokes are bucketed by tone, alpha and width so each bucket is one path.
  const LIGHT = '255,253,247';
  const DARK = '52,44,58';
  const buckets = new Map<string, Path2D>();
  const add = (tone: string, a: number, w: number, x0: number, y0: number, x1: number, y1: number): void => {
    const key = `${tone}|${a}|${w}`;
    let path = buckets.get(key);
    if (!path) buckets.set(key, (path = new Path2D()));
    // Wrap copies so the tile repeats without seams.
    for (const ox of [-S, 0, S]) {
      for (const oy of [-S, 0, S]) {
        const minX = Math.min(x0, x1) + ox;
        const maxX = Math.max(x0, x1) + ox;
        const minY = Math.min(y0, y1) + oy;
        const maxY = Math.max(y0, y1) + oy;
        if (maxX < -2 || minX > S + 2 || maxY < -2 || minY > S + 2) continue;
        path.moveTo(x0 + ox, y0 + oy);
        path.lineTo(x1 + ox, y1 + oy);
      }
    }
  };
  const strokes = 2600;
  for (let i = 0; i < strokes; i++) {
    const x = rnd() * S;
    const y = rnd() * S;
    const k = cover(x, y);
    if (rnd() > k) continue;
    // Direction: mostly the rising diagonal, some steeper cross-hatching.
    const r = rnd();
    const ang = r < 0.72 ? -0.62 + (rnd() - 0.5) * 0.35 : r < 0.92 ? -1.25 + (rnd() - 0.5) * 0.3 : 0.55 + (rnd() - 0.5) * 0.4;
    const len = 3 + rnd() * 9;
    const dx = Math.cos(ang) * len * 0.5;
    const dy = Math.sin(ang) * len * 0.5;
    const light = rnd() < 0.62;
    const a = light ? [0.06, 0.1, 0.15][Math.floor(rnd() * 3)]! : [0.04, 0.065, 0.1][Math.floor(rnd() * 3)]!;
    const w = rnd() < 0.7 ? 1 : 1.6;
    add(light ? LIGHT : DARK, a, w, x - dx, y - dy, x + dx, y + dy);
  }
  ctx.lineCap = 'round';
  for (const [key, path] of buckets) {
    const [tone, a, w] = key.split('|');
    ctx.strokeStyle = `rgba(${tone},${a})`;
    ctx.lineWidth = Number(w);
    ctx.stroke(path);
  }
  grainTile = c;
  return c;
}

export interface GrainOpts {
  /** Texels per logical px of the canvas being grained (raster scale). */
  scale?: number;
  /** 0..1 multiplier of the grain's opacity. */
  strength?: number;
}

/**
 * Lays the coloured-pencil grain over whatever is already painted in the
 * rect (x, y, w, h) of `ctx`, inside its alpha only ('source-atop'), so
 * shapes keep their edges and transparent areas stay transparent. The rect
 * and the pattern live in the context's current user space, so a canvas
 * drawn with a transform (terrain chunks, parallax layers) gets grain of the
 * same logical size, anchored to the same origin across pieces. Use it for
 * any canvas painted outside the atlas.
 */
export function applyGrain(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, o: GrainOpts = {}): void {
  const pat = grainPattern(ctx, o.scale ?? 1);
  if (!pat) return;
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.globalAlpha = o.strength ?? 1;
  ctx.fillStyle = pat;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function grainPattern(ctx: CanvasRenderingContext2D, scale: number): CanvasPattern | null {
  const pat = ctx.createPattern(grainCanvas(), 'repeat');
  if (pat && scale !== 1 && typeof DOMMatrix !== 'undefined') pat.setTransform(new DOMMatrix().scale(scale));
  return pat;
}

export interface FrameRef {
  atlas: string;
  frame: string;
  /** Logical size and pivot. */
  w: number;
  h: number;
  px: number;
  py: number;
  /** Raster scale: display the frame at 1/scale. */
  scale: number;
}

const registry = new Map<string, FrameRef>();

export function frameRef(key: string): FrameRef {
  const f = registry.get(key);
  if (!f) throw new Error(`Missing art frame: ${key}`);
  return f;
}

export function hasFrame(key: string): boolean {
  return registry.has(key);
}

export function allFrameKeys(): string[] {
  return [...registry.keys()];
}

export const ATLAS_SIZE = 2048;
const PAD = 3;

/**
 * SVG markup for a part rasterized `scale` texels per px: the canvas is the
 * next whole texel up and the view box grows with it, so the art is never
 * stretched (one texel is exactly 1/scale px of the part).
 */
export function svgMarkup(p: { w: number; h: number; body: string }, scale: number): string {
  const cw = Math.max(1, Math.ceil(p.w * scale - 1e-6));
  const ch = Math.max(1, Math.ceil(p.h * scale - 1e-6));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${cw / scale} ${ch / scale}">${p.body}</svg>`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('SVG rasterization failed'));
    img.src = src;
  });
}

/** False once a blob: image was refused (a host's content security policy). */
let blobImages = true;

/**
 * SVG string → decoded image. Some hosts' content security policies refuse
 * blob: images; data: URLs are used there instead.
 */
export function rasterizeSvg(svg: string): Promise<HTMLImageElement> {
  const asData = (): Promise<HTMLImageElement> => loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  if (!blobImages) return asData();
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  return loadImage(url)
    .catch(() => {
      blobImages = false;
      return asData();
    })
    .finally(() => URL.revokeObjectURL(url));
}

interface Placed {
  key: string;
  img: CanvasImageSource;
  x: number;
  y: number;
  w: number;
  h: number;
  darken: boolean;
  /** Raster scale when the part takes grain, else 0. */
  grain: number;
}

/** Whether a part takes the pencil grain: opaque parts yes, glows no. */
export function takesGrain(p: Pick<PartArt, 'grain' | 'additive'>): boolean {
  return p.grain ?? !p.additive;
}

/**
 * Packs parts into atlas pages with a simple shelf packer. Parts flagged
 * `far` get a second, darker frame '<key>.far' for the far side of a body.
 */
export async function buildAtlases(
  textures: Phaser.Textures.TextureManager,
  parts: readonly PartArt[],
  prefix: string,
  onProgress: (done: number, total: number) => void,
  /** Texels per px each part is rasterized at (default: its own `scale`, else 2). */
  rasterScale: (p: PartArt) => number = (p) => p.scale ?? 2,
): Promise<void> {
  const scaleOf = (p: PartArt): number => Math.min(rasterScale(p), (ATLAS_SIZE - PAD * 2) / p.w, (ATLAS_SIZE - PAD * 2) / p.h);
  const total = parts.length;
  let done = 0;
  const images = new Map<string, HTMLImageElement>();
  // Rasterize with bounded concurrency.
  const queue = [...parts];
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const p = queue.shift()!;
      const scale = scaleOf(p);
      try {
        images.set(p.key, await rasterizeSvg(svgMarkup(p, scale)));
      } catch {
        // Decorative failure must not block the game: an empty frame is used.
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.ceil(p.w * scale - 1e-6));
        c.height = Math.max(1, Math.ceil(p.h * scale - 1e-6));
        images.set(p.key, c as unknown as HTMLImageElement);
      }
      done++;
      onProgress(done, total);
    }
  });
  await Promise.all(workers);

  const items: { p: PartArt; key: string; w: number; h: number; darken: boolean }[] = [];
  for (const p of parts) {
    const scale = scaleOf(p);
    const w = Math.max(1, Math.ceil(p.w * scale - 1e-6));
    const h = Math.max(1, Math.ceil(p.h * scale - 1e-6));
    items.push({ p, key: p.key, w, h, darken: false });
    if (p.far) items.push({ p, key: p.key + '.far', w, h, darken: true });
  }
  items.sort((a, b) => b.h - a.h || b.w - a.w);

  const pages: Placed[][] = [[]];
  let cx = PAD;
  let cy = PAD;
  let shelfH = 0;
  for (const it of items) {
    if (it.w + PAD * 2 > ATLAS_SIZE || it.h + PAD * 2 > ATLAS_SIZE) throw new Error(`Part too large: ${it.key}`);
    if (cx + it.w + PAD > ATLAS_SIZE) {
      cx = PAD;
      cy += shelfH + PAD;
      shelfH = 0;
    }
    if (cy + it.h + PAD > ATLAS_SIZE) {
      pages.push([]);
      cx = PAD;
      cy = PAD;
      shelfH = 0;
    }
    const scale = scaleOf(it.p);
    pages[pages.length - 1]!.push({
      key: it.key,
      img: images.get(it.p.key)!,
      x: cx,
      y: cy,
      w: it.w,
      h: it.h,
      darken: it.darken,
      grain: takesGrain(it.p) ? scale : 0,
    });
    registry.set(it.key, {
      atlas: `${prefix}${pages.length - 1}`,
      frame: it.key,
      w: it.p.w,
      h: it.p.h,
      px: it.p.px,
      py: it.p.py,
      scale,
    });
    cx += it.w + PAD;
    shelfH = Math.max(shelfH, it.h);
  }

  pages.forEach((placed, i) => {
    const key = `${prefix}${i}`;
    if (textures.exists(key)) textures.remove(key);
    // Shrink the last page to the smallest power of two that fits.
    let size = ATLAS_SIZE;
    const maxY = Math.max(...placed.map((q) => q.y + q.h)) + PAD;
    while (size > 256 && maxY <= size / 2) size /= 2;
    const [canvas, ctx] = artCanvas(ATLAS_SIZE, size);
    for (const q of placed) {
      ctx.drawImage(q.img, q.x, q.y, q.w, q.h);
      if (q.darken) {
        ctx.save();
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'rgba(29, 27, 30, 0.2)';
        ctx.fillRect(q.x, q.y, q.w, q.h);
        ctx.restore();
      }
    }
    grainPage(ctx, placed);
    const tex = addStaticCanvas(textures, key, canvas);
    if (!tex) return;
    for (const q of placed) tex.add(q.key, 0, q.x, q.y, q.w, q.h);
  });
}

/**
 * Grain for a whole atlas page in one composite per raster scale: the rects
 * of the grained parts form one path, filled with the pattern 'source-atop'
 * (parts sit PAD apart, so each only picks up grain inside its own alpha).
 */
function grainPage(ctx: CanvasRenderingContext2D, placed: readonly Placed[]): void {
  const byScale = new Map<number, Path2D>();
  for (const q of placed) {
    if (!q.grain) continue;
    let path = byScale.get(q.grain);
    if (!path) byScale.set(q.grain, (path = new Path2D()));
    path.rect(q.x, q.y, q.w, q.h);
  }
  for (const [scale, path] of byScale) {
    const pat = grainPattern(ctx, scale);
    if (!pat) continue;
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = pat;
    ctx.fill(path);
    ctx.restore();
  }
}

/**
 * A canvas for painting artwork once. It is kept in main memory rather than
 * on the GPU: paths and SVG images are rasterized right away, instead of
 * being replayed on the GPU the first time the texture is drawn, which
 * stalled the first frames for seconds without hardware acceleration.
 */
export function artCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d', { willReadFrequently: true })!];
}

/**
 * Adds a finished canvas as a plain texture. `textures.addCanvas` would make
 * a CanvasTexture, which copies every pixel back with getImageData: a
 * synchronous read-back that took most of the loading time for the atlas
 * pages and room layers. These canvases never change after upload.
 */
export function addStaticCanvas(textures: Phaser.Textures.TextureManager, key: string, canvas: HTMLCanvasElement): Phaser.Textures.Texture | null {
  const tex = textures.create(key, canvas, canvas.width, canvas.height);
  tex?.add('__BASE', 0, 0, 0, canvas.width, canvas.height);
  return tex;
}

/** Registers a single standalone canvas as a texture frame (props, terrain). */
export function registerCanvas(
  textures: Phaser.Textures.TextureManager,
  key: string,
  canvas: HTMLCanvasElement,
  logical: { w: number; h: number; px: number; py: number },
  scale = 1,
): FrameRef {
  if (textures.exists(key)) textures.remove(key);
  addStaticCanvas(textures, key, canvas);
  const ref: FrameRef = { atlas: key, frame: '__BASE', ...logical, scale };
  registry.set(key, ref);
  return ref;
}

export function unregister(textures: Phaser.Textures.TextureManager, key: string): void {
  registry.delete(key);
  if (textures.exists(key)) textures.remove(key);
}
