import { isLocale, type Locale } from "@/i18n/config";

export type AiPurpose =
  /** Content sent to a prospect (replies, messages, template drafts). */
  | "recipient"
  /** Content read by the team (summaries, insights). */
  | "internal";

/**
 * Default output language of an AI generation. Always overridable by the user.
 * - recipient: conversation language > lead language > workspace default communication language
 * - internal:  workspace internal AI language > reader's interface language
 * The interface language never decides what a prospect receives.
 */
export function defaultAiLocale(input: {
  purpose: AiPurpose;
  conversationLocale?: string | null;
  leadLocale?: string | null;
  workspaceDefaultComm: string;
  workspaceInternalAi?: string | null;
  uiLocale: Locale;
}): Locale {
  if (input.purpose === "recipient") {
    const known = [input.conversationLocale, input.leadLocale, input.workspaceDefaultComm].find(isLocale);
    return known ?? "en";
  }
  return isLocale(input.workspaceInternalAi) ? input.workspaceInternalAi : input.uiLocale;
}
