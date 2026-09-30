import * as Phaser from 'phaser';
import { frameRef, hasFrame } from '../art/TextureFactory';
import { Rng } from '../art/svg';
import { whaleLayout, type WhaleLayout, type WhaleSpecies } from '../art/characters/whales';

// A whale as a lightweight cutout actor (like the creatures in Creatures.ts):
// body, tail stock, flukes, pectoral fin, jaw and eyelid images in one
// container, animated in code. It swims in place with slow undulation, tail
// beats and fin sway, blinks, spouts now and then, dips on a spring when
// something lands on it and opens its jaw when it calls. Nothing here
// touches physics: platform collision stays with the room.

interface Motion {
  /** Tail beats per second. */
  rate: number;
  tail: number;
  fluke: number;
  fin: number;
  /** Idle bob (px). */
  bob: number;
  /** How far the jaw opens when calling (rad). */
  jaw: number;
}

const MOTION: Record<WhaleSpecies, Motion> = {
  blue: { rate: 0.42, tail: 0.05, fluke: 0.2, fin: 0.09, bob: 2.2, jaw: 0 },
  sperm: { rate: 0.5, tail: 0.06, fluke: 0.24, fin: 0.13, bob: 2.4, jaw: 0.2 },
  bowhead: { rate: 0.36, tail: 0.055, fluke: 0.22, fin: 0.11, bob: 2.6, jaw: 0.075 },
};

function part(scene: Phaser.Scene, key: string | null): Phaser.GameObjects.Image | null {
  if (!key || !hasFrame(key)) return null;
  const f = frameRef(key);
  return scene.add.image(0, 0, f.atlas, f.frame).setOrigin(f.px / f.w, f.py / f.h).setScale(1 / f.scale);
}

export interface WhaleOptions {
  species: WhaleSpecies;
  /** Drawn size (back length) of the art to use. */
  size: number;
  /** Middle of the flat back, world px. */
  x: number;
  y: number;
  scale: number;
  facing: 1 | -1;
  depth: number;
  seed: number;
}

export class WhaleActor {
  readonly c: Phaser.GameObjects.Container;
  readonly lay: WhaleLayout;
  readonly species: WhaleSpecies;
  /** This whale's voice: its calls are pitched by it. */
  readonly voice: number;
  facing: 1 | -1;
  readonly scale: number;
  /** Rest position of the middle of the back. */
  baseX: number;
  baseY: number;
  /** Visual offset while swimming in (px). */
  offX = 0;
  offY = 0;
  /** Motion amplitude (reduced-motion setting lowers it). */
  calm = 1;
  private body: Phaser.GameObjects.Image | null;
  private tail: Phaser.GameObjects.Image | null;
  private fluke: Phaser.GameObjects.Image | null;
  private fin: Phaser.GameObjects.Image | null;
  private jaw: Phaser.GameObjects.Image | null;
  private lid: Phaser.GameObjects.Image | null;
  private spoutImg: Phaser.GameObjects.Image | null;
  private label: Phaser.GameObjects.Image | null;
  private readonly m: Motion;
  private readonly rng: Rng;
  private readonly phase: number;
  private t = 0;
  private dipY = 0;
  private dipV = 0;
  private tilt = 0;
  private tiltV = 0;
  private flick = 0;
  private bobK = 1;
  private jawA = 0;
  private jawHold = 0;
  private blinkT = 0;
  private nextBlink: number;
  private spoutT = -1;
  private nextSpout: number;
  private spoutBase = 1;
  /** Swimming across the scene (the passing whale): livelier, the body pitches. */
  private swimming = false;
  private swimTween: Phaser.Tweens.Tween | null = null;

  constructor(
    private scene: Phaser.Scene,
    o: WhaleOptions,
  ) {
    this.species = o.species;
    this.lay = whaleLayout(o.species, o.size);
    this.m = MOTION[o.species];
    this.rng = new Rng(o.seed);
    this.phase = this.rng.next();
    this.voice = 0.93 + this.rng.next() * 0.14;
    this.nextBlink = this.rng.range(1, 5);
    this.nextSpout = this.rng.range(6, 22);
    this.facing = o.facing;
    this.scale = o.scale;
    this.baseX = o.x;
    this.baseY = o.y;
    const L = this.lay;
    this.c = scene.add.container(o.x, o.y).setDepth(o.depth).setScale(o.scale * o.facing, o.scale);
    this.spoutImg = part(scene, L.keys.spout);
    this.fluke = part(scene, L.keys.fluke);
    this.tail = part(scene, L.keys.tail);
    this.body = part(scene, L.keys.body);
    // Some sperm whales wear the stitched "14" tag, not all of them.
    this.label = L.label && o.seed % 5 < 3 ? part(scene, 'whale.label') : null;
    this.jaw = part(scene, L.keys.jaw);
    this.fin = part(scene, L.keys.fin);
    this.lid = part(scene, L.keys.lid);
    if (this.spoutImg) {
      this.spoutBase = this.spoutImg.scaleX * L.spoutScale;
      this.spoutImg.setPosition(L.blow[0], L.blow[1] + 1).setVisible(false);
    }
    this.tail?.setPosition(L.tail[0], L.tail[1]);
    this.fluke?.setPosition(L.fluke[0], L.fluke[1]);
    if (this.label && L.label) {
      const k = this.label.scaleX * L.label.scale;
      // Counter the container's mirroring so the tag always reads "14".
      this.label.setPosition(L.label.at[0], L.label.at[1]).setScale(k * o.facing, k);
    }
    if (this.jaw && L.jaw) this.jaw.setPosition(L.jaw[0], L.jaw[1]).setRotation(L.jawRest);
    this.fin?.setPosition(L.fin[0], L.fin[1]);
    this.lid?.setPosition(L.eye[0], L.eye[1]).setVisible(false);
    for (const p of [this.spoutImg, this.fluke, this.tail, this.body, this.label, this.jaw, this.fin, this.lid]) if (p) this.c.add(p);
  }

  /** World-space bounds at rest (spout, fins and flukes included). */
  bounds(out: { x0: number; y0: number; x1: number; y1: number }): void {
    const b = this.lay.bounds;
    const s = this.scale;
    const a = this.facing > 0 ? b.x0 : -b.x1;
    const z = this.facing > 0 ? b.x1 : -b.x0;
    out.x0 = this.baseX + a * s;
    out.x1 = this.baseX + z * s;
    out.y0 = this.baseY + b.y0 * s;
    out.y1 = this.baseY + b.y1 * s;
  }

  /** Something landed on the back at world x: the whale gives under it. */
  dip(impact: number, worldX: number): void {
    const half = (this.lay.size * this.scale) / 2 || 1;
    const side = Math.max(-1, Math.min(1, (worldX - this.baseX) / half));
    this.dipV += 40 + 90 * impact;
    this.tiltV += 0.5 * impact * side;
    this.flick = Math.min(1.4, this.flick + 0.6 + impact * 0.6);
    this.blinkT = 0.16;
  }

  /** Opens the jaw for a call (and flicks the tail). */
  vocalize(seconds: number): void {
    this.jawHold = Math.max(this.jawHold, seconds);
    this.flick = Math.min(1.4, this.flick + 0.35);
  }

  spout(): void {
    if (!this.spoutImg) return;
    this.spoutT = 0;
    this.nextSpout = this.rng.range(16, 34);
  }

  /** Visual idle swim. `settle` (0..1) calms the bob while someone stands on the back. */
  update(dtMs: number, settle = 0): void {
    const dt = Math.min(dtMs, 50) / 1000;
    const m = this.m;
    const L = this.lay;
    this.t += dt;
    this.flick = Math.max(0, this.flick - dt * 0.7);
    const boost = (1 + 1.3 * this.flick + (this.swimming ? 0.5 : 0)) * this.calm;
    const w = (this.t * m.rate * (this.swimming ? 1.5 : 1) + this.phase) * Math.PI * 2;
    // Undulation: the tail stock leads, the flukes follow a beat later.
    const ta = m.tail * boost * Math.sin(w);
    const fa = m.fluke * boost * Math.sin(w - 1.15);
    if (this.tail) this.tail.rotation = ta;
    if (this.fluke) {
      const dx = L.fluke[0] - L.tail[0];
      const dy = L.fluke[1] - L.tail[1];
      const c = Math.cos(ta);
      const s = Math.sin(ta);
      this.fluke.x = L.tail[0] + c * dx - s * dy;
      this.fluke.y = L.tail[1] + s * dx + c * dy;
      this.fluke.rotation = ta + fa;
    }
    if (this.fin) this.fin.rotation = this.calm * (m.fin * Math.sin(w * 0.5 + 0.9) + 0.25 * m.fin * Math.sin(w * 1.3));
    // Springs: the dip under a landing, and a slight tilt toward its side.
    this.dipV += (-170 * this.dipY - 11 * this.dipV) * dt;
    this.dipY += this.dipV * dt;
    this.tiltV += (-150 * this.tilt - 11 * this.tiltV) * dt;
    this.tilt += this.tiltV * dt;
    this.bobK += ((1 - 0.8 * settle) - this.bobK) * Math.min(1, dt * 3);
    const bob = m.bob * this.bobK * this.calm * (this.swimming ? 2.4 : 1) * Math.sin(this.t * 0.95 + this.phase * 6.28);
    this.c.x = this.baseX + this.offX;
    this.c.y = this.baseY + this.offY + bob + this.dipY;
    this.c.rotation = this.tilt + (this.swimming ? 0.03 * Math.sin(w - 0.7) : 0);
    // Jaw: hangs a little, opens to call.
    if (this.jaw) {
      if (this.jawHold > 0) this.jawHold -= dt;
      const target = L.jawRest + (this.jawHold > 0 ? m.jaw * (0.75 + 0.25 * Math.sin(this.t * 9)) : 0.12 * m.jaw * (1 + Math.sin(this.t * 0.7 + this.phase * 9)));
      this.jawA += (target - this.jawA) * Math.min(1, dt * 7);
      this.jaw.rotation = this.jawA;
    }
    // Blink.
    if (this.blinkT > 0) this.blinkT -= dt;
    else if ((this.nextBlink -= dt) <= 0) {
      this.blinkT = 0.13;
      this.nextBlink = this.rng.range(2.5, 6.5);
    }
    this.lid?.setVisible(this.blinkT > 0);
    // Spout: grows out of the blowhole, then drifts up and thins away.
    if (this.spoutT < 0 && (this.nextSpout -= dt) <= 0) this.spout();
    if (this.spoutImg && this.spoutT >= 0) {
      this.spoutT += dt;
      const t = this.spoutT;
      const grow = Math.min(1, t / 0.32);
      const e = 1 - (1 - grow) * (1 - grow);
      // Opaque while it stands, then it thins away (quickly at the end).
      const fade = t < 0.75 ? 1 : Math.max(0, 1 - Math.pow((t - 0.75) / 0.8, 2));
      const k = this.spoutBase * (0.6 + 0.4 * e + 0.12 * Math.max(0, t - 0.32));
      this.spoutImg.setVisible(fade > 0).setAlpha(fade).setScale(k, this.spoutBase * (0.15 + 0.85 * e + 0.1 * Math.max(0, t - 0.32)));
      this.spoutImg.y = L.blow[1] + 1 - 10 * Math.max(0, t - 0.4);
      if (fade <= 0) this.spoutT = -1;
    }
  }

  /** The whale memory: swims across the scene through the earth. */
  swim(fromX: number, toX: number, y: number, ms: number, onDone?: () => void): void {
    this.swimTween?.stop();
    const f: 1 | -1 = toX >= fromX ? 1 : -1;
    this.facing = f;
    this.c.setScale(this.scale * f, this.scale);
    if (this.label) this.label.scaleX = Math.abs(this.label.scaleX) * f;
    this.baseX = fromX;
    this.baseY = y;
    this.swimming = true;
    this.c.setAlpha(0);
    this.nextSpout = (ms / 1000) * 0.45;
    this.scene.tweens.add({ targets: this.c, alpha: 0.95, duration: 900 });
    this.swimTween = this.scene.tweens.add({
      targets: this,
      baseX: toX,
      duration: ms,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.c,
          alpha: 0,
          duration: 900,
          onComplete: () => {
            this.swimming = false;
            onDone?.();
          },
        });
      },
    });
  }

  setVisible(v: boolean): void {
    if (this.c.visible !== v) this.c.setVisible(v);
  }

  destroy(): void {
    this.swimTween?.stop();
    this.c.destroy(true);
  }
}
