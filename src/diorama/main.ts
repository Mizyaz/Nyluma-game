import * as THREE from 'three';
import { allRigs } from '../game/art/manifest';
import { R01 } from '../game/data/rooms/r01';
import { radialTexture, setAnisotropy } from './art';
import { FollowCam, type CamPose } from './camera';
import { contactShadow } from './cutout';
import { PaperRig } from './gorti';
import { Hero, type Input } from './player';
import { Post } from './post';
import { buildRoom } from './room';
import { sx, sy } from './units';

// 14. Oda as a paper diorama: a prototype to compare with the game's 2D
// look. One room, walking and jumping, nothing else. Query parameters:
//   dpr=<n>   render resolution cap (default 1.5 × CSS pixels)
//   msaa=<n>  multisampling of the scene (default 4)
//   shot=1    no overlay (clean screenshots)

const params = new URLSearchParams(location.search);
const view = document.getElementById('view')!;
const fxLabel = document.getElementById('fx')!;
const loading = document.getElementById('loading')!;
if (params.has('shot')) document.body.classList.add('shot');

const STEP = 1 / 60;
/** The key light's direction (toward the light): upper left, in front. */
const SUN = new THREE.Vector3(-0.56, 0.4, 0.73).normalize();
const START = R01.checkpoints[0]!;

async function boot(): Promise<void> {
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // No tone curve: the lights add up to 1 on a lit card, so the art keeps
  // the game's colours where the key light falls and darkens in shadow.
  renderer.toneMapping = THREE.NoToneMapping;
  view.prepend(renderer.domElement);
  setAnisotropy(Math.min(8, renderer.capabilities.getMaxAnisotropy()));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1d1a28);
  const room = await buildRoom();
  scene.add(room.group);

  const rigDef = allRigs().find((r) => r.id === 'gorti.root.child')!;
  const rig = await PaperRig.create(rigDef);
  scene.add(rig.root);
  const solids = R01.solids.filter((s) => s.style !== 'none');
  // Gorti starts out of bed, where the game leaves him after waking up.
  const hero = new Hero(rig, solids, room.platformZ, 580, START.y, R01.width);
  hero.place(580, START.y, 1);
  const spot = radialTexture([
    [0, 0.95],
    [0.5, 0.6],
    [1, 0],
  ]);
  const heroShadow = contactShadow(spot, 0.95, 0.3, 0.6);
  scene.add(heroShadow);

  const cam = new FollowCam(16 / 9, sx(430), sx(1770));
  cam.snap(hero);
  const post = new Post(renderer, scene, cam.camera, Number(params.get('msaa') ?? 4));
  let shadows = true;
  // Count draw calls over the whole frame (scene, shadow map and passes).
  renderer.info.autoReset = false;
  const renderFrame = (): void => {
    renderer.info.reset();
    post.render();
  };

  // ------------------------------------------------------------ size
  const maxDpr = Number(params.get('dpr') ?? 1.5);
  // Render scale: CSS pixels × this; lowered by `tune` on a slow GPU.
  let scale = Math.min(window.devicePixelRatio || 1, maxDpr);
  const resize = (): void => {
    const w = Math.max(1, view.clientWidth);
    const h = Math.max(1, view.clientHeight);
    const pr = scale;
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    post.setSize(w, h, pr);
    cam.setAspect(w / h);
  };
  resize();
  window.addEventListener('resize', resize);

  // ------------------------------------------------------------ input
  const held = new Set<string>();
  let jumpPressed = false;
  const JUMP = new Set(['Space', 'KeyW', 'ArrowUp']);
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    held.add(e.code);
    if (JUMP.has(e.code)) jumpPressed = true;
    if (e.code === 'Digit1') post.dof = !post.dof;
    else if (e.code === 'Digit2') post.print = !post.print;
    else if (e.code === 'Digit3') {
      shadows = !shadows;
      room.key.castShadow = shadows;
    } else if (e.code === 'KeyG') cam.mode = cam.mode === 'wide' ? 'follow' : 'wide';
    if (JUMP.has(e.code) || e.code.startsWith('Arrow')) e.preventDefault();
    showFx();
  });
  window.addEventListener('keyup', (e) => held.delete(e.code));
  window.addEventListener('blur', () => held.clear());
  // Touch: the paper buttons press the same keys.
  for (const [id, code] of [['padL', 'ArrowLeft'], ['padR', 'ArrowRight'], ['padJ', 'Space']] as const) {
    const el = document.getElementById(id);
    if (!el) continue;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      held.add(code);
      if (code === 'Space') jumpPressed = true;
      el.classList.add('on');
    });
    const up = (): void => {
      held.delete(code);
      el.classList.remove('on');
    };
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave'] as const) el.addEventListener(ev, up);
  }
  document.getElementById('padG')?.addEventListener('click', () => {
    cam.mode = cam.mode === 'wide' ? 'follow' : 'wide';
    showFx();
  });
  const keyInput = (): Input => {
    const axis = (held.has('KeyD') || held.has('ArrowRight') ? 1 : 0) - (held.has('KeyA') || held.has('ArrowLeft') ? 1 : 0);
    return { axis, jumpPressed, jumpHeld: [...JUMP].some((k) => held.has(k)) };
  };
  // Dragging swings the camera by hand; it drifts back when let go.
  const canvas = renderer.domElement;
  let drag: { x: number; y: number } | null = null;
  canvas.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, y: e.clientY };
    cam.dragging = true;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    cam.dragYaw = Math.max(-0.7, Math.min(0.7, cam.dragYaw - (e.clientX - drag.x) * 0.004));
    cam.dragPitch = Math.max(-0.35, Math.min(0.25, cam.dragPitch - (e.clientY - drag.y) * 0.003));
    drag = { x: e.clientX, y: e.clientY };
  });
  const endDrag = (): void => {
    drag = null;
    cam.dragging = false;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  // ------------------------------------------------------------ simulation
  let time = 0;
  let acc = 0;
  const snapped = new THREE.Vector3();
  const lightX = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), SUN).normalize();
  const lightY = new THREE.Vector3().crossVectors(SUN, lightX);

  const advance = (dt: number, input: Input): void => {
    acc += dt;
    while (acc >= STEP - 1e-9) {
      hero.fixed(STEP, { ...input, jumpPressed: input.jumpPressed });
      input = { ...input, jumpPressed: false };
      jumpPressed = false;
      acc -= STEP;
    }
    time += dt;
    hero.visual(dt);
    room.update(time);
    cam.update(hero, dt);
    post.focus = cam.focusDist;
    room.foreground.visible = cam.mode !== 'wide';
    // His contact shadow stays on the surface under him and fades as he rises.
    const g = hero.heightAboveGround();
    const k = 1 - Math.min(1, g.h / 220);
    heroShadow.position.set(sx(hero.x), sy(g.ground) + 0.004, hero.groundZ() + 0.02);
    heroShadow.scale.setScalar(0.55 + 0.45 * k);
    (heroShadow.material as THREE.MeshBasicMaterial).opacity = 0.6 * k;
    // The key light's shadow map follows the view, snapped to its texels.
    const wide = cam.mode === 'wide';
    const half = wide ? 14 : 7.5;
    const sc = room.key.shadow.camera;
    if (sc.right !== half) {
      sc.left = -half;
      sc.right = half;
      sc.top = half * 0.75;
      sc.bottom = -half * 0.75;
      sc.updateProjectionMatrix();
    }
    const texel = (half * 2) / room.key.shadow.mapSize.x;
    snapped.set(cam.focus.x, 2.2, -0.4);
    const u = Math.round(snapped.dot(lightX) / texel) * texel - snapped.dot(lightX);
    const v = Math.round(snapped.dot(lightY) / texel) * texel - snapped.dot(lightY);
    snapped.addScaledVector(lightX, u).addScaledVector(lightY, v);
    room.key.target.position.copy(snapped);
    room.key.position.copy(snapped).addScaledVector(SUN, 20);
  };

  // ------------------------------------------------------------ frames
  let frames = 0;
  let fpsT = 0;
  let fps = 0;
  const showFx = (): void => {
    const tag = (key: string, name: string, on: boolean): string => `<span class="${on ? '' : 'off'}"><b>${key}</b> ${name}</span>`;
    fxLabel.innerHTML =
      `${tag('1', 'Alan derinliği', post.dof)} · ${tag('2', 'Baskı', post.print)} · ${tag('3', 'Gölgeler', shadows)} · ${tag('G', 'Geniş', cam.mode === 'wide')}` +
      `<br>${fps ? `${fps} fps · çözünürlük ${scale.toFixed(2)}×` : '…'}`;
  };
  // A slow GPU gets fewer pixels (never below 0.75×): checked every 2 s
  // while the frame rate stays under ~45 fps. Off for fixed-size shots.
  const autoScale = !params.has('dpr') && !params.has('shot');
  let tuneT = 0;
  let tuneFrames = 0;
  const tune = (dt: number): void => {
    tuneT += dt;
    tuneFrames++;
    if (tuneT < 2) return;
    if (autoScale && tuneFrames / tuneT < 45 && scale > 0.75) {
      scale = Math.max(0.75, scale - 0.25);
      resize();
    }
    tuneT = 0;
    tuneFrames = 0;
  };
  let manual = false;
  let last = performance.now();
  const loop = (now: number): void => {
    if (manual) return;
    requestAnimationFrame(loop);
    const real = Math.max(0, (now - last) / 1000);
    const dt = Math.min(0.05, real);
    last = now;
    advance(dt, keyInput());
    renderFrame();
    if (document.visibilityState === 'visible') tune(real);
    frames++;
    fpsT += real;
    if (fpsT >= 0.5) {
      fps = Math.round(frames / fpsT);
      frames = 0;
      fpsT = 0;
      showFx();
    }
  };

  // Warm up (compile every program) before the first visible frame.
  advance(STEP, { axis: 0, jumpPressed: false, jumpHeld: false });
  renderer.compile(scene, cam.camera);
  renderFrame();
  loading.remove();
  showFx();
  requestAnimationFrame((t) => {
    last = t;
    loop(t);
  });

  // ------------------------------------------------------------ automation
  // A small, deterministic handle for screenshot scripts (manual clock).
  (window as unknown as { __diorama: unknown }).__diorama = {
    manual(on: boolean): void {
      manual = on;
      if (!on) {
        last = performance.now();
        requestAnimationFrame(loop);
      }
    },
    /** Advances the simulation by `ms` with the given input, then renders once. */
    step(ms: number, input: Partial<Input> = {}, render = true): void {
      const n = Math.max(1, Math.round(ms / (STEP * 1000)));
      const inp: Input = { axis: input.axis ?? 0, jumpPressed: input.jumpPressed ?? false, jumpHeld: input.jumpHeld ?? false };
      for (let i = 0; i < n; i++) {
        advance(STEP, inp);
        inp.jumpPressed = false;
      }
      if (render) renderFrame();
    },
    place(x: number, facing: 1 | -1 = 1, y: number = START.y): void {
      hero.place(x, y, facing);
      cam.snap(hero);
    },
    camera(mode: 'follow' | 'wide' | 'fixed', pose?: { target: [number, number, number]; dist: number; yaw: number; pitch: number; roll?: number; fov?: number }): void {
      cam.mode = mode;
      if (pose) {
        const p: CamPose = { target: new THREE.Vector3(...pose.target), dist: pose.dist, yaw: pose.yaw, pitch: pose.pitch, roll: pose.roll ?? 0, fov: pose.fov ?? 30 };
        cam.fixedPose = p;
      }
    },
    fx(o: { dof?: boolean; print?: boolean; shadows?: boolean }): void {
      if (o.dof !== undefined) post.dof = o.dof;
      if (o.print !== undefined) post.print = o.print;
      if (o.shadows !== undefined) {
        shadows = o.shadows;
        room.key.castShadow = shadows;
      }
    },
    state(): unknown {
      return {
        x: hero.x,
        y: hero.y,
        z: hero.z,
        vx: hero.vx,
        vy: hero.vy,
        onGround: hero.onGround,
        anim: rig.anim,
        fps,
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        textures: renderer.info.memory.textures,
        geometries: renderer.info.memory.geometries,
        size: [renderer.domElement.width, renderer.domElement.height],
      };
    },
    /** Average milliseconds per rendered frame over `n` frames (GPU included: it waits for each). */
    perf(n = 20): { ms: number; simMs: number } {
      const gl = renderer.getContext();
      const px = new Uint8Array(4);
      let sim = 0;
      const t0 = performance.now();
      for (let i = 0; i < n; i++) {
        const s0 = performance.now();
        advance(STEP, { axis: 1, jumpPressed: false, jumpHeld: false });
        sim += performance.now() - s0;
        renderFrame();
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      }
      return { ms: (performance.now() - t0) / n, simMs: sim / n };
    },
  };
  document.body.dataset.ready = '1';
}

boot().catch((e: unknown) => {
  loading.textContent = `Diorama açılamadı: ${e instanceof Error ? e.message : String(e)}`;
  console.error(e);
});
