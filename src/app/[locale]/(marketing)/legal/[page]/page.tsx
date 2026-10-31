import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { company } from "@/config/company";
import { AccessibilityStatement } from "@/content/legal/accessibility";
import { CookiePolicy } from "@/content/legal/cookies";
import { LegalNotice } from "@/content/legal/notice";
import { PrivacyPolicy } from "@/content/legal/privacy";
import { TermsOfSale } from "@/content/legal/terms-of-sale";
import { TermsOfUse } from "@/content/legal/terms-of-use";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

const pages: Record<string, { key: "legalNotice" | "privacy" | "cookies" | "termsOfSale" | "termsOfUse" | "accessibility"; Content: ComponentType<{ locale: Locale }> }> = {
  notice: { key: "legalNotice", Content: LegalNotice },
  privacy: { key: "privacy", Content: PrivacyPolicy },
  cookies: { key: "cookies", Content: CookiePolicy },
  "terms-of-sale": { key: "termsOfSale", Content: TermsOfSale },
  "terms-of-use": { key: "termsOfUse", Content: TermsOfUse },
  accessibility: { key: "accessibility", Content: AccessibilityStatement },
};

const legalSlugs = Object.keys(pages);
export const dynamicParams = false;
export function generateStaticParams() {
  return legalSlugs.map((page) => ({ page }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/legal/[page]">): Promise<Metadata> {
  const { locale, page } = await params;
  const entry = pages[page];
  if (!entry) return {};
  const t = await getTranslations({ locale: locale as Locale, namespace: "Legal" });
  return pageMetadata(locale as Locale, `/legal/${page}`, t(`titles.${entry.key}`));
}

export default async function LegalPage({ params }: PageProps<"/[locale]/legal/[page]">) {
  const { locale, page } = await params;
  const entry = pages[page];
  if (!entry) notFound();
  setRequestLocale(locale as Locale);
  const t = await getTranslations("Legal");
  const { Content } = entry;
  return (
    <article className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">{t(`titles.${entry.key}`)}</h1>
      <p className="mt-2 text-sm text-ink-600">{t("updated", { date: formatDate(company.legalUpdatedAt, { locale: locale as Locale, timeZone: "UTC" }) })}</p>
      <Content locale={locale as Locale} />
    </article>
  );
}
