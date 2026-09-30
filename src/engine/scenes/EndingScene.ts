import * as Phaser from 'phaser';
import { app, persist } from '../App';
import { DEPTH, VIEW_H, VIEW_W } from '../constants';
import { hex, P } from '../../render/2d/palette';
import { CAPTIONS } from '../../content/data/dialogue.tr';
import { chapterStartProgress, Quest } from '../state/GameState';

/** The concluding card and credits after the sale. Not a failure screen. */
export class EndingScene extends Phaser.Scene {
  constructor() {
    super('ending');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0f0d18');
    const g = this.add.graphics().setDepth(DEPTH.sky);
    g.fillStyle(hex(P.paper), 0.08);
    for (let i = 0; i < 9; i++) g.fillRect(120 + i * 120, 120 + (i % 3) * 30, 90, 120);
    this.cameras.main.fadeIn(900, 15, 13, 24);
    app.audio.music('final');
    app.audio.setAmbience('room');
    app.ui.hud.show(false);
    app.input.setContext('menu');
    if (app.quest?.markEnding()) persist();
    const toMenu = (): void => {
      app.ui.ending.hide();
      this.scene.start('menu');
    };
    app.ui.ending.show(CAPTIONS.finalLine, {
      replay: () => {
        app.ui.ending.hide();
        app.quest = new Quest(chapterStartProgress(1), app.profile);
        persist();
        this.scene.start('world', { room: 'r01', checkpoint: 'r01_start' });
      },
      chapters: () => {
        app.ui.ending.hide();
        this.scene.start('menu');
        this.time.delayedCall(50, () => app.ui.menus.showChapters(() => app.ui.menus.showMain()));
      },
      journal: () => app.ui.menus.showJournal(() => app.ui.menus.closeAll()),
      menu: toMenu,
    }, app.settings.reducedMotion);
    void VIEW_W;
    void VIEW_H;
  }
}
