import { ConsentBanner } from "@/components/consent/consent-banner";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { ThirdPartyScripts } from "@/components/consent/third-party-scripts";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { activeCategories } from "@/config/integrations";
import type { Locale } from "@/i18n/config";

export default async function MarketingLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  return (
    <ConsentProvider categories={activeCategories()}>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </div>
      <ConsentBanner />
      <ThirdPartyScripts />
    </ConsentProvider>
  );
}
