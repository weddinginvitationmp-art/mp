import { useEffect, useState } from "react";

/**
 * Tracks which section id is most visible in the viewport.
 * IntersectionObserver maintains a per-id ratio map; the active id is the one
 * with the highest current ratio. Top/bottom rootMargin biases the active band
 * toward the central reading area so the active id flips at a comfortable point.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));
        let bestId: string | null = null;
        let bestRatio = 0;
        ratios.forEach((r, id) => {
          if (r > bestRatio) {
            bestRatio = r;
            bestId = id;
          }
        });
        if (bestId) setActive(bestId);
      },
      { threshold: [0.1, 0.3, 0.5, 0.7], rootMargin: "-20% 0px -40% 0px" },
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);

  return active;
}
