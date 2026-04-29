import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";

/**
 * Shared helper: resolve or create a guest row.
 * Used by RSVP (Phase 4) and Wishes (Phase 5).
 *
 * Returns `{ guestId }` on success, `{ error }` on DB failure.
 */
export async function ensureGuestId(
  knownGuestId: string | null,
  slug: string | null,
  fullName: string,
): Promise<{ guestId: string; guestSlug: string } | { error: string }> {
  if (knownGuestId && slug) return { guestId: knownGuestId, guestSlug: slug };

  if (knownGuestId) {
    const { data } = await supabase
      .from("guests")
      .select("guest_slug")
      .eq("id", knownGuestId)
      .maybeSingle();
    return { guestId: knownGuestId, guestSlug: (data as { guest_slug: string } | null)?.guest_slug ?? slugify(fullName) };
  }

  const finalSlug = slug ?? slugify(fullName);
  const { data, error } = await supabase
    .from("guests")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- hand-written DB types lack Insert inference
    .insert({ guest_slug: finalSlug, full_name: fullName, language: "vi" } as any)
    .select("id")
    .single();
  if (error || !data) return { error: error?.message ?? "guest insert failed" };
  return { guestId: (data as { id: string }).id, guestSlug: finalSlug };
}
