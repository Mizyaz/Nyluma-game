import * as Phaser from 'phaser';
import type { PaperStage } from './stage';

// A figure's shadow thrown by the room's strongest lamp on it, as a paper
// puppet's falls in a toy theatre: up the back wall, bigger than the figure
// and away from the lamp, and over the boards from its feet to the wall.
// It turns and stretches as the figure walks past the lamp.
//
// Each frame the figure is drawn through the shadow's projection into a
// small texture at low resolution (its edges come out soft), and that
// texture is shown filled with the shadow's colour on the back wall's
// plane (behind every card: what stands between the figure and the wall
// covers its shadow).

/** Texels per world px: low, for a soft edge (the wall's is softer: it is farther from the figure). */
const RES_FLOOR = 0.4;
const RES_WALL = 0.25;
/** World px a shadow can cover. */
const SPAN_W = 900;
const SPAN_H = 600;
/** The darkest a shadow gets. */
const DARK = 0.7;

export interface Caster {
  /** The figure (drawn as it stands; its colour does not matter). */
  figure: Phaser.GameObjects.Container;
  /** Its feet's middle, world px; null hides the shadow. */
  feet(): { x: number; y: number } | null;
  /** How tall it stands, world px. */
  readonly height: number;
}

type V = { x: number; y: number };

export class CastShadow {
  private readonly floor: Phaser.GameObjects.RenderTexture;
  private readonly wall: Phaser.GameObjects.RenderTexture;
  private readonly m = new Phaser.GameObjects.Components.TransformMatrix();
  private readonly lamp = { x: 0, y: 0, z: 0, k: 0 };

  constructor(
    private readonly stage: PaperStage,
    readonly caster: Caster,
  ) {
    this.floor = this.surface(RES_FLOOR);
    this.wall = this.surface(RES_WALL);
  }

  private surface(res: number): Phaser.GameObjects.RenderTexture {
    const st = this.stage;
    const rt = st.scene.add.renderTexture(0, 0, Math.ceil(SPAN_W * res), Math.ceil(SPAN_H * res));
    rt.setOrigin(0, 0).setScale(1 / res);
    rt.setTintMode(Phaser.TintModes.FILL);
    rt.setVisible(false);
    // Over the wall's painted scenery, under every card.
    rt.setDepth(1e6);
    st.lighting.leave(rt);
    st.planes.put(rt, this.plane);
    return rt;
  }

  /** The plane the shadows lie on: just before the back wall. */
  private get plane(): number {
    return this.stage.spec.back + 1;
  }

  /** Lays the shadow down for this frame (after the lamps have moved). */
  update(): void {
    const { figure: c, height } = this.caster;
    const f = c.active && c.visible && c.alpha > 0.02 ? this.caster.feet() : null;
    const L = this.lamp;
    if (f) this.stage.lighting.casterAt(f.x, f.y - height / 2, this.stage.planes.zOf(c), L);
    if (!f || L.k < 0.02) {
      this.floor.setVisible(false);
      this.wall.setVisible(false);
      return;
    }
    const st = this.stage;
    const floorY = st.spec.floor;
    const lift = Math.max(0, floorY - f.y);
    const a = DARK * (L.k / (L.k + 0.1)) * Math.max(0.3, 1 - lift / 160) * c.alpha;
    const mood = st.lighting.mood;
    // The air before the back wall pales what lies on it.
    const fog = mood.fog;
    const t = Math.min(1, Math.max(0, (-this.plane - fog.near) / (fog.far - fog.near)));
    const air = 1 - 0.5 * fog.amount * t * t * (3 - 2 * t);
    this.layWall(f, L, a * air, mood.front.color);
    this.layFloor(f, L, a, mood.front.color);
  }

  /** Up the back wall: the figure seen from the lamp, scaled about it (a lamp before the figure only). */
  private layWall(f: V, L: { x: number; y: number; z: number }, alpha: number, color: number): void {
    const rt = this.wall;
    const st = this.stage;
    const zf = st.planes.zOf(this.caster.figure);
    const zw = this.plane;
    if (L.z < zf + 20) {
      rt.setVisible(false);
      return;
    }
    // Every point of the figure lands on the wall t times as far from the lamp.
    const t = (L.z - zw) / (L.z - zf);
    const mid = this.caster.height / 2;
    const cx = L.x + t * (f.x - L.x);
    const cy = L.y + t * (f.y - mid - L.y);
    // Only above the floor line: below it the shadow lies on the floor.
    this.lay(rt, RES_WALL, cx, cy, t, 0, 0, t, L.x * (1 - t), L.y * (1 - t), alpha, color, null, st.spec.floor);
  }

  /** Over the floor: where the lamp's rays past the figure meet the boards, up to the wall. */
  private layFloor(f: V, L: { x: number; y: number; z: number }, alpha: number, color: number): void {
    const rt = this.floor;
    const st = this.stage;
    const lens = st.lens;
    const floorY = st.spec.floor;
    const zf = st.planes.zOf(this.caster.figure);
    const zw = this.plane;
    const above = floorY - L.y;
    if (above < 30 || f.y <= L.y + 10) {
      rt.setVisible(false);
      return;
    }
    // A point of the figure, through the lamp to the floor, seen on the wall's plane.
    const toPlane = (x: number, y: number, out: V): V => {
      const u = above / Math.max(1, y - L.y);
      const gx = L.x + u * (x - L.x);
      const gz = Math.max(st.spec.back, L.z + u * (zf - L.z));
      const q = (lens.eye.z - zw) / (lens.eye.z - gz);
      out.x = lens.eye.x + (gx - lens.eye.x) * q;
      out.y = lens.eye.y + (floorY - lens.eye.y) * q;
      return out;
    };
    // Made affine about the feet: from them, a point up the legs (well
    // below the lamp) and one to the side.
    const hr = Math.min(this.caster.height, above) * 0.4;
    const w0 = toPlane(f.x, f.y, { x: 0, y: 0 });
    const w1 = toPlane(f.x, f.y - hr, { x: 0, y: 0 });
    const w2 = toPlane(f.x + 100, f.y, { x: 0, y: 0 });
    const ax = (w2.x - w0.x) / 100;
    const ay = (w2.y - w0.y) / 100;
    const bx = (w1.x - w0.x) / -hr;
    const by = (w1.y - w0.y) / -hr;
    // On the floor only: from the wall's foot down.
    const wallFoot = lens.eye.y + (floorY - lens.eye.y) * ((lens.eye.z - zw) / (lens.eye.z - st.spec.back));
    this.lay(rt, RES_FLOOR, w0.x, (w0.y + wallFoot) / 2, ax, ay, bx, by, w0.x - ax * f.x - bx * f.y, w0.y - ay * f.x - by * f.y, alpha, color, wallFoot, null);
  }

  /**
   * Draws the figure into a shadow texture through the map p → A·p + (tx, ty)
   * (world px, on the shadows' plane; A = [a c; b d]) and shows it around
   * (cx, cy), kept below world y `top` and above `bottom` when given.
   */
  private lay(
    rt: Phaser.GameObjects.RenderTexture,
    res: number,
    cx: number,
    cy: number,
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
    alpha: number,
    color: number,
    top: number | null,
    bottom: number | null,
  ): void {
    // The texture's corner, on its texel grid (no crawl).
    const g = 1 / res;
    const ox = Math.round((cx - SPAN_W / 2) / g) * g;
    const oy = Math.round((cy - SPAN_H / 2) / g) * g;
    const r0 = top === null ? 0 : Math.max(0, Math.ceil((top - oy) * res));
    const r1 = bottom === null ? rt.height : Math.min(rt.height, Math.floor((bottom - oy) * res));
    if (r1 - r0 < 1 || alpha < 0.01) {
      rt.setVisible(false);
      return;
    }
    this.m.setTransform(res * a, res * b, res * c, res * d, res * (tx - ox), res * (ty - oy));
    rt.clear();
    rt.capture(this.caster.figure, { transform: this.m });
    rt.render();
    rt.setCrop(0, r0, rt.width, r1 - r0);
    rt.setPosition(ox, oy);
    rt.setTint(color);
    rt.setAlpha(alpha);
    rt.setVisible(true);
  }

  destroy(): void {
    this.floor.destroy();
    this.wall.destroy();
  }
}
