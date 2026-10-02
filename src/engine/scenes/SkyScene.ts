import * as Phaser from 'phaser';
import { VIEW_H, VIEW_W } from '../constants';
import { app } from '../App';
import { fitScene } from '../../paper/screen';
import { Face, setPageLook, touchLevel, type FaceKind, type Who } from '../../gameplay/actors/Celestial';
import { HALO_PX, lightTextures } from '../../render/2d/fx/lightArt';
import { chapterOfRoom } from '../../content/data/rooms';
import { NAMES } from '../../content/data/dialogue.tr';
import { skyLines, skyLook } from '../../content/text/text';
import { DEFAULT_LOOK, SIZE_RANGE, type FaceLook, type Place, type SkyLine } from '../../content/text/check';
import { playWord, voiceFor } from '../audio/voices';
import type { SkyTarget } from '../../ui/SkyTouch';
import type { SkyJson, SkyOut } from '../content/types';
import type { WorldScene } from './WorldScene';

// The Moon (top left) and the Sun (top right), above every room: the
// chapter says which Moon and how the Sun feels (chapters.json, a room's
// `sky`, the `sky` action), and each page dresses them (sky.json: a mood,
// things to wear, a tilt, a size, a place in the corner). The one that is
// out (Gorti's kahkaha swaps them) grows and shines, the other dims, and
// the room takes its light. Its own scene so the world camera's zoom and
// the 2.5D stage leave it alone; the world scene runs it.
//
// One of each: while the Sun or the Moon shows closer (in the room, in a
// dialogue card) its face here glides toward it and steps out of sight,
// and comes back after; its light stays where it was (Celestial's
// `presence`). A new page's faces come in once the page has turned, so the
// old page's never show beside them.
//
// They can be touched (src/ui/SkyTouch.ts): a tap lights one up, holding
// it for three seconds makes it say a line of the page (sky.json).

/** Each face's home in its corner of what shows (layout px from that corner) and its size there. */
const HOME: Record<Who, { x: number; y: number; scale: number }> = {
  moon: { x: 100, y: 96, scale: 0.68 },
  sun: { x: 112, y: 106, scale: 0.56 },
};
/** The ancient Moon is the taller crescent: it hangs a little lower, its horns and hat on screen. */
const KIND_DOWN: Record<FaceKind, number> = { baby: 0, old: 18, sun: 0 };
/** A page's place for a face within its corner: how far toward the side edge, and down (layout px at size 1). */
const PLACES: Record<Place, { out: number; down: number }> = {
  corner: { out: 0, down: 0 },
  peek: { out: 40, down: 16 },
  high: { out: 6, down: -36 },
  low: { out: -10, down: 30 },
  inward: { out: -54, down: -6 },
};
/** The sizes a page may give a face (sky.json): the corners stay corners. */
const sizeOf = (look: FaceLook): number => Math.min(SIZE_RANGE[1], Math.max(SIZE_RANGE[0], look.size));
/** Scale of the one that is out and of the other; the other also dims (never fades out). */
const OUT = { s: 1.22, a: 1 };
const IN = { s: 0.86, a: 1 };
const DIM = 0.42;
/** How far a face glides toward its closer self as it steps aside (share of the way), and how small it gets. */
const GLIDE = 0.5;
const GLIDE_SHRINK = 0.32;
/** A breath of air over everything while each one is out (their lamps light the room: SkyLamps). */
const TINT: Record<SkyOut, { color: number; alpha: number }> = {
  none: { color: 0x000000, alpha: 0 },
  sun: { color: 0xffc766, alpha: 0.04 },
  moon: { color: 0x1d2468, alpha: 0.12 },
};

/**
 * The light about each face and the light it pours into the room, as
 * strong as it shines: a halo (its width, scene px) and soft beams toward
 * the room ([angle°, length, width, how fast it sways]).
 */
const GLOW: Record<FaceKind, { color: number; halo: number; beams: readonly (readonly [number, number, number, number])[] }> = {
  sun: { color: 0xffd27a, halo: 440, beams: [[112, 0.8, 0.8, 0.31], [128, 1, 1, 0.23], [144, 0.9, 0.85, 0.37], [161, 0.7, 0.7, 0.27]] },
  baby: { color: 0xdcd2ff, halo: 330, beams: [[22, 0.75, 0.7, 0.25], [37, 1, 0.95, 0.19], [52, 0.9, 0.8, 0.29], [68, 0.7, 0.65, 0.22]] },
  old: { color: 0xb6c8ff, halo: 330, beams: [[22, 0.75, 0.7, 0.25], [37, 1, 0.95, 0.19], [52, 0.9, 0.8, 0.29], [68, 0.7, 0.65, 0.22]] },
};
/** A beam at length 1 and width 1 (scene px). */
const BEAM = { len: 980, wide: 170 };

/** A line held for three seconds: how fast it is lettered, and how long it stays after. */
const SAY = { cps: 34, stay: 2.4, perChar: 0.04 };
/** How often Gorti answers a line that has an answer. */
const ANSWER_CHANCE = 0.6;
/** The line each said last (never twice in a row, from page to page too). */
const LAST: Record<Who, string> = { sun: '', moon: '' };

type Glow = { halo: Phaser.GameObjects.Image; beams: Phaser.GameObjects.Image[] };

type FullSky = Required<SkyJson>;
const NONE: FullSky = { moon: 'none', sun: 'none', out: 'none' };

/** A face in its corner: the page's look, its coming in, and where it glides while it shows elsewhere. */
interface Home {
  look: FaceLook;
  /** 0 … 1 as it comes in after the page has turned. */
  enter: number;
  /** Where its closer self is (layout px), while it shows. */
  toward: { x: number; y: number } | null;
}

const newHome = (): Home => ({ look: DEFAULT_LOOK, enter: 0, toward: null });

export class SkyScene extends Phaser.Scene {
  private moon: Face | null = null;
  private sun: Face | null = null;
  private sky: FullSky = { ...NONE };
  private eye = { x: VIEW_W / 2, y: 400 };
  /** Current emphasis (tweened): moon/sun scale factor and alpha. */
  private k = { m: 1, ma: 1, s: 1, sa: 1, md: 0, sd: 0 };
  private tint!: Phaser.GameObjects.Rectangle;
  private glows!: Record<Who, Glow>;
  private laughT = 0;
  private homes: Record<Who, Home> = { sun: newHome(), moon: newHome() };
  /** The page (room and chapter) whose looks and lines these are. */
  private page: { room: string | null; chapter: string | null } = { room: null, chapter: null };
  /** The faces wait for the page to finish turning before they come in. */
  private waiting = false;
  /** The part of the 1280 × 720 layout the screen shows (the faces keep to its corners). */
  private view: () => Phaser.Geom.Rectangle = () => new Phaser.Geom.Rectangle(0, 0, VIEW_W, VIEW_H);

  constructor() {
    super({ key: 'sky' });
  }

  create(data: { sky?: FullSky }): void {
    this.moon = this.sun = null;
    this.sky = { ...NONE };
    this.k = { m: 1, ma: 1, s: 1, sa: 1, md: 0, sd: 0 };
    this.laughT = 0;
    this.view = fitScene(this, 'height');
    this.tint = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x000000, 0).setOrigin(0).setDepth(0);
    lightTextures(this.textures);
    const glow = (): Glow => ({
      halo: this.add.image(0, 0, 'fx.halo').setBlendMode(Phaser.BlendModes.ADD).setDepth(6).setVisible(false),
      beams: [0, 1, 2, 3].map(() => this.add.image(0, 0, 'fx.beam').setOrigin(0, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(5).setVisible(false)),
    });
    this.glows = { moon: glow(), sun: glow() };
    // This page's looks: the room's, else its chapter's, else the default (sky.json).
    const world = this.world();
    const room = world?.def?.id ?? null;
    this.page = { room, chapter: room ? (chapterOfRoom(room)?.id ?? null) : null };
    this.homes = { sun: newHome(), moon: newHome() };
    for (const who of ['sun', 'moon'] as const) {
      const look = skyLook(who, this.page.room, this.page.chapter);
      this.homes[who].look = look;
      setPageLook(who, look);
    }
    // Arriving through a scene change: they come in once it is over.
    this.waiting = !!world?.transitioning;
    this.set(data.sky ?? NONE, false);
    this.place();
    app.ui.skyTouch.attach({ poke: (who) => this.poke(who), speak: (who) => this.speak(who) });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      app.ui.skyTouch.detach();
      this.moon?.destroy();
      this.sun?.destroy();
      this.moon = this.sun = null;
    });
  }

  private world(): WorldScene | null {
    if (!this.scene.isActive('world')) return null;
    return this.scene.get('world') as WorldScene;
  }

  /** Changes what the sky shows (only what `sky` names). */
  set(sky: SkyJson, animate = true): void {
    const next: FullSky = { ...this.sky, ...sky };
    if (next.moon !== this.sky.moon || !this.moon) {
      this.moon?.destroy();
      this.moon = next.moon === 'none' ? null : new Face(this, next.moon, 0, 0, 10, 'home');
    }
    if ((next.sun === 'none') !== (this.sky.sun === 'none') || !this.sun) {
      this.sun?.destroy();
      this.sun = next.sun === 'none' ? null : new Face(this, 'sun', 0, 0, 10, 'home');
    }
    const changed = next.out !== this.sky.out;
    this.sky = next;
    this.shine(animate && changed);
    if (animate && changed) this.laughT = next.out === 'none' ? 0 : 1.8;
  }

  get current(): Readonly<FullSky> {
    return this.sky;
  }

  /** Where the faces look (screen px: Gorti). */
  look(x: number, y: number): void {
    this.eye.x = x;
    this.eye.y = y;
  }

  /** Where the faces look, as a point of the device-pixel screen. */
  lookAtScreen(x: number, y: number): void {
    const p = this.cameras.main.getWorldPoint(x, y);
    this.look(p.x, p.y);
  }

  /**
   * Where the Sun or the Moon shines from, as a point of the device-pixel
   * screen (its home in the corner: the light stays there while the face
   * shows elsewhere); how far it is out (0 while the other one is, about
   * 0.4 with neither, 1 out, a little over as it comes out); its face's own
   * flicker (about 1); and how much a touch lights it up (0 … 1). Null when
   * it is not in the sky.
   */
  shining(who: Who): { x: number; y: number; out: number; glow: number; touch: number; kind: FaceKind } | null {
    const f = who === 'moon' ? this.moon : this.sun;
    if (!f) return null;
    const v = this.view();
    const at = this.anchor(who);
    const s = who === 'moon' ? this.k.m : this.k.s;
    return {
      x: ((at.x - v.x) / v.width) * this.scale.width,
      y: ((at.y - v.y) / v.height) * this.scale.height,
      out: Math.max(0, s - IN.s) / (OUT.s - IN.s),
      glow: f.glow,
      touch: touchLevel(who),
      kind: f.kind,
    };
  }

  /** The look a face wears on this page (sky.json). */
  lookOf(who: Who): FaceLook {
    return this.homes[who].look;
  }

  /** Dresses a face for this page anew (a page's look, or one tried out in development). */
  restyle(who: Who, look: FaceLook): void {
    this.homes[who].look = look;
    setPageLook(who, look);
  }

  /** A face's home on this page (layout px): its corner of what shows, moved to the page's place for it. */
  private anchor(who: Who): { x: number; y: number } {
    const v = this.view();
    const h = HOME[who];
    const look = this.homes[who].look;
    const p = PLACES[look.place] ?? PLACES.corner;
    const size = sizeOf(look);
    const out = p.out * size;
    const x = who === 'moon' ? v.x + h.x * size - out : v.right - h.x * size + out;
    const kind: FaceKind = who === 'sun' ? 'sun' : this.sky.moon === 'old' ? 'old' : 'baby';
    return { x, y: v.y + (h.y + p.down + KIND_DOWN[kind]) * size };
  }

  /** The faces in their corners (coming in, or gliding toward where they show closer); the light over all of it. */
  private place(): void {
    const v = this.view();
    this.tint.setPosition(v.x, v.y).setSize(v.width, v.height);
    const calm = app.settings.reducedMotion;
    for (const who of ['moon', 'sun'] as const) {
      const f = who === 'moon' ? this.moon : this.sun;
      if (!f) continue;
      const home = this.homes[who];
      const at = this.anchor(who);
      const size = sizeOf(home.look);
      const base = HOME[who].scale * size * (who === 'moon' ? this.k.m : this.k.s);
      // Coming in: down from above its corner (a fade only, with less motion).
      const u = home.enter;
      const drop = calm ? 0 : 1 - easeOutBack(u);
      const side = who === 'moon' ? -1 : 1;
      let x = at.x + side * 70 * drop;
      let y = at.y - 190 * drop;
      // Stepping aside: toward its closer self, and smaller (its presence fades it).
      const g = 1 - f.presence;
      if (g > 0 && home.toward && !calm) {
        x += (home.toward.x - at.x) * GLIDE * g;
        y += (home.toward.y - at.y) * GLIDE * g;
      }
      f.c.setPosition(x, y);
      f.setScale(base * (1 - (calm ? 0 : GLIDE_SHRINK) * g));
      f.c.setAlpha((who === 'moon' ? this.k.ma : this.k.sa) * Math.min(1, u * 1.6));
    }
  }

  /** Short speech movement of a face (a line it says). */
  talk(who: Who, ms = 1800): void {
    (who === 'moon' ? this.moon : this.sun)?.say(ms);
  }

  /** Grows the one that is out, dims the other, lights the room. */
  private shine(animate: boolean): void {
    const out = this.sky.out;
    const to = {
      m: out === 'moon' ? OUT.s : out === 'sun' ? IN.s : 1,
      ma: out === 'sun' ? IN.a : 1,
      s: out === 'sun' ? OUT.s : out === 'moon' ? IN.s : 1,
      sa: out === 'moon' ? IN.a : 1,
      md: out === 'sun' ? DIM : 0,
      sd: out === 'moon' ? DIM : 0,
    };
    const tint = TINT[out];
    this.tweens.killTweensOf([this.k, this.tint]);
    if (!animate) {
      Object.assign(this.k, to);
      this.tint.setFillStyle(tint.color, tint.alpha);
      return;
    }
    this.tweens.add({ targets: this.k, ...to, duration: 700, ease: 'Back.easeOut' });
    // The light turns through the new colour.
    if (tint.alpha > 0) this.tint.fillColor = tint.color;
    this.tweens.add({ targets: this.tint, fillAlpha: tint.alpha, duration: 900, ease: 'Sine.easeInOut' });
  }

  override update(_time: number, dtMs: number): void {
    const dt = Math.min(0.05, dtMs / 1000);
    if (this.laughT > 0) this.laughT -= dt;
    const world = this.world();
    if (this.waiting && !world?.transitioning) this.waiting = false;
    for (const who of ['moon', 'sun'] as const) {
      const h = this.homes[who];
      if (!this.waiting) h.enter = Math.min(1, h.enter + dt / (app.settings.reducedMotion ? 0.6 : 0.95));
      // Where it shows closer, for its face here to glide toward.
      const near = Face.closest(who, 'home');
      const s = near?.face.screen();
      if (s) h.toward = this.cameras.main.getWorldPoint(s.x, s.y);
    }
    this.place();
    const out = this.sky.out;
    const singing = world?.player?.state === 'song';
    const dlg = app.ui.dialogue;
    const speaking = dlg.typing ? dlg.speaker : '';
    if (this.moon) {
      this.moon.dim(this.k.md);
      if (out === 'moon' && this.laughT > 0 && Math.random() < 0.04) this.moon.say(500);
      // A line of its own in a plain dialogue (no card): it speaks it here.
      if (speaking && (speaking === NAMES.babyMoon || speaking === NAMES.oldMoon)) this.moon.say(300);
      this.moon.humming = singing;
    }
    if (this.sun) {
      this.sun.dim(this.k.sd);
      this.sun.laughing = this.sky.sun === 'laugh' || (out === 'sun' && this.laughT > 0);
      if (speaking && speaking === NAMES.sun) this.sun.say(300);
      this.sun.humming = singing;
    }
    this.shed(this.glows.moon, this.moon, this.k.m, 'moon');
    this.shed(this.glows.sun, this.sun, this.k.s, 'sun');
    for (const f of [this.moon, this.sun]) {
      if (!f) continue;
      f.lookAt(this.eye.x, this.eye.y);
      f.update(dtMs);
    }
    this.touchFrame(world);
  }

  /** A face's halo and beams: as strong as it shines, the beams slowly swaying and breathing; brighter for a while when touched. */
  private shed(g: Glow, f: Face | null, s: number, who: Who): void {
    const enter = this.homes[who].enter;
    const on = !!f && enter > 0;
    g.halo.setVisible(on);
    for (const b of g.beams) b.setVisible(on);
    if (!f || !on) return;
    const at = this.anchor(who);
    const out = Math.max(0, s - IN.s) / (OUT.s - IN.s);
    const touch = touchLevel(who);
    const shine = (0.22 + 0.78 * Math.min(1.15, out)) * f.glow * (1 + 0.55 * touch) * Math.min(1, enter * 1.4);
    const size = sizeOf(this.homes[who].look);
    const look = GLOW[f.kind];
    const still = app.settings.reducedMotion;
    const t = this.time.now / 1000;
    g.halo
      .setPosition(at.x, at.y)
      .setTint(look.color)
      .setAlpha(Math.min(1, 0.6 * shine + 0.3 * touch * Math.min(1, enter * 1.4)))
      .setScale((look.halo * (0.75 + 0.3 * out) * (1 + 0.18 * touch) * (0.85 + 0.15 * size) * 1.15) / HALO_PX);
    g.beams.forEach((b, i) => {
      const [deg, len, wide, rate] = look.beams[i]!;
      const sway = still ? 0 : 0.035 * Math.sin(t * rate + i * 1.9);
      const breathe = still ? 0.8 : 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * rate * 1.3 + i * 2.7));
      b.setPosition(at.x, at.y)
        .setRotation(Phaser.Math.DegToRad(deg) + sway)
        .setTint(look.color)
        .setDisplaySize(BEAM.len * len * (0.8 + 0.25 * out), BEAM.wide * wide)
        .setAlpha(Math.min(1, 0.2 * shine * breathe));
    });
  }

  // ------------------------------------------------------------ touch

  /** Play is free: nothing is said, shown or turning (a line may be asked for). */
  private free(world: WorldScene | null): boolean {
    if (!world || world.paused || world.transitioning) return false;
    if (app.input.context !== 'gameplay' || app.ui.dialogue.isOpen || app.ui.doc.isOpen) return false;
    return !world.narrative?.busy;
  }

  /** Tells the touch layer where each one shows (wherever it is), and whether holding it may make it speak. */
  private touchFrame(world: WorldScene | null): void {
    const turning = !!world?.transitioning || this.waiting;
    const free = !turning && this.free(world);
    const target = (who: Who): SkyTarget | null => {
      if (turning) return null;
      const f = Face.seen(who);
      if (!f || f.showing() < 0.5) return null;
      const s = f.screen();
      if (!s) return null;
      return { x: s.x, y: s.y, r: s.r, talk: free && f.place !== 'card' };
    };
    let gorti: { x: number; y: number } | null = null;
    const p = world?.player;
    if (world && p && p.state !== 'hidden' && p.rig.container.visible) {
      const e = p.kind === 'gorti' ? p.rig.attachPoint('eye') : { x: p.x, y: p.feetY - 150 };
      const s = world.paper.lens.project(e.x, e.y - 40, p.z);
      gorti = { x: s.x, y: s.y };
    }
    app.ui.skyTouch.frame({ sun: target('sun'), moon: target('moon') }, gorti, free);
  }

  /** A tap: the one touched lights up and reacts at once, with a chime. */
  private poke(who: Who): void {
    const f = Face.seen(who);
    if (!f) return;
    const did = f.poke();
    app.audio.sfx('skyChime', { pitch: who === 'sun' ? 1 : 0.75, vol: 0.9 });
    if (did === 'giggle') this.time.delayedCall(90, () => app.audio.sfx('giggle', { pitch: who === 'sun' ? 1.05 : 0.85, vol: 0.8 }));
  }

  /** Held for three seconds: it says a line of this page (never the one it said last), and Gorti may answer. */
  private speak(who: Who): void {
    const lines = skyLines(who, this.page.room, this.page.chapter);
    const fresh = lines.filter((l) => l.text !== LAST[who]);
    const pool = fresh.length ? fresh : lines;
    const line: SkyLine | undefined = pool[Math.floor(Math.random() * pool.length)];
    if (!line) return;
    LAST[who] = line.text;
    const f = Face.seen(who);
    const kind = f?.kind ?? (who === 'sun' ? 'sun' : this.sky.moon === 'old' ? 'old' : 'baby');
    const name = kind === 'sun' ? NAMES.sun : kind === 'old' ? NAMES.oldMoon : NAMES.babyMoon;
    const typing = line.text.length / SAY.cps;
    f?.say(typing * 1000 + 200);
    app.ui.skyTouch.say(who, line.text, (typing + SAY.stay + line.text.length * SAY.perChar) * 1000, (word, last) => this.voice(name, word, line.text, last));
    const answer = line.answer;
    if (!answer || Math.random() >= ANSWER_CHANCE) return;
    this.time.delayedCall((typing + 0.9) * 1000, () => {
      const world = this.world();
      if (!this.free(world)) return;
      const t = answer.length / SAY.cps;
      world?.player?.emote('talk', t * 1000 + 300);
      app.ui.skyTouch.say('gorti', answer, (t + SAY.stay + answer.length * SAY.perChar) * 1000, (word, last) => this.voice(NAMES.gorti, word, answer, last));
    });
  }

  /** One word of a line in the speaker's voice (as in the dialogues). */
  private voice(name: string, word: string, text: string, last: boolean): void {
    const out = app.audio.sfxOut();
    if (out) playWord(out, voiceFor(name), word, { text }, last);
  }
}

/** Overshoots a little and settles (a face popping in). */
function easeOutBack(u: number): number {
  const c1 = 1.4;
  const c3 = c1 + 1;
  const x = Math.min(1, Math.max(0, u));
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
