"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { ConsentCategory } from "@/config/integrations";
import { NO_CONSENT, type ConsentChoices } from "@/lib/consent";
import { useConsent } from "./consent-provider";

/**
 * Shown on first visit (and every 6 months), or when "Manage cookies" is used.
 * "Reject all" and "Accept all" have exactly the same size, colour and level.
 */
export function ConsentBanner() {
  const t = useTranslations("Consent");
  const { choices, ready, categories, preferencesOpen, save } = useConsent();
  const [detailed, setDetailed] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(choices ?? NO_CONSENT);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const visible = ready && categories.length > 0 && (choices === null || preferencesOpen);
  const opened = visible && preferencesOpen;

  useEffect(() => {
    if (!opened) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the form to the stored choices when reopened
    setDraft(choices ?? NO_CONSENT);
    setDetailed(true);
    headingRef.current?.focus();
  }, [opened, choices]);

  if (!visible) return null;

  const all = (value: boolean) =>
    Object.fromEntries((Object.keys(NO_CONSENT) as ConsentCategory[]).map((c) => [c, value && categories.includes(c)])) as ConsentChoices;
  const equalButton =
    "min-h-11 flex-1 rounded-md border-2 border-brand-700 bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 sm:flex-none sm:min-w-44";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
      className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto border-t-4 border-brand-700 bg-white shadow-2xl"
    >
      <div className="mx-auto max-w-4xl space-y-3 px-4 py-4">
        <h2 id="consent-title" ref={headingRef} tabIndex={-1} className="text-lg font-bold text-ink-900">
          {t("title")}
        </h2>
        <p id="consent-text" className="text-sm text-ink-700">{t("text")}</p>
        <p className="text-sm">
          <Link href="/legal/cookies" className="font-semibold text-brand-700 underline">{t("policyLink")}</Link>
        </p>

        {detailed ? (
          <fieldset className="space-y-3 rounded-md border border-line p-3">
            <legend className="sr-only">{t("customize")}</legend>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{t("categories.necessary.title")}</p>
                <p className="text-xs text-ink-600">{t("categories.necessary.text")}</p>
              </div>
              <span className="text-xs font-semibold text-ink-700">{t("alwaysOn")}</span>
            </div>
            {categories.map((category) => (
              <label key={category} className="flex cursor-pointer flex-wrap items-start justify-between gap-2 border-t border-line pt-3">
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{t(`categories.${category}.title`)}</span>
                  <span className="block text-xs text-ink-600">{t(`categories.${category}.text`)}</span>
                </span>
                <span className="flex items-center gap-2 text-sm">
                  {t("allow")}
                  <input
                    type="checkbox"
                    className="size-5"
                    checked={draft[category]}
                    onChange={(e) => setDraft({ ...draft, [category]: e.target.checked })}
                  />
                </span>
              </label>
            ))}
          </fieldset>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button type="button" className={equalButton} onClick={() => save(all(false))}>{t("rejectAll")}</button>
          <button type="button" className={equalButton} onClick={() => save(all(true))}>{t("acceptAll")}</button>
          {detailed ? (
            <button type="button" className="min-h-11 rounded-md border-2 border-brand-700 bg-white px-4 py-2 text-sm font-semibold text-brand-800" onClick={() => save(draft)}>
              {t("save")}
            </button>
          ) : (
            <button type="button" className="min-h-11 rounded-md border-2 border-brand-700 bg-white px-4 py-2 text-sm font-semibold text-brand-800" onClick={() => setDetailed(true)}>
              {t("customize")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ManageCookiesButton({ label, className }: { label: string; className?: string }) {
  const { openPreferences, categories } = useConsent();
  if (!categories.length) return null;
  return (
    <button type="button" onClick={openPreferences} className={className ?? "underline hover:text-brand-700"}>
      {label}
    </button>
  );
}
