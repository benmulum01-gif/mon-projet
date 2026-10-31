import "server-only";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { FormatContext } from "@/lib/format";
import { getProfile, getUser, getWorkspace, type Workspace } from "@/lib/context";

export type AppContext = {
  userId: string;
  email: string;
  locale: Locale;
  workspace: Workspace;
  role: string;
  fmt: FormatContext & { currency: string; timeZone: string };
  profileName: string | null;
};

/** For pages inside the application shell: signed in + workspace exists. */
export async function requireAppContext(): Promise<AppContext> {
  const locale = (await getLocale()) as Locale;
  const user = await getUser();
  if (!user) redirect(`/${locale}/sign-in`);
  const membership = await getWorkspace();
  if (!membership) redirect(`/${locale}/app/onboarding`);
  const profile = await getProfile();
  const { workspace, role } = membership;
  return {
    userId: user.id,
    email: user.email ?? "",
    locale,
    workspace,
    role,
    profileName: profile?.full_name ?? null,
    fmt: { locale, timeZone: workspace.timezone, currency: workspace.currency },
  };
}
