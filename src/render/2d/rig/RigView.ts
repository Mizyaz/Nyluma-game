import * as Phaser from 'phaser';
import { drawOrder, isNear, orderJoints, solve, type Angles, type Solved } from './fk';
import type { RigDef, RigJoint } from './rigTypes';
import { frameRef, hasFrame } from '../TextureFactory';
import type { PoseOut, PoseParams } from './animPoses';
import { profileOf } from './poseKit';
import { stage } from '../../2.5d/hooks';
import { DEPTH } from '../../../engine/constants';

export type PoseFn = (anim: string, t: number, prm: PoseParams, rigId: string) => PoseOut;

/**
 * Per-joint smoothing rates, for the change to another animation (or any
 * jump in the pose): arms trail the body, the head a little less.
 */
const RATE: Record<string, number> = {
  armR: 11,
  armL: 10,
  foreR: 12,
  foreL: 11,
  head: 14,
  // Brows snap: reactions must read instantly.
  browN: 30,
};

/**
 * Motion inside one animation is followed as the pose gives it, up to this
 * fast (rad/s; px/s for offsets): easing it would lag a walk behind its
 * phase (the planted feet would slide) and soften every fast move. What is
 * faster than that, and every change to another animation, is eased.
 */
const FOLLOW = 30;
const FOLLOW_PX = 900;

const clampAbs = (v: number, m: number): number => (v > m ? m : v < -m ? -m : v);


/**
 * Runtime cutout rig: one container of images positioned every frame with
 * forward kinematics. Poses come from a procedural pose function; a change
 * of animation is eased per joint (the arms trailing the body), motion
 * within an animation is followed as posed.
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
  /**
   * Secondary motion of spring joints: angle offset and its velocity, the
   * parent's last turn, and the joint's last place and speed in the rig.
   */
  private springs = new Map<string, { a: number; v: number; parentRot: number | null; px: number; py: number; vx: number; vy: number }>();
  private lastPos: { x: number; y: number } | null = null;
  private lastVel = { x: 0, y: 0 };
  /** The pose's own targets last frame, and the animation they were for. */
  private lastAngles: Angles = {};
  private lastOffsets: Record<string, { x: number; y: number }> = {};
  private lastAnim = '';
  /** Soft shadows on the ground under the feet (see `makeContact`). */
  private contact: { img: Phaser.GameObjects.Image; joint: string }[] = [];
  private readonly mat = { world: new Phaser.GameObjects.Components.TransformMatrix(), parent: new Phaser.GameObjects.Components.TransformMatrix() };

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
    this.makeContact(depth);
    this.snap();
  }

  /**
   * A figure standing in the game world gets a soft contact shadow under
   * each foot, darkest while the foot is planted, fading as it lifts; in the
   * diorama it lies on the floor. Not the player (the world scene keeps his
   * on the ground below him while he jumps), not a rider (his feet are off
   * the ground), nothing outside the world (the title menu, portraits).
   */
  private makeContact(depth: number): void {
    if (this.scene.sys.settings.key !== 'world' || depth >= DEPTH.player || !hasFrame('fx.shadow')) return;
    const f = frameRef('fx.shadow');
    for (const id of ['footR', 'footL']) {
      if (!this.ordered.some((j) => j.id === id)) continue;
      const img = this.scene.add.image(0, 0, f.atlas, f.frame).setDepth(depth - 1).setVisible(false);
      stage.lift(img, { as: 'decal' });
      this.contact.push({ img, joint: id });
    }
    // Every frame too: scripts move and hide the container itself.
    if (!this.contact.length) return;
    const events = this.scene.events;
    events.on(Phaser.Scenes.Events.POST_UPDATE, this.placeContact, this);
    this.container.once(Phaser.GameObjects.Events.DESTROY, () => events.off(Phaser.Scenes.Events.POST_UPDATE, this.placeContact, this));
  }

  /** The contact shadows under the feet as the figure stands now. */
  private placeContact(): void {
    if (!this.contact.length) return;
    const c = this.container;
    const shown = c.visible && c.alpha > 0.02 && !!c.scene;
    const m = c.getWorldTransformMatrix(this.mat.world, this.mat.parent);
    const prof = profileOf(this.rig.id);
    // The middle of the sole, in the foot's frame.
    const u = ((prof.heel ?? -5) + (prof.ball ?? 8)) / 2 + 1;
    const v = prof.sole ?? 6;
    for (const s of this.contact) {
      const j = this.solved.get(s.joint);
      if (!shown || !j) {
        s.img.setVisible(false);
        continue;
      }
      const cs = Math.cos(j.rot);
      const sn = Math.sin(j.rot);
      const lx = j.x + u * cs - v * sn;
      const ly = j.y + u * sn + v * cs;
      const x = m.getX(lx, ly);
      // Height of the sole above the ground line (the rig's root).
      const h = Math.max(0, c.y - m.getY(lx, ly));
      const k = Math.max(0, 1 - h / 24);
      const sc = 0.3 * (0.7 + 0.3 * k);
      // Below 1 so the diorama draws it see-through (a decal at full alpha is cut out).
      s.img.setVisible(k > 0.03).setPosition(x, c.y + 1).setScale(sc).setAlpha(0.9 * k * c.alpha);
    }
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
      // Marks on a screen face glow: the diorama does not shade them.
      if (this.rig.glowing?.includes(j.id)) stage.hint(img, { lit: false });
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
    this.lastAnim = '';
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
    this.lastAnim = '';
  }

  update(dtMs: number): void {
    const dt = Math.min(dtMs, 50) / 1000;
    this.animT += dt;
    const pose = this.poseFn(this.anim, this.animT, this.params, this.rig.id);
    // Within one animation the joints move with the pose; what is left
    // over from the last change eases away.
    const follow = this.lastAnim === this.anim && dt > 0;
    this.lastAnim = this.anim;
    const fa = FOLLOW * dt;
    const fp = FOLLOW_PX * dt;
    for (const j of this.ordered) {
      const target = pose.angles[j.id] ?? 0;
      let cur = this.angles[j.id] ?? 0;
      const was = this.lastAngles[j.id];
      if (follow && was !== undefined) cur += clampAbs(target - was, fa);
      this.lastAngles[j.id] = target;
      const r = (RATE[j.id] ?? 16) * this.stiffness;
      this.angles[j.id] = cur + (target - cur) * (1 - Math.exp(-r * dt));
      const to = pose.offsets[j.id];
      const co = this.offsets[j.id];
      if (to || co) {
        const tx = to?.x ?? 0;
        const ty = to?.y ?? 0;
        const c = co ?? { x: 0, y: 0 };
        const lo = this.lastOffsets[j.id];
        if (follow && lo) {
          c.x += clampAbs(tx - lo.x, fp);
          c.y += clampAbs(ty - lo.y, fp);
        }
        this.lastOffsets[j.id] = { x: tx, y: ty };
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
   * Secondary motion for spring joints (hair, a skirt, a moustache, a
   * flame): they trail their parent's turns and swing from changes of
   * speed, the body's through the world and their own inside the rig (the
   * bob of a step, the bounce of a laugh), then settle.
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
      const sp = this.springs.get(j.id) ?? { a: 0, v: 0, parentRot: null, px: Number.NaN, py: 0, vx: 0, vy: 0 };
      const parent = this.solved.get(j.parent);
      const me = this.solved.get(j.id);
      if (parent && me) {
        if (sp.parentRot !== null) sp.a -= (parent.rot - sp.parentRot) * j.spring.lag;
        sp.parentRot = parent.rot;
        let ax = dvx;
        let ay = dvy;
        if (!Number.isNaN(sp.px) && dt > 0) {
          const vx = (me.x - sp.px) / dt;
          const vy = (me.y - sp.py) / dt;
          ax += Math.max(-600, Math.min(600, vx - sp.vx));
          ay += Math.max(-600, Math.min(600, vy - sp.vy));
          sp.vx = vx;
          sp.vy = vy;
        }
        sp.px = me.x;
        sp.py = me.y;
        // Direction the part points and the push it feels (inertia).
        const [tx, ty] = j.spring.tip;
        const len = Math.hypot(tx, ty) || 1;
        const cs = Math.cos(me.rot);
        const sn = Math.sin(me.rot);
        const dx = (tx * cs - ty * sn) / len;
        const dy = (tx * sn + ty * cs) / len;
        sp.v += j.spring.gain * (-dx * ay + dy * ax);
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
    this.placeContact();
  }

  setPosition(x: number, y: number): void {
    this.container.setPosition(x + this.offX, y + this.offY);
    this.placeContact();
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
    this.placeContact();
  }

  setAlpha(a: number): void {
    this.container.setAlpha(a);
    this.placeContact();
  }

  setDepth(d: number): void {
    this.container.setDepth(d);
    for (const s of this.contact) s.img.setDepth(d - 1);
  }

  destroy(): void {
    for (const s of this.contact) s.img.destroy();
    this.contact = [];
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
