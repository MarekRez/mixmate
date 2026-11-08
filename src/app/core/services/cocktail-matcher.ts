import { Cocktail } from '../models/cocktail';
import { CocktailMatch, MatchStatus } from '../models/cocktail-match';

/**
 * Pure matching logic (DESIGN.md, section 6). It has no Angular or Capacitor
 * dependencies, so it is unit-tested directly and is the only place where this
 * rule is implemented.
 */
export function matchCocktail(
  cocktail: Cocktail,
  availableIngredientIds: ReadonlySet<string>,
  stapleIngredientIds: ReadonlySet<string>,
): CocktailMatch {
  const missingIngredientIds = cocktail.ingredients
    .filter((item) => !item.optional)
    .map((item) => item.ingredientId)
    .filter((id) => !stapleIngredientIds.has(id) && !availableIngredientIds.has(id));

  return { cocktail, missingIngredientIds, status: statusFor(missingIngredientIds.length) };
}

function statusFor(missingCount: number): MatchStatus {
  if (missingCount === 0) {
    return 'can-make';
  }
  return missingCount === 1 ? 'missing-one' : 'missing-many';
}
