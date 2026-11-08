# MixMate - Design Document

This document explains how MixMate is built. What the app must do is defined in [SPEC.md](SPEC.md), and features are referred to by their number there (e.g. *feature 3.2*).

This document contains no implementation. The type and JSON snippets only describe the shape of the data.

---

## 1. Overview

MixMate is an offline-first mobile app built with Ionic, Angular 22 and Capacitor. It has no backend. The app ships with its recipe data, and all user data stays on the device.

The same code is delivered as a native Android app and as an installable web app (PWA) for iPhone (see section 11).

The main interaction:

**Select ingredients → see matching cocktails → open recipe → prepare drink.**

## 2. Design principles

- Keep the number of taps needed to reach a cocktail low.
- Prefer simple local data over backend infrastructure.
- The app must work offline.
- Recipes must stay readable while the user is making a drink.
- Avoid features that do not support the main workflow.
- Keep the architecture simple enough for a semester project.

## 3. Main user flow

1. The user opens the app and lands on Discover.
2. On first use, Discover asks the user to select ingredients (feature 3.3).
3. The user marks available ingredients on the Ingredients screen (2.1, 2.2).
4. The user returns to Discover, which shows the cocktails they can make and those missing one ingredient (3.1, 3.2).
5. The user opens a cocktail and follows the recipe (4.1, 4.2).
6. If needed, the user starts the preparation timer, and the phone vibrates when it ends (5.1, 5.2).
7. The user can mark the cocktail as a favourite or take a photo of the drink (6.1, 7.1).

---

## 4. Navigation and screens

The app uses an Ionic tab bar with four tabs. The cocktail detail opens over the tabs, so the recipe has the whole screen.

| Route | Screen | Features |
|---|---|---|
| `/tabs/discover` (default) | Discover | 3.1, 3.2, 3.3 |
| `/tabs/ingredients` | Ingredients | 2.1, 2.2, 2.4 |
| `/tabs/cocktails` | Cocktails | 4.3, 4.4 |
| `/tabs/favourites` | Favourites | 6.2 |
| `/cocktail/:id` | Cocktail detail | 4.1, 4.2, 5.1, 5.2, 6.1, 7.1 |

### 4.1 Discover
- **Can make now** section.
- **Missing one ingredient** section. Each card names the missing ingredient.
- **Empty state:** if no ingredients are selected, a message and a button that opens Ingredients. If nothing can be made, the "Missing one ingredient" section comes first.

### 4.2 Ingredients
- Ingredients are grouped by category, and each has an available/unavailable toggle.
- A search field filters the list by name.
- Staples (ice, water) are not listed.

### 4.3 Cocktails
- The whole catalogue, with search by name and a filter by method.
- Each item shows whether the user can make it now.

### 4.4 Cocktail detail
- Image, name and method.
- Ingredients with amounts. Missing ones are highlighted, and optional ones are labelled.
- Numbered steps.
- A timer, when the recipe or its method needs one.
- A favourite toggle.
- The user's photo, if there is one, and a button to take a new photo.

### 4.5 Favourites
- A list of favourite cocktails. Tapping one opens its detail.
- An empty state that explains how to add a favourite.

### Shared component
- **Cocktail card:** image, name, method, and optionally the name of the missing ingredient. Used on Discover, Cocktails and Favourites.

---

## 5. Data model

### Ingredient

```ts
type IngredientCategory =
  'spirits' | 'liqueurs' | 'juices' | 'syrups' |
  'bitters' | 'fruit-and-herbs' | 'mixers' | 'other';

interface Ingredient {
  id: string;            // kebab-case, e.g. 'white-rum'
  name: string;          // English display name
  category: IngredientCategory;
  staple?: boolean;      // ice, water: always available, never missing, not listed
}
```

### Recipe ingredient

```ts
interface RecipeIngredient {
  ingredientId: string;
  amount?: number;       // omitted for "top up", "as needed" or a garnish
  unit: string;          // 'ml', 'dash', 'piece', 'top up', 'as needed'
  optional?: boolean;    // e.g. a garnish; ignored by matching
}
```

### Cocktail

```ts
type PreparationMethod = 'shake' | 'stir' | 'build' | 'blend';

interface Cocktail {
  id: string;            // kebab-case, e.g. 'negroni'
  name: string;
  image: string;         // path under assets/images/cocktails/
  method: PreparationMethod;
  ingredients: RecipeIngredient[];
  instructions: string[];          // one item per numbered step
  preparationTimeSeconds?: number; // if omitted: shake 15 s, stir 30 s, otherwise no timer
}
```

### Match result

This is calculated at runtime and never stored.

```ts
type MatchStatus = 'can-make' | 'missing-one' | 'missing-many';

interface CocktailMatch {
  cocktail: Cocktail;
  missingIngredientIds: string[];  // required, non-staple ingredients the user lacks
  status: MatchStatus;
}
```

### User state

```ts
interface UserState {
  availableIngredientIds: string[];
  favouriteCocktailIds: string[];
  cocktailPhotos: Record<string, string>; // cocktail ID -> photo file name
}
```

### Dataset files

`src/assets/data/ingredients.json`:

```json
[
  { "id": "gin", "name": "Gin", "category": "spirits" },
  { "id": "campari", "name": "Campari", "category": "liqueurs" },
  { "id": "ice", "name": "Ice", "category": "other", "staple": true }
]
```

`src/assets/data/cocktails.json`:

```json
[
  {
    "id": "negroni",
    "name": "Negroni",
    "image": "assets/images/cocktails/negroni.jpg",
    "method": "stir",
    "ingredients": [
      { "ingredientId": "gin", "amount": 30, "unit": "ml" },
      { "ingredientId": "campari", "amount": 30, "unit": "ml" },
      { "ingredientId": "sweet-vermouth", "amount": 30, "unit": "ml" },
      { "ingredientId": "ice", "unit": "as needed" },
      { "ingredientId": "orange-peel", "amount": 1, "unit": "piece", "optional": true }
    ],
    "instructions": [
      "Pour gin, Campari and vermouth into a mixing glass with ice.",
      "Stir until well chilled.",
      "Strain into an old-fashioned glass over fresh ice.",
      "Garnish with orange peel."
    ]
  }
]
```

Dataset rules:
- At least 30 cocktails, mainly from the IBA official cocktails list (feature 1.1).
- All names are in English, and IDs are kebab-case.
- Ingredients are kept simple, as decided in SPEC:
  - a fresh fruit also covers its juice (`lime`, not `lime-juice`),
  - varieties of one spirit are one ingredient (`rum`, `whiskey`),
  - sweet and dry vermouth are separate,
  - there are no substitutes and no hierarchy.
- Every `ingredientId` must exist in `ingredients.json`. A unit test checks this.
- Images are downloaded from the web, resized to about 600 px wide, and saved as `assets/images/cocktails/<cocktail-id>.jpg`. The source URL of each image is recorded in `docs/DATA_SOURCES.md`.

---

## 6. Matching logic

For each cocktail:

1. Take its ingredients and drop the optional ones.
2. Drop the staples.
3. The remaining ingredients that are not among the user's available ingredient IDs are the **missing** ones.
4. Classify the cocktail:
   - 0 missing → `can-make` (Discover, "Can make now")
   - 1 missing → `missing-one` (Discover, "Missing one ingredient")
   - 2 or more missing → `missing-many` (only in the full catalogue)

Example: the user has gin and Campari. The Negroni needs gin, Campari and sweet vermouth (ice is a staple, and the orange peel is optional), so the result is `missing-one` with sweet vermouth missing.

The matching is a pure function with no Angular or Capacitor dependencies, so it can be unit-tested directly. It is calculated in one place only (see `CocktailMatcherService`), and screens never repeat it.

---

## 7. Project structure

```text
src/
  app/
    core/
      models/            Ingredient, Cocktail, UserState, CocktailMatch types
      services/          services from section 8
    features/
      tabs/              tab bar layout
      discover/          Discover page
      ingredients/       Ingredients page
      cocktails/         Cocktails page
      cocktail-detail/   Cocktail detail page
      favourites/        Favourites page
    shared/
      components/
        cocktail-card/
  assets/
    data/
      ingredients.json
      cocktails.json
    images/
      cocktails/         catalogue images, named <cocktail-id>.jpg
```

Each page is a standalone component, lazy-loaded from the router.

---

## 8. Services (internal API)

There is no backend, so the app's API is the public interface of its services. Components only talk to these services. They never load JSON files or call Capacitor plugins directly. If an online API is ever added, only the services change.

State is exposed as read-only Angular signals. Methods change the state.

| Service | State (read-only) | Methods | Features |
|---|---|---|---|
| `IngredientService` | all ingredients | get ingredient by ID; list non-staple ingredients by category; search by name | 1.2, 2.1, 2.4 |
| `CocktailService` | all cocktails | get cocktail by ID; search by name and filter by method | 1.1, 4.3, 4.4 |
| `CocktailMatcherService` | matches for all cocktails, recalculated automatically when the available ingredients change | match one cocktail against a set of available IDs (pure function) | 3.1, 3.2, 4.2 |
| `UserStateService` | available ingredient IDs, favourite cocktail IDs, cocktail photos | toggle ingredient; toggle favourite; set the photo for a cocktail | 2.2, 2.3, 6.1, 6.2, 7.2 |
| `PreparationTimerService` | remaining seconds (or none if no timer is running) | start for a cocktail; cancel | 5.1, 5.2 |
| `CameraService` | none | take a photo for a cocktail (returns the file name, or nothing if cancelled or denied); get a displayable URL for a photo file | 7.1, 7.2 |

Notes:
- **Loading data:** the JSON files are bundled with the app and loaded once at startup, so the data is available synchronously and works offline.
- **Timer:** `PreparationTimerService` takes the duration from `preparationTimeSeconds` or the default for the method. At zero it shows the end on screen and triggers Capacitor Haptics. On the web, where haptics is not available, it only shows the end on screen.
- **Photos:** `CameraService` takes the photo with Capacitor Camera, saves it with Capacitor Filesystem, deletes the previous photo of that cocktail, and returns the new file name. `UserStateService` then stores the file name.
- **Displaying a photo:** `CameraService` also hides the platform difference. On Android, the file URI is converted to a displayable URL. On the web (PWA), the file is read back and shown as a data URL.

---

## 9. Persistence

| What | Where | Format |
|---|---|---|
| Recipes, ingredients | bundled JSON in `assets/data/` | see section 5 |
| Available ingredients | Capacitor Preferences, key `availableIngredientIds` | JSON array of IDs |
| Favourites | Capacitor Preferences, key `favouriteCocktailIds` | JSON array of IDs |
| Photo references | Capacitor Preferences, key `cocktailPhotos` | JSON object, cocktail ID → file name |
| Photo files | Capacitor Filesystem, `Directory.Data`, folder `photos/` | `<cocktail-id>-<timestamp>.jpeg` |

- `UserStateService` loads all keys at startup and saves a key immediately after each change.
- A missing or invalid value is replaced by an empty default, so the app never crashes on bad stored data (feature 2.3).
- IDs that no longer exist in the dataset are ignored.
- Photo files are copied into `Directory.Data`, because the Camera plugin only returns a temporary file. Storing images as base64 in Preferences is not suitable.
- A timestamp in the file name makes sure the new image is shown instead of a cached old one.

---

## 10. Native device integrations

Every plugin is used through a service. Each plugin has a web implementation, which is used in the iPhone PWA and in `ng serve`.

| Integration | Capacitor plugin | Used for | Android app | Web / iPhone PWA | Status |
|---|---|---|---|---|---|
| Haptics | `@capacitor/haptics` | vibration when the timer ends | vibrates | nothing (iOS does not let web apps vibrate) | installed |
| Camera | `@capacitor/camera` | taking a photo of a drink | native camera | file input (`webUseInput`), which opens the iPhone camera | to install |
| Preferences | `@capacitor/preferences` | user state | native storage | `localStorage` | to install |
| Filesystem | `@capacitor/filesystem` | storing photo files | app data directory | IndexedDB | to install |

- **Camera permissions:** Android permissions are set according to the Capacitor Camera documentation. The PWA needs HTTPS for camera access, which the hosting in section 11 provides.
- **Graceful degradation:** if a native capability is not available, the app must not crash. For example, the timer end is always shown on screen as well.
- **Accelerometer:** not used in version 1.

---

## 11. Platforms and delivery

Development happens on Windows and no Mac is available, so a native iOS build is not possible. The same build output is delivered in two ways:

| Target | Build | How it gets on the phone |
|---|---|---|
| **Android** (Android 7.0 or newer) | `ng build`, `npx cap sync android`, then build the APK in Android Studio | Install the APK on the author's previous Android phone (over USB or as a file), or run it in the Android emulator |
| **iPhone** (PWA) | `ng build` with the Angular service worker (`ng add @angular/pwa`) | Deploy to free static hosting over HTTPS (e.g. GitHub Pages, which needs a public repo, or Netlify). Open the link in Safari, then choose Share → Add to Home Screen |

- **Offline:** the service worker caches the app, the JSON data and the cocktail images, so the PWA works offline after the first launch.
- **Storage:** on iPhone, user data and photos live in the browser storage of the web app, so they are only kept on that phone.
- **New dependency:** `@angular/pwa`, the official Angular package for the service worker and the web app manifest.

---

## 12. Error and edge cases

| Case | Behaviour | Feature |
|---|---|---|
| No ingredients selected | Discover shows an empty state with a link to Ingredients | 3.3 |
| Nothing can be made | A message is shown, and "Missing one ingredient" comes first | 3.3 |
| Missing or corrupted stored data | Empty default, no crash | 2.3 |
| Camera permission denied | A message is shown, and the app keeps working | 7.1 |
| Photo capture cancelled | Nothing changes | 7.1 |
| Photo file deleted outside the app | The detail shows no photo, and the reference is removed | 7.2 |
| Cocktail without a timer (build, blend) | No timer is offered | 5.1 |
| Optional and staple ingredients | Ignored by matching | 1.2, 3.1 |

---

## 13. Testing

The acceptance criteria in [SPEC.md](SPEC.md) are the test plan.

**Automated unit tests (Vitest):**
1. Matching logic: `can-make`, `missing-one`, `missing-many`, and the handling of optional and staple ingredients (1.2, 3.1, 3.2).
2. Dataset validation: at least 30 cocktails, and every `ingredientId` exists (1.1).
3. User state: toggling ingredients and favourites, and corrupted stored data (2.2, 2.3, 6.1).
4. Search and filter (2.4, 4.3, 4.4).
5. Timer duration defaults (5.1).

**Manual tests in the Android app (phone or emulator):**
- Haptics at the end of the timer (5.2).
- Taking, replacing and keeping photos, plus permission denied and cancel (7.1, 7.2).

**Manual tests in the iPhone PWA:**
- It installs with Add to Home Screen and works offline in airplane mode.
- The timer end is shown on screen (5.2).
- Taking a photo, and keeping it after the app is closed (7.1, 7.2).

**User test:** the success criterion test with 5 users (SPEC, "Success criterion").

---

Scope limits are listed in [SPEC.md](SPEC.md), under "Out of scope". The design must not add anything listed there.
