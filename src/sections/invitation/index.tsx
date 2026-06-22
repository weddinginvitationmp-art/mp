import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { wedding } from "@/config/wedding";
import { fadeUp, revealViewport } from "@/lib/motion-presets";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useGuestContext } from "@/hooks/use-guest-context";
import { InvitationFrame } from "./invitation-frame";

export function Invitation({ index }: { index?: number }) {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const { guest } = useGuestContext();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const { invitation } = wedding;

  const isFriend = guest?.relationship
    ? /bạn|đồng nghiệp|friend|colleague|Bạn bè|Em|Anh chị|Chị em/i.test(guest.relationship)
    : false;

  let relationshipText = "chúng mình"; // Default to a neutral term

  if (guest?.relationship) {
    if (/bạn|friend/i.test(guest.relationship)) {
      relationshipText = "chúng mình"; // Neutral and inclusive
    } else if (/Anh|Chị|Brother|Sister/i.test(guest.relationship)) {
      relationshipText = "chúng em"; // Neutral and inclusive
    } else if (/Em|Younger/i.test(guest.relationship)) {
      relationshipText = "anh chị"; // Neutral and inclusive
    }
  }
  const customInvitationText = `đến chung vui cùng ${relationshipText}`;

  const invitationSuffix = isFriend
    ? (lang === "vi" ? customInvitationText : "to celebrate our wedding day with us")
    : t("invitation.toAttend");

  return (
    <SectionShell id="invitation" index={index}>
      <SectionHeading eyebrowKey="invitation.eyebrow" titleKey="invitation.title" index={index} />

      <motion.div
        initial={reduced ? undefined : "hidden"}
        whileInView={reduced ? undefined : "show"}
        viewport={revealViewport}
        variants={reduced ? undefined : fadeUp}
      >
        <InvitationFrame>
          <div className="flex flex-col items-center text-center">
            {/* Double happiness */}
            <span className="text-3xl text-[#D4AF37]/70 select-none" aria-hidden="true">囍</span>

            {/* Parents */}
            <div className="mt-6 grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Groom family */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">{t("invitation.groomFamily")}</p>
                <p className="mt-2 text-sm opacity-80">{invitation.groomParents.father}</p>
                <p className="text-sm opacity-80">{invitation.groomParents.mother}</p>
              </div>
              {/* Bride family */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">{t("invitation.brideFamily")}</p>
                <p className="mt-2 text-sm opacity-80">{invitation.brideParents.father}</p>
                <p className="text-sm opacity-80">{invitation.brideParents.mother}</p>
              </div>
            </div>

            {/* Invitation text */}
            {guest ? (
              <div className="mt-8 flex flex-col items-center w-full max-w-sm px-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#C9A876]/80 font-sans">
                  {t("invitation.cordially")}
                </p>
                <div className="relative my-3 flex items-center justify-center py-2 px-8 w-full">
                  {/* Left ornament */}
                  <span className="absolute left-0 text-[#D4AF37]/80 text-xs">✦</span>
                  <span className="font-sans text-xl font-medium tracking-wide text-champagne bg-[#C9A876] bg-clip-text text-transparent filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.15)] text-center">
                    {guest.full_name}
                  </span>
                  {/* Right ornament */}
                  <span className="absolute right-0 text-[#D4AF37]/50 text-xs">✦</span>
                </div>
                <p className="text-xs leading-relaxed opacity-70 max-w-[260px] tracking-wide text-center">
                  {invitationSuffix}
                </p>
              </div>
            ) : (
              <p className="mt-8 text-sm leading-relaxed opacity-70 text-center max-w-md">
                {invitation.invitationText[lang]}
              </p>
            )}

            {/* Couple names */}
            <h2 className="mt-4 font-script text-3xl leading-tight sm:text-4xl">
              <span className="block sm:inline text-[#D4AF37]/70 whitespace-nowrap">{wedding.groom.name}</span>
              <span className="mx-2 block sm:inline text-lg text-[#D4AF37]/60 whitespace-nowrap">&amp;</span>
              <span className="block sm:inline text-[#D4AF37]/70 whitespace-nowrap">{wedding.bride.name}</span>
            </h2>

            {/* Gold divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px w-10 bg-[#D4AF37]/30" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]/50" />
              <div className="h-px w-10 bg-[#D4AF37]/30" />
            </div>

            {/* Date */}
            <p className="font-display text-lg">{wedding.dateDisplay[lang]}</p>
            <p className="mt-1 text-xs opacity-60">
              {t("invitation.lunarDate")}: {invitation.lunarDate[lang]}
            </p>
          </div>
        </InvitationFrame>
      </motion.div>
    </SectionShell>
  );
}
