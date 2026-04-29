import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useGuestContext } from "@/hooks/use-guest-context";
import { OrnamentalFrame, GoldDivider } from "./opening-ornaments";

const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE_CINEMATIC },
});

export function OpeningOverlay({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const { t } = useTranslation();
  const { guest } = useGuestContext();

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const subtitle = guest
    ? t("opening.personalGreeting", { name: guest.full_name })
    : t("opening.genericGreeting");

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="opening"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #6B1515 0%, #3A0808 60%, #1A0303 100%)",
          }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
          role="dialog"
          aria-modal="true"
          aria-label="Thiệp mời cưới"
        >
          {/* Film grain texture */}
          <div className="film-grain pointer-events-none absolute inset-0" />

          {/* Ornamental frame */}
          <OrnamentalFrame />

          {/* Content stack */}
          <div className="relative z-10 flex flex-col items-center px-8 text-center">
            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.5)}
              className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A876]/70"
            >
              {subtitle}
            </motion.p>

            <GoldDivider />

            {/* Couple names */}
            <motion.h1
              {...fadeUp(1.2)}
              className="font-script text-4xl leading-tight font-light sm:text-5xl"
            >
              <span className="opening-shimmer">Hà Phương</span>
              <motion.span
                {...fadeUp(1.5)}
                className="my-1 block font-script text-lg text-[#C9A876]/60"
              >
                &amp;
              </motion.span>
              <span className="opening-shimmer">Hoàng Minh</span>
            </motion.h1>

            <GoldDivider />

            {/* Date */}
            <motion.p
              {...fadeUp(2.5)}
              className="font-sans text-sm tracking-[0.25em] text-[#E5D4B7]/70"
            >
              12 · 12 · 2026
            </motion.p>

            {/* CTA */}
            <motion.button
              {...fadeUp(3.0)}
              className="mt-8 rounded-full border border-[#D4AF37]/40 px-6 py-2.5 font-sans text-xs tracking-[0.2em] uppercase text-[#D4AF37] transition-colors hover:border-[#D4AF37]/70 hover:text-[#F7E7CE]"
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
            >
              Mở thiệp ✦
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
