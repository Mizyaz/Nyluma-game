import * as THREE from 'three';
import { cardMaterial } from './art';
import { U } from './units';

// Building blocks of the diorama: thick paper cut-outs, painted slabs of
// earth, soft contact shadows and glows.

/** The edge of a card: the art itself, darker (coloured, never black). */
export const CARD_EDGE = 0x8f8189;

/** A plane of w × h world px whose origin sits at (ox, oy) of the art (y down). */
export function planeFor(w: number, h: number, ox: number, oy: number): THREE.PlaneGeometry {
  const g = new THREE.PlaneGeometry(w * U, h * U);
  g.translate((0.5 - ox) * w * U, -(0.5 - oy) * h * U, 0);
  return g;
}

export interface CardSpec {
  tex: THREE.Texture;
  /** Size of the art in world px. */
  w: number;
  h: number;
  /** Origin within the art (0..1, y down); the card's position is there. */
  ox: number;
  oy: number;
  /** Thickness in scene units; 0 is paint on a surface (no edge, no shadow). */
  thick: number;
  edge?: THREE.ColorRepresentation;
  cast?: boolean;
  unlit?: boolean;
}

/**
 * A thick card: the art in front and, behind it, the same cut in a darker
 * tone, a hair lower and to the right, so the card shows an edge even seen
 * straight on (light comes from the upper left).
 */
export function makeCard(s: CardSpec): THREE.Group {
  const g = new THREE.Group();
  const geo = planeFor(s.w, s.h, s.ox, s.oy);
  const front = new THREE.Mesh(geo, cardMaterial(s.tex, { unlit: s.unlit }));
  front.castShadow = s.cast ?? s.thick > 0;
  front.receiveShadow = true;
  front.name = 'front';
  g.add(front);
  if (s.thick > 0) {
    const edge = cardMaterial(s.tex, { color: s.edge ?? CARD_EDGE });
    const layers = s.thick > 0.025 ? 2 : 1;
    for (let i = 1; i <= layers; i++) {
      const k = i / layers;
      const b = new THREE.Mesh(geo, edge);
      b.position.set(1.1 * U * k, -1.4 * U * k, -s.thick * k);
      b.receiveShadow = true;
      g.add(b);
    }
  }
  return g;
}

/**
 * A box of earth or wood, x0..x1 × y0..y1 × z0..z1 in scene units, its
 * texture laid in world space so neighbouring slabs line up.
 */
export function slab(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, mat: THREE.Material | THREE.Material[], tile: [number, number] = [2.56, 2.56]): THREE.Mesh {
  const geo = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
  geo.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  const pos = geo.getAttribute('position');
  const nor = geo.getAttribute('normal');
  const uv = geo.getAttribute('uv');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const [tu, tv] = tile;
    if (Math.abs(nor.getX(i)) > 0.5) uv.setXY(i, z / tu, y / tv);
    else if (Math.abs(nor.getY(i)) > 0.5) uv.setXY(i, x / tu, z / tv);
    else uv.setXY(i, x / tu, y / tv);
  }
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** A soft dark spot lying on a surface (y up): where things touch the floor. */
export function contactShadow(tex: THREE.Texture, w: number, d: number, opacity = 0.5): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({ map: tex, color: 0x2e2338, transparent: true, opacity, depthWrite: false }),
  );
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = 1;
  return m;
}

/** A glow that always faces the camera (light around the lamp's crystal). */
export function glowSprite(tex: THREE.Texture, color: THREE.ColorRepresentation, size: number, opacity: number): THREE.Sprite {
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  s.scale.set(size, size, 1);
  s.renderOrder = 2;
  return s;
}
