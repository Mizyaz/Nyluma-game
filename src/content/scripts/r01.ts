import type * as Phaser from 'phaser';
import { app } from '../../engine/App';
import { DEPTH, JUMPING, VIEW_H, VIEW_W } from '../../engine/constants';
import { hex } from '../../render/2d/palette';
import { frameRef, hasFrame } from '../../render/2d/TextureFactory';
import { P1 } from '../art/painting1';
import { CAPTIONS, DIALOGUE } from '../data/dialogue.tr';
import { PAINTINGS } from '../data/paintings';
import { BOX, ROOM_W, WIDE, WIDE_TOP } from '../rooms/r01Stage';
import type { CinemaScene } from '../../engine/scenes/CinemaScene';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import { GemPortal } from '../../render/2d/fx/gemPortal';
import { StoneFrame } from '../../render/2d/fx/stoneFrame';
import type { RoomScript } from './types';

/** The bed's mattress (the top of the drawn bed, p1.bed) and where Gorti steps down. */
const BED = { left: 322, right: 538, top: 590 };
const FLOOR_Y = 660;
const STEP_DOWN_X = 564;
/** He wakes by himself after this long if nobody wakes him (the opening shot included). */
const WAKE_AFTER_MS = 18000;
/** Things in the room with something to say (data/dialogue.tr.ts). */
const INSPECTABLE = new Set(['toywhale', 'marks', 'window', 'bed', 'tree', 'gift', 'starfolk', 'picture']);

/**
 * The opening, in ms from the first frame: the painting itself, then the
 * room dissolving out of it in a wide shot framed like it, a hold, and a
 * glide in to Gorti asleep in his bed.
 */
const OPENING = { dissolveAt: 2300, dissolve: 1500, glideAt: 6300, glide: 3300 } as const;
const OPENING_END = OPENING.glideAt + OPENING.glide + 200;
/** Where the camera rests on the sleeper. */
const BEDSIDE = { x: 430, y: 560 };
/** The startled creature hides when Gorti comes this near, and peeks out again when he is this far. */
const SHADE_NEAR = 175;
const SHADE_FAR = 330;
/** Where its "!!!" stands, over its curled hand (bottom centre). */
const BANG_AT = { x: 1206, y: 580 };

// Chapter I — the 14th Room, as the first painting shows it. The game opens
// on the painting; the room dissolves out of it in a wide shot of the whole
// box, and the camera glides in to Gorti asleep in his bed. A key (or a
// little while) wakes him, the camera comes close to his face as he opens
// his eyes, yawns and hops out of bed. Then nothing has to be done: the
// toys, the marks and the window tell their story to whoever stops to look,
// and the roots at the far end have already parted.
export function r01(w: WorldScene): RoomScript {
  let sleeping = false;
  let waking = false;
  let sleptMs = 0;
  let zzz: Phaser.Time.TimerEvent | null = null;
  let portal: GemPortal | null = null;
  /** The painting's cracked stone round the screen (not in the wide shot, which has its own). */
  let frame: StoneFrame | null = null;
  /** The opening's pending steps and the painting over the screen. */
  let opening: Phaser.Time.TimerEvent[] = [];
  let overlay: Phaser.GameObjects.GameObject[] = [];
  let wideBounds = false;
  // The startled creature and its "!!!".
  let shade: Phaser.GameObjects.Image | null = null;
  let bang: Phaser.GameObjects.Image | null = null;
  let bangScale = 1;
  let shadeHome = 0;
  let shadeHidden = false;
  let shadeAwayMs = 0;

  const inspect = (id: string): void => {
    w.player.lock(true, 'interact');
    void app.ui.dialogue.open(DIALOGUE[id] ?? []).then(() => {
      w.player.lock(false);
      w.flag(`r01.${id}`, false);
    });
  };

  const propImages = (key: string): Phaser.GameObjects.Image[] =>
    w.room.props.filter((p) => p.def.key === key && p.img).map((p) => p.img!);

  /** The out-of-focus strip at the bottom of the view (it only fits the room's own zoom). */
  const foreground = (): Phaser.GameObjects.Image[] =>
    w.children.list.filter((o): o is Phaser.GameObjects.Image => o.type === 'Image' && (o as Phaser.GameObjects.Image).texture.key.startsWith(`fg:${w.def.id}:`));

  // ------------------------------------------------------------ idle life

  const idleLife = (): void => {
    // The star creature bobs where it stands, reaching out.
    for (const img of propImages('p1.starfolk')) {
      w.tweens.add({ targets: img, y: img.y - 5, angle: -2, duration: 1700, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });
    }
    // The charms under the box turn a little on their strings.
    w.room.props
      .filter((p) => p.def.key.startsWith('p1.charm.') && p.img)
      .forEach((p, i) => {
        p.img!.setAngle(-2);
        w.tweens.add({ targets: p.img, angle: 2.5, duration: 2300 + i * 310, ease: 'Sine.easeInOut', yoyo: true, repeat: -1, delay: i * 170 });
      });
    // The arms breathe on the lid.
    for (const img of propImages('p1.arm')) {
      w.tweens.add({ targets: img, angle: img.flipX ? 0.9 : -0.9, duration: 3400, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });
    }
    shade = propImages('p1.shade')[0] ?? null;
    shadeHome = shade?.y ?? 0;
    // Its "!!!" belongs to the script (the room's props are re-shown on
    // every flag change). As painted, it is there while the room is only a
    // picture.
    if (shade && hasFrame('p1.bang')) {
      const f = frameRef('p1.bang');
      bangScale = 1 / f.scale;
      bang = w.add.image(BANG_AT.x, BANG_AT.y, f.atlas, f.frame).setOrigin(0.5, 1).setScale(bangScale).setDepth(shade.depth + 1);
      bang.setAlpha(sleeping ? 1 : 0);
    }
  };

  /** The dark creature sees Gorti coming: "!!!", and down it goes behind the floor. */
  const startle = (): void => {
    if (!shade || shadeHidden) return;
    shadeHidden = true;
    shadeAwayMs = 0;
    if (bang) {
      w.tweens.killTweensOf(bang);
      bang.setAlpha(1).setScale(bangScale * 0.6);
      w.tweens.add({ targets: bang, scale: bangScale, duration: 260, ease: 'Back.easeOut' });
      w.tweens.add({ targets: bang, alpha: 0, delay: 900, duration: 500 });
    }
    w.tweens.killTweensOf(shade);
    w.tweens.add({ targets: shade, y: shadeHome + 96, duration: 380, delay: 160, ease: 'Back.easeIn' });
  };

  /** Once Gorti has gone, it peeks out again. */
  const peek = (): void => {
    if (!shade || !shadeHidden) return;
    shadeHidden = false;
    w.tweens.killTweensOf(shade);
    w.tweens.add({ targets: shade, y: shadeHome, duration: 1100, ease: 'Sine.easeOut' });
  };

  const updateShade = (dtMs: number): void => {
    if (!shade || sleeping || !w.player.controllable) return;
    const d = Math.abs(w.player.x - shade.x);
    if (!shadeHidden && d < SHADE_NEAR) startle();
    else if (shadeHidden) {
      shadeAwayMs = d > SHADE_FAR ? shadeAwayMs + dtMs : 0;
      if (shadeAwayMs > 2600) peek();
    }
  };

  // ------------------------------------------------------------ the opening

  /** The camera may look above the room while the whole box is in view. */
  const openBounds = (open: boolean): void => {
    if (open === wideBounds) return;
    wideBounds = open;
    const cam = w.cameras.main;
    if (open) cam.setBounds(0, WIDE_TOP, ROOM_W, w.def.height - WIDE_TOP);
    else cam.setBounds(0, 0, w.def.width, w.def.height);
  };

  /**
   * The painting over the screen, framed like the wide shot so the room
   * seems to come out of it: its box over the room's box.
   */
  const showPainting = (): void => {
    const art = PAINTINGS.stranger;
    if (!w.textures.exists(art.key)) return;
    const z = WIDE.zoom;
    // Screen → object space of a scroll-less object under this zoom.
    const at = (sx: number, sy: number): [number, number] => [VIEW_W / 2 + (sx - VIEW_W / 2) / z, VIEW_H / 2 + (sy - VIEW_H / 2) / z];
    const boxTop = (BOX.lidBack - WIDE_TOP) * z;
    const boxBottom = (BOX.bottom - WIDE_TOP) * z;
    // The painting's box runs from y 245 to 745 of its 897 px.
    const src = w.textures.get(art.key).getSourceImage() as { width: number; height: number };
    const k = (boxBottom - boxTop) / ((500 / 897) * src.height);
    const top = boxTop - (245 / 897) * src.height * k;
    const [cx, cy] = at(VIEW_W / 2, top + (src.height * k) / 2);
    const [gx, gy] = at(VIEW_W / 2, VIEW_H / 2);
    const ground = w.add.rectangle(gx, gy, VIEW_W / z + 8, VIEW_H / z + 8, hex(P1.stone)).setScrollFactor(0).setDepth(DEPTH.overlay + 5);
    const pic = w.add.image(cx, cy, art.key).setScrollFactor(0).setDepth(DEPTH.overlay + 6).setScale(k / z);
    overlay = [ground, pic];
  };

  const dissolvePainting = (ms: number): void => {
    const items = overlay;
    overlay = [];
    if (!items.length) return;
    const pic = items[1] as Phaser.GameObjects.Image | undefined;
    if (pic && !app.settings.reducedMotion) w.tweens.add({ targets: pic, scale: pic.scale * 1.05, duration: ms, ease: 'Sine.easeIn' });
    w.tweens.add({ targets: items, alpha: 0, duration: ms, ease: 'Sine.easeInOut', onComplete: () => items.forEach((o) => o.destroy()) });
  };

  const later = (ms: number, fn: () => void): void => {
    opening.push(w.time.delayedCall(ms, fn));
  };

  /** Ends the opening at once: a key woke him (`fade`), or the room is left. */
  const endOpening = (fade: boolean): void => {
    for (const t of opening) t.remove(false);
    opening = [];
    if (!fade) {
      for (const o of overlay) o.destroy();
      overlay = [];
      return;
    }
    dissolvePainting(300);
    for (const img of foreground()) {
      w.tweens.killTweensOf(img);
      img.setAlpha(0.92);
    }
  };

  const playOpening = (): void => {
    // The whole box, the way the painting frames it.
    openBounds(true);
    void w.zoomTo(WIDE.zoom, 0);
    w.camTo(WIDE.x, WIDE.y);
    w.cameras.main.centerOn(WIDE.x, WIDE.y);
    for (const img of foreground()) img.setAlpha(0);
    showPainting();
    later(OPENING.dissolveAt, () => dissolvePainting(OPENING.dissolve));
    later(OPENING.dissolveAt + OPENING.dissolve, () => app.ui.hud.caption(CAPTIONS.intro1, 5600));
    // Then in to the sleeper.
    later(OPENING.glideAt, () => {
      void w.zoomTo(null, OPENING.glide);
      w.camTo(BEDSIDE.x, BEDSIDE.y);
      if (bang) w.tweens.add({ targets: bang, alpha: 0, duration: 900 });
      for (const img of foreground()) w.tweens.add({ targets: img, alpha: 0.92, delay: OPENING.glide * 0.5, duration: OPENING.glide * 0.5 });
    });
    later(OPENING_END, () => {
      openBounds(false);
      frame?.show(true, 1400);
      app.ui.hud.caption(CAPTIONS.intro2, 5200);
      app.ui.hud.toast(app.ui.touch.enabled ? 'Uyandırmak için dokun' : 'Uyandırmak için bir tuşa bas', 4200);
    });
  };

  // ------------------------------------------------------------ sleep and waking

  /** A "z" drifting up from the sleeper's face. */
  const puffZ = (): void => {
    if (!sleeping) return;
    const e = w.player.eyePos();
    const big = Math.random() < 0.4;
    const t = w.add
      .text(e.x - 4, e.y - 16, 'z', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: big ? '26px' : '19px',
        fontStyle: 'italic',
        color: '#dccdf0',
        stroke: '#4f4557',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.actors + 5)
      .setAlpha(0);
    w.tweens.add({
      targets: t,
      x: t.x + 26 + Math.random() * 14,
      y: t.y - 60 - Math.random() * 20,
      angle: -18 + Math.random() * 10,
      duration: 2200,
      ease: 'Sine.easeOut',
      onUpdate: (tw) => t.setAlpha(Math.min(1, tw.progress * 4) * (1 - tw.progress)),
      onComplete: () => t.destroy(),
    });
  };

  const goToSleep = (): void => {
    const p = w.player;
    sleeping = true;
    // His body waits on the floor beside the bed; what we see lies on it,
    // head on the pillow at the far end, turned about the hips.
    p.teleport(STEP_DOWN_X, FLOOR_Y, 1);
    const headToHip = Math.max(40, FLOOR_Y - p.eyePos().y - p.hipHeight + 16);
    p.lieHip = { x: Math.min(BED.right - p.hipHeight - 6, BED.left + 16 + headToHip), y: BED.top - 12 };
    p.lie = 1;
    p.eyelids = 1;
    p.lock(true, 'sleep');
    zzz = w.time.addEvent({ delay: 1350, loop: true, callback: puffZ });
    playOpening();
  };

  const endSleep = (): void => {
    sleeping = false;
    zzz?.remove();
    zzz = null;
  };

  const wake = (): void => {
    if (waking) return;
    waking = true;
    endSleep();
    endOpening(true);
    frame?.show(true, 900);
    bang?.setAlpha(0);
    const p = w.player;
    const cinema = (): CinemaScene | null => (w.scene.isActive('cinema') ? (w.scene.get('cinema') as CinemaScene) : null);
    void w.narrative.play(
      'r01.wake',
      async (cs) => {
        // Cutscene mode: black bars, the camera comes close to his face.
        w.scene.launch('cinema', { cast: [], dim: false });
        const e = p.eyePos();
        w.camTo(e.x + 6, e.y + 8);
        void w.zoomTo(3.8, 1500);
        await cs.wait(1300);
        // The lids flutter, then open.
        await cs.tween({ targets: p, eyelids: 0.55, duration: 170 });
        await cs.tween({ targets: p, eyelids: 1, duration: 140 });
        await cs.wait(380);
        await cs.tween({ targets: p, eyelids: 0.25, duration: 220 });
        await cs.tween({ targets: p, eyelids: 0.8, duration: 160 });
        await cs.wait(240);
        await cs.tween({ targets: p, eyelids: 0, duration: 260 });
        p.emote('surprise', 900);
        await cs.wait(500);
        // Where am I? A look up, a look around.
        p.lookFor(-0.35, 800);
        await cs.wait(900);
        p.lookFor(0.25, 600);
        await cs.wait(700);
        // A long breath out (the head sinks back into the pillow).
        await cs.tween({ targets: p, yawn: 1, duration: 650, ease: 'Sine.easeOut' });
        await cs.wait(350);
        await cs.tween({ targets: p, yawn: 0, duration: 380, ease: 'Sine.easeIn' });
        await cs.wait(200);
        // The camera pulls back; he gets up the way anyone does.
        void w.zoomTo(null, 900);
        w.camTo(BEDSIDE.x, BEDSIDE.y);
        p.eyelids = -1;
        p.getupK = 0;
        p.lock(true, 'getup');
        const hip = p.lieHip!;
        // Sits up: the body turns about the hips, the legs stay on the bed.
        const k = { lie: 1, g: 0 };
        await cs.tween({
          targets: k,
          lie: 0,
          g: 0.45,
          duration: 900,
          ease: 'Sine.easeInOut',
          onUpdate: () => {
            p.lie = k.lie;
            p.getupK = k.g;
          },
        });
        p.lookFor(0.2, 500);
        await cs.wait(350);
        // Shuffles to the edge and lets the legs down.
        await cs.tween({
          targets: [hip, k],
          x: BED.right - 8,
          g: 0.7,
          duration: 620,
          ease: 'Sine.easeInOut',
          onUpdate: () => (p.getupK = k.g),
        });
        await cs.wait(200);
        // Stands up: the hips come off the bed and down to standing height.
        await cs.tween({
          targets: [hip, k],
          x: BED.right + 26,
          y: FLOOR_Y - p.hipHeight,
          g: 1,
          duration: 560,
          ease: 'Sine.easeInOut',
          onUpdate: () => (p.getupK = k.g),
        });
      },
      () => {
        // Also when skipped: he is up, and the room is his.
        endSleep();
        p.teleport(BED.right + 26, FLOOR_Y, 1);
        p.lie = 0;
        p.lieHip = null;
        p.getupK = 0;
        p.eyelids = -1;
        p.yawn = 0;
        p.lock(false);
        w.camTo(null);
        void w.zoomTo(null, 0);
        openBounds(false);
        cinema()?.close();
        p.thump(0.2);
        p.startIdle('stretch');
        w.quest.set('r01.awake');
        w.time.delayedCall(900, () => app.ui.hud.caption(CAPTIONS.intro3, 4200));
        w.time.delayedCall(2600, () => app.ui.hud.toast(JUMPING ? 'A / D ya da ← →: yürü   ·   Boşluk: zıpla   ·   E: incele' : 'A / D ya da ← →: yürü   ·   E: incele', 6500));
      },
    );
  };

  return {
    setup() {
      // At the end of the root tunnel, the way on: a living mouth of the gem tunnel.
      portal = new GemPortal(w, 2162, 660, 104, 214, -35);
      frame = new StoneFrame(w);
      if (w.quest.set('r01.intro')) goToSleep();
      else frame.show(true, 0);
      idleLife();
    },
    onUpdate(dtMs) {
      portal?.update(dtMs);
      frame?.update();
      updateShade(dtMs);
    },
    onFixed(dt) {
      if (sleeping && !waking) {
        sleptMs += dt * 1000;
        const i = app.input;
        const woken = i.axisX() !== 0 || i.peek('jump') || i.peek('action') || i.peek('confirm');
        if (woken || sleptMs > WAKE_AFTER_MS) wake();
        return;
      }
      // Near the roots, the room's name.
      if (w.player.x > 1450 && w.quest.set('r01.name')) app.ui.hud.caption(CAPTIONS.room14, 6500);
    },
    onInteract(id) {
      if (INSPECTABLE.has(id)) {
        inspect(id);
        return true;
      }
      return false;
    },
    destroy() {
      endSleep();
      endOpening(false);
      openBounds(false);
      portal?.destroy();
      portal = null;
      frame?.destroy();
      frame = null;
    },
  };
}
