import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button, PageHeader, Select } from "@/components/ui";
import { setLeadStatus } from "@/lib/actions/leads";
import { requireAppContext } from "@/lib/app-context";
import { formatMoney } from "@/lib/format";
import { LEAD_STATUSES } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Pipeline"))("title") };
}

export default async function PipelinePage() {
  const ctx = await requireAppContext();
  const t = await getTranslations("Pipeline");
  const ts = await getTranslations("LeadStatus");
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("id, full_name, company, status, value_cents")
    .eq("workspace_id", ctx.workspace.id)
    .order("updated_at", { ascending: false })
    .limit(500);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {LEAD_STATUSES.map((status) => {
          const column = (leads ?? []).filter((l) => l.status === status);
          const value = column.reduce((sum, l) => sum + (l.value_cents ?? 0), 0);
          return (
            <section key={status} aria-labelledby={`col-${status}`} className="min-w-0 rounded-lg border border-line bg-white">
              <header className="border-b border-line px-3 py-2">
                <h2 id={`col-${status}`} className="font-semibold">{ts(status)}</h2>
                <p className="text-xs text-ink-600">{t("count", { count: column.length })} · {formatMoney(value, ctx.fmt)}</p>
              </header>
              {column.length ? (
                <ul className="space-y-2 p-3">
                  {column.map((lead) => (
                    <li key={lead.id} className="rounded-md border border-line bg-surface p-3">
                      <Link href={`/app/leads/${lead.id}`} className="font-medium text-brand-700 hover:underline">{lead.full_name}</Link>
                      {lead.company ? <p className="text-xs text-ink-600">{lead.company}</p> : null}
                      <form action={setLeadStatus} className="mt-2 flex flex-wrap gap-2">
                        <input type="hidden" name="leadId" value={lead.id} />
                        <label htmlFor={`stage-${lead.id}`} className="sr-only">{t("moveLabel", { name: lead.full_name })}</label>
                        <Select id={`stage-${lead.id}`} name="status" defaultValue={lead.status} className="min-h-9 flex-1 py-1">
                          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{ts(s)}</option>)}
                        </Select>
                        <Button type="submit" variant="secondary" className="min-h-9 py-1">{t("move")}</Button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-3 text-sm text-ink-600">{t("emptyColumn")}</p>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
