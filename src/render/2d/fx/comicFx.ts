import * as Phaser from 'phaser';
import { app } from '../../../engine/App';
import { DEPTH, VIEW_H, VIEW_W } from '../../../engine/constants';
import { artCanvas, addStaticCanvas } from '../TextureFactory';

// The comic-book look over the whole picture: the dots of a printed comic
// in the mid and dark tones (halftone), the colour plates a hair out of
// register, and the grain of the paper. In WebGL it is a post-process on the
// camera; the Canvas renderer lays a still halftone-and-paper sheet over the
// view instead.

const FRAG = `
precision mediump float;
uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uStrength;
varying vec2 outTexCoord;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = outTexCoord;
  // One design pixel of the 1280x720 view, in texture space.
  vec2 px = 1.0 / uResolution;
  float k = uResolution.y / 720.0;
  // The plates slightly out of register: red a touch right, blue left.
  vec4 base = texture2D(uMainSampler, uv);
  float r = texture2D(uMainSampler, uv + vec2(px.x * 0.9 * k, 0.0)).r;
  float b = texture2D(uMainSampler, uv - vec2(px.x * 0.9 * k, -px.y * 0.4 * k)).b;
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
  // Warm paper and its grain.
  float g = hash(floor(uv * uResolution / (1.5 * k)));
  col *= mix(vec3(1.0), vec3(1.0, 0.985, 0.95) * (0.965 + 0.05 * g), uStrength);
  gl_FragColor = vec4(col, base.a);
}
`;

export class ComicPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  strength = 1;

  constructor(game: Phaser.Game) {
    super({ game, name: 'ComicFX', fragShader: FRAG });
  }

  override onPreRender(): void {
    this.set2f('uResolution', this.renderer.width, this.renderer.height);
    this.set1f('uStrength', this.strength);
  }
}

const SHEET = 'fx.comicSheet';

/** A tile of halftone dots and paper grain for the Canvas renderer. */
function comicSheet(textures: Phaser.Textures.TextureManager): string {
  if (textures.exists(SHEET)) return SHEET;
  const size = 128;
  const [c, x] = artCanvas(size, size);
  // Transparent sheet: only the dots and the grain show (no blend modes,
  // so it looks the same on every Canvas implementation).
  // Dots on a 45 degree screen.
  x.fillStyle = 'rgba(92, 78, 104, 0.16)';
  const step = 8;
  for (let i = -size; i < size * 2; i += step) {
    for (let j = -size; j < size * 2; j += step) {
      const px = (i + j) * 0.7071;
      const py = (j - i) * 0.7071;
      if (px < -4 || py < -4 || px > size + 4 || py > size + 4) continue;
      x.beginPath();
      x.arc(px, py, 1.5, 0, Math.PI * 2);
      x.fill();
    }
  }
  // Paper grain.
  for (let n = 0; n < 900; n++) {
    x.fillStyle = Math.random() < 0.5 ? 'rgba(120, 100, 90, 0.1)' : 'rgba(255, 250, 240, 0.1)';
    x.fillRect(Math.random() * size, Math.random() * size, 1, 1);
  }
  addStaticCanvas(textures, SHEET, c);
  return SHEET;
}

/** Puts the comic look on a scene's main camera (both renderers). */
export function applyComicLook(scene: Phaser.Scene, depth = DEPTH.overlay - 1): void {
  const strength = app.settings.reducedMotion ? 0.8 : 1;
  if (scene.game.renderer.type === Phaser.WEBGL) {
    scene.cameras.main.setPostPipeline(ComicPipeline);
    const pipe = scene.cameras.main.getPostPipeline(ComicPipeline);
    const list = Array.isArray(pipe) ? pipe : [pipe];
    for (const p of list) if (p instanceof ComicPipeline) p.strength = strength;
    return;
  }
  const key = comicSheet(scene.textures);
  const cam = scene.cameras.main;
  // Covers the view at any zoom (it is fixed to the screen).
  const sheet = scene.add
    .tileSprite(VIEW_W / 2, VIEW_H / 2, VIEW_W, VIEW_H, key)
    .setScrollFactor(0)
    .setDepth(depth)
    .setAlpha(0.9 * strength);
  const fit = (): void => {
    const z = cam.zoom || 1;
    sheet.setScale(1 / z).setPosition(cam.width / 2, cam.height / 2);
  };
  fit();
  scene.events.on(Phaser.Scenes.Events.PRE_RENDER, fit);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.events.off(Phaser.Scenes.Events.PRE_RENDER, fit));
}
