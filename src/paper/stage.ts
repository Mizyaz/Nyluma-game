import * as Phaser from 'phaser';
import { Lens, type Framing } from './lens';
import { Planes, type PlaneCamera } from './planes';
import { MAX_SHADOWS, PaperBox, type BoxSpec } from './box';
import type { Press } from './press';

// A room on the paper stage: the box, the eye that looks into it, one camera
// per depth, and the cards standing in it. The world scene keeps its world:
// it moves its objects as ever, and tells the stage what stands where.

/** Something whose shadow lies on the floor. */
export interface Shadowed {
  /** World x and depth of its foot, its shadow's half width (world px) and darkness (0..1); null hides it. */
  shadow(): { x: number; z: number; r: number; a: number } | null;
}

export class PaperStage {
  readonly lens = new Lens();
  readonly planes: Planes;
  readonly box: PaperBox;
  /** Draws the inside of the box (behind everything), and its torn front (before the box's inside planes). */
  private readonly insideCam: PlaneCamera;
  private readonly frontCam: PlaneCamera;
  private readonly shadowed = new Set<Shadowed>();
  /** The point the eye follows (world x), and a scripted look (null: follow). */
  private target: { x: number; y: number } | null = null;
  private look: { x: number; y: number } | null = null;
  private eyeX = NaN;
  /** Vertical framing shift (device px) for a scripted look, eased. */
  private shiftY = 0;
  zoom = 1;
  private shakeT = 0;
  private shakeK = 0;
  private shakeDur = 1;
  /** Seconds for the eye to close most of the way to its target. */
  follow = 0.35;
  private last = performance.now();

  constructor(
    readonly scene: Phaser.Scene,
    readonly spec: BoxSpec,
    readonly framing: Framing,
    readonly press: Press,
    /** Device px per world px at the actors' plane when the window is the full screen. */
    readonly actorScale: number,
    /** The room's own zoom (a wide room shows more; its prints are made for it). */
    readonly baseZoom = 1,
  ) {
    this.planes = new Planes(scene, this.lens);
    this.box = new PaperBox(scene, spec);
    this.insideCam = this.planes.layer(Number.NEGATIVE_INFINITY);
    this.frontCam = this.planes.layer(spec.front + 0.5);
    this.planes.placeOn(this.box.inside, this.insideCam);
    this.planes.placeOn(this.box.frontFace, this.frontCam);
    this.frame(0);
    scene.events.on(Phaser.Scenes.Events.PRE_RENDER, this.preRender, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
  }

  /** The actors' plane camera (the scene's main camera). */
  get main(): PlaneCamera {
    return this.planes.main;
  }

  /** The camera fixed to the screen (overlays, fades). */
  get screen(): PlaneCamera {
    return this.planes.screen;
  }

  /** Device px per world px at the actors' plane right now. */
  get scale(): number {
    return this.lens.scale(0);
  }

  /** Follow this point (the player) with the eye. */
  setTarget(x: number, y: number): void {
    if (!this.target) this.target = { x, y };
    this.target.x = x;
    this.target.y = y;
  }

  /** A scripted look at a world point of the actors' plane; null returns to following. */
  lookAt(x: number | null, y = 0): void {
    this.look = x === null ? null : { x, y };
  }

  /** Puts the eye on its target at once (room start, a cut). */
  snap(): void {
    this.eyeX = NaN;
    this.frame(0);
  }

  /** Shakes the picture (all planes together). */
  shake(ms: number, intensity: number): void {
    this.shakeT = this.shakeDur = Math.max(0.01, ms / 1000);
    this.shakeK = intensity;
  }

  addShadow(s: Shadowed): void {
    this.shadowed.add(s);
  }

  removeShadow(s: Shadowed): void {
    this.shadowed.delete(s);
  }

  /**
   * Stands an image at depth z as a card printed for that depth: its texture
   * is swapped for the press's print of `key` once it is made (the art was
   * printed before the room started, so normally at once).
   */
  card(img: Phaser.GameObjects.Image, key: string, z: number, worldScale = 1): void {
    this.planes.put(img, z);
    const s = this.printScale(z, worldScale);
    if (!this.press.dress(img, key, s, worldScale)) void this.press.one(key, s).then(() => img.active && this.press.dress(img, key, s, worldScale));
  }

  /** The print scale for a part shown `worldScale` large at depth z (on the full screen). */
  printScale(z: number, worldScale = 1): number {
    return printScaleAt(this.actorScale * this.baseZoom, this.framing.dist, z, worldScale);
  }

  /** Device px per world px at depth z with the lens at rest on the full screen. */
  restScale(z: number): number {
    return restScale(this.actorScale * this.baseZoom, this.framing.dist, z);
  }

  private preRender(): void {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    this.frame(dt);
  }

  /** Sets the lens for this frame and brings everything along. */
  frame(dt: number): void {
    const { width: W, height: H } = this.scene.scale;
    const lens = this.lens;
    const s = this.spec;
    // How much the window shows: one world px is always actorScale device
    // px (prints stay exact), so a smaller window shows less of the room;
    // a very small one (a phone held upright) shows a little more instead.
    const span = Math.max(300, H / this.actorScale);
    lens.frame(W, H, { ...this.framing, span }, s.floor, this.baseZoom * this.zoom);
    // The eye's x: the scripted look, else the target, eased; kept so the
    // actors' plane never shows past the box's walls.
    const goal = this.look?.x ?? this.target?.x ?? (s.x0 + s.x1) / 2;
    if (!Number.isFinite(this.eyeX) || dt === 0) this.eyeX = goal;
    else this.eyeX += (goal - this.eyeX) * (1 - Math.exp(-dt / Math.max(0.01, this.follow) * 3));
    const half = lens.halfWidth(0);
    const lo = s.x0 + half;
    const hi = s.x1 - half;
    lens.eye.x = lo > hi ? (s.x0 + s.x1) / 2 : Math.min(hi, Math.max(lo, this.eyeX));
    // A scripted look also frames its point at the middle of the screen.
    const wantShift = this.look ? H / 2 - lens.project(this.look.x, this.look.y, 0).y : 0;
    this.shiftY = dt === 0 ? wantShift : this.shiftY + (wantShift - this.shiftY) * (1 - Math.exp(-dt * 4));
    lens.cy += this.shiftY;
    if (this.shakeT > 0) {
      this.shakeT = Math.max(0, this.shakeT - dt);
      const k = this.shakeK * H * (this.shakeT / this.shakeDur);
      lens.cx += (Math.random() * 2 - 1) * k;
      lens.cy += (Math.random() * 2 - 1) * k;
    }
    this.planes.update();
    this.writeShadows();
    this.box.inkWidth = Math.max(2, Math.round(this.lens.scale(0) * 1.7));
    this.box.update(lens);
  }

  private writeShadows(): void {
    const buf = this.box.shadows;
    let n = 0;
    for (const s of this.shadowed) {
      if (n >= MAX_SHADOWS) break;
      const v = s.shadow();
      if (!v || v.a <= 0.01) continue;
      buf.set([v.x, v.z, Math.max(4, v.r), v.a], n * 4);
      n++;
    }
    this.box.shadowCount = n;
  }

  destroy(): void {
    this.scene.events.off(Phaser.Scenes.Events.PRE_RENDER, this.preRender, this);
    this.shadowed.clear();
    this.box.destroy();
  }
}

const round4 = (v: number): number => Math.round(v * 1e4) / 1e4;

/** Device px per world px at depth z, for `actor` at the actors' plane and the eye `dist` from it. */
export function restScale(actor: number, dist: number, z: number): number {
  return (actor * dist) / (dist - z);
}

/** The print scale of a part shown `worldScale` large at depth z (see PaperStage.printScale). */
export function printScaleAt(actor: number, dist: number, z: number, worldScale = 1): number {
  return round4(worldScale * restScale(actor, dist, z));
}
