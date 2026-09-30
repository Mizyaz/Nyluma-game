import * as THREE from 'three';
import screenUrl from '../../../assets/figure/gorti-screen.png';
import { figureTextures } from './paint';

// How a figure is drawn. The body is lit like the room's cut-outs (Lambert)
// but the light wraps a little further round it and its rims darken, so the
// forms read round and soft; each vertex wears one of the grey textures of
// paint.ts over its colour. An ink hull, the body pushed out along its
// smoothed normals and drawn from behind, outlines it. Gorti's face is a
// glowing screen that the room's light does not touch.

export const INK = 0x0e0a10;

/** How far past the terminator the light wraps (0 = plain Lambert). */
const WRAP = 0.35;
/** How much the rims darken. */
const RIM = 0.18;

const LAMBERT_DOT = 'float dotNL = saturate( dot( geometryNormal, directLight.direction ) );';

export interface FigureMaterials {
  body: THREE.MeshLambertMaterial;
  hull: THREE.MeshBasicMaterial;
  screen: THREE.ShaderMaterial | null;
}

export function bodyMaterial(): THREE.MeshLambertMaterial {
  const tex = figureTextures();
  const m = new THREE.MeshLambertMaterial({ vertexColors: true });
  m.onBeforeCompile = (s) => {
    s.uniforms.tSkin = { value: tex.skin };
    s.uniforms.tBark = { value: tex.bark };
    s.uniforms.tPlank = { value: tex.plank };
    s.uniforms.tLeaf = { value: tex.leaf };
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aKind;\nvarying float vKind;\nvarying vec2 vTex;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvKind = aKind;\nvTex = uv;');
    const pars = THREE.ShaderChunk.lights_lambert_pars_fragment.replace(
      LAMBERT_DOT,
      `float dotNL = saturate( ( dot( geometryNormal, directLight.direction ) + ${WRAP.toFixed(2)} ) / ${(1 + WRAP).toFixed(2)} );`,
    );
    s.fragmentShader = s.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform sampler2D tSkin;\nuniform sampler2D tBark;\nuniform sampler2D tPlank;\nuniform sampler2D tLeaf;\nvarying float vKind;\nvarying vec2 vTex;',
      )
      .replace('#include <lights_lambert_pars_fragment>', pars)
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
{
  float k = vKind;
  float wSkin = 1.0 - step( 0.5, k );
  float wBark = step( 0.5, k ) * ( 1.0 - step( 1.5, k ) );
  float wPlank = step( 1.5, k ) * ( 1.0 - step( 2.5, k ) );
  float wPlain = step( 2.5, k ) * ( 1.0 - step( 3.5, k ) );
  float wLeaf = step( 3.5, k );
  float g = texture2D( tSkin, vTex ).r * wSkin + texture2D( tBark, vTex ).r * wBark
    + texture2D( tPlank, vTex ).r * wPlank + 0.8333 * wPlain + texture2D( tLeaf, vTex ).r * wLeaf;
  diffuseColor.rgb *= g * 1.2;
}`,
      )
      .replace(
        '#include <opaque_fragment>',
        `outgoingLight *= 1.0 - ${RIM.toFixed(2)} * pow( 1.0 - abs( dot( normal, normalize( vViewPosition ) ) ), 3.0 );
#include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => 'figure-body';
  return m;
}

/** The ink outline: back faces pushed out along `hullNormal` (its length is the width, model units). */
export function hullMaterial(): THREE.MeshBasicMaterial {
  const m = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
  const scale = { value: 1 };
  m.userData.hullScale = scale;
  m.onBeforeCompile = (s) => {
    s.uniforms.uHull = scale;
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec3 hullNormal;\nuniform float uHull;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += hullNormal * uHull;');
  };
  m.customProgramCacheKey = () => 'figure-hull';
  return m;
}

/** Scales every hull's width (model units per unit of `hullNormal`). */
export function setHullScale(m: THREE.MeshBasicMaterial, k: number): void {
  (m.userData.hullScale as { value: number }).value = k;
}

let screenTex: THREE.Texture | null = null;

function screenTexture(): THREE.Texture {
  if (!screenTex) {
    screenTex = new THREE.TextureLoader().load(screenUrl);
    screenTex.colorSpace = THREE.NoColorSpace;
    screenTex.minFilter = THREE.LinearMipmapLinearFilter;
    screenTex.magFilter = THREE.LinearFilter;
    screenTex.anisotropy = 4;
  }
  return screenTex;
}

const SCREEN_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

/*
 * The face's marks are signed distance fields (gorti-screen.png): red the
 * pink cross, green the purple blocks, blue the pink glow round the cross.
 */
const SCREEN_FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform vec3 uInk;
uniform vec3 uPinkA;
uniform vec3 uPinkB;
uniform vec3 uPurA;
uniform vec3 uPurB;
uniform float uGlow;
uniform float uBlink;
uniform float uFlash;
uniform float uTalk;
uniform float opacity;
varying vec2 vUv;
void main() {
  vec3 s = texture2D( uMap, vUv ).rgb;
  float wr = fwidth( s.r ) * 0.75 + 1e-4;
  float wg = fwidth( s.g ) * 0.75 + 1e-4;
  float pink = smoothstep( 0.5 - wr, 0.5 + wr, s.r );
  float pur = smoothstep( 0.5 - wg, 0.5 + wg, s.g );
  vec3 pinkC = mix( uPinkA, uPinkB, smoothstep( 0.5, 0.95, s.r ) ) * ( 1.0 + 0.3 * uTalk );
  vec3 purC = mix( uPurA, uPurB, smoothstep( 0.5, 0.9, s.g ) ) * ( 0.9 + 0.2 * vUv.y );
  vec3 col = uInk + uPinkA * s.b * 0.35 * uGlow;
  col = mix( col, purC, pur );
  col = mix( col, pinkC, pink );
  col *= mix( 1.0, 0.35, uBlink ) * uGlow;
  col = mix( col, vec3( 1.0, 0.93, 0.97 ), uFlash * 0.7 * max( pink, pur ) );
  gl_FragColor = vec4( col, opacity );
  #include <colorspace_fragment>
}
`;

export const SCREEN_COLORS = {
  ink: 0x0e0a10,
  pinkA: 0xc4648c,
  pinkB: 0xee7ca9,
  purA: 0x9d739d,
  purB: 0xbb84ba,
};

export function screenMaterial(): THREE.ShaderMaterial {
  const c = (hex: number): THREE.Color => new THREE.Color().setHex(hex);
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: screenTexture() },
      uInk: { value: c(SCREEN_COLORS.ink) },
      uPinkA: { value: c(SCREEN_COLORS.pinkA) },
      uPinkB: { value: c(SCREEN_COLORS.pinkB) },
      uPurA: { value: c(SCREEN_COLORS.purA) },
      uPurB: { value: c(SCREEN_COLORS.purB) },
      uGlow: { value: 1 },
      uBlink: { value: 0 },
      uFlash: { value: 0 },
      uTalk: { value: 0 },
      opacity: { value: 1 },
    },
    vertexShader: SCREEN_VERT,
    fragmentShader: SCREEN_FRAG,
  });
}

/** Fades a material; see-through drawing only while it is not fully opaque. */
export function setOpacity(m: THREE.Material, a: number): void {
  const see = a < 0.999;
  if (m instanceof THREE.ShaderMaterial) m.uniforms.opacity!.value = a;
  else m.opacity = a;
  if (m.transparent !== see) {
    m.transparent = see;
    m.needsUpdate = true;
  }
}
