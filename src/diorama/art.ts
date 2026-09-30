import * as THREE from 'three';
import { allParts } from '../game/art/manifest';
import type { PartArt } from '../game/art/rigTypes';
import { applyGrain, rasterizeSvg, svgMarkup, takesGrain } from '../game/art/TextureFactory';

// Turns the game's own artwork into textures for the diorama: the SVG parts
// of the characters and props (manifest.allParts) are rasterized to canvases
// with the coloured-pencil grain, exactly as the game's atlas builder does,
// only at a higher resolution because the 3D camera comes closer.

let aniso = 1;

/** Anisotropic filtering for every texture made from here on. */
export function setAnisotropy(n: number): void {
  aniso = Math.max(1, n);
}

let parts: Map<string, PartArt> | null = null;

/** A part of the game's artwork by key (characters in their soft pastels). */
export function partArt(key: string): PartArt {
  if (!parts) parts = new Map(allParts().map((p) => [p.key, p]));
  const p = parts.get(key);
  if (!p) throw new Error(`Missing art: ${key}`);
  return p;
}

export function hasPart(key: string): boolean {
  if (!parts) parts = new Map(allParts().map((p) => [p.key, p]));
  return parts.has(key);
}

export function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return [c, c.getContext('2d')!];
}

/** One part rasterized at `scale` texels per world px, grain included. */
export async function rasterPart(p: PartArt, scale: number): Promise<HTMLCanvasElement> {
  const [c, ctx] = canvas(p.w * scale, p.h * scale);
  if (!p.body) return c;
  try {
    ctx.drawImage(await rasterizeSvg(svgMarkup(p, scale)), 0, 0, c.width, c.height);
  } catch {
    // Decorative: an empty card is better than no room.
    return c;
  }
  if (takesGrain(p)) applyGrain(ctx, 0, 0, c.width, c.height, { scale });
  return c;
}

/**
 * Texture of a cut-out card. The canvas is uploaded as it is stored,
 * premultiplied and sRGB-encoded, so the colours at a cut edge filter
 * without dark fringes; cardMaterial() undoes both in the shader.
 */
export function cardTexture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.premultiplyAlpha = true;
  t.colorSpace = THREE.NoColorSpace;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.anisotropy = aniso;
  return t;
}

/** Texture of an opaque painted surface (wall, floor boards, soil). */
export function paintTexture(c: HTMLCanvasElement, repeat = false): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.anisotropy = aniso;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

const CARD_MAP = /* glsl */ `
#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	// Premultiplied sRGB texels (see cardTexture): straighten, then decode.
	vec3 straightColor = sampledDiffuseColor.rgb / max( sampledDiffuseColor.a, 0.0001 );
	diffuseColor.rgb *= sRGBTransferEOTF( vec4( straightColor, 1.0 ) ).rgb;
	diffuseColor.a *= sampledDiffuseColor.a;
#endif
`;

export interface CardMatOpts {
  /** Multiplies the art (a darker card edge, the far side of the body). */
  color?: THREE.ColorRepresentation;
  /** Not lit (glowing marks: the neon face on Gorti's screen). */
  unlit?: boolean;
}

/**
 * Material of a cut-out card: the art's alpha cuts the shape (alpha to
 * coverage on the multisampled scene, so the cut is smooth), and the same
 * cut shapes its shadow.
 */
export function cardMaterial(tex: THREE.Texture, o: CardMatOpts = {}): THREE.MeshLambertMaterial | THREE.MeshBasicMaterial {
  const params = { map: tex, color: o.color ?? 0xffffff, alphaTest: 0.5, alphaToCoverage: true };
  const m = o.unlit ? new THREE.MeshBasicMaterial(params) : new THREE.MeshLambertMaterial(params);
  // A plane seen by the light from its front must be drawn front-facing
  // into the shadow map too (the default draws back faces only).
  m.shadowSide = THREE.DoubleSide;
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', CARD_MAP);
  };
  m.customProgramCacheKey = () => 'diorama-card';
  return m;
}

/** A soft round spot (contact shadows, glows): white, alpha falling to 0. */
export function radialTexture(stops: [number, number][], size = 128): THREE.CanvasTexture {
  const [c, ctx] = canvas(size, size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, a] of stops) g.addColorStop(o, `rgba(255,255,255,${a})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

/** A band opaque at its bottom edge (v = 0), clear at the top: occlusion at a join. */
export function fadeTexture(power = 1.6): THREE.CanvasTexture {
  const [c, ctx] = canvas(4, 128);
  const img = ctx.createImageData(4, 128);
  for (let y = 0; y < 128; y++) {
    const a = Math.round(255 * Math.pow(1 - y / 127, power));
    for (let x = 0; x < 4; x++) {
      const i = (y * 4 + x) * 4;
      img.data[i] = 255;
      img.data[i + 1] = 255;
      img.data[i + 2] = 255;
      img.data[i + 3] = a;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  // Canvas row 0 (opaque) at v = 0.
  t.flipY = false;
  return t;
}

/** Loads a picture file (the author's painting on the wall). */
export function loadTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = aniso;
        resolve(t);
      },
      undefined,
      () => reject(new Error(`Could not load ${url}`)),
    );
  });
}
