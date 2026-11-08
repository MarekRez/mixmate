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
