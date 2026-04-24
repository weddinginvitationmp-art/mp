import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  children: ReactNode;
}

/**
 * Shared button primitive. min 44px tap target on md.
 * Always type="button" by default to avoid accidental form submission.
 */
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-pill font-display text-xs uppercase tracking-widest transition-all duration-200 touch-action-manipulation hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40 disabled:hover:translate-y-0";

  const variants = {
    primary: "bg-accent text-on-accent hover:bg-accent/90",
    secondary: "border border-border-subtle text-on-surface hover:bg-surface-muted",
    ghost: "text-on-surface hover:bg-surface-muted",
  };

  const sizes = {
    sm: "px-3 py-1.5 min-h-[36px]",
    md: "px-5 py-2.5 min-h-[44px]",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
