import { Cocktail } from './cocktail';

export type MatchStatus = 'can-make' | 'missing-one' | 'missing-many';

/** Calculated at runtime, never stored. */
export interface CocktailMatch {
  cocktail: Cocktail;
  /** Required, non-staple ingredients the user lacks. */
  missingIngredientIds: string[];
  status: MatchStatus;
}
