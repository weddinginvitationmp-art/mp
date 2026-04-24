import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Single source of truth for honoring `prefers-reduced-motion`.
 * Wraps Framer's hook so we can swap implementations later without churn.
 */
export const useReducedMotion = (): boolean => useFramerReducedMotion() ?? false;
