import { useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGuestContext } from "@/hooks/use-guest-context";
import { rsvpSchema, type RsvpFormValues } from "./rsvp-schema";

/**
 * Owns the RHF instance for the entire RSVP flow.
 * Pre-fills name from guest context once it resolves.
 */
export function useRsvpForm(): UseFormReturn<RsvpFormValues> {
  const { guest } = useGuestContext();

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    mode: "onChange",
    defaultValues: {
      status: undefined as unknown as "attending",
      fullName: "",
      partySize: 1,
      dietaryRestrictions: "",
      songRequest: "",
      specialRequests: "",
    },
  });

  // Once guest resolves, pre-fill name if user hasn't typed yet.
  useEffect(() => {
    if (guest?.full_name && !form.getValues("fullName")) {
      form.setValue("fullName", guest.full_name);
    }
  }, [guest, form]);

  return form;
}
