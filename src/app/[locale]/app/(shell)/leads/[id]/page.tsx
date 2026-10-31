import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { isLocale, locales } from "@/i18n/config";
import { AiPanel } from "@/components/app/ai-panel";
import { ConfirmSubmit } from "@/components/app/confirm-submit";
import { LeadForm } from "@/components/app/lead-form";
import { Alert, Badge, Button, buttonClass, Card, PageHeader, Select } from "@/components/ui";
import { aiSummarizeLead, startConversation } from "@/lib/actions/conversations";
import { deleteLead, updateLead } from "@/lib/actions/leads";
import { defaultAiLocale } from "@/lib/ai/language";
import { requireAppContext } from "@/lib/app-context";
import { formatDateTime } from "@/lib/format";
import { CHANNELS, STATUS_TONE } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: PageProps<"/[locale]/app/leads/[id]">): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("full_name").eq("id", (await params).id).maybeSingle();
  return { title: data?.full_name ?? (await getTranslations("Leads"))("title") };
}

export default async function LeadPage({ params, searchParams }: PageProps<"/[locale]/app/leads/[id]">) {
  const ctx = await requireAppContext();
  const { id } = await params;
  const sp = await searchParams;
  const t = await getTranslations("Leads");
  const tconv = await getTranslations("Conversations");
  const tai = await getTranslations("Ai");
  const ts = await getTranslations("LeadStatus");
  const tch = await getTranslations("Channel");
  const tl = await getTranslations("Languages");
  const tas = await getTranslations("AppointmentStatus");
  const supabase = await createClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("*, conversations(id, channel, locale, created_at, messages(count)), appointments(id, starts_at, status)")
    .eq("id", id)
    .maybeSingle();
  if (!lead) notFound();

  const summaryLocale = defaultAiLocale({
    purpose: "internal",
    workspaceDefaultComm: ctx.workspace.default_comm_locale,
    workspaceInternalAi: ctx.workspace.internal_ai_locale,
    uiLocale: ctx.locale,
  });

  return (
    <>
      <p className="mb-3"><Link href="/app/leads" className="text-sm font-semibold text-brand-700 underline">{t("detail.back")}</Link></p>
      <PageHeader title={lead.full_name} subtitle={lead.company ?? undefined} actions={<Badge tone={STATUS_TONE[lead.status]}>{ts(lead.status)}</Badge>} />
      {sp.created ? <div className="mb-4"><Alert tone="success">{t("detail.created")}</Alert></div> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">{t("detail.edit")}</h2>
          <LeadForm action={updateLead.bind(null, lead.id)} lead={lead} currency={ctx.workspace.currency} />
          <form action={deleteLead} className="mt-6 border-t border-line pt-4">
            <input type="hidden" name="leadId" value={lead.id} />
            <ConfirmSubmit variant="danger" message={t("detail.deleteConfirm")}>{t("detail.delete")}</ConfirmSubmit>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-lg font-semibold">{tai("title")}</h2>
            <AiPanel label={tai("summarize")} purpose="internal" defaultLocale={summaryLocale} run={aiSummarizeLead.bind(null, lead.id)} />
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-semibold">{t("detail.conversations")}</h2>
            {lead.conversations.length ? (
              <ul className="mb-4 divide-y divide-line">
                {lead.conversations.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                    <Link href={`/app/conversations/${c.id}`} className="font-medium text-brand-700 hover:underline">
                      {tch(c.channel)} · {isLocale(c.locale) ? tl(c.locale) : tconv("detail.unknownLanguage")}
                    </Link>
                    <span className="text-ink-600">{t("detail.messagesCount", { count: c.messages[0]?.count ?? 0 })}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-sm text-ink-600">{t("detail.noConversations")}</p>
            )}
            <form action={startConversation} className="grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <div>
                <label htmlFor="channel" className="mb-1 block text-sm font-medium">{tconv("new.channel")}</label>
                <Select id="channel" name="channel" defaultValue="email">
                  {CHANNELS.map((c) => <option key={c} value={c}>{tch(c)}</option>)}
                </Select>
              </div>
              <div>
                <label htmlFor="conv-locale" className="mb-1 block text-sm font-medium">{tconv("new.language")}</label>
                <Select id="conv-locale" name="locale" defaultValue="" aria-describedby="conv-locale-help">
                  <option value="">{tconv("new.sameAsLead")}</option>
                  {locales.map((l) => <option key={l} value={l}>{tl(l)}</option>)}
                </Select>
              </div>
              <p id="conv-locale-help" className="text-xs text-ink-600 sm:col-span-2">{tconv("new.languageHelp")}</p>
              <div className="sm:col-span-2"><Button type="submit" variant="secondary">{tconv("new.submit")}</Button></div>
            </form>
          </Card>

          <Card>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{t("detail.appointments")}</h2>
              <Link href={{ pathname: "/app/appointments", query: { lead: lead.id } }} className={buttonClass("secondary")}>{t("detail.bookAppointment")}</Link>
            </div>
            {lead.appointments.length ? (
              <ul className="divide-y divide-line text-sm">
                {lead.appointments.map((a) => (
                  <li key={a.id} className="flex flex-wrap justify-between gap-2 py-2">
                    <span>{formatDateTime(a.starts_at, ctx.fmt)}</span>
                    <span className="text-ink-600">{tas(a.status)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-600">{t("detail.noAppointments")}</p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
