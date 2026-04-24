import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { GameKind, LeaderboardRow, SubmitScoreInput } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any -- joined select not typed in hand-written DB mirror */

interface Api {
  leaderboard: LeaderboardRow[];
  loading: boolean;
  myBest: number | null;
  submit: (input: SubmitScoreInput) => Promise<{ error: string | null; rank: number | null }>;
}

/**
 * Fetch top-10 scores for a single game + subscribe to realtime inserts.
 * Also tracks the current guest's personal best for "new record" toast.
 */
export function useGameScore(game: GameKind, guestId: string | null): Api {
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [myBest, setMyBest] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    const { data } = await supabase
      .from("game_scores")
      .select("id, guest_id, score, meta, created_at, guests(full_name)")
      .eq("game", game)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(10);

    setLeaderboard(
      ((data ?? []) as any[]).map((r) => ({
        id: r.id,
        guest_id: r.guest_id,
        guest_name: r.guests?.full_name ?? "Khách",
        score: r.score,
        meta: r.meta ?? {},
        created_at: r.created_at,
      })),
    );
    setLoading(false);
  }, [game]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- subscribe pattern: initial fetch + realtime channel
    void refetch();

    const channel = supabase
      .channel(`game_scores:${game}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "game_scores", filter: `game=eq.${game}` },
        () => {
          void refetch();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [game, refetch]);

  // Personal best
  useEffect(() => {
    if (!guestId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- early init, no async in flight
      setMyBest(null);
      return;
    }
    void supabase
      .from("game_scores")
      .select("score")
      .eq("game", game)
      .eq("guest_id", guestId)
      .order("score", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setMyBest((data as { score?: number } | null)?.score ?? null);
      });
  }, [game, guestId]);

  const submit = useCallback<Api["submit"]>(
    async (input) => {
      if (!guestId) return { error: "no_guest", rank: null };

      const { error } = await supabase.from("game_scores").insert({
        guest_id: guestId,
        game: input.game,
        score: input.score,
        meta: input.meta ?? {},
      } as any);

      if (error) return { error: error.message, rank: null };

      // Update personal best optimistically
      setMyBest((prev) => (prev === null || input.score > prev ? input.score : prev));

      // Compute rank: count scores strictly greater than submitted
      const { count } = await supabase
        .from("game_scores")
        .select("id", { count: "exact", head: true })
        .eq("game", input.game)
        .gt("score", input.score);

      return { error: null, rank: (count ?? 0) + 1 };
    },
    [guestId],
  );

  return { leaderboard, loading, myBest, submit };
}
