# Handoff — Kristaller Dünyası (14. Oda)

Read this first. It carries what the previous sessions knew, so that you do
not have to re-discover it by reading the codebase.

## TL;DR

- The game uses Phaser 4.2.1, TypeScript (strict) and Vite 7. There is no three.js. The UI is in Turkish.
- The repo is **Mizyaz/nyluma-game**. Every push to `main` deploys to
  https://mizyaz.github.io/Nyluma-game/ (`.github/workflows/deploy.yml`).
  `ci.yml` (typecheck, vitest, build, Playwright `@smoke`) runs only on
  non-main branches.
- The world is drawn by our own **paper engine** (`src/paper/`, below): every
  room is a paper box with its front torn open, and every drawing stands in
  it as a card at its own depth, printed at the exact scale it shows at.
- **Next steps, in order:**
  1. **Painting 1, object by object, with the user.** Ask about each object
     before drawing it, and show each one. The pictures on the wall matter most
     ("o duvardaki resimler aşırı önemli"). Draw every object by hand as SVG.
     Never trace the painting, and never extract its lines or colours.
  2. The mood. Whimsical is the default. The user asked for "Little Nightmares,
     but more whimsical" and has not yet picked between `?mood=whimsical` and
     `?mood=nightmare`.
  3. Optional: volume shading for the paper puppets (Phaser 4's Lighting
     component with normal maps).
- Ask the user to re-upload painting 1 when you need it. Uploads do not survive
  between sessions. Never commit the painting or crops of it.

## The user and how to work with them

- They write in Turkish. Reply in short Turkish.
- They want **visible progress**: show a render at each step and publish often.
- They are very sensitive to wasted context. Rules:
  - Never re-read a file you have already read. Grep for the exact lines instead.
  - Trim long command output (`| head`, `| tail`).
  - Keep screenshots ≤600 px tall and look at **one** contact sheet per iteration.
  - Send broad searches to a subagent.
  - Commit WIP early. The container is ephemeral.
- Their art direction, which still applies:
  - "2.5 d yap ama 2d modeller pixel perfect match etsin". The look is 2.5D, and
    the 2D drawings show pixel for pixel. That is what the paper engine is for.
  - "adamakıllı engine yazarak". Solve it in the engine, never by line or
    colour extraction from their painting.
  - Every room is "önü yırtık bir 3d kutu", a 3D paper box with its front torn open.
  - Characters should feel 3D, like paper puppets. That is why they have
    shadows, the turn and limb depth.
  - Lines need balance with the fill, and line width must be **adaptive**: big objects get thicker lines, inner details thinner.
    Do not make things pastel by lowering the line alpha.
  - "pastel demek detayı düşürmek demek değil". Pastel does not mean less detail. They want crisp detail and definite contrast.
  - Gorti has **no pupils, no smile and no mouth**. Its face is a screen.
  - These features are done and must be kept: realistic whales (sperm, blue, bowhead) with sounds, per-word character voices in dialogue, and debug unlock-all with a scene list.

## Environment and commands

- The Bash tool resets the cwd after each call. Use `cd <repo> && …` every time.
- Dev server: `npx vite --port 5411 --strictPort` (run it in the background).
  Avoid ports 4173–4175. Playwright uses them unless `KD_E2E_PORTS` moves them,
  e.g. `KD_E2E_PORTS=5421,5422,5423 npm run test:e2e`.
- Screenshot: `node scripts/shot.mjs <url> <out.png> [w] [h] [selector=body[data-ready]]`.
  `?room=r02` opens a room directly in dev and e2e builds, and `window.__kd` (the test probe) can teleport and step the game.
- `npm run build` is `vite build`, and it does **not** type-check. Before pushing, run:
  - `npm run typecheck` (tsc; strict, `noUnusedLocals`/`noUnusedParameters`, `!` on indexed access);
  - `npm test` (vitest).
- Kill background processes by PID. Do not use `pkill -f`.
- After a push, check GitHub Actions with a fresh query. Do not trust earlier output.
- Publishing means pushing to `main`. The user asked for that in earlier sessions.
  If your session is assigned another branch, confirm with the user before pushing to `main`.
- Phaser 4 has its own docs in `node_modules/phaser/skills/*/SKILL.md`.

## The paper engine (`src/paper/`)

| File | What it holds |
|---|---|
| `lens.ts` | `Lens`: the eye. `scale(z) = f / (eye.z − z)`, `project` and `unproject`. `frame()` shoots a room the way a shift lens does: the eye looks straight ahead and the picture moves, so a card is only ever scaled and keeps its shape. |
| `planes.ts` | `Planes`: one Phaser camera per depth (keyed by `Math.round(z)`, at most 31, drawn back to front). `put(obj, z)` and `zOf(obj)`. `free(z)`/`move(cam, z)`: a camera whose depth moves (a figure walking in depth). `within(cam, fn)` stands on `cam` what `fn` adds; `toMain(x, y)` turns a point of that plane into the actors'-plane point that shows there (for pooled effects). |
| `press.ts` | `Press`: prints each SVG part at the exact device scale it shows at (`exactMarkup`, `fitScale`). |
| `box.ts` | `PaperBox`: the box's shader (back wall, floor, ceiling, side walls, torn front). It takes the lamps (`MAX_LIGHTS`), the fog, the darkening at the front (`uNear`) and the contact shadows (`MAX_SHADOWS`). |
| `light.ts` | `Lighting` and the moods `WHIMSICAL`, `NIGHTMARE` and `DAY`. Point lights fall off as `(1 − d²/r²)²` with a wrap term. Cards are tinted at their four corners (MULTIPLY_TWO). There is fog behind z = 0 and silhouettes in front. `casterAt()` picks the lamp that throws a figure's shadow. |
| `air.ts` | `RoomAir`: motes in three depth layers, added light. |
| `castShadow.ts` | `CastShadow`: the figure drawn through its lamp's projection into small RenderTextures and laid on the back wall (scaled about the lamp) and the floor (affine about the feet), filled with the shadow colour. |
| `screen.ts` | `Screen`: the canvas at device pixels (`?dpr=`), and `fitScene` for the flat 1280 × 720 scenes. |
| `clip.ts` | Clip shapes (WebGL only). |
| `fixes.ts` | `patchPhaser()`, called in `main.ts` before the game is made. Phaser 4.2.1 compares the tint mode with `==` on a normalized attribute, so MULTIPLY_TWO never matches without the rounding patch. |
| `stage.ts` | `PaperStage`: the room. `card()`, `addShadow()`, `castShadow()`, `hang()` (a card hung on the back wall throws its shadow on it, away from the lamp that lights it most), the eye following Gorti, shake and zoom. Each frame runs the lights, then the cast and hung shadows, then the contact shadows. |

Conventions:

- World px: x to the right, y down, z toward the viewer. z = 0 is the plane the actors walk on.
  A typical box runs from `back: −300` to `front: 170`.
- Cards always face the viewer. Never tilt the eye.
- The Canvas renderer (`?canvas=1`, used by the gameplay tests) has no box shader, no lamps and no cast shadows: `castShadow()` returns null there.
- Crystals and glows are lights with `cast: false`: they light what is near, but throw no shadows.
- Things hung on the back wall stand 4 px off it (`back + 4`) and throw their shadow on it
  (`RoomRuntime` calls `hang()` for props within 40 px of the back). Room 1's pictures use
  `ON_WALL` (r01Stage.ts), and paintings on walls hang there too (`Painting`). Both are drawn
  larger by as much as the wall is farther than where they stood before, so they show as large.
- The fog thickens toward the back wall but stays light there (whimsical: 0.3), so what is on
  the wall reads.
- The cave walls (`stoneWall` in `render/2d/painters/backgrounds.ts`) are finished stone by stone:
  a shaded rim and a pale lip, pores, cracks with twigs, chipped corners, dark mortar. A cave
  wall also gets moss, fossils (ammonite, shell, leaf, fish), crystal sprouts and drips. Any
  wall can get chalk doodles (star, spiral, sun, moon, tallies, flower, a little Gorti).
- The dormitory wall (r10, `dormDetails`): striped star wallpaper with lifting seams, a boarded
  wainscot, curtains and sills at the windows, children's crayon drawings pinned or taped up,
  coat hooks with a scarf, pencil height marks, cracks and damp stains.
- The office wall (r12, `officeWall`/`officeDetails`): a cornice, raised panels with bevels, a
  sage rail over a boarded lower wall and a wooden skirting; each window fills a panel, with a
  blind and a radiator under it. The other panels hold, in turn: certificates (one gone, its
  mark left), a stopped clock over a notice board, a calendar crossed off by a falling chart,
  and the marks of pictures taken away between two wall lamps.
- Keep a wall's details between about 0.5 and 0.75 of its height: the eye's frame cuts the top
  of the back wall, on phones most of all. To see a whole wall at once, paint its theme's layers
  onto a plain canvas in the dev page (`themeDef(id).layers`, seeded as `RoomRuntime` does).

### Walking in depth

- Up and down (W/S, the arrows, a gamepad's stick; on the touch stick, pushing it up or down) walk Gorti away
  from the viewer and toward them over the room's floor: `Player.z`, from 100 px short of the
  back wall to 100 px short of the torn front (`DEPTH_ROOM` in WorldScene). The world stays flat:
  physics, scripts, triggers and interactions see x and y only.
- Off the actors' plane (|z| ≥ 0.5) his figure, root and glow stand on a free camera that walks
  with him (`WorldScene.standDepth`), so the lens, the lights, the fog, the props' occlusion and
  his shadows all take his depth. On the actors' plane he stays on the main camera, as before.
- What his steps make stands at his depth (`atHim`); what a move makes stands where he made it,
  on a second free camera (`atFx`). Pooled effects kept in the actors' plane (dust, step crystals,
  sparks, birds) start where his depth shows (`Planes.toMain`).
- On anything but the floor (a whale, a ledge) he walks back to the actors' plane; a root reach
  and a teleport bring him there too.
- A figure on a free camera takes only 30% of the silhouettes' darkening before the actors'
  plane (`FIGURE_FRONT` in light.ts): the player stays readable.
- His art is printed for the actors' plane, so off it the parts are drawn a little scaled.

### Jumping

- Space, the touch Zıpla button and a gamepad's south button jump; nothing in any room needs a
  jump. Coyote time, a jump buffer, a variable height (letting go cuts the rise), squash and
  stretch on take-off and landing, dust, a hop and a thud pitched per body (`Player.ts`; the
  rig poses crouch / takeoff / rise / apex / fall / land exist for every body: the child, the
  youth, the warrior, the amca with any head, the coward and the mech; the suit cannot jump).
- Never a shortcut: a closed gate (an `unless` solid standing on the floor) is a body up to the
  room's top (`geometry.ts` `bodyTop`, used by `RoomRuntime`); in the air Gorti meets triggers,
  exits and memories down to the ground below him (`sweptHull`); a trigger met in the air fires
  as he lands (`WorldScene.armed`); E pressed in the air waits for the landing
  (`JUMP.actionBufferMs`) and what he can reach is measured from the ground. A jump press is
  only taken by something that can jump, so Space still wakes him in r01 and closes dialogue.
- In depth his figure rises on its free camera; his shadow stays on the floor at his depth,
  shrinking and fading as he rises (`JUMP.shadowFade`, `JUMP.shadowMin`). If his head would
  leave the top of the picture (a phone held upright frames the room tightly, most of all at
  its back), the whole picture slides down just enough while he is in the air and settles
  back after (`PaperStage.keepInView`, `JUMP.headroom`); never with reduced motion.
- `tests/unit/walk.test.ts` checks that every room is walked without jumping, the gates, the
  paper box's lid and the swept hull; `gameplay.spec.ts` jumps with Space and by touch.

### Touch controls (`src/ui/TouchControls.ts`)

- Left thumb: a paper dial with a knob that follows the thumb and springs back. Left and right
  walk past `TOUCH.stick.walkOn`, up and down (in depth) past the firmer `depthOn`; each turns
  off again under its `…Off` (hysteresis). Right thumb: Zıpla in the corner, the action button
  beside it (its drawing follows the prompt: a star for Rezonans, a magnifier for İncele, a
  speech balloon for Konuş, a split crystal for Yık), and the chips Biçim / Şarkı / Nefes on two
  rings around Zıpla (`TOUCH.arc`).
- Where they go is a pure function of the screen (`src/ui/touchLayout.ts`, unit-tested at many
  sizes): upright under the game view and `clearBelowView` of subtitles; sideways in the
  corners, beside the subtitle column and below `topClear` (the Sun, the Moon and the HUD
  buttons keep the top); inside the safe areas; every target ≥ 44 px; it shrinks only when a
  small screen needs it. `#touch` carries the safe-area insets as padding for it to read.
- The drawings (`src/ui/touchArt.ts`) use the characters' kit (`comic`): pastel discs with
  contours in their own dark tone, a cel shadow low-left, a glint high-right. Their CSS is one
  marked block in `styles.css` ("touch controls"): the grain, the shadow on the page, the press.
- Shown only on touch devices (setting "Dokunmatik kontroller") and only in gameplay and
  cutscenes (holding a button skips a scene); they fade away for dialogue, menus and page
  turns, and let go of every finger when they do. Every pointer has pointer capture; a cancelled
  or lost touch, a blur or hiding releases it. "Dokunmatik düzen" (Sağlak / Solak) mirrors
  them. Haptic ticks only after a first tap and never with reduced motion; reduced motion also
  drops the springs and pops for quick fades.
- The e2e touch bot walks by touching the stick's sides and presses the buttons' middles.

### Characters as paper puppets (`src/render/2d/rig/RigView.ts`)

- The turn: `setFacing` eases the shown width from one side through edge-on to the other (cosine, `TURN` = 0.2 s). The parts are reordered at the edge-on moment.
- Limb depth: the near and far limbs stand `SPREAD` (7 world px) before and behind the body, so they move with parallax.
- Every world rig throws a cast shadow. Rigs other than the player also get contact shadows under their feet.

### The Sun, the Moon and the loading screen

- `src/content/characters/sky.ts` draws both faces in bold ink (`#2b2228`): socket, iris (it follows the gaze), heavy lid, and a shut eye for the blink.
- `src/gameplay/actors/Celestial.ts` animates them (18 rays). `SkyScene.ts` places them and dims the one that is not shining.
- They are light sources. `SkyScene` draws each face's halo and soft beams into the room
  (`src/render/2d/fx/lightArt.ts`). `src/engine/scenes/SkyLamps.ts` hangs a lamp for each
  before the torn front, on the eye's ray through its face, so the light comes from where the
  face shows. The one that is out lights the room and throws the shadows (the kahkaha swings
  them), and the room's air warms under the Sun and turns cold blue under the Moon. Their
  strength follows the face (`Face.glow`: breath, blink, laugh, talk). Only slow waves: a whole
  room's light must never flash fast.
- Gorti's own light is `src/gameplay/PlayerGlow.ts`: a bloom about his screen face and a lamp
  that never throws his own shadow. It breathes, and swells when he talks, sings or laughs. Each
  Rezonans move flashes it in that move's colour. The amca shines with his head, and the coward
  with his torch.
- The slit eye in r01's floor (`src/content/art/p1FloorEye.ts`) is the painting's broken floor
  with an eye looking out of it, drawn lying down in the floor's perspective (`K`): a lilac crust
  broken into eight plates round a slit, each pushed a little apart so the dark under it shows,
  the far ones' inner faces come down as a heavy lid, and the cracks run on into the boards. It
  is four cards at one depth and one pivot (`FLOOR_EYE_ORIGIN`): the slit's depth with the white,
  the iris twice (pupil narrow and wide) and the broken floor on top, so the lids cut the iris
  wherever it looks. `src/content/scripts/floorEye.ts` (`FloorEyeWatch`) makes it follow Gorti
  (up at him when he is over it, its pupil widening as he comes near). It never blinks.
  `FLOOR_EYE_LOOK` is how far the iris can move.
- The rose tree in r01 (`src/content/art/p1Tree.ts`) is drawn in the game's comic manner with
  the characters' kit (`comic`), not traced: each object of the painting is its own shape (the
  trunk, the crystal, the roses at the branch tips, the birds coming out of them, the roots, the
  mist). It is drawn in the painting's measure and scaled down, so its contours and hatching use
  their own widths (`L`, `HATCH`) rather than the kit's defaults.
- `src/ui/LoadingView.ts` is the loading screen: a pop-up paper theatre that builds itself
  with the progress. The art is in `src/ui/loadingStage.ts`, drawn in the comic manner (the
  faces are `skyFaceSvg`; its `'shut'` part lays the blink over them). It is a stack of flat
  layers, one per depth, each drawn as it shows through the proscenium; the pointer slides
  them against each other by their depth (`data-p`), and the box's floor and walls shear as
  they slide. Cards are hinged at the floor and pop up, a beat apart, once the progress
  reaches their `data-at`; crystals sprout and Gorti glances at each (`data-g`). At 100% the
  ta-da (the curtains part, confetti, twinkles) plays, also during `close()`'s fade, as the
  game closes it at once. Reduced motion: no parallax, bobbing or blinking, and nothing fades:
  pieces just appear in their turns.
- The loading screen runs while the game rasterizes its atlases, and must cost it little even
  where a software GPU draws the page (as in the e2e runs, SwiftShader), which pays several
  times more for vector art than a software canvas does. There the frames are drawn late: what
  they composite is drawn when the game next reads pixels back, at the end of the boot, so every
  frame the theatre causes is paid then. So its pictures, the big still ones and the little ones
  that show only for a moment (sparkles, confetti, Gorti's joy), are painted as bitmaps by a
  worker (`src/ui/loadingPaint.ts`, a reader for the small part of SVG the stage is drawn in)
  and stand as canvases (`picture()`); a piece comes up once its pictures are there, and any
  picture the worker cannot paint is shown as SVG. The worker is made once and kept for the
  page's life: ending it waits on the GPU process, which at the end of the boot is busy with the
  game's pictures. While the theatre covers the game, the game's canvas is hidden (`#game` in
  `styles.css`): the game repaints it every frame, and each of those had the whole screen, the
  theatre included, composited again. Cards are not drawn until their turn; nothing moves
  inside an SVG, only transform and opacity animate, no picture is scaled up past the size it
  is painted at, and layers stay flat (perspective only while a card pops). `set()` changes
  the page only when what shows changes (the digits, the words, a piece, the drapes' next
  step). A piece waits at most 200 ms for its turn (`MAX_LAG`), and the last is due at 84%;
  from 90% on (`ld-hush`) the small life holds still and whatever is still coming up is set in
  place, so nothing moves while the game finishes its pictures in one long task. The one rAF
  loop eases the pointer parallax and stops when it settles.
- `dev/loading.html` (dev server only, not in the build) holds it on screen: no query loops
  0→100%, `?p=0.42` holds a progress, `?err=1` shows the failure, `?rm=1` reduced motion.

### Transitions: the game as a pop-up book

- `WorldScene.goToRoom` launches `WarpScene` with `{chapter, dir, glow, onPeak}`. `onPeak`
  still restarts the world exactly once, behind the page, and passes it an `Arrival` handshake
  (`WorldData.arrive`). The world freezes play (input context `none`) until the turn says it is
  over. A room asked for meanwhile waits for it (`pendingRoom`).
- Between rooms, `src/ui/PageTurn.ts` grabs the last frame and turns it over as a page, drawn
  on one 2D canvas every frame. The page's foot is picked up first, the paper goes over a tight
  roll and stands up toward the hand, and then it is turned away past the spine.
  - The paper beyond the fold is drawn in thin bands from the fold out. Each band has its own
    perspective and light and lies a little over the last, so no seam shows.
  - The roll is lit from the upper right, dark in its crease and hatched in its shade. The back
    is a warmer paper with the print showing faintly through, mirrored. The lifted paper throws
    a soft shadow on the room beneath.
  - The geometry is in `pageCurl.ts`, which is tested. A unit test keeps the lifted paper under
    30% of the screen.
  - The turn goes forward from right to left, and back the other way.
  - The transition's clock (`WarpScene.update`) moves at most 100 ms a frame, so a device that
    draws slowly stretches the turn rather than skipping it.
  - In headless software rendering, a frame took about 40 ms during the lift and 220 ms during
    the turn at 1280 × 720. It has not been measured on a real device. If it is slow on
    low-end phones, draw coarser bands (`ARC_STEP`, `RISE_STEP`) or a lower-resolution shadow.
- Lines asked for while a chapter page is up wait until it opens (`Dialogue.ts`).
- Under the page the next room's cards stand up from lying flat, far to near, with a spring
  (`src/paper/popUp.ts`): each plane's camera is squashed upright about its floor line.
- Gorti's screen glow flies over the turn into his screen (`PageBits.ts`).
- Between chapters the page turns onto a chapter page (`src/ui/ChapterPage.ts`, art in
  `src/content/art/chapterArt.ts`):
  - a torn sheet taped onto the chapter's endpaper;
  - "BÖLÜM", with the numeral painted on by a brush;
  - the title from `CHAPTER_TITLES`, letter by letter;
  - a small moving pop-up picture.
- The chapter page opens like a gatefold onto the first room. The HUD's chapter card
  (`areaTitle`) is shown only when no chapter page was. `opensChapter` (GameState) decides
  when a page is due: new game, chapter select, a save at a chapter start and the ending's
  replay come in through it too.
- Reduced motion: a cross-fade through paper (through the chapter page between chapters).
- No frame could be grabbed: paper is wiped in instead.
- Everything ends within 8 s whatever happens.
- To hold a transition on screen in dev, open `/dev/transitions.html`
  (`?mode=room|chapter&ch=1..6&dir=-1&reduced=1&portrait=1`).
- `CrystalWarp` in `crystalFx.ts` is no longer used by the transitions. The rooms' background
  tunnels still use the shared gem-tunnel code.

### Doorways (`src/render/2d/fx/doorway.ts`, `src/content/doors.ts`, `doorSpecs.ts`)

- Every way on is a doorway built like a tunnel book. A frame of cards stands just behind
  the actors' plane. Behind its opening a few cut-out pages recede into the depth, the last
  of them a glimpse of the room it leads to.
  - The inside stands on one camera clipped to the opening. Each page is moved and scaled
    every frame as the eye would see it at its depth, so the pages slide past each other as
    the camera follows Gorti.
  - The art is in `src/content/art/doors/` (`doorKit.ts` and one file per door), printed once.
- A door only reads the condition that was already there (`doorSpecs.ts`: an exit, a solid
  or a flag). Exit boxes, conditions, targets, checkpoints and room widths did not change.
  - Shut, pieces or a leaf close its opening. When the condition comes true and the door is
    on screen, it opens with a short animation. A leaf turns in true perspective, drawn as
    vertical strips by depth.
  - Gorti near wakes it: the light swells, the pages draw apart, someone peeks out, a sound.
- The doors: r01 paper door (`tunnel`); r02 root lattice (the
  `roots` solid, the song); r04 tree door; r05 stone gate (`gate`) and moon gate; r08 stage
  door; b01 form door (`gate:kapi`) and hedge arch; b02 moon door (`gate:gece`) and hill
  wheel; b03 block door; r12 office door (the `r12.door` flag). The room changes in r03,
  r06, r07, r09, r10 and r11 are cutscenes, with no door to walk through.
- A doorway stands only where there is a way on. r01 had an always-open root gate in the
  middle of the room; the user found it meaningless and in the way, so it was removed.
- Reduced motion: nothing idles; opening, a leaf's swing and a peek are 260 ms fades.
- Per frame the doors only move and fade printed cards. The inside's camera is hidden while
  the door is off screen.
- Phaser 4's default quad submitter picks each quad's texture by an exact float compare,
  which SwiftShader breaks across a rotated quad: half of a turning piece vanished now and
  then. The doors draw with a single-texture submitter (`singleSubmitter` in `doorway.ts`).
  Other rotating sprites may have the same problem.
- Tests: `tests/unit/doors.test.ts`.
- Known: at 844 × 390 the Moon on top of b02's crystal gate is cut off at the top. The old
  `prop.officedoor` art is still in `props.ts`, used only by the props preview.

### The story text in JSON (`src/content/text/`)

- All the story's words are JSON files the user edits: names, captions, dialogue, inspect,
  memories (found and reversed), paintings, documents (r12's papers) and sky (the Sun's and
  the Moon's looks and sayings). `docs/METINLER.md` is the user's guide, in Turkish.
- `text.ts` loads them and checks each as it loads (`check.ts`: typed validators, no
  dependencies). A bad entry falls back to a default (`…`, a name's own key, the default
  look) and, in dev, warns once in the console as `[metin] <file> › <key>: …`. The tables
  are Proxies: a key the code asks for that a file lacks also gets a default and a warning
  (`in` and `Object.keys` still tell the truth). The game never stops on its text.
- The old names stay: `NAMES`, `CAPTIONS`, `DIALOGUE` (dialogue.tr.ts re-exports them),
  `MEMORIES`, `PAINTINGS`, `CHAPTER_TITLES` (still from chapters.json). Scripts only swapped
  a string for a lookup. Menus, buttons, control hints and toasts stay in code.
- `npm run kd -- check` runs `audit.ts`: JSON syntax (line and column), every validator,
  sky.json's pages against the real chapters and rooms, and the code's own reads
  (`CAPTIONS.x`, `DIALOGUE.x`/`['x']`, `NAMES.x`, r01's `INSPECTABLE`) against the files.
  Errors fail it; unused keys are warnings. `kd` loads the cast only after the syntax check,
  so a broken file is reported rather than crashing kd.
- `npm run kd -- schema` also writes `src/content/text/*.schema.json` from `schema.ts` (zod,
  editor help only; the game never imports it).
- A JSON syntax error is the one thing that stops the game: Vite refuses the file and
  names its line, and kd check says the same.
- Tests: `tests/unit/text.test.ts` (validators on broken samples, the loader's defaults,
  lookOf/linesOf fallbacks, audit on a temp copy).

### The Sun and the Moon as characters

- One of each on screen. A face is in one of three places: `'home'` (the sky's corner,
  `SkyScene`), `'world'` (made by a room script: r03's canopy, r05's far end, r07, r08's boss,
  the Moon of the stomp move) or `'card'` (`FacePortrait` in a face dialogue). Every `Face`
  registers itself; while the same character shows in a closer place (card over world over
  home) the farther one steps out of sight (`Face.presence`, eased; it steps out once the
  closer one shows 22% and back under 8%). The sky's face glides halfway toward its closer self
  as it goes and comes back the same way. Its lamp and halo stay at home, so the room's light
  does not move. The big Sun behind the card in the user's screenshot was r03's world Sun
  (`new Face(w, 'sun', T + 90, 540, …)`), now hidden while its card shows.
- A new page's faces wait until the page turn is over (`WorldScene.transitioning`), then drop
  in; the old page's faces are only on the turning sheet. Reduced motion: a fade.
- Sizes: the Moon 0.68 and the Sun 0.56 of their parts (were 0.5 and 0.4), in the top corners
  of what shows; the ancient Moon, the taller crescent, hangs 18 px lower. Sideways the HUD's
  pause and full-screen buttons sit at the top middle, with the skip hint and the chapter card
  below them (the styles.css block "sky faces"); while a face shows under them (r08's big Sun)
  they step aside along the top to the nearest clear place (`--dodge`, set by SkyTouch).
  Upright the buttons stay in the band above the game view.
- Each page's look comes from `sky.json` (`skyLook`): a mood (mouth, lid, brows, blush, the
  rays' wave, breath, blink pace, sway), things to wear, a tilt, a size (0.7 … 1.25: the
  corners stay corners), a place in the corner. `Celestial.ts` puts the parts together; `sky.ts` draws
  them in the faces' bold ink (moods: brows, six mouths, half-shut and happy eyes; wear:
  nightcap and pompom, plaster, freckles, scarf, crystal crown, flowers, sweat, tears, Zs,
  notes, sparkles). `setPageLook` dresses every face of the character, so the room's and the
  card's wear the page's look too. All parts are drawn once; a frame only moves them.
- Alive like the card: blinks by the mood's pace (sometimes twice), glances when lively, a
  sleepy face yawns, a delighted one squeezes its eyes, a teary one cries a tear, it hums along
  with eyes shut and notes while Gorti sings, and speaks while its own lines type in a plain
  dialogue. Reduced motion: blinks and slow breathing only.
- Touch (`src/ui/SkyTouch.ts`): DOM circles on the faces, clipped to the game view, under the
  HUD and everything else (its buttons, dialogue, documents, menus, `#touch`). The HUD lets
  touches through (`#stage > .hud`, which `#stage > *` would otherwise override); only its
  buttons take them.
  A tap: `Face.poke()` (wiggle, giggle or blink, sparkles), `touchLevel` swells a glow
  behind and over the face wherever it shows, the sky's halo and its lamp softly (SkyLamps
  adds 0.3 of full strength; up 0.45 s, down 1.4 s), a chime (`sfx('skyChime')`,
  `'giggle'`). Held 3 s while play is free (context `gameplay`,
  nothing said or turning): a ring fills, then a line from `skyLines` in a balloon (set whole
  from the start and lettered in, so no word jumps a line), voiced word by word like the
  dialogue; Gorti answers 60% of the lines that have an `answer`.
  During a dialogue, a cutscene or the pause menu a tap still lights it up (on the pause
  menu's veil too), but no ring is offered. Pointer capture; up, cancel, lost capture, a drag
  off the face, blur and a hidden page all end a hold.

## Tuning (`src/tuning.ts`)

Every number worth changing by hand is in `src/tuning.ts`; save it and the dev server reloads.
World px and seconds for the game; CSS px on a phone 390 px wide for the touch controls.

- `JUMP`: on or off (`enabled`: off hides Zıpla and Space does nothing), gravity, the fastest
  fall, coyote time, the jump buffer, the in-air action buffer, squash, dust, sound volumes, the
  shadow's shrink and fade.
- `BODIES`: each body's walking and jumping: speed, acceleration, air control, take-off speed
  (apex = v² / 2g), how much letting go cuts the rise, the hop's pitch. `suit` has 0: it cannot jump.
- `KEYS` and `LETTERS`: the keyboard (physical codes; letters by the character they type first,
  so other layouts keep their names).
- `GAMEPAD`: standard-layout buttons to actions, the stick's dead zones. In menus and document
  pages south is Enter, east and start are Escape, the d-pad moves the focus.
- `TOUCH`: sizes, margins, the space kept for the subtitles and the top, the stick's dead zones
  and travel, the rings and angles of the right thumb's buttons, haptics, the default hand and
  the colours.

## Other pending work

- Adaptive, balanced line art across the game, following the rules above.
- The DOM UI over the device-pixel canvas: check that it fits on phones.
- Routine for every change: typecheck → vitest → build → smoke (serve.mjs + shot.mjs) → push `main` → check Actions.
