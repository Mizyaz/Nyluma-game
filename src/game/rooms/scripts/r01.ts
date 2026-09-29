import { app } from '../../App';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';

const SEEN = ['r01.toywhale', 'r01.marks', 'r01.window'];

export function r01(w: WorldScene): RoomScript {
  const count = (): number => SEEN.filter((f) => w.quest.has(f)).length;

  const openDoor = (): void => {
    void w.narrative.play(
      'r01.door',
      async (cs) => {
        w.player.lock(true);
        w.camTo(1735, 520);
        await cs.wait(650);
        app.audio.sfx('rootGrow');
        w.shake(0.003, 400);
        w.flag('r01.door');
        cs.caption(CAPTIONS.doorOpen, 3600);
        await cs.wait(1500);
        cs.caption(CAPTIONS.room14, 6500);
        await cs.wait(900);
        w.camTo(null);
        await cs.wait(400);
      },
      () => {
        w.flag('r01.door', false);
        w.camTo(null);
        w.player.lock(false);
        w.setObjective('r01.door');
      },
    );
  };

  const inspect = (id: string): void => {
    const flag = `r01.${id}`;
    w.player.lock(true, 'interact');
    void app.ui.dialogue.open(DIALOGUE[id] ?? []).then(() => {
      w.player.lock(false);
      if (id === 'bed') return;
      if (w.flag(flag, false) && count() >= SEEN.length && !w.quest.has('r01.door')) openDoor();
      else if (count() < SEEN.length) app.ui.hud.toast(`İncelendi: ${count()} / ${SEEN.length}`, 2200);
    });
  };

  return {
    setup() {
      w.setObjective(w.quest.has('r01.door') ? 'r01.door' : 'r01.explore', false);
      if (w.quest.set('r01.intro')) {
        // Non-blocking opening subtitles: the player already has control.
        app.ui.hud.caption(CAPTIONS.intro1, 5600);
        w.time.delayedCall(5900, () => app.ui.hud.caption(CAPTIONS.intro2, 5200));
        w.time.delayedCall(11400, () => app.ui.hud.caption(CAPTIONS.intro3, 4200));
        w.time.delayedCall(3000, () => app.ui.hud.toast('A / D ya da ← →: yürü   ·   Boşluk: zıpla   ·   E: incele', 6500));
      } else if (count() >= SEEN.length && !w.quest.has('r01.door')) {
        openDoor();
      }
    },
    onInteract(id) {
      if (id === 'toywhale' || id === 'marks' || id === 'window' || id === 'bed') {
        inspect(id);
        return true;
      }
      return false;
    },
  };
}
