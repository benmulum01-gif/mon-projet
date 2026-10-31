import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { ConfirmSubmit } from "@/components/app/confirm-submit";
import { VariantEditor } from "@/components/app/variant-editor";
import { Button, Card, PageHeader, Select } from "@/components/ui";
import { deleteVariant } from "@/lib/actions/automations";
import { requireAppContext } from "@/lib/app-context";
import { chooseVariant, renderTemplate, TEMPLATE_PLACEHOLDERS } from "@/lib/automations/render";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Automations"))("templatesTitle") };
}

export default async function TemplatePage({ params, searchParams }: PageProps<"/[locale]/app/automations/templates/[id]">) {
  const ctx = await requireAppContext();
  const { id } = await params;
  const sp = await searchParams;
  const t = await getTranslations("Automations");
  const tk = await getTranslations("TemplateKind");
  const tl = await getTranslations("Languages");
  const supabase = await createClient();
  const { data: template } = await supabase.from("message_templates").select("*, template_variants(*)").eq("id", id).maybeSingle();
  if (!template) notFound();
  const { data: leads } = await supabase.from("leads").select("id, full_name, company, preferred_locale").eq("workspace_id", ctx.workspace.id).order("full_name").limit(200);

  // Every communication language first, then any extra version that already exists.
  const shown: Locale[] = [
    ...ctx.workspace.comm_locales.filter(isLocale),
    ...locales.filter((l) => !ctx.workspace.comm_locales.includes(l) && template.template_variants.some((v) => v.locale === l)),
  ];
  const hasAnyVariant = template.template_variants.length > 0;

  const previewLead = leads?.find((l) => l.id === sp.lead);
  const preview = previewLead
    ? chooseVariant(template.template_variants, { leadLocale: previewLead.preferred_locale, workspaceDefault: ctx.workspace.default_comm_locale })
    : null;

  return (
    <>
      <p className="mb-3"><Link href="/app/automations" className="text-sm font-semibold text-brand-700 underline">{t("editor.back")}</Link></p>
      <PageHeader title={template.name} subtitle={t("editor.subtitle", { kind: tk(template.kind) })} />
      <p className="mb-4 text-sm text-ink-600">
        {t("editor.placeholders", { list: TEMPLATE_PLACEHOLDERS.map((p) => `{{${p}}}`).join(", ") })}
      </p>

      <div className="grid gap-6 xl:grid-cols-2">
        {shown.map((locale) => {
          const variant = template.template_variants.find((v) => v.locale === locale);
          return (
            <Card key={locale}>
              <h2 className="mb-3 text-lg font-semibold">{t("editor.versionTitle", { language: tl(locale) })}</h2>
              <VariantEditor
                templateId={template.id}
                locale={locale}
                initial={variant ? { subject: variant.subject, body: variant.body } : undefined}
                canDraftWithAi={hasAnyVariant && !variant}
              />
              {variant ? (
                <form action={deleteVariant} className="mt-4 border-t border-line pt-3">
                  <input type="hidden" name="templateId" value={template.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <ConfirmSubmit variant="ghost" message={t("editor.deleteConfirm")}>{t("editor.deleteVersion")}</ConfirmSubmit>
                </form>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">{t("preview.title")}</h2>
        {leads?.length ? (
          <form method="get" className="flex flex-wrap items-end gap-2">
            <div className="min-w-56">
              <label htmlFor="preview-lead" className="mb-1 block text-sm font-medium">{t("preview.lead")}</label>
              <Select id="preview-lead" name="lead" defaultValue={previewLead?.id ?? leads[0].id}>
                {leads.map((l) => <option key={l.id} value={l.id}>{l.full_name}</option>)}
              </Select>
            </div>
            <Button type="submit" variant="secondary">{t("preview.submit")}</Button>
          </form>
        ) : (
          <p className="text-sm text-ink-600">{t("preview.noLeads")}</p>
        )}
        {preview && previewLead ? (
          <div className="mt-4 rounded-md border border-line bg-surface p-3" role="status">
            {preview.ok ? (
              <>
                <p className="text-sm font-semibold">
                  {preview.reason === "recipient" ? t("preview.recipient", { language: tl(preview.locale) }) : t("preview.workspaceDefault", { language: tl(preview.locale) })}
                </p>
                <p lang={preview.locale} className="mt-2 whitespace-pre-wrap text-sm">
                  {renderTemplate(preview.variant.body, preview.locale, {
                    fullName: previewLead.full_name,
                    company: previewLead.company,
                    businessName: ctx.workspace.name,
                    timeZone: ctx.workspace.timezone,
                  })}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold">{t("preview.missing", { language: tl(preview.missing) })}</p>
            )}
          </div>
        ) : null}
      </Card>
    </>
  );
}
