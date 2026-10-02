import * as Phaser from 'phaser';
import { app } from '../../../engine/App';
import type { Sfx } from '../../../engine/systems/AudioSystem';
import type { PaperStage } from '../../../paper/stage';
import type { PlaneCamera } from '../../../paper/planes';
import type { PaperLight } from '../../../paper/light';
import type { Press, Print } from '../../../paper/press';
import type { PartArt } from '../rig/rigTypes';
import { frameRef, hasFrame } from '../TextureFactory';
import type { Pt } from '../svg';

// A doorway on the paper stage, built as a tunnel book: a frame standing
// just behind the actors' plane, and behind its opening a few cut-out pages
// receding into the depth, the last of them a glimpse of the room it leads
// to. Everything seen through the opening stands on one camera cut to the
// opening; each page is moved and scaled there, every frame, as the eye
// would see it at its own depth, so the pages slide past each other as the
// eye goes by and the opening reads as a hole into somewhere.
//
// A door may be shut (its condition is not true yet): pieces or a leaf
// close the opening, and open with a short animation when the condition
// comes true. Gorti near wakes it: the light swells, the pages draw apart,
// a leaf swings wider, someone peeks out, motes drift. With reduced motion
// nothing idles or travels: opening (a leaf's swing too) and a peek are
// short fades.
//
// Per frame it only moves, scales and fades a few dozen images: every
// drawing is printed once, at the depth it stands at.

/** A printed part standing in the doorway. */
export interface DoorCard {
  key: string;
  /** Its pivot from the door's foot (the middle of the threshold), world px. */
  x: number;
  y: number;
  /**
   * Depth from the frame's plane, world px (toward the viewer positive).
   * Inside cards are further in (negative), seen only through the opening.
   */
  dz: number;
  /** World px per px of the part (default 1). */
  scale?: number;
  flipX?: boolean;
  /** Draw order among the cards on its camera (inside: far to near). */
  order?: number;
}

/**
 * A pose. For `shut` and `open` it is where the piece is (x, y and angle
 * from its home, its alpha, its size); for `wake` and `peek` it is what is
 * added as Gorti comes near (alpha added too; sizes multiplied).
 */
export interface DoorPose {
  x?: number;
  y?: number;
  angle?: number;
  alpha?: number;
  sx?: number;
  sy?: number;
}

/** A piece that moves: part of a closure, a peeking creature, a swaying star. */
export interface DoorPiece extends DoorCard {
  /** Seen only through the opening (stands inside, cut to it). */
  inside?: boolean;
  shut?: DoorPose;
  open?: DoorPose;
  /** 0..1: how late in the opening it moves (pieces open one after another). */
  lag?: number;
  /** Added as Gorti comes near: only once open; with `wakeShut` shut or open, or with 'only' only while shut. */
  wake?: DoorPose;
  wakeShut?: boolean | 'only';
  /** 0..1: how awake the door must be before this piece stirs (pieces wake one after another). */
  wakeAt?: number;
  /** Added while it peeks out at Gorti (an open door, Gorti near). */
  peek?: DoorPose;
  /** Idle sway (not with reduced motion): degrees, px and alpha, and its period (ms); `byWake`: only as much as it is awake. */
  sway?: { angle?: number; y?: number; x?: number; alpha?: number; ms: number; byWake?: boolean };
  /** Light itself: drawn additive, never shaded. */
  additive?: boolean;
  /** An eye's pupil (or a face): moved this far toward Gorti as he comes (px). */
  look?: { x: number; y?: number };
  /** Blinks now and then (not with reduced motion): squashed shut for a moment. */
  blink?: boolean;
}

/** A leaf on a vertical hinge (a door, a flap), drawn in perspective. */
export interface DoorLeaf {
  /**
   * Its faces: drawn from the top left corner (`leafPart`), the front as
   * seen from before the door, the back as seen from behind it (so the
   * hinge is on the other side).
   */
  front: string;
  back: string;
  hinge: 'left' | 'right';
  /** The hinge's x from the foot, and the leaf's top (negative, up), world px. */
  x: number;
  y: number;
  /** Depth of the hinge from the frame's plane. */
  dz: number;
  /** Degrees (positive: the free edge comes toward the viewer): shut, at rest once open, and with Gorti near. */
  shutAngle: number;
  restAngle: number;
  wideAngle: number;
  /** How many strips draw its perspective (default 16). */
  strips?: number;
  /** It opens inward, into the doorway (negative angles): drawn cut to the opening. */
  inside?: boolean;
  /** It never moves (a lintel along the depth, a panel at a slant): no idle wobble. */
  still?: boolean;
}

/** How a door looks and moves (the art modules build these). */
export interface DoorArt {
  /** Every part it prints. */
  parts: PartArt[];
  /** The opening, a closed outline from the foot (y up negative), world px; empty for an arch with nothing inside. */
  opening: Pt[];
  /** The frame: cards around the opening, before what it shows. */
  frame: DoorCard[];
  /** The tunnel book: pages and the far glimpse (dz negative), with `order` far to near. */
  inside: DoorCard[];
  /** Colour seen through the opening behind every page (the dark beyond). */
  backdrop?: number;
  /** How bright what the opening shows is while the door is shut (0..1, default 0.55): its light is out. */
  shutDim?: number;
  /** Cards nearer the viewer (pop-up tabs, a front arch Gorti passes behind). */
  front: DoorCard[];
  pieces: DoorPiece[];
  leaves: DoorLeaf[];
  /** The light inside: colour, reach (world px), strength, height over the floor. */
  light: { color: number; radius: number; intensity: number; y: number };
  /** The glow in the opening and its pool on the floor. */
  glow: { color: number; pool: number };
  /** Motes drifting out once open and awake. */
  sparks?: { colors: number[]; frame: 'fx.dot' | 'fx.spark' | 'fx.petal'; rate: number; size: number };
  /** Sounds: as it wakes, as someone peeks, as it opens. */
  sounds?: { wake?: [Sfx, number, number]; peek?: [Sfx, number, number]; open?: [Sfx, number, number][] };
  /** How long it takes to open (ms) and its ease. */
  openMs?: number;
  openEase?: string;
}

/** Where a door stands and what keeps it shut. */
export interface DoorPlace {
  /** The foot (the middle of the threshold), and the frame's depth. */
  x: number;
  floor: number;
  z: number;
  isOpen: () => boolean;
  /** How near Gorti counts (world px): wide awake within `near`, asleep beyond `far`. */
  near?: number;
  far?: number;
}

/** What a door needs printed: its parts at the print scales of their depths. */
export function doorJobs(paper: PaperStage, art: DoorArt, z: number): { key: string; scale: number }[] {
  const jobs: { key: string; scale: number }[] = [];
  const add = (key: string, at: number, s = 1): void => {
    jobs.push({ key, scale: paper.printScale(at, s) });
  };
  for (const c of [...art.frame, ...art.inside, ...art.front, ...art.pieces]) add(c.key, z + c.dz, c.scale);
  for (const l of art.leaves) {
    add(l.front, z + l.dz);
    add(l.back, z + l.dz);
  }
  return jobs;
}

type Img = Phaser.GameObjects.Image;

interface Placed {
  img: Img;
  /** Its pivot in the world, and its depth (inside cards: their own depth). */
  ax: number;
  ay: number;
  z: number;
  sx: number;
  sy: number;
}

interface PieceRt extends Placed {
  spec: DoorPiece;
  /** On the camera cut to the opening. */
  inside: boolean;
}

interface LeafRt {
  spec: DoorLeaf;
  front: Print;
  back: Print;
  strips: Img[];
  /** The leaf's size and its print's margin (world px). */
  w: number;
  h: number;
  m: number;
  /** The plane it is drawn on. */
  zc: number;
}

interface Spark {
  img: Img;
  t: number;
  life: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  wob: number;
  size: number;
}

const ease = (t: number): number => t * t * (3 - 2 * t);
const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * A quad submitter that draws with one texture per batch. The default one
 * binds several textures per batch and picks each quad's by comparing an
 * interpolated float for exact equality, which some GL implementations do
 * not keep exact across a turned quad: half of a swaying piece would then
 * vanish now and then. A door's pieces turn, so they are drawn this way
 * (a few more draw calls, nothing else). Null on a canvas renderer.
 */
const SINGLE = 'DoorSubmitterQuad';
function singleSubmitter(scene: Phaser.Scene): object | null {
  const manager = (scene.sys.renderer as { renderNodes?: unknown } | null)?.renderNodes as
    | { getNode(name: string): object | null; addNode(name: string, node: object): void }
    | undefined;
  if (!manager) return null;
  const have = manager.getNode(SINGLE);
  if (have) return have;
  const base = manager.getNode('SubmitterQuad') as { constructor: new (m: unknown, c: object) => { _renderOptions?: { multiTexturing: boolean } } } | null;
  if (!base) return null;
  const node = new base.constructor(manager, { name: SINGLE });
  if (!node._renderOptions) return null;
  node._renderOptions.multiTexturing = false;
  manager.addNode(SINGLE, node);
  return node;
}

/** Rounds a card to whole pixels only when it shows one texel to one pixel, unturned (as the press's prints do). */
function exactRounding(img: Img): void {
  img.willRoundVertices = (camera: Phaser.Cameras.Scene2D.Camera): boolean =>
    camera.roundPixels && img.rotation === 0 && Math.abs(camera.zoom * Math.abs(img.scaleX) - 1) < 1e-6 && Math.abs(camera.zoom * Math.abs(img.scaleY) - 1) < 1e-6;
}

export class Doorway {
  /** How open it is (0 shut … 1 open), and how awake (Gorti near). */
  open = 0;
  wake = 0;
  private readonly scene: Phaser.Scene;
  private readonly clipCam: PlaneCamera | null = null;
  private readonly mask: Phaser.GameObjects.Graphics | null = null;
  private readonly inside: Placed[] = [];
  private readonly pieces: PieceRt[] = [];
  private readonly leaves: LeafRt[] = [];
  /** Everything it made (destroyed with it), and what fades in with it. */
  private readonly all: Phaser.GameObjects.GameObject[] = [];
  private readonly still: Img[] = [];
  private readonly glowIn: Img | null = null;
  private readonly halo: Img | null = null;
  private readonly pool: Img | null = null;
  private readonly lamp: PaperLight;
  private readonly shadow: { shadow: () => { x: number; z: number; r: number; a: number } | null };
  private readonly sparks: Spark[] = [];
  private readonly sparkPlane: number;
  private sparkDue = 0;
  private openTween: Phaser.Tweens.Tween | null = null;
  private target = 0;
  /** Whether it was on the screen at the last layout (it opens only where it can be seen). */
  private seen = false;
  /** Where Gorti is, from the door (-1 left … 1 right), eased: eyes follow it. */
  private gaze = 0;
  /** Blinking: when the next blink comes, and how far it is (0 open … 1 shut). */
  private blinkAt = 2 + Math.random() * 3;
  private blinkT = -1;
  private t = Math.random() * 10;
  private peek = 0;
  private peeking = false;
  private chimed = false;
  private peekSounded = false;
  /** Fades in once printed (it may come a moment after the room). */
  private shown = 0;
  /** The opening's half width and height (world px). */
  private readonly half: number;
  private readonly tall: number;
  private readonly openMs: number;
  private readonly openEase: string;
  /** How deep the deepest page stands (world px). */
  private readonly deepest: number;
  /** The submitter its images are drawn with (see `singleSubmitter`). */
  private readonly single: object | null;

  constructor(
    private readonly paper: PaperStage,
    private readonly press: Press,
    private readonly art: DoorArt,
    readonly place: DoorPlace,
  ) {
    const scene = paper.scene;
    this.scene = scene;
    this.single = singleSubmitter(scene);
    const { x, floor, z } = place;
    const partOf = new Map(art.parts.map((p) => [p.key, p]));
    this.openMs = art.openMs ?? 1100;
    this.openEase = art.openEase ?? 'Back.easeOut';
    const xs = art.opening.map((p) => p[0]);
    const ys = art.opening.map((p) => p[1]);
    this.half = xs.length ? (Math.max(...xs) - Math.min(...xs)) / 2 : 50;
    this.tall = ys.length ? -Math.min(...ys) : 160;
    this.deepest = Math.max(1, ...art.inside.map((c) => -c.dz));
    const zc = z - 1;
    const hasInside = art.opening.length >= 3;
    if (hasInside) {
      // The opening, cut a hair wider than drawn: the frame covers its rim.
      const mask = scene.make.graphics({}, false);
      mask.fillStyle(0xffffff, 1);
      const cx = xs.reduce((s, v) => s + v, 0) / xs.length;
      const cy = ys.reduce((s, v) => s + v, 0) / ys.length;
      mask.fillPoints(
        art.opening.map(([px, py]) => {
          const d = Math.hypot(px - cx, py - cy) || 1;
          return new Phaser.Math.Vector2(x + px + ((px - cx) / d) * 1.5, floor + py + ((py - cy) / d) * 1.5);
        }),
        true,
      );
      this.mask = mask;
      this.clipCam = paper.planes.clip(zc, mask);
    }
    const clipCam = this.clipCam;

    const make = (card: DoorCard, at: number, cam: PlaneCamera | null): Placed | null => {
      const part = partOf.get(card.key);
      const print = this.press.get(card.key, paper.printScale(at, card.scale ?? 1));
      if (!part || !print) return null;
      const img = scene.add.image(x + card.x, floor + card.y, print.texture);
      img.setOrigin(part.px / print.w, part.py / print.h);
      const k = (card.scale ?? 1) / print.scale;
      img.setScale(k * (card.flipX ? -1 : 1), k);
      exactRounding(img);
      if (card.order !== undefined) img.setDepth(card.order);
      if (cam) paper.planes.placeOn(img, cam);
      else paper.planes.put(img, at);
      this.own(img);
      return { img, ax: x + card.x, ay: floor + card.y, z: at, sx: img.scaleX, sy: img.scaleY };
    };
    const glowImg = (gx: number, gy: number, color: number, depth: number): Img | null => {
      if (!hasFrame('fx.glow')) return null;
      const g = frameRef('fx.glow');
      const img = scene.add.image(gx, gy, g.atlas, g.frame).setBlendMode(Phaser.BlendModes.ADD).setTint(color).setDepth(depth).setAlpha(0);
      paper.lighting.leave(img);
      this.own(img);
      return img;
    };

    if (clipCam) {
      // The dark beyond, then what the opening shows, far to near.
      if (art.backdrop !== undefined && hasFrame('fx.white')) {
        const wf = frameRef('fx.white');
        const bd = scene.add.image(x, floor - this.tall / 2, wf.atlas, wf.frame).setTint(art.backdrop).setDepth(-100);
        bd.setDisplaySize(this.half * 2 + 20, this.tall + 20);
        paper.planes.placeOn(bd, clipCam);
        paper.lighting.leave(bd);
        this.own(bd);
        this.still.push(bd);
      }
      art.inside.forEach((c, i) => {
        const p = make({ ...c, order: c.order ?? i }, z + c.dz, clipCam);
        if (!p) return;
        paper.lighting.leave(p.img);
        this.inside.push(p);
        this.still.push(p.img);
      });
      // The light in there, a haze over the pages (cut to the opening too;
      // drawn normally: an additive image on a masked camera upsets the
      // renderer's blending for the cameras around it).
      const gi = glowImg(x, floor - art.light.y, art.glow.color, 500);
      if (gi) {
        gi.setBlendMode(Phaser.BlendModes.NORMAL);
        paper.planes.placeOn(gi, clipCam);
      }
      this.glowIn = gi;
    }
    // Moving pieces and leaves.
    art.pieces.forEach((s, i) => {
      const inside = !!s.inside && !!clipCam;
      const p = make({ ...s, order: s.order ?? 100 + i }, z + s.dz, inside ? clipCam : null);
      if (!p) return;
      if (inside || s.additive) paper.lighting.leave(p.img);
      if (s.additive) p.img.setBlendMode(Phaser.BlendModes.ADD);
      this.pieces.push({ ...p, spec: s, inside });
    });
    for (const l of art.leaves) {
      const at = z + l.dz;
      const front = this.press.get(l.front, paper.printScale(at));
      const back = this.press.get(l.back, paper.printScale(at));
      const part = partOf.get(l.front);
      if (!front || !back || !part) continue;
      // An inward leaf stands on the camera cut to the opening (behind the frame).
      const inward = !!l.inside && !!clipCam;
      const strips: Img[] = [];
      for (let i = 0; i < (l.strips ?? 16); i++) {
        const img = scene.add.image(0, 0, front.texture).setOrigin(0, 0).setDepth(inward ? 60 + i : 200 + i);
        if (inward) paper.planes.placeOn(img, clipCam);
        else paper.planes.put(img, at);
        this.own(img);
        strips.push(img);
      }
      const m = part.px;
      this.leaves.push({ spec: l, front, back, strips, w: part.w - 2 * m, h: part.h - 2 * m, m, zc: inward ? zc : at });
    }
    // The frame before all of that, and what stands nearer still.
    art.frame.forEach((c, i) => {
      const p = make({ ...c, order: c.order ?? 300 + i }, z + c.dz, null);
      if (p) this.still.push(p.img);
    });
    for (const c of art.front) {
      const p = make(c, z + c.dz, null);
      if (p) this.still.push(p.img);
    }
    // Light spilling out: a halo over the frame and a pool on the floor before it.
    if (hasInside) {
      const halo = glowImg(x, floor - art.light.y, art.glow.color, 400);
      if (halo) paper.planes.put(halo, z + 2);
      this.halo = halo;
      const pool = glowImg(x, floor + 2, art.glow.pool, 400);
      if (pool) paper.planes.put(pool, z + 30);
      this.pool = pool;
    }
    this.sparkPlane = z + 8;
    this.lamp = paper.lighting.add({ x, y: floor - art.light.y, z: z + 50, color: art.light.color, radius: art.light.radius, intensity: 0, cast: false });
    this.shadow = { shadow: () => (this.shown > 0.05 ? { x, z: z - 2, r: this.half * 2.4, a: 0.3 * this.shown } : null) };
    paper.addShadow(this.shadow);
    // As it is now, without a fuss.
    this.target = this.open = place.isOpen() ? 1 : 0;
    this.layout();
  }

  /** Every image it makes: drawn one texture at a time, destroyed with it. */
  private own<T extends Img>(img: T): T {
    if (this.single) img.setRenderNodeRole('Submitter', this.single as Phaser.Renderer.WebGL.RenderNodes.RenderNode);
    this.all.push(img);
    return img;
  }

  /** Its state, for the e2e probe and tests. */
  get state(): { open: number; wake: number; peek: number } {
    const r = (v: number): number => Math.round(v * 100) / 100;
    return { open: r(this.open), wake: r(this.wake), peek: r(this.peek) };
  }

  /** Once a frame, after the eye has been set: Gorti's x (null when he is away). */
  update(dtMs: number, gortiX: number | null, paused: boolean): void {
    const reduced = app.settings.reducedMotion;
    const dt = Math.min(0.1, Math.max(0, dtMs) / 1000);
    this.shown = Math.min(1, this.shown + dt / 0.4);
    if (!paused) {
      this.t += dt;
      // The condition: open (or shut again) as it changes. Unseen, it waits
      // to open until it comes into view (so the opening is seen), and shuts at once.
      const want = this.place.isOpen() ? 1 : 0;
      if (want !== this.target) {
        if (this.seen) this.swing(want, reduced);
        else if (want === 0) {
          this.openTween?.stop();
          this.target = this.open = 0;
        }
      }
      // Gorti near wakes it.
      const near = this.place.near ?? 140;
      const far = this.place.far ?? 520;
      const d = gortiX === null ? Infinity : Math.abs(gortiX - this.place.x);
      const wantWake = 1 - ease(clamp01((d - near) / (far - near)));
      const k = 1 - Math.exp(-dt / (wantWake > this.wake ? 0.4 : 0.8));
      this.wake += (wantWake - this.wake) * k;
      if (this.wake > 0.5 && !this.chimed) {
        this.chimed = true;
        this.sound(this.art.sounds?.wake);
      } else if (this.wake < 0.15) this.chimed = false;
      // Someone peeks out of an open door while Gorti is near.
      const peekNow = this.open > 0.9 && (this.peeking ? this.wake > 0.35 : this.wake > 0.6);
      if (peekNow && !this.peeking && !this.peekSounded) {
        this.peekSounded = true;
        this.sound(this.art.sounds?.peek);
      }
      if (this.wake < 0.15) this.peekSounded = false;
      this.peeking = peekNow;
      // (With reduced motion it does not come out: it fades in where it peeks, quickly.)
      const tp = reduced ? 0.07 : peekNow ? 0.35 : 0.25;
      this.peek += ((peekNow ? 1 : 0) - this.peek) * (1 - Math.exp(-dt / tp));
      // Eyes follow Gorti, and blink now and then.
      const g = gortiX === null ? 0 : Math.max(-1, Math.min(1, (gortiX - this.place.x) / 260));
      this.gaze += (g - this.gaze) * (1 - Math.exp(-dt / 0.25));
      if (this.blinkT >= 0) {
        this.blinkT += dt / 0.16;
        if (this.blinkT >= 1) this.blinkT = -1;
      } else if (this.t > this.blinkAt) {
        this.blinkT = 0;
        this.blinkAt = this.t + 2.2 + Math.random() * 3.5;
      }
      this.updateSparks(dt, reduced);
    }
    this.layout();
  }

  private sound(s: [Sfx, number, number] | undefined): void {
    if (s) app.audio.sfx(s[0], { vol: s[1], pitch: s[2] });
  }

  /** Opens (1) or shuts (0) it: a short animation, or a fade with reduced motion. */
  private swing(to: number, reduced: boolean): void {
    this.target = to;
    this.openTween?.stop();
    if (to === 1) for (const s of this.art.sounds?.open ?? []) this.sound(s);
    this.openTween = this.scene.tweens.add({
      targets: this,
      open: to,
      duration: reduced ? 260 : to === 1 ? this.openMs : this.openMs * 0.6,
      ease: reduced ? 'Sine.easeInOut' : to === 1 ? this.openEase : 'Cubic.easeIn',
    });
    if (to === 1 && !reduced) this.burst();
  }

  /** Everything where the eye sees it now. */
  private layout(): void {
    const lens = this.paper.lens;
    const { x, z } = this.place;
    const ex = lens.eye.x;
    const ey = lens.eye.y;
    const E = lens.eye.z;
    const reduced = app.settings.reducedMotion;
    // Off the screen, the camera cut to the opening is not drawn at all.
    const onScreen = Math.abs(x - ex) < lens.halfWidth(z) + this.half * 3 + 60;
    this.clipCam?.setVisible(onScreen);
    this.seen = Math.abs(x - ex) < lens.halfWidth(z) + this.half * 0.5;
    const fade = this.shown;
    if (fade < 1) for (const img of this.still) img.setAlpha(fade);
    else if (this.still.length && this.still[0]!.alpha < 1) for (const img of this.still) img.setAlpha(1);
    const open = clamp01(this.open);
    const wake = this.wake;
    const breath = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(this.t * 1.9);
    const zc = z - 1;
    // The pages draw apart as it wakes (the tunnel deepens), and breathe.
    const deepen = 1 + 0.2 * wake * open + (reduced ? 0 : 0.02 * (breath - 0.5));
    const dim = lerp(this.art.shutDim ?? 0.55, 1, open);
    for (const p of this.inside) {
      const zi = z + (p.z - z) * deepen;
      const s = (E - zc) / (E - zi);
      p.img.setPosition(ex + (p.ax - ex) * s, ey + (p.ay - ey) * s);
      p.img.setScale(p.sx * s, p.sy * s);
      // The near pages stand dark against the light beyond them; it all brightens as the door wakes.
      const far = clamp01((z - p.z) / this.deepest);
      const lit = clamp01(0.62 + 0.38 * far * far + 0.14 * wake * open) * dim;
      const c = Math.round(255 * lit);
      p.img.setTint(Phaser.Display.Color.GetColor(c, Math.round(c * 0.96), Math.min(255, Math.round(c * 1.02))));
    }
    // Light: dim while shut, a soft glow at rest, swelling as Gorti comes.
    const glow = (0.12 * (1 - open) + open * (0.42 + 0.48 * wake) + (reduced ? 0 : 0.07 * (breath - 0.5))) * fade;
    const w = this.half;
    if (this.glowIn) this.glowIn.setScale((w / 40) * (1 + 0.15 * wake), (this.tall / 70) * (1 + 0.1 * wake)).setAlpha(0.08 + 0.22 * glow);
    if (this.halo) this.halo.setScale((w / 26) * (1 + 0.15 * wake), (this.tall / 52) * (1 + 0.1 * wake)).setAlpha(0.05 + 0.2 * glow);
    if (this.pool) this.pool.setScale((w / 22) * (1 + 0.25 * wake), 0.34 + 0.08 * wake).setAlpha(0.06 + 0.42 * glow);
    this.lamp.intensity = this.art.light.intensity * (0.1 + 0.9 * glow);
    for (const p of this.pieces) this.posePiece(p, open, wake, ex, ey, E, zc, reduced, fade);
    for (const l of this.leaves) this.drawLeaf(l, open, wake, ex, ey, E, reduced, fade);
  }

  private posePiece(p: PieceRt, open: number, wake: number, ex: number, ey: number, E: number, zc: number, reduced: boolean, fade: number): void {
    const s = p.spec;
    const lag = s.lag ?? 0;
    const u = ease(clamp01((open - lag) / Math.max(0.05, 1 - lag)));
    const a = s.shut ?? {};
    const b = s.open ?? {};
    const wa = s.wakeAt ?? 0;
    const wv = s.wakeShut === 'only' ? wake * (1 - open) : s.wakeShut ? wake : wake * open;
    const wk = s.wake || s.sway?.byWake ? ease(clamp01((wv - wa) / (1 - wa))) : 0;
    const w = s.wake ?? {};
    const peek = s.peek ? clamp01(this.peek) : 0;
    // With reduced motion a peek does not travel either: it is there or not, faded across.
    const pk = reduced ? (peek < 0.5 ? 0 : 1) : ease(peek);
    const q = s.peek ?? {};
    const sw = s.sway && !reduced ? Math.sin((this.t * 1000 * Math.PI * 2) / s.sway.ms + p.ax * 0.013) * (s.sway.byWake ? wk : 1) : 0;
    let pose: DoorPose;
    let alpha: number;
    if (reduced && (s.shut || s.open)) {
      // No travel between shut and open: where it ends up, faded across the change.
      pose = u < 0.5 ? a : b;
      alpha = (pose.alpha ?? 1) * Math.abs(1 - 2 * u);
    } else {
      pose = { x: lerp(a.x ?? 0, b.x ?? 0, u), y: lerp(a.y ?? 0, b.y ?? 0, u), angle: lerp(a.angle ?? 0, b.angle ?? 0, u), sx: lerp(a.sx ?? 1, b.sx ?? 1, u), sy: lerp(a.sy ?? 1, b.sy ?? 1, u) };
      alpha = lerp(a.alpha ?? 1, b.alpha ?? 1, u);
    }
    const lk = s.look ? this.gaze * wake : 0;
    const px = (pose.x ?? 0) + (w.x ?? 0) * wk + (q.x ?? 0) * pk + (s.sway?.x ?? 0) * sw + (s.look?.x ?? 0) * lk;
    const py = (pose.y ?? 0) + (w.y ?? 0) * wk + (q.y ?? 0) * pk + (s.sway?.y ?? 0) * sw + (s.look?.y ?? 0) * Math.abs(lk);
    const ang = (pose.angle ?? 0) + (w.angle ?? 0) * wk + (q.angle ?? 0) * pk + (s.sway?.angle ?? 0) * sw;
    alpha += (w.alpha ?? 0) * wk + (q.alpha ?? 0) * pk + (s.sway?.alpha ?? 0) * sw;
    const sx = (pose.sx ?? 1) * (1 + ((w.sx ?? 1) - 1) * wk) * (1 + ((q.sx ?? 1) - 1) * pk);
    const shut = s.blink && !reduced && this.blinkT >= 0 ? Math.sin(Math.PI * this.blinkT) : 0;
    const sy = (pose.sy ?? 1) * (1 + ((w.sy ?? 1) - 1) * wk) * (1 + ((q.sy ?? 1) - 1) * pk) * (1 - 0.85 * shut);
    alpha = clamp01(alpha) * fade * (reduced && s.peek ? Math.abs(1 - 2 * peek) : 1);
    const img = p.img;
    if (p.inside) {
      const k = (E - zc) / (E - p.z);
      img.setPosition(ex + (p.ax + px - ex) * k, ey + (p.ay + py - ey) * k);
      img.setScale(p.sx * sx * k, p.sy * sy * k);
    } else {
      img.setPosition(p.ax + px, p.ay + py);
      img.setScale(p.sx * sx, p.sy * sy);
    }
    img.setAngle(ang);
    img.setAlpha(alpha);
    img.setVisible(alpha > 0.01);
  }

  /**
   * A leaf turned about its hinge: drawn as vertical strips of its print,
   * each where the eye sees that part of the leaf (its height by its depth),
   * the front face or the back as the eye sees one or the other.
   */
  private drawLeaf(l: LeafRt, open: number, wake: number, ex: number, ey: number, E: number, reduced: boolean, fade: number): void {
    const s = l.spec;
    const { x, floor, z } = this.place;
    // With reduced motion it does not swing: it stands shut or open, faded across the change.
    const turns = s.restAngle !== s.shutAngle;
    const rest = lerp(s.shutAngle, s.restAngle, reduced ? (open < 0.5 ? 0 : 1) : open);
    const dip = reduced && turns ? Math.abs(1 - 2 * open) : 1;
    const wide = reduced ? 0 : (s.wideAngle - s.restAngle) * wake * open;
    const wobble = reduced || s.still ? 0 : Math.sin(this.t * 1.7) * 1.8 * open * (1 - wake * 0.5);
    const th = ((rest + wide + wobble) * Math.PI) / 180;
    const sgn = s.hinge === 'right' ? -1 : 1;
    const hx = x + s.x;
    const hz = z + s.dz;
    const top = floor + s.y;
    const n = l.strips.length;
    const kOf = (zz: number): number => (E - l.zc) / (E - zz);
    // A point of the leaf (u = 0 at the hinge, 1 at the free edge), as seen on the plane it is drawn on.
    const px = (u: number): number => {
      const wx = hx + sgn * u * l.w * Math.cos(th);
      const wz = hz + u * l.w * Math.sin(th);
      return ex + (wx - ex) * kOf(wz);
    };
    const x0 = px(0);
    const x1 = px(1);
    const frontSeen = s.hinge === 'right' ? x1 <= x0 : x1 >= x0;
    const print = frontSeen ? l.front : l.back;
    const ps = print.scale;
    const texW = Math.round(print.w * ps);
    const texH = Math.round(print.h * ps);
    // Which column of the face seen lies u along the leaf.
    const fromLeft = frontSeen === (s.hinge === 'left');
    const lx = (u: number): number => (fromLeft ? u : 1 - u) * l.w;
    for (let i = 0; i < n; i++) {
      const u0 = i / n;
      const u1 = (i + 1) / n;
      const a0 = px(u0);
      const a1 = px(u1);
      const k = kOf(hz + ((u0 + u1) / 2) * l.w * Math.sin(th));
      const left = Math.min(a0, a1);
      const right = Math.max(a0, a1);
      const la = Math.min(lx(u0), lx(u1));
      const lb = Math.max(lx(u0), lx(u1));
      const sx = (right - left) / Math.max(1e-3, (lb - la) * ps);
      // Its columns: the outer ends take the margin too (so the contour shows), and a hair of overlap hides the seams.
      const c0 = la < 0.01 ? 0 : (l.m + la) * ps;
      const c1 = Math.min(texW, lb > l.w - 0.01 ? texW : (l.m + lb) * ps + 1);
      const img = l.strips[i]!;
      if (img.texture.key !== print.texture) img.setTexture(print.texture);
      img.setCrop(c0, 0, Math.max(0.5, c1 - c0), texH);
      img.setScale(sx, k / ps);
      img.setPosition(left - (l.m + la) * ps * sx, ey + (top - l.m - ey) * k);
      img.setAlpha(fade * dip);
      img.setVisible(right - left > 0.1 && fade * dip > 0.01);
    }
  }

  /** A puff of motes as it opens. */
  private burst(): void {
    const sp = this.art.sparks;
    if (!sp) return;
    for (let i = 0; i < 14; i++) this.spawn(sp, 1.6);
  }

  private updateSparks(dt: number, reduced: boolean): void {
    const sp = this.art.sparks;
    if (sp && !reduced) {
      this.sparkDue += dt * sp.rate * (0.15 + 0.85 * this.wake) * clamp01(this.open);
      while (this.sparkDue >= 1) {
        this.sparkDue -= 1;
        this.spawn(sp, 1);
      }
    }
    for (const s of this.sparks) {
      if (s.t >= s.life) continue;
      s.t += dt;
      const u = s.t / s.life;
      s.x += s.vx * dt + Math.sin(s.t * 3 + s.wob) * 10 * dt;
      s.y += s.vy * dt;
      s.vy *= 1 - 0.4 * dt;
      s.img.setPosition(s.x, s.y).setAlpha(Math.sin(Math.PI * Math.min(1, u)) * 0.9).setScale(s.size * (1 - 0.4 * u)).setAngle(s.wob * 30 + s.t * 40);
      if (s.t >= s.life) s.img.setVisible(false);
    }
  }

  private spawn(sp: NonNullable<DoorArt['sparks']>, speed: number): void {
    if (!hasFrame(sp.frame)) return;
    let s = this.sparks.find((q) => q.t >= q.life);
    if (!s) {
      if (this.sparks.length >= 24) return;
      const f = frameRef(sp.frame);
      const img = this.scene.add.image(0, 0, f.atlas, f.frame).setBlendMode(Phaser.BlendModes.ADD).setDepth(450).setVisible(false);
      this.paper.planes.put(img, this.sparkPlane);
      this.paper.lighting.leave(img);
      this.own(img);
      s = { img, t: 0, life: 1, x: 0, y: 0, vx: 0, vy: 0, wob: 0, size: 1 };
      this.sparks.push(s);
    }
    s.t = 0;
    s.life = 1.8 + Math.random() * 1.4;
    s.x = this.place.x + (Math.random() - 0.5) * this.half * 1.2;
    s.y = this.place.floor - this.tall * (0.15 + Math.random() * 0.6);
    s.vx = (Math.random() - 0.6) * 36 * speed;
    s.vy = -(12 + Math.random() * 24) * speed;
    s.wob = Math.random() * 6;
    s.size = sp.size * (0.6 + Math.random() * 0.6);
    s.img.setTint(sp.colors[Math.floor(Math.random() * sp.colors.length)]!).setVisible(true).setAlpha(0);
  }

  destroy(): void {
    this.openTween?.stop();
    this.paper.lighting.remove(this.lamp);
    this.paper.removeShadow(this.shadow);
    for (const o of this.all) o.destroy();
    this.mask?.destroy();
    this.clipCam?.setVisible(false);
  }
}
