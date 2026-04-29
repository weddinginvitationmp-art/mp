import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { useGuestContext } from "@/hooks/use-guest-context";
import { wedding } from "@/config/wedding";
import { GiftCard } from "./gift-card";
import { GiftTabs } from "./gift-tabs";

export function Gift({ index }: { index?: number }) {
  const { t } = useTranslation();
  const { guest, rsvpStatus } = useGuestContext();
  const memo = `Mung cuoi ${wedding.bride.name} & ${wedding.groom.name}`;

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

      {(showFull || showCompact) && (
        <>
          <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-accent">
            {showCompact ? t("gift.promptNotAttending") : t("gift.scanHint")}
          </p>

          {showFull && (
            <>
              <GiftTabs />
              <div className="hidden gap-6 md:grid md:grid-cols-2">
                <GiftCard account={wedding.gift.bride} memo={memo} />
                <GiftCard account={wedding.gift.groom} memo={memo} />
              </div>
            </>
          )}

          {showCompact && (
            <>
              <GiftTabs compact />
              <div className="hidden gap-6 md:grid md:grid-cols-2">
                <GiftCard account={wedding.gift.bride} memo={memo} compact />
                <GiftCard account={wedding.gift.groom} memo={memo} compact />
              </div>
            </>
          )}
        </>
      )}
    </SectionShell>
  );
}
