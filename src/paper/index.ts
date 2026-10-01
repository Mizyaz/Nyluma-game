// The paper engine: rooms are paper boxes seen through a torn-open front,
// and everything in them is a 2D model standing upright at its depth,
// printed at exactly the size it shows. See docs/PAPER_ENGINE.md.

export { Lens, type Framing, type Pt } from './lens';
export { Planes, PlaneCamera } from './planes';
export { Press, actorScale, waitFor, SPAN, type Print } from './press';
export { PaperBox, type BoxSpec, type BoxColors } from './box';
export { PaperStage, printScaleAt, restScale, type Shadowed } from './stage';
export { Screen, fitScene, pixelRatio, deviceSize, GAME_W, GAME_H, type Fit } from './screen';
