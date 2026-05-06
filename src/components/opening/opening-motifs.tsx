import { motion } from "framer-motion";

const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

export function DoubleHappiness({ delay = 0.8 }: { delay?: number }) {
  return (
    <motion.div
      className="double-happiness-pulse"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: EASE_CINEMATIC }}
    >
      <span
        className="block text-4xl font-bold select-none sm:text-5xl"
        style={{
          background: "linear-gradient(180deg, #F7E7CE 0%, #D4AF37 50%, #C9A876 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        aria-hidden="true"
      >
        囍
      </span>
    </motion.div>
  );
}

export function PhoenixDragon({ delay = 1.0 }: { delay?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 1.2, delay, ease: EASE_CINEMATIC }}
      aria-hidden="true"
    >
      {/* Phoenix (left) */}
      <motion.svg
        viewBox="0 0 64 80"
        className="h-20 w-16 text-[#D4AF37] sm:h-28 sm:w-20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, delay: delay + 0.2, ease: EASE_CINEMATIC }}
      >
        <motion.path
          d="M32 8 C24 12 16 20 16 32 C16 44 24 52 32 56 C28 48 26 40 28 32 C30 24 34 16 32 8z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: delay + 0.2, ease: EASE_CINEMATIC }}
        />
        <motion.path
          d="M32 8 C36 14 38 20 36 28 M16 32 C12 28 10 24 12 18 M32 56 C36 60 40 62 44 60"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: delay + 0.5, ease: EASE_CINEMATIC }}
        />
      </motion.svg>

      {/* Dragon (right) */}
      <motion.svg
        viewBox="0 0 64 80"
        className="h-20 w-16 -scale-x-100 text-[#D4AF37] sm:h-28 sm:w-20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, delay: delay + 0.2, ease: EASE_CINEMATIC }}
      >
        <motion.path
          d="M32 8 C24 12 16 20 16 32 C16 44 24 52 32 56 C28 48 26 40 28 32 C30 24 34 16 32 8z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: delay + 0.2, ease: EASE_CINEMATIC }}
        />
        <motion.path
          d="M32 8 C36 14 38 20 36 28 M16 32 C12 28 10 24 12 18 M32 56 C36 60 40 62 44 60"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: delay + 0.5, ease: EASE_CINEMATIC }}
        />
      </motion.svg>
    </motion.div>
  );
}
