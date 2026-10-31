import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";

export type L = Record<Locale, string>;

/** A company value, or a visible marker when it has not been provided yet. */
export function V({ value, label, locale }: { value: string | null; label: L; locale: Locale }) {
  if (value) return <>{value}</>;
  return (
    <mark className="rounded bg-amber-100 px-1 font-semibold text-amber-900">
      [{locale === "fr" ? "À COMPLÉTER" : "TO BE COMPLETED"} : {label[locale]}]
    </mark>
  );
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} className="mt-10 scroll-mt-6 text-xl font-bold text-ink-900">{children}</h2>;
}
export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 font-semibold text-ink-900">{children}</h3>;
}
export function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-ink-700">{children}</p>;
}
export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-3 list-disc space-y-1 pl-6 text-ink-700">{children}</ul>;
}

export function Table({ caption, head, rows }: { caption: string; head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="relative mt-4 overflow-x-auto rounded-lg border border-line" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[720px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface text-ink-700">
          <tr>{head.map((h) => <th key={h} scope="col" className="px-3 py-2 align-top font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line align-top">
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => (j === 0 ? <th key={j} scope="row" className="px-3 py-2 font-medium">{cell}</th> : <td key={j} className="px-3 py-2">{cell}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
