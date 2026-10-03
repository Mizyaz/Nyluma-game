# The original prompt (28 September 2026)

This is what the user gave at the very start: a game specification in English and their
story in Turkish. The game was first built from it.

Much of it was changed by the user later: no health, no tasks or puzzles for now,
real 2.5D on our own paper engine, a different art direction, and more. `docs/MEMORY.md`
lists every change in order. Where the two disagree, `docs/MEMORY.md` and the user win.
Keep this file as the source of the story and of the first plan, not as orders.

The game's own words are in `src/content/text/`, rewritten from this story.

## The specification

**KRİSTALLER DÜNYASI — COMPLETE BROWSER GAME IMPLEMENTATION PROMPT**

Execute this prompt as a game-development task. Build the finished game in the available workspace. The Turkish story appended after this specification is the narrative source. This specification defines the playable adaptation, art direction, engineering, and delivery requirements.

Work autonomously in one implementation session. Make reasonable decisions without asking questions. Deliver a complete, tested, playable game with source files and a static production build ready for GitHub Pages. Continue through implementation, asset creation, integration, debugging, and verification. A proposal, design document, landing page, disconnected demonstration, or unfinished prototype does not satisfy this request.

### 1. PRODUCT AND SCOPE

Title: Kristaller Dünyası.
Subtitle: 14. Oda.
Genre: authored 2D side-scrolling surreal adventure with exploration, environmental puzzles, light action, transformations, one mounted sequence, and one multi-phase celestial encounter.
Presentation: hand-drawn cel-shaded 2D artwork, expressive silhouettes, hard-edged shadow shapes, restrained atmospheric layers, and cinematic composition.
Language: Turkish for all player-facing text, including menus, tutorials, subtitles, objectives, and the ending. English identifiers and comments are acceptable in code. Preserve Turkish characters throughout.
Target duration: approximately 25–35 minutes for a first playthrough. This is a compact complete game with five chapters and a definitive ending. Duration is a design target, not a claim to make without playtesting.
Target platforms: desktop keyboard and mouse, plus mobile landscape touch. Portrait remains usable with a letterboxed game and a non-blocking landscape suggestion.
Required structure: exactly twelve authored gameplay spaces across five chapters. Favor dense, distinctive encounters over empty walking distance. Every chapter must be fully implemented.

The central play loop is: observe an environmental change → identify a crystal or memory interaction → choose a body/form or ability → alter the environment → cross the resulting route → discover a short narrative beat and reach a checkpoint.

The player should control Gorti within 15 seconds of selecting New Game. Integrate exposition into movement, scenery, encounters, and short conversations. Avoid a long opening text crawl. Use clear immediate objectives while retaining the story's unanswered metaphysical questions.

### 2. NARRATIVE CONTRACT

Treat the supplied story as authoritative. Keep Gorti Evaskinan, 382. Dünya, 14. Oda, the uncertain existence of thirteen other beings, whale memories, the Sun and Moon, the Sivaslı amca form, the purple horse, the sparrow, the internal forms, and the Ulusal Kristal Komitesi.

Do not invent an explanation for the unknown species that planted the crystals. Do not identify the other thirteen beings. Do not introduce unrelated cosmology, named villains, a conventional rescue quest, or a triumphant reversal of the ending. Resolve incomplete source sentences through a short visual transition without fabricating historical facts.

The opening crystals imprisoned life and poisoned resources. Crystal beauty must coexist with this disturbing function. Gorti is a composite of memories learning to form a personality. Transformation is the basis of both mechanics and psychological conflict.

The fixed ending is the discovery that Gorti has lost ownership of the souls within him through a rights-transfer agreement. Player success means completing the story; this ending is a narrative outcome, not a failure screen. The concluding paperwork must say “Satıldı”. No optional collectible can prevent the sale.

Use short original lines adapted from the source when needed. Preserve these anchor lines at their appropriate moments:
- “Sen tepeye çıkınca, yükseklere, daha yükseklere, algın kadar yükseklere.”
- “Umudun bende değil, daha uzak yıldızlarda, belki de en küçük ama en uzak yıldızda.”
- “Yalanlar sadece doğrular varken oluşur.”
- “Yhvan Est Polita, Nokra Pretalit!”
- “Dönüşmek yanlış değil, dönüşmeliyiz, herkes dönüşmeli. En çok ben dönüşmeliyim.”
- “Geç kaldın! İşe geç kaldın!”
- “Geri dönmek mümkün!”

Do not mechanically paste the entire story into dialogue boxes. Most dialogue beats should use one to three short text boxes. Put optional longer excerpts in an illustrated memory journal. Maintain solemn, strange, mythic language; avoid jokes, contemporary internet slang, and explanatory monologues.

### 3. VISUAL DIRECTION

Use a logical composition space of 1280 × 720. Draw smooth 2D silhouettes with roughly 3–5 logical-pixel dark contours, two or three flat color values per material, and deliberately shaped shadows. The cel-shaded appearance must exist in the artwork itself and remain recognizable without a shader. Use subtle bloom only around small emissive features. Maintain clear foreground, interactive midground, and background separation.

Suggested palette:
- Ink: #191728.
- Deep soil: #292638; root bark: #625166.
- Gorti violet: #9459D8; vein highlight: #D7B3FF.
- Crystal blue: #548CD6; crystal turquoise: #53BFAF.
- Crystal orange: #DE9960; flower ivory: #E8DCCA.
- Moon silver: #C7CCDE; Sun ochre: #D9AE54.
- Contract paper: #D8CEBA; stamp red: #944958.

Keep saturation concentrated in characters and interactive objects. Each chapter has its own dominant hue and silhouette language. Provide at least three parallax layers per outdoor environment; use occluding roots, hanging branches, and foreground framing sparingly so they never conceal hazards. Compose the room around landmarks, sightlines, negative space, and player readability.

Everything on screen must belong to the same visual language. Avoid emoji assets, generic platform tiles, stock UI cards, default engine primitives as final characters, unedited asset-pack mixtures, and pixel-art substitution. Geometry may be used internally, but the visible result must resemble illustrated characters and environments.

Create original local assets. The guaranteed asset route is carefully authored SVG illustrations and cutout body parts rasterized or loaded into cached textures, with procedural skeletal/cutout animation. If image-generation tools are available, use them selectively for compatible backgrounds or portraits, then crop, clean, and integrate the outputs. Do not make tool availability a blocker, and do not leave blank assets or external image URLs.

Build an asset manifest containing dimensions, pivots, attachment points, atlas keys, and animation names. Rasterize vectors once at load/build time; avoid reparsing SVG or regenerating large textures per frame. Preserve crisp outlines at normal gameplay zoom. Decorative randomness must be seeded and generated once per room.

### 4. CHARACTER BIBLE AND ANIMATION

Gorti — root body:
- Approximately 100–125 logical pixels tall in normal gameplay, thin asymmetric torso, long forearms, broad root feet, and a head whose silhouette continues into branch-like hair.
- Bark is muted gray-violet. Purple veins cross the torso and face; luminous vein clusters occupy the eye area. Avoid ordinary cartoon eyeballs.
- Hands have three or four elongated root fingers. A small watch is visible on the LEFT ankle whenever the pose exposes it. Preserve this side when changing facing; use side-aware attachments rather than blindly mirroring the whole design.
- Suggest absorbed identities with faint face-like knots in bark, visible mainly in close-ups.
- Movement has weight: anticipation before jumps, branch follow-through, foot compression on landing, and a slight delayed arm swing.
- Required animation states: idle breathing, walking/running, jump rise, fall, landing, interaction, root extension, whale-song pulse, breath-hold, transformation, hurt, and collapse/reform. Cutout animation is acceptable if poses and timing are authored.
- Keep the gameplay collision body simpler and smaller than the visual silhouette. Branches and hair do not catch on ceilings.

Gorti — Sivaslı amca form:
- A recognizably human man in his fifties with a bald crown, broad face, heavy legs, rounded abdomen, tired posture, plain shirt, brown trousers, and simple shoes.
- Retain faint violet veins and the left-ankle watch as identity cues. Express the source's everyday human familiarity respectfully. Avoid caricature of ethnicity, accent, or regional identity.
- Use a low center of gravity, short purposeful steps, a settling belly/shoulder motion, and deliberate lifting gestures.
- This is a real alternate playable form with different traversal properties, not a portrait swap.

Gorti — unstable giant:
- An enlarged branching outline with longer limbs, separated bark plates, and visible violet fluid suspended between roots.
- Use only in staged transformation and the internal-memory encounter. Camera framing and telegraphed hazards preserve spatial readability.

Gorti — exhausted suited form:
- Final scene: wrinkled jacket, loose fit, slumped shoulders, trembling hands, violet traces near the eyes. Animate opening the door, slow steps, reaching for a document, and turning the page.

Purple horse:
- A large muscular violet horse assembled from soil, liquid, and branching anatomy. Long angular face, expressive nostrils, luminous inner fissures, root-like mane and tail, broad hooves.
- About 210–250 logical pixels long when mounted. Gorti's seated pose must attach correctly to the saddle/back position.
- Required states: emergence from earth, idle breath, gallop, jump, landing, rear, and departure/dissolution. Use a readable four-beat gallop cycle and hoof contacts synchronized with sound.
- Every few hoof strikes leave flowering growth behind. Birds or fish emerge from selected flowers. Cap the number of active creatures.

Moon:
- Two visually distinct portraits/world faces: a round infant-like moon and a weathered ancient moon with deep contour lines.
- Eyes, mouth, and eyelids animate slowly. No decorative UI frame around the celestial body. Its gaze follows Gorti during conversations.

Sun:
- A large ochre disk with bruised violet eye sockets, tear channels, and a fatigued expression. The face is visibly alive and strained.
- Animate coughing as contractions and broken rays. Telegraph dangerous rays through readable shapes and sound, not rapid screen flashes.
- Its collapse is shown through extinguishing rays and sinking behind the canopy. Keep the scene surreal and connected to the source.

Blue whale memory:
- A graceful recognizable whale silhouette moving slowly through dark soil/sky as though through water. Pale ventral grooves, small eye, and long pectoral fins.
- It teaches the song mechanic through a short animated sequence and sound-pattern demonstration.

Sparrow, raccoons, birds, fish:
- Sparrow: small warm-brown body, pale throat, bright-edged wings, quick distinct wingbeats; later cuts the watch-bearing ankle in a symbolic, non-graphic sequence.
- Raccoons: gray coats, masked faces, striped tails, curious lean/sniff poses. Use small groups with background silhouettes suggesting larger numbers.
- Birds and fish must look like separate species classes, each with two or three shape/color variants and lightweight movement loops.

Cowardly form:
- Narrow shoulders, bent knees, oversized torch held with both hands, anxious eyes, ragged clothing, and a silhouette that seems to retreat from its own light.
- Playable in the inner-memory chapter. Animate shaking hands, guarded walking, torch lift, recall, and the torch leaving its hands.

Mechanical form:
- Compact segmented frame assembled from dark metal, thin bone-like struts, hinges, and memory fragments. One eye resembles a key and the other a keyhole.
- Its movements have brief starts and precise stops. Implement one short playable traversal/interaction sequence and the final waking gesture.

Committee attendees:
- Show a few quiet human silhouettes in restrained suits around a circular table during the sale intercut. Their individual identities remain unspecified. Their departure leaves only documents and chairs.

### 5. PLAYABLE ABILITIES AND BALANCING

Core movement:
- Responsive horizontal movement with acceleration/deceleration; initial run speed near 235 units/s and gravity near 1400 units/s², tuned through playtesting.
- Approximately 110 ms coyote time and 130 ms jump-input buffering. Variable jump height via early release. Ground movement must not slide uncontrollably.
- Design every compulsory jump within the tested movement envelope with safety margin. No required blind leaps or single-pixel landings.

Root reach:
- Contextual action attaches to a visible root anchor within approximately 240 units and pulls Gorti along a short controlled path, or grows a bridge from an eligible root bud.
- Choose the nearest eligible highlighted target in the facing direction; require range and unobstructed path checks. No precision mouse aiming is required.
- Display the eligible anchor and path before activation. Use a controlled tween/state transition with validated landing position; a full rope simulator is unnecessary.

Whale language:
- Near a resonance node, open a compact three-symbol call-and-response interaction: low, middle, high.
- Each note has its own shape, labeled input, animation, and tone. Patterns of three or four notes play once, remain visually accessible, and can be replayed.
- No tight rhythm requirement. Wrong input gently resets the pattern without health loss. Successful songs wake a plant, reveal a memory route, or establish a celestial conversation.
- Three notes use left/down/right arrows or A/S/D only while the song panel is active. Movement is suspended during that panel. Touch shows the same three large symbol buttons.

Breath / focus:
- Hold the focus action for up to three seconds to reveal latent crystal surfaces and stabilize designated transformation zones.
- Focus uses a dedicated meter that drains only while active and recharges when released, including in midair. Add a short grace interval so platforms do not disappear instantly beneath the player.
- Focus is available as a hold or accessibility toggle. Every focus crossing has safe recovery ground or immediate checkpoint recovery.
- Ordinary dialogue, menus, and scene transitions do not drain focus.

Voluntary transformation:
- Unlock root ↔ human switching in Chapter 2 at marked stabilization sites. Use the form action there; show where switching is possible.
- Root form can reach anchors and use flexible routes. Human form can weigh down plates and push heavy memory objects.
- Keep a common navigation hull where practical; validate clearance before switching and never place the new form inside solids. Forced story transformations use separate scripted states.
- Later chapters can temporarily lock forms for their authored sequences. Explain the immediate state through animation and one short objective.

Resonance pulse:
- The action key near enemies emits a short-range non-graphic pulse, with a readable wind-up and a cooldown near 0.7 seconds. It disperses small unstable crystal growths.
- Use contextual priority: interaction prompt > valid anchor > combat pulse. Show the current contextual action. Do not trigger two actions from one press.
- Keep combat light: three simple hostile/hazard archetypes are enough—stationary crystal thorns, slow floating memory wisps, and timed root lashes. Give each clear anticipation, active, and recovery states. No loot grind or skill tree.

Coherence and recovery:
- Five clearly readable coherence segments. A hit removes one, gives about one second of invulnerability, and applies modest knockback.
- Falling out of bounds reforms Gorti at the current checkpoint. At zero coherence do the same with full coherence. Required progression items and completed major puzzles remain acquired.
- Checkpoints appear before and after each set piece, normally under 90 seconds apart. No lives counter and no permanent lost collectibles.
- Story assist offers reduced incoming damage, slower encounter timing, and song auto-completion after an explicit button press. Keep the standard difficulty approachable.

### 6. COMPLETE CHAPTER AND ROOM PLAN

CHAPTER I — 14. ODA (rooms 01–03, approximately 5–7 minutes)

01: Children's room beneath the world.
An impossible room among fossilized roots: small bed, wooden blocks, a toy whale, scratched height marks, and a violet-lit window facing solid earth. Begin with direct movement control. Teach walking, jump, and interaction through three objects, then open the root door. The number 14 is visible. Thirteen empty marks suggest Gorti's calculation without explaining their owners.

02: Fossil-root ascent.
A vertical room with broad ledges, two root anchors, a turquoise resonance bud, and one short hazard crossing. Encounter the whale memory and solve the first three-note song. The successful song turns a dormant root into a visible climb route. Include an optional side alcove with one illustrated memory.

03: Crystal-tree chamber.
Combine root reach with a simple focus crossing. Gather a small star from a reachable branch, bind it to the crystal tree through an actual contextual interaction, and watch the tree bloom into birds. Speak briefly with the infant Moon and distant Sun. Ascend through a canopy transition to the surface. Checkpoint before exit.

CHAPTER II — YÜZEY VE YALANLAR (rooms 04–06, approximately 6–8 minutes)

04: First wind.
The forest opens into a wide landscape. Show skin/vein reactions to wind, raccoon silhouettes, and whale-song undertones. Teach focus on a safe route. A memory pool triggers the first human transformation with a short interactive settling/grounding moment.

05: Weight of a remembered life.
Two connected environmental puzzles: use the human body to push a memory-stone onto a plate, then return to the root body to reach the opened elevated path. Make the stone recoverable through a nearby reset interaction. Display the form mechanics through drawings and brief prompts. Meet the ancient Moon; its face replaces the infant Moon's visual language.

06: The forest answers.
Gorti's “Yalanlar!” initiates an unstable-growth event. Three visible root knots must be stabilized with focus and contextual actions while avoiding slow, telegraphed lashes. Each stabilized knot transforms the scenery. On completion purple fluid gathers into the horse. The horse speaks its source line, kneels, and accepts Gorti. This completes the chapter without an additional unrelated boss.

CHAPTER III — MOR AT VE GÜNEŞ (rooms 07–08, approximately 6–8 minutes)

07: Flowering ride.
A hand-authored side-scrolling mounted route lasting roughly 90–120 seconds at standard speed. Constant forward motion with controllable jumps and a focus action to bloom short bridge sections. Teach each hazard once in isolation, then combine them. Horse jumps are forgiving and obstacles are visible at least one second ahead. Use two intermediate restart points so failure never repeats the full ride.
Flowers, birds, and fish emerge behind hoof strikes. One optional memory sits on an alternate jump arc; missing it never prevents progress. End with a calm overlook facing the Sun.

08: Sun encounter.
Three phases in one arena, each with a distinct readable behavior:
1) Evade slow sweeping broken rays, then wake two flower nodes with resonance pulses.
2) Lead spawned fish into the raised current by activating highlighted currents in sequence; keep movement and activation simple.
3) During a clearly signaled opening, focus and release the gathered fish toward the Sun. Repeat a short avoid/activate cycle if necessary until three successful releases complete the encounter.
Give the player continuous movement agency; damage windows must be visible. Fish are pooled visual actors attached to a small number of gameplay projectiles, not hundreds of independent colliders. Checkpoint on entering the arena and after each completed phase. On defeat show the Sun's collapse and Gorti returning to root form. The arena becomes quiet and the sparrow appears.

CHAPTER IV — İÇ KOĞUŞ (rooms 09–11, approximately 7–9 minutes)

09: Sparrow clearing.
Short exploratory recovery area. Follow the sparrow through trees, inspect one optional memory, and hear Gorti's transformation line. Interact with a reflective pool to enter the mind. The forest folds into the interior through layered scenery movement rather than an unexplained menu cut.

10: Torch and reversed memories.
Control the cowardly form inside an impossible dormitory of root-framed beds and suspended clock faces. A clock moves to 13:00 as silhouettes accuse the form of being late. This is narrative pressure, not a real deadline the player can permanently miss.
Carry the torch across three short memory stations. Each station presents a brief arrangement of three pictorial fragments; reverse their displayed order with direct selection/drag or keyboard navigation to restore a path. Show the initial sequence, provide replay/reset, and avoid arbitrary trivia.
After the third station, the torch rises and giant fingers enclose the scene. Gorti's branch-hair gathers forms into fruit-bearing boughs. Give the player a short action to keep the torch's light visible while the event unfolds, with forgiving recovery. The sparrow cuts the left-ankle watch strap/skin symbolically; depict a violet thread and a falling watch without gore.

11: Key and lock.
Control the emerging mechanical form. Use two mechanisms, one requiring the key-eye to align with a visible key outline and the other revealing a matching lock. Alignment should be a small, clear interaction, not a pixel-perfect aiming task. The final route reaches Gorti's legs; the mechanical form anchors its arms and wakes him through a deliberate held action. End with the sound of a stamp.

CHAPTER V — HAK AKTARIMI (room 12, approximately 2–3 minutes)

12: The empty table.
Brief intercut: a stamp lands; attendees turn toward the door and leave. Return control to Gorti in the wrinkled suit. He crosses a quiet hallway, opens the door, and enters the empty circular meeting room. Limit control to slow movement and inspection while keeping the scene fully interactive.
At the table inspect three related document details: portraits of the inner forms, a short correctly written Russian property-related heading with a Turkish gloss, and the Ulusal Kristal Komitesi rights-transfer clause. Use fictional document wording and avoid pretending it is a real legal form. The player turns the final page and discovers “Satıldı”.
After that explicit interaction, deliver the fixed final line: “Gorti, içindeki tüm ruhların sahipliğini kaybetmişti.” Fade the luminous internal portraits into document images, leave the left-ankle watch motif unresolved, then present the ending and credits. Offer replay, chapter select for completed chapters, and the collected memory journal. There is no mandatory sequel teaser or invented escape ending.

### 7. COLLECTIBLES, OBJECTIVES, AND REPLAY

Include eight optional illustrated memory fragments, distributed across Chapters I–IV. Each contains a small original vignette and no more than about 60 Turkish words. They enrich individual remembered lives, animals, and places without solving the central mysteries. Use the Sivas and Irkutsk references where appropriate, without turning them into required geographical claims or trivia.

Keep a single concise active objective visible on demand. After approximately 40 seconds without objective progress, offer a contextual hint button. Hints describe the next physical action. They must not automatically solve every puzzle.

Store collectibles by stable ID, avoid duplicates, and show a simple count in the journal. Chapter replay preserves collected memories and ending status. Completing the story unlocks all chapter starts. Starting a fresh game is clearly separated from replay and asks only for in-game confirmation before overwriting a save.

### 8. CONTROLS AND INTERFACE

Desktop defaults:
- A/D or left/right: movement.
- Space: jump; advance dialogue when dialogue is active.
- E: contextual interaction / root reach / resonance pulse, according to the visible prompt.
- Q: focus/breath, hold by default.
- R: change form at a stabilization site.
- F: begin whale song at an eligible node.
- Escape: pause/back; M: journal.
- Enter: confirm a focused menu choice.

Song, dialogue, puzzles, gameplay, and menus have explicit input contexts. Consume input once; opening a panel must not immediately confirm its first choice. Clear held inputs on blur, scene change, and pointer cancellation. Keyboard movement must not scroll the page while the game has focus. Do not capture browser shortcuts globally.

Mobile:
- Left side: two large directional buttons; right side: jump and primary action.
- Focus and form/song controls appear as large contextual buttons when available. Show readable labels and icons; avoid an overcrowded permanent button grid.
- Support simultaneous movement + jump/action with independent pointer IDs and pointer capture. A sliding finger or cancelled touch must never leave a key stuck.
- Interactive touch regions at least 48 CSS pixels, safe-area insets, and no overlap with subtitles or vital HUD.
- Touch input must work in actual gameplay, not only in menus. Layout adapts to small landscape screens and letterboxed portrait.

HUD:
- Upper left: five coherence marks and a compact focus indicator.
- Upper right: pause and optional objective prompt.
- Bottom dialogue region: readable Turkish text, character name when appropriate, advance prompt, and optional portrait.
- Use system or bundled fonts supporting Turkish. Dialogue should remain comfortably readable at mobile scale; use DOM overlays where helpful for independent text sizing.
- Menus: Yeni Oyun, Devam Et, Bölümler, Anılar, Ayarlar, Katkıda Bulunanlar.
- Settings: master/music/effects volumes, reduced motion, screen shake, text speed including instant text, focus toggle, story assist, and touch controls auto/on/off.
- Support keyboard navigation, visible focus, semantic DOM buttons for menus, and Escape behavior. Use symbols in addition to color for crystals and musical notes.

Pause suspends simulation, encounter timers, focus drain, and narrative events. Backgrounding the tab auto-pauses safely. Cutscenes support skip after a short hold; skipping must apply exactly the same resulting quest state as normal completion.

### 9. SOUND AND MUSIC

Provide an actual local soundscape: footsteps on wood/soil, root extension, crystal resonance, three whale notes, wind, wingbeats, horse hooves, distant Sun coughing, torch movement, mechanism clicks, paper movement, stamp impact, and UI feedback.

Use original synthesized Web Audio sounds or locally bundled permissively licensed audio. Include credits for any third-party material. Procedural music should use a few carefully chosen layered motifs, with a different texture for roots, forest, ride, inner dormitory, and the final room. Keep overall volume modest and avoid harsh repeated high-frequency tones.

Initialize/resume audio only after the player's Start/Continue gesture. Handle blocked audio gracefully. Manage one audio graph, volume buses, short gain ramps, voice limits, and disposal of oscillators/nodes. Pause or attenuate on visibility loss. Prevent duplicated loops when revisiting scenes. No runtime streaming or external audio dependency.

### 10. TECHNICAL STACK AND STATIC-HOSTING CONSTRAINTS

Use TypeScript in strict mode, Vite, and a stable Phaser 3 release with Arcade Physics. Select mutually compatible exact package versions, verify their documentation, and commit the package lock. Match the engine API to the pinned version; do not mix examples from incompatible major releases. Use a supported Node LTS version compatible with the chosen Vite release and record it in .nvmrc and package metadata.

Use Phaser for rendering, cameras, input integration, scene transitions, and physics. Use semantic HTML/CSS overlays for menus and text where beneficial. Keep additional runtime dependencies minimal. React, a backend, account login, API keys, paid services, multiplayer, cloud saves, and a runtime LLM are outside scope.

Everything needed by the player is served from static files. Bundle engine dependencies locally. No runtime CDN imports, external fonts, remote assets, or server routes. Do not use a service worker for this initial release; avoid stale-cache complexity. The game must run when hosted at both a domain root and a repository subdirectory.

Phaser configuration:
- Use a 1280 × 720 design viewport with fitting/centering and responsive HTML overlays.
- WebGL where available; keep the art renderable in the engine's supported Canvas fallback. Do not make custom GPU shaders mandatory.
- Use Arcade fixed-step physics at 60 Hz. Align gameplay state updates and cooldowns with a consistent simulation clock; do not apply a second independent integration loop to the same physics bodies.
- Account for tab suspension and long frame deltas; pause or limit catch-up instead of simulating huge jumps on resume.
- Use camera bounds, a small follow dead zone, gentle interpolation, and deliberate cutscene camera states. Reduced-motion mode removes shake and minimizes parallax/camera sweeps.

Separate game logic from rendering where practical. Use typed finite-state machines for player states, contextual interactions, encounter phases, and narrative events. A shared event bus may connect systems, with explicit cleanup on scene shutdown. Do not put all code in a single source file.

Suggested repository organization, adjusted only when it improves clarity:
- index.html; package.json; package-lock.json; tsconfig.json; vite.config.ts; .nvmrc.
- src/main.ts and src/game/config.ts.
- src/game/scenes/BootScene.ts, MenuScene.ts, WorldScene.ts, EndingScene.ts.
- src/game/entities/Gorti.ts, Horse.ts, MemoryForm.ts, CrystalHazard.ts.
- src/game/systems/InputSystem.ts, AbilitySystem.ts, NarrativeSystem.ts, CheckpointSystem.ts, SaveSystem.ts, AudioSystem.ts.
- src/game/data/rooms.ts, dialogue.tr.ts, memories.ts, encounters.ts.
- src/game/art/ for original SVG definitions, palette, rig/animation definitions, and texture generation.
- src/ui/ for DOM menus, dialogue, journal, settings, and touch controls.
- public/assets/ for packaged images/audio/fonts and public/.nojekyll.
- tests/ for meaningful logic and browser tests.
- scripts/ for build/package/verification helpers as needed.
- .github/workflows/deploy.yml; README.md; THIRD_PARTY_NOTICES.md; QA_REPORT.md.
- dist/ as the ready-to-host build included in the deliverable archive.

Each room is data-driven: bounds, spawn points, static colliders, platforms, anchors, scenery, hazards, checkpoint IDs, interactables, entry conditions, exit conditions, and narrative triggers. Use stable IDs and validate references during development. Keep artwork positioning independent from collision geometry.

Every trigger must be idempotent. Restarting a room cannot duplicate a collectible, register another input handler, replay a completed sale, or spawn another audio loop. Changing scenes cancels pending timers and tweens and disposes colliders, listeners, and room-owned effects.

For moving platforms and anchors, implement only the behaviors required by the authored rooms. Avoid adding general-purpose systems that consume time without improving this game.

### 11. SAVE SYSTEM AND RESILIENCE

Use versioned JSON in localStorage with a game-specific key. Persist save schema version, current chapter/room, checkpoint ID, completed puzzle flags, ability unlocks, selected form when valid, collected memory IDs, ending state, and settings.

Save at safe checkpoints and major completed interactions. Reload at a validated spawn point, never in the middle of a tween, boss projectile collision, transformation, or cutscene. Define normalization rules for story state, form, and room when restoring.

Validate parsed saves, provide sensible defaults for missing optional fields, and recover gracefully from corrupt or unknown schemas. Wrap storage operations in try/catch; if storage is unavailable, keep the session playable and display a quiet “Bu oturumda kayıt kullanılamıyor” notice. Do not crash or block New Game.

Keep settings separate from progress where convenient. Continue is enabled only when a valid playable save exists. Provide a reset-save action under settings with an in-game confirmation. No server persistence is implied.

### 12. PERFORMANCE TARGETS

Aim for 60 fps on an ordinary modern laptop and a usable 30 fps or better on a mid-range mobile device. Report measured results only for devices/environments actually tested. Avoid describing these targets as guarantees.

Target under 15 MB compressed transfer for the initial playable load and under 30 MB for the complete asset set. Lazy-load later chapter artwork when beneficial, with a visible transition and a retry path for load failures. A failed decorative asset should not prevent the core game from starting.

Cache static scenery in textures, pool short-lived particles/fish/birds/projectiles, disable offscreen updates, and cap effects. As initial budgets, use roughly 120 simultaneous decorative particles on desktop and 50 on mobile, with substantially fewer active physics objects. Large crowds are layered visual suggestions.

Avoid huge single atlases that exceed common mobile texture limits. Use a conservative atlas size such as 2048 × 2048 unless a checked platform capability supports more. Limit device-pixel scaling and GPU memory growth. Repeated chapter transitions must release room resources and preserve only deliberate shared assets.

### 13. GITHUB PAGES DELIVERY

Configure Vite base as './' for this route-free static game and construct asset URLs consistently from the build base or imported asset URLs. Test a real repository-prefix mount, such as /kristaller-dunyasi/, in addition to /. Do not use hard-coded leading-slash asset paths. Do not use history-based client routing that requires a server fallback. Chapter selection belongs to internal game state.

Provide these working scripts:
- npm run dev
- npm run typecheck
- npm run test
- npm run test:e2e
- npm run build
- npm run preview

Create a GitHub Actions workflow that builds and publishes dist using the official Pages actions. Verify current compatible action versions at implementation time and pin them deliberately. Include default-branch push and workflow_dispatch triggers, least-required permissions (contents: read, pages: write, id-token: write), a Pages concurrency group, the github-pages deployment environment, npm caching, npm ci, typechecking, meaningful tests, the production build, Pages setup, artifact upload, and deployment. Untrusted pull requests must not deploy with write permissions.

Document the repository setting Settings → Pages → Source → GitHub Actions. Derive the branch/repository information from the actual repository if one exists. Avoid invented owner names, URLs, deployment successes, or access permissions.

If an authorized GitHub repository and deployment capability are already available, complete the authorized publication and verify the actual URL. If access is unavailable, complete the game and provide the source archive, production build, and ready-to-run workflow. State the exact external step still required; never claim a live deployment occurred when it did not. Do not switch hosting providers to bypass the GitHub Pages requirement.

Also include a minimal static-host alternative in the README: serve the contents of dist from a Pages branch/root when desired. Explain that index.html is intended to be served over HTTP(S), not opened as a file:// document.

Reference documentation to consult for the pinned versions:
- https://vite.dev/guide/static-deploy
- https://docs.phaser.io/phaser/concepts/physics/arcade
- https://docs.github.com/en/pages

### 14. IMPLEMENTATION ORDER AND QUALITY CONTROL

Begin by inspecting the existing workspace and preserving unrelated work. If this is an empty project, create the full repository. If it contains a compatible game skeleton, extend it without discarding relevant assets or functionality.

Work in this order without asking the user to choose intermediate options:
1) Establish the build, engine boot, responsive viewport, input contexts, and original visual style.
2) Complete Gorti's movement, collisions, a representative illustrated room, interactions, and checkpoints.
3) Implement abilities and all twelve rooms through the final sale scene, with persistent quest state.
4) Finish character animations, mounted play, Sun phases, internal forms, sound, journal, menus, mobile controls, and accessibility settings.
5) Build the production bundle, play through the complete route, fix progression and deployment issues, and package the finished deliverables.

Manage scope by keeping each sequence concise, using shared systems, and using reusable authored art components. Preserve all five chapters, the specified visual identity, the playable transformations, and the ending. Do not quietly replace missing levels with “coming soon” messages or claim incomplete controls work.

Required automated checks should address actual failure risks:
- Typecheck and production build pass from a clean npm ci.
- Save round-trip, corrupt-save recovery, unavailable storage, and checkpoint normalization.
- Narrative triggers and rewards are idempotent.
- Legal ability/form/room transitions and boss phase transitions.
- All room references and required exit conditions resolve.
- Browser boot at root and repository-prefix paths with no missing assets or uncaught errors.
- New Game, movement/jump/interaction, pause/resume, checkpoint reload, Continue, settings persistence, and ending-page inspection.
- At least one multi-touch movement-plus-action interaction, viewport resizing, and blur/visibility cleanup.

Use browser automation such as Playwright where available. Complete at least one normal-input end-to-end progression run; debug chapter jumps alone cannot prove the campaign is completable. Test difficult sequences independently as needed. Development-only state inspectors may help diagnosis but must not replace verification of actual gameplay and must be absent from the production interface.

Capture and inspect screenshots of the menu, root Gorti in the forest, human form puzzle, mounted sequence, Sun arena, inner dormitory, and final document. Correct clipping, tiny text, inconsistent contours, obscured controls, invisible collision obstacles, and mismatched character scale.

QA_REPORT.md must list what was actually tested, the browser/device or emulation used, the build commands run, and any genuine remaining limitation. If a tool or browser is unavailable, say so and perform the strongest available checks without inventing screenshots, measurements, or test outcomes.

### 15. FINAL ACCEPTANCE AND DELIVERY

The result is ready when a player can open the static build, start a new game, understand the controls, traverse every chapter, use each required mechanic, recover from mistakes, reload progress, reach the contract ending, and return to the menu without developer intervention.

Every visible button must work. Every required object must exist. Every level must have a reachable exit and a recoverable state. All artwork and audio must be included or generated locally from included code. There must be no placeholder prose, TODO gameplay, broken imports, unreachable compulsory collectibles, or references to missing assets.

Deliver the complete project/source archive and the ready-to-host dist archive or folder, plus concise launch/deployment instructions. Include credits and preserve the user's story ownership; do not apply a blanket permissive license to the supplied story or artwork without authorization. Dependency licenses belong in the third-party notices.

The final response should be short: playable URL if truly deployed, deliverable links, exact local launch command, verification status, and any external deployment step that could not be completed. Do not end with questions or an offer to implement the game later. The implementation itself is the requested output.

STORY SOURCE FOLLOWS

The user will paste the Turkish story below this line. Read it as source material and apply the complete game specification above. Start building after reading it.

(The story the user pasted is in the next section.)

## The story (the user's own text)

Kristaller Dünyası 

Bilinen tarihten milyonlarca yıl önce, bilinmeyen bir tür tarafından evrendeki tüm dünya paralellerine ilk kristaller ekildi. Mavi, turuncu, turkuaz ve pek çok başka rengi anımsatan bu parlak mucizeler toprak ile sanki hep birbirlerine ait hissetmişler gibi bağlandı. 

hazları roketlerle yeryüzünü parçaladıktan sonra, bu esrarengiz kristaller bitkiler tarafından emildi ve yayıldı. İlk işleri tüm kaynakları zehirleyerek tüm yaşamı kendi içlerine kilitlemek oldu. Yıllar boyunca sayısız uygarlık bu kristallere dokunduysa da, hiçbiri onların gerçek gizemini çözemedi. Ta ki 382. Dünya'da Gorti Evaskinan doğana kadar. 

Gorti, yeryüzünün binlerce kilometre altında, fosilleşmiş ağaç köklerinin kristallerle etkileşimi sonucu oluştu. O, yıllarca topraklarda gizlenmiş insan hatıralarının birleşimiydi; ancak Gorti, sadece onların en garip ve ilginç kısımlarını kullanmayı seçti. Kendine "14. Oda" adını verdiği bir çocuk odası yarattı. Kendi hesaplarına göre, onun gibi 13 başka varlık daha oluşmuştu ama onların kaderleri bilinmiyordu. Ruhların arasında, zamanla sadece insanlara değil, başka hayvanlara ait hatıraların da olduğunu keşfetti. Bunlardan en ilginci, mavi balinalarla kurduğu duygusal bağ idi.

Bu bağ sayesinde, Ulu Balina Dili ile tanıştı. Balina dili aracılığıyla Gorti, Güneş ve Ay ile iletişim kurmayı öğrendi. İlk olarak Ay'a sordu: "Bir sonraki değişim ne zamandır?" Ay ona döndü ve fısıldadı: "Sen tepeye çıkınca, yükseklere, daha yükseklere, algın kadar yükseklere." Gorti, eliyle kökleri topladı ve uzağa, bir kristal ağacına uzandı. Sonra kafasını güneşe çevirdi ve sordu: "Bu yolda benim umudum nedir? Neden var oluşum var? Sebebimin oluşu ve gizemi varlığın ayrık sebeplerinden bir başkası mı?" Güneş, morarmış gözleriyle onu süzdü ve yanıtladı: "Umudun bende değil, daha uzak yıldızlarda, belki de en küçük ama en uzak yıldızda." 

Gorti'nin önünde, ufak bebekler gibi parlayan bir yıldız oluştu. Gorti önce sarmaşıklarıyla yıldızı sardı, sonra da kristal ağacını. Bir anda ağacın çiçekleri açtı ve içlerinden yavru kuşlar doğdu. Kuşlar öyle bir sesle cıvıldadı ki Gorti hiç olmadığı kadar ayıldı ve ayağa kalktı.
Köklerinden kuvvet alarak daha yükseğe çıktı. Toprakla birleşip daha da büyüdü. Yolculuğunda binlerce rakunun meraklı çığlıkları ve balinaların şarkıları ona eşlik etti. Ve sonunda yeryüzüne ulaştı. Gorti artık bu garip dünyadaki yüzlerce insanın hem hepsi hem de hiçbiri olmuştu.

Gorti, yeryüzüne ulaştı ve derisini ilk defa gerçekten hissetti. Rüzgarın parçacıklarının gücünü nefes alışında ve gözlerinin yerini gören, parlayan mor damarlarında hissediyordu. Değişimler artık onun bir parçasıydı.

Hareketsizliği, onu hafızasındaki kişiler arasından en çok yaşlı bir Sivaslı amcaya benzetiyordu. Sivas... Belki de asla nerede olduğunu bilemeyeceği ama ruhunun bir parçasının kesinlikle o diyarlardan geldiğini bildiği bir yerdi.

Kim bilir kaç bölge daha böyleydi? Hangi tür hayvanlar bu insanlarla etkileşime girmişti? Ve en önemlisi: Bu insanların toplam bilgisi, bireysel toplamları kadar mıydı, yoksa çok daha fazlası mıydı?

Gorti bu sorulara bağlandıkça benliğini kaybetmeye başladı. Sivaslı amca figürünü gözlerinin önüne getirdi. Ancak gözleri, her zamanki görevleri olan çevreyi izlemeyi değil, Gorti’yi izlemeyi seçmişlerdi. Gorti artık ellili yaşlarında, kel bir Sivaslı amcaydı.

Dünya, bu değişimi daha fazla kaldıramadı ve önceden konuştuğu bebek yüzlü ayın yerine, yaşlı bir ulu ay belirdi.

Gorti düzleşmiş boynunu havaya kaldırdı ve aya sordu: "Ben neyim? Bu hep ait olduğum form muydu?"

Ay ona baktı ve güldü: "Yalanlar sadece doğrular varken oluşur. Sen artık insanlık gözünde bir doğruluksun. Yalanını da kendin bulmalısın."

Gorti nefesini tuttu. Dallarından gelen sülfür kokusunu değil, mor gözlerinin sıvısını kanına katmak istiyordu. Ve bu, gerçekten onu mutlu ediyordu. Yaşlı, şişman bacaklarıyla geri bir adım attı ve son sesiyle bağırdı: "Yalanlar!"

Sözleri tüm ormanı salladı. Kendini dünyanın bir parçası değil, bir izleyicisi olarak hissetti. Belki de kendisi ayın ta kendisiydi. Uzaklardaki yankılar, civardaki tüm çiçekleri uyandırdı ve hepsi dallarını birleştirdi.

Gorti büyümeye başladı ve büyüdükçe mor sıvısı etrafa saçılıyordu. Kendini kontrol altına almalıydı, ancak bacakları onu dinlemiyordu. Nefesini tekrar durdurdu ve yalnızca yükselmek istedi.

Orman sallanmaya devam etti. Toprakların mor sıvıyla birleşimi sonucu, dev ve mor bir at oluştu ve Gorti’yi sırtladı. At, mutlu ve gizemli nefesiyle bağırdı: "Yhvan Est Polita, Nokra Pretalit!"

Sözlerini hiçbir hayvan anlamamıştı ama Gorti tüm kanıyla hissetmişti. Dünya değişim istiyordu ve bu at, ona tüm değişimi sağlayacaktı. Gecenin uğultusunu atın toynak sesleri bastırdı ve her bir adımında başka bir orman çiçeklerle doldu. Çiçekler çok kısa zamanda açtı ve içlerinden yavru kuşlar ile balıklar doğdu.

Gorti, yalanlarını benimsemiş haliyle bir kez daha nefesini tuttu ve bağırdı: "Güneş!"

Uzaklarda sarı ışığını öksürükler ile dalgalandıran Güneş gözüktü. Gözleri milyonlarca hayvanın gözyaşlarını artık taşıyamıyordu. Umutlarının yerini yalanlar sarmıştı artık. Gerçek bir umuda yer yoktu. 

Gorti değişimleri umudunun önüne geçirmeye kararlıydı. Parmaklarını güneşe doğrulttu ve tüm balıkları güneşe doğru saldırttı. Çok zaman geçmeden güneş çöktü ve Gorti normal formuna geri döndü.

Uzaklarda bir serçe gözüktü. Kanatlarının yansıması Irkutsk Nehri’nin Güneş ile
selamlaşmasını engelleyecek parlaklıktaydı, zaten Güneş de ortalıkta pek yoktu.
Serçenin her kanat çırpışı, çevredeki ağaçların varlık hislerini güçlendiriyordu. 
Gorti en sakin haliyle ormanın derinliklerinden kendini kurtardı. Gecenin
olaylarından ve keşiflerinden kendini sıyıramamıştı. Ancak tüm bunlara rağmen çok
mutluydu. Milyonlarca ruh arasından kendi kişiliğini oluşturmak üzereydi ve
başaracağını bilyordu. “Dönüşmek yanlış değil, dönüşmeliyiz, herkes dönüşmeli.
En çok ben dönüşmeliyim.” Kendi içinde motivasyon sağlamaya çalışıyordu ancak
ruhunun farklı parçalara bölünme isteğini engelleyemiyordu. Beynindeki geveze
ruhları zihninin yüzeye yakın bir köşesine topladı. Gözlerini bir kez daha gerginlikle
kapattı.
Düzensiz akan su damlaları tüm koğuşu uyandırdı. “Konuşun!” dedi meşalesini
tutulmuş asi görünüşlü ama korkak bir fiziksel form. Bu form Gorti miydi yoksa
ruhlar arasından birinin özgür hali mi? Bu soruyu Gorti de kendine sordu ancak
cevap bulamadı, bilgiler tahminlerin çoktan gerisinde kalmıştı. Kısa zamanda
onlarca fiziksel form oluştu ve meşaleye doğru eğildiler.
“Saat öğleden sonra 1 olmuş!” Dedi uzaktan bir ses. Herkes parmağıyla korkak
formu gösterdi.
“Geç kaldın! İşe Geç Kaldın!”
Korkak form meşalesini zar zor tutuyordu. Zaman algısını daha tam
anlayamamışken gelen bu bildirinin tüm dengesini bozmasına izin vermedi. “Geri
dönmek mümkün!”
Meşalesini son gücüyle salladı ve Gorti’nin dev parmaklarını gördü. Hırsından
dolayı meşaleyi havaya fırlatmıştı. Parmaklar ansızın üç farklı bölgesinden onu
yakaladı ve sırayla tüm anılarını tekrar oynattı. Üzücü, kırıcı, mutluluk verici, ve
zehirli tüm anılar ona ters akışta geri yüklendi. Korkak formun gözlerinden yukarı
doğru göz yaşları akmaya başladı ve meşaleyi sardı. 
Gorti bu sefer tüm vücuduyla belirdi. Saçından çıkan dev apaç dalları tüm formları
topladı. Formlar kuş sesleri ile yardım çığlığı atsa da kurtulamadı. Tüm ruhlar
yeşermeye ve meyve sağlamaya başladı. Bu sefer bir formun onu ele geçirmesine izin vermeyecekti, yalanlar ruhların kendisinden meyvelenmeliydi. Dili dışarda
gelecek meyveleri beklerken kuşlardan biri Gorti’nin saat taktığı sol ayak bileğini
son gücüyle kesti. Saat geç olabilirdi ancak evren Güneş doluydu. Yeni umutlar
için geç değildi. 
Çok geçmeden korkak formun kalıntılarından bir mekanik form oluştu. Gözleri bir
anahtar ve kilidi temsil eden bu form acımasız ve ruhsuzdu. Anılar geri sarılmış
olsa bile bazı olaylar ruha işlenmez, bizi bantlarla tutulmuş dünyalarımıza
bağlamak için iskelet olur. Mekanik form bunu belki korkak forma artık
sağlamayazdı ancak başka ruhlara aktarmak da bir seçenekti. Son gücüyle
kollarını Gorti’nin bacaklarına sapladı ve onu bu rüyadan uyandırdı.
Masaya sert bir damga basıldı, “Satıldı”. Yuvarlak masadaki herkes kapıya baktı.
“Gelmedi.”, “Evet, gelmedi.”, “Keşke gelseydi.”. 
Bir süre sonra kapı aralandı ve yorgun haliyle kırışık takımı içerisinde Gorti girdi.
Masada sadece kağıtlar kalmıştı. Titrek elleriyle kağıtlardan birini döndürdü ve
damgayı gördü. Anlaşmanın bir kısmı rusçaydı, emlak ile ilgili veriler yazıyordu ve
her yerde zihnindeki formların gerçek duran resimleri vardı. Belge Ulusal Kristal
Komitesi’nin bir hak aktarımı anlaşmasıydı. Gorti içindeki tüm ruhların sahipliğini
kaybetmişti.
