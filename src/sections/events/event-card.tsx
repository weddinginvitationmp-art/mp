import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { WeddingEvent } from "@/config/wedding";
import { formatLongDate, formatTimeRange } from "@/lib/format-date";
import { fadeUp, revealViewport } from "@/lib/motion-presets";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AddToCalendar } from "./add-to-calendar";

function CeremonyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4AF37]" aria-hidden="true">
      <path d="M12 2C9.5 5 7 7.5 7 10.5a5 5 0 0010 0C17 7.5 14.5 5 12 2z" />
      <path d="M12 15.5v6M9 21.5h6" />
    </svg>
  );
}

function ReceptionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4AF37]" aria-hidden="true">
      <path d="M8 22h8M12 17v5M5 3l7 14L19 3" />
      <path d="M5 3h14" />
    </svg>
  );
}

interface Props {
  event: WeddingEvent;
}

export function EventCard({ event }: Props) {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";

  return (
    <motion.article
      className="relative flex flex-col overflow-hidden rounded-soft border border-border-subtle border-t-2 border-t-[#D4AF37] bg-surface-muted p-6 sm:p-8 backdrop-blur-md dark:bg-surface/30"
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={revealViewport}
      variants={reduced ? undefined : fadeUp}
    >
      {/* Decorative lotus corner */}
      <svg className="absolute right-3 top-3 h-8 w-8 text-[#D4AF37]/15" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4c2 4 6 7 6 12a6 6 0 01-12 0c0-5 4-8 6-12z" fill="currentColor" />
        <path d="M16 4c-1 3-2 5-1 8 1-3 2-5 1-8z" fill="currentColor" opacity="0.5" />
      </svg>

      {/* Kind label with icon */}
      <div className="flex items-center gap-2">
        {event.kind === "ceremony" ? <CeremonyIcon /> : <ReceptionIcon />}
        <p className="text-[11px] uppercase tracking-[0.4em] text-accent">
          {t(`event.kind.${event.kind}`)}
        </p>
      </div>

      {/* Time */}
      <p className="mt-4 font-display text-3xl tabular-nums sm:text-4xl">
        {formatTimeRange(event.start, event.end, lang)}
      </p>
      <p className="mt-2 text-sm opacity-80">{formatLongDate(event.start, lang)}</p>

      {/* Gold dot divider */}
      <div className="my-5 flex items-center gap-2">
        <div className="h-px flex-1 bg-[#D4AF37]/20" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]/50" />
        <div className="h-px flex-1 bg-[#D4AF37]/20" />
      </div>

      {/* Venue details */}
      <div>
        <p className="font-display text-xl">{event.venue[lang]}</p>
        <p className="mt-1 text-sm opacity-70">{event.address[lang]}</p>
        {event.venueDetail && (
          <p className="mt-1 text-xs opacity-60">{event.venueDetail}</p>
        )}
        {event.dressCode && (
          <p className="mt-2 text-xs">
            <span className="opacity-60">{t("event.dressCode")}: </span>
            <span className="font-medium">{event.dressCode}</span>
          </p>
        )}
        {event.parkingNote && (
          <p className="mt-1 text-xs opacity-60">{event.parkingNote}</p>
        )}
        {event.note && (
          <p className="mt-2 text-xs italic opacity-60">{event.note}</p>
        )}
      </div>

      {/* Timeline */}
      {event.timeline && event.timeline.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-border-subtle pt-4">
          {event.timeline.map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="min-w-[3rem] text-xs opacity-60 tabular-nums">{item.time}</span>
              <span className="opacity-80">{item.label[lang]}</span>
            </div>
          ))}
        </div>
      )}

      <AddToCalendar event={event} />
    </motion.article>
  );
}
