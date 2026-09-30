import * as Phaser from 'phaser';
import * as THREE from 'three';
import { DEPTH } from '../constants';
import { affine, bandZ, depthScale, itrs, mul, scrollDepth, type Affine } from './depth';
import { EDGE_TINT, cardMaterial, quadGeometry, setCardAlpha, setQuadUV, type CardMaterial } from './cards';
import { stage as hooks, type LiftOpts } from './hooks';
import type { TextureCache } from './textures';
import type { SolidDef } from '../data/roomTypes';

// Lifting: each lifted Phaser object (an image, a sprite, a text, a tile
// sprite, or a container of them) is mirrored by textured cards that follow
// it every frame: frame and UVs, position, scale, rotation, flip, origin,
// crop, alpha, tint, blend and visibility, through its containers' world
// transforms. The original is hidden from Phaser's main camera only. A
// card's depth comes from its options, its scroll factor or its DEPTH band;
// the children of a container stand a hair apart in their draw order.

type GO = Phaser.GameObjects.GameObject;
type Img = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

/** What the mirror needs to know about the frame being drawn. */
export interface MirrorFrame {
  /** Eye distance. */
  D: number;
  /** Seconds since the stage started (sway). */
  t: number;
  scrollX: number;
  scrollY: number;
  /** The view's centre on z = 0 (the resting eye). */
  cx: number;
  cy: number;
  /** Phaser camera origin in screen px (640, 360). */
  ox: number;
  oy: number;
  /** Alpha-to-coverage is available (multisampled picture). */
  coverage: boolean;
  /** Where screen-pinned backdrops (scroll factor 0) stand. */
  backdropZ: number;
  /** Beyond this depth, lifted art is not lit (far layers). */
  litDepth: number;
  /** Reduced motion: no sway. */
  calm: boolean;
  /** Depth of the front face of a solid's slab (terrain art stands on it); NaN: no art there. */
  terrainZ: (s: SolidDef) => number;
}

/** The swing of a hung piece at time t (radians); its x staggers neighbours. */
export function swayAngle(t: number, x: number, calm: boolean): number {
  if (calm) return 0;
  const ph = x * 0.013;
  return 0.022 * Math.sin(t * 0.8 + ph) + 0.007 * Math.sin(t * 2.1 + 1 + ph);
}

/** Is `go` (still) part of the lifted object `root`? */
function belongs(go: GO, root: GO): boolean {
  let g: GO | null = go;
  while (g) {
    if (g === root) return true;
    g = g.parentContainer;
  }
  return false;
}

interface Node {
  go: GO;
  mesh: THREE.Mesh;
  edge: THREE.Mesh | null;
  mat: CardMaterial;
  edgeMat: CardMaterial | null;
  geo: THREE.BufferGeometry;
  additive: boolean;
  lit: boolean;
  /** Identity of the drawn frame and UV rect (to skip rewriting UVs). */
  uvKey: string;
  tex: THREE.Texture | null;
  /** Graphics and text: the canvas the node shows, and its signature. */
  canvas: HTMLCanvasElement | null;
  sig: string;
  box: { x: number; y: number; w: number; h: number; res: number } | null;
  seen: number;
}

interface Lifted {
  obj: GO;
  opts: LiftOpts;
  nodes: Map<GO, Node>;
  onDestroy: () => void;
}

const M4 = new THREE.Matrix4();
const tmp = { m: affine(), n: affine(), q: affine(), p: affine(), w: affine() };

function isImage(go: GO): go is Img {
  return go instanceof Phaser.GameObjects.Image || go instanceof Phaser.GameObjects.Sprite;
}

/** Can the mirror draw this object (and everything in it)? */
function drawable(go: GO): boolean {
  const m = go as unknown as { mask?: unknown; postPipelines?: unknown[]; blendMode?: number };
  if (m.mask) return false;
  if (m.postPipelines && m.postPipelines.length) return false;
  if (go instanceof Phaser.GameObjects.Container) return go.list.every((c) => drawable(c));
  if (isImage(go) || go instanceof Phaser.GameObjects.Graphics || go instanceof Phaser.GameObjects.Text || go instanceof Phaser.GameObjects.TileSprite) {
    const b = m.blendMode ?? 0;
    return b === Phaser.BlendModes.NORMAL || b === Phaser.BlendModes.ADD || b === Phaser.BlendModes.SKIP_CHECK;
  }
  return false;
}

/**
 * Plain world art the stage lifts by itself: images, sprites and
 * containers of them, below DEPTH.fx, normally blended, unmasked.
 */
export function eligible(go: GO): boolean {
  const o = go as unknown as { depth?: number; blendMode?: number; mask?: unknown };
  if ((o.depth ?? 0) >= DEPTH.fx) return false;
  if (o.mask) return false;
  if (isImage(go)) return (o.blendMode ?? 0) === Phaser.BlendModes.NORMAL && drawable(go);
  if (go instanceof Phaser.GameObjects.Container) {
    // Only containers of pictures: no shapes, particles or texts inside.
    const pictures = (c: GO): boolean => (c instanceof Phaser.GameObjects.Container ? c.list.every(pictures) : isImage(c));
    return go.list.length > 0 && go.list.every(pictures) && drawable(go);
  }
  return false;
}

/** Bounds of a Graphics' drawing in its own space, from its command list. */
function graphicsBounds(g: Phaser.GameObjects.Graphics): { x: number; y: number; w: number; h: number } | null {
  const b = g.commandBuffer as number[];
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  let lw = 0;
  const pt = (x: number, y: number, r = 0): void => {
    x0 = Math.min(x0, x - r);
    y0 = Math.min(y0, y - r);
    x1 = Math.max(x1, x + r);
    y1 = Math.max(y1, y + r);
  };
  const C = { ARC: 0, FILL_RECT: 3, LINE_TO: 4, MOVE_TO: 5, LINE_STYLE: 6, FILL_STYLE: 7, FILL_TRIANGLE: 10, STROKE_TRIANGLE: 11, TRANSLATE: 16, SCALE: 17, ROTATE: 18, GRAD_FILL: 21, GRAD_LINE: 22 };
  for (let i = 0; i < b.length; i++) {
    switch (b[i]) {
      case C.ARC:
        pt(b[i + 1]!, b[i + 2]!, b[i + 3]!);
        i += 7;
        break;
      case C.LINE_STYLE:
        lw = Math.max(lw, b[i + 1]!);
        i += 3;
        break;
      case C.FILL_STYLE:
        i += 2;
        break;
      case C.FILL_RECT:
        pt(b[i + 1]!, b[i + 2]!);
        pt(b[i + 1]! + b[i + 3]!, b[i + 2]! + b[i + 4]!);
        i += 4;
        break;
      case C.FILL_TRIANGLE:
      case C.STROKE_TRIANGLE:
        pt(b[i + 1]!, b[i + 2]!);
        pt(b[i + 3]!, b[i + 4]!);
        pt(b[i + 5]!, b[i + 6]!);
        i += 6;
        break;
      case C.LINE_TO:
      case C.MOVE_TO:
        pt(b[i + 1]!, b[i + 2]!);
        i += 2;
        break;
      case C.TRANSLATE:
      case C.SCALE:
        // Transformed drawing: give up on exact bounds.
        return null;
      case C.ROTATE:
        return null;
      case C.GRAD_FILL:
        i += 5;
        break;
      case C.GRAD_LINE:
        i += 6;
        break;
      default:
        break;
    }
  }
  if (!Number.isFinite(x0)) return null;
  const pad = lw + 2;
  return { x: Math.floor(x0 - pad), y: Math.floor(y0 - pad), w: Math.ceil(x1 - x0 + pad * 2), h: Math.ceil(y1 - y0 + pad * 2) };
}

/** A cheap signature of a Graphics' commands (redraw its snapshot when it changes). */
function graphicsSig(g: Phaser.GameObjects.Graphics): string {
  const b = g.commandBuffer as number[];
  let h = b.length;
  for (let i = 0; i < b.length; i++) h = (h * 31 + Math.round((b[i] ?? 0) * 16)) | 0;
  return String(h);
}

/** Draws a Graphics' commands (in its own space) into a canvas, as Phaser's canvas renderer does. */
function snapshotGraphics(g: Phaser.GameObjects.Graphics, box: { x: number; y: number; w: number; h: number }, res: number, into: HTMLCanvasElement | null): HTMLCanvasElement {
  const c = into ?? document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(box.w * res));
  c.height = Math.max(1, Math.ceil(box.h * res));
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, c.width, c.height);
  const cam = Phaser.GameObjects.Graphics.TargetCamera;
  cam.setScene(g.scene);
  cam.setViewport(0, 0, c.width, c.height);
  cam.scrollX = 0;
  cam.scrollY = 0;
  const saved = { x: g.x, y: g.y, r: g.rotation, sx: g.scaleX, sy: g.scaleY, a: g.alpha, fx: g.scrollFactorX, fy: g.scrollFactorY };
  g.x = -box.x * res;
  g.y = -box.y * res;
  g.rotation = 0;
  g.scaleX = res;
  g.scaleY = res;
  g.alpha = 1;
  g.scrollFactorX = 1;
  g.scrollFactorY = 1;
  try {
    (g as unknown as { renderCanvas: (...a: unknown[]) => void }).renderCanvas(g.scene.sys.renderer, g, cam, null, ctx, false);
  } finally {
    g.x = saved.x;
    g.y = saved.y;
    g.rotation = saved.r;
    g.scaleX = saved.sx;
    g.scaleY = saved.sy;
    g.alpha = saved.a;
    g.scrollFactorX = saved.fx;
    g.scrollFactorY = saved.fy;
    cam.renderList.length = 0;
  }
  return c;
}

export class Mirror {
  readonly group = new THREE.Group();
  private readonly lifted = new Map<GO, Lifted>();
  private readonly seen = new WeakSet<GO>();
  private frameNo = 0;
  /** Card textures for Graphics snapshots (not in Phaser's texture manager). */
  private readonly own = new Map<Node, THREE.Texture>();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly textures: TextureCache,
  ) {
    this.group.name = 'lifted';
    this.group.matrixAutoUpdate = false;
  }

  get count(): number {
    return this.lifted.size;
  }

  has(go: GO): boolean {
    return this.lifted.has(go);
  }

  /** Stands an object up in the diorama (or updates its options). */
  lift(go: GO, opts: LiftOpts): void {
    if (opts.keep) {
      this.unlift(go);
      return;
    }
    // Children are drawn with their container; their marks are read there.
    if (go.parentContainer) return;
    if (!drawable(go)) return;
    const had = this.lifted.get(go);
    if (had) {
      had.opts = opts;
      return;
    }
    const onDestroy = (): void => this.unlift(go);
    go.once(Phaser.GameObjects.Events.DESTROY, onDestroy);
    this.lifted.set(go, { obj: go, opts, nodes: new Map(), onDestroy });
    this.scene.cameras.main.ignore(go);
  }

  /** Gives an object back to Phaser. */
  unlift(go: GO): void {
    const l = this.lifted.get(go);
    if (!l) return;
    this.lifted.delete(go);
    go.off(Phaser.GameObjects.Events.DESTROY, l.onDestroy);
    for (const n of l.nodes.values()) this.dispose(n);
    const cam = this.scene.cameras?.main;
    if (cam && go.scene) go.cameraFilter &= ~cam.id;
  }

  /** Gives everything back (flat mode, or the stage is going away). */
  releaseAll(): void {
    for (const go of [...this.lifted.keys()]) this.unlift(go);
  }

  /**
   * Lifts the scene's marked objects and its plain world art that is new
   * since the last sweep (before Phaser draws the frame).
   */
  sweep(): void {
    for (const go of this.scene.children.list) {
      if (this.seen.has(go)) continue;
      this.seen.add(go);
      const mark = hooks.mark(go);
      if (mark?.keep) continue;
      if (mark) this.lift(go, mark);
      else if (eligible(go)) this.lift(go, {});
    }
    // Lifted containers that gained something the mirror cannot draw go back.
    for (const l of this.lifted.values()) {
      if (l.obj instanceof Phaser.GameObjects.Container && !drawable(l.obj)) this.unlift(l.obj);
    }
  }

  /** Follows every lifted object for this frame. */
  sync(f: MirrorFrame): void {
    this.frameNo++;
    const list = this.scene.children.list;
    // Ties in depth keep Phaser's order: a hair nearer for each later one.
    let lastDepth = NaN;
    let tie = 0;
    const order = new Map<GO, number>();
    for (const go of list) {
      const d = (go as unknown as { depth: number }).depth;
      if (d === lastDepth) tie++;
      else {
        tie = 0;
        lastDepth = d;
      }
      if (this.lifted.has(go)) order.set(go, tie);
    }
    for (const l of this.lifted.values()) {
      const go = l.obj;
      if (go.parentContainer || !go.scene) {
        this.unlift(go);
        continue;
      }
      const onList = go.displayList === this.scene.children || order.has(go);
      this.place(l, f, onList ? (order.get(go) ?? 0) : -1);
    }
    for (const l of this.lifted.values()) {
      for (const [go, n] of l.nodes) {
        if (n.seen === this.frameNo) continue;
        n.mesh.visible = false;
        if (n.edge) n.edge.visible = false;
        // Destroyed, or taken out of the lifted object: its cards go.
        if (!go.scene || !belongs(go, l.obj)) {
          this.dispose(n);
          l.nodes.delete(go);
        }
      }
    }
  }

  private place(l: Lifted, f: MirrorFrame, tie: number): void {
    const go = l.obj as GO & Phaser.GameObjects.Components.Transform & Phaser.GameObjects.Components.ScrollFactor & Phaser.GameObjects.Components.Depth;
    const o = l.opts;
    if (tie < 0) return;
    const sfx = go.scrollFactorX;
    const sfy = go.scrollFactorY;
    const P = tmp.p;
    let z: number;
    if (o.as === 'terrain' && o.solid) {
      const front = o.z ?? f.terrainZ(o.solid);
      // Clean paper there: the art is not drawn (Phaser does not draw it either).
      if (Number.isNaN(front)) return;
      z = front + 0.4 + tie * 0.01;
      P.a = 1;
      P.b = 0;
      P.c = 0;
      P.d = 1;
      P.e = 0;
      P.f = 0;
    } else if (sfx === 1 && sfy === 1) {
      z = (o.z ?? bandZ(go.depth)) + tie * 0.01;
      P.a = 1;
      P.b = 0;
      P.c = 0;
      P.d = 1;
      P.e = 0;
      P.f = 0;
    } else if (o.z === undefined && sfx === sfy && sfx > 0) {
      // A parallax layer: static at the depth its scroll factor implies.
      z = scrollDepth(sfx, f.D) + tie * 0.05;
      const k = 1 / sfx;
      P.a = k;
      P.b = 0;
      P.c = 0;
      P.d = k;
      P.e = f.ox * (1 - k);
      P.f = f.oy * (1 - k);
    } else if (o.z !== undefined && sfx === sfy) {
      z = o.z + tie * 0.01;
      P.a = 1;
      P.b = 0;
      P.c = 0;
      P.d = 1;
      P.e = 0;
      P.f = 0;
    } else {
      // Pinned to the screen on an axis: placed anew each frame so that it
      // looks where Phaser would draw it.
      z = o.z ?? (sfx > 0 && sfx !== 1 ? scrollDepth(sfx, f.D) : f.backdropZ);
      const k = depthScale(z, f.D);
      P.a = 1 / k;
      P.b = 0;
      P.c = 0;
      P.d = 1 / k;
      P.e = ((1 - sfx) * f.scrollX) / k + f.cx * (1 - 1 / k);
      P.f = ((1 - sfy) * f.scrollY) / k + f.cy * (1 - 1 / k);
    }
    // Far layers and screen-pinned backdrops are not lit.
    const lit = o.lit ?? (Math.abs(z) < f.litDepth && !(sfx === 0 && sfy === 0));
    const rig = !!o.rig;
    const dz = o.dz ?? (rig ? 0.7 : 0.3);
    const decal = o.as === 'decal';
    const terrain = o.as === 'terrain';
    const thick = o.thick ?? (decal || terrain || !lit ? 0 : rig ? 0.35 : go.depth <= -50 ? 1.2 : 3);
    const cast = o.cast ?? (lit && !decal && !terrain && thick > 0);
    // Sway: things hung from their top swing gently about it.
    const sway = o.sway ? swayAngle(f.t, go.x ?? 0, f.calm) : 0;
    const ctx: WalkCtx = { l, f, z, dz, lit, cast, thick, rig, decal, terrain, idx: 0, sway, cropTop: terrain && o.solid ? o.solid.y : null };
    tmp.m.a = 1;
    tmp.m.b = 0;
    tmp.m.c = 0;
    tmp.m.d = 1;
    tmp.m.e = 0;
    tmp.m.f = 0;
    this.walk(go, ctx, P, 1, true);
  }

  private walk(go: GO, c: WalkCtx, parent: Affine, alpha: number, top: boolean): void {
    const t = go as GO & Phaser.GameObjects.Components.Transform & Phaser.GameObjects.Components.Visible & Phaser.GameObjects.Components.AlphaSingle;
    if (!t.visible) return;
    const a = alpha * t.alpha;
    if (a <= 0.002) return;
    if (go instanceof Phaser.GameObjects.Container) {
      const m = affine();
      itrs(go.x, go.y, go.rotation + (top ? c.sway : 0), go.scaleX, go.scaleY, m);
      mul(parent, m, m);
      for (const child of go.list) this.walk(child, c, m, a, false);
      return;
    }
    const n = this.node(c.l, go, c);
    if (!n) return;
    this.draw(n, go, c, parent, a, top);
  }

  private node(l: Lifted, go: GO, c: WalkCtx): Node | null {
    let n = l.nodes.get(go);
    const blend = (go as unknown as { blendMode: number }).blendMode;
    const additive = blend === Phaser.BlendModes.ADD;
    const lit = (hooks.mark(go)?.lit ?? c.lit) && !additive;
    if (n && (n.additive !== additive || n.lit !== lit)) {
      this.dispose(n);
      l.nodes.delete(go);
      n = undefined;
    }
    if (n) return n;
    const geo = quadGeometry();
    const mat = cardMaterial(null, { lit, additive });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = true;
    const withEdge = c.thick > 0 && !additive && lit && hooks.mark(go)?.lit !== false;
    let edge: THREE.Mesh | null = null;
    let edgeMat: CardMaterial | null = null;
    if (withEdge) {
      edgeMat = cardMaterial(null, { lit: true, additive: false });
      edgeMat.color.setHex(EDGE_TINT);
      edge = new THREE.Mesh(geo, edgeMat);
      edge.matrixAutoUpdate = false;
      edge.receiveShadow = true;
      this.group.add(edge);
    }
    this.group.add(mesh);
    n = { go, mesh, edge, mat, edgeMat, geo, additive, lit, uvKey: '', tex: null, canvas: null, sig: '', box: null, seen: 0 };
    l.nodes.set(go, n);
    return n;
  }

  private draw(n: Node, go: GO, c: WalkCtx, parent: Affine, alpha: number, top: boolean): void {
    // The art's rectangle in the object's own space, and its UVs.
    let x = 0;
    let y = 0;
    let w = 0;
    let h = 0;
    let u0 = 0;
    let v0 = 0;
    let u1 = 1;
    let v1 = 1;
    let flipX = 1;
    let flipY = 1;
    let tex: THREE.Texture | null = null;
    let key = '';
    const t = go as GO & Phaser.GameObjects.Components.Transform;
    if (go instanceof Phaser.GameObjects.Graphics) {
      const sig = graphicsSig(go);
      if (sig !== n.sig || !n.box) {
        n.sig = sig;
        const box = graphicsBounds(go);
        if (!box || box.w <= 0 || box.h <= 0 || box.w * box.h > 4e6) return;
        const res = Math.min(2, 2048 / Math.max(box.w, box.h));
        n.canvas = snapshotGraphics(go, box, res, n.canvas);
        n.box = { ...box, res };
        const old = this.own.get(n);
        old?.dispose();
        const nt = this.textures.own(n.canvas);
        this.own.set(n, nt);
      }
      tex = this.own.get(n) ?? null;
      const b = n.box!;
      x = b.x;
      y = b.y;
      w = b.w;
      h = b.h;
      key = `g${n.sig}`;
    } else if (go instanceof Phaser.GameObjects.TileSprite) {
      const ts = go as Phaser.GameObjects.TileSprite & { updateCanvas(): void; fillCanvas: HTMLCanvasElement; displayFrame: Phaser.Textures.Frame };
      ts.updateCanvas();
      const fc = ts.fillCanvas;
      if (!fc) return;
      if (n.canvas !== fc) {
        n.canvas = fc;
        this.own.get(n)?.dispose();
        this.own.set(n, this.textures.own(fc, true));
      }
      tex = this.own.get(n) ?? null;
      w = ts.width;
      h = ts.height;
      x = -ts.originX * w;
      y = -ts.originY * h;
      const fw = ts.displayFrame.width * ts.tileScaleX;
      const fh = ts.displayFrame.height * ts.tileScaleY;
      u0 = (ts.tilePositionX % ts.displayFrame.width) / ts.displayFrame.width;
      v0 = (ts.tilePositionY % ts.displayFrame.height) / ts.displayFrame.height;
      u1 = u0 + w / fw;
      v1 = v0 + h / fh;
      if (ts.flipX) flipX = -1;
      if (ts.flipY) flipY = -1;
      key = `t${u0},${v0},${u1},${v1}`;
    } else {
      const im = go as Img | Phaser.GameObjects.Text;
      const frame = im.frame;
      if (!frame) return;
      if (go instanceof Phaser.GameObjects.Text) {
        const sig = `${go.text}|${go.canvas.width}x${go.canvas.height}|${go.style.color}|${go.style.fontSize}`;
        if (sig !== n.sig) {
          n.sig = sig;
          this.textures.refresh(frame);
        }
      }
      tex = this.textures.forFrame(frame);
      const dox = im.displayOriginX;
      const doy = im.displayOriginY;
      let fx = frame.x;
      let fy = frame.y;
      w = frame.cutWidth;
      h = frame.cutHeight;
      u0 = frame.u0;
      v0 = frame.v0;
      u1 = frame.u1;
      v1 = frame.v1;
      if (im.isCropped) {
        const crop = (im as unknown as { _crop: { flipX: boolean; flipY: boolean; u0: number; v0: number; u1: number; v1: number; width: number; height: number; x: number; y: number } })._crop;
        if (crop.flipX !== im.flipX || crop.flipY !== im.flipY) frame.updateCropUVs(crop as unknown as object, im.flipX, im.flipY);
        u0 = crop.u0;
        v0 = crop.v0;
        u1 = crop.u1;
        v1 = crop.v1;
        w = crop.width;
        h = crop.height;
        fx = crop.x;
        fy = crop.y;
      }
      x = -dox + fx;
      y = -doy + fy;
      if (im.flipX) {
        if (!frame.customPivot) x += -frame.realWidth + dox * 2;
        flipX = -1;
      }
      if (im.flipY) {
        if (!frame.customPivot) y += -frame.realHeight + doy * 2;
        flipY = -1;
      }
      key = `${frame.texture.key}|${frame.name}|${u0},${v0},${u1},${v1}`;
    }
    if (!tex || w <= 0 || h <= 0) return;
    // Object matrix (with the sway of a hanging top-level piece).
    const rot = t.rotation + (top ? c.sway : 0);
    const M = itrs(t.x, t.y, rot, t.scaleX * flipX, t.scaleY * flipY, tmp.q);
    mul(parent, M, M);
    // The unit quad → the art's rectangle → world.
    const Q = tmp.w;
    Q.a = M.a * w;
    Q.b = M.b * w;
    Q.c = M.c * h;
    Q.d = M.d * h;
    Q.e = M.a * x + M.c * y + M.e;
    Q.f = M.b * x + M.d * y + M.f;
    // Terrain art: cut off the painted top face above the solid's line
    // (the slab's real top replaces it).
    if (c.cropTop !== null && Q.b === 0 && Q.d > 0) {
      const cut = (c.cropTop - Q.f) / Q.d;
      if (cut >= 1) return;
      if (cut > 0) {
        Q.f += Q.d * cut;
        Q.d *= 1 - cut;
        v0 += (v1 - v0) * cut;
        key += `|cut${cut.toFixed(4)}`;
      }
    }
    if (key !== n.uvKey) {
      n.uvKey = key;
      setQuadUV(n.geo, u0, v0, u1, v1);
    }
    if (n.tex !== tex) {
      n.tex = tex;
      n.mat.map = tex;
      n.mat.needsUpdate = true;
      if (n.edgeMat) {
        n.edgeMat.map = tex;
        n.edgeMat.needsUpdate = true;
      }
    }
    const z = c.z + c.idx * c.dz;
    c.idx++;
    if (c.decal) {
      // Lying on the ground: the art's height runs into the depth.
      const gy = t.y;
      const s = 2.6;
      M4.set(Q.a, Q.c, 0, Q.e, 0, 0, 1, -gy + 0.8, s * Q.b, s * Q.d, 0, s * (Q.f - gy), 0, 0, 0, 1);
    } else {
      M4.set(Q.a, Q.c, 0, Q.e, -Q.b, -Q.d, 0, -Q.f, 0, 0, 1, z, 0, 0, 0, 1);
    }
    n.mesh.matrix.copy(M4);
    n.mesh.matrixWorldNeedsUpdate = true;
    n.mesh.visible = true;
    n.seen = this.frameNo;
    const tint = (go as unknown as { tintTopLeft?: number }).tintTopLeft ?? 0xffffff;
    if (n.mat.color.getHex() !== tint) n.mat.color.setHex(tint);
    setCardAlpha(n.mat, alpha, c.f.coverage);
    n.mesh.castShadow = c.cast && alpha > 0.5 && !n.additive;
    n.mesh.receiveShadow = n.lit;
    n.mesh.renderOrder = c.decal ? 1 : 0;
    if (c.decal) {
      n.mat.depthWrite = false;
      n.mat.polygonOffset = true;
      n.mat.polygonOffsetFactor = -2;
      n.mat.polygonOffsetUnits = -2;
    }
    if (n.edge && n.edgeMat) {
      const e = c.rig ? [0.8, 1.1] : [1.1, 1.4];
      const back = c.rig ? c.dz * 0.5 : c.thick;
      M4.elements[12] += e[0]!;
      M4.elements[13] -= e[1]!;
      M4.elements[14] -= back;
      n.edge.matrix.copy(M4);
      n.edge.matrixWorldNeedsUpdate = true;
      n.edge.visible = alpha > 0.35;
      setCardAlpha(n.edgeMat, alpha, c.f.coverage);
    }
  }

  private dispose(n: Node): void {
    this.group.remove(n.mesh);
    if (n.edge) this.group.remove(n.edge);
    n.geo.dispose();
    n.mat.dispose();
    n.edgeMat?.dispose();
    const own = this.own.get(n);
    if (own) {
      own.dispose();
      this.own.delete(n);
    }
  }

  destroy(): void {
    this.releaseAll();
    this.group.clear();
  }
}

interface WalkCtx {
  l: Lifted;
  f: MirrorFrame;
  z: number;
  dz: number;
  lit: boolean;
  cast: boolean;
  thick: number;
  rig: boolean;
  decal: boolean;
  terrain: boolean;
  /** Running index of the cards drawn so far (draw order within a container). */
  idx: number;
  sway: number;
  cropTop: number | null;
}
