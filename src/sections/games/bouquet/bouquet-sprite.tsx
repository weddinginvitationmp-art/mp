import type { PointerEvent } from "react";
import type { Sprite } from "./spawn-controller";

interface Props {
  sprite: Sprite;
  onCatch: (id: number) => void;
}

/**
 * Single falling bouquet. Pure CSS transform via inline style for rAF efficiency.
 * Tap target padded so visual sprite remains compact while hit-area stays ≥48px.
 */
export function BouquetSprite({ sprite, onCatch }: Props) {
  const handle = (e: PointerEvent) => {
    e.preventDefault();
    if (sprite.caught) return;
    onCatch(sprite.id);
  };

  const golden = sprite.kind === "golden";

  return (
    <button
      type="button"
      onPointerDown={handle}
      aria-label={golden ? "Golden bouquet" : "Bouquet"}
      className="absolute -translate-x-1/2 touch-action-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold/40"
      style={{
        left: `${sprite.x}%`,
        top: 0,
        transform: `translate3d(-50%, ${sprite.y}px, 0)`,
        opacity: sprite.caught ? 0 : 1,
        transition: sprite.caught ? "opacity 200ms, transform 200ms" : "opacity 150ms",
        willChange: "transform",
      }}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full text-3xl ${
          golden ? "text-muted-gold drop-shadow-[0_0_12px_rgba(201,168,118,0.6)]" : "text-blush"
        }`}
        aria-hidden="true"
      >
        {golden ? "✿" : "❀"}
      </span>
    </button>
  );
}
