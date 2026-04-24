import type { ReactNode } from "react";

interface ChipProps {
  label: string;
  dotColor?: string; // hex or CSS color
  children?: ReactNode;
  className?: string;
}

/**
 * Small pill with a colored dot + label.
 * Used for bank chips, language toggles, quick-nav.
 */
export function Chip({ label, dotColor, children, className = "" }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border border-ivory/20 px-2.5 py-1 text-[10px] uppercase tracking-widest ${className}`}
    >
      {dotColor && (
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {label}
      {children}
    </span>
  );
}
