"use client";

import { useTranslations } from "next-intl";
import { useId, useState, useTransition } from "react";
import { locales, type Locale } from "@/i18n/config";
import { Alert, Button, Select } from "@/components/ui";
import type { AiResult } from "@/lib/ai/claude";
import type { ErrorCode, FormState } from "@/lib/forms";

/**
 * Generic AI action with an explicit output-language choice. The default
 * comes from the server (recipient or internal rule); the user can change it.
 */
export function AiPanel({
  label,
  purpose,
  defaultLocale,
  run,
  onUse,
  useLabel,
}: {
  label: string;
  purpose: "recipient" | "internal";
  defaultLocale: Locale;
  run: (locale: Locale) => Promise<AiResult>;
  onUse?: (text: string, locale: Locale) => Promise<FormState>;
  useLabel?: string;
}) {
  const t = useTranslations("Ai");
  const tl = useTranslations("Languages");
  const te = useTranslations("Errors");
  const id = useId();
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [result, setResult] = useState<{ text: string; locale: Locale } | null>(null);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48">
          <label htmlFor={`${id}-lang`} className="mb-1 block text-sm font-medium">{t("outputLanguage")}</label>
          <Select id={`${id}-lang`} value={locale} onChange={(e) => setLocale(e.target.value as Locale)} aria-describedby={`${id}-help`}>
            {locales.map((l) => <option key={l} value={l}>{tl(l)}</option>)}
          </Select>
        </div>
        <Button
          variant="secondary"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              const r = await run(locale);
              if (r.ok) setResult({ text: r.text, locale });
              else setError(r.error);
            })
          }
        >
          {pending ? t("generating") : label}
        </Button>
      </div>
      <p id={`${id}-help`} className="text-xs text-ink-600">{purpose === "recipient" ? t("recipientHelp") : t("internalHelp")}</p>
      <div aria-live="polite">
        {error ? <Alert>{te(error)}</Alert> : null}
        {result ? (
          <div className="space-y-2 rounded-md border border-line bg-surface p-3">
            <p className="text-xs font-semibold text-ink-600">{t("review")}</p>
            <p lang={result.locale} className="whitespace-pre-wrap text-sm text-ink-900">{result.text}</p>
            {onUse && useLabel ? (
              <Button
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const r = await onUse(result.text, result.locale);
                    if (r.ok) setResult(null);
                    else if (r.error) setError(r.error);
                  })
                }
              >
                {useLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
