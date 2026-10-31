/**
 * Single source of truth for supported languages.
 * To add a language, follow docs/ADDING_A_LANGUAGE.md.
 */
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Language names, always written in their own language. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

/**
 * Default formatting locale for each interface language.
 * Language does NOT determine country, currency or time zone:
 * those are configured separately per workspace.
 */
export const formattingLocales: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
};

export const LOCALE_COOKIE = "NEXT_LOCALE";
/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
