// Scene units of the diorama. The game's world is measured in pixels with y
// pointing down; the 3D scene uses 1 unit = 100 px with y up, the floor of
// r01 (y = 660 in the room data) at y = 0 and z toward the camera.

export const U = 0.01;
/** Where the floor of r01 is in the room data. */
export const FLOOR_Y = 660;

/** Room x (px) → scene x. */
export const sx = (x: number): number => x * U;
/** Room y (px, down) → scene y (up, floor = 0). */
export const sy = (y: number): number => (FLOOR_Y - y) * U;

/** Depth planes (scene z) of the diorama, back to front. */
export const Z = {
  /** The back wall of the room. */
  wall: -1.5,
  /** Gorti's walking line. */
  walk: 0,
  /** Front face of the earth around the room (the cut of the diorama box). */
  front: 3.8,
} as const;
