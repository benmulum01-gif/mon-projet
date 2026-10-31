import { cn } from "@/lib/cn";
import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-600/60",
  secondary: "border border-line bg-white text-ink-900 hover:bg-surface",
  ghost: "text-ink-700 hover:bg-surface",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

export function buttonClass(variant: ButtonVariant = "primary", extra?: string) {
  return cn(
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-center text-sm font-semibold",
    "transition-colors disabled:cursor-not-allowed",
    buttonStyles[variant],
    extra,
  );
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

const controlClass =
  "block w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-500 aria-[invalid=true]:border-red-700";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClass, "min-h-10", className)} {...props} />;
}
export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(controlClass, "min-h-10", className)} {...props} />;
}
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlClass, className)} {...props} />;
}

/** Label + control + help + error, wired for assistive technologies. */
export function Field({
  id,
  label,
  help,
  error,
  required,
  requiredLabel,
  optionalLabel,
  children,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  children: (aria: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean; required?: boolean }) => ReactNode;
}) {
  const describedBy = [help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-ink-900">
        {label}
        {required && requiredLabel ? (
          <span className="text-red-700">
            {" "}
            <span aria-hidden="true">*</span>
            <span className="sr-only">({requiredLabel})</span>
          </span>
        ) : null}
        {!required && optionalLabel ? <span className="font-normal text-ink-600"> ({optionalLabel})</span> : null}
      </label>
      {children({ id, "aria-describedby": describedBy || undefined, "aria-invalid": error ? true : undefined, required })}
      {help ? (
        <p id={`${id}-help`} className="text-xs text-ink-600">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Card({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("rounded-lg border border-line bg-white p-5", className)} {...props} />;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-ink-600">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

const badgeTones = {
  neutral: "bg-surface text-ink-700 border-line",
  brand: "bg-brand-50 text-brand-800 border-brand-100",
  success: "bg-green-50 text-green-800 border-green-200",
  warning: "bg-amber-50 text-amber-900 border-amber-300",
  danger: "bg-red-50 text-red-800 border-red-200",
};
export type BadgeTone = keyof typeof badgeTones;

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", badgeTones[tone])}>
      {children}
    </span>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface px-6 py-10 text-center">
      <p className="font-semibold text-ink-900">{title}</p>
      {text ? <p className="mt-1 text-sm text-ink-600">{text}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Alert({ tone = "danger", children }: { tone?: "danger" | "success" | "warning" | "info"; children: ReactNode }) {
  const tones = {
    danger: "border-red-200 bg-red-50 text-red-800",
    success: "border-green-200 bg-green-50 text-green-800",
    warning: "border-amber-300 bg-amber-50 text-amber-900",
    info: "border-brand-100 bg-brand-50 text-brand-800",
  };
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("rounded-md border px-4 py-3 text-sm", tones[tone])}>
      {children}
    </div>
  );
}
