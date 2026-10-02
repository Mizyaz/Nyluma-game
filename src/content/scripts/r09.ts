import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { CAPTIONS, DIALOGUE } from '../data/dialogue.tr';
import { Sparrow } from '../../gameplay/actors/Creatures';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import type { RoomScript } from './types';

// Chapter IV — the sparrow clearing by the river, Gorti's line, and the
// reflective pool: reaching it, Gorti closes their eyes and the forest closes
// on him as the stage changes into the mind.
const PERCHES: [number, number][] = [
  [520, 690],
  [1180, 640],
  [1860, 620],
  [2420, 600],
  [2960, 700],
];

export function r09(w: WorldScene): RoomScript {
  let sparrow: Sparrow | null = null;
  let perch = 0;

  const fold = (): void => {
    void w.narrative.play(
      'r09.fold',
      async (cs) => {
        w.player.lock(true, 'breath');
        await cs.say(DIALOGUE.closeEyes!);
        // The forest closes on him: the eye leans in, and the theatre's flats
        // roll in over the stage as the room changes (WarpScene); nothing is
        // laid over the picture here.
        if (!app.settings.reducedMotion) void w.zoomTo(w.baseZoom * 1.25, 1600);
        await cs.wait(1600);
      },
      () => {
        w.flag('r09.pool', false);
        w.goToRoom('r10');
      },
    );
  };

  return {
    setup() {
      const startIdx = w.player.x > 1700 ? 3 : 0;
      perch = startIdx;
      const [px, py] = PERCHES[perch]!;
      sparrow = new Sparrow(w, px, py, DEPTH.actors);
      if (w.quest.set('r09.enter')) app.ui.hud.caption(CAPTIONS.sparrowFar, 4200);
      w.onCleanup(() => sparrow?.destroy());
    },
    onTrigger(id) {
      if (id === 'sparrow' && w.quest.set('r09.glint')) {
        app.ui.hud.caption(CAPTIONS.sparrowGlint, 6400);
        w.time.delayedCall(6800, () => app.ui.hud.caption(CAPTIONS.treesFeel, 4600));
      }
      if (id === 'line' && !w.quest.has('r09.line')) {
        void w.narrative.play(
          'r09.line',
          async (cs) => {
            w.player.lock(true, 'idle');
            await cs.talk(DIALOGUE.selfLine!, ['gorti']);
          },
          () => {
            w.flag('r09.line', false);
            w.player.lock(false);
          },
        );
      }
    },
    onFixed() {
      // At the pool Gorti closes their eyes.
      const p = w.player;
      if (p.x > 2790 && p.onGround && !w.narrative.busy && !w.quest.has('r09.pool')) {
        w.flag('r09.line', false);
        fold();
      }
    },
    onUpdate(dt) {
      if (!sparrow) return;
      sparrow.update(dt);
      const next = PERCHES[perch + 1];
      const cur = PERCHES[perch]!;
      if (next && !sparrow.flying && Math.abs(w.player.x - cur[0]) < 240) {
        perch++;
        sparrow.flyTo(next[0], next[1], 1800);
      }
    },
  };
}
