import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { useGuestContext } from "@/hooks/use-guest-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { submitRsvp, type SubmitResult } from "@/lib/rsvp";
import { cinematicEase } from "@/lib/motion-presets";
import { AttendanceStep } from "./steps/attendance-step";
import { DetailsStep } from "./steps/details-step";
import { MessageStep } from "./steps/message-step";
import { ConfirmStep } from "./steps/confirm-step";
import { RsvpProgress } from "./rsvp-progress";
import type { RsvpFormValues } from "./rsvp-schema";

interface Props {
  form: UseFormReturn<RsvpFormValues>;
  onSuccess: (result: Extract<SubmitResult, { ok: true }>) => void;
}

const FIELDS_PER_STEP: Array<(keyof RsvpFormValues)[]> = [
  ["status"],
  ["fullName", "partySize", "dietaryRestrictions"],
  ["songRequest", "specialRequests"],
  [],
];

export function RsvpStepper({ form, onSuccess }: Props) {
  const { t } = useTranslation();
  const { guest, slug } = useGuestContext();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const status = form.watch("status");
  const isNotAttending = status === "not_attending";
  const total = isNotAttending ? 2 : 4;
  const visibleStep = isNotAttending ? (step === 0 ? 0 : 1) : step;

  const scrollIntoView = () => {
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const goNext = async () => {
    const valid = await form.trigger(FIELDS_PER_STEP[step]);
    if (!valid) return;
    if (step === 0 && isNotAttending) setStep(3);
    else setStep((s) => Math.min(3, s + 1));
    scrollIntoView();
  };

  const goPrev = () => {
    if (step === 3 && isNotAttending) setStep(0);
    else setStep((s) => Math.max(0, s - 1));
    scrollIntoView();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const result = await submitRsvp(form.getValues(), {
      guestId: guest?.id ?? null,
      slug,
    });
    setSubmitting(false);
    if (result.ok) onSuccess(result);
    else setSubmitError(result.error);
  };

  const transition = reduced ? { duration: 0 } : { duration: 0.4, ease: cinematicEase };

  return (
    <div ref={sectionRef}>
      <RsvpProgress current={visibleStep} total={total} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={transition}
        >
          {step === 0 && <AttendanceStep form={form} />}
          {step === 1 && <DetailsStep form={form} />}
          {step === 2 && <MessageStep form={form} />}
          {step === 3 && <ConfirmStep form={form} onEdit={(s) => setStep(s)} />}
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <p role="alert" className="mt-4 text-center text-sm text-red-400/90">
          {t("rsvp.errors.submitFailed")}: {submitError}
        </p>
      )}

      {/* Sticky footer on mobile, static on sm+ */}
      <div
        className="
          sticky bottom-0 -mx-6 mt-8
          border-t border-ivory/10 bg-ivory/80 backdrop-blur-md
          px-6 py-4
          dark:bg-ink/80
          sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:backdrop-blur-none sm:pb-4
        "
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={goPrev}
              disabled={submitting}
              className="min-h-[44px] rounded-pill border border-ivory/20 px-5 py-2 text-xs uppercase tracking-widest transition hover:bg-ivory/5 disabled:opacity-30 touch-action-manipulation active:scale-[0.98]"
            >
              {t("rsvp.buttons.back")}
            </button>
          ) : (
            <span aria-hidden="true" />
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!status && step === 0}
              className="min-h-[44px] rounded-pill bg-muted-gold px-6 py-2 text-xs uppercase tracking-widest text-ink transition hover:bg-muted-gold/90 disabled:opacity-40 touch-action-manipulation active:scale-[0.98]"
            >
              {t("rsvp.buttons.next")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="min-h-[44px] rounded-pill bg-muted-gold px-6 py-2 text-xs uppercase tracking-widest text-ink transition hover:bg-muted-gold/90 disabled:opacity-40 touch-action-manipulation active:scale-[0.98]"
            >
              {submitting ? t("rsvp.buttons.submitting") : t("rsvp.buttons.submit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
