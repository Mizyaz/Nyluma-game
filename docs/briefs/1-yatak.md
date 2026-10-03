# Brief 1 — The wake-up: a living bed that branches and blooms

You are working on "Kristaller Dünyası — 14. Oda", a narrative 2.5D game (Phaser 4.2.1 + TypeScript strict + Vite 7, Turkish UI). Your job: turn Gorti's waking up in the first room into a small, artful set piece in which his bed comes alive. The bed moves, grows branches, bursts into flower and helps him up. Work carefully and verify by eye: the user judges this by how it looks and feels.

## What the user asked for

In their words: "Yataktan kalkış da daha artistic olmalı ve yatak move etmeli böyle dallamalar çiçeklenmeler." That is: getting out of bed should be more artistic too, and the bed should move: branching, blossoming.

## What is there now

- **The opening (r01, "14. Oda"):**
  - The game opens on the user's first painting.
  - The room dissolves out of it in a wide shot, and the camera glides in to Gorti asleep in his bed while z's drift up.
  - A key or a tap wakes him. Otherwise he wakes by himself after 18 s.
  - Code: `src/content/scripts/r01.ts` (`goToSleep`, `wake`, `WAKE_AFTER_MS`).
- **The wake cutscene:**
  - `wake()` plays the cutscene `r01.wake` through `w.narrative.play(id, run, end)`.
  - The camera comes close to his face (zoom 3.8). His lids flutter and open, he looks around and yawns.
  - The camera pulls back. He sits up, shuffles to the edge and stands.
  - It takes about 9.2 s from the key press until he can move.
  - The `end` handler sets the final state, also when the scene is skipped.
- **Gorti's pose and face:**
  - Lying and sitting: `Player.lie`, `Player.lieHip` and `Player.getupK` (`src/gameplay/Player.ts`).
  - His face: `eyelids`, `yawn`, `emote()`, `lookFor()` and `startIdle('stretch')`.
- **The bed:**
  - It is one flat image, `p1.bed`, 250×110, drawn in `src/content/art/painting1.ts` (`bed()`). It is pink and lilac; the mattress top is at local y 38, x 17–233.
  - It is placed in `src/content/rooms/r01.ts` at x 430, y 662, depth −20, and it never moves.
  - In r01.ts, `BED`, `FLOOR_Y`, `STEP_DOWN_X` and `BEDSIDE` tie Gorti's pose to it.
  - It can be inspected: `bed`, with its text in `src/content/text/inspect.json`.

## What to make

The bed is alive, and the wake-up is a duet between Gorti and his bed. Take these ideas further if you can do better.

### The bed

- **In parts.** Redraw it by hand as parts that can move: headboard, footboard, posts or legs, mattress, quilt and pillow. At rest it should look like the bed the user knows, with the same silhouette and colours. The user is redrawing painting 1 object by object with us, so keep it recognisable.
- **While he sleeps,** the bed breathes with him. The quilt rises and falls with his breath, and a few closed buds sit on the wood. Keep it subtle.
- **When he wakes,** the bed stirs.
- **Branching (dallanma).** Branches grow out of the posts and the headboard. They really grow; they don't fade in:
  - a tapered stroke extends, forks, and forks again;
  - twigs curl at their tips, and leaves unfurl along them;
  - the growth is seeded and hand-drawn in the house style, with ease and a little overshoot, not a generic L-system scribble;
  - some branches grow toward the viewer and some toward the back wall, so the parallax shows the 2.5D.
- **Blossoming (çiçeklenme).** Buds swell and open in a wave along the branches, petal by petal, in the room's pastel pinks, lilacs and creams. A few petals drift down, and a little pollen glows (lights with `cast: false`).
- **The bed moves and helps him up.** For example:
  - the quilt peels back by itself, like a leaf opening;
  - the mattress tilts and lifts him like a cradle;
  - a branch arches down to the floor as a step for him;
  - its rooted legs flex like knees.

  After he steps off, it bows or sways as if pleased and settles under its new crown of blossoms. Keep a light idle sway after that.

### Gorti's part

Choreograph it; don't have him get up "the way anyone does":

- His lids open as the first buds open, like call and response.
- His head tendrils uncurl.
- He stretches long, arms wide, as the bed lifts him.
- He steps down the branch and lands lightly in a small burst of petals.
- He turns back and looks at the bed for a beat.

Use his existing poses and expressions. Add rig poses if you need them; the rigs are in `src/content/characters/`.

### Camera, sound and text

- **Camera:** an elegant move within the lens's rules.
  - The eye never tilts; pan and zoom only (`w.camTo`, `w.zoomTo`, `PaperStage.keepInView`).
  - Start close on his face, pull back as the branches grow so the crown fills the frame, then settle on the play framing.
  - The black bars stay (the cinema scene, as now).
- **Sound:** soft and never loud: wood creaks, leaf rustle, little bloom chimes and a gentle rising cue. See `app.audio` and `src/music/` for what exists.
- **Text:**
  - If you add a caption, put it in `src/content/text/captions.json`, in natural, child-friendly Turkish like the rest.
  - Keep `intro1`, `intro2` and `intro3`.
  - Update the bed's inspect lines so they fit a bed that is now alive.

## What must hold

- **Timing:** today it takes 9.2 s from the key press until Gorti can move; stay within about 3 s of that. Measure before and after, and report both. The tests and the full campaign wait for `r01.awake`.
- **Skipping:** a skip at any moment lands on the final state:
  - Gorti stands on the floor at the step-down point;
  - the bed is fully grown and in bloom, with no half-grown branches;
  - every tween and timer is killed.
- **Coming back:** when Gorti re-enters r01 later (from r02, or after a reload), the bed is already grown and in bloom. It is never bare and the growth never replays. See the quest flags `r01.intro` and `r01.awake`.
- **Reduced motion:** no camera swoops and no long growth. The branches and flowers appear with short fades, and he gets up simply.
- **Canvas renderer (`?canvas=1`):** it still draws everything right. Nothing may depend on the box shader or the lamps to read.
- **Performance:** it must run on phones.
  - Print parts at the exact scale they show at (`src/paper/press.ts`; see how props and rigs are printed). Reveal them by scale, crop or mask, or draw with Phaser Graphics. Never rasterize SVG every frame.
  - Measure frame times during the growth at 1280×720 and at 844×390 (dpr 2), before and after, the way `QA_REPORT.md` measures them (SwiftShader).
- **Leave the rest of the room alone:**
  - the painting's dissolve and the wide shot;
  - the stone frame and the floor eye;
  - the startled shade with its "!!!";
  - the charms, the arms, the star creature, the toy whale and the door.

## How to verify

- **Filmstrips** of the whole wake-up: a frame every ~250 ms from the key press until control returns. Make one each:
  - at 1280×720;
  - at 390×844 upright (dpr 3, touch);
  - at 844×390 sideways (dpr 2, touch);
  - with reduced motion;
  - with a skip halfway.
- **Before strips:** the same strips of today's wake-up. Look at every frame, and iterate until it is beautiful, not merely working.
- **Unit tests** for the pure parts, for example:
  - the branch growth is deterministic for a given seed;
  - the branches stay inside the box: z between the back wall and the front, y above the floor, nothing through the back wall;
  - the growth schedule reaches 1, and the final state equals the skipped state.
- **An e2e check:** after waking, and after a skip, the bed shows its grown state and `r01.awake` is set. The existing first-room tests must still pass.

## Where and how to work

- Read `docs/HANDOFF.md` first. It carries what earlier sessions learned about the user, the paper engine and the tests.
- Your git worktree is `{ROOT}/kd-bed`, on branch `living-bed`. The lead makes it from the current `paper-engine`.
  - `node_modules` is a symlink to the main repo's; don't run `npm install`.
  - Work and commit only there. Don't touch `{MAIN}`, the other `{ROOT}/kd-*` worktrees or other branches.
  - Never push, merge, rebase or change remotes. The lead merges your branch.
- Scratch files, tools, screenshots and logs go in `{ROOT}/kd-shots/bed/`. Never commit them.
- Ports:
  - Dev server on 5451: `npx vite --port 5451 --strictPort --host 127.0.0.1`, in the background.
  - Static and e2e servers on 5611,5612,5613: `KD_E2E_PORTS=5611,5612,5613`.
  - Never use 4173–4175, 5411–5423 or another agent's ports.
  - Stop only processes you started, by PID; never `pkill -f`.
  - Don't `sleep` in the foreground; wait inside scripts instead.
- Screenshots:
  - Use Playwright with the preinstalled Chromium. Launch it with `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` for WebGL.
  - `?room=r01` opens a room in dev and e2e builds.
  - `window.__kd` (`src/engine/testProbe.ts`) reads and steers the game: `state()`, `game()`, `world()`, `tp(x)`.
  - Two helpers are in the repo:
    - `node scripts/snap.mjs '<json>'` opens a room on your server (`"port": 5451`), steps the game and takes screenshots: tp, z, wait, frames, shot, eval, key, settle. Its header lists the options.
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
- `KD_E2E_PORTS=5611,5612,5613 npx playwright test --grep-invert @campaign --output {ROOT}/kd-shots/bed/pw` (about 15 minutes)
- `KD_E2E_PORTS=5611,5612,5613 npx playwright test --grep @campaign --output {ROOT}/kd-shots/bed/pw` (about 14 minutes; both full playthroughs)

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
