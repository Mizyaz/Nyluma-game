import { app } from '../../App';
import { DEPTH } from '../../constants';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import { Raccoons } from '../../entities/Creatures';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';

// Chapter II — first wind on the surface; the memory pool; the first human
// transformation and a short grounding moment.
export function r04(w: WorldScene): RoomScript {
  let raccoons: Raccoons | null = null;
  let grounding = false;

  const pickObjective = (): void => {
    const q = w.quest;
    if (q.has('r04.transformed')) w.setObjective('r04.onward', false);
    else if (q.has('r04.human')) w.setObjective('r04.ground', false);
    else if (q.has('r04.up')) w.setObjective('r04.pool', false);
    else if (q.has('r04.focusTut')) w.setObjective('r04.focus', false);
    else w.setObjective('r04.walk', false);
  };

  const emerge = (): void => {
    void w.narrative.play(
      'r04.emerge',
      async (cs) => {
        w.player.lock(true, 'rise');
        w.player.rig.offY = 90;
        w.player.rig.setAlpha(0);
        w.shake(0.003, 600);
        app.audio.sfx('rumble', { vol: 0.6 });
        const prog = { t: 0 };
        await cs.tween({
          targets: prog,
          t: 1,
          duration: 1400,
          ease: 'Cubic.easeOut',
          onUpdate: () => {
            w.player.rig.offY = 90 * (1 - prog.t);
            w.player.rig.setAlpha(Math.min(1, prog.t * 2));
          },
        });
        w.dust(w.player.x, w.player.feetY, 14);
        w.player.lock(true, 'look');
        cs.caption(CAPTIONS.r04enter, 5000);
        await cs.wait(2200);
      },
      () => {
        w.player.rig.offY = 0;
        w.player.rig.setAlpha(1);
        w.player.lock(false);
        w.flag('r04.emerged', false);
      },
    );
  };

  const poolScene = (): void => {
    void w.narrative.play(
      'r04.pool',
      async (cs) => {
        w.player.lock(true, 'look');
        w.camTo(2300, 520);
        await cs.say(DIALOGUE.pool!);
        cs.caption(CAPTIONS.eyes, 4200);
        w.player.lock(true, 'transform');
        await cs.wait(900);
        await new Promise<void>((res) => {
          if (cs.skipped) return res();
          w.transform('human', res);
        });
        cs.caption(CAPTIONS.amca, 5200);
        await cs.wait(1800);
      },
      () => {
        if (w.player.form !== 'human') {
          w.player.setForm('human');
          w.quest.setForm('human');
        }
        w.flag('r04.human', false);
        w.camTo(null);
        w.player.lock(true, 'kneel');
        grounding = true;
        w.setObjective('r04.ground');
        app.ui.hud.caption(CAPTIONS.ground, 6000);
      },
    );
  };

  const finishGrounding = (): void => {
    grounding = false;
    w.quest.grant('form');
    w.flag('r04.transformed');
    w.player.lock(false);
    app.audio.sfx('checkpoint');
    app.ui.hud.caption(CAPTIONS.formUnlock, 7000);
    w.setObjective('r04.onward');
    w.activateCheckpoint('r04_after', true);
  };

  return {
    setup() {
      pickObjective();
      raccoons = new Raccoons(w, [
        { x: 800, y: 868, kind: 'sit', scale: 0.9 },
        { x: 852, y: 868, kind: 'sniff', scale: 0.85 },
        { x: 700, y: 905, kind: 'sit', scale: 0.8, flip: true, depth: DEPTH.props },
        { x: 1600, y: 700, kind: 'shadow', scale: 0.8, depth: DEPTH.backProps },
        { x: 1680, y: 690, kind: 'shadow', scale: 0.7, depth: DEPTH.backProps },
        { x: 2900, y: 760, kind: 'shadow', scale: 0.8, depth: DEPTH.backProps },
        { x: 2980, y: 770, kind: 'shadow', scale: 0.7, depth: DEPTH.backProps, flip: true },
      ]);
      if (!w.quest.has('r04.emerged')) emerge();
      if (w.quest.has('r04.human') && !w.quest.has('r04.transformed')) {
        if (w.player.form !== 'human') {
          w.player.setForm('human');
          w.quest.setForm('human');
        }
        w.player.lock(true, 'kneel');
        grounding = true;
      }
      w.onCleanup(() => raccoons?.destroy());
    },
    onTrigger(id) {
      if (id === 'wind' && w.quest.set('r04.wind')) {
        app.ui.hud.caption(CAPTIONS.wind1, 5200);
        w.time.delayedCall(5600, () => app.ui.hud.caption(CAPTIONS.wind2, 3800));
        w.player.rig.jointImage('eyeGlow')?.setScale(1.6);
      }
      if (id === 'raccoons' && w.quest.set('r04.raccoons')) {
        app.ui.hud.caption(CAPTIONS.raccoons, 4600);
        app.audio.sfx('chirp', { pitch: 0.6 });
      }
      if (id === 'focusTut' && w.flag('r04.focusTut', false)) {
        app.ui.hud.caption(CAPTIONS.r04focus, 5200);
        w.setObjective('r04.focus');
      }
    },
    onInteract(id) {
      if (id === 'pool' && !w.quest.has('r04.human')) {
        poolScene();
        return true;
      }
      return false;
    },
    onFixed() {
      const p = w.player;
      if (!w.quest.has('r04.up') && p.x > 1660 && p.feetY <= 642 && p.onGround) {
        w.flag('r04.up', false);
        if (!w.quest.has('r04.human')) w.setObjective('r04.pool');
      }
      if (grounding && p.focus.heldFor >= 1.3) finishGrounding();
    },
    focusRelevant() {
      return grounding || w.room.solids.some((s) => s.def.latent && Math.abs(s.def.x - w.player.x) < 420);
    },
    onUpdate(dt) {
      raccoons?.update(dt);
    },
  };
}
