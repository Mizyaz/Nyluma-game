import * as Phaser from 'phaser';
import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { P } from '../../render/2d/palette';
import { CAPTIONS, DIALOGUE } from '../data/dialogue.tr';
import { R03_TREE_X } from '../rooms/r03';
import { CreaturePool } from '../../gameplay/actors/Creatures';
import { Face } from '../../gameplay/actors/Celestial';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt, addGlow } from './helpers';

/** Positions around the tree trunk. */
const T = R03_TREE_X;
/** The poisoned pool (touching it sends Gorti back, costing nothing). */
const POOL = { x0: 760, x1: 1100, y: 1250 };

// Chapter I — the crystal-tree chamber. Over the poisoned pool on the back
// of a whale lying across it, and at the tree the Moon and the Sun appear by
// themselves in the canopy: a small star is born and flies into the tree,
// which blooms into a way up (whales circle in around the trunk, see the
// room data).
export function r03(w: WorldScene): RoomScript {
  let star: Phaser.GameObjects.Image | null = null;
  let starGlow: Phaser.GameObjects.Image | null = null;
  let moon: Face | null = null;
  let sun: Face | null = null;
  let shaft: Phaser.GameObjects.Image | null = null;
  const birds = new CreaturePool(w, 'bird', 14, DEPTH.fx - 2);
  let ascentShown = false;

  const showStar = (): void => {
    if (star) return;
    star = addArt(w, 'prop.star', T - 80, 812, DEPTH.interact + 2);
    starGlow = addGlow(w, T - 80, 812, P.ivory, 0.8, 0.5);
    if (star) {
      star.setScale(star.scale * 1.2);
      w.tweens.add({ targets: star, y: 806, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  };

  /** Moon, Sun, the star and the bloom, one after the other. */
  const treeScene = (): void => {
    void w.narrative.play(
      'r03.tree',
      async (cs) => {
        w.player.lock(true, 'look');
        // The Moon
        // Both appear in the canopy, just above where the whale spiral will
        // end (its top is at 680).
        w.camTo(T - 240, 690);
        moon = new Face(w, 'baby', T - 270, 560, DEPTH.backProps + 20);
        moon.setScale(0.8);
        moon.c.setAlpha(0);
        shaft = addGlow(w, T - 270, 740, P.moonLight, 4.2, 0, DEPTH.backProps + 10);
        await cs.tween({ targets: [moon.c], alpha: 1, duration: 1200 });
        if (shaft) await cs.tween({ targets: shaft, alpha: 0.35, duration: 400 });
        cs.caption(CAPTIONS.r03enter, 4200);
        await cs.wait(900);
        await cs.talk([DIALOGUE.moon![0]!], ['gorti', 'babyMoon']);
        moon.say(2600);
        await cs.talk([DIALOGUE.moon![1]!], ['gorti', 'babyMoon']);
        await cs.tween({ targets: moon.c, alpha: 0, duration: 1000 });
        shaft?.setAlpha(0);
        w.flag('r03.moon', false);
        // The Sun and the star
        w.camTo(T - 40, 650);
        sun = new Face(w, 'sun', T + 90, 540, DEPTH.backProps + 20);
        sun.setScale(0.42);
        sun.c.setAlpha(0);
        await cs.tween({ targets: sun.c, alpha: 1, duration: 1200 });
        sun.cough();
        await cs.wait(700);
        await cs.talk(DIALOGUE.sun!.slice(0, 2), ['gorti', 'sun']);
        sun.say(3000);
        await cs.talk(DIALOGUE.sun!.slice(2), ['gorti', 'sun']);
        await cs.tween({ targets: sun.c, alpha: 0, duration: 1000 });
        w.flag('r03.sun', false);
        showStar();
        app.audio.sfx('crystal', { pitch: 1.5 });
        cs.caption(CAPTIONS.starBorn, 4200);
        if (star) await cs.tween({ targets: w.camFree, x: T - 80, y: 860, duration: 1000 });
        await cs.wait(900);
        w.flag('r03.star', false);
        // The bloom
        w.player.lock(true, 'interact');
        cs.caption(CAPTIONS.starTaken, 3000);
        w.camTo(T, 900);
        if (star) {
          w.tweens.killTweensOf(star);
          await cs.tween({ targets: [star, starGlow!], x: T, y: 1000, duration: 900, ease: 'Sine.easeInOut' });
        }
        cs.caption(CAPTIONS.bloom1, 5200);
        app.audio.sfx('bloom');
        w.flash(0xe8dcca, 0.35);
        w.flag('r03.bloom');
        star?.setVisible(false);
        starGlow?.setVisible(false);
        for (let i = 0; i < 12; i++) {
          w.time.delayedCall(i * 140, () => {
            birds.spawn(T - 120 + Math.random() * 260, 700 + Math.random() * 300, (Math.random() - 0.4) * 160, -80 - Math.random() * 60, 3);
            if (i % 3 === 0) app.audio.sfx('chirp', { pitch: 0.9 + Math.random() * 0.3 });
          });
        }
        await cs.wait(2200);
        cs.caption(CAPTIONS.bloom2, 5200);
        w.player.lock(true, 'idle');
        // Up the whale spiral to the canopy it leads into.
        await cs.tween({ targets: w.camFree, y: 760, duration: 1600, ease: 'Sine.easeInOut' });
        await cs.wait(600);
      },
      () => {
        for (const f of ['r03.moon', 'r03.sun', 'r03.star', 'r03.bloom']) w.flag(f, false);
        moon?.destroy();
        moon = null;
        sun?.destroy();
        sun = null;
        shaft?.setAlpha(0);
        star?.setVisible(false);
        starGlow?.setVisible(false);
        w.camTo(null);
        w.player.lock(false);
      },
    );
  };

  return {
    setup() {
      w.onCleanup(() => {
        birds.destroy();
        moon?.destroy();
        sun?.destroy();
      });
    },
    onFixed() {
      const p = w.player;
      // The poisoned pool: back to the checkpoint (costs nothing).
      if (p.state === 'normal' && p.x > POOL.x0 && p.x < POOL.x1 && p.feetY > POOL.y) w.reform();
      // At the tree, the sky answers by itself.
      if (p.x > T - 360 && p.feetY <= 1182 && p.onGround && !w.quest.has('r03.bloom')) treeScene();
      // Halfway up the spiral.
      if (!ascentShown && w.quest.has('r03.bloom') && p.feetY < 990) {
        ascentShown = true;
        app.ui.hud.caption(CAPTIONS.ascent, 6000);
        app.audio.sfx('whale', { vol: 0.5 });
      }
    },
    onUpdate(dt) {
      birds.update(dt);
      moon?.update(dt);
      sun?.update(dt);
      moon?.lookAt(w.player.x, w.player.feetY - 60);
      sun?.lookAt(w.player.x, w.player.feetY - 60);
    },
  };
}
