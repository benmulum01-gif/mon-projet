import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { requireAppContext } from "@/lib/app-context";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Analytics"))("title") };
}

export default async function AnalyticsPage() {
  const ctx = await requireAppContext();
  const t = await getTranslations("Analytics");
  const ts = await getTranslations("LeadStatus");
  const tsrc = await getTranslations("LeadSource");
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("status, source, value_cents").eq("workspace_id", ctx.workspace.id);
  const leads = data ?? [];
  const total = leads.length;
  const won = leads.filter((l) => l.status === "won");
  const closed = won.length + leads.filter((l) => l.status === "lost").length;

  const Bar = ({ ratio }: { ratio: number }) => (
    <div className="h-2 w-full rounded bg-surface" aria-hidden="true">
      <div className="h-2 rounded bg-brand-600" style={{ width: `${Math.round(ratio * 100)}%` }} />
    </div>
  );

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <dl className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4"><dt className="text-sm text-ink-600">{t("conversion")}</dt><dd className="mt-1 text-2xl font-bold">{closed ? formatPercent(won.length / closed, ctx.fmt) : "—"}</dd></Card>
        <Card className="p-4"><dt className="text-sm text-ink-600">{t("closed")}</dt><dd className="mt-1 text-2xl font-bold">{formatNumber(closed, ctx.fmt)}</dd></Card>
        <Card className="p-4"><dt className="text-sm text-ink-600">{t("wonValue")}</dt><dd className="mt-1 text-2xl font-bold">{formatMoney(won.reduce((s, l) => s + (l.value_cents ?? 0), 0), ctx.fmt)}</dd></Card>
      </dl>
      {!total ? (
        <p className="text-ink-600">{t("noData")}</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <table className="w-full text-left text-sm">
              <caption className="mb-3 text-left text-lg font-semibold">{t("byStatus")}</caption>
              <thead><tr><th scope="col" className="py-1">{t("stage")}</th><th scope="col" className="py-1 text-right">{t("count")}</th><th scope="col" className="py-1 pl-4">{t("share")}</th></tr></thead>
              <tbody>
                {LEAD_STATUSES.map((s) => {
                  const n = leads.filter((l) => l.status === s).length;
                  return (
                    <tr key={s}>
                      <th scope="row" className="py-1 font-normal">{ts(s)}</th>
                      <td className="py-1 text-right">{formatNumber(n, ctx.fmt)}</td>
                      <td className="w-1/2 py-1 pl-4"><div className="flex items-center gap-2"><Bar ratio={n / total} /><span className="w-14 shrink-0 text-right text-xs text-ink-600">{formatPercent(n / total, ctx.fmt)}</span></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
          <Card>
            <table className="w-full text-left text-sm">
              <caption className="mb-3 text-left text-lg font-semibold">{t("bySource")}</caption>
              <thead><tr><th scope="col" className="py-1">{t("source")}</th><th scope="col" className="py-1 text-right">{t("count")}</th><th scope="col" className="py-1 text-right">{t("sourceConversion")}</th></tr></thead>
              <tbody>
                {LEAD_SOURCES.map((s) => {
                  const rows = leads.filter((l) => l.source === s);
                  if (!rows.length) return null;
                  return (
                    <tr key={s}>
                      <th scope="row" className="py-1 font-normal">{tsrc(s)}</th>
                      <td className="py-1 text-right">{formatNumber(rows.length, ctx.fmt)}</td>
                      <td className="py-1 text-right">{formatNumber(rows.filter((l) => l.status === "won").length, ctx.fmt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </>
  );
}
