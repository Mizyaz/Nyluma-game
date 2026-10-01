import * as Phaser from 'phaser';
import type { Planes } from './planes';
import type { BoxSpec } from './box';

// Motes in the room's air: specks drifting through the lamplight, most of
// them far back, a few at the actors' plane, and a few close to the eye,
// big and soft as if out of focus. They are light themselves (added), so
// the lighting leaves them as they are.

export interface Air {
  /** The motes' colours (each takes one). */
  colors: readonly number[];
  /** Motes in the whole room at once. */
  count: number;
  /** Drift, world px a second: up, or down (settling dust) when negative. */
  rise: number;
  /** Brightness (0..1). */
  glow: number;
}

const KEY = 'paper:mote';

/** A soft round speck (one texture for every mote). */
function moteTexture(scene: Phaser.Scene): string {
  if (scene.textures.exists(KEY)) return KEY;
  const n = 64;
  const tex = scene.textures.createCanvas(KEY, n, n);
  if (!tex) return KEY;
  const ctx = tex.getContext();
  const g = ctx.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.22, 'rgba(255,255,255,0.6)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.14)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, n, n);
  tex.refresh();
  return KEY;
}

/** Where the motes are, and how they look there: depth, share of all, size (world px), brightness. */
const LAYERS = (box: BoxSpec): { z: number; share: number; size: [number, number]; alpha: number }[] => [
  { z: Math.round(box.back * 0.5), share: 0.5, size: [6, 11], alpha: 0.8 },
  { z: -14, share: 0.35, size: [6, 10], alpha: 0.95 },
  { z: Math.max(30, Math.min(box.front - 12, 70)), share: 0.15, size: [22, 40], alpha: 0.3 },
];

export class RoomAir {
  readonly emitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

  constructor(scene: Phaser.Scene, planes: Planes, box: BoxSpec, air: Air) {
    const key = moteTexture(scene);
    const zone = {
      getRandomPoint: (p: Phaser.Types.Math.Vector2Like): void => {
        p.x = box.x0 + Math.random() * (box.x1 - box.x0);
        p.y = box.top + Math.random() * (box.floor - box.top);
      },
    };
    for (const L of LAYERS(box)) {
      const n = Math.max(1, Math.round(air.count * L.share));
      const life = 9000;
      const e = scene.add.particles(0, 0, key, {
        emitZone: { type: 'random', source: zone },
        lifespan: { min: life * 0.6, max: life },
        frequency: life / n,
        quantity: 1,
        advance: life,
        speedX: { min: -5, max: 5 },
        speedY: { min: -air.rise - 3, max: -air.rise + 3 },
        scale: { min: L.size[0] / 64, max: L.size[1] / 64 },
        tint: [...air.colors],
        // In and out over its life, with a slow shimmer on the way.
        alpha: {
          onEmit: () => 0,
          onUpdate: (p: Phaser.GameObjects.Particles.Particle, _k: string, t: number) =>
            air.glow * L.alpha * Math.sin(Math.PI * t) * (0.7 + 0.3 * Math.sin(t * 23 + p.x * 0.07)),
        },
        blendMode: Phaser.BlendModes.ADD,
      });
      planes.put(e, L.z);
      this.emitters.push(e);
    }
  }

  destroy(): void {
    for (const e of this.emitters) e.destroy();
    this.emitters.length = 0;
  }
}
