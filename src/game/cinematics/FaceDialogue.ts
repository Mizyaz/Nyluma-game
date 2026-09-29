import type * as Phaser from 'phaser';
import { app } from '../App';
import type { Line } from '../../ui/Dialogue';
import type { CinemaScene } from '../scenes/CinemaScene';
import type { CastId } from './castNames';

/** How long the scene stays up after a line set, waiting for the next one. */
const LINGER_MS = 450;

/**
 * Plays dialogue lines as a face-animated scene. Consecutive calls with the
 * same cast share one scene (a cutscene often says a line, does something,
 * then says the next), so the portraits do not flicker between lines; a new
 * cast restarts the scene with its faces. While a scene is up the music
 * turns to the intense strings ('tension'), and it turns back when the
 * scene ends by any way: the last line, a skipped cutscene, a room change.
 */
export class FaceDialogue {
  /** Cast of the scene on screen ('' when none). */
  private static cast = '';
  private static closeTimer: number | null = null;
  /** Counts `play` calls: only the latest one may close the scene. */
  private static calls = 0;

  static async play(scene: Phaser.Scene, lines: Line[], cast: readonly CastId[]): Promise<void> {
    const call = ++this.calls;
    this.cancelClose();
    const key = cast.join(',');
    const plugin = scene.scene;
    if (this.cast !== key || !plugin.isActive('cinema')) {
      plugin.launch('cinema', { cast });
      this.cast = key;
    }
    app.audio.setMusicOverride('tension');
    try {
      await app.ui.dialogue.open(lines);
    } finally {
      // A later call (the next line set, a new scene) owns the closing.
      if (call === this.calls) {
        this.closeTimer = window.setTimeout(() => {
          this.closeTimer = null;
          this.end(scene);
        }, LINGER_MS);
      }
    }
  }

  /** Closes the scene now and gives the room its music back. */
  static end(scene: Phaser.Scene): void {
    this.cancelClose();
    if (!this.cast) return;
    this.cast = '';
    app.audio.setMusicOverride(null);
    const cinema = scene.scene.get('cinema') as CinemaScene | null;
    if (cinema && scene.scene.isActive('cinema')) cinema.close();
  }

  private static cancelClose(): void {
    if (this.closeTimer === null) return;
    window.clearTimeout(this.closeTimer);
    this.closeTimer = null;
  }
}
