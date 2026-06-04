import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ConfettiPiece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  hue: number;
  life: number;
  maxLife: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function ConfettiCelebration({
  run,
  durationMs = 3000,
  onDone,
}: {
  run: boolean;
  durationMs?: number;
  onDone: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [seed, setSeed] = useState(0);
  const reduced = useReducedMotion();

  const colors = useMemo(
    () => [45, 52, 35, 20, 48],
    [],
  );

  useEffect(() => {
    if (!run) return;
    setSeed((s) => s + 1);
    const t = window.setTimeout(() => onDone(), durationMs);
    return () => window.clearTimeout(t);
  }, [run, durationMs, onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!run) return;

    if (reduced) {
      // Reduced motion: just a quick fade flash.
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      return;
    }

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    const pieces: ConfettiPiece[] = [];
    const count = Math.round(Math.max(120, Math.min(260, (window.innerWidth * window.innerHeight) / 7000)));

    for (let i = 0; i < count; i++) {
      const fromLeft = rand(0.25, 0.75);
      pieces.push({
        x: window.innerWidth * fromLeft + rand(-40, 40),
        y: rand(-40, -10),
        vx: rand(-1.4, 1.4) * rand(0.2, 1),
        vy: rand(3.4, 7.2),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.18, 0.18),
        size: rand(4, 9),
        // Index có thể ra ngoài biên do `rand`.
        // Force-safe by clamping index so TS không còn suy luận undefined.
        hue: (() => {
          const len = colors.length;
          if (len <= 0) return 45;
          const idx = Math.max(0, Math.min(len - 1, Math.floor(rand(0, len))));
          return colors[idx] ?? colors[0] ?? 45;
        })() + rand(-6, 6),
        life: 0,
        maxLife: rand(2200, 3200),
      });
    }

    const start = performance.now();

    const tick = (now: number) => {
      const w = canvas.width;
      const h = canvas.height;

      // `dpr` is a number captured from the enclosing scope; make TS/std logic unambiguous.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);


      const elapsed = now - start;
      for (const p of pieces) {
        const dt = 16;
        p.life += dt;

        p.x += p.vx;
        p.y += p.vy + (p.life / 30) * 0.06;
        p.vy += 0.03; // gravity
        p.rot += p.vr;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        if (alpha <= 0) continue;

        const tw = 0.6 + 0.4 * Math.sin((now * 0.01) + p.rot);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha * (0.65 + 0.35 * tw);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, 1)`;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size / 1.6);
        ctx.restore();
      }

      if (elapsed < durationMs) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [run, seed, durationMs, reduced, colors]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
}

