"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "@/i18n/config";
import { requireAppContext } from "@/lib/app-context";
import { workspaceInput, workspaceSchema } from "@/lib/actions/workspace-schema";
import { fieldErrorsFrom, optionalText, type FormState } from "@/lib/forms";
import { createClient } from "@/lib/supabase/server";

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  const parsed = z
    .object({ fullName: optionalText(200), uiLocale: z.string().refine(isLocale, "invalidChoice") })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName, ui_locale: parsed.data.uiLocale })
    .eq("id", ctx.userId);
  if (error) return { error: "generic", nonce: Date.now() };
  (await cookies()).set(LOCALE_COOKIE, parsed.data.uiLocale, { maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax", path: "/" });
  revalidatePath("/", "layout");
  // Reload the page in the newly chosen language; the user stays signed in.
  redirect(`/${parsed.data.uiLocale}/app/settings?saved=profile`);
}

export async function saveWorkspace(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  if (ctx.role !== "owner" && ctx.role !== "admin") return { error: "forbidden", nonce: Date.now() };
  const parsed = workspaceSchema.safeParse(workspaceInput(formData));
  const internal = formData.get("internalAiLocale");
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), nonce: Date.now() };
  const supabase = await createClient();
  const { error } = await supabase
    .from("workspaces")
    .update({
      name: parsed.data.name,
      default_comm_locale: parsed.data.defaultCommLocale,
      comm_locales: parsed.data.commLocales,
      internal_ai_locale: isLocale(internal) ? internal : null,
      timezone: parsed.data.timezone,
      currency: parsed.data.currency,
    })
    .eq("id", ctx.workspace.id);
  if (error) return { error: "generic", nonce: Date.now() };
  revalidatePath(`/${ctx.locale}/app`, "layout");
  return { ok: true, nonce: Date.now() };
}
