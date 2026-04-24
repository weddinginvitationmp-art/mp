/**
 * Hand-rolled URL slug for open-RSVP guest creation.
 * Strips diacritics, normalizes whitespace, appends short random suffix.
 */
export function slugify(input: string): string {
  const base = input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "guest"}-${suffix}`;
}
