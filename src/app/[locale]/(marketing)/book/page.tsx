import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ConsentGate } from "@/components/consent/consent-gate";
import { integrations } from "@/config/integrations";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/book">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Book" });
  return pageMetadata(locale, "/book", t("title"), t("subtitle"));
}

export default async function BookPage({ params }: PageProps<"/[locale]/book">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Book");
  const url = integrations.calendlyUrl;
  const contact = (chunks: React.ReactNode) => <Link href="/contact" className="font-semibold text-brand-700 underline">{chunks}</Link>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-lg text-ink-700">{t("subtitle")}</p>
      <div className="mt-8">
        {url ? (
          <ConsentGate service="calendly" directUrl={url} siteName="Calendly">
            <iframe
              src={`${url}${url.includes("?") ? "&" : "?"}hide_gdpr_banner=1&locale=${locale}`}
              title={t("title")}
              className="h-[720px] w-full rounded-lg border border-line"
              loading="lazy"
            />
          </ConsentGate>
        ) : (
          <p className="rounded-lg bg-surface p-6 text-ink-700">{t.rich("notConfigured", { link: contact })}</p>
        )}
      </div>
      {url ? <p className="mt-6 text-sm text-ink-600">{t.rich("preferEmail", { link: contact })}</p> : null}
    </div>
  );
}
