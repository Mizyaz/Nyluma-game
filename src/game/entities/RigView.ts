import * as Phaser from 'phaser';
import { drawOrder, isNear, orderJoints, solve, type Angles, type Solved } from '../art/fk';
import type { RigDef, RigJoint } from '../art/rigTypes';
import { frameRef, hasFrame } from '../art/TextureFactory';
import type { PoseOut, PoseParams } from './animPoses';
import { stage } from '../stage/hooks';

export type PoseFn = (anim: string, t: number, prm: PoseParams, rigId: string) => PoseOut;

/** Per-joint smoothing rates: arms trail the body, hair trails the head. */
const RATE: Record<string, number> = {
  armR: 11,
  armL: 10,
  foreR: 12,
  foreL: 11,
  head: 14,
  // Brows snap: reactions must read instantly.
  browN: 30,
};

/** Marks on Gorti's screen that glow: the diorama does not shade them. */
const GLOWING = new Set(['eyeN', 'browN', 'mouth']);

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
  /** Shape variant shown per joint ('' = the joint's own part). */
  private variant = new Map<string, string>();
  /** Secondary motion of spring joints: angle offset and its velocity. */
  private springs = new Map<string, { a: number; v: number; parentRot: number | null }>();
  private lastPos: { x: number; y: number } | null = null;
  private lastVel = { x: 0, y: 0 };

  constructor(scene: Phaser.Scene, rig: RigDef, poseFn: PoseFn, x: number, y: number, depth: number) {
    this.scene = scene;
    this.rig = rig;
    this.poseFn = poseFn;
    this.ordered = orderJoints(rig);
    this.container = scene.add.container(x, y);
    this.container.setDepth(depth);
    // In the diorama the figure is a paper puppet: its parts a hair apart.
    stage.lift(this.container, { rig: true });
    this.buildImages();
    this.snap();
  }

  private buildImages(): void {
    for (const img of this.images.values()) img.destroy();
    this.images.clear();
    this.variant.clear();
    this.springs.clear();
    for (const j of this.ordered) {
      if (!j.part) continue;
      const f = frameRef(j.part);
      const img = this.scene.add.image(0, 0, f.atlas, f.frame);
      img.setOrigin(f.px / f.w, f.py / f.h);
      img.setScale(1 / f.scale);
      if (j.additive) img.setBlendMode(Phaser.BlendModes.ADD);
      if (GLOWING.has(j.id)) stage.hint(img, { lit: false });
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
      const v = this.variant.get(j.id);
      const f = frameRef(v ? `${j.part!}.${v}` : j.part!);
      // Side-aware shading: the far limb uses the darker frame.
      const near = isNear(j, this.facing);
      const key = near ? j.part! : j.part! + '.far';
      const fr = near || v ? f : safeFar(key, f);
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
    this.springs.clear();
    this.lastPos = null;
    this.lastVel = { x: 0, y: 0 };
    this.layout(pose);
  }

  /**
   * Puts the joints straight into another pose (no easing), e.g. the crouch
   * at the instant of a jump; the next `update` eases out of it.
   */
  snapTo(anim: string, params: PoseParams = {}): void {
    const pose = this.poseFn(anim, 0, params, this.rig.id);
    for (const j of this.ordered) this.angles[j.id] = pose.angles[j.id] ?? 0;
    for (const k of Object.keys(pose.offsets)) this.offsets[k] = { ...pose.offsets[k]! };
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
    this.stepSprings(dt);
    this.layout(pose);
  }

  /**
   * Secondary motion for spring joints (hair): they trail their parent's
   * turns and swing from the body's changes of speed, then settle.
   */
  private stepSprings(dt: number): void {
    const c = this.container;
    let dvx = 0;
    let dvy = 0;
    if (this.lastPos && dt > 0) {
      const vx = (c.x - this.lastPos.x) / dt;
      const vy = (c.y - this.lastPos.y) / dt;
      // A teleport or a respawn is not a push.
      if (Math.abs(vx) < 3000 && Math.abs(vy) < 3000) {
        dvx = Math.max(-900, Math.min(900, vx - this.lastVel.x));
        dvy = Math.max(-900, Math.min(900, vy - this.lastVel.y));
      }
      this.lastVel = { x: vx, y: vy };
    }
    this.lastPos = { x: c.x, y: c.y };
    // In the rig's own (right-facing) frame.
    dvx *= this.facing;
    let any = false;
    for (const j of this.ordered) {
      if (!j.spring || !j.parent) continue;
      any = true;
      const sp = this.springs.get(j.id) ?? { a: 0, v: 0, parentRot: null };
      const parent = this.solved.get(j.parent);
      const me = this.solved.get(j.id);
      if (parent && me) {
        if (sp.parentRot !== null) sp.a -= (parent.rot - sp.parentRot) * j.spring.lag;
        sp.parentRot = parent.rot;
        // Direction the part points and the push it feels (inertia).
        const [tx, ty] = j.spring.tip;
        const len = Math.hypot(tx, ty) || 1;
        const cs = Math.cos(me.rot);
        const sn = Math.sin(me.rot);
        const dx = (tx * cs - ty * sn) / len;
        const dy = (tx * sn + ty * cs) / len;
        sp.v += j.spring.gain * (-dx * dvy + dy * dvx);
      }
      sp.v += (-j.spring.k * sp.a - j.spring.c * sp.v) * dt;
      sp.a = Math.max(-0.9, Math.min(0.9, sp.a + sp.v * dt));
      this.springs.set(j.id, sp);
    }
    if (!any) return;
  }

  private layout(pose: PoseOut): void {
    let solveAngles = this.angles;
    if (this.springs.size) {
      solveAngles = { ...this.angles };
      for (const [id, sp] of this.springs) solveAngles[id] = (solveAngles[id] ?? 0) + sp.a;
    }
    solve(this.ordered, solveAngles, this.offsets, this.solved);
    for (const j of this.ordered) {
      const img = this.images.get(j.id);
      if (!img) continue;
      const s = this.solved.get(j.id)!;
      img.setPosition(s.x + (pose.x ?? 0), s.y + (pose.y ?? 0));
      img.setRotation(s.rot);
      // Shape variants (eyes, mouth) and per-joint scale.
      const want = pose.frames?.[j.id] ?? '';
      if (want !== (this.variant.get(j.id) ?? '')) {
        const key = want && hasFrame(`${j.part!}.${want}`) ? `${j.part!}.${want}` : j.part!;
        const f = frameRef(key);
        img.setTexture(f.atlas, f.frame);
        img.setOrigin(f.px / f.w, f.py / f.h);
        this.variant.set(j.id, key === j.part ? '' : want);
      }
      const sc = pose.scales?.[j.id];
      const base = 1 / frameRef(j.part!).scale;
      if (sc) img.setScale(base * sc.x, base * sc.y);
      else if (img.scaleX !== base || img.scaleY !== base) img.setScale(base);
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
