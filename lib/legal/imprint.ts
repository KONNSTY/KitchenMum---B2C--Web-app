import type { LegalSection } from "@/lib/legal/content-types";

export const imprintSections: LegalSection[] = [
  {
    heading: "Anbieter",
    blocks: [
      {
        type: "paragraph",
        text: "KitchenMum wird von Regler Productions betrieben. Geschäftsbezeichnung: Polymath Productions. Rechtlicher Diensteanbieter und Inhaber des Einzelunternehmens ist Paul Konstantin Regler.",
      },
      {
        type: "paragraph",
        text: "Kittenfeldstraße 2a, 91795 Dollnstein, Bayern, Deutschland",
      },
      {
        type: "paragraph",
        text: "Telefon: +49 152 16217838 · E-Mail: info@reglerproductions.com",
      },
    ],
  },
  {
    heading: "Weitere Angaben",
    blocks: [
      {
        type: "paragraph",
        text: "Diese Angaben wurden vom öffentlichen Impressum auf reglerproductions.com übernommen. Dort ist keine Register- oder Umsatzsteuer-Identifikationsnummer genannt. Ob eine solche Angabe für KitchenMum erforderlich ist oder vor Veröffentlichung ergänzt werden muss, ist vor dem Produktivstart zu bestätigen.",
      },
      {
        type: "notice",
        title: "Offener Freigabepunkt",
        text: "Vor dem Livegang bitte Geschäftsbezeichnung, ladungsfähige Anschrift sowie etwaige Register-, Steuer- und Aufsichtsangaben nochmals gegen die aktuelle Unternehmenssituation prüfen.",
      },
    ],
  },
  {
    heading: "Verantwortlich für den Inhalt",
    blocks: [
      {
        type: "paragraph",
        text: "Paul Konstantin Regler, Anschrift wie oben (soweit § 18 Abs. 2 MStV auf einzelne Inhalte dieses Angebots anwendbar ist).",
      },
    ],
  },
  {
    heading: "Verbraucherstreitbeilegung",
    blocks: [
      {
        type: "paragraph",
        text: "Regler Productions ist weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).",
      },
    ],
  },
  {
    heading: "Haftung für Inhalte und Links",
    blocks: [
      {
        type: "paragraph",
        text: "Die Inhalte dieser Vorschau wurden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität kann keine Gewähr übernommen werden. Verlinkte externe Seiten liegen außerhalb unseres Einflussbereichs; verantwortlich ist der jeweilige Anbieter.",
      },
    ],
  },
];
