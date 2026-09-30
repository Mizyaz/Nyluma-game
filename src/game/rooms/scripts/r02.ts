import { app } from '../../App';
import { DEPTH } from '../../constants';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import { WhaleActor } from '../../entities/WhaleActor';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';

// Chapter I — fossil-root ascent. Walking under it, Gorti meets the whale
// memory: a blue whale passes through the earth, speaks in three tones, and
// its song wakes the way up: whales swim in where the climb goes.
export function r02(w: WorldScene): RoomScript {
  let whale: WhaleActor | null = null;

  const whalePasses = (): void => {
    if (!w.quest.set('r02.whale')) return;
    // A blue whale (the dialogue speaks of Gorti's bond with blue whales),
    // swimming through the earth behind the roots; its call has three voices.
    whale = whale ?? new WhaleActor(w, { species: 'blue', size: 210, x: -400, y: 1958, scale: 1.3, facing: 1, depth: DEPTH.backProps + 5, seed: 1402 });
    whale.swim(-360, 1960, 1958, 7000);
    app.audio.sfx('whale');
    app.ui.hud.caption(CAPTIONS.whalePass, 3600);
    const lines = DIALOGUE.whale ?? [];
    lines.forEach((l, i) => w.time.delayedCall(3800 + i * 4200, () => app.ui.hud.caption(l.text, 4100)));
    // The song wakes the roots.
    w.time.delayedCall(2600, () => {
      app.audio.sfx('rootGrow');
      w.shake(0.004, 700);
      w.flag('r02.song');
      w.player.emote('surprise', 1200);
    });
    w.time.delayedCall(3800 + lines.length * 4200, () => app.ui.hud.caption(CAPTIONS.songRoot, 4200));
  };

  return {
    setup() {
      if (w.quest.set('r02.enter')) app.ui.hud.caption(CAPTIONS.r02enter, 5200);
      // Saves from before the whale sang: the roots are awake anyway.
      if (w.quest.has('r02.whale')) w.flag('r02.song', false);
      w.onCleanup(() => whale?.destroy());
    },
    onTrigger(id) {
      if (id === 'whale') whalePasses();
    },
    onFixed() {
      // Whoever runs past the whale still finds the roots awake.
      if (w.player.x > 1000 && !w.quest.has('r02.song')) {
        whalePasses();
        w.flag('r02.song');
      }
    },
    onUpdate(dt) {
      whale?.update(dt);
    },
  };
}
