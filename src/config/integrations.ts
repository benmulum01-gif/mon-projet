/**
 * Third-party services, enabled only when their ID is set (build-time env vars).
 * None of them loads before the visitor has consented to its purpose.
 */
const env = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

export const integrations = {
  googleAnalyticsId: env(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID), // G-XXXXXXX
  googleAdsId: env(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID), // AW-XXXXXXX
  metaPixelId: env(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  linkedinPartnerId: env(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID),
  tiktokPixelId: env(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID),
  tawkPropertyId: env(process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID),
  tawkWidgetId: env(process.env.NEXT_PUBLIC_TAWK_WIDGET_ID) ?? "default",
  calendlyUrl: env(process.env.NEXT_PUBLIC_CALENDLY_URL), // https://calendly.com/your-name/30min
  whatsappNumber: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER), // international format, digits only
};

export type ConsentCategory = "analytics" | "advertising" | "media" | "chat";

/** Purposes that actually have a configured service (the banner only offers these). */
export function activeCategories(): ConsentCategory[] {
  const i = integrations;
  return [
    i.googleAnalyticsId ? "analytics" : null,
    i.googleAdsId || i.metaPixelId || i.linkedinPartnerId || i.tiktokPixelId ? "advertising" : null,
    i.calendlyUrl ? "media" : null,
    i.tawkPropertyId ? "chat" : null,
  ].filter(Boolean) as ConsentCategory[];
}

export function whatsappUrl() {
  const digits = integrations.whatsappNumber?.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}
