import type { AlbumPhoto } from "@/config/wedding";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Props {
  photo: AlbumPhoto;
  lang: "vi" | "en";
  onClick: () => void;
}

export function AlbumTile({ photo, lang, onClick }: Props) {
  const reduced = useReducedMotion();
  // hover:scale only on pointer-fine (mouse) — avoids misfire during scroll on touch
  const hoverScale = reduced ? "" : "[@media(hover:hover)]:hover:scale-[1.02]";

  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-2 block w-full overflow-hidden rounded-soft sm:mb-3"
      aria-label={photo.alt[lang]}
    >
      <img
        src={photo.src}
        alt={photo.alt[lang]}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className={`w-full transition duration-700 ease-out ${hoverScale}`}
      />
    </button>
  );
}
