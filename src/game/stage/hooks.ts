import type * as Phaser from 'phaser';
import type { SolidDef } from '../data/roomTypes';

// The game's side of the 3D stage: a registry that never loads three.js.
// Game code marks what the diorama should stand up in 3D (`stage.lift`) or
// leave to Phaser (`stage.keep`); the stage (src/game/stage/Stage.ts, loaded
// on its own) reads the marks whenever it is attached to the world scene.
// In flat mode nothing happens at all.
//
// A lifted object is hidden from Phaser's main camera only (its camera
// filter); its `visible` flag stays the scripts' own. Objects nobody marked
// are lifted too when they are plain world art: images and sprites, and
// containers of them, drawn in the depth bands below DEPTH.fx with no mask,
// blend mode or pipeline (see Mirror.eligible). Everything else stays
// Phaser's: graphics, particles, text, glows, masks, overlays.

export interface LiftOpts {
  /**
   * Depth in world px (0 = the actors' plane, negative = further back). By
   * default it comes from the scroll factor (parallax layers) or the DEPTH
   * band (everything else). With a depth given, the object stands at its
   * world position at that depth, whatever its scroll factor.
   */
  z?: number;
  /** An upright card (default), the art of a terrain slab's front, or a decal lying on the ground. */
  as?: 'card' | 'terrain' | 'decal';
  /** Paper thickness of the card's edge (px); 0 for none. */
  thick?: number;
  /** Casts a shadow (default for upright cards with an edge). */
  cast?: boolean;
  /** Lit by the room's lights (default: yes, except layers far behind the box). */
  lit?: boolean;
  /** Hangs from its top and sways a little (lamps, charms). */
  sway?: boolean;
  /** Stands a few degrees off square, as cut-outs do in a real box (furniture). */
  lean?: boolean;
  /** Depth between the children of a container, in their draw order (px). */
  dz?: number;
  /** Terrain art: the solid whose front face it paints (see `as`). */
  solid?: SolidDef;
  /** A cut-out figure (a rig): its parts stand a hair apart. */
  rig?: boolean;
  /** Stays drawn by Phaser. */
  keep?: boolean;
}

/** What the stage implements (Stage.ts). */
export interface StageDriver {
  attach(world: Phaser.Scene): void;
  lift(obj: Phaser.GameObjects.GameObject, opts: LiftOpts): void;
  keep(obj: Phaser.GameObjects.GameObject): void;
  /** True while the diorama draws the given scene. */
  draws(scene: Phaser.Scene): boolean;
}

const marks = new WeakMap<object, LiftOpts>();
let driver: StageDriver | null = null;
let world: Phaser.Scene | null = null;

export const stage = {
  /** Stands a world object up in the diorama (no-op in flat mode). */
  lift<T extends Phaser.GameObjects.GameObject>(obj: T, opts: LiftOpts = {}): T {
    marks.set(obj, opts);
    if (driver && world && obj.scene === world) driver.lift(obj, opts);
    return obj;
  },

  /** Leaves an object to Phaser even where it would be lifted. */
  keep<T extends Phaser.GameObjects.GameObject>(obj: T): T {
    marks.set(obj, { keep: true });
    if (driver && world && obj.scene === world) driver.keep(obj);
    return obj;
  },

  /** Notes options for a part of a lifted container (read when it is drawn). */
  hint<T extends Phaser.GameObjects.GameObject>(obj: T, opts: LiftOpts): T {
    marks.set(obj, opts);
    return obj;
  },

  /** The mark an object carries, if any. */
  mark(obj: object): LiftOpts | undefined {
    return marks.get(obj);
  },

  /** The world scene is ready: the stage takes it over (now, or once it has loaded). */
  attach(scene: Phaser.Scene): void {
    world = scene;
    scene.events.once('shutdown', () => {
      if (world === scene) world = null;
    });
    driver?.attach(scene);
  },

  /** True while the diorama draws this scene (3D mode). */
  draws(scene: Phaser.Scene): boolean {
    return !!driver && driver.draws(scene);
  },

  /** Stage.ts registers itself here once three.js has loaded. */
  setDriver(d: StageDriver | null): void {
    driver = d;
    if (d && world && world.sys.isActive()) d.attach(world);
  },
};
