import * as Phaser from 'phaser';
import { app } from '../../../engine/App';
import { DEPTH } from '../../../engine/constants';
import { PASTEL } from '../style';

// Comic-book sound words ("GÜM!", "HOP!") that burst out of big moments,
// and focus lines that rush in around them.

/** What kind of moment a word marks (sets its look and how often it may come). */
export type ComicKind = 'land' | 'jump' | 'bloom' | 'stomp' | 'whale' | 'storm' | 'wake' | 'call';

interface KindStyle {
  fill: string;
  burst: number;
  size: number;
  /** Seconds before the same kind may pop again. */
  cooldown: number;
}

const STYLE: Record<ComicKind, KindStyle> = {
  land: { fill: PASTEL.apricot, burst: 0xf7eddc, size: 24, cooldown: 1.4 },
  jump: { fill: PASTEL.aqua, burst: 0xf7eddc, size: 19, cooldown: 4 },
  bloom: { fill: PASTEL.pink, burst: 0xfff6c9, size: 22, cooldown: 0.8 },
  stomp: { fill: PASTEL.butter, burst: 0xf4b27c, size: 32, cooldown: 1 },
  whale: { fill: PASTEL.periwinkle, burst: 0xeaf4f6, size: 24, cooldown: 1.2 },
  storm: { fill: PASTEL.lilac, burst: 0xfdf3fb, size: 28, cooldown: 3 },
  wake: { fill: PASTEL.butter, burst: 0xf7eddc, size: 26, cooldown: 1 },
  call: { fill: PASTEL.mint, burst: 0xf7eddc, size: 20, cooldown: 1.5 },
};

const LINE = '#4f4557';

export class ComicWords {
  private last = new Map<ComicKind, number>();

  constructor(private readonly scene: Phaser.Scene) {}

  /** A sound word bursting out at (x, y) (world coordinates). */
  pop(x: number, y: number, word: string, kind: ComicKind, force = false): void {
    const st = STYLE[kind];
    const now = this.scene.time.now / 1000;
    if (!force && now - (this.last.get(kind) ?? -99) < st.cooldown) return;
    this.last.set(kind, now);
    const reduced = app.settings.reducedMotion;
    const tilt = (Math.random() - 0.5) * 0.4;
    const c = this.scene.add.container(x, y).setDepth(DEPTH.overlay - 2).setRotation(tilt);
    // The jagged burst behind the letters.
    const g = this.scene.add.graphics();
    const spikes = 11;
    const rOut = st.size * (0.95 + word.length * 0.16);
    const rIn = rOut * 0.68;
    const pts: Phaser.Math.Vector2[] = [];
    for (let i = 0; i < spikes * 2; i++) {
      const a = (i / (spikes * 2)) * Math.PI * 2;
      const r = (i % 2 ? rIn : rOut) * (0.9 + Math.random() * 0.2);
      pts.push(new Phaser.Math.Vector2(Math.cos(a) * r * 1.25, Math.sin(a) * r * 0.78));
    }
    g.fillStyle(st.burst, 0.95).fillPoints(pts, true);
    g.lineStyle(2.5, 0x4f4557, 0.85).strokePoints(pts, true, true);
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Arial Black", Impact, "Helvetica Neue", Arial, sans-serif',
      fontSize: `${st.size}px`,
      fontStyle: 'bold',
      color: st.fill,
      stroke: LINE,
      strokeThickness: Math.round(st.size / 7),
    };
    const shadow = this.scene.add.text(3, 4, word, { ...style, color: LINE }).setOrigin(0.5).setAlpha(0.35);
    const text = this.scene.add.text(0, 0, word, style).setOrigin(0.5);
    c.add([g, shadow, text]);
    c.setScale(reduced ? 1 : 0.2);
    if (!reduced) {
      this.scene.tweens.add({ targets: c, scale: 1.18, duration: 110, ease: 'Back.easeOut', onComplete: () => this.scene.tweens.add({ targets: c, scale: 1, duration: 120 }) });
      this.scene.tweens.add({ targets: c, y: y - 26, duration: 1100, ease: 'Sine.easeOut' });
    }
    this.scene.tweens.add({ targets: c, alpha: 0, delay: 650, duration: 450, onComplete: () => c.destroy(true) });
  }

  /** Comic focus lines rushing in toward (x, y) for a moment. */
  focusLines(x: number, y: number, strength = 1): void {
    if (app.settings.reducedMotion) return;
    const cam = this.scene.cameras.main;
    const g = this.scene.add.graphics().setDepth(DEPTH.overlay - 3);
    const inner = 150 / cam.zoom;
    const outer = Math.max(cam.worldView.width, cam.worldView.height);
    const n = Math.round(46 * strength);
    const draw = (k: number): void => {
      g.clear();
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + (i % 3) * 0.02;
        const r0 = inner * (1 + 0.35 * ((i * 7) % 5) / 5) + (1 - k) * 60;
        const w = (i % 4 === 0 ? 3.2 : 1.6) / cam.zoom;
        g.lineStyle(w, 0x4f4557, 0.55 * k);
        g.beginPath();
        g.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0);
        g.lineTo(x + Math.cos(a) * outer, y + Math.sin(a) * outer);
        g.strokePath();
      }
    };
    const o = { k: 0 };
    this.scene.tweens.add({
      targets: o,
      k: 1,
      duration: 90,
      onUpdate: () => draw(o.k),
      onComplete: () =>
        this.scene.tweens.add({ targets: o, k: 0, delay: 180, duration: 320, onUpdate: () => draw(o.k), onComplete: () => g.destroy() }),
    });
  }
}

/** Sound words, picked for variety. */
export const WORDS = {
  land: ['GÜM!', 'TAK!', 'PAT!'],
  jump: ['HOP!', 'ZIP!'],
  bloom: ['PAT!', 'FIŞŞ!', 'PIT!'],
  birds: ['CIK CIK!', 'CİV CİV!'],
  stomp: ['GÜMM!', 'KÜT!', 'BUMM!'],
  smash: ['KRAŞ!', 'ÇATIR!', 'KÜTÜRT!'],
  moon: ['VUUU…'],
  horse: ['İHİHİ!'],
  whale: ['ŞLAP!', 'PLOF!', 'VOOM!'],
  storm: ['VIZZ!', 'ŞAKK!'],
  wake: ['HOP!'],
} as const;

export function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)]!;
}
