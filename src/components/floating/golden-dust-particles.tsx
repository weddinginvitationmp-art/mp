import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Dust = {
  x: number;
  y: number;
  z: number; // parallax depth
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  a: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * Floating Golden Dust (super-lightweight canvas particles)
 * - mounted under dark background everywhere
 * - parallax responds to scroll
 */
export function GoldenDustParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dustRef = useRef<Dust[]>([]);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const scrollYRef = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleScroll = () => {
      scrollYRef.current = window.scrollY || 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const init = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h, dpr };

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const targetCount = Math.round((w * h) / 45000); // adaptive density
      const count = Math.max(28, Math.min(90, targetCount));

      dustRef.current = new Array(count).fill(null).map(() => {
        const z = rand(0.2, 1);
        return {
          x: rand(0, w),
          y: rand(0, h),
          z,
          vx: rand(-0.05, 0.05) * (1 / z),
          vy: rand(-0.08, -0.02) * (1 / z),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.002, 0.002) * (1 / z),
          size: rand(0.6, 1.8) * (1 / z),
          a: rand(0.12, 0.5),
        };
      });
    };

    init();

    const draw = (t: number) => {
      const { w, h, dpr } = sizeRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Transparent clear (we keep subtle streak by clearing fully)
      ctx.clearRect(0, 0, w, h);

      const time = t * 0.001;
      const scroll = scrollYRef.current;

      for (const p of dustRef.current) {
        const parallax = (scroll * 0.02) / (p.z * 1.2);
        const x = p.x + parallax + Math.sin(time * 0.25 + p.rot) * (0.2 / p.z);
        const y = p.y + time * 6 * (0.04 / p.z);

        // Drift
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        // Wrap
        if (p.y < -10) {
          p.y = h + rand(10, 80);
          p.x = rand(0, w);
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        // Golden sparkle dot
        const tw = 0.5 + 0.5 * Math.sin(time * (0.7 + 0.4 / p.z) + p.rot);
        const alpha = p.a * (0.6 + 0.4 * tw);

        ctx.beginPath();
        ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    if (!reduced) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      // reduced motion: draw a single static frame
      draw(performance.now());
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }

    const onResize = () => init();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

