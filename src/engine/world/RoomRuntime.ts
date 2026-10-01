import * as Phaser from 'phaser';
import { DEPTH, LATENT_GRACE_S, VIEW_W } from '../constants';
import { hex, P } from '../../render/2d/palette';
import { hashSeed } from '../../render/2d/svg';
import { paintSolid, TERRAIN_MARGIN } from '../../render/2d/painters/terrain';
import { themeDef } from '../../render/2d/painters/backgrounds';
import { addStaticCanvas, artCanvas, frameRef, hasFrame, registerCanvas, unregister } from '../../render/2d/TextureFactory';
import { Rng } from '../../render/2d/svg';
import type {
  AnchorDef,
  CheckpointDef,
  ExitDef,
  Gate,
  InteractDef,
  MemoryPickupDef,
  PropDef,
  Rect,
  RoomDef,
  SiteDef,
  SolidDef,
  SongNodeDef,
  TriggerDef,
} from '../../content/data/roomTypes';
import type { Quest } from '../state/GameState';
import { evalCond, type CondCtx } from '../content/cond';
import type { SkyOut } from '../content/types';
import { WhalePlatforms } from '../../gameplay/whales/WhalePlatforms';
import { isWhalePlatform } from '../../gameplay/whales/whalePlan';
import type { PaperStage } from '../../paper';
import { isBoxFloor, propZ, type RoomStaging } from '../../content/stage';

export interface SolidRt {
  def: SolidDef;
  index: number;
  zone: Phaser.GameObjects.Zone;
  body: Phaser.Physics.Arcade.StaticBody;
  images: Phaser.GameObjects.Image[];
  active: boolean;
  /** Latent reveal amount 0..1 (visual). */
  reveal: number;
  /** Seconds a latent platform stays solid after focus ends. */
  grace: number;
}

interface ChunkDesc {
  solid: SolidRt;
  x: number;
  y: number;
  w: number;
  h: number;
  key: string;
  image: Phaser.GameObjects.Image | null;
}

export interface Marker<T> {
  def: T;
  img: Phaser.GameObjects.Image | null;
  glow: Phaser.GameObjects.Image | null;
  active: boolean;
}

const CHUNK = 1024;
const STREAM_THRESHOLD = 6000;
/** Terrain texture resolution (logical px → texels). */
const TERRAIN_RES = 1.5;

/**
 * Builds a room from data: parallax layers, collision-aligned terrain,
 * props, markers and gated elements. Every gated element is derived from
 * quest flags, so reloading a checkpoint rebuilds exactly the same state.
 */
export class RoomRuntime {
  readonly def: RoomDef;
  private scene: Phaser.Scene;
  private quest: Quest;
  readonly group: Phaser.Physics.Arcade.StaticGroup;
  solids: SolidRt[] = [];
  props: Marker<PropDef>[] = [];
  anchors: Marker<AnchorDef>[] = [];
  nodes: Marker<SongNodeDef>[] = [];
  sites: Marker<SiteDef>[] = [];
  interacts: Marker<InteractDef>[] = [];
  memories: (Marker<MemoryPickupDef> & { taken: boolean })[] = [];
  checkpoints: (Marker<CheckpointDef> & { lit: boolean })[] = [];
  exits: Marker<ExitDef>[] = [];
  triggers: (Marker<TriggerDef> & { fired: boolean })[] = [];
  private chunks: ChunkDesc[] = [];
  private streamed = false;
  private texKeys = new Set<string>();
  latentActive = false;
  /** Whales swimming where the wooden and root jumps were. */
  whales: WhalePlatforms | null = null;

  constructor(
    scene: Phaser.Scene,
    def: RoomDef,
    quest: Quest,
    private readonly paper: PaperStage,
    private readonly staged: RoomStaging,
  ) {
    this.scene = scene;
    this.def = def;
    this.quest = quest;
    this.group = scene.physics.add.staticGroup();
  }

  /** Whether a gated thing is there now: its `when` holds and its `unless` does not (cond.ts). */
  isOn(g: Gate | undefined): boolean {
    if (!g) return true;
    if (g.when && !evalCond(g.when, this.condCtx())) return false;
    if (g.unless && evalCond(g.unless, this.condCtx())) return false;
    return true;
  }

  /** The state conditions are read against. */
  /** Which one shines now (the world scene keeps it: Gorti's kahkaha swaps it). */
  sky: SkyOut = 'none';

  condCtx(): CondCtx {
    return { has: (f) => this.quest.has(f), form: this.quest.progress.form, room: this.def.id, sky: this.sky };
  }

  build(): void {
    const d = this.def;
    this.scene.physics.world.setBounds(0, 0, d.width, d.height + 600);
    this.scene.physics.world.setBoundsCollision(true, true, true, false);
    this.buildBackground();
    this.streamed = d.width > STREAM_THRESHOLD;
    d.solids.forEach((s, i) => this.addSolid(s, i));
    for (const p of d.props ?? []) this.addProp(p);
    for (const a of d.anchors ?? []) this.anchors.push(this.marker(a, 'prop.anchor', a.x, a.y, DEPTH.interact, 0.5, 0.5, P.violet));
    for (const n of d.songNodes ?? []) this.nodes.push(this.marker(n, 'prop.node', n.x, n.y + 2, DEPTH.interact, 0.5, 1, P.crystalTeal));
    for (const s of d.sites ?? []) this.sites.push(this.marker(s, 'prop.site', s.x, s.y + 3, DEPTH.props, 0.5, 1, P.violet));
    for (const it of d.interacts ?? []) this.interacts.push({ def: it, img: null, glow: null, active: this.isOn(it) });
    for (const m of d.memories ?? []) {
      const taken = this.quest.hasMemory(m.id);
      const mk = this.marker(m, 'prop.memory', m.x, m.y - 34, DEPTH.interact, 0.5, 0.5, P.vein);
      this.memories.push({ ...mk, taken, active: !taken });
    }
    for (const c of d.checkpoints) {
      const lit = this.quest.has(`cp:${c.id}`) || this.quest.progress.checkpoint === c.id;
      let img: Phaser.GameObjects.Image | null = null;
      if (!c.silent) img = this.image(lit ? 'prop.lantern.lit' : 'prop.lantern', c.x - 46, c.y + 2, DEPTH.props, 0.5, 1);
      this.checkpoints.push({ def: c, img, glow: null, active: true, lit });
    }
    for (const e of d.exits) this.exits.push({ def: e, img: null, glow: null, active: this.isOn(e) });
    for (const t of d.triggers ?? []) this.triggers.push({ def: t, img: null, glow: null, active: this.isOn(t), fired: false });
    this.refresh(false);
  }

  // ------------------------------------------------------------ background

  /**
   * The room's scenery, painted on the box's back wall as a diorama's
   * backdrop is: the theme's layers one over the other, printed at the back
   * wall's own scale in strips of whole texels (so they meet without seams).
   */
  private buildBackground(): void {
    const st = this.staged;
    if (!st.backdrop) return;
    const box = st.box;
    const theme = themeDef(this.def.theme);
    const layers = theme.layers.filter((l) => !l.area);
    if (!layers.length) return;
    const z = box.back + 1;
    const w = box.x1 - box.x0;
    const h = box.floor - box.top;
    // The painted horizon at the eye's height, as a real backdrop would have it.
    const horizon = Math.round(box.floor - st.framing.height - box.top);
    // Exact for the back wall, but never more than ~14 Mpx for a room.
    const res = Math.min(this.paper.printScale(z), Math.sqrt(14e6 / (w * h)));
    const STRIP = 2040;
    const pieceW = STRIP / res;
    const pieces = Math.ceil(w / pieceW);
    const th = Math.ceil(h * res);
    for (let pi = 0; pi < pieces; pi++) {
      // Each strip reaches 2 texels into the next, so no hairline shows between them.
      const tw = Math.min(STRIP + 2, Math.ceil((w - pi * pieceW) * res));
      const [c, ctx] = artCanvas(Math.max(2, tw), Math.max(2, th));
      ctx.scale(res, res);
      ctx.translate(-pi * pieceW, 0);
      layers.forEach((layer, li) => layer.draw(ctx, { w, h, horizon }, new Rng(hashSeed(`${this.def.id}:layer:${li}`))));
      const key = `bg:${this.def.id}:${pi}`;
      if (this.scene.textures.exists(key)) this.scene.textures.remove(key);
      addStaticCanvas(this.scene.textures, key, c);
      this.texKeys.add(key);
      const img = this.scene.add.image(box.x0 + pi * pieceW, box.top, key).setOrigin(0, 0).setScale(1 / res);
      img.setDepth(DEPTH.sky);
      this.paper.planes.put(img, z);
    }
  }

  // ------------------------------------------------------------ solids

  private addSolid(def: SolidDef, index: number): void {
    const zone = this.scene.add.zone(def.x + def.w / 2, def.y + def.h / 2, def.w, def.h);
    this.scene.physics.add.existing(zone, true);
    const body = zone.body as Phaser.Physics.Arcade.StaticBody;
    if (def.oneWay) {
      body.checkCollision.down = false;
      body.checkCollision.left = false;
      body.checkCollision.right = false;
    }
    this.group.add(zone);
    const rt: SolidRt = { def, index, zone, body, images: [], active: true, reveal: def.latent ? 0 : 1, grace: 0 };
    this.solids.push(rt);
    if (def.hidden || def.style === 'none') return;
    // The main floor is the paper box's own floor.
    if (isBoxFloor(def, this.staged.box.floor)) return;
    // Wooden and root jumps are whales now: one floats where the platform
    // was, its back on the platform's top line. Nothing is painted.
    if (isWhalePlatform(def)) {
      (this.whales ??= new WhalePlatforms(this.scene, this.def)).add(rt);
      return;
    }
    const m = TERRAIN_MARGIN;
    const x0 = def.x - m;
    const y0 = def.y - m;
    const w = def.w + m * 2;
    const h = def.h + m * 2;
    for (let cy = 0; cy < h; cy += CHUNK) {
      for (let cx = 0; cx < w; cx += CHUNK) {
        const cw = Math.min(CHUNK, w - cx);
        const ch = Math.min(CHUNK, h - cy);
        const key = `terrain:${this.def.id}:${index}:${cx}:${cy}`;
        const desc: ChunkDesc = { solid: rt, x: x0 + cx, y: y0 + cy, w: cw, h: ch, key, image: null };
        this.chunks.push(desc);
        if (!this.streamed) this.materialize(desc);
      }
    }
  }

  private materialize(c: ChunkDesc): void {
    if (c.image) return;
    // Painted above 1:1 so terrain stays crisp under the zoomed-in camera.
    const res = TERRAIN_RES;
    const [canvas, ctx] = artCanvas(Math.ceil(c.w * res), Math.ceil(c.h * res));
    ctx.scale(res, res);
    const theme = themeDef(this.def.theme);
    paintSolid(canvas, c.solid.def, { x: c.x, y: c.y }, theme.terrain, hashSeed(`${this.def.id}:${c.solid.index}`));
    registerCanvas(this.scene.textures, c.key, canvas, { w: c.w, h: c.h, px: 0, py: 0 }, res);
    this.texKeys.add(c.key);
    const img = this.scene.add.image(c.x, c.y, c.key).setOrigin(0, 0).setScale(1 / res);
    img.setDepth(c.solid.def.latent ? DEPTH.terrain + 2 : DEPTH.terrain);
    c.image = img;
    c.solid.images.push(img);
    this.applySolidVisual(c.solid);
  }

  private dematerialize(c: ChunkDesc): void {
    if (!c.image) return;
    const img = c.image;
    c.solid.images = c.solid.images.filter((i) => i !== img);
    img.destroy();
    c.image = null;
    unregister(this.scene.textures, c.key);
    this.texKeys.delete(c.key);
  }

  /** Top of the nearest solid surface at or below (x, y), or null. */
  groundBelow(x: number, y: number): number | null {
    let best: number | null = null;
    for (const s of this.solids) {
      if (!s.active || !s.body.enable) continue;
      const d = s.def;
      if (x < d.x || x > d.x + d.w || d.y < y - 3) continue;
      if (best === null || d.y < best) best = d.y;
    }
    return best;
  }

  /** Streams terrain chunks around the camera for very long rooms. */
  stream(camX: number): void {
    if (!this.streamed) return;
    const lo = camX - 900;
    const hi = camX + VIEW_W + 1600;
    for (const c of this.chunks) {
      const inside = c.x + c.w > lo && c.x < hi;
      if (inside) this.materialize(c);
      else if (c.x + c.w < camX - 1800 || c.x > camX + VIEW_W + 3000) this.dematerialize(c);
    }
  }

  private applySolidVisual(s: SolidRt): void {
    const alpha = s.def.latent ? 0.1 + 0.9 * s.reveal : s.active ? 1 : 0;
    for (const img of s.images) {
      img.setVisible(s.def.latent ? true : s.active);
      img.setAlpha(alpha);
    }
  }

  // ------------------------------------------------------------ props & markers

  private image(key: string, x: number, y: number, depth: number, ox: number, oy: number): Phaser.GameObjects.Image | null {
    if (!hasFrame(key)) {
      console.warn('missing art', key);
      return null;
    }
    const f = frameRef(key);
    const img = this.scene.add.image(x, y, f.atlas, f.frame);
    img.setOrigin(ox, oy);
    img.setScale(1 / f.scale);
    img.setDepth(depth);
    return img;
  }

  private addProp(p: PropDef): void {
    const img = this.image(p.key, p.x, p.y, p.depth ?? DEPTH.props, p.ox ?? 0.5, p.oy ?? 1);
    if (img) {
      const f = frameRef(p.key);
      const base = 1 / f.scale;
      img.setScale(base * (p.scale ?? 1));
      if (p.flipX) img.setFlipX(true);
      if (p.alpha !== undefined) img.setAlpha(p.alpha);
      if (p.angle) img.setAngle(p.angle);
      // A card at its depth, printed for it.
      this.paper.card(img, p.key, propZ(p), p.scale ?? 1);
      if (this.standsOnFloor(p)) {
        const r = (frameRef(p.key).w * (p.scale ?? 1)) / 2;
        this.paper.addShadow({ shadow: () => (img.visible && img.alpha > 0.5 ? { x: img.x, z: propZ(p), r: Math.min(220, r * 0.85), a: 0.55 } : null) });
      }
    }
    this.props.push({ def: p, img, glow: null, active: this.isOn(p) });
  }

  /** A prop standing on the box's floor (it casts a shadow there). */
  private standsOnFloor(p: PropDef): boolean {
    return (p.oy ?? 1) === 1 && Math.abs(p.y - this.staged.box.floor) < 12 && !p.angle;
  }

  private marker<T extends { x: number; y: number }>(
    def: T,
    key: string,
    x: number,
    y: number,
    depth: number,
    ox: number,
    oy: number,
    glowColor: string,
  ): Marker<T> {
    const img = this.image(key, x, y, depth, ox, oy);
    const f = hasFrame('fx.glow') ? frameRef('fx.glow') : null;
    let glow: Phaser.GameObjects.Image | null = null;
    if (f) {
      glow = this.scene.add.image(x, oy === 1 ? y - 20 : y, f.atlas, f.frame);
      glow.setBlendMode(Phaser.BlendModes.ADD).setTint(hex(glowColor)).setAlpha(0.35).setScale(0.7).setDepth(depth - 1);
    }
    return { def, img, glow, active: this.isOn(def as Gate) };
  }

  /** The drawing of a prop (by key and x), e.g. to break it. */
  propImage(key: string, x: number): Phaser.GameObjects.Image | null {
    return this.props.find((p) => p.def.key === key && p.def.x === x)?.img ?? null;
  }

  /** Re-evaluates every gate after flags change. */
  refresh(animate = true): void {
    for (const s of this.solids) {
      const on = this.isOn(s.def);
      if (on === s.active) continue;
      s.active = on;
      s.body.enable = on && (!s.def.latent || s.reveal > 0.5);
      if (on && animate && s.def.grow) this.growIn(s);
      else this.applySolidVisual(s);
    }
    for (const s of this.solids) {
      if (!s.active) s.body.enable = false;
      else if (!s.def.latent) s.body.enable = true;
      this.applySolidVisual(s);
    }
    for (const p of this.props) {
      const on = this.isOn(p.def);
      if (p.img) {
        if (on !== p.active && animate) {
          p.img.setVisible(true);
          this.scene.tweens.add({ targets: p.img, alpha: on ? 1 : 0, duration: 600, onComplete: () => p.img?.setVisible(on) });
        } else {
          p.img.setVisible(on);
          p.img.setAlpha(on ? (p.def.alpha ?? 1) : 0);
        }
      }
      p.active = on;
    }
    const markers: Marker<Gate & { x: number; y: number }>[] = [...this.anchors, ...this.nodes, ...this.sites];
    for (const m of markers) {
      m.active = this.isOn(m.def);
      m.img?.setVisible(m.active);
      m.glow?.setVisible(m.active);
    }
    for (const it of this.interacts) it.active = this.isOn(it.def);
    for (const e of this.exits) e.active = this.isOn(e.def);
    for (const t of this.triggers) t.active = this.isOn(t.def);
    for (const m of this.memories) {
      m.img?.setVisible(!m.taken);
      m.glow?.setVisible(!m.taken);
    }
  }

  private growIn(s: SolidRt): void {
    for (const img of s.images) {
      img.setVisible(true).setAlpha(1);
      const fullW = img.displayWidth;
      const ox = img.x;
      img.setCrop(0, 0, 1, img.height);
      const prog = { t: 0 };
      this.scene.tweens.add({
        targets: prog,
        t: 1,
        duration: 700 + Math.random() * 300,
        ease: 'Cubic.easeOut',
        onUpdate: () => {
          img.setCrop(0, 0, Math.max(1, img.width * prog.t), img.height);
        },
        onComplete: () => {
          img.setCrop();
          img.x = ox;
        },
      });
      void fullW;
    }
  }

  // ------------------------------------------------------------ latent platforms

  /** Focus reveals latent crystal surfaces; a short grace keeps them solid. */
  updateLatent(dt: number, focusActive: boolean): void {
    this.latentActive = focusActive;
    for (const s of this.solids) {
      if (!s.def.latent || !s.active) continue;
      if (focusActive) {
        s.grace = LATENT_GRACE_S;
        s.reveal = Math.min(1, s.reveal + dt * 6);
      } else if (s.grace > 0) {
        s.grace -= dt;
        s.reveal = Math.max(0.35, s.reveal - dt * 1.5);
      } else {
        s.reveal = Math.max(0, s.reveal - dt * 5);
      }
      const solid = s.reveal > 0.5 || s.grace > 0;
      if (s.body.enable !== solid) s.body.enable = solid;
      this.applySolidVisual(s);
    }
  }

  /** Solid rectangles that block reach paths (excludes one-way and inactive). */
  blockerRects(): Rect[] {
    return this.solids.filter((s) => s.body.enable && !s.def.oneWay).map((s) => s.def);
  }

  animateMarkers(time: number): void {
    const t = time / 1000;
    for (const m of this.memories) {
      if (m.taken || !m.img) continue;
      m.img.y = m.def.y - 34 + Math.sin(t * 2.2 + m.def.x) * 4;
      m.img.rotation = Math.sin(t * 1.3 + m.def.x) * 0.12;
      if (m.glow) {
        m.glow.y = m.img.y;
        m.glow.setAlpha(0.35 + 0.15 * Math.sin(t * 3));
      }
    }
    for (const a of this.anchors) {
      if (a.glow) a.glow.setAlpha(a.active ? 0.3 + 0.1 * Math.sin(t * 2 + a.def.x) : 0);
    }
    for (const n of this.nodes) {
      if (n.glow) n.glow.setAlpha(n.active ? 0.3 + 0.15 * Math.sin(t * 1.7) : 0);
    }
    for (const s of this.sites) {
      if (s.glow) s.glow.setAlpha(s.active ? 0.2 + 0.12 * Math.sin(t * 2.4) : 0);
    }
  }

  takeMemory(id: string): void {
    const m = this.memories.find((x) => x.def.id === id);
    if (!m || m.taken) return;
    m.taken = true;
    const img = m.img;
    const glow = m.glow;
    if (img) this.scene.tweens.add({ targets: img, y: img.y - 40, alpha: 0, scale: img.scale * 1.6, duration: 700, onComplete: () => img.setVisible(false) });
    if (glow) this.scene.tweens.add({ targets: glow, alpha: 0, scale: 2, duration: 700 });
  }

  lightCheckpoint(id: string): void {
    const c = this.checkpoints.find((x) => x.def.id === id);
    if (!c || c.lit) return;
    c.lit = true;
    if (c.img && hasFrame('prop.lantern.lit')) {
      const f = frameRef('prop.lantern.lit');
      c.img.setTexture(f.atlas, f.frame);
    }
  }

  destroy(): void {
    for (const k of this.texKeys) unregister(this.scene.textures, k);
    this.texKeys.clear();
  }
}
