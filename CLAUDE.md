# Kristaller Dünyası — 14. Oda

A whimsical 2.5D paper-theatre game: Phaser 4.2.1, TypeScript (strict) and Vite 7, on our
own paper engine (`src/paper/`). The UI and the story are in Turkish.

Read these before anything else:

1. `docs/HANDOFF.md`: the state of the code, the engine, how to set up, test and publish.
2. `docs/MEMORY.md`: the user's side. It covers what stands now, their rules and taste,
   the decisions and why, the open questions, and every request in order.
3. `docs/briefs/README.md`: three agent briefs (the living bed, dynamic whales, the
   rascals). They wait for the user to say "başlat". Never start them before that.

Always:

- Reply to the user in short Turkish. Show renders, publish often, and give the links:
  - the game: https://mizyaz.github.io/Nyluma-game/
  - the repo: https://github.com/Mizyaz/Nyluma-game
- Publishing is a push to `main`, which deploys through GitHub Actions to `gh-pages`.
- Before a push, run `npm run typecheck`, `npx vitest run`, `npm run kd -- check` and
  `npm run build`. Before a release, also run the browser tests and both campaigns
  (`docs/HANDOFF.md`).
- The user's paintings:
  - The four in `src/assets/paintings/` hang in the game because the user asked for
    that. Never add more: no uploads, references or crops of them.
  - Never trace them, and never extract their lines or colours.
  - Draw by hand as SVG.
- Write model names or IDs nowhere in the repo except commit attribution trailers.
- `QA_REPORT.md` lists only checks that were really run, with their real results.
- Kill processes by PID. Keep Playwright off ports 4173–4175 with `KD_E2E_PORTS`.
- Don't waste context. Never re-read a file you have read; grep for the lines instead.
  Trim long output.
