const DIVISORS = [60, 60, 24, 7, 4.34524, 12, Number.POSITIVE_INFINITY] as const;
const UNITS: Intl.RelativeTimeFormatUnit[] = [
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "year",
];

/**
 * Locale-aware "n minutes ago" formatter. Uses Intl — zero library cost.
 */
export function formatRelative(date: Date | string, lang: string): string {
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  let diff = (new Date(date).getTime() - Date.now()) / 1000;
  for (let i = 0; i < UNITS.length; i++) {
    if (Math.abs(diff) < DIVISORS[i]!) {
      return rtf.format(Math.round(diff), UNITS[i]!);
    }
    diff /= DIVISORS[i]!;
  }
  return rtf.format(Math.round(diff), "year");
}
