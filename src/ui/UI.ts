import type * as Phaser from 'phaser';
import { app } from '../engine/App';
import { CAST_NAMES, type CastId } from '../engine/cinematics/castNames';
import { NAMES } from '../content/data/dialogue.tr';
import type { Settings } from '../engine/state/types';
import { ColorStorm } from './ColorStorm';
import { Dialogue } from './Dialogue';
import { DocView } from './DocView';
import { EndingView } from './EndingView';
import { Hud } from './Hud';
import { Menus } from './Menus';
import { TouchControls } from './TouchControls';
import { SkyTouch } from './SkyTouch';
import { LoadingView } from './LoadingView';

/** Root of all DOM overlays; keeps #stage aligned with the letterboxed canvas. */
export class UI {
  readonly stage: HTMLElement;
  readonly hud: Hud;
  readonly dialogue: Dialogue;
  readonly menus: Menus;
  readonly doc: DocView;
  readonly ending: EndingView;
  readonly touch: TouchControls;
  /** The Sun and the Moon under a finger (under the HUD, the texts, the menus and the controls). */
  readonly skyTouch: SkyTouch;
  readonly colorStorm: ColorStorm;
  private loadingView: LoadingView | null = null;
  private game: Phaser.Game;
  private last = performance.now();
  /** The speech balloon, and who its tail was last aimed at. */
  private balloon: HTMLElement | null;
  private aimed = '';

  constructor(game: Phaser.Game) {
    this.game = game;
    this.stage = document.getElementById('stage')!;
    this.hud = new Hud(this.stage);
    this.skyTouch = new SkyTouch(this.stage, this.hud.el);
    this.dialogue = new Dialogue(this.stage);
    this.balloon = this.stage.querySelector<HTMLElement>('.dialogue');
    this.doc = new DocView(this.stage);
    this.ending = new EndingView(this.stage);
    this.menus = new Menus(this.stage);
    this.touch = new TouchControls(document.getElementById('touch')!);
    this.colorStorm = new ColorStorm(this.stage);
    const sync = (): void => this.sync();
    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);
    game.events.once('ready', () => {
      game.scale.on('resize', sync);
      // The canvas box can still settle after the window's last resize event
      // (the portrait band is laid out by CSS): follow the canvas itself too.
      if (typeof ResizeObserver !== 'undefined') new ResizeObserver(sync).observe(game.canvas);
      sync();
    });
    game.events.on('prestep', () => app.input.beginFrame());
    game.events.on('poststep', () => this.tick());
    sync();
  }

  /**
   * Lays the overlay out around the canvas. Landscape (computers, phones held
   * sideways): the canvas fills the window and the stage lies on it. Portrait:
   * the canvas spans the width under a band for the HUD, and the stage is the
   * whole viewport, so texts, panels and menus use the room around the game.
   */
  sync(): void {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const portrait = H > W * 0.9;
    const root = document.getElementById('app');
    if (root && root.classList.contains('portrait') !== portrait) {
      root.classList.toggle('portrait', portrait);
      // The canvas box changed shape: let Phaser measure it and fit again
      // (refresh() alone reuses the last measured parent size).
      if (this.game.isBooted) {
        this.game.scale.getParentBounds();
        this.game.scale.refresh();
      }
    }
    const canvas = this.game.canvas;
    const r = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: W, height: H };
    const box = portrait ? { left: 0, top: 0, width: W, height: H } : r;
    // Room for the whole main menu under the game view (see .title-screen).
    root?.classList.toggle('roomy', portrait && H - (r.top + r.height) >= 300);
    const s = this.stage.style;
    s.left = `${box.left}px`;
    s.top = `${box.top}px`;
    s.width = `${box.width}px`;
    s.height = `${box.height}px`;
    // Where the game view lies inside the stage.
    s.setProperty('--gx', `${r.left - box.left}px`);
    s.setProperty('--gy', `${r.top - box.top}px`);
    s.setProperty('--gw', `${r.width}px`);
    s.setProperty('--gh', `${r.height}px`);
    s.setProperty('--sw', `${box.width}px`);
    s.setProperty('--sh', `${box.height}px`);
    // One UI scale from the viewport (1 at 1280×720), whatever the orientation.
    const scale = Math.min(1.4, Math.max(0.5, Math.min(W / 1280, H / 720)));
    document.documentElement.style.setProperty('--s', scale.toFixed(3));
    this.touch.layout();
    this.skyTouch.layout();
    this.aimTail(true);
  }

  /**
   * Points the speech balloon's tail at whoever speaks: their window in a
   * face scene, Gorti himself in the world, else the balloon's left side.
   * Presentation only: it reads the scenes and never changes them.
   */
  private aimTail(force = false): void {
    const who = this.dialogue.speaker;
    const at = who ? this.speakerX(who) : null;
    const key = `${who}|${at ?? ''}`;
    if (!force && key === this.aimed) return;
    const el = this.balloon;
    const box = el && who ? el.getBoundingClientRect() : null;
    // Closed or not laid out yet: try again next frame.
    this.aimed = box && !box.width ? '' : key;
    if (!el || !box || !box.width) return;
    const view = this.game.canvas?.getBoundingClientRect();
    const x = at !== null && view ? view.left + at * view.width - box.left : box.width * 0.16;
    const edge = Math.min(box.width / 2, 42);
    const tx = Math.max(edge, Math.min(box.width - edge, x));
    el.style.setProperty('--tail-x', `${Math.round(tx)}px`);
    el.dataset.tail = tx > box.width * 0.55 ? 'r' : 'l';
  }

  /** Where the speaker is across the game view (0…1, in 1% steps), when known. */
  private speakerX(who: string): number | null {
    const scenes = this.game.scene;
    if (scenes.isActive('cinema')) {
      // The face scene's 1280 × 720 layout, as its camera fits it on the canvas.
      const cinema = scenes.getScene('cinema') as unknown as { windows?: readonly { id: CastId; win: { cx: number } }[]; cameras: { main: { worldView: { x: number; width: number } } } };
      const slot = cinema.windows?.find((s) => CAST_NAMES[s.id] === who);
      const view = cinema.cameras.main.worldView;
      if (slot && view.width > 0) return Math.round(((slot.win.cx - view.x) / view.width) * 100) / 100;
    }
    if (who === NAMES.gorti && scenes.isActive('world')) {
      // Through the paper stage's eye: where he stands (in depth too).
      const world = scenes.getScene('world') as unknown as { player?: { x: number; z: number }; paper?: { lens: { w: number; project(x: number, y: number, z: number): { x: number } } } };
      const lens = world.paper?.lens;
      if (world.player && lens && lens.w > 0) return Math.round((lens.project(world.player.x, 0, world.player.z).x / lens.w) * 100) / 100;
    }
    return null;
  }

  applySettings(s: Settings): void {
    this.touch.setMode(s.touch);
    document.documentElement.classList.toggle('reduced-motion', s.reducedMotion);
  }

  private tick(): void {
    const now = performance.now();
    const dt = Math.min(100, now - this.last);
    this.last = now;
    this.hud.tick(dt);
    this.dialogue.tick(dt);
    this.aimTail();
    const ctx = app.input.context;
    this.touch.setGameplay(ctx === 'gameplay' || ctx === 'cutscene');
  }

  loading(progress: number | null, label = 'Kristaller büyüyor…'): void {
    if (progress === null) {
      this.loadingView?.close();
      this.loadingView = null;
      return;
    }
    this.loadingView ??= new LoadingView(this.stage);
    this.loadingView.set(progress, label);
  }

}
