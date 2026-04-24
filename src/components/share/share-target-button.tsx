import { useTranslation } from "react-i18next";
import { useGuestContext } from "@/hooks/use-guest-context";
import { showToast } from "@/hooks/use-toast";
import { buildShareTargetUrl } from "@/lib/share-urls";
import { logShare, type ShareTarget } from "@/lib/share-tracking";

interface Props {
  target: ShareTarget;
  icon: string; // unicode glyph for now; swap to SVG later if desired
  onClose: () => void;
}

/**
 * One row in the share sheet. Handles platform-open + copy + native share dispatch.
 */
export function ShareTargetButton({ target, icon, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const { guest, slug } = useGuestContext();
  const lang: "vi" | "en" = i18n.language.startsWith("vi") ? "vi" : "en";

  const handleClick = async () => {
    const ctx = { guestSlug: slug, guestName: guest?.full_name ?? null, lang };
    const built = buildShareTargetUrl(target, ctx);

    logShare(target, guest?.id ?? null);

    if (target === "copy") {
      try {
        await navigator.clipboard.writeText(built.inviteUrl);
        showToast(t("share.copied"));
      } catch {
        showToast(t("share.copyFailed"));
      }
      onClose();
      return;
    }
    if (target === "native") {
      if (navigator.share) {
        try {
          await navigator.share({ title: built.message, url: built.inviteUrl });
        } catch {
          /* user cancelled */
        }
      }
      onClose();
      return;
    }
    if (built.href) {
      window.open(built.href, "_blank", "noopener,noreferrer");
      onClose();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center gap-3 rounded-soft border border-border-subtle bg-surface-muted px-4 py-3 text-left text-sm text-on-surface transition hover:border-muted-gold/40 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold/40 active:scale-[0.99] touch-action-manipulation min-h-[48px]"
    >
      <span aria-hidden="true" className="text-xl">
        {icon}
      </span>
      <span>{t(`share.targets.${target}`)}</span>
    </button>
  );
}
