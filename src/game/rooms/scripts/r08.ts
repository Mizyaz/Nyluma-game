import * as Phaser from 'phaser';
import { app } from '../../App';
import { DEPTH } from '../../constants';
import { hex, P } from '../../art/palette';
import { frameRef, hasFrame } from '../../art/TextureFactory';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import { SUN_TUNING, sunNext, sunStart, type SunState } from '../../data/encounters';
import { CreaturePool, Sparrow } from '../../entities/Creatures';
import { Face } from '../../entities/Celestial';
import { Horse } from '../../entities/Horse';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt, addGlow } from './helpers';

// Chapter III — the Sun. Nothing here can hurt Gorti and nothing has to be
// done: the flowers wake as Gorti passes (or by themselves), the currents
// rise, the fish gather around Gorti and fly into the Sun whenever it opens
// its eyes, and after the third time the Sun falls.

const GROUND = 640;
const SUN_X = 640;
const SUN_Y = 175;
const FLOWERS = [220, 1060];
const CURRENTS = [420, 640, 860];

export function r08(w: WorldScene): RoomScript {
  let st: SunState = sunStart({ p1: w.quest.has('r08.p1'), p2: w.quest.has('r08.p2'), done: w.quest.has('r08.done') });
  let sun: Face | null = null;
  let horse: Horse | null = null;
  let sparrow: Sparrow | null = null;
  const fish = new CreaturePool(w, 'fish', 12, DEPTH.actors + 2);
  const flowerImgs: { closed: Phaser.GameObjects.Image | null; open: Phaser.GameObjects.Image | null; opened: boolean }[] = [];
  const columns: { base: Phaser.GameObjects.Image | null; col: Phaser.GameObjects.Image; h: number; target: number; glow: Phaser.GameObjects.Image }[] = [];
  let ring: Phaser.GameObjects.Image | null = null;
  let windowT = 0;
  let coughIn = 3;
  let fishMode: 'hidden' | 'school' | 'columns' | 'gather' | 'fly' = 'hidden';
  let gatherK = 0;
  let collapsing = false;
  /** Seconds until the next thing happens by itself. */
  let nextBeat = 2.5;

  const buildStage = (): void => {
    sun = new Face(w, 'sun', SUN_X, SUN_Y, DEPTH.backProps + 30);
    sun.setScale(0.72);
    const rf = frameRef('fx.ring');
    ring = w.add.image(SUN_X, SUN_Y, rf.atlas, rf.frame).setTint(hex(P.vein)).setBlendMode(Phaser.BlendModes.ADD).setScale(2.2).setAlpha(0).setDepth(DEPTH.backProps + 31);
    FLOWERS.forEach((x, i) => {
      const opened = st.flowers > i || st.phase !== 'intro' && st.phase !== 'p1';
      const closed = addArt(w, 'prop.flowernode', x, GROUND + 2, DEPTH.props + 2);
      const open = addArt(w, 'prop.flowernode.open', x, GROUND + 2, DEPTH.props + 2);
      closed?.setVisible(!opened);
      open?.setVisible(opened);
      flowerImgs.push({ closed, open, opened });
    });
    const wf = frameRef('fx.white');
    CURRENTS.forEach((x, i) => {
      const base = addArt(w, 'prop.current', x, GROUND + 2, DEPTH.props + 1);
      const col = w.add.image(x, GROUND, wf.atlas, wf.frame).setOrigin(0.5, 1).setTint(hex('#6f9fc8')).setAlpha(0.5).setDisplaySize(46, 1).setDepth(DEPTH.props);
      const glow = addGlow(w, x, GROUND - 20, P.crystalTeal, 0.8, 0, DEPTH.props + 2);
      const raised = st.currents > i;
      columns.push({ base, col, h: raised ? 300 : 0, target: raised ? 300 : 0, glow });
    });
    if (st.phase === 'p2' || st.phase === 'p3') fishMode = st.phase === 'p3' ? 'columns' : 'school';
  };

  const openFlower = (i: number): void => {
    const f = flowerImgs[i];
    if (!f || f.opened) return;
    f.opened = true;
    f.closed?.setVisible(false);
    f.open?.setVisible(true).setScale((f.open.scale || 1) * 0.6);
    if (f.open) w.tweens.add({ targets: f.open, scale: f.open.scale / 0.6, duration: 500, ease: 'Back.easeOut' });
    app.audio.sfx('bloom');
    w.burst(FLOWERS[i]!, GROUND - 40, hex(P.sunLight), 16);
    st = sunNext(st, 'flower');
    if (st.phase === 'p2') {
      w.flag('r08.p1', false);
      w.activateCheckpoint('r08_p2', true);
      app.ui.hud.caption(CAPTIONS.fishBorn, 4200);
      app.audio.sfx('fishes');
      fishMode = 'school';
      nextBeat = 1.6;
    }
  };

  const raiseCurrent = (): void => {
    const i = st.currents;
    const c = columns[i];
    if (!c) return;
    c.target = 300;
    app.audio.sfx('splash');
    app.audio.sfx('fishes');
    st = sunNext(st, 'current');
    if (st.phase === 'p3') {
      w.flag('r08.p2', false);
      w.activateCheckpoint('r08_p3', true);
      fishMode = 'columns';
      app.ui.hud.caption(CAPTIONS.current, 4200);
      nextBeat = 2.2;
    }
  };

  /** The Sun opens its eyes and the fish gather around Gorti to fly in. */
  const volley = (): void => {
    windowT = SUN_TUNING.openingWindow;
    app.audio.sfx('crystal', { pitch: 0.8 });
    if (sun) sun.lidDrop = 0;
    fishMode = 'gather';
    gatherK = 0;
    w.player.emote('effort', 900);
  };

  const release = (): void => {
    if (fishMode !== 'gather') return;
    const gathered = gatherK >= 0.99;
    if (!gathered) {
      fishMode = 'columns';
      return;
    }
    fishMode = 'fly';
    const hitNow = windowT > 0;
    const p = w.player;
    app.audio.sfx('fishes');
    for (let i = 0; i < fish.size; i++) {
      const sx = p.x + Math.cos(i) * 60;
      const sy = p.feetY - 90 + Math.sin(i) * 40;
      const o = { t: 0 };
      w.tweens.add({
        targets: o,
        t: 1,
        delay: i * 30,
        duration: 650,
        ease: 'Sine.easeIn',
        onUpdate: () => {
          const x = sx + (SUN_X - sx) * o.t;
          const y = sy + (SUN_Y - sy) * o.t - Math.sin(o.t * Math.PI) * 80;
          fish.place(i, x, y, Math.atan2(SUN_Y - sy, SUN_X - sx));
        },
      });
    }
    w.time.delayedCall(700 + fish.size * 30, () => {
      if (hitNow && st.phase === 'p3') {
        st = sunNext(st, 'hit');
        app.audio.sfx('sunhit');
        w.flash(0xf0d38e, 0.35);
        w.shake(0.008, 300);
        sun?.cough();
        if (sun) sun.rayLevel = 0.5;
        w.player.emote('joy', 1400);
        if (st.phase === 'collapse') collapse();
      }
      windowT = 0;
      if (sun && st.phase === 'p3') sun.lidDrop = 0.6;
      fishMode = st.phase === 'p3' ? 'columns' : 'hidden';
      nextBeat = 1.8;
    });
  };

  const collapse = (): void => {
    if (collapsing) return;
    collapsing = true;
    void w.narrative.play(
      'r08.collapse',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'look');
        fishMode = 'hidden';
        fish.hideAll();
        if (sun) {
          const s = sun;
          await cs.tween({ targets: s, rayLevel: 0, duration: 2200, ease: 'Sine.easeIn' });
          s.lidDrop = 1;
          cs.caption(CAPTIONS.sunFall, 5200);
          await cs.tween({ targets: s.c, y: 900, alpha: 0.2, duration: 2800, ease: 'Sine.easeIn' });
        }
        w.cameras.main.setBackgroundColor('#2d2338');
        await cs.wait(600);
        await new Promise<void>((res) => (cs.skipped ? res() : w.transform('root', res)));
        await cs.wait(900);
        cs.caption(CAPTIONS.sparrowFar, 3600);
        sparrow = new Sparrow(w, 1400, 300, DEPTH.actors + 3);
        await new Promise<void>((res) => (cs.skipped ? res() : sparrow!.flyTo(1080, 560, 2200, res)));
        await cs.wait(600);
      },
      () => {
        sun?.c.setVisible(false);
        const p = w.player;
        if (p.form !== 'root') {
          p.setForm('root');
          w.quest.setForm('root');
        }
        if (!sparrow) sparrow = new Sparrow(w, 1080, 560, DEPTH.actors + 3);
        st = { ...st, phase: 'done' };
        w.flag('r08.done', false);
        w.activateCheckpoint('r08_end', true);
        p.lock(false);
      },
    );
  };

  const intro = (): void => {
    void w.narrative.play(
      'r08.intro',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'idle');
        horse = new Horse(w, 60, GROUND, DEPTH.actors);
        await cs.wait(500);
        cs.caption('At, toprağa ve mor sıvıya geri döndü.', 3600);
        await new Promise<void>((res) => (cs.skipped ? res() : horse!.dissolve(res)));
        sun?.cough();
        cs.caption(CAPTIONS.sunEyes, 5600);
        await cs.wait(2600);
        await cs.talk([DIALOGUE.sunCall![0]!], ['gorti', 'sun']);
        p.lock(true, 'shout');
        app.audio.sfx('shout');
        w.shake(0.006, 600);
        await cs.talk([DIALOGUE.sunCall![1]!], ['gorti', 'sun']);
        p.lock(true, 'idle');
        cs.caption(CAPTIONS.resolve, 4200);
        await cs.wait(1500);
      },
      () => {
        horse?.destroy();
        horse = null;
        st = sunNext(st, 'introDone');
        w.flag('r08.intro', false);
        w.player.lock(false);
        nextBeat = 3;
      },
    );
  };

  return {
    setup() {
      buildStage();
      if (st.phase === 'intro') intro();
      if (st.phase === 'done') {
        sun?.c.setVisible(false);
        sparrow = new Sparrow(w, 1080, 560, DEPTH.actors + 3);
        w.cameras.main.setBackgroundColor('#2d2338');
      }
      w.onCleanup(() => {
        sun?.destroy();
        horse?.destroy();
        sparrow?.destroy();
        fish.destroy();
      });
    },
    onFixed(dt) {
      w.probeExtra.sun = { phase: st.phase, flowers: st.flowers, currents: st.currents, hits: st.hits, window: windowT > 0, fishMode };
      if (st.phase === 'intro' || st.phase === 'done' || collapsing || w.narrative.busy) return;
      if (windowT > 0) windowT -= dt;
      nextBeat -= dt;
      const p = w.player;
      if (st.phase === 'p1') {
        // Flowers wake as Gorti passes, or by themselves soon after.
        FLOWERS.forEach((fx, i) => {
          if (!flowerImgs[i]?.opened && Math.abs(fx - p.x) < 110) openFlower(i);
        });
        if (nextBeat <= 0 && st.phase === 'p1') {
          const i = flowerImgs.findIndex((f) => !f.opened);
          if (i >= 0) openFlower(i);
          nextBeat = 2.4;
        }
      } else if (st.phase === 'p2') {
        if (nextBeat <= 0) {
          raiseCurrent();
          nextBeat = 1.1;
        }
      } else if (st.phase === 'p3' && fishMode === 'columns' && nextBeat <= 0) {
        volley();
        nextBeat = 99;
      }
    },
    onUpdate(dt, time) {
      sun?.update(dt);
      sun?.lookAt(w.player.x, w.player.feetY - 80);
      sparrow?.update(dt);
      fish.update(dt);
      if (sun && st.phase !== 'done' && !collapsing) {
        coughIn -= dt / 1000;
        if (coughIn <= 0 && windowT <= 0) {
          sun.cough();
          coughIn = 4 + Math.random() * 2;
        }
        if (windowT <= 0 && st.phase !== 'p3') sun.lidDrop = 0.45;
      }
      ring?.setAlpha(windowT > 0 ? 0.5 + 0.4 * Math.sin(time / 110) : 0);
      // Currents
      columns.forEach((c, i) => {
        c.h += (c.target - c.h) * Math.min(1, dt / 350);
        c.col.setDisplaySize(46 + Math.sin(time / 150 + i) * 3, Math.max(1, c.h));
        const next = st.phase === 'p2' && st.currents === i;
        c.glow.setAlpha(next ? 0.45 + 0.35 * Math.sin(time / 160) : c.h > 10 ? 0.25 : 0);
      });
      // Fish formations
      const t = time / 1000;
      const n = fish.size;
      if (fishMode === 'school') {
        for (let i = 0; i < n; i++) {
          const a = t * 1.3 + (i / n) * Math.PI * 2;
          const cx = i % 2 ? FLOWERS[0]! : FLOWERS[1]!;
          fish.place(i, cx + Math.cos(a) * 70, GROUND - 120 + Math.sin(a * 1.4) * 30, a + Math.PI / 2);
        }
      } else if (fishMode === 'columns') {
        for (let i = 0; i < n; i++) {
          const c = CURRENTS[i % 3]!;
          const col = columns[i % 3]!;
          const y = GROUND - col.h + 20 + ((i * 37 + t * 60) % Math.max(40, col.h - 70));
          fish.place(i, c + Math.sin(t * 3 + i) * 14, y, -Math.PI / 2);
        }
      } else if (fishMode === 'gather') {
        const p = w.player;
        gatherK = Math.min(1, gatherK + dt / 1000 / SUN_TUNING.gatherTime);
        if (gatherK >= 1) release();
        for (let i = 0; i < n; i++) {
          const a = t * 4 + (i / n) * Math.PI * 2;
          const c = CURRENTS[i % 3]!;
          const tx = p.x + Math.cos(a) * 64;
          const ty = p.feetY - 90 + Math.sin(a) * 34;
          fish.place(i, c + (tx - c) * gatherK, GROUND - 200 + (ty - (GROUND - 200)) * gatherK, a + Math.PI / 2);
        }
      } else if (fishMode === 'hidden') fish.hideAll();
      void hasFrame;
    },
  };
}
