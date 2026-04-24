import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatRelative } from "@/lib/relative-time";
import type { FeedWish } from "@/lib/wishes";

const CLAMP_THRESHOLD = 200;

interface Props {
  wish: FeedWish;
}

export function WishItem({ wish }: Props) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const absolute = new Date(wish.created_at).toLocaleString(lang);
  const isLong = wish.message.length > CLAMP_THRESHOLD;
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="border-b border-ivory/10 py-4 last:border-0">
      <p className="flex items-baseline gap-3 text-sm">
        <span className="font-display text-base text-muted-gold">{wish.guestName}</span>
        <span className="text-[11px] opacity-50" title={absolute}>
          {formatRelative(wish.created_at, lang)}
        </span>
      </p>
      <p
        className={`mt-1 text-sm leading-relaxed opacity-80 ${
          isLong && !expanded ? "line-clamp-3" : ""
        }`}
      >
        {wish.message}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-[11px] uppercase tracking-widest text-muted-gold hover:opacity-80 touch-action-manipulation"
        >
          {expanded ? t("wishes.showLess") : t("wishes.showMore")}
        </button>
      )}
    </li>
  );
}
