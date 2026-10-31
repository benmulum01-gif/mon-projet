"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export const appNavItems = [
  { href: "/app", key: "overview" },
  { href: "/app/leads", key: "leads" },
  { href: "/app/pipeline", key: "pipeline" },
  { href: "/app/appointments", key: "appointments" },
  { href: "/app/conversations", key: "conversations" },
  { href: "/app/automations", key: "automations" },
  { href: "/app/analytics", key: "analytics" },
  { href: "/app/integrations", key: "integrations" },
  { href: "/app/settings", key: "settings" },
  { href: "/app/billing", key: "billing" },
] as const;

export function AppNav() {
  const t = useTranslations("AppNav");
  const pathname = usePathname();
  return (
    <nav aria-label={t("label")}>
      <ul className="space-y-1">
        {appNavItems.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium",
                  active ? "bg-brand-600 text-white" : "text-ink-700 hover:bg-white",
                )}
              >
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
