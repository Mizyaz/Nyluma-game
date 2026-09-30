import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

// The picture after the scene: a depth of field focused on Gorti's plane,
// then the game's comic-book print (as fx/comicFx.ts does for what Phaser
// draws: halftone dots in the mid and dark tones, the colour plates a hair
// out of register, the grain of warm paper) with the fibres of the paper
// and a gentle vignette. Two passes at most: the blur, then the print
// straight to the canvas.
//
// The blur reads the scene's own depth: the cards are alpha-tested, so the
// ground around a cut shape keeps the depth of what is behind it.

const QUAD_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const DOF_FRAG = /* glsl */ `
#include <packing>
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform vec2 uTexel;
uniform float uNear;
uniform float uFar;
uniform float uFocus;
uniform float uScale;
uniform float uMaxBlur;
varying vec2 vUv;

float viewDepth(vec2 uv) {
  return -perspectiveDepthToViewZ(texture2D(tDepth, uv).x, uNear, uFar);
}

// Blur radius in pixels for a depth: thin-lens-like, 1/f - 1/z.
float blurSize(float z) {
  return clamp(abs(1.0 / uFocus - 1.0 / z) * uScale, 0.0, 1.0) * uMaxBlur;
}

void main() {
  float cz = viewDepth(vUv);
  float cs = blurSize(cz);
  vec3 col = texture2D(tColor, vUv).rgb;
  float tot = 1.0;
#if SAMPLES > 0
  // Gather over a golden-angle spiral; a sample counts where its own blur
  // reaches this pixel, and sharper things behind cannot bleed forward.
  for (int i = 0; i < SAMPLES; i++) {
    float fi = float(i) + 0.5;
    float r = sqrt(fi / float(SAMPLES)) * uMaxBlur;
    float a = fi * 2.39996323;
    vec2 tc = vUv + vec2(cos(a), sin(a)) * uTexel * r;
    vec3 sc = texture2D(tColor, tc).rgb;
    float sz = viewDepth(tc);
    float ss = blurSize(sz);
    if (sz > cz) ss = clamp(ss, 0.0, cs * 2.0);
    float m = smoothstep(r - 0.5, r + 0.5, ss);
    col += mix(col / tot, sc, m);
    tot += 1.0;
  }
#endif
  gl_FragColor = vec4(col / tot, 1.0);
}
`;

/** The comic print (linear in, sRGB out to the canvas). */
const PRINT_FRAG = /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uStrength;
uniform float uVignette;
varying vec2 vUv;

vec3 toSRGB(vec3 c) {
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
  return mix(hi, lo, vec3(lessThanEqual(c, vec3(0.0031308))));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x), f.y);
}

void main() {
  vec2 uv = vUv;
  vec2 px = 1.0 / uResolution;
  // Measured on the game's 1280x720 view.
  float k = uResolution.y / 720.0;
  // The plates slightly out of register: red a touch right, blue left.
  vec3 base = toSRGB(texture2D(tDiffuse, uv).rgb);
  float r = toSRGB(texture2D(tDiffuse, uv + vec2(px.x * 0.9 * k, 0.0)).rgb).r;
  float b = toSRGB(texture2D(tDiffuse, uv - vec2(px.x * 0.9 * k, -px.y * 0.4 * k)).rgb).b;
  vec3 col = mix(base, vec3(r, base.g, b), uStrength);
  // Halftone: a 45 degree dot screen; darker tones get bigger dots.
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec2 p = uv * uResolution / (4.6 * k);
  vec2 q = vec2(p.x + p.y, p.y - p.x) * 0.7071;
  vec2 cell = fract(q) - 0.5;
  float rad = 0.62 * sqrt(clamp(1.0 - lum, 0.0, 1.0));
  float dotMask = 1.0 - smoothstep(rad - 0.08, rad + 0.08, length(cell));
  float shade = smoothstep(0.92, 0.35, lum);
  col *= 1.0 - dotMask * shade * 0.2 * uStrength;
  // Warm paper: its grain, and a faint cloudiness of the fibres.
  vec2 gp = uv * uResolution / (1.5 * k);
  float g = hash(floor(gp));
  float fibre = noise(uv * uResolution / (38.0 * k)) * 0.6 + noise(uv * uResolution / (11.0 * k)) * 0.4;
  col *= mix(vec3(1.0), vec3(1.0, 0.985, 0.95) * (0.965 + 0.05 * g) * (0.985 + 0.03 * fibre), uStrength);
  // A gentle vignette.
  vec2 d = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float v = smoothstep(1.05, 0.38, length(d));
  col *= mix(1.0 - uVignette, 1.0, v);
  gl_FragColor = vec4(col, 1.0);
}
`;

export interface PostSettings {
  /** Multisampling of the scene (0 = none). */
  samples: number;
  /** Depth-of-field samples (0 = no blur). */
  dof: number;
}

export class Post {
  private scene: THREE.WebGLRenderTarget;
  private blurred: THREE.WebGLRenderTarget | null = null;
  private readonly dofQuad: FullScreenQuad;
  private readonly printQuad: FullScreenQuad;
  private readonly dofU: Record<string, THREE.IUniform>;
  private readonly printU: Record<string, THREE.IUniform>;
  private w = 1;
  private h = 1;
  private cfg: PostSettings;

  constructor(cfg: PostSettings) {
    this.cfg = { ...cfg };
    this.scene = this.makeSceneTarget();
    this.dofU = {
      tColor: { value: null },
      tDepth: { value: null },
      uTexel: { value: new THREE.Vector2() },
      uNear: { value: 1 },
      uFar: { value: 100 },
      uFocus: { value: 900 },
      uScale: { value: 1600 },
      uMaxBlur: { value: 8 },
    };
    this.dofQuad = new FullScreenQuad(
      new THREE.ShaderMaterial({ uniforms: this.dofU, vertexShader: QUAD_VERT, fragmentShader: DOF_FRAG, defines: { SAMPLES: cfg.dof }, depthTest: false, depthWrite: false }),
    );
    this.printU = {
      tDiffuse: { value: null },
      uResolution: { value: new THREE.Vector2(1280, 720) },
      uStrength: { value: 1 },
      uVignette: { value: 0.07 },
    };
    this.printQuad = new FullScreenQuad(new THREE.ShaderMaterial({ uniforms: this.printU, vertexShader: QUAD_VERT, fragmentShader: PRINT_FRAG, depthTest: false, depthWrite: false }));
  }

  private makeSceneTarget(): THREE.WebGLRenderTarget {
    const t = new THREE.WebGLRenderTarget(this.w, this.h, {
      samples: this.cfg.samples,
      type: THREE.UnsignedByteType,
      colorSpace: THREE.SRGBColorSpace,
      depthBuffer: true,
    });
    t.depthTexture = new THREE.DepthTexture(this.w, this.h);
    return t;
  }

  /** Changes the multisampling and the blur's quality. */
  configure(cfg: PostSettings): void {
    if (cfg.samples !== this.cfg.samples) {
      this.cfg.samples = cfg.samples;
      this.scene.dispose();
      this.scene = this.makeSceneTarget();
    }
    if (cfg.dof !== this.cfg.dof) {
      this.cfg.dof = cfg.dof;
      const m = this.dofQuad.material as THREE.ShaderMaterial;
      m.defines = { SAMPLES: cfg.dof };
      m.needsUpdate = true;
    }
  }

  get settings(): PostSettings {
    return { ...this.cfg };
  }

  /** Drawing-buffer size in pixels. */
  setSize(w: number, h: number): void {
    this.w = Math.max(1, Math.round(w));
    this.h = Math.max(1, Math.round(h));
    this.scene.setSize(this.w, this.h);
    this.blurred?.setSize(this.w, this.h);
    (this.dofU.uTexel!.value as THREE.Vector2).set(1 / this.w, 1 / this.h);
    // Blur measured on a 720-line picture, so it looks alike at any size.
    this.dofU.uMaxBlur!.value = 8 * (this.h / 720);
    (this.printU.uResolution!.value as THREE.Vector2).set(this.w, this.h);
  }

  /**
   * Where the focus lies (view depth, px), how quickly things blur away
   * from it, and how far the widest blur reaches (1 = 8 px on 720 lines).
   */
  focus(depth: number, scale: number, reach = 1): void {
    this.dofU.uFocus!.value = depth;
    this.dofU.uScale!.value = scale;
    this.dofU.uMaxBlur!.value = 8 * (this.h / 720) * reach;
  }

  set strength(v: number) {
    this.printU.uStrength!.value = v;
  }

  render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    renderer.setRenderTarget(this.scene);
    renderer.clear();
    renderer.render(scene, camera);
    let src: THREE.Texture = this.scene.texture;
    if (this.cfg.dof > 0) {
      if (!this.blurred) {
        this.blurred = new THREE.WebGLRenderTarget(this.w, this.h, { type: THREE.UnsignedByteType, colorSpace: THREE.SRGBColorSpace, depthBuffer: false });
      }
      this.dofU.tColor!.value = this.scene.texture;
      this.dofU.tDepth!.value = this.scene.depthTexture;
      this.dofU.uNear!.value = camera.near;
      this.dofU.uFar!.value = camera.far;
      renderer.setRenderTarget(this.blurred);
      this.dofQuad.render(renderer);
      src = this.blurred.texture;
    }
    this.printU.tDiffuse!.value = src;
    renderer.setRenderTarget(null);
    this.printQuad.render(renderer);
  }

  dispose(): void {
    this.scene.dispose();
    this.blurred?.dispose();
    this.dofQuad.dispose();
    this.printQuad.dispose();
  }
}
