import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  children: ReactNode;
  /** Optional: render a wider pill instead of a circle. */
  pill?: boolean;
}

/**
 * Circular floating-action button primitive, 48×48 minimum, safe-area aware
 * via parent container. Use for single-icon actions only; wrap in FloatingDock.
 */
export function FabButton({ children, className = "", pill, ...rest }: Props) {
  const shape = pill ? "rounded-pill px-5 min-w-[48px]" : "rounded-full w-12";
  return (
    <button
      type="button"
      className={`glass flex h-12 ${shape} items-center justify-center text-on-surface transition hover:border-accent/50 active:scale-[0.95] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 touch-action-manipulation ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
