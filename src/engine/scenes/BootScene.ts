import * as Phaser from 'phaser';
import { app } from '../App';
import { allParts } from '../../content/art/manifest';
import { buildAtlases } from '../../render/2d/TextureFactory';
import { makeFxTextures } from '../../render/2d/fxArt';
import { GemArt } from '../../render/2d/fx/gemArt';

/** Rasterizes all authored artwork once, then opens the menu. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    app.ui.loading(0);
    const started = performance.now();
    makeFxTextures(this.textures);
    GemArt.ensure(this);
    buildAtlases(this.textures, allParts(), 'atlas', (d, t) => app.ui.loading(d / t))
      .then(() => {
        (window as unknown as { __kdBootMs?: number }).__kdBootMs = performance.now() - started;
        app.ui.loading(null);
        this.scene.start('menu');
      })
      .catch((err: unknown) => {
        console.error(err);
        app.ui.loading(1, 'Çizimler yüklenemedi. Sayfayı yenilemeyi deneyin.');
      });
  }
}
