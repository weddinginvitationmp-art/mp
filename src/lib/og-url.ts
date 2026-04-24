import { env } from "./env";

export function buildOgUrl(guestSlug: string | null, lang: string): string {
  const base = env.siteUrl || "";
  const qs = new URLSearchParams();
  if (guestSlug) qs.set("guest", guestSlug);
  qs.set("lang", lang.startsWith("en") ? "en" : "vi");
  return `${base}/api/og?${qs.toString()}`;
}

/**
 * Build the public invite URL a recipient will land on after a share click.
 * `ref` is appended so we can attribute the traffic source.
 */
export function buildInviteUrl(guestSlug: string | null, ref?: string): string {
  const base = env.siteUrl || "";
  const qs = new URLSearchParams();
  if (guestSlug) qs.set("guest", guestSlug);
  if (ref) qs.set("ref", ref);
  const query = qs.toString();
  return query ? `${base}/?${query}` : base;
}
