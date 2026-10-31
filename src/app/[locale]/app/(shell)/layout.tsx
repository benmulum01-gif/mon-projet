import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AppNav } from "@/components/app/app-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LegalLinks } from "@/components/legal-links";
import { requireAppContext } from "@/lib/app-context";
import { signOut } from "../../(auth)/actions";

export default async function ShellLayout({ children }: LayoutProps<"/[locale]/app">) {
  const ctx = await requireAppContext();
  const t = await getTranslations("AppShell");

  const sidebar = (suffix: string) => (
    <>
      <AppNav />
      <div className="mt-6 space-y-3 border-t border-line pt-4 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-600">{t("interfaceLanguage")}</p>
          <Suspense>
            <LanguageSwitcher id={`language-switcher-${suffix}`} className="mt-1" />
          </Suspense>
        </div>
        <p className="break-all text-ink-600">{ctx.email}</p>
        <form action={signOut}>
          <input type="hidden" name="locale" value={ctx.locale} />
          <button type="submit" className="font-semibold text-brand-700 underline">
            {t("signOut")}
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-dvh bg-surface lg:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        {t("skipToContent")}
      </a>
      <aside className="hidden w-64 shrink-0 border-r border-line p-4 lg:block">
        <p className="mb-1 text-xl font-extrabold text-brand-800">SAVAN</p>
        <p className="mb-6 truncate text-sm text-ink-600" title={ctx.workspace.name}>
          {ctx.workspace.name}
        </p>
        {sidebar("desktop")}
      </aside>

      <details className="group border-b border-line bg-white lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3">
          <span className="text-lg font-extrabold text-brand-800">SAVAN</span>
          <span className="rounded-md border border-line px-3 py-1 text-sm font-medium">
            <span className="group-open:hidden">{t("openMenu")}</span>
            <span className="hidden group-open:inline">{t("closeMenu")}</span>
          </span>
        </summary>
        <div className="bg-surface px-4 pb-4">
          <p className="mb-3 truncate text-sm text-ink-600">{ctx.workspace.name}</p>
          {sidebar("mobile")}
        </div>
      </details>

      <div className="flex min-w-0 flex-1 flex-col">
        <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-8">
          {children}
        </main>
        <footer className="border-t border-line px-4 py-4 sm:px-8">
          <LegalLinks />
        </footer>
      </div>
    </div>
  );
}
