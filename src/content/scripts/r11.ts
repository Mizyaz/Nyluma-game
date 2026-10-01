import * as Phaser from 'phaser';
import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { hex, P } from '../../render/2d/palette';
import { CAPTIONS } from '../data/dialogue.tr';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt } from './helpers';

// Chapter IV — key and lock. The mechanical form walks through by itself: at
// the first wall its key-eye turns into the key outline and the wall gives
// way; at the second its keyhole-eye shows the hidden lock and that wall
// opens too; beyond it the form anchors into Gorti's legs and wakes him.
const KEY_TARGET = 135;
const KEY_STEP = 15;

export function r11(w: WorldScene): RoomScript {
  let keyGhost: Phaser.GameObjects.Image | null = null;
  let keyOutline: Phaser.GameObjects.Image | null = null;
  let lockImg: Phaser.GameObjects.Image | null = null;
  let beam: Phaser.GameObjects.Graphics | null = null;
  let legs: Phaser.GameObjects.Image | null = null;
  let looking = false;

  const assemble = (): void => {
    void w.narrative.play(
      'r11.assemble',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'idle');
        p.rig.setAlpha(0);
        p.rig.scale = 0.2;
        cs.caption(CAPTIONS.mechBorn, 5600);
        app.audio.sfx('gear');
        const o = { t: 0 };
        await cs.tween({
          targets: o,
          t: 1,
          duration: 1600,
          ease: 'Back.easeOut',
          onUpdate: () => {
            p.rig.scale = 0.2 + 0.8 * o.t;
            p.rig.setAlpha(Math.min(1, o.t * 1.5));
          },
        });
        app.audio.sfx('clunk');
        await cs.wait(1800);
      },
      () => {
        const p = w.player;
        p.rig.scale = 1;
        p.rig.setAlpha(1);
        w.flag('r11.intro', false);
        p.lock(false);
      },
    );
  };

  /** The key-eye turns until it fits the outline on the wall. */
  const keyScene = (): void => {
    void w.narrative.play(
      'r11.key',
      async (cs) => {
        w.player.lock(true, 'interact');
        keyGhost?.setVisible(true).setAngle(0);
        app.audio.sfx('click');
        for (let a = KEY_STEP; a <= KEY_TARGET; a += KEY_STEP) {
          await cs.wait(150);
          keyGhost?.setAngle(a);
          app.audio.sfx('click', { pitch: 0.9 + a / 700 });
        }
        await cs.wait(450);
      },
      () => {
        keyGhost?.setVisible(false);
        keyOutline?.setVisible(false);
        w.flag('r11.m1');
        app.audio.sfx('gear');
        app.audio.sfx('clunk');
        w.shake(0.004, 500);
        app.ui.hud.caption(CAPTIONS.skeleton, 6400);
        w.player.lock(false);
        w.player.emote('joy', 1400);
      },
    );
  };

  /** The keyhole-eye looks at the second wall and the hidden lock shows. */
  const lockScene = (): void => {
    void w.narrative.play(
      'r11.lock',
      async (cs) => {
        w.player.lock(true, 'breath');
        looking = true;
        app.audio.sfx('clock', { pitch: 0.7 });
        if (lockImg) await cs.tween({ targets: lockImg, alpha: 1, duration: 1800 });
        app.audio.sfx('gear');
        app.audio.sfx('clunk');
        await cs.wait(600);
      },
      () => {
        looking = false;
        // The lock turns and its wall gives way.
        lockImg?.setVisible(false);
        w.flag('r11.m2');
        w.shake(0.004, 500);
        w.player.lock(false);
        w.player.emote('surprise', 900);
      },
    );
  };

  const wake = (): void => {
    void w.narrative.play(
      'r11.wake',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'pull');
        cs.caption(CAPTIONS.transfer, 5200);
        await cs.wait(2400);
        cs.caption(CAPTIONS.wake, 5200);
        app.audio.sfx('rootGrow');
        w.shake(0.006, 800);
        w.flash(0xd7b3ff, 0.4);
        await cs.wait(2400);
        app.audio.sfx('stamp');
        w.shake(0.01, 250);
        w.flash(0x944958, 0.25);
        await cs.wait(1200);
      },
      () => {
        w.flag('r11.wake', false);
        w.goToRoom('r12');
      },
    );
  };

  return {
    setup() {
      keyOutline = addArt(w, 'prop.keyoutline', 1035, 560, DEPTH.props + 4);
      keyOutline?.setAngle(KEY_TARGET).setVisible(!w.quest.has('r11.m1'));
      keyGhost = addArt(w, 'prop.keyoutline', 1035, 560, DEPTH.props + 5);
      keyGhost?.setTint(hex(P.crystalTealLight)).setAlpha(0.8).setVisible(false);
      lockImg = addArt(w, 'prop.lock', 1880, 700, DEPTH.props + 4);
      lockImg?.setAlpha(0).setVisible(!w.quest.has('r11.m2'));
      beam = w.add.graphics().setDepth(DEPTH.fx - 2);
      legs = addArt(w, 'giant.legs', 2640, 822, DEPTH.backProps + 6);
      if (!w.quest.has('r11.intro')) assemble();
    },
    onFixed() {
      const q = w.quest;
      const p = w.player;
      if (w.narrative.busy || !q.has('r11.intro') || !p.onGround) return;
      if (!q.has('r11.m1')) {
        if (p.x > 830) keyScene();
      } else if (!q.has('r11.m2')) {
        if (p.x > 1640) lockScene();
      } else if (!q.has('r11.wake') && p.x > 2440) wake();
    },
    onUpdate(_dt, time) {
      beam?.clear();
      if (looking) {
        const eye = w.player.rig.attachPoint('eye');
        beam?.fillStyle(hex(P.vein), 0.18 + 0.05 * Math.sin(time / 80));
        beam?.fillTriangle(eye.x, eye.y, 1890, 650, 1890, 760);
      }
      if (legs) legs.setY(822 + Math.sin(time / 900) * 2);
    },
  };
}
