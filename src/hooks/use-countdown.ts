import { useEffect, useState } from "react";

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasPassed: boolean;
}

const ZERO: CountdownState = { days: 0, hours: 0, minutes: 0, seconds: 0, hasPassed: false };

function compute(target: Date): CountdownState {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    hasPassed: diff === 0,
  };
}

/**
 * Tick every 1s; resync on tab visibility regain so values stay correct
 * after the browser throttled the timer in a backgrounded tab.
 *
 * SSR note: returns zeros on first render to avoid hydration mismatch.
 * Acceptable since this app is SPA-only today.
 */
export function useCountdown(target: Date): CountdownState {
  const [state, setState] = useState<CountdownState>(ZERO);

  useEffect(() => {
    const tick = () => setState(compute(target));
    tick();
    const id = window.setInterval(tick, 1000);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [target]);

  return state;
}
