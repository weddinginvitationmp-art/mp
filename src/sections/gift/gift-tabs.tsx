import { useState } from "react";
import { useTranslation } from "react-i18next";
import { wedding } from "@/config/wedding";
import { GiftCard } from "./gift-card";

const memo = `Mung cuoi ${wedding.bride.name} & ${wedding.groom.name}`;

type Tab = "bride" | "groom";

/**
 * Mobile: one card at a time with pill-tab switcher.
 * Desktop: side-by-side grid (hidden above md, grid is in parent).
 */
export function GiftTabs() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const [active, setActive] = useState<Tab>("bride");

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "bride", label: wedding.gift.bride.name[lang] },
    { id: "groom", label: wedding.gift.groom.name[lang] },
  ];

  return (
    <div className="md:hidden">
      {/* Tab header */}
      <div
        role="tablist"
        aria-label={t("gift.tabsLabel")}
        className="mb-6 flex gap-2 justify-center"
      >
        {tabs.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`gift-panel-${tab.id}`}
              id={`gift-tab-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`rounded-pill px-5 py-2 text-xs uppercase tracking-widest transition touch-action-manipulation active:scale-[0.98] min-h-[44px] ${
                selected
                  ? "bg-muted-gold text-ink"
                  : "border border-ivory/20 text-ivory hover:bg-ivory/5"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`gift-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`gift-tab-${tab.id}`}
          hidden={active !== tab.id}
        >
          <GiftCard account={wedding.gift[tab.id]} memo={memo} />
        </div>
      ))}
    </div>
  );
}
