import * as Phaser from 'phaser';
import { app, persist } from '../App';
import { DEPTH, HULL_H, HULL_W, PULSE_RADIUS, PULSE_WINDUP_MS, VIEW_W, VIEW_H, CAMERA_ZOOM } from '../constants';
import { hex, P } from '../art/palette';
import { frameRef, hasFrame } from '../art/TextureFactory';
import { themeDef } from '../art/backgrounds';
import { roomDef } from '../data/rooms';
import { NAMES } from '../data/dialogue.tr';
import { burstMode, ColorBursts } from '../fx/colorBurst';
import { CrystalWarp, StepCrystals, warpLook } from '../fx/crystalFx';
import type { WarpData } from './WarpScene';
import { memoryDef } from '../data/memories';
import type { RoomDef } from '../data/roomTypes';
import { Player } from '../entities/Player';
import { Narrative } from '../systems/NarrativeSystem';
import { CHAPTER_TITLES, chapterOf, impliedAbilities, type Quest } from '../state/GameState';
import type { FormId, RoomId } from '../state/types';
import { RoomRuntime } from '../rooms/RoomRuntime';
import { createScript } from '../rooms/scripts';
import type { ExtraInteract, RoomScript } from '../rooms/scripts/types';
import type { Interactable } from '../world/Interactable';
import { PaintingGallery } from '../world/PaintingGallery';
import { MoveSystem } from '../moves/MoveSystem';
import { FaceDialogue } from '../cinematics/FaceDialogue';
import { ROMAN } from '../../ui/Menus';
import type { AmbienceId } from '../systems/AudioSystem';

export interface WorldData {
  room: RoomId;
  checkpoint: string;
}

type ActionTarget = { kind: 'interact'; id: string; label: string; x: number; y: number } | { kind: 'move'; label: string };

const AMBIENCE: Record<string, AmbienceId> = {
  nursery: 'room',
  roots: 'cave',
  chamber: 'cave',
  surface: 'wind',
  hill: 'wind',
  forest: 'wind',
  ride: 'wind',
  sun: 'wind',
  clearing: 'river',
  dorm: 'room',
  mech: 'room',
  office: 'room',
};

export class WorldScene extends Phaser.Scene {
  data0!: WorldData;
  def!: RoomDef;
  quest!: Quest;
  room!: RoomRuntime;
  player!: Player;
  narrative!: Narrative;
  script!: RoomScript;
  paused = false;
  transitioning = false;
  private hintGlyph!: Phaser.GameObjects.Image;
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private warpBg: CrystalWarp | null = null;
  /** Colour bursts: the Rezonans moves and the bombardment that comes now and then. */
  bursts!: ColorBursts;
  private steps: StepCrystals | null = null;
  private contact: Phaser.GameObjects.Image | null = null;
  private ambient: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private target: ActionTarget | null = null;
  private pulseWind = 0;
  private camLook = 0;
  /** This room's resting camera zoom (cutscenes zoom relative to it). */
  baseZoom = 1;
  private offFocusLost: (() => void) | null = null;
  private cleanups: (() => void)[] = [];
  private camTarget = { x: 0, y: 0 };
  private camMode: 'player' | 'free' = 'player';
  /** Below this line Gorti has fallen out of the room. */
  private killY = 0;
  /** Seconds since the scene started (drives scripted clocks). */
  elapsed = 0;
  /** Read-only facts scripts publish for the e2e probe (horse, encounter). */
  probeExtra: Record<string, unknown> = {};
  /** This physics step's gameplay input (scripts that drive their own actor read it). */
  stepInput = { axis: 0, jumpPressed: false, jumpHeld: false };
  /** Self-contained things to inspect (paintings…), besides the room's interacts. */
  private features: Interactable[] = [];
  gallery: PaintingGallery | null = null;
  /** The Rezonans button's moves (flowers and birds, the earth, crystals). */
  moves!: MoveSystem;

  constructor() {
    super('world');
  }

  init(data: WorldData): void {
    this.data0 = data;
    this.features = [];
    this.paused = false;
    this.transitioning = false;
    this.target = null;
    this.cleanups = [];
    this.camMode = 'player';
    this.elapsed = 0;
    this.probeExtra = {};
  }

  /** Loads what this room needs beyond the atlases (painting artwork). */
  preload(): void {
    PaintingGallery.preload(this, this.data0.room);
  }

  /** Registers something Gorti can inspect that handles itself. */
  addFeature(f: Interactable): void {
    this.features.push(f);
  }

  /** Ids of the self-handling things in this room (paintings…). */
  get featureIds(): string[] {
    return this.features.map((f) => f.id);
  }

  create(): void {
    const quest = app.quest;
    if (!quest) {
      this.scene.start('menu');
      return;
    }
    this.quest = quest;
    this.def = roomDef(this.data0.room);
    const cp = this.def.checkpoints.find((c) => c.id === this.data0.checkpoint) ?? this.def.checkpoints[0]!;
    this.killY = this.def.killY ?? this.def.height + 90;

    this.room = new RoomRuntime(this, this.def, quest);
    this.room.build();
    if (app.settings.reducedMotion) this.room.setParallaxReduced(true);

    // Nothing is earned by tasks any more: what the story has reached by now
    // (the room and its flags) implies the abilities, so a continuous game
    // keeps its form from room to room (human after the pool in r04).
    for (const a of impliedAbilities(this.def.id, new Set(quest.progress.flags))) quest.grant(a);
    const isEntry = cp.id === this.def.checkpoints[0]!.id;
    let form: FormId = quest.progress.form;
    if (isEntry && this.def.entryForm) form = this.def.entryForm;
    if (!quest.hasAbility('form') && !this.def.entryForm) form = 'root';
    quest.setForm(form);
    const kind = this.def.player === 'horse' ? 'gorti' : this.def.player;
    this.player = new Player(this, cp.x, cp.y, kind, form);
    this.player.setFacing(cp.facing ?? 1);
    this.physics.add.collider(this.player.zone, this.room.group);

    this.narrative = new Narrative(this);

    // Feedback visuals
    const spark = frameRef('fx.spark');
    this.hintGlyph = this.add.image(0, 0, spark.atlas, spark.frame).setTint(hex(P.vein)).setDepth(DEPTH.fx).setVisible(false).setScale(0.6);
    const dot = frameRef('fx.dot');
    this.particles = this.add.particles(0, 0, dot.atlas, {
      frame: dot.frame,
      lifespan: 700,
      speed: { min: 40, max: 160 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.9, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      emitting: false,
    });
    this.particles.setDepth(DEPTH.fx);
    this.gallery = new PaintingGallery(this);
    this.moves = new MoveSystem(this);
    this.cleanups.push(() => this.moves.destroy());
    this.cleanups.push(() => {
      this.gallery?.destroy();
      this.gallery = null;
      for (const f of this.features) f.destroy();
      this.features = [];
    });
    this.bursts = new ColorBursts(
      this,
      {
        busy: () => this.transitioning || this.paused || app.input.context !== 'gameplay' || this.narrative.busy || app.ui.dialogue.isOpen,
        onStorm: () => this.onColorStorm(),
      },
      burstMode(new URLSearchParams(location.search).get('bursts')),
    );
    this.cleanups.push(() => this.bursts.destroy());
    this.buildAmbient();
    // 2.5D depth: crystal tube behind the room, crystals under each step,
    // a contact shadow that stays on the surface while Gorti is airborne.
    const look = warpLook(this.def.theme);
    // Above the parallax layers, behind everything Gorti touches.
    this.warpBg = new CrystalWarp(this, app.settings.reducedMotion ? { ...look, speed: look.speed * 0.3, alpha: look.alpha * 0.6 } : look, DEPTH.sky + 60);
    this.steps = new StepCrystals(this, look.colors);
    if (hasFrame('fx.shadow')) {
      const sh = frameRef('fx.shadow');
      this.contact = this.add.image(0, 0, sh.atlas, sh.frame).setDepth(DEPTH.player - 3).setVisible(false);
    }
    this.cleanups.push(() => {
      this.warpBg?.destroy();
      this.steps?.destroy();
      this.warpBg = null;
      this.steps = null;
      this.contact = null;
    });

    // Camera
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.def.width, this.def.height);
    this.baseZoom = this.def.zoom ?? CAMERA_ZOOM;
    cam.setZoom(this.baseZoom);
    this.camTarget = { x: this.player.x, y: this.player.zone.y };
    const followObj = this.add.zone(this.player.x, this.player.zone.y, 2, 2);
    this.camFollow = followObj;
    cam.startFollow(followObj, true, app.settings.reducedMotion ? 0.2 : 0.1, app.settings.reducedMotion ? 0.2 : 0.12);
    cam.setDeadzone(110, 80);
    cam.centerOn(this.player.x, this.player.zone.y - 60);
    cam.fadeIn(500, 15, 13, 24);

    // Fixed-step gameplay aligned with Arcade physics.
    this.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, this.fixedStep, this);

    // Input & HUD
    app.input.setContext('gameplay');
    app.ui.menus.closeAll();
    app.ui.ending.hide();
    app.ui.hud.show(true);
    app.ui.hud.onPause = () => this.openPause();
    app.ui.menus.actions = {
      newGame: () => undefined,
      continueGame: () => undefined,
      startChapter: () => undefined,
      resume: () => this.resume(),
      quitToMenu: () => this.quitToMenu(),
    };
    this.offFocusLost = app.input.onFocusLost(() => {
      if (!this.paused && !this.transitioning) this.openPause();
    });

    app.audio.music(this.def.music);
    app.audio.setAmbience(AMBIENCE[this.def.theme] ?? 'none');

    this.events.on('player-land', (x: number, y: number, v: number) => {
      if (v > 500) this.shake(0.003, 90);
      this.dust(x, y, 6);
      if (v > 260) this.steps?.land(x, y, Math.min(1, (v - 260) / 600));
    });
    this.events.on('player-jump', (x: number, y: number) => {
      this.dust(x, y, 4);
      this.steps?.step(x, y);
    });
    this.events.on('player-step', (x: number, y: number) => {
      if (Math.random() < 0.35) this.dust(x, y, 2);
      this.steps?.step(x, y);
      if (Math.random() < 0.4) app.audio.sfx('sprout', { vol: 0.6 });
    });

    this.script = createScript(this.def.id, this);
    this.script.setup();
    this.room.refresh(false);

    // First visit of a chapter's opening room shows the chapter card.
    if (isEntry && this.def.checkpoints[0]!.id === cp.id) {
      const ch = chapterOf(this.def.id);
      const firstRoomOfChapter = ['r01', 'r04', 'r07', 'r09', 'r12'].includes(this.def.id);
      if (firstRoomOfChapter && quest.set(`chapterCard:${ch}`)) {
        app.ui.hud.areaTitle(`BÖLÜM ${ROMAN[ch]}`, CHAPTER_TITLES[ch]!, 3600);
      }
    }
    // Entering a room persists the entry checkpoint.
    this.activateCheckpoint(cp.id, true);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanup());
  }

  private camFollow!: Phaser.GameObjects.Zone;

  // ------------------------------------------------------------ fixed step

  private fixedStep(dtIn: number): void {
    if (this.paused || this.transitioning) return;
    const dt = Math.min(dtIn, 1 / 30);
    this.elapsed += dt;
    const i = app.input;
    const gameplay = i.context === 'gameplay';
    const p = this.player;
    const axis = gameplay ? i.axisX() : 0;
    const jumpPressed = gameplay && i.consume('jump');
    const jumpHeld = gameplay && i.held('jump');

    this.stepInput = { axis, jumpPressed, jumpHeld };
    if (p.state !== 'hidden') p.fixed(dt, this.stepInput);

    // Contextual actions
    if (gameplay && p.controllable) {
      this.target = this.resolveTarget();
      if (i.consume('action')) this.doAction();
      this.glance();
    } else if (!gameplay) this.target = null;
    if (this.pulseWind > 0) {
      this.pulseWind -= dt * 1000;
      if (this.pulseWind <= 0) this.firePulse();
    }

    if (p.state !== 'hidden') this.checkWorld();
    this.script.onFixed?.(dt);
  }

  private checkWorld(): void {
    const p = this.player;
    const box = { x: p.x - HULL_W / 2, y: p.feetY - HULL_H, w: HULL_W, h: HULL_H };
    // Falling out of the room: back to the last checkpoint (costs nothing).
    if (p.feetY > this.killY && p.state !== 'reform') this.reform();
    // Checkpoints
    for (const c of this.room.checkpoints) {
      if (Math.abs(p.x - c.def.x) < 70 && Math.abs(p.feetY - c.def.y) < 60 && p.onGround) this.activateCheckpoint(c.def.id);
    }
    // Memories
    for (const m of this.room.memories) {
      if (m.taken) continue;
      if (Math.abs(p.x - m.def.x) < 34 && p.feetY > m.def.y - 90 && p.feetY < m.def.y + 20) this.collectMemory(m.def.id);
    }
    // Triggers
    for (const t of this.room.triggers) {
      if (t.fired || !t.active) continue;
      const d = t.def;
      if (box.x < d.x + d.w && box.x + box.w > d.x && box.y < d.y + d.h && box.y + box.h > d.y) {
        t.fired = true;
        this.script.onTrigger?.(d.id);
      }
    }
    // Exits
    for (const e of this.room.exits) {
      if (!e.active) continue;
      const d = e.def;
      if (box.x < d.x + d.w && box.x + box.w > d.x && box.y < d.y + d.h && box.y + box.h > d.y) {
        this.goToRoom(d.to);
        return;
      }
    }
  }

  // ------------------------------------------------------------ actions

  private interactList(): ExtraInteract[] {
    const out: ExtraInteract[] = [];
    for (const it of this.room.interacts) if (it.active) out.push({ id: it.def.id, x: it.def.x, y: it.def.y, r: it.def.r ?? 70, prompt: it.def.prompt });
    for (const f of this.features) if (f.isActive()) out.push({ id: f.id, x: f.x, y: f.y, r: f.r, prompt: f.prompt });
    if (this.script.extraInteracts) out.push(...this.script.extraInteracts());
    return out;
  }

  /** Gorti glances at a memory or an inspectable thing just ahead. */
  private glance(): void {
    const p = this.player;
    const eyeX = p.x;
    const eyeY = p.feetY - 110;
    const spots: { x: number; y: number }[] = [];
    for (const m of this.room.memories) if (m.active && !m.taken) spots.push({ x: m.def.x, y: m.def.y - 34 });
    for (const it of this.room.interacts) if (it.active) spots.push({ x: it.def.x, y: it.def.y - 30 });
    for (const f of this.features) if (f.isActive()) spots.push(f.lookAt ?? { x: f.x, y: f.y - 30 });
    let best: { x: number; y: number } | null = null;
    let bestD = 280;
    for (const s of spots) {
      const ahead = (s.x - eyeX) * p.facing;
      const d = Math.hypot(s.x - eyeX, s.y - eyeY);
      if (ahead > 20 && d < bestD) {
        best = s;
        bestD = d;
      }
    }
    if (best) p.lookFor(Math.max(-0.45, Math.min(0.35, Math.atan2(best.y - eyeY, Math.abs(best.x - eyeX)))), 200);
  }

  private resolveTarget(): ActionTarget | null {
    const p = this.player;
    // 1) Interaction prompts
    let best: ExtraInteract | null = null;
    let bestD = Infinity;
    for (const it of this.interactList()) {
      const d = Math.hypot(p.x - it.x, p.feetY - it.y);
      if (d <= it.r && d < bestD) {
        best = it;
        bestD = d;
      }
    }
    if (best) return { kind: 'interact', id: best.id, label: best.prompt, x: best.x, y: best.y };
    // 2) Nothing to look at: the Rezonans move.
    return { kind: 'move', label: 'Rezonans' };
  }

  private doAction(): void {
    const t = this.target;
    const p = this.player;
    if (!t) return;
    if (t.kind === 'interact') {
      p.interactT = 0.35;
      p.setFacing(t.x >= p.x ? 1 : -1);
      p.body.setVelocityX(0);
      const feature = this.features.find((f) => f.id === t.id);
      if (feature) feature.interact(this);
      else if (!this.script.onInteract?.(t.id)) this.defaultInteract(t.id);
      return;
    }
    if (this.moves.ready && this.pulseWind <= 0) {
      this.pulseWind = PULSE_WINDUP_MS;
      p.interactT = 0.25;
    }
  }

  /** Rezonans: the move that fits Gorti's form and the story so far. */
  private firePulse(): void {
    this.moves.use();
    const c = this.player.chest();
    this.script.onPulse?.(c.x, c.y, PULSE_RADIUS);
  }

  private defaultInteract(id: string): void {
    void id;
  }

  /** Voluntary or scripted form change with a short transformation state. */
  transform(to: FormId, onDone?: () => void): void {
    const p = this.player;
    if (p.kind !== 'gorti' || p.state === 'transform') return;
    p.state = 'transform';
    p.body.setVelocity(0, 0);
    app.audio.sfx('transform');
    this.burst(p.x, p.feetY - 50, hex(P.vein), 24);
    this.time.delayedCall(380, () => {
      // Same navigation hull for both forms: validate clearance anyway.
      p.setForm(to);
      this.quest.setForm(to);
      this.flash(0xd7b3ff, 0.25);
    });
    this.time.delayedCall(680, () => {
      if (p.state === 'transform') p.state = 'normal';
      onDone?.();
    });
  }

  // ------------------------------------------------------------ progression

  activateCheckpoint(id: string, silent = false): void {
    const changed = this.quest.setCheckpoint(this.def.id, id);
    this.quest.set(`cp:${id}`);
    this.room.lightCheckpoint(id);
    if (changed) {
      if (!silent && !this.def.checkpoints.find((c) => c.id === id)?.silent) {
        app.audio.sfx('checkpoint');
        app.ui.hud.toast('Kontrol noktası');
        this.player.emote('relief', 1200);
      }
    }
    persist();
  }

  collectMemory(id: string): void {
    const def = memoryDef(id);
    this.room.takeMemory(id);
    if (!def) return;
    if (this.quest.collectMemory(id)) {
      app.audio.sfx('pickup');
      this.player.emote('surprise', 1400);
      app.ui.hud.toast(`Anı bulundu: ${def.title}  (M: Anılar)`, 4200);
      persist();
    }
  }

  /** Sets a flag, refreshes gated elements and saves. Returns true the first time. */
  flag(f: string, animate = true): boolean {
    const first = this.quest.set(f);
    if (first) {
      this.room.refresh(animate);
      persist();
    }
    return first;
  }

  /** Reforms Gorti at the current checkpoint after a fall. */
  reform(): void {
    const p = this.player;
    if (p.state === 'reform') return;
    p.state = 'reform';
    p.body.setVelocity(0, 0);
    p.body.setAllowGravity(false);
    const cam = this.cameras.main;
    this.time.delayedCall(150, () => {
      cam.fadeOut(260, 15, 13, 24);
      cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        const cp = this.def.checkpoints.find((c) => c.id === this.quest.progress.checkpoint) ?? this.def.checkpoints[0]!;
        p.body.setAllowGravity(true);
        p.body.checkCollision.none = false;
        p.teleport(cp.x, cp.y, cp.facing ?? 1);
        p.focus.refill();
        p.state = 'normal';
        this.script.onRespawn?.();
        this.camFollow.setPosition(p.x, p.zone.y);
        cam.centerOn(p.x, p.zone.y - 60);
        cam.fadeIn(360, 15, 13, 24);
      });
    });
  }

  goToRoom(to: RoomId): void {
    if (this.transitioning) return;
    this.transitioning = true;
    const next = roomDef(to);
    this.quest.setCheckpoint(to, next.checkpoints[0]!.id);
    persist();
    app.input.freeze();
    // Crystal tunnel between rooms; a full, dense one between chapters.
    const chapter = next.chapter !== this.def.chapter;
    this.scene.launch('warp', {
      strength: chapter ? 1 : 0.45,
      look: warpLook(next.theme),
      onPeak: () => this.scene.restart({ room: to, checkpoint: next.checkpoints[0]!.id } satisfies WorldData),
    } satisfies WarpData);
  }

  // ------------------------------------------------------------ pause

  openPause(): void {
    if (this.paused || this.transitioning) return;
    if (app.ui.doc.isOpen) return;
    this.paused = true;
    this.physics.world.pause();
    this.time.paused = true;
    this.tweens.pauseAll();
    app.ui.colorStorm.setPaused(true);
    this.bursts.setPaused(true);
    app.audio.duck(true);
    app.ui.menus.showPause();
  }

  resume(): void {
    if (!this.paused) return;
    app.ui.menus.closeAll();
    this.paused = false;
    this.physics.world.resume();
    this.time.paused = false;
    this.tweens.resumeAll();
    app.ui.colorStorm.setPaused(false);
    this.bursts.setPaused(false);
    app.audio.duck(false);
    app.input.freeze();
  }

  quitToMenu(): void {
    this.paused = false;
    this.physics.world.resume();
    this.time.paused = false;
    this.tweens.resumeAll();
    app.audio.duck(false);
    persist();
    app.ui.menus.closeAll();
    this.scene.start('menu');
  }

  // ------------------------------------------------------------ frame update

  override update(time: number, delta: number): void {
    if (!this.player) return;
    const dt = Math.min(delta, 50);
    const i = app.input;
    if (!this.paused && !this.transitioning) {
      const ctx = i.context;
      if ((ctx === 'gameplay' || ctx === 'dialogue' || ctx === 'cutscene') && !this.script.capturesPause?.() && i.consume('pause')) {
        this.openPause();
      } else if (ctx === 'gameplay' && i.consume('journal')) {
        this.openPause();
        app.ui.menus.showJournal(() => this.resume());
      }
    }
    if (this.paused) return;
    // Gorti's brows talk along with his lines; listening, they react less.
    const dlg = app.ui.dialogue;
    if (dlg.isOpen) this.player.emote(dlg.speaker === NAMES.gorti ? (dlg.typing ? 'talk' : 'worry') : 'listen', 260);
    this.player.visual(dt);
    this.room.animateMarkers(time);
    this.narrative.tick(dt);
    this.script.onUpdate?.(dt, time);
    this.updateCamera(dt);
    this.room.stream(this.cameras.main.scrollX);
    this.warpBg?.update(dt);
    this.bursts.update(dt);
    this.gallery?.update(dt);
    this.moves.update(dt);
    this.updateContactShadow();
    this.updateHud(time);
  }

  /** Soft shadow on the surface below Gorti, shrinking with height. */
  private updateContactShadow(): void {
    const sh = this.contact;
    if (!sh) return;
    const p = this.player;
    if (p.state === 'hidden' || !p.rig.container.visible) {
      sh.setVisible(false);
      return;
    }
    const ground = this.room.groundBelow(p.x, p.feetY);
    if (ground === null) {
      sh.setVisible(false);
      return;
    }
    const hgt = Math.max(0, ground - p.feetY);
    const k = Math.max(0, 1 - hgt / 320);
    sh.setVisible(k > 0.02).setPosition(p.x, ground + 1).setScale(0.62 * (0.55 + 0.45 * k), 0.62 * (0.55 + 0.45 * k)).setAlpha(0.85 * k);
  }

  private updateCamera(dt: number): void {
    const p = this.player;
    if (this.camMode === 'player' && p.state !== 'hidden') {
      const want = p.facing * (app.settings.reducedMotion ? 40 : 90);
      this.camLook += (want - this.camLook) * Math.min(1, dt / 600);
      this.camFollow.setPosition(p.x + this.camLook, p.zone.y - 40);
    } else {
      this.camFollow.setPosition(this.camTarget.x, this.camTarget.y);
    }
  }

  /** Scripted camera focus (cutscenes); `null` returns control to the player. */
  camTo(x: number | null, y = 0): void {
    if (x === null) {
      this.camMode = 'player';
      return;
    }
    this.camMode = 'free';
    this.camTarget.x = x;
    this.camTarget.y = y;
  }

  get camFree(): { x: number; y: number } {
    return this.camTarget;
  }

  private updateHud(time: number): void {
    const p = this.player;
    const hud = app.ui.hud;
    const prompts: { key: string; label: string }[] = [];
    const t = this.target;
    const gameplay = app.input.context === 'gameplay';
    let actionLabel = '';
    this.hintGlyph.setVisible(false);
    if (gameplay && t && p.controllable) {
      actionLabel = t.label;
      if (t.kind === 'interact') {
        prompts.push({ key: 'E', label: t.label });
        this.hintGlyph.setVisible(true).setPosition(t.x, t.y - 95 + Math.sin(time / 240) * 4).setRotation(time / 900);
      }
    }
    hud.setPrompts(prompts);
    app.ui.touch.setAvail({ focus: false, form: false, song: false, actionLabel, jump: p.canJump });
  }

  // ------------------------------------------------------------ fx helpers

  /** Gorti's reaction to a colour bombardment: startled, then delighted. */
  private onColorStorm(): void {
    const p = this.player;
    p.emote('surprise', 700);
    p.lookFor(-0.3, 3000);
    this.time.delayedCall(650, () => {
      p.emote('joy', 2200);
      p.dance(2600);
    });
  }

  burst(x: number, y: number, color: number, n: number): void {
    this.particles.setParticleTint(color);
    this.particles.emitParticleAt(x, y, n);
  }

  /** A crown of crystals out of the ground (landings, stomps). */
  crystalCrown(x: number, y: number, strength: number): void {
    this.steps?.land(x, y, strength);
  }

  dust(x: number, y: number, n: number): void {
    const theme = this.def.theme;
    const col = theme === 'office' ? 0xb8ab92 : theme === 'mech' ? 0x727a8c : 0x8a7f99;
    this.particles.setParticleTint(col);
    this.particles.emitParticleAt(x, y - 4, n);
  }

  shake(intensity: number, ms: number): void {
    if (!app.settings.screenShake || app.settings.reducedMotion) return;
    this.cameras.main.shake(ms, intensity);
  }

  flash(color: number, alpha: number): void {
    const f = frameRef('fx.white');
    const r = this.add.image(VIEW_W / 2, VIEW_H / 2, f.atlas, f.frame).setScrollFactor(0).setDisplaySize(VIEW_W * 1.5, VIEW_H * 1.5).setTint(color).setAlpha(alpha).setDepth(DEPTH.overlay);
    this.tweens.add({ targets: r, alpha: 0, duration: app.settings.reducedMotion ? 200 : 500, onComplete: () => r.destroy() });
  }

  stepSound(): 'step' | 'stepWood' | 'stepMetal' {
    const t = this.def.theme;
    if (t === 'nursery' || t === 'dorm' || t === 'office') return 'stepWood';
    if (t === 'mech') return 'stepMetal';
    return 'step';
  }

  private buildAmbient(): void {
    const kind = themeDef(this.def.theme).ambient;
    if (kind === 'none' || !hasFrame('fx.dot')) return;
    const mobile = app.ui.touch.enabled;
    const cap = mobile ? 50 : 120;
    const key = kind === 'petals' ? 'fx.petal' : kind === 'wind' ? 'fx.streak' : kind === 'drips' ? 'fx.drop' : 'fx.dot';
    const f = frameRef(key);
    const tint = kind === 'embers' ? 0xf0b458 : kind === 'petals' ? 0xe8dcca : kind === 'sparkle' ? 0x9fe3d8 : kind === 'wind' ? 0xc7ccde : 0xd7b3ff;
    const cfg: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
      frame: f.frame,
      x: { min: 0, max: VIEW_W },
      y: { min: -20, max: VIEW_H },
      lifespan: kind === 'wind' ? 1600 : 6000,
      speedX: kind === 'wind' ? { min: 220, max: 380 } : { min: -12, max: 22 },
      speedY: kind === 'drips' ? { min: 160, max: 240 } : kind === 'petals' ? { min: 10, max: 40 } : { min: -18, max: 12 },
      scale: kind === 'wind' ? { min: 0.6, max: 1.4 } : { min: 0.15, max: 0.4 },
      alpha: { start: 0, end: 0, ease: (v: number) => Math.sin(v * Math.PI) * 0.6 } as unknown as Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType,
      rotate: kind === 'petals' ? { min: 0, max: 360 } : 0,
      tint,
      frequency: kind === 'wind' ? 140 : 180,
      quantity: 1,
      maxAliveParticles: Math.floor(cap / (kind === 'wind' ? 3 : 1)),
      blendMode: kind === 'petals' ? Phaser.BlendModes.NORMAL : Phaser.BlendModes.ADD,
    };
    if (app.settings.reducedMotion) cfg.frequency = 400;
    this.ambient = this.add.particles(0, 0, f.atlas, cfg);
    this.ambient.setScrollFactor(0.3);
    this.ambient.setDepth(DEPTH.front);
  }

  private cleanup(): void {
    // The physics plugin may already have torn its world down on shutdown.
    this.physics?.world?.off(Phaser.Physics.Arcade.Events.WORLD_STEP, this.fixedStep, this);
    this.offFocusLost?.();
    this.offFocusLost = null;
    try {
      this.narrative?.destroy();
    } catch {
      /* tweens/timers already gone with the scene */
    }
    this.script?.destroy?.();
    for (const c of this.cleanups) {
      try {
        c();
      } catch (e) {
        console.warn('cleanup step failed', e);
      }
    }
    this.cleanups = [];
    this.room?.destroy();
    app.input.releaseAll();
    app.ui.doc.close();
    FaceDialogue.end(this);
    if (app.ui.dialogue.isOpen) app.ui.dialogue.finish();
    app.ui.hud.setSkip(null);
    app.ui.hud.clearCaption();
    this.events.off('player-land');
    this.events.off('player-jump');
    this.events.off('player-step');
  }

  /** Scripts register teardown work here. */
  onCleanup(fn: () => void): void {
    this.cleanups.push(fn);
  }
}
