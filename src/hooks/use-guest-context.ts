import { useContext } from "react";
import { GuestContext, type GuestContextValue } from "@/contexts/guest-context";

export function useGuestContext(): GuestContextValue {
  const ctx = useContext(GuestContext);
  if (!ctx) {
    throw new Error("useGuestContext must be used within <GuestProvider>");
  }
  return ctx;
}
