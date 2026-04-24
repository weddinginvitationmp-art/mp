import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { WeddingVideo } from "@/config/wedding";

interface Props {
  video: WeddingVideo;
}

/**
 * YouTube facade pattern: render a poster + play button, only swap in
 * the actual iframe on user click. Saves ~700KB of YouTube JS on initial
 * page load.
 */
export function VideoPlayer({ video }: Props) {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
        title={t("video.title")}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="size-full border-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={t("video.play")}
      className="group absolute inset-0 size-full"
    >
      <img
        src={video.posterImage}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />
      <span className="absolute inset-0 grid place-items-center bg-surface/30 transition group-hover:bg-surface/40">
        <span className="grid h-20 w-20 place-items-center rounded-full border border-border-subtle/40 bg-surface/20 backdrop-blur-md transition group-hover:scale-110">
          <svg
            width="22"
            height="26"
            viewBox="0 0 22 26"
            fill="currentColor"
            aria-hidden="true"
            className="ml-1 text-on-surface"
          >
            <path d="M0 0v26l22-13z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
