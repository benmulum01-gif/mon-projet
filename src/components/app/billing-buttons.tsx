"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Alert, Button } from "@/components/ui";
import { openBillingPortal, startCheckout } from "@/lib/actions/billing";
import type { FormState } from "@/lib/forms";

export function CheckoutButton({ plan, label }: { plan: string; label: string }) {
  const t = useTranslations("Billing");
  const te = useTranslations("Errors");
  const [state, action, pending] = useActionState<FormState, FormData>(startCheckout, {});
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="plan" value={plan} />
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      <Button type="submit" disabled={pending} className="w-full">{pending ? t("redirecting") : label}</Button>
    </form>
  );
}

export function PortalButton() {
  const t = useTranslations("Billing");
  const te = useTranslations("Errors");
  const [state, action, pending] = useActionState<FormState>(openBillingPortal, {});
  return (
    <form action={action} className="space-y-2">
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      <Button type="submit" variant="secondary" disabled={pending}>{pending ? t("redirecting") : t("manage")}</Button>
    </form>
  );
}
