import * as THREE from 'three';
import { mix } from '../art/palette';
import { themeDef } from '../art/backgrounds';
import { colorsFor } from '../art/terrain';
import type { RoomDef, SolidDef } from '../data/roomTypes';
import { structural, type BoxFrame, type BoxTheme } from './themes';

// The room as an open-front paper box: its terrain stands as slabs of
// paper board with real depth (floors seen from above, walls with their
// inner faces, ledges as thin shelves), the box's side walls at the room's
// ends with a rim along their tops, and a back wall behind everything that
// belongs inside the room when the theme builds one. The painted terrain
// art of the flat game stands on the slabs' fronts (see Mirror, 'terrain').

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
  ) {
    this.group.name = 'box';
    this.thin = Math.min(44, theme.frontDepth);
    this.buildSlabs(solids);
    this.buildWalls();
  }

  /** Depth of the front face of a solid's slab; NaN where its painted art is not shown (clean paper). */
  frontZ(s: SolidDef): number {
    if (!structural(s)) return this.thin;
    return this.theme.terrainArt || !this.theme.paperSlabs ? this.frame.front : NaN;
  }

  private material(color: number): THREE.MeshLambertMaterial {
    const m = new THREE.MeshLambertMaterial({ color, map: this.paper });
    this.shared.push(m);
    return m;
  }

  /** Colours of a slab: the box's paper, or its own terrain style's. */
  private colors(s: SolidDef): Record<Face, number> {
    const t = this.theme;
    if (t.paperSlabs && structural(s)) return { top: t.floor, front: t.front, side: t.inner, bottom: t.inner, rim: t.rim };
    const c = colorsFor(s.style, themeDef(this.room.theme).terrain);
    const hex = (h: string): number => parseInt(h.replace('#', ''), 16);
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
      faces.box(s.x, s.y, s.x + s.w, s.y + s.h, z0, z1, { rimBand: deep ? 12 : 0 });
      const dynamic = !!(s.when || s.unless || s.latent || s.grow);
      if (dynamic) {
        const mats = ORDER.map((f) => new THREE.MeshLambertMaterial({ color: colors[f], map: this.paper, transparent: false }));
        const mesh = new THREE.Mesh(faces.geometry(ORDER), mats);
        mesh.receiveShadow = true;
        this.group.add(mesh);
        this.slabs.push({ solid: sv, mesh, mats, dynamic, x0: s.x, w: s.w });
        continue;
      }
      const key = ORDER.map((f) => colors[f]).join(',');
      const g = groups.get(key);
      if (!g) groups.set(key, { faces, colors });
      else g.faces.box(s.x, s.y, s.x + s.w, s.y + s.h, z0, z1, { rimBand: deep ? 12 : 0 });
    }
    for (const { faces, colors } of groups.values()) {
      const mats = ORDER.map((f) => this.material(colors[f]));
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
    const T = 26;
    const faces = new Faces();
    const walls = new Faces();
    // Side walls: their inner faces show the box's inside, their tops the rim.
    walls.box(f.x0 - T, f.rim, f.x0, f.bottom, f.back - T, f.front, { rimBand: 0, top: 'rim', noBottom: true });
    walls.box(f.x1, f.rim, f.x1 + T, f.bottom, f.back - T, f.front, { rimBand: 0, top: 'rim', noBottom: true });
    if (t.backWall) faces.box(f.x0 - T, f.rim, f.x1 + T, f.bottom, f.back - T, f.back, { top: 'rim', noBottom: true, sides: false });
    const cols: Record<Face, number> = { top: t.rim, front: t.box, side: t.inner, bottom: t.inner, rim: t.rim };
    const wallMats = ORDER.map((k) => this.material(k === 'front' ? t.box : k === 'side' ? t.inner : cols[k]));
    const wm = new THREE.Mesh(walls.geometry(ORDER), wallMats);
    wm.receiveShadow = true;
    this.group.add(wm);
    if (!faces.empty) {
      const backMats = ORDER.map((k) => this.material(k === 'front' ? t.back : cols[k]));
      const bm = new THREE.Mesh(faces.geometry(ORDER), backMats);
      bm.receiveShadow = true;
      this.group.add(bm);
    }
  }

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
    this.group.clear();
  }
}
