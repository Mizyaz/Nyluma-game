import type { Bot } from './bot';
import type { ProbeState } from './helpers';

// Room-by-room routes for the normal-input campaign run. Coordinates come
// from the room data (src/game/data/rooms); decisions use the read-only
// probe. Gorti only walks and jumps: story scenes start by themselves where
// Gorti arrives, and the bot waits for them (`settle` holds the skip button
// like an impatient player). Routes are staged: after a fall the bot
// re-plans from where it stands.

export type Route = (b: Bot) => Promise<void>;
type S = ProbeState;

interface Stage {
  name: string;
  when: (s: S) => boolean;
  run: (s: S) => Promise<void>;
}

async function stages(b: Bot, room: string, list: Stage[], maxIter = 40): Promise<void> {
  for (let i = 0; i < maxIter; i++) {
    let s = await b.s();
    if (s.room !== room) return;
    if (s.busy || s.dialogueOpen || s.docOpen || s.context !== 'gameplay') {
      await b.settle();
      s = await b.s();
      if (s.room !== room) return;
    }
    if (s.player && !s.player.onGround) {
      await b.waitFor((x) => x.room !== room || !x.player || x.player.onGround, 4000, 'landing').catch(() => undefined);
      continue;
    }
    const st = list.find((x) => x.when(s));
    if (!st) {
      await b.wait(200);
      continue;
    }
    b.note(`${room}: ${st.name}`);
    await st.run(s).catch((e: unknown) => b.note(`${room}: ${st.name} failed: ${(e as Error).message.slice(0, 160)}`));
  }
  throw new Error(`${room}: route did not finish. Log:\n${b.log.slice(-25).join('\n')}`);
}

/** Standing on the surface at height y (feet), between x0 and x1. */
const on = (s: S, y: number, x0 = -1e9, x1 = 1e9): boolean => !!s.player && s.player.onGround && Math.abs(s.player.y - y) < 4 && s.player.x >= x0 && s.player.x <= x1;

async function inspect(b: Bot, x: number, label = 'İncele'): Promise<void> {
  await b.walkTo(x, 10);
  await b.act(label);
  await b.settle();
}

/**
 * Holds a direction until `done`, letting the story scenes met on the way
 * play out (they start by themselves).
 */
async function walkUntil(b: Bot, dir: 1 | -1, done: (s: S) => boolean, label: string, timeout = 120_000): Promise<S> {
  const key = dir > 0 ? 'KeyD' : 'KeyA';
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const s = await b.s();
    if (done(s)) {
      await b.releaseAll();
      return s;
    }
    if (!s.player || s.busy || s.dialogueOpen || s.docOpen || s.context !== 'gameplay') {
      await b.releaseAll();
      if (s.player) await b.settle();
      else await b.wait(100);
      continue;
    }
    await b.keyDown(key);
    await b.wait(50);
  }
  await b.releaseAll();
  throw new Error(`walking ${dir > 0 ? 'right' : 'left'} until ${label} timed out`);
}

/** Walks on until the next room (an exit, or a scene that moves on by itself). */
async function leave(b: Bot, dir: 1 | -1, next: string, timeout = 120_000): Promise<void> {
  await walkUntil(b, dir, (s) => s.room === next, `room ${next}`, timeout);
}

/** One jump off a surface: take off at `from`, steer toward `to`. */
interface Hop {
  y: number;
  x0: number;
  x1: number;
  from: number;
  to: number;
}

/**
 * Hops along a chain of surfaces: on whichever listed surface Gorti stands,
 * walk to its take-off point and jump toward the next one. A take-off point
 * past the surface's edge just walks off it. Returns once Gorti stands on
 * none of them (the goal, or a spot the caller re-plans from).
 */
async function hops(b: Bot, list: Hop[], tries = 30): Promise<void> {
  const room = (await b.s()).room;
  for (let n = 0; n < tries; n++) {
    let s = await b.s();
    if (s.room !== room || !s.player) return;
    if (s.busy || s.dialogueOpen || s.docOpen || s.context !== 'gameplay') {
      await b.settle();
      continue;
    }
    if (!s.player.onGround) {
      await b.waitFor((x) => !x.player || x.player.onGround, 4000, 'landing').catch(() => undefined);
      continue;
    }
    const hop = list.find((h) => on(s, h.y, h.x0, h.x1));
    if (!hop) return;
    if (Math.abs(s.player.x - hop.from) > 8) {
      await b.walkTo(hop.from, 6).catch((e: unknown) => b.note(`hop: ${(e as Error).message.slice(0, 120)}`));
      s = await b.s();
      if (!on(s, hop.y, hop.x0, hop.x1)) continue;
    }
    await b.jumpTo(hop.to);
  }
}

/**
 * Climbs a list of stand points one jump at a time. `lean` moves the take-off
 * toward the next step and the aim back toward this one (px), like a player
 * jumping from the edge of a zig-zag ladder instead of from its middle.
 */
export async function climb(b: Bot, steps: [number, number][], tries = 20, lean: { takeoff: number; aim: number } = { takeoff: 0, aim: 0 }): Promise<void> {
  const room = (await b.s()).room;
  for (let n = 0; n < tries; n++) {
    const st = await b.s();
    const p = st.player;
    if (st.room !== room || !p) return;
    if (st.busy || st.dialogueOpen) {
      await b.settle();
      continue;
    }
    let idx = -1;
    steps.forEach(([, y], i) => {
      if (p.onGround && Math.abs(p.y - y) < 4) idx = i;
    });
    if (idx < 0) return;
    const next = steps[idx + 1];
    if (!next) {
      // Top reached: stand on the step's stand point.
      const top = steps[idx]![0];
      if (Math.abs(p.x - top) > 10) await b.walkTo(top, 6, 8000).catch(() => undefined);
      return;
    }
    // Take off from this step's stand point: jump distance is limited.
    const dir = Math.sign(next[0] - steps[idx]![0]);
    const here = steps[idx]![0] + dir * lean.takeoff;
    if (Math.abs(p.x - here) > 10) await b.walkTo(here, 6, 8000).catch(() => undefined);
    await b.jumpTo(next[0] - dir * lean.aim);
    await b.wait(60);
  }
}

/** The label on the open document page's button ('' when none is open). */
async function docButton(b: Bot): Promise<string> {
  return b.page.evaluate(() => document.querySelector('.doc:not(.hidden) .close')?.textContent ?? '');
}

export const ROUTES: Record<string, Route> = {
  async r01(b) {
    await b.settle();
    // Nothing has to be done here; Gorti looks at a few things on the way.
    await stages(b, 'r01', [
      { name: 'whale toy', when: (s) => !s.flags.includes('r01.toywhale'), run: () => inspect(b, 620) },
      { name: 'marks', when: (s) => !s.flags.includes('r01.marks'), run: () => inspect(b, 1090) },
      { name: 'window', when: (s) => !s.flags.includes('r01.window'), run: () => inspect(b, 1441) },
      // The roots at the far end are always open.
      { name: 'leave', when: () => true, run: () => leave(b, 1, 'r02') },
    ]);
    await b.untilRoom('r02');
  },

  async r02(b) {
    // Past the whale's place on the floor, the whale passes and its song
    // raises the lift: three whales one above the other (backs overlapping),
    // then the tunnel floor. Each stand point is under the next whale.
    const LIFT: [number, number][] = [
      [1000, 1100],
      [1095, 995],
      [1215, 890],
      [1330, 785],
      [1470, 680],
    ];
    await stages(b, 'r02', [
      {
        name: 'whale lift',
        when: (s) => on(s, 1100) || LIFT.some(([, y]) => on(s, y, 860, 1400)),
        run: async (s) => {
          if (on(s, 1100)) await b.walkTo(1000, 10);
          await b.waitFor((x) => x.flags.includes('r02.song'), 8000, 'the whale song');
          await climb(b, LIFT);
        },
      },
      { name: 'exit', when: (s) => on(s, 680, 1390, 1600), run: () => leave(b, 1, 'r03') },
    ]);
    await b.untilRoom('r03');
  },

  async r03(b) {
    // Up onto the whale lying across the poisoned pool (touching the pool
    // only sends Gorti back), along its back and down onto the far bank;
    // at the tree the Moon and Sun scene plays by itself and the tree
    // blooms into the whale spiral: straight up it to the canopy exit.
    const CROSS: Hop[] = [
      { y: 1200, x0: 0, x1: 790, from: 745, to: 800 },
      // Walk off the far end of its back.
      { y: 1140, x0: 740, x1: 1120, from: 1135, to: 1135 },
    ];
    const SPIRAL: [number, number][] = [
      [2150, 1180],
      [2150, 1080],
      [2150, 980],
      [2150, 880],
      [2150, 780],
      [2150, 680],
    ];
    await stages(b, 'r03', [
      { name: 'over the pool', when: (s) => CROSS.some((h) => on(s, h.y, h.x0, h.x1)), run: () => hops(b, CROSS) },
      {
        name: 'the tree scene',
        when: (s) => on(s, 1180, 1090, 2600) && !s.flags.includes('r03.bloom'),
        run: async () => {
          await b.walkTo(1870, 10);
          await b.settle();
        },
      },
      {
        name: 'climb the spiral',
        when: (s) => s.flags.includes('r03.bloom') && SPIRAL.some(([, y]) => on(s, y, 1090, 2600)),
        run: async () => {
          // The whales circle in one after the other: wait for the last.
          await b.wait(2500);
          await climb(b, SPIRAL, 20);
          await b.waitFor((x) => x.room !== 'r03', 3000, 'the canopy exit').catch(() => undefined);
        },
      },
    ]);
    await b.untilRoom('r04');
  },

  async r04(b) {
    // The first wind carries a whale to the foot of the cliff: up onto it
    // and onto the cliff top, where the memory pool scene plays by itself
    // and Gorti becomes human; the way east is open.
    const UP: Hop[] = [
      { y: 900, x0: 0, x1: 1400, from: 1385, to: 1470 },
      { y: 830, x0: 1400, x1: 1610, from: 1590, to: 1700 },
      // Dropped into the hollow at the foot of the cliff: back up to the left.
      { y: 960, x0: 1360, x1: 1660, from: 1405, to: 1330 },
    ];
    await stages(b, 'r04', [
      {
        name: 'the wind whale',
        when: (s) => UP.some((h) => on(s, h.y, h.x0, h.x1)),
        run: async (s) => {
          if (on(s, 900)) {
            await b.walkTo(1300, 10);
            // It drifts in on the wind (~4.6 s): wait until it bears weight.
            await b.waitFor((x) => x.flags.includes('r04.wind'), 8000, 'the first wind');
            await b.wait(3500);
          }
          await hops(b, UP);
        },
      },
      {
        name: 'memory pool',
        when: (s) => on(s, 760, 1630, 2570) && !s.flags.includes('r04.human'),
        run: async () => {
          await b.walkTo(2300, 10);
          await b.settle();
        },
      },
      { name: 'onward', when: (s) => s.flags.includes('r04.human'), run: () => leave(b, 1, 'r05') },
    ]);
    await b.untilRoom('r05');
  },

  async r05(b) {
    // The stones already rest on their plates and the gate is open: along
    // the floor and up the hill's two terraces to the top, where the Moon
    // scene plays by itself.
    const HILL: Hop[] = [
      { y: 1100, x0: 0, x1: 2870, from: 2835, to: 2905 },
      { y: 1035, x0: 2850, x1: 3060, from: 3025, to: 3095 },
      { y: 970, x0: 3040, x1: 3250, from: 3215, to: 3285 },
    ];
    await stages(b, 'r05', [
      { name: 'up the hill', when: (s) => HILL.some((h) => on(s, h.y, h.x0, h.x1)), run: () => hops(b, HILL) },
      {
        name: 'the Moon',
        when: (s) => on(s, 905, 3230, 3900) && !s.flags.includes('r05.moon'),
        run: async () => {
          await b.walkTo(3620, 10);
          await b.settle();
        },
      },
      { name: 'onward', when: (s) => on(s, 905, 3230, 3900), run: () => leave(b, 1, 'r06') },
    ]);
    await b.untilRoom('r06');
  },

  async r06(b) {
    // The shout scene at the start; over the mound (the knots calm as Gorti
    // passes); the horse forms and walking up to it mounts it.
    const MOUND: Hop[] = [
      { y: 900, x0: 0, x1: 1500, from: 1462, to: 1560 },
      { y: 830, x0: 1480, x1: 1630, from: 1580, to: 1700 },
      // Walk off the far side.
      { y: 760, x0: 1600, x1: 1960, from: 2110, to: 2110 },
      { y: 830, x0: 1920, x1: 2070, from: 2110, to: 2110 },
    ];
    await stages(b, 'r06', [
      {
        name: 'shout',
        when: (s) => !s.flags.includes('r06.shout'),
        run: async () => {
          await b.walkTo(580, 8, 15_000).catch(() => undefined);
          await b.settle(120_000);
        },
      },
      { name: 'over the mound', when: (s) => MOUND.some((h) => on(s, h.y, h.x0, h.x1)), run: () => hops(b, MOUND) },
      { name: 'the horse', when: (s) => on(s, 900, 2050, 3000), run: () => leave(b, 1, 'r07') },
    ]);
    await b.untilRoom('r07');
  },

  async r07(b) {
    // The ride runs by itself: the horse leaps the gaps and the mound, the
    // flower bridges bloom as it comes near, and the ride ends in r08.
    const t0 = Date.now();
    let lastNote = 0;
    while (Date.now() - t0 < 420_000) {
      const s = await b.s();
      if (s.room && s.room !== 'r07') return;
      if (s.busy || s.dialogueOpen) {
        await b.settle(60_000).catch(() => undefined);
        continue;
      }
      if (Date.now() - lastNote > 15_000) {
        lastNote = Date.now();
        b.note(`r07: horse ${JSON.stringify(s.extra.horse ?? null)}`);
      }
      await b.wait(250);
    }
    throw new Error(`r07: the ride did not end. Log:\n${b.log.slice(-10).join('\n')}`);
  },

  async r08(b) {
    // The Sun sequence plays by itself: the flowers open, the currents rise,
    // the fish hit the Sun three times and it falls; then the way east opens.
    const t0 = Date.now();
    while (Date.now() - t0 < 300_000) {
      const s = await b.s();
      if (s.room && s.room !== 'r08') return;
      if (s.busy || s.dialogueOpen || (s.player && s.context !== 'gameplay')) {
        await b.settle(90_000);
        continue;
      }
      if (s.flags.includes('r08.done')) {
        await leave(b, 1, 'r09');
        return;
      }
      await b.wait(250);
    }
    throw new Error(`r08: the Sun sequence did not end: ${JSON.stringify((await b.s()).extra.sun ?? null)}`);
  },

  async r09(b) {
    // Over the river stones (or through the river bed); the line scene and,
    // at the pool, the fold scene play by themselves.
    const RIVER: Hop[] = [
      { y: 900, x0: 0, x1: 1310, from: 1290, to: 1400 },
      { y: 880, x0: 1345, x1: 1455, from: 1420, to: 1570 },
      { y: 872, x0: 1515, x1: 1625, from: 1590, to: 1770 },
      { y: 960, x0: 1285, x1: 1715, from: 1665, to: 1770 },
    ];
    await stages(b, 'r09', [
      { name: 'river', when: (s) => RIVER.some((h) => on(s, h.y, h.x0, h.x1)), run: () => hops(b, RIVER) },
      { name: 'to the pool', when: (s) => on(s, 900, 1690, 3200), run: () => leave(b, 1, 'r10') },
    ]);
    await b.untilRoom('r10');
  },

  async r10(b) {
    // The memory stations play as Gorti walks past them and the beds grow
    // into bridges over the gaps; at the third the finale, the torch moment
    // and the second finale follow by themselves, and the room moves on.
    await b.settle();
    await leave(b, 1, 'r11', 180_000);
  },

  async r11(b) {
    // The key scene opens the wall and the lock scene grows the steps, both
    // by themselves as the mechanical form walks by.
    await b.settle();
    await stages(b, 'r11', [
      {
        name: 'onto the block',
        // A waist-high metal block at x 420–520 has to be jumped.
        when: (s) => on(s, 820, 0, 410),
        run: async () => {
          await b.walkTo(378, 6);
          await b.jumpTo(470);
        },
      },
      {
        name: 'key and lock',
        when: (s) => !s.flags.includes('r11.m2') && (on(s, 820, 410, 1900) || on(s, 740, 400, 540)),
        run: async () => {
          await b.walkTo(1700, 8);
          await b.waitFor((x) => x.flags.includes('r11.m2') || x.busy, 5000, 'the lock scene');
        },
      },
      {
        name: 'steps to the ledge',
        when: (s) => s.flags.includes('r11.m2') && (on(s, 820, 410, 1900) || on(s, 740, 1720, 1860) || on(s, 650, 1790, 1900)),
        run: async (s) => {
          if (on(s, 820)) await b.walkTo(1700, 6);
          await climb(b, [
            [1700, 820],
            [1790, 740],
            [1850, 650],
            [1970, 560],
          ]);
        },
      },
      { name: 'wake', when: (s) => on(s, 560, 1880, 2800), run: () => leave(b, 1, 'r12') },
    ]);
    await b.untilRoom('r12');
  },

  async r12(b) {
    // The suit cannot jump: walk. The door opens by itself; at the end of
    // the table the last pages open by themselves and are put down, then the
    // closing scene and the ending follow.
    await b.settle(60_000);
    await walkUntil(b, 1, (s) => s.docOpen, 'the last pages');
    for (const label of ['Sayfayı çevir', 'Bırak']) {
      const t0 = Date.now();
      while (!(await docButton(b)).includes(label)) {
        if (Date.now() - t0 > 15_000) throw new Error(`r12: no page with "${label}" (button: "${await docButton(b)}")`);
        await b.wait(100);
      }
      await b.wait(800);
      await b.tap('KeyE');
    }
    await b.waitFor((s) => s.scenes.includes('ending') && s.endingOpen, 60_000, 'ending');
  },
};
