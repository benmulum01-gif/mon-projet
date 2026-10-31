"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Alert, Button } from "@/components/ui";
import { unsubscribeNewsletter } from "@/lib/actions/newsletter";
import type { FormState } from "@/lib/forms";

/** A POST button (not a GET link) so that link previews cannot unsubscribe people. */
export function UnsubscribeForm({ token }: { token: string }) {
  const t = useTranslations("Newsletter");
  const [state, action, pending] = useActionState<FormState, FormData>(unsubscribeNewsletter, {});
  if (state.ok) return <Alert tone="success">{t("unsubscribed")}</Alert>;
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert>{t("invalidLink")}</Alert> : null}
      <input type="hidden" name="token" value={token} />
      <p className="text-ink-700">{t("unsubscribeText")}</p>
      <Button type="submit" disabled={pending}>{t("unsubscribeButton")}</Button>
    </form>
  );
}
