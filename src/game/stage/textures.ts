import * as Phaser from 'phaser';
import * as THREE from 'three';

// One three.js texture per Phaser texture source: the atlas pages and the
// room's canvases (TextureFactory) are uploaded once to the stage's GL
// context, shared by every card that shows a frame of them, and disposed
// when Phaser removes the texture (a room's layers and terrain go with
// the room). Canvases are uploaded premultiplied, as the browser stores
// them, so cut edges filter without dark fringes (see cards.ts).

type Source = HTMLCanvasElement | HTMLImageElement | ImageBitmap;

export class TextureCache {
  private readonly byKey = new Map<string, THREE.Texture[]>();
  private readonly onRemove = (key: string): void => this.drop(key);
  anisotropy = 1;

  constructor(private readonly textures: Phaser.Textures.TextureManager) {
    textures.on(Phaser.Textures.Events.REMOVE, this.onRemove);
  }

  /** The texture of a Phaser frame's source. */
  forFrame(frame: Phaser.Textures.Frame): THREE.Texture | null {
    const src = frame.source;
    const image = src.image as unknown as Source | null;
    if (!image) return null;
    const key = frame.texture.key;
    let list = this.byKey.get(key);
    if (!list) this.byKey.set(key, (list = []));
    const i = frame.sourceIndex;
    let t = list[i];
    if (!t || t.image !== image) {
      t?.dispose();
      t = this.make(image);
      list[i] = t;
    }
    return t;
  }

  /** A texture for a canvas the stage paints itself (not in Phaser's manager). */
  own(canvas: HTMLCanvasElement, repeat = false): THREE.Texture {
    const t = this.make(canvas);
    if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  private make(image: Source): THREE.Texture {
    const t = image instanceof HTMLCanvasElement ? new THREE.CanvasTexture(image) : new THREE.Texture(image);
    t.premultiplyAlpha = true;
    t.colorSpace = THREE.NoColorSpace;
    // Phaser's frame UVs run down from the top of the image.
    t.flipY = false;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = this.anisotropy;
    t.needsUpdate = true;
    return t;
  }

  /** Re-uploads a source whose pixels changed (text). */
  refresh(frame: Phaser.Textures.Frame): void {
    const t = this.byKey.get(frame.texture.key)?.[frame.sourceIndex];
    if (t) t.needsUpdate = true;
  }

  private drop(key: string): void {
    const list = this.byKey.get(key);
    if (!list) return;
    for (const t of list) t?.dispose();
    this.byKey.delete(key);
  }

  /** Every texture currently held (for warming up uploads). */
  all(): THREE.Texture[] {
    return [...this.byKey.values()].flat().filter(Boolean);
  }

  destroy(): void {
    this.textures.off(Phaser.Textures.Events.REMOVE, this.onRemove);
    for (const key of [...this.byKey.keys()]) this.drop(key);
  }
}
