"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  Edit3,
  Flame,
  Heart,
  Play,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useRecipes } from "@/lib/contexts/recipe-context";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { recipes, toggleFavorite, deleteRecipe } = useRecipes();
  const recipe = recipes.find((item) => item.id === id);
  const [cookMode, setCookMode] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const [step, setStep] = useState(0);
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
  const onDelete = async () => {
    if (window.confirm(`„${recipe.title}“ wirklich löschen?`)) {
      await deleteRecipe(recipe.id);
      router.push("/app/recipes");
      window.dispatchEvent(
        new CustomEvent("kitchenmum-toast", { detail: "Rezept gelöscht." }),
      );
    }
  };
  return (
    <div className="page-content recipe-detail-page">
      <Link href="/app/recipes" className="btn-quiet mb-3">
        <ArrowLeft size={16} /> Zur Rezeptsammlung
      </Link>
      <div className="detail-hero">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          priority
          sizes="(max-width:820px) 100vw, 1200px"
        />
        <div className="detail-hero-title">
          <span className="recipe-badge">{recipe.category}</span>
          <h1>{recipe.title}</h1>
          <p>{recipe.description}</p>
        </div>
      </div>
      <div className="detail-actions">
        <div className="recipe-meta detail-meta">
          <span>
            <Clock3 size={15} />
            {recipe.prepMinutes ?? "–"} Min. Vorbereitung
          </span>
          <span>
            <Clock3 size={15} />
            {recipe.cookMinutes ?? "–"} Min. Koch-/Backzeit
          </span>
          {recipe.temperature && (
            <span>
              <Flame size={15} />
              {recipe.temperature} °C
            </span>
          )}
          {recipe.servings && (
            <span>
              <Users size={15} />
              {recipe.servings} Portionen
            </span>
          )}
        </div>
        <div>
          <button
            className="btn-secondary"
            onClick={() => void toggleFavorite(recipe.id)}
          >
            <Heart
              size={16}
              fill={recipe.favorite ? "currentColor" : "none"}
              color={recipe.favorite ? "#e96f3b" : "currentColor"}
            />
            {recipe.favorite ? "Gemerkt" : "Merken"}
          </button>
          <Link
            href={`/app/recipes/${recipe.id}/edit`}
            className="btn-secondary"
          >
            <Edit3 size={15} /> Bearbeiten
          </Link>
          <button
            className="icon-button danger-button"
            aria-label="Rezept löschen"
            onClick={onDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="detail-layout">
        <section className="panel">
          <div className="section-head">
            <h2>Zutaten</h2>
            <span className="detail-count">
              {recipe.ingredients.length} Zutaten
            </span>
          </div>
          <div className="ingredient-list">
            {recipe.ingredients.map((ingredient, index) => (
              <label
                className={`ingredient-row ${checked.includes(index) ? "done" : ""}`}
                key={`${ingredient}-${index}`}
              >
                <input
                  type="checkbox"
                  checked={checked.includes(index)}
                  onChange={() =>
                    setChecked((current) =>
                      current.includes(index)
                        ? current.filter((n) => n !== index)
                        : [...current, index],
                    )
                  }
                />
                <span>{ingredient}</span>
              </label>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="section-head">
            <h2>Zubereitung</h2>
            <button
              className="btn-primary"
              onClick={() => {
                setCookMode(true);
                setStep(0);
              }}
            >
              <Play size={15} /> Kochmodus
            </button>
          </div>
          <div className="step-list">
            {recipe.steps.map((description, index) => (
              <div className="step-row" key={`${description}-${index}`}>
                <span className="step-number">{index + 1}</span>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      {recipe.sourceUrl && (
        <div className="source-line">
          Quelle:{" "}
          <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
            Instagram-Beitrag ↗
          </a>
        </div>
      )}
      {cookMode && (
        <div
          className="cook-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Kochmodus"
        >
          <div className="cook-card">
            <div className="cook-top">
              <span className="eyebrow">
                Kochmodus · Schritt {step + 1} von {recipe.steps.length}
              </span>
              <button
                className="icon-button"
                aria-label="Kochmodus schließen"
                onClick={() => setCookMode(false)}
              >
                <X size={17} />
              </button>
            </div>
            <div className="cook-progress">
              <span
                style={{
                  width: `${((step + 1) / recipe.steps.length) * 100}%`,
                }}
              />
            </div>
            <div className="cook-summary">
              <span className="recipe-badge">{recipe.category}</span>
              <h2>{recipe.title}</h2>
              <p>
                {recipe.prepMinutes ?? "–"} Min. Vorbereitung ·{" "}
                {recipe.cookMinutes ?? "–"} Min. Koch-/Backzeit{" "}
                {recipe.temperature ? `· ${recipe.temperature} °C` : ""}
              </p>
            </div>
            <div className="cook-step">
              <span className="step-number">{step + 1}</span>
              <p>{recipe.steps[step]}</p>
            </div>
            <div className="cook-actions">
              <button
                className="btn-secondary"
                disabled={step === 0}
                onClick={() => setStep((current) => Math.max(current - 1, 0))}
              >
                Zurück
              </button>
              {step < recipe.steps.length - 1 ? (
                <button
                  className="btn-primary"
                  onClick={() => setStep((current) => current + 1)}
                >
                  Nächster Schritt{" "}
                  <ArrowLeft className="rotate-180" size={16} />
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => {
                    setCookMode(false);
                    window.dispatchEvent(
                      new CustomEvent("kitchenmum-toast", {
                        detail: "Guten Appetit! Rezept abgeschlossen.",
                      }),
                    );
                  }}
                >
                  Fertig <Check size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
