"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";
import { locales } from "@/i18n/config";
import { Field, Input, Select } from "@/components/ui";
import type { ValidationCode } from "@/lib/forms";

type Defaults = {
  name?: string;
  defaultCommLocale?: string;
  commLocales?: string[];
  timezone?: string;
  currency?: string;
};

const COMMON_CURRENCIES = ["EUR", "USD", "CAD", "GBP", "CHF", "XOF", "XAF", "MAD", "TND", "AUD"];

/** Shared by onboarding and settings: the language, time zone and currency of a business. */
export function WorkspaceFields({ defaults = {}, errors = {} }: { defaults?: Defaults; errors?: Record<string, ValidationCode> }) {
  const t = useTranslations("WorkspaceFields");
  const tl = useTranslations("Languages");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const locale = useLocale();
  const err = (f: string) => (errors[f] ? tv(errors[f]) : undefined);

  // New workspaces default to the browser's time zone (set after hydration, on the DOM only).
  const timezoneRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!defaults.timezone && detected && timezoneRef.current) timezoneRef.current.value = detected;
  }, [defaults.timezone]);

  const timeZones = useMemo(() => {
    const list = typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : ["UTC"];
    return list.includes("UTC") ? list : ["UTC", ...list];
  }, []);
  const currencyNames = useMemo(() => new Intl.DisplayNames([locale], { type: "currency" }), [locale]);
  const currencies = useMemo(() => {
    const all = typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("currency") : COMMON_CURRENCIES;
    return [...COMMON_CURRENCIES, ...all.filter((c) => !COMMON_CURRENCIES.includes(c))];
  }, []);

  const defaultComm = defaults.defaultCommLocale ?? locale;
  const comm = defaults.commLocales ?? [locale];

  return (
    <div className="space-y-5">
      <Field id="ws-name" label={t("name")} error={err("name")} required requiredLabel={tc("required")}>
        {(aria) => <Input {...aria} name="name" defaultValue={defaults.name} maxLength={120} autoComplete="organization" />}
      </Field>

      <fieldset className="space-y-2" aria-describedby="commLocales-help">
        <legend className="text-sm font-medium text-ink-900">{t("commLocales")}</legend>
        <p id="commLocales-help" className="text-xs text-ink-600">{t("commLocalesHelp")}</p>
        <div className="flex flex-wrap gap-4">
          {locales.map((code) => (
            <label key={code} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="commLocales" value={code} defaultChecked={comm.includes(code)} className="size-4" />
              {tl(code)}
            </label>
          ))}
        </div>
        {err("commLocales") ? <p className="text-sm text-red-700">{err("commLocales")}</p> : null}
      </fieldset>

      <Field id="ws-default-comm" label={t("defaultCommLocale")} help={t("defaultCommLocaleHelp")} error={err("defaultCommLocale")}>
        {(aria) => (
          <Select {...aria} name="defaultCommLocale" defaultValue={defaultComm}>
            {locales.map((code) => (
              <option key={code} value={code}>{tl(code)}</option>
            ))}
          </Select>
        )}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="ws-timezone" label={t("timezone")} help={t("timezoneHelp")} error={err("timezone")}>
          {(aria) => (
            <Select {...aria} ref={timezoneRef} name="timezone" defaultValue={defaults.timezone ?? "UTC"}>
              {timeZones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </Select>
          )}
        </Field>
        <Field id="ws-currency" label={t("currency")} help={t("currencyHelp")} error={err("currency")}>
          {(aria) => (
            <Select {...aria} name="currency" defaultValue={defaults.currency ?? "EUR"}>
              {currencies.map((code) => (
                <option key={code} value={code}>
                  {code} — {currencyNames.of(code)}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
    </div>
  );
}
