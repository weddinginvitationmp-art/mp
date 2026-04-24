import { lazy, Suspense, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { BottomSheet } from "@/components/common/bottom-sheet";
import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { useGuestContext } from "@/hooks/use-guest-context";
import { showToast } from "@/hooks/use-toast";
import { GamePicker } from "./game-picker";
import { Leaderboard } from "./leaderboard";
import type { GameKind } from "./types";
import { useGameScore } from "./use-game-score";

// Each game is its own chunk — only loaded when user picks it.
const MemoryGame = lazy(() => import("./memory").then((m) => ({ default: m.MemoryGame })));
const QuizGame = lazy(() => import("./quiz").then((m) => ({ default: m.QuizGame })));
const BouquetGame = lazy(() => import("./bouquet").then((m) => ({ default: m.BouquetGame })));

interface Props {
  index?: number;
}

export function Games({ index }: Props) {
  const { t } = useTranslation();
  const { guest } = useGuestContext();
  const [open, setOpen] = useState<GameKind | null>(null);

  // Re-use the submit primitive from one hook instance per active game.
  // We don't subscribe to leaderboard here — Leaderboard component owns its own.
  const memory = useGameScore("memory", guest?.id ?? null, { subscribe: false });
  const quiz = useGameScore("quiz", guest?.id ?? null, { subscribe: false });
  const bouquet = useGameScore("bouquet", guest?.id ?? null, { subscribe: false });

  const handleSubmit = useCallback(
    async (input: { game: GameKind; score: number; meta: Record<string, unknown> }) => {
      const submitter = input.game === "memory" ? memory : input.game === "quiz" ? quiz : bouquet;
      const prevBest = submitter.myBest;

      if (!guest?.id) {
        showToast(t("games.toast.needGuest"));
        return;
      }

      const result = await submitter.submit(input);
      if (result.error) {
        showToast(t("games.toast.submitFailed"));
        return;
      }
      if (prevBest === null || input.score > prevBest) {
        showToast(t("games.toast.newRecord"));
      } else {
        showToast(t("games.toast.scoreSaved"));
      }
    },
    [memory, quiz, bouquet, guest?.id, t],
  );

  const close = () => setOpen(null);

  return (
    <SectionShell id="games" index={index}>
      <SectionHeading
        eyebrowKey="games.eyebrow"
        titleKey="games.title"
        subtitleKey="games.subtitle"
        index={index}
      />

      <GamePicker onPick={setOpen} />

      <Leaderboard />

      <BottomSheet open={open !== null} onClose={close} title={open ? t(`games.${open}.title`) : undefined}>
        <Suspense fallback={<div className="min-h-[200px]" aria-hidden="true" />}>
          {open === "memory" && <MemoryGame onClose={close} onSubmit={handleSubmit} />}
          {open === "quiz" && <QuizGame onClose={close} onSubmit={handleSubmit} />}
          {open === "bouquet" && <BouquetGame onClose={close} onSubmit={handleSubmit} />}
        </Suspense>
      </BottomSheet>
    </SectionShell>
  );
}
