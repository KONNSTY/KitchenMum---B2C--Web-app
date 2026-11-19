export const CONSENT_STORAGE_KEY = "kitchenmum-consent-v1";
export const CONSENT_VERSION = 1;

export type ConsentDecision = "necessary-only" | "accepted-all" | "custom";

export type CookieConsent = {
  version: typeof CONSENT_VERSION;
  necessary: true;
  statistics: boolean;
  marketing: boolean;
  decision: ConsentDecision;
  updatedAt: string;
};

export type ConsentChoice = Pick<
  CookieConsent,
  "statistics" | "marketing" | "decision"
>;

export function parseCookieConsent(value: string | null): CookieConsent | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;

    const record = parsed as Partial<CookieConsent>;
    const validDecision =
      record.decision === "necessary-only" ||
      record.decision === "accepted-all" ||
      record.decision === "custom";

    if (
      record.version !== CONSENT_VERSION ||
      record.necessary !== true ||
      typeof record.statistics !== "boolean" ||
      typeof record.marketing !== "boolean" ||
      !validDecision ||
      typeof record.updatedAt !== "string"
    ) {
      return null;
    }

    return record as CookieConsent;
  } catch {
    return null;
  }
}
