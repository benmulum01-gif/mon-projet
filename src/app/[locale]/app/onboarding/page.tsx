import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Card } from "@/components/ui";
import { getWorkspace } from "@/lib/context";
import { OnboardingForm } from "./onboarding-form";

export async function generateMetadata({ params }: PageProps<"/[locale]/app/onboarding">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale as Locale, namespace: "Onboarding" });
  return { title: t("title"), robots: { index: false } };
}

export default async function OnboardingPage({ params }: PageProps<"/[locale]/app/onboarding">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  if (await getWorkspace()) redirect(`/${locale}/app`);
  const t = await getTranslations("Onboarding");
  return (
    <div className="min-h-dvh bg-surface">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-4 py-6">
        <span className="text-xl font-extrabold text-brand-800">SAVAN</span>
        <Suspense>
          <LanguageSwitcher />
        </Suspense>
      </header>
      <main id="main" className="mx-auto max-w-2xl px-4 pb-16">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-ink-900">{t("title")}</h1>
          <p className="mb-6 mt-1 text-ink-600">{t("subtitle")}</p>
          <OnboardingForm />
        </Card>
      </main>
    </div>
  );
}
