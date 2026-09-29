import * as Phaser from 'phaser';
import { app, persist } from '../App';
import { DEPTH, HULL_H, HULL_W, PULSE_RADIUS, PULSE_COOLDOWN_MS, PULSE_WINDUP_MS, HINT_DELAY_MS, VIEW_W, VIEW_H, CAMERA_ZOOM } from '../constants';
import { hex, P } from '../art/palette';
import { frameRef, hasFrame } from '../art/TextureFactory';
import { themeDef } from '../art/backgrounds';
import { roomDef } from '../data/rooms';
import { OBJECTIVES } from '../data/objectives.tr';
import { NAMES } from '../data/dialogue.tr';
import { CrystalWarp, StepCrystals, warpLook } from '../fx/crystalFx';
import type { WarpData } from './WarpScene';
import { memoryDef } from '../data/memories';
import type { RoomDef } from '../data/roomTypes';
import { Player } from '../entities/Player';
import { Hazards } from '../entities/CrystalHazard';
import { pickReachTarget } from '../systems/AbilitySystem';
import { Narrative } from '../systems/NarrativeSystem';
import { CHAPTER_TITLES, chapterOf, type Quest } from '../state/GameState';
import type { FormId, Note, RoomId } from '../state/types';
import { RoomRuntime } from '../rooms/RoomRuntime';
import { createScript } from '../rooms/scripts';
import type { ExtraInteract, RoomScript } from '../rooms/scripts/types';
import { ROMAN } from '../../ui/Menus';
import type { AmbienceId } from '../systems/AudioSystem';

export interface WorldData {
  room: RoomId;
  checkpoint: string;
}

type ActionTarget =
  | { kind: 'interact'; id: string; label: string; x: number; y: number }
  | { kind: 'anchor'; id: string; label: string; x: number; y: number; land: { x: number; y: number } }
  | { kind: 'pulse'; label: string };

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
  hazards!: Hazards;
  narrative!: Narrative;
  script!: RoomScript;
  paused = false;
  transitioning = false;
  private objectiveKey = '';
  private lastProgress = 0;
  /** One clock for the hint timer (the scene clock re-bases after create). */
  private get progressClock(): number {
    return this.game.loop.time;
  }
  private reachGfx!: Phaser.GameObjects.Graphics;
  private hintGlyph!: Phaser.GameObjects.Image;
  private focusVignette!: Phaser.GameObjects.Image;
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private warpBg: CrystalWarp | null = null;
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
  /** Extra per-room overlap zones scripts can register (hazard-like). */
  private killY = 0;
  /** Seconds since the scene started (drives scripted clocks). */
  elapsed = 0;
  /** Read-only facts scripts publish for the e2e probe (horse, encounter). */
  probeExtra: Record<string, unknown> = {};
  /** This physics step's gameplay input (scripts that drive their own actor read it). */
  stepInput = { axis: 0, jumpPressed: false, jumpHeld: false };

  constructor() {
    super('world');
  }

  init(data: WorldData): void {
    this.data0 = data;
    this.paused = false;
    this.transitioning = false;
    this.target = null;
    this.cleanups = [];
    this.camMode = 'player';
    this.elapsed = 0;
    this.probeExtra = {};
  }

  get assist(): boolean {
    return app.settings.storyAssist;
  }

  /** Hazard/encounter time scale (story assist slows encounters). */
  get encounterScale(): number {
    return this.assist ? 0.75 : 1;
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

    const isEntry = cp.id === this.def.checkpoints[0]!.id;
    let form: FormId = quest.progress.form;
    if (isEntry && this.def.entryForm) form = this.def.entryForm;
    if (!quest.hasAbility('form') && !this.def.entryForm) form = 'root';
    quest.setForm(form);
    const kind = this.def.player === 'horse' ? 'gorti' : this.def.player;
    this.player = new Player(this, cp.x, cp.y, kind, form);
    this.player.setFacing(cp.facing ?? 1);
    this.physics.add.collider(this.player.zone, this.room.group);

    this.hazards = new Hazards(this, this.def.hazards ?? [], (g) => this.room.isOn(g));
    this.narrative = new Narrative(this);

    // Feedback visuals
    this.reachGfx = this.add.graphics().setDepth(DEPTH.fx);
    const spark = frameRef('fx.spark');
    this.hintGlyph = this.add.image(0, 0, spark.atlas, spark.frame).setTint(hex(P.vein)).setDepth(DEPTH.fx).setVisible(false).setScale(0.6);
    const vig = frameRef('fx.vignette');
    this.focusVignette = this.add.image(VIEW_W / 2, VIEW_H / 2, vig.atlas, vig.frame).setScrollFactor(0).setDisplaySize(VIEW_W * 1.3, VIEW_H * 1.3).setDepth(DEPTH.overlay).setAlpha(0).setTint(0x6d3fa6);
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
    this.buildAmbient();
    // 2.5D depth: crystal tube behind the room, crystals under each step,
    // a contact shadow that stays on the surface while Gorti is airborne.
    const look = warpLook(this.def.theme);
    this.warpBg = new CrystalWarp(this, app.settings.reducedMotion ? { ...look, speed: look.speed * 0.3, alpha: look.alpha * 0.6 } : look, DEPTH.sky + 5);
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
    app.ui.hud.onHint = (text) => {
      app.ui.hud.caption(text, 8000);
      app.audio.sfx('ui');
    };
    app.ui.menus.actions = {
      newGame: () => undefined,
      continueGame: () => undefined,
      startChapter: () => undefined,
      resume: () => this.resume(),
      quitToMenu: () => this.quitToMenu(),
      objectiveText: () => OBJECTIVES[this.objectiveKey]?.text ?? '',
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
    this.events.on('player-step', (x: number, y: number) => {
      if (Math.random() < 0.35) this.dust(x, y, 2);
      this.steps?.step(x, y);
      if (Math.random() < 0.4) app.audio.sfx('sprout', { vol: 0.6 });
    });

    this.script = createScript(this.def.id, this);
    this.setObjective(this.def.objective, false);
    this.script.setup();
    this.room.refresh(false);
    this.hazards.refresh();
    this.lastProgress = this.progressClock;
    const offQuest = quest.onChange((kind) => {
      if (kind === 'flag' || kind === 'memory') this.lastProgress = this.progressClock;
    });
    this.cleanups.push(() => offQuest());

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

    // Focus (breath)
    const hasFocus = this.quest.hasAbility('focus') || p.kind === 'mech' || p.kind === 'coward';
    const focusEnabled = hasFocus && (p.state === 'normal' || p.state === 'locked' || p.state === 'hidden') && gameplay;
    let want = false;
    if (app.settings.focusToggle) {
      if (gameplay && i.consume('focus')) p.focus.latched = !p.focus.latched;
      want = p.focus.latched;
    } else want = gameplay && i.held('focus');
    const fev = p.focus.step(dt, want, focusEnabled, this.assist);
    if (fev === 'start') {
      app.audio.sfx('focusIn');
      this.script.onFocusChange?.(true);
    } else if (fev === 'stop') {
      app.audio.sfx('focusOut');
      this.script.onFocusChange?.(false);
    }
    this.room.updateLatent(dt, p.focus.active);

    this.stepInput = { axis, jumpPressed, jumpHeld };
    if (p.state !== 'hidden') p.fixed(dt, this.stepInput);

    // Contextual actions
    if (gameplay && p.controllable) {
      this.target = this.resolveTarget();
      if (i.consume('action')) this.doAction();
      if (i.consume('song')) this.trySong();
      if (i.consume('form')) this.tryForm();
    } else if (!gameplay) this.target = null;
    if (this.pulseWind > 0) {
      this.pulseWind -= dt * 1000;
      if (this.pulseWind <= 0) this.firePulse();
    }

    if (p.state !== 'hidden') this.checkWorld(dt);
    this.script.onFixed?.(dt);
  }

  private checkWorld(dt: number): void {
    const p = this.player;
    const box = { x: p.x - HULL_W / 2, y: p.feetY - HULL_H, w: HULL_W, h: HULL_H };
    // Hazards
    const hit = this.hazards.fixed(dt, box, this.encounterScale);
    if (hit) this.damage(hit.fromX);
    // Kill plane
    if (p.feetY > this.killY && p.state !== 'reform') this.reform(false);
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
    if (this.script.extraInteracts) out.push(...this.script.extraInteracts());
    return out;
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
    // 2) Root anchors
    if (p.kind === 'gorti' && p.form === 'root' && this.quest.hasAbility('reach')) {
      const cands = this.room.anchors.filter((a) => a.active).map((a) => ({ id: a.def.id, x: a.def.x, y: a.def.y }));
      const t = pickReachTarget(p.chest(), p.facing, cands, this.room.blockerRects());
      if (t) {
        const a = this.room.anchors.find((x) => x.def.id === t.id)!;
        return { kind: 'anchor', id: t.id, label: 'Köke uzan', x: t.x, y: t.y, land: a.def.land };
      }
    }
    // 3) Resonance pulse
    if (this.quest.hasAbility('pulse') && p.kind === 'gorti') return { kind: 'pulse', label: 'Rezonans' };
    return null;
  }

  private doAction(): void {
    const t = this.target;
    const p = this.player;
    if (!t) return;
    if (t.kind === 'interact') {
      p.interactT = 0.35;
      p.setFacing(t.x >= p.x ? 1 : -1);
      p.body.setVelocityX(0);
      if (!this.script.onInteract?.(t.id)) this.defaultInteract(t.id);
      return;
    }
    if (t.kind === 'anchor') {
      p.startReach({
        anchor: { x: t.x, y: t.y },
        land: t.land,
        onDone: () => this.events.emit('reach-done', t.id),
      });
      return;
    }
    if (p.pulseCd <= 0 && this.pulseWind <= 0) {
      this.pulseWind = PULSE_WINDUP_MS;
      p.pulseCd = PULSE_COOLDOWN_MS;
      p.interactT = 0.25;
    }
  }

  private firePulse(): void {
    const p = this.player;
    const c = p.chest();
    app.audio.sfx('pulse');
    const ring = frameRef('fx.ring');
    const img = this.add.image(c.x, c.y, ring.atlas, ring.frame).setTint(hex(P.vein)).setBlendMode(Phaser.BlendModes.ADD).setDepth(DEPTH.fx).setScale(0.2).setAlpha(0.9);
    this.tweens.add({ targets: img, scale: (PULSE_RADIUS * 2) / 128, alpha: 0, duration: 380, ease: 'Cubic.easeOut', onComplete: () => img.destroy() });
    const n = this.hazards.pulse(c.x, c.y, PULSE_RADIUS);
    const handled = this.script.onPulse?.(c.x, c.y, PULSE_RADIUS) ?? false;
    if (n > 0 || handled) this.lastProgress = this.progressClock;
  }

  private defaultInteract(id: string): void {
    void id;
  }

  private nearNode(): { id: string; pattern: Note[]; x: number } | null {
    const p = this.player;
    if (!this.quest.hasAbility('song') && !this.def.songNodes?.length) return null;
    for (const n of this.room.nodes) {
      if (!n.active) continue;
      if (Math.abs(p.x - n.def.x) < 110 && Math.abs(p.feetY - n.def.y) < 80) return { id: n.def.id, pattern: n.def.pattern, x: n.def.x };
    }
    return null;
  }

  private trySong(): void {
    const node = this.nearNode();
    if (!node || !this.player.onGround) return;
    if (!this.quest.hasAbility('song')) this.quest.grant('song');
    this.openSong(node.id, node.pattern);
  }

  openSong(nodeId: string, pattern: Note[]): void {
    const p = this.player;
    p.state = 'song';
    p.body.setVelocityX(0);
    p.setFacing(1);
    app.ui.song
      .open(pattern, {
        title: 'Ulu Balina Dili',
        assist: this.assist,
        onNote: (n, demo) => {
          this.noteFx(n, demo);
          this.script.onSongNote?.(nodeId, n, demo);
        },
      })
      .then((r) => {
        if (p.state === 'song') p.state = 'normal';
        if (r === 'done') {
          this.lastProgress = this.progressClock;
          p.emote('joy', 1600);
          this.script.onSong?.(nodeId);
        }
      });
  }

  private noteFx(n: Note, demo: boolean): void {
    const node = this.room.nodes.find((x) => x.active);
    const color = n === 'low' ? P.crystalBlue : n === 'mid' ? P.crystalTeal : P.crystalOrange;
    const x = demo && node ? node.def.x : this.player.x;
    const y = demo && node ? node.def.y - 40 : this.player.feetY - 70;
    const ring = frameRef('fx.ring');
    const img = this.add.image(x, y, ring.atlas, ring.frame).setTint(hex(color)).setBlendMode(Phaser.BlendModes.ADD).setDepth(DEPTH.fx).setScale(0.15).setAlpha(0.9);
    this.tweens.add({ targets: img, scale: n === 'low' ? 1.3 : n === 'mid' ? 1.0 : 0.75, alpha: 0, duration: 800, onComplete: () => img.destroy() });
    if (!demo) this.player.rig.play('song');
  }

  private atSite(): boolean {
    const p = this.player;
    return this.room.sites.some((s) => s.active && Math.abs(p.x - s.def.x) < 60 && Math.abs(p.feetY - s.def.y) < 30);
  }

  private tryForm(): void {
    const p = this.player;
    if (p.kind !== 'gorti' || !this.quest.hasAbility('form') || !p.onGround || !this.atSite()) return;
    this.transform(p.form === 'root' ? 'human' : 'root');
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
      this.player.heal();
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

  setObjective(key: string, flash = true): void {
    if (this.objectiveKey === key) return;
    this.objectiveKey = key;
    const o = OBJECTIVES[key];
    if (o) app.ui.hud.setObjective(o.text, flash);
    this.lastProgress = this.progressClock;
  }

  get objective(): string {
    return this.objectiveKey;
  }

  /** Sets a flag, refreshes gated elements and saves. Returns true the first time. */
  flag(f: string, animate = true): boolean {
    const first = this.quest.set(f);
    if (first) {
      this.room.refresh(animate);
      this.hazards.refresh();
      persist();
    }
    return first;
  }

  damage(fromX: number, halves?: number): void {
    const dmg = halves ?? (this.assist ? 1 : 2);
    if (!this.player.hurt(fromX, dmg)) return;
    this.shake(0.006, 160);
    this.lastProgress = Math.max(this.lastProgress, this.progressClock - HINT_DELAY_MS + 8000);
    if (this.player.halves <= 0) this.reform(true);
  }

  /** Reforms Gorti at the current checkpoint (fall, or coherence lost). */
  reform(fromDamage: boolean): void {
    const p = this.player;
    if (p.state === 'reform') return;
    p.state = 'reform';
    p.body.setVelocity(0, 0);
    p.body.setAllowGravity(false);
    const cam = this.cameras.main;
    this.time.delayedCall(fromDamage ? 520 : 150, () => {
      cam.fadeOut(260, 15, 13, 24);
      cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        const cp = this.def.checkpoints.find((c) => c.id === this.quest.progress.checkpoint) ?? this.def.checkpoints[0]!;
        p.body.setAllowGravity(true);
        p.body.checkCollision.none = false;
        p.teleport(cp.x, cp.y, cp.facing ?? 1);
        p.heal();
        p.focus.refill();
        p.state = 'normal';
        p.invuln = 800;
        this.hazards.resetAll();
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
    if (app.ui.song.isOpen || app.ui.puzzle.isOpen || app.ui.doc.isOpen) return;
    this.paused = true;
    this.physics.world.pause();
    this.time.paused = true;
    this.tweens.pauseAll();
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
    this.hazards.visual(dt, time);
    this.narrative.tick(dt);
    this.script.onUpdate?.(dt, time);
    this.updateCamera(dt);
    this.room.stream(this.cameras.main.scrollX);
    this.warpBg?.update(dt);
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
    const fa = this.player.focus.active ? 0.28 : 0;
    this.focusVignette.setAlpha(this.focusVignette.alpha + (fa - this.focusVignette.alpha) * Math.min(1, dt / 120));
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
    hud.setCoherence(p.halves, p.maxHalves);
    const hasFocus = this.quest.hasAbility('focus') || p.kind === 'mech' || p.kind === 'coward';
    hud.setFocus(p.focus.fraction, p.focus.active, hasFocus && p.kind !== 'suit');
    const prompts: { key: string; label: string }[] = [];
    const t = this.target;
    const gameplay = app.input.context === 'gameplay';
    let actionLabel = '';
    this.reachGfx.clear();
    this.hintGlyph.setVisible(false);
    if (gameplay && t && p.controllable) {
      if (t.kind === 'interact') {
        prompts.push({ key: 'E', label: t.label });
        actionLabel = t.label;
        this.hintGlyph.setVisible(true).setPosition(t.x, t.y - 95 + Math.sin(time / 240) * 4).setRotation(time / 900);
      } else if (t.kind === 'anchor') {
        prompts.push({ key: 'E', label: t.label });
        actionLabel = t.label;
        this.drawReachPreview(t.x, t.y, time);
      } else if (t.kind === 'pulse') {
        const c = p.chest();
        if (this.hazards.anyDispersibleNear(c.x, c.y, 230) || this.script.pulseRelevant?.()) {
          prompts.push({ key: 'E', label: t.label });
        }
        actionLabel = t.label;
      }
    }
    const node = gameplay && p.controllable ? this.nearNode() : null;
    if (node) prompts.push({ key: 'F', label: 'Şarkı söyle' });
    const site = gameplay && p.controllable && p.kind === 'gorti' && this.quest.hasAbility('form') && this.atSite();
    if (site) prompts.push({ key: 'R', label: p.form === 'root' ? 'İnsan bedeni' : 'Kök beden' });
    const focusNear = gameplay && hasFocus && (this.script.focusRelevant?.() ?? this.room.solids.some((s) => s.def.latent && s.active && Math.abs(s.def.x - p.x) < 420 && Math.abs(s.def.y - p.feetY) < 300));
    if (focusNear && !p.focus.active) prompts.push({ key: 'Q', label: app.settings.focusToggle ? 'Nefes (aç/kapa)' : 'Nefesini tut' });
    hud.setPrompts(prompts);
    app.ui.touch.setAvail({ focus: hasFocus && p.kind !== 'suit', form: !!site, song: !!node, actionLabel, jump: p.canJump });
    // Hints after a long stretch without progress.
    const o = OBJECTIVES[this.objectiveKey];
    hud.setHint(o?.hint ?? '', !!o && this.progressClock - this.lastProgress > HINT_DELAY_MS);
  }

  private drawReachPreview(x: number, y: number, time: number): void {
    const g = this.reachGfx;
    const hand = this.player.chest();
    const steps = 9;
    for (let k = 1; k < steps; k++) {
      const u = k / steps;
      const px = hand.x + (x - hand.x) * u;
      const py = hand.y + (y - hand.y) * u + Math.sin(u * Math.PI) * 12;
      g.fillStyle(0xd7b3ff, 0.35 + 0.35 * Math.sin(time / 120 - k));
      g.fillCircle(px, py, 3);
    }
    g.lineStyle(3, 0xd7b3ff, 0.8);
    g.strokeCircle(x, y, 20 + Math.sin(time / 150) * 2);
  }

  // ------------------------------------------------------------ fx helpers

  burst(x: number, y: number, color: number, n: number): void {
    this.particles.setParticleTint(color);
    this.particles.emitParticleAt(x, y, n);
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
    app.ui.song.close('closed');
    app.ui.puzzle.close(false);
    app.ui.doc.close();
    if (app.ui.dialogue.isOpen) app.ui.dialogue.finish();
    app.ui.hud.setSkip(null);
    app.ui.hud.clearCaption();
    this.events.off('player-land');
    this.events.off('player-step');
  }

  /** Scripts register teardown work here. */
  onCleanup(fn: () => void): void {
    this.cleanups.push(fn);
  }
}
