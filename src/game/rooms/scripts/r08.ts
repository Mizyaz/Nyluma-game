import * as Phaser from 'phaser';
import { app } from '../../App';
import { DEPTH, HULL_H, HULL_W } from '../../constants';
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

// Chapter III — the Sun encounter: evade slow broken rays, wake two flowers,
// raise three currents, then release the gathered fish during openings.

const GROUND = 640;
const SUN_X = 640;
const SUN_Y = 175;
const FLOWERS = [220, 1060];
const CURRENTS = [420, 640, 860];

interface Sweep {
  x: number;
  dir: 1 | -1;
  type: 'high' | 'low';
  phase: 'tele' | 'active';
  t: number;
}

export function r08(w: WorldScene): RoomScript {
  let st: SunState = sunStart({ p1: w.quest.has('r08.p1'), p2: w.quest.has('r08.p2'), done: w.quest.has('r08.done') });
  let sun: Face | null = null;
  let horse: Horse | null = null;
  let sparrow: Sparrow | null = null;
  const fish = new CreaturePool(w, 'fish', 12, DEPTH.actors + 2);
  const flowerImgs: { closed: Phaser.GameObjects.Image | null; open: Phaser.GameObjects.Image | null; opened: boolean }[] = [];
  const columns: { base: Phaser.GameObjects.Image | null; col: Phaser.GameObjects.Image; h: number; target: number; glow: Phaser.GameObjects.Image }[] = [];
  const rayG = w.add.graphics().setDepth(DEPTH.fx - 5);
  let ring: Phaser.GameObjects.Image | null = null;
  let sweep: Sweep | null = null;
  let sinceSweep = 0.8;
  let sweeps = 0;
  let windowT = 0;
  let firstType: 'high' | 'low' = 'high';
  let coughIn = 3;
  let fishMode: 'hidden' | 'school' | 'columns' | 'gather' | 'fly' = 'hidden';
  let gatherK = 0;
  let collapsing = false;
  const scale = (): number => w.encounterScale;

  const setObjectiveForPhase = (): void => {
    if (st.phase === 'done') w.setObjective('r08.leave', false);
    else if (st.phase === 'p3' || st.phase === 'collapse') w.setObjective('r08.p3', false);
    else if (st.phase === 'p2') w.setObjective('r08.p2', false);
    else w.setObjective('r08.p1', false);
  };

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
      w.setObjective('r08.p2');
    } else app.ui.hud.toast('Bir çiçek uyandı. Bir tane daha.', 2600);
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
      w.time.delayedCall(4400, () => app.ui.hud.caption(CAPTIONS.point, 3800));
      w.setObjective('r08.p3');
      sweeps = 0;
    }
  };

  const openWindow = (): void => {
    windowT = SUN_TUNING.openingWindow / scale();
    app.audio.sfx('crystal', { pitch: 0.8 });
    app.ui.hud.caption('Güneş gözlerini açtı: şimdi!', 2400);
    if (sun) sun.lidDrop = 0;
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
        if (st.phase === 'collapse') collapse();
        else app.ui.hud.toast(`İsabet: ${st.hits} / ${SUN_TUNING.hitsNeeded}`, 2600);
      } else if (st.phase === 'p3') {
        app.ui.hud.toast('Güneş gözlerini kapamıştı. Açılmasını bekle.', 3000);
      }
      windowT = 0;
      fishMode = st.phase === 'p3' ? 'columns' : 'hidden';
    });
  };

  const collapse = (): void => {
    if (collapsing) return;
    collapsing = true;
    sweep = null;
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
        w.setObjective('r08.leave');
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
        await cs.say([DIALOGUE.sunCall![0]!]);
        p.lock(true, 'shout');
        app.audio.sfx('shout');
        w.shake(0.006, 600);
        await cs.say([DIALOGUE.sunCall![1]!]);
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
        w.setObjective('r08.p1');
        sinceSweep = 0;
      },
    );
  };

  const rayRects = (s: Sweep): { x: number; y: number; w: number; h: number }[] => {
    const x = s.x - 22;
    if (s.type === 'high') return [{ x, y: 0, w: 44, h: 525 }];
    return [
      { x, y: 0, w: 44, h: 400 },
      { x, y: 585, w: 44, h: GROUND - 585 },
    ];
  };

  const drawRays = (time: number): void => {
    rayG.clear();
    const s = sweep;
    if (!s) return;
    const rects = rayRects(s);
    if (s.phase === 'tele') {
      const a = 0.25 + 0.2 * Math.sin(time / 90);
      for (const r of rects) {
        rayG.lineStyle(3, 0xf0d38e, a);
        rayG.strokeRect(r.x, r.y, r.w, r.h);
      }
      rayG.fillStyle(0xf0d38e, a * 0.6);
      rayG.fillTriangle(s.x + s.dir * 34, 600, s.x + s.dir * 14, 588, s.x + s.dir * 14, 612);
      return;
    }
    for (const r of rects) {
      rayG.fillStyle(0xd9ae54, 0.55);
      rayG.fillRect(r.x - 8, r.y, r.w + 16, r.h);
      rayG.fillStyle(0xf0d38e, 0.9);
      rayG.fillRect(r.x, r.y, r.w, r.h);
      rayG.fillStyle(0xffffff, 0.8);
      rayG.fillRect(r.x + 16, r.y, 12, r.h);
      // Jagged broken ends
      rayG.fillStyle(0xf0d38e, 0.9);
      rayG.fillTriangle(r.x, r.y + r.h, r.x + r.w, r.y + r.h, r.x + r.w * 0.3, r.y + r.h + 14);
      if (r.y > 0) rayG.fillTriangle(r.x, r.y, r.x + r.w, r.y, r.x + r.w * 0.7, r.y - 14);
    }
  };

  return {
    setup() {
      buildStage();
      setObjectiveForPhase();
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
    extraInteracts() {
      if (st.phase !== 'p2') return [];
      const x = CURRENTS[st.currents];
      if (x === undefined) return [];
      return [{ id: 'current', x, y: GROUND, r: 95, prompt: 'Akıntıyı yükselt' }];
    },
    onInteract(id) {
      if (id === 'current' && st.phase === 'p2') {
        raiseCurrent();
        return true;
      }
      return false;
    },
    onPulse(x, _y, r) {
      if (st.phase !== 'p1') return false;
      let any = false;
      FLOWERS.forEach((fx, i) => {
        if (!flowerImgs[i]?.opened && Math.abs(fx - x) < r + 45) {
          openFlower(i);
          any = true;
        }
      });
      return any;
    },
    pulseRelevant() {
      return st.phase === 'p1' && FLOWERS.some((fx, i) => !flowerImgs[i]?.opened && Math.abs(fx - w.player.x) < 200);
    },
    focusRelevant() {
      return st.phase === 'p3';
    },
    onFocusChange(active) {
      if (st.phase !== 'p3') return;
      if (active && (fishMode === 'columns' || fishMode === 'school')) {
        fishMode = 'gather';
        gatherK = 0;
      } else if (!active) release();
    },
    onRespawn() {
      st = sunNext(st, 'respawn');
      sweep = null;
      sinceSweep = 0;
      windowT = 0;
      if (st.phase === 'p3') fishMode = 'columns';
    },
    onFixed(dt) {
      w.probeExtra.sun = { phase: st.phase, flowers: st.flowers, currents: st.currents, hits: st.hits, window: windowT > 0, fishMode, sweep: sweep ? { ...sweep } : null };
      if (st.phase === 'intro' || st.phase === 'done' || collapsing) return;
      const k = scale();
      // Openings (phase 3) interrupt sweeps.
      if (windowT > 0) {
        windowT -= dt;
        if (windowT <= 0 && fishMode !== 'fly') {
          if (sun) sun.lidDrop = 0.6;
          sinceSweep = 0;
        }
        return;
      }
      sinceSweep += dt;
      if (!sweep && sinceSweep > SUN_TUNING.sweepGap / k) {
        if (st.phase === 'p3' && sweeps >= SUN_TUNING.openingEvery) {
          sweeps = 0;
          openWindow();
          return;
        }
        const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
        const type = sweeps === 0 && st.phase === 'p1' && firstType === 'high' ? 'high' : Math.random() < 0.5 ? 'high' : 'low';
        if (firstType === 'high' && type === 'high') firstType = 'low';
        sweep = { x: dir > 0 ? -30 : 1310, dir, type, phase: 'tele', t: 0 };
        app.audio.sfx('ray');
      }
      const s = sweep;
      if (!s) return;
      s.t += dt;
      if (s.phase === 'tele') {
        if (s.t > SUN_TUNING.telegraph / k) {
          s.phase = 'active';
          s.t = 0;
        }
        return;
      }
      s.x += s.dir * SUN_TUNING.sweepSpeed * k * dt;
      if (s.x < -60 || s.x > 1340) {
        sweep = null;
        sinceSweep = 0;
        sweeps++;
        return;
      }
      const p = w.player;
      const box = { x: p.x - HULL_W / 2, y: p.feetY - HULL_H, w: HULL_W, h: HULL_H };
      for (const r of rayRects(s)) {
        if (box.x < r.x + r.w && box.x + box.w > r.x && box.y < r.y + r.h && box.y + box.h > r.y) {
          w.damage(s.x);
          break;
        }
      }
    },
    onUpdate(dt, time) {
      sun?.update(dt);
      sun?.lookAt(w.player.x, w.player.feetY - 80);
      sparrow?.update(dt);
      fish.update(dt);
      drawRays(time);
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
        gatherK = Math.min(1, w.player.focus.heldFor / (SUN_TUNING.gatherTime / scale()));
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
