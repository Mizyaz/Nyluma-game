import * as Phaser from 'phaser';
import { app } from '../../App';
import { DEPTH, VIEW_H, VIEW_W } from '../../constants';
import { hex } from '../../art/palette';
import { frameRef } from '../../art/TextureFactory';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import { Sparrow } from '../../entities/Creatures';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';

// Chapter IV — the sparrow clearing by the river, Gorti's line, and the
// reflective pool that folds the forest into the mind.
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
        // The forest folds inward: layered strips slide across like closing pages.
        const f = frameRef('fx.white');
        const cols = [0x3f4847, 0x4b5654, 0x58705f, 0x2e2426, 0x3a2f2c, 0x231c1f];
        const strips: Phaser.GameObjects.Image[] = [];
        for (let i = 0; i < 6; i++) {
          const h = VIEW_H / 6 + 2;
          const dir = i % 2 ? 1 : -1;
          const s = w.add
            .image(VIEW_W / 2 + dir * VIEW_W * 1.2, i * (VIEW_H / 6) + h / 2, f.atlas, f.frame)
            .setScrollFactor(0)
            .setDisplaySize(VIEW_W * 1.2, h)
            .setTint(cols[i]!)
            .setDepth(DEPTH.overlay + 1);
          strips.push(s);
        }
        app.audio.sfx('paper');
        const cam = w.cameras.main;
        if (!app.settings.reducedMotion) {
          cam.zoomTo(1.25, 1600);
          cam.rotateTo(0.04, false, 1600);
        }
        await Promise.all(strips.map((s, i) => cs.tween({ targets: s, x: VIEW_W / 2, duration: 900 + i * 120, ease: 'Cubic.easeInOut' })));
        await cs.wait(400);
        void hex;
      },
      () => {
        w.flag('r09.pool', false);
        w.goToRoom('r10');
      },
    );
  };

  return {
    setup() {
      w.setObjective(w.quest.has('r09.line') ? 'r09.pool' : 'r09.follow', false);
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
            await cs.say(DIALOGUE.selfLine!);
          },
          () => {
            w.flag('r09.line', false);
            w.player.lock(false);
            w.setObjective('r09.pool');
          },
        );
      }
    },
    onInteract(id) {
      if (id === 'pool') {
        if (!w.quest.has('r09.line')) {
          app.ui.hud.toast('Serçe henüz yolu göstermedi.', 2400);
          return true;
        }
        fold();
        return true;
      }
      return false;
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
