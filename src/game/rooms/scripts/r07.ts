import * as Phaser from 'phaser';
import { app, persist } from '../../App';
import { DEPTH, VIEW_W } from '../../constants';
import { hex, P } from '../../art/palette';
import { frameRef, hasFrame } from '../../art/TextureFactory';
import { CAPTIONS } from '../../data/dialogue.tr';
import { memoryDef } from '../../data/memories';
import { RIDE_CHASMS, RIDE_GAPS, RIDE_GROUND_Y, RIDE_MOUND, RIDE_STOP_X } from '../../data/rooms/r07';
import { CreaturePool } from '../../entities/Creatures';
import { Face } from '../../entities/Celestial';
import { Horse } from '../../entities/Horse';
import type { WorldScene } from '../../scenes/WorldScene';
import type { RoomScript } from './types';
import { addArt } from './helpers';

// Chapter III — the flowering ride. Constant forward motion; the horse leaps
// the gaps by itself (the player may jump whenever they like) and flower
// bridges bloom over the chasms as it comes near.

const HULL_W = 110;
const HULL_H = 96;
const JUMP_V = 700;
const COYOTE = 0.14;
const BUFFER = 0.16;

interface Bridge {
  a: number;
  b: number;
  zone: Phaser.GameObjects.Zone;
  flowers: Phaser.GameObjects.Image[];
  bloomed: boolean;
  sign: Phaser.GameObjects.Image | null;
}

export function r07(w: WorldScene): RoomScript {
  let horse!: Horse;
  let zone!: Phaser.GameObjects.Zone;
  let body!: Phaser.Physics.Arcade.Body;
  const bridges: Bridge[] = [];
  let coyote = 0;
  let buffer = 0;
  let jumping = false;
  /** A leap the horse takes by itself: full height, never cut short. */
  let autoLeap = false;
  let ending = false;
  let restarting = false;
  let hoofCount = 0;
  let wasGround = true;
  let lastVy = 0;
  let memTaken = w.quest.hasMemory('m6');
  const flowerPool: Phaser.GameObjects.Image[] = [];
  let flowerNext = 0;
  const birds = new CreaturePool(w, 'bird', 12, DEPTH.actors - 2);
  const fish = new CreaturePool(w, 'fish', 12, DEPTH.actors - 2);
  let sun: Face | null = null;

  const speedBase = (): number => 330;

  const grounded = (): boolean => (body.blocked.down || body.touching.down) && body.velocity.y >= -1;

  const place = (x: number): void => {
    body.reset(x, RIDE_GROUND_Y - HULL_H / 2 - 2);
    body.setVelocity(speedBase(), 0);
    horse.x = x;
    horse.y = RIDE_GROUND_Y;
  };

  const flowerAt = (x: number, y: number): void => {
    if (flowerPool.length < 40) {
      const f = frameRef('fx.petal');
      const im = w.add.image(x, y, f.atlas, f.frame).setDepth(DEPTH.props + 1);
      flowerPool.push(im);
    }
    const im = flowerPool[flowerNext % flowerPool.length]!;
    flowerNext++;
    im.setPosition(x + (Math.random() - 0.5) * 30, y - 3).setVisible(true).setAlpha(1);
    im.setTint(Phaser.Math.RND.pick([hex(P.ivory), hex(P.vein), hex('#f3b6c9'), hex(P.crystalTealLight), hex(P.crystalOrangeLight)]));
    im.setScale(0).setRotation(Math.random() * 3);
    w.tweens.add({ targets: im, scale: 1 + Math.random() * 0.7, duration: 300, ease: 'Back.easeOut' });
  };

  const buildBridges = (): void => {
    for (const [a, b] of RIDE_CHASMS) {
      const z = w.add.zone((a + b) / 2, RIDE_GROUND_Y + 12, b - a + 40, 24);
      w.physics.add.existing(z, true);
      const zb = z.body as Phaser.Physics.Arcade.StaticBody;
      zb.enable = false;
      w.room.group.add(z);
      const sign = addArt(w, 'prop.flowernode', a - 60, RIDE_GROUND_Y + 2, DEPTH.props + 2);
      bridges.push({ a, b, zone: z, flowers: [], bloomed: false, sign });
    }
  };

  const bloomBridge = (br: Bridge): void => {
    if (br.bloomed) return;
    br.bloomed = true;
    (br.zone.body as Phaser.Physics.Arcade.StaticBody).enable = true;
    app.audio.sfx('bloom');
    const n = Math.ceil((br.b - br.a) / 34);
    for (let i = 0; i <= n; i++) {
      const x = br.a - 10 + i * 34;
      w.time.delayedCall(i * 22, () => {
        const f = frameRef('fx.petal');
        const vine = w.add.image(x, RIDE_GROUND_Y + 6, f.atlas, f.frame).setDepth(DEPTH.terrain + 3).setTint(hex(i % 2 ? P.leaf : P.leafLight)).setScale(0);
        w.tweens.add({ targets: vine, scaleX: 3.2, scaleY: 1.6, duration: 260, ease: 'Back.easeOut' });
        br.flowers.push(vine);
        if (i % 2 === 0) {
          const fl = w.add.image(x, RIDE_GROUND_Y - 4, f.atlas, f.frame).setDepth(DEPTH.terrain + 4).setScale(0);
          fl.setTint(Phaser.Math.RND.pick([hex(P.ivory), hex(P.vein), hex('#f3b6c9')]));
          w.tweens.add({ targets: fl, scale: 1.3, duration: 300, ease: 'Back.easeOut' });
          br.flowers.push(fl);
        }
      });
    }
  };

  const resetBridges = (fromX: number): void => {
    for (const br of bridges) {
      if (br.a < fromX) continue;
      br.bloomed = false;
      (br.zone.body as Phaser.Physics.Arcade.StaticBody).enable = false;
      for (const f of br.flowers) f.destroy();
      br.flowers = [];
    }
  };

  const restart = (): void => {
    if (restarting) return;
    restarting = true;
    const cam = w.cameras.main;
    cam.fadeOut(300, 15, 13, 24);
    cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      const cp = w.def.checkpoints.find((c) => c.id === w.quest.progress.checkpoint) ?? w.def.checkpoints[0]!;
      place(cp.x);
      resetBridges(cp.x);
      restarting = false;
      w.camFree.x = cp.x + 360;
      cam.fadeIn(360, 15, 13, 24);
    });
  };

  const finish = (): void => {
    if (ending) return;
    ending = true;
    void w.narrative.play(
      'r07.end',
      async (cs) => {
        sun = new Face(w, 'sun', RIDE_STOP_X + 520, 330, DEPTH.backProps + 30);
        sun.setScale(0.55);
        sun.c.setAlpha(0);
        await cs.tween({ targets: sun.c, alpha: 1, duration: 1500 });
        sun.cough();
        cs.caption(CAPTIONS.sunSeen, 5200);
        horse.play('rear');
        app.audio.sfx('neigh');
        await cs.wait(1400);
        horse.play('idle');
        await cs.wait(2400);
      },
      () => {
        w.flag('r07.done', false);
        w.goToRoom('r08');
      },
    );
  };

  return {
    setup() {
      const p = w.player;
      p.state = 'hidden';
      p.setVisible(false);
      p.body.enable = false;
      const cp = w.def.checkpoints.find((c) => c.id === w.quest.progress.checkpoint) ?? w.def.checkpoints[0]!;
      horse = new Horse(w, cp.x, RIDE_GROUND_Y, DEPTH.player);
      horse.setRider('human');
      zone = w.add.zone(cp.x, RIDE_GROUND_Y - HULL_H / 2, HULL_W, HULL_H);
      w.physics.add.existing(zone);
      body = zone.body as Phaser.Physics.Arcade.Body;
      body.setMaxVelocityY(1000);
      w.physics.add.collider(zone, w.room.group);
      place(cp.x);
      buildBridges();
      horse.onHoof = (x, y) => {
        if (!grounded()) return;
        hoofCount++;
        app.audio.sfx('hoof', { vol: 0.55, pitch: 0.9 + Math.random() * 0.2 });
        if (hoofCount % 2 === 0) flowerAt(x - 30, y);
        if (hoofCount % 7 === 0) birds.spawn(x - 40, y - 20, -60 - Math.random() * 80, -120 - Math.random() * 60, 2.4);
        if (hoofCount % 9 === 0) fish.spawn(x - 30, y - 6, -100 - Math.random() * 60, -380 - Math.random() * 80, 1.6);
      };
      w.camTo(cp.x + 360, RIDE_GROUND_Y - 200);
      w.cameras.main.setDeadzone(40, 60);
      if (w.quest.set('r07.enter')) {
        app.ui.hud.caption(CAPTIONS.r07enter, 5000);
        w.time.delayedCall(2500, () => app.ui.hud.toast('Boşluk: zıpla  ·  ← →: hızını ayarla', 5200));
        w.time.delayedCall(9000, () => app.ui.hud.caption(CAPTIONS.flowersRide, 4200));
      }
      w.onCleanup(() => {
        horse.destroy();
        birds.destroy();
        fish.destroy();
        sun?.destroy();
      });
    },
    onFixed(dt) {
      if (restarting) return;
      const inp = w.stepInput;
      const gp = app.input.context === 'gameplay';
      const g = grounded();
      if (g && !wasGround && lastVy > 250) {
        app.audio.sfx('land', { vol: 0.8 });
        w.dust(horse.x - 40, RIDE_GROUND_Y, 8);
        w.dust(horse.x + 40, RIDE_GROUND_Y, 8);
      }
      wasGround = g;
      lastVy = body.velocity.y;
      coyote = g ? COYOTE : coyote - dt;
      buffer = gp && inp.jumpPressed ? BUFFER : buffer - dt;
      // Constant forward motion with gentle speed control.
      let target = speedBase() + (gp ? inp.axis : 0) * 70;
      if (ending) target = Math.min(speedBase(), Math.max(0, (RIDE_STOP_X - horse.x) * 0.5));
      body.velocity.x += (target - body.velocity.x) * Math.min(1, dt * 4);
      // Never stall against a ledge: the horse hops up on its own.
      if (!ending && g && body.blocked.right && buffer <= 0) buffer = BUFFER;
      // Gaps and the mound: the horse leaps by itself.
      const lead = body.velocity.x * 0.2;
      if (!ending && g && buffer <= 0 && (RIDE_GAPS.some(([a]) => a - horse.x > lead && a - horse.x < lead + 60) || (RIDE_MOUND[0] - horse.x > lead + 30 && RIDE_MOUND[0] - horse.x < lead + 90))) {
        buffer = BUFFER;
        autoLeap = true;
      }
      if (!ending && buffer > 0 && coyote > 0) {
        body.velocity.y = -JUMP_V;
        buffer = 0;
        coyote = 0;
        jumping = true;
        app.audio.sfx('jump', { pitch: 0.7 });
      }
      if (jumping && !autoLeap && !inp.jumpHeld && body.velocity.y < 0) {
        body.velocity.y *= 0.55;
        jumping = false;
      }
      if (body.velocity.y >= 0) {
        jumping = false;
        autoLeap = false;
      }
      horse.x = zone.x;
      horse.y = zone.y + HULL_H / 2;
      w.probeExtra.horse = { x: horse.x, y: horse.y, grounded: g, vx: body.velocity.x, bridges: bridges.map((b) => b.bloomed) };
      // Flower bridges bloom by themselves as the horse comes near.
      for (const br of bridges) {
        if (!br.bloomed && horse.x > br.a - 700 && horse.x < br.b - 80) bloomBridge(br);
      }
      // Optional memory on the alternate arc.
      if (!memTaken) {
        const m = w.def.memories?.[0];
        if (m) {
          const chest = { x: horse.x + 10, y: horse.y - 150 };
          if (Math.abs(chest.x - m.x) < 70 && Math.abs(chest.y - (m.y - 34)) < 70) {
            memTaken = true;
            w.room.takeMemory(m.id);
            if (w.quest.collectMemory(m.id)) {
              app.audio.sfx('pickup');
              app.ui.hud.toast(`Anı bulundu: ${memoryDef(m.id)?.title ?? ''}`, 4200);
              persist();
            }
          }
        }
      }
      // Restart points
      for (const c of w.def.checkpoints) {
        if (horse.x >= c.x && horse.x < c.x + 600 && w.quest.progress.checkpoint !== c.id) {
          const idx = w.def.checkpoints.indexOf(c);
          const cur = w.def.checkpoints.findIndex((x) => x.id === w.quest.progress.checkpoint);
          if (idx > cur) w.activateCheckpoint(c.id, !!c.silent);
        }
      }
      if (zone.y > RIDE_GROUND_Y + 160) restart();
      if (!ending && horse.x > RIDE_STOP_X - 1600) finish();
      void RIDE_MOUND;
    },
    onUpdate(dt) {
      const moving = Math.abs(body.velocity.x) > 20;
      if (!grounded()) horse.play(body.velocity.y < 0 ? 'jump' : 'land');
      else if (moving) horse.gallop((Math.abs(body.velocity.x) * dt) / 1000);
      else horse.play('idle');
      // Gorti cheers while the horse flies over a gap.
      horse.rider?.play('ride', grounded() ? {} : { emote: 'joy', emoteK: 1 });
      horse.update(dt);
      birds.update(dt);
      fish.update(dt);
      sun?.update(dt);
      sun?.lookAt(horse.x, horse.y - 120);
      w.camFree.x += (horse.x + 330 - w.camFree.x) * Math.min(1, dt / 120);
      w.camFree.y += (horse.y - 180 - w.camFree.y) * Math.min(1, dt / 300);
      for (const br of bridges) {
        const show = !br.bloomed && horse.x > br.a - 1100 && horse.x < br.a;
        br.sign?.setAlpha(show ? 0.7 + 0.3 * Math.sin(w.time.now / 150) : 0.35);
      }
      void VIEW_W;
      void hasFrame;
    },
    onRespawn() {
      restart();
    },
  };
}
