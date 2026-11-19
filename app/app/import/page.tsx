"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  ClipboardPaste,
  FileImage,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RecipeEditor } from "@/components/recipe-editor";
import { useRecipes } from "@/lib/contexts/recipe-context";
import { mockAiImport } from "@/lib/services/mock-adapters";
import type { RecipeDraft } from "@/lib/types";

const exampleText =
  "Cremige Zitronen-Orzo-Pfanne\n\n250 g Orzo\n1 Schalotte\n700 ml Gemüsebrühe\n1 Bio-Zitrone\n100 g Babyspinat\n60 g Parmesan\n\n1. Schalotte fein würfeln und in Olivenöl glasig dünsten.\n2. Orzo und Brühe zugeben und unter Rühren garen.\n3. Spinat und Parmesan unterheben und abschmecken.";

export default function ImportPage() {
  const router = useRouter();
  const { addRecipe } = useRecipes();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [draft, setDraft] = useState<RecipeDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const generate = async () => {
    if (!text.trim() && !fileName) {
      setError("Füge erst Rezepttext ein oder wähle einen Screenshot aus.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      setDraft(
        await mockAiImport.extractRecipe({
          text,
          fileName: fileName || undefined,
        }),
      );
    } catch {
      setError(
        "Der Entwurf konnte gerade nicht erstellt werden. Bitte versuche es erneut.",
      );
    } finally {
      setLoading(false);
    }
  };
  const paste = async () => {
    try {
      const content = await navigator.clipboard.readText();
      setText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setText((current) => current || exampleText);
      setError(
        "Der Zugriff auf die Zwischenablage ist nicht möglich. Beispieltext wurde eingefügt – du kannst ihn überschreiben.",
      );
    }
  };
  const save = async (value: RecipeDraft) => {
    const recipe = await addRecipe(value);
    window.dispatchEvent(
      new CustomEvent("kitchenmum-toast", {
        detail: "Dein Rezept wurde gespeichert.",
      }),
    );
    router.push(`/app/recipes/${recipe.id}`);
  };
  if (draft)
    return (
      <div className="page-content">
        <div className="page-heading">
          <div>
            <span className="eyebrow">Schritt 2 von 2</span>
            <h1>Prüfen & verfeinern</h1>
            <p>
              Die KI macht einen Vorschlag. Du entscheidest, was in deinem
              Rezeptbuch landet.
            </p>
          </div>
          <button className="btn-quiet" onClick={() => setDraft(null)}>
            <ArrowLeft size={16} /> Zurück zum Import
          </button>
        </div>
        {draft.warnings.length > 0 && (
          <div className="alert-demo mb-3">
            <Sparkles size={15} className="me-2" />
            {draft.warnings[0]}
          </div>
        )}
        <RecipeEditor initial={draft} onSave={save} />
      </div>
    );
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Deine Inspiration kommt mit</span>
          <h1>Rezept hinzufügen</h1>
          <p>
            Speichere ein Rezept aus Instagram, TikTok oder deinem Kochbuch.
          </p>
        </div>
        <Link href="/app" className="btn-secondary">
          <ArrowLeft size={15} /> Zur Übersicht
        </Link>
      </div>
      <div className="import-layout">
        <section className="panel">
          <div className="step-heading">
            <span>1</span>
            <div>
              <h2>Text einfügen</h2>
              <p>
                Kopiere Caption, Zutaten oder Zubereitung direkt aus der App.
              </p>
            </div>
          </div>
          <div className="field">
            <label htmlFor="reel-text">Rezepttext oder Link</label>
            <textarea
              id="reel-text"
              className="import-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Füge hier den Text aus dem Beitrag ein …\n\nTipp: Auch ein Instagram-Link hilft dir, die Quelle später wiederzufinden."
            />
          </div>
          <div className="import-actions">
            <button type="button" className="btn-secondary" onClick={paste}>
              <ClipboardPaste size={16} />
              {copied ? "Eingefügt" : "Aus Zwischenablage"}
            </button>
            <span>oder Screenshot</span>
            <label className="btn-secondary file-button">
              <Upload size={16} />
              {fileName ? "Screenshot gewählt" : "Bild auswählen"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
          </div>
          {fileName && (
            <div className="file-summary">
              <FileImage size={16} />
              <span>{fileName}</span>
              <button className="btn-quiet" onClick={() => setFileName("")}>
                Entfernen
              </button>
            </div>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button
            type="button"
            className="btn-primary btn-full mt-3"
            onClick={generate}
            disabled={loading}
          >
            <Sparkles size={17} />
            {loading ? "Rezept wird erkannt …" : "Mit KI in Rezept verwandeln"}
          </button>
          <p className="form-hint text-center mt-3 mb-0">
            Dauert nur einen Moment. Du kannst danach alles bearbeiten.
          </p>
        </section>
        <aside className="import-aside">
          <div className="import-visual">
            <div className="phone-frame">
              <div className="phone-camera" />
              <div className="phone-photo">
                <Image
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"
                  alt="Schokoladenkuchen Rezept-Inspiration"
                  fill
                  sizes="160px"
                />
              </div>
              <div className="phone-lines">
                <i />
                <i />
                <i />
              </div>
              <div className="phone-caption">
                <Camera size={15} /> Screenshot oder Caption
              </div>
            </div>
            <span className="sparkle-float">
              <Sparkles size={24} />
            </span>
          </div>
          <div className="import-explainer">
            <h3>Aus deinem Feed wird dein Rezept.</h3>
            <ul>
              <li>
                <Check size={15} /> Zutaten werden erkannt
              </li>
              <li>
                <Check size={15} /> Schritte übersichtlich sortiert
              </li>
              <li>
                <Check size={15} /> Alles vor dem Speichern editierbar
              </li>
            </ul>
          </div>
          <div className="alert-demo">
            <strong>Demo-Hinweis</strong>
            <br />
            Die KI-Auswertung ist aktuell ein Frontend-Platzhalter. Die
            Schnittstelle zu einem Foundry-Modell wird später über einen
            sicheren Backend-Endpunkt angebunden.
          </div>
        </aside>
      </div>
      <div className="import-footer-link">
        <button className="btn-quiet" onClick={() => setText(exampleText)}>
          Beispielrezept laden <ArrowLeft size={14} />
        </button>
      </div>
    </div>
  );
}
