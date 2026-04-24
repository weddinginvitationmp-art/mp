import { useEffect, useRef, useState } from "react";

/**
 * Magnetic hover effect: pointer pulls the element by `strength` px max.
 * Disabled on touch / coarse pointers and when prefers-reduced-motion is set.
 *
 * Returns `{ ref, style }`. Spread `style` onto the target element so the
 * translate is layered on top of any existing transform via CSS variables.
 */
export function useMagneticHover<T extends HTMLElement>(strength = 6) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isCoarse =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reduced) return;

    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setOffset({
          x: Math.max(-1, Math.min(1, dx)) * strength,
          y: Math.max(-1, Math.min(1, dy)) * strength,
        });
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      setOffset({ x: 0, y: 0 });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, [strength]);

  return {
    ref,
    style: {
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      transition: offset.x === 0 && offset.y === 0 ? "transform 300ms cubic-bezier(0.22,1,0.36,1)" : "none",
    } as const,
  };
}
