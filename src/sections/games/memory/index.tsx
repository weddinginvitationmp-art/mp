import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GameShell } from "../game-shell";
import type { GameKind } from "../types";
import { MemoryCardTile } from "./memory-card";
import { useMemoryGame } from "./use-memory-game";

interface Props {
  onClose: () => void;
  onSubmit: (input: { game: GameKind; score: number; meta: Record<string, unknown> }) => void;
}

/**
 * Love Memory: 12 pairs, flip to match.
 * Score = 1000 - moves*5 - seconds*2, floored at 0.
 */
export function MemoryGame({ onClose, onSubmit }: Props) {
  const { t } = useTranslation();
  const { deck, flipped, matched, moves, status, finalElapsedMs, computeElapsed, score, flip, reset } = useMemoryGame();
  const [submitted, setSubmitted] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Tick to refresh elapsed display while playing
  useEffect(() => {
    if (status !== "playing") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Submit once on completion
  useEffect(() => {
    if (status === "completed" && !submitted && score !== null) {
      onSubmit({
        game: "memory",
        score,
        meta: { moves, time_ms: finalElapsedMs },
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- guard against double-submit
      setSubmitted(true);
    }
  }, [status, submitted, score, moves, finalElapsedMs, onSubmit]);

  const elapsedMs = status === "completed" ? finalElapsedMs : computeElapsed(now);
  const seconds = Math.floor(elapsedMs / 1000);

  const handleReset = () => {
    setSubmitted(false);
    reset();
  };

  return (
    <GameShell
      title={t("games.memory.title")}
      subtitle={t("games.memory.subtitle")}
      onClose={onClose}
      onPlayAgain={status === "completed" ? handleReset : undefined}
    >
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest opacity-70">
        <span>{t("games.memory.moves", { count: moves })}</span>
        <span>{seconds}s</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {deck.map((card) => (
          <MemoryCardTile
            key={card.uid}
            card={card}
            flipped={flipped.includes(card.uid)}
            matched={matched.has(card.symbolId)}
            disabled={status === "completed"}
            onFlip={flip}
          />
        ))}
      </div>

      {status === "completed" && score !== null && (
        <div
          role="status"
          className="mt-4 rounded-soft border border-muted-gold/30 bg-accent/10 p-3 text-center text-sm"
        >
          <p className="font-display text-lg text-accent">{t("games.complete")}</p>
          <p className="mt-1 opacity-80">
            {t("games.scoreLabel")}: <span className="font-display text-on-surface">{score}</span>
          </p>
        </div>
      )}
    </GameShell>
  );
}
