import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { LegalSections } from "@/components/legal/legal-sections";
import { CookieSettingsButton } from "@/components/cookie-consent-provider";
import { cookieSections } from "@/lib/legal/cookies";

export const metadata: Metadata = {
  title: "Cookie-Einstellungen · KitchenMum",
  description:
    "Cookie- und lokale Speichereinstellungen für die KitchenMum Vorschau.",
};

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookies & lokale Speicherung"
      description="Die Vorschau erklärt transparent, welche Browserdaten sie verwendet und wie du deine Auswahl ändern kannst."
    >
      <div className="cookie-page-action">
        <div>
          <span className="eyebrow">Deine Kontrolle</span>
          <h2>Auswahl jederzeit öffnen</h2>
          <p>
            Die Optionen Statistik und Marketing haben noch keine technische
            Wirkung, weil keine entsprechenden Dienste verbunden sind.
          </p>
        </div>
        <CookieSettingsButton className="btn-primary">
          Einstellungen öffnen
        </CookieSettingsButton>
      </div>
      <LegalSections sections={cookieSections} />
    </LegalPageLayout>
  );
}
