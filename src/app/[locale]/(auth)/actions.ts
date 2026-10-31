"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isLocale, type Locale } from "@/i18n/config";
import { env } from "@/lib/env";
import { fieldErrorsFrom, optionalText, type FormState } from "@/lib/forms";
import { createClient } from "@/lib/supabase/server";

const email = z.string().trim().min(1, "required").max(320, "tooLong").pipe(z.email("invalidEmail"));

/** Only allow same-site relative paths as post-login destinations. */
function safeNext(next: unknown, locale: Locale) {
  if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) return next;
  return `/${locale}/app`;
}

/** Replaces the locale segment of a path, e.g. /en/app/leads -> /fr/app/leads. */
function withLocale(path: string, locale: Locale) {
  const parts = path.split("/");
  if (isLocale(parts[1])) parts[1] = locale;
  return parts.join("/");
}

const signUpSchema = z.object({
  fullName: optionalText(200),
  email,
  password: z.string().min(8, "passwordTooShort").max(72, "tooLong"),
  locale: z.string().refine(isLocale, "invalidChoice"),
});

export async function signUp(_prev: FormState<{ checkEmail: boolean }>, formData: FormData): Promise<FormState<{ checkEmail: boolean }>> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const locale = parsed.data.locale as Locale;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      // The language used during sign-up becomes the saved interface preference.
      data: { full_name: parsed.data.fullName ?? "", ui_locale: locale },
      emailRedirectTo: `${env.siteUrl}/auth/confirm?next=/${locale}/app`,
    },
  });
  if (error) {
    if (error.code === "user_already_exists" || error.code === "email_exists") return { error: "emailInUse", nonce: Date.now() };
    if (error.status === 429) return { error: "rateLimited", nonce: Date.now() };
    return { error: "generic", nonce: Date.now() };
  }
  if (!data.session) return { ok: true, data: { checkEmail: true }, nonce: Date.now() };
  redirect(`/${locale}/app`);
}

const signInSchema = z.object({
  email,
  password: z.string().min(1, "required"),
  locale: z.string().refine(isLocale, "invalidChoice"),
  next: z.string().optional(),
});

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error || !data.user) {
    if (error?.status === 429) return { error: "rateLimited", nonce: Date.now() };
    return { error: "invalidCredentials", nonce: Date.now() };
  }

  // The saved profile language wins over the language of the sign-in page.
  const { data: profile } = await supabase.from("profiles").select("ui_locale").eq("id", data.user.id).maybeSingle();
  const locale = isLocale(profile?.ui_locale) ? profile.ui_locale : (parsed.data.locale as Locale);
  redirect(withLocale(safeNext(parsed.data.next, locale), locale));
}

export async function signOut(formData: FormData) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = formData.get("locale");
  redirect(`/${isLocale(locale) ? locale : "en"}`);
}
