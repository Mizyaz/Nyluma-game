import * as Phaser from 'phaser';
import { app } from '../engine/App';
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
} from '../engine/constants';
import type { RigDef } from '../render/2d/rig/rigTypes';
import { humanRigFor, rootRigFor, RIG_GORTI_SUIT } from '../content/characters/gorti';
import { RIG_COWARD, RIG_MECH } from '../content/characters/forms';
import { RIG_GORTI_HUMAN, RIG_GORTI_HUMAN_BALD, RIG_GORTI_HUMAN_SUN } from '../content/characters/sivasli';
import type { SkyOut } from '../engine/content/types';
import { FocusMeter, bezier } from './AbilitySystem';
import type { FormId, PlayerKind, RoomId } from '../engine/state/types';
import { humanoidPose, idleStartFor, styleOf, type Emote, type IdleKind, type PoseParams } from '../render/2d/rig/animPoses';
import { RigView } from '../render/2d/rig/RigView';
import { cycleOf, profileOf } from '../render/2d/rig/poseKit';

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

/** Walking in depth: this much of his walking speed (the eye sees depth foreshortened). */
const DEPTH_SPEED = 0.8;
/** How fast he steps back onto the actors' plane for a root reach (world px per second). */
const DEPTH_HOME = 420;

/** The room of the active run (where the player is). */
function currentRoom(): RoomId {
  return app.quest?.progress.room ?? 'r01';
}

/**
 * The body the player has: the inner forms have their own; Gorti's own
 * (root) body is the one of his life stage in the room, and his human form
 * wears the Sun or the Moon as its head, as the room's sky has it.
 */
/**
 * The Sivaslı amca's head: bald when nothing is out, the Sun's or the Moon's
 * face when his kahkaha has brought one out.
 */
const HUMAN_HEADS: Record<SkyOut, RigDef> = {
  none: RIG_GORTI_HUMAN_BALD,
  sun: RIG_GORTI_HUMAN_SUN,
  moon: RIG_GORTI_HUMAN,
};

/** Poses that play once over the time they are given (Player.pose). */
const ACTING = new Set(['laugh', 'kahkaha', 'smash']);

export function rigFor(kind: PlayerKind, form: FormId, room: RoomId = currentRoom(), head?: SkyOut): RigDef {
  if (kind === 'coward') return RIG_COWARD;
  if (kind === 'mech') return RIG_MECH;
  if (kind === 'suit') return RIG_GORTI_SUIT;
  if (form !== 'human') return rootRigFor(room);
  return head ? HUMAN_HEADS[head] : humanRigFor(room);
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
  /** Which half of the walk cycle the last footfall was in. */
  private stepN = 0;
  private lastVx = 0;
  private skidding = false;
  readonly focus = new FocusMeter();
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
  private head: SkyOut = 'none';
  /**
   * How far before (+) or behind (−) the actors' plane he walks (world px),
   * how fast, and between which depths (the room sets them from its box).
   * The world stays flat: physics, scripts and triggers see x and y only.
   */
  z = 0;
  vz = 0;
  depthRange = { min: -200, max: 70 };

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
    this.rig = new RigView(scene, rigFor(kind, this.form, undefined, this.head), (a, t, p, id) => humanoidPose(id, a, t, p), x, feetY, DEPTH.player);
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

  /** What shows of him in the world (his figure and the root he reaches with). */
  get parts(): Phaser.GameObjects.GameObject[] {
    return [this.rig.container, this.rootLine];
  }

  get controllable(): boolean {
    return this.state === 'normal';
  }

  teleport(x: number, feetY: number, facing?: 1 | -1): void {
    this.body.reset(x, feetY - HULL_H / 2);
    // A cut: he stands on the actors' plane again.
    this.z = 0;
    this.vz = 0;
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
    this.rig.setRig(rigFor(this.kind, form, undefined, this.head));
    this.rig.setFacing(this.facing);
  }

  /** The human form's head follows what is out in the sky (bald when nothing is). */
  setHead(head: SkyOut): void {
    if (this.head === head) return;
    this.head = head;
    if (this.kind !== 'gorti' || this.form !== 'human') return;
    this.rig.setRig(rigFor(this.kind, this.form, undefined, head));
    this.rig.setFacing(this.facing);
  }

  setKind(kind: PlayerKind, form: FormId = 'root'): void {
    this.kind = kind;
    this.form = kind === 'gorti' ? form : 'root';
    this.tuning = tuningFor(kind, this.form);
    this.canJump = kind !== 'suit';
    this.rig.setRig(rigFor(kind, this.form, undefined, this.head));
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

  fixed(dt: number, input: { axis: number; jumpPressed: boolean; jumpHeld: boolean; depth?: number; floor?: boolean }): void {
    const b = this.body;
    if (this.interactT > 0) this.interactT -= dt;
    if (this.state === 'reach') {
      // A root reaches for a ledge of the actors' plane: he goes with it.
      this.vz = 0;
      this.z = approach(this.z, 0, DEPTH_HOME * dt);
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
    if (this.actionT > 0) this.actionT -= dt;
    const canMove = this.state === 'normal' && !(this.actionHold && this.actionT > 0);
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
    this.stepDepth(dt, canMove ? (input.depth ?? 0) : 0, input.floor ?? true);

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

    // Braking hard from a run: the feet skid and the body rocks forward.
    const vx = Math.abs(b.velocity.x);
    if (this.onGround && axis === 0 && this.lastVx > this.tuning.speed * 0.6 && vx < this.lastVx - 1) {
      if (!this.skidding) {
        this.skidding = true;
        this.sqV -= 1.1;
        app.audio.sfx('step', { vol: 0.55, pitch: 0.7 });
        this.scene.events.emit('player-skid', this.x + this.facing * 10, this.feetY);
      }
    } else if (vx < 5 || axis !== 0) this.skidding = false;
    this.lastVx = vx;
  }

  /**
   * Walking toward the viewer (want > 0) or away (want < 0), over the room's
   * floor: it spans every depth of the box. Anything else he stands on (a
   * whale's back, a ledge) stands in the actors' plane, so there he walks
   * back onto it. In the air he keeps going as he left the ground.
   */
  private stepDepth(dt: number, want: number, floor: boolean): void {
    const t = this.tuning;
    const speed = t.speed * DEPTH_SPEED * this.speedScale;
    const home = this.onGround && !floor && this.z !== 0;
    const target = home ? -Math.sign(this.z) * speed : want * speed;
    const steer = home || want !== 0;
    const accel = this.onGround ? (steer ? t.accel : t.decel) : steer ? t.airAccel : t.airDecel;
    this.vz = approach(this.vz, target, accel * dt);
    let z = this.z + this.vz * dt;
    if (home && Math.sign(z) !== Math.sign(this.z)) {
      z = 0;
      this.vz = 0;
    }
    const { min, max } = this.depthRange;
    if (z < min || z > max) {
      z = Math.min(max, Math.max(min, z));
      this.vz = 0;
    }
    this.z = z;
  }

  /**
   * A foot comes down: the sound of the floor plus a low thud of weight, the
   * body gives a little and the world answers (dust, a nudge of the camera;
   * see WorldScene).
   */
  private footstep(): void {
    const theme = (this.scene as unknown as { stepSound?: () => 'step' | 'stepWood' | 'stepMetal' }).stepSound?.() ?? 'step';
    const heavy = this.form === 'human' || this.kind === 'suit' || this.kind === 'mech';
    app.audio.sfx(theme, { vol: heavy ? 1 : 0.8, pitch: 0.88 + Math.random() * 0.2 });
    app.audio.sfx('land', { vol: heavy ? 0.26 : 0.18, pitch: 0.72 + Math.random() * 0.1 });
    this.sqV -= heavy ? 0.75 : 0.55;
    this.scene.events.emit('player-step', this.x + this.facing * 6, this.feetY);
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

  private actionAnim: string | null = null;
  private actionT = 0;
  private actionDur = 1;
  private actionHold = false;

  /**
   * Plays a short move pose (Rezonans) for `seconds`; `hold` keeps Gorti in
   * place meanwhile (a stomp).
   */
  pose(anim: string, seconds: number, hold = false): void {
    this.actionAnim = anim;
    this.actionT = seconds;
    this.actionDur = Math.max(0.01, seconds);
    this.actionHold = hold;
    if (hold) this.body.setVelocityX(0);
  }

  /** A little dance while standing (e.g. in the colour storm). */
  dance(ms: number): void {
    this.danceT = Math.max(this.danceT, ms / 1000);
  }

  /** Turns the head for a while (negative looks up). */
  private visVx = 0;
  private accLean = 0;

  /** 0 standing … 1 lying on his back (asleep in bed); scripts tween it. */
  lie = 0;
  /**
   * Where the hips are while he lies in bed or gets out of it (the body
   * itself waits on the floor). The figure turns about this point.
   */
  lieHip: { x: number; y: number } | null = null;

  /** Height of the hips above the feet, for this body. */
  get hipHeight(): number {
    const hips = this.rig.rig.joints.find((j) => j.id === 'hips');
    return hips ? Math.abs(hips.y) : 40;
  }
  /** Scripted eyelids: 0 open … 1 shut; below 0 he blinks by himself. */
  eyelids = -1;
  /** A yawn, 0 … 1 (with the 'sleep' pose). */
  yawn = 0;
  /** Progress of getting out of bed, 0 … 1 (with the 'getup' pose). */
  getupK = 0;

  /** Where the eyes are in the world (to frame a close-up). */
  eyePos(): { x: number; y: number } {
    return this.rig.attachPoint('eye');
  }

  /** A landing without a fall (a hop out of bed): knees give, dust, a thud. */
  thump(impact: number): void {
    const i = Math.min(1, Math.max(0, impact));
    this.landImpact = i;
    this.landDur = 0.14 + 0.2 * i;
    this.landT = this.landDur;
    this.sq = 1 - (0.06 + 0.14 * i);
    this.sqV = -1.2 * i;
    app.audio.sfx('land', { vol: 0.35 + 0.5 * i });
    this.scene.events.emit('player-land', this.x, this.feetY, 260 + 500 * i);
  }

  /** Starts an idle action now (a stretch after waking up). */
  startIdle(kind: IdleKind): void {
    this.idleT = idleStartFor(kind, styleOf(this.rig.rig.id));
  }

  lookFor(angle: number, ms: number): void {
    this.gazeTo = angle;
    this.gazeT = ms / 1000;
  }

  // ------------------------------------------------------------ visuals

  visual(dtMs: number): void {
    const b = this.body;
    const feet = this.feetY;
    const dt = Math.min(dtMs, 50) / 1000;
    const hip = this.lieHip;
    if (hip) {
      // Turned about the hips: the figure's origin (its feet line) swings round them.
      const th = -this.lie * Math.PI * 0.5 * this.facing;
      const h = this.hipHeight;
      this.rig.setPosition(hip.x - h * Math.sin(th), hip.y + h * Math.cos(th));
    } else this.rig.setPosition(this.x, feet);
    const airborne = !this.onGround && this.state === 'normal';
    // Squash and stretch: a springy body that stretches with fall speed and
    // wobbles back after take-off and landing. Scaled at the feet.
    const stretch = airborne ? 1 + Math.min(0.06, Math.abs(b.velocity.y) / 10000) : 1;
    this.sqV += ((stretch - this.sq) * 320 - this.sqV * 15) * dt;
    this.sq += this.sqV * dt;
    this.rig.squashY = this.sq;
    this.rig.squashX = 1 + (1 - this.sq) * 0.85;
    // Over the ground, whichever way: across the room or in depth.
    const ground = Math.hypot(b.velocity.x, this.vz);
    const speed = ground / Math.max(1, this.tuning.speed);
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
    if (this.eyelids >= 0) prm.blink = this.eyelids;
    else if (this.blinkT >= 0) prm.blink = 1 - Math.abs(this.blinkT / 0.075 - 1);
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
    else if (this.actionT > 0 && this.actionAnim && this.onGround) {
      anim = this.actionAnim;
      // The acting poses ease in and back out over the time they were given.
      if (ACTING.has(anim)) prm.k = 1 - this.actionT / this.actionDur;
    }
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
    } else if (this.landT > 0 && !(ground > 60 && this.landDur - this.landT > 0.08)) {
      anim = 'land';
      prm.k = 1 - this.landT / this.landDur;
      prm.impact = this.landImpact;
    } else if (ground > 12) {
      anim = this.pushing ? 'push' : 'walk';
      // One walk cycle per this much ground, so a planted foot stays put.
      const strideLen = cycleOf(this.rig.rig.id, profileOf(this.rig.rig.id));
      this.walkPhase += (ground * dtMs) / 1000 / strideLen * Math.PI * 2;
      prm.phase = this.walkPhase;
      prm.speed = speed;
      // A footfall each time a foot reaches the front of its swing.
      const n = Math.floor((this.walkPhase - Math.PI / 2) / Math.PI);
      if (n !== this.stepN) {
        this.stepN = n;
        if (this.state === 'normal') this.footstep();
      }
    } else if (this.focus.active) anim = 'breath';
    else if (this.interactT > 0) anim = 'interact';
    else if (this.danceT > 0 && this.state === 'normal') anim = 'dance';
    if (anim === 'sleep') prm.k = this.yawn;
    if (anim === 'getup') {
      prm.k = this.getupK;
      prm.lie = this.lie;
    }
    // Standing still for a while brings idle actions (see animPoses).
    this.idleT = anim === 'idle' && this.state === 'normal' ? this.idleT + dt : 0;
    prm.idleT = this.idleT;
    this.rig.play(anim, prm);
    this.rig.stiffness = anim === 'takeoff' ? 2.6 : anim === 'land' ? 2 : anim === 'apex' ? 0.85 : 1;
    // Lean into the flight: back while climbing, forward while dropping.
    const run = Math.min(1, Math.abs(b.velocity.x) / Math.max(1, this.tuning.speed));
    let lean = airborne ? (b.velocity.y < -140 ? -0.05 : b.velocity.y > 150 ? 0.08 : 0.02) * run : 0;
    if (!airborne && this.onGround) {
      // Setting off, the body pitches into the step; braking, it rocks back.
      const acc = (Math.abs(b.velocity.x) - this.visVx) / Math.max(0.001, dt);
      this.accLean += (Math.max(-0.1, Math.min(0.1, acc / 5200)) - this.accLean) * (1 - Math.exp(-12 * dt));
      lean += this.skidding ? -0.07 : this.accLean;
    }
    this.visVx = Math.abs(b.velocity.x);
    this.rig.extraRot += (lean - this.rig.extraRot) * (1 - Math.exp(-10 * dt));
    // Lying down: the whole body turns about the feet, head toward the back.
    if (this.lie > 0 || this.lieHip) this.rig.extraRot = lean - this.lie * Math.PI * 0.5;
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
