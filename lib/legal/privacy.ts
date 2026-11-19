import type { LegalSection } from "@/lib/legal/content-types";

export const privacySections: LegalSection[] = [
  {
    heading: "1. Verantwortlicher und Kontakt",
    blocks: [
      {
        type: "paragraph",
        text: "Verantwortlicher für KitchenMum ist Paul Konstantin Regler, Einzelunternehmer, handelnd unter Regler Productions (Polymath Productions), Kittenfeldstraße 2a, 91795 Dollnstein, Bayern, Deutschland.",
      },
      {
        type: "paragraph",
        text: "Datenschutzanfragen erreichst du unter info@reglerproductions.com oder telefonisch unter +49 152 16217838.",
      },
    ],
  },
  {
    heading: "2. Konto- und Rezeptdaten",
    blocks: [
      {
        type: "paragraph",
        text: "KitchenMum ermöglicht derzeit E-Mail-/Passwort-Konten über Firebase Authentication. Firebase verarbeitet die zur Kontoerstellung und Anmeldung erforderlichen Kontodaten und Passwörter. Passwörter werden nicht in der KitchenMum-Datenbank gespeichert. Eine Anmeldung ist erst nach Bestätigung der E-Mail-Adresse möglich.",
      },
      {
        type: "list",
        items: [
          "Dein Profilname, Rezepte, Kategorien, Zutaten, Zubereitung, Favoriten, Quellenverweise und Einstellungen werden in PostgreSQL auf dem KitchenMum-VPS gespeichert und anhand deiner Firebase-Konto-ID getrennt. Zusätzlich enthält Firestore einen Kontodatensatz mit Name, E-Mail, Einstellungen und Abo-Status.",
          "Deine E-Mail-Adresse und dein Passwort werden für die Authentifizierung von Firebase verarbeitet. Die App erhält nach der Anmeldung ein Firebase-ID-Token; die API prüft es und verwendet die bestätigte Konto-ID zur Datenzuordnung.",
          "Abo-Metadaten werden für den jeweiligen Kontostatus in PostgreSQL und Firestore gespeichert. Neue Konten beginnen mit dem Status „free“. Es gibt noch keinen Zahlungsanbieter und keine kostenpflichtige Buchung.",
          "Deine Cookie-Auswahl wird unter „kitchenmum-consent-v1“ gespeichert. In der Vorschau werden dadurch keine Statistik- oder Marketingdienste geladen.",
          "Beim Import bleiben eingefügter Rezepttext und ausgewählter Screenshot im aktuellen Browserablauf. Die Vorschau verarbeitet den Text lokal; eine ausgewählte Bilddatei wird nicht an einen KI-Dienst übertragen. Der Dateiname kann im aktuellen Ablauf angezeigt werden.",
        ],
      },
      {
        type: "paragraph",
        text: "Die App-Daten bleiben gespeichert, bis du sie über die Kontoeinstellungen löschst oder eine Löschung anfragst. Die Datenlöschfunktion in der App entfernt Profil-, Rezept-, Einstellungs- und Abo-Metadaten; das Firebase-Anmeldekonto bleibt dabei bestehen und kann separat gelöscht werden.",
      },
    ],
  },
  {
    heading: "3. Hosting, Serverprotokolle und Fotos",
    blocks: [
      {
        type: "paragraph",
        text: "Die PostgreSQL-Datenbank und Python-API laufen auf einem eigenen VPS. Die API ist derzeit nur intern beziehungsweise über einen SSH-Tunnel erreichbar und nicht als öffentlicher Produktivdienst freigeschaltet. VPS-Anbieter, Serverstandort, Zugriffs- und Protokollierungsdetails sowie konkrete Löschfristen müssen vor einem öffentlichen Launch ergänzt werden. Lokale Datenbanksicherungen werden auf demselben VPS aufbewahrt; ein verschlüsseltes Offsite-Backup ist noch einzurichten.",
      },
      {
        type: "paragraph",
        text: "Die Vorschau nutzt Beispielbilder von Unsplash über die Next.js-Bildoptimierung. Der Browser ruft dafür die KitchenMum-Webadresse auf; der App-Server kann das jeweilige Bild bei images.unsplash.com abrufen. Es ist kein eigener Nutzerfoto-Upload an Unsplash angeschlossen.",
      },
    ],
  },
  {
    heading: "4. Eingesetzte und geplante Anbieter",
    blocks: [
      {
        type: "notice",
        title: "Firebase und der eigene VPS sind verbunden",
        text: "Firebase Authentication verarbeitet Kontoanmeldungen. Die KitchenMum-API und PostgreSQL auf dem eigenen VPS speichern Kontoprofil und Rezeptdaten. Details zum VPS-Anbieter und Serverstandort müssen vor öffentlichem Betrieb ergänzt werden.",
      },
      {
        type: "list",
        items: [
          "Google Firebase Authentication: Verwaltung von E-Mail-/Passwort-Konten, E-Mail-Bestätigung, Anmeldung und Passwort-Reset. Die konkrete Auth-Datenregion und die vertraglich nötigen Datenschutzinformationen sind vor öffentlichem Betrieb zu ergänzen.",
          "Eigener VPS: Betrieb der KitchenMum-API und PostgreSQL für Profil-, Rezept-, Einstellungs- und Abo-Metadaten. Anbieter, Standort und Auftragsverarbeitungsdetails sind noch zu dokumentieren.",
          "Stripe: vorgesehener Zahlungsanbieter für ein späteres Plus-Abo. Stripe ist nicht eingebunden; es werden keine Zahlungsdaten erhoben oder übermittelt. Die dann maßgebliche Stripe-Gesellschaft, Rollen, Datenschutzinformationen und Zahlungsabläufe werden vor dem ersten Verkauf ergänzt.",
          "Microsoft Azure AI Foundry: vorgesehener Anbieter für die optionale Erkennung von Rezepttext und Screenshots. Modell, Region, Speicher- und Protokollierungseinstellungen sowie mögliche Drittlandübermittlungen sind noch nicht festgelegt. Bis dahin wird kein Inhalt an ein Modell gesendet.",
        ],
      },
      {
        type: "paragraph",
        text: "Werden diese Anbieter aktiviert, werden Zwecke, Rechtsgrundlagen, Datenkategorien, Empfänger, Speicherfristen und gegebenenfalls Drittlandgarantien vorab konkretisiert. Auftragsverarbeitungsverträge nach Art. 28 DSGVO und erforderliche Garantien für Drittlandtransfers werden vor Beginn der Verarbeitung geprüft.",
      },
    ],
  },
  {
    heading: "5. Zwecke und Rechtsgrundlagen",
    blocks: [
      {
        type: "paragraph",
        text: "Kontodaten werden verarbeitet, um dein Konto einzurichten und abzusichern. Rezept- und Profildaten werden gespeichert, um die von dir angeforderte Synchronisierung und Kontoverwaltung bereitzustellen. Die konkreten Rechtsgrundlagen und erforderlichen Vertragsangaben sind vor einem öffentlichen Produktivbetrieb zu prüfen und zu vervollständigen.",
      },
      {
        type: "paragraph",
        text: "Optionale Analyse- oder Marketingverarbeitung findet derzeit nicht statt. Sollte sie später eingeführt werden, wird sie erst nach deiner Einwilligung aktiviert, soweit diese erforderlich ist; eine Einwilligung kannst du dann jederzeit mit Wirkung für die Zukunft widerrufen.",
      },
      {
        type: "link",
        href: "https://www.gesetze-im-internet.de/ttdsg/__25.html",
        label: "§ 25 TDDDG",
        text: "Gesetzestext:",
      },
      {
        type: "link",
        href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj/deu",
        label: "Datenschutz-Grundverordnung (DSGVO)",
        text: "Europäischer Gesetzestext:",
      },
    ],
  },
  {
    heading: "6. Empfänger und Drittlandübermittlungen",
    blocks: [
      {
        type: "paragraph",
        text: "Firebase (Google) erhält Authentifizierungsdaten und speichert den zugehörigen Kontodatensatz in Firestore. Profil- und Rezeptdaten werden auf dem KitchenMum-VPS gespeichert. Die konkrete VPS-Region und Firebase-Region sowie etwaige Drittlandübermittlungen sind vor öffentlichem Betrieb anhand der tatsächlichen Kontoeinstellungen und Verträge festzustellen und hier zu ergänzen.",
      },
    ],
  },
  {
    heading: "7. Speicherdauer und Löschung",
    blocks: [
      {
        type: "paragraph",
        text: "Deine Profildaten und Rezepte werden bis zur Löschung über die Kontoeinstellungen oder auf Anfrage gespeichert. Lokale Backups werden bis zu 14 Tage aufbewahrt. Konkrete Aufbewahrungsfristen für Serverprotokolle sowie Sicherungen nach einer Datenlöschung müssen vor öffentlichem Produktivbetrieb dokumentiert werden.",
      },
    ],
  },
  {
    heading: "8. Deine Datenschutzrechte",
    blocks: [
      {
        type: "list",
        items: [
          "Auskunft über deine verarbeiteten personenbezogenen Daten sowie eine Kopie der Daten zu verlangen.",
          "Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten zu verlangen.",
          "Löschung oder Einschränkung der Verarbeitung zu verlangen, soweit die gesetzlichen Voraussetzungen vorliegen.",
          "Datenübertragbarkeit zu verlangen, soweit die Voraussetzungen erfüllt sind.",
          "Aus Gründen deiner besonderen Situation gegen Verarbeitungen auf Grundlage berechtigter Interessen Widerspruch einzulegen.",
          "Eine erteilte Einwilligung jederzeit für die Zukunft zu widerrufen.",
          "Dich bei einer Datenschutzaufsichtsbehörde zu beschweren.",
        ],
      },
      {
        type: "paragraph",
        text: "Für eine Anfrage genügt eine Nachricht an info@reglerproductions.com. Die zuständige Aufsichtsbehörde richtet sich nach Unternehmenssitz und Verarbeitung; für private Stellen in Bayern ist regelmäßig das Bayerische Landesamt für Datenschutzaufsicht zuständig. Bitte prüfe die Zuständigkeit im konkreten Fall.",
      },
      {
        type: "link",
        href: "https://www.lda.bayern.de/",
        label: "Bayerisches Landesamt für Datenschutzaufsicht",
        text: "Informationen der Behörde:",
      },
    ],
  },
  {
    heading: "9. Automatisierte Entscheidungen und Profiling",
    blocks: [
      {
        type: "paragraph",
        text: "Es findet in dieser Vorschau keine ausschließlich automatisierte Entscheidung mit rechtlicher oder ähnlich erheblicher Wirkung und kein Profiling statt. Eine spätere KI-Erkennung soll nur einen bearbeitbaren Rezeptentwurf liefern; du prüfst und bestätigst die Angaben selbst.",
      },
    ],
  },
];
