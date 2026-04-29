import { supabase } from "@/lib/supabase";
import { ensureGuestId } from "@/lib/ensure-guest";
import type { Database } from "@/types/database";
import type { RsvpFormValues } from "@/sections/rsvp/rsvp-schema";

type RsvpRow = Database["public"]["Tables"]["rsvp"]["Row"];

const GUEST_SLUG_KEY = "wi.guestSlug";

export function getSavedGuestSlug(): string | null {
  try {
    return localStorage.getItem(GUEST_SLUG_KEY);
  } catch {
    return null;
  }
}

function saveGuestSlug(slug: string): void {
  try {
    localStorage.setItem(GUEST_SLUG_KEY, slug);
  } catch {
    // localStorage unavailable
  }
}

export interface SubmitContext {
  guestId: string | null;
  slug: string | null;
}

export type SubmitResult =
  | { ok: true; rsvp: RsvpRow; guestId: string }
  | { ok: false; error: string };

/**
 * Two-step write:
 *   1. If no known guest, INSERT into guests (anon-allowed via 0003 migration).
 *   2. UPSERT rsvp keyed by guest_id (UNIQUE constraint).
 */
export async function submitRsvp(
  values: RsvpFormValues,
  ctx: SubmitContext,
): Promise<SubmitResult> {
  const gr = await ensureGuestId(ctx.guestId, ctx.slug, values.fullName);
  if ("error" in gr) return { ok: false, error: gr.error };
  const guestId = gr.guestId;

  saveGuestSlug(gr.guestSlug);

  const { data: rsvp, error } = await supabase
    .from("rsvp")
    .upsert(
      {
        guest_id: guestId,
        status: values.status,
        party_size: values.partySize,
        dietary_restrictions: values.dietaryRestrictions || null,
        song_request: values.songRequest || null,
        special_requests: values.specialRequests || null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- hand-written DB types lack Insert inference
      } as any,
      { onConflict: "guest_id" },
    )
    .select()
    .single();

  if (error || !rsvp) return { ok: false, error: error?.message ?? "rsvp upsert failed" };
  return { ok: true, rsvp: rsvp as RsvpRow, guestId };
}

/**
 * Fetch any existing RSVP for a known guest. Used to render the
 * "already responded" summary on revisit.
 */
export async function fetchRsvpForGuest(guestId: string): Promise<RsvpRow | null> {
  const { data } = await supabase
    .from("rsvp")
    .select("*")
    .eq("guest_id", guestId)
    .maybeSingle();
  return data;
}
