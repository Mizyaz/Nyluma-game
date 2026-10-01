// The paper engine's eye.
//
// World units are the game's px: x along the room to the right, y down, and
// z toward the viewer, with z = 0 the plane the actors walk on. The eye looks
// straight along −z through an upright picture plane. So a vertical stays
// vertical, and a card that faces the viewer keeps its shape exactly: at
// depth z it is only scaled, by f / (eye.z − z). That is what lets a 2D model
// show pixel for pixel in a 3D box. Looking down into the box is done the way
// an architect's shift lens does it, by moving the picture (the eye level
// sits high on the screen), never by tilting the eye.

export interface Pt {
  x: number;
  y: number;
}

/** How a room is shot. */
export interface Framing {
  /** World px seen from the top to the bottom of the screen at the actors' plane. */
  span: number;
  /** Distance from the eye to the actors' plane (world px). Smaller is stronger perspective. */
  dist: number;
  /** Eye height above the floor (world px). */
  height: number;
  /** Where the floor line at the actors' plane lands, as a share of the screen height from the top. */
  feet: number;
}

export class Lens {
  /** The picture, device px. */
  w = 2;
  h = 2;
  /** Focal length, device px. */
  f = 1;
  /** Where the eye's own x and y land on the screen (device px from the top left). */
  cx = 1;
  cy = 1;
  readonly eye = { x: 0, y: 0, z: 1 };

  /** Device px per world px at depth z. */
  scale(z: number): number {
    return this.f / (this.eye.z - z);
  }

  /** The screen point (device px) of a world point. */
  project(x: number, y: number, z: number, out: Pt = { x: 0, y: 0 }): Pt {
    const s = this.scale(z);
    out.x = this.cx + s * (x - this.eye.x);
    out.y = this.cy + s * (y - this.eye.y);
    return out;
  }

  /** The world point at depth z that shows at a screen point. */
  unproject(sx: number, sy: number, z: number, out: Pt = { x: 0, y: 0 }): Pt {
    const s = this.scale(z);
    out.x = this.eye.x + (sx - this.cx) / s;
    out.y = this.eye.y + (sy - this.cy) / s;
    return out;
  }

  /**
   * Sets the eye for a picture of w × h device px, shot as `framing` says,
   * over a floor at world y `floorY`, zoomed by `zoom` (a narrower lens: the
   * perspective stays, the picture grows about the floor line).
   */
  frame(w: number, h: number, framing: Framing, floorY: number, zoom = 1): void {
    this.w = w;
    this.h = h;
    const s0 = (h / framing.span) * zoom;
    this.f = s0 * framing.dist;
    this.eye.z = framing.dist;
    this.eye.y = floorY - framing.height;
    this.cx = w / 2;
    this.cy = framing.feet * h - s0 * framing.height;
  }

  /** Half the picture's width in world px at depth z. */
  halfWidth(z: number): number {
    return this.w / 2 / this.scale(z);
  }
}
