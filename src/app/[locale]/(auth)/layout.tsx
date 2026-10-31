import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function AuthLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-6">
        <Link href="/" className="text-xl font-extrabold text-brand-800">
          SAVAN
        </Link>
        <Suspense>
          <LanguageSwitcher />
        </Suspense>
      </header>
      <main id="main" className="mx-auto w-full max-w-md flex-1 px-4 pb-16">
        {children}
      </main>
    </div>
  );
}
