import * as Phaser from 'phaser';
import { HEADER, LIGHT_GLSL, type BoxSpec, type PaperBox } from './box';
import type { Lens } from './lens';
import type { PlaneCamera, Planes } from './planes';
import { depthRange, holeHeight, holeTop, type Hole, type LeafKind } from './opening';

// Walls of the paper box that do more than close it: a side wall with a
// doorway cut into it, and a wall standing across the room.
//
// A wall is drawn the way the box is, by a shader that casts a ray through
// each device pixel: it lies in true perspective, its paper grain and its
// art lie on it and recede with it, and the lamps light it. A doorway is cut
// into the wall's own plane, so it is slanted with it: its jambs stay
// upright, the near one taller, and its lintel and sill run toward the eye
// point along the wall's top and foot.
//
//  - The box's right side wall (x = box.x1) may have a doorway, and beyond
//    it a passage with its own floor, its far wall, frames standing in it
//    parallel to the wall, a figure peeking out, and at its end the light
//    of where it leads. It is drawn on the camera behind every card (with
//    the box's inside), over the part of the screen the wall covers: all
//    that the wall hides lies beyond it, behind every card in the room.
//  - A wall across the room (a slab from the back wall forward, at x) may
//    have a doorway too. Cards stand on both sides of it, so it is drawn in
//    slices: each plane's camera draws the part of the wall between its own
//    depth and the next camera's, after its cards. So a card is covered by
//    exactly the part of the wall nearer than it.
//
// A doorway's leaf turns on its hinge through the same lens, or slides,
// lifts, sinks or rolls into the wall; shut, it is flush with the wall.
// Without WebGL (the Canvas renderer) walls are drawn in flat colours.

export type { Hole, LeafKind } from './opening';
export { holeHeight, holeTop } from './opening';

/**
 * A piece of art on a wall's surface: the world rectangle it covers there
 * (u across: depth for a wall, x from the wall for the passage; v up from
 * the floor) and where its texels lie in the wall's atlas (px, y down).
 */
export interface ArtPlace {
  u0: number;
  v0: number;
  u1: number;
  v1: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WallSpec {
  /** The box's right side wall (at x = box.x1), or a wall across the room (its middle at x). */
  kind: 'side' | 'cross';
  x: number;
  /** A cross wall: half its thickness, and the depth its near end reaches (world px). */
  half?: number;
  end?: number;
  /** Its paper, and the paper's core where it is cut (a jamb, a cross wall's end). */
  color: number;
  edge: number;
  hole?: Hole | null;
  leaf?: { kind: LeafKind; hinge?: 'far' | 'near'; color: number; back: number } | null;
  /**
   * Beyond a side wall's doorway: a passage `length` long (along x), its
   * floor, its far wall and the light at its end; the wall's thickness
   * (`reveal`) shows at the far jamb; `frames` stand in it at these x from
   * the wall, parallel to it.
   */
  passage?: { length: number; reveal: number; floor: number; wall: number; end: number; frames?: number[] } | null;
  /** The art drawn on it (a texture key and where each piece lies in it). */
  art?: { key: string; wall?: ArtPlace; leaf?: ArtPlace; passage?: ArtPlace; frames?: ArtPlace[]; peek?: ArtPlace } | null;
  /** Flat colours for the Canvas renderer: the wall's own, and what shows in its opening. */
  flat?: { wall?: number; hole?: number; frame?: number };
}

const LEAF_KIND: Record<LeafKind, number> = { swing: 1, slide: 2, lift: 3, sink: 4, roll: 5 };

const rgb = (c: number): [number, number, number] => [((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255];

const WALL_FRAG = (deriv: boolean): string => `${HEADER(deriv)}
${LIGHT_GLSL}
uniform vec3 uInk;
uniform float uInkW;
uniform vec4 uSeg[8];
// The quad on the screen (device px: x, y, w, h).
uniform vec4 uRect;
// The wall: kind (0 the right side wall, 1 across the room), x, half its thickness, its near end.
uniform vec4 uWall;
// The depths this quad draws (a wall across the room is drawn in slices); has art; the leaf is cut to its art.
uniform vec4 uBand;
// The opening: its jambs' depths, their height, the crown's rise over them.
uniform vec4 uHole;
// The arch's point, whether there is an opening, the passage's length, the wall's thickness at the jamb.
uniform vec4 uHole2;
// The leaf: how it opens (0 none, 1 swing, 2 slide, 3 lift, 4 sink, 5 roll), how far, its hinge (0 far, 1 near), how much of it shows.
uniform vec4 uLeaf;
uniform vec3 uWallCol;
uniform vec3 uEdgeCol;
uniform vec3 uLeafCol;
uniform vec3 uLeafBack;
uniform vec3 uPassFloor;
uniform vec3 uPassWall;
uniform vec3 uPassEnd;
// The light in the opening: colour, strength.
uniform vec4 uGlow;
// The figure in the passage: x from the wall, depth, how far it has stood up, how much it shows.
uniform vec4 uPeek;
// A figure's shadow on the passage's floor: x, z, half width, darkness.
uniform vec4 uShade;
// The passage's frames: x from the wall of the first and second, how many.
uniform vec4 uFrames;
// A wall across the room: its edges on the screen (the near end's two, its foot, its back corner).
uniform vec4 uWSeg[4];
uniform sampler2D uArt;
// Art: world rect on its surface (u0, v0, u1, v1), then texels (s at u0, t at v0, s at u1, t at v1).
uniform vec4 uRegW[2];
uniform vec4 uRegL[2];
uniform vec4 uRegP[2];
uniform vec4 uRegF[4];
uniform vec4 uRegK[2];

// The art over a region at the point p of its surface (premultiplied); nothing outside it.
vec4 art(vec4 w, vec4 s, vec2 p) {
  if (uBand.z < 0.5) return vec4(0.0);
  vec2 r = (p - w.xy) / max(w.zw - w.xy, vec2(1e-3));
  if (r.x < 0.0 || r.y < 0.0 || r.x > 1.0 || r.y > 1.0) return vec4(0.0);
  return texture2D(uArt, mix(s.xy, s.zw, r));
}

// The opening's top over the floor at depth z.
float archTop(float z) {
  float hw = max(1.0, 0.5 * (uHole.y - uHole.x));
  float u = clamp((z - 0.5 * (uHole.x + uHole.y)) / hw, -1.0, 1.0);
  return uHole.z + uHole.w * sqrt(max(0.0, 1.0 - u * u)) + uHole2.x * pow(max(0.0, 1.0 - abs(u) * 1.45), 2.2);
}

// A world point on the screen (device px).
vec2 proj(vec3 w) {
  float s = uLens.x / (uEye.z - w.z);
  return vec2(uLens.y + s * (w.x - uEye.x), uLens.z + s * (w.y - uEye.y));
}

bool inHole(float z, float v) {
  return uHole2.y > 0.5 && z > uHole.x && z < uHole.y && v < archTop(z);
}

// A wall's face at p (v: height over the floor), lit as it faces n.
vec3 face(vec3 p, float v, float k, vec3 n) {
  vec4 a = art(uRegW[0], uRegW[1], vec2(p.z, v));
  vec3 c = paper(uWallCol * (1.0 - a.a) + a.rgb, p.zy, k);
  float ao = min(p.z - uDepth.x, min(v, p.y - uBox.z));
  return c * (0.86 + 0.14 * smoothstep(0.0, 70.0, ao)) * lightAt(p, n);
}

// Where the leaf shows its own face at the point (z, v) of the opening when
// it moves in the wall's plane (x < -1e3: it does not cover the point).
vec2 leafIn(float z, float v) {
  float a = uLeaf.y;
  float w = uHole.y - uHole.x;
  float h = uHole.z + uHole.w + uHole2.x;
  if (uLeaf.x < 2.5) {
    // Slid into the wall, toward the far jamb (or the near one).
    float zl = z + (uLeaf.z > 0.5 ? -a * w : a * w);
    return zl < uHole.x || zl > uHole.y ? vec2(-1e4) : vec2(zl, v);
  }
  if (uLeaf.x < 3.5) {
    float vl = v - a * h;
    return vl < 0.0 ? vec2(-1e4) : vec2(z, vl);
  }
  if (uLeaf.x < 4.5) {
    float vl = v + a * h;
    return vl > h ? vec2(-1e4) : vec2(z, vl);
  }
  // Rolled up from the foot: the roll itself is drawn by the caller.
  return v < a * h ? vec2(-1e4) : vec2(z, v);
}

// The leaf's face at the point l of it (depth along the wall when shut, height), lit as it faces n,
// and how much of it is there (a leaf cut to its art, a lattice or bars, lets the passage through).
vec4 leafFace(vec2 l, vec3 p, float k, vec3 n, bool front) {
  vec4 a = art(uRegL[0], uRegL[1], l);
  float al = uBand.w > 0.5 ? a.a : 1.0;
  if (al < 0.02) return vec4(0.0);
  vec3 c;
  if (!front) c = paper(uLeafBack, l, k);
  else if (uBand.w > 0.5) c = paper(a.rgb / max(a.a, 1e-3), l, k);
  else c = paper(uLeafCol * (1.0 - a.a) + a.rgb, l, k);
  return vec4(c * lightAt(p, n), al);
}

// The hole's edge as a line in device px at the point (z, v) of the wall's plane
// (1 on the line); zk, vk: world px per device px along the wall and up it.
float holeInk(float z, float v, float zk, float vk) {
  if (uHole2.y < 0.5) return 0.0;
  float ej = max(uHole.x - z, z - uHole.y) / zk;
  float ea = (v - archTop(z)) / vk;
  float e = v < archTop(z) ? ej : (z > uHole.x && z < uHole.y ? ea : max(ej, ea));
  return ink(abs(e), uInkW * 0.8);
}

void main() {
  vec2 q = uRect.xy + vec2(outTexCoord.x, 1.0 - outTexCoord.y) * uRect.zw;
  float f = uLens.x;
  vec3 d = vec3((q.x - uLens.y) / f, (q.y - uLens.z) / f, -1.0);
  vec3 E = uEye;
  float flo = uBox.w;
  float top = uBox.z;
  float back = uDepth.x;
  float front = uDepth.y;
  // The plane of the wall's face toward the eye, hit by every ray (so its
  // derivatives are known everywhere): where the opening's edge is inked.
  float xf = uWall.y - (uWall.x > 0.5 ? (E.x < uWall.y ? uWall.z : -uWall.z) : 0.0);
  float dx = abs(d.x) < 1e-5 ? (d.x < 0.0 ? -1e-5 : 1e-5) : d.x;
  float tp = (xf - E.x) / dx;
  vec3 pp = E + d * tp;
  float pv = flo - pp.y;
#ifdef DERIV
  float zk = max(fwidth(pp.z), 1e-4);
  float vk = max(fwidth(pv), 1e-4);
#else
  float zk = max(1e-4, abs(tp * tp / (f * (xf - E.x))));
  float vk = tp / f;
#endif
  float hin = holeInk(pp.z, pv, zk, vk);
  vec3 col = vec3(0.0);
  // The nearest thing hit so far along the ray (and its depth).
  float tn = 1e9;
  float pz = 0.0;
  float edgeInk = 0.0;
  if (uWall.x < 0.5) {
    // The box's right side wall.
    float xw = uWall.y;
    if (d.x <= 1e-5) discard;
    float tw = (xw - E.x) / d.x;
    if (tw < E.z - front || tw > E.z - back) discard;
    float ty = d.y > 0.0 ? (flo - E.y) / d.y : (d.y < 0.0 ? (top - E.y) / d.y : 1e9);
    if (tw > ty) discard;
    vec3 pw = E + d * tw;
    float vw = flo - pw.y;
    float kw = f / tw;
    float z0 = uHole.x;
    float z1 = uHole.y;
    float W = z1 - z0;
    if (!inHole(pw.z, vw)) {
      col = face(pw, vw, kw, vec3(-1.0, 0.0, 0.0));
      tn = tw;
      pz = pw.z;
    } else {
      // Through the opening: the passage, with what stands in it.
      float L = uHole2.z;
      float tf = d.y > 0.0 ? (flo - E.y) / d.y : 1e9;
      float tz = E.z - z0;
      float te = (xw + L - E.x) / d.x;
      float tb = min(tf, min(tz, te));
      vec3 p = E + d * tb;
      float k = f / tb;
      float along = clamp((p.x - xw) / max(L, 1.0), 0.0, 1.0);
      if (tb == tz) {
        // Its far wall, facing the viewer; at the jamb, the wall's own thickness.
        float u = p.x - xw;
        vec4 a = art(uRegP[0], uRegP[1], vec2(u, flo - p.y));
        vec3 base = u < uHole2.w ? uEdgeCol : uPassWall * (1.0 - a.a) + a.rgb;
        col = paper(base, p.xy, k) * lightAt(p, vec3(0.0, 0.0, 1.0));
      } else if (tb == tf) {
        col = paper(uPassFloor, p.xz, k) * lightAt(p, vec3(0.0, -1.0, 0.0));
        vec2 r = vec2((p.x - uShade.x) / max(uShade.z, 1.0), (p.z - uShade.y) / max(uShade.z * 0.55, 1.0));
        col *= 1.0 - 0.3 * uShade.w * (1.0 - smoothstep(0.35, 1.0, length(r)));
      } else {
        // Its end: the light of where it leads, brightest in the middle.
        float m = 1.0 - smoothstep(0.0, 1.0, length(vec2((p.z - 0.5 * (z0 + z1)) / max(W, 1.0), (flo - p.y - 0.45 * uHole.z) / max(uHole.z, 1.0))) * 1.6);
        col = mix(uPassEnd * 0.82, min(vec3(1.0), uPassEnd * 1.25 + 0.12), m);
      }
      // Its corners, inked: the far wall's foot and the jamb's thickness, the end's foot and side.
      float hc = uHole.z + uHole.w + uHole2.x;
      float lk = ink(segDist(q, vec4(proj(vec3(xw, flo, z0)), proj(vec3(xw + L, flo, z0)))), uInkW * 0.7);
      lk = max(lk, ink(segDist(q, vec4(proj(vec3(xw + uHole2.w, flo, z0)), proj(vec3(xw + uHole2.w, flo - uHole.z, z0)))), uInkW * 0.6));
      lk = max(lk, ink(segDist(q, vec4(proj(vec3(xw + L, flo, z0)), proj(vec3(xw + L, flo, z1)))), uInkW * 0.6));
      lk = max(lk, ink(segDist(q, vec4(proj(vec3(xw + L, flo, z0)), proj(vec3(xw + L, flo - hc, z0)))), uInkW * 0.6));
      col = mix(col, uInk, lk * 0.85);
      // Deep in the passage it is darker, but its end shines.
      if (tb != te) col *= mix(1.0, 0.62, smoothstep(0.1, 1.0, along));
      tn = tb;
      pz = p.z;
      // The frames standing in it, parallel to the wall (far first).
      for (int i = 1; i >= 0; i--) {
        if (float(i) >= uFrames.z) continue;
        float D = i == 0 ? uFrames.x : uFrames.y;
        float t = (xw + D - E.x) / d.x;
        if (t <= tw || t >= tn) continue;
        vec3 pf = E + d * t;
        vec4 a = i == 0 ? art(uRegF[0], uRegF[1], vec2(pf.z, flo - pf.y)) : art(uRegF[2], uRegF[3], vec2(pf.z, flo - pf.y));
        if (a.a < 0.01) continue;
        vec3 c = paper(a.rgb / a.a, pf.zy, f / t) * lightAt(pf, vec3(-1.0, 0.0, 0.0)) * mix(1.0, 0.7, smoothstep(0.1, 1.0, D / max(L, 1.0)));
        col = mix(col, c, a.a);
        if (a.a > 0.5) {
          tn = t;
          pz = pf.z;
        }
      }
      // The leaf.
      if (uLeaf.x > 0.5 && uLeaf.x < 1.5) {
        float th = uLeaf.y;
        float sz = uLeaf.z > 0.5 ? -1.0 : 1.0;
        vec2 H = vec2(xw, sz > 0.0 ? z0 : z1);
        vec2 dl = vec2(sin(th), sz * cos(th));
        vec2 nl = vec2(cos(th), -sz * sin(th));
        float den = dot(d.xz, nl);
        if (abs(den) > 1e-6) {
          float t = dot(H - E.xz, nl) / den;
          if (t >= tw - 0.05 && t <= tn) {
            vec3 pl = E + d * t;
            float s = dot(pl.xz - H, dl);
            float vl = flo - pl.y;
            float zl = H.y + sz * s;
            if (s >= 0.0 && s <= W && vl >= 0.0 && vl <= archTop(zl)) {
              bool fr = dot(E.xz - H, nl) < 0.0;
              vec4 c = leafFace(vec2(zl, vl), pl, f / t, fr ? vec3(-nl.x, 0.0, -nl.y) : vec3(nl.x, 0.0, nl.y), fr);
              // Its free edge, inked.
              vec2 fe = H + dl * W;
              c.rgb = mix(c.rgb, uInk, ink(abs(q.x - proj(vec3(fe.x, flo, fe.y)).x), uInkW * 0.7));
              col = mix(col, c.rgb, c.a * uLeaf.w);
              if (c.a * uLeaf.w > 0.5) {
                tn = t;
                pz = pl.z;
              }
            }
          }
        }
      } else if (uLeaf.x > 1.5) {
        vec2 l = leafIn(pw.z, vw);
        vec4 c = l.x > -1e3 ? leafFace(l, pw, kw, vec3(-1.0, 0.0, 0.0), true) : vec4(0.0);
        if (c.a > 0.0) {
          col = mix(col, c.rgb, c.a * uLeaf.w);
          if (c.a * uLeaf.w > 0.5) {
            tn = tw;
            pz = pw.z;
          }
        } else if (l.x < -1e3 && uLeaf.x > 4.5) {
          // The roll at the foot of a rolled-up leaf.
          float r = uLeaf.y * (uHole.z + uHole.w + uHole2.x);
          float rr = (r - vw) / 9.0;
          if (rr >= 0.0 && rr < 1.0 && r > 0.5) {
            float sh = 0.7 + 0.3 * sin(rr * 3.14159);
            col = paper(uLeafCol * sh, vec2(pw.z, vw), kw) * lightAt(pw, vec3(-1.0, 0.0, 0.0));
            col = mix(col, uInk, max(ink(abs(rr) * 9.0 * kw, uInkW * 0.6), ink(abs(1.0 - rr) * 9.0 * kw, uInkW * 0.6)));
            tn = tw;
            pz = pw.z;
          }
        }
      }
      // The figure peeking out of the passage (a card facing the viewer).
      if (uPeek.w > 0.01) {
        float t = E.z - uPeek.y;
        if (t > tw && t < tn) {
          vec3 pk = E + d * t;
          float rise = max(uPeek.z, 0.02);
          vec4 a = art(uRegK[0], uRegK[1], vec2(pk.x - xw - uPeek.x, (flo - pk.y) / rise));
          float al = a.a * uPeek.w;
          if (al > 0.01) {
            vec3 c = (a.rgb / max(a.a, 1e-3)) * lightAt(pk, vec3(0.0, 0.0, 1.0));
            col = mix(col, c, al);
            if (al > 0.5) {
              tn = t;
              pz = pk.z;
            }
          }
        }
      }
      // The light in the opening.
      col = mix(col, uGlow.rgb, uGlow.a * (0.18 + 0.4 * along));
    }
    // The box's corners, and the opening's cut edge, inked.
    float m = hin;
    for (int i = 0; i < 8; i++) m = max(m, ink(segDist(q, uSeg[i]), uInkW));
    col = mix(col, uInk, m);
  } else {
    // A wall across the room: a slab from the back wall to its near end.
    // What the ray meets is found first (geometry only), so that a slice
    // gives up on what lies outside its depths before any paper is shaded.
    float xc = uWall.y;
    float hw = uWall.z;
    vec3 dd = vec3(dx, abs(d.y) < 1e-5 ? 1e-5 : d.y, -1.0);
    vec3 lo = vec3(xc - hw, top, back);
    vec3 hi = vec3(xc + hw, flo, uWall.w);
    vec3 ta = (lo - E) / dd;
    vec3 tb = (hi - E) / dd;
    vec3 tmn = min(ta, tb);
    vec3 tmx = max(ta, tb);
    float tin = max(max(tmn.x, tmn.y), tmn.z);
    float tout = min(min(tmx.x, tmx.y), tmx.z);
    // 1 its near end, 2 the far jamb's side (in the opening), 3 a face; 4 the leaf.
    int hit = 0;
    if (tout > max(tin, 0.0)) {
      vec3 p = E + d * tin;
      if (tin == tmn.z) {
        hit = 1;
        tn = tin;
      } else if (tin == tmn.x && inHole(p.z, flo - p.y)) {
        float tj = E.z - uHole.x;
        if (tj < tout) {
          hit = 2;
          tn = tj;
        }
      } else {
        hit = 3;
        tn = tin;
      }
    }
    // The leaf, in the face toward the way it is passed (from the left).
    vec2 ll = vec2(0.0);
    vec3 ln = vec3(0.0);
    bool lfront = true;
    if (uLeaf.x > 0.5 && uHole2.y > 0.5 && uLeaf.w > 0.5) {
      float xl = xc - hw;
      float W = uHole.y - uHole.x;
      if (uLeaf.x < 1.5) {
        float th = uLeaf.y;
        float sz = uLeaf.z > 0.5 ? -1.0 : 1.0;
        vec2 H = vec2(xl, sz > 0.0 ? uHole.x : uHole.y);
        vec2 dl = vec2(sin(th), sz * cos(th));
        vec2 nl = vec2(cos(th), -sz * sin(th));
        float den = dot(vec2(dx, -1.0), nl);
        if (abs(den) > 1e-6) {
          float t = dot(H - E.xz, nl) / den;
          if (t > 0.0 && t <= tn + 0.05) {
            vec3 pl = E + d * t;
            float s = dot(pl.xz - H, dl);
            float vl = flo - pl.y;
            float zl = H.y + sz * s;
            if (s >= 0.0 && s <= W && vl >= 0.0 && vl <= archTop(zl) && (uBand.w < 0.5 || art(uRegL[0], uRegL[1], vec2(zl, vl)).a > 0.5)) {
              hit = 4;
              tn = t;
              ll = vec2(zl, vl);
              lfront = dot(E.xz - H, nl) < 0.0;
              ln = lfront ? vec3(-nl.x, 0.0, -nl.y) : vec3(nl.x, 0.0, nl.y);
            }
          }
        }
      } else {
        float t = (xl - E.x) / dx;
        if (t > 0.0 && t <= tn + 0.05) {
          vec3 pl = E + d * t;
          float vl = flo - pl.y;
          if (inHole(pl.z, vl)) {
            vec2 l = leafIn(pl.z, vl);
            if (l.x > -1e3 && (uBand.w < 0.5 || art(uRegL[0], uRegL[1], l).a > 0.5)) {
              hit = 5;
              tn = t;
              ll = l;
              lfront = E.x < xl;
              ln = vec3(lfront ? -1.0 : 1.0, 0.0, 0.0);
            }
          }
        }
      }
    }
    if (hit == 0) discard;
    vec3 ph = E + d * tn;
    pz = ph.z;
    // Only what lies in this slice's depths.
    if (pz < uBand.x || pz >= uBand.y) discard;
    float k = f / tn;
    if (hit == 1) {
      // Its near end, facing the viewer: the paper's cut core.
      col = paper(uEdgeCol, ph.xy, k) * lightAt(ph, vec3(0.0, 0.0, 1.0));
    } else if (hit == 2) {
      col = paper(uEdgeCol, ph.xy, k) * lightAt(ph, vec3(0.0, 0.0, 1.0)) * 0.92;
      edgeInk = hin;
    } else if (hit == 3) {
      col = face(ph, flo - ph.y, k, vec3(d.x > 0.0 ? -1.0 : 1.0, 0.0, 0.0));
      edgeInk = tin == tmn.x ? hin : 0.0;
    } else {
      col = leafFace(ll, ph, k, ln, lfront).rgb;
      edgeInk = hit == 5 ? hin : 0.0;
    }
    float m = edgeInk;
    for (int i = 0; i < 4; i++) m = max(m, ink(segDist(q, uWSeg[i]), uInkW));
    col = mix(col, uInk, m);
  }
  gl_FragColor = vec4(fogged(col, pz), 1.0);
}
`;

interface Piece {
  obj: Phaser.GameObjects.Shader | Phaser.GameObjects.Graphics;
  cam: PlaneCamera;
  band: [number, number];
  rect: [number, number, number, number];
}

/** A wall in the room, and what the game moves on it. */
export class Wall {
  /** The leaf: its angle (radians) on its hinge, or how far (0..1) it has slid, lifted, sunk or rolled. */
  leaf = 0;
  /** How much of the leaf shows (with less motion a leaf fades instead of moving). */
  leafShown = 1;
  /** The light in the opening (0..1) and its colour. */
  glow = 0;
  glowColor = 0xffffff;
  /** The figure in the passage: x from the wall and depth, how far it has stood up (0..1), how much it shows (0..1). */
  peek = { x: 40, z: 0, rise: 1, show: 0 };
  /** A figure's shadow on the passage floor (world x, depth, half width, darkness). */
  shade: { x: number; z: number; r: number; a: number } | null = null;
  /** Where it is drawn: one quad (a side wall), or one per plane's camera (a wall across the room). */
  readonly pieces: Piece[] = [];
  readonly id: number;
  private static seq = 0;

  constructor(readonly spec: WallSpec) {
    this.id = ++Wall.seq;
  }

  /** The opening's middle depth (0 without one). */
  get mid(): number {
    const h = this.spec.hole;
    return h ? (h.z0 + h.z1) / 2 : 0;
  }
}

/** The walls of one room's box (see the top of this file). */
export class PaperWalls {
  readonly list: Wall[] = [];
  private readonly webgl: boolean;
  private readonly deriv: boolean;
  private readonly segs = new Float32Array(16);
  private readonly lensCopy: { f: number; cx: number; cy: number; w: number; h: number; ex: number; ey: number; ez: number } = { f: 1, cx: 0, cy: 0, w: 1, h: 1, ex: 0, ey: 0, ez: 1 };

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly planes: Planes,
    private readonly lens: Lens,
    private readonly box: PaperBox,
    private readonly spec: BoxSpec,
    /** The camera behind every card (the box's inside). */
    private readonly insideCam: PlaneCamera,
  ) {
    this.webgl = scene.game.renderer.type === Phaser.WEBGL;
    const gl = this.webgl ? (scene.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).gl : null;
    this.deriv = !!gl?.getExtension('OES_standard_derivatives');
  }

  add(spec: WallSpec): Wall {
    const w = new Wall(spec);
    this.list.push(w);
    if (spec.kind === 'side') this.pieces(w, this.insideCam, 1);
    return w;
  }

  remove(w: Wall): void {
    const i = this.list.indexOf(w);
    if (i < 0) return;
    this.list.splice(i, 1);
    for (const p of w.pieces) p.obj.destroy();
    w.pieces.length = 0;
  }

  /** The right side wall's doorway, if the room has one. */
  get door(): Wall | null {
    return this.list.find((w) => w.spec.kind === 'side' && !!w.spec.hole) ?? null;
  }

  /**
   * The depths Gorti may walk at, at x: walls with no opening where he is
   * are walked round, so near a wall's doorway the way narrows to it, gently.
   */
  depthAt(x: number, min: number, max: number): { min: number; max: number } {
    // (A side wall stands at the box's right end, x = box.x1.)
    return depthRange(
      this.list.map((w) => w.spec),
      x,
      min,
      max,
    );
  }

  /** Before each frame, once the cameras are set: every wall where the eye sees it. */
  update(): void {
    if (this.list.length === 0) return;
    const L = this.lens;
    const c = this.lensCopy;
    c.f = L.f;
    c.cx = L.cx;
    c.cy = L.cy;
    c.w = L.w;
    c.h = L.h;
    c.ex = L.eye.x;
    c.ey = L.eye.y;
    c.ez = L.eye.z;
    for (const w of this.list) {
      if (w.spec.kind === 'side') this.side(w);
      else this.cross(w);
    }
  }

  /** The side wall's quad: where the wall shows on the screen (nothing when it does not). */
  private side(w: Wall): void {
    const s = this.spec;
    const piece = w.pieces[0];
    if (!piece) return;
    const L = this.lens;
    const xw = w.spec.x;
    if (xw <= L.eye.x + 1) {
      piece.obj.setVisible(false);
      return;
    }
    const pts: [number, number][] = [];
    for (const z of [s.back, s.front]) for (const y of [s.top, s.floor]) pts.push(this.at(xw, y, z));
    const r = this.screenBox(pts);
    if (!r) {
      piece.obj.setVisible(false);
      return;
    }
    piece.band = [-1e6, 1e6];
    this.place(w, piece, r);
  }

  /** A cross wall: one slice per camera, between its depth and the next camera's. */
  private cross(w: Wall): void {
    const s = this.spec;
    const sp = w.spec;
    const end = Math.min(sp.end ?? 110, s.front);
    const half = sp.half ?? 8;
    const cams = this.scene.cameras.cameras as PlaneCamera[];
    const used = new Set<Piece>();
    for (let i = 0; i < cams.length; i++) {
      const cam = cams[i]!;
      if (cam.screen && cam !== this.insideCam) continue;
      if (!cam.visible && cam !== this.insideCam) continue;
      const za = Math.max(s.back - 1, cam === this.insideCam ? s.back - 1 : cam.z);
      let zb = end + 1;
      for (let j = i + 1; j < cams.length; j++) {
        const n = cams[j]!;
        if (n.screen && n !== this.insideCam) continue;
        if (!n.visible) continue;
        zb = Math.min(zb, Math.max(za, n.z));
        break;
      }
      if (!(zb > za) || za > end) continue;
      // The slice's corners on the screen: of the face the eye sees (both
      // when it stands within the wall's thickness), of the near end and of
      // the far jamb's side if they lie in it, of the leaf in the opening
      // and swung out of the wall.
      const pts: [number, number][] = [];
      const z0 = Math.max(s.back, za);
      const z1 = Math.min(end, zb);
      const ex = this.lens.eye.x;
      const faces = ex < sp.x - half ? [sp.x - half] : ex > sp.x + half ? [sp.x + half] : [sp.x - half, sp.x + half];
      for (const z of [z0, z1]) for (const x of faces) for (const y of [s.top, s.floor]) pts.push(this.at(x, y, z));
      if (end >= za && end <= zb) for (const x of [sp.x - half, sp.x + half]) for (const y of [s.top, s.floor]) pts.push(this.at(x, y, end));
      const ho = sp.hole;
      if (ho && ho.z1 >= za && ho.z0 <= zb) {
        const top = s.floor - holeHeight(ho);
        const a = Math.max(za, ho.z0);
        const b = Math.min(zb, ho.z1);
        for (const x of [sp.x - half, sp.x + half]) for (const z of [a, b]) pts.push(this.at(x, top, z), this.at(x, s.floor, z));
      }
      const lf = sp.leaf;
      if (lf?.kind === 'swing' && sp.hole && w.leaf > 0.001) {
        const h = sp.hole;
        const sz = lf.hinge === 'near' ? -1 : 1;
        const hz = sz > 0 ? h.z0 : h.z1;
        const W = h.z1 - h.z0;
        const fx = sp.x - half + Math.sin(w.leaf) * W;
        const fz = hz + sz * Math.cos(w.leaf) * W;
        const top = s.floor - holeHeight(h);
        for (const [x, z] of [[sp.x - half, hz], [fx, fz]] as const) {
          if (z < za || z > zb) continue;
          pts.push(this.at(x, top, z), this.at(x, s.floor, z));
        }
        if ((hz >= za && hz <= zb) !== (fz >= za && fz <= zb)) {
          // The leaf crosses the slice: take the whole of it.
          pts.push(this.at(sp.x - half, top, hz), this.at(fx, top, fz), this.at(sp.x - half, s.floor, hz), this.at(fx, s.floor, fz));
        }
      }
      const r = this.screenBox(pts);
      if (!r) continue;
      let piece = w.pieces.find((p) => p.cam === cam);
      if (!piece) piece = this.pieces(w, cam, 1e12);
      piece.band = [za, zb];
      used.add(piece);
      this.place(w, piece, r);
    }
    for (const p of w.pieces) if (!used.has(p)) p.obj.setVisible(false);
  }

  /** A world point on the screen (device px). */
  private at(x: number, y: number, z: number): [number, number] {
    const p = this.lens.project(x, y, z);
    return [p.x, p.y];
  }

  /** The screen rectangle round these points, cut to the screen (null: none of it shows). */
  private screenBox(pts: readonly [number, number][]): [number, number, number, number] | null {
    const L = this.lens;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const [x, y] of pts) {
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
    x0 = Math.max(0, Math.floor(x0 - 2));
    y0 = Math.max(0, Math.floor(y0 - 2));
    x1 = Math.min(L.w, Math.ceil(x1 + 2));
    y1 = Math.min(L.h, Math.ceil(y1 + 2));
    return x1 - x0 < 1 || y1 - y0 < 1 ? null : [x0, y0, x1 - x0, y1 - y0];
  }

  /** Makes a quad (or a flat drawing) for a wall on a camera. */
  private pieces(w: Wall, cam: PlaneCamera, depth: number): Piece {
    const scene = this.scene;
    let obj: Phaser.GameObjects.Shader | Phaser.GameObjects.Graphics;
    if (this.webgl) {
      const sh = scene.add.shader({ name: `paper.wall.${this.deriv ? 'd' : 'n'}`, fragmentSource: WALL_FRAG(this.deriv), setupUniforms: (set: (n: string, v: unknown) => void) => this.uniforms(w, piece, set) }, 0, 0, 2, 2, [w.spec.art?.key ?? '__WHITE']);
      sh.setOrigin(0, 0);
      obj = sh;
    } else obj = scene.add.graphics();
    obj.setDepth(depth);
    this.planes.placeOn(obj, cam);
    const piece: Piece = { obj, cam, band: [0, 0], rect: [0, 0, 1, 1] };
    w.pieces.push(piece);
    return piece;
  }

  /** Puts a quad over a screen rectangle as its camera shows it (whatever that camera's zoom and scroll). */
  private place(w: Wall, piece: Piece, r: [number, number, number, number]): void {
    piece.rect = r;
    const cam = piece.cam;
    const o = piece.obj;
    o.setVisible(true);
    if (!this.webgl) {
      this.drawFlat(w, piece);
      return;
    }
    const sh = o as Phaser.GameObjects.Shader;
    if (cam.screen) {
      sh.setPosition(r[0], r[1]);
      sh.setSize(r[2], r[3]);
      sh.setScale(1);
      return;
    }
    // The camera shows world (x, y) at cam.x + W/2 + zoomX·(x − scrollX − W/2).
    const ox = cam.width * cam.originX;
    const oy = cam.height * cam.originY;
    const wx = (r[0] - cam.x - ox) / cam.zoomX + cam.scrollX + ox;
    const wy = (r[1] - cam.y - oy) / cam.zoomY + cam.scrollY + oy;
    sh.setPosition(wx, wy);
    sh.setSize(r[2], r[3]);
    sh.setScale(1 / cam.zoomX, 1 / cam.zoomY);
  }

  private uniforms(w: Wall, piece: Piece, set: (n: string, v: unknown) => void): void {
    const L = this.lensCopy;
    const box = this.box;
    const s = this.spec;
    const sp = w.spec;
    const c = sp;
    set('uView', [L.w, L.h]);
    set('uLens', [L.f, L.cx, L.cy, L.h]);
    set('uEye', [L.ex, L.ey, L.ez]);
    set('uBox', [s.x0, s.x1, s.top, s.floor]);
    set('uDepth', [s.back, s.front, 0, 0]);
    const paperU = s.paper ?? { grain: 0.06, hatch: 0.22, spacing: 16 };
    set('uPaper', [paperU.grain, paperU.hatch, paperU.spacing, (s.tear.seed % 97) * 0.37 + (sp.kind === 'side' ? 0 : 3.1)]);
    const m = box.mood;
    const a = rgb(m.ambientColor);
    set('uAmb', [a[0] * m.ambient, a[1] * m.ambient, a[2] * m.ambient, m.wrap]);
    set('uLightPos[0]', box.lightPos);
    set('uLightCol[0]', box.lightCol);
    set('uLights', box.lightCount);
    const fog = m.fog;
    set('uFog', [...rgb(fog.color), fog.amount]);
    set('uFogRange', [fog.near, fog.far]);
    const near = m.front;
    set('uNear', [...rgb(near.color), near.amount * 0.75]);
    set('uNearRange', [near.from, near.to * 1.2]);
    set('uInk', rgb(s.colors.ink));
    set('uInkW', box.inkWidth);
    set('uSeg[0]', box.seg);
    set('uRect', piece.rect);
    set('uWall', [sp.kind === 'side' ? 0 : 1, sp.x, sp.half ?? 8, Math.min(sp.end ?? 110, s.front)]);
    const art = sp.art;
    set('uBand', [piece.band[0], piece.band[1], art ? 1 : 0, art?.leaf ? 1 : 0]);
    const h = sp.hole;
    set('uHole', h ? [h.z0, h.z1, h.spring, h.rise] : [0, 0, 0, 0]);
    const p = sp.passage;
    set('uHole2', [h?.peak ?? 0, h ? 1 : 0, p?.length ?? 300, p?.reveal ?? 10]);
    const lf = sp.leaf;
    set('uLeaf', [lf ? LEAF_KIND[lf.kind] : 0, w.leaf, lf?.hinge === 'near' ? 1 : 0, Math.max(0, Math.min(1, w.leafShown))]);
    set('uWallCol', rgb(c.color));
    set('uEdgeCol', rgb(c.edge));
    set('uLeafCol', rgb(lf?.color ?? c.color));
    set('uLeafBack', rgb(lf?.back ?? c.edge));
    set('uPassFloor', rgb(p?.floor ?? c.edge));
    set('uPassWall', rgb(p?.wall ?? c.edge));
    set('uPassEnd', rgb(p?.end ?? 0xffffff));
    set('uGlow', [...rgb(w.glowColor), Math.max(0, Math.min(1, w.glow))]);
    set('uPeek', [w.peek.x, w.peek.z, w.peek.rise, art?.peek ? w.peek.show : 0]);
    const sh = w.shade;
    set('uShade', sh ? [sh.x, sh.z, sh.r, sh.a] : [0, 0, 1, 0]);
    const fr = p?.frames ?? [];
    set('uFrames', [fr[0] ?? 0, fr[1] ?? 0, Math.min(2, art?.frames?.length ?? 0, fr.length), 0]);
    if (sp.kind === 'cross') this.crossSegs(w);
    set('uWSeg[0]', this.segs);
    set('uArt', 0);
    const size: [number, number] = art ? this.artSize(art.key) : [1, 1];
    set('uRegW[0]', region(art?.wall, size));
    set('uRegL[0]', region(art?.leaf, size));
    set('uRegP[0]', region(art?.passage, size));
    set('uRegF[0]', [...region(art?.frames?.[0], size), ...region(art?.frames?.[1], size)]);
    set('uRegK[0]', region(art?.peek, size));
  }

  private artSize(key: string): [number, number] {
    const t = this.scene.textures.get(key);
    const src = t?.source[0];
    return src ? [src.width, src.height] : [1, 1];
  }

  /** A cross wall's edges on the screen: its near end's two, the foot and the back corner of the face the eye sees. */
  private crossSegs(w: Wall): void {
    const s = this.spec;
    const sp = w.spec;
    const half = sp.half ?? 8;
    const end = Math.min(sp.end ?? 110, s.front);
    const xf = this.lens.eye.x < sp.x ? sp.x - half : sp.x + half;
    const seg = (i: number, a: [number, number], b: [number, number]): void => {
      this.segs.set([a[0], a[1], b[0], b[1]], i * 4);
    };
    seg(0, this.at(sp.x - half, s.top, end), this.at(sp.x - half, s.floor, end));
    seg(1, this.at(sp.x + half, s.top, end), this.at(sp.x + half, s.floor, end));
    seg(2, this.at(xf, s.floor, s.back), this.at(xf, s.floor, end));
    seg(3, this.at(xf, s.top, s.back), this.at(xf, s.floor, s.back));
  }

  /** The wall in flat colours (the Canvas renderer), as its piece's camera shows it. */
  private drawFlat(w: Wall, piece: Piece): void {
    const g = piece.obj as Phaser.GameObjects.Graphics;
    g.clear();
    const s = this.spec;
    const sp = w.spec;
    const cam = piece.cam;
    // A screen point as a world point of this camera.
    const toCam = (p: [number, number]): Phaser.Math.Vector2 => {
      if (cam.screen) return new Phaser.Math.Vector2(p[0], p[1]);
      const ox = cam.width * cam.originX;
      const oy = cam.height * cam.originY;
      return new Phaser.Math.Vector2((p[0] - cam.x - ox) / cam.zoomX + cam.scrollX + ox, (p[1] - cam.y - oy) / cam.zoomY + cam.scrollY + oy);
    };
    const fill = (color: number, pts: [number, number][], alpha = 1): void => {
      g.fillStyle(color, alpha).fillPoints(pts.map(toCam), true);
    };
    const line = (color: number, pts: [number, number][], width: number, closed = false): void => {
      g.lineStyle(width, color, 1).strokePoints(pts.map(toCam), closed);
    };
    const ink = s.colors.ink;
    const inkW = this.box.inkWidth;
    const h = sp.hole;
    const wallCol = sp.flat?.wall ?? sp.color;
    // The opening's outline at the wall's plane x.
    const outline = (x: number): [number, number][] => {
      if (!h) return [];
      const pts: [number, number][] = [this.at(x, s.floor, h.z0)];
      const n = 14;
      for (let i = 0; i <= n; i++) {
        const z = h.z0 + 0.001 + ((h.z1 - h.z0 - 0.002) * i) / n;
        pts.push(this.at(x, s.floor - holeTop(h, z), z));
      }
      pts.push(this.at(x, s.floor, h.z1));
      return pts;
    };
    const leafPts = (x: number): [number, number][] | null => {
      const lf = sp.leaf;
      if (!lf || !h) return null;
      const k = w.leaf;
      if (lf.kind === 'swing') {
        if (k > 1.2) return null;
        const sz = lf.hinge === 'near' ? -1 : 1;
        const hz = sz > 0 ? h.z0 : h.z1;
        const W = h.z1 - h.z0;
        const pts: [number, number][] = [];
        const n = 10;
        for (let i = 0; i <= n; i++) {
          const u = i / n;
          const z = hz + sz * Math.cos(k) * W * u;
          const xx = x + Math.sin(k) * W * u;
          pts.push(this.at(xx, s.floor - holeTop(h, hz + sz * W * Math.min(0.999, Math.max(0.001, u))), z));
        }
        pts.push(this.at(x + Math.sin(k) * W, s.floor, hz + sz * Math.cos(k) * W), this.at(x, s.floor, hz));
        return pts;
      }
      if (k > 0.98) return null;
      const all = outline(x);
      if (lf.kind === 'lift' || lf.kind === 'roll') {
        const cut = s.floor - k * holeHeight(h);
        return all.map(([px, py], i) => (i === 0 || i === all.length - 1 ? this.at(x, cut, i === 0 ? h.z0 : h.z1) : [px, Math.min(py, this.at(x, cut, h.z0)[1])] as [number, number]));
      }
      if (lf.kind === 'sink') {
        const drop = k * holeHeight(h);
        return all.map(([px, py], i) => {
          const z = i === 0 ? h.z0 : i === all.length - 1 ? h.z1 : h.z0 + ((h.z1 - h.z0) * (i - 1)) / 14;
          const floorY = this.at(x, s.floor, z)[1];
          const yy = this.lens.project(x, s.floor - Math.max(0, holeTop(h, z) - drop), z).y;
          return [px, i === 0 || i === all.length - 1 ? floorY : Math.min(floorY, Math.max(py, yy))] as [number, number];
        });
      }
      // Slid toward a jamb.
      const W = (h.z1 - h.z0) * (1 - k);
      const za = lf.hinge === 'near' ? h.z1 - W : h.z0;
      const zb = za + W;
      return [this.at(x, s.floor, za), this.at(x, s.floor - holeTop(h, za + 0.01), za), this.at(x, s.floor - holeTop(h, zb - 0.01), zb), this.at(x, s.floor, zb)];
    };
    if (sp.kind === 'side') {
      const xw = sp.x;
      const { back, front, top, floor } = s;
      fill(wallCol, [this.at(xw, top, back), this.at(xw, floor, back), this.at(xw, floor, front), this.at(xw, top, front)]);
      if (h) {
        const o = outline(xw);
        fill(sp.flat?.hole ?? sp.passage?.wall ?? 0x3a3048, o);
        // The passage's floor, and its light.
        const L = sp.passage?.length ?? 300;
        const fl = [this.at(xw, floor, h.z0), this.at(xw + L, floor, h.z0), this.at(xw + L, floor, h.z1), this.at(xw, floor, h.z1)];
        const sill = this.at(xw, floor, h.z0)[1];
        fill(sp.passage?.floor ?? 0x6a5a78, fl.map(([x, y]) => [x, Math.max(y, sill)] as [number, number]).filter(([x]) => x <= this.at(xw, floor, h.z1)[0]));
        if (w.glow > 0.02) fill(w.glowColor, o, Math.min(0.55, w.glow * 0.5));
        const lp = leafPts(xw);
        if (lp) {
          fill(sp.leaf!.color, lp);
          line(ink, lp, Math.max(1, inkW * 0.6), true);
        }
        line(sp.flat?.frame ?? ink, o, Math.max(2, inkW * 0.9));
      }
      line(ink, [this.at(xw, top, back), this.at(xw, floor, back), this.at(xw, floor, front)], inkW);
      return;
    }
    // Across the room: the slice of the face the eye sees, its near end, the opening and the leaf.
    const [za, zb] = piece.band;
    const half = sp.half ?? 8;
    const end = Math.min(sp.end ?? 110, s.front);
    const left = this.lens.eye.x < sp.x;
    const xf = left ? sp.x - half : sp.x + half;
    const z0 = Math.max(s.back, za);
    const z1 = Math.min(end, zb);
    if (z1 > z0) {
      const quad = (a: number, b: number): void => {
        if (b <= a) return;
        fill(wallCol, [this.at(xf, s.top, a), this.at(xf, s.floor, a), this.at(xf, s.floor, b), this.at(xf, s.top, b)]);
      };
      if (h) {
        quad(z0, Math.min(z1, h.z0));
        quad(Math.max(z0, h.z1), z1);
        // Over the opening, in strips.
        const a = Math.max(z0, h.z0);
        const b = Math.min(z1, h.z1);
        const n = Math.max(1, Math.ceil((b - a) / 12));
        for (let i = 0; i < n && b > a; i++) {
          const u0 = a + ((b - a) * i) / n;
          const u1 = a + ((b - a) * (i + 1)) / n;
          fill(wallCol, [this.at(xf, s.top, u0), this.at(xf, s.floor - holeTop(h, u0), u0), this.at(xf, s.floor - holeTop(h, u1), u1), this.at(xf, s.top, u1)]);
        }
        if (h.z0 >= za && h.z0 < zb) {
          const o = outline(xf);
          line(sp.flat?.frame ?? ink, o, Math.max(2, inkW * 0.9));
        }
      } else quad(z0, z1);
      line(ink, [this.at(xf, s.floor, z0), this.at(xf, s.floor, z1)], inkW);
    }
    if (end >= za && end < zb) {
      fill(sp.edge, [this.at(sp.x - half, s.top, end), this.at(sp.x - half, s.floor, end), this.at(sp.x + half, s.floor, end), this.at(sp.x + half, s.top, end)]);
      line(ink, [this.at(sp.x - half, s.floor, end), this.at(sp.x - half, s.top, end)], inkW);
      line(ink, [this.at(sp.x + half, s.floor, end), this.at(sp.x + half, s.top, end)], inkW);
    }
    const lf = sp.leaf;
    if (h && lf) {
      const mid = lf.kind === 'swing' ? (lf.hinge === 'near' ? h.z1 : h.z0) : (h.z0 + h.z1) / 2;
      if (mid >= za && mid < zb) {
        const lp = leafPts(sp.x - half);
        if (lp) {
          fill(lf.color, lp);
          line(ink, lp, Math.max(1, inkW * 0.6), true);
        }
      }
    }
  }

  destroy(): void {
    for (const w of this.list) for (const p of w.pieces) p.obj.destroy();
    this.list.length = 0;
  }
}

/** The shader's view of an art place: its world rect, then its texels (u, v up → s, t with the texture flipped). */
function region(p: ArtPlace | undefined, size: [number, number]): number[] {
  if (!p) return [0, 0, 1, 1, 0, 0, 0, 0];
  const [W, H] = size;
  // Textures are uploaded flipped: the canvas's top row is t = 1.
  return [p.u0, p.v0, p.u1, p.v1, p.x / W, 1 - (p.y + p.h) / H, (p.x + p.w) / W, 1 - p.y / H];
}
