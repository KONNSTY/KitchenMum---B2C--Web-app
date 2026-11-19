"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { apiRequest } from "@/lib/api";
import type { Recipe, RecipeDraft } from "@/lib/types";

type RecipeContextValue = {
  recipes: Recipe[];
  ready: boolean;
  addRecipe: (draft: RecipeDraft) => Promise<Recipe>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  clearRecipes: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
};
const RecipeContext = createContext<RecipeContextValue | null>(null);

function toApi(recipe: Recipe | RecipeDraft) {
  return {
    title: recipe.title, description: recipe.description, category: recipe.category,
    image_url: recipe.image, prep_minutes: recipe.prepMinutes, cook_minutes: recipe.cookMinutes,
    temperature_c: recipe.temperature, servings: recipe.servings, ingredients: recipe.ingredients,
    steps: recipe.steps, source_url: recipe.sourceUrl, is_favorite: "favorite" in recipe ? recipe.favorite : false,
  };
}

export function RecipeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;
    if (!user || !user.emailVerified) {
      queueMicrotask(() => {
        if (!cancelled) { setRecipes([]); setReady(true); }
      });
      return;
    }
    queueMicrotask(() => { if (!cancelled) setReady(false); });
    apiRequest<Recipe[]>(user, "v1/recipes")
      .then((rows) => { if (!cancelled) setRecipes(rows); })
      .catch(() => { if (!cancelled) setRecipes([]); })
      .finally(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, [user, authLoading]);

  const addRecipe = useCallback(async (draft: RecipeDraft) => {
    if (!user) throw new Error("Bitte melde dich an.");
    const recipe = await apiRequest<Recipe>(user, "v1/recipes", { method: "POST", body: JSON.stringify(toApi(draft)) });
    setRecipes((current) => [recipe, ...current]);
    return recipe;
  }, [user]);
  const updateRecipe = useCallback(async (recipe: Recipe) => {
    if (!user) throw new Error("Bitte melde dich an.");
    const saved = await apiRequest<Recipe>(user, `v1/recipes/${recipe.id}`, { method: "PUT", body: JSON.stringify(toApi(recipe)) });
    setRecipes((current) => current.map((item) => item.id === saved.id ? saved : item));
  }, [user]);
  const deleteRecipe = useCallback(async (id: string) => {
    if (!user) throw new Error("Bitte melde dich an.");
    await apiRequest<void>(user, `v1/recipes/${id}`, { method: "DELETE" });
    setRecipes((current) => current.filter((item) => item.id !== id));
  }, [user]);
  const clearRecipes = useCallback(async () => {
    await Promise.all(recipes.map((recipe) => deleteRecipe(recipe.id)));
  }, [recipes, deleteRecipe]);
  const toggleFavorite = useCallback(async (id: string) => {
    if (!user) throw new Error("Bitte melde dich an.");
    const saved = await apiRequest<Recipe>(user, `v1/recipes/${id}/favorite`, { method: "PATCH" });
    setRecipes((current) => current.map((item) => item.id === saved.id ? saved : item));
  }, [user]);
  const value = useMemo(() => ({ recipes, ready, addRecipe, updateRecipe, deleteRecipe, clearRecipes, toggleFavorite }), [recipes, ready, addRecipe, updateRecipe, deleteRecipe, clearRecipes, toggleFavorite]);
  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) throw new Error("useRecipes must be used inside RecipeProvider");
  return context;
}
