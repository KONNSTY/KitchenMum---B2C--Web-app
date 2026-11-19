"use client";

import { useState } from "react";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  RECIPE_CATEGORIES,
  type RecipeCategory,
  type RecipeDraft,
} from "@/lib/types";

export function RecipeEditor({
  initial,
  onSave,
  saveLabel = "Rezept speichern",
}: {
  initial: RecipeDraft;
  onSave: (draft: RecipeDraft) => void | Promise<void>;
  saveLabel?: string;
}) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const set = <K extends keyof RecipeDraft>(key: K, value: RecipeDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !draft.title.trim() ||
      !draft.ingredients.some((line) => line.trim()) ||
      !draft.steps.some((line) => line.trim())
    ) {
      setError(
        "Bitte ergänze mindestens Titel, eine Zutat und einen Zubereitungsschritt.",
      );
      return;
    }
    setError("");
    void Promise.resolve(onSave({
      ...draft,
      title: draft.title.trim(),
      ingredients: draft.ingredients.map((s) => s.trim()).filter(Boolean),
      steps: draft.steps.map((s) => s.trim()).filter(Boolean),
    })).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Das Rezept konnte nicht gespeichert werden."));
  };
  return (
    <form onSubmit={submit} className="editor-layout">
      <div className="editor-main">
        <section className="panel">
          <h2>Rezeptdetails</h2>
          <div className="field">
            <label htmlFor="recipe-title">Rezeptname</label>
            <input
              id="recipe-title"
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="z. B. Zitronen-Mohn-Kuchen"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="recipe-description">Kurzbeschreibung</label>
            <textarea
              id="recipe-description"
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Was macht dieses Rezept besonders?"
            />
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="recipe-category">Kategorie</label>
              <select
                id="recipe-category"
                value={draft.category}
                onChange={(e) =>
                  set("category", e.target.value as RecipeCategory)
                }
              >
                {RECIPE_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="recipe-source">Quelle (optional)</label>
              <input
                id="recipe-source"
                type="url"
                value={draft.sourceUrl}
                onChange={(e) => set("sourceUrl", e.target.value)}
                placeholder="https://instagram.com/…"
              />
            </div>
          </div>
        </section>
        <section className="panel">
          <h2>Zutaten</h2>
          <p className="form-hint">
            Eine Zutat pro Zeile. Mengen und Einheiten kannst du frei anpassen.
          </p>
          <div className="field">
            <label className="visually-hidden" htmlFor="recipe-ingredients">
              Zutatenliste
            </label>
            <textarea
              id="recipe-ingredients"
              className="long-textarea"
              value={draft.ingredients.join("\n")}
              onChange={(e) => set("ingredients", e.target.value.split("\n"))}
              placeholder={"250 g Mehl\n2 Eier\n1 Prise Salz"}
            />
          </div>
          <div className="field mb-0">
            <label htmlFor="recipe-servings">Portionen</label>
            <input
              id="recipe-servings"
              type="number"
              min="1"
              value={draft.servings ?? ""}
              onChange={(e) =>
                set("servings", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="4"
            />
          </div>
        </section>
        <section className="panel">
          <h2>Zubereitung</h2>
          <p className="form-hint">
            Ein Schritt pro Zeile – die Nummerierung wird automatisch ergänzt.
          </p>
          <div className="field mb-0">
            <label className="visually-hidden" htmlFor="recipe-steps">
              Zubereitungsschritte
            </label>
            <textarea
              id="recipe-steps"
              className="long-textarea steps-input"
              value={draft.steps.join("\n")}
              onChange={(e) => set("steps", e.target.value.split("\n"))}
              placeholder={
                "Backofen auf 180 °C vorheizen.\nZutaten vermengen und den Teig backen."
              }
            />
          </div>
        </section>
      </div>
      <aside className="editor-aside">
        <section className="panel">
          <h3>Zeiten & Temperatur</h3>
          <div className="field">
            <label htmlFor="prep-time">Vorbereitung (Min.)</label>
            <input
              id="prep-time"
              type="number"
              min="0"
              value={draft.prepMinutes ?? ""}
              onChange={(e) =>
                set(
                  "prepMinutes",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              placeholder="15"
            />
          </div>
          <div className="field">
            <label htmlFor="cook-time">Koch- / Backzeit (Min.)</label>
            <input
              id="cook-time"
              type="number"
              min="0"
              value={draft.cookMinutes ?? ""}
              onChange={(e) =>
                set(
                  "cookMinutes",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              placeholder="35"
            />
          </div>
          <div className="field mb-0">
            <label htmlFor="recipe-temp">Temperatur (°C)</label>
            <input
              id="recipe-temp"
              type="number"
              min="0"
              value={draft.temperature ?? ""}
              onChange={(e) =>
                set(
                  "temperature",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              placeholder="180"
            />
          </div>
        </section>
        <section className="panel">
          <h3>Rezeptfoto</h3>
          <div className="photo-preview">
            <Image
              src={draft.image}
              alt="Vorschau des Rezeptfotos"
              width={560}
              height={310}
              unoptimized
            />
            <span>
              <ImagePlus size={14} /> Foto-Vorschau
            </span>
          </div>
          <div className="field mb-0">
            <label htmlFor="recipe-image">Bild-URL</label>
            <input
              id="recipe-image"
              value={draft.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://…"
            />
          </div>
          <p className="form-hint mb-0">
            Datei-Upload wird für die spätere Storage-Anbindung vorbereitet.
          </p>
        </section>
        <div className="editor-sticky-actions">
          <button type="submit" className="btn-primary btn-full">
            <Save size={16} />
            {saveLabel}
          </button>
          <Link href="/app" className="btn-secondary btn-full">
            <ArrowLeft size={15} /> Abbrechen
          </Link>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </aside>
    </form>
  );
}
