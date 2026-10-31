"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { DirtyForm } from "@/components/dirty-form";
import { Alert, Button, Field, Input, Select, Textarea } from "@/components/ui";
import { createAppointment } from "@/lib/actions/appointments";
import type { FormState } from "@/lib/forms";

export function AppointmentForm({ leads, defaultLeadId, timeZone }: { leads: { id: string; full_name: string }[]; defaultLeadId?: string; timeZone: string }) {
  const t = useTranslations("Appointments.form");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const te = useTranslations("Errors");
  const [state, action, pending] = useActionState<FormState, FormData>(createAppointment, {});
  const ref = useRef<HTMLFormElement>(null);
  const err = (f: string) => (state.fieldErrors?.[f] ? tv(state.fieldErrors[f]) : undefined);
  useEffect(() => {
    if (state.ok && ref.current) {
      ref.current.reset();
      ref.current.dataset.dirty = "false";
    }
  }, [state]);

  if (!leads.length) return <p className="text-sm text-ink-600">{t("noLeads")}</p>;

  return (
    <DirtyForm ref={ref} action={action} noValidate className="space-y-4">
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      {state.ok ? <Alert tone="success">{t("booked")}</Alert> : null}
      <Field id="leadId" label={t("lead")} error={err("leadId")} required requiredLabel={tc("required")}>
        {(aria) => (
          <Select {...aria} name="leadId" defaultValue={defaultLeadId ?? ""}>
            <option value="">{t("selectLead")}</option>
            {leads.map((l) => <option key={l.id} value={l.id}>{l.full_name}</option>)}
          </Select>
        )}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="startsAt" label={t("startsAt")} help={t("startsAtHelp", { timeZone })} error={err("startsAt")} required requiredLabel={tc("required")}>
          {(aria) => <Input {...aria} name="startsAt" type="datetime-local" />}
        </Field>
        <Field id="duration" label={t("duration")} error={err("duration")}>
          {(aria) => <Input {...aria} name="duration" type="number" min={5} max={600} step={5} defaultValue={30} />}
        </Field>
      </div>
      <Field id="location" label={t("location")} error={err("location")} optionalLabel={tc("optional")}>
        {(aria) => <Input {...aria} name="location" maxLength={300} />}
      </Field>
      <Field id="notes" label={t("notes")} error={err("notes")} optionalLabel={tc("optional")}>
        {(aria) => <Textarea {...aria} name="notes" rows={3} maxLength={2000} />}
      </Field>
      <Button type="submit" disabled={pending}>{pending ? t("submitting") : t("submit")}</Button>
    </DirtyForm>
  );
}
