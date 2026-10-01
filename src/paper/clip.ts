import * as Phaser from 'phaser';

// Phaser 4 masks with filters, and only images, cameras and the like take
// filters (not containers). A ClipView shows some objects of a flat scene
// through a copy of its main camera that is cut to a shape. Under the
// Canvas renderer, which has no filters, each object gets a geometry mask.

type Clipped = Phaser.GameObjects.GameObject & Partial<Phaser.GameObjects.Components.Mask>;

export class ClipView {
  /** The cut, in the scene's world coordinates (draw on it; it is not on the display list). */
  readonly shape: Phaser.GameObjects.Graphics;
  private readonly cam: Phaser.Cameras.Scene2D.Camera | null = null;
  private readonly members = new Set<Clipped>();

  constructor(private readonly scene: Phaser.Scene) {
    this.shape = scene.make.graphics({}, false);
    if (scene.game.renderer.type !== Phaser.WEBGL) return;
    const main = scene.cameras.main;
    const cam = scene.cameras.add(0, 0, main.width, main.height);
    cam.transparent = true;
    cam.filters?.internal.addMask(this.shape, false, cam);
    this.cam = cam;
    scene.events.on(Phaser.Scenes.Events.PRE_RENDER, this.sync, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.events.off(Phaser.Scenes.Events.PRE_RENDER, this.sync, this));
  }

  /** Shows an object only inside the cut (drawn over the scene, in its own depth order). */
  add(obj: Clipped): void {
    this.members.add(obj);
    if (!this.cam) obj.setMask?.(this.shape.createGeometryMask());
  }

  remove(obj: Clipped): void {
    this.members.delete(obj);
  }

  private sync(): void {
    const cam = this.cam!;
    const main = this.scene.cameras.main;
    if (cam.width !== main.width || cam.height !== main.height) cam.setSize(main.width, main.height);
    cam.setZoom(main.zoom);
    cam.setScroll(main.scrollX, main.scrollY);
    let all = 0;
    for (const c of this.scene.cameras.cameras) all |= c.id;
    for (const o of this.scene.children.list) {
      if (this.members.has(o as Clipped)) o.cameraFilter = all & ~cam.id;
      else o.cameraFilter |= cam.id;
    }
  }
}
