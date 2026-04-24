import { useTranslation } from "react-i18next";
import type { GameKind } from "./types";

interface Props {
  onPick: (game: GameKind) => void;
}

/**
 * Three cards that open the corresponding game in a bottom sheet.
 * Each card has a distinct eyebrow glyph (•, ?, ✿) to evoke the game genre.
 */
export function GamePicker({ onPick }: Props) {
  const { t } = useTranslation();

  const games: Array<{ kind: GameKind; glyph: string }> = [
    { kind: "memory", glyph: "❖" },
    { kind: "quiz", glyph: "?" },
    { kind: "bouquet", glyph: "✿" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {games.map(({ kind, glyph }) => (
        <button
          key={kind}
          type="button"
          onClick={() => onPick(kind)}
          className="group relative overflow-hidden rounded-soft border border-muted-gold/20 bg-surface-muted p-6 text-left transition hover:border-muted-gold/50 hover:bg-surface-muted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold/40 min-h-[140px] touch-action-manipulation"
          aria-label={t(`games.${kind}.title`)}
        >
          <div className="mb-3 font-display text-3xl text-accent opacity-70 group-hover:opacity-100">
            {glyph}
          </div>
          <p className="font-display text-lg text-on-surface">{t(`games.${kind}.title`)}</p>
          <p className="mt-1 text-xs opacity-60">{t(`games.${kind}.tagline`)}</p>
        </button>
      ))}
    </div>
  );
}
