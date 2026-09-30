import * as Phaser from 'phaser';
import { frameRef, hasFrame } from '../../render/2d/TextureFactory';
import type { PaintingArt, PaintingPlacement } from '../../content/data/paintings';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import type { Interactable } from '../../engine/world/Interactable';
import { stage } from '../../render/2.5d/hooks';

/** Wood, gilded liner and wall shadow of every frame. */
const WOOD = 0x5b3b24;
const WOOD_LIGHT = 0x86603c;
const WOOD_DARK = 0x3a2416;
const GOLD = 0xc9a45a;
/** Contours in the wood's own darker tone (no black outlines). */
const INK = 0x483637;
/** Height of the easel's ledge above the floor. */
const EASEL_LEDGE = 64;

/**
 * A framed painting in the world: on a wall (nail and wire) or on an easel
 * in the grass. The artwork texture may arrive after the room is built (it
 * loads lazily); until then the canvas shows a dark ground. Inspecting it
 * is handled by whoever passed `onInspect` (the gallery).
 */
export class Painting implements Interactable {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly r = 90;
  readonly prompt = 'İncele';
  readonly lookAt: { x: number; y: number };
  private readonly root: Phaser.GameObjects.Container;
  private readonly cw: number;
  private readonly ch: number;
  private image: Phaser.GameObjects.Image | null = null;
  private glow: Phaser.GameObjects.Image | null = null;
  private t = Math.random() * 10;

  constructor(
    private readonly scene: WorldScene,
    readonly art: PaintingArt,
    place: PaintingPlacement,
    floorY: number,
    private readonly onInspect: (p: Painting) => void,
  ) {
    this.id = `painting:${art.id}`;
    this.cw = place.width;
    this.ch = place.width;
    const cx = place.x;
    const cy = place.mount === 'wall' ? place.y : floorY - EASEL_LEDGE - this.ch / 2 - 6;
    this.x = cx;
    this.y = floorY;
    this.lookAt = { x: cx, y: cy };
    this.root = scene.add.container(cx, cy).setDepth(place.mount === 'wall' ? -45 : -9);
    // In the diorama: a framed card (its drawn frame and wire included).
    stage.lift(this.root, { thick: 4 });
    if (place.mount === 'wall') this.buildWall();
    else this.buildEasel(floorY - cy);
    this.buildFrame();
    this.attachImage();
    if (!this.image) {
      // The artwork is still loading: show it as soon as it arrives.
      const onFile = (key: string): void => {
        if (key === art.key) this.attachImage();
      };
      scene.load.on(Phaser.Loader.Events.FILE_COMPLETE, onFile);
      scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.load.off(Phaser.Loader.Events.FILE_COMPLETE, onFile));
    }
    if (hasFrame('fx.glow')) {
      // A soft crystal light above the frame.
      const g = frameRef('fx.glow');
      this.glow = scene.add
        .image(cx, cy - this.ch / 2 - 18, g.atlas, g.frame)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setTint(0xf3e0b8)
        .setScale(1.1, 0.7)
        .setAlpha(0.22)
        .setDepth(this.root.depth + 1);
    }
  }

  isActive(): boolean {
    return true;
  }

  interact(): void {
    this.onInspect(this);
  }

  /** Breathing light (called by the gallery every frame). */
  update(dtMs: number): void {
    this.t += dtMs / 1000;
    this.glow?.setAlpha(0.18 + 0.06 * Math.sin(this.t * 1.3));
  }

  private attachImage(): void {
    if (this.image || !this.scene.textures.exists(this.art.key)) return;
    const img = this.scene.add.image(0, 0, this.art.key);
    img.setDisplaySize(this.cw, this.ch);
    this.image = img;
    // Above the canvas ground, below the glass sheen.
    this.root.addAt(img, this.root.length - 1);
  }

  private buildWall(): void {
    const g = this.scene.add.graphics();
    const hw = this.cw / 2 + 12;
    const hh = this.ch / 2 + 12;
    // Shadow on the wall, wire and nail.
    g.fillStyle(0x000000, 0.28).fillRect(-hw + 7, -hh + 9, hw * 2, hh * 2);
    g.lineStyle(2, 0x2a2230, 0.9).lineBetween(-hw * 0.55, -hh + 4, 0, -hh - 34).lineBetween(hw * 0.55, -hh + 4, 0, -hh - 34);
    g.fillStyle(0x8c8a92, 1).fillCircle(0, -hh - 35, 3.2);
    g.lineStyle(1.5, INK, 1).strokeCircle(0, -hh - 35, 3.2);
    this.root.add(g);
  }

  private buildEasel(toFloor: number): void {
    const g = this.scene.add.graphics();
    const hh = this.ch / 2;
    const legTop = -hh - 26;
    // Back leg, front legs, ledge; a shadow on the ground.
    g.fillStyle(0x000000, 0.22).fillEllipse(0, toFloor - 2, this.cw * 0.95, 12);
    g.lineStyle(7, WOOD_DARK, 1).lineBetween(0, legTop + 8, 16, toFloor);
    g.lineStyle(8, INK, 1).lineBetween(-4, legTop, -this.cw * 0.42, toFloor).lineBetween(4, legTop, this.cw * 0.42, toFloor);
    g.lineStyle(5, WOOD_LIGHT, 1).lineBetween(-4, legTop, -this.cw * 0.42, toFloor).lineBetween(4, legTop, this.cw * 0.42, toFloor);
    g.fillStyle(INK, 1).fillRect(-this.cw / 2 - 16, hh + 8, this.cw + 32, 11);
    g.fillStyle(WOOD, 1).fillRect(-this.cw / 2 - 14, hh + 10, this.cw + 28, 7);
    this.root.add(g);
  }

  private buildFrame(): void {
    const g = this.scene.add.graphics();
    const fw = 12;
    const w = this.cw + fw * 2;
    const h = this.ch + fw * 2;
    const x0 = -w / 2;
    const y0 = -h / 2;
    g.fillStyle(INK, 1).fillRect(x0 - 2, y0 - 2, w + 4, h + 4);
    g.fillStyle(WOOD, 1).fillRect(x0, y0, w, h);
    // Bevel: light from the top left.
    g.fillStyle(WOOD_LIGHT, 1).fillRect(x0, y0, w, 4).fillRect(x0, y0, 4, h);
    g.fillStyle(WOOD_DARK, 1).fillRect(x0, y0 + h - 4, w, 4).fillRect(x0 + w - 4, y0, 4, h);
    // Gilded liner and the canvas ground.
    g.fillStyle(GOLD, 1).fillRect(-this.cw / 2 - 4, -this.ch / 2 - 4, this.cw + 8, this.ch + 8);
    g.fillStyle(0x2a2438, 1).fillRect(-this.cw / 2, -this.ch / 2, this.cw, this.ch);
    this.root.add(g);
    // Glass sheen over the artwork.
    const sheen = this.scene.add.graphics();
    sheen.fillStyle(0xffffff, 0.07);
    sheen.fillTriangle(-this.cw / 2, -this.ch / 2, -this.cw / 2 + this.cw * 0.55, -this.ch / 2, -this.cw / 2, -this.ch / 2 + this.ch * 0.55);
    this.root.add(sheen);
  }

  destroy(): void {
    this.root.destroy(true);
    this.glow?.destroy();
    this.image = null;
  }
}
