import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { WeddingEvent } from "@/config/wedding";
import { formatLongDate, formatTimeRange } from "@/lib/format-date";
import { fadeUp, revealViewport } from "@/lib/motion-presets";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AddToCalendar } from "./add-to-calendar";

function CeremonyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4AF37]" aria-hidden="true">
      <path d="M12 2C9.5 5 7 7.5 7 10.5a5 5 0 0010 0C17 7.5 14.5 5 12 2z" />
      <path d="M12 15.5v6M9 21.5h6" />
    </svg>
  );
}

function ReceptionIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4AF37]" aria-hidden="true">
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
  const [showMap, setShowMap] = useState(false);
  const reduced = useReducedMotion();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";

    return (
    <motion.article
      className="group relative flex flex-col overflow-hidden rounded-soft border border-border-subtle bg-surface-muted p-6 sm:p-8 backdrop-blur-md dark:bg-surface/30 transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-lg hover:shadow-[#D4AF37]/10"
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={revealViewport}
      variants={reduced ? undefined : fadeUp}
      whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.2 } }}
    >
      {/* Gradient border top indicator */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Decorative corner element */}
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#D4AF37]/5 blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors duration-300" />

      {/* Kind label with icon */}
      <div className="relative flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#D4AF37]/8 group-hover:bg-[#D4AF37]/12 transition-colors duration-300">
          {["ceremony", "an_hoi", "vu_quy", "thanh_hon"].includes(event.kind) ? <CeremonyIcon /> : <ReceptionIcon />}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-semibold">
            {t(`event.kind.${event.kind}`)}
          </p>
          <div className="h-px w-12 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Time display - enhanced */}
      <div className="mt-5 relative">
        <p className="text-xs uppercase tracking-widest text-[#D4AF37]/70 mb-1">
          {t("event.time")}
        </p>
        <div className="inline-block">
          <p className="font-display text-4xl sm:text-5xl tabular-nums bg-[#D4AF37] bg-clip-text text-transparent group-hover:via-[#D4AF37] transition-all duration-300">
            {formatTimeRange(event.start, event.end, lang)}
          </p>
        </div>
      </div>

      {/* Date */}
      <p className="mt-2 text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        {formatLongDate(event.start, lang)}
      </p>

      {/* Enhanced divider */}
      <div className="my-6 relative">
        <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <div className="relative flex justify-center">
          <div className="h-2 w-2 rounded-full bg-[#D4AF37] group-hover:h-2.5 group-hover:w-2.5 transition-all duration-300" />
        </div>
      </div>

      {/* Venue details */}
      <div className="relative space-y-3">
        <div>
          <p className="font-display text-lg sm:text-xl group-hover:text-[#D4AF37] transition-colors duration-300">
            {event.venue[lang]}
          </p>
          <p className="mt-1 text-sm opacity-70 group-hover:opacity-90 transition-opacity duration-300">
            {event.address[lang]}
          </p>
        </div>

        {event.venueDetail && (
          <p className="text-xs opacity-60 group-hover:opacity-80 transition-opacity duration-300">
            {event.venueDetail}
          </p>
        )}

        {event.dressCode && (
          <div className="pt-2 border-t border-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 transition-colors duration-300">
            <p className="text-xs">
              <span className="opacity-60 group-hover:opacity-80 transition-opacity duration-300">{t("event.dressCode")}: </span>
              <span className="font-medium text-[#D4AF37]/90 group-hover:text-[#D4AF37] transition-colors duration-300">{event.dressCode}</span>
            </p>
          </div>
        )}

        {event.parkingNote && (
          <p className="text-xs opacity-60 group-hover:opacity-80 transition-opacity duration-300 italic">
            ??? {event.parkingNote}
          </p>
        )}

        {event.note && (
          <p className="text-xs italic opacity-60 group-hover:opacity-80 transition-opacity duration-300 pt-2 border-t border-[#D4AF37]/10">
            {event.note}
          </p>
        )}
      </div>

      {/* Timeline - enhanced */}
      {event.timeline && event.timeline.length > 0 && (
        <div className="mt-5 space-y-3 border-t border-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 pt-5 transition-colors duration-300">
          {event.timeline.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3 text-sm group/timeline"
              initial={reduced ? undefined : { opacity: 0, x: -10 }}
              whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={revealViewport}
            >
              <span className="min-w-[4rem] text-xs opacity-60 group-hover/timeline:opacity-100 group-hover/timeline:text-[#D4AF37] transition-all duration-300 tabular-nums font-semibold">
                {item.time}
              </span>
              <span className="opacity-80 group-hover/timeline:opacity-100 transition-opacity duration-300">
                {item.label[lang]}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Map button and inline iframe */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="rounded-lg border border-[#D4AF37]/30 px-4 py-2 text-xs uppercase tracking-wider bg-[#D4AF37]/5 hover:bg-[#D4AF37]/15 text-[#D4AF37] transition-all duration-300 font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20"
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={reduced ? undefined : { scale: 0.95 }}
          >
            {showMap
              ? (lang === "vi" ? "Ẩn bản đồ" : "Hide Map")
              : (lang === "vi" ? "Xem bản đồ" : "View Map")}
          </motion.button>
          <motion.a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#D4AF37]/30 px-4 py-2 text-xs uppercase tracking-wider bg-[#D4AF37]/5 hover:bg-[#D4AF37]/15 text-[#D4AF37] transition-all duration-300 font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20"
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={reduced ? undefined : { scale: 0.95 }}
          >
            {t("events.openInMaps")} ?
          </motion.a>
        </div>

        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 280 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden rounded-lg ring-2 ring-[#D4AF37]/20 w-full"
            >
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(event.mapQuery)}&output=embed`}
                title={event.venue[lang]}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="size-full border-0"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddToCalendar event={event} />
    </motion.article>
  );
}

