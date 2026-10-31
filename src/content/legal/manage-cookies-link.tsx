"use client";

import { useOptionalConsent } from "@/components/consent/consent-provider";

/** "Change my cookie choices" button inside the cookie policy. */
export function ManageCookiesLink({ label }: { label: string }) {
  const consent = useOptionalConsent();
  if (!consent || !consent.categories.length) return null;
  return (
    <button type="button" onClick={consent.openPreferences} className="font-semibold text-brand-700 underline">
      {label}
    </button>
  );
}
