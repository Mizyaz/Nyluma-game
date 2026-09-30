import * as THREE from 'three';
import type { Hero } from './player';
import { sx, sy } from './units';

// A camera like an operator's on a model set: it follows Gorti with a
// little lag and looks a step ahead of him, swings a few degrees toward
// where he is going (so the cards show their edges and the layers slide
// past each other), pulls back a touch while he runs and slowly pushes in
// when he stops. Dragging the view swings it by hand.

const smooth = (rate: number, dt: number): number => 1 - Math.exp(-rate * dt);

export interface CamPose {
  /** Point looked at, scene units. */
  target: THREE.Vector3;
  /** Distance from it. */
  dist: number;
  /** Swing around the vertical axis and pitch (radians, negative looks down). */
  yaw: number;
  pitch: number;
  roll: number;
  fov: number;
}

export class FollowCam {
  readonly camera: THREE.PerspectiveCamera;
  /** Where the camera looks (smoothed focus on Gorti). */
  readonly focus = new THREE.Vector3();
  /** Distance from the camera to Gorti (the depth of field's focus). */
  focusDist = 8;
  /** 'follow' tracks Gorti; 'wide' frames the nursery; 'fixed' is set from outside. */
  mode: 'follow' | 'wide' | 'fixed' = 'follow';
  /** Hand-held swing from dragging (radians), eased back when let go. */
  dragYaw = 0;
  dragPitch = 0;
  dragging = false;
  fixedPose: CamPose | null = null;
  private yaw = 0;
  private roll = 0;
  private dist = 8.8;
  private lookX = 0;
  private fx = 0;
  private fy = 0;
  private fz = 0;
  private t = 0;
  private fov = 30;
  private readonly bounds: [number, number];

  constructor(aspect: number, roomX0: number, roomX1: number) {
    this.camera = new THREE.PerspectiveCamera(this.fov, aspect, 0.1, 80);
    this.bounds = [roomX0, roomX1];
  }

  /** Jumps to the resting framing of Gorti (no easing). */
  snap(hero: Hero): void {
    this.fx = sx(hero.x);
    this.fy = sy(hero.y) + 0.85;
    this.fz = hero.z;
    this.lookX = 0;
    this.yaw = 0;
    this.roll = 0;
    this.dist = 8.8;
    this.update(hero, 0);
  }

  update(hero: Hero, dt: number): void {
    this.t += dt;
    let pose: CamPose;
    if (this.mode === 'fixed' && this.fixedPose) pose = this.fixedPose;
    else if (this.mode === 'wide') pose = this.widePose();
    else pose = this.followPose(hero, dt);
    // Hand-held swing on top of any framing.
    if (!this.dragging) {
      const k = smooth(1.6, dt);
      this.dragYaw -= this.dragYaw * k;
      this.dragPitch -= this.dragPitch * k;
    }
    this.apply(pose, this.dragYaw, this.dragPitch);
    this.focusDist = this.camera.position.distanceTo(new THREE.Vector3(sx(hero.x), sy(hero.y) + 0.7, hero.z));
  }

  private followPose(hero: Hero, dt: number): CamPose {
    const speed = Math.min(1, Math.abs(hero.vx) / 235);
    // Look a step ahead of him in the direction he is going.
    this.lookX += (hero.facing * 0.55 * speed - this.lookX) * smooth(1.8, dt);
    const [x0, x1] = this.bounds;
    const tx = Math.max(x0, Math.min(x1, sx(hero.x) + this.lookX));
    // Vertical: a lazy follow, so a jump plays inside the frame.
    const ty = sy(hero.y) + 0.85 - (hero.onGround ? 0 : 0.35);
    this.fx += (tx - this.fx) * smooth(3.2, dt);
    this.fy += (ty - this.fy) * smooth(hero.onGround ? 2.6 : 1.2, dt);
    this.fz += (hero.z * 0.6 - this.fz) * smooth(2.5, dt);
    // Swing toward the motion, a slight roll into it.
    const dir = hero.vx / 235;
    this.yaw += (-0.075 * dir - this.yaw) * smooth(1.4, dt);
    this.roll += (0.006 * dir - this.roll) * smooth(1.6, dt);
    // Pull back while he runs, push in once he has stood still a moment.
    const still = Math.min(1, Math.max(0, (hero.stillT - 0.6) / 2.2));
    const want = 8.8 + 0.55 * speed - 1.15 * still * still * (3 - 2 * still);
    this.dist += (want - this.dist) * smooth(still > 0 ? 0.9 : 1.8, dt);
    // Breathing drift, like a camera held by hand.
    const drift = 0.012 * Math.sin(this.t * 0.37) + 0.006 * Math.sin(this.t * 0.83 + 1.3);
    return {
      target: new THREE.Vector3(this.fx, this.fy, this.fz),
      dist: this.dist,
      yaw: 0.03 + this.yaw + drift,
      pitch: -0.14 + 0.008 * Math.sin(this.t * 0.29),
      roll: this.roll,
      fov: this.fov,
    };
  }

  private widePose(): CamPose {
    return { target: new THREE.Vector3(sx(930), 2.6, -0.4), dist: 19.5, yaw: 0.0, pitch: -0.12, roll: 0, fov: 34 };
  }

  private apply(p: CamPose, dyaw: number, dpitch: number): void {
    const yaw = p.yaw + dyaw;
    const pitch = p.pitch + dpitch;
    this.focus.copy(p.target);
    const c = this.camera;
    c.position.set(
      p.target.x + Math.sin(yaw) * Math.cos(pitch) * p.dist,
      p.target.y - Math.sin(pitch) * p.dist,
      p.target.z + Math.cos(yaw) * Math.cos(pitch) * p.dist,
    );
    c.up.set(Math.sin(p.roll), Math.cos(p.roll), 0);
    c.lookAt(p.target);
    if (c.fov !== p.fov) {
      c.fov = p.fov;
      c.updateProjectionMatrix();
    }
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
