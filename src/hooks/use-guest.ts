import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Guest = Database["public"]["Tables"]["guests"]["Row"];

interface GuestState {
  guest: Guest | null;
  loading: boolean;
}

/**
 * Fetch a guest record by URL slug. Returns null until loaded or if not found.
 */
export function useGuest(slug: string | null) {
  const [state, setState] = useState<GuestState>({ guest: null, loading: true });

  useEffect(() => {
    if (!slug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- early init, no async in flight
      setState({ guest: null, loading: false });
      return;
    }
    const controller = new AbortController();

    supabase
      .from("guests")
      .select("*")
      .eq("guest_slug", slug)
      .abortSignal(controller.signal)
      .maybeSingle()
      .then(({ data }) => {
        if (!controller.signal.aborted) {
          setState({ guest: data, loading: false });
        }
      });

    return () => controller.abort();
  }, [slug]);

  return state;
}
