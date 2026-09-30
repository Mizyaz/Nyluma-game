import './styles.css';
import * as Phaser from 'phaser';
import { app } from './engine/App';
import { gameConfig } from './engine/config';
import { InputSystem } from './engine/systems/InputSystem';
import { detectStorage, SaveSystem } from './engine/systems/SaveSystem';
import { AudioSystem } from './engine/systems/AudioSystem';
import { UI } from './ui/UI';
import { installVoices } from './engine/audio/voices';

/** Does this browser offer WebGL2 (the diorama's three.js needs it)? */
function hasWebGL2(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

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
  // The paper diorama (three.js under Phaser's canvas) unless asked for the
  // flat picture, or the browser has no WebGL2; Phaser then draws with a
  // see-through background. It loads beside the game's own boot.
  const diorama = !params.has('flat') && !params.has('canvas') && hasWebGL2();
  app.game = new Phaser.Game(gameConfig(parent, params.has('canvas'), diorama));
  if (diorama) {
    // Opaque until the diorama takes over a room (a see-through canvas
    // would show the page under the menus).
    app.game.config.backgroundColor.setTo(15, 13, 24, 255);
    app.game.events.once(Phaser.Core.Events.READY, () => {
      void import('./render/2.5d/Stage')
        .then((m) => m.createStage(app.game, params))
        .catch((e: unknown) => {
          console.warn('[stage] could not load the diorama; flat rendering', e);
          app.game.config.backgroundColor.setTo(15, 13, 24, 255);
        });
    });
  }
  app.ui = new UI(app.game);
  app.ui.applySettings(app.settings);
  installVoices(app.ui.dialogue);

  if (__E2E__ || import.meta.env.DEV) {
    void import('./engine/testProbe').then((m) => m.installProbe());
  }
}

boot();
