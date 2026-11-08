import cocktailsJson from '../../../assets/data/cocktails.json';
import ingredientsJson from '../../../assets/data/ingredients.json';
import { Cocktail, PreparationMethod } from '../models/cocktail';
import { Ingredient, IngredientCategory } from '../models/ingredient';

// The JSON files are the source of truth, and TypeScript cannot check their
// contents (e.g. that a string is a valid method). These tests do that.
const ingredients = ingredientsJson as Ingredient[];
const cocktails = cocktailsJson as Cocktail[];

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const CATEGORIES: readonly IngredientCategory[] = [
  'spirits',
  'liqueurs',
  'juices',
  'syrups',
  'bitters',
  'fruit-and-herbs',
  'mixers',
  'other',
];
const METHODS: readonly PreparationMethod[] = ['shake', 'stir', 'build', 'blend'];

const ingredientIds = new Set(ingredients.map((ingredient) => ingredient.id));
const stapleIds = new Set(ingredients.filter((ingredient) => ingredient.staple).map((ingredient) => ingredient.id));

/** Names of the cocktails for which `isBad` is true, so a failure says which recipe is wrong. */
function cocktailsWhere(isBad: (cocktail: Cocktail) => boolean): string[] {
  return cocktails.filter(isBad).map((cocktail) => cocktail.id);
}

describe('ingredients.json', () => {
  it('has unique kebab-case ids', () => {
    const ids = ingredients.map((ingredient) => ingredient.id);

    expect(ids.filter((id) => !KEBAB_CASE.test(id))).toEqual([]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every ingredient a name and a known category', () => {
    const invalid = ingredients
      .filter((ingredient) => !ingredient.name.trim() || !CATEGORIES.includes(ingredient.category))
      .map((ingredient) => ingredient.id);

    expect(invalid).toEqual([]);
  });

  it('marks exactly ice and water as staples', () => {
    expect([...stapleIds].sort()).toEqual(['ice', 'water']);
  });
});

describe('cocktails.json', () => {
  it('contains at least 30 cocktails', () => {
    expect(cocktails.length).toBeGreaterThanOrEqual(30);
  });

  it('has unique kebab-case ids', () => {
    const ids = cocktails.map((cocktail) => cocktail.id);

    expect(ids.filter((id) => !KEBAB_CASE.test(id))).toEqual([]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a name and a valid preparation method', () => {
    expect(cocktailsWhere((c) => !c.name.trim() || !METHODS.includes(c.method))).toEqual([]);
  });

  it('points every image to assets/images/cocktails/<id>.jpg', () => {
    expect(cocktailsWhere((c) => c.image !== `assets/images/cocktails/${c.id}.jpg`)).toEqual([]);
  });

  it('has at least one non-empty instruction step', () => {
    expect(cocktailsWhere((c) => c.instructions.length === 0 || c.instructions.some((step) => !step.trim()))).toEqual([]);
  });

  it('only uses ingredients that exist in ingredients.json', () => {
    const unknown = cocktails.flatMap((c) =>
      c.ingredients.filter((item) => !ingredientIds.has(item.ingredientId)).map((item) => `${c.id}: ${item.ingredientId}`),
    );

    expect(unknown).toEqual([]);
  });

  it('lists each ingredient only once per recipe', () => {
    const ids = (c: Cocktail) => c.ingredients.map((item) => item.ingredientId);

    expect(cocktailsWhere((c) => new Set(ids(c)).size !== ids(c).length)).toEqual([]);
  });

  it('gives every ingredient a unit, and a positive amount when it has one', () => {
    const invalid = (c: Cocktail) =>
      c.ingredients.some((item) => !item.unit.trim() || (item.amount !== undefined && !(item.amount > 0)));

    expect(cocktailsWhere(invalid)).toEqual([]);
  });

  it('needs at least one required, non-staple ingredient', () => {
    // Otherwise the cocktail would always count as "can make", whatever the user has.
    const hasReal = (c: Cocktail) => c.ingredients.some((item) => !item.optional && !stapleIds.has(item.ingredientId));

    expect(cocktailsWhere((c) => !hasReal(c))).toEqual([]);
  });

  it('uses a positive preparation time when one is set', () => {
    expect(cocktailsWhere((c) => c.preparationTimeSeconds !== undefined && !(c.preparationTimeSeconds > 0))).toEqual([]);
  });

  it('uses every ingredient in at least one cocktail', () => {
    // An unused ingredient would show up on the Ingredients screen and do nothing.
    const used = new Set(cocktails.flatMap((c) => c.ingredients.map((item) => item.ingredientId)));

    expect(ingredients.map((i) => i.id).filter((id) => !used.has(id))).toEqual([]);
  });
});
