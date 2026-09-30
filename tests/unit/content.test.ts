import { describe, expect, it } from 'vitest';
import { evalCond, parseCond } from '../../src/engine/content/cond';
import { checkStory, compileRoom } from '../../src/engine/content/compile';
import { RoomSchema, StorySchema, schemaProblems } from '../../src/engine/content/schema';
import { BUILT_IN_ROOMS, ROOM_FILES, STORY } from '../../src/content/data/rooms';
import type { RoomJson } from '../../src/engine/content/types';

const ctx = (flags: string[], form = 'root', room = 'b01') => ({ has: (f: string) => flags.includes(f), form, room });

describe('content files', () => {
  it('reads conditions', () => {
    expect(evalCond(undefined, ctx([]))).toBe(true);
    expect(evalCond('a & !b', ctx(['a']))).toBe(true);
    expect(evalCond('a & !b', ctx(['a', 'b']))).toBe(false);
    expect(evalCond('form:human | x.y', ctx(['x.y']))).toBe(true);
    expect(evalCond('(a | b) & room:b01', ctx(['b']))).toBe(true);
    expect(() => parseCond('a &')).toThrow();
  });

  it('accepts every chapter and room file, cross-checked', () => {
    expect(schemaProblems(StorySchema, STORY, 'chapters.json')).toEqual([]);
    for (const r of ROOM_FILES) expect(schemaProblems(RoomSchema, r, r.id)).toEqual([]);
    expect(checkStory(STORY, ROOM_FILES, Object.keys(BUILT_IN_ROOMS))).toEqual([]);
  });

  it('builds a room: ground, a form gate, a talk spot, a trigger', () => {
    const r: RoomJson = {
      id: 't1',
      chapter: 'c6',
      title: 'T',
      theme: 'hill',
      width: 1600,
      spawn: { x: 200 },
      npcs: [{ id: 'n', who: 'moonMan', x: 600, talk: [{ text: 'Merhaba' }] }],
      gates: [{ id: 'g', x: 900, open: 'form:human' }],
      triggers: [{ id: 't', x: 1200, do: [{ flag: 't1.done' }] }],
      exits: [{ to: 'b01', when: 't1.done' }],
    };
    const { def, spec } = compileRoom(r, STORY.chapters.at(-1)!);
    expect(def.solids.map((s) => [s.id, s.unless])).toEqual([
      ['ground', undefined],
      ['gate:g', 'form:human'],
    ]);
    expect(def.checkpoints[0]).toMatchObject({ id: 't1_start', x: 200, y: spec.floor });
    expect(def.interacts?.[0]).toMatchObject({ id: 'npc:n', x: 600 });
    expect(def.exits[0]).toMatchObject({ to: 'b01', x: 1600 - 70, when: 't1.done' });
    expect(checkStory({ chapters: [{ ...STORY.chapters.at(-1)!, rooms: ['t1'] }] }, [{ ...r, exits: [{ to: 'nowhere' }] }], [])).toEqual(['room t1: exit to unknown room "nowhere"']);
  });
});
