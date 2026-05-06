import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  onOpen: () => void;
  compact?: boolean;
}

const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

export function GiftEnvelope({ onOpen, compact = false }: Props) {
  const { t } = useTranslation();
  const [state, setState] = useState<"closed" | "opening">("closed");

  const handleOpen = useCallback(() => {
    if (state !== "closed") return;
    setState("opening");
    setTimeout(onOpen, 700);
  }, [state, onOpen]);

  const size = compact ? "w-32" : "w-44 sm:w-48";

  return (
    <AnimatePresence>
      {state !== "opening" || true ? (
        <motion.div
          className="flex flex-col items-center gap-5 py-6"
          exit={{ opacity: 0, scale: 0.7, y: -30 }}
          transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
        >
          <motion.button
            type="button"
            onClick={handleOpen}
            className={`envelope-wobble relative ${size} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-lg`}
            aria-label={t("gift.envelopeHint")}
            animate={
              state === "opening"
                ? { scale: 0.5, opacity: 0, y: -40 }
                : {}
            }
            transition={{ duration: 0.5, ease: EASE_CINEMATIC }}
          >
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-xl"
              style={{
                background:
                  "linear-gradient(180deg, #C41E3A 0%, #8B1A1A 100%)",
              }}
            >
              {/* Gold flap */}
              <motion.div
                className="absolute inset-x-0 top-0 h-[35%] origin-top rounded-t-lg"
                style={{
                  background:
                    "linear-gradient(180deg, #D4AF37 0%, #B8935A 100%)",
                  borderBottom: "1px solid #C9A876",
                }}
                animate={
                  state === "opening" ? { rotateX: -180 } : {}
                }
                transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
              />

              {/* Flap triangle decoration */}
              <div
                className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderTop: "16px solid #B8935A",
                }}
              />

              {/* 囍 double happiness */}
              <div className="absolute inset-0 flex items-center justify-center pt-4">
                <span
                  className="text-5xl font-bold select-none"
                  style={{ color: "#D4AF37", opacity: 0.7 }}
                >
                  囍
                </span>
              </div>

              {/* Bottom decorative line */}
              <div className="absolute inset-x-4 bottom-4 h-px bg-[#D4AF37]/30" />
            </div>
          </motion.button>

          <motion.p
            className="text-xs uppercase tracking-[0.3em] text-accent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {t("gift.envelopeHint")}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
