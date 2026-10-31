import { formattingLocales, type Locale } from "@/i18n/config";

/**
 * Locale-aware formatting. The *interface language* picks the formatting
 * conventions; the *workspace* supplies time zone and currency. Neither is
 * inferred from the other.
 */
export type FormatContext = { locale: Locale; timeZone?: string; currency?: string };

const tag = (locale: Locale) => formattingLocales[locale];

/** en: "Oct 18, 2026" · fr: "18 oct. 2026" */
export function formatDate(value: string | Date, ctx: FormatContext) {
  return new Intl.DateTimeFormat(tag(ctx.locale), { dateStyle: "medium", timeZone: ctx.timeZone }).format(
    new Date(value),
  );
}

/** en: "Oct 18, 2026, 2:30 PM" · fr: "18 oct. 2026, 14:30" */
export function formatDateTime(value: string | Date, ctx: FormatContext) {
  return new Intl.DateTimeFormat(tag(ctx.locale), {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: ctx.timeZone,
  }).format(new Date(value));
}

/** en: "1,234.56" · fr: "1 234,56" */
export function formatNumber(value: number, ctx: FormatContext, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(tag(ctx.locale), options).format(value);
}

export function formatPercent(ratio: number, ctx: FormatContext) {
  return new Intl.NumberFormat(tag(ctx.locale), { style: "percent", maximumFractionDigits: 1 }).format(ratio);
}

/** Amounts are stored in minor units (cents). */
export function formatMoney(cents: number, ctx: FormatContext & { currency: string }) {
  return new Intl.NumberFormat(tag(ctx.locale), { style: "currency", currency: ctx.currency }).format(cents / 100);
}

/** Converts a <input type="datetime-local"> value, read in `timeZone`, to an ISO UTC string. */
export function zonedLocalInputToIso(local: string, timeZone: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!match) return null;
  const [, y, mo, d, h, mi] = match.map(Number);
  const asUtc = Date.UTC(y, mo - 1, d, h, mi);
  // Offset of the zone at that instant, applied twice to settle around DST changes.
  let guess = asUtc;
  for (let i = 0; i < 2; i++) guess = asUtc - zoneOffsetMs(guess, timeZone);
  return new Date(guess).toISOString();
}

function zoneOffsetMs(instant: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(instant));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const zoned = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return zoned - Math.floor(instant / 1000) * 1000;
}

export function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function isValidCurrency(code: string) {
  if (!/^[A-Z]{3}$/.test(code)) return false;
  try {
    new Intl.NumberFormat("en-US", { style: "currency", currency: code });
    return true;
  } catch {
    return false;
  }
}
