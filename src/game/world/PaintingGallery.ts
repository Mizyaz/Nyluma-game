import type * as Phaser from 'phaser';
import { app } from '../App';
import { PAINTING_LINE, PAINTINGS, paintingsIn } from '../data/paintings';
import { Painting } from '../entities/Painting';
import type { WorldScene } from '../scenes/WorldScene';
import type { RoomId } from '../state/types';
import { paintingCard } from '../../ui/paintingCard';
import { floorBelow } from './geometry';

/**
 * The paintings of one room: loads their artwork lazily, hangs them and
 * shows one large when Gorti inspects it.
 */
export class PaintingGallery {
  private readonly items: Painting[] = [];

  /** Queues the artwork this room needs (call from the scene's preload). */
  static preload(scene: Phaser.Scene, room: RoomId): void {
    for (const place of paintingsIn(room)) {
      const art = PAINTINGS[place.art];
      if (!scene.textures.exists(art.key)) scene.load.image(art.key, art.url);
    }
  }

  constructor(private readonly world: WorldScene) {
    const def = world.def;
    for (const place of paintingsIn(def.id)) {
      const floor = place.mount === 'easel' ? place.y : floorBelow(def, place.x, place.y);
      const p = new Painting(world, PAINTINGS[place.art], place, floor, (painting) => this.inspect(painting));
      this.items.push(p);
      world.addFeature(p);
    }
  }

  get count(): number {
    return this.items.length;
  }

  update(dtMs: number): void {
    for (const p of this.items) p.update(dtMs);
  }

  private inspect(p: Painting): void {
    const w = this.world;
    const pl = w.player;
    pl.lock(true, 'look');
    pl.setFacing(p.x >= pl.x ? 1 : -1);
    pl.emote('surprise', 800);
    void app.ui.doc.open(paintingCard(p.art, PAINTING_LINE), 'Kapat', 'painting').then(() => {
      pl.lock(false);
      pl.emote('relief', 1400);
      w.flag(`painting.${p.art.id}`, false);
    });
  }

  /** The paintings themselves are world features: the scene destroys them. */
  destroy(): void {
    this.items.length = 0;
  }
}
