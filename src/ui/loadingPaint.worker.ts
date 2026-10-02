import { paintPicture } from './loadingPaint';

// Paints the loading theatre's still pictures (see loadingPaint.ts) and
// sends each back as a bitmap as soon as it is done, in the order asked.

/** Pictures to paint at `scale` px per unit, for one drawing of the theatre (`gen`). */
export interface PaintAsk {
  gen: number;
  scale: number;
  pictures: [key: number, svg: string][];
}

/** A painted picture, or null when it could not be. */
export interface Painted {
  gen: number;
  key: number;
  bitmap: ImageBitmap | null;
}

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<PaintAsk>) => void) | null;
  postMessage(message: Painted, transfer: Transferable[]): void;
};

scope.onmessage = ({ data: { gen, scale, pictures } }) => {
  for (const [key, svg] of pictures) {
    let bitmap: ImageBitmap | null = null;
    try {
      bitmap = paintPicture(svg, scale);
    } catch {
      bitmap = null;
    }
    scope.postMessage({ gen, key, bitmap }, bitmap ? [bitmap] : []);
  }
};
