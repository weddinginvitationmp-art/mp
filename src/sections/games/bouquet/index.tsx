import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/button";
import { GameShell } from "../game-shell";
import type { GameKind } from "../types";
import { BouquetSprite } from "./bouquet-sprite";
import { useBouquetLoop } from "./use-bouquet-loop";

interface Props {
  onClose: () => void;
  onSubmit: (input: { game: GameKind; score: number; meta: Record<string, unknown> }) => void;
}

const BOARD_HEIGHT = 340;

/**
 * 30-second falling-bouquet catch game.
 * +10 normal, +30 golden (rare), -5 per miss. Score clamped ≥ 0.
 */
export function BouquetGame({ onClose, onSubmit }: Props) {
  const { t } = useTranslation();
  const boardRef = useRef<HTMLDivElement>(null);
  const { sprites, score, caught, golden, missed, remainingMs, status, start, catchSprite } =
    useBouquetLoop({ height: BOARD_HEIGHT });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (status === "completed" && !submitted) {
      onSubmit({
        game: "bouquet",
        score,
        meta: { caught, golden, missed },
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- guard against double-submit
      setSubmitted(true);
    }
  }, [status, submitted, score, caught, golden, missed, onSubmit]);

  const handleStart = () => {
    setSubmitted(false);
    start();
  };

  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <GameShell
      title={t("games.bouquet.title")}
      subtitle={t("games.bouquet.subtitle")}
      onClose={onClose}
      onPlayAgain={status === "completed" ? handleStart : undefined}
    >
      {status === "idle" && (
        <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
          <p className="text-sm opacity-80">{t("games.bouquet.instructions")}</p>
          <Button variant="primary" onClick={handleStart}>
            {t("games.play")}
          </Button>
        </div>
      )}

      {status !== "idle" && (
        <div>
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest opacity-80">
            <span>⏱ {seconds}s</span>
            <span>{t("games.scoreLabel")}: <span className="text-muted-gold">{score}</span></span>
          </div>
          <div
            ref={boardRef}
            className="relative overflow-hidden rounded-soft border border-muted-gold/20 bg-ink/40"
            style={{ height: BOARD_HEIGHT }}
            aria-label={t("games.bouquet.title")}
          >
            {sprites.map((s) => (
              <BouquetSprite key={s.id} sprite={s} onCatch={catchSprite} />
            ))}
          </div>
        </div>
      )}

      {status === "completed" && (
        <div
          role="status"
          className="mt-4 rounded-soft border border-muted-gold/30 bg-muted-gold/10 p-3 text-center text-sm"
        >
          <p className="font-display text-lg text-muted-gold">{t("games.complete")}</p>
          <p className="mt-1 opacity-80">
            {t("games.bouquet.summary", { caught, golden, missed })}
          </p>
          <p className="mt-1 opacity-80">
            {t("games.scoreLabel")}: <span className="font-display text-ivory">{score}</span>
          </p>
        </div>
      )}
    </GameShell>
  );
}
