import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-lg font-extrabold text-brand-800">SAVAN</p>
          <p className="mt-2 max-w-sm text-sm text-ink-600">{t("tagline")}</p>
        </div>
        <nav aria-label={t("productNav")}>
          <h2 className="text-sm font-semibold text-ink-900">{t("product")}</h2>
          <ul className="mt-2 space-y-1 text-sm text-ink-700">
            <li><Link href="/pricing" className="hover:text-brand-700">{nav("pricing")}</Link></li>
            <li><Link href="/industries" className="hover:text-brand-700">{nav("industries")}</Link></li>
            <li><Link href="/faq" className="hover:text-brand-700">{nav("faq")}</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold text-ink-900">{t("company")}</h2>
          <ul className="mt-2 space-y-1 text-sm text-ink-700">
            <li><Link href="/contact" className="hover:text-brand-700">{nav("contact")}</Link></li>
            <li><Link href="/sign-in" className="hover:text-brand-700">{nav("signIn")}</Link></li>
          </ul>
          <div className="mt-4">
            <p className="mb-1 text-sm font-semibold text-ink-900" id="footer-language">{t("language")}</p>
            <Suspense>
              <LanguageSwitcher id="language-switcher-footer" />
            </Suspense>
          </div>
        </div>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-xs text-ink-600">
        {t("copyright", { year })}
      </p>
    </footer>
  );
}
