import { supabase } from "@/lib/supabase";
import { ensureGuestId } from "@/lib/ensure-guest";
import type { Database } from "@/types/database";

type WishRow = Database["public"]["Tables"]["wishes"]["Row"];

export interface FeedWish {
  id: string;
  message: string;
  created_at: string;
  guestName: string;
  is_pinned: boolean;
}

export interface SubmitWishInput {
  fullName: string;
  message: string;
}

export interface SubmitWishContext {
  guestId: string | null;
  slug: string | null;
}

export type SubmitWishResult =
  | { ok: true; wish: FeedWish }
  | { ok: false; error: string };

export async function submitWish(
  input: SubmitWishInput,
  ctx: SubmitWishContext,
): Promise<SubmitWishResult> {
  const gr = await ensureGuestId(ctx.guestId, ctx.slug, input.fullName);
  if ("error" in gr) return { ok: false, error: gr.error };

  const { data, error } = await supabase
    .from("wishes")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- hand-written DB types lack Insert inference
    .insert({ guest_id: gr.guestId, message: input.message } as any)
    .select()
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "wish insert failed" };

  const row = data as WishRow & { is_pinned?: boolean };
  return {
    ok: true,
    wish: {
      id: row.id,
      message: row.message,
      created_at: row.created_at,
      guestName: input.fullName,
      is_pinned: row.is_pinned ?? false,
    },
  };
}
