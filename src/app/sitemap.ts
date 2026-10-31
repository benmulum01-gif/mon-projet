import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { env } from "@/lib/env";

const publicPaths = [
  "", "/pricing", "/industries", "/faq", "/contact", "/book",
  "/legal/notice", "/legal/privacy", "/legal/cookies", "/legal/terms-of-sale", "/legal/terms-of-use", "/legal/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${env.siteUrl}/${locale}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${env.siteUrl}/${l}${path}`])) },
    })),
  );
}
