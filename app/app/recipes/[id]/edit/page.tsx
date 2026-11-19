"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RecipeEditor } from "@/components/recipe-editor";
import { useRecipes } from "@/lib/contexts/recipe-context";
import type { RecipeDraft } from "@/lib/types";

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { recipes, updateRecipe } = useRecipes();
  const recipe = recipes.find((item) => item.id === id);
  if (!recipe)
    return (
      <div className="page-content">
        <div className="empty-state">
          <h3>Rezept nicht gefunden</h3>
          <Link href="/app/recipes" className="btn-primary">
            Zur Rezeptsammlung
          </Link>
        </div>
      </div>
    );
  const initial: RecipeDraft = {
    title: recipe.title,
    description: recipe.description,
    category: recipe.category,
    image: recipe.image,
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    temperature: recipe.temperature,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    sourceUrl: recipe.sourceUrl,
    warnings: [],
  };
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Dein Rezept, deine Version</span>
          <h1>Rezept bearbeiten</h1>
          <p>Änderungen sind sofort in deiner Sammlung gespeichert.</p>
        </div>
        <Link href={`/app/recipes/${id}`} className="btn-secondary">
          <ArrowLeft size={15} /> Zurück zum Rezept
        </Link>
      </div>
      <RecipeEditor
        initial={initial}
        saveLabel="Änderungen speichern"
        onSave={async (draft) => {
          await updateRecipe({ ...recipe, ...draft });
          router.push(`/app/recipes/${id}`);
          window.dispatchEvent(
            new CustomEvent("kitchenmum-toast", {
              detail: "Änderungen gespeichert.",
            }),
          );
        }}
      />
    </div>
  );
}
