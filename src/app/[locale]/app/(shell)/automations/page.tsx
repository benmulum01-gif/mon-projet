import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isLocale } from "@/i18n/config";
import { AutomationForm, TemplateForm } from "@/components/app/automation-forms";
import { AutomationToggle } from "@/components/app/automation-toggle";
import { Badge, Card, PageHeader } from "@/components/ui";
import { requireAppContext } from "@/lib/app-context";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Automations"))("title") };
}

export default async function AutomationsPage() {
  const ctx = await requireAppContext();
  const t = await getTranslations("Automations");
  const tk = await getTranslations("TemplateKind");
  const ttr = await getTranslations("AutomationTrigger");
  const tch = await getTranslations("Channel");
  const tl = await getTranslations("Languages");
  const supabase = await createClient();
  const [{ data: templates }, { data: automations }] = await Promise.all([
    supabase.from("message_templates").select("id, name, kind, template_variants(locale)").eq("workspace_id", ctx.workspace.id).order("created_at"),
    supabase.from("automations").select("id, name, trigger, channel, is_active, template_id").eq("workspace_id", ctx.workspace.id).order("created_at"),
  ]);

  const commLocales = ctx.workspace.comm_locales.filter(isLocale);
  const missingFor = (templateId: string) => {
    const tpl = templates?.find((x) => x.id === templateId);
    const have = new Set(tpl?.template_variants.map((v) => v.locale));
    return commLocales.filter((l) => !have.has(l));
  };
  const names = (codes: string[]) => codes.filter(isLocale).map((c) => tl(c)).join(", ");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <Card>
            <h2 className="mb-3 text-lg font-semibold">{t("automationsTitle")}</h2>
            {automations?.length ? (
              <ul className="divide-y divide-line">
                {automations.map((a) => {
                  const missing = missingFor(a.template_id);
                  const tpl = templates?.find((x) => x.id === a.template_id);
                  return (
                    <li key={a.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-medium">{a.name}</p>
                        <p className="text-sm text-ink-600">{ttr(a.trigger)} · {tch(a.channel)} · {tpl?.name}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <Badge tone={a.is_active ? "success" : "neutral"}>{a.is_active ? t("active") : t("inactive")}</Badge>
                          {missing.length ? <Badge tone="warning">{t("needsAttention")} — {t("missing", { languages: names(missing) })}</Badge> : null}
                        </div>
                      </div>
                      <AutomationToggle id={a.id} name={a.name} active={a.is_active} canActivate={!missing.length} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-ink-600">{t("emptyAutomations")}</p>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">{t("templatesTitle")}</h2>
            <p className="mb-3 text-sm text-ink-600">{t("templatesSubtitle", { languages: names(commLocales) })}</p>
            {templates?.length ? (
              <ul className="divide-y divide-line">
                {templates.map((tpl) => {
                  const missing = missingFor(tpl.id);
                  return (
                    <li key={tpl.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-medium">{tpl.name}</p>
                        <p className="text-sm text-ink-600">{tk(tpl.kind)}</p>
                        <div className="mt-1">
                          {missing.length ? (
                            <Badge tone="warning">{t("missing", { languages: names(missing) })}</Badge>
                          ) : (
                            <Badge tone="success">{t("complete")}</Badge>
                          )}
                        </div>
                      </div>
                      <Link href={`/app/automations/templates/${tpl.id}`} className="text-sm font-semibold text-brand-700 underline">{t("editVersions")}</Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-ink-600">{t("emptyTemplates")}</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-lg font-semibold">{t("newTemplate")}</h2>
            <TemplateForm />
          </Card>
          <Card>
            <h2 className="mb-3 text-lg font-semibold">{t("newAutomation")}</h2>
            <AutomationForm templates={(templates ?? []).map((x) => ({ id: x.id, name: x.name }))} />
          </Card>
        </div>
      </div>
    </>
  );
}
