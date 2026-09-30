import * as THREE from 'three';
import { drawOrder, isNear, orderJoints, solve, type Angles, type Solved } from '../game/art/fk';
import type { RigDef, RigJoint } from '../game/art/rigTypes';
import { humanoidPose, type PoseOut, type PoseParams } from '../game/entities/animPoses';
import { cardMaterial, cardTexture, hasPart, partArt, rasterPart } from './art';
import { planeFor } from './cutout';
import { U } from './units';

// The game's cut-out rig as a paper puppet: every part is a textured card
// in a hierarchy of joints (fk.orderJoints), posed each frame by the game's
// own procedural poses (animPoses.humanoidPose) and eased per joint exactly
// like RigView does. Parts sit a hair apart in depth in the rig's draw
// order (fk.drawOrder), far-side limbs darker and behind, each with a
// darker backing as its card edge.

/** Per-joint smoothing rates (RigView): arms trail the body. */
const RATE: Record<string, number> = { armR: 11, armL: 10, foreR: 12, foreL: 11, head: 14, browN: 30 };
/** Parts on Gorti's screen that glow (not lit by the room). */
const GLOWING = new Set(['eyeN', 'browN', 'mouth']);
/** Depth between consecutive parts, scene units. */
const DZ = 0.007;
/** Raster resolution of the character (texels per world px). */
const RES = 4;
/** Card edge offset, world px (down-right, the light is upper left). */
const EDGE: [number, number] = [0.8, 1.1];

interface Node {
  joint: RigJoint;
  group: THREE.Group;
  mesh: THREE.Mesh | null;
  back: THREE.Mesh | null;
  near: THREE.Material | null;
  far: THREE.Material | null;
  /** Textures of the part and its shape variants ('' = the part itself). */
  shapes: Map<string, THREE.Texture>;
  shape: string;
}

export class PaperRig {
  /** At the feet; mirrors for facing, squashes and leans. */
  readonly root = new THREE.Group();
  readonly rig: RigDef;
  private readonly ordered: RigJoint[];
  private readonly nodes = new Map<string, Node>();
  private readonly solved = new Map<string, Solved>();
  private angles: Angles = {};
  private offsets: Record<string, { x: number; y: number }> = {};
  facing: 1 | -1 = 1;
  anim = 'idle';
  animT = 0;
  params: PoseParams = {};
  squashX = 1;
  squashY = 1;
  extraRot = 0;
  stiffness = 1;
  private orderFacing: 1 | -1 | 0 = 0;

  private constructor(rig: RigDef) {
    this.rig = rig;
    this.ordered = orderJoints(rig);
  }

  static async create(rig: RigDef): Promise<PaperRig> {
    const r = new PaperRig(rig);
    await r.build();
    r.snap();
    return r;
  }

  private async build(): Promise<void> {
    const textures = new Map<string, THREE.Texture>();
    const tex = async (key: string): Promise<THREE.Texture | null> => {
      if (!hasPart(key)) return null;
      const art = partArt(key);
      if (!art.body) return null;
      let t = textures.get(key);
      if (!t) {
        t = cardTexture(await rasterPart(art, RES));
        textures.set(key, t);
      }
      return t;
    };
    const inner = new THREE.Group();
    this.root.add(inner);
    for (const j of this.ordered) {
      const group = new THREE.Group();
      group.name = j.id;
      const parent = j.parent ? this.nodes.get(j.parent)!.group : inner;
      parent.add(group);
      const node: Node = { joint: j, group, mesh: null, back: null, near: null, far: null, shapes: new Map(), shape: '' };
      this.nodes.set(j.id, node);
      if (!j.part) continue;
      const base = await tex(j.part);
      if (!base) continue;
      node.shapes.set('', base);
      for (const v of ['happy', 'sad', 'shut', 'smile', 'open', 'grin', 'grit', 'frown']) {
        const t = await tex(`${j.part}.${v}`);
        if (t) node.shapes.set(v, t);
      }
      const art = partArt(j.part);
      const geo = planeFor(art.w, art.h, art.px / art.w, art.py / art.h);
      const glowing = GLOWING.has(j.id);
      node.near = cardMaterial(base, { unlit: glowing });
      // The far side of the body is a shade darker (the game's '.far' frames).
      node.far = j.side ? cardMaterial(base, { color: 0xd2ccd2 }) : node.near;
      node.mesh = new THREE.Mesh(geo, node.near);
      node.mesh.castShadow = !glowing;
      node.mesh.receiveShadow = !glowing;
      group.add(node.mesh);
      if (!glowing) {
        node.back = new THREE.Mesh(geo, cardMaterial(base, { color: 0x86767f }));
        node.back.receiveShadow = true;
        group.add(node.back);
      }
    }
  }

  /** Jump straight to the current pose (no easing). */
  snap(): void {
    const pose = humanoidPose(this.rig.id, this.anim, this.animT, this.params);
    this.angles = { ...pose.angles };
    this.offsets = {};
    for (const k of Object.keys(pose.offsets)) this.offsets[k] = { ...pose.offsets[k]! };
    this.layout(pose);
  }

  /** Puts the joints straight into a pose (the crouch at take-off). */
  snapTo(anim: string, params: PoseParams = {}): void {
    const pose = humanoidPose(this.rig.id, anim, 0, params);
    for (const j of this.ordered) this.angles[j.id] = pose.angles[j.id] ?? 0;
    for (const k of Object.keys(pose.offsets)) this.offsets[k] = { ...pose.offsets[k]! };
  }

  play(anim: string, params: PoseParams): void {
    if (anim !== this.anim) {
      this.anim = anim;
      this.animT = 0;
    }
    this.params = params;
  }

  update(dt: number): void {
    this.animT += dt;
    const pose = humanoidPose(this.rig.id, this.anim, this.animT, this.params);
    for (const j of this.ordered) {
      const target = pose.angles[j.id] ?? 0;
      const cur = this.angles[j.id] ?? 0;
      const r = (RATE[j.id] ?? 16) * this.stiffness;
      this.angles[j.id] = cur + (target - cur) * (1 - Math.exp(-r * dt));
      const to = pose.offsets[j.id];
      const co = this.offsets[j.id];
      if (to || co) {
        const c = co ?? { x: 0, y: 0 };
        const k = 1 - Math.exp(-18 * this.stiffness * dt);
        c.x += ((to?.x ?? 0) - c.x) * k;
        c.y += ((to?.y ?? 0) - c.y) * k;
        this.offsets[j.id] = c;
      }
    }
    this.layout(pose);
  }

  /** Depth order of the parts for the facing: near-side limbs in front. */
  private applyOrder(): void {
    if (this.orderFacing === this.facing) return;
    this.orderFacing = this.facing;
    const order = drawOrder(this.ordered, this.facing);
    // Every joint group sits at depth 0, so a part's z is its own.
    order.forEach((j, i) => {
      const n = this.nodes.get(j.id);
      if (!n?.mesh) return;
      n.mesh.position.z = i * DZ;
      if (n.back) n.back.position.z = i * DZ - DZ * 0.5;
      const near = isNear(j, this.facing);
      n.mesh.material = (near ? n.near : n.far)!;
    });
  }

  private layout(pose: PoseOut): void {
    this.applyOrder();
    solve(this.ordered, this.angles, this.offsets, this.solved);
    for (const j of this.ordered) {
      const n = this.nodes.get(j.id)!;
      const off = this.offsets[j.id];
      // Local joint transform (y down, clockwise angles → y up, CCW).
      n.group.position.set((j.x + (off?.x ?? 0)) * U, -(j.y + (off?.y ?? 0)) * U, 0);
      n.group.rotation.z = -(this.angles[j.id] ?? 0);
      if (!n.mesh) continue;
      const want = pose.frames?.[j.id] ?? '';
      const shape = n.shapes.has(want) ? want : '';
      if (shape !== n.shape) {
        n.shape = shape;
        const t = n.shapes.get(shape)!;
        for (const m of [n.near, n.far]) if (m && 'map' in m) (m as THREE.MeshLambertMaterial).map = t;
      }
      const sc = pose.scales?.[j.id];
      n.mesh.scale.set(sc?.x ?? 1, sc?.y ?? 1, 1);
      if (n.back) {
        // The edge shows down-right on screen whatever the part's rotation.
        const rot = this.solved.get(j.id)?.rot ?? 0;
        const ex = EDGE[0] * this.facing;
        const ey = EDGE[1];
        const c = Math.cos(rot);
        const s = Math.sin(rot);
        n.back.position.x = (ex * c + ey * s) * U;
        n.back.position.y = -(-ex * s + ey * c) * U;
        n.back.scale.copy(n.mesh.scale);
      }
    }
    const inner = this.root.children[0]!;
    inner.position.set((pose.x ?? 0) * U, -(pose.y ?? 0) * U, 0);
    this.root.scale.set(this.facing * (pose.sx ?? 1) * this.squashX, (pose.sy ?? 1) * this.squashY, 1);
    this.root.rotation.z = -this.extraRot * this.facing;
  }

  /** An attachment point (e.g. 'eye') in the rig's local frame, world px (y down). */
  attach(name: string): { x: number; y: number } {
    const a = this.rig.attach[name];
    const s = a ? this.solved.get(a.joint) : undefined;
    if (!a || !s) return { x: 0, y: 0 };
    const c = Math.cos(s.rot);
    const sn = Math.sin(s.rot);
    return { x: (s.x + a.x * c - a.y * sn) * this.facing, y: s.y + a.x * sn + a.y * c };
  }

  /** Total height of the figure, world px (from the feet to the head's top). */
  get height(): number {
    const head = this.solved.get('head');
    return head ? -head.y + 60 : 130;
  }
}
