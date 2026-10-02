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
  The stick walks at full speed past its dead zone, and on a slow page the bot reads the game
  only a few times a second, so to stop on a spot (`walkTo`) it lets go within 90 px, waits for
  Gorti to stand and closes in with short presses sized to the distance left. Holding the stick
  that close paced Gorti to and fro over the spot until the step timed out.

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

### Scene changes: the paper theatre (`WarpScene`, `src/paper/stagecraft.ts`, `theatre.ts`)

- `WorldScene.goToRoom` launches `WarpScene` with `{chapter, dir, glow, onPeak}`. `onPeak`
  restarts the world exactly once, while the old room is out of sight, and passes it an
  `Arrival` handshake (`WorldData.arrive`). The world freezes play (input context `none`)
  until the change says it is over. A room asked for meanwhile waits for it (`pendingRoom`).
  The cutscenes' room changes (r03, r06, r07, r09, r10, r11) go the same way.
- The room is never flattened into a picture, and nothing is laid over the game in screen
  space: the change happens on the paper stage. Every piece is a sheet of paper facing the
  viewer at a real depth in front of the box's torn front (z 170), drawn through the stage's
  own lens (`theatreLens`: `FRAMING`, the actor scale, the eye over x = 0), with its cut
  edge's white core and the shadow it throws low and left.
  - `stagecraft.ts` (no Phaser, tested): the depths (`STAGE_DEPTH`: the curtain 300, the
    flats 330 and 338, the title card 400, its picture 432), the timings (`STAGE_TIMES`), the
    timeline (`pose(plan, t)`), where the flats and the curtain stand (`flatPlace`,
    `curtainFoot`) and the title card's layout (`cardLayout`, `bestSplit`).
  - `theatre.ts` places the sheets every frame: a few images and tile sprites, and one
    Graphics for the threads and the ledge. The flats and the curtain are printed once, at
    boot (`printStagecraft`, at the scale their depths show at). The title card and its
    picture are printed when a chapter's change starts (`Theatre.printCard`), while the
    curtain comes down.
  - The art: `src/content/art/stagecraftArt.ts` (the flats' painted canvas on its battens,
    their cut edge and its shadow, the curtain's pleats, its hem with braid and tassels, the
    eyelets) and `chapterArt.ts` (each chapter's picture and its words, the brush numeral,
    the torn sheet the title is written on).
- Between rooms two flats roll in from the wings and meet over Gorti (where his screen glowed,
  kept within the middle 30–70% of the screen), the right one lapping over the left: 0.42 s
  and a soft bump. The room is swapped as they meet. They stay shut at least 0.1 s and until
  the new room has run three frames, then roll back out (0.62 s); 0.08 s after they start to
  go, the room's cards stand up off its floor, far ones first (`popUp.ts`). Play begins
  0.85 s after they start to go, about 1.4 s in all. Sounds: a whoosh, the flats' slap as
  they meet, a whoosh, three pops.
- Between chapters a drop curtain comes down (0.55 s, a little hop on its hem), and the room
  is swapped as it lands. The chapter's title card comes down in front of it on two threads
  ("BÖLÜM", the numeral painted with a brush, the title from `CHAPTER_TITLES`), and 0.32 s
  later its picture stands up on the card's ledge. It is shown at least 2.15 s; then the
  picture lies down, the card goes up ahead of the curtain, the curtain rises (0.86 s), and
  0.26 s after it starts the room's cards stand up. About 3.2 s in all.
- `opensChapter` (GameState) decides when a title card is due: a new game, chapter select, a
  save at a chapter's start and the ending's replay come in through it too. The HUD's chapter
  card (`areaTitle`) is shown only when no title card was. While a change runs, `#stage` has
  `pt-room` or `pt-chapter`: the HUD's texts go, and lines asked for while a chapter is shown
  wait until it opens (`Dialogue.ts`).
- Reduced motion: the flats, or the curtain with its card, only fade in where they stand
  (0.26 s) and out again (0.3 s); nothing rolls, drops, sways or stands up. A chapter is
  shown 1.5 s.
- The clock (`WarpScene.update`) moves at most 100 ms a frame, so a device that draws slowly
  stretches the change rather than skipping it. Whatever happens, it is over by 8 s
  (`STAGE_TIMES.limit`). In dev and e2e builds `window.__kdWarpClock = {t}` holds it at a
  moment (for frame-by-frame screenshots).
- The Canvas renderer draws the same sheets (they are plain images).
- r09's "close your eyes": the eye leans in (zoom 1.25) and the flats close; the strip wipe
  laid over the screen is gone.
- `/dev/transitions.html` (`?mode=room|chapter&ch=1..6&dir=-1&reduced=1&canvas=1`) holds a
  change over a made-up room; `kdSeek(s)` steps it to a moment.
- Tests: `tests/unit/stagecraft.test.ts`. The room is swapped only once it is hidden and stays
  hidden until the stage opens (a laptop, an upright phone's band and a phone on its side);
  the stage is open at the start and the end; the lengths; less motion only fades; the card
  never hangs in front of the room; the card's layout fits every screen.
- Measured against the page turn (bee0b9f) in WebGL on SwiftShader (headless, a software GPU,
  so only the comparison means anything):
  - New Game to the HUD: median 5.5 s against 8.6 s (6 runs each, 1280 × 720); page open to
    the menu 5.6 s against 6.0 s.
  - A frame in r01 by its doorway: median 783 ms against 900 ms at 1280 × 720 (8 s), 233 ms
    against 267 ms at 844 × 390, dpr 2 (20 s after settling). r05 by its gate: 583 against
    633 ms at 1280 × 720.
  - At about a frame a second the clock's 100 ms cap stretches every change; a change also
    waits for the next room to draw 3 frames. At 1280 × 720 a room change took 55 frames
    against the page turn's 26, a chapter 134 against 84 (one run each).
  - Both builds stall now and then for 7–10 s in SwiftShader, with the main thread free
    (the GPU process); an 8 s window can catch no frame at all.
- Gone with the page turn: `PageTurn.ts`, `pageCurl.ts`, `ChapterPage.ts`, `PageBits.ts`,
  their CSS, `tests/unit/transitions.test.ts`, and the `brush` and `leaf` sounds.

### Doorways (`src/paper/walls.ts`, `opening.ts`, `src/content/doors.ts`, `doorSpecs.ts`)

- Everything upright is a wall or a sheet of paper, and a door is one with its wall: it is
  cut into a wall of the paper box, flush with it and slanted with it in true perspective.
  - A way out is cut into the room's right side wall (every exit is at the room's right end).
    Beyond it a passage runs on in depth: its own floor and far wall, frames standing in it
    parallel to the wall like a tunnel book's pages, a paper figure that peeks out round
    them, and at its end the light of where it leads.
  - A gate in the middle of a room stands in a wall across the room, a slab from the back
    wall forward to z 100 (past where Gorti walks), so he goes through it, not past it.
- `walls.ts` draws the walls with a shader that casts a ray through each device pixel, as the
  box's does: the wall's paper grain and its art lie on it and recede with it, and the lamps
  light it. The opening is cut into the wall's own plane, so its jambs stay upright, the near
  one taller, and its lintel and sill run toward the eye point.
  - The side wall and its passage are drawn on the camera behind every card (with the box's
    inside): all it hides lies beyond it.
  - A cross wall is drawn in slices: each plane's camera draws the part of the wall between
    its own depth and the next camera's, after its cards, so a card is covered by exactly the
    part of the wall nearer than it. Its near end and the jambs show the paper's core.
  - The leaf turns on its hinge through the same lens, or slides, lifts, sinks or rolls into
    the wall. Shut, it is flush with the wall. Across the room a leaf never swings (it would
    stand in his way).
  - Without WebGL (the Canvas renderer) the walls, the opening and the leaf are flat colours
    (`flat` in the door's art), and the doors still open and steer.
- `opening.ts` (no Phaser): the opening's shape (`Hole`, `holeTop`) and the steering
  (`depthRange`). Near a wall with a doorway the depths Gorti may walk at narrow to the
  opening, gently (`STEER`: from 300 px before the side wall, and from about 270 px either
  side of a cross wall's middle), so he goes through the doorway and never through the wall;
  he keeps 26 px from the jambs. Keys, the stick and the bots all walk the same way. A wall
  without an opening stands where no one walks.
- A doorway in the right side wall is cut as deep as the wall goes, from z −282 to −2: a
  strip of paper is left in the back corner (the back wall is at −300), and what rings the
  opening narrows beside the far jamb (their `far`, in `wallArt.ts` and `wallKit.ts`). It
  still shows small on a narrow screen, by geometry: the camera stops at the room's end, the
  eye is never more than half a screen from the wall, and a hole from z0 to z1 shows
  dist/(dist − z1) − dist/(dist − z0) of the half-screen wide (the lens, dist 900). That is
  24% here, 1.6–1.8 times the old holes (about −245 to −70, 13–15%): 151 px at 1280 × 720
  (was 84–93) and 100 CSS px at 844 × 390 (was 56–61; r08, a room narrower than the view
  there, 82, was 49). Held upright (390 × 844) it is 46 CSS px (was 26–28), all of it in
  sight: the front is torn no farther in from the sides than lets the side wall show at the
  room's end (`tearSides` in `box.ts`: halfWidth(0) · front / eye.z − wander, at most the
  room's own `tear.left`/`right`; 28 px upright, 59 at 1280 × 720, 70 on a phone held
  sideways). Before that, the 70 px margin hid all but 25–30 CSS px of it upright. Sideways
  on a phone, the Rezonans/Zıpla buttons over it turn see-through (`TouchControls.keepClear`).
- Leaving through the side wall (`WorldScene.walkIn`): he walks on into the passage while the
  flats close, seen only through the opening (his plane's camera is cut at the near jamb,
  `PlaneCamera.clipRight`), his shadow on the passage's floor, and the leaf shuts behind him.
- The art is in `src/content/art/doors/`: `wallArt.ts` (what a doorway is made of: the
  opening, the wall's face round it, the leaf, the passage, the peeking figure, the light,
  sounds, life and flat colours), `wallKit.ts` (drawing kit for elevations: bands, frames,
  stones, planks, hatching, in the comic manner) and one file per door. Every piece is an
  elevation, drawn flat as its surface looks seen square on, and the lens lays it on the
  wall. A room's pieces are printed into one texture while it loads (`printDoors`), each at
  the density it shows at (narrower across than up, as a slanted wall shows).
- A door only reads the condition that was already there (`doorSpecs.ts`: an exit, a solid or
  a flag). Exit boxes, conditions, targets, checkpoints and room widths did not change. When
  the condition comes true the door opens (its sound, its light warming in the opening).
  Gorti near wakes it: the light swells, the leaf opens a little wider, someone peeks out of
  the passage, and small paper life comes out (`doorLife.ts`: fireflies, petals, leaves,
  confetti, or paper stars on threads before the wall).
- The doors (wall; how it opens):
  - r01 `tunnel`: a page cut into the paper room's wall, onion-topped; a mint flap swings
    on its near jamb. The passage goes down into the lilac underground; a paper whale peeks.
  - r02 `mouth`: a low mouth in the cave's stone wall, roots woven across it; when the song is
    sung they sink into the ground. A root sprout peeks.
  - r04 `tree`: a wall of old trunks; a round green door swings into the hollow of the tree
    (its exit has no condition, so it stands open). A raccoon peeks.
  - r05 `stones` (across): a rock face with a low arch; crystal bars sink into the sill when
    the stones rest on their plates. r05 `moon`: a moon gate in the hill's flank, always open;
    a moth flutters out.
  - r08 `stage`: a wing of the painted set; a painted roller cloth rolls up when the room is
    done. A sparrow hops out.
  - b01 `form` (across): a clipped hedge; a garden door slides into it while Gorti is human,
    and back. b01 `hedge`: a hedge clipped into a bunny over an arch; a picket gate swings.
  - b02 `moon` (across): a board fence; a shutter painted with the night lifts into the lintel
    when the Moon is up. b02 `hill`: the hill's flank; a wheel rolls aside along its groove.
  - b03 `blocks`: a wall of toy blocks; the barricade sinks into the floor. A jester bobs out.
  - r12 `office` (across): the office's own panelled wall; the door slides into the wall when
    the script sets `r12.door`.
  - The room changes in r03, r06, r07, r09, r10 and r11 are cutscenes, with no door.
- Reduced motion: nothing idles, nothing comes out, the stars hang still; a leaf fades open
  instead of moving, and a peek fades.
- Per frame a door sets a few uniforms and moves a few small cards. The wall's shader runs
  over the part of the screen the wall covers; a cross wall draws one quad per plane camera
  it spans.
- Tests: `tests/unit/doors.test.ts` (doors stand at real exits and gates and open with them;
  openings Gorti fits through, art covering them, leaves flush when shut; the steering never
  lets him through a wall and never jerks; the print jobs and the atlas packing).
- Known: the old `prop.officedoor` art is still in `props.ts`, used only by the props preview.

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
- A new room's faces wait until the scene change is over (`WorldScene.transitioning`), then
  drop in; until then the flats or the curtain stand over the old ones (`WarpScene` is
  brought to the top). Reduced motion: a fade.
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
