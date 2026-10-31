import { getTranslations } from "next-intl/server";
import { CheckoutButton, PortalButton } from "@/components/app/billing-buttons";
import { Alert, Badge, Card, PageHeader } from "@/components/ui";
import { plans, PRICING_CURRENCY } from "@/config/plans";
import { requireAppContext } from "@/lib/app-context";
import { formatDate, formatMoney } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Billing"))("title") };
}
const KNOWN_STATUSES = ["active", "trialing", "past_due", "canceled", "incomplete", "incomplete_expired", "unpaid", "paused"] as const;
type KnownStatus = (typeof KNOWN_STATUSES)[number];

export default async function BillingPage({ searchParams }: PageProps<"/[locale]/app/billing">) {
  const ctx = await requireAppContext();
  const t = await getTranslations("Billing");
  const tp = await getTranslations("Pricing");
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: sub } = await supabase.from("subscriptions").select("*").eq("workspace_id", ctx.workspace.id).maybeSingle();
  const canManage = ctx.role === "owner" || ctx.role === "admin";
  const status = KNOWN_STATUSES.includes(sub?.status as KnownStatus) ? (sub!.status as KnownStatus) : null;
  const live = status && !["canceled", "incomplete_expired"].includes(status);
  const planName = sub?.plan === "starter" || sub?.plan === "growth" ? tp(`plans.${sub.plan}.name`) : null;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {sp.checkout === "success" ? <div className="mb-4"><Alert tone="success">{t("success")}</Alert></div> : null}
      {sp.checkout === "canceled" ? <div className="mb-4"><Alert tone="info">{t("canceledCheckout")}</Alert></div> : null}
      {!canManage ? <div className="mb-4"><Alert tone="info">{t("ownerOnly")}</Alert></div> : null}

      <Card className="mb-6">
        <h2 className="text-lg font-semibold">{t("currentPlan")}</h2>
        {live ? (
          <div className="mt-2 space-y-2">
            <p className="text-xl font-bold">{planName}</p>
            <p className="flex flex-wrap items-center gap-2 text-sm">
              {t("status")}: <Badge tone={status === "active" || status === "trialing" ? "success" : "warning"}>{t(`statuses.${status}`)}</Badge>
            </p>
            {sub?.current_period_end ? (
              <p className="text-sm text-ink-600">
                {sub.cancel_at_period_end ? t("endsOn", { date: formatDate(sub.current_period_end, ctx.fmt) }) : t("renewsOn", { date: formatDate(sub.current_period_end, ctx.fmt) })}
              </p>
            ) : null}
            {canManage ? <PortalButton /> : null}
          </div>
        ) : (
          <p className="mt-2 text-ink-600">{t("noPlan")}</p>
        )}
      </Card>

      {!live && canManage ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <li key={plan.id}>
              <Card className="h-full">
                <h3 className="text-lg font-semibold">{tp(`plans.${plan.id}.name`)}</h3>
                <p className="text-sm text-ink-600">{tp(`plans.${plan.id}.description`)}</p>
                <p className="my-3 text-2xl font-bold">
                  {formatMoney(plan.monthlyCents, { locale: ctx.locale, currency: PRICING_CURRENCY })} <span className="text-sm font-normal text-ink-600">{tp("perMonth")}</span>
                </p>
                <CheckoutButton plan={plan.id} label={t("subscribe", { plan: tp(`plans.${plan.id}.name`) })} />
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-6 text-xs text-ink-600">{t("securePayment")}</p>
    </>
  );
}
