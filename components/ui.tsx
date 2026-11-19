"use client";

import { useEffect, useState } from "react";
import { Check, Clock3, Flame, Heart, Users, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/lib/types";
import { useRecipes } from "@/lib/contexts/recipe-context";

export function ToastHost() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setMessage(detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(""), 2800);
    };
    window.addEventListener("kitchenmum-toast", handler);
    return () => {
      window.removeEventListener("kitchenmum-toast", handler);
      clearTimeout(timer);
    };
  }, []);
  return message ? (
    <div className="toast" role="status">
      <Check size={16} className="me-2" />
      {message}
    </div>
  ) : null;
}

export function RecipeCard({
  recipe,
  priority = false,
}: {
  recipe: Recipe;
  priority?: boolean;
}) {
  const { toggleFavorite } = useRecipes();
  return (
    <article className="recipe-card">
      <Link
        href={`/app/recipes/${recipe.id}`}
        aria-label={`${recipe.title} öffnen`}
      >
        <div className="recipe-image-wrap">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width:560px) 100vw, (max-width:1180px) 50vw, 33vw"
            className="recipe-image"
          />
          <span className="recipe-badge">{recipe.category}</span>
        </div>
      </Link>
      <div className="recipe-actions">
        <button
          className="icon-button"
          aria-label={
            recipe.favorite
              ? "Aus Favoriten entfernen"
              : "Zu Favoriten hinzufügen"
          }
          onClick={() => {
            void toggleFavorite(recipe.id);
            window.dispatchEvent(
              new CustomEvent("kitchenmum-toast", {
                detail: recipe.favorite
                  ? "Aus deinen Favoriten entfernt."
                  : "In deinen Favoriten gespeichert.",
              }),
            );
          }}
        >
          <Heart
            size={16}
            fill={recipe.favorite ? "currentColor" : "none"}
            color={recipe.favorite ? "#e96f3b" : "currentColor"}
          />
        </button>
      </div>
      <div className="recipe-card-body">
        <Link href={`/app/recipes/${recipe.id}`}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
        </Link>
        <div className="recipe-meta">
          <span>
            <Clock3 size={14} />
            {recipe.prepMinutes ?? "–"} Min.
          </span>
          {recipe.temperature ? (
            <span>
              <Flame size={14} />
              {recipe.temperature}°C
            </span>
          ) : null}
          {recipe.servings ? (
            <span>
              <Users size={14} />
              {recipe.servings}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function RecipeGrid({
  recipes,
  emptyTitle = "Noch keine Rezepte gefunden",
  emptyText = "Speichere dein erstes Lieblingsrezept aus Instagram.",
}: {
  recipes: Recipe[];
  emptyTitle?: string;
  emptyText?: string;
}) {
  if (!recipes.length)
    return (
      <div className="empty-state">
        <Utensils size={26} />
        <h3>{emptyTitle}</h3>
        <p>{emptyText}</p>
        <Link href="/app/import" className="btn-primary mt-2">
          Rezept hinzufügen
        </Link>
      </div>
    );
  return (
    <div className="recipe-grid">
      {recipes.map((recipe, index) => (
        <RecipeCard key={recipe.id} recipe={recipe} priority={index === 0} />
      ))}
    </div>
  );
}
