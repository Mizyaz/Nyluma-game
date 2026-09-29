import { app } from '../../App';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import { Face } from '../../entities/Celestial';
import { MemoryStone } from '../../entities/MemoryStone';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt } from './helpers';
import { DEPTH, HULL_W } from '../../constants';
import { hasFrame, frameRef } from '../../art/TextureFactory';

// Chapter II — weight of a remembered life: two form puzzles, then the
// ancient Moon on the hilltop.
const PLATE_A = { x: 1180, y: 1100 };
const PLATE_B = { x: 2060, y: 1100 };

export function r05(w: WorldScene): RoomScript {
  let s1: MemoryStone | null = null;
  let s2: MemoryStone | null = null;
  let moon: Face | null = null;
  let rootHintShown = false;
  let plateHintShown = false;
  const plates: { img: Phaser.GameObjects.Image | null; x: number; y: number; down: boolean }[] = [];

  const pickObjective = (): void => {
    const q = w.quest;
    if (q.has('r05.moon')) w.setObjective('r05.leave', false);
    else if (q.has('r05.plateB')) w.setObjective('r05.gate', false);
    else if (q.has('r05.onPath')) w.setObjective('r05.stone2', false);
    else if (q.has('r05.plateA')) w.setObjective('r05.reach', false);
    else w.setObjective('r05.stone', false);
  };

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

  const onPlate = (stone: MemoryStone, p: { x: number; y: number }): boolean =>
    Math.abs(stone.x - p.x) < 56 && Math.abs(stone.bottom - p.y) < 12 && stone.body.blocked.down;

  const moonScene = (): void => {
    void w.narrative.play(
      'r05.moon',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'idle');
        w.camTo(3600, 420);
        if (p.form !== 'human') {
          cs.caption('Gorti’nin bedeni, ayın bakışı altında yeniden ağırlaştı.', 3600);
          await new Promise<void>((res) => (cs.skipped ? res() : w.transform('human', res)));
        }
        p.lock(true, 'look');
        moon = new Face(w, 'baby', 3640, 250, DEPTH.backProps + 20);
        moon.setScale(0.7);
        moon.c.setAlpha(0);
        await cs.tween({ targets: moon.c, alpha: 1, duration: 1300 });
        cs.caption(CAPTIONS.worldStrain, 4200);
        w.shake(0.003, 900);
        app.audio.sfx('rumble', { vol: 0.5 });
        await cs.wait(2000);
        const old = new Face(w, 'old', 3640, 250, DEPTH.backProps + 21);
        old.setScale(0.7);
        old.c.setAlpha(0);
        await cs.tween({ targets: old.c, alpha: 1, duration: 1800 });
        moon.destroy();
        moon = old;
        cs.caption(CAPTIONS.oldMoon, 4600);
        await cs.wait(1800);
        await cs.say([DIALOGUE.oldMoon![0]!]);
        moon.laughing = true;
        app.audio.sfx('rumble', { vol: 0.3 });
        await cs.say([DIALOGUE.oldMoon![1]!]);
        moon.laughing = false;
        moon.say(3000);
        await cs.say(DIALOGUE.oldMoon!.slice(2));
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
        w.setObjective('r05.leave');
      },
    );
  };

  return {
    setup() {
      pickObjective();
      if (w.quest.set('r05.enter')) app.ui.hud.caption(CAPTIONS.r05enter, 4200);
      plates.push({ img: addArt(w, 'prop.plate', PLATE_A.x, PLATE_A.y + 2, DEPTH.props + 1), ...PLATE_A, down: false });
      plates.push({ img: addArt(w, 'prop.plate', PLATE_B.x, PLATE_B.y + 2, DEPTH.props + 1), ...PLATE_B, down: false });
      s1 = new MemoryStone(w, { x: 760, y: 1100 }, w.room.group);
      s2 = new MemoryStone(w, { x: 1700, y: 820 }, w.room.group);
      w.physics.add.collider(w.player.zone, s1.zone);
      w.physics.add.collider(w.player.zone, s2.zone);
      w.physics.add.collider(s1.zone, s2.zone);
      if (w.quest.has('r05.plateA')) {
        s1.placeAt(PLATE_A.x, PLATE_A.y);
        s1.locked = true;
        setPlate(0, true);
      } else s2.setDormant(true); // its ledge rises with the first plate
      if (w.quest.has('r05.plateB')) {
        s2.placeAt(PLATE_B.x, PLATE_B.y);
        s2.locked = true;
        setPlate(1, true);
      }
      if (w.quest.has('r05.moon')) {
        moon = new Face(w, 'old', 3640, 250, DEPTH.backProps + 20);
        moon.setScale(0.7);
      }
      w.onCleanup(() => {
        s1?.destroy();
        s2?.destroy();
        moon?.destroy();
      });
    },
    onTrigger(id) {
      if (id === 'formTut' && w.quest.set('r05.formTut')) app.ui.hud.toast('R: işaretli dairede biçim değiştir', 5000);
      if (id === 'moon' && !w.quest.has('r05.moon')) moonScene();
    },
    onInteract(id) {
      if (id === 'reset1' && s1 && !w.quest.has('r05.plateA')) {
        s1.recall();
        return true;
      }
      if (id === 'reset1') {
        app.ui.hud.toast('Taş yerini buldu.', 2000);
        return true;
      }
      if (id === 'reset2' && s2 && !w.quest.has('r05.plateB')) {
        s2.recall();
        return true;
      }
      return false;
    },
    onFixed(dt) {
      const p = w.player;
      const axis = app.input.context === 'gameplay' && p.controllable ? app.input.axisX() : 0;
      p.pushing = false;
      for (const st of [s1, s2]) {
        if (!st) continue;
        let vx = 0;
        const pr = p.x + HULL_W / 2;
        const pl = p.x - HULL_W / 2;
        const sl = st.x - st.size / 2;
        const sr = st.x + st.size / 2;
        const vert = p.feetY > st.bottom - st.size + 6 && p.feetY - 84 < st.bottom - 4;
        const touchingRight = axis > 0 && Math.abs(pr - sl) < 4 && vert;
        const touchingLeft = axis < 0 && Math.abs(pl - sr) < 4 && vert;
        if ((touchingRight || touchingLeft) && p.onGround) {
          if (p.kind === 'gorti' && p.form === 'human') {
            vx = axis * p.pushSpeed;
            p.pushing = true;
          } else if (!rootHintShown) {
            rootHintShown = true;
            app.ui.hud.toast('Kök beden bu ağırlığı kıpırdatamaz. İnsan bedenine geç (R).', 4200);
          }
        }
        st.push(vx, dt);
        st.sync();
      }
      // Plates
      if (s1 && !w.quest.has('r05.plateA') && onPlate(s1, PLATE_A)) {
        s1.placeAt(PLATE_A.x, PLATE_A.y);
        s1.locked = true;
        setPlate(0, true);
        w.flag('r05.plateA');
        if (s2) {
          s2.setDormant(false);
          s2.placeAt(s2.home.x, s2.home.y);
          if (s2.img) {
            s2.img.setAlpha(0);
            w.tweens.add({ targets: s2.img, alpha: 1, duration: 900, delay: 500 });
          }
        }
        app.audio.sfx('rootGrow');
        w.shake(0.004, 500);
        app.ui.hud.caption(CAPTIONS.plateA, 4800);
        w.setObjective('r05.reach');
      }
      if (s2 && !w.quest.has('r05.plateB') && onPlate(s2, PLATE_B)) {
        s2.placeAt(PLATE_B.x, PLATE_B.y);
        s2.locked = true;
        setPlate(1, true);
        w.flag('r05.plateB');
        app.audio.sfx('shard', { pitch: 0.6 });
        w.shake(0.004, 400);
        app.ui.hud.caption(CAPTIONS.plateB, 4800);
        w.setObjective('r05.gate');
      }
      // The human's own weight makes a plate stir, but only a stone holds it.
      for (let i = 0; i < 2; i++) {
        const pt = i === 0 ? PLATE_A : PLATE_B;
        const done = i === 0 ? w.quest.has('r05.plateA') : w.quest.has('r05.plateB');
        if (done) continue;
        const standing = p.onGround && Math.abs(p.x - pt.x) < 50 && Math.abs(p.feetY - pt.y) < 6;
        setPlate(i, standing && p.form === 'human');
        if (standing && p.form === 'human' && !plateHintShown) {
          plateHintShown = true;
          app.ui.hud.toast('Levha kıpırdadı; ama kalıcı bir ağırlık bekliyor. Taşı it.', 4200);
        }
      }
      w.probeExtra.stones = [s1, s2].map((st) => (st ? { x: st.x, bottom: st.bottom } : null));
      if (w.quest.has('r05.plateA') && !w.quest.has('r05.onPath') && p.feetY <= 822 && p.x > 1300 && p.x < 2000 && p.onGround) {
        w.flag('r05.onPath', false);
        if (!w.quest.has('r05.plateB')) w.setObjective('r05.stone2');
      }
      if (w.quest.has('r05.plateB') && !w.quest.has('r05.moon') && p.x > 3400 && w.objective !== 'r05.hill') w.setObjective('r05.hill');
    },
    onUpdate(dt) {
      moon?.update(dt);
      moon?.lookAt(w.player.x, w.player.feetY - 60);
    },
  };
}
