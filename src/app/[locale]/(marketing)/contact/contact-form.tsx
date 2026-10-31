"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { DirtyForm } from "@/components/dirty-form";
import { Alert, Button, Field, Input, Textarea } from "@/components/ui";
import type { FormState } from "@/lib/forms";
import { submitContact } from "./actions";

export function ContactForm() {
  const t = useTranslations("Contact.form");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const te = useTranslations("Errors");
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, {});
  const err = (field: string) => (state.fieldErrors?.[field] ? tv(state.fieldErrors[field]) : undefined);

  if (state.ok) {
    return <Alert tone="success">{t("success")}</Alert>;
  }

  return (
    <DirtyForm action={action} noValidate className="space-y-4">
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      <input type="hidden" name="locale" value={locale} />
      <Field id="fullName" label={t("fullName")} error={err("fullName")} required requiredLabel={tc("required")}>
        {(aria) => <Input {...aria} name="fullName" autoComplete="name" maxLength={200} />}
      </Field>
      <Field id="email" label={t("email")} error={err("email")} required requiredLabel={tc("required")}>
        {(aria) => <Input {...aria} name="email" type="email" autoComplete="email" maxLength={320} />}
      </Field>
      <Field id="company" label={t("company")} error={err("company")} optionalLabel={tc("optional")}>
        {(aria) => <Input {...aria} name="company" autoComplete="organization" maxLength={200} />}
      </Field>
      <Field id="message" label={t("message")} error={err("message")} required requiredLabel={tc("required")}>
        {(aria) => <Textarea {...aria} name="message" rows={5} maxLength={5000} />}
      </Field>
      <p className="text-xs text-ink-600">{t("dataNotice")}</p>
      <Button type="submit" disabled={pending}>
        {pending ? t("sending") : t("submit")}
      </Button>
    </DirtyForm>
  );
}
