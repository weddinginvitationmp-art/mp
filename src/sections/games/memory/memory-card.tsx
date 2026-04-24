import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { MemoryCard } from "./card-deck";

interface Props {
  card: MemoryCard;
  flipped: boolean;
  matched: boolean;
  disabled: boolean;
  onFlip: (uid: string) => void;
}

export function MemoryCardTile({ card, flipped, matched, disabled, onFlip }: Props) {
  const reduced = useReducedMotion();
  const showFace = flipped || matched;

  return (
    <button
      type="button"
      disabled={disabled || matched}
      onClick={() => onFlip(card.uid)}
      aria-label={showFace ? card.label : "Hidden card"}
      aria-pressed={showFace}
      className="relative aspect-[3/4] min-h-[56px] rounded-soft border border-muted-gold/20 bg-ivory/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold/40 disabled:cursor-default touch-action-manipulation active:scale-[0.98]"
      style={{ perspective: reduced ? undefined : 600 }}
    >
      <motion.div
        className="absolute inset-0"
        animate={reduced ? {} : { rotateY: showFace ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: reduced ? undefined : "preserve-3d" }}
      >
        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-soft bg-ivory/5 text-muted-gold/40 font-display text-xl"
          style={reduced ? undefined : { backfaceVisibility: "hidden" }}
        >
          {reduced && showFace ? card.glyph : "♦"}
        </div>
        {/* Face */}
        {!reduced && (
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-soft font-display text-3xl ${
              matched ? "bg-muted-gold/15 text-muted-gold" : "bg-ivory/10 text-ivory"
            }`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {card.glyph}
          </div>
        )}
      </motion.div>
    </button>
  );
}
