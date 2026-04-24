import { useCallback, useEffect, useRef, useState } from "react";
import {
  FALL_VY_MAX,
  FALL_VY_MIN,
  GOLDEN_RATE,
  MAX_SPRITES,
  PENALTY_MISS,
  POINTS_GOLDEN,
  POINTS_NORMAL,
  ROUND_DURATION_MS,
  SPAWN_MAX_MS,
  SPAWN_MIN_MS,
  type Sprite,
} from "./spawn-controller";

type Status = "idle" | "playing" | "completed";

interface BoardSize {
  height: number;
}

export function useBouquetLoop(size: BoardSize) {
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [golden, setGolden] = useState(0);
  const [missed, setMissed] = useState(0);
  const [remainingMs, setRemainingMs] = useState(ROUND_DURATION_MS);
  const [status, setStatus] = useState<Status>("idle");

  const idRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const nextSpawnRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

  const start = useCallback(() => {
    setSprites([]);
    setScore(0);
    setCaught(0);
    setGolden(0);
    setMissed(0);
    setRemainingMs(ROUND_DURATION_MS);
    idRef.current = 0;
    lastFrameRef.current = null;
    nextSpawnRef.current = SPAWN_MIN_MS;
    startedAtRef.current = performance.now();
    setStatus("playing");
  }, []);

  const stop = useCallback(() => {
    setStatus("completed");
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const catchSprite = useCallback((id: number) => {
    setSprites((list) => {
      const target = list.find((s) => s.id === id);
      if (!target || target.caught) return list;
      if (target.kind === "golden") {
        setScore((s) => s + POINTS_GOLDEN);
        setGolden((g) => g + 1);
      } else {
        setScore((s) => s + POINTS_NORMAL);
      }
      setCaught((c) => c + 1);
      return list.map((s) => (s.id === id ? { ...s, caught: true } : s));
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (status !== "playing") return;

    let spawnAccumulator = 0;

    const loop = (t: number) => {
      const last = lastFrameRef.current ?? t;
      const dt = t - last;
      lastFrameRef.current = t;

      // Remaining time
      const elapsed = t - startedAtRef.current;
      const remain = Math.max(0, ROUND_DURATION_MS - elapsed);
      setRemainingMs(remain);
      if (remain <= 0) {
        stop();
        return;
      }

      // Spawn
      spawnAccumulator += dt;
      if (spawnAccumulator >= nextSpawnRef.current) {
        spawnAccumulator = 0;
        nextSpawnRef.current = SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
        setSprites((list) => {
          if (list.length >= MAX_SPRITES) return list;
          const kind: "normal" | "golden" = Math.random() < GOLDEN_RATE ? "golden" : "normal";
          return [
            ...list,
            {
              id: ++idRef.current,
              x: 5 + Math.random() * 90,
              y: -40,
              vy: FALL_VY_MIN + Math.random() * (FALL_VY_MAX - FALL_VY_MIN),
              kind,
              caught: false,
            },
          ];
        });
      }

      // Advance sprites, prune fallen
      setSprites((list) => {
        let missedDelta = 0;
        const next: Sprite[] = [];
        list.forEach((s) => {
          if (s.caught) {
            // Keep caught sprites for brief fade; drop if old
            if (s.y < size.height + 120) next.push({ ...s, y: s.y - 2 });
            return;
          }
          const ny = s.y + s.vy * dt;
          if (ny > size.height) {
            missedDelta += 1;
            return;
          }
          next.push({ ...s, y: ny });
        });
        if (missedDelta > 0) {
          setMissed((m) => m + missedDelta);
          setScore((sc) => Math.max(0, sc - PENALTY_MISS * missedDelta));
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [status, size.height, stop]);

  return {
    sprites,
    score,
    caught,
    golden,
    missed,
    remainingMs,
    status,
    start,
    stop,
    catchSprite,
  };
}
