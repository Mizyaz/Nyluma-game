import * as Phaser from 'phaser';
import { app } from '../App';
import { VIEW_H, VIEW_W } from '../constants';
import { CAST } from '../cinematics/cast';
import { CAST_NAMES, type CastId } from '../cinematics/castNames';
import type { Portrait, PortraitWindow } from '../cinematics/portraits';
import { voiceOf } from '../cinematics/voice';
import { fitScene } from '../../paper/screen';
import { ClipView } from '../../paper/clip';

export interface CinemaData {
  cast: readonly CastId[];
  /** Darken the room behind (default); off for the bars alone (a close-up). */
  dim?: boolean;
}

interface Slot {
  id: CastId;
  win: PortraitWindow;
  portrait: Portrait;
  /** Dark veil over a listener's window. */
  veil: Phaser.GameObjects.Rectangle;
  /** 0 listening … 1 speaking (eased). */
  lit: number;
}

const INK = 0x4f4557;

/**
 * Face-animated dialogue: black bars close in, the room dims, and the
 * speakers appear up close in framed windows above the dialogue box. The
 * one speaking is lit and animates with the words; the others listen.
 * Drawn above the world with its own unzoomed camera.
 */
export class CinemaScene extends Phaser.Scene {
  private slots: Slot[] = [];
  /** The portraits' windows (each portrait is seen only inside its own). */
  private clip!: ClipView;
  private bars: Phaser.GameObjects.Rectangle[] = [];
  private dim!: Phaser.GameObjects.Rectangle;
  private closing = false;
  private fade = 0;
  private dimLevel = 0.3;

  constructor() {
    super('cinema');
  }

  create(data: CinemaData): void {
    this.scene.bringToTop();
    // The full height of the screen; wide screens show more at the sides.
    fitScene(this, 'height');
    this.slots = [];
    this.clip = new ClipView(this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.shutdownSlots());
    this.closing = false;
    this.fade = 0;
    this.dimLevel = data.dim === false ? 0 : 0.3;
    const reduced = app.settings.reducedMotion;
    this.dim = this.add.rectangle(VIEW_W / 2, VIEW_H / 2, VIEW_W * 4, VIEW_H, 0x1d1b1e, 1).setAlpha(0);
    const barH = 62;
    this.bars = [
      this.add.rectangle(VIEW_W / 2, -barH / 2, VIEW_W * 4, barH, 0x000000, 1),
      this.add.rectangle(VIEW_W / 2, VIEW_H + barH / 2, VIEW_W * 4, barH, 0x000000, 1),
    ];
    this.tweens.add({ targets: this.bars[0], y: barH / 2, duration: reduced ? 1 : 420, ease: 'Cubic.easeOut' });
    this.tweens.add({ targets: this.bars[1], y: VIEW_H - barH / 2, duration: reduced ? 1 : 420, ease: 'Cubic.easeOut' });
    const n = Math.min(3, data.cast.length);
    const size = n >= 3 ? 250 : 290;
    const xs = n === 1 ? [VIEW_W / 2] : n === 2 ? [290, VIEW_W - 290] : [250, VIEW_W / 2, VIEW_W - 250];
    data.cast.slice(0, 3).forEach((id, i) => {
      const cx = xs[i]!;
      const win: PortraitWindow = { cx, cy: 300, size, facing: cx <= VIEW_W / 2 + 1 ? 1 : -1 };
      this.slots.push(this.makeSlot(id, win));
    });
  }

  private makeSlot(id: CastId, win: PortraitWindow): Slot {
    const half = win.size / 2;
    // Frame: a paper mat (no heavy black border) on plain paper ground; a
    // soft plum rim is drawn over it below.
    const frame = this.add.graphics();
    frame.fillStyle(0xfbf6ea, 1).fillRoundedRect(win.cx - half - 7, win.cy - half - 7, win.size + 14, win.size + 14, 18);
    frame.fillStyle(0xf3ead8, 1).fillRoundedRect(win.cx - half, win.cy - half, win.size, win.size, 14);
    const portrait = CAST[id](this, win);
    this.clip.shape.fillStyle(0xffffff, 1).fillRoundedRect(win.cx - half, win.cy - half, win.size, win.size, 14);
    this.clip.add(portrait.root);
    const veil = this.add.rectangle(win.cx, win.cy, win.size, win.size, 0xf3ead8, 1).setAlpha(0.45);
    this.clip.add(veil);
    // A thin soft rim on top of everything.
    const rim = this.add.graphics();
    rim.lineStyle(1.5, INK, 0.75).strokeRoundedRect(win.cx - half - 2, win.cy - half - 2, win.size + 4, win.size + 4, 16);
    rim.lineStyle(1, INK, 0.35).strokeRoundedRect(win.cx - half - 7, win.cy - half - 7, win.size + 14, win.size + 14, 18);
    for (const o of [frame, portrait.root, rim]) o.setData('fadeable', true);
    return { id, win, portrait, veil, lit: 0 };
  }

  /** Who is framed where (the dialogue balloon points its tail at the speaker). */
  get windows(): readonly { id: CastId; win: PortraitWindow }[] {
    return this.slots;
  }

  /** Slides everything away and stops the scene. */
  close(): void {
    if (this.closing) return;
    this.closing = true;
    const reduced = app.settings.reducedMotion;
    this.tweens.add({ targets: this.bars[0], y: -40, duration: reduced ? 1 : 320, ease: 'Cubic.easeIn' });
    this.tweens.add({ targets: this.bars[1], y: VIEW_H + 40, duration: reduced ? 1 : 320, ease: 'Cubic.easeIn' });
  }

  override update(_time: number, delta: number): void {
    const dlg = app.ui.dialogue;
    const who = dlg.speaker;
    const typing = dlg.typing;
    const voice = voiceOf(dlg.current);
    const k = 1 - Math.exp(-(delta / 1000) * 8);
    this.fade = Math.max(0, Math.min(1, this.fade + (this.closing ? -1 : 1) * (delta / 1000) * 3.5));
    this.dim.setAlpha(this.dimLevel * this.fade);
    for (const s of this.slots) {
      const speaking = who !== '' && who === CAST_NAMES[s.id];
      s.lit += ((speaking ? 1 : 0) - s.lit) * k;
      s.veil.setAlpha(0.5 * (1 - s.lit) * this.fade);
      s.portrait.update(delta, speaking, typing, voice);
    }
    for (const o of this.children.list) {
      if (o.getData('fadeable')) (o as unknown as Phaser.GameObjects.Components.Alpha).setAlpha(this.fade);
    }
    if (this.closing && this.fade <= 0) this.scene.stop();
  }

  private shutdownSlots(): void {
    for (const s of this.slots) {
      s.portrait.destroy();
    }
    this.slots = [];
  }
}
