import * as Phaser from 'phaser';
import type { Lens } from './lens';

// One Phaser camera per depth. A camera looking at the plane z with zoom
// lens.scale(z) draws everything standing in that plane exactly where the
// eye sees it, at its own world coordinates. So the game keeps its world
// (physics, scripts and effects see the same x and y as ever) and the
// picture gets true perspective. Cameras draw far to near, so a nearer
// plane always covers a farther one; inside a plane, depth orders as usual.
//
// Every camera rounds to whole device pixels the quads that land on the
// screen at their own size: with art printed at the plane's own scale
// (press.ts), one texel lands on one pixel.

/** A camera looking at one depth. */
export class PlaneCamera extends Phaser.Cameras.Scene2D.Camera {
  /** The depth it looks at (world px; 0 = the actors' plane). */
  z = 0;
  /** Fixed to the screen: 1280 × 720 game units covering the picture. */
  screen = false;
  /** Where it draws among the others (its depth, or a hair after it). */
  order = 0;
  /** The shape it is cut to (see `Planes.clip`). */
  clipShape: Phaser.GameObjects.Graphics | null = null;
  /** A free camera draws this far after the plane at its depth (see `Planes.free`). */
  lead = 0;
  /** It carries a figure walking in depth (lit to stay readable: `Lighting.apply`). */
  figure = false;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.roundPixels = true;
  }
}

/** The virtual screen that overlays are made for. */
export const SCREEN_W = 1280;
export const SCREEN_H = 720;

type GO = Phaser.GameObjects.GameObject & Partial<Phaser.GameObjects.Components.ScrollFactor>;

/** Planes are kept a whole world px apart. */
const key = (z: number): number => Math.round(z);
/** A free camera draws this far after the plane at its depth. */
const FREE = 0.25;

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
  /** Where `within` is standing new things just now. */
  private scope: PlaneCamera | null = null;

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

  /** The plane's camera, kept in the plane table (the screen's is not). */
  private make(z: number): PlaneCamera {
    const cam = this.add(z, z, !Number.isFinite(z));
    if (Number.isFinite(z)) this.byZ.set(z, cam);
    return cam;
  }

  /**
   * A camera whose depth moves (a figure walking toward or away from the
   * viewer, and what it makes), outside the plane table: `move` sets its
   * depth. It draws `lead` after the plane at its depth, so the figure
   * stands before what is there.
   */
  free(z: number, lead = FREE): PlaneCamera {
    const cam = this.add(z, z + lead, false);
    cam.lead = lead;
    cam.figure = true;
    return cam;
  }

  /** Moves a free camera to depth z (it returns the camera). */
  move(cam: PlaneCamera, z: number): PlaneCamera {
    if (cam.z === z) return cam;
    cam.z = z;
    const order = z + cam.lead;
    // Re-sorted only when it passes another camera.
    const list = this.scene.cameras.cameras as PlaneCamera[];
    const i = list.indexOf(cam);
    const before = list[i - 1];
    const after = list[i + 1];
    cam.order = order;
    if ((before && before.order > order) || (after && after.order < order)) this.sortCameras();
    return cam;
  }

  /**
   * Runs `fn`, and stands on `cam` whatever it adds to the scene (so what a
   * figure makes away from the actors' plane stands at its depth). Nested
   * calls: the innermost wins.
   */
  within<T>(cam: PlaneCamera, fn: () => T): T {
    const made: GO[] = [];
    const seen = (o: GO): void => {
      made.push(o);
    };
    const events = this.scene.events;
    const outer = this.scope;
    this.scope = cam;
    events.on(Phaser.Scenes.Events.ADDED_TO_SCENE, seen);
    try {
      return fn();
    } finally {
      events.off(Phaser.Scenes.Events.ADDED_TO_SCENE, seen);
      this.scope = outer;
      for (const o of made) {
        // Placed by an inner call, put in a container or gone since: left as they are.
        if (this.placed.has(o) || o.parentContainer || o.displayList !== this.scene.children) continue;
        const fixed = o.scrollFactorX === 0 && o.scrollFactorY === 0;
        this.placeOn(o, fixed ? this.screen : cam);
      }
    }
  }

  /**
   * A point of the plane `within` is standing things on, as the point of the
   * actors' plane that shows in the same place: for the effects that keep
   * their pieces there and reuse them (dust, sparks, birds), so what they
   * throw still comes from where it was made.
   */
  toMain(x: number, y: number): { x: number; y: number } {
    const cam = this.scope;
    if (!cam || cam.screen || Math.abs(cam.z) < 0.5) return { x, y };
    const p = this.lens.project(x, y, cam.z);
    return this.lens.unproject(p.x, p.y, 0);
  }

  /** A camera drawn between the planes at an exact depth, in screen space, outside the plane table (the box's shaders use these). */
  layer(z: number): PlaneCamera {
    return this.add(z, z, true);
  }

  /**
   * A camera of the plane at depth z that shows only what is put on it
   * (`placeOn`), cut to `shape`: a Graphics in the plane's world
   * coordinates that is not on the display list. WebGL cuts with the
   * camera's mask filter; the Canvas renderer has no camera filters, so
   * there each object put on it gets a geometry mask instead.
   */
  clip(z: number, shape: Phaser.GameObjects.Graphics): PlaneCamera {
    const k = key(z);
    const cam = this.add(k, k + 0.5, false);
    cam.clipShape = shape;
    if (this.scene.game.renderer.type === Phaser.WEBGL) cam.filters?.internal.addMask(shape, false, cam);
    return cam;
  }

  private add(z: number, order: number, screen: boolean): PlaneCamera {
    const { width, height } = this.scene.scale;
    const cam = new PlaneCamera(0, 0, width, height);
    cam.z = z;
    cam.order = order;
    cam.screen = screen;
    cam.transparent = true;
    cam.setScene(this.scene);
    const added = this.scene.cameras.addExisting(cam, false);
    if (!added || !cam.id) throw new Error('paper: out of cameras (31 at most)');
    this.sortCameras();
    this.dirty = true;
    return cam;
  }

  private sortCameras(): void {
    this.scene.cameras.cameras.sort((a, b) => (a as PlaneCamera).order - (b as PlaneCamera).order);
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
    const maskable = obj as unknown as Partial<Phaser.GameObjects.Components.Mask>;
    if (cam.clipShape && this.scene.game.renderer.type !== Phaser.WEBGL && maskable.setMask) maskable.setMask(cam.clipShape.createGeometryMask());
    return obj;
  }

  /** The camera an object was placed on. */
  cameraOf(obj: object): PlaneCamera | undefined {
    return this.placed.get(obj);
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
        if (cam === this.screen) {
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

/** The planes of a scene the paper engine stages (null: a flat scene). */
export function planesOf(scene: Phaser.Scene): Planes | null {
  return (scene as { paper?: { planes?: Planes } }).paper?.planes ?? null;
}
