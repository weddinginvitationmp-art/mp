import { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useGuestContext } from "@/hooks/use-guest-context";
import { OrnamentalFrame, GoldDivider } from "./opening-ornaments";
import { DoubleHappiness, PhoenixDragon } from "./opening-motifs";
import { wedding } from "@/config/wedding";

const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE_CINEMATIC },
});

export function OpeningOverlay({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"idle" | "shimmer" | "lift" | "flipping" | "flipped">("idle");
  const { t } = useTranslation();
  const { guest } = useGuestContext();

  useEffect(() => {
    if (phase === "flipped") {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleOpenCard = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "idle") return;
    setPhase("shimmer");
    // Shimmer phase: gold details brighten (300-400ms)
    setTimeout(() => setPhase("lift"), 350);
    // Lift phase: card elevates (200-300ms)
    setTimeout(() => setPhase("flipping"), 600);
    // Flip phase: card rotates Y-axis (500-700ms)
    setTimeout(() => setPhase("flipped"), 1250);
  }, [phase]);

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
          exit={{ opacity: 0, y: -70 }}
          transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
          role="dialog"
          aria-modal="true"
          aria-label="Thiệp mời cưới"
        >
          {/* Card wrapper with 3D perspective and flip */}

          {/* Film grain texture */}
          <div className="film-grain pointer-events-none absolute inset-0" />

          {/* Ornamental frame */}
          <OrnamentalFrame />

          {/* Phoenix & Dragon flanking */}
          <PhoenixDragon delay={0.6} />

          {/* Backdrop shimmer / blur during flip */}
          {(phase === "shimmer" || phase === "lift" || phase === "flipping") && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-[9] mix-blend-screen"
              animate={{
                opacity: phase === "shimmer" ? 0.12 : phase === "lift" ? 0.08 : 0,
                backdropFilter: phase === "flipping" ? "blur(8px)" : "blur(0px)",
              }}
              transition={{ duration: 0.5, ease: EASE_CINEMATIC }}
              style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.3) 0%, transparent 70%)",
              }}
            />
          )}

          {/* Card content with 3D flip effect */}
          <motion.div
            className="relative z-10 flex flex-col items-center px-8 text-center card-flip-wrapper"
            style={{ perspective: "1200px" }}
            animate={{
              rotateY: phase === "flipping" ? 90 : 0,
              opacity: phase === "flipped" ? 0 : 1,
              y: phase === "lift" || phase === "flipping" ? -12 : 0,
              filter: phase === "flipping" ? "blur(2px)" : "blur(0px)",
            }}
            transition={{
              rotateY: { duration: 0.65, ease: EASE_CINEMATIC, delay: phase === "flipping" ? 0 : 0 },
              y: { duration: 0.3, ease: "easeOut", delay: phase === "lift" ? 0.25 : 0 },
              opacity: { duration: 0.4, ease: "easeOut", delay: 0.8 },
              filter: { duration: 0.65, ease: EASE_CINEMATIC },
            }}
          >
            {/* Double Happiness — static, no flip animation */}
            <DoubleHappiness delay={0.4} />

            {/* Subtitle */}
            <motion.p
              {...fadeUp(1.0)}
              className="mt-2 sm:mt-4 font-sans text-xs tracking-[0.35em] uppercase text-[#C9A876]/70"
            >
              {subtitle}
            </motion.p>

            <GoldDivider />

            {/* Couple names */}
            <motion.h1
              {...fadeUp(1.8)}
              className="font-script text-4xl leading-tight font-light sm:text-5xl"
            >
              <span className="opening-shimmer">{wedding.groom.name}</span>
              <motion.span
                {...fadeUp(2.1)}
                className="my-0.5 sm:my-1 block font-script text-lg text-[#C9A876]/60"
              >
                &amp;
              </motion.span>
              <span className="opening-shimmer">{wedding.bride.name}</span>
            </motion.h1>

            <GoldDivider />

            {/* Date (from config) */}
            <motion.p
              {...fadeUp(2.8)}
              className="font-sans text-sm tracking-[0.25em] text-[#E5D4B7]/70"
            >
              {wedding.dateDisplay.en}
            </motion.p>

            {/* CTA */}
            <motion.button
              {...fadeUp(3.2)}
              animate={phase !== "idle" ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-3 sm:mt-8 rounded-full border border-[#D4AF37]/40 px-6 py-2 font-sans text-xs tracking-[0.2em] uppercase text-[#D4AF37] transition-colors hover:border-[#D4AF37]/70 hover:text-[#F7E7CE]"
              onClick={handleOpenCard}
              disabled={phase !== "idle"}
            >
              {t("invitation.openCta")}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

