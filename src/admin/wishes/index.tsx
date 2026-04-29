import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/button";
import { showToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";

/* eslint-disable @typescript-eslint/no-explicit-any -- joined select not typed */

interface Wish {
  id: string;
  message: string;
  created_at: string;
  is_pinned: boolean;
  guest: { full_name: string } | null;
}

export function WishesModule() {
  const { t, i18n } = useTranslation();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    const { data } = await supabaseAdmin
      .from("wishes")
      .select("id, message, created_at, is_pinned, guests(full_name)")
      .order("created_at", { ascending: false })
      .limit(200);
    setWishes(((data ?? []) as any[]).map((r) => ({
      id: r.id,
      message: r.message,
      created_at: r.created_at,
      is_pinned: r.is_pinned ?? false,
      guest: r.guests ? { full_name: r.guests.full_name } : null,
    })));
    setLoading(false);
  };

  useEffect(() => { // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    void refetch();
  }, []);

  const handleDelete = async (w: Wish) => {
    if (!confirm(t("admin.wishes.deleteConfirm"))) return;
    const { error } = await supabaseAdmin.from("wishes").delete().eq("id", w.id);
    if (error) {
      showToast(t("admin.common.error"));
    } else {
      showToast(t("admin.common.deleted"));
      await refetch();
    }
  };

  const handleTogglePin = async (w: Wish) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- is_pinned not in hand-written DB types yet
    const { error } = await (supabaseAdmin.from("wishes") as any)
      .update({ is_pinned: !w.is_pinned })
      .eq("id", w.id);
    if (error) {
      showToast(t("admin.common.error"));
    } else {
      showToast(!w.is_pinned ? t("admin.wishes.pinned") : t("admin.wishes.unpinned"));
      await refetch();
    }
  };

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Saigon" }).format(new Date(iso));

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-on-surface">{t("admin.wishes.title")} <span className="text-xs opacity-60">({wishes.length})</span></h2>

      {loading && <p className="text-sm opacity-60">{t("admin.common.loading")}</p>}

      <ul className="space-y-2">
        {wishes.map((w) => (
          <li key={w.id} className={`rounded-soft border p-3 ${w.is_pinned ? "border-yellow-500/40 bg-yellow-500/5" : "border-border-subtle bg-surface-muted"}`}>
            <div className="flex items-center gap-2">
              {w.is_pinned && <span className="text-sm" title="Pinned">📌</span>}
              <span className="font-medium text-sm text-on-surface">{w.guest?.full_name ?? "—"}</span>
              <span className="text-xs opacity-60">· {fmt(w.created_at)}</span>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => void handleTogglePin(w)}
                  title={w.is_pinned ? t("admin.wishes.unpin") : t("admin.wishes.pin")}
                >
                  {w.is_pinned ? "📌" : "📍"}
                </Button>
                <Button size="sm" variant="ghost" className="ml-auto" onClick={() => void handleDelete(w)}>
                  {t("admin.common.delete")}
                </Button>
              </div>
            </div>
            <p className="mt-1 text-sm whitespace-pre-wrap">{w.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
