import { formatDateTime } from "@/lib/format";
import { isLocale, type Locale } from "@/i18n/config";

export type Variant = { locale: string; subject: string | null; body: string };

export type VariantChoice =
  | { ok: true; variant: Variant; locale: Locale; reason: "recipient" | "workspace_default" }
  | { ok: false; missing: Locale };

/**
 * Chooses the template language for a recipient:
 *   1. the language of the conversation, then the lead's preferred language;
 *   2. otherwise the workspace's default communication language.
 * The dashboard/interface language is deliberately NOT an input.
 */
export function chooseVariant(
  variants: Variant[],
  opts: { conversationLocale?: string | null; leadLocale?: string | null; workspaceDefault: string },
): VariantChoice {
  const byLocale = new Map(variants.map((v) => [v.locale, v]));
  const recipient = [opts.conversationLocale, opts.leadLocale].find(isLocale);
  if (recipient && byLocale.has(recipient)) {
    return { ok: true, variant: byLocale.get(recipient)!, locale: recipient, reason: "recipient" };
  }
  const fallback = isLocale(opts.workspaceDefault) ? opts.workspaceDefault : "en";
  const variant = byLocale.get(fallback);
  if (variant) return { ok: true, variant, locale: fallback, reason: "workspace_default" };
  return { ok: false, missing: fallback };
}

export const TEMPLATE_PLACEHOLDERS = ["first_name", "full_name", "company", "business_name", "appointment_time"] as const;

export type TemplateData = {
  fullName: string;
  company?: string | null;
  businessName: string;
  appointmentAt?: string | null;
  timeZone: string;
};

/** Fills {{placeholders}}. Dates are formatted for the *message* language and the business time zone. */
export function renderTemplate(body: string, locale: Locale, data: TemplateData) {
  const values: Record<(typeof TEMPLATE_PLACEHOLDERS)[number], string> = {
    first_name: data.fullName.trim().split(/\s+/)[0] ?? "",
    full_name: data.fullName.trim(),
    company: data.company ?? "",
    business_name: data.businessName,
    appointment_time: data.appointmentAt ? formatDateTime(data.appointmentAt, { locale, timeZone: data.timeZone }) : "",
  };
  return body.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (match, key: string) =>
    key in values ? values[key as keyof typeof values] : match,
  );
}
