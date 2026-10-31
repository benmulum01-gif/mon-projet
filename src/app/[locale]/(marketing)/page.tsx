import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/config/company";
import { env } from "@/lib/env";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata(locale, "/", t("homeTitle"), t("description"), true);
}

const benefits = ["respond", "organize", "follow", "measure"] as const;
const steps = ["capture", "engage", "convert"] as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("Home");
  const meta = await getTranslations("Meta");
  // Structured data for search engines and AI assistants.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${env.siteUrl}/#organization`,
        name: company.brand,
        ...(company.legalName ? { legalName: company.legalName } : {}),
        url: env.siteUrl,
        ...(company.email ? { email: company.email } : {}),
        address: { "@type": "PostalAddress", addressCountry: "CD", ...(company.address ? { streetAddress: company.address } : {}) },
      },
      {
        "@type": "ProfessionalService",
        name: company.brand,
        description: meta("description"),
        url: `${env.siteUrl}/${locale}`,
        inLanguage: locale,
        provider: { "@id": `${env.siteUrl}/#organization` },
        areaServed: "Europe",
        availableLanguage: ["en", "fr"],
        priceRange: "Sur devis / On quote",
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("hero.eyebrow")}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-700">{t("hero.subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className={buttonClass("primary", "px-6 py-3 text-base")}>
              {t("hero.primaryCta")}
            </Link>
            <Link href="/book" className={buttonClass("secondary", "px-6 py-3 text-base")}>
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="benefits-title" className="mx-auto max-w-6xl px-4 py-14">
        <h2 id="benefits-title" className="text-2xl font-bold text-ink-900 sm:text-3xl">
          {t("benefits.title")}
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((key) => (
            <li key={key} className="rounded-lg border border-line p-5">
              <h3 className="font-semibold text-ink-900">{t(`benefits.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-ink-600">{t(`benefits.${key}.text`)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-title" className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 id="how-title" className="text-2xl font-bold text-ink-900 sm:text-3xl">
            {t("how.title")}
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((key, index) => (
              <li key={key} className="rounded-lg bg-white p-5 shadow-sm">
                <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-semibold text-ink-900">{t(`how.${key}.title`)}</h3>
                <p className="mt-2 text-sm text-ink-600">{t(`how.${key}.text`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="cta-title" className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-xl bg-brand-800 px-6 py-10 text-white sm:px-10">
          <h2 id="cta-title" className="text-2xl font-bold sm:text-3xl">{t("cta.title")}</h2>
          <p className="mt-3 max-w-2xl text-brand-50">{t("cta.text")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className={buttonClass("secondary")}>
              {t("cta.primary")}
            </Link>
            <Link href="/industries" className="inline-flex min-h-10 items-center px-2 font-semibold text-white underline underline-offset-4">
              {t("cta.secondary")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
