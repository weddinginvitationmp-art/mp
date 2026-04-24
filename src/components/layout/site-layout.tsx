import type { ReactNode } from "react";
import { LanguageToggle } from "@/components/common/language-toggle";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Toast } from "@/components/common/toast";
import { FloatingDock } from "@/components/floating/floating-dock";

/**
 * Top-level page chrome: floating header (toggles), main scroll area, footer slot.
 * Sections compose into <main> via children.
 * Toast is rendered here so it's always mounted (singleton).
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <header className="fixed z-40 flex gap-2"
        style={{ top: "calc(1.25rem + env(safe-area-inset-top))", right: "1.25rem" }}>
        <LanguageToggle />
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <FloatingDock />
      <Toast />
    </div>
  );
}
