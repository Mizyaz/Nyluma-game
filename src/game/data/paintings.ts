import type { RoomId } from '../state/types';
import stranger from '../../assets/paintings/p1-house-of-the-stranger.jpg';
import moon from '../../assets/paintings/p2-moon-form.jpg';
import youth from '../../assets/paintings/p3-late-to-work.jpg';
import warrior from '../../assets/paintings/p4-warrior.jpg';

// The author's drawings of Gorti's life hang at the start of every chapter
// (the four of them together in the last one). Inspecting one, Gorti looks
// at his future and his past.

/** What Gorti feels in front of every painting. */
export const PAINTING_LINE = 'Gorti geleceğine ve geçmişine bakış attı.';

export interface PaintingArt {
  id: PaintingId;
  /** Texture key once loaded. */
  key: string;
  url: string;
  title: string;
  /** What the picture shows, in the story's words. */
  caption: string;
}

export type PaintingId = 'stranger' | 'moon' | 'youth' | 'warrior';

export const PAINTINGS: Record<PaintingId, PaintingArt> = {
  stranger: { id: 'stranger', key: 'painting.stranger', url: stranger, title: 'House of The Stranger', caption: 'Yer altındaki 14. Oda.' },
  moon: { id: 'moon', key: 'painting.moon', url: moon, title: 'Ay Hali', caption: 'Sivaslı amcanın Güneş’te ve Ay’da değişen biçimi, ay hâliyle.' },
  youth: { id: 'youth', key: 'painting.youth', url: youth, title: 'Late to Work', caption: 'Gorti’nin ergenliği: milleti kırbaçlayıp robotlaştırdığı günler.' },
  warrior: { id: 'warrior', key: 'painting.warrior', url: warrior, title: 'Savaşçı', caption: 'Gorti artık bir savaşçı.' },
};

/** In the order of Gorti's life. */
export const PAINTING_ORDER: readonly PaintingId[] = ['stranger', 'moon', 'youth', 'warrior'];

export type PaintingMount = 'wall' | 'easel';

export interface PaintingPlacement {
  art: PaintingId;
  x: number;
  /** Wall: the painting's centre height. Easel: the floor it stands on. */
  y: number;
  /** Width of the canvas (the frame adds to it), world px. */
  width: number;
  mount: PaintingMount;
}

export const PAINTING_PLACEMENTS: Partial<Record<RoomId, readonly PaintingPlacement[]>> = {
  // Chapter I: on the nursery wall.
  r01: [{ art: 'stranger', x: 745, y: 430, width: 150, mount: 'wall' }],
  // Chapter II: on the surface, on an easel in the grass.
  r04: [{ art: 'moon', x: 300, y: 900, width: 130, mount: 'easel' }],
  // Chapter III: the ride has no stop, so by the Sun's field.
  r08: [{ art: 'youth', x: 250, y: 640, width: 120, mount: 'easel' }],
  // Chapter IV: in the sparrow's clearing.
  r09: [{ art: 'warrior', x: 320, y: 900, width: 130, mount: 'easel' }],
  // Chapter V: the whole life along the office corridor.
  r12: [
    { art: 'stranger', x: 330, y: 455, width: 120, mount: 'wall' },
    { art: 'moon', x: 560, y: 455, width: 120, mount: 'wall' },
    { art: 'youth', x: 830, y: 455, width: 120, mount: 'wall' },
    { art: 'warrior', x: 1330, y: 455, width: 120, mount: 'wall' },
  ],
};

export function paintingsIn(room: RoomId): readonly PaintingPlacement[] {
  return PAINTING_PLACEMENTS[room] ?? [];
}
