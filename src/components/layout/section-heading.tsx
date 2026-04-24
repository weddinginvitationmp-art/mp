import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { fadeUp, revealViewport, staggerParent } from "@/lib/motion-presets";

interface Props {
  eyebrowKey: string;
  titleKey: string;
  subtitleKey?: string;
  /** Scroll-order index; when provided, prefix the eyebrow with a zero-padded number (e.g. "01 /"). */
  index?: number;
}

/**
 * Standard section title block. Reads copy through i18n keys and
 * animates in once when scrolled into view (unless prefers-reduced-motion).
 *
 * When `index` is provided, renders "NN / EYEBROW" — the numeric prefix is
 * decorative and hidden from screen readers.
 */
export function SectionHeading({ eyebrowKey, titleKey, subtitleKey, index }: Props) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const indexLabel = index !== undefined ? index.toString().padStart(2, "0") : null;

  const eyebrow = (
    <>
      {indexLabel && (
        <span aria-hidden="true" className="text-accent">
          {indexLabel}
        </span>
      )}
      {indexLabel && <span aria-hidden="true" className="mx-2 opacity-40">/</span>}
      {t(eyebrowKey)}
    </>
  );

  if (reduced) {
    return (
      <header className="mb-16 text-center">
        <p className="text-xs uppercase tracking-[0.4em] opacity-60">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl">{t(titleKey)}</h2>
        {subtitleKey && <p className="mt-4 opacity-70">{t(subtitleKey)}</p>}
      </header>
    );
  }

  return (
    <motion.header
      className="mb-16 text-center"
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
      variants={staggerParent}
    >
      <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.4em] opacity-60">
        {eyebrow}
      </motion.p>
      <motion.h2 variants={fadeUp} className="mt-3 font-display text-4xl sm:text-5xl">
        {t(titleKey)}
      </motion.h2>
      {subtitleKey && (
        <motion.p variants={fadeUp} className="mt-4 opacity-70">
          {t(subtitleKey)}
        </motion.p>
      )}
    </motion.header>
  );
}
