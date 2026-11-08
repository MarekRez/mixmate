# MixMate

## Problem

People often have several cocktail ingredients at home but do not know which cocktails they can actually prepare from them.

## Target users

MixMate is intended mainly for:
- beginners and hobby cocktail makers,
- people preparing drinks at home,
- people hosting parties or small gatherings,
- anyone who wants to quickly find a useful cocktail recipe from ingredients they already have.

## MVP

The minimum viable product will allow the user to:

1. **Manage available ingredients**
   - View a predefined list of common cocktail ingredients.
   - Mark ingredients as available or unavailable.

2. **Find cocktails based on available ingredients**
   - Display cocktails that can be made using only available ingredients.
   - Display cocktails that are missing only one ingredient.
   - Show which ingredient is missing.

3. **View cocktail recipes**
   - Cocktail name and image.
   - Required ingredients and quantities.
   - Step-by-step preparation instructions.
   - Preparation method: shake, stir, build or blend.

4. **Use a preparation timer**
   - Start a simple timer for actions such as shaking or stirring.
   - Use haptic feedback when the timer finishes.

5. **Save favourite cocktails**
   - Mark and unmark recipes as favourites.
   - Store favourites locally on the device.

6. **Add a photo of a prepared cocktail**
   - Use the phone camera to take a photo.
   - Store one photo per cocktail locally on the device. A new photo replaces the previous one.

The application will work without requiring a user account or internet connection.

## Non-goals

The following features are intentionally excluded from the MVP:

- **User accounts and authentication**  
  They would require a backend and add unnecessary complexity without improving the core use case.

- **Cloud synchronization**  
  User data will initially stay on one device. Cloud infrastructure is not necessary for validating the main idea.

- **AI-generated cocktail recipes**  
  The MVP will use a curated local recipe dataset. AI would increase complexity, cost and the possibility of unreliable recipes.

- **Barcode, bottle-label or ingredient recognition from camera images**  
  Computer vision is not required for the core functionality. The camera will initially be used only for taking cocktail photos.

- **Social features**  
  There will be no public profiles, comments, ratings, following or sharing feed because MixMate is primarily a personal utility application.

- **Online shopping and price comparison**  
  The application will identify missing ingredients but will not search stores or compare prices.

- **Automatic shake detection using the accelerometer**  
  This may be added later as an experimental feature, but it is not necessary for the MVP.

- **Custom user-created recipes**  
  The first version will focus on a predefined recipe catalogue to keep the data model and UI simple.

## Mobile device features

The application will use:

- **Camera** - taking photos of prepared cocktails.
- **Haptic feedback / vibration** - notifying the user when a preparation timer finishes.
- **Local device storage** - storing available ingredients, favourites and user photos.

Possible future use:
- **Accelerometer** - detecting shaking motion during cocktail preparation.

## Technologies

### Application
- **Ionic**
- **Angular 22**
- **TypeScript**
- **HTML / SCSS**
- UI language: **English**

### Native mobile functionality
- **Capacitor**
  - Camera
  - Haptics
  - Preferences / local storage
  - Filesystem - persistent storage of user photos (the Camera plugin only returns a temporary file)

### Data
- Static local **JSON** files containing cocktail recipes and ingredients.
- Dataset of at least 30 well-known cocktails, based mainly on the IBA (International Bartenders Association) official cocktails list.
- Cocktail images must have a licence that allows their use in this project. The source and licence of every image are recorded in `docs/DATA_SOURCES.md`.
- Local device storage for user-specific state.
- No backend or external database in the MVP.

### Development
- **Node.js / npm**
- **Git**
- **GitHub**
- **Claude Code**
- **VS Code / IntelliJ IDEA**
- Android emulator or physical Android device for testing.

## Initial application structure

The application will contain approximately these main screens:

1. **Home / Discover**
   - Cocktails the user can make.
   - Cocktails missing one ingredient.

2. **Ingredients**
   - List of ingredients with available/unavailable toggles.

3. **Cocktails**
   - Browse and search all available recipes.

4. **Cocktail Detail**
   - Ingredients.
   - Quantities.
   - Instructions.
   - Favourite button.
   - Preparation timer.
   - User photo.

5. **Favourites**
   - Saved favourite cocktails.

## Success criterion

The MVP is successful when at least 4 of 5 test users, starting from the first launch of the app, select the ingredients from a given list of about 8 and open a recipe for a cocktail they can make from them **in under 60 seconds**.

The same task done with a normal web search is measured as the baseline. This criterion is also the target of the initiative in `docs/BACKLOG.md`.
