import { useTranslation } from "react-i18next";

interface Props {
  attending: boolean;
  onEdit: () => void;
}

export function RsvpSuccess({ attending, onEdit }: Props) {
  const { t } = useTranslation();
  return (
    <div className="rounded-soft border border-muted-gold/30 bg-accent/5 p-8 text-center">
      <p className="font-display text-3xl">{t(attending ? "rsvp.success.attending" : "rsvp.success.regret")}</p>
      <p className="mt-3 opacity-70">{t("rsvp.success.thanks")}</p>
      <button
        type="button"
        onClick={onEdit}
        className="mt-6 text-xs uppercase tracking-[0.3em] text-accent underline-offset-4 hover:underline"
      >
        {t("rsvp.buttons.editResponse")}
      </button>
    </div>
  );
}
