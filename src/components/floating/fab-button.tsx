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
      className={`flex h-12 ${shape} items-center justify-center border border-ivory/15 bg-ink/80 text-ivory shadow-lg backdrop-blur-md transition hover:border-muted-gold/50 hover:bg-ink/90 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold/50 touch-action-manipulation ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
