import { useTranslation } from "react-i18next";
import type { FeedWish } from "@/lib/wishes";
import { WishItem } from "./wish-item";

interface Props {
  wishes: FeedWish[];
  loading: boolean;
}

export function WishFeed({ wishes, loading }: Props) {
  const { t } = useTranslation();

  if (loading) {
    return <p className="py-8 text-center text-sm opacity-50">…</p>;
  }

  if (wishes.length === 0) {
    return <p className="py-8 text-center text-sm opacity-50">{t("wishes.empty")}</p>;
  }

  const sorted = [...wishes].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <ul className="mt-8 max-h-[560px] overflow-y-auto pr-2">
      {sorted.map((w) => (
        <WishItem key={w.id} wish={w} />
      ))}
    </ul>
  );
}
