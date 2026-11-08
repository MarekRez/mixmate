# MixMate - Product Backlog

Structure used in this document (as defined in the course):

**Initiative** (business goal with a measurable target) → **Epic** (larger feature area) → **User story** (one user need, small enough for one iteration) → **Task** (technical work, added in the next step).

User stories use the format: *As a &lt;role&gt;, I want &lt;goal&gt;, so that &lt;benefit&gt;.*
Each story has acceptance criteria (AC) that define when it is done.

Priority uses MoSCoW:
- **Must** - required for the MVP,
- **Should** - important, but the MVP works without it,
- **Could** - only if time allows.

---

## Initiative

**Help people prepare a cocktail from what they already have at home.**

**Target:** Cut the time it takes to find a cocktail the user can make from ingredients at home, from several minutes today (web search, baseline to be measured) to **under 60 seconds for at least 4 of 5 test users**, by the final project presentation at the end of the winter semester 2026/27.

**How it will be measured:**
- **Baseline:** 5 test users get a list of about 8 ingredients and use a normal web search to find a cocktail they can make from them. The time is recorded.
- **Target:** 5 test users do the same task in MixMate, starting from the first launch of the app (no ingredients selected yet).

---

## Epics overview

| ID | Epic | MVP feature in `project.md` | Priority |
|----|------|-----------------------------|----------|
| E1 | Recipe and ingredient dataset | enabler for all features | Must |
| E2 | Home bar (ingredient management) | 1. Manage available ingredients | Must |
| E3 | Cocktail discovery | 2. Find cocktails based on available ingredients | Must |
| E4 | Recipe catalogue and detail | 3. View cocktail recipes | Must |
| E5 | Preparation timer | 4. Use a preparation timer | Must |
| E6 | Favourites | 5. Save favourite cocktails | Must |
| E7 | Cocktail photos | 6. Add a photo of a prepared cocktail | Must |

**Order of work:** E1-E4 form the first vertical slice (Ingredients → matching → Discover → Cocktail detail), as required in `agents/claude.md`. E5-E7 follow after the slice works.

---

## E1 - Recipe and ingredient dataset

A curated local dataset that the whole app works with. Without it there is nothing to match or display.

### US-1.1 - Curated cocktail recipes (Must)
As a home cocktail maker, I want the app to contain well-known cocktails with correct recipes, so that the suggestions are drinks I actually want to make.

AC:
- `cocktails.json` contains at least 30 cocktails. Each has a name, image, method, ingredients with amounts and numbered steps.
- `ingredients.json` contains every ingredient used in the recipes, each with a category.
- An automated test checks that every ingredient ID used in a recipe exists in `ingredients.json`.
- The source and licence of every cocktail image are recorded in `docs/DATA_SOURCES.md`.

### US-1.2 - Staple ingredients (Must)
As a home cocktail maker, I want basic staples such as ice and water to be treated as always available, so that the app does not tell me I am "missing" ice.

AC:
- Staple ingredients are marked in the dataset.
- Staples never count as missing on Discover or in the recipe detail.
- Staples do not need to be selected on the Ingredients screen.

---

## E2 - Home bar (ingredient management)

The user tells the app what they have at home. Every recommendation depends on this.

### US-2.1 - Ingredients grouped by category (Must)
As a home cocktail maker, I want to see common ingredients grouped by category (spirits, juices, syrups, ...), so that I can quickly find what I have at home.

AC:
- All non-staple ingredients from the dataset are listed.
- Ingredients are grouped by the categories defined in `DESIGN.md` (section 4.2).

### US-2.2 - Mark ingredients as available (Must)
As a home cocktail maker, I want to mark ingredients as available or unavailable, so that the app knows what is in my home bar.

AC:
- One tap toggles an ingredient between available and unavailable.
- The current state is clearly visible.
- Discover reflects the change when I go back to it.

### US-2.3 - Remember my ingredients (Must)
As a home cocktail maker, I want my selected ingredients to be remembered after I close the app, so that I do not have to set up my home bar again.

AC:
- The selection is the same after the app is restarted.
- If the stored data is missing or corrupted, the app starts with an empty selection and does not crash.

### US-2.4 - Search ingredients (Should)
As a user with many bottles at home, I want to search ingredients by name, so that I can mark them faster.

AC:
- The list is filtered while typing, case-insensitive.
- A message is shown when no ingredient matches.

---

## E3 - Cocktail discovery

The Discover screen answers the main question: "What can I make right now?"

### US-3.1 - Cocktails I can make now (Must)
As a home cocktail maker, I want to see the cocktails I can make right now, so that I can start preparing a drink immediately.

AC:
- The "Can make now" section shows cocktails with zero missing required ingredients.
- Optional ingredients are ignored when deciding whether a cocktail can be made.
- Each card shows the image, name and preparation method.
- Matching logic is covered by unit tests.

### US-3.2 - Cocktails missing one ingredient (Must)
As a party host, I want to see cocktails that are missing only one ingredient and which ingredient it is, so that I know what single thing to buy before the party.

AC:
- The "Missing one ingredient" section is separate from "Can make now".
- Each card shows the name of the missing ingredient.
- Cocktails missing two or more ingredients are not shown on Discover.

### US-3.3 - Guidance for a first-time user (Should)
As a first-time user, I want Discover to tell me what to do when I have not selected any ingredients, so that I know how to start.

AC:
- With no ingredients selected, Discover shows a message and a button that opens the Ingredients screen.
- If nothing can be made, a message says so and the "Missing one ingredient" section is shown first.

---

## E4 - Recipe catalogue and detail

The user can open any recipe and follow it while making the drink.

### US-4.1 - Recipe detail (Must)
As a home cocktail maker, I want to see the ingredients with quantities, the preparation method and numbered steps, so that I can follow the recipe while making the drink.

AC:
- The detail shows the image, name, method, ingredients with amounts and units, and numbered steps.
- The text is readable on a phone without zooming.

### US-4.2 - Missing ingredients in the recipe (Must)
As a home cocktail maker, I want missing ingredients to be clearly marked in the recipe, so that I immediately see what I lack.

AC:
- Missing required ingredients are visually different from available ones.
- Optional ingredients are labelled as optional.

### US-4.3 - Browse and search all cocktails (Should)
As a home cocktail maker, I want to browse all cocktails and search them by name, so that I can find a specific drink even if I cannot make it now.

AC:
- The Cocktails screen lists the whole catalogue.
- Search by name is case-insensitive.
- Each item shows whether I can make it now.

### US-4.4 - Filter by preparation method (Could)
As a home cocktail maker without a shaker, I want to filter cocktails by preparation method (shake, stir, build, blend), so that I only see drinks I can prepare with my equipment.

AC:
- The filter can be combined with search.
- Clearing the filter shows the whole catalogue again.

---

## E5 - Preparation timer

Helps the user shake or stir for the right amount of time.

### US-5.1 - Start a preparation timer (Must)
As a home cocktail maker, I want to start a timer when I shake or stir a drink, so that I know how long to do it.

AC:
- The timer is available on the recipe detail for cocktails whose method needs it.
- The duration comes from the recipe, or from a default for the method.
- The timer can be cancelled and restarted.
- The timer only needs to run while the app is open.

### US-5.2 - Vibration when the timer ends (Must)
As a home cocktail maker with my hands busy, I want the phone to vibrate when the timer ends, so that I do not have to watch the screen.

AC:
- The phone gives haptic feedback when the timer reaches zero (tested manually on a device or emulator).
- The end is also shown visually, for devices without haptics.

---

## E6 - Favourites

Quick access to cocktails the user likes.

### US-6.1 - Mark a favourite (Must)
As a home cocktail maker, I want to mark a cocktail as a favourite, so that I can find it again quickly.

AC:
- The recipe detail has a favourite toggle that shows the current state.
- Favourites are the same after the app is restarted.

### US-6.2 - List of favourites (Must)
As a home cocktail maker, I want to see all my favourite cocktails in one place, so that I can open them with one tap.

AC:
- The Favourites screen lists all favourite cocktails.
- Tapping a cocktail opens its detail.
- With no favourites, the screen explains how to add one.

---

## E7 - Cocktail photos

The user can keep a photo of the drink they made.

### US-7.1 - Take a photo of my drink (Must)
As a home cocktail maker, I want to take a photo of the cocktail I made, so that I remember how it turned out.

AC:
- The camera can be opened from the recipe detail.
- The photo is shown in the recipe detail.
- A new photo replaces the previous one for that cocktail.
- If camera permission is denied or the photo is cancelled, the app shows a message (or nothing changes) and keeps working.

### US-7.2 - Keep my photos (Must)
As a home cocktail maker, I want my photos to stay saved after I close the app, so that I can look back at drinks I have made.

AC:
- Photos are still shown after the app is restarted.
- Photos are stored only on the device.

---

## Next step: tasks

Break each story of the first vertical slice (E1-E4) into technical tasks. Example:

**US-3.1 Cocktails I can make now**
- `CocktailMatcherService` with matching logic + unit tests
- Discover page with the "Can make now" section
- Cocktail card component
