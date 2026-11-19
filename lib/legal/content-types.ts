export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "notice"; title?: string; text: string; tone?: "warm" | "plain" }
  | { type: "link"; href: string; label: string; text?: string };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};
