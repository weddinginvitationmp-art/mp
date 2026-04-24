import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { FormField, inputBaseClasses } from "../form-field";
import type { RsvpFormValues } from "../rsvp-schema";

interface Props {
  form: UseFormReturn<RsvpFormValues>;
}

const PARTY_OPTIONS = [1, 2, 3, 4] as const;

export function DetailsStep({ form }: Props) {
  const { t } = useTranslation();
  const { register, formState: { errors }, watch, setValue } = form;
  const partySize = watch("partySize");

  return (
    <div className="space-y-6">
      <FormField
        label={t("rsvp.fields.fullName")}
        htmlFor="rsvp-fullname"
        error={errors.fullName ? t(errors.fullName.message ?? "") : undefined}
      >
        <input
          id="rsvp-fullname"
          type="text"
          autoComplete="name"
          className={inputBaseClasses}
          {...register("fullName")}
        />
      </FormField>

      <FormField label={t("rsvp.fields.partySize")}>
        <div className="flex flex-wrap gap-2">
          {PARTY_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setValue("partySize", n, { shouldValidate: true })}
              className={`min-w-12 rounded-pill border px-4 py-2 text-sm transition ${
                partySize === n
                  ? "border-muted-gold bg-muted-gold/10"
                  : "border-ivory/20 bg-ivory/5 hover:border-ivory/40"
              }`}
            >
              {n}
            </button>
          ))}
          <input
            type="number"
            min={5}
            max={10}
            placeholder="5+"
            className={`${inputBaseClasses} max-w-24 py-2`}
            value={partySize > 4 ? partySize : ""}
            onChange={(e) => {
              const v = Number.parseInt(e.target.value, 10);
              if (!Number.isNaN(v)) setValue("partySize", v, { shouldValidate: true });
            }}
          />
        </div>
      </FormField>

      <FormField label={t("rsvp.fields.dietary")}>
        <textarea
          rows={3}
          placeholder={t("rsvp.fields.dietaryPlaceholder")}
          className={`${inputBaseClasses} resize-none`}
          {...register("dietaryRestrictions")}
        />
      </FormField>
    </div>
  );
}
