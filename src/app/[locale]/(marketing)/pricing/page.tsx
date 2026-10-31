import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui";
import type { Locale } from "@/i18n/config";
import { plans, PRICING_CURRENCY } from "@/config/plans";
import { formatMoney } from "@/lib/format";
import { alternates } from "@/lib/seo";
import { cn } from "@/lib/cn";

export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pricing" });
  return { title: t("title"), description: t("subtitle"), alternates: alternates(locale, "/pricing") };
}

const features = ["f1", "f2", "f3", "f4"] as const;

export default async function PricingPage({ params }: PageProps<"/[locale]/pricing">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Pricing");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-700">{t("subtitle")}</p>

      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className={cn("flex flex-col rounded-xl border p-6", plan.highlighted ? "border-brand-600 ring-2 ring-brand-600" : "border-line")}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-ink-900">{t(`plans.${plan.id}.name`)}</h2>
              {plan.highlighted ? (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">{t("recommended")}</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-ink-600">{t(`plans.${plan.id}.description`)}</p>
            <p className="mt-5">
              <span className="text-4xl font-extrabold text-ink-900">
                {formatMoney(plan.monthlyCents, { locale, currency: PRICING_CURRENCY })}
              </span>{" "}
              <span className="text-ink-600">{t("perMonth")}</span>
            </p>
            <p className="text-xs text-ink-600">{t("taxNote")}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-ink-700">
              {features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden="true" className="text-brand-600">✓</span>
                  <span>{t(`plans.${plan.id}.features.${f}`)}</span>
                </li>
              ))}
            </ul>
            <Link href={`/sign-up?plan=${plan.id}`} className={buttonClass(plan.highlighted ? "primary" : "secondary", "mt-6")}>
              {t("choose", { plan: t(`plans.${plan.id}.name`) })}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-ink-600">
        {t.rich("questions", { link: (chunks) => <Link href="/contact" className="font-semibold text-brand-700 underline">{chunks}</Link> })}
      </p>
    </div>
  );
}
