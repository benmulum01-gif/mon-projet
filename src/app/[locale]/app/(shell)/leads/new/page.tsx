import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LeadForm } from "@/components/app/lead-form";
import { Card, PageHeader } from "@/components/ui";
import { createLead } from "@/lib/actions/leads";
import { requireAppContext } from "@/lib/app-context";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Leads"))("newTitle") };
}

export default async function NewLeadPage() {
  const ctx = await requireAppContext();
  const t = await getTranslations("Leads");
  return (
    <>
      <PageHeader title={t("newTitle")} subtitle={t("newSubtitle")} />
      <Card>
        <LeadForm action={createLead} currency={ctx.workspace.currency} />
      </Card>
    </>
  );
}
