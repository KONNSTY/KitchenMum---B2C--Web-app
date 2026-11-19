import type { LegalSection } from "@/lib/legal/content-types";

export const termsSections: LegalSection[] = [
  {
    heading: "Entwurfsstatus",
    blocks: [
      {
        type: "notice",
        title: "Noch kein verbindliches Abo-Angebot",
        text: "KitchenMum ist derzeit ein Prototyp. Die Plus-Preise in der App sind unverbindliche UI-Beispiele. Checkout, Stripe-Kundenportal und kostenpflichtige Verträge sind nicht aktiv. Diese Entwurfsfassung begründet keine Zahlungspflicht und muss vor einem Verkaufsstart an die tatsächlich angebotenen Leistungen angepasst und geprüft werden.",
      },
    ],
  },
  {
    heading: "§ 1 Anbieter und Geltungsbereich",
    blocks: [
      {
        type: "paragraph",
        text: "Diese Bedingungen sind für die spätere Nutzung von KitchenMum vorgesehen. Vertragspartner wäre Paul Konstantin Regler, Einzelunternehmer, handelnd unter Regler Productions (Polymath Productions), Kittenfeldstraße 2a, 91795 Dollnstein, Deutschland. Kontakt: info@reglerproductions.com.",
      },
    ],
  },
  {
    heading: "§ 2 Leistungsumfang",
    blocks: [
      {
        type: "paragraph",
        text: "KitchenMum soll Nutzerinnen und Nutzern ermöglichen, eigene Rezepte aus Texten und Screenshots zu erfassen, zu ordnen, zu bearbeiten und für die private Küche abzurufen. Ein späteres Plus-Abo kann zusätzliche Funktionen wie mehr Rezeptplätze, Importassistenz oder Planung enthalten. Der konkrete Umfang wird vor einer Bestellung verbindlich beschrieben.",
      },
      {
        type: "paragraph",
        text: "Eine Erkennungsfunktion kann unvollständige oder fehlerhafte Zutaten, Mengen, Garzeiten und Temperaturen vorschlagen. Sie ersetzt keine Prüfung durch dich. Allergene, sichere Lebensmittelzubereitung und die Eignung für besondere Ernährungs- oder Gesundheitsbedürfnisse musst du selbst überprüfen.",
      },
    ],
  },
  {
    heading: "§ 3 Demo-Konto und Nutzerinhalte",
    blocks: [
      {
        type: "paragraph",
        text: "Konten werden derzeit mit E-Mail-Adresse und Passwort über Firebase Authentication verwaltet. Profil- und Rezeptdaten werden deinem Konto in einer PostgreSQL-Datenbank auf dem KitchenMum-VPS zugeordnet. Im späteren Betrieb bist du für die Richtigkeit deiner Kontaktdaten und die Geheimhaltung deiner Zugangsdaten verantwortlich. Deine Rezepte bleiben deine Inhalte; KitchenMum erhält nur die Rechte, die zur Speicherung, Anzeige, Sicherung und Bearbeitung auf deinen Auftrag hin erforderlich sind. Eine öffentliche Weiterverwendung erfolgt nicht ohne gesonderte Rechtsgrundlage.",
      },
      {
        type: "paragraph",
        text: "Du darfst nur Inhalte speichern, an denen du die erforderlichen Rechte hast. Du kannst Rezepte bearbeiten, exportieren und deine KitchenMum-Daten in den Kontoeinstellungen löschen. Das Löschen der App-Daten löscht derzeit nicht dein Firebase-Anmeldekonto.",
      },
    ],
  },
  {
    heading: "§ 4 KI-Unterstützung",
    blocks: [
      {
        type: "paragraph",
        text: "Ein späterer KI-Import würde die von dir ausgewählten Texte oder Screenshots an einen benannten Modellanbieter übermitteln, um daraus einen editierbaren Rezeptvorschlag zu erstellen. Anbieter, Speicher- und Protokollierungseinstellungen werden vor Aktivierung in der Datenschutzerklärung offengelegt. Die Funktion ist im aktuellen Prototyp simuliert und sendet keine Inhalte an einen Modellanbieter.",
      },
    ],
  },
  {
    heading: "§ 5 Preise und kostenpflichtige Abos",
    blocks: [
      {
        type: "paragraph",
        text: "Ein kostenloses und ein kostenpflichtiges Angebot werden erst verbindlich, wenn Leistungen, Gesamtpreis einschließlich Umsatzsteuer, Abrechnungszeitraum, Laufzeit, Verlängerung, Zahlungsart und Kündigungsbedingungen vor der Bestellung klar angezeigt werden. Die derzeit angezeigten 4,99 € monatlich und 3,33 € monatlich (39,96 € pro Jahr) bei jährlicher Abrechnung sind reine Beispielwerte und keine buchbaren Preise.",
      },
      {
        type: "paragraph",
        text: "Stripe ist noch nicht angebunden; es werden keine Zahlungen eingezogen und kein kostenpflichtiger Vertrag geschlossen. Ein späterer Bestellbutton wird die gesetzlichen Anforderungen für einen zahlungspflichtigen Vertrag erfüllen und eine Bestellbestätigung auf einem dauerhaften Datenträger auslösen.",
      },
      {
        type: "link",
        href: "https://www.gesetze-im-internet.de/bgb/__312j.html",
        label: "§ 312j BGB",
        text: "Gesetzliche Informationen zum Online-Bestellvorgang:",
      },
    ],
  },
  {
    heading: "§ 6 Laufzeit und Kündigung",
    blocks: [
      {
        type: "paragraph",
        text: "Laufzeit, automatische Verlängerung und Kündigungsfrist eines künftigen Abos werden unmittelbar vor der Bestellung angegeben. Soweit gesetzlich erforderlich, wird KitchenMum eine leicht erreichbare Kündigungsfunktion bereitstellen. Das derzeitige Demo-Kundenportal und die Abo-Verwaltung nehmen keine Kündigung entgegen und ändern keinen Vertrag.",
      },
      {
        type: "link",
        href: "https://www.gesetze-im-internet.de/bgb/__312k.html",
        label: "§ 312k BGB",
        text: "Gesetzliche Vorgaben zur Kündigungsschaltfläche:",
      },
    ],
  },
  {
    heading: "§ 7 Widerruf",
    blocks: [
      {
        type: "paragraph",
        text: "Verbraucherinnen und Verbraucher erhalten vor dem Abschluss eines kostenpflichtigen Vertrags die jeweils anwendbare Widerrufsbelehrung und das Muster-Widerrufsformular auf einem dauerhaften Datenträger. Derzeit kann kein Abo abgeschlossen werden.",
      },
      {
        type: "link",
        href: "/widerruf",
        label: "Entwurf der Widerrufsbelehrung",
        text: "Zum vorbereiteten Informationstext:",
      },
    ],
  },
  {
    heading: "§ 8 Verfügbarkeit und Änderungen",
    blocks: [
      {
        type: "paragraph",
        text: "Im Produktivbetrieb werden Wartungsarbeiten und wesentliche Änderungen transparent mitgeteilt. Zwingende Rechte bei Mängeln digitaler Produkte und Dienste bleiben unberührt. Für den Prototyp wird keine bestimmte Verfügbarkeit zugesagt.",
      },
    ],
  },
  {
    heading: "§ 9 Haftung und Schlussbestimmungen",
    blocks: [
      {
        type: "paragraph",
        text: "Die gesetzliche Haftung, insbesondere bei Vorsatz, grober Fahrlässigkeit, Verletzung von Leben, Körper oder Gesundheit sowie nach zwingenden Verbraucherschutzvorschriften, bleibt unberührt. Für Verbraucherinnen und Verbraucher gelten die zwingenden Vorschriften ihres gewöhnlichen Aufenthaltsstaats. Diese Entwurfsbedingungen ersetzen keine individuell abgestimmte Vertragsfassung.",
      },
    ],
  },
];

export const withdrawalSections: LegalSection[] = [
  {
    heading: "Entwurfsstatus",
    blocks: [
      {
        type: "notice",
        title: "Vor Verkaufsstart vervollständigen",
        text: "Die Abo-Art und der Leistungsbeginn sind noch nicht festgelegt. Dieser Text ist deshalb eine vorbereitete Musterfassung. Für digitale Inhalte oder digitale Dienstleistungen können zusätzliche Erklärungen und Bestätigungen erforderlich sein; ein Widerrufsrecht erlischt nicht pauschal durch die Nutzung.",
      },
    ],
  },
  {
    heading: "Widerrufsbelehrung (Musterentwurf)",
    blocks: [
      {
        type: "paragraph",
        text: "Verbraucherinnen und Verbraucher haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen einen im Fernabsatz geschlossenen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses. Um das Widerrufsrecht auszuüben, musst du uns (Paul Konstantin Regler, Regler Productions, Kittenfeldstraße 2a, 91795 Dollnstein, Deutschland, info@reglerproductions.com, Telefon +49 152 16217838) mittels einer eindeutigen Erklärung über deinen Entschluss informieren. Du kannst dafür das unten stehende Musterformular verwenden; es ist nicht vorgeschrieben.",
      },
      {
        type: "paragraph",
        text: "Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung vor Ablauf der Frist absendest. Nach einem wirksamen Widerruf erstatten wir erhaltene Zahlungen nach den gesetzlichen Vorgaben. Bei einem digitalen Dienst kann Wertersatz nur verlangt werden, wenn die gesetzlichen Voraussetzungen erfüllt sind. Ein etwaiger vorzeitiger Beginn oder ein Erlöschen des Widerrufsrechts setzt die jeweils erforderlichen ausdrücklichen Erklärungen und Bestätigungen voraus.",
      },
    ],
  },
  {
    heading: "Muster-Widerrufsformular",
    blocks: [
      {
        type: "notice",
        title: "An",
        text: "Paul Konstantin Regler · Regler Productions · Kittenfeldstraße 2a · 91795 Dollnstein · info@reglerproductions.com",
        tone: "plain",
      },
      {
        type: "paragraph",
        text: "Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über die Nutzung des folgenden kostenpflichtigen KitchenMum-Abos: ______________________________",
      },
      {
        type: "paragraph",
        text: "Bestellt am: ____________________ · Name: ____________________ · Anschrift: ____________________ · Datum: ____________________ · Unterschrift (nur bei Mitteilung auf Papier): ____________________",
      },
    ],
  },
  {
    heading: "Online kündigen",
    blocks: [
      {
        type: "paragraph",
        text: "Widerruf und Kündigung sind unterschiedliche Erklärungen. Für ein späteres online abschließbares Abo wird geprüft, ob ein Kündigungsbutton nach § 312k BGB bereitzustellen ist. Die aktuelle Demo-Verwaltung ist kein wirksamer Kündigungsweg.",
      },
    ],
  },
];
