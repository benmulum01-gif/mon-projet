import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";
import { Card } from "@/components/ui";
import { SignInForm } from "./sign-in-form";

export async function generateMetadata({ params }: PageProps<"/[locale]/sign-in">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale as Locale, namespace: "Auth" });
  return { title: t("signInTitle"), robots: { index: false } };
}

export default async function SignInPage({ params, searchParams }: PageProps<"/[locale]/sign-in">) {
  setRequestLocale((await params).locale as Locale);
  const { next } = await searchParams;
  const t = await getTranslations("Auth");
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold text-ink-900">{t("signInTitle")}</h1>
      <p className="mb-6 mt-1 text-ink-600">{t("signInSubtitle")}</p>
      <SignInForm next={typeof next === "string" ? next : undefined} />
      <p className="mt-6 text-sm text-ink-600">
        {t("noAccount")}{" "}
        <Link href="/sign-up" className="font-semibold text-brand-700 underline">
          {t("signUp")}
        </Link>
      </p>
    </Card>
  );
}
