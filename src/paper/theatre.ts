import * as Phaser from 'phaser';
import type { Framing, Lens } from './lens';
import { bestSplit, cardLayout, curtainFoot, flatDepth, flatPlace, STAGE_DEPTH as D, theatreLens, viewAt, type CardLayout, type ChangeKind, type Pose } from './stagecraft';
import { curtainTile, eyelet, FLAT_EDGE, flatEdge, flatEdgeShadow, flatTile, HEM, hemShadow, hemTile, THEATRE, type Tile } from '../content/art/stagecraftArt';
import { flourish, lookOf, numeral, picture, PICTURE, tornSheet, wash } from '../content/art/chapterArt';
import { darkOf, INK, lightOf, lineFor, PASTEL } from '../render/2d/style';
import { hatchLines } from '../content/characters/kit';
import { addStaticCanvas, applyGrain, artCanvas, rasterizeSvg } from '../render/2d/TextureFactory';

// The paper theatre's stagecraft on the screen (the timing and the layout
// are in stagecraft.ts): the flats, the drop curtain, the chapter's title
// card on its threads with its picture standing on a ledge. Each is a sheet
// of paper facing the viewer at its own depth in front of the box, placed
// and sized by the theatre's lens (the stage's framing, the eye over x = 0),
// with its cut edge's white core and the shadow it throws on what is behind
// it (the light comes from the upper right, so shadows fall low on the left).
//
// The flats and the curtain are printed once, at boot (`printStagecraft`),
// at the screen's own scale at their depths; the title card and the picture
// are printed when a chapter begins (`Theatre.printCard`).

const KEYS = {
  flat: 'stage:flat',
  edgeL: 'stage:edgeL',
  edgeR: 'stage:edgeR',
  edgeShL: 'stage:edgeShL',
  edgeShR: 'stage:edgeShR',
  pleats: 'stage:pleats',
  hem: 'stage:hem',
  hemSh: 'stage:hemSh',
} as const;

/** Device px per world px each print was made at. */
const printedAt = { flat: 0, curtain: 0 };

const hex = (c: string): number => parseInt(c.slice(1), 16);

/** A tile printed at `scale` device px per world px (whole pixels, the view box grown to match). */
async function printTile(textures: Phaser.Textures.TextureManager, key: string, tile: Tile, scale: number, grain: boolean): Promise<void> {
  const cw = Math.max(1, Math.round(tile.w * scale));
  const ch = Math.max(1, Math.round(tile.h * scale));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${tile.w} ${tile.h}" preserveAspectRatio="none">${tile.body}</svg>`;
  const img = await rasterizeSvg(svg);
  const [canvas, ctx] = artCanvas(cw, ch);
  ctx.drawImage(img, 0, 0, cw, ch);
  if (grain) applyGrain(ctx, 0, 0, cw, ch, { scale, strength: 0.8 });
  if (textures.exists(key)) textures.remove(key);
  addStaticCanvas(textures, key, canvas);
}

/**
 * Prints the flats and the curtain for a picture W × H device px (at boot;
 * a later screen of another size draws them a little scaled). Resolves
 * whatever happens: a print that fails leaves plain paper colours.
 */
export async function printStagecraft(textures: Phaser.Textures.TextureManager, W: number, H: number, framing: Framing, actorScale: number): Promise<void> {
  const lens = theatreLens(W, H, framing, actorScale);
  const sf = lens.scale(D.flatL);
  const sc = lens.scale(D.curtain);
  try {
    await Promise.all([
      printTile(textures, KEYS.flat, flatTile(), sf, true),
      printTile(textures, KEYS.edgeL, flatEdge(1), sf, true),
      printTile(textures, KEYS.edgeR, flatEdge(-1), sf, true),
      printTile(textures, KEYS.edgeShL, flatEdgeShadow(1), sf, false),
      printTile(textures, KEYS.edgeShR, flatEdgeShadow(-1), sf, false),
      printTile(textures, KEYS.pleats, curtainTile(), sc, true),
      printTile(textures, KEYS.hem, hemTile(), sc, true),
      printTile(textures, KEYS.hemSh, hemShadow(), sc, false),
    ]);
    printedAt.flat = sf;
    printedAt.curtain = sc;
  } catch (e) {
    console.warn('stagecraft print failed', e);
  }
}

/** The shadow a sheet `gap` world px in front of what is behind it throws there (device px at the receiver's scale). */
function shadowOffset(gap: number, scale: number): { x: number; y: number } {
  const g = Math.min(130, Math.max(0, gap));
  return { x: -0.11 * g * scale, y: 0.15 * g * scale };
}

/** A sheet tiled with a printed texture (plain colour when the print is missing). */
class TiledSheet {
  readonly obj: Phaser.GameObjects.TileSprite | Phaser.GameObjects.Rectangle;
  constructor(scene: Phaser.Scene, key: string, fallback: number, depth: number, alpha = 1) {
    if (scene.textures.exists(key)) {
      this.obj = scene.add.tileSprite(0, 0, 2, 2, key).setOrigin(0, 0);
    } else this.obj = scene.add.rectangle(0, 0, 2, 2, fallback).setOrigin(0, 0);
    this.obj.setDepth(depth).setAlpha(alpha);
  }

  /** Over a screen rectangle; the print (made at `printed` px per world px) is shown at `scale`. */
  place(x: number, y: number, w: number, h: number, scale: number, printed: number, alpha: number, screenW: number, screenH: number): void {
    const o = this.obj;
    const show = alpha > 0.001 && w >= 1 && h >= 1 && x < screenW && y < screenH && x + w > 0 && y + h > 0;
    o.setVisible(show);
    if (!show) return;
    o.setPosition(x, y);
    // Whole pixels: the Canvas renderer repaints a tile sprite whenever its size or tiling changes.
    const iw = Math.max(1, Math.round(w));
    const ih = Math.max(1, Math.round(h));
    if (o.width !== iw || o.height !== ih) o.setSize(iw, ih);
    if (o instanceof Phaser.GameObjects.TileSprite) {
      const k = printed > 0 ? scale / printed : 1;
      if (Math.abs(o.tileScaleX - k) > 1e-4) o.setTileScale(k, k);
    } else o.setDisplaySize(iw, ih);
    o.setAlpha(alpha);
  }

  destroy(): void {
    this.obj.destroy();
  }
}

/** The title card's printed pieces. */
interface CardArt {
  layout: CardLayout;
  card: string;
  cardShadow: string;
  pic: string;
  picShadow: string;
}

export class Theatre {
  private lens: Lens;
  private readonly flats: { body: TiledSheet; edge: TiledSheet; shadow: TiledSheet | null; near: TiledSheet | null; side: -1 | 1 }[] = [];
  private curtain: { body: TiledSheet; hem: TiledSheet; shadow: TiledSheet } | null = null;
  private card: { art: CardArt; card: Phaser.GameObjects.Image; shadow: Phaser.GameObjects.Image; pic: Phaser.GameObjects.Image; picShadow: Phaser.GameObjects.Image } | null = null;
  private readonly lines: Phaser.GameObjects.Graphics;
  private readonly ledge: Phaser.GameObjects.Graphics;
  private dead = false;
  private readonly owned: string[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    readonly kind: ChangeKind,
    private readonly framing: Framing,
    private readonly actorScale: number,
    /** Where the flats meet (device px from the left; null: the middle). */
    private readonly meet: number | null = null,
  ) {
    const { width: W, height: H } = scene.scale;
    this.lens = theatreLens(W, H, framing, actorScale);
    if (kind === 'room') {
      // Back to front: the right flat's shadow on the room, the left flat, the right flat's shadow on it, the right flat.
      const sh = new TiledSheet(scene, KEYS.edgeShR, hex(THEATRE.shadow), 2, 0.26);
      this.flats.push({ body: new TiledSheet(scene, KEYS.flat, hex(THEATRE.flat), 3), edge: new TiledSheet(scene, KEYS.edgeL, hex(THEATRE.trim), 3), shadow: null, near: null, side: -1 });
      const near = new TiledSheet(scene, KEYS.edgeShR, hex(THEATRE.shadow), 4, 0.2);
      this.flats.push({ body: new TiledSheet(scene, KEYS.flat, hex(THEATRE.flat), 5), edge: new TiledSheet(scene, KEYS.edgeR, hex(THEATRE.trim), 5), shadow: sh, near, side: 1 });
    } else {
      this.curtain = {
        shadow: new TiledSheet(scene, KEYS.hemSh, hex(THEATRE.shadow), 0, 0.28),
        body: new TiledSheet(scene, KEYS.pleats, hex(THEATRE.curtain), 1),
        hem: new TiledSheet(scene, KEYS.hem, hex(THEATRE.braid), 1),
      };
    }
    this.lines = scene.add.graphics().setDepth(9);
    this.ledge = scene.add.graphics().setDepth(10);
  }

  /** Prints the chapter's title card and its picture (resolves false when they could not be made). */
  async printCard(chapter: number, roman: string, title: string): Promise<boolean> {
    const { width: W, height: H } = this.scene.scale;
    const layout = cardLayout(W, H);
    try {
      const sCard = this.lens.scale(D.card);
      const [card, pic] = await Promise.all([drawCard(layout, chapter, roman, title, sCard), drawPicture(chapter, layout.picture.w, layout.picture.h, sCard)]);
      if (this.dead) return false;
      const tx = this.scene.textures;
      const id = `${chapter}:${Math.round(W)}x${Math.round(H)}:${Date.now() % 100000}`;
      const keys = { card: `stage:card:${id}`, cardShadow: `stage:cardSh:${id}`, pic: `stage:pic:${id}`, picShadow: `stage:picSh:${id}` };
      addStaticCanvas(tx, keys.card, card);
      addStaticCanvas(tx, keys.cardShadow, silhouette(card));
      addStaticCanvas(tx, keys.pic, pic);
      addStaticCanvas(tx, keys.picShadow, silhouette(pic));
      this.owned.push(...Object.values(keys));
      const add = (key: string, depth: number, alpha = 1): Phaser.GameObjects.Image => this.scene.add.image(0, 0, key).setDepth(depth).setAlpha(alpha).setVisible(false);
      this.card = {
        art: { layout, ...keys },
        shadow: add(keys.cardShadow, 7, 0.3),
        card: add(keys.card, 8),
        picShadow: add(keys.picShadow, 11, 0.24).setOrigin(0.5, 1),
        pic: add(keys.pic, 12).setOrigin(0.5, 1),
      };
      return true;
    } catch (e) {
      console.warn('chapter card failed', e);
      return false;
    }
  }

  /** Puts everything where the pose says, for the screen as it is now. */
  update(p: Pose): void {
    const { width: W, height: H } = this.scene.scale;
    if (this.lens.w !== W || this.lens.h !== H) this.lens = theatreLens(W, H, this.framing, this.actorScale);
    const L = this.lens;
    this.lines.clear();
    this.ledge.clear();
    if (this.kind === 'room') this.placeFlats(p, L);
    else this.placeCurtain(p, L);
  }

  private placeFlats(p: Pose, L: Lens): void {
    const E = FLAT_EDGE;
    for (const f of this.flats) {
      const z = flatDepth(f.side);
      const s = L.scale(z);
      const at = flatPlace(L, f.side, p.flats, this.meet, E.w);
      const top = L.project(0, at.y0, z).y;
      const hpx = (at.y1 - at.y0) * s;
      const bx = L.project(at.x0, 0, z).x;
      const bw = (at.x1 - at.x0) * s;
      // The scalloped edge: its strip starts 6 px inside the body and reaches on past it.
      const ex = L.project(f.side < 0 ? at.xe - 6 : at.xe + 6 - E.w, 0, z).x;
      f.body.place(bx, top, bw, hpx, s, printedAt.flat, p.flatsAlpha, L.w, L.h);
      f.edge.place(ex, top, E.w * s, hpx, s, printedAt.flat, p.flatsAlpha, L.w, L.h);
      // The right flat's shadow: on the room far behind, and on the left flat where it laps over it.
      if (f.shadow) {
        const o = shadowOffset(z, L.scale(0));
        f.shadow.place(ex + o.x, top + o.y, E.w * s, hpx, s, printedAt.flat, 0.26 * p.flatsAlpha, L.w, L.h);
      }
      if (f.near) {
        const o = shadowOffset(Math.max(24, D.flatR - D.flatL), L.scale(D.flatL));
        f.near.place(ex + o.x, top + o.y, E.w * s, hpx, s, printedAt.flat, 0.2 * p.flatsAlpha * Math.min(1, p.flats * 1.2), L.w, L.h);
      }
    }
  }

  private placeCurtain(p: Pose, L: Lens): void {
    const c = this.curtain!;
    const z = D.curtain;
    const s = L.scale(z);
    const v = viewAt(L, z);
    const hemTop = curtainFoot(L, p.curtain, HEM.h, HEM.band) - HEM.h;
    const bodyH = v.y1 - v.y0 + 160;
    const x0 = v.x0 - 60;
    const w = v.x1 - v.x0 + 120;
    const P = (y: number): number => L.project(0, y, z).y;
    const left = L.project(x0, 0, z).x;
    c.body.place(left, P(hemTop - bodyH), w * s, (bodyH + 1) * s, s, printedAt.curtain, p.curtainAlpha, L.w, L.h);
    c.hem.place(left, P(hemTop), w * s, HEM.h * s, s, printedAt.curtain, p.curtainAlpha, L.w, L.h);
    const o = shadowOffset(z, L.scale(0));
    c.shadow.place(left + o.x, P(hemTop) + o.y, w * s, HEM.h * s, s, printedAt.curtain, 0.28 * p.curtainAlpha, L.w, L.h);
    this.placeCard(p, L);
  }

  private placeCard(p: Pose, L: Lens): void {
    const k = this.card;
    if (!k) return;
    const lay = k.art.layout;
    const sc = L.scale(D.card);
    const sp = L.scale(D.picture);
    const vis = p.card > 0.001 && p.cardAlpha > 0.001;
    for (const o of [k.card, k.shadow, k.pic, k.picShadow]) o.setVisible(vis);
    if (!vis) return;
    // Hanging, the card is where the layout puts it; up in the flies it is a card's height and more above the top.
    const lift = (lay.card.y + lay.card.h + 30) / sc;
    const dyW = -(1 - p.card) * lift;
    const dxW = p.sway;
    const cx = lay.card.x + lay.card.w / 2 + dxW * sc;
    const cy = lay.card.y + lay.card.h / 2 + dyW * sc;
    const sx = k.card.width > 0 ? lay.card.w / k.card.width : 1;
    const sy = k.card.height > 0 ? lay.card.h / k.card.height : 1;
    k.card.setPosition(cx, cy).setScale(sx, sy).setAlpha(p.cardAlpha);
    const so = shadowOffset(D.card - D.curtain, L.scale(D.curtain));
    k.shadow.setPosition(cx + so.x, cy + so.y).setScale(sx, sy).setAlpha(0.3 * p.cardAlpha);
    // The threads: from far up in the flies to the eyelets (they lean as it swings).
    // A light thread, inked along its dark side, so it shows on the dark curtain.
    for (const [w, col] of [[1.9, THEATRE.thread], [1, THEATRE.threadLight]] as const) {
      this.lines.lineStyle(Math.max(1, sc * w), hex(col), p.cardAlpha);
      for (const [ex, ey] of lay.eyelets) this.lines.lineBetween(ex, -L.h * 1.5, ex + dxW * sc, ey + dyW * sc);
    }
    // The ledge the picture stands on: a strip of the card's paper folded out to the front (true geometry).
    const pr = lay.picture;
    const footS = pr.y + pr.h;
    const foot = L.unproject(pr.x + pr.w / 2, footS, D.picture);
    const fy = foot.y + dyW;
    const wx = pr.w / sp / 2 + 10;
    const xm = foot.x + dxW;
    const zb = D.card;
    const zf = D.picture + 10;
    const lift2 = 7;
    const pt = (x: number, y: number, z: number): Phaser.Math.Vector2 => {
      const q = L.project(x, y, z);
      return new Phaser.Math.Vector2(q.x, q.y);
    };
    const a = pt(xm - wx, fy, zb);
    const b = pt(xm + wx, fy, zb);
    const c = pt(xm + wx, fy, zf);
    const d = pt(xm - wx, fy, zf);
    const e = pt(xm + wx, fy + lift2, zf);
    const f = pt(xm - wx, fy + lift2, zf);
    const g = this.ledge;
    const ledge = THEATRE.ledge;
    g.fillStyle(hex(lightOf(ledge, 0.35)), p.cardAlpha).fillPoints([a, b, c, d], true);
    g.fillStyle(hex(darkOf(ledge, 0.12)), p.cardAlpha).fillPoints([d, c, e, f], true);
    // Its end toward the eye shows too (the eye is over x = 0).
    const endX = xm - wx > 0 ? xm - wx : xm + wx < 0 ? xm + wx : null;
    if (endX !== null) {
      const q = [pt(endX, fy, zb), pt(endX, fy, zf), pt(endX, fy + lift2, zf), pt(endX, fy + lift2, zb)];
      g.fillStyle(hex(darkOf(ledge, 0.22)), p.cardAlpha).fillPoints(q, true);
    }
    g.lineStyle(Math.max(1, sc * 0.8), hex(lineFor(ledge)), p.cardAlpha);
    g.strokePoints([a, b, c, e, f, d, a], false);
    g.lineBetween(d.x, d.y, c.x, c.y);
    // The picture, standing up on it (squashed about its foot while it rises).
    const px = pt(xm, fy, D.picture).x;
    const py = pt(xm, fy, D.picture).y;
    const ps = { x: pr.w / Math.max(1, k.pic.width), y: pr.h / Math.max(1, k.pic.height) };
    const up = Math.max(0, p.picture);
    k.pic.setVisible(up > 0.03).setPosition(px, py).setScale(ps.x, ps.y * up).setAlpha(p.cardAlpha);
    const po = shadowOffset(D.picture - D.card, sc);
    k.picShadow.setVisible(up > 0.03).setPosition(px + po.x, py + po.y * 0.4).setScale(ps.x, ps.y * up).setAlpha(0.24 * p.cardAlpha);
  }

  destroy(): void {
    this.dead = true;
    for (const f of this.flats) {
      f.body.destroy();
      f.edge.destroy();
      f.shadow?.destroy();
      f.near?.destroy();
    }
    this.flats.length = 0;
    if (this.curtain) for (const s of Object.values(this.curtain)) s.destroy();
    this.curtain = null;
    if (this.card) for (const o of [this.card.card, this.card.shadow, this.card.pic, this.card.picShadow]) o.destroy();
    this.card = null;
    this.lines.destroy();
    this.ledge.destroy();
    for (const k of this.owned) if (this.scene.textures.exists(k)) this.scene.textures.remove(k);
    this.owned.length = 0;
  }
}

/** A sheet's shadow: its silhouette in the shadow's colour. */
function silhouette(src: HTMLCanvasElement): HTMLCanvasElement {
  const [c, ctx] = artCanvas(src.width, src.height);
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = THEATRE.shadow;
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

const r2 = (n: number): string => (Math.round(n * 100) / 100).toString();

/** The comic lettering's font (the game's display face). */
function displayFont(): string {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--display').trim();
    if (v) return v;
  } catch {
    // No document style: the fallbacks below.
  }
  return "'Avenir Next Condensed', 'Franklin Gothic Heavy', 'Arial Black', 'Segoe UI Black', 'Roboto Condensed', 'Helvetica Neue', system-ui, sans-serif";
}

/**
 * The title card (device px, the size it hangs at): a torn sheet of paper
 * with "BÖLÜM" on a little label, the chapter's numeral painted with a
 * brush on a wash, its title in comic lettering, a rule under it, and the
 * eyelets its threads go through.
 */
async function drawCard(lay: CardLayout, chapter: number, roman: string, title: string, scale: number): Promise<HTMLCanvasElement> {
  const look = lookOf(chapter);
  const cw = Math.round(lay.card.w);
  const ch = Math.round(lay.card.h);
  // The card's own units: 600 across.
  const U = 600 / cw;
  const uw = 600;
  const uh = ch * U;
  const loc = (x: number, y: number): [number, number] => [(x - lay.card.x) * U, (y - lay.card.y) * U];
  const sheet = tornSheet(6, 6, uw - 12, uh - 12, 300 + chapter, 5);
  let svg = `<path d="${sheet.outer}" fill="${THEATRE.core}"/>`;
  svg += `<clipPath id="cardc"><path d="${sheet.inner}"/></clipPath><g clip-path="url(#cardc)"><path d="${sheet.inner}" fill="${THEATRE.card}"/>`;
  // A little shade low on the left, hatched; the chapter's colour washed along the top.
  svg += `<path d="M0 ${r2(uh * 0.72)}Q${r2(uw * 0.18)} ${r2(uh * 0.82)} ${r2(uw * 0.3)} ${r2(uh)}H0Z" fill="#e9dfee" opacity="0.7"/>`;
  svg += hatchLines({ x0: 0, y0: uh * 0.74, x1: uw * 0.26, y1: uh }, 5, '#cbbfd8', 0.8);
  svg += `<rect x="0" y="0" width="${uw}" height="${r2(uh * 0.035)}" fill="${lightOf(look.paint, 0.4)}" opacity="0.8"/>`;
  svg += `</g><path d="${sheet.inner}" fill="none" stroke="${lineFor(THEATRE.card)}" stroke-width="1.6" stroke-linejoin="round"/>`;
  // The numeral, on its wash, as big as its box allows (left aligned).
  const num = numeral(roman, look.paint, 40 + chapter);
  const [nx, ny] = loc(lay.numeral.x, lay.numeral.y);
  const nk = Math.min((lay.numeral.w * U) / num.w, (lay.numeral.h * U) / num.h);
  const box = { x: num.x, y: num.y, w: num.w, h: num.h };
  svg += `<g transform="translate(${r2(nx - num.x * nk)} ${r2(ny - num.y * nk)}) scale(${r2(nk)})">${wash(box, look.paint, 70 + chapter)}${num.strokes.map((s) => s.art).join('')}</g>`;
  // The rule under the title.
  const [rx, ry] = loc(lay.rule.x, lay.rule.y);
  const rw = lay.rule.w * U;
  const rk = (lay.rule.h * U) / 20;
  svg += `<g transform="translate(${r2(rx)} ${r2(ry)}) scale(${r2(rk)})">${flourish(rw / rk, look.accent)}</g>`;
  // The eyelets.
  for (const [ex, ey] of lay.eyelets) {
    const [x, y] = loc(ex, ey);
    svg += eyelet(x, y, 7);
  }
  const img = await rasterizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${uw} ${r2(uh)}" preserveAspectRatio="none">${svg}</svg>`);
  const [canvas, ctx] = artCanvas(cw, ch);
  ctx.drawImage(img, 0, 0, cw, ch);
  // The words go on with the pen (canvas px from here on).
  const font = displayFont();
  const ox = -lay.card.x;
  const oy = -lay.card.y;
  drawTag(ctx, lay.tag.x + ox, lay.tag.y + oy, lay.tag.h, font);
  drawTitle(ctx, title, lay.title.x + ox, lay.title.y + oy, lay.title.w, lay.title.h, lay.titleSize, look.words, font);
  applyGrain(ctx, 0, 0, cw, ch, { scale, strength: 0.7 });
  return canvas;
}

/** "BÖLÜM" on a little slip of paper, a little askew. */
function drawTag(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, font: string): void {
  const size = h * 0.62;
  ctx.save();
  ctx.font = `900 ${size}px ${font}`;
  const text = 'BÖLÜM';
  const spacing = size * 0.3;
  let w = 0;
  for (const c of text) w += ctx.measureText(c).width + spacing;
  w -= spacing;
  const padX = size * 0.55;
  ctx.translate(x, y + h / 2);
  ctx.rotate(-0.05);
  ctx.fillStyle = 'rgba(58, 42, 70, 0.22)';
  ctx.fillRect(-size * 0.12, -h / 2 + size * 0.14, w + padX * 2, h);
  ctx.fillStyle = PASTEL.cream;
  ctx.strokeStyle = lineFor(PASTEL.cream);
  ctx.lineWidth = Math.max(1, size * 0.07);
  ctx.beginPath();
  ctx.rect(0, -h / 2, w + padX * 2, h);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.textBaseline = 'middle';
  let cx = padX;
  for (const c of text) {
    ctx.fillText(c, cx, size * 0.04);
    cx += ctx.measureText(c).width + spacing;
  }
  ctx.restore();
}

/** The title in comic lettering: each word in its colour, each letter a little tilted, outlined in its colour's dark tone, a soft shadow low on the left. */
function drawTitle(ctx: CanvasRenderingContext2D, title: string, x: number, y: number, w: number, h: number, maxSize: number, colours: readonly string[], font: string): void {
  const words = title.split(/\s+/).filter(Boolean);
  ctx.save();
  // The largest size (and the fewest lines, a little preferred) that fits.
  let best = { size: 10, lines: [words] as string[][], score: -1 };
  for (let n = 1; n <= Math.min(3, words.length); n++) {
    ctx.font = `900 100px ${font}`;
    const space = ctx.measureText(' ').width;
    const widths = words.map((t) => ctx.measureText(t).width);
    const split = bestSplit(widths, space, n);
    const size = Math.min(maxSize, (w * 0.94 * 100) / split.width, h / (n * 1.12));
    const score = size * (1 - 0.06 * (n - 1));
    if (score > best.score) best = { size, lines: split.cuts.map(([a, b]) => words.slice(a, b)), score };
  }
  const size = best.size;
  ctx.font = `900 ${size}px ${font}`;
  ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';
  const tilt = [-0.052, 0.044, -0.017, 0.07];
  const lift = [0.02, -0.035, 0.045, -0.01];
  let wi = 0;
  let li = 0;
  for (const line of best.lines) {
    let cx = x;
    const base = y + size * (0.92 + 1.12 * li);
    for (const word of line) {
      const fill = colours[wi % colours.length] ?? PASTEL.butter;
      let ci = 0;
      for (const c of word) {
        const cwid = ctx.measureText(c).width;
        ctx.save();
        ctx.translate(cx + cwid / 2, base + lift[ci % 4]! * size);
        ctx.rotate(tilt[ci % 4]!);
        // The soft shadow, the outline, the letter.
        ctx.fillStyle = 'rgba(58, 42, 70, 0.3)';
        ctx.fillText(c, -cwid / 2 - size * 0.05, size * 0.06);
        ctx.strokeStyle = lineFor(fill);
        ctx.lineWidth = Math.max(2, size * 0.13);
        ctx.strokeText(c, -cwid / 2, 0);
        ctx.fillStyle = fill;
        ctx.fillText(c, -cwid / 2, 0);
        ctx.restore();
        cx += cwid;
        ci++;
      }
      cx += ctx.measureText(' ').width;
      wi++;
    }
    li++;
  }
  ctx.restore();
}

/** The chapter's little picture, printed at the size it stands at. */
async function drawPicture(chapter: number, w: number, h: number, scale: number): Promise<HTMLCanvasElement> {
  const cw = Math.max(2, Math.round(w));
  const ch = Math.max(2, Math.round(h));
  const pic = picture(chapter);
  const img = await rasterizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${PICTURE.w} ${PICTURE.h}" preserveAspectRatio="none">${pic.art}</svg>`);
  const [canvas, ctx] = artCanvas(cw, ch);
  ctx.drawImage(img, 0, 0, cw, ch);
  applyGrain(ctx, 0, 0, cw, ch, { scale, strength: 0.7 });
  return canvas;
}
