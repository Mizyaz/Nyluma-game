import { app } from '../App';
import { DEPTH } from '../constants';
import { CreaturePool } from '../entities/Creatures';
import type { WorldScene } from '../scenes/WorldScene';
import { ensureMoveArt } from './moveArt';
import { BloomMove, EarthMove, SparkMove } from './moves';
import { tierOf } from './tiers';
import type { Effect, Move, MoveContext } from './types';

/**
 * The Rezonans button: picks the move that fits Gorti's form and how far
 * the story has come, runs its effects and keeps the cooldown. Moves are
 * tried in order; the first one that fits the player and whose family is
 * open in this room wins.
 */
export class MoveSystem {
  private effects: Effect[] = [];
  private cd = 0;
  private birdPool: CreaturePool | null = null;
  private readonly moves: readonly Move[];
  /** Moves made in this room, and the last one (for tests and tools). */
  count = 0;
  last: string | null = null;

  constructor(private readonly world: WorldScene) {
    ensureMoveArt(world.textures);
    this.moves = [new BloomMove(() => this.birds()), new EarthMove(), new SparkMove()];
  }

  /** Whether a move may start now. */
  get ready(): boolean {
    return this.cd <= 0;
  }

  /** Kinds of the effects still running ('bloom', 'moon'…). */
  get running(): string[] {
    return this.effects.map((e) => e.kind);
  }

  /** Birds still flying out of the flowers. */
  get birdsFlying(): number {
    return this.birdPool?.flying ?? 0;
  }

  /** The move the button would make now (null: none fits). */
  pick(): Move | null {
    const p = this.world.player;
    return this.moves.find((m) => m.canUse(p) && tierOf(m.family, this.world.def.id) > 0) ?? null;
  }

  /** Makes the fitting move; returns its id, or null when not ready. */
  use(): string | null {
    if (!this.ready) return null;
    const move = this.pick();
    if (!move) return null;
    const ctx: MoveContext = {
      world: this.world,
      player: this.world.player,
      tier: tierOf(move.family, this.world.def.id),
      reduced: app.settings.reducedMotion,
    };
    move.perform(ctx, (e) => this.effects.push(e));
    this.cd = move.cooldown(ctx);
    this.count++;
    this.last = move.id;
    return move.id;
  }

  update(dtMs: number): void {
    if (this.cd > 0) this.cd -= dtMs / 1000;
    this.birdPool?.update(dtMs);
    if (!this.effects.length) return;
    // Effects may add effects while updating (a stomp spawns cracks).
    const list = this.effects;
    this.effects = [];
    const alive: Effect[] = [];
    for (const e of list) {
      if (e.update(dtMs)) alive.push(e);
      else e.destroy();
    }
    this.effects = alive.concat(this.effects);
  }

  destroy(): void {
    for (const e of this.effects) e.destroy();
    this.effects = [];
    this.birdPool?.destroy();
    this.birdPool = null;
  }

  private birds(): CreaturePool {
    this.birdPool ??= new CreaturePool(this.world, 'bird', 16, DEPTH.actors - 2);
    return this.birdPool;
  }
}
