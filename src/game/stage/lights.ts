import * as THREE from 'three';
import { glowSprite, radialCanvas } from './cards';
import type { Rect } from './depth';
import { resolveX, resolveY, type BoxFrame, type LightRig } from './themes';

// The room's lights: sky and ground light, a soft ambient, a fill from the
// right and the key light from the upper left whose soft shadow map follows
// the view (snapped to its texels, so shadows do not crawl as the view
// moves), plus the theme's stage lamps (spot lights with a glow at the
// bulb, their aim swaying a little) and warm lights inside lamp props.

const dirOf = (d: readonly [number, number, number]): THREE.Vector3 => new THREE.Vector3(d[0], d[1], d[2]).normalize();

export interface LampAnchor {
  /** Where the lamp's light is this frame (world px, y down, and depth), or null while hidden. */
  at(): { x: number; y: number; z: number } | null;
  color: number;
  intensity: number;
  distance: number;
  glow: number;
}

let glowCanvas: HTMLCanvasElement | null = null;

function glowTexture(): THREE.Texture {
  glowCanvas ??= radialCanvas([
    [0, 1],
    [0.25, 0.45],
    [1, 0],
  ]);
  const t = new THREE.CanvasTexture(glowCanvas);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

export class Lights {
  readonly group = new THREE.Group();
  readonly key: THREE.DirectionalLight;
  private readonly keyDir: THREE.Vector3;
  private readonly lx: THREE.Vector3;
  private readonly ly: THREE.Vector3;
  private readonly spots: { light: THREE.SpotLight; aim: THREE.Vector3; phase: number }[] = [];
  private readonly lamps: { a: LampAnchor; light: THREE.PointLight; glow: THREE.Sprite }[] = [];
  private readonly glowTex: THREE.Texture;
  private readonly snapped = new THREE.Vector3();

  constructor(
    rig: LightRig,
    frame: BoxFrame,
    anchors: readonly LampAnchor[],
    private shadowSize: number,
    spotShadows: boolean,
  ) {
    this.group.name = 'lights';
    this.glowTex = glowTexture();
    const g = this.group;
    g.add(new THREE.HemisphereLight(rig.hemi.sky, rig.hemi.ground, rig.hemi.intensity));
    g.add(new THREE.AmbientLight(rig.ambient.color, rig.ambient.intensity));
    const fill = new THREE.DirectionalLight(rig.fill.color, rig.fill.intensity);
    fill.position.copy(dirOf(rig.fill.dir));
    g.add(fill, fill.target);
    this.keyDir = dirOf(rig.key.dir);
    this.lx = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), this.keyDir).normalize();
    this.ly = new THREE.Vector3().crossVectors(this.keyDir, this.lx);
    const key = new THREE.DirectionalLight(rig.key.color, rig.key.intensity);
    key.castShadow = true;
    key.shadow.mapSize.set(shadowSize, shadowSize);
    key.shadow.camera.near = 10;
    key.shadow.camera.far = 6000;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 1.2;
    key.shadow.radius = 5;
    key.shadow.intensity = rig.shadow;
    this.key = key;
    g.add(key, key.target);
    // Stage lamps: spot lights at the box's ends (theme), shining inward.
    for (const [i, s] of rig.spots.entries()) {
      const pos = new THREE.Vector3(resolveX(s.at[0], frame), -resolveY(s.at[1], frame), s.at[2]);
      const aim = new THREE.Vector3(resolveX(s.to[0], frame), -resolveY(s.to[1], frame), s.to[2]);
      const light = new THREE.SpotLight(s.color, s.intensity, 0, (s.angle * Math.PI) / 180, s.penumbra, 0);
      light.position.copy(pos);
      light.target.position.copy(aim);
      if (spotShadows) {
        light.castShadow = true;
        light.shadow.mapSize.set(1024, 1024);
        light.shadow.camera.near = 20;
        light.shadow.camera.far = 8000;
        light.shadow.bias = -0.0008;
        light.shadow.normalBias = 1.5;
        light.shadow.radius = 4;
        light.shadow.intensity = rig.shadow * 0.7;
      }
      g.add(light, light.target);
      if (s.glow > 0) {
        const glow = glowSprite(this.glowTex, s.color, s.glow, 0.5);
        glow.position.copy(pos);
        g.add(glow);
      }
      this.spots.push({ light, aim, phase: i * 1.7 });
    }
    // Warm lights inside lamp props (they follow the prop and its sway).
    for (const a of anchors) {
      const light = new THREE.PointLight(a.color, a.intensity, a.distance, 1.4);
      const glow = glowSprite(this.glowTex, a.color, a.glow, 0.42);
      g.add(light, glow);
      this.lamps.push({ a, light, glow });
    }
  }

  setShadowSize(n: number): void {
    if (n === this.shadowSize) return;
    this.shadowSize = n;
    this.key.shadow.mapSize.set(n, n);
    this.key.shadow.map?.dispose();
    this.key.shadow.map = null;
  }

  /**
   * The key light's shadow covers what the camera sees (the view on z = 0,
   * with a margin, through the box's depth).
   */
  update(view: Rect, back: number, front: number, t: number, calm: boolean): void {
    const m = 160;
    const x0 = view.x0 - m;
    const x1 = view.x1 + m;
    const Y0 = -(view.y1 + m);
    const Y1 = -(view.y0 - m);
    let lo = Infinity;
    let hi = -Infinity;
    let lo2 = Infinity;
    let hi2 = -Infinity;
    const c = new THREE.Vector3();
    for (const x of [x0, x1]) {
      for (const y of [Y0, Y1]) {
        for (const z of [back - 40, front + 40]) {
          c.set(x, y, z);
          const u = c.dot(this.lx);
          const v = c.dot(this.ly);
          lo = Math.min(lo, u);
          hi = Math.max(hi, u);
          lo2 = Math.min(lo2, v);
          hi2 = Math.max(hi2, v);
        }
      }
    }
    const half = Math.max(hi - lo, hi2 - lo2) / 2;
    const sc = this.key.shadow.camera;
    if (Math.abs(sc.right - half) > half * 0.08 || sc.right < half) {
      // Resized in steps (not every frame): the texel grid stays still.
      const h = Math.ceil(half / 64) * 64;
      sc.left = -h;
      sc.right = h;
      sc.top = h;
      sc.bottom = -h;
      sc.updateProjectionMatrix();
    }
    const texel = (sc.right * 2) / this.shadowSize;
    const cu = (lo + hi) / 2;
    const cv = (lo2 + hi2) / 2;
    const su = Math.round(cu / texel) * texel;
    const sv = Math.round(cv / texel) * texel;
    // The centre in light space, back in world space (depth along the light).
    this.snapped.copy(this.lx).multiplyScalar(su).addScaledVector(this.ly, sv);
    this.key.target.position.copy(this.snapped);
    this.key.position.copy(this.snapped).addScaledVector(this.keyDir, 3000);
    this.key.target.updateMatrixWorld();
    // The stage lamps' aim sways a little, like lamps on a rope.
    for (const s of this.spots) {
      const k = calm ? 0 : 1;
      s.light.target.position.set(s.aim.x + k * 24 * Math.sin(t * 0.7 + s.phase), s.aim.y + k * 8 * Math.sin(t * 1.1 + s.phase * 2), s.aim.z);
      s.light.target.updateMatrixWorld();
    }
    for (const l of this.lamps) {
      const at = l.a.at();
      l.light.visible = !!at;
      l.glow.visible = !!at;
      if (!at) continue;
      const flick = calm ? 1 : 1 + 0.035 * Math.sin(t * 11.3) + 0.025 * Math.sin(t * 6.1 + 2) + 0.02 * Math.sin(t * 17.9);
      l.light.position.set(at.x, -at.y, at.z + 4);
      l.light.intensity = l.a.intensity * flick;
      l.glow.position.set(at.x, -at.y, at.z + 6);
      l.glow.material.opacity = 0.42 * flick;
    }
  }

  dispose(): void {
    this.key.shadow.map?.dispose();
    for (const s of this.spots) s.light.shadow.map?.dispose();
    for (const l of this.lamps) l.glow.material.dispose();
    this.group.traverse((o) => {
      if (o instanceof THREE.Sprite) o.material.dispose();
    });
    this.glowTex.dispose();
    this.group.clear();
  }
}
