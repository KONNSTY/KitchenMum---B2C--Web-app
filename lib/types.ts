export const RECIPE_CATEGORIES = [
  "Brot",
  "Kuchen",
  "Onepot",
  "Vom Blech",
  "Sonstige",
] as const;
export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export type Recipe = {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  image: string;
  prepMinutes: number | null;
  cookMinutes: number | null;
  temperature: number | null;
  servings: number | null;
  ingredients: string[];
  steps: string[];
  sourceUrl: string;
  favorite: boolean;
  createdAt: string;
};

export type RecipeDraft = Omit<Recipe, "id" | "favorite" | "createdAt"> & {
  warnings: string[];
};

export type DemoUser = {
  name: string;
  email: string;
};

export type PlanStatus = "free" | "active" | "cancelled";
