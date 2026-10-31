import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge, buttonClass, EmptyState, Input, PageHeader, Select } from "@/components/ui";
import { requireAppContext } from "@/lib/app-context";
import { formatDate, formatMoney } from "@/lib/format";
import { LEAD_SOURCES, LEAD_STATUSES, STATUS_TONE, type LeadSource, type LeadStatus } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";
import { isLocale } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Leads"))("title") };
}

const PAGE_SIZE = 25;

export default async function LeadsPage({ searchParams }: PageProps<"/[locale]/app/leads">) {
  const ctx = await requireAppContext();
  const t = await getTranslations("Leads");
  const tc = await getTranslations("Common");
  const ts = await getTranslations("LeadStatus");
  const tsrc = await getTranslations("LeadSource");
  const tl = await getTranslations("Languages");
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const status = LEAD_STATUSES.includes(sp.status as LeadStatus) ? (sp.status as LeadStatus) : "";
  const source = LEAD_SOURCES.includes(sp.source as LeadSource) ? (sp.source as LeadSource) : "";
  const page = Math.max(1, Number.parseInt(String(sp.page ?? "1"), 10) || 1);

  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("id, full_name, company, email, phone, status, source, preferred_locale, value_cents, created_at", { count: "exact" })
    .eq("workspace_id", ctx.workspace.id)
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (q) {
    const safe = q.replace(/[%_,()*\\]/g, " ");
    query = query.or(`full_name.ilike.%${safe}%,email.ilike.%${safe}%,company.ilike.%${safe}%`);
  }
  const { data: leads, count } = await query;
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = Boolean(q || status || source);
  const pageHref = (p: number) => ({ pathname: "/app/leads", query: { ...(q && { q }), ...(status && { status }), ...(source && { source }), page: String(p) } });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} actions={<Link href="/app/leads/new" className={buttonClass()}>{t("add")}</Link>} />

      <form method="get" role="search" className="mb-4 grid gap-3 rounded-lg border border-line bg-white p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
        <div>
          <label htmlFor="q" className="mb-1 block text-sm font-medium">{t("search")}</label>
          <Input id="q" name="q" type="search" defaultValue={q} placeholder={t("searchPlaceholder")} />
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">{t("status")}</label>
          <Select id="status" name="status" defaultValue={status}>
            <option value="">{t("allStatuses")}</option>
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{ts(s)}</option>)}
          </Select>
        </div>
        <div>
          <label htmlFor="source" className="mb-1 block text-sm font-medium">{t("source")}</label>
          <Select id="source" name="source" defaultValue={source}>
            <option value="">{t("allSources")}</option>
            {LEAD_SOURCES.map((s) => <option key={s} value={s}>{tsrc(s)}</option>)}
          </Select>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <button type="submit" className={buttonClass("secondary")}>{t("apply")}</button>
          {filtered ? <Link href="/app/leads" className={buttonClass("ghost")}>{t("clearFilters")}</Link> : null}
        </div>
      </form>

      <p className="mb-2 text-sm text-ink-600" role="status">{t("results", { count: total })}</p>

      {!leads?.length ? (
        filtered ? (
          <EmptyState title={t("emptyFiltered")} action={<Link href="/app/leads" className={buttonClass("secondary")}>{t("clearFilters")}</Link>} />
        ) : (
          <EmptyState title={t("emptyTitle")} text={t("emptyText")} action={<Link href="/app/leads/new" className={buttonClass()}>{t("add")}</Link>} />
        )
      ) : (
        <div className="relative overflow-x-auto rounded-lg border border-line bg-white" tabIndex={0} role="region" aria-label={t("title")}>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-surface text-ink-700">
              <tr>
                {(["name", "contact", "status", "source", "language", "value", "created"] as const).map((c) => (
                  <th key={c} scope="col" className="px-4 py-2 font-semibold">{t(`columns.${c}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-2">
                    <Link href={`/app/leads/${lead.id}`} className="font-medium text-brand-700 hover:underline">{lead.full_name}</Link>
                    {lead.company ? <p className="text-xs text-ink-600">{lead.company}</p> : null}
                  </td>
                  <td className="px-4 py-2 text-ink-700">
                    <span className="block break-all">{lead.email ?? ""}</span>
                    <span className="block">{lead.phone ?? ""}</span>
                  </td>
                  <td className="px-4 py-2"><Badge tone={STATUS_TONE[lead.status]}>{ts(lead.status)}</Badge></td>
                  <td className="px-4 py-2">{tsrc(lead.source)}</td>
                  <td className="px-4 py-2">{isLocale(lead.preferred_locale) ? tl(lead.preferred_locale) : tc("notSet")}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{lead.value_cents != null ? formatMoney(lead.value_cents, ctx.fmt) : "—"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatDate(lead.created_at, ctx.fmt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 ? (
        <nav aria-label={tc("pageOf", { page, total: pages })} className="mt-4 flex items-center justify-between gap-2 text-sm">
          {page > 1 ? <Link href={pageHref(page - 1)} className={buttonClass("secondary")}>{tc("previous")}</Link> : <span />}
          <span>{tc("pageOf", { page, total: pages })}</span>
          {page < pages ? <Link href={pageHref(page + 1)} className={buttonClass("secondary")}>{tc("next")}</Link> : <span />}
        </nav>
      ) : null}
    </>
  );
}
