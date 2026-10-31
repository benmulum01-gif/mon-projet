"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { DirtyForm } from "@/components/dirty-form";
import { WorkspaceFields } from "@/components/app/workspace-fields";
import { Alert, Button } from "@/components/ui";
import type { FormState } from "@/lib/forms";
import { createWorkspace } from "./actions";

export function OnboardingForm() {
  const t = useTranslations("Onboarding");
  const te = useTranslations("Errors");
  const [state, action, pending] = useActionState<FormState, FormData>(createWorkspace, {});
  return (
    <DirtyForm action={action} noValidate className="space-y-6">
      {state.error ? <Alert>{te(state.error)}</Alert> : null}
      <WorkspaceFields errors={state.fieldErrors} />
      <Button type="submit" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>
    </DirtyForm>
  );
}
