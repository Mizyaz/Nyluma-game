# Source layout

Each folder has one job. Dependencies point downward in this list where
possible (content and gameplay use the engine and the renderers, not the
other way round).

| Folder | What lives there |
| --- | --- |
| `main.ts` | Boot: the Phaser game, the DOM UI, and the 2.5D stage when WebGL2 is available. |
| `engine/` | The runtime: `App`, config and constants, Phaser scenes (`scenes/`), services (`systems/`: input, save, audio, narrative), world runtime (`world/`: rooms, interactables), game state (`state/`), cinematics and synthesized voices (`audio/`). |
| `gameplay/` | The rules of play: the player (`Player.ts`), abilities, Rezonans moves (`moves/`), whale platforms (`whales/`), and actors with behaviour (`actors/`: sun and moon faces, creatures, horse, whales, memory stones, paintings). |
| `content/` | The game's world as data and art: rooms (`rooms/`), room scripts (`scripts/`), dialogue and other data (`data/`), characters (`characters/`), props, paintings and journal art (`art/`). |
| `render/2d/` | Flat 2D drawing: the SVG toolkit, texture rasterizing, palette and style, terrain and background painters (`painters/`), effects (`fx/`), cut-out rigs and their poses (`rig/`). |
| `render/2.5d/` | The paper diorama: three.js draws the Phaser world as a box of paper cut-outs. `hooks.ts` is the only file game code imports; it never loads three.js. |
| `render/3d/` | True 3D models (`figure/`). Not used by the game; kept apart. |
| `ui/` | DOM overlays: HUD, dialogue balloons, menus, touch controls. |
| `music/` | The music engine and track library. |
| `dev/` | Development-only preview pages (`/dev/*.html`). |
| `assets/` | Images imported by the code. |
