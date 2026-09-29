import type * as Phaser from 'phaser';
import { app } from '../game/App';
import type { Settings } from '../game/state/types';
import { ColorStorm } from './ColorStorm';
import { Dialogue } from './Dialogue';
import { DocView } from './DocView';
import { EndingView } from './EndingView';
import { Hud } from './Hud';
import { Menus } from './Menus';
import { TouchControls } from './TouchControls';
import { h } from './dom';

/** Root of all DOM overlays; keeps #stage aligned with the letterboxed canvas. */
export class UI {
  readonly stage: HTMLElement;
  readonly hud: Hud;
  readonly dialogue: Dialogue;
  readonly menus: Menus;
  readonly doc: DocView;
  readonly ending: EndingView;
  readonly touch: TouchControls;
  readonly colorStorm: ColorStorm;
  private loadingEl: HTMLElement | null = null;
  private game: Phaser.Game;
  private last = performance.now();

  constructor(game: Phaser.Game) {
    this.game = game;
    this.stage = document.getElementById('stage')!;
    this.hud = new Hud(this.stage);
    this.dialogue = new Dialogue(this.stage);
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
      sync();
    });
    game.events.on('prestep', () => app.input.beginFrame());
    game.events.on('poststep', () => this.tick());
    sync();
  }

  /**
   * Lays the overlay out around the canvas. Landscape (computers, phones held
   * sideways): the stage is the letterboxed canvas rectangle. Portrait: the
   * canvas spans the width under a band for the HUD, and the stage is the
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
    // One UI scale from the viewport (1 at 1280×720), whatever the orientation.
    const scale = Math.min(1.4, Math.max(0.5, Math.min(W / 1280, H / 720)));
    document.documentElement.style.setProperty('--s', scale.toFixed(3));
    this.touch.layout();
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
    const ctx = app.input.context;
    this.touch.setGameplay(ctx === 'gameplay' || ctx === 'cutscene');
  }

  loading(progress: number | null, label = 'Kristaller büyüyor…'): void {
    if (progress === null) {
      this.loadingEl?.remove();
      this.loadingEl = null;
      return;
    }
    if (!this.loadingEl) {
      this.loadingEl = h('div', { class: 'loading', role: 'status' }, h('div', { class: 'lbl', text: label }), h('div', { class: 'bar' }, h('i')));
      this.stage.append(this.loadingEl);
    }
    (this.loadingEl.querySelector('.bar i') as HTMLElement).style.width = `${Math.round(progress * 100)}%`;
    (this.loadingEl.querySelector('.lbl') as HTMLElement).textContent = label;
  }
}
