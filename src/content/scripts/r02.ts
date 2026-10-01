import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { CAPTIONS, DIALOGUE } from '../data/dialogue.tr';
import { WhaleActor } from '../../gameplay/actors/WhaleActor';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import type { RoomScript } from './types';

/** The passing whale's back line: in view from the floor, behind the rising whales. */
const SWIM_Y = 850;
/** When it sings: as it swims past the sleeping root (the whales rise in its wake). */
const SONG_MS = 3600;

// Chapter I — fossil-root chamber. Walking in, Gorti meets the whale memory:
// a blue whale passes through the earth, speaks in three tones, and its song
// wakes the way on: in its wake three whales rise out of the soil one above
// the other, each answering the song in one of its voices (deep, middle,
// high) as it arrives, and the roots closing the tunnel mouth part (see the
// room data). Gorti walks on under them and out.
export function r02(w: WorldScene): RoomScript {
  let whale: WhaleActor | null = null;

  const whalePasses = (): void => {
    if (!w.quest.set('r02.whale')) return;
    // A blue whale (the dialogue speaks of Gorti's bond with blue whales),
    // swimming through the earth behind the roots; its call has three voices.
    whale = whale ?? new WhaleActor(w, { species: 'blue', size: 210, x: -400, y: SWIM_Y, scale: 1.3, facing: 1, depth: DEPTH.backProps + 5, seed: 1402 });
    whale.swim(-360, 1960, SWIM_Y, 7000);
    app.audio.sfx('whale');
    app.ui.hud.caption(CAPTIONS.whalePass, 3600);
    const lines = DIALOGUE.whale ?? [];
    lines.forEach((l, i) => w.time.delayedCall(3800 + i * 4200, () => app.ui.hud.caption(l.text, 4100)));
    // The song wakes the way on as the whale passes the sleeping root.
    w.time.delayedCall(SONG_MS, () => {
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
      // Whoever comes in past the whale's place (a later checkpoint) still
      // meets it, and finds the way on open at once.
      if (w.player.x > 800 && !w.quest.has('r02.whale')) {
        whalePasses();
        w.flag('r02.song');
      }
    },
    onUpdate(dt) {
      whale?.update(dt);
    },
  };
}
