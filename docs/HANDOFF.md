# Handoff — Kristaller Dünyası (14. Oda)

Read this first. It carries what the previous session knew, so that you do
not have to re-discover it by reading the codebase.

## TL;DR

- The game uses Phaser 3.90, TypeScript (strict), Vite 7 and three.js 0.186. The UI is in Turkish.
- The repo is **Mizyaz/nyluma-game**. Every push to `main` deploys to
  https://mizyaz.github.io/Nyluma-game/ (`.github/workflows/deploy.yml`).
  `ci.yml` (typecheck, vitest, build, Playwright `@smoke`) runs only on
  non-main branches.
- **Current focus:** a reusable **3D Gorti**. It is a modelled character that stands in
  for Gorti's 2D cut-out rig in the 2.5D diorama.
  - The code is committed under `src/render/3d/figure/`. It type-checks and renders in the dev preview.
  - It is **not wired into the game yet**, so the live site still shows the 2D rig.
- **Next steps, in order:**
  1. Render the figure, compare it with painting 1 and tune it. The face must be close to the painting, and the legs must read as leafy tree bark.
  2. Integrate the figure into the stage (see "Integration plan") and publish.
  3. Rebuild room r01 as painting 1 itself, bigger and crisp (see "r01").
- **Ask the user to re-upload painting 1.** It is the reference for both tasks, and uploads do not survive between sessions.
  - Ask for `Kristaller_Dunyasi_Game_Prompt.txt` (the original brief) too, if you need it.

## The user and how to work with them

- They write in Turkish. Reply in short Turkish.
- They want **visible progress**: show a render at each step and publish often.
- They are very sensitive to wasted context. A previous session lost hours by re-reading files ("30 kere mi dicem sana context yetmiyor … 10 saattir progress yok"). Rules:
  - Never re-read a file you have already read. Grep for the exact lines instead.
  - Trim long command output (`| head`, `| tail`).
  - Keep screenshots ≤600 px tall and look at **one** contact sheet per iteration.
  - Send broad searches to a subagent.
  - Commit WIP early. The container is ephemeral.
- Fewer tests. Prefer a quick check and a publish over big suites.
- Their art direction, which still applies:
  - "Yani şuan tüm gücünü 2.5dye ver". All effort goes into the 2.5D diorama look.
    Every room is "önü yırtık bir 3d kutu", a 3D paper box with its front torn open.
  - Lines need balance with the fill, and line width must be **adaptive**: big objects get thicker lines, inner details thinner.
    Do not make things pastel by lowering the line alpha ("lineları az alpha yaparak yapmışsın ama dandik duruyor").
  - "pastel demek detayı düşürmek demek değil". Pastel does not mean less detail. They want crisp detail and definite contrast.
  - Gorti has **no pupils, no smile and no mouth**. Its face is a screen.
  - These features are done and must be kept: realistic whales (sperm, blue, bowhead) as platforms with sounds, per-word character voices in dialogue, and debug unlock-all with a scene list.

## Environment and commands

- The Bash tool resets the cwd after each call. Use `cd <repo> && …` every time.
- Dev server: `npx vite --port 5190 --strictPort` (run it in the background). Avoid ports 4173–4175, which Playwright uses.
- Screenshot: `node scripts/shot.mjs <url> <out.png> [w] [h] [selector=body[data-ready]]`.
  Ignore the "GPU stall due to ReadPixels" warnings.
- Production smoke: `npm run build && node scripts/serve.mjs dist 4431 /`, then run shot.mjs against it.
- `npm run build` is `vite build`, and it does **not** type-check. Before pushing, run:
  - `npm run typecheck` (tsc; strict, `noUnusedLocals`/`noUnusedParameters`, `!` on indexed access);
  - `npm test` (vitest).
- Kill background processes by PID. Do not use `pkill -f`.
- After a push, check GitHub Actions with a fresh query. Do not trust earlier output.
- three.js settings: NoToneMapping and sRGB output. A custom ShaderMaterial must end with `#include <colorspace_fragment>`.
- Publishing means pushing to `main`. The user asked for that in earlier sessions.
  If your session is assigned another branch, confirm with the user before pushing to `main`.
- Context: `autoCompactWindow` in `~/.claude/settings.json` is counted in tokens, but it is capped by the model's own context window.

## The 3D figure system

| File | What it holds |
|---|---|
| `src/render/3d/figure/mesh.ts` | `Mesher(seed)` merges parts into one BufferGeometry that carries colour, kind (`aKind`) and hull attributes.<br>• `loft(spine, section(t,θ)→[a,b], {paint, rings, segs, up, capStart, capEnd, tile, ease})` returns a `Spine`.<br>• Also: `band(spine, {paint, at(θ), width, radius(t,θ), lift, segs})`, `add(geo, matrix\|null, paint)`, `extrude(shape, opts, matrix\|null, paint)` and `build()`.<br>• `Paint = {color: hex \| (p,n,lp,ln)=>hex, kind: skin\|bark\|plank\|plain\|leaf, uv: keep\|box\|fit, tile, jitter, hull}`.<br>• Also exports `mulberry32`. |
| `…/figure/paint.ts` | `figureTextures()`: procedural skin, bark, plank and leaf textures (NoColorSpace). |
| `…/figure/materials.ts` | • `bodyMaterial()`: Lambert with onBeforeCompile; texture by kind, wrap light 0.35, rim 0.18.<br>• `hullMaterial()`: the inverted-hull outline in INK `0x0e0a10`; `setHullScale` sets its width.<br>• `screenMaterial()`: the SDF face `src/assets/figure/gorti-screen.png` (r = pink cross, g = purple blocks, b = glow) with uniforms `uGlow uBlink uFlash uTalk`. `SCREEN_COLORS` sets its colours.<br>• `setOpacity()`. |
| `…/figure/gorti.ts` | The model: `JOINTS`, one part per joint, the face data traced from the painting (`OUTER`/`HOLE` bezel, `FRONT_PLANKS` tops), anchors and `offsetScale`. |
| `…/figure/figure.ts` | `Figure`. It builds the joint tree. `apply(FigurePose, dt)` maps the 2D rig's pose, turns the body toward the viewer and drives the face uniforms from emotes and blinks. Also: `anchor()`, `setOpacity()`, `setOutline()`, `dispose()`. |
| `…/figure/index.ts` | `hasFigure(id)` and `makeFigure(id)`. Each model is built once per rig id; Gorti's id is `gorti.root.child`. |
| `src/render/2.5d/hooks.ts` | New `FigurePose`, `FigureSource` and `LiftOpts.figure` (types only). |
| `dev/figure.html` + `src/dev/figurePreview.ts` | The dev preview, which uses the stage's NEUTRAL light rig. |

### Model conventions

- Model X points forward, Y up, and Z to the character's **right**. The ground is at y = 0.
- The model is 141 units tall and scaled by 0.96 in `Figure`. Each joint's parts are built in that joint's own frame.
- Every joint takes `rotation.z = −angle2D` from the 2D rig (`poseFor` in `src/render/2d/rig/animPoses.ts`).
- The root offset and roll are applied in the picture plane.
- Body yaw ψ:
  - facing right, ψ = −φ; facing left, ψ = φ − π;
  - φ is 50° when idle and 30° at full speed;
  - ψ is eased at 10/s with angle wrap.
- Head yaw is `(−π/2 − ψ)·0.45`, with Euler order `YZX`.
- `offsetScale` (rig px → model units): root/hips 66/42, torso 1.1, arms 1.2.
- Loft section frames `[a, b]`:
  - Upward spine, default up +Z: a = Z, b = X.
  - Downward limb spine with `up = FWD (1,0,0)`: a = forward X, b = right Z.
  - Horizontal +X spine: a = Z, b = −Y.
- Slabs (planks, skirt plates):
  - The visible seam is about the gap when hull ≥ gap/2.
  - Keep body surfaces at least 1.5 units behind a slab's inner face, or they poke through.

### Visual target (painting 1)

- **Face** ("yüzü baya benzesin"):
  - a crate of jagged planks round an olive core;
  - a lilac bezel (`0xcbb4ca`) round a **dark** screen;
  - on the screen, a pink cross (`0xc4648c` → `0xee7ca9`) and purple blocks (`0x9d739d` → `0xbb84ba`).
- **Legs** ("o bacağın ağaç gibi yapraklı olduğunu anlaman önemli") must read as leafy tree bark: ridged bark, a knee knob, leaves sprouting from it, and root feet with toes and a heel spur.
- **Arms:**
  - Right: pieces of bark, a tan wrist with a lilac band, and three leaf claws on twigs.
  - Left: a bark sleeve sprouting almond leaves, and a blocky bark hand with four fingers.
- **Body:** a broad sage torso (`0xaabb90`) over a skirt of seven bark plates.

### First render: what to fix next

The first render works: crate, bezel, screen, bark skirt, bark legs, root feet and shadow all show. Compare it with the painting:

1. **Screen.**
   - The pink and purple fill almost the whole window, with only thin dark gaps. The painting has a dark screen with a smaller cross and separate blocks.
   - Fix it with the SDF thresholds in `screenMaterial` or by regenerating the texture (`docs/handoff/tools/screen.py`).
2. **Legs.**
   - The bark reads, but there are too few leaves and they are too small to say "leafy tree". Each thigh has 2 leaves and each shin 1, only 6–8 units long.
   - Add many bigger leaves (about 10–14 long, 4–6 per segment, in two greens), perhaps in clusters.
   - Make the bark ridges deeper, with darker furrows.
3. **Chin.** The olive core shows as a green ball under the bezel. Check it against the painting.
4. **Proportions.** The legs look long and thin next to the stocky figure in the painting. Compare head, body and limb proportions; Gorti is a child.
5. **Outline.** Line width should follow the user's adaptive rule: thicker on big parts, thinner on inner details.

### Render recipe

```sh
cd <repo> && (npx vite --port 5190 --strictPort > /tmp/vite.log 2>&1 &)
B="http://localhost:5190/dev/figure.html?clean=1"
node scripts/shot.mjs "$B" a.png 480 600                      # ¾ view, as in the game
node scripts/shot.mjs "$B&yaw=80" b.png 480 600               # almost face-on
node scripts/shot.mjs "$B&yaw=80&cy=121&zoom=3.2" c.png 600 600   # the face
# paste a/b/c side by side at 600 px tall (PIL) and look at that one sheet
```

The preview's URL parameters:

| Parameter | Meaning |
|---|---|
| `id` | rig id |
| `anim` | animation name |
| `t` | time |
| `play=1` | animate |
| `speed=0..1` | run speed |
| `facing=±1` | facing direction |
| `yaw` | degrees turned toward the viewer (90 = face-on) |
| `emote` + `k` | emote and its strength |
| `cy`, `zoom` | camera height and zoom |
| `clean=1` | hide the HUD |

## Integration plan (not started)

1. **`src/render/2d/rig/RigView.ts`.** The line numbers are from before the change.
   - In `layout()` (l.224–255), keep `lastPose` and the solved angles `solveAngles`.
   - Add `readonly figure: FigureSource`, with `get id()` returning the current `rig.id` so that it follows `setRig`.
   - `pose()` returns a FigurePose:
     - `angles` = the solved angles;
     - `offsets`, `x`, `y`, `frames` and `scales` from `lastPose`;
     - `facing`, `anim` and `t` = animT;
     - `speed` = `params.speed ?? 0`;
     - `emote`, `emoteK`, `blink` and `look` from `params`.
   - Lift with `stage.lift(this.container, { rig: true, figure: this.figure })` (constructor, l.67).
   - `attachPoint(name)` (l.262) returns `figure.anchors[name]` while `figure.live`.
     The anchors are `handR`, `handL`, `chest`, `eye` and `ankleL`.
2. **`src/render/2.5d/mirror.ts`.** The line numbers are from before the change.
   - In `place()` (l.396), add `if (o.figure && hasFigure(o.figure.id) && this.placeFigure(...)) return;`
   - `placeFigure` builds the figure lazily (`makeFigure`) and places it with `M_root = A3(P')·T·Rz·Ry(ψ)·S(0.96)`.
     - `A3` lifts the object's 2D affine to 3D. Its rows are `[a', −c', 0, e']`, `[−b', d', 0, −f']`, `[0, 0, |s|·RELIEF, z]` and `[0,0,0,1]`.
     - RELIEF ≈ 0.5 and FIGURE_DZ ≈ 10. Verify both on screen.
   - Then it applies the pose, writes the projected anchors back and sets `live = true`.
     The anchor projection is `q = e + (p−e)·D/(D−p.z)`, mapped to `(q.x, −q.y)`.
   - `sync()` (l.338) hides figures that are not seen in a frame and sets `live = false`. `unlift()` (l.303) disposes of them.
   - Check the scale: the model is 141 × 0.96 units, and the 2D child rig is about 110 px.
3. **Stage facts:**
   - 1280×720 with FIT scaling; CAMERA_ZOOM 1.5.
   - Actors stand at z = 0 and the player at z = 1.5.
   - `Stage.ts` loads three.js on its own, and `hooks.ts` must never import three.

## r01 = painting 1 (pending)

The user's words: "Daha detaylı resimler / Öyle yalapşap yapma pastel demek
detayı düşürmek demek değil sadece ilk sahneyi yap ve mükemmel olsun sadece daha
büyük scale ama aynı görüntü ve hoş definitive contrast". The current r01 looked sloppy and washed out to them.

The plan:
1. Rebuild painting 1 crisply at a larger scale (`tools/hires.py`, σ 0.7).
2. Inpaint Gorti out of it, because the 3D figure replaces the painted one.
3. Export WebP tiles to `src/assets/r01/`, with enough resolution for DPR ≈ 3.
4. Rebuild the room with the new art:
   - the same picture;
   - no invented props and no bed wake-up;
   - a clear walk line;
   - an exit to r02.

## Other pending work

- Adaptive, balanced line art across the game, following the rules above.
- Routine for every change: typecheck → vitest → build → smoke (serve.mjs + shot.mjs) → push `main` → check Actions.

## docs/handoff/tools

These are the previous session's Python scratch scripts (PIL/numpy). Their paths point at the old session's uploads, so edit them before you run them.

| Script | What it does |
|---|---|
| `hires.py` | Crisp reconstruction of the painting at a larger scale. |
| `prep.py`, `prep2.py` | Ink extraction. |
| `flat.py` | Per-region flattening. |
| `gridcrop.py` | Crops with a grid overlay for tracing (`x0 y0 x1 y1 scale step out`). |
| `trace_head*.py` | Traced the bezel ring, the screen and the plank tops that are now in `gorti.ts`. |
| `face.py`, `face2.py` | Face masks. |
| `bezel.json` | Traced bezel data. |
| `screen.py` | Generates `src/assets/figure/gorti-screen.png` (its SDF channels). |
