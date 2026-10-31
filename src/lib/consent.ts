import type { ConsentCategory } from "@/config/integrations";

export const CONSENT_COOKIE = "savan_consent";
/** Choices are kept for 6 months at most, then the visitor is asked again (CNIL). */
export const CONSENT_MAX_AGE_DAYS = 182;
export const CONSENT_VERSION = 1;

export type ConsentChoices = Record<ConsentCategory, boolean>;
export type ConsentRecord = { v: number; t: string; c: ConsentChoices };

export const NO_CONSENT: ConsentChoices = { analytics: false, advertising: false, media: false, chat: false };

export function readConsent(cookieString: string): ConsentRecord | null {
  const raw = cookieString.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!raw) return null;
  try {
    const record = JSON.parse(decodeURIComponent(raw.slice(CONSENT_COOKIE.length + 1))) as ConsentRecord;
    const age = Date.now() - new Date(record.t).getTime();
    if (record.v !== CONSENT_VERSION || !(age >= 0) || age > CONSENT_MAX_AGE_DAYS * 86400_000) return null;
    return { ...record, c: { ...NO_CONSENT, ...record.c } };
  } catch {
    return null;
  }
}

export function serializeConsent(choices: ConsentChoices): string {
  const record: ConsentRecord = { v: CONSENT_VERSION, t: new Date().toISOString(), c: choices };
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  return `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}; Max-Age=${CONSENT_MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
}

/** Cookies set on our own domain by each purpose, deleted when consent is withdrawn. */
const OWN_DOMAIN_COOKIES: Record<ConsentCategory, RegExp> = {
  analytics: /^_ga/,
  advertising: /^(_gcl_|_fbp|_fbc|_ttp|_tt_|li_|lidc|bcookie|UserMatchHistory|AnalyticsSyncHistory)/,
  media: /^(_calendly|__cf_bm)/,
  chat: /^(twk_|TawkConnectionTime|__tawk)/,
};

export function deleteCookiesFor(category: ConsentCategory) {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const entry of document.cookie.split("; ")) {
    const name = entry.split("=")[0];
    if (!OWN_DOMAIN_COOKIES[category].test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}
