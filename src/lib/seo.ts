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

/** Title, description, canonical/hreflang and Open Graph for a public page. */
export function pageMetadata(locale: Locale, path: string, title: string, description?: string, absoluteTitle = false): Metadata {
  const suffix = path === "/" ? "" : path;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      title,
      description,
      url: `/${locale}${suffix}`,
      siteName: "SAVAN",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locales.filter((l) => l !== locale).map((l) => (l === "fr" ? "fr_FR" : "en_US")),
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}
