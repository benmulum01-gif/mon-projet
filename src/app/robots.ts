import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/**
 * Public pages: open to search engines and to AI assistants that read and cite
 * pages on behalf of users. Crawlers that collect content to TRAIN models are
 * refused (your choice: "readable and cited, no training").
 * Note: robots.txt is a convention respected by reputable crawlers, not a technical barrier.
 */
const TRAINING_CRAWLERS = [
  "GPTBot", // OpenAI training
  "ClaudeBot", // Anthropic training
  "Google-Extended", // Gemini training (does not affect Google Search)
  "Applebot-Extended", // Apple AI training
  "CCBot", // Common Crawl
  "meta-externalagent", // Meta AI training
  "Bytespider", // ByteDance
  "Amazonbot",
  "cohere-training-data-crawler",
];

const PRIVATE = ["/en/app", "/fr/app", "/api/", "/auth/", "/en/newsletter/", "/fr/newsletter/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: TRAINING_CRAWLERS, disallow: "/" },
      // Everyone else, including search and answer engines such as Googlebot, Bingbot,
      // OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User and PerplexityBot.
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
