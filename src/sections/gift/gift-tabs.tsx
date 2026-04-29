import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, TabList, TabPanel, Tabs } from "@/components/common/tabs";
import { wedding } from "@/config/wedding";
import { GiftCard } from "./gift-card";

const memo = `Mung cuoi ${wedding.bride.name} & ${wedding.groom.name}`;

type TabId = "bride" | "groom";

/**
 * Mobile: one card at a time with sliding pill tabs.
 * Desktop: side-by-side grid (hidden above md, grid is in parent).
 */
export function GiftTabs({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const [active, setActive] = useState<TabId>("bride");

  return (
    <div className="md:hidden">
      <Tabs
        value={active}
        onChange={(v) => setActive(v as TabId)}
        label={t("gift.tabsLabel")}
        className="mb-6 flex justify-center"
      >
        <TabList label={t("gift.tabsLabel")}>
          <Tab value="bride">{wedding.gift.bride.name[lang]}</Tab>
          <Tab value="groom">{wedding.gift.groom.name[lang]}</Tab>
        </TabList>
      </Tabs>

      <Tabs value={active} onChange={(v) => setActive(v as TabId)} label={t("gift.tabsLabel")}>
        <TabPanel value="bride">
          <GiftCard account={wedding.gift.bride} memo={memo} compact={compact} />
        </TabPanel>
        <TabPanel value="groom">
          <GiftCard account={wedding.gift.groom} memo={memo} compact={compact} />
        </TabPanel>
      </Tabs>
    </div>
  );
}
