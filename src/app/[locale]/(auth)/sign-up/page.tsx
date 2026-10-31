import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";
import { Card } from "@/components/ui";
import { SignUpForm } from "./sign-up-form";

export async function generateMetadata({ params }: PageProps<"/[locale]/sign-up">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale as Locale, namespace: "Auth" });
  return { title: t("signUpTitle"), robots: { index: false } };
}

export default async function SignUpPage({ params }: PageProps<"/[locale]/sign-up">) {
  setRequestLocale((await params).locale as Locale);
  const t = await getTranslations("Auth");
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold text-ink-900">{t("signUpTitle")}</h1>
      <p className="mb-6 mt-1 text-ink-600">{t("signUpSubtitle")}</p>
      <SignUpForm />
      <p className="mt-6 text-sm text-ink-600">
        {t("haveAccount")}{" "}
        <Link href="/sign-in" className="font-semibold text-brand-700 underline">
          {t("signIn")}
        </Link>
      </p>
    </Card>
  );
}
