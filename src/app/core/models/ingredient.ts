export type IngredientCategory =
  | 'spirits'
  | 'liqueurs'
  | 'juices'
  | 'syrups'
  | 'bitters'
  | 'fruit-and-herbs'
  | 'mixers'
  | 'other';

export interface Ingredient {
  /** kebab-case, e.g. 'white-rum' */
  id: string;
  /** English display name */
  name: string;
  category: IngredientCategory;
  /** Ice, water: always available, never missing, not listed on the Ingredients screen. */
  staple?: boolean;
}
