"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { DirtyForm } from "@/components/dirty-form";
import { Alert, Button, Input } from "@/components/ui";
import { subscribeNewsletter } from "@/lib/actions/newsletter";
import type { FormState } from "@/lib/forms";

export function NewsletterForm() {
  const t = useTranslations("Newsletter");
  const tv = useTranslations("Validation");
  const te = useTranslations("Errors");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeNewsletter, {});
  const emailError = state.fieldErrors?.email;
  const consentError = state.fieldErrors?.consent;

  return (
    <section aria-labelledby="newsletter-title">
      <h2 id="newsletter-title" className="text-sm font-semibold text-ink-900">{t("title")}</h2>
      <p className="mt-1 text-xs text-ink-600">{t("text")}</p>
      {state.ok ? (
        <div className="mt-2"><Alert tone="success">{t("success")}</Alert></div>
      ) : (
        <DirtyForm action={action} noValidate className="mt-2 space-y-2">
          {state.error ? <Alert>{te(state.error)}</Alert> : null}
          <input type="hidden" name="locale" value={locale} />
          <label htmlFor="newsletter-email" className="block text-xs font-medium text-ink-900">
            {t("email")} <span className="text-red-700" aria-hidden="true">*</span><span className="sr-only">({tc("required")})</span>
          </label>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "newsletter-email-error" : undefined}
          />
          {emailError ? <p id="newsletter-email-error" className="text-xs text-red-700">{tv(emailError)}</p> : null}
          <label className="flex items-start gap-2 text-xs text-ink-700">
            {/* Never pre-ticked: consent must be an explicit action. */}
            <input
              type="checkbox"
              name="consent"
              value="yes"
              className="mt-0.5 size-4 shrink-0"
              required
              aria-invalid={consentError ? true : undefined}
              aria-describedby={consentError ? "newsletter-consent-error" : undefined}
            />
            <span>{t("consent")}</span>
          </label>
          {consentError ? <p id="newsletter-consent-error" className="text-xs text-red-700">{tv(consentError)}</p> : null}
          <Button type="submit" variant="secondary" disabled={pending} className="min-h-9 py-1">
            {pending ? t("submitting") : t("submit")}
          </Button>
          <p className="text-xs text-ink-600">
            {t.rich("notice", { link: (chunks) => <Link href="/legal/privacy" className="underline">{chunks}</Link> })}
          </p>
        </DirtyForm>
      )}
    </section>
  );
}
