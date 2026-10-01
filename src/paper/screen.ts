import * as Phaser from 'phaser';

// The picture is drawn at the screen's own pixels. The canvas fills its box
// (#game: the whole window, or the band above the controls in portrait) and
// has one pixel for every device pixel, so the browser never stretches it.
// Phaser's game size is therefore in device pixels; scenes made for the old
// 1280 × 720 screen fit themselves into it with `fitScene`.

/** More device pixels than this per CSS pixel buy nothing visible. */
const MAX_DPR = 3;

/** The device pixel ratio the canvas is drawn at (`?dpr=` overrides it). */
export function pixelRatio(): number {
  const forced = Number(new URLSearchParams(location.search).get('dpr'));
  if (forced > 0) return Math.min(4, forced);
  return Math.min(MAX_DPR, window.devicePixelRatio || 1);
}

/** The canvas size, device px, for a box of CSS size w × h. */
export function deviceSize(w: number, h: number, dpr = pixelRatio()): { w: number; h: number; dpr: number } {
  return { w: Math.max(2, Math.round(w * dpr)), h: Math.max(2, Math.round(h * dpr)), dpr };
}

/** Keeps the game canvas on its box at device resolution. */
export class Screen {
  private key = '';

  constructor(
    private readonly game: Phaser.Game,
    private readonly box: HTMLElement,
  ) {
    const fit = (): void => this.fit();
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    document.addEventListener('fullscreenchange', fit);
    new ResizeObserver(fit).observe(box);
    if (game.isBooted) fit();
    else game.events.once(Phaser.Core.Events.READY, fit);
  }

  fit(): void {
    const r = this.box.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return;
    const { w, h, dpr } = deviceSize(r.width, r.height);
    const key = `${w}x${h}@${dpr}`;
    if (key === this.key) return;
    this.key = key;
    const scale = this.game.scale;
    scale.zoom = 1 / dpr;
    scale.resize(w, h);
    // Exactly the box's CSS size (the scale manager rounds it down).
    const style = this.game.canvas.style;
    style.width = `${r.width}px`;
    style.height = `${r.height}px`;
    // Pointer positions map through the canvas's real bounds.
    scale.updateBounds();
  }
}

/** The old 1280 × 720 screen that the flat scenes are laid out on. */
export const GAME_W = 1280;
export const GAME_H = 720;

export type Fit = 'cover' | 'contain' | 'height';

/**
 * Shows a flat scene's 1280 × 720 layout on the device-pixel canvas, centred:
 * `cover` fills the canvas (cropping), `contain` shows all of it, `height`
 * fills the height and shows more at the sides on wide screens. Follows
 * every resize. Returns the visible game-unit rectangle getter.
 */
export function fitScene(scene: Phaser.Scene, mode: Fit): () => Phaser.Geom.Rectangle {
  const cam = scene.cameras.main;
  const view = new Phaser.Geom.Rectangle(0, 0, GAME_W, GAME_H);
  const apply = (): void => {
    const { width: W, height: H } = scene.scale;
    const zx = W / GAME_W;
    const zy = H / GAME_H;
    const z = mode === 'cover' ? Math.max(zx, zy) : mode === 'contain' ? Math.min(zx, zy) : zy;
    cam.setSize(W, H);
    cam.setZoom(z);
    cam.centerOn(GAME_W / 2, GAME_H / 2);
    view.setTo(GAME_W / 2 - W / z / 2, GAME_H / 2 - H / z / 2, W / z, H / z);
  };
  apply();
  scene.scale.on(Phaser.Scale.Events.RESIZE, apply);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.scale.off(Phaser.Scale.Events.RESIZE, apply));
  return () => view;
}
