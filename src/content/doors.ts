import * as Phaser from 'phaser';
import { app } from '../engine/App';
import type { WorldScene } from '../engine/scenes/WorldScene';
import type { RoomScript } from './scripts/types';
import type { SolidRt } from '../engine/world/RoomRuntime';
import type { Sfx } from '../engine/systems/AudioSystem';
import type { PaperLight } from '../paper/light';
import type { ArtPlace, Wall, WallSpec } from '../paper/walls';
import { holeHeight } from '../paper/opening';
import { artCanvas, addStaticCanvas, rasterizeSvg } from '../render/2d/TextureFactory';
import type { FaceArt, WallDoorArt } from './art/doors/wallArt';
import { DOORS, type DoorSpec, type Opener } from './doorSpecs';
import { lifeArt, PaperLife } from './doorLife';

// The doorways of the room being played (the registry, what each room's
// doors are and what opens them, is doorSpecs.ts). Each is cut into a wall
// of the paper box (src/paper/walls.ts): the room's right side wall for a
// way out, a wall standing across the room for a gate. Their art is
// printed into one texture while the room loads (`printDoors`), so the
// walls stand dressed from the room's first frame; then every frame the
// doors open, shut and wake as the story and Gorti say: a light warms in
// the opening, the leaf opens wider, someone peeks out, paper life comes
// out. With less motion asked for nothing idles, and a leaf fades instead
// of moving.

const hex = (c: string): number => parseInt(c.slice(1), 16);

/** Every door's art is drawn once (it is the same every time). */
const arts = new Map<() => WallDoorArt, WallDoorArt>();
export function artOf(make: () => WallDoorArt): WallDoorArt {
  let a = arts.get(make);
  if (!a) {
    a = make();
    arts.set(make, a);
  }
  return a;
}

/** The printed art of a room's doors: one texture, and where each piece lies in it. */
export interface DoorAtlas {
  key: string;
  scale: number;
  places: Map<string, ArtPlace>;
}
const atlases = new Map<string, DoorAtlas>();

/** Largest side of a piece, and the atlas's widest row. */
const MAX_PIECE = 2040;
const ATLAS_W = 2046;
const PAD = 3;

/** A piece to print: its art, and texels per world px across and up. */
export interface DoorJob {
  key: string;
  art: FaceArt;
  sx: number;
  sy: number;
}

/** The depth a door's paper life lives at (in front of the opening's middle). */
export const lifeZ = (art: WallDoorArt): number => Math.min(art.hole.z1 - 8, (art.hole.z0 + art.hole.z1) / 2 + 24);

/**
 * The pieces a door prints, each at the density it shows at: the wall's
 * face and the frames are seen slanted, so they are printed narrower than
 * tall (as the lens squeezes them); the leaf may turn square to the eye,
 * and the passage's far wall, the peeking figure and the paper life face it.
 */
export function doorJobs(spec: DoorSpec, art: WallDoorArt, scaleAt: (z: number) => number): DoorJob[] {
  const h = art.hole;
  const jobs: DoorJob[] = [];
  const across = spec.wall === 'side' ? 0.62 : 0.7;
  const fy = scaleAt(Math.min(0, art.face.u1));
  jobs.push({ key: `${spec.id}.face`, art: art.face, sx: fy * across, sy: fy });
  if (art.leaf?.art) {
    const s = scaleAt(h.z1) * 0.9;
    jobs.push({ key: `${spec.id}.leaf`, art: art.leaf.art, sx: s, sy: s });
  }
  if (art.passage?.art) {
    const s = scaleAt(h.z0);
    jobs.push({ key: `${spec.id}.pass`, art: art.passage.art, sx: s, sy: s });
  }
  art.passage?.frames?.slice(0, 2).forEach((f, i) => {
    const s = scaleAt(h.z1);
    jobs.push({ key: `${spec.id}.frame${i}`, art: f.art, sx: s * across, sy: s });
  });
  if (art.peek) {
    const s = scaleAt(art.peek.z);
    jobs.push({ key: `${spec.id}.peek`, art: art.peek.art, sx: s, sy: s });
  }
  if (art.life) {
    const s = scaleAt(lifeZ(art));
    lifeArt(art.life.kind, art.life.colors).forEach((a, i) => jobs.push({ key: `${spec.id}.life${i}`, art: a, sx: s, sy: s }));
  }
  return jobs;
}

/** Shelves for pieces of these sizes, tallest first: where each goes, and the sheet's size (never a power of two, so never mipmapped). */
export function packShelves(sizes: readonly { key: string; w: number; h: number }[], maxW = ATLAS_W, pad = PAD): { at: Map<string, { x: number; y: number }>; w: number; h: number } {
  const order = [...sizes].sort((a, b) => b.h - a.h);
  let x = pad;
  let y = pad;
  let row = 0;
  let wide = 0;
  const at = new Map<string, { x: number; y: number }>();
  for (const s of order) {
    if (x + s.w + pad > maxW && x > pad) {
      x = pad;
      y += row + pad;
      row = 0;
    }
    at.set(s.key, { x, y });
    x += s.w + pad;
    wide = Math.max(wide, x);
    row = Math.max(row, s.h);
  }
  let w = Math.max(2, wide);
  let h = Math.max(2, y + row + pad);
  if ((w & (w - 1)) === 0) w += 1;
  if ((h & (h - 1)) === 0) h += 1;
  return { at, w, h };
}

/**
 * Prints the room's door art (from the scene's preload, so the walls stand
 * dressed from the first frame). `scaleAt(z)`: device px per world px at
 * depth z with the lens at rest.
 */
export async function printDoors(textures: Phaser.Textures.TextureManager, roomId: string, scaleAt: (z: number) => number): Promise<void> {
  const specs = DOORS[roomId] ?? [];
  const scale = scaleAt(0);
  const have = atlases.get(roomId);
  if (have && Math.abs(have.scale - scale) < 1e-6 && textures.exists(have.key)) return;
  // Only the room being played keeps its art.
  for (const [id, a] of atlases) {
    if (textures.exists(a.key)) textures.remove(a.key);
    atlases.delete(id);
  }
  if (specs.length === 0) return;
  const jobs = specs.flatMap((s) => doorJobs(s, artOf(s.art), scaleAt));
  const sized = jobs.map((j) => {
    const w = j.art.u1 - j.art.u0;
    const k = Math.min(1, MAX_PIECE / Math.max(1, w * j.sx), MAX_PIECE / Math.max(1, j.art.h * j.sy));
    return { job: j, key: j.key, w: Math.max(2, Math.ceil(w * j.sx * k)), h: Math.max(2, Math.ceil(j.art.h * j.sy * k)) };
  });
  const { at, w: W, h: H } = packShelves(sized);
  const [canvas, ctx] = artCanvas(W, H);
  const places = new Map<string, ArtPlace>();
  await Promise.all(
    sized.map(async ({ job, w: cw, h: ch }) => {
      const p = at.get(job.key)!;
      const a = job.art;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${a.u1 - a.u0} ${a.h}" preserveAspectRatio="none">${a.body}</svg>`;
      try {
        const img = await rasterizeSvg(svg);
        ctx.drawImage(img, p.x, p.y, cw, ch);
        places.set(job.key, { u0: a.u0, v0: 0, u1: a.u1, v1: a.h, x: p.x, y: p.y, w: cw, h: ch });
      } catch {
        // A piece that cannot be drawn leaves the wall plain there.
      }
    }),
  );
  const key = `paper:doors:${roomId}@${scale.toFixed(4)}`;
  if (textures.exists(key)) textures.remove(key);
  const tex = addStaticCanvas(textures, key, canvas);
  if (!tex) return;
  // The life's little sheets are drawn as images: each gets a frame.
  for (const [k, p] of places) if (/\.life\d+$/.test(k)) tex.add(k, 0, p.x, p.y, p.w, p.h);
  atlases.set(roomId, { key, scale, places });
}

/** The wall a door is cut into, as the stage draws it. */
export function wallSpecOf(spec: DoorSpec, art: WallDoorArt, box: { x1: number; colors: { side: number } }, atlas: DoorAtlas | null): WallSpec {
  const place = (k: string): ArtPlace | undefined => atlas?.places.get(`${spec.id}.${k}`);
  const frames = [place('frame0'), place('frame1')].filter((p): p is ArtPlace => !!p);
  const pa = art.passage;
  const lf = art.leaf;
  const fl = art.flat;
  return {
    kind: spec.wall,
    x: spec.wall === 'side' ? box.x1 : (spec.x ?? 0),
    half: art.wall.half,
    end: art.wall.end,
    color: art.wall.color ? hex(art.wall.color) : box.colors.side,
    edge: hex(art.wall.edge),
    hole: art.hole,
    leaf: lf ? { kind: lf.kind, hinge: lf.hinge, color: hex(lf.color), back: hex(lf.back) } : null,
    passage: pa ? { length: pa.length, reveal: pa.reveal, floor: hex(pa.floor), wall: hex(pa.wall), end: hex(pa.end), frames: (pa.frames ?? []).slice(0, 2).map((f) => f.x) } : null,
    art: atlas ? { key: atlas.key, wall: place('face'), leaf: place('leaf'), passage: place('pass'), frames, peek: place('peek') } : null,
    flat: fl ? { wall: fl.wall ? hex(fl.wall) : undefined, hole: fl.hole ? hex(fl.hole) : undefined, frame: fl.frame ? hex(fl.frame) : undefined } : undefined,
  };
}

const ease = (t: number): number => t * t * (3 - 2 * t);
const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const DEG = Math.PI / 180;

function sound(s: [Sfx, number, number] | undefined): void {
  if (s) app.audio.sfx(s[0], { vol: s[1], pitch: s[2] });
}

/** One door at play: its wall, its lamp, and how open and awake it is. */
class DoorRt {
  /** How open it is (0 shut … 1 open), how awake (Gorti near), how far someone peeks out. */
  open = 0;
  wake = 0;
  peek = 0;
  /** Shut on purpose behind Gorti (he has gone through). */
  closing = false;
  private target = 0;
  private tween: Phaser.Tweens.Tween | null = null;
  private t = Math.random() * 10;
  private chimed = false;
  private peekSounded = false;
  private peeking = false;
  /** Whether it can be seen just now (it opens only where it is seen). */
  private seen = false;
  /** The wall's face toward the room (x). */
  readonly face: number;

  constructor(
    private readonly w: WorldScene,
    readonly spec: DoorSpec,
    readonly art: WallDoorArt,
    readonly wall: Wall,
    readonly lamp: PaperLight,
    readonly life: PaperLife | null,
    private readonly isOpen: () => boolean,
  ) {
    this.face = wall.spec.kind === 'side' ? wall.spec.x : wall.spec.x - (wall.spec.half ?? 8);
    this.target = this.open = isOpen() ? 1 : 0;
    this.pose(app.settings.reducedMotion);
  }

  update(dt: number, gorti: { x: number; z: number } | null, paused: boolean, eye: { x: number; half: number }): void {
    const reduced = app.settings.reducedMotion;
    const x = this.wall.spec.x;
    this.seen = Math.abs(x - eye.x) < eye.half * 1.25;
    if (!paused) {
      this.t += dt;
      const want = this.isOpen() && !this.closing ? 1 : 0;
      if (want !== this.target && (this.seen || want === 0 || this.closing)) this.swing(want, reduced);
      const near = this.spec.near ?? 150;
      const far = this.spec.far ?? 560;
      const d = gorti === null ? Infinity : Math.abs(gorti.x - x);
      const wantWake = this.closing ? 0 : 1 - ease(clamp01((d - near) / (far - near)));
      this.wake += (wantWake - this.wake) * (1 - Math.exp(-dt / (wantWake > this.wake ? 0.4 : 0.8)));
      if (this.wake > 0.5 && !this.chimed) {
        this.chimed = true;
        sound(this.art.sounds?.wake);
      } else if (this.wake < 0.15) this.chimed = false;
      // Someone peeks out of an open door while Gorti is near.
      const peekNow = !!this.art.peek && this.open > 0.9 && (this.peeking ? this.wake > 0.35 : this.wake > 0.6);
      if (peekNow && !this.peeking && !this.peekSounded) {
        this.peekSounded = true;
        sound(this.art.sounds?.peek);
      }
      if (this.wake < 0.15) this.peekSounded = false;
      this.peeking = peekNow;
      const tp = reduced ? 0.07 : peekNow ? 0.35 : 0.25;
      this.peek += ((peekNow ? 1 : 0) - this.peek) * (1 - Math.exp(-dt / tp));
    }
    this.pose(reduced);
    this.life?.update(dt, paused, this.open * this.wake, reduced);
  }

  /** Opens (1) or shuts (0) it: a short animation, or with less motion a fade of the leaf. */
  private swing(to: number, reduced: boolean): void {
    this.target = to;
    this.tween?.stop();
    if (to === 1) for (const s of this.art.sounds?.open ?? []) sound(s);
    else sound(this.art.sounds?.shut);
    const ms = this.art.openMs ?? 1100;
    const kind = this.art.leaf?.kind;
    this.tween = this.w.tweens.add({
      targets: this,
      open: to,
      duration: reduced ? 260 : to === 1 ? ms : Math.min(700, ms * 0.6),
      ease: reduced ? 'Sine.easeInOut' : to === 1 ? (kind === 'swing' ? 'Back.easeOut' : 'Cubic.easeInOut') : 'Cubic.easeIn',
    });
  }

  /** The leaf, the light and the figure as they are now. */
  private pose(reduced: boolean): void {
    const wall = this.wall;
    const lf = this.art.leaf;
    const open = clamp01(this.open);
    const wake = this.wake;
    if (lf) {
      const unit = lf.kind === 'swing' ? DEG : 1;
      if (reduced) {
        // No travel: shut, or open; across the change the leaf fades.
        const shut = open < 0.5;
        wall.leaf = (shut ? lf.shut : lf.open) * unit;
        // Slid, lifted, sunk or rolled all the way, an open leaf is out of sight anyway.
        const gone = !shut && lf.kind !== 'swing' && lf.open >= 0.97;
        wall.leafShown = gone ? 0 : shut ? 1 - open * 2 : (open - 0.5) * 2;
      } else {
        const rest = lerp(lf.shut, lf.open, this.open);
        const wide = ((lf.wide ?? lf.open) - lf.open) * wake * open;
        const breath = lf.kind === 'swing' ? Math.sin(this.t * 1.7) * 1.4 * open * wake : 0;
        wall.leaf = (rest + wide + breath) * unit;
        wall.leafShown = 1;
      }
    }
    const breath = reduced ? 0 : 0.05 * Math.sin(this.t * 1.9) * wake;
    const glow = 0.06 * (1 - open) + open * (0.3 + 0.45 * wake) + breath * open;
    wall.glow = clamp01(glow);
    this.lamp.intensity = this.art.light.intensity * (0.12 + 0.88 * clamp01(open * (0.55 + 0.45 * wake) + 0.08 * wake));
    const pk = this.art.peek;
    if (pk) {
      const k = reduced ? (this.peek < 0.5 ? 0 : 1) : ease(clamp01(this.peek));
      wall.peek.x = lerp(pk.hidden, pk.shown, k);
      wall.peek.z = pk.z;
      wall.peek.rise = 1;
      wall.peek.show = reduced ? clamp01(this.peek) : this.peek > 0.01 ? 1 : 0;
    }
  }

  get state(): { open: number; wake: number; peek: number } {
    const r = (v: number): number => Math.round(v * 100) / 100;
    return { open: r(this.open), wake: r(this.wake), peek: r(this.peek) };
  }

  destroy(): void {
    this.tween?.stop();
    this.life?.destroy();
  }
}

/** The way out through the right side wall: its wall, and how to see Gorti go through it. */
export interface ExitDoor {
  wall: Wall;
  /** The screen x (device px) past which the wall stands before something at depth z beyond its face. */
  cutAt(z: number): number;
  /** Shuts it behind him. */
  shut(): void;
}

/** A room's doors: their walls are added to the stage when the room starts, then they live each frame. */
export class RoomDoors {
  private readonly doors: DoorRt[] = [];
  /** The gates the doors stand for (their plain drawings are not shown). */
  private hidden: SolidRt[] = [];
  private last = 0;

  constructor(private readonly w: WorldScene) {}

  setup(): void {
    const specs = DOORS[this.w.def.id] ?? [];
    if (specs.length === 0) return;
    const w = this.w;
    const paper = w.paper;
    const atlas = atlases.get(w.def.id) ?? null;
    this.hidden = specs.flatMap((spec) => w.room.solids.filter((s) => s.def.id !== undefined && (spec.hides ?? []).includes(s.def.id)));
    for (const spec of specs) {
      const art = artOf(spec.art);
      const ws = wallSpecOf(spec, art, paper.spec, atlas);
      const wall = paper.walls.add(ws);
      wall.glowColor = hex(art.glow);
      const h = art.hole;
      // The lamp stands in the opening (beyond a side wall's face: it lights the passage and spills out).
      const lamp = paper.lighting.add({
        x: spec.wall === 'side' ? ws.x + 40 : ws.x,
        y: paper.spec.floor - art.light.y,
        z: (h.z0 + h.z1) / 2,
        color: hex(art.light.color),
        radius: art.light.radius,
        intensity: 0,
        cast: false,
      });
      let life: PaperLife | null = null;
      if (art.life && atlas) {
        const frames = [...atlas.places.keys()].filter((k) => k.startsWith(`${spec.id}.life`));
        if (frames.length) {
          const side = spec.wall === 'side';
          life = new PaperLife(paper, art.life.kind, art.life.rate, { key: atlas.key, frames, scale: paper.printScale(lifeZ(art)) }, {
            x: side ? ws.x : ws.x - (ws.half ?? 8),
            floor: paper.spec.floor,
            z0: h.z0,
            z1: h.z1,
            top: holeHeight(h),
            into: -1,
            both: !side,
          });
        }
      }
      this.doors.push(new DoorRt(w, spec, art, wall, lamp, life, this.opener(spec.open)));
    }
    this.last = performance.now();
    // After the stage has set the eye for the frame (it listens first).
    w.events.on(Phaser.Scenes.Events.PRE_RENDER, this.frame, this);
  }

  /** Whether the door stands open now. */
  private opener(o: Opener): () => boolean {
    const room = this.w.room;
    if (o === 'always') return () => true;
    if ('when' in o) return () => room.isOn({ when: o.when });
    if ('exit' in o) {
      const exit = room.exits.find((e) => e.def.id === o.exit);
      return exit ? () => room.isOn(exit.def) : () => true;
    }
    const solid = room.solids.find((s) => s.def.id === o.solid);
    return solid ? () => !room.isOn(solid.def) : () => true;
  }

  /** The way out through the right side wall, if this room has one. */
  exitDoor(): ExitDoor | null {
    const d = this.doors.find((x) => x.spec.wall === 'side');
    if (!d) return null;
    const lens = this.w.paper.lens;
    const h = d.art.hole;
    const x = d.wall.spec.x;
    return {
      wall: d.wall,
      cutAt: (z: number) => lens.project(x, 0, z >= h.z0 && z <= h.z1 ? h.z1 : z).x,
      shut: () => {
        d.closing = true;
      },
    };
  }

  private frame(): void {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    // The gate's body still stands while it is shut; the door shows it.
    for (const solid of this.hidden) for (const img of solid.images) if (img.visible) img.setVisible(false);
    if (this.doors.length === 0) return;
    const w = this.w;
    const p = w.player;
    const lens = w.paper.lens;
    const eye = { x: lens.eye.x, half: lens.halfWidth(0) };
    for (const d of this.doors) {
      d.update(dt, p ? { x: p.x, z: p.z } : null, w.paused, eye);
      // Life coming out of a side wall's opening shows only where the opening lets it.
      if (d.life && d.spec.wall === 'side') d.life.camera.clipRight = lens.project(d.wall.spec.x, 0, d.art.hole.z1).x;
    }
    w.probeExtra.doors = this.doors.map((d) => ({ id: d.spec.id, ...d.state }));
  }

  destroy(): void {
    this.w.events.off(Phaser.Scenes.Events.PRE_RENDER, this.frame, this);
    for (const d of this.doors) {
      d.destroy();
      this.w.paper.lighting.remove(d.lamp);
      this.w.paper.walls.remove(d.wall);
    }
    this.doors.length = 0;
  }

  /** The openings Gorti is at or coming to: the wall's face, the jambs' depths and the crown's height over the floor (world px). */
  nearOpenings(): { x: number; z0: number; z1: number; top: number }[] {
    return this.doors.filter((d) => d.wake > 0.3).map((d) => ({ x: d.face, z0: d.art.hole.z0, z1: d.art.hole.z1, top: holeHeight(d.art.hole) }));
  }
}

/** Adds a room's doors to its script (set up after it, torn down with it). */
export function withDoors(script: RoomScript, w: WorldScene): RoomScript {
  if (!(DOORS[w.def.id]?.length ?? 0)) return script;
  const doors = new RoomDoors(w);
  const setup = script.setup.bind(script);
  const destroy = script.destroy?.bind(script);
  script.setup = () => {
    setup();
    doors.setup();
    w.doors = doors;
  };
  script.destroy = () => {
    destroy?.();
    doors.destroy();
    if (w.doors === doors) w.doors = null;
  };
  return script;
}
