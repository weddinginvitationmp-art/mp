import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/layout/section-heading";
import { SectionShell } from "@/components/layout/section-shell";
import { wedding } from "@/config/wedding";
import { GiftCard } from "./gift-card";
import { GiftTabs } from "./gift-tabs";

export function Gift({ index }: { index?: number }) {
  const { t } = useTranslation();
  const memo = `Mung cuoi ${wedding.bride.name} & ${wedding.groom.name}`;

  return (
    <SectionShell id="gift" index={index}>
      <SectionHeading
        eyebrowKey="gift.eyebrow"
        titleKey="gift.title"
        subtitleKey="gift.subtitle"
        index={index}
      />
      <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-muted-gold">
        {t("gift.scanHint")}
      </p>

      {/* Mobile: tab switcher (one card at a time) */}
      <GiftTabs />

      {/* Desktop: side-by-side grid */}
      <div className="hidden md:grid gap-6 md:grid-cols-2">
        <GiftCard account={wedding.gift.bride} memo={memo} />
        <GiftCard account={wedding.gift.groom} memo={memo} />
      </div>
    </SectionShell>
  );
}
