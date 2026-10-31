import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pricing" });
  return pageMetadata(locale, "/pricing", t("title"), t("subtitle"));
}

const included = ["f1", "f2", "f3", "f4"] as const;

export default async function PricingPage({ params }: PageProps<"/[locale]/pricing">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Pricing");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-700">{t("subtitle")}</p>

      <section aria-labelledby="included-title" className="mt-10 rounded-xl border border-line p-6">
        <h2 id="included-title" className="text-xl font-bold text-ink-900">{t("includedTitle")}</h2>
        <ul className="mt-4 space-y-2 text-ink-700">
          {included.map((key) => (
            <li key={key} className="flex gap-2">
              <span aria-hidden="true" className="text-brand-600">✓</span>
              <span>{t(`included.${key}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-title" className="mt-6 rounded-xl bg-surface p-6">
        <h2 id="how-title" className="text-xl font-bold text-ink-900">{t("howTitle")}</h2>
        <p className="mt-3 text-ink-700">{t("how")}</p>
        <p className="mt-2 text-ink-700">{t("payment")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className={buttonClass("primary")}>{t("requestQuote")}</Link>
          <Link href="/book" className={buttonClass("secondary")}>{t("bookCall")}</Link>
        </div>
      </section>

      <p className="mt-8 text-sm text-ink-600">
        {t.rich("terms", { link: (chunks) => <Link href="/legal/terms-of-sale" className="font-semibold text-brand-700 underline">{chunks}</Link> })}
      </p>
    </div>
  );
}
