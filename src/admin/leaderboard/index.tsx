import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/button";
import { Tab, TabList, Tabs } from "@/components/common/tabs";
import { showToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";

/* eslint-disable @typescript-eslint/no-explicit-any -- joined select not typed */

type Game = "memory" | "quiz" | "bouquet";
const GAMES: Game[] = ["memory", "quiz", "bouquet"];

interface Score {
  id: string;
  score: number;
  meta: Record<string, unknown>;
  created_at: string;
  guest: { full_name: string } | null;
}

export function LeaderboardModule() {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState<Game>("memory");
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async (game: Game) => {
    setLoading(true);
    const { data } = await supabaseAdmin
      .from("game_scores")
      .select("id, score, meta, created_at, guests(full_name)")
      .eq("game", game)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(200);
    setScores(((data ?? []) as any[]).map((r) => ({
      id: r.id,
      score: r.score,
      meta: r.meta ?? {},
      created_at: r.created_at,
      guest: r.guests ? { full_name: r.guests.full_name } : null,
    })));
    setLoading(false);
  };

  useEffect(() => { // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch on tab change
    void refetch(active);
  }, [active]);

  const handleDelete = async (s: Score) => {
    if (!confirm(t("admin.leaderboard.deleteConfirm"))) return;
    const { error } = await supabaseAdmin.from("game_scores").delete().eq("id", s.id);
    if (error) showToast(t("admin.common.error"));
    else { showToast(t("admin.common.deleted")); await refetch(active); }
  };

  const handleResetGame = async () => {
    const typed = prompt(t("admin.leaderboard.resetPrompt", { game: active }));
    if (typed !== active) {
      if (typed !== null) showToast(t("admin.leaderboard.resetMismatch"));
      return;
    }
    const { error } = await supabaseAdmin.from("game_scores").delete().eq("game", active);
    if (error) showToast(t("admin.common.error"));
    else { showToast(t("admin.leaderboard.resetDone")); await refetch(active); }
  };

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Saigon" }).format(new Date(iso));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-xl text-on-surface">{t("admin.leaderboard.title")}</h2>
        <Button size="sm" variant="secondary" className="ml-auto" onClick={() => void handleResetGame()}>
          {t("admin.leaderboard.resetGame")}
        </Button>
      </div>

      <Tabs value={active} onChange={(v) => setActive(v as Game)} label={t("admin.leaderboard.title")}>
        <TabList label={t("admin.leaderboard.title")}>
          {GAMES.map((g) => <Tab key={g} value={g}>{t(`games.${g}.title`)}</Tab>)}
        </TabList>
      </Tabs>

      {loading && <p className="text-sm opacity-60">{t("admin.common.loading")}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-on-surface-muted">
            <tr>
              <th className="py-2 pr-4">#</th>
              <th className="py-2 pr-4">{t("admin.leaderboard.col.name")}</th>
              <th className="py-2 pr-4">{t("admin.leaderboard.col.score")}</th>
              <th className="py-2 pr-4">{t("admin.leaderboard.col.time")}</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {scores.map((s, i) => (
              <tr key={s.id} className="hover:bg-surface-muted">
                <td className="py-2 pr-4 opacity-60">{i + 1}</td>
                <td className="py-2 pr-4 font-medium">{s.guest?.full_name ?? "—"}</td>
                <td className="py-2 pr-4 font-display text-accent">{s.score}</td>
                <td className="py-2 pr-4 text-xs opacity-70">{fmt(s.created_at)}</td>
                <td className="py-2 pr-4 text-right">
                  <Button size="sm" variant="ghost" onClick={() => void handleDelete(s)}>
                    {t("admin.common.delete")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
