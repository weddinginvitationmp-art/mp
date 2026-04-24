import { wedding } from "@/config/wedding";
import { buildInviteUrl } from "./og-url";
import type { ShareTarget } from "./share-tracking";

const COUPLE = `${wedding.bride.name} & ${wedding.groom.name}`;

function makeMessage(guestName: string | null, lang: "vi" | "en"): string {
  if (lang === "vi") {
    return guestName
      ? `${COUPLE} trân trọng kính mời ${guestName} đến chung vui ngày cưới của chúng mình.`
      : `${COUPLE} trân trọng kính mời bạn đến chung vui ngày cưới.`;
  }
  return guestName
    ? `${COUPLE} would love to have you, ${guestName}, at our wedding.`
    : `${COUPLE} would love to have you at our wedding.`;
}

export interface ShareContext {
  guestSlug: string | null;
  guestName: string | null;
  lang: "vi" | "en";
}

/**
 * Build the external URL for a given share target. `copy` and `native` are
 * handled in the click handler and don't have an external URL.
 */
export function buildShareTargetUrl(
  target: ShareTarget,
  ctx: ShareContext,
): { href?: string; message: string; inviteUrl: string } {
  const inviteUrl = buildInviteUrl(ctx.guestSlug, `share-${target}`);
  const message = makeMessage(ctx.guestName, ctx.lang);
  const encodedUrl = encodeURIComponent(inviteUrl);
  const encodedMsg = encodeURIComponent(`${message} ${inviteUrl}`);

  switch (target) {
    case "zalo":
      return { href: `https://zalo.me/share_inline?url=${encodedUrl}`, message, inviteUrl };
    case "whatsapp":
      return { href: `https://wa.me/?text=${encodedMsg}`, message, inviteUrl };
    case "copy":
    case "native":
      return { message, inviteUrl };
  }
}
