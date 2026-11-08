export type PreparationMethod = 'shake' | 'stir' | 'build' | 'blend';

export interface RecipeIngredient {
  ingredientId: string;
  /** Omitted for "top up", "as needed" or a garnish. */
  amount?: number;
  /** 'ml', 'dash', 'piece', 'top up', 'as needed' */
  unit: string;
  /** E.g. a garnish. Ignored by matching. */
  optional?: boolean;
}

export interface Cocktail {
  /** kebab-case, e.g. 'negroni' */
  id: string;
  name: string;
  /** Path under assets/images/cocktails/ */
  image: string;
  method: PreparationMethod;
  ingredients: RecipeIngredient[];
  /** One item per numbered step. */
  instructions: string[];
  /** If omitted: shake 15 s, stir 30 s, otherwise no timer. */
  preparationTimeSeconds?: number;
}
