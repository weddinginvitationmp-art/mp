import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useActiveSection } from "@/hooks/use-active-section";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { NAV_SECTIONS } from "@/lib/section-nav";
import { FabButton } from "./fab-button";

export function QuickNavToggle() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const ids = useMemo(() => NAV_SECTIONS.map((s) => s.id), []);
  const active = useActiveSection(ids);

  // Outside click + Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <FabButton
        aria-label={t("floating.nav")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true" className="text-base">
          ☰
        </span>
      </FabButton>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-14 right-0 min-w-[180px] rounded-soft border border-ivory/15 bg-ink/95 backdrop-blur-md p-2 shadow-xl"
          >
            {NAV_SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => jumpTo(s.id)}
                    className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs uppercase tracking-widest transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold/40 ${
                      isActive ? "text-muted-gold" : "text-ivory hover:bg-ivory/10"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`block h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-muted-gold" : "bg-ivory/20"
                      }`}
                    />
                    {t(s.labelKey)}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
