import { motion } from "framer-motion";

const DRAW = { hidden: { pathLength: 0 }, visible: { pathLength: 1 } };
const TRANSITION = { duration: 1.8, ease: [0.22, 1, 0.36, 1] as const };

export function OrnamentalFrame() {
  return (
    <motion.svg
      viewBox="0 0 320 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute inset-0 m-auto h-[90%] w-[90%] max-w-[380px] opacity-40"
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
      {/* Cloud scroll — top-left */}
      <motion.path
        d="M30 35 C35 28 42 28 48 32 C52 28 58 28 62 35 M30 35 C28 40 32 44 38 42"
        stroke="#D4AF37"
        strokeWidth="0.75"
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.5 }}
      />
      {/* Cloud scroll — top-right */}
      <motion.path
        d="M290 35 C285 28 278 28 272 32 C268 28 262 28 258 35 M290 35 C292 40 288 44 282 42"
        stroke="#D4AF37"
        strokeWidth="0.75"
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.5 }}
      />
      {/* Cloud scroll — bottom-left */}
      <motion.path
        d="M30 385 C35 392 42 392 48 388 C52 392 58 392 62 385 M30 385 C28 380 32 376 38 378"
        stroke="#D4AF37"
        strokeWidth="0.75"
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.5 }}
      />
      {/* Cloud scroll — bottom-right */}
      <motion.path
        d="M290 385 C285 392 278 392 272 388 C268 392 262 392 258 385 M290 385 C292 380 288 376 282 378"
        stroke="#D4AF37"
        strokeWidth="0.75"
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.5 }}
      />
      {/* Lotus — 5 petals */}
      {/* <motion.path
        d="M160 210 Q155 195 160 180 Q165 195 160 210
           M160 210 Q148 200 142 185 Q155 198 160 210
           M160 210 Q172 200 178 185 Q165 198 160 210
           M160 210 Q140 208 135 195 Q150 202 160 210
           M160 210 Q180 208 185 195 Q170 202 160 210"
        stroke="#D4AF37"
        strokeWidth="0.5"
        opacity={0.6}
        variants={DRAW}
        transition={{ ...TRANSITION, delay: 0.8 }}
      /> */}
    </motion.svg>
  );
}

export function GoldDivider() {
  return (
    <motion.div
      className="mx-auto my-2 sm:my-4 flex items-center gap-3"
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
