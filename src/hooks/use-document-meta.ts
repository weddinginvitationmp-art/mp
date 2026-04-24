import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { wedding } from "@/config/wedding";
import { useGuestContext } from "@/hooks/use-guest-context";
import { applyMetaTags } from "@/lib/meta-tags";
import { buildInviteUrl, buildOgUrl } from "@/lib/og-url";

const COUPLE = `${wedding.bride.name} & ${wedding.groom.name}`;

/**
 * Keeps document title + OG meta tags in sync with the current guest + language.
 * Mounted once at the App root inside GuestProvider.
 */
export function useDocumentMeta(): void {
  const { guest, slug } = useGuestContext();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";

  useEffect(() => {
    const greeting = guest?.full_name
      ? lang === "vi"
        ? `— Mời ${guest.full_name}`
        : `— ${guest.full_name}`
      : "";
    const title = `${COUPLE} ${greeting}`.trim();
    const description =
      lang === "vi"
        ? `Trân trọng kính mời bạn đến chung vui ngày cưới của ${COUPLE}.`
        : `Join us as ${COUPLE} celebrate their wedding day.`;
    applyMetaTags({
      title,
      description,
      ogImage: buildOgUrl(slug ?? null, lang),
      url: buildInviteUrl(slug ?? null),
    });
  }, [guest, slug, lang]);
}
