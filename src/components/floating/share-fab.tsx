import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShareSheet } from "@/components/share/share-sheet";
import { FabButton } from "./fab-button";

export function ShareFab() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <FabButton aria-label={t("floating.share")} onClick={() => setOpen(true)}>
        <span aria-hidden="true" className="text-base">
          ↗
        </span>
      </FabButton>
      <ShareSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
