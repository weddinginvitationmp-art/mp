import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  audioEl: HTMLAudioElement | null;
  enabled: boolean;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

type AudioGraph = {
  audioCtx: AudioContext;
  source: MediaElementAudioSourceNode;
  analyser: AnalyserNode;
  refCount: number;
};

const audioGraphs = new WeakMap<HTMLAudioElement, AudioGraph>();

const getAudioGraph = (audioEl: HTMLAudioElement): AudioGraph | null => {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;

  const existing = audioGraphs.get(audioEl);
  if (existing) {
    existing.refCount += 1;
    return existing;
  }

  const audioCtx = new AudioCtx();
  const source = audioCtx.createMediaElementSource(audioEl);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.8;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  audioCtx.resume().catch(() => {
    // AudioContext may be suspended until a user gesture occurs.
  });

  const graph: AudioGraph = {
    audioCtx,
    source,
    analyser,
    refCount: 1,
  };

  audioGraphs.set(audioEl, graph);
  return graph;
};

const releaseAudioGraph = (audioEl: HTMLAudioElement) => {
  const graph = audioGraphs.get(audioEl);
  if (!graph) return;
  graph.refCount -= 1;
  if (graph.refCount > 0) return;
  // Keep the audio graph alive for the lifetime of the document.
  // createMediaElementSource() can only be called once per element,
  // so do not close and recreate the graph after toggle cycles.
};

/**
 * Sound Wave Visualizer (bouncing bars)
 * Uses WebAudio analyser from the provided HTMLAudioElement.
 */
export function SoundWaveVisualizer({ audioEl, enabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!enabled || !audioEl || reduced) {
      const { width, height } = canvas;
      if (width && height) ctx.clearRect(0, 0, width, height);
      return;
    }

    const graph = getAudioGraph(audioEl);
    if (!graph) return;

    const { analyser } = graph;
    const bufferLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLen);
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || 120;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    const draw = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const bars = 48;
      const step = Math.max(1, Math.floor(bufferLen / bars));
      const baseY = (canvas.clientHeight || 120) - 10;

      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < bars; i++) {
        const idx = i * step;
        analyser.getByteFrequencyData(data);
        const v = (data[idx] ?? 0) / 255;
        const amp = Math.pow(v, 1.2);

        const x = (i / bars) * (canvas.clientWidth || window.innerWidth);
        const barW = Math.max(2, (canvas.clientWidth || window.innerWidth) / bars - 1);
        const height = clamp(amp * 90, 4, 90);

        const y = baseY - height;
        const hue = 45 + amp * 20;
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.01 + i * 0.35);
        const alpha = 0.15 + 0.35 * amp;

        ctx.fillStyle = `hsla(${hue}, 90%, 60%, ${alpha})`;
        ctx.fillRect(x, y, barW, height * pulse);

        ctx.fillStyle = `rgba(243, 215, 120, ${alpha * 0.85})`;
        ctx.fillRect(x, y + 2, barW * 0.65, height * 0.35);
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      releaseAudioGraph(audioEl);
    };
  }, [audioEl, enabled, reduced]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[1] h-28"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-90"
      />
    </div>
  );
}

