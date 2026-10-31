"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import type { Locale } from "@/i18n/config";
import { Alert } from "@/components/ui";
import type { ErrorCode } from "@/lib/forms";
import { translateMessage } from "@/lib/actions/conversations";

/** Explicit, on-demand translation. The stored translation is shown separately from the original. */
export function TranslateButton({ messageId, target }: { messageId: string; target: Locale }) {
  const t = useTranslations("Conversations.detail");
  const tl = useTranslations("Languages");
  const te = useTranslations("Errors");
  const [pending, start] = useTransition();
  const [error, setError] = useState<ErrorCode | null>(null);
  return (
    <div>
      <button
        type="button"
        disabled={pending}
        className="text-sm font-semibold text-brand-700 underline disabled:opacity-60"
        onClick={() =>
          start(async () => {
            setError(null);
            const r = await translateMessage(messageId, target);
            if (!r.ok) setError(r.error);
          })
        }
      >
        {pending ? t("translating") : t("translate", { language: tl(target) })}
      </button>
      {error ? <div className="mt-2"><Alert>{te(error)}</Alert></div> : null}
    </div>
  );
}
