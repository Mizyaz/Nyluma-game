import * as Phaser from 'phaser';
import { app } from '../../engine/App';
import { DEPTH } from '../../engine/constants';
import { hex, P } from '../../render/2d/palette';
import { frameRef } from '../../render/2d/TextureFactory';
import { CAPTIONS, DIALOGUE } from '../data/dialogue.tr';
import { MEMORY_TEXT } from '../text/text';
import { Sparrow } from '../../gameplay/actors/Creatures';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt, addGlow } from './helpers';

// Chapter IV — the inner dormitory. Passing each memory station with the
// torch, Gorti sees the memory run backwards and the beds slide into a
// bridge; at the last one the giant fingers, the fruiting souls and the cut
// watch strap follow by themselves.
interface Station {
  title: string;
  fragments: { label: string }[];
}
const WARD = MEMORY_TEXT.reversed.stations;
const STATIONS: Record<string, { flag: string; x: number; def: Station }> = {
  st1: {
    flag: 'r10.s1',
    x: 760,
    def: {
      title: WARD.st1!.title,
      fragments: WARD.st1!.fragments.map((label) => ({ label })),
    },
  },
  st2: {
    flag: 'r10.s2',
    x: 1650,
    def: {
      title: WARD.st2!.title,
      fragments: WARD.st2!.fragments.map((label) => ({ label })),
    },
  },
  st3: {
    flag: 'r10.s3',
    x: 2500,
    def: {
      title: WARD.st3!.title,
      fragments: WARD.st3!.fragments.map((label) => ({ label })),
    },
  },
};

export function r10(w: WorldScene): RoomScript {
  const forms: Phaser.GameObjects.Image[] = [];
  let torchPhase = false;
  let torchT = 0;
  let light = 1;
  let torchGlow: Phaser.GameObjects.Image | null = null;
  const fingers: Phaser.GameObjects.Image[] = [];
  let sparrow: Sparrow | null = null;

  /** A memory runs backwards as Gorti passes its station. */
  const rewind = (id: string): void => {
    const st = STATIONS[id]!;
    if (w.quest.has(st.flag)) return;
    if (id === 'st3') {
      finale1();
      return;
    }
    const back = [...st.def.fragments].reverse().map((f) => f.label.toLocaleLowerCase('tr')).join(', ');
    app.audio.sfx('clock', { pitch: 0.8 });
    app.audio.sfx('rootGrow');
    app.ui.hud.caption(`${st.def.title}. ${MEMORY_TEXT.reversed.caption}: ${back}.`, 5200);
    w.player.emote('surprise', 900);
    w.flag(st.flag);
    w.activateCheckpoint(id === 'st1' ? 'r10_s1' : 'r10_s2', true);
  };

  const spawnForms = (): void => {
    const xs = [260, 520, 900, 1320, 1560, 2050, 2300, 2720, 2950];
    xs.forEach((x, i) => {
      const key = i % 3 === 1 ? 'form.point' : 'form.shadow';
      const im = addArt(w, key, x, 822, DEPTH.backProps + 2);
      if (!im) return;
      im.setAlpha(0).setFlipX(x > w.player.x);
      forms.push(im);
      w.tweens.add({ targets: im, alpha: 0.85, duration: 900, delay: i * 120 });
    });
  };

  const intro = (): void => {
    void w.narrative.play(
      'r10.intro',
      async (cs) => {
        w.player.lock(true, 'idle');
        cs.caption(CAPTIONS.drips, 4200);
        for (let i = 0; i < 6; i++) w.time.delayedCall(i * 520 + Math.random() * 200, () => app.audio.sfx('drip', { pitch: 0.8 + Math.random() * 0.5 }));
        await cs.wait(2600);
        await cs.talk(DIALOGUE.ward!, ['coward', 'forms', 'voice']);
        cs.caption(CAPTIONS.whoIs, 5200);
        await cs.wait(2200);
        cs.caption(CAPTIONS.formsLean, 4200);
        spawnForms();
        await cs.wait(2000);
        app.audio.sfx('clock');
        w.shake(0.002, 300);
        await cs.talk([DIALOGUE.late![0]!], ['coward', 'forms', 'voice']);
        for (const f of forms) f.setTint(0xd8c0c0);
        await cs.talk([DIALOGUE.late![1]!], ['coward', 'forms', 'voice']);
        w.player.lock(true, 'breath');
        await cs.talk([DIALOGUE.late![2]!], ['coward', 'forms', 'voice']);
      },
      () => {
        if (!forms.length) spawnForms();
        w.flag('r10.intro', false);
        w.player.lock(false);
      },
    );
  };

  const finale1 = (): void => {
    void w.narrative.play(
      'r10.finale1',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'torchUp');
        app.audio.sfx('torch');
        cs.caption(CAPTIONS.fingers, 5200);
        w.camTo(p.x, p.feetY - 160);
        for (const [dx, delay] of [[-260, 0], [250, 250], [-40, 500]] as [number, number][]) {
          const f = addArt(w, 'giant.finger', p.x + dx, p.feetY + 300, DEPTH.front - 2);
          if (!f) continue;
          f.setRotation(dx < -100 ? 0.25 : dx > 100 ? -0.25 : 0);
          fingers.push(f);
          w.tweens.add({ targets: f, y: p.feetY + 60, duration: 1400, delay, ease: 'Sine.easeOut' });
        }
        await cs.wait(2400);
        cs.caption(CAPTIONS.replay, 5200);
        await cs.wait(2600);
        cs.caption(CAPTIONS.tearsUp, 5200);
        const df = frameRef('fx.drop');
        const tears = w.add.particles(p.x, p.feetY - 70, df.atlas, {
          frame: df.frame,
          speedY: { min: -160, max: -90 },
          speedX: { min: -20, max: 20 },
          lifespan: 1200,
          scale: { start: 0.7, end: 0.3 },
          tint: hex('#9cc0ee'),
          frequency: 90,
          rotate: 180,
        });
        tears.setDepth(DEPTH.fx);
        await cs.wait(2600);
        tears.stop();
        w.time.delayedCall(1500, () => tears.destroy());
      },
      () => {
        w.flag('r10.s3', false);
        w.player.lock(true, 'torchUp');
        torchPhase = true;
        torchT = 0;
        light = 0.8;
      },
    );
  };

  const finale2 = (): void => {
    torchPhase = false;
    void w.narrative.play(
      'r10.finale2',
      async (cs) => {
        const p = w.player;
        cs.caption(CAPTIONS.gortiWhole, 5200);
        const legs = addArt(w, 'giant.legs', p.x + 60, p.feetY + 40, DEPTH.backProps + 5);
        legs?.setAlpha(0).setScale((legs.scale || 1) * 1.1);
        if (legs) await cs.tween({ targets: legs, alpha: 0.9, duration: 1400 });
        // Branch hair gathers the forms into fruiting boughs.
        forms.forEach((f, i) => {
          w.tweens.add({ targets: f, x: p.x - 200 + i * 50, y: p.feetY - 420 - (i % 3) * 30, scale: f.scale * 0.5, duration: 1600, delay: i * 90, ease: 'Sine.easeInOut' });
        });
        app.audio.sfx('chirp', { pitch: 0.7 });
        await cs.wait(1800);
        cs.caption(CAPTIONS.fruit, 5200);
        for (let i = 0; i < 9; i++) {
          const g = addGlow(w, p.x - 200 + i * 50, p.feetY - 380 - (i % 3) * 30, i % 2 ? P.crystalOrange : P.leafLight, 0.3, 0.9, DEPTH.fx);
          w.tweens.add({ targets: g, scale: 0.55, duration: 800, delay: i * 100, ease: 'Back.easeOut' });
        }
        await cs.wait(2800);
        cs.caption(CAPTIONS.noTakeover, 5200);
        await cs.wait(2600);
        sparrow = new Sparrow(w, p.x + 500, p.feetY - 300, DEPTH.front);
        await new Promise<void>((res) => (cs.skipped ? res() : sparrow!.flyTo(p.x - 10, p.feetY - 12, 1500, res)));
        cs.caption(CAPTIONS.cut, 5200);
        // A violet thread and the falling watch — symbolic, without gore.
        const ankle = p.rig.attachPoint('ankleL');
        const g = w.add.graphics().setDepth(DEPTH.fx);
        g.lineStyle(2, hex(P.violet), 1);
        g.lineBetween(ankle.x, ankle.y, ankle.x - 30, ankle.y + 26);
        const wf = frameRef('gorti.watch');
        const watch = w.add.image(ankle.x, ankle.y, wf.atlas, wf.frame).setScale(1.3 / wf.scale).setDepth(DEPTH.fx);
        p.rig.jointImage('watch')?.setVisible(false);
        app.audio.sfx('clock');
        await cs.tween({ targets: watch, y: p.feetY + 2, angle: 200, duration: 700, ease: 'Bounce.easeOut' });
        await cs.wait(1500);
        cs.caption(CAPTIONS.notLate, 5600);
        await cs.wait(3200);
      },
      () => {
        w.flag('r10.done', false);
        w.goToRoom('r11');
      },
    );
  };

  return {
    setup() {
      const tf = frameRef('fx.glow');
      torchGlow = w.add.image(0, 0, tf.atlas, tf.frame).setBlendMode(Phaser.BlendModes.ADD).setTint(hex(P.fire)).setScale(2.4).setAlpha(0.5).setDepth(DEPTH.player - 2);
      if (!w.quest.has('r10.intro')) intro();
      else spawnForms();
      if (w.quest.has('r10.s3') && !w.quest.has('r10.done')) {
        w.player.lock(true, 'torchUp');
        torchPhase = true;
        light = 0.8;
      }
      w.onCleanup(() => sparrow?.destroy());
    },
    onFixed(dt) {
      if (!torchPhase) {
        if (w.narrative.busy || !w.quest.has('r10.intro')) return;
        for (const [id, st] of Object.entries(STATIONS)) {
          if (!w.quest.has(st.flag) && w.player.x > st.x - 150) rewind(id);
        }
        return;
      }
      // Gorti holds the torch up; the light swells and settles by itself.
      torchT += dt;
      light = 0.6 + 0.4 * Math.abs(Math.sin(torchT * 1.3));
      if (torchT > 6) finale2();
    },
    onUpdate(_dt, time) {
      const p = w.player;
      const fl = p.rig.attachPoint('flame');
      if (torchGlow) torchGlow.setPosition(fl.x, fl.y).setAlpha((torchPhase ? light : 0.8) * (0.45 + 0.08 * Math.sin(time / 70)));
      const flameImg = p.rig.jointImage('flame');
      if (flameImg) flameImg.setAlpha(torchPhase ? 0.3 + 0.7 * light : 1);
      for (const f of forms) f.setFlipX(f.x > p.x);
      sparrow?.update(_dt);
    },
  };
}
