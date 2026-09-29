import * as Phaser from 'phaser';
import { frameRef, hasFrame } from '../art/TextureFactory';
import type { RigDef } from '../art/rigTypes';
import { Face } from '../entities/Celestial';
import { humanoidPose, type Emote, type PoseParams } from '../entities/animPoses';
import { horsePose } from '../entities/horsePoses';
import { RigView, type PoseFn } from '../entities/RigView';
import type { Voice } from './voice';

// Close-up portraits for face-animated dialogue scenes. Each portrait draws
// inside a window (the cinema scene frames and clips it) and animates from
// two facts: whether its character is the one speaking, and whether the
// words are still appearing.

export interface Portrait {
  /** Everything drawn for this portrait; the window clips it. */
  readonly root: Phaser.GameObjects.Container;
  update(dtMs: number, speaking: boolean, typing: boolean, voice: Voice): void;
  destroy(): void;
}

/** Window a portrait is framed in (screen space of the cinema scene). */
export interface PortraitWindow {
  cx: number;
  cy: number;
  size: number;
  /** Which way the character looks (toward the middle of the screen). */
  facing: 1 | -1;
}

/**
 * A character rig seen up close: the whole cutout rig, scaled up and placed
 * so that its focus point (the eye, the muzzle…) sits in the window.
 */
export class RigPortrait implements Portrait {
  readonly root: Phaser.GameObjects.Container;
  private readonly rig: RigView;
  private t = 0;
  private blinkIn = 1.2;
  private blinkT = -1;

  constructor(
    scene: Phaser.Scene,
    rigDef: RigDef,
    win: PortraitWindow,
    opts: { scale: number; focus: string; dx?: number; dy?: number; horse?: boolean },
  ) {
    const poseFn: PoseFn = opts.horse ? (a, t, p) => horsePose(a, t, p) : (a, t, p, id) => humanoidPose(id, a, t, p);
    this.root = scene.add.container(0, 0);
    this.rig = new RigView(scene, rigDef, poseFn, 0, 0, 0);
    this.rig.scale = opts.scale;
    this.rig.setFacing(win.facing);
    this.rig.snap();
    this.root.add(this.rig.container);
    // Put the focus point at the window's centre, a little above it.
    const p = this.rig.attachPoint(opts.focus);
    this.rig.setPosition(win.cx - p.x + (opts.dx ?? 0) * win.facing, win.cy - p.y + (opts.dy ?? -win.size * 0.06));
  }

  update(dtMs: number, speaking: boolean, typing: boolean, voice: Voice): void {
    const dt = dtMs / 1000;
    this.t += dt;
    let blink = 0;
    if (this.blinkT >= 0) {
      this.blinkT += dt;
      if (this.blinkT > 0.15) {
        this.blinkT = -1;
        this.blinkIn = 2 + Math.random() * 3;
      } else blink = 1 - Math.abs(this.blinkT / 0.075 - 1);
    } else if ((this.blinkIn -= dt) <= 0) this.blinkT = 0;
    let emote: Emote = 'listen';
    if (speaking) emote = voice === 'shout' ? 'shout' : typing ? 'talk' : 'listen';
    const prm: PoseParams = { emote, emoteK: 1, blink };
    this.rig.play('idle', prm);
    this.rig.update(dtMs);
  }

  destroy(): void {
    this.rig.destroy();
    this.root.destroy(true);
  }
}

/** The Moon or the Sun: their own animated faces. */
export class FacePortrait implements Portrait {
  readonly root: Phaser.GameObjects.Container;
  private readonly face: Face;
  private sayCd = 0;

  constructor(scene: Phaser.Scene, kind: 'baby' | 'old' | 'sun', win: PortraitWindow) {
    this.root = scene.add.container(0, 0);
    this.face = new Face(scene, kind, win.cx, win.cy + win.size * 0.04, 0);
    const size = kind === 'sun' ? 360 : kind === 'old' ? 300 : 260;
    this.face.setScale((win.size * 0.92) / size);
    this.face.lookAt(win.cx - win.facing * 400, win.cy);
    this.root.add(this.face.c);
  }

  update(dtMs: number, speaking: boolean, typing: boolean, voice: Voice): void {
    this.sayCd -= dtMs / 1000;
    if (speaking && typing && this.sayCd <= 0) {
      this.face.say(1200);
      this.sayCd = 1.1;
    }
    this.face.laughing = speaking && voice === 'shout';
    this.face.update(dtMs);
  }

  destroy(): void {
    this.face.destroy();
    this.root.destroy(true);
  }
}

/**
 * A still picture (the shadow forms, a clock, the people at the table).
 * `fill` sizes it against the window; `focusY` (0 top … 1 bottom) is the
 * height of the picture that sits at the window's centre (a face).
 */
export class ArtPortrait implements Portrait {
  readonly root: Phaser.GameObjects.Container;
  private readonly img: Phaser.GameObjects.Image | null = null;
  private t = 0;
  private readonly base: number;

  constructor(scene: Phaser.Scene, key: string, win: PortraitWindow, opts: { fill?: number; focusY?: number } = {}) {
    this.root = scene.add.container(win.cx, win.cy);
    this.base = 1;
    if (!hasFrame(key)) return;
    const fill = opts.fill ?? 0.85;
    const f = frameRef(key);
    const img = scene.add.image(0, 0, f.atlas, f.frame).setOrigin(0.5, opts.focusY ?? 0.5);
    const s = (win.size * fill) / Math.max(f.w, f.h);
    this.base = s * f.w > 0 ? s : 1;
    img.setScale(this.base).setFlipX(win.facing < 0);
    this.root.add(img);
    this.img = img;
  }

  update(dtMs: number, speaking: boolean, typing: boolean, voice: Voice): void {
    this.t += dtMs / 1000;
    if (!this.img) return;
    const talk = speaking && typing ? (voice === 'shout' ? 0.05 : voice === 'whisper' ? 0.012 : 0.025) : 0;
    const bob = talk * Math.abs(Math.sin(this.t * 13));
    this.img.setScale(this.base * (1 + bob), this.base * (1 - bob * 0.6));
    this.img.y = Math.sin(this.t * 1.4) * 3;
  }

  destroy(): void {
    this.root.destroy(true);
  }
}

/** Keeps portraits out of Phaser's type narrowing on optional images. */
export type PortraitFactory = (scene: Phaser.Scene, win: PortraitWindow) => Portrait;
