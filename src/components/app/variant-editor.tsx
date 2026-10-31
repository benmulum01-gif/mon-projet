"use client";

import { useTranslations } from "next-intl";
import { useActionState, useRef, useState, useTransition } from "react";
import type { Locale } from "@/i18n/config";
import { DirtyForm } from "@/components/dirty-form";
import { Alert, Button, Field, Input, Textarea } from "@/components/ui";
import { aiDraftVariant, saveVariant } from "@/lib/actions/automations";
import type { ErrorCode, FormState } from "@/lib/forms";

export function VariantEditor({
  templateId,
  locale,
  initial,
  canDraftWithAi,
}: {
  templateId: string;
  locale: Locale;
  initial?: { subject: string | null; body: string };
  canDraftWithAi: boolean;
}) {
  const t = useTranslations("Automations.editor");
  const tai = useTranslations("Ai");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const te = useTranslations("Errors");
  const tl = useTranslations("Languages");
  const [state, action, pending] = useActionState<FormState, FormData>(saveVariant.bind(null, templateId, locale), {});
  const [body, setBody] = useState(initial?.body ?? "");
  const [aiError, setAiError] = useState<ErrorCode | null>(null);
  const [drafting, startDraft] = useTransition();
  const ref = useRef<HTMLFormElement>(null);
  const language = tl(locale);
  const id = `v-${locale}`;

  return (
    <DirtyForm ref={ref} action={action} noValidate className="space-y-4" lang={locale}>
      {!initial ? <Alert tone="warning">{t("missingVersion")}</Alert> : null}
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      {state.ok ? <Alert tone="success">{t("saved")}</Alert> : null}
      {aiError ? <Alert>{te(aiError)}</Alert> : null}
      <Field id={`${id}-subject`} label={t("subject")} error={state.fieldErrors?.subject ? tv(state.fieldErrors.subject) : undefined} optionalLabel={tc("optional")}>
        {(aria) => <Input {...aria} name="subject" defaultValue={initial?.subject ?? ""} maxLength={200} />}
      </Field>
      <Field id={`${id}-body`} label={t("body")} error={state.fieldErrors?.body ? tv(state.fieldErrors.body) : undefined} required requiredLabel={tc("required")}>
        {(aria) => <Textarea {...aria} name="body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} maxLength={5000} />}
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>{pending ? tc("saving") : t("save", { language })}</Button>
        {canDraftWithAi ? (
          <Button
            variant="secondary"
            disabled={drafting}
            onClick={() =>
              startDraft(async () => {
                setAiError(null);
                const r = await aiDraftVariant(templateId, locale);
                if (r.ok) {
                  setBody(r.text);
                  if (ref.current) ref.current.dataset.dirty = "true";
                } else setAiError(r.error);
              })
            }
          >
            {drafting ? tai("generating") : tai("draftVariant")}
          </Button>
        ) : null}
      </div>
    </DirtyForm>
  );
}
