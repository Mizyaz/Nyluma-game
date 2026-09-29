import { h, ICONS } from './dom';
import { controlText } from './controlText';
import { fullscreenAvailable, isFullscreen, toggleFullscreen } from './fullscreen';

export interface PromptItem {
  key: string;
  label: string;
}

/** In-game heads-up display (DOM overlay). */
export class Hud {
  readonly el: HTMLElement;
  private promptEl: HTMLElement;
  private captionEl: HTMLElement;
  private areaEl: HTMLElement;
  private toastEl: HTMLElement;
  private skipEl: HTMLElement;
  /** Toast, prompts and captions (subtitles) stacked in one column. */
  private stackEl: HTMLElement;
  private captionTimer = 0;
  private toastTimer = 0;
  private areaTimer = 0;
  private lastPrompt = '';
  onPause: () => void = () => undefined;

  constructor(stage: HTMLElement) {
    const pauseBtn = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Duraklat', html: ICONS.pause });
    pauseBtn.addEventListener('click', () => {
      pauseBtn.blur();
      this.onPause();
    });
    const fsBtn = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Tam ekran', html: ICONS.fullscreen });
    fsBtn.addEventListener('click', () => {
      fsBtn.blur();
      void toggleFullscreen();
    });
    if (!fullscreenAvailable()) fsBtn.classList.add('hidden');
    document.addEventListener('fullscreenchange', () => fsBtn.setAttribute('aria-pressed', String(isFullscreen())));
    const right = h('div', { class: 'hud-right' }, pauseBtn, fsBtn);
    this.promptEl = h('div', { class: 'prompt', 'aria-live': 'polite' });
    this.captionEl = h('div', { class: 'caption', 'aria-live': 'polite' });
    this.areaEl = h('div', { class: 'area-title' });
    this.toastEl = h('div', { class: 'toast', role: 'status' });
    this.skipEl = h('div', { class: 'skip-hint hidden' });
    this.stackEl = h('div', { class: 'hud-stack' }, this.toastEl, this.promptEl, this.captionEl);
    this.el = h('div', { class: 'hud hidden' }, right, this.stackEl, this.areaEl, this.skipEl);
    stage.append(this.el);
  }

  show(on: boolean): void {
    this.el.classList.toggle('hidden', !on);
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
