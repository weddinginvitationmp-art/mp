import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { formatRelative } from "@/lib/relative-time";
import type { LeaderboardRow } from "../types";

interface Props {
  row: LeaderboardRow;
  rank: number;
  isMe: boolean;
}

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function LeaderboardRowItem({ row, rank, isMe }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const medal = MEDAL[rank];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 rounded-soft border px-3 py-2 text-sm ${
        isMe
          ? "border-muted-gold/50 bg-accent/10"
          : rank <= 3
            ? "border-muted-gold/20 bg-surface-muted"
            : "border-border-subtle"
      }`}
    >
      <span className="w-8 text-center font-display text-base text-accent">
        {medal ?? rank}
      </span>
      <span className="flex-1 truncate">{row.guest_name}</span>
      <span className="font-display text-on-surface">{row.score}</span>
      <span className="hidden sm:block w-20 text-right text-xs opacity-50">
        {formatRelative(row.created_at, lang)}
      </span>
    </motion.li>
  );
}
