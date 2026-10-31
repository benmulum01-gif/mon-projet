"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isLocale } from "@/i18n/config";
import { requireAppContext } from "@/lib/app-context";
import { runAutomations } from "@/lib/automations/run";
import { fieldErrorsFrom, optionalEmail, optionalText, requiredText, type FormState } from "@/lib/forms";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

const leadSchema = z.object({
  fullName: requiredText(200),
  email: optionalEmail,
  phone: optionalText(50),
  company: optionalText(200),
  source: z.enum(LEAD_SOURCES, "invalidChoice"),
  status: z.enum(LEAD_STATUSES, "invalidChoice"),
  preferredLocale: z
    .string()
    .refine((v) => v === "" || isLocale(v), "invalidChoice")
    .transform((v) => (v === "" ? null : v)),
  value: z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d+([.,]\d{1,2})?$/.test(v) && Number(v.replace(",", ".")) < 1e12), "invalidNumber")
    .transform((v) => (v === "" ? null : Math.round(Number(v.replace(",", ".")) * 100))),
  notes: optionalText(5000),
});

function toRow(data: z.infer<typeof leadSchema>) {
  return {
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    company: data.company,
    source: data.source,
    status: data.status,
    preferred_locale: data.preferredLocale,
    value_cents: data.value,
    notes: data.notes,
  };
}

export async function createLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const supabase = await createClient();
  const { data: lead, error } = await supabase
    .from("leads")
    .insert({ ...toRow(parsed.data), workspace_id: ctx.workspace.id })
    .select("*")
    .single();
  if (error || !lead) return { error: "generic", nonce: Date.now() };
  await runAutomations(supabase, ctx.workspace, "lead_created", lead);
  revalidatePath(`/${ctx.locale}/app`, "layout");
  redirect(`/${ctx.locale}/app/leads/${lead.id}?created=1`);
}

export async function updateLead(leadId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const supabase = await createClient();
  const { data: before } = await supabase.from("leads").select("status").eq("id", leadId).maybeSingle();
  const { data: lead, error } = await supabase
    .from("leads")
    .update(toRow(parsed.data))
    .eq("id", leadId)
    .select("*")
    .single();
  if (error || !lead) return { error: "generic", nonce: Date.now() };
  if (before && before.status !== lead.status) await runAutomations(supabase, ctx.workspace, "lead_status_changed", lead);
  revalidatePath(`/${ctx.locale}/app`, "layout");
  return { ok: true, nonce: Date.now() };
}

/** Used by the pipeline board. */
export async function setLeadStatus(formData: FormData) {
  const ctx = await requireAppContext();
  const parsed = z
    .object({ leadId: z.uuid(), status: z.enum(LEAD_STATUSES) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClient();
  const { data: lead } = await supabase
    .from("leads")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.leadId)
    .select("*")
    .single();
  if (lead) await runAutomations(supabase, ctx.workspace, "lead_status_changed", lead);
  revalidatePath(`/${ctx.locale}/app`, "layout");
}

export async function deleteLead(formData: FormData) {
  const ctx = await requireAppContext();
  const leadId = z.uuid().safeParse(formData.get("leadId"));
  if (!leadId.success) return;
  const supabase = await createClient();
  await supabase.from("leads").delete().eq("id", leadId.data);
  revalidatePath(`/${ctx.locale}/app`, "layout");
  redirect(`/${ctx.locale}/app/leads`);
}
