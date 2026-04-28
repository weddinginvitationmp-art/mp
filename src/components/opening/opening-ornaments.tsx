import { motion } from "framer-motion";

const DRAW = { hidden: { pathLength: 0 }, visible: { pathLength: 1 } };
const TRANSITION = { duration: 1.8, ease: [0.22, 1, 0.36, 1] as const };

export function OrnamentalFrame() {
  return (
    <motion.svg
      viewBox="0 0 320 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute inset-0 m-auto h-[85%] w-[85%] max-w-[320px] opacity-40"
      initial="hidden"
      animate="visible"
    >
      {/* Outer frame */}
      <motion.rect
        x="8"
        y="8"
        width="304"
        height="404"
        rx="4"
        stroke="#D4AF37"
        strokeWidth="1.5"
        variants={DRAW}
        transition={TRANSITION}
      />
      {/* Inner frame */}
      <motion.rect
        x="20"
        y="20"
        width="280"
        height="380"
        rx="2"
        stroke="#C9A876"
        strokeWidth="0.75"
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.3 }}
      />
      {/* Corner ornaments — top-left */}
      <motion.path
        d="M30 40 Q40 30 50 40 M30 40 Q40 50 50 40"
        stroke="#D4AF37"
        strokeWidth="0.75"
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.6 }}
      />
      {/* Corner ornaments — top-right */}
      <motion.path
        d="M270 40 Q280 30 290 40 M270 40 Q280 50 290 40"
        stroke="#D4AF37"
        strokeWidth="0.75"
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.6 }}
      />
      {/* Corner ornaments — bottom-left */}
      <motion.path
        d="M30 380 Q40 370 50 380 M30 380 Q40 390 50 380"
        stroke="#D4AF37"
        strokeWidth="0.75"
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.6 }}
      />
      {/* Corner ornaments — bottom-right */}
      <motion.path
        d="M270 380 Q280 370 290 380 M270 380 Q280 390 290 380"
        stroke="#D4AF37"
        strokeWidth="0.75"
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.6 }}
      />
      {/* Center lotus silhouette */}
      <motion.path
        d="M160 185 Q150 170 160 155 Q170 170 160 185 M160 185 Q145 175 140 160 Q155 170 160 185 M160 185 Q175 175 180 160 Q165 170 160 185"
        stroke="#D4AF37"
        strokeWidth="0.5"
        opacity={0.5}
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.9 }}
      />
    </motion.svg>
  );
}

export function GoldDivider() {
  return (
    <motion.div
      className="mx-auto my-4 flex items-center gap-3"
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.8, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="h-px w-10 bg-[#C9A876]/50" />
      <span className="text-[#D4AF37] text-xs">✦</span>
      <span className="h-px w-10 bg-[#C9A876]/50" />
    </motion.div>
  );
}
