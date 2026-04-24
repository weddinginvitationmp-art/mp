import { useTranslation } from "react-i18next";
import type { WeddingEvent } from "@/config/wedding";
import { wedding } from "@/config/wedding";
import {
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  downloadIcs,
  type CalendarEventSpec,
} from "@/lib/calendar";

interface Props {
  event: WeddingEvent;
}

/**
 * Inline button group for adding the event to the user's calendar.
 * Google + Outlook open in a new tab with the event prefilled;
 * Apple/other opens the .ics via download.
 */
export function AddToCalendar({ event }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";

  const spec: CalendarEventSpec = {
    title: `${wedding.bride.name} & ${wedding.groom.name} — ${t(`event.kind.${event.kind}`)}`,
    description: wedding.hashtag,
    location: `${event.venue[lang]}, ${event.address[lang]}`,
    start: event.start,
    end: event.end,
  };

  const filename = `haphuong-hoangminh-${event.kind}`;

  const btn =
    "rounded-pill border border-border-subtle px-3 py-1.5 text-[11px] uppercase tracking-widest transition hover:bg-surface-muted";

  return (
    <div className="mt-6 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <span className="mr-1 text-[11px] uppercase tracking-widest opacity-60">
        {t("calendar.add")}
      </span>
      <a className={btn} href={buildGoogleCalendarUrl(spec)} target="_blank" rel="noreferrer">
        {t("calendar.google")}
      </a>
      <a className={btn} href={buildOutlookCalendarUrl(spec)} target="_blank" rel="noreferrer">
        {t("calendar.outlook")}
      </a>
      <button type="button" className={btn} onClick={() => downloadIcs(spec, filename)}>
        {t("calendar.apple")}
      </button>
    </div>
  );
}
