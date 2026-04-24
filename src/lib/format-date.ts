/**
 * Locale-aware date/time formatting wrappers around Intl.DateTimeFormat.
 * All times normalized to Asia/Ho_Chi_Minh so guests see Saigon local time
 * regardless of their device timezone.
 */
const TZ = "Asia/Ho_Chi_Minh";

export const formatLongDate = (d: Date, lang: string): string =>
  new Intl.DateTimeFormat(lang, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: TZ,
  }).format(d);

export const formatMonthYear = (d: Date, lang: string): string =>
  new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "2-digit",
    timeZone: TZ,
  }).format(d);

export const formatTime = (d: Date, lang: string): string =>
  new Intl.DateTimeFormat(lang, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).format(d);

export const formatTimeRange = (start: Date, end: Date, lang: string): string =>
  `${formatTime(start, lang)} – ${formatTime(end, lang)}`;
