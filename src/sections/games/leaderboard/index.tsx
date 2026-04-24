import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGuestContext } from "@/hooks/use-guest-context";
import type { GameKind } from "../types";
import { useGameScore } from "../use-game-score";
import { LeaderboardRowItem } from "./leaderboard-row";

const GAMES: GameKind[] = ["memory", "quiz", "bouquet"];

/**
 * Top-10 per game with live realtime updates.
 * Tabs switch game without remounting the surrounding section.
 */
export function Leaderboard() {
  const { t } = useTranslation();
  const { guest } = useGuestContext();
  const [active, setActive] = useState<GameKind>("memory");
  const { leaderboard, loading } = useGameScore(active, guest?.id ?? null);

  return (
    <div className="mt-10">
      <h4 className="mb-4 text-center text-xs uppercase tracking-[0.3em] opacity-60">
        {t("games.leaderboard.title")}
      </h4>

      <div
        role="tablist"
        aria-label={t("games.leaderboard.title")}
        className="mb-4 flex justify-center gap-2"
      >
        {GAMES.map((g) => (
          <button
            key={g}
            role="tab"
            aria-selected={active === g}
            type="button"
            onClick={() => setActive(g)}
            className={`min-h-[36px] rounded-pill px-4 py-1.5 text-xs uppercase tracking-widest transition touch-action-manipulation ${
              active === g
                ? "bg-muted-gold text-ink"
                : "border border-ivory/15 text-ivory hover:bg-ivory/5"
            }`}
          >
            {t(`games.${g}.title`)}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-center text-sm opacity-50">{t("games.leaderboard.loading")}</p>
      )}

      {!loading && leaderboard.length === 0 && (
        <p className="text-center text-sm opacity-60">{t("games.leaderboard.empty")}</p>
      )}

      <ul aria-live="polite" className="flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {leaderboard.map((row, i) => (
            <LeaderboardRowItem
              key={row.id}
              row={row}
              rank={i + 1}
              isMe={guest?.id === row.guest_id}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
