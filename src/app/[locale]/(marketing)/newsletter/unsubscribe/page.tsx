import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { Alert } from "@/components/ui";
import { UnsubscribeForm } from "./unsubscribe-form";

export async function generateMetadata({ params }: PageProps<"/[locale]/newsletter/unsubscribe">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale as Locale, namespace: "Newsletter" });
  return { title: t("unsubscribeTitle"), robots: { index: false } };
}

export default async function UnsubscribePage({ params, searchParams }: PageProps<"/[locale]/newsletter/unsubscribe">) {
  setRequestLocale((await params).locale as Locale);
  const { token } = await searchParams;
  const t = await getTranslations("Newsletter");
  const valid = typeof token === "string" && /^[0-9a-f-]{36}$/i.test(token);
  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <h1 className="mb-6 text-3xl font-extrabold text-ink-900">{t("unsubscribeTitle")}</h1>
      {valid ? <UnsubscribeForm token={token} /> : <Alert>{t("invalidLink")}</Alert>}
    </div>
  );
}
