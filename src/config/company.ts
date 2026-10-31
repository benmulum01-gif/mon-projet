/**
 * SINGLE SOURCE OF TRUTH for the company's identity.
 * Used by: legal notice, privacy policy, terms (CGV/CGU), footer, JSON-LD, llms.txt.
 * Keeping it in one place guarantees the same name / address / registration
 * numbers everywhere (consistency required between legal pages).
 *
 * `null` = not provided yet: pages render a visible "[À COMPLÉTER]" marker and
 * `npm run check:legal` lists every missing value. Fill everything before launch.
 */
export type Maybe = string | null;

export const company = {
  /** Trade name shown to visitors. */
  brand: "SAVAN",
  /** Registered company name (dénomination sociale). */
  legalName: null as Maybe,
  /** e.g. "SARL", "SA", "SAS" under OHADA law. */
  legalForm: null as Maybe,
  /** e.g. "1 000 000 CDF" or "5 000 USD". */
  shareCapital: null as Maybe,
  /** Registered office, full postal address. */
  address: null as Maybe,
  country: { fr: "République démocratique du Congo", en: "Democratic Republic of the Congo" },
  /** Registre du Commerce et du Crédit Mobilier (OHADA), number and city. */
  rccm: null as Maybe,
  /** Identification nationale (Id. Nat.). */
  idNat: null as Maybe,
  /** Numéro d'impôt (NIF). */
  nif: null as Maybe,
  /** EU VAT / OSS identification number, if registered. */
  euVatNumber: null as Maybe,
  /** Person legally responsible for the content (directeur de la publication). */
  publicationDirector: null as Maybe,
  /** Working contact address (must be monitored). */
  email: null as Maybe,
  /** Optional. */
  phone: null as Maybe,
  /** Address for privacy requests (can be the same as email). */
  privacyEmail: null as Maybe,
  /** GDPR art. 27 representative in the EU (required for a non-EU controller). */
  euRepresentative: { name: null as Maybe, address: null as Maybe, email: null as Maybe },
  /** Website host (not chosen yet). */
  host: { name: null as Maybe, address: null as Maybe, phone: null as Maybe },
  /** Region of the Supabase project (not created yet; EU recommended). */
  databaseRegion: null as Maybe,
  /** Consumer mediator: you must JOIN an approved mediator before naming it. */
  mediator: { name: null as Maybe, address: null as Maybe, website: null as Maybe },
  /** Governing law proposed in the terms; to be validated by a lawyer. */
  governingLaw: { fr: "droit français", en: "French law" },
  /** Courts for disputes with professional customers. */
  b2bCourt: null as Maybe,
  /** Date of the last update of the legal documents (ISO). */
  legalUpdatedAt: "2026-10-31",
  /** Version of the terms accepted at sign-up (bump when CGU change). */
  termsVersion: "2026-10-31",
} as const;

/** Every field that still needs a value, for `npm run check:legal`. */
export function missingCompanyFields(): string[] {
  const missing: string[] = [];
  const walk = (value: unknown, path: string) => {
    if (value === null) missing.push(path);
    else if (typeof value === "object") for (const [k, v] of Object.entries(value as object)) walk(v, path ? `${path}.${k}` : k);
  };
  walk(company, "");
  return missing;
}
