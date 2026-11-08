# MixMate - Claude Code Instructions

## Project

MixMate is a small cross-platform mobile application for discovering cocktails based on ingredients the user currently has available.

Read the following files before making architectural or feature decisions:

- `SPEC.md` - requirements: features, constraints, out of scope, decided and open questions, acceptance criteria
- `DESIGN.md` - data model, services (internal API), project structure, persistence
- `docs/BACKLOG.md` - initiative, epics and user stories (story US-x.y = SPEC feature x.y)

If these documents disagree, `SPEC.md` wins.

---

## Workflow

The course requires this workflow: the human decides, the agent writes.

1. The author writes and owns `SPEC.md`. Do not change requirements, scope or acceptance criteria in `SPEC.md` without the author's explicit request.
2. The agent proposes changes to `DESIGN.md` before implementing anything that the design does not cover yet.
3. The author reads and approves the design.
4. The agent implements one SPEC feature (or one user story) at a time, following `SPEC.md` and `DESIGN.md`. Not everything at once.
5. The author verifies the result against the feature's acceptance criteria in `SPEC.md`.

If an open question in `SPEC.md` blocks the implementation, ask the author instead of guessing.

---

## AI log

This is a school project and AI usage must be documented.

After every task done with AI assistance, add an entry to `docs/AI_LOG.md` in the format described at the top of that file: date, tool/model, request, output (files created or changed), findings/decisions.

Keep entries short and factual. Do not rewrite or delete earlier entries.

---

## Core principle

Keep the application simple.

This is a university semester project, not a production SaaS platform.

Prefer the smallest implementation that satisfies the requirements.

Do not introduce additional infrastructure, frameworks, abstractions or dependencies unless they solve a concrete problem.

---

## Technology stack

Use:

- Ionic
- Angular 22
- TypeScript
- SCSS
- Capacitor

Development happens on Windows. There is no Mac.

The application is delivered in two forms from the same code:

- **Android:** a native app built with Capacitor and Android Studio, installed as an APK on a phone with Android 7.0 or newer, or run in the emulator.
- **iPhone:** an installable web app (PWA) using the Angular service worker, served over HTTPS from static hosting and added to the home screen from Safari.

A native iOS build is out of scope, because it needs a Mac and a paid Apple Developer account.

Every feature must therefore also work in the browser through the Capacitor web implementations. Where a native capability is missing on the web, the app must degrade gracefully and must not crash. For example, there is no vibration on iPhone, so the timer end is shown on screen.

Do not introduce another frontend framework.

Do not use React, React Native, Flutter, Vue, SwiftUI or Jetpack Compose.

---

## Angular conventions

Use modern Angular practices.

Prefer:

- standalone components,
- signals where appropriate,
- strongly typed TypeScript,
- dependency injection,
- feature-based project structure,
- lazy-loaded routes where useful,
- simple services for business logic.

Avoid unnecessary NgModules unless required by a dependency.

Keep components small and focused.

Business logic should not be embedded directly inside templates.

---

## MVP architecture

The application is local-first.

Do NOT create a backend for the MVP.

Do NOT add:

- Spring Boot,
- Express,
- NestJS,
- Firebase,
- Supabase,
- PostgreSQL,
- MongoDB,
- authentication services,
- cloud synchronization.

Static cocktail and ingredient data should be stored locally, for example:

```text
src/assets/data/
├── cocktails.json
└── ingredients.json
```

User-specific state should be stored locally on the device.

Examples:

- available ingredients,
- favourite cocktails,
- references to user photos.

Use Capacitor Preferences for these values and Capacitor Filesystem for the photo files.

The UI language is English. All cocktail and ingredient names in the dataset are in English.

---

## Service abstraction

Components must not directly load JSON files or access native APIs where avoidable.

Use services.

Expected responsibilities include:

- `CocktailService`
- `IngredientService`
- `CocktailMatcherService`
- `UserStateService`
- `CameraService`
- `PreparationTimerService`

This should make it possible to replace local data with an API in the future without rewriting the UI.

Do not create excessive abstraction layers.

---

## Core MVP functionality

Implement only functionality defined in `SPEC.md`.

Primary flow:

1. User selects ingredients they currently have.
2. Application determines which cocktails can be prepared.
3. Application also shows cocktails missing exactly one ingredient.
4. User opens a cocktail recipe.
5. User sees quantities and preparation instructions.
6. User may use a preparation timer.
7. Haptic feedback occurs when the timer finishes.
8. User may save the cocktail as favourite.
9. User may take a photo of the prepared cocktail.

---

## Cocktail matching

Cocktail matching is core business logic.

It should be implemented separately from UI components and should be easily testable.

For every cocktail:

- compare required ingredients with available ingredients,
- ignore optional ingredients when determining whether the cocktail can be made,
- treat staple ingredients (`staple: true`, e.g. ice, water) as always available,
- calculate missing required ingredients.

Classification:

```text
0 missing ingredients
→ CAN MAKE

1 missing ingredient
→ MISSING ONE INGREDIENT

2+ missing ingredients
→ only show in full catalogue
```

Do not duplicate this logic across components.

---

## Native functionality

Use Capacitor for native device integrations.

MVP integrations:

### Camera

Used for taking a photo of a prepared cocktail.

### Haptics

Used when a preparation timer reaches zero.

### Local persistence

Used for:

- selected ingredients,
- favourites,
- references to user photos.

### Filesystem

Used to store user photos persistently, because the Camera plugin only returns a temporary file. Each cocktail has at most one photo. Do not store images as base64 in Preferences.

### Accelerometer

Not part of the MVP.

Shake detection may be implemented later only if explicitly requested.

---

## UI/UX

MixMate should feel like a mobile application rather than a desktop website.

Prioritize:

- large touch targets,
- readable cocktail recipes,
- simple navigation,
- fast ingredient selection,
- visually clear indication of missing ingredients,
- minimal number of actions required to reach a recipe.

Suggested main navigation:

- Discover
- Ingredients
- Cocktails
- Favourites

Do not add screens without a clear reason.

---

## Non-goals

Do not implement these unless explicitly requested:

- user authentication,
- accounts,
- cloud synchronization,
- AI-generated recipes,
- chatbot,
- computer vision,
- bottle recognition,
- barcode scanning,
- community recipes,
- comments,
- ratings,
- social profiles,
- shopping integration,
- price comparison,
- payments,
- push notification infrastructure,
- custom backend,
- microservices.

If a requested implementation appears to require one of these, first consider a simpler local solution.

---

## Dependencies

Before adding a new dependency:

1. Check whether Angular, Ionic, Capacitor or the browser platform already provides the required functionality.
2. Prefer official Ionic/Capacitor packages.
3. Avoid packages for trivial functionality that can reasonably be implemented directly.
4. Avoid abandoned or unnecessary libraries.

Do not add dependencies merely to reduce a few lines of code.

---

## Code quality

Use:

- strict TypeScript typing,
- meaningful names,
- small functions,
- simple interfaces,
- reusable UI components where appropriate.

Avoid:

- `any`,
- premature optimisation,
- unnecessary design patterns,
- speculative abstractions,
- huge components,
- duplicated business logic.

Comments should explain why something is done, not restate obvious code.

---

## Testing priorities

Automated tests should primarily cover business logic.

Highest priority:

1. cocktail matching,
2. missing ingredient calculation,
3. search and filtering,
4. favourites state,
5. ingredient state persistence.

Native Camera and Haptics functionality can initially be validated manually.

---

## Scope control

When implementing a task:

1. Determine the smallest change required.
2. Follow the existing architecture.
3. Do not silently expand the feature scope.
4. Do not add unrelated refactoring.
5. Do not introduce backend infrastructure.
6. Keep the application runnable after each meaningful change.

If there are multiple valid implementations, prefer the simpler one.

---

## Git workflow

Keep commits focused and understandable.

Examples:

```text
feat: add ingredient selection
feat: add cocktail matching
feat: add cocktail detail screen
feat: add favourites
feat: add preparation timer
feat: integrate camera
fix: persist ingredient selection
```

Do not commit generated build artifacts or secrets.

---

## Current priority

First create a minimal working vertical slice:

```text
Ingredients
    ↓
select ingredients
    ↓
CocktailMatcherService
    ↓
Discover
    ↓
Cocktail Detail
```

Do not start with camera integration, animations, advanced styling or optional functionality.

Get the core cocktail discovery flow working first.