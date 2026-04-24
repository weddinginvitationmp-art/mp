import { useEffect } from "react";

type Listener = (msg: string | null) => void;

let listeners: Listener[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

/**
 * Singleton toast bus. No portal library needed — rendered once at SiteLayout root.
 */
export function showToast(msg: string, ms = 2000): void {
  listeners.forEach((l) => l(msg));
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => listeners.forEach((l) => l(null)), ms);
}

export function useToastListener(cb: Listener): void {
  useEffect(() => {
    listeners.push(cb);
    return () => {
      listeners = listeners.filter((l) => l !== cb);
    };
  }, [cb]);
}
