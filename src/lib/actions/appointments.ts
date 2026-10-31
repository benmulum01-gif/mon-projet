"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAppContext } from "@/lib/app-context";
import { runAutomations } from "@/lib/automations/run";
import { zonedLocalInputToIso } from "@/lib/format";
import { fieldErrorsFrom, optionalText, type FormState } from "@/lib/forms";
import { APPOINTMENT_STATUSES } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  leadId: z.uuid("required"),
  startsAt: z.string().min(1, "required"),
  duration: z.coerce.number("invalidNumber").int("invalidNumber").min(5, "invalidNumber").max(600, "invalidNumber"),
  location: optionalText(300),
  notes: optionalText(2000),
});

export async function createAppointment(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  // The form value is wall-clock time in the business time zone.
  const startsAt = zonedLocalInputToIso(parsed.data.startsAt, ctx.workspace.timezone);
  if (!startsAt) return { fieldErrors: { startsAt: "invalidDate" }, nonce: Date.now() };

  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert({
    workspace_id: ctx.workspace.id,
    lead_id: parsed.data.leadId,
    starts_at: startsAt,
    duration_minutes: parsed.data.duration,
    location: parsed.data.location,
    notes: parsed.data.notes,
  });
  if (error) return { error: "generic", nonce: Date.now() };

  const { data: lead } = await supabase
    .from("leads")
    .update({ status: "appointment_booked" })
    .eq("id", parsed.data.leadId)
    .in("status", ["new", "contacted", "qualified"])
    .select("*")
    .maybeSingle();
  const { data: current } = lead ? { data: lead } : await supabase.from("leads").select("*").eq("id", parsed.data.leadId).single();
  if (current) await runAutomations(supabase, ctx.workspace, "appointment_booked", current, { appointmentAt: startsAt });

  revalidatePath(`/${ctx.locale}/app`, "layout");
  return { ok: true, nonce: Date.now() };
}

export async function setAppointmentStatus(formData: FormData) {
  const ctx = await requireAppContext();
  const parsed = z
    .object({ appointmentId: z.uuid(), status: z.enum(APPOINTMENT_STATUSES) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClient();
  await supabase.from("appointments").update({ status: parsed.data.status }).eq("id", parsed.data.appointmentId);
  revalidatePath(`/${ctx.locale}/app`, "layout");
}
