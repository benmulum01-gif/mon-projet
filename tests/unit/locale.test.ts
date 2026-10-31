import { describe, expect, it } from "vitest";
import { localeFromAcceptLanguage, resolveLocale } from "@/i18n/resolve-locale";

describe("resolveLocale (profile > cookie > URL > browser > English)", () => {
  it("prefers the saved profile over everything else", () => {
    expect(resolveLocale({ profile: "fr", cookie: "en", url: "en", acceptLanguage: "en-US" })).toBe("fr");
  });
  it("uses the device cookie when there is no profile preference", () => {
    expect(resolveLocale({ cookie: "fr", url: "en", acceptLanguage: "en" })).toBe("fr");
  });
  it("uses the URL before the browser language", () => {
    expect(resolveLocale({ url: "en", acceptLanguage: "fr-FR" })).toBe("en");
  });
  it("never lets the browser override an explicit preference", () => {
    expect(resolveLocale({ profile: "en", acceptLanguage: "fr-FR,fr;q=0.9" })).toBe("en");
  });
  it("falls back to English", () => {
    expect(resolveLocale({ acceptLanguage: "de-DE,es;q=0.5" })).toBe("en");
    expect(resolveLocale({ profile: "xx", cookie: "zz" })).toBe("en");
  });
});

describe("localeFromAcceptLanguage", () => {
  it("honours q-values and regional tags", () => {
    expect(localeFromAcceptLanguage("de;q=1, fr-CA;q=0.8, en;q=0.5")).toBe("fr");
    expect(localeFromAcceptLanguage("en-GB,en;q=0.9")).toBe("en");
    expect(localeFromAcceptLanguage("fr;q=0")).toBeNull();
    expect(localeFromAcceptLanguage(null)).toBeNull();
  });
});
