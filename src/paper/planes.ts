import * as Phaser from 'phaser';
import type { Lens } from './lens';

// One Phaser camera per depth. A camera looking at the plane z with zoom
// lens.scale(z) draws everything standing in that plane exactly where the
// eye sees it, at its own world coordinates. So the game keeps its world
// (physics, scripts and effects see the same x and y as ever) and the
// picture gets true perspective. Cameras draw far to near, so a nearer
// plane always covers a farther one; inside a plane, depth orders as usual.
//
// Every camera snaps each quad to whole device pixels. With art printed at
// the plane's own scale (press.ts), one texel lands on one pixel.

/** A camera that keeps quads on whole device pixels at any zoom. */
export class PlaneCamera extends Phaser.Cameras.Scene2D.Camera {
  /** The depth it looks at (world px; 0 = the actors' plane). */
  z = 0;
  /** Fixed to the screen: 1280 × 720 game units covering the picture. */
  screen = false;

  override preRender(): void {
    super.preRender();
    // Phaser only snaps at whole-number zooms; quads are snapped by their
    // top-left corner, so a printed card keeps its exact size.
    (this as { renderRoundPixels: boolean }).renderRoundPixels = true;
  }
}

/** The virtual screen that overlays are made for. */
export const SCREEN_W = 1280;
export const SCREEN_H = 720;

type GO = Phaser.GameObjects.GameObject & Partial<Phaser.GameObjects.Components.ScrollFactor>;

/** Planes are kept a whole world px apart. */
const key = (z: number): number => Math.round(z);

export class Planes {
  private readonly scene: Phaser.Scene;
  private readonly lens: Lens;
  private readonly byZ = new Map<number, PlaneCamera>();
  /** Where each placed object stands. */
  private readonly placed = new WeakMap<object, PlaneCamera>();
  /** Fixed to the screen (overlays). */
  readonly screen: PlaneCamera;
  /** The actors' plane (the scene's main camera). */
  readonly main: PlaneCamera;
  private dirty = true;

  constructor(scene: Phaser.Scene, lens: Lens) {
    this.scene = scene;
    this.lens = lens;
    const cams = scene.cameras;
    const { width, height } = scene.scale;
    cams.remove(cams.main, true);
    // See-through like every plane: the box's inside is drawn first, under all.
    this.main = new PlaneCamera(0, 0, width, height);
    this.main.z = 0;
    this.main.transparent = true;
    this.main.setScene(scene);
    cams.addExisting(this.main, true);
    this.byZ.set(0, this.main);
    this.screen = this.make(Number.POSITIVE_INFINITY);
    this.screen.screen = true;
  }

  /** The camera for the plane at depth z (made on first use). */
  at(z: number): PlaneCamera {
    const k = key(z);
    return this.byZ.get(k) ?? this.make(k);
  }

  /** A camera of its own, drawn in depth order with the planes (the box's shaders use these). */
  private make(z: number): PlaneCamera {
    const { width, height } = this.scene.scale;
    const cam = new PlaneCamera(0, 0, width, height);
    cam.z = z;
    cam.transparent = true;
    cam.setScene(this.scene);
    const added = this.scene.cameras.addExisting(cam, false);
    if (!added || !cam.id) throw new Error('paper: out of cameras (31 planes at most)');
    if (Number.isFinite(z)) this.byZ.set(z, cam);
    this.sortCameras();
    this.dirty = true;
    return cam;
  }

  /** A camera drawn between the planes at an exact depth, outside the plane table. */
  layer(z: number): PlaneCamera {
    const { width, height } = this.scene.scale;
    const cam = new PlaneCamera(0, 0, width, height);
    cam.z = z;
    cam.screen = true;
    cam.transparent = true;
    cam.setScene(this.scene);
    const added = this.scene.cameras.addExisting(cam, false);
    if (!added || !cam.id) throw new Error('paper: out of cameras (31 planes at most)');
    this.sortCameras();
    this.dirty = true;
    return cam;
  }

  private sortCameras(): void {
    this.scene.cameras.cameras.sort((a, b) => (a as PlaneCamera).z - (b as PlaneCamera).z);
  }

  /** Stands an object in the plane at depth z. */
  put<T extends GO>(obj: T, z: number): T {
    this.placeOn(obj, this.at(z));
    return obj;
  }

  /** Puts an object on a given camera (the screen, a layer). */
  placeOn<T extends GO>(obj: T, cam: PlaneCamera): T {
    this.placed.set(obj, cam);
    // On the screen camera the scroll never changes: a "fixed" object is
    // simply drawn at its game-units place.
    if (cam.screen && obj.setScrollFactor) obj.setScrollFactor(1);
    obj.cameraFilter = this.mask() & ~cam.id;
    return obj;
  }

  /** The depth an object was placed at (0 when it never was). */
  zOf(obj: object): number {
    const cam = this.placed.get(obj);
    return cam && Number.isFinite(cam.z) && !cam.screen ? cam.z : 0;
  }

  /** Every camera's bit. */
  private mask(): number {
    let m = 0;
    for (const c of this.scene.cameras.cameras) m |= c.id;
    return m;
  }

  /**
   * Before each frame: the cameras follow the lens, and anything new in the
   * scene takes its place (overlays fixed to the screen go on the screen,
   * everything else stands in the actors' plane).
   */
  update(): void {
    const lens = this.lens;
    const { width: W, height: H } = this.scene.scale;
    // Cover the picture with the 1280 × 720 game screen, centred.
    const cover = Math.max(W / SCREEN_W, H / SCREEN_H);
    for (const c of this.scene.cameras.cameras) {
      const cam = c as PlaneCamera;
      if (cam.width !== W || cam.height !== H) cam.setSize(W, H);
      if (cam.screen) {
        if (cam === this.screen || !Number.isFinite(cam.z)) {
          cam.setZoom(cover);
          cam.setScroll(SCREEN_W / 2 - W / 2, SCREEN_H / 2 - H / 2);
        } else {
          cam.setZoom(1);
          cam.setScroll(0, 0);
        }
        continue;
      }
      const s = lens.scale(cam.z);
      cam.setZoom(s);
      cam.setScroll(lens.eye.x - W / 2 - (lens.cx - W / 2) / s, lens.eye.y - H / 2 - (lens.cy - H / 2) / s);
    }
    const all = this.mask();
    const list = this.scene.children.list as GO[];
    if (this.dirty) {
      this.dirty = false;
      for (const o of list) {
        const cam = this.placed.get(o);
        if (cam) o.cameraFilter = all & ~cam.id;
      }
    }
    for (const o of list) {
      if (this.placed.has(o)) continue;
      const fixed = o.scrollFactorX === 0 && o.scrollFactorY === 0;
      this.placeOn(o, fixed ? this.screen : this.main);
    }
  }
}
