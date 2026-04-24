import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const HINT_KEY = "wi.backdrop.hint-seen";

/**
 * Shows a brief swipe affordance on first visit only.
 * Auto-dismisses after 4s or when the user scrolls horizontally.
 * localStorage flag prevents repeat shows.
 */
export function SwipeHint({ deckRef }: { deckRef: React.RefObject<HTMLDivElement | null> }) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const label = lang === "vi" ? "Vuốt" : "Swipe";

  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem(HINT_KEY);
    } catch {
      return false;
    }
  });

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      // quota / private mode
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    // Auto-dismiss after 4s
    const timer = setTimeout(() => dismiss(), 4000);

    // Dismiss on horizontal scroll > 10%
    const el = deckRef.current;
    if (!el) return () => clearTimeout(timer);

    const onScroll = () => {
      if (el.scrollLeft > el.clientWidth * 0.1) dismiss();
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
    };
  }, [visible, deckRef, dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute bottom-16 right-6 z-20 flex items-center gap-1.5 rounded-pill bg-ink/50 px-3 py-1.5 text-ivory/80 backdrop-blur-sm"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <span className="text-[11px] uppercase tracking-widest">{label}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
