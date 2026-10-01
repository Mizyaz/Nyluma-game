import { app } from '../../engine/App';
import { CAPTIONS, DIALOGUE } from '../data/dialogue.tr';
import { Face } from '../../gameplay/actors/Celestial';
import { MemoryStone } from '../../gameplay/actors/MemoryStone';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt } from './helpers';
import { DEPTH } from '../../engine/constants';
import { hasFrame, frameRef } from '../../render/2d/TextureFactory';

// Chapter II — weight of a remembered life: the memory stones already rest
// on their plates, the crystal gate is open, and at the far end the ancient
// Moon speaks.
const PLATE_A = { x: 1180, y: 1100 };
const PLATE_B = { x: 2060, y: 1100 };
/** The Moon's face, high over the floor (1100) at the far end. */
const MOON = { x: 3640, y: 710 };

export function r05(w: WorldScene): RoomScript {
  let s1: MemoryStone | null = null;
  let s2: MemoryStone | null = null;
  let moon: Face | null = null;
  const plates: { img: Phaser.GameObjects.Image | null; x: number; y: number; down: boolean }[] = [];

  const setPlate = (i: number, down: boolean): void => {
    const pl = plates[i];
    if (!pl || pl.down === down) return;
    pl.down = down;
    if (pl.img && hasFrame(down ? 'prop.plate.down' : 'prop.plate')) {
      const f = frameRef(down ? 'prop.plate.down' : 'prop.plate');
      pl.img.setTexture(f.atlas, f.frame);
    }
    if (down) app.audio.sfx('clunk');
  };

  const moonScene = (): void => {
    void w.narrative.play(
      'r05.moon',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'idle');
        w.camTo(3600, MOON.y + 170);
        if (p.form !== 'human') {
          cs.caption('Gorti’nin bedeni, ayın bakışı altında yeniden ağırlaştı.', 3600);
          await new Promise<void>((res) => (cs.skipped ? res() : w.transform('human', res)));
        }
        p.lock(true, 'look');
        moon = new Face(w, 'baby', MOON.x, MOON.y, DEPTH.backProps + 20);
        moon.setScale(0.7);
        moon.c.setAlpha(0);
        await cs.tween({ targets: moon.c, alpha: 1, duration: 1300 });
        cs.caption(CAPTIONS.worldStrain, 4200);
        w.shake(0.003, 900);
        app.audio.sfx('rumble', { vol: 0.5 });
        await cs.wait(2000);
        const old = new Face(w, 'old', MOON.x, MOON.y, DEPTH.backProps + 21);
        old.setScale(0.7);
        old.c.setAlpha(0);
        await cs.tween({ targets: old.c, alpha: 1, duration: 1800 });
        moon.destroy();
        moon = old;
        cs.caption(CAPTIONS.oldMoon, 4600);
        await cs.wait(1800);
        await cs.talk([DIALOGUE.oldMoon![0]!], ['gorti', 'oldMoon']);
        moon.laughing = true;
        app.audio.sfx('rumble', { vol: 0.3 });
        await cs.talk([DIALOGUE.oldMoon![1]!], ['gorti', 'oldMoon']);
        moon.laughing = false;
        moon.say(3000);
        await cs.talk(DIALOGUE.oldMoon!.slice(2), ['gorti', 'oldMoon']);
        await cs.wait(600);
      },
      () => {
        if (w.player.form !== 'human') {
          w.player.setForm('human');
          w.quest.setForm('human');
        }
        w.flag('r05.moon', false);
        w.camTo(null);
        w.player.lock(false);
      },
    );
  };

  return {
    setup() {
      // The stones rest where the story left them.
      w.flag('r05.plateA', false);
      w.flag('r05.plateB', false);
      if (w.quest.set('r05.enter')) app.ui.hud.caption(CAPTIONS.r05enter, 4200);
      plates.push({ img: addArt(w, 'prop.plate', PLATE_A.x, PLATE_A.y + 2, DEPTH.props + 1), ...PLATE_A, down: false });
      plates.push({ img: addArt(w, 'prop.plate', PLATE_B.x, PLATE_B.y + 2, DEPTH.props + 1), ...PLATE_B, down: false });
      s1 = new MemoryStone(w, { x: 760, y: 1100 }, w.room.group);
      s2 = new MemoryStone(w, { x: 1700, y: 1100 }, w.room.group);
      // The stones rest in the background: Gorti walks in front of them.
      s1.placeAt(PLATE_A.x, PLATE_A.y);
      s1.locked = true;
      setPlate(0, true);
      s2.placeAt(PLATE_B.x, PLATE_B.y);
      s2.locked = true;
      setPlate(1, true);
      if (w.quest.has('r05.moon')) {
        moon = new Face(w, 'old', MOON.x, MOON.y, DEPTH.backProps + 20);
        moon.setScale(0.7);
      }
      w.onCleanup(() => {
        s1?.destroy();
        s2?.destroy();
        moon?.destroy();
      });
    },
    onTrigger(id) {
      if (id === 'moon' && !w.quest.has('r05.moon')) moonScene();
    },
    onFixed(dt) {
      for (const st of [s1, s2]) {
        st?.push(0, dt);
        st?.sync();
      }
    },
    onUpdate(dt) {
      moon?.update(dt);
      moon?.lookAt(w.player.x, w.player.feetY - 60);
    },
  };
}
