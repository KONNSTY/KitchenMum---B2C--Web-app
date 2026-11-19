import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { LegalSections } from "@/components/legal/legal-sections";
import { termsSections } from "@/lib/legal/terms";

export const metadata: Metadata = {
  title: "AGB und Abo · KitchenMum",
  description:
    "Entwurf der Nutzungs- und Abobedingungen für die KitchenMum Vorschau.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="AGB & Abo"
      description="Entwurf für die spätere Nutzung, optionale KI-Funktionen und ein mögliches KitchenMum-Plus-Abonnement."
    >
      <LegalSections sections={termsSections} />
    </LegalPageLayout>
  );
}
