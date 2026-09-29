import { h } from './dom';

/**
 * The "colour bombardment": now and then the game view fills with colour.
 * Glowing clouds in random hues bloom and drift, and a saturated colour wave
 * sweeps across and recolours everything under it for a moment. Plain DOM
 * and CSS blend modes over the canvas, so it looks the same with the WebGL
 * and the Canvas renderer. Nothing blinks: every change takes at least a
 * third of a second (photosensitivity).
 */
export class ColorStorm {
  private readonly el: HTMLElement;
  private running = 0;

  constructor(stage: HTMLElement) {
    this.el = h('div', { class: 'color-storm passive', 'aria-hidden': 'true' });
    // First child of the stage: under the HUD, texts and menus.
    stage.prepend(this.el);
  }

  get active(): boolean {
    return this.running > 0;
  }

  /** Freezes the colours while the game is paused. */
  setPaused(on: boolean): void {
    this.el.classList.toggle('paused', on);
  }

  /** Starts a burst in random colours; returns its length in ms. */
  burst(reduced = document.documentElement.classList.contains('reduced-motion')): number {
    const base = Math.random() * 360;
    const hues = Array.from({ length: 6 }, (_, i) => (base + i * 60 + Math.random() * 35) % 360);
    const dur = reduced ? 2600 : 3600;
    const parts: HTMLElement[] = [];
    // Glowing clouds: a few radial gradients per layer, so that each layer
    // is blended with the game view only once (cheap without a GPU too).
    const layers = reduced ? 1 : 2;
    for (let l = 0; l < layers; l++) {
      const gradients: string[] = [];
      for (let i = 0; i < (reduced ? 3 : 4); i++) {
        const c = hues[(l * 3 + i) % hues.length]!.toFixed(0);
        // Each glow fades out inside the layer, so no edge ever shows.
        const w = 16 + Math.random() * 10;
        const hh = w * 1.5;
        const x = w + 2 + Math.random() * (96 - 2 * w);
        const y = hh + 2 + Math.random() * (96 - 2 * hh);
        gradients.push(
          `radial-gradient(ellipse ${w.toFixed(1)}% ${hh.toFixed(1)}% at ${x.toFixed(1)}% ${y.toFixed(1)}%, ` +
            `hsl(${c} 95% 62%) 0%, hsl(${c} 95% 62% / 0) 100%)`,
        );
      }
      const layer = h('div', { class: 'cs-cloud' });
      layer.style.cssText =
        `background-image:${gradients.join(',')};` +
        `--dx:${((Math.random() - 0.5) * 10).toFixed(1)}%;--dy:${((Math.random() - 0.5) * 10).toFixed(1)}%;` +
        `animation-delay:${l * (reduced ? 0 : 700)}ms;animation-duration:${dur - 900 - l * 400}ms`;
      parts.push(layer);
    }
    if (!reduced) {
      const wave = h('div', { class: 'cs-wave' });
      wave.style.cssText =
        `--a:hsl(${hues[0]!.toFixed(0)} 100% 55%);--b:hsl(${hues[2]!.toFixed(0)} 100% 55%);--c:hsl(${hues[4]!.toFixed(0)} 100% 55%);` +
        `--dir:${Math.random() < 0.5 ? 1 : -1};animation-duration:${dur - 500}ms`;
      parts.push(wave);
    }
    this.el.append(...parts);
    this.running++;
    this.el.classList.add('on');
    window.setTimeout(() => {
      for (const p of parts) p.remove();
      this.running = Math.max(0, this.running - 1);
      if (!this.running) this.el.classList.remove('on');
    }, dur + 120);
    return dur;
  }
}
