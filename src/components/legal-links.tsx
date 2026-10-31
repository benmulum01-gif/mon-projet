import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export const legalPages = [
  { href: "/legal/notice", key: "legalNotice" },
  { href: "/legal/privacy", key: "privacy" },
  { href: "/legal/cookies", key: "cookies" },
  { href: "/legal/terms-of-sale", key: "termsOfSale" },
  { href: "/legal/terms-of-use", key: "termsOfUse" },
  { href: "/legal/accessibility", key: "accessibility" },
] as const;

/** Legal links present on every page of the site and the application. */
export async function LegalLinks({ className, extra }: { className?: string; extra?: React.ReactNode }) {
  const t = await getTranslations("Footer");
  return (
    <nav aria-label={t("legalNav")} className={className}>
      <ul className={cn("flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-600")}>
        {legalPages.map((page) => (
          <li key={page.key}>
            <Link href={page.href} className="underline hover:text-brand-700">{t(page.key)}</Link>
          </li>
        ))}
        {extra}
      </ul>
    </nav>
  );
}
