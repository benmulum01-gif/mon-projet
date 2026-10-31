"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button } from "@/components/ui";
import { useConsent } from "./consent-provider";

/**
 * Shows embedded third-party content (videos, booking) only after consent to
 * "media". Before that, a placeholder explains why and offers a direct link.
 */
export function ConsentGate({
  service,
  message,
  directUrl,
  siteName,
  children,
}: {
  service: "youtube" | "calendly";
  message?: string;
  directUrl: string;
  siteName: string;
  children: ReactNode;
}) {
  const t = useTranslations("Embed");
  const { choices, ready, grant } = useConsent();
  if (ready && choices?.media) return <>{children}</>;
  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <p className="font-semibold text-ink-900">{t("blockedTitle")}</p>
      <p className="mt-2 text-sm text-ink-700">{message ?? t(service)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={() => grant("media")}>{t("allow")}</Button>
        <a href={directUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-700 underline">
          {t("openDirect", { site: siteName })}
        </a>
      </div>
    </div>
  );
}

/** Privacy-enhanced YouTube player, loaded only after consent. */
export function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <ConsentGate service="youtube" directUrl={`https://www.youtube.com/watch?v=${videoId}`} siteName="YouTube">
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </ConsentGate>
  );
}
