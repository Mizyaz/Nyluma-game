import { app } from '../../engine/App';
import type { Player } from '../Player';
import type { Move, MoveContext } from './types';

/**
 * The Sivaslı amca's resonance: he holds his round belly and laughs. Held
 * longer it grows into a kahkaha that swaps the Sun and the Moon (the world
 * scene watches the hold: WorldScene.kahkaha).
 */
export class LaughMove implements Move {
  readonly id = 'laugh';
  readonly family = 'laugh' as const;

  canUse(p: Player): boolean {
    return p.kind === 'gorti' && p.form === 'human';
  }

  cooldown(): number {
    return 0.5;
  }

  perform(ctx: MoveContext): void {
    const { player, world } = ctx;
    const c = player.chest();
    player.pose('laugh', 1.2, true);
    player.emote('laugh', 1500);
    world.laughAlong(1400, 520);
    world.comic.pop(c.x + player.facing * 36, c.y - 130, LAUGHS[Math.floor(Math.random() * LAUGHS.length)]!, 'call', true);
    world.bursts.burst(c.x, c.y + 14, 12);
    app.audio.sfx('pulse', { vol: 0.55, pitch: 1.25 + Math.random() * 0.2 });
  }
}

const LAUGHS = ['HA HA!', 'HE HE!', 'HI HI!'];
