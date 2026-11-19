import type { DemoUser, Recipe, RecipeDraft } from "@/lib/types";

export interface AuthAdapter {
  signIn(email: string, password: string): Promise<DemoUser>;
  signUp(name: string, email: string, password: string): Promise<DemoUser>;
}
export interface BillingAdapter {
  createCheckoutSession(
    plan: "monthly" | "yearly",
  ): Promise<{ url: string; status: "mock" | "ready" }>;
  createPortalSession(): Promise<{ url: string; status: "mock" | "ready" }>;
}
export interface AiImportAdapter {
  extractRecipe(input: {
    text: string;
    fileName?: string;
  }): Promise<RecipeDraft>;
}
export interface RecipeRepository {
  list(): Promise<Recipe[]>;
  save(recipe: Recipe): Promise<Recipe>;
}
