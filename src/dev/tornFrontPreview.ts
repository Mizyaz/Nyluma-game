// Development-only check of the torn front of a room's box (not part of the
// production build). A plain paper box (floor, back wall, side walls), a
// soft warm key light, two spot lamps at the box's ends and shadows, the
// torn front of a 2600×900 room with a keepOpen band over the floor, and
// three cameras: the whole box, the game's follow camera, a close-up of a
// flap. The view contains each camera's frame at any window shape.
// URL: ?cam=wide|mid|close&q=high|low&seed=7&x=990 (the follow camera's
// centre) &band=full (keepOpen past both ends: the paper splits in two)
// &clean=1 (no panel) &bench=1 (window.bench: build times);
// ?cam=debug&tx=&ty=&tz=&w=&yaw=&pitch= looks anywhere.
import * as THREE from 'three';
import { buildTornFront, TORN_THEMES, type TornFront, type TornFrontSpec } from '../game/stage/tornFront';

const params = new URLSearchParams(location.search);
const ROOM = { w: 2600, h: 900, floor: 760 };
/** Depths (px toward the camera from the actor plane). */
const Z_FRONT = 140;
const Z_BACK = -260;
const FOV = 30;
/** The walkable band over the floor (actor plane), with headroom for a jump; ?band=full runs it past both ends. */
const BAND = params.get('band') === 'full' ? { x: -200, y: 470, w: 3000, h: 320 } : { x: 110, y: 470, w: 2380, h: 320 };
/** The follow camera: zoom 1.5, its centre kept at one height here. */
const FOLLOW = { w: 1280 / 1.5, h: 720 / 1.5, cy: 625 };
const FOLLOW_DIST = FOLLOW.h / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));

/**
 * The band as the front plane must keep it open: what the follow camera sees
 * of it through the front, over the camera's whole range. A point (x, y) of
 * the actor plane is seen through the front plane at c + (p - c) * k.
 */
function keepOpenOnFront(): TornFrontSpec['keepOpen'] {
  const k = (FOLLOW_DIST - Z_FRONT) / FOLLOW_DIST;
  const cx0 = FOLLOW.w / 2;
  const cx1 = ROOM.w - FOLLOW.w / 2;
  const x0 = cx0 + (BAND.x - cx0) * k;
  const x1 = cx1 + (BAND.x + BAND.w - cx1) * k;
  const y0 = FOLLOW.cy + (BAND.y - FOLLOW.cy) * k;
  const y1 = FOLLOW.cy + (BAND.y + BAND.h - FOLLOW.cy) * k;
  return [{ x: x0, y: y0, w: x1 - x0, h: y1 - y0 }];
}

const hud = document.getElementById('hud')!;
if (params.get('clean') === '1') document.body.classList.add('clean');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#d9d4cc');
const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 10, 8000);

const paper = (colour: string): THREE.MeshStandardMaterial => new THREE.MeshStandardMaterial({ color: colour, roughness: 0.95, metalness: 0 });

// The box: game px, y up (y = -game y), the actors on z = 0.
function addBox(): void {
  const depth = Z_FRONT - Z_BACK;
  const back = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.h), paper('#efe4cf'));
  back.position.set(ROOM.w / 2, -ROOM.h / 2, Z_BACK);
  const floor = new THREE.Mesh(new THREE.BoxGeometry(ROOM.w, ROOM.h - ROOM.floor, depth), paper('#eadcc4'));
  floor.position.set(ROOM.w / 2, -(ROOM.floor + ROOM.h) / 2, (Z_FRONT + Z_BACK) / 2);
  const sideGeo = new THREE.PlaneGeometry(depth, ROOM.h);
  const left = new THREE.Mesh(sideGeo, paper('#eedcf0'));
  left.rotation.y = Math.PI / 2;
  left.position.set(0, -ROOM.h / 2, (Z_FRONT + Z_BACK) / 2);
  const right = new THREE.Mesh(sideGeo, paper('#eedcf0'));
  right.rotation.y = -Math.PI / 2;
  right.position.set(ROOM.w, -ROOM.h / 2, (Z_FRONT + Z_BACK) / 2);
  for (const m of [back, floor, left, right]) {
    m.receiveShadow = true;
    m.castShadow = m === floor;
    scene.add(m);
  }
  // A few plain cards for scale: someone on the walking line, a tree, a bed.
  const card = (x: number, w: number, h: number, colour: string, z: number, r: number): void => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, 0);
    s.lineTo(w / 2 - r, 0);
    s.quadraticCurveTo(w / 2, 0, w / 2, r);
    s.lineTo(w / 2, h - r);
    s.quadraticCurveTo(w / 2, h, w / 2 - r, h);
    s.lineTo(-w / 2 + r, h);
    s.quadraticCurveTo(-w / 2, h, -w / 2, h - r);
    s.lineTo(-w / 2, r);
    s.quadraticCurveTo(-w / 2, 0, -w / 2 + r, 0);
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 4, bevelEnabled: false }), paper(colour));
    m.position.set(x, -ROOM.floor, z);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
  };
  card(900, 34, 84, '#9cc8ae', 0, 14);
  card(1420, 70, 300, '#c7a9cf', -120, 30);
  card(520, 220, 80, '#f0c9a6', -80, 16);
  card(2050, 120, 170, '#a9c3e6', -150, 20);
}

function addLights(): void {
  // Shade stays pastel: lilac from above, cream bounced from the floor, and
  // a faint fill from where we stand.
  scene.add(new THREE.HemisphereLight('#f6f0ff', '#d6c3b6', 1.45));
  const fill = new THREE.DirectionalLight('#f4eeff', 0.35);
  fill.position.set(ROOM.w / 2, -ROOM.h / 2 + 200, 3000);
  fill.target.position.set(ROOM.w / 2, -ROOM.h / 2, 0);
  scene.add(fill, fill.target);
  // Soft, warm, from the front and a little above and to the left.
  const key = new THREE.DirectionalLight('#fff1de', 1.75);
  key.position.set(ROOM.w / 2 - 650, 550, Z_FRONT + 1500);
  key.target.position.set(ROOM.w / 2, -ROOM.h / 2, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera;
  sc.left = -1650;
  sc.right = 1650;
  sc.top = 900;
  sc.bottom = -900;
  sc.near = 100;
  sc.far = 4000;
  key.shadow.radius = 7;
  key.shadow.intensity = 0.55;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 1.2;
  scene.add(key, key.target);
  for (const side of [-1, 1]) {
    const x = side < 0 ? -60 : ROOM.w + 60;
    const lamp = new THREE.SpotLight('#ffe6ef', 1.6, 0, 0.55, 0.9, 0);
    lamp.position.set(x, -170, Z_FRONT + 200);
    lamp.target.position.set(ROOM.w / 2 - side * 380, -ROOM.floor + 120, -40);
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(1024, 1024);
    lamp.shadow.radius = 5;
    lamp.shadow.intensity = 0.6;
    lamp.shadow.bias = -0.0004;
    lamp.shadow.normalBias = 1;
    lamp.shadow.camera.near = 60;
    lamp.shadow.camera.far = 4200;
    scene.add(lamp, lamp.target);
  }
}

addBox();
addLights();

let front: TornFront | null = null;
let quality: 'high' | 'low' = params.get('q') === 'low' ? 'low' : 'high';
let seed = Number(params.get('seed') ?? 7);
let cam = params.get('cam') ?? 'wide';
const firstMs: number[] = [];

function spec(): TornFrontSpec {
  return { x0: 0, x1: ROOM.w, top: 0, bottom: ROOM.h, z: Z_FRONT, keepOpen: keepOpenOnFront(), ...TORN_THEMES.chapter1, seed, quality };
}

function rebuild(): void {
  front?.dispose();
  front = buildTornFront(spec());
  if (firstMs.length < 2) firstMs.push(front.stats!.ms);
  scene.add(front.group);
}

/**
 * A flap of the top strip for the close-up: where the paper rolls over, its
 * inside face (marked -1 in the 'torn' attribute) rises highest.
 */
function curlTarget(): THREE.Vector3 {
  const best = new THREE.Vector3(1300, -380, Z_FRONT);
  let z = -Infinity;
  front?.group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || m.name !== 'tornFront.paper') return;
    const p = m.geometry.getAttribute('position');
    const torn = m.geometry.getAttribute('torn');
    for (let i = 0; i < p.count; i++) {
      const y = -p.getY(i);
      if (torn.getY(i) !== -1 || y > BAND.y || y < 150 || p.getX(i) < 300 || p.getX(i) > 2300) continue;
      if (p.getZ(i) > z) {
        z = p.getZ(i);
        best.set(p.getX(i), p.getY(i), p.getZ(i));
      }
    }
  });
  return best;
}

function place(): void {
  const aspect = innerWidth / innerHeight;
  camera.aspect = aspect;
  let target: THREE.Vector3;
  let w: number;
  let h: number;
  let yaw = 0;
  let pitch = 0;
  if (cam === 'mid') {
    // The game's follow camera at zoom 1.5, a little ahead of the player.
    target = new THREE.Vector3(Number(params.get('x') ?? 990), -FOLLOW.cy, 0);
    w = FOLLOW.w;
    h = FOLLOW.h;
  } else if (cam === 'debug') {
    target = new THREE.Vector3(Number(params.get('tx') ?? 950), -Number(params.get('ty') ?? 470), Number(params.get('tz') ?? Z_FRONT));
    w = Number(params.get('w') ?? 300);
    h = w * 0.56;
    yaw = Number(params.get('yaw') ?? 0);
    pitch = Number(params.get('pitch') ?? 0);
  } else if (cam === 'close') {
    target = curlTarget();
    target.y -= 20;
    w = 300;
    h = 170;
    yaw = -0.62;
    pitch = -0.14;
  } else {
    target = new THREE.Vector3(ROOM.w / 2, -ROOM.h / 2, 0);
    w = ROOM.w + 180;
    h = ROOM.h + 120;
  }
  const viewH = Math.max(h, w / aspect);
  const dist = viewH / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * dist, target.y + Math.sin(pitch) * dist, target.z + Math.cos(yaw) * Math.cos(pitch) * dist);
  camera.lookAt(target);
  camera.near = Math.max(5, dist * 0.05);
  camera.far = dist + 4000;
  camera.updateProjectionMatrix();
}

function render(): void {
  place();
  renderer.render(scene, camera);
  const s = front?.stats;
  hud.innerHTML = '';
  const row = (label: string, items: string[], current: string, pick: (v: string) => void): void => {
    const div = document.createElement('div');
    div.append(`${label} `);
    for (const it of items) {
      const b = document.createElement('button');
      b.textContent = it;
      if (it === current) b.className = 'on';
      b.onclick = () => pick(it);
      div.append(b);
    }
    hud.append(div);
  };
  row('camera', ['wide', 'mid', 'close'], cam, (v) => {
    cam = v;
    render();
  });
  row('quality', ['high', 'low'], quality, (v) => {
    quality = v as 'high' | 'low';
    rebuild();
    render();
  });
  row('seed', ['-', String(seed), '+'], String(seed), (v) => {
    if (v === '-' || v === '+') {
      seed += v === '+' ? 1 : -1;
      rebuild();
      render();
    }
  });
  const info = document.createElement('div');
  info.textContent = s ? `${s.vertices} vertices, ${s.triangles} triangles, built in ${s.ms.toFixed(1)} ms (first ${firstMs.map((m) => m.toFixed(1)).join(', ')} ms)` : '';
  hud.append(info);
}

rebuild();
if (params.get('bench') === '1') {
  // Build a few more and report cold and warm times.
  const times: number[] = [];
  for (let i = 1; i <= 12; i++) {
    const t = buildTornFront({ ...spec(), seed: seed + i, quality: 'high' });
    times.push(t.stats!.ms);
    t.dispose();
  }
  const low: number[] = [];
  for (let i = 1; i <= 12; i++) {
    const t = buildTornFront({ ...spec(), seed: seed + i, quality: 'low' });
    low.push(t.stats!.ms);
    t.dispose();
  }
  const sorted = (a: number[]): number[] => [...a].sort((x, y) => x - y);
  (window as unknown as { bench: unknown }).bench = {
    high: { first: firstMs[0], median: sorted(times)[6], max: sorted(times)[11], all: times },
    low: { first: low[0], median: sorted(low)[6], max: sorted(low)[11], all: low },
  };
}
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  render();
});
render();
requestAnimationFrame(() => {
  render();
  requestAnimationFrame(() => document.body.setAttribute('data-ready', '1'));
});
