import * as Phaser from 'phaser';
import type { Lens } from './lens';

// The paper box every room is staged in, drawn in true perspective by two
// shaders that cast a ray through each device pixel:
//
//  - the inside (back wall, floor, side walls, the lid's underside, and the
//    lid's top when the eye is above it), behind every card;
//  - the box's front face, torn open where the game is played, in front of
//    every card standing inside the box.
//
// Everything is computed per pixel at the screen's own resolution: the
// paper's grain and pencil hatching lie on the surfaces (they recede with
// them), the box's edges are inked as the paintings ink them, and nothing is
// a stretched texture, so nothing ever blurs.

export interface BoxColors {
  /** The paper inside: back wall, floor, side walls, the lid's underside. */
  back: number;
  floor: number;
  side: number;
  ceiling: number;
  /** The front edge of the floor (paper seen edge-on). */
  edge: number;
  /** The box's outside: its front face and the lid's top. */
  outer: number;
  lid: number;
  /** The white core of torn paper. */
  core: number;
  /** Ink. */
  ink: number;
  /** Beyond the box. */
  outside: number;
  /** Down a gap in the floor. */
  pit: number;
}

export interface BoxSpec {
  /** Inside walls, world px: left, right, the lid (top) and the floor. */
  x0: number;
  x1: number;
  top: number;
  floor: number;
  /** World y of the box's bottom edge (the front face reaches down to it). */
  bottom: number;
  /** Depths of the back wall and of the box's front (the actors walk at 0). */
  back: number;
  front: number;
  colors: BoxColors;
  /** Spans of x with no floor (pits, a river): [x0, x1]. */
  gaps?: readonly (readonly [number, number])[];
  /**
   * The torn opening in the front face, as insets from the box's edges
   * (world px): how far below the top and above the floor line it is torn,
   * and how far in from each side. The tear wanders by `wander` and is
   * jagged by `jag`; `seed` picks its shape.
   */
  tear: { top: number; bottom: number; left: number; right: number; wander: number; jag: number; seed: number };
  /** The pencil on the paper: grain and hatching strength (0..1), hatch spacing (world px). */
  paper?: { grain: number; hatch: number; spacing: number };
}

const rgb = (c: number): { x: number; y: number; z: number } => ({ x: ((c >> 16) & 255) / 255, y: ((c >> 8) & 255) / 255, z: (c & 255) / 255 });

const MAX_GAPS = 6;
export const MAX_SHADOWS = 24;

const HEADER = (deriv: boolean): string => `${deriv ? '#extension GL_OES_standard_derivatives : enable\n#define DERIV 1\n' : ''}
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 resolution;
uniform vec4 uLens;
uniform vec3 uEye;
uniform vec4 uBox;
uniform vec4 uDepth;
uniform vec4 uPaper;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * noise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return s;
}
// Coverage of a line of width w (device px) at distance d (device px).
float ink(float d, float w) {
  return 1.0 - smoothstep(w * 0.5 - 0.6, w * 0.5 + 0.6, d);
}
// The paper of the box at a surface point (uv: world px on the surface);
// k: device px per world px there (for the pencil's line width).
vec3 paper(vec3 base, vec2 uv, float k) {
  float blot = fbm(uv * 0.018 + uPaper.w) - 0.5;
  float fibre = noise(uv * 0.55) - 0.5;
  vec3 c = base * (1.0 + uPaper.x * (0.55 * blot + 0.3 * fibre));
  // Pencil hatching in two diagonals, a little uneven like hand strokes.
  float sp = uPaper.z;
  float a = (uv.x + uv.y) / sp + 0.35 * noise(uv * 0.011);
  float b = (uv.x - uv.y) / sp + 0.35 * noise(uv * 0.013 + 5.0);
#ifdef DERIV
  float wa = max(fwidth(a), 1e-4);
  float wb = max(fwidth(b), 1e-4);
#else
  float wa = 0.7071 / (sp * k);
  float wb = wa;
#endif
  // Lines under a pixel wide (distance from the nearest one, in device px),
  // fading out where they would crowd closer than about 3 px.
  float da = abs(fract(a + 0.5) - 0.5) / wa;
  float db = abs(fract(b + 0.5) - 0.5) / wb;
  float la = (1.0 - smoothstep(0.25, 1.0, da)) * (1.0 - smoothstep(0.2, 0.34, wa));
  float lb = (1.0 - smoothstep(0.25, 1.0, db)) * (1.0 - smoothstep(0.2, 0.34, wb));
  float gate = smoothstep(0.35, 0.6, noise(uv * 0.004 + 3.0));
  float h = uPaper.y * (la * 0.8 + lb * 0.55 * gate);
  return mix(c, c * 0.82, h);
}
`;

const INSIDE_FRAG = (deriv: boolean): string => `${HEADER(deriv)}
uniform vec3 uBack;
uniform vec3 uFloor;
uniform vec3 uSide;
uniform vec3 uCeil;
uniform vec3 uEdge;
uniform vec3 uLid;
uniform vec3 uOutside;
uniform vec3 uInk;
uniform vec3 uPit;
uniform vec4 uSeg[8];
uniform vec4 uGap[${MAX_GAPS}];
uniform float uGaps;
uniform vec4 uShadow[${MAX_SHADOWS}];
uniform float uShadows;
uniform float uInkW;

float segDist(vec2 p, vec4 s) {
  vec2 a = s.xy;
  vec2 b = s.zw;
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  return length(p - a - ab * t);
}

void main() {
  vec2 q = vec2(gl_FragCoord.x, uLens.w - gl_FragCoord.y);
  float f = uLens.x;
  vec3 d = vec3((q.x - uLens.y) / f, (q.y - uLens.z) / f, -1.0);
  float x0 = uBox.x;
  float x1 = uBox.y;
  float top = uBox.z;
  float flo = uBox.w;
  float back = uDepth.x;
  float front = uDepth.y;
  // Where the ray crosses the box's front plane.
  float tf = uEye.z - front;
  vec2 fp = uEye.xy + d.xy * tf;
  vec3 col;
  bool inside = fp.x > x0 && fp.x < x1 && fp.y > top;
  if (fp.y > flo && inside) {
    // Below the floor line at the front: the floor's paper, edge-on.
    col = paper(uEdge, vec2(fp.x, fp.y * 3.0), f / tf);
  } else if (!inside) {
    // Over the box: the lid's top when the eye is above it, else the world beyond.
    float tl = d.y > 0.0 ? (top - uEye.y) / d.y : -1.0;
    vec3 lp = uEye + d * tl;
    if (uEye.y < top && tl > 0.0 && lp.z > back && lp.z < front && lp.x > x0 && lp.x < x1) {
      col = paper(uLid, lp.xz, f / tl);
    } else {
      gl_FragColor = vec4(uOutside, 1.0);
      return;
    }
  } else {
    // Inside: the first wall the ray leaves the box by.
    float tb = uEye.z - back;
    float ts = d.x > 0.0 ? (x1 - uEye.x) / d.x : (d.x < 0.0 ? (x0 - uEye.x) / d.x : 1e9);
    float ty = d.y > 0.0 ? (flo - uEye.y) / d.y : (d.y < 0.0 ? (top - uEye.y) / d.y : 1e9);
    float t = min(tb, min(ts, ty));
    vec3 p = uEye + d * t;
    float k = f / t;
    // Soft shade where walls meet (world px to the nearest corner).
    float ao;
    if (t == tb) {
      col = paper(uBack, p.xy, k);
      ao = min(min(p.x - x0, x1 - p.x), min(flo - p.y, p.y - top));
    } else if (t == ts) {
      col = paper(uSide, p.zy, k);
      ao = min(p.z - back, min(flo - p.y, p.y - top));
    } else if (d.y > 0.0) {
      col = paper(uFloor, p.xz, k);
      ao = min(p.z - back, min(p.x - x0, x1 - p.x));
      // Gaps in the floor: dark, deeper toward the back.
      for (int i = 0; i < ${MAX_GAPS}; i++) {
        if (float(i) >= uGaps) break;
        vec4 g = uGap[i];
        if (p.x > g.x && p.x < g.y) {
          float lip = min(p.x - g.x, g.y - p.x);
          col = mix(uPit, uPit * 0.7, clamp((front - p.z) / (front - back), 0.0, 1.0));
          col = mix(col * 0.75, col, smoothstep(0.0, 18.0, lip));
        }
      }
      // Contact shadows of whatever stands on the floor.
      float sh = 0.0;
      for (int i = 0; i < ${MAX_SHADOWS}; i++) {
        if (float(i) >= uShadows) break;
        vec4 s = uShadow[i];
        vec2 r = vec2((p.x - s.x) / s.z, (p.z - s.y) / (s.z * 0.55));
        sh = max(sh, s.w * (1.0 - smoothstep(0.35, 1.0, length(r))));
      }
      col *= 1.0 - 0.28 * sh;
    } else {
      col = paper(uCeil, p.xz, k);
      ao = min(p.z - back, min(p.x - x0, x1 - p.x));
    }
    col *= 0.86 + 0.14 * smoothstep(0.0, 70.0, ao);
  }
  // The box's corners, inked.
  float w = uInkW;
  float m = 0.0;
  for (int i = 0; i < 8; i++) m = max(m, ink(segDist(q, uSeg[i]), w));
  col = mix(col, uInk, m);
  gl_FragColor = vec4(col, 1.0);
}
`;

const FRONT_FRAG = (deriv: boolean): string => `${HEADER(deriv)}
uniform vec3 uOuter;
uniform vec3 uCore;
uniform vec3 uInk;
uniform vec4 uTear;
uniform vec4 uTear2;
uniform float uInkW;
uniform float uBottom;

// How far a point on the front face is inside the torn hole (world px;
// positive inside the hole).
float hole(vec2 p) {
  float x0 = uBox.x + uTear.z;
  float x1 = uBox.y - uTear.w;
  float y0 = uBox.z + uTear.x;
  float y1 = uBox.w + uTear.y;
  float wander = uTear2.x;
  float jag = uTear2.y;
  float seed = uTear2.z;
  // Inset of a soft-cornered rectangle, then torn: the edge wanders slowly
  // and is ragged at a small scale, like paper pulled apart.
  vec2 c = vec2(0.5 * (x0 + x1), 0.5 * (y0 + y1));
  vec2 hs = vec2(0.5 * (x1 - x0), 0.5 * (y1 - y0));
  float r = min(60.0, min(hs.x, hs.y));
  vec2 e = abs(p - c) - hs + r;
  float sd = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0) - r;
  float slow = (fbm(p * 0.006 + seed) - 0.5) * 2.0 * wander;
  float fast = (noise(p * 0.09 + seed * 3.1) - 0.5) * jag + (noise(p * 0.23 + seed) - 0.5) * jag * 0.5;
  return -(sd + slow + fast);
}

void main() {
  vec2 q = vec2(gl_FragCoord.x, uLens.w - gl_FragCoord.y);
  float f = uLens.x;
  vec2 d = vec2((q.x - uLens.y) / f, (q.y - uLens.z) / f);
  float tf = uEye.z - uDepth.y;
  float k = f / tf;
  vec2 p = uEye.xy + d * tf;
  // Off the box's front face: nothing here.
  float ex = min(p.x - uBox.x, uBox.y - p.x);
  float ey = min(p.y - uBox.z, uBottom - p.y);
  float edge = min(ex, ey);
  if (edge < -uInkW / k) discard;
  float h = hole(p) * k;
  // In the hole: see through (with the ink of the tear at its rim).
  float w = uInkW;
  float rim = ink(abs(h), w);
  if (h > w) discard;
  vec3 col = paper(uOuter, p, k);
  // The white core of the torn paper, a few px wide and uneven.
  float coreW = (2.5 + 3.5 * noise(p * 0.05 + 9.0)) * k;
  col = mix(col, uCore, (1.0 - smoothstep(coreW - 0.8, coreW + 0.8, -h)));
  col = mix(col, uInk, rim);
  // The box's own outline.
  col = mix(col, uInk, ink(abs(edge * k), w * 1.2));
  float a = (h > 0.0 ? rim : 1.0) * (edge < 0.0 ? ink(abs(edge * k), w * 1.2) : 1.0);
  gl_FragColor = vec4(col * a, a);
}
`;

let shaderSeq = 0;

/** The box of one room: its two shader faces and what they need each frame. */
export class PaperBox {
  /** The inside of the box (and what is outside it), behind everything. */
  readonly inside: Phaser.GameObjects.Shader | Phaser.GameObjects.Graphics;
  /** The torn front face, before the box's inside planes. */
  readonly frontFace: Phaser.GameObjects.Shader | Phaser.GameObjects.Graphics;
  /** Without WebGL (the Canvas renderer): the box in flat colours, drawn each frame. */
  private readonly flat: { inside: Phaser.GameObjects.Graphics; front: Phaser.GameObjects.Graphics } | null = null;
  readonly shadows = new Float32Array(MAX_SHADOWS * 4);
  shadowCount = 0;
  private readonly seg = new Float32Array(32);
  private readonly gap = new Float32Array(MAX_GAPS * 4);
  /** Ink width of the box's edges, device px. */
  inkWidth = 4;

  constructor(
    scene: Phaser.Scene,
    readonly spec: BoxSpec,
  ) {
    if (scene.game.renderer.type !== Phaser.WEBGL) {
      const g = { inside: scene.add.graphics(), front: scene.add.graphics() };
      this.flat = g;
      this.inside = g.inside;
      this.frontFace = g.front;
      return;
    }
    const gl = (scene.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).gl;
    const deriv = !!gl?.getExtension('OES_standard_derivatives');
    const id = ++shaderSeq;
    const c = spec.colors;
    const paperU = spec.paper ?? { grain: 0.06, hatch: 0.22, spacing: 16 };
    const common = {
      uLens: { type: '4f', value: { x: 1, y: 0, z: 0, w: 1 } },
      uEye: { type: '3f', value: { x: 0, y: 0, z: 1 } },
      uBox: { type: '4f', value: { x: spec.x0, y: spec.x1, z: spec.top, w: spec.floor } },
      uDepth: { type: '4f', value: { x: spec.back, y: spec.front, z: 0, w: 0 } },
      uPaper: { type: '4f', value: { x: paperU.grain, y: paperU.hatch, z: paperU.spacing, w: (spec.tear.seed % 97) * 0.37 } },
      uInk: { type: '3f', value: rgb(c.ink) },
      uInkW: { type: '1f', value: this.inkWidth },
    };
    const inside = new Phaser.Display.BaseShader(`paper.inside.${id}`, INSIDE_FRAG(deriv), undefined, {
      ...common,
      uBack: { type: '3f', value: rgb(c.back) },
      uFloor: { type: '3f', value: rgb(c.floor) },
      uSide: { type: '3f', value: rgb(c.side) },
      uCeil: { type: '3f', value: rgb(c.ceiling) },
      uEdge: { type: '3f', value: rgb(c.edge) },
      uLid: { type: '3f', value: rgb(c.lid) },
      uOutside: { type: '3f', value: rgb(c.outside) },
      uPit: { type: '3f', value: rgb(c.pit) },
      uSeg: { type: '4fv', value: this.seg },
      uGap: { type: '4fv', value: this.gap },
      uGaps: { type: '1f', value: 0 },
      uShadow: { type: '4fv', value: this.shadows },
      uShadows: { type: '1f', value: 0 },
    });
    const t = spec.tear;
    const front = new Phaser.Display.BaseShader(`paper.front.${id}`, FRONT_FRAG(deriv), undefined, {
      ...common,
      uOuter: { type: '3f', value: rgb(c.outer) },
      uCore: { type: '3f', value: rgb(c.core) },
      uTear: { type: '4f', value: { x: t.top, y: t.bottom, z: t.left, w: t.right } },
      uTear2: { type: '4f', value: { x: t.wander, y: t.jag, z: (t.seed % 101) * 1.37, w: 0 } },
      uBottom: { type: '1f', value: spec.bottom },
    });
    const { width, height } = scene.scale;
    this.inside = scene.add.shader(inside, 0, 0, width, height).setOrigin(0, 0);
    this.frontFace = scene.add.shader(front, 0, 0, width, height).setOrigin(0, 0);
    const gaps = (spec.gaps ?? []).slice(0, MAX_GAPS);
    gaps.forEach(([a, b], i) => this.gap.set([a, b, 0, 0], i * 4));
    this.inside.setUniform('uGaps.value', gaps.length);
  }

  /** Before each frame: the lens, the inked corners, the shadows. */
  update(lens: Lens): void {
    if (this.flat) {
      this.drawFlat(lens, this.flat.inside, this.flat.front);
      return;
    }
    const { w, h } = lens;
    for (const sh of [this.inside, this.frontFace] as Phaser.GameObjects.Shader[]) {
      if (sh.width !== w || sh.height !== h) sh.setSize(w, h);
      sh.setUniform('uLens.value.x', lens.f);
      sh.setUniform('uLens.value.y', lens.cx);
      sh.setUniform('uLens.value.z', lens.cy);
      sh.setUniform('uLens.value.w', h);
      sh.setUniform('uEye.value.x', lens.eye.x);
      sh.setUniform('uEye.value.y', lens.eye.y);
      sh.setUniform('uEye.value.z', lens.eye.z);
      sh.setUniform('uInkW.value', this.inkWidth);
    }
    // The eight inside corners of the box, on screen.
    const s = this.spec;
    const P = (x: number, y: number, z: number): [number, number] => {
      const p = lens.project(x, y, z);
      return [p.x, p.y];
    };
    const corners: [number, number, number][][] = [
      [[s.x0, s.top, s.back], [s.x1, s.top, s.back]],
      [[s.x0, s.floor, s.back], [s.x1, s.floor, s.back]],
      [[s.x0, s.top, s.back], [s.x0, s.floor, s.back]],
      [[s.x1, s.top, s.back], [s.x1, s.floor, s.back]],
      [[s.x0, s.floor, s.back], [s.x0, s.floor, s.front]],
      [[s.x1, s.floor, s.back], [s.x1, s.floor, s.front]],
      [[s.x0, s.top, s.back], [s.x0, s.top, s.front]],
      [[s.x1, s.top, s.back], [s.x1, s.top, s.front]],
    ];
    corners.forEach(([a, b], i) => {
      const pa = P(a[0], a[1], a[2]);
      const pb = P(b[0], b[1], b[2]);
      this.seg.set([pa[0], pa[1], pb[0], pb[1]], i * 4);
    });
    (this.inside as Phaser.GameObjects.Shader).setUniform('uShadows.value', this.shadowCount);
  }

  /** The box in flat colours (no grain, no tear): for the Canvas renderer. */
  private drawFlat(lens: Lens, g: Phaser.GameObjects.Graphics, f: Phaser.GameObjects.Graphics): void {
    const s = this.spec;
    const c = s.colors;
    const P = (x: number, y: number, z: number): Phaser.Math.Vector2 => {
      const p = lens.project(x, y, z);
      return new Phaser.Math.Vector2(p.x, p.y);
    };
    const quad = (gr: Phaser.GameObjects.Graphics, color: number, pts: Phaser.Math.Vector2[], alpha = 1): void => {
      gr.fillStyle(color, alpha).fillPoints(pts, true);
    };
    g.clear();
    g.fillStyle(c.outside, 1).fillRect(0, 0, lens.w, lens.h);
    const { x0, x1, top, floor, back, front } = s;
    quad(g, c.back, [P(x0, top, back), P(x1, top, back), P(x1, floor, back), P(x0, floor, back)]);
    quad(g, c.ceiling, [P(x0, top, back), P(x1, top, back), P(x1, top, front), P(x0, top, front)]);
    quad(g, c.side, [P(x0, top, back), P(x0, floor, back), P(x0, floor, front), P(x0, top, front)]);
    quad(g, c.side, [P(x1, top, back), P(x1, floor, back), P(x1, floor, front), P(x1, top, front)]);
    quad(g, c.floor, [P(x0, floor, back), P(x1, floor, back), P(x1, floor, front), P(x0, floor, front)]);
    for (const [a, b] of (s.gaps ?? []).slice(0, MAX_GAPS)) quad(g, c.pit, [P(a, floor, back), P(b, floor, back), P(b, floor, front), P(a, floor, front)]);
    for (let i = 0; i < this.shadowCount; i++) {
      const [x, z, r, a] = this.shadows.subarray(i * 4, i * 4 + 4);
      const mid = P(x, floor, z);
      const rx = r * lens.scale(z);
      const ry = Math.max(1, Math.abs(P(x, floor, z + r).y - P(x, floor, z - r).y) / 2);
      g.fillStyle(0x1d1820, 0.32 * a).fillEllipse(mid.x, mid.y, rx * 2, ry * 2);
    }
    g.lineStyle(this.inkWidth, c.ink, 0.85);
    const edges: [number, number, number, number, number, number][] = [
      [x0, top, back, x1, top, back],
      [x0, floor, back, x1, floor, back],
      [x0, top, back, x0, floor, back],
      [x1, top, back, x1, floor, back],
      [x0, floor, back, x0, floor, front],
      [x1, floor, back, x1, floor, front],
    ];
    for (const e of edges) {
      const a = P(e[0], e[1], e[2]);
      const b = P(e[3], e[4], e[5]);
      g.lineBetween(a.x, a.y, b.x, b.y);
    }
    // The front face around its hole.
    const t = s.tear;
    const o0 = P(x0, top, front);
    const o1 = P(x1, s.bottom, front);
    const h0 = P(x0 + t.left, top + t.top, front);
    const h1 = P(x1 - t.right, floor + t.bottom, front);
    f.clear();
    f.fillStyle(c.outer, 1);
    f.fillRect(o0.x, o0.y, o1.x - o0.x, h0.y - o0.y);
    f.fillRect(o0.x, h1.y, o1.x - o0.x, o1.y - h1.y);
    f.fillRect(o0.x, h0.y, h0.x - o0.x, h1.y - h0.y);
    f.fillRect(h1.x, h0.y, o1.x - h1.x, h1.y - h0.y);
    f.lineStyle(this.inkWidth, c.ink, 1).strokeRect(h0.x, h0.y, h1.x - h0.x, h1.y - h0.y);
  }

  destroy(): void {
    this.inside.destroy();
    this.frontFace.destroy();
  }
}
