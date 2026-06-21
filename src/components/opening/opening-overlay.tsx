import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "../../.../../styles/opening-overlay.css";
const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

const SYMBOL_DELAY_MS = 300;
const HINT_DELAY_MS = 2000;
const OPENING_EXIT_MS = 900;

type PointerState = {
  x: number;
  y: number;
  time: number;
};

export function OpeningOverlay({
  onOpen,
  onOpenMusic,
}: {
  onOpen: () => void;
  onOpenMusic?: () => void;
}) {
  const reducedMotion = useReducedMotion();

  const [visible, setVisible] = useState(true);
  const [symbolVisible, setSymbolVisible] = useState(false);
  const [monogramVisible, setMonogramVisible] = useState(true);
  const [hintVisible, setHintVisible] = useState(false);
  const [opening, setOpening] = useState(false);
  const [panelsOpen, setPanelsOpen] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  const pointerStateRef = useRef<PointerState | null>(null);
  const openTimerRef = useRef<number | null>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, index) => ({
        id: index,
        size: 2 + Math.random() * 5,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 4,
      })),
    []
  );

  useEffect(() => {
    const symbolTimer = window.setTimeout(
      () => setSymbolVisible(true),
      SYMBOL_DELAY_MS
    );

    const hintTimer = window.setTimeout(
      () => setHintVisible(true),
      HINT_DELAY_MS
    );

    return () => {
      clearTimeout(symbolTimer);
      clearTimeout(hintTimer);

      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  const finishOpening = useCallback(() => {
    setVisible(false);
  }, []);

  const triggerOpen = useCallback(() => {
    if (opening) return;

    onOpenMusic?.();

    setOpening(true);
    setHintVisible(false);
    setMonogramVisible(false);

    if (reducedMotion) {
      finishOpening();
      onOpen();
      return;
    }

    setPulseActive(true);

    setTimeout(() => {
      setPanelsOpen(true);
    }, 120);

    openTimerRef.current = window.setTimeout(() => {
      finishOpening();
      onOpen();
    }, OPENING_EXIT_MS);
  }, [opening, reducedMotion, finishOpening, onOpen, onOpenMusic]);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (opening) return;

    pointerStateRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
    };
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (opening) return;

    const start = pointerStateRef.current;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (Math.hypot(dx, dy) > 14) {
      triggerOpen();
    }
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (opening) return;

    const start = pointerStateRef.current;
    pointerStateRef.current = null;

    if (!start) {
      triggerOpen();
      return;
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (
      Math.hypot(dx, dy) < 14 ||
      dy < -24 ||
      Math.abs(dx) > 24
    ) {
      triggerOpen();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 overflow-hidden opening-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: EASE_CINEMATIC,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            touchAction: "none",
          }}
        >
          <div className="opening-screen-vignette" />
          <div className="opening-screen-grain" />

          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="gold-particle"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
              }}
            />
          ))}

          <motion.div
            className="absolute inset-0"
            animate={
              pulseActive
                ? {
                    opacity: [0, 1, 0],
                    scale: [0.9, 1, 1.3],
                  }
                : {}
            }
            transition={{ duration: 0.6 }}
            style={{
              background:
                "radial-gradient(circle,rgba(246,232,195,.35),transparent 70%)",
            }}
          />

          <motion.div
  className="
    absolute
    left-1/2
    top-0
    h-full
    w-[3px]
    -translate-x-1/2
    rounded-full
  "
  initial={false}
  animate={
    opening
      ? {
          opacity: [0.8, 1, 0],
          scaleX: [1, 2.5, 6],
        }
      : {
          opacity: 0.7,
          scaleX: 1,
        }
  }
  transition={{
    duration: 0.55,
    ease: EASE_CINEMATIC,
  }}
  style={{
    background:
      "linear-gradient(to bottom, transparent, #F6E8C3, transparent)",
    boxShadow:
      "0 0 12px rgba(246,232,195,.8),0 0 24px rgba(246,232,195,.4)"
  }}
/>

          {!reducedMotion && (
            <>
              <motion.div
                className="opening-panel left-panel"
                animate={panelsOpen ? { x: "-104%" } : { x: 0 }}
                transition={{
                  duration: 0.75,
                  ease: EASE_CINEMATIC,
                }}
              />

              <motion.div
                className="opening-panel right-panel"
                animate={panelsOpen ? { x: "104%" } : { x: 0 }}
                transition={{
                  duration: 0.75,
                  ease: EASE_CINEMATIC,
                }}
              />
            </>
          )}

          <div className="relative z-20 flex h-full items-center justify-center">
            <div className="text-center">
              <motion.div
                className="mb-6 opening-couple"
                animate={
                  monogramVisible
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -8 }
                }
              >
                HOÀNG MINH & HÀ PHƯƠNG
              </motion.div>

              <motion.div
                className="opening-symbol"
                animate={
                  symbolVisible
                    ? {
                        opacity: 1,
                        scale: opening ? 1.05 : 1,
                      }
                    : {
                        opacity: 0,
                        scale: 0.9,
                      }
                }
                transition={{
                  duration: 0.8,
                }}
              >
                囍
              </motion.div>

              <motion.div
                className="opening-hint mt-20"
                animate={
                  hintVisible && !opening
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 8 }
                }
              >
                <div>Vuốt để mở thiệp</div>
                <div className="text-xs mt-2">
                  Swipe to open
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}