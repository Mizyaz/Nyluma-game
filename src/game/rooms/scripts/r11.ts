import * as Phaser from 'phaser';
import { app } from '../../App';
import { DEPTH } from '../../constants';
import { hex, P } from '../../art/palette';
import { CAPTIONS } from '../../data/dialogue.tr';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt, addGlow, RingGauge } from './helpers';

// Chapter IV — key and lock: align the key-eye with a key outline, reveal a
// hidden lock with the keyhole-eye, then anchor into Gorti's legs and wake him.
const KEY_TARGET = 135;
const KEY_STEP = 15;
const WAKE_HOLD = 2;

export function r11(w: WorldScene): RoomScript {
  let aligning = false;
  let angle = 0;
  let keyGhost: Phaser.GameObjects.Image | null = null;
  let keyOutline: Phaser.GameObjects.Image | null = null;
  let lockImg: Phaser.GameObjects.Image | null = null;
  let reveal = 0;
  let beam: Phaser.GameObjects.Graphics | null = null;
  let holding = false;
  let hold = 0;
  const ring = new RingGauge(w, 0xd7b3ff);
  let legs: Phaser.GameObjects.Image | null = null;
  let waking = false;

  const pickObjective = (): void => {
    const q = w.quest;
    if (q.has('r11.m2')) w.setObjective('r11.legs', false);
    else if (q.has('r11.m1')) w.setObjective('r11.lock', false);
    else w.setObjective('r11.key', false);
  };

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

  let offKey: (() => void) | null = null;
  const turn = (dir: number): void => {
    angle = (angle + dir * KEY_STEP + 360) % 360;
    keyGhost?.setAngle(angle);
    app.audio.sfx('click');
  };
  const tryFit = (): void => {
    const diff = Math.abs(((angle - KEY_TARGET + 540) % 360) - 180);
    if (diff <= 12) endAlign(true);
    else {
      app.audio.sfx('songBad');
      app.ui.hud.toast('Anahtar ize oturmadı. Biraz daha çevir.', 2200);
    }
  };

  const endAlign = (ok: boolean): void => {
    aligning = false;
    offKey?.();
    offKey = null;
    keyGhost?.setVisible(false);
    w.player.lock(false);
    if (!ok) return;
    w.flag('r11.m1');
    app.audio.sfx('gear');
    app.audio.sfx('clunk');
    w.shake(0.004, 500);
    keyOutline?.setVisible(false);
    app.ui.hud.caption(CAPTIONS.skeleton, 6400);
    w.setObjective('r11.lock');
  };

  const wake = (): void => {
    if (waking) return;
    waking = true;
    holding = false;
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
      pickObjective();
      keyOutline = addArt(w, 'prop.keyoutline', 1035, 560, DEPTH.props + 4);
      keyOutline?.setAngle(KEY_TARGET).setVisible(!w.quest.has('r11.m1'));
      keyGhost = addArt(w, 'prop.keyoutline', 1035, 560, DEPTH.props + 5);
      keyGhost?.setTint(hex(P.crystalTealLight)).setAlpha(0.8).setVisible(false);
      lockImg = addArt(w, 'prop.lock', 1880, 700, DEPTH.props + 4);
      lockImg?.setAlpha(w.quest.has('r11.m2') ? 1 : 0);
      beam = w.add.graphics().setDepth(DEPTH.fx - 2);
      legs = addArt(w, 'giant.legs', 2640, 562, DEPTH.backProps + 6);
      if (!w.quest.has('r11.intro')) assemble();
      w.onCleanup(() => {
        ring.destroy();
        offKey?.();
      });
    },
    onInteract(id) {
      if (id === 'console1' && !w.quest.has('r11.m1')) {
        aligning = true;
        angle = 0;
        w.player.lock(true, 'interact');
        keyGhost?.setVisible(true).setAngle(angle);
        // Keyboard presses are applied in order as they arrive; touch input
        // (pad + action button) goes through the fixed step below.
        offKey = app.input.onKey((e, a) => {
          if (!aligning || app.input.context !== 'gameplay') return false;
          if (e.repeat) return true;
          if (a.includes('left')) turn(-1);
          else if (a.includes('right')) turn(1);
          else if (a.includes('action') || a.includes('confirm')) tryFit();
          else if (a.includes('pause') || a.includes('jump')) endAlign(false);
          else return false;
          return true;
        });
        app.audio.sfx('click');
        app.ui.hud.toast('← →: anahtar gözünü çevir  ·  E: hizala  ·  Esc / Boşluk: bırak', 5000);
        return true;
      }
      if (id === 'lock' && !w.quest.has('r11.m2')) {
        if (reveal < 0.9) {
          app.ui.hud.toast('Kilit görünmüyor. Nefesini tut (Q): anahtar deliği göz gizli olanı gösterir.', 4200);
          return true;
        }
        w.flag('r11.m2');
        app.audio.sfx('gear');
        app.audio.sfx('clunk');
        lockImg?.setAlpha(1);
        w.setObjective('r11.legs');
        return true;
      }
      if (id === 'legs' && !w.quest.has('r11.wake')) {
        holding = true;
        w.player.lock(true, 'pull');
        return true;
      }
      return false;
    },
    capturesPause() {
      return aligning;
    },
    onFixed(dt) {
      const i = app.input;
      const p = w.player;
      if (aligning) {
        if (i.context !== 'gameplay') return;
        const left = i.consume('left');
        const right = i.consume('right');
        i.consume('note1');
        i.consume('note3');
        if (left) turn(-1);
        if (right) turn(1);
        if (i.consume('action') || i.consume('confirm')) tryFit();
        if (aligning && (i.consume('pause') || i.consume('jump'))) endAlign(false);
        return;
      }
      // Keyhole-eye reveal: breath near the cliff face.
      if (!w.quest.has('r11.m2')) {
        const near = p.x > 1640 && p.x < 1900 && p.feetY > 800;
        if (near && p.focus.active) reveal = Math.min(1, reveal + dt * 1.2);
        else reveal = Math.max(0, reveal - dt * 0.4);
        lockImg?.setAlpha(reveal);
      }
      if (holding) {
        if (i.held('action')) hold = Math.min(WAKE_HOLD, hold + dt);
        else {
          holding = false;
          p.lock(false);
        }
        if (hold >= WAKE_HOLD) wake();
      } else hold = Math.max(0, hold - dt);
    },
    focusRelevant() {
      return !w.quest.has('r11.m2') && w.quest.has('r11.m1') && w.player.x > 1500 && w.player.x < 1950;
    },
    onUpdate(_dt, time) {
      const p = w.player;
      beam?.clear();
      if (!w.quest.has('r11.m2') && p.focus.active && p.x > 1500) {
        const eye = p.rig.attachPoint('eye');
        beam?.fillStyle(hex(P.vein), 0.18 + 0.05 * Math.sin(time / 80));
        beam?.fillTriangle(eye.x, eye.y, 1890, 650, 1890, 760);
      }
      if (holding || hold > 0) ring.draw(2540, 470, 40, hold / WAKE_HOLD, true);
      else ring.draw(0, 0, 0, 0, false);
      if (legs) legs.setY(562 + Math.sin(time / 900) * 2);
      void addGlow;
    },
  };
}
