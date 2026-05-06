import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { wedding } from "@/config/wedding";
import { EventCard } from "./event-card";
import { VenueMap } from "./venue-map";

function GoldOrnament() {
  return (
    <div className="mx-auto my-6 flex items-center gap-3 opacity-60">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
      <svg width="16" height="16" viewBox="0 0 16 16" className="text-[#D4AF37]" aria-hidden="true">
        <path d="M8 0L9.8 6.2H16L11 10l1.8 6L8 12.4 3.2 16 5 10 0 6.2h6.2z" fill="currentColor" />
      </svg>
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
    </div>
  );
}

export function Events({ index }: { index?: number }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const reception = wedding.events.find((e) => e.kind === "reception") ?? wedding.events[0]!;

  return (
    <SectionShell id="events" index={index}>
      <SectionHeading eyebrowKey="events.eyebrow" titleKey="events.title" index={index} />
      <GoldOrnament />
      <div className="grid gap-8 md:grid-cols-2 md:items-stretch">
        {wedding.events.map((event) => (
          <EventCard key={event.kind} event={event} />
        ))}
      </div>
      <VenueMap query={reception.mapQuery} label={`${reception.venue[lang]} — ${t("events.title")}`} />
    </SectionShell>
  );
}
