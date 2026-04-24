import { useTranslation } from "react-i18next";
import { BottomSheet } from "@/components/common/bottom-sheet";
import { ShareTargetButton } from "./share-target-button";

interface Props {
  open: boolean;
  onClose: () => void;
}

const HAS_NATIVE_SHARE = typeof navigator !== "undefined" && "share" in navigator;

export function ShareSheet({ open, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <BottomSheet open={open} onClose={onClose} title={t("share.title")}>
      <p className="mb-4 text-center text-xs uppercase tracking-[0.3em] opacity-60">
        {t("share.subtitle")}
      </p>
      <div className="flex flex-col gap-2">
        {HAS_NATIVE_SHARE && (
          <ShareTargetButton target="native" icon="📤" onClose={onClose} />
        )}
        <ShareTargetButton target="zalo" icon="💬" onClose={onClose} />
        <ShareTargetButton target="whatsapp" icon="🟢" onClose={onClose} />
        <ShareTargetButton target="copy" icon="🔗" onClose={onClose} />
      </div>
    </BottomSheet>
  );
}
