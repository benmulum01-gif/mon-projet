import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AppointmentForm } from "@/components/app/appointment-form";
import { Button, Card, PageHeader, Select } from "@/components/ui";
import { setAppointmentStatus } from "@/lib/actions/appointments";
import { requireAppContext } from "@/lib/app-context";
import { formatDateTime } from "@/lib/format";
import { APPOINTMENT_STATUSES } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Appointments"))("title") };
}

export default async function AppointmentsPage({ searchParams }: PageProps<"/[locale]/app/appointments">) {
  const ctx = await requireAppContext();
  const t = await getTranslations("Appointments");
  const tas = await getTranslations("AppointmentStatus");
  const sp = await searchParams;
  const supabase = await createClient();
  const now = new Date().toISOString();
  const [{ data: appointments }, { data: leads }] = await Promise.all([
    supabase.from("appointments").select("id, starts_at, duration_minutes, location, status, leads(id, full_name)").eq("workspace_id", ctx.workspace.id).order("starts_at").limit(200),
    supabase.from("leads").select("id, full_name").eq("workspace_id", ctx.workspace.id).order("full_name").limit(500),
  ]);
  const upcoming = (appointments ?? []).filter((a) => a.starts_at >= now);
  const past = (appointments ?? []).filter((a) => a.starts_at < now).reverse();

  const table = (rows: typeof upcoming, empty: string, title: string) => (
    <Card>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {rows.length ? (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-ink-700">
              <tr>{(["when", "lead", "duration", "location", "status"] as const).map((c) => <th key={c} scope="col" className="py-2 pr-4 font-semibold">{t(`columns.${c}`)}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="py-2 pr-4 whitespace-nowrap">{formatDateTime(a.starts_at, ctx.fmt)}</td>
                  <td className="py-2 pr-4">{a.leads ? <Link href={`/app/leads/${a.leads.id}`} className="text-brand-700 hover:underline">{a.leads.full_name}</Link> : null}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">{t("minutes", { minutes: a.duration_minutes })}</td>
                  <td className="py-2 pr-4 break-words">{a.location ?? "—"}</td>
                  <td className="py-2 pr-4">
                    <form action={setAppointmentStatus} className="flex flex-wrap gap-2">
                      <input type="hidden" name="appointmentId" value={a.id} />
                      <label htmlFor={`apt-${a.id}`} className="sr-only">{t("statusLabel", { name: a.leads?.full_name ?? "" })}</label>
                      <Select id={`apt-${a.id}`} name="status" defaultValue={a.status} className="min-h-9 w-auto py-1">
                        {APPOINTMENT_STATUSES.map((s) => <option key={s} value={s}>{tas(s)}</option>)}
                      </Select>
                      <Button type="submit" variant="secondary" className="min-h-9 py-1">{t("update")}</Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-ink-600">{empty}</p>
      )}
    </Card>
  );

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <p className="mb-4 text-sm text-ink-600">{t("timeZoneNote", { timeZone: ctx.workspace.timezone })}</p>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          {table(upcoming, t("emptyUpcoming"), t("upcoming"))}
          {table(past, t("emptyPast"), t("past"))}
        </div>
        <Card>
          <h2 className="mb-3 text-lg font-semibold">{t("book")}</h2>
          <AppointmentForm leads={leads ?? []} defaultLeadId={typeof sp.lead === "string" ? sp.lead : undefined} timeZone={ctx.workspace.timezone} />
        </Card>
      </div>
    </>
  );
}
