import * as Phaser from 'phaser';
import { app, persist } from '../App';
import { enterFullscreen } from '../../ui/fullscreen';
import { warpLook } from '../fx/crystalFx';
import type { WarpData } from './WarpScene';
import { DEPTH, VIEW_H, VIEW_W } from '../constants';
import { hex, P } from '../art/palette';
import { addStaticCanvas, artCanvas, frameRef, hasFrame } from '../art/TextureFactory';
import { themeDef } from '../art/backgrounds';
import { Rng } from '../art/svg';
import { RIG_GORTI_ROOT } from '../art/characters/gorti';
import { humanoidPose } from '../entities/animPoses';
import { RigView } from '../entities/RigView';
import { chapterStartProgress, newProgress, normalizeProgress, Quest, startProgressAt } from '../state/GameState';
import { isRoomId } from '../state/types';
import { roomDef } from '../data/rooms';
import type { Progress } from '../state/types';
import type { WorldData } from './WorldScene';

/** Title screen: an animated crystal chamber behind the DOM main menu. */
export class MenuScene extends Phaser.Scene {
  private rig: RigView | null = null;

  constructor() {
    super('menu');
  }

  create(): void {
    const theme = themeDef('chamber');
    this.cameras.main.setBackgroundColor(theme.sky[1]);
    // Background layer (drawn once).
    const [c, ctx] = artCanvas(VIEW_W / 2, VIEW_H / 2);
    ctx.scale(0.5, 0.5);
    theme.layers[0]!.draw(ctx, { w: VIEW_W, h: VIEW_H, horizon: VIEW_H * 0.6 }, new Rng(14));
    theme.layers[1]!.draw(ctx, { w: VIEW_W, h: VIEW_H, horizon: VIEW_H * 0.6 }, new Rng(382));
    if (this.textures.exists('menu-bg')) this.textures.remove('menu-bg');
    addStaticCanvas(this.textures, 'menu-bg', c);
    this.add.image(0, 0, 'menu-bg').setOrigin(0).setScale(2).setDepth(DEPTH.sky);
    const addProp = (key: string, x: number, y: number, s = 1, depth: number = DEPTH.props): void => {
      if (!hasFrame(key)) return;
      const f = frameRef(key);
      this.add.image(x, y, f.atlas, f.frame).setOrigin(f.px / f.w, f.py / f.h).setScale(s / f.scale).setDepth(depth);
    };
    addProp('prop.crystaltree', 1020, 760, 0.85, DEPTH.backProps);
    addProp('prop.crystals.teal', 180, 700, 1.2);
    addProp('prop.crystals.blue', 1180, 700, 0.9);
    // Ground strip
    const g = this.add.graphics().setDepth(DEPTH.terrain);
    g.fillStyle(hex('#2a2640'));
    g.fillRect(0, 690, VIEW_W, 40);
    g.lineStyle(4, hex(P.ink));
    g.lineBetween(0, 690, VIEW_W, 690);
    this.rig = new RigView(this, RIG_GORTI_ROOT, (a, t, p) => humanoidPose('gorti.root', a, t, p), 330, 690, DEPTH.player);
    this.rig.scale = 1.6;
    this.rig.play('idle');
    const dot = frameRef('fx.dot');
    this.add
      .particles(0, 0, dot.atlas, {
        frame: dot.frame,
        x: { min: 0, max: VIEW_W },
        y: { min: 0, max: VIEW_H },
        lifespan: 7000,
        speedY: { min: -14, max: -4 },
        speedX: { min: -6, max: 6 },
        scale: { min: 0.1, max: 0.35 },
        alpha: { start: 0, end: 0, ease: (v: number) => Math.sin(v * Math.PI) * 0.7 } as unknown as Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType,
        tint: [hex(P.vein), hex(P.crystalTealLight), hex(P.crystalOrangeLight)],
        frequency: 240,
        blendMode: Phaser.BlendModes.ADD,
      })
      .setDepth(DEPTH.fx);
    this.cameras.main.fadeIn(600, 15, 13, 24);

    app.input.setContext('menu');
    app.ui.hud.show(false);
    app.ui.ending.hide();
    const notice =
      app.saveStatus === 'unavailable'
        ? 'Bu oturumda kayıt kullanılamıyor'
        : app.saveStatus === 'corrupt'
          ? 'Kayıt okunamadı; yeni bir oyun başlatabilirsiniz.'
          : '';
    app.ui.menus.setNotice(notice);
    app.ui.menus.actions = {
      newGame: () => this.start(newProgress()),
      continueGame: () => {
        if (app.progress) this.start(app.progress);
      },
      startChapter: (ch) => this.start(chapterStartProgress(ch)),
      resume: () => undefined,
      quitToMenu: () => undefined,
      objectiveText: () => '',
    };
    app.ui.menus.showMain();
    app.audio.music('menu');
    if (import.meta.env.DEV || __E2E__) {
      // Development/test-only room jump: ?room=r05&cp=r05_gate&flags=a,b (absent from builds).
      const q = new URLSearchParams(location.search);
      const room = q.get('room');
      if (room && isRoomId(room)) {
        const base = startProgressAt(room);
        const p = normalizeProgress({ ...base, checkpoint: q.get('cp') ?? base.checkpoint, flags: (q.get('flags') ?? '').split(',').filter(Boolean), form: q.get('form') ?? base.form });
        if (p) this.time.delayedCall(50, () => this.start(p));
      }
    }
    app.audio.setAmbience('none');
  }

  private start(progress: Progress): void {
    // Phones and tablets: go fullscreen/landscape on the starting tap.
    if (app.ui.touch.enabled) void enterFullscreen();
    app.audio.unlock();
    app.audio.sfx('ui');
    app.quest = new Quest(progress, app.profile);
    app.saveStatus = 'ok';
    persist();
    app.ui.menus.closeAll();
    const def = roomDef(progress.room);
    const cp = def.checkpoints.find((c) => c.id === progress.checkpoint) ?? def.checkpoints[0]!;
    // Into the world through the crystal tunnel.
    this.scene.launch('warp', {
      strength: 1,
      look: warpLook(def.theme),
      onPeak: () => this.scene.start('world', { room: progress.room, checkpoint: cp.id } satisfies WorldData),
    } satisfies WarpData);
  }

  override update(_t: number, dt: number): void {
    this.rig?.update(dt);
  }
}
