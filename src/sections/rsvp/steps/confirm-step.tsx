import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import type { RsvpFormValues } from "../rsvp-schema";

interface Props {
  form: UseFormReturn<RsvpFormValues>;
  onEdit: (step: number) => void;
}

export function ConfirmStep({ form, onEdit }: Props) {
  const { t } = useTranslation();
  const v = form.getValues();
  const attending = v.status === "attending";

  if (!attending) {
    return (
      <div className="rounded-soft border border-ivory/15 bg-ivory/5 p-6 text-center dark:bg-ink/30">
        <p className="font-display text-2xl">{t("rsvp.confirm.regret")}</p>
        <p className="mt-3 opacity-70">{t("rsvp.confirm.miss")}</p>
      </div>
    );
  }

  const rows: Array<[string, string | undefined, number]> = [
    [t("rsvp.fields.fullName"), v.fullName, 1],
    [t("rsvp.fields.partySize"), String(v.partySize), 1],
    [t("rsvp.fields.dietary"), v.dietaryRestrictions || "—", 1],
    [t("rsvp.fields.song"), v.songRequest || "—", 2],
    [t("rsvp.fields.message"), v.specialRequests || "—", 2],
  ];

  return (
    <div className="space-y-3 rounded-soft border border-ivory/15 bg-ivory/5 p-6 dark:bg-ink/30">
      <p className="mb-4 text-center font-display text-xl">{t("rsvp.confirm.review")}</p>
      <dl className="space-y-3">
        {rows.map(([label, val, step]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4 border-b border-ivory/10 pb-2 last:border-0"
          >
            <dt className="text-[11px] uppercase tracking-widest opacity-60">{label}</dt>
            <dd className="flex flex-1 items-baseline justify-end gap-3 text-right">
              <span className="opacity-90">{val}</span>
              <button
                type="button"
                onClick={() => onEdit(step)}
                className="text-[10px] uppercase tracking-widest text-muted-gold underline-offset-4 hover:underline"
              >
                {t("rsvp.buttons.edit")}
              </button>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
