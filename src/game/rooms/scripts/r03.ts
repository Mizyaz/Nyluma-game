import * as Phaser from 'phaser';
import { app } from '../../App';
import { DEPTH } from '../../constants';
import { P } from '../../art/palette';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import { CreaturePool } from '../../entities/Creatures';
import { Face } from '../../entities/Celestial';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt, addGlow } from './helpers';

// Chapter I — the crystal-tree chamber: reach, breath, Moon and Sun, the
// small star and the blooming tree.
export function r03(w: WorldScene): RoomScript {
  let star: Phaser.GameObjects.Image | null = null;
  let starGlow: Phaser.GameObjects.Image | null = null;
  let moon: Face | null = null;
  let sun: Face | null = null;
  let shaft: Phaser.GameObjects.Image | null = null;
  const birds = new CreaturePool(w, 'bird', 14, DEPTH.fx - 2);
  let pulseHinted = false;
  let ascentShown = false;

  const pickObjective = (): void => {
    const q = w.quest;
    if (q.has('r03.bloom')) w.setObjective('r03.climb', false);
    else if (q.has('r03.star')) w.setObjective('r03.bind', false);
    else if (q.has('r03.sun')) w.setObjective('r03.star', false);
    else if (q.has('r03.moon')) w.setObjective('r03.sun', false);
    else if (q.has('r03.crossed')) w.setObjective('r03.moon', false);
    else if (q.has('r03.focus')) w.setObjective('r03.focus', false);
    else w.setObjective('r03.cross', false);
  };

  const showStar = (): void => {
    if (star) return;
    star = addArt(w, 'prop.star', 2520, 812, DEPTH.interact + 2);
    starGlow = addGlow(w, 2520, 812, P.ivory, 0.8, 0.5);
    if (star) {
      star.setScale(star.scale * 1.2);
      w.tweens.add({ targets: star, y: 806, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  };

  const moonScene = (): void => {
    void w.narrative.play(
      'r03.moon',
      async (cs) => {
        w.player.lock(true, 'look');
        w.camTo(2330, 820);
        moon = new Face(w, 'baby', 2330, 520, DEPTH.backProps + 20);
        moon.setScale(0.8);
        moon.c.setAlpha(0);
        shaft = addGlow(w, 2330, 700, P.moonLight, 4.2, 0, DEPTH.backProps + 10);
        await cs.tween({ targets: [moon.c], alpha: 1, duration: 1400 });
        if (shaft) await cs.tween({ targets: shaft, alpha: 0.35, duration: 400 });
        cs.caption(CAPTIONS.r03enter, 4200);
        await cs.wait(1200);
        await cs.say([DIALOGUE.moon![0]!]);
        moon.say(2600);
        await cs.say([DIALOGUE.moon![1]!]);
        await cs.tween({ targets: moon.c, alpha: 0, duration: 1400 });
      },
      () => {
        moon?.destroy();
        moon = null;
        shaft?.setAlpha(0);
        w.flag('r03.moon', false);
        w.camTo(null);
        w.player.lock(false);
        w.setObjective('r03.sun');
      },
    );
  };

  const sunScene = (): void => {
    void w.narrative.play(
      'r03.sun',
      async (cs) => {
        w.player.lock(true, 'look');
        w.camTo(2450, 800);
        sun = new Face(w, 'sun', 2640, 430, DEPTH.backProps + 20);
        sun.setScale(0.42);
        sun.c.setAlpha(0);
        await cs.tween({ targets: sun.c, alpha: 1, duration: 1400 });
        sun.cough();
        await cs.wait(900);
        await cs.say(DIALOGUE.sun!.slice(0, 2));
        sun.say(3000);
        await cs.say(DIALOGUE.sun!.slice(2));
        await cs.tween({ targets: sun.c, alpha: 0, duration: 1200 });
        showStar();
        app.audio.sfx('crystal', { pitch: 1.5 });
        cs.caption(CAPTIONS.starBorn, 5200);
        if (star) await cs.tween({ targets: w.camFree, x: 2520, y: 860, duration: 1200 });
        await cs.wait(1200);
      },
      () => {
        sun?.destroy();
        sun = null;
        w.flag('r03.sun', false);
        showStar();
        w.camTo(null);
        w.player.lock(false);
        w.setObjective('r03.star');
      },
    );
  };

  const bloomScene = (): void => {
    void w.narrative.play(
      'r03.bloom',
      async (cs) => {
        w.player.lock(true, 'interact');
        w.camTo(2600, 900);
        if (star) {
          w.tweens.killTweensOf(star);
          await cs.tween({ targets: [star, starGlow!], x: 2600, y: 1000, duration: 900, ease: 'Sine.easeInOut' });
        }
        cs.caption(CAPTIONS.bloom1, 5200);
        app.audio.sfx('bloom');
        w.flash(0xe8dcca, 0.35);
        w.flag('r03.bloom');
        star?.setVisible(false);
        starGlow?.setVisible(false);
        for (let i = 0; i < 12; i++) {
          w.time.delayedCall(i * 140, () => {
            birds.spawn(2480 + Math.random() * 260, 700 + Math.random() * 300, (Math.random() - 0.4) * 160, -80 - Math.random() * 60, 3);
            if (i % 3 === 0) app.audio.sfx('chirp', { pitch: 0.9 + Math.random() * 0.3 });
          });
        }
        await cs.wait(2400);
        cs.caption(CAPTIONS.bloom2, 5200);
        w.player.lock(true, 'idle');
        await cs.tween({ targets: w.camFree, y: 560, duration: 1800, ease: 'Sine.easeInOut' });
        await cs.wait(800);
      },
      () => {
        w.flag('r03.bloom', false);
        star?.setVisible(false);
        starGlow?.setVisible(false);
        w.camTo(null);
        w.player.lock(false);
        w.setObjective('r03.climb');
      },
    );
  };

  return {
    setup() {
      pickObjective();
      if (w.quest.has('r03.sun') && !w.quest.has('r03.star')) showStar();
      if (w.quest.has('r03.star') && !w.quest.has('r03.bloom')) {
        showStar();
        star?.setVisible(true);
      }
      w.onCleanup(() => {
        birds.destroy();
        moon?.destroy();
        sun?.destroy();
      });
    },
    onTrigger(id) {
      if (id === 'focusTut') {
        w.quest.grant('focus');
        if (w.flag('r03.focus', false)) {
          app.ui.hud.caption(CAPTIONS.focusTut, 6000);
          w.setObjective('r03.focus');
        }
      }
    },
    onSong(id) {
      if (id === 'moon' && !w.quest.has('r03.moon')) moonScene();
      if (id === 'sun' && w.quest.has('r03.moon') && !w.quest.has('r03.sun')) sunScene();
    },
    onInteract(id) {
      if (id === 'star' && w.quest.has('r03.sun') && !w.quest.has('r03.star')) {
        w.flag('r03.star');
        app.audio.sfx('pickup');
        app.ui.hud.caption(CAPTIONS.starTaken, 4200);
        w.setObjective('r03.bind');
        return true;
      }
      if (id === 'heart' && w.quest.has('r03.star') && !w.quest.has('r03.bloom')) {
        bloomScene();
        return true;
      }
      return false;
    },
    onFixed() {
      const p = w.player;
      // Poisoned pool: gentle damage and a reform at the checkpoint.
      if (p.state === 'normal' && p.x > 700 && p.x < 1260 && p.feetY > 1285) {
        w.damage(p.x, 1);
        w.reform(false);
      }
      if (!pulseHinted && p.x > 300 && p.x < 420 && p.feetY > 1150) {
        pulseHinted = true;
        if (w.quest.set('r03.pulseHint')) app.ui.hud.caption(CAPTIONS.pulseTut, 5200);
      }
      if (p.x > 2150 && p.feetY <= 1182 && w.quest.has('r03.focus') && !w.quest.has('r03.crossed')) {
        w.flag('r03.crossed', false);
        w.setObjective('r03.moon');
      }
      if (!ascentShown && w.quest.has('r03.bloom') && p.feetY < 560) {
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
      // The carried star rides above Gorti's hand, wrapped in vines.
      if (star && w.quest.has('r03.star') && !w.quest.has('r03.bloom') && !w.narrative.busy) {
        const h = w.player.rig.attachPoint('handR');
        star.setPosition(h.x, h.y - 18);
        starGlow?.setPosition(h.x, h.y - 18);
      }
    },
  };
}
