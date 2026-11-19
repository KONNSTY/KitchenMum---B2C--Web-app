import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { LegalSections } from "@/components/legal/legal-sections";
import { privacySections } from "@/lib/legal/privacy";

export const metadata: Metadata = {
  title: "Datenschutzerklärung · KitchenMum",
  description:
    "Informationen zu Browserdaten, Rezepten, KI, Supabase, Stripe und geplanter Speicherung.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Datenschutzerklärung"
      description="Welche Daten diese Vorschau im Browser verarbeitet und was sich vor dem Produktivstart noch ändert."
    >
      <LegalSections sections={privacySections} />
    </LegalPageLayout>
  );
}
