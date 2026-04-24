import { motion } from "framer-motion";
import { createContext, useContext, useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  layoutId: string;
  reduced: boolean;
}
const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used inside <Tabs>");
  return ctx;
}

interface TabsProps {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Headless tabs with a Framer `layoutId` sliding indicator.
 * Indicator is scoped per-instance via useId, so multiple tab groups don't collide.
 */
export function Tabs({ value, onChange, children, className = "" }: TabsProps) {
  const reduced = useReducedMotion();
  const layoutId = useId();
  return (
    <TabsContext.Provider value={{ value, setValue: onChange, layoutId, reduced }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const tabs = Array.from(ref.current.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const idx = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (idx === -1) return;
    let next: number;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    tabs[next]?.focus();
    tabs[next]?.click();
  };

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      onKeyDown={onKey}
      className="relative inline-flex gap-1 rounded-pill border border-border-subtle bg-surface-muted p-1"
    >
      {children}
    </div>
  );
}

export function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { value: active, setValue, layoutId, reduced } = useTabs();
  const selected = active === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => setValue(value)}
      className={`relative z-10 min-h-[40px] rounded-pill px-5 py-1.5 text-xs uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 touch-action-manipulation ${
        selected ? "text-on-accent" : "text-on-surface/70 hover:text-on-surface"
      }`}
    >
      {selected && (
        <motion.span
          aria-hidden="true"
          layoutId={layoutId}
          className="absolute inset-0 rounded-pill bg-accent"
          style={{ zIndex: -1 }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 32 }
          }
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { value: active } = useTabs();
  if (active !== value) return null;
  return <div role="tabpanel">{children}</div>;
}
