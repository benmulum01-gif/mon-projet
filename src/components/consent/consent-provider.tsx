"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ConsentCategory } from "@/config/integrations";
import { deleteCookiesFor, NO_CONSENT, readConsent, serializeConsent, type ConsentChoices } from "@/lib/consent";

type ConsentContextValue = {
  /** null = no valid choice yet (never asked, or older than 6 months). */
  choices: ConsentChoices | null;
  ready: boolean;
  categories: ConsentCategory[];
  preferencesOpen: boolean;
  save: (choices: ConsentChoices) => void;
  grant: (category: ConsentCategory) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ categories, children }: { categories: ConsentCategory[]; children: ReactNode }) {
  const [choices, setChoices] = useState<ConsentChoices | null>(null);
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Read the stored choice once mounted (document.cookie is browser-only).
  useEffect(() => {
    const stored = readConsent(document.cookie);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external store (cookie) on mount
    setChoices(stored?.c ?? null);
    setReady(true);
  }, []);

  const save = useCallback(
    (next: ConsentChoices) => {
      const withdrawn = (Object.keys(next) as ConsentCategory[]).filter((c) => choices?.[c] && !next[c]);
      document.cookie = serializeConsent(next);
      setChoices(next);
      setPreferencesOpen(false);
      if (withdrawn.length) {
        // Withdrawing consent: remove the cookies and reload so the scripts are unloaded.
        withdrawn.forEach(deleteCookiesFor);
        window.location.reload();
      }
    },
    [choices],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      choices,
      ready,
      categories,
      preferencesOpen,
      save,
      grant: (category) => save({ ...(choices ?? NO_CONSENT), [category]: true }),
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
    }),
    [choices, ready, categories, preferencesOpen, save],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const value = useContext(ConsentContext);
  if (!value) throw new Error("useConsent must be used inside <ConsentProvider>");
  return value;
}

/** Optional variant for components that may render outside the public site. */
export function useOptionalConsent() {
  return useContext(ConsentContext);
}
