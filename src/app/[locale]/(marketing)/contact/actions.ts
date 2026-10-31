"use server";

import { z } from "zod";
import { isLocale } from "@/i18n/config";
import { fieldErrorsFrom, optionalText, requiredText, type FormState } from "@/lib/forms";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  fullName: requiredText(200),
  email: z.string().trim().min(1, "required").max(320, "tooLong").pipe(z.email("invalidEmail")),
  company: optionalText(200),
  message: requiredText(5000),
  locale: z.string().refine(isLocale, "invalidChoice"),
});

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };

  const supabase = await createClient();
  const { error } = await supabase.from("contact_requests").insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email.toLowerCase(),
    company: parsed.data.company,
    message: parsed.data.message,
    locale: parsed.data.locale,
  });
  if (error) return { error: "generic", nonce: Date.now() };
  return { ok: true, nonce: Date.now() };
}
