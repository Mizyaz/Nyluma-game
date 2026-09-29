import type * as Phaser from 'phaser';
import type { PartArt } from './rigTypes';

// Rasterizes authored SVG artwork once at load time and packs it into
// power-of-two atlas pages (2048², mip-mapped in WebGL). Nothing is
// re-parsed per frame.

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

export function svgMarkup(p: { w: number; h: number; body: string }, scale: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(p.w * scale)}" height="${Math.ceil(p.h * scale)}" viewBox="0 0 ${p.w} ${p.h}">${p.body}</svg>`;
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
): Promise<void> {
  const total = parts.length;
  let done = 0;
  const images = new Map<string, HTMLImageElement>();
  // Rasterize with bounded concurrency.
  const queue = [...parts];
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const p = queue.shift()!;
      const scale = p.scale ?? 2;
      try {
        images.set(p.key, await rasterizeSvg(svgMarkup(p, scale)));
      } catch {
        // Decorative failure must not block the game: an empty frame is used.
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.ceil(p.w * scale));
        c.height = Math.max(1, Math.ceil(p.h * scale));
        images.set(p.key, c as unknown as HTMLImageElement);
      }
      done++;
      onProgress(done, total);
    }
  });
  await Promise.all(workers);

  const items: { p: PartArt; key: string; w: number; h: number; darken: boolean }[] = [];
  for (const p of parts) {
    const scale = p.scale ?? 2;
    const w = Math.ceil(p.w * scale);
    const h = Math.ceil(p.h * scale);
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
    pages[pages.length - 1]!.push({ key: it.key, img: images.get(it.p.key)!, x: cx, y: cy, w: it.w, h: it.h, darken: it.darken });
    const scale = it.p.scale ?? 2;
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
        ctx.fillStyle = 'rgba(25, 23, 40, 0.34)';
        ctx.fillRect(q.x, q.y, q.w, q.h);
        ctx.restore();
      }
    }
    const tex = addStaticCanvas(textures, key, canvas);
    if (!tex) return;
    for (const q of placed) tex.add(q.key, 0, q.x, q.y, q.w, q.h);
  });
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
