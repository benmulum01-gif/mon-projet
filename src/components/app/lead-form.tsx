"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { locales } from "@/i18n/config";
import { DirtyForm } from "@/components/dirty-form";
import { Alert, Button, Field, Input, Select, Textarea } from "@/components/ui";
import type { FormState } from "@/lib/forms";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/labels";
import type { Database } from "@/lib/supabase/types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

export function LeadForm({
  action,
  lead,
  currency,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  lead?: Lead;
  currency: string;
}) {
  const t = useTranslations("Leads.form");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const te = useTranslations("Errors");
  const tl = useTranslations("Languages");
  const ts = useTranslations("LeadStatus");
  const tsrc = useTranslations("LeadSource");
  const [state, formAction, pending] = useActionState(action, {});
  const err = (f: string) => (state.fieldErrors?.[f] ? tv(state.fieldErrors[f]) : undefined);
  // Values are typed with "." as the decimal separator by <input type="text" inputmode="decimal">;
  // the server also accepts ",".
  const value = lead?.value_cents != null ? (lead.value_cents / 100).toFixed(2) : "";

  return (
    <DirtyForm action={formAction} noValidate className="space-y-5">
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      {state.ok ? <Alert tone="success">{t("saved")}</Alert> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="fullName" label={t("fullName")} error={err("fullName")} required requiredLabel={tc("required")}>
          {(aria) => <Input {...aria} name="fullName" defaultValue={lead?.full_name} maxLength={200} />}
        </Field>
        <Field id="company" label={t("company")} error={err("company")} optionalLabel={tc("optional")}>
          {(aria) => <Input {...aria} name="company" defaultValue={lead?.company ?? ""} maxLength={200} />}
        </Field>
        <Field id="email" label={t("email")} error={err("email")} optionalLabel={tc("optional")}>
          {(aria) => <Input {...aria} name="email" type="email" defaultValue={lead?.email ?? ""} />}
        </Field>
        <Field id="phone" label={t("phone")} error={err("phone")} optionalLabel={tc("optional")}>
          {(aria) => <Input {...aria} name="phone" type="tel" defaultValue={lead?.phone ?? ""} maxLength={50} />}
        </Field>
        <Field id="status" label={t("status")} error={err("status")}>
          {(aria) => (
            <Select {...aria} name="status" defaultValue={lead?.status ?? "new"}>
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{ts(s)}</option>)}
            </Select>
          )}
        </Field>
        <Field id="source" label={t("source")} error={err("source")}>
          {(aria) => (
            <Select {...aria} name="source" defaultValue={lead?.source ?? "website"}>
              {LEAD_SOURCES.map((s) => <option key={s} value={s}>{tsrc(s)}</option>)}
            </Select>
          )}
        </Field>
        <Field id="preferredLocale" label={t("preferredLocale")} help={t("preferredLocaleHelp")} error={err("preferredLocale")}>
          {(aria) => (
            <Select {...aria} name="preferredLocale" defaultValue={lead?.preferred_locale ?? ""}>
              <option value="">{t("unknownLanguage")}</option>
              {locales.map((l) => <option key={l} value={l}>{tl(l)}</option>)}
            </Select>
          )}
        </Field>
        <Field id="value" label={t("value", { currency })} help={t("valueHelp")} error={err("value")}>
          {(aria) => <Input {...aria} name="value" inputMode="decimal" defaultValue={value} />}
        </Field>
      </div>
      <Field id="notes" label={t("notes")} error={err("notes")} optionalLabel={tc("optional")}>
        {(aria) => <Textarea {...aria} name="notes" rows={4} defaultValue={lead?.notes ?? ""} maxLength={5000} />}
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? t("saving") : lead ? t("save") : t("create")}
      </Button>
    </DirtyForm>
  );
}
