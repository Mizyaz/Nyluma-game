import type * as Phaser from 'phaser';
import { app } from '../game/App';
import type { Settings } from '../game/state/types';
import { Dialogue } from './Dialogue';
import { DocView } from './DocView';
import { EndingView } from './EndingView';
import { Hud } from './Hud';
import { Menus } from './Menus';
import { PuzzlePanel } from './PuzzlePanel';
import { SongPanel } from './SongPanel';
import { TouchControls } from './TouchControls';
import { h } from './dom';

/** Root of all DOM overlays; keeps #stage aligned with the letterboxed canvas. */
export class UI {
  readonly stage: HTMLElement;
  readonly hud: Hud;
  readonly dialogue: Dialogue;
  readonly menus: Menus;
  readonly song: SongPanel;
  readonly puzzle: PuzzlePanel;
  readonly doc: DocView;
  readonly ending: EndingView;
  readonly touch: TouchControls;
  private loadingEl: HTMLElement | null = null;
  private game: Phaser.Game;
  private last = performance.now();

  constructor(game: Phaser.Game) {
    this.game = game;
    this.stage = document.getElementById('stage')!;
    this.hud = new Hud(this.stage);
    this.dialogue = new Dialogue(this.stage);
    this.song = new SongPanel(this.stage);
    this.puzzle = new PuzzlePanel(this.stage);
    this.doc = new DocView(this.stage);
    this.ending = new EndingView(this.stage);
    this.menus = new Menus(this.stage);
    this.touch = new TouchControls(document.getElementById('touch')!);
    const sync = (): void => this.sync();
    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);
    game.events.once('ready', () => {
      game.scale.on('resize', sync);
      sync();
    });
    game.events.on('poststep', () => this.tick());
    sync();
  }

  /** Aligns the overlay with the canvas rectangle. */
  sync(): void {
    const canvas = this.game.canvas;
    const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const s = this.stage.style;
    s.left = `${rect.left}px`;
    s.top = `${rect.top}px`;
    s.width = `${rect.width}px`;
    s.height = `${rect.height}px`;
    this.stage.style.setProperty('--s', String(rect.width / 1280));
    const portrait = window.innerHeight > window.innerWidth * 1.05;
    const hint = document.getElementById('rotate-hint');
    if (hint) hint.hidden = !(portrait && this.touch.enabled);
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
    this.song.tick();
    this.puzzle.tick();
    this.doc.tick();
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
