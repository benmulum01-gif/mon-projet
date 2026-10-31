"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isLocale, type Locale } from "@/i18n/config";
import { draftTemplateVariant, type AiResult } from "@/lib/ai/claude";
import { requireAppContext } from "@/lib/app-context";
import { fieldErrorsFrom, optionalText, requiredText, type FormState } from "@/lib/forms";
import { AUTOMATION_TRIGGERS, CHANNELS, TEMPLATE_KINDS } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

export async function createTemplate(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  const parsed = z
    .object({ name: requiredText(120), kind: z.enum(TEMPLATE_KINDS, "invalidChoice") })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("message_templates")
    .insert({ workspace_id: ctx.workspace.id, name: parsed.data.name, kind: parsed.data.kind })
    .select("id")
    .single();
  if (error || !data) return { error: "generic", nonce: Date.now() };
  redirect(`/${ctx.locale}/app/automations/templates/${data.id}`);
}

export async function saveVariant(templateId: string, locale: Locale, _prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  if (!isLocale(locale)) return { error: "generic" };
  const parsed = z
    .object({ subject: optionalText(200), body: requiredText(5000) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const supabase = await createClient();
  const { error } = await supabase
    .from("template_variants")
    .upsert(
      { workspace_id: ctx.workspace.id, template_id: templateId, locale, subject: parsed.data.subject, body: parsed.data.body },
      { onConflict: "template_id,locale" },
    );
  if (error) return { error: "generic", nonce: Date.now() };
  revalidatePath(`/${ctx.locale}/app/automations`, "layout");
  return { ok: true, nonce: Date.now() };
}

export async function deleteVariant(formData: FormData) {
  const ctx = await requireAppContext();
  const parsed = z.object({ templateId: z.uuid(), locale: z.string().refine(isLocale) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClient();
  await supabase.from("template_variants").delete().eq("template_id", parsed.data.templateId).eq("locale", parsed.data.locale);
  revalidatePath(`/${ctx.locale}/app/automations`, "layout");
}

export async function aiDraftVariant(templateId: string, targetLocale: Locale): Promise<AiResult> {
  await requireAppContext();
  if (!isLocale(targetLocale)) return { ok: false, error: "generic" };
  const supabase = await createClient();
  const { data: source } = await supabase
    .from("template_variants")
    .select("body")
    .eq("template_id", templateId)
    .neq("locale", targetLocale)
    .limit(1)
    .maybeSingle();
  if (!source) return { ok: false, error: "generic" };
  return draftTemplateVariant({ body: source.body, targetLocale });
}

export async function createAutomation(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  const parsed = z
    .object({
      name: requiredText(120),
      trigger: z.enum(AUTOMATION_TRIGGERS, "invalidChoice"),
      templateId: z.uuid("required"),
      channel: z.enum(CHANNELS, "invalidChoice"),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const supabase = await createClient();
  const { error } = await supabase.from("automations").insert({
    workspace_id: ctx.workspace.id,
    name: parsed.data.name,
    trigger: parsed.data.trigger,
    template_id: parsed.data.templateId,
    channel: parsed.data.channel,
    is_active: false,
  });
  if (error) return { error: "generic", nonce: Date.now() };
  revalidatePath(`/${ctx.locale}/app/automations`);
  return { ok: true, nonce: Date.now() };
}

export async function setAutomationActive(automationId: string, active: boolean): Promise<FormState> {
  const ctx = await requireAppContext();
  const supabase = await createClient();
  const { error } = await supabase.from("automations").update({ is_active: active }).eq("id", automationId);
  if (error) {
    // Raised by the database when a language version is missing.
    return { error: error.hint === "missing_translations" ? "automationMissingTranslations" : "generic", nonce: Date.now() };
  }
  revalidatePath(`/${ctx.locale}/app/automations`);
  return { ok: true, nonce: Date.now() };
}
