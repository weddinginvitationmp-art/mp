import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Bottom-center scroll hint with a subtle vertical bob.
 * Decorative — hidden from assistive tech.
 */
export function ScrollCue() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="absolute left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/70"
      style={{ bottom: "calc(2rem + env(safe-area-inset-bottom))" }}
      aria-hidden="true"
      animate={reduced ? undefined : { y: [0, 8, 0] }}
      transition={reduced ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-[10px] uppercase tracking-[0.4em]">{t("hero.scrollHint")}</span>
      <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden="true">
        <path
          d="M7 1v18M1 13l6 6 6-6"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
