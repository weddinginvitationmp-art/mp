import { useTranslation } from "react-i18next";
import { useBackgroundMusic } from "@/hooks/use-background-music";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { FabButton } from "./fab-button";

export function MusicToggle() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const { playing, toggle } = useBackgroundMusic();

  if (reduced) {
    // Don't surface music controls when user prefers reduced motion / sensory load.
    return null;
  }

  return (
    <FabButton
      aria-label={t(playing ? "floating.musicPause" : "floating.musicPlay")}
      aria-pressed={playing}
      onClick={toggle}
    >
      <span aria-hidden="true" className="text-base">
        {playing ? "♪" : "♫"}
      </span>
    </FabButton>
  );
}
