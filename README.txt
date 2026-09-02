Math Pokemon - Development Structure Guide

[Project Overview]
Math Pokemon is a browser-based math practice game. A player creates a profile, chooses a starter Pokemon, answers arithmetic questions, earns XP, levels up Pokemon, encounters and captures wild Pokemon, and records discoveries in a Pokedex. The game uses vanilla HTML, CSS, and JavaScript with localStorage persistence.

[Current Folder Structure]
/
|- index.html
|- README.txt
|- download-pokemon.ps1
|- EVOLUTION_SYSTEM_NOTES.md
|- css/
|  `- styles.css
|- js/
|  |- game/
|  |  |- app.js
|  |  `- gameState.js
|  `- pokemon/
|     `- pokemonData.js
`- assets/
   |- background/
   `- pokemon/

[Current File Roles]
File: index.html
Role:
- Contains the screen markup, UI containers, stylesheet link, and ordered script loaders.
Main functions:
- None. It is the application entry document.
Main data:
- HTML IDs and structural containers used by the game scripts.
Relationships:
- Loads css/styles.css, js/game/gameState.js, js/pokemon/pokemonData.js, then js/game/app.js.
Caution:
- The script load order is required because app.js uses state and Pokemon data defined by earlier scripts.

File: css/styles.css
Role:
- Owns all visual layout, component styling, animations, and responsive rules.
Main functions:
- None.
Main data:
- CSS custom properties, selectors, keyframes, and media queries.
Relationships:
- Loaded by index.html and applied to its markup.
Caution:
- Preserve selectors and positioning for interactive controls unless the related UI behavior is intentionally changed.
- The main game Pokemon uses CSS idle and walking micro-movements. Source Pokemon artwork faces left, so app.js inverses the travel direction with an inline buddy-image scaleX flip; reactions never reset the current facing direction.

File: js/game/gameState.js
Role:
- Defines shared storage constants and caches DOM elements used by gameplay scripts.
Main functions:
- None.
Main data:
- GAME_DATA_KEY, DEX_STORAGE_KEY, LEGACY_PLAYER_KEY, PARENT_PASSWORD, and DOM element references.
Relationships:
- Must load before pokemonData.js and app.js.
Caution:
- IDs referenced here must match the HTML markup exactly.

File: js/pokemon/pokemonData.js
Role:
- Owns Gen 1 species data, image mappings, starter definitions, evolution data, rarity data, and wild Pokemon candidates.
Main functions:
- Data initialization for gen1PokemonData, gen1PokemonById, image paths, wild candidates, and Pokedex entries.
Main data:
- pokemonImageData, starterPokemonData, dexSpeciesData, evolutionData, rarityData, wildPokemonData, gen1PokemonData.
Relationships:
- Loaded after gameState.js and used by app.js for Pokemon rendering, encounters, collection, and evolution.
Caution:
- speciesId values must remain consistent with generated image paths and evolution keys. Generation is represented by extensible Pokemon records rather than saved image paths.

File: js/game/app.js
Role:
- Owns game lifecycle, math questions, XP, leveling, encounters, capture, collection, Pokedex, evolution, background settings, trainer selection, UI rendering, and event listeners.
Main functions:
- startGame(), generateQuestion(), checkAnswer(), selectWildPokemon(), applyEvolution(), saveGameData().
Main data:
- Runtime player state, selected difficulties, capture state, trainerOptions, message lists, XP and encounter configuration.
Relationships:
- Uses DOM references from gameState.js and Pokemon data from pokemonData.js.
Caution:
- Keep it loaded last. Its runtime initialization deliberately uses function declarations declared later in this same file.
- The main Pokemon movement controller uses one requestAnimationFrame loop. It selects bounded random destinations and pauses before existing reaction classes take control.

File: download-pokemon.ps1
Role:
- Downloads Pokemon image assets.
Caution:
- Image naming must remain aligned with species IDs and Pokedex numbers.

File: assets/pokemon/
Role:
- Pokemon PNG images resolved from species ID and Pokedex number.
Caution:
- Image paths are computed in JavaScript and must not be stored in saved player data.
- Shared visual decorations such as the sun and green ground are not part of these image files; they are controlled by the Pokemon display markup and CSS.

File: assets/background/
Role:
- Selectable game background images.
Caution:
- The persisted backgroundId must resolve to one configured background option.

File: assets/trainers/
Role:
- Reserved for optional transparent PNG trainer portraits referenced by trainerOptions in js/game/app.js.
Caution:
- This folder may be absent until assets are added. Keep each trainer ID and image path synchronized with trainerOptions; the UI falls back safely to a placeholder when an image is missing.

[Data Structure]
gameData (mathPokemonGameData):
- name, starterPokemon, currentPokemon, activePokemonId
- pokemonCollection: owned Pokemon objects with id, speciesId, name, level, xp, evolutionHistory, isStarter, captured
- playerLevel, playerXP, currentStreak, bestStreak
- encounter and capture progress, question statistics, selectedDifficulties, backgroundId
- selectedTrainerId: ID of the selected entry in trainerOptions; invalid or deleted IDs normalize to trainer-1.

pokemonDex (pokemonDex):
- Array of discovered species IDs. It is separate from pokemonCollection so discovery and ownership are not identical.

Pokemon species data:
- speciesId, Korean name, type, Pokedex number, rarity, calculated image path, and evolution relationship.
- Gen 1 has 151 entries. Species IDs allow later generations to be appended without changing gameplay storage.

difficulty and selectedDifficulties:
- difficulty is the legacy single difficulty value.
- selectedDifficulties is the active array used to choose each new question randomly.

XP data:
- Total XP determines level from Lv.1 to Lv.100.
- Question XP is based on difficulty and may receive a consecutive-answer bonus.

Evolution data:
- evolutionData maps a species ID to next, evolutionLevel, and evolutionMethod.
- The canonical Rock Snake species ID is onix. Load-time compatibility converts the historical onyx typo to onix.
- The canonical Rhyhorn species ID is rhyhorn. Load-time compatibility converts the historical ryhorn typo to rhyhorn.

Rarity data:
- rarityData defines the five runtime tiers: COMMON, UNCOMMON, RARE, EPIC, and LEGENDARY. Each tier maps to a minimum player level, encounter weight, and required capture streak.
- gen1RarityBySpecies in js/pokemon/pokemonData.js is the single source for the assigned rarity of every Kanto Pokemon. gen1PokemonData, dexSpeciesData, and wildPokemonData derive their rarity from it.
- testRaritySystem() verifies all 151 Pokedex IDs, duplicate IDs, missing or invalid rarity values, required special Pokemon tiers, and complete wild encounter candidates.

[localStorage]
Key: mathPokemonGameData
Purpose: Stores the current player's complete game data.
Read by: loadGameData().
Written by: saveGameData() and background, difficulty, and player updates.

Key: pokemonDex
Purpose: Stores discovered Pokemon species IDs independently from the player collection.
Read by: loadPokemonDex().
Written by: savePokemonDex() and registerPokemonInDex().

Key: mathPokemonPlayers
Purpose: Legacy player data fallback.
Read by: loadGameData().
Written by: Not written by the current game flow.

[File Responsibilities]
- css/styles.css: visual layout and responsive rules.
- js/game/gameState.js: DOM references and runtime state.
- js/pokemon/pokemonData.js: Gen 1 species, image mapping, rarity, wild Pokemon, and evolution data.
- js/game/app.js: existing gameplay functions and event listeners, retaining their names and order.

[Feature Ownership After Refactoring]
Feature | File | Main Functions
Pokemon 151 species data | js/pokemon/pokemonData.js | gen1PokemonData, evolutionData
Pokemon image paths | js/pokemon/pokemonData.js | pokemonImageData
Math questions and difficulties | js/game/app.js | generateQuestion(), generateNextQuestion()
XP and levels | js/game/app.js | calculateQuestionXP(), getCurrentLevel()
Encounters and capture | js/game/app.js | selectWildPokemon(), startCaptureChallenge()
Collection and Pokedex | js/game/app.js | renderPokemonCollection(), renderPokemonDex()
Evolution | js/game/app.js + js/pokemon/pokemonData.js | checkForEvolution(), evolutionData
Background settings | js/game/app.js | applyBackground(), renderBackgroundSettings()
Trainer selection | js/game/app.js | renderSelectedTrainer(), renderTrainerSelection(), selectTrainer()
Parent settings | js/game/app.js | openParentMenu(), closeParentMenu()
Storage | js/game/app.js | loadGameData(), normalizeGameData(), saveGameData()
UI and events | js/game/app.js | updateCurrentPokemonDisplay(), checkAnswer()

[Dependency Flow]
HTML and CSS
  -> game state and Pokemon data
  -> game functions (math, XP, Pokemon, storage, UI)
  -> event listeners
  -> localStorage and assets

[Modification Guide]
To add or adjust difficulty rules:
- Update generateQuestion() and its validation in js/game/app.js.

To adjust Pokemon rarity, generation, image mapping, or evolution data:
- Update js/pokemon/pokemonData.js.
- Change a Pokemon tier only in gen1RarityBySpecies. Do not add per-species rarity values to dexSpeciesData or wildPokemonData.

To adjust XP, streak rewards, or level calculation:
- Update XP functions and milestone data in js/game/app.js.

To adjust background settings:
- Update backgroundOptions and background rendering functions in js/game/app.js.
- Keep applyBackground() targeted at the Pokemon panel so the math question panel retains its own background.

To add or replace trainer images:
- Add transparent PNG files below assets/trainers/ and update only the matching image path in trainerOptions in js/game/app.js.
- Do not save image paths in game data. selectedTrainerId is the only trainer value stored with the player.

To adjust parent menu behavior:
- Update parent menu functions and listeners in js/game/app.js.

To adjust the main Pokemon animation:
- Update buddy-idle, buddy-walk-step, and the .buddy reaction selectors in css/styles.css.
- The requestAnimationFrame controller in js/game/app.js owns IDLE, WALK, and TURN state, random destinations, easing, and direction. Keep correct-hop and celebration keyframes intact; app.js pauses movement before a reaction and resumes it afterward.

[Important Notes]
- activePokemonId identifies one object in pokemonCollection; it must reference an existing owned Pokemon ID.
- pokemonDex records discovery and pokemonCollection records ownership; do not merge them.
- Species IDs determine computed image paths. Do not rename an ID without renaming the matching asset rule.
- The historical onyx spelling is accepted only while loading saved data and is normalized to the canonical onix ID before rendering, Pokedex lookup, or evolution lookup.
- The historical ryhorn spelling is handled with the same load-time normalization before rendering, Pokedex lookup, or evolution lookup.
- Existing saved games may contain only difficulty. normalizeGameData() migrates that value to selectedDifficulties.
- Evolution replaces a collection member's species data while retaining that member's progression object.
- Capturing a Pokemon updates both pokemonCollection and pokemonDex.
- Selected background images apply only to the Pokemon game panel, behind the rendered Pokemon. The math question panel never receives a selected background image.
- Pokemon image paths use assets/pokemon/{three-digit Pokedex number}-{speciesId}.png; do not change this rule when changing display decorations.
- Rarity controls encounter eligibility, weighted selection, and required capture streak through rarityData. selectWildPokemon() chooses a tier first and then selects only a matching wildPokemonData candidate.
- Trainer images use the explicit trainerOptions image path, support transparent PNG assets with object-fit: contain, and use a placeholder until the referenced asset becomes available.
- The main Pokemon no longer floats while idle. It uses IDLE, WALK, and TURN states to travel between bounded random destinations with mild vertical walk motion and a subtle idle breathing motion. Direction is retained during CORRECT, STREAK_CORRECT, WRONG, LEVEL_UP, and EVOLUTION reactions; existing reaction animations temporarily take priority and walking resumes afterward.

[Refactoring Status]
- Initial analysis complete.
- CSS and JavaScript are extracted to the actual folder structure above.
- index.html now contains markup and resource loaders only.
- Script load order preserves the original classic-script global API and behavior.