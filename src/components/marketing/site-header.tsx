import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { buttonClass } from "@/components/ui";
import { getUser } from "@/lib/context";

const links = [
  { href: "/pricing", key: "pricing" },
  { href: "/industries", key: "industries" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const user = await getUser();

  return (
    <header className="border-b border-line bg-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-brand-800">
          SAVAN
        </Link>

        <nav aria-label={t("mainNav")} className="order-3 w-full md:order-none md:w-auto">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium text-ink-700">
            {links.map((link) => (
              <li key={link.key}>
                <Link href={link.href} className="inline-block py-2 hover:text-brand-700">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <Suspense>
            <LanguageSwitcher id="language-switcher-header" />
          </Suspense>
          {user ? (
            <Link href="/app" className={buttonClass("primary")}>
              {t("openApp")}
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className={buttonClass("ghost")}>
                {t("signIn")}
              </Link>
              <Link href="/sign-up" className={buttonClass("primary")}>
                {t("signUp")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
