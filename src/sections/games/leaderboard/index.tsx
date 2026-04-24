import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, TabList, Tabs } from "@/components/common/tabs";
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

      <Tabs
        value={active}
        onChange={(v) => setActive(v as GameKind)}
        label={t("games.leaderboard.title")}
        className="mb-4 flex justify-center"
      >
        <TabList label={t("games.leaderboard.title")}>
          {GAMES.map((g) => (
            <Tab key={g} value={g}>
              {t(`games.${g}.title`)}
            </Tab>
          ))}
        </TabList>
      </Tabs>

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
