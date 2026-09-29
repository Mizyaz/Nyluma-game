import { app } from './App';
import type { WorldScene } from './scenes/WorldScene';

// E2E-only read-only state probe (compiled out of production builds).
export function installProbe(): void {
  const w = window as unknown as { __kd: unknown };
  w.__kd = {
    state(): unknown {
      const scenes = app.game.scene.getScenes(true).map((s) => s.scene.key);
      const world = app.game.scene.getScene('world') as WorldScene | null;
      const active = scenes.includes('world') && world && world.player;
      return {
        scenes,
        context: app.input.context,
        room: active ? world.def.id : null,
        player: active
          ? {
              x: world.player.x,
              y: world.player.feetY,
              vx: world.player.body.velocity.x,
              vy: world.player.body.velocity.y,
              onGround: world.player.onGround,
              state: world.player.state,
              form: world.player.form,
              kind: world.player.kind,
              halves: world.player.halves,
              focus: world.player.focus.value,
              facing: world.player.facing,
            }
          : null,
        paused: active ? world.paused : false,
        busy: active ? world.narrative.busy : false,
        objective: active ? world.objective : null,
        flags: app.quest ? [...app.quest.progress.flags] : [],
        checkpoint: app.quest?.progress.checkpoint ?? null,
        memories: app.quest?.profile.memories ?? app.profile.memories,
        dialogueOpen: app.ui.dialogue.isOpen,
        songOpen: app.ui.song.isOpen,
        puzzleOpen: app.ui.puzzle.isOpen,
        docOpen: app.ui.doc.isOpen,
        endingOpen: app.ui.ending.isOpen,
        heldSources: app.input.sourceCount(),
        extra: active ? { ...world.probeExtra } : {},
        prompts: [...document.querySelectorAll('.prompt span')].map((e) => e.textContent ?? ''),
        fps: Math.round(app.game.loop.actualFps),
        simElapsed: active ? world.elapsed : 0,
        loopDelta: app.game.loop.delta,
        rawDelta: app.game.loop.rawDelta,
        renderer: app.game.renderer.type === 2 ? 'webgl' : 'canvas',
      };
    },
  };
}
