import type { Player } from '../Player';
import type { WorldScene } from '../../engine/scenes/WorldScene';

/** Everything a Rezonans move needs to act in the world. */
export interface MoveContext {
  readonly world: WorldScene;
  readonly player: Player;
  /** 0 = the move's family is not open yet; 1, 2, 3 = it grows with the story. */
  readonly tier: number;
  readonly reduced: boolean;
}

/** A running visual effect. `update` returns false once it is finished. */
export interface Effect {
  /** What it is ('bloom', 'moon'…), for tools and tests. */
  readonly kind: string;
  update(dtMs: number): boolean;
  destroy(): void;
}

/** Hands an effect to whoever runs it (the move system). */
export type RunEffect = (e: Effect) => void;

/** One kind of move the Rezonans button can make. */
export interface Move {
  readonly id: string;
  /** Which tier table this move grows with (see tiers.ts). */
  readonly family: MoveFamily;
  canUse(player: Player): boolean;
  /** Seconds before the next move may start. */
  cooldown(ctx: MoveContext): number;
  perform(ctx: MoveContext, run: RunEffect): void;
}

export type MoveFamily = 'bloom' | 'earth' | 'laugh' | 'spark';
