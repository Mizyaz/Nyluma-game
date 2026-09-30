import { app } from '../../engine/App';
import { hex, P } from '../../render/2d/palette';
import type { Player } from '../Player';
import { floorBelow } from '../../engine/world/geometry';
import { pick, WORDS } from '../../render/2d/fx/comicWords';
import { FlowerBloom, GroundCracks, HorseEmerge, MoonRise, releaseBirds, Timeline } from './effects';
import type { Move, MoveContext, RunEffect } from './types';
import type { CreaturePool } from '../actors/Creatures';

/** Where the ground is near `x` (null over a gap or far below Gorti's feet). */
function groundAt(ctx: MoveContext, x: number): number | null {
  const feet = ctx.player.feetY;
  const y = floorBelow(ctx.world.def, x, feet - 12);
  return Math.abs(y - feet) <= 36 ? y : null;
}

/**
 * Root Gorti: flowers sprout in front of him and birds fly out of them.
 * Tier 1: one flower, one bird. Tier 2: a fan of three flowers and a small
 * flock. Tier 3: a bed of five flowers, a great flock and coloured crystals.
 */
export class BloomMove implements Move {
  readonly id = 'bloom';
  readonly family = 'bloom' as const;

  constructor(private readonly birds: () => CreaturePool) {}

  canUse(p: Player): boolean {
    return p.kind === 'gorti' && p.form === 'root';
  }

  cooldown(ctx: MoveContext): number {
    return 0.7 + 0.35 * ctx.tier;
  }

  perform(ctx: MoveContext, run: RunEffect): void {
    const { world, player, tier } = ctx;
    const f = player.facing;
    const count = tier >= 3 ? 5 : tier === 2 ? 3 : 1;
    const perFlower = tier >= 3 ? 2 : tier === 2 ? 1 : 1;
    const spacing = ctx.reduced ? 46 : 40;
    player.emote('joy', 1600);
    player.pose('conjure', 0.7);
    app.audio.sfx('pulse', { vol: 0.5, pitch: 1.1 });
    const colorBase = Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const x = player.x + f * (58 + i * spacing) + (Math.random() - 0.5) * 10;
      const y = groundAt(ctx, x);
      if (y === null) continue;
      const size = 0.85 + 0.25 * Math.random() + (tier >= 3 ? 0.15 : 0);
      run(
        new FlowerBloom(world, x, y, i * 0.12, colorBase + i, size, (hx, hy) => {
          releaseBirds(this.birds(), hx, hy, perFlower, f);
          if (tier >= 3) world.bursts.burst(hx, hy, 10);
          // The comic words: the first flower pops, a flock chirps.
          if (i === 0) world.comic.pop(hx, hy - 40, pick(WORDS.bloom), 'bloom', true);
          if (i === count - 1 && tier >= 2) world.comic.pop(hx + f * 40, hy - 80, pick(WORDS.birds), 'call', true);
        }),
      );
    }
  }
}

/**
 * Gorti as the Sivaslı amca stamps the ground. Tier 1: the ground shakes and
 * cracks. Tier 2: the Moon also rises behind him. Tier 3: a purple horse
 * also comes out of the ground and gallops away.
 */
export class EarthMove implements Move {
  readonly id = 'earth';
  readonly family = 'earth' as const;

  canUse(p: Player): boolean {
    return p.kind === 'gorti' && p.form === 'human';
  }

  cooldown(ctx: MoveContext): number {
    return ctx.tier >= 3 ? 6.5 : ctx.tier === 2 ? 4.2 : 1.6;
  }

  perform(ctx: MoveContext, run: RunEffect): void {
    const { world, player, tier } = ctx;
    const f = player.facing;
    const x = player.x;
    const y = player.feetY;
    player.emote('effort', 700);
    player.pose('stomp', 0.62, true);
    run(
      new Timeline(
        [
          {
            at: 0.26,
            run: () => {
              app.audio.sfx('stamp');
              app.audio.sfx('rumble', { vol: 0.6 });
              world.shake(0.008, 420);
              world.comic.pop(x + f * 30, y - 60, pick(WORDS.stomp), 'stomp', true);
              world.comic.focusLines(x, y - 60, tier >= 2 ? 1 : 0.7);
              world.dust(x + f * 16, y, 10);
              world.crystalCrown(x + f * 12, y, 0.9);
              run(new GroundCracks(world, x + f * 12, y, ctx.reduced ? 90 : 150));
            },
          },
          {
            at: 0.9,
            run: () => {
              if (tier < 2) return;
              const v = world.cameras.main.worldView;
              const my = Math.max(v.y + 90, y - 300);
              run(new MoonRise(world, x - f * 170, my, x, y - 100));
              world.time.delayedCall(700, () => world.comic.pop(x - f * 170, my + 70, pick(WORDS.moon), 'call', true));
            },
          },
          {
            at: 1.5,
            run: () => {
              if (tier < 3) return;
              const hx = x + f * 230;
              const hy = groundAt(ctx, hx);
              if (hy === null) return;
              run(new GroundCracks(world, hx, hy, 120));
              world.dust(hx, hy, 14);
              run(new HorseEmerge(world, hx, hy, f));
              world.time.delayedCall(800, () => world.comic.pop(hx, hy - 150, pick(WORDS.horse), 'call', true));
            },
          },
        ],
        1.6,
      ),
    );
  }
}

/** The other forms (torch-bearer, mechanical, suited): crystals of every colour. */
export class SparkMove implements Move {
  readonly id = 'spark';
  readonly family = 'spark' as const;

  canUse(): boolean {
    return true;
  }

  cooldown(): number {
    return 0.6;
  }

  perform(ctx: MoveContext): void {
    const c = ctx.player.chest();
    app.audio.sfx('pulse', { vol: 0.7, pitch: 0.9 + Math.random() * 0.3 });
    ctx.player.emote('joy', 1400);
    ctx.world.bursts.burst(c.x, c.y, 26);
    ctx.world.burst(c.x, c.y, hex(P.vein), 6);
  }
}
