import type {
  AiImportAdapter,
  AuthAdapter,
  BillingAdapter,
} from "@/lib/services/contracts";
import type { RecipeDraft } from "@/lib/types";

export const mockAuth: AuthAdapter = {
  async signIn(email, password) {
    await Promise.resolve();
    if (!email.includes("@") || password.length < 6)
      throw new Error(
        "Bitte gib eine gültige E-Mail und mindestens 6 Zeichen ein.",
      );
    return { email, name: email.split("@")[0].replace(/[._-]/g, " ") };
  },
  async signUp(name, email, password) {
    await Promise.resolve();
    if (name.trim().length < 2 || !email.includes("@") || password.length < 8)
      throw new Error(
        "Bitte prüfe Name, E-Mail und Passwort. Das Passwort braucht mindestens 8 Zeichen.",
      );
    return { name: name.trim(), email };
  },
};

export const mockBilling: BillingAdapter = {
  async createCheckoutSession() {
    await Promise.resolve();
    return { url: "mock://checkout", status: "mock" };
  },
  async createPortalSession() {
    await Promise.resolve();
    return { url: "mock://billing-portal", status: "mock" };
  },
};

export const mockAiImport: AiImportAdapter = {
  async extractRecipe({ text, fileName }) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const title =
      lines[0]?.replace(/^#\s*/, "") ||
      fileName?.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") ||
      "Neues Lieblingsrezept";
    const firstNumberedStep = lines.findIndex((line) =>
      /^\d+[.)]\s/.test(line),
    );
    const beforeSteps =
      firstNumberedStep >= 0 ? lines.slice(0, firstNumberedStep) : lines;
    const ingredientLines = beforeSteps
      .filter((line) => /^(\d|[-•])/.test(line))
      .slice(0, 12);
    const stepLines = lines
      .filter((line) =>
        /^\d+[.)]|^(Zuerst|Dann|Anschließend|Danach|Zum Schluss)/i.test(line),
      )
      .slice(0, 6);
    const searchableText = `${title} ${text}`.toLocaleLowerCase("de");
    const category = /brot|sauerteig/.test(searchableText)
      ? "Brot"
      : /kuchen|torte|muffin/.test(searchableText)
        ? "Kuchen"
        : /one.?pot|pfanne|topf/.test(searchableText)
          ? "Onepot"
          : /blech|ofengemüse/.test(searchableText)
            ? "Vom Blech"
            : "Sonstige";
    const image =
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&q=85";
    const draft: RecipeDraft = {
      title,
      description:
        "Aus deinem Rezepttext erstellt. Bitte prüfe die Angaben vor dem Speichern.",
      category,
      image,
      prepMinutes: null,
      cookMinutes: null,
      temperature: null,
      servings: null,
      ingredients: ingredientLines.length
        ? ingredientLines.map((item) => item.replace(/^[-•]\s*/, ""))
        : ["Zutat ergänzen"],
      steps: stepLines.length
        ? stepLines.map((item) => item.replace(/^\d+[.)]\s*/, ""))
        : ["Zubereitungsschritt ergänzen"],
      sourceUrl: "",
      warnings: [
        "Die KI-Erkennung ist hier als Frontend-Demo simuliert. Bitte fehlende Zeiten und Temperaturen selbst ergänzen.",
      ],
    };
    return draft;
  },
};
