import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { WeddingEvent } from "@/config/wedding";
import { formatLongDate, formatTimeRange } from "@/lib/format-date";
import { fadeUp, revealViewport } from "@/lib/motion-presets";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AddToCalendar } from "./add-to-calendar";

interface Props {
  event: WeddingEvent;
}

export function EventCard({ event }: Props) {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";

  return (
    <motion.article
      className="flex flex-col rounded-soft border border-ivory/10 bg-ivory/5 p-6 sm:p-8 backdrop-blur-md dark:bg-ink/30"
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={revealViewport}
      variants={reduced ? undefined : fadeUp}
    >
      <p className="text-[11px] uppercase tracking-[0.4em] text-muted-gold">
        {t(`event.kind.${event.kind}`)}
      </p>
      <p className="mt-4 font-display text-3xl tabular-nums sm:text-4xl">
        {formatTimeRange(event.start, event.end, lang)}
      </p>
      <p className="mt-2 text-sm opacity-80">{formatLongDate(event.start, lang)}</p>
      <div className="mt-6 border-t border-ivory/10 pt-6">
        <p className="font-display text-xl">{event.venue[lang]}</p>
        <p className="mt-1 text-sm opacity-70">{event.address[lang]}</p>
      </div>
      <AddToCalendar event={event} />
    </motion.article>
  );
}
