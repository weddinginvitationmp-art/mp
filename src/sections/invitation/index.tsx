import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { wedding } from "@/config/wedding";
import { formatTime } from "@/lib/format-date";
import { fadeUp, revealViewport } from "@/lib/motion-presets";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useGuestContext } from "@/hooks/use-guest-context";
import { InvitationFrame } from "./invitation-frame";

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v4M16 3v4M4 9h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 21s5-4.5 5-9a5 5 0 10-10 0c0 4.5 5 9 5 9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function Invitation(_props: { index?: number }) {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const { guest } = useGuestContext();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const { invitation } = wedding;
  const ceremony = wedding.events.find((event) => event.kind === "tiec_nha_trai") ?? wedding.events[0]!;
  const eventInfo = [
    {
      icon: <ClockIcon />,
      label: "Thời gian",
      value: formatTime(ceremony.start, "vi-VN"),
      detail: ceremony.venue[lang],
    },
    {
      icon: <CalendarIcon />,
      label: "Ngày",
      value: wedding.dateDisplay[lang],
      detail: lang === "vi" ? "Ngày tổ chức chính" : "Main ceremony date",
    },
    {
      icon: <LocationIcon />,
      label: "Địa điểm",
      value: ceremony.address[lang],
      detail: ceremony.venue[lang],
    },
  ] as const;

  const isFriend = guest?.relationship
    ? /bạn|đồng nghiệp|friend|colleague/i.test(guest.relationship)
    : false;

  const invitationSuffix = isFriend
    ? (lang === "vi" ? "đến chung vui cùng chúng mình" : "to celebrate our wedding day with us")
    : t("invitation.toAttend");

  return (
    <section id="invitation" className="relative min-h-screen overflow-hidden section-sys-bg px-6 py-24 sm:py-32">
      <div className="absolute left-[-6rem] top-10 h-48 w-48 rounded-full border border-[#B22234]/10 opacity-5 motion-safe:animate-[invitation-orb-spin_32s_linear_infinite] sm:h-64 sm:w-64" />
      <div className="absolute bottom-10 right-[-5rem] h-56 w-56 rounded-full border border-[#B22234]/10 opacity-5 motion-safe:animate-[invitation-orb-spin_28s_linear_infinite] sm:h-72 sm:w-72" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-12rem)] max-w-7xl items-center justify-center">
        <motion.div
          className="w-full"
          initial={reduced ? false : { opacity: 0, y: 50 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <InvitationFrame>
            <div className="relative isolate text-center">
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-0 h-12 w-12 border-l-4 border-t-4 border-[#B22234]/25"
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
                viewport={revealViewport}
                transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute right-0 top-0 h-12 w-12 border-r-4 border-t-4 border-[#B22234]/25"
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
                viewport={revealViewport}
                transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 border-[#B22234]/25"
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
                viewport={revealViewport}
                transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 border-[#B22234]/25"
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
                viewport={revealViewport}
                transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />

              <div className="space-y-10">
                <motion.div
                  initial={reduced ? false : "hidden"}
                  whileInView={reduced ? undefined : "show"}
                  viewport={revealViewport}
                  variants={fadeUp}
                >
                  <p className="font-display text-xs uppercase tracking-[0.3em] text-[#B22234]/75 sm:text-sm">
                    TRÂN TRỌNG KÍNH MỜI
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-4">
                    <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#B22234]/60" />
                    <span className="h-px w-28 bg-gradient-to-r from-[#B22234]/20 via-[#B22234]/60 to-[#B22234]/20" />
                    <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#B22234]/60" />
                  </div>
                </motion.div>

                <motion.div
                  initial={reduced ? false : "hidden"}
                  whileInView={reduced ? undefined : "show"}
                  viewport={revealViewport}
                  variants={fadeUp}
                  className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6"
                >
                  <span className="font-script text-5xl leading-none text-[#B22234] sm:text-6xl lg:text-7xl">
                    {wedding.groom.name}
                  </span>
                  <span className="font-display text-2xl text-[#B22234]/60 sm:text-3xl">&amp;</span>
                  <span className="font-script text-5xl leading-none text-[#B22234] sm:text-6xl lg:text-7xl">
                    {wedding.bride.name}
                  </span>
                </motion.div>

                <motion.div
                  initial={reduced ? false : "hidden"}
                  whileInView={reduced ? undefined : "show"}
                  viewport={revealViewport}
                  variants={fadeUp}
                  className="mx-auto grid max-w-2xl gap-5 text-left sm:gap-6"
                >
                  {eventInfo.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-4 rounded-2xl border border-[#B22234]/10 bg-white/90 p-4 shadow-[0_18px_50px_rgba(178,34,52,0.08)] sm:p-5"
                    >
                      <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#B22234] text-white shadow-lg shadow-[#B22234]/20">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.32em] text-[#7f5257]">
                          {item.label}
                        </p>
                        <p className="mt-1 font-playfair text-lg text-[#1f1517] sm:text-xl">
                          {item.value}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[#6b5a5d]">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={reduced ? false : "hidden"}
                  whileInView={reduced ? undefined : "show"}
                  viewport={revealViewport}
                  variants={fadeUp}
                  className="mx-auto max-w-2xl"
                >
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#B22234]/35 to-transparent" />
                  <p className="mt-5 text-lg italic leading-relaxed text-[#6e5c5e] sm:text-xl">
                    {guest ? invitationSuffix : invitation.invitationText[lang]}
                  </p>
                </motion.div>

                {guest ? (
                  <motion.p
                    initial={reduced ? false : "hidden"}
                    whileInView={reduced ? undefined : "show"}
                    viewport={revealViewport}
                    variants={fadeUp}
                    className="mx-auto max-w-xl text-sm leading-relaxed tracking-wide text-[#7c686b]"
                  >
                    <span className="font-display tracking-[0.28em] text-[#B22234]">{guest.full_name}</span>
                  </motion.p>
                ) : null}
              </div>
            </div>
          </InvitationFrame>
        </motion.div>
      </div>
    </section>
  );
}
