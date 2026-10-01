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
| `planes.ts` | `Planes`: one Phaser camera per depth (keyed by `Math.round(z)`, at most 31, drawn back to front). `put(obj, z)` and `zOf(obj)`. |
| `press.ts` | `Press`: prints each SVG part at the exact device scale it shows at (`exactMarkup`, `fitScale`). |
| `box.ts` | `PaperBox`: the box's shader (back wall, floor, ceiling, side walls, torn front). It takes the lamps (`MAX_LIGHTS`), the fog, the darkening at the front (`uNear`) and the contact shadows (`MAX_SHADOWS`). |
| `light.ts` | `Lighting` and the moods `WHIMSICAL`, `NIGHTMARE` and `DAY`. Point lights fall off as `(1 − d²/r²)²` with a wrap term. Cards are tinted at their four corners (MULTIPLY_TWO). There is fog behind z = 0 and silhouettes in front. `casterAt()` picks the lamp that throws a figure's shadow. |
| `air.ts` | `RoomAir`: motes in three depth layers, added light. |
| `castShadow.ts` | `CastShadow`: the figure drawn through its lamp's projection into small RenderTextures and laid on the back wall (scaled about the lamp) and the floor (affine about the feet), filled with the shadow colour. |
| `screen.ts` | `Screen`: the canvas at device pixels (`?dpr=`), and `fitScene` for the flat 1280 × 720 scenes. |
| `clip.ts` | Clip shapes (WebGL only). |
| `fixes.ts` | `patchPhaser()`, called in `main.ts` before the game is made. Phaser 4.2.1 compares the tint mode with `==` on a normalized attribute, so MULTIPLY_TWO never matches without the rounding patch. |
| `stage.ts` | `PaperStage`: the room. `card()`, `addShadow()`, `castShadow()`, the eye following Gorti, shake and zoom. Each frame runs the lights, then the cast shadows, then the contact shadows. |

Conventions:

- World px: x to the right, y down, z toward the viewer. z = 0 is the plane the actors walk on.
  A typical box runs from `back: −300` to `front: 170`.
- Cards always face the viewer. Never tilt the eye.
- The Canvas renderer (`?canvas=1`, used by the gameplay tests) has no box shader, no lamps and no cast shadows: `castShadow()` returns null there.
- Crystals and glows are lights with `cast: false`: they light what is near, but throw no shadows.

### Characters as paper puppets (`src/render/2d/rig/RigView.ts`)

- The turn: `setFacing` eases the shown width from one side through edge-on to the other (cosine, `TURN` = 0.2 s). The parts are reordered at the edge-on moment.
- Limb depth: the near and far limbs stand `SPREAD` (7 world px) before and behind the body, so they move with parallax.
- Every world rig throws a cast shadow. Rigs other than the player also get contact shadows under their feet.

### The Sun, the Moon and the loading screen

- `src/content/characters/sky.ts` draws both faces in bold ink (`#2b2228`): socket, iris (it follows the gaze), heavy lid, and a shut eye for the blink.
- `src/gameplay/actors/Celestial.ts` animates them (18 rays). `SkyScene.ts` places them and dims the one that is not shining.
- `src/ui/LoadingView.ts` is the loading screen. It uses the same faces as inline SVG (`skyFaceSvg`), and a crystal cluster grows with the progress.

## Other pending work

- Adaptive, balanced line art across the game, following the rules above.
- The DOM UI over the device-pixel canvas: check that it fits on phones.
- Routine for every change: typecheck → vitest → build → smoke (serve.mjs + shot.mjs) → push `main` → check Actions.
