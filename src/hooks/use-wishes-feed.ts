import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { FeedWish } from "@/lib/wishes";

/* eslint-disable @typescript-eslint/no-explicit-any -- relational select result not typed by hand-written DB mirror */

interface WishesFeedApi {
  wishes: FeedWish[];
  loading: boolean;
  addOptimistic: (wish: FeedWish) => void;
}

/**
 * Fetches last 50 wishes on mount, then subscribes to realtime INSERTs.
 * Deduplicates by id so an optimistic local insert isn't duplicated when
 * the server echoes back.
 *
 * Requires: Realtime must be enabled on `wishes` in Supabase dashboard.
 */
export function useWishesFeed(): WishesFeedApi {
  const [wishes, setWishes] = useState<FeedWish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data } = await supabase
        .from("wishes")
        .select("id, message, created_at, is_pinned, guests(full_name)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (cancelled) return;
      const mapped = (data ?? []).map((r: any) => ({
        id: r.id as string,
        message: r.message as string,
        created_at: r.created_at as string,
        is_pinned: r.is_pinned as boolean,
        guestName: (r.guests?.full_name as string | undefined) ?? "Khách",
      }));
      setWishes(mapped);
      setLoading(false);
    })();

    const channel = supabase
      .channel("public:wishes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wishes" },
        async (payload) => {
          const row = payload.new as {
            id: string;
            guest_id: string;
            message: string;
            created_at: string;
            is_pinned: boolean;
          };
          const { data: guest } = await supabase
            .from("guests")
            .select("full_name")
            .eq("id", row.guest_id)
            .maybeSingle();
          setWishes((prev) => {
            if (prev.some((w) => w.id === row.id)) return prev;
            return [
              {
                id: row.id,
                message: row.message,
                created_at: row.created_at,
                is_pinned: row.is_pinned ?? false,
                guestName: ((guest as { full_name?: string } | null)?.full_name) ?? "Khách",
              },
              ...prev,
            ];
          });
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, []);

  const addOptimistic = useCallback((wish: FeedWish) => {
    setWishes((prev) => (prev.some((w) => w.id === wish.id) ? prev : [wish, ...prev]));
  }, []);

  return { wishes, loading, addOptimistic };
}
