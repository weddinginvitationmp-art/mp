import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { wedding } from "@/config/wedding";
import { EventCard } from "./event-card";
import { VenueMap } from "./venue-map";

export function Events({ index }: { index?: number }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const reception = wedding.events.find((e) => e.kind === "reception") ?? wedding.events[0]!;

  return (
    <SectionShell id="events" index={index}>
      <SectionHeading eyebrowKey="events.eyebrow" titleKey="events.title" index={index} />
      <div className="grid gap-6 md:grid-cols-2">
        {wedding.events.map((event) => (
          <EventCard key={event.kind} event={event} />
        ))}
      </div>
      <VenueMap query={reception.mapQuery} label={`${reception.venue[lang]} — ${t("events.title")}`} />
    </SectionShell>
  );
}
