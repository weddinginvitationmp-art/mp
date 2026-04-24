import { supabase } from "@/lib/supabase";

export const SHARE_TARGETS = ["zalo", "whatsapp", "copy", "native"] as const;
export type ShareTarget = (typeof SHARE_TARGETS)[number];

/**
 * Fire-and-forget insert into `guest_shares`. Failures are swallowed — tracking
 * should never block the user's share flow.
 */
export function logShare(target: ShareTarget, guestId: string | null): void {
  void supabase
    .from("guest_shares")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- hand-written DB mirror doesn't infer insert payloads
    .insert({ guest_id: guestId, target } as any)
    .then(() => undefined);
}

/** Extract the share attribution ref (e.g. "share-zalo") from the URL. */
export function readRefParam(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("ref");
}
