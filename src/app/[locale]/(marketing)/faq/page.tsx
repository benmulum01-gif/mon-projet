import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { alternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Faq" });
  return { title: t("title"), description: t("subtitle"), alternates: alternates(locale, "/faq") };
}

const questions = ["what", "who", "languages", "aiSending", "data", "billing", "cancel", "integrations"] as const;

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Faq");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: t(`items.${q}.question`),
      acceptedAnswer: { "@type": "Answer", text: t(`items.${q}.answer`) },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-lg text-ink-700">{t("subtitle")}</p>
      <dl className="mt-10 divide-y divide-line border-y border-line">
        {questions.map((q) => (
          <div key={q} className="py-5">
            <dt className="font-semibold text-ink-900">{t(`items.${q}.question`)}</dt>
            <dd className="mt-2 text-ink-700">{t(`items.${q}.answer`)}</dd>
          </div>
        ))}
      </dl>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
