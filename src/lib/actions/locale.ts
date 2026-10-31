"use server";

import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

/**
 * Persists an explicit language choice: on the device (cookie) and, when
 * signed in, in the profile so it follows the user across devices.
 */
export async function saveUiLocale(locale: string) {
  if (!isLocale(locale)) return { ok: false };
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, { maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax", path: "/" });

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    await supabase.from("profiles").update({ ui_locale: locale }).eq("id", data.user.id);
  }
  return { ok: true };
}
