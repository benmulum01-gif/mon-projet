"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { DirtyForm } from "@/components/dirty-form";
import { Alert, Button, Field, Input } from "@/components/ui";
import type { FormState } from "@/lib/forms";
import { signIn } from "../actions";

export function SignInForm({ next }: { next?: string }) {
  const t = useTranslations("Auth");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const te = useTranslations("Errors");
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});
  const err = (f: string) => (state.fieldErrors?.[f] ? tv(state.fieldErrors[f]) : undefined);

  return (
    <DirtyForm action={action} noValidate className="space-y-4">
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      <input type="hidden" name="locale" value={locale} />
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field id="email" label={t("email")} error={err("email")} required requiredLabel={tc("required")}>
        {(aria) => <Input {...aria} name="email" type="email" autoComplete="email" />}
      </Field>
      <Field id="password" label={t("password")} error={err("password")} required requiredLabel={tc("required")}>
        {(aria) => <Input {...aria} name="password" type="password" autoComplete="current-password" />}
      </Field>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t("signingIn") : t("signIn")}
      </Button>
    </DirtyForm>
  );
}
