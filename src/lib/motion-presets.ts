/**
 * Centralized motion design tokens. All animations across the site
 * should reference these to keep the cinematic feel consistent.
 */

export const cinematicEase = [0.22, 1, 0.36, 1] as const;
export const gentleEase = [0.4, 0, 0.2, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: cinematicEase },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease: gentleEase } },
};

export const staggerParent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 0.2 },
  },
};

/**
 * Shared viewport config for scroll-triggered reveals.
 * `once: true` means the animation only fires the first time,
 * avoiding re-fires when the user scrolls back.
 */
export const revealViewport = { once: true, amount: 0.3 } as const;
