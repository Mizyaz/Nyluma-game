import './styles.css';
import * as Phaser from 'phaser';
import { app } from './game/App';
import { gameConfig } from './game/config';
import { InputSystem } from './game/systems/InputSystem';
import { detectStorage, SaveSystem } from './game/systems/SaveSystem';
import { AudioSystem } from './game/systems/AudioSystem';
import { UI } from './ui/UI';

function boot(): void {
  const params = new URLSearchParams(location.search);
  app.input = new InputSystem();
  app.input.attach(window);
  app.save = new SaveSystem(detectStorage());
  app.settings = app.save.loadSettings();
  const loaded = app.save.load();
  app.profile = loaded.profile;
  app.progress = loaded.progress;
  app.saveStatus = loaded.status;
  app.quest = null;
  app.storageNoticeShown = false;
  app.audio = new AudioSystem();
  app.audio.applySettings(app.settings);

  const parent = document.getElementById('game')!;
  app.game = new Phaser.Game(gameConfig(parent, params.has('canvas')));
  app.ui = new UI(app.game);
  app.ui.applySettings(app.settings);

  if (__E2E__ || import.meta.env.DEV) {
    void import('./game/testProbe').then((m) => m.installProbe());
  }
}

boot();
