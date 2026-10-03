# Memory: what the user asked for, decided and taught us

This is the memory of the first working period, 28 September to 3 October 2026. It
was one long Claude Code session that ran over many context windows. `docs/HANDOFF.md`
holds the code's side: the engine, the systems, the commands. This file holds the
user's side: what stands now, their rules and taste, the decisions and why they were
made, the open questions, and every request in order. Quotes are the user's own words.

Where this file and an older document disagree, this file wins. Where it and the user
disagree, the user wins: ask.

## Where things stand (3 October 2026)

- **Links.** The game: https://mizyaz.github.io/Nyluma-game/. The repo:
  https://github.com/Mizyaz/Nyluma-game. The user asks for links, so give them.
- **Branches.** `main` and `paper-engine` hold the same commits.
  - A push to `main` publishes the site.
  - `paper-engine` was the previous lead's working branch, kept as a backup.
  - All other branches were local, and all of them are merged.
- **Last release** (`QA_REPORT.md`, top section):
  - wider side-wall doorways, wholly visible on an upright phone;
  - touch buttons that turn see-through over a doorway;
  - the rewritten story text.
- **Waiting for "başlat".** Three agent briefs are in `docs/briefs/`:
  1. the living bed;
  2. dynamic whales;
  3. the rascals (enemies) and Gorti's new action moves.

  The user said: "Şuanlık sadece promptları hazırla ve her şeyi commitle, ben başlat
  deyince başlayacak." Do not start them before the user says "başlat". Then run
  them one after another (`docs/briefs/README.md`). The user may change the order.
- **Open questions to the user:**
  - The enemy design. The user opened this ("Şimdi gel konuşalım, düşman modellemesi,
    aksiyon hareketleri nasıl olabilir") and three questions are unanswered:
    1. gentle "haylaz" rascals, or real combat;
    2. on a touch, a bud on his head closes, or he is only pushed back;
    3. a test room `b05` first, or straight into the story chapters.

    The defaults (the first option each time) are written in `docs/briefs/README.md`.
  - The mood: `?mood=whimsical` (default) or `?mood=nightmare`. Never chosen.
  - Painting 1, object by object. The user wants to be asked about every object of
    the painting before it is drawn ("o resimdeki her objeyi tek tek sorup mükemmel
    şekilde aktarmak"). The wall pictures matter most.

## How the user works

- **Messages.** Short, in Turkish, often typed fast on a phone with typos ("Heosini" is
  "Hepsini", "dandik" is "shoddy"). Reply in short Turkish: what you did, what you saw,
  what is next.
- **Progress they can see.** They want to try things themselves: "daha sık publish et,
  ben denemek istiyorum". Publish often. Show a render at each step. They judge by eye.
- **Words that steer the work:**
  - "başlat": start the queued work.
  - "Burda dur, daha bir şey yapma": stop.
  - "Her şeyi commitle": commit everything now.
  - "Devam" or "Tamam şimdi hepsine devam edebilirsin": carry on with everything that
    was agreed.
  - "Evet": approval of the option you just proposed.
- **Design talk over test volume.** "300 tane test yapacağına dediklerimi dinleyip
  tasarımı netleştirelim" and "milyon tane test değil": fewer, simpler tests, and more
  attention to what they asked for. Keep the checks that guard what exists, but never
  let testing crowd out the design.
- **Wasted context and slow progress make them angry.** Re-reading the same files,
  hours without a visible step, and a context window that fills with tool output all
  drew hard words. Grep for the lines you need. Trim output. Send broad searches to a
  subagent. Commit early.
- **Agents.** They like work handed to agents with good prompts, run one after another
  ("prompt ayarlayıp agentlara yaptır, sırayla"). The lead reviews, merges, tests and
  publishes, and tells the user in short Turkish.

## Rules (never break)

- The user's paintings:
  - The four in `src/assets/paintings/` hang in the game, at the chapters' starts,
    because the user asked for that. Never add more: no uploads, references or crops.
  - Never trace them, and never extract their lines or colours ("benim resmime line
    extraction, colour extraction yaparak olmaz").
  - Draw every object by hand as SVG in code.
  - Uploads do not survive between sessions: ask the user to upload a painting again
    when you need it.
- No model names or IDs anywhere in the repo, except the commit attribution trailers.
- `QA_REPORT.md` (Turkish) lists only checks that were really run, with their real
  results.
- An agent's report is not the user's approval.
- Agents never push. The lead merges, runs every check, writes the QA section and
  publishes.
- Text the player sees is Turkish, natural and child-friendly. Key hints use the curly
  apostrophe ("E’ye bas"), so that the touch version can rewrite them.

## Taste and art direction

- **A paper theatre in real 2.5D.**
  - Every room is "önü yırtık bir 3d kutu", a 3D box with its front torn open.
  - Every drawing is a card at its own depth, and characters are paper puppets that
    feel 3D.
  - Doors and transitions are made only of walls and paper, on every axis. A door is
    slanted and one with its wall: "2.5d olduğumuzdan kapı da öyle olacak, yani eğimli
    ve duvarla bir".
- **Stylistic, not traced.**
  - First (30 September – 1 October): "2.5 d yap ama 2d modeller pixel perfect match
    etsin", solved "adamakıllı engine yazarak", by writing a proper engine. That is why
    `src/paper/` exists.
  - Then, on 1 October: "pixel perfect yerine daha stilistik git lütfen her şeyde.
    Basit değil, stilistik."
  - So: stylish, rich and hand-made, never simplistic and never a copy of the painting.
    Three circles for the wall pictures were rejected outright.
- **Detail and contrast.**
  - "Pastel demek detayı düşürmek demek değil": pastel does not mean less detail.
  - Crisp detail and definite contrast.
  - Pastel made by lowering the lines' alpha looked bad.
- **Lines.**
  - Balanced with the fill, in each fill's own darker tone, never black ink. Black
    lines looked like "cheap plastic".
  - Adaptive width: thicker on big shapes, thinner on inner details.
  - A comic-book feel, with sound-word bursts.
- **Objects stay separate.** "Orda bir ağaç, uçları gül, gül uçlarından kuş çıkıyor":
  in painting 1 there is a tree, its tips are roses, and birds come out of the roses.
  Each is its own object.
- **Mood.** "Little Nightmares, ama daha whimsical." Whimsical storybook first.
- **Gorti.**
  - No pupils, no smile, no mouth: his face is a screen. "Eski televizyon yüz daha
    hoştu", the old TV face was nicer, and it was brought back.
  - The Sivaslı amca is the only form with a mouth.
  - His leafy, tree-like leg must read.
  - He should resemble the user's drawings.
  - His walk must feel impactful.
- **Whales.** Realistic sperm, blue and bowhead whales ("crossbow" in the message
  meant bowhead), with their calls. Gorti jumps from whales, not from wooden planks.
  Next, they must move more dynamically (brief 2).
- **Getting out of bed.** It was "dandik" twice. Now the bed itself should move,
  branching and blossoming ("dallanmalar, çiçeklenmeler"; brief 1).
- **An experience, not a challenge.**
  - No health, no spikes, no tasks, and he can always go on: "Bulmaca da yok. Deneyim bu."
  - Everything is unlocked from the start, with a scene list, so the user can debug.
  - Later, empty rooms with puzzles may come ("sonra da boş odalar yapıp bulmaca
    ekleyeceğiz").
- **The core is changing form.** "Asıl olay form değiştirmek."
  - The Sun and the Moon are always on screen and change with the chapter.
  - There are NPCs.
  - As the Sivaslı kel amca he is normally a plain man who holds his belly and laughs;
    the laugh swaps the Sun and the Moon, and he can summon either.
- **Moves that grow.**
  - Rezonans: a flower, then birds out of it.
  - The amca shakes the ground and calls the Moon and a purple horse out of the earth.
  - A break move, and things that break.
- **Dialogue.** Scenes with animated faces, and a voice per character, word by word.
  Intense, violin-like music in tense scenes (the user named The Boys' Homelander
  theme).
- **The user's paintings in the game.** They hang as pictures at the chapters'
  starts, and "İncele" shows Gorti glancing at his future and his past. The tunnel
  follows the fifth image: pastel.
- **The floor of r01.** The broken thing on the floor is "yerde bir yarık göz", a slit
  eye in the floor.
- **The story text.** It lives in JSON so the user can edit it. It is now more natural
  and richer, and child-friendly, in the same tone.
- **Code.**
  - Generic, OOP and modular ("generic kodla ki sonra sorun olmasın").
  - Kept in layers: 3D, 2D and 2.5D apart.
  - A chapter-building library with JSON rooms, so the user or an agent can build
    chapters.
  - "Bunlar oyunun bütün olmasından daha önemli": the foundation matters more than
    finishing the whole game.

## Decisions and why

- **The renderer.**
  1. Phaser 3 in 2D, then a 2.5D look.
  2. A three.js paper diorama prototype of the 14th Room, which the user loved
     ("Bayıldım, hatta 2.5d yap ve entegre et tamamını").
  3. A three.js stage across the game, rejected: object overlaps, lost detail, "3js
     dandik".
  4. Back to 2D cards in 2.5D on our own paper engine, in Phaser 4 (`src/paper/`).
     This is current.
- **Gameplay.**
  1. Health, hazards and tasks were removed.
  2. Plank jumps became whale jumps.
  3. In the gameplay reset (30 September) blocks and jumps went.
  4. Jumping came back as an option: nothing needs a jump.
- **Transitions.** A warp tunnel, then a page turn, then (after "geçişler dandik") the
  paper theatre: two flats between rooms, and a curtain with a title card between
  chapters.
- **Doors.**
  1. Several designs were called "dandik", and the root arch in r01 was "anlamsız,
     görüntüyü bozuyor" (meaningless, it spoils the view), so it was removed.
  2. Then doors were cut into the slanted walls.
  3. Then the side doorways were made deeper and kept clear of the touch buttons.
- **r01's floor.** The eye-leaf became the slit eye in the floor.
- **The loading screen.** It was too plain and became a pop-up paper theatre.
- **The Sun and the Moon.** They were too plain. Now they are characters, light sources
  that change, with looks per page in `sky.json`.
- **Gorti's face.** The pixel-perfect painted face was reverted to the TV face.

## Agents run so far

Each worked in its own git worktree and branch. The lead merged and published.

- **Before the paper engine:**
  - strings and a tension cue for the music;
  - the pastel gem tunnel;
  - the comic-paper UI;
  - the three.js diorama prototype;
  - jump set pieces;
  - character detail and limb motion (`chars`);
  - one floor without jumps (`flat`).
- **On the paper engine:**
  - the page-turn transitions, later replaced;
  - jumping and the touch controls (`controls`);
  - the Sun and the Moon as characters, and the story text in JSON (`sky`);
  - doorways (`doors`);
  - the loading theatre (`loading-screen`);
  - doors cut into walls and scene changes on the paper stage (`walls-paper`);
  - deeper side doorways (`deep-doors`).
- **Next:** `living-bed`, `whale-motion` and `rascals`, the three briefs.

## Other open work

- Adaptive, balanced line art across the whole game.
- Atmosphere, lights and mood: Little Nightmares, but whimsical.
- Volume shading for the paper puppets (Phaser 4 lighting with normal maps).
- Check that the DOM UI fits on phones.
- Known issues from the last QA section:
  - the Canvas renderer draws b02's sliding leaf only to the spring line;
  - the moon gate's ferns and the hill door's fringe are clipped;
  - nothing has been tried on a real phone.

## Every request, in order

Dates are UTC. Each line is one message or a few sent together, paraphrased, with the
words that matter quoted. The original specification and story are in
`docs/ORIGINAL_PROMPT.md`.

### 28–29 September: the first game

- 28 Sep. Gave the game specification and the story (Gorti, 382. Dünya, 14. Oda): "Hepsini
  yap, yeni bir repoya, sonra Pages ile paylaş".
- "Fully mobile controllable olsun".
- A 2.5D look:
  - step effects and background effects like warping tubes of crystals;
  - chapter changes the same;
  - the character takes more of the screen;
  - no eyes, all black, but very reactive eyebrows.
- "Sen yap onları" (do those steps yourself). Then the user made the repo:
  https://github.com/Mizyaz/Nyluma-game.git, "Hazır".
- With a screenshot: the controls belong at the bottom; the font is too big on the
  computer; it is not responsive ("yeni oyun butonu bile ekrana sığmıyor").
- "Naptın?" (what did you do?).
- No real jump animation. No spikes or health. A more expressive Gorti. No tasks,
  always progress. Sometimes a random bombardment of colour.
- "Bulmaca da yok. Deneyim bu."
- With five paintings:
  - Gorti's 14th Room underground;
  - the Moon form of the Sivaslı dede, who changes with the Sun and the Moon;
  - Gorti's youth, whipping people into robots;
  - the warrior.

  Also:
  - escalating action moves, with the Rezonans button making birds out of a flower;
  - as the amca he shakes the ground, raises the Moon, and calls a purple horse out of
    the ground;
  - dialogue scenes with face animation and intense violin-like music;
  - the paintings hang at chapter starts, and İncele shows his future and past;
  - the spiral as pastel as the fifth image;
  - generic OOP modular code.
- "Oldu mu?" Then: fewer, simpler tests ("milyon tane test değil"), and publish.
- "300 tane test yapacağına dediklerimi dinleyip tasarımı netleştirelim":
  - the whales must be real (sperm, blue, bowhead), with whale sounds;
  - the character in the picture sent is not our Gorti;
  - the walk is not impactful;
  - the flower effect is plain, and the flower just disappears;
  - Gorti should sleep, then wake, with a cutscene that shows his face up close;
  - every scene is open from the start for debugging;
  - jump from whales, not planks.

### 30 September: style, then 2.5D

- "Devam." Then the paintings' faces have no pupils, and there is no smiling face and
  no mouth on the main character, except the Sivaslı amca.
- "Evet." The art should be more pastel: the black lines look cheap and plastic. Use a
  comic-book effect on screen instead, and a sound per character for each word.
- Asked whether a game engine would give better visuals: 3D models, more artistic
  styles.
- "Daha sık publish et, ben denemek istiyorum."
- With a screenshot: "Kapı dandik, yataktan kalkma dandik." The jump places are
  meaningless: short is fine, but they must mean something.
- About the diorama prototype: "Bayıldım, hatta 2.5d yap ve entegre et tamamını." The
  first chapter first, at its best, closest to painting 1.
- Pastel by low line alpha looks shoddy. Lines feel odd: they want a more fluid
  picture where the parts read. "Önü yırtık bir 3d kutu gibi düşün." A balance of line
  and colour, and adaptive line width.
- "Şuan tüm gücünü 2.5d'ye ver."
- With ten pictures, "daha detaylı resimler":
  - "Pastel demek detayı düşürmek demek değil."
  - Only the first scene, and it must be perfect: bigger scale, the same view, definite
    contrast.
- They wanted a 3D-like, reusable model of the character, close to the drawing (the
  face, the leafy tree leg).
- Asked to change the context limit (200k, then 500k) and was angry that files were
  read again and again with no progress.
- After the three.js stage:
  - "Lütfen iki boyutluya geri dön, oyun da 2.5d olsun."
  - Objects overlap badly, and it should look like a comic book.
- The gameplay reset:
  - blocks and jumps are needless;
  - speech balloons are too big, and dialogue boxes don't catch the eye;
  - there are no NPCs;
  - the Sun and the Moon are always on screen, by chapter;
  - "asıl olay form değiştirmek", and puzzles in empty rooms later;
  - use a generic open-source base, and make our own OOP/functional library for
    building chapters from JSON;
  - clean the code into 3D, 2D and 2.5D folders;
  - "Bunlar oyunun bütün olmasından daha önemli."
- Asked about open-source comic-book drawing tools that work well with Claude.
- The characters lack detail. Limb motion is artificial and not one with the
  surroundings. The break move and breakable things are missing. The Sivaslı kel amca
  mode: a plain man who holds his belly and laughs, and the laugh swaps the Sun and the
  Moon.
- "Hand off yazar mısın?" That is where `docs/HANDOFF.md` comes from.

### 1 October: the paper engine

- "GitHub'da güncel mi?"
- About the published r01, with a screenshot:
  - "O kadar uğraştın, şundan daha iyi modelleyemedin mi?"
  - Three circles were not the wall pictures, and "o duvardaki resimler aşırı önemli".
  - "Bu 2.5d asla değil."
  - "2.5 d yap ama 2d modeller pixel perfect match etsin", by writing an engine
    properly, not by reading lines 30 times or extracting lines and colours from the
    painting.
- They want to be asked about every object of the painting one by one: "Öncelik game
  engine, ve hazır olunca adım adım incelemek."
- "3js dandik. Biz bir oyun motoru kuruyorduk, 2.5d için, kâğıt gibi. O ne oldu?" We had
  started a paper engine where you played 2D in a 3D setting, and the character felt 3D.
- Look for open-source help: "Little Nightmares teması arıyoruz, daha daha whimsical."
- The Sun, the Moon and the loading screens are far too plain and do not read.
- "Önce şimdiki sürümü paylaş ve daha sık paylaş artık."
- The Sun and the Moon need their own light sources and dynamic changes, and so does
  the character. Movement forward and back in depth. The wall details are unfinished.
- With three screenshots, then:
  - "Pixel perfect yerine daha stilistik git lütfen her şeyde. Basit değil, stilistik."
  - "Eski televizyon yüz daha hoştu."
  - "Sen obje ayrımı yapmıyorsun: orda bir ağaç, uçları gül, gül uçlarından kuş
    çıkıyor."
- "Kapılar çok dandik. Geçişler dandik." They asked for a good prompt for the loading
  screen, run by an agent: whimsical and effective 2.5D rather than the painting copied
  one to one.
- About r01's floor, with a screenshot: "Bu rezalet duruyor." The leaf-like thing should
  be a slit eye in the floor.
- "Burda dur, daha bir şey yapma." Then "Her şeyi commitle." Then "Evet, öyle yapalım."
  Then "Tamam, şimdi hepsine devam edebilirsin."

### 2 October: doors, walls, story text, the next agents

- With a screenshot: the r01 door itself is meaningless and spoils the view (removed).
- "Bu kapılar ve geçişlerde 2.5d gereği tüm diğer eksen duvar ve kâğıt olmalı. Bunu
  güzel bir prompt ile ifade et."
- "2.5d olduğumuzdan kapı da öyle olacak, yani eğimli ve duvarla bir." Then "Evet".
- "GitHub linki nerede?"
- "Evet" to two proposals: deeper side doorways, and touch buttons kept off the door.
- The story is JSON. Make it more advanced and natural, keep the tone, more
  child-friendly.
- "Şimdi gel konuşalım:
  - düşman modellemesi, aksiyon hareketleri nasıl olabilir;
  - yataktan kalkış da daha artistic olmalı ve yatak move etmeli, böyle dallanmalar,
    çiçeklenmeler;
  - balina modelleri daha dinamik olmalı;
  - üçünü de agentlara yaptır, prompt ayarlayıp, sırayla."
- "Şuanlık sadece promptları hazırla ve her şeyi commitle, ben başlat deyince
  başlayacak."

### 3 October: handoff

- "Siteye bir handoff ekle, ve tüm agentlara gidecek promptlar dursun. Şuana kadar bir
  memory varsa o da dursun. Başka bir agent bu GitHub'dan devam edecek." That produced:
  - this file;
  - `CLAUDE.md`;
  - the updated `docs/HANDOFF.md`;
  - the portable briefs in `docs/briefs/`;
  - `docs/ORIGINAL_PROMPT.md`.
