import { defineRouting } from "next-intl/routing";
import { defaultLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, locales } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Every page lives under /en/... or /fr/...: shareable, indexable URLs per language.
  localePrefix: "always",
  localeCookie: {
    name: LOCALE_COOKIE,
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  },
});
