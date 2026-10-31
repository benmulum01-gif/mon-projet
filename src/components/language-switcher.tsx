"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { saveUiLocale } from "@/lib/actions/locale";
import { cn } from "@/lib/cn";

/**
 * Switches language in place: same page, same query string (filters),
 * no sign-out. Asks before discarding unsaved form input.
 */
export function LanguageSwitcher({ className, id = "language-switcher" }: { className?: string; id?: string }) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function onChange(next: Locale) {
    if (next === locale) return;
    const dirty = document.querySelector('form[data-dirty="true"]');
    if (dirty && !window.confirm(t("unsavedChanges"))) return;
    startTransition(async () => {
      await saveUiLocale(next);
      const query = Object.fromEntries(searchParams.entries());
      router.replace({ pathname, query }, { locale: next, scroll: false });
      router.refresh();
    });
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={id} className="sr-only">
        {t("label")}
      </label>
      <select
        id={id}
        value={locale}
        disabled={isPending}
        onChange={(event) => onChange(event.target.value as Locale)}
        className="min-h-9 rounded-md border border-line bg-white px-2 py-1 text-sm text-ink-900"
      >
        {locales.map((code) => (
          <option key={code} value={code} lang={code}>
            {localeNames[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
