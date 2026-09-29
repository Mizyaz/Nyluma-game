// Cutout rig definitions. Parts are authored facing right (+x forward),
// limbs pointing down at angle 0. A positive joint angle rotates clockwise
// on screen, so a forward swing of a leg is a negative angle.

export interface PartArt {
  key: string;
  /** Logical size of the part canvas. */
  w: number;
  h: number;
  /** Pivot (joint) inside the part, logical px. */
  px: number;
  py: number;
  /** SVG markup in logical coordinates. */
  body: string;
  /** Rasterization scale (default 2). */
  scale?: number;
  /** Also produce a darker '.far' variant for the far side of the body. */
  far?: boolean;
  /** Additive glow sprite (not outlined). */
  additive?: boolean;
}

export interface RigJoint {
  id: string;
  parent: string | null;
  /** Offset from the parent joint in the parent's rest frame. */
  x: number;
  y: number;
  part?: string;
  /** Anatomical side for side-aware ordering / far shading. */
  side?: 'L' | 'R';
  /** Draw order; near-side limbs get +100, far-side limbs -100. */
  z: number;
  /** Additive blend (glows). */
  additive?: boolean;
  /**
   * Secondary motion: the joint lags behind its parent's turns (`lag`, 0..1)
   * and swings from the body's changes of speed (`gain`), settling on a
   * damped spring (`k` stiffness, `c` damping). `tip` is where the part
   * points at rest, relative to the joint.
   */
  spring?: { k: number; c: number; lag: number; gain: number; tip: [number, number] };
}

export interface RigDef {
  id: string;
  joints: RigJoint[];
  /** Named attachment points (joint + local offset) used by gameplay. */
  attach: Record<string, { joint: string; x: number; y: number }>;
  /** Animation names this rig's animator implements. */
  animations: string[];
}
