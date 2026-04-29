import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { useGuestContext } from "@/hooks/use-guest-context";
import { wedding } from "@/config/wedding";
import { GiftCard } from "./gift-card";
import { GiftEnvelope } from "./gift-envelope";
import { GiftTabs } from "./gift-tabs";

export function Gift({ index }: { index?: number }) {
  const { t } = useTranslation();
  const { guest, rsvpStatus } = useGuestContext();
  const memo = `Mung cuoi ${wedding.bride.name} & ${wedding.groom.name}`;
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  const hasGuest = !!guest;
  const showFull = !hasGuest || rsvpStatus === "attending";
  const showCompact = rsvpStatus === "not_attending";
  const showCta = hasGuest && !rsvpStatus;

  return (
    <SectionShell id="gift" index={index}>
      <SectionHeading
        eyebrowKey="gift.eyebrow"
        titleKey="gift.title"
        subtitleKey="gift.subtitle"
        index={index}
      />

      {showCta && (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="max-w-sm text-sm text-on-surface-muted">
            {t("gift.promptNoRsvp")}
          </p>
          <button
            type="button"
            onClick={() =>
              document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-full border border-accent px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-on-accent"
          >
            {t("gift.ctaRsvp")}
          </button>
        </div>
      )}

      {(showFull || showCompact) && !envelopeOpen && (
        <GiftEnvelope
          onOpen={() => setEnvelopeOpen(true)}
          compact={showCompact}
        />
      )}

      {(showFull || showCompact) && envelopeOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-accent">
            {showCompact ? t("gift.promptNotAttending") : t("gift.scanHint")}
          </p>

          <GiftTabs compact={showCompact} />
          <div className="hidden gap-6 md:grid md:grid-cols-2">
            <GiftCard account={wedding.gift.bride} memo={memo} compact={showCompact} />
            <GiftCard account={wedding.gift.groom} memo={memo} compact={showCompact} />
          </div>
        </motion.div>
      )}
    </SectionShell>
  );
}
