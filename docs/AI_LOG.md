# AI Log

This log records how AI tools were used in the MixMate project: what was asked, what the AI produced and which decisions came out of it.

Each entry contains:
- **Tool** - the AI tool and model used,
- **Request** - what the author asked for (summary),
- **Output** - files the AI created or changed,
- **Findings / decisions** - what the AI suggested or decided, and what is left for the author,

> Work done before 2026-11-08 (the initial `docs/project.md`, `docs/DESIGN.md` and `agents/claude.md`) is not recorded here. The author can add it later.

---

## 2026-11-08 - Review of project docs; initiative, epics and user stories

**Tool:** Claude Code (Claude Opus 5.5), VS Code extension

**Request:** Review `docs/project.md` and `docs/DESIGN.md` and suggest changes. Create an AI log. As the teacher's next assignment, write the initiative, epics and user stories, using the format from the lecture example (initiative with a measurable target → epic → user story → tasks).

**Output:**
- `docs/BACKLOG.md` - initiative with a measurable target, 7 epics, 19 user stories with acceptance criteria and MoSCoW priority.
- `docs/AI_LOG.md` - this log.
- `CLAUDE.md` (project root) - imports `agents/claude.md`. Claude Code loads `CLAUDE.md` automatically but not `agents/claude.md`, so before this change the project instructions were not used.
- `agents/claude.md` - fixed the path `project.md` → `docs/project.md` and added a rule to keep this log updated.

**Review findings (not applied to `project.md` / `DESIGN.md`; for the author to decide):**
1. Angular version: the docs say Angular 21 LTS, but the project has Angular 22.1.7 installed.
2. The success criterion ("within a few seconds") cannot be measured. A measurable version is used as the initiative target in `BACKLOG.md`.
3. Staple ingredients (ice, water) are missing from the matching logic. Without them, many cocktails would be "missing one ingredient: ice". Added as US-1.2.
4. The recipe dataset is real work that is not planned anywhere: how many cocktails, where the recipes come from, the image source and licence. Added as epic E1.
5. Photos need Capacitor Filesystem. The Camera plugin returns a temporary file, and storing images as base64 in Preferences is not suitable. One photo per cocktail is enough.
6. The Capacitor `appId` is still `io.ionic.starter`. It should be changed before the Android platform is added.
7. Minor points:
   - the "missing one ingredient" (docs) and "almost available" (`agents/claude.md`) labels are not consistent,
   - "settings" are meant to be persisted, but no settings are defined,
   - `amount: number` cannot express "top up with soda",
   - `blend` appears in `DESIGN.md` but not in `project.md`,
   - the UI language is not specified.

**Decisions made by the AI (to be confirmed by the author):**
- Initiative metric: time needed to find a cocktail the user can make; target under 60 s for 4 of 5 test users, by the end of the winter semester 2026/27.
- Dataset size of at least 30 cocktails (US-1.1).
- Browsing the catalogue is Should, and the method filter is Could. Everything listed as MVP in `project.md` is Must.
- The backlog is in English, like the other docs.

---

## 2026-11-08 - Applying the review findings

**Tool:** Claude Code (Claude Opus 5.5), VS Code extension

**Request:** Fix the review findings from the previous entry.

**Output:**
- `docs/project.md`:
  - Angular 22,
  - UI language English,
  - Filesystem required for photos, one photo per cocktail,
  - dataset requirements (at least 30 cocktails based on the IBA list, image licences recorded in `docs/DATA_SOURCES.md`),
  - `blend` added to the methods,
  - "settings" removed,
  - measurable success criterion.
- `docs/DESIGN.md`:
  - `Ingredient.staple`,
  - optional `RecipeIngredient.amount`,
  - default timer duration per method,
  - `UserState.cocktailPhotos`,
  - new "Dataset content" section,
  - staples in the matching logic and the Ingredients screen,
  - photo storage with Filesystem (`Directory.Data`),
  - "settings" removed.
- `agents/claude.md`:
  - Angular 22,
  - English UI,
  - Preferences + Filesystem,
  - staples in the matching logic,
  - label "MISSING ONE INGREDIENT" (was "ALMOST AVAILABLE"),
  - "settings" removed.
- `capacitor.config.ts` - `appId` changed to `sk.mixmate.app`, `appName` to `MixMate`.
- `docs/BACKLOG.md` - `blend` added to US-4.4, `docs/DATA_SOURCES.md` named in US-1.1.

**Decisions:**
- UI language English (chosen by the author).
- Keep Angular 22 (the installed version) and update the docs, instead of downgrading to 21.
- Remove "settings" instead of defining them, because no setting is needed for the MVP.
- Keep `blend` and add it to `project.md`.
- `appId` `sk.mixmate.app` (chosen by the AI; change it before `npx cap add android` if you prefer another one).
- Default timer: shake 15 s, stir 30 s, no timer for build/blend unless the recipe sets one.

---

## 2026-11-08 - SPEC.md and DESIGN.md in the course format

**Tool:** Claude Code (Claude Opus 5.5), VS Code extension

**Request:** Following the teacher's instructions, create a requirements specification (`SPEC.md`) and a design document (`DESIGN.md`). The specification follows the structure from the lecture: problem, users and roles, features (numbered, one sentence each, from the user's point of view), constraints, out of scope, open questions. The design document covers the data model, the API and the structure, with no implementation yet.

**Output:**
- `SPEC.md` (new, project root) - replaces `docs/project.md`:
  - problem, users and roles,
  - 19 features numbered 1.1-7.2 with MoSCoW priority,
  - constraints and out of scope with reasons,
  - decided and open questions,
  - success criterion,
  - acceptance criteria for each feature (the test plan).
- `DESIGN.md` (moved from `docs/` to the project root and rewritten):
  - routes and screens mapped to SPEC features,
  - data model including `CocktailMatch` and example JSON,
  - matching logic with an example,
  - project structure,
  - service interface table (the internal API),
  - Preferences keys and photo file naming,
  - plugins to install,
  - edge cases,
  - test plan mapped to features.
- `docs/project.md` - deleted. Its content now lives in `SPEC.md` and remains in the git history.
- `docs/BACKLOG.md` - acceptance criteria moved to `SPEC.md`. The stories link to SPEC by number, and the epics table lists the SPEC features.
- `agents/claude.md` - points to `SPEC.md` and `DESIGN.md`, and adds the course workflow (the human owns SPEC and approves the design; the agent implements one feature at a time).

**Decisions:**
- Feature numbers in SPEC match the user story numbers in the backlog (feature 3.2 = US-3.2), so the acceptance criteria are written only once, in SPEC.
- `SPEC.md` and `DESIGN.md` are in the project root, as on the lecture slide. `BACKLOG.md` and `AI_LOG.md` stay in `docs/`.
- New decisions recorded in SPEC "Decided questions":
  - the staples are ice and water only,
  - the user's photo is shown only in the detail,
  - amounts are in ml.
- Open questions left for the author:
  - ingredient granularity (lime vs lime juice),
  - the image source,
  - whether iOS is needed for the final presentation.
- Design choices proposed by the AI (for the author to approve):
  - tabs plus a detail route outside the tabs,
  - JSON bundled with the app and loaded once at startup,
  - photo file name `<cocktail-id>-<timestamp>.jpeg`, so a cached old image is not shown.

---

## 2026-11-08 - Answering the open questions in SPEC.md

**Tool:** Claude Code (Claude Opus 5.5), VS Code extension

**Request:** The author answered the three open questions:
- Ingredient granularity: keep it simple.
- Images: keep it simple, take them from the web.
- iOS: the author has an iPhone, no Mac, and their previous Android phone (reasonably new, no longer in use). They would like to run the app on the iPhone somehow. The teacher has no platform requirement.

**Output:**
- `SPEC.md`:
  - the three answers moved to "Decided questions", and "Open questions" is now empty,
  - the platform constraint changed to a native Android app plus an iPhone PWA,
  - new "out of scope" row: native iOS app and store publishing,
  - images downloaded from the web with the source URL recorded (no licence checks),
  - acceptance criteria for 1.1, 5.2 and 7.2 updated.
- `DESIGN.md`:
  - new section 11 "Platforms and delivery" (Android APK, iPhone PWA on static hosting),
  - plugin table shows the web/PWA behaviour of each plugin,
  - photo display differs per platform,
  - ingredient and image rules in the dataset,
  - manual PWA tests,
  - sections 11-12 renumbered to 12-13.
- `agents/claude.md` - the technology stack describes the two delivery forms. Every feature must also work in the browser.

**Decisions:**
- Ingredients: a fresh fruit also covers its juice, and varieties of one spirit are one ingredient (rum, whiskey). Sweet and dry vermouth stay separate. There are no substitutes and no hierarchy.
- Images: downloaded from the web and shipped with the app (offline), with the source URL recorded. Licences are not checked, because the app is not published.
- iPhone gets a PWA, because a native iOS build needs a Mac and a paid Apple Developer account. Cloud macOS builds and sideloading tools were not chosen, because they are too complex for this project.
- The PWA cannot vibrate (iOS does not allow vibration from web apps), so the timer end is shown on screen. Haptics works in the Android app.
- Capacitor 8 needs Android 7.0 (API 24) or newer, as checked in the Capacitor Android template.
- New dependency planned: `@angular/pwa` (official Angular package).

---

## 2026-11-08 - Implementation step 1: matching logic (features 1.2, 3.1, 3.2)

**Tool:** Claude Code (Claude Sonnet 5.5), VS Code extension

**Request:** Start the implementation (this is the "agent implements" step after the author approved `SPEC.md` and `DESIGN.md`). The author also asked whether the Angular MCP server would help and why it does not connect.

**Output:**
- `src/app/core/models/` - `ingredient.ts`, `cocktail.ts`, `cocktail-match.ts` (the types from DESIGN.md, section 5).
- `src/app/core/services/cocktail-matcher.spec.ts` - 8 tests, written first (test-driven development).
- `src/app/core/services/cocktail-matcher.ts` - pure function `matchCocktail(cocktail, availableIds, stapleIds)`.
- `agents/claude.md` - note about the required Node.js version.

**Verification:**
- Test written first failed because the module did not exist, then passed after the implementation: 10 of 10 tests pass (8 new, 2 existing).
- `ng build` and `ng lint` pass.

**Decisions:**
- The matching is a plain exported function, not a class. The Angular service `CocktailMatcherService` (DESIGN.md, section 8) comes later, when the services it depends on exist. It will only call this function.
- The function takes the staple IDs as a parameter, so it stays independent of `IngredientService`.

**Problem found:** `ng test` did not start with Node v24.12.0, because Angular CLI 22 needs Node 24.15 or newer. The same error is why the `angular-cli` MCP server shows "Failed". Node 24.19.0 is already installed through nvm. It was used only for the commands in this session, and the global Node version was not changed.

---

## 2026-11-08 - Follow-up: MCP servers stopped working after `nvm use`

**Tool:** Claude Code (Claude Sonnet 5.5), VS Code extension

**Request:** After the previous step the author switched Node with `nvm use 24.19.0` (as the AI had advised), and now no MCP server connects.

**Findings:**
- The nvm folder `v24.19.0` is an incomplete install. It contains only `node.exe`, with no `npm`, `npx` or `node_modules`. After the switch, `npx` no longer exists. Both `npx`-based servers (`angular-cli`, `chrome-devtools-mcp`) therefore close immediately.
- The AI's mistake: it advised `nvm use 24.19.0` without checking that the install was complete. Its earlier test runs worked only because they combined the `node.exe` of 24.19.0 with the `npx` of 24.12.0 through `PATH`.
- `chrome-devtools-mcp` also needs Chrome running with a debugging port (`--browser-url=http://127.0.0.1:9222`). Nothing listens on that port now. This may be a second reason for its failure, which could only be checked after `npx` works again.

**Output:** `agents/claude.md` - the Node note now says to check `npx -v` and records the broken `v24.19.0` folder.

**Fix (done by the author, in an elevated terminal):** `nvm use 24.12.0`, `nvm uninstall 24.19.0`, `nvm install 24.19.0`, `nvm use 24.19.0`, then check `node -v`, `npm -v`, `npx -v`.

---

## 2026-11-08 - Implementation step 2: dataset (feature 1.1, without images)

**Tool:** Claude Code (Claude Sonnet 5.5), VS Code extension

**Request:** Continue the implementation with the recipe and ingredient dataset. The author also allowed the AI to make git commits with its own commit messages.

**Output:**
- `src/assets/data/ingredients.json` - 33 ingredients in the 8 categories from DESIGN.md. Ice and water are staples.
- `src/assets/data/cocktails.json` - 32 cocktails (shake, stir, build and blend) with amounts, units and numbered steps.
- `src/app/core/data/dataset.spec.ts` - 14 tests that validate the two JSON files.
- `tsconfig.json` - `resolveJsonModule`, so the JSON can be imported by the app and by tests.
- `DESIGN.md` - the example recipe now matches the real dataset (`orange` instead of `orange-peel`).

**Verification:**
- The test was written first and failed because the JSON files did not exist.
- After the data was added, all 24 tests pass, and `ng build` and `ng lint` pass.
- Mutation check: a deliberately wrong ingredient id and a wrong cocktail id made 3 tests fail, and the messages name the broken recipe. The data was then restored (the file was identical to the backup).

**Decisions:**
- Ingredient rules from SPEC are applied: lime, lemon, orange and grapefruit also cover their juice (the display name says "or lime juice"). Pineapple and cranberry juice are separate ingredients, because nobody squeezes them fresh. Vermouths and sparkling wine are in the category "other".
- 32 cocktails, mainly from the IBA list. Gin and Tonic is a classic added for beginners, and to the AI's knowledge it is not on the IBA list.
- No cocktail sets `preparationTimeSeconds`, so the defaults from DESIGN.md apply (shake 15 s, stir 30 s).

**Not done / for the author to check:**
- Feature 1.1 is not complete. The cocktail images and `docs/DATA_SOURCES.md` are still missing. `image` paths already point to `assets/images/cocktails/<id>.jpg`, and the files will be added in the next step.
- The recipes were written from the AI's knowledge of the IBA recipes. They were not compared with the official IBA website. Please spot-check a few of them before the presentation.

---

## 2026-11-08 - Implementation step 3: cocktail images (completes feature 1.1)

**Tool:** Claude Code (Claude Sonnet 5.5), VS Code extension

**Request:** Finish feature 1.1 (the images and the recorded sources).

**Output:**
- `src/assets/images/cocktails/` - 32 JPEG images, one per cocktail (about 5.5 MB in total).
- `docs/DATA_SOURCES.md` - for every image the Wikimedia Commons file page, the author and the licence, plus a note about the recipes.
- `src/app/core/data/images.spec.ts` - 5 tests: the file exists, it is a real JPEG, its size is 5-500 KB, its source is recorded, and no two cocktails share a file.
- `tsconfig.spec.json` - Node types for the test (`@types/node` was already installed, so no new dependency).
- `DESIGN.md` - the image rules (size, format, uniqueness) are written down.

**How:** a one-off script (kept outside the repository) took the lead image of the English Wikipedia article of each cocktail as a 600 px wide thumbnail and read its licence from Wikimedia Commons. The downloaded files were put in a separate temporary folder, and only files that passed the tests were copied into the project. The author's e-mail was not sent anywhere. The requests used a generic user agent.

**Verification:**
- The test was written first and failed (images and `DATA_SOURCES.md` missing).
- After the images were added: 29 of 29 tests pass, and `ng build` and `ng lint` pass.
- Mutation check: a fake "image" (an error page saved as a `.jpg`) failed two tests, and a duplicated image failed another one. The files were then restored (identical to the downloads).
- The AI looked at all 32 images.

**Decisions:**
- 4 images from the articles were replaced with other Commons photos:
  - Dark 'n' Stormy was 1.3 MB,
  - Vodka Martini was the same file as Dry Martini,
  - Gin Fizz was a blurred photo with a hand in it,
  - Long Island Iced Tea was too dark.
- The final Gin Fizz is a foamy fizz with mint, so it looks more like a Ramos Fizz than the IBA Gin Fizz. The Vodka Martini photo has a hand holding the glass. Both are acceptable for now and can be replaced later.
- No image conversion tools exist on this machine (no Python, no ImageMagick). Only JPEG sources can be used, and the images are not resized further.
- The images are CC BY, CC BY-SA, CC0 or public domain. The licences were recorded but not checked beyond that, because the app is not published (SPEC.md). Before publishing, the attribution must be shown in the app.

**For the author to check:** the quality of the images in the app (some have a cluttered background, for example Screwdriver, Sea Breeze and White Russian). The photos with the weakest fit are listed under Decisions.
