import * as Phaser from 'phaser';
import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { frameRef, hasFrame } from '../../render/2d/TextureFactory';
import { HALO_PX, lightTextures } from '../../render/2d/fx/lightArt';
import { DEFAULT_LOOK, type FaceLook, type Mood, type Wear } from '../../content/text/check';

// Celestial faces: the infant Moon, the ancient Moon and the Sun, as the
// author paints them: each Moon a crescent with a single eye (the ancient
// one crying), the Sun a round sad face in a ring of spiky rays. They are
// characters: they breathe, blink, look after Gorti, talk, hum along, and
// each page gives them a mood and things to wear (sky.json: a nightcap, a
// plaster, a crown of crystal…). Every part is drawn once (sky.ts) and only
// moved here.
//
// One of each: the Sun is one character, and so is the Moon, wherever it
// shows: in the sky's corner ('home'), in the room ('world'), framed in a
// dialogue card ('card'). While it shows in a closer place (a card over the
// room, the room over the sky), the farther one steps out of sight
// (`presence`) and comes back after.

export type FaceKind = 'baby' | 'old' | 'sun';
/** The character: the Sun, or the Moon (infant or ancient). */
export type Who = 'sun' | 'moon';
/** Where a face shows: the sky's corner, the room, or a dialogue card (the closest one is the one seen). */
export type FacePlace = 'home' | 'world' | 'card';

export const whoOf = (kind: FaceKind): Who => (kind === 'sun' ? 'sun' : 'moon');

function img(scene: Phaser.Scene, key: string): Phaser.GameObjects.Image | null {
  if (!hasFrame(key)) return null;
  const f = frameRef(key);
  return scene.add.image(0, 0, f.atlas, f.frame).setOrigin(f.px / f.w, f.py / f.h).setScale(1 / f.scale);
}

/** Where a thing sits on a face (part px from its middle), how it is turned, and how big. */
interface Spot {
  x: number;
  y: number;
  rot: number;
  k: number;
}

interface FaceLayout {
  disk: string;
  eye: string;
  /** The heavy lid as painted, and the half-shut one (sleepy, proud). */
  lid: string;
  low: string;
  /** The eye shut (a blink), and squeezed happy. */
  shut: string;
  happy: string;
  /** Its own mouth, and the open one it laughs and coughs with. */
  mouth: string;
  open: string;
  /** How big the open mouth is on it. */
  openK: number;
  eyes: [number, number][];
  mouthAt: [number, number];
  /** How big the mood's mouths are on it. */
  mouthK: number;
  /** How far the lids turn with the mood (round eyes turn freely). */
  lidTurn: number;
  /** The face's radius (part px): where it may be touched. */
  hitR: number;
  brows: [number, number][];
  browK: number;
  cheeks: [number, number][];
  cheekK: number;
  tears: [number, number][];
  sweat: Spot;
  hat: Spot;
  crown: Spot;
  scarf: Spot;
  band: Spot;
  flowers: Spot[];
  /** Where Zs and notes rise from (they drift outward: `floatDir`), and how big small things are on it. */
  float: [number, number];
  floatDir: 1 | -1;
  thingK: number;
  /** The colour of its light (a touch lights it up in it). */
  light: number;
}

const LAYOUTS: Record<FaceKind, FaceLayout> = {
  sun: {
    disk: 'sun.disk', eye: 'sun.eye', lid: 'sun.lid', low: 'sun.lid.low', shut: 'sun.shut', happy: 'sun.happy',
    mouth: 'sun.mouth', open: 'sun.mouth.open', openK: 1,
    eyes: [[-46, -18], [46, -18]], mouthAt: [0, 54], mouthK: 1, lidTurn: 1, hitR: 124,
    brows: [[-46, -60], [46, -60]], browK: 1,
    cheeks: [[-66, 28], [66, 28]], cheekK: 1,
    tears: [[-50, 14], [50, 14]],
    sweat: { x: 82, y: -48, rot: 0.25, k: 1 },
    hat: { x: -6, y: -84, rot: -0.1, k: 0.95 },
    crown: { x: 0, y: -80, rot: 0, k: 0.9 },
    scarf: { x: 0, y: 98, rot: 0, k: 1.02 },
    band: { x: 60, y: -58, rot: 0.3, k: 0.72 },
    flowers: [
      { x: -96, y: -46, rot: -0.5, k: 1 },
      { x: -62, y: -86, rot: -0.2, k: 0.85 },
      { x: 94, y: 52, rot: 0.6, k: 0.9 },
    ],
    float: [70, -90], floatDir: 1, thingK: 1,
    light: 0xffd27a,
  },
  baby: {
    disk: 'moon.baby', eye: 'moon.baby.eye', lid: 'moon.baby.lid', low: 'moon.baby.lid.low', shut: 'moon.baby.shut', happy: 'moon.baby.happy',
    mouth: 'moon.baby.mouth', open: 'sky.mouth.o', openK: 0.62,
    eyes: [[-68, -12]], mouthAt: [-34, 46], mouthK: 0.6, lidTurn: 0.5, hitR: 104,
    brows: [[-70, -48]], browK: 0.95,
    cheeks: [[-78, 34]], cheekK: 0.85,
    tears: [[-70, 12]],
    sweat: { x: -20, y: -58, rot: 0.1, k: 0.85 },
    hat: { x: 30, y: -96, rot: 0.55, k: 0.7 },
    crown: { x: -50, y: -84, rot: -0.5, k: 0.6 },
    scarf: { x: -30, y: 88, rot: -0.3, k: 0.66 },
    band: { x: -86, y: -46, rot: -0.55, k: 0.6 },
    flowers: [
      { x: -96, y: 52, rot: 2.6, k: 0.85 },
      { x: -108, y: -6, rot: -3.1, k: 0.8 },
      { x: -86, y: -60, rot: -2.2, k: 0.75 },
    ],
    float: [24, -70], floatDir: 1, thingK: 0.8,
    light: 0xdcd2ff,
  },
  old: {
    disk: 'moon.old', eye: 'moon.old.eye', lid: 'moon.old.lid', low: 'moon.old.lid.low', shut: 'moon.old.shut', happy: 'moon.old.happy',
    mouth: 'moon.old.mouth', open: 'moon.old.mouth.laugh', openK: 1,
    eyes: [[-88, -26]], mouthAt: [-46, 46], mouthK: 0.7, lidTurn: 0.4, hitR: 118,
    brows: [[-90, -54]], browK: 1,
    cheeks: [[-104, 6]], cheekK: 0.7,
    tears: [[-86, -4]],
    sweat: { x: -40, y: -78, rot: 0.1, k: 0.9 },
    hat: { x: 20, y: -116, rot: 0.5, k: 0.78 },
    crown: { x: -70, y: -100, rot: -0.55, k: 0.68 },
    scarf: { x: -44, y: 104, rot: -0.36, k: 0.8 },
    band: { x: -104, y: -60, rot: -0.5, k: 0.66 },
    flowers: [
      { x: -118, y: 44, rot: 2.8, k: 0.9 },
      { x: -126, y: -20, rot: -3.1, k: 0.85 },
      { x: -98, y: -80, rot: -2.2, k: 0.8 },
    ],
    float: [10, -84], floatDir: 1, thingK: 0.9,
    light: 0xb6c8ff,
  },
};

/** The Sun's ring of spikes: how many, where their bases sit (under the face's edge), which are bent. */
const RAYS = 18;
const RAY_R = 104;
/** Long and short spikes by turns, as drawn. */
const rayLength = (i: number): number => (i % 2 ? 0.74 : 1);
const isBroken = (i: number): boolean => i % 4 === 1;

type MouthKind = 'smile' | 'grin' | 'o' | 'wobble' | 'pout' | 'smirk';
const MOUTHS: Record<MouthKind, string> = {
  smile: 'sky.mouth.smile',
  grin: 'sky.mouth.grin',
  o: 'sky.mouth.o',
  wobble: 'sky.mouth.wobble',
  pout: 'sky.mouth.pout',
  smirk: 'sky.mouth.smirk',
};

/** How a mood shows on a face. */
interface MoodStyle {
  /** Its mouth ('own': the face's own) and how big. */
  mouth: MouthKind | 'own';
  mouthK: number;
  /** The painted heavy lid or the half-shut one, and how far the lids turn (+: inner corners up, sad). */
  lid: 'heavy' | 'low';
  lidRot: number;
  /** The brows: how far up (negative) and turned (+: inner ends up); `raise` lifts the first one more. Null: none. */
  brows: { lift: number; rot: number; raise?: number } | null;
  blush: number;
  /** The rays: how long, and how fast their wave runs round. */
  rays: [number, number];
  /** Breaths a minute. */
  breaths: number;
  /** Seconds between blinks (least, most), and how long one takes. */
  blinks: [number, number, number];
  /** How far it sways (radians) and bobs (part px). */
  sway: number;
  bob: number;
  /** Lively eyes glance about now and then. */
  darts: boolean;
}

const MOODS: Record<Mood, MoodStyle> = {
  calm: { mouth: 'own', mouthK: 1, lid: 'heavy', lidRot: 0, brows: null, blush: 0.2, rays: [1, 2], breaths: 14, blinks: [3, 7, 0.28], sway: 0.02, bob: 2.5, darts: false },
  sleepy: { mouth: 'o', mouthK: 0.5, lid: 'low', lidRot: 0.06, brows: { lift: 5, rot: -0.1 }, blush: 0.15, rays: [0.88, 1.1], breaths: 9, blinks: [2, 4.5, 0.62], sway: 0.04, bob: 3.5, darts: false },
  curious: { mouth: 'o', mouthK: 0.66, lid: 'heavy', lidRot: 0, brows: { lift: -7, rot: 0.08, raise: 8 }, blush: 0.3, rays: [1.04, 2.5], breaths: 15, blinks: [2, 5, 0.2], sway: 0.05, bob: 2.5, darts: true },
  worried: { mouth: 'wobble', mouthK: 0.9, lid: 'heavy', lidRot: 0.28, brows: { lift: -5, rot: 0.4 }, blush: 0.1, rays: [0.95, 2.8], breaths: 19, blinks: [1.5, 3.5, 0.24], sway: 0.025, bob: 1.5, darts: true },
  delighted: { mouth: 'grin', mouthK: 0.92, lid: 'heavy', lidRot: 0, brows: { lift: -9, rot: -0.12 }, blush: 0.9, rays: [1.08, 3], breaths: 17, blinks: [3, 6, 0.24], sway: 0.06, bob: 4.5, darts: false },
  grumpy: { mouth: 'pout', mouthK: 1, lid: 'heavy', lidRot: -0.26, brows: { lift: 5, rot: -0.46 }, blush: 0, rays: [0.92, 1.6], breaths: 12, blinks: [3, 7, 0.3], sway: 0.012, bob: 1, darts: false },
  proud: { mouth: 'smirk', mouthK: 1, lid: 'low', lidRot: -0.05, brows: { lift: -7, rot: -0.18 }, blush: 0.4, rays: [1.1, 1.4], breaths: 11, blinks: [4, 8, 0.34], sway: 0.02, bob: 2, darts: false },
  teary: { mouth: 'wobble', mouthK: 0.76, lid: 'heavy', lidRot: 0.3, brows: { lift: -3, rot: 0.38 }, blush: 0.5, rays: [0.9, 1.5], breaths: 16, blinks: [1.8, 3.5, 0.3], sway: 0.025, bob: 1.5, darts: false },
};

/** Every face there is, so that each character shows only once (see `presence`). */
const FACES = new Set<Face>();
const RANK: Record<FacePlace, number> = { home: 0, world: 1, card: 2 };
/** A farther face steps out once the closer one shows this much, and back once it shows less than `BACK`. */
const AWAY = 0.22;
const BACK = 0.08;

/** How each character looks on the page being read (the sky sets it; the faces in the room and the cards wear it too). */
const PAGE_LOOK: Record<Who, FaceLook> = { sun: DEFAULT_LOOK, moon: DEFAULT_LOOK };

/** Dresses the Sun or the Moon for this page: every face of it, now and to come. */
export function setPageLook(who: Who, look: FaceLook): void {
  PAGE_LOOK[who] = look;
  for (const f of FACES) if (f.who === who) f.setLook(look);
}

/**
 * A touch lights the character up wherever it shows, and its lamp with it:
 * a soft swell up and a slow ebb (`touchLevel`). Taps one after another
 * keep it up without a dip (each makes its own swell; the highest counts).
 */
const POKES: Record<Who, number[]> = { sun: [], moon: [] };
const now = (): number => (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
const smoothstep = (u: number): number => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));

function swell(age: number, calm: boolean): number {
  const [up, hold, down] = calm ? [0.8, 0.2, 1.6] : [0.45, 0.2, 1.4];
  if (age < 0) return 0;
  if (age < up) return smoothstep(age / up);
  if (age < up + hold) return 1;
  return 1 - smoothstep((age - up - hold) / down);
}

/** How strongly a touch lights `who` up just now (0 … 1). */
export function touchLevel(who: Who): number {
  const list = POKES[who];
  if (!list.length) return 0;
  const t = now();
  const calm = app.settings?.reducedMotion === true;
  let k = 0;
  for (const at of list) k = Math.max(k, swell(t - at, calm));
  if (k <= 0 && t - list[list.length - 1]! > 3) list.length = 0;
  return k;
}

/** A smooth bump over [0, 1]: up quickly, down slowly. */
const bump = (u: number, up = 0.2): number => (u <= 0 || u >= 1 ? 0 : u < up ? Math.sin((u / up) * (Math.PI / 2)) : Math.cos(((u - up) / (1 - up)) * (Math.PI / 2)) ** 2);

/** A Z or a note on its way up. */
interface Floater {
  im: Phaser.GameObjects.Image;
  key: string;
  t: number;
  speed: number;
}

type Poked = 'wiggle' | 'giggle' | 'blink';

const TMP = new Phaser.GameObjects.Components.TransformMatrix();
const TMP_PARENT = new Phaser.GameObjects.Components.TransformMatrix();
const TMP_PT = new Phaser.Math.Vector2();

export class Face {
  /** The owner's: where the face is, how big, how visible. */
  readonly c: Phaser.GameObjects.Container;
  /** One of each: the face steps out of sight here while it shows somewhere closer. */
  private readonly pres: Phaser.GameObjects.Container;
  /** The face itself: it tilts, breathes, bobs and wiggles. */
  private readonly body: Phaser.GameObjects.Container;
  private readonly ring: Phaser.GameObjects.Container | null = null;
  /** A touch's light: a glow behind the face and a soft shine over it. */
  private readonly glowBack: Phaser.GameObjects.Image;
  private readonly glowFront: Phaser.GameObjects.Image;
  readonly who: Who;
  private readonly layout: FaceLayout;
  private readonly images: Phaser.GameObjects.Image[] = [];
  private eyes: Phaser.GameObjects.Image[] = [];
  private lids: Phaser.GameObjects.Image[] = [];
  private lows: Phaser.GameObjects.Image[] = [];
  private shuts: Phaser.GameObjects.Image[] = [];
  private happies: Phaser.GameObjects.Image[] = [];
  private brows: Phaser.GameObjects.Image[] = [];
  private blushes: Phaser.GameObjects.Image[] = [];
  private freckles: Phaser.GameObjects.Image[] = [];
  private tears: Phaser.GameObjects.Image[] = [];
  private flowers: Phaser.GameObjects.Image[] = [];
  private mouth: Phaser.GameObjects.Image | null = null;
  private moods: Partial<Record<MouthKind, Phaser.GameObjects.Image>> = {};
  private laugh: Phaser.GameObjects.Image | null = null;
  private cap: Phaser.GameObjects.Image | null = null;
  private pom: Phaser.GameObjects.Image | null = null;
  private crown: Phaser.GameObjects.Image | null = null;
  private scarf: Phaser.GameObjects.Image | null = null;
  private tail: Phaser.GameObjects.Image | null = null;
  private plaster: Phaser.GameObjects.Image | null = null;
  private sweat: Phaser.GameObjects.Image | null = null;
  private sparkles: Phaser.GameObjects.Image[] = [];
  private zees: Floater[] = [];
  private notes: Floater[] = [];
  private t = Math.random() * 5;
  private blinkIn = 1.5 + Math.random() * 2;
  private blinkT = 0;
  private blinkLen = 0.28;
  private twice = false;
  private yawnIn = 6 + Math.random() * 6;
  private yawnT = 0;
  private squeezeIn = 3 + Math.random() * 3;
  private squeezeT = 0;
  private tearT = Math.random() * 2;
  private tearAt = 0;
  private dartIn = 1;
  private dart = { x: 0, y: 0 };
  /** A touch: how long ago (s; -1: none), and what it did. */
  private pokeT = -1;
  private poked: Poked = 'blink';
  private humK = 0;
  private away = false;
  talking = 0;
  laughing = false;
  lidDrop = 0;
  gaze = { x: 0, y: 0 };
  private rays: Phaser.GameObjects.Image[] = [];
  private brokenRays: Phaser.GameObjects.Image[] = [];
  coughT = 0;
  rayLevel = 1;
  /** Gorti is singing: it listens, eyes squeezed, swaying, notes rising (its owner sets it). */
  humming = false;
  private dimmed = -1;
  /** How much of it shows here (0 while it shows somewhere closer). */
  presence = 1;
  private look: FaceLook = DEFAULT_LOOK;
  private mood: MoodStyle = MOODS.calm;
  private baseTilt = 0;

  constructor(
    private scene: Phaser.Scene,
    readonly kind: FaceKind,
    x: number,
    y: number,
    depth: number = DEPTH.backProps,
    readonly place: FacePlace = 'world',
  ) {
    this.layout = LAYOUTS[kind];
    this.who = whoOf(kind);
    this.c = scene.add.container(x, y).setDepth(depth);
    this.pres = scene.add.container(0, 0);
    this.body = scene.add.container(0, 0);
    this.c.add(this.pres);
    this.pres.add(this.body);
    const L = this.layout;
    const add = (key: string, x0 = 0, y0 = 0, visible = true): Phaser.GameObjects.Image | null => {
      const im = img(scene, key);
      if (!im) return null;
      im.setPosition(x0, y0).setVisible(visible);
      this.body.add(im);
      this.images.push(im);
      return im;
    };
    const many = (key: string, at: readonly (readonly [number, number])[], visible = true): Phaser.GameObjects.Image[] =>
      at.map(([x0, y0]) => add(key, x0, y0, visible)).filter((im): im is Phaser.GameObjects.Image => im !== null);
    const spot = (key: string, s: Spot, k = 1): Phaser.GameObjects.Image | null => {
      const im = add(key, s.x, s.y, false);
      im?.setRotation(s.rot).setScale(im.scaleX * s.k * k);
      return im;
    };
    // A touch lights it up: a glow behind it all, and a shine over the face (added last).
    lightTextures(scene.textures);
    const light = (): Phaser.GameObjects.Image => scene.add.image(0, 0, 'fx.halo').setBlendMode(Phaser.BlendModes.ADD).setTint(L.light).setVisible(false);
    this.glowBack = light();
    this.glowFront = light();
    this.body.add(this.glowBack);
    // Behind the face: the scarf's loose end and the flowers tucked in its rim.
    const sc = L.scarf;
    this.tail = spot('sky.scarf.tail', { x: sc.x + 46 * sc.k, y: sc.y + 2 * sc.k, rot: sc.rot + 0.15, k: sc.k });
    if (kind === 'sun') {
      this.ring = scene.add.container(0, 0);
      this.body.add(this.ring);
      for (let i = 0; i < RAYS; i++) {
        const a = (i / RAYS) * Math.PI * 2;
        const r = img(scene, isBroken(i) ? 'sun.ray.broken' : 'sun.ray');
        if (!r) continue;
        r.setRotation(a + Math.PI / 2);
        r.setPosition(Math.cos(a) * RAY_R, Math.sin(a) * RAY_R);
        r.setData('a', a);
        r.setData('i', i);
        r.setData('key', isBroken(i) ? 'sun.ray.broken' : 'sun.ray');
        this.ring.add(r);
        this.images.push(r);
        (isBroken(i) ? this.brokenRays : this.rays).push(r);
      }
    }
    for (const f of L.flowers) {
      const im = spot('sky.flower', f);
      if (im) this.flowers.push(im);
    }
    add(L.disk);
    this.blushes = many('sky.blush', L.cheeks);
    for (const b of this.blushes) b.setScale(b.scaleX * L.cheekK).setAlpha(0);
    this.freckles = many('sky.freckles', L.cheeks.map(([x0, y0]) => [x0, y0 - 6] as const), false);
    for (const f of this.freckles) f.setScale(f.scaleX * L.cheekK);
    this.eyes = many(L.eye, L.eyes);
    this.lids = many(L.lid, L.eyes);
    this.lows = many(L.low, L.eyes, false);
    this.shuts = many(L.shut, L.eyes);
    this.happies = many(L.happy, L.eyes);
    for (const s of [...this.shuts, ...this.happies]) s.setAlpha(0);
    this.brows = many('sky.brow', L.brows, false);
    // The brow is drawn for a left eye: the right one is its mirror.
    this.brows.forEach((b, i) => b.setScale(b.scaleX * L.browK * (L.brows[i]![0] > 0 ? -1 : 1), b.scaleY * L.browK));
    this.mouth = add(L.mouth, ...L.mouthAt);
    for (const k of Object.keys(MOUTHS) as MouthKind[]) {
      const im = add(MOUTHS[k], ...L.mouthAt, false);
      if (im) this.moods[k] = im;
    }
    this.laugh = add(L.open, ...L.mouthAt, false);
    this.tears = many('sky.tear', L.tears, false);
    this.plaster = spot('sky.bandage', L.band);
    this.scarf = spot('sky.scarf', L.scarf);
    this.crown = spot('sky.crown', L.crown);
    this.cap = spot('sky.nightcap', L.hat);
    // The pompom hangs at the cap's drooping tip.
    const tip = rotate(73 * L.hat.k, -56 * L.hat.k, L.hat.rot);
    this.pom = spot('sky.nightcap.pom', { ...L.hat, x: L.hat.x + tip.x, y: L.hat.y + tip.y });
    this.sweat = spot('sky.sweat', L.sweat, L.thingK);
    for (let i = 0; i < 3; i++) {
      const z = add('sky.z', L.float[0], L.float[1], false);
      if (z) this.zees.push({ im: z, key: 'sky.z', t: i / 3, speed: 0.28 });
      const nt = add('sky.note', L.float[0], L.float[1], false);
      if (nt) this.notes.push({ im: nt, key: 'sky.note', t: i / 3, speed: 0.36 });
    }
    for (let i = 0; i < 4; i++) {
      const s = add('sky.sparkle', 0, 0, false);
      if (s) this.sparkles.push(s);
    }
    this.body.add(this.glowFront);
    this.setLook(PAGE_LOOK[this.who]);
    FACES.add(this);
  }

  /** How it looks: its mood, what it wears and its tilt (its size and place are its owner's). */
  setLook(look: FaceLook): void {
    this.look = look;
    this.mood = MOODS[look.mood] ?? MOODS.calm;
    this.baseTilt = Phaser.Math.DegToRad(look.tilt);
    const wears = (w: Wear): boolean => look.wear.includes(w);
    this.cap?.setVisible(wears('nightcap'));
    this.pom?.setVisible(wears('nightcap'));
    this.crown?.setVisible(wears('crown') && !wears('nightcap'));
    this.scarf?.setVisible(wears('scarf'));
    this.tail?.setVisible(wears('scarf'));
    this.plaster?.setVisible(wears('bandage'));
    for (const f of this.freckles) f.setVisible(wears('freckles'));
    for (const f of this.flowers) f.setVisible(wears('flowers'));
    this.sweat?.setVisible(wears('sweat'));
    const m = this.mood;
    for (const b of this.brows) b.setVisible(!!m.brows);
    for (const l of this.lids) l.setVisible(m.lid === 'heavy');
    for (const l of this.lows) l.setVisible(m.lid === 'low');
    this.blinkIn = Math.min(this.blinkIn, m.blinks[1]);
  }

  /** The look it wears now. */
  get currentLook(): FaceLook {
    return this.look;
  }

  lookAt(wx: number, wy: number): void {
    const dx = wx - this.c.x;
    const dy = wy - this.c.y;
    const d = Math.hypot(dx, dy) || 1;
    this.gaze.x += ((dx / d) * 5 - this.gaze.x) * 0.08;
    this.gaze.y += ((dy / d) * 4 - this.gaze.y) * 0.08;
  }

  /**
   * A touch: the character lights up (its lamp too: `touchLevel`), and this
   * face wiggles, giggles or blinks, with a few sparkles. With less motion
   * asked for, a blink and the soft glow only. Returns what it did.
   */
  poke(): Poked {
    const calm = app.settings?.reducedMotion === true;
    const list = POKES[this.who];
    list.push(now());
    if (list.length > 4) list.shift();
    const options: Poked[] = calm ? ['blink'] : (['giggle', 'wiggle', 'blink'] as Poked[]).filter((p) => p !== this.poked || this.pokeT < 0);
    this.poked = options[Math.floor(Math.random() * options.length)] ?? 'blink';
    this.pokeT = 0;
    if (this.poked !== 'giggle') this.blink(this.poked === 'blink');
    if (!calm) {
      const L = this.layout;
      this.sparkles.forEach((s, i) => {
        const a = -Math.PI / 2 + (i - 1.5) * 0.85 + (Math.random() - 0.5) * 0.4;
        const d = L.hitR * (1 + Math.random() * 0.2);
        s.setPosition(Math.cos(a) * d, Math.sin(a) * d * 0.9).setData('t', -i * 0.06).setVisible(true).setScale(0.001);
      });
    }
    return this.poked;
  }

  private blink(twice = false): void {
    this.blinkT = this.blinkLen = Math.max(0.16, this.mood.blinks[2] * (twice ? 0.9 : 1));
    this.twice = twice;
  }

  update(dtMs: number): void {
    const dt = Math.min(0.05, Math.max(0, dtMs / 1000));
    const calm = app.settings?.reducedMotion === true;
    const L = this.layout;
    const m = this.mood;
    this.t += dt;
    const t = this.t;
    // One of each on screen.
    const want = this.presenceTarget();
    this.presence += (want - this.presence) * (1 - Math.exp(-dt * (calm ? 5 : 7)));
    if (Math.abs(want - this.presence) < 0.004) this.presence = want;
    this.pres.setAlpha(this.presence).setVisible(this.presence > 0.004);
    if (this.coughT > 0) this.coughT -= dt;
    if (this.talking > 0) this.talking -= dt;
    if (this.pokeT >= 0) this.pokeT += dt;
    if (this.pokeT > 2.5) this.pokeT = -1;
    this.humK += ((this.humming ? 1 : 0) - this.humK) * (1 - Math.exp(-dt * 3));

    // Blinks, by the mood's pace; a lively face now and then blinks twice.
    this.blinkIn -= dt;
    if (this.blinkIn <= 0) {
      this.blink(m.darts && Math.random() < 0.35);
      this.blinkIn = m.blinks[0] + Math.random() * (m.blinks[1] - m.blinks[0]);
    }
    let blink = 0;
    if (this.blinkT > 0) {
      this.blinkT -= dt;
      const u = 1 - Math.max(0, this.blinkT) / this.blinkLen;
      blink = this.twice ? Math.abs(Math.sin(u * Math.PI * 2)) : Math.sin(u * Math.PI);
    }
    // A sleepy face yawns; a delighted one squeezes its eyes with joy.
    let yawn = 0;
    if (!calm && m === MOODS.sleepy && this.talking <= 0 && !this.laughing && this.yawnT <= 0) {
      this.yawnIn -= dt;
      if (this.yawnIn <= 0) {
        this.yawnT = 2.4;
        this.yawnIn = 10 + Math.random() * 7;
      }
    }
    if (this.yawnT > 0) {
      this.yawnT -= dt;
      yawn = bump(1 - Math.max(0, this.yawnT) / 2.4, 0.35);
    }
    let squeeze = 0;
    if (!calm && m === MOODS.delighted && this.squeezeT <= 0) {
      this.squeezeIn -= dt;
      if (this.squeezeIn <= 0) {
        this.squeezeT = 0.9;
        this.squeezeIn = 3.5 + Math.random() * 3;
      }
    }
    if (this.squeezeT > 0) {
      this.squeezeT -= dt;
      squeeze = bump(1 - Math.max(0, this.squeezeT) / 0.9, 0.25);
    }
    const giggle = this.poked === 'giggle' && this.pokeT >= 0 ? bump(this.pokeT / 1.2, 0.12) : 0;
    const happy = Math.min(1, Math.max(squeeze, giggle, this.humK));

    // The gaze, glancing about a little when the face is lively.
    if (m.darts && !calm) {
      this.dartIn -= dt;
      if (this.dartIn <= 0) {
        this.dart = { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 3 };
        this.dartIn = 0.6 + Math.random() * 1.6;
      }
    } else this.dart = { x: 0, y: 0 };
    this.eyes.forEach((e, i) => {
      const [ex, ey] = L.eyes[i]!;
      e.setPosition(ex + this.gaze.x + this.dart.x, ey + this.gaze.y + this.dart.y);
    });
    const close = Math.max(blink, this.lidDrop, yawn * 0.85);
    const shut = happy > 0.5 ? 0 : close;
    for (const s of this.shuts) s.setAlpha(shut > 0.5 ? 1 : shut * 2);
    for (const s of this.happies) s.setAlpha(happy > 0.5 ? 1 : happy * 2);
    const side = (x: number): number => (x > 0 ? 1 : -1);
    const turn = m.lidRot * L.lidTurn;
    this.lids.forEach((l, i) => l.setRotation(turn * side(L.eyes[i]![0])));
    this.lows.forEach((l, i) => l.setRotation(turn * side(L.eyes[i]![0])));

    // Brows: lifted or knit with the mood, up in surprise at a touch.
    const br = m.brows;
    if (br) {
      const surprise = this.pokeT >= 0 && this.poked !== 'giggle' ? bump(this.pokeT / 0.8, 0.2) * -6 : 0;
      this.brows.forEach((b, i) => {
        const [bx, by] = L.brows[i]!;
        const raise = br.raise && i === 0 ? -br.raise : 0;
        const breathe = calm ? 0 : Math.sin(t * 1.3 + i) * 0.6;
        b.setPosition(bx, by + (br.lift + raise + surprise + breathe - yawn * 4) * L.browK);
        b.setRotation(br.rot * side(bx));
      });
    }

    // The mouth: words stretch it, a laugh and a cough open it, a yawn opens it wide.
    const open = this.laughing || this.coughT > 0;
    const glad = giggle > 0.2 || this.humK > 0.5;
    const shape: MouthKind | 'own' = yawn >= 0.15 ? 'o' : glad ? (m.mouth === 'grin' ? 'grin' : 'smile') : m.mouth;
    const talk = this.talking > 0 && !open ? (calm ? 0.25 : 0.35 * Math.abs(Math.sin(t * 11))) : 0;
    if (this.mouth) {
      const own = !open && shape === 'own';
      this.mouth.setVisible(own);
      if (own) {
        const f = frameRef(L.mouth);
        this.mouth.setScale(1 / f.scale, (1 + talk) / f.scale);
      }
    }
    for (const k of Object.keys(this.moods) as MouthKind[]) {
      const im = this.moods[k]!;
      const on = !open && shape === k;
      im.setVisible(on);
      if (!on) continue;
      const f = frameRef(MOUTHS[k]);
      const kk = L.mouthK * (yawn >= 0.15 ? 0.6 + 0.8 * yawn : m.mouthK);
      const wob = !calm && k === 'wobble' ? 1 + 0.06 * Math.sin(t * 9) : 1;
      im.setScale(kk / f.scale, (kk * wob * (1 + talk)) / f.scale);
    }
    if (this.laugh) {
      this.laugh.setVisible(open);
      if (open) {
        const f = frameRef(L.open);
        this.laugh.setScale(L.openK / f.scale);
        this.laugh.y = L.mouthAt[1] + (this.laughing && !calm ? Math.sin(t * 14) * 1.5 : 0);
      }
    }

    // A touch's light, swelling softly and ebbing slowly (touchLevel).
    const lit = touchLevel(this.who);
    const glowing = lit > 0.01;
    this.glowBack.setVisible(glowing);
    this.glowFront.setVisible(glowing);
    if (glowing) {
      this.glowBack.setAlpha(0.95 * lit).setScale((L.hitR * 4.4 * (0.92 + 0.08 * lit)) / HALO_PX);
      this.glowFront.setAlpha(0.26 * lit).setScale((L.hitR * 2.1) / HALO_PX);
    }

    // Cheeks, tears, sweat, and what rises from it.
    const blushK = Math.min(1, m.blush + giggle * 0.8 + lit * 0.4 + this.humK * 0.3);
    for (const b of this.blushes) b.setAlpha(blushK);
    this.updateTears(dt, calm, m === MOODS.teary);
    if (this.sweat?.visible) {
      const u = calm ? 0.3 : (t * 0.45) % 1;
      this.sweat.y = L.sweat.y + u * 26 * L.thingK;
      this.sweat.setAlpha(calm ? 1 : Math.min(1, u * 6, (1 - u) * 3));
    }
    this.floaters(this.zees, this.look.wear.includes('zzz') && this.humK < 0.3, dt, calm);
    this.floaters(this.notes, this.look.wear.includes('notes') || this.humK > 0.3, dt, calm);
    if (this.pom?.visible) this.pom.setRotation(L.hat.rot + (calm ? 0 : 0.3 * Math.sin(t * 2.1)));
    if (this.tail?.visible) {
      const f = frameRef('sky.scarf.tail');
      const k = L.scarf.k / f.scale;
      this.tail.setRotation(L.scarf.rot + 0.15 + (calm ? 0 : 0.12 * Math.sin(t * 2.6)));
      this.tail.setScale(k, k * (calm ? 1 : 0.94 + 0.06 * Math.sin(t * 3.3)));
    }
    if (!calm) this.flowers.forEach((f, i) => f.setRotation(L.flowers[i]!.rot + 0.1 * Math.sin(t * 1.4 + i * 1.7)));
    this.updateSparkles(dt);

    // The whole face: its tilt, a slow sway and bob, its breath, a wiggle, a hop.
    const breath = Math.sin(t * ((m.breaths / 60) * Math.PI * 2));
    let rot = this.baseTilt + (calm ? 0 : m.sway * Math.sin(t * 0.35) + this.humK * 0.08 * Math.sin(t * 2.4));
    let y = calm ? 0 : m.bob * Math.sin(t * 0.6 + 0.5);
    if (!calm && this.poked === 'wiggle' && this.pokeT >= 0) rot += 0.16 * Math.sin(this.pokeT * 22) * Math.max(0, 1 - this.pokeT / 0.8);
    if (!calm && giggle > 0) y -= Math.abs(Math.sin(this.pokeT * 13)) * 7 * giggle;
    const cough = this.coughT > 0 && !calm ? Math.abs(Math.sin(this.coughT * 18)) : 0;
    const sx = (1 + 0.014 * breath + yawn * 0.02) * (1 - cough * 0.06);
    const sy = (1 - 0.014 * breath + yawn * 0.04) * (1 + cough * 0.04);
    this.body.setRotation(rot).setPosition(0, y).setScale(sx, sy);
    if (this.kind === 'sun') this.updateRays(calm);
  }

  private updateTears(dt: number, calm: boolean, teary: boolean): void {
    const L = this.layout;
    if (!teary) {
      for (const tr of this.tears) tr.setVisible(false);
      return;
    }
    const f = frameRef('sky.tear');
    if (calm) {
      // A tear welled up, still.
      this.tears.forEach((tr, i) => tr.setVisible(i === 0).setPosition(L.tears[i]![0], L.tears[i]![1]).setAlpha(1).setScale(L.thingK / f.scale));
      return;
    }
    const PERIOD = 2.6;
    this.tearT += dt;
    if (this.tearT > PERIOD) {
      this.tearT = 0;
      this.tearAt = (this.tearAt + 1) % this.tears.length;
    }
    const u = this.tearT / PERIOD;
    this.tears.forEach((tr, i) => {
      const on = i === this.tearAt;
      tr.setVisible(on);
      if (!on) return;
      const [x0, y0] = L.tears[i]!;
      // It wells up at the lid, then runs down the cheek and is gone.
      const grow = Math.min(1, u / 0.35);
      const run = Math.max(0, (u - 0.35) / 0.65);
      tr.setPosition(x0 + run * 3, y0 + run * run * 48 * L.thingK);
      tr.setScale((L.thingK * (0.4 + 0.6 * grow)) / f.scale);
      tr.setAlpha(1 - run * run);
    });
  }

  /** Zs (sleep) or notes (a song) drifting up and outward. */
  private floaters(list: Floater[], on: boolean, dt: number, calm: boolean): void {
    const L = this.layout;
    const dir = L.floatDir;
    list.forEach((fl, i) => {
      fl.im.setVisible(on);
      if (!on) return;
      const f = frameRef(fl.key);
      if (calm) {
        fl.im.setPosition(L.float[0] + dir * i * 22 * L.thingK, L.float[1] - i * 26 * L.thingK).setAlpha(1 - i * 0.25).setScale((L.thingK * (0.6 + i * 0.2)) / f.scale).setRotation(0);
        return;
      }
      fl.t = (fl.t + dt * fl.speed) % 1;
      const u = fl.t;
      fl.im.setPosition(L.float[0] + dir * (u * 44 + Math.sin(u * 7 + i) * 6) * L.thingK, L.float[1] - u * 80 * L.thingK);
      fl.im.setAlpha(Math.min(1, u * 5, (1 - u) * 3));
      fl.im.setScale((L.thingK * (0.45 + 0.6 * u)) / f.scale);
      fl.im.setRotation(dir * Math.sin(u * 5 + i) * 0.25);
    });
  }

  private updateSparkles(dt: number): void {
    const f = frameRef('sky.sparkle');
    for (const s of this.sparkles) {
      if (!s.visible) continue;
      const st = (s.getData('t') as number) + dt;
      s.setData('t', st);
      if (st < 0) continue;
      const u = st / 0.6;
      if (u >= 1) {
        s.setVisible(false);
        continue;
      }
      s.setScale((this.layout.thingK * 1.3 * Math.sin(u * Math.PI)) / f.scale).setRotation(u * 1.6);
    }
  }

  private updateRays(calm: boolean): void {
    const [len0, speed] = this.mood.rays;
    const cough = this.coughT > 0 ? Math.abs(Math.sin(this.coughT * 18)) : 0;
    const swellK = 1 + touchLevel(this.who) * 0.1 + this.humK * 0.05;
    const t = this.t;
    this.ring?.setRotation(calm ? 0 : 0.04 * Math.sin(t * 0.21) + this.humK * 0.05 * Math.sin(t * 1.2));
    for (const r of [...this.rays, ...this.brokenRays]) {
      const a = r.getData('a') as number;
      const i = r.getData('i') as number;
      const wave = calm ? 0.94 : 0.88 + 0.12 * Math.sin(t * speed + i);
      const len = this.rayLevel * rayLength(i) * wave * len0 * swellK;
      const f = frameRef(r.getData('key') as string);
      r.setScale(1 / f.scale, (1 / f.scale) * Math.max(0.001, len));
      r.setAlpha(this.rayLevel <= 0.01 ? 0 : 1 - cough * 0.4 * (i % 2));
      r.setPosition(Math.cos(a) * RAY_R, Math.sin(a) * RAY_R);
    }
  }

  cough(): void {
    this.coughT = 0.9;
    if (this.laugh) {
      this.laughing = true;
      this.scene.time.delayedCall(800, () => (this.laughing = false));
    }
    app.audio.sfx('cough');
  }

  say(ms = 1800): void {
    this.talking = ms / 1000;
  }

  /**
   * How brightly the face shines just now (about 1), for the light it
   * throws into the room: it breathes, swells through a laugh or a word,
   * dims for a cough and a blink, and the Sun shines with its rays. Slow
   * waves only (a whole room's light must never flash fast). A touch adds
   * its own soft swell (`touched`), which the lamps take separately.
   */
  get glow(): number {
    const sun = this.kind === 'sun';
    let k = 1 + (sun ? 0.07 : 0.05) * Math.sin(this.t * (sun ? 1.3 : 0.8));
    if (this.laughing) k *= 1 + 0.1 * Math.sin(this.t * 9);
    if (this.talking > 0) k *= 1 + 0.08 * Math.sin(this.t * 7);
    if (this.coughT > 0) k *= 1 - 0.3 * Math.sin((Math.max(0, this.coughT) / 0.9) * Math.PI);
    const blink = this.blinkT > 0 ? Math.sin((Math.max(0, this.blinkT) / this.blinkLen) * Math.PI) * (this.twice ? 0.5 : 1) : 0;
    k *= 1 - 0.2 * Math.max(blink, this.lidDrop);
    k *= 1 + 0.06 * this.humK;
    if (sun) k *= 0.45 + 0.55 * Math.min(1, this.rayLevel);
    return k;
  }

  /** How strongly a touch lights the character up just now (0 … 1). */
  get touched(): number {
    return touchLevel(this.who);
  }

  /** Dims the face toward the night's lilac (0: as drawn), for the one that is not out. A touch lights it up again for a moment. */
  dim(k: number): void {
    // The tween that sets it eases back past 0 and 1: beyond them the colour would overflow.
    k = Math.min(1, Math.max(0, k)) * (1 - 0.85 * this.touched);
    if (Math.abs(k - this.dimmed) < 0.004) return;
    this.dimmed = k;
    const c = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(0xffffff),
      Phaser.Display.Color.ValueToColor(0x9a92b8),
      1,
      k,
    );
    const tint = Phaser.Display.Color.GetColor(c.r, c.g, c.b);
    for (const o of this.images) o.setTint(tint);
  }

  setScale(s: number): void {
    this.c.setData('baseScale', s);
    this.c.setScale(s);
  }

  /** The face's radius (part px): where it may be touched. */
  get radius(): number {
    return this.layout.hitR;
  }

  /**
   * Where the face is on the canvas (device px) and its radius there; null
   * once it is gone. Through the room's lens for a face in the room, through
   * the camera in the flat scenes (the sky, the cards).
   */
  screen(): { x: number; y: number; r: number } | null {
    const sc = this.c.scene;
    if (!sc || !this.c.active) return null;
    const m = this.c.getWorldTransformMatrix(TMP, TMP_PARENT);
    const r = this.layout.hitR * Math.hypot(m.a, m.b);
    const paper = (sc as unknown as { paper?: { lens?: Lens; planes?: { zOf(o: object): number } } }).paper;
    if (paper?.lens && paper.planes) {
      let root: Phaser.GameObjects.GameObject = this.c;
      while (root.parentContainer) root = root.parentContainer;
      const z = paper.planes.zOf(root);
      const p = paper.lens.project(m.tx, m.ty, z);
      return { x: p.x, y: p.y, r: r * paper.lens.scale(z) };
    }
    // The flat scenes neither turn nor skew their camera: a point maps by the
    // camera's zoom from where the canvas's top left corner shows.
    const cam = sc.cameras.main;
    const o = cam.getWorldPoint(0, 0, TMP_PT);
    return { x: (m.tx - o.x) * cam.zoom, y: (m.ty - o.y) * cam.zoom, r: r * cam.zoom };
  }

  /** How much of the face can be seen just now (0 … 1): its alpha all the way up, its presence, and how much of it is on the canvas. */
  showing(): number {
    if (!this.alive()) return 0;
    const sc = this.c.scene;
    if (!sc.sys.isActive() || !sc.sys.settings.visible) return 0;
    let a = this.c.visible ? this.c.alpha : 0;
    for (let p = this.c.parentContainer; p && a > 0; p = p.parentContainer) a *= p.visible ? p.alpha : 0;
    a *= this.presence;
    if (a <= 0.001 || this.place === 'card') return Math.max(0, a);
    const s = this.screen();
    if (!s) return 0;
    const W = sc.scale.width;
    const H = sc.scale.height;
    const r = Math.max(1, s.r);
    const fx = Math.min(1, Math.max(0, (Math.min(s.x + r, W) - Math.max(s.x - r, 0)) / (2 * r)));
    const fy = Math.min(1, Math.max(0, (Math.min(s.y + r, H) - Math.max(s.y - r, 0)) / (2 * r)));
    return a * Math.min(1, fx * fy * 1.6);
  }

  private alive(): boolean {
    return !!this.c.scene && this.c.active;
  }

  /** 1 unless the same character shows somewhere closer (a card over the room, the room over the sky). */
  private presenceTarget(): number {
    if (this.place === 'card') return 1;
    const above = Face.showingAbove(this.who, this.place);
    if (above > AWAY) this.away = true;
    else if (above < BACK) this.away = false;
    return this.away ? 0 : 1;
  }

  /** Whether this face has stepped out for a closer one of its character. */
  get stepsAside(): boolean {
    return this.away;
  }

  /** How much of `who` shows in places closer than `place`. */
  static showingAbove(who: Who, place: FacePlace): number {
    let most = 0;
    for (const f of FACES) {
      if (!f.alive()) {
        FACES.delete(f);
        continue;
      }
      if (f.who !== who || RANK[f.place] <= RANK[place]) continue;
      most = Math.max(most, f.showing());
    }
    return most;
  }

  /** The face of `who` that shows most in a place closer than `place`, and how much. */
  static closest(who: Who, place: FacePlace): { face: Face; k: number } | null {
    let best: { face: Face; k: number } | null = null;
    for (const f of FACES) {
      if (f.who !== who || RANK[f.place] <= RANK[place] || !f.alive()) continue;
      const k = f.showing();
      if (k > (best?.k ?? 0.001)) best = { face: f, k };
    }
    return best;
  }

  /** The face of `who` that shows most just now, wherever it is (null: none shows). */
  static seen(who: Who): Face | null {
    let best: Face | null = null;
    let k = 0.05;
    for (const f of FACES) {
      if (f.who !== who || !f.alive()) continue;
      const s = f.showing();
      if (s > k || (best && Math.abs(s - k) < 0.02 && RANK[f.place] > RANK[best.place])) {
        best = f;
        k = Math.max(k, s);
      }
    }
    return best;
  }

  destroy(): void {
    FACES.delete(this);
    this.c.destroy(true);
  }
}

/** The room's lens, as far as a face needs it. */
interface Lens {
  project(x: number, y: number, z: number): { x: number; y: number };
  scale(z: number): number;
}

function rotate(x: number, y: number, a: number): { x: number; y: number } {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: x * c - y * s, y: x * s + y * c };
}
