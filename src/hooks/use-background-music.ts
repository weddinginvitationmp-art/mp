import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "wi.music";
// Silent placeholder; couple replaces with real ambient loop before launch.
const AUDIO_SRC = "/audio/ambient-loop.mp3";
const TARGET_VOLUME = 0.4;
const FADE_IN_MS = 800;
const FADE_OUT_MS = 400;

interface Api {
  playing: boolean;
  toggle: () => void;
}

/**
 * Lazily constructs an HTMLAudioElement on first user interaction.
 * - Persists the user's preference in localStorage but never autoplays
 *   (browser policy + respect user intent).
 * - Pauses on tab hide; restores on visibility if previously playing.
 * - Volume ramps to avoid clicks/pops.
 */
export function useBackgroundMusic(): Api {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "none";
    audioRef.current = audio;
    return audio;
  }, []);

  const cancelFade = () => {
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
    fadeRef.current = null;
  };

  const fadeTo = useCallback((target: number, durationMs: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelFade();
    const startVol = audio.volume;
    const startAt = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - startAt) / durationMs);
      audio.volume = startVol + (target - startVol) * k;
      if (k < 1) {
        fadeRef.current = requestAnimationFrame(step);
      } else {
        fadeRef.current = null;
        onDone?.();
      }
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const toggle = useCallback(() => {
    const audio = ensureAudio();
    if (playing) {
      fadeTo(0, FADE_OUT_MS, () => audio.pause());
      setPlaying(false);
      try {
        localStorage.setItem(STORAGE_KEY, "off");
      } catch {
        /* ignore */
      }
    } else {
      audio.play().then(() => {
        fadeTo(TARGET_VOLUME, FADE_IN_MS);
      }).catch(() => {
        /* play() rejected — likely no user gesture or missing file */
      });
      setPlaying(true);
      try {
        localStorage.setItem(STORAGE_KEY, "on");
      } catch {
        /* ignore */
      }
    }
  }, [playing, ensureAudio, fadeTo]);

  // Pause on tab hide; resume on visibility if previously playing
  useEffect(() => {
    const onVis = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden && !audio.paused) {
        audio.pause();
      } else if (!document.hidden && playing && audio.paused) {
        void audio.play();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [playing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelFade();
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  return { playing, toggle };
}
