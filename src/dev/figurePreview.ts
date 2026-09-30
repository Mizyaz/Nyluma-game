// Development-only look at the 3D figures (not part of the production build).
// URL: ?id=gorti.root.child &anim=idle &t=0 &play=1 (animate) &speed=0..1
// &facing=1|-1 &yaw=50 (degrees turned toward the viewer; 90 = face on)
// &emote=joy&k=1 &cy=70&zoom=1 (camera) &clean=1 (no panel).
import * as THREE from 'three';
import { poseFor, type Emote } from '../render/2d/rig/animPoses';
import { makeFigure } from '../render/3d/figure';

const q = new URLSearchParams(location.search);
if (q.get('clean') === '1') document.body.classList.add('clean');
const id = q.get('id') ?? 'gorti.root.child';
const anim = q.get('anim') ?? 'idle';
const play = q.get('play') === '1';
const facing: 1 | -1 = q.get('facing') === '-1' ? -1 : 1;
const speed = Number(q.get('speed') ?? 0);
const emote = (q.get('emote') ?? undefined) as Emote | undefined;
const emoteK = Number(q.get('k') ?? 1);
const cy = Number(q.get('cy') ?? 70);
const zoom = Number(q.get('zoom') ?? 1);
let t = Number(q.get('t') ?? 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd9d4cc);
const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 1, 3000);
camera.position.set(0, cy + 2, 330 / zoom);
camera.lookAt(0, cy, 0);

// The stage's NEUTRAL light rig.
const key = new THREE.DirectionalLight(0xfffaf4, 2);
key.position.set(-0.56, 0.42, 0.72).multiplyScalar(400);
key.target.position.set(0, 60, 0);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -130, right: 130, top: 130, bottom: -130, near: 1, far: 1200 });
key.shadow.camera.updateProjectionMatrix();
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.6;
const fill = new THREE.DirectionalLight(0xeef0ff, 0.7);
fill.position.set(0.75, 0.15, 0.64).multiplyScalar(400);
scene.add(key, key.target, fill, new THREE.HemisphereLight(0xf7f5ff, 0xf2ebe2, 1.25), new THREE.AmbientLight(0xffffff, 0.12));

const ground = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.ShadowMaterial({ opacity: 0.22 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

let loaded = false;
THREE.DefaultLoadingManager.onLoad = () => {
  loaded = true;
};
setTimeout(() => {
  loaded = true;
}, 4000);
const fig = makeFigure(id);
if (!fig) throw new Error(`no figure for ${id}`);
if (q.has('yaw')) fig.turn = THREE.MathUtils.degToRad(Number(q.get('yaw')));
scene.add(fig.group);
const hud = document.getElementById('hud');
if (hud) hud.textContent = `${id} · ${anim} · facing ${facing}`;

let last = performance.now();
let settled = 0;
function frame(now: number): void {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (play) t += dt;
  const pose = poseFor(id, anim, t, { speed, phase: t * 9, emote, emoteK, idleT: t });
  fig!.apply({ angles: pose.angles, offsets: pose.offsets, x: pose.x ?? 0, y: pose.y ?? 0, facing, speed, anim, t, emote, emoteK }, play ? dt : 0);
  renderer.render(scene, camera);
  if (loaded && ++settled === 3) document.body.dataset.ready = '1';
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
