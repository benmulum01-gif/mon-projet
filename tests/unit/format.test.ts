import { describe, expect, it } from "vitest";
import { formatDate, formatMoney, formatNumber, zonedLocalInputToIso } from "@/lib/format";

const NBSP = /[  ]/g;

describe("locale-aware formatting", () => {
  it("formats dates per interface language", () => {
    const date = "2026-10-18T12:00:00Z";
    expect(formatDate(date, { locale: "en", timeZone: "UTC" })).toBe("Oct 18, 2026");
    expect(formatDate(date, { locale: "fr", timeZone: "UTC" })).toBe("18 oct. 2026");
  });
  it("formats numbers per interface language", () => {
    expect(formatNumber(1234.56, { locale: "en" })).toBe("1,234.56");
    expect(formatNumber(1234.56, { locale: "fr" }).replace(NBSP, " ")).toBe("1 234,56");
  });
  it("keeps currency independent of language", () => {
    expect(formatMoney(150050, { locale: "en", currency: "EUR" })).toBe("€1,500.50");
    expect(formatMoney(150050, { locale: "fr", currency: "USD" }).replace(NBSP, " ")).toBe("1 500,50 $US");
  });
  it("uses the business time zone, not the language, for dates", () => {
    const lateEvening = "2026-10-18T23:30:00Z";
    expect(formatDate(lateEvening, { locale: "en", timeZone: "Europe/Paris" })).toBe("Oct 19, 2026");
    expect(formatDate(lateEvening, { locale: "fr", timeZone: "America/Montreal" })).toBe("18 oct. 2026");
  });
});

describe("zonedLocalInputToIso", () => {
  it("interprets the form value in the business time zone", () => {
    expect(zonedLocalInputToIso("2026-07-01T09:00", "Europe/Paris")).toBe("2026-07-01T07:00:00.000Z");
    expect(zonedLocalInputToIso("2026-12-01T09:00", "Europe/Paris")).toBe("2026-12-01T08:00:00.000Z");
    expect(zonedLocalInputToIso("2026-07-01T09:00", "America/Toronto")).toBe("2026-07-01T13:00:00.000Z");
  });
  it("rejects malformed input", () => {
    expect(zonedLocalInputToIso("tomorrow", "UTC")).toBeNull();
  });
});
