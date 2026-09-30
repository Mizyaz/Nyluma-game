import type * as Phaser from 'phaser';
import { app } from '../../App';
import { DEPTH } from '../../constants';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import type { CinemaScene } from '../../scenes/CinemaScene';
import type { WorldScene } from '../../scenes/WorldScene';
import { GemPortal } from '../../fx/gemPortal';
import type { RoomScript } from './types';

/** The bed's mattress (see the room data) and where Gorti steps down. */
const BED = { left: 322, right: 538, top: 590 };
const FLOOR_Y = 660;
const STEP_DOWN_X = 564;
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
  let portal: GemPortal | null = null;

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
        stroke: '#4f4557',
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
    // head on the pillow at the far end, turned about the hips.
    p.teleport(STEP_DOWN_X, FLOOR_Y, 1);
    const headToHip = Math.max(40, FLOOR_Y - p.eyePos().y - p.hipHeight + 16);
    p.lieHip = { x: Math.min(BED.right - p.hipHeight - 6, BED.left + 16 + headToHip), y: BED.top - 12 };
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
        // A long breath out (the head sinks back into the pillow).
        await cs.tween({ targets: p, yawn: 1, duration: 650, ease: 'Sine.easeOut' });
        await cs.wait(350);
        await cs.tween({ targets: p, yawn: 0, duration: 380, ease: 'Sine.easeIn' });
        await cs.wait(200);
        // The camera pulls back; he gets up the way anyone does.
        void w.zoomTo(null, 900);
        w.camTo(430, 560);
        p.eyelids = -1;
        p.getupK = 0;
        p.lock(true, 'getup');
        const hip = p.lieHip!;
        // Sits up: the body turns about the hips, the legs stay on the bed.
        const k = { lie: 1, g: 0 };
        await cs.tween({
          targets: k,
          lie: 0,
          g: 0.45,
          duration: 900,
          ease: 'Sine.easeInOut',
          onUpdate: () => {
            p.lie = k.lie;
            p.getupK = k.g;
          },
        });
        p.lookFor(0.2, 500);
        await cs.wait(350);
        // Shuffles to the edge and lets the legs down.
        await cs.tween({
          targets: [hip, k],
          x: BED.right - 8,
          g: 0.7,
          duration: 620,
          ease: 'Sine.easeInOut',
          onUpdate: () => (p.getupK = k.g),
        });
        await cs.wait(200);
        // Stands up: the hips come off the bed and down to standing height.
        await cs.tween({
          targets: [hip, k],
          x: BED.right + 26,
          y: FLOOR_Y - p.hipHeight,
          g: 1,
          duration: 560,
          ease: 'Sine.easeInOut',
          onUpdate: () => (p.getupK = k.g),
        });
      },
      () => {
        // Also when skipped: he is up, and the room is his.
        endSleep();
        p.teleport(BED.right + 26, FLOOR_Y, 1);
        p.lie = 0;
        p.lieHip = null;
        p.getupK = 0;
        p.eyelids = -1;
        p.yawn = 0;
        p.lock(false);
        w.camTo(null);
        void w.zoomTo(null, 0);
        cinema()?.close();
        p.thump(0.2);
        p.startIdle('stretch');
        w.quest.set('r01.awake');
        w.time.delayedCall(900, () => app.ui.hud.caption(CAPTIONS.intro3, 4200));
        w.time.delayedCall(2600, () => app.ui.hud.toast('A / D ya da ← →: yürü   ·   Boşluk: zıpla   ·   E: incele', 6500));
      },
    );
  };

  return {
    setup() {
      // At the end of the root tunnel, the way on: a living mouth of the gem tunnel.
      portal = new GemPortal(w, 2162, 660, 104, 214, -35);
      if (w.quest.set('r01.intro')) goToSleep();
    },
    onUpdate(dtMs) {
      portal?.update(dtMs);
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
      portal?.destroy();
      portal = null;
    },
  };
}
