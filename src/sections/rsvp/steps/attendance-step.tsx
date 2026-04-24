import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import type { RsvpFormValues } from "../rsvp-schema";

interface Props {
  form: UseFormReturn<RsvpFormValues>;
}

/**
 * Step 1 — large radio cards for attending / not_attending.
 * Uses styled buttons (not native radios) for premium feel.
 */
export function AttendanceStep({ form }: Props) {
  const { t } = useTranslation();
  const status = form.watch("status");

  const cardBase =
    "rounded-soft border px-6 py-8 text-center transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-muted-gold/40 min-h-[120px] touch-action-manipulation active:scale-[0.98]";
  const cardSelected = "border-muted-gold bg-muted-gold/10";
  const cardIdle = "border-ivory/20 bg-ivory/5 hover:border-ivory/40 dark:bg-ink/30";

  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="mb-6 col-span-full text-center font-display text-2xl">
        {t("rsvp.attendance.q")}
      </legend>
      <button
        type="button"
        role="radio"
        aria-checked={status === "attending"}
        onClick={() => form.setValue("status", "attending", { shouldValidate: true })}
        className={`${cardBase} ${status === "attending" ? cardSelected : cardIdle}`}
      >
        <p className="font-display text-2xl">{t("rsvp.attendance.yes")}</p>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={status === "not_attending"}
        onClick={() => form.setValue("status", "not_attending", { shouldValidate: true })}
        className={`${cardBase} ${status === "not_attending" ? cardSelected : cardIdle}`}
      >
        <p className="font-display text-2xl">{t("rsvp.attendance.no")}</p>
      </button>
    </fieldset>
  );
}
