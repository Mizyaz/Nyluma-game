import * as Phaser from 'phaser';
import * as THREE from 'three';
import { app } from '../App';
import { VIEW_H } from '../constants';
import type { SolidDef } from '../data/roomTypes';
import type { WorldScene } from '../scenes/WorldScene';
import { isWhalePlatform } from '../rooms/whalePlan';
import { PaperBox, type SolidView } from './box';
import { paperCanvas } from './cards';
import { boxedZ, eyeDistance, offAxis, restCentre, scrollDepth, viewRect, type CamState, type Rect } from './depth';
import { stage as hooks, type LiftOpts, type StageDriver } from './hooks';
import { Lights, type LampAnchor } from './lights';
import { Mirror, swayAngle, type MirrorFrame } from './mirror';
import { Post } from './post';
import { Governor, pickTier, type Tier } from './quality';
import { TextureCache } from './textures';
import { boxFrame, boxTheme, type BoxFrame, type BoxTheme } from './themes';

// The paper diorama under the game: a three.js canvas beneath Phaser's,
// with the same CSS box, drawn after Phaser each frame from Phaser's own
// main camera. While the world scene runs, its room stands in 3D (the box,
// the lifted art and figures, the lights) and Phaser draws what it keeps
// (effects, words, masks, overlays, fades) on a transparent canvas above.
// Menus and other scenes: the stage hides and rests.

/** Vertical field of view at a room's resting zoom (the prototype's). */
const FOV = 34;
/** How far above the view's centre the eye sits (share of the view height): we look down into the box. */
const LIFT = 0.34;
/** The eye trails the view across (seconds to catch up), and at most this share of the view. */
const TRAIL_S = 0.45;
const TRAIL_MAX = 0.07;
/** The flat game's clear colour. */
const FLAT_BG: [number, number, number] = [15, 13, 24];

interface RoomLink {
  world: WorldScene;
  mirror: Mirror;
  box: PaperBox;
  lights: Lights;
  theme: BoxTheme;
  frame: BoxFrame;
  D: number;
  far: number;
  onPreRender: () => void;
  onShutdown: () => void;
}

/**
 * Phaser's additive blend, made to add light without adding coverage: where
 * its canvas is see-through, a glow then brightens the diorama beneath it
 * (the browser composites premultiplied colour with zero alpha as light)
 * instead of hazing it. Over opaque pixels it blends exactly as before.
 */
function additiveOverDiorama(game: Phaser.Game, on: boolean): void {
  const r = game.renderer;
  if (!(r instanceof Phaser.Renderer.WebGL.WebGLRenderer)) return;
  const gl = r.gl;
  const add = r.blendModes[Phaser.BlendModes.ADD] as { func: number[] } | undefined;
  if (add) add.func = on ? [gl.ONE, gl.DST_ALPHA, gl.ZERO, gl.ONE] : [gl.ONE, gl.DST_ALPHA];
}

/** The game's clear colour: transparent while the diorama shows through, else the flat one. */
function phaserClear(game: Phaser.Game, clear: boolean): void {
  const bg = game.config.backgroundColor;
  if (clear) bg.setTo(0, 0, 0, 0);
  else bg.setTo(FLAT_BG[0], FLAT_BG[1], FLAT_BG[2], 255);
}

export class Stage implements StageDriver {
  readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(FOV, 16 / 9, 50, 50000);
  private readonly post: Post;
  private readonly textures: TextureCache;
  private readonly paper: THREE.Texture;
  private readonly governor: Governor;
  private readonly sky = new THREE.Color();
  private link: RoomLink | null = null;
  private boxKey = '';
  private shown = false;
  private dead = false;
  private readonly t0 = performance.now();
  private last = performance.now();
  private eyeX = NaN;
  private lastMs = 0;
  private readonly params: URLSearchParams;

  constructor(
    private readonly game: Phaser.Game,
    params: URLSearchParams,
  ) {
    this.params = params;
    const canvas = document.createElement('canvas');
    canvas.className = 'stage3d';
    canvas.setAttribute('aria-hidden', 'true');
    this.canvas = canvas;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false });
    this.renderer = renderer;
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // No tone curve: the lights add up to 1 on a lit card, so the art keeps
    // its colours where the key light falls and darkens in shadow.
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.info.autoReset = false;
    this.textures = new TextureCache(game.textures);
    this.textures.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    this.paper = this.textures.own(paperCanvas(), true);
    const dbg = renderer.getContext().getExtension('WEBGL_debug_renderer_info');
    const gpu = dbg ? String(renderer.getContext().getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const forced = params.get('q');
    const tier = pickTier(gpu, app.ui?.touch?.enabled ?? matchMedia('(pointer: coarse)').matches, forced);
    this.governor = new Governor(tier, !forced && !params.has('dpr'));
    this.post = new Post({ samples: tier.samples, dof: tier.dof });
    this.camera.matrixAutoUpdate = true;
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.fail('context lost');
    });
    const parent = game.canvas.parentElement;
    if (!parent) throw new Error('no game parent');
    // After Phaser's canvas in the DOM (`#game canvas` still finds Phaser's);
    // beneath it on screen (styles.css).
    parent.append(canvas);
    canvas.style.visibility = 'hidden';
    game.events.on(Phaser.Core.Events.POST_RENDER, this.frame, this);
    additiveOverDiorama(game, true);
    console.info(`[stage] diorama on (${tier.name}${forced ? ', forced' : ''}; ${gpu || 'unknown GPU'})`);
  }

  // ------------------------------------------------------------ driver

  draws(scene: Phaser.Scene): boolean {
    return !this.dead && this.link?.world === scene;
  }

  lift(obj: Phaser.GameObjects.GameObject, opts: LiftOpts): void {
    this.link?.mirror.lift(obj, opts);
  }

  keep(obj: Phaser.GameObjects.GameObject): void {
    this.link?.mirror.unlift(obj);
  }

  attach(scene: Phaser.Scene): void {
    if (this.dead) return;
    const world = scene as WorldScene;
    if (!world.room || !world.def) return;
    if (this.link) this.detach();
    try {
      this.link = this.build(world);
    } catch (e) {
      console.warn('[stage] could not stage the room; flat rendering', e);
      this.link = null;
      this.fail('build');
      return;
    }
    phaserClear(this.game, true);
    this.takeSky();
    this.link.mirror.sweep();
    // Compile every program now (under the tunnel's veil), not mid-walk.
    this.draw(true);
    this.renderer.compile(this.scene, this.camera);
    // The first frames upload the room's art: not a measure of the device.
    this.governor.hold(2500);
  }

  private build(world: WorldScene): RoomLink {
    const def = world.def;
    const theme = boxTheme(def);
    const D = eyeDistance(VIEW_H, world.baseZoom || 1.5, FOV);
    // The box's back is where the room paints its own back wall (a near
    // plane, or an entry with a depth of its own), else the theme's.
    const { back, own } = this.boxBack(world, theme, D);
    const frame = boxFrame(def, theme, back);
    const solids = world.room.solids as unknown as SolidView[];
    const box = new PaperBox(def, solids, theme, frame, this.paper, (s: SolidDef) => isWhalePlatform(s), own);
    const mirror = new Mirror(world, this.textures);
    const anchors = this.lampAnchors(world, theme, back);
    const tier = this.governor.tier;
    const lights = new Lights(theme.lights, frame, anchors, tier.shadow, tier.spotShadows);
    this.scene.add(box.group, mirror.group, lights.group);
    // The far end: the deepest parallax layer, with room to spare.
    let minS = 1;
    for (const img of world.children.list) {
      const sf = (img as unknown as { scrollFactorX?: number }).scrollFactorX ?? 1;
      if (sf > 0 && sf < minS) minS = sf;
    }
    const far = D + Math.abs(scrollDepth(minS, D)) * 1.25 + 4000;
    const onPreRender = (): void => this.preRender();
    const onShutdown = (): void => this.detach();
    world.events.on(Phaser.Scenes.Events.PRE_RENDER, onPreRender);
    world.events.once(Phaser.Scenes.Events.SHUTDOWN, onShutdown);
    this.eyeX = NaN;
    return { world, mirror, box, lights, theme, frame, D, far, onPreRender, onShutdown };
  }

  /**
   * Where the box's back is. A room that paints its own back wall (a plane
   * scrolling at 0.85 and up, like the 14th Room's, or an entry given a
   * depth of its own) sets it there, and the stage then builds no walls of
   * its own; else the theme's depth.
   */
  private boxBack(world: WorldScene, theme: BoxTheme, D: number): { back: number; own: boolean } {
    const zs: number[] = [];
    for (const p of world.def.props ?? []) if (p.z !== undefined && p.z < -30 && p.z > -900) zs.push(p.z);
    for (const go of world.children.list) {
      const z = hooks.mark(go)?.z;
      if (z !== undefined && z < -30 && z > -900) zs.push(z);
      const o = go as unknown as { scrollFactorX?: number; scrollFactorY?: number };
      const sf = o.scrollFactorX ?? 1;
      if (z === undefined && go instanceof Phaser.GameObjects.Image && sf === o.scrollFactorY && sf >= 0.85 && sf < 1) zs.push(scrollDepth(sf, D));
    }
    if (!zs.length) return { back: -theme.depth, own: false };
    return { back: Math.min(...zs) - 1, own: true };
  }

  /** Lights inside the room's lamp props (the hanging lamp's crystal), following their sway. */
  private lampAnchors(world: WorldScene, theme: BoxTheme, back: number): LampAnchor[] {
    const out: LampAnchor[] = [];
    for (const lamp of theme.lights.lamps) {
      for (const p of world.room.props) {
        if (p.def.key !== lamp.key || !p.img) continue;
        const img = p.img;
        const scale = p.def.scale ?? 1;
        const z = p.def.z ?? boxedZ(p.def.depth ?? 10, back);
        const hung = (p.def.oy ?? 1) === 0;
        out.push({
          color: lamp.color,
          intensity: lamp.intensity,
          distance: lamp.distance,
          glow: lamp.glow * scale,
          at: () => {
            if (!img.visible || img.alpha < 0.05 || !img.scene) return null;
            const calm = app.settings.reducedMotion;
            const a = img.rotation + (hung ? swayAngle(this.time, img.x, calm) : 0);
            const [ox, oy] = [lamp.at[0] * scale, lamp.at[1] * scale];
            return { x: img.x + ox * Math.cos(a) - oy * Math.sin(a), y: img.y + ox * Math.sin(a) + oy * Math.cos(a), z };
          },
        });
      }
    }
    return out;
  }

  private detach(): void {
    const l = this.link;
    if (!l) return;
    this.link = null;
    l.world.events.off(Phaser.Scenes.Events.PRE_RENDER, l.onPreRender);
    l.world.events.off(Phaser.Scenes.Events.SHUTDOWN, l.onShutdown);
    // A world that goes on flat gets its sky back.
    if (l.world.sys.isActive()) l.world.cameras.main.setBackgroundColor(`#${this.sky.getHexString(THREE.SRGBColorSpace)}`);
    l.mirror.destroy();
    l.box.dispose();
    l.lights.dispose();
    this.scene.remove(l.box.group, l.mirror.group, l.lights.group);
    phaserClear(this.game, false);
    this.hide();
  }

  /** Gives up the diorama for this session: everything back to Phaser. */
  private fail(why: string): void {
    if (this.dead) return;
    console.warn(`[stage] flat rendering (${why})`);
    const l = this.link;
    if (l) {
      l.mirror.releaseAll();
      this.detach();
    }
    this.dead = true;
    phaserClear(this.game, false);
    additiveOverDiorama(this.game, false);
    this.hide();
    hooks.setDriver(null);
  }

  // ------------------------------------------------------------ frame

  private get time(): number {
    return (performance.now() - this.t0) / 1000;
  }

  /** Before Phaser draws the world: lift what is new, keep its camera see-through. */
  private preRender(): void {
    const l = this.link;
    if (!l) return;
    l.mirror.sweep();
    this.takeSky();
    phaserClear(this.game, true);
  }

  /** The camera's background colour becomes the diorama's sky; Phaser's stays clear. */
  private takeSky(): void {
    const l = this.link;
    if (!l) return;
    const cam = l.world.cameras.main;
    const bg = cam.backgroundColor;
    if (bg.alphaGL > 0) {
      this.sky.setRGB(bg.redGL, bg.greenGL, bg.blueGL, THREE.SRGBColorSpace);
      cam.setBackgroundColor('rgba(0,0,0,0)');
    }
  }

  private hide(): void {
    if (!this.shown) return;
    this.shown = false;
    this.canvas.style.visibility = 'hidden';
  }

  private frame(): void {
    const now = performance.now();
    const real = now - this.last;
    this.last = now;
    const l = this.link;
    if (this.dead || !l || !l.world.sys.isActive() || !l.world.sys.settings.visible) {
      this.hide();
      return;
    }
    const t0 = performance.now();
    this.draw(false);
    this.lastMs = performance.now() - t0;
    if (!this.shown) {
      this.shown = true;
      this.canvas.style.visibility = 'visible';
    }
    const ask = this.governor.sample(real, document.visibilityState === 'visible');
    if (ask === 'tier') this.applyTier(this.governor.tier);
    if (ask) this.boxKey = '';
  }

  private applyTier(t: Tier): void {
    this.post.configure({ samples: t.samples, dof: t.dof });
    this.link?.lights.setShadowSize(t.shadow);
    console.info(`[stage] quality: ${t.name}`);
  }

  /** Keeps the canvas on Phaser's CSS box, at a resolution the device affords. */
  private fit(): void {
    const pc = this.game.canvas;
    const s = pc.style;
    const dpr = window.devicePixelRatio || 1;
    const key = `${s.width}|${s.height}|${s.marginLeft}|${s.marginTop}|${dpr}|${this.governor.scale}|${this.governor.tier.name}`;
    if (key === this.boxKey) return;
    this.boxKey = key;
    let w = parseFloat(s.width);
    let h = parseFloat(s.height);
    if (!(w > 0 && h > 0)) {
      const r = pc.getBoundingClientRect();
      w = r.width || pc.width;
      h = r.height || pc.height;
    }
    const cs = this.canvas.style;
    cs.left = `${pc.offsetLeft}px`;
    cs.top = `${pc.offsetTop}px`;
    cs.width = `${w}px`;
    cs.height = `${h}px`;
    const tier = this.governor.tier;
    const fixed = Number(this.params.get('dpr'));
    let pr = (fixed > 0 ? fixed : Math.min(dpr, tier.dprCap)) * this.governor.scale;
    // Never more pixels than the tier allows.
    pr = Math.min(pr, Math.sqrt(tier.maxPixels / Math.max(1, w * h)));
    const bw = Math.max(2, Math.round(w * pr));
    const bh = Math.max(2, Math.round(h * pr));
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(bw, bh, false);
    this.post.setSize(bw, bh);
  }

  /** Builds the 3D camera from Phaser's main camera and renders the diorama. */
  private draw(warm: boolean): void {
    const l = this.link;
    if (!l) return;
    this.fit();
    const cam = l.world.cameras.main;
    const m = (cam as unknown as { matrix: Phaser.GameObjects.Components.TransformMatrix }).matrix;
    const cs: CamState = { a: m.a, d: m.d, e: m.e, f: m.f, scrollX: cam.scrollX, scrollY: cam.scrollY, w: cam.width, h: cam.height };
    const rect = viewRect(cs);
    const vw = rect.x1 - rect.x0;
    const vh = rect.y1 - rect.y0;
    // The resting eye: the view's middle without the shake.
    const [cx, cy] = restCentre(cs, cam.originX, cam.originY);
    const calm = app.settings.reducedMotion;
    // The eye: a little above the view's centre (we look down into the
    // box), trailing it across a little (the layers slide past).
    const dt = Math.min(0.1, (this.game.loop.delta || 16) / 1000);
    if (!Number.isFinite(this.eyeX) || warm || calm) this.eyeX = cx;
    else {
      this.eyeX += (cx - this.eyeX) * (1 - Math.exp(-dt / TRAIL_S));
      const lim = vw * TRAIL_MAX;
      this.eyeX = Math.max(cx - lim, Math.min(cx + lim, this.eyeX));
    }
    const ex = this.eyeX;
    // The lift follows the view in close-ups but not past the room's
    // resting framing: a wide shot looks at the box as the painting does.
    const baseH = cam.height / (l.world.baseZoom || 1.5);
    const ey = cy - Math.min(vh, baseH) * LIFT;
    const D = l.D;
    const near = D * 0.2;
    const far = l.far;
    const fr = offAxis(rect, ex, ey, D, near);
    const c = this.camera;
    c.position.set(ex, -ey, D);
    c.near = near;
    c.far = far;
    c.updateMatrixWorld();
    c.projectionMatrix.makePerspective(fr.left, fr.right, fr.top, fr.bottom, near, far);
    c.projectionMatrixInverse.copy(c.projectionMatrix).invert();
    const t = this.time;
    const f: MirrorFrame = {
      D,
      t,
      scrollX: cam.scrollX,
      scrollY: cam.scrollY,
      cx,
      cy,
      ex,
      ey,
      back: l.frame.back,
      ox: cam.width * cam.originX,
      oy: cam.height * cam.originY,
      coverage: this.post.settings.samples > 0,
      backdropZ: l.frame.back - 90,
      litDepth: Math.max(700, -l.frame.back * 2.6),
      calm,
      terrainZ: (s) => l.box.frontZ(s),
    };
    l.mirror.sync(f);
    l.box.update();
    l.lights.update(rect as Rect, l.frame.back, l.frame.front, t, calm);
    // Focus on the actors' plane; the box blurs gently away from it. A wide
    // shot keeps more in focus, a close-up less (as a lens would).
    const lens = Math.max(0.35, Math.min(1.4, cam.zoom / (l.world.baseZoom || 1.5)));
    this.post.focus(D, 1150 * lens, lens);
    this.post.strength = calm ? 0.85 : 1;
    this.renderer.setClearColor(this.sky, 1);
    this.renderer.info.reset();
    this.post.render(this.renderer, this.scene, c);
  }

  /** For tests and tuning: what the stage is doing. */
  info(): Record<string, unknown> {
    const r = this.renderer.info;
    return {
      on: !!this.link && !this.dead,
      shown: this.shown,
      room: this.link?.world.def.id ?? null,
      tier: this.governor.tier.name,
      scale: this.governor.scale,
      fps: Math.round(this.governor.fps),
      cpuMs: Math.round(this.lastMs * 100) / 100,
      lifted: this.link?.mirror.count ?? 0,
      calls: r.render.calls,
      triangles: r.render.triangles,
      textures: r.memory.textures,
      geometries: r.memory.geometries,
      size: [this.canvas.width, this.canvas.height],
      D: this.link ? Math.round(this.link.D) : 0,
    };
  }

  /** Average milliseconds per diorama frame over `n` frames, GPU included (waits for each). */
  perf(n = 20): number {
    if (!this.link) return 0;
    const gl = this.renderer.getContext();
    const px = new Uint8Array(4);
    const t0 = performance.now();
    for (let i = 0; i < n; i++) {
      this.draw(false);
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    }
    return (performance.now() - t0) / n;
  }
}

/**
 * Starts the diorama for a game whose canvas is transparent. Returns null
 * (and the game stays flat) when three.js cannot run here.
 */
export function createStage(game: Phaser.Game, params: URLSearchParams): Stage | null {
  try {
    const s = new Stage(game, params);
    hooks.setDriver(s);
    if (__E2E__ || import.meta.env.DEV) (window as unknown as { __stage: Stage }).__stage = s;
    return s;
  } catch (e) {
    console.warn('[stage] 3D unavailable; flat rendering', e);
    phaserClear(game, false);
    return null;
  }
}
