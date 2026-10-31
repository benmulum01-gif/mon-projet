import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { isLocale, locales } from "@/i18n/config";
import { AiPanel } from "@/components/app/ai-panel";
import { Composer } from "@/components/app/composer";
import { TranslateButton } from "@/components/app/translate-button";
import { Alert, Badge, Button, Card, PageHeader } from "@/components/ui";
import { addMessage, aiSuggestReply, deleteDraft, saveAiDraft, setMessageStatus } from "@/lib/actions/conversations";
import { defaultAiLocale } from "@/lib/ai/language";
import { requireAppContext } from "@/lib/app-context";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Conversations"))("title") };
}

export default async function ConversationPage({ params }: PageProps<"/[locale]/app/conversations/[id]">) {
  const ctx = await requireAppContext();
  const { id } = await params;
  const t = await getTranslations("Conversations");
  const tai = await getTranslations("Ai");
  const tch = await getTranslations("Channel");
  const tl = await getTranslations("Languages");
  const tms = await getTranslations("MessageStatus");
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("*, leads(id, full_name, company, preferred_locale), messages(*, message_translations(target_locale, body))")
    .eq("id", id)
    .order("created_at", { referencedTable: "messages" })
    .maybeSingle();
  if (!conversation?.leads) notFound();
  const lead = conversation.leads;

  const { data: templates } = await supabase
    .from("message_templates")
    .select("id, name, template_variants(locale, subject, body)")
    .eq("workspace_id", ctx.workspace.id)
    .order("name");

  const replyLocale = defaultAiLocale({
    purpose: "recipient",
    conversationLocale: conversation.locale,
    leadLocale: lead.preferred_locale,
    workspaceDefaultComm: ctx.workspace.default_comm_locale,
    uiLocale: ctx.locale,
  });
  const languageLabel = isLocale(conversation.locale) ? tl(conversation.locale) : t("detail.unknownLanguage");

  return (
    <>
      <p className="mb-3"><Link href="/app/conversations" className="text-sm font-semibold text-brand-700 underline">{t("detail.back")}</Link></p>
      <PageHeader
        title={t("detail.with", { name: lead.full_name })}
        subtitle={t("detail.meta", { channel: tch(conversation.channel), language: languageLabel })}
        actions={<Link href={`/app/leads/${lead.id}`} className="text-sm font-semibold text-brand-700 underline">{lead.full_name}</Link>}
      />
      <div className="mb-4"><Alert tone="info">{t("detail.approvalNote")}</Alert></div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          {conversation.messages.length ? (
            <ol className="space-y-4">
              {conversation.messages.map((m) => {
                const inbound = m.direction === "inbound";
                const otherLocales = locales.filter((l) => l !== m.locale);
                return (
                  <li key={m.id} className={cn("rounded-lg border p-4", inbound ? "border-line bg-white" : "border-brand-100 bg-brand-50")}>
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-ink-600">
                      <span className="font-semibold text-ink-900">{inbound ? t("detail.inbound") : t("detail.outbound")}</span>
                      <span>{formatDateTime(m.created_at, ctx.fmt)}</span>
                      <Badge tone={m.status === "pending_approval" ? "warning" : m.status === "sent" || m.status === "received" ? "neutral" : "brand"}>{tms(m.status)}</Badge>
                      {m.ai_generated ? <Badge>{t("detail.aiGenerated")}</Badge> : null}
                      {m.automation_id ? <Badge>{t("detail.fromAutomation")}</Badge> : null}
                    </div>
                    {/* Original content, never modified. */}
                    <p lang={m.locale ?? undefined} className="whitespace-pre-wrap text-sm text-ink-900">{m.body}</p>

                    {m.message_translations.map((tr) => (
                      <div key={tr.target_locale} className="mt-3 border-l-4 border-line pl-3">
                        <p className="text-xs font-semibold text-ink-600">{t("detail.translationLabel", { language: isLocale(tr.target_locale) ? tl(tr.target_locale) : tr.target_locale })}</p>
                        <p lang={tr.target_locale} className="whitespace-pre-wrap text-sm text-ink-700">{tr.body}</p>
                      </div>
                    ))}

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {otherLocales
                        .filter((l) => !m.message_translations.some((tr) => tr.target_locale === l))
                        .map((l) => <TranslateButton key={l} messageId={m.id} target={l} />)}
                      {!inbound && (m.status === "draft" || m.status === "pending_approval") ? (
                        <form action={setMessageStatus}>
                          <input type="hidden" name="messageId" value={m.id} />
                          <input type="hidden" name="status" value="approved" />
                          <Button type="submit" className="min-h-9 py-1">{t("detail.approve")}</Button>
                        </form>
                      ) : null}
                      {!inbound && m.status === "approved" ? (
                        <form action={setMessageStatus}>
                          <input type="hidden" name="messageId" value={m.id} />
                          <input type="hidden" name="status" value="sent" />
                          <Button type="submit" className="min-h-9 py-1">{t("detail.markSent")}</Button>
                        </form>
                      ) : null}
                      {!inbound && m.status !== "sent" ? (
                        <form action={deleteDraft}>
                          <input type="hidden" name="messageId" value={m.id} />
                          <Button type="submit" variant="ghost" className="min-h-9 py-1">{t("detail.discard")}</Button>
                        </form>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-sm text-ink-600">{t("detail.noMessages")}</p>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-lg font-semibold">{tai("title")}</h2>
            <AiPanel
              label={tai("suggestReply")}
              purpose="recipient"
              defaultLocale={replyLocale}
              run={aiSuggestReply.bind(null, conversation.id)}
              onUse={saveAiDraft.bind(null, conversation.id)}
              useLabel={tai("useAsDraft")}
            />
          </Card>
          <Card>
            <h2 className="mb-3 text-lg font-semibold">{t("composer.title")}</h2>
            <Composer
              action={addMessage.bind(null, conversation.id)}
              templates={(templates ?? []).map((tpl) => ({ id: tpl.id, name: tpl.name, variants: tpl.template_variants }))}
              conversationLocale={conversation.locale}
              leadLocale={lead.preferred_locale}
              workspaceDefault={ctx.workspace.default_comm_locale}
              templateData={{ fullName: lead.full_name, company: lead.company, businessName: ctx.workspace.name, timeZone: ctx.workspace.timezone }}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
