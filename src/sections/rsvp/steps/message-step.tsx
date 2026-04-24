import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { FormField, inputBaseClasses } from "../form-field";
import type { RsvpFormValues } from "../rsvp-schema";

interface Props {
  form: UseFormReturn<RsvpFormValues>;
}

export function MessageStep({ form }: Props) {
  const { t } = useTranslation();
  const { register } = form;

  return (
    <div className="space-y-6">
      <FormField label={t("rsvp.fields.song")}>
        <input
          type="text"
          placeholder={t("rsvp.fields.songPlaceholder")}
          className={inputBaseClasses}
          {...register("songRequest")}
        />
      </FormField>

      <FormField label={t("rsvp.fields.message")}>
        <textarea
          rows={5}
          placeholder={t("rsvp.fields.messagePlaceholder")}
          className={`${inputBaseClasses} resize-none`}
          {...register("specialRequests")}
        />
      </FormField>
    </div>
  );
}
