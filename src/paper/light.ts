import * as Phaser from 'phaser';
import type { Air } from './air';

// Light and air on the paper stage. One light model for everything: the
// box's shader lights its paper walls per pixel, and every card and figure
// part takes the same light at its four corners (Phaser's two-colour tint,
// interpolated across the quad). Fully lit, a card shows exactly the colours
// it was drawn in; light only ever takes away, so the drawings stay true.
//
// Behind the actors' plane the air thickens with depth (fog); in front of
// it things darken into silhouettes, as in a toy theatre seen from the
// stalls. The picture's edges sink into a vignette (the box's front shader).

/** A point light in the room (world px; z toward the viewer). */
export interface PaperLight {
  x: number;
  y: number;
  z: number;
  color: number;
  /** Reach, world px: no light beyond it. */
  radius: number;
  /** Strength at the light (1: full light right at it). */
  intensity: number;
  /** 0..1: a flame's unsteadiness. */
  flicker?: number;
  /** Follows something (the light moves with it); null hides the light. */
  follow?: () => { x: number; y: number; z?: number } | null;
  /** Throws the figures' shadows (default yes; a figure's own glow does not). */
  cast?: boolean;
}

export interface Mood {
  /** Light everywhere, before any lamp (0..1), and its colour. */
  ambient: number;
  ambientColor: number;
  /** Air behind the actors' plane: thickest at `far` world px back. */
  fog: { color: number; amount: number; near: number; far: number };
  /** In front of the actors' plane: darkening into silhouettes from `from` to `to` world px. */
  front: { color: number; amount: number; from: number; to: number };
  /** Darkness at the picture's edges (0..1). */
  vignette: number;
  /**
   * A soft lamp before the stage that goes with the eye (keeps the play
   * readable, and throws the figures' shadows up the back wall): how high
   * over the floor, how far toward the viewer, and how far beside the eye.
   */
  key?: { color: number; intensity: number; radius: number; above: number; z: number; lead?: number };
  /** How much a light still reaches the side of the paper turned from it (0..1). */
  wrap: number;
  /** Motes drifting in the air (air.ts). */
  air?: Air;
}

/** Whimsical night: a dark toy theatre in violet air, warm and coloured pools of light, plum silhouettes. */
export const WHIMSICAL: Mood = {
  ambient: 0.46,
  ambientColor: 0xa69cd4,
  fog: { color: 0x3e3560, amount: 0.46, near: 30, far: 300 },
  front: { color: 0x211a30, amount: 0.92, from: 20, to: 100 },
  vignette: 0.55,
  wrap: 0.5,
  key: { color: 0xffe2c0, intensity: 0.36, radius: 1500, above: 230, z: 620, lead: -150 },
  air: { colors: [0xfff0c8, 0xe4d6ff, 0xc6fff2, 0xffd2ee], count: 70, rise: 9, glow: 1 },
};

/** Little Nightmares: dark blue air, deep shadows, black silhouettes. */
export const NIGHTMARE: Mood = {
  ambient: 0.34,
  ambientColor: 0x8e98b8,
  fog: { color: 0x2c2f40, amount: 0.55, near: 30, far: 300 },
  front: { color: 0x120f18, amount: 0.95, from: 20, to: 90 },
  vignette: 0.68,
  wrap: 0.4,
  key: { color: 0xc8d2ff, intensity: 0.24, radius: 1400, above: 250, z: 600, lead: 140 },
  air: { colors: [0xcfcadc, 0xa9a3bb], count: 60, rise: -5, glow: 0.45 },
};

/** Daylight: everything as drawn (no lights needed). */
export const DAY: Mood = {
  ambient: 1,
  ambientColor: 0xffffff,
  fog: { color: 0xffffff, amount: 0, near: 0, far: 1 },
  front: { color: 0x000000, amount: 0, from: 0, to: 1 },
  vignette: 0,
  wrap: 1,
};

/** The most lights the box's shader takes. */
export const MAX_LIGHTS = 8;

const r8 = (c: number): number => ((c >> 16) & 255) / 255;
const g8 = (c: number): number => ((c >> 8) & 255) / 255;
const b8 = (c: number): number => (c & 255) / 255;
const smooth = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const pack = (r: number, g: number, b: number): number => {
  const c = (v: number): number => Math.max(0, Math.min(255, Math.round(v * 255)));
  return (c(r) << 16) | (c(g) << 8) | c(b);
};

/** A light as it shines this frame. */
interface Lit {
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
  radius: number;
  cast: boolean;
}

type Tintable = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.Tint &
  Phaser.GameObjects.Components.Transform &
  Phaser.GameObjects.Components.Origin &
  Phaser.GameObjects.Components.Size &
  Phaser.GameObjects.Components.Visible & { blendMode: number | string };

/** What the lighting last wrote on an object (so it notices when the game tints it itself). */
interface Mark {
  tl: number;
  tr: number;
  bl: number;
  br: number;
}

export class Lighting {
  mood: Mood;
  readonly lights = new Set<PaperLight>();
  /** This frame's lights, as the shader and the cards take them. */
  private lit: Lit[] = [];
  private t = 0;
  private readonly marks = new WeakMap<object, Mark | 'game'>();
  private readonly mat = new Phaser.GameObjects.Components.TransformMatrix();
  private readonly parentMat = new Phaser.GameObjects.Components.TransformMatrix();

  constructor(mood: Mood) {
    this.mood = mood;
  }

  /** Leaves an object as it is drawn (a glow: it is light itself). */
  leave(obj: object): void {
    this.marks.set(obj, 'game');
  }

  add(light: PaperLight): PaperLight {
    this.lights.add(light);
    return light;
  }

  remove(light: PaperLight): void {
    this.lights.delete(light);
  }

  /** Moves the lights for this frame (followers, flames); `eye` carries the mood's key light. */
  update(dt: number, eye: { x: number; floor: number }): void {
    this.t += dt;
    this.lit = [];
    const key = this.mood.key;
    if (key) this.lit.push({ x: eye.x + (key.lead ?? 0), y: eye.floor - key.above, z: key.z, r: r8(key.color) * key.intensity, g: g8(key.color) * key.intensity, b: b8(key.color) * key.intensity, radius: key.radius, cast: true });
    for (const l of this.lights) {
      let { x, y, z } = l;
      if (l.follow) {
        const at = l.follow();
        if (!at) continue;
        x = at.x;
        y = at.y;
        z = at.z ?? z;
      }
      let k = l.intensity;
      if (l.flicker) {
        const t = this.t * 9 + x * 0.013;
        k *= 1 - l.flicker * (0.5 + 0.5 * Math.sin(t) * Math.sin(t * 0.37 + 1.7));
      }
      this.lit.push({ x, y, z, r: r8(l.color) * k, g: g8(l.color) * k, b: b8(l.color) * k, radius: l.radius, cast: l.cast ?? true });
    }
    // The strongest first: the shader's few slots go to the lights that show most.
    this.lit.sort((a, b) => b.r + b.g + b.b - (a.r + a.g + a.b));
  }

  /** The lights for the box's shader: positions with reach, colours with strength. */
  shaderLights(pos: Float32Array, col: Float32Array): number {
    const n = Math.min(MAX_LIGHTS, this.lit.length);
    for (let i = 0; i < n; i++) {
      const l = this.lit[i]!;
      pos.set([l.x, l.y, l.z, l.radius], i * 4);
      col.set([l.r, l.g, l.b, 0], i * 4);
    }
    return n;
  }

  /**
   * The lamp that throws a figure's shadow at (x, y, z): the one lighting
   * it most from above y, where it is, and how strongly it lights it (k;
   * 0: none does).
   */
  casterAt(x: number, y: number, z: number, out: { x: number; y: number; z: number; k: number }): void {
    out.k = 0;
    for (const l of this.lit) {
      if (!l.cast || l.y > y) continue;
      const dx = x - l.x;
      const dy = y - l.y;
      const dz = z - l.z;
      const q = (dx * dx + dy * dy + dz * dz) / (l.radius * l.radius);
      if (q >= 1) continue;
      const k = ((1 - q) * (1 - q) * (l.r + l.g + l.b)) / 3;
      if (k <= out.k) continue;
      out.k = k;
      out.x = l.x;
      out.y = l.y;
      out.z = l.z;
    }
  }

  /** Light reaching a card at (x, y, z) facing the viewer: rgb, each 0..1. */
  private light(x: number, y: number, z: number, out: [number, number, number]): void {
    const m = this.mood;
    let r = r8(m.ambientColor) * m.ambient;
    let g = g8(m.ambientColor) * m.ambient;
    let b = b8(m.ambientColor) * m.ambient;
    const w = m.wrap;
    for (const l of this.lit) {
      const dx = l.x - x;
      const dy = l.y - y;
      const dz = l.z - z;
      const d2 = dx * dx + dy * dy + dz * dz;
      const q = d2 / (l.radius * l.radius);
      if (q >= 1) continue;
      const att = (1 - q) * (1 - q);
      // The card faces +z; paper lets a little light round to its back.
      const ndl = dz / Math.sqrt(d2 + 1e-6);
      const diff = Math.max(0, (ndl + w) / (1 + w));
      r += l.r * att * diff;
      g += l.g * att * diff;
      b += l.b * att * diff;
    }
    out[0] = Math.min(1, r);
    out[1] = Math.min(1, g);
    out[2] = Math.min(1, b);
  }

  /** The tint pair (a + (b - a) * colour) for a point of a card at depth z. */
  private tintAt(x: number, y: number, z: number, out: { a: number; b: number }): void {
    const m = this.mood;
    const L = this.rgb;
    this.light(x, y, z, L);
    // Fog behind, silhouettes in front.
    const f = z < 0 ? m.fog.amount * smooth(m.fog.near, m.fog.far, -z) : 0;
    const s = z > 0 ? m.front.amount * smooth(m.front.from, m.front.to, z) : 0;
    const fr = r8(m.fog.color) * f;
    const fg = g8(m.fog.color) * f;
    const fb = b8(m.fog.color) * f;
    // a: what black becomes; b: what white becomes.
    const ar = (1 - s) * fr + s * r8(m.front.color);
    const ag = (1 - s) * fg + s * g8(m.front.color);
    const ab = (1 - s) * fb + s * b8(m.front.color);
    out.a = pack(ar, ag, ab);
    out.b = pack(ar + (1 - s) * (1 - f) * L[0], ag + (1 - s) * (1 - f) * L[1], ab + (1 - s) * (1 - f) * L[2]);
  }

  private readonly rgb: [number, number, number] = [1, 1, 1];
  private readonly c = [
    { a: 0, b: 0 },
    { a: 0, b: 0 },
    { a: 0, b: 0 },
    { a: 0, b: 0 },
  ];

  /**
   * Lights an object standing at depth z (and, for a container, all that
   * is in it). Additive glows are light themselves and are left alone, as
   * is anything the game has tinted itself.
   */
  apply(obj: Phaser.GameObjects.GameObject, z: number): void {
    if (obj instanceof Phaser.GameObjects.Container) {
      if (!obj.visible) return;
      for (const child of obj.list) this.apply(child, z);
      return;
    }
    const o = obj as Tintable;
    if (typeof o.setTint2 !== 'function' || !o.visible) return;
    if (o.blendMode === Phaser.BlendModes.ADD || o.blendMode === 'ADD') return;
    const mark = this.marks.get(o);
    if (mark === 'game') return;
    if (mark) {
      if (o.tintTopLeft !== mark.tl || o.tintTopRight !== mark.tr || o.tintBottomLeft !== mark.bl || o.tintBottomRight !== mark.br) {
        // The game tinted it since: it is the game's now.
        this.marks.set(o, 'game');
        return;
      }
    } else if (o.tintTopLeft !== 0xffffff || o.tintTopRight !== 0xffffff || o.tintBottomLeft !== 0xffffff || o.tintBottomRight !== 0xffffff) {
      this.marks.set(o, 'game');
      return;
    }
    // The quad's corners in the world (rotation and parents included).
    const m = o.getWorldTransformMatrix(this.mat, this.parentMat);
    const w = o.width;
    const h = o.height;
    const x0 = -o.originX * w;
    const y0 = -o.originY * h;
    const corners: [number, number][] = [
      [x0, y0],
      [x0 + w, y0],
      [x0, y0 + h],
      [x0 + w, y0 + h],
    ];
    corners.forEach(([lx, ly], i) => this.tintAt(m.getX(lx, ly), m.getY(lx, ly), z, this.c[i]!));
    const [tl, tr, bl, br] = this.c as [{ a: number; b: number }, { a: number; b: number }, { a: number; b: number }, { a: number; b: number }];
    // Flipped art keeps its corners' light where they are in the world.
    const fx = (o as unknown as { flipX?: boolean }).flipX;
    const fy = (o as unknown as { flipY?: boolean }).flipY;
    const pick = (a: number, b: number): [number, number] => (fx ? [b, a] : [a, b]);
    let [ta, tb] = pick(0, 1);
    let [ba, bb] = pick(2, 3);
    if (fy) [ta, tb, ba, bb] = [ba, bb, ta, tb];
    const q = [tl, tr, bl, br];
    o.setTintMode(Phaser.TintModes.MULTIPLY_TWO);
    o.setTint(q[ta]!.b, q[tb]!.b, q[ba]!.b, q[bb]!.b);
    o.setTint2(q[ta]!.a, q[tb]!.a, q[ba]!.a, q[bb]!.a);
    this.marks.set(o, { tl: o.tintTopLeft, tr: o.tintTopRight, bl: o.tintBottomLeft, br: o.tintBottomRight });
  }
}
