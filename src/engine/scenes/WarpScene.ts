import * as Phaser from 'phaser';
import { app } from '../App';
import { FRAMING } from '../../content/stage';
import { actorScale } from '../../paper/press';
import { Theatre } from '../../paper/theatre';
import { earliestOpen, openLength, peakAt, pose, riseAtTime, STAGE_TIMES, type ChangeKind, type Plan } from '../../paper/stagecraft';
import { CHAPTER_TITLES } from '../state/GameState';
import { ROMAN } from '../../ui/Menus';
import type { Sfx } from '../systems/AudioSystem';

// Between rooms the game is a paper theatre changing its scene: two painted
// flats roll in from the wings close to the eye and meet over the room;
// behind them the room is changed (`onPeak`); they roll back out and the
// next room's cards stand up off its floor, the far ones first. Between
// chapters a drop curtain comes down instead, the chapter's title card
// comes down in front of it on two threads ("BÖLÜM", its numeral painted
// with a brush, its title) and its little picture stands up on a ledge;
// then the card goes up, the curtain rises and the chapter's first room
// stands up. Everything is paper standing on the stage in front of the box,
// drawn by the stage's own lens (src/paper/stagecraft.ts, theatre.ts):
// nothing is a picture of the room, nothing is laid over the screen.
//
// Less motion asked for: the flats or the curtain only fade in where they
// stand and out again; nothing rolls, drops, swings or stands up. Nothing
// waits forever: the whole thing ends within a few seconds whatever happens.

/** The handshake between the scene change and the room it brings (`WorldData.arrive`). */
export interface Arrival {
  /** The chapter whose title card was shown (null: none). */
  readonly chapter: number | null;
  /** The world has been made (set by the world). */
  made: boolean;
  /** Frames the world has run since (counted by the world). */
  frames: number;
  /** Where Gorti's screen glows now, canvas px, when he shows (set by the world). */
  face: (() => { x: number; y: number } | null) | null;
  /** The light has reached his screen: it flares (set by the world). */
  glow: ((k: number) => void) | null;
  /** The cards may stand up now (set by the change). */
  rise: boolean;
  /** The change is over: play may begin (set by the change). */
  over: boolean;
}

export interface WarpData {
  /** Called once, when the old room can no longer be seen: swap rooms or scenes here, passing `arrival` on to the world. */
  onPeak: (arrival: Arrival) => void;
  /** A chapter's title card between (the chapter's number), else the flats. */
  chapter?: number | null;
  /** 1: forward through the story, -1: back (the theatre's change reads the same either way). */
  dir?: 1 | -1;
  /** Where Gorti's screen glows in the room being left, canvas px (null: he does not show): the flats close on him. */
  glow?: { x: number; y: number } | null;
}

/** The world is ready to be seen once it has run this many frames. */
const READY_FRAMES = 3;

/** A sound at a moment of the change: from its start, or from the stage's opening. */
interface Cue {
  at: number;
  from: 'start' | 'open';
  sfx: Sfx;
  vol: number;
  pitch?: number;
}

const T = STAGE_TIMES;
const POPS = (after: number): Cue[] =>
  [0.05, 0.2, 0.36].map((d, i) => ({ at: after + d, from: 'open' as const, sfx: 'pop' as const, vol: 0.5 + 0.15 * i, pitch: 0.85 + 0.12 * i }));

const CUES: Record<ChangeKind, readonly Cue[]> = {
  room: [
    { at: 0, from: 'start', sfx: 'whoosh', vol: 0.5, pitch: 0.8 },
    { at: T.close - 0.02, from: 'start', sfx: 'paper', vol: 0.7, pitch: 0.85 },
    { at: 0, from: 'open', sfx: 'whoosh', vol: 0.45, pitch: 0.95 },
    ...POPS(T.riseAfter),
  ],
  chapter: [
    { at: 0.02, from: 'start', sfx: 'flutter', vol: 0.8, pitch: 0.8 },
    { at: T.drop * 0.8, from: 'start', sfx: 'paper', vol: 0.8, pitch: 0.7 },
    { at: T.drop + T.cardAfter, from: 'start', sfx: 'chapter', vol: 0.9 },
    { at: T.drop + T.cardAfter + T.pictureAfter, from: 'start', sfx: 'pop', vol: 0.8, pitch: 1.05 },
    { at: 0.04, from: 'open', sfx: 'flutter', vol: 0.7, pitch: 0.9 },
    ...POPS(T.raiseRise),
  ],
};

export class WarpScene extends Phaser.Scene {
  private data0!: WarpData;
  private t = 0;
  private last = -1;
  private plan: Plan = { kind: 'room', reduced: false, open: Infinity };
  private arrival!: Arrival;
  private peaked = false;
  private rose = false;
  private glowed = false;
  private done = false;
  private theatre: Theatre | null = null;

  constructor() {
    super('warp');
  }

  init(data: WarpData): void {
    this.data0 = data;
    this.t = 0;
    this.last = -1;
    this.peaked = false;
    this.rose = false;
    this.glowed = false;
    this.done = false;
    this.arrival = { chapter: data.chapter ?? null, made: false, frames: 0, face: null, glow: null, rise: false, over: false };
  }

  create(): void {
    this.scene.bringToTop();
    const chapter = this.arrival.chapter;
    const kind: ChangeKind = chapter !== null ? 'chapter' : 'room';
    this.plan = { kind, reduced: app.settings.reducedMotion, open: Infinity };
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.teardown());
    // The HUD's texts go while the stage is changed (and lines wait while a chapter is shown, see Dialogue.ts).
    app.ui.stage.classList.add(kind === 'chapter' ? 'pt-chapter' : 'pt-room');
    try {
      this.theatre = new Theatre(this, kind, FRAMING, actorScale(), this.data0.glow?.x ?? null);
      if (chapter !== null) void this.theatre.printCard(chapter, ROMAN[chapter] ?? String(chapter), CHAPTER_TITLES[chapter] ?? '');
      this.theatre.update(pose(this.plan, 0));
    } catch (e) {
      // Whatever went wrong, the swap still happens and play goes on.
      console.warn('scene change failed', e);
      this.theatre?.destroy();
      this.theatre = null;
      this.finish();
    }
  }

  /** The room has been made and has drawn a few frames. */
  private get ready(): boolean {
    return this.arrival.made && this.arrival.frames >= READY_FRAMES;
  }

  override update(_time: number, delta: number): void {
    if (this.done) return;
    // A frame-by-frame harness may hold the change at a moment (dev and e2e builds only).
    const held = import.meta.env.DEV || __E2E__ ? (window as unknown as { __kdWarpClock?: { t: number } }).__kdWarpClock : undefined;
    this.t = held ? held.t : this.t + Math.min(delta, 100) / 1000;
    const t = this.t;
    const p = this.plan;
    if (t > T.limit) {
      this.finish();
      return;
    }
    if (!this.peaked && t >= peakAt(p.kind, p.reduced)) this.peak();
    // The stage opens once the room is there (and not before the chapter has been shown long enough).
    if (this.peaked && p.open === Infinity && t >= earliestOpen(p.kind, p.reduced) && this.ready) {
      p.open = t;
      // The HUD comes back as the stage opens.
      this.time.delayedCall((p.kind === 'room' ? T.open * 0.3 : T.raise * 0.45) * 1000, () => app.ui.stage.classList.remove('pt-chapter', 'pt-room'));
    }
    if (!this.rose && p.open !== Infinity && t >= riseAtTime(p.kind, p.reduced, p.open)) {
      this.rose = true;
      this.arrival.rise = true;
    }
    // His screen flares once the stage is open over him.
    if (!this.glowed && p.open !== Infinity && t >= p.open + (p.reduced ? 0 : p.kind === 'room' ? 0.45 : 0.55)) {
      this.glowed = true;
      if (this.arrival.face?.()) this.arrival.glow?.(0.7);
    }
    if (!p.reduced) this.cues(t);
    this.last = t;
    this.theatre?.update(pose(p, t));
    if (p.open !== Infinity && t >= p.open + openLength(p.kind, p.reduced)) this.finish();
  }

  /** The sounds whose moment has come since the last frame. */
  private cues(t: number): void {
    const open = this.plan.open;
    for (const c of CUES[this.plan.kind]) {
      const at = c.from === 'start' ? c.at : open + c.at;
      if (Number.isFinite(at) && at > this.last && at <= t) app.audio.sfx(c.sfx, { vol: c.vol, pitch: c.pitch });
    }
  }

  /** Swaps what is behind the flats or the curtain, once. */
  private peak(): void {
    if (this.peaked) return;
    this.peaked = true;
    this.data0.onPeak(this.arrival);
  }

  /** Play begins: everything of the change goes. */
  private finish(): void {
    if (this.done) return;
    this.done = true;
    this.peak();
    this.arrival.rise = true;
    this.arrival.over = true;
    this.scene.stop();
  }

  private teardown(): void {
    app.ui.stage.classList.remove('pt-chapter', 'pt-room');
    // Whatever was cut short: the room is played from here.
    this.arrival.rise = true;
    this.arrival.over = true;
    this.theatre?.destroy();
    this.theatre = null;
  }
}
