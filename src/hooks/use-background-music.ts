import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wi.music";
const AUDIO_SOURCES = [
  `${import.meta.env.BASE_URL}audio/ambient-loop.mp3`,
];
const TARGET_VOLUME = 0.4;
const FADE_IN_MS = 800;
const FADE_OUT_MS = 400;
const MUSIC_EVENT = "wi-music-sync";

interface Api {
  playing: boolean;
  toggle: () => void;
  audioEl: HTMLAudioElement | null;
}

let sharedAudio: HTMLAudioElement | null = null;
let sharedPlaying = false;
let fadeHandle: number | null = null;

const clampVolume = (value: number) => Math.max(0, Math.min(1, value));
const pickSource = () => AUDIO_SOURCES[Math.floor(Math.random() * AUDIO_SOURCES.length)];

const broadcastMusicState = () => {
  window.dispatchEvent(new CustomEvent(MUSIC_EVENT, { detail: { playing: sharedPlaying } }));
};

const ensureSharedAudio = (): HTMLAudioElement => {
  if (sharedAudio) return sharedAudio;
  const audio = new Audio(pickSource());
  audio.loop = true;
  audio.volume = 0;
  audio.preload = "auto";
  sharedAudio = audio;
  (window as any).__sharedAudio = audio;
  return audio;
};

const cancelSharedFade = () => {
  if (fadeHandle !== null) cancelAnimationFrame(fadeHandle);
  fadeHandle = null;
};

const fadeSharedAudio = (target: number, durationMs: number, onDone?: () => void) => {
  const audio = ensureSharedAudio();
  cancelSharedFade();
  const startVol = clampVolume(audio.volume);
  const startAt = performance.now();

  const step = (time: number) => {
    const k = Math.min(1, (time - startAt) / durationMs);
    audio.volume = clampVolume(startVol + (target - startVol) * k);
    if (k < 1) {
      fadeHandle = requestAnimationFrame(step);
    } else {
      fadeHandle = null;
      audio.volume = clampVolume(target);
      onDone?.();
    }
  };

  fadeHandle = requestAnimationFrame(step);
};

export const playBackgroundMusic = async (): Promise<boolean> => {
  const audio = ensureSharedAudio();
  if (sharedPlaying) return true;

  try {
    await audio.play();
    audio.volume = 0;
    fadeSharedAudio(TARGET_VOLUME, FADE_IN_MS);
    sharedPlaying = true;
    broadcastMusicState();
    try {
      localStorage.setItem(STORAGE_KEY, "on");
    } catch {
      /* ignore */
    }
    return true;
  } catch (error) {
    console.warn("Background music failed to play:", error);
    sharedPlaying = false;
    broadcastMusicState();
    return false;
  }
};

const stopBackgroundMusic = () => {
  const audio = sharedAudio;
  if (!audio) return;
  fadeSharedAudio(0, FADE_OUT_MS, () => {
    audio.pause();
    sharedPlaying = false;
    broadcastMusicState();
  });
  try {
    localStorage.setItem(STORAGE_KEY, "off");
  } catch {
    /* ignore */
  }
};

/**
 * Lazily constructs an HTMLAudioElement on first user interaction.
 * - Persists the user's preference in localStorage but never autoplays
 *   (browser policy + respect user intent).
 * - Pauses on tab hide; restores on visibility if previously playing.
 * - Volume ramps to avoid clicks/pops.
 */
export function useBackgroundMusic(): Api {
  const [playing, setPlaying] = useState(() => sharedPlaying);

  const toggle = useCallback(() => {
    if (playing) {
      stopBackgroundMusic();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    void playBackgroundMusic().then((started) => {
      if (!started) {
        setPlaying(false);
      }
    });
  }, [playing]);

  useEffect(() => {
    const onVis = () => {
      const audio = sharedAudio;
      if (!audio) return;
      if (document.hidden && !audio.paused) {
        audio.pause();
      } else if (!document.hidden && sharedPlaying && audio.paused) {
        void audio.play();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const handleMusicSync = (event: Event) => {
      const customEvent = event as CustomEvent<{ playing: boolean }>;
      setPlaying(customEvent.detail.playing);
    };
    window.addEventListener(MUSIC_EVENT, handleMusicSync);
    return () => window.removeEventListener(MUSIC_EVENT, handleMusicSync);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelSharedFade();
      const audio = sharedAudio;
      if (audio) {
        audio.pause();
        audio.src = "";
        sharedAudio = null;
        sharedPlaying = false;
      }
    };
  }, []);

  return { playing, toggle, audioEl: sharedAudio };
}
