import * as Phaser from 'phaser';
import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { P } from '../../render/2d/palette';
import { CAPTIONS, DIALOGUE } from '../data/dialogue.tr';
import { R03_SPIRAL, R03_TREE_X } from '../rooms/r03';
import { CreaturePool } from '../../gameplay/actors/Creatures';
import { Face } from '../../gameplay/actors/Celestial';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import type { Cutscene } from '../../engine/systems/NarrativeSystem';
import type { RoomScript } from './types';
import { addArt, addGlow, bloomAt } from './helpers';

/** Positions around the tree trunk. */
const T = R03_TREE_X;
/** The poisoned pool (touching it sends Gorti back, costing nothing). */
const POOL = { x0: 760, x1: 1100, y: 1250 };
/** The backs of the spiral's whales (room data), bottom to top: the roots carry Gorti up them. */
const STEPS = R03_SPIRAL.map(({ y, back }, i) => ({ id: `s${i + 1}`, x: T + (back ? 14 : -14), y }));
/** Into the canopy over the last whale: the way on. */
const CANOPY = { x: T + 10, y: 560 };

// Chapter I — the crystal-tree chamber. Over the poisoned pool on the back
// of a whale lying across it, and at the tree the Moon and the Sun appear by
// themselves in the canopy: a small star is born and flies into the tree,
// which blooms (whales circle in around the trunk, see the room data). At
// the trunk Gorti's roots carry him up from whale to whale into the canopy,
// and on to the surface.
export function r03(w: WorldScene): RoomScript {
  let star: Phaser.GameObjects.Image | null = null;
  let starGlow: Phaser.GameObjects.Image | null = null;
  let moon: Face | null = null;
  let sun: Face | null = null;
  let shaft: Phaser.GameObjects.Image | null = null;
  const birds = new CreaturePool(w, 'bird', 14, DEPTH.fx - 2);

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
        // The whale spiral up to the canopy.
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

  /** Stays where the roots set Gorti down: on a whale's back, which bears no weight. */
  const holdOn = (): void => {
    const p = w.player;
    p.body.setAllowGravity(false);
    p.body.setVelocity(0, 0);
    p.lock(true, 'idle');
  };

  /** One pull of the roots up onto the next back (resolves on landing, or at once when skipped). */
  const reachTo = (cs: Cutscene, to: { x: number; y: number }, onLand: () => void): Promise<void> => {
    // The reach and pull poses, not the pose he waited in.
    w.player.lock(false);
    const landed = new Promise<void>((res) =>
      w.player.startReach({
        anchor: { x: to.x, y: to.y - 50 },
        land: to,
        onDone: () => {
          holdOn();
          onLand();
          res();
        },
      }),
    );
    return Promise.race([landed, cs.wait(1500)]);
  };

  /** At the trunk: up the whale spiral from back to back, into the canopy and on. */
  const ascent = (): void => {
    void w.narrative.play(
      'r03.ascent',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'look');
        w.camTo(null);
        cs.caption(CAPTIONS.ascent, 6500);
        app.audio.sfx('whale', { vol: 0.5 });
        await cs.wait(500);
        for (const st of STEPS) {
          if (cs.skipped) break;
          await reachTo(cs, st, () => w.room.whales?.bump(st.id, st.x));
          await cs.wait(260);
        }
        if (!cs.skipped) {
          await reachTo(cs, CANOPY, () => bloomAt(w, CANOPY.x, CANOPY.y + 20, 6));
          await cs.wait(300);
        }
      },
      () => {
        holdOn();
        w.flag('r03.canopy', false);
        w.goToRoom('r04');
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
      if (!p.onGround || w.narrative.busy) return;
      // At the tree, the sky answers by itself; once it has bloomed, the
      // way up starts at the trunk.
      if (!w.quest.has('r03.bloom')) {
        if (p.x > T - 360) treeScene();
      } else if (p.x > T - 140) ascent();
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
