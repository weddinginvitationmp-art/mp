import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { useGuestContext } from "@/hooks/use-guest-context";
import { fetchRsvpForGuest } from "@/lib/rsvp";
import type { Database } from "@/types/database";
import { RsvpStepper } from "./rsvp-stepper";
import { RsvpSuccess } from "./rsvp-success";
import { useRsvpForm } from "./use-rsvp-form";

type RsvpRow = Database["public"]["Tables"]["rsvp"]["Row"];

type View = "form" | "success";

export function Rsvp({ index }: { index?: number }) {
  const { guest } = useGuestContext();
  const form = useRsvpForm();
  const [view, setView] = useState<View>("form");
  const [existing, setExisting] = useState<RsvpRow | null>(null);

  // Returning-guest detection: if a known guest already RSVPed, hydrate the form.
  useEffect(() => {
    if (!guest?.id) return;
    let cancelled = false;
    void fetchRsvpForGuest(guest.id).then((rsvp) => {
      if (cancelled || !rsvp) return;
      setExisting(rsvp);
      setView("success");
    });
    return () => {
      cancelled = true;
    };
  }, [guest?.id]);

  return (
    <SectionShell id="rsvp" index={index}>
      <SectionHeading eyebrowKey="rsvp.eyebrow" titleKey="rsvp.title" index={index} />
      <div className="mx-auto max-w-xl">
        {view === "success" ? (
          <RsvpSuccess
            attending={(existing?.status ?? "attending") === "attending"}
            onEdit={() => setView("form")}
          />
        ) : (
          <RsvpStepper form={form} onSuccess={() => setView("success")} />
        )}
      </div>
    </SectionShell>
  );
}
