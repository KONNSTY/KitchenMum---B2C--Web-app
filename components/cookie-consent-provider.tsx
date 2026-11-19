"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { FormEvent, ReactNode } from "react";
import { Check, Cookie, Settings2, X } from "lucide-react";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  parseCookieConsent,
} from "@/lib/legal/consent";
import type {
  ConsentChoice,
  CookieConsent,
} from "@/lib/legal/consent";

type CookieConsentContextValue = {
  consent: CookieConsent | null;
  ready: boolean;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  saveConsent: (choice: ConsentChoice) => void;
};

const CookieConsentContext =
  createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      const parsed = parseCookieConsent(stored);
      if (stored && !parsed) localStorage.removeItem(CONSENT_STORAGE_KEY);
      // Loading browser-only preferences after hydration keeps the server render stable.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConsent(parsed);
    } catch {
      setConsent(null);
    } finally {
      setReady(true);
    }
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const saveConsent = useCallback((choice: ConsentChoice) => {
    const nextConsent: CookieConsent = {
      ...choice,
      version: CONSENT_VERSION,
      necessary: true,
      updatedAt: new Date().toISOString(),
    };

    setConsent(nextConsent);
    setSettingsOpen(false);

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(nextConsent));
    } catch {
      // The choice remains available for this tab even if browser storage is blocked.
    }

    window.dispatchEvent(
      new CustomEvent("kitchenmum-consent-change", { detail: nextConsent }),
    );
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        ready,
        settingsOpen,
        openSettings,
        closeSettings,
        saveConsent,
      }}
    >
      {children}
      <CookieConsentExperience />
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used inside CookieConsentProvider");
  }
  return context;
}

export function CookieSettingsButton({
  children = "Cookie-Einstellungen",
  className = "",
}: Readonly<{ children?: ReactNode; className?: string }>) {
  const { openSettings } = useCookieConsent();
  return (
    <button
      type="button"
      className={className}
      onClick={openSettings}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}

function CookieConsentExperience() {
  const { consent, ready, settingsOpen } = useCookieConsent();
  return (
    <>
      {ready && !consent && <CookieConsentBanner />}
      {settingsOpen && <CookieSettingsDialog consent={consent} />}
      {ready && consent && (
        <CookieSettingsButton className="cookie-settings-float">
          <Settings2 size={15} /> <span>Datenschutz-Einstellungen</span>
        </CookieSettingsButton>
      )}
    </>
  );
}

function CookieConsentBanner() {
  const { openSettings, saveConsent } = useCookieConsent();
  return (
    <section className="cookie-banner" aria-label="Cookie- und Datenschutzhinweis">
      <div className="cookie-banner-copy">
        <span className="cookie-banner-icon" aria-hidden="true">
          <Cookie size={19} />
        </span>
        <div>
          <p className="cookie-eyebrow">Deine Entscheidung</p>
          <h2>Deine Küche, deine Einstellungen.</h2>
          <p>
            Diese Vorschau speichert Rezepte und Demo-Kontodaten nur in diesem
            Browser. Statistik- und Marketingdienste sind nicht verbunden; deine
            Auswahl aktiviert derzeit keine Drittanbieter.
          </p>
        </div>
      </div>
      <div className="cookie-banner-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            saveConsent({
              statistics: false,
              marketing: false,
              decision: "necessary-only",
            })
          }
        >
          Nur notwendige
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() =>
            saveConsent({
              statistics: true,
              marketing: true,
              decision: "accepted-all",
            })
          }
        >
          Alle akzeptieren
        </button>
        <button
          type="button"
          className="cookie-preferences-link"
          onClick={openSettings}
        >
          Einstellungen
        </button>
      </div>
    </section>
  );
}

function CookieSettingsDialog({
  consent,
}: Readonly<{ consent: CookieConsent | null }>) {
  const { closeSettings, saveConsent } = useCookieConsent();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [statistics, setStatistics] = useState(consent?.statistics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  const saveChoice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveConsent({ statistics, marketing, decision: "custom" });
  };

  return (
    <dialog
      ref={dialogRef}
      className="cookie-dialog"
      aria-labelledby="cookie-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        closeSettings();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) closeSettings();
      }}
    >
      <form onSubmit={saveChoice}>
        <div className="cookie-dialog-heading">
          <span className="cookie-dialog-icon" aria-hidden="true">
            <Cookie size={20} />
          </span>
          <div>
            <p className="cookie-eyebrow">KitchenMum Datenschutz</p>
            <h2 id="cookie-dialog-title">Einstellungen verwalten</h2>
          </div>
          <button
            type="button"
            className="icon-button cookie-dialog-close"
            onClick={closeSettings}
            aria-label="Einstellungen schließen"
          >
            <X size={17} />
          </button>
        </div>
        <p className="cookie-dialog-intro">
          Die Auswahl wird lokal in deinem Browser gespeichert. Optionale
          Statistik- und Marketingdienste sind in dieser Vorschau noch nicht
          angebunden und werden durch eine Auswahl nicht aktiviert.
        </p>
        <div className="consent-category consent-category-required">
          <div>
            <h3>Notwendige Speicherung</h3>
            <p>
              Hält deine Demo-Rezepte, dein Demo-Profil und diese Auswahl im
              Browser verfügbar. Sie lässt sich für die Funktion der Vorschau
              nicht ausschalten.
            </p>
          </div>
          <span className="consent-required-state">
            <Check size={15} /> Immer aktiv
          </span>
        </div>
        <ConsentToggle
          id="consent-statistics"
          title="Statistik"
          description="Hilft später zu verstehen, welche Funktionen nützlich sind. Derzeit kein Statistikdienst aktiv."
          checked={statistics}
          onChange={setStatistics}
        />
        <ConsentToggle
          id="consent-marketing"
          title="Marketing"
          description="Würde später optionale Marketing- oder Personalisierungsdienste erlauben. Derzeit kein solcher Dienst aktiv."
          checked={marketing}
          onChange={setMarketing}
        />
        <div className="cookie-dialog-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              saveConsent({
                statistics: false,
                marketing: false,
                decision: "necessary-only",
              })
            }
          >
            Nur notwendige
          </button>
          <button type="submit" className="btn-primary">
            Auswahl speichern
          </button>
        </div>
        <p className="cookie-dialog-footnote">
          Du kannst deine Auswahl jederzeit über „Datenschutz-Einstellungen“
          ändern. Mehr dazu in der <a href="/datenschutz">Datenschutzerklärung</a>.
        </p>
      </form>
    </dialog>
  );
}

function ConsentToggle({
  id,
  title,
  description,
  checked,
  onChange,
}: Readonly<{
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}>) {
  return (
    <div className="consent-category">
      <div>
        <label htmlFor={id}>{title}</label>
        <p>{description}</p>
      </div>
      <input
        id={id}
        className="consent-toggle"
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={`${title} ${checked ? "aktiv" : "inaktiv"}`}
      />
    </div>
  );
}
