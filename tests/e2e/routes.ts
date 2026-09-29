import type { Bot } from './bot';
import type { ProbeState } from './helpers';
import { RIDE_CHASMS, RIDE_GAPS, RIDE_MOUND, RIDE_SHARDS, RIDE_THORNS } from '../../src/game/data/rooms/r07';

// Room-by-room routes for the normal-input campaign run. Coordinates come
// from the room data; decisions use the read-only probe. Routes are staged:
// after a fall or a knock-back the bot re-plans from where it stands.

export type Route = (b: Bot) => Promise<void>;
type S = ProbeState & { extra: Record<string, unknown>; prompts: string[] };

interface Stage {
  name: string;
  when: (s: S) => boolean;
  run: (s: S) => Promise<void>;
}

async function stages(b: Bot, room: string, list: Stage[], maxIter = 40): Promise<void> {
  for (let i = 0; i < maxIter; i++) {
    let s = await b.s();
    if (s.room !== room) return;
    if (s.busy || s.dialogueOpen || s.context !== 'gameplay') {
      await b.settle();
      s = await b.s();
      if (s.room !== room) return;
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

const on = (s: S, y: number, x0 = -1e9, x1 = 1e9): boolean => !!s.player && s.player.onGround && Math.abs(s.player.y - y) < 4 && s.player.x >= x0 && s.player.x <= x1;

async function inspect(b: Bot, x: number, label = 'İncele'): Promise<void> {
  await b.walkTo(x, 10);
  await b.act(label);
  await b.settle();
}

/** Jumps along a list of ledges from whichever one we stand on. */
/**
 * Climbs a list of stand points one jump at a time. `lean` moves the take-off
 * toward the next step and the aim back toward this one (px), like a player
 * jumping from the edge of a zig-zag ladder instead of from its middle.
 */
export async function climb(b: Bot, steps: [number, number][], tries = 20, lean: { takeoff: number; aim: number } = { takeoff: 0, aim: 0 }): Promise<void> {
  for (let n = 0; n < tries; n++) {
    const st = await b.s();
    const p = st.player!;
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
      // Top reached: stand on the step's stand point (prompts are local).
      const top = steps[idx]![0];
      if (Math.abs(p.x - top) > 10) await b.walkTo(top, 6, 8000).catch(() => undefined);
      return;
    }
    // A wisp dashes at Gorti mid-air: disperse it before jumping.
    await b.clearWisps();
    // Take off from this step's stand point: jump distance is limited.
    const dir = Math.sign(next[0] - steps[idx]![0]);
    const here = steps[idx]![0] + dir * lean.takeoff;
    if (Math.abs(p.x - here) > 10) await b.walkTo(here, 6, 8000).catch(() => undefined);
    await b.jumpTo(next[0] - dir * lean.aim);
    await b.wait(60);
  }
}

export const ROUTES: Record<string, Route> = {
  async r01(b) {
    await b.settle();
    await stages(b, 'r01', [
      { name: 'whale toy', when: (s) => !s.flags.includes('r01.toywhale'), run: () => inspect(b, 620) },
      // The toy blocks and the chest stand against the back wall: walk past.
      { name: 'marks', when: (s) => !s.flags.includes('r01.marks'), run: () => inspect(b, 1090) },
      { name: 'window', when: (s) => !s.flags.includes('r01.window'), run: () => inspect(b, 1441) },
      {
        name: 'leave',
        when: (s) => s.flags.includes('r01.door'),
        run: async () => {
          await b.walkTo(2190, 6, 30_000).catch(() => undefined);
          await b.untilRoom('r02');
        },
      },
    ]);
  },

  async r02(b) {
    const P: [number, number][] = [
      [1250, 2280],
      [1250, 2170],
      [1190, 2060],
      [1300, 1950],
      [1200, 1840],
      [1320, 1730],
      [1210, 1620],
      [1330, 1510],
    ];
    await stages(b, 'r02', [
      {
        name: 'to node',
        when: (s) => !s.flags.includes('r02.song') && on(s, 2280),
        run: async (s) => {
          if (s.player!.x < 560) {
            await b.walkTo(470, 6);
            await b.jumpTo(720);
          }
          await b.walkTo(1030, 10);
          await b.settle();
          await b.sing(['low', 'mid', 'high']);
          await b.settle();
        },
      },
      {
        name: 'down from the side alcove',
        when: (s) => s.flags.includes('r02.song') && (on(s, 1900, 110, 345) || on(s, 1880, 420, 570) || on(s, 1860, 700, 860)),
        run: async (s) => {
          // Drop back to the floor away from the thorns (x 500–620).
          const x = s.player!.x;
          await b.walkTo(x < 345 ? 370 : x < 600 ? 395 : 885, 6, 8000).catch(() => undefined);
          await b.waitFor((st) => !!st.player?.onGround, 4000, 'landed').catch(() => undefined);
        },
      },
      {
        name: 'root steps',
        when: (s) => s.flags.includes('r02.song') && (on(s, 2280) || P.some(([, y]) => on(s, y, 950, 1500))),
        run: async (s) => {
          if (on(s, 2280)) {
            if (s.player!.x < 560) {
              await b.walkTo(470, 6);
              await b.jumpTo(720);
            }
            await b.walkTo(1250, 10);
          }
          await climb(b, P);
          if (on(await b.s(), 1510)) {
            await b.walkTo(1270, 6);
            await b.jumpTo(1000);
          }
        },
      },
      {
        name: 'reach left',
        when: (s) => on(s, 1440, 820, 1140),
        run: async () => {
          // Well inside the ledge (left edge at 820).
          await b.walkTo(870, 6);
          await b.face(-1);
          await b.reach();
        },
      },
      {
        name: 'left ledges',
        when: (s) => on(s, 1250, 100, 450) || on(s, 1140, 470, 690) || on(s, 1030, 240, 460),
        run: async () => {
          await climb(b, [
            [400, 1250],
            [500, 1140],
            [415, 1030],
          ]);
          if (on(await b.s(), 1030)) {
            // Right edge at 450: stay clear of it, the anchor is still in reach.
            await b.walkTo(415, 6);
            await b.face(1);
            await b.reach();
          }
        },
      },
      {
        name: 'upper ledges',
        when: (s) => on(s, 900, 750, 1130) || on(s, 790, 1170, 1390) || on(s, 680, 890, 1130) || on(s, 570, 840, 1060),
        run: async () => {
          // Take-offs near the facing edges (with a margin for overshoot):
          // from the middle of the 790 root, 680 is out of jumping range.
          await climb(b, [
            [1085, 900],
            [1215, 790],
            [1010, 680],
            [1025, 570],
            [1200, 460],
          ]);
        },
      },
      {
        name: 'exit',
        when: (s) => on(s, 460, 1090, 1600),
        run: async () => {
          await b.walkTo(1590, 6, 20_000).catch(() => undefined);
          await b.untilRoom('r03');
        },
      },
      {
        name: 'recover from alcove/odd spot',
        when: (s) => !!s.player && s.player.onGround,
        run: async (s) => {
          // Drop to the floor if somewhere unexpected.
          await b.walkTo(s.player!.x < 800 ? 150 : 1450, 10, 8000).catch(() => undefined);
        },
      },
    ]);
  },
  async r03(b) {
    const BR: [number, number][] = [
      [2400, 1180],
      [2535, 1070],
      [2730, 960],
      [2520, 850],
    ];
    const UP: [number, number][] = [
      [2520, 850],
      [2740, 740],
      [2530, 630],
      [2750, 520],
      [2540, 410],
      [2760, 300],
    ];
    await stages(b, 'r03', [
      {
        name: 'tunnel and first anchor',
        when: (s) => on(s, 1200, 0, 700),
        run: async (s) => {
          if (s.player!.x < 540) {
            await b.walkTo(372, 6);
            await b.face(1);
            await b.act('Rezonans');
            await b.wait(700);
          }
          await b.walkTo(682, 6);
          await b.face(1);
          await b.reach();
        },
      },
      {
        name: 'second anchor',
        when: (s) => on(s, 1130, 955, 1095),
        run: async () => {
          await b.walkTo(1075, 6);
          await b.face(1);
          await b.reach();
        },
      },
      {
        name: 'breath crossing',
        when: (s) => on(s, 1180, 1340, 1725),
        run: async () => {
          await b.walkTo(1702, 5);
          await b.keyDown('KeyQ');
          await b.wait(250);
          await b.jumpTo(1860);
          await b.jumpTo(2030);
          await b.jumpTo(2215);
          await b.keyUp('KeyQ');
        },
      },
      {
        name: 'out of the pit',
        when: (s) => on(s, 1340, 1720, 2150) || on(s, 1260, 1715, 1795),
        run: async (s) => {
          if (s.player!.y > 1300) {
            await b.walkTo(1810, 6);
            await b.jumpTo(1752);
          }
          await b.jumpTo(1660);
        },
      },
      {
        name: 'moon and sun',
        when: (s) => on(s, 1180, 2150, 3000) && !s.flags.includes('r03.sun'),
        run: async (s) => {
          await b.walkTo(2300, 10);
          if (!s.flags.includes('r03.moon')) {
            await b.sing(['high', 'mid', 'low']);
            await b.settle();
          }
          await b.sing(['low', 'mid', 'low', 'high']);
          await b.settle();
        },
      },
      {
        name: 'star',
        when: (s) => s.flags.includes('r03.sun') && !s.flags.includes('r03.star') && !!s.player?.onGround,
        run: async (s) => {
          if (on(s, 1180)) await b.walkTo(2400, 8);
          await climb(b, BR, 20, { takeoff: 55, aim: 25 });
          await b.walkTo(2520, 8, 8000).catch(() => undefined);
          await b.act('Yıldızı topla');
          await b.settle();
        },
      },
      {
        name: 'bind',
        when: (s) => s.flags.includes('r03.star') && !s.flags.includes('r03.bloom') && !!s.player?.onGround,
        run: async (s) => {
          if (!on(s, 1180)) await b.walkTo(2380, 6, 8000).catch(() => undefined);
          await b.walkTo(2600, 12);
          await b.act('Yıldızı ağaca bağla');
          await b.settle();
        },
      },
      {
        name: 'climb the bloom',
        when: (s) => s.flags.includes('r03.bloom') && !!s.player?.onGround,
        run: async (s) => {
          if (on(s, 1180)) await b.walkTo(2400, 8);
          // Root ledges 150–200 px wide, 50 px apart: jump from the near edge.
          await climb(b, [...BR, ...UP.slice(1)], 20, { takeoff: 55, aim: 25 });
          await b.untilRoom('r04', 20_000);
        },
      },
    ]);
  },
  async r04(b) {
    await stages(b, 'r04', [
      {
        name: 'breath steps',
        when: (s) => on(s, 900, 0, 1250),
        run: async () => {
          await b.walkTo(1232, 5);
          await b.keyDown('KeyQ');
          await b.wait(250);
          await b.jumpTo(1385);
          await b.jumpTo(1525);
          await b.jumpTo(1710);
          await b.keyUp('KeyQ');
        },
      },
      {
        name: 'out of the ditch',
        when: (s) => on(s, 960, 1250, 1650),
        run: async () => {
          await b.walkTo(1275, 6);
          await b.jumpTo(1200);
        },
      },
      {
        name: 'memory pool',
        when: (s) => on(s, 640, 1650, 2550) && !s.flags.includes('r04.human'),
        run: async () => {
          await b.walkTo(2300, 10);
          await b.act('Havuza bak');
          await b.settle();
        },
      },
      {
        name: 'grounding',
        when: (s) => s.flags.includes('r04.human') && !s.flags.includes('r04.transformed'),
        run: async () => {
          await b.holdFocus(1900);
          await b.wait(300);
        },
      },
      {
        name: 'onward',
        when: (s) => s.flags.includes('r04.transformed') && !!s.player?.onGround,
        run: async () => {
          await b.walkTo(3445, 6, 40_000).catch(() => undefined);
          await b.untilRoom('r05', 20_000);
        },
      },
    ]);
  },

  async r05(b) {
    const form = async (want: 'root' | 'human', siteX: number): Promise<void> => {
      const s = await b.s();
      if (s.player!.form === want) return;
      await b.walkTo(siteX, 6);
      await b.tap('KeyR');
      await b.waitFor((x) => x.player!.form === want && x.player!.state === 'normal', 5000, `form ${want}`);
    };
    const stone = async (i: number): Promise<{ x: number; bottom: number }> => {
      const s = await b.s();
      return ((s.extra.stones as ({ x: number; bottom: number } | null)[])[i])!;
    };
    const push = async (i: number, flag: string): Promise<void> => {
      const st = await stone(i);
      await b.walkTo(st.x - 30 - 17 - 6, 6);
      await b.keyDown('KeyD');
      await b.waitFor((x) => x.flags.includes(flag) || !x.player!.onGround, 20_000, `push ${flag}`);
      await b.wait(300);
      await b.keyUp('KeyD');
    };
    await stages(b, 'r05', [
      {
        name: 'first stone',
        when: (s) => !s.flags.includes('r05.plateA') && on(s, 1100, 0, 1300),
        run: async () => {
          await form('human', 380);
          const st = await stone(0);
          if (st.x > 1240 || st.bottom < 1090) {
            await b.walkTo(560, 8);
            await b.act('Taşı geri çağır');
            await b.wait(900);
          }
          await push(0, 'r05.plateA');
        },
      },
      {
        name: 'up to the elevated path',
        when: (s) => s.flags.includes('r05.plateA') && !s.flags.includes('r05.plateB') && on(s, 1100, 0, 2480),
        run: async () => {
          await form('root', 1050);
          // The stone now sits on the plate; reach over it from its left.
          await b.walkTo(1126, 5);
          await b.face(1);
          await b.reach();
        },
      },
      {
        name: 'second stone',
        when: (s) => s.flags.includes('r05.plateA') && !s.flags.includes('r05.plateB') && on(s, 820, 1300, 2000),
        run: async () => {
          await form('human', 1520);
          await push(1, 'r05.plateB');
        },
      },
      {
        name: 'drop from the path',
        when: (s) => s.flags.includes('r05.plateB') && on(s, 820, 1300, 2000),
        run: async () => {
          await b.walkTo(2060, 6, 10_000).catch(() => undefined);
        },
      },
      {
        name: 'gate and anchors',
        // Also from the top of the pushed stone.
        when: (s) => s.flags.includes('r05.plateB') && !!s.player?.onGround && s.player.y > 1000 && s.player.x > 1200 && s.player.x < 2980,
        run: async () => {
          await b.walkTo(2600, 10);
          await form('root', 2700);
          await b.walkTo(2802, 5);
          await b.face(1);
          await b.reach();
        },
      },
      {
        name: 'ledge anchor',
        when: (s) => on(s, 850, 2970, 3240),
        run: async () => {
          await b.walkTo(3200, 5);
          await b.face(1);
          await b.reach();
        },
      },
      {
        name: 'hilltop',
        when: (s) => on(s, 640, 3395, 3900),
        run: async (s) => {
          if (!s.flags.includes('r05.moon')) {
            await b.walkTo(3620, 10);
            await b.settle();
          }
          await b.walkTo(3890, 5, 15_000).catch(() => undefined);
          await b.untilRoom('r06', 20_000);
        },
      },
    ]);
  },

  async r06(b) {
    const KNOTS: { id: string; x: number; y: number }[] = [
      { id: 'k1', x: 1000, y: 900 },
      { id: 'k2', x: 1780, y: 740 },
      { id: 'k3', x: 2450, y: 900 },
    ];
    // Unstable thorns at x≈2190 guard the ground right of the mound; a
    // resonance pulse disperses them.
    const clearThorns = async (): Promise<void> => {
      for (let i = 0; i < 3; i++) {
        const st = await b.s();
        if (!st.prompts.some((x) => x.includes('Rezonans'))) return;
        await b.tap('KeyE');
        await b.wait(700);
      }
    };
    const toMound = async (): Promise<void> => {
      const s = await b.s();
      if (on(s, 740, 1620, 1940)) return;
      if (on(s, 820, 1940, 2050)) {
        await b.jumpTo(1880);
        return;
      }
      if (on(s, 900) && s.player!.x > 2050) {
        if (s.player!.x > 2150) {
          await b.walkTo(2290, 8);
          await clearThorns();
        }
        await b.walkTo(2095, 6);
        await b.jumpTo(1995);
        await b.jumpTo(1880);
        return;
      }
      await b.walkTo(1455, 6);
      await b.jumpTo(1560);
      await b.jumpTo(1700);
    };
    const pastMound = async (): Promise<void> => {
      const s = await b.s();
      if (on(s, 900) && s.player!.x > 2250) return;
      if (s.player!.x < 2100) {
        await b.walkTo(2085, 6, 15_000);
        await clearThorns();
      }
      await b.walkTo(2400, 8);
    };
    await stages(b, 'r06', [
      {
        name: 'shout',
        when: (s) => !s.flags.includes('r06.shout'),
        run: async () => {
          await b.walkTo(580, 8, 15_000).catch(() => undefined);
          await b.settle(120_000);
        },
      },
      ...KNOTS.map(
        (k): Stage => ({
          name: `knot ${k.id}`,
          when: (s) => s.flags.includes('r06.shout') && !s.flags.includes(`r06.${k.id}`) && KNOTS.findIndex((x) => !s.flags.includes(`r06.${x.id}`)) === KNOTS.indexOf(k) && !!s.player?.onGround,
          run: async () => {
            if (k.id === 'k2') await toMound();
            if (k.id === 'k3') await pastMound();
            await b.walkTo(k.x - 40, 8);
            await b.holdFocus(1600);
            await b.act('Düğümü bağla');
            await b.settle();
          },
        }),
      ),
      {
        name: 'mount',
        when: (s) => s.flags.includes('r06.horse') && !!s.player?.onGround,
        run: async () => {
          await toMound();
          await b.walkTo(1700, 8);
          await b.act('Ata bin');
          await b.settle();
          await b.untilRoom('r07', 30_000);
        },
      },
    ]);
  },

  async r07(b) {
    await b.settle();
    const start = Date.now();
    let focusHeld = false;
    while (Date.now() - start < 360_000) {
      const s = await b.s();
      if (s.room !== 'r07') return;
      if (s.busy || s.context !== 'gameplay') {
        if (focusHeld) {
          await b.keyUp('KeyQ');
          focusHeld = false;
        }
        await b.settle(60_000).catch(() => undefined);
        continue;
      }
      const h = s.extra.horse as { x: number; y: number; grounded: boolean; vx: number; bridges: boolean[] } | undefined;
      if (!h) {
        await b.wait(50);
        continue;
      }
      const lead = Math.max(120, h.vx * 0.5);
      const ahead = (x: number, near: number, far: number): boolean => x - h.x > near && x - h.x < far;
      const jumpNow =
        h.grounded &&
        (RIDE_THORNS.some((x) => ahead(x, lead - 10, lead + 40)) ||
          RIDE_SHARDS.some((x) => ahead(x, lead - 10, lead + 40)) ||
          RIDE_GAPS.some(([a]) => ahead(a, 60, 110)) ||
          ahead(RIDE_MOUND[0], 90, 150));
      if (jumpNow) await b.tap('Space', 260);
      const chasm = RIDE_CHASMS.findIndex(([a, bb]) => h.x > a - 640 && h.x < bb - 60);
      const needFocus = chasm >= 0 && !h.bridges[chasm];
      if (needFocus && !focusHeld) {
        await b.keyDown('KeyQ');
        focusHeld = true;
      } else if (!needFocus && focusHeld) {
        await b.keyUp('KeyQ');
        focusHeld = false;
      }
      await b.wait(20);
    }
    throw new Error('ride did not finish');
  },

  async r08(b) {
    type Sun = { phase: string; flowers: number; currents: number; hits: number; window: boolean; sweep: { x: number; dir: number; type: string; phase: string } | null };
    const sun = async (): Promise<Sun | undefined> => (await b.s()).extra.sun as Sun | undefined;
    const dodge = async (): Promise<void> => {
      const s = await b.s();
      const sw = (s.extra.sun as Sun | undefined)?.sweep;
      if (!sw || sw.phase !== 'active' || sw.type !== 'low' || !s.player?.onGround) return;
      const d = (s.player.x - sw.x) * sw.dir;
      if (d > 0 && d < 95) await b.tap('Space', 300);
    };
    const walkDodging = async (x: number): Promise<void> => {
      for (let i = 0; i < 400; i++) {
        const s = await b.s();
        if (s.busy || s.dialogueOpen) {
          await b.releaseAll();
          await b.settle();
          continue;
        }
        const p = s.player!;
        if (Math.abs(p.x - x) < 12) {
          await b.keyUp('KeyA');
          await b.keyUp('KeyD');
          return;
        }
        await dodge();
        if (p.x < x) {
          await b.keyUp('KeyA');
          await b.keyDown('KeyD');
        } else {
          await b.keyUp('KeyD');
          await b.keyDown('KeyA');
        }
        await b.wait(25);
      }
      await b.releaseAll();
    };
    await b.settle();
    const t0 = Date.now();
    while (Date.now() - t0 < 420_000) {
      const s = await b.s();
      if (s.room !== 'r08') return;
      if (s.busy || s.dialogueOpen) {
        await b.releaseAll();
        await b.settle(90_000);
        continue;
      }
      const st = await sun();
      if (!st) {
        await b.wait(100);
        continue;
      }
      if (st.phase === 'p1') {
        await walkDodging(st.flowers === 0 ? 250 : 1030);
        await b.tap('KeyE');
        await b.wait(500);
      } else if (st.phase === 'p2') {
        await walkDodging([420, 640, 860][st.currents]!);
        await b.tap('KeyE');
        await b.wait(400);
      } else if (st.phase === 'p3') {
        if (st.window) {
          await b.keyDown('KeyQ');
          await b.wait(950);
          await b.keyUp('KeyQ');
          await b.wait(1500);
        } else {
          await walkDodging(640);
          await dodge();
          await b.wait(30);
        }
      } else if (st.phase === 'done') {
        await b.walkTo(1270, 6, 20_000).catch(() => undefined);
        await b.untilRoom('r09', 20_000);
        return;
      } else await b.wait(100);
    }
    throw new Error('sun encounter did not finish');
  },

  async r09(b) {
    await stages(b, 'r09', [
      {
        name: 'riverbank',
        when: (s) => on(s, 900, 0, 1300),
        run: async () => {
          await b.walkTo(1290, 6);
          await b.jumpTo(1400);
          await b.jumpTo(1570);
          await b.jumpTo(1760);
        },
      },
      {
        name: 'river stones',
        when: (s) => on(s, 880, 1355, 1445) || on(s, 872, 1525, 1615),
        run: async () => {
          await climb(b, [
            [1400, 880],
            [1570, 872],
            [1760, 900],
          ]);
        },
      },
      {
        name: 'in the river',
        when: (s) => on(s, 960, 1300, 1700),
        run: async () => {
          await b.walkTo(1660, 6);
          await b.jumpTo(1760);
        },
      },
      {
        name: 'to the pool',
        when: (s) => on(s, 900, 1700, 3200),
        run: async () => {
          await b.walkTo(2860, 10, 40_000);
          await b.act('Gözlerini kapat');
          await b.settle();
          await b.untilRoom('r10', 30_000);
        },
      },
      {
        name: 'down from the nest',
        when: (s) => on(s, 640, 2190, 2370),
        run: async () => {
          await b.walkTo(2400, 6, 8000).catch(() => undefined);
        },
      },
    ]);
  },

  async r10(b) {
    const solveStation = async (x: number): Promise<void> => {
      await b.walkTo(x, 10);
      await b.act('Anıyı geri sar');
      await b.waitFor((s) => s.puzzleOpen, 5000, 'puzzle open');
      await b.wait(600);
      if (b.touch) {
        // Touch: tap the first card, then the last one to swap them.
        await b.touchSelector('.puzzle .card', 0);
        await b.wait(250);
        await b.touchSelector('.puzzle .card', 2);
      } else {
        await b.tap('KeyE');
        await b.wait(200);
        await b.tap('ArrowRight');
        await b.wait(150);
        await b.tap('ArrowRight');
        await b.wait(150);
        await b.tap('KeyE');
      }
      await b.waitFor((s) => !s.puzzleOpen, 8000, 'puzzle solved');
      await b.settle();
    };
    await stages(b, 'r10', [
      { name: 'station 1', when: (s) => !s.flags.includes('r10.s1') && !!s.player?.onGround, run: () => solveStation(760) },
      { name: 'station 2', when: (s) => s.flags.includes('r10.s1') && !s.flags.includes('r10.s2') && !!s.player?.onGround, run: () => solveStation(1650) },
      { name: 'station 3', when: (s) => s.flags.includes('r10.s2') && !s.flags.includes('r10.s3') && !!s.player?.onGround, run: () => solveStation(2500) },
      {
        name: 'keep the torch lit',
        when: (s) => s.flags.includes('r10.s3'),
        run: async () => {
          for (let i = 0; i < 70; i++) {
            const s = await b.s();
            if (s.room !== 'r10' || s.busy) break;
            await b.tap('KeyE', 60);
            await b.wait(110);
          }
          await b.settle(120_000);
          await b.untilRoom('r11', 60_000);
        },
      },
    ]);
  },

  async r11(b) {
    // A waist-high metal block at x 420–520 has to be jumped.
    const pastBlock = async (): Promise<void> => {
      const s = await b.s();
      if (on(s, 820) && s.player!.x < 430) {
        await b.walkTo(392, 6);
        await b.jumpTo(470);
      }
    };
    await stages(b, 'r11', [
      {
        name: 'align the key-eye',
        when: (s) => !s.flags.includes('r11.m1') && (on(s, 820) || on(s, 740, 420, 520)),
        run: async () => {
          await pastBlock();
          await b.walkTo(900, 8);
          await b.act('Anahtar gözünü hizala');
          for (let i = 0; i < 9; i++) {
            await b.tap('ArrowRight', 60);
            await b.wait(120);
          }
          await b.tap('KeyE');
          await b.waitFor((s) => s.flags.includes('r11.m1'), 5000, 'wall open');
          await b.settle();
        },
      },
      {
        name: 'reveal the lock',
        when: (s) => s.flags.includes('r11.m1') && !s.flags.includes('r11.m2') && on(s, 820),
        run: async () => {
          await b.walkTo(1830, 8);
          await b.holdFocus(1500);
          await b.act('Kilide bak');
          await b.waitFor((s) => s.flags.includes('r11.m2'), 5000, 'lock');
        },
      },
      {
        name: 'climb to the legs',
        when: (s) => s.flags.includes('r11.m2') && !!s.player?.onGround && s.player!.y > 600,
        run: async () => {
          await b.walkTo(1700, 6);
          await climb(b, [
            [1700, 820],
            [1790, 740],
            [1850, 650],
            [1970, 560],
          ]);
        },
      },
      {
        name: 'wake Gorti',
        when: (s) => s.flags.includes('r11.m2') && on(s, 560, 1900, 2800),
        run: async () => {
          await b.walkTo(2530, 8);
          await b.keyDown('KeyE');
          await b.wait(2700);
          await b.keyUp('KeyE');
          await b.settle(60_000);
          await b.untilRoom('r12', 30_000);
        },
      },
    ]);
  },

  async r12(b) {
    const readDoc = async (x: number): Promise<void> => {
      await b.walkTo(x, 10);
      await b.act('Belgeyi incele');
      await b.waitFor((s) => s.docOpen, 5000, 'doc open');
      await b.wait(700);
      await b.tap('KeyE');
      await b.waitFor((s) => !s.docOpen, 5000, 'doc closed');
      await b.wait(200);
    };
    await b.settle(60_000);
    await b.walkTo(1545, 8, 60_000);
    await b.act('Kapıyı aç');
    await b.wait(600);
    await readDoc(1990);
    await readDoc(2150);
    await readDoc(2310);
    await b.walkTo(2150, 10);
    await b.act('Son sayfayı çevir');
    await b.waitFor((s) => s.docOpen, 5000, 'clause page');
    await b.wait(700);
    await b.tap('KeyE');
    await b.waitFor((s) => s.docOpen, 5000, 'final page');
    await b.wait(900);
    await b.tap('KeyE');
    await b.waitFor((s) => s.scenes.includes('ending') && s.endingOpen, 60_000, 'ending');
  },

};
