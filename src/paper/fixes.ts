import * as Phaser from 'phaser';

// Fixes to Phaser 4.2.1 that the paper stage depends on, applied once
// before the game is made.
//
// Tint modes: the quad shaders read an object's tint mode from a vertex
// attribute (mode / 255, normalized, times 255 again) and compare it with
// `==`. 7 / 255 comes back a hair under or over 7, so MULTIPLY_TWO (the
// stage's light and air, light.ts) never matches and the tint is dropped.
// The mode is rounded to the whole number it is.

const READ = 'float tintMode = outTintEffect.a;';
const ROUNDED = 'float tintMode = floor(outTintEffect.a + 0.5);';

interface Addition {
  name: string;
  additions: Record<string, string>;
}

let done = false;

export function patchPhaser(): void {
  if (done) return;
  done = true;
  const nodes = Phaser.Renderer.WebGL.RenderNodes as unknown as Record<string, { prototype?: { defaultConfig?: { shaderAdditions?: Addition[] } } }>;
  for (const node of Object.values(nodes)) {
    for (const add of node?.prototype?.defaultConfig?.shaderAdditions ?? []) {
      for (const [k, src] of Object.entries(add.additions)) {
        if (typeof src === 'string' && src.includes(READ)) add.additions[k] = src.replace(READ, ROUNDED);
      }
    }
  }
}
