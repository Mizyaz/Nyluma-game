import * as Phaser from 'phaser';
import { app } from '../App';
import {
  COWARD_MOVE,
  COYOTE_MS,
  DEPTH,
  HULL_H,
  HULL_W,
  HUMAN_MOVE,
  JUMP_BUFFER_MS,
  MAX_FALL,
  MECH_MOVE,
  ROOT_MOVE,
  SUIT_MOVE,
  type MoveTuning,
} from '../constants';
import type { RigDef } from '../art/rigTypes';
import { RIG_GORTI_HUMAN, RIG_GORTI_ROOT, RIG_GORTI_SUIT } from '../art/characters/gorti';
import { RIG_COWARD, RIG_MECH } from '../art/characters/forms';
import { FocusMeter, bezier } from '../systems/AbilitySystem';
import type { FormId, PlayerKind } from '../state/types';
import { humanoidPose, type Emote, type PoseParams } from './animPoses';
import { RigView } from './RigView';

export type PState = 'normal' | 'reach' | 'song' | 'locked' | 'transform' | 'reform' | 'hidden';

export interface ReachPlan {
  anchor: { x: number; y: number };
  land: { x: number; y: number };
  onDone?: () => void;
}

function approach(v: number, target: number, step: number): number {
  if (v < target) return Math.min(target, v + step);
  if (v > target) return Math.max(target, v - step);
  return v;
}

export function rigFor(kind: PlayerKind, form: FormId): RigDef {
  if (kind === 'coward') return RIG_COWARD;
  if (kind === 'mech') return RIG_MECH;
  if (kind === 'suit') return RIG_GORTI_SUIT;
  return form === 'human' ? RIG_GORTI_HUMAN : RIG_GORTI_ROOT;
}

export function tuningFor(kind: PlayerKind, form: FormId): MoveTuning {
  if (kind === 'coward') return COWARD_MOVE;
  if (kind === 'mech') return MECH_MOVE;
  if (kind === 'suit') return SUIT_MOVE;
  return form === 'human' ? HUMAN_MOVE : ROOT_MOVE;
}

/**
 * The controllable body (Gorti's forms and the inner forms). Movement runs on
 * the physics fixed step; the cutout rig is animated per rendered frame.
 */
export class Player {
  readonly zone: Phaser.GameObjects.Zone;
  readonly body: Phaser.Physics.Arcade.Body;
  readonly rig: RigView;
  kind: PlayerKind;
  form: FormId;
  tuning: MoveTuning;
  facing: 1 | -1 = 1;
  state: PState = 'normal';
  onGround = false;
  private airTime = 0;
  private maxFallVy = 0;
  private coyote = 0;
  private jumpBuffer = 0;
  private jumping = false;
  private groundLock = 0;
  private landT = 0;
  private landDur = 0.2;
  private landImpact = 0;
  /** Seconds since the last take-off (-1 while not in a jump). */
  private jumpT = -1;
  /** Whole-body squash and stretch: a damped spring around 1. */
  private sq = 1;
  private sqV = 0;
  private walkPhase = 0;
  private stepAcc = 0;
  readonly focus = new FocusMeter();
  pulseCd = 0;
  interactT = 0;
  /** Scripted pose override while locked (e.g. 'kneel', 'shout'). */
  forceAnim: string | null = null;
  pushing = false;
  pushSpeed = 72;
  private reach: (ReachPlan & { t: number; phase: 0 | 1; from: { x: number; y: number }; dur: number }) | null = null;
  private rootLine: Phaser.GameObjects.Graphics;
  private scene: Phaser.Scene;
  /** Extra fixed-step hook for held/pressed input used by scripts. */
  canJump = true;
  speedScale = 1;

  constructor(scene: Phaser.Scene, x: number, feetY: number, kind: PlayerKind, form: FormId) {
    this.scene = scene;
    this.kind = kind;
    this.form = kind === 'gorti' ? form : 'root';
    this.tuning = tuningFor(kind, this.form);
    this.zone = scene.add.zone(x, feetY - HULL_H / 2, HULL_W, HULL_H);
    scene.physics.add.existing(this.zone);
    this.body = this.zone.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocityY(MAX_FALL);
    this.rig = new RigView(scene, rigFor(kind, this.form), (a, t, p, id) => humanoidPose(id, a, t, p), x, feetY, DEPTH.player);
    this.rootLine = scene.add.graphics().setDepth(DEPTH.player - 1);
    if (kind === 'suit') this.canJump = false;
  }

  get x(): number {
    return this.zone.x;
  }

  get feetY(): number {
    return this.zone.y + HULL_H / 2;
  }

  chest(): { x: number; y: number } {
    return { x: this.zone.x + this.facing * 4, y: this.zone.y - 12 };
  }

  get controllable(): boolean {
    return this.state === 'normal';
  }

  teleport(x: number, feetY: number, facing?: 1 | -1): void {
    this.body.reset(x, feetY - HULL_H / 2);
    if (facing) this.setFacing(facing);
    this.onGround = false;
    this.airTime = 0;
    this.maxFallVy = 0;
    this.coyote = 0;
    this.jumpBuffer = 0;
    this.jumping = false;
    this.jumpT = -1;
    this.landT = 0;
    this.sq = 1;
    this.sqV = 0;
    this.rig.squashX = 1;
    this.rig.squashY = 1;
    this.rig.extraRot = 0;
    this.rig.setPosition(x, feetY);
    this.rig.snap();
  }

  setFacing(f: 1 | -1): void {
    this.facing = f;
    this.rig.setFacing(f);
  }

  setForm(form: FormId): void {
    if (this.kind !== 'gorti') return;
    this.form = form;
    this.tuning = tuningFor(this.kind, form);
    this.rig.setRig(rigFor(this.kind, form));
    this.rig.setFacing(this.facing);
  }

  setKind(kind: PlayerKind, form: FormId = 'root'): void {
    this.kind = kind;
    this.form = kind === 'gorti' ? form : 'root';
    this.tuning = tuningFor(kind, this.form);
    this.canJump = kind !== 'suit';
    this.rig.setRig(rigFor(kind, this.form));
    this.rig.setFacing(this.facing);
  }

  lock(on: boolean, anim: string | null = null): void {
    if (on) {
      if (this.state === 'normal') this.state = 'locked';
      this.forceAnim = anim;
      this.pushing = false;
    } else {
      if (this.state === 'locked') this.state = 'normal';
      this.forceAnim = null;
    }
  }

  // ------------------------------------------------------------ fixed step

  fixed(dt: number, input: { axis: number; jumpPressed: boolean; jumpHeld: boolean }): void {
    const b = this.body;
    if (this.pulseCd > 0) this.pulseCd -= dt * 1000;
    if (this.interactT > 0) this.interactT -= dt;
    if (this.state === 'reach') {
      this.stepReach(dt);
      return;
    }
    const grounded = (b.blocked.down || b.touching.down) && b.velocity.y >= -1;
    if (this.groundLock > 0) {
      this.groundLock -= dt;
      this.onGround = false;
    } else {
      if (grounded && !this.onGround) this.landed();
      this.onGround = grounded;
    }
    if (!this.onGround) {
      this.airTime += dt;
      this.maxFallVy = Math.max(this.maxFallVy, b.velocity.y);
    }
    this.coyote = this.onGround ? COYOTE_MS / 1000 : this.coyote - dt;
    if (this.landT > 0) this.landT -= dt;
    if (this.jumpT >= 0) this.jumpT += dt;
    const canMove = this.state === 'normal';
    const axis = canMove ? input.axis : 0;
    if (input.jumpPressed && canMove) this.jumpBuffer = JUMP_BUFFER_MS / 1000;
    else this.jumpBuffer -= dt;

    const t = this.tuning;
    const max = (this.pushing ? this.pushSpeed : t.speed) * this.speedScale;
    const target = axis * max;
    let accel: number;
    if (this.onGround) accel = axis !== 0 ? t.accel : t.decel;
    else accel = axis !== 0 ? t.airAccel : t.airDecel;
    // Turning around on the ground uses the stronger deceleration.
    if (axis !== 0 && Math.sign(b.velocity.x) === -axis) accel = Math.max(accel, t.decel);
    b.velocity.x = approach(b.velocity.x, target, accel * dt);
    if (axis !== 0) this.setFacing(axis > 0 ? 1 : -1);

    if (this.canJump && this.jumpBuffer > 0 && this.coyote > 0 && t.jumpVel > 0) {
      b.velocity.y = -t.jumpVel;
      this.jumpBuffer = 0;
      this.coyote = 0;
      this.jumping = true;
      this.groundLock = 0.06;
      this.onGround = false;
      this.airTime = 0;
      this.maxFallVy = 0;
      this.landT = 0;
      // Visual only (the physics above already left the ground): the body
      // snaps into a crouch and springs open, squashed then stretched.
      this.jumpT = 0;
      this.sq = 0.86;
      this.sqV = 6;
      this.rig.snapTo('crouch');
      app.audio.sfx('jump');
      this.scene.events.emit('player-jump', this.x, this.feetY);
    }
    if (this.jumping && !input.jumpHeld && b.velocity.y < 0) {
      b.velocity.y *= t.jumpCut;
      this.jumping = false;
    }
    if (b.velocity.y >= 0) this.jumping = false;

    // Footsteps
    if (this.onGround && Math.abs(b.velocity.x) > 30) {
      this.stepAcc += Math.abs(b.velocity.x) * dt;
      const stride = this.kind === 'gorti' && this.form === 'root' ? 62 : 48;
      if (this.stepAcc > stride) {
        this.stepAcc = 0;
        this.footstep();
      }
    }
  }

  private footstep(): void {
    const theme = (this.scene as unknown as { stepSound?: () => 'step' | 'stepWood' | 'stepMetal' }).stepSound?.() ?? 'step';
    app.audio.sfx(theme, { vol: this.form === 'human' || this.kind === 'suit' ? 1 : 0.7, pitch: 0.9 + Math.random() * 0.2 });
    this.scene.events.emit('player-step', this.x, this.feetY);
  }

  private landed(): void {
    if (this.airTime > 0.12 && this.maxFallVy > 180) {
      // Knees and body absorb the drop, deeper and longer the harder it was.
      const i = Math.min(1, (this.maxFallVy - 180) / 720);
      this.landImpact = i;
      this.landDur = 0.14 + 0.2 * i;
      this.landT = this.landDur;
      this.sq = 1 - (0.06 + 0.14 * i);
      this.sqV = -1.2 * i;
      if (i > 0.55) this.emote('effort', 380);
      app.audio.sfx('land', { vol: Math.min(1, this.maxFallVy / 700) });
      this.scene.events.emit('player-land', this.x, this.feetY, this.maxFallVy);
    }
    this.jumpT = -1;
    this.airTime = 0;
    this.maxFallVy = 0;
  }

  // ------------------------------------------------------------ root reach

  startReach(plan: ReachPlan): void {
    this.reach = { ...plan, t: 0, phase: 0, from: { x: this.x, y: this.feetY }, dur: 0.16 };
    this.state = 'reach';
    this.body.setAllowGravity(false);
    this.body.checkCollision.none = true;
    this.body.setVelocity(0, 0);
    this.setFacing(plan.anchor.x >= this.x ? 1 : -1);
    app.audio.sfx('root');
  }

  private stepReach(dt: number): void {
    const r = this.reach;
    if (!r) {
      this.state = 'normal';
      return;
    }
    r.t += dt;
    if (r.phase === 0) {
      this.body.reset(r.from.x, r.from.y - HULL_H / 2);
      if (r.t >= r.dur) {
        r.phase = 1;
        r.t = 0;
        const d = Math.hypot(r.land.x - r.from.x, r.land.y - r.from.y);
        r.dur = Math.min(0.62, Math.max(0.32, d / 650));
      }
      return;
    }
    const k = Math.min(1, r.t / r.dur);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const ctrl = { x: r.anchor.x, y: r.anchor.y + 20 };
    const p = bezier(r.from, ctrl, r.land, e);
    this.body.reset(p.x, p.y - HULL_H / 2);
    if (k >= 1) {
      const done = r.onDone;
      this.reach = null;
      this.state = 'normal';
      this.body.setAllowGravity(true);
      this.body.checkCollision.none = false;
      this.body.reset(r.land.x, r.land.y - HULL_H / 2 - 1);
      this.landT = 0.12;
      app.audio.sfx('land', { vol: 0.5 });
      done?.();
    }
  }

  /** Draws the extending root between hand and anchor. */
  private drawRoot(): void {
    const g = this.rootLine;
    g.clear();
    const r = this.reach;
    if (!r) return;
    const hand = this.rig.attachPoint(this.facing === 1 ? 'handR' : 'handR');
    let tx = r.anchor.x;
    let ty = r.anchor.y;
    if (r.phase === 0) {
      const k = Math.min(1, r.t / r.dur);
      tx = hand.x + (r.anchor.x - hand.x) * k;
      ty = hand.y + (r.anchor.y - hand.y) * k;
    }
    const mx = (hand.x + tx) / 2;
    const my = (hand.y + ty) / 2 + 10;
    const path = new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(hand.x, hand.y), new Phaser.Math.Vector2(mx, my), new Phaser.Math.Vector2(tx, ty));
    const pts = path.getPoints(14);
    g.lineStyle(9, 0x191728, 1);
    g.strokePoints(pts, false);
    g.lineStyle(5, 0x625166, 1);
    g.strokePoints(pts, false);
    g.lineStyle(1.5, 0x9459d8, 0.9);
    g.strokePoints(pts, false);
  }

  private emoteName: Emote = 'surprise';
  private emoteT = 0;
  private blinkIn = 1.5;
  private blinkT = -1;
  private blinkAgain = false;
  private idleT = 0;
  private danceT = 0;
  private gazeTo = 0;
  private gazeT = 0;
  private gaze = 0;

  /** Shows an emotion on the face for a moment (layered over any pose). */
  emote(e: Emote, ms = 900): void {
    this.emoteName = e;
    this.emoteT = ms;
  }

  /** A little dance while standing (e.g. in the colour storm). */
  dance(ms: number): void {
    this.danceT = Math.max(this.danceT, ms / 1000);
  }

  /** Turns the head for a while (negative looks up). */
  lookFor(angle: number, ms: number): void {
    this.gazeTo = angle;
    this.gazeT = ms / 1000;
  }

  // ------------------------------------------------------------ visuals

  visual(dtMs: number): void {
    const b = this.body;
    const feet = this.feetY;
    const dt = Math.min(dtMs, 50) / 1000;
    this.rig.setPosition(this.x, feet);
    const airborne = !this.onGround && this.state === 'normal';
    // Squash and stretch: a springy body that stretches with fall speed and
    // wobbles back after take-off and landing. Scaled at the feet.
    const stretch = airborne ? 1 + Math.min(0.06, Math.abs(b.velocity.y) / 10000) : 1;
    this.sqV += ((stretch - this.sq) * 320 - this.sqV * 15) * dt;
    this.sq += this.sqV * dt;
    this.rig.squashY = this.sq;
    this.rig.squashX = 1 + (1 - this.sq) * 0.85;
    const speed = Math.abs(b.velocity.x) / Math.max(1, this.tuning.speed);
    let anim = 'idle';
    const prm: PoseParams = {};
    // Momentary emotion (brows) fading over its duration.
    if (this.emoteT > 0) {
      this.emoteT -= dtMs;
      prm.emote = this.emoteName;
      prm.emoteK = Math.min(1, this.emoteT / 250);
    }
    // Blinks every few seconds, sometimes twice.
    if (this.blinkT >= 0) {
      this.blinkT += dt;
      if (this.blinkT > 0.15) {
        this.blinkT = -1;
        this.blinkIn = this.blinkAgain ? 0.09 : 2.2 + Math.random() * 3.6;
        this.blinkAgain = !this.blinkAgain && Math.random() < 0.22;
      }
    } else if ((this.blinkIn -= dt) <= 0) this.blinkT = 0;
    if (this.blinkT >= 0) prm.blink = 1 - Math.abs(this.blinkT / 0.075 - 1);
    // Head turns asked for by the world (looking up at a colour storm).
    if (this.gazeT > 0) this.gazeT -= dt;
    this.gaze += ((this.gazeT > 0 ? this.gazeTo : 0) - this.gaze) * (1 - Math.exp(-5 * dt));
    if (Math.abs(this.gaze) > 0.005) prm.look = this.gaze;
    if (this.danceT > 0) this.danceT -= dt;
    if (this.forceAnim) anim = this.forceAnim;
    else if (this.state === 'reach') anim = this.reach?.phase === 0 ? 'reach' : 'pull';
    else if (this.state === 'song') anim = 'song';
    else if (this.state === 'transform') anim = 'transform';
    else if (this.state === 'reform') anim = 'collapse';
    else if (!this.onGround) {
      const vy = b.velocity.y;
      prm.vy = vy;
      prm.jv = this.tuning.jumpVel || 600;
      // Take-off, climb, a weightless moment at the top, then the drop.
      // Stepping off a ledge goes straight to the drop.
      if (this.jumpT < 0) anim = 'fall';
      else if (this.jumpT < 0.13) anim = 'takeoff';
      else if (vy < -140) anim = 'rise';
      else if (vy < 150) anim = 'apex';
      else anim = 'fall';
    } else if (this.landT > 0 && !(Math.abs(b.velocity.x) > 60 && this.landDur - this.landT > 0.08)) {
      anim = 'land';
      prm.k = 1 - this.landT / this.landDur;
      prm.impact = this.landImpact;
    } else if (Math.abs(b.velocity.x) > 12) {
      anim = this.pushing ? 'push' : 'walk';
      const strideLen = this.kind === 'gorti' && this.form === 'root' ? 124 : this.kind === 'suit' ? 70 : 92;
      this.walkPhase += (Math.abs(b.velocity.x) * dtMs) / 1000 / strideLen * Math.PI * 2;
      prm.phase = this.walkPhase;
      prm.speed = speed;
    } else if (this.focus.active) anim = 'breath';
    else if (this.interactT > 0) anim = 'interact';
    else if (this.danceT > 0 && this.state === 'normal') anim = 'dance';
    // Standing still for a while brings idle actions (see animPoses).
    this.idleT = anim === 'idle' && this.state === 'normal' ? this.idleT + dt : 0;
    prm.idleT = this.idleT;
    this.rig.play(anim, prm);
    this.rig.stiffness = anim === 'takeoff' ? 2.6 : anim === 'land' ? 2 : anim === 'apex' ? 0.85 : 1;
    // Lean into the flight: back while climbing, forward while dropping.
    const run = Math.min(1, Math.abs(b.velocity.x) / Math.max(1, this.tuning.speed));
    const lean = airborne ? (b.velocity.y < -140 ? -0.05 : b.velocity.y > 150 ? 0.08 : 0.02) * run : 0;
    this.rig.extraRot += (lean - this.rig.extraRot) * (1 - Math.exp(-10 * dt));
    this.rig.update(dtMs);
    if (this.state === 'reach') this.drawRoot();
    else this.rootLine.clear();
  }

  setVisible(v: boolean): void {
    this.rig.setVisible(v);
  }

  destroy(): void {
    this.rig.destroy();
    this.rootLine.destroy();
    this.zone.destroy();
  }
}
