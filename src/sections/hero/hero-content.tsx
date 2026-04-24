import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { wedding } from "@/config/wedding";
import { fadeUp, staggerParent } from "@/lib/motion-presets";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useGuestContext } from "@/hooks/use-guest-context";

/**
 * Hero foreground composition: eyebrow → bride → ampersand → groom → divider → date · city.
 * All chrome (eyebrow, scroll hint, day labels) goes through i18next; couple names
 * and the date string stay literal in `wedding.ts` to avoid double-translation.
 */
export function HeroContent() {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const { guest } = useGuestContext();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const variants = reduced ? undefined : staggerParent;
  const childVariants = reduced ? undefined : fadeUp;

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center text-center text-ivory"
      initial="hidden"
      animate="show"
      variants={variants}
    >
      {guest && (
        <motion.p
          className="mb-2 text-xs uppercase tracking-[0.4em] text-muted-gold"
          variants={childVariants}
        >
          {t("hero.personalGreeting", { name: guest.full_name })}
        </motion.p>
      )}
      <motion.p
        className="mb-6 text-xs uppercase tracking-[0.4em] opacity-70"
        variants={childVariants}
      >
        {t("hero.eyebrow")}
      </motion.p>

      <h1 className="font-display font-light leading-[1] max-w-[90vw]">
        <motion.span
          className="block text-[clamp(2.75rem,8vw,5.5rem)]"
          variants={childVariants}
        >
          {wedding.bride.name}
        </motion.span>
        <motion.span
          className="my-2 block text-[clamp(1.75rem,4vw,2.5rem)] font-medium text-muted-gold"
          variants={childVariants}
          aria-hidden="true"
        >
          &
        </motion.span>
        <motion.span
          className="block text-[clamp(2.75rem,8vw,5.5rem)]"
          variants={childVariants}
        >
          {wedding.groom.name}
        </motion.span>
      </h1>

      <motion.div
        className="my-8 h-px w-16 bg-muted-gold/60"
        variants={childVariants}
        aria-hidden="true"
      />

      <motion.p
        className="text-xs uppercase tracking-[0.4em] opacity-80 sm:text-sm"
        variants={childVariants}
      >
        {wedding.dateDisplay[lang]} · {wedding.city[lang]}
      </motion.p>
    </motion.div>
  );
}
