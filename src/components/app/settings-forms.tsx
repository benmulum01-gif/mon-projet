"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { locales } from "@/i18n/config";
import { DirtyForm } from "@/components/dirty-form";
import { WorkspaceFields } from "@/components/app/workspace-fields";
import { Alert, Button, Field, Input, Select } from "@/components/ui";
import { saveProfile, saveWorkspace } from "@/lib/actions/settings";
import type { FormState } from "@/lib/forms";
import { localeNames } from "@/i18n/config";

export function ProfileForm({ fullName, savedNotice }: { fullName: string | null; savedNotice: boolean }) {
  const t = useTranslations("Settings");
  const tc = useTranslations("Common");
  const te = useTranslations("Errors");
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(saveProfile, {});
  return (
    <DirtyForm action={action} noValidate className="space-y-4">
      {savedNotice ? <Alert tone="success">{t("saved")}</Alert> : null}
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      <Field id="fullName" label={t("fullName")} optionalLabel={tc("optional")}>
        {(aria) => <Input {...aria} name="fullName" defaultValue={fullName ?? ""} maxLength={200} autoComplete="name" />}
      </Field>
      <Field id="uiLocale" label={t("uiLocale")} help={t("uiLocaleHelp")}>
        {(aria) => (
          <Select {...aria} name="uiLocale" defaultValue={locale}>
            {locales.map((l) => <option key={l} value={l} lang={l}>{localeNames[l]}</option>)}
          </Select>
        )}
      </Field>
      <Button type="submit" disabled={pending}>{pending ? tc("saving") : t("saveProfile")}</Button>
    </DirtyForm>
  );
}

export function WorkspaceForm({
  defaults,
  internalAiLocale,
  canEdit,
}: {
  defaults: { name: string; defaultCommLocale: string; commLocales: string[]; timezone: string; currency: string };
  internalAiLocale: string | null;
  canEdit: boolean;
}) {
  const t = useTranslations("Settings");
  const tc = useTranslations("Common");
  const te = useTranslations("Errors");
  const tl = useTranslations("Languages");
  const [state, action, pending] = useActionState<FormState, FormData>(saveWorkspace, {});
  if (!canEdit) return <Alert tone="info">{t("adminOnly")}</Alert>;
  return (
    <DirtyForm action={action} noValidate className="space-y-5">
      {state.ok ? <Alert tone="success">{t("saved")}</Alert> : null}
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      <WorkspaceFields defaults={defaults} errors={state.fieldErrors} />
      <Field id="internalAiLocale" label={t("internalAiLocale")} help={t("internalAiLocaleHelp")}>
        {(aria) => (
          <Select {...aria} name="internalAiLocale" defaultValue={internalAiLocale ?? ""}>
            <option value="">{t("sameAsInterface")}</option>
            {locales.map((l) => <option key={l} value={l}>{tl(l)}</option>)}
          </Select>
        )}
      </Field>
      <Button type="submit" disabled={pending}>{pending ? tc("saving") : t("saveWorkspace")}</Button>
    </DirtyForm>
  );
}
