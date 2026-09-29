import * as Phaser from 'phaser';
import { app } from '../App';
import {
  COHERENCE_SEGMENTS,
  COWARD_MOVE,
  COYOTE_MS,
  DEPTH,
  HULL_H,
  HULL_W,
  HUMAN_MOVE,
  INVULN_MS,
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
  halves = COHERENCE_SEGMENTS * 2;
  readonly maxHalves = COHERENCE_SEGMENTS * 2;
  invuln = 0;
  hurtLock = 0;
  private landT = 0;
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
    return this.state === 'normal' && this.hurtLock <= 0;
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
    if (this.invuln > 0) this.invuln -= dt * 1000;
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
    if (this.hurtLock > 0) {
      this.hurtLock -= dt;
      return;
    }
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
      this.rig.squashX = 0.9;
      this.rig.squashY = 1.1;
      app.audio.sfx('jump');
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
      this.landT = Math.min(0.22, 0.1 + this.maxFallVy / 4000);
      this.rig.squashX = 1.08;
      this.rig.squashY = 0.92;
      app.audio.sfx('land', { vol: Math.min(1, this.maxFallVy / 700) });
      this.scene.events.emit('player-land', this.x, this.feetY, this.maxFallVy);
    }
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

  // ------------------------------------------------------------ damage

  /** Returns true if the hit landed. */
  hurt(fromX: number, halves: number): boolean {
    if (this.invuln > 0 || this.state === 'reform' || this.state === 'hidden') return false;
    this.halves = Math.max(0, this.halves - halves);
    this.invuln = INVULN_MS;
    const dir = this.x >= fromX ? 1 : -1;
    if (this.state === 'reach') {
      this.reach = null;
      this.state = 'normal';
      this.body.setAllowGravity(true);
      this.body.checkCollision.none = false;
    }
    if (this.state === 'normal') {
      this.body.setVelocity(dir * 230, -300);
      this.hurtLock = 0.28;
      this.groundLock = 0.05;
    }
    this.rootLine.clear();
    this.emote('pain', 1100);
    app.audio.sfx('hurt');
    return true;
  }

  heal(): void {
    this.halves = this.maxHalves;
  }

  private emoteName: Emote = 'surprise';
  private emoteT = 0;

  /** Shows an emotion on the brows for a moment (layered over any pose). */
  emote(e: Emote, ms = 900): void {
    this.emoteName = e;
    this.emoteT = ms;
  }

  // ------------------------------------------------------------ visuals

  visual(dtMs: number): void {
    const b = this.body;
    const feet = this.feetY;
    this.rig.setPosition(this.x, feet);
    // Relax squash back toward 1.
    const k = 1 - Math.exp(-14 * (dtMs / 1000));
    this.rig.squashX += (1 - this.rig.squashX) * k;
    this.rig.squashY += (1 - this.rig.squashY) * k;
    const speed = Math.abs(b.velocity.x) / Math.max(1, this.tuning.speed);
    let anim = 'idle';
    const prm: PoseParams = {};
    // Momentary emotion (brows) fading over its duration.
    if (this.emoteT > 0) {
      this.emoteT -= dtMs;
      prm.emote = this.emoteName;
      prm.emoteK = Math.min(1, this.emoteT / 250);
    }
    if (this.forceAnim) anim = this.forceAnim;
    else if (this.state === 'reach') anim = this.reach?.phase === 0 ? 'reach' : 'pull';
    else if (this.state === 'song') anim = 'song';
    else if (this.state === 'transform') anim = 'transform';
    else if (this.state === 'reform') anim = 'collapse';
    else if (this.hurtLock > 0) anim = 'hurt';
    else if (!this.onGround) {
      anim = b.velocity.y < -40 ? 'rise' : 'fall';
      prm.vy = b.velocity.y;
    } else if (this.landT > 0) {
      anim = 'land';
      prm.k = 1 - this.landT / 0.22;
    } else if (Math.abs(b.velocity.x) > 12) {
      anim = this.pushing ? 'push' : 'walk';
      const strideLen = this.kind === 'gorti' && this.form === 'root' ? 124 : this.kind === 'suit' ? 70 : 92;
      this.walkPhase += (Math.abs(b.velocity.x) * dtMs) / 1000 / strideLen * Math.PI * 2;
      prm.phase = this.walkPhase;
      prm.speed = speed;
    } else if (this.focus.active) anim = 'breath';
    else if (this.interactT > 0) anim = 'interact';
    this.rig.play(anim, prm);
    this.rig.stiffness = anim === 'land' || anim === 'hurt' ? 2 : 1;
    this.rig.update(dtMs);
    // Invulnerability flicker (gentle, not a flash).
    this.rig.setAlpha(this.invuln > 0 && this.state !== 'reform' ? 0.55 + 0.35 * Math.sin(this.scene.time.now / 45) : 1);
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
