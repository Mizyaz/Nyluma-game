import * as THREE from 'three';
import { grainCanvas } from '../2d/TextureFactory';

// Materials of the diorama: paper cut-outs (the game's own art, cut by its
// alpha, with a cardboard edge a shade darker than the art), the plain
// paper of the box, and soft glows.

/**
 * The cut edge of a card: the art itself in the shade of its own side, a
 * little darker (coloured paper through and through): it reads as the
 * paper's thickness, never as a drawn line.
 */
export const EDGE_TINT = 0xd2c8ce;

const CARD_MAP = /* glsl */ `
#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	// Premultiplied sRGB texels (see TextureCache): straighten, then decode.
	vec3 straightColor = sampledDiffuseColor.rgb / max( sampledDiffuseColor.a, 0.0001 );
	diffuseColor.rgb *= sRGBTransferEOTF( vec4( straightColor, 1.0 ) ).rgb;
	diffuseColor.a *= sampledDiffuseColor.a;
#endif
`;

export type CardMaterial = THREE.MeshLambertMaterial | THREE.MeshBasicMaterial;

/** How a card is drawn; changing any of these swaps the material's program. */
export interface CardLook {
  lit: boolean;
  additive: boolean;
}

/**
 * A card: the art's alpha cuts the shape (alpha to coverage on the
 * multisampled picture, so the cut is smooth) and the same cut shapes the
 * shadow it casts.
 */
export function cardMaterial(tex: THREE.Texture | null, look: CardLook): CardMaterial {
  const params: THREE.MeshBasicMaterialParameters = { map: tex, alphaTest: 0.5, side: THREE.DoubleSide };
  const m = look.lit && !look.additive ? new THREE.MeshLambertMaterial(params) : new THREE.MeshBasicMaterial(params);
  // A plane seen by the light from its front must be drawn front-facing
  // into the shadow map too (the default draws back faces only).
  m.shadowSide = THREE.DoubleSide;
  if (look.additive) {
    m.blending = THREE.AdditiveBlending;
    m.transparent = true;
    m.depthWrite = false;
    m.alphaTest = 0.002;
  }
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', CARD_MAP);
  };
  m.customProgramCacheKey = () => 'stage-card';
  return m;
}

/**
 * Switches a card between cut-out (opaque, depth-writing) and see-through
 * (fading) drawing. Returns true when the program has to change.
 */
export function setCardAlpha(m: CardMaterial, alpha: number, coverage: boolean): void {
  if (m.blending === THREE.AdditiveBlending) {
    m.opacity = alpha;
    return;
  }
  const fading = alpha < 0.995;
  if (fading !== m.transparent) {
    m.transparent = fading;
    m.depthWrite = !fading;
    m.alphaTest = fading ? 0.004 : 0.5;
    m.needsUpdate = true;
  }
  const a2c = coverage && !fading;
  if (a2c !== m.alphaToCoverage) {
    m.alphaToCoverage = a2c;
    m.needsUpdate = true;
  }
  m.opacity = fading ? alpha : 1;
}

/**
 * A unit quad (u, v from 0 to 1, v down), its UVs set per frame of art.
 * Wound counter-clockwise in its own space: the y flip into three.js space
 * (negative determinant) makes three.js turn its front face round, so the
 * lit side faces the viewer.
 */
export function quadGeometry(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0], 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2));
  g.setIndex([0, 1, 2, 1, 3, 2]);
  g.computeBoundingSphere();
  return g;
}

/** Writes a frame's UV rectangle into a quad. */
export function setQuadUV(g: THREE.BufferGeometry, u0: number, v0: number, u1: number, v1: number): void {
  const uv = g.getAttribute('uv') as THREE.BufferAttribute;
  const a = uv.array as Float32Array;
  a[0] = u0;
  a[1] = v0;
  a[2] = u1;
  a[3] = v0;
  a[4] = u0;
  a[5] = v1;
  a[6] = u1;
  a[7] = v1;
  uv.needsUpdate = true;
}

let paperTile: HTMLCanvasElement | null = null;

/**
 * Opaque paper with the coloured-pencil grain of the paintings (multiplied
 * by a colour): the grain laid twice, turned, so large faces of the box
 * read as coloured paper rather than flat colour.
 */
export function paperCanvas(): HTMLCanvasElement {
  if (paperTile) return paperTile;
  const src = grainCanvas();
  const c = document.createElement('canvas');
  c.width = src.width;
  c.height = src.height;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fbfaf8';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(src, 0, 0);
  ctx.globalAlpha = 0.8;
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate(Math.PI);
  // Turned half round, the tile still repeats without seams.
  ctx.drawImage(src, -c.width / 2, -c.height / 2);
  paperTile = c;
  return c;
}

/** A soft round spot (contact shadows, glows): white, alpha falling to 0. */
export function radialCanvas(stops: readonly (readonly [number, number])[], size = 128): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, a] of stops) g.addColorStop(o, `rgba(255,255,255,${a})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

/** A glow that always faces the camera (bulbs, the lamp's crystal). */
export function glowSprite(tex: THREE.Texture, color: number, size: number, opacity: number): THREE.Sprite {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
  s.scale.set(size, size, 1);
  s.renderOrder = 2;
  return s;
}
