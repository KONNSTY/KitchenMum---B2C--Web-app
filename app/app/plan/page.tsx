"use client";

import { useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { mockBilling } from "@/lib/services/mock-adapters";

export default function PlanPage() {
  const [yearly, setYearly] = useState(true);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const subscribe = async () => {
    setLoading(true);
    const result = await mockBilling.createCheckoutSession(
      yearly ? "yearly" : "monthly",
    );
    setLoading(false);
    setNotice(
      result.status === "mock"
        ? "Das ist nur die Abo-Vorschau. Stripe ist nicht verbunden; es wurde kein Vertrag angelegt und keine Zahlung ausgelöst."
        : "Du wirst zum sicheren Checkout weitergeleitet.",
    );
  };
  const manage = async () => {
    const result = await mockBilling.createPortalSession();
    setNotice(
      result.status === "mock"
        ? "Das Stripe-Kundenportal ist nicht verbunden. Es wurde kein Abo geändert oder gekündigt."
        : "Kundenportal wird geöffnet.",
    );
  };
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Mehr Raum für deine Ideen</span>
          <h1>Dein KitchenMum Abo</h1>
          <p>Starte kostenlos. Wechsle zu Premium, wenn du mehr möchtest.</p>
        </div>
        <span className="status-pill">Aktuell: Free</span>
      </div>
      <div className="billing-toggle">
        <span className={!yearly ? "selected" : ""}>Monatlich</span>
        <button
          aria-label="Jahresabo auswählen"
          aria-pressed={yearly}
          className={`switch ${yearly ? "on" : ""}`}
          onClick={() => setYearly((value) => !value)}
        >
          <i />
        </button>
        <span className={yearly ? "selected" : ""}>Jährlich</span>
      </div>
      <div className="plan-grid">
        <article className="plan-card">
          <span className="eyebrow">Zum Ausprobieren</span>
          <h2>Free · Demo</h2>
          <div className="plan-price">
            0 € <small>/ Vorschau</small>
          </div>
          <p className="plan-lead">
            Deine digitale Rezeptsammlung für den Anfang.
          </p>
          <ul className="feature-list">
            <li>
              <Check size={16} /> Bis zu 30 Rezepte speichern
            </li>
            <li>
              <Check size={16} /> Kategorien & Favoriten
            </li>
            <li>
              <Check size={16} /> Rezepte bearbeiten
            </li>
            <li className="disabled-feature">
              <X size={16} /> KI-Importe begrenzt
            </li>
          </ul>
          <button className="btn-secondary btn-full" disabled>
            Dein aktueller Plan
          </button>
        </article>
        <article className="plan-card featured">
          <span className="popular-badge">
            <Sparkles size={13} /> BELIEBT
          </span>
          <span className="eyebrow">Für deine ganze Sammlung</span>
          <h2>KitchenMum Plus · Vorschau</h2>
          <div className="plan-price">
            {yearly ? "3,33" : "4,99"} € <small>
              / Monat{yearly ? " · 39,96 € pro Jahr" : ""}
            </small>
          </div>
          <p className="plan-lead">
            Mehr sammeln, schneller planen und entspannt kochen.
          </p>
          <ul className="feature-list">
            <li>
              <Check size={16} /> Unbegrenzt viele Rezepte
            </li>
            <li>
              <Check size={16} /> KI-Import aus Screenshot & Text
            </li>
            <li>
              <Check size={16} /> Einkaufslisten & Wochenplanung
            </li>
            <li>
              <Check size={16} /> Eigene Fotos und Synchronisierung (geplant)
            </li>
          </ul>
          <button
            className="btn-primary btn-full"
            onClick={subscribe}
            disabled={loading}
          >
            {loading ? "Wird vorbereitet …" : "Plus-Vorschau öffnen"}
          </button>
        </article>
      </div>
      <p className="plan-note">
        <strong>Unverbindliche Produktvorschau:</strong> 4,99 € monatlich und
        3,33 € monatlich bei jährlicher Abrechnung sind Beispielwerte und kein
        buchbares Angebot. Stripe Checkout und Kundenportal sind nicht verbunden;
        es wird kein Vertrag geschlossen und nichts abgebucht. Vor einem echten
        Bestellvorgang werden Gesamtpreis, Laufzeit, Verlängerung, Widerruf und
        Kündigung angezeigt. <a href="/agb">AGB & Abo</a> ·{" "}
        <a href="/widerruf">Widerruf</a>
      </p>
      <div className="panel billing-panel">
        <div>
          <h3>Schon Plus-Mitglied?</h3>
          <p>
            Dein Abonnement und deine Rechnungen kannst du jederzeit verwalten.
          </p>
        </div>
        <button className="btn-secondary" onClick={manage}>
          Abo verwalten
        </button>
      </div>
      {notice && (
        <div className="notice-bar" role="status">
          <span>{notice}</span>
          <button
            className="icon-button"
            onClick={() => setNotice("")}
            aria-label="Hinweis schließen"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
