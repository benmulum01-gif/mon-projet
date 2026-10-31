"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { workspaceInput, workspaceSchema } from "@/lib/actions/workspace-schema";
import { fieldErrorsFrom, type FormState } from "@/lib/forms";
import { createClient } from "@/lib/supabase/server";

export async function createWorkspace(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = workspaceSchema.safeParse(workspaceInput(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_workspace", {
    p_name: parsed.data.name,
    p_default_comm_locale: parsed.data.defaultCommLocale,
    p_comm_locales: parsed.data.commLocales,
    p_timezone: parsed.data.timezone,
    p_currency: parsed.data.currency,
  });
  if (error) return { error: "generic", nonce: Date.now() };
  redirect(`/${await getLocale()}/app`);
}
