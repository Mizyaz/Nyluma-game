# Brief 2 — Whales that swim: bodies that bend, breach and dive

You are working on "Kristaller Dünyası — 14. Oda", a narrative 2.5D game (Phaser 4.2.1, TypeScript strict, Vite 7; Turkish UI). Your job is to make its whales feel alive: heavy, graceful and powerful, swimming through earth and air as if they were water. Today they are rigid cutouts that bob in place.

## What the user asked for

"Balina modelleri daha dinamik olmalı" — the whale models should be more dynamic. Earlier the user asked for realistic whales (sperm, blue, bowhead) with their sounds. Keep that.

## What is there now

- **Art:** `src/content/characters/whales.ts`.
  - Three species, sperm, blue and bowhead, in true proportions, drawn as flat pastel cutouts.
  - Each whale is a set of parts: body, tail stock, flukes, pectoral fin, jaw and eyelid, plus a species spout.
  - Anatomy is in body units: u runs along the body from the flukes to the snout, v runs down from the back line.
  - Each whale has a flat stretch of back that a platform's top follows.
  - Each species is drawn at a few back lengths (`WHALE_SIZES`).
- **Motion:** `src/gameplay/actors/WhaleActor.ts` animates the rigid parts in code:
  - slow undulation through part rotations, tail beats, fin sway and a bob;
  - blinks, and a spout now and then;
  - a dip on a spring when something lands;
  - the jaw opens when the whale calls.
- **Platforms:** `src/gameplay/whales/WhalePlatforms.ts` and `whalePlan.ts`.
  - A platform whale's flat back sits exactly on the platform's top line. Collision stays with the room.
  - Landings make bubbles, drops and a call.
  - A set piece's whales arrive their own way: rising out of the earth, gliding in on the wind, or circling a trunk.
  - Scenery whales bear no weight.
- **Where they swim:**
  - **r02** (`src/content/rooms/r02.ts`, `scripts/r02.ts`): a blue whale passes through the earth (`WhaleActor.swim`). Its song raises a blue whale, a bowhead and a sperm whale, one above the other.
  - **r03:** whales circle the trunk, one turn every two whales. A blue whale lies across the poisoned pool as a one-way bridge, level with the banks.
  - **r04:** a sperm whale glides in on the wind over Gorti.
  - **r01:** a wooden toy whale prop (`p1.whale`).
  - `Whale` in `src/gameplay/actors/Creatures.ts` looks unused; check before you touch it.
  - The loading theatre's sky whale (`src/ui/loadingStage.ts`) is DOM and out of scope.
- **Sounds:** `src/engine/audio/whaleCalls.ts`. Each whale's voice sets the pitch of its calls.

## What to make

- **A body that bends.** Make the spine flexible:
  - a travelling wave from head to tail, its amplitude growing toward the flukes;
  - the up-and-down fluke strokes real whales swim with (seen from the side, the tail sweeps up and down);
  - the head pitching gently with each stroke.

  Ways to do it:
  - Phaser 4 still has `Rope`, and a new `mesh2d` (see `node_modules/phaser/src/gameobjects/`; `Mesh` and `Plane` were removed).
  - You could bend the printed body along a spline.
  - Or use more segments, with the contour hiding the joints.

  Pick what looks best and stays crisp: every part is printed at the exact device scale it shows at (`src/paper/press.ts`). If a technique does not draw in the Canvas renderer (`?canvas=1`), fall back there to today's rigid parts.
- **Secondary motion:**
  - pectoral fins that paddle and steer;
  - the jaw, and on the blue whale the throat pleats swelling on a lunge;
  - an eye that looks at Gorti and blinks;
  - breathing, with each species' true spout and timing (a blow, then the inhale):
    - blue whale: a tall, straight column;
    - sperm whale: a bushy spout, angled forward and to the left from the front of the head;
    - bowhead: a V.
- **Behaviours.** Choose them per place, as fits the scene:
  - breaching up out of the earth, with a spray of soil and crystals and rings spreading on the ground like ripples, then falling back;
  - diving with the flukes raised high, then sinking into the soil;
  - spy-hopping, head up, to look at Gorti;
  - rolling to flash the pale belly and fins;
  - banking turns;
  - a pod swimming with phase offsets;
  - answering Gorti's song and his presence: a look, slowing down, an answering call.

  Scenery whales may roam along paths, in loops and in depth, instead of floating in place.
- **2.5D:**
  - Whales swim in depth (z), crossing in front of and behind things.
  - They can turn toward or away from the viewer, the way the paper puppets turn: the shown width eases through edge-on (`src/render/2d/rig/RigView.ts`, `setFacing`).
  - The r04 wind whale banking toward the viewer is a good place for this.
- **Weight:** they are huge. Make them slow, heavy and powerful, with overlapping action, follow-through and ease, and only subtle squash and stretch.
- **Look:**
  - Keep each species true to its anatomy and proportions.
  - Keep the pastel cutout manner, with its stitches, labels and little leaves.
  - You may enrich the drawings in the house style: barnacles on the bowhead, the blue whale's mottling, the sperm whale's wrinkled skin.
- **Optional:** the r01 toy whale rocks on its wheels when Gorti passes it or inspects it.

## What must hold

- **The platform contract:** while anyone stands on a platform whale, its flat back stays on the platform line within half a pixel. Keep the bending in the head and the tail. The landing dip still works.
- **`tests/unit/walk.test.ts`:** no whale serves as a step, scenery whales bear no weight, and the bridge lies level with the floor.
- **The story beats** stay as they are. The e2e routes (`tests/e2e/routes.ts`) and the campaign go through all of them.
  - r02: the passing whale's song raises the three whales and parts the roots.
  - r03: the bridge and the whale spiral.
  - r04: the wind whale.
- **Sound:** the calls and each species' voice stay.
- **Reduced motion:** smaller amplitudes, and no breaches, dives or rolls.
- **Canvas renderer:** it still draws every whale right.
- **Performance:**
  - Measure frame times in r02 (four whales) and r03 (the spiral), before and after, at 1280×720 and 844×390 (dpr 2), the way `QA_REPORT.md` measures them.
  - Never rasterize per frame; reuse textures.

## How to verify

- **Filmstrips:** a frame every ~150 ms over 3–4 s, at 1280×720 and at 844×390 (dpr 2, touch), of:
  - each species swimming, breaching, diving and calling;
  - r02's pass and rise;
  - r03 with Gorti standing on the bridge, and the spiral;
  - r04's wind whale.
- **Before and after:** the same moments before and after your change. Look at every frame, and iterate until they read as living whales.
- **A whale-only motion preview** in the dev creatures page (`/dev/creatures.html`, `src/dev/creaturesPreview.ts`), e.g. `?whale=blue&anim=breach`. It helps; keep it out of the production build.
- **Unit tests** for the spine and wave math:
  - the back stays on the platform line while loaded;
  - the amplitudes stay within their limits;
  - the motion is deterministic for a given seed.

## Where and how to work

- Read `docs/HANDOFF.md` first. It carries what earlier sessions learned about the user, the paper engine and the tests.
- Your git worktree is `{ROOT}/kd-whales`, on branch `whale-motion`. The lead makes it from the current `paper-engine`.
  - `node_modules` is a symlink to the main repo's; don't run `npm install`.
  - Work and commit only there. Don't touch `{MAIN}`, the other `{ROOT}/kd-*` worktrees or other branches.
  - Never push, merge, rebase or change remotes. The lead merges your branch.
- Scratch files, tools, screenshots and logs go in `{ROOT}/kd-shots/whales/`. Never commit them.
- Ports:
  - Dev server on 5461: `npx vite --port 5461 --strictPort --host 127.0.0.1`, in the background.
  - Static and e2e servers on 5621,5622,5623: `KD_E2E_PORTS=5621,5622,5623`.
  - Never use 4173–4175, 5411–5423 or another agent's ports.
  - Stop only processes you started, by PID; never `pkill -f`.
  - Don't `sleep` in the foreground; wait inside scripts instead.
- Screenshots:
  - Use Playwright with the preinstalled Chromium. Launch it with `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` for WebGL.
  - `?room=r01` opens a room in dev and e2e builds.
  - `window.__kd` (`src/engine/testProbe.ts`) reads and steers the game: `state()`, `game()`, `world()`, `tp(x)`.
  - Two helpers are in the repo:
    - `node scripts/snap.mjs '<json>'` opens a room on your server (`"port": 5461`), steps the game and takes screenshots: tp, z, wait, frames, shot, eval, key, settle. Its header lists the options.
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
- `KD_E2E_PORTS=5621,5622,5623 npx playwright test --grep-invert @campaign --output {ROOT}/kd-shots/whales/pw` (about 15 minutes)
- `KD_E2E_PORTS=5621,5622,5623 npx playwright test --grep @campaign --output {ROOT}/kd-shots/whales/pw` (about 14 minutes; both full playthroughs)

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
