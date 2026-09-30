// Content files to runtime data (pure): a room file becomes the RoomDef the
// world builds (ground, gates, exits, props, talk spots) and a RoomSpec the
// room's ContentScript plays (NPCs, triggers, the Sun and the Moon).

import type { RoomDef, SolidDef } from '../../content/data/roomTypes';
import { parseCond } from './cond';
import type { ActionJson, ChapterJson, GateJson, NpcJson, RoomJson, SkyJson, StoryJson, TriggerJson } from './types';

export const ROOM_H = 900;
export const GATE_H = 260;
const EXIT_W = 70;
const TRIGGER_W = 80;
const TALK_R = 150;

/** What a content room does, beside what it is made of. */
export interface RoomSpec {
  id: string;
  floor: number;
  sky: Required<SkyJson>;
  enter: ActionJson[];
  npcs: NpcJson[];
  gates: GateJson[];
  triggers: TriggerJson[];
}

export interface CompiledRoom {
  def: RoomDef;
  spec: RoomSpec;
}

export const floorOf = (r: RoomJson): number => r.floor ?? (r.height ?? ROOM_H) - 180;
export const npcSpot = (id: string): string => `npc:${id}`;
export const gateSolid = (id: string): string => `gate:${id}`;
export const triggerRect = (id: string): string => `trg:${id}`;

export function compileRoom(r: RoomJson, ch: ChapterJson): CompiledRoom {
  const h = r.height ?? ROOM_H;
  const floor = floorOf(r);
  const gates = r.gates ?? [];
  const solids: SolidDef[] = [
    { id: 'ground', x: 0, y: floor, w: r.width, h: h - floor, style: r.ground ?? 'soil' },
    ...gates.map((g): SolidDef => {
      const gh = g.h ?? GATE_H;
      return { id: gateSolid(g.id), x: g.x - 22, y: floor - gh, w: 44, h: gh, style: g.look ?? 'stone', unless: g.open };
    }),
  ];
  const def: RoomDef = {
    id: r.id,
    chapter: ch.number,
    title: r.title,
    width: r.width,
    height: h,
    theme: r.theme,
    music: r.music ?? 'none',
    player: r.player ?? 'gorti',
    ...(r.form ? { entryForm: r.form } : {}),
    checkpoints: [{ id: `${r.id}_start`, x: r.spawn.x, y: floor, facing: r.spawn.facing ?? 1 }],
    solids,
    exits: (r.exits ?? []).map((e) => {
      const x = e.x ?? ((e.side ?? 'right') === 'right' ? r.width - EXIT_W : 0);
      return { id: `exit:${e.to}`, x, y: floor - GATE_H, w: EXIT_W, h: GATE_H, to: e.to, ...(e.when ? { when: e.when } : {}) };
    }),
    triggers: (r.triggers ?? []).map((t) => {
      const w = t.w ?? TRIGGER_W;
      return { id: triggerRect(t.id), x: t.x - w / 2, y: floor - 320, w, h: 320, ...(t.when ? { when: t.when } : {}) };
    }),
    props: (r.props ?? []).map((p) => ({
      key: p.key,
      x: p.x,
      y: p.y ?? floor + 2,
      ...(p.scale !== undefined ? { scale: p.scale } : {}),
      ...(p.depth !== undefined ? { depth: p.depth } : {}),
      ...(p.flip ? { flipX: true } : {}),
      ...(p.when ? { when: p.when } : {}),
      ...(p.unless ? { unless: p.unless } : {}),
    })),
    interacts: (r.npcs ?? []).map((n) => ({ id: npcSpot(n.id), x: n.x, y: floor - 10, r: TALK_R, prompt: 'Konuş', ...(n.when ? { when: n.when } : {}) })),
    memories: (r.memories ?? []).map((m) => ({ id: m.id, x: m.x, y: floor - 40 })),
    killY: h + 200,
  };
  return {
    def,
    spec: {
      id: r.id,
      floor,
      sky: { out: 'none', ...ch.sky, ...r.sky },
      enter: r.enter ?? [],
      npcs: r.npcs ?? [],
      gates,
      triggers: r.triggers ?? [],
    },
  };
}

/** Every action in a list, branches included. */
export function walkActions(list: readonly ActionJson[], visit: (a: ActionJson) => void): void {
  for (const a of list) {
    visit(a);
    if ('if' in a) {
      walkActions(a.then ?? [], visit);
      walkActions(a.else ?? [], visit);
    }
  }
}

/**
 * Cross-checks a story: every chapter's rooms exist, every content room is in
 * its chapter, exits and `go` lead to known rooms, conditions parse. Returns
 * readable problems (empty when all is well).
 */
export function checkStory(story: StoryJson, rooms: readonly RoomJson[], builtIn: readonly string[]): string[] {
  const out: string[] = [];
  const chapters = new Map(story.chapters.map((c) => [c.id, c]));
  const known = new Set([...builtIn, ...rooms.map((r) => r.id)]);
  const listed = new Set<string>();
  for (const c of story.chapters) {
    for (const id of c.rooms) {
      if (!known.has(id)) out.push(`chapter ${c.id}: no room "${id}"`);
      if (listed.has(id)) out.push(`chapter ${c.id}: room "${id}" is listed twice`);
      listed.add(id);
    }
  }
  const cond = (where: string, src: string | undefined): void => {
    try {
      parseCond(src);
    } catch (e) {
      out.push(`${where}: ${(e as Error).message}`);
    }
  };
  for (const r of rooms) {
    const at = `room ${r.id}`;
    const ch = chapters.get(r.chapter);
    if (!ch) out.push(`${at}: no chapter "${r.chapter}"`);
    else if (!ch.rooms.includes(r.id)) out.push(`${at}: not listed in chapter ${ch.id}'s rooms`);
    if (r.spawn.x < 0 || r.spawn.x > r.width) out.push(`${at}: spawn x ${r.spawn.x} is outside 0..${r.width}`);
    for (const e of r.exits ?? []) {
      if (!known.has(e.to)) out.push(`${at}: exit to unknown room "${e.to}"`);
      cond(`${at} exit ${e.to}`, e.when);
    }
    const ids = new Set<string>();
    const unique = (kind: string, id: string): void => {
      if (ids.has(`${kind}:${id}`)) out.push(`${at}: two ${kind}s named "${id}"`);
      ids.add(`${kind}:${id}`);
    };
    const actions = (where: string, list: readonly ActionJson[]): void =>
      walkActions(list, (a) => {
        if ('go' in a && !known.has(a.go)) out.push(`${where}: go to unknown room "${a.go}"`);
        if ('if' in a) cond(where, a.if);
      });
    actions(`${at} enter`, r.enter ?? []);
    for (const n of r.npcs ?? []) {
      unique('npc', n.id);
      cond(`${at} npc ${n.id}`, n.when);
      if (!n.talk.length) out.push(`${at} npc ${n.id}: nothing to say`);
      actions(`${at} npc ${n.id}`, n.then ?? []);
    }
    for (const g of r.gates ?? []) {
      unique('gate', g.id);
      cond(`${at} gate ${g.id}`, g.open);
    }
    for (const t of r.triggers ?? []) {
      unique('trigger', t.id);
      cond(`${at} trigger ${t.id}`, t.when);
      actions(`${at} trigger ${t.id}`, t.do);
    }
    for (const p of r.props ?? []) {
      cond(`${at} prop ${p.key}`, p.when);
      cond(`${at} prop ${p.key}`, p.unless);
    }
  }
  return out;
}
