"use client";

import { useTranslations } from "next-intl";
import { useActionState, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { DirtyForm } from "@/components/dirty-form";
import { Alert, Button, Field, Select, Textarea } from "@/components/ui";
import { chooseVariant, renderTemplate, type TemplateData, type Variant } from "@/lib/automations/render";
import type { FormState } from "@/lib/forms";

type Template = { id: string; name: string; variants: Variant[] };

export function Composer({
  action,
  templates,
  conversationLocale,
  leadLocale,
  workspaceDefault,
  templateData,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  templates: Template[];
  conversationLocale: string | null;
  leadLocale: string | null;
  workspaceDefault: string;
  templateData: TemplateData;
}) {
  const t = useTranslations("Conversations.composer");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const te = useTranslations("Errors");
  const tl = useTranslations("Languages");
  const [body, setBody] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const result = await action(prev, formData);
    if (result.ok) {
      setBody("");
      if (formRef.current) formRef.current.dataset.dirty = "false";
    }
    return result;
  }, {});
  const [templateId, setTemplateId] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function insertTemplate() {
    const template = templates.find((tpl) => tpl.id === templateId);
    if (!template) return;
    const choice = chooseVariant(template.variants, { conversationLocale, leadLocale, workspaceDefault });
    if (!choice.ok) {
      setNotice(t("templateMissing", { language: tl(choice.missing) }));
      return;
    }
    setNotice(t("templateLanguage", { language: tl(choice.locale as Locale) }));
    setBody(renderTemplate(choice.variant.body, choice.locale, templateData));
    if (formRef.current) formRef.current.dataset.dirty = "true";
  }

  return (
    <DirtyForm ref={formRef} action={formAction} noValidate className="space-y-4">
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      <fieldset>
        <legend className="mb-1 text-sm font-medium">{t("type")}</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="radio" name="kind" value="inbound" defaultChecked className="size-4" />{t("inbound")}</label>
          <label className="flex items-center gap-2"><input type="radio" name="kind" value="draft" className="size-4" />{t("draft")}</label>
        </div>
      </fieldset>
      {templates.length ? (
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-56">
            <label htmlFor="template" className="mb-1 block text-sm font-medium">{t("insertTemplate")}</label>
            <Select id="template" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
              <option value="">{t("chooseTemplate")}</option>
              {templates.map((tpl) => <option key={tpl.id} value={tpl.id}>{tpl.name}</option>)}
            </Select>
          </div>
          <Button variant="secondary" onClick={insertTemplate} disabled={!templateId}>{t("insert")}</Button>
        </div>
      ) : null}
      {notice ? <p className="text-sm text-ink-600" role="status">{notice}</p> : null}
      <Field id="body" label={t("body")} error={state.fieldErrors?.body ? tv(state.fieldErrors.body) : undefined} required requiredLabel={tc("required")}>
        {(aria) => <Textarea {...aria} name="body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} maxLength={20000} />}
      </Field>
      <Button type="submit" disabled={pending}>{pending ? t("submitting") : t("submit")}</Button>
    </DirtyForm>
  );
}
