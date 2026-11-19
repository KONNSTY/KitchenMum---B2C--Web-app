import Link from "next/link";
import { ChefHat } from "lucide-react";
import { CookieSettingsButton } from "@/components/cookie-consent-provider";

const footerLinks = [
  { href: "/app/plan", label: "Preise" },
  { href: "/app/account", label: "Konto" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB & Abo" },
  { href: "/widerruf", label: "Widerruf" },
  { href: "/cookies", label: "Cookies" },
];

export function LegalFooter() {
  return (
    <footer className="site-legal-footer">
      <div className="site-legal-footer-main">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <ChefHat size={17} />
          </span>
          <span>KitchenMum</span>
        </Link>
        <p>
          Ein digitales Rezeptbuch von <strong>Regler Productions</strong> ·
          Polymath Productions
        </p>
        <nav aria-label="Rechtliche Informationen">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <CookieSettingsButton className="footer-cookie-link">
            Cookie-Einstellungen
          </CookieSettingsButton>
        </nav>
      </div>
      <p className="site-legal-footer-owner">
        Betrieben von Paul Konstantin Regler, Einzelunternehmer ·
        <a href="mailto:info@reglerproductions.com"> info@reglerproductions.com</a>
      </p>
    </footer>
  );
}
