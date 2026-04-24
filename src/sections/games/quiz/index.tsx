import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GameShell } from "../game-shell";
import type { GameKind } from "../types";
import { QUIZ_OPTIONS } from "./questions";
import { useQuizState } from "./use-quiz-state";

interface Props {
  onClose: () => void;
  onSubmit: (input: { game: GameKind; score: number; meta: Record<string, unknown> }) => void;
}

/**
 * 8-question couple-trivia quiz.
 * Score = correctCount * 125 (max 1000).
 */
export function QuizGame({ onClose, onSubmit }: Props) {
  const { t } = useTranslation();
  const { current, idx, total, selected, phase, correctCount, score, select, advance, reset } = useQuizState();
  const [submitted, setSubmitted] = useState(false);

  // Auto-advance 1200ms after reveal
  useEffect(() => {
    if (phase !== "revealing") return;
    const id = setTimeout(advance, 1200);
    return () => clearTimeout(id);
  }, [phase, advance]);

  useEffect(() => {
    if (phase === "completed" && !submitted) {
      onSubmit({ game: "quiz", score, meta: { correct: correctCount, total } });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- guard against double-submit
      setSubmitted(true);
    }
  }, [phase, submitted, score, correctCount, total, onSubmit]);

  const handleReset = () => {
    setSubmitted(false);
    reset();
  };

  return (
    <GameShell
      title={t("games.quiz.title")}
      subtitle={phase === "completed" ? undefined : `${idx + 1} / ${total}`}
      onClose={onClose}
      onPlayAgain={phase === "completed" ? handleReset : undefined}
    >
      {phase !== "completed" && current && (
        <div>
          <p className="mb-6 text-center font-display text-lg text-on-surface">
            {t(`games.quiz.${current.id}.question`)}
          </p>
          <div
            role="radiogroup"
            aria-label={t("games.quiz.title")}
            className="flex flex-col gap-2"
          >
            {QUIZ_OPTIONS.map((opt) => {
              const isSelected = selected === opt;
              const isCorrect = current.correct === opt;
              const revealing = phase === "revealing";
              const stateClass = revealing
                ? isCorrect
                  ? "border-sage bg-sage/15 text-on-surface"
                  : isSelected
                    ? "border-blush bg-blush/15 text-on-surface"
                    : "border-border-subtle opacity-50"
                : "border-border-subtle hover:border-muted-gold/50 hover:bg-surface-muted";
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={revealing}
                  onClick={() => select(opt)}
                  className={`min-h-[48px] rounded-soft border px-4 py-3 text-left text-sm transition touch-action-manipulation active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold/40 ${stateClass}`}
                >
                  <span className="mr-3 font-display text-xs uppercase opacity-60">{opt})</span>
                  {t(`games.quiz.${current.id}.opt_${opt}`)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "completed" && (
        <div
          role="status"
          className="rounded-soft border border-muted-gold/30 bg-accent/10 p-4 text-center"
        >
          <p className="font-display text-xl text-accent">{t("games.complete")}</p>
          <p className="mt-2 text-sm opacity-80">
            {t("games.quiz.resultLine", { correct: correctCount, total })}
          </p>
          <p className="mt-1 text-sm opacity-80">
            {t("games.scoreLabel")}: <span className="font-display text-on-surface">{score}</span>
          </p>
        </div>
      )}
    </GameShell>
  );
}
