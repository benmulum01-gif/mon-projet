import { Constants } from "@/lib/supabase/types";

/** Stable enum values from the database; labels come from the dictionaries. */
export const LEAD_STATUSES = Constants.public.Enums.lead_status;
export const LEAD_SOURCES = Constants.public.Enums.lead_source;
export const CHANNELS = Constants.public.Enums.channel;
export const APPOINTMENT_STATUSES = Constants.public.Enums.appointment_status;
export const TEMPLATE_KINDS = Constants.public.Enums.template_kind;
export const AUTOMATION_TRIGGERS = Constants.public.Enums.automation_trigger;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type Channel = (typeof CHANNELS)[number];
export type TemplateKind = (typeof TEMPLATE_KINDS)[number];
export type AutomationTrigger = (typeof AUTOMATION_TRIGGERS)[number];

export const STATUS_TONE: Record<LeadStatus, "neutral" | "brand" | "success" | "warning" | "danger"> = {
  new: "brand",
  contacted: "neutral",
  qualified: "warning",
  appointment_booked: "brand",
  won: "success",
  lost: "danger",
};
