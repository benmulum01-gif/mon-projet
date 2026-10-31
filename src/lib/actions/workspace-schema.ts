import { z } from "zod";
import { isLocale } from "@/i18n/config";
import { isValidCurrency, isValidTimeZone } from "@/lib/format";
import { requiredText } from "@/lib/forms";

export const workspaceSchema = z
  .object({
    name: requiredText(120),
    defaultCommLocale: z.string().refine(isLocale, "invalidChoice"),
    commLocales: z.array(z.string().refine(isLocale, "invalidChoice")).min(1, "required"),
    timezone: z.string().refine(isValidTimeZone, "invalidChoice"),
    currency: z.string().trim().toUpperCase().refine(isValidCurrency, "invalidChoice"),
  })
  .refine((v) => v.commLocales.includes(v.defaultCommLocale), { path: ["defaultCommLocale"], message: "invalidChoice" });

export function workspaceInput(formData: FormData) {
  return {
    name: formData.get("name"),
    defaultCommLocale: formData.get("defaultCommLocale"),
    commLocales: formData.getAll("commLocales"),
    timezone: formData.get("timezone"),
    currency: formData.get("currency"),
  };
}
