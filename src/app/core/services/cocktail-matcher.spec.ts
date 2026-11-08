import { Cocktail, RecipeIngredient } from '../models/cocktail';
import { matchCocktail } from './cocktail-matcher';

function cocktailWith(...ingredients: RecipeIngredient[]): Cocktail {
  return {
    id: 'test-cocktail',
    name: 'Test cocktail',
    image: 'assets/images/cocktails/test-cocktail.jpg',
    method: 'stir',
    ingredients,
    instructions: ['Mix.'],
  };
}

function required(ingredientId: string): RecipeIngredient {
  return { ingredientId, amount: 30, unit: 'ml' };
}

const NO_STAPLES: ReadonlySet<string> = new Set();

describe('matchCocktail', () => {
  it('is "can-make" when every required ingredient is available', () => {
    const negroni = cocktailWith(required('gin'), required('campari'), required('sweet-vermouth'));
    const available = new Set(['gin', 'campari', 'sweet-vermouth', 'tequila']);

    const match = matchCocktail(negroni, available, NO_STAPLES);

    expect(match.status).toBe('can-make');
    expect(match.missingIngredientIds).toEqual([]);
    expect(match.cocktail).toBe(negroni);
  });

  it('is "missing-one" and names the ingredient when exactly one required ingredient is missing', () => {
    const negroni = cocktailWith(required('gin'), required('campari'), required('sweet-vermouth'));
    const available = new Set(['gin', 'campari']);

    const match = matchCocktail(negroni, available, NO_STAPLES);

    expect(match.status).toBe('missing-one');
    expect(match.missingIngredientIds).toEqual(['sweet-vermouth']);
  });

  it('is "missing-many" and lists all missing ingredients when two or more are missing', () => {
    const negroni = cocktailWith(required('gin'), required('campari'), required('sweet-vermouth'));
    const available = new Set(['gin']);

    const match = matchCocktail(negroni, available, NO_STAPLES);

    expect(match.status).toBe('missing-many');
    expect(match.missingIngredientIds).toEqual(['campari', 'sweet-vermouth']);
  });

  it('is "missing-many" when nothing is available', () => {
    const negroni = cocktailWith(required('gin'), required('campari'), required('sweet-vermouth'));

    const match = matchCocktail(negroni, new Set(), NO_STAPLES);

    expect(match.status).toBe('missing-many');
    expect(match.missingIngredientIds).toEqual(['gin', 'campari', 'sweet-vermouth']);
  });

  it('ignores optional ingredients that are not available', () => {
    const negroni = cocktailWith(
      required('gin'),
      required('campari'),
      { ingredientId: 'orange-peel', amount: 1, unit: 'piece', optional: true },
    );
    const available = new Set(['gin', 'campari']);

    const match = matchCocktail(negroni, available, NO_STAPLES);

    expect(match.status).toBe('can-make');
    expect(match.missingIngredientIds).toEqual([]);
  });

  it('treats staple ingredients as always available', () => {
    const daiquiri = cocktailWith(required('rum'), required('lime'), { ingredientId: 'ice', unit: 'as needed' });
    const available = new Set(['rum', 'lime']);

    const match = matchCocktail(daiquiri, available, new Set(['ice']));

    expect(match.status).toBe('can-make');
    expect(match.missingIngredientIds).toEqual([]);
  });

  it('counts a missing ingredient even when a staple is also in the recipe', () => {
    const daiquiri = cocktailWith(required('rum'), required('lime'), { ingredientId: 'ice', unit: 'as needed' });
    const available = new Set(['rum']);

    const match = matchCocktail(daiquiri, available, new Set(['ice']));

    expect(match.status).toBe('missing-one');
    expect(match.missingIngredientIds).toEqual(['lime']);
  });

  it('is "can-make" when the recipe has only staple and optional ingredients', () => {
    const odd = cocktailWith(
      { ingredientId: 'ice', unit: 'as needed' },
      { ingredientId: 'mint', unit: 'piece', optional: true },
    );

    const match = matchCocktail(odd, new Set(), new Set(['ice']));

    expect(match.status).toBe('can-make');
  });
});
