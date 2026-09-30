import * as THREE from 'three';
import { mix } from '../2d/palette';
import { themeDef } from '../2d/painters/backgrounds';
import { colorsFor } from '../2d/painters/terrain';
import type { RoomDef, SolidDef } from '../../content/data/roomTypes';
import { structural, type BoxFrame, type BoxTheme } from './themes';

// The room as a paper box: its terrain stands as slabs of paper board with
// real depth (floors seen from above, walls with their inner faces, ledges
// as thin shelves), the box's side walls at the room's ends with a rim
// along their tops, and a back wall behind everything that belongs inside
// the room when the theme builds one. The painted terrain art of the flat
// game stands on the slabs' fronts (see Mirror, 'terrain'). The box's front,
// torn open, is built apart (front.ts); without one, the floors get a low
// lip along their front edge.

/** What the box reads from a room's runtime solid (RoomRuntime.SolidRt). */
export interface SolidView {
  def: SolidDef;
  index: number;
  active: boolean;
  reveal: number;
  images: { visible: boolean; alpha: number; isCropped: boolean; width: number; _crop?: { width: number } }[];
}

type Face = 'top' | 'front' | 'side' | 'bottom' | 'rim';

interface Slab {
  solid: SolidView | null;
  mesh: THREE.Mesh;
  mats: THREE.MeshLambertMaterial[];
  /** Whether it follows its solid's state (gates, focus, growing). */
  dynamic: boolean;
  x0: number;
  w: number;
}

/** Collects quads per face kind, in world coordinates (three's y up). */
class Faces {
  readonly pos: Record<Face, number[]> = { top: [], front: [], side: [], bottom: [], rim: [] };
  readonly nor: Record<Face, number[]> = { top: [], front: [], side: [], bottom: [], rim: [] };
  readonly uv: Record<Face, number[]> = { top: [], front: [], side: [], bottom: [], rim: [] };
  private static readonly TILE = 256;

  /** A quad from four corners given counter-clockwise as seen from outside, with its normal. */
  quad(f: Face, a: number[], b: number[], c: number[], d: number[], n: [number, number, number]): void {
    const P = this.pos[f];
    const N = this.nor[f];
    const U = this.uv[f];
    const t = Faces.TILE;
    const uvOf = (p: number[]): [number, number] => {
      // World-space paper: the grain lines up across neighbouring faces.
      if (Math.abs(n[1]) > 0.5) return [p[0]! / t, p[2]! / t];
      if (Math.abs(n[0]) > 0.5) return [p[2]! / t, p[1]! / t];
      return [p[0]! / t, p[1]! / t];
    };
    for (const p of [a, b, c, a, c, d]) {
      P.push(p[0]!, p[1]!, p[2]!);
      N.push(...n);
      U.push(...uvOf(p));
    }
  }

  /**
   * A box x0..x1 (world px), y0..y1 (world px, down), z0..z1 (depth), all
   * faces but its back. The top can carry a rim band along its front edge.
   */
  box(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, o: { rimBand?: number; noBottom?: boolean; sides?: boolean; top?: Face } = {}): void {
    const Y0 = -y0;
    const Y1 = -y1;
    // Front (+z).
    this.quad('front', [x0, Y1, z1], [x1, Y1, z1], [x1, Y0, z1], [x0, Y0, z1], [0, 0, 1]);
    // Top (+y), with an optional rim band along its front edge.
    const band = Math.min(o.rimBand ?? 0, (z1 - z0) * 0.5);
    const zr = z1 - band;
    const top = o.top ?? 'top';
    this.quad(top, [x0, Y0, zr], [x1, Y0, zr], [x1, Y0, z0], [x0, Y0, z0], [0, 1, 0]);
    if (band > 0) this.quad('rim', [x0, Y0, z1], [x1, Y0, z1], [x1, Y0, zr], [x0, Y0, zr], [0, 1, 0]);
    if (!o.noBottom) this.quad('bottom', [x0, Y1, z0], [x1, Y1, z0], [x1, Y1, z1], [x0, Y1, z1], [0, -1, 0]);
    if (o.sides !== false) {
      this.quad('side', [x0, Y1, z0], [x0, Y1, z1], [x0, Y0, z1], [x0, Y0, z0], [-1, 0, 0]);
      this.quad('side', [x1, Y1, z1], [x1, Y1, z0], [x1, Y0, z0], [x1, Y0, z1], [1, 0, 0]);
    }
  }

  geometry(order: readonly Face[]): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    const pos: number[] = [];
    const nor: number[] = [];
    const uv: number[] = [];
    let start = 0;
    order.forEach((f, i) => {
      const n = this.pos[f].length / 3;
      pos.push(...this.pos[f]);
      nor.push(...this.nor[f]);
      uv.push(...this.uv[f]);
      if (n) g.addGroup(start, n, i);
      start += n;
    });
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.computeBoundingSphere();
    return g;
  }

  get empty(): boolean {
    return (Object.keys(this.pos) as Face[]).every((f) => this.pos[f].length === 0);
  }
}

const ORDER: readonly Face[] = ['top', 'front', 'side', 'bottom', 'rim'];

/** Thickness of the box's side walls (px). */
export const WALL_T = 26;

/**
 * The front lip on a floor: how high it stands (px) and how thick it is.
 * Low enough that from the lifted eye it stays under the actors' feet.
 */
const LIP = { h: 5, t: 7 } as const;

/**
 * Tops face the sky, not the key light: a little brighter paper keeps them
 * the colour the flat game paints them (as the prototype's floor did).
 */
const TOP_LIFT = 1.18;

/** A face's paper colour as three.js takes it (tops brighter). */
function faceColor(f: Face, c: number): THREE.Color {
  const col = new THREE.Color(c);
  if (f === 'top' || f === 'rim') col.multiplyScalar(TOP_LIFT);
  return col;
}

export class PaperBox {
  readonly group = new THREE.Group();
  private readonly slabs: Slab[] = [];
  private readonly shared: THREE.Material[] = [];
  /** Half-depth of ledges and thin platforms. */
  readonly thin: number;

  constructor(
    private readonly room: RoomDef,
    solids: readonly SolidView[],
    private readonly theme: BoxTheme,
    readonly frame: BoxFrame,
    private readonly paper: THREE.Texture,
    private readonly skip: (s: SolidDef) => boolean,
    /** The room paints its own box (back and side walls): the stage builds none. */
    ownWalls = false,
    /** The box has its front (built apart), whose top is here: the walls reach up to it. */
    private readonly front: { top: number } | null = null,
  ) {
    this.group.name = 'box';
    this.thin = Math.min(44, theme.frontDepth);
    this.buildSlabs(solids);
    if (!ownWalls) this.buildWalls();
    else if (front) this.buildBoard();
  }

  /** A paper floor painted for the box (the 14th Room's): its own colours and art. */
  private static painted(s: SolidDef): boolean {
    return s.style === 'paper';
  }

  /**
   * Depth of the front face of a solid's slab; NaN where its painted art is
   * not shown (clean paper). A floor painted as the box's own front leaves
   * its art to the flat game once the box has its real front.
   */
  frontZ(s: SolidDef): number {
    if (!structural(s)) return this.thin;
    if (PaperBox.painted(s)) return this.front ? NaN : this.frame.front;
    return this.theme.terrainArt || !this.theme.paperSlabs ? this.frame.front : NaN;
  }

  private material(face: Face, color: number): THREE.MeshLambertMaterial {
    const m = new THREE.MeshLambertMaterial({ color: faceColor(face, color), map: this.paper });
    this.shared.push(m);
    return m;
  }

  /** Colours of a slab: the box's paper, or its own terrain style's. */
  private colors(s: SolidDef): Record<Face, number> {
    const t = this.theme;
    const c = colorsFor(s.style, themeDef(this.room.theme).terrain);
    const hex = (h: string): number => parseInt(h.replace('#', ''), 16);
    // A painted paper floor: its sheet on top, the box's front below, its lid's pink along the edge.
    if (PaperBox.painted(s)) return { top: hex(c.top), front: hex(c.base), side: hex(mix(c.base, '#6f6478', 0.08)), bottom: hex(mix(c.base, '#6f6478', 0.14)), rim: hex(c.accent) };
    if (t.paperSlabs && structural(s)) return { top: t.floor, front: t.front, side: t.inner, bottom: t.inner, rim: t.rim };
    return {
      top: hex(mix(c.top, '#ffffff', 0.18)),
      front: hex(c.base),
      side: hex(mix(c.base, '#6f6478', 0.12)),
      bottom: hex(mix(c.base, '#6f6478', 0.2)),
      rim: hex(c.top),
    };
  }

  private buildSlabs(solids: readonly SolidView[]): void {
    // Static slabs of one colour set share one mesh; the rest get their own.
    const groups = new Map<string, { faces: Faces; colors: Record<Face, number> }>();
    for (const sv of solids) {
      const s = sv.def;
      if (s.hidden || s.style === 'none' || this.skip(s)) continue;
      const colors = this.colors(s);
      const faces = new Faces();
      const deep = structural(s);
      const z0 = deep ? this.frame.back : -this.thin;
      const z1 = deep ? this.frame.front : this.thin;
      const lip = deep && !this.front;
      faces.box(s.x, s.y, s.x + s.w, s.y + s.h, z0, z1, { rimBand: deep ? 12 : 0 });
      // Without the box's front: a low raised paper lip along a floor's front edge.
      if (lip) faces.box(s.x, s.y - LIP.h, s.x + s.w, s.y, z1 - LIP.t, z1, { top: 'rim', noBottom: true });
      const dynamic = !!(s.when || s.unless || s.latent || s.grow);
      if (dynamic) {
        const mats = ORDER.map((f) => new THREE.MeshLambertMaterial({ color: faceColor(f, colors[f]), map: this.paper, transparent: false }));
        const mesh = new THREE.Mesh(faces.geometry(ORDER), mats);
        mesh.receiveShadow = true;
        this.group.add(mesh);
        this.slabs.push({ solid: sv, mesh, mats, dynamic, x0: s.x, w: s.w });
        continue;
      }
      const key = ORDER.map((f) => colors[f]).join(',');
      const g = groups.get(key);
      if (!g) groups.set(key, { faces, colors });
      else {
        g.faces.box(s.x, s.y, s.x + s.w, s.y + s.h, z0, z1, { rimBand: deep ? 12 : 0 });
        if (lip) g.faces.box(s.x, s.y - LIP.h, s.x + s.w, s.y, z1 - LIP.t, z1, { top: 'rim', noBottom: true });
      }
    }
    for (const { faces, colors } of groups.values()) {
      const mats = ORDER.map((f) => this.material(f, colors[f]));
      const mesh = new THREE.Mesh(faces.geometry(ORDER), mats);
      mesh.receiveShadow = true;
      this.group.add(mesh);
      this.slabs.push({ solid: null, mesh, mats, dynamic: false, x0: 0, w: 0 });
    }
  }

  /** The box itself: side walls at the room's ends, and a back wall if the theme has one. */
  private buildWalls(): void {
    const f = this.frame;
    const t = this.theme;
    const T = WALL_T;
    // The side walls stand as tall as the box's front, when it has one (the
    // back wall keeps its height: the room's far art shows above it).
    const rim = this.front ? Math.min(f.rim, this.front.top) : f.rim;
    const faces = new Faces();
    const walls = new Faces();
    // Side walls: their inner faces show the box's inside, their tops the rim.
    walls.box(f.x0 - T, rim, f.x0, f.bottom, f.back - T, f.front, { rimBand: 0, top: 'rim', noBottom: true });
    walls.box(f.x1, rim, f.x1 + T, f.bottom, f.back - T, f.front, { rimBand: 0, top: 'rim', noBottom: true });
    if (t.backWall) faces.box(f.x0 - T, f.rim, f.x1 + T, f.bottom, f.back - T, f.back, { top: 'rim', noBottom: true, sides: false });
    const cols: Record<Face, number> = { top: t.rim, front: t.box, side: t.inner, bottom: t.inner, rim: t.rim };
    const wallMats = ORDER.map((k) => this.material(k, k === 'front' ? t.box : k === 'side' ? t.inner : cols[k]));
    const wm = new THREE.Mesh(walls.geometry(ORDER), wallMats);
    wm.receiveShadow = true;
    this.group.add(wm);
    this.geometries.push(wm.geometry);
    if (!faces.empty) {
      const backMats = ORDER.map((k) => this.material(k, k === 'front' ? t.back : cols[k]));
      const bm = new THREE.Mesh(faces.geometry(ORDER), backMats);
      bm.receiveShadow = true;
      this.group.add(bm);
      this.geometries.push(bm.geometry);
    }
  }

  /**
   * Behind a room's own painted box, once it has its real front: plain
   * board up to the front's top, where the tear shows above the painting.
   */
  private buildBoard(): void {
    const f = this.frame;
    const top = this.front!.top;
    const board = new Faces();
    const z = f.back - 2;
    board.quad('front', [f.x0 - WALL_T, -f.floor, z], [f.x1 + WALL_T, -f.floor, z], [f.x1 + WALL_T, -top, z], [f.x0 - WALL_T, -top, z], [0, 0, 1]);
    const mats = ORDER.map((k) => this.material(k, this.theme.back));
    const mesh = new THREE.Mesh(board.geometry(ORDER), mats);
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.geometries.push(mesh.geometry);
  }

  /** Geometry of the box's own walls (disposed with the box). */
  private readonly geometries: THREE.BufferGeometry[] = [];

  /** Slabs follow their solids: shown with their gate, faded with focus, grown in. */
  update(): void {
    for (const s of this.slabs) {
      if (!s.dynamic || !s.solid) continue;
      const sv = s.solid;
      const d = sv.def;
      const img = sv.images[0];
      const visible = d.latent ? true : sv.active;
      const alpha = d.latent ? 0.1 + 0.9 * sv.reveal : sv.active ? (img ? img.alpha : 1) : 0;
      s.mesh.visible = visible && alpha > 0.01 && (!img || img.visible);
      const fading = alpha < 0.995;
      for (const m of s.mats) {
        if (m.transparent !== fading) {
          m.transparent = fading;
          m.depthWrite = !fading;
          m.needsUpdate = true;
        }
        m.opacity = alpha;
      }
      // Growing in (RoomRuntime.growIn crops the art from the left).
      let k = 1;
      if (img && img.isCropped && img._crop && img.width > 0) k = Math.max(0.001, Math.min(1, img._crop.width / img.width));
      s.mesh.scale.x = k;
      s.mesh.position.x = s.x0 * (1 - k);
    }
  }

  dispose(): void {
    for (const s of this.slabs) {
      s.mesh.geometry.dispose();
      for (const m of s.mats) m.dispose();
    }
    for (const m of this.shared) m.dispose();
    for (const g of this.geometries) g.dispose();
    this.group.clear();
  }
}
