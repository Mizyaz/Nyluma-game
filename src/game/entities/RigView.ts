import * as Phaser from 'phaser';
import { drawOrder, isNear, orderJoints, solve, type Angles, type Solved } from '../art/fk';
import type { RigDef, RigJoint } from '../art/rigTypes';
import { frameRef } from '../art/TextureFactory';
import type { PoseOut, PoseParams } from './animPoses';

export type PoseFn = (anim: string, t: number, prm: PoseParams, rigId: string) => PoseOut;

/** Per-joint smoothing rates: arms trail the body, hair trails the head. */
const RATE: Record<string, number> = {
  armR: 11,
  armL: 10,
  foreR: 12,
  foreL: 11,
  head: 14,
};

/**
 * Runtime cutout rig: one container of images positioned every frame with
 * forward kinematics. Poses come from a procedural pose function and are
 * eased per joint, which gives anticipation-free parts natural follow-through.
 */
export class RigView {
  readonly container: Phaser.GameObjects.Container;
  rig: RigDef;
  private ordered: RigJoint[];
  private images = new Map<string, Phaser.GameObjects.Image>();
  private solved = new Map<string, Solved>();
  private angles: Angles = {};
  private offsets: Record<string, { x: number; y: number }> = {};
  private poseFn: PoseFn;
  facing: 1 | -1 = 1;
  anim = 'idle';
  animT = 0;
  params: PoseParams = {};
  /** Extra whole-rig transform. */
  scale = 1;
  squashX = 1;
  squashY = 1;
  offX = 0;
  offY = 0;
  extraRot = 0;
  /** Multiplies smoothing speed (1 = normal; large = snap). */
  stiffness = 1;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, rig: RigDef, poseFn: PoseFn, x: number, y: number, depth: number) {
    this.scene = scene;
    this.rig = rig;
    this.poseFn = poseFn;
    this.ordered = orderJoints(rig);
    this.container = scene.add.container(x, y);
    this.container.setDepth(depth);
    this.buildImages();
    this.snap();
  }

  private buildImages(): void {
    for (const img of this.images.values()) img.destroy();
    this.images.clear();
    for (const j of this.ordered) {
      if (!j.part) continue;
      const f = frameRef(j.part);
      const img = this.scene.add.image(0, 0, f.atlas, f.frame);
      img.setOrigin(f.px / f.w, f.py / f.h);
      img.setScale(1 / f.scale);
      if (j.additive) img.setBlendMode(Phaser.BlendModes.ADD);
      this.images.set(j.id, img);
    }
    this.applyOrder();
  }

  /** Swaps to another rig with the same skeleton (form change). */
  setRig(rig: RigDef, poseFn?: PoseFn): void {
    this.rig = rig;
    if (poseFn) this.poseFn = poseFn;
    this.ordered = orderJoints(rig);
    this.solved.clear();
    this.buildImages();
    this.snap();
  }

  setFacing(f: 1 | -1): void {
    if (f === this.facing) return;
    this.facing = f;
    this.applyOrder();
  }

  private applyOrder(): void {
    this.container.removeAll(false);
    for (const j of drawOrder(this.ordered, this.facing)) {
      const img = this.images.get(j.id);
      if (!img) continue;
      const f = frameRef(j.part!);
      // Side-aware shading: the far limb uses the darker frame.
      const near = isNear(j, this.facing);
      const key = near ? j.part! : j.part! + '.far';
      const fr = near ? f : safeFar(key, f);
      img.setTexture(fr.atlas, fr.frame);
      this.container.add(img);
    }
  }

  play(anim: string, params?: PoseParams): void {
    if (anim !== this.anim) {
      this.anim = anim;
      this.animT = 0;
    }
    if (params) this.params = params;
  }

  /** Jump straight to the current target pose (no easing). */
  snap(): void {
    const pose = this.poseFn(this.anim, this.animT, this.params, this.rig.id);
    this.angles = { ...pose.angles };
    this.offsets = {};
    for (const k of Object.keys(pose.offsets)) this.offsets[k] = { ...pose.offsets[k]! };
    this.layout(pose);
  }

  update(dtMs: number): void {
    const dt = Math.min(dtMs, 50) / 1000;
    this.animT += dt;
    const pose = this.poseFn(this.anim, this.animT, this.params, this.rig.id);
    for (const j of this.ordered) {
      const target = pose.angles[j.id] ?? 0;
      const cur = this.angles[j.id] ?? 0;
      const r = (RATE[j.id] ?? 16) * this.stiffness;
      this.angles[j.id] = cur + (target - cur) * (1 - Math.exp(-r * dt));
      const to = pose.offsets[j.id];
      const co = this.offsets[j.id];
      if (to || co) {
        const tx = to?.x ?? 0;
        const ty = to?.y ?? 0;
        const c = co ?? { x: 0, y: 0 };
        const k = 1 - Math.exp(-18 * this.stiffness * dt);
        c.x += (tx - c.x) * k;
        c.y += (ty - c.y) * k;
        this.offsets[j.id] = c;
      }
    }
    this.layout(pose);
  }

  private layout(pose: PoseOut): void {
    solve(this.ordered, this.angles, this.offsets, this.solved);
    for (const j of this.ordered) {
      const img = this.images.get(j.id);
      if (!img) continue;
      const s = this.solved.get(j.id)!;
      img.setPosition(s.x + (pose.x ?? 0), s.y + (pose.y ?? 0));
      img.setRotation(s.rot);
    }
    const sx = (pose.sx ?? 1) * this.squashX;
    const sy = (pose.sy ?? 1) * this.squashY;
    this.container.setScale(this.facing * this.scale * sx, this.scale * sy);
    this.container.setRotation(this.extraRot * this.facing);
  }

  setPosition(x: number, y: number): void {
    this.container.setPosition(x + this.offX, y + this.offY);
  }

  /** Attachment point in world coordinates. */
  attachPoint(name: string): { x: number; y: number } {
    const a = this.rig.attach[name];
    const c = this.container;
    if (!a) return { x: c.x, y: c.y };
    const s = this.solved.get(a.joint);
    if (!s) return { x: c.x, y: c.y };
    const cs = Math.cos(s.rot);
    const sn = Math.sin(s.rot);
    const lx = s.x + a.x * cs - a.y * sn;
    const ly = s.y + a.x * sn + a.y * cs;
    const m = c.getWorldTransformMatrix();
    return { x: m.getX(lx, ly), y: m.getY(lx, ly) };
  }

  jointImage(id: string): Phaser.GameObjects.Image | undefined {
    return this.images.get(id);
  }

  setVisible(v: boolean): void {
    this.container.setVisible(v);
  }

  setAlpha(a: number): void {
    this.container.setAlpha(a);
  }

  setDepth(d: number): void {
    this.container.setDepth(d);
  }

  destroy(): void {
    this.container.destroy(true);
    this.images.clear();
  }
}

function safeFar(key: string, fallback: ReturnType<typeof frameRef>): ReturnType<typeof frameRef> {
  try {
    return frameRef(key);
  } catch {
    return fallback;
  }
}
