import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/config/integrations";
import { ContactForm } from "./contact-form";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return pageMetadata(locale, "/contact", t("title"), t("subtitle"));
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-lg text-ink-700">{t("subtitle")}</p>
      <div className="mt-8">
        <ContactForm />
      </div>
      {whatsappUrl() ? (
        <p className="mt-8 text-sm text-ink-700">
          {t.rich("whatsapp", { link: (chunks) => <a href={whatsappUrl()!} rel="noopener noreferrer" className="font-semibold text-brand-700 underline">{chunks}</a> })}
        </p>
      ) : null}
    </div>
  );
}
