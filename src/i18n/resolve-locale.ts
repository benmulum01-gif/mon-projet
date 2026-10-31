import { defaultLocale, isLocale, locales, type Locale } from "./config";

export type LocaleSignals = {
  /** 1. Explicit preference saved in the authenticated user's profile. */
  profile?: string | null;
  /** 2. Preference saved for this browser/device (locale cookie). */
  cookie?: string | null;
  /** 3. Locale segment of the current URL, if any. */
  url?: string | null;
  /** 4. Raw Accept-Language header. */
  acceptLanguage?: string | null;
};

/**
 * Picks the first supported locale from an Accept-Language header,
 * honouring q-values ("fr-CA,fr;q=0.9,en;q=0.8" -> "fr").
 */
export function localeFromAcceptLanguage(header?: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number(q.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality, index };
    })
    .filter((entry) => entry.tag && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    const match = locales.find((locale) => locale === tag || locale === base);
    if (match) return match;
  }
  return null;
}

/**
 * Resolution order required by the product spec:
 * profile > device cookie > URL > browser language > English.
 * A browser language never overrides an explicit preference.
 */
export function resolveLocale(signals: LocaleSignals): Locale {
  if (isLocale(signals.profile)) return signals.profile;
  if (isLocale(signals.cookie)) return signals.cookie;
  if (isLocale(signals.url)) return signals.url;
  return localeFromAcceptLanguage(signals.acceptLanguage) ?? defaultLocale;
}
