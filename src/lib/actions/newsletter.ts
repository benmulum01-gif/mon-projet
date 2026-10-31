"use server";

import { z } from "zod";
import { isLocale } from "@/i18n/config";
import { fieldErrorsFrom, type FormState } from "@/lib/forms";
import { createClient } from "@/lib/supabase/server";

/** Bump when the consent wording (Newsletter.consent) changes. */
const CONSENT_VERSION = "2026-10-31";

const schema = z.object({
  email: z.string().trim().min(1, "required").max(320, "tooLong").pipe(z.email("invalidEmail")),
  consent: z.literal("yes", "consentRequired"),
  locale: z.string().refine(isLocale, "invalidChoice"),
});

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse({ email: formData.get("email"), consent: formData.get("consent") ?? "", locale: formData.get("locale") });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const supabase = await createClient();
  const { error } = await supabase.rpc("subscribe_newsletter", {
    p_email: parsed.data.email,
    p_locale: parsed.data.locale,
    p_consent_version: CONSENT_VERSION,
  });
  if (error) return { error: "generic", nonce: Date.now() };
  return { ok: true, nonce: Date.now() };
}

export async function unsubscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const token = z.uuid().safeParse(formData.get("token"));
  if (!token.success) return { error: "generic" };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("unsubscribe_newsletter", { p_token: token.data });
  if (error || !data) return { error: "generic" };
  return { ok: true };
}
