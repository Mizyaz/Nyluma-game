import { app } from '../App';
import type { WorldScene } from '../scenes/WorldScene';
import type { Cutscene } from '../systems/NarrativeSystem';
import type { FormId } from '../state/types';
import type { RoomScript } from '../../content/scripts/types';
import { CAST, speakerName } from '../../content/characters/cast';
import { Npc } from '../../gameplay/actors/Npc';
import type { Line } from '../../ui/Dialogue';
import { evalCond } from './cond';
import { npcSpot, triggerRect, walkActions, type RoomSpec } from './compile';
import type { ActionJson, LineJson, NpcJson } from './types';

// What a room file does, played: its NPCs stand and talk, its triggers and
// enter actions run, its gates say their hint. Flags remember everything,
// so a room rebuilt from a save shows the same state.

/** How close to a standing gate its hint shows. */
const HINT_R = 110;
const HINT_EVERY = 7000;

const toLine = (l: LineJson): Line => ({ ...(l.who ? { who: speakerName(l.who)! } : {}), text: l.text, ...(l.whisper ? { whisper: true } : {}) });

/** Whether a list takes time (a cutscene holds Gorti still while it plays). */
function takesTime(list: readonly ActionJson[]): boolean {
  let slow = false;
  walkActions(list, (a) => (slow ||= 'say' in a || 'wait' in a || 'form' in a));
  return slow;
}

export class ContentScript implements RoomScript {
  private readonly npcs = new Map<string, Npc>();
  private hintAt = -1e9;
  private runs = 0;
  /** A room to leave for once the running actions end. */
  private leaveTo: string | null = null;

  constructor(
    private readonly w: WorldScene,
    private readonly spec: RoomSpec,
  ) {}

  setup(): void {
    this.syncNpcs();
    if (this.spec.enter.length && !this.w.quest.has(this.flagOf('entered'))) {
      // After the room is up and the chapter card is on.
      this.w.time.delayedCall(450, () => this.run('enter', this.spec.enter, () => this.w.flag(this.flagOf('entered'), false)));
    }
  }

  onInteract(id: string): boolean {
    const n = this.spec.npcs.find((x) => npcSpot(x.id) === id);
    if (!n) return false;
    const talked = this.flagOf(`${n.id}.talked`);
    const first = !this.w.quest.has(talked);
    const lines = first ? n.talk : (n.again ?? n.talk.slice(-1));
    const npc = this.npcs.get(n.id);
    this.run(`npc:${n.id}`, [{ say: lines }, ...(first ? (n.then ?? []) : [])], () => {
      this.w.flag(talked, false);
      if (npc) npc.hasNews = false;
    });
    return true;
  }

  onTrigger(id: string): void {
    const t = this.spec.triggers.find((x) => triggerRect(x.id) === id);
    if (!t) return;
    const done = this.flagOf(`${t.id}.done`);
    if (!t.repeat && this.w.quest.has(done)) return;
    this.run(`trg:${t.id}`, t.do, () => {
      if (!t.repeat) this.w.flag(done, false);
    });
  }

  onUpdate(dtMs: number, time: number): void {
    this.syncNpcs();
    const px = this.w.player.x;
    const dlg = app.ui.dialogue;
    for (const [id, npc] of this.npcs) {
      const name = CAST[this.npcSpec(id)!.who]?.name;
      const inTalk = this.w.narrative.busy && dlg.isOpen && npc.near(px);
      npc.update(dtMs, px, !inTalk ? 'idle' : dlg.speaker === name && dlg.typing ? 'talk' : 'listen');
    }
    if (time - this.hintAt > HINT_EVERY && !this.w.narrative.busy) {
      const ctx = this.w.room.condCtx();
      const g = this.spec.gates.find((x) => x.hint && Math.abs(px - x.x) < HINT_R && !evalCond(x.open, ctx));
      if (g) {
        this.hintAt = time;
        app.ui.hud.caption(g.hint!, 3400);
      }
    }
  }

  destroy(): void {
    for (const n of this.npcs.values()) n.destroy();
    this.npcs.clear();
  }

  // ---------------------------------------------------------------- actions

  private flagOf(what: string): string {
    return `${this.spec.id}.${what}`;
  }

  private npcSpec(id: string): NpcJson | undefined {
    return this.spec.npcs.find((n) => n.id === id);
  }

  /** NPCs stand while their `when` holds. */
  private syncNpcs(): void {
    const ctx = this.w.room.condCtx();
    for (const n of this.spec.npcs) {
      const on = evalCond(n.when, ctx);
      const have = this.npcs.get(n.id);
      if (on && !have) {
        const cast = CAST[n.who];
        if (!cast) continue; // `kd check` reports it
        const npc = new Npc(this.w, n.id, cast, n.x, this.spec.floor, n.facing ?? -1);
        npc.hasNews = !this.w.quest.has(this.flagOf(`${n.id}.talked`));
        this.npcs.set(n.id, npc);
      } else if (!on && have) {
        have.destroy();
        this.npcs.delete(n.id);
      }
    }
  }

  /** Runs a list: as a cutscene when it takes time, at once otherwise. */
  private run(tag: string, list: readonly ActionJson[], done: () => void): void {
    const end = (): void => {
      done();
      const to = this.leaveTo;
      this.leaveTo = null;
      if (to) this.w.goToRoom(to);
    };
    if (!takesTime(list)) {
      void this.exec(list, null).then(end);
      return;
    }
    void this.w.narrative.play(`${this.spec.id}:${tag}:${this.runs++}`, (cs) => this.exec(list, cs), end);
  }

  private async exec(list: readonly ActionJson[], cs: Cutscene | null): Promise<void> {
    const w = this.w;
    for (const a of list) {
      if (this.leaveTo) return;
      if ('say' in a) await cs?.say(a.say.map(toLine));
      else if ('flag' in a) w.flag(a.flag);
      else if ('unflag' in a) w.unflag(a.unflag);
      else if ('form' in a) await this.changeForm(a.form);
      else if ('unlock' in a) w.quest.grant(a.unlock);
      else if ('sky' in a) w.setSky(a.sky);
      else if ('go' in a) this.leaveTo = a.go;
      else if ('word' in a) w.comic.pop(w.player.x, w.player.feetY - 170, a.word, 'call', true);
      else if ('wait' in a) await cs?.wait(a.wait);
      else if ('if' in a) await this.exec(evalCond(a.if, w.room.condCtx()) ? (a.then ?? []) : (a.else ?? []), cs);
    }
  }

  private changeForm(to: FormId): Promise<void> {
    const p = this.w.player;
    if (p.kind !== 'gorti' || p.state === 'transform' || this.w.quest.progress.form === to) return Promise.resolve();
    return new Promise((res) => this.w.transform(to, res));
  }
}
