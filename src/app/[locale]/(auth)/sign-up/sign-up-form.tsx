"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { DirtyForm } from "@/components/dirty-form";
import { Alert, Button, Field, Input } from "@/components/ui";
import type { FormState } from "@/lib/forms";
import { signUp } from "../actions";

export function SignUpForm() {
  const t = useTranslations("Auth");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const te = useTranslations("Errors");
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState<{ checkEmail: boolean }>, FormData>(signUp, {});
  const err = (f: string) => (state.fieldErrors?.[f] ? tv(state.fieldErrors[f]) : undefined);

  if (state.data?.checkEmail) return <Alert tone="success">{t("checkEmail")}</Alert>;

  return (
    <DirtyForm action={action} noValidate className="space-y-4">
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      <input type="hidden" name="locale" value={locale} />
      <Field id="fullName" label={t("fullName")} error={err("fullName")} optionalLabel={tc("optional")}>
        {(aria) => <Input {...aria} name="fullName" autoComplete="name" maxLength={200} />}
      </Field>
      <Field id="email" label={t("email")} error={err("email")} required requiredLabel={tc("required")}>
        {(aria) => <Input {...aria} name="email" type="email" autoComplete="email" />}
      </Field>
      <Field id="password" label={t("password")} help={t("passwordHint")} error={err("password")} required requiredLabel={tc("required")}>
        {(aria) => <Input {...aria} name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} />}
      </Field>
      <div>
        <label className="flex items-start gap-2 text-sm text-ink-700">
          {/* Not pre-ticked: acceptance must be an explicit action. */}
          <input
            type="checkbox"
            name="acceptTerms"
            value="yes"
            required
            className="mt-0.5 size-4 shrink-0"
            aria-invalid={err("acceptTerms") ? true : undefined}
            aria-describedby={err("acceptTerms") ? "acceptTerms-error" : undefined}
          />
          <span>
            {t.rich("acceptTerms", {
              terms: (chunks) => <Link href="/legal/terms-of-use" target="_blank" className="font-semibold text-brand-700 underline">{chunks}</Link>,
              privacy: (chunks) => <Link href="/legal/privacy" target="_blank" className="font-semibold text-brand-700 underline">{chunks}</Link>,
            })}
            <span className="text-red-700" aria-hidden="true"> *</span>
          </span>
        </label>
        {err("acceptTerms") ? <p id="acceptTerms-error" className="mt-1 text-sm text-red-700">{err("acceptTerms")}</p> : null}
      </div>
      <p className="text-xs text-ink-600">{t("accountNotice")}</p>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t("signingUp") : t("signUp")}
      </Button>
    </DirtyForm>
  );
}
