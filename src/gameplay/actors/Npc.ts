import * as Phaser from 'phaser';
import { DEPTH } from '../../engine/constants';
import { RigView } from '../../render/2d/rig/RigView';
import type { CastMember } from '../../content/characters/cast';

// A character standing in a room who talks to Gorti: a cut-out rig that
// breathes, turns to Gorti when it comes near, and shows a small comic
// balloon ("…") while it has something to say. The room's ContentScript
// owns the talking.

const NEAR = 220;
/** Balloon height above the feet. */
const MARK_Y = 190;

export class Npc {
  readonly rig: RigView;
  private readonly mark: Phaser.GameObjects.Container;
  private t = Math.random() * 4000;
  /** Whether it still has something new to say (the balloon shows). */
  hasNews = true;

  constructor(
    scene: Phaser.Scene,
    readonly id: string,
    cast: CastMember,
    readonly x: number,
    readonly feetY: number,
    private readonly facing: 1 | -1,
  ) {
    this.rig = new RigView(scene, cast.rig, cast.pose, x, feetY, DEPTH.actors);
    this.rig.setFacing(facing);
    this.rig.snapTo('idle', { idleT: 0 });
    const g = scene.add.graphics();
    g.fillStyle(0xfbf6ea, 1).lineStyle(3, 0x231a2b, 1);
    g.fillRoundedRect(-24, -18, 48, 30, 13).strokeRoundedRect(-24, -18, 48, 30, 13);
    g.fillTriangle(-8, 11, 4, 11, -12, 22).lineBetween(-8, 12.5, -12, 22).lineBetween(-12, 22, 4, 12.5);
    const dots = scene.add.text(0, -4, '…', { fontFamily: '"Arial Black", Impact, sans-serif', fontSize: '22px', color: '#231a2b' }).setOrigin(0.5);
    this.mark = scene.add.container(x, feetY - MARK_Y, [g, dots]).setDepth(DEPTH.fx).setVisible(false);
  }

  /** Whether Gorti stands close enough to talk. */
  near(px: number): boolean {
    return Math.abs(px - this.x) < NEAR;
  }

  /** `talk` while its own line types, `listen` through the rest of the talk, `laugh` along with Gorti. */
  update(dtMs: number, px: number, mode: 'idle' | 'talk' | 'listen' | 'laugh'): void {
    this.t += dtMs;
    const near = this.near(px);
    this.rig.setFacing(near || mode !== 'idle' ? (px < this.x ? -1 : 1) : this.facing);
    if (mode === 'idle') this.rig.play('idle', { idleT: this.t / 1000 });
    else this.rig.play(mode, { emote: mode, emoteK: 1 });
    this.rig.update(dtMs);
    this.mark.setVisible(this.hasNews && near && mode === 'idle');
    this.mark.y = this.feetY - MARK_Y + Math.sin(this.t / 260) * 4;
  }

  destroy(): void {
    this.rig.destroy();
    this.mark.destroy();
  }
}
