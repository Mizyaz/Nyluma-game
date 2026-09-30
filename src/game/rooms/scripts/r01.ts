import type * as Phaser from 'phaser';
import { app } from '../../App';
import { DEPTH } from '../../constants';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import type { CinemaScene } from '../../scenes/CinemaScene';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';

/** The bed's mattress (see the room data) and where Gorti steps down. */
const BED = { left: 322, right: 538, top: 590 };
const FLOOR_Y = 660;
const STEP_DOWN_X = 580;
/** He wakes by himself after this long if nobody wakes him. */
const WAKE_AFTER_MS = 14000;

// Chapter I — the children's room. The game opens with Gorti asleep in his
// bed; a key (or a little while) wakes him, and the camera comes close to
// his face as he opens his eyes, yawns and hops out of bed. Then nothing
// has to be done: the toys, the marks and the window tell their story to
// whoever stops to look, and the roots at the far end have already parted.
export function r01(w: WorldScene): RoomScript {
  let sleeping = false;
  let waking = false;
  let sleptMs = 0;
  let zzz: Phaser.Time.TimerEvent | null = null;

  const inspect = (id: string): void => {
    w.player.lock(true, 'interact');
    void app.ui.dialogue.open(DIALOGUE[id] ?? []).then(() => {
      w.player.lock(false);
      w.flag(`r01.${id}`, false);
    });
  };

  /** A "z" drifting up from the sleeper's face. */
  const puffZ = (): void => {
    if (!sleeping) return;
    const e = w.player.eyePos();
    const big = Math.random() < 0.4;
    const t = w.add
      .text(e.x - 4, e.y - 16, 'z', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: big ? '26px' : '19px',
        fontStyle: 'italic',
        color: '#dccdf0',
        stroke: '#1d1b1e',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.actors + 5)
      .setAlpha(0);
    w.tweens.add({
      targets: t,
      x: t.x + 26 + Math.random() * 14,
      y: t.y - 60 - Math.random() * 20,
      angle: -18 + Math.random() * 10,
      duration: 2200,
      ease: 'Sine.easeOut',
      onUpdate: (tw) => t.setAlpha(Math.min(1, tw.progress * 4) * (1 - tw.progress)),
      onComplete: () => t.destroy(),
    });
  };

  const goToSleep = (): void => {
    const p = w.player;
    sleeping = true;
    // His body waits on the floor beside the bed; what we see lies on it,
    // head on the pillow at the far end.
    p.teleport(STEP_DOWN_X, FLOOR_Y, 1);
    const tall = Math.max(60, FLOOR_Y - p.eyePos().y + 16);
    p.lieAt = { x: Math.min(BED.right - 6, BED.left + 20 + tall), y: BED.top - 13 };
    p.lie = 1;
    p.eyelids = 1;
    p.lock(true, 'sleep');
    w.camTo(430, 560);
    zzz = w.time.addEvent({ delay: 1350, loop: true, callback: puffZ });
    // Non-blocking opening subtitles while he sleeps.
    app.ui.hud.caption(CAPTIONS.intro1, 5600);
    w.time.delayedCall(5900, () => {
      if (sleeping) app.ui.hud.caption(CAPTIONS.intro2, 5200);
    });
    w.time.delayedCall(1800, () => {
      if (sleeping) app.ui.hud.toast(app.ui.touch.enabled ? 'Uyandırmak için dokun' : 'Uyandırmak için bir tuşa bas', 4200);
    });
  };

  const endSleep = (): void => {
    sleeping = false;
    zzz?.remove();
    zzz = null;
  };

  const wake = (): void => {
    if (waking) return;
    waking = true;
    endSleep();
    const p = w.player;
    const cinema = (): CinemaScene | null => (w.scene.isActive('cinema') ? (w.scene.get('cinema') as CinemaScene) : null);
    void w.narrative.play(
      'r01.wake',
      async (cs) => {
        // Cutscene mode: black bars, the camera comes close to his face.
        w.scene.launch('cinema', { cast: [], dim: false });
        const e = p.eyePos();
        w.camTo(e.x + 6, e.y + 8);
        void w.zoomTo(3.8, 1500);
        await cs.wait(1300);
        // The lids flutter, then open.
        await cs.tween({ targets: p, eyelids: 0.55, duration: 170 });
        await cs.tween({ targets: p, eyelids: 1, duration: 140 });
        await cs.wait(380);
        await cs.tween({ targets: p, eyelids: 0.25, duration: 220 });
        await cs.tween({ targets: p, eyelids: 0.8, duration: 160 });
        await cs.wait(240);
        await cs.tween({ targets: p, eyelids: 0, duration: 260 });
        p.emote('surprise', 900);
        await cs.wait(500);
        // Where am I? A look up, a look around.
        p.lookFor(-0.35, 800);
        await cs.wait(900);
        p.lookFor(0.25, 600);
        await cs.wait(700);
        // A big yawn.
        await cs.tween({ targets: p, yawn: 1, duration: 650, ease: 'Sine.easeOut' });
        await cs.wait(450);
        await cs.tween({ targets: p, yawn: 0, duration: 380, ease: 'Sine.easeIn' });
        p.emote('joy', 900);
        await cs.wait(300);
        // The camera pulls back as he springs out of bed.
        void w.zoomTo(null, 900);
        w.camTo(null);
        p.eyelids = -1;
        // A spring up, arms flung, then the drop to the floor.
        p.lock(true, 'rise');
        const hop = { u: 0 };
        await cs.tween({
          targets: hop,
          u: 1,
          duration: 560,
          ease: 'Sine.easeInOut',
          onUpdate: () => {
            p.lie = 1 - hop.u;
            p.lieLift = 58 * Math.sin(Math.PI * hop.u);
            if (hop.u > 0.55) p.forceAnim = 'fall';
          },
        });
      },
      () => {
        // Also when skipped: he is up, and the room is his.
        endSleep();
        p.lie = 0;
        p.lieAt = null;
        p.lieLift = 0;
        p.eyelids = -1;
        p.yawn = 0;
        p.lock(false);
        w.camTo(null);
        void w.zoomTo(null, 0);
        cinema()?.close();
        p.thump(0.45);
        p.startIdle('stretch');
        w.quest.set('r01.awake');
        w.time.delayedCall(900, () => app.ui.hud.caption(CAPTIONS.intro3, 4200));
        w.time.delayedCall(2600, () => app.ui.hud.toast('A / D ya da ← →: yürü   ·   Boşluk: zıpla   ·   E: incele', 6500));
      },
    );
  };

  return {
    setup() {
      if (w.quest.set('r01.intro')) goToSleep();
    },
    onFixed(dt) {
      if (sleeping && !waking) {
        sleptMs += dt * 1000;
        const i = app.input;
        const woken = i.axisX() !== 0 || i.peek('jump') || i.peek('action') || i.peek('confirm');
        if (woken || sleptMs > WAKE_AFTER_MS) wake();
        return;
      }
      // Near the roots, the room's name.
      if (w.player.x > 1450 && w.quest.set('r01.name')) app.ui.hud.caption(CAPTIONS.room14, 6500);
    },
    onInteract(id) {
      if (id === 'toywhale' || id === 'marks' || id === 'window' || id === 'bed') {
        inspect(id);
        return true;
      }
      return false;
    },
    destroy() {
      endSleep();
    },
  };
}
