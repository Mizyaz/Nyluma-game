# Brief 3 — Rascals and action moves: enemies for a gentle world

You are working on "Kristaller Dünyası — 14. Oda", a narrative 2.5D game (Phaser 4.2.1, TypeScript strict, Vite 7, Turkish UI). Your job: give the game its first enemies, modelled as paper puppets with action moves you can read at a glance, and give Gorti the action moves to meet them.

Do it the way this world works:
- nobody dies;
- the player always progresses;
- every encounter ends with something turning into something better.

## What the user asked for

In their words: "Şimdi gel konuşalım düşman modellemesi aksiyon hareketleri nasıl olabilir." That is: now let's talk about how the enemies could be modelled and what their action moves could be.

The design below is the default. If the user changes any decision, the lead will tell you at launch; their word wins over this brief.

## Why it must be gentle

- **Earlier wishes:** the user had health and hazards removed, and made every room open so that the player always progresses.
- **The story text:** it was just rewritten for children, and even whipping and cutting were taken out of it.
- **So the enemies are mischievous, not evil.** In the game they are called **haylazlar** (rascals). Nothing is gory, cruel or scary.
- **No losing:** nobody dies, and there is no game over, no reload and no lost progress.
- **Every meeting ends in a change:** a rascal is calmed and transformed. This echoes the story's line "yalanlar bile ruhların kendi dallarında meyve vermeliydi" (even lies should bear fruit on the souls' own branches).

## The rascals (defaults)

Each one comes from a theme of the story and its chapter.

### 1. Damga Böceği (Stamp Beetle)

The Committee's clerks, from chapter 5, "Hak Aktarımı".

- **Look:** a beetle whose shell is a rubber stamp with a wooden handle, standing on ink-pad feet.
- **Idle:** it scuttles about.
- **Tell:** it rears up, and its stamp face inks dark for about 0.6 s.
- **Act:**
  - it hops in an arc and slams down with a comic word ("TAK!");
  - it leaves a little ink stamp on the floor ("DEVREDİLDİ");
  - flowers it lands on turn to grey paper until Gorti blooms them back.
- **Recover:** it is stuck upside down, dizzy, for about 1.2 s. That is the window to calm it.
- **Calmed by:**
  - a jump on it: it pops like a cork and flips;
  - the bloom: the flowers roll it over;
  - the vine reach.
- **Becomes:** a paper boat or a paper bird that sails away.

### 2. Tik-Tak (Clock Soldier)

From Gorti's youth: "herkesi saate uydurup küçük robotlara çevirdiği günler" (the days he set everyone to the clock and turned them into little robots). Chapter 4, "İç Koğuş".

- **Look:** a wind-up tin soldier with a clock face and a winding key on its back.
- **Idle:** it marches exactly on the beat, following the music's tempo if you can read it.
- **Tell:** the bells on its head shake.
- **Act:**
  - an alarm ring travels along the floor (jump over it, or dodge in depth);
  - flowers and small creatures it reaches freeze into tin poses for a moment.
- **Calmed by:**
  - breaking its rhythm: an off-beat note of the song, or the amca's laugh, so that it loses count and spins;
  - the vine snapping its key, the way the sparrow snapped the watch strap.
- **Becomes:** a music box that plays a few notes, then a tin bird.

### 3. Yalan Gölgesi (Lie Shade)

The lies of chapter 2, "Yüzey ve Yalanlar". The story says: "Yalan dediğin, ancak bir doğru varken doğar" (a lie is only born where there is a truth).

- **Look:** an ink blot wearing a borrowed silhouette: Gorti's, but slightly wrong.
- **Movement:**
  - it slides flat over the floor and up the back wall, like a shadow;
  - it stands up as a card;
  - lamps it passes grow dim.
- **Tell:** it stretches tall and wobbles.
- **Act:** it lunges flat along the floor toward Gorti, or wraps itself around a lamp.
- **Calmed by:**
  - light: Gorti's glow while he holds Nefes, or the kahkaha that swaps the Sun and the Moon;
  - the bloom.
- **Becomes:** a fruit on a branch. Picking it is optional; it could count in the journal.

### When a rascal touches Gorti

- He is pushed back a little ("PAT!").
- One of the buds at the tips of his head tendrils closes. In forms without tendrils, his glow dims one step instead.
- When all three buds are closed:
  - he sits down, dizzy, for about 2 s;
  - the rascals lose interest and wander back;
  - the buds reopen over a few seconds.
- No numbers on screen, and no game over.
- An option the user may pick: a "Haylazlar" setting with two choices, Normal and Sakin. Sakin rascals never chase.

## Gorti's action moves (defaults)

Keep what exists:

- **Zıpla:** jump.
- **Rezonans:** the context move (bloom, earth, laugh or spark).
- **Biçim:** form.
- **Şarkı:** the song: three notes (deep, middle, high), as in the whale language.
- **Nefes:** focus, held.

Add these:

a. **Sarmaşık Uzanışı (vine reach).**
   - A quick vine reaches about 200 px forward from his head tendrils.
   - It catches a rascal or a thing and binds it with blooming vines; the rascal wriggles and is calmed.
   - Build it on the existing reach (`Player.startReach`, `ReachPlan`).
   - When a rascal is in reach, it is the action button's prompt ("Uzan", with a vine drawing).
   - No whips: the story removed them.
b. **Kâğıt Kaçış (paper dodge).**
   - A quick sidestep: Gorti turns edge-on like a card and slips through.
   - Nothing can touch him for about 0.3 s.
   - It can also hop a lane in depth (z).
   - It belongs to the paper engine: the puppets already turn through edge-on (`RigView.setFacing`), and walking in depth already exists (`Player.z`).
c. **Kök Dalgası (root wave).**
   - In the air, down plus Zıpla: he drops and plants his roots.
   - A ring of crystal sprouts runs along the floor; it gently flips stamp beetles and stops alarm rings.
d. **Gerçek Ad (true name).**
   - Each kind of rascal has a three-note name. Once Gorti has met one, it shows as little notes over its head.
   - Singing it (the song, as in r03) calms the nearby rascals of that kind.
   - This rewards musical play over button mashing.

Moves may grow with the story, the way the Rezonans tiers do (`src/gameplay/moves/tiers.ts`).

### Input

- Every move must work with a keyboard, a gamepad and touch.
- Actions are in `src/engine/systems/InputSystem.ts` (`Action`). Their bindings are in `src/tuning.ts`.
- Touch:
  - The touch layout is a pure function with unit tests (`src/ui/touchLayout.ts`, `tests/unit/touchLayout.test.ts`).
  - A new chip must keep every screen size passing, with no overlaps and every target at least 44 px.
  - Prefer contexts and gestures to new buttons.
- Update the control hints (with the curly apostrophe) and the help toasts.

## How to build them

- **Code.**
  - Make an `Enemy` base, for example in `src/gameplay/foes/`.
    - It runs a state machine: idle → notice → tell → act → recover → calmed.
    - It has an x and y position plus a z lane, a facing, a hit area in 2.5D, a seeded rng and reactions to moves.
  - Put each kind in its own file.
  - Put every number in `src/tuning.ts` (e.g. `FOES`), not in literals.
  - Keep the pure logic free of Phaser so that it can be unit-tested, like `AbilitySystem.ts`.
- **Models.**
  - They are paper puppets with parts, poses for each state (key poses and in-betweens), the turn, limb depth, a cast shadow and contact shadows. See `src/render/2d/rig/` and the characters in `src/content/characters/`.
  - They stand on the paper stage at their depth, the way Gorti does (`WorldScene.standDepth`, `Planes.free`).
  - Give them big, clear silhouettes that read on a phone.
  - Make tells nobody can miss: a pose change, a colour flash, a comic word (`src/render/2d/fx/comicWords.ts`) and a sound.
- **Sounds:** small pops, ticks, ink squelches and bells. Funny, never frightening.
- **Placement in room JSON.**
  - For example: `"foes": [{ "kind": "stampBeetle", "x": 900, "z": 0, "patrol": [700, 1200] }]`.
  - Extend `room.schema.json` (`npm run kd -- schema` rebuilds it) and the CLI's `check` and `show`.
  - Document the field in Turkish in `src/content/chapters/README.md`.
- **Where, in this first round.**
  - Make a new training room in chapter 6 ("Boş Odalar"), for example `b05` "Haylazlar Odası".
  - It introduces the three rascals one by one, then all together.
  - It opens the next room once they are calmed.
  - Don't put rascals into the story rooms r01–r12 yet: the user decides that after seeing them.
  - The debug scene list (unlock all) lists the new room.
- **A dev page.** It shows each rascal's poses and a live loop of its cycle, like `/dev/creatures.html`. It stays out of the production build.
- **A short design note in Turkish for the user:** `docs/HAYLAZLAR.md`. It covers each rascal, each move and where the numbers are tuned.

## If time is short

Finish fewer things well rather than everything roughly. Work in this order:

1. The enemy system, the Stamp Beetle, the vine reach, the paper dodge and `b05`.
2. The Tik-Tak and the true names.
3. The Lie Shade and the root wave.

Report what is done and what is not.

## What must hold

- **No fail state.** Test both:
  - after any number of touches, Gorti can be controlled again within a few seconds;
  - a room with rascals can always be passed.
- **The story rooms** and the full campaign are untouched and still pass.
- **Reduced motion:** tells are shorter and there is no screen shake. The comic words stay.
- **The Canvas renderer** still works.
- **Performance:** measure frame times in `b05` with all three rascals awake, at 1280×720 and at 844×390 (dpr 2).

## How to verify

- **Filmstrips.** Show each rascal's whole cycle (idle, tell, act, recover, calmed, transformed) and each new move, at:
  - 1280×720;
  - 844×390 (dpr 2, touch);
  - 390×844 held upright (dpr 3, touch).

  Look at every frame. Iterate until they are charming and read at a glance.
- **Unit tests:**
  - the state machines: given time and inputs, they make the right transitions, and every tell lasts at least its minimum readable time;
  - hits in 2.5D lanes;
  - the dodge window;
  - matching a true name;
  - the no-fail rule.
- **e2e tests:**
  - enter `b05`, calm a stamp beetle in two different ways, and leave;
  - by touch, the dodge and the vine reach work;
  - `kd check` accepts the new room.

## Where and how to work

- Read `docs/HANDOFF.md` first. It carries what earlier sessions learned about the user, the paper engine and the tests.
- Your git worktree is `{ROOT}/kd-foes`, on branch `rascals`. The lead makes it from the current `paper-engine`.
  - `node_modules` is a symlink to the main repo's; don't run `npm install`.
  - Work and commit only there. Don't touch `{MAIN}`, the other `{ROOT}/kd-*` worktrees or other branches.
  - Never push, merge, rebase or change remotes. The lead merges your branch.
- Scratch files, tools, screenshots and logs go in `{ROOT}/kd-shots/foes/`. Never commit them.
- Ports:
  - Dev server on 5471: `npx vite --port 5471 --strictPort --host 127.0.0.1`, in the background.
  - Static and e2e servers on 5631,5632,5633: `KD_E2E_PORTS=5631,5632,5633`.
  - Never use 4173–4175, 5411–5423 or another agent's ports.
  - Stop only processes you started, by PID; never `pkill -f`.
  - Don't `sleep` in the foreground; wait inside scripts instead.
- Screenshots:
  - Use Playwright with the preinstalled Chromium. Launch it with `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` for WebGL.
  - `?room=r01` opens a room in dev and e2e builds.
  - `window.__kd` (`src/engine/testProbe.ts`) reads and steers the game: `state()`, `game()`, `world()`, `tp(x)`.
  - Two helpers are in the repo:
    - `node scripts/snap.mjs '<json>'` opens a room on your server (`"port": 5471`), steps the game and takes screenshots: tp, z, wait, frames, shot, eval, key, settle. Its header lists the options.
    - `python3 scripts/montage.py out.png cols label=file ...` lays screenshots on one contact sheet.
- Look at every screenshot you take (Read the PNG). The user judges by eye, so iterate until it looks genuinely good, not merely working.

## The user's taste (for all art)

- Whimsical, storybook, real 2.5D:
  - every room is a paper box with its front torn open;
  - every drawing is a card standing at its own depth;
  - characters are paper puppets.
- Pastel colours with crisp, rich, hand-made detail: "pastel demek detayı düşürmek demek değil" (pastel does not mean less detail).
- Contours in each fill's own darker tone, never black ink.
- Cel shadows low on the left and glints high on the right.
- Adaptive line width: thicker on big shapes, thinner on inner details, balanced with the fill.
- Draw everything by hand as SVG in code. The house style is in:
  - `src/content/characters/kit.ts` (`comic()`, `ink()`)
  - `src/render/2d/style.ts`
  - `src/render/2d/svg.ts`
  - recent art in `src/content/art/`
- Never trace the user's paintings, and never extract their lines or colours. Never add a painting, or crops of one, to the repo.
- Gorti has no pupils, no smile and no mouth: his face is a screen.
- Child-friendly: nothing gory, cruel or frightening.

## Checks

Run all of these and report each exact command with its result:

- `npm run typecheck`
- `npx vitest run`
- `npm run kd -- check`
- `npm run build`
- `npm run build:e2e`
- `KD_E2E_PORTS=5631,5632,5633 npx playwright test --grep-invert @campaign --output {ROOT}/kd-shots/foes/pw` (about 15 minutes)
- `KD_E2E_PORTS=5631,5632,5633 npx playwright test --grep @campaign --output {ROOT}/kd-shots/foes/pw` (about 14 minutes; both full playthroughs)

If a test fails, find the real cause and fix it. Never skip, disable or weaken a test of behaviour that is kept.

## Repo rules

- Commit early and often on your branch. Each message says what changed and why.
- Every commit message ends with the two attribution lines the lead gives you at launch: Co-Authored-By and Claude-Session.
- Write model names or IDs nowhere else in the repo.
- Match the naming and the comment density of the surrounding code. No unrelated refactors.
- Text the player sees:
  - It is Turkish and lives in `src/content/text/*.json` (or in the room JSON).
  - Write it in natural, child-friendly Turkish, like the rest.
  - Key hints use the curly apostrophe ("E’ye bas") so that `src/ui/controlText.ts` rewrites them for touch.
- Add a short section to `docs/HANDOFF.md` on what you built: how it works and where its numbers are.
- Don't edit `QA_REPORT.md`; the lead writes it from your report.

## Your final report (the lead reads it; the user does not)

- What you built, and why it looks and feels the way it does.
- The files you changed.
- Every check you ran: the exact command and its result (passed, failed and skipped counts, duration).
- Paths to the before and after filmstrips and montages.
- Measurements before and after: durations and frame times.
- Your commits, with hashes.
- What you did not finish, what you could not verify, and what still looks off.

Report only what you actually ran and saw.
