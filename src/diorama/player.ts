import { COYOTE_MS, GRAVITY, HULL_H, HULL_W, JUMP_BUFFER_MS, MAX_FALL, ROOT_MOVE } from '../game/constants';
import type { SolidDef } from '../game/data/roomTypes';
import type { PoseParams } from '../game/entities/animPoses';
import type { PaperRig } from './gorti';
import { sx, sy } from './units';

// Gorti's movement in r01: the game's own tuning (constants.ROOT_MOVE) and
// rules (Player.fixed: acceleration, coyote time, jump buffer, variable
// jump height, one-way furniture tops) on the room's solids, and the game's
// choice of animation, squash and stretch and lean (Player.visual). The
// diorama adds depth: standing on a piece of furniture, he stands at its
// depth, and he moves there in the air on the way up or down.

export interface Input {
  axis: number;
  jumpPressed: boolean;
  jumpHeld: boolean;
}

function approach(v: number, target: number, step: number): number {
  if (v < target) return Math.min(target, v + step);
  if (v > target) return Math.max(target, v - step);
  return v;
}

const T = ROOT_MOVE;
const HW = HULL_W / 2;

export class Hero {
  /** Feet position, room px (y down). */
  x: number;
  y: number;
  /** Depth (scene z) he stands at. */
  z = 0;
  vx = 0;
  vy = 0;
  facing: 1 | -1 = 1;
  onGround = true;
  /** Seconds standing still (drives the camera's slow push-in). */
  stillT = 0;
  private readonly solids: SolidDef[];
  private readonly platZ: Map<SolidDef, number>;
  private readonly width: number;
  private standing: SolidDef | null = null;
  private coyote = 0;
  private jumpBuffer = 0;
  private jumping = false;
  private groundLock = 0;
  private airTime = 0;
  private maxFallVy = 0;
  private landT = 0;
  private landDur = 0.2;
  private landImpact = 0;
  private jumpT = -1;
  private sq = 1;
  private sqV = 0;
  private walkPhase = 0;
  private stepN = 0;
  private lastVx = 0;
  private skidding = false;
  private visVx = 0;
  private accLean = 0;
  private idleT = 0;
  private blinkIn = 1.5;
  private blinkT = -1;
  private blinkAgain = false;
  private emoteT = 0;
  /** Stride per walk cycle (Player: 124 px × the child's shorter legs). */
  private readonly strideLen: number;
  /** Deterministic stand-in for Math.random (blinks), so runs repeat. */
  private seed = 7;

  constructor(
    readonly rig: PaperRig,
    solids: SolidDef[],
    platZ: Map<SolidDef, number>,
    x: number,
    y: number,
    roomWidth: number,
  ) {
    this.solids = solids;
    this.platZ = platZ;
    this.x = x;
    this.y = y;
    this.width = roomWidth;
    const joint = (id: string): number => rig.rig.joints.find((j) => j.id === id)?.y ?? 0;
    const leg = joint('shinR') + joint('footR');
    this.strideLen = 124 * Math.max(0.75, Math.min(1.4, leg / 46));
  }

  private rand(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  place(x: number, y: number, facing: 1 | -1): void {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.facing = facing;
    this.onGround = true;
    this.jumpT = -1;
    this.landT = 0;
    this.sq = 1;
    this.sqV = 0;
    this.standing = this.groundAt(x, y);
    this.z = this.zFor(this.standing);
    this.rig.facing = facing;
    this.rig.snap();
  }

  // ------------------------------------------------------------ fixed step

  fixed(dt: number, input: Input): void {
    if (this.groundLock > 0) this.groundLock -= dt;
    if (!this.onGround) {
      this.airTime += dt;
      this.maxFallVy = Math.max(this.maxFallVy, this.vy);
    }
    this.coyote = this.onGround ? COYOTE_MS / 1000 : this.coyote - dt;
    if (this.landT > 0) this.landT -= dt;
    if (this.jumpT >= 0) this.jumpT += dt;
    const axis = input.axis;
    if (input.jumpPressed) this.jumpBuffer = JUMP_BUFFER_MS / 1000;
    else this.jumpBuffer -= dt;

    const target = axis * T.speed;
    let accel = this.onGround ? (axis !== 0 ? T.accel : T.decel) : axis !== 0 ? T.airAccel : T.airDecel;
    if (axis !== 0 && Math.sign(this.vx) === -axis) accel = Math.max(accel, T.decel);
    this.vx = approach(this.vx, target, accel * dt);
    if (axis !== 0) this.facing = axis > 0 ? 1 : -1;

    if (this.jumpBuffer > 0 && this.coyote > 0) {
      this.vy = -T.jumpVel;
      this.jumpBuffer = 0;
      this.coyote = 0;
      this.jumping = true;
      this.groundLock = 0.06;
      this.onGround = false;
      this.standing = null;
      this.airTime = 0;
      this.maxFallVy = 0;
      this.landT = 0;
      this.jumpT = 0;
      this.sq = 0.86;
      this.sqV = 6;
      this.rig.snapTo('crouch');
    }
    if (this.jumping && !input.jumpHeld && this.vy < 0) {
      this.vy *= T.jumpCut;
      this.jumping = false;
    }
    if (this.vy >= 0) this.jumping = false;

    const vx = Math.abs(this.vx);
    if (this.onGround && axis === 0 && this.lastVx > T.speed * 0.6 && vx < this.lastVx - 1) {
      if (!this.skidding) {
        this.skidding = true;
        this.sqV -= 1.1;
      }
    } else if (vx < 5 || axis !== 0) this.skidding = false;
    this.lastVx = vx;

    this.vy = Math.min(MAX_FALL, this.vy + GRAVITY * dt);
    this.move(dt);
    // Depth: the furniture he stands on (or is about to land on).
    const under = this.onGround ? this.standing : this.vy > -200 ? this.groundAt(this.x, this.y) : null;
    const zt = this.onGround ? this.zFor(this.standing) : under ? this.zFor(under) : this.z;
    this.z += (zt - this.z) * (1 - Math.exp(-(this.onGround ? 14 : 7) * dt));
  }

  private zFor(s: SolidDef | null): number {
    return s ? (this.platZ.get(s) ?? 0) : 0;
  }

  /** The surface below the feet (the highest top at or under y), if any. */
  private groundAt(x: number, y: number): SolidDef | null {
    let best: SolidDef | null = null;
    for (const s of this.solids) {
      if (x + HW <= s.x || x - HW >= s.x + s.w || s.y < y - 0.5) continue;
      if (!best || s.y < best.y) best = s;
    }
    return best;
  }

  private overlaps(s: SolidDef, x: number, y: number): boolean {
    return x + HW > s.x && x - HW < s.x + s.w && y > s.y && y - HULL_H < s.y + s.h;
  }

  private move(dt: number): void {
    // Across: walls stop him.
    this.x += this.vx * dt;
    for (const s of this.solids) {
      if (s.oneWay || !this.overlaps(s, this.x, this.y)) continue;
      if (this.vx > 0) this.x = s.x - HW;
      else if (this.vx < 0) this.x = s.x + s.w + HW;
      this.vx = 0;
    }
    this.x = Math.max(HW, Math.min(this.width - HW, this.x));
    // Down (and up): floors, furniture tops from above, ceilings.
    const prevY = this.y;
    this.y += this.vy * dt;
    let landed: SolidDef | null = null;
    for (const s of this.solids) {
      if (this.x + HW <= s.x || this.x - HW >= s.x + s.w) continue;
      if (this.vy >= 0 && prevY <= s.y + 0.5 && this.y >= s.y) {
        if (!landed || s.y < landed.y) landed = s;
      } else if (!s.oneWay && this.vy < 0 && this.overlaps(s, this.x, this.y) && prevY - HULL_H >= s.y + s.h - 0.5) {
        this.y = s.y + s.h + HULL_H;
        this.vy = 0;
      }
    }
    const wasGround = this.onGround;
    if (landed && this.groundLock <= 0) {
      this.y = landed.y;
      this.vy = 0;
      this.onGround = true;
      this.standing = landed;
      if (!wasGround) this.landed();
    } else {
      this.onGround = false;
      this.standing = null;
    }
  }

  private landed(): void {
    if (this.airTime > 0.12 && this.maxFallVy > 180) {
      const i = Math.min(1, (this.maxFallVy - 180) / 720);
      this.landImpact = i;
      this.landDur = 0.14 + 0.2 * i;
      this.landT = this.landDur;
      this.sq = 1 - (0.06 + 0.14 * i);
      this.sqV = -1.2 * i;
      if (i > 0.55) this.emoteT = 0.38;
    }
    this.jumpT = -1;
    this.airTime = 0;
    this.maxFallVy = 0;
  }

  // ------------------------------------------------------------ visuals

  visual(dt: number): void {
    const airborne = !this.onGround;
    const stretch = airborne ? 1 + Math.min(0.06, Math.abs(this.vy) / 10000) : 1;
    this.sqV += ((stretch - this.sq) * 320 - this.sqV * 15) * dt;
    this.sq += this.sqV * dt;
    const rig = this.rig;
    rig.squashY = this.sq;
    rig.squashX = 1 + (1 - this.sq) * 0.85;
    const speed = Math.abs(this.vx) / T.speed;
    let anim = 'idle';
    const prm: PoseParams = {};
    if (this.emoteT > 0) {
      this.emoteT -= dt;
      prm.emote = 'effort';
      prm.emoteK = Math.min(1, this.emoteT / 0.25);
    }
    if (this.blinkT >= 0) {
      this.blinkT += dt;
      if (this.blinkT > 0.15) {
        this.blinkT = -1;
        this.blinkIn = this.blinkAgain ? 0.09 : 2.2 + this.rand() * 3.6;
        this.blinkAgain = !this.blinkAgain && this.rand() < 0.22;
      }
    } else if ((this.blinkIn -= dt) <= 0) this.blinkT = 0;
    if (this.blinkT >= 0) prm.blink = 1 - Math.abs(this.blinkT / 0.075 - 1);
    if (airborne) {
      prm.vy = this.vy;
      prm.jv = T.jumpVel;
      if (this.jumpT < 0) anim = 'fall';
      else if (this.jumpT < 0.13) anim = 'takeoff';
      else if (this.vy < -140) anim = 'rise';
      else if (this.vy < 150) anim = 'apex';
      else anim = 'fall';
    } else if (this.landT > 0 && !(Math.abs(this.vx) > 60 && this.landDur - this.landT > 0.08)) {
      anim = 'land';
      prm.k = 1 - this.landT / this.landDur;
      prm.impact = this.landImpact;
    } else if (Math.abs(this.vx) > 12) {
      anim = 'walk';
      this.walkPhase += ((Math.abs(this.vx) * dt) / this.strideLen) * Math.PI * 2;
      prm.phase = this.walkPhase;
      prm.speed = speed;
      const n = Math.floor((this.walkPhase - Math.PI / 2) / Math.PI);
      if (n !== this.stepN) {
        // A footfall: the body gives a little.
        this.stepN = n;
        this.sqV -= 0.55;
      }
    }
    this.idleT = anim === 'idle' ? this.idleT + dt : 0;
    this.stillT = anim === 'idle' || anim === 'land' ? this.stillT + dt : 0;
    prm.idleT = this.idleT;
    rig.facing = this.facing;
    rig.play(anim, prm);
    rig.stiffness = anim === 'takeoff' ? 2.6 : anim === 'land' ? 2 : anim === 'apex' ? 0.85 : 1;
    const run = Math.min(1, Math.abs(this.vx) / T.speed);
    let lean = airborne ? (this.vy < -140 ? -0.05 : this.vy > 150 ? 0.08 : 0.02) * run : 0;
    if (!airborne) {
      const acc = (Math.abs(this.vx) - this.visVx) / Math.max(0.001, dt);
      this.accLean += (Math.max(-0.1, Math.min(0.1, acc / 5200)) - this.accLean) * (1 - Math.exp(-12 * dt));
      lean += this.skidding ? -0.07 : this.accLean;
    }
    this.visVx = Math.abs(this.vx);
    rig.extraRot += (lean - rig.extraRot) * (1 - Math.exp(-10 * dt));
    rig.update(dt);
    rig.root.position.set(sx(this.x), sy(this.y), this.z);
  }

  /** How high above the surface below he is, px (for his contact shadow). */
  heightAboveGround(): { ground: number; h: number } {
    const g = this.groundAt(this.x, this.y);
    const ground = g ? g.y : 660;
    return { ground, h: Math.max(0, ground - this.y) };
  }

  /** Depth of the surface under him (where his contact shadow lies). */
  groundZ(): number {
    return this.zFor(this.groundAt(this.x, this.y));
  }
}
