import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useActiveSection } from "@/hooks/use-active-section";
import { useGuestContext } from "@/hooks/use-guest-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { fetchRsvpForGuest } from "@/lib/rsvp";
import { NAV_SECTIONS } from "@/lib/section-nav";
import { FabButton } from "./fab-button";

/**
 * Persistent "Confirm RSVP" pill. Hides when:
 * - user is already on #rsvp, OR
 * - user has already submitted an RSVP (known guest).
 */
export function RsvpCtaPill() {
  const { t } = useTranslation();
  const { guest } = useGuestContext();
  const reduced = useReducedMotion();
  const [hasResponded, setHasResponded] = useState(false);

  const ids = useMemo(() => NAV_SECTIONS.map((s) => s.id), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    if (!guest?.id) return;
    let cancelled = false;
    void fetchRsvpForGuest(guest.id).then((rsvp) => {
      if (!cancelled && rsvp) setHasResponded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [guest?.id]);

  if (active === "rsvp" || hasResponded) return null;

  const jump = () => {
    const el = document.getElementById("rsvp");
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <FabButton
      pill
      aria-label={t("common.rsvp")}
      onClick={jump}
      className="bg-accent text-on-accent border-transparent hover:bg-accent/90 hover:border-transparent font-display text-xs uppercase tracking-widest"
    >
      {t("common.rsvp")}
    </FabButton>
  );
}
