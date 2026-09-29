import { app } from '../../App';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';

// Chapter I — the children's room. Nothing has to be done here: the toys,
// the marks and the window tell their story to whoever stops to look, and
// the roots at the far end have already parted.
export function r01(w: WorldScene): RoomScript {
  const inspect = (id: string): void => {
    w.player.lock(true, 'interact');
    void app.ui.dialogue.open(DIALOGUE[id] ?? []).then(() => {
      w.player.lock(false);
      w.flag(`r01.${id}`, false);
    });
  };

  return {
    setup() {
      if (w.quest.set('r01.intro')) {
        // Non-blocking opening subtitles: the player already has control.
        app.ui.hud.caption(CAPTIONS.intro1, 5600);
        w.time.delayedCall(5900, () => app.ui.hud.caption(CAPTIONS.intro2, 5200));
        w.time.delayedCall(11400, () => app.ui.hud.caption(CAPTIONS.intro3, 4200));
        w.time.delayedCall(3000, () => app.ui.hud.toast('A / D ya da ← →: yürü   ·   Boşluk: zıpla   ·   E: incele', 6500));
      }
    },
    onFixed() {
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
  };
}
