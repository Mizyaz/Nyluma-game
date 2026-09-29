import * as Phaser from 'phaser';
import { app } from '../../App';
import { DEPTH } from '../../constants';
import { hex, P } from '../../art/palette';
import { frameRef, hasFrame } from '../../art/TextureFactory';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import { Horse } from '../../entities/Horse';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt, addGlow, bloomAt } from './helpers';

// Chapter II — “Yalanlar!”: the forest answers and Gorti swells into the
// unstable giant. The swollen knots calm as Gorti walks past them; then the
// purple horse forms at the far end and Gorti rides away on it.
const KNOTS = [
  { id: 'k1', x: 1000, y: 900 },
  { id: 'k2', x: 1780, y: 740 },
  { id: 'k3', x: 2450, y: 900 },
];
const HORSE = { x: 2780, y: 900 };

export function r06(w: WorldScene): RoomScript {
  const imgs = new Map<string, { swollen: Phaser.GameObjects.Image | null; calm: Phaser.GameObjects.Image | null; glow: Phaser.GameObjects.Image }>();
  let horse: Horse | null = null;
  let drips: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  const refreshKnots = (): void => {
    for (const k of KNOTS) {
      const v = imgs.get(k.id);
      if (!v) continue;
      const on = w.quest.has('r06.shout');
      const calm = w.quest.has(`r06.${k.id}`);
      v.swollen?.setVisible(on && !calm);
      v.calm?.setVisible(on && calm);
      v.glow.setVisible(on && !calm);
    }
  };

  const spawnHorse = (immediate: boolean): void => {
    if (horse) return;
    horse = new Horse(w, HORSE.x, HORSE.y, DEPTH.actors);
    horse.setFacing(-1);
    if (immediate) horse.play('kneel');
  };

  const shoutScene = (): void => {
    void w.narrative.play(
      'r06.shout',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'breath');
        w.camTo(620, 760);
        cs.caption(CAPTIONS.holdBreath, 3200);
        await cs.wait(1600);
        await cs.say(DIALOGUE.shout!.slice(0, 2));
        p.lock(true, 'shout');
        app.audio.sfx('shout');
        w.shake(0.008, 900);
        await cs.say(DIALOGUE.shout!.slice(2));
        app.audio.sfx('rumble');
        w.shake(0.006, 1400);
        cs.caption(CAPTIONS.shake, 5200);
        for (let i = 0; i < 10; i++) w.time.delayedCall(i * 120, () => bloomAt(w, 300 + i * 260, 900, 4));
        await cs.wait(2000);
        cs.caption(CAPTIONS.flowersWake, 4600);
        await cs.wait(1800);
        // The unstable giant: enlarged silhouette, fluid dripping.
        cs.caption(CAPTIONS.grow, 5000);
        p.lock(true, 'transform');
        drips?.start();
        const cam = w.cameras.main;
        const prog = { s: 1 };
        await cs.tween({
          targets: prog,
          s: 2.5,
          duration: 1800,
          ease: 'Sine.easeInOut',
          onUpdate: () => {
            p.rig.scale = prog.s;
          },
        });
        if (!app.settings.reducedMotion) cam.zoomTo(w.baseZoom * 0.8, 900);
        await cs.wait(900);
        cs.caption(CAPTIONS.control, 4600);
        w.shake(0.005, 1200);
        await cs.wait(2200);
        p.lock(true, 'collapse');
        await cs.tween({ targets: prog, s: 1, duration: 900, ease: 'Cubic.easeIn', onUpdate: () => (p.rig.scale = prog.s) });
        drips?.stop();
        await new Promise<void>((res) => (cs.skipped ? res() : w.transform('root', res)));
        cam.zoomTo(w.baseZoom, 700);
        cs.caption(CAPTIONS.onlyRise, 4600);
        await cs.wait(1200);
      },
      () => {
        const p = w.player;
        p.rig.scale = 1;
        drips?.stop();
        w.cameras.main.setZoom(w.baseZoom);
        if (p.form !== 'root') {
          p.setForm('root');
          w.quest.setForm('root');
        }
        w.flag('r06.shout', false);
        refreshKnots();
        w.camTo(null);
        p.lock(false);
        w.activateCheckpoint('r06_knots', true);
      },
    );
  };

  const horseScene = (): void => {
    void w.narrative.play(
      'r06.horse',
      async (cs) => {
        w.player.lock(true, 'look');
        w.camTo(HORSE.x - 120, HORSE.y - 100);
        await cs.wait(600);
        const g = addGlow(w, HORSE.x, HORSE.y - 40, P.violet, 0.4, 0.8, DEPTH.fx);
        await cs.tween({ targets: g, scale: 3.2, alpha: 0.4, duration: 1600 });
        cs.caption(CAPTIONS.horseBorn, 5000);
        spawnHorse(false);
        horse!.emerge();
        await cs.wait(2400);
        g.destroy();
        horse!.play('rear');
        app.audio.sfx('neigh');
        await cs.wait(900);
        horse!.play('idle');
        await cs.say([DIALOGUE.horse![0]!]);
        await cs.say(DIALOGUE.horse!.slice(1));
        horse!.play('kneel');
        await cs.wait(900);
      },
      () => {
        spawnHorse(true);
        horse!.rig.offY = 0;
        horse!.rig.setAlpha(1);
        horse!.play('kneel');
        w.flag('r06.horse', false);
        w.camTo(null);
        w.player.lock(false);
      },
    );
  };

  const mountScene = (): void => {
    void w.narrative.play(
      'r06.mount',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'idle');
        await cs.tween({ targets: p.rig.container, alpha: 0, duration: 400 });
        horse!.setRider('human');
        horse!.play('idle');
        app.audio.sfx('neigh');
        await cs.wait(600);
        horse!.play('rear');
        await cs.wait(1200);
      },
      () => {
        w.flag('r06.done', false);
        w.quest.setForm('human');
        w.goToRoom('r07');
      },
    );
  };

  return {
    setup() {
      for (const k of KNOTS) {
        const swollen = addArt(w, 'prop.knot', k.x, k.y + 2, DEPTH.props + 2);
        const calm = addArt(w, 'prop.knot.calm', k.x, k.y + 2, DEPTH.props + 2);
        const glow = addGlow(w, k.x, k.y - 40, P.violet, 1.1, 0.35, DEPTH.props + 1);
        imgs.set(k.id, { swollen, calm, glow });
      }
      refreshKnots();
      if (hasFrame('fx.drop')) {
        const f = frameRef('fx.drop');
        drips = w.add.particles(0, 0, f.atlas, {
          frame: f.frame,
          follow: w.player.zone,
          followOffset: { x: 0, y: -120 },
          x: { min: -80, max: 80 },
          speedY: { min: 60, max: 160 },
          speedX: { min: -40, max: 40 },
          gravityY: 500,
          lifespan: 1200,
          scale: { start: 0.8, end: 0.3 },
          tint: hex(P.violet),
          frequency: 45,
          emitting: false,
        });
        drips.setDepth(DEPTH.fx);
      }
      if (w.quest.has('r06.horse')) spawnHorse(true);
      w.onCleanup(() => horse?.destroy());
    },
    onTrigger(id) {
      if (id === 'shout' && !w.quest.has('r06.shout')) shoutScene();
    },
    onFixed() {
      const p = w.player;
      if (!w.quest.has('r06.shout') || w.narrative.busy) return;
      // The knots calm as Gorti passes.
      for (const k of KNOTS) {
        if (w.quest.has(`r06.${k.id}`) || Math.hypot(p.x - k.x, p.feetY - k.y) > 120) continue;
        w.flag(`r06.${k.id}`);
        app.audio.sfx('bloom');
        refreshKnots();
        for (let i = 0; i < 5; i++) w.time.delayedCall(i * 110, () => bloomAt(w, k.x - 200 + i * 100, k.y, 5));
        w.flash(0x9459d8, 0.18);
        app.ui.hud.caption(CAPTIONS.knotCalm, 3600);
      }
      // Past the last knot, the horse forms ahead.
      if (!w.quest.has('r06.horse') && p.x > 2380) {
        for (const k of KNOTS) w.flag(`r06.${k.id}`, false);
        refreshKnots();
        w.activateCheckpoint('r06_horse', true);
        horseScene();
      }
      if (horse && w.quest.has('r06.horse') && !w.quest.has('r06.done') && Math.abs(p.x - HORSE.x) < 90) mountScene();
    },
    onUpdate(dt, time) {
      horse?.update(dt);
      for (const k of KNOTS) {
        const v = imgs.get(k.id);
        if (v?.swollen?.visible) {
          const f = frameRef('prop.knot');
          const pulse = 1 + 0.05 * Math.sin(time / 180 + k.x);
          v.swollen.setScale((1 / f.scale) * pulse);
          v.glow.setAlpha(0.3 + 0.2 * Math.sin(time / 200 + k.x));
        }
      }
    },
  };
}
