"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Heart,
  Plus,
  Sparkles,
  Utensils,
} from "lucide-react";
import { useMemo, useState } from "react";
import { RecipeGrid } from "@/components/ui";
import { useRecipes } from "@/lib/contexts/recipe-context";
import { RECIPE_CATEGORIES, type RecipeCategory } from "@/lib/types";

export default function DashboardPage() {
  const { recipes } = useRecipes();
  const [category, setCategory] = useState<RecipeCategory | "Alle">("Alle");
  const filtered = useMemo(
    () =>
      recipes
        .filter((recipe) => category === "Alle" || recipe.category === category)
        .slice(0, 3),
    [recipes, category],
  );
  return (
    <div className="page-content">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Mittwoch, 18. November</span>
          <h1>Was kochen wir heute?</h1>
          <p>
            Deine schönsten Rezeptideen sind hier. Such dir etwas Leckeres aus
            oder füge deine nächste Inspiration hinzu.
          </p>
          <Link href="/app/import" className="btn-primary">
            <Plus size={17} /> Rezept hinzufügen
          </Link>
        </div>
        <Image
          className="hero-illustration"
          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1000&q=85"
          alt="Gemütliche Küche mit frischen Zutaten"
          width={640}
          height={420}
        />
      </section>
      <section className="stat-row" aria-label="Deine Rezeptsammlung">
        <div className="stat-card">
          <span className="stat-icon">
            <BookOpen size={18} />
          </span>
          <span>
            <strong>{recipes.length}</strong>
            <small>gespeicherte Rezepte</small>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">
            <Heart size={18} />
          </span>
          <span>
            <strong>{recipes.filter((r) => r.favorite).length}</strong>
            <small>Lieblingsrezepte</small>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">
            <Utensils size={18} />
          </span>
          <span>
            <strong>{new Set(recipes.map((r) => r.category)).size}</strong>
            <small>Kategorien befüllt</small>
          </span>
        </div>
      </section>
      <div className="section-head">
        <h2>Deine Rezeptsammlung</h2>
        <Link href="/app/recipes" className="btn-quiet">
          Alle ansehen <ArrowRight size={15} />
        </Link>
      </div>
      <div className="filters">
        <button
          className={`filter-chip ${category === "Alle" ? "active" : ""}`}
          onClick={() => setCategory("Alle")}
        >
          Alle Rezepte
        </button>
        {RECIPE_CATEGORIES.map((item) => (
          <button
            className={`filter-chip ${category === item ? "active" : ""}`}
            key={item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <RecipeGrid recipes={filtered} />
      <section className="soft-callout">
        <div className="soft-callout-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <strong>Ein Rezept aus deinem Feed gefunden?</strong>
          <p>
            Mit der KI-Rezeptaufnahme werden Zutaten und Zubereitung zum ersten
            Entwurf.
          </p>
        </div>
        <Link href="/app/import" className="btn-secondary">
          Jetzt ausprobieren <ArrowRight size={15} />
        </Link>
      </section>
      <p className="demo-caption">
        <Clock3 size={13} /> Prototyp mit lokalen Beispieldaten – deine
        Änderungen bleiben in diesem Browser gespeichert.
      </p>
    </div>
  );
}
