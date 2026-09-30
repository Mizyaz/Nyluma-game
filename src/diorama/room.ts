import * as THREE from 'three';
import { R01 } from '../game/data/rooms/r01';
import type { PropDef, SolidDef } from '../game/data/roomTypes';
import { paintForeground, themeDef } from '../game/art/backgrounds';
import { paintSolid } from '../game/art/terrain';
import { hashSeed, Rng } from '../game/art/svg';
import { canvas, cardMaterial, cardTexture, fadeTexture, loadTexture, paintTexture, partArt, radialTexture, rasterPart } from './art';
import { contactShadow, glowSprite, makeCard, planeFor, slab } from './cutout';
import { sx, sy, U, Z } from './units';

// The children's room of r01 rebuilt as a paper diorama: the painted back
// wall, the floor as a real plane of boards, the earth around the room as
// slabs whose cut face is the game's own terrain painting, the props as
// thick cards at their own depths, and out-of-focus cut-outs in front.

const ROOM = R01;
const THEME = themeDef(ROOM.theme);

/** Where each prop of the room stands in depth, and how thick it is. */
const STAGE: Record<string, { z: number; thick: number; paint?: boolean; lean?: number }> = {
  'prop.fourteen': { z: Z.wall + 0.004, thick: 0, paint: true },
  'prop.marks': { z: Z.wall + 0.004, thick: 0, paint: true },
  'prop.window': { z: Z.wall + 0.07, thick: 0.05 },
  'prop.lamp': { z: -0.95, thick: 0.03 },
  'prop.bed': { z: -0.55, thick: 0.06, lean: -0.05 },
  'prop.chest': { z: -0.62, thick: 0.06, lean: 0.04 },
  'prop.blocks': { z: -0.4, thick: 0.06, lean: 0.06 },
  'prop.toyhorse': { z: -0.3, thick: 0.04, lean: -0.12 },
  'prop.toywhale': { z: -0.2, thick: 0.05, lean: 0.1 },
  'prop.rootdoor.open': { z: -0.3, thick: 0.08 },
  'prop.fossil': { z: Z.wall + 0.012, thick: 0, paint: true },
};

/** Raster resolution of the props (texels per world px). */
const PROP_RES = 2;

/** The painting of chapter I on the nursery wall (data/paintings.ts, r01). */
const PAINTING = { x: 745, y: 430, width: 150 };
const PAINTING_URL = new URL('../assets/paintings/p1-house-of-the-stranger.jpg', import.meta.url).href;

/** Earth beyond the room's own solids, so a wide view shows a cut box. */
const PAD: SolidDef[] = [
  { x: -300, y: -240, w: 2800, h: 240, style: 'soil' },
  { x: -300, y: 0, w: 300, h: 780, style: 'soil' },
  { x: 2200, y: 0, w: 300, h: 440, style: 'soil' },
  { x: 2200, y: 660, w: 300, h: 120, style: 'soil' },
  { x: -300, y: 780, w: 2800, h: 260, style: 'soil' },
];
/** World px covered by the painted cut face of the earth. */
const CUT = { x: -300, y: -240, w: 2800, h: 1280, res: 1.25 };

export interface Room {
  readonly group: THREE.Group;
  readonly key: THREE.DirectionalLight;
  /** Depth (scene z) of the furniture tops Gorti can stand on. */
  readonly platformZ: Map<SolidDef, number>;
  /** Cut-outs in front of the stage (hidden in the wide view). */
  readonly foreground: THREE.Object3D;
  update(t: number): void;
}

/** Painted earth of a style, cut from inside a solid (the slabs' sides). */
function earthMaterial(style: 'soil' | 'root', seed: string, tint: THREE.ColorRepresentation = 0xffffff): THREE.MeshLambertMaterial {
  const [c] = canvas(512, 400);
  paintSolid(c, { x: 0, y: 0, w: 560, h: 600, style }, { x: 24, y: 30 }, THEME.terrain, hashSeed(`${ROOM.id}:${seed}`));
  return new THREE.MeshLambertMaterial({ map: paintTexture(c, true), color: tint });
}

/** The nursery's back wall: the theme's parallax layer, painted to the room. */
function paintWall(): THREE.CanvasTexture {
  const layer = THEME.layers[0]!;
  const w = 2600;
  const [c, ctx] = canvas(w, 700);
  // Sized and shifted so its bands sit where the game's camera shows them
  // around Gorti: the pink wainscot from y ≈ 415 down to the floor, the
  // stone wall above it.
  const h = 766;
  ctx.fillStyle = '#c9c7c4';
  ctx.fillRect(0, 0, w, 700);
  ctx.translate(0, 155);
  layer.draw(ctx, { w, h, horizon: h * 0.6 }, new Rng(hashSeed(`${ROOM.id}:layer:0`)));
  return paintTexture(c);
}

/** The cut face of the earth around the room: every solid, as the game paints it. */
function paintCut(): THREE.CanvasTexture {
  const [c, ctx] = canvas(CUT.w * CUT.res, CUT.h * CUT.res);
  ctx.scale(CUT.res, CUT.res);
  const origin = { x: CUT.x, y: CUT.y };
  PAD.forEach((s, i) => paintSolid(c, s, origin, THEME.terrain, hashSeed(`${ROOM.id}:pad:${i}`)));
  ROOM.solids.forEach((s, i) => {
    // The roots over the door hang inside the room (a slab of their own).
    if (s.hidden || s.style === 'none' || s.style === 'root') return;
    paintSolid(c, s, origin, THEME.terrain, hashSeed(`${ROOM.id}:${i}`));
  });
  // The floor is a real plane here: its painted 2.5D top face goes.
  ctx.clearRect(163 - CUT.x, 596 - CUT.y, 2600, 64.5);
  return cardTexture(c);
}

/** Floor boards seen from above: ten rows of the game's floor painting. */
function paintBoards(): THREE.CanvasTexture {
  const res = 1.5;
  const [c, ctx] = canvas(1720 * res, 300 * res);
  ctx.scale(res, res);
  for (const k of [0, 1]) {
    // Rows 30..180 of a painting of the floor, one band after the other.
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 150 * k, 1720, 150);
    ctx.clip();
    paintSolid(c, { x: 0, y: 0, w: 1720, h: 400, style: 'floor' }, { x: 0, y: 30 - 150 * k }, THEME.terrain, hashSeed(`${ROOM.id}:boards:${k}`));
    ctx.restore();
  }
  const t = paintTexture(c);
  t.wrapT = THREE.RepeatWrapping;
  return t;
}

function paintSoilTop(): THREE.CanvasTexture {
  const [c] = canvas(600, 240);
  paintSolid(c, { x: 0, y: 0, w: 600, h: 400, style: 'soil' }, { x: 0, y: 40 }, THEME.terrain, hashSeed(`${ROOM.id}:tunnelfloor`));
  const t = paintTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Remaps a horizontal plane's UVs to world x/z (in units per texture tile). */
function worldUV(geo: THREE.BufferGeometry, tileX: number, tileZ: number, x0 = 0): void {
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - x0) / tileX, -pos.getZ(i) / tileZ);
}

function floorPlane(x0: number, x1: number, mat: THREE.Material, tileX: number, tileZ: number, ux0 = 0): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(x1 - x0, Z.front - Z.wall);
  geo.rotateX(-Math.PI / 2);
  geo.translate((x0 + x1) / 2, 0, (Z.front + Z.wall) / 2);
  worldUV(geo, tileX, tileZ, ux0);
  const m = new THREE.Mesh(geo, mat);
  m.receiveShadow = true;
  return m;
}

/** A band of soft occlusion along a join (wall foot, corners). */
function occlusion(fade: THREE.Texture, w: number, h: number, opacity: number): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: fade, color: 0x2e2338, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }),
  );
  m.renderOrder = 1;
  return m;
}

async function propCard(p: PropDef): Promise<THREE.Group | null> {
  const st = STAGE[p.key];
  if (!st) return null;
  const art = partArt(p.key);
  const tex = cardTexture(await rasterPart(art, PROP_RES));
  const scale = p.scale ?? 1;
  const card = makeCard({ tex, w: art.w * scale, h: art.h * scale, ox: p.ox ?? 0.5, oy: p.oy ?? 1, thick: st.thick });
  card.position.set(sx(p.x), sy(p.y), st.z);
  // Furniture turned a few degrees, the way cut-outs stand in a real box.
  if (st.lean) card.rotation.y = st.lean;
  card.name = p.key;
  return card;
}

/** The framed painting: a real frame of wood and gilt around the picture. */
function framedPainting(tex: THREE.Texture): THREE.Group {
  const g = new THREE.Group();
  const cw = PAINTING.width * U;
  const fw = 12 * U;
  const depth = 0.05;
  const wood = new THREE.MeshLambertMaterial({ color: 0x6d4b33 });
  const gold = new THREE.MeshLambertMaterial({ color: 0xcfae6a });
  const bar = (w: number, h: number, x: number, y: number): void => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, depth), wood);
    m.position.set(x, y, 0);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
  };
  const half = cw / 2 + fw / 2;
  bar(cw + fw * 2, fw, 0, half);
  bar(cw + fw * 2, fw, 0, -half);
  bar(fw, cw, -half, 0);
  bar(fw, cw, half, 0);
  const liner = new THREE.Mesh(new THREE.BoxGeometry(cw + 8 * U, cw + 8 * U, depth * 0.5), gold);
  liner.position.z = -depth * 0.2;
  liner.receiveShadow = true;
  g.add(liner);
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(cw, cw), new THREE.MeshLambertMaterial({ map: tex }));
  pic.position.z = depth * 0.1;
  pic.receiveShadow = true;
  g.add(pic);
  // Wire to a nail in the wall (the frame stands off it; see buildRoom).
  const wire = new THREE.MeshLambertMaterial({ color: 0x4a4050 });
  const top = cw / 2 + fw;
  for (const s of [-1, 1]) {
    const a = new THREE.Vector3(s * top * 0.55, top - 0.02, -depth / 2);
    const b = new THREE.Vector3(0, top + 0.34, -0.09);
    const len = a.distanceTo(b);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, len, 5), wire);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    m.castShadow = true;
    g.add(m);
  }
  const nail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 10), new THREE.MeshLambertMaterial({ color: 0x8c8a92 }));
  nail.rotation.x = Math.PI / 2;
  nail.position.set(0, top + 0.35, -0.09);
  nail.castShadow = true;
  g.add(nail);
  return g;
}

export async function buildRoom(): Promise<Room> {
  const group = new THREE.Group();
  group.name = 'r01';
  const fade = fadeTexture();
  const spot = radialTexture([
    [0, 0.9],
    [0.45, 0.55],
    [1, 0],
  ]);

  // ---------------------------------------------------------------- walls
  const wallTex = paintWall();
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(26, 7), new THREE.MeshLambertMaterial({ map: wallTex }));
  wall.position.set(sx(1100), sy(350), Z.wall);
  wall.receiveShadow = true;
  group.add(wall);

  const soil = earthMaterial('soil', 'earth');
  const soilDark = earthMaterial('soil', 'tunnel', 0x9d8f92);
  const root = earthMaterial('root', 'rootslab');
  // The tunnel beyond the roots has earth, not wallpaper, behind it.
  const tunnelBack = new THREE.Mesh(new THREE.PlaneGeometry(sx(800), sy(420) - sy(680)), soilDark);
  tunnelBack.position.set(sx(1720 + 400), (sy(420) + sy(680)) / 2, Z.wall + 0.005);
  tunnelBack.receiveShadow = true;
  group.add(tunnelBack);

  // Slabs of earth: the room's solids with depth, their cut face painted.
  const zb = Z.wall - 0.3;
  const zf = Z.front - 0.02;
  // They take shadows but cast none: the key light is the room's own light,
  // not a lamp outside the box (the corners get soft occlusion instead).
  const tile: [number, number] = [5.12, 4];
  for (const m of [
    slab(-3, 0, sx(160), sy(-240), zb, zf, soil, tile),
    slab(sx(160), sy(130), sx(1700), sy(-240), zb, zf, soil, tile),
    slab(sx(1700), sy(430), sx(1770), sy(130), zb, 0.05, root, tile),
    slab(sx(1770), sy(440), sx(2500), sy(-240), zb, zf, soil, tile),
  ]) {
    m.castShadow = false;
    group.add(m);
  }
  const cut = new THREE.Mesh(planeFor(CUT.w, CUT.h, 0, 0), cardMaterial(paintCut()));
  cut.position.set(sx(CUT.x), sy(CUT.y), Z.front);
  cut.receiveShadow = true;
  group.add(cut);

  // ---------------------------------------------------------------- floor
  // The floor faces the sky light but gets the key light at a slant: a
  // little brighter albedo keeps its boards the game's colour.
  const boards = new THREE.MeshLambertMaterial({ map: paintBoards(), color: new THREE.Color(1.16, 1.16, 1.16) });
  group.add(floorPlane(sx(160), sx(1720), boards, sx(1720), 3));
  const tunnelFloor = new THREE.MeshLambertMaterial({ map: paintSoilTop(), color: new THREE.Color(1.1, 1.1, 1.1) });
  group.add(floorPlane(sx(1720), sx(2500), tunnelFloor, sx(600), 2.4, sx(1720)));

  // Soft occlusion where the wall meets the floor, the ceiling and the side
  // (each band is darkest along its own bottom edge, turned to the join).
  const foot = occlusion(fade, sx(1560), 0.4, 0.18);
  foot.position.set(sx(930), 0.2, Z.wall + 0.003);
  group.add(foot);
  const foot2 = occlusion(fade, sx(1560), 0.6, 0.2);
  foot2.rotation.x = Math.PI / 2;
  foot2.position.set(sx(930), 0.002, Z.wall + 0.3);
  group.add(foot2);
  const top = occlusion(fade, sx(1540), 0.6, 0.35);
  top.rotation.z = Math.PI;
  top.position.set(sx(930), sy(130) - 0.3, Z.wall + 0.003);
  group.add(top);
  const side = occlusion(fade, sy(130), 0.5, 0.25);
  side.rotation.z = -Math.PI / 2;
  side.position.set(sx(160) + 0.25, sy(130) / 2, Z.wall + 0.003);
  group.add(side);

  // ---------------------------------------------------------------- props
  const platformZ = new Map<SolidDef, number>();
  const props = await Promise.all((ROOM.props ?? []).map((p) => propCard(p)));
  let lampPivot: THREE.Object3D | null = null;
  for (const [i, card] of props.entries()) {
    if (!card) continue;
    const def = ROOM.props![i]!;
    const st = STAGE[def.key]!;
    if (def.key === 'prop.lamp') {
      // Hung from the ceiling on its roots: it sways from the top.
      lampPivot = card;
    }
    group.add(card);
    if (!st.paint && def.key !== 'prop.lamp' && def.key !== 'prop.window') {
      const art = partArt(def.key);
      const w = art.w * (def.scale ?? 1) * U;
      const cs = contactShadow(spot, w * 1.05, 0.34, 0.55);
      cs.position.set(sx(def.x), 0.003, st.z + 0.02);
      group.add(cs);
    }
  }
  // Checkpoint lanterns stand where the game puts them (RoomRuntime).
  for (const c of ROOM.checkpoints) {
    if (c.silent) continue;
    const art = partArt('prop.lantern');
    const lantern = makeCard({ tex: cardTexture(await rasterPart(art, PROP_RES)), w: art.w, h: art.h, ox: 0.5, oy: 1, thick: 0.04 });
    lantern.position.set(sx(c.x - 46), sy(c.y + 2), -0.12);
    group.add(lantern);
    const cs = contactShadow(spot, art.w * U * 1.1, 0.25, 0.45);
    cs.position.set(sx(c.x - 46), 0.003, -0.1);
    group.add(cs);
  }
  // The furniture tops of the room data belong to the cards behind them.
  for (const s of ROOM.solids) {
    if (!s.oneWay) continue;
    const cx = s.x + s.w / 2;
    const owner = ROOM.props!.find((p) => STAGE[p.key] && !STAGE[p.key]!.paint && Math.abs(p.x - cx) < 90 && p.y >= 600);
    if (owner) platformZ.set(s, STAGE[owner.key]!.z + 0.1);
  }

  const painting = framedPainting(await loadTexture(PAINTING_URL));
  // On spacers a little off the wall, so it throws a shadow there.
  painting.position.set(sx(PAINTING.x), sy(PAINTING.y), Z.wall + 0.11);
  group.add(painting);

  // ---------------------------------------------------------------- lights
  // Lit straight on, a card gets key × N·L + sky + ambient ≈ π: its own colour.
  const hemi = new THREE.HemisphereLight(0xf7f5ff, 0xf2ebe2, 1.2);
  group.add(hemi);
  group.add(new THREE.AmbientLight(0xfffaf4, 0.12));
  // A soft fill from the right, so faces turned from the key are not dead.
  const fill = new THREE.DirectionalLight(0xeef0ff, 0.8);
  fill.position.set(0.75, 0.15, 0.64);
  group.add(fill);
  const key = new THREE.DirectionalLight(0xfffaf4, 2.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 40;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.012;
  key.shadow.radius = 6;
  key.shadow.intensity = 0.82;
  group.add(key);
  group.add(key.target);

  // The lamp: a warm light in its crystal, and a glow around it.
  const lampLight = new THREE.PointLight(0xffb46b, 2.4, 6, 1.6);
  const glowTex = radialTexture([
    [0, 1],
    [0.25, 0.45],
    [1, 0],
  ]);
  const glowA = glowSprite(glowTex, 0xffc27d, 1.5, 0.45);
  const glowB = glowSprite(glowTex, 0xfff0c8, 0.55, 0.6);
  if (lampPivot) {
    const crystal = new THREE.Object3D();
    crystal.position.set(0, -1.46, 0.05);
    lampPivot.add(crystal);
    crystal.add(lampLight, glowA, glowB);
  }
  // Violet earth-light through the window.
  const windowLight = new THREE.PointLight(0xb89cff, 0.9, 3.2, 1.6);
  windowLight.position.set(sx(1441), sy(400), Z.wall + 0.5);
  group.add(windowLight);

  // ---------------------------------------------------------------- foreground
  // The game's foreground strip (crystals on pebbles) along the front edge
  // of the floor, low enough to pass under Gorti's feet in the view, and a
  // few big crystal clusters right at the lens, below the stage edge.
  const foreground = new THREE.Group();
  {
    const fw = 3200;
    const fh = 150;
    const [c, ctx] = canvas(fw, fh);
    paintForeground(ctx, fw, fh, ROOM.theme, new Rng(hashSeed(`${ROOM.id}:fg`)));
    const card = makeCard({ tex: cardTexture(c), w: fw, h: fh, ox: 0, oy: 1, thick: 0.05 });
    card.scale.y = 0.5;
    card.position.set(sx(-500), -0.03, Z.front - 0.25);
    foreground.add(card);
    const clusters: [string, number, number, number][] = [
      ['prop.crystals.teal', 360, 4.6, 1.55],
      ['prop.crystals.orange', 1150, 4.75, 1.35],
      ['prop.crystals.blue', 1590, 4.5, 1.6],
    ];
    for (const [k, x, z, s] of clusters) {
      const art = partArt(k);
      const cc = makeCard({ tex: cardTexture(await rasterPart(art, 1.5)), w: art.w * s, h: art.h * s, ox: 0.5, oy: 1, thick: 0.05 });
      cc.position.set(sx(x), -0.5, z);
      foreground.add(cc);
    }
  }
  group.add(foreground);

  const base = { lamp: lampLight.intensity, window: windowLight.intensity };
  return {
    group,
    key,
    platformZ,
    foreground,
    update(t: number): void {
      if (lampPivot) lampPivot.rotation.z = 0.018 * Math.sin(t * 0.8) + 0.006 * Math.sin(t * 2.1 + 1);
      const flick = 1 + 0.035 * Math.sin(t * 11.3) + 0.025 * Math.sin(t * 6.1 + 2) + 0.02 * Math.sin(t * 17.9);
      lampLight.intensity = base.lamp * flick;
      glowA.material.opacity = 0.42 * flick;
      windowLight.intensity = base.window * (1 + 0.08 * Math.sin(t * 0.7));
    },
  };
}
