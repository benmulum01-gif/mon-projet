import { z } from "zod";

/**
 * Server actions return stable *codes*; the UI translates them with
 * t(`Validation.${code}`) / t(`Errors.${code}`). No user-facing text
 * is produced on the server, so errors always match the interface language.
 */
export type ValidationCode =
  | "required"
  | "invalidEmail"
  | "tooLong"
  | "tooShort"
  | "passwordTooShort"
  | "invalidNumber"
  | "invalidDate"
  | "invalidChoice";

export type ErrorCode =
  | "generic"
  | "invalidCredentials"
  | "emailInUse"
  | "rateLimited"
  | "automationMissingTranslations"
  | "aiNotConfigured"
  | "aiFailed"
  | "aiRefused"
  | "stripeNotConfigured"
  | "forbidden";

export type FormState<TData = undefined> = {
  ok?: boolean;
  error?: ErrorCode;
  fieldErrors?: Record<string, ValidationCode>;
  data?: TData;
  /** Lets the client reset or announce once per submission. */
  nonce?: number;
};

export function fieldErrorsFrom(error: z.ZodError): Record<string, ValidationCode> {
  const result: Record<string, ValidationCode> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (result[field]) continue;
    const code = (issue.message as ValidationCode) || "required";
    result[field] = code;
  }
  return result;
}

/** Optional text input: empty strings become null. */
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "tooLong")
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .transform((v) => v ?? null);

export const requiredText = (max: number) => z.string().trim().min(1, "required").max(max, "tooLong");

export const optionalEmail = z
  .string()
  .trim()
  .max(320, "tooLong")
  .refine((v) => v === "" || z.email().safeParse(v).success, "invalidEmail")
  .transform((v) => (v === "" ? null : v.toLowerCase()));
