import { getTranslations } from "next-intl/server";
import { company } from "@/config/company";
import { locales } from "@/i18n/config";
import { env } from "@/lib/env";

/** Plain-language description of the site for AI assistants (https://llmstxt.org). */
export async function GET() {
  const base = env.siteUrl;
  const en = await getTranslations({ locale: "en" });
  const fr = await getTranslations({ locale: "fr" });

  const pages = [
    ["/", en("Meta.title"), en("Meta.description")],
    ["/pricing", en("Pricing.title"), en("Pricing.subtitle")],
    ["/industries", en("Industries.title"), en("Industries.subtitle")],
    ["/faq", en("Faq.title"), en("Faq.subtitle")],
    ["/contact", en("Contact.title"), en("Contact.subtitle")],
    ["/book", en("Book.title"), en("Book.subtitle")],
  ];
  const legal = ["notice", "privacy", "cookies", "terms-of-sale", "terms-of-use", "accessibility"];

  const body = `# ${company.brand}

> ${en("Meta.description")} ${company.brand} designs and sets up customer acquisition systems for businesses, built on a bilingual (English/French) lead-management application with an AI writing assistant. Services are custom and quoted individually; payment is on invoice (bank transfer or PayPal).

- Languages: English and French. Every public page exists at /en/... and /fr/...
- Audience: small and medium-sized businesses and individuals in Europe who win customers through enquiries, quotes and appointments.
- AI-generated messages are drafts: nothing is sent to a prospect without human approval.
- French summary: ${fr("Meta.description")}

## Main pages (English)

${pages.map(([path, title, description]) => `- [${title}](${base}/en${path === "/" ? "" : path}): ${description}`).join("\n")}

## Pages principales (français)

${pages.map(([path]) => `- ${base}/fr${path === "/" ? "" : path}`).join("\n")}

## Legal

${legal.map((slug) => `- ${base}/en/legal/${slug} · ${base}/fr/legal/${slug}`).join("\n")}

## Optional

- Sitemap: ${base}/sitemap.xml
- Supported languages: ${locales.join(", ")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
