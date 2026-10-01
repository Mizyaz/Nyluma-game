import * as Phaser from 'phaser';
import type { PartArt } from '../render/2d/rig/rigTypes';
import { addStaticCanvas, applyGrain, artCanvas, rasterizeSvg, takesGrain } from '../render/2d/TextureFactory';

// The press prints a 2D model at exactly the size it shows on screen: a card
// standing at depth z is printed at lens.scale(z) device px per world px, so
// one texel of the print lands on one pixel of the screen. The model's SVG is
// rasterized by the browser at that size (no resampling ever), then gets the
// paintings' coloured-pencil grain at the same scale.
//
// The actors' plane is printed once, at boot, into the shared atlases
// (`actorScale`); the press makes the prints for everything standing at
// other depths, per room.

/** World px seen top to bottom at the actors' plane, on a full landscape screen. */
export const SPAN = 480;

/**
 * Device px per world px at the actors' plane: fixed per device (its full
 * landscape height over SPAN), so prints stay exact when the window changes
 * size; a smaller window simply shows less of the room.
 */
export function actorScale(): number {
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  const forced = Number(new URLSearchParams(location.search).get('dpr'));
  const r = forced > 0 ? Math.min(4, forced) : dpr;
  const full = Math.min(window.screen.width || 1280, window.screen.height || 720) * r;
  return Math.min(3, Math.max(1, full / SPAN));
}

/** Largest texture side a print may have. */
const MAX_SIDE = 4096;

export interface Print {
  /** Phaser texture key (frame '__BASE'). */
  texture: string;
  /** The print's logical size (world px, a hair over the part's own) and pivot. */
  w: number;
  h: number;
  px: number;
  py: number;
  /** Texels per world px. */
  scale: number;
}

const printKey = (key: string, scale: number): string => `paper:${key}@${scale.toFixed(6)}`;

/** The scale a part prints at, under the side limit. */
export function fitScale(p: { w: number; h: number }, scale: number, max = MAX_SIDE): number {
  return Math.min(scale, (max - 2) / p.w, (max - 2) / p.h);
}

/**
 * SVG markup for a part at an exact scale: the canvas is the next whole
 * pixel up, and the view box grows with it, so the art is never stretched.
 */
export function exactMarkup(p: Pick<PartArt, 'w' | 'h' | 'body'>, scale: number): { svg: string; cw: number; ch: number } {
  const cw = Math.max(1, Math.ceil(p.w * scale - 1e-6));
  const ch = Math.max(1, Math.ceil(p.h * scale - 1e-6));
  const vw = cw / scale;
  const vh = ch / scale;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${vw} ${vh}">${p.body}</svg>`;
  return { svg, cw, ch };
}

export class Press {
  private readonly made = new Map<string, Print>();
  private readonly pending = new Map<string, Promise<Print | null>>();

  constructor(
    private readonly textures: Phaser.Textures.TextureManager,
    private readonly part: (key: string) => PartArt | undefined,
  ) {}

  /** The print of `key` at `scale`, if it has been made. */
  get(key: string, scale: number): Print | null {
    return this.made.get(printKey(key, scale)) ?? null;
  }

  /** Prints every job (with up to 6 at a time); resolves once all are done. */
  async print(jobs: readonly { key: string; scale: number }[]): Promise<void> {
    const queue = [...jobs];
    const work = async (): Promise<void> => {
      for (let j = queue.shift(); j; j = queue.shift()) await this.one(j.key, j.scale);
    };
    await Promise.all(Array.from({ length: 6 }, work));
  }

  /** Prints one part (a `.far` key prints its part darkened, as the atlases do). */
  one(key: string, scale: number): Promise<Print | null> {
    const k = printKey(key, scale);
    const done = this.made.get(k);
    if (done) return Promise.resolve(done);
    let job = this.pending.get(k);
    if (job) return job;
    job = this.make(key, scale, k).finally(() => this.pending.delete(k));
    this.pending.set(k, job);
    return job;
  }

  private async make(key: string, scale: number, k: string): Promise<Print | null> {
    const far = key.endsWith('.far');
    const p = this.part(far ? key.slice(0, -4) : key);
    if (!p) return null;
    const s = fitScale(p, scale);
    const { svg, cw, ch } = exactMarkup(p, s);
    let img: CanvasImageSource;
    try {
      img = await rasterizeSvg(svg);
    } catch {
      return null;
    }
    const [canvas, ctx] = artCanvas(cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);
    if (far) {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = 'rgba(29, 27, 30, 0.2)';
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (takesGrain(p)) applyGrain(ctx, 0, 0, cw, ch, { scale: s });
    if (this.textures.exists(k)) this.textures.remove(k);
    if (!addStaticCanvas(this.textures, k, canvas)) return null;
    const print: Print = { texture: k, w: cw / s, h: ch / s, px: p.px, py: p.py, scale: s };
    this.made.set(k, print);
    return print;
  }

  /**
   * Shows an image with the print of `key` at `scale`, keeping the world
   * size the image had (`worldScale` world px per logical px of the part).
   */
  dress(img: Phaser.GameObjects.Image, key: string, scale: number, worldScale = 1): boolean {
    const p = this.get(key, scale);
    if (!p) return false;
    const ox = img.originX;
    const oy = img.originY;
    const part = this.part(key.endsWith('.far') ? key.slice(0, -4) : key);
    img.setTexture(p.texture);
    // The print is a hair bigger than the part: keep the same point as the origin.
    if (part) img.setOrigin((ox * part.w) / p.w, (oy * part.h) / p.h);
    const k = worldScale / p.scale;
    img.setScale(k * Math.sign(img.scaleX || 1), k * Math.sign(img.scaleY || 1));
    // Shown one texel to one pixel (the camera's zoom undoes the print's
    // scale), its corners go to whole pixels; zoomed or turned, they don't.
    img.willRoundVertices = (camera: Phaser.Cameras.Scene2D.Camera): boolean =>
      camera.roundPixels && img.rotation === 0 && Math.abs(camera.zoom * Math.abs(img.scaleX) - 1) < 1e-6 && Math.abs(camera.zoom * Math.abs(img.scaleY) - 1) < 1e-6;
    return true;
  }

  /** Frees every print. */
  destroy(): void {
    for (const k of this.made.keys()) if (this.textures.exists(k)) this.textures.remove(k);
    this.made.clear();
  }
}

/**
 * Holds a scene's loader until `job` is done, so the scene is created with
 * its prints ready (used from a scene's preload).
 */
export function waitFor(load: Phaser.Loader.LoaderPlugin, key: string, job: Promise<unknown>): void {
  load.addFile(new WaitFile(load, key, job));
}

class WaitFile extends Phaser.Loader.File {
  constructor(
    loader: Phaser.Loader.LoaderPlugin,
    key: string,
    private readonly job: Promise<unknown>,
  ) {
    super(loader, { type: 'paperWait', cache: false, key, url: `paper-wait:${key}` });
  }

  override load(): void {
    const done = (ok: boolean): void => this.loader.nextFile(this, ok);
    this.job.then(
      () => done(true),
      () => done(true),
    );
  }

  override onProcess(): void {
    this.onProcessComplete();
  }

  override addToCache(): void {}
}
