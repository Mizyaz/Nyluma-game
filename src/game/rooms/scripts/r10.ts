import * as Phaser from 'phaser';
import { app } from '../../App';
import { DEPTH } from '../../constants';
import { hex, P } from '../../art/palette';
import { frameRef } from '../../art/TextureFactory';
import { fragmentArtUrl } from '../../art/memoryArt';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import { Sparrow } from '../../entities/Creatures';
import type { StationDef } from '../../../ui/PuzzlePanel';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt, addGlow, RingGauge } from './helpers';

// Chapter IV — the inner dormitory: carry the torch across three memory
// stations and reverse each memory; then the giant fingers, the fruiting
// souls and the cut watch strap.
const STATIONS: Record<string, { flag: string; def: StationDef }> = {
  st1: {
    flag: 'r10.s1',
    def: {
      title: 'Birinci anı: Geç kalmak',
      sub: 'İleriye akarken: çalan saat, koşan ayaklar, kapanan kapı.',
      fragments: [
        { art: fragmentArtUrl('alarm'), label: 'Çalan saat' },
        { art: fragmentArtUrl('shoes'), label: 'Koşan ayaklar' },
        { art: fragmentArtUrl('closedoor'), label: 'Kapanan kapı' },
      ],
    },
  },
  st2: {
    flag: 'r10.s2',
    def: {
      title: 'İkinci anı: Emanet ışık',
      sub: 'İleriye akarken: uzatılan mum, aydınlanan oda, büyüyen gölge.',
      fragments: [
        { art: fragmentArtUrl('candle'), label: 'Uzatılan mum' },
        { art: fragmentArtUrl('room'), label: 'Aydınlanan oda' },
        { art: fragmentArtUrl('shadow'), label: 'Büyüyen gölge' },
      ],
    },
  },
  st3: {
    flag: 'r10.s3',
    def: {
      title: 'Üçüncü anı: Gözyaşı',
      sub: 'İleriye akarken: açan çiçek, solan çiçek, düşen damla.',
      fragments: [
        { art: fragmentArtUrl('bloom'), label: 'Açan çiçek' },
        { art: fragmentArtUrl('wilt'), label: 'Solan çiçek' },
        { art: fragmentArtUrl('rain'), label: 'Düşen damla' },
      ],
    },
  },
};

export function r10(w: WorldScene): RoomScript {
  const forms: Phaser.GameObjects.Image[] = [];
  let torchPhase = false;
  let torchT = 0;
  let light = 1;
  const ring = new RingGauge(w, 0xf0b458);
  let torchGlow: Phaser.GameObjects.Image | null = null;
  const fingers: Phaser.GameObjects.Image[] = [];
  let sparrow: Sparrow | null = null;

  const pickObjective = (): void => {
    w.setObjective(torchPhase ? 'r10.torch' : 'r10.stations', false);
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
        await cs.say(DIALOGUE.ward!);
        cs.caption(CAPTIONS.whoIs, 5200);
        await cs.wait(2200);
        cs.caption(CAPTIONS.formsLean, 4200);
        spawnForms();
        await cs.wait(2000);
        app.audio.sfx('clock');
        w.shake(0.002, 300);
        await cs.say([DIALOGUE.late![0]!]);
        for (const f of forms) f.setTint(0xd8c0c0);
        await cs.say([DIALOGUE.late![1]!]);
        w.player.lock(true, 'breath');
        await cs.say([DIALOGUE.late![2]!]);
      },
      () => {
        if (!forms.length) spawnForms();
        w.flag('r10.intro', false);
        w.player.lock(false);
        pickObjective();
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
        w.setObjective('r10.torch');
        app.ui.hud.toast('E: meşaleyi yukarıda tut', 3000);
      },
    );
  };

  const finale2 = (): void => {
    torchPhase = false;
    ring.draw(0, 0, 0, 0, false);
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
      pickObjective();
      const tf = frameRef('fx.glow');
      torchGlow = w.add.image(0, 0, tf.atlas, tf.frame).setBlendMode(Phaser.BlendModes.ADD).setTint(hex(P.fire)).setScale(2.4).setAlpha(0.5).setDepth(DEPTH.player - 2);
      if (!w.quest.has('r10.intro')) intro();
      else spawnForms();
      if (w.quest.has('r10.s3') && !w.quest.has('r10.done')) {
        w.player.lock(true, 'torchUp');
        torchPhase = true;
        light = 0.8;
        pickObjective();
      }
      w.onCleanup(() => {
        ring.destroy();
        sparrow?.destroy();
      });
    },
    onInteract(id) {
      const st = STATIONS[id];
      if (!st) return false;
      if (w.quest.has(st.flag)) return true;
      w.player.lock(true, 'breath');
      void app.ui.puzzle.open(st.def).then((ok) => {
        w.player.lock(false);
        if (!ok) return;
        app.audio.sfx('rootGrow');
        w.flag(st.flag);
        if (id === 'st1') {
          w.activateCheckpoint('r10_s1', true);
          app.ui.hud.toast('Yataklar kayarak bir köprü kurdu.', 3200);
        } else if (id === 'st2') {
          w.activateCheckpoint('r10_s2', true);
          app.ui.hud.toast('Yataklar kayarak bir köprü kurdu.', 3200);
        } else finale1();
      });
      return true;
    },
    onFixed(dt) {
      if (!torchPhase) return;
      torchT += dt;
      light = Math.max(0.2, light - dt * 0.16);
      if (app.input.context === 'gameplay' && (app.input.consume('action') || app.input.held('action'))) light = Math.min(1, light + dt * 1.4 + 0.02);
      if (torchT > 9) finale2();
    },
    onUpdate(_dt, time) {
      const p = w.player;
      const fl = p.rig.attachPoint('flame');
      if (torchGlow) torchGlow.setPosition(fl.x, fl.y).setAlpha((torchPhase ? light : 0.8) * (0.45 + 0.08 * Math.sin(time / 70)));
      const flameImg = p.rig.jointImage('flame');
      if (flameImg) flameImg.setAlpha(torchPhase ? 0.3 + 0.7 * light : 1);
      if (torchPhase) ring.draw(fl.x, fl.y, 34, Math.min(1, torchT / 9), true);
      for (const f of forms) f.setFlipX(f.x > p.x);
      sparrow?.update(_dt);
    },
  };
}
