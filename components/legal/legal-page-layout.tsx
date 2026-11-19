import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ChefHat, ShieldCheck } from "lucide-react";
import { CookieSettingsButton } from "@/components/cookie-consent-provider";

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB & Abo" },
  { href: "/widerruf", label: "Widerruf" },
  { href: "/cookies", label: "Cookies" },
];

export function LegalPageLayout({
  title,
  eyebrow = "KitchenMum · Rechtliches",
  description,
  children,
}: Readonly<{
  title: string;
  eyebrow?: string;
  description: string;
  children: ReactNode;
}>) {
  return (
    <main className="legal-page">
      <div className="legal-topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <ChefHat size={20} />
          </span>
          <span>KitchenMum</span>
        </Link>
        <Link href="/app" className="btn-quiet legal-back-link">
          <ArrowLeft size={15} /> Zur App
        </Link>
      </div>
      <div className="legal-container">
        <header className="legal-heading">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="legal-meta-row">
            <span>Stand: 18. November 2026</span>
            <span className="legal-draft-pill">
              <ShieldCheck size={14} /> Produktvorschau
            </span>
          </div>
        </header>
        <div className="legal-notice">
          <strong>Hinweis zum aktuellen Prototyp</strong>
          <p>
            Diese Rechtstexte beschreiben die geplante Produktgestaltung. Konten,
            KI-Verarbeitung, Server-Synchronisierung und Zahlungen sind in dieser
            Vorschau noch nicht live. Vor einem öffentlichen Produktivstart müssen
            die markierten Anbieter- und Vertragsdetails ergänzt und rechtlich
            geprüft werden.
          </p>
        </div>
        <div className="legal-content-grid">
          <article className="legal-document">{children}</article>
          <aside className="legal-aside">
            <div className="legal-aside-card">
              <span className="eyebrow">Regler Productions</span>
              <h2>Ein Rezeptbuch mit klarer Verantwortung.</h2>
              <p>
                KitchenMum wird von Regler Productions betrieben. Rechtlicher
                Anbieter ist Paul Konstantin Regler als Einzelunternehmer.
              </p>
              <a href="mailto:info@reglerproductions.com">
                info@reglerproductions.com
              </a>
            </div>
            <nav className="legal-aside-nav" aria-label="Rechtliche Seiten">
              <span>Rechtliches</span>
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <CookieSettingsButton className="legal-settings-link">
                Cookie-Einstellungen
              </CookieSettingsButton>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
