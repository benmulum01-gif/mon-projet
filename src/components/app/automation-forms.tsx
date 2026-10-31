"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { DirtyForm } from "@/components/dirty-form";
import { Alert, Button, Field, Input, Select } from "@/components/ui";
import { createAutomation, createTemplate } from "@/lib/actions/automations";
import type { FormState } from "@/lib/forms";
import { AUTOMATION_TRIGGERS, CHANNELS, TEMPLATE_KINDS } from "@/lib/labels";

export function TemplateForm() {
  const t = useTranslations("Automations.form");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const te = useTranslations("Errors");
  const tk = useTranslations("TemplateKind");
  const [state, action, pending] = useActionState<FormState, FormData>(createTemplate, {});
  return (
    <DirtyForm action={action} noValidate className="space-y-4">
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      <Field id="tpl-name" label={t("name")} error={state.fieldErrors?.name ? tv(state.fieldErrors.name) : undefined} required requiredLabel={tc("required")}>
        {(aria) => <Input {...aria} name="name" maxLength={120} />}
      </Field>
      <Field id="tpl-kind" label={t("kind")}>
        {(aria) => (
          <Select {...aria} name="kind" defaultValue="initial_contact">
            {TEMPLATE_KINDS.map((k) => <option key={k} value={k}>{tk(k)}</option>)}
          </Select>
        )}
      </Field>
      <Button type="submit" disabled={pending}>{pending ? t("creating") : t("createTemplate")}</Button>
    </DirtyForm>
  );
}

export function AutomationForm({ templates }: { templates: { id: string; name: string }[] }) {
  const t = useTranslations("Automations.form");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const te = useTranslations("Errors");
  const ttr = useTranslations("AutomationTrigger");
  const tch = useTranslations("Channel");
  const tsv = useTranslations("Common");
  const [state, action, pending] = useActionState<FormState, FormData>(createAutomation, {});
  const err = (f: string) => (state.fieldErrors?.[f] ? tv(state.fieldErrors[f]) : undefined);
  if (!templates.length) return <p className="text-sm text-ink-600">{t("needTemplate")}</p>;
  return (
    <DirtyForm action={action} noValidate className="space-y-4">
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      {state.ok ? <Alert tone="success">{tsv("saved")}</Alert> : null}
      <Field id="auto-name" label={t("name")} error={err("name")} required requiredLabel={tc("required")}>
        {(aria) => <Input {...aria} name="name" maxLength={120} />}
      </Field>
      <Field id="auto-trigger" label={t("trigger")} error={err("trigger")}>
        {(aria) => (
          <Select {...aria} name="trigger" defaultValue="lead_created">
            {AUTOMATION_TRIGGERS.map((k) => <option key={k} value={k}>{ttr(k)}</option>)}
          </Select>
        )}
      </Field>
      <Field id="auto-template" label={t("template")} error={err("templateId")}>
        {(aria) => (
          <Select {...aria} name="templateId" defaultValue={templates[0].id}>
            {templates.map((tpl) => <option key={tpl.id} value={tpl.id}>{tpl.name}</option>)}
          </Select>
        )}
      </Field>
      <Field id="auto-channel" label={t("channel")} error={err("channel")}>
        {(aria) => (
          <Select {...aria} name="channel" defaultValue="email">
            {CHANNELS.map((c) => <option key={c} value={c}>{tch(c)}</option>)}
          </Select>
        )}
      </Field>
      <p className="text-xs text-ink-600">{t("createdInactive")}</p>
      <Button type="submit" disabled={pending}>{pending ? t("creating") : t("createAutomation")}</Button>
    </DirtyForm>
  );
}
