import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isLocale } from "@/i18n/config";
import { Badge, buttonClass, EmptyState, PageHeader } from "@/components/ui";
import { requireAppContext } from "@/lib/app-context";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Conversations"))("title") };
}

export default async function ConversationsPage() {
  const ctx = await requireAppContext();
  const t = await getTranslations("Conversations");
  const tch = await getTranslations("Channel");
  const tl = await getTranslations("Languages");
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id, channel, locale, created_at, leads(full_name), messages(status)")
    .eq("workspace_id", ctx.workspace.id)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {!data?.length ? (
        <EmptyState title={t("emptyTitle")} text={t("emptyText")} action={<Link href="/app/leads" className={buttonClass("secondary")}>{(await getTranslations("AppNav"))("leads")}</Link>} />
      ) : (
        <div className="relative overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface text-ink-700">
              <tr>{(["lead", "channel", "language", "messages", "started"] as const).map((c) => <th key={c} scope="col" className="px-4 py-2 font-semibold">{t(`columns.${c}`)}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.map((c) => {
                const pending = c.messages.filter((m) => m.status === "pending_approval" || m.status === "draft").length;
                return (
                  <tr key={c.id}>
                    <td className="px-4 py-2"><Link href={`/app/conversations/${c.id}`} className="font-medium text-brand-700 hover:underline">{c.leads?.full_name}</Link></td>
                    <td className="px-4 py-2">{tch(c.channel)}</td>
                    <td className="px-4 py-2">{isLocale(c.locale) ? tl(c.locale) : t("detail.unknownLanguage")}</td>
                    <td className="px-4 py-2">
                      <span>{c.messages.length}</span>{" "}
                      {pending ? <Badge tone="warning">{t("toApprove", { count: pending })}</Badge> : null}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatDate(c.created_at, ctx.fmt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
