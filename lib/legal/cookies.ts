import type { LegalSection } from "@/lib/legal/content-types";

export const cookieSections: LegalSection[] = [
  {
    heading: "Aktueller Stand der Vorschau",
    blocks: [
      {
        type: "paragraph",
        text: "KitchenMum setzt derzeit keine Werbe-, Tracking- oder Analyse-Cookies. Die App speichert deine Anmeldung lokal im Browser über Firebase Authentication und deine Rezeptdaten serverseitig in deinem Konto. Die Cookie-Auswahl wird im lokalen Browserspeicher gespeichert.",
      },
      {
        type: "paragraph",
        text: "Die Auswahl im Einstellungsdialog wird lokal gespeichert. Statistik und Marketing aktivieren derzeit keinen Dienst und lösen keine Datenübermittlung an Dritte aus.",
      },
    ],
  },
  {
    heading: "Deine Auswahl ändern",
    blocks: [
      {
        type: "paragraph",
        text: "Du kannst notwendige Speicherung akzeptieren, optionale Kategorien auswählen oder deine Auswahl später ändern. Solange optionale Anbieter nicht eingebunden sind, bleiben die entsprechenden Kategorien ohne technische Wirkung.",
      },
      {
        type: "link",
        href: "/datenschutz",
        label: "Datenschutzerklärung",
        text: "Weitere Informationen findest du in der",
      },
    ],
  },
  {
    heading: "Technik für den späteren Produktivbetrieb",
    blocks: [
      {
        type: "paragraph",
        text: "Werden künftig nicht notwendige Cookies oder vergleichbare Speicher- und Zugriffstechniken eingesetzt, werden Anbieter, Zwecke, Laufzeiten und Empfänger in einer aktualisierten Erklärung genannt. Sie werden erst nach einer vorherigen wirksamen Einwilligung aktiviert, wenn diese erforderlich ist. Die Einwilligung lässt sich jederzeit mit Wirkung für die Zukunft widerrufen.",
      },
      {
        type: "paragraph",
        text: "Grundlage für den Zugriff auf Informationen in deinem Endgerät ist § 25 TDDDG. Die Verarbeitung personenbezogener Daten richtet sich zusätzlich nach der DSGVO. Für technisch notwendige Speicherungen enthält § 25 Abs. 2 Nr. 2 TDDDG eine Ausnahme von der Einwilligung, wenn sie unbedingt erforderlich sind, um einen ausdrücklich gewünschten digitalen Dienst bereitzustellen.",
      },
    ],
  },
];
