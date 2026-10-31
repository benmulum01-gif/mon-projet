"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Alert, Button } from "@/components/ui";
import { setAutomationActive } from "@/lib/actions/automations";
import type { ErrorCode } from "@/lib/forms";

export function AutomationToggle({ id, name, active, canActivate }: { id: string; name: string; active: boolean; canActivate: boolean }) {
  const t = useTranslations("Automations");
  const te = useTranslations("Errors");
  const [pending, start] = useTransition();
  const [error, setError] = useState<ErrorCode | null>(null);
  return (
    <div>
      <Button
        variant={active ? "secondary" : "primary"}
        className="min-h-9 py-1"
        aria-label={`${active ? t("deactivate") : t("activate")} — ${t("toggleLabel", { name })}`}
        disabled={pending || (!active && !canActivate)}
        onClick={() =>
          start(async () => {
            const r = await setAutomationActive(id, !active);
            setError(r.error ?? null);
          })
        }
      >
        {active ? t("deactivate") : t("activate")}
      </Button>
      {error ? <div className="mt-2"><Alert>{te(error)}</Alert></div> : null}
    </div>
  );
}
