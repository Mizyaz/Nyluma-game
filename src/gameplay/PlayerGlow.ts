import * as Phaser from 'phaser';
import { app } from '../engine/App';
import { DEPTH } from '../engine/constants';
import type { SkyOut } from '../engine/content/types';
import { mixColor, type Lighting, type PaperLight } from '../paper/light';
import { HALO_PX, lightTextures } from '../render/2d/fx/lightArt';
import type { Player } from './Player';

// Gorti's own light. His face is a screen and glows pink: a soft bloom
// about it, and a light that goes with him and lights what is near (it
// never throws his own shadow). The coward's light is his torch. It
// breathes, swells while he talks, sings or holds his focus, rocks with his
// laugh and flashes in each Rezonans move's colour. The Sivaslı amca shines
// with the head he wears: the Sun's warm, the Moon's cold, bald a faint warm.
// Slow waves only, and gentler still with less motion asked for.

/** A light's colour, strength, reach (world px) and unsteadiness, and its bloom's width (world px) and strength. */
type Look = { color: number; intensity: number; radius: number; flicker?: number; bloom: number; bloomA: number };

const SCREEN: Look = { color: 0xff86d6, intensity: 1.25, radius: 520, bloom: 170, bloomA: 0.55 };
const HEADS: Record<SkyOut, Look> = {
  sun: { color: 0xffc56e, intensity: 1.2, radius: 540, bloom: 170, bloomA: 0.45 },
  moon: { color: 0xb9c4ff, intensity: 1, radius: 500, bloom: 160, bloomA: 0.4 },
  none: { color: 0xffd9b0, intensity: 0.4, radius: 320, bloom: 0, bloomA: 0 },
};
const MECH: Look = { color: 0x8fe6ff, intensity: 1, radius: 460, bloom: 120, bloomA: 0.35 };
const COWARD: Look = { color: 0xffc27a, intensity: 1, radius: 460, flicker: 0.25, bloom: 110, bloomA: 0.5 };
/** The colour each Rezonans move flashes in. */
const MOVE_COLOR: Record<string, number> = { bloom: 0xffb0e4, laugh: 0xffd27a, spark: 0xa6f0ff };
const ACTING = new Set(['laugh', 'kahkaha']);

export interface GlowCues {
  /** What is out in the sky (the amca's head). */
  head(): SkyOut;
  /** Gorti is speaking a line just now. */
  talking(): boolean;
  /** The Rezonans moves made so far, and the last one. */
  moves(): { count: number; last: string | null };
}

export class PlayerGlow {
  readonly light: PaperLight;
  /** The glow about the face (light itself: the room's lights leave it as it is). */
  private readonly bloom: Phaser.GameObjects.Image;
  private t = 0;
  private k = 1;
  private flash = 0;
  private flashColor = 0xffffff;
  private seen: number | null = null;

  constructor(
    scene: Phaser.Scene,
    private readonly player: Player,
    private readonly lighting: Lighting,
    private readonly cues: GlowCues,
  ) {
    const pl = player;
    this.light = lighting.add({ x: 0, y: 0, z: 30, ...SCREEN, cast: false, follow: () => (pl.rig.container.visible ? this.source() : null) });
    lightTextures(scene.textures);
    this.bloom = scene.add.image(0, 0, 'fx.halo').setBlendMode(Phaser.BlendModes.ADD).setDepth(DEPTH.player - 0.5).setVisible(false);
    lighting.leave(this.bloom);
  }

  /** Where the light comes from: the face (the coward: his torch's flame). */
  private source(): { x: number; y: number } {
    return this.player.rig.attachPoint(this.player.kind === 'coward' ? 'flame' : 'eye');
  }

  /** A burst of light (a transformation, a big moment), in a colour. */
  burst(color: number, k = 1): void {
    this.flash = Math.max(this.flash, k);
    this.flashColor = color;
  }

  update(dt: number): void {
    this.t += dt;
    const pl = this.player;
    const look = this.look();
    const moves = this.cues.moves();
    if (this.seen !== null && moves.count !== this.seen) this.burst(MOVE_COLOR[moves.last ?? ''] ?? look.color);
    this.seen = moves.count;
    const t = this.t;
    const calm = app.settings.reducedMotion ? 0.25 : 1;
    const wave = (amount: number, rate: number): number => 1 + amount * calm * Math.sin(t * rate);
    // How much brighter than at rest, eased so a change of state never pops.
    let want = wave(0.1, 2.4);
    if (this.cues.talking()) want *= 1.25 * wave(0.12, 8);
    if (pl.state === 'song' || pl.focus.active) want *= 1.45 * wave(0.15, 3.5);
    if (pl.state === 'reach') want *= 1.3;
    if (pl.forceAnim && ACTING.has(pl.forceAnim)) want *= 1.4 * wave(0.2, 9);
    if (pl.state === 'transform' || pl.state === 'reform') want *= 1.8;
    this.k += (want - this.k) * Math.min(1, dt * 8);
    this.flash = Math.max(0, this.flash - dt * 2.2);
    const f = this.flash;
    const l = this.light;
    l.intensity = look.intensity * this.k * (1 + 1.4 * f);
    l.radius = look.radius * (0.92 + 0.08 * this.k + 0.35 * f);
    l.color = f > 0 ? mixColor(look.color, this.flashColor, f * 1.5) : look.color;
    l.flicker = look.flicker;
    // The bloom, behind him: a halo about the face that breathes with the light.
    const b = this.bloom;
    const shown = pl.rig.container.visible && look.bloom > 0;
    b.setVisible(shown);
    if (!shown) return;
    const at = this.source();
    const flame = look.flicker ? 1 - look.flicker * 0.5 * (0.5 + 0.5 * Math.sin(t * 9 + 1.3) * Math.sin(t * 3.3)) : 1;
    b.setPosition(at.x, at.y)
      .setTint(l.color)
      .setAlpha(Math.min(1, look.bloomA * this.k * flame * (1 + 0.8 * f)) * pl.rig.container.alpha)
      .setScale((look.bloom * pl.rig.scale * (0.9 + 0.1 * this.k + 0.5 * f)) / HALO_PX);
  }

  /** What he shines with: his screen, the amca's head, the others' own. */
  private look(): Look {
    const pl = this.player;
    if (pl.kind === 'mech') return MECH;
    if (pl.kind === 'coward') return COWARD;
    if (pl.kind === 'suit' || pl.form === 'human') return HEADS[this.cues.head()];
    return SCREEN;
  }

  destroy(): void {
    this.lighting.remove(this.light);
    this.bloom.destroy();
  }
}
