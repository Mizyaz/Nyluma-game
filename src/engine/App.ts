import type * as Phaser from 'phaser';
import type { InputSystem } from './systems/InputSystem';
import type { SaveStatus, SaveSystem } from './systems/SaveSystem';
import type { Profile, Progress, Settings } from './state/types';
import type { Quest } from './state/GameState';
import type { AudioSystem } from './systems/AudioSystem';
import type { UI } from '../ui/UI';

/** Process-wide services shared by scenes and DOM overlays. */
export interface AppServices {
  game: Phaser.Game;
  input: InputSystem;
  save: SaveSystem;
  audio: AudioSystem;
  ui: UI;
  settings: Settings;
  profile: Profile;
  /** Last persisted progress (what Continue resumes). */
  progress: Progress | null;
  saveStatus: SaveStatus;
  /** Active run. */
  quest: Quest | null;
  storageNoticeShown: boolean;
}

export const app = {} as AppServices;

/** Writes the active run + profile. Never throws. */
export function persist(): void {
  const q = app.quest;
  if (q) {
    app.profile = q.profile;
    app.progress = { ...q.progress, flags: [...q.progress.flags], abilities: [...q.progress.abilities] };
  }
  const ok = app.save.save(app.progress, app.profile);
  if (!ok && !app.storageNoticeShown) {
    app.storageNoticeShown = true;
    app.ui?.hud?.toast('Bu oturumda kayıt kullanılamıyor');
  }
}

export function persistSettings(): void {
  const ok = app.save.saveSettings(app.settings);
  if (!ok && !app.storageNoticeShown) {
    app.storageNoticeShown = true;
    app.ui?.hud?.toast('Bu oturumda kayıt kullanılamıyor');
  }
}
