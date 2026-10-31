import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";

/** Canonical + hreflang alternates for a public page available in every language. */
export function alternates(locale: Locale, path: string): Metadata["alternates"] {
  const suffix = path === "/" ? "" : path;
  return {
    canonical: `/${locale}${suffix}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${suffix}`])),
      "x-default": `/en${suffix}`,
    },
  };
}
