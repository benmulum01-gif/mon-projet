import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Alert, Badge, Card, PageHeader } from "@/components/ui";
import { requireAppContext } from "@/lib/app-context";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Integrations"))("title") };
}

const items = ["email", "messaging", "calendar", "forms"] as const;

export default async function IntegrationsPage() {
  await requireAppContext();
  const t = await getTranslations("Integrations");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="mb-6"><Alert tone="info">{t("notice")}</Alert></div>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((key) => (
          <li key={key}>
            <Card className="h-full">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{t(`items.${key}.title`)}</h2>
                <Badge>{t("comingSoon")}</Badge>
              </div>
              <p className="mt-2 text-sm text-ink-600">{t(`items.${key}.text`)}</p>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
