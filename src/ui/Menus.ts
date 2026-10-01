import { app, persistSettings } from '../engine/App';
import { CHAPTER_TITLES } from '../engine/state/GameState';
import { MEMORIES } from '../content/data/memories';
import { OPEN_ALL, SCENES, chapterTitle, type SceneEntry } from '../content/data/scenes';
import type { Settings, TextSpeed, TouchMode } from '../engine/state/types';
import { memoryArtUrl } from '../content/art/memoryArt';
import { focusables, h } from './dom';
import { ALLOWED_LICENSES } from '../music/library';

export interface MenuActions {
  newGame: () => void;
  continueGame: () => void;
  startChapter: (ch: number) => void;
  startScene: (scene: SceneEntry) => void;
  resume: () => void;
  quitToMenu: () => void;
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/**
 * Comic-cover lettering: every letter in its own box (so styles can set each
 * one by hand), words kept whole; assistive tech reads the plain text.
 */
export function comicTitle(text: string): HTMLElement {
  const letters = h('span', { 'aria-hidden': 'true' });
  text.split(' ').forEach((word, i) => {
    if (i) letters.append(' ');
    letters.append(h('span', { class: 'word' }, ...Array.from(word, (c) => h('span', { class: 'ch', text: c }))));
  });
  return h('h1', { class: 'title' }, h('span', { class: 'sr-only', text }), letters);
}

/** Semantic DOM menus with keyboard focus navigation and Escape = back. */
export class Menus {
  private root: HTMLElement;
  private stack: { el: HTMLElement; back: (() => void) | null }[] = [];
  actions: MenuActions | null = null;
  private noticeText = '';

  constructor(stage: HTMLElement) {
    this.root = h('div', { class: 'menus' });
    stage.append(this.root);
    app.input.onKey((e) => this.onKey(e));
  }

  get isOpen(): boolean {
    return this.stack.length > 0;
  }

  setNotice(text: string): void {
    this.noticeText = text;
  }

  private onKey(e: KeyboardEvent): boolean {
    if (!this.isOpen || app.input.context !== 'menu') return false;
    const top = this.stack[this.stack.length - 1]!;
    if (e.key === 'Escape') {
      if (top.back) {
        app.audio.sfx('uiBack');
        top.back();
      }
      return true;
    }
    const target = e.target as HTMLElement | null;
    const inRange = target instanceof HTMLInputElement && target.type === 'range';
    if (inRange && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return false;
    const dir = e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' ? 1 : e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' ? -1 : 0;
    const side = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    const step = dir || side;
    if (!step) return false;
    const list = focusables(top.el);
    if (!list.length) return true;
    const i = list.indexOf(document.activeElement as HTMLElement);
    const next = list[(i + step + list.length) % list.length] ?? list[0]!;
    next.focus();
    app.audio.sfx('ui', { vol: 0.4 });
    return true;
  }

  private push(el: HTMLElement, back: (() => void) | null): void {
    for (const s of this.stack) s.el.classList.add('hidden');
    this.stack.push({ el, back });
    this.root.append(el);
    if (app.input.context !== 'menu') app.input.pushContext('menu');
    requestAnimationFrame(() => focusables(el)[0]?.focus());
  }

  private pop(): void {
    const top = this.stack.pop();
    top?.el.remove();
    const prev = this.stack[this.stack.length - 1];
    if (prev) {
      prev.el.classList.remove('hidden');
      requestAnimationFrame(() => focusables(prev.el)[0]?.focus());
    }
  }

  /** Closes every menu screen and returns input to the caller's context. */
  closeAll(): void {
    while (this.stack.length) this.pop();
    if (app.input.context === 'menu') app.input.popContext('menu');
    (document.activeElement as HTMLElement | null)?.blur?.();
  }

  private btn(label: string, onClick: () => void, opts: { disabled?: boolean; cls?: string } = {}): HTMLButtonElement {
    const b = h('button', { class: `btn ${opts.cls ?? ''}`, type: 'button', disabled: opts.disabled });
    b.innerHTML = label;
    b.addEventListener('click', () => {
      app.audio.sfx('ui');
      onClick();
    });
    return b;
  }

  // ------------------------------------------------------------ main menu

  showMain(): void {
    this.closeAll();
    const hasSave = app.saveStatus === 'ok' && !!app.progress;
    const menu = h(
      'nav',
      { class: 'menu', 'aria-label': 'Ana menü' },
      this.btn('Yeni Oyun', () => this.onNewGame()),
      this.btn('Devam Et', () => this.actions?.continueGame(), { disabled: !hasSave }),
      this.btn('Bölümler', () => this.showChapters(() => this.pop())),
      this.btn('Anılar', () => this.showJournal(() => this.pop())),
      this.btn('Ayarlar', () => this.showSettings(() => this.pop())),
      this.btn('Katkıda Bulunanlar', () => this.showCredits(() => this.pop())),
    );
    const screen = h(
      'section',
      { class: 'screen title-screen', 'aria-label': 'Kristaller Dünyası' },
      h(
        'header',
        { class: 'title-block' },
        comicTitle('Kristaller Dünyası'),
        h('p', { class: 'subtitle', text: '14. Oda' }),
      ),
      menu,
      this.noticeText ? h('p', { class: 'notice', text: this.noticeText }) : null,
    );
    this.push(screen, null);
  }

  private onNewGame(): void {
    const hasSave = app.saveStatus === 'ok' && !!app.progress;
    if (!hasSave) {
      this.actions?.newGame();
      return;
    }
    this.confirm('Yeni bir oyun, mevcut kaydın yerine geçecek. Anılar ve açılan bölümler korunur. Başlansın mı?', () =>
      this.actions?.newGame(),
    );
  }

  confirm(text: string, yes: () => void, yesLabel = 'Evet', noLabel = 'Vazgeç'): void {
    const panel = h(
      'div',
      { class: 'panel', role: 'alertdialog', 'aria-label': 'Onay' },
      h('p', { text }),
      h(
        'div',
        { class: 'row' },
        this.btn(noLabel, () => this.pop(), { cls: 'small center' }),
        this.btn(yesLabel, () => {
          this.pop();
          yes();
        }, { cls: 'small center' }),
      ),
    );
    this.push(h('section', { class: 'screen dim' }, panel), () => this.pop());
  }

  // ------------------------------------------------------------ pause

  showPause(): void {
    this.closeAll();
    const panel = h(
      'div',
      { class: 'panel' },
      h('h2', { text: 'Duraklatıldı' }),
      h(
        'nav',
        { class: 'menu', 'aria-label': 'Duraklatma menüsü' },
        this.btn('Devam', () => this.actions?.resume()),
        this.btn('Anılar', () => this.showJournal(() => this.pop())),
        this.btn('Ayarlar', () => this.showSettings(() => this.pop())),
        this.btn('Ana Menü', () =>
          this.confirm('Ana menüye dönülsün mü? İlerleme son kontrol noktasından sürer.', () => this.actions?.quitToMenu()),
        ),
      ),
    );
    this.push(h('section', { class: 'screen dim' }, panel), () => this.actions?.resume());
  }

  // ------------------------------------------------------------ chapters

  showChapters(back: () => void): void {
    const reached = new Set(app.profile.chaptersReached);
    const list = h('div', { class: 'chapters' });
    for (const c of Object.keys(CHAPTER_TITLES).map(Number)) {
      const open = OPEN_ALL || reached.has(c) || app.profile.endingSeen;
      const b = this.btn(
        `${ROMAN[c]}. ${CHAPTER_TITLES[c]}<small>${open ? 'Bu bölümün başından oyna' : 'Henüz ulaşılmadı'}</small>`,
        () => this.onChapter(c),
        { disabled: !open },
      );
      list.append(b);
    }
    const row = h('div', { class: 'row', style: 'margin-top:1em' }, this.btn('Geri', back, { cls: 'small' }));
    if (OPEN_ALL) row.append(this.btn('Tüm sahneler', () => this.showScenes(() => this.pop()), { cls: 'small' }));
    const panel = h('div', { class: 'panel' }, h('h2', { text: 'Bölümler' }), list, row);
    this.push(h('section', { class: 'screen dim' }, panel), back);
  }

  /** Every checkpoint of every room, to start the story from there. */
  showScenes(back: () => void): void {
    const list = h('div', { class: 'scenes' });
    let chapter = 0;
    for (const sc of SCENES) {
      if (sc.chapter !== chapter) {
        chapter = sc.chapter;
        list.append(h('h3', { text: `${ROMAN[chapter]}. ${chapterTitle(chapter)}` }));
      }
      list.append(this.btn(sc.label, () => this.onScene(sc), { cls: 'small scene' }));
    }
    const panel = h('div', { class: 'panel' }, h('h2', { text: 'Tüm sahneler' }), list, h('div', { class: 'row', style: 'margin-top:1em' }, this.btn('Geri', back, { cls: 'small' })));
    this.push(h('section', { class: 'screen dim' }, panel), back);
  }

  private onScene(sc: SceneEntry): void {
    const hasSave = app.saveStatus === 'ok' && !!app.progress;
    if (!hasSave) {
      this.actions?.startScene(sc);
      return;
    }
    this.confirm(`${sc.label}: mevcut kaydın yerine geçecek. Anılar korunur. Devam edilsin mi?`, () => this.actions?.startScene(sc));
  }

  private onChapter(c: number): void {
    const hasSave = app.saveStatus === 'ok' && !!app.progress;
    if (!hasSave) {
      this.actions?.startChapter(c);
      return;
    }
    this.confirm(`${ROMAN[c]}. bölümün başı, mevcut kaydın yerine geçecek. Anılar korunur. Devam edilsin mi?`, () =>
      this.actions?.startChapter(c),
    );
  }

  // ------------------------------------------------------------ journal

  showJournal(back: () => void): void {
    const got = new Set(app.quest?.profile.memories ?? app.profile.memories);
    const grid = h('div', { class: 'journal' });
    for (const m of MEMORIES) {
      const have = OPEN_ALL || got.has(m.id);
      const card = h(
        'button',
        { class: `mem-card ${have ? '' : 'locked'}`, type: 'button', 'aria-label': have ? m.title : 'Bulunmamış anı', disabled: !have },
        have ? h('img', { src: memoryArtUrl(m.art), alt: '' }) : h('div', { class: 'blank', text: '?' }),
        h('div', { text: have ? m.title : '—' }),
      );
      if (have) {
        card.addEventListener('click', () => {
          app.audio.sfx('paper');
          this.showMemory(m.id);
        });
      }
      grid.append(card);
    }
    const panel = h(
      'div',
      { class: 'panel' },
      h('h2', { text: OPEN_ALL ? `Anılar — hepsi açık (bulunan ${got.size} / ${MEMORIES.length})` : `Anılar — ${got.size} / ${MEMORIES.length}` }),
      grid,
      h('div', { class: 'row', style: 'margin-top:1em' }, this.btn('Geri', back, { cls: 'small' })),
    );
    this.push(h('section', { class: 'screen dim' }, panel), back);
  }

  showMemory(id: string): void {
    const m = MEMORIES.find((x) => x.id === id);
    if (!m) return;
    const panel = h(
      'div',
      { class: 'panel' },
      h('h2', { text: m.title }),
      h('div', { class: 'mem-view' }, h('img', { src: memoryArtUrl(m.art), alt: '' }), h('p', { text: m.text })),
      h('div', { class: 'row', style: 'margin-top:1em' }, this.btn('Geri', () => this.pop(), { cls: 'small' })),
    );
    this.push(h('section', { class: 'screen dim' }, panel), () => this.pop());
  }

  // ------------------------------------------------------------ settings

  showSettings(back: () => void): void {
    const s = app.settings;
    const apply = (patch: Partial<Settings>): void => {
      Object.assign(app.settings, patch);
      app.audio.applySettings(app.settings);
      app.ui.applySettings(app.settings);
      persistSettings();
    };
    const slider = (label: string, key: 'master' | 'music' | 'sfx'): HTMLElement[] => {
      const id = `set-${key}`;
      const input = h('input', { id, type: 'range', min: '0', max: '100', step: '5', value: String(Math.round(s[key] * 100)) });
      input.addEventListener('input', () => apply({ [key]: Number(input.value) / 100 } as Partial<Settings>));
      input.addEventListener('change', () => app.audio.sfx('ui'));
      return [h('label', { for: id, text: label }), input];
    };
    const seg = <T extends string>(label: string, options: [T, string][], cur: T, onPick: (v: T) => void): HTMLElement[] => {
      const wrap = h('div', { class: 'seg', role: 'group', 'aria-label': label });
      for (const [v, text] of options) {
        const b = h('button', { type: 'button', 'aria-pressed': String(v === cur), text });
        b.addEventListener('click', () => {
          for (const x of wrap.querySelectorAll('button')) x.setAttribute('aria-pressed', 'false');
          b.setAttribute('aria-pressed', 'true');
          app.audio.sfx('ui');
          onPick(v);
        });
        wrap.append(b);
      }
      return [h('label', { text: label }), wrap];
    };
    const onoff = (label: string, cur: boolean, onPick: (v: boolean) => void): HTMLElement[] =>
      seg(label, [['on', 'Açık'], ['off', 'Kapalı']], cur ? 'on' : 'off', (v) => onPick(v === 'on'));

    const grid = h(
      'div',
      { class: 'settings' },
      ...slider('Ana ses', 'master'),
      ...slider('Müzik', 'music'),
      ...slider('Efektler', 'sfx'),
      ...onoff('Azaltılmış hareket', s.reducedMotion, (v) => apply({ reducedMotion: v })),
      ...onoff('Ekran sarsıntısı', s.screenShake, (v) => apply({ screenShake: v })),
      ...seg<TextSpeed>('Metin hızı', [['slow', 'Yavaş'], ['normal', 'Normal'], ['fast', 'Hızlı'], ['instant', 'Anında']], s.textSpeed, (v) => apply({ textSpeed: v })),
      ...seg<TouchMode>('Dokunmatik kontroller', [['auto', 'Otomatik'], ['on', 'Açık'], ['off', 'Kapalı']], s.touch, (v) => apply({ touch: v })),
    );
    const reset = this.btn('Kaydı sıfırla', () =>
      this.confirm('Tüm ilerleme, anılar ve açılan bölümler silinecek. Emin misiniz?', () => {
        app.save.resetAll();
        app.progress = null;
        app.saveStatus = 'empty';
        app.profile = { memories: [], endingSeen: false, chaptersReached: [1] };
        if (app.quest) app.quest.profile = { ...app.profile, memories: [], chaptersReached: [1] };
        this.toastInMenu('Kayıt sıfırlandı.');
      }, 'Sil'),
      { cls: 'small' },
    );
    const panel = h(
      'div',
      { class: 'panel' },
      h('h2', { text: 'Ayarlar' }),
      grid,
      h('div', { class: 'row', style: 'margin-top:1em' }, this.btn('Geri', back, { cls: 'small' }), reset),
    );
    this.push(h('section', { class: 'screen dim' }, panel), back);
  }

  private toastInMenu(text: string): void {
    const top = this.stack[this.stack.length - 1];
    if (!top) return;
    const n = h('p', { class: 'notice', text });
    top.el.append(n);
    window.setTimeout(() => n.remove(), 2600);
  }

  // ------------------------------------------------------------ credits

  showCredits(back: () => void): void {
    const panel = h(
      'div',
      { class: 'panel' },
      h('h2', { text: 'Katkıda Bulunanlar' }),
      creditsBlock(),
      h('div', { class: 'row', style: 'margin-top:1em' }, this.btn('Geri', back, { cls: 'small' })),
    );
    this.push(h('section', { class: 'screen dim' }, panel), back);
  }
}

export function creditsBlock(): HTMLElement {
  return h(
    'div',
    { class: 'credits' },
    h('h3', { text: 'Hikâye' }),
    h('div', { text: '“Kristaller Dünyası” özgün metni. Hikâyenin ve dünyanın tüm hakları yazarına aittir.' }),
    h('h3', { text: 'Oyun uyarlaması' }),
    h('div', { text: 'Tasarım, kod, çizimler, animasyon ve ses efektleri bu proje için özgün olarak üretildi: çizimler kodla yazılmış SVG’lerden, sesler Web Audio sentezinden.' }),
    h('h3', { text: 'Müzik' }),
    h('div', { text: 'Piyano müziği ve diyalog sahnelerindeki yaylılar oyun sırasında tarayıcıda bestelenir ve sentezlenir (oyunun müzik modülü); kayıt ya da örnek ses kullanılmaz.' }),
    ...app.audio.musicTracks().map((t) =>
      h(
        'div',
        {},
        `${t.title} — ${t.artist} (${ALLOWED_LICENSES[t.license]?.name ?? t.license}). Kaynak: `,
        /^https?:\/\//.test(t.source) ? h('a', { href: t.source, target: '_blank', rel: 'noopener', text: t.source }) : t.source,
      ),
    ),
    h('h3', { text: 'Açık kaynak' }),
    h(
      'div',
      {},
      'Phaser 3.90 oyun motoru (MIT Lisansı) ve içerdiği bileşenler. Ayrıntılar: ',
      h('a', { href: './THIRD_PARTY_NOTICES.md', target: '_blank', rel: 'noopener', text: 'THIRD_PARTY_NOTICES.md' }),
    ),
    h('h3', { text: 'Yazı tipleri' }),
    h('div', { text: 'Cihazınızın sistem yazı tipleri kullanılır; dışarıdan yazı tipi yüklenmez.' }),
    h('div', { style: 'margin-top:1em;font-style:italic', text: 'Oynadığınız için teşekkürler.' }),
  );
}

export { ROMAN };
