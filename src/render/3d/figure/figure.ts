import * as THREE from 'three';
import type { FigurePose } from '../../2.5d/hooks';
import type { FigureModel } from './gorti';
import { bodyMaterial, hullMaterial, screenMaterial, setHullScale, setOpacity, type FigureMaterials } from './materials';

// A figure standing in for a 2D rig: the rig's joint angles turn the
// model's joints about its Z (the rig's own swing), the whole model turned
// toward the viewer as it faces left or right, its face a screen whose
// marks follow the rig's emotes and blinks.

const TURN_IDLE = THREE.MathUtils.degToRad(50);
const TURN_MOVE = THREE.MathUtils.degToRad(30);
/** The share of the body's turn away from the viewer that the head takes back. */
const HEAD_FOLLOW = 0.45;
const SCALE = 0.96;

export class Figure {
  /** Placed by the stage (or a preview). */
  readonly group = new THREE.Group();
  /** The rig's own offset and roll, in the picture plane. */
  private readonly base = new THREE.Group();
  /** The turn toward the viewer. */
  private readonly body = new THREE.Group();
  private readonly joints = new Map<string, THREE.Object3D>();
  readonly mats: FigureMaterials;
  private psi: number | null = null;
  /** A fixed turn toward the viewer (radians) instead of the facing's. */
  turn: number | null = null;

  constructor(readonly model: FigureModel) {
    this.mats = { body: bodyMaterial(), hull: hullMaterial(), screen: model.screen ? screenMaterial() : null };
    this.group.add(this.base);
    this.base.add(this.body);
    this.body.scale.setScalar(SCALE);
    for (const j of model.joints) {
      const o = new THREE.Object3D();
      o.name = j.id;
      if (j.order) o.rotation.order = j.order;
      o.position.set(j.at[0], j.at[1], j.at[2]);
      (j.parent ? this.joints.get(j.parent)! : this.body).add(o);
      this.joints.set(j.id, o);
      const geo = model.parts[j.id];
      if (!geo) continue;
      const b = new THREE.Mesh(geo, this.mats.body);
      b.castShadow = true;
      b.receiveShadow = true;
      o.add(b, new THREE.Mesh(geo, this.mats.hull));
    }
    if (model.screen && this.mats.screen) this.joints.get(model.screen.joint)?.add(new THREE.Mesh(model.screen.geo, this.mats.screen));
  }

  /** Poses the figure; dt (s) eases its turn (0 snaps). */
  apply(p: FigurePose, dt: number): void {
    const f = p.facing;
    const turn = this.turn ?? TURN_IDLE + (TURN_MOVE - TURN_IDLE) * Math.min(1, Math.abs(p.speed));
    const target = f > 0 ? -turn : turn - Math.PI;
    if (this.psi === null || dt <= 0) this.psi = target;
    else this.psi += Math.atan2(Math.sin(target - this.psi), Math.cos(target - this.psi)) * (1 - Math.exp(-10 * dt));
    const k0 = this.model.offsetScale.root ?? 1;
    const ro = p.offsets.root;
    this.base.position.set(f * (p.x + (ro?.x ?? 0)) * k0, -(p.y + (ro?.y ?? 0)) * k0, 0);
    this.base.rotation.z = -f * (p.angles.root ?? 0);
    this.body.rotation.y = this.psi;
    for (const j of this.model.joints) {
      if (!j.parent) continue;
      const o = this.joints.get(j.id)!;
      const off = p.offsets[j.id];
      const k = this.model.offsetScale[j.id] ?? 1;
      o.position.set(j.at[0] + (off ? off.x * k : 0), j.at[1] - (off ? off.y * k : 0), j.at[2]);
      o.rotation.z = -(p.angles[j.id] ?? 0);
    }
    const head = this.joints.get('head');
    if (head) head.rotation.y = (-Math.PI / 2 - this.psi) * HEAD_FOLLOW;
    this.face(p);
  }

  private face(p: FigurePose): void {
    const s = this.mats.screen;
    if (!s) return;
    const u = s.uniforms;
    const k = p.emoteK ?? 0;
    let glow = 1 + 0.04 * Math.sin(p.t * 2.1);
    if (p.emote === 'joy' || p.emote === 'relief') glow += 0.15 * k;
    else if (p.emote === 'worry' || p.emote === 'pain') glow -= 0.2 * k;
    u.uGlow!.value = glow;
    u.uBlink!.value = p.blink ?? 0;
    u.uFlash!.value = p.emote === 'surprise' || p.emote === 'shout' ? 0.6 * k : 0;
    u.uTalk!.value = p.emote === 'talk' || p.emote === 'shout' ? k * (0.5 + 0.5 * Math.sin(p.t * 18)) : 0;
  }

  /** An anchor's world position (the group's matrices must be current). */
  anchor(name: string, out: THREE.Vector3): THREE.Vector3 | null {
    const a = this.model.anchors[name];
    const j = a && this.joints.get(a.joint);
    if (!a || !j) return null;
    return j.localToWorld(out.set(a.at[0], a.at[1], a.at[2]));
  }

  setOpacity(a: number): void {
    setOpacity(this.mats.body, a);
    setOpacity(this.mats.hull, a);
    if (this.mats.screen) setOpacity(this.mats.screen, a);
  }

  /** Outline width (model units per unit of the hull normals). */
  setOutline(k: number): void {
    setHullScale(this.mats.hull, k);
  }

  /** Frees the materials (the geometry is shared per model). */
  dispose(): void {
    this.group.removeFromParent();
    this.mats.body.dispose();
    this.mats.hull.dispose();
    this.mats.screen?.dispose();
  }
}
