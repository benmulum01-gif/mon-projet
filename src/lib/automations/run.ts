import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { AutomationTrigger } from "@/lib/labels";
import type { Workspace } from "@/lib/context";
import { chooseVariant, renderTemplate } from "./render";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

/**
 * Runs the active automations for an event. Messages are rendered in the
 * recipient's language and queued as "pending_approval": nothing is sent
 * without a human approving it.
 */
export async function runAutomations(
  supabase: SupabaseClient<Database>,
  workspace: Workspace,
  trigger: AutomationTrigger,
  lead: Lead,
  extra: { appointmentAt?: string | null } = {},
) {
  const { data: automations } = await supabase
    .from("automations")
    .select("id, channel, template_id, message_templates(template_variants(locale, subject, body))")
    .eq("workspace_id", workspace.id)
    .eq("trigger", trigger)
    .eq("is_active", true);
  if (!automations?.length) return 0;

  let queued = 0;
  for (const automation of automations) {
    const { data: existing } = await supabase
      .from("conversations")
      .select("id, locale")
      .eq("lead_id", lead.id)
      .eq("channel", automation.channel)
      .limit(1)
      .maybeSingle();

    const choice = chooseVariant(automation.message_templates?.template_variants ?? [], {
      conversationLocale: existing?.locale,
      leadLocale: lead.preferred_locale,
      workspaceDefault: workspace.default_comm_locale,
    });
    if (!choice.ok) continue; // Activation guarantees variants exist; never fall back to the UI language.

    let conversationId = existing?.id;
    if (!conversationId) {
      const { data: created } = await supabase
        .from("conversations")
        .insert({ workspace_id: workspace.id, lead_id: lead.id, channel: automation.channel, locale: lead.preferred_locale })
        .select("id")
        .single();
      conversationId = created?.id;
    }
    if (!conversationId) continue;

    const body = renderTemplate(choice.variant.body, choice.locale, {
      fullName: lead.full_name,
      company: lead.company,
      businessName: workspace.name,
      appointmentAt: extra.appointmentAt,
      timeZone: workspace.timezone,
    });
    const { error } = await supabase.from("messages").insert({
      workspace_id: workspace.id,
      conversation_id: conversationId,
      direction: "outbound",
      status: "pending_approval",
      body,
      locale: choice.locale,
      automation_id: automation.id,
    });
    if (!error) queued++;
  }
  return queued;
}
