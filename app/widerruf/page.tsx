import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { LegalSections } from "@/components/legal/legal-sections";
import { withdrawalSections } from "@/lib/legal/terms";

export const metadata: Metadata = {
  title: "Widerruf · KitchenMum",
  description:
    "Vorbereiteter Entwurf der Widerrufsbelehrung und des Muster-Widerrufsformulars.",
};

export default function WithdrawalPage() {
  return (
    <LegalPageLayout
      title="Widerruf"
      description="Vorbereiteter Informationstext und Musterformular für ein späteres kostenpflichtiges Abo."
    >
      <LegalSections sections={withdrawalSections} />
    </LegalPageLayout>
  );
}
