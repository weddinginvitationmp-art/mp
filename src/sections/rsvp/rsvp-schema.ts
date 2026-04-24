import { z } from "zod";

/**
 * Single Zod schema for the entire RSVP form. Step components validate
 * subsets of fields via RHF's `trigger(["fieldA", "fieldB"])`.
 *
 * Error messages use translation keys, not literal strings — the form layer
 * resolves them via i18next so VI/EN both work cleanly.
 */
export const rsvpSchema = z.object({
  // Step 1
  status: z.enum(["attending", "not_attending"], {
    message: "rsvp.errors.statusRequired",
  }),
  // Step 2 — required if attending
  fullName: z
    .string()
    .trim()
    .min(2, "rsvp.errors.nameTooShort")
    .max(255, "rsvp.errors.nameTooLong"),
  partySize: z.number().int().min(1).max(10),
  dietaryRestrictions: z.string().trim().max(500).optional(),
  // Step 3 — optional everywhere
  songRequest: z.string().trim().max(255).optional(),
  specialRequests: z.string().trim().max(1000).optional(),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;
