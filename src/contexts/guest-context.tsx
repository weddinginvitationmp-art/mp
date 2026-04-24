import { createContext, useMemo, type ReactNode } from "react";
import { useGuest } from "@/hooks/use-guest";
import type { Database } from "@/types/database";

type Guest = Database["public"]["Tables"]["guests"]["Row"];

export interface GuestContextValue {
  guest: Guest | null;
  slug: string | null;
  loading: boolean;
}

export const GuestContext = createContext<GuestContextValue | undefined>(undefined);

/**
 * Reads `?guest=` once at mount and exposes the resolved guest record (or null)
 * to the entire app. Hero, RSVP, and future personalized features all read from here
 * so we issue a single Supabase round-trip regardless of consumer count.
 */
export function GuestProvider({ children }: { children: ReactNode }) {
  const slug = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("guest");
  }, []);

  const { guest, loading } = useGuest(slug);

  const value = useMemo<GuestContextValue>(
    () => ({ guest, slug, loading }),
    [guest, slug, loading],
  );

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}
