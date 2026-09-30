import * as Phaser from 'phaser';
import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { frameRef, hasFrame } from '../../render/2d/TextureFactory';

/**
 * A heavy memory stone. Only the human body can push it; it never slides by
 * itself and can always be recalled to its start by a shrine.
 */
export class MemoryStone {
  readonly zone: Phaser.GameObjects.Zone;
  readonly body: Phaser.Physics.Arcade.Body;
  readonly img: Phaser.GameObjects.Image | null;
  readonly size = 60;
  locked = false;
  private scene: Phaser.Scene;
  private scrapeAcc = 0;

  constructor(scene: Phaser.Scene, readonly home: { x: number; y: number }, group: Phaser.Physics.Arcade.StaticGroup) {
    this.scene = scene;
    this.zone = scene.add.zone(home.x, home.y - this.size / 2, this.size, this.size);
    scene.physics.add.existing(this.zone);
    this.body = this.zone.body as Phaser.Physics.Arcade.Body;
    // Not immovable (the static ground must be able to hold it up), but never
    // shoved by other bodies: it only moves when the script pushes it.
    this.body.pushable = false;
    this.body.setMaxVelocity(200, 900);
    scene.physics.add.collider(this.zone, group);
    if (hasFrame('prop.stone')) {
      const f = frameRef('prop.stone');
      this.img = scene.add.image(home.x, home.y, f.atlas, f.frame).setOrigin(f.px / f.w, f.py / f.h).setScale(1 / f.scale).setDepth(DEPTH.props + 3);
    } else this.img = null;
  }

  get x(): number {
    return this.zone.x;
  }

  get bottom(): number {
    return this.zone.y + this.size / 2;
  }

  /** Pushing velocity for this step (0 = rest). */
  push(vx: number, dt: number): void {
    if (this.locked) {
      this.body.setVelocityX(0);
      return;
    }
    this.body.setVelocityX(vx);
    if (vx !== 0 && this.body.blocked.down) {
      this.scrapeAcc += Math.abs(vx) * dt;
      if (this.scrapeAcc > 40) {
        this.scrapeAcc = 0;
        app.audio.sfx('step', { pitch: 0.5, vol: 0.8 });
      }
    }
  }

  /** A dormant stone has no body and is not drawn (e.g. before its ledge exists). */
  setDormant(on: boolean): void {
    this.body.enable = !on;
    this.img?.setVisible(!on);
    if (on) this.body.setVelocity(0, 0);
  }

  placeAt(x: number, bottomY: number): void {
    this.body.reset(x, bottomY - this.size / 2);
  }

  recall(): void {
    this.locked = false;
    const img = this.img;
    const go = (): void => {
      this.placeAt(this.home.x, this.home.y);
      if (img) this.scene.tweens.add({ targets: img, alpha: 1, duration: 400 });
    };
    app.audio.sfx('crystal', { pitch: 0.7 });
    if (img) this.scene.tweens.add({ targets: img, alpha: 0, duration: 300, onComplete: go });
    else go();
  }

  sync(): void {
    if (this.img) this.img.setPosition(this.zone.x, this.zone.y + this.size / 2 + 2);
  }

  destroy(): void {
    this.img?.destroy();
    this.zone.destroy();
  }
}
