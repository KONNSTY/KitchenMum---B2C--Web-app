import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "./legal-pages.css";
import "./cookie-consent.css";
import { RecipeProvider } from "@/lib/contexts/recipe-context";
import { FigmaCaptureScript } from "@/components/figma-capture";
import { CookieConsentProvider } from "@/components/cookie-consent-provider";
import { LegalFooter } from "@/components/legal-footer";
import { AuthProvider } from "@/lib/contexts/auth-context";

export const metadata: Metadata = {
  title: "KitchenMum — Deine Rezeptsammlung",
  description:
    "Alle deine Lieblingsrezepte aus Instagram an einem schönen Ort.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <body>
        <FigmaCaptureScript />
        <AuthProvider>
          <RecipeProvider>
            <CookieConsentProvider>
              {children}
              <LegalFooter />
            </CookieConsentProvider>
          </RecipeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
