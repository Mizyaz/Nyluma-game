import type { Bot } from './bot';
import type { ProbeState } from './helpers';

// Room-by-room routes for the normal-input campaign run. Coordinates come
// from the room data (src/content/rooms); decisions use the read-only
// probe. Gorti only walks (jumping is off, and every room is one floor):
// story scenes start by themselves where Gorti arrives, and the bot waits
// for them (`settle` holds the skip button like an impatient player).

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
    // Past the whale's place on the floor the whale passes; its song raises
    // three whales over Gorti's head and parts the roots closing the tunnel
    // mouth at the far end. Walk on through it (waiting at the roots until
    // they part).
    await b.settle();
    await leave(b, 1, 'r03');
    await b.untilRoom('r03');
  },

  async r03(b) {
    // Over the whale lying across the poisoned pool (its back is level with
    // both banks); at the tree the Moon and Sun scene plays by itself and
    // the tree blooms. At the trunk Gorti's roots carry him up the whale
    // spiral into the canopy: watched to the end (not skipped), on to r04.
    await stages(b, 'r03', [
      {
        name: 'the tree scene',
        when: (s) => !s.flags.includes('r03.bloom'),
        run: async () => {
          await b.walkTo(1870, 10);
          await b.settle();
        },
      },
      {
        name: 'up the spiral',
        when: (s) => s.flags.includes('r03.bloom'),
        run: async () => {
          await b.keyDown('KeyD');
          await b.waitFor((x) => x.busy || x.room !== 'r03', 20_000, 'the ascent').finally(() => b.keyUp('KeyD'));
          await b.waitFor((x) => x.room === 'r04', 30_000, 'r04 after the ascent');
        },
      },
    ]);
    await b.untilRoom('r04');
  },

  async r04(b) {
    // The first wind carries a whale over Gorti's head; at the memory pool
    // the scene plays by itself and Gorti becomes human; on east.
    await b.settle();
    await leave(b, 1, 'r05', 180_000);
    await b.untilRoom('r05');
  },

  async r05(b) {
    // The stones already rest on their plates and the gate is open: along
    // the floor to the far end, where the Moon scene plays by itself.
    await b.settle();
    await leave(b, 1, 'r06', 180_000);
    await b.untilRoom('r06');
  },

  async r06(b) {
    // The shout scene at the start; the knots calm as Gorti walks past them;
    // the horse forms and walking up to it mounts it.
    await stages(b, 'r06', [
      {
        name: 'shout',
        when: (s) => !s.flags.includes('r06.shout'),
        run: async () => {
          await b.walkTo(580, 8, 15_000).catch(() => undefined);
          await b.settle(120_000);
        },
      },
      { name: 'the knots and the horse', when: () => true, run: () => leave(b, 1, 'r07') },
    ]);
    await b.untilRoom('r07');
  },

  async r07(b) {
    // The ride runs by itself over one meadow floor: the flower bridges
    // bloom over the chasms as the horse comes near, and the ride ends in r08.
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
    // Over the slab across the river; the line scene and, at the pool, the
    // fold scene play by themselves.
    await b.settle();
    await leave(b, 1, 'r10');
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
    // The key scene opens the first wall and the lock scene the second, both
    // by themselves as the mechanical form walks by; beyond, it wakes Gorti.
    await b.settle();
    await leave(b, 1, 'r12');
    await b.untilRoom('r12');
  },

  async r12(b) {
    // The suit walks, like everyone. The door opens by itself; at the end of
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
