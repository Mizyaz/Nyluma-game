import { app } from '../../App';
import { DEPTH } from '../../constants';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import { Raccoons } from '../../entities/Creatures';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';

// Chapter II — first wind on the surface. At the memory pool Gorti sees the
// faces of the memories and becomes human for the first time.
export function r04(w: WorldScene): RoomScript {
  let raccoons: Raccoons | null = null;

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
        w.flag('r04.transformed', false);
        w.camTo(null);
        w.player.lock(false);
        w.activateCheckpoint('r04_after', true);
      },
    );
  };

  return {
    setup() {
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
      // Saves from the old kneeling moment: it is over.
      if (w.quest.has('r04.human')) w.flag('r04.transformed', false);
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
    },
    onFixed() {
      const p = w.player;
      // At the memory pool, the faces look back.
      if (!w.quest.has('r04.human') && p.x > 2230 && p.feetY <= 642 && p.onGround) poolScene();
    },
    onUpdate(dt) {
      raccoons?.update(dt);
    },
  };
}
