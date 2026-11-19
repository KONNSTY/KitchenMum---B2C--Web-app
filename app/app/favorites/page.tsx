"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { RecipeGrid } from "@/components/ui";
import { useRecipes } from "@/lib/contexts/recipe-context";

export default function FavoritesPage() {
  const { recipes } = useRecipes();
  const favorites = recipes.filter((recipe) => recipe.favorite);
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Deine persönlichen Highlights</span>
          <h1>Merkliste</h1>
          <p>Rezepte, die du immer wieder kochen möchtest.</p>
        </div>
        <Link href="/app/recipes" className="btn-secondary">
          <Heart size={16} /> Rezepte entdecken
        </Link>
      </div>
      <RecipeGrid
        recipes={favorites}
        emptyTitle="Deine Merkliste wartet"
        emptyText="Tippe auf das Herz eines Rezepts, um es hier zu speichern."
      />
    </div>
  );
}
