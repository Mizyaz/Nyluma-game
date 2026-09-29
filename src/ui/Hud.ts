import { h, ICONS, crystalMark } from './dom';
import { controlText } from './controlText';
import { fullscreenAvailable, isFullscreen, toggleFullscreen } from './fullscreen';

export interface PromptItem {
  key: string;
  label: string;
}

/** In-game heads-up display (DOM overlay). */
export class Hud {
  readonly el: HTMLElement;
  private coh: HTMLElement;
  private focusEl: HTMLElement;
  private focusFill: HTMLElement;
  private focusLabel: HTMLElement;
  private promptEl: HTMLElement;
  private objText: HTMLElement;
  private hintBtn: HTMLButtonElement;
  private captionEl: HTMLElement;
  private areaEl: HTMLElement;
  private toastEl: HTMLElement;
  private skipEl: HTMLElement;
  /** Objective + hint: top right in landscape, in the text column in portrait. */
  private objBox: HTMLElement;
  /** Toast, prompts and captions (subtitles) stacked in one column. */
  private stackEl: HTMLElement;
  private objTimer = 0;
  private captionTimer = 0;
  private toastTimer = 0;
  private areaTimer = 0;
  private lastCoh = '';
  private lastPrompt = '';
  private hintText = '';
  private hintShown = false;
  onPause: () => void = () => undefined;
  onHint: (text: string) => void = () => undefined;

  constructor(stage: HTMLElement) {
    this.coh = h('div', { class: 'coherence', 'aria-label': 'Bütünlük' });
    this.focusFill = h('i');
    this.focusEl = h('div', { class: 'focus-meter', 'aria-hidden': 'true' }, this.focusFill);
    this.focusLabel = h('div', { class: 'focus-label', text: 'Nefes' });
    this.objText = h('div', { class: 'objective', role: 'status' });
    this.hintBtn = h('button', { class: 'btn small hint-btn hidden', type: 'button', text: 'İpucu' });
    this.hintBtn.addEventListener('click', () => {
      this.onHint(this.hintText);
      this.hintBtn.blur();
    });
    const pauseBtn = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Duraklat', html: ICONS.pause });
    pauseBtn.addEventListener('click', () => {
      pauseBtn.blur();
      this.onPause();
    });
    const objBtn = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Hedefi göster', html: ICONS.objective });
    objBtn.addEventListener('click', () => {
      objBtn.blur();
      this.flashObjective(6000);
    });
    const fsBtn = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Tam ekran', html: ICONS.fullscreen });
    fsBtn.addEventListener('click', () => {
      fsBtn.blur();
      void toggleFullscreen();
    });
    if (!fullscreenAvailable()) fsBtn.classList.add('hidden');
    document.addEventListener('fullscreenchange', () => fsBtn.setAttribute('aria-pressed', String(isFullscreen())));
    const right = h('div', { class: 'hud-right' }, pauseBtn, objBtn, fsBtn);
    this.objBox = h('div', { class: 'hud-obj' }, this.objText, this.hintBtn);
    this.promptEl = h('div', { class: 'prompt', 'aria-live': 'polite' });
    this.captionEl = h('div', { class: 'caption', 'aria-live': 'polite' });
    this.areaEl = h('div', { class: 'area-title' });
    this.toastEl = h('div', { class: 'toast', role: 'status' });
    this.skipEl = h('div', { class: 'skip-hint hidden' });
    this.stackEl = h('div', { class: 'hud-stack' }, this.toastEl, this.promptEl, this.captionEl);
    this.el = h('div', { class: 'hud hidden' }, this.coh, this.focusEl, this.focusLabel, right, this.objBox, this.stackEl, this.areaEl, this.skipEl);
    stage.append(this.el);
  }

  show(on: boolean): void {
    this.el.classList.toggle('hidden', !on);
  }

  /** Portrait keeps the objective in the text column under the game view. */
  setLayout(portrait: boolean): void {
    if (portrait) this.stackEl.append(this.objBox);
    else this.el.insertBefore(this.objBox, this.stackEl);
  }

  setCoherence(halves: number, maxHalves: number): void {
    const key = `${halves}/${maxHalves}`;
    if (key === this.lastCoh) return;
    this.lastCoh = key;
    this.coh.innerHTML = '';
    const segs = maxHalves / 2;
    for (let i = 0; i < segs; i++) {
      const fill = halves >= (i + 1) * 2 ? 1 : halves === i * 2 + 1 ? 0.5 : 0;
      this.coh.append(h('div', { class: 'seg-mark', html: crystalMark(fill) }));
    }
    this.coh.setAttribute('aria-label', `Bütünlük: ${Math.ceil(halves / 2)} / ${segs}`);
  }

  setFocus(frac: number, active: boolean, visible: boolean): void {
    this.focusEl.classList.toggle('hidden', !visible);
    this.focusLabel.classList.toggle('hidden', !visible);
    this.focusFill.style.transform = `scaleX(${Math.max(0, Math.min(1, frac)).toFixed(3)})`;
    this.focusEl.classList.toggle('active', active);
  }

  setPrompts(items: PromptItem[]): void {
    const key = items.map((i) => i.key + i.label).join('|');
    if (key === this.lastPrompt) return;
    this.lastPrompt = key;
    this.promptEl.innerHTML = '';
    for (const it of items) {
      this.promptEl.append(h('span', {}, h('b', { class: 'key', text: it.key }), it.label));
    }
  }

  setObjective(text: string, flash = true): void {
    this.objText.innerHTML = '';
    this.objText.append(h('b', { text: 'Hedef' }), text);
    if (flash) this.flashObjective(5000);
  }

  flashObjective(ms: number): void {
    this.objTimer = ms;
    this.objText.classList.add('show');
  }

  setHint(text: string, available: boolean): void {
    this.hintText = text;
    if (available !== this.hintShown) {
      this.hintShown = available;
      this.hintBtn.classList.toggle('hidden', !available);
    }
  }

  caption(text: string, ms = 4200): void {
    this.captionEl.textContent = controlText(text);
    this.captionEl.classList.add('show');
    this.captionTimer = ms;
  }

  clearCaption(): void {
    this.captionTimer = 0;
    this.captionEl.classList.remove('show');
  }

  areaTitle(small: string, title: string, ms = 3200): void {
    this.areaEl.innerHTML = '';
    this.areaEl.append(h('small', { text: small }), h('span', { text: title }));
    this.areaEl.classList.add('show');
    this.areaTimer = ms;
  }

  toast(text: string, ms = 3200): void {
    this.toastEl.textContent = controlText(text);
    this.toastEl.classList.add('show');
    this.toastTimer = ms;
  }

  setSkip(progress: number | null, label = 'Geçmek için basılı tut'): void {
    if (progress === null) {
      this.skipEl.classList.add('hidden');
      return;
    }
    if (this.skipEl.classList.contains('hidden')) {
      this.skipEl.innerHTML = '';
      this.skipEl.append(h('div', { class: 'ring' }), h('span', { text: label }));
      this.skipEl.classList.remove('hidden');
    }
    (this.skipEl.firstElementChild as HTMLElement).style.setProperty('--p', progress.toFixed(3));
  }

  tick(dt: number): void {
    if (this.objTimer > 0) {
      this.objTimer -= dt;
      if (this.objTimer <= 0) this.objText.classList.remove('show');
    }
    if (this.captionTimer > 0) {
      this.captionTimer -= dt;
      if (this.captionTimer <= 0) this.captionEl.classList.remove('show');
    }
    if (this.toastTimer > 0) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) this.toastEl.classList.remove('show');
    }
    if (this.areaTimer > 0) {
      this.areaTimer -= dt;
      if (this.areaTimer <= 0) this.areaEl.classList.remove('show');
    }
  }
}
