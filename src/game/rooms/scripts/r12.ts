import * as Phaser from 'phaser';
import { app, persist } from '../../App';
import { DEPTH } from '../../constants';
import { frameRef, hasFrame } from '../../art/TextureFactory';
import { portraitUrl } from '../../art/memoryArt';
import { CAPTIONS, DIALOGUE } from '../../data/dialogue.tr';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt } from './helpers';
import { h } from '../../../ui/dom';

// Chapter V — the empty table. The concluding paperwork says “Satıldı”.
const SEATS = [1990, 2080, 2170, 2260, 2340];

function docPortraits(): HTMLElement {
  const pics = ['root', 'amca', 'coward', 'mech', 'horse'];
  return h(
    'div',
    {},
    h('h4', { text: 'EK-3 · Devredilen Varlıkların Görüntüleri' }),
    h('div', { class: 'portraits' }, ...pics.map((k) => h('img', { src: portraitUrl(k), alt: '' }))),
    h('p', { text: 'Her görüntünün altında bir sayı var. Hiçbirinin altında bir ad yok.' }),
  );
}

function docRussian(): HTMLElement {
  return h(
    'div',
    {},
    h('p', { class: 'ru', text: 'ДОГОВОР О ПЕРЕДАЧЕ ПРАВ НА ОБЪЕКТ НЕДВИЖИМОСТИ' }),
    h('p', { class: 'gloss', text: '(Bir gayrimenkul üzerindeki hakların devrine ilişkin sözleşme)' }),
    h('p', { class: 'ru', text: 'Объект: комната № 14' }),
    h('p', { class: 'gloss', text: '(Taşınmaz: 14 numaralı oda)' }),
    h('p', { class: 'ru', text: 'Местонахождение: мир № 382' }),
    h('p', { class: 'gloss', text: '(Konumu: 382 numaralı dünya)' }),
    h('p', { class: 'ru', text: 'Площадь: не установлена' }),
    h('p', { class: 'gloss', text: '(Alanı: belirlenmemiş)' }),
  );
}

function docClause(): HTMLElement {
  return h(
    'div',
    {},
    h('h4', { text: 'ULUSAL KRİSTAL KOMİTESİ — HAK AKTARIMI ANLAŞMASI' }),
    h('p', { text: 'Madde 7. Devreden, bünyesinde taşıdığı tüm ruhların, anıların ve bunlardan doğacak her türlü meyvenin sahipliğini, işbu anlaşmanın damgalandığı andan itibaren Komite’ye devreder.' }),
    h('p', { text: 'Madde 8. Devredenin toplantıda hazır bulunmaması, devrin geçerliliğini etkilemez.' }),
    h('p', { class: 'gloss', text: 'Devreden: Gorti Evaskinan · İmza yeri boş bırakılmıştır.' }),
  );
}

function docFinal(): HTMLElement {
  return h(
    'div',
    { style: 'text-align:center' },
    h('h4', { text: 'SON SAYFA' }),
    h('p', { text: 'Devredilen: bünyedeki tüm ruhlar.' }),
    h('p', { text: 'Devralan: Ulusal Kristal Komitesi.' }),
    h('div', { class: 'stamp', text: 'SATILDI' }),
  );
}

export function r12(w: WorldScene): RoomScript {
  const attendees: Phaser.GameObjects.Image[] = [];
  const chairs: Phaser.GameObjects.Image[] = [];
  let watch: Phaser.GameObjects.Image | null = null;

  let ending = false;

  const intercut = (): void => {
    void w.narrative.play(
      'r12.intercut',
      async (cs) => {
        const p = w.player;
        p.lock(true, 'idle');
        p.setVisible(false);
        w.camTo(2150, 500);
        w.cameras.main.centerOn(2150, 500);
        await cs.wait(800);
        app.audio.sfx('stamp');
        w.shake(0.012, 260);
        w.flash(0xd8ceba, 0.3);
        await cs.wait(900);
        attendees.forEach((a) => a.setFlipX(false));
        app.audio.sfx('paper', { vol: 0.5 });
        await cs.say(DIALOGUE.table!);
        // They rise and leave; only documents and chairs remain.
        for (const a of attendees) {
          const f = frameRef('attendee.stand');
          if (hasFrame('attendee.stand')) a.setTexture(f.atlas, f.frame).setOrigin(f.px / f.w, f.py / f.h);
        }
        await Promise.all(attendees.map((a, i) => cs.tween({ targets: a, x: 2800 + i * 40, alpha: 0, duration: 2200, delay: i * 180, ease: 'Sine.easeIn' })));
        await cs.wait(500);
      },
      () => {
        for (const a of attendees) a.setVisible(false);
        w.flag('r12.intercut', false);
        const p = w.player;
        p.setVisible(true);
        p.lock(false);
        w.camTo(null);
        app.ui.hud.caption(CAPTIONS.hallway, 5200);
      },
    );
  };

  const openDoc = (flag: string, content: HTMLElement): void => {
    w.player.lock(true, 'interact');
    void app.ui.doc.open(content).then(() => {
      w.player.lock(false);
      w.flag(flag, false);
    });
  };

  /** The door opens as Gorti reaches it. */
  const openDoor = (): void => {
    app.audio.sfx('door');
    w.flag('r12.door');
    w.activateCheckpoint('r12_room', true);
    w.time.delayedCall(900, () => app.ui.hud.caption(CAPTIONS.papersOnly, 4200));
  };

  /** At the end of the table the last page turns by itself. */
  const finalPage = (): void => {
    ending = true;
    w.player.lock(true, 'interact');
    void app.ui.doc.open(docClause(), 'Sayfayı çevir').then(() => {
      app.audio.sfx('paper');
      void app.ui.doc.open(docFinal(), 'Bırak').then(() => {
        void w.narrative.play(
          'r12.final',
          async (cs) => {
            app.audio.sfx('stamp');
            w.shake(0.006, 200);
            cs.caption(CAPTIONS.finalLine, 7000);
            await cs.wait(4200);
          },
          () => {
            w.flag('r12.sold', false);
            w.quest.markEnding();
            persist();
            w.cameras.main.fadeOut(1400, 15, 13, 24);
            w.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => w.scene.start('ending'));
          },
          false,
        );
      });
    });
  };

  return {
    setup() {
      for (const [i, x] of SEATS.entries()) {
        const ch = addArt(w, 'prop.chair', x, 682, DEPTH.props - 2);
        if (ch) {
          ch.setFlipX(i % 2 === 1);
          chairs.push(ch);
        }
      }
      if (!w.quest.has('r12.intercut')) {
        for (const [i, x] of SEATS.entries()) {
          const a = addArt(w, 'attendee.sit', x, 682, DEPTH.props - 1);
          if (a) {
            a.setFlipX(i % 2 === 1);
            attendees.push(a);
          }
        }
        intercut();
      }
      // The fallen watch lies in the hallway, never explained.
      if (hasFrame('gorti.watch')) {
        const f = frameRef('gorti.watch');
        watch = w.add.image(1180, 678, f.atlas, f.frame).setScale(1.4 / f.scale).setAngle(160).setDepth(DEPTH.props);
      }
      w.onCleanup(() => watch?.destroy());
    },
    onInteract(id) {
      if (id === 'portraits') {
        openDoc('r12.doc1', docPortraits());
        return true;
      }
      if (id === 'russian') {
        openDoc('r12.doc2', docRussian());
        return true;
      }
      if (id === 'clause') {
        openDoc('r12.doc3', docClause());
        return true;
      }
      return false;
    },
    onFixed() {
      const q = w.quest;
      const p = w.player;
      if (ending || w.narrative.busy || !q.has('r12.intercut') || app.input.context !== 'gameplay' || !p.controllable) return;
      if (!q.has('r12.door')) {
        if (p.x > 1440) openDoor();
      } else if (!q.has('r12.sold') && p.x > 2400) finalPage();
    },
    onUpdate(_dt, time) {
      if (watch) watch.setAngle(160 + Math.sin(time / 1000) * 0.5);
    },
  };
}
