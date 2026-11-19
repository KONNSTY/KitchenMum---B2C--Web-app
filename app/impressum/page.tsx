import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { LegalSections } from "@/components/legal/legal-sections";
import { imprintSections } from "@/lib/legal/imprint";

export const metadata: Metadata = {
  title: "Impressum · KitchenMum",
  description: "Anbieter- und Kontaktangaben für KitchenMum.",
};

export default function ImprintPage() {
  return (
    <LegalPageLayout
      title="Impressum"
      description="Anbieterkennzeichnung und Kontakt für KitchenMum."
    >
      <LegalSections sections={imprintSections} />
    </LegalPageLayout>
  );
}
