import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FullScreenQuad, Pass } from 'three/examples/jsm/postprocessing/Pass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// The picture after the scene: a bokeh depth of field focused on Gorti,
// then the game's comic-book print (src/game/fx/comicFx.ts: halftone dots in
// the mid and dark tones, the colour plates a hair out of register, the
// grain of warm paper) and a gentle vignette.
//
// The depth of field reads the scene's own depth buffer: the cut-outs are
// alpha-tested, so the ground around a cut shape keeps the depth of what is
// behind it (BokehPass re-renders depth without the cut, which would blur a
// card-shaped halo around every prop).

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

const QUAD_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Renders the scene into a multisampled target with a depth texture (via
 * RenderPass), then writes it out through the depth of field.
 */
export class SceneDofPass extends Pass {
  readonly target: THREE.WebGLRenderTarget;
  readonly uniforms: Record<string, THREE.IUniform>;
  enabledDof = true;
  private readonly scenePass: RenderPass;
  private readonly quad: FullScreenQuad;
  private readonly camera: THREE.PerspectiveCamera;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, samples: number) {
    super();
    this.camera = camera;
    this.scenePass = new RenderPass(scene, camera);
    this.target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples });
    this.target.depthTexture = new THREE.DepthTexture(1, 1);
    this.uniforms = {
      tColor: { value: this.target.texture },
      tDepth: { value: this.target.depthTexture },
      uTexel: { value: new THREE.Vector2() },
      uNear: { value: camera.near },
      uFar: { value: camera.far },
      uFocus: { value: 8 },
      uScale: { value: 22 },
      uMaxBlur: { value: 11 },
    };
    this.quad = new FullScreenQuad(
      new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: QUAD_VERT, fragmentShader: DOF_FRAG, defines: { SAMPLES: 48 }, depthTest: false, depthWrite: false }),
    );
    this.needsSwap = true;
  }

  override setSize(w: number, h: number): void {
    this.target.setSize(w, h);
    (this.uniforms.uTexel!.value as THREE.Vector2).set(1 / w, 1 / h);
    // Blur measured on a 720-line picture, so it looks alike at any size.
    this.uniforms.uMaxBlur!.value = 11 * (h / 720);
  }

  override render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget): void {
    this.scenePass.render(renderer, writeBuffer, this.target, 0, false);
    this.uniforms.uNear!.value = this.camera.near;
    this.uniforms.uFar!.value = this.camera.far;
    const mat = this.quad.material as THREE.ShaderMaterial;
    const samples = this.enabledDof ? 48 : 0;
    if (mat.defines.SAMPLES !== samples) {
      mat.defines.SAMPLES = samples;
      mat.needsUpdate = true;
    }
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);
  }

  override dispose(): void {
    this.target.dispose();
    this.quad.dispose();
  }
}

/** The comic print over the final picture (sRGB values in, out). */
const COMIC_FRAG = /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uStrength;
uniform float uVignette;
varying vec2 vUv;

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
  vec4 base = texture2D(tDiffuse, uv);
  float r = texture2D(tDiffuse, uv + vec2(px.x * 0.9 * k, 0.0)).r;
  float b = texture2D(tDiffuse, uv - vec2(px.x * 0.9 * k, -px.y * 0.4 * k)).b;
  vec3 col = mix(base.rgb, vec3(r, base.g, b), uStrength);
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

export class Post {
  readonly composer: EffectComposer;
  readonly scene: SceneDofPass;
  readonly comic: ShaderPass;
  private readonly output: OutputPass;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, samples = 4) {
    this.composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }));
    this.scene = new SceneDofPass(scene, camera, samples);
    this.output = new OutputPass();
    this.comic = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: null },
          uResolution: { value: new THREE.Vector2(1280, 720) },
          uStrength: { value: 1 },
          uVignette: { value: 0.22 },
        },
        vertexShader: QUAD_VERT,
        fragmentShader: COMIC_FRAG,
      }),
    );
    this.composer.addPass(this.scene);
    this.composer.addPass(this.output);
    this.composer.addPass(this.comic);
  }

  setSize(w: number, h: number, pixelRatio: number): void {
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(w, h);
    (this.comic.uniforms.uResolution!.value as THREE.Vector2).set(Math.round(w * pixelRatio), Math.round(h * pixelRatio));
  }

  set focus(d: number) {
    this.scene.uniforms.uFocus!.value = d;
  }

  set dof(on: boolean) {
    this.scene.enabledDof = on;
  }

  get dof(): boolean {
    return this.scene.enabledDof;
  }

  set print(on: boolean) {
    this.comic.uniforms.uStrength!.value = on ? 1 : 0;
    this.comic.uniforms.uVignette!.value = on ? 0.22 : 0;
  }

  get print(): boolean {
    return (this.comic.uniforms.uStrength!.value as number) > 0;
  }

  render(): void {
    this.composer.render();
  }
}
