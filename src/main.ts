import './styles.css';
import * as Phaser from 'phaser';
import { Screen } from './paper/screen';
import { patchPhaser } from './paper/fixes';
import { app } from './engine/App';
import { gameConfig } from './engine/config';
import { InputSystem } from './engine/systems/InputSystem';
import { detectStorage, SaveSystem } from './engine/systems/SaveSystem';
import { AudioSystem } from './engine/systems/AudioSystem';
import { UI } from './ui/UI';
import { installVoices } from './engine/audio/voices';

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

  // Long-presses on the controls must not open the browser's context menu.
  document.getElementById('app')?.addEventListener('contextmenu', (e) => e.preventDefault());

  const parent = document.getElementById('game')!;
  patchPhaser();
  app.game = new Phaser.Game(gameConfig(parent, params.has('canvas')));
  // The canvas follows its box at device resolution.
  new Screen(app.game, parent);
  app.ui = new UI(app.game);
  app.ui.applySettings(app.settings);
  installVoices(app.ui.dialogue);

  if (__E2E__ || import.meta.env.DEV) {
    void import('./engine/testProbe').then((m) => m.installProbe());
  }
}

boot();
