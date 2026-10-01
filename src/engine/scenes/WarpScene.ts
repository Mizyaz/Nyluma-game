import * as Phaser from 'phaser';
import { app } from '../App';
import { h } from '../../ui/dom';
import { Clock, Leaf, type Rect } from '../../ui/PageTurn';
import { ChapterPage } from '../../ui/ChapterPage';
import { Motes, Spark } from '../../ui/PageBits';
import { RISE } from '../../paper/popUp';

// Between rooms the game is a pop-up book. The picture just shown becomes a
// real page: it is picked up by its free edge, curls over and is turned
// away in perspective, and under it the next room's cards stand up from the
// paper, the far ones first. Between chapters the page turns onto a chapter
// page (its numeral painted, its title and a little picture popping up),
// which then opens down the middle like a gatefold onto the chapter's first
// room. Gorti's screen glow leaves the old page and flies to him in the new
// one. The swap happens at once behind the page (`onPeak`), and the room is
// made while the page is lifted, so nothing half-made is ever seen.
//
// Less motion asked for: the page only fades to paper and the paper to the
// room (through the chapter page between chapters); nothing turns or pops.
// No picture could be taken: paper is wiped over the screen instead, and the
// rest goes on as usual. Nothing waits forever: the whole thing ends within
// a few seconds whatever happens.

/** The handshake between the page turn and the room it brings (`WorldData.arrive`). */
export interface Arrival {
  /** The chapter whose page was shown (null: none). */
  readonly chapter: number | null;
  /** The world has been made (set by the world). */
  made: boolean;
  /** Frames the world has run since (counted by the world). */
  frames: number;
  /** Where Gorti's screen glows now, canvas px, when he shows (set by the world). */
  face: (() => { x: number; y: number } | null) | null;
  /** The light has reached his screen: it flares (set by the world). */
  glow: ((k: number) => void) | null;
  /** The cards may stand up now (set by the turn). */
  rise: boolean;
  /** The turn is over: play may begin (set by the turn). */
  over: boolean;
}

export interface WarpData {
  /** Called once, when the old picture can no longer be seen: swap rooms or scenes here, passing `arrival` on to the world. */
  onPeak: (arrival: Arrival) => void;
  /** A chapter page between (the chapter's number), else a page turn. */
  chapter?: number | null;
  /** 1: forward (the page turns from right to left), -1: back. */
  dir?: 1 | -1;
  /** Where Gorti's screen glows in the picture being left, canvas px (null: he does not show). */
  glow?: { x: number; y: number } | null;
}

/** Timings (s). */
export const TURN_TIMES = {
  /** Longest wait for a picture of the last frame before wiping paper over it instead. */
  capture: 0.25,
  /** The free edge picked up and curled over. */
  lift: 0.32,
  /** The page turned away. */
  turn: 0.82,
  /** From the turn's start until the cards begin to stand up. */
  riseAfter: 0.1,
  /** The paper under the lifted page gives way to the room. */
  unveil: 0.16,
  /** The chapter page is shown at least this long (from the start). */
  chapterHold: 2.15,
  /** The chapter page opens. */
  open: 0.86,
  /** Paper wiped over the screen when no picture could be taken. */
  wipe: 0.28,
  /** Less motion: the cross-fades, and how long the chapter page stays. */
  fadeOut: 0.26,
  fadeIn: 0.3,
  reducedHold: 1.5,
  /** Whatever happens, it is over by then. */
  limit: 8,
} as const;
const T = TURN_TIMES;

/** The world is ready to be seen once it has run this many frames. */
const READY_FRAMES = 3;

type Phase = 'capture' | 'lifted' | 'turning' | 'chapter' | 'opening' | 'fading' | 'done';

export class WarpScene extends Phaser.Scene {
  private data0!: WarpData;
  private clock!: Clock;
  private t = 0;
  private phase: Phase = 'capture';
  private phaseAt = 0;
  private peaked = false;
  private arrival!: Arrival;
  private reduced = false;
  private dir: 1 | -1 = 1;
  private layer: HTMLElement | null = null;
  /** The game view inside the layer (CSS px). */
  private view: Rect = { x: 0, y: 0, w: 0, h: 0 };
  private under: HTMLElement | null = null;
  private leaf: Leaf | null = null;
  private page: ChapterPage | null = null;
  private spark: Spark | null = null;
  private motes: Motes | null = null;
  private shot: HTMLCanvasElement | null = null;
  private captured = false;
  /** When the room becomes playable (s). */
  private endAt = Infinity;

  constructor() {
    super('warp');
  }

  init(data: WarpData): void {
    this.data0 = data;
    this.t = 0;
    this.phase = 'capture';
    this.phaseAt = 0;
    this.peaked = false;
    this.captured = false;
    this.shot = null;
    this.endAt = Infinity;
    this.dir = data.dir ?? 1;
    this.arrival = { chapter: data.chapter ?? null, made: false, frames: 0, face: null, glow: null, rise: false, over: false };
  }

  create(): void {
    this.scene.bringToTop();
    this.reduced = app.settings.reducedMotion;
    this.clock = new Clock();
    this.buildLayer();
    // The picture just drawn, taken in the same frame (WebGL keeps it only until then).
    this.game.events.once(Phaser.Core.Events.POST_RENDER, this.capture, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.teardown());
  }

  private buildLayer(): void {
    const stage = app.ui.stage;
    const layer = h('div', { class: 'pt passive', 'aria-hidden': 'true' });
    // Over the game view and the colour storm, under the HUD, texts and menus.
    const storm = stage.querySelector(':scope > .color-storm');
    if (storm) storm.after(layer);
    else stage.prepend(layer);
    this.layer = layer;
    const sr = stage.getBoundingClientRect();
    const cr = this.game.canvas.getBoundingClientRect();
    this.view = { x: cr.left - sr.left, y: cr.top - sr.top, w: cr.width || sr.width, h: cr.height || sr.height };
  }

  /** Takes the picture now on the canvas (none if it cannot be taken), and lays the page over it. */
  private capture(): void {
    if (this.captured || !this.layer) return;
    this.captured = true;
    try {
      const src = this.game.canvas;
      const c = document.createElement('canvas');
      c.width = src.width;
      c.height = src.height;
      const ctx = c.getContext('2d');
      if (ctx && c.width > 0 && c.height > 0) {
        ctx.drawImage(src, 0, 0);
        if (!blank(c)) this.shot = c;
      }
    } catch {
      this.shot = null;
    }
    try {
      this.begin();
    } catch (e) {
      // Whatever went wrong, the swap still happens and play goes on.
      console.warn('page turn failed', e);
      this.finish();
    }
  }

  /** The page is laid over the picture: from here on the old one is never seen again. */
  private begin(): void {
    const v = this.view;
    const layer = this.layer!;
    const chapter = this.arrival.chapter;
    const shot = this.shot;
    // Under the page: the chapter page, or a sheet of paper over the game view.
    if (chapter !== null) {
      const sr = app.ui.stage.getBoundingClientRect();
      this.page = new ChapterPage(this.clock, layer, chapter, { w: sr.width, h: sr.height }, v, this.reduced, (n, o) => app.audio.sfx(n, o));
      app.ui.stage.classList.add('pt-chapter');
    } else {
      this.under = h('div', { class: 'pt-under' });
      place(this.under, v);
      layer.append(this.under);
      // The HUD's texts go with the old page and come back with the new room.
      app.ui.stage.classList.add('pt-room');
    }
    if (shot) {
      this.leaf = new Leaf(this.clock, layer, v, shot, this.dir, this.reduced);
      if (this.reduced) this.leaf.fade(T.fadeOut * 1000);
      else {
        this.leaf.lift(T.lift * 1000);
        app.audio.sfx('flutter', { vol: 0.8 });
        this.motes = new Motes(this.clock, layer, v);
        this.motes.puff(0.04, this.dir > 0 ? 0.97 : 0.03, 8, this.dir);
        const g = this.data0.glow;
        if (g) {
          this.spark = new Spark(this.clock, layer, this.toLayer(g), Math.min(v.w, v.h));
          this.spark.rise(this.dir);
        }
      }
      this.page?.reveal(this.dir, this.reduced ? 0 : T.lift + 0.1);
      this.peak();
    } else {
      // No picture: paper is wiped over the screen first.
      const cover = this.page ? this.page.el : this.under!;
      this.clock.play(cover, [{ opacity: 0 }, { opacity: 1 }], { duration: T.wipe * 1000, easing: 'ease-in' });
      this.page?.reveal(this.dir, this.reduced ? 0 : T.wipe, false);
    }
    this.go('lifted');
  }

  /** Swaps what is under the page, once. */
  private peak(): void {
    if (this.peaked) return;
    this.peaked = true;
    this.data0.onPeak(this.arrival);
  }

  private go(p: Phase): void {
    this.phase = p;
    this.phaseAt = this.t;
  }

  /** The room has been made and has drawn a few frames. */
  private get ready(): boolean {
    return this.arrival.made && this.arrival.frames >= READY_FRAMES;
  }

  override update(_time: number, delta: number): void {
    this.t += Math.min(delta, 100) / 1000;
    this.clock.tick(this.t);
    const t = this.t;
    if (t > T.limit && this.phase !== 'done') {
      this.finish();
      return;
    }
    switch (this.phase) {
      case 'capture':
        // No frame drawn in time: go on without a picture.
        if (t > T.capture) this.capture();
        break;
      case 'lifted':
        this.whileLifted(t);
        break;
      case 'chapter':
        this.whileChapter(t);
        break;
      case 'turning':
      case 'opening':
      case 'fading':
        if (t >= this.endAt) this.finish();
        break;
      case 'done':
        break;
    }
  }

  private whileLifted(t: number): void {
    const since = t - this.phaseAt;
    if (!this.shot) {
      // The wipe: the swap waits until the paper covers everything.
      if (since < T.wipe) return;
      this.peak();
    }
    if (this.page) {
      // The old page turns onto the chapter page at once: the room is made behind it.
      if (this.reduced || !this.leaf) {
        if (since >= (this.shot ? T.fadeOut : T.wipe)) this.go('chapter');
        return;
      }
      if (since >= T.lift) {
        this.leaf.turn(T.turn * 1000);
        app.audio.sfx('leaf', { vol: 0.9 });
        this.spark?.fade(T.turn * 0.6);
        this.motes?.puff(0.3, 0.5, 6, this.dir);
        // Once it has gone over, the old page is let go.
        this.clock.after(T.turn + 0.05, () => {
          this.leaf?.destroy();
          this.leaf = null;
        });
        this.go('chapter');
      }
      return;
    }
    const minLift = this.reduced ? T.fadeOut : this.shot ? T.lift : T.wipe;
    if (since < minLift || !this.ready) return;
    // The room is there: the page turns away and its cards stand up.
    if (this.reduced) {
      this.clock.play(this.under!, [{ opacity: 1 }, { opacity: 0 }], { duration: T.fadeIn * 1000, easing: 'ease-out' });
      app.ui.stage.classList.remove('pt-room');
      this.arrival.rise = true;
      this.endAt = t + T.fadeIn;
      this.go('fading');
      return;
    }
    // Without a picture the leaf is plain paper, laid over the paper wiped in.
    this.leaf ??= new Leaf(this.clock, this.layer!, this.view, null, this.dir);
    this.clock.play(this.under!, [{ opacity: 1 }, { opacity: 0 }], { duration: T.unveil * 1000, easing: 'ease-out' });
    this.leaf.turn(T.turn * 1000);
    app.audio.sfx('leaf', { vol: 0.9 });
    this.motes?.puff(0.32, 0.5, 6, this.dir);
    this.clock.after(T.turn * 0.45, () => app.ui.stage.classList.remove('pt-room'));
    this.time.delayedCall(T.riseAfter * 1000, () => {
      this.arrival.rise = true;
      this.pops();
    });
    const face = this.newFace();
    if (this.spark && face) this.spark.home(face, T.turn * 0.92, () => this.arrival.glow?.(0.7));
    else {
      this.spark?.fade(T.turn * 0.5);
      if (face) this.time.delayedCall(T.turn * 700, () => this.arrival.glow?.(0.6));
    }
    // Play begins as the page lands and the nearest cards settle.
    this.endAt = t + Math.max(T.turn, T.riseAfter + RISE.spread + RISE.dur * 0.62);
    this.go('turning');
  }

  /** Soft cardboard pops as the cards stand up, far to near. */
  private pops(): void {
    [0.05, 0.2, 0.36].forEach((d, i) => this.time.delayedCall(d * 1000, () => app.audio.sfx('pop', { vol: 0.5 + 0.15 * i, pitch: 0.85 + 0.12 * i })));
  }

  private whileChapter(t: number): void {
    const hold = this.reduced ? T.reducedHold : T.chapterHold;
    if (t < hold || !this.ready) return;
    const page = this.page!;
    if (this.reduced) {
      app.ui.stage.classList.remove('pt-chapter');
      page.fade(T.fadeIn * 1000);
      this.arrival.rise = true;
      this.endAt = t + T.fadeIn;
      this.go('fading');
      return;
    }
    page.open(T.open * 1000);
    // The HUD comes back once the doors stand well apart.
    this.clock.after(T.open * 0.5, () => app.ui.stage.classList.remove('pt-chapter'));
    app.audio.sfx('leaf', { vol: 0.8, pitch: 0.78 });
    this.time.delayedCall(T.riseAfter * 1000, () => {
      this.arrival.rise = true;
      this.pops();
    });
    if (this.newFace()) this.time.delayedCall(T.open * 650, () => this.arrival.glow?.(0.7));
    this.endAt = t + Math.max(T.open, T.riseAfter + RISE.spread + RISE.dur * 0.62);
    this.go('opening');
  }

  /** Gorti's face in the new room (layer px), if he shows. */
  private newFace(): { x: number; y: number } | null {
    const f = this.arrival.face?.() ?? null;
    return f ? this.toLayer(f) : null;
  }

  /** Canvas px → the layer's CSS px. */
  private toLayer(p: { x: number; y: number }): { x: number; y: number } {
    const v = this.view;
    const c = this.game.canvas;
    return { x: v.x + (p.x / Math.max(1, c.width)) * v.w, y: v.y + (p.y / Math.max(1, c.height)) * v.h };
  }

  /** Play begins: everything of the turn goes. */
  private finish(): void {
    if (this.phase === 'done') return;
    this.phase = 'done';
    this.peak();
    this.arrival.rise = true;
    this.arrival.over = true;
    this.scene.stop();
  }

  private teardown(): void {
    this.game.events.off(Phaser.Core.Events.POST_RENDER, this.capture, this);
    app.ui.stage.classList.remove('pt-chapter', 'pt-room');
    // Whatever was cut short: the room is played from here.
    this.arrival.rise = true;
    this.arrival.over = true;
    this.clock?.clear();
    this.leaf?.destroy();
    this.page?.destroy();
    this.spark?.destroy();
    this.motes?.destroy();
    this.layer?.remove();
    this.leaf = this.page = null;
    this.spark = null;
    this.motes = null;
    this.layer = this.under = null;
    this.shot = null;
  }
}

/** Places an element over a rectangle of the layer. */
function place(el: HTMLElement, r: Rect): void {
  el.style.cssText = `left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`;
}

/** A picture that came out empty (nothing drawn into it, or all black). */
function blank(c: HTMLCanvasElement): boolean {
  try {
    const s = document.createElement('canvas');
    s.width = 8;
    s.height = 8;
    const ctx = s.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;
    ctx.drawImage(c, 0, 0, 8, 8);
    const d = ctx.getImageData(0, 0, 8, 8).data;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3]! > 8 && d[i]! + d[i + 1]! + d[i + 2]! > 24) return false;
    return true;
  } catch {
    return false;
  }
}
