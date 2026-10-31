import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui";
import type { Locale } from "@/i18n/config";
import { alternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/industries">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Industries" });
  return { title: t("title"), description: t("subtitle"), alternates: alternates(locale, "/industries") };
}

const industries = ["homeServices", "realEstate", "wellness", "professionalServices", "education", "agencies"] as const;

export default async function IndustriesPage({ params }: PageProps<"/[locale]/industries">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Industries");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-700">{t("subtitle")}</p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((key) => (
          <li key={key} className="rounded-lg border border-line p-6">
            <h2 className="text-lg font-semibold text-ink-900">{t(`items.${key}.title`)}</h2>
            <p className="mt-2 text-sm text-ink-600">{t(`items.${key}.text`)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <Link href="/contact" className={buttonClass("primary")}>
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
