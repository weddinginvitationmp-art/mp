import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { wedding } from "@/config/wedding";
import { motion } from "framer-motion";
import { EventCard } from "./event-card";

function GoldOrnament() {
  return (
    <motion.div
      className="mx-auto my-8 flex items-center justify-center gap-4 opacity-80 group"
      initial={false}
      whileHover={{ opacity: 100 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left line */}
      <motion.div
        className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]"
        whileHover={{ width: 24 }}
        transition={{ duration: 0.3 }}
      />

      {/* Center star */}
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        className="text-[#D4AF37] flex-shrink-0"
        aria-hidden="true"
        whileHover={{ rotate: 180, scale: 1.2 }}
        transition={{ duration: 0.5 }}
      >
        <path d="M8 0L9.8 6.2H16L11 10l1.8 6L8 12.4 3.2 16 5 10 0 6.2h6.2z" fill="currentColor" />
      </motion.svg>

      {/* Right line */}
      <motion.div
        className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]"
        whileHover={{ width: 24 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export function Events({ index }: { index?: number }) {
  return (
    <SectionShell id="events" index={index}>
      <SectionHeading eyebrowKey="events.eyebrow" titleKey="events.title" index={index} />
      <GoldOrnament />
      <motion.div
        className="grid gap-8 md:grid-cols-2 md:items-stretch"
        initial={false}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          show: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {wedding.events.map((event, idx) => (
          <motion.div
            key={event.kind}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
