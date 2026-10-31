import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center px-4">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-extrabold">{t("title")}</h1>
      <p className="mt-3 text-ink-600">{t("text")}</p>
      <Link href="/" className={buttonClass("primary", "mt-6")}>{t("home")}</Link>
    </main>
  );
}
