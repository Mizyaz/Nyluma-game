import { app } from '../../App';
import { DEPTH } from '../../constants';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import { Whale } from '../../entities/Creatures';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt } from './helpers';

// Chapter I — fossil-root ascent: the whale memory and the first song.
export function r02(w: WorldScene): RoomScript {
  let whale: Whale | null = null;
  let nodeLit: Phaser.GameObjects.Image | null = null;

  const pickObjective = (): void => {
    const q = w.quest;
    if (!q.has('r02.whale')) w.setObjective('r02.whale', false);
    else if (!q.has('r02.song')) w.setObjective('r02.song', false);
    else if (!q.has('r02.reach')) w.setObjective('r02.climb', false);
    else if (!q.has('r02.reached')) w.setObjective('r02.reach', false);
    else w.setObjective('r02.top', false);
  };

  const whaleScene = (): void => {
    void w.narrative.play(
      'r02.whale',
      async (cs) => {
        w.player.lock(true, 'look');
        w.camTo(900, 2020);
        await cs.wait(400);
        cs.caption(CAPTIONS.whalePass, 5200);
        whale = whale ?? new Whale(w, -400, 2000, DEPTH.backProps + 5);
        whale.swim(-300, 1900, 1990, 7000);
        await cs.wait(2600);
        await cs.say(DIALOGUE.whale!);
        await cs.wait(300);
      },
      () => {
        w.flag('r02.whale', false);
        w.quest.grant('song');
        w.camTo(null);
        w.player.lock(false);
        w.setObjective('r02.song');
        app.ui.hud.toast('F: tomurcuğun yanında balina dilini söyle', 5000);
      },
    );
  };

  const songScene = (): void => {
    void w.narrative.play(
      'r02.song',
      async (cs) => {
        w.player.lock(true, 'song');
        app.audio.sfx('rootGrow');
        w.shake(0.004, 700);
        w.flag('r02.song');
        w.camTo(1300, 2000);
        await cs.wait(500);
        cs.caption(CAPTIONS.songRoot, 4200);
        await cs.tween({ targets: w.camFree, y: 1560, duration: 2200, ease: 'Sine.easeInOut' });
        await cs.wait(600);
      },
      () => {
        w.flag('r02.song', false);
        w.camTo(null);
        w.player.lock(false);
        w.setObjective('r02.climb');
      },
    );
  };

  return {
    setup() {
      pickObjective();
      if (w.quest.set('r02.enter')) app.ui.hud.caption(CAPTIONS.r02enter, 5200);
      const node = w.room.nodes[0];
      if (node && !w.quest.has('r02.song')) {
        nodeLit = addArt(w, 'prop.node.lit', node.def.x, node.def.y + 2, DEPTH.interact + 1);
        nodeLit?.setAlpha(0);
      }
      w.events.on('reach-done', (id: string) => {
        if (id === 'a1' && w.flag('r02.reached', false)) w.setObjective('r02.top');
      });
      w.onCleanup(() => {
        w.events.off('reach-done');
        whale?.destroy();
      });
    },
    onTrigger(id) {
      if (id === 'whale' && !w.quest.has('r02.whale')) whaleScene();
      if (id === 'reachTut' && w.quest.has('r02.song')) {
        w.quest.grant('reach');
        if (w.flag('r02.reach', false)) {
          app.ui.hud.caption(CAPTIONS.reachTut, 5200);
          w.setObjective('r02.reach');
        }
      }
    },
    onSong(nodeId) {
      if (nodeId === 'n1' && !w.quest.has('r02.song')) songScene();
    },
    onSongNote(_id, _n, demo) {
      if (!nodeLit) return;
      nodeLit.setAlpha(1);
      w.tweens.add({ targets: nodeLit, alpha: 0, duration: demo ? 520 : 380 });
    },
    onUpdate(dt) {
      whale?.update(dt);
    },
  };
}
