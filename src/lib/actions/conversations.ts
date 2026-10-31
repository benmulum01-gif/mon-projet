"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isLocale, type Locale } from "@/i18n/config";
import { suggestReply, summarizeLead, translateText, type AiResult } from "@/lib/ai/claude";
import { requireAppContext } from "@/lib/app-context";
import { fieldErrorsFrom, requiredText, type FormState } from "@/lib/forms";
import { CHANNELS } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

const localeOrNull = z
  .string()
  .refine((v) => v === "" || isLocale(v), "invalidChoice")
  .transform((v) => (v === "" ? null : v));

export async function startConversation(formData: FormData) {
  const ctx = await requireAppContext();
  const parsed = z
    .object({ leadId: z.uuid(), channel: z.enum(CHANNELS), locale: localeOrNull })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClient();
  const { data: lead } = await supabase.from("leads").select("id, preferred_locale").eq("id", parsed.data.leadId).single();
  if (!lead) return;
  const { data } = await supabase
    .from("conversations")
    .insert({
      workspace_id: ctx.workspace.id,
      lead_id: lead.id,
      channel: parsed.data.channel,
      locale: parsed.data.locale ?? lead.preferred_locale,
    })
    .select("id")
    .single();
  if (!data) return;
  revalidatePath(`/${ctx.locale}/app`, "layout");
  redirect(`/${ctx.locale}/app/conversations/${data.id}`);
}

const messageSchema = z.object({
  kind: z.enum(["inbound", "draft"], "invalidChoice"),
  body: requiredText(20000),
});

export async function addMessage(conversationId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  const parsed = messageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const supabase = await createClient();
  const { data: conversation } = await supabase.from("conversations").select("id, locale").eq("id", conversationId).single();
  if (!conversation) return { error: "generic", nonce: Date.now() };
  const inbound = parsed.data.kind === "inbound";
  const { error } = await supabase.from("messages").insert({
    workspace_id: ctx.workspace.id,
    conversation_id: conversationId,
    direction: inbound ? "inbound" : "outbound",
    status: inbound ? "received" : "draft",
    body: parsed.data.body,
    locale: conversation.locale,
    author_id: inbound ? null : ctx.userId,
  });
  if (error) return { error: "generic", nonce: Date.now() };
  revalidatePath(`/${ctx.locale}/app/conversations/${conversationId}`);
  return { ok: true, nonce: Date.now() };
}

/** Human approval steps for outbound messages: draft/pending -> approved -> sent. */
export async function setMessageStatus(formData: FormData) {
  const ctx = await requireAppContext();
  const parsed = z
    .object({ messageId: z.uuid(), status: z.enum(["approved", "sent"]) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClient();
  const allowedFrom = parsed.data.status === "approved" ? ["draft", "pending_approval"] : ["approved"];
  const { data } = await supabase
    .from("messages")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.messageId)
    .eq("direction", "outbound")
    .in("status", allowedFrom as ("draft" | "pending_approval" | "approved")[])
    .select("conversation_id")
    .maybeSingle();
  if (data) revalidatePath(`/${ctx.locale}/app`, "layout");
}

export async function deleteDraft(formData: FormData) {
  const ctx = await requireAppContext();
  const messageId = z.uuid().safeParse(formData.get("messageId"));
  if (!messageId.success) return;
  const supabase = await createClient();
  await supabase
    .from("messages")
    .delete()
    .eq("id", messageId.data)
    .eq("direction", "outbound")
    .in("status", ["draft", "pending_approval", "approved"]);
  revalidatePath(`/${ctx.locale}/app`, "layout");
}

/** Stores a translation next to the original; the original is never modified. */
export async function translateMessage(messageId: string, targetLocale: Locale): Promise<AiResult> {
  const ctx = await requireAppContext();
  if (!isLocale(targetLocale)) return { ok: false, error: "generic" };
  const supabase = await createClient();
  const { data: message } = await supabase.from("messages").select("id, body").eq("id", messageId).single();
  if (!message) return { ok: false, error: "generic" };
  const result = await translateText({ text: message.body, targetLocale });
  if (!result.ok) return result;
  await supabase
    .from("message_translations")
    .upsert({ workspace_id: ctx.workspace.id, message_id: message.id, target_locale: targetLocale, body: result.text }, { onConflict: "message_id,target_locale" });
  revalidatePath(`/${ctx.locale}/app/conversations`, "layout");
  return result;
}

async function loadTranscript(conversationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("direction, body, created_at, status")
    .eq("conversation_id", conversationId)
    .in("status", ["received", "sent"])
    .order("created_at")
    .limit(50);
  return (data ?? []).map((m) => ({ direction: m.direction, body: m.body, createdAt: m.created_at }));
}

export async function aiSuggestReply(conversationId: string, outputLocale: Locale): Promise<AiResult> {
  const ctx = await requireAppContext();
  if (!isLocale(outputLocale)) return { ok: false, error: "generic" };
  const supabase = await createClient();
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, leads(full_name, company)")
    .eq("id", conversationId)
    .single();
  if (!conversation?.leads) return { ok: false, error: "generic" };
  return suggestReply({
    businessName: ctx.workspace.name,
    leadName: conversation.leads.full_name,
    company: conversation.leads.company,
    messages: await loadTranscript(conversationId),
    outputLocale,
  });
}

export async function saveAiDraft(conversationId: string, body: string, locale: Locale): Promise<FormState> {
  const ctx = await requireAppContext();
  const parsed = z.object({ body: requiredText(20000), locale: z.string().refine(isLocale) }).safeParse({ body, locale });
  if (!parsed.success) return { error: "generic" };
  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    workspace_id: ctx.workspace.id,
    conversation_id: conversationId,
    direction: "outbound",
    status: "draft",
    body: parsed.data.body,
    locale: parsed.data.locale,
    ai_generated: true,
    author_id: ctx.userId,
  });
  if (error) return { error: "generic" };
  revalidatePath(`/${ctx.locale}/app/conversations/${conversationId}`);
  return { ok: true };
}

export async function aiSummarizeLead(leadId: string, outputLocale: Locale): Promise<AiResult> {
  await requireAppContext();
  if (!isLocale(outputLocale)) return { ok: false, error: "generic" };
  const supabase = await createClient();
  const { data: lead } = await supabase
    .from("leads")
    .select("full_name, company, status, source, notes, created_at, conversations(id)")
    .eq("id", leadId)
    .single();
  if (!lead) return { ok: false, error: "generic" };
  const messages = (await Promise.all((lead.conversations ?? []).map((c) => loadTranscript(c.id)))).flat();
  const record = { full_name: lead.full_name, company: lead.company, status: lead.status, source: lead.source, notes: lead.notes, created_at: lead.created_at };
  return summarizeLead({ lead: record, messages, outputLocale });
}
