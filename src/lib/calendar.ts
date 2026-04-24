/**
 * Add-to-calendar link builders. No library — string templates do it all.
 * All times emitted in UTC; calendar apps localize on the client.
 */

export interface CalendarEventSpec {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
}

/** Format: YYYYMMDDTHHMMSSZ (no punctuation). */
const toUtcBasic = (d: Date): string =>
  d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function buildGoogleCalendarUrl(e: CalendarEventSpec): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${toUtcBasic(e.start)}/${toUtcBasic(e.end)}`,
    details: e.description,
    location: e.location,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarUrl(e: CalendarEventSpec): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: e.title,
    body: e.description,
    location: e.location,
    startdt: e.start.toISOString(),
    enddt: e.end.toISOString(),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function escapeIcs(s: string): string {
  return s.replace(/([,;\\])/g, "\\$1").replace(/\r?\n/g, "\\n");
}

function buildIcs(e: CalendarEventSpec, uid: string): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//wedding-invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toUtcBasic(new Date())}`,
    `DTSTART:${toUtcBasic(e.start)}`,
    `DTEND:${toUtcBasic(e.end)}`,
    `SUMMARY:${escapeIcs(e.title)}`,
    `LOCATION:${escapeIcs(e.location)}`,
    `DESCRIPTION:${escapeIcs(e.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Trigger a .ics download. Works on desktop browsers; iOS Safari may
 * open inline which is acceptable (user taps "Add to Calendar" there).
 */
export function downloadIcs(e: CalendarEventSpec, filename: string): void {
  const uid = `${filename}-${e.start.getTime()}@haphuong-hoangminh`;
  const ics = buildIcs(e, uid);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
