import type * as Phaser from 'phaser';
import { app } from '../App';
import type { Line } from '../../ui/Dialogue';
import type { CastId } from '../cinematics/castNames';
import { FaceDialogue } from '../cinematics/FaceDialogue';

const SKIP_HOLD_MS = 800;

type TweenCfg = Phaser.Types.Tweens.TweenBuilderConfig & { targets: object | object[] };

/**
 * A skippable scripted sequence. Presentation happens in the body; every
 * persistent consequence belongs in `finalize`, which runs exactly once
 * whether the sequence completed or was skipped, so both paths leave the
 * quest in the same state.
 */
export class Cutscene {
  skipped = false;
  private tweens = new Set<{ tween: Phaser.Tweens.Tween; cfg: TweenCfg; done: () => void }>();
  private waits = new Set<{ timer: Phaser.Time.TimerEvent; done: () => void }>();

  constructor(private scene: Phaser.Scene) {}

  wait(ms: number): Promise<void> {
    if (this.skipped || ms <= 0) return Promise.resolve();
    return new Promise((res) => {
      const entry = {
        timer: this.scene.time.delayedCall(ms, () => {
          this.waits.delete(entry);
          res();
        }),
        done: res,
      };
      this.waits.add(entry);
    });
  }

  tween(cfg: TweenCfg): Promise<void> {
    const userComplete = cfg.onComplete as (() => void) | undefined;
    const userUpdate = cfg.onUpdate as (() => void) | undefined;
    if (this.skipped) {
      applyTweenEnd(cfg);
      userUpdate?.();
      userComplete?.();
      return Promise.resolve();
    }
    return new Promise((res) => {
      let finished = false;
      const entry = { tween: null as unknown as Phaser.Tweens.Tween, cfg, done: () => undefined as void };
      entry.done = (): void => {
        if (finished) return;
        finished = true;
        this.tweens.delete(entry);
        userComplete?.();
        res();
      };
      entry.tween = this.scene.tweens.add({ ...cfg, onComplete: () => entry.done() });
      this.tweens.add(entry);
    });
  }

  say(lines: Line[]): Promise<void> {
    if (this.skipped) return Promise.resolve();
    return app.ui.dialogue.open(lines);
  }

  /** Like `say`, as a face-animated scene with the speakers up close. */
  talk(lines: Line[], cast: readonly CastId[]): Promise<void> {
    if (this.skipped) return Promise.resolve();
    return FaceDialogue.play(this.scene, lines, cast);
  }

  caption(text: string, ms = 4200): void {
    if (!this.skipped) app.ui.hud.caption(text, ms);
  }

  skip(): void {
    if (this.skipped) return;
    this.skipped = true;
    for (const t of [...this.tweens]) {
      t.tween.stop();
      applyTweenEnd(t.cfg);
      (t.cfg.onUpdate as (() => void) | undefined)?.();
      t.done();
    }
    for (const w of [...this.waits]) {
      w.timer.remove(false);
      this.waits.delete(w);
      w.done();
    }
    // Closes what is said, and forgets lines still waiting for a chapter page to open.
    app.ui.dialogue.finish();
    FaceDialogue.end(this.scene);
    app.ui.hud.clearCaption();
  }
}

function applyTweenEnd(cfg: TweenCfg): void {
  const targets = Array.isArray(cfg.targets) ? cfg.targets : [cfg.targets];
  const reserved = new Set(['targets', 'duration', 'delay', 'ease', 'yoyo', 'repeat', 'hold', 'onComplete', 'onUpdate', 'onStart', 'props', 'persist', 'paused', 'completeDelay', 'loop', 'repeatDelay', 'callbackScope']);
  for (const [k, v] of Object.entries(cfg)) {
    if (reserved.has(k)) continue;
    let end: unknown = v;
    if (typeof v === 'object' && v !== null && 'to' in v) end = (v as { to: unknown }).to;
    if (typeof v === 'object' && v !== null && 'value' in v) end = (v as { value: unknown }).value;
    if (typeof end === 'string' && /^[+-]=/.test(end)) continue;
    if (typeof end !== 'number') continue;
    if (cfg.yoyo) continue;
    for (const t of targets) (t as Record<string, unknown>)[k] = end;
  }
}

export class Narrative {
  private scene: Phaser.Scene;
  current: Cutscene | null = null;
  private skipMs = 0;
  private played = new Set<string>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  get busy(): boolean {
    return this.current !== null;
  }

  /**
   * Runs a cutscene once per room load (`id`); quest-level idempotency is
   * provided by the caller's flags.
   */
  async play(id: string, body: (cs: Cutscene) => Promise<void>, finalize: () => void, skippable = true): Promise<void> {
    if (this.current || this.played.has(id)) return;
    this.played.add(id);
    const cs = new Cutscene(this.scene);
    this.current = cs;
    this.skipMs = 0;
    (cs as unknown as { skippable: boolean }).skippable = skippable;
    app.input.pushContext('cutscene');
    let finalized = false;
    const fin = (): void => {
      if (finalized) return;
      finalized = true;
      finalize();
    };
    try {
      await body(cs);
    } catch (err) {
      console.error('cutscene failed', id, err);
    } finally {
      fin();
      this.current = null;
      app.ui.hud.setSkip(null);
      app.input.popContext('cutscene');
    }
  }

  /** Skip-by-holding (Space / E / Enter, a held touch button or a held dialogue tap). */
  tick(dtMs: number): void {
    const cs = this.current;
    if (!cs || cs.skipped || !(cs as unknown as { skippable: boolean }).skippable) {
      this.skipMs = 0;
      return;
    }
    const i = app.input;
    const holding = i.held('jump') || i.held('action') || i.held('confirm') || app.ui.dialogue.pointerHeldMs() > 250;
    this.skipMs = holding ? this.skipMs + dtMs : Math.max(0, this.skipMs - dtMs * 2);
    app.ui.hud.setSkip(Math.min(1, this.skipMs / SKIP_HOLD_MS));
    if (this.skipMs >= SKIP_HOLD_MS) {
      this.skipMs = 0;
      cs.skip();
    }
  }

  destroy(): void {
    this.current?.skip();
    this.current = null;
  }
}
