
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

const SYMBOL_DELAY_MS = 300;
const HINT_DELAY_MS = 2000;
const OPENING_EXIT_MS = 760;

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
      window.clearTimeout(symbolTimer);
      window.clearTimeout(hintTimer);

      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  const finishOpening = useCallback(() => {
    setVisible(false);
  }, []);

  const handleExitComplete = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const triggerOpen = useCallback(() => {
    if (opening) return;

    onOpenMusic?.();

    setOpening(true);
    setHintVisible(false);
    setMonogramVisible(false);

    if (reducedMotion) {
      openTimerRef.current = window.setTimeout(finishOpening, 180);
      return;
    }

    setPulseActive(true);

    window.setTimeout(() => {
      setPanelsOpen(true);
    }, 140);

    openTimerRef.current = window.setTimeout(
      finishOpening,
      OPENING_EXIT_MS
    );
  }, [opening, onOpenMusic, reducedMotion, finishOpening]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (opening) return;

      pointerStateRef.current = {
        x: event.clientX,
        y: event.clientY,
        time: performance.now(),
      };
    },
    [opening]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (opening) return;

      const start = pointerStateRef.current;
      if (!start) return;

      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;

      const distance = Math.hypot(deltaX, deltaY);

      if (distance > 14) {
        triggerOpen();
      }
    },
    [opening, triggerOpen]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (opening) return;

      const start = pointerStateRef.current;
      pointerStateRef.current = null;

      if (!start) {
        triggerOpen();
        return;
      }

      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;

      const distance = Math.hypot(deltaX, deltaY);
      const elapsed = performance.now() - start.time;

      if (distance <= 14 && elapsed < 500) {
        triggerOpen();
        return;
      }

      if (deltaY < -24 || Math.abs(deltaX) > 24) {
        triggerOpen();
      }
    },
    [opening, triggerOpen]
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (opening) return;

      if (event.deltaY > 0) {
        event.preventDefault();
        triggerOpen();
      }
    },
    [opening, triggerOpen]
  );

  const symbolStyle = useMemo(() => {
    if (!symbolVisible) {
      return {
        opacity: 0,
        scale: 0.95,
      };
    }

    return opening
      ? {
          opacity: 1,
          scale: 1.06,
        }
      : {
          opacity: 1,
          scale: 1,
        };
  }, [opening, symbolVisible]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="opening"
          role="dialog"
          aria-modal="true"
          aria-label="Wedding invitation opening screen"
          className="fixed inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0.2 : 0.55,
            ease: EASE_CINEMATIC,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => (pointerStateRef.current = null)}
          onWheel={handleWheel}
          style={{
            touchAction: "none",
            background:
              "linear-gradient(90deg,#b42f2f 0%,#aa2323 35%,#981818 50%,#aa2323 65%,#b42f2f 100%)",
          }}
        >
          {/* Gold particles */}
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#D79A4A]"
              style={{
                width: Math.random() * 5 + 2,
                height: Math.random() * 5 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                y: [-8, 8, -8],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
              }}
            />
          ))}

          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={false}
            animate={
              pulseActive && !reducedMotion
                ? {
                    opacity: [0, 0.95, 0],
                    scale: [0.94, 1, 1.28],
                  }
                : {
                    opacity: 0,
                  }
            }
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(246,232,195,0.25) 0%, rgba(246,232,195,0.08) 24%, rgba(246,232,195,0) 70%)",
            }}
          />

          {!reducedMotion && (
            <>
              <motion.div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1/2 border-r border-white/10 shadow-[8px_0_40px_rgba(95,13,13,0.22)]"
                initial={false}
                animate={
                  panelsOpen
                    ? {
                        x: "-104%",
                      }
                    : {
                        x: 0,
                      }
                }
                transition={{
                  duration: 0.72,
                  ease: EASE_CINEMATIC,
                }}
              />

              <motion.div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-1/2 border-l border-white/10 shadow-[-8px_0_40px_rgba(95,13,13,0.22)]"
                initial={false}
                animate={
                  panelsOpen
                    ? {
                        x: "104%",
                      }
                    : {
                        x: 0,
                      }
                }
                transition={{
                  duration: 0.72,
                  ease: EASE_CINEMATIC,
                }}
              />
            </>
          )}

          <div className="relative z-10 flex h-full w-full items-center justify-center px-6 text-center">
            <div className="flex flex-col items-center">
              <motion.div
                aria-hidden="true"
                className="mb-6 text-[11px] font-semibold tracking-[0.55em] text-[#F6E8C3]/72 sm:text-xs"
                initial={false}
                animate={
                  monogramVisible && !opening
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -8 }
                }
                transition={{
                  duration: 0.28,
                  ease: "easeOut",
                }}
              >
                Hoàng Minh &amp; Hà Phương
              </motion.div>

              <motion.div
                className="select-none text-[#F6E8C3]"
                initial={false}
                animate={symbolStyle}
                transition={{
                  duration: reducedMotion
                    ? 0.2
                    : opening
                    ? 0.2
                    : 0.8,
                  ease: "easeOut",
                }}
                style={{
                  fontSize: "clamp(7.5rem,18vw,12rem)",
                  lineHeight: 1,
                  textShadow:
                    "0 0 12px rgba(246,232,195,0.25),0 0 28px rgba(246,232,195,0.15)",
                }}
              >
                囍
              </motion.div>

              <motion.p
                className="mt-24 text-center text-[12px] font-medium tracking-[0.28em] text-[#F6E8C3]/78 sm:text-[13px]"
                initial={false}
                animate={
                  hintVisible && !opening
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 8 }
                }
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}
              >
                <span className="block">
                  Vuốt để mở thiệp
                </span>

                <span className="mt-1 block text-[11px] tracking-[0.22em] text-[#F6E8C3]/64 sm:text-[12px]">
                  Swipe to open
                </span>
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

