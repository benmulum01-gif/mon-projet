import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge, buttonClass, Card, EmptyState, PageHeader } from "@/components/ui";
import { requireAppContext } from "@/lib/app-context";
import { formatDate, formatDateTime, formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { STATUS_TONE } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Overview");
  return { title: t("title") };
}

export default async function OverviewPage() {
  const ctx = await requireAppContext();
  const t = await getTranslations("Overview");
  const ts = await getTranslations("LeadStatus");
  const supabase = await createClient();
  const ws = ctx.workspace.id;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();

  const [leads, recent, upcoming, pending] = await Promise.all([
    supabase.from("leads").select("status, value_cents, created_at").eq("workspace_id", ws),
    supabase.from("leads").select("id, full_name, company, status, created_at").eq("workspace_id", ws).order("created_at", { ascending: false }).limit(5),
    supabase.from("appointments").select("id, starts_at, leads(full_name)").eq("workspace_id", ws).eq("status", "scheduled").gte("starts_at", now.toISOString()).order("starts_at").limit(5),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("workspace_id", ws).eq("status", "pending_approval"),
  ]);

  const all = leads.data ?? [];
  const won = all.filter((l) => l.status === "won").length;
  const lost = all.filter((l) => l.status === "lost").length;
  const openValue = all.filter((l) => l.status !== "won" && l.status !== "lost").reduce((sum, l) => sum + (l.value_cents ?? 0), 0);
  const metrics = [
    { key: "totalLeads", value: formatNumber(all.length, ctx.fmt) },
    { key: "newThisWeek", value: formatNumber(all.filter((l) => l.created_at >= weekAgo).length, ctx.fmt) },
    { key: "conversionRate", value: won + lost ? formatPercent(won / (won + lost), ctx.fmt) : "—", help: t("metrics.conversionHelp") },
    { key: "pipelineValue", value: formatMoney(openValue, ctx.fmt) },
    { key: "upcomingAppointments", value: formatNumber(upcoming.data?.length ?? 0, ctx.fmt) },
    { key: "pendingApprovals", value: formatNumber(pending.count ?? 0, ctx.fmt) },
  ] as const;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} actions={<Link href="/app/leads/new" className={buttonClass()}>{t("addLead")}</Link>} />
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.key} className="rounded-lg border border-line bg-white p-4">
            <dt className="text-sm text-ink-600">{t(`metrics.${m.key}`)}</dt>
            <dd className="mt-1 text-2xl font-bold text-ink-900">{m.value}</dd>
            {"help" in m ? <dd className="mt-1 text-xs text-ink-600">{m.help}</dd> : null}
          </div>
        ))}
      </dl>
      {(pending.count ?? 0) > 0 ? (
        <p className="mt-4">
          <Link href="/app/conversations" className="font-semibold text-brand-700 underline">{t("reviewApprovals")}</Link>
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">{t("recentLeads")}</h2>
            <Link href="/app/leads" className="text-sm font-semibold text-brand-700 underline">{t("viewAll")}</Link>
          </div>
          {recent.data?.length ? (
            <ul className="divide-y divide-line">
              {recent.data.map((lead) => (
                <li key={lead.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <Link href={`/app/leads/${lead.id}`} className="font-medium text-ink-900 hover:underline">{lead.full_name}</Link>
                    <p className="text-xs text-ink-600">{[lead.company, formatDate(lead.created_at, ctx.fmt)].filter(Boolean).join(" · ")}</p>
                  </div>
                  <Badge tone={STATUS_TONE[lead.status]}>{ts(lead.status)}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title={t("noLeadsTitle")} text={t("noLeadsText")} action={<Link href="/app/leads/new" className={buttonClass()}>{t("addLead")}</Link>} />
          )}
        </Card>
        <Card>
          <h2 className="mb-3 text-lg font-semibold">{t("upcoming")}</h2>
          {upcoming.data?.length ? (
            <ul className="divide-y divide-line">
              {upcoming.data.map((a) => (
                <li key={a.id} className="py-2">
                  <p className="font-medium">{a.leads?.full_name}</p>
                  <p className="text-sm text-ink-600">{formatDateTime(a.starts_at, ctx.fmt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-600">{t("noUpcoming")}</p>
          )}
        </Card>
      </div>
    </>
  );
}
