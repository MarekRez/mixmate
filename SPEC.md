# MixMate - Requirements Specification

This document describes what MixMate must do, for whom, and within which limits. It is written for someone who has never heard of the project.

- How the app is built: [DESIGN.md](DESIGN.md)
- Initiative, epics and user stories: [docs/BACKLOG.md](docs/BACKLOG.md). Each user story has the same number as the feature here (US-3.2 = feature 3.2).

---

## Problem

People often have several cocktail ingredients at home but do not know which cocktails they can make from them. To find out, they search recipes on the web one by one and compare each ingredient list with what they have. This takes several minutes, and the result is often a recipe that needs something they do not have.

MixMate lets the user mark what they have at home and immediately shows which cocktails they can make, and which ones are missing just one ingredient.

---

## Users and roles

The app has a single role: **User**. There are no accounts, no login and no admin. The developers prepare the cocktail catalogue and ship it with the app.

Typical users:
- **Home cocktail maker**: a beginner or hobbyist who prepares drinks at home.
- **Party host**: prepares drinks for guests and wants to know what to buy.
- **First-time user**: has just installed the app and has not set anything up yet.

---

## Features

Each feature is one sentence from the user's point of view. Its acceptance criteria are listed in the section [Acceptance criteria](#acceptance-criteria) under the same number.

Priority: **Must** = required for version 1, **Should** = important, but version 1 works without it, **Could** = only if time allows.

### 1. Recipe and ingredient dataset
- **1.1** The user can choose from at least 30 well-known cocktails with correct recipes. *(Must)*
- **1.2** The user never has to mark ice or water, because the app treats them as always available. *(Must)*

### 2. Home bar
- **2.1** The user sees a list of common ingredients grouped by category. *(Must)*
- **2.2** The user can mark each ingredient as available or unavailable with one tap. *(Must)*
- **2.3** The app remembers the user's ingredient selection after it is closed. *(Must)*
- **2.4** The user can search the ingredient list by name. *(Should)*

### 3. Cocktail discovery
- **3.1** The user sees the cocktails they can make right now. *(Must)*
- **3.2** The user sees the cocktails that are missing exactly one ingredient, and which ingredient that is. *(Must)*
- **3.3** A user who has not selected any ingredients is told how to start. *(Should)*

### 4. Recipe catalogue and detail
- **4.1** The user can open a cocktail and see its ingredients with amounts, the preparation method and numbered steps. *(Must)*
- **4.2** The user sees which ingredients of a recipe they are missing. *(Must)*
- **4.3** The user can browse all cocktails and search them by name. *(Should)*
- **4.4** The user can filter cocktails by preparation method. *(Could)*

### 5. Preparation timer
- **5.1** The user can start a timer for shaking or stirring a drink. *(Must)*
- **5.2** The phone vibrates when the timer ends. *(Must)*

### 6. Favourites
- **6.1** The user can mark a cocktail as a favourite and unmark it again. *(Must)*
- **6.2** The user can see all favourite cocktails in one list. *(Must)*

### 7. Cocktail photos
- **7.1** The user can take a photo of a cocktail they made and see it in the recipe. *(Must)*
- **7.2** The app keeps the user's photos after it is closed. *(Must)*

---

## Constraints

- **Platform:** mobile app for Android and iOS. Android is tested on an emulator or a physical device. An iOS build needs macOS/Xcode or a cloud build service.
- **Technology:** Ionic, Angular 22, TypeScript, SCSS and Capacitor (Camera, Haptics, Preferences, Filesystem).
- **Language:** the UI and all cocktail and ingredient names are in English.
- **Offline:** the app works without an internet connection and without an account.
- **Data:** there is no backend and no database server. Recipes and ingredients are local JSON files shipped with the app. User data is stored only on the device.
- **Dataset:** at least 30 cocktails, mainly from the IBA (International Bartenders Association) official cocktails list. Every cocktail image must have a licence that allows its use. The source and licence of each image are recorded in `docs/DATA_SOURCES.md`.
- **Units:** amounts are in millilitres. Small or inexact amounts use units such as dash, piece or top up.
- **Deadline:** the final project presentation at the end of the winter semester 2026/27.

---

## Out of scope

The following are intentionally not part of version 1:

| Not in version 1 | Reason |
|---|---|
| User accounts and login | They would require a backend and do not help the core use case. |
| Cloud synchronisation or backup | Data stays on one device. A server is not needed to validate the idea. |
| Adding or editing your own recipes | This keeps the data model and the UI simple. |
| AI-generated recipes, chatbot | Higher complexity and cost, and the recipes could be unreliable. |
| Recognising bottles, labels or barcodes with the camera | Not needed for the core use case. The camera is only used for photos of drinks. |
| Social features (profiles, comments, ratings, sharing) | MixMate is a personal tool. |
| Shopping, price comparison, payments | The app only names the missing ingredient. It does not help buy it. |
| Push notifications | There is nothing to notify about outside the app. |
| Shake detection with the accelerometer | It may be tried later as an experiment. |
| Timer running in the background or with the screen locked | The timer is short (15-30 s), so the user keeps the app open. |

---

## Decided questions

| Question | Decision |
|---|---|
| What does "can make" mean? | All required ingredients are available. Optional ingredients (e.g. a garnish) and staples do not count. |
| What does "missing one ingredient" mean? | Exactly one required, non-staple ingredient is missing. Cocktails missing two or more ingredients appear only in the full catalogue. |
| Which ingredients are staples? | Ice and water. Every other ingredient, including sugar, must be selected by the user. |
| How many photos can a cocktail have? | One. A new photo replaces the previous one. |
| Where is the user's photo shown? | Only in the recipe detail. Cards keep the catalogue image. |
| How long is the timer? | The duration from the recipe. If the recipe sets none: shake 15 s, stir 30 s. Build and blend have no timer. |
| Does the timer run when the app is in the background? | No. It only runs while the app is open. |
| UI language? | English. |

---

## Open questions

1. **Ingredient granularity.** Does "lime" also cover "lime juice"? Is "rum" one ingredient, or are "white rum" and "dark rum" separate? This affects the dataset and the matching results. *Proposal:* one ingredient for each item the user actually buys (a lime covers lime juice), and separate ingredients where the taste clearly differs (white rum and dark rum).
2. **Image source.** Where will the cocktail images come from? Options include Wikimedia Commons images with attribution, the team's own photos, or simple illustrations.
3. **iOS.** Is an iOS build required for the final presentation, or is Android enough?

---

## Success criterion

At least 4 of 5 test users start from the first launch of the app, select ingredients from a given list of about 8, and open a recipe for a cocktail they can make from them **in under 60 seconds**.

As a baseline, the same task is done with a normal web search. This criterion is also the target of the initiative in [docs/BACKLOG.md](docs/BACKLOG.md).

---

## Acceptance criteria

These criteria are the test plan. A feature is done when all its criteria are met.

### 1. Recipe and ingredient dataset

**1.1 Well-known cocktails**
- `cocktails.json` contains at least 30 cocktails. Each has a name, an image, a method, ingredients with amounts and numbered steps.
- Every ingredient used in a recipe exists in `ingredients.json` and has a category. An automated test checks this.
- The source and licence of every cocktail image are recorded in `docs/DATA_SOURCES.md`.

**1.2 Staples**
- Ice and water are marked as staples in the dataset.
- Staples are never shown as missing, neither on Discover nor in the recipe detail.
- Staples are not listed on the Ingredients screen.

### 2. Home bar

**2.1 Ingredients by category**
- All non-staple ingredients are listed.
- They are grouped into these categories: spirits, liqueurs, juices, syrups, bitters, fruit and herbs, mixers, other.

**2.2 Mark ingredients**
- One tap switches an ingredient between available and unavailable, and the current state is clearly visible.
- Discover reflects the change when the user goes back to it.

**2.3 Remember the selection**
- After the app is restarted, the selection is the same.
- If the stored data is missing or corrupted, the app starts with an empty selection and does not crash.

**2.4 Search ingredients**
- The list is filtered while the user types. The search is case-insensitive.
- A message is shown when no ingredient matches.

### 3. Cocktail discovery

**3.1 Can make now**
- The "Can make now" section shows exactly the cocktails whose required, non-staple ingredients are all available.
- Optional ingredients have no effect on this.
- Each card shows the image, name and preparation method.

**3.2 Missing one ingredient**
- The "Missing one ingredient" section shows exactly the cocktails with one missing required, non-staple ingredient.
- Each card shows the name of the missing ingredient.
- Cocktails missing two or more ingredients are not shown on Discover.

**3.3 First start**
- With no ingredients selected, Discover shows a message and a button that opens the Ingredients screen.
- If no cocktail can be made, a message says so and the "Missing one ingredient" section is shown first.

### 4. Recipe catalogue and detail

**4.1 Recipe detail**
- The detail shows the image, name, method, ingredients with amounts and units, and numbered steps.
- The text is readable on a phone without zooming.

**4.2 Missing ingredients in the recipe**
- Missing required ingredients look visually different from available ones.
- Optional ingredients are labelled as optional.

**4.3 Browse and search**
- The Cocktails screen lists the whole catalogue.
- Search by name is case-insensitive.
- Each item shows whether the user can make it now.

**4.4 Filter by method**
- The filter values are shake, stir, build and blend.
- The filter can be combined with search. Clearing the filter shows the whole catalogue again.

### 5. Preparation timer

**5.1 Start a timer**
- The recipe detail offers a timer when the recipe sets a duration or its method is shake or stir.
- The duration comes from the recipe. If the recipe sets none, the default is used (shake 15 s, stir 30 s).
- The remaining time is visible. The timer can be cancelled and restarted.

**5.2 Vibration**
- The phone gives haptic feedback when the timer reaches zero. This is checked manually on a device or an emulator.
- The end is also shown on screen.

### 6. Favourites

**6.1 Mark a favourite**
- The recipe detail has a favourite toggle that shows the current state.
- Favourites are the same after the app is restarted.

**6.2 List of favourites**
- The Favourites screen lists all favourite cocktails. Tapping one opens its detail.
- With no favourites, the screen explains how to add one.

### 7. Cocktail photos

**7.1 Take a photo**
- The camera can be opened from the recipe detail, and the photo is then shown in the detail.
- A new photo replaces the previous one.
- If the camera permission is denied or the user cancels, the app shows a message or nothing changes, and the app keeps working.

**7.2 Keep photos**
- Photos are still shown after the app is restarted.
- Photos are stored only on the device.
