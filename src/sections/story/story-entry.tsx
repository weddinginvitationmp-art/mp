import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { StoryMilestone } from "@/config/wedding";
import { formatMonthYear } from "@/lib/format-date";
import { fadeUp, revealViewport } from "@/lib/motion-presets";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Side = "left" | "right";

interface Props {
  milestone: StoryMilestone;
  side: Side;
}

/**
 * Single timeline entry. Desktop: occupies one side of the center spine.
 * Mobile: always left-aligned with the vertical rule.
 */
export function StoryEntry({ milestone, side }: Props) {
  const { i18n } = useTranslation();
  const reduced = useReducedMotion();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";

  const sideClasses =
    side === "left"
      ? "md:pr-[calc(50%+2rem)] md:text-right"
      : "md:pl-[calc(50%+2rem)] md:text-left";

  return (
    <motion.div
      className={`relative pl-9 md:pl-0 ${sideClasses}`}
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={revealViewport}
      variants={reduced ? undefined : fadeUp}
    >
      {/* Node on spine — left on mobile, centered on desktop */}
      <span
        aria-hidden="true"
        className="absolute left-5 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent ring-4 ring-ivory dark:ring-ink md:left-1/2"
      />
      <p className="font-display text-sm uppercase tracking-[0.3em] text-accent">
        {formatMonthYear(milestone.date, lang)}
      </p>
      <h3 className="mt-2 font-display text-2xl sm:text-3xl">{milestone.title[lang]}</h3>
      <p className="mt-3 text-sm opacity-70 sm:text-base">{milestone.body[lang]}</p>
    </motion.div>
  );
}
