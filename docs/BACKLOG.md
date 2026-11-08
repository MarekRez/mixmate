# MixMate - Product Backlog

Structure used in this document (as defined in the course):

**Initiative** (business goal with a measurable target) → **Epic** (larger feature area) → **User story** (one user need, small enough for one iteration) → **Task** (technical work, added in the next step).

User stories use the format: *As a &lt;role&gt;, I want &lt;goal&gt;, so that &lt;benefit&gt;.*

**Acceptance criteria** for each story are in [SPEC.md](../SPEC.md#acceptance-criteria), under the same number as the story (US-3.2 → feature 3.2).

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

| ID | Epic | Features in `SPEC.md` | Priority |
|----|------|-----------------------|----------|
| E1 | Recipe and ingredient dataset | 1.1-1.2 | Must |
| E2 | Home bar (ingredient management) | 2.1-2.4 | Must |
| E3 | Cocktail discovery | 3.1-3.3 | Must |
| E4 | Recipe catalogue and detail | 4.1-4.4 | Must |
| E5 | Preparation timer | 5.1-5.2 | Must |
| E6 | Favourites | 6.1-6.2 | Must |
| E7 | Cocktail photos | 7.1-7.2 | Must |

**Order of work:** E1-E4 form the first vertical slice (Ingredients → matching → Discover → Cocktail detail), as required in `agents/claude.md`. E5-E7 follow after the slice works.

---

## E1 - Recipe and ingredient dataset

A curated local dataset that the whole app works with. Without it there is nothing to match or display.

- **US-1.1 - Curated cocktail recipes (Must)**
  As a home cocktail maker, I want the app to contain well-known cocktails with correct recipes, so that the suggestions are drinks I actually want to make.
- **US-1.2 - Staple ingredients (Must)**
  As a home cocktail maker, I want basic staples such as ice and water to be treated as always available, so that the app does not tell me I am "missing" ice.

## E2 - Home bar (ingredient management)

The user tells the app what they have at home. Every recommendation depends on this.

- **US-2.1 - Ingredients grouped by category (Must)**
  As a home cocktail maker, I want to see common ingredients grouped by category (spirits, juices, syrups, ...), so that I can quickly find what I have at home.
- **US-2.2 - Mark ingredients as available (Must)**
  As a home cocktail maker, I want to mark ingredients as available or unavailable, so that the app knows what is in my home bar.
- **US-2.3 - Remember my ingredients (Must)**
  As a home cocktail maker, I want my selected ingredients to be remembered after I close the app, so that I do not have to set up my home bar again.
- **US-2.4 - Search ingredients (Should)**
  As a user with many bottles at home, I want to search ingredients by name, so that I can mark them faster.

## E3 - Cocktail discovery

The Discover screen answers the main question: "What can I make right now?"

- **US-3.1 - Cocktails I can make now (Must)**
  As a home cocktail maker, I want to see the cocktails I can make right now, so that I can start preparing a drink immediately.
- **US-3.2 - Cocktails missing one ingredient (Must)**
  As a party host, I want to see cocktails that are missing only one ingredient and which ingredient it is, so that I know what single thing to buy before the party.
- **US-3.3 - Guidance for a first-time user (Should)**
  As a first-time user, I want Discover to tell me what to do when I have not selected any ingredients, so that I know how to start.

## E4 - Recipe catalogue and detail

The user can open any recipe and follow it while making the drink.

- **US-4.1 - Recipe detail (Must)**
  As a home cocktail maker, I want to see the ingredients with quantities, the preparation method and numbered steps, so that I can follow the recipe while making the drink.
- **US-4.2 - Missing ingredients in the recipe (Must)**
  As a home cocktail maker, I want missing ingredients to be clearly marked in the recipe, so that I immediately see what I lack.
- **US-4.3 - Browse and search all cocktails (Should)**
  As a home cocktail maker, I want to browse all cocktails and search them by name, so that I can find a specific drink even if I cannot make it now.
- **US-4.4 - Filter by preparation method (Could)**
  As a home cocktail maker without a shaker, I want to filter cocktails by preparation method (shake, stir, build, blend), so that I only see drinks I can prepare with my equipment.

## E5 - Preparation timer

Helps the user shake or stir for the right amount of time.

- **US-5.1 - Start a preparation timer (Must)**
  As a home cocktail maker, I want to start a timer when I shake or stir a drink, so that I know how long to do it.
- **US-5.2 - Vibration when the timer ends (Must)**
  As a home cocktail maker with my hands busy, I want the phone to vibrate when the timer ends, so that I do not have to watch the screen.

## E6 - Favourites

Quick access to cocktails the user likes.

- **US-6.1 - Mark a favourite (Must)**
  As a home cocktail maker, I want to mark a cocktail as a favourite, so that I can find it again quickly.
- **US-6.2 - List of favourites (Must)**
  As a home cocktail maker, I want to see all my favourite cocktails in one place, so that I can open them with one tap.

## E7 - Cocktail photos

The user can keep a photo of the drink they made.

- **US-7.1 - Take a photo of my drink (Must)**
  As a home cocktail maker, I want to take a photo of the cocktail I made, so that I remember how it turned out.
- **US-7.2 - Keep my photos (Must)**
  As a home cocktail maker, I want my photos to stay saved after I close the app, so that I can look back at drinks I have made.

---

## Next step: tasks

Break each story of the first vertical slice (E1-E4) into technical tasks, based on [DESIGN.md](../DESIGN.md). Example:

**US-3.1 Cocktails I can make now**
- `CocktailMatcherService` with matching logic + unit tests
- Discover page with the "Can make now" section
- Cocktail card component
