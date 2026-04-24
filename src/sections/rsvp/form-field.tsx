import type { ReactNode } from "react";

interface Props {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
}

/**
 * Shared field wrapper: floating-style label above input + reserved
 * error slot to prevent layout shift on validation feedback.
 */
export function FormField({ label, htmlFor, error, children }: Props) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.3em] opacity-70">{label}</span>
      {children}
      <span
        role={error ? "alert" : undefined}
        className={`mt-1.5 block min-h-4 text-xs text-red-400/90 ${error ? "opacity-100" : "opacity-0"}`}
      >
        {error ?? " "}
      </span>
    </label>
  );
}

export const inputBaseClasses =
  "w-full rounded-soft border border-border-subtle bg-surface-muted px-4 py-3 sm:py-3.5 text-base outline-none transition focus:border-muted-gold/60 focus:bg-surface-muted dark:bg-surface/30";
