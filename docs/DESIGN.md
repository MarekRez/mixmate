# MixMate - Design Document

## 1. Product overview

MixMate is an offline-first mobile application that helps users discover which cocktails they can prepare from ingredients they currently have available.

The product should remain intentionally small. The main interaction is:

**Select ingredients -> receive matching cocktails -> open recipe -> prepare drink.**

## 2. Design principles

- Keep the number of taps required to find a cocktail low.
- Prefer simple local data over backend infrastructure.
- Make the app usable offline.
- Keep cocktail preparation information readable while the user is actively making a drink.
- Avoid features that do not directly support the main cocktail-selection workflow.
- Keep architecture simple enough for a semester project.

## 3. Main user flow

1. User opens the application.
2. User opens the Ingredients screen.
3. User marks ingredients currently available.
4. User returns to Discover.
5. Application calculates:
   - cocktails that can be made,
   - cocktails missing exactly one ingredient.
6. User opens a cocktail.
7. User follows the recipe.
8. If required, user starts a preparation timer.
9. Phone provides haptic feedback when the timer ends.
10. User may mark the cocktail as favourite or take a photo of the prepared drink.

## 4. Screens

### 4.1 Discover

Purpose:
- Main landing screen.
- Immediately show useful cocktail suggestions.

Sections:
- Can make now.
- Missing one ingredient.
- Optional random/surprise cocktail button later.

Each cocktail card should show:
- image,
- name,
- preparation method,
- missing ingredient if applicable.

### 4.2 Ingredients

Purpose:
- Manage the user's current home bar/pantry.

Behaviour:
- Ingredients grouped into categories.
- Toggle available/unavailable.
- Search field for larger ingredient lists.

Suggested categories:
- spirits,
- liqueurs,
- juices,
- syrups,
- bitters,
- fruit and herbs,
- mixers,
- other.

### 4.3 Cocktails

Purpose:
- Browse the entire recipe catalogue.

Features:
- search by cocktail name,
- filter by preparation method,
- indicate whether the cocktail can currently be made.

### 4.4 Cocktail detail

Content:
- cocktail image,
- cocktail name,
- list of ingredients with quantities,
- clear indication of missing ingredients,
- numbered preparation instructions,
- preparation method,
- timer when appropriate,
- favourite toggle,
- take/add photo action.

### 4.5 Favourites

Purpose:
- Quickly access saved cocktails.

## 5. Data model

### Ingredient

```ts
interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
}
```

### Recipe ingredient

```ts
interface RecipeIngredient {
  ingredientId: string;
  amount: number;
  unit: string;
  optional?: boolean;
}
```

### Cocktail

```ts
interface Cocktail {
  id: string;
  name: string;
  image: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  method: 'shake' | 'stir' | 'build' | 'blend';
  preparationTimeSeconds?: number;
}
```

### User state

```ts
interface UserState {
  availableIngredientIds: string[];
  favouriteCocktailIds: string[];
}
```

User photos can be stored separately and referenced by cocktail ID.

## 6. Matching logic

For each cocktail:

1. Ignore optional ingredients when determining availability.
2. Compare required ingredient IDs with the user's available ingredient IDs.
3. Calculate the missing ingredient list.

Classification:

- `missing.length === 0` -> **Can make**
- `missing.length === 1` -> **Missing one ingredient**
- `missing.length > 1` -> not shown on Discover, but still visible in the full catalogue

This logic should be implemented as a pure TypeScript service/function so that it is easy to test.

## 7. Architecture

Suggested Angular/Ionic structure:

```text
src/
  app/
    core/
      models/
      services/
    features/
      discover/
      ingredients/
      cocktails/
      favourites/
    shared/
      components/
  assets/
    data/
      ingredients.json
      cocktails.json
    images/
```

Suggested services:

- `CocktailService`
  - loads cocktail data,
  - retrieves recipes,
  - performs search/filter operations.

- `IngredientService`
  - loads ingredient data.

- `UserStateService`
  - manages available ingredients and favourites,
  - persists user state locally.

- `CocktailMatcherService`
  - determines which cocktails are available or almost available.

- `CameraService`
  - wraps Capacitor Camera API.

- `PreparationTimerService`
  - manages timer state and haptic feedback.

## 8. Persistence

No backend is required.

Static application data:
- `ingredients.json`
- `cocktails.json`

User-specific data:
- available ingredients,
- favourites,
- basic settings

Store small values using Capacitor Preferences.

Cocktail photos:
- use Camera to capture/select image,
- use Filesystem only if persistent file storage is required.

## 9. Native device integrations

### Camera
Used for taking a photo of a prepared cocktail.

### Haptics
Used when a preparation timer reaches zero.

### Local storage
Used for ingredients, favourites and settings.

### Accelerometer
Not part of MVP. It may later be used for experimental shake detection.

## 10. Error and edge cases

The application should handle:

- no ingredients selected,
- no exact cocktail matches,
- camera permission denied,
- photo capture cancelled,
- missing/corrupted local preference data,
- cocktail with no preparation timer,
- optional recipe ingredients.

If no exact cocktail is available, the app should prioritise recipes missing one ingredient.

## 11. Testing priorities

Highest-value tests:

1. Cocktail matching logic.
2. Missing-ingredient calculation.
3. Persisting selected ingredients.
4. Persisting favourites.
5. Search/filter logic.

Native Camera and Haptics integrations can initially be tested manually on a physical device/emulator.

## 12. Out of scope

The design must not introduce:
- backend services,
- authentication,
- cloud database,
- AI recipe generation,
- social network features,
- e-commerce integrations,
- computer vision,
unless the project requirements change later.
