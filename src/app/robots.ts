import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    // Public pages are open to all crawlers; the private application is not.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/en/app", "/fr/app", "/api/", "/auth/"] }],
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
