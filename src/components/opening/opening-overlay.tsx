import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

const SYMBOL_DELAY_MS = 300;
const HINT_DELAY_MS = 2000;
const OPENING_EXIT_MS = 2300;

type PointerState = {
  x: number;
  y: number;
  time: number;
};

export function OpeningOverlay({ onOpen, onOpenMusic }: { onOpen: () => void; onOpenMusic?: () => void }) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [symbolVisible, setSymbolVisible] = useState(false);
  const [monogramVisible, setMonogramVisible] = useState(true);
  const [hintVisible, setHintVisible] = useState(false);
  const [opening, setOpening] = useState(false);
  const [seamActive, setSeamActive] = useState(false);
  const [panelsOpen, setPanelsOpen] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const pointerStateRef = useRef<PointerState | null>(null);
  const openTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const symbolTimer = window.setTimeout(() => setSymbolVisible(true), SYMBOL_DELAY_MS);
    const hintTimer = window.setTimeout(() => setHintVisible(true), HINT_DELAY_MS);

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
    window.setTimeout(() => setSeamActive(true), 860);
    window.setTimeout(() => setPanelsOpen(true), 1260);
    openTimerRef.current = window.setTimeout(finishOpening, OPENING_EXIT_MS);
  }, [opening, onOpenMusic, reducedMotion, finishOpening]);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (opening) return;
    pointerStateRef.current = { x: event.clientX, y: event.clientY, time: performance.now() };
  }, [opening]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (opening) return;
    const start = pointerStateRef.current;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const distance = Math.hypot(deltaX, deltaY);
    if (distance > 14) {
      triggerOpen();
    }
  }, [opening, triggerOpen]);

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
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
  }, [opening, triggerOpen]);

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    if (opening) return;
    if (event.deltaY > 0) {
      event.preventDefault();
      triggerOpen();
    }
  }, [opening, triggerOpen]);

  const symbolStyle = useMemo(() => {
    if (!symbolVisible) {
      return { opacity: 0, scale: 0.95 };
    }

    return opening
      ? { opacity: 0, scale: 0.88 }
      : { opacity: 1, scale: 1 };
  }, [opening, symbolVisible]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="opening"
          role="dialog"
          aria-modal="true"
          aria-label="Wedding invitation opening screen"
          className="fixed inset-0 overflow-hidden bg-[#B13B3B]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.55, ease: EASE_CINEMATIC }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => (pointerStateRef.current = null)}
          onWheel={handleWheel}
          style={{ touchAction: "none" }}
        >
          <div className="opening-screen-vignette absolute inset-0" />
          <div className="opening-screen-grain pointer-events-none absolute inset-0" />

          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={false}
            animate={pulseActive && !reducedMotion ? { opacity: [0, 0.95, 0], scale: [0.94, 1, 1.28] } : { opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background: "radial-gradient(circle at center, rgba(246,232,195,0.42) 0%, rgba(246,232,195,0.14) 24%, rgba(246,232,195,0) 70%)",
            }}
          />

          {!reducedMotion && (
            <div aria-hidden="true" className="absolute inset-0 z-20 overflow-hidden">
              <motion.div
                className="opening-panel absolute inset-y-0 left-0 w-1/2 origin-right border-r border-white/12 shadow-[10px_0_48px_rgba(72,12,12,0.28)]"
                initial={{ x: 0 }}
                animate={panelsOpen ? { x: "-110%", skewY: -2 } : { x: 0, skewY: 0 }}
                transition={{ duration: 2, ease: EASE_CINEMATIC }}
                style={{ transformOrigin: "100% 50%" }}
              />
              <motion.div
                className="opening-panel absolute inset-y-0 right-0 w-1/2 origin-left border-l border-white/12 shadow-[-10px_0_48px_rgba(72,12,12,0.28)]"
                initial={{ x: 0 }}
                animate={panelsOpen ? { x: "110%", skewY: 2 } : { x: 0, skewY: 0 }}
                transition={{ duration: 2, ease: EASE_CINEMATIC }}
                style={{ transformOrigin: "0% 50%" }}
              />

              <motion.div
                className="absolute left-1/2 top-0 z-30 h-full w-[2px] -translate-x-1/2 bg-[#F6E8C3]/80 shadow-[0_0_24px_rgba(246,232,195,0.65)]"
                initial={{ opacity: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" }}
                animate={seamActive && !panelsOpen ? { opacity: 1, filter: ["drop-shadow(0 0 0 rgba(0,0,0,0))", "drop-shadow(0 0 18px rgba(246,232,195,0.5))", "drop-shadow(0 0 12px rgba(246,232,195,0.4))"] } : { opacity: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{ transformOrigin: "50% 50%" }}
              />
              <motion.div
                className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(246,232,195,0.15)_0%,rgba(246,232,195,0.06)_18%,rgba(0,0,0,0)_58%)]"
                initial={false}
                animate={panelsOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          )}

          <div className="relative z-10 flex h-full w-full items-center justify-center px-6 text-center">
            <div className="flex flex-col items-center">
              <motion.div
                aria-hidden="true"
                className="mb-6 text-[11px] font-semibold tracking-[0.55em] text-[#F6E8C3]/72 sm:text-xs"
                initial={false}
                animate={monogramVisible && !opening ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                Hoàng Minh 💕 Hà Phương
              </motion.div>
              <motion.div
                className="opening-symbol select-none text-[#F6E8C3]"
                initial={false}
                animate={symbolStyle}
                transition={{ duration: reducedMotion ? 0.2 : opening ? 0.2 : 0.8, ease: "easeOut" }}
                style={{
                  fontSize: "clamp(7.5rem, 18vw, 12rem)",
                  lineHeight: 1,
                }}
              >
                囍
              </motion.div>

              <motion.p
                className="opening-hint mt-24 text-center text-[12px] font-medium tracking-[0.28em] text-[#F6E8C3]/78 sm:text-[13px]"
                initial={false}
                animate={opening || !hintVisible ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0.2 : 0.45, ease: "easeOut" }}
              >
                <span className="block">Vuốt để mở thiệp</span>
                <span className="mt-1 block text-[11px] tracking-[0.22em] text-[#F6E8C3]/64 sm:text-[12px]">Swipe to open</span>
              </motion.p> 
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


