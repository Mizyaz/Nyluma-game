import * as Phaser from 'phaser';
import { app } from '../App';
import { DEPTH } from '../constants';
import { hex, P } from '../art/palette';
import { RIG_HORSE } from '../art/characters/horse';
import { frameRef } from '../art/TextureFactory';
import type { FormId } from '../state/types';
import { humanoidPose } from './animPoses';
import { GALLOP_OFFSETS, horsePose } from './horsePoses';
import { rigFor } from './Player';
import { RigView } from './RigView';

/**
 * The purple horse as a visual actor (emergence, idle, kneel, gallop,
 * jump, rear, dissolution) with an optional mounted Gorti. The ride room
 * drives its position; other rooms use it as a scripted character.
 */
export class Horse {
  readonly rig: RigView;
  rider: RigView | null = null;
  x: number;
  y: number;
  facing: 1 | -1 = 1;
  phase = 0;
  private lastContact: Record<string, number> = { huL: 0, huR: 0, fuL: 0, fuR: 0 };
  onHoof: ((x: number, y: number, leg: string) => void) | null = null;
  private scene: Phaser.Scene;
  private glowImg: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, groundY: number, depth: number = DEPTH.actors) {
    this.scene = scene;
    this.x = x;
    this.y = groundY;
    this.rig = new RigView(scene, RIG_HORSE, (a, t, p) => horsePose(a, t, p), x, groundY, depth);
    const g = frameRef('fx.glow');
    this.glowImg = scene.add.image(x, groundY - 90, g.atlas, g.frame).setBlendMode(Phaser.BlendModes.ADD).setTint(hex(P.violet)).setAlpha(0.25).setScale(2.2, 1.4).setDepth(depth - 1);
  }

  setRider(form: FormId | null): void {
    if (form === null) {
      this.rider?.destroy();
      this.rider = null;
      return;
    }
    // Gorti in the body he has now (the Sun head on the ride to the Sun).
    const rig = rigFor('gorti', form);
    if (!this.rider) {
      this.rider = new RigView(this.scene, rig, (a, t, p, id) => humanoidPose(id, a, t, p), this.x, this.y, this.rig.container.depth + 1);
    } else this.rider.setRig(rig);
    this.rider.play('ride');
    this.rider.setFacing(this.facing);
  }

  play(anim: string, phase?: number): void {
    this.rig.play(anim, phase !== undefined ? { phase } : {});
  }

  setFacing(f: 1 | -1): void {
    this.facing = f;
    this.rig.setFacing(f);
    this.rider?.setFacing(f);
  }

  /** Advances the gallop by distance travelled; fires hoof contacts. */
  gallop(dist: number): void {
    this.phase += dist / 300;
    this.rig.play('gallop', { phase: this.phase });
    for (const [leg, off] of Object.entries(GALLOP_OFFSETS)) {
      const cyc = Math.floor(this.phase + off + 0.25);
      if (cyc !== this.lastContact[leg]) {
        this.lastContact[leg] = cyc;
        const hoof = this.rig.attachPoint(leg === 'fuR' ? 'hoofFR' : leg === 'fuL' ? 'hoofFL' : leg === 'huR' ? 'hoofHR' : 'hoofHL');
        this.onHoof?.(hoof.x, this.y, leg);
      }
    }
  }

  update(dtMs: number): void {
    this.rig.setPosition(this.x, this.y);
    this.rig.update(dtMs);
    this.glowImg.setPosition(this.x, this.y - 80).setVisible(this.rig.container.visible).setAlpha(0.18 * this.rig.container.alpha);
    if (this.rider) {
      const s = this.rig.attachPoint('saddle');
      this.rider.setPosition(s.x, s.y + 40);
      this.rider.extraRot = this.rig.container.rotation * this.facing;
      this.rider.update(dtMs);
      this.rider.setAlpha(this.rig.container.alpha);
      this.rider.setVisible(this.rig.container.visible);
    }
  }

  /** Rises out of the earth (purple fluid + soil). */
  emerge(onDone?: () => void): void {
    const c = this.rig.container;
    this.rig.play('emerge');
    c.setAlpha(0);
    this.rig.offY = 140;
    const prog = { t: 0 };
    app.audio.sfx('rumble');
    this.scene.tweens.add({
      targets: prog,
      t: 1,
      duration: 2200,
      ease: 'Sine.easeOut',
      onUpdate: () => {
        this.rig.offY = 140 * (1 - prog.t);
        c.setAlpha(Math.min(1, prog.t * 1.6));
      },
      onComplete: () => {
        this.rig.offY = 0;
        c.setAlpha(1);
        this.rig.play('idle');
        app.audio.sfx('neigh');
        onDone?.();
      },
    });
  }

  /** Dissolves back into soil and fluid. */
  dissolve(onDone?: () => void): void {
    const c = this.rig.container;
    const prog = { t: 0 };
    this.scene.tweens.add({
      targets: prog,
      t: 1,
      duration: 1600,
      ease: 'Sine.easeIn',
      onUpdate: () => {
        this.rig.offY = 40 * prog.t;
        c.setAlpha(1 - prog.t);
      },
      onComplete: () => {
        c.setVisible(false);
        onDone?.();
      },
    });
  }

  destroy(): void {
    this.rig.destroy();
    this.rider?.destroy();
    this.glowImg.destroy();
  }
}
