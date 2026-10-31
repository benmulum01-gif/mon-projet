import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProfileForm, WorkspaceForm } from "@/components/app/settings-forms";
import { Card, PageHeader } from "@/components/ui";
import { requireAppContext } from "@/lib/app-context";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Settings"))("title") };
}

export default async function SettingsPage({ searchParams }: PageProps<"/[locale]/app/settings">) {
  const ctx = await requireAppContext();
  const t = await getTranslations("Settings");
  const sp = await searchParams;
  const ws = ctx.workspace;
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">{t("profileTitle")}</h2>
          <ProfileForm fullName={ctx.profileName} savedNotice={sp.saved === "profile"} />
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">{t("workspaceTitle")}</h2>
          <WorkspaceForm
            canEdit={ctx.role === "owner" || ctx.role === "admin"}
            internalAiLocale={ws.internal_ai_locale}
            defaults={{ name: ws.name, defaultCommLocale: ws.default_comm_locale, commLocales: ws.comm_locales, timezone: ws.timezone, currency: ws.currency }}
          />
        </Card>
      </div>
    </>
  );
}
