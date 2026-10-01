import { h } from './dom';
import type { Clock, Rect } from './PageTurn';

// Little things that go with a page turn: Gorti's screen glow, which leaves
// the old page as it is picked up and flies to him in the new room, and the
// paper dust a page throws off as it lifts and lands.

const r1 = (n: number): string => (Math.round(n * 10) / 10).toString();
const at = (x: number, y: number, s = 1): string => `translate3d(${r1(x)}px,${r1(y)}px,0) scale(${Math.round(s * 1000) / 1000})`;

/** A small random generator (the same dust every time for the same seed). */
function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

/**
 * Gorti's screen glow, a soft pink light with a bright core and a little
 * tail of sparks, flying over the pages (layer px).
 */
export class Spark {
  private readonly el: HTMLElement;
  private readonly bits: HTMLElement[] = [];
  /** Where it hangs while the page is held up. */
  private hover: { x: number; y: number };
  private readonly size: number;

  constructor(
    private readonly clock: Clock,
    parent: HTMLElement,
    private readonly from: { x: number; y: number },
    /** The game view's smaller side (CSS px): the glow is sized to it. */
    span: number,
  ) {
    this.size = Math.max(70, span * 0.3);
    this.el = h('div', { class: 'pt-spark' });
    this.el.style.setProperty('--r', `${r1(this.size)}px`);
    // The tail first (under the head), smaller and later along the path.
    for (let i = 3; i >= 1; i--) {
      const b = h('i', { class: 'pt-spark-tail' });
      b.style.setProperty('--k', String(1 - i * 0.22));
      this.bits.push(b);
      this.el.append(b);
    }
    this.el.append(h('i', { class: 'pt-spark-halo' }), h('i', { class: 'pt-spark-core' }));
    this.el.style.transform = at(from.x, from.y, 0);
    this.hover = { x: from.x, y: from.y - span * 0.16 };
    parent.append(this.el);
  }

  /** It brightens on the screen, then rises off the page as the page is lifted, and hangs there breathing. */
  rise(dir: 1 | -1): void {
    const f = this.from;
    // Up, and away from the lifting edge, over the part of the page still lying flat.
    this.hover = { x: f.x - dir * this.size * 0.18, y: f.y - this.size * 0.55 };
    const hv = this.hover;
    this.clock.play(this.el, [
      { transform: at(f.x, f.y, 0.2), opacity: 0, offset: 0 },
      { transform: at(f.x, f.y, 0.75), opacity: 1, offset: 0.3 },
      { transform: at((f.x + hv.x) / 2, f.y - this.size * 0.3, 1.05), opacity: 1, offset: 0.65, easing: 'ease-in-out' },
      { transform: at(hv.x, hv.y, 1), opacity: 1, offset: 1 },
    ], { duration: 520, easing: 'ease-out' });
    // A slow bob while it waits (on the head only: the tail trails behind).
    this.bits.forEach((b, i) => {
      const k = i + 1;
      this.clock.play(b, [
        { transform: `translate3d(${r1(dir * k * 7)}px,${r1(k * 9)}px,0)`, opacity: 0 },
        { transform: `translate3d(${r1(dir * k * 7)}px,${r1(k * 9)}px,0)`, opacity: 0.7 },
      ], { duration: 360, delay: 160 });
    });
  }

  /** It flies to `to` along an arc over the turning page and goes into his screen. */
  home(to: { x: number; y: number }, s: number, onArrive: () => void): void {
    const a = this.hover;
    const mid = { x: (a.x + to.x) / 2, y: Math.min(a.y, to.y) - this.size * 0.9 };
    const frames: Keyframe[] = [];
    const n = 16;
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      // Slow off, quick across, slowing as it lands.
      const e = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
      const x = (1 - e) ** 2 * a.x + 2 * (1 - e) * e * mid.x + e * e * to.x;
      const y = (1 - e) ** 2 * a.y + 2 * (1 - e) * e * mid.y + e * e * to.y;
      const sc = 1 + 0.25 * Math.sin(Math.PI * u) - 0.55 * Math.max(0, u - 0.75) / 0.25;
      frames.push({ transform: at(x, y, sc), opacity: u < 0.9 ? 1 : 1 - (u - 0.9) / 0.1, offset: u });
    }
    const ms = s * 1000;
    this.clock.play(this.el, frames, { duration: ms });
    this.bits.forEach((b) => this.clock.play(b, [{ opacity: 0.7 }, { opacity: 0.9, offset: 0.5 }, { opacity: 0 }], { duration: ms }));
    let done = false;
    const arrive = (): void => {
      if (done) return;
      done = true;
      onArrive();
    };
    // Into his screen near the end of the flight.
    this.clock.after(s * 0.86, arrive);
  }

  /** It fades where it is (it has nowhere to go). */
  fade(s: number): void {
    this.clock.play(this.el, [{ opacity: 1 }, { opacity: 0 }], { duration: s * 1000, easing: 'ease-in' });
  }

  destroy(): void {
    this.el.remove();
  }
}

/** Paper dust thrown off a page as it lifts and lands. */
export class Motes {
  private readonly els: HTMLElement[] = [];
  private seed = 7;

  constructor(
    private readonly clock: Clock,
    private readonly parent: HTMLElement,
    private readonly view: Rect,
  ) {}

  /**
   * `n` motes `delay` s from now, along the line `x01` across the view (0:
   * its left edge), drifting toward `dir` and up, turning in the light.
   */
  puff(delay: number, x01: number, n: number, dir: 1 | -1): void {
    const v = this.view;
    const rand = rng(this.seed++ * 7919);
    const span = Math.min(v.w, v.h);
    for (let i = 0; i < n; i++) {
      const el = h('i', { class: 'pt-mote' });
      const big = rand() < 0.3;
      const size = Math.max(2, span * (big ? 0.012 : 0.007) * (0.7 + rand() * 0.6));
      el.style.width = el.style.height = `${r1(size)}px`;
      if (rand() < 0.35) el.classList.add('lit');
      const x = v.x + v.w * x01 + (rand() - 0.5) * v.w * 0.08;
      const y = v.y + v.h * (0.12 + rand() * 0.8);
      const dx = dir * span * (0.08 + rand() * 0.22) * (x01 > 0.2 && x01 < 0.8 ? (rand() < 0.5 ? -1 : 1) : 1);
      const dy = -span * (0.06 + rand() * 0.18);
      const wob = span * 0.02 * (rand() - 0.5);
      const life = 900 + rand() * 700;
      this.parent.append(el);
      this.els.push(el);
      this.clock.play(el, [
        { transform: at(x, y, 0.6), opacity: 0 },
        { transform: at(x + dx * 0.3 + wob, y + dy * 0.25, 1), opacity: 0.95, offset: 0.2 },
        { transform: at(x + dx * 0.7 - wob, y + dy * 0.7, 0.9), opacity: 0.8, offset: 0.65 },
        { transform: at(x + dx, y + dy, 0.6), opacity: 0 },
      ], { duration: life, delay: delay * 1000 + rand() * 160, easing: 'cubic-bezier(.2,.6,.4,1)' });
    }
  }

  destroy(): void {
    for (const e of this.els) e.remove();
    this.els.length = 0;
  }
}
