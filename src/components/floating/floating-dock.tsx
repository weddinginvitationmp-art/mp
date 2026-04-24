import { useEffect, useRef, useState } from "react";
import { MusicToggle } from "./music-toggle";
import { QuickNavToggle } from "./quick-nav-toggle";
import { RsvpCtaPill } from "./rsvp-cta-pill";
import { ShareFab } from "./share-fab";

/**
 * Bottom-right FAB cluster:
 * - RSVP pill (wide, primary action)
 * - Share, Music, QuickNav (circular)
 *
 * Hides when the user scrolls down quickly (declutters mid-read), re-appears
 * as soon as they slow/scroll up. rAF-throttled to avoid iOS jitter.
 */
export function FloatingDock() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(typeof window === "undefined" ? 0 : window.scrollY);
  const rafPending = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (rafPending.current) return;
      rafPending.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY.current;
        if (dy > 8 && y > 200) setHidden(true);
        else if (dy < -4) setHidden(false);
        lastY.current = y;
        rafPending.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={hidden}
      className={`pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 transition-all duration-300 ${
        hidden ? "translate-y-20 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="pointer-events-auto">
        <RsvpCtaPill />
      </div>
      <div className="pointer-events-auto">
        <ShareFab />
      </div>
      <div className="pointer-events-auto">
        <MusicToggle />
      </div>
      <div className="pointer-events-auto">
        <QuickNavToggle />
      </div>
    </div>
  );
}
