"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { RecipeGrid } from "@/components/ui";
import { useRecipes } from "@/lib/contexts/recipe-context";
import { RECIPE_CATEGORIES, type RecipeCategory } from "@/lib/types";

export default function RecipesPage() {
  const { recipes } = useRecipes();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<RecipeCategory | "Alle">("Alle");
  const filtered = useMemo(
    () =>
      recipes.filter(
        (item) =>
          (category === "Alle" || item.category === category) &&
          `${item.title} ${item.description} ${item.ingredients.join(" ")}`
            .toLocaleLowerCase("de")
            .includes(query.toLocaleLowerCase("de")),
      ),
    [recipes, query, category],
  );
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Alles an einem Ort</span>
          <h1>Meine Rezepte</h1>
          <p>Finde genau das, worauf du heute Lust hast.</p>
        </div>
      </div>
      <div className="content-toolbar">
        <label className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rezepte oder Zutaten suchen…"
            aria-label="Rezepte suchen"
          />
        </label>
        <span className="result-count">
          <SlidersHorizontal size={15} /> {filtered.length}{" "}
          {filtered.length === 1 ? "Rezept" : "Rezepte"}
        </span>
      </div>
      <div className="filters">
        <button
          className={`filter-chip ${category === "Alle" ? "active" : ""}`}
          onClick={() => setCategory("Alle")}
        >
          Alle
        </button>
        {RECIPE_CATEGORIES.map((item) => (
          <button
            key={item}
            className={`filter-chip ${category === item ? "active" : ""}`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <RecipeGrid
        recipes={filtered}
        emptyTitle="Nichts gefunden"
        emptyText="Ändere deine Suche oder wähle eine andere Kategorie."
      />
    </div>
  );
}
