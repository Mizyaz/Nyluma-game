// Development-only preview of the scene changes (not part of the production
// build): the real WarpScene and its paper theatre over a made-up room. The
// change is held at a moment by hand: kdSeek(seconds) steps the game to it.
//   dev/transitions.html?mode=room|chapter&ch=1..6&dir=1|-1&reduced=1&canvas=1
import '../styles.css';
import * as Phaser from 'phaser';
import { app } from '../engine/App';
import { patchPhaser } from '../paper/fixes';
import { deviceSize } from '../paper/screen';
import { WarpScene, type Arrival, type WarpData } from '../engine/scenes/WarpScene';
import { printStagecraft } from '../paper/theatre';
import { actorScale } from '../paper/press';
import { FRAMING } from '../content/stage';

const q = new URLSearchParams(location.search);
const mode = q.get('mode') === 'chapter' ? 'chapter' : 'room';
const chapter = Math.max(1, Math.min(6, Number(q.get('ch') ?? 1)));
const dir = (q.get('dir') === '-1' ? -1 : 1) as 1 | -1;
const stage = document.getElementById('stage')!;
const parent = document.getElementById('game')!;

// Only what the scene change uses of the game's services.
const services = app as unknown as Record<string, unknown>;
services.settings = { reducedMotion: q.get('reduced') === '1' };
services.audio = { sfx: () => undefined };
services.ui = { stage };

/** The held clock the scene change reads (see WarpScene.update). */
const clock = { t: 0 };
(window as unknown as { __kdWarpClock: { t: number } }).__kdWarpClock = clock;

/** A made-up room: a wall, a floor, a few cards, its name; the next one in other colours. */
class Room extends Phaser.Scene {
  private g!: Phaser.GameObjects.Graphics;
  private label!: Phaser.GameObjects.Text;
  arrival: Arrival | null = null;

  constructor() {
    super('room');
  }

  create(): void {
    this.g = this.add.graphics();
    this.label = this.add.text(0, 0, '', { fontFamily: 'sans-serif', fontStyle: 'bold', color: '#4f4557' });
    this.draw(false);
    void printStagecraft(this.textures, this.scale.width, this.scale.height, FRAMING, actorScale()).then(() => {
      this.scene.launch('warp', {
        chapter: mode === 'chapter' ? chapter : null,
        dir,
        glow: { x: this.scale.width * 0.7, y: this.scale.height * 0.5 },
        onPeak: (a) => {
          this.arrival = a;
          this.draw(true);
          a.made = true;
        },
      } satisfies WarpData);
      document.body.dataset.ready = '1';
    });
  }

  override update(): void {
    if (this.arrival?.made) this.arrival.frames++;
  }

  private draw(next: boolean): void {
    const { width: w, height: h } = this.scale;
    const g = this.g.clear();
    g.fillStyle(next ? 0xc9c3d6 : 0xf1e8d2).fillRect(0, 0, w, h);
    g.fillStyle(next ? 0xe7e0cf : 0xefe6d6).fillRect(0, h * 0.64, w, h * 0.36);
    g.lineStyle(3, 0x5b4f66).lineBetween(0, h * 0.64, w, h * 0.64);
    const cards = next ? [0xa693c4, 0x8fbfb4, 0xf0b2cf] : [0x97a3dc, 0xf3e08e, 0xe98a7a, 0x9cc47a];
    cards.forEach((c, i) => {
      const x = w * (0.12 + i * 0.22);
      g.fillStyle(c).fillRoundedRect(x, h * 0.3 - i * 8, w * 0.13, h * 0.34 + i * 8, 14);
      g.lineStyle(3, 0x4f4557).strokeRoundedRect(x, h * 0.3 - i * 8, w * 0.13, h * 0.34 + i * 8, 14);
    });
    this.label.setText(next ? 'YENİ ODA' : 'ESKİ ODA').setFontSize(Math.round(h * 0.08)).setPosition(w * 0.08, h * 0.08);
  }
}

patchPhaser();
const r = parent.getBoundingClientRect();
const size = deviceSize(r.width || window.innerWidth, r.height || window.innerHeight);
const game = new Phaser.Game({
  type: q.has('canvas') ? Phaser.CANVAS : Phaser.AUTO,
  parent,
  width: size.w,
  height: size.h,
  backgroundColor: '#0f0d18',
  scale: { mode: Phaser.Scale.NONE, zoom: 1 / size.dpr },
  audio: { noAudio: true },
  banner: false,
  scene: [Room, WarpScene],
});

(window as unknown as { kdSeek: (t: number) => void }).kdSeek = (t: number) => {
  // Steps every frame up to t (the room is swapped and made on the way), then draws it.
  game.loop.sleep();
  const step = 1 / 60;
  let now = performance.now();
  while (clock.t < t - 1e-9) {
    clock.t = Math.min(t, clock.t + step);
    now += step * 1000;
    game.step(now, step * 1000);
  }
  game.step(now + 1, 1);
};
