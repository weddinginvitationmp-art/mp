import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { wedding } from "@/config/wedding";
import { useCountdown } from "@/hooks/use-countdown";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { fadeUp } from "@/lib/motion-presets";

const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * Glass-card countdown sitting below hero content.
 * - aria-live limited to seconds region to keep SR reads gentle.
 * - When the date has passed, shows a single celebratory line — no negative numbers.
 */
export function CountdownTimer() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const { days, hours, minutes, seconds, hasPassed } = useCountdown(wedding.date);

  if (hasPassed) {
    return (
      <p className="font-display text-xl text-ivory tracking-wide sm:text-2xl">
        {t("countdown.dayOf")}
      </p>
    );
  }

  const units: Array<{ value: string; label: string; live?: boolean }> = [
    { value: String(days), label: t("countdown.days", { count: days }) },
    { value: pad(hours), label: t("countdown.hours", { count: hours }) },
    { value: pad(minutes), label: t("countdown.minutes", { count: minutes }) },
    { value: pad(seconds), label: t("countdown.seconds", { count: seconds }), live: true },
  ];

  return (
    <motion.div
      className="flex items-stretch gap-2 rounded-soft border border-ivory/15 bg-ivory/5 px-4 py-3 backdrop-blur-md sm:gap-4 sm:px-6 sm:py-4"
      variants={reduced ? undefined : fadeUp}
    >
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex min-w-10 flex-col items-center px-1 sm:min-w-16 sm:px-2"
          aria-live={unit.live ? "polite" : undefined}
        >
          <span className="font-display text-3xl text-ivory tabular-nums sm:text-5xl">
            {unit.value}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-ivory/70 sm:text-xs">
            {unit.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
