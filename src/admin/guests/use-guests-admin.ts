import { useCallback, useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Database } from "@/types/database";

type Guest = Database["public"]["Tables"]["guests"]["Row"];
type GuestInsert = Database["public"]["Tables"]["guests"]["Insert"];

/* eslint-disable @typescript-eslint/no-explicit-any -- hand-written mirror doesn't infer insert shapes */

export function useGuestsAdmin() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabaseAdmin
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });
    setGuests((data as Guest[] | null) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch pattern
    void refetch();
  }, [refetch]);

  const create = useCallback(async (input: GuestInsert) => {
    const { error } = await supabaseAdmin.from("guests").insert(input as any);
    if (!error) await refetch();
    return { error };
  }, [refetch]);

  const update = useCallback(async (id: string, patch: Partial<GuestInsert>) => {
    const { error } = await supabaseAdmin.from("guests").update(patch as never).eq("id", id);
    if (!error) await refetch();
    return { error };
  }, [refetch]);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabaseAdmin.from("guests").delete().eq("id", id);
    if (!error) await refetch();
    return { error };
  }, [refetch]);

  return { guests, loading, create, update, remove, refetch };
}
