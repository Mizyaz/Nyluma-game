import * as Phaser from 'phaser';
import { app } from '../App';
import { DEPTH, HULL_W } from '../constants';
import { frameRef, hasFrame } from '../art/TextureFactory';
import { WHALE_BUBBLES, WHALE_DROPS } from '../art/characters/whales';
import type { RoomDef } from '../data/roomTypes';
import { WhaleActor } from '../entities/WhaleActor';
import { planWhales, type WhalePlace } from './whalePlan';
import type { SolidRt } from './RoomRuntime';
import { pick, WORDS, type ComicWords } from '../fx/comicWords';

// The room's jump-through platforms are whales: each floats with its flat
// back exactly on the platform's top line, its body hanging below in the air.
// Collision stays with the room (the platform's static body); the whale is
// visual only. Landings are read from the player's ground state each frame:
// the whale dips on a spring, pastel bubbles and droplets puff out and it
// calls in its species' voice. Now and then a far whale calls.

/**
 * What the manager reads from the scene (WorldScene), structurally. Feet are
 * read from the physics body: during the scene's update the player's game
 * object still sits where the previous frame left it.
 */
interface PlayerView {
  onGround: boolean;
  state: string;
  body: { x: number; width: number; bottom: number; velocity: { y: number } };
}
interface SceneView {
  player?: PlayerView;
  paused?: boolean;
  transitioning?: boolean;
}

interface Entry {
  rt: SolidRt;
  w: WhaleActor;
  place: WhalePlace;
  /** Gate state the whale currently shows. */
  shown: boolean;
  /** Swim-in progress (<0 waits for its turn); 1 = in place. */
  swimIn: number;
  /** Visibility 0..1 (fades when the gate closes). */
  vis: number;
  lastCall: number;
  /** World bounds at rest, with room for the dip and the spout. */
  b: { x0: number; y0: number; x1: number; y1: number };
}

interface Mote {
  img: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
  g: number;
  life: number;
  max: number;
  s: number;
  drop: boolean;
}

const SWIM_IN_S = 1.7;
const CULL_MARGIN = 90;

export class WhalePlatforms {
  private entries: Entry[] = [];
  private plan = new Map<number, WhalePlace>();
  private motes: Mote[] = [];
  private nextMote = 0;
  private synced = false;
  private wasGround = true;
  private air = 0;
  private fallV = 0;
  private clock = 0;
  private nextFar: number;
  private alive = true;
  /** A revealed group answers once the first of it has swum in. */
  private answer: Entry | null = null;

  constructor(
    private scene: Phaser.Scene,
    room: RoomDef,
  ) {
    for (const p of planWhales(room)) this.plan.set(p.index, p);
    this.nextFar = 6 + Math.random() * 6;
    for (let i = 0; i < 22; i++) {
      const drop = i % 3 === 2;
      const key = drop ? `whale.drop.${i % WHALE_DROPS}` : `whale.bubble.${i % WHALE_BUBBLES}`;
      if (!hasFrame(key)) continue;
      const f = frameRef(key);
      const img = scene.add.image(0, 0, f.atlas, f.frame).setOrigin(f.px / f.w, f.py / f.h).setDepth(DEPTH.props + 2).setVisible(false);
      this.motes.push({ img, vx: 0, vy: 0, g: 0, life: 0, max: 1, s: 1 / f.scale, drop });
    }
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
  }

  /** Puts the planned whale on a platform (called as the room adds it). */
  add(rt: SolidRt): void {
    const place = this.plan.get(rt.index);
    if (!place) return;
    const w = new WhaleActor(this.scene, place);
    w.setVisible(false);
    if (app.settings.reducedMotion) w.calm = 0.45;
    const b = { x0: 0, y0: 0, x1: 0, y1: 0 };
    w.bounds(b);
    b.y1 += 12;
    this.entries.push({ rt, w, place, shown: false, swimIn: 1, vis: 0, lastCall: -9, b });
  }

  get count(): number {
    return this.entries.length;
  }

  /** The whale whose platform the feet are on. */
  private under(x: number, feetY: number): Entry | null {
    for (const e of this.entries) {
      const d = e.rt.def;
      if (!e.rt.active || !e.rt.body.enable) continue;
      if (Math.abs(feetY - d.y) <= 3 && x >= d.x - HULL_W / 2 - 1 && x <= d.x + d.w + HULL_W / 2 + 1) return e;
    }
    return null;
  }

  private update(_time: number, delta: number): void {
    const sv = this.scene as unknown as SceneView;
    if (!this.alive || sv.paused || sv.transitioning) return;
    const dtMs = Math.min(delta, 50);
    const dt = dtMs / 1000;
    this.clock += dt;
    const p = sv.player;

    // Landings, from the player's ground state (collision is untouched).
    let standing: Entry | null = null;
    if (p && p.state !== 'hidden') {
      const px = p.body.x + p.body.width / 2;
      if (p.onGround) {
        standing = this.under(px, p.body.bottom);
        if (!this.wasGround && this.air > 0.1 && standing && this.synced) this.land(standing, px);
        this.air = 0;
        this.fallV = 0;
      } else {
        this.air += dt;
        this.fallV = Math.max(this.fallV, p.body.velocity.y);
      }
      this.wasGround = p.onGround;
    }

    const view = this.scene.cameras.main.worldView;
    let arrivals = 0;
    for (const e of this.entries) {
      const on = e.rt.active;
      if (!this.synced) {
        // As the room was built (and its flags restored): no entrance.
        e.shown = on;
        e.vis = on ? 1 : 0;
      } else if (on !== e.shown) {
        e.shown = on;
        // Revealed during play: swim in, one after another (fade in with
        // reduced motion).
        if (on) {
          e.swimIn = -0.16 * arrivals++;
          if (arrivals === 1) this.answer = e;
        }
      }
      if (e.shown) e.vis = 1;
      else e.vis = Math.max(0, e.vis - dt * 2.5);
      let enter = 1;
      if (e.swimIn < 1) {
        e.swimIn += dt / SWIM_IN_S;
        const k = Math.max(0, Math.min(1, e.swimIn));
        enter = 1 - (1 - k) * (1 - k);
        e.w.offX = app.settings.reducedMotion ? 0 : -e.w.facing * 110 * (1 - enter);
        if (e.swimIn >= 1) {
          e.w.offX = 0;
          if (Math.random() < 0.6) e.w.spout();
          if (this.answer === e) {
            this.answer = null;
            app.audio.whaleCall(e.place.species, 'short', { vol: 0.6, pitch: e.w.voice, distance: 0.3, pan: this.pan(e.place.x) });
            e.w.vocalize(1.2);
          }
        }
      }
      const latent = e.rt.def.latent ? 0.1 + 0.9 * e.rt.reveal : 1;
      const alpha = e.vis * latent * Math.min(1, Math.max(0, e.swimIn) * 2.2);
      const b = e.b;
      const inView = b.x1 + CULL_MARGIN > view.x && b.x0 - CULL_MARGIN < view.right && b.y1 + CULL_MARGIN > view.y && b.y0 - CULL_MARGIN < view.bottom;
      const show = alpha > 0.01 && inView;
      e.w.setVisible(show);
      if (!show) continue;
      if (e.w.c.alpha !== alpha) e.w.c.setAlpha(alpha);
      e.w.update(dtMs, e === standing ? 1 : 0);
    }
    this.synced = true;
    this.updateMotes(dt);
    this.farCalls(dt, p ?? null);
  }

  private land(e: Entry, x: number): void {
    const impact = Math.max(0.15, Math.min(1, (this.fallV - 60) / 640));
    e.w.dip(impact, x);
    this.puff(e, x, impact);
    if (this.clock - e.lastCall > 1.2) {
      e.lastCall = this.clock;
      app.audio.whaleCall(e.place.species, 'short', { vol: 0.65 + 0.35 * impact, pitch: e.w.voice, pan: this.pan(e.place.x) });
      e.w.vocalize(e.place.species === 'blue' ? 1.4 : 1);
    }
    if (impact > 0.45 && Math.random() < 0.45) e.w.spout();
    // The comic word for a landing on a whale.
    const comic = (this.scene as { comic?: ComicWords }).comic;
    comic?.pop(x, e.place.y - 70, pick(WORDS.whale), 'whale');
  }

  /** Pastel bubbles off the flanks and droplets off the back. */
  private puff(e: Entry, x: number, impact: number): void {
    const n = 7 + Math.round(impact * 9);
    const y = e.place.y;
    const deep = e.w.lay.depth * e.place.scale;
    for (let i = 0; i < n; i++) {
      const m = this.motes[this.nextMote];
      if (!m) return;
      this.nextMote = (this.nextMote + 1) % this.motes.length;
      const side = Math.random() < 0.5 ? -1 : 1;
      if (m.drop) {
        m.img.setPosition(x + (Math.random() - 0.5) * 30, y - 3);
        m.vx = side * (50 + Math.random() * 110);
        m.vy = -(140 + Math.random() * 160) * (0.6 + 0.4 * impact);
        m.g = 720;
        m.max = 0.7 + Math.random() * 0.3;
      } else {
        m.img.setPosition(x + (Math.random() - 0.5) * 70, y + 6 + Math.random() * deep * 0.55);
        m.vx = side * (25 + Math.random() * 60);
        m.vy = -(30 + Math.random() * 60);
        m.g = -55;
        m.max = 1 + Math.random() * 0.8;
      }
      m.life = m.max;
      m.img.setVisible(true).setAlpha(1).setScale(m.s * (m.drop ? 0.8 + Math.random() * 0.5 : 0.9 + Math.random() * 0.9));
    }
  }

  private updateMotes(dt: number): void {
    for (const m of this.motes) {
      if (m.life <= 0) continue;
      m.life -= dt;
      if (m.life <= 0) {
        m.img.setVisible(false);
        continue;
      }
      m.vy += m.g * dt;
      m.img.x += m.vx * dt;
      m.img.y += m.vy * dt;
      m.vx *= 1 - dt * 1.2;
      m.img.setAlpha(Math.min(1, (m.life / m.max) * 2.2));
    }
  }

  private pan(x: number): number {
    const v = this.scene.cameras.main.worldView;
    return Math.max(-1, Math.min(1, (x - v.centerX) / 700));
  }

  /** Now and then a whale calls from further off (quieter, duller, with an echo). */
  private farCalls(dt: number, p: PlayerView | null): void {
    if (!this.synced || (this.nextFar -= dt) > 0) return;
    this.nextFar = 16 + Math.random() * 18;
    if (app.input.context !== 'gameplay') return;
    const shown = this.entries.filter((e) => e.shown && e.rt.active);
    if (!shown.length) return;
    const e = shown[Math.floor(Math.random() * shown.length)]!;
    const d = p ? Math.hypot(e.place.x - (p.body.x + p.body.width / 2), e.place.y - p.body.bottom) : 900;
    app.audio.whaleCall(e.place.species, 'long', { vol: 0.8, pitch: e.w.voice, distance: 0.45 + 0.55 * Math.min(1, d / 1500), pan: this.pan(e.place.x) });
    if (e.w.c.visible) {
      e.w.vocalize(3);
      if (Math.random() < 0.5) e.w.spout();
    }
  }

  destroy(): void {
    if (!this.alive) return;
    this.alive = false;
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.scene.events.off(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
    for (const e of this.entries) e.w.destroy();
    for (const m of this.motes) m.img.destroy();
    this.entries = [];
    this.motes = [];
  }
}
